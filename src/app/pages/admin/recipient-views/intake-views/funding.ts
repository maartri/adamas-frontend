import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService,fundingDropDowns, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject,EMPTY } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

@Component({
    selector: '',
    styles: [`
    nz-select{
        width:100%
    }
    `],
    templateUrl: './funding.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IntakeFunding implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    dateFormat: string = 'dd/MM/yyyy';
    user: any;
    loading: boolean = false;
    postLoading: boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;
    tableData: Array<any> = [];
    packageDetailForm: FormGroup;
    programsNames: any;
    supplements: FormGroup;
    programLevel: any;
    period: string[];
    levels: string[];
    cycles: string[];
    budgetEnforcement: string[];
    alerts: string[];
    DefPeriod: string[];
    expireUsing: string[];
    unitsArray: string[];
    dailyArry: string[];
    visibleRecurrent: boolean = false;
    packageTerm: string[];
    status: string[];
    type: string[];
    fundingprioritylist: any;
    IS_CDC: boolean;
    
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef
        ) {
            cd.detach();
            
            this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data instanceof NavigationEnd) {
                    if (!this.sharedS.getPicked()) {
                        this.router.navigate(['/admin/recipient/personal'])
                    }
                }
            });
            
            this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (this.globalS.isCurrentRoute(this.router, 'funding')) {
                    this.user = data;
                    this.search(data);
                }
            });
        }
        
        ngOnInit(): void {
            this.user = this.sharedS.getPicked();
            this.search(this.user);
            this.buildForm();
        }
        
        ngOnDestroy(): void {
            this.unsubscribe.next();
            this.unsubscribe.complete();
        }
        
        trackByFn(index, item) {
            return item.id;
        }
        
        
        search(user: any = this.user) {
            this.cd.reattach();
            
            this.loading = true;
            this.timeS.getfunding(user.id).subscribe(data => {
                this.loading = false;
                this.tableData = data;
                this.cd.markForCheck();
            });
            this.dropDowns();
        }
        dropDowns(){
            this.timeS.getprogrampackages(this.user.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => this.programsNames = data)
            this.listS.getfundingprioritylist().pipe(takeUntil(this.unsubscribe)).subscribe(data => this.fundingprioritylist = data)
            
            console.log(this.programsNames);
            this.period = ['ANNUAL','MONTH','QUARTER'];
            this.levels = ['Level 1','Level 2','Level 3','Level 4','STRC'];
            this.cycles = fundingDropDowns.cycle;
            this.budgetEnforcement = ['HARD','SOFT'];
            this.alerts   = fundingDropDowns.alerts;
            this.packageTerm = fundingDropDowns.packageTerm;
            this.type = fundingDropDowns.type;
            this.status = fundingDropDowns.status;
            this.DefPeriod = fundingDropDowns.period;
            this.expireUsing   = fundingDropDowns.expireUsing;
            this.unitsArray    = fundingDropDowns.perUnit;
            this.levels        = fundingDropDowns.levels;
            this.dailyArry     = ['DAILY'];
        }
        buildForm() {
            this.packageDetailForm = this.formBuilder.group({
                personID:'',
                program:'',
                packageLevel:'',
                type:'',
                programStatus:'',
                expireUsing:'',
                priority:'',
                notes:'',
                expire_amount:'',
                expire_costType:'',
                expire_unit:'',
                expire_period:'',
                expire_length:'',
                p_alert_type:'',
                packg_balance:false,
                recurant:false,
                commencing_date:'',
                p_alert_period:'',
                totalAllocation:'',
                AP_YellowQty:'',
                AP_OrangeQty:'',
                AP_RedQty:'',
                shared:false,
                startDate:'',
                expiryDate:'',
                reminderDate:'',
                packageTermType:'',
                autoRenew:false,
                rolloverRemainder:false,
                deactivateOnExpiry:false,
                dailyBasicFee:'',
                monthlyBasicFee:'',
                dailyTestedFee:'$0.00',
                monthlyTestedFee:'$0.00',
                contingency:'',
                perDayBilling:'',
                currentlyBanked:'',
            });
            this.supplements = this.formBuilder.group({
                domentica:false,
                levelSupplement:'',
                oxygen:false,
                feedingSuplement:false,
                feedingSupplement:'',
                EACHD:false,
                viabilitySuplement:false,
                viabilitySupplement:'',
                financialSup:''
            });
            this.packageDetailForm.get('p_alert_type').valueChanges.subscribe(data => {
                this.packageDetailForm.get('recurant').enable()
            });
            this.packageDetailForm.get('commencing_date').valueChanges.subscribe(data => {
                if(this.globalS.isEmpty(data)){
                    this.packageDetailForm.get('totalAllocation').disable()
                    this.packageDetailForm.get('AP_RedQty').disable()
                    this.packageDetailForm.get('AP_OrangeQty').disable()
                    this.packageDetailForm.get('AP_YellowQty').disable()
                }else{
                    this.packageDetailForm.get('totalAllocation').enable()
                    this.packageDetailForm.get('AP_RedQty').enable()
                    this.packageDetailForm.get('AP_OrangeQty').enable()
                    this.packageDetailForm.get('AP_YellowQty').enable()
                }
            });
            
            this.packageDetailForm.get('program').valueChanges
            .pipe(
                switchMap(x => {
                    if(!x) return EMPTY;
                    return this.listS.getprogramlevel(x)
                }),
                switchMap(x => {                
                    this.IS_CDC = false;
                    if(x.isCDC){
                        this.IS_CDC = true;
                        var typeOpt = '';
                        if(x.user2 == 'Various'){
                            typeOpt = 'CDC-HCP';
                        }else{
                            typeOpt = x.user2;
                        }
                        this.type.push(typeOpt);
                        
                        this.packageDetailForm.get('packageLevel').disable()
                        this.packageDetailForm.controls.packageLevel.setValue(x.level);
                        this.packageDetailForm.get('expire_amount').disable()
                        this.packageDetailForm.controls.expire_amount.setValue(x.quantity);
                        this.packageDetailForm.get('type').disable()
                        this.packageDetailForm.controls.type.setValue(typeOpt);
                        this.packageDetailForm.get('expire_costType').disable()
                        this.packageDetailForm.controls.expire_costType.setValue('DOLLARS');
                        this.packageDetailForm.get('expire_unit').disable()
                        this.packageDetailForm.controls.expire_unit.setValue('PER');
                        this.packageDetailForm.get('expire_period').disable()
                        this.packageDetailForm.controls.expire_period.setValue('DAY');
                        this.packageDetailForm.get('expireUsing').disable()
                        this.packageDetailForm.controls.expireUsing.setValue('CHARGE RATE')
                        this.detectChanges();
                        return this.listS.getlevelRate(x.level);
                    }
                    else{
                        this.packageDetailForm.controls.expire_amount.setValue(null);
                        this.packageDetailForm.get('expire_amount').enable()
                        this.packageDetailForm.controls.type.setValue(null)
                        this.packageDetailForm.get('type').enable()
                        this.packageDetailForm.controls.expireUsing.setValue(null)
                        this.packageDetailForm.get('expireUsing').enable()
                        this.packageDetailForm.controls.packageLevel.setValue(null)
                        this.packageDetailForm.get('packageLevel').enable()
                        this.packageDetailForm.controls.expire_costType.setValue(null);
                        this.packageDetailForm.get('expire_unit').enable()
                        this.packageDetailForm.controls.expire_unit.setValue(null);
                        this.packageDetailForm.get('expire_period').enable()
                        this.packageDetailForm.controls.expire_period.setValue(null);
                        this.packageDetailForm.get('expireUsing').enable()
                        this.packageDetailForm.controls.expireUsing.setValue(null)
                        this.packageDetailForm.get('expire_costType').enable()
                        this.packageDetailForm.controls.expire_costType.setValue(null)
                    }
                    this.detectChanges();
                    return EMPTY;
                })
                ).subscribe(data => {
                    this.packageDetailForm.controls.expire_amount.setValue(data.levelRate);
                    this.detectChanges();
                });
            }
            detectChanges(){
                this.cd.markForCheck();
                this.cd.detectChanges();
            }
            save() {
                this.packageDetailForm.controls['personID'].setValue(this.user.id)
                const packageDetail = this.packageDetailForm.value;

                if(this.addOREdit == 1){
                    this.timeS.postprogramdetails(packageDetail)
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Package Details Added');
                        this.search();
                        // this.handleCancel();
                    });
                }
                if(this.addOREdit == 2){
                    this.timeS.updateprogramdetails(packageDetail)
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Package Details Added');
                        this.search();
                        // this.handleCancel();
                    });
                }
            }
            
            showEditModal(index: number) {
                
            }
            
            delete(index: number) {
                
            }
            
            handleCancel() {
                this.modalOpen = false;   
            }
            tabFindIndex: number = 0;
            tabFindChange(index: number){
                this.tabFindIndex = index;
            }
            showAddModal() {
                this.addOREdit = 1;
                this.modalOpen = true;
            }
            domenticaChange(event: any){
                if(event.target.checked){
                    this.supplements.patchValue({
                        levelSupplement : this.programLevel,
                    })
                }else{
                    this.supplements.patchValue({
                        levelSupplement : '',
                    })
                }
            }
            packgChange(e){
            }
            recurrentChange(e){
                if(e.target.checked){
                    this.visibleRecurrent = true;
                }else{
                    this.visibleRecurrent = false;
                }
            }
        }
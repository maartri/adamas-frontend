import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService,fundingDropDowns, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject,EMPTY } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

const packageDefaultForm: any = {
    personID:'',
    program: null,
    packageLevel:'',
    packageType:[null, Validators.required],
    programStatus:[null, Validators.required],
    expireUsing:[null, Validators.required],
    priority: null,
    notes:'',
    quantity:'',
    itemUnit:'',
    perUnit:'',
    period:'',
    timeUnit:'',
    aP_CostType:'',
    packg_balance:false,
    recurant:false,
    alertStartDate:'',
    aP_Period:'',
    aP_BasedOn:'',
    aP_YellowQty:'',
    aP_OrangeQty:'',
    aP_RedQty:'',
    shared:false,
    startDate:'',
    expiryDate:'',
    reminderDate:'',
    packageTermType:'',
    autoRenew:false,
    rolloverRemainder:false,
    deactivateOnExpiry:false,
    dailyBasicCareFee:'$0.00',
    clientCont:'$1234',
    dailyIncomeTestedFee:'$0.00',
    incomeTestedFee:'$1234',
    contingency_Start:'',
    contingency:'',
    currentlyBanked:'',
    recordNumber:'',
}

@Component({
    selector: '',
    styles: [`
    nz-select{
        width:100%
    }
    .ant-divider, .ant-divider-vertical{
        margin:4px ​0 !important;
    }
    nz-form-item.ant-form-item{
        margin:0 ​0 0 0 !important;
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
    selectedProgram: any;
    
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
            this.period        = ['ANNUAL','MONTH','QUARTER'];
            this.levels        = ['Level 1','Level 2','Level 3','Level 4','STRC'];
            this.cycles        = fundingDropDowns.cycle;
            this.budgetEnforcement = ['HARD','SOFT'];
            this.alerts        = fundingDropDowns.alerts;
            this.packageTerm   = fundingDropDowns.packageTerm;
            this.type          = fundingDropDowns.type;
            this.status        = fundingDropDowns.status;
            this.DefPeriod     = fundingDropDowns.period;
            this.expireUsing   = fundingDropDowns.expireUsing;
            this.unitsArray    = fundingDropDowns.perUnit;
            this.levels        = fundingDropDowns.levels;
            this.dailyArry     = ['DAILY'];
        }

        resetDisabledDropdowns(){
            this.packageDetailForm.get('packageLevel').enable()
            // this.packageDetailForm.controls.packageLevel.setValue(x.level);
            this.packageDetailForm.get('quantity').enable()
            // this.packageDetailForm.controls.quantity.setValue(x.quantity);
            this.packageDetailForm.get('packageType').enable()
            // this.packageDetailForm.controls.packageType.setValue(typeOpt);
            this.packageDetailForm.get('itemUnit').enable()
            // this.packageDetailForm.controls.itemUnit.setValue('DOLLARS');
            this.packageDetailForm.get('perUnit').enable()
            // this.packageDetailForm.controls.perUnit.setValue('PER');
            this.packageDetailForm.get('period').enable()
            // this.packageDetailForm.controls.period.setValue('DAY');
            this.packageDetailForm.get('expireUsing').enable()
            // this.packageDetailForm.controls.expireUsing.setValue('CHARGE RATE')
            this.detectChanges();
        }

        buildForm() {
            this.packageDetailForm = this.formBuilder.group(packageDefaultForm);
            this.resetDisabledDropdowns();

            this.supplements = this.formBuilder.group({
                domentica:false,
                levelSupplement:'',
                oxygen:false,
                feedingSuplement:false,
                feedingSupplement:'',
                EACHD:false,
                viabilitySuplement:false,
                viabilitySupplement:'',
                hardShipSupplement:''
            });

            this.packageDetailForm.get('aP_CostType').valueChanges.subscribe(data => {
                this.packageDetailForm.get('recurant').enable()
            });

            this.packageDetailForm.get('alertStartDate').valueChanges.subscribe(data => {
                if(this.globalS.isEmpty(data)){
                    this.packageDetailForm.get('aP_BasedOn').disable()
                    this.packageDetailForm.get('aP_RedQty').disable()
                    this.packageDetailForm.get('aP_OrangeQty').disable()
                    this.packageDetailForm.get('aP_YellowQty').disable()
                }else{
                    this.packageDetailForm.get('aP_BasedOn').enable()
                    this.packageDetailForm.get('aP_RedQty').enable()
                    this.packageDetailForm.get('aP_OrangeQty').enable()
                    this.packageDetailForm.get('aP_YellowQty').enable()
                }
            });
            
            this.packageDetailForm.get('program').valueChanges
            .pipe(
                switchMap(x => {
                    if(!x) {
                        return EMPTY
                    };
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
                        this.packageDetailForm.get('quantity').disable()
                        this.packageDetailForm.controls.quantity.setValue(x.quantity);
                        this.packageDetailForm.get('packageType').disable()
                        this.packageDetailForm.controls.packageType.setValue(typeOpt);
                        this.packageDetailForm.get('itemUnit').disable()
                        this.packageDetailForm.controls.itemUnit.setValue('DOLLARS');
                        this.packageDetailForm.get('perUnit').disable()
                        this.packageDetailForm.controls.perUnit.setValue('PER');
                        this.packageDetailForm.get('period').disable()
                        this.packageDetailForm.controls.period.setValue('DAY');
                        this.packageDetailForm.get('expireUsing').disable()
                        this.packageDetailForm.controls.expireUsing.setValue('CHARGE RATE')
                        this.detectChanges();
                        return this.listS.getlevelRate(x.level);
                    }
                    // else{
                    //     this.packageDetailForm.controls.quantity.setValue('2');
                    //     this.packageDetailForm.get('quantity').enable()
                    //     this.packageDetailForm.controls.packageType.setValue('3')
                    //     this.packageDetailForm.get('packageType').enable()
                    //     this.packageDetailForm.controls.expireUsing.setValue('4')
                    //     this.packageDetailForm.get('expireUsing').enable()
                    //     this.packageDetailForm.controls.packageLevel.setValue('5')
                    //     this.packageDetailForm.get('packageLevel').enable()
                    //     this.packageDetailForm.controls.itemUnit.setValue(null);
                    //     this.packageDetailForm.get('perUnit').enable()
                    //     this.packageDetailForm.controls.perUnit.setValue(null);
                    //     this.packageDetailForm.get('period').enable()
                    //     this.packageDetailForm.controls.period.setValue(null);
                    //     this.packageDetailForm.get('expireUsing').enable()
                    //     this.packageDetailForm.controls.expireUsing.setValue(null)
                    //     this.packageDetailForm.get('itemUnit').enable()
                    //     this.packageDetailForm.controls.itemUnit.setValue(null)
                    // }
                    this.detectChanges();
                    return EMPTY;
                })
                ).subscribe(data => {
                    this.packageDetailForm.controls.quantity.setValue(data.levelRate);
                    this.detectChanges();
                });
            }

            detectChanges(){
                this.cd.markForCheck();
                this.cd.detectChanges();
            }

            save() {
                
                var prog_status = this.packageDetailForm.value.programStatus;
                var expireUsing = this.packageDetailForm.value.expireUsing;
                var packageType = this.packageDetailForm.value.packageType;
                var program     = this.packageDetailForm.value.program;
                if(prog_status == null || expireUsing == null || packageType == null || program == null ){
                        this.globalS.wToast('Error', 'All manmdatpry fields must be completed'); 
                        return false;
                }

                this.packageDetailForm.controls['personID'].setValue(this.user.id);                

                if(this.addOREdit == 1){
                    this.packageDetailForm.patchValue({
                        recordNumber: null
                    })
                    const packageDetail = this.packageDetailForm.value;
                    this.timeS.postprogramdetails(packageDetail)
                    .subscribe(data => {
                        this.modalOpen = false;
                        this.globalS.sToast('Success', 'Package Details Added');
                        this.search();
                    });
                }
                if(this.addOREdit == 2){
                    const packageDetail = this.packageDetailForm.value;
                    this.timeS.updateprogramdetails(packageDetail)
                    .subscribe(data => {
                        this.modalOpen = false;
                        this.globalS.sToast('Success', 'Package Details Added');
                        this.search();
                    });
                }
            }
            
            showEditModal(index: number) {

                this.addOREdit = 2;

                this.timeS.getprogramdetails(index).subscribe(data=>{
                    this.selectedProgram = data;
                    this.cd.markForCheck();
                    this.packageDetailForm.patchValue({
                        program:this.selectedProgram.program,
                        programStatus:this.selectedProgram.programStatus,
                        packageType:this.selectedProgram.packageType,
                        expireUsing:this.selectedProgram.expireUsing,
                        perUnit:this.selectedProgram.perUnit,
                        period:this.selectedProgram.period,
                        itemUnit:this.selectedProgram.itemUnit,
                        quantity:this.selectedProgram.quantity,
                        timeUnit:this.selectedProgram.timeUnit,
                        aP_CostType:this.selectedProgram.aP_CostType,
                        aP_Period:this.selectedProgram.aP_Period,
                        aP_YellowQty:this.selectedProgram.aP_YellowQty,
                        aP_OrangeQty:this.selectedProgram.aP_OrangeQty,
                        aP_RedQty:this.selectedProgram.aP_RedQty,
                        aP_BasedOn:this.selectedProgram.aP_BasedOn,
                        alertStartDate:this.selectedProgram.alertStartDate,
                        dailyBasicCareFee:this.selectedProgram.dailyBasicCareFee,
                        clientCont:this.selectedProgram.clientCont,
                        dailyIncomeTestedFee:this.selectedProgram.dailyIncomeTestedFee,
                        incomeTestedFee:this.selectedProgram.incomeTestedFee,
                        startDate:this.selectedProgram.startDate,
                        reminderDate:this.selectedProgram.reminderDate,
                        expiryDate:this.selectedProgram.expiryDate,
                        autoRenew:this.selectedProgram.autoRenew,
                        recurant:this.globalS.isEmpty(this.selectedProgram.aP_Period) ? false : true,
                        rolloverRemainder:this.selectedProgram.rolloverRemainder,
                        deactivateOnExpiry:this.selectedProgram.deactivateOnExpiry,
                        packageTermType:this.selectedProgram.packageTermType,
                        contingency_Start:this.selectedProgram.contingency_Start,
                        contingency:this.selectedProgram.contingency,
                        recordNumber:this.selectedProgram.recordNumber,
                    });
                    this.supplements.patchValue({
                        hardShipSupplement:this.selectedProgram.hardShipSupplement,
                        levelSupplement:this.selectedProgram.packageLevel,
                        domentica:true
                    })
                });
                this.modalOpen = true;
            }
            
            delete(data: any) {
                console.log(data);
                this.timeS.deleteprogramdetails(data.recordNumber).subscribe(data => {
                    this.globalS.sToast('Success', 'Package Deleted');
                    this.search();
                });
            }

            getPayout(){

            }

            handleCancel() {
                this.modalOpen = false;   
            }

            tabFindIndex: number = 0;
            tabFindChange(index: number){
                this.tabFindIndex = index;
            }

            showAddModal() {
                this.packageDetailForm = this.formBuilder.group(packageDefaultForm);                
                this.addOREdit = 1;
                this.modalOpen = true;
            }

            domenticaChange(event: any){
                if(event.target.checked){
                    this.supplements.patchValue({
                        levelSupplement : this.programLevel,
                    });
                }else{
                    this.supplements.patchValue({
                        levelSupplement : '',
                    });
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
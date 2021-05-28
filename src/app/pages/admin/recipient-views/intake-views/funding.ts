import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService,fundingDropDowns, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';

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
            this.dailyArry     = ['DAILY'];
        }
        buildForm() {
            this.packageDetailForm = this.formBuilder.group({
                programname:'',
                type:'',
                status:'',
                expireUsing:'',
                notes:'',
                expire_amount:'',
                expire_costType:'',
                expire_unit:'',
                expire_period:'',
                expire_length:'',
                p_alert_type:'',
                packg_balance:false,
                recurant:false,
                commencing_date:null,
                p_alert_period:'',
                allowed:'',
                yellow:'',
                green:'',
                red:'',
                shared:false,
                startFunding:null,
                endFunding:null,
                reminderDate:null,
                packageTerm:'',
                autoRenew:false,
                rolloverFunding:false,
                deactivateExpiry:false,
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
        }
        
        save() {
            
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
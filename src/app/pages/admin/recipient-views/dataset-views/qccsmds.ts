import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService, dateFormat } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
    selector: '',
    styles: [`
    nz-tabset{
        margin-top:1rem;
    }
    .ant-divider-horizontal.ant-divider-with-text-center, .ant-divider-horizontal.ant-divider-with-text-left, .ant-divider-horizontal.ant-divider-with-text-right {
        margin:1px 0
    }
    nz-tabset >>> div > div.ant-tabs-nav-container{
        height: 25px !important;
        font-size: 13px !important;
    }
    
    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
        line-height: 24px;
        height: 25px;
        border-radius:15px 4px 0 0;
        margin:0 -10px 0 0;
    }
    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
        background: #85B9D5;
        color: #fff;
    }
    nz-select{
        width:100%
    }
    `],
    templateUrl: './qccsmds.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DatasetQccsmda implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    dateFormat: string = dateFormat;
    loading: boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;
    
    tableData: Array<any> = [];
    branches: Array<any> = [];
    
    private default: any = {
        recordNumber: '',
        personID: '',
        branch: null,
        notes: ''
    }

    carerRecipientList: any;
    carerRelationshipList: any;
    carerAvailabilityList: any;
    carerResidencyList: any;
    genderlist: any;
    countries: any;
    languages: any;
    indigniousStatus: any;
    livingArrangemnts: any;
    accomodationSetting: any;
    pensionAll: any;
    dvaCardStatus: any;
    referalSource: any;

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
                if (this.globalS.isCurrentRoute(this.router, 'qccsmds')) {
                    this.user = data;
                    this.search(data);
                }
            });
        }
        
        ngOnInit(): void {
            this.user = this.sharedS.getPicked();
            this.search(this.user);
            this.getGeneralDataLists();
            this.buildForm();
        }   
        tabFindIndexScope: number = 0;
        view(index: number){
            if(index == 2){
                this.getCarerDataLists();
            }
            this.tabFindIndexScope = index;
        }
        ngOnDestroy(): void {
            this.unsubscribe.next();
            this.unsubscribe.complete();
        }
        
        buildForm() {
            this.inputForm = this.formBuilder.group({
                recordNumber: '',
                personID: '',
                branch: [null, [Validators.required]],
                notes: '',
                title:'',
                flag:false,
            });
        }
        
        search(user: any = this.user) {
            this.cd.reattach();
            this.loading = true;
            this.timeS.getbranches(user.id).subscribe(branches => {
                this.loading = false;
                this.tableData = branches;
                this.cd.detectChanges();
            });
            
            this.listDropDown();
        }
        
        listDropDown(user: any = this.user) {
            this.branches = [];
            this.listS.getintakebranches(user.id)
            .subscribe(data => this.branches = data)
        }
        getGeneralDataLists(){
            
            return forkJoin([
                this.listS.GetHaccSex(),
                this.listS.GetCountries(),
                this.listS.GetLanguages(),
                this.listS.GetIndigniousStatus(),
                this.listS.GetLivingArrangments(),
                this.listS.GetAccomodationSetting(),
                this.listS.getpensionall(),
                this.listS.GetHACCVaCardStatus(),
                this.listS.GetHACCReferralSource(),

            ]).subscribe(x => {
                this.genderlist             = x[0];
                this.countries              = x[1];
                this.languages              = x[2];
                this.indigniousStatus       = x[3];
                this.livingArrangemnts      = x[4];
                this.accomodationSetting    = x[5];
                this.pensionAll             = x[6];
                this.dvaCardStatus          = x[7];
                this.referalSource          = x[8];
            });

        }
        getCarerDataLists(){
            return forkJoin([
                this.listS.GetCarerDataRecipientcarer(),
                this.listS.GetCarerDataRelationship(),
                this.listS.GetCarerDataAvailability(),
                this.listS.GetCarerDataResidency(),
            ]).subscribe(x => {
                this.carerRecipientList     = x[0];
                this.carerRelationshipList  = x[1];
                this.carerAvailabilityList  = x[2];
                this.carerResidencyList     = x[3];
            });
        }
        save() {
            
            if (!this.globalS.IsFormValid(this.inputForm))
            return; 
            
            this.inputForm.controls['personID'].setValue(this.user.id);
            
            this.loading = true;
            if (this.addOREdit == 1) {
                this.timeS.postbranches(this.inputForm.value)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Branch Inserted');
                    this.search();
                    this.handleCancel();
                });
            }
            
            if (this.addOREdit == 2) {
                this.timeS.updatebranches(this.inputForm.value)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Branch Updated');
                    this.search();
                    this.handleCancel();
                });
            }
        }
        
        handleCancel() {
            this.modalOpen = false;
            this.loading = false;
            this.inputForm.reset(this.default);
        }
        
        trackByFn(index, item) {
            return item.id;
        }
        
        showAddModal() {
            this.addOREdit = 1;
            this.listDropDown();
            this.modalOpen = true;
        }
        
        showEditModal(index: number) {
            this.addOREdit = 2;
            const { branch, recordNumber, notes } = this.tableData[index];
            this.inputForm.patchValue({
                recordNumber,
                branch,
                notes
            });
            
            this.modalOpen = true;
        }
        
        delete(index: number) {
            const { recordNumber } = this.tableData[index];
            this.timeS.deletebranches(recordNumber)
            .subscribe(data => {
                this.globalS.sToast('Success', 'Branch Deleted');
                this.search();
            })
        }
    }
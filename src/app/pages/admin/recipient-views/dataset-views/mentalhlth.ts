import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ndiaTypes,GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService,dateFormat } from '@services/index';
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
    #boxhlder{
        margin-top:6rem;
    }
    `],
    templateUrl: './mentalhlth.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MentalHlth implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    dateFormat = dateFormat;
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
                if (this.globalS.isCurrentRoute(this.router, 'mentalhlth')) {
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
        
        buildForm() {
            this.inputForm = this.formBuilder.group({
                recordNumber: '',
                personID: '',
                branch: [null, [Validators.required]],
                notes: '',
                flag:false,
                title:'',
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
        tabFindIndexScope: number = 0;
        view(index: number){
            this.tabFindIndexScope = index;
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
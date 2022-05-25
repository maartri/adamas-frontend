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
        nz-select{
            width:100%
        }
    `],
    templateUrl: './childsafety.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChildSafety implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    dateFormat: string = dateFormat;
    loading: boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;

    tableData: Array<any> = [];
    branches: Array<any> = [];
    referralServices: Array<any> = [];
    private default: any = {
        recordNumber: '',
        personID: '',
        branch: null,
        notes: '',
        title:'',
        flag:false,
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
            if (this.globalS.isCurrentRoute(this.router, 'childsafety')) {
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
            placementtype:'',
            carer:'',
            start_date:null,
            end_date:null,
            tool :false,
            alert:false,
            medicareNumber: '',
            medicareRecipientID: '',
            medicareExpiry:'',
        });
    }

    search(user: any = this.user) {
        this.cd.reattach();
        this.loading = true;
        this.listDropDown();
    }

    listDropDown(user: any = this.user) {

        this.listS.getReferalServices().subscribe(services => {
            this.loading = false;
            this.referralServices = services;
            this.cd.detectChanges();
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
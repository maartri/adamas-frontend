import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        nz-select{
            width:100%;
        }
        ul{
            list-style:none;
            padding:0;
        }
        li{
            padding:5px 0;
        }
    `],
    templateUrl: './leave.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffLeaveAdmin implements OnInit, OnDestroy {

    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    loading: boolean = false;
    modalOpen: boolean = false;
    dateFormat: string = 'MMM dd yyyy';
    isLoading: boolean;

    leaveGroup: FormGroup;

    putonLeaveModal: boolean = false;

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
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'leave')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        if(this.user || !this.putonLeaveModal){
            this.search(this.user);
            this.buildForm();
            return;
        }
        this.router.navigate(['/admin/staff/personal'])
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {
        this.leaveGroup = this.formBuilder.group({
            user: '',
            staffcode: '',

            dates: [[], [Validators.required]],

            makeUnavailable: true,
            unallocAdmin: false,
            unallocUnapproved: true,
            unallocMaster: false,

            explanation: '',
            activityCode: '',
            payCode: '',
            program: '',

            programShow: false
        })
    }

    search(user: any = this.user) {
        this.cd.reattach();
        this.loading = true;
        this.timeS.getleaveapplication(user.code).subscribe(data => {
            this.tableData = data;
            this.loading = false;
            this.cd.detectChanges();
        });
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.modalOpen = true;
        
    }

    handleCancel() {
        this.modalOpen = false;
    }

    reset() {
        
    }

    showEditModal(index: any) {

    }

    delete(data: any) {
        this.timeS
            .deleteleaveapplication(data.recordNumber)
            .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Data Deleted!');
                    this.search(this.user);
                    return;
                }
            });
    }
}
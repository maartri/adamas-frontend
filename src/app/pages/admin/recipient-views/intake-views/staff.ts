import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
    selector: '',
    templateUrl: './staff.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IntakeStaff implements OnInit, OnDestroy {
    
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    loading: boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;

    excludedStaff: Array<any> = []
    includedStaff: Array<any> = []

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
                    this.router.navigate(['/admin/recipient/branches'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'staff')) {
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

        forkJoin([
            this.timeS.getexcludedstaff(user.id),
            this.timeS.getincludedstaff(user.id)
        ]).subscribe(staff => {
            this.loading = false;
            this.excludedStaff = staff[0];
            this.includedStaff = staff[1];
            this.cd.markForCheck();
        });
    }

    buildForm() {

    }

    save() {

    }

    showEditModal(index: number) {

    }

    delete(index: number) {

    }

    handleCancel() {

    }

    showAddModal() {
        this.addOREdit = 1;
        this.modalOpen = true;
    }
}
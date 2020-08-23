import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

import format from 'date-fns/format';
import getYear from 'date-fns/getYear';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';

@Component({
    styles: [`
      nz-table{
            margin-top:20px;
        }
        nz-select{
            width:100%;
        }
        label.chk{
            position: absolute;
            top: 1.5rem;
        }
    `],
    templateUrl: './opnote.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffOPAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    modalOpen: boolean = false;
    isLoading: boolean = false;

    default = {
        notes: '',
        isPrivate: false,
        alarmDate: null,
        whocode: '',
        recordNumber: null,
        category: null
    }

    dateFormat: string = 'dd/MM/yyyy';
    addOREdit: number;
    categories: Array<any>;

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
                    this.router.navigate(['/staff-direct/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'op-note')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        if(this.user){
            this.search(this.user);
            this.buildForm();
            return;
        }
        this.router.navigate(['/staff-direct/staff/personal'])
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            notes: '',
            isPrivate: false,
            alarmDate: null,
            whocode: '',
            recordNumber: null,
            category: [null, [Validators.required]]
        });
    }

    search(user: any = this.user) {
        this.cd.reattach();
        this.isLoading = true;
        this.timeS.getopnotes(user.code).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.tableData = data;
            this.isLoading = false;
            this.cd.detectChanges();
        });

        this.listS.getlistop().pipe(takeUntil(this.unsubscribe)).subscribe(data => this.categories = data)
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.addOREdit = 1;
        this.modalOpen = true;
    }

    save() {
        if (!this.globalS.IsFormValid(this.inputForm))
            return;        
        
        const cleanDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(
            this.inputForm.get('alarmDate').value);
        
        this.inputForm.controls["alarmDate"].setValue(cleanDate);

        this.isLoading = true;
        if (this.addOREdit == 1) {
            this.inputForm.controls["whocode"].setValue(this.user.code);
            this.timeS.postopnote(this.inputForm.value, this.user.id).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.globalS.sToast('Success', 'Note saved');
                        this.search();
                        this.handleCancel();
                        return;
                    }
                });
        }

        if (this.addOREdit == 2) {
            this.timeS.updateopnote(this.inputForm.value, this.inputForm.value.recordNumber).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.globalS.sToast('Success', 'Note Updated');
                        this.search();
                        this.handleCancel();
                        return;
                    }
                });
        }
    }

    showEditModal(index: any) {
        this.addOREdit = 2;
        const { alarmDate, detail, isPrivate, category, creator, recordNumber } = this.tableData[index];

        this.inputForm.patchValue({
            notes: detail,
            isPrivate: isPrivate,
            alarmDate: alarmDate,
            whocode: creator,
            recordNumber: recordNumber,
            category: category
        });
        this.modalOpen = true;
    }

    delete(index: number) {        
        const { recordNumber } = this.tableData[index];
        this.timeS.deleteopnote(recordNumber).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Note Deleted');
                    this.search();
                    this.handleCancel();
                }
            });
    }

    handleCancel() {
        this.modalOpen = false;
        this.inputForm.reset();
        this.isLoading = false;
    }
}
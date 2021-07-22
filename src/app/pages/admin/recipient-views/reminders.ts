import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService, recurringInt, recurringStr } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { Reminders } from '@modules/modules';

import { NzModalService } from 'ng-zorro-antd/modal';
import { recurringValidator } from '../../../validators/index';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
         nz-select{
            width:100%;
        }
    `],
    templateUrl: './reminders.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientRemindersAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    checked: boolean = false;
    isDisabled: boolean = false;
    loading: boolean = false;
    isLoading: boolean = false;

    modalOpen: boolean = false;
    addOREdit: number;
    dateFormat: string = 'dd/MM/yyyy';
    dayInt = recurringInt;
    dayStr = recurringStr;

    private default: any = {
        recordNumber: '',
        personID: '',
        listOrder: '',
        followUpEmail: '',
        recurring: false,
        recurrInt: null,
        recurrStr: null,
        notes: '',
        reminderDate: null,
        dueDate: null,
        staffAlert: null
    }

    alist: Array<any> = []

    constructor(
        private timeS: TimeSheetService,
        private listS: ListService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'reminders')) {
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

    search(user: any = this.user) {
        this.loading = true;
        
        this.timeS.getremindersrecipient(user.code).subscribe(data => {
            this.tableData = data.list;
            this.loading = false;
            this.cd.markForCheck();
        });

        this.listS.getlistrecipientreminders().subscribe(data => this.alist = data);
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            recordNumber: '',
            personID: '',
            listOrder: '',
            followUpEmail: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            recurring: false,
            sameDate:false,
            sameDay:false,
            recurrInt: null,
            recurrStr: null,
            notes: '',
            reminderDate: null,
            dueDate: null,
            staffAlert: ['', [Validators.required]]
        });

        this.inputForm.controls['recurrStr'].disable();
        this.inputForm.controls['recurrInt'].disable();
        
        this.inputForm.controls['sameDay'].disable();
        this.inputForm.controls['sameDate'].disable();

        this.inputForm.get('recurring').valueChanges.subscribe(data => {
            if (!data) {
                this.inputForm.controls['recurrInt'].setValue(null)
                this.inputForm.controls['recurrStr'].setValue(null)
                this.inputForm.controls['recurrStr'].disable()
                this.inputForm.controls['recurrInt'].disable()
            } else {
                this.inputForm.controls['recurrStr'].enable()
                this.inputForm.controls['recurrInt'].enable()
            }
        });
        this.inputForm.get('recurrStr').valueChanges.subscribe(data => {
            if (data == 'Month/s') {
                this.inputForm.controls['sameDay'].enable();
                this.inputForm.controls['sameDate'].enable();
            } else {
                this.inputForm.controls['sameDay'].setValue(false);
                this.inputForm.controls['sameDate'].setValue(false);
                this.inputForm.controls['sameDay'].disable();
                this.inputForm.controls['sameDate'].disable();
            }
        });
    }

    onKeyPress(data: KeyboardEvent) {
        return this.globalS.acceptOnlyNumeric(data);
    }

    showEditModal(index: number) {
        const { recordNumber, personID, name, address1, address2, email, date1, date2, state, notes, recurring,sameDate,sameDay } = this.tableData[index];
        
        this.inputForm.patchValue({
            recordNumber,
            personID,
            listOrder: state,
            followUpEmail: email,
            recurring,
            sameDate,
            sameDay,
            recurrInt: address1 == '' ? null : address1,
            recurrStr: address2 == '' ? null : address2,
            notes,
            reminderDate: date1,
            dueDate: date2,
            staffAlert: name
        });

        this.addOREdit = 2;
        this.modalOpen = true;
    }

    save() {
        if (!this.globalS.IsFormValid(this.inputForm))
            return;
        
        const remGroup = this.inputForm.value;

        if (remGroup.recurring && (!remGroup.recurrInt || !remGroup.recurrStr)) {            
            this.globalS.eToast('Error', 'Recurring Variables needs to be filled');
            return;
        }
        const reminderDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(remGroup.reminderDate);
        const dueDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(remGroup.dueDate);
        const reminder: Reminders = {
            recordNumber: remGroup.recordNumber,
            personID: this.user.id,
            name: remGroup.staffAlert,
            address1: remGroup.recurring ? remGroup.recurrInt : '',
            address2: remGroup.recurring ? remGroup.recurrStr : '',
            email: remGroup.followUpEmail,
            date1: reminderDate,
            date2: dueDate,
            state: remGroup.listOrder,
            notes: remGroup.notes,
            recurring: remGroup.recurring,
            sameDay: remGroup.sameDay,
            sameDate: remGroup.sameDate
        }   

        if(this.addOREdit == 1){
            this.timeS.postremindersrecipient(reminder)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data added');
                    this.search();
                    this.handleCancel();
                });
        }
        console.log(this.addOREdit + "addOREdit")
        if (this.addOREdit == 2) {
            this.timeS.updateremindersrecipient(reminder)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data updated');
                    this.search();
                    this.handleCancel();
                })
        }

        console.log(reminder);
    }

    canDeactivate() {
        if (this.inputForm && this.inputForm.dirty) {
            this.modalService.confirm({
                nzTitle: 'Save changes before exiting?',
                nzContent: '',
                nzOkText: 'Yes',
                nzOnOk: () => {
                    this.save();
                },
                nzCancelText: 'No',
                nzOnCancel: () => {

                }
            });
        }
        return true;
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.modalOpen = true;
        this.addOREdit = 1;
    }

   

    delete(index: number) {
        const { recordNumber } = this.tableData[index];

        this.timeS.deleteremindersrecipient(recordNumber).subscribe(data => {
            this.globalS.sToast('Success', 'Data added');
            this.search();
            this.handleCancel();
        });
    }

    handleCancel() {
        this.modalOpen = false;
        this.isLoading = false;
        this.inputForm.reset(this.default);
    }
}
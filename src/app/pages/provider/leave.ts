import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { FormBuilder, FormControl, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';

import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService, StaffService, leaveTypes } from '@services/index';

@Component({
    styles: [`
        nz-select {
            margin-right: 8px;
            width: 100%;
        }
    `],
    templateUrl: './leave.html'
})


export class LeaveProvider implements OnInit, OnDestroy {
    dateFormat: string = 'dd/MM/yyyy';
    selectedValue: string;

    notes: string;

    leaveForm: FormGroup;

    leaveTypes: Array<string> = leaveTypes

    loading: boolean = false;
    constructor(
        private fb: FormBuilder,
        private message: NzMessageService,
        private globalS: GlobalService,
        private staffS: StaffService
    ) {

    }

    ngOnInit(): void {
        this.leaveForm = this.fb.group({
            dates: [[], [Validators.required]],
            leaveTypes: [null, [Validators.required]],
            notes: [null, [Validators.required]]
        });
    }

    ngOnDestroy() {

    }

    submitForm() {

        for (const i in this.leaveForm.controls) {
            this.leaveForm.controls[i].markAsDirty();
            this.leaveForm.controls[i].updateValueAndValidity();
        }

        if (!this.leaveForm.valid) {
            this.message.error('Form is invalid!');
            return;
        }

        const dayDiff = differenceInCalendarDays(this.leaveForm.get('dates').value[1], this.leaveForm.get('dates').value[0]);

        const durationStr = dayDiff < 1 ?
            {
                day: '1 day',
                date: `${format(this.leaveForm.get('dates').value[1], 'yyyy-MM-dd')}`
            } :
            {
                day: `${dayDiff + 1} days `,
                date: `${format(this.leaveForm.get('dates').value[0], 'MMM dd,yyyy')} - ${format(this.leaveForm.get('dates').value[1], 'MMM dd,yyyy')}`
            };

        let leave: Dto.LeaveEntry = {
            StaffCode: this.globalS.decode().uniqueID,
            StartDate: format(this.leaveForm.get('dates').value[0], 'yyyy-MM-dd'),
            EndDate: format(this.leaveForm.get('dates').value[1], 'yyyy-MM-dd'),
            Message: {
                Subject: `Leave Application: ${this.globalS.decode().code}`,
                Content: `${durationStr.day} on dates ${durationStr.date}`,
                LeaveType: `${this.leaveForm.get('leaveTypes').value}`,
                Notes: `${this.leaveForm.get('notes').value}`
            },
            CoordinatorEmail: {
                AccountName: this.globalS.decode().code,
                IsRecipient: false
            }
        }
        this.loading = true;
        this.staffS.postleave(leave)
            .subscribe(leave => {
                this.globalS.sToast('Success', 'Leave filed!');
                this.leaveForm.reset();
            }, (err) => {
                this.globalS.eToast('Error', 'Email Server is not setup')
            }, () => {
                this.loading = false;
            });
    }

    validateDate() {
        Promise.resolve().then(() => {
            // if (isEqual(this.leaveForm.get('dates').value[0], this.leaveForm.get('dates').value[1])) {
            //     this.leaveForm.controls.dates.setErrors({ 'incorrect': true })
            // }
        });
    }
}
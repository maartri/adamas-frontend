import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { mergeMap, takeUntil, concatMap, switchMap } from 'rxjs/operators';
import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';

interface CalculatedPay{
    KMAllowancesQty: number,
    AllowanceQty: number,
    WorkedHours : number,
    PaidAsHours : number,
    PaidAsServices: number,
    WorkedAttributableHours : number,
    PaidQty: number,
    PaidAmount : number,
    ProvidedHours: number,
    BilledAsHours : number,
    BilledAsServices: number,
    BilledQty : number,
    BilledAmount : number,
    HoursAndMinutes: string
}

@Component({    
    styles: [`
       ul{
            list-style:none;
            float:right;
            margin:0;
        }
        li{
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
            padding: 5px;
            cursor:pointer;
        }
        li:hover{
            color:#177dff;
        }
        li div{
            text-align: center;
            font-size: 17px;
            width:4rem;
        }
        .selected{
            background:#f2ff87 !important;
        }
    `],
    templateUrl: './timesheet.html',
})


export class TimesheetAdmin implements OnInit, OnDestroy, AfterViewInit {

    private unsubscribe: Subject<void> = new Subject();
    loading: boolean = false;
    timesheets: Array<any> = [];

    payTotal: CalculatedPay;
    selected: any = null;

    selectAll: boolean = false;

    constructor(
        private timeS: TimeSheetService,
        private globalS: GlobalService,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef
    ) {
        cd.detach();
    }

    ngOnInit(): void{

    }

    ngOnDestroy(): void{
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    ngAfterViewInit(): void{
        this.cd.reattach();
        this.cd.detectChanges();
    }

    trackByFn(index, item) {
        return item.id;
    }

    picked(data: any) {

        if (!data.data) {
            this.timesheets = [];
            return;
        }

        this.selected = data;

        const whatType = this.whatType(data.option);
        this.loading = true;

        this.timeS.gettimesheets({
            AccountNo: data.data,
            personType: whatType
        }).pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {

                this.loading = false;
                this.timesheets = data.map(x => {
                    return {
                        shiftbookNo: x.shiftbookNo,
                        date: x.activityDate,
                        startTime: x.activity_Time.start_time,
                        endTime: x.activity_Time.end_Time,
                        duration: x.activity_Time.calculated_Duration,
                        recipient: x.recipientLocation,
                        program: x.program.title,
                        activity: x.activity.name,
                        paytype: x.payType.paytype,
                        payquant: x.pay.quantity,
                        payrate: x.pay.pay_Rate,
                        billquant: x.bill.quantity,
                        billrate: x.bill.bill_Rate,
                        approved: x.approved,
                        billto: x.billedTo.accountNo,
                        notes: x.note,
                        selected: false,

                        serviceType: x.roster_Type,
                        recipientCode: x.recipient_staff.accountNo,
                        debtor: x.billedTo.accountNo,
                        serviceActivity: x.activity.name,
                        serviceSetting: x.recipientLocation,
                        payType: x.payType.paytype,
                        analysisCode: x.anal

                    }
                });

            });
        
        
        this.timeS.getcomputetimesheet({
            AccountName: data.data,
            IsCarerCode: whatType == 'Staff' ? true : false
        }).subscribe(compute => {
            var hourMinStr;

            if (compute.workedHours && compute.workedHours > 0) {
                const hours = Math.floor(compute.workedHours * 60 / 60);
                const minutes = ('0' + compute.workedHours * 60 % 60).slice(-2);

                hourMinStr = `${hours}:${minutes}`
            }

            var _temp = {
                KMAllowancesQty: compute.kmAllowancesQty || 0,
                AllowanceQty: compute.allowanceQty || 0,
                WorkedHours: compute.workedHours || 0,
                PaidAsHours: compute.paidAsHours || 0,
                PaidAsServices: compute.paidAsServices || 0,
                WorkedAttributableHours: compute.workedAttributableHours || 0,
                PaidQty: compute.paidQty || 0,
                PaidAmount: compute.paidAmount || 0,
                ProvidedHours: compute.providedHours || 0,
                BilledAsHours: compute.billedAsHours || 0,
                BilledAsServices: compute.billedAsServices || 0,
                BilledQty: compute.billedQty || 0,
                BilledAmount: compute.billedAmount || 0,
                HoursAndMinutes: hourMinStr
            };

            this.payTotal = _temp;
        });
    }

    confirm(index: number) {
        if (!this.selected && this.timesheets.length > 0) return;

        if (index == 2) {
            this.modalService.confirm({
                nzTitle: '<b>Do you want to delete highlighted shifts?</b>',
                nzContent: '<b></b>',
                nzOnOk: () => this.process(index)
            });
        }

        if (index == 3) {
            this.modalService.confirm({
                nzTitle: '<b>Do you want to delete all unapproved items?</b>',
                nzContent: '<b></b>',
                nzOnOk: () => this.process(index)
            });
        }

        if (index == 5) {
            this.modalService.confirm({
                nzTitle: '<b>Do you want to approve all items?</b>',
                nzContent: '<b></b>',
                nzOnOk: () => this.process(index)
            });
        }

        if (index == 6) {
            this.modalService.confirm({
                nzTitle: '<b>Do you want to unapprove all items?</b>',
                nzContent: '<b></b>',
                nzOnOk: () => this.process(index)
            });
        }
    }

    selectAllChange(event: any) {
        console.log(event);
    }


    selectedTimesheet(event: any, data: any) {
        data.selected = !(data.selected);

        console.log(this.timesheets)
    }

    checkBoxChange(event: boolean, timesheet: any){
        this.timeS.selectedApprove({
            AccountNo: timesheet.shiftbookNo,
            Status: event
        }).subscribe(data => {
            if(data){
                timesheet.approved = event;
                this.globalS.sToast('Success','Selected item');
            }
        })
    }

    process(index: number) {
        if (!this.selected && this.timesheets.length > 0) return;

        if (index == 2) {
            const shiftArray = this.timesheets.filter(x => x.selected).map(x => x.shiftbookNo)

            if(shiftArray.length == 0){
                this.globalS.wToast('No Highlighted Item','Warning');
                return;
            }
            console.log(shiftArray);
            // this.timeS.deleteshift(shiftArray)
            //     .subscribe(data => {
            //         this.globalS.sToast('Success','Selected items are deleted');
            //         this.picked(this.selected);                
            //     });
        }

        if (index == 3) {
            console.log('delete unapproved')
        }

        if (index == 5) {
            this.timeS.approveAll({
                accountNo: this.selected.data
            }).subscribe(data => {               
                this.globalS.sToast('Success', 'All items are approved');
                this.picked(this.selected);                
            });
        }

        if (index == 6) {
            this.timeS.unapproveAll({
                accountNo: this.selected.data
            }).subscribe(data => {
                this.globalS.sToast('Success', 'All items are unapproved');
                this.picked(this.selected);
            });
        }
    }


    whatType(data: number): string {
        return data == 0 ? 'Staff' : 'Recipient';
    }

}
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { takeUntil, switchMap, delay } from 'rxjs/operators';
import { Subject, Subscription, Observable, forkJoin } from 'rxjs';

import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parseISO from 'date-fns/parseISO';
import parse from 'date-fns/parse';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';

import { GlobalService, StaffService, TimeSheetService } from '@services/index';

interface ItemData {
    name: string;
    age: number;
    address: string;
}

interface TimeSheetData {
    shiftbookNo: any;
    activityDate: any;
    activityTime: any;
    approved: any;
    start: any;
    end: any;
    duration: any;
    claimStart: any;
    claimEnd: any;
    km: any;
    startKM: any;
    endKM: any;
    recipient: any;
    activity: any;
    program: any;
    ptype: any;
    pquant: any;
    rosterType: any;
    submitted: any;
    note: any;
    billedTo: any;
    status: number;

}

@Component({
    styles: [`
        b{
            color:#1890ff;
        }
        p{
            margin:0;
        }
        button.submit{
            background-color: #5bcc82;
            border-color: #5cda88;
        }
        .submit:hover{
            background:#5bcc82d1;
        }
        a:hover{
            text-decoration: underline;
        }
        button{
            margin-left: 5px;
        }
        .btns button{
            font-size:12px;
        }
        app-action{
            float: right;
        }
        td:nth-child(4){
            background:#c3ffb9;
        }
        td:nth-child(5){
            background:#ffb9b9;
        }
        .tclaim{
            font-size: 12px;
            background: #fdff82;
            padding: 2px 5px;
            border-radius: 8px;
            max-width: 7rem;
            display: inline-block;
            text-align:center;
        }
    `],
    templateUrl: './package.html'
})


export class PackageProvider implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();

    private obsArray: Array<any> = []

    payPeriod: any;
    token: any;
    settings: any;

    inTimesheets: Array<any>;

    loading: boolean = false;
    listOfData: any[] = [];
    indexPage: number = 0;

    totalTime: any;
    totalHoursMinutes: any;

    constructor(
        private globalS: GlobalService,
        private staffS: StaffService,
        private timeS: TimeSheetService
    ) {

    }

    ngOnInit() {
        this.token = this.globalS.decode();
        this.populate();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    populate() {
        this.staffS.getpayperiod().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
            this.payPeriod = {
                payperiod: format(parseISO(data.payPeriodEndDate), 'dd MMM yyyy'),
                sDate: format(parseISO(data.start_Date), 'dd MMM yyyy'),
                eDate: format(parseISO(data.end_Date), 'dd MMM yyyy')
            }
        });

        this.getTimesheetandStatus();

        this.staffS.getsettings(this.token.nameid).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
            this.settings = data;
        });
    }

    getTimesheetandStatus() {
        this.loading = true;
        this.timeS.gettimesheets({
            AccountNo: this.token.code,
            personType: 'Staff',
            startDate: '',
            endDate: ''
        }).pipe(
            delay(200),
            takeUntil(this.unsubscribe$),
            switchMap((data: any) => {
                this.loading = false;
                
                this.listOfData = data.map(x => {
                    return {
                        shiftbookNo: x.shiftbookNo,
                        activityDate: x.activityDate,
                        activityTime: x.activity_Time,
                        approved: x.approved,
                        start: x.activity_Time.start_time,
                        end: x.activity_Time.end_Time,
                        duration: x.activity_Time.calculated_Duration,
                        claimStart: x.claimed_Start,
                        claimEnd: x.claimed_End,
                        km: x.km,
                        startKM: x.start_KM,
                        endKM: x.end_KM,
                        recipient: x.client_Code,
                        activity: x.activity.name,
                        program: x.program.title,
                        ptype: x.payType.paytype,
                        pquant: x.pay.quantity,
                        rosterType: x.roster_Type,
                        submitted: x.submitted,
                        note: x.note,
                        billedTo: x.billedTo.accountNo,
                        status: 0
                    }
                });

                this.calculateTotalApprovedShifts(this.listOfData);
                var shiftsList = [];
                
                this.listOfData.forEach(x => {
                    shiftsList.push(x.shiftbookNo)
                });

                return this.timeS.getjobstatus(shiftsList);

            })).subscribe(data => {

                this.listOfData.forEach(x => {
                    data.forEach(b => {
                        if (x.shiftbookNo == b.jobNo && !b.isCompleted) {
                            x.status = 1;
                        }
                        if (x.shiftbookNo == b.jobNo && b.isCompleted) {
                            x.status = 2;
                        }
                    });
                })
                return data;
            });
    }


    calculateTotalApprovedShifts(timesheets: Array<any>) {
        const approved = timesheets.filter(data => data.approved);
        var sum = 0;
        approved.forEach(e => {
            // checks if duration is valid
            var duration = (e.duration != null && typeof e.duration != "undefined") ? e.duration : "0:00";

            const hours = parseInt(format(parse(duration, 'HH:mm', new Date()), 'HH')) * 60;
            const minutes = parseInt(format(parse(duration, 'HH:mm', new Date()), 'mm'));

            sum = sum + hours + minutes;           
        });

        this.totalTime = sum / 60;

        this.totalHoursMinutes = Math.floor(sum / 60) + ' hrs — ' + sum % 60 + 'min';

    }


    nzPageIndexChange(page: number) {
        this.indexPage = (page - 1 )* 10;
    }

    submitBtnClick(index: number) {
        const { shiftbookNo, claimStart, claimEnd, activityTime, submitted } = this.listOfData[index];
        let data = this.listOfData[index];

        if (!submitted) {
            let variation: Dto.ClaimVariation = {
                RecordNo: shiftbookNo,
                ClaimedBy: this.token.nameid,
                ClaimedDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                ClaimedStart: this.parseTimeToDate(activityTime.start_time),
                ClaimedEnd: this.parseTimeToDate(activityTime.end_Time)
            }

            this.staffS.postclaimvariation(variation).subscribe(res => {
                if (res) {
                    data.claimStart = this.parseTimeToDate(activityTime.start_time);
                    data.claimEnd = this.parseTimeToDate(activityTime.end_Time);
                    this.globalS.sToast("Schedule Submitted", "Success");
                    this.populate();
                }
            });
        } else {
            let variation: Dto.ClaimVariation = {
                RecordNo: shiftbookNo,
                ClaimedBy: null,
                ClaimedDate: '1753-01-01 12:00:00',
                ClaimedStart: '1753-01-01 12:00:00',
                ClaimedEnd: '1753-01-01 12:00:00'
            }

            this.staffS.postclaimvariation(variation).subscribe(res => {
                if (res) {
                    data.claimStart = '1800-01-01 00:00:00';
                    data.claimEnd = '1800-01-01 00:00:00';
                    this.globalS.sToast("Schedule Unsubmitted", "Success");
                    this.populate();
                }
            });

        }
    }

    submitAllBtnClick(submit: boolean) {

        const list = this.listOfData.filter(time => {
            const timeStart = format(parseISO(time.claimStart), "HH:mm");
            const timeEnd = format(parseISO(time.claimEnd), "HH:mm");

            if (!submit && timeStart !== '00:00' && timeEnd != '00:00')
                return time;
            
            if (submit && timeStart == '00:00' && timeEnd == '00:00')
                return time;
        });

        this.obsArray = [];
        
        list.forEach(data => {
            
            if (submit) {
                let variation: Dto.ClaimVariation = {
                    RecordNo: data.shiftbookNo,
                    ClaimedBy: this.token.nameid,
                    ClaimedDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    ClaimedStart: this.parseTimeToDate(data.activityTime.start_time),
                    ClaimedEnd: this.parseTimeToDate(data.activityTime.end_Time)
                }
                
                this.obsArray.push(this.staffS.postclaimvariation(variation));

                // this.staffS.postclaimvariation(variation).subscribe(res => {
                //     if (res) {
                //         data.claimStart = this.parseTimeToDate(data.activityTime.start_time);
                //         data.claimEnd = this.parseTimeToDate(data.activityTime.end_Time);
                //     }
                // });
            } 

            if (!submit) {
                let variation: Dto.ClaimVariation = {
                    RecordNo: data.shiftbookNo,
                    ClaimedBy: null,
                    ClaimedDate: '1753-01-01 12:00:00',
                    ClaimedStart: '1753-01-01 12:00:00',
                    ClaimedEnd: '1753-01-01 12:00:00'
                }

                this.obsArray.push(this.staffS.postclaimvariation(variation));

                // this.staffS.postclaimvariation(variation).subscribe(res => {
                //     if (res) {
                //         data.claimStart = '1800-01-01 00:00:00';
                //         data.claimEnd = '1800-01-01 00:00:00';
                //     }
                // });
            }
        })
        console.log(this.obsArray)
        forkJoin(this.obsArray).subscribe(data => {
            this.globalS.sToast("All queries processed!", "Success");
            this.populate();
        })
    }

    parseTimeToDate(time: string): string {
        return format(parseISO(time), '1753-01-01 HH:mm:ss');
    }
}
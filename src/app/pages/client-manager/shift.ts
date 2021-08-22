import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { TimeSheetService, GlobalService, StaffService, ClientService } from '@services/index';

import { Observable, Subject } from 'rxjs';
import { takeUntil, mergeMap, distinctUntilChanged, switchMap } from 'rxjs/operators';

import format from 'date-fns/format';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'shift-client',
    styles: [`
        .dot {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            display: inline-block;
            float: left;
            margin: 6px 7px 0 0;
        }

        .pending{
            background: #737373;
        }

        .accepted{
            background: #0079b8;
        }

        .completed{
            background: #2f8400;
        }

        .approved{
            background: #9b56bb;
        }

        .query{
            background: #fdcf08;
        }

        .billed{
            background: #004a70;
        }

        button.cancel-btn{
            float: right;
            margin-bottom: 10px;
            width: 5rem;
        }
        h2.unalloc{
            margin-bottom: 2rem;
            color: red;
        }

        .form-group span{
            font-size: 14px;
            font-weight: 500;
        }
    `],
    templateUrl: './shift.html'
})


export class ShiftClientManager implements OnInit, OnDestroy {
    dateFormat: string = 'dd/MM/yyyy';
    @Input() id;

    timesheets: Array<any>;

    tabStream = new Subject<number>();
    private unsubscribe = new Subject();

    loading: boolean = false;

    tabIndex: number;
    user: any;
    userObject: any;
    currUserObject: any;

    date = format(new Date(), 'yyyy/MM/dd');

    bookingCancellationType: string = "WithNotice";
    

    cancelBookingModal: boolean = false;
    currentShift: any;
    settings: any;
    isConfirmLoading: boolean = false;
    constructor(
        private timeS: TimeSheetService,
        private staffS: StaffService,
        private clientS: ClientService,
        private globalS: GlobalService
    ) {
        this.tabStream.pipe(
            takeUntil(this.unsubscribe),
            switchMap(data => {
                this.tabIndex = data;

                this.timesheets = []
                this.loading = true;
                switch (data) {
                    case 0:
                        return this.getShiftPending().pipe(takeUntil(this.unsubscribe));
                    case 1:
                        return this.getShiftAccepted().pipe(takeUntil(this.unsubscribe));
                    case 2:
                        return this.getShiftCompleted().pipe(takeUntil(this.unsubscribe));
                    case 3:
                        return this.getShiftApproved().pipe(takeUntil(this.unsubscribe));
                    case 4:
                        return this.getShiftQuery().pipe(takeUntil(this.unsubscribe));
                    case 5:
                        return this.getShiftBilled().pipe(takeUntil(this.unsubscribe));
                }
            })            
        ).subscribe(data => {
            this.loading = false;

            if(data && data.list)
                this.timesheets = data.list;
            
        
        });
    }

    ngOnInit() {
        this.user = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember).code : this.globalS.decode().code;
        this.userObject = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember) : this.globalS.decode();
        this.currUserObject = this.globalS.decode();

        console.log(this.currUserObject)
        this.tabStream.next(0);

        this.timeS.getuname(this.currUserObject.code)
            .pipe(
                takeUntil(this.unsubscribe),
                mergeMap(res => {

                    return this.staffS.getsettings(res.uname)
                })
            ).subscribe(settings => {
                this.settings = settings;
            });
    }

    ngOnDestroy() {

    }

    handleCancel() {
        this.cancelBookingModal = false;
    }

    nzSelectedIndexChange(index: number) {
        this.tabStream.next(index);
    }

    getShiftPending(): Observable<any> {
        return this.timeS.getshiftbooked({
            RecipientCode: this.user,
            ShiftDate: this.date,
            Pending: true
        });
    }

    getShiftAccepted(): Observable<any> {
        return this.timeS.getshiftbooked({
            RecipientCode: this.user,
            ShiftDate: this.date,
            Pending: false
        });
    }

    getShiftCompleted(): Observable<any> {
        return this.timeS.getshiftspecific({
            RecipientCode: this.user,
            ShiftDate: this.date,
            Approved: 0
        });
    }

    getShiftApproved(): Observable<any> {
        return this.timeS.getshiftspecific({
            RecipientCode: this.user,
            ShiftDate: this.date,
            Approved: 2
        });
    }

    getShiftQuery(): Observable<any> {
        return this.timeS.getshiftspecific({
            RecipientCode: this.user,
            ShiftDate: this.date,
            Approved: 1
        });
    }

    getShiftBilled(): Observable<any> {
        return this.timeS.getshiftspecific({
            RecipientCode: this.user,
            ShiftDate: this.date,
            Approved: 3
        });
    }

    setShift(data: any, index: number) {
        this.currentShift = data[index];
        this.isConfirmLoading = false;

        if (this.tabIndex === 0) {
            this.cancelBookingModal = true;
        } else {

        }
    }

    trackByIndex(_: number, data: any): number {
        return data.index;
    }

    cancelBooking() {
        

        var { date_Value, shiftbookNo, } = this.currentShift;
        var rosterDate = moment(date_Value).format('YYYY/MM/DD');
        var currentDate = moment(new Date()).format('YYYY/MM/DD');
        var bookTime: string = moment(this.currentShift.activity_Time.start_time).format("HH:MM");

        var dayDiff = Date.parse(rosterDate) - Date.parse(currentDate);
        dayDiff = dayDiff / (1000 * 60 * 60 * 24);

        if (dayDiff <= this.settings.minimumCancellationLeadTime) {
            this.globalS.eToast("Error", `Booking can not be cancelled ${this.settings.minimumCancellationLeadTime} day(s) prior from today's`);
            return;
        }
       
        this.isConfirmLoading = true;

        let booking = {
            RecordNo: shiftbookNo,
            ServiceType: this.bookingCancellationType,
            RosterDate: rosterDate,
            RosterTime: bookTime,
            Username: this.id,
            TraccsUser: this.globalS.decode().user,
            ManagerPersonId: this.globalS.decode().uniqueID,
            RecipientPersonId: this.userObject.uniqueID
        }

        this.clientS.postcancelbooking(booking)
            .subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Booking Cancelled');
                    this.tabStream.next(this.tabIndex);
                }
                this.cancelBookingModal = false;
            }, (err: HttpErrorResponse) => {
                this.isConfirmLoading = false;
                this.globalS.eToast('Error', 'An error occurred')
            }, () => {
                this.isConfirmLoading = false;
            });
    }

    approveShift(index: any){
        if(this.timesheets[index] && this.timesheets[index].shiftbookNo){
            const bookingNo = this.timesheets[index].shiftbookNo;

            this.timeS.updateshiftquery(bookingNo).subscribe(data => {
                if(data){
                    this.globalS.sToast('Success', 'Booking transferred to shift');
                    this.tabStream.next(this.tabIndex);
                }
            });
        }        
    }

    queryShift(index: any){
        if(this.timesheets[index] && this.timesheets[index].shiftbookNo){
            const bookingNo = this.timesheets[index].shiftbookNo;

            this.timeS.updateshiftquery(bookingNo).subscribe(data => {
                if(data){
                    this.globalS.sToast('Success', 'Booking transferred to query');
                    this.tabStream.next(this.tabIndex);
                }
            });
        }
    }
}
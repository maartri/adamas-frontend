import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { TimeSheetService, GlobalService, StaffService, ClientService } from '@services/index';

import { Observable, Subject } from 'rxjs';
import { takeUntil, mergeMap, distinctUntilChanged, switchMap } from 'rxjs/operators';

import format from 'date-fns/format';


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
    `],
    templateUrl: './shift.html'
})


export class ShiftClient implements OnInit, OnDestroy {
    dateFormat: string = 'dd/MM/yyyy';
    @Input() id;

    timesheets: Array<any>;

    tabStream = new Subject<number>();
    private unsubscribe = new Subject();

    loading: boolean = false;

    tabIndex: number;
    user: any;

    date = format(new Date(), 'yyyy/MM/dd');

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
        this.user = this.id || this.globalS.decode()['code'];
        this.tabStream.next(0);
    }

    ngOnDestroy() {

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

    setShift(data: any, i: number) {
        console.log(data);
        console.log(i);
        //this.currentShift = data;

        if (this.tabIndex === 0) {
            //this.cancelBookingAlertOpen = true;
        } else {

        }
    }



    trackByIndex(_: number, data: any): number {
        return data.index;
    }
}
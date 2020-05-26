import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { TimeSheetService, GlobalService, StaffService, ClientService } from '@services/index';

import { Observable, Subject } from 'rxjs';
import { takeUntil, mergeMap, distinctUntilChanged } from 'rxjs/operators';

import format from 'date-fns/format';

@Component({
    selector: 'preferences-client',
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
    templateUrl: './preferences.html'
})


export class PreferencesClient implements OnInit, OnDestroy {
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
            takeUntil(this.unsubscribe)
        ).subscribe(data => {

            this.tabIndex = data;

            this.timesheets = []
            this.loading = true;
            switch (data) {
                case 0:
                    this.getShiftPending().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        this.timesheets = data;
                        this.loading = false;
                    });
                    break;
                case 1:
                    this.getShiftAccepted().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        this.timesheets = data;
                        this.loading = false;
                    });
                    break;
                case 2:
                    this.getShiftCompleted().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        this.timesheets = data;
                        this.loading = false;
                    });
                    break;
                case 3:
                    this.getShiftApproved().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        this.timesheets = data
                        this.loading = false;
                    });
                    break;
                case 4:
                    this.getShiftQuery().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        this.timesheets = data;
                        this.loading = false;
                    });
                    break;
                case 5:
                    this.getShiftBilled().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        this.timesheets = data
                        this.loading = false;
                    });
                    break;
            }
        });
    }

    ngOnInit() {
        this.user = this.id || this.globalS.decode()['code'];
    }

    ngOnDestroy() {

    }

    nzSelectedIndexChange(index: number) {
        console.log(index);
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

}
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { takeUntil, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { TimeSheetService, GlobalService } from '@services/index';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';

import startOfMonth from 'date-fns/startOfMonth';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import format from 'date-fns/format';
import { GetTimesheet } from '@modules/modules';

export interface VirtualDataInterface {
    index: number;
    name: string;
    age: number;
    address: string;
}

@Component({
    styles: [`        
        .unapprove{
            background:#ffe1e1;
        }
        .approve{
            background:#d5ffd0;
        }
        nz-badge{
            float:left;
            margin-top: 2px;
        }
    `],
    templateUrl: './history.html'
})


export class HistoryProvider implements OnInit, OnDestroy {

    @ViewChild('virtualTable', { static: false }) nzTableComponent: NzTableComponent;
    private destroy$ = new Subject();

    listOfData: VirtualDataInterface[] = [];
    

    scrollToIndex(index: number): void {
        this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
    }

    trackByIndex(_: number, data: VirtualDataInterface): number {
        return data.index;
    }

    dateFormat: string = 'dd/MM/yyyy';



    @Input() id;
    private accountNo: string;
    private unsubscribe$ = new Subject();

    dateStream = new Subject<any>();
    dateRange: Array<any> = [];
    timesheets: Array<any> = [];
    loading: boolean = false;

    constructor(
        private globalS: GlobalService,
        private timeS: TimeSheetService
    ) {
        this.dateStream.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((x: any) => 
            {
                this.loading = true;
                return this.getTimeSheet({
                    AccountNo: this.accountNo,
                    personType: 'Staff',
                    startDate: format(this.dateRange[0], 'yyyy/MM/dd'),
                    endDate: format(this.dateRange[1], 'yyyy/MM/dd')
                })
            }), takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.loading = false;
                this.timesheets = data;
            })
    }

    ngOnInit() {
        
        this.accountNo = this.id || this.globalS.decode().code;
        this.dateRange[0] = startOfMonth(new Date());
        this.dateRange[1] = lastDayOfMonth(new Date());

        this.dateStream.next();

        const data = [];

        for (let i = 0; i < 20000; i++) {
            data.push({
                index: i,
                name: `Edward King`,
                age: 32,
                address: `London`
            });
        }
        this.listOfData = data;
    }

    ngAfterViewInit(): void {
        this.nzTableComponent.cdkVirtualScrollViewport.scrolledIndexChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: number) => {
                console.log('scroll index to', data);
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getTimeSheet(data: GetTimesheet): Observable<any> {
        return this.timeS.gettimesheets({
            AccountNo: data.AccountNo,
            personType: data.personType,
            startDate: data.startDate,
            endDate: data.endDate
        });
    }

    isApproved(data: any): string {
        return data ? '#87d068' : '#f50';
    }
}

import { takeUntil, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { TimeSheetService, GlobalService } from '@services/index';
import { Subject } from 'rxjs';

import * as moment from 'moment';
import { NzTableComponent } from 'ng-zorro-antd/table';

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
    selector: 'history-client',
    templateUrl: './history.html',
    styles: [
        `
        

        @media (max-width: 1000px)  {        


            .web-first{
                display:none;
            }
            .mobile-first{
                display:block;
            }

            .stackview {
                display: inline-block;
                width: 100%;          
            }        
            

        }

        @media (min-width:1000px) { 
            .web-first{
                display:block;
            }
            .mobile-first{
                display:none;
            }

        }

        
        table thead tr th{
            background: linear-gradient(to right, rgb(29, 166, 234), rgb(26, 172, 236));
            color: #fff;
            font-size: 12px;
            font-weight: normal;
        }
        td:nth-child(8),td:nth-child(9) {
            background:#e8ffe4;
        }
        td:nth-child(10){
            background:#cfffc6;
        }
        clr-checkbox {
            margin:0;
        }
        clr-checkbox >>> label::before{
            background:#fff !important;
            border:1px solid #757575 !important;
        }

        clr-checkbox >>> label::after{
            border-left: 2px solid #2b62ff !important;
            border-bottom: 2px solid #2b62ff !important;
        }

        tbody tr:hover{
            background:#f1f1f1;
        }
        .loading{
            text-align:center;
            margin-top:1rem;
        }
        .no-margin{
            margin:0;
        }
        clr-checkbox-wrapper >>> label{
            display: inherit !important;
        }
        table thead tr th{
            font-size:11px;
        }
        `
    ]
})

export class HistoryClient implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('virtualTable', { static: false }) nzTableComponent: NzTableComponent;
    private destroy$ = new Subject();

    listOfData: VirtualDataInterface[] = [];

    scrollToIndex(index: number): void {
        this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
    }

    trackByIndex(_: number, data: VirtualDataInterface): number {
        return data.index;
    }

    @Input() id;

    dateFormat: string = 'MMM dd yyyy';

    private accountNo: string;
    private unsubscribe$ = new Subject()

    dateStream = new Subject<any>();

    loading: boolean;
    timesheets: Array<any>;
    sDate: any;
    eDate: any;

    dateRange: Array<any> = [];

    constructor(
        private timeS: TimeSheetService,
        private globalS: GlobalService
    ) {
        this.dateStream.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((x: any) => {
                this.loading = true;
                return this.getTimeSheet({
                    AccountNo: this.accountNo,
                    personType: 'Recipient',
                    startDate: format(this.dateRange[0], 'yyyy/MM/dd'),
                    endDate: format(this.dateRange[1], 'yyyy/MM/dd')
                })
            }),
            takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.loading = false;
                this.timesheets = data;
            })

    }

    ngOnInit() {    
        this.accountNo = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember).code : this.globalS.decode().code;
        this.dateRange[0] = startOfMonth(new Date());
        this.dateRange[1] = lastDayOfMonth(new Date());

        this.dateStream.next();
    }

    ngAfterViewInit(): void {
        this.nzTableComponent.cdkVirtualScrollViewport.scrolledIndexChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: number) => {
                //console.log('scroll index to', data);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

        this.destroy$.next();
        this.destroy$.complete();
    }

    getTimeSheet(data: GetTimesheet) {
        this.timesheets = [];
        return this.timeS.gettimesheets({
            AccountNo: data.AccountNo,
            personType: data.personType,
            startDate: data.startDate,
            endDate: data.endDate
        })
    }
}

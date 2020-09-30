import { Component, OnInit } from '@angular/core';
import { GlobalService, ClientService } from '@services/index';
import { takeUntil, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Subject, EMPTY } from 'rxjs';
import * as moment from 'moment';

import startOfMonth from 'date-fns/startOfMonth';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';

@Component({
    templateUrl: './notes.html',
    styles: [`
    .form-group{
        margin-top:20px;
    }
    .date{
        font-size:14px;
        font-weight:500;
        padding-left:10px;
        color: #4d99d0;
    }
    tbody{
        font-size: 12px;
    }
    .even{
        background: #e4f0ff;
    }
    .package-table th{
        font-size:15px;
        padding: 5px !important;
    }

    nz-empty{
        margin-top:2rem;
    }
    tr td{
        border-bottom: 1px solid #a5a5a5;
    }
    `]
})

export class NotesClient implements OnInit {

    dateFormat: string = 'MMM dd yyyy';

    dateChangeEvent = new Subject<any>();
    OPdateChangeEvent = new Subject<any>();

    view = new Subject<number>();
    dateStream = new Subject<any>();

    viewNo: number = 1;

    private token: any;
    user: any = "";
    accountNo: string;

    loading: boolean = false;
    tableData: Array<any>;

    sDate: any;
    eDate: any;

    dateRange: Array<any> = [];

    OPDateRange: Array<any> = []

    constructor(
        private globalS: GlobalService,
        private clientS: ClientService
    ) {

        this.dateChangeEvent.pipe(
            switchMap((x: Array<any>) => {
                if (x.length < 2) {
                    return EMPTY;
                }
                return this.getShiftNotes(x);
            })
        ).subscribe(date => {
            this.loading = false;
            this.tableData = date;
        });

        this.OPdateChangeEvent.pipe(
            switchMap((x: Array<any>) => {
                if (x.length < 2) {
                    return EMPTY;
                }
                return this.getOPNotesWithDates(x, this.token.uniqueID);
            })
        ).subscribe(data => {
            this.loading = false;

            if (data)
                this.tableData = data.list;
        });

        this.view.subscribe(view => {
            this.viewNo = view;
            this.tableData = [];

            if (this.viewNo == 1) {
                // this.getOPNotes(this.token.uniqueID);
                this.OPdateChangeEvent.next(this.OPDateRange);
            }
                
            if (this.viewNo == 2)
                this.dateChangeEvent.next(this.dateRange);
        });
    }

    ngOnInit() {
        var token = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember) : this.globalS.decode();

        this.accountNo = token.code;
        this.token = token;        

        this.dateRange[0] = startOfMonth(new Date());
        this.dateRange[1] = lastDayOfMonth(new Date());

        this.OPDateRange[0] = startOfMonth(new Date());
        this.OPDateRange[1] = lastDayOfMonth(new Date());

        this.view.next(1);
    }

    isEven(index: number) {
        return index % 2 == 0;
    }

    getOPNotes(uniqueId: string) {
        this.loading = true;

        this.clientS.getopnotes(uniqueId).subscribe(data => {
            if (data)
                this.tableData = data.list;

            this.loading = false;
        });
    }

    getOPNotesWithDates(dates: Array<any> = null, uniqueId: any) {
        this.loading = true;
        return this.clientS.getopnoteswithdate({
            client: uniqueId,
            startDate: moment(dates[0]).format('YYYY/MM/DD'),
            endDate: moment(dates[1]).format('YYYY/MM/DD')
        });
    }

    getShiftNotes(dates: Array<any> = null) {
        this.loading = true;
        return this.clientS.getservicenotes({
            client: this.accountNo,
            startDate: moment(dates[0]).format('YYYY/MM/DD'),
            endDate: moment(dates[1]).format('YYYY/MM/DD')
        });
    }





    sortName: string | null = null;
    sortValue: string | null = null;
    searchAddress: string;
    listOfName = [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }];
    listOfAddress = [{ text: 'London', value: 'London' }, { text: 'Sidney', value: 'Sidney' }];
    listOfSearchName: string[] = [];
    listOfData: Array<{ name: string; age: number; address: string;[key: string]: string | number }> = [
        {
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park'
        },
        {
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park'
        },
        {
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park'
        },
        {
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park'
        }
    ];

    listOfDisplayData: Array<{ name: string; age: number; address: string;[key: string]: string | number }> = [
        ...this.listOfData
    ];

    sort(sort: { key: string; value: string }): void {
        this.sortName = sort.key;
        this.sortValue = sort.value;
        this.search();
    }

    filter(listOfSearchName: string[], searchAddress: string): void {
        this.listOfSearchName = listOfSearchName;
        this.searchAddress = searchAddress;
        this.search();
    }

    search(): void {
        /** filter data **/
        const filterFunc = (item: { name: string; age: number; address: string }) =>
            (this.searchAddress ? item.address.indexOf(this.searchAddress) !== -1 : true) &&
            (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);

        const data = this.tableData.filter(item => filterFunc(item));

        /** sort data **/
        if (this.sortName && this.sortValue) {
            this.tableData = data.sort((a, b) =>
                this.sortValue === 'ascend'
                    ? a[this.sortName!] > b[this.sortName!]
                        ? 1
                        : -1
                    : b[this.sortName!] > a[this.sortName!]
                        ? 1
                        : -1
            );
        } else {
            this.tableData = data;
        }
    }

    gwapo() {
        console.log('gwapo')
    }
}
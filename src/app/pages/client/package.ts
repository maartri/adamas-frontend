import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ClientService, GlobalService, PrintService } from '@services/index';
import { MonthPeriodFilter } from '@pipes/pipes';
import { APP_BASE_HREF, Location, PlatformLocation } from '@angular/common';

import { Subscription, Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import { switchMap, distinctUntilChanged, debounceTime, mergeMap, map, tap } from 'rxjs/operators';

import { GetPackage, JsConfig } from '@modules/modules';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { NzModalService } from 'ng-zorro-antd/modal';

const PRINT: string = 'PRINT';
const GENERATING: string = 'GENERATING';

@Component({
    selector: 'package-client',
    styles: [`
        nz-select, nz-date-picker {
            width: 250px;
        }
        label{
            display:block;
            margin-bottom:3px;
            font-weight:600;
        }
        .notice{
            font-size: 11px;
            padding: 5px;
            text-align: justify;
        }
        .total{
            background: #d2ffcc;
        }
        nz-descriptions{
            width:17rem;
        }
        nz-descriptions >>> table > tbody > tr:first-child > td:first-child {
            background: #adffb7;
        }
        nz-descriptions >>> table > tbody > tr:nth-child(4) > td:first-child {
            background: #adffb7;
        }
        button.print{
            float:right;
        }
        .title-col{
            background: #1790ff;
            color: #fff;
            font-weight: bold;
            font-size: 1rem;
        }
    `],
    templateUrl: './package.html',
    providers: [MonthPeriodFilter],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class PackageClient implements OnInit, OnDestroy {

    rpthttp = 'https://www.mark3nidad.com:5488/api/report';
    
    drawerVisible: boolean = false;
    generateReportBool: boolean = false;
    printGenStr: string = PRINT;

    tryDoctype: any;

    @Input() id: any;
    @Input() MINUS_MONTH: number = 0;

    private dateResult$: Observable<any>;
    private programResult$: Observable<any>;

    private dateStream = new Subject<string>();
    private programStream = new Subject<string>();
    private subscriptions$: Subscription[] = [];

    openB: any;
    closeB: any;
    continB: any;

    client: any;
    user: any;

    loading: boolean = false;
    program: any;
    programs: Array<string> = [];

    date: any;
    dataPackage: any;

    selectedValue = null;
    table: Array<any>;

    URL: string = '';

    hideportalbalance: boolean = false;

    constructor(
        private clientS: ClientService,
        private globalS: GlobalService,
        private monthPeriodFilter: MonthPeriodFilter,
        private platformLocation: PlatformLocation,
        private sanitizer: DomSanitizer,
        private printS: PrintService,
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        private ModalS: NzModalService
    ) {
        
        this.dateResult$ = this.dateStream.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((date: any) => {
                let data: GetPackage = {
                    Code: this.client.code,
                    PCode: this.program,
                    Date: moment(this.date).format('YYYY/MM/DD')
                }
                this.URL = '';
                this.dataPackage = data;
                return this.getPackages(data);
            }));

        this.programResult$ = this.programStream.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((program: any) => {
                let data: GetPackage = {
                    Code: this.client.code,
                    PCode: this.program,
                    Date: moment(this.date).format('YYYY/MM/DD')
                }
                this.URL = '';
                this.dataPackage = data;
                return this.getPackages(data);
            }))

        this.subscriptions$.push(this.dateResult$.pipe(
            mergeMap(x => {
                return this.clientS
                    .getbalances(this.dataPackage).pipe(
                        map(data => {
                            let balances = data;
                            x.balances = balances;
                            return x;
                        }))
            }))
            .subscribe(data => {

                this.saveFundingInLocalStorage(data);

                this.loading = false;
                this.computeBalances(data);
                this.table = data.list;

                this.generateURL();
                this.detectChanges();
                
            }));

        this.subscriptions$.push(this.programResult$.pipe(
            mergeMap(x => {
                return this.clientS.getbalances(this.dataPackage).pipe(
                    map(data => {
                        let balances = data;
                        x.balances = balances;
                        return x;
                    }))
            }))
            .subscribe(data => {

                this.saveFundingInLocalStorage(data);

                this.loading = false;
                this.computeBalances(data);
                this.table = data.list;
                
                this.generateURL();
                this.detectChanges();
            }));
    }

    generateURL() {
        var location = ((this.platformLocation as any).location);
        if (location && location.pathname) {
            this.URL = `${(this.platformLocation as any).location.origin}${location.pathname}StaticFiles/package.html`;
        } else {
            this.URL = `${(this.platformLocation as any).location.origin}/StaticFiles/package.html`;
        }
    }

    ngOnInit() {
        this.client = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember) : this.globalS.decode();

        this.clientS.getprofile(this.client.code).subscribe(data => {
            this.user = data;
        })

        this.clientS.getactiveprogram({ IsActive: true, Code: this.client.code })
            .subscribe(data => {
                this.loading = false;

                this.programs = data.data
                this.program = this.programs[0];
                this.date = moment().subtract(this.MINUS_MONTH, 'months').format('YYYY-MM-DD')
                this.dateStream.next();

                this.detectChanges();
                               
            })

        this.clientS.gethideportalbalance(this.client.user).subscribe(data => {
            this.hideportalbalance = false;
        });
    }

    ngOnDestroy() {
        this.subscriptions$.forEach(x => {
            x.unsubscribe();
        });

        this.programStream.next();
        this.dateStream.next();

        this.programStream.complete();
        this.dateStream.complete();
    }

    detectChanges(){
        this.cd.detectChanges();
        this.cd.markForCheck();
    }

    saveFundingInLocalStorage(data: any) {
        let packageObject = {
            data: data,
            recipient: `${this.user.title} ${this.user.firstName}  ${this.user.surnameOrg}`,
            accountNo: `${this.user.accountNo}`,
            period: this.monthPeriodFilter.transform(this.date),
            openingBalance: this.openB,
            closingBalance: this.closeB,
            contingency: this.continB,
            totalBalance: this.closeB + this.continB
        }

        this.globalS.packageStatement = JSON.stringify(packageObject);
    }

    programChanges(program: any) {
        this.loading = true;
        this.programStream.next(program);
    }

    dateChanges(date: any) {        
        this.loading = true;
        this.dateStream.next(date);
    }

    getPackages(data: GetPackage) {
        return this.clientS.getpackages(data);
    }

    computeBalances(data: any): void {
        if (data && data.list && (data.list).length == 0) {
            this.openB = 0;
            this.closeB = 0;
            this.continB = 0;
            return;
        }
        this.openB = (data.balances.list).length > 0 ? this.getOpeningBalance(data.balances.list) : 0;
        this.closeB = (data.balances.list).length > 0 ? this.getClosingBalance(data.balances.list) : 0;
        this.continB = (data.balances.list).length > 0 ? this.getContingencyBalance(data.balances.list) : 0;
    }

    getContingencyBalance(data: any) {
        let sum = 0;
        data.forEach(el => {
            sum = sum + el.bankedContingency
        });
        return sum
    }

    getClosingBalance(date: any): any {
        if (date.length == 2) {
            let maxDate = date[0];
            date.forEach(data => {
                if (new Date(data.periodEnd) > new Date(maxDate.periodEnd))
                    maxDate = data;
            });
            return maxDate.balance;
        }
    }

    getOpeningBalance(date: any): any {
        if (date.length == 2) {
            let minDate = date[0];
            date.forEach(data => {
                if (new Date(data.periodEnd) < new Date(minDate.periodEnd))
                    minDate = data;
            });
            return minDate.balance;
        }
    }

    printPackage(): void{
        console.log(this.table);
        // return;
        var fQuery = "Select CONVERT(varchar, [DetailDate],105) as Field1, Detail as Field2, CONVERT(varchar, [AlarmDate],105) as Field4, Creator as Field3 From History HI INNER JOIN Staff ST ON ST.[UniqueID] = HI.[PersonID] WHERE ST.[AccountNo] = '"+this.user.code+"' AND HI.DeletedRecord <> 1 AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND ExtraDetail1 = 'OPNOTE' ORDER BY DetailDate DESC, RecordNumber DESC";

        const user = {
            recipient: `${this.user.title} ${this.user.firstName} ${this.user.surnameOrg}`,
            accountNo: this.user.accountNo,
            period: this.monthPeriodFilter.transform(this.date)
        }

        const balances = {
            opening: `$${this.openB.toLocaleString()}`,
            balance: `$${this.closeB.toLocaleString()}`,
            contingency: `$${this.continB.toLocaleString()}`,
            total: `$${(this.closeB + this.continB).toLocaleString()}`,
        }

        const data = {
            "template": { "_id": "MtyAvCbVCMDMpPeL" },
            "options": {
                "reports": { "save": false },
                "txtTitle": "Staff OP NOTES List",
                "sql": fQuery,
                "body": this.table,
                "profile": user,
                "balances": balances
            }
        }
        this.generateReportBool = true;
        this.printGenStr = GENERATING;

        this.printS.print(data).subscribe((blob: any) => {
            this.drawerVisible = true;
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {            
            this.loading = false;
            this.ModalS.error({
                nzTitle: 'TRACCS',
                nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                nzOnOk: () => {
                    this.drawerVisible = false;
                },
            });
        }, () =>{
            this.generateReportBool = false;
            this.printGenStr = PRINT;
        });

        return;
        
    }

    handleCancelTop(): void {
        this.drawerVisible = false;
    }
}
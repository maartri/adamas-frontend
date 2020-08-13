import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { mergeMap, takeUntil, concatMap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { forkJoin, Subscription, Observable, Subject, EMPTY, of } from 'rxjs';

import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';

import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { NzStepsModule, NzStepComponent } from 'ng-zorro-antd/steps';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO'
import addMinutes from 'date-fns/addMinutes'
import isSameDay from 'date-fns/isSameDay'

interface AddTimesheetModalInterface {
    index: number,
    name: string
}

export interface TreeNodeInterface {
  key: number;
  name?: string;
  shiftbookNo?: any;
  activity?: any;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}


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
        .selected td{
            background: #d5ffca;
        }
        nz-step >>> .ant-steps-item-container .ant-steps-item-content{
            width: auto !important;
        }
        nz-select{
            width: 11.4rem;
        }
        .time-duration{
            font-weight: 500; 
            margin-top: 8px;
        }
        .calculations{
            
        }
        nz-descriptions >>> .ant-descriptions-view tr td.ant-descriptions-item-label{
            padding: 4px 16px;
        }
        nz-descriptions >>> div table tbody tr:last-child td:last-child {
            background: #e1ffdc;
        }
        nz-descriptions >>> div table tbody tr td{
            font-size:11px;
        }
        .notes{
            max-height: 3rem;
            overflow: hidden;            
        }
        .atay {
            font-size: 10px !important;
            white-space: break-spaces !important;
            height: 8rem !important;
            overflow: auto !important;
        }
        nz-alert >>> .ant-alert.ant-alert-no-icon{
            padding:4px 15px;
        }
        
    `],
    templateUrl: './timesheet.html',
})


export class TimesheetAdmin implements OnInit, OnDestroy, AfterViewInit {

    private unsubscribe: Subject<void> = new Subject();
    private picked$: Subscription;

    loading: boolean = false;

    timesheets: Array<any> = [];
    timesheetsGroup: Array<any> = [];   

    index: number = 0;
    resultMapData: Array<any> = [];

    currentDate: string;
    payPeriodEndDate: Date;
    unitsArr: Array<string> = ['HOUR', 'SERVICE'];

    activity_value: number;
    durationObject: any;

    // 0 = staff; 1 = recipient
    view: number = 0;
    viewType: any;

    parserPercent = (value: string) => value.replace(' %', '');
    parserDollar = (value: string) => value.replace('$ ', '');
    formatterDollar = (value: number) => `${value > -1 || !value ? `$ ${value}` : ''}`;
    formatterPercent = (value: number) => `${value > -1 || !value ? `% ${value}` : ''}`;

    overlapValue: any;
    dateFormat: string = 'dd/MM/yyyy'

    timesheetForm: FormGroup;
    modalTimesheetValues: Array<AddTimesheetModalInterface> = [
        {
            index: 1,
            name: 'ADMINISTRATION'
        },
        {
            index: 2,
            name: 'ALLOWANCE CHARGEABLE'
        },
        {
            index: 3,
            name: 'ALLOWANCE NON-CHARGEABLE'
        },
        {
            index: 4,
            name: 'CASE MANAGEMENT'
        },
        {
            index: 5,
            name: 'ITEM'
        },
        {
            index: 6,
            name: 'SLEEPOVER'
        },
        {
            index: 7,
            name: 'TRAVEL TIME'
        },
        {
            index: 8,
            name: 'SERVICE'
        },
    ];

    agencyDefinedGroup: string;

    today = new Date();

    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);

    payTotal: CalculatedPay;
    selected: any = null;

    selectAll: boolean = false;
    overlapVisible: boolean = false;
    addTimesheetVisible: boolean = false;
    multipleRecipientShow: boolean = false;
    isTravelTimeChargeable: boolean = false;
    isSleepOver: boolean = false;
    payUnits: any;

    rosterGroup: string;
    Object = Object;
    mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

    collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
        console.log(data)
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key)!;
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }

    convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
        const stack: TreeNodeInterface[] = [];
        const array: TreeNodeInterface[] = [];
        const hashMap = {};

        stack.push({ ...root, level: 0, expand: true });
        // console.log(stack);
        while (stack.length !== 0) {
            const node = stack.pop()!;
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
                }
            }
        }
        // console.log(array);
        return array;
    }

    visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    constructor(
        private timeS: TimeSheetService,
        private globalS: GlobalService,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private staffS:StaffService,
        private clientS: ClientService,
        private listS: ListService
    ) {
        cd.detach();

        this.currentDate = format(new Date(), 'MM-dd-yyyy');
    }

    ngOnInit(): void{
        this.buildForm();        
    }

    buildForm() {
        this.timesheetForm = this.formBuilder.group({
            date: [this.payPeriodEndDate, Validators.required],
            serviceType: ['', Validators.required],
            program: ['', Validators.required],
            serviceActivity: ['', Validators.required],
            payType: ['', Validators.required],
            analysisCode: [''],
            recipientCode:  [''],
            haccType: '',
            staffCode:  [''],
            debtor:  [''],
            isMultipleRecipient: false,
            isTravelTimeChargeable: false,
            sleepOverTime: '',
            time: this.formBuilder.group({
                startTime:  [''],
                endTime:  [''],
            }),
            pay: this.formBuilder.group({
                unit:  ['HOUR'],
                rate:  ['0'],
                quantity:  ['1'],
                position: ''
            }),
            bill: this.formBuilder.group({
                unit: ['HOUR'],
                rate: ['0'],
                quantity: ['1'],
                tax: '1'
            }),
        })

        this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        this.fixStartTimeDefault();

        this.timesheetForm.get('time.startTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        });

        this.timesheetForm.get('time.startTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        });

        this.timesheetForm.get('isMultipleRecipient').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(d => {
                const { serviceType } = this.timesheetForm.value;
                return this.GETPROGRAMS(serviceType);
            })).subscribe(data => {
                console.log(data);
            });

        this.timesheetForm.get('payType').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(d => {
                if(!d) return EMPTY;
                return this.timeS.getpayunits(d);
            })
        ).subscribe(d => {
            this.timesheetForm.patchValue({
                pay: {
                    unit: d.unit,
                    rate: d.amount,
                    quantity: (this.durationObject.duration) ? 
                        (((this.durationObject.duration * 5) / 60)).toFixed(2) : 0
                }
            });
        });

        this.timesheetForm.get('time.endTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        });


        this.timesheetForm.get('recipientCode').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                this.timesheetForm.patchValue({
                    debtor: x
                });
                return this.GETPROGRAMS(x)
            })
        ).subscribe((d: Array<any>) => {
            this.programsList = d;

            if(d && d.length == 1){
                this.timesheetForm.patchValue({
                    program: d[0].ProgName
                });
            }
            
        });

        this.timesheetForm.get('debtor').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                if(this.selected.option == 0) return EMPTY;
                
                return this.GETPROGRAMS(x)
            })
        ).subscribe(d => {
            this.programsList = d;
        });

        this.timesheetForm.get('serviceType').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                this.clearLowerLevelInputs();

                this.multipleRecipientShow = this.isServiceTypeMultipleRecipient(x);
                this.isTravelTimeChargeable = this.isTravelTimeChargeableProcess(x);
                this.isSleepOver = this.isSleepOverProcess(x);

                if (!x) return EMPTY;
                return forkJoin(
                    this.GETANALYSISCODE(),
                    this.GETPAYTYPE(x),
                    this.GETPROGRAMS(x)
                )
            })
        ).subscribe(d => {
            this.analysisCodeList = d[0];
            this.payTypeList = d[1];
            this.programsList = d[2];

            if(this.viewType == 'Recipient'){
                this.timesheetForm.patchValue({
                    analysisCode: this.agencyDefinedGroup
                });
            }
        });

        this.timesheetForm.get('program').valueChanges.pipe(
            distinctUntilChanged(),
            switchMap(x => {
                this.serviceActivityList = [];
                this.timesheetForm.patchValue({
                    serviceActivity: null
                });
                return this.GETSERVICEACTIVITY(x)
            })
        ).subscribe((d: Array<any>) => {

            this.serviceActivityList = d;

            if(d && d.length == 1){
                this.timesheetForm.patchValue({
                    serviceActivity: d[0].activity
                });
            }
        });

        this.timesheetForm.get('serviceActivity').valueChanges.pipe(
            distinctUntilChanged(),
            switchMap(x => {
                if (!x) {
                    this.rosterGroup = '';
                    return EMPTY;
                };
                return this.GETROSTERGROUP(x)
            })
        ).subscribe(d => {
            if (d.length > 1) return false;
            this.rosterGroup = (d[0].RosterGroup).toUpperCase();
            this.GET_ACTIVITY_VALUE((this.rosterGroup).trim());

            this.timesheetForm.patchValue({
                haccType: this.rosterGroup
            })
        });        
    }

    GET_ACTIVITY_VALUE(roster: string) {
        // ADMINISTRATION
        // ADMISSION
        // ALLOWANCE
        // CENTREBASED
        // GROUPACTIVITY
        // ITEM
        // ONEONONE
        // RECPTABSENCE
        // SALARY
        // SLEEPOVER
        // TRANSPORT
        // TRAVELTIME

        this.activity_value = 0;

        if (roster === 'ADMINISTRATION') {
            this.activity_value = 6;
        }

        if (roster === 'ADMISSION') {
            this.activity_value = 7;
        }

        if (roster === 'ALLOWANCE') {
            this.activity_value = 9;
        }
        
        if (roster === 'CENTREBASED') {
            this.activity_value = 11;
        }

        if (roster === 'GROUPACTIVITY') {
            this.activity_value = 12;
        }

        if (roster === 'ITEM') {
            this.activity_value = 14;
        }

        if (roster === 'ONEONONE') {
            this.activity_value = 2;
        }

        if (roster === 'RECPTABSENCE') {
            this.activity_value = 6;
        }

        if (roster === 'SALARY') {
            this.activity_value = 0;
        }

        if (roster === 'SLEEPOVER') {
            this.activity_value = 8;
        }

        if (roster === 'TRANSPORT') {
            this.activity_value = 10;
        }

        if (roster === 'TRAVEL TIME') {
            this.activity_value = 5;
        }
    }

    isEndSteps() {
        if (this.rosterGroup === 'ALLOWANCE') {
            return this.current >= 3;
        }
        else {
            return this.current >= 3;
        }
    }
    
    clearLowerLevelInputs() {

        this.timesheetForm.patchValue({
            recipientCode: null,
            debtor: null,
            program: null,
            serviceActivity: null,
            analysisCode: null,
            time: {
                startTime: '',
                endTime: '',
            },
            pay: {
                unit: 'HOUR',
                rate: '0',
                quantity: '1',
                position: ''
            },
            bill: {
                unit: 'HOUR',
                rate: '0',
                quantity: '1',
                tax: '0'
            },
        });
    }

    empty: any = [];
    temp: any;
    recurse(hehe: any, indexObj: any = null) {
        this.temp = "";
        for (var property in hehe) {            
            if (Object.prototype.toString.call(hehe[property]) == '[object Object]') {
                if (indexObj) {
                    let child = indexObj.child.push({
                        name: property,
                        child: hehe[property]
                    });
                    this.recurse(hehe[property], child)
                }

                if (indexObj == null) {
                    let child = this.empty.push({
                        name: property,
                        child: hehe[property]
                    })
                    this.recurse(hehe[property], child);
                }
            }
            if (Object.prototype.toString.call(hehe[property]) == '[object Array]') {
                return hehe[property]
            }
        }
    }   

    ngOnDestroy(): void{
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    ngAfterViewInit(): void{
        this.staffS.getpayperiod().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.payPeriodEndDate = parseISO(data.end_Date);
            console.log(this.payPeriodEndDate)
        });

        this.cd.reattach();
        this.cd.detectChanges();
    }

    trackByFn(index, item) {
        return item.id;
    }

    picked(data: any) {
        console.log(data);
        if (!data.data) {
            this.timesheets = [];
            this.selected = null;
            return;
        }

        this.selected = data;

        this.viewType = this.whatType(data.option);
        this.loading = true;

        if (this.picked$) {
            this.picked$.unsubscribe();
        }

        if(this.viewType == 'Recipient'){
            this.clientS.getagencydefinedgroup(this.selected.data)
                .subscribe(data => {
                    this.agencyDefinedGroup = data.data;
                });
        }

        this.picked$ = this.timeS.gettimesheets({
            AccountNo: data.data,
            personType: this.viewType
        }).pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {

                this.loading = false;

                this.timesheets = data.map(x => {
                    return {
                        shiftbookNo: x.shiftbookNo,
                        date: x.activityDate,
                        startTime: this.fixDateTime(x.activityDate, x.activity_Time.start_time),
                        endTime: this.fixDateTime(x.activityDate, x.activity_Time.end_Time),
                        duration: x.activity_Time.calculated_Duration,
                        durationNumber: x.activity_Time.duration,
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
                        analysisCode: x.anal

                    }
                });
                
                // this.timesheetsGroup = this.nest(this.timesheets, ['activity']);
                // // console.log(JSON.stringify(this.timesheetsGroup));
                    
                // this.index = 0;
                
                // //this.resultMapData = this.recurseObjOuterLoop(this.timesheetsGroup);
                // this.resultMapData = this.listOfMapData
                // console.log(this.resultMapData)
                
                // this.resultMapData.forEach(item => {
                //     this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
                //     console.log(this.convertTreeToList(item));
                // });
                
                // console.log(this.mapOfExpandedData)
            });
        
        this.getComputedPay(data).subscribe(x => this.computeHoursAndPay(x));
        
        this.selectAll = false;
    }

    getComputedPay(data: any = this.selected): Observable<any>{
        return this.timeS.getcomputetimesheet({
            AccountName: data.data,
            IsCarerCode: this.viewType == 'Staff' ? true : false
        });
    }

    computeHoursAndPay(compute: any): void{
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
    }

    fixDateTime(date: string, timedate: string) {
        var currentDate = parseISO(date);
        var currentTime = parseISO(timedate);

        var newDate = format(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                currentTime.getHours(),
                currentTime.getMinutes(),
                currentTime.getSeconds()
            ), "yyyy-MM-dd'T'hh:mm:ss");
        
        return newDate;
    }

    recurseSubDirectories(data: any) {
        var arr: Array<TreeNodeInterface> = [];        
        this.index++;

        if (Object.prototype.toString.call(data) === '[object Array]') {
            arr.push({
                key: this.index,
                name: Object.keys(data)[0],
                children: data
            });
        }

        if (Object.prototype.toString.call(data) === '[object Object]') {
            for (var key in data) {
                arr.push({
                    key: this.index,
                    name: key,
                    children: this.recurseSubDirectories(data[key])
                });
            }
        }

        return arr;
    }

    recurseObjOuterLoop(data: any) {
        var out = [];        
        for (var key in data) {
            if (Object.prototype.toString.call(data[key]) === '[object Object]') {
                out.push({ key: this.index, name: key, children: { ...(this.recurseSubDirectories(data[key])) } });
                this.recurseObjOuterLoop(data[key]);
            }

            if (Object.prototype.toString.call(data[key]) === '[object Array]') {
                out.push({ key: this.index++, name: key, children: { ...data[key] } });
            }
        }
        return out;
    }

    nest = (seq: any[], keys: Array<string | ((obj: any) => string)>) => {
        if (!keys.length) {
            return seq;
        }
        const [first, ...rest] = keys;
        return _.mapValues(_.groupBy(seq, first), (value) => this.nest(value, rest));
    };

    clickme(){
        console.log('hehe')
    }

    confirm(index: number) {
        if (!this.selected && this.timesheets.length > 0) return;

        if (index == 1) {
            this.addTimesheetVisible = true;
            this.resetAddTimesheetModal();
        }

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

        if (index == 4) {
            this.overlapVisible = true;
            //this.OVERLAP_PROCESS(this.timesheets);           

            // this.modalService.confirm({
            //     nzTitle: '<b>Automatic Overlap Removal</b>',
            //     nzContent: `
            //         <div>This action will force any overlapping shifts to a later start time to remove the overlap. All entries must be either approved or unapproved. You cannot use this function if some entries are approved and others are not.</div>
            //         <div>If you want to force a timegap between overlapping shifts - select 5 minutes from the drop down or if a gap is not needed accept the default of 0</div>
            //         <butto (click)="clickme()">Click</butto>
            //     `,
            //     nzOnOk: () => this.process(index)
            // });
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

    handleCancel() {
        this.overlapVisible = false;
        this.overlapValue = null;
        this.addTimesheetVisible = false;
    }

    removeOverlap() {
        this.OVERLAP_PROCESS(this.timesheets, this.overlapValue);
    }

    selectAllChange(event: any) {
        this.cd.detach();
        this.timesheets.forEach(x => x.selected = event);
        this.cd.reattach();
        this.cd.detectChanges();
    }


    selectedTimesheet(event: any, data: any) {
        console.log(event);
        data.selected = event;
        // this.timesheets = [...this.timesheets, data]
        // this.timesheets = this.timesheets.filter(x => x.shiftbookNo == data.shiftbookNo);

        this.cd.detectChanges();
    }

    ifRosterGroupHasTimePayBills(rosterGroup: string) {
        return (
            rosterGroup === 'ADMINISTRATION' ||
            rosterGroup === 'ADMISSION' ||
            rosterGroup === 'CENTREBASED' ||
            rosterGroup === 'GROUPACTIVITY' ||
            rosterGroup === 'ITEM' ||
            rosterGroup === 'ONEONONE' ||
            rosterGroup === 'SLEEPOVER' ||
            rosterGroup === 'TRANSPORT' ||
            rosterGroup === 'TRAVELTIME'
        );
    }

    OVERLAP_PROCESS(rosters: Array<any>, overlapCounter: number) {

        let _unique = null;
        let endTime: Date;

        var cloneRosters = _.cloneDeep(rosters);

        cloneRosters.forEach(roster => {
            if (roster && roster.date != _unique) {
                _unique = roster.date;
                endTime = parseISO(roster.endTime);
            } else {
                if (overlapCounter == 0) {
                    roster.startTime = format(endTime, "yyyy-MM-dd'T'hh:mm:ss");
                    roster.endTime = format(addMinutes(parseISO(roster.startTime), roster.durationNumber * 5), "yyyy-MM-dd'T'hh:mm:ss");
                    endTime = parseISO(roster.endTime);
                }
                
                if (overlapCounter == 5){
                    roster.startTime = format(addMinutes(endTime, 5), "yyyy-MM-dd'T'hh:mm:ss");
                    roster.endTime = format(addMinutes(parseISO(roster.startTime), roster.durationNumber * 5), "yyyy-MM-dd'T'hh:mm:ss");
                    endTime = parseISO(roster.endTime);
                }
            }
        });

        var inputs = cloneRosters.map(x => {
            return {
                RecordNo: x.shiftbookNo,
                startTime: format(parseISO(x.startTime), "hh:mm")
            }
        })

        var ss = {
            OverLaps: inputs
        }

        this.timeS.updatetimeoverlap(ss).subscribe(data => {
            this.globalS.sToast('Success', 'Time Overlap Processed');
            this.picked(this.selected);
            this.handleCancel();
        });
    }

    checkBoxChange(event: any, timesheet: any){
   
        const tdate = parseISO(timesheet.date);
        console.log(timesheet)
        this.timeS.getclosedate({ program: timesheet.program })
            .pipe(
                switchMap(x => {
                    if(x.closeDate == null){
                        return this.timeS.selectedApprove({
                            AccountNo: timesheet.shiftbookNo,
                            PersonType: this.GET_VIEW(),
                            Status: event
                        });
                    }
                    
                    const closeDate = parseISO(x.closeDate);

                    if(closeDate.toString() !== 'Invalid Date' && tdate.toString() !== 'Invalid Date' && (isSameDay(tdate, closeDate) || tdate > closeDate)){                    
                        return this.timeS.selectedApprove({
                            AccountNo: timesheet.shiftbookNo,
                            PersonType: this.GET_VIEW(),
                            Status: event
                        });                        
                    } else {
                        timesheet.approved = !event;
                        this.globalS.eToast('Error', `You cannot approve/unapprove entries for this program on that date - as the program is closed for action prior to ${ format(closeDate,'dd/MM/yyyy') }`)
                        return EMPTY;
                    }                    
                }),
                switchMap( x => this.getComputedPay())
            ).subscribe(data => {
                this.computeHoursAndPay(data);
            });           
    }

    GETBILLINGRATE(){
        
    }

    GET_VIEW(): string {
        return this.selected.option == 1 ? 'Recipient' : 'Staff'
    }

    process(index: number) {
        if (!this.selected && this.timesheets.length > 0) return;

        if (index == 2) {
            const shiftArray = this.timesheets.filter(x => x.selected).map(x => x.shiftbookNo)

            if(shiftArray.length == 0){
                this.globalS.wToast('No Highlighted Item','Warning');
                return;
            }
            
            this.timeS.deleteshift(shiftArray)
                .subscribe(data => {
                    this.globalS.sToast('Success','Selected items are deleted');
                    this.picked(this.selected);                
                });
        }

        if (index == 3) {
            
            // const shiftArray = this.timesheets.filter(x => x.app).map(x => x.shiftbookNo)

            let input = {
                AccountNo: this.selected.data,
                PersonType: this.GET_VIEW(),
                Status: 1
            }

            console.log(input);
            this.timeS.deleteunapprovedall(input).subscribe(data => {
                this.globalS.sToast('Success', data.message);
                this.picked(this.selected);              
            });
        }

        if (index == 5) {
            this.timeS.approveAll({
                accountNo: this.selected.data,
                PersonType: this.GET_VIEW()
            }).subscribe(data => {
                this.globalS.sToast('Success', 'All items are approved');
                this.picked(this.selected);                
            });
        }

        if (index == 6) {
            this.timeS.unapproveAll({
                accountNo: this.selected.data,
                PersonType: this.GET_VIEW()
            }).subscribe(data => {
                this.globalS.sToast('Success', 'All items are unapproved');
                this.picked(this.selected);
            });
        }
    }

    isServiceTypeMultipleRecipient(type: string): boolean {
        return type === 'SERVICE';
    }

    isTravelTimeChargeableProcess(type: string): boolean {
        return type === 'TRAVEL TIME';
    }

    isSleepOverProcess(type: string): boolean {
        return type == 'SLEEPOVER';
    }


    whatType(data: number): string {
        return data == 0 ? 'Staff' : 'Recipient';
    }    
    duration: any;

    ngModelChangeStart(event): void{
        this.timesheetForm.patchValue({
            time: {
                startTime: event
            }
        })
    }

    ngModelChangeEnd(event): void {
        this.timesheetForm.patchValue({
            time: {
                endTime: event
            }
        })
    }

    GETPROGRAMS(type: string): Observable<any> {
        let sql;
        if (!type) return EMPTY;
        const { isMultipleRecipient } = this.timesheetForm.value;
        if (type === 'ADMINISTRATION' || type === 'ALLOWANCE NON-CHARGEABLE' || type === 'ITEM' || (type == 'SERVICE' && !isMultipleRecipient)) {
            sql = `SELECT Distinct [Name] AS ProgName FROM HumanResourceTypes WHERE [group] = 'PROGRAMS' AND ISNULL(UserYesNo3,0) = 0 AND (EndDate Is Null OR EndDate >=  '${this.currentDate}') ORDER BY [ProgName]`;
        } else {
            sql = `SELECT Distinct [Program] AS ProgName FROM RecipientPrograms 
                INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID 
                WHERE Recipients.AccountNo = '${type}' AND RecipientPrograms.ProgramStatus IN ('ACTIVE', 'WAITING LIST') ORDER BY [ProgName]`
        }
        if (!sql) return EMPTY;
        return this.listS.getlist(sql);
    }

    GETRECIPIENT(view: number): string {
        const { recipientCode, debtor, serviceType, isMultipleRecipient } = this.timesheetForm.value;
        if(view == 0){
            if(serviceType == 'SERVICE' && isMultipleRecipient) return '!MULTIPLE';
            if(this.globalS.isEmpty(recipientCode)) return '!INTERNAL';
            return recipientCode;
        }

        if(view == 1){
            return debtor;
        }
    }

    GETSERVICEACTIVITY(program: any): Observable<any> {

        const { serviceType } = this.timesheetForm.value;

        console.log(this.selected.option)

        if (!program) return EMPTY;
        console.log(this.timesheetForm.value)

        if (serviceType != 'ADMINISTRATION' && serviceType != 'ALLOWANCE NON-CHARGEABLE' && serviceType != 'ITEM'  || serviceType != 'SERVICE') {
            // const { recipientCode, debtor } = this.timesheetForm.value;
            return this.listS.getserviceactivityall({
                program,
                recipient: this.GETRECIPIENT(this.selected.option),
                mainGroup: serviceType,
                viewType: this.viewType
            });
        }
        else {
            let sql = `SELECT DISTINCT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid 
                WHERE SO.serviceprogram = '${ program}' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] = 'ADMINISTRATION' AND processclassification = 'OUTPUT' AND ( ITM.enddate IS NULL OR ITM.enddate >= '${this.currentDate}' )) ORDER BY [service type]`;
            
            // let sql = `SELECT DISTINCT [Service Type] AS activity FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            //     WHERE SO.ServiceProgram = '${ program}' AND EXISTS (SELECT Title FROM ItemTypes ITM WHERE Title = SO.[Service Type] AND 
            //     ProcessClassification = 'OUTPUT' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}')) ORDER BY [Service Type]`;
            return this.listS.getlist(sql);
        }
    }

    GETANALYSISCODE(): Observable<any>{
        return this.listS.getserviceregion();
    }

    GETROSTERGROUP(activity: string): Observable<any>{
        if (!activity) return EMPTY;
        return this.listS.getlist(`SELECT RosterGroup, Title FROM ItemTypes WHERE Title= '${activity}'`);
    }

    GETPAYTYPE(type: string): Observable<any> {
        // `SELECT TOP 1 RosterGroup, Title FROM  ItemTypes WHERE Title = '${type}'`
        let sql;
        if (!type) return EMPTY;
        if (type === 'ALLOWANCE CHARGEABLE' || type === 'ALLOWANCE NON-CHARGEABLE') {
            sql = `SELECT Recnum, Title FROM ItemTypes WHERE RosterGroup = 'ALLOWANCE ' 
                AND Status = 'NONATTRIBUTABLE' AND ProcessClassification = 'INPUT' AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY TITLE`
        } else {
            sql = `SELECT Recnum, LTRIM(RIGHT(Title, LEN(Title) - 0)) AS Title
            FROM ItemTypes WHERE RosterGroup = 'SALARY'   AND Status = 'NONATTRIBUTABLE'   AND ProcessClassification = 'INPUT' AND Title BETWEEN '' 
            AND 'zzzzzzzzzz'AND (EndDate Is Null OR EndDate >= '${ this.currentDate }') ORDER BY TITLE`
        }
        return this.listS.getlist(sql);
    }


    // Add Timesheet

    current = 0;
    nextDisabled: boolean = false;
    programsList: Array<any> = [];
    serviceActivityList: Array<any>;
    payTypeList: Array<any> = [];
    analysisCodeList: Array<any> = []
    
    showRecipient(): boolean  {
        const { serviceType, isMultipleRecipient } = this.timesheetForm.value;            
        return ((serviceType !== 'ADMINISTRATION' && serviceType !== 'ALLOWANCE NON-CHARGEABLE') && !isMultipleRecipient);
    }

    canProceed() {
        const { date, serviceType } = this.timesheetForm.value;

        if (this.current == 0) {
            if (!date || !serviceType) {
                this.nextDisabled = true;
            } else {
                this.nextDisabled = false;
            }
            return true;
        }

        if (this.current == 1) {
            return true;
        }

        if (this.current == 2) {
            return true;
        }

        if (this.current == 3) {
            return true;
        }
    }

    defaultOpenValue = new Date(0, 0, 0, 9, 0, 0);

    resetAddTimesheetModal() {
        this.current = 0;
        this.rosterGroup = '';

        this.timesheetForm.reset({
            date: this.payPeriodEndDate,
            serviceType: '',
            program: '',
            serviceActivity: '',
            payType: '',
            analysisCode: '',
            recipientCode: '',
            debtor: '',
            isMultipleRecipient: false,
            isTravelTimeChargeable: false,
            sleepOverTime: new Date(0, 0, 0, 9, 0, 0),
            time: this.formBuilder.group({
                startTime: '',
                endTime: '',
            }),
            pay: this.formBuilder.group({
                unit: 'HOUR',
                rate: '0',
                quantity: '1',
                position: ''
            }),
            bill: this.formBuilder.group({
                unit: 'HOUR',
                rate: 0,
                quantity: '1',
                tax: '1'
            }),
        });
        
        this.defaultStartTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
        this.defaultEndTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);        
    }

    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;

        if(this.current == 1 && this.selected.option == 1){
            this.timesheetForm.patchValue({
                debtor: this.selected.data
            });
        }

        if(this.current == 4){
            const { recipientCode, program, serviceActivity } = this.timesheetForm.value;

            if(!this.globalS.isEmpty(recipientCode) &&
                    !this.globalS.isEmpty(serviceActivity) &&
                        !this.globalS.isEmpty(program)){
                this.timeS.getbillingrate({
                    RecipientCode: recipientCode,
                    ActivityCode: serviceActivity,
                    Program: program
                }).subscribe(data => {
                    this.timesheetForm.patchValue({
                        bill: {
                            unit: data.unit,
                            rate: this.DEFAULT_NUMERIC(data.rate),
                            tax: this.DEFAULT_NUMERIC(data.tax)
                        }
                    });
                });
            }            
        }
    }

    DEFAULT_NUMERIC(data: any): number{
        if(!this.globalS.isEmpty(data) && !isNaN(data)){
            return data;
        }
        return 0;
    }

    get nextCondition() {
        if (this.current == 2 && !this.ifRosterGroupHasTimePayBills(this.rosterGroup)) {
            return false; 
        }
        return this.current < 4;
    }

    get isFormValid(){
        return  this.timesheetForm.valid;
    }

    done(): void {
        this.fixStartTimeDefault();
        
        const tsheet = this.timesheetForm.value;
        let clientCode = this.FIX_CLIENTCODE_INPUT(tsheet);

        var durationObject = (this.globalS.computeTimeDATE_FNS(tsheet.time.startTime, tsheet.time.endTime));

        let inputs = {
            anal: tsheet.analysisCode || "",
            billQty: tsheet.bill.quantity || 0,
            billTo: clientCode,
            billUnit: tsheet.bill.unit || 0,
            blockNo: durationObject.blockNo,
            carerCode: this.selected.option == 0 ? this.selected.data : tsheet.staffCode,
            clientCode: this.selected.option == 0 ? clientCode : this.selected.data,
            costQty: tsheet.pay.quantity || 0,
            costUnit: tsheet.pay.unit || 0,
            date: format(tsheet.date,'yyyy/MM/dd'),
            dayno: format(tsheet.date, 'd'),
            duration: durationObject.duration,
            groupActivity: false,
            haccType: tsheet.haccType || "",
            monthNo: format(tsheet.date, 'M'),
            program: tsheet.program,
            serviceDescription: tsheet.payType || "",
            serviceSetting: null || "",
            serviceType: tsheet.serviceActivity || "",
            staffPosition: null || "",
            startTime: format(tsheet.time.startTime,'HH:mm'),
            status: "1",
            taxPercent: tsheet.bill.tax || 0,
            transferred: 0,
            type: this.activity_value,
            unitBillRate: tsheet.bill.rate || 0,
            unitPayRate: tsheet.pay.rate || 0,
            yearNo: format(tsheet.date, 'yyyy')
        };

        if(!this.timesheetForm.valid){
            this.globalS.eToast('Error', 'All fields are required');
            return;
        }

        console.log(inputs);

        this.timeS.posttimesheet(inputs).subscribe(data => {
            this.globalS.sToast('Success', 'Timesheet has been added');
            this.addTimesheetVisible = false;
        });
    }

    FIX_CLIENTCODE_INPUT(tgroup: any): string{
        if (tgroup.serviceType == 'ADMINISTRATION' || tgroup.serviceType == 'ALLOWANCE NON-CHARGEABLE' || tgroup.serviceType == 'ITEM') {
            return "!INTERNAL"
        }

        if (tgroup.serviceType == 'SERVICE' || tgroup.serviceType == 'TRAVEL TIME') {
            if (tgroup.isMultipleRecipient) {
                return "!MULTIPLE"
            }
            return tgroup.recipientCode;            
        }

        return tgroup.recipientCode;
    }

    fixStartTimeDefault() {
        const { time } = this.timesheetForm.value;
        if (!time.startTime) {
            this.ngModelChangeStart(this.defaultStartTime)
        }

        if (!time.endTime) {
            this.ngModelChangeEnd(this.defaultEndTime)
        }
    }

     // Add Timesheet

}

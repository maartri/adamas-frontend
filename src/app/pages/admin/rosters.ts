import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit,ChangeDetectorRef } from '@angular/core'
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//import { forkJoin,  Subject ,  Observable, EMPTY } from 'rxjs';
import { forkJoin, Subscription, Observable, Subject, EMPTY, of,fromEvent, } from 'rxjs';

import {debounceTime, distinctUntilChanged, takeUntil,mergeMap, concatMap, switchMap,buffer,map, bufferTime, filter} from 'rxjs/operators';
import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';


import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { NzStepsModule, NzStepComponent } from 'ng-zorro-antd/steps';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import addMinutes from 'date-fns/addMinutes';
import isSameDay from 'date-fns/isSameDay';



import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import * as moment from 'moment';
import * as $ from 'jquery';

interface AddTimesheetModalInterface {
    index: number,
    name: string
}

@Component({
    styles: [`
        .calendar{
            height:80vh;
            position:relative;
        }
        .date-title{
            font-family: 'Marmelad', sans-serif;
            text-align: center;
            font-size: 2rem;
        }
        nz-button-group{
            float: left;
            margin: 1rem 0 0 0;
        }
   
    .dm-input{
        margin-bottom:1rem;
    }
    nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-body{
        padding:0;
    }
    nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-footer{
        padding:0;
    }
    ul{
        list-style: none;
        padding: 5px 0 5px 15px;
        margin: 0;
    }
    li {
        padding: 4px 0 4px 10px;
        font-size: 13px;
        position:relative;
        cursor:pointer;
    }
    li:hover{
        background:#f2f2f2;
    }
    li i {
        float:right;
        margin-right:7px;
    }
    hr{
        border: none;
        height: 1px;
        background: #e5e5e5;
        margin: 2px 0;
    }
    li > ul{
        position: absolute;
        display:none;         
        right: -192px;
        padding: 2px 5px;
        background: #fff;
        top: -6px;
        width: 192px;
        transition: all 0.5s ease 3s;
    }
    li:hover > ul{           
        display:block;
        transition: all 0.5s ease 0s;
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
    templateUrl: './rosters.html'
})




export class RostersAdmin implements OnInit, OnDestroy, AfterViewInit {

    // @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

    // references the #calendar in the template
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    isVisible: boolean = false;
    hahays = new Subject<any>();
    optionsModal:boolean=false;
    recipientDetailsModal:boolean=false;
    rosterDetailsModal:boolean=false;
    
    private picked$: Subscription;

    changeModalView = new Subject<number>();
    changeViewRecipientDetails = new Subject<number>();
    changeViewRosterDetails = new Subject<number>();

    _highlighted: Array<any> = [];
    user:any;
    selectedOption:any;
    today = new Date();
    rosterGroup: string;
    rosterForm: FormGroup;
    viewType: any;
    ForceAll:Boolean=true;
    subGroup:String="";
    RosterDate:String="";
    StartTime:String="";
    EndTime:String=""
    Duration:String="5";

    calendarOptions: CalendarOptions = {
        initialView: 'timeGridMonth',
        plugins: [dayGridPlugin,timeGridPlugin,interactionPlugin],
        weekends: true,
        allDaySlot: false,
        fixedWeekCount: false,
        editable: false,
        eventStartEditable: false,
        eventResizableFromStart: false,
        duration: {
            months: 1           
        },
        // eventClassNames: [ 'myclassname', 'otherclassname' ],
        // eventContent: { html: '<i>some html</i>' },
        // eventDidMount: this.rightClick.bind(this),


        headerToolbar: {
            left: '',
            center: '',
            right: ''
        },
        events: [],
        height:'100%',
        scrollTime: '',
        slotMinTime: '07:00:00',
        select: function(info){

        },
        eventClick: this.handleClick.bind(this),
        views: {
            timeGridMonth: {
              type: 'timeGrid',
              duration: { 
                  month: 1
              },
              dayHeaderFormat: { day: '2-digit' },

              slotDuration: '00:05:00',
              buttonText: '4 day',              
            }
        }        
    };

    
    onRightClick(e){
     
        e.default=false;
        this.optionsModal=true;
        
        console.log(this.optionsModal);
        return false;
    }

    handleClick(e){
        this.rosterDetailsModal = true;
       // console.log(e);
      //  this.optionsModal=true;
       // console.log(this.optionsModal);
    }
   

    calendarPlugins = [dayGridPlugin,timeGridPlugin,interactionPlugin]; // important!

    someMethod() {
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.next();
    }

    currentDate: Date = new Date();

    dateStream = new Subject<any>();
    userStream = new Subject<string>();

    date:any = moment();
    options: any;
    recipient: any;

    loading: boolean = false;
    basic: boolean = false;
    data: any;

    private unsubscribe = new Subject();
    private rosters: Array<any>;
    private upORdown = new Subject<boolean>();

    constructor(
        private staffS: StaffService,
        private timeS: TimeSheetService,
        private globalS: GlobalService,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private clientS: ClientService,
        private listS: ListService
    ) {
        

        this.dateStream.pipe(
            distinctUntilChanged(),          
            takeUntil(this.unsubscribe),)
            .subscribe(data =>{
                this.searchRoster(this.date);
            });

        this.userStream.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            takeUntil(this.unsubscribe))
            .subscribe(data =>{
                this.loading = true;
                this.recipient = data;
                this.searchRoster(this.date);
            });

        this.upORdown.pipe(debounceTime(300))
            .subscribe(data => {
                this.loading = true;                         
                this.searchRoster(this.date);          
            });

            this.changeViewRosterDetails.subscribe(data => {
                // console.log(data);
                this.user = {
                   // name: this.selectedOption.Recipient,
                   // code: this.selectedOption.uniqueid,
                    startDate: '2019/01/15',
                    endDate: '2019/01/29'     
                                 
                    
                }   
                console.log(data);         
                // this.tabvrd = data;
                this.rosterDetailsModal = true;
                this.optionsModal=false;  
            });

            this.changeViewRecipientDetails.subscribe(data => {
                // console.log(data);
                this.user = {
                    //name: this.selectedOption.Recipient,
                  //  code: this.selectedOption.uniqueid,
                    startDate: '2019/01/15',
                    endDate: '2019/01/29'
                }            
                // this.tabvrd = data;
                console.log(data);
                this.recipientDetailsModal = true;
                this.optionsModal=false;  
            });
    
           
    
            this.changeModalView.subscribe(data => {
                console.log(data);
            });
        
    }

    ngOnInit(): void {
        this.date = moment();
        this.buildForm();    
        
    }

    ngOnDestroy(): void {

    }
    public clickStream;
    private clicks = 0;

    

  
     public formEvent(event): void {
      this.clickStream = fromEvent(event.target, 'click');
  
      const doubleClick = this.clickStream.pipe(
        bufferTime(250),
        map((arr: any) => arr.length),
        filter((num: any) => num === 2)
      );
  
      const oneClick = this.clickStream.pipe(
        bufferTime(500),
        map((arr: any) => arr.length),
        filter((num: any) => num === 1)
      );
  
      doubleClick.subscribe((q) => {
        console.log('double!');
      });
  
      oneClick.subscribe((q) => {
        console.log('one click');
      });
    } 
    showOptions(data: any) {
        console.log(data);
        this.selectedOption = data.selected; 

        var uniqueIds = this._highlighted.reduce((acc, data) => {
            acc.push(data.uniqueid);
            return acc;
        },[]);

        // var sss = uniqueIds.length > 0 ? uniqueIds : [this.selectedOption.uniqueid]
    
        // this.clientS.gettopaddress(sss)
        //     .subscribe(data => this.address = data)

        this.optionsModal = true;
    }
    highlighted(data: any) {
        this._highlighted = data;
    }

    ngAfterViewInit(): void {
        // console.log(this.calendarComponent.getApi());
        this.searchRoster(this.date);

        console.log(document)
        
    }

    // picked(data: any){
    //     this.userStream.next(data);
    // }
    picked(data: any) {
        console.log(data);
        this.userStream.next(data);

        if (!data.data) {
            this.rosters = [];
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

                this.rosters = data.map(x => {
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
        
      //  this.getComputedPay(data).subscribe(x => this.computeHoursAndPay(x));
        
        this.selectAll = false;
    }
    eventRender(e: any){
        e.el.querySelectorAll('.fc-title')[0].innerHTML = e.el.querySelectorAll('.fc-title')[0].innerText;
    }

    getComputedPay(data: any = this.selected): Observable<any>{
        return this.timeS.getcomputetimesheet({
            AccountName: data.data,
            IsCarerCode: this.viewType == 'Staff' ? true : false
        });
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
    searchRoster(date: any): void{

        this.calendarOptions.eventClick;
        // console.log(format(startOfMonth(date),'yyyy/MM/dd'));
        if(!this.recipient) return;
        console.log(moment(date).startOf('month').format('YYYY-MM-DD hh:mm'));

        this.staffS.getroster({
            RosterType: this.recipient.option == '1' ? 'PORTAL CLIENT' : 'SERVICE PROVIDER',
            //AccountNo: 'ABBERTON B',
            AccountNo: this.recipient.data,
            StartDate: moment(date).startOf('month').format('YYYY/MM/DD'),
            EndDate: moment(date).endOf('month').format('YYYY/MM/DD')
        }).pipe(takeUntil(this.unsubscribe)).subscribe(roster => {

            this.rosters = roster;

                this.options = null;
                var events = roster.map(x => {
                    return {
                        id: x.recordNo,
                        raw: `<b class="title" data-toggle="tooltip" data-placement="top" title="${ x.serviceType }">${ x.carerCode }</b>`,
                        start: `${ moment(x.shift_Start).format("YYYY-MM-DD HH:mm:00") }`,
                        end: `${ this.detectMidNight(x) }`
                    }
                });
                
                var time = events.map(x => x.start);
                var timeStart = moment(this.globalS.getEarliestTime(time)).subtract(20,'m').format('hh:mm:ss');             

                if(timeStart != null){
                    this.options = {
                        show: true,
                        scrollTime:  timeStart,
                        events: events
                    }
                }
                else {
                    this.options = {
                        show: true,
                        scrollTime:  '00:00:00',
                        events: events
                    }
                }
                
                this.loading = false;
                this.calendarOptions.events = this.options.events;
                this.calendarOptions.scrollTime = this.options.scrollTime;

                // console.log(this.options.events);

                this.calendarComponent.getApi().render();

                this.globalS.sToast('Roster Notifs',`There are ${(this.options.events).length} rosters found!`)
        });
    }

    next_date(){
        this.date = moment(this.date).add('month', 1);
        var calendar = this.calendarComponent.getApi(); 
        calendar.next();

        this.upORdown.next(true);
    }

    prev_date(){
        this.date = moment(this.date).subtract('month', 1);
        var calendar = this.calendarComponent.getApi(); 
        calendar.prev();
        this.upORdown.next(false);
    }

   
    detectMidNight(data: any){
        if(Date.parse(data.shift_Start) >= Date.parse(data.shift_End)){
            return moment(data.shift_End).format("YYYY-MM-DD 24:00:00");
        }
        return moment(data.shift_End).format("YYYY-MM-DD HH:mm:00");
    }

    handleDateClick({ event }){
        console.log(event);
        this.basic = !this.basic;
        this.data = this.search(this.rosters, 'recordNo', event.id);
    }

    eventMouseEnter(event){     
        $(event.jsEvent.target).closest('a').css({'cursor':'pointer','background-color':'#4396e8'})
    }

    eventMouseLeave(event){
        $(event.jsEvent.target).closest('a').css({'cursor':'pointer','background-color':'#3788d8'})
    }

    search(arr: Array<any>, key: string, name: any): any{
        return arr.find(o => o[key] === name);
    }

    eventDragStart(event){
        console.log(event)
    }

    eventDrop(event){
        console.log(event.event)
        console.log(event.oldEvent)
    } 

    eventRightClick(data: any){
        console.log(data);
        this.optionsModal=true;
    }

    handleCancel(){
            this.optionsModal=false;
    }
    handleOk(){

    }

    GETPROGRAMS(type: string): Observable<any> {
        let sql;
        if (!type) return EMPTY;
        const { isMultipleRecipient } = this.rosterForm.value;
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
        const { recipientCode, debtor, serviceType, isMultipleRecipient } = this.rosterForm.value;
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

        const { serviceType } = this.rosterForm.value;

        console.log("arshad:"+ this.selected.option)

        if (!program) return EMPTY;
        console.log(this.rosterForm.value)

        
        if (serviceType != 'ADMINISTRATION' && serviceType != 'ALLOWANCE NON-CHARGEABLE' && serviceType != 'ITEM'  || serviceType != 'SERVICE') {
            // const { recipientCode, debtor } = this.rosterForm.value;
            return this.listS.getserviceactivityall({
                recipient: this.GETRECIPIENT(this.selected.option),
                program,
                ForceAll: this.ForceAll,
                mainGroup: serviceType,
                subGroup: this.subGroup,
                viewType: this.viewType,
                Date:this.RosterDate,
                StartTime:this.StartTime,
                EndTime : this.EndTime,
                Duration: this.Duration


            });
        }
        else {
             let sql = `SELECT DISTINCT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid 
                 WHERE SO.serviceprogram = '${ program}' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] = 'ADMINISTRATION' AND processclassification = 'OUTPUT' AND ( ITM.enddate IS NULL OR ITM.enddate >= '${this.currentDate}' )) ORDER BY [service type]`;
            
            return this.listS.getlist(sql);
                //  return this.listS.getserviceprogramactivity({                  
                //     program,
                //     recipient: this.GETRECIPIENT(this.selected.option),
                //     mainGroup: serviceType,
                //     viewType: this.viewType
                // });

            // let sql = `SELECT DISTINCT [Service Type] AS activity FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            //     WHERE SO.ServiceProgram = '${ program}' AND EXISTS (SELECT Title FROM ItemTypes ITM WHERE Title = SO.[Service Type] AND 
            //     ProcessClassification = 'OUTPUT' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}')) ORDER BY [Service Type]`;
            //return this.listS.getlist(sql);
        }
    };

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

    dateFormat: string = 'dd/MM/yyyy'
    selectAll: boolean = false;
    overlapVisible: boolean = false;
    addTimesheetVisible: boolean = false;
    multipleRecipientShow: boolean = false;
    isTravelTimeChargeable: boolean = false;
    isSleepOver: boolean = false;
    payUnits: any;
    parserPercent = (value: string) => value.replace(' %', '');
    parserDollar = (value: string) => value.replace('$ ', '');
    formatterDollar = (value: number) => `${value > -1 || !value ? `$ ${value}` : ''}`;
    formatterPercent = (value: number) => `${value > -1 || !value ? `% ${value}` : ''}`;

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

    selected: any = null;
    
    payPeriodEndDate: Date;
    unitsArr: Array<string> = ['HOUR', 'SERVICE'];

    activity_value: number;
    durationObject: any;

    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);

   
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

    

    current = 0;
    nextDisabled: boolean = false;
    programsList: Array<any> = [];
    serviceActivityList: Array<any>;
    payTypeList: Array<any> = [];
    analysisCodeList: Array<any> = []
   
    
    clearLowerLevelInputs() {

        this.rosterForm.patchValue({
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

    showRecipient(): boolean  {
        const { serviceType, isMultipleRecipient } = this.rosterForm.value;            
        return ((serviceType !== 'ADMINISTRATION' && serviceType !== 'ALLOWANCE NON-CHARGEABLE') && !isMultipleRecipient);
    }

    canProceed() {
        const { date, serviceType } = this.rosterForm.value;

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
    buildForm() {
        this.rosterForm = this.formBuilder.group({
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

        this.rosterForm.get('time.startTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        });

        this.rosterForm.get('time.startTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        });

        this.rosterForm.get('isMultipleRecipient').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(d => {
                const { serviceType } = this.rosterForm.value;
                return this.GETPROGRAMS(serviceType);
            })).subscribe(data => {
                console.log(data);
            });

        this.rosterForm.get('payType').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(d => {
                if(!d) return EMPTY;
                return this.timeS.getpayunits(d);
            })
        ).subscribe(d => {
            this.rosterForm.patchValue({
                pay: {
                    unit: d.unit,
                    rate: d.amount,
                    quantity: (this.durationObject.duration) ? 
                        (((this.durationObject.duration * 5) / 60)).toFixed(2) : 0
                }
            });
        });

        this.rosterForm.get('time.endTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        });


        this.rosterForm.get('recipientCode').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                this.rosterForm.patchValue({
                    debtor: x
                });
                return this.GETPROGRAMS(x)
            })
        ).subscribe((d: Array<any>) => {
            this.programsList = d;

            if(d && d.length == 1){
                this.rosterForm.patchValue({
                    program: d[0].ProgName
                });
            }
            
        });

        this.rosterForm.get('debtor').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                if(this.selected.option == 0) return EMPTY;
                
                return this.GETPROGRAMS(x)
            })
        ).subscribe(d => {
            this.programsList = d;
        });

        this.rosterForm.get('serviceType').valueChanges.pipe(
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
                this.rosterForm.patchValue({
                    analysisCode: this.agencyDefinedGroup
                });
            }
        });

        // this.rosterForm.get('program').valueChanges.pipe(
        //     distinctUntilChanged(),
        //     switchMap(x => {
        //         this.serviceActivityList = [];
        //         this.rosterForm.patchValue({
        //             serviceActivity: null
        //         });
        //         return this.GETSERVICEACTIVITY(x)
        //     })
        // ).subscribe((d: Array<any>) => {

        //     this.serviceActivityList = d;

        //     if(d && d.length == 1){
        //         this.rosterForm.patchValue({
        //             serviceActivity: d[0].activity
        //         });
        //     }
        // });
 this.rosterForm.get('program').valueChanges.pipe(
            distinctUntilChanged(),
            switchMap(x => {
                this.serviceActivityList = [];
                this.rosterForm.patchValue({
                    serviceActivity: null
                    
                });
                console.log("Print Program" + x);
                return this.GETSERVICEACTIVITY(x)
            })
        ).subscribe((d: Array<any>) => {

            this.serviceActivityList = d;
            
            if(d && d.length == 1){
                this.rosterForm.patchValue({
                    serviceActivity: d[0].activity
                });
            }
        });
        this.rosterForm.get('serviceactivity').valueChanges.pipe(
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

            this.rosterForm.patchValue({
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

    defaultOpenValue = new Date(0, 0, 0, 9, 0, 0);

    resetAddTimesheetModal() {
        this.current = 0;
        this.rosterGroup = '';

        this.rosterForm.reset({
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

    pre_roster(): void {
        this.current -= 1;
    }

    next_roster(): void {
        this.current += 1;

        if(this.current == 1 && this.selected.option == 1){
            this.rosterForm.patchValue({
                debtor: this.selected.data
            });
        }

        if(this.current == 4){
            const { recipientCode, program, serviceActivity } = this.rosterForm.value;

            if(!this.globalS.isEmpty(recipientCode) &&
                    !this.globalS.isEmpty(serviceActivity) &&
                        !this.globalS.isEmpty(program)){
                this.timeS.getbillingrate({
                    RecipientCode: recipientCode,
                    ActivityCode: serviceActivity,
                    Program: program
                }).subscribe(data => {
                    this.rosterForm.patchValue({
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

    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;

        if(this.current == 1 && this.selected.option == 1){
            this.rosterForm.patchValue({
                debtor: this.selected.data
            });
        }

        if(this.current == 4){
            const { recipientCode, program, serviceActivity } = this.rosterForm.value;

            if(!this.globalS.isEmpty(recipientCode) &&
                    !this.globalS.isEmpty(serviceActivity) &&
                        !this.globalS.isEmpty(program)){
                this.timeS.getbillingrate({
                    RecipientCode: recipientCode,
                    ActivityCode: serviceActivity,
                    Program: program
                }).subscribe(data => {
                    this.rosterForm.patchValue({
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
        return  this.rosterForm.valid;
    }

    done(): void {
        this.fixStartTimeDefault();
        
        const tsheet = this.rosterForm.value;
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

        if(!this.rosterForm.valid){
            this.globalS.eToast('Error', 'All fields are required');
            return;
        }

        console.log(inputs);

        this.timeS.posttimesheet(inputs).subscribe(data => {
            this.globalS.sToast('Success', 'Timesheet has been added');
           // this.addTimesheetVisible = false;
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
        const { time } = this.rosterForm.value;
        if (!time.startTime) {
            this.ngModelChangeStart(this.defaultStartTime)
        }

        if (!time.endTime) {
            this.ngModelChangeEnd(this.defaultEndTime)
        }
    }

    ngModelChangeStart(event): void{
        this.rosterForm.patchValue({
            time: {
                startTime: event
            }
        })
    }

    ngModelChangeEnd(event): void {
        this.rosterForm.patchValue({
            time: {
                endTime: event
            }
        })
    }
   

     // Add Timesheet
}
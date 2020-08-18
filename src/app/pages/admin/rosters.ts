import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core'
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { forkJoin,  Subject ,  Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import { StaffService, GlobalService } from '@services/index';





import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import * as moment from 'moment';
import * as $ from 'jquery';

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
    changeModalView = new Subject<number>();
    changeViewRecipientDetails = new Subject<number>();
    _highlighted: Array<any> = [];
    user:any;
    selectedOption:any;

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
     
        this.optionsModal=true;

        console.log(this.optionsModal);

    }

    handleClick(e){
       // console.log(e);
        this.optionsModal=true;
        console.log(this.optionsModal);
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
        private globalS: GlobalService
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

            this.changeViewRecipientDetails.subscribe(data => {
                // console.log(data);
                this.user = {
                  //  name: this.selectedOption.Recipient,
                  //  code: this.selectedOption.uniqueid,
                    startDate: '2019/01/15',
                    endDate: '2019/01/29'
                }            
                // this.tabvrd = data;
                this.recipientDetailsModal = true;
            });
    
            this.changeModalView.subscribe(data => {
                console.log(data);
            });
        
    }

    ngOnInit(): void {
        this.date = moment();
    }

    ngOnDestroy(): void {

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

    picked(data: any){
        this.userStream.next(data);
    }

    eventRender(e: any){
        e.el.querySelectorAll('.fc-title')[0].innerHTML = e.el.querySelectorAll('.fc-title')[0].innerText;
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

    next(){
        this.date = moment(this.date).add('month', 1);
        var calendar = this.calendarComponent.getApi(); 
        calendar.next();

        this.upORdown.next(true);
    }

    prev(){
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
}
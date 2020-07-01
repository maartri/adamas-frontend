import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core'
import { FullCalendarComponent } from '@fullcalendar/angular';

import { Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import { StaffService, GlobalService } from '@services/index';

import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
    styles: [`
      
    `],
    templateUrl: './rosters.html'
})


export class RostersAdmin implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

    currentDate: Date = new Date();

    dateStream = new Subject<any>();
    recipientStream = new Subject<string>();

    date:any;
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
                this.searchRoster();
            })

        this.recipientStream.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            takeUntil(this.unsubscribe))
            .subscribe(data =>{
                this.loading = true;
                this.recipient = data;
                this.searchRoster();
            });
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        console.log(this.calendarComponent.getApi());
        this.searchRoster();
        console.log('haha')
    }

    picked(data: any){
        console.log(data);
        this.recipientStream.next(data);
    }

    eventRender(e: any){
        e.el.querySelectorAll('.fc-title')[0].innerHTML = e.el.querySelectorAll('.fc-title')[0].innerText;
    }

    searchRoster(): void{
        if(!this.recipient) return;

        this.staffS.getroster({
            RosterType: this.recipient.option == '1' ? 'PORTAL CLIENT' : 'SERVICE PROVIDER',
            //AccountNo: 'ABBERTON B',
            AccountNo: this.recipient.data,
            StartDate: format(startOfMonth(this.currentDate),'yyyy/MM/dd'),
            EndDate: format(endOfMonth(this.currentDate),'yyyy/MM/dd')
        }).pipe(takeUntil(this.unsubscribe)).subscribe(roster => {
            console.log(roster);

            this.rosters = roster;
           
                this.options = null;

                var events = roster.map(x => {
                    return {
                        id: x.recordNo,
                        title: `<b class="title" data-toggle="tooltip" data-placement="top" title="${ x.serviceType }">${ x.carerCode }</b>`,
                        start: `${ moment(x.shift_Start).format("YYYY-MM-DD HH:mm:00") }`,
                        end: `${ this.detectMidNight(x) }`
                    }
                });
                
                var time = events.map(x => x.start);
                var timeStart = moment(this.globalS.getEarliestTime(time)).subtract(2,'h').format('hh:mm:ss');             

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
        });
    }

    next(){
        console.log(this.calendarComponent);

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
}
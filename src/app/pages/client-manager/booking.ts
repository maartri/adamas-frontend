import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ClientService, GlobalService, StaffService, TimeSheetService, SettingsService, dateFormat, dayStrings, TYPE_MESSAGE, ListService } from '@services/index';
import { NzMessageService } from 'ng-zorro-antd/message';

import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInDays from 'date-fns/differenceInDays';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import getWeek from 'date-fns/getWeek';
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter'

import { PermanentBookings, AddBooking  } from '@modules/modules';

import { forkJoin, Subject, Observable, EMPTY } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, mergeMap } from 'rxjs/operators';


const enum ImagePosition {
    LaundryService = '-81px -275px',
    PersonalCare = "-247px -276px ",
    CaseManagement = "-164px -181px",
    StaffTravel = "1px -21px",
    Transport = "1px -264px",
    Unavailable = "-50px 0px",
    SocialHelp = "-247px -365px"
}

const enum ImageActivity {
    Laundry = 'DA LAUNDRY PRV',
    Personal = 'PERSONAL CARE PKGE',
    Case = 'CASE MANAGEMENT PKGE',
    StaffTravel = 'STAFF TRAVEL',
    Transport = 'TRANSPORT',
    Unavailable = 'UNAVAILABLE',
    SocialHelp = 'SOCIAL HELP PRIV'
}

@Component({
    selector: 'booking-client',
    styles: [`
        .interval-wrapper{
            padding: 10px 2rem;
            background: #f8f8f8;
            border: 1px solid #eeeeee;
        }
        .steps-content{
            display: inline-block;
            min-width:40rem;
            margin:1rem;
            overflow-y: auto;
            padding: 1rem;
        }
        button{
            margin-left:5px;
        }
        .chkboxes div:first-child{
            margin:1rem 0;
        }
        .services-list > div{
            margin-top:15px;
        }
        .book-wrapper{
            border: 1px solid #e8e8e8;
            padding:10px;
            height:9rem;
        }
        .book-wrapper h4{
            color:rgb(36, 36, 36);
        }
        .book-wrapper p{
            display: inline-block;
            font-size: 11px;
            color:#1e3936;
        }
        .book-wrapper > div{
            display: inline-block;
            width: 100%;
        }
        .book-wrapper button{
            position: absolute;
            bottom: 10px;
            right: 50%;
            left: 50%;
        }
        .book-image{
            background: url(assets/medical-icons.png);            
            background-repeat: no-repeat;
            background-size: 18rem;
            width: 60px;
            height: 60px;
            float:left;
        }
        .pick{
            background:linear-gradient(#d0f4ff,#d0ffc8);
        }
        .example{
            text-align: center;
            border-radius: 4px;
            margin-bottom: 20px;
            padding: 30px 50px;
            margin: 20px 0;
        }
        .numVars > div{
            font-size:24px;
        }
        .total{
            color: #00e47b;
        }
        ul{
            list-style:none;
        }
        li{
            border-bottom: 1px solid #f1f1f1;
            padding:0.5rem 0;
            position:relative;
        }
        li label{
            position: absolute;
            right: 0rem;
            top: 1.5rem;
        }
        li nz-rate{
            margin-left: 3.7rem;
        }
        nz-avatar{
            float: left;
            margin: 6px;
            margin-right: 1rem;
        }
        h3{
            color: #5288ff;
        }
        .leadtime{
            font-size: 10px;
            color: #14b144;
            margin-top: 5px;
        }
        .arrow-right{
            font-size: 2.5rem;
            color: #1890ff;
            margin-top: 5rem;
        }
        nz-time-picker{
            width: 6.5rem;
        }
        nz-alert.warning-date >>> div{
            padding: 4px 4rem;
        }
        .summary{
            white-space: pre-wrap;
            font-size: 14px !important;
            font-weight: 500;
            color: #6b6b6b;
        }
        h5{
            color: #0d76c2;
            margin-top: 2rem;
        }
    `],
    templateUrl: './booking.html'
})


export class BookingClientManager implements OnInit, OnDestroy {

    @Input() inputUser: any;

    current = 0;

    time = new Date(1990, 1, 1, 9, 0, 0);

    dateFormat: string = dateFormat;

    startTime: any = new Date(1990, 1, 1, 9, 0, 0);
    endTime: any = new Date(1990, 1, 1, 10, 0, 0);
    date = new Date();

    checked: boolean = false;

    once: boolean = true;
    permanent: boolean = false;
    aprovider: boolean = true;
    cprovider: boolean = false;

    selectedInputParams: any;

    user: any;
    token: any;

    services: Array<any>;
    loadServices: boolean = false;

    selectedService: any = null;
    selectedStaff: any = null;

    loading: boolean = false;
    bookingModalOpen: boolean = false;

    notes: string = '';
    _settings: SettingsService;
    results: Array<any> = [];

    bookType: boolean = false;
    weekly: string = '';

    loadBooking: boolean = false;

    private unsubscribe = new Subject();

    slots: Array<any> = [];
    publishedEndDate: Date;
    payPeriod: Date;
    dayKeys: Array<string> = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

    currUser: string;
    finalBooking: any;
    constructor(
        private clientS: ClientService,
        private globalS: GlobalService,
        private settings: SettingsService,
        private notification: NzNotificationService,
        private listS: ListService,
        private message: NzMessageService
    ) {

    }

    ngOnInit() {
        this._settings = this.settings;
        this.user = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember).code : this.globalS.decode().code;
        this.token = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.pickedMember).code : this.globalS.decode();
        this.date = addDays(this.date, this._settings.BOOKINGLEADTIME());

        // console.log(this.token)
        // console.log(this.globalS.decode())

        this.currUser = this.globalS.decode()['nameid'];

        this.listS.getrosterpublishedenddate()
            .subscribe(data => {
                this.publishedEndDate = this.globalS.CONVERTSTRING_TO_DATETIME(data)
            });

        this.listS.getpayperiod()
            .subscribe(data => this.payPeriod = data.payPeriodEndDate)
    }

    computeDuration(start: any, end: any) {
        return this.globalS.computeTime(start, end);
    }

    ngOnDestroy() {

    }

    pre(): void {
        if (this.cprovider && this.current == 2) {
            this.selectedStaff = null;
        }
        this.current -= 1;
    }

    next(): void {
        if (this.current == 0) {
            this.loading = true;
            this.selectedService = '';
            this.services = [];

            this.getApprovedServices();
            console.log(this.slots);
            // return;
        }

        if (this.current == 1) {
            console.log(this.current);
        }

        if (this.cprovider && this.current == 1) {
            this.loading = true;
            
            this.clientS.getqualifiedstaff({
                RecipientCode: this.token.code,
                User: this.token.user,
                BookDate: format(this.date,'yyyy/MM/dd'),
                StartTime: '09:00',
                EndTime: '11:00',
                EndLimit: '17:00',
                Gender: '',
                Competencys: '',
                CompetenciesCount: 0
            }).subscribe((data: any) => {
                this.loading = false;
                let original = data.map(x => {
                    var gender = -1;

                    if (x.gender && (x.gender[0]).toUpperCase() == 'F') {
                        gender = 0;
                    }

                    if (x.gender && (x.gender[0]).toUpperCase() == 'M') {
                        gender = 1;
                    }

                    return {
                        firstName: x.firstName,
                        age: x.age,
                        rating: x.rating,
                        km: x.km,
                        gender: gender,
                        accountNo: x.accountNo
                    };
                });

                this.results = original;
            });
        }

        if (this.cprovider && this.current == 2){
            console.log(this.selectedStaff)
        } 
        
        this.current += 1;
    }

    getApprovedServices() {
        if (this.cprovider) {
            this.selectedInputParams = {
                RecipientCode: this.user,
                User: this.token['user'],
                BookDate: moment(this.date).format('YYYY/MM/DD'),
                StartTime: this.startTime,
                EndTime: this.endTime,
                EndLimit: '17:00',
                Gender: '',
                Competencys: '',
                CompetenciesCount: 0
            }
        }
                
        this.clientS.getapprovedservices({
            RecipientCode: this.user,
            BookDate: moment(this.date).format('YYYY/MM/DD'),
            StartTime: format(this.startTime,'HH:mm')
        }).subscribe(data => {
            this.services = data.list
            this.loadServices = false;
            this.loading = false;
        });
    }

    get canGoNext(): boolean {
        if (this.current == 0) return true;
        if (this.current == 1 && this.selectedService ) return true;           

        if (!this.cprovider && this.current > 2) return true;
        if (this.cprovider && this.current > 1 && this.current == 2 && this.selectedStaff) return true;

        return false;
    }

    get canBeDone(): boolean {
        return (!this.cprovider && this.current == 2) || (this.cprovider && this.current == 3);
    }

    computeRating(rating: string): number{
        if (!rating || rating == null || rating == '') return 0;
        var ratingNo = rating.split('*').length - 1;

        if (ratingNo > 7) return 7;
        return ratingNo;
    }

    change(data: any, source: string) {
        if (source == 'aprov') {
            if (data)
                this.cprovider = false;
        }

        if (source == 'cprov') {
            if (data)
                this.aprovider = false
        }

        if (source == 'once') {
            if (data)
                this.permanent = false;
            else
                this.permanent = true;
        }

        if (source == 'permanent') {
            if (data) {
                this.once = false;
                this.weekly = '';
                //this.weekly = 'Weekly'
            }
            else {
                this.once = true;
            }
        }
    }

    getPositionImg(data: any): string {
        let temp = data.serviceType || "";
        if (temp.indexOf(ImageActivity.Laundry) !== -1) return ImagePosition.LaundryService;
        if (temp.indexOf(ImageActivity.Unavailable) !== -1) return ImagePosition.Unavailable;
        if (temp.indexOf(ImageActivity.Transport) !== -1) return ImagePosition.Transport;
        if (temp.indexOf(ImageActivity.StaffTravel) !== -1) return ImagePosition.StaffTravel;
        if (temp.indexOf(ImageActivity.Personal) !== -1) return ImagePosition.PersonalCare;
        if (temp.indexOf(ImageActivity.Case) !== -1) return ImagePosition.CaseManagement;
        if (temp.indexOf(ImageActivity.SocialHelp) !== -1) return ImagePosition.SocialHelp;
    }

    add(data: any) {
        if (Object.is(data, this.selectedService)) {
            this.selectedService = null;
            return false;
        }
        this.selectedService = data;
    }

    isPicked(data: any) {
        return Object.is(data, this.selectedService);
    }


    confirm() {
        this.createBookingObject();
        this.bookingModalOpen = true;
    }

    // book() {
    //     let booking: AddBooking = {
    //         BookType: this.bookType,
    //         StaffCode: !(this.aprovider) ? this.selectedStaff.accountNo : "",
    //         Service: this.selectedService,
    //         StartDate: moment(this.date).format('YYYY/MM/DD'),
    //         StartTime: format(this.startTime,'HH:mm'),
    //         ClientCode: this.user,
    //         Duration: format(this.endTime, 'HH:mm'),
    //         Username: this.token['nameid'],
    //         AnyProvider: this.aprovider,
    //         BookingType: this.once ? 'Normal' : this.permanent ? this.weekly : '',
    //         Notes: this.notes
    //     }

    //     this.loadBooking = true;

    //     this.clientS.addbooking(booking).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //         let resultRows = parseInt(data);
    //         if (resultRows == 1) {
    //             this.notification.create('success', 'Booking Success', 'A booking record has been successfully inserted');
    //         } else if (resultRows > 1)
    //             this.globalS.eToast('Error', 'You already have a booking in that timeslot');

    //         this.resetStepper();
    //         this.bookingModalOpen = false;
    //     }, (err) => {
    //         this.globalS.eToast('Error', 'Booking Unsuccessful')
    //     });

    // }

    createBookingObject(){
        var bookType = this.once ? 'Normal' : this.permanent ? this.weekly : '';

        let booking: AddBooking = {
            BookType: this.bookType,
            StaffCode: !(this.aprovider) ? this.selectedStaff.accountNo : "",
            Service: this.selectedService,
            StartDate: moment(this.date).format('YYYY/MM/DD'),
            StartTime: format(this.startTime,'HH:mm'),
            ClientCode: this.user,
            Duration: format(this.endTime, 'HH:mm'),
            Username: this.currUser,
            AnyProvider: this.aprovider,
            BookingType: bookType,
            Notes: this.notes,
            PermanentBookings: [...this.buildPermanentBookings(), ...this.realBookings()],
            RealDateBookings: [...this.realBookings()],
            Summary: this.getSummary(
                bookType, 
                moment(this.date).format('MMM DD,YYYY'), 
                moment(this.publishedEndDate).format('MMM DD,YYYY'), 
                this.buildPermanentBookings()
            )
        }
        this.finalBooking = booking;
    }

    book() {
        if(this.globalS.isEmpty(this.finalBooking)) return;

        if(this.slots.length == 0 && this.permanent){
            return this.globalS.createMessage(TYPE_MESSAGE.error, 'You have no slots added in step 1');
        }

        var id = this.globalS.loadingMessage('Processing booking...');
        this.bookingModalOpen = false;

        console.log(this.finalBooking);
        // return;

        this.clientS.addbooking(this.finalBooking).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            let resultRows = parseInt(data);            
            if (resultRows == 1) {
                this.notification.create('success', 'Booking Success', 'A booking record has been successfully inserted');
            }

            this.resetStepper();

            this.globalS.createMessage(TYPE_MESSAGE.success, 'Booking Successful');
            this.message.remove(id);
            
        }, (err) => {
            this.resetStepper();
            this.globalS.eToast('Error', err.error.message);
            this.globalS.createMessage(TYPE_MESSAGE.error, 'Error Booking')
            this.message.remove(id);
        });

    }

    getSummary(bookType: string, startDate: any, endDate: any, permBookings: PermanentBookings[]): string{

        if(bookType === 'Weekly'){
            let permBooks = [...new Set(permBookings.map(x =>  {
                return dayStrings[getDay(parseISO(x.Time))];
            }))].join(', ');

            return `
A booking has been made Weekly from ${startDate} until ${endDate}:

    Every ${permBooks}`
        }

        if(bookType === 'Fortnightly'){
            let fstWeek = [...new Set(permBookings.map(x =>  {
                if(x.Week == 1) return dayStrings[getDay(parseISO(x.Time))];
            }))].filter(x => x).join(', ')

            let secWeek = [...new Set(permBookings.map(x =>  {
                if(x.Week == 2) return dayStrings[getDay(parseISO(x.Time))];
            }))].filter(x => x).join(', ')
            return `
A booking has been made on a fortnight starting from ${startDate} until ${endDate}:

    Every 1st Week: ${fstWeek}
    Every 2nd Week: ${secWeek}
            
            `
        }

        if(bookType === 'FourWeekly'){
            let fstWeek = [...new Set(permBookings.map(x =>  {
                if(x.Week == 1) return dayStrings[getDay(parseISO(x.Time))];
            }))].filter(x => x).join(', ')

            let secWeek = [...new Set(permBookings.map(x =>  {
                if(x.Week == 2) return dayStrings[getDay(parseISO(x.Time))];
            }))].filter(x => x).join(', ')

            let thiWeek = [...new Set(permBookings.map(x =>  {
                if(x.Week == 3) return dayStrings[getDay(parseISO(x.Time))];
            }))].filter(x => x).join(', ')

            let forWeek = [...new Set(permBookings.map(x =>  {
                if(x.Week == 4) return dayStrings[getDay(parseISO(x.Time))];
            }))].filter(x => x).join(', ')


            return `
A four weekly booking has been made from date ${startDate} until ${endDate}:

    Every 1st Week: ${fstWeek}
    Every 2nd Week: ${secWeek}
    Every 3rd Week: ${thiWeek}
    Every 4th Week: ${forWeek}
    `
        
        }
        return '';
    }

    resetStepper() {
        this.current = 0;
        this.notes = "";
        this.selectedService = null;
        this.startTime = new Date(1990, 1, 1, 9, 0, 0);
        this.endTime = new Date(1990, 1, 1, 10, 0, 0);
        this.date = addDays(new Date(), this._settings.BOOKINGLEADTIME());
        this.loadBooking = false;
        this.selectedStaff = '';
        this.finalBooking = '';
        // this.weekly = '';
    }

    disabledDate = (current: Date): boolean => {
        // Can not select days before today and today
        return differenceInCalendarDays(current, new Date()) < this._settings?.BOOKINGLEADTIME();
    };

    disabledStartDatePermanent = (current: Date): boolean => {
        return (differenceInCalendarDays(current, new Date()) < this._settings?.BOOKINGLEADTIME()) || this.publishedEndDate <= current;
    };

    buildDateFrames(timeSlots: Array<any>): Array<any>{
        var newArr: Array<any> = [];  
        if(typeof this.slots === 'undefined') return [];
        for(var timeLen = 0 ; timeLen < timeSlots.length ; timeLen++){
          for(var day = 0; day < this.dayKeys.length ; day++){
            if(timeSlots[timeLen][this.dayKeys[day]].quantity > 0){
                newArr.push(timeSlots[timeLen][this.dayKeys[day]])
            }
          }
        }
        return newArr;
    }

    realBookings(): Array<PermanentBookings>{

        var bbb: any = this.buildDateFrames(this.slots);
        var currDate = this.date;

        var payPeriod = this.globalS.CONVERTSTRING_TO_DATETIME(this.payPeriod);
        var list: Array<PermanentBookings> = [];
        if(typeof this.slots === 'undefined') return [];

        // Weekly
        if(this.slots.length == 1){
            while(currDate < this.publishedEndDate){
                var noOfWeekSincePayPeriod = this.globalS.CALCULATE_WHAT_WEEK_FORTNIGHT(currDate, this.publishedEndDate)
                var currDay = getDay(currDate);
    
                for(var a = 0 ; a < bbb.length; a++){
                    if(getDay(bbb[a].time) == currDay){
                        list.push({
                            Quantity: bbb[a].quantity,
                            Week: bbb[a].week,
                            Time: format(this.globalS.APPEND_DATE_TIME_ON_DIFFERENT_DATETIMES(currDate, bbb[a].time),"yyyy-MM-dd'T'HH:mm:ss"),
                            Day: currDay
                        });
                    }
                }
                currDate = addDays(currDate, 1);
            }
        }
        
        // Fortnight
        if(this.slots.length  == 2 ){
            while(currDate < this.publishedEndDate){
                // console.log(payPeriod)
                // console.log(currDate);
                var noOfWeekSincePayPeriod = this.globalS.CALCULATE_WHAT_WEEK_FORTNIGHT(payPeriod, currDate);
                // console.log(noOfWeekSincePayPeriod);
                var currDay = getDay(currDate);
    
                for(var a = 0 ; a < bbb.length; a++){
                    if(bbb[a].week === noOfWeekSincePayPeriod && getDay(bbb[a].time) == currDay){
                        list.push({
                            Quantity: bbb[a].quantity,
                            Week: bbb[a].week,
                            Time: format(this.globalS.APPEND_DATE_TIME_ON_DIFFERENT_DATETIMES(currDate, bbb[a].time),"yyyy-MM-dd'T'HH:mm:ss"),
                            Day: currDay
                        });
                    }
                }
                currDate = addDays(currDate, 1);
            }
        }

        // Four Weekly
        if(this.slots.length  == 4){
            while(currDate < this.publishedEndDate){
                var noOfWeekSincePayPeriod = this.globalS.CALCULATE_WHAT_WEEK_FOURWEEKLY(payPeriod, currDate);
                console.log(noOfWeekSincePayPeriod);

                var currDay = getDay(currDate);
    
                for(var a = 0 ; a < bbb.length; a++){
                    if(bbb[a].week === noOfWeekSincePayPeriod && getDay(bbb[a].time) == currDay){
                        list.push({
                            Quantity: bbb[a].quantity,
                            Week: bbb[a].week,
                            Time: format(this.globalS.APPEND_DATE_TIME_ON_DIFFERENT_DATETIMES(currDate, bbb[a].time),"yyyy-MM-dd'T'HH:mm:ss"),
                            Day: currDay
                        });
                    }
                }
                currDate = addDays(currDate, 1);
            }
        }
        return list;
    }

    get hideDateInPermanentBookings(): boolean{
        return !isAfter(this.date,this.publishedEndDate);
    }

    buildPermanentBookings(): Array<PermanentBookings>{

        if(typeof this.slots === 'undefined') return [];

        const originalLen = this.slots.length;
        var objWithQuantity = this.buildDateFrames(this.slots);

        var filtered: Array<PermanentBookings> = objWithQuantity.map(x => {
            var obj: PermanentBookings =  {                
                Quantity: x.quantity,
                Time: format(x.time,"yyyy-MM-dd'T'HH:mm:ss"),
                Week: x.week,
                Day: getDay(x.time)
            }
            return obj;
        });

        var newDates: Array<PermanentBookings> = []
        
        if(originalLen == 1 && objWithQuantity.length > 0){
            var newArr = [];
            var counter = 1;
            for( var a = 0 ; a < 3 ; a++){
                var arr = objWithQuantity.map(x => {

                    var obj: PermanentBookings =  {
                        Quantity: x.quantity,
                        Time: format(addDays(x.time, (7*counter)),"yyyy-MM-dd'T'HH:mm:ss"),                        
                        Week: x.week,
                        Day: getDay(x.time)
                    }
                    return obj;
                });
                newArr.push(...arr);
                counter++;
            }
            newDates = [...filtered,...newArr];
        }

        if(originalLen == 2 && objWithQuantity.length > 0){
            var fortnightArr: Array<PermanentBookings> = objWithQuantity.map(x => {
                var obj: PermanentBookings =  {                
                    Quantity: x.quantity,
                    Time: format(addDays(x.time, 14),"yyyy-MM-dd'T'HH:mm:ss"),
                    Week: x.week,
                    Day: getDay(x.time)
                }
                return obj;              
            })
            newDates = [...filtered, ...fortnightArr]            
        }

        if(originalLen == 4 && objWithQuantity.length > 0){
            var fourWeekly = objWithQuantity.map(x => {

                var obj: PermanentBookings =  {                
                    Quantity: x.quantity,
                    Time: format(x.time,"yyyy-MM-dd'T'HH:mm:ss"),
                    Week: x.week,
                    Day: getDay(x.time)
                }
                return obj;
            })
            newDates = [...fourWeekly]            
        }

        return newDates;       
    }


}
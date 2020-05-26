import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ClientService, GlobalService, StaffService, TimeSheetService, SettingsService } from '@services/index';

import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import format from 'date-fns/format';


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
        .steps-content{
            display: inline-block;
            height: 23rem;
            min-width:40rem;
            margin:2rem;
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
            right: 10px;
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
        nz-avatar{
            float: left;
            margin: 6px;
            margin-right: 1rem;
        }
        h3{
            color: #862e6bf2;
        }
    `],
    templateUrl: './booking.html'
})


export class BookingClient implements OnInit, OnDestroy {

    @Input() inputUser: any;

    current = 0;

    time = new Date(1990, 1, 1, 9, 0, 0);

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
    weekly: string = 'Weekly';

    loadBooking: boolean = false;

    private unsubscribe = new Subject()

    constructor(
        private clientS: ClientService,
        private globalS: GlobalService,
        private settings: SettingsService,
        private notification: NzNotificationService
    ) {

    }

    ngOnInit() {
        // console.log(this.globalS.decode().code);
        // console.log(this.globalS.userProfile);

        this._settings = this.settings;
        this.user = this.inputUser || this.globalS.decode().code;
        this.token = this.globalS.decode();
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
        }

        if (this.current == 1) {
            console.log(this.current);
        }

        if (this.cprovider && this.current == 1) {
            this.clientS.getqualifiedstaff({
                RecipientCode: 'ABBERTON B',
                User: 'abott',
                BookDate: '2020/05/26',
                StartTime: '09:00',
                EndTime: '11:00',
                EndLimit: '17:00',
                Gender: '',
                Competencys: '',
                CompetenciesCount: 0
            }).subscribe((data: any) => {

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
                console.log(this.results);
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
                User: this.token['nameid'],
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
            StartTime: this.startTime
        }).subscribe(data => {
            this.services = data.list
            this.loadServices = false;
            this.loading = false;
        })
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
        this.bookingModalOpen = true;
    }

    book() {
        let booking: Dto.AddBooking = {
            BookType: this.bookType,
            StaffCode: !(this.aprovider) ? this.selectedStaff.accountNo : "",
            Service: this.selectedService,
            StartDate: moment(this.date).format('YYYY/MM/DD'),
            StartTime: format(this.startTime,'HH:mm'),
            ClientCode: this.user,
            Duration: format(this.endTime, 'HH:mm'),
            Username: this.token['nameid'],
            AnyProvider: this.aprovider,
            BookingType: this.once ? 'Normal' : this.permanent ? this.weekly : '',
            Notes: this.notes
        }
       
        this.loadBooking = true;
        this.clientS.addbooking(booking).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            let resultRows = parseInt(data);
            if (resultRows == 1) {
                this.notification.create('success', 'Booking Success', 'A booking record has been successfully inserted');
            } else if (resultRows > 1)
                this.globalS.eToast('Error', 'You already have a booking in that timeslot');

            this.resetStepper();
            this.bookingModalOpen = false;
        }, (err) => {
            this.globalS.eToast('Error', 'Booking Unsuccessful')
        });

    }

    resetStepper() {
        this.current = 0;
        this.notes = "";
        this.selectedService = null;
        this.startTime = new Date(1990, 1, 1, 9, 0, 0);
        this.endTime = new Date(1990, 1, 1, 10, 0, 0);
        this.date = new Date();
        this.loadBooking = false;
        this.selectedStaff = '';
    }
}
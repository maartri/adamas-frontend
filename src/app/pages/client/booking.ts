import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ClientService, GlobalService, StaffService, TimeSheetService } from '@services/index';

import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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

    selectedService: any;

    loading: boolean = false;
    bookingModalOpen: boolean = false;

    notes: string = ''

    constructor(
        private clientS: ClientService,
        private globalS: GlobalService,
        private notification: NzNotificationService
    ) {

    }

    ngOnInit() {
        console.log(this.globalS.decode().code);
        console.log(this.globalS.userProfile);
        this.user = this.inputUser || this.globalS.decode().code;
        this.token = this.globalS.decode();
    }

    computeDuration(start: any, end: any) {
        return this.globalS.computeTime(start, end);
    }

    ngOnDestroy() {

    }

    pre(): void {
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
            this.selectedService = "";
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
        // let booking: Dto.AddBooking = {
        //     BookType: this.bookType,
        //     StaffCode: !(this.aprovider) ? this.selectedStaff.accountNo : "",
        //     Service: this.selectedService,
        //     StartDate: moment(this.date).format('YYYY/MM/DD'),
        //     StartTime: this.startTime,
        //     ClientCode: this.user,
        //     Duration: this.endTime,
        //     Username: this.token['nameid'],
        //     AnyProvider: this.aprovider,
        //     BookingType: this.once ? 'Normal' : this.permanent ? this.weekly : '',
        //     Notes: this.notes
        // }
        this.resetStepper();

        this.notification.create('success', 'Booking Success', 'A booking record has been successfully inserted');
        this.bookingModalOpen = false;
    }

    resetStepper() {
        this.current = 0;
        this.notes = "";
        this.selectedService = "";
        this.startTime = new Date(1990, 1, 1, 9, 0, 0);
        this.endTime = new Date(1990, 1, 1, 10, 0, 0);
        this.date = new Date();
    }
}
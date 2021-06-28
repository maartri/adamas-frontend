import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService,expectedOutcome,qoutePlantype, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject, EMPTY } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { dateFormat } from '@services/global.service'

import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { billunit, periodQuote, basePeriod } from '@services/global.service';

import { Filters, QuoteLineDTO, QuoteHeaderDTO } from '@modules/modules';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { RECIPIENT_OPTION } from '@modules/modules';
import { DomSanitizer } from '@angular/platform-browser';
import { NotesClient } from '@client/notes';

@Component({
    styleUrls:['./quotes.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './quotes.html',
    styles:[`
    nz-tabset >>> div > div.ant-tabs-nav-container{
        height: 25px !important;
        font-size: 13px !important;
    }

    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
        line-height: 24px;
        height: 25px;
    }
    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
        background: #717e94;
        color: #fff;
    }
 
    .line{
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #f3f3f3;
    }
    .controls div{
        display: inline-block;
        border-radius: 50%;
        background: #f1f1f1;
        border: 1px solid #cecece;
        width: 24px;
        text-align: center;
        margin-right:10px;
    }
    .controls div i{
        cursor:pointer;
    }
    .controls div:hover{
        background:#d6d6d6;
    }
    .right{
        float:right;
    }
    .right >  * {        
        margin-right:5px;
    }
    nz-range-picker{
        width:15rem;
    }
    .div-table{
        display: table;
        line-height: 25px;
    }
    .div-table > div{
        display: table-row;
    }
    .div-table > div > div{
        display: table-cell;
        padding: 2px 5px;
    }
    .form-group nz-select{
        width:100%
    }
    nz-select.select{
        min-width:10rem;
    }
    .inline{
        display:flex;
    }
    .inline > .title{
        font-size:12px;
        margin-right:5px;
    }
    .mini{
        width:5rem;
    }
    .spacing > *{
        margin-right:5px;
    }
    .calc-wrapper > div{
        margin-top:8px;
    }
    .three-wid{
        width:3rem;
    }
    .three-five{
        width:5rem;
    }
    .flex{
        display:flex;
    }
    .flex > *{
        margin-right:5px;
    }
    `]
})


export class RecipientQuotesAdmin implements OnInit, OnDestroy, AfterViewInit {

    private unsubscribe: Subject<void> = new Subject();

    option: string = 'add';

    quoteIdsForm: FormGroup;
    quoteForm: FormGroup;
    quoteListForm: FormGroup;

    billUnitArr: Array<string> = billunit;
    periodArr: Array<string> = periodQuote;
    basePeriodArr: Array<string> = basePeriod;

    clientId: number;

    size: string = 'small'
    from: string = 'quote';
    quoteGeneralForm : FormGroup;
    title: string = 'Add New Quote';
    slots: any;
    weekly: string = 'Weekly';

    listOfData = [
        // {
        //   key: '1',
        //   name: 'John Brown',
        //   age: 32,
        //   address: 'New York No. 1 Lake Park'
        // },
        // {
        //   key: '2',
        //   name: 'Jim Green',
        //   age: 42,
        //   address: 'London No. 1 Lake Park'
        // },
        // {
        //   key: '3',
        //   name: 'Joe Black',
        //   age: 32,
        //   address: 'Sidney No. 1 Lake Park'
        // }
      ];


    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    dateFormat: string = dateFormat;
    date: Date = new Date();
    nzSize: string = "small"
    user: any;

    inputForm: FormGroup;
    activeForm: FormGroup;
    inActiveForm: FormGroup;

    tableData: Array<any> = [];
    checked: boolean = false;
    isDisabled: boolean = false;

    displayLast: number = 20;
    archivedDocs: boolean = false;
    acceptedQuotes: boolean = false;

    loading: boolean = false;
    postLoading: boolean = false;
    quotesOpen: boolean = false;
    quoteLineOpen: boolean = false;
    activeOpen: boolean = false;
    inActiveOpen: boolean = false;
    admitOpen: boolean = false;
    newQuoteModal: boolean = false;

    goalAndStrategiesmodal : boolean = false;
    isUpdateGoal:boolean = false;
    isUpdateStrategy:boolean = false;  
    value: any;

    quoteTemplateList: Array<string>;
    quoteProgramList: Array<string>;

    IS_CDC: boolean = false;


    codes: Array<any>
    recipientProperties: any;

    radioValue: any;
    filters: any;
    disciplineList: any;
    careDomainList: any;
    programList: any;
    quotePlanType: string[];
    carePlanID: any;
    goalOfCarelist: any;
    goalsAndStratergies: any;
    userCopy: any;

    quoteLines: Array<any> = [];

    quoteLinesTemp: Array<any> = [];
    
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    token:any;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;  
    goalsAndStratergiesForm: FormGroup;
    reportDataParent:any;
    stratergiesList: any;
    pdfdata:any;
    stratergiesForm: FormGroup;
    strategiesmodal: boolean;
    expecteOutcome: string[];
    plangoalachivementlis: any;
    personIdForStrategy: any;
    supplements: FormGroup;
    isSuplement: boolean = false;
    disabledRadio:boolean = true;
    recipientOptionOpen: any;
    recipientOption: string;
    RECIPIENT_OPTION = RECIPIENT_OPTION;

    document_print_quote: any;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService,
        private cd: ChangeDetectorRef
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal']);
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'quotes')) {
                this.search(data);
                this.userCopy = data;
            }
        });
    }

    ngAfterViewInit(){        
        // this.search(this.user);
    }

    ngOnInit(): void {
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
        this.user = this.sharedS.getPicked();
        this.buildForm();
        this.quoteGeneralForm.controls.discipline.setValue("NOT SPECIFIED");
        this.quoteGeneralForm.controls.careDomain.setValue("NOT SPECIFIED");
    }

    buildForm() {

        this.inputForm = this.formBuilder.group({
            autoLogout: [''],
            emailMessage: false,
            excludeShiftAlerts: false,
            excludeFromTravelinterpretation:false,
            inAppMessage: false,
            logDisplay: false,
            pin: [''],
            staffTimezoneOffset:[''],
            rosterPublish: false,
            shiftChange: false,
            smsMessage: false
        });
        

        this.inActiveForm = this.formBuilder.group({
            timePeriod: []
        });

        this.activeForm = this.formBuilder.group({
            aUpdateActivities: true,
            aUpdateApplicable: true,
            aCreateBookings: true,
            aDeleteActivities: false,

            bUpdateActivities: true,
            bUpdateApplicable: true,
            bCreateBookings: true,
            bDeleteActivities: false,

            timePeriod: []
        });

        this.quoteGeneralForm = this.formBuilder.group({
            id:null,
            planType:null,
            name:null,
            program: 'NOT SPECIFIED',
            discipline: 'NOT SPECIFIED',
            careDomain: 'NOT SPECIFIED',
            starDate:null,
            signOfDate:null,
            reviewDate:null,
            rememberText:null,
            publishToApp:false
        });

        this.quoteForm = this.formBuilder.group({
            program: null,
            template: null,
            no: null,
            type: null,
            period: [],
            basePeriod: null,

            initialBudget: null,
            daysCalc: 365,
            govtContrib: null,

            programId: null

        });

        this.quoteIdsForm = this.formBuilder.group({
            itemId: null
        });

        this.goalsAndStratergiesForm = this.formBuilder.group({
            recordnumber:null,
            goal:'',
            PersonID:'45976',
            title : "Goal Of Care : ",
            ant   : null,
            lastReview : null,
            completed:null,
            percent : null,
            achievementIndex:'',
            notes:'',
            dateAchieved:null,
            lastReviewed:null,
            achievementDate:null,
            achievement:'',
        });

        this.stratergiesForm = this.formBuilder.group({
            detail:'',
            PersonID:this.personIdForStrategy,
            outcome:null,
            strategyId:'',
            serviceTypes:'',
            recordNumber:'',
        });

        this.quoteListForm = this.formBuilder.group({
            chargeType: null,
            code: null,
            displayText: null,
            strategy: null,
            sequenceNo: null,

            quantity: null,
            billUnit: null,
            period: null,
            weekNo: null,
            itemId: null,

            price: null,
            gst: null,
            min: null,
            quoteValue: null,
            quoteBudget: null,

            roster: null,
            rosterString: null,
            notes: null,

            editable: true
        });

        this.supplements = this.formBuilder.group({
            domentica:false,
            levelSupplement:'',
            oxygen:false,
            feedingSuplement:false,
            feedingSupplement:'',
            EACHD:false,
            viabilitySuplement:false,
            viabilitySupplement:'',
            financialSup:''
        });

        this.quoteListForm.get('chargeType').valueChanges
        .pipe(
            switchMap(x => {   
                console.log(x)             
                this.resetQuotePrimary();
                if(!x) return EMPTY;
                return this.listS.getchargetype({
                    program: this.quoteForm.get('program').value,
                    index: x
                  })
            })
        ).subscribe(data => {
            this.codes = data;
        });

        this.quoteListForm.get('code').valueChanges.pipe(
            switchMap(x => {
                if(!x)
                    return EMPTY;

                return this.listS.getprogramproperties(x)
            })
        ).subscribe(data => {
            this.recipientProperties = data;
            
            this.quoteListForm.patchValue({ displayText: data.billText, price: data.amount, roster: 'None',itemId: data.recnum })
        });

        this.quoteListForm.get('roster').valueChanges.subscribe(data => {
            this.weekly = data;
            this.setPeriod(data);
        });

        this.quoteForm.get('program').valueChanges
        .pipe(
            switchMap(x => {
                if(!x) return EMPTY;
                return this.listS.getprogramlevel(x)
            }),
            switchMap(x => {                
                this.IS_CDC = false;
                if(x.isCDC){
                    this.IS_CDC = true;
                    if(x.quantity && x.timeUnit == 'DAY'){
                        this.quoteForm.patchValue({
                            govtContrib: (x.quantity*365).toFixed(2),
                            programId: x.recordNumber
                        });
                    }
                    this.detectChanges();
                    return this.listS.getpensionandfee();
                }
                this.detectChanges();
                return EMPTY;
            })
        ).subscribe(data => {
            console.log(  + data)
            this.detectChanges();
        });

        this.supplements.get('levelSupplement').valueChanges.pipe(
            switchMap(x => {
                if(!x) return EMPTY;
                console.log("value "+ x);
                return this.listS.getprogramlevel(x)
            }),
            switchMap(x => {                
                this.IS_CDC = false;
                if(x.isCDC){
                    this.IS_CDC = true;
                    if(x.quantity && x.timeUnit == 'DAY'){
                        this.quoteForm.patchValue({
                            govtContrib: (x.quantity*365).toFixed(2),
                            programId: x.recordNumber
                        });
                    }
                    this.detectChanges();
                    return this.listS.getpensionandfee();
                }
                this.detectChanges();
                return EMPTY;
            })
           ).subscribe(data => {
            console.log(data)
            this.detectChanges();
        });

        // .pipe(
        //     switchMap(x => {
        //         if(!x) return EMPTY;
        //         return this.listS.getprogramlevel(x)
        //     }),
        //     switchMap(x => {                
        //         this.IS_CDC = false;
        //         if(x.isCDC){
        //             this.IS_CDC = true;
        //             if(x.quantity && x.timeUnit == 'DAY'){
        //                 this.quoteForm.patchValue({
        //                     govtContrib: (x.quantity*365).toFixed(2),
        //                     programId: x.recordNumber
        //                 });
        //             }
        //             this.detectChanges();
        //             return this.listS.getpensionandfee();
        //         }
        //         this.detectChanges();
        //         return EMPTY;
        //     })
        // ).subscribe(data => {
        //     console.log(data)
        //     this.detectChanges();
        // });

    }

    // buildForm() {
    //     this.inputForm = this.formBuilder.group({
    //         autoLogout: [''],
    //         emailMessage: false,
    //         excludeShiftAlerts: false,
    //         excludeFromTravelinterpretation:false,
    //         inAppMessage: false,
    //         logDisplay: false,
    //         pin: [''],
    //         staffTimezoneOffset:[''],
    //         rosterPublish: false,
    //         shiftChange: false,
    //         smsMessage: false
    //     });

    //     this.quoteGeneralForm = this.formBuilder.group({
    //         id:null,
    //         planType:null,
    //         name:null,
    //         careDomain:null,
    //         discipline:null,
    //         program:null,
    //         starDate:null,
    //         signOfDate:null,
    //         reviewDate:null,
    //         rememberText:null,
    //         publishToApp:false
    //     });

    //     this.quoteForm = this.formBuilder.group({
    //         program: null,
    //         template: null,

    //         no: null,
    //         type: null,
    //         period: [],
    //         basePeriod: null,


    //     });

    //     this.quoteListForm = this.formBuilder.group({
    //         chargeType: null,
    //         code: null,
    //         displayText: null,
    //         strategy: null,
    //         sequenceNo: null,

    //         quantity: null,
    //         billUnit: null,
    //         period: null,
    //         weekNo: null,

    //         price: null,
    //         gst: null,
    //         min: null,
    //         quoteValue: null,
    //         quoteBudget: null,

    //         roster: null,
    //         rosterString: null,
    //         notes: null,

    //         editable: true
    //     });

    //     this.quoteListForm.get('chargeType').valueChanges
    //     .pipe(
    //         switchMap(x => {                
    //             this.resetQuotePrimary();
    //             if(!x) return EMPTY;
    //             return this.listS.getchargetype({
    //                 program: this.quoteForm.get('program').value,
    //                 index: x
    //               })
    //         })
    //     ).subscribe(data => {
    //         this.codes = data;
    //     });

    //     this.quoteListForm.get('code').valueChanges.pipe(
    //         switchMap(x => {
    //             if(!x)
    //                 return EMPTY;

    //             return this.listS.getprogramproperties(x)
    //         })
    //     ).subscribe(data => {
    //         this.recipientProperties = data;
    //         this.quoteListForm.patchValue({ displayText: data.billText, price: data.amount, roster: 'None' })
    //     });

    //     this.quoteListForm.get('roster').valueChanges.subscribe(data => {
    //         this.weekly = data;
    //         this.setPeriod(data);
    //     });

    //     this.quoteForm.get('program').valueChanges
    //     .pipe(
    //         switchMap(x => this.listS.getprogramlevel(x)),
    //         switchMap(x => {                
    //             this.IS_CDC = false;
    //             if(x.isCDC){
    //                 this.IS_CDC = true;
    //                 this.detectChanges();
    //                 return this.listS.getpensionandfee();
    //             }
    //             this.detectChanges();
    //             return EMPTY;
    //         })
    //     ).subscribe(data => {
    //         console.log(data)
    //         this.detectChanges();
    //     });
    // }

    setPeriod(data: any){

        if(data && data != 'None'){

            this.quoteListForm.get('period').disable();

            this.quoteListForm.patchValue({
                period: data.toUpperCase(),
                billUnit: 'HOUR',
                weekNo: 52
            })

            return;
        }

        this.quoteListForm.patchValue({
            period: 'WEEKLY',
            billUnit: 'HOUR',    
            weekNo: 52
        })

        this.quoteListForm.get('period').enable();

        
        
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    slotsChange(data: any){
        this.quoteListForm.patchValue({
            quantity: data.quantity,
            rosterString: data.roster
        });
    }

    showAcceptModal(item: any) {
        console.log(item.programStatus)
        if(['REFERRAL','INACTIVE'].includes(item.programStatus)){
            console.log('referral')
            this.recipientOption =  this.RECIPIENT_OPTION.ADMIT;
            this.recipientOptionOpen = {};
            // this.inActiveOpen = true;
        }
        if(['ACTIVE','ONHOLD'].includes(item.programStatus)){
            console.log('active')
            this.activeOpen = true;
        }
    }

    filterChange(data: any){
        this.search(this.user);
    }

    showQuoteModal(){
        this.quotesOpen = true;
        this.IS_CDC = false;
        this.tabFindIndex = 2; 

        let id = this.user.id.substr(this.user.id - 5)

        this.populateDropdDowns();
        
        this.listS.getprogramcontingency(this.user.id).subscribe(data => this.quoteProgramList = data);
        
        this.listS.getglobaltemplate().subscribe(data => this.quoteTemplateList = data);
        
        this.listCarePlanAndGolas();
        this.quoteGeneralForm.controls.careDomain.setValue("NOT SPECIFIED");
        this.quoteGeneralForm.controls.discipline.setValue("NOT SPECIFIED");
        this.quoteForm.get('program').value ? this.quoteGeneralForm.controls.careDomain.setValue("NOT SPECIFIED") : this.quoteForm.get('program').value;
        this.quoteGeneralForm.patchValue({
            id: this.carePlanID.itemId,
            planType:"SUPPORT PLAN",
            name:this.quoteForm.get('template').value,
            starDate   :this.date,
            signOfDate :this.date,
            reviewDate :this.date,
            publishToApp:false
        });

        // console.log(this.user)
        this.listS.getrecipientsqlid(this.user.id).subscribe(data => {
            this.clientId = data;
        })

        this.quoteForm.reset({
            program: null,
            template: null,
            no: null,
            type: null,
            period: [],
            basePeriod: null,
            programId: null
        });


        this.detectChanges();       
    }
    listCarePlanAndGolas(){
        this.loading = true;
        this.listS.getCareplangoals('45976').subscribe(data => {
            this.goalsAndStratergies = data;
            this.loading = false;
            this.cd.markForCheck();
        });
    }
    listStrtegies(personID:any){
        this.loading = true;
        this.listS.getStrategies(personID).subscribe(data => {
            this.stratergiesList = data;
            this.loading = false;
            this.cd.markForCheck();
        });
    }
    saveCarePlan(){

        if(!this.isUpdateGoal){
            this.timeS.postGoalsAndStratergies(this.goalsAndStratergiesForm.value).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data Inserted');
                    this.goalAndStrategiesmodal = false;
                    this.listCarePlanAndGolas();
                    this.cd.markForCheck();
                });
        }else{
            this.timeS.updateGoalsAndStratergies(this.goalsAndStratergiesForm.value).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data Inserted');
                    this.goalAndStrategiesmodal = false;
                    this.listCarePlanAndGolas();
                    this.isUpdateGoal = false;
                    this.cd.markForCheck();

            });
        }
        this.cd.markForCheck();
    }
    

    saveStrategy(){
        this.stratergiesForm.controls.PersonID.setValue(this.personIdForStrategy);
        if(!this.isUpdateStrategy){
            this.timeS.postplanStrategy(this.stratergiesForm.value).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data Inserted');
                    this.strategiesmodal = false;
                    this.listStrtegies(this.personIdForStrategy);
                    this.cd.markForCheck();
                });
        }else{
            this.timeS.updateplanStrategy(this.stratergiesForm.value).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data Inserted');
                    this.strategiesmodal = false;
                    this.listStrtegies(this.personIdForStrategy);
                    this.cd.markForCheck();
                });
        }
        this.cd.markForCheck();
    }

    showCarePlanStrategiesModal(){
        this.goalAndStrategiesmodal = true;
        this.personIdForStrategy = '';
        this.listS.getgoalofcare().subscribe(data => this.goalOfCarelist = data);
    }
    showStrategiesModal(){
        this.stratergiesForm.reset();
        this.isUpdateStrategy = false;
        this.strategiesmodal = true;
    }
    showEditCarePlanModal(data:any){
        this.goalAndStrategiesmodal = true;
        this.isUpdateGoal = true;
        this.listStrtegies(data.recordnumber);
        this.personIdForStrategy = data.recordnumber;
        this.goalsAndStratergiesForm.patchValue({
            title : "Goal Of Care : ",
            goal  : data.goal,
            achievementDate  : data.achievementDate,
            dateAchieved     : data.dateAchieved,
            lastReviewed     : data.lastReviewed,
            achievementIndex : data.achievementIndex,
            achievement      : data.achievement,
            notes            : data.notes,
            recordnumber     : data.recordnumber,
        })
    }
    showEditStrategyModal(data:any){
        this.isUpdateStrategy = true;
        this.strategiesmodal = true;
        this.stratergiesForm = this.formBuilder.group({
            detail:data.strategy,
            PersonID:data.recordnumber,
            outcome:data.achieved,
            strategyId:data.contractedId,
            serviceTypes:data.dsServices,
            recordNumber:data.recordnumber,
        });
    }
    quoteLineModal(){
        this.quoteLineOpen = true;
        this.quoteListForm.reset();
    }

    handleOk(){

    }

    handleCancel(){
        this.quotesOpen = false;
        this.inActiveOpen = false;
        this.activeOpen = false;
    }

    handleCancelLine(){
        this.quoteLineOpen = false;
    }

    tabFindIndex: number = 0;
    tabFindChange(index: number){
        this.tabFindIndex = index;
        if(this.tabFindIndex == 0){
            this.quoteGeneralForm.patchValue({
                name:this.quoteForm.get('template').value,
                program:this.globalS.isEmpty(this.quoteForm.get('program').value) ? "NOT SPECIFIED" : this.quoteForm.get('program').value,
                id: this.carePlanID.itemId,
                planType:"SUPPORT PLAN",
                careDomain:"NOT SPECIFIED",
                discipline:"NOT SPECIFIED",
                starDate   :this.date,
                signOfDate :this.date,
                reviewDate :this.date,
                publishToApp:false
            })
        }
    }
    tabFinderIndexbtn:number = 0;
    tabFindChangeStrategies(index: number){
        this.tabFinderIndexbtn = index;
    }

    printLoad: boolean = false;
    print(){
        this.printLoad = true;
        this.listS.printquote(this.document_print_quote)
            .subscribe(blob => {
                var file = new Blob([blob], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
                console.log(file);
                this.printLoad = false;

                let data = window.URL.createObjectURL(file);
                let link = document.createElement('a');
                link.href = data;
                link.download = "quotes.docx";
                link.click();
        
                setTimeout(() => {
                  window.URL.revokeObjectURL(data);
                }, 100);
            });
    }

    search(user: any) {
        console.log(user);

        this.loading = true;
        this.user = user;
        

        let data = {
            quote: {
                PersonID: user.id,
                DisplayLast: this.displayLast,
                IncludeArchived: this.archivedDocs,
                IncludeAccepted: this.acceptedQuotes
            },
            filters: this.filters
        }

        this.document_print_quote = data;

        this.listS.getlistquotes(data).subscribe(data => {
            this.tableData = data;
            this.loading = false;
            this.cd.markForCheck();
        })

        this.timeS.getCarePlanID().subscribe(data => {this.carePlanID = data[0];this.cd.markForCheck();});
    }
    populateDropdDowns() {
        
        this.expecteOutcome = expectedOutcome;

        let notSpecified =["NOT SPECIFIED"];
        
        this.listS.getdiscipline().subscribe(data => {
            data.push('NOT SPECIFIED');
            this.disciplineList = data;
        });
        this.listS.getcaredomain().subscribe(data => {
            data.push('NOT SPECIFIED');
            this.careDomainList = data
        }); 
        this.listS.getndiaprograms().subscribe(data => {
            data.push('NOT SPECIFIED');
            this.programList = data;
        });
        this.listS.getcareplan().subscribe(data => {this.quotePlanType = data;})
        
        this.listS.getplangoalachivement().subscribe(data=> this.plangoalachivementlis = data)
        this.detectChanges();
    }
    patchData(data: any) {
        this.inputForm.patchValue({
            autoLogout: data.autoLogout,
            emailMessage: data.emailMessage,
            excludeShiftAlerts: data.excludeShiftAlerts,
            inAppMessage: data.inAppMessage,
            logDisplay: data.logDisplay,
            pin: data.pin,
            rosterPublish: data.rosterPublish,
            shiftChange: data.shiftChange,
            smsMessage: data.smsMessage
        });
    }    

    detectChanges(){
        this.cd.markForCheck();
        this.cd.detectChanges();
    }
    

    onKeyPress(data: KeyboardEvent) {
        return this.globalS.acceptOnlyNumeric(data);
    }

    resetQuotePrimary(){
        this.quoteListForm.patchValue({
            code: null,
            displayText: null,
            roster: null,
            strategy: null
        });
    }

    save() {
        const group = this.inputForm;
        this.timeS.updatetimeandattendance({
            AutoLogout: group.get('autoLogout').value,
            EmailMessage: group.get('emailMessage').value,
            ExcludeShiftAlerts: group.get('excludeShiftAlerts').value,
            ExcludeFromTravelinterpretation: group.get('excludeFromTravelinterpretation').value,
            InAppMessage: group.get('inAppMessage').value,
            LogDisplay: group.get('logDisplay').value,
            Pin: group.get('pin').value,
            StaffTimezoneOffset:group.get('staffTimezoneOffset').value,
            RosterPublish: group.get('rosterPublish').value,
            ShiftChange: group.get('shiftChange').value,
            SmsMessage: group.get('smsMessage').value,
            Id: this.user.id
        }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) {
                this.globalS.sToast('Success', 'Change successful');
                this.inputForm.markAsPristine();
                return;
            }
        });
    }

    canDeactivate() {
        if (this.inputForm && this.inputForm.dirty) {
            this.modalService.confirm({
                nzTitle: 'Save changes before exiting?',
                nzContent: '',
                nzOkText: 'Yes',
                nzOnOk: () => {
                    this.save();
                },
                nzCancelText: 'No',
                nzOnCancel: () => {

                }
            });
        }
        return true;
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        
    }

    hello(data: any){
        console.log(data);
        return false;
    }

    GENERATE_QUOTE_LINE(){
        
        setTimeout(() => {
            this.quoteLines = [...this.quoteLines, this.quoteListForm.getRawValue()];
            this.handleCancelLine();
            this.detectChanges();
        }, 0);
    }

    saveQuote(){
        let qteLineArr: Array<QuoteLineDTO> = [];
        let qteHeader: QuoteHeaderDTO;

        const quoteForm = this.quoteForm.getRawValue();
        console.log(quoteForm)

        console.log( this.quoteLines);
        // console.log(qteHeader);

        this.quoteLines.forEach(x => {
            let da: QuoteLineDTO = {
                sortOrder: 0,
                billUnit: x.billUnit,
                itemId: x.itemId,
                qty: x.quantity,
                displayText: x.displayText,

                unitBillRate: x.price,
                frequency: x.period,
                lengthInWeeks: x.weekNo,
                roster: x.rosterString
            };
            qteLineArr.push(da);
        });

        qteHeader = {
            programId: quoteForm.programId,
            clientId: this.clientId,
            quoteLines: qteLineArr,
            daysCalc: 365,
            budget: "51808.1",
            quoteBase: 'ANNUALLY',
            govtContribution: 51808.10,
            packageSupplements: '000000000000000000',
            agreedTopUp: '0.00',
            balanceAtQuote: '0.00',
            clAssessedIncomeTestedFee: '0.00',

            feesAccepted: 0,
            basePension: 'SINGLE',
            dailyBasicCareFee: '$0.00',
            dailyIncomeTestedFee: '$0.00',
            dailyAgreedTopUp: '$0.00',
            quoteView: 'ANNUALLY',

            personId: this.user.id

        }
        // console.log(qteHeader)
        return;
        this.listS.getpostquote(qteHeader).subscribe(data => {
                console.log(data);
                this.globalS.sToast('Success','Quote Added');
            }, (error: any) => {
                console.log(error)
                this.globalS.eToast('Error', error.error.message)
            }) 
    }
    
    deleteCarePlanGoal(data: any){
    this.timeS.deleteCarePlangoals(data.recordnumber)
        .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) {
                this.globalS.sToast('Success', 'Data Deleted!');
                this.listCarePlanAndGolas();
                this.cd.markForCheck();
            return;
         }
         this.cd.markForCheck();
      });
    }

    deleteCarePlanStrategy(data: any){
        this.timeS.deleteCarePlanStrategy(data.recordnumber)
        .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) {
                this.globalS.sToast('Success', 'Data Deleted!');
                this.listStrtegies(this.personIdForStrategy);
                this.cd.markForCheck();
            return;
         }
         this.cd.markForCheck();
      });
    }

      handleOkTop(type:any) {
        this.generatePdf(type);
        this.tryDoctype = ""
        this.pdfTitle = ""
      }
      handleCancelTop(): void {
        this.drawerVisible = false;
        this.pdfTitle = ""
      }
      generatePdf(type:any){
        this.drawerVisible = true;
        this.loading = true;
        if(type==1)
        var fQuery = "SELECT RecordNumber as recordnumber,CONVERT(varchar, [Date1],105) as Field1,CONVERT(varchar, [Date2],105) as Field2,CONVERT(varchar, [DateInstalled],105) as Field3,[State] as Field4, User1 AS Field5 FROM HumanResources WHERE PersonID = '45976' AND [Type] = 'CAREPLANGOALS' ORDER BY Name";
        else
        var fQuery = "SELECT RecordNumber, Notes AS Field1, Address1 AS Field2, [State] AS Field3, User1 AS Field4 FROM HumanResources WHERE [PersonID] = '45976' AND [GROUP] = 'PLANSTRATEGY'";
        
        
        const headerDict = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
        
        const requestOptions = {
          headers: new HttpHeaders(headerDict)
        };
        
        if(type ==1 ){
             this.pdfdata = {
                "template": { "_id": "0RYYxAkMCftBE9jc" },
                "options": {
                  "reports": { "save": false },
                  "txtTitle": "Care Plan Goals List",
                  "sql": fQuery,
                  "userid":this.tocken.user,
                  "head1" : "Ant Complete",
                  "head2" : "Last Review",
                  "head3" : "Completed",
                  "head4" : "Percent",
                  "head5" : "Goal",
                }
              }
        }else{
            this.pdfdata = {
                "template": { "_id": "0RYYxAkMCftBE9jc" },
                "options": {
                  "reports": { "save": false },
                  "txtTitle": "Care Plan Strategies List",
                  "sql": fQuery,
                  "userid":this.tocken.user,
                  "head1" : "Strategy",
                  "head2" : "Achieved",
                  "head3" : "Contracted ID",
                  "head4" : "DS Services",
                }
    
              }
        }
        

        this.http.post(this.rpthttp, JSON.stringify(this.pdfdata), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
          let _blob: Blob = blob;
          let fileURL = URL.createObjectURL(_blob);
          this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          this.loading = false;
          this.detectChanges();
        }, err => {
          console.log(err);
          this.loading = false;
          this.ModalS.error({
            nzTitle: 'TRACCS',
            nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
            nzOnOk: () => {
              this.drawerVisible = false;
            },
          });
        });
        this.detectChanges();
        this.loading = true;
        this.tryDoctype = "";
        this.pdfTitle = "";
      }
    handlegoalsStarCancel(){
        this.goalAndStrategiesmodal = false;
        this.isUpdateGoal = false;
        this.personIdForStrategy = '';
    }
    handleStarCancel(){
        this.strategiesmodal = false;
        this.isUpdateStrategy = false;
    }

    record: any;
    updateQuoteModal(data: any){
        console.log(  data);
        this.option = 'update';
        this.record = data.recordNumber;
        this.newQuoteModal = !this.newQuoteModal
    }

}
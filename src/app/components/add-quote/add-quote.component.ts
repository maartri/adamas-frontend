import { Component, OnInit, forwardRef, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { GlobalService, ListService, TimeSheetService, ShareService,expectedOutcome,qoutePlantype, leaveTypes } from '@services/index';
import * as _ from 'lodash';
import { forkJoin, Observable, EMPTY, Subject } from 'rxjs';
import parseISO from 'date-fns/parseISO'
import { RemoveFirstLast } from '../../pipes/pipes';
import { mergeMap, debounceTime, distinctUntilChanged, first, take, takeUntil, switchMap, concatMap } from 'rxjs/operators';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { dateFormat } from '@services/global.service'
import { NzModalService } from 'ng-zorro-antd/modal';

import { Filters, QuoteLineDTO, QuoteHeaderDTO } from '@modules/modules';
import { billunit, periodQuote, basePeriod } from '@services/global.service';
import { MedicalProceduresComponent } from '@admin/recipient-views/medical-procedures.component';
// import { Console } from 'node:console';

import addYears from 'date-fns/addYears';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

const noop = () => {};

@Component({
  selector: 'app-add-quote',
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddQuoteComponent),
    }
  ],
})
export class AddQuoteComponent implements OnInit {

    @Input() open: boolean = false;
    @Input() user: any; 
    @Input() option: any;
    @Input() record: any;
    
    private unsubscribe: Subject<void> = new Subject();
    
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    size: string = 'small';
    title: string = 'Add New Quote';

    slots: any;

    billUnitArr: Array<string> = billunit;
    periodArr: Array<string> = periodQuote;
    basePeriodArr: Array<string> = basePeriod;


    dateFormat: string = dateFormat;
    clientId: number;
    weekly: string = 'Weekly';
    date: Date = new Date();
    nzSize: string = "small"
    
    tabFindIndex: number = 0;

    inputForm: FormGroup;
    activeForm: FormGroup;
    inActiveForm: FormGroup;
    quoteForm: FormGroup;
    quoteGeneralForm : FormGroup;
    quoteIdsForm: FormGroup;
    quoteListForm: FormGroup;


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
    typeList: Array<any> = [];
    careDomainList: any;
    programList: any;
    quotePlanType: string[];
    carePlanID: any;
    goalOfCarelist: any;
    goalsAndStratergies: any;
    userCopy: any;

    quoteLines: Array<any> = [];

    quoteLinesTemp: Array<any> = [];

    loggedInUser: any;

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
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.quoteGeneralForm.controls.discipline.setValue("NOT SPECIFIED");
    this.quoteGeneralForm.controls.careDomain.setValue("NOT SPECIFIED");

    this.loggedInUser = this.globalS.decode();

  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && 
            !changes[property].firstChange &&
              changes[property].currentValue != null) {
        // console.log(this.option)
        // console.log(this.record)

        this.search(this.user);
        this.showQuoteModal();
        this.buildForm();
      }
    }
  }

  showQuoteModal(){

      this.quotesOpen = true;
      this.tabFindIndex = 2; 

      let id = this.user.id.substr(this.user.id - 5)

      this.populateDropdDowns();
      
      this.listS.getprogramcontingency(this.user.id).subscribe(data => this.quoteProgramList = data);
      
      this.listS.getglobaltemplate().subscribe(data => this.quoteTemplateList = data);
      
      this.listCarePlanAndGolas();
      this.quoteGeneralForm.controls.careDomain.setValue("NOT SPECIFIED");
      this.quoteGeneralForm.controls.discipline.setValue("NOT SPECIFIED");
      this.quoteForm.get('program').value ? this.quoteGeneralForm.controls.careDomain.setValue("NOT SPECIFIED") : this.quoteForm.get('program').value;
      
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
          basePeriod: 'ANNUALLY',
          programId: null
      });


      this.detectChanges();       
  }

  buildForm() {
    
    if(this.option == 'add'){
        this.quoteLines = [];
    }

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
          recordNumber: null,
          program: null,
          template: null,
          no: null,
          type: null,
          period: [],
          basePeriod: 'ANNUALLY',

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

          editable: true,
          recordNumber: null,
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
              this.resetQuotePrimary();
              if(!x) return EMPTY;
              return this.listS.getchargetype({
                  program: this.quoteForm.get('program').value,
                  index: x
                })
          })
      ).subscribe(data => {
          this.codes = data;
        //   if(this.option == 'update')
        //   {
        //        var x = this.updateValues;
        //        console.log(x);
        //        setTimeout(() => {
        //         this.quoteListForm.patchValue({
        //             code: x.title,
        //             displayText: x.displayText,                
        //         })
        //         this.detectChanges();
        //        }, 100);
        //   }
      });

      this.quoteListForm.get('code').valueChanges.pipe(
          switchMap(x => {
              if(!x)
                  return EMPTY;

              return this.listS.getprogramproperties(x)
          })
      ).subscribe(data => {
          this.recipientProperties = data;
          
          if(this.option == 'add'){
            this.quoteListForm.patchValue({ 
                displayText: data.billText, 
                price: data.amount, 
                roster: 'None',
                itemId: data.recnum 
            })
          }

          if(this.option == 'update'){
              console.log(this.updateValues)
            this.quoteListForm.patchValue({ 
                displayText: data.billText, 
                price: data.amount,
                itemId: data.recnum,
                roster: this.determineRosterType(this.updateValues)
            });
          }
      });




      this.quoteForm.get('basePeriod').valueChanges
            .subscribe(x => {
                console.log(x)
                if(!x) return EMPTY;
                if(x == 'ANNUALLY'){
                    setTimeout(() => {
                        this.quoteForm.patchValue({
                            period:[new Date(), addYears(new Date(), 1)]
                        });
                    }, 0);
                }

                if(x == 'FIXED PERIOD'){
                    setTimeout(() => {
                        this.quoteForm.patchValue({
                            period:[startOfMonth(new Date()), endOfMonth(new Date())]
                        });
                    }, 0);
                }
                this.detectChanges();
            })

      this.quoteListForm.get('roster').valueChanges.subscribe(data => {
          this.weekly = data;
          this.setPeriod(data);
      });

      this.quoteForm.get('program').valueChanges
      .pipe(
          switchMap(x => {
              if(!x) {
                return EMPTY
              };
       
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
          this.detectChanges();
      });

      

  }


  determineRosterType(data: any){
    if(data.roster && data.roster.length > 0)
    {
        return data.frequency
    }

    if(data.roster == null || this.globalS.isEmpty(data.roster)){
        return 'NONE';
    }
  }

  resetQuotePrimary(){
      this.quoteListForm.patchValue({
          code: null,
          displayText: null,
          roster: null,
          strategy: null
      });
  }

  detectChanges(){
      this.cd.markForCheck();
      this.cd.detectChanges();
  }

  setPeriod(data: any){
      
    if(data && data != 'None'){
        if(this.option == 'add'){
            this.quoteListForm.get('period').disable();

            this.quoteListForm.patchValue({
                period: data.toUpperCase(),
                billUnit: 'HOUR',
                weekNo: 52
            })
        }
        return;
    }

    if(this.option == 'add')
    {
        this.quoteListForm.patchValue({
            period: 'WEEKLY',
            billUnit: 'HOUR',    
            weekNo: 52
        })
    }

    this.quoteListForm.get('period').enable();
  }

  handleOkTop(type:any) {
    // this.generatePdf(type);
    this.tryDoctype = ""
    this.pdfTitle = ""
  }

  handleOk(){

  }

  handleCancel(){
      this.quotesOpen = false;
      this.inActiveOpen = false;
      this.activeOpen = false;
  }

  handleCancelTop(): void {
    this.drawerVisible = false;
    this.pdfTitle = ""
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

    deleteQuoteList(data: any, index: number){
        if(this.option == 'update'){
            // this.quoteLines = this.quoteLines.filter((x, i) => i !== index);
            // console.log(data)
            this.listS.deletequoteline(data.recordNumber).subscribe(data => {
                this.quoteLines = this.quoteLines.filter((x, i) => i !== index);
                this.detectChanges();
            });
        }

        if(this.option == 'add'){
            console.log('add');
            this.quoteLines = this.quoteLines.filter((x, i) => i !== index);
        }
        
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

  getChargeType(type: string): any{
        if(type == 'DIRECT SERVICE')
            return '1';

        if(type == 'GOODS/EQUIPMENT')
            return '2';

        if(type == 'PACKAGE ADMIN')
            return '3';
    
        if(type == 'CASE MANAGEMENT')
            return '4';
  }

  updateValues: any;
  firstLoadQuoteLine: boolean = true;
  quoteLineIndex: number;

  showEditQuoteModal(data: any, index: number){

    this.quoteLineIndex = index;

    this.listS.getquotelinedetails(data.recordNumber)
        .subscribe(x => {
            this.updateValues = x;
            setTimeout(() => {
                this.quoteListForm.patchValue({
                    chargeType: this.getChargeType(x.mainGroup),
                    code: x.title,
                    displayText: x.displayText,
                    quantity: x.qty,
                    period: x.frequency,
                    billUnit: x.billUnit,
                    weekNo: x.lengthInWeeks,
                    price: x.rate,
                    notes: x.notes,
                    recordNumber: data.recordNumber
                })
                console.log(this.quoteListForm.value)
            }, 100);
            
            this.detectChanges();
        });

    this.quoteLineOpen = true;
    this.firstLoadQuoteLine = true;
  }

  tabFinderIndexbtn:number = 0;
  tabFindChangeStrategies(index: number){
      this.tabFinderIndexbtn = index;
  }

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

  GENERATE_QUOTE_LINE(){
       if(this.option == 'add')
       {
            setTimeout(() => {
                this.quoteLines = [...this.quoteLines, this.quoteListForm.getRawValue()];
                this.handleCancelLine();
                this.detectChanges();
            }, 0);
       }

       if(this.option == 'update'){
           var quoteForm = this.quoteForm.value;
           var quoteLine = this.quoteListForm.getRawValue();
           
           let da: QuoteLineDTO = {
                sortOrder: 0,
                billUnit: quoteLine.billUnit,
                itemId: quoteLine.itemId,
                qty: quoteLine.quantity,
                displayText: quoteLine.displayText,

                unitBillRate: quoteLine.price,
                frequency: quoteLine.period,
                lengthInWeeks: quoteLine.weekNo,
                roster: quoteLine.rosterString,
                serviceType: quoteLine.code
            };
            console.log(quoteLine)


            // return;
            this.listS.updatequoteline(da, this.updateValues.recordNumber)
                .subscribe(data => {
                        this.globalS.sToast('Success', 'Quote Line updated')
                       
                        
                        var q = this.quoteLines[this.quoteLineIndex];
                        q.code = quoteLine.code;
                        q.displayText = quoteLine.displayText;
                        q.quantity = quoteLine.quantity;
                        q.billUnit = quoteLine.billUnit;
                        q.frequency = quoteLine.period;
                        q.lengthInWeeks = quoteLine.weekNo;
                        q.price = quoteLine.price;
                        q.tax = quoteLine.gst;
                        q.recordNumber = quoteLine.recordNumber;

                        this.quoteLineOpen = false;
                        this.detectChanges();
                });

       }
  }

  handleCancelLine(){
      this.quoteLineOpen = false;
  }

  saveQuote(){
    let qteLineArr: Array<QuoteLineDTO> = [];
    let qteHeader: QuoteHeaderDTO;

    const quoteForm = this.quoteForm.getRawValue();
    console.log(quoteForm);

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
            roster: x.rosterString,
            serviceType: x.code
        };
        qteLineArr.push(da);
    });

    qteHeader = {
        programId: quoteForm.programId,
        program: quoteForm.program,
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

        personId: this.user.id,
        user: this.loggedInUser.user,
        template: quoteForm.template,
        type: quoteForm.type
    }

    // console.log(qteHeader);
    // return;

    this.listS.getpostquote(qteHeader)
        .subscribe(data => {
            this.globalS.sToast('Success','Quote Added');
        });
  }

  refreshQuoteLines(recordNo: any){
      
  }

  slotsChange(data: any){

      // This would stop process at the bottom on first load of QuoteLineModal
      if(this.firstLoadQuoteLine){
          this.firstLoadQuoteLine = false;
          return;
      }

      this.quoteListForm.patchValue({
          quantity: data.quantity,
          rosterString: data.roster
      });
  }

  quoteLineModal(){
      this.quoteLineOpen = true;
      this.firstLoadQuoteLine = true;
      this.quoteListForm.reset();
  }

  populateDropdDowns() {
        
      this.expecteOutcome = expectedOutcome;

      let notSpecified =["NOT SPECIFIED"];

      this.listS.getquotetype().subscribe(data =>this.typeList = data);
      
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

  search(user: any) {

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

      // this.listS.getlistquotes(data).subscribe(data => {
      //     this.tableData = data;
      //     this.loading = false;
      //     this.cd.markForCheck();
      // })
      
      this.timeS.getCarePlanID().subscribe(data => {
        this.carePlanID = data[0];

        this.quoteGeneralForm.patchValue({
          id: this.carePlanID.itemId,
          planType:"SUPPORT PLAN",
          name:this.quoteForm.get('template').value,
          starDate   :this.date,
          signOfDate :this.date,
          reviewDate :this.date,
          publishToApp:false
      });

        this.cd.markForCheck();
      });


      if(this.option == 'update' && this.record)
      {
          this.listS.getquotedetails(this.record).subscribe(data => {
              console.log(data)
              this.quoteForm.patchValue({
                  recordNumber: data.recordNumber,
                  program: data.program
              });

              this.quoteLines = data.quoteLines.length > 0 ? data.quoteLines.map(x => {
                  return {
                    code: x.serviceType,
                    displayText: x.displayText,
                    quantity: x.qty,
                    billUnit: x.billUnit,
                    frequency: x.frequency,
                    price: x.unitBillRate,
                    recordNumber: x.recordNumber,
                    tax: x.tax , 
                    lengthInWeeks:x.lengthInWeeks,
                    basequote: x.unitBillRate * x.frequency
                  }
              }) : [];
              
          })
      }
  }

  amount(var1:number,var2:number){
    var product
    product = (var1 * var2 );

    return product.toFixed(2)

  }
  totalamount(var1:number,var2:number,var3:number){
    var product : number;
    
    if(var3 != null && var3 != 0){
    product = ((var1 * var2 ) * var3);
    }else{
        product = (var1 * var2 );
    }
     
    this.globalS.baseamount =  product
    return product.toFixed(2)

  }
  fbasequote(){
    // console.log(this.quoteLines)
    return this.globalS.baseamount.toFixed(2) ;
  }

}//this.quoteLines

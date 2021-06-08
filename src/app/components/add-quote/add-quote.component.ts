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

import { Filters, QuoteLineDTO, QuoteHeaderDTO } from '@modules/modules';
import { billunit, periodQuote, basePeriod } from '@services/global.service';
import { MedicalProceduresComponent } from '@admin/recipient-views/medical-procedures.component';
// import { Console } from 'node:console';

import addYears from 'date-fns/addYears';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PrintPdfComponent } from '@components/print-pdf/print-pdf.component';
import { filter, toLength, xor } from 'lodash';
import { parseJSON } from 'date-fns';

// import { Console } from 'node:console';


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

    confirmModal?: NzModalRef; 


    disableAddTabs: boolean = true;
    
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
    programLevel:any;

    codes: Array<any>;
    strategies: Array<any>;
    recipientProperties: any;
    cpid:any;
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

    temp1: any;
    topup: any;
    basiccarefee: any;
    PercAmt: any ;
    AdmPErcAmt: any;

    quoteLines: Array<any> = [];
    fquotehdr: Array<any> = [];
    mainGroup: Array<any> = [];

    quoteLinesTemp: Array<any> = [];

    loggedInUser: any;
    admincharges :number = 0;
    
    

    specindex:number;
    dochdr:any;

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

    price:number;
    quantity:number;
    length:number;
    fdata : any;

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
    private modal: NzModalService,
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
      
      this.listS.getprogramcontingency(this.user.id).subscribe(data => {
        this.quoteProgramList = data

        if(data && data.length == 1){
            this.quoteForm.patchValue({
                program: data[0]
            })
        }
      });
      
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
          programId: null,
          charges:false,
      });


      this.detectChanges();       
  }

  buildForm() {
    
    if(this.option == 'add'){
        this.quoteLines = [];

        this.total_base_quote = 0;
        this.total_admin = 0;
        this.total_quote = 0;
        this.remaining_fund = 0;
    }

    this.disableAddTabs = true;

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

          programId: null,

          charges:false,
      });

      this.quoteIdsForm = this.formBuilder.group({
          itemId: null
      });

      this.goalsAndStratergiesForm = this.formBuilder.group({
          recordnumber:null,
          goal:'',
          PersonID: null,
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
          outcome:'',
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
              this.listStrategiesDropDown(this.tableDocumentId);
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
                      this.remaining_fund = this.quoteForm.value.govtContrib;
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

      this.quoteForm.get('template').valueChanges.subscribe(data => {
        console.log('ssd')
        if(!data)   return;
        this.showConfirm();
      });

    //   this.quoteListForm.get('code').valueChanges.pipe(
    //       switchMap(x => {
    //           if(!x)
    //               return EMPTY;

    //           return this.listS.getprogramproperties(x)
    //       })
    //   ).subscribe(data => {
    //       this.recipientProperties = data;
          
    //       if(this.option == 'add'){
    //         this.quoteListForm.patchValue({ 
    //             displayText: data.billText, 
    //             price: data.amount, 
    //             roster: 'None',
    //             itemId: data.recnum 
    //         })
    //       }

    //       if(this.option == 'update'){
    //           console.log(this.updateValues)
    //         this.quoteListForm.patchValue({ 
    //             displayText: data.billText, 
    //             price: data.amount,
    //             itemId: data.recnum,
    //             roster: this.determineRosterType(this.updateValues)
    //         });
    //       }
    //   });




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
  }
  

  tableDocumentId: number;

  showConfirm(): void {
        this.confirmModal = this.modal.confirm({
        nzTitle: 'Do you want to select this template?',
        nzContent: 'When clicked the OK button, this would save this program and template',
        nzOnOk: () =>{
                // new Promise((resolve, reject) => {
                //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                
                // }).catch(() => console.log('Oops errors!'))
                let qteHeader: QuoteHeaderDTO;
                qteHeader = {
                    personId: this.user.id
                };
                this.listS.createtempdoc(qteHeader).subscribe(data => {
                    console.log(data);
                    this.tableDocumentId = data;
                    this.listCarePlanAndGolas(data);
                    this.disableAddTabs = false
                });
            }
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

  listStrategiesDropDown(docId: any){
      this.listS.getstrategyList(docId.toString()).subscribe(data => {
          this.strategies = data;
      })
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
      console.log('close quotes modal')
      this.listS.deletetempdoc(this.tableDocumentId).subscribe(data => console.log(data))
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

          this.goalsAndStratergiesForm.patchValue({
            PersonID: this.tableDocumentId
          });

          this.timeS.postGoalsAndStratergies(this.goalsAndStratergiesForm.value).pipe(
              takeUntil(this.unsubscribe))
              .subscribe(data => {
                  this.globalS.sToast('Success', 'Data Inserted');
                  this.goalAndStrategiesmodal = false;
                  this.listCarePlanAndGolas(this.tableDocumentId);
                  this.cd.markForCheck();
              });
      }else{
          this.timeS.updateGoalsAndStratergies(this.goalsAndStratergiesForm.value).pipe(
              takeUntil(this.unsubscribe))
              .subscribe(data => {
                  this.globalS.sToast('Success', 'Data Inserted');
                  this.goalAndStrategiesmodal = false;
                  this.listCarePlanAndGolas(this.tableDocumentId);
                  this.isUpdateGoal = false;
                  this.cd.markForCheck();

          });
      }
      this.cd.markForCheck();
  }
  

  saveStrategy(){
      this.stratergiesForm.controls.PersonID.setValue(this.personIdForStrategy);
    //   console.log(this.personIdForStrategy)
    //   return;
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

  listCarePlanAndGolas(docid: any = '45976'){
      this.loading = true;
      
      this.listS.getCareplangoals(docid).subscribe(data => {
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
                this.listCarePlanAndGolas(this.tableDocumentId);
                this.cd.markForCheck();
            return;
         }
         this.cd.markForCheck();
      });
    }

    deleteCarePlanStrategy(data: any){
        console.log(data)
        return;
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
    this.stratergiesForm.patchValue({
        detail:'',
        outcome:'',
        strategyId:'',
    });
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
      this.stratergiesForm.patchValue({
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

  generate_total(){
      var total: number = 0;
      this.quoteLines.forEach(x => {
        total = total + this.totalamount(x.price,x.quoteQty,x.tax,x.quantity);
      });
      return total;
  }

  total_quote: any;
  total_base_quote: any;
  total_admin: any;
  remaining_fund: any;
  GENERATE_QUOTE_LINE(){
       if(this.option == 'add')
       {
        //    console.log(this.quoteListForm.getRawValue())
           const quote  = this.quoteListForm.getRawValue();
           var _quote,_quote1,_quote2;
           
           if(this.quoteForm.value.charges == true){
           
        
            var sqlTopUpFee = "SELECT P_Def_IncludeTopUpFeeInAdmin FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' and [Name] = '" +this.quoteForm.value.program+"'"
            var sqlBasicCareFee = "SELECT P_Def_IncludeBasicCareFeeInAdmin FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' and [Name] = '" +this.quoteForm.value.program+"'"
            var sqlCMPercAmt = "SELECT P_Def_Admin_CM_PercAmt FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' and [Name] = '" +this.quoteForm.value.program+"'"
            var sqlAdminPercAmt ="Select P_Def_Admin_Admin_PercAmt FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' and [Name] = '" +this.quoteForm.value.program+"'"
      
            this.listS.GetTOpUP(sqlTopUpFee).subscribe(x => {
                this.topup = x;
               
            } );
//          
            this.listS.GetBasicCare(sqlBasicCareFee).subscribe(x => {
                this.basiccarefee = x;
               
            });
            
            this.listS.GetCMPERC(sqlCMPercAmt).subscribe(x =>{ 
                this.PercAmt = x;                                                     
              });
              
              this.listS.GetAdmPerc(sqlAdminPercAmt).subscribe(x => {
                this.AdmPErcAmt = x;                                
               }); 
               
       var temp:number = this.quoteForm.value.govtContrib
       
        
             _quote = {
        
                code: '*HCP-PACKAGE ADMIN' ,
                displayText: 'Charges' ,
                billUnit:'Service',
            //  quantity:(((this.PercAmt/100)  * temp)/ 365).toFixed(2),
                quantity: 1,
                frequency: 'Daily'  ,
                quoteQty: 365 , 
                price: this.PercAmt,              
               }
            
              
               _quote2 = {
        
                code: '*HCP FEE-PACKAGE ADMINISTRATION' ,
                displayText: 'Charges' ,
                billUnit:'Service',
            //  quantity:(((this.AdmPErcAmt/100)  * temp)/ 365).toFixed(2),
                quantity: 1,
                frequency: 'Daily'  ,
                quoteQty: 365 , 
                price: ((Number(this.AdmPErcAmt.toString().substring(0,2))/100 * temp)/ 365),
                //
              
               }
            
            //   _quote = {_quote1,_quote2}
           
           }  else{
            _quote = {
            billUnit: quote.billUnit,
            code: quote.code,
            displayText: quote.displayText,
            quantity: quote.quantity,
            frequency: quote.period,
            quoteQty: quote.weekNo, 
            price: quote.price,
            tax: quote.gst,
            itemId: quote.itemId
           }
        }
        //console.log(_quote)
            setTimeout(() => {
                this.quoteLines = [...this.quoteLines, _quote,_quote2];
                
                this.total_admin = 10361.62;
                this.total_quote = (this.generate_total() + this.total_admin).toFixed(2);
                this.total_base_quote = (this.total_quote - this.total_admin).toFixed(2);

                this.remaining_fund = (this.quoteForm.value.govtContrib - this.total_quote).toFixed(2);
            //    console.log(this.total_quote);
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
        //    console.log(quoteLine)


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
    let goals: Array<any> = [];

    let qteHeader: QuoteHeaderDTO;

   
    const quoteForm = this.quoteForm.getRawValue();

 //   console.log(quoteForm);
 //   console.log(this.quoteLines);
    
    
      

//    console.log(quoteForm);
//    console.log(this.quoteLines);
//    console.log(this.goalsAndStratergies);

    this.goalsAndStratergies.forEach(e => {
        goals.push(e.goal);
    });


    this.quoteLines.forEach(x => {
        let da: QuoteLineDTO = {
            sortOrder: 0,
            billUnit: x.billUnit,
            itemId: x.itemId,
            qty: x.quantity,
            displayText: x.displayText,

            unitBillRate: x.price,
            frequency: x.frequency,
            lengthInWeeks: x.quoteQty,
            roster: x.rosterString,
            serviceType: x.code,
            strategyId: x.strategy
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
        type: quoteForm.type,
        documentId: this.tableDocumentId,
        goals: goals
    }
//    console.log(qteHeader)
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

      this.listS.getquotetype().subscribe(data =>{
        this.typeList = data;

        if(data && data.length == 1){
            this.quoteForm.patchValue({
                type: data[0]
            });
        }
      });
      
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
               this.cpid = data.cpid;
               this.fdata = data.quoteLines;
               
              this.quoteForm.patchValue({
                  recordNumber: data.recordNumber,
                  program: data.program
              });

              this.quoteLines = data.quoteLines.length > 0 ? data.quoteLines.map(x => {

                //  console.log(x)
                this.fquotehdr = x;
                 this.dochdr = x.docHdrId
            
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
                    quoteQty:x.quoteQty
                  //basequote: ,


                    

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
  totalamount(var1:number,var2:number,var3:number,var4:number) {
    var product : number;
    
    if(var3 != null && var3 != 0){
    product = ((var1 * var2 ) * var3 * var4) ;
    }else{
        product = (var1 * var2 * var4) ;
    }
     
    this.globalS.baseamount =  product
    return product
  }
  fbasequote(){
      
        //let temp = this.fquotehdr        
        let temp = this.fdata 
        var test :number;
        
    //    let price,quantity,length;
    //    console.log(temp)
   
    if (this.option == 'update'){
        for(let i = 0;i < temp.length; i++){
            
          
            //    console.log(this.quoteLines[i].lengthInWeeks)
            //    console.log(this.quoteLines[i].quantity)
            //    console.log(this.quoteLines[i].price)
            //if(stype == "ADMINISTRATION"){ }
            this.price = temp[i].unitBillRate
            this.quantity = temp[i].qty
            this.length  = temp[i].quoteQty
               //console.log(price)
               
               test = (this.price * this.quantity * this.length)
        //       this.globalS.baseamount  = this.globalS.baseamount + test
        this.globalS.baseamount  +=  + test
        //       console.log(temp1)
            
        } 
    }
      
    

    // console.log(this.quoteLines)

    return this.globalS.baseamount.toFixed(2) ;
  }
  domenticaChange(event: any){
    if(event.target.checked){
        this.supplements.patchValue({
            levelSupplement : this.programLevel,
        })
    }else{
        this.supplements.patchValue({
            levelSupplement : '',
    })
    }
  }
//  govtContribution
  govtcontribute(){
    var temp  :number;
    temp = this.quoteForm.value.govtContrib 
//    temp =  51808.10;
    return temp.toFixed(2) ;
  }
  remainingfund(){
      var temp :Number;
    temp = (this.quoteForm.value.govtContrib -  this.admincharges - this.globalS.baseamount)
    return temp.toFixed(2)
  }

  totalQuote(){
    var temp :Number;
    temp =  (this.admincharges + this.globalS.baseamount)
    return temp.toFixed(2)
  }
  
  admincharge(){
      
    var id,stype;
   
    id  = this.cpid  ;
   // id  = '46010'  ;
   if(!id) return;
    this.listS.GetQuotetype(id).subscribe( x => {
        this.specindex = x.indexOf("ADMINISTRATION")
        //console.log(stype)

    })
   
 //   if(stype == "ADMINISTRATION" ){

    let temp = this.fdata  
        console.log(temp)
    var temp1 : number;
    var test :number;
    
//    let price,quantity,length;
//    console.log(this.specindex)
    if (this.option == 'update'){
        
        console.log(temp.length)
            let j = this.specindex
            this.admincharges = 0;
          
            //   for(let i =0;i < temp.length ,i =j;i++){
                    
                
                
                //this.price = temp[j].unitBillRate
                this.price = temp[j].unitBillRate
                this.quantity = temp[j].qty
                this.length  = temp[j].quoteQty
            //    console.log((temp[i].quantity).toString());
                   console.log(this.quantity);
                   test =(this.price * this.quantity * this.length)                    
                   this.admincharges =this.admincharges +  test
                //   this.admincharges =  this.admincharges + this.admincharges
           
            //} 
           
            console.log(this.admincharges)                    
       
    }
  

return this.admincharges;

  }
  /*admincharge(){
      
    var id,stype;
   
    id  = this.cpid  ;
   // id  = '46010'  ;
    this.listS.GetQuotetype(id).subscribe( x => {
        this.specindex = x.indexOf("ADMINISTRATION")
        //console.log(stype)

    })
   
 //   if(stype == "ADMINISTRATION" ){

//    let temp = this.fquotehdr 
    let temp = this.fdata  
        console.log(temp)
    var temp1 : number;
    var test :number;
    
//    let price,quantity,length;
//    console.log(this.specindex)
    if (this.option == 'update'){
        
        console.log(temp.length)
            let j = this.specindex
            this.admincharges = 0;
          
            //   for(let i =0;i < temp.length+1;i++){
                    
                
                
                price = temp[j].unitBillRate
                quantity = temp[j].quantity
                length  = temp[j].quoteQty
                //    console.log(price)
                    
                       test = (price * quantity * length)
                    //   temp1 = test
                    this.admincharges = this.admincharges + test
                //       console.log(temp1)
           
        //    } 
        
            console.log(test)
       
    }
  

return this.admincharges;

  } */
  
  
  dailyliving(){
    let daily;
     
    var temp = this.dochdr
    if(!temp) return;
      this.listS.GetDailyliving(temp).subscribe(x => {
        
         daily = x;
         console.log(x);
      });
   return daily;
  

   
}
checkValue(event){
    console.log(event)
    if (event.target.checked){
       this.option = 'add';
        this.GENERATE_QUOTE_LINE();
}

}



}//

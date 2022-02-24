
import { Component,AfterViewInit,Input,Output,EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { getLocaleDateFormat, getLocaleFirstDayOfWeek, Time,DatePipe } from '@angular/common';
import parseISO from 'date-fns/parseISO'
import addMinutes from 'date-fns/addMinutes'
import isSameDay from 'date-fns/isSameDay'
import { isValid } from 'date-fns';

import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { TimeSheetService, GlobalService, view, ClientService, StaffService,ShareService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin, Subscription, Observable, Subject, EMPTY, of,fromEvent, } from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil,mergeMap, concatMap, switchMap,buffer,map, bufferTime, filter} from 'rxjs/operators';
import { PROCESS } from '../../modules/modules';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'



interface AddTimesheetModalInterface {
    index: number,
    name: string
}
interface UserView{
    staffRecordView: string,
    staff: number
}

    @Component({
      selector: 'shiftdetail',
      templateUrl: './shiftdetail.html',
      styles: [`
      .disabled{
        pointer-events:none;
      
      }`]
    })
    export class ShiftDetail implements AfterViewInit{
        @Input() timeSheetVisible:boolean=false;
        @Input() dayMask:string='00000000';
        @Output() timesheetDone:EventEmitter<any>= new EventEmitter();

      data:any;
      isVisible = false;
      isConfirmLoading = false;
      programsList: Array<any> = [];
      serviceActivityList: Array<any>;
      payTypeList: Array<any> = [];
      analysisCodeList: Array<any> = [];
      programActivityList:Array<any>=[];
      ServiceGroups_list:Array<any>=[];
      groupShiftList:Array<any>=["CENTREBASED","GROUPACTIVITY","TRANSPORT"];
      RecipientList:Array<any>=[];
      defaultProgram: any = null;
      serviceType:string;
       recipientCode:string
       recordNo:string
       debtor:string;
       dataset:any;
       viewType:string;
       multipleRecipientShow: boolean = false;
       isTravelTimeChargeable: boolean = false;
       isSleepOver:boolean;
       agencyDefinedGroup:string
       booking_case:number;
       FetchCode:string;
       staffCode:string
       GroupShiftCategory:string;
       currentDate: string;
    
       breachRoster:boolean;
       Error_Msg:string;
    defaultActivity: any = null;
    selectedActivity: any = null;
    defaultCategory: any = null;
    Timesheet_label:any="Edit Timesheet";
    unitsArr: Array<string> = ['HOUR', 'SERVICE'];
    dateFormat: string = 'dd/MM/yyyy'
    parserPercent = (value: string) => value.replace(' %', '');
    parserDollar = (value: string) => value.replace('$ ', '');
    formatterDollar = (value: number) => `${value > -1 || !value ? `$ ${value}` : ''}`;
    formatterPercent = (value: number) => `${value > -1 || !value ? `% ${value}` : ''}`;
    token:any;
    loading:boolean
    rosterGroup: string;
    rosterForm:FormGroup;
    IsGroupShift:boolean;
    Select_Pay_Type:string;
    current:number=0;
    showMore:number=-1;
    ViewServiceNoteModal:boolean
    ViewServiceTaskModal:boolean;
    ViewExtraInfoModal:boolean;
    Person:any={id:'0',code:'',personType:'Recipient', noteType:'SVCNOTE'};
    loadingNote:Subject<any>=new Subject();
    loadingTasks:Subject<any>=new Subject();
    loadingExtraInfo:Subject<any>=new Subject();
    nextDisabled: boolean = false;
    activity_value: number;
    durationObject: any;
    today = new Date();
    serviceSetting:string;
    editRecord:boolean=false;
    searchStaff:boolean;
    HighlightRow:number;
    ViewAuditHistoryModal:boolean;
    ViewDatasetModal:boolean;
    ViewExtraChargeModal:boolean;
    listAuditHistory:Array<any>=[];
    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);
    private unsubscribe = new Subject();
    whatProcess = PROCESS.ADD;
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

    
      constructor(private router: Router,
        private staffS: StaffService,
        private timeS: TimeSheetService,
        private globalS: GlobalService,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private clientS: ClientService,
        private listS: ListService,
        public datepipe: DatePipe,
        private sharedS: ShareService,
      ) {}
ngOnInit(){

    this.currentDate = format(new Date(), 'yyyy/MM/dd');

   this.isVisible= this.timeSheetVisible;
    //   this.date = moment();
    //   this.AddTime();
       this.buildForm(); 
        this.token = this.globalS.decode();    
}
      ngModelChangeEnd(event): void {
        this.rosterForm.patchValue({
            time: {
                endTime: event
            }
        })
    }
   
    ngAfterViewInit(){

        console.log('Data in ngAfterViewInit of detail');
        console.log(this.data);
        this.current=0;
        this.isConfirmLoading=true;
          if (this.data!=null){
              this.details(this.data);
          }
          

      }
     
    ngModelChangeStart(event): void{
        this.rosterForm.patchValue({
            time: {
                startTime: event
            }
        })
    }

    buildForm() {
        this.rosterForm = this.formBuilder.group({
            recordNo: [''],
            date: [this.today, Validators.required],
            serviceType: ['', Validators.required],
            type:0,
            program: ['', Validators.required],
            serviceActivity: ['', Validators.required],
            payType: ['', Validators.required],
            analysisCode: [''],
            recipientCode:  [''],
            haccType: '',
            staffCode:  [''],
            debtor:  [''],
            serviceSetting:'',
            isMultipleRecipient: false,
            isTravelTimeChargeable: false,
            sleepOverTime: '',
            time: this.formBuilder.group({
                startTime:  [''],
                endTime:  [''],
            }),
            pay: this.formBuilder.group({
                pay_Unit:  ['HOUR'],
                pay_Rate:  ['0.0'],
                quantity:  ['1'],
                position: ''
            }),
            bill: this.formBuilder.group({
                pay_Unit: ['HOUR'],
                bill_Rate: ['1.0'],
                quantity: ['1'],
                tax: '1.0'
            })
            
        });

        this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        this.fixStartTimeDefault();

        this.rosterForm.get('sleepOverTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            const { serviceType, sleepOverTime } = this.rosterForm.value;
            if(serviceType === 'SLEEPOVER'){
                this.defaultEndTime = sleepOverTime;
            }
            this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        });

        this.rosterForm.get('time.startTime').valueChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(d => {
            const { serviceType, sleepOverTime } = this.rosterForm.value;
            if(serviceType === 'SLEEPOVER'){
                this.defaultEndTime = sleepOverTime;
            }
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
                    // pay_Unit: d.unit,
                    // pay_Rate: d.amount,
                    // quantity: (this.durationObject.duration) ? 
                    //     (((this.durationObject.duration * 5) / 60)).toFixed(2) : 0
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

            this.programsList = d.map(x => x.progName);
            console.log(this.programsList)

            if (this.programsList.indexOf(this.defaultProgram)<0)
                this.programsList.push(this.defaultProgram);
                setTimeout(() => {
                    this.rosterForm.patchValue({
                        program: this.defaultProgram
                    });
                }, 0);
                console.log(this.rosterForm.value)
                     

            this.cd.markForCheck();
            this.cd.detectChanges();

            if(d && d.length == 1){
                this.rosterForm.patchValue({
                    program: d[0].ProgName
                });
            }
            
        });

        this.rosterForm.get('debtor').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                //if(this.selected.option == 0) return EMPTY;
                
                return this.GETPROGRAMS(x)
            })
        ).subscribe((d: Array<any>)  => {
            this.programsList = d.map(x => x.progName);
            //this.programsList = d;

        });

        this.rosterForm.get('serviceType').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
             
               // this.clearLowerLevelInputs();

               // this.multipleRecipientShow = this.isServiceTypeMultipleRecipient(x);
                //this.isTravelTimeChargeable = this.isTravelTimeChargeableProcess(x);
                //this.isSleepOver = this.isSleepOverProcess(x);

                if (!x) return EMPTY;
                return forkJoin(
                    this.GETANALYSISCODE(),
                    this.GETPAYTYPE(x),
                    this.GETPROGRAMS(x)
                )
            })
        ).subscribe(d => {
            const {payType}= this.rosterForm.value;

            this.analysisCodeList = d[0];
            if (payType=='AWARD')
                this.payTypeList.push ({recnum:1,title:'AWARD'})
            else
                 this.payTypeList = d[1];
            
                 this.payTypeList.push ({recnum:2,title:payType})
           // this.programsList = d[2];
           
            this.programsList = d[2].map(x => x.progName);

            if(this.viewType == 'Recipient'){
                this.rosterForm.patchValue({
                    analysisCode: this.agencyDefinedGroup
                });
            }
        });
        this.rosterForm.get('program').valueChanges.pipe(
           // distinctUntilChanged(),
            switchMap(x => {
                if(!x) return EMPTY;
                this.serviceActivityList = [];
                this.rosterForm.patchValue({
                    serviceActivity: null
                });
                return this.GETSERVICEACTIVITY(x)
            })
        ).subscribe((d: Array<any>) => {

            this.serviceActivityList = d.map(x => x.activity);
            //console.log(d)
           
            if(this.whatProcess == PROCESS.UPDATE){
                setTimeout(() => {
                    this.rosterForm.patchValue({
                        serviceActivity: this.defaultActivity
                    });
                }, 0);
            }

            if(d && d.length == 1){
                this.rosterForm.patchValue({
                    serviceActivity: d[0]
                });

                //this.current+=1;
            }
        });

        this.rosterForm.get('serviceActivity').valueChanges.pipe(
            distinctUntilChanged(),
            switchMap(x => {
                if (!x) {
                    this.rosterGroup = '';
                    return EMPTY;
                };
                return this.GETROSTERGROUP(x)
            })
        ).subscribe(d => {
            console.log(d);
            if (d.length > 1 || d.length == 0) return false;
            this.rosterGroup = (d[0].rosterGroup).toUpperCase();
            this.GET_ACTIVITY_VALUE((this.rosterGroup).trim());

            this.rosterForm.patchValue({
                haccType: this.rosterGroup
            })

        });        
    

    }

    showRecipient(): boolean  {
        const { serviceType, isMultipleRecipient, isTravelTimeChargeable } = this.rosterForm.value;
        // console.log(serviceType + '' + isTravelTimeChargeable)

        if(serviceType === 'TRAVEL TIME' && isTravelTimeChargeable){
            return true;
        }       


        if(((serviceType !== 'ADMINISTRATION' && serviceType !== 'ALLOWANCE NON-CHARGEABLE' && serviceType !=='TRAVEL TIME') && !isMultipleRecipient)){
            return true;
        }

        return false;
    }

    get showTime(): boolean {
        const { serviceType } = this.rosterForm.value;
        if(serviceType === 'ALLOWANCE CHARGEABLE' || serviceType === 'ALLOWANCE NON-CHARGEABLE')
            return false;

        return true;
    }

    get showEndTime(): boolean{
        const { serviceType } = this.rosterForm.value;
        if(serviceType === 'SLEEPOVER'){
            return false;
        }
        return true;
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
    
    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;

        if(this.whatProcess == PROCESS.UPDATE) return;

        if(this.current == 1 && this.viewType == 'RECIPIENT'){
            this.rosterForm.patchValue({
                debtor: this.debtor
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
                            pay_Unit: data.unit,
                            bill_Rate: this.DEFAULT_NUMERIC(data.rate),
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
    get isFormValid(){
        return  this.rosterForm.valid;
    }
    
    get nextCondition() {
        // console.log(this.rosterGroup)
        if (this.current == 2 && !this.ifRosterGroupHasTimePayBills(this.rosterGroup)) {
            return false; 
        }
        if(this.current == 3 && this.rosterGroup == 'ADMINISTRATION'){
            return false;
        }
        return this.current < 4;
    }


    get showDone(){
        return this.current >= 4 || (this.rosterGroup == 'ADMINISTRATION' && this.current>=3);
    }

    FIX_CLIENTCODE_INPUT(tgroup: any): string{
        if (tgroup.serviceType == 'ADMINISTRATION' || tgroup.serviceType == 'ALLOWANCE NON-CHARGEABLE' || tgroup.serviceType == 'ITEM') {
            return "!INTERNAL"
        }
    }
    openStaffModal(){
        this.searchStaff=true;
    }
Cancel_ProceedBreachRoster(){
    this.breachRoster=false;
 
}
ProceedBreachRoster(){
    this.breachRoster=false;
   
    this.EditRoster_Entry();
   
}
    Check_BreachedRosterRules(){

        const tsheet= this.rosterForm.value;
        

        this.defaultStartTime = tsheet.time.startTime;
        this.defaultEndTime = tsheet.time.endTime;
        var durationObject = (this.globalS.computeTimeDATE_FNS(tsheet.time.startTime,  this.defaultEndTime));
        if(typeof tsheet.date === 'string'){
            tsheet.date = parseISO(this.datepipe.transform(tsheet.date, 'yyyy-MM-dd'));
        }
       
       
        let inputs_breach={
            sMode : 'Edit', 
            sStaffCode: tsheet.staffCode, 
            sClientCode: tsheet.recipientCode, 
            sProgram: tsheet.program, 
            sDate : format(tsheet.date,'yyyy/MM/dd'), 
            sStartTime :format(this.defaultStartTime,'HH:mm'), 
            sDuration : durationObject.duration, 
            sActivity : tsheet.serviceActivity,
             sRORecordno : tsheet.recordNo, 
            // sState : '-', 
            // bEnforceActivityLimits :0, 
            // bUseAwards:0, 
            // bDisallowOT :0, 
            // bDisallowNoBreaks :0, 
            // bDisallowConflicts :0, 
            // bForceNote :0, 
            // sOldDuration : '-', 
            // sExcludeRecords : '-', 
            // bSuppressErrorMessages  :0, 
            // sStatusMsg : '-',
            // PasteAction :'-'
        };
    
        this.timeS.Check_BreachedRosterRules(inputs_breach).subscribe(data=>{
            let res=data
            if (res.errorValue>0){
               // this.globalS.eToast('Error', res.errorValue +", "+ res.msg);
                this.breachRoster=true;
                this.Error_Msg=res.errorValue +", "+ res.msg 
                return; 
            }else{
                this.EditRoster_Entry();
            }
    
        });
    }
    done(){
        this.Check_BreachedRosterRules();
        
    }
    ShowMoreOptions(option:number){
        this.showMore=option;
        this.current=0;
        switch(option){
            case 0:
                break;
            case 1:
                //load Task
               this.loadTasks();
                break
            case 2:
                //load extra info
                this.loadRosterExtrInfo();
                break;
            case 3:
                //load extra charges
                this.loadExtraCharge();
                break;
            case 4:
                this.loadNotes();
                break;
            case 5:
                this.loadDataset();
                break;
            case 6:
                this.load_AuditHistory();
                break;
        }
    }

    loadNotes(){
        this.ViewServiceNoteModal=true;
        this.Person.id=this.recordNo;
        this.Person.code=this.recipientCode;
        this.Person.personType="Recipient";
        this.Person.noteType="SVCNOTE";       
        this.loadingNote.next(this.Person);
        }

loadTasks(){
    this.ViewServiceTaskModal=true;                          
    this.loadingTasks.next(this.recordNo);
 }
 loadRosterExtrInfo(){
    this.ViewExtraInfoModal=true;                          
    this.loadingExtraInfo.next({recordNo:this.recordNo,apmtTime: this.defaultStartTime});
 }
    EditRoster_Entry(): void {
        this.fixStartTimeDefault();
        this.editRecord=false;
        const tsheet = this.rosterForm.value;
        let clientCode = this.FIX_CLIENTCODE_INPUT(tsheet);

        this.defaultStartTime = tsheet.time.startTime;
        this.defaultEndTime = tsheet.time.endTime;
        var durationObject = (this.globalS.computeTimeDATE_FNS(tsheet.time.startTime,  this.defaultEndTime));

        if(typeof tsheet.date === 'string'){
            tsheet.date = parseISO(this.datepipe.transform(tsheet.date, 'yyyy-MM-dd'));
        }
       
       
        let inputs = {
            anal: tsheet.analysisCode || "",
            billQty: parseInt(tsheet.bill.quantity || 0),
            billTo: tsheet.debtor,
            billUnit: tsheet.bill.pay_Unit || 0,
            blockNo: durationObject.blockNo,
            carerCode: tsheet.staffCode,
            clientCode: tsheet.recipientCode ,
            costQty: parseInt(tsheet.pay.quantity || 0),
            costUnit: tsheet.pay.pay_Unit || 0,
            date: format(tsheet.date,'yyyy/MM/dd'),
            dayno: parseInt(format(tsheet.date, 'd')),
            duration: durationObject.duration,
            groupActivity: false,
            haccType: tsheet.haccType || "",
            monthNo: parseInt(format(tsheet.date, 'M')),
            program: tsheet.program,
            serviceDescription:  tsheet.payType || "",
            serviceSetting: this.serviceSetting || "",
            serviceType: tsheet.serviceActivity || "",
            paytype: tsheet.payType.paytype==null ? tsheet.payType : tsheet.payType.paytype,
            // serviceType: this.DETERMINE_SERVICE_TYPE_NUMBER(tsheet.serviceType),
            staffPosition: null || "",
            startTime: format(this.defaultStartTime,'HH:mm'),
            status: "1",
            taxPercent: parseInt(tsheet.bill.tax || 0),
            transferred: 0,
            // type: this.activity_value,
            type: tsheet.type,//this.DETERMINE_SERVICE_TYPE_NUMBER(tsheet.serviceType),
            unitBillRate: parseInt(tsheet.bill.bill_Rate || 0),
            unitPayRate: tsheet.pay.pay_Rate || 0,
            yearNo: parseInt(format(tsheet.date, 'yyyy')),
            serviceTypePortal: tsheet.serviceType,
            recordNo: tsheet.recordNo
        };

        if(!this.rosterForm.valid){
            this.globalS.eToast('Error', 'All fields are required');
            return;
        }

     
        if(this.whatProcess == PROCESS.UPDATE){
           
            this.timeS.updatetimesheet(inputs).subscribe(data => {
                //this.globalS.sToast('Success', 'Timesheet has been updated');
                this.isVisible = false;
                this.timesheetDone.emit({
                    show_alert:true,
                    date:tsheet.date,
                    clientCode:tsheet.recipientCode

                });
                // if (this.viewType=='Staff'){
                //     this.txtAlertSubject= 'SHIFT DAY/TIME CHANGE : ' ;
                //     this.txtAlertMessage= 'SHIFT TIME CHANGE : \n' + format(tsheet.date,'dd/MM/yyyy') + ' : \n' + inputs.clientCode + '\n'  ;
                //     this.clientCodes=inputs.clientCode;
                    
                //     this.show_alert=true;
                // }
                // this.searchRoster(tsheet.date)
            });
        }
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
    defaultOpenValue = new Date(0, 0, 0, 9, 0, 0);

    resetAddTimesheetModal() {
        this.current = 0;
        this.rosterGroup = '';

        this.rosterForm.reset({
            date: this.today,
            serviceType: '',
            program: '',
            serviceActivity: '',
            payType: '',
            analysisCode: '',
            recipientCode: '',
            debtor: '',
            serviceSetting:'',
            isMultipleRecipient: false,
            isTravelTimeChargeable: false,
            sleepOverTime: new Date(0, 0, 0, 9, 0, 0),
            time: this.formBuilder.group({
                startTime: '',
                endTime: '',
            }),
            pay: this.formBuilder.group({
                pay_Unit: 'HOUR',
                pay_Rate: '0.0',
                quantity: '1',
                position: ''
            }),
            bill: this.formBuilder.group({
                pay_Unit: 'HOUR',
                bill_Rate: '0.0',
                quantity: '1',
                tax: '1.0'
            }),
        });
        
        this.defaultStartTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
        this.defaultEndTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);        
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
    GETSERVICEGROUP(): Observable<any>{
        
        if (this.booking_case==8)
            return this.listS.getlist(`SELECT DISTINCT [Name] as Description FROM CSTDAOutlets WHERE [Name] Is NOT Null  AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY [Name]`);
        else if (this.IsGroupShift){
            if (this.GroupShiftCategory=="TRANSPORT" )
                return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'VEHICLES' AND Description Is NOT Null  AND (EndDate Is Null OR EndDate >= (select top 1 PayPeriodEndDate from systable)) ORDER BY DESCRIPTION`);
            else            
                return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'ACTIVITYGROUPS' AND Description Is NOT Null  AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY DESCRIPTION`);
        }else
            return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'ACTIVITYGROUPS' AND Description Is NOT Null AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY DESCRIPTION`);
    }

    GETANALYSISCODE(): Observable<any>{
        return this.listS.getserviceregion();
    }

    GETROSTERGROUP(activity: string): Observable<any>{
        if (!activity) return EMPTY;
       
        return this.listS.getlist(`SELECT RosterGroup, Title FROM ItemTypes WHERE Title= '${activity}'`);
    }
    
GETSERVICEACTIVITY(program: any): Observable<any> {

    //    const { serviceType, date, time } = this.bookingForm.value;
        let serviceType=this.serviceType;
        var { recipientCode }  = this.rosterForm.value;
        if (recipientCode=='' )
            recipientCode= this.recipientCode;
        
        if (!program) return EMPTY;
        
    
        if (serviceType != 'ADMINISTRATION' && serviceType != 'ALLOWANCE NON-CHARGEABLE' && (serviceType != 'ITEM'  && serviceType != 'SERVICE')) {
    
    
           // return this.listS.getserviceactivityall({
               return this.timeS.getActivities({            
                recipient: recipientCode,
                program:program,  
                forceAll:"0",   
                mainGroup: 'ALL',
                subGroup: '-',           
                viewType: this.viewType,
                AllowedDays: "0",
                duration: this.durationObject?.duration            
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
    
    GETSERVICEACTIVITY2(program: any): Observable<any> {

        let serviceType=this.serviceType;
        let recipientCode   = this.recipientCode;

        if (recipientCode!="" && recipientCode!=null){
            this.FetchCode=recipientCode;
          }
        let sql ="";
        if (!program) return EMPTY;
       // console.log(this.rosterForm.value)
          if (serviceType=='SERVICE' )
            this.booking_case=4;
        
       if (serviceType == 'ADMINISTRATION' ){
        // const { recipientCode, debtor } = this.rosterForm.value;
        sql =` SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,     
              I.Amount AS BILLRATE,
              I.unit as UnitType,isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,
              (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
              HACCType,'' as Anal,
              (select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
              FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID        
              INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
              WHERE SO.ServiceProgram = '${program}'  and I.[Status] = 'NONATTRIBUTABLE'
              AND EXISTS
              (SELECT Title
              FROM ItemTypes ITM
              WHERE Title = SO.[Service Type] AND ITM.[RosterGroup] = 'ADMINISTRATION'
              AND ITM.[Status] = 'NONATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
              ORDER BY [Service Type]`;
                //|| serviceType=='SERVICE' 
    }else if (serviceType == 'ADMISSION' || serviceType =='ALLOWANCE NON-CHARGEABLE' || serviceType == 'ITEM' ) {
            // const { recipientCode, debtor } = this.rosterForm.value;
            sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
            (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
            (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
             WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
             WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
             WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
             WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
            ELSE I.Amount END)
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,I.unit as UnitType,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,
            (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
            HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
            FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
            INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
            WHERE SO.ServiceProgram = '${program}' 
            AND EXISTS
            (SELECT Title
            FROM ItemTypes ITM
            WHERE Title = SO.[Service Type] AND ITM.[RosterGroup] = '${serviceType}'
            AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
            ORDER BY [Service Type]`;
    
        }else if (serviceType == 'TRAVEL TIME' || serviceType == 'TRAVELTIME') {

            sql=` SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
            (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
            (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
             WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
             WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
             WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
             WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
            ELSE I.Amount END )
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,I.unit as UnitType,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,
            (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
            HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
            FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
            INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
            WHERE SO.ServiceProgram = '${ program}'
			AND I.[RosterGroup] = 'TRAVELTIME' AND (I.EndDate Is Null OR I.EndDate >='${this.currentDate}') `
            
           

         }else if (this.booking_case==4 && !this.IsGroupShift){
           
            sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
            (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
            (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
             WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
             WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
             WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
             WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
            ELSE I.Amount END )
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,I.unit as UnitType,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,
            (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
            HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
            FROM ServiceOverview SO 
            INNER JOIN Recipients C ON C.UNIQUEID=SO.PERSONID AND C.AccountNO = '${this.FetchCode}'
            INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
            WHERE SO.ServiceProgram = '${program}' 
            AND EXISTS
            (SELECT Title
            FROM ItemTypes ITM
            WHERE Title = SO.[Service Type] 
            AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
            ORDER BY [Service Type]`;
        
        }  else if (this.booking_case==4 && this.IsGroupShift){
           
                sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,         
                I.AMOUNT AS BILLRATE,I.unit as UnitType,
                isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate, 0 as GST,
                'N/A' as Service_Description,
                HACCType,'' as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
                FROM ServiceOverview SO         
                INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
                WHERE SO.ServiceProgram = '${program}' 
                AND EXISTS
                (SELECT Title
                FROM ItemTypes ITM
                WHERE  RosterGroup = '${this.GroupShiftCategory}' And Title = SO.[Service Type] And ProcessClassification in ('EVENT','OUTPUT' )
                AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
                ORDER BY [Service Type]`;

    }else if (this.booking_case==8 ){
           
        sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,         
        I.AMOUNT AS BILLRATE,I.unit as UnitType,
        isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,
        'N/A' as Service_Description,
        HACCType,'' as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
        FROM ServiceOverview SO         
        INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
        WHERE SO.ServiceProgram = '${program}' 
        AND EXISTS
        (SELECT Title
        FROM ItemTypes ITM
        WHERE  RosterGroup = 'RECPTABSENCE' And Title = SO.[Service Type] And ProcessClassification = 'EVENT' 
        AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
        ORDER BY [Service Type]`;
    }
     else {          

            sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
            (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
            (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
             WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
             WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
             WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
             WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
            ELSE I.Amount END )
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,I.unit as UnitType,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,
            (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
            HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
            FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
            INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
            WHERE SO.ServiceProgram = '${program}' AND [SO].[ServiceStatus] = 'ACTIVE' 
            AND EXISTS
            (SELECT Title
            FROM ItemTypes ITM
            WHERE Title = SO.[Service Type] 
            AND ITM.[Status] = 'ATTRIBUTABLE' AND ProcessClassification = 'OUTPUT' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
            ORDER BY [Service Type]`; 

            
              }

            return this.listS.getlist(sql);
            
        
    };
    GETPAYTYPE(type: string): Observable<any> {
        // `SELECT TOP 1 RosterGroup, Title FROM  ItemTypes WHERE Title = '${type}'`
        let sql:any;
        // if (!type) return EMPTY;
        // this.Select_Pay_Type="Select Pay Type"
        // if (type === 'ALLOWANCE CHARGEABLE' || type === 'ALLOWANCE NON-CHARGEABLE') {
        //     sql = `SELECT Recnum, Title, ''as HACCCode FROM ItemTypes WHERE RosterGroup = 'ALLOWANCE ' 
        //         AND Status = 'NONATTRIBUTABLE' AND ProcessClassification = 'INPUT' AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY TITLE`
        // } else if (this.IsGroupShift && this.GroupShiftCategory=="TRANSPORT" ){
        //     this.Select_Pay_Type="Select Transportation Reason";
        //     sql= `SELECT RecordNumber as Recnum, Description  AS Title,HACCCode FROM DataDomains WHERE Domain = 'TRANSPORTREASON' ORDER BY Description`
       
        // }else  {
        //   sql = `SELECT Recnum, LTRIM(RIGHT(Title, LEN(Title) - 0)) AS Title, '' as HACCCode
        //     FROM ItemTypes WHERE RosterGroup = 'SALARY'   AND Status = 'NONATTRIBUTABLE'   AND ProcessClassification = 'INPUT' AND Title BETWEEN '' 
        //     AND 'zzzzzzzzzz'AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY TITLE`
        // }
        //return this.listS.getlist(sql);
        let inputs={
            
         chooseEach :0,
         payTypeMode :'Filter for Pay Group',
         s_PayItem :'',
         s_PayUnit :'',
         s_PayRate :'',
         s_Status :'',
         s_DayMask : this.dayMask,
         b_Award :0,
         s_RosterStaff : this.staffCode,
         b_TestForSingle : 0,
         s_TimespanStart :'',
         s_TimespanEnd :'',
         
        }

        return this.timeS.determinePayType(inputs);
        

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

        if (roster === 'TRAVEL TIME' || roster ==='TRAVELTIME') {
            this.activity_value = 5;
        }
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



    GETPROGRAMS(type: string): Observable<any> {
        let sql;
        if (!type) return EMPTY;
        const { isMultipleRecipient } = this.rosterForm.value;
        if ( this.IsGroupShift ) {
       
            sql = `SELECT DISTINCT [Name] AS ProgName FROM HumanResourceTypes pr WHERE [group] = 'PROGRAMS' AND  (ISNULL(pr.CloseDate, '2000/01/01') < (select top 1 convert(varchar,PayPeriodEndDate,111) as PayPeriodEndDate from SysTable)) AND (EndDate Is Null OR EndDate >= '${this.currentDate}')  ORDER BY [ProgName]`;
       
        }else if ( this.IsGroupShift || type =='!INTERNAL' || type === 'ADMINISTRATION' || type === 'ALLOWANCE NON-CHARGEABLE' || type === 'ITEM' || (type == 'SERVICE' && !isMultipleRecipient)) {
            sql = `SELECT Distinct [Name] AS ProgName FROM HumanResourceTypes WHERE [group] = 'PROGRAMS' AND ISNULL(UserYesNo3,0) = 0 AND (EndDate Is Null OR EndDate >=  '${this.currentDate}') ORDER BY [ProgName]`;
       
        }   else {
            sql = `SELECT Distinct [Program] AS ProgName FROM RecipientPrograms 
                INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID 
                WHERE Recipients.AccountNo = '${type}' AND RecipientPrograms.ProgramStatus IN ('ACTIVE', 'WAITING LIST') ORDER BY [ProgName]`

            
            // sql =`SELECT ACCOUNTNO, PROGRAM AS ProgName, [SERVICE TYPE] as serviceType, [SERVICESTATUS],
            //     (CASE WHEN ISNULL(S.ForceSpecialPrice,0) = 0 THEN
            //     (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
            //      WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
            //      WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
            //      WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5                       
            //      WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
            //     ELSE I.Amount END )
            //     ELSE S.[UNIT BILL RATE] END ) AS BILLRATE
            //     FROM RECIPIENTS C INNER JOIN RECIPIENTPROGRAMS RP ON C.UNIQUEID = RP.PERSONID 
            //     INNER JOIN ServiceOverview S ON C.UNIQUEID = S.PersonID AND RP.PROGRAM = S.ServiceProgram
            //     INNER JOIN ITEMTYPES I ON S.[SERVICE TYPE] = I.TITLE AND ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM')
            //     WHERE ACCOUNTNO = '${type}'`
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
  
      showModal(): void {
        this.isVisible = true;
      }
    
      handleOk(): void {
        this.isConfirmLoading = true;
        this.editRecord=false;
        setTimeout(() => {
          this.isVisible = false;
          this.isConfirmLoading = true;
        }, 1000);
      }
    
      handleCancel(): void {
        this.isVisible = false;
        this.timesheetDone.emit({
            show_alert:false,
            title: '' ,
            message:'',
            clientCode:''
      });
      }

      details(index: any){
    

        this.whatProcess = PROCESS.UPDATE;
        const {
            activity, 
            serviceType, 
            analysisCode, 
            approved, 
            bill,  
            pay,          
            billto,
            date, 
            debtor,
            duration, 
            durationNumber,
            serviceTypePortal,
            recipientCode,            
            startTime,
            program,
            paytype,
            shiftbookNo,
            recordNo,
            staffCode,
            endTime,
            daymask           
        
        } = index;

        this.recordNo=recordNo;
        this.recipientCode= recipientCode,
        this.FetchCode=recipientCode;
        this.staffCode=staffCode;
        this.debtor=debtor;
        this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
        this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());
        let time:any={startTime:this.defaultStartTime, endTime:this.defaultEndTime}
        //this.defaultStartTime = parseISO( "2020-11-20T" + startTime + ":01.516Z");
        //this.defaultEndTime = parseISO( "2020-11-20T" + endTime + ":01.516Z");;
        this.current = 0;
        if (daymask!=null)
            this.dayMask=daymask;
        
        
       //console.log(this.defaultEndTime)
       
         
         this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
      //  this.durationObject = this.globalS.computeTimeDATE_FNS(startTime, endTime);

        
            
            this.defaultProgram = program;
            this.defaultActivity = activity;
            this.defaultCategory = analysisCode;
            this.serviceType =  this.DETERMINE_SERVICE_TYPE(serviceType);
            this.recipientCode=recipientCode;
            this.Timesheet_label="Edit Timesheet (RecordNo : " + recordNo +")"
            this.rosterForm.disable();
            this.rosterForm.patchValue({
                serviceType: this.serviceType,
                date: date,
                time:time,
                program: program,
                serviceActivity: activity,
                payType: paytype,
                analysisCode: analysisCode,
                recordNo: shiftbookNo,            
                pay:pay,
                bill:bill,                
                debtor: debtor,
                type: serviceType,
                recipientCode: recipientCode,
                staffCode:staffCode                
                
            });

            this.rosterForm.enable();
        
    }
    DETERMINE_SERVICE_TYPE(index: any): any{
        console.log(index);
        const { serviceType, debtor } = index;

        // ALLOWANCE NON CHARGEABLE 
        if(serviceType == 9 && debtor == '!INTERNAL'){
            return 'ALLOWANCE NON-CHARGEABLE';
            //return this.modalTimesheetValues[2];
        }

        // ALLOWANCE CHARGEANLE 
        if(serviceType == 9 && debtor != '!INTERNAL'){
            return 'ALLOWANCE CHARGEABLE';
        }

        // ADMINISTRATION
        if(serviceType == 6){            
            return 'ADMINISTRATION';
        }

        // CASE MANAGEMENT
        if(serviceType == 7){
            return 'CASE MANAGEMENT';
        }

        // ITEM
        if(serviceType == 15){
            return 'ITEM';
        }

        // SLEEPOVER
        if(serviceType == 8){

            return 'SLEEPOVER';
        }

        // TRAVEL TIME
        if(serviceType == 5){

            return 'TRAVEL TIME';
        }

        //SERVICE
        return 'SERVICE';

     }

     DETERMINE_SERVICE_TYPE_NUMBER(index: string): number{
        // ALLOWANCE NON CHARGEABLE 
        
        if(index == "ONEONONE")
                 return 2
        else if(index ==  "ADMINISTRATION"){
                 if (this.defaultActivity == "UNAVAILABLE" )
                     return 13
                 else
                     return 6                 
                 }
        else if(index ==  "ADMISSION")
                 return 7
        else if(index ==  "ALLOWANCE")
                 return 9;
        else if (index ==   "CENTREBASED")
                 return 11;
         else if (index ==  "GROUPACTIVITY")
                 return 12;
         else if (index ==  "RECPTABSENCE")
                 return 4;
         else if (index ==  "SLEEPOVER")
                 return 8;
         else if (index ==  "TRANSPORT")
                 return 10;
         else if (index ==  "TRAVELTIME")
                 return 5;
         else if (index ==  "UNAVAILABLE")
                 return 13;
         else if (index ==  "ITEM")
                 return 14;
        else
                return 2;

                 
     }
     
   loadDataset(){
       

        let sql=`SELECT  Program,[service type] as Activity, [Client Code] as Client,roster.HACCType,
                HumanResourceTypes.Type AS FundingSource, 
                HumanResourceTypes.Address1 AS AgencyID, 
                DataDomains.Description AS Position, 
                ItemTypes.RosterGroup, 
                ItemTypes.MinorGroup, 
                ItemTypes.IT_Dataset AS Dataset, 
                ItemTypes.CSTDAOutletID AS OutletID, 
                ItemTypes.DatasetGroup AS DatasetGroup, 
                ItemTypes.DEXID AS DEXID, 
                ItemTypes.NDIA_ID 
            FROM  ROSTER  
            LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name =  roster .Program 
            INNER JOIN ItemTypes on ItemTypes.Title =  roster .[Service Type] 
            LEFT JOIN DataDomains on DataDomains.RecordNumber =  Roster.[StaffPosition] 
            WHERE RecordNo =  ${this.recordNo}`

            this.listS.getlist(sql).pipe(takeUntil(this.unsubscribe)).subscribe(d=>{
                this.dataset=d[0];
                this.ViewDatasetModal=true;
            })
   }  
   loadExtraCharge(){
    this.ViewExtraChargeModal=true;
} 
    
    
     load_AuditHistory(){
         this.loading=true;
        this.ViewAuditHistoryModal=true;
         this.getAuditHistory().pipe(takeUntil(this.unsubscribe)).subscribe(d=>{
             this.listAuditHistory=d;
             this.loading=false;

         })
     }
     onAuditItemSelected(data:any, i:number){
        this.HighlightRow=i;
     }
     getAuditHistory(): Observable<any> {
        let sql;            
       
            sql = `SELECT Operator as WindowsUser, TraccsUser , ActionDate AS [Date], AuditDescription as [Detail] FROM Audit WHERE ActionOn IN ('ROSTER', 'DAYMANAGER') AND WhoWhatCode = '${this.recordNo}' ORDER BY ActionDate DESC`
            
        if (!sql) return EMPTY;
        return this.listS.getlist(sql);
    }
    }
    
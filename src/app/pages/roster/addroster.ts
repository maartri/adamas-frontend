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


@Component({
    selector: 'addroster',
    templateUrl: './addroster.html',
  })
  export class AddRoster implements AfterViewInit{

    viewType:String;
    currentDate:string;
    addBookingModel:boolean=false;
    add_UnAllocated:boolean=false;
    type_to_add:number;
    select_StaffModal:boolean=false;
    select_RecipientModal:boolean=false;
    booking_case:number=0;
    rosterGroup: string;
    selectedActivity:any;
    IsGroupShift:boolean=false;
    IsClientCancellation:boolean=false;
    TransportForm:FormGroup
    selectedCarer:string;
    defaultProgram:string;
    
    ShowCentral_Location:boolean;
    addTimesheetVisible:boolean;
    showGroupShiftRecipient:boolean;
    showGroupShiftModal:boolean
    current:number;
    serviceType:string;
    HighlightRow:number;
    HighlightRow4:number;
    bookingForm: FormGroup;
    programsList: Array<any> = [];
    serviceActivityList: Array<any>;
    payTypeList: Array<any> = [];
    analysisCodeList: Array<any> = [];
    programActivityList:Array<any>=[];
    ServiceGroups_list:Array<any>=[];
    timeList:Array<any>=[];
    addressList:Array<any>=[]
    mobilityList:Array<any>=[]

    groupShiftList:Array<any>=["CENTREBASED","GROUPACTIVITY","TRANSPORT"];
    RecipientList:Array<any>=[];
    defaultActivity:any;
    serviceSetting:string;
    date_Timesheet:any;
    RecurrentServiceForm:FormGroup;
    addRecurrent:boolean=false

    whatProcess = PROCESS.ADD;
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

    GETPAYTYPE(type: string): Observable<any> {
        // `SELECT TOP 1 RosterGroup, Title FROM  ItemTypes WHERE Title = '${type}'`
        let sql;
        if (!type) return EMPTY;
        this.Select_Pay_Type="Select Pay Type"
        if (type === 'ALLOWANCE CHARGEABLE' || type === 'ALLOWANCE NON-CHARGEABLE') {
            sql = `SELECT Recnum, Title, ''as HACCCode FROM ItemTypes WHERE RosterGroup = 'ALLOWANCE ' 
                AND Status = 'NONATTRIBUTABLE' AND ProcessClassification = 'INPUT' AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY TITLE`
        } else if (this.IsGroupShift && this.GroupShiftCategory=="TRANSPORT" ){
            this.Select_Pay_Type="Select Transportation Reason";
            sql= `SELECT RecordNumber as Recnum, Description  AS Title,HACCCode FROM DataDomains WHERE Domain = 'TRANSPORTREASON' ORDER BY Description`
       
        }else  {
          sql = `SELECT Recnum, LTRIM(RIGHT(Title, LEN(Title) - 0)) AS Title, '' as HACCCode
            FROM ItemTypes WHERE RosterGroup = 'SALARY'   AND Status = 'NONATTRIBUTABLE'   AND ProcessClassification = 'INPUT' AND Title BETWEEN '' 
            AND 'zzzzzzzzzz'AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY TITLE`
        }
        return this.listS.getlist(sql);
    }

    // Add Timesheet
   
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
    FetchCode = "";
    payPeriodEndDate: Date;
    unitsArr: Array<string> = ['HOUR', 'SERVICE'];

    activity_value: number;
    durationObject: any;
    today = new Date();
    GroupShiftCategory:string;
    Select_Pay_Type:string;
    date:any = moment();
    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);


    constructor(
        private router: Router,
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
      
    ) {

    }
    ngOnInit(){

        this.currentDate = format(new Date(), 'yyyy/MM/dd');
    
     //  this.isVisible= this.timeSheetVisible;
        //   this.date = moment();
        //   this.AddTime();
         //  this.buildForm(); 
        //    this.token = this.globalS.decode();    
    }
       
     ngAfterViewInit(){
    
            console.log('Data in ngAfterViewInit of detail');
             
          }

// buildForm() {
    
//          //--------------------------an other booking form-------------------------------- 
//             this.bookingForm = this.formBuilder.group({
//                 recordNo: [''],
//                 date: [this.currentDate, Validators.required],
//                 serviceType: ['', Validators.required],
//                 program: ['', Validators.required],
//                 serviceActivity: ['', Validators.required],
//                 payType: ['', Validators.required],
//                 analysisCode: [''],
//                 recipientCode:  [''],
//                 haccType: '',
//                 staffCode:  [''],
//                 debtor:  [''],
//                 serviceSetting:'',
//                 isMultipleRecipient: false,
//                 isTravelTimeChargeable: false,
//                 sleepOverTime: '',
//                 time: this.formBuilder.group({
//                     startTime:  [''],
//                     endTime:  [''],
//                 }),
//                 pay: this.formBuilder.group({
//                     pay_Unit:  ['HOUR'],
//                     pay_Rate:  ['0.0'],
//                     quantity:  ['1'],
//                     position: ''
//                 }),
//                 bill: this.formBuilder.group({
//                     pay_Unit: ['HOUR'],
//                     bill_Rate: ['0.0'],
//                     quantity: ['1'],
//                     tax: '1.0'
//                 }),
//                 central_Location:false
                
//             });
            
          
//     this.bookingForm.get('program').valueChanges.pipe(
//                 distinctUntilChanged(),
//                 switchMap(x => {
//                     if(!x) return EMPTY;
//                     this.serviceActivityList = [];
//                     this.bookingForm.patchValue({
//                         serviceActivity: null
//                     });
//                     return   this.GETSERVICEACTIVITY2(x);                
                                            
                    
//                 })
//             ).subscribe((d: Array<any>) => {
    
//                 this.serviceActivityList = d;//d.map(x => x.activity);
             
//                 if(this.whatProcess == PROCESS.UPDATE){
//                     setTimeout(() => {
//                         this.bookingForm.patchValue({
//                             serviceActivity: this.defaultActivity                     
                            
//                         });
//                     }, 0);
//                 }
               
//                 if(d && d.length == 1){
//                     this.bookingForm.patchValue({
//                         serviceActivity: d[0]               
                       
//                     });
//                    this.next_tab();
                    
//                 }
//             });
         
    
//         this.bookingForm.get('serviceActivity').valueChanges.pipe(
//             distinctUntilChanged(),      
    
//             switchMap(x => {
//                 if (!x) {
//                     this.rosterGroup = '';
//                     return EMPTY;
//                 };
//                 this.selectedActivity=x;
    
//                 return forkJoin(                
//                     this.GETROSTERGROUP(x.activity), 
//                     this.GETPAYTYPE(x.activity),
//                     this.GETANALYSISCODE(),
//                     this.GETSERVICEGROUP()                                   
                                        
//                 )
                
//             })
//         ).subscribe(d => {
            
//             //console.log(d);
//             //if (d.length > 1 || d.length == 0) return false;
//             let lst =d[0];
//             this.rosterGroup = this.selectedActivity.rosterGroup// ( lst[0].rosterGroup);
//             this.GET_ACTIVITY_VALUE((this.rosterGroup).trim());
//             this.payTypeList = d[1];
//             this.analysisCodeList = d[2];
//             this.date_Timesheet=this.selectedActivity.date_Timesheet;
    
//             this.bookingForm.patchValue({
               
//                 bill:{
//                 pay_Unit: this.selectedActivity.unitType,
//                 bill_Rate: this.selectedActivity.billrate,            
//                 tax: this.selectedActivity.taxrate,
                
//                 },
//                 pay:{
//                     pay_Unit: this.selectedActivity.unitType,
//                     pay_Rate: this.selectedActivity.payrate,
//                     tax: this.selectedActivity.taxrate
//                 },
//                 haccType: this.selectedActivity.haccType,
//                 analysisCode: this.selectedActivity.anal,
                
//             })
//             if (this.activity_value==12 || this.booking_case==8 || this.IsGroupShift){
//                 this.ServiceGroups_list = d[3].map(x => x.description);;
//             }
//            if (this.booking_case==8){
//                this.IsClientCancellation=true;
//            }
//         }); 
       
//         this.TransportForm=this.formBuilder.group({
            
//             pickupFrom : [''],
//             pickupTo : [''],
//             zipCodeFrom: [''],
//             zipCodeTo: [''],
//             appmtTime: [''],
//             mobility: [''],
//             returnVehicle: [''],
//             jobPriority: [''],
//             transportNote: ['']
//         });
    
//         this.RecurrentServiceForm=this.formBuilder.group({
            
//             startDate : [''],
//             endDate : ['']
            
//         });
    
       
//     }
    
//     resetBookingFormModal() {
//         this.current = 0;
//         this.rosterGroup = '';
//         this.selectedCarer="";
//         this.defaultProgram="";
//         this.defaultActivity="";
//         this.defaultStartTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
//         this.defaultEndTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);        
//         this.IsClientCancellation=false;
        
//         this.bookingForm.reset({
//             date: this.payPeriodEndDate,
//             serviceType: '',
//             program: '',
//             serviceActivity: '',
//             payType: '',
//             analysisCode: '',
//             recipientCode: '',
//             debtor: '',
//             serviceSetting:'',
//             isMultipleRecipient: false,
//             isTravelTimeChargeable: false,
//             sleepOverTime: new Date(0, 0, 0, 9, 0, 0),
//             time: this.formBuilder.group({
//                 startTime: '',
//                 endTime: '',
//             }),
//             pay: this.formBuilder.group({
//                 pay_Unit: 'HOUR',
//                 pay_Rate: '0',
//                 quantity: '1',
//                 position: ''
//             }),
//             bill: this.formBuilder.group({
//                 pay_Unit: 'HOUR',
//                 bill_Rate: 0,
//                 quantity: '1',
//                 tax: '1'
//             }),
//         });

//  }

//  next_tab(): void {
//     this.current += 1;
//     // to handle single value in the list
//     if (this.current==1 && this.serviceActivityList.length<1){
//         this.globalS.eToast('Error', 'There are no approved services linked to selectd program');
//         this.current -= 1;
//         return;
//     }
//     if (this.current==1 && this.serviceActivityList.length==1){
       
//         if (this.showDone2){
//             this.doneBooking();
//             return;
//         }
          
//         if (!this.ShowCentral_Location)
//             this.current+=2;
            
//     }

    
//     if(this.current == 2 && !this.IsGroupShift && !(this.activity_value==12 || this.ShowCentral_Location)){
//         this.current += 1;
//     }
//     //console.log(this.current + ", " + this.ShowCentral_Location +", " + this.viewType + ", " + this.IsGroupShift )
            
    
//     if (this.viewType=="Staff" && this.current == 3 ){
 
//         this.current += 1;
      
//     }

   
  
   
// }

// get showDone2(){

//     if (this.current>=4)
//         return true;
    
//     if (this.selectedActivity!=null){
//         if (this.selectedActivity.service_Description == '' )
//             return false;
//     }

//     if ((this.current <3 && this.viewType=="Staff") && (this.IsGroupShift ))
//         return false;            
//     else if ((this.current >=1 && this.viewType=="Staff") && (this.activity_value!=12 || !this.ShowCentral_Location ))
//         return true;
//     else if  (this.current >=1 && (this.booking_case==1 || this.booking_case==5 ))
//         return true;  
//     else if  (this.current >=1 && (!this.ShowCentral_Location && this.booking_case==8))
//         return true;  
//     else if  (this.current ==2 && (this.ShowCentral_Location && this.booking_case==8))
//         return true;                                    
//     else if ((this.current >=3 ) ) //&& this.viewType=="Recipient"
//         return true;
//     else
//         return false;
// }
// get isBookingValid(){
// return true;// this.bookingForm.valid;
// }

// onItemDbClick(sel: any, i:number, type:string): void {

//     console.log(sel)
//     this.HighlightRow=i;               

//     if (type=="program"){          
//         this.defaultProgram=sel;
//         this.bookingForm.patchValue({
//             program:sel
//         })
//     }else if (type=="service"){
//         this.defaultActivity=sel;
        
//         this.bookingForm.patchValue({
//             serviceActivity:sel
//         })
        
//     }else if (type=="location"){
//         this.serviceSetting=sel;
//         this.bookingForm.patchValue({
//             serviceSetting:sel
//         })
      
//     }else if (type=="Category"){
//         this.HighlightRow4=i;
//         this.GroupShiftCategory=sel;
//         this.addGroupShift();
//         return;
        
//     } else if (type=="PayType"){
//         this.HighlightRow5=i;
//         this.haccCode=sel.haccCode
//         this.bookingForm.patchValue({
//             payType:sel.title
//         })
        
//     }
        
//     if (this.showDone2 && this.rosterGroup!=""){
//         this.doneBooking();
//         return;
//     }
//     if (this.current==1 && (this.activity_value==12 || this.booking_case==8)){
        
//     }else if(this.showDone2==false ){
//         this.next_tab();
//     }
// }

//     handleCancel(){
//         this.addTimesheetVisible=false;
//         this.addBookingModel=false;
//         this.ShowCentral_Location=false;
  
// } 


//  doneBooking(){

//             this.addBookingModel=false;
//             this.add_UnAllocated=false;
//             this.select_StaffModal=false;
//             this.ShowCentral_Location=false
//             this.current = 0;
//             this.booking_case=0;
            
//             //const { Servicetype } = this.bookingForm.value;
//             if (this.viewType=="Staff" &&  this.IsGroupShift && this.showGroupShiftRecipient==false){
//                 this.addBookingModel=false;
//                 this.get_group_Shift_Setting()    
//                 return;        
//             }    
//             this.showGroupShiftRecipient=false;
        
//             if (this.type_to_add<=0){
//                 if (this.rosterGroup=="")
//                     this.rosterGroup= this.defaultActivity.rosterGroup;
//                 this.serviceType=this.DETERMINE_SERVICE_TYPE_NUMBER(this.rosterGroup)
//             }else
//                 this.serviceType=this.type_to_add;
//             //const { recipientCode, Program, serviceActivity, isMultipleRecipient } = this.bookingForm.value;
        
//             //this.fixStartTimeDefault();
          
//                 let date=this.date;
//                 let time = {startTime:this.defaultStartTime, endTime:this.defaultEndTime, duration:0};
//                 const tsheet =  this.bookingForm.value;
              
//                 let clientCode ='';
//                 let carerCode = '';
//                 if (this.viewType=="Staff"){
//                     if (this.IsGroupShift)
//                         clientCode="!MULTIPLE";
//                     else
//                         clientCode = tsheet.recipientCode;
        
//                     carerCode= this.selected;
//                 }
                
//                 if (this.viewType=="Recipient"){
//                     carerCode = tsheet.staffCode
//                     clientCode=this.recipient.data
//                 }
               
                        
//                 if ( this.serviceType==1)
//                     carerCode = "BOOKED"
        
//                 var durationObject = (this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime));        
//                 this.date = parseISO(this.datepipe.transform(this.date, 'yyyy-MM-dd'));
//                 tsheet.date=this.date;
//                 if (this.create_Recurrent_Rosters){
//                     tsheet.date= this.recurrentStartDate;
//                     let stime=  parseISO(new Date(this.recurrentStartTime).toISOString());
//                     let etime=  parseISO(new Date(this.recurrentEndTime).toISOString());
//                     let dd=this.recurrentStartDate.getFullYear() + '/' +  this.numStr( this.recurrentStartDate.getMonth()+1) +'/' + this.numStr(this.recurrentStartDate.getDate());
//                     this.defaultStartTime = parseISO(new Date(dd + " " + format(stime,'HH:mm')).toISOString());
//                     this.defaultEndTime = parseISO(new Date(dd+ " " + format(etime,'HH:mm') ).toISOString());
                              
//                     time = {startTime:stime, endTime:etime, duration:0};
//                     durationObject = (this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime));        
                   
//                     //return;
//                 }
        
//                 tsheet.recordNo=0;
//                 let inputs = {
                   
//                     billQty: (tsheet.bill.quantity==null || tsheet.bill.quantity==0) ? (tsheet.bill.pay_Unit=='HOUR'? this.roundToTwo(durationObject.duration/12) : 1):0 || 0,
//                     billTo: clientCode,
//                     billUnit: tsheet.bill.pay_Unit || 0,
//                     blockNo: durationObject.blockNo,
//                     carerCode: this.selected.option == 0 ? this.selected.data : carerCode,
//                     clientCode: this.selected.option == 0 ? clientCode : this.selected.data,
//                     costQty: (tsheet.pay.quantity==null || tsheet.pay.quantity==0)? (tsheet.pay.pay_Unit=='HOUR'? this.roundToTwo(durationObject.duration/12) : 1 ):0 || 0,
//                     costUnit: tsheet.pay.pay_Unit || 0,
//                     date: format(tsheet.date,'yyyy/MM/dd'),
//                     dayno: parseInt(format(tsheet.date, 'd')),
//                     duration: durationObject.duration,
//                     groupActivity: false,
//                     haccType: tsheet.haccType || "",
//                     monthNo: parseInt(format(tsheet.date, 'M')),
//                     program: tsheet.program,
//                     serviceDescription:  tsheet.payType==null || tsheet.payType=='' || this.GroupShiftCategory=='TRANSPORT' ? tsheet.serviceActivity.service_Description :  tsheet.payType,
//                     serviceSetting: tsheet.serviceSetting || "",
//                     serviceType: tsheet.serviceActivity.activity || "",
//                     paytype: tsheet.payType,
//                     anal: tsheet.analysisCode=='' ||  tsheet.analysisCode==null ? tsheet.serviceActivity.anal :  tsheet.analysisCode,
//                     staffPosition: null || "",
//                     startTime: format(time.startTime,'HH:mm'),
//                     status: "1",
//                     taxPercent: tsheet.bill.tax || 0,
//                     transferred: 0,            
//                     type: this.serviceType,
//                     unitBillRate:( tsheet.bill.bill_Rate || 0),
//                     unitPayRate: tsheet.pay.pay_Rate || 0,
//                     yearNo: parseInt(format(tsheet.date, 'yyyy')),
//                     serviceTypePortal: tsheet.serviceType,
//                     recordNo: tsheet.recordNo,
//                     date_Timesheet: this.date_Timesheet,
//                     dischargeReasonType:this.haccCode,
//                     creator: this.token.user
                    
//                 };
        
//                 var sheet = this.spreadsheet.getActiveSheet();
//                 var sels = sheet.getSelections();
//                 var sel = sels[0];
//                 var row = sel.row;
                
//                 for (let i=0; i<sels[0].colCount; i++)
//                  {   
        
//                     this.timeS.posttimesheet(inputs).subscribe(data => {
//                         this.NRecordNo=data;
//                         if  (this.create_Recurrent_Rosters==false &&  this.add_multi_roster==false) {
//                            // this.globalS.sToast('Success', 'Roster has been added successfully');
//                             this.searchRoster(tsheet.date)
//                          }
//                           this.addTimesheetVisible = false;
                     
             
//                        // this.picked(this.selected);
//                         this.IsGroupShift=false;
//                        console.log(data)
        
//                        if (this.add_multi_roster){
        
//                         this.add_multi_roster=false;
//                         this.AddMultiShiftRosters();
//                         this.Transport_Form_Title=this.date + " " + this.defaultActivity
//                         this.TransportForm.reset();
//                         if (this.GroupShiftCategory=='TRANSPORT')
//                           this.showTransportModal=true;
//                         this.searchRoster(tsheet.date)
//                     }
                
        
//                     if (this.create_Recurrent_Rosters){
//                         this.AddRecurrentRosters();
//                     }
        
//                     if (this.viewType=='Staff'){
                            
//                         this.txtAlertSubject= 'NEW SHIFT ADDED : ' ;
//                         this.txtAlertMessage= 'NEW SHIFT ADDED : \n' + format(tsheet.date,'dd/MM/yyyy') + ' : \n' + inputs.clientCode + '\n'  ;
//                         this.clientCodes=inputs.clientCode;
        
//                         this.show_alert=true;
//                     }
                       
//                    });
//                    tsheet.date=this.addDays(tsheet.date,1);
//                    inputs.date=format(tsheet.date,'yyyy/MM/dd')
//                    inputs.dayno= parseInt(format(tsheet.date, 'd'));
//                 }
//                     this.addRecurrent=false;
                    
//                    // this.resetBookingFormModal()
            
//         }
        
//         cancel_GroupShift(){
//             this.showGroupShiftModal=false; 
//             this.showGroupShiftRecipient=false
//             this.IsGroupShift=false;
//         }
//         get_group_Shift_Setting()
//         {
           
//             this.GET_GROUP_RECIPIENTS().subscribe(d=>{
//                 this.RecipientList=d;//.map ( x => x.accountNo);
//                 this.showGroupShiftRecipient=true;
              
//             })
//             this.GET_ADDRESS().subscribe(d=>{
//                 this.addressList=d.map ( x => x.address);             
              
//             })
        
//             this.GET_MOBILITY().subscribe(d=>{
//                 this.mobilityList=d.map ( x => x.description);             
              
//             })
        
            
//         }
        
//         addDays(date: Date, days: number): Date {
//             date.setDate(date.getDate() + days);
//             return date;
//         }
   
//         GET_ADDRESS(): Observable<any> {
//             let sql;            
           
//                 sql = `SELECT CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END + CASE WHEN Address2 <> '' THEN Address2 + ''  ELSE '' END + CASE WHEN Suburb <> '' THEN ', ' + Suburb ELSE '' END AS Address, GoogleAddress 
//                 FROM NamesAndAddresses WHERE  Description = 'DESTINATION'`
                
//             if (!sql) return EMPTY;
//             return this.listS.getlist(sql);
//         }
//         GET_MOBILITY(): Observable<any> {
//             let sql;            
           
//                 sql = `select Description from datadomains where Domain like 'Mobility' and [DeletedRecord]=0`
                
//             if (!sql) return EMPTY;
//             return this.listS.getlist(sql);
//         }
    
//         roundToTwo(num) {    
//             return Math.round((num + Number.EPSILON) * 100) / 100;
//         }    
//         GET_GROUP_RECIPIENTS(): Observable<any>{
        
//             let sql =`SELECT DISTINCT [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[Surname/Organisation], [Recipients].[FirstName], [Recipients].[DateOfBirth], [Recipients].[pSuburb]  
//                         FROM Recipients INNER JOIN ServiceOverview ON Recipients.UniqueID = ServiceOverview.Personid
//                         WHERE ServiceOverview.[Service Type] = '${this.defaultActivity.activity}' AND ServiceOverview.ServiceStatus = 'ACTIVE'
//                         AND  AccountNo not in  ('!INTERNAL','!MULTIPLE') AND admissiondate is not null AND (DischargeDate is null)  
//                         AND NOT EXISTS (SELECT * FROM  ROSTER 
//                          WHERE Date = '${this.date}' AND [Start Time] = '${this.defaultStartTime}' AND ServiceSetting = '${this.serviceSetting}' 
//                         AND Roster.[Client Code] = Recipients.AccountNo ) 
//                         ORDER BY AccountNo`;
            
    
//                // console.log(sql);
//             return this.listS.getlist(sql);
//     }      
    
//         GET_ACTIVITY_VALUE(roster: string) {
//             // ADMINISTRATION
//             // ADMISSION
//             // ALLOWANCE
//             // CENTREBASED
//             // GROUPACTIVITY
//             // ITEM
//             // ONEONONE
//             // RECPTABSENCE
//             // SALARY
//             // SLEEPOVER
//             // TRANSPORT
//             // TRAVELTIME
    
//             this.activity_value = 0;
    
//             if (roster === 'ADMINISTRATION') {
//                 this.activity_value = 6;
//             }
    
//             if (roster === 'ADMISSION') {
//                 this.activity_value = 7;
//             }
    
//             if (roster === 'ALLOWANCE') {
//                 this.activity_value = 9;
//             }
            
//             if (roster === 'CENTREBASED') {
//                 this.activity_value = 11;
//             }
    
//             if (roster === 'GROUPACTIVITY') {
//                 this.activity_value = 12;
//             }
    
//             if (roster === 'ITEM') {
//                 this.activity_value = 14;
//             }
    
//             if (roster === 'ONEONONE') {
//                 this.activity_value = 2;
//             }
    
//             if (roster === 'RECPTABSENCE') {
//                 this.activity_value = 6;
//             }
    
//             if (roster === 'SALARY') {
//                 this.activity_value = 0;
//             }
    
//             if (roster === 'SLEEPOVER') {
//                 this.activity_value = 8;
//             }
    
//             if (roster === 'TRANSPORT') {
//                 this.activity_value = 10;
//             }
    
//             if (roster === 'TRAVEL TIME' || roster ==='TRAVELTIME') {
//                 this.activity_value = 5;
//             }
//         }

//         GETSERVICEACTIVITY2(program: any): Observable<any> {

//             let serviceType=this.serviceType;
//             const { recipientCode }  = this.bookingForm.value;
    
//             if (recipientCode!="" && recipientCode!=null){
//                 this.FetchCode=recipientCode;
//               }
//             let sql ="";
//             if (!program) return EMPTY;
//            // console.log(this.rosterForm.value)
     
            
//            if (serviceType == 'ADMINISTRATION' ){
//             // const { recipientCode, debtor } = this.rosterForm.value;
//             sql =` SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,     
//                   I.Amount AS BILLRATE,
//                   I.unit as UnitType,isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,
//                   (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
//                   HACCType,'' as Anal,
//                   (select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
//                   FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID        
//                   INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
//                   WHERE SO.ServiceProgram = '${program}'  and I.[Status] = 'NONATTRIBUTABLE'
//                   AND EXISTS
//                   (SELECT Title
//                   FROM ItemTypes ITM
//                   WHERE Title = SO.[Service Type] AND ITM.[RosterGroup] = 'ADMINISTRATION'
//                   AND ITM.[Status] = 'NONATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
//                   ORDER BY [Service Type]`;
    
//         }else if (serviceType == 'ADMISSION' || serviceType =='ALLOWANCE NON-CHARGEABLE' || serviceType == 'ITEM'  || serviceType == 'SERVICE') {
//                 // const { recipientCode, debtor } = this.rosterForm.value;
//                 sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
//                 (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
//                 (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
//                  WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
//                  WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
//                  WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
//                  WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
//                 ELSE I.Amount END)
//                 ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
//                 isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,I.unit as UnitType,
//                 (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
//                 HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
//                 FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
//                 INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
//                 INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
//                 WHERE SO.ServiceProgram = '${ program}' 
//                 AND EXISTS
//                 (SELECT Title
//                 FROM ItemTypes ITM
//                 WHERE Title = SO.[Service Type] AND ITM.[RosterGroup] = '${serviceType}'
//                 AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
//                 ORDER BY [Service Type]`;
        
//             }else if (serviceType == 'TRAVEL TIME' || serviceType == 'TRAVELTIME') {
    
//                 sql=` SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
//                 (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
//                 (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
//                  WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
//                  WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
//                  WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
//                  WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
//                 ELSE I.Amount END )
//                 ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
//                 isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,I.unit as UnitType,
//                 (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
//                 HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
//                 FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
//                 INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
//                 INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
//                 WHERE SO.ServiceProgram = '${program}'
//                 AND I.[RosterGroup] = 'TRAVELTIME' AND (I.EndDate Is Null OR I.EndDate >='${this.currentDate}') `
                
               
    
//              }else if (this.booking_case==4 && !this.IsGroupShift){
               
//                 sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
//                 (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
//                 (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
//                  WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
//                  WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
//                  WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
//                  WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
//                 ELSE I.Amount END )
//                 ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
//                 isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,I.unit as UnitType,
//                 (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
//                 HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
//                 FROM ServiceOverview SO 
//                 INNER JOIN Recipients C ON C.UNIQUEID=SO.PERSONID AND C.AccountNO = '${this.FetchCode}'
//                 INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
//                 WHERE SO.ServiceProgram = '${program}' 
//                 AND EXISTS
//                 (SELECT Title
//                 FROM ItemTypes ITM
//                 WHERE Title = SO.[Service Type] 
//                 AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
//                 ORDER BY [Service Type]`;
            
//             }  else if (this.booking_case==4 && this.IsGroupShift){
               
//                     sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,         
//                     I.AMOUNT AS BILLRATE,
//                     isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate, 0 as GST,I.unit as UnitType,
//                     'N/A' as Service_Description,
//                     HACCType,'' as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
//                     FROM ServiceOverview SO         
//                     INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
//                     WHERE SO.ServiceProgram = '${program}' 
//                     AND EXISTS
//                     (SELECT Title
//                     FROM ItemTypes ITM
//                     WHERE  RosterGroup = '${this.GroupShiftCategory}' And Title = SO.[Service Type] And ProcessClassification in ('EVENT','OUTPUT' )
//                     AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
//                     ORDER BY [Service Type]`;
    
//         }else if (this.booking_case==8 ){
               
//             sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,         
//             I.AMOUNT AS BILLRATE,
//             isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,I.unit as UnitType,
//             'N/A' as Service_Description,
//             HACCType,'' as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
//             FROM ServiceOverview SO         
//             INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
//             WHERE SO.ServiceProgram = '${program}' 
//             AND EXISTS
//             (SELECT Title
//             FROM ItemTypes ITM
//             WHERE  RosterGroup = 'RECPTABSENCE' And Title = SO.[Service Type] And ProcessClassification = 'EVENT' 
//             AND ITM.[Status] = 'ATTRIBUTABLE' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
//             ORDER BY [Service Type]`;
//         }
//          else {          
    
//                 sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
//                 (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
//                 (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
//                  WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
//                  WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
//                  WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
//                  WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
//                 ELSE I.Amount END )
//                 ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
//                 isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,I.unit as UnitType,
//                 (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
//                 HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
//                 FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
//                 INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
//                 INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
//                 WHERE SO.ServiceProgram = '${program}' AND [SO].[ServiceStatus] = 'ACTIVE' 
//                 AND EXISTS
//                 (SELECT Title
//                 FROM ItemTypes ITM
//                 WHERE Title = SO.[Service Type] 
//                 AND ITM.[Status] = 'ATTRIBUTABLE' AND ProcessClassification = 'OUTPUT' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}'))
//                 ORDER BY [Service Type]`; 
    
                
//                   }
    
//                 return this.listS.getlist(sql);
                
            
//         };

//         GETPROGRAMS(type: string): Observable<any> {
//             let sql;
//             if (!type) return EMPTY;
//             const { isMultipleRecipient } = this.bookingForm.value;
//             if ( this.IsGroupShift ) {
           
//                 sql = `SELECT DISTINCT [Name] AS ProgName FROM HumanResourceTypes pr WHERE [group] = 'PROGRAMS' AND  (ISNULL(pr.CloseDate, '2000/01/01') < (select top 1 convert(varchar,PayPeriodEndDate,111) as PayPeriodEndDate from SysTable)) AND (EndDate Is Null OR EndDate >= '${this.currentDate}')  ORDER BY [ProgName]`;
           
//             }else if ( this.IsGroupShift || type =='!INTERNAL' || type === 'ADMINISTRATION' || type === 'ALLOWANCE NON-CHARGEABLE' || type === 'ITEM' || (type == 'SERVICE' && !isMultipleRecipient)) {
//                 sql = `SELECT Distinct [Name] AS ProgName FROM HumanResourceTypes WHERE [group] = 'PROGRAMS' AND ISNULL(UserYesNo3,0) = 0 AND (EndDate Is Null OR EndDate >=  '${this.currentDate}') ORDER BY [ProgName]`;
           
//             }   else {
//                 sql = `SELECT Distinct [Program] AS ProgName FROM RecipientPrograms 
//                     INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID 
//                     WHERE Recipients.AccountNo = '${type}' AND RecipientPrograms.ProgramStatus IN ('ACTIVE', 'WAITING LIST') ORDER BY [ProgName]`
    
                
//                 // sql =`SELECT ACCOUNTNO, PROGRAM AS ProgName, [SERVICE TYPE] as serviceType, [SERVICESTATUS],
//                 //     (CASE WHEN ISNULL(S.ForceSpecialPrice,0) = 0 THEN
//                 //     (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
//                 //      WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
//                 //      WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
//                 //      WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5                       
//                 //      WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
//                 //     ELSE I.Amount END )
//                 //     ELSE S.[UNIT BILL RATE] END ) AS BILLRATE
//                 //     FROM RECIPIENTS C INNER JOIN RECIPIENTPROGRAMS RP ON C.UNIQUEID = RP.PERSONID 
//                 //     INNER JOIN ServiceOverview S ON C.UNIQUEID = S.PersonID AND RP.PROGRAM = S.ServiceProgram
//                 //     INNER JOIN ITEMTYPES I ON S.[SERVICE TYPE] = I.TITLE AND ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM')
//                 //     WHERE ACCOUNTNO = '${type}'`
//             }
//             if (!sql) return EMPTY;
//             return this.listS.getlist(sql);
//         }
    
   }
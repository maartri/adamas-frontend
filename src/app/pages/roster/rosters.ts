import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit,ChangeDetectorRef,ElementRef,ViewEncapsulation, OnChanges } from '@angular/core'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { getLocaleDateFormat, getLocaleFirstDayOfWeek, Time,DatePipe } from '@angular/common';
//import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
//import dayGridPlugin from '@fullcalendar/daygrid';
//import timeGridPlugin from '@fullcalendar/timegrid';
//import interactionPlugin from '@fullcalendar/interaction';ng build
//import { forkJoin,  Subject ,  Observable, EMPTY } from 'rxjs';
import { forkJoin, Subscription, Observable, Subject, EMPTY, of,fromEvent, } from 'rxjs';

import {debounceTime, distinctUntilChanged, takeUntil,mergeMap, concatMap, switchMap,buffer,map, bufferTime, filter} from 'rxjs/operators';
import { TimeSheetService, GlobalService, view, ClientService, StaffService,ShareService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzRadioModule  } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import * as _ from 'lodash';
import {ShiftDetail} from './shiftdetail'


import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { NzStepsModule, NzStepComponent } from 'ng-zorro-antd/steps';


//import parse from 'date-fns/parse';
import { PROCESS } from '../../modules/modules';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

import parseISO from 'date-fns/parseISO'
import addMinutes from 'date-fns/addMinutes'
import isSameDay from 'date-fns/isSameDay'
import { isValid } from 'date-fns';

import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import * as moment from 'moment';
import * as $ from 'jquery';
import { SpreadSheetsModule } from '@grapecity/spread-sheets-angular';
import * as GC from "@grapecity/spread-sheets";
import { NZ_ICONS, NZ_ICON_DEFAULT_TWOTONE_COLOR } from 'ng-zorro-antd';
import './styles.css';
import { ElementSchemaRegistry } from '@angular/compiler';
import { NzTableModule  } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { SetLeftFeature } from 'ag-grid-community';



 
interface AddTimesheetModalInterface {
    index: number,
    name: string
}
interface UserView{
    staffRecordView: string,
    staff: number
}

const license = "45.77.37.207,E493369696471956#B0EVbkl5QHhHbMZFOyFjQhlkS7FlVyFkeYlkauJWOyQza8lFMy8kS6gXR6hlbmlWexVzNMlTb48EMTdTMVJHdE3CUqhVcr3GS6VkTOp6Us9WNnhVVxN7YDdURLR7QrIGevcHTTd4SvplcolUZtpEbBRTNDVWe88UYXhDSJx4cGdEe6glVG5mQkRlQRNTV096VxFVdIdnaMd4aLhWWnpEal9WSwoWaKZ5MLNzY6F4SRJHVoJUMNd6M0NVaHFFd4JnMVNVcxNEd49GaBZkMFFndxNjVzUnN6FXNTZWZUN5QVJHU5YjW4FFR0hTSMdGMj5ER4UXMapmRLdnM09GO5YjUxJ6MyZlI0IyUiwiIzIUMygjMGdjI0ICSiwyN7cjM4czN5ETM0IicfJye&Qf35VfiUURJZlI0IyQiwiI4EjL6BCITpEIkFWZyB7UiojIOJyebpjIkJHUiwiI4UDN5cDMgcjM8ATMyAjMiojI4J7QiwiIxADMxIjMwIjI0ICc8VkIsIyNwIjL7MjL7cjL5QjI0IyctRkIsIycu3Wa4VHbvNFIlRXYy3Gcy36QgMXYtFGZBJiOiEmTDJCLlVnc4pjIsZXRiwiI6UTOxcDN6kjN9YzMzkDNiojIklkIs4XXbpjInxmZiwSZzxWYmpjIyNHZisnOiwmbBJye0ICRiwiI34zZIpHNwVXcCdjb6I5Yzp4TZZVVmRFTMRGRKpXTmxkbEJGeUl7ZnJWWPZjSPp4UnRlVmF7QUtkR5EkWzI7KzUDaldlNMtEaJJFdINmbLREduwUnt"



function IconCellType(img) {
    this.typeName = "IconCellType";
    this.img = img;
}

IconCellType.prototype = new GC.Spread.Sheets.CellTypes.Base();
// EllipsisTextCellType.prototype
IconCellType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {            
    if (!ctx) {
        console.log('No icon loaded')
        return;
        
    }
    ctx.save();

    // draw inside the cell's boundary
    ctx.rect(x, y, w, h);
    ctx.clip();

    // draw text
    GC.Spread.Sheets.CellTypes.Base.prototype.paint.apply(this, [ctx, value, x+20, y, w-20, h, style, context]);
    ctx.beginPath();
    // let img = document.getElementById('icon-lock');
    ctx.drawImage(this.img, x + 2, y + 2, 16, 16);
    ctx.fill();
    //ctx.fillStyle = "gray";
    ctx.stroke();
    

    ctx.restore();
};

function IconCellType2(img) {
    this.typeName = "IconCellType";
    this.img = img;
}

IconCellType2.prototype = new GC.Spread.Sheets.CellTypes.Base();
// EllipsisTextCellType.prototype
IconCellType2.prototype.paint = function (ctx, value, x, y, w, h, style, context) {            
    if (!ctx) {
        console.log('No icon found')
        return;
    }
    ctx.save();

    // draw inside the cell's boundary
    ctx.rect(x, y, w, h);
    ctx.clip();

    // draw text
    GC.Spread.Sheets.CellTypes.Base.prototype.paint.apply(this, [ctx, value, x, y, w, h, style, context]);
    ctx.beginPath();
    // let img = document.getElementById('icon-lock');
    //ctx.drawImage(this.img, x, y , 20, 20);
   // ctx.drawImage(this.img, x, y , 20, 20);
   
    ctx.fill();
    ctx.stroke();
    

    ctx.restore();
};

@Component({
    selector: 'roster-component',
    styles: [`
                
        nz-switch.master-class >>> button.ant-switch-checked{ background-color:red; }; 
       
        nz-table tbody tr.active  {  
            background-color:#48da24 !important;  
            color: white;  
          }   

          class.selected
          { 
            background-color:#B98F8F !important;  
            color: white; 
      
          }

          .ant-drawer-content {
            height: 100%;
            overflow-y: scroll;
            
          }
        
    `],
    templateUrl: './rosters.html'
})

export class RostersAdmin implements AfterViewInit  {
    spreadBackColor = "white";  
    sheetName = "Staff Rosters";  
    hostStyle = {  
      width: '100%',     
      height: '1000px',
      overflow: 'auto',
      float: 'left'
    };  
@Input() info = {StaffCode:'', ViewType:'',IsMaster:false}; 
@ViewChild(ShiftDetail) detail:ShiftDetail;
selectedrow: string ="class.selected"   
timesheets: Array<any> = [];
timesheetsGroup: Array<any> = [];   
defaultProgram: any = null;
defaultActivity: any = null;
selectedActivity: any = null;
defaultCategory: any = null;
Timesheet_label:any="Add Timesheet";
payTotal:any;
HighlightRow!: number;
HighlightRow2!: number;
HighlightRow3!: number;
HighlightRow4!: number;
HighlightRow5!: number;
HighlightRow6!: number;
recurrentStartTime:string;
recurrentEndTime:string;
recipientexternal:boolean=false;
staffexternal:boolean=false;
testComp:boolean=false;

recurrentStartDate: Date | null = null;
recurrentEndDate: Date | null = null;
create_Recurrent_Rosters:boolean=false;

weekDay:any;
Frequency:string="Weekly";
Pattern:string;
haccCode:string;
defaultCode:string;
masterCycle:string="CYCLE 1";
masterCycleNo:number=1;
Days_View:number=14;
dval:number=14;

data:any=[];  
ActiveCellText:any;
startRoster:any;
endRoster:any;
searchAvaibleModal:boolean=false;

  rosters: Array<any> = [];
  current_roster:any;
  time_map = new Map();
  Already_loaded:boolean=false;
  prev_cell:any = {row:0,col:0,duration:0, type:0, recordNo:0, service:""} 
  cell_value:any = {row:0,col:0,duration:0, type:0,recordNo:0, service:""} 
  copy_value:any = {row:0,col:0,duration:0, type:0,recordNo:0, service:""} 
  show_More:boolean=false;
  show_views:boolean=false;
  notes:string="";
  clientCodes:string="";
  bodyText:string;
  recipientDetailsModal:boolean=false;
  operation:string="";
  columnWidth = 100;
  i:number=0;
  eventLog: string;
  token:any;
  addBookingModel:boolean=false;
  type_to_add:number;
  select_StaffModal:boolean=false;
  select_RecipientModal:boolean=false;
  booking_case:number=0;
  showTransportModal:boolean=false;
  showRecurentModal:boolean=false;
  recurrenceView:boolean=false;
  Transport_Form_Title:string=""
  include_fee:boolean=false;
  include_item:boolean=false;
  spreadsheet:any;
  customizeHref: string;
  time_slot:number=96;
  ShowCentral_Location:boolean=false;
  IsClientCancellation:boolean=false;
  showtMultiRecipientModal:boolean=false;
  IsGroupShift:boolean=false;
  GroupShiftCategory:string="";
  listOfSelection: Array <any> = [];
  NRecordNo:string;
  timeList:Array<any>=[];
  addressList:Array<any>=[]
  mobilityList:Array<any>=[]
    
  show_alert:boolean=false; 
  txtAlertSubject:string="Shift Alerts";
  txtAlertMessage:string="Shift Alert";

  isVisible: boolean = false;
    hahays = new Subject<any>();
    optionsModal:boolean=false;
    
    enable_buttons :boolean=false;
    
    private picked$: Subscription;   
    isConfirmLoading = false;
    changeModalView = new Subject<number>();
    changeViewRecipientDetails = new Subject<number>();
    changeViewRosterDetails = new Subject<number>();
    AddViewRosterDetails    = new Subject<number>();

    _highlighted: Array<any> = [];
    user:any;
    selectedOption:any;
    today = new Date();
    rosterGroup: string;
    rosterForm: FormGroup;
    bookingForm: FormGroup;
    TransportForm:FormGroup
    RecurrentServiceForm:FormGroup;
    AlertForm:FormGroup;
    
    viewType: any ;
    start_date:string="";
    end_date:string=""
    ForceAll:Boolean=true;
    subGroup:String="";
    RosterDate:String="";
    StartTime:String="";
    EndTime:String=""
    Duration:String="5";
    EnforceActivityLimits:boolean=true;
   
    master:boolean=false;
    Master_Roster_label="Current Roster";
    tval:number;
 
    sample: any;
    searchStaffModal:boolean=false;
    ViewStaffDetail:boolean=false;
    ViewServiceDetail:boolean=false;
    ViewAdditionalModal:boolean=false;
    isFirstLoad:boolean=false;
    userview: UserView;
    selectedCarer:any;
    UnAllocateStaffModal:boolean=false;
    ClearMultiShiftModal:boolean=false;
    SetMultiShiftModal:boolean=false;
    deleteRosterModal:boolean=false;
    isTravel:boolean=false;
    add_UnAllocated:boolean=false;

    showGroupShiftModal:boolean=false;
    showGroupShiftRecipient:boolean=false;
    setOfCheckedId = new Set<any>();
 
    dateFormat: string = 'dd/MM/yyyy'
    selectAll: boolean = false;
    overlapVisible: boolean = false;
    addTimesheetVisible: boolean = false;
    multipleRecipientShow: boolean = false;
    isTravelTimeChargeable: boolean = false;
    isSleepOver: boolean = false;
    payUnits: any;
    addRecurrent:boolean=false
    parserPercent = (value: string) => value.replace(' %', '');
    parserDollar = (value: string) => value.replace('$ ', '');
    formatterDollar = (value: number) => `${value > -1 || !value ? `$ ${value}` : ''}`;
    formatterPercent = (value: number) => `${value > -1 || !value ? `% ${value}` : ''}`;

    AddTime(interval:number=5){
        for (let h=0; h<24; h++)
            for (let t=0; t<60; t=t+interval)
             this.timeList.push(this.numStr(h) + ":"+ this.numStr(t))
    }
    changeHeight() {
        this.hostStyle.height = this.hostStyle.height === "50%" ? "100%" : "50%";
        setTimeout(() => {
        this.spreadsheet.refresh();
        });
        }
 DayOfWeek(n:number): String{

    let day:String="";
    switch(n){
    case 1 : day="Mon"; break;
    case 2 : day="Tue" ; break;
    case 3 : day="Wed" ; break;
    case 4 : day="Thu" ; break;
    case 5 : day="Fri" ; break;
    case 6 : day="Sat" ; break;
    case 0 : day="Sun" ; break;
    }
    return day;
  
  }
  

  listChange(event: any) {

    if (event == null) {
        this.user = null;
        this.isFirstLoad = false;
        this.sharedS.emitChange(this.user);
        return;
    }

      this.selectedCarer=event.accountNo;
      this.bookingForm.patchValue({
            staffCode:event.accountNo
      });

    this.user = {
        code: event.accountNo,
        id: event.uniqueID,
        view: event.view,
        agencyDefinedGroup: event.agencyDefinedGroup,
        sysmgr: event.sysmgr
    }

    this.sharedS.emitChange(this.user);
    this.cd.detectChanges();
}

normalRoutePass(): void{
    const { user } = this.globalS.decode();

    this.listS.getstaffrecordview(user).subscribe(data => {
        this.userview = data;
        this.cd.detectChanges();
    })

   
    this.isFirstLoad = false;   

    

    this.sharedS.emitRouteChangeSource$.subscribe(data => {
        console.log(data);
    });
}
 roundToTwo(num) {    
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
cancel_GroupShift(){
    this.showGroupShiftModal=false; 
    this.showGroupShiftRecipient=false
    this.IsGroupShift=false;
}
get_group_Shift_Setting()
{
   
    this.GET_GROUP_RECIPIENTS().subscribe(d=>{
        this.RecipientList=d;//.map ( x => x.accountNo);
        this.showGroupShiftRecipient=true;
      
    })
    this.GET_ADDRESS().subscribe(d=>{
        this.addressList=d.map ( x => x.address);             
      
    })

    this.GET_MOBILITY().subscribe(d=>{
        this.mobilityList=d.map ( x => x.description);             
      
    })

    
}

Save_Transport(){
    
    const tdata =  this.TransportForm.value;
    let inputs ={
        P1:this.current_roster.recordNo,
        P2:tdata.pickupFrom,
        P3:tdata.zipCodeFrom,
        P4:tdata.pickupTo,
        P5:tdata.zipCodeTo,     
        P6:tdata.mobility,
        P7:tdata.returnVehicle,
        P8:tdata.appmtTime,
        P9:tdata.jobPriority,
        P10:tdata.transportNote
    };
    this.timeS.addtransport(inputs).subscribe(data => {
        
            this.globalS.sToast('Success', 'Transport details have been recorded');

            this.showTransportModal=false;
    });
}
close(){
    this.showRecurentModal=false;
    //this.recurrenceView=false;
    
}

showRecurrentView(){
    this.showRecurentModal=true;
    this.recurrenceView=true;
    
}
cancelRecurrent(){
    this.recurrenceView=false;
    this.create_Recurrent_Rosters=false;
}
set_RecurentView(){
    this.recurrenceView=true;
    this.showRecurentModal=false;
    const reuc = this.RecurrentServiceForm.value;
    this.recurrentStartDate =reuc.startDate
    this.recurrentEndDate =reuc.endDate
    this.date = moment(reuc.startDate).format('YYYY/MM/DD');
    
}
createRecurrent_rosters(){
    this.create_Recurrent_Rosters=true;
    this.doneBooking()
}

setPattern(d:string){
    this.Pattern=d;
}
setFrequency(d:string){
    this.Frequency=d;
}
doneBooking(){

    this.addBookingModel=false;
    this.add_UnAllocated=false;
    this.select_StaffModal=false;
    this.ShowCentral_Location=false
    this.current = 0;
    this.booking_case=0;
 
    if (this.viewType=="Staff" &&  this.IsGroupShift && this.showGroupShiftRecipient==false){
        this.addBookingModel=false;
        this.get_group_Shift_Setting()    
        return;        
    }    
    this.showGroupShiftRecipient=false;

    if (this.type_to_add<=0){
        if (this.rosterGroup=="")
            this.rosterGroup= this.defaultActivity.rosterGroup;
        this.serviceType=this.DETERMINE_SERVICE_TYPE_NUMBER(this.rosterGroup)
    }else
        this.serviceType=this.type_to_add;
    //const { recipientCode, Program, serviceActivity, isMultipleRecipient } = this.bookingForm.value;

    //this.fixStartTimeDefault();
  
        let date=this.date;
        let time = {startTime:this.defaultStartTime, endTime:this.defaultEndTime, duration:0};
        const tsheet =  this.bookingForm.value;
      
        let clientCode ='';
        let carerCode = '';
        if (this.viewType=="Staff"){
            if (this.IsGroupShift)
                clientCode="!MULTIPLE";
            else
                clientCode = tsheet.recipientCode;

            carerCode= this.selected;
        }
        
        if (this.viewType=="Recipient"){
            carerCode = tsheet.staffCode
            clientCode=this.recipient.data
        }
       
                
        if ( this.serviceType==1)
            carerCode = "BOOKED"

        var durationObject = (this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime));        
        this.date = parseISO(this.datepipe.transform(this.date, 'yyyy-MM-dd'));
        tsheet.date=this.date;
        if (this.create_Recurrent_Rosters){
            tsheet.date= this.recurrentStartDate;
            let stime=  parseISO(new Date(this.recurrentStartTime).toISOString());
            let etime=  parseISO(new Date(this.recurrentEndTime).toISOString());
            let dd=this.recurrentStartDate.getFullYear() + '/' +  this.numStr( this.recurrentStartDate.getMonth()+1) +'/' + this.numStr(this.recurrentStartDate.getDate());
            this.defaultStartTime = parseISO(new Date(dd + " " + format(stime,'HH:mm')).toISOString());
            this.defaultEndTime = parseISO(new Date(dd+ " " + format(etime,'HH:mm') ).toISOString());
                      
            time = {startTime:stime, endTime:etime, duration:0};
            durationObject = (this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime));        
           
            //return;
        }

        tsheet.recordNo=0;
        let inputs = {
           
            billQty: (tsheet.bill.quantity==null || tsheet.bill.quantity==0) ? (tsheet.bill.pay_Unit=='HOUR'? this.roundToTwo(durationObject.duration/12) : 1):0 || 0,
            billTo: clientCode,
            billUnit: tsheet.bill.pay_Unit || 0,
            blockNo: durationObject.blockNo,
            carerCode: this.selected.option == 0 ? this.selected.data : carerCode,
            clientCode: this.selected.option == 0 ? clientCode : this.selected.data,
            costQty: (tsheet.pay.quantity==null || tsheet.pay.quantity==0)? (tsheet.pay.pay_Unit=='HOUR'? this.roundToTwo(durationObject.duration/12) : 1 ):0 || 0,
            costUnit: tsheet.pay.pay_Unit || 0,
            date: format(tsheet.date,'yyyy/MM/dd'),
            dayno: parseInt(format(tsheet.date, 'd')),
            duration: durationObject.duration,
            groupActivity: false,
            haccType: tsheet.haccType || "",
            monthNo: parseInt(format(tsheet.date, 'M')),
            program: tsheet.program,
            serviceDescription:  tsheet.payType==null || tsheet.payType=='' || this.GroupShiftCategory=='TRANSPORT' ? tsheet.serviceActivity.service_Description :  tsheet.payType,
            serviceSetting: tsheet.serviceSetting || "",
            serviceType: tsheet.serviceActivity.activity || "",
            paytype: tsheet.payType,
            anal: tsheet.analysisCode=='' ||  tsheet.analysisCode==null ? tsheet.serviceActivity.anal :  tsheet.analysisCode,
            staffPosition: null || "",
            startTime: format(time.startTime,'HH:mm'),
            status: "1",
            taxPercent: tsheet.bill.tax || 0,
            transferred: 0,            
            type: this.serviceType,
            unitBillRate:( tsheet.bill.bill_Rate || 0),
            unitPayRate: tsheet.pay.pay_Rate || 0,
            yearNo: parseInt(format(tsheet.date, 'yyyy')),
            serviceTypePortal: tsheet.serviceType,
            recordNo: tsheet.recordNo,
            date_Timesheet: this.date_Timesheet,
            dischargeReasonType:this.haccCode,
            creator: this.token.user
            
        };

           
    if (!this.isBookingValid(inputs)){
        this.globalS.eToast('Error', 'There are some invalid entries');
        return;
        
    }
        var sheet = this.spreadsheet.getActiveSheet();
        var sels = sheet.getSelections();
        var sel = sels[0];
        var row = sel.row;
        
        for (let i=0; i<sels[0].colCount; i++)
         {   

            this.timeS.posttimesheet(inputs).subscribe(data => {
                this.NRecordNo=data;
                if  (this.create_Recurrent_Rosters==false &&  this.add_multi_roster==false) {
                   // this.globalS.sToast('Success', 'Roster has been added successfully');
                    this.searchRoster(tsheet.date)
                 }
                  this.addTimesheetVisible = false;
             
     
               // this.picked(this.selected);
                this.IsGroupShift=false;
               console.log(data)

               if (this.add_multi_roster){

                this.add_multi_roster=false;
                this.AddMultiShiftRosters();
                this.Transport_Form_Title=this.date + " " + this.defaultActivity
                this.TransportForm.reset();
                if (this.GroupShiftCategory=='TRANSPORT')
                  this.showTransportModal=true;
                this.searchRoster(tsheet.date)
            }
        

            if (this.create_Recurrent_Rosters){
                this.AddRecurrentRosters();
            }

            if (this.viewType=='Staff'){
                    
                this.txtAlertSubject= 'NEW SHIFT ADDED : ' ;
                this.txtAlertMessage= 'NEW SHIFT ADDED : \n' + format(tsheet.date,'dd/MM/yyyy') + ' : \n' + inputs.clientCode + '\n'  ;
                this.clientCodes=inputs.clientCode;

                this.show_alert=true;
            }
               
           });
           tsheet.date=this.addDays(tsheet.date,1);
           inputs.date=format(tsheet.date,'yyyy/MM/dd')
           inputs.dayno= parseInt(format(tsheet.date, 'd'));
        }
            this.addRecurrent=false;
            
           // this.resetBookingFormModal()
    
}
addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}
RecordStaffAdmin(){
    this.resetBookingFormModal();
    this.booking_case=6;
    this.isTravel=false;
    

    this.serviceType ="ADMINISTRATION";
    // this.rosterForm.patchValue({
    //     serviceType:"ADMINISTRATION"
    // });
  
        if (this.viewType=='Staff'){
            this.bookingForm.patchValue({
                recipientCode:"!INTERNAL"
            });
        }else{
            this.bookingForm.patchValue({
                staffCode:"!INTERNAL"
            });
        }

        this.addBookingModel=true;
        this.addBooking(0);
    
}

SetMultiRecipient(val:boolean){
    this.showtMultiRecipientModal=false;
  

    if (val){
        this.IsGroupShift=true;
        this.showGroupShiftModal=true;
        this.ShowCentral_Location=true;
    }else{
        this.IsGroupShift=false;
        this.select_RecipientModal=true; 
    }
        
       
}

setCentral_Location(val:any){
   
    //this.ShowCentral_Location=true;
    this.serviceSetting="";

   this.showDone2;
    
}
recordCancellation(){
    this.resetBookingFormModal();
    this.booking_case=8;
    this.serviceType ="RECPTABSENCE";
    this.bookingForm.patchValue({
        staffCode:"!INTERNAL"
    });
    this.addBooking(0);
}
setUnavailablity(){
    this.resetBookingFormModal();
    this.booking_case=7;
    this.serviceType ="UNAVAILABLE";
    this.rosterGroup="UNAVAILABLE";
 
  
        if (this.viewType=='Staff'){
            this.bookingForm.patchValue({
                recipientCode:"!INTERNAL",
                program:"!INTERNAL",
                serviceActivity: {
                    activity:"UNAVAILABLE",
                    service_Description:"UNAVAILABLE"
                    
                }
            });
        }        
        if (!this.recurrenceView)
            this.addBooking(0);
    
}

setTravel(val:number){
    this.resetBookingFormModal();
    this.isTravel=false;
    this.serviceType="TRAVEL TIME"
    // this.rosterForm.patchValue({
    //     serviceType:"TRAVEL TIME"
    // });
    this.type_to_add=5;
    if (val==1){
            if (this.viewType=='Staff')
                this.select_RecipientModal=true;
            else
                this.select_StaffModal=true;
    }else{
      
        if (this.viewType=='Staff'){
            this.bookingForm.patchValue({
                recipientCode:"!INTERNAL"
            });
        }else{
            this.bookingForm.patchValue({
                staffCode:"!INTERNAL"
            });
        }

        this.addBookingModel=true;
        this.addBooking(5);
    }
}
start_adding_Booking(bCase:any){
    this.resetBookingFormModal();
    this.booking_case=bCase;
    this.isTravel=false;
    if (this.booking_case==1){
        this.serviceType="BOOKED";
         this.bookingForm.patchValue({
            staffCode:"BOOKED"
         });
         this.addBooking(1);
         return;
    } else if (this.booking_case==2){
        this.serviceType="ADMISSION";
        // this.rosterForm.patchValue({
        //     serviceType:"ADMISSION"
        // });
    }else if (this.booking_case==4){
        this.serviceType="GROUPBASED";
        if (this.viewType=="Staff"){
            this.showtMultiRecipientModal=true;
            return;
        }
        // this.rosterForm.patchValue({
        //     serviceType:"ADMISSION"
        // });
    }  else if (this.booking_case==5){
        //this.isTravelTimeChargeable=true;
        this.isTravel=true;
        this.serviceType="TRAVEL TIME";
        // this.rosterForm.patchValue({            
        //     serviceType:"TRAVEL TIME"
        // });
        
        return;
    }else{
        //  this.rosterForm.patchValue({
        //     serviceType:""
        // });  
        this.serviceType="";
    }
    if (this.viewType=="Staff"){
        this.select_RecipientModal=true;     
        
    }else {
        
        if (this.booking_case==2){
            this.booking_case=3;          
        }
        this.addBookingModel=true;
        this.addBooking(0);
    }

    
}

addBooking(type:any){
    
   
    this.select_StaffModal=false;
    this.select_RecipientModal=false;
    //this.ShowCentral_Location=false;
    this.current=0;
    
    this.type_to_add=type;
   if (type==1){
    this.add_UnAllocated=true;
    this.type_to_add=1;
   }else
   {
    this.add_UnAllocated=false;
   }
   
    this.Timesheet_label = "Add Timesheet " 
   
    this.addRecurrent=true;
   
    let sheet = this.spreadsheet.getActiveSheet();
    var range=sheet.getSelections();
    // console.log(range)
   
    //let dt = moment.utc(this.date).local();
    if ((range==null || range.length==0) && !this.recurrenceView){
        this.globalS.eToast('Booking', 'Please select some time range to proceed');
        return;
    }
    
   // let  date = this.date;  // For recurrent cases
  

    if (!this.recurrenceView){
        let col=range[0].col;
        let date = sheet.getCell(0,col,GC.Spread.Sheets.SheetArea.colHeader).tag();
       
        this.date = parseISO(this.datepipe.transform(date, 'yyyy-MM-dd'));
        let dt= new Date(this.date);
        date = dt.getFullYear() + "-" + this.numStr(dt.getMonth()+1) + "-" + this.numStr(range[0].col+1);
        let f_row= range[0].row;
        let l_row=f_row+range[0].rowCount;
        let startTime =   sheet.getCell(f_row,0,GC.Spread.Sheets.SheetArea.rowHeader).tag()
        let endTime =   sheet.getCell(l_row,0,GC.Spread.Sheets.SheetArea.rowHeader).tag();
        //let endTime =sheet.getTag(l_row,0,GC.Spread.Sheets.SheetArea.viewport);

        this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
        this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());

        this.date = parseISO(this.datepipe.transform(date, 'yyyy-MM-dd'));
    }

    this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
   
   
   // this.bookingForm.patchValue({date:date})

   if (this.booking_case==7){
       this.type_to_add=13;
        this.doneBooking();
        return;
   }
       
    
    //this.date = parseISO(new Date(date).toISOString());
    const { recipientCode, debtor, serviceType, isMultipleRecipient } = this.bookingForm.value;
    
    if (this.viewType=="Staff"){
        this.FetchCode = recipientCode;
        if (this.IsGroupShift)
            this.FetchCode="!MULTIPLE"
    }else
        this.FetchCode = this.selected.data;
    
     

        this.GETPROGRAMS( this.FetchCode).subscribe(d => {
        this.programActivityList=d;
        this.programsList = d.map(x => x.progName);
        //remove duplicate values
        this.programsList = this.programsList.filter((v, i, a) => a.indexOf(v) === i);
        //this.serviceActivityList = d.map(x => x.serviceType);
       // this.serviceActivityList = this.serviceActivityList.filter((v, i, a) => a.indexOf(v) === i);
        
      
        if (this.programsList==null || this.programsList.length==0){
          // 
            this.globalS.sToast('Booking', 'No Program setting found to proceed');
            this.addBookingModel=false;
        }else{
            if (this.programsList.length==1){
                this.defaultProgram=this.programsList[0];
                this.bookingForm.patchValue({
                    program:this.defaultProgram
                })
                
                this.current+=1;
            }
            this.addBookingModel=true;
                
        }
    });
 
    
}
SaveAdditionalInfo(notes:string){
    this.notes=notes;
    if (this.cell_value==null || this.cell_value.recordNo==0) return;
    this.ProcessRoster("Additional", this.cell_value.recordNo);
   
}
deleteRoster_old(){
    if (this.cell_value==null || this.cell_value.recordNo==0) return;

    this.ProcessRoster("Delete",this.cell_value.recordNo);

    let sheet=this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
    this.remove_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration)
    this.operation="Delete";                 
    this.spreadsheet.resumePaint();
    this.deleteRosterModal=false;

   
    if (this.viewType=='Staff'){
        this.current_roster = this.find_roster(this.cell_value.recordNo)
        let clientCode =this.current_roster.recipientCode;
        let date= this.current_roster.date
        this.txtAlertSubject = 'SHIFT DELETED : ' ;
        this.txtAlertMessage = 'SHIFT DELETED : \n' + date + ' : \n'  + clientCode + '\n'  ;
    
        this.show_alert=true;
    }
}

deleteRoster(){

    var sheet = this.spreadsheet.getActiveSheet();
    var selected_Cell:any;                   
    var sels = sheet.getSelections();
    var sel = sels[0];
    var row = sel.row;
    selected_Cell=sel;
    let selected_columns = selected_Cell.col + selected_Cell.colCount;
   
    let data_row=0;
    let row_iterator=0;
    let recdNo=0;
 
    for (let i=selected_Cell.col; i<selected_columns; i++)
    {
        data_row=selected_Cell.row;
        
        for ( row_iterator=0; row_iterator<=selected_Cell.rowCount; row_iterator++){
           if (sheet.getTag(data_row,i,GC.Spread.Sheets.SheetArea.viewport)==null ){
            data_row=data_row+1;
            continue;
           }
                                       
         if (sheet.getTag(data_row,i,GC.Spread.Sheets.SheetArea.viewport)!=null)
            this.cell_value=sheet.getTag(data_row,i,GC.Spread.Sheets.SheetArea.viewport)
        
        if (this.cell_value.recordNo==recdNo)
            continue;
        
        recdNo=this.cell_value.recordNo;
 
        //if (this.cell_value==null || this.cell_value.recordNo==0) return;
        this.ProcessRoster("Delete",this.cell_value.recordNo);

        this.remove_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration)
        this.operation="Delete";   
        
        
      }
    }
    this.spreadsheet.resumePaint();
    this.deleteRosterModal=false;

   
    if (this.viewType=='Staff'){
        this.current_roster = this.find_roster(this.cell_value.recordNo)
        let clientCode =this.current_roster.recipientCode;
        let date= this.current_roster.date
        this.txtAlertSubject = 'SHIFT DELETED : ' ;
        this.txtAlertMessage = 'SHIFT DELETED : \n' + date + ' : \n'  + clientCode + '\n'  ;
    
        this.show_alert=true;
    }
}
reAllocate(){
    if (this.cell_value==null || this.cell_value.recordNo==0) return;

    this.ProcessRoster("Re-Allocate", this.cell_value.recordNo);
    let sheet=this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
    this.remove_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration)
    this.spreadsheet.resumePaint();


}


UnAllocate(){
   // if (this.cell_value==null || this.cell_value.RecordNo==0) return;

    this.ProcessRoster("Un-Allocate", this.cell_value.recordNo);
    let sheet=this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
    this.remove_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration)
    this.spreadsheet.resumePaint();


}
showViews(){
    this.show_views=false;
    this.Already_loaded=false;
    this.prepare_Sheet();
    this.load_rosters();
}
show_MoreOptions(){
    this.show_More=true;
}


hide_MoreOptions(i:number){
    if (i==0)
        this.include_fee=true;
    if (i==1)
        this.include_item=true;

    this.show_More=false;
}
SaveMasterRosters(){

    if (this.rosters==null) return;
    if (this.rosters.length<=0) return;

    let rst:any=this.rosters[0];
    
   let RecordNo=rst.recordNo;
    if (this.viewType=="Staff")
        this.ProcessRoster("Staff Master", RecordNo);
    else if (this.viewType=="Recipient")
        this.ProcessRoster("Client Master", RecordNo);
}
SetMultishift(){
    if (this.cell_value==null || this.cell_value.recordNo==0) return;

    
    this.ProcessRoster("SetMultishift", this.cell_value.recordNo);
    

}
ClearMultishift(){
    if (this.cell_value==null || this.cell_value.recordNo==0) return;

    this.ProcessRoster("ClearMultishift", this.cell_value.recordNo);
    

}
  load_rosters(){
    
    
    this.spreadsheet.suspendPaint();
    let sheet = this.spreadsheet.getActiveSheet()
    var cell:any;
    
    if (this.viewType=="Staff")
        sheet.name("Staff Rosters");
    else
        sheet.name("Recipient Rosters");
    
        
     cell= sheet.getRange(0, 0, this.time_slot, this.Days_View, GC.Spread.Sheets.SheetArea.viewport)
    
      
    cell.setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
    if (this.master){
        //cell.backColor("#FF8080");
        cell.backColor("white");
        cell.text("").cellType(new IconCellType2(document.getElementById('icon-21')));
        
    }else{
        cell.backColor("white");
        cell.text("").cellType(new IconCellType2(document.getElementById('icon-21')));
    }
    cell.text("")
    cell.tag(null);
    
          
    let row=-1, col=-1;
    if (this.rosters==null) {
        this.spreadsheet.resumePaint();
        return;
    }
    var text,code;
    for(var r of this.rosters){
            
       // if (r.dayNo>this.Days_View) break;

            if (r.recordNo==258702 || r.shiftbookNo==258702){
                code= r.carerCode 
            }
            if (this.Days_View>=30)
                col=r.dayNo-1;
            else{
                let dt= new Date(this.startRoster);
                col=r.dayNo- Number(dt.getDate());
                }
            row = this.getrow(r.start_Time);//self.time_map.get(r.Start_Time); //
            if (this.viewType=="Staff")
                code= r.clientCode ;
            else
                code= r.carerCode 
            
            if (code=="!MULTIPLE")
                    code="GROUP SHIFT";
            if (code=="!INTERNAL")
                    code="ADMIN SHIFT";
                
              //  text=  r.start_Time + "-" + r.end_Time + " " + code + " (" + r.serviceType + ")";

              text=   code + " (" + r.serviceType + ")";

            if (row!=null && col !=null)
            this.draw_Cells(sheet,row,col,r.duration, r.type, r.recordNo, text)
        
    }

    this.spreadsheet.resumePaint();
  }
  
  setMasterRoster($event:any){
      console.log("Master Roster")
      
      
      //this.master=!this.master;
      this.master=$event;
      if (this.master){
        this.date="1900/01/01";
        this.Master_Roster_label='Master Roster'
        //this.startRoster="1900/01/01";
       // this.endRoster="1900/01/31";
      }else{        
        this.date = moment()      
        this.Master_Roster_label='Current Roster'
        //this.startRoster=this.date;
       // this.endRoster=this.date;
    }
    // if(this.Days_View==31 || this.Days_View==30){
    //     this.date = moment(this.date).add('month', 1);       
    //     this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')
    //     this.endRoster =moment(this.date).endOf('month').format('YYYY/MM/DD')
    // }else{
                   
        this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')
         this.date = moment(this.startRoster).add('day', this.Days_View-1);
         this.endRoster = moment(this.date).format('YYYY/MM/DD');
         this.prepare_Sheet();
       //}
    this.searchRoster(this.date);
     
    var divMaster = document.getElementById("divMaster");    
   // divMaster.style.backgroundColor= this.bgcolor;
    
  }
  

  //MainSpread:any=GC.Spread;
    workbookInit(args) {  
        console.log("workbookInit called");
      
      let spread = args.spread;
     // this.MainSpread=args.spread;
      this.spreadsheet = GC.Spread.Sheets.Workbook = args.spread;  
      spread= GC.Spread.Sheets.Workbook = args.spread;  
      let sheet = spread.getActiveSheet();  
      sheet.setRowCount(this.time_slot, GC.Spread.Sheets.SheetArea.viewport);
      sheet.setColumnCount(31,GC.Spread.Sheets.SheetArea.viewport);

          spread.suspendPaint();
          let spreadNS = GC.Spread.Sheets;
          let self = this;
        
     
      //sheet.getCell(0, 0).text("Fruits wallet").foreColor("blue"); 
      spread.options.columnResizeMode = GC.Spread.Sheets.ResizeMode.split;
      spread.options.rowResizeMode = GC.Spread.Sheets.ResizeMode.split;
      spread.options.scrollbarAppearance = GC.Spread.Sheets.ScrollbarAppearance.mobile;
      spread.options.scrollByPixel = true;
      spread.options.scrollPixel = 5;
      
      //sheet.options.selectionBorderColor = 'blue';
      //sheet.options.selectionBackColor = '#e0e0de';
     
     // spread.options.setColumnResizable(0,true, GC.Spread.Sheets.SheetArea.colHeader);
    //  spread.options.resizeZeroIndicator = GC.Spread.Sheets.SheetArea.Enhanced

            sheet.bind(GC.Spread.Sheets.Events.LeaveCell, function (event, infos) {
            //    var res:string = sheet.getCell(0, infos.col,GC.Spread.Sheets.SheetArea.colHeader).value()
            //    // Reset the backcolor of cell before moving
            //    if (self.prev_cell.service==null)
            //        sheet.getCell(infos.row, infos.col).backColor(undefined);
            //    infos.sheet.getCell(0, infos.col, GC.Spread.Sheets.SheetArea.colHeader).backColor(undefined);
            //     var res:string = infos.sheet.getText(0, infos.col,GC.Spread.Sheets.SheetArea.colHeader);

            //     if ( res.substring(3, 4)=="S"){
            //         infos.sheet.getCell(0, infos.col, GC.Spread.Sheets.SheetArea.colHeader).backColor("#85B9D5");
            //         infos.sheet.getCell(0, infos.col, GC.Spread.Sheets.SheetArea.colHeader).foreColor("#000000");
            //      } else{
            //         infos.sheet.getCell(0, infos.col, GC.Spread.Sheets.SheetArea.colHeader).foreColor("#ffffff");
            //         infos.sheet.getCell(0, infos.col, GC.Spread.Sheets.SheetArea.colHeader).backColor("#002060");
            //     }
                
                });

              
            
                sheet.bind(GC.Spread.Sheets.Events.EnterCell, function (event, infos) {
                   
                  
               // infos.sheet.getCell(0, infos.col, GC.Spread.Sheets.SheetArea.colHeader).text("#002060")
            });
            
         
           spread.bind(spreadNS.Events.CellClick, function (e: any, args: any) {
            let row,col, duration=0,type=0,service;
            
              let sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
             
            
              if(args.sheetArea==1 || args.sheetArea==2){
                sheet.options.isProtected = false;
                return;

              }
              sheet.options.isProtected = true;                

              self.eventLog =
                  'SpreadEvent: ' + GC.Spread.Sheets.Events.CellClick + ' event called' + '\n' +
                  'sheetArea: ' + sheetArea + '\n' +
                  'row: ' + args.row + '\n' +
                  'col: ' + args.col;      
            
                  console.log(self.eventLog );
                  row=args.row;
                  col=args.col;
                  
                  if (row<=0) return;
                  
                  spread.suspendPaint();

                  if (self.prev_cell.duration==null || self.prev_cell.duration==0)
                  self.prev_cell.duration=1;
                  
                 // sheet.clearSelection();
                  self.ActiveCellText="";
                  sheet.getRange(self.prev_cell.row, self.prev_cell.col, self.prev_cell.duration, 1, GC.Spread.Sheets.SheetArea.viewport).setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
                 if (self.prev_cell.service==null)
                  sheet.getCell(self.prev_cell.row, self.prev_cell.col).backColor("#ffffff");
                 
                  
                  if (sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)!=null) {
                  self.cell_value=sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)
                 
                  row=self.cell_value.row
                  col=self.cell_value.col
                  duration=Number(self.cell_value.duration)
                  type=self.cell_value.type;
                  service=self.cell_value.service;
                 
      

                  if (service!=null)
                    self.ActiveCellText=self.cell_value.recordNo + " - " + service 
                 
                  var new_duration:number;
                  if (self.time_slot==288)
                    new_duration=Number(duration);
                  else if (self.time_slot==144)
                    new_duration= Math.ceil(Number(duration)/2); 
                  else if (self.time_slot==96)
                    new_duration= Math.ceil(Number(duration)/3); 
            
                if (new_duration<=0)
                    new_duration=1;

                      // duration=10;
                  // Allow selection of multiple ranges
                  sheet.selectionPolicy(GC.Spread.Sheets.SelectionPolicy.multiRange);
                 
                  // Create two different selection ranges.
                  sheet.addSelection(row, col, new_duration, 1);
                //  sheet.addSpan(row, col, new_duration, 1, sheetArea);

                 let len =row+new_duration;

                   for (let i=row; i<len; i++){
                  var cell = sheet.getCell(i, col, GC.Spread.Sheets.SheetArea.viewport);
                      cell.borderLeft(new GC.Spread.Sheets.LineBorder("blue", GC.Spread.Sheets.LineStyle.medium));
                      cell.borderRight(new GC.Spread.Sheets.LineBorder("blue", GC.Spread.Sheets.LineStyle.medium));      
                      if (i==row)
                      cell.borderTop(new GC.Spread.Sheets.LineBorder("blue", GC.Spread.Sheets.LineStyle.medium));
                      if (i==len-1){
                        cell.borderBottom(new GC.Spread.Sheets.LineBorder("blue",GC.Spread.Sheets.LineStyle.medium));                      
                       
                      }
                  }
                }else {
                  
                  // sheet.getCell(row, col).backColor("#cfcfca");
                  // sheet.getCell(row, col).setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
                 
            }
                  self.prev_cell = {row,col,duration, type,service};
                
                  spread.resumePaint();
          });
          spread.bind(GC.Spread.Sheets.Events.CellDoubleClick, function (sender, args) {
            console.log("Double clicked column index: " + args.row + ", " + args.col);
            //console.log("Double clicked row index: " + args.row);
            let col= args.col;
            let row=args.row;

            if (row<=0) return;
            
            self.ActiveCellText="";
            sheet.getRange(self.prev_cell.row, self.prev_cell.col, self.prev_cell.duration, 1, GC.Spread.Sheets.SheetArea.viewport).setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
           if (self.prev_cell.service==null)
            sheet.getCell(self.prev_cell.row, self.prev_cell.col).backColor("#ffffff");

            self.cell_value=sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)
           
            let data:any = self.find_roster(self.cell_value.recordNo);
           
            if (data!=null)
                self.details(data);

            if(args.sheetArea === GC.Spread.Sheets.SheetArea.colHeader){
                console.log("The column header was double clicked.");
            }
        
            if(args.sheetArea === GC.Spread.Sheets.SheetArea.rowHeader){
                console.log("The row header was double clicked.");
            }
        
            if(args.sheetArea === GC.Spread.Sheets.SheetArea.corner){
                console.log("The corner header was double clicked.");
            }
        
            
        });
        //   spread.bind(spreadNS.Events.SelectionChanging, function (e: any, args: any) {
        //       let selection = args.newSelections.pop();
        //       let sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
        //       self.eventLog =
        //           'SpreadEvent: ' + GC.Spread.Sheets.Events.SelectionChanging + ' event called' + '\n' +
        //           'sheetArea: ' + sheetArea + '\n' +
        //           'row: ' + selection.row + '\n' +
        //           'column: ' + selection.col + '\n' +
        //           'rowCount: ' + selection.rowCount + '\n' +
        //           'colCount: ' + selection.colCount;
               
             
        //   });
          spread.bind(spreadNS.Events.SelectionChanged, function (e: any, args: any) {
              let selection = args.newSelections;
              //if (selection.rowCount > 1 && selection.colCount > 1) {
                //   let sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
                  
                //   if(args.sheetArea==1 || args.sheetArea==2){
                //       return;
                //   }
                //   return;
                  self.eventLog =
                      'SpreadEvent: ' + GC.Spread.Sheets.Events.SelectionChanged + ' event called' + '\n' +
                      
                      'row: ' + selection.row + '\n' +
                      'column: ' + selection.col + '\n' +
                      'rowCount: ' + selection.rowCount + '\n' +
                      'colCount: ' + selection.colCount;

                      var len =selection[0].rowCount;
                      var cols = selection[0].colCount;
                      var row=selection[0].row;
                      var col = selection[0].col;
                      

                      spread.suspendPaint()
                      
                
                // Set the backcolor and forecolor for the entire column header.
                var columns = sheet.getRange(0,col, len, cols, GC.Spread.Sheets.SheetArea.colHeader);
                columns.backColor("#002060");
                columns.foreColor("White");

                // Set the backcolor of second row header.
                //sheet.getCell(row, 0, GC.Spread.Sheets.SheetArea.rowHeader).backColor("Yellow");
                var rows = sheet.getRange(row,0, len, 0, GC.Spread.Sheets.SheetArea.rowHeader);
                rows.backColor("#002060");
                rows.foreColor("White");

      
                    spread.resumePaint();
                    return;

                      if (sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)==null) {
                        self.prev_cell ={row:row,col:col,duration:len};
                      len =row+len;
                       for (let i=row; i<len; i++){
                      var cell = sheet.getCell(i, col, GC.Spread.Sheets.SheetArea.viewport);
                          cell.borderLeft(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));
                          
                          if (i==row)
                            cell.borderTop(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));
                          if (i==len-1){
                            cell.borderBottom(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));    
                            cell.borderRight(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));
                          }
      
                      }
                      spread.resumePaint();
                    }

              
          });
          spread.bind(spreadNS.Events.EditStarting, function (e: any, args: any) {
              self.eventLog =
                  'SpreadEvent: ' + GC.Spread.Sheets.Events.EditStarting + ' event called' + '\n' +
                  'row: ' + args.row + '\n' +
                  'column: ' + args.col;
          });
          spread.bind(spreadNS.Events.EditEnded, function (e: any, args: any) {
              self.eventLog =
                  'SpreadEvent: ' + GC.Spread.Sheets.Events.EditEnded + ' event called' + '\n' +
                  'row: ' + args.row + '\n' +
                  'column: ' + args.col + '\n' +
                  'text: ' + args.editingText;
          });
  
        var menuData = spread.contextMenu.menuData;
        var sperator;
        menuData.forEach(function (item) {
            if(item){
                if(item.type === "separator") {
                     
                  sperator=item;
                    return;
                }
                
            }
        });
  
          var newMenuData = [];
          var selected_Cell; 
          var copy = {
            iconClass : "gc-spread-copy",
            name : "Copy",
            text : "Copy",
            command : "Copy",
            workArea : "viewportcolHeaderrowHeadercorner"
        };       
          newMenuData.push(copy);
  
          var cut = {
            iconClass : "gc-spread-cut",
            name : "Cut",
            text : "Cut",
            command : "Cut",
            workArea : "viewportcolHeaderrowHeadercorner"
        };
          newMenuData.push(cut);
  
          var paste = {
            iconClass : "gc-spread-pasteAll",
            name : "Paste",
            text : "Paste",
            command : "Paste",
            workArea : "viewportcolHeaderrowHeadercorner"
        };       
          newMenuData.push(paste);     
         
          newMenuData.push(sperator);
  
          var del = {
            iconClass : "gc-spread-delete",
            name : "Delete",
            text : "Delete",
            command : "Delete",
            workArea : "viewportcolHeaderrowHeadercorner"
        };
          newMenuData.push(del);
          newMenuData.push(sperator);
  
          var realocate = {         
            name : "ReAllocateStaff",
            text : "Re-Allocate Staff",
            command : "ReAllocateStaff",
            workArea : "viewportcolHeaderrowHeadercorner"
        };
          newMenuData.push(realocate);
         
          var unalocate = {         
            name : "UnAllocateStaff",
            text : "Un-Allocate Staff",
            command : "UnAllocateStaff",
            workArea : "viewportcolHeaderrowHeadercorner"
        };
          newMenuData.push(unalocate);
          newMenuData.push(sperator);
  
          var multi = {         
            name : "MultiShift",
            text : "Set MultiShift",
            command : "MultiShift",
            workArea : "viewportcolHeaderrowHeadercorner"
        };
          newMenuData.push(multi);
          var clear_multi = {         
            name : "ClearMultiShift",
            text : "Clear MultiShift",
            command : "ClearMultiShift",
            workArea : "viewportcolHeaderrowHeadercorner"
        };
          newMenuData.push( clear_multi);
  
          newMenuData.push(sperator);
          
          var viewStaff = {
            text: 'View Staff Detail',
            name: 'ViewStaffDetail',
            command: "ViewStaffDetail",
            workArea: 'viewport'
        };        
           newMenuData.push(viewStaff);
  
           var viewService= {
            text: 'View Service Detail',
            name: 'ViewServiceDetail',
            command: "ViewServiceDetail",
            workArea: 'viewport'
        };        
           newMenuData.push(viewService);

           var openDialog = {
            text: 'View Additional Information (Xtra Info)',
            name: 'ViewAdditional',
            command: "ViewAdditional",
            workArea: 'viewport'
        }; 

           newMenuData.push(openDialog);
           spread.contextMenu.menuData = newMenuData;
          
           spread.commandManager().register("Copy",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                  // add cmd here
                    options.cmd = "gc.spread.contextMenu.copy";
                 // options.cmd = "Copy";
                  
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        var sheet = spread.getActiveSheet();
                       
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                        self.operation="copy";
                        console.log("Row=" + sel.row  + ", col=" + sel.col)
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null)
                          self.copy_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)
                        else
                          self.copy_value={row:-1,col:-1,duration:-1}
  
                        //  if (self.cell_value!=null)
                         //  self.current_roster = self.find_roster(self.cell_value.RecordNo);
                     

                     
                        if(sels && sels.length > 0){
                          console.log("Copy Operation\n" + sel + "\n");
                           
                        }
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            spread.commandManager().register("Cut",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "Cut";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
  
                        var sheet = spread.getActiveSheet();
                        console.log("Cut Operation")
                        self.operation="cut";
                        var sheet = spread.getActiveSheet();
                       
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                       
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null)
                          self.copy_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)
                        else
                          self.copy_value={row:-1,col:-1,duration:-1}
                        //  if (self.cell_value!=null)
                           // self.current_roster = self.find_roster(self.cell_value.RecordNo);
                       
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });  
            spread.commandManager().register("Paste",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    //options.cmd = "gc.spread.contextMenu.pasteAll";
                    options.cmd = "Paste";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        var sheet = spread.getActiveSheet();
                        spread.suspendPaint()
                       // sheet.options.isProtected = false;
                        console.log("Paste Operation")
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var col = sel.col;
                        var row = sel.row;
                        console.log(selected_Cell);     
                        
                        
                        let selected_columns = selected_Cell.col + selected_Cell.colCount;
                        let dt= new Date(self.date);        
                        let data_row=0;
                        let row_iterator=0;
                        let recdNo=0;
                        col=col-1;
                        for (let i=selected_Cell.col; i<selected_columns; i++)
                        {
                            data_row=selected_Cell.row;
                            col=col+1;
                            for ( row_iterator=0; row_iterator<=selected_Cell.rowCount; row_iterator++){
                               if (sheet.getTag(data_row,i,GC.Spread.Sheets.SheetArea.viewport)==null ){
                                data_row=data_row+1;
                                continue;
                               }
                                                           
                             if (sheet.getTag(data_row,i,GC.Spread.Sheets.SheetArea.viewport)!=null)
                                self.copy_value=sheet.getTag(data_row,i,GC.Spread.Sheets.SheetArea.viewport)
                            
                            if (self.copy_value.recordNo==recdNo)
                                continue;
                            
                            recdNo=self.copy_value.recordNo;
                            let rdate = dt.getFullYear() + "/" + self.numStr(dt.getMonth()+1) + "/" + self.numStr(col);
                      
                            if (self.copy_value==null || self.copy_value.recordNo==null || self.copy_value.recordNo==0){
                                continue;
                            }
                            //if (self.copy_value.row>=0){
                               let n_row=row+row_iterator;
                            self.draw_Cells(sheet,n_row,col,self.copy_value.duration,self.copy_value.type,self.copy_value.recordNo,self.copy_value.service)
                            
                            
                            if (self.operation==="cut"){
                                self.ProcessRoster("Cut",self.copy_value.recordNo,rdate);
                                self.remove_Cells(sheet,self.copy_value.row,self.copy_value.col,self.copy_value.duration)
                            }else
                                self.ProcessRoster("Copy",self.copy_value.recordNo,rdate);    
                            
                             data_row=data_row+1;                 
                            }// rows loop
                            
                        }
                       // sheet.setValue(row,col,sheet.getCell(selected_Cell.row, selected_Cell.col));
  
                       //sheet.getCell(row,col).backColor(sheet.getCell(selected_Cell.row, selected_Cell.col).backColor);
                      //sheet.getCell(row,col).backgroundImage(sheet.getCell(selected_Cell.row, selected_Cell.col).backgroundImage);
  
                        Commands.endTransaction(context, options);
                      //  sheet.options.isProtected = true;
                        spread.resumePaint();
                       
                        if (self.viewType=='Staff'){
                            self.current_roster = self.find_roster(self.cell_value.recordNo);
                            let clientCode =self.current_roster.recipientCode;
                            let date= self.current_roster.date

                            self.txtAlertSubject = 'NEW SHIFT ADDED : ' ;
                            self.txtAlertMessage = 'NEW SHIFT ADDED : \n' + date + ' : \n'  + clientCode + '\n'  ;
                        
                            self.show_alert=true;
                        }
                       // self.load_rosters();
                        return true;
                    }
                }
            });
            spread.commandManager().register("Delete",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "Delete";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
  
                        var sheet = spread.getActiveSheet();
                      
                        console.log("Delete Operation")
                       
                       
                       
                        
                            self.deleteRosterModal=true;
                          
                        
                            self.operation="Delete";     
                        
                        Commands.endTransaction(context, options);

                      
                        return true;
                    }
                }
            });  

            
            spread.commandManager().register("ReAllocateStaff",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "ReAllocateStaff";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                       
                        var sheet = spread.getActiveSheet();
                        
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                       
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null)
                          self.cell_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)
                        else
                          self.cell_value={row:-1,col:-1,duration:-1}

                        self.searchStaffModal=true;
                        
                        console.log("Reallocate Event called");
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            spread.commandManager().register("UnAllocateStaff",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "UnAllocateStaff";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        var sheet = spread.getActiveSheet();
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                       
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null)
                          self.cell_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)
                        else
                          self.cell_value={row:-1,col:-1,duration:-1}

                        self.UnAllocateStaffModal=true;
                        
                                                
                        console.log("UnAllocateStaff Event called");
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            spread.commandManager().register("MultiShift",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "MultiShift";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                     
                        var sheet = spread.getActiveSheet();
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                       
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null)
                          self.cell_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)
                        else
                          self.cell_value={row:-1,col:-1,duration:-1}
                          self.SetMultiShiftModal=true;                    
                        console.log("MultiShift Event called");
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            
            spread.commandManager().register("ClearMultiShift",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "ClearMultiShift";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        var sheet = spread.getActiveSheet();
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                       
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null)
                          self.cell_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)
                        else
                          self.cell_value={row:-1,col:-1,duration:-1}
                          
                          self.ClearMultiShiftModal=true;                
                        console.log("ClearMultiShift Event called");
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            spread.commandManager().register("ViewStaffDetail",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "ViewStaffDetail";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        var sheet = spread.getActiveSheet();
                        self.ViewStaffDetail=true;
                        
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            
            spread.commandManager().register("ViewServiceDetail",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "ViewServiceDetail";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                      
                        var sheet = spread.getActiveSheet();
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                        var col= sel.col;
                       
            
                        self.cell_value=sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)
                       
                        let data:any = self.find_roster(self.cell_value.recordNo);
                       
                        if (data!=null)
                            self.details(data);
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            
            spread.commandManager().register("ViewAdditional",
            {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    var Commands = GC.Spread.Sheets.Commands;
                                 // add cmd here
                    options.cmd = "ViewAdditional";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        var sheet = spread.getActiveSheet();
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                        var col= sel.col;
                       
            
                        self.cell_value=sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)
                       
                        let data:any = self.find_roster(self.cell_value.recordNo);
                        self.notes ="";
                        self.notes=data.notes;
                        self.defaultStartTime=data.startTime;
                        self.date=data.date;
                        self.serviceType=data.serviceActivity;

                        self.ViewAdditionalModal=true;
                        console.log("ViewAdditional event called");
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
           // sheet.options.isProtected = true;
            spread.options.allowContextMenu = true;
               
         
  
          spread.resumePaint();
      
          self.prepare_Sheet();
     
          
  }  
  
  prepare_Sheet(){

    if (this.spreadsheet==null){
       
        return;
    }

   let sheet:any=this.spreadsheet.getActiveSheet(); 

   //this.changeHeight()
   this.spreadsheet.suspendPaint();
  
     // Set the default styles.
     var defaultStyle = new GC.Spread.Sheets.Style();
     defaultStyle.font = "Segoe UI";
     defaultStyle.themeFont = "Segoe UI";
     
     sheet.clearSelection();
     sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
     let date:Date = new Date(this.date);

    if (this.startRoster==null){
        date =  new Date(this.date);
        let d = date.getDate()-1;
        date.setDate(date.getDate()-d)  
        
    }else
        date = new Date(this.startRoster);

    let m = date.getMonth()+1;
    let y=date.getFullYear();
  
    
   //
    
    let days:number =this.getDaysInMonth(m,y);

   if (this.Days_View>=30){
    this.Days_View=days
   }
    sheet.setColumnCount(this.Days_View, GC.Spread.Sheets.SheetArea.viewport);
    sheet.setRowCount(this.time_slot, GC.Spread.Sheets.SheetArea.viewport);
    sheet.setColumnResizable(0,true, GC.Spread.Sheets.SheetArea.colHeader);
    // if (this.Days_View==31) {this.Days_View==days}
    
    // sheet.setColumnCount(this.Days_View, GC.Spread.Sheets.SheetArea.viewport);
    
    for (let i=0; i<=this.Days_View ; i++)   
        
        {
                
     // sheet.setValue(0, i, date.getDate() + " " + this.DayOfWeek( date.getDay()), GC.Spread.Sheets.SheetArea.colHeader);
     
      var head_txt=date.getDate() + " " + this.DayOfWeek( date.getDay());
      if (this.Days_View>=30)
        sheet.setValue(0, i, { richText: [{ style: { font: '12px Segoe UI ', foreColor: 'white' }, text: head_txt   }] }, GC.Spread.Sheets.SheetArea.colHeader);        
      else
        sheet.setValue(0, i, { richText: [{ style: { font: '10px Segoe UI ', foreColor: 'white' }, text: head_txt   }] }, GC.Spread.Sheets.SheetArea.colHeader);        

      var row_header = sheet.getRange(i, -1, 1, -1, GC.Spread.Sheets.SheetArea.colHeader);
       row_header.backColor("#002060");
      //row_header.foreColor("#ffffff");
      
      sheet.getCell(0, i, GC.Spread.Sheets.SheetArea.colHeader).tag(date);

     var new_width = 100 / this.Days_View;
     
     //sheet.setColumnWidth(i, new_width,GC.Spread.Sheets.SheetArea.viewport);
     
     sheet.setColumnWidth(i, new_width +"*",GC.Spread.Sheets.SheetArea.viewport);

    //   if (this.Days_View>=30)
    //     sheet.setColumnWidth(i, 40.0,GC.Spread.Sheets.SheetArea.viewport);
    //   else if (this.Days_View>=14)
    //     sheet.setColumnWidth(i, 70.0,GC.Spread.Sheets.SheetArea.viewport);
    //   else 
    //     sheet.setColumnWidth(i, 120.0,GC.Spread.Sheets.SheetArea.viewport);
      
        sheet.setColumnResizable(i,true, GC.Spread.Sheets.SheetArea.colHeader);
        
        //        
       // sheet.autoFitColumn(i)            

      if ((this.DayOfWeek( date.getDay())=="Sat") || (this.DayOfWeek( date.getDay())=="Sun")){
          sheet.getCell(0, i, GC.Spread.Sheets.SheetArea.colHeader).backColor("#85B9D5");
          if (this.Days_View>=30)
            sheet.setValue(0, i, { richText: [{ style: { font: 'bold 10px Segoe UI ', foreColor: '#c7060c' }, text: head_txt }] }, GC.Spread.Sheets.SheetArea.colHeader);        
        else
            sheet.setValue(0, i, { richText: [{ style: { font: 'bold 12px Segoe UI ', foreColor: '#c7060c' }, text: head_txt }] }, GC.Spread.Sheets.SheetArea.colHeader);        
          
      //row_header.backColor("#D1A6BC");
     
      }else{
        sheet.getCell(0, i, GC.Spread.Sheets.SheetArea.colHeader).backColor("#002060");
        if (this.Days_View>=30)
            sheet.setValue(0, i, { richText: [{ style: { font: '10px Segoe UI ',foreColor: '#ffffff' }, text: head_txt }] }, GC.Spread.Sheets.SheetArea.colHeader);        
        else
            sheet.setValue(0, i, { richText: [{ style: { font: '12px Segoe UI ',foreColor: '#ffffff' }, text: head_txt }] }, GC.Spread.Sheets.SheetArea.colHeader);        
            
      }
      date.setDate(date.getDate()+1); 
    }

    let time:Time;
    time={hours:0,
        minutes:0}
      
    

    for (let j=0; j<this.time_slot; j++)   {      
   
        var row_txt=date.getDate() + " " + this.DayOfWeek( date.getDay());
        
        if (time.minutes==0){
            row_txt = this.numStr(time.hours)  + ":" + this.numStr(time.minutes) 
        }else if (time.minutes%15==0)
            row_txt = "     "+this.numStr(time.minutes)  ;
        else
            row_txt= "";

         sheet.setValue(j, 0, { richText: [{ style: { font: 'bold 12px Segoe UI ', foreColor: 'white' }, text: row_txt   }] }, GC.Spread.Sheets.SheetArea.rowHeader);        
       
       // sheet.getRange(j, 0, 1, 1).tag(this.numStr(time.hours)  + ":" + this.numStr(time.minutes));
        sheet.getCell(j, 0, GC.Spread.Sheets.SheetArea.rowHeader).tag(this.numStr(time.hours)  + ":" + this.numStr(time.minutes));

        this.time_map.set(j,this.numStr(time.hours)  + ":" + this.numStr(time.minutes))
        sheet.getCell(j, 0, GC.Spread.Sheets.SheetArea.rowHeader).backColor("#002060");
        sheet.getCell(j, 0, GC.Spread.Sheets.SheetArea.rowHeader).foreColor("#ffffff");
        sheet.setColumnWidth(0, 60.0,GC.Spread.Sheets.SheetArea.rowHeader);
        
        sheet.setRowResizable(j,true, GC.Spread.Sheets.SheetArea.rowHeader);

        if (this.time_slot==288)
            time.minutes+=5;
        else if (this.time_slot==144)
            time.minutes+=10;
        else if (this.time_slot==96)
            time.minutes+=15;

        if (time.minutes==60){
          time.minutes=0;
          time.hours+=1;
        }

         
     
        
        
  }

        if (this.time_slot==288){
            sheet.setActiveCell(96,0)
            sheet.showCell (96,0)
        } else if (this.time_slot==144){
            sheet.setActiveCell(48,0)
            sheet.showCell (48,0)
        } else if (this.time_slot==96){
            sheet.setActiveCell(32,0)
            sheet.showCell (32,0)
        }
        
        sheet.options.isProtected = true;
        sheet.options.protectionOptions.allowDeleteRows  = false;
        sheet.options.protectionOptions.allowDeleteColumns = false;
        sheet.options.protectionOptions.allowInsertRows = false;
        sheet.options.protectionOptions.allowInsertColumns = false;
        sheet.options.protectionOptions.allowDargInsertRows = false;
        sheet.options.protectionOptions.allowDragInsertColumns = false;        
        sheet.options.resizeZeroIndicator = GC.Spread.Sheets.ResizeZeroIndicator.enhanced;

        sheet.options.selectionBorderColor = "blue";
        sheet.options.selectionBackColor = "rgba(155, 225, 230, 0.2)";
        sheet.options.selectedBorderColor = "blue";

  this.Already_loaded=true;
  this.spreadsheet.resumePaint();
  

      
  }

  set_Time_Interval(t:number)
  {
     // this.show_views=false;
      this.time_slot=t;
      this.tval=t;
      console.log(this.tval);
  }  
  
  set_day_view(d:number)
  {
    //this.show_views=false;
      this.Days_View=d;
      this.dval=d;
    //   this.prepare_Sheet();
    //   this.load_rosters();
        if (this.Days_View>30){ 
            
            this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')
            this.endRoster =moment(this.date).endOf('month').format('YYYY/MM/DD')
        }else{
            this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')

            this.date = moment(this.startRoster).add('day', this.Days_View-1);
            this.endRoster = moment(this.date).format('YYYY/MM/DD');
        }

        this.date= moment(this.startRoster).add('day', 0);
        
    console.log(this.dval);
  }  
  
  setIcon(r:number, c:number, type:number,RecordNo:number,Servicetype:any) {

    var sheet = this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
    sheet.setValue(r,c,Number(type),GC.Spread.Sheets.SheetArea.viewport);
    var text="";
   var range =[new GC.Spread.Sheets.Range(r,c,r,c+1)]      
    if(RecordNo==0)
        text="";
    else
        text=Servicetype + "-" +RecordNo + ", type=" + type;
    switch(Number(type)){
        case 1:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-1')));                    
        break;
        case 2:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-2')));
            break;
        case 3:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-3')));
            break;
        case 4:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-4')));
            break;
        case 5:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-5')));
            break;
        case 6:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-6')));
            break;
        case 7:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-7')));
            break;           
        case 8:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-8')));
            break;   
        case 9:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-9')));
            break;   
        case 10:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-10')));
            break;
        case 11:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-11')));
            break;        
         case 12:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-12')));
            break;
        case 13:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-13')));
            break;
        case 14:
            sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-14')));
            break; 
        case 15:
                sheet.getCell(r,c).text(text).cellType(new IconCellType(document.getElementById('icon-15')));
                break; 
        case 20:
                sheet.getCell(r,c).text("").cellType(new IconCellType2(document.getElementById('icon-20')));
                break; 
        default:
           sheet.getCell(r,c).text("").cellType(new IconCellType2(document.getElementById('icon-21')));
            
    }
       
    this.spreadsheet.resumePaint();   
       
  }

  getDaysInMonth(m:number, y:number):number{
      let n:number=0;
      if (m==1 || m==3 || m==5 || m==7 || m==8 || m==10 || m==12) {
        n=31;
      }else if (m==2 && y%4==0){
          n=29;
      }else if (m==2 ){
        n=28;
      }else{
            n=30;
       }
    
      return n;
  }
  getrow(starttime:string):number{
   let h,m,r;
    h=Number(starttime.substr(0,2));
    m=Number(starttime.substr(3,2));
    if (this.time_slot==288)
        r=h*12+Math.floor(m/5);
    else if (this.time_slot==144)
        r=h*6+Math.floor(m/10);
    else if (this.time_slot==96)
        r=h*4+Math.floor(m/15);
  
    return r;
  
  }
    draw_Cells(sheet:any,r:number, c:number, duration:number, type:number, RecordNo:number,service:any){
     
      //  this.current_roster = this.find_roster(RecordNo);
      this.cell_value ={"row":r,"col":c,"duration":duration, "type":type, "recordNo":RecordNo, "service":service};
      var rowImage = "/assets/images/r1.jpg";
     
     // sheet.options.isProtected = true;
      var cell= sheet.getRange(r, c, duration, 1, GC.Spread.Sheets.SheetArea.viewport);
     // cell.borderRight(new GC.Spread.Sheets.LineBorder("#084F58", GC.Spread.Sheets.LineStyle.thin), {all:true});
      cell.setBorder(new GC.Spread.Sheets.LineBorder("#CAF0F5", GC.Spread.Sheets.LineStyle.thin), {all:true}); 
      //sheet.getRange(r, c, duration, 1, GC.Spread.Sheets.SheetArea.viewport).borderRight(new GC.Spread.Sheets.LineBorder("#084F58", GC.Spread.Sheets.LineStyle.thin))
    
    var new_duration:number=0;

    if (this.time_slot==288)
        new_duration=duration;
     else if (this.time_slot==144)
         new_duration= Math.ceil(duration/2); 
    else if (this.time_slot==96)
        new_duration= Math.ceil(duration/3); 

    if (new_duration<1)
        new_duration=1;

      
      for (let m=0; m<new_duration; m++){
      if (m==0) {
        //sheet.getCell(r,c).backColor("#CAF0F5");
        //sheet.getCell(r+m,c).backColor({degree: 90, stops: [{position:0, color:"#CAF0F5"},{position:0.5, color:"#0A8598"},{position:1, color:"#80B1B9"},]});
        sheet.getCell(r+m,c).backColor({degree: 95, stops: [{position:0, color:"#CAF0F5"},{position:0.5, color:"#B3F2FF"},{position:1, color:"#B3F2FF"},]});

      //  sheet.getCell(r,c).backColor("#ffffff");
       // sheet.getCell(r,c).backgroundImage(rowImage)
        
       this.setIcon(r,c,type,RecordNo, service);
       sheet.getCell(r+m,c, GC.Spread.Sheets.SheetArea.viewport).locked(true);
       }  
       else{
            
           sheet.getCell(r+m,c).backColor("#CAF0F5");
           // sheet.getCell(r+m,c).backColor({degree: 95, stops: [{position:0, color:"#abd8de"},{position:0.5, color:"#CAF0F5"},{position:1, color:"#CAF0F5"},]});
         //  sheet.getCell(r,c).backColor("#ffffff");
          //  this.setIcon(r+m,c,20,RecordNo, "");
          sheet.getRange(r, c, duration, 1, GC.Spread.Sheets.SheetArea.viewport).setBorder(new GC.Spread.Sheets.LineBorder("#c8cccc", GC.Spread.Sheets.LineStyle.thin), {all:true});
        }
        //sheet.getCell(r+m,c).field=duration;
       sheet.getCell(r+m,c, GC.Spread.Sheets.SheetArea.viewport).locked(true);
        sheet.getRange(r+m, c, 1, 1).tag(this.cell_value)

       }
       
   
     // if (new_duration>1)
     //sheet.addSpan(r, c, new_duration, 1);
      //sheet.getCell(5, 4).value("Demo-" +c).hAlign(1).vAlign(1);
       
    }

    remove_Cells(sheet:any,r:number, c:number, duration:number){
      
      
      //sheet.getRange(r, c, duration, 1, GC.Spread.Sheets.SheetArea.viewport).setBorder(new GC.Spread.Sheets.LineBorder("#C6EFEC", GC.Spread.Sheets.LineStyle.thin), {all:true});
      this.cell_value ={row:-1,col:-1,duration:0};
      var new_duration:number=0;

      if (this.time_slot==288)
          new_duration=duration;
       else if (this.time_slot==144)
           new_duration= Math.ceil(duration/2); 
      else if (this.time_slot==96)
          new_duration= Math.ceil(duration/3); 
  
      if (new_duration<=0)
          new_duration=1;

      for (let m=0; m<new_duration; m++){
      if (m==0) {
        if (this.master)           
           // sheet.getCell(r+m,c).backColor("#FF8080");
           sheet.getCell(r+m,c).backColor("white");
        else
            sheet.getCell(r+m,c).backColor("white");
        
        sheet.getCell(r+m,c).backgroundImage(null)
        this.setIcon(r,c,21,0, "");
       }  
       else {
            if (this.master)           
                //sheet.getCell(r+m,c).backColor("#FF8080");
                sheet.getCell(r+m,c).backColor("white");
            else
            sheet.getCell(r+m,c).backColor("white");
       }
        //sheet.getCell(r+m,c).field=duration;
        sheet.getCell(r+m,c, GC.Spread.Sheets.SheetArea.viewport).locked(true);
        sheet.getRange(r+m, c, 1, 1).tag(null);
        sheet.getRange(r+m, c, 1, 1).text("");
  
       
       //this.addOpenDialog();    
       
      }
    }
    numStr(n:number):string {
      let val="" + n;
      if (n<10) val = "0" + n;
      
      return val;
    }

    selectedDays(value: string[]): void {
        this.weekDay=value
        console.log(value);
      }

    updateCheckedSet(id: any, checked: boolean): void {
        if (checked) {
          this.setOfCheckedId.add(id);
        } else {
          this.setOfCheckedId.delete(id);
        }
      }
      refreshCheckedStatus(): void {
       
          //this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
        //  this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
      }
      onItemChecked(id: any, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
      }

    onItemSelected(sel: any, i:number, type:string): void {
            console.log(sel)
            
            if (type=="program"){       
                this.HighlightRow=i;   
                this.defaultProgram=sel;
                this.bookingForm.patchValue({
                    program:sel
                });
            }else if (type=="service"){
                this.HighlightRow2=i;
                this.defaultActivity=sel;//this.serviceActivityList[i];
                // this.bookingForm.controls["serviceActivity"].valueChanges.subscribe(() => {
                //     console.log("modified");}, () => { console.log("error") }, () => { console.log("completed") });
        
                this.bookingForm.patchValue({
                    serviceActivity:sel
                });
            }else if (type=="location"){
                this.HighlightRow3=i;
                this.serviceSetting=sel;
                this.bookingForm.patchValue({
                    serviceSetting:sel
                });
              
            }else if (type=="Category"){
                this.HighlightRow4=i;
                this.GroupShiftCategory=sel;
                this.recipientCode='!MULTIPLE'
                this.bookingForm.patchValue({
                    recipientCode:'!MULTIPLE'
                });
                
            }else if (type=="PayType"){
                this.HighlightRow5=i;
                this.haccCode=sel.haccCode
                this.bookingForm.patchValue({
                    payType:sel.title
                
                })
            
        }
            
      }
     
    onItemDbClick(sel: any, i:number, type:string): void {

        
        console.log(sel)
        this.HighlightRow=i;               

        if (type=="program"){          
            this.defaultProgram=sel;
            this.bookingForm.patchValue({
                 program:sel
             })
        }else if (type=="service"){
            this.defaultActivity=sel;
            
            this.bookingForm.patchValue({
                serviceActivity:sel
            })
            
        }else if (type=="location"){
            this.serviceSetting=sel;
            this.bookingForm.patchValue({
                serviceSetting:sel
            })
          
        }else if (type=="Category"){
            this.HighlightRow4=i;
            this.GroupShiftCategory=sel;
          
            this.recipientCode='!MULTIPLE'
            this.bookingForm.patchValue({
                recipientCode:'!MULTIPLE'
            });

            this.addGroupShift();
            return;
            
        } else if (type=="PayType"){
            this.HighlightRow5=i;
            this.haccCode=sel.haccCode
            this.bookingForm.patchValue({
                payType:sel.title
            })
            
        }
       
        //this.next_tab();
        
       
        if (this.showDone2 && this.rosterGroup!="" ){
          //  this.doneBooking();
            return;
        }
        if (this.current==1 && (this.activity_value==12 || this.booking_case==8)){
            
        }else if(this.showDone2==false ){
            this.next_tab();
        }
 
       
   
  }

  showRecipientStaffDetail(){
      //this.router.navigate(['/roster/recipient-external']);
      //this.router.navigate(['/admin/recipient/intake'])
      if (this.viewType=='Staff')
        this.staffexternal=true;
      else
        this.recipientexternal=true;
  }

  onAllChecked(e:any){

  }

  addGroupShiftRecipients(){

    this.doneBooking();

    
  }
  addGroupShift(){
      this.showGroupShiftModal=false;
      this.addBooking(0);
      this.add_multi_roster=true;
  }
    ProcessRoster(Option:any, recordNo:string, rdate:string=""):any {
        
        
        let dt= new Date(this.date);
        
        let sheet = this.spreadsheet.getActiveSheet();
        let range = sheet.getSelections();
        let date = dt.getFullYear() + "/" + this.numStr(dt.getMonth()+1) + "/" + this.numStr(range[0].col+1);
        if (rdate!=""){
            date=rdate;
        }
        let f_row= range[0].row;
        let l_row=f_row+range[0].rowCount;
       // let startTime=sheet.getTag(f_row,0,GC.Spread.Sheets.SheetArea.viewport);
        let startTime =   sheet.getCell(f_row,0,GC.Spread.Sheets.SheetArea.rowHeader).tag();
        let endTime =   sheet.getCell(l_row,0,GC.Spread.Sheets.SheetArea.rowHeader).tag();


        if (this.master){

            startTime="00:00"
        }
        var sels = sheet.getSelections();
        var sel = sels[0];
        
        let inputs = {
            "opsType": Option,
            "user": this.token.user,
            "recordNo": recordNo,
            "isMaster": this.master,
            "roster_Date" : date,
            "start_Time": startTime,
            "carer_code": this.viewType =="Staff" ? this.recipient.data : this.selectedCarer,
            "recipient_code" : this.viewType =="Staff" ? "" : this.recipient.data,
            "notes" : this.notes,
            'clientCodes' : this.clientCodes
        }
        this.timeS.ProcessRoster(inputs).subscribe(data => {
        //if  (this.ClearMultiShiftModal==false &&  this.SetMultiShiftModal==false) 
             //  this.globalS.sToast('Success', 'Timesheet '  + Option + ' operation has been completed');
        this.selectedCarer="";
        this.searchStaffModal=false;
        this.UnAllocateStaffModal=false;
        
        this.ClearMultiShiftModal=false;
        this.SetMultiShiftModal=false;
        this.ViewAdditionalModal=false;
        this.ViewServiceDetail=false;
        this.ViewStaffDetail=false;
        this.deleteRosterModal=false;
            
    });
    
    
}

    find_roster(RecordNo:number):any{
        let rst:any;
        for(var r of this.rosters)
       {
                if (r.recordNo == RecordNo){
                    rst= r;
                    break;
                }
            
        } 
        
        rst = {
            "shiftbookNo": r.recordNo,
            "date": r.roster_Date,
            "startTime": r.start_Time,
            "endTime":    r.end_Time,
            "duration": r.duration,
            "durationNumber": r.dayNo,
            "recipient": r.clientCode,
            "program": r.program,
            "activity": r.serviceType,
            "payType": r.payType,   
            "paytype": r.payType.paytype,  
            "pay": r.pay,                   
            "bill": r.bill,            
            "approved": r.Approved,
            "billto": r.billedTo,
            "debtor": r.billedTo,
            "notes": r.notes,
            "selected": false,
            "serviceType": r.type,
            "recipientCode": r.clientCode,            
            "staffCode": r.carerCode,  
            "serviceActivity": r.serviceType,
            "serviceSetting": r.serviceSetting,
            "analysisCode": r.anal,
            "serviceTypePortal": "",
            "recordNo": r.recordNo
            
        }
            
        
    
    return rst;
}   

find_last_roster(date: any, startTime:any):any{
    let rst:any;
    for(var r of this.rosters)
   {
            if (r.roster_Date == date && r.start_Time==startTime ){
                rst= r;
                break;
            }
        
    } 
    
    rst = {
        "shiftbookNo": r.recordNo,
        "date": r.roster_Date,
        "startTime": r.start_Time,
        "endTime":    r.end_Time,
        "duration": r.duration,
        "durationNumber": r.dayNo,
        "recipient": r.clientCode,
        "program": r.program,
        "activity": r.serviceType,
        "payType": r.payType,   
        "paytype": r.payType.paytype,  
        "pay": r.pay,                   
        "bill": r.bill,            
        "approved": r.Approved,
        "billto": r.billedTo,
        "debtor": r.billedTo,
        "notes": r.notes,
        "selected": false,
        "serviceType": r.type,
        "recipientCode": r.clientCode,            
        "serviceActivity": r.serviceType,
        "serviceSetting": r.serviceSetting,
        "analysisCode": r.anal,
        "serviceTypePortal": "",
        "recordNo": r.recordNo
        
    }
        
    

return rst;
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

      
    // onRightClick(e){
     
    //     e.default=false;
    //     this.optionsModal=true;
        
    //     console.log(this.optionsModal);
    //     return false;
    // }

    // handleClick(e){
    //     console.log(e);
    //      this.addTimesheetVisible = true;
    //      this.current_roster = this.rosters[1];
    //     this.details(this.current_roster);
        
      //  this.optionsModal=true;
       // console.log(this.optionsModal);
    //}
   
    add_Shift(){
        this.Timesheet_label = "Add Timesheet " 
        this.whatProcess = PROCESS.ADD;
        this.addTimesheetVisible = true;
       // this.resetAddTimesheetModal();
        this.AddViewRosterDetails.next(2);
        let sheet = this.spreadsheet.getActiveSheet();
        var range=sheet.getSelections();
        // console.log(range)
        let dt= new Date(this.date);
        //let dt = moment.utc(this.date).local();
        let f_row= range[0].row;
        let l_row=f_row+range[0].rowCount;        
        let col=range[0].col;
       
        let date = sheet.getCell(0,col,GC.Spread.Sheets.SheetArea.colHeader).tag();
       //  date = dt.getFullYear() + "/" + this.numStr(dt.getMonth()+1) + "/" + this.numStr(range[0].col+1);
        date = format(date, 'yyyy/MM/dd');

         let startTime =   sheet.getCell(f_row,0,GC.Spread.Sheets.SheetArea.rowHeader).tag();
         let endTime =   sheet.getCell(l_row,0,GC.Spread.Sheets.SheetArea.rowHeader).tag();

        // let startTime=sheet.getTag(f_row,0,GC.Spread.Sheets.SheetArea.viewport);
        // let endTime =sheet.getTag(l_row,-1,GC.Spread.Sheets.SheetArea.viewport);

        this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
        this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());
        this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        this.current = 0;
        
        this.date = parseISO(this.datepipe.transform(date, 'yyyy-MM-dd'));
        this.rosterForm.patchValue({date:date})

        //this.date = parseISO(new Date(date).toISOString());
        
    }
    mySub: Subscription;
    currentDate: string;

    dateStream = new Subject<any>();
    userStream = new Subject<string>();

    date:any = moment();
    options: any;
    recipient: any;
    serviceType:any;
    recipientCode:string;
    loading: boolean = true;
    formloading: boolean = false;
    basic: boolean = false;
    Select_Pay_Type:string="Select Pay Type"
   // data: any;
    add_multi_roster:boolean=false;
    private unsubscribe = new Subject();
  //  private rosters: Array<any>;
    //private current_roster: any;
    private upORdown = new Subject<boolean>();

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
        this.router.routeReuseStrategy.shouldReuseRoute = function () {        

            return false;
        };
        

        const navigation = this.router.getCurrentNavigation();
        const state = navigation.extras.state as {
            StaffCode: string,
            ViewType: string,
            IsMaster: boolean
        };
        if (state!=null){
       
        this.info = {StaffCode:state.StaffCode, ViewType:state.ViewType, IsMaster:state.IsMaster} ;


    }

   
        this.currentDate = format(new Date(), 'yyyy/MM/dd');

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

            this.AddViewRosterDetails.subscribe(data => {
                // console.log(data);
                this.user = {
                   // name: this.selectedOption.Recipient,
                   // code: this.selectedOption.uniqueid,
                    startDate: '2019/01/15',
                    endDate: '2019/01/29'     
                                 
                    
                }   
                console.log(data);         
                
                this.addTimesheetVisible = true;
                this.optionsModal=false;  
            });
            this.changeViewRosterDetails.subscribe(data => {
                // console.log(data);
                this.user = {
                   // name: this.selectedOption.Recipient,
                   // code: this.selectedOption.uniqueid,
                    startDate: '2019/01/15',
                    endDate: '2019/01/29'     
                              
                    
                }   
                console.log(data);         
                this.details(data) ;
                this.addTimesheetVisible = true;
                this.optionsModal=false;  
            });
            this.changeViewRecipientDetails.subscribe(data => {
                // console.log(data);
                this.user = {
                    //name: this.selectedOption.Recipient,
                  //  code: this.selectedOption.uniqueid,
                    startDate: '2019/01/15',
                    endDate: '2019/01/29'
                }            
                // this.tabvrd = data;
                console.log(data);
                this.recipientDetailsModal = true;
                this.optionsModal=false;  
            });
    
           
    
            this.changeModalView.subscribe(data => {
                console.log(data);
            });
        
    }
   
      
    whatProcess = PROCESS.ADD;
    details(index: any){
        this.detail.isVisible=true;
           this.detail.data=index;
           this.detail.viewType =this.viewType
           this.detail.editRecord=false;
           this.detail.ngAfterViewInit();
           return;
        this.whatProcess = PROCESS.UPDATE;
        console.log(index);
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
            endTime           
        
        } = index;

            
        // this.rosterForm.patchValue({
        //     serviceType: this.DETERMINE_SERVICE_TYPE(index),
        //     date: date,serviceActivityList
        //     program: program,
        //     serviceActivity: activity,
        //     payType: payType,
        //     analysisCode: analysisCode,
        //     recordNo: shiftbookNo,            
            
        //     recipientCode: recipientCode,
        //     debtor: debtor
        // });
        this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
        this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());
        let time:any={startTime:this.defaultStartTime, endTime:this.defaultEndTime}
        //this.defaultStartTime = parseISO( "2020-11-20T" + startTime + ":01.516Z");
        //this.defaultEndTime = parseISO( "2020-11-20T" + endTime + ":01.516Z");;
        this.current = 0;

       //console.log(this.defaultEndTime)

         
         this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
      //  this.durationObject = this.globalS.computeTimeDATE_FNS(startTime, endTime);

        setTimeout(() => {
            this.addTimesheetVisible = true;

            
            this.defaultProgram = program;
            this.defaultActivity = activity;
            this.defaultCategory = analysisCode;
            this.serviceType =  this.DETERMINE_SERVICE_TYPE(serviceType);
            this.recipientCode=recipientCode;
            this.Timesheet_label="Edit Timesheet (RecordNo : " + recordNo +")"
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
        }, 100);
    }

    ngOnInit(): void {
        GC.Spread.Sheets.LicenseKey = license;
        
        this.date = moment();
        this.AddTime();
        this.buildForm(); 
         this.token = this.globalS.decode();    
         this.tval=96;
         this.dval=14;
        if (this.info.StaffCode!='' && this.info.StaffCode!=null){
            this.defaultCode=this.info.StaffCode
            this.viewType=this.info.ViewType
            this.master=this.info.IsMaster
            let data ={data:this.defaultCode}
            this.picked(data);
        }

      
      
}
ngOnChange(change:OnChanges) {
   // console.log("ngOnChanges"+change);
    
}
ngAfterContentInit() {
   // console.log("ngAfterContentInit");
    
}
ngAfterViewChecked(){
   /// console.log("ngAfterViewChecked");
 
}
ngAfterViewInit(){

  this.formloading=true;
    console.log("ngAfterViewInit");   
   
}

ngOnDestroy(){
    console.log("ngDestroy");
  
}
refreshPage() {
    //this._document.defaultView.location.reload();
    window.location.reload();
   
  }
reloadVal: boolean = false;
reload(reload: boolean){
    
    this.reloadVal = !this.reloadVal;

}

    public clickStream;
    private clicks = 0;

    DETERMINE_SERVICE_TYPE(index: any): any{
        console.log(index);
        const { serviceType, debtor } = index;

        // ALLOWANCE NON CHARGEABLE 
        if(serviceType == 9 && debtor == '!INTERNAL'){
            return 'ALLOWANCE NON-CHARGEABLE';
            return this.modalTimesheetValues[2];
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

  


    picked(data: any) {
        console.log(data);
        this.userStream.next(data);

        if (!data.data) {
            this.rosters = [];
            this.selected = null;
            this.enable_buttons=false;
            return;
        }

       
        //this.prepare_Sheet(this.spreadsheet);
     

        this.selected = data;
        if (this.master){
            this.start_date= "1900/01/01"
            this.end_date= "1900/01/31"
        }else{
            
            this.start_date= moment(this.date).startOf('month').format('YYYY/MM/DD')
            this.end_date= moment(this.date).endOf('month').format('YYYY/MM/DD')
        }  
        this.viewType = this.whatType(data.option);
        
        this.loading = true;
        this.enable_buttons=true;

        if (this.picked$) {
            this.picked$.unsubscribe();
        }

        if(this.viewType == 'Recipient'){
            this.rosterForm.patchValue ({recipientCode:data.data});
            this.bookingForm.patchValue ({recipientCode:data.data});

            this.clientS.getagencydefinedgroup(this.selected.data)
                .subscribe(data => {
                    this.agencyDefinedGroup = data.data;
                });
        } 
        
       // return;
        
        this.picked$ = this.timeS.gettimesheets({
            AccountNo: data.data,            
            personType: this.viewType,
            startDate: moment(this.date).startOf('month').format('YYYY/MM/DD'),
            endDate: moment(this.date).endOf('month').format('YYYY/MM/DD'),
        }).pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {
                console.log(data);
                this.loading = false;
              //  this.selected=data;
                this.rosters = data.map(x => {
                    return {
                        shiftbookNo: x.shiftbookNo,
                        date: x.activityDate,
                        startTime: this.fixDateTime(x.activityDate, x.activity_Time.start_time),
                        endTime: this.fixDateTime(x.activityDate, x.activity_Time.end_Time),
                        duration: x.activity_Time.calculated_Duration,                                         
                        durationNumber: x.activity_Time.duration,
                        recipient: x.recipientLocation,
                        program: x.program.title,
                        activity: x.activity.name,
                        paytype: x.payType.paytype,                     
                        payquant: x.pay.quantity,
                        payrate: x.pay.pay_Rate,
                        billquant: x.bill.quantity,
                        billrate: x.bill.bill_Rate,
                        approved: x.approved,
                        billto: x.billedTo.accountNo,
                        notes: x.note,
                        selected: false,
                        serviceType: x.roster_Type,
                        recipientCode: x.recipient_staff.accountNo,
                        debtor: x.billedTo.accountNo,
                        serviceActivity: x.activity.name,
                        serviceSetting: x.recipientLocation,
                        analysisCode: x.anal,
                        type:x.type,
                        bill:x.bill,
                        pay:x.pay,
                        dayNo: x.dayNo,
                        monthNo: x.monthNo,
                        yearNo: x.yearNo

                    }
                   
                });
                
                console.log(this.timesheets);
            
            });
        
       // this.getComputedPay(data).subscribe(x => this.computeHoursAndPay(x));
     
        this.selectAll = false;
    }
    eventRender(e: any){
        e.el.querySelectorAll('.fc-title')[0].innerHTML = e.el.querySelectorAll('.fc-title')[0].innerText;
    }
    computeHoursAndPay(compute: any): void{
        var hourMinStr;

        if (compute.workedHours && compute.workedHours > 0) {
            const hours = Math.floor(compute.workedHours * 60 / 60);
            const minutes = ('0' + compute.workedHours * 60 % 60).slice(-2);

            hourMinStr = `${hours}:${minutes}`
        }

        var _temp = {
            KMAllowancesQty: compute.kmAllowancesQty || 0,
            AllowanceQty: compute.allowanceQty || 0,
            WorkedHours: compute.workedHours || 0,
            PaidAsHours: compute.paidAsHours || 0,
            PaidAsServices: compute.paidAsServices || 0,
            WorkedAttributableHours: compute.workedAttributableHours || 0,
            PaidQty: compute.paidQty || 0,
            PaidAmount: compute.paidAmount || 0,
            ProvidedHours: compute.providedHours || 0,
            BilledAsHours: compute.billedAsHours || 0,
            BilledAsServices: compute.billedAsServices || 0,
            BilledQty: compute.billedQty || 0,
            BilledAmount: compute.billedAmount || 0,
            HoursAndMinutes: hourMinStr
        };

        this.payTotal = _temp;
    }
    getComputedPay(data: any = this.selected): Observable<any>{
        return this.timeS.getcomputetimesheet({
            AccountName: data.data,
            IsCarerCode: this.viewType == 'Staff' ? true : false
        });
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
    searchRoster(date: any): void{

       if (this.startRoster==null){                 
            this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')
            this.endRoster =moment(this.date).endOf('month').format('YYYY/MM/DD')
            this.date= this.endRoster;
       }
       if(!this.recipient) return;
        
           this.ActiveCellText="";     
         
      this.staffS.getroster({
            RosterType: this.recipient.option == '1' ? 'PORTAL CLIENT' : 'SERVICE PROVIDER',            
            AccountNo: this.recipient.data,
            StartDate: this.startRoster,
            EndDate: this.endRoster
        }).pipe(takeUntil(this.unsubscribe)).subscribe(roster => {

            this.rosters = roster;
            console.log(roster)

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
                this.load_rosters();
                this.loading = false;

               
               
               // this.globalS.sToast('Roster Notifs',`There are ${(this.options.events).length} rosters found!`)
               
        });
    }

    next_date(){
        if (this.master){
            if (this.masterCycleNo>10 )
            this.masterCycleNo=1
            else
                    this.masterCycleNo=this.masterCycleNo+1;
            this.masterCycle = "CYCLE " + this.masterCycleNo

            this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')
            this.endRoster =moment(this.date).endOf('month').format('YYYY/MM/DD')

        }else if(this.Days_View==31 || this.Days_View==30){
            this.date = moment(this.date).add('month', 1);       
            this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')
            this.endRoster =moment(this.date).endOf('month').format('YYYY/MM/DD')
        }else{
             this.date = new Date (this.endRoster);             
             this.date = moment(this.date).add('day', 1);            
             this.startRoster  = moment(this.date).format('YYYY/MM/DD');
             this.date = moment(this.date).add('day', this.Days_View-1);
             this.endRoster = moment(this.date).format('YYYY/MM/DD');
             
           }

           this.prepare_Sheet();

         

        this.upORdown.next(true);
    }

    prev_date(){
        
            if (this.master){
               
                if (this.masterCycleNo<=1 )
                    this.masterCycleNo=1
                else
                    this.masterCycleNo=this.masterCycleNo-1;
                this.masterCycle = "CYCLE " + this.masterCycleNo


            } else if(this.Days_View==31 || this.Days_View==30){
                this.date = moment(this.date).subtract('month', 1);       
                this.startRoster =moment(this.date).startOf('month').format('YYYY/MM/DD')
                this.endRoster =moment(this.date).endOf('month').format('YYYY/MM/DD')
            }else{
                 this.date = new Date (this.startRoster);             
                 this.date = moment(this.date).subtract('day', 1);                             
                 this.endRoster  = moment(this.date).format('YYYY/MM/DD');
                 this.date = moment(this.date).subtract('day', this.Days_View-1);
                 this.startRoster = moment(this.date).format('YYYY/MM/DD');
                 
               }
               this.prepare_Sheet();

         
       // var calendar = this.calendarComponent.getApi(); 
       // calendar.prev();
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
            this.addTimesheetVisible=false;
            this.addBookingModel=false;
            this.ShowCentral_Location=false;
            this.testComp=false;
    }
    handleOk(){
        this.isConfirmLoading = true;
        setTimeout(() => {
          this.isVisible = false;
          this.isConfirmLoading = false;
        }, 1000);
    }

    AddMultiShiftRosters(){

        let rdate = format(this.date, 'yyyy/MM/dd');
        let time= format(this.defaultStartTime,'HH:mm')

       // this.current_roster= this.find_last_roster(rdate ,time)
        //console.log(lroster)

        this.clientCodes="-"
        this.setOfCheckedId.forEach(element => {
            this.clientCodes = this.clientCodes + "," + element;
        });  
        
        this.setOfCheckedId.clear();

        this.ProcessRoster("GroupShift",this.NRecordNo);

            
    }

    AddRecurrentRosters(){

        let sdate=this.recurrentStartDate.getFullYear() + '/' +  this.numStr(this.recurrentStartDate.getMonth()+1) +'/' + this.numStr(this.recurrentStartDate.getDate());
        let edate=this.recurrentEndDate.getFullYear() + '/' +  this.numStr(this.recurrentEndDate.getMonth()+1) +'/' + this.numStr(this.recurrentEndDate.getDate());

        let stime=  parseISO(new Date(this.recurrentStartTime).toISOString());
        let starttime =  format(stime,'HH:mm');

        //this.current_roster= this.find_last_roster(sdate ,starttime)
        let recordNo=this.NRecordNo
        //this.ProcessRoster("RecurrentRoster",this.current_roster.recordNo)      
       
        if (this.Frequency!="Monthly" || this.Pattern==null)
            this.Pattern="All";
        let inputs={            
            "recordNo": recordNo,
            "startDate" : sdate,
            "endDate":edate,
            "days":this.weekDay,
            "frequency":this.Frequency,
            "pattern" : this.Pattern
        }
        this.timeS.addRecurrentRosters(inputs).subscribe(data => {
        
              // this.globalS.sToast('Success', 'Recurrent Roater added successfully');
               this.searchRoster(sdate)
      
    });
}

    GETPROGRAMS(type: string): Observable<any> {
        let sql;
        if (!type) return EMPTY;
        //const { isMultipleRecipient } = this.bookingForm.value;
        if ( this.IsGroupShift ) {
       
            sql = `SELECT DISTINCT [Name] AS ProgName FROM HumanResourceTypes pr WHERE [group] = 'PROGRAMS' AND  (ISNULL(pr.CloseDate, '2000/01/01') < (select top 1 convert(varchar,PayPeriodEndDate,111) as PayPeriodEndDate from SysTable)) AND (EndDate Is Null OR EndDate >= '${this.currentDate}')  ORDER BY [ProgName]`;
       
        }else if ( this.IsGroupShift || type =='!INTERNAL' || type === 'ADMINISTRATION' || type === 'ALLOWANCE NON-CHARGEABLE' || type === 'ITEM' || (type == 'SERVICE')) {
            sql = `SELECT Distinct [Name] AS ProgName FROM HumanResourceTypes WHERE [group] = 'PROGRAMS' AND ISNULL(UserYesNo3,0) = 0 AND (EndDate Is Null OR EndDate >=  '${this.currentDate}') ORDER BY [ProgName]`;
       
        }else {
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
        const { recipientCode, debtor, serviceType } = this.bookingForm.value;
        if(view == 0){
            if(serviceType == 'SERVICE') return '!MULTIPLE';
            if(this.globalS.isEmpty(recipientCode)) return '!INTERNAL';
            return recipientCode;
        }

        if(view == 1){
            return debtor;
        }
    }
  

    GET_ADDRESS(): Observable<any> {
        let sql;            
       
            sql = `SELECT CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END + CASE WHEN Address2 <> '' THEN Address2 + ''  ELSE '' END + CASE WHEN Suburb <> '' THEN ', ' + Suburb ELSE '' END AS Address, GoogleAddress 
            FROM NamesAndAddresses WHERE  Description = 'DESTINATION'`
            
        if (!sql) return EMPTY;
        return this.listS.getlist(sql);
    }
    GET_MOBILITY(): Observable<any> {
        let sql;            
       
            sql = `select Description from datadomains where Domain like 'Mobility' and [DeletedRecord]=0`
            
        if (!sql) return EMPTY;
        return this.listS.getlist(sql);
    }

    GetDayMask(b_SDay:boolean, s_EarliestDate:string, s_Staff:string)
    {
        let dCtr:number
        let s_Date:string
        let b_PublicHoliday : boolean
        let s_PubHolState:string
        let s_PubHolRegion:string;
        let s_PubHolFilter:string;
        let s_Weekday:string;
        let ip : Array<string>;
        
        let s_FilterMask:string
        let DayNo:number;
        let Yearno:number;
        let MonthNo:number;
     //for (i% = 0 i<=7; i++)
         //ip[i%] = "0";
         var sels = this.spreadsheet.getSelections();
         var sel = sels[0];
         var row = sel.row;
         
         for (let i=sel.col; i<(sel.col+sels[0].colCount); i++)
        {
            DayNo=i;                        
            MonthNo = parseInt(format(this.date, 'M')),
            Yearno = parseInt(format(this.date, 'yyyy')),

       // If NullToStr(s_EarliestDate) = "" Then s_EarliestDate = Format$(Yearno & "/" & Monthno & "/" & IIf(b_SDay, DayNo, dCtr), "yyyy/mm/dd")
         s_Date = Yearno + "/" + MonthNo + "/" + DayNo;
         s_Date=format(this.date, 'yyyy/MM/dd'),
         b_PublicHoliday = false;//this.IsPublicHoliday1(s_Date, s_Staff)
         if (b_PublicHoliday)
             ip[7] = "1"
         else {           
            s_Weekday = this.GetWeekday(s_Date);
            switch (s_Date)
            {        
             case "MONDAY": 
                ip[0] = "1" 
                break;
             case "TUESDAY": 
                ip[1] = "1" 
                break;
             case "WEDNESDAY": 
                ip[2] = "1"
                break;
             case "THURSDAY": 
                ip[3] = "1"
                break;
             case "FRIDAY": 
                ip[4] = "1"
                break;
             case "SATURDAY": 
                ip[5] = "1";
                break;
             case "SUNDAY": 
                ip[6] = "1";
                break;
            }
        
         for( i = 0; i<7; i++)
         ;
            // GetDayMask = GetDayMask + ip[i%];
        }       
    }
    
}

GetWeekday(date:string) : string {

    let dt= new Date(date);
   // return  this.DayOfWeek(dt.toLocaleDateString('en-US', { weekday: 'long' }));
   return  dt.toLocaleDateString('en-US', { weekday: 'long' });

}

GETSERVICEACTIVITY(program: any): Observable<any> {

//    const { serviceType, date, time } = this.bookingForm.value;
    let serviceType=this.serviceType;
    var { recipientCode }  = this.bookingForm.value;
    if (recipientCode=='' && this.viewType=='Recipient')
        recipientCode= this.selected.data;
    this.recipientCode=recipientCode;

    var _date = this.date;
    if (!program) return EMPTY;
    

    if (serviceType != 'ADMINISTRATION' && serviceType != 'ALLOWANCE NON-CHARGEABLE' && serviceType != 'ITEM'  && serviceType != 'SERVICE') {

        if(typeof _date === 'string'){
            _date = parseISO(_date);
        }

       // return this.listS.getserviceactivityall({
           return this.timeS.getActivities({            
            recipient: recipientCode,
            program:program,  
            forceAll: "0", //recipientCode=='!MULTIPLE' || recipientCode=='!INTERNAL' ? "1" : "0",   
            mainGroup: this.IsGroupShift ? this.GroupShiftCategory : 'ALL',
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
        const { recipientCode }  = this.bookingForm.value;

        if (recipientCode!="" && recipientCode!=null){
            this.FetchCode=recipientCode;
          }
        let sql ="";
         if (!program) return EMPTY;
    
        // console.log(this.rosterForm.value)

    //     var durationObject = (this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime));        
    
    //    let s_DayMask:string;
    //    let s_DayTimeSQL:string="";
    //    let s_Duration:number;
      
    //    s_Duration=durationObject.duration;
    //     if (this.EnforceActivityLimits == true)
    //     {
    //         if ((s_DayMask) != "" && s_DayMask != "00000000")
    //         {
    //             if (s_DayMask.slice(0, 1) == "1")
    //                 s_DayTimeSQL = "IsNull(ITM.NoMonday, 0) = 0";
    //             if (s_DayMask.slice(1, 1) == "1")
    //                 s_DayTimeSQL = s_DayTimeSQL == ""? "IsNull(ITM.NoTuesday, 0) = 0": s_DayTimeSQL + " AND IsNull(ITM.NoTuesday, 0) = 0";
    //             if (s_DayMask.slice(2, 1) == "1")
    //                 s_DayTimeSQL = s_DayTimeSQL == ""? "IsNull(ITM.NoWednesday, 0) = 0": s_DayTimeSQL + " AND IsNull(ITM.NoWednesday, 0) = 0";
    //             if (s_DayMask.slice(3, 1) == "1")
    //                 s_DayTimeSQL = s_DayTimeSQL == ""? "IsNull(ITM.NoThursday, 0) = 0" : s_DayTimeSQL + " AND IsNull(ITM.NoThursday, 0) = 0";
    //             if (s_DayMask.slice(4, 1) == "1")
    //                 s_DayTimeSQL = s_DayTimeSQL == "" ? "IsNull(ITM.NoFriday, 0) = 0": s_DayTimeSQL + " AND IsNull(ITM.NoFriday, 0) = 0";
    //             if (s_DayMask.slice(5, 1) == "1")
    //                 s_DayTimeSQL = s_DayTimeSQL == ""? "IsNull(ITM.NoSaturday, 0) = 0": s_DayTimeSQL + " AND IsNull(ITM.NoSaturday, 0) = 0";
    //             if (s_DayMask.slice(6, 1) == "1")
    //                 s_DayTimeSQL = s_DayTimeSQL == "" ? "IsNull(ITM.NoSunday, 0) = 0": s_DayTimeSQL + " AND IsNull(ITM.NoSunday, 0) = 0";
    //                 if (s_DayMask.slice(7, 1) == "1")
    //                 s_DayTimeSQL = s_DayTimeSQL == "" ? "IsNull(ITM.NoPubHol, 0) = 0" : s_DayTimeSQL + " AND IsNull(ITM.NoPubHol, 0) = 0";
    //             if (s_DayTimeSQL != "")
    //                 s_DayTimeSQL = " AND (" + s_DayTimeSQL + ")";
    //         }
    
    //         s_DayTimeSQL = s_DayTimeSQL + " AND (" + "(ISNULL(ITM.MinDurtn, 0) = 0 AND ISNULL(ITM.MAXDurtn, 0) = 0) OR (ISNULL(ITM.MinDurtn, " + s_Duration + ") <= " + s_Duration + " AND IsNull(ITM.MaxDurtn, " + s_Duration + ") >= " + s_Duration + "))";
    
    //     }
    
    
        
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

    }else if (serviceType == 'ADMISSION' || serviceType =='ALLOWANCE NON-CHARGEABLE' || serviceType == 'ITEM'  || serviceType == 'SERVICE') {
            // const { recipientCode, debtor } = this.rosterForm.value;
            sql =`  SELECT DISTINCT [Service Type] AS Activity,I.RosterGroup,
            (CASE WHEN ISNULL(SO.ForceSpecialPrice,0) = 0 THEN
            (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
             WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
             WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
             WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5
             WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
            ELSE I.Amount END)
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,I.unit as UnitType,
            (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
            HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
            FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
            INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
            WHERE SO.ServiceProgram = '${ program}' 
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
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,I.unit as UnitType,
            (select case when UseAwards=1 then 'AWARD' ELSE '' END from registration) as Service_Description,
            HACCType,c.AgencyDefinedGroup as Anal,(select top 1 convert(varchar,convert(datetime,PayPeriodEndDate),111) as PayPeriodEndDate from SysTable) as date_Timesheet
            FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            INNER JOIN Recipients C ON C.AccountNO = '${this.FetchCode}'
            INNER JOIN ItemTypes I ON I.Title = SO.[Service Type]
            WHERE SO.ServiceProgram = '${program}'
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
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,I.unit as UnitType,
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
                I.AMOUNT AS BILLRATE,
                isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate, 0 as GST,I.unit as UnitType,
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
        I.AMOUNT AS BILLRATE,
        isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,0 as GST,I.unit as UnitType,
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
            ELSE SO.[UNIT BILL RATE] END ) AS BILLRATE,
            isnull([Unit Pay Rate],0) as payrate,isnull(TaxRate,0) as TaxRate,hrt.GST,I.unit as UnitType,
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

    GETSERVICEGROUP(): Observable<any>{
        
        if (this.booking_case==8)
            return this.listS.getlist(`SELECT DISTINCT [Name] as Description FROM CSTDAOutlets WHERE [Name] Is NOT Null  AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY [Name]`);
        else if (this.IsGroupShift){
            if (this.GroupShiftCategory=="TRANSPORT" )
                return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'VEHICLES' AND Description Is NOT Null  AND (EndDate Is Null OR EndDate >= (select top 1 PayPeriodEndDate from systable)) ORDER BY DESCRIPTION`);
            else if (this.GroupShiftCategory=="GROUPBASED" || this.GroupShiftCategory=='GROUPACTIVITY')            
                return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'ACTIVITYGROUPS' AND Description Is NOT Null  AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY DESCRIPTION`);
            else
                return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'ACTIVITYGROUPS' AND Description Is NOT Null AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY DESCRIPTION`);
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

    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);



   // dateFormat: string = 'dd/MM/yyyy'
    checked = false;    
    indeterminate = false;
    
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

    agencyDefinedGroup: string;    

    current = 0;
    nextDisabled: boolean = false;
    programsList: Array<any> = [];
    serviceActivityList: Array<any>;
    payTypeList: Array<any> = [];
    analysisCodeList: Array<any> = [];
    programActivityList:Array<any>=[];
    ServiceGroups_list:Array<any>=[];
    groupShiftList:Array<any>=["CENTREBASED","GROUPACTIVITY","TRANSPORT"];
    RecipientList:Array<any>=[];

    serviceSetting:string;
    date_Timesheet:any;
    clearLowerLevelInputs() {

        this.bookingForm.patchValue({
            recipientCode: null,
            debtor: null,
            program: null,
            serviceActivity: null,
            analysisCode: null,
            time: {
                startTime: '',
                endTime: '',
            },
            pay: {
                pay_Unit: 'HOUR',
                pay_Rate: '0',
                quantity: '1',
                position: ''
            },
            bill: {
                pay_Unit: 'HOUR',
                bill_Rate: '0',
                quantity: '1',
                tax: '0'
            },
        });
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
    buildForm() {

     //--------------------------an other booking form-------------------------------- 
        this.bookingForm = this.formBuilder.group({
            recordNo: [''],
            date: [this.payPeriodEndDate, Validators.required],
            serviceType: ['', Validators.required],
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
                bill_Rate: ['0.0'],
                quantity: ['1'],
                tax: '1.0'
            }),
            central_Location:false
            
        });
        
      
this.bookingForm.get('program').valueChanges.pipe(
            distinctUntilChanged(),
            switchMap(x => {
                if(!x) return EMPTY;
                this.serviceActivityList = [];
                this.bookingForm.patchValue({
                    serviceActivity: null
                });
                return   this.GETSERVICEACTIVITY(x);                
                                        
                
            })
        ).subscribe((d: Array<any>) => {

            this.serviceActivityList = d;//d.map(x => x.activity);
          
           
                setTimeout(() => {
                    this.bookingForm.patchValue({
                        serviceActivity: this.defaultActivity                     
                        
                    });
                    //this.next_tab();
                   
                }, 0);
            
           
            if(d && d.length == 1){
                this.bookingForm.patchValue({
                    serviceActivity: d[0]               
                   
                });
               
                
            }
        });
     

    this.bookingForm.get('serviceActivity').valueChanges.pipe(
        distinctUntilChanged(),     

        switchMap(x => {
            if (!x) {
                this.rosterGroup = '';
                return EMPTY;
            };
            this.selectedActivity=x;

            return forkJoin(                
                this.GETROSTERGROUP(x.activity), 
                this.GETPAYTYPE(x.activity),
                this.GETANALYSISCODE(),
                this.GETSERVICEGROUP()                                  
                )
            
        })
    ).subscribe(d => {
        
        //console.log(d);
        //if (d.length > 1 || d.length == 0) return false;
        let lst =d[0];
        this.rosterGroup = this.selectedActivity.rosterGroup// ( lst[0].rosterGroup);
        this.GET_ACTIVITY_VALUE((this.rosterGroup).trim());
        this.payTypeList = d[1];
        this.analysisCodeList = d[2];
        this.analysisCodeList = d[2];
        if (this.activity_value==12 || this.booking_case==8 || this.IsGroupShift){
            this.ServiceGroups_list = d[3].map(x => x.description);;
        }  
        this.date_Timesheet=this.selectedActivity.date_Timesheet;

        this.bookingForm.patchValue({
           
            bill:{
            pay_Unit: this.selectedActivity.unitType,
            bill_Rate: this.selectedActivity.billrate,            
            tax: this.selectedActivity.taxrate,
            
            },
            pay:{
                pay_Unit: this.selectedActivity.unitType,
                pay_Rate: this.selectedActivity.payrate,
                tax: this.selectedActivity.taxrate
            },
            haccType: this.selectedActivity.haccType,
            analysisCode: this.selectedActivity.anal,
            
        })
      
       if (this.booking_case==8){
           this.IsClientCancellation=true;
       }
    }); 
   
    this.TransportForm=this.formBuilder.group({
        
        pickupFrom : [''],
        pickupTo : [''],
        zipCodeFrom: [''],
        zipCodeTo: [''],
        appmtTime: [''],
        mobility: [''],
        returnVehicle: [''],
        jobPriority: [''],
        transportNote: ['']
    });

    this.RecurrentServiceForm=this.formBuilder.group({
        
        startDate : [''],
        endDate : ['']
        
    });

   
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

    
    isEndSteps() {
        if (this.rosterGroup === 'ALLOWANCE') {
            return this.current >= 3;
        }
        else {
            return this.current >= 3;
        }
    }

    defaultOpenValue = new Date(0, 0, 0, 9, 0, 0);

    resetBookingFormModal() {
        this.current = 0;
        this.rosterGroup = '';
        this.selectedCarer="";
        this.defaultProgram="";
        this.defaultActivity="";
        this.defaultStartTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
        this.defaultEndTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);        
        this.IsClientCancellation=false;
        
        this.bookingForm.reset({
            date: this.payPeriodEndDate,
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
                pay_Rate: '0',
                quantity: '1',
                position: ''
            }),
            bill: this.formBuilder.group({
                pay_Unit: 'HOUR',
                bill_Rate: 0,
                quantity: '1',
                tax: '1'
            }),
        });

           }
    pre_roster(): void {
        this.current -= 1;
    }

    next_roster(): void {
        this.current += 1;

        if(this.current == 1 && this.selected.option == 1){
            this.rosterForm.patchValue({
                debtor: this.selected.data
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

    onItemChange(item){
        this.weekDay=item;
    }

   pre_tab(): void {
        this.current -= 1;
        if (this.viewType=="Staff" && this.current == 3 ){
            this.current -= 1;
        }
        if(this.current == 2 && !(this.activity_value==12 || this.ShowCentral_Location)){
            this.current -= 1;
        }
        if (this.current==3 && this.viewType=='Recipient' && this.serviceType=='BOOKED')
        this.current -= 1;
    }

    next_tab(): void {
        this.current += 1;
       
      
        if (this.current==1 && this.serviceActivityList.length<1 ){
            this.globalS.eToast('Error', 'There are no approved services linked to selectd program');
            this.current -= 1;
            //  this.timeS.getActivities({            
            //     recipient: this.recipientCode,
            //     program:this.defaultProgram,  
            //     forceAll:"1",   
            //     mainGroup: 'ALL',
            //     subGroup: '-',           
            //     viewType: this.viewType,
            //     AllowedDays: "0",
            //     duration: this.durationObject?.duration            
            // }).subscribe(data=>{
                
            //     this.serviceActivityList = data;
            // });
            return;
        }
        if (this.current==1 && this.serviceActivityList.length==1){
           
            if (this.showDone2){
                this.doneBooking();
                return;
            }
              
            if (!this.ShowCentral_Location)
                this.current+=2;
                
        }

        
        if(this.current == 2 && !this.IsGroupShift && !(this.activity_value==12 || this.ShowCentral_Location)){
            this.current += 1;
        }
        //console.log(this.current + ", " + this.ShowCentral_Location +", " + this.viewType + ", " + this.IsGroupShift )
                
        
        if (this.viewType=="Staff" && this.current == 3 ){
     
            this.current += 1;
          
        }
       
        if (this.current==3 && this.viewType=='Recipient' && this.serviceType=='BOOKED')
            this.current += 1;
      
       
    }
    
    
    
    DEFAULT_NUMERIC(data: any): number{
        if(!this.globalS.isEmpty(data) && !isNaN(data)){
            return data;
        }
        return 0;
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

    get showDone2(){

            if (this.current>=4)
                return true;
            
            if (this.selectedActivity!=null){
                if (this.selectedActivity.service_Description == '' || this.selectedActivity.service_Description==null)
                    return false;
            }

            if ((this.current <3 && this.viewType=="Staff") && (this.IsGroupShift ))
                return false;            
            else if ((this.current >=1 && this.viewType=="Staff") && (this.activity_value!=12 || !this.ShowCentral_Location ))
                return true;
            else if  (this.current >=1 && (this.booking_case==1 || this.booking_case==5 ))
                return true;  
            else if  (this.current >=1 && (!this.ShowCentral_Location && this.booking_case==8))
                return true;  
            else if  (this.current ==2 && (this.ShowCentral_Location && this.booking_case==8))
                return true;                                    
            else if ((this.current >=3 ) ) //&& this.viewType=="Recipient"
                return true;
            else
                return false;
    }
    get isFormValid(){
        return  this.rosterForm.valid;
    }
 isBookingValid(input:any):boolean{
        //return this.bookingForm.valid;
        if (
            input.billQty==null ||
            input.billTo ==null ||
            input.billUnit==null || 
            input.blockNo ==null ||
            input.carerCode==null ||
            input.clientCode==null ||
            input.costQty==null ||
            input.costUnit==null ||
            input.date==null ||
            input.dayno ==null ||
            input.duration ==null ||
            input.monthNo ==null ||
            input.program ==null ||
            input.serviceDescription == null ||
            input.serviceSetting == null ||
            input.serviceType  == null ||
            input.paytype  == null ||
            input.anal  == null ||            
            input.startTime  == null ||
            input.taxPercent  == null ||
            input.type  == null ||
            input.unitBillRate  == null ||
            input.unitPayRate  == null ||
            input.yearNo  == null ||
            input.creator  == null            
        )
         return false;
        else
         return true;
    }
   

    generate_alert(){
        this.show_alert=false;
        this.notes= this.txtAlertSubject + "\n" + this.txtAlertMessage;
        
        this.ProcessRoster("Alert","1");
    }
    FIX_CLIENTCODE_INPUT(tgroup: any): string{
        if (tgroup.serviceType == 'ADMINISTRATION' || tgroup.serviceType == 'ALLOWANCE NON-CHARGEABLE' || tgroup.serviceType == 'ITEM') {
            return "!INTERNAL"
        }

        if (tgroup.serviceType == 'SERVICE' || tgroup.serviceType == 'TRAVEL TIME') {
            if (tgroup.isMultipleRecipient) {
                return "!MULTIPLE"
            }
            return tgroup.recipientCode;            
        }

        return tgroup.recipientCode;
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

    ngModelChangeStart(event): void{
        this.rosterForm.patchValue({
            time: {
                startTime: event
            }
        })
    }

    ngModelChangeEnd(event): void {
        this.rosterForm.patchValue({
            time: {
                endTime: event
            }
        })
    }
   

     // Add Timesheet
     confirm(index: number) {
        if (!this.selected && this.timesheets.length > 0) return;

        if (index == 1) {
           // this.resetAddTimesheetModal();
            this.addTimesheetVisible = true;
            this.whatProcess = PROCESS.ADD
        }
    }
        
       
    GET_GROUP_RECIPIENTS(): Observable<any>{
        
        let sql =`SELECT DISTINCT [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[Surname/Organisation], [Recipients].[FirstName], [Recipients].[DateOfBirth], [Recipients].[pSuburb]  
                    FROM Recipients INNER JOIN ServiceOverview ON Recipients.UniqueID = ServiceOverview.Personid
                    WHERE ServiceOverview.[Service Type] = '${this.defaultActivity.activity}' AND ServiceOverview.ServiceStatus = 'ACTIVE'
                    AND  AccountNo not in  ('!INTERNAL','!MULTIPLE') AND admissiondate is not null AND (DischargeDate is null)  
                    AND NOT EXISTS (SELECT * FROM  ROSTER 
                     WHERE Date = '${this.date}' AND [Start Time] = '${this.defaultStartTime}' AND ServiceSetting = '${this.serviceSetting}' 
                    AND Roster.[Client Code] = Recipients.AccountNo ) 
                    ORDER BY AccountNo`;
        

           // console.log(sql);
        return this.listS.getlist(sql);
}      

cancelRecipientExternal(value:any){
    this.recipientexternal=value.recipientexternal;
 }
 cancelStaffExternal(value:any){
    this.staffexternal=value.staffexternal;
 }
 

shiftChanged(value:any){
   if (this.viewType=='Staff' && value.show_alert){
        this.txtAlertSubject= 'SHIFT DAY/TIME CHANGE : ';
        this.txtAlertMessage= 'SHIFT TIME CHANGE : \n Date: ' + format(value.date,'dd/MM/yyyy') + '  \n Recipient: ' + value.clientCode + '\n'  ,
        this.clientCodes=value.clientCode;      
      
        this.show_alert=true;
    }
    this.searchRoster(value.date)
}




}



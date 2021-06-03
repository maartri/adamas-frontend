import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit,ChangeDetectorRef,ElementRef } from '@angular/core'
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
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


interface AddTimesheetModalInterface {
    index: number,
    name: string
}
interface UserView{
    staffRecordView: string,
    staff: number
}
const license = "E427689893651433#B0ASSrpndudjTsh4V8U7UwM6LzVTb9UkZNZkZtVXc7oVT8QVWRFmV6NFa4EDOqx6bjFlT6pXSj9We73CVOBXRY54akZ7d8dFezsWWCVnYiNWZFNGTRZHMqdzKyVlT6hTOxU4VuhWYv9EW8hHSipUS8kGa9VkQ5JWRoJGVzQmN8sCZtpWT5UlavcWN9ZXeVNzNUtEbxIGZ8tSdqtCaJtkUOdzUDFUMCxkVD94R4llMBl6dV96SxIGayNGVzQlQVdXRxt6b5sCcQhzLZBFTzgXZrpXaiNUU656LGhlb8hEZDZjREZEM8ETQvpVNRNlbwkGViojITJCLikjN6YDR7UUNiojIIJCL7kTOwMDOzYjM0IicfJye&Qf35VfiUURJZlI0IyQiwiI4EjL6BCITpEIkFWZyB7UiojIOJyebpjIkJHUiwiIxQTOwMDMgYDM5ATMyAjMiojI4J7QiwiI5AjNwEjMwIjI0ICc8VkIsIych5WYkFkI0ISYONkIsUWdyRnOiwmdFJCLiMzM4ETN6MTO8kDO6cjM4IiOiQWSiwSfdtlOicGbmJCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TP7V6RGBzZ8t4cSplZUhTashjVuJ5L0JUUPhXRzFUMvonUzAHciJTapZ5a54EdxpXNEVkejBFZrFWdpZUaXFVNJRnZ92UTzJjUP5mWL5GeqJlailHMENmSV5kM7N5YzZFN7JjQxB3f1";


function IconCellType(img) {
    this.typeName = "IconCellType";
    this.img = img;
}

IconCellType.prototype = new GC.Spread.Sheets.CellTypes.Base();
// EllipsisTextCellType.prototype
IconCellType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {            
    if (!ctx) {
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
    ctx.drawImage(this.img, x, y , 20, 20);
    ctx.fill();
    ctx.stroke();
    

    ctx.restore();
};
@Component({
    styles: [`
      
        nz-switch.master-class >>> button.ant-switch-checked{ background-color:red; }; 
        
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
   
    

timesheets: Array<any> = [];
timesheetsGroup: Array<any> = [];   
defaultProgram: any = null;
defaultActivity: any = null;
defaultCategory: any = null;
Timesheet_label:any="Add Timesheet";
payTotal:any;
masterCycle:string="CYCLE 1";
 Days_View:number=31;
    data:any=[];  
    ActiveCellText:any;
  //rosters:any=[];
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
  bodyText:string;
  recipientDetailsModal:boolean=false;
  operation:string="";
  columnWidth = 100;
  i:number=0;
  eventLog: string;
  token:any;
  addBookingModel:boolean=false;
  type_to_add:number;
  select_StaffModal:boolean;
  select_RecipientModal:boolean;
  
  include_fee:boolean=false;
  include_item:boolean=false;

  time_slot:number=288;

    isVisible: boolean = false;
    hahays = new Subject<any>();
    optionsModal:boolean=false;
    
    enable_buttons :boolean=false;
    
    private picked$: Subscription;   

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
    viewType: any;
    start_date:string="";
    end_date:string=""
    ForceAll:Boolean=true;
    subGroup:String="";
    RosterDate:String="";
    StartTime:String="";
    EndTime:String=""
    Duration:String="5";
    val1:boolean=false;
    val2:boolean=false;
    val3:boolean=true;
    val4:boolean=false;
    master:boolean=false;
    tval1:boolean=true;
    dval1:boolean=true;
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

    add_UnAllocated:boolean=false;

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

doneBooking(){

    this.addBookingModel=false;
    this.add_UnAllocated=false;
    this.serviceType=this.type_to_add;

    //this.fixStartTimeDefault();
        let date=this.date;
        let time = {startTime:this.defaultStartTime, endTime:this.defaultEndTime, duration:0};
        const bForm =  this.bookingForm.value;
        const tsheet:any = {
            date: date,
            time : time,
            analysisCode:'',
            bill:{rate:0,quantity:"0", unit:"0", tax:0},
            pay:{rate:0,quantity:"0", unit:"0"},
            haccType:"",
            program:bForm.program,
            serviceActivity:bForm.serviceActivity,
            payType:'N/A',
            serviceDscr:'N/A',
            serviceType:this.serviceType,
            recordNo:0,
            staffCode:'BOOKED'

        }
        let clientCode = this.recipient.data;

        var durationObject = (this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime));
        
        
        if(typeof this.date === 'string'){
            this.date = parseISO(this.datepipe.transform(this.date, 'yyyy-MM-dd'));
        }
        let inputs = {
            anal: tsheet.analysisCode || "",
            billQty: tsheet.bill.quantity || 0,
            billTo: clientCode,
            billUnit: tsheet.bill.unit || 0,
            blockNo: durationObject.blockNo,
            carerCode: this.selected.option == 0 ? this.selected.data : tsheet.staffCode,
            clientCode: this.selected.option == 0 ? clientCode : this.selected.data,
            costQty: tsheet.pay.quantity || 0,
            costUnit: tsheet.pay.unit || 0,
            date: format(tsheet.date,'yyyy/MM/dd'),
            dayno: parseInt(format(tsheet.date, 'd')),
            duration: durationObject.duration,
            groupActivity: false,
            haccType: tsheet.haccType || "",
            monthNo: parseInt(format(tsheet.date, 'M')),
            program: tsheet.program,
            serviceDescription:  tsheet.serviceDscr || "",
            serviceSetting: null || "",
            serviceType: tsheet.serviceActivity || "",
            paytype: tsheet.payType,
            // serviceType: this.DETERMINE_SERVICE_TYPE_NUMBER(tsheet.serviceType),
            staffPosition: null || "",
            startTime: format(tsheet.time.startTime,'HH:mm'),
            status: "1",
            taxPercent: tsheet.bill.tax || 0,
            transferred: 0,
            // type: this.activity_value,
            type: this.DETERMINE_SERVICE_TYPE_NUMBER(this.serviceType),
            unitBillRate:( tsheet.bill.rate || 0),
            unitPayRate: tsheet.pay.rate || 0,
            yearNo: parseInt(format(tsheet.date, 'yyyy')),
            serviceTypePortal: tsheet.serviceType,
            recordNo: tsheet.recordNo
        };
        
      

            this.timeS.posttimesheet(inputs).subscribe(data => {
                this.globalS.sToast('Success', 'Roster has been added');
                this.addTimesheetVisible = false;
               // this.picked(this.selected);
               this.searchRoster(tsheet.date)
            });
        
       
    

    
}

start_adding_Booking(type:any){
    if (this.viewType=="Staff")
        this.select_RecipientModal=true;
    else
        this.select_StaffModal=true;
    
}

addBooking(type:any){
    
    
    this.select_StaffModal=false;
    this.select_RecipientModal=false;
    
    this.type_to_add=type;
    this.addBookingModel=true;
    this.add_UnAllocated=true;    
    this.Timesheet_label = "Add Timesheet " 
    //this.whatProcess = PROCESS.ADD;
   // this.addTimesheetVisible = true;
   // this.resetAddTimesheetModal();
   // this.AddViewRosterDetails.next(2);
    let sheet = this.spreadsheet.getActiveSheet();
    var range=sheet.getSelections();
    // console.log(range)
    let dt= new Date(this.date);
    //let dt = moment.utc(this.date).local();
    let date = dt.getFullYear() + "-" + this.numStr(dt.getMonth()+1) + "-" + this.numStr(range[0].col+1);
    let f_row= range[0].row;
    let l_row=f_row+range[0].rowCount;
    let startTime=sheet.getTag(f_row,0,GC.Spread.Sheets.SheetArea.viewport);

    let endTime =sheet.getTag(l_row,0,GC.Spread.Sheets.SheetArea.viewport);

    this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
    this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());
    this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
    this.current = 0;
    this.date = parseISO(this.datepipe.transform(date, 'yyyy-MM-dd'));
   // this.bookingForm.patchValue({date:date})

    //this.date = parseISO(new Date(date).toISOString());
                            
        this.GETPROGRAMS( this.recipient.data).subscribe(d => {
        this.programActivityList=d;
        this.programsList = d.map(x => x.progName);
        this.serviceActivityList = d.map(x => x.serviceType);

    });
    if (this.programActivityList==null || this.programActivityList.length==0){
        this.addBookingModel=false;
        this.globalS.sToast('Booking', 'No Program setting found to proceed');
    }

//     let sql ="SELECT DISTINCT [Program] AS ProgName FROM RecipientPrograms INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID INNER JOIN HumanResourceTypes pr ON RecipientPrograms.Program = pr.name WHERE Recipients.AccountNo = '" + this.recipient.data +"' AND  (ISNULL(pr.CloseDate, '2000/01/01') < '2021/05/05') AND RecipientPrograms.ProgramStatus IN ('ACTIVE', 'WAITING LIST') ORDER BY [ProgName]"
//     this.listS.getlist (sql).subscribe(data=>{
//         this.serviceActivityList=data;
//    });
    
}
SaveAdditionalInfo(notes:string){
    this.notes=notes;
    if (this.cell_value==null || this.cell_value.recordNo==0) return;
    this.ProcessRoster("Additional", this.cell_value.recordNo);
   
}
deleteRoster(){
    if (this.cell_value==null || this.cell_value.recordNo==0) return;
    this.ProcessRoster("Delete",this.cell_value.recordNo);

    let sheet=this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
    this.remove_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration)
    this.operation="Delete";                 
    this.spreadsheet.resumePaint();
    this.deleteRosterModal=false;
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
    
     cell= sheet.getRange(0, 0, this.time_slot, 30, GC.Spread.Sheets.SheetArea.viewport)
    
      
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
    
          
    let row=-1, col=-1;
    if (this.rosters==null) {
        this.spreadsheet.resumePaint();
        return;
    }
    var text,code;
    for(var r of this.rosters){
            
        if (r.dayNo>this.Days_View) break;

            if (r.recordNo==246364 || r.shiftbookNo==246364){
                code= r.carerCode 
            }
            col=r.dayNo-1;
            row = this.getrow(r.start_Time);//self.time_map.get(r.Start_Time); //
            if (this.viewType=="Staff")
                code= r.clientCode ;
            else
                code= r.carerCode 
            
            if (code=="!MULTIPLE")
                    code="GROUP SHIFT";
            if (code=="!INTERNAL")
                    code="ADMIN SHIFT";
                
                text=  r.start_Time + "-" + r.end_Time + " " + code + " (" + r.serviceType + ")";

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
        
      }else{
        
        this.date = moment()
       
    }
  
    this.searchRoster(this.date);
     
    var divMaster = document.getElementById("divMaster");    
   // divMaster.style.backgroundColor= this.bgcolor;
    
  }
  spreadsheet:any;
  //MainSpread:any=GC.Spread;
    workbookInit(args) {  
      let spread = args.spread;
     // this.MainSpread=args.spread;
      this.spreadsheet = GC.Spread.Sheets.Workbook = args.spread;  
      spread= GC.Spread.Sheets.Workbook = args.spread;  
      let sheet = spread.getActiveSheet();  

     
      //sheet.getCell(0, 0).text("Fruits wallet").foreColor("blue"); 
      spread.options.columnResizeMode = GC.Spread.Sheets.ResizeMode.split;
      spread.options.rowResizeMode = GC.Spread.Sheets.ResizeMode.split;
     // spread.options.setColumnResizable(0,true, GC.Spread.Sheets.SheetArea.colHeader);
    //  spread.options.resizeZeroIndicator = GC.Spread.Sheets.SheetArea.Enhanced

      sheet.setRowCount(this.time_slot, GC.Spread.Sheets.SheetArea.viewport);
      sheet.setColumnCount(31,GC.Spread.Sheets.SheetArea.viewport);

          spread.suspendPaint();
          let spreadNS = GC.Spread.Sheets;
          let self = this;
        
          
  
          spread.bind(spreadNS.Events.CellClick, function (e: any, args: any) {
            let row,col, duration=0,type=0,service;
            spread.suspendPaint();
              let sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
              self.eventLog =
                  'SpreadEvent: ' + GC.Spread.Sheets.Events.CellClick + ' event called' + '\n' +
                  'sheetArea: ' + sheetArea + '\n' +
                  'row: ' + args.row + '\n' +
                  'col: ' + args.col;
                  var menuData = spread.contextMenu.menuData;
                  console.log(menuData);
                  
                  //Clear Previous selection
                  if (self.prev_cell.duration==null || self.prev_cell.duration==0)
                  self.prev_cell.duration=1;

                  self.ActiveCellText="";
                  sheet.getRange(self.prev_cell.row, self.prev_cell.col, self.prev_cell.duration, 1, GC.Spread.Sheets.SheetArea.viewport).setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
  
                  row=args.row;
                  col=args.col;
                  if (sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)!=null) {
                  self.cell_value=sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)
                 
                  row=self.cell_value.row
                  col=self.cell_value.col
                  duration=Number(self.cell_value.duration)
                  type=self.cell_value.type;
                  service=self.cell_value.service;
                 
                  if (service!=null)
                    self.ActiveCellText=self.cell_value.recordNo + " - " + service 
                  } 
                

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

                  let len =row+new_duration;
                   // Set border lines to cell(1,1).
                   for (let i=row; i<len; i++){
                  var cell = sheet.getCell(i, col, GC.Spread.Sheets.SheetArea.viewport);
                      cell.borderLeft(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));
                      cell.borderRight(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));
                      if (i==row)
                      cell.borderTop(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));
                      if (i==len-1)
                      cell.borderBottom(new GC.Spread.Sheets.LineBorder("Blue", GC.Spread.Sheets.LineStyle.thick));
  
  
                  }
  
                  self.prev_cell = {row,col,duration, type,service};

                  spread.resumePaint();
          });
          spread.bind(GC.Spread.Sheets.Events.CellDoubleClick, function (sender, args) {
            console.log("Double clicked column index: " + args.row + ", " + args.col);
            //console.log("Double clicked row index: " + args.row);
            let col= args.col;
            let row=args.row;

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
          spread.bind(spreadNS.Events.SelectionChanging, function (e: any, args: any) {
              let selection = args.newSelections.pop();
              let sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
              self.eventLog =
                  'SpreadEvent: ' + GC.Spread.Sheets.Events.SelectionChanging + ' event called' + '\n' +
                  'sheetArea: ' + sheetArea + '\n' +
                  'row: ' + selection.row + '\n' +
                  'column: ' + selection.col + '\n' +
                  'rowCount: ' + selection.rowCount + '\n' +
                  'colCount: ' + selection.colCount;
          });
          spread.bind(spreadNS.Events.SelectionChanged, function (e: any, args: any) {
              let selection = args.newSelections.pop();
              if (selection.rowCount > 1 && selection.colCount > 1) {
                  let sheetArea = args.sheetArea === 0 ? 'sheetCorner' : args.sheetArea === 1 ? 'columnHeader' : args.sheetArea === 2 ? 'rowHeader' : 'viewPort';
                  self.eventLog =
                      'SpreadEvent: ' + GC.Spread.Sheets.Events.SelectionChanged + ' event called' + '\n' +
                      'sheetArea: ' + sheetArea + '\n' +
                      'row: ' + selection.row + '\n' +
                      'column: ' + selection.col + '\n' +
                      'rowCount: ' + selection.rowCount + '\n' +
                      'colCount: ' + selection.colCount;
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
                        
                        var value = sheet.getValue(selected_Cell.row, selected_Cell.col);
                     
                       
                        
                        if (self.copy_value.row>=0){
                          self.draw_Cells(sheet,row,col,self.copy_value.duration,self.copy_value.type,self.copy_value.RecordNo,self.copy_value.service)
                         
                        }
                        if (self.operation==="cut"){
                            self.ProcessRoster("Cut",self.copy_value.RecordNo);
                            self.remove_Cells(sheet,self.copy_value.row,self.copy_value.col,self.copy_value.duration)
                        }else
                            self.ProcessRoster("Copy",self.copy_value.RecordNo);
                        
                       
                       
                       // sheet.setValue(row,col,sheet.getCell(selected_Cell.row, selected_Cell.col));
  
                       //sheet.getCell(row,col).backColor(sheet.getCell(selected_Cell.row, selected_Cell.col).backColor);
                      //sheet.getCell(row,col).backgroundImage(sheet.getCell(selected_Cell.row, selected_Cell.col).backgroundImage);
  
                        Commands.endTransaction(context, options);
                      //  sheet.options.isProtected = true;
                        spread.resumePaint();
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
                       
                        var sheet = spread.getActiveSheet();
                       
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                       
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null){
                          self.cell_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)                      
                          self.deleteRosterModal=true;
                          
                        }else
                         self.cell_value={row:-1,col:-1,duration:-1, type:0}
                       
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

   let sheet:any=this.spreadsheet.getActiveSheet(); 
   this.spreadsheet.suspendPaint();
  
     // Set the default styles.
     var defaultStyle = new GC.Spread.Sheets.Style();
     defaultStyle.font = "8pt Arial";
     
     
     //defaultStyle.themeFont = "11pt Segoe UI";
     sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.colHeader);
     sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.rowHeader);
     sheet.getRange(2, -1, 1, -1, GC.Spread.Sheets.SheetArea.rowHeader).hAlign(GC.Spread.Sheets.HorizontalAlign.right);

     //sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
    let date:Date = new Date(this.date);
    let m = date.getMonth()+1;
    let y=date.getFullYear();
    let d = date.getDate()-1;
    
    date.setDate(date.getDate()-d)  
    
    let days:number =this.getDaysInMonth(m,y);
   if (this.Days_View==31){
    this.Days_View==days
   }
    sheet.setColumnCount(this.Days_View, GC.Spread.Sheets.SheetArea.viewport);

    
    for (let i=0; i<=this.Days_View ; i++)   {
                
     // sheet.setValue(0, i, date.getDate() + " " + this.DayOfWeek( date.getDay()), GC.Spread.Sheets.SheetArea.colHeader);
     
      var head_txt=date.getDate() + " " + this.DayOfWeek( date.getDay());
      sheet.setValue(0, i, { richText: [{ style: { font: 'bold 12px Segoe UI ', foreColor: 'white' }, text: head_txt   }] }, GC.Spread.Sheets.SheetArea.colHeader);        
      var row_header = sheet.getRange(i, -1, 1, -1, GC.Spread.Sheets.SheetArea.colHeader);
      row_header.backColor("#002060");
      row_header.foreColor("#ffffff");
      
     var new_width = 1000 / this.Days_View;
     sheet.setColumnWidth(i, new_width,GC.Spread.Sheets.SheetArea.viewport);

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
          sheet.getCell(0, i, GC.Spread.Sheets.SheetArea.colHeader).foreColor("#000000");
          sheet.setValue(0, i, { richText: [{ style: { font: 'bold 12px Segoe UI ', foreColor: 'black' }, text: head_txt }] }, GC.Spread.Sheets.SheetArea.colHeader);        
          
      //row_header.backColor("#D1A6BC");
     
      }
      date.setDate(date.getDate()+1); 
    }

   // sheet.deleteColumns(days+1,31-days );    
  
   if (this.Already_loaded)
   {
    this.spreadsheet.resumePaint();
    return;
   } 

    let time:Time;
    time={hours:0,
        minutes:0}
        
    

    for (let j=0; j<this.time_slot; j++)   {      
   
        var row_txt=date.getDate() + " " + this.DayOfWeek( date.getDay());
        
       if (time.minutes==0){
            //sheet.setValue(j, 0, this.numStr(time.hours)  + ":" + this.numStr(time.minutes) +""  , GC.Spread.Sheets.SheetArea.rowHeader);        
            row_txt = this.numStr(time.hours)  + ":" + this.numStr(time.minutes) 
       }else if (time.minutes%15==0)
          //  sheet.setValue(j, 0,  "     "+this.numStr(time.minutes)  , GC.Spread.Sheets.SheetArea.rowHeader);
          row_txt = "     "+this.numStr(time.minutes)  ;
        else
            row_txt= "";
         //sheet.setValue(j, 0,  ""  , GC.Spread.Sheets.SheetArea.rowHeader);

         sheet.setValue(j, 0, { richText: [{ style: { font: 'bold 12px Segoe UI ', foreColor: 'white' }, text: row_txt   }] }, GC.Spread.Sheets.SheetArea.rowHeader);        
       
        sheet.getRange(j, 0, 1, 1).tag(this.numStr(time.hours)  + ":" + this.numStr(time.minutes));

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
  
  this.Already_loaded=true;
  this.spreadsheet.resumePaint();
  

      
  }

  set_Time_Interval(t:number)
  {
     // this.show_views=false;
      this.time_slot=t;
     
  }  
  
  set_day_view(d:number)
  {
    //this.show_views=false;
      this.Days_View=d;
    //   this.prepare_Sheet();
    //   this.load_rosters();
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
      cell.setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
    
    var new_duration:number=0;

    if (this.time_slot==288)
        new_duration=duration;
     else if (this.time_slot==144)
         new_duration= Math.ceil(duration/2); 
    else if (this.time_slot==96)
        new_duration= Math.ceil(duration/3); 

    if (new_duration<=1)
        new_duration=3;

      for (let m=0; m<new_duration; m++){
      if (m==0) {
        sheet.getCell(r,c).backColor("#D5D6DE");
      //  sheet.getCell(r,c).backColor("#ffffff");
       // sheet.getCell(r,c).backgroundImage(rowImage)
        this.setIcon(r,c,type,RecordNo, service);
       }  
       else{
            
            sheet.getCell(r+m,c).backColor("#D5D6DE");
         //  sheet.getCell(r,c).backColor("#ffffff");
            this.setIcon(r+m,c,20,RecordNo, "");
        }
        //sheet.getCell(r+m,c).field=duration;
       sheet.getCell(r+m,c, GC.Spread.Sheets.SheetArea.viewport).locked(true);
        sheet.getRange(r+m, c, 1, 1).tag(this.cell_value)
       }
       
       //sheet.addSpan(r, c+1, duration, 1, GC.Spread.Sheets.SheetArea.viewport);

       //sheet.autoMerge(cell, GC.Spread.Sheets.AutoMerge.AutoMergeDirection.column, GC.Spread.Sheets.AutoMerge.AutoMergeMode.restricted);

       
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
    numStr(n:number):string{
      let val="" + n;
      if (n<10) val = "0" + n;
      
      return val;
    }
    
    ProcessRoster(Option:any, recordNo:string):any{
        let dt= new Date(this.date);
        
        let sheet = this.spreadsheet.getActiveSheet();
        let range = sheet.getSelections();
        let date = dt.getFullYear() + "/" + this.numStr(dt.getMonth()+1) + "/" + this.numStr(range[0].col+1);
        let f_row= range[0].row;
        let l_row=f_row+range[0].rowCount;
        let startTime=sheet.getTag(f_row,0,GC.Spread.Sheets.SheetArea.viewport);

        if (this.master){

            startTime="00:00"
        }
       
        let inputs={
            "opsType": Option,
            "user": this.token.user,
            "recordNo": recordNo,
            "isMaster": this.master,
            "roster_Date" : date,
            "start_Time":startTime,
            "carer_code":this.selectedCarer,
            "notes" : this.notes
        }
        this.timeS.ProcessRoster(inputs).subscribe(data => {
        //if  (this.ClearMultiShiftModal==false &&  this.SetMultiShiftModal==false)    
             this.globalS.sToast('Success', 'Timesheet '  + Option + ' operation has been completed');
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
        this.resetAddTimesheetModal();
        this.AddViewRosterDetails.next(2);
        let sheet = this.spreadsheet.getActiveSheet();
        var range=sheet.getSelections();
        // console.log(range)
        let dt= new Date(this.date);
        //let dt = moment.utc(this.date).local();
        let date = dt.getFullYear() + "-" + this.numStr(dt.getMonth()+1) + "-" + this.numStr(range[0].col+1);
        let f_row= range[0].row;
        let l_row=f_row+range[0].rowCount;
        let startTime=sheet.getTag(f_row,0,GC.Spread.Sheets.SheetArea.viewport);

        let endTime =sheet.getTag(l_row,0,GC.Spread.Sheets.SheetArea.viewport);

        this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
        this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());
        this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
        this.current = 0;
        this.date = parseISO(this.datepipe.transform(date, 'yyyy-MM-dd'));
        this.rosterForm.patchValue({date:date})

        //this.date = parseISO(new Date(date).toISOString());
        
    }
   
    currentDate: string;

    dateStream = new Subject<any>();
    userStream = new Subject<string>();

    date:any = moment();
    options: any;
    recipient: any;
    serviceType:any;

    loading: boolean = false;
    basic: boolean = false;
   // data: any;

    private unsubscribe = new Subject();
  //  private rosters: Array<any>;
    //private current_roster: any;
    private upORdown = new Subject<boolean>();

    constructor(
        
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
            payType,
            paytype,
            shiftbookNo,
            recordNo,
            endTime } = index;

            
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

            this.Timesheet_label="Edit Timesheet (RecordNo : " + recordNo +")"
            this.rosterForm.patchValue({
                serviceType: this.DETERMINE_SERVICE_TYPE(index),
                date: date,
                program: program,
                serviceActivity: activity,
                payType: paytype,
                analysisCode: analysisCode,
                recordNo: shiftbookNo,            
                pay:pay,
                bill:bill,
                recipientCode: recipientCode,
                debtor: debtor
                
            });
        }, 100);
    }
    ngOnDestroy(): void {  

    }
    ngOnInit(): void {
        GC.Spread.Sheets.LicenseKey = license;
       
        this.date = moment();
        this.buildForm(); 
         this.token = this.globalS.decode();    
        
       
}

ngAfterViewInit(){

    if (this.spreadsheet==null)
    {
        
            //value = new GC.Spread.Sheets.Workbook(host);
        // var spread = new GC.Spread.Sheets.Workbook($("#ss")[0],{sheetCount:1, font:"12pt Arial"});
        
        // this.workbookInit(spread);
    }
}

refreshPage() {
    
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
        if(index == 'ALLOWANCE NON-CHARGEABLE' || index == 'ALLOWANCE CHARGEABLE'){
            return 9;
        }

        // ADMINISTRATION
        if(index == 'ADMINISTRATION'){            
            return 6;
        }

        // CASE MANAGEMENT
        if(index == 'CASE MANAGEMENT'){
            return 7;
        }

        // ITEM
        if(index == 'ITEM'){
            return 15;
        }

        // SLEEPOVER
        if(index == 'SLEEPOVER'){

            return 8;
        }

        // TRAVEL TIME
        if(index == 'TRAVEL TIME'){

            return 5;
        }

        //SERVICE
        return 2;
     }

  

    // ngAfterViewInit(): void {
    //     // console.log(this.calendarComponent.getApi());
    //     this.searchRoster(this.date);

    //     console.log(document)
        
    // }

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
            this.clientS.getagencydefinedgroup(this.selected.data)
                .subscribe(data => {
                    this.agencyDefinedGroup = data.data;
                });
        } 
        
        this.picked$ = this.timeS.gettimesheets({
            AccountNo: data.data,            
            personType: this.viewType,
            startDate: moment(this.date).startOf('month').format('YYYY/MM/DD'),
            endDate: moment(this.date).endOf('month').format('YYYY/MM/DD'),
        }).pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {

                this.loading = false;
              
                this.rosters = data.map(x => {
                    return {
                        shiftbookNo: x.shiftbookNo,
                        date: x.activityDate,
                        startTime: this.fixDateTime(x.activityDate, x.activity_Time.start_time),
                        endTime: this.fixDateTime(x.activityDate, x.activity_Time.end_Time),
                        duration: x.activity_Time.calculated_Duration,
                        dayNo: x.dayNo,
                        monthNo: x.monthNo,
                        yearNo: x.yearNo,                       
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
                        type:x.type

                    }
                   
                });
                
                console.log(this.timesheets);
            
            });
        
        this.getComputedPay(data).subscribe(x => this.computeHoursAndPay(x));
     
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

       
        // console.log(format(startOfMonth(date),'yyyy/MM/dd'));
        if(!this.recipient) return;
        
           this.ActiveCellText="";
            
        this.staffS.getroster({
            RosterType: this.recipient.option == '1' ? 'PORTAL CLIENT' : 'SERVICE PROVIDER',            
            AccountNo: this.recipient.data,
            StartDate: moment(date).startOf('month').format('YYYY/MM/DD'),
            EndDate: moment(date).endOf('month').format('YYYY/MM/DD')
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
        
                this.globalS.sToast('Roster Notifs',`There are ${(this.options.events).length} rosters found!`)
               
        });
    }

    next_date(){
        this.date = moment(this.date).add('month', 1);
       // var calendar = this.calendarComponent.getApi(); 
       // calendar.next();

        this.upORdown.next(true);
    }

    prev_date(){
        this.date = moment(this.date).subtract('month', 1);
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
    }
    handleOk(){

    }

    GETPROGRAMS(type: string): Observable<any> {
        let sql;
        if (!type) return EMPTY;
        const { isMultipleRecipient } = this.rosterForm.value;
        if (type === 'ADMINISTRATION' || type === 'ALLOWANCE NON-CHARGEABLE' || type === 'ITEM' || (type == 'SERVICE' && !isMultipleRecipient)) {
            sql = `SELECT Distinct [Name] AS ProgName FROM HumanResourceTypes WHERE [group] = 'PROGRAMS' AND ISNULL(UserYesNo3,0) = 0 AND (EndDate Is Null OR EndDate >=  '${this.currentDate}') ORDER BY [ProgName]`;
        } else {
            // sql = `SELECT Distinct [Program] AS ProgName FROM RecipientPrograms 
            //     INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID 
            //     WHERE Recipients.AccountNo = '${type}' AND RecipientPrograms.ProgramStatus IN ('ACTIVE', 'WAITING LIST') ORDER BY [ProgName]`

            
            sql =`SELECT ACCOUNTNO, PROGRAM AS ProgName, [SERVICE TYPE] as serviceType, [SERVICESTATUS],
                (CASE WHEN ISNULL(S.ForceSpecialPrice,0) = 0 THEN
                (CASE WHEN C.BillingMethod = 'LEVEL1' THEN I.PRICE2
                 WHEN C.BillingMethod = 'LEVEL2' THEN I.PRICE3
                 WHEN C.BillingMethod = 'LEVEL3' THEN I.PRICE4
                 WHEN C.BillingMethod = 'LEVEL4' THEN I.PRICE5                       
                 WHEN C.BillingMethod = 'LEVEL5' THEN I.PRICE6
                ELSE I.Amount END )
                ELSE S.[UNIT BILL RATE] END ) AS BILLRATE
                FROM RECIPIENTS C INNER JOIN RECIPIENTPROGRAMS RP ON C.UNIQUEID = RP.PERSONID 
                INNER JOIN ServiceOverview S ON C.UNIQUEID = S.PersonID AND RP.PROGRAM = S.ServiceProgram
                INNER JOIN ITEMTYPES I ON S.[SERVICE TYPE] = I.TITLE AND ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM')
                WHERE ACCOUNTNO = '${type}'`
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

    GETSERVICEACTIVITY(program: any): Observable<any> {

        const { serviceType } = this.rosterForm.value;

        //console.log("arshad:"+ this.selected.option)

        if (!program) return EMPTY;
        console.log(this.rosterForm.value)

        
        if (serviceType != 'ADMINISTRATION' && serviceType != 'ALLOWANCE NON-CHARGEABLE' && serviceType != 'ITEM'  || serviceType != 'SERVICE') {
            // const { recipientCode, debtor } = this.rosterForm.value;
            return this.listS.getserviceactivityall({
                recipient: this.GETRECIPIENT(this.selected.option),
                program,
                ForceAll: this.ForceAll,
                mainGroup: serviceType,
                subGroup: this.subGroup,
                viewType: this.viewType,
                Date:this.RosterDate,
                StartTime:this.StartTime,
                EndTime : this.EndTime,
                Duration: this.Duration


            });
        }
        else {
             let sql = `SELECT DISTINCT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid 
                 WHERE SO.serviceprogram = '${ program}' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] = 'ADMINISTRATION' AND processclassification = 'OUTPUT' AND ( ITM.enddate IS NULL OR ITM.enddate >= '${this.currentDate}' )) ORDER BY [service type]`;
            
            return this.listS.getlist(sql);
                //  return this.listS.getserviceprogramactivity({                  
                //     program,
                //     recipient: this.GETRECIPIENT(this.selected.option),
                //     mainGroup: serviceType,
                //     viewType: this.viewType
                // });

            // let sql = `SELECT DISTINCT [Service Type] AS activity FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID
            //     WHERE SO.ServiceProgram = '${ program}' AND EXISTS (SELECT Title FROM ItemTypes ITM WHERE Title = SO.[Service Type] AND 
            //     ProcessClassification = 'OUTPUT' AND (ITM.EndDate Is Null OR ITM.EndDate >= '${this.currentDate}')) ORDER BY [Service Type]`;
            //return this.listS.getlist(sql);
        }
    };

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
        if (type === 'ALLOWANCE CHARGEABLE' || type === 'ALLOWANCE NON-CHARGEABLE') {
            sql = `SELECT Recnum, Title FROM ItemTypes WHERE RosterGroup = 'ALLOWANCE ' 
                AND Status = 'NONATTRIBUTABLE' AND ProcessClassification = 'INPUT' AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY TITLE`
        } else {
            sql = `SELECT Recnum, LTRIM(RIGHT(Title, LEN(Title) - 0)) AS Title
            FROM ItemTypes WHERE RosterGroup = 'SALARY'   AND Status = 'NONATTRIBUTABLE'   AND ProcessClassification = 'INPUT' AND Title BETWEEN '' 
            AND 'zzzzzzzzzz'AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY TITLE`
        }
        return this.listS.getlist(sql);
    }

    // Add Timesheet

    
    dateFormat: string = 'dd/MM/yyyy'
    selectAll: boolean = false;
    overlapVisible: boolean = false;
    addTimesheetVisible: boolean = false;
    multipleRecipientShow: boolean = false;
    isTravelTimeChargeable: boolean = false;
    isSleepOver: boolean = false;
    payUnits: any;
    parserPercent = (value: string) => value.replace(' %', '');
    parserDollar = (value: string) => value.replace('$ ', '');
    formatterDollar = (value: number) => `${value > -1 || !value ? `$ ${value}` : ''}`;
    formatterPercent = (value: number) => `${value > -1 || !value ? `% ${value}` : ''}`;

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
    
    payPeriodEndDate: Date;
    unitsArr: Array<string> = ['HOUR', 'SERVICE'];

    activity_value: number;
    durationObject: any;

    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);

    dateFormat: string = 'dd/MM/yyyy'

    
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
    analysisCodeList: Array<any> = []
    programActivityList:Array<any>=[]
   
    
    clearLowerLevelInputs() {

        this.rosterForm.patchValue({
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
                unit: 'HOUR',
                rate: '0',
                quantity: '1',
                position: ''
            },
            bill: {
                unit: 'HOUR',
                rate: '0',
                quantity: '1',
                tax: '0'
            },
        });
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
        this.rosterForm = this.formBuilder.group({
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
            isMultipleRecipient: false,
            isTravelTimeChargeable: false,
            sleepOverTime: '',
            time: this.formBuilder.group({
                startTime:  [''],
                endTime:  [''],
            }),
            pay: this.formBuilder.group({
                unit:  ['HOUR'],
                rate:  ['0'],
                quantity:  ['1'],
                position: ''
            }),
            bill: this.formBuilder.group({
                unit: ['HOUR'],
                rate: ['0'],
                quantity: ['1'],
                tax: '1'
            })
            
        })

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
                    unit: d.unit,
                    rate: d.amount,
                    quantity: (this.durationObject.duration) ? 
                        (((this.durationObject.duration * 5) / 60)).toFixed(2) : 0
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

            if(this.whatProcess == PROCESS.UPDATE){
                setTimeout(() => {
                    this.rosterForm.patchValue({
                        program: this.defaultProgram
                    });
                }, 0);
                console.log(this.rosterForm.value)
            }         

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
                if(this.selected.option == 0) return EMPTY;
                
                return this.GETPROGRAMS(x)
            })
        ).subscribe((d: Array<any>)  => {
            this.programsList = d.map(x => x.progName);
            //this.programsList = d;
        });

        this.rosterForm.get('serviceType').valueChanges.pipe(
            takeUntil(this.unsubscribe),
            switchMap(x => {
                this.clearLowerLevelInputs();

                this.multipleRecipientShow = this.isServiceTypeMultipleRecipient(x);
                this.isTravelTimeChargeable = this.isTravelTimeChargeableProcess(x);
                this.isSleepOver = this.isSleepOverProcess(x);

                if (!x) return EMPTY;
                return forkJoin(
                    this.GETANALYSISCODE(),
                    this.GETPAYTYPE(x),
                    this.GETPROGRAMS(x)
                )
            })
        ).subscribe(d => {
            this.analysisCodeList = d[0];
            this.payTypeList = d[1];
           // this.programsList = d[2];
           
            this.programsList = d[2].map(x => x.progName);

            if(this.viewType == 'Recipient'){
                this.rosterForm.patchValue({
                    analysisCode: this.agencyDefinedGroup
                });
            }
        });
        this.rosterForm.get('program').valueChanges.pipe(
            distinctUntilChanged(),
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
            console.log(d)
            console.log(this.serviceActivityList)
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
            isMultipleRecipient: false,
            isTravelTimeChargeable: false,
            sleepOverTime: '',
            time: this.formBuilder.group({
                startTime:  [''],
                endTime:  [''],
            }),
            pay: this.formBuilder.group({
                unit:  ['HOUR'],
                rate:  ['0'],
                quantity:  ['1'],
                position: ''
            }),
            bill: this.formBuilder.group({
                unit: ['HOUR'],
                rate: ['0'],
                quantity: ['1'],
                tax: '1'
            })
            
        })

        this.bookingForm.get('program').valueChanges.pipe(
            distinctUntilChanged(),
            switchMap(x => {
                if(!x) return EMPTY;
               // this.serviceActivityList = [];
                this.bookingForm.patchValue({
                    serviceActivity: null
                });

              //  return items.filter(item => item.title.indexOf(filter.title) !== -1);
              //  return  this.programActivityList.filter(item => item.ProgName.indexOf(filter.title) !== -1);
            })
        ).subscribe((d: Array<any>) => {

           // this.serviceActivityList = d.map(x => x.activity);
           

            if(this.serviceActivityList.length == 1){
                this.bookingForm.patchValue({
                    serviceActivity: this.serviceActivityList[0]
                });
            }
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

        if (roster === 'TRAVEL TIME') {
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

    resetAddTimesheetModal() {
        this.current = 0;
        this.rosterGroup = '';

        this.rosterForm.reset({
            date: this.payPeriodEndDate,
            serviceType: '',
            program: '',
            serviceActivity: '',
            payType: '',
            analysisCode: '',
            recipientCode: '',
            debtor: '',
            isMultipleRecipient: false,
            isTravelTimeChargeable: false,
            sleepOverTime: new Date(0, 0, 0, 9, 0, 0),
            time: this.formBuilder.group({
                startTime: '',
                endTime: '',
            }),
            pay: this.formBuilder.group({
                unit: 'HOUR',
                rate: '0',
                quantity: '1',
                position: ''
            }),
            bill: this.formBuilder.group({
                unit: 'HOUR',
                rate: 0,
                quantity: '1',
                tax: '1'
            }),
        });
        
        this.defaultStartTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
        this.defaultEndTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);        
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
                            unit: data.unit,
                            rate: this.DEFAULT_NUMERIC(data.rate),
                            tax: this.DEFAULT_NUMERIC(data.tax)
                        }
                    });
                });
            }            
        }
    }

    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;

        if(this.whatProcess == PROCESS.UPDATE) return;

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
                            unit: data.unit,
                            rate: this.DEFAULT_NUMERIC(data.rate),
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
       
            return this.current >= 4 || (this.rosterGroup == 'ADMINISTRATION' && this.current>=3) ;
    }
    get isFormValid(){
        return  this.rosterForm.valid;
    }
    get isBookingValid(){
        return true;// this.bookingForm.valid;
    }
    done(): void {
        this.fixStartTimeDefault();
        
        const tsheet = this.rosterForm.value;
        let clientCode = this.FIX_CLIENTCODE_INPUT(tsheet);

        var durationObject = (this.globalS.computeTimeDATE_FNS(tsheet.time.startTime, tsheet.time.endTime));

        if(typeof tsheet.date === 'string'){
            tsheet.date = parseISO(this.datepipe.transform(tsheet.date, 'yyyy-MM-dd'));
        }
       
        let inputs = {
            anal: tsheet.analysisCode || "",
            billQty: parseInt(tsheet.bill.quantity || 0),
            billTo: clientCode,
            billUnit: tsheet.bill.unit || 0,
            blockNo: durationObject.blockNo,
            carerCode: this.selected.option == 0 ? this.selected.data : tsheet.staffCode,
            clientCode: this.selected.option == 0 ? clientCode : this.selected.data,
            costQty: parseInt(tsheet.pay.quantity || 0),
            costUnit: tsheet.pay.unit || 0,
            date: format(tsheet.date,'yyyy/MM/dd'),
            dayno: parseInt(format(tsheet.date, 'd')),
            duration: durationObject.duration,
            groupActivity: false,
            haccType: tsheet.haccType || "",
            monthNo: parseInt(format(tsheet.date, 'M')),
            program: tsheet.program,
            serviceDescription:  tsheet.payType || "",
            serviceSetting: null || "",
            serviceType: tsheet.serviceActivity || "",
            paytype: tsheet.payType.paytype,
            // serviceType: this.DETERMINE_SERVICE_TYPE_NUMBER(tsheet.serviceType),
            staffPosition: null || "",
            startTime: format(tsheet.time.startTime,'HH:mm'),
            status: "1",
            taxPercent: parseInt(tsheet.bill.tax || 0),
            transferred: 0,
            // type: this.activity_value,
            type: this.DETERMINE_SERVICE_TYPE_NUMBER(tsheet.serviceType),
            unitBillRate: parseInt(tsheet.bill.rate || 0),
            unitPayRate: tsheet.pay.rate || 0,
            yearNo: parseInt(format(tsheet.date, 'yyyy')),
            serviceTypePortal: tsheet.serviceType,
            recordNo: tsheet.recordNo
        };
        if(!this.rosterForm.valid){
            this.globalS.eToast('Error', 'All fields are required');
            return;
        }

        if(this.whatProcess == PROCESS.ADD){
            this.timeS.posttimesheet(inputs).subscribe(data => {
                this.globalS.sToast('Success', 'Timesheet has been added');
                this.addTimesheetVisible = false;
               // this.picked(this.selected);
               this.searchRoster(tsheet.date)
            });
        }   
        
        if(this.whatProcess == PROCESS.UPDATE){
            this.timeS.updatetimesheet(inputs).subscribe(data => {
                this.globalS.sToast('Success', 'Timesheet has been updated');
                this.addTimesheetVisible = false;
                //this.picked(this.selected);
                this.searchRoster(tsheet.date)
            });
        }
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
            this.resetAddTimesheetModal();
            this.addTimesheetVisible = true;
            this.whatProcess = PROCESS.ADD
        }
    }
        
       

      
     
}
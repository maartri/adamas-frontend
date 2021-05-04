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

import * as moment from 'moment';
import * as $ from 'jquery';
import { SpreadSheetsModule } from '@grapecity/spread-sheets-angular';
import * as GC from "@grapecity/spread-sheets";


interface AddTimesheetModalInterface {
    index: number,
    name: string
}
interface UserView{
    staffRecordView: string,
    staff: number
}
const license = "License Key";

@Component({
    styles: [`
       
    `],
    templateUrl: './rosters.html'
})

export class RostersAdmin  {
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
 Days_View:number=31;
    data:any=[];  
  //rosters:any=[];
  rosters: Array<any> = [];
  current_roster:any;
  time_map = new Map();
  Already_loaded:boolean=false;
  prev_cell:any = {row:0,col:0,duration:0, type:0, recordNo:0} 
  cell_value:any = {row:0,col:0,duration:0, type:0,recordNo:0} 
  copy_value:any = {row:0,col:0,duration:0, type:0,recordNo:0} 

  bodyText:string;
  recipientDetailsModal:boolean=false;
  operation:string="";
  columnWidth = 100;
  i:number=0;
  eventLog: string;
  token:any;

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
    
    sample: any;
    searchStaffModal:boolean=false;
    ViewStaffDetail:boolean=false;
    isFirstLoad:boolean=false;
    userview: UserView;
    selectedCarer:any;
    UnAllocateStaffModal:boolean=false;
    ClearMultiShiftModal:boolean=false;
    SetMultiShiftModal:boolean=false;
 DayOfWeek(n:number): String{

    let day:String="";
    switch(n){
    case 1 : day="Mo"; break;
    case 2 : day="Tu" ; break;
    case 3 : day="We" ; break;
    case 4 : day="Th" ; break;
    case 5 : day="Fr" ; break;
    case 6 : day="Sa" ; break;
    case 0 : day="Su" ; break;
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

reAllocate(){
    if (this.cell_value==null || this.cell_value.RecordNo==0) return;

    this.ProcessRoster("Re-Allocate", this.cell_value.RecordNo);
    let sheet=this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
    this.remove_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration)
    this.spreadsheet.resumePaint();


}


UnAllocate(){
    if (this.cell_value==null || this.cell_value.RecordNo==0) return;

    this.ProcessRoster("Un-Allocate", this.cell_value.RecordNo);
    let sheet=this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
    this.remove_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration)
    this.spreadsheet.resumePaint();


}


SetMultishift(){
    if (this.cell_value==null || this.cell_value.RecordNo==0) return;

    
    this.ProcessRoster("SetMultishift", this.cell_value.RecordNo);
    

}
ClearMultishift(){
    if (this.cell_value==null || this.cell_value.RecordNo==0) return;

    this.ProcessRoster("ClearMultishift", this.cell_value.RecordNo);
    

}
  load_rosters(){
    
    
    this.spreadsheet.suspendPaint();
    let sheet = this.spreadsheet.getActiveSheet()
    
    var cell= sheet.getRange(0, 0, 288, 30, GC.Spread.Sheets.SheetArea.viewport)
    cell.setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
    if (this.master)
        cell.backColor("#FF8080");
    else
        cell.backColor("white");
    
    cell.text("")
    

    let row=-1, col=-1;
    if (this.rosters==null) {
        this.spreadsheet.resumePaint();
        return;
    }
  
    for(var r of this.rosters){
            
        if (r.dayNo>this.Days_View) break;

            col=r.dayNo-1;
            row = this.getrow(r.start_Time);//self.time_map.get(r.Start_Time); //
            if (row!=null && col !=null)
            this.draw_Cells(sheet,row,col,r.duration, r.type, r.recordNo)
        
    }

    this.spreadsheet.resumePaint();
  }
  
  setMasterRoster($event:any){
      console.log("Master Roster")
      this.master=!this.master;
      if (this.master)
        this.date="1900/01/01"
    else{
        
        this.date = moment()
       
    }
    this.searchRoster(this.date);
     
    
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
  
      sheet.setRowCount(288, GC.Spread.Sheets.SheetArea.viewport);
      sheet.setColumnCount(31,GC.Spread.Sheets.SheetArea.viewport);

          spread.suspendPaint();
          let spreadNS = GC.Spread.Sheets;
          let self = this;
        
          
  
          spread.bind(spreadNS.Events.CellClick, function (e: any, args: any) {
            let row,col, duration=0,type=0;
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
                  
  
                  sheet.getRange(self.prev_cell.row, self.prev_cell.col, self.prev_cell.duration, 1, GC.Spread.Sheets.SheetArea.viewport).setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
  
                  row=args.row;
                  col=args.col;
                  if (sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)!=null) {
                  self.cell_value=sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)
                 
                  row=self.cell_value.row
                  col=self.cell_value.col
                  duration=Number(self.cell_value.duration)
                  type=self.cell_value.type;
                  } 
                  // duration=10;
                  // Allow selection of multiple ranges
                  sheet.selectionPolicy(GC.Spread.Sheets.SelectionPolicy.multiRange);
                 
                  // Create two different selection ranges.
                  sheet.addSelection(row, col, duration, 1);
                  
                  let len =row+Number(duration);
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
  
                  self.prev_cell = {row,col,duration, type};

                  spread.resumePaint();
          });
          spread.bind(GC.Spread.Sheets.Events.CellDoubleClick, function (sender, args) {
            console.log("Double clicked column index: " + args.row + ", " + args.col);
            //console.log("Double clicked row index: " + args.row);
            let col= args.col;
            let row=args.row;

            self.cell_value=sheet.getTag(row,col,GC.Spread.Sheets.SheetArea.viewport)
           
            let data:any = self.find_roster(self.cell_value.RecordNo);
           
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
                        sheet.options.isProtected = false;
                        console.log("Paste Operation")
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var col = sel.col;
                        var row = sel.row;
                        console.log(selected_Cell);     
                        
                        var value = sheet.getValue(selected_Cell.row, selected_Cell.col);
                     
                       
                        
                        if (self.copy_value.row>=0){
                          self.draw_Cells(sheet,row,col,self.copy_value.duration,self.copy_value.type,self.copy_value.RecordNo)
                         
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
                        sheet.options.isProtected = true;
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
                        spread.suspendPaint()
                        console.log("Delete Operation")
                        self.operation="Delete";
                        var sheet = spread.getActiveSheet();
                       
                        var sels = sheet.getSelections();
                        var sel = sels[0];
                        var row = sel.row;
                       
                        selected_Cell=sel;
  
                        if (sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)!=null){
                          self.copy_value=sheet.getTag(sel.row,sel.col,GC.Spread.Sheets.SheetArea.viewport)                      
                        
                          self.remove_Cells(sheet,self.copy_value.row,self.copy_value.col,self.copy_value.duration)

                          self.ProcessRoster("Delete",self.copy_value.RecordNo);
                        }
                        self.copy_value={row:-1,col:-1,duration:-1, type:0}
                       
                        Commands.endTransaction(context, options);
                        spread.resumePaint()
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
                    
                        console.log("ViewAdditional event called");
  
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            });
            sheet.options.isProtected = true;
            spread.options.allowContextMenu = true;
               
         
  
          spread.resumePaint();
      
          self.prepare_Sheet();
     
          
  }  
  
  prepare_Sheet(){

   let sheet:any=this.spreadsheet.getActiveSheet(); 
   this.spreadsheet.suspendPaint();
   
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
                
      sheet.setValue(0, i, date.getDate() + " " + this.DayOfWeek( date.getDay()), GC.Spread.Sheets.SheetArea.colHeader);
      
      
      var row_header = sheet.getRange(i, -1, 1, -1, GC.Spread.Sheets.SheetArea.colHeader);
      row_header.backColor("#476794");
      if (this.Days_View>=30)
        sheet.setColumnWidth(i, 40.0,GC.Spread.Sheets.SheetArea.viewport);
      else if (this.Days_View>=14)
        sheet.setColumnWidth(i, 70.0,GC.Spread.Sheets.SheetArea.viewport);
      else 
        sheet.setColumnWidth(i, 120.0,GC.Spread.Sheets.SheetArea.viewport);
      
        //weekend
      
      if ((this.DayOfWeek( date.getDay())=="Sa") || (this.DayOfWeek( date.getDay())=="Su")){
          sheet.getCell(0, i, GC.Spread.Sheets.SheetArea.colHeader).backColor("#d1e6e6");
          sheet.getCell(0, i, GC.Spread.Sheets.SheetArea.colHeader).foreColor("#000000");
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
        
    

    for (let j=0; j<288; j++)   {      
   
     
       if (time.minutes==0){
        sheet.setValue(j, 0, this.numStr(time.hours)  + ":" + this.numStr(time.minutes) +""  , GC.Spread.Sheets.SheetArea.rowHeader);        
       }else
        sheet.setValue(j, 0,  "   : "+this.numStr(time.minutes)  , GC.Spread.Sheets.SheetArea.rowHeader);
         
        sheet.getRange(j, 0, 1, 1).tag(this.numStr(time.hours)  + ":" + this.numStr(time.minutes));

        this.time_map.set(j,this.numStr(time.hours)  + ":" + this.numStr(time.minutes))
        sheet.getCell(j, 0, GC.Spread.Sheets.SheetArea.rowHeader).backColor("#083a80");
        sheet.getCell(j, 0, GC.Spread.Sheets.SheetArea.rowHeader).foreColor("#ffffff");
        sheet.setColumnWidth(0, 60.0,GC.Spread.Sheets.SheetArea.rowHeader);

        time.minutes+=5;
        if (time.minutes==60){
          time.minutes=0;
          time.hours+=1;
        }
        
  }
  
  this.Already_loaded=true;
  this.spreadsheet.resumePaint();
  

      
  }

  set_day_view(d:number)
  {
      this.Days_View=d;
      this.prepare_Sheet();
      this.load_rosters();
  }  
  
  setIcon(r:number, c:number, type:number) {

    var sheet = this.spreadsheet.getActiveSheet();
    this.spreadsheet.suspendPaint();
   sheet.setValue(r,c,Number(type),GC.Spread.Sheets.SheetArea.viewport);

    //var range =[new GC.Spread.Sheets.Range(r,c,r,c+1)]    
    var iconType=type
    switch(Number(type)){
        case 1:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeArrowsGray;
        break;
        case 2:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeTriangles
            break;
        case 3:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeStars
            break;
        case 4:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeFlags
            break;
        case 5:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeTrafficLightsUnrimmed
            break;
        case 6:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeTrafficLightsRimmed
            break;
        case 7:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeSigns
            break;           
        case 8:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeSymbolsCircled
            break;   
        case 9:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.threeSymbolsUncircled
            break;   
        case 10:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.fourArrowsColored
            break;
        case 11:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.fourArrowsGray;;
            break;        
         case 12:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.fourRedToBlack
            break;
        case 13:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.fourRatings
            break;
        case 14:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.fourTrafficLights
            break; 
        default:
            iconType=  GC.Spread.Sheets.ConditionalFormatting.IconSetType.fourArrowsColored;
    }
    var range =[new GC.Spread.Sheets.Range(r,c,r,c+1)]    
   
    var base = GC.Spread.Sheets.ConditionalFormatting.IconSetRule.getIcon;;
        GC.Spread.Sheets.ConditionalFormatting.IconSetRule.getIcon = function (iconSetType, iconIndex) {
                            var icon = base.apply(this, arguments);
                               
                                if (iconIndex === 0) {
                                    icon = "/assets/images/r1.png";
                                } else if (iconIndex === 1){
                                    icon = "/assets/images/r2.jpg";
                                } else if (iconIndex === 2) {
                                    icon =  "/assets/images/r3.png";
                                }else if (iconIndex === 3) {
                                    icon =  "/assets/images/r4.png";
                                }else if (iconIndex === 4) {
                                    icon =  "/assets/images/r5.png";
                                }else if (iconIndex === 5) {
                                    icon =  "/assets/images/r6.png";
                                }else if (iconIndex === 6) {
                                    icon =  "/assets/images/r7.png";
                                }else if (iconIndex === 7) {
                                    icon =  "/assets/images/r8.png";
                                }else if (iconIndex === 8) {
                                    icon =  "/assets/images/r9.png";
                                }else if (iconIndex === 9) {
                                    icon =  "/assets/images/r10.jpg";
                                }else if (iconIndex === 10) {
                                    icon =  "/assets/images/r11.jpg";
                                }else if (iconIndex === 11) {
                                    icon =  "/assets/images/r12.png";
                                }else if (iconIndex === 12) {
                                    icon =  "/assets/images/r13.png";
                                }else if (iconIndex === 13) {
                                    icon =  "/assets/images/r14.png";
                                }else if (iconIndex === 14) {
                                    icon =  "/assets/images/r15.png";
                                }
                            
                            return icon;
                        };
        
    var iconSetRule = new GC.Spread.Sheets.ConditionalFormatting.IconSetRule(iconType,range);
    var iconCriteria = iconSetRule.iconCriteria();
    iconCriteria[0] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 1);
    iconCriteria[1] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 2);
    iconCriteria[2] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 3);
    iconCriteria[3] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 4);
    iconCriteria[4] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 5);
    iconCriteria[5] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 6);
    iconCriteria[6] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 7);
    iconCriteria[7] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 8);
    iconCriteria[8] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 9);
    iconCriteria[9] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 10);
    iconCriteria[10] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 11);
    iconCriteria[11] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 12);
    iconCriteria[12] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 13);
    iconCriteria[13] = new GC.Spread.Sheets.ConditionalFormatting.IconCriterion(true, GC.Spread.Sheets.ConditionalFormatting.IconValueType.number, 14);
    


//console.log("icon " +  " = " + base )
//console.log("iconSetRule " + r + " = " + type + "\n" + iconType )
iconSetRule.reverseIconOrder(false);
iconSetRule.showIconOnly(true);
sheet.conditionalFormats.addRule(iconSetRule);

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
    r=h*12+m/5;
  
    return r;
  
  }
    draw_Cells(sheet:any,r:number, c:number, duration:number, type:number, RecordNo:number){
     
       
      this.cell_value ={"row":r,"col":c,"duration":duration, "type":type, "RecordNo":RecordNo};
      var rowImage = "/assets/images/r1.jpg";
     
      sheet.options.isProtected = true;
      var cell= sheet.getRange(r, c, duration, 1, GC.Spread.Sheets.SheetArea.viewport);
      cell.setBorder(new GC.Spread.Sheets.LineBorder("#C3C1C1", GC.Spread.Sheets.LineStyle.thin), {all:true});
    //   cell.backColor("grey")
    //   sheet.getCell(r,c).backColor("blue");
    //   sheet.getCell(r,c).backgroundImage(rowImage)
  
      
      for (let m=0; m<duration; m++){
      if (m==0) {
        sheet.getCell(r,c).backColor("#4ea0cf");
       // sheet.getCell(r,c).backgroundImage(rowImage)
        this.setIcon(r,c,type);
       }  
       else
        sheet.getCell(r+m,c).backColor("#d7dbd9");
        
        //sheet.getCell(r+m,c).field=duration;
        sheet.getCell(r+m,c, GC.Spread.Sheets.SheetArea.viewport).locked(true);
        sheet.getRange(r+m, c, 1, 1).tag(this.cell_value)
       }

       
    }

    remove_Cells(sheet:any,r:number, c:number, duration:number){
      
      
      //sheet.getRange(r, c, duration, 1, GC.Spread.Sheets.SheetArea.viewport).setBorder(new GC.Spread.Sheets.LineBorder("#C6EFEC", GC.Spread.Sheets.LineStyle.thin), {all:true});
      this.cell_value ={row:-1,col:-1,duration:0};
  
      for (let m=0; m<duration; m++){
      if (m==0) {
        sheet.getCell(r+m,c).backColor("white");
        sheet.getCell(r+m,c).backgroundImage(null)
       }  
       else
        sheet.getCell(r+m,c).backColor("white");
        
        //sheet.getCell(r+m,c).field=duration;
        sheet.getCell(r+m,c, GC.Spread.Sheets.SheetArea.viewport).locked(true);
        sheet.getRange(r+m, c, 1, 1).tag(null);
        sheet.getRange(r+m, c, 1, 1).text("");
  
       // sheet.getCell(r+m,c).locked(true);
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

        // let endTime =sheet.getTag(l_row,0,GC.Spread.Sheets.SheetArea.viewport);
        // this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
        // this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());
        // this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);

        let inputs={
            "opsType": Option,
            "user": this.token.user,
            "recordNo": recordNo,
            "isMaster": this.master,
            "roster_Date" : date,
            "start_Time":startTime,
            "carer_code":this.selectedCarer
        }
        this.timeS.ProcessRoster(inputs).subscribe(data => {
        if  (this.ClearMultiShiftModal==false &&  this.SetMultiShiftModal==false)    
             this.globalS.sToast('Success', 'Timesheet '  + Option + ' operation has been completed');
        this.selectedCarer="";
        this.searchStaffModal=false;
        this.UnAllocateStaffModal=false;
        
        this.ClearMultiShiftModal=false;
        this.SetMultiShiftModal=false;
            
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
   // calendarPlugins = [dayGridPlugin,timeGridPlugin,interactionPlugin]; // important!

   // someMethod() {
     //   let calendarApi = this.calendarComponent.getApi();
       // calendarApi.next();
    //}

    currentDate: string;

    dateStream = new Subject<any>();
    userStream = new Subject<string>();

    date:any = moment();
    options: any;
    recipient: any;

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
        //     date: date,
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
      //  GC.Spread.Sheets.LicenseKey = license;
        this.date = moment();
        this.buildForm(); 
         this.token = this.globalS.decode();    
             
    
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
            return;
        }

       
        //this.prepare_Sheet(this.spreadsheet);

        this.selected = data;
        if (this.master){
            this.start_date= "1900/01/01"
            this.end_date= "1900/01/31"
        }else{
            this.start_date= this.date
            this.end_date= this.date
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
            startDate: this.start_date,
            endDate: this.end_date,
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
        console.log(moment(date).startOf('month').format('YYYY-MM-DD hh:mm'));
        
       

        this.staffS.getroster({
            RosterType: this.recipient.option == '1' ? 'PORTAL CLIENT' : 'SERVICE PROVIDER',
            //AccountNo: 'ABBERTON B',
            AccountNo: this.recipient.data,
            StartDate: moment(date).startOf('month').format('YYYY/MM/DD'),
            EndDate: moment(date).endOf('month').format('YYYY/MM/DD')
        }).pipe(takeUntil(this.unsubscribe)).subscribe(roster => {

            this.rosters = roster;

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
            sql = `SELECT Distinct [Program] AS ProgName FROM RecipientPrograms 
                INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID 
                WHERE Recipients.AccountNo = '${type}' AND RecipientPrograms.ProgramStatus IN ('ACTIVE', 'WAITING LIST') ORDER BY [ProgName]`
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
        ).subscribe(d => {
            this.programsList = d;
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
            this.programsList = d[2];

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
        return this.current >= 4 || (this.rosterGroup == 'ADMINISTRATION' && this.current>=3);
    }
    get isFormValid(){
        return  this.rosterForm.valid;
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
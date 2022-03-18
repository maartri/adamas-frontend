import { Component, OnInit, OnDestroy, AfterViewInit,Input,ViewChild } from '@angular/core'

import { ListService,GlobalService, TimeSheetService,EmailService } from '@services/index';
import { forkJoin, Subject } from 'rxjs';
import { FormGroup,FormBuilder } from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO'
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import {ShiftDetail} from '../roster/shiftdetail'
import { EmailMessage,EmailAddress } from '@modules/modules';

export interface VirtualDataInterface {
  index: number;
  staff: string;
  recipient: string;
  serviceType: string;
  rosterStart: any;
  duration: any;
  rosterEnd: any;
  taMultishift: any;
}

@Component({
    styles: [`
    nz-checkbox-group >>> label {
        display: block;
        padding: 2px 1rem;
    }
    .checkbox-group{
        margin:8px;
    }
    .checkbox-group label{
        display: block;
    }
    nz-tabset{
        margin-top:1rem;
    }
    nz-tabset >>> div > div.ant-tabs-nav-container{
        height: 25px !important;
        font-size: 13px !important;
    }

    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
        line-height: 24px;
        height: 25px;
    }
    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
        background: #85B9D5;
        color: #fff;
    }
    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
      border-radius: 4px 4px 0 0;
    }
    i{
        font-size:1.2rem;
        margin-right:1rem;
        cursor:pointer;
        color:#c1c1c1;
    }
    i:hover{
        color:#4d4d4d;
    }
    nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-body{
      padding:0;
  }
  nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-footer{
      padding:0;
  }
  ul{
      list-style: none;
      padding: 5px 0 5px 15px;
      margin: 0;
  }
  li {
      padding: 4px 0 4px 10px;
      font-size: 13px;
      position:relative;
      cursor:pointer;
  }
  li:hover{
      background:#f2f2f2;
  }
  li i {
      float:right;
      margin-right:7px;
  }
  hr{
      border: none;
      height: 1px;
      background: #e5e5e5;
      margin: 2px 0;
  }
  li > ul{
      position: absolute;
      display:none;         
      right: -192px;
      padding: 2px 5px;
      background: #fff;
      top: -6px;
      width: 192px;
      transition: all 0.5s ease 3s;
  }
  li:hover > ul{           
      display:block;
      transition: all 0.5s ease 0s;
  }

  .rectangle{
    margin-top: 10px;     
    padding: 10px; 
    padding-left: 5px; 
    border-style:solid; 
    border-width: 2px; 
    border-radius: 5px;  
    border-color: rgb(236, 236, 236);
}
    `],
    templateUrl: './attendance.html'
})


export class AttendanceAdmin implements OnInit, AfterViewInit,OnDestroy {

   @ViewChild(ShiftDetail) detail!:ShiftDetail;
   

    allCheckedBranches: boolean = false;
    allCheckedTeams: boolean = false;
    allCheckedCategories: boolean = false;
    allCheckedCoordinators: boolean = false;

    loadingPending: boolean = false;

    indeterminateBranch = true;
    indeterminateTeams = true;
    indeterminateCategories = true;
    indeterminateCoordinators = true;

    date: Date = new Date();
    nzSelectedIndex: number = 0;

    dataSet: Array<any> = [];
    nzWidth:number=400;
    optionMenuDisplayed:boolean;
    menu:Subject<number>= new Subject();
    TimeAttendnaceModal:boolean;
    TimeAttendnaceLable:string='';
    clickedData:any;

    branches: Array<any> = [];
    teams: Array<any> = [];
    categories: Array<any> = [];
    coordinators: Array<any> = [];
    Interval:number=30;
    AlertInterval:number=30;
    TimeZoneOffset:number=0;
    AlertServer:boolean;
    AlertAudit:boolean;

    DateTimeForm:FormGroup;
    durationObject:any;
    today = new Date();
    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);
    dateFormat:string="dd/MM/YYYY"
    rdate:any;
    action:string;
    private unsubscribe = new Subject();

    constructor(
      private listS: ListService,
      private globalS: GlobalService,
      private formBuilder: FormBuilder,
      private timeS:TimeSheetService,
      private modalService: NzModalService,
      private emailService:EmailService
    ) {

    }

    
    ngOnInit(): void {

      this.getSetting();
      setInterval(() => {         
       // refresh data after some interval
       this.reload();
        
      }, this.Interval*1000);
      
     forkJoin([
        this.listS.getlisttimeattendancefilter("BRANCHES"),
        this.listS.getlisttimeattendancefilter("STAFFTEAM"),
        this.listS.getlisttimeattendancefilter("STAFFGROUP"),
        this.listS.getlisttimeattendancefilter("CASEMANAGERS")
      ]).subscribe(data => {
        // console.log(data);
        this.branches = data[0].map(x => {
          return {
            label: x,
            value: x,
            checked: false
          }
        });

        this.teams = data[1].map(x => {
          return {
            label: x,
            value: x,
            checked: false
          }
        });

        this.categories = data[2].map(x => {
          return {
            label: x,
            value: x,
            checked: false
          }
        });

        this.coordinators = data[3].map(x => {
          return {
            label: x,
            value: x,
            checked: false
          }
        });


      });
      this.buildForm();
      this.menu.subscribe(data => {
        this.optionMenuDisplayed=false;
      switch(data){
        case 1:
          this.nzWidth=400;
          this.TimeAttendnaceModal=true;
          this.TimeAttendnaceLable="Force Shift Logon";
          this.action="Force Logon";
          break;
        case 2:         
          this.nzWidth=600;
          this.TimeAttendnaceModal=true;
          this.TimeAttendnaceLable="Force Shift Logoff";
          this.action="Force Logoff";
          break;
        case 3:   
          this.nzWidth=600;
          this.TimeAttendnaceModal=true;
          this.TimeAttendnaceLable="Set Actual Worked Hours";
          this.action="Actual Worked Hours";
          break;
        case 4:   
          this.nzWidth=600;
          this.TimeAttendnaceModal=true;
          this.TimeAttendnaceLable="Set Actual Worked Hours";
          break;
        case 4:   
        case 5: 
          this.nzWidth=600;        
          this.action='Force Finalisation';
          this.menuAction();
          break;
        case 6:   
          this.action='Reset Pending';
          this.showConfirm_for_Pending('This will reset the service back to pending status the highlighted shift/s - do you wich to proceed');
         
          break;
        case 7: 
          this.sendEmail();
      }

      this.action=='Reset Pending'
    });

    }
    showConfirm_for_Pending(msg:string): void {
      //var deleteRoster = new this.deleteRoster();
      this.modalService.confirm({
        nzTitle: 'Confirm',
        nzContent: msg,
        nzOkText: 'Yes',
        nzCancelText: 'No',
        nzOnOk: () =>
        new Promise((resolve,reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
         
          this.menuAction()
        }).catch(() => console.log('Oops errors!'))
  
        
      });
    }
  
    ngAfterViewInit(): void {
      this.reload();
    }
    ngOnDestroy(): void {

    }

    setSetting(){
  
      localStorage.setItem('Interval', this.Interval.toString());
      localStorage.setItem('AlertInterval', this.AlertInterval.toString());
      localStorage.setItem('TimeZoneOffset', this.TimeZoneOffset.toString());
      localStorage.setItem('AlertServer', this.AlertServer.toString());
      localStorage.setItem('AlertAudit', this.AlertAudit.toString());

    }
    getSetting(){

      if (localStorage.getItem('Interval')==null) return;
  
      this.Interval=JSON.parse(localStorage.getItem('Interval'));
      this.AlertInterval=JSON.parse(localStorage.getItem('AlertInterval'));
      this.TimeZoneOffset=JSON.parse(localStorage.getItem('TimeZoneOffset'));
      this.AlertServer=JSON.parse(localStorage.getItem('AlertServer'));
      this.AlertAudit=JSON.parse(localStorage.getItem('AlertAudit'));

    }
    buildForm() {
      this.DateTimeForm = this.formBuilder.group({
          recordNo: [''],
          rdate: [''],
          time: this.formBuilder.group({
              startTime:  [''],
              endTime:  [''],
          }),
          payQty: [''],
          billQty: ['']
          
      });
  
      this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
      this.fixStartTimeDefault();   
  
      this.DateTimeForm.get('time.startTime').valueChanges.pipe(
          takeUntil(this.unsubscribe)
      ).subscribe(d => {
          
          this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
      });
      this.DateTimeForm.get('time.endTime').valueChanges.pipe(
          takeUntil(this.unsubscribe)
      ).subscribe(d => {
          this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
      });
     
  }

  fixStartTimeDefault() {
    const { time } = this.DateTimeForm.value;
    if (!time.startTime) {
        this.ngModelChangeStart(this.defaultStartTime)
    }

    if (!time.endTime) {
        this.ngModelChangeEnd(this.defaultEndTime)
    }
}

ngModelChangeStart(event): void{
  this.DateTimeForm.patchValue({
      time: {
          startTime: event
      }
  })
}
ngModelChangeEnd(event): void{
  this.DateTimeForm.patchValue({
      time: {
          endTime: event
      }
  })
}

mousedblclick(event: any, value: any) {
  event.preventDefault();
  event.stopPropagation();
 
  this.showDetail(value);
}
showDetail(data: any) {
        
  this.getRoster(data.jobno).pipe(
    takeUntil(this.unsubscribe)
).subscribe(d => {
    this.detail.isVisible=true;
    this.detail.data=this.selected_roster(d);
    this.detail.viewType ='Staff';
    this.detail.editRecord=false;
    this.detail.ngAfterViewInit();
});
  
}
shiftChanged(value:any){        
 
      this.reload();
  
}
getRoster(recordNo:any){
 
  return this.timeS.getrosterRecord(recordNo);
  
      
}
selected_roster(r:any):any{
  let rst:any;
    
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

sendEmail(){

  let emailsMsg:EmailMessage =  <EmailMessage>{} ;
  let emailFrom:EmailAddress =  <EmailAddress>{};
  let emailTo:EmailAddress  =  <EmailAddress>{};

  emailFrom.Address="arshad@adamas.net.au";
  emailFrom.Name="Arshad Abbas";

  emailTo.Address="arshadblouch81@gmail.com";
  emailTo.Name="Arshad Abbas2";

  emailsMsg.FromAddresses=[];
  emailsMsg.ToAddresses=[];
  emailsMsg.FromAddresses.push(emailFrom);
  emailsMsg.ToAddresses.push(emailTo);

  emailsMsg.Content="Testing email from web portal";
  emailsMsg.Notes="Testing email note from web portal";
  emailsMsg.Subject="Testing email";
  emailsMsg.LeaveType="Causal Leave";
  
  this.emailService.sendMail(emailsMsg).subscribe(d=>{
   console.log(d);
  })

}
TimeDifference(data:any,  t:number=0){
      let diff:number=0
      let StartTime ;
      let EndTime;
      if (t==1) {
        StartTime = parseISO(new Date(data.date + ' ' + data.rosterEnd).toISOString());
        EndTime = parseISO (new Date(data.actualEnd).toISOString());
      }else{
        StartTime = parseISO(new Date(data.date + ' ' + data.rosterStart).toISOString());
        EndTime = parseISO (new Date(data.actualStart).toISOString());
      }
       
      diff = this.globalS.computeTimeDifference(StartTime, EndTime);
     
      return diff;
    }
    numStr(n:number):string {
      let val="" + n;
      if (n<10) val = "0" + n;
      
      return val;
    }
    BlockToTime(blocks:number){
      return this.numStr(Math.floor(blocks/12)) + ":" + this.numStr((blocks%12)*5)
     }
    view(index: number) {
      this.nzSelectedIndex = index;
      this.reload();
    }
    
    rightClickMenu(event: any, value: any) {
      this.optionMenuDisplayed=true;
      event.preventDefault();
      this.clickedData=value;
      console.log(value);
      let date=this.clickedData.date;
      this.defaultStartTime = parseISO(new Date(date + " " + this.clickedData.rosterStart).toISOString());
      this.defaultEndTime = parseISO(new Date(date + " " + this.clickedData.rosterEnd).toISOString());

      this.DateTimeForm.patchValue({
        rdate:this.clickedData.date,
        payQty: this.roundTo(this.clickedData.pay,2),
        billQty:this.roundTo(this.clickedData.bill,2)

      })
      
  
    }
    roundTo (num: number, places: number) {
      const factor = 10 ** places;
      return Math.round(num * factor) / factor;
    }

    menuAction(){

      let rosteredstart=moment(this.defaultStartTime).format('YYYY/MM/DD HH:mm');
      let rosteredend=moment(this.defaultEndTime).format('YYYY/MM/DD HH:mm');

     switch (this.action){
       case 'Force Logon' :
      {
        this.forceLogOn(rosteredstart);
        break;
      }
      case 'Force Logoff':
      {
          this.forceLogOff(rosteredend);
              break;
     }
   case 'Actual Worked Hours' :
      {
        this.actualWorkedHours(rosteredstart,rosteredend);
        break;
     }
     case 'Force Finalisation' :
      {
        this.forceFinalisation(rosteredstart,rosteredend);
        break;
     }
  case 'Reset Pending':
    {
      this.resetPending()
      break;
    }
  }
}

forceLogOn(timestamp:string){    

      let input= {
        Recordno: this.clickedData.jobno,
        cancel:false,
        timeStamp : timestamp,
        latitude:'',
        longitude:'',
        location:''
       }
        this.timeS.processStartJob(input).pipe(
          takeUntil(this.unsubscribe)).subscribe(d => {
            if (this.action!='Force Finalisation'){
              this.TimeAttendnaceModal=false;
              this.reload();
            }
        });

    }
    forceLogOff(timestamp:string){
      

      let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        
        sql.TableName='eziTracker_Log ';          
     
        sql.SetClause=`SET 
            LODateTime = '${timestamp}', 
            LOActualDateTime = '${this.clickedData.date + ' ' + this.clickedData.rosterEnd}',  
            RosteredEnd = '${this.clickedData.date + ' ' + this.clickedData.rosterEnd}',
            WorkDuration = ${this.durationObject.durationInHours},
            ErrorCode = 1
             `;

        sql.WhereClause=`WHERE JobNo = ${this.clickedData.jobno}`;
        this.listS.updatelist(sql).pipe(
          takeUntil(this.unsubscribe)).subscribe(d => {
            if (this.action!='Force Finalisation')
              this.TimeAttendnaceModal=false;
            
            this.reload();
      
       });

    }
    actualWorkedHours(rosteredstart:string,rosteredend:string){
      
      let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
      
      sql.TableName='eziTracker_Log ';         

      let duration=this.durationObject.durationStr.split(" ");
      let durationstr= this.numStr(duration[0]) + ":" + this.numStr(duration[2]);

       sql.SetClause=`SET 
          DateTime ='${rosteredstart}', 
          ActualDateTime = '${moment(this.clickedData.actualStart).format('YYYY/MM/DD HH:mm')}', 
          LODateTime = '${rosteredend}', 
          LOActualDateTime = '${this.clickedData.date + ' ' + this.clickedData.rosterEnd}',  
          RosteredEnd = '${this.clickedData.date + ' ' + this.clickedData.rosterEnd}',  
          WorkDuration = ${this.durationObject.durationInHours}, 
          WorkDurationHHMM = '${durationstr}', 
          ErrorCode = 1 
          `;


      sql.WhereClause=`WHERE JobNo = ${this.clickedData.jobno}`;
      this.listS.updatelist(sql).pipe(
        takeUntil(this.unsubscribe)).subscribe(d => {
          this.TimeAttendnaceModal=false;
            this.reload();
    
     });
    }
forceFinalisation(rosteredstart:string,rosteredend:string){
  this.forceLogOn(rosteredstart);
  this.forceLogOff(rosteredend);
  
}
resetPending(){
  let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
     
    sql.TableName='Roster '; 
    sql.SetClause=`set ros_panztel_updated = 0 `;
    sql.WhereClause=`WHERE RecordNo = ${this.clickedData.jobno}`;

 
  setTimeout(() =>{ 
      this.listS.updatelist(sql).pipe(
        takeUntil(this.unsubscribe)).subscribe(d => {});

          sql.TableName='eziTracker_Log ';    
          sql.SetClause='';
          sql.WhereClause=`WHERE JobNo = ${this.clickedData.jobno}`;
          this.listS.deletelist(sql).pipe(
            takeUntil(this.unsubscribe)).subscribe(d => {
              this.TimeAttendnaceModal=false;
                this.reload();
        
        });
    },100);
}

// Branches
    updateAllBranches(): void {
        this.indeterminateBranch = false;

        if (this.allCheckedBranches) {
          this.branches = this.branches.map(item => {
            return {
              ...item,
              checked: true
            };
          });
        } else {
          this.branches = this.branches.map(item => {
            return {
              ...item,
              checked: false
            };
          });
        }
    }

    updateSingleCheckedBranches(): void {
          if (this.branches.every(item => !item.checked)) {
            this.allCheckedBranches = false;
            this.indeterminateBranch = false;
          } else if (this.branches.every(item => item.checked)) {
            this.allCheckedBranches = true;
            this.indeterminateBranch = false;
          } else {
            this.indeterminateBranch = true;
          }
    }
    // End Branches

    // Teams
    updateAllTeams(): void {
        this.indeterminateTeams = false;

        if (this.allCheckedTeams) {
          this.teams = this.teams.map(item => {
            return {
              ...item,
              checked: true
            };
          });
        } else {
          this.teams = this.teams.map(item => {
            return {
              ...item,
              checked: false
            };
          });
        }
    }

    updateSingleCheckedTeams(): void {
          if (this.branches.every(item => !item.checked)) {
            this.allCheckedTeams = false;
            this.indeterminateTeams = false;
          } else if (this.branches.every(item => item.checked)) {
            this.allCheckedTeams = true;
            this.indeterminateTeams = false;
          } else {
            this.indeterminateTeams = true;
          }
    }
    // End Teams


    // Categories
    updateAllCategories(): void {
        this.indeterminateCategories = false;

        if (this.allCheckedCategories) {
          this.categories = this.categories.map(item => {
            return {
              ...item,
              checked: true
            };
          });
        } else {
          this.categories = this.categories.map(item => {
            return {
              ...item,
              checked: false
            };
          });
        }
    }

    updateSingleCheckedCategories(): void {
          if (this.categories.every(item => !item.checked)) {
            this.allCheckedCategories = false;
            this.indeterminateCategories = false;
          } else if (this.categories.every(item => item.checked)) {
            this.allCheckedCategories = true;
            this.indeterminateCategories = false;
          } else {
            this.indeterminateCategories = true;
          }
    }
    // End Categories


    // Categories
    updateAllCoordinators(): void {
      this.indeterminateCoordinators = false;

        if (this.allCheckedCoordinators) {
          this.coordinators = this.coordinators.map(item => {
            return {
              ...item,
              checked: true
            };
          });
        } else {
          this.coordinators = this.coordinators.map(item => {
            return {
              ...item,
              checked: false
            };
          });
        }
    }

    updateSingleCheckedCoordinators(): void {
          if (this.coordinators.every(item => !item.checked)) {
            this.allCheckedCoordinators = false;
            this.indeterminateCoordinators = false;
          } else if (this.coordinators.every(item => item.checked)) {
            this.allCheckedCoordinators = true;
            this.indeterminateCoordinators = false;
          } else {
            this.indeterminateCoordinators = true;
          }
    }
    // End Categories


    
    reload(){
      this.loadingPending = true;
      
      let input = {
        Date:  format(this.date,'yyyy/MM/dd'),
        LocalTimezoneOffset: 0,
        Coordinators: this.coordinators.filter(item => item.checked).map(x => x.label).join(','),
        Branches: this.branches.filter(item => item.checked).map(x => x.label).join(','),
        Categories: this.categories.filter(item => item.checked).map(x => x.label).join(','),
        TAType:this.nzSelectedIndex
      };
      this.dataSet=[];
      this.listS.postmtapending(input).subscribe(data => {
        console.log(data)
        this.dataSet = data;
        this.loadingPending = false;
      }, () => {
        this.loadingPending = false;
      });
    }

    trackByIndex(_: number, data: VirtualDataInterface): number {
      return data.index;
  }
 

    
}
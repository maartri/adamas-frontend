import { Component, OnInit, OnDestroy, AfterViewInit,Input } from '@angular/core'

import { ListService,GlobalService } from '@services/index';
import { forkJoin, Subject } from 'rxjs';
import { FormGroup,FormBuilder } from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO'
//import { type } from 'os';


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

    DateTimeForm:FormGroup;
    durationObject:any;
    today = new Date();
    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);
    dateFormat:string="dd/MM/YYYY"
    rdate:any;
    private unsubscribe = new Subject();

    constructor(
      private listS: ListService,
      private globalS: GlobalService,
      private formBuilder: FormBuilder,
    ) {

    }

    ngOnInit(): void {
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
          break;
        case 2:         
          this.nzWidth=600;
          this.TimeAttendnaceModal=true;
          this.TimeAttendnaceLable="Force Shift Logoff";
          break;
        case 3:   
          this.nzWidth=600;
          this.TimeAttendnaceModal=true;
          this.TimeAttendnaceLable="Set Actual Worked Hours";
          break;
        case 4:   
          this.nzWidth=600;
          this.TimeAttendnaceModal=true;
          this.TimeAttendnaceLable="Set Actual Worked Hours";
          break;
      }
    });

    }
    ngAfterViewInit(): void {
      this.reload();
    }
    ngOnDestroy(): void {

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
        payQty:this.clickedData.pay,
        billQty:this.clickedData.bill

      })
      
  
    }

    menuAction(){

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
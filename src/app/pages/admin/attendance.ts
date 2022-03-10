import { Component, OnInit, OnDestroy, AfterViewInit,Input } from '@angular/core'

import { ListService } from '@services/index';
import { forkJoin } from 'rxjs';

import { format } from 'date-fns';
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
    

    checkOptionsOne = [
        { label: 'Apple', value: 'Apple', checked: true },
        { label: 'Pear', value: 'Pear', checked: false },
        { label: 'Orange', value: 'Orange', checked: false }
    ];

    branches: Array<any> = [];
    teams: Array<any> = [];
    categories: Array<any> = [];
    coordinators: Array<any> = [];
    

    constructor(
      private listS: ListService
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
    }
    ngAfterViewInit(): void {
      this.reload();
    }
    ngOnDestroy(): void {

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
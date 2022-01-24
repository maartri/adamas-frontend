import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { ListService } from '@services/index';
import { forkJoin, timer, Observable, of, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { format } from 'date-fns';

const timerValue: number = 10000;

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


export class AttendanceAdmin implements OnInit, OnDestroy {

    allCheckedBranches: boolean = true;
    allCheckedTeams: boolean = true;
    allCheckedCategories: boolean = true;
    allCheckedCoordinators: boolean = true;

    loadingPending: boolean = false;

    indeterminateBranch = false;
    indeterminateTeams = false;
    indeterminateCategories = false;
    indeterminateCoordinators = false;

    date: Date = new Date();
    nzSelectedIndex: number = 0;

    dataSet: Array<any> = [];



    branches: Array<any> = [];
    teams: Array<any> = [];
    categories: Array<any> = [];
    coordinators: Array<any> = [];


    joinedWithIntervalNeverCompleting$: Subscription;
    destroyTimer$ = new Subject();

    constructor(
      private listS: ListService
    ) {

    }

    ngOnInit(): void {

      this.joinedWithIntervalNeverCompleting$  = forkJoin([
        this.listS.getlisttimeattendancefilter("BRANCHES"),
        this.listS.getlisttimeattendancefilter("STAFFTEAM"),
        this.listS.getlisttimeattendancefilter("STAFFGROUP"),
        this.listS.getlisttimeattendancefilter("CASEMANAGERS")
      ]).pipe(
        switchMap(data => {

          this.branches = data[0].map(x => {
            return {
              label: x,
              value: x,
              checked: true
            }
          });
  
          this.teams = data[1].map(x => {
            return {
              label: x,
              value: x,
              checked: true
            }
          });
  
          this.categories = data[2].map(x => {
            return {
              label: x,
              value: x,
              checked: true
            }
          });
  
          this.coordinators = data[3].map(x => {
            return {
              label: x,
              value: x,
              checked: true
            }
          });


          return of(data)
        })
      ).subscribe(d => {
        timer(0,timerValue).pipe(takeUntil(this.destroyTimer$))
          .subscribe(d => this.reload())
        })
    }

    ngOnDestroy(): void {

      this.destroyTimer$.next();
      this.destroyTimer$.unsubscribe();
      this.joinedWithIntervalNeverCompleting$.unsubscribe();

    }

    view(index: number) {
      this.nzSelectedIndex = index;
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
      this.loadingPending = false;

      let data = {
        Date:  format(this.date,'yyyy/MM/dd'),
        LocalTimezoneOffset: 0,
        Coordinators: this.coordinators.filter(item => item.checked).map(x => x.label).join(','),
        Branches: this.branches.filter(item => item.checked).map(x => x.label).join(','),
        Categories: this.categories.filter(item => item.checked).map(x => x.label).join(',')
      };
      
      this.listS.postmtapending(data).subscribe(data => {
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
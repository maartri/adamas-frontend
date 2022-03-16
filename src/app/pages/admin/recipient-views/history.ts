import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import * as groupArray from 'group-array';
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';

 

@Component({
    styleUrls:['./history.css'],
    templateUrl: './history.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RecipientHistoryAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;
    originalTableData: Array<any>;
    
    checked: boolean = false;
    isDisabled: boolean = false;

    loading: boolean = false;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private cd: ChangeDetectorRef
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'history')) {
                this.search(data);
            }
        });
    }

    ngOnInit(): void {        
        this.user = this.sharedS.getPicked();
        this.search(this.user);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    search(user: any) {
        this.loading = true;

        this.clientS.gethistory(user.code).subscribe(data => {

            console.log(data.list)
            this.tableData = data.list;
            this.originalTableData = data.list;

            this.loading = false;

            // console.log(groupArray(data.list, 'event', 'program'))

    

            this.cd.markForCheck();
        });
    }

    trackByFn(index, item) {
        return item.id;
    }


   todo: Array<string> = [];

  done = [
    'Date',
    'Program',
    'Event',
    'Staff',
    'Amount',
    'Notes'
  ];


  flattenObj = (obj, parent = null, res = {}) => {
    for (const key of Object.keys(obj)) {
      const propName = parent ? parent + '.' + key : key;
      if (typeof obj[key] === 'object') {
        this.flattenObj(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }

    drop(event: CdkDragDrop<string[]>) {

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);            
        } else {
            if(!event.container.data.includes(event.item.data)){
                copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.container.data.length)
            }
        }

        this.generate();
        
    }

    generate(){
        const todo = this.todo.map(x => x.toLowerCase());      

        var convertedObj = groupArray(this.originalTableData, todo);
        var flatten = this.flatten(convertedObj, [], 1);

        // console.log(convertedObj)
        // console.log(flatten);

        if(todo.length == 0){
            this.tableData = this.originalTableData;
        } else {
            this.tableData = flatten;
        }

        console.log(this.tableData)
    }

    dropFromTable(event: CdkDragDrop<string[]>){
        console.log(event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            } else {
            transferArrayItem(event.previousContainer.data,
                                event.container.data,
                                event.previousIndex,
                                event.currentIndex);
            }

            console.log(groupArray(this.tableData, this.todo));
    }

    flatten(obj: any, res: Array<any> = [], counter = null){
        for (const key of Object.keys(obj)) {
            const propName = key;
            if(typeof propName == 'string'){                
                res.push({titlezzzfsdfsdfsdf: propName, counter: counter })
            }
            if (!Array.isArray(obj[key])) {
                this.flatten(obj[key], res, counter);
            } else {
                res.push(obj[key]);
            }
          }
          return res;
    }

    removeTodo(data: any){
        this.todo.splice(this.todo.indexOf(data),1);
        this.generate();
    }

    isArray(data: any){
        return Array.isArray(data);
    }
 
    isSome(data: any){
        if(data){
            return data.some(d => 'titlezzzfsdfsdfsdf' in d);
        }
        return true;
        
    }

}
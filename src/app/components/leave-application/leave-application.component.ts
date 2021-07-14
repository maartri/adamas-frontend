import { Component, OnInit, SimpleChanges,OnChanges, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {forkJoin,  Observable ,  merge ,  Subject, Subscriber, Subscription } from 'rxjs';

import { ListService, GlobalService, TimeSheetService } from '../../services/index';

import lastDayOfMonth from 'date-fns/lastDayOfMonth'
import startOfMonth from 'date-fns/startOfMonth'
import format from 'date-fns/format'

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveApplicationComponent implements OnInit, OnChanges {

  @Input() open: boolean = false;
  @Input() user: any;
  
  leaveGroup: FormGroup;
  isLoading: boolean = false;

  dateFormat: string = 'MMM dd yyyy';

  leave_dd: any = {
      paycode: [],
      programs: [],
      activitycode: [],
      leaveActivityCodes: [],
      leaveBalances: []
  }

  constructor(
    private fb: FormBuilder,
    private listS: ListService,
    private globalS: GlobalService,
    private timeS: TimeSheetService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.resetGroup();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.open = true;
        this.resetGroup();
        this.populate();
      }
    }
  }

  detectChanges(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  resetGroup() {
    this.leaveGroup = this.fb.group({
        user: '',
        staffcode: '',
        dates: [
          [startOfMonth(new Date()), lastDayOfMonth(new Date())], [Validators.required]],
        reminderDate:new Date(),
        approved:false,
        makeUnavailable: true,
        unallocAdmin: false,
        unallocUnapproved: true,
        unallocMaster: false,
        explanation: '',
        activityCode: '',
        payCode: '',
        program: '',
        programShow: false
    });
  }
  // showAddModal();
  handleCancel(){
    this.open = false;
    this.detectChanges();
  }

  populate(){

    let dates = {
      StartDate: format(this.leaveGroup.value.dates[0],'MM-dd-yyyy'),
      EndDate: format(this.leaveGroup.value.dates[1],'MM-dd-yyyy')      
    };

    forkJoin([
        this.listS.getpaycode(dates),
        this.listS.getprograms(dates),
        this.listS.getleaveactivitycodes(dates),
        this.listS.getleavebalances(this.user.id)
    ]).subscribe(data => {
        this.leave_dd = {
            paycode: data[0],
            programs: data[1],
            leaveActivityCodes: data[2],
            leaveBalances: data[3]
        }      
    });
  }

  save(){

    // this.handleCancel();
    // return;

    const { dates, program, programShow, explanation, payCode, activityCode, unallocAdmin, unallocMaster,makeUnavailable, unallocUnapproved } = this.leaveGroup.value;
    const { tokenUser, user } = this.globalS.decode();


    const inputs = {
        fromDate: format(dates[0],'yyyy/MM/dd'),
        toDate: format(dates[1],'yyyy/MM/dd'),
        program: programShow ? program : '',
        staffcode: this.user.code,
        user: user,
        explanation: explanation,
        payCode: payCode,
        activityCode: activityCode,
        unallocAdmin: unallocAdmin,
        makeUnavailable: makeUnavailable,
        unallocMaster: unallocMaster,
        unallocUnapproved: unallocUnapproved
    };

    // console.log(this.globalS.decode());

    this.timeS.postleaveentry(inputs)
        .subscribe(data => {
            this.globalS.sToast('Success','Leave processed');
            this.handleCancel();
        }, error =>{
            this.globalS.eToast('Error',`${error.error.message}`)
            this.handleCancel();
        });
  }

}

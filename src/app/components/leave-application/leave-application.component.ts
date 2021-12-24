import { Component, OnInit, SimpleChanges,OnChanges, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {forkJoin,  Observable ,  merge ,  Subject, Subscriber, Subscription } from 'rxjs';

import { ListService, GlobalService, TimeSheetService } from '../../services/index';

import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import startOfMonth from 'date-fns/startOfMonth';
import format from 'date-fns/format';

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

interface Process {
  process: Mode
}
enum Mode{
  UPDATE = "UPDATE",
  ADD = "ADD"
}
@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LeaveApplicationComponent implements OnInit, OnChanges {

  currentDate = new Date();

  @Input() open: boolean = false;
  @Input() user: any;
  @Input() operation: Process;

  @Output() refresh = new EventEmitter();
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
    this.leaveGroup = this.fb.group({
      recordNumber: 0,
      user: '',
      staffcode: '',
      dates: [
        [new Date(), new Date()], [Validators.required]
      ],
      reminderDate: null,
      approved:false,
      makeUnavailable: true,
      unallocAdmin: false,
      unallocUnapproved: true,
      unallocMaster: false,
      explanation: '',
      activityCode: null,
      payCode: null,
      program: null,
      programShow: false
  });

    // this.resetGroup();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.open = true;
        
      }
      if (property == 'operation' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.operation = changes[property].currentValue;
        if(this.operation.process == 'UPDATE'){
          console.log('update')
          this.patchForm();
        }
        if(this.operation.process == 'ADD'){
          console.log('add')
          
          this.resetGroup();
        }
      }
    }
  }

  resetGroup() {
    var startDate = new Date();
    var lastDate = new Date();

    this.leaveGroup.reset({
        recordNumber: 0,
        user: '',
        staffcode: '',
        dates: [startDate, lastDate],
        reminderDate: null,
        approved:false,
        makeUnavailable: true,
        unallocAdmin: false,
        unallocUnapproved: true,
        unallocMaster: false,
        explanation: '',
        activityCode: null,
        payCode: null,
        program: null,
        programShow: false
    });
    this.populate();
    this.detectChanges();
  }

  patchForm(){
    this.timeS.getleaveapplicationByid(this.user.code,this.user.recordNo).subscribe(data => {
      console.log(data)
      this.leaveGroup.patchValue({
        user: '',
        staffcode: '',
        reminderDate:data.reminderDate,
        approved:data.approved,
        makeUnavailable: data.makeUnavailable,
        unallocAdmin: false,
        unallocUnapproved: data.unallocUnapproved,
        unallocMaster: false,
        explanation:data.leaveType,
        activityCode: data.address2,
        payCode: data.address1,
        program: '',
        programShow: false,
        dates: [new Date(data.startDate), new Date(data.endDate)],
        recordNumber: data.recordNumber
      });
      // console.log(this.leaveGroup.value)
      this.populate();
      this.detectChanges();
    });
  }

  handleCancel(){
    this.open = false;
    this.detectChanges();
  }

  populate(){
    console.log(this.leaveGroup)
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
        this.detectChanges();
    });
  }

  save(){

    const { dates, program, programShow, explanation, payCode, activityCode, unallocAdmin, unallocMaster,makeUnavailable, unallocUnapproved, recordNumber, reminderDate } = this.leaveGroup.value;
    const { tokenUser, user } = this.globalS.decode();


    let inputs = {
        fromDate: format(dates[0],'yyyy/MM/dd'),
        toDate: format(dates[1],'yyyy/MM/dd'),
        reminderDate: reminderDate,
        program: !programShow ? program : '',
        staffcode: this.user.code,
        user: user,
        explanation: explanation,
        payCode: payCode,
        activityCode: activityCode,
        unallocAdmin: unallocAdmin,
        makeUnavailable: makeUnavailable,
        unallocMaster: unallocMaster,
        unallocUnapproved: unallocUnapproved,
        recordNumber: recordNumber
    };

    // console.log(inputs);
    if(this.operation.process == 'ADD'){
      this.timeS.postleaveentry(inputs)
        .subscribe(data => {
            this.globalS.sToast('Success','Leave processed');
            this.refresh.emit('reload');
            this.handleCancel();
        }, error =>{
            // this.globalS.eToast('Error',`${error.error.message}`)
            this.handleCancel();
        });
    }

    if(this.operation.process == 'UPDATE'){
      this.timeS.putleaveentry(inputs)
          .subscribe(data => {
              this.globalS.sToast('Success','Leave processed');
              this.refresh.emit('reload');
              this.handleCancel();
          }, error =>{
              this.globalS.eToast('Error',`${error.error.message}`)
              this.handleCancel();
          });
    }
    
  }

  detectChanges(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  disabledDate = (current: Date): boolean => {
      // Can not select days before today and today
      return differenceInCalendarDays(current, new Date()) < 0;
  };

}

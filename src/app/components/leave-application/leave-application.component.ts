import { Component, OnInit, SimpleChanges,OnChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {forkJoin,  Observable ,  merge ,  Subject, Subscriber, Subscription } from 'rxjs';

import { ListService, GlobalService, TimeSheetService } from '../../services/index';

import lastDayOfMonth from 'date-fns/lastDayOfMonth'
import startOfMonth from 'date-fns/startOfMonth'
import format from 'date-fns/format'

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css']
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
    private timeS: TimeSheetService
  ) { }

  ngOnInit(): void {
    this.resetGroup();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        console.log('haha')
        this.open = true;
        this.resetGroup();
        this.populate();
      }
    }
  }

  resetGroup() {
    this.leaveGroup = this.fb.group({
        user: '',
        staffcode: '',

        dates: [
          [startOfMonth(new Date()), lastDayOfMonth(new Date())], [Validators.required]],

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

  handleCancel(){
    this.open = false;
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
    const { dates, program, programShow} = this.leaveGroup.value;
    const { tokenUser } = this.globalS.decode();


    const inputs = {
        fromDate: format(dates[0],'yyyy/MM/dd'),
        toDate: format(dates[1],'yyyy/MM/dd'),
        program: programShow ? program : '',
        staffcode: this.user.code,
        user: tokenUser
    };

    this.timeS.postleaveentry(inputs)
        .subscribe(data => {
            this.globalS.sToast('Success','Leave processed');
            this.handleCancel();
        }, error =>{
            this.globalS.eToast('Error',`${error.error.message}`)
        });
  }

}

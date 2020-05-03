import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { mergeMap, takeUntil, concatMap, switchMap } from 'rxjs/operators';
import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';

const noop = () => {
};

@Component({
  selector: 'app-search-timesheet',
  templateUrl: './search-timesheet.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SearchTimesheetComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./search-timesheet.component.css']
})
export class SearchTimesheetComponent implements OnInit {
  
  private onTouchedCallback: any = () => { };
  private onChangeCallback: any = () => { };
  private innerValue: any;
  private unsubscribe: Subject<void> = new Subject();

  // 0 == staff 1 == recipient
  @Input() view: number;
  @Output() selected = new EventEmitter<any>();

  searchModel: any;
  lists: Array<any> = [];
  loading: boolean = false;

  switchStr: string;

  constructor(
    private cd: ChangeDetectorRef,
    private timeS: TimeSheetService,
    private globalS: GlobalService
  ) { 
    cd.detach();
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.lists = [];

    this.cd.reattach();
    this.loading = true;
    if (this.view == 0) {

      this.timeS.getfilteredstaff({
        User: '',
        SearchString: '',
        IncludeActive: false,
        Status: ''
      }).subscribe(data => { 
        this.lists = data;
        this.loading = false;
        this.cd.detectChanges();
      });

    } else if (this.view == 1) {

      this.timeS.getfiltteredrecipient({
        User: '',
        SearchString: '',
        IncludeActive: false,
        Status: ''
      }).subscribe(data => {
        this.lists = data;
        this.loading = false;
        this.cd.detectChanges();
      });

    }
  }
  
  change(user: any) {

    const sel = {
      option: this.view == 0 ? 0 : 1,
      data: user
    };

    this.selected.emit(sel);
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this.cd.reattach();
    if (value != null) {
      this.innerValue = value;
      // this.tab = 1;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  switch() {
    const sel = {
      option: this.view,
      data: ''
    };

    this.selected.emit(sel);

    this.searchModel = null;
    this.view = this.view == 0 ? 1 : 0;
    this.search();
  }

  viewResult(): string {
    return this.view == 0 ? 'Search Staff' :
      'Search Recipient';
  }

}

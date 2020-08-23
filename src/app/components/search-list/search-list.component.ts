import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { mergeMap, takeUntil, concatMap, switchMap, debounceTime } from 'rxjs/operators';
import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';

const noop = () => {
};

interface SearchProperties{
  uniqueID: string,
  accountNo: string,
  agencyDefinedGroup: string,
  sysmgr: boolean,
  view: string
}

interface Refresh {
  refresh: boolean
}

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SearchListComponent),
    }
  ],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchListComponent implements OnInit , AfterViewInit, OnDestroy, ControlValueAccessor {

  private onTouchedCallback: any = () => { };
  private onChangeCallback: any = () => { };
  private unsubscribe: Subject<void> = new Subject();
  private searchChangeEmit: Subject<void> = new Subject();

  // 0 if recipient / 1 if staff
  @Input() view: number;
  searchModel: any;
  listsAll: Array<any> = [];
  lists: Array<any> = [];
  loading: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private timeS: TimeSheetService,
    private globalS: GlobalService
  ) { 

    this.searchChangeEmit.pipe(
      debounceTime(100)
    ).subscribe(data => {
      if(this.globalS.isEmpty(data)){
        this.lists = this.listsAll.slice(0, 200);
      } else {
        this.lists = this.listsAll.filter(x => x.accountNo).filter(x => (x.accountNo).toLowerCase().indexOf(data) > -1);
      }
      
    })
  }

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit(): void{
    // const user: SearchProperties = {
    //   agencyDefinedGroup: 'event.agencyDefinedGroup',
    //   accountNo: 'event.accountNo',
    //   uniqueID: 'event.uniqueID',
    //   sysmgr: true,
    //   view: this.view == 0 ? 'recipient' : 'staff'
    // }

    // this.onChangeCallback(user);
  }

  ngOnDestroy(): void{
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  change(event: SearchProperties) {
    console.log(event);
    // let user: SearchProperties | null;

    // if (!event) {
    //   user = null;
    // } else {
    //   user = {
    //     agencyDefinedGroup: event.agencyDefinedGroup,
    //     accountNo: event.accountNo,
    //     uniqueID: event.uniqueID,
    //     sysmgr: true,
    //     view: this.view == 0 ? 'recipient' : 'staff'
    //   }
    // }

    // this.onChangeCallback(user);
  }

  search() {
    this.loading = true;
    if (this.view == 0) {
      this.searchRecipient();
    }

    if (this.view == 1) {
      this.searchStaff();
    }
  }

  searchChange(data: any){
    console.log(data);
    this.searchChangeEmit.next(data);
  }

  searchStaff(initLoad: boolean = false) {
    this.lists = []
    this.timeS.getstaff({
      User: this.globalS.decode().nameid,
      SearchString: ''
    }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.listsAll = data;
      this.lists = data;

      this.loading = false;
      this.cd.markForCheck();
    });
  }

  searchRecipient(initLoad: boolean = false, accountName: any = null): void {
    this.lists = []
    this.timeS.getrecipients({
      User: this.globalS.decode().nameid,
      SearchString: ''
    }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.listsAll = data;
      this.lists = data.slice(0, 200);

      this.loading = false;
      this.cd.markForCheck();
    });
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this.cd.detectChanges();

    if (value != null) {
      this.searchModel = value;
    }

    if (value instanceof Object) {
      this.searchModel = null;
      this.onChangeCallback(null);
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

  viewResult(): string{
    return this.view == 0 ? 'Search Recipient' :
      'Search Staff';
  }


}

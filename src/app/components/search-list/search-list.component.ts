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
export class SearchListComponent implements OnInit , OnChanges, AfterViewInit, OnDestroy, ControlValueAccessor {

  private onTouchedCallback: any = () => { };
  private onChangeCallback: any = () => { };
  private unsubscribe: Subject<void> = new Subject();
  private searchChangeEmit: Subject<void> = new Subject();

  // 0 if recipient / 1 if staff
  @Input() view: number;
  @Input() reload: boolean;

  phoneModal: boolean = false;
  isOpen: boolean = false;
  phoneSearch: string;
  searchModel: any;
  staffType = 'A';
  listsAll: Array<any> = [];
  lists: Array<any> = [];
  loading: boolean = false;

  pageCounter: number = 1;
  take: number = 50;
  activeInactive: boolean;

  // nzFilterOption  = () => true;
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
    });
  }

  ngOnInit(): void {
    this.search();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'reload' && 
        !changes[property].firstChange && 
        changes[property].currentValue != null) {
          this.search();
      }
    }
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
    console.log('destroy search-list')
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  change(event: SearchProperties) {

    let user: SearchProperties | null;

    if (!event) {
      user = null;
    } else {
      user = {
        agencyDefinedGroup: event.agencyDefinedGroup,
        accountNo: event.accountNo,
        uniqueID: event.uniqueID,
        sysmgr: true,
        view: this.view == 0 ? 'recipient' : 'staff'
      }
    }
    this.searchModel = user.accountNo;

    this.onChangeCallback(user);
  }
  changeStatus(event){
    if(event == 'A')
    this.activeInactive = false;
    else
    this.activeInactive = true;
    this.search();
  }
  search(search: string = null) {
    this.loading = true;
    if (this.view == 0) {
      this.searchRecipient(search);
    }

    if (this.view == 1) {
      this.searchStaff(search);
    }
  }

  // searchChange(data: any){
  //   this.searchChangeEmit.next(data);
  // }

  searchStaff(search: any = null) {
    this.lists = [];   

    this.timeS.getstaff({
      User: this.globalS.decode().nameid,
      SearchString: '',
      IncludeInactive:this.activeInactive,
    }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.listsAll = data;
      this.lists = data;

      this.loading = false;
      this.cd.markForCheck();
    });

    // this.timeS.getstaffpaginate({
    //   User: this.globalS.decode().nameid,
    //   SearchString: '',
    //   Skip: this.pageCounter,
    //   Take: this.take
    // }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //   this.lists = this.lists.concat(data);
    //   this.loading = false;
    //   this.cd.markForCheck();
    // });
    
  }

  loadMore(){
    this.pageCounter = this.pageCounter + 1;
    this.timeS.getstaffpaginate({
      User: this.globalS.decode().nameid,
      SearchString: '',
      Skip: this.pageCounter,
      Take: this.take
    }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.lists = this.lists.concat(data);
      this.loading = false;
      this.cd.markForCheck();
    });
  }

  searchRecipient(search: any = null): void {
    this.lists = []
    this.timeS.getrecipients({
      User: this.globalS.decode().nameid,
      SearchString: ''
    }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      if(search){
        var index = data.findIndex(x => x.uniqueID == search.id);
        this.change(data[index]);
      }

      this.lists = data;
      this.loading = false;
      this.cd.markForCheck();
    });
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this.cd.detectChanges();
    if (value != null) {
      this.search(value);
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
    return this.view == 0 ? 'Search Recipient' : 'Search Staff';
  }


  clearPhoneModal(){
    this.phoneModal = false;
  }

  listPhoneRecipientsList: Array<any>;
  searchPhone(){
    this.timeS.getrecipientsbyphone(this.phoneSearch)
        .subscribe(data => {
          // this.lists = data;
          this.listPhoneRecipientsList = data;
          this.cd.markForCheck();
        });

  }

  selectedIndex: number = null;
  selected(index: number){
    this.selectedIndex = index;
  }

  gotoRecipient(){
    let selected = this.listPhoneRecipientsList[this.selectedIndex];
    this.searchModel = this.lists[this.lists.map(x => x.uniqueID).indexOf(selected.uniqueID)];

    this.change(this.searchModel);
  }
}

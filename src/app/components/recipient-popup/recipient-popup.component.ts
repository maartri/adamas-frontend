import { Component, OnInit, ViewEncapsulation, forwardRef, OnDestroy } from '@angular/core';
import { ListService, GlobalService } from '@services/index';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject, EMPTY } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';

const noop = () => {
};

@Component({
  selector: 'app-recipient-popup',
  templateUrl: './recipient-popup.component.html',
  styleUrls: ['./recipient-popup.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecipientPopupComponent),
      multi: true
    }
  ]
})
export class RecipientPopupComponent implements OnInit, OnDestroy,ControlValueAccessor {
  
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private destroy$ = new Subject();
  
  private searchText = new Subject<string>();

  value: any = '';
  isVisible: boolean = false;
  recipientSearchList: Array<any> = [];
  counterRecipient: number = 0;

  loading: boolean = false;
  isDataLoaded: boolean = false;

  selectedValue = null;
  pageIndex: number = 1;
  selectList: Array<any> = [];
  selectedUser: any;
  
  constructor(
    private listS: ListService
  ) { 
      this.searchText.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(x => {
          if (!x) return EMPTY;
          return this.listS.getrecipientsearch({
            AccountNo: x,
            RowNo: ''
          })
        })
      ).subscribe(data => {
        this.loading = false;
        this.selectList = data;
        if(data.length == 1){
          this.isDataLoaded = true;
        }
      });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal() {
    this.isVisible = true;
    this.index = -1;
    this.GETLIST();
  }

  GETLIST(): void {
    this.recipientSearchList = []
    this.loading = true;
    this.listS.getrecipientsearch({
      AccountNo: '',
      RowNo: ''
    }).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.loading = false;
      this.recipientSearchList = data
    });

  }

  trackByIndex(_: number, data: any): number {
    return data.index;
  }

  handleCancel() {
    this.isVisible = false;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  writeValue(value: any): void {
    if(value){
      this.isDataLoaded = false;
      this.selectedValue = value;
      this.searchText.next(value);      
    }
  }

  onScroll(){
    console.log('event');
  }

  index: number = -1;
  selected(index: number) {
    this.index = index;
    const currentPage = ((this.pageIndex * 20) - 20) + index;
    this.selectedUser = this.recipientSearchList[currentPage];
  }

  nzPageIndexChange(data: any) {
    this.pageIndex = data;
    this.index = -1;
  }

  nzOnSearch(data: any) {
    this.loading = true;
    this.searchText.next(data);
  }

  ngModelChange(event: string) {
    this.selectedValue = event;
    this.onChangeCallback(this.selectedValue);
  }

  handleOk() {
    this.selectList = [];
    
    this.selectList.push({
      accountNo: this.selectedUser.accountNo
    });

    this.selectedValue = this.selectedUser.accountNo;
    this.onChangeCallback(this.selectedValue);

    this.isVisible = false;
  }

}

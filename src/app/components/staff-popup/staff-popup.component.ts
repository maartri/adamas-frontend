import { Component, OnInit, ViewEncapsulation, forwardRef, OnDestroy,Input } from '@angular/core';
import { ListService, GlobalService, ClientService } from '@services/index';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject, EMPTY } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import format from 'date-fns/format';

const noop = () => {
};

@Component({
  selector: 'app-staff-popup',
  templateUrl: './staff-popup.component.html',
  styleUrls: ['./staff-popup.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StaffPopupComponent),
      multi: true
    }
  ]
})
export class StaffPopupComponent implements OnInit {

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private destroy$ = new Subject();
  @Input() disabled:boolean;
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

  selectedStaff: any;
  
  constructor(
    private clientS: ClientService
  ) { 
      this.searchText.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(800),
        switchMap(x => {
          if (!x) return EMPTY;
          return this.clientS.getqualifiedstaff({
              RecipientCode: '',
              User: '',
              BookDate: format(new Date(),'yyyy/MM/dd'),
              StartTime: '09:00',
              EndTime: '11:00',
              EndLimit: '17:00',
              Gender: '',
              Competencys: '',
              CompetenciesCount: 0
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

    
    this.clientS.getqualifiedstaff({
        RecipientCode: '',
        User: '',
        BookDate: format(new Date(),'yyyy/MM/dd'),
        StartTime: '09:00',
        EndTime: '11:00',
        EndLimit: '17:00',
        Gender: '',
        Competencys: '',
        CompetenciesCount: 0
    }).subscribe((data: any) => {
      
        this.loading = false;
        let original = data.map(x => {
            var gender = -1;

            if (x.gender && (x.gender[0]).toUpperCase() == 'F') {
                gender = 0;
            }

            if (x.gender && (x.gender[0]).toUpperCase() == 'M') {
                gender = 1;
            }

            return {
                firstName: x.firstName,
                age: x.age,
                rating: x.rating,
                km: x.km,
                gender: gender,
                accountNo: x.accountNo
            };
        });

        this.selectList = original;
      });
  }

  computeRating(rating: string): number{
    if (!rating || rating == null || rating == '') return 0;
    var ratingNo = rating.split('*').length - 1;

    if (ratingNo > 7) return 7;
    return ratingNo;
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
    // this.selectList = [];
    
    // this.selectList.push({
    //   accountNo: this.selectedUser.accountNo
    // });
    const selectedStaff = this.selectedStaff.accountNo;

    this.selectedValue = selectedStaff;
    this.onChangeCallback(selectedStaff);

    this.isVisible = false;
  }

}

import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { dateFormat } from '@services/global.service';
import { TABS, Filters } from '@modules/modules';

const noop = () => {  };

import { of, combineLatest, forkJoin, merge, EMPTY } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import format from 'date-fns/format'
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FilterComponent),
    }
  ],
})

export class FilterComponent implements OnInit, ControlValueAccessor {

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;  

  @Input() tabs: TABS; 


  filterFormGroup: FormGroup;
  dateFormat: string = dateFormat;

  selectedValue: any;

  openFilter: boolean = false;
  deleteFilter: boolean = false;
  viewFilter: boolean = false;

  sss: any;
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();

    var firstDate = startOfMonth(new Date());
    var endDate =  endOfMonth(new Date());
    
    this.filterFormGroup.patchValue({
      startDate: firstDate,
      endDate: endDate
    });

    // combineLatest([
    //   this.filterFormGroup.get('archiveDocs').valueChanges.pipe(startWith(false)),
    //   this.filterFormGroup.get('acceptedQuotes').valueChanges.pipe(startWith(false)),
    //   this.filterFormGroup.get('includeClosedIncidents').valueChanges.pipe(startWith(false)),
    //   this.filterFormGroup.get('includeArchivedNotes').valueChanges.pipe(startWith(false)),
      
    // ]).subscribe(([data] : any) => {
    //   setTimeout(() => {
    //     this.onChangeCallback(this.filterFormGroup.value);
    //   }, 0);
    // })

    combineLatest([
      this.filterFormGroup.get('startDate').valueChanges.pipe(startWith(firstDate)),
      this.filterFormGroup.get('endDate').valueChanges.pipe(startWith(endDate)),

      this.filterFormGroup.get('archiveDocs').valueChanges.pipe(startWith(false)),
      this.filterFormGroup.get('acceptedQuotes').valueChanges.pipe(startWith(false)),
      this.filterFormGroup.get('includeClosedIncidents').valueChanges.pipe(startWith(false)),
      this.filterFormGroup.get('includeArchivedNotes').valueChanges.pipe(startWith(false)),
      this.filterFormGroup.get('allDates').valueChanges.pipe(startWith(false)),
      this.filterFormGroup.get('display').valueChanges.pipe(startWith(20))
    ]).pipe(
      switchMap(([data, data1]:any) => {
        if(data == null || data1 == null){
          return EMPTY;
        }
        return of([data,data1]);
      })
    ).subscribe(([data, data1] : any) => {
      setTimeout(() => {
        this.onChangeCallback(this.filterFormGroup.value);
      }, 0);
    });

  }

  buildForm(){
    var filter: Filters = {
      display: 20,
      archiveDocs: false,
      acceptedQuotes: false,
      allDates: true,
      startDate: null,
      endDate: null,
      includeClosedIncidents: false,
      includeArchivedNotes: false
    };

    this.filterFormGroup = this.fb.group(filter);
  }

  writeValue(value: any) {
    // if(!value){
    //     this.onChangeCallback(this.filterFormGroup.value);
    // }
  }

  registerOnChange(fn): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn): void {
    this.onTouchedCallback = fn;
  }

}

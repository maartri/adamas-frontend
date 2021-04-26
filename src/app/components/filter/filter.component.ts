import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { dateFormat } from '@services/global.service';
const noop = () => {  };

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

    this.filterFormGroup.valueChanges.subscribe(data => {
      this.onChangeCallback(this.filterFormGroup.value);
    });
  }

  buildForm(){
    this.filterFormGroup = this.fb.group({
      display: 20,
      archiveDocs: false,
      acceptedQuotes: false,
      allDates: true,
      startDate: null,
      endDate: null
    });
  }

  writeValue(value: any) {
    if(!value){
        this.onChangeCallback(this.filterFormGroup.value);
    }
  }

  registerOnChange(fn): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn): void {
    this.onTouchedCallback = fn;
  }

}

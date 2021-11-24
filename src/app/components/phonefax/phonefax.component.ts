import { Component, OnInit, forwardRef, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


const noop = () => {
};

@Component({
  // host: {
  //   '(document:click)': 'onClick($event)'
  // },
  selector: 'app-phonefax',
  templateUrl: './phonefax.component.html',
  styleUrls: ['./phonefax.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhonefaxComponent),
      multi: true
    }
  ]
})
  
export class PhonefaxComponent implements OnInit, OnDestroy ,ControlValueAccessor {
  @ViewChild('sample', { static: false }) _firstFourNo: ElementRef;
  @ViewChild('hello', { static: false }) _lastFourNo: ElementRef;

  @Input() isMobile: boolean = false;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  inputChange$ = new Subject();

  error: boolean = false;

  innerValue: any = '';

  areaCode: string;
  firstFourNo: string;
  lastFourNo: string;

  constructor(
    private elem: ElementRef
  ) {
    
  }

  ngOnInit() {
    this.inputChange$.pipe(debounceTime(100)).subscribe(e => {
      var contactNo = `+61${this.isMobileType() || ''}${this.firstFourNo || ''}${this.lastFourNo || ''}`

      this.error = this.validateLength(contactNo);
      this.onChangeCallback(contactNo);
    });
  }

  validateLength(num: string): boolean {
    return !(num.length == 13)
  }

  writeValue(value: any) {
    if (value) {
      this.innerValue = this.validateNumber(value);
      if (this.innerValue) {
        this.error = false;
        this.select(this.innerValue);        
        return;
      }
      this.error = true;
      this.select('');
      return;
    }
    this.clearAll();
  }

  select(value: any) {
    this.onChangeCallback(value);
  }

  registerOnChange(fn): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn): void {
    this.onTouchedCallback = fn;
  }

  ngOnDestroy(): void{

  }
  
  isMobileType() {
    return this.isMobile ? '04' : `0${this.areaCode}`
  }

  clearAll() {
    this.areaCode = '';
    this.firstFourNo = '';
    this.lastFourNo = '';

    this.innerValue = '';
    this.select('');
  }

  // onClick(event) {
  //   if (!this.elem.nativeElement.contains(event.target)) {
  //     this.error = this.verifyError();      
  //     this.onChange = this.innerValue;
  //   }
  // }

  verifyError(): boolean {
    if (this.areaCode && this.firstFourNo && this.lastFourNo)
      return this.areaCode.length == 0 || this.firstFourNo.length < 4 || this.lastFourNo.length < 4;
    return false;
  }

  get value() {
    return this.innerValue;
  }

  set value(data: any) {
    this.innerValue = '23';
  }

  changeEvent(e: any, whatInput: number) {

    if (whatInput == 0) {
      setTimeout(() => {
        this._firstFourNo.nativeElement.focus();
        this._firstFourNo.nativeElement.value = '';
        this.error = true;
      });
    }

    if (whatInput == 1) {
      if ((e.target.value).length == 3) {
        setTimeout(() => {
          this._lastFourNo.nativeElement.focus();
          this._lastFourNo.nativeElement.value = '';
          this.error = true;
        });
      }
    }

  }

  validateNumber(data: string) {

    // Remove Whitespace Before - After 
    data = data.trim();

    // Remove Whitespace In between
    data = data.replace(/ +/g, "");

    //Remove Non-Numeric values
    data = data.replace(/\D/g,'');

    if(data.startsWith('61') && data.length == 12){
      data = data.slice(2,13);
    }

    if(data.startsWith('04') || data.startsWith('4')){
      // this.isMobile = true;
      this.firstFourNo = data.slice(2, 6);
      this.lastFourNo = data.slice(6, 11);
      return data;
    }

    if(data.length == 10){
      this.areaCode = data.slice(1, 2);
      this.firstFourNo = data.slice(2, 6);
      this.lastFourNo = data.slice(6, 11);
      return data;
    }

    
    
    return null;
  }



}

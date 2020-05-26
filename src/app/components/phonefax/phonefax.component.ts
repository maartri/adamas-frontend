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
    this.inputChange$.pipe(debounceTime(300)).subscribe(e => {
      var contactNo = `+63${this.isMobileType() || ''}${this.firstFourNo || ''}${this.lastFourNo || ''}`
      this.writeValue(contactNo);
    });
  }

  writeValue(value: any) {
    if (value) {
      this.innerValue = this.validateNumber(value);
      if (this.innerValue) {
        this.error = false;
        this.select(this.innerValue);        
        return;
      }
      // this.error = true;
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
    // 13 is the length of phone/tel #
    if (data.includes('+63') && data.length == 13 && !isNaN(+data.slice(1, 14))) {
      this.areaCode = data.slice(4, 5);
      this.firstFourNo = data.slice(5, 9);
      this.lastFourNo = data.slice(9, 14);
      return data;
    }
    return null;
  }



}

import { Component, OnInit, forwardRef, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Subject } from 'rxjs';

@Component({
  host: {
    '(document:click)': 'onClick($event)'
  },
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
export class PhonefaxComponent implements OnChanges, OnInit, AfterViewInit ,ControlValueAccessor {
  @ViewChild('sample', { static: false }) _firstFourNo: ElementRef;
  @ViewChild('hello', { static: false }) _lastFourNo: ElementRef;

  @Input() type: string = '';

  onChange: (a: any) => void;
  onTouch: () => void;

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

  ngAfterViewInit() {
    this.inputChange$.subscribe(e => {
      var appendNumber = `+63${this.isMobileType() || ''}${this.firstFourNo || ''}${this.lastFourNo || ''}`
      this.innerValue = appendNumber;      
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'type' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.clearAll();
      }
    }
  }

  isMobileType() {
    return this.type == 'MOBILE' ? '04' : `0${this.areaCode}`
  }

  clearAll() {
    this.areaCode = '';
    this.firstFourNo = '';
    this.lastFourNo = '';
    var appendNumber = `${this.areaCode || ''}${this.firstFourNo || ''}${this.lastFourNo || ''}`
    this.onChange(appendNumber);
  }

  onClick(event) {
    if (!this.elem.nativeElement.contains(event.target)) {
      this.error = this.verifyError();
      
      this.onChange = this.innerValue;
      console.log(this.innerValue)
      // if (this.error) {
      //   this.onChange('0')
      // }
    }
  }

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
        this._firstFourNo.nativeElement.value = ''
      });
    }

    if (whatInput == 1) {
      if ((e.target.value).length == 3) {
        setTimeout(() => {
          this._lastFourNo.nativeElement.focus();
          this._lastFourNo.nativeElement.value = ''
        })
      }

    }
  }

  ngOnInit() {

  }

  writeValue(value: any) {
    if (value !== this.value) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  isDefaultFormat(): boolean {
    let type = (this.type).toUpperCase();
    return type === 'MOBILE';
  }

}

import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-refer-in',
  templateUrl: './refer-in.component.html',
  styleUrls: ['./refer-in.component.css']
})
export class ReferInComponent implements OnInit, OnChanges {

  @Input() open: any;

  current: number = 0;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        // this.buildForm();
        this.open = true;
      }
    }
  }

  pre() {
    
  }

  next() {
    
  }

  get canGoNext(): boolean {
    return true;
  }

  get canBeDone(): boolean {
    return true;
  }

  handleCancel() {
    
  }

  handleOk() {
    
  }
}

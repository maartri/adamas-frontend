import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'

@Component({
  selector: 'app-interval-design',
  templateUrl: './interval-design.component.html',
  styleUrls: ['./interval-design.component.css']
})
export class IntervalDesignComponent implements OnInit, OnChanges {

  endTime: any = new Date(1990, 1, 1, 9, 0, 0);
  quoteDetailsGroup: FormGroup;
  @Input() interval: string;
    
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'interval' &&
        !changes[property].firstChange &&
        changes[property].currentValue != null) {
          this.reset();
          this.createMultipleWeekFormats(changes[property].currentValue)
      }
    }
  }

  reset() {
    this.quoteDetailsGroup = new FormGroup({
      timeSlots: new FormArray([])
    });
  }

  noOfLoops(data): number {
    if (data == 'Weekly') {
      return 1;
    } else if (data == 'Fortnightly') {
      return 2;
    } else if (data == 'FourWeekly') {
      return 4;
    } else {
      return 0;
    }
  }

  loopRoster(noOfLoop: number) {
    let index = 0;
    while (index < noOfLoop) {
      this.addTimeSlot();
      index++;
    }
  }

  addTimeSlot() {
    const slot = this.quoteDetailsGroup.get('timeSlots') as FormArray;
    slot.push(this.createTimeSlot());
  }

  createTimeSlot(data: Array<any> = null): FormGroup {
    return this.formBuilder.group({
      monday: new FormGroup({
        time: new FormControl(data ? data[0].split('|')[0] : this.endTime),
        quantity: new FormControl(data ? Math.trunc(data[0].split('|')[1]) : 0)
      }),
      tuesday: new FormGroup({
        time: new FormControl(data ? data[1].split('|')[0] : this.endTime),
        quantity: new FormControl(data ? Math.trunc(data[1].split('|')[1]) : 0)
      }),
      wednesday: new FormGroup({
        time: new FormControl(data ? data[2].split('|')[0] : this.endTime),
        quantity: new FormControl(data ? Math.trunc(data[2].split('|')[1]) : 0)
      }),
      thursday: new FormGroup({
        time: new FormControl(data ? data[3].split('|')[0] : this.endTime),
        quantity: new FormControl(data ? Math.trunc(data[3].split('|')[1]) : 0)
      }),
      friday: new FormGroup({
        time: new FormControl(data ? data[4].split('|')[0] : this.endTime),
        quantity: new FormControl(data ? Math.trunc(data[4].split('|')[1]) : 0)
      }),
      saturday: new FormGroup({
        time: new FormControl(data ? data[5].split('|')[0] : this.endTime),
        quantity: new FormControl(data ? Math.trunc(data[5].split('|')[1]) : 0)
      }),
      sunday: new FormGroup({
        time: new FormControl(data ? data[6].split('|')[0] : this.endTime),
        quantity: new FormControl(data ? Math.trunc(data[6].split('|')[1]) : 0)
      })
    });
  }

  createMultipleWeekFormats(format: string) {
    this.loopRoster(this.noOfLoops(format));
  }

}

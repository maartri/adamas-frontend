import { Component, OnInit, Input, OnChanges, SimpleChanges, forwardRef, ChangeDetectionStrategy,ChangeDetectorRef, AfterViewInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'

const noop = () => {
};

enum Mode {
  Booking = "Booking",
  Default = "Default"
}

enum Interval {
  Weekly = "Weekly",
  Fortnightly = "Fortnightly",
  FourWeekly = "FourWeekly"
}

@Component({
  selector: 'app-interval-design',
  templateUrl: './interval-design.component.html',
  styleUrls: ['./interval-design.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => IntervalDesignComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalDesignComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor, AfterContentChecked {

  endTime: any = new Date(1900, 1, 1, 9, 0, 0);
  quoteDetailsGroup: FormGroup;

  dayKeys: Array<string> = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  @Input() interval: string;
  @Input() mode: Mode = Mode.Default;

  // slots: Array<any> = [];

  innerValue: Array<any> = []

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
    
  constructor(
    private formBuilder: FormBuilder,
    private cd:ChangeDetectorRef
  ) {
     this.cd.detach();
   }

  ngOnInit(): void {
    this.buildForm();    
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    // this.cd.detectChanges();
    // this.quoteDetailsGroup.get('timeSlots').valueChanges.subscribe(data => {      
    //   this.show();
    //   console.log('s')
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'interval' &&
        !changes[property].firstChange &&
        changes[property].currentValue != null) {     
          this.buildForm();
          this.createMultipleWeekFormats(changes[property].currentValue)
      }
    }
  }

  reset(){
    var arr = this.quoteDetailsGroup.get('timeSlots') as FormArray;
    arr.clear();
    this.cd.checkNoChanges();

    // this.cd.markForCheck(); 
    // this.onChangeCallback(arr.value)
  }

  buildForm() {    
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

  
  createMultipleWeekFormats(format: string) {
    
    this.loopRoster(this.noOfLoops(format));

    this.quoteDetailsGroup.get('timeSlots').valueChanges.subscribe(data => {      
      this.cd.markForCheck();
      this.innerValue = data;
      this.onChangeCallback(this.innerValue);      
    });

    setTimeout(() => {
        this.onChangeCallback([])
    }, 500);
  }

  loopRoster(noOfLoop: number) {
    let index = 0; 

    while (index < noOfLoop) {
      this.addTimeSlot(index);
      index++;
    }
  }

  addTimeSlot(counter: number) {
    const slot = this.quoteDetailsGroup.get('timeSlots') as FormArray;
    slot.push(this.createTimeSlot(null, counter));
  }

  createTimeSlot(data: Array<any> = null, counter: number): FormGroup {

    var dayCounter: number = 0;

    if(counter == 0){
      dayCounter = 1;
    }

    if(counter == 1){
      dayCounter = 8;
    }

    if(counter == 2){
      dayCounter = 15;
    }

    if(counter == 3){
      dayCounter = 22;
    }

    return this.formBuilder.group({
      monday: new FormGroup({
        time: new FormControl(data ? data[0].split('|')[0] : new Date(1900, 0, dayCounter, 9, 0, 0)),
        quantity: new FormControl(data ? Math.trunc(data[0].split('|')[1]) : 0),
        week: new FormControl(counter + 1)
      }),
      tuesday: new FormGroup({
        time: new FormControl(data ? data[1].split('|')[0] : new Date(1900, 0, dayCounter + 1, 9, 0, 0)),
        quantity: new FormControl(data ? Math.trunc(data[1].split('|')[1]) : 0),
        week: new FormControl(counter + 1)
      }),
      wednesday: new FormGroup({
        time: new FormControl(data ? data[2].split('|')[0] : new Date(1900, 0, dayCounter + 2, 9, 0, 0)),
        quantity: new FormControl(data ? Math.trunc(data[2].split('|')[1]) : 0),
        week: new FormControl(counter + 1)
      }),
      thursday: new FormGroup({
        time: new FormControl(data ? data[2].split('|')[0] : new Date(1900, 0, dayCounter + 3, 9, 0, 0)),
        quantity: new FormControl(data ? Math.trunc(data[2].split('|')[1]) : 0),
        week: new FormControl(counter + 1)
      }),
      friday: new FormGroup({
        time: new FormControl(data ? data[4].split('|')[0] : new Date(1900, 0, dayCounter + 4, 9, 0, 0)),
        quantity: new FormControl(data ? Math.trunc(data[4].split('|')[1]) : 0),
        week: new FormControl(counter + 1)
      }),
      saturday: new FormGroup({
        time: new FormControl(data ? data[5].split('|')[0] : new Date(1900, 0, dayCounter + 5, 9, 0, 0)),
        quantity: new FormControl(data ? Math.trunc(data[5].split('|')[1]) : 0),
        week: new FormControl(counter + 1)
      }),
      sunday: new FormGroup({
        time: new FormControl(data ? data[6].split('|')[0] : new Date(1900, 0, dayCounter + 6, 9, 0, 0)),
        quantity: new FormControl(data ? Math.trunc(data[6].split('|')[1]) : 0),
        week: new FormControl(counter + 1)
      })
    });
  }

   //From ControlValueAccessor interface
  writeValue(value: any) {
    this.buildForm();
    this.onChangeCallback(this.quoteDetailsGroup.get('timeSlots').value)
  }
  

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

}

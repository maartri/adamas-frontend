import { Component, OnInit, Input, OnChanges, SimpleChanges, forwardRef, ChangeDetectionStrategy,ChangeDetectorRef, AfterViewInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'


import differenceInHours from 'date-fns/differenceInHours';
import differenceInMinutes from 'date-fns/differenceInMinutes'
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

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  private innerValue: any;
    
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
      if (property == 'interval' && !changes[property].firstChange && changes[property].currentValue != null) {
          this.buildForm();
          this.createMultipleWeekFormats(changes[property].currentValue)
      }
    }
  }

  reset(){
    var arr = this.quoteDetailsGroup.get('timeSlots') as FormArray;
    arr.clear();
    this.cd.checkNoChanges();
  }

  go(){
    // console.log(this.quoteDetailsGroup.value);
  }

  buildForm() {    
    this.quoteDetailsGroup = new FormGroup({
      timeSlots: new FormArray([])
    });
  }

  buildFormNotEmpty(data: Array<any>){
    this.loopRoster(data.length, data);
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

  calculateDuration(data: Array<any>){
    data.forEach(x => {
      var earlier = new Date(x['monday']['time']);
      var later = new Date(x['monday']['endTime']);
      var diff = differenceInMinutes(later, earlier);
      x['monday']['quantity'] = diff;
    })
  }

  
  createMultipleWeekFormats(format: string) {
    
    this.loopRoster(this.noOfLoops(format));

    this.quoteDetailsGroup.get('timeSlots').valueChanges.subscribe(data => {     
      this.innerValue = data;
      // console.log(data)
      this.calculateDuration(data);

      console.log(this.innerValue)
      this.onChangeCallback(this.innerValue);      
      this.cd.markForCheck();
    });

    // (<FormArray>this.quoteDetailsGroup.get('timeSlots')).controls.forEach(control => {
    //   control.valueChanges.subscribe(data => {     
    //     console.log(data);
    //     console.log((<FormArray>this.quoteDetailsGroup.get('timeSlots')).controls.indexOf(control))
    //   });
    // })
  }

  loopRoster(noOfLoop: number, data: any = null) {
    let index = 0; 
    if(!data) {
      while (index < noOfLoop) {
        this.addTimeSlot(index);
        index++;
      }
    } else{
      while (index < noOfLoop) {
        this.addTimeSlot(index, data[index]);
        index++;
      }
    }    
  }

  addTimeSlot(counter: number, data: any = null) {
    const slot = this.quoteDetailsGroup.get('timeSlots') as FormArray;
    slot.push(this.createTimeSlot(data, counter));
  }

  createTimeSlot(data: any = null, counter: number): FormGroup {

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
        time: new FormControl(data ? data['monday'].time: new Date(1900, 0, dayCounter, 9, 0, 0)),
        endTime: new FormControl(data ? data['monday'].endTime: new Date(1900, 0, dayCounter, 9, 0, 0)),
        quantity: new FormControl(data ? data['monday'].quantity : 0),
        week: new FormControl(counter + 1)
      }),
      tuesday: new FormGroup({
        time: new FormControl(data ? data['tuesday'].time : new Date(1900, 0, dayCounter + 1, 9, 0, 0)),
        endTime: new FormControl(data ? data['tuesday'].endTime : new Date(1900, 0, dayCounter + 1, 9, 0, 0)),
        quantity: new FormControl(data ? data['tuesday'].quantity : 0),
        week: new FormControl(counter + 1)
      }),
      wednesday: new FormGroup({
        time: new FormControl(data ? data['wednesday'].time: new Date(1900, 0, dayCounter + 2, 9, 0, 0)),
        endTime: new FormControl(data ? data['wednesday'].endTime: new Date(1900, 0, dayCounter + 2, 9, 0, 0)),
        quantity: new FormControl(data ? data['wednesday'].quantity : 0),
        week: new FormControl(counter + 1)
      }),
      thursday: new FormGroup({
        time: new FormControl(data ? data['thursday'].time : new Date(1900, 0, dayCounter + 3, 9, 0, 0)),
        endTime: new FormControl(data ? data['thursday'].endTime : new Date(1900, 0, dayCounter + 3, 9, 0, 0)),
        quantity: new FormControl(data ? data['thursday'].quantity : 0),
        week: new FormControl(counter + 1)
      }),
      friday: new FormGroup({
        time: new FormControl(data ? data['friday'].time : new Date(1900, 0, dayCounter + 4, 9, 0, 0)),
        endTime: new FormControl(data ? data['friday'].endTime : new Date(1900, 0, dayCounter + 4, 9, 0, 0)),
        quantity: new FormControl(data ? data['friday'].quantity : 0),
        week: new FormControl(counter + 1)
      }),
      saturday: new FormGroup({
        time: new FormControl(data ? data['saturday'].time : new Date(1900, 0, dayCounter + 5, 9, 0, 0)),
        endTime: new FormControl(data ? data['saturday'].endTime : new Date(1900, 0, dayCounter + 5, 9, 0, 0)),
        quantity: new FormControl(data ? data['saturday'].quantity : 0),
        week: new FormControl(counter + 1)
      }),
      sunday: new FormGroup({
        time: new FormControl(data ? data['sunday'].time : new Date(1900, 0, dayCounter + 6, 9, 0, 0)),
        endTime: new FormControl(data ? data['sunday'].endTime : new Date(1900, 0, dayCounter + 6, 9, 0, 0)),
        quantity: new FormControl(data ? data['sunday'].quantity  : 0),
        week: new FormControl(counter + 1)
      })
    });
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    console.log(value)
    if(value != null){
      
      if(value.length > 0) {
        this.buildFormNotEmpty(value);
      }

      this.innerValue = value;

      this.quoteDetailsGroup.get('timeSlots').valueChanges.subscribe(data => {     
        this.innerValue = data;
        console.log(this.innerValue)
        this.onChangeCallback(this.innerValue);      
        this.cd.markForCheck();
      });
      // this.onChangeCallback(this.quoteDetailsGroup.get('timeSlots').value)
    }    
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

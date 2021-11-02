import { Component, OnInit, Input, OnChanges, SimpleChanges, forwardRef, ChangeDetectionStrategy,ChangeDetectorRef, AfterViewInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'


import differenceInHours from 'date-fns/differenceInHours';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import format from 'date-fns/format';
import parse from 'date-fns/parse'


import { billunit, periodQuote } from '@services/global.service';

const noop = () => {
};

interface TimeFilterDto{
  hours: number,
  minutes: number,
  quantity: number,
  date: Date
}

enum Mode {
  Booking = "Booking",
  Default = "Default"
}

enum Interval {
  WEEKLY = "WEEKLY",
  FORTNIGHTLY = "FORTNIGHTLY",
  FOURWEEKLY = "FOURWEEKLY"
}

@Component({
  selector: 'app-interval-quote',
  templateUrl: './interval-quote.component.html',
  styleUrls: ['./interval-quote.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => IntervalQuoteComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalQuoteComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor, AfterContentChecked {

  endTime: any = new Date(1900, 1, 1, 9, 0, 0);
  quoteDetailsGroup: FormGroup;

  dayKeys: Array<string> = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

  @Input() interval: string;
  @Input() mode: Mode = Mode.Default;
  @Input() size: string;

  @Input() NoMon: boolean = false;
  @Input() NoTue: boolean = false;
  @Input() NoWed: boolean = false;
  @Input() NoThu: boolean = false;
  @Input() NoFri: boolean = false;
  @Input() NoSat: boolean = false;
  @Input() NoSun: boolean = false;

  @Input() NoPub: boolean = false;

  billUnitArr: Array<string> = billunit;
  periodArr: Array<string> = periodQuote;
  
  // slots: Array<any> = [];

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  private innerValue: any;

  period: string;
    
  constructor(
    private formBuilder: FormBuilder,
    private cd:ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterContentChecked() {
    // this.cd.detectChanges();
  }

  ngAfterViewInit() {
    // this.cd.detectChanges();
    // this.quoteDetailsGroup.get('timeSlots').valueChanges.subscribe(data => {      
    //   this.show();
    //   console.log('s')
    // });
  }


  detectChanges(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'interval' && !changes[property].firstChange && changes[property].currentValue != null) {
          this.resetForm();
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

  resetForm(){
    (this.quoteDetailsGroup.controls['timeSlots'] as FormArray).clear();
  }

  buildFormNotEmpty(data: Array<any>){
    this.loopRoster2(this.noOfLoops(this.interval), data);
  }

  noOfLoops(data): number {
    if (data == 'WEEKLY') {
      return 1;
    } else if (data == 'FORTNIGHTLY') {
      return 2;
    } else if (data == 'MONTHLY') {
      return 4;
    } else {
      return 0;
    }
  }

  createMultipleWeekFormats(format: string) {
    this.period = format;
    this.loopRoster(this.noOfLoops(format));

    this.quoteDetailsGroup.get('timeSlots').valueChanges.subscribe(data => {
      this.innerValue = this.calculateRosterString(data);
      this.onChangeCallback(this.innerValue);
      console.log(this.innerValue)
      this.cd.markForCheck();
    });

    // var sss = this.quoteDetailsGroup.getRawValue();
    // this.quoteDetailsGroup.patchValue(sss)
    
  }


  loopRoster2(noOfLoop: number, data: any = null) {
    let index = 0;
    let countIndex = 0;

    while (countIndex < noOfLoop) {
      this.addTimeSlot(index, data.slice(index, index + 7 ));
      index+=7;
      countIndex++;
    }      
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

    console.log(slot);
  }

  createTimeSlot(data: any = null, counter: number): FormGroup {
    console.log(counter);
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

    if(data == null) {
      this.detectChanges()
      console.log('hays')
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
    } else {
      this.detectChanges()
      return this.formBuilder.group({
        monday: new FormGroup({
          time: new FormControl(this.splitTimeFormatsByPosition(data[0]).date),
          endTime: new FormControl(null),
          quantity: new FormControl(this.splitTimeFormatsByPosition(data[0]).quantity),
          week: new FormControl(counter + 1)
        }),
        tuesday: new FormGroup({
          time: new FormControl(this.splitTimeFormatsByPosition(data[1]).date),
          endTime: new FormControl(null),
          quantity: new FormControl(this.splitTimeFormatsByPosition(data[1]).quantity),
          week: new FormControl(counter + 1)
        }),
        wednesday: new FormGroup({
          time: new FormControl(this.splitTimeFormatsByPosition(data[2]).date),
          endTime: new FormControl(null),
          quantity: new FormControl(this.splitTimeFormatsByPosition(data[2]).quantity),
          week: new FormControl(counter + 1)
        }),
        thursday: new FormGroup({
          time: new FormControl(this.splitTimeFormatsByPosition(data[3]).date),
          endTime: new FormControl(null),
          quantity: new FormControl(this.splitTimeFormatsByPosition(data[3]).quantity),
          week: new FormControl(counter + 1)
        }),
        friday: new FormGroup({
          time: new FormControl(this.splitTimeFormatsByPosition(data[4]).date),
          endTime: new FormControl(null),
          quantity: new FormControl(this.splitTimeFormatsByPosition(data[4]).quantity),
          week: new FormControl(counter + 1)
        }),
        saturday: new FormGroup({
          time: new FormControl(this.splitTimeFormatsByPosition(data[5]).date),
          endTime: new FormControl(null),
          quantity: new FormControl(this.splitTimeFormatsByPosition(data[5]).quantity),
          week: new FormControl(counter + 1)
        }),
        sunday: new FormGroup({
          time: new FormControl(this.splitTimeFormatsByPosition(data[6]).date),
          endTime: new FormControl(null),
          quantity: new FormControl(this.splitTimeFormatsByPosition(data[6]).quantity),
          week: new FormControl(counter + 1)
        })
      });      
    }    
  }

  splitTimeFormatsByPosition(data: any): TimeFilterDto{
    var splitTimeAndQuantity = data.split('|');

    var hours = parseInt(format(parse(splitTimeAndQuantity[0],'HH:mm', new Date()),'HH'));
    var minutes = parseInt(format(parse(splitTimeAndQuantity[0],'HH:mm', new Date()),'mm'));
    var _quantity = parseInt(splitTimeAndQuantity[1]);

    let result: TimeFilterDto = {
      hours: hours,
      minutes: minutes,
      quantity: _quantity,
      date: new Date(1900, 0, 1, hours, minutes, 0)
    }

    return result;
  }

  //From ControlValueAccessor interface
  writeValue(value: string) {
    if(value != null){
      this.resetForm();

      if(value.length > 0) {
        var splitTime = (value).split('||').filter(x => x);
        this.buildFormNotEmpty(splitTime);
      }

      this.innerValue = value;
      this.quoteDetailsGroup.get('timeSlots').valueChanges.subscribe(data => { 
        // console.log(data)    

        this.innerValue = this.calculateRosterString(data);
        console.log(this.innerValue)
        this.onChangeCallback(this.innerValue);      
        this.cd.markForCheck();

        
        // this.innerValue = data;
        // this.onChangeCallback(this.innerValue);      
        // this.cd.markForCheck();
      });
    }    
  }

  calculateRosterString(data: any){
    var clonedObjArray = [...data];

    if(this.period == 'WEEKLY'){      
      for(var a = 0; a < 3; a++){
        clonedObjArray = clonedObjArray.concat(data);
      }      
    }

    if(this.period == 'FORTNIGHTLY'){
      for(var a = 0; a < 1; a++){
        clonedObjArray = clonedObjArray.concat(data);
      }
    }
    
    var parseString  = '';
    var quantity: number = 0;
    
    clonedObjArray.forEach((x, index) => {      
      
      var monQuant = ('0'+ (x['monday']['quantity'])).slice(-2).concat('.00');

      if(index > 0){
        parseString = parseString.concat('||',format(new Date(x['monday']['time']),'HH:mm'), '|', monQuant);
      } else {
        parseString = parseString.concat(format(new Date(x['monday']['time']),'HH:mm'), '|', monQuant);
      }
      
      var tueQuant = ('0'+ (x['tuesday']['quantity'])).slice(-2).concat('.00');
      parseString = parseString.concat('||',format(new Date(x['tuesday']['time']),'HH:mm'), '|', tueQuant);

      var wedQuant = ('0'+ (x['wednesday']['quantity'])).slice(-2).concat('.00');
      parseString = parseString.concat('||',format(new Date(x['wednesday']['time']),'HH:mm'), '|', wedQuant);

      var thuQuant = ('0'+ (x['thursday']['quantity'])).slice(-2).concat('.00');
      parseString = parseString.concat('||',format(new Date(x['thursday']['time']),'HH:mm'), '|', thuQuant);

      var friQuant = ('0'+ (x['friday']['quantity'])).slice(-2).concat('.00');
      parseString = parseString.concat('||',format(new Date(x['friday']['time']),'HH:mm'), '|', friQuant);

      var satQuant = ('0'+ (x['saturday']['quantity'])).slice(-2).concat('.00');
      parseString = parseString.concat('||',format(new Date(x['saturday']['time']),'HH:mm'), '|', satQuant);

      var sunQuant = ('0'+ (x['sunday']['quantity'])).slice(-2).concat('.00');
      parseString = parseString.concat('||',format(new Date(x['sunday']['time']),'HH:mm'), '|', sunQuant);
      
    });

    data.forEach((x) => {
      quantity = quantity +
               parseInt((x['monday']['quantity'])) +
               parseInt((x['tuesday']['quantity'])) +
               parseInt((x['wednesday']['quantity'])) +
               parseInt((x['thursday']['quantity'])) +
               parseInt((x['friday']['quantity'])) +
               parseInt((x['saturday']['quantity'])) +
               parseInt((x['sunday']['quantity']));
    });
    
    return {
      quantity: quantity,
      roster: parseString
    };
  }

  calculateDuration(data: Array<any>){
    data.forEach(x => {
      x['monday']['quantity'] = differenceInMinutes(new Date(x['monday']['endTime']), new Date(x['monday']['time']));
      x['tuesday']['quantity'] = differenceInMinutes(new Date(x['tuesday']['endTime']), new Date(x['tuesday']['time']));
      x['wednesday']['quantity'] = differenceInMinutes(new Date(x['wednesday']['endTime']), new Date(x['wednesday']['time']));
      x['thursday']['quantity'] = differenceInMinutes(new Date(x['thursday']['endTime']), new Date(x['thursday']['time']));
      x['friday']['quantity'] = differenceInMinutes(new Date(x['friday']['endTime']), new Date(x['friday']['time']));
      x['saturday']['quantity'] = differenceInMinutes(new Date(x['saturday']['endTime']), new Date(x['saturday']['time']));
      x['sunday']['quantity'] = differenceInMinutes(new Date(x['sunday']['endTime']), new Date(x['sunday']['time']));
    })
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

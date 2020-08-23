import { Component, OnInit, Input, SimpleChanges,forwardRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { switchMap } from 'rxjs/operators';

const noop = () => {
};


@Component({
  selector: 'app-incident-post',
  templateUrl: './incident-post.component.html',
  styleUrls: ['./incident-post.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => IncidentPostComponent),
    }
  ],
})
export class IncidentPostComponent implements OnInit, ControlValueAccessor {

  @Input() open: boolean = false;

  incidentForm: FormGroup;
  current: number = 0;

  incidentTypeList: Array<any> = [];

  listPrograms: Array<string> = [];
  listServiceTypes: Array<string> = [];
  listIncidentTypes: Array<string> = [];

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  user: Dto.User;

  constructor(
    private fb: FormBuilder,
    private listS: ListService,
    private globalS: GlobalService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.openModal();
      }
    }
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.incidentForm = this.fb.group({
        incidentType: '',
        serviceType: '',
        program: ''
    });

    
  }

  buildValueChanges(){

    this.listS.getwizardnote('INCIDENT TYPE').subscribe(data =>{
        this.listIncidentTypes = data;
    });


    if(this.user.view == 'recipient'){

      this.listS.getprogramsincident(this.user.id).subscribe(data =>{
        this.listPrograms = data
      });

      this.incidentForm.get('program').valueChanges.pipe(
        switchMap(program => {
          this.clearServiceType();
          return this.listS.getservicetypeincident({
            id: this.user.id,
            program: program
          })
        })
      ).subscribe(data => this.listServiceTypes = data);
    }


    if(this.user.view === 'staff'){
      this.listS.getactivities().subscribe(data => {
        this.listServiceTypes = data;
      });
      let momentDate = this.globalS.getStartEndCurrentMonth()
      
      let dates = {
          StartDate: momentDate.start.format('MM-DD-YYYY'),
          EndDate: momentDate.end.format('MM-DD-YYYY')
      };

      this.listS.getprograms(dates).subscribe(data => this.listPrograms = data);

    }
  }

  clearServiceType(){
    this.listServiceTypes = [];
    this.incidentForm.patchValue({ serviceType: null });
  }

  openModal(){
    this.open = true;
  }

  handleCancel(){
    this.open = false;
    this.incidentForm.reset();
    // this.user = {};
    this.current = 0;
  }

  save(){

  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null) {
      this.user = value;
      this.buildValueChanges();
      console.log(this.user);
    
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

  trackByFn(index, item) {
    return item.id;
  }

  pre(): void {
      this.current -= 1;
  }

  next(): void {
      this.current += 1;
  }

  get nextRequired() {
    const { incidentType, serviceType, program } = this.incidentForm.value;
    
    if (this.current == 0 && (this.globalS.isEmpty(incidentType) || this.globalS.isEmpty(program) || this.globalS.isEmpty(serviceType))) {
      return false;
    }

    return true;
  }

}

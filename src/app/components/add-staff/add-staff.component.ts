import { Component, OnInit, forwardRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, SettingsService } from '@services/index';
import * as _ from 'lodash';
import { mergeMap, takeUntil, concatMap, switchMap, map } from 'rxjs/operators';
import { forkJoin, Observable, EMPTY, Subject } from 'rxjs';
import parseISO from 'date-fns/parseISO'
import { RemoveFirstLast } from '../../pipes/pipes';

const noop = () => {};

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddStaffComponent),
    }
  ],
})
export class AddStaffComponent implements OnInit, OnChanges ,ControlValueAccessor {

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  @Input() open: boolean = false;

  innerValue: any;

  current: number = 4;

  typesArr: Array<any> = types;
  genderArr: Array<any> = gender;
  addressType: Array<string> = [];
  contactType: Array<string> = [];
  branchesArr: Array<string> = [];
  jobCategoryArr: Array<string> = [];
  managerArr: Array<string> = [];
  
  staffForm: FormGroup;

  dateFormat: string = 'dd/MM/yyyy';

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  
  constructor(
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private listS: ListService,
    private fb: FormBuilder
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && 
        !changes[property].firstChange && 
        changes[property].currentValue != null) {
        this.open = true;
        this.buildForm();
        this.populate();
      }
    }
  }

  buildForm() {
    this.staffForm = this.fb.group({
        type: null,
        orgType: 'Individual',

        accountNo:'',

        surnameOrg: '',
        firstName: '',
        birthDate: '',
        gender: '',
        addressForm: this.fb.array([this.createAddress()]),
        contactForm: this.fb.array([this.createContact()]),

        commenceDate: '',
        branch:'',
        jobCategory: '',
        manager: '',
    });    
  }

  populate(){
    this.clientS.getcontacttype().subscribe(data => {
        this.contactType = data.map(x => {
            return (new RemoveFirstLast().transform(x.description)).trim();
        });
    });

    this.clientS.getaddresstype().subscribe(data => {
        this.addressType = data.map(x => {
            return new RemoveFirstLast().transform(x.description)
        });
    });

    this.listS.getlistbranches().subscribe(data => this.branchesArr = data)
    this.listS.getliststaffgroup().subscribe(data => this.jobCategoryArr = data)
    this.listS.getlistcasemanagers().subscribe(data => this.managerArr = data)
  }

  ngOnInit(): void {
    this.buildForm();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null && !_.isEqual(value, this.innerValue)) {
      this.innerValue = value;
      
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

  handleCancel(){
    this.open = false;
  }

  createContact(): FormGroup{    
    return this.fb.group({
      contacttype: new FormControl(''),
      contact: new FormControl('')
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      address1: new FormControl(''),
      type: new FormControl(''),
      suburb: new FormControl('')
    });
  }

  addAddress(){
    var field = this.staffForm.get('addressForm') as FormArray;
    field.push(this.createAddress());
  }

  addContact(){
    var field = this.staffForm.get('contactForm') as FormArray;
    field.push(this.createContact());
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
      this.current += 1;
  }

  get nextRequired() {
    
    return true;
  }

  save(){

  }
}

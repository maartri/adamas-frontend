import { Component, OnInit, forwardRef, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, SettingsService } from '@services/index';
import * as _ from 'lodash';
import { forkJoin, Observable, EMPTY, Subject } from 'rxjs';
import parseISO from 'date-fns/parseISO'
import { RemoveFirstLast } from '../../pipes/pipes';
import { mergeMap, debounceTime, distinctUntilChanged, takeUntil, switchMap, concatMap } from 'rxjs/operators';
import * as moment from 'moment';

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
  @Output() reload = new EventEmitter();

  innerValue: any;

  current: number = 0;

  typesArr: Array<any> = types;
  genderArr: Array<any> = gender;
  addressType: Array<string> = [];
  contactType: Array<string> = [];
  branchesArr: Array<string> = [];
  jobCategoryArr: Array<string> = [];
  managerArr: Array<string> = [];
  
  staffForm: FormGroup;

  generatedAccount: string;
  accountTaken: boolean = null;

  dateFormat: string = 'dd/MM/yyyy';

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  private verifyAccount = new Subject<any>();
  private verifyAccountPerOrg = new Subject<any>();
  
  constructor(
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private listS: ListService,
    private fb: FormBuilder
  ) { 


  }

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
    this.current = 0;

    this.staffForm = this.fb.group({
        type: null,
        orgType: 'Individual',

        accountNo:[''],

        surnameOrg: ['', Validators.required],
        firstName: ['', Validators.required],
        birthDate: ['',Validators.required],
        gender: ['',Validators.required],
        addressForm: this.fb.array(this.defaultAddress() || []),
        contactForm: this.fb.array(this.defaultContacts() || []),

        commencementDate: '',
        branch:'',
        jobCategory: '',
        manager: '',
    });

    this.staffForm.get('orgType').valueChanges
    .pipe(debounceTime(300))
    .subscribe(data => {
        this.clearPersonalDetails();
    });

    this.staffForm.get('type').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
          this.staffForm.patchValue({
            orgType: 'Individual'
          })
          this.clearPersonalDetails();
      });

    this.staffForm.get('surnameOrg').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
          if(this.staffForm.get('orgType').value === 'Organisation'){
            this.verifyAccountPerOrg.next(data);
          } else {
            this.verifyAccount.next();
          }          
      });

    this.staffForm.get('firstName').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
          this.verifyAccount.next();
      });

    this.staffForm.get('birthDate').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
          this.verifyAccount.next();
      });

    this.staffForm.get('gender').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
          this.verifyAccount.next();
      });

    // For Person Check if Account is present
    this.verifyAccount.pipe(
        debounceTime(300),
        concatMap(e => {
          this.accountTaken = null;  
          if (this.staffForm) {
            this.generatedAccount = this.generateAccount(); 
            if(this.generatedAccount && this.staffForm.valid) {
              return this.staffS.isAccountNoUnique(this.generatedAccount);
            }
          } return EMPTY;
        })
      ).subscribe(next => {
        this.staffForm.patchValue({
          accountNo: this.generatedAccount.toUpperCase()
        });
        if (next == 1) {
          this.accountTaken = false;
        }

        if (next == 0) {
          this.accountTaken = true;
        }
      });

      // For Organisation Check if Account is present
      this.verifyAccountPerOrg
          .pipe(
            debounceTime(300),
            concatMap(data => {
              this.accountTaken = null;  
              if(data){
                this.generatedAccount = data;
                return this.staffS.isAccountNoUnique(data);
              }
              return EMPTY;
            })
          ).subscribe(next => {
            if (next == 1) {
              this.accountTaken = false;
              this.staffForm.patchValue({
                accountNo: this.generatedAccount.toUpperCase()
              });
            }
    
            if (next == 0) {
              this.accountTaken = true;
            }
      });
  }

  clearPersonalDetails(): void{
    this.staffForm.patchValue({      
      surnameOrg: '',
      firstName: '',
      birthDate: '',
      gender: '',
      accountNo: ''
    });

    this.accountTaken = null;
  }

  generateAccount(): string {

    const fname = (this.staffForm.get('firstName').value).trim();
    const lname = (this.staffForm.get('surnameOrg').value).trim();
    const birthdate = this.staffForm.get('birthDate').value ? moment(this.staffForm.get('birthDate').value).format('YYYYMMDD') : '';
    const gender = this.staffForm.get('gender').value ? ' (' + (this.staffForm.get('gender').value).trim()[0] + ') ' : '';

    var _account = lname + ' ' + fname + gender + ' ' + birthdate;
    return this.globalS.isEmpty(_account.toUpperCase()) && _account.trim() !== '' ? null : _account.toUpperCase();
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
      contacttype: new FormControl(null),
      contact: new FormControl('')
    });
  }

  createAddress(): FormGroup {
    return this.fb.group({
      address1: new FormControl(''),
      type: new FormControl(null),
      suburb: new FormControl('')
    });
  }

  defaultContacts(): Array<FormGroup>{
    var groupArr: Array<FormGroup> = [];

    groupArr =[ new FormGroup({
      contacttype: new FormControl('HOME'),
      contact: new FormControl('')
    }),new FormGroup({
        contacttype: new FormControl('MOBILE'),
        contact: new FormControl('')
    })]
    return groupArr;
  }

  defaultAddress(): Array<FormGroup>{
    var groupArr: Array<FormGroup> = [];

    groupArr =[ new FormGroup({
        type: new FormControl('RESIDENTIAL'),
        address1: new FormControl(''),
        suburb: new FormControl('')
    }),new FormGroup({
       type: new FormControl('POSTAL'),
        address1: new FormControl(''),
        suburb: new FormControl('')
    })]
    return groupArr;
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
    
    if(this.current == 1 && ((this.accountTaken) || this.globalS.isEmpty(this.staffForm.get('accountNo').value) || this.globalS.isEmpty(this.staffForm.get('surnameOrg').value)) ) return false;
    return true;
  }

  save(){
    
    const {
          type,               //category
          accountNo,

          surnameOrg,         //lastname
          firstName,          //firstname
          gender,             //gender
          birthDate,          //birthdate

          jobCategory,        //job category
          manager,            //manager
          branch,             //branch
          commencementDate,   //commencement date      
          
      } = this.staffForm.value;

      if(
          this.globalS.isEmpty(commencementDate) || 
          this.globalS.isEmpty(manager) || 
          this.globalS.isEmpty(branch) || 
          this.globalS.isEmpty(jobCategory)
        ){
          this.globalS.eToast('Error','Some Fields are required');
          return;
        }



      var addressList = (this.staffForm.value.addressForm).map(x => {
          let pcode = /(\d+)/g.test(x.suburb) ? x.suburb.match(/(\d+)/g)[0] : "";
          let suburb = /(\D+)/g.test(x.suburb) ? x.suburb.match(/(\D+)/g)[0] : "";

          if(!_.isEmpty(x.type) && !_.isEmpty(x.address1) && !_.isEmpty(suburb) && !_.isEmpty(pcode)){
              return {
                  personID: '',
                  description: x.type,
                  address1: x.address1.trim(),
                  suburb: suburb.trim(),
                  postcode: pcode.trim()
              }
          }
      }).filter(x => x)
      
      var contactList = (this.staffForm.value.contactForm).map(x => {
          if( !_.isEmpty(x.contact) && !_.isEmpty(x.contacttype) )
          {
              return {
                  detail: x.contact,
                  type: x.contacttype,
                  personID: ''
              }
          }
      }).filter(x => x);

      

      this.staffS.poststaffprofile({
          Staff: {
              accountNo: accountNo,
              firstName: firstName,
              lastName: surnameOrg,
              gender: gender,
              dob: birthDate ? moment(birthDate).format() : null,
              category: type,

              commencementDate: commencementDate ? moment(commencementDate).format() : null,
              stf_Department: branch,
              staffGroup: jobCategory,
              pan_Manager: manager
          },
          NamesAndAddresses: addressList,
          PhoneFaxOther: contactList
      }).subscribe(data => {
          if(data){
              this.globalS.sToast('Success','Staff Added');
              this.handleCancel();
              this.reload.next(true);
          }
      });

  }
}
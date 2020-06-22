
import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { mergeMap, debounceTime, distinctUntilChanged, takeUntil, switchMap, concatMap } from 'rxjs/operators';

import * as moment from 'moment';
import { RemoveFirstLast } from '@pipes/pipes';
import { TimeSheetService, GlobalService, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';

@Component({
  selector: 'app-add-referral',
  templateUrl: './add-referral.component.html',
  styleUrls: ['./add-referral.component.css']
})
  
export class AddReferralComponent implements OnInit {

  private verifyAccount = new Subject<any>();

  @Input() open: boolean = false;
  @Input() type: string = 'referral';

  @Output() openRefer = new EventEmitter();

  referralGroup: FormGroup;

  genderArr: Array<string> = gender
  typesArr: Array<string> = types
  titlesArr: Array<string> = titles
  addressType: Array<string> = []
  contactType: Array<string> = []


  loading: boolean;

  errorStr: string;

  branches: Array<string>;
  managers: Array<string>;
  agencies: Array<string>;

  private addresses: FormArray;
  private contacts: FormArray;

  current: number = 0;
  dateFormat: string = 'dd/MM/yyyy';
  generatedAccount: string;
  accountTaken: boolean;

  constructor(
    private clientS: ClientService,
    private formBuilder: FormBuilder,
    private globalS: GlobalService,
    private listS: ListService
  ) {

  }

  ngOnInit() {
    this.resetGroup();    

    this.verifyAccount.pipe(
      debounceTime(300),
      concatMap(e => {
        if (this.referralGroup && this.referralGroup.valid) {
          this.generatedAccount = this.generateAccount();
          return this.clientS.isAccountNoUnique(this.generatedAccount);
        } return EMPTY;
      })
    ).subscribe(next => {
      if (next == 1) {
        this.accountTaken = false;

        this.referralGroup.patchValue({
          accountNo: this.generatedAccount
        });
      }
      if (next == 0) {
        this.accountTaken = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && 
            !changes[property].firstChange &&
              changes[property].currentValue != null) {
        this.open = true;
        this.resetGroup();
      }
    }
  }

  resetGroup() {

    this.referralGroup = new FormGroup({
      gender: new FormControl(null),
      dob: new FormControl('', Validators.required),
      title: new FormControl(null),
      lastname: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      middlename: new FormControl('', Validators.required),
      tempaccountName: new FormControl(''),
      appendName: new FormControl(''),
      accountNo: new FormControl(''),
      organisation: new FormControl(''),
      type: new FormControl(0),

      addresses: new FormArray([this.createAddress()]),
      contacts: new FormArray([this.createContact()]),

      branch: new FormControl(''),
      agencyDefinedGroup: new FormControl(''),
      recipientCoordinator: new FormControl(''),
      referral: new FormControl(''),

      confirmation: new FormControl(null)
    });


    this.populateDropdowns();

    this.referralGroup.get('organisation').valueChanges
      .pipe(distinctUntilChanged(), debounceTime(200), mergeMap(x => {
        if (x) return this.clientS.isAccountNoUnique(x)
        else return of(-1)
      }))
      .subscribe(data => {
        this.processOutput(data);
      });

    this.referralGroup.get('appendName').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.referralGroup.patchValue({
          tempaccountName: this.appendAccount(),
          confirmation: null
        });
      });

    this.referralGroup.get('firstname').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.verifyAccount.next();
      });

    this.referralGroup.get('dob').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.verifyAccount.next();
      });

    this.referralGroup.get('lastname').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.verifyAccount.next();
      });
    
    this.referralGroup.get('middlename').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.verifyAccount.next();
      });

    this.referralGroup.get('gender').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.verifyAccount.next();
      });


    this.referralGroup.get('title')
      .valueChanges
      .subscribe((data: string) => {
        const title = data.toUpperCase();
        if (title == 'MR') {
          this.referralGroup.patchValue({ gender: 'MALE' })
        } else if (title == 'MS' || title == 'MRS') {
          this.referralGroup.patchValue({ gender: 'FEMALE' })
        } else {
          this.referralGroup.patchValue({ gender: '' })
        }
        this.verifyAccount.next();
      });

  }

  // contactTypeChange(index: number) {
  //   var contact = this.referralGroup.get('contacts') as FormArray;
  //   contact.controls[index].get('contact').reset();
  // }

  resetappendName(): void {
    this.referralGroup.get('appendName').disable;
    this.referralGroup.patchValue({
      appendName: ''
    });
    this.referralGroup.get('appendName').enable;
  }

  processOutput(data: number, isStrIncluded: boolean = false): void {
    let obj = null;
    if (data == 1) {
      obj = {
        accountNo: !isStrIncluded ? this.generateAccount() : this.appendAccount(),
        confirmation: true
      }
    }

    if (data == 0) {
      obj = {
        accountNo: this.generateAccount(),
        tempaccountName: this.generateAccount(),
        confirmation: false
      }
      this.errorStr = 'Account is taken';
    }

    //
    if (data == -1) {
      obj = {
        accountNo: this.generateAccount(),
        confirmation: false
      }
      this.errorStr = this.type == 'referral' ? 'Lastname and Firstname are required' : 'Organisation Name required';
    }
    this.referralGroup.patchValue(obj);
    this.loading = false;
  }

  _keydown(event: KeyboardEvent) {
    // numbers only /[0-9\+\-\ ]/
    if (!event.key.match(/^[a-zA-Z ]*$/)) return false;
  }

  isNamesComplete(): boolean {
    return !this.globalS.isEmpty(this.referralGroup.get('lastname').value) &&
      !this.globalS.isEmpty(this.referralGroup.get('firstname').value);
  }

  isNameDataValidated(): boolean {
    if (!this.globalS.isEmpty(this.referralGroup.get('lastname').value) &&
      !this.globalS.isEmpty(this.referralGroup.get('firstname').value)) {
      return true;
    }
    return false;
  }

  generateAccount(): string {
    const fname = (this.referralGroup.get('firstname').value).trim();
    const lname = (this.referralGroup.get('lastname').value).trim();
    const birthdate = this.referralGroup.get('dob').value ? moment(this.referralGroup.get('dob').value).format('YYYYMMDD') : '';
    const gender = this.referralGroup.get('gender').value ? ' (' + (this.referralGroup.get('gender').value).trim()[0] + ') ' : '';

    var _account = this.type === 'referral' ? lname + ' ' + fname + gender + ' ' + birthdate : (this.referralGroup.get('organisation').value).trim();
    return _account.toUpperCase() || '';
  }

  appendAccount(): string {
    var tName = (this.referralGroup.get('tempaccountName').value).trim();
    var aName = (this.referralGroup.get('appendName').value).trim();

    return (tName + aName.toUpperCase()) || '';
  }

  populateDropdowns(): void {
    this.clientS.getcontacttype().subscribe(data => {
      this.contactType = data.map(x => {
        return (new RemoveFirstLast().transform(x.description)).trim();
      });
    })
    this.clientS.getaddresstype().subscribe(data => {
      this.addressType = data.map(x => {
        return new RemoveFirstLast().transform(x.description)
      });
    })
    this.listS.getlistbranches().subscribe(data => this.branches = data);
    this.clientS.getmanagers().subscribe(data => this.managers = data);
    this.listS.getserviceregion().subscribe(data => this.agencies = data);
  }

  add() {
    this.referralGroup.controls["dob"].setValue(this.referralGroup.value.dob ? moment(this.referralGroup.value.dob).format() : '')
    var manager = (this.managers[this.referralGroup.get('recipientCoordinator').value] as any);
    this.referralGroup.controls["recipientCoordinator"].setValue(manager.description);

    this.filterContacts(<FormArray>this.referralGroup.controls.contacts);
    this.filterAddress(<FormArray>this.referralGroup.controls.addresses);

    console.log(this.referralGroup.value);
    
    this.openRefer.emit({
      address: "",
      agencyDefinedGroup: "KYOGLE",
      code: "SSSD ASDD (M)  20200620",
      contact: "",
      id: "T0100005782",
      view: "recipient"
    });

    // this.clientS.postprofile(this.referralGroup.value)
    //   .subscribe(data => {
    //     this.handleCancel();
    //     this.openRefer.emit(data);
    //     this.globalS.sToast('Success', 'Recipient Added')        
    //   });
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  filterContacts(arr: FormArray) {

    let contacts: Array<any> = arr.value;
    let filteredResults = []; 

    if (contacts && contacts.length > 0) {
      filteredResults = contacts.filter(e => !this.globalS.isEmpty(e.contacttype) && !this.globalS.isEmpty(e.contact))
    }

    this.clearFormArray(arr);

    if(filteredResults.length > 0){
      for (var a = 0; a < filteredResults.length; a++) {
        let contactsFormArray = this.referralGroup.get('contacts') as FormArray;

        contactsFormArray.push(this.formBuilder.group({
          contacttype: new FormControl(filteredResults[a].contacttype),
          contact: new FormControl(filteredResults[a].contact)
        }));
      }    
    }
    
  }

  filterAddress(arr: FormArray) {
    
    let addresses: Array<any> = arr.value;
    let filteredResults = [];

    if (addresses && addresses.length > 0) {
      filteredResults = addresses.filter(e => !this.globalS.isEmpty(e.address1) && !this.globalS.isEmpty(e.type) && !this.globalS.isEmpty(e.suburb))
    }

    this.clearFormArray(arr);
    if (filteredResults.length > 0) {
      for (var a = 0; a < filteredResults.length; a++) {
        let addressForm = this.referralGroup.get('addresses') as FormArray;

        addressForm.push(this.formBuilder.group({
          address1: new FormControl(filteredResults[a].address1),
          type: new FormControl(filteredResults[a].type),
          suburb: new FormControl(filteredResults[a].suburb)
        }));
      }
    }   
  }

  addAddress(): void {
    this.addresses = this.referralGroup.get('addresses') as FormArray;
    this.addresses.push(this.createAddress());
  }

  deleteAdd(i: number): void {
    this.addresses = this.referralGroup.get('addresses') as FormArray;
    this.addresses.removeAt(i);
  }

  createAddress(): FormGroup {
    return this.formBuilder.group({
      address1: new FormControl(''),
      type: new FormControl(''),
      suburb: new FormControl('')
    });
  }

  addContact(): void {
    this.contacts = this.referralGroup.get('contacts') as FormArray;
    this.contacts.push(this.createContact());
  }

  deleteCont(i: number): void {
    this.contacts = this.referralGroup.get('contacts') as FormArray;
    this.contacts.removeAt(i);
  }

  createContact(): FormGroup {
    return this.formBuilder.group({
      contacttype: new FormControl('MOBILE'),
      contact: new FormControl('')
    });
  }

  verify() {

    if (!this.isNameDataValidated()) {
      this.processOutput(-1);
      return;
    }

    const account = this.referralGroup.get('tempaccountName').value;

    this.clientS.isAccountNoUnique(account)
      .subscribe(data => {
        this.processOutput(data);
      });
  }

  isPhoneNumber(fg: FormGroup): boolean {
    let type = fg.value.contacttype;

    if (!type)  return false;
    type = type.toUpperCase();     
    
    return type === 'FAX' || type === 'HOME' || type === 'MOBILE' || type === 'PHONE' || type === 'WORK MOBILE' || type === 'WORK';
  }

  handleCancel() {
    this.open = false;
    this.generatedAccount = null;
    this.accountTaken = null;
    this.current = 0;

    this.resetGroup();
  }

  next() {
    this.current += 1;
  }

  pre() {
    this.current -= 1;
  }

  onKeyPress(data: KeyboardEvent) {
    return this.globalS.acceptOnlyLetters(data);
  }

  get canGoNext(): boolean {
    //if (this.current == 0) return true;
    if (this.current == 0 && this.accountTaken == false) return true;
    if (this.current == 1) return true;
    if (this.current == 2) return true;
    return false;
  }

  get canBeDone(): boolean {
    let { branch, agencyDefinedGroup, recipientCoordinator } = this.referralGroup.value;
    return !this.globalS.isEmpty(branch) && !this.globalS.isEmpty(agencyDefinedGroup) && !this.globalS.isEmpty(recipientCoordinator)
  }

  contactTypeChange(index: any) {
    var contact = this.referralGroup.get('contacts') as FormArray;
    contact.controls[index].get('contact').reset();
  }

}

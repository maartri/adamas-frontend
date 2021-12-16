import { Component, OnInit, forwardRef, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, SettingsService } from '@services/index';
import * as _ from 'lodash';
import { forkJoin, Observable, EMPTY, Subject } from 'rxjs';
import parseISO from 'date-fns/parseISO'
import { RemoveFirstLast } from '../../pipes/pipes';
import { mergeMap, debounceTime, distinctUntilChanged, first, take, takeUntil, switchMap, concatMap } from 'rxjs/operators';
import * as moment from 'moment';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays'

const noop = () => {};

const defaultTimeSpent = new Date().setHours(0, 15);
const defaultDate = new Date().setHours(0,0);
const defaultDateTime = new Date();

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

  private destroy$ = new Subject();

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
  activities: Array<string> = [];

  FUNDING_TYPE: string = "!INTERNAL";
  BRANCH_NAME: string;
  
  staffForm: FormGroup;

  generatedAccount: string;
  accountTaken: boolean = null;

  dateFormat: string = 'dd/MM/yyyy';

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  notifFollowUpGroup: any;
  notifDocumentsGroup: any;
  followups: Array<string>;

  notifCheckBoxes: Array<string> = [];
  notifCompetenciesGroup: Array<any> = [];

  competencies: Array<string> = [];

  datalist: Array<string>;

  private verifyAccount = new Subject<any>();
  private verifyAccountPerOrg = new Subject<any>();

  defaultDate: string;
  firstOpenChange: boolean = false;
  
  
  constructor(
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private listS: ListService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private titleCase: TitleCasePipe
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

        activity: null,

        // date
        date: new Date(),
        time: new Date(),
        timeSpent: new Date(defaultTimeSpent),

        // note details
        radioGroup: 'CASENOTE',
        notes: null,


    });

    this.staffForm.get('accountNo').valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(data => {
        this.verifyAccount.next(data);
    })

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
      .pipe(
        debounceTime(500)
      )
      .subscribe(data => {
          if(this.staffForm.get('orgType').value === 'Organisation'){
            this.verifyAccountPerOrg.next(data);
          } else {
            this.verifyAccount.next(null);
          }          
      });

    this.staffForm.get('firstName').valueChanges
      .pipe(debounceTime(500))
      .subscribe(data => {
        this.verifyAccount.next(null);
      });

    this.staffForm.get('birthDate').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.verifyAccount.next(null);
      });

    this.staffForm.get('gender').valueChanges
      .pipe(debounceTime(300))
      .subscribe(data => {
        this.verifyAccount.next(null);
      });

    // For Person Check if Account is present
    this.verifyAccount.pipe(
        debounceTime(300),
        concatMap(e => {
          this.accountTaken = null;
          if (e == null) {
            this.generatedAccount = this.generateAccount(); 
            if(this.generatedAccount && this.staffForm.valid) {
              return this.staffS.isAccountNoUnique(this.generatedAccount);
            }
          }

          if (!this.globalS.isEmpty(e)) {   
              this.generatedAccount = e;         
              return this.staffS.isAccountNoUnique(this.generatedAccount);            
          }
          
          return EMPTY;
        })
      ).subscribe(next => {
        var haha = this.titleCase.transform(this.generatedAccount);
        console.log(haha);
        this.staffForm.patchValue({
          accountNo: haha
        }, { emitEvent: false});


        if (next == 1) {
          this.accountTaken = false;
          this.cd.markForCheck();
        }

        if (next == 0) {
          this.accountTaken = true;
          this.cd.markForCheck();
        }
      });

      // For Organisation Check if Account is present
      this.verifyAccountPerOrg
          .pipe(
            debounceTime(300),
            distinctUntilChanged(),
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
              }, { emitEvent: false});
            }
    
            if (next == 0) {
              this.accountTaken = true;
            }
            this.cd.markForCheck();
      });
  }

  checkIfPersonalDetailsHasNoValue(): boolean {
    const { surnameOrg, firstName, birthDate, gender } = this.staffForm.value;
    return (!this.globalS.isEmpty(surnameOrg) 
              &&  !this.globalS.isEmpty(firstName) 
              && !this.globalS.isEmpty(birthDate) 
              && !this.globalS.isEmpty(gender));
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

    this.listS.getlistbranches().subscribe(data => this.branchesArr = data);
    this.listS.getliststaffgroup().subscribe(data => this.jobCategoryArr = data);
    this.listS.getlistcasemanagers().subscribe(data => this.managerArr = data);
    this.listS.getstaffactivities().subscribe(data => this.activities = data)
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
        type: new FormControl('USUAL'),
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

      console.log(this.current);

      if(this.current == 4){
        this.populateNotificationDetails();
      }
  }

  specialPages: Array<number> = [0,3];

  get nextRequired() {
    
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
      notes,
      activity
  } = this.staffForm.value;

    if(this.current == 0 && (!this.globalS.isEmpty(this.staffForm.get('surnameOrg').value)   && (!this.accountTaken) && (this.staffForm.get('orgType').value === 'Organisation'))) return true;
   
    if(this.current == 0 && (this.staffForm.get('orgType').value === 'Individual') && this.checkIfPersonalDetailsHasNoValue()  && (!this.accountTaken) && !this.globalS.isEmpty(this.staffForm.get('accountNo').value)) return true;

    if(this.current == 3 && (!this.globalS.isEmpty(activity) && !this.globalS.isEmpty(manager) && !this.globalS.isEmpty(branch) && !this.globalS.isEmpty(jobCategory))) return true;

    if(!this.specialPages.includes(this.current)) return true;

    return false;
  }

  isMobile(data: any){
    return data == 'MOBILE';
  }

  isPhoneFax(data: any){
    return data == 'FAX' || data == 'HOME' || data == 'WORK';
  }

  notif(data: any){  
    var temp1 = data.find(x => x.checked === true)
    this.listS.getnotifyaddresses(temp1.label).subscribe(x => this.globalS.emailaddress = x)  
  }

  doc(data:any){
                    
    var temp = data.find(x => x.checked === true)
    this.globalS.doc = temp.label.toString();
    
  }

  followup(data: any){
    var temp
    temp = data.find(x => x.checked === true)
    this.globalS.followups = temp
  } 

  save(){
    
    console.log(this.notifCompetenciesGroup);
    // return;

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
          notes
      } = this.staffForm.value;

      if(
          // this.globalS.isEmpty(commencementDate) || 
          this.globalS.isEmpty(manager) || 
          this.globalS.isEmpty(branch) || 
          this.globalS.isEmpty(jobCategory)
        ){
          this.globalS.eToast('Error','Commencement Date,Branch, Job Category, Coordinator/Manager Fields are required');
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
              accountNo: (accountNo || surnameOrg).toUpperCase(),
              firstName: firstName,
              lastName: this.titleCase.transform(surnameOrg),
              gender: gender,
              dob: birthDate ? moment(birthDate).format() : null,
              category: type,
              commencementDate: commencementDate ? moment(commencementDate).format() : null,
              stf_Department: branch,
              staffGroup: jobCategory,
              pan_Manager: manager
          },
          NamesAndAddresses: addressList,
          PhoneFaxOther: contactList,
          Competencies: this.notifCompetenciesGroup.filter(x => x.checked).map(x => x.label)
      }).subscribe(data => {
          if(data){
              this.globalS.sToast('Success','Staff Added');
              this.handleCancel();

              if (this.globalS.followups != null){
                this.writereminder(data.uniqueId, notes, this.notifFollowUpGroup);
              }
              
              if (this.globalS.emailaddress != null){
                this.emailnotify(); 
              }

              this.reload.next(true);              
          }
      });
  }

  writereminder(personid: string, notes: string, followups: Array<any>){
    var sql = '', temp = '';
  
    // console.log(this.notifFollowUpGroup);

    for(var followup of followups)
    {
      var dateCounter = parseInt(followup.dateCounter);
      var reminderDatePlusDateCounter = format(addDays(new Date(), dateCounter),'dd/MM/yyyy');

      if(followup.checked){
        sql = sql +"INSERT INTO HumanResources([PersonID], [Notes], [Group],[Type],[Name],[Date1],[Date2]) VALUES ('"+personid+"','"+ notes+"',"+"'RECIPIENTALERT','RECIPIENTALERT','" + followup.label + "','" + reminderDatePlusDateCounter +"','"+ reminderDatePlusDateCounter +"');";
      }
    }

    // let Date1 : Date   = new Date();
    // let Date2 : Date   = new Date(Date1);
    
    // temp = (this.globalS.followups.label).toString().substring(0,2);
    
    // switch (temp) {
    //   case '10':
    //   Date2.setDate(Date2.getDate() + 10)
      
    //   break;
    //   case '30':
    //   Date2.setDate(Date2.getDate() + 30)
    //   break;
      
    //   default:
    //   break;
    // }

    // sql = "INSERT INTO HumanResources([PersonID], [Notes], [Group],[Type],[Name],[Date1],[Date2]) VALUES ('"+this.globalS.id.toString()+"','"+ this.globalS.followups.label.toString()+"',"+"'RECIPIENTALERT','RECIPIENTALERT','FOLLOWUP REMINDER','" +format(Date1,'yyyy/MM/dd') +"','"+format(Date2,'yyyy/MM/dd') +"') ";
    
    this.clientS.addRefreminder(sql).subscribe(x => console.log(x) );                  
    // this.globalS.followups = null;
  }

  emailnotify(){              
              
    const { notes } = this.staffForm.value;

    let notifications =  this.notifCheckBoxes.filter((x:any) => x.checked == true);
    let emails = notifications.map((x: any) => x.email).join(';')

    // var emailTo = this.globalS.emailaddress; 
    
    var emailSubject = "ADAMAS NOTIFICATION";
    var emailBody = notes;  

    location.href = "mailto:" + emails + "?" +     
    (emailSubject ? "subject=" + emailSubject : "") + 
    (emailBody ? "&body=" + emailBody : "");
    
    this.globalS.emailaddress = null;              
  }


  populateNotificationDetails(){

   const { manager, branch, activity } = this.staffForm.value;
   const listname = 'StaffOnBoard Notification';

   this.listS.getstaffcompetencylist({
    branch: branch,
    type: activity,
    fundingType: 'SW-CAS',
    group: 'COMPETENCY'
   }).subscribe(data =>{
    this.notifCompetenciesGroup = data.map(x => {
      return {
        label: x,
        value: x,
        disabled: false,
        checked: true
      }
    });
   })


    this.listS.getnotifications({
      branch: branch,
      coordinator: manager,
      listname: listname,
      fundingsource: this.FUNDING_TYPE
    }).subscribe(data => {
      this.notifCheckBoxes = data.map(x => {
        return {
          label: x.staffToNotify,
          value: x.staffToNotify,
          email: x.email,
          disabled: x.mandatory ? true : false,
          checked: x.mandatory ? true : false
        }
      });
      this.changeDetection();
    });

    this.listS.getfollowups({
      branch: branch,
      fundingType: this.FUNDING_TYPE,
      type: activity,
      group: 'FOLLOWUP'
    }).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.notifFollowUpGroup = data.map(x => {
        return {
          label: x.reminders,
          value: x.reminders,
          dateCounter: x.user1,
          disabled: false,
          checked: false
        }
      });
      this.changeDetection();
    })


    this.listS.getdocumentslist({
      branch: branch,
      fundingType: this.FUNDING_TYPE,
      type: activity,
      group: 'DOCUMENTS'
    }).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.notifDocumentsGroup = data.map(x => {
        return {
          label: x,
          value: x,
          disabled: false,
          checked: false
        }
      })
      this.changeDetection();
    });

    this.listS.getdatalist({
      branch: branch,
      fundingType: this.FUNDING_TYPE,
      type: activity,
      group: 'XTRADATA'
    }).pipe(takeUntil(this.destroy$)).subscribe(data =>  {
      this.datalist = data.map(x =>{
        return {
          form: x.form,
          link: (x.link).toLowerCase()
        }
      })
      this.changeDetection();
    }); 
  }

  changeDetection(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

   getdefaultDate(){
    this.defaultDate = this.globalS.getAgedCareDate()
   }

   defaultBirthDate(): Date{
    var currDate = new Date();
    currDate.setFullYear(currDate.getFullYear() - 65);
    return currDate;
  }

   dateOpenChange(data: any){
    if(this.firstOpenChange || !data) return;
    this.firstOpenChange = true;
    this.staffForm.patchValue({
      birthDate: this.defaultBirthDate()
    });
  }

  notifChange(data: any){ 
    var temp1 = data.filter(x => x.checked === true).map(x => x.email);
    this.globalS.emailaddress = temp1;
  }

  followupChange(data: any){
    var temp
    temp = data.find(x => x.checked === true)
    this.globalS.followups = temp
  } 

     
  docChange(data:any){                    
    var temp = data.find(x => x.checked === true)
    this.globalS.doc = temp.label.toString();                    
  }

  competencyChange(data: any){
    
  }
}

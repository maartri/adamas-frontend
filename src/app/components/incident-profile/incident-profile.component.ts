import { Component, OnInit, forwardRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, SettingsService } from '@services/index';
import * as _ from 'lodash';
import { mergeMap, takeUntil, concatMap, switchMap, map } from 'rxjs/operators';
import { forkJoin, Observable, EMPTY, Subject } from 'rxjs';
import parseISO from 'date-fns/parseISO'
import { ProfileInterface } from '@modules/modules';

const noop = () => {};

@Component({
  selector: 'app-incident-profile',
  templateUrl: './incident-profile.component.html',
  styleUrls: ['./incident-profile.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => IncidentProfileComponent),
    }
  ],
})


export class IncidentProfileComponent implements OnInit, ControlValueAccessor {
  private unsubscribe: Subject<void> = new Subject();
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  radioValue = 'A';
  date: Date = new Date();
  innerValue: any;
  user: any;
  genderArr: Array<string> = gender;
  listRecipients: Array<string>  = [];

  userForm: FormGroup;

  dateFormat: string = 'dd/MM/yyyy';

  constructor(
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private listS: ListService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }  

  pathForm(token: ProfileInterface) {
    console.log(token);
    if (this.globalS.isEmpty(token))
      return;
    
    if (token.view == view.recipient) {
      this.clientS.getprofile(token.name).pipe(
        concatMap(data => {
          this.user = data;

          this.patchTheseValuesInForm(data);
          return this.getUserData(data.uniqueID);
        }),
        // concatMap(data => {
        //   // this.backgroundImage = this.refreshDynamicPicture(this.user);

        //   this.user.addresses = this.addressBuilder(data[0]);
        //   this.user.contacts = this.contactBuilder(data[1]);
        //   this.user.casestaff = data[2];

        //   this.cd.markForCheck();
        //   this.cd.detectChanges();
        //   return this.staffS.getimages({ directory: this.user.filePhoto })
        // })
      ).subscribe(data => {
        //   this.user.addresses = this.addressBuilder(data[0]);
        //   this.user.contacts = this.contactBuilder(data[1]);

        this.userForm.patchValue({
          primaryAddress: this.getPrimaryAddress(data[0]),
          primaryPhone: this.getPrimaryContact(data[1])
        })

        //this.onChangeCallback(this.userForm.value);
      });     
    }

    if (token.view == view.staff) {
      this.staffS.getprofile(token.name).pipe(
        concatMap(data => {
          if (!data) return EMPTY;
          
          this.user = data;
          this.user.rating = data.rating ? data.rating.split('*').length - 1 : 0;
          this.patchTheseValuesInForm(data);
          return this.getUserData(data.uniqueID);
        }),
      ).subscribe(data => {
        this.userForm.patchValue({
          primaryAddress: this.getPrimaryAddress(data[0]),
          primaryPhone: this.getPrimaryContact(data[1])
        })
        // this.user.addresses = this.addressBuilder(data[0]);
        // this.user.contacts = this.contactBuilder(data[1]);
      });
    }
  }

  buildForm(): void{
    this.userForm = this.formBuilder.group({
      accountNo: [''],
      surnameOrg: [''],
      preferredName: [''],
      firstName: [''],
      middleNames: [''],
      gender: [''],
      year: [''],
      month: [''],
      day: [''],
      title: [''],
      uniqueID: '',

      file1: [''],
      file2: [''],
      subCategory: [''],
      branch: [''],

      serviceRegion: [''],
      casemanager: [''],

      caldStatus: [''],
      indigStatus: [''],
      primaryDisability: [''],
      note: [''],
      type: [''],
      jobCategory: [''],
      adminCategory: [''],
      team: [''],
      gridNo: [''],
      dLicense: [''],
      mvReg: [''],
      nReg: [''],
      isEmail: false,
      isRosterable: false,
      isCaseLoad: false,
      stf_Department: '',
      rating: '',

      // Incidents Properties
      subjectName: '',
      dob: '',
      primaryAddress: '',
      primaryPhone: '',
      recipient: '',
      reportedBy: '',
      startTimeOfIncident: '',
      endTimeOfIncident: '',
      dateOfIncident: ''
    });
  }

  getUserData(code: any) {
    return forkJoin([
      this.clientS.getaddress(code),
      this.clientS.getcontacts(code),
      // this.timeS.getcasestaff(code)
    ]);
  }

  transform(user: any) {
      if (!user) return;
      
      return {
          name: user.code,
          view: user.view,
          id: user.id,
          sysmgr: user.sysmgr
      }
  }

  searchStaff(): void {
    this.listRecipients = []
    this.timeS.getstaff({
      User: this.globalS.decode().nameid,
      SearchString: ''
    }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.listRecipients = data;
    });
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    console.log(value);
    if (value != null) {
      this.innerValue = value;      
      this.pathForm(this.transform(this.innerValue));
      // this.searchStaff();
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


  patchTheseValuesInForm(user = this.user) {

    if (this.innerValue.view === view.recipient) {
      this.userForm.patchValue({
        accountNo: user.accountNo,
        title: user.title,
        surnameOrg: user.surnameOrg,
        firstName: user.firstName,
        middleNames: user.middleNames,
        gender: this.getGender(user.gender),
        year: this.globalS.filterYear(user.dateOfBirth),
        month: this.globalS.searchOf(this.globalS.filterMonth(user.dateOfBirth), months, 'December'),
        day: this.globalS.filterDay(user.dateOfBirth),

        casemanager: user.recipient_Coordinator,
        file1: user.agencyIdReportingCode,
        branch: user.branch,
        file2: user.urNumber,
        subCategory: user.ubdMap,
        serviceRegion: user.agencyDefinedGroup,

        dob: this.getBirthdate(user.dateOfBirth)
      });

      // this.contactIssueGroup.patchValue({
      //   value: user.contactIssues
      // })

      // this.contactIssueGroup.patchValue({
      //     value: user.contactIssues
      // })

      // this.rosterAlertGroup.patchValue({
      //     value: user.notes
      // })

      // this.runsheetAlertGroup.patchValue({
      //     value: user.specialConsiderations
      // })

    }

    if (this.innerValue.view === view.staff) {

      this.userForm.patchValue({
        accountNo: user.accountNo,
        
        title: user.title,
        surnameOrg: user.lastName,
        firstName: user.firstName,
        middleNames: user.middleNames,
        gender: this.globalS.searchOf(user.gender, this.genderArr, this.genderArr[2]),
        year: this.globalS.filterYear(user.dob),
        month: this.globalS.searchOf(this.globalS.filterMonth(user.dob), months, 'December'),
        day: this.globalS.filterDay(user.dob),
        preferredName: user.preferredName,

        casemanager: user.pan_Manager,
        type: user.category,
        stf_Department: user.stf_Department,
        jobCategory: user.staffGroup,
        adminCategory: user.subCategory,
        team: user.staffTeam,
        serviceRegion: user.serviceRegion,
        gridNo: user.ubdMap,
        dLicense: user.dLicence,
        mvReg: user.vRegistration,
        nReg: user.nRegistration,
        rating: user.rating,

        caldStatus: user.caldStatus,
        indigStatus: user.cstda_Indiginous,
        primaryDisability: user.cstda_DisabilityGroup,
        note: user.contactIssues,

        isEmail: user.emailTimesheet,
        isRosterable: user.isRosterable,
        isCaseLoad: user.caseManager,

        subjectName: `${user.firstName} ${user.lastName}`,
        dob: user.dob ? new Date(user.dob) : null
      });
      console.log(this.userForm.value)
    }
  }

  getPrimaryAddress(addresses: Array<any>){
      var address: any = addresses.filter(x => x.primaryAddress);
      if(this.globalS.isEmpty(address)) return '';
      var address = address[0]
      return `${address.postCode} ${ address.address1 } ${address.suburb}`;
  }

  getPrimaryContact(contacts: Array<any>){
    var contact: any = contacts.filter(x => x.primaryPhone);
    if(this.globalS.isEmpty(contact)) return '';
    var contact = contact[0]
    return `${contact.detail}`;
  }

  getGender(gender: string): string{
    if(this.globalS.isEmpty(gender)) return;

    var _gender = gender.toLowerCase();
    if(_gender === 'male')
      return 'male';

    if(_gender === 'female')
      return 'female';
  }

  getBirthdate(bday: string): Date{
    var _bday = parseISO(bday);
    if(_bday.toString() === 'Invalid Date')  return null;
    return parseISO(bday);
  }

}

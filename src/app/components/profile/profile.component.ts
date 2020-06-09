import { Component, OnInit, Input, forwardRef, ViewChild, OnDestroy, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';


import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, SettingsService } from '@services/index';
import * as _ from 'lodash';
import { mergeMap, takeUntil, concatMap, switchMap, map } from 'rxjs/operators';
import { forkJoin, Observable, EMPTY } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { RemoveFirstLast } from '@pipes/pipes';

declare var Dto: any;

const noop = () => {
};

const PROFILEPAGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  multi: true,
  useExisting: forwardRef(() => ProfileComponent),
};

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [
    PROFILEPAGE_VALUE_ACCESSOR
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() isAdmin: boolean = false;
  
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  showUpload: boolean = false;
  innerValue: Dto.ProfileInterface;

  profileStaffModal: boolean = false;
  profileStaffOptionsModal: boolean = false;
  profileStaffPreferredModal: boolean = false;

  tabIndex: number = 0;

  profileRecipientOptionsModal: boolean = false;

  editModalOpen: boolean = false;
  user: any;

  window: number;
  view = view;

  selectedValue: any

  contactsArray: Array<any> = [];
  addressArray: Array<any> = [];

  years: Array<string> = [];
  months: Array<string> = [];
  days: Array<string> = [];

  casemanagers: Array<any> = [];
  subscriptionArray: Array<Observable<any>> = []

  contactForm: FormGroup;
  addressForm: FormGroup;
  userForm: FormGroup;
  emailCoordinatorGroup: FormGroup;
  contactIssueGroup: FormGroup;

  loading: boolean = false;
  editProfileDrawer: boolean = false;
  addAddressDrawer: boolean = false;
  addContactDrawer: boolean = false;
  changeProfilePictureModal: boolean = false;

  titles: Array<string> = titles;
  genderArr: Array<string> = gender;
  typesArr: Array<string> = types;
  caldStatuses: Array<string> = caldStatuses

  showMailManagerBtn: boolean = false;
  emailManagerOpen: boolean = false;
  emailManagerNoEmailShowNotif: boolean = false;

  caseManagerDetails: any;
  dropDowns: Dto.DropDowns;

  _settings: SettingsService;

  imgSrc: any;
  showAvatar: boolean;

  constructor(
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private listS: ListService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private settings: SettingsService,
    private cd: ChangeDetectorRef,
    private ds: DomSanitizer
  ) {

  }

  ngOnInit() {
    const { role } = this.globalS.decode();
    this._settings = this.settings;

    if (role == roles.client) {
      this.showMailManagerBtn = true;
    }

    
    this.buildForms();
    this.POPULATE_DATE_DROPDOWNS();
    this.POPULATE_OTHER_DROPDOWNS();
  }

  ngOnDestroy() {

  }

  buildForms(): void {

    this.contactIssueGroup = this.formBuilder.group({
      value: ''
    });

    this.contactForm = this.formBuilder.group({
      id: [''],
      type: ['', [Validators.required]],
      details: ['', [Validators.required]],
      personId: ['']
    });

    this.addressForm = this.formBuilder.group({
      id: [''],
      description: [null, [Validators.required]],
      address: [null, [Validators.required]],
      pcodesuburb: [null, [Validators.required]],
      personId: ['']
    });


    this.userForm = this.formBuilder.group({
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
      rating: ''
    });

    this.resetEmailCoordinator();

  }

  patchTheseValuesInForm(user = this.user) {

    if (this.innerValue.view === view.recipient) {
      this.userForm.patchValue({
        title: user.title,
        surnameOrg: user.surnameOrg,
        firstName: user.firstName,
        middleNames: user.middleNames,
        gender: this.globalS.searchOf(user.gender, this.genderArr, this.genderArr[2]),
        year: this.globalS.filterYear(user.dateOfBirth),
        month: this.globalS.searchOf(this.globalS.filterMonth(user.dateOfBirth), months, 'December'),
        day: this.globalS.filterDay(user.dateOfBirth),

        casemanager: user.recipient_Coordinator,
        file1: user.agencyIdReportingCode,
        branch: user.branch,
        file2: user.urNumber,
        subCategory: user.ubdMap,
        serviceRegion: user.agencyDefinedGroup
      });

      console.log(user.contactIssues)

      this.contactIssueGroup.patchValue({
        value: user.contactIssues
      })

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
        isCaseLoad: user.caseManager
      });

      this.cd.markForCheck();
      this.cd.detectChanges();

      // this.notesGroup.patchValue({
      //     notes: user.contactIssues,
      //     caldStatus: user.caldStatus ? user.caldStatus.toUpperCase() : null,
      //     indigStatus: user.cstda_Indiginous ? user.cstda_Indiginous.toUpperCase() : null,
      //     primaryDisability: user.cstda_DisabilityGroup ? user.cstda_DisabilityGroup.toUpperCase() : null
      // })

    }
  }


  resetEmailCoordinator() {
    this.emailCoordinatorGroup = this.formBuilder.group({
      subject: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required])
    });
  }

  emailManager() {
    this.emailCoordinatorGroup.reset();

    this.emailManagerOpen = true;
    this.caseManagerDetails = this.casemanagers.find(x => { return x.description == this.user.recipient_Coordinator });
    
    this.emailManagerNoEmailShowNotif = this.globalS.isEmpty(this.caseManagerDetails) ? false : true; 
  }

  pathForm(token: Dto.ProfileInterface) {

    if (this.globalS.isEmpty(token))
      return;

    if (token.view == view.recipient) {
      this.clientS.getprofile(token.name).pipe(
        mergeMap(data => {
          this.user = data;
          
          this.patchTheseValuesInForm(data);
          return this.getUserData(data.uniqueID);
        })).subscribe(data => {

          // this.backgroundImage = this.refreshDynamicPicture(this.user);

          this.user.addresses = this.addressBuilder(data[0]);
          this.user.contacts = this.contactBuilder(data[1]);
          this.user.casestaff = data[2];

          this.cd.markForCheck();
          this.cd.detectChanges();

          // this.globalS.userProfile = this.user;

          // this.addresses = data[0];
          // this.contacts = data[1];

          // this.patchTheseValuesInForm(this.user)

          // this.addressForm.setControl('addresses', this.formBuilder.array(this.addressBuilder(data[0]) || []));
          // this.contactForm.setControl('contacts', this.formBuilder.array(this.contactBuilder(data[1]) || []));

          // this.tempContactArray = this.contactForm.get('contacts').value;
        });     
    }

    if (token.view == view.staff) {
      this.staffS.getprofile(token.name).pipe(
        concatMap(data => {
          if (!data) return EMPTY;

          console.log(data)
          this.user = data;
          this.user.rating = data.rating ? data.rating.split('*').length - 1 : 0;
          this.patchTheseValuesInForm(data);
          return this.getUserData(data.uniqueID);
        }),
        concatMap(data => {

          this.src = this.imgSrc;
          // this.backgroundImage = this.refreshDynamicPicture(this.user)

          this.user.addresses = this.addressBuilder(data[0]);
          this.user.contacts = this.contactBuilder(data[1]);

          this.cd.markForCheck();
          this.cd.detectChanges();

          // this.globalS.userProfile = this.user;

          // this.addresses = data[0];
          // this.contacts = data[1];

          // this.patchTheseValuesInForm(this.user);
          // this.addressForm.setControl('addresses', this.formBuilder.array(this.addressBuilder(data[0]) || []));
          // this.contactForm.setControl('contacts', this.formBuilder.array(this.contactBuilder(data[1]) || []));
          // this.tempContactArray = this.contactForm.get('contacts').value;
          return this.staffS.getimages({ directory: this.user.filePhoto })
        })
      ).subscribe(blob => {

        if (blob.isValid) {
          this.showAvatar = false;
          let dataURL = 'data:image/png;base64,' + blob.image;

          this.imgSrc = this.ds.bypassSecurityTrustUrl(dataURL);
          this.src = dataURL;
        } else {
          this.showAvatar = true;
          this.src = null;
        }

        this.cd.markForCheck();
        this.cd.detectChanges();
      });

    }

  }

  addressBuilder(data: Array<any>): Array<any> {
    data.forEach(e => {
      e.description = new RemoveFirstLast().transform(e.description).trim()
    });
    return data;
  }

  contactBuilder(data: Array<any>): Array<any>{
    data.forEach(e => {
      e.type = new RemoveFirstLast().transform(e.type).trim()
    });
    return data;
  }

  getUserData(code: any) {
    return forkJoin([
      this.clientS.getaddress(code),
      this.clientS.getcontacts(code),
      this.timeS.getcasestaff(code)
    ]);
  }

  cancel(v: number): void {

  }

  confirm(view: number, data: any): void {

    if (view == 1) {
      this.clientS.deleteaddress({
        RecordNumber: data.recordNumber,
        PersonID: data.personID
      }).subscribe(data => {
        if (data.success) {
          this.globalS.sToast('Success', 'Address deleted')
          this.pathForm(this.innerValue);
        }
      })
    }

    if (view == 2) {
      this.clientS.deletecontact({
        RecordNumber: data.recordNumber,
        PersonID: data.personID
      }).subscribe(data => {
        if (data.success) {
          this.globalS.sToast('Success', 'Contact deleted')
          this.pathForm(this.innerValue);
        }
      })
    }

  }

  tabChange(index: number) {
    
    if (index == 0) {
      this.contactIssueGroup.patchValue({
        value: this.user.contactIssues
      })
    }

    if (index == 1) {
      console.log(this.user)
      this.contactIssueGroup.patchValue({
        value: this.user.notes
      })
    }

    if (index == 2) {
      this.contactIssueGroup.patchValue({
        value: this.user.specialConsiderations
      })
    }
  }

  handleCancel(): void {
    
    this.addressForm.reset();
    this.editModalOpen = false;
    this.profileStaffModal = false;
    this.profileStaffOptionsModal = false;
    this.profileStaffPreferredModal = false;
    this.profileRecipientOptionsModal = false;
    this.changeProfilePictureModal = false;
  }

  formatDate(data: any): string {
    let year = data.get('year').value;
    let month = this.months.indexOf(data.get('month').value) + 1;
    let day = data.get('day').value;

    if (year == null || day == null || month == 0)
      return null;

    return year + '/' + month + '/' + day + ' ' + '00' + ':' + '00' + ':' + '00';
  }

  formatContact(contactForm: FormGroup): Array<Dto.PhoneFaxOther> {
    let temp: Array<Dto.PhoneFaxOther> = [];

    const { id, type, details, personId } = contactForm.value;

    let pf: Dto.PhoneFaxOther = {
      RecordNumber: id,
      Type: type,
      Detail: details,
      PersonID: personId
    }

    temp.push(pf);
    return temp;
  }

  convertRatingToString(rating: number): string {
    if (!rating) rating = 0;
    var ratingStr = "";
    for (var a = 0; a < rating; a++){
      ratingStr += '*';
    }
    return ratingStr;
  }

  saveNotes() {
    const notes = this.userForm.value;
    // console.log(notes);
    let staff: Dto.Staffs = {
      accountNo: this.user.accountNo,
      uniqueID: this.user.uniqueID,
      caldStatus: notes.caldStatus,
      cstda_Indiginous: notes.indigStatus,
      cstda_DisabilityGroup: notes.primaryDisability,
      contactIssues: notes.note
    }

    this.subscriptionArray.push(this.staffS.updatedisabilitystatus(staff));
    this.processSubscriptions();
  }

  saveProfile() {

    if (this.userForm.dirty) {
      let data = this.userForm.value;
      let birthdate = this.formatDate(this.userForm);

      if (this.innerValue.view == 'staff') {
        let user: Dto.Staffs = {
          accountNo: this.innerValue.name,
          firstName: data.firstName,
          middleNames: data.middleNames,
          lastName: data.surnameOrg,
          gender: data.gender,
          title: data.title,
          dob: birthdate,

          rating: this.convertRatingToString(data.rating),
          pan_Manager: data.casemanager,
          category: data.type,
          stf_Department: data.stf_Department,
          staffGroup: data.jobCategory,
          subCategory: data.adminCategory,
          staffTeam: data.team,
          serviceRegion: data.serviceRegion,
          ubdMap: data.gridNo,
          dLicence: data.dLicense,
          vRegistration: data.mvReg,
          nRegistration: data.nReg,
          caseManager: data.isCaseLoad,
          isRosterable: data.isRosterable,
          emailTimesheet: data.isEmail,

          preferredName: data.preferredName
        }
        
        this.subscriptionArray.push(this.staffS.updateusername(user));
      }

      if (this.innerValue.view == 'recipient') {
        let user: Dto.Recipients = {
          accountNo: this.innerValue.name,
          firstName: data.firstName,
          middleNames: data.middleNames,
          surnameOrg: data.surnameOrg,
          gender: data.gender,
          title: data.title,
          dateOfBirth: birthdate,

          recipient_Coordinator: data.casemanager,
          agencyIdReportingCode: data.file1,
          urNumber: data.file2,
          branch: data.branch,
          agencyDefinedGroup: data.serviceRegion,
          ubdMap: data.subCategory

        }

        this.subscriptionArray.push(this.clientS.updateusername(user));
      }

      this.processSubscriptions();
    }
  }

  formatAddress(addressForm: FormGroup): Array<Dto.NamesAndAddresses> {
    const { pcodesuburb, address, description, id, personId } = addressForm.value;

    let pcode = /(\d+)/g.test(pcodesuburb) ? pcodesuburb.match(/(\d+)/g)[0].trim() : "";
    let suburb = /(\D+)/g.test(pcodesuburb) ? pcodesuburb.match(/(\D+)/g)[0].trim() : ""
    let state = suburb && suburb.split(',').length > 1 ? suburb.split(',')[1].trim() : '';

    let temp: Array<Dto.NamesAndAddresses> = [];

    let na: Dto.NamesAndAddresses = {
      Suburb: suburb && suburb.split(',').length > 0 ? suburb.split(',')[0] : suburb,
      PostCode: pcode,
      Stat: state,
      Description: description,
      Address1: address,
      RecordNumber: id,
      PersonID: personId
    }

    temp.push(na);
    return temp;
  }

  editProfile(): void {
    let data = this.userForm.value;
    let birthdate = this.formatDate(this.userForm);

    if (this.innerValue.view == 'staff') {
      let user: Dto.Staffs = {
        accountNo: this.innerValue.name,
        firstName: data.firstName,
        middleNames: data.middleNames,
        lastName: data.surnameOrg,
        gender: data.gender,
        title: data.title,
        dob: birthdate,

        rating: data.rating,
        pan_Manager: data.casemanager,
        category: data.type,
        stf_Department: data.stf_Department,
        staffGroup: data.jobCategory,
        subCategory: data.adminCategory,
        staffTeam: data.team,
        serviceRegion: data.serviceRegion,
        ubdMap: data.gridNo,
        dLicence: data.dLicense,
        vRegistration: data.mvReg,
        nRegistration: data.nReg,
        caseManager: data.isCaseLoad,
        isRosterable: data.isRosterable,
        emailTimesheet: data.isEmail,

        preferredName: data.preferredName
      }
      this.subscriptionArray.push(this.staffS.updateusername(user));
    }

    if (this.innerValue.view == 'recipient') {
      let user: Dto.Recipients = {
        accountNo: this.innerValue.name,
        firstName: data.firstName,
        middleNames: data.middleNames,
        surnameOrg: data.surnameOrg,
        gender: data.gender,
        title: data.title,
        dateOfBirth: birthdate,

        recipient_Coordinator: data.casemanager,
        agencyIdReportingCode: data.file1,
        urNumber: data.file2,
        branch: data.branch,
        agencyDefinedGroup: data.serviceRegion,
        ubdMap: data.subCategory

      }
      this.subscriptionArray.push(this.clientS.updateusername(user));
    }
    this.processSubscriptions();
  }

  processSubscriptions() {
    this.loading = true;
    forkJoin(this.subscriptionArray).subscribe(
      data => {
        this.subscriptionArray = [];
        this.globalS.sToast('Success', 'Profile Updated!');
        this.pathForm(this.innerValue);

        this.closeDrawer();
        // let result = data.filter(x => x.success == false);
        // if (result.length > 0)
        //     this.resultToast.fail = true;
        // else {
        //     this.showAlert();
        //     this.pathForm();
        // }

        // this.resetForms();
      }, err => {

      }, () => {

        this.loading = false;
      }
    )
  }



  edit(): void {

    if (this.window == 1) {
      this.loading = true;
      this.clientS.updateuseraddress(this.formatAddress(this.addressForm))
        .subscribe(data => {
          if (data.success) {
            this.globalS.sToast('Success', 'Address Updated!');
            this.pathForm(this.innerValue);
          }
        }, (err) => {

        }, () => {
          this.loading = false;
          this.editModalOpen = false;
        })
    }

    if (this.window == 2) {
      this.clientS.updateusercontact(this.formatContact(this.contactForm)).subscribe(data => {
        if (data.success) {
          this.globalS.sToast('Success', 'Contact Updated!');
          this.pathForm(this.innerValue);
        }
      }, (err) => {

      }, () => {
        this.loading = false;
        this.editModalOpen = false;
      });
    }

  }

  editProfileOpen() {
    this.editProfileDrawer = true;
  }

  addAddressOpen() {
    this.addAddressDrawer = true;
    this.addressForm.reset();
    this.POPULATE_ADDRESS();
  }

  addContactOpen() {
    this.addContactDrawer = true;
    this.contactForm.reset();
    this.POPULATE_CONTACTS();
  }

  addContact() {
    for (const i in this.contactForm.controls) {
      this.contactForm.controls[i].markAsDirty();
      this.contactForm.controls[i].updateValueAndValidity();
    }

    if (!this.contactForm.valid)
      return;

    this.contactForm.patchValue({
      personId: this.user.uniqueID,
      id: -1
    });


    //console.log(this.contactForm.value);

    this.subscriptionArray.push(this.clientS.addcontact(this.formatContact(this.contactForm)));
    this.processSubscriptions();
  }

  addAddress(): void {

    for (const i in this.addressForm.controls) {
      this.addressForm.controls[i].markAsDirty();
      this.addressForm.controls[i].updateValueAndValidity();
    }

    if (!this.addressForm.valid)
      return;

    this.addressForm.patchValue({
      personId: this.user.uniqueID,
      id: -1
    });

    this.subscriptionArray.push(this.clientS.addaddress(this.formatAddress(this.addressForm)));
    this.processSubscriptions();

  }

  editAddressOpen(address: any): void {

    this.editModalOpen = true;
    this.window = 1;
    this.addressForm.reset();

    this.addressForm.patchValue({
      id: address.recordNumber,
      description: address.description,
      address: address.address1,
      pcodesuburb: `${address.postCode} ${address.suburb ? address.suburb.trim() : ''} ${address.stat ? `, ${address.stat}` : ''}`,
      personId: address.personID
    });

    this.POPULATE_ADDRESS();
  }

  editContactOpen(contact: any): void {
    this.editModalOpen = true;
    this.window = 2;

    this.contactForm.patchValue({
      id: contact.recordNumber,
      type: contact.type,
      details: contact.detail,
      personId: contact.personID,

    });

    this.POPULATE_CONTACTS();
  }

  POPULATE_ADDRESS(): void {
    this.clientS.getaddresstype()
      .subscribe(data => {
        this.addressArray = data.map(x => {
          return (new RemoveFirstLast().transform(x.description)).trim().toUpperCase();
        });
      })
  }

  POPULATE_CONTACTS(): void {
    this.clientS.getcontacttype().subscribe(data => {
      this.contactsArray = data.map(x => {
        return (new RemoveFirstLast().transform(x.description)).trim().toUpperCase();
      });
    })
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null && !_.isEqual(value, this.innerValue)) {
      this.innerValue = value;
      this.pathForm(this.innerValue);
      // this.tab = 1;
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

  POPULATE_OTHER_DROPDOWNS() {
    forkJoin([
      this.listS.getlistbranches(),
      this.listS.getliststaffgroup(),
      this.listS.getliststaffadmin(),
      this.listS.getliststaffteam(),
      this.listS.getlistcasemanagers(),
      this.listS.getserviceregion(),
      this.listS.getlistdisabilities(),
      this.listS.getlistindigstatus()
    ]).subscribe(data=> {
      this.dropDowns = {
        branchesArr: data[0],
        jobCategoryArr: data[1],
        adminCategoryArr: data[2],
        teamArr: data[3],
        managerArr: data[4],
        serviceRegionArr: data[5],
        disabilitiesArr: data[6],
        indigenousArr: data[7]
      }
    });

  }

  POPULATE_DATE_DROPDOWNS() {
    this.months = months;
    this.years = this.globalS.year();
    this.days = days;

    forkJoin([
      this.clientS.getmanagers(),
      this.listS.getlistcasemanagers()
    ]).subscribe(data => {
      this.casemanagers = data[0];
    });
  }

  closeDrawer() {
    this.editProfileDrawer = false;
    this.addAddressDrawer = false;
    this.addContactDrawer = false;
  }

  messageFinal: any;

  sendMail() {
    for (const i in this.emailCoordinatorGroup.controls) {
      this.emailCoordinatorGroup.controls[i].markAsDirty();
      this.emailCoordinatorGroup.controls[i].updateValueAndValidity();
    }

    if (!this.emailCoordinatorGroup.valid)
      return;
    
    console.log(this.user);
    const { title, firstName, surnameOrg, accountNo } = this.user;
    const { subject, content } = this.emailCoordinatorGroup.value;
    const { detail, description } = this.caseManagerDetails;

    const emailData = {
        Subject: subject,
        Content: content,
        RecipientName: `${title} ${firstName} ${surnameOrg}(${accountNo})`,
        CCAddresses: [],
        FromAddresses: [],
        ToAddresses: [{
            Name: description,
            Address: detail
        }]
    }
    this.message
      .loading('Processing', { nzDuration: 2000 })      
      .onClose!.pipe(       
        switchMap(() => {
          this.messageFinal = this.message.loading('Sending Email', { nzDuration: 0 }).messageId;
          return this.clientS.postemailcoordinator(emailData)
        }),
        concatMap((x) => {
          this.message.remove(this.messageFinal);
          this.emailManagerOpen = false;
          if(x) {
            return this.message.success('Email Sent', { nzDuration: 1000 }).onClose!
          } else {
            return this.message.error('An error occured!').onClose!
          }
        })
      )
      .subscribe(() => {
        
      });
    
  }

  saveTab() {
    const { sqlId } = this.user;

    if (this.tabIndex == 0) {

      this.timeS.updatealertsissues({
        sqlId: sqlId,
        issueType: 'ci',
        notes: this.contactIssueGroup.value.value
      }).subscribe(data => {
        this.globalS.sToast('Success', 'Contact Issues Updated');
      });
      this.contactIssueGroup.markAsPristine();

    }

    if (this.tabIndex == 1) {
      this.timeS.updatealertsissues({
        sqlId: sqlId,
        issueType: 'roa',
        notes: this.contactIssueGroup.value.value
      }).subscribe(data => {
        this.globalS.sToast('Success', 'Roster Alert Updated');        
      })
      this.contactIssueGroup.markAsPristine();
    }

    if (this.tabIndex == 2) {
      this.timeS.updatealertsissues({
        sqlId: sqlId,
        issueType: 'rua',
        notes: this.contactIssueGroup.value.value
      }).subscribe(data => {
        this.globalS.sToast('Success', 'Runoff Alert Updated');
      });
      this.contactIssueGroup.markAsPristine();
    }

  }

  changeProfilePicture() {
    this.changeProfilePictureModal = true;
  }

  errorUrl(event: any) {
    this.imgSrc = '';
    this.showAvatar = true;
  }

  src: any;
  uploadChange(e: Event | any) {
    e.preventDefault();
    var fileLen = e.target.files.length;
    var file = e.target.files;

    if (fileLen == 0) {
      this.globalS.wToast('Warning', 'Select a picture');
      return;
    }

    if (fileLen > 1) {
      this.globalS.wToast('Warning', 'File limit exceeded');
      return;
    }

    this.src = file[0];
  }

}
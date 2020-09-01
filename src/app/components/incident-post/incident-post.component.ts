import { Component, OnInit, Input, SimpleChanges,forwardRef, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService, StaffService, view } from '@services/index';
import { mergeMap, takeUntil, concatMap, switchMap, map } from 'rxjs/operators';
import { forkJoin, Observable, EMPTY, Subject } from 'rxjs';
import parseISO from 'date-fns/parseISO'

import { NzModalService } from 'ng-zorro-antd/modal';
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
export class IncidentPostComponent implements OnInit, OnChanges, ControlValueAccessor {
  private unsubscribe: Subject<void> = new Subject();

  @Input() open: boolean = false;
  @Input() operation: any;

  dateFormat: string = 'dd/MM/yyyy';

  incidentForm: FormGroup;
  current: number = 0;

  incidentTypeList: Array<any> = [];

  listPrograms: Array<string> = [];
  listServiceTypes: Array<string> = [];
  listIncidentTypes: Array<string> = [];

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  innerValue: Dto.User | any;
  user:any;

  listStaff: Array<any> = []
  listNewPeople: Array<Dto.NewRelationShip> = [];

  selectedStaff: Array<any> = [];

  indeterminate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private listS: ListService,
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private modal: NzModalService
  ) { 


  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.openModal();
      }
      if (property == 'operation' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.operation = changes[property].currentValue;
        if(this.operation.process == 'UPDATE') this.current = 1;
        if(this.operation.process == 'ADD') this.current = 0;
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
        program: '',

        // Staff
        commentsStaff: '',

        step4: '',
        step51: '',
        step52: '',
        step53: '',
        step54: '',
        step61: '',
        step7:'',
        
        // Office Use
        officeUse1: false,
        officeUse2: false,
        officeUse3: false,
        officeUse4: false,
        officeUse5: false,
        officeUse6: false,
        officeUse7: false,
        officeUse8: false,
        officeUse9: false,

        reportEnter:'',
        communityService: '',
        regionalComm:'',
        comments: '',

        // Step 6-7
        strat61: false,
        strat62: false,
        strat63: false,
        strat64: false,
        strat65: false,
        strat66: false,
        strat67: false,
        strat68: false,
        strat69: false,

      

        // Incident Checkboxes
        incident1: false,
        incident2: false,
        incident3: false,
        incident4: false,
        incident5: false,
        incident6: false,
        incident7: false,
        incident8: false,
        incident9: false,
        incident10: false,
        incident11: false,
        incident12: false,
        incident13: false,
        incident14: false,
        incident15: false,
        incident16: false,
        incident17: false,
        incident18: false,
        incident19: false,
        incident20: false,
        incident21: false,
        incident22: false,
        other: '',
        summary: '',
        description: '',

        //
        accountNo: '',
        subjectName: '',
        dob: '',
        primaryAddress: '',
        primaryPhone: '',
        recipient: '',
        reportedBy: '',
        startTimeOfIncident: new Date(),
        endTimeOfIncident: new Date(),
        dateOfIncident: '',
        gender:'',

        //staff
        name: '',
        relationship:''

    });    
  }

  searchStaff(): void {
    this.listStaff = []
    this.timeS.getstaff({
      User: this.globalS.decode().nameid,
      SearchString: ''
    }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.listStaff = data.map(x => {
        return {
          accountNo: x.accountNo,
          checked: false
        }
      });
    });
  }

  clearStaff(){
    this.listStaff.forEach(x => {
      x.checked = false
    });

    this.selectedStaff = [];
  }

  addRelationShip(){
    const { name, relationship } = this.incidentForm.value;
    this.listNewPeople.push({
      name: name.toUpperCase(),
      relationship: relationship.toUpperCase(),
      checked: true
    });

    this.incidentForm.patchValue({
      name: '',
      relationship: ''
    });
  }

  pathForm(token: Dto.ProfileInterface) {

    if (this.globalS.isEmpty(token))
      return;
    
    if (token.view == view.recipient) {
      this.clientS.getprofile(token.name).pipe(
        concatMap(data => {
          this.user = data;

          this.patchTheseValuesInForm(data);
          return this.getUserData(data.uniqueID);
        })
      ).subscribe(data => {
        this.incidentForm.patchValue({
          primaryAddress: this.getPrimaryAddress(data[0]),
          primaryPhone: this.getPrimaryContact(data[1])
        })
      });

      this.searchStaff();
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
        this.incidentForm.patchValue({
          primaryAddress: this.getPrimaryAddress(data[0]),
          primaryPhone: this.getPrimaryContact(data[1])
        })
      });
    }
  }

  patchTheseValuesInForm(user) {

    if (this.innerValue.view === view.recipient) {
      this.incidentForm.patchValue({
        accountNo: user.accountNo,
        gender: this.getGender(user.gender),
        dob: this.getBirthdate(user.dateOfBirth)
      });
    }

    if (this.innerValue.view === view.staff) {

      this.incidentForm.patchValue({
        accountNo: user.accountNo,

        subjectName: `${user.firstName} ${user.lastName}`,
        dob: user.dob ? new Date(user.dob) : null
      });

    }
  }

  getUserData(code: any) {
    return forkJoin([
      this.clientS.getaddress(code),
      this.clientS.getcontacts(code),
      // this.timeS.getcasestaff(code)
    ]);
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

  buildValueChanges(){

    this.listS.getwizardnote('INCIDENT TYPE').subscribe(data =>{
        this.listIncidentTypes = data;
    });


    if(this.innerValue.view == 'recipient'){

      this.listS.getprogramsincident(this.innerValue.id).subscribe(data =>{
        this.listPrograms = data
      });

      this.incidentForm.get('program').valueChanges.pipe(
        switchMap(program => {
          this.clearServiceType();
          return this.listS.getservicetypeincident({
            id: this.innerValue.id,
            program: program
          })
        })
      ).subscribe(data => this.listServiceTypes = data);
    }


    if(this.innerValue.view === 'staff'){
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
    this.current = 0;
  }

  updateStaffListing(staff: Array<any>){
    if(staff.length == 0 )return;
    var _staff =staff.map(x => x.staff);

    this.listStaff.forEach(x => {
      if(_staff.includes(x.accountNo)){
        x.checked = true;
      }
    })
  }

  updateNewRelationShip(staff: Array<any>){
    if(staff.length == 0 )return;
    this.listNewPeople = staff.map(x => {
      return {
        name: x.othersInvolved.toUpperCase(),
        relationship: x.relationship.toUpperCase(),
        checked: true
      }
    })
  }

  buildCheckBoxesInStep2(): string{
    var defaultVa: string = '';

    const { 
        incident1,
        incident2,
        incident3,
        incident4,
        incident5,
        incident6,
        incident7,
        incident8,
        incident9,
        incident10,
        incident11,
        incident12,
        incident13,
        incident14,
        incident15,
        incident16,
        incident17,
        incident18,
        incident19,
        incident20,
        incident21,
        incident22,
    } = this.incidentForm.value;
    
    defaultVa = defaultVa.concat(this.trueString(incident1));
    defaultVa = defaultVa.concat(this.trueString(incident2));
    defaultVa = defaultVa.concat(this.trueString(incident3));
    defaultVa = defaultVa.concat(this.trueString(incident4));
    defaultVa = defaultVa.concat(this.trueString(incident5));
    defaultVa = defaultVa.concat(this.trueString(incident6));
    defaultVa = defaultVa.concat(this.trueString(incident7));
    defaultVa = defaultVa.concat(this.trueString(incident8));
    defaultVa = defaultVa.concat(this.trueString(incident9));
    defaultVa = defaultVa.concat(this.trueString(incident10));
    defaultVa = defaultVa.concat(this.trueString(incident11));
    defaultVa = defaultVa.concat(this.trueString(incident12));
    defaultVa = defaultVa.concat(this.trueString(incident13));
    defaultVa = defaultVa.concat(this.trueString(incident14));
    defaultVa = defaultVa.concat(this.trueString(incident15));
    defaultVa = defaultVa.concat(this.trueString(incident16));
    defaultVa = defaultVa.concat(this.trueString(incident17));
    defaultVa = defaultVa.concat(this.trueString(incident18));
    defaultVa = defaultVa.concat(this.trueString(incident19));
    defaultVa = defaultVa.concat(this.trueString(incident20));
    defaultVa = defaultVa.concat(this.trueString(incident21));
    defaultVa = defaultVa.concat(this.trueString(incident22));

    return defaultVa;
  }

  updateCheckBoxesInStep2(defaultString: string){
    if(!defaultString) return;

    this.incidentForm.patchValue({
      incident1: this.isChecked(defaultString[0]),
      incident2: this.isChecked(defaultString[1]),
      incident3: this.isChecked(defaultString[2]),
      incident4: this.isChecked(defaultString[3]),
      incident5: this.isChecked(defaultString[4]),
      incident6: this.isChecked(defaultString[5]),
      incident7: this.isChecked(defaultString[6]),
      incident8: this.isChecked(defaultString[7]),
      incident9: this.isChecked(defaultString[8]),
      incident10: this.isChecked(defaultString[9]),
      incident11: this.isChecked(defaultString[10]),
      incident12: this.isChecked(defaultString[11]),
      incident13: this.isChecked(defaultString[12]),
      incident14: this.isChecked(defaultString[13]),
      incident15: this.isChecked(defaultString[14]),
      incident16: this.isChecked(defaultString[15]),
      incident17: this.isChecked(defaultString[16]),
      incident18: this.isChecked(defaultString[17]),
      incident19: this.isChecked(defaultString[18]),
      incident20: this.isChecked(defaultString[19]),
      incident21: this.isChecked(defaultString[20]),
      incident22: this.isChecked(defaultString[21]),
    })
  }

  buildCheckBoxesInStep6(){
    var defaultVa: string = '';

    const { 
      strat61, 
      strat62, 
      strat63, 
      strat64, 
      strat65, 
      strat66, 
      strat67, 
      strat68, 
      strat69 
    } = this.incidentForm.value;
    
    defaultVa = defaultVa.concat(this.trueString(strat61));
    defaultVa = defaultVa.concat(this.trueString(strat62));
    defaultVa = defaultVa.concat(this.trueString(strat63));
    defaultVa = defaultVa.concat(this.trueString(strat64));
    defaultVa = defaultVa.concat(this.trueString(strat65));
    defaultVa = defaultVa.concat(this.trueString(strat66));
    defaultVa = defaultVa.concat(this.trueString(strat67));
    defaultVa = defaultVa.concat(this.trueString(strat68));
    defaultVa = defaultVa.concat(this.trueString(strat69));

    return defaultVa;    
  }

  updateCheckBoxesInStep6(defaultString: string){
    if(!defaultString) return;
    this.incidentForm.patchValue({
      strat61: this.isChecked(defaultString[0]),
      strat62: this.isChecked(defaultString[1]),
      strat63: this.isChecked(defaultString[2]),
      strat64: this.isChecked(defaultString[3]),
      strat65: this.isChecked(defaultString[4]),
      strat66: this.isChecked(defaultString[5]),
      strat67: this.isChecked(defaultString[6]),
      strat68: this.isChecked(defaultString[7]),
      strat69: this.isChecked(defaultString[8]),
    })
  }

  buildCheckBoxesInOfficeUse(){
    var defaultVa: string = '';

    const { 
      officeUse1,
      officeUse2,
      officeUse3,
      officeUse4,
      officeUse5,
      officeUse6,
      officeUse7,
      officeUse8,
      officeUse9     
    } = this.incidentForm.value;
    
    defaultVa = defaultVa.concat(this.trueString(officeUse1));
    defaultVa = defaultVa.concat(this.trueString(officeUse2));
    defaultVa = defaultVa.concat(this.trueString(officeUse3));
    defaultVa = defaultVa.concat(this.trueString(officeUse4));
    defaultVa = defaultVa.concat(this.trueString(officeUse5));
    defaultVa = defaultVa.concat(this.trueString(officeUse6));
    defaultVa = defaultVa.concat(this.trueString(officeUse7));
    defaultVa = defaultVa.concat(this.trueString(officeUse8));
    defaultVa = defaultVa.concat(this.trueString(officeUse9));

    return defaultVa;    
  }

  updateCheckBoxesInOfficeUse(defaultString: string){
    if(!defaultString) return;
    this.incidentForm.patchValue({
      officeUse1: this.isChecked(defaultString[0]),
      officeUse2: this.isChecked(defaultString[1]),
      officeUse3: this.isChecked(defaultString[2]),
      officeUse4: this.isChecked(defaultString[3]),
      officeUse5: this.isChecked(defaultString[4]),
      officeUse6: this.isChecked(defaultString[5]),
      officeUse7: this.isChecked(defaultString[6]),
      officeUse8: this.isChecked(defaultString[7]),
      officeUse9: this.isChecked(defaultString[8])
    })
  }

  trueString(data: any): string{
    return data ? '1': '0';
  }

  isChecked(data: string): boolean{
    return '1' == data ? true : false;
  }

  save(){

    var { incidentType, serviceType,
          step4, step51, step52, step53, step54,
          step61, step7, reportEnter, communityService, regionalComm, comments,
          other, summary, description,
          accountNo, dateOfIncident  } = 
    this.incidentForm.value;

    var { 
      accountNo,
      primaryPhone
    } = this.user;

    var im_master: Dto.IM_Master = {
          PersonId: this.innerValue.id,
          Type: incidentType,
          Service: serviceType,
          Date: dateOfIncident,

          Location: step4,
          ReportedBy: '',
          CurrentAssignee: '',
          ShortDesc: summary,
          FullDesc: description,
          Triggers: step53,
          InitialNotes: step54,

          OngoingNotes: '',
          Notes: comments,
          Setting: '',
          Status: '',
          Region: communityService,
          Phone: primaryPhone,
          Verbal_Date: new Date(),
          By_Whome: reportEnter,
          ReleventBackground: step52,
          SummaryofAction: step61,
          SummaryOfOtherAction: step7,
          SubjectName: accountNo,
          SubjectGender: '',
          ResidenceSubjectOther: '',
          TypeOther: this.buildCheckBoxesInStep2(),
          Manager: regionalComm,
          
          IncidentTypeOther: other,
          Mobile: '',
          OfficeUse: this.buildCheckBoxesInOfficeUse(),
          FollowupContacted: this.buildCheckBoxesInStep6(),
          FollowupContactedOther: '',
          SubjectMood: step51,

          Staff: this.selectedStaff,
          NewRelationship: this.listNewPeople
    };

    console.log(this.selectedStaff);
    console.log(this.user);

    this.timeS.postincident(im_master).subscribe(data => {
      this.globalS.sToast('Success', 'Data saved');
    });
  }

  getBirthdate(bday: string): Date{
    var _bday = parseISO(bday);
    if(_bday.toString() === 'Invalid Date')  return null;
    return parseISO(bday);
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

  patchUpdateValues(data: any){
    console.log(data);
    this.incidentForm.patchValue({
      summary: data.shortDesc,
      description: data.fullDesc,

      step4: data.location,
      step51: data.subjectMood,
      step52: data.releventBackground,
      step53: data.triggers,
      step54: data.initialNotes,

      step61: data.summaryofAction,
      step7: data.summaryOfOtherAction,

      reportEnter: data.by_Whome,
      communityService: data.region,
      regionalComm: data.manager,
      comments: data.notes,

     
    });

    this.updateCheckBoxesInStep2(data.typeOther);
    this.updateCheckBoxesInOfficeUse(data.officeUse);
    this.updateCheckBoxesInStep6(data.followupContacted);
    this.updateStaffListing(data.staff);
    this.updateNewRelationShip(data.newRelationship);
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null) {
      this.innerValue = value;
      console.log(this.innerValue);

      this.buildValueChanges();
      this.pathForm(this.transform(value));

      if(value.operation == 'UPDATE'){
         this.timeS.getspecificincidentdetails(value.recordNo).subscribe(data => this.patchUpdateValues(data));
      }
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

  log(event: any) {
    this.selectedStaff = event;
    console.log(this.selectedStaff);
  }
 
  get nextRequired() {
    const { incidentType, serviceType, program } = this.incidentForm.value;
    
    if (this.current == 0 && (this.globalS.isEmpty(incidentType) || this.globalS.isEmpty(program) || this.globalS.isEmpty(serviceType))) {
      return false;
    }

    return true;
  }

}

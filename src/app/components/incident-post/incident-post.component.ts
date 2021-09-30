import { Component, OnInit, Input, SimpleChanges,forwardRef, OnChanges, Output, EventEmitter, ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService, StaffService, view } from '@services/index';
import { mergeMap, takeUntil, concatMap, switchMap, map } from 'rxjs/operators';
import { forkJoin, Observable, EMPTY, Subject } from 'rxjs';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import lastDayOfMonth from 'date-fns/lastDayOfMonth'
import startOfMonth from 'date-fns/startOfMonth'
import * as moment from 'moment';
import { User, NewRelationShip, ProfileInterface, IM_Master } from '@modules/modules';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

const noop = () => {
};

interface Process {
  process: Mode
}

interface Note{
  creator: string,
  detail: string,
  alarmDate?: Date | string,
  detailDate?: Date | string,
  personID: string,
  recordNumber: number,
  restrictions: string,
  whoCode: string,

  program: string,
  discipline: string,
  careDomain: string,
  publishToApp: boolean,
  privateFlag: boolean,
  extraDetail2: string
}


enum Mode{
  UPDATE = "UPDATE",
  ADD = "ADD"
}

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
  @Input() operation: Process;

  @Output() reload = new EventEmitter();

  dateFormat: string = 'dd/MM/yyyy';

  incidentForm: FormGroup;
  noteFormGroup: FormGroup;

  incidentDocument: any;

  current: number = 0;
  addEdit: number = 0;
  incidentTypeList: Array<any> = [];

  listPrograms: Array<string> = [];
  listServiceTypes: Array<string> = [];
  listIncidentTypes: Array<string> = [];

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  innerValue: User | any;
  user:any;

  listStaff: Array<any> = []
  listNewPeople: Array<NewRelationShip> = [];

  selectedStaff: Array<any> = [];

  indeterminate: boolean = false;
  modalOpen: boolean = false;

  incidentNotifications: Array<any>;
  incidentmandatoryNotifications : Array<any>;
  incidentnonmandatoryNotifications : Array<any>;
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  alist: Array<any> = [];
  blist: Array<any> = [];
  clist: Array<any> = [];
  dlist: Array<any> = [];
  mlist: Array<any> = [];
  recipientStrArr: Array<any> = [];
  statuseffect :string;
  tocken:any
  
  private default = {
    notes: '',
    publishToApp: false,
    restrictions: '',
    restrictionsStr: 'public',
    alarmDate: null,
    whocode: '',
    program: '*VARIOUS',
    discipline: '*VARIOUS',
    careDomain: '*VARIOUS',
    category: null,
    recordNumber: null,
    personID: ''
}
  tryDoctype: any;
  pdfTitle: string;
  drawerVisible: boolean;
  loadingPDF: boolean;
  noteSearchForm: FormGroup;
  reportModal: boolean;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private listS: ListService,
    private globalS: GlobalService,
    private clientS: ClientService,
    private staffS: StaffService,
    private timeS: TimeSheetService,
    private modal: NzModalService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private ModalS: NzModalService,
  ) { 

  }
  
  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.openModal();
        this.buildForm();
        this.buildValueChanges();
        this.pathForm(this.transform());
      }
      if (property == 'operation' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.operation = changes[property].currentValue;
        if(this.operation.process == 'UPDATE'){
          this.current = 0;
          this.addEdit = 1;
        }
        if(this.operation.process == 'ADD'){
          this.current = 0;
          this.addEdit = 0;
        }
      }
    }
  }

  ngOnInit(): void {    
    this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
    this.buildForm();
    this.cd.detectChanges();
  }
  detectChanges(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
  buildForm() {
    
    this.incidentForm = this.fb.group({
        recordNo: '',
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
        officeUse1: true,
        officeUse2: false,
        officeUse3: false,
        officeUse4: false,
        officeUse5: false,
        officeUse6: false,
        officeUse7: false ,
        officeUse8: false,
        officeUse9: false,

        reportEnter:this.tocken.user,
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
        otherspecify: '',
        summary: '',
        description: '',


        accountNo: '',
        subjectName: '',
        dob: '',
        primaryAddress: '',
        primaryPhone: '',
        recipient: '',
        reportedBy: '',
        startTimeOfIncident: null,
        endTimeOfIncident: null,
        dateOfIncident: '',
        gender:'',
        organisation: '',
        //SubjectType : '',

        //staff
        name: '',
        relationship:'',

        incidentNotes: this.fb.array([])

    });

    this.noteFormGroup = this.fb.group(this.default);

    this.noteSearchForm = this.fb.group({
      'start_date' : startOfMonth(new Date()),
      'end_date'   : lastDayOfMonth(new Date()),
      'personId'   : ''
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
      staff: name.toUpperCase(),
      relationship: relationship.toUpperCase(),
      checked: true
    });

    this.incidentForm.patchValue({
      name: '',
      relationship: ''
    });
  }

  addNote(data: Note = null){
    var note = this.incidentForm.get('incidentNotes') as FormArray;
    
    if(data){
      note.push(this.pushNoteInformation(data));
    }
  }

  pushNoteInformation(field: Note): FormGroup {
    return this.fb.group({
      creator: new FormControl(field.creator),
      detail: new FormControl(field.detail),
      alarmDate: new FormControl(field.alarmDate),
      detailDate: new FormControl(field.detailDate),
      personID: new FormControl(field.personID),
      recordNumber: new FormControl(field.recordNumber),
      restrictions: new FormControl(field.restrictions),
      whoCode: new FormControl(field.whoCode),

      program: new FormControl(field.program),
      discipline: new FormControl(field.discipline),
      careDomain: new FormControl(field.careDomain),
      publishToApp: new FormControl(field.publishToApp),
      privateFlag: new FormControl(field.privateFlag),
      extraDetail2: new FormControl(field.extraDetail2)
    });
  }

  pathForm(token: ProfileInterface) {

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

      this.searchStaff();
    }
  }

  patchTheseValuesInForm(user) {

    if (this.innerValue.view === view.recipient) {
      this.incidentForm.patchValue({
        accountNo: user.accountNo,
        gender: this.getGender(user.gender),
        dob: this.getBirthdate(user.dateOfBirth),
        
        
      });
    }

    if (this.innerValue.view === view.staff) {

      this.incidentForm.patchValue({
        accountNo: user.accountNo,
        gender: this.getGender(user.gender),
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

  this.getSelect();

  // this.timeS.GetIncidentNotifications().subscribe(data => {
  //    this.incidentNotifications = data.map(x =>{
  //       var o = Object.assign({}, x);
  //       o.checked = true;
  //       return o;
  //   });
  // }); 
  
  this.timeS.Getincidentmandatorynotifications().subscribe(data => this.incidentmandatoryNotifications = data);
  
  this.timeS.Getincidentnonmandatorynotifications().subscribe(data => this.incidentnonmandatoryNotifications = data);
    
    this.listS.getwizardnote('INCIDENT TYPE').subscribe(data =>{
        this.listIncidentTypes = data;
    });


    if(this.innerValue.view == 'recipient'){
      
      this.listS.getprogramsincident(this.innerValue.id).subscribe(data =>{
        this.listPrograms = data;
      });

      this.incidentForm.get('program').valueChanges.pipe(
        switchMap(program => {
          this.clearServiceType();
          if(this.globalS.isEmpty(program) || this.globalS.isEmpty(this.innerValue.id)){
            return EMPTY;
          }
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

    this.listNewPeople = [];
    this.selectedStaff = []
  }

  handleNoteCancel(){
    this.modalOpen = false;
    this.noteFormGroup.reset(this.default);
  }
  handleReportCancel(){
    this.reportModal = false;
    this.noteSearchForm.reset({
      'start_date' : startOfMonth(new Date()),
      'end_date'   : lastDayOfMonth(new Date()),
      'personId'   : ''
    });
  }

  updateStaffListing(staff: Array<any>){
    if(staff.length == 0 )return;
    var _staff = staff.map(x => x.staff);

    this.listStaff.forEach(x => {
      if(_staff.includes(x.accountNo)){
        x.checked = true;
      }
    });

    this.selectedStaff = staff.map(x => x.staff);
  }

  showNoteModal(){
    this.modalOpen = true;
  }
  showPrintModal(){
    this.reportModal = true;
    this.noteSearchForm.patchValue({
      'personId' : this.incidentForm.value.recordNo,
    })
    console.log(this.incidentForm.value.recordNo);
  }

  updateNewRelationShip(staff: Array<any>){
    if(staff.length == 0 )return;
    this.listNewPeople = staff.map(x => {
      return {
        staff: x.othersInvolved.toUpperCase(),
        relationship: x.relationship.toUpperCase(),
        checked: true
      }
    })
  }

  deleteListNewPeople(index: number){
    this.listNewPeople.splice(index, 1);
  }

buildCheckBoxesInStep1(): string{
  
  var defaultVa: string = '';

    const { 
      organisation,
      } = this.incidentForm.value;
      //defaultVa = this.trueString(organisation);
      defaultVa = organisation;
      
    return defaultVa;

}
updateCheckBoxesInStep1(defaultString: string){ 
  
  if(!defaultString) return;

  this.incidentForm.patchValue({
    //organisation: this.isChecked(defaultString[0])
    organisation: defaultString
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
      //  organisation,
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
    //defaultVa = defaultVa.concat(this.trueString(organisation));

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
      //organisation:this.isChecked(defaultString[22]),
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
  //  console.log(" debug  "+defaultVa)
    return defaultVa;    
  }

  updateCheckBoxesInOfficeUse(defaultString: string){
    var temp;
    if(!defaultString) return;
//&& this.operation.process == 'UPDATE'
    if(this.statuseffect === "CLOSED"  ){
      
     temp  = true
    }
    else{temp = false}

    //console.log("debug")

    this.incidentForm.patchValue({
      //officeUse1: this.isChecked(defaultString[0]),
      officeUse1: this.isChecked('1'), //as we are entering data so it should be true
      officeUse2: this.isChecked(defaultString[1]),
      officeUse3: this.isChecked(defaultString[2]),
      officeUse4: this.isChecked(defaultString[3]),
      officeUse5: this.isChecked(defaultString[4]),
      officeUse6: this.isChecked(defaultString[5]),      
      //officeUse7: this.isChecked(defaultString[6]),
      officeUse7: temp,
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
    var { incidentType, serviceType,program,
          step4, step51, step52, step53, step54,
          step61, step7, reportEnter, communityService, regionalComm, comments,
          other, summary, description,
          accountNo, dateOfIncident, reportedBy,recipient,recordNo,startTimeOfIncident , endTimeOfIncident, commentsStaff, incidentNotes,otherspecify, } = 
      
          this.incidentForm.value;
      if (this.current == 1 && endTimeOfIncident != null && format(startTimeOfIncident, 'HH:mm') > format(endTimeOfIncident, 'HH:mm') ){
        this.modal.error({
          nzTitle: 'TRACCS',
            nzContent: 'End Time of Incident Must be greater than Start Time',
            nzOnOk: () => {
              this.current = 1;
            },
          });
      
    }else{
    var { 
      accountNo,
      primaryPhone
    } = this.user;
    
    
    var im_master: IM_Master = {
          RecordNo: recordNo || 0,
          PersonId: this.innerValue.id,
          Type    : incidentType,
          Service : serviceType,
          Date: dateOfIncident ? format(dateOfIncident,'yyyy-MM-dd HH:mm:ss') : null,
          Time: startTimeOfIncident ? format(startTimeOfIncident,'yyyy-MM-dd HH:mm:ss') : null,
          EstimatedTimeOther: endTimeOfIncident ? format(endTimeOfIncident, 'HH:mm') : null,

          Location: step4,
          ReportedBy: reportedBy,
          CurrentAssignee: recipient,
          ShortDesc: summary,
          FullDesc: description,
          Triggers: step53,
          InitialNotes: step54,

          OngoingNotes: commentsStaff,
          Notes: comments,
          Setting: '',
          Status: 'OPEN',
          Region: communityService,
          Phone: primaryPhone,
          Verbal_Date: new Date(),
          By_Whome: reportEnter,
          ReleventBackground: step52,
          SummaryofAction: step61,
          SummaryOfOtherAction: step7,
          SubjectName: accountNo,
          SubjectGender: '',
          SubjectType: this.buildCheckBoxesInStep1(),
          ResidenceSubjectOther: '',
          TypeOther: this.buildCheckBoxesInStep2(),
          Manager: regionalComm,
          
          IncidentTypeOther: other,          
          Mobile: '',
          OfficeUse: this.buildCheckBoxesInOfficeUse(),
          FollowupContacted: this.buildCheckBoxesInStep6(),
          FollowupContactedOther: otherspecify,
          SubjectMood: step51,
          Staff: this.selectedStaff.length > 0 ? this.selectedStaff.map(x => {
            return {
              IM_MasterId: x.iM_MasterId || 0,
              Staff: x
            }
          }) : [],
          IncidentNotes: incidentNotes,
          NewRelationship: this.listNewPeople
    };
    
    if(this.operation.process === Mode.UPDATE){
      this.timeS.updateincident(im_master).subscribe(data =>{
        this.globalS.sToast('Success', 'Data saved');
        this.reload.emit(true);
        this.open = false;
      })
    }

    if(this.operation.process === Mode.ADD){
    this.timeS.postincident(im_master).subscribe(data => {
        this.globalS.sToast('Success', 'Data saved');
        this.reload.emit(true);
        this.open = false;
    });
    }   
  }
  }
  saveNote(){

    if (!this.globalS.IsFormValid(this.noteFormGroup))
    return;

    const { alarmDate, restrictionsStr, whocode, restrictions } = this.noteFormGroup.value;
    
    const cleanDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(alarmDate);
    
    let privateFlag = restrictionsStr == 'workgroup' ? true : false;
    let restricts = restrictionsStr != 'restrict';

    this.noteFormGroup.controls["restrictionsStr"].setValue(privateFlag);

    this.noteFormGroup.controls["alarmDate"].setValue(cleanDate);
    
    this.noteFormGroup.controls["whocode"].setValue(this.globalS.decode().nameid);
    this.noteFormGroup.controls["restrictions"].setValue(restricts ? '' : this.listStringify());

    const noteValue = this.noteFormGroup.value;
    if(noteValue.alarmDate != null){
      var checknull = format(noteValue.alarmDate,"yyyy-MM-dd'T'HH:mm:ss")
    }else{checknull = ''}

    const note: Note = {
      creator: 'sysmgr',
      detail: noteValue.notes,
      detailDate: format(new Date(),"yyyy-MM-dd'T'HH:mm:ss"),
      alarmDate: checknull,
    //  alarmDate: format(noteValue.alarmDate,"yyyy-MM-dd'T'HH:mm:ss"),
      personID: '',
      recordNumber: 0,
      restrictions: noteValue.restrictions,
      whoCode: noteValue.whocode,

      program: noteValue.program,
      discipline: noteValue.discipline,
      careDomain: noteValue.careDomain,
      publishToApp: noteValue.publishToApp,
      privateFlag: noteValue.restrictionsStr,
      extraDetail2: noteValue.category
    }

    this.addNote(note);
    this.handleNoteCancel();
  }

  getDate(data: any): string{
    if(data == null) return null;

    var _date = format(parseISO(data),"yyyy-MM-dd'T'HH:mm:ss");

    var date = parse(_date,"yyyy-MM-dd'T'HH:mm:ss", new Date());
    if(date.toString() === 'Invalid Date') return '-';
    
    return format(date, 'dd/MM/yyyy');
  }

  getRealDate(data: any): Date | null{
    if(data == null) return null;

    var _date = format(parseISO(data),"yyyy-MM-dd'T'HH:mm:ss");
    return parse(_date,"yyyy-MM-dd'T'HH:mm:ss", new Date());
  }

  getTime(data: any): string | null{
    if(data == null) return null;
    var _date = format(parseISO(data),"yyyy-MM-dd'T'HH:mm:ss");
    var date = parse(_date,"yyyy-MM-dd'T'HH:mm:ss", new Date());
    if(date.toString() === 'Invalid Date') return '-';
    
    return format(date, 'HH:mm');
  }

  listStringify(): string {
      let tempStr = '';
      this.recipientStrArr.forEach((data, index, array) => {
          array.length - 1 != index ?
              tempStr += data.trim() + '|' :
              tempStr += data.trim();
      });
      return tempStr;
  }

  restrictionsLog(event: any) {
      this.recipientStrArr = event;
  }

  getBirthdate(bday: string): Date{
    var _bday = parseISO(bday);
    if(_bday.toString() === 'Invalid Date')  return null;
    return parseISO(bday);
  }

  transform(user: any = this.innerValue) {
      if (!user) return;
      
      return {
          name: user.code,
          view: user.view,
          id: user.id,
          sysmgr: user.sysmgr
      }
  }

  patchUpdateValues(data: any){

    console.log(data)
    
    this.statuseffect = data.status;
    this.updateCheckBoxesInStep1(data.subjectType)
    this.updateCheckBoxesInStep2(data.typeOther);
    this.updateCheckBoxesInOfficeUse(data.officeUse);
    this.updateCheckBoxesInStep6(data.followupContacted);
    this.updateStaffListing(data.staff);
    this.updateNewRelationShip(data.newRelationship);
  
  
    this.incidentForm.patchValue({
      summary: data.shortDesc,
      description: data.fullDesc, 
      recipient:data.currentAssignee,
      other:data.incidentTypeOther,
      otherspecify:  data.followupContactedOther,
      step4: data.location,
      step51: data.subjectMood,
      step52: data.releventBackground,
      step53: data.triggers,
      step54: data.initialNotes,
      serviceType:data.service,
      incidentType:data.type,
      step61: data.summaryofAction,
      step7: data.summaryOfOtherAction,

      reportEnter: data.by_Whome,
      communityService: data.region,
      regionalComm: data.manager,
      comments: data.notes,
      commentsStaff: data.ongoingNotes,
      
      endTimeOfIncident: data.estimatedTimeOther ? parse(data.estimatedTimeOther,'HH:mm', new Date()) : null,
      startTimeOfIncident: this.getRealDate(data.time),
      
      dateOfIncident: this.getRealDate(data.date),
      reportedBy: data.reportedBy,      
      recordNo: data.recordNo,
      //organisation:this.getorganisation(data.subjectType),
      organisation:data.subjectType ,

    });
    
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null) {      
      this.innerValue = value;
      console.log(value);

      if(value.operation == 'UPDATE'){
          
        this.timeS.getincidentnotes(value.recordNo).subscribe(data => {
              data.map(x => {
                if (!this.globalS.IsRTF2TextRequired(x.detailOriginal)) {
                  x.detail = x.detailOriginal
                }              
                this.addNote(x)
              });
          });

          this.incidentDocument = {
            incidentId: this.innerValue.recordNo,
            id: this.innerValue.id
          }

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
    // var  {startTimeOfIncident,endTimeOfIncident} = this.incidentForm.value

     
     
    // if (this.current == 1 && endTimeOfIncident != null ){
    //     //this.compareTimeofincidents();
    //     if (format(startTimeOfIncident, 'HH:mm') > format(endTimeOfIncident, 'HH:mm')){
    //       //  alert("End Time of Incient must be greater then Start time")
    //         this.modal.error({
    //           nzTitle: 'TRACCS',
    //             nzContent: 'End Time of Incident Must be greater than Start Time',
    //             nzOnOk: () => {},
    //           });
    //     }
        
    // }else
        
          this.current += 1;
  }

  log(event: any) {
    this.selectedStaff = event;
  }
 
  get nextRequired() {
    const { incidentType, serviceType, program } = this.incidentForm.value;
    
    if (this.current == 0 && (this.globalS.isEmpty(incidentType) || this.globalS.isEmpty(program) || this.globalS.isEmpty(serviceType))) {
      return false;
    }

    return true;
  }

  getSelect() {
      this.timeS.getmanagerop().subscribe(data => {
          this.mlist = data;
      });

      this.timeS.getdisciplineop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          data.push('*VARIOUS');
          this.blist = data;
      });
      this.timeS.getcaredomainop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          data.push('*VARIOUS');
          this.clist = data;
      });
    //  this.alist = this.listPrograms ;
    
      this.timeS.getprogramop(this.innerValue.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          data.push('*VARIOUS');
          this.alist = data;
      });
    
      this.listS.getcategoryincident().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          this.dlist = data;
      })
  }
  compareTimeofincidents(){
    var  {startTimeOfIncident,endTimeOfIncident} = this.incidentForm.value

   // console.log("compare  "+format(startTimeOfIncident, 'HH:mm') + " ," + format(endTimeOfIncident, 'HH:mm'));
    if (format(startTimeOfIncident, 'HH:mm') > format(endTimeOfIncident, 'HH:mm')){
      //  alert("End Time of Incient must be greater then Start time")
        this.modal.error({
          nzTitle: 'TRACCS',
            nzContent: 'End Time of Incident Must be greater than Start Time',
            nzOnOk: () => {},
          });
    }
    else{this.current = 2}
  }

  handleOkTop() {
    this.generatePdf();
    this.tryDoctype = ""
    this.pdfTitle = ""
 }
  handleCancelTop(): void {
      this.drawerVisible = false;
      this.pdfTitle = ""
  }
  generatePdf(){
        this.drawerVisible = true;
        this.loadingPDF = true;
        var startdate = this.noteSearchForm.value.start_date;
        var enddate   = this.noteSearchForm.value.end_date;
        
        if (startdate != null) { startdate = format(startdate, 'yyyy-MM-dd') } else {
          startdate   = format(new Date(), 'yyyy-MM-dd');
        }
        if (enddate != null) {  enddate = format( enddate, 'yyyy-MM-dd') } else {
            enddate =  format(new Date(), 'yyyy-MM-dd');
        }
        var whereString = '';

        whereString = " AND DetailDate Between '" + startdate + "' and '" + enddate + "'";

        var fQuery = "Select WhoCode as Field1,CONVERT(varchar, [DetailDate],105) as Field2,Detail as Field3,CONVERT(varchar, [AlarmDate],100) as Field4, Creator as Field5 FROM History WHERE PersonID = '"+this.incidentForm.value.recordNo+"' AND ExtraDetail1 = 'RECIMNOTE'  AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND DeletedRecord <> 1 "+whereString+" ORDER BY DetailDate DESC, RecordNumber DESC";
        // console.log(fQuery);
    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    const data = {
        "template": { "_id": "0RYYxAkMCftBE9jc" },
        "options": {
            "reports": { "save": false },
            "txtTitle": "Incident Ongoing Notes",
            "userid": this.tocken.user,
            "sql": fQuery,
            "head1" : "WhoCode",
            "head2" : "DetailDate",
            "head3" : "Detail",
            "head4" : "AlarmDate",
            "head5" : "Creator",
        }
    }
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loadingPDF = false;
        console.log("compiled after data")
        this.cd.detectChanges();
    }, err => {
        console.log(err);
        this.loadingPDF = false;
        this.ModalS.error({
            nzTitle: 'TRACCS',
            nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
            nzOnOk: () => {
                this.drawerVisible = false;
            },
        });
    });
    this.cd.detectChanges();
    this.loadingPDF = true;
    this.tryDoctype = "";
    this.pdfTitle = "";
}
}//

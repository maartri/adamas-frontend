import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, incidentSeverity, incidentTypes, leaveTypes } from '@services/index';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import parseISO from 'date-fns/parseISO';
import * as moment from 'moment';

import { TravelDefaults, ClaimVariation, TravelClaim, RecordIncident } from '@modules/modules';

const defaultOptions: any = {
  notes: '',
  rosterNoteDetails: '',

  startKM: '',
  endKM: '',
  agencyVehicle: false,
  chargeClient: false,
  travelType: true,

  incidentDetails: '',
  incidentType: null,
  incidentSeverity: null,
  incidentLocation: null,
  noRecipient: false
}

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActionComponent implements OnInit {

  @Input() data: any;
  @Input() settings: any;
  @Input() status: number;

  @Output() results = new EventEmitter<any>();

  private unsubscribe: Subject<void> = new Subject();

  visible: boolean = false;
  notesIsOpen: boolean = false;
  claimVariationOpen: boolean = false;
  travelClaimOpen: boolean = false;
  rosterNoteOpen: boolean = false;
  recordIncidentOpen: boolean = false;

  isConfirmLoading: boolean = false;
  timeDuration: string;

  title: string;
  whatNote: number;

  optionForm: FormGroup;
  token: any;

  startTime: Date;
  endTime: Date;

  incidentTypes: Array<string> = incidentTypes;
  incidentSeverity: Array<string> = incidentSeverity;
  leaveTypes: Array<string> = leaveTypes;
  incidentLocation: any;

  travelDefault: TravelDefaults;

  constructor(
    private formBuilder: FormBuilder,
    private globalS: GlobalService,
    private timeS: TimeSheetService,
    private staffS: StaffService,
    private cd: ChangeDetectorRef
  ) { 

    this.incidentLocation = this.getIncidentLocation();
  }

  ngOnInit(): void {
    this.token = this.globalS.decode();
    this.buildForm();

    // console.log(this.data);

    this.startTime = this.CONVERT_TO_TIME(this.data.activityTime.start_time);
    this.endTime = this.CONVERT_TO_TIME(this.data.activityTime.end_Time);

    this.computeTime();
  }

  getIncidentLocation() {
      return this.timeS.getincidentlocation();
  }

  buildForm(){
    this.optionForm = this.formBuilder.group(defaultOptions);
  }
  
  clickEvent(index: number) {

    if(index == 1){
      
    }
    
    if (index == 2) {

    }

    if (index == 3) {
      this.claimVariationOpen = true;
    }

    if (index == 4) {
      const defaults = this.settings.tA_TRAVELDEFAULT;
      console.log(defaults);

      var non_charge = defaults.indexOf("CHARGEABLE") > -1 && defaults.indexOf("NON") > -1 ? false : true;
      var travel = defaults.indexOf("WITHIN") > -1 ? true : false;

      this.travelClaimOpen = true;
    }

    if (index == 5) {
      this.rosterNoteOpen = true;
    }

    if (index == 6) {
      this.recordIncidentOpen = true;
    }

    if (index == 7) {
      this.whatNote = 1;
      this.notesIsOpen = true;
    }

    if (index == 8) {
      this.whatNote = 2;
      this.notesIsOpen = true;
    }

    // close popover
    this.visible = false;    
  }

  CONVERT_TO_TIME(date: string){
    return parseISO(date);
  } 

  handleCancel() {
    this.notesIsOpen = false;
    this.claimVariationOpen = false;
    this.travelClaimOpen = false;
    this.rosterNoteOpen = false;
    this.recordIncidentOpen = false;

    this.optionForm.reset(defaultOptions);
  }

  computeTime() {
      var timeObj = this.globalS.computeTime(this.startTime, this.endTime)
      this.timeDuration = timeObj.durationStr;

      this.cd.detectChanges();
  }

  claimVariation(){

    let claim: ClaimVariation = {
        RecordNo: this.data.shiftbookNo,
        ClaimedBy: this.token.nameid,
        ClaimedDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
        ClaimedEnd: this.data.activityTime.end_Time,
        ClaimedStart: this.data.activityTime.start_time
    }

    this.staffS.postclaimvariation(claim)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) {
              this.globalS.sToast('Claim Updated', 'Success');
              this.results.emit({
                type: 'claim',
                recordNo: this.data.shiftbookNo,
                output: true
              });
              return false;
          }
          this.globalS.eToast('Update Error', 'Error');
      }, () => {},() => this.claimVariationOpen = false);
  }



  handleOk() {
    
  }

  detectChanges(): void{
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  saveNote(whatNote: number) {

    const { notes } = this.optionForm.value;

    const iParameters = {
      RecipientCode: this.data.recipient,
      OperatorID: this.token.nameid,
      Note: notes,
      NoteType: whatNote == 1 ? 'OPNOTE' : 'CASENOTE'
    }    

    this.timeS.addclientnote(iParameters)
      .subscribe(data => {
        this.globalS.sToast('Success',`${iParameters.NoteType} Added!`);
        this.notesIsOpen = false
        this.handleCancel();
        

        this.detectChanges();
      }, () => {}, () => this.notesIsOpen = false);
    
  }

  saveRosterNote(){

    const { rosterNoteDetails } = this.optionForm.getRawValue();

    this.timeS.updaterosternote({
      Id: this.data.shiftbookNo,
      Note: rosterNoteDetails
    }).pipe(takeUntil(this.unsubscribe))
    .subscribe(res => {
        if (res) {

            this.results.emit({
              type: 'rnote',
              recordNo: this.data.shiftbookNo,
              output: rosterNoteDetails
            });

            this.handleCancel();
            this.globalS.sToast('Success', 'Roster Note Updated');
        }
    });
  }

  saveTravelClaim(){
    const { startKM, endKM, agencyVehicle, chargeClient, travelType, notes } = this.optionForm.getRawValue();

    if(startKM >= endKM){
      this.globalS.eToast('Error', 'StartKM should be lower than EndKM')
      return;
    }

    if(this.globalS.isEmpty(startKM) || this.globalS.isEmpty(endKM) || this.globalS.isEmpty(notes)){
      this.globalS.eToast('Error', 'Missing Inputs');
      return false;
    }

    let travel: TravelClaim = {
        RecordNo: this.data.shiftbookNo,
        User: this.token.user,
        Distance: (endKM - startKM).toString(),
        TravelType: travelType ? "TRAVEL WITHIN" : "TRAVEL BETWEEN",
        ChargeType: chargeClient ? "Chargeable" : "",
        StartKm: (startKM).toString(),
        EndKm: (endKM).toString(),
        Notes: notes
    };

    // console.log(travel);

    this.staffS.posttravelclaim(travel).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data.result) {
            this.globalS.sToast('Success', 'Travel Claim Filed');
            return;
        }
    }, (error) => {
        this.globalS.eToast('Error', 'Unable to save travel claim due to missing defaults')
    });

  }

  saveRecordIncident(){

    const { incidentDetails, incidentType, incidentSeverity, incidentLocation, noRecipient } = this.optionForm.getRawValue();

    let recordIncident: RecordIncident = {
        PersonId: this.data.recipient,
        IncidentType: incidentType,
        IncidentSeverity: incidentSeverity,
        Note: incidentDetails,
        Location: incidentLocation,
        NoRecipient: noRecipient,

        RecipientCode: this.data.recipient,
        Program: this.data.program,
        Service: this.data.activity,
        Staff: this.token.code,
        OperatorId: this.token.nameid
    }

    console.log(recordIncident);

    this.timeS.addrecordincident(recordIncident)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(data => {
        if (data) {
            this.globalS.sToast('Sucess', 'Record Incident added')
        }
    });

  }


}

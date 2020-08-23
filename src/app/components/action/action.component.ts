import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import parseISO from 'date-fns/parseISO';
import * as moment from 'moment';

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

  constructor(
    private formBuilder: FormBuilder,
    private globalS: GlobalService,
    private timeS: TimeSheetService,
    private staffS: StaffService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.token = this.globalS.decode();
    this.buildForm();

    console.log(this.settings);
    
    this.startTime = this.CONVERT_TO_TIME(this.data.activityTime.start_time);
    this.endTime = this.CONVERT_TO_TIME(this.data.activityTime.end_Time);

    this.computeTime();
  }

  buildForm(){
    this.optionForm = this.formBuilder.group({
      notes: new FormControl('')
    })
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
  }

  computeTime() {
      var timeObj = this.globalS.computeTime(this.startTime, this.endTime)
      this.timeDuration = timeObj.durationStr;

      this.cd.detectChanges();
  }

  claimVariation(){

    let claim: Dto.ClaimVariation = {
        RecordNo: this.data.shiftbookNo,
        ClaimedBy: this.token.nameid,
        ClaimedDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
        ClaimedEnd: this.data.activityTime.end_Time,
        ClaimedStart: this.data.activityTime.start_time
    }

    console.log(claim)

    this.staffS.postclaimvariation(claim)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) {
              this.globalS.sToast('Claim Updated', 'Success');
              return false;
          }
          this.globalS.eToast('Update Error', 'Error');
      });
  }



  handleOk() {
    
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
        this.globalS.sToast('Success','Note Added!')
      });
    
  }


}

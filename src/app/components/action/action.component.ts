import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TimeSheetService, GlobalService, view, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  @Input() data: any;
  @Input() settings: any;
  @Input() status: number;

  visible: boolean = false;
  notesIsOpen: boolean = false;
  claimVariationOpen: boolean = false;
  travelClaimOpen: boolean = false;
  rosterNoteOpen: boolean = false;
  recordIncidentOpen: boolean = false;

  isConfirmLoading: boolean = false;

  title: string;
  whatNote: number;

  optionForm: FormGroup;
  token: any;

  constructor(
    private formBuilder: FormBuilder,
    private globalS: GlobalService,
    private timeS: TimeSheetService
  ) { }

  ngOnInit(): void {
    this.token = this.globalS.decode();
    this.buildForm();
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

  handleCancel() {
    this.notesIsOpen = false;
    this.claimVariationOpen = false;
    this.travelClaimOpen = false;
    this.rosterNoteOpen = false;
    this.recordIncidentOpen = false;
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

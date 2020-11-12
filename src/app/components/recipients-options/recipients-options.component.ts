import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { RECIPIENT_OPTION, ModalVariables } from '../../modules/modules';
import { ListService } from '@services/index';


import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';


// import * as RECIPIENT_OPTION from '../../modules/modules';

// enum RECIPIENT_OPTION {
//   REFER_IN = "REFER_IN",
//   REFER_ON = "REFER_ON",
//   NOT_PROCEED = "NOT_PROCEED",
//   ASSESS = "ASSESS",
//   ADMIT = "ADMIT",
//   WAIT_LIST = "WAIT_LIST",
//   DISCHARGE = "DISCHARGE",
//   SUSPEND = "SUSPEND",
//   REINSTATE = "REINSTATE",
//   DECEASE = "DECEASE",
//   ADMIN = "ADMIN",
//   ITEM = "ITEM",
// }

@Component({
  selector: 'app-recipients-options',
  templateUrl: './recipients-options.component.html',
  styleUrls: ['./recipients-options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipientsOptionsComponent implements OnInit, OnChanges {

  @Input() open: any;
  @Input() option: RECIPIENT_OPTION;
  @Input() user: any;


  itemGroup: FormGroup;
  adminGroup: FormGroup;
  deceaseGroup: FormGroup;
  reinstateGroup: FormGroup;
  suspendGroup: FormGroup;
  dischargeGroup: FormGroup;
  waitListGroup: FormGroup;
  admitGroup: FormGroup;
  assessGroup: FormGroup;
  notProceedGroup: FormGroup;
  referOnGroup: FormGroup;
  referInGroup: FormGroup;

  whatOptionVar: ModalVariables;

  current: number = 0;

  itemOpen: boolean = false;
  adminOpen: boolean = false;
  deceaseOpen: boolean = false;
  reinstateOpen: boolean = false;
  suspendOpen: boolean = false;
  dischargeOpen: boolean = false;
  waitListOpen: boolean = false;
  admitOpen: boolean = false;
  assessOpen: boolean = false;
  notProceedOpen: boolean = false;
  referOnOpen: boolean = false;
  referInOpen: boolean = false;

  constructor(
    private listS: ListService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.buildForm();
        this.populate();
        this.openModal();
      }
    }
  }

  openModal(){
    this.current = 0;    
    if(this.option == RECIPIENT_OPTION.REFER_IN)  this.referOnOpen = true;
    if(this.option == RECIPIENT_OPTION.REFER_ON)  this.referInOpen = true;
    if(this.option == RECIPIENT_OPTION.NOT_PROCEED) this.notProceedOpen = true;
    if(this.option == RECIPIENT_OPTION.ASSESS)  this.assessOpen = true;
    if(this.option == RECIPIENT_OPTION.ADMIT) this.admitOpen = true;
    if(this.option == RECIPIENT_OPTION.WAIT_LIST) this.waitListOpen = true;
    if(this.option == RECIPIENT_OPTION.DISCHARGE) this.dischargeOpen = true;    
    if(this.option == RECIPIENT_OPTION.SUSPEND) this.suspendOpen = true;
    if(this.option == RECIPIENT_OPTION.REINSTATE) this.reinstateOpen = true;
    if(this.option == RECIPIENT_OPTION.DECEASE) this.deceaseOpen = true;
    if(this.option == RECIPIENT_OPTION.ADMIN) this.adminOpen = true;
    if(this.option == RECIPIENT_OPTION.ITEM)  this.itemOpen = true;
  }

  buildForm(): void {

    this.itemGroup = this.fb.group({
      programs: this.fb.array([]),
      referralType: null,
      date: null,
      refNo: null,
      quantity: null,
      unit: null,
      charge: null,
      gst: false
    });

    this.adminGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.deceaseGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.suspendGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.dischargeGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.waitListGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.admitGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.assessGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.notProceedGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.referOnGroup = this.fb.group({
      programs: this.fb.array([]),
    });

    this.referInGroup = this.fb.group({
      programs: this.fb.array([]),
    });
  }

  populate(){
      this.whatOptionVar = {}
      switch(this.option){
        case RECIPIENT_OPTION.REFER_IN:
          this.listS.getwizardprograms(this.user).subscribe(data => {
            this.whatOptionVar = {
              title: 'Referral In Wizard',
              wizardTitle: '',
              programsArr: data.map(x => {
                  return {
                      program: x.program,
                      type: x.type,
                      status: false,
                  }
              })
            }

            this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.REFER_IN);
            this.changeDetection();
          })
          break;
        case RECIPIENT_OPTION.REFER_ON:
          this.listS.getlist(`SELECT DISTINCT UPPER(rp.[Program]) AS Program, hr.[type] FROM RecipientPrograms rp INNER JOIN HumanResourceTypes hr ON hr.NAME = rp.program WHERE rp.PersonID = '${this.user}' AND ProgramStatus = 'REFERRAL' AND isnull([Program], '') <> ''                 `)
                    .subscribe(data => {
                        this.whatOptionVar = {
                            title: 'Referral Out Registration Wizard',
                            wizardTitle: '',
                            programsArr: data.map(x => {
                                return {
                                    program: x.program,
                                    type: x.type,
                                    status: false,
                                }
                            })
                        }
                        this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.REFER_ON);
                        this.changeDetection();
                        // this._whatOptionVar = this.whatOptionVar
                        // this.changeNoteEvent();
                    })
          break;
        case RECIPIENT_OPTION.NOT_PROCEED:
          this.listS.getlist(`SELECT DISTINCT UPPER(rp.[Program]) AS Program, hr.[type] FROM RecipientPrograms rp INNER JOIN HumanResourceTypes hr ON hr.NAME = rp.program WHERE rp.PersonID = '${this.user}' AND ProgramStatus = 'REFERRAL' AND isnull([Program], '') <> ''                 `)
                    .subscribe(data => {
                        this.whatOptionVar = {
                            title: 'Referral Not Proceeding Wizard',
                            wizardTitle: '',
                            programsArr: data.map(x => {
                                return {
                                    program: x.program,
                                    type: x.type,
                                    status: false,
                                }
                            })
                        }
                        this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.NOT_PROCEED);
                        this.changeDetection();
                        // this._whatOptionVar = this.whatOptionVar
                        // this.changeNoteEvent();
                    })
          break;
        case RECIPIENT_OPTION.ASSESS:
          this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program FROM RecipientPrograms WHERE PersonID = '${ this.user }' AND ProgramStatus = 'REFERRAL' AND isnull([Program], '') <> ''`)
                    .subscribe(data => {
                        this.whatOptionVar = {
                            title: 'Assessment Registration Wizard',
                            wizardTitle: '',
                            programsArr: data.map(x => {
                                return {
                                    program: x.program,
                                    type: x.type,
                                    status: false,
                                }
                            })
                        }
                        this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.ASSESS);
                        this.changeDetection();
                        // this._whatOptionVar = this.whatOptionVar
                        // this.changeNoteEvent();
                    })
          break;
        case RECIPIENT_OPTION.WAIT_LIST:
          this.listS.getlist(`SELECT DISTINCT UPPER( [Service Type] + ' (Pgm): ' + [ServiceProgram]) AS Program FROM  ServiceOverview SO INNER JOIN RecipientPrograms RP ON RP.PersonID = SO.PersonID WHERE  SO.PersonID = '${ this.user }' AND  (ProgramStatus IN  ('ACTIVE', 'WAITING LIST') AND ServiceStatus IN ('ACTIVE', 'WAIT LIST'))  AND isnull([Program], '') <> ''`)
          .subscribe(data => {
              this.whatOptionVar = {
                  title: 'Waitlist Management Wizard',
                  wizardTitle: '',
                  programsArr: data.map(x => {
                      return {
                          program: x.program, 
                      }

                  })
              }
              this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.WAIT_LIST);
              this.changeDetection();
              // this._whatOptionVar = this.whatOptionVar
              // this.changeNoteEvent();
          })
          break;
        case RECIPIENT_OPTION.ADMIT:
            this.listS.getadmitprograms(this.user).subscribe(data => {
                this.whatOptionVar = {
                    title: 'Admission Wizard',
                    wizardTitle: '',
                    programsArr: data.map(x => {
                        return {
                            title: x,
                            status: false
                        }
                    })
                }
                this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.ADMIT);
                this.changeDetection();
                // this.changeNoteEvent();
            })
          break;
        case RECIPIENT_OPTION.DISCHARGE:
          this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program, HumanResourceTypes.[Type] AS Type FROM RecipientPrograms LEFT JOIN HumanResourceTypes ON RecipientPrograms.Program = HumanResourceTypes.Name WHERE PersonID = '${this.user}' AND ProgramStatus IN ('ACTIVE', 'WAITING LIST') AND isnull([Program], '') <> '' AND ISNULL([UserYesNo3], 0) <> 1 AND ISNULL([User2], '') <> 'Contingency' `)
                    .subscribe(data => {
                        this.whatOptionVar = {
                            title: 'Discharge Registration Wizard',
                            wizardTitle: '',
                            programsArr: data.map(x => {
                                return {
                                    program: x.program, 
                                    type: x.Type
                                }

                            })
                        }

                        this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.DISCHARGE);
                        this.changeDetection();
                        // this._whatOptionVar = this.whatOptionVar
                        // this.changeNoteEvent();
                    })
          break;
        case RECIPIENT_OPTION.SUSPEND:
          this.listS.getlist(`SELECT DISTINCT '[' + CASE WHEN ([serviceprogram] <> '') AND ([serviceprogram] IS NOT NULL) THEN [serviceprogram] ELSE '?' END + '] ~> ' + [service type] AS Program FROM serviceoverview INNER JOIN recipientprograms ON serviceoverview.personid = recipientprograms.personid WHERE serviceoverview.personid = '${ this.user }' AND programstatus = 'ACTIVE' AND servicestatus = 'ACTIVE'`)
                    .subscribe(data => {
                        this.whatOptionVar = {
                            title: 'Service Suspension Wizard',
                            wizardTitle: '',
                            programsArr: data.map(x => {
                                return {
                                    program: x.program,
                                    checked: false,
                                    type: x.Type
                                }
                            })
                        }

                        this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.SUSPEND);
                        this.changeDetection();

                        // this._whatOptionVar = this.whatOptionVar
                        // this.changeNoteEvent();
                    })
          break;
        case RECIPIENT_OPTION.REINSTATE:
          break;
        case RECIPIENT_OPTION.DECEASE:
          this.listS.getlist(`SELECT DISTINCT Upper([program]) AS Activity 
          FROM   recipientprograms 
                 LEFT JOIN humanresourcetypes 
                        ON recipientprograms.program = humanresourcetypes.NAME 
          WHERE  personid = '${this.user }' 
                 AND programstatus IN ( 'ACTIVE', 'WAITING LIST' ) 
                 AND Isnull([program], '') <> '' 
                 AND Isnull([useryesno3], 0) <> 1 
                 AND Isnull([user2], '') <> 'Contingency' `).subscribe(data => {

                   console.log(data);
                   this.whatOptionVar = {
                        title: 'Deceased Wizard',
                        wizardTitle: '',
                        programsArr: data.map(x => {
                            return {
                                program: x.program,
                                checked: false
                            }
                        })
                    }

                    this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.DECEASE);
                    this.changeDetection();

                    //  this.referralGroup.patchValue({ noteCategory: 'DISCHARGE' })
                    //  this.selectedAdmitPrograms = data.map(x => {
                    //      return {
                    //          title: x.activity,
                    //          status: true
                    //      }
                    //  })
                    //  if(this.selectedAdmitPrograms.length > 0)    this.programChange(true,this.selectedAdmitPrograms[0])
                 })
          break;
        case RECIPIENT_OPTION.ADMIN:
          this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program FROM RecipientPrograms WHERE PersonID = '${ this.user }'AND ProgramStatus <> 'INACTIVE' AND isnull([Program], '') <> '' `)
                        .subscribe(data => {
                            this.whatOptionVar = {
                                title: 'Admin Registration Wizard',
                                wizardTitle: '',
                                programsArr: data.map(x => {
                                    return {
                                        program: x.program,
                                        checked: false
                                    }
                                })
                            }

                            this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.ADMIN);
                            this.changeDetection();
                            // this._whatOptionVar = this.whatOptionVar
                            // this.changeNoteEvent();
                        })
                    break;
        case RECIPIENT_OPTION.ITEM:
          this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program FROM RecipientPrograms WHERE PersonID = '${ this.user }'AND ProgramStatus <> 'INACTIVE' AND isnull([Program], '') <> '' `)
                        .subscribe(data => {
                            this.whatOptionVar = {
                                title: 'Record Items Wizard',
                                wizardTitle: '',
                                programsArr: data.map(x => {
                                    return {
                                        program: x.program,
                                        checked: false
                                    }
                                })
                            }

                            this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.ITEM);
                            this.changeDetection();
                            // this._whatOptionVar = this.whatOptionVar
                            // this.changeNoteEvent();
                        })
                    break;
      }
  }

  formProgramArray(data: any, type: RECIPIENT_OPTION){


    if(type == RECIPIENT_OPTION.ITEM){
      var prog = this.itemGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.ADMIN){
      var prog = this.adminGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.DECEASE){
      var prog = this.deceaseGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.SUSPEND){
      var prog = this.suspendGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.DISCHARGE){
      var prog = this.dischargeGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.WAIT_LIST){
      var prog = this.waitListGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.ADMIT){
      var prog = this.admitGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.ASSESS){
      var prog = this.assessGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.NOT_PROCEED){
      var prog = this.notProceedGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.REFER_ON){
      var prog = this.referOnGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    if(type == RECIPIENT_OPTION.REFER_IN){
      var prog = this.referInGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
    }

    console.log(this.itemGroup.value)
  }

  createProgramForm(data: any): FormGroup {
    return this.fb.group({
      program: new FormControl(data.program),
      checked: new FormControl(data.checked)
    });
  }

  changeDetection(){
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
  

  pre() {
    this.current-=1;
  }

  next() {
    this.current+=1;

    console.log(this.itemGroup.value)
  }

  get canGoNext(): boolean {
    return true;
  }

  get canBeDone(): boolean {
    return true;
  }

  handleCancel() {
      this.open = false;

      this.itemOpen = false;
      this.adminOpen = false;
      this.deceaseOpen = false;
      this.reinstateOpen = false;
      this.suspendOpen = false;
      this.dischargeOpen = false;
      this.waitListOpen = false;
      this.admitOpen = false;
      this.assessOpen = false;
      this.notProceedOpen = false;
      this.referOnOpen = false;
      this.referInOpen = false;
  }

  handleOk() {
    
  }

  haha(data: any){
    console.log(data);
  }

}

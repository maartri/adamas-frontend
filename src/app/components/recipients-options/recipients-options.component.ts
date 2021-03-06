import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { RECIPIENT_OPTION, ModalVariables } from '../../modules/modules';
import { ListService, GlobalService, quantity, unit } from '@services/index';
import { SqlWizardService } from '@services/sqlwizard.service';

import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import {mergeMap,takeUntil,debounceTime, distinctUntilChanged, map, switchMap, skip, startWith } from 'rxjs/operators';
import { EMPTY, combineLatest, Observable } from 'rxjs';
import { startsWith } from 'lodash';

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
export class RecipientsOptionsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() open: any;
  @Input() option: RECIPIENT_OPTION;
  @Input() user: any;

  CURRENT_DATE: Date = new Date();


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

  loadPrograms:boolean = false;

  inputValue: any;
  radioValue: any = 'case';
  checkedPrograms: any;

  checked: boolean = false;
  noteArray: Array<any> = []; 
  remindersRecipientArray: Array<string>;

  dischargeTypes: Array<any> = [];

  itemTypes$: Observable<any>;
  reasons$: Observable<any>;
  dischargeReason$: Observable<any>;
  cancellationCode$: Observable<any>;
  referralCode$: Observable<any>;
  referralSource$: Observable<any>;
  
  globalFormGroup: FormGroup;
  
  quantity: Array<any> = quantity;
  unit: Array<any> = unit;

  constructor(
    private listS: ListService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private globalS: GlobalService,
    private sqlWiz: SqlWizardService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }  

  ngOnDestroy(){
    console.log('out')
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let property in changes) {
      if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
        this.buildForm();
        this.populate();
        this.populateList();

        this.VALUE_CHANGES();

        this.openModal();
      }
    }
  }

  openModal(){
    this.current = 0;    
    if(this.option == RECIPIENT_OPTION.REFER_IN)  this.referInOpen = true;
    if(this.option == RECIPIENT_OPTION.REFER_ON)  this.referOnOpen = true;
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
      gst: false,
      
      radioGroup: 'case',
      notes: null,
      caseCategory: null,
      publishToApp: false,

      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.adminGroup = this.fb.group({
      programs: this.fb.array([]),
      referralDate: null,
      time: null,
      timeSpent: null,
      radioGroup: 'case',
      notes: '',
      caseCategory: 'OTHER',
      publishToApp: false,
      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.deceaseGroup = this.fb.group({
      programs: this.fb.array([]),
      deathDate: null,
      reason: null,
      dischargeType: null,

      dischargeDate: null,
      time: null,
      timeSpent: null,

      radioGroup: 'case',
      notes: null,
      caseCategory: null,
      publishToApp: false,

      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.suspendGroup = this.fb.group({
      programs: this.fb.array([]),
      cancellationCode: null,
      recordFormal: true,
      recordHours: true,
      suspendDateTo: null,
      suspendDateFrom: null,

      radioGroup: 'case',
      notes: null,  
      caseCategory: null,
      publishToApp: false,

      reminderDate: null,
      reminderTo: null,
    });

    this.dischargeGroup = this.fb.group({
      programs: this.fb.array([]),
      reason: null,
      dischargeType: null,

      dischargeDate: null,
      time: null,
      timeSpent: null,

      radioGroup: 'case',
      notes: null,
      caseCategory: 'DISCHARGE',
      publishToApp: false,
      
      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.waitListGroup = this.fb.group({
      programs: this.fb.array([]),

      activityCode: null,
      suppliedDate: null,
      suppliedRef: null,

      actionDate: null,
      time: null,
      timeSpent: null,
      
      radioGroup: 'case',
      notes: null,
      caseCategory: null,
      publishToApp: false,
      
      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.admitGroup = this.fb.group({
      programs: this.fb.array([]),

      radioGroup: 'case',
      notes: null,
      caseCategory: null,
      publishToApp: false,
      
      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.assessGroup = this.fb.group({
      programs: this.fb.array([]),
      
      date:null,
      time: null,
      timeSpent: null,

      radioGroup: 'case',
      notes: null,
      caseCategory: 'SCREEN/ASSESS',
      publishToApp: false,

      
      
      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.notProceedGroup = this.fb.group({
      programs: this.fb.array([]),
      reasonCode: null,

      date:null,
      time: null,
      timeSpent: null,

      radioGroup: 'case',
      notes: null,
      caseCategory: null,
      publishToApp: false,
      
      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.referOnGroup = this.fb.group({
      programs: this.fb.array([]),
      referralTo: null,
      referralCode: null,

      referralType: null,
      date: null,
      time: null,
      timeSpent: null,

      radioGroup: 'case',
      notes: null,
      caseCategory: 'REFERRAL-OUT',
      publishToApp: false,
      
      reminderDate: null,
      reminderTo: null,
      emailNotif: null,
      multipleStaff: null
    });

    this.referInGroup = this.fb.group({
      programs: this.fb.array([]),
    });

  }

  VALUE_CHANGES(){
    
    if(this.option == RECIPIENT_OPTION.DISCHARGE){
      this.noteArray = ['DISCHARGE'];
      this.dischargeGroup.get('caseCategory').disable();
      return;
    }

    if(this.option == RECIPIENT_OPTION.ASSESS){
      this.noteArray = ['SCREEN/ASSESS'];
      this.assessGroup.get('caseCategory').disable();
      return;
    }

    if(this.option == RECIPIENT_OPTION.REFER_ON){
      this.noteArray = ['REFERRAL-OUT'];
      this.referOnGroup.get('caseCategory').disable();
      return;
    }
    
    combineLatest([
      this.adminGroup.get('radioGroup').valueChanges.pipe(startWith('case')),
      this.adminGroup.get('notes').valueChanges.pipe(startWith(''))
    ]).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(x => {
        this.adminGroup.patchValue({ caseCategory: null });
        if(!x || this.globalS.isEmpty(x[0]) || this.globalS.isEmpty(x[1])){
          this.noteArray = ['OTHER'];
          this.adminGroup.patchValue({ caseCategory: 'OTHER' });
          return EMPTY;
        }

        let index = x[0] === 'case' ? 0 : x[0] === 'op' ? 1  : 2;
        return this.listS.getcasenotecategory(index);
      })
    ).subscribe(data => {
        this.noteArray = data;
    });
  }

  populateList(){
    this.listS.getremindersrecipient()
        .subscribe(d => {
            this.remindersRecipientArray = d;
        });
  }

  done(){


    if(this.option == RECIPIENT_OPTION.REFER_IN){
      console.log(this.referInGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.REFER_ON){
      console.log(this.referOnGroup.value)
    }
    
    if(this.option == RECIPIENT_OPTION.NOT_PROCEED){
      console.log(this.notProceedGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.ASSESS){
      console.log(this.assessGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.ADMIT){
      console.log(this.admitGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.WAIT_LIST){
      console.log(this.waitListGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.DISCHARGE){
      console.log(this.dischargeGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.SUSPEND){
      console.log(this.suspendGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.REINSTATE){
      console.log(this.reinstateGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.DECEASE){
      console.log(this.deceaseGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.ADMIN){
      console.log(this.adminGroup.value)
    }

    if(this.option == RECIPIENT_OPTION.ITEM){
      console.log(this.itemGroup.value)
    }
  }

  populate(){

      this.whatOptionVar = {};
      this.loadPrograms = true;

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
                            program: x,
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
                                program: x.activity,
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

  GETREFERRAL_LIST(){
    if(this.option == RECIPIENT_OPTION.ITEM){
      console.log('item');
    }
  }

  formProgramArray(data: any, type: RECIPIENT_OPTION){

    this.loadPrograms = false;

    if(type == RECIPIENT_OPTION.ITEM){
      var prog = this.itemGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.itemGroup;
    }

    if(type == RECIPIENT_OPTION.ADMIN){
      var prog = this.adminGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.adminGroup;
    }

    if(type == RECIPIENT_OPTION.DECEASE){
      var prog = this.deceaseGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.deceaseGroup;
    }

    if(type == RECIPIENT_OPTION.SUSPEND){
      var prog = this.suspendGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.suspendGroup;
    }

    if(type == RECIPIENT_OPTION.DISCHARGE){
      var prog = this.dischargeGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.dischargeGroup;

      this.noteArray = ['DISCHARGE'];
      return;
    }

    if(type == RECIPIENT_OPTION.WAIT_LIST){
      var prog = this.waitListGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.waitListGroup;
    }

    if(type == RECIPIENT_OPTION.ADMIT){
      var prog = this.admitGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.admitGroup;
    }

    if(type == RECIPIENT_OPTION.ASSESS){
      var prog = this.assessGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.assessGroup;

      this.noteArray = ['SCREEN/ASSESS'];
      return;
    }

    if(type == RECIPIENT_OPTION.NOT_PROCEED){
      var prog = this.notProceedGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.notProceedGroup;
    }

    if(type == RECIPIENT_OPTION.REFER_ON){
      var prog = this.referOnGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.referOnGroup;

      this.noteArray = ['REFERRAL-OUT'];
      return;
    }

    if(type == RECIPIENT_OPTION.REFER_IN){
      var prog = this.referInGroup.get('programs') as FormArray;
      data.programsArr.map(x => prog.push(this.createProgramForm(x)));
      this.globalFormGroup = this.referInGroup;
    }

    this.changeDetection();

    combineLatest([
      this.globalFormGroup.get('radioGroup').valueChanges.pipe(startWith('case')),
      this.globalFormGroup.get('notes').valueChanges.pipe(startWith(''))
    ]).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(x => {
        this.globalFormGroup.patchValue({ caseCategory: null });

        if(!x || this.globalS.isEmpty(x[0]) || this.globalS.isEmpty(x[1])){
          this.noteArray = ['OTHER'];
          this.globalFormGroup.patchValue({ caseCategory: 'OTHER' });
          return EMPTY;
        }

        let index = x[0] === 'case' ? 0 : x[0] === 'op' ? 1  : 2;
        return this.listS.getcasenotecategory(index);
      })
    ).subscribe(data => {
        this.noteArray = data;
        this.changeDetection();
    });
  }


  createProgramForm(data: any): FormGroup {
    return this.fb.group({
      program: new FormControl(data.program),
      checked: new FormControl(data.checked),
      type: new FormControl(data.type)
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

    if(this.adminOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.dischargeOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.waitListOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.admitOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.assessOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.notProceedOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.referInOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.referOnOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }



    if(this.suspendOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.itemOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }

    if(this.deceaseOpen){
      if(this.current < 4){
        this.current += 1;
      }
    }


    // Other Details Tab Populate 
    if(this.current == 1){
      this.populateOtherDetails();      
    }

    this.checkedPrograms = this.GET_CHECKEDPROGRAMS();
  }

  populateOtherDetails(){

    if(this.option == RECIPIENT_OPTION.REFER_ON)
    {
      this.referralSource$ = this.listS.getwizardreferralsource('default');

      this.checkedPrograms = this.GET_CHECKEDPROGRAMS();
      console.log(this.checkedPrograms)

      var haccList: Array<any> = this.checkedPrograms.filter(x => x.type == 'HACC');
      if(haccList && haccList.length > 0) 
        this.referralSource$ = this.listS.getwizardreferralsource('HACC');
    
      var decList: Array<any> = this.checkedPrograms.filter(x => x.type == 'DEX');
      if(decList && decList.length > 0)   
        this.referralSource$ = this.listS.getwizardreferralsource('DEX');

      this.referralCode$ = this.listS.getwizardreferralcode();
    }

    if(this.option == RECIPIENT_OPTION.DECEASE)
    {
      this.reasons$ = this.listS.getreasons();
    }

    if(this.option == RECIPIENT_OPTION.SUSPEND)
    {
      this.cancellationCode$ = this.listS.getlist(`SELECT title FROM itemtypes WHERE ( enddate IS NULL OR enddate >= '${ this.CURRENT_DATE.toISOString() }' ) AND rostergroup = 'RECPTABSENCE' AND status = 'ATTRIBUTABLE' AND processclassification = 'EVENT' ORDER BY title`)
    }

    if(this.option == RECIPIENT_OPTION.DISCHARGE)
    {
      this.dischargeReason$ = this.listS.getlist(`SELECT DISTINCT Description, HACCCode, RecordNumber FROM DataDomains WHERE Domain = 'REASONCESSSERVICE'`);
    }

    if(this.option == RECIPIENT_OPTION.ITEM)
    {
      let _input = {
        program: '',
        option: this.option
      }
      this.itemTypes$ = this.sqlWiz.GETREFERRALTYPE_V2(_input);
    }
  }
  

  GET_CHECKEDPROGRAMS(){
    var programs: Array<any> = this.globalFormGroup.get('programs').value || [];
    console.log(programs);
    if(programs.length == 0)  return [];

    let checked = programs.filter(x => x.checked);

    return checked;
  }

  get canGoNext(): boolean {
    return true;
  }

  get canBeDone(): boolean {
    return true;
  }

  handleClose(){
      // this.option = null;

      // this.open = false;

      // this.itemOpen = false;
      // this.adminOpen = false;
      // this.deceaseOpen = false;
      // this.reinstateOpen = false;
      // this.suspendOpen = false;
      // this.dischargeOpen = false;
      // this.waitListOpen = false;
      // this.admitOpen = false;
      // this.assessOpen = false;
      // this.notProceedOpen = false;
      // this.referOnOpen = false;
      // this.referInOpen = false;
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

  onChange(data: any){
    
  }

}

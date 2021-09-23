import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { RECIPIENT_OPTION, ModalVariables, ProcedureRoster, UserToken, CallAssessmentProcedure, CallProcedure, CallReferralOutProcedure } from '../../modules/modules';
import { ListService, GlobalService, quantity, unit, dateFormat, ClientService,timeSteps } from '@services/index';
import { SqlWizardService } from '@services/sqlwizard.service';


import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import {mergeMap,takeUntil,debounceTime, distinctUntilChanged, map, switchMap, skip, startWith } from 'rxjs/operators';
import { EMPTY, combineLatest, Observable, of } from 'rxjs';
import { startsWith } from 'lodash';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import format from 'date-fns/format';
import { setDate } from 'date-fns';
import { filter } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import addDays from 'date-fns/addDays'

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
const NOTE_TYPE: { } = {
  'case': 'CASENOTE',
  'op': 'OPNOTE',
  'clinical': 'CLINICALNOTE'
}

const defaultTimeSpent = new Date().setHours(0, 15);
const defaultDate = new Date().setHours(0,0);
const defaultDateTime = new Date();

@Component({
  selector: 'app-recipients-options',
  templateUrl: './recipients-options.component.html',
  styleUrls: ['./recipients-options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipientsOptionsComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe$ = new Subject()
  
  @Input() open: any;
  @Input() option: RECIPIENT_OPTION;
  @Input() user: any;
  @Input() from:any;
  @Input() program: string;

  dateFormat: string = dateFormat;

  topBelow = { top: '20px' }

  FUNDING_TYPE: string;
  BRANCH_NAME: string;
  DOCUMENTID: number;
  COORDINATOR: string;
  EMAIL_OF_COORDINATOR: string;
    
  referralRadioValue: any;
  referralCheckOptions: Array<any> = [
    {
      name: 'NDIA Referral',
      index: 1,
      checked: false
    },
    {
      name: 'HCP Referral',
      index: 2,
      checked: false
    },
    {
      name: 'DEX Referral',
      index: 3,
      checked: false
    },
    {
      name: 'Other',
      index: 4,
      checked: false
    }
  ]
  
  CURRENT_DATE: Date = new Date();
  
  gwapo: Array<any> = [
    {
      program: 'hello',
      checked: true,
      selected: '',
      type: null
    },
    {
      program: 'aaaa',
      checked: true,
      selected: '',
      type: null
    },
    {
      program: 'bbbb',
      checked: true,
      selected: '',
      type: null
    }
  ]
  
  
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
  referIndocument: boolean = false;
  referdocument: boolean = false;
  admission :  boolean = false;
  loadPrograms:boolean = false;
  
  inputValue: any;
  radioValue: any = 'case';
  checkedPrograms: any;
  uncheckedPrograms: Array<any>;
  
  checked: boolean = false;
  noteArray: Array<any> = []; 
  remindersRecipientArray: Array<string>;
  
  //last 4 tabs
  notifCheckBoxGroup: any;
  notifCheckBoxes: Array<string> = []
  notifFollowUpGroup: any;
  notifDocumentsGroup: any;
  followups: Array<string>;
  notifications: Array<string>;
  timeSteps:Array<string>;
  documentlist: Array<string>;
  datalist: Array<string>;
  private destroy$ = new Subject();
  
  
  dischargeTypes: Array<any> = [];
  
  itemTypes$: Observable<any>;
  reasons$: Observable<any>;
  dischargeReason$: Observable<any>;
  cancellationCode$: Observable<any>;
  referralCode$: Observable<any>;
  referralType$: Observable<any>;
  referralSource$: Observable<any>;
  
  globalFormGroup: FormGroup;
  
  newReferralUser: any;

  globalProgramSelection: any;
  
  quantity: Array<any> = quantity;
  unit: Array<any> = unit;
  
  programs: Array<any> = [];
  token: UserToken;
  
  fileList2: Array<any> = [];
  
  date:any;
  urlPath: string = `api/v2/file/upload-document-remote`;
  acceptedTypes: string = "image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
  file: File;
  originalPackageName: string;
  admissionActiviType: any;
  
  constructor(
    private listS: ListService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private globalS: GlobalService,
    private sqlWiz: SqlWizardService,
    private clientS: ClientService,
    private http: HttpClient,
    private msg: NzMessageService,
    ) { }
    
    ngOnInit(): void {
      this.buildForm();
      this.token = this.globalS.decode();
      this.date = format(new Date(), 'MM-dd-yyyy');      
    }  
    
    ngOnDestroy(){
      
    }
    
    ngOnChanges(changes: SimpleChanges): void {
      for (let property in changes) {
        if (property == 'open' && !changes[property].firstChange && changes[property].currentValue != null) {
          // console.log(this.user);
          // console.log(this.from)
          // GETS Branch name or Gets it through database
          
          if('branch' in this.user){
            this.BRANCH_NAME = this.user.branch;
          } else {
            this.listS.getspecificbranch(this.user.id)
                  .subscribe(data => {
                    this.BRANCH_NAME = data.branch;
                    this.COORDINATOR = data.coordinator;
                  });
          }

          if('docId' in this.user){
            this.DOCUMENTID = this.user.docId;
          }


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
      this.changeDetection();
    }
    
    buildForm(): void {
      
      this.itemGroup = this.fb.group({
        programs: this.fb.array([]),
        programChecked: null,

        referralType: null,
        suppliedDate: null,
        
        date: new Date(defaultDate),
        refNo: null,
        quantity: null,
        unit: null,
        charge: null,
        gst: false,
        
        radioGroup: 'CASENOTE',
        notes: null,
        caseCategory: 'ITEM',
        publishToApp: false,
        
        reminderDate: null,
        reminderTo: null,
        emailNotif: null,
        multipleStaff: null
      });
      
      this.adminGroup = this.fb.group({
        programs: this.fb.array([]),
        programChecked: null,

        referralDate: null,
        time: null,
        timeSpent: new Date(defaultTimeSpent),
        radioGroup: 'CASENOTE',
        notes: '',
        caseCategory: 'OTHER',
        publishToApp: false,
        reminderDate: null,
        reminderTo: null,
        emailNotif: null,
        adminsssion:null,
        multipleStaff: null,
      });
      
      this.deceaseGroup = this.fb.group({
        programs: this.fb.array([]),
        programChecked: null,

        deathDate: null,
        reason: null,
        dischargeType: null,
        
        dischargeDate: new Date(defaultDate),
        time: new Date(defaultDateTime),
        timeSpent: new Date(defaultTimeSpent),
        
        radioGroup: 'CASENOTE',
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
        programChecked: null,

        cancellationCode: null,
        recordFormal: true,
        recordHours: true,
        suspendDateTo: null,
        suspendDateFrom: null,
        
        radioGroup: 'CASENOTE',
        notes: null,  
        caseCategory: null,
        publishToApp: false,
        
        reminderDate: null,
        reminderTo: null,
      });
      
      this.dischargeGroup = this.fb.group({
        programs: this.fb.array([]),
        programChecked: null,

        reason: null,
        dischargeType: null,
        
        dischargeDate: new Date(defaultDate),
        time: new Date(defaultDateTime),
        timeSpent: new Date(defaultTimeSpent),
        
        radioGroup: 'CASENOTE',
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
        programChecked: null,
        
        activityCode: null,
        suppliedDate: null,
        suppliedRef: null,
        
        actionDate: new Date(defaultDate),
        time: new Date(defaultDateTime),
        timeSpent: new Date(defaultTimeSpent),
        
        radioGroup: 'CASENOTE',
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
        radioGroup: 'CASENOTE',
        notes: null,
        programChecked:null,
        caseCategory: 'ADMISSION',
        publishToApp: false,
        reminderDate: null,
        reminderTo: null,
        emailNotif: null,
        multipleStaff: null,
        referralDate: null,

        admissionDate:new Date(defaultDate),
        time: new Date(defaultDateTime),
        timeSpent: new Date(defaultTimeSpent),
        rosterCreationDates: [],

        adminsssion:null,
        admissionType:null,
        timePeriod: [],
      
      });
      
      
      this.admitGroup.get('programChecked').valueChanges
        .pipe(
            switchMap(x => {
              console.log(x)
                if(!x) return EMPTY;
                this.globalProgramSelection = {
                  program: x,
                  option: 'ADMIT'
                }
                return this.listS.getreferraltype(this.globalProgramSelection)
            }),
            switchMap(data => {
              this.admissionActiviType = data;
              if(data.length == 1){
                this.admitGroup.patchValue({
                  admissionType: this.admissionActiviType[0]
                });
              }
              return this.listS.gethumanresourcetypes({ program: this.globalProgramSelection.program})
            })
          ).subscribe(data => {
              this.FUNDING_TYPE = data;
          });

       this.assessGroup = this.fb.group({
          programs: this.fb.array([]),
          programChecked: null,
          serviceType: null,
          date: new Date(defaultDate),
          time: new Date(defaultDateTime),
          timeSpent: new Date(defaultTimeSpent),          
          radioGroup: 'CASENOTE',
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
        programChecked: null,
        reasonCode: null,
        referralType: null,
        
        date: new Date(defaultDate),
        time: new Date(defaultDateTime),
        timeSpent: new Date(defaultTimeSpent),
        
        radioGroup: 'CASENOTE',
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
        programChecked: null,
        referralSource: null,
        referralCode: null,
        
        referralType: null,
        date: new Date(defaultDate),
        time: new Date(defaultDateTime),
        timeSpent: new Date(defaultTimeSpent),
        
        radioGroup: 'CASENOTE',
        notes: null,
        caseCategory: 'REFERRAL-OUT',
        publishToApp: false,
        
        reminderDate: null,
        reminderTo: null,
        emailNotif: null,
        multipleStaff: null
      });
      
      this.referInGroup = this.fb.group({
        type: null,
        programChecked: null,
        packageName: null,
        programs: this.fb.array([]),
        
        referralSource: null,
        referralCode: null,
        referralType: null,
        
        date: new Date(),
        time: new Date(),
        timeSpent: new Date(defaultTimeSpent),
        
        radioGroup: 'CASENOTE',
        notes: null,
        caseCategory: 'REFERRAL-IN',
        publishToApp: false,
        
        reminderDate: null,
        reminderTo: null,
        emailNotif: null,
        multipleStaff: null
      });
      
    }
    
    mutateToCheckboxes(list: Array<any>): Array<any> {
      return list.map(x => {
        return {
          name: x
        }
      })
    }
    
    selectedProgram: any;

    selectedProgramChange(name: any){
      this.selectedProgram = name;
      const { type } = this.referInGroup.getRawValue();

      if(type == 2){
        const level = name.trim().split(' ')[1];
        this.referInGroup.patchValue({
          packageName: `HCP-L${level}-${this.user.code}`
        });
      }

      if(type == 4){
          this.listS.gethumanresourcetypes({ program: this.selectedProgram })
              .subscribe(data => this.FUNDING_TYPE = data);
      }
      
    }
    
    

    referralInChange(index: any)
    {
      this.selectedProgram = null;
      this.programs = [];

      if(index == 1){
        this.isPackageNameAvailable = null;
        this.listS.getndiaprograms().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {        
          this.programs = this.mutateToCheckboxes(data);
          this.changeDetection();
        });
        
        this.originalPackageName  =`NDIA-${this.user.code}`;
        
        this.referInGroup.patchValue({
          packageName: this.originalPackageName
        });

        this.FUNDING_TYPE = 'NDIA';
      }
      
      if(index == 2){
        this.isPackageNameAvailable = null;
        this.listS.gethcpprograms().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
          this.programs = data;
          this.changeDetection();
        })
        
        this.originalPackageName = `HCP-L1-${this.user.code}`;
        
        this.referInGroup.patchValue({
          packageName: this.originalPackageName
        });

        this.FUNDING_TYPE = 'DOHA';
      }
      
      if(index == 3){
        this.listS.getdexprograms(this.user.id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
          this.programs = this.mutateToCheckboxes(data);
          this.changeDetection();
        });
        this.FUNDING_TYPE = 'DSS';
      }
      
      if(index == 4){
        this.listS.getotherprograms(this.user.id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
          this.programs = this.mutateToCheckboxes(data);
          this.changeDetection();
        });

        this.FUNDING_TYPE = null;
      }

    }
    
    isPackageNameAvailable: boolean = null;

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
      
      if(this.option == RECIPIENT_OPTION.ITEM){
        this.noteArray = ['ITEM'];
        this.itemGroup.get('caseCategory').disable();
        return;
      }
      
      if(this.option == RECIPIENT_OPTION.REFER_IN){
        this.noteArray = ['REFERRAL-IN'];
        this.referInGroup.get('caseCategory').disable();
        
        this.referInGroup.get('packageName')
        .valueChanges
        .pipe(
          switchMap(x => {
            this.isPackageNameAvailable = null;
            return of(x);
          }),
          debounceTime(200),
          switchMap(x => {            
            return this.listS.checkIfPackageNameExists(x)
          })
          )
          .subscribe(data => {
            this.isPackageNameAvailable = data;
            this.changeDetection();
          });
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
        
        IsNDIAorHCP(): boolean {
          return this.referInGroup.get('type').value == 1 || this.referInGroup.get('type').value == 2;
        }

        PATCH_NOTES(data: string){
          if(this.option == RECIPIENT_OPTION.REFER_IN)
          {
            this.referInGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.REFER_ON)
          {
            this.referOnGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.NOT_PROCEED){
            this.notProceedGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.ASSESS){
            this.assessGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.ADMIT){
            this.admitGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.WAIT_LIST){
            this.waitListGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.DISCHARGE){
            this.dischargeGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.SUSPEND){
            this.suspendGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.DECEASE){
            this.deceaseGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.ADMIN){
            this.adminGroup.get('notes').patchValue(data);
          }

          if(this.option == RECIPIENT_OPTION.ITEM){
            this.itemGroup.get('notes').patchValue(data);
          }
        }

        GET_FUNDING_TITLE(): string{
          if(this.option == RECIPIENT_OPTION.REFER_IN){
            return `${this.FUNDING_TYPE} REFERRAL`;
          }

          if(this.option == RECIPIENT_OPTION.REFER_ON){
            return 'REFERRAL ON';
          }

          if(this.option == RECIPIENT_OPTION.NOT_PROCEED){
            return 'NOT PROCEED';
          }

          if(this.option == RECIPIENT_OPTION.ASSESS){
            return 'ASSESSMENT'
          }

          if(this.option == RECIPIENT_OPTION.ADMIT){
            return 'ADMISSION'
          }

          if(this.option == RECIPIENT_OPTION.WAIT_LIST){
            return 'WAIT LIST'
          }

          if(this.option == RECIPIENT_OPTION.DISCHARGE){
            return 'DISCHARGE'
          }

          if(this.option == RECIPIENT_OPTION.SUSPEND){
            return 'SUSPENSION'
          }

          if(this.option == RECIPIENT_OPTION.DECEASE){
            return 'DECEASE'
          }

          if(this.option == RECIPIENT_OPTION.ADMIN){
            return 'ADMIN REGISTRATION'
          }

          if(this.option == RECIPIENT_OPTION.ITEM){
            return 'ITEM'
          }
        }
        
        done(){

              var finalRoster: Array<ProcedureRoster> = [];              
              var checkedPrograms = this.checkedPrograms;

              const defaultValues = {
                // '' is the default
                billDesc: '',
                
                // 7 for everything except 14 for item
                type: 7,
                
                // 2 is the default,
                rStatus: '2',
                
                // HOUR is the default     
                billUnit: 'HOUR',
                
                // 0 is the default  
                billType: '0',
                
                // '' is the default
                payType: '',
                
                // '' is the default
                payRate: '',
                
                // '' is the default
                payUnit: '',
                
                // '' is the default
                apInvoiceDate: '',
                
                // '' is the default
                apInvoiceNumber: '',
                
                // 0 is default
                groupActivity: '0',
                
                // '' is the default
                serviceSetting: ''
              }

              if(this.option == RECIPIENT_OPTION.REFER_IN)
              {
                        
                    const 
                    { 
                      referralSource,
                      referralCode,
                      referralType,
                      packageName,
                      radioGroup,
                      notes,
                      date,
                      time,
                      timeSpent,
                      caseCategory,
                      publishToApp,
                    } = this.referInGroup.getRawValue();
                    
                    const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                    const timeInMinutes = this.globalS.getMinutes(timeSpent)
                    const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString();
                    
                    let program: ProcedureRoster = {
                      clientCode: this.user.code,
                      carerCode: this.token.code,
                      
                      serviceType: referralType,
                      date: format(date,'yyyy/MM/dd'),
                      time: format(time,'HH:mm'),
                      
                      creator: this.token.code,
                      editer: this.token.user,
                      
                      billUnit: defaultValues.billUnit,
                      billDesc: defaultValues.billDesc,
                      agencyDefinedGroup: this.user.agencyDefinedGroup,
                      referralCode: referralCode,
                      timePercent: timePercentage,
                      notes: notes || "",
                      type: defaultValues.type,
                      duration: timeInMinutes / 5,
                      blockNo: blockNoTime,
                      reasonType: '',
                      
                      tabType: 'REFERRAL-IN',
                      program: this.IsNDIAorHCP() ?  packageName : this.selectedProgram,
                      packageStatus: 'REFERRAL'
                    }
                    
                    finalRoster.push(program);
                    
                  const data: CallProcedure = {
                    isNDIAHCP: this.IsNDIAorHCP(),
                    oldPackage: this.selectedProgram,
                    newPackage: packageName,
                    roster: finalRoster,
                    staffNote: {
                      personId: this.user.id,
                      program: 'VARIOUS',
                      detailDate: format(new Date,'yyyy/MM/dd'),
                      extraDetail1: radioGroup,
                      extraDetail2: 'REFERRAL-IN',
                      whoCode: this.user.code,
                      publishToApp: publishToApp ? 1 : 0,
                      creator: this.token.user,
                      note: notes || "" ,
                      alarmDate: '',
                      reminderTo: ''
                    }
                  }

                  // this.emailnotify(); 
                  // return;
                  // this.writereminder(this.user.id, notes, this.notifFollowUpGroup);
                  // return;
                  // console.log(data);
                  // this.emailnotify();
                  // return;

                this.listS.postreferralin(data).subscribe(x => {
                      this.globalS.sToast('Success', 'Package is saved'); 
                      this.handleCancel();
                    
                      if (this.globalS.followups != null){
                        this.writereminder(this.user.id, notes, this.notifFollowUpGroup);
                      }
                      
                      if (this.globalS.emailaddress != null){
                        this.emailnotify(); 
                      }
                    }
                  );
              }
              
              if(this.option == RECIPIENT_OPTION.REFER_ON){

                const 
                { 
                  referralSource,
                  referralCode,
                  referralType,
                  programChecked,
                  radioGroup,
                  notes,
                  date,
                  time,
                  timeSpent,
                  caseCategory,
                  publishToApp,
                } = this.referOnGroup.getRawValue();
                
                const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                const timeInMinutes = this.globalS.getMinutes(timeSpent)
                const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString();
                
                let program: ProcedureRoster = {
                    clientCode: this.user.code,
                    carerCode: this.token.code,                   
                    
                    serviceType: programChecked,
                    date: format(date,'yyyy/MM/dd'),
                    time: format(time,'HH:mm'),
                    
                    creator: this.token.code,
                    editer: this.token.user,
                    
                    billUnit: defaultValues.billUnit,
                    billDesc: defaultValues.billDesc,
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    referralCode: referralCode,
                    timePercent: timePercentage,
                    notes: notes || "",
                    type: defaultValues.type,
                    duration: timeInMinutes / 5,
                    blockNo: blockNoTime,
                    reasonType: referralSource,
                    
                    tabType: 'REFERRAL-OUT',
                    program: programChecked,
                    packageStatus: 'REFERRAL'
                  }

                  finalRoster.push(program);
                    
                  const data: CallReferralOutProcedure = {                  
                    roster: finalRoster,
                    note: {
                      personId: this.user.id,
                      program: programChecked,
                      detailDate: format(new Date,'yyyy/MM/dd'),
                      extraDetail1: radioGroup,
                      extraDetail2: 'REFERRAL-OUT',
                      whoCode: this.user.code,
                      publishToApp: publishToApp ? 1 : 0,
                      creator: this.token.user,
                      note: notes || "" ,
                      alarmDate: format(new Date,'yyyy/MM/dd'),
                      reminderTo: ''
                    }
                  }

                  // console.log(data);
                  // return;
                  
                  this.listS.postreferralout(data).subscribe(data => {
                    this.globalS.sToast('Success', 'Package is saved');
                  });
              }
              
              if(this.option == RECIPIENT_OPTION.NOT_PROCEED){

                const 
                { 
                  referralSource,
                  referralCode,
                  referralType,
                  packageName,
                  radioGroup,
                  notes,
                  date,
                  time,
                  timeSpent,
                  programChecked,
                  caseCategory,
                  publishToApp,
                } = this.notProceedGroup.getRawValue();
                
                const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                const timeInMinutes = this.globalS.getMinutes(timeSpent)
                const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString();
                
                let program: ProcedureRoster = {
                    clientCode: this.user.code,
                    carerCode: this.token.code,
                    
                    serviceType: referralType,
                    date: format(date,'yyyy/MM/dd'),
                    time: format(time,'HH:mm'),
                    
                    creator: this.token.code,
                    editer: this.token.user,
                    
                    billUnit: defaultValues.billUnit,
                    billDesc: defaultValues.billDesc,
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    referralCode: referralCode,
                    timePercent: timePercentage,
                    notes: notes || "",
                    type: defaultValues.type,
                    duration: timeInMinutes / 5,
                    blockNo: blockNoTime,
                    reasonType: '',
                    
                    tabType: 'NOT-PROCEED',
                    program: programChecked,
                    packageStatus: 'REFERRAL'
                  }

                  finalRoster.push(program);
                    
                  const data: CallReferralOutProcedure = {                  
                    roster: finalRoster,
                    note: {
                      personId: this.user.id,
                      program: programChecked,
                      detailDate: format(new Date,'yyyy/MM/dd'),
                      extraDetail1: radioGroup,
                      extraDetail2: 'REFERRAL-OUT',
                      whoCode: this.user.code,
                      publishToApp: publishToApp ? 1 : 0,
                      creator: this.token.user,
                      note: notes || "" ,
                      alarmDate: format(new Date,'yyyy/MM/dd'),
                      reminderTo: ''
                    }
                  }

                  this.listS.postnotproceed(data).subscribe(data => {
                    this.globalS.sToast('Success', 'Package is saved');
                  });
              }
              
              if(this.option == RECIPIENT_OPTION.ASSESS){
                
                const 
                { 
                  referralSource,
                  referralCode,
                  referralType,
                  serviceType,
                  packageName,
                  radioGroup,
                  notes,
                  date,
                  time,
                  timeSpent,
                  caseCategory,
                  programChecked,
                  publishToApp,
                } = this.assessGroup.getRawValue();
                
                const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                const timeInMinutes = this.globalS.getMinutes(timeSpent)
                const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString();
                
                let program: ProcedureRoster = {
                    clientCode: this.user.code,
                    carerCode: this.token.code,
                    
                    serviceType: serviceType,
                    date: format(date,'yyyy/MM/dd'),
                    time: format(time,'HH:mm'),
                    
                    creator: this.token.code,
                    editer: this.token.user,
                    
                    billUnit: defaultValues.billUnit,
                    billDesc: defaultValues.billDesc,
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    referralCode: referralCode,
                    timePercent: timePercentage,
                    notes: notes || "",
                    type: defaultValues.type,
                    duration: timeInMinutes / 5,
                    blockNo: blockNoTime,
                    reasonType: '',
                    
                    tabType: 'ASSESSMENT',
                    program: programChecked,
                    packageStatus: ''
                  }

                  finalRoster.push(program);
                    
                  const data: CallReferralOutProcedure = {                  
                    roster: finalRoster,
                    note: {
                      personId: this.user.id,
                      program: programChecked,
                      detailDate: format(new Date,'yyyy/MM/dd'),
                      extraDetail1: radioGroup,
                      extraDetail2: 'SCREEN/ASSESS',
                      whoCode: this.user.code,
                      publishToApp: publishToApp ? 1 : 0,
                      creator: this.token.user,
                      note: notes || "" ,
                      alarmDate: format(new Date,'yyyy/MM/dd'),
                      reminderTo: ''
                    }
                  }

                  console.log(data);
                  return;
                  
                  this.listS.postassessment(data).subscribe(data =>{
                    this.globalS.sToast('Success', 'Package is saved');
                  });
              }
              
              if(this.option == RECIPIENT_OPTION.ADMIT){  
                  
                  const { 
                    time,
                    timeSpent,
                    admissionDate,
                    notes,
                    programChecked,
                    admissionType,
                    rosterCreationDates
                  } = this.admitGroup.value; 

                  const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                  const timeInMinutes = this.globalS.getMinutes(timeSpent)
                  const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString();

                  let data = {
                      docId: this.DOCUMENTID,
                      program: programChecked.program,
                      admissionType: programChecked,
                      clientCode: this.user.code,
                      carerCode: this.token.code,
                      serviceType: 'referralType',
                      date: format(admissionDate,'yyyy/MM/dd'), 
                      time: format(time,'HH:mm'),
                      creator: this.token.code,
                      editer: this.token.user,
                      billUnit: 'HOUR',
                      agencyDefinedGroup: this.user.agencyDefinedGroup,
                      referralCode: '',
                      timePercentage: timePercentage,
                      notes: '',
                      type: 7,
                      duration: timeInMinutes / 5,
                      blockNo: blockNoTime,
                      reasonType: '',
                      tabType: 'ADMISSION',
                      timeSpent: format(timeSpent,'HH:mm'),

                      startDate: rosterCreationDates[0],
                      endDate:rosterCreationDates[1],

                      noteDetails: {
                          personId: this.user.id,
                          program: programChecked.program,
                          detailDate: admissionDate,
                          extraDetail1: 'ADMISSION',
                          extraDetail2: 'ADMISSION',
                          whoCode: this.user.code,
                          publishToApp: 0,                    
                          creator: this.token.user,
                          note: notes,
                          alarmDate: '',
                          reminderTo: ''
                      }
                  }
       
                  this.listS.postadmissionacceptquote(data).subscribe(data => {
                    this.globalS.sToast('Success', 'Data is saved');
                    this.handleCancel();
                  });
              }
              
              if(this.option == RECIPIENT_OPTION.WAIT_LIST){

                // console.log(this.waitListGroup.value)

                const 
                { 
                  referralSource,
                  referralCode,
                  referralType,
                  packageName,
                  activityCode,
                  radioGroup,
                  notes,
                  date,
                  time,
                  timeSpent,
                  programChecked,
                  caseCategory,
                  publishToApp,
                } = this.waitListGroup.getRawValue();
                
                const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                const timeInMinutes = this.globalS.getMinutes(timeSpent)
                const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString();
                
                let program: ProcedureRoster = {
                    clientCode: this.user.code,
                    carerCode: this.token.code,
                    
                    serviceType: activityCode,
                    date: format(date,'yyyy/MM/dd'),
                    time: format(time,'HH:mm'),
                    
                    creator: this.token.code,
                    editer: this.token.user,
                    
                    billUnit: defaultValues.billUnit,
                    billDesc: defaultValues.billDesc,
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    referralCode: referralCode,
                    timePercent: timePercentage,
                    notes: notes || "",
                    type: defaultValues.type,
                    duration: timeInMinutes / 5,
                    blockNo: blockNoTime,
                    reasonType: '',
                    
                    tabType: 'WAITLIST',
                    program: programChecked,
                    packageStatus: ''
                  }

                  finalRoster.push(program);
                    
                  const data: CallReferralOutProcedure = {                  
                    roster: finalRoster,
                    note: {
                      personId: this.user.id,
                      program: programChecked,
                      detailDate: format(new Date,'yyyy/MM/dd'),
                      extraDetail1: radioGroup,
                      extraDetail2: 'WAITLIST',
                      whoCode: this.user.code,
                      publishToApp: publishToApp ? 1 : 0,
                      creator: this.token.user,
                      note: notes || "" ,
                      alarmDate: format(new Date,'yyyy/MM/dd'),
                      reminderTo: ''
                    }
                  }

                  this.listS.postwaitlist(data).subscribe(data =>{
                    this.globalS.sToast('Success', 'Package is saved');
                  });
              }
              
              if(this.option == RECIPIENT_OPTION.DISCHARGE){

                console.log(this.dischargeGroup.value)

                const 
                { 
                  referralSource,
                  referralCode,
                  referralType,
                  packageName,
                  programChecked,
                  radioGroup,
                  notes,
                  date,
                  time,
                  timeSpent,
                  caseCategory,
                  publishToApp,
                } = this.dischargeGroup.getRawValue();
                
                const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                const timeInMinutes = this.globalS.getMinutes(timeSpent)
                const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString();
                
                let program: ProcedureRoster = {
                    clientCode: this.user.code,
                    carerCode: this.token.code,
                    
                    serviceType: referralType,
                    date: format(date,'yyyy/MM/dd'),
                    time: format(time,'HH:mm'),
                    
                    creator: this.token.code,
                    editer: this.token.user,
                    
                    billUnit: defaultValues.billUnit,
                    billDesc: defaultValues.billDesc,
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    referralCode: referralCode,
                    timePercent: timePercentage,
                    notes: notes || "",
                    type: defaultValues.type,
                    duration: timeInMinutes / 5,
                    blockNo: blockNoTime,
                    reasonType: '',
                    
                    tabType: 'DISCHARGE',
                    program: programChecked,
                    packageStatus: ''
                  }

                  finalRoster.push(program);
                    
                  const data: CallReferralOutProcedure = {                  
                    roster: finalRoster,
                    note: {
                      personId: this.user.id,
                      program: programChecked,
                      detailDate: format(new Date,'yyyy/MM/dd'),
                      extraDetail1: radioGroup,
                      extraDetail2: 'WAITLIST',
                      whoCode: this.user.code,
                      publishToApp: publishToApp ? 1 : 0,
                      creator: this.token.user,
                      note: notes || "" ,
                      alarmDate: format(new Date,'yyyy/MM/dd'),
                      reminderTo: ''
                    }
                  }

                  this.listS.postdischarge(data).subscribe(data =>{
                    this.globalS.sToast('Success', 'Package is saved');
                  });
              }
              
              if(this.option == RECIPIENT_OPTION.SUSPEND){
                console.log(this.suspendGroup.value)
              }
              
              if(this.option == RECIPIENT_OPTION.REINSTATE){
                console.log(this.reinstateGroup.value)


                const { 
                  referralType,
                  quantity,
                  unit,
                  radioGroup,
                  notes,
                  charge,
                  suppliedDate,
                  date,
                  programChecked,
                  referralDate,
                  refNo,
                  time,
                  timeSpent,
                  reminderDate,
                  caseCategory,
                  publishToApp,
                  reminderTo
                } = this.reinstateGroup.getRawValue()
                
                const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                const timeInMinutes = this.globalS.getMinutes(timeSpent)
                const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString()
                
                
                for(var checkProgram of checkedPrograms){
                  
                  let data: ProcedureRoster = {
                    clientCode: this.user.code,
                    carerCode: this.token.code,
                    serviceType: checkProgram.selected,
                    date: referralDate,
                    time: time,
                    
                    creator: this.token.user,
                    editer: this.token.user,
                    
                    billUnit: 'HOUR',
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    referralCode: '',
                    timePercent: timePercentage,
                    notes: notes,
                    type: 7,
                    duration: timeInMinutes / 5,
                    blockNo: blockNoTime,
                    reasonType: '',
                    program: programChecked,
                    tabType: caseCategory       
                  }
                  finalRoster.push(data);
                }
                
                let data: CallAssessmentProcedure = {
                  roster: finalRoster,
                  note: {
                    personId: this.user.id,
                    program: programChecked,
                    detailDate: reminderDate ? reminderDate : '',
                    extraDetail1: NOTE_TYPE[radioGroup],
                    extraDetail2: caseCategory,
                    whoCode: this.user.code,
                    publishToApp: publishToApp ? 1 : 0,                    
                    creator: this.token.user,
                    note: notes,
                    alarmDate: reminderDate ? reminderDate : '',
                    reminderTo: reminderTo
                  }
                }
                
                console.log(data);

                this.listS.postreinstate(data)
                    .subscribe(data => {
                      this.globalS.sToast('Success', 'Package is saved');
                    });

              }
              
              if(this.option == RECIPIENT_OPTION.DECEASE){
                console.log(this.deceaseGroup.value)

                
              }
              
              if(this.option == RECIPIENT_OPTION.ADMIN){
                
                const { 
                  referralType,
                  quantity,
                  unit,
                  radioGroup,
                  notes,
                  charge,
                  suppliedDate,
                  date,
                  referralDate,
                  refNo,
                  time,
                  timeSpent,
                  reminderDate,
                  caseCategory,
                  publishToApp,
                  reminderTo
                } = this.adminGroup.getRawValue()
                
                const blockNoTime = Math.floor(this.globalS.getMinutes(time)/5);
                const timeInMinutes = this.globalS.getMinutes(timeSpent)
                const timePercentage = (Math.floor(timeInMinutes/60 * 100) / 100).toString()
                
                
                for(var checkProgram of checkedPrograms){
                  
                  let data: ProcedureRoster = {
                    clientCode: this.user.code,
                    carerCode: this.token.code,
                    serviceType: checkProgram.selected,
                    date: referralDate,
                    time: time,
                    
                    creator: this.token.user,
                    editer: this.token.user,
                    
                    billUnit: 'HOUR',
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    referralCode: '',
                    timePercent: timePercentage,
                    notes: notes,
                    type: 7,
                    duration: timeInMinutes / 5,
                    blockNo: blockNoTime,
                    reasonType: '',
                    program: checkProgram.program,
                    tabType: caseCategory       
                  }
                  finalRoster.push(data);
                }
                
                let data: CallAssessmentProcedure = {
                  roster: finalRoster,
                  note: {
                    personId: this.user.id,
                    program: this.globalS.isVarious(this.checkedPrograms),
                    detailDate: reminderDate ? reminderDate : '',
                    extraDetail1: NOTE_TYPE[radioGroup],
                    extraDetail2: caseCategory,
                    whoCode: this.user.code,
                    publishToApp: publishToApp ? 1 : 0,                    
                    creator: this.token.user,
                    note: notes,
                    alarmDate: reminderDate ? reminderDate : '',
                    reminderTo: reminderTo
                  }
                }
                
                console.log(data);

                this.listS.postadministration(data)
                    .subscribe(data => {
                      this.globalS.sToast('Success', 'Package is saved');
                    });
              }
              
              if(this.option == RECIPIENT_OPTION.ITEM){
                
                const { 
                  referralType,
                  quantity,
                  unit,
                  radioGroup,
                  notes,
                  charge,
                  suppliedDate,
                  date,
                  refNo,
                  reminderDate,
                  caseCategory,
                  publishToApp,
                  programChecked,
                  reminderTo
                } = this.itemGroup.getRawValue()
                
                for(var checkProgram of checkedPrograms){
                  let data: ProcedureRoster = {
                    
                    clientCode: this.user.code,
                    carerCode: this.token.code,
                    serviceType: referralType,
                    date: date,
                    
                    // NO TIME IN ITEM
                    time: '00:00',
                    
                    creator: this.token.user,
                    editer: this.token.user,
                    
                    billUnit: 'SERVICE',
                    agencyDefinedGroup: this.user.agencyDefinedGroup,
                    
                    referralCode: '',
                    
                    timePercent: quantity.toString(),
                    costUnit: unit,
                    
                    notes: `${caseCategory}-${notes}`,
                    billDesc: `${notes}`,
                    unitBillRate: charge,
                    
                    // type 14 in item
                    type: 14, 
                    
                    duration: 0,
                    
                    //item 0 in item
                    blockNo: 0, 
                    
                    apiInvoiceDate: suppliedDate  ? suppliedDate : '',
                    apiInvoiceNumber: refNo,
                    
                    reasonType: '',
                    program: programChecked,
                    tabType: 'ITEM'
                  }
                  finalRoster.push(data);
                }
                
                let data: CallAssessmentProcedure = {
                  roster: finalRoster,
                  note: {
                    personId: this.user.id,
                    program: programChecked,
                    detailDate: reminderDate ? reminderDate : '',
                    extraDetail1: NOTE_TYPE[radioGroup],
                    extraDetail2: caseCategory,
                    whoCode: this.user.code,
                    publishToApp: publishToApp ? 1 : 0,                    
                    creator: this.token.user,
                    note: notes,
                    alarmDate: reminderDate ? reminderDate : '',
                    reminderTo: reminderTo
                  }
                }
                
                this.listS.postitem(data).subscribe(data => {
                  this.globalS.sToast('Success','Item Added');
                });
                
              }           
            }        
            
            populate(){
              
              this.whatOptionVar = {};
              this.loadPrograms = true;
  
              switch(this.option){
                case RECIPIENT_OPTION.REFER_IN:
               
                break;
                case RECIPIENT_OPTION.REFER_ON:
                this.listS.getlist(`SELECT DISTINCT UPPER(rp.[Program]) AS Program, hr.[type] FROM RecipientPrograms rp INNER JOIN HumanResourceTypes hr ON hr.NAME = rp.program WHERE rp.PersonID = '${this.user.id}' AND ProgramStatus = 'REFERRAL' AND isnull([Program], '') <> ''                 `)
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
                this.listS.getlist(`SELECT DISTINCT UPPER(rp.[Program]) AS Program, hr.[type] FROM RecipientPrograms rp INNER JOIN HumanResourceTypes hr ON hr.NAME = rp.program WHERE rp.PersonID = '${this.user.id}' AND ProgramStatus = 'REFERRAL' AND isnull([Program], '') <> ''                 `)
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
                this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program FROM RecipientPrograms WHERE PersonID = '${ this.user.id }' AND ProgramStatus = 'REFERRAL' AND isnull([Program], '') <> ''`)
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
                this.listS.getlist(`SELECT DISTINCT UPPER( [Service Type] + ' (Pgm): ' + [ServiceProgram]) AS Program FROM  ServiceOverview SO INNER JOIN RecipientPrograms RP ON RP.PersonID = SO.PersonID WHERE  SO.PersonID = '${ this.user.id }' AND  (ProgramStatus IN  ('ACTIVE', 'WAITING LIST') AND ServiceStatus IN ('ACTIVE', 'WAIT LIST'))  AND isnull([Program], '') <> ''`)
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
                
                if(this.from.display == 'admit')
                {
                  this.listS.getadmitprograms(this.user.id).subscribe(data => {
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
                  });
                }

                if(this.from.display == 'quote')
                {
                  this.whatOptionVar = {
                    title: 'Admission Wizard',
                    wizardTitle: '',
                    programsArr: [{ 
                      program: this.program, 
                      status: false
                     }]
                  }
                  
                  this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.ADMIT);
                  this.changeDetection();
                }
                
                this.timeSteps = timeSteps;
                

                this.listS.getrosterpublishdate().subscribe(data => [
                  this.admitGroup.patchValue({
                    rosterCreationDates: [new Date(defaultDate), new Date(data.date)]
                  })
                ]);

                break;
                case RECIPIENT_OPTION.DISCHARGE:
                this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program, HumanResourceTypes.[Type] AS Type FROM RecipientPrograms LEFT JOIN HumanResourceTypes ON RecipientPrograms.Program = HumanResourceTypes.Name WHERE PersonID = '${this.user.id}' AND ProgramStatus IN ('ACTIVE', 'WAITING LIST') AND isnull([Program], '') <> '' AND ISNULL([UserYesNo3], 0) <> 1 AND ISNULL([User2], '') <> 'Contingency' `)
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
                this.listS.getlist(`SELECT DISTINCT '[' + CASE WHEN ([serviceprogram] <> '') AND ([serviceprogram] IS NOT NULL) THEN [serviceprogram] ELSE '?' END + '] ~> ' + [service type] AS Program FROM serviceoverview INNER JOIN recipientprograms ON serviceoverview.personid = recipientprograms.personid WHERE serviceoverview.personid = '${ this.user.id }' AND programstatus = 'ACTIVE' AND servicestatus = 'ACTIVE'`)
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
                WHERE  personid = '${this.user.id }' 
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
                this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program FROM RecipientPrograms WHERE PersonID = '${ this.user.id }'AND ProgramStatus <> 'INACTIVE' AND isnull([Program], '') <> '' `)
                .subscribe(data => {
                  this.whatOptionVar = {
                    title: 'Admin Registration Wizard',
                    wizardTitle: '',
                    programsArr: data.map(x => {
                      return {
                        program: x.program,
                        checked: false,
                        selected: ''
                      }
                    })
                  }
                  
                  this.formProgramArray(this.whatOptionVar, RECIPIENT_OPTION.ADMIN);
                  this.changeDetection();
                })
                
                this.listS.getfollowups({
                  branch: this.BRANCH_NAME,
                  fundingType: this.FUNDING_TYPE
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
                })
                
                
                this.listS.getdocumentslist(
                  {
                    branch: this.BRANCH_NAME,
                    fundingType: this.FUNDING_TYPE
                  }
                ).pipe(takeUntil(this.destroy$)).subscribe(data => {
                  this.notifDocumentsGroup = data.map(x => {
                    return {
                      label: x,
                      value: x,
                      disabled: false,
                      checked: false
                    }
                  })
                })
                
                this.listS.getdatalist({
                  branch: this.BRANCH_NAME,
                  fundingType: this.FUNDING_TYPE
                }).pipe(takeUntil(this.destroy$)).subscribe(data =>  {
                  this.datalist = data
                });          
                break;
                case RECIPIENT_OPTION.ITEM:
                this.listS.getlist(`SELECT DISTINCT UPPER([Program]) AS Program FROM RecipientPrograms WHERE PersonID = '${ this.user.id }'AND ProgramStatus <> 'INACTIVE' AND isnull([Program], '') <> '' `)
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

            aaa(data){
              console.log(data)
            }
            
            GETREFERRAL_LIST(){
              if(this.option == RECIPIENT_OPTION.ITEM){
                console.log('item');
              }
            }

            GET_FUNDINGTYPE(){
              
              this.globalFormGroup.get('programChecked')
                  .valueChanges
                  .pipe(
                    distinctUntilChanged(),
                    switchMap(x => {
                      return this.listS.getspecifictype(x)
                    })
                  )
                  .subscribe(d => {
                    this.FUNDING_TYPE = d;
                  })
            }
            
            formProgramArray(data: any, type: RECIPIENT_OPTION){
              
              this.loadPrograms = false;
              
              if(type == RECIPIENT_OPTION.ITEM){
                var prog = this.itemGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.itemGroup;
                
                this.noteArray = ['ITEM'];
                this.GET_FUNDINGTYPE()
                return;
              }
              
              if(type == RECIPIENT_OPTION.ADMIN){
                var prog = this.adminGroup.get('programs') as FormArray;      
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.adminGroup;
                this.GET_FUNDINGTYPE()
              }
              if(type == RECIPIENT_OPTION.ADMIT){
                var prog = this.admitGroup.get('programs') as FormArray;      
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.admitGroup;

                if((this.admitGroup.get('programs').value as Array<any>).length == 1){
                  let programs = (<FormArray>this.admitGroup.controls['programs']).at(0);
                  this.admitGroup.patchValue({
                    programChecked: programs.value.program
                  });
                }

                this.GET_FUNDINGTYPE();
              }
              if(type == RECIPIENT_OPTION.DECEASE){
                var prog = this.deceaseGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.deceaseGroup;
                this.GET_FUNDINGTYPE()
              }
              
              if(type == RECIPIENT_OPTION.SUSPEND){
                var prog = this.suspendGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.suspendGroup;

                // if((this.suspendGroup.get('programs').value as Array<any>).length == 1){
                //   let programs = (<FormArray>this.suspendGroup.controls['programs']).at(0);
                //   this.suspendGroup.patchValue({
                //     programChecked: programs.value.program
                //   });
                // }

                this.GET_FUNDINGTYPE()
              }
              
              if(type == RECIPIENT_OPTION.DISCHARGE){
                var prog = this.dischargeGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.dischargeGroup;

                // if((this.dischargeGroup.get('programs').value as Array<any>).length == 1){
                //   let programs = (<FormArray>this.dischargeGroup.controls['programs']).at(0);
                //   this.dischargeGroup.patchValue({
                //     programChecked: programs.value.program
                //   });
                // }
                
                this.noteArray = ['DISCHARGE'];
                this.GET_FUNDINGTYPE()
                return;
              }
              
              if(type == RECIPIENT_OPTION.WAIT_LIST){
                var prog = this.waitListGroup.get('programs') as FormArray;

                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.waitListGroup;
                this.GET_FUNDINGTYPE()
              }              
                     
              if(type == RECIPIENT_OPTION.ASSESS){
                var prog = this.assessGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.assessGroup;

                // if((this.assessGroup.get('programs').value as Array<any>).length == 1){
                //   let programs = (<FormArray>this.assessGroup.controls['programs']).at(0);
                //   this.assessGroup.patchValue({
                //     programChecked: programs.value.program
                //   });
                // }

                this.noteArray = ['SCREEN/ASSESS'];
                this.GET_FUNDINGTYPE()
                return;
              }
              
              if(type == RECIPIENT_OPTION.NOT_PROCEED){
                var prog = this.notProceedGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.notProceedGroup;

                // if((this.notProceedGroup.get('programs').value as Array<any>).length == 1){
                //   let programs = (<FormArray>this.notProceedGroup.controls['programs']).at(0);
                //   this.notProceedGroup.patchValue({
                //     programChecked: programs.value.program
                //   });
                // }

                this.GET_FUNDINGTYPE()
              }
              
              if(type == RECIPIENT_OPTION.REFER_ON){
                var prog = this.referOnGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.referOnGroup;
                

                // if((this.referOnGroup.get('programs').value as Array<any>).length == 1){
                //   let programs = (<FormArray>this.referOnGroup.controls['programs']).at(0);
                //   this.referOnGroup.patchValue({
                //     programChecked: programs.value.program
                //   });
                // }

                this.noteArray = ['REFERRAL-OUT'];
                this.GET_FUNDINGTYPE()
                return;
              }
              
              if(type == RECIPIENT_OPTION.REFER_IN){
                var prog = this.referInGroup.get('programs') as FormArray;
                data.programsArr.map(x => prog.push(this.createProgramForm(x)));
                this.globalFormGroup = this.referInGroup;
                
                
                this.noteArray = ['REFERRAL-IN'];
                return;
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
                  type: new FormControl(data.type),
                  selected: new FormControl(data.selected)
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
                  if(this.current < 7){
                    this.current += 1;
                  }
                }
                
                if(this.waitListOpen){
                  if(this.current < 7){
                    this.current += 1;
                  }
                }
                
                if(this.admitOpen){
                  if(this.current < 8){
                    this.current += 1;
                  }
                }
                
                if(this.assessOpen){
                  if(this.current < 7){
                    this.current += 1;
                  }
                }
                
                if(this.notProceedOpen){
                  if(this.current < 7){
                    this.current += 1;
                  }
                }
                
                if(this.referInOpen){
                  if(this.current < 9){
                    this.current += 1;
                  }
                }
                
                if(this.referOnOpen){
                  if(this.current < 7){
                    this.current += 1;
                  }
                }                
                
                if(this.suspendOpen){
                  if(this.current < 7){
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
                
                // this.checkedPrograms = this.GET_CHECKEDPROGRAMS();
              }

              populateNotificationDetails(){
                this.listS.getnotifications({
                  branch: this.BRANCH_NAME,
                  coordinator: this.COORDINATOR
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
                  branch: this.BRANCH_NAME,
                  fundingType: this.FUNDING_TYPE,
                  type: 'REF_DEFAULT_REMINDERS'
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
                  branch: this.BRANCH_NAME,
                  fundingType: this.FUNDING_TYPE,
                  type: 'REF_DEFAULT_DOCS',
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
                  branch: this.BRANCH_NAME,
                  fundingType: this.FUNDING_TYPE,
                  type: 'REF_DEFAULT_XTRADATA'
                }).pipe(takeUntil(this.destroy$)).subscribe(data =>  {
                  this.datalist = data;
                  this.changeDetection();
                }); 

              }
              
              GET_PRIMARY_ADDRESS(){
                this.listS.getprimaryphoneaddress({
                  PersonId: this.user.id,
                  Type: this.GET_FUNDING_TITLE()
                }).subscribe(data =>{                  
                    this.PATCH_NOTES(data);
                });
              }

              populateOtherDetails(){

                  this.GET_PRIMARY_ADDRESS();

                  if(this.option == RECIPIENT_OPTION.REFER_IN)
                  { 

                    this.listS.getspecificemailmanager(this.COORDINATOR)
                        .subscribe(data => {
                          this.EMAIL_OF_COORDINATOR = data;
                        });

                    this.populateNotificationDetails();
                    this.referralCode$ = this.listS.getwizardreferralcode();
                    
                    if(this.referInGroup.get('type').value == 1){
                      this.referralSource$ = of(['NDIA']);
                      this.referInGroup.patchValue({
                        referralSource: 'NDIA'
                      });       
                    }
                    
                    if(this.referInGroup.get('type').value == 2 || this.referInGroup.get('type').value == 3){
                      this.referralSource$ = of(['My Aged Care Gateway']);
                      this.referInGroup.patchValue({
                        referralSource: 'My Aged Care Gateway'
                      });
                    }   
                    
                    if(this.referInGroup.get('type').value == 4){
                      this.referralSource$ = of(['OTHER']);
                      this.referInGroup.patchValue({
                        referralSource: 'OTHER'
                      });
                    }
                    
                    this.referralType$ = this.listS.getreferraltype_latest(this.FUNDING_TYPE)
                    .pipe(
                      switchMap(x => {
                        if(x.length == 1){
                          this.referInGroup.patchValue({
                            referralType: x[0]
                          });
                        }
                        return of(x);
                      })
                      );
                      return;
                  }
                  
                  if(this.option == RECIPIENT_OPTION.REFER_ON)
                  {
                    this.populateNotificationDetails();
                    this.referralSource$ = this.listS.getwizardreferralsource('default');
                    
                    this.checkedPrograms = this.GET_CHECKEDPROGRAMS();
                    
                    var haccList: Array<any> = this.checkedPrograms.filter(x => x.type == 'HACC');
                    if(haccList && haccList.length > 0) 
                    this.referralSource$ = this.listS.getwizardreferralsource('HACC');
                    
                    var decList: Array<any> = this.checkedPrograms.filter(x => x.type == 'DEX');
                    if(decList && decList.length > 0)   
                    this.referralSource$ = this.listS.getwizardreferralsource('DEX');
                    
                    this.referralCode$ = this.listS.getwizardreferralcode();
                  }

                  if(this.option == RECIPIENT_OPTION.ASSESS){
                    this.populateNotificationDetails();
                  }

                  if(this.option == RECIPIENT_OPTION.ADMIN){
                    this.populateNotificationDetails();
                  }    

                  if(this.option == RECIPIENT_OPTION.WAIT_LIST)
                  {
                    this.reasons$ = this.listS.getwaitlist();
                  }
                  
                  if(this.option == RECIPIENT_OPTION.DECEASE)
                  {
                    this.populateNotificationDetails();
                    this.reasons$ = this.listS.getreasons();
                  }
                  
                  if(this.option == RECIPIENT_OPTION.SUSPEND)
                  {
                    this.populateNotificationDetails();
                    this.cancellationCode$ = this.listS.getlist(`SELECT title FROM itemtypes WHERE ( enddate IS NULL OR enddate >= '${ this.CURRENT_DATE.toISOString() }' ) AND rostergroup = 'RECPTABSENCE' AND status = 'ATTRIBUTABLE' AND processclassification = 'EVENT' ORDER BY title`)
                  }
                  
                  if(this.option == RECIPIENT_OPTION.DISCHARGE)
                  {
                    this.populateNotificationDetails();
                    this.dischargeReason$ = this.listS.getlist(`SELECT DISTINCT Description, HACCCode, RecordNumber FROM DataDomains WHERE Domain = 'REASONCESSSERVICE'`);
                  }
                  
                  if(this.option == RECIPIENT_OPTION.ITEM)
                  {
                    this.populateNotificationDetails();
                    let _input = {
                      program: '',
                      option: this.option
                    }
                    this.itemTypes$ = this.sqlWiz.GETREFERRALTYPE_V2(_input);
                  }

                  if(this.option == RECIPIENT_OPTION.ADMIT){

                    this.populateNotificationDetails();

                    this.listS.getnotifications({
                      branch: this.BRANCH_NAME,
                      coordinator: this.COORDINATOR
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
                      branch: this.BRANCH_NAME,
                      fundingType: this.FUNDING_TYPE,
                      type: 'ADMIT_DEFAULT_REMINDERS'
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
                      branch: this.BRANCH_NAME,
                      fundingType: this.FUNDING_TYPE,
                      type: 'ADMIT_DEFAULT_DOCS',
                    }).pipe(takeUntil(this.destroy$)).subscribe(data => {
                      this.notifDocumentsGroup = data.map(x => {
                        return {
                          label: x,
                          value: x,
                          disabled: false,
                          checked: false
                        }
                      });
                      this.changeDetection();
                    });
  
                    this.listS.getdatalist({
                      branch: this.BRANCH_NAME,
                      fundingType: this.FUNDING_TYPE,
                      type: 'ADMIT_DEFAULT_XTRADATA'
                    }).pipe(takeUntil(this.destroy$)).subscribe(data =>  {
                      this.datalist = data;
                      this.changeDetection();
                    }); 
                  }

                  if(this.option == RECIPIENT_OPTION.NOT_PROCEED){
                    this.populateNotificationDetails();
                  }
                  
                  this.checkedPrograms = this.GET_CHECKEDPROGRAMS();
                }
                
                
                GET_CHECKEDPROGRAMS(){
                  var programs: Array<any> = this.globalFormGroup.get('programs').value || [];
                  if(programs.length == 0)  return [];
                  let checked = programs.filter(x => x.checked);
                  
                  return checked;
                }
                
                get canGoNext(): boolean {

                  if(this.option == RECIPIENT_OPTION.REFER_IN){
                    if(this.FUNDING_TYPE == 'NDIA' && this.selectedProgram && !this.isPackageNameAvailable){
                      return true;
                    }

                    if(this.FUNDING_TYPE == 'DOHA' && this.selectedProgram && !this.isPackageNameAvailable){
                      return true;
                    }

                    if(this.FUNDING_TYPE == 'DSS' && this.selectedProgram){
                        return true;
                    }

                    if(this.selectedProgram){
                        return true;
                    }
                  }

                  if(this.option == RECIPIENT_OPTION.ADMIT && this.admitGroup.get('programChecked').value){
                    return true;
                  }

                  if(this.option == RECIPIENT_OPTION.DECEASE){
                    return true;
                }

                  if(this.option == RECIPIENT_OPTION.WAIT_LIST && this.waitListGroup.get('programChecked').value){
                      return true;
                  }

                  if(this.option == RECIPIENT_OPTION.REFER_ON && this.referOnGroup.get('programChecked').value){
                    if(this.current == 1 && this.globalS.isEmpty(this.referOnGroup.get('referralType').value)){
                      return false;
                    }
                    return true;
                  }

                  if(this.option == RECIPIENT_OPTION.NOT_PROCEED && this.notProceedGroup.get('programChecked').value){
                    if(this.current == 1 && this.globalS.isEmpty(this.notProceedGroup.get('referralType').value)){
                      return false;
                    }
                    return true;
                  }

                  if(this.option == RECIPIENT_OPTION.ASSESS && this.assessGroup.get('programChecked').value){
                    if(this.current == 1 && this.globalS.isEmpty(this.assessGroup.get('serviceType').value)){
                      return false;
                    }
                    return true;
                  }

                  if(this.option == RECIPIENT_OPTION.DISCHARGE && this.dischargeGroup.get('programChecked').value){
                    return true;
                  }

                  if(this.option == RECIPIENT_OPTION.SUSPEND && this.suspendGroup.get('programChecked').value){
                    return true;
                  }

                  if(this.option == RECIPIENT_OPTION.ITEM && this.itemGroup.get('programChecked').value){
                    return true;
                  }


                  return false;
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
                  
                  this.referdocument = false;
                  this.referIndocument = false;
                  //  this.option = null
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
                  
                  this.referdocument = false;
                  
                  this.changeDetection();
                  
                  
                }
                
                handleOk() {
                  this.referdocument = false;
                }
                
                haha(data: any){
                  console.log(data);
                }
                
                onChange(data: any){
                  
                }
                handleChange({ file, fileList }: UploadChangeParam): void {
                  const status = file.status;
                  if (status !== 'uploading') {
                    // console.log(file, fileList);
                  }
                  if (status === 'done') {
                    this.globalS.sToast('Success', `${file.name} file uploaded successfully.`);
                    
                    
                  } else if (status === 'error') {
                    this.globalS.sToast('Success', `${file.name} file upload failed.`);
                    
                  }
                }

                emailnotify(){              
              
                  const { notes } = this.referInGroup.value;

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

                addRefdoc(){
                  //console.log(this.globalS.doc.toString());
                  /*if (this.globalS.doc.toString() != null){ 
                    console.log(this.globalS.doc.toString());                 
                    this.referdocument = true;
                  } */
                  
                  //this.referdocument = true;
                  this.referIndocument = true;
                  
                  
                  
                } 
                customReq = () => {
                  //console.log(this.globalS.doc.label)
                  
                  console.log(this.file);
                  //  this.referdocument = false;
                  const formData = new FormData();
                  
                  //const { program, discipline, careDomain, classification, category, reminderDate, publishToApp, reminderText, notes  } = this.incidentForm.value;
                  
                  formData.append('file', this.file as any);
                  /*formData.append('data', JSON.stringify({
                    PersonID: this.innerValue.id,
                    DocPath: this.token.recipientDocFolder,
                    
                    Program: program,
                    Discipline: discipline,
                    CareDomain: careDomain,
                    Classification: classification,
                    Category: category,
                    ReminderDate: reminderDate,
                    PublishToApp: publishToApp,
                    ReminderText: reminderText,
                    Notes: notes,
                    SubId: this.innerValue.incidentId
                  })) */
                  
                  const req = new HttpRequest('POST', this.urlPath, formData, {
                    reportProgress: true,
                    withCredentials: true
                  });
                  
                  var id = this.globalS.loadingMessage(`Uploading file ${this.file.name}`)
                  this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
                    (event: HttpEvent<any>) => {
                      this.msg.remove(id);
                      this.globalS.sToast('Success','Document uploaded');
                    },
                    err => {
                      console.log(err);
                      this.msg.error(`${this.file.name} file upload failed.`);
                      this.msg.remove(id);
                    }
                    );
                    
                  }; 
                  
                  doc(data:any){
                    
                    var temp = data.find(x => x.checked === true)
                    this.globalS.doc = temp.label.toString();
                    
                  }
                  notif(data: any){  
                    var temp1 = data.find(x => x.checked === true)
                    this.listS.getnotifyaddresses(temp1.label).subscribe(x => this.globalS.emailaddress = x)  
                  }
                  
                  followup(data: any){
                    var temp
                    temp = data.find(x => x.checked === true)
                    this.globalS.followups = temp
                  } 
    }
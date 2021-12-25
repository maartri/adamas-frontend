import { Component } from "@angular/core";

import { NzModalService } from 'ng-zorro-antd/modal';
import { OnInit, OnDestroy, AfterViewInit,ChangeDetectorRef } from "@angular/core";
import { takeUntil } from 'rxjs/operators';
import { Router,ActivatedRoute, ParamMap } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormControlName, } from '@angular/forms';
import { parseJSON } from "date-fns";
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ReportService,ListService,MenuService,PrintService } from '@services/index';
import { concat, flatMapDeep, indexOf, size } from "lodash";
import eachDayOfInterval from "date-fns/esm/eachDayOfInterval/index";



const inputFormDefault = {
  
  
  btnid:[''],
  content:  [''],
  one:[[]],
  list: [[]],
  entity:[[]],
  condition:[[]],
  value:[[]],
  Endvalue:[[]],
  frm_SecondValue : false,
  frm_SecondVal : false,
  // = ['title','ASAD','key']
  //  data : Array<any> = [{'title':'ASAD','key':'00'},{'title':'ASAD','key':'01'},{'title':'ASAD','key':'02'}]
  exportitemsArr:[[]],
  functionsArr:  [["EQUALS", "BETWEEN", "LESS THAN", "GREATER THAN", "NOT EQUAL TO", "IS NOTHING", "IS ANYTHING", "IS TRUE", "IS FALSE"]],
  titleArr : [[]],
  Filterheck : true,
  //Arr: [[]],
  Arr: [''],
  valArr:[''],
  RptTitle :[''],
  //valArr:[[]],
  data: [[]],
  activeonly:[false],
  incl_internalCostclient: [false],
  radiofiletr:['meet'],
  datarow: [[]],  

  drawerVisible:  false,
  
  isVisibleprompt : false,
  rptfieldname:0,
  RptFormat: [''],
  
  
}

@Component({
  host: {

  },
  styles: [`
  .spinner{
    margin:1rem auto;
    width:1px;
}
  .item-right{
    text-align: right;
    align-content: right;
    float:right;
    }
    .btn{
      margin : 10px;
      padding: 2px;
         
  }
    .item-left{
    text-align: left;
    align-content: left;
    float:left;
    }
    .item-center{
        align-content: center;
        text-align: center;
         vertical-align: center;
            
    }
    .colwidth{
      width: 200px;
    }
    .colwidthentity{
      width: 300px;
    }
    nz-layout{
      height: fit-content;
    }
    nz-select{
      width:100%;
  }
  .list_frame{
    border: 1px solid black; 
    margin: 5px;
    height: 200px;
    overflow-y: scroll;
  }
  .criteria{
    border: 1px solid black; 
    margin: 5px;
    height: 100px;
    overflow-y: scroll;
  }
  .list_frame td{
    width: 150px;
  }
  .margin{
    margin-left: 20px;
  }
  .tree_frame{
    height: 100vh;
    overflow-y: scroll;
  }
  .form-group label{
    font-weight: bold;
}
nz-layout[_ngcontent-dhj-c382] {
  background: #85B9D5;
  height: 109vh;
}
  
    `],

  templateUrl: './user-reports.html'
})

export class UserReports implements OnInit, OnDestroy, AfterViewInit {
  frm_nodelist: boolean = true;
  frm_SecondValue :  boolean;
  frm_SecondVal :  boolean;
  frm_delete : boolean = false;
  inputForm: FormGroup;
  btnid: string;
  content: string;
  one: Array<any>;
  list: Array<any>;
  entity:Array<any>;
  datarow:Array<any>;
  condition:Array<any>;
  value:Array<any>;
  titleArr :Array<any>;
  Filterheck : boolean;
  Endvalue :Array<any>; // = ['title','ASAD','key']
  //data : Array<any> ;= [{'title':'ASAD','key':'00'},{'title':'ASAD','key':'01'},{'title':'ASAD','key':'02'}]
  exportitemsArr: Array<any>;
  functionsArr: Array<any> = ["EQUALS", "BETWEEN", "LESS THAN", "GREATER THAN", "NOT EQUAL TO", "IS NOTHING", "IS ANYTHING", "IS TRUE", "IS FALSE"];
 // Arr: Array<any>;
 // valArr: Array<any>;
  nodes: Array<any>;

 
  Arr: string;
  valArr:string;
  RptTitle : string;

  ReportPreview :boolean;
  
  data: Array<any>;
  activeonly: boolean;
  incl_internalCostclient: boolean;

  StrType:string;

    id: string;
    tryDoctype: any;
    pdfTitle: string;
    drawerVisible: boolean ;
    loading: boolean =  false;
    isVisibleprompt ;
    reportid: string;
    rpthttp : string = 'https://www.mark3nidad.com:5488/api/report';
    tocken :any;
    radiofilter:any;
    rptfieldname:number ;

     sql: string;
     Saverptsql : string;     
     sqlselect: string;
     sqlcondition: string;
     Savesqlcondition :string;
     sqlorder: string;
     ConditionEntity: string;
     FieldsNo: number;
     includeConatctWhere:string;
     includeGoalcareWhere:string;
     includeReminderWhere:string;
     includeUserGroupWhere:string;
     includePrefrencesWhere:string;
     includeIncludSWhere:string;  
     includeExcludeSWhere:string;
     includeRecipientPensionWhere:string;
     includeLoanitemWhere :string;
     includeSvnDetailNotesWhere :string;
     includeSvcSpecCompetencyWhere :string;
     includeOPHistoryWhere :string;
     includeClinicHistoryWhere :string;
     includeRecipientCompetencyWhere :string;
     includeCareplanWhere :string;
     includeHRCaseStaffWhere :string;

     //bodystyle:object;
     RptFormat :string ;

    
IncludeFundingSource: boolean;  IncludeProgram: boolean;  IncludeStaffAttributes: boolean;  IncludePensions: boolean;  IncludeExcluded: boolean; IncludeIncluded: boolean;  IncludePreferences : boolean;
IncludeGoals: boolean;  IncludeLoanItems: boolean;  IncludeContacts: boolean;  IncludeConsents : boolean; IncludeDocuments : boolean; IncludeUserGroups : boolean; IncludeReminders : boolean; IncludeStaffReminders : boolean; IncludeLeaves: boolean;
IncludeCaseStaff: boolean;  IncludeCarePlans : boolean; IncludeServiceCompetencies : boolean; includeStaffIncidents : boolean; includeRecipIncidents : boolean; IncludeStaffUserGroups : boolean; IncludeStaffPreferences
IncludeNursingDiagnosis: boolean;  IncludeMedicalDiagnosis : boolean; IncludeMedicalProcedure : boolean; IncludeAgreedServices : boolean; IncludePlacements: boolean;  IncludeCaseNotes : boolean;
IncludeRecipientOPNotes: boolean;  IncludeRecipientClinicalNotes: boolean;  IncludeStaffOPNotes : boolean; IncludeStaffHRNotes : boolean; IncludeONI : boolean; IncludeONIMainIssues : boolean;
IncludeONIOtherIssues : boolean; IncludeONICurrentServices: boolean;  IncludeONIActionPlan : boolean; IncludeONIMedications : boolean; IncludeONIHealthConditions : boolean; IncludeStaffPosition : boolean;
IncludeDEX : boolean; IncludeCarerInfo : boolean; IncludeHACC : boolean; IncludeRecipBranches : boolean; includeHRRecipAttribute: boolean;  IncludeRecipCompetencies : boolean; IncludeStaffLoanItems : boolean;  IncludeCarePlan : boolean; IncludeGoalsAndStrategies : boolean; IncludeMentalHealth: boolean;


    


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService,
    private GlobalS:GlobalService,
    private ReportS:ReportService,
    private ListS:ListService,
    private MenuS:MenuService,
    private printS: PrintService,
    private router: Router,
    private cd: ChangeDetectorRef,
    
    
  ) {

  }
  //private unsubscribe: Subject<void> = new Subject();
  ngOnInit(): void {    
    this.inputForm = this.fb.group(inputFormDefault);    
    this.tocken = this.GlobalS.pickedMember ? this.GlobalS.GETPICKEDMEMBERDATA(this.GlobalS.GETPICKEDMEMBERDATA):this.GlobalS.decode();
    this.RptFormat = this.GlobalS.var2.toString();

  //  console.log(this.tocken)
  if(this.RptFormat == "AGENCYSTFLIST" || this.RptFormat == "USERSTFLIST"){

this.nodes = [
      { title: 'Name and Address', key: '056' },
      { title: 'Contacts & Next of Kin', key: '005' },
      { title: 'User Groups', key: '011' },
      { title: 'Prefrences', key: '012' },
      { title: 'Loan Items', key: '035' },
      { title: 'Reminders', key: '010' },
      
      { title: 'Skills and Qualifications', key: '046' },      
      { title: 'Leaves', key: '047' },
      { title: 'General Info', key: '048' },
      { title: 'Staff Attributes', key: '049' },
      { title: 'Staff HR Notes', key: '050' },
      { title: 'Staff OP Notes', key: '051' },
      { title: 'Staff Incidents', key: '052' },      
      { title: 'Work Hours', key: '053' },
      { title: 'Staff Position', key: '054' },
      { title: 'Service Information Fields', key: '055' },

]

  }else{
    this.nodes = [
      { title: 'Name and Address', key: '000' },
      { title: 'General Demographics', key: '001' },
      { title: 'Admin Information', key: '002' },
      { title: 'Staff', key: '003' },
      { title: 'Other Genral', key: '004' },
      { title: 'Contacts & Next of Kin', key: '005' },
      { title: 'Carer Info', key: '006' },
      { title: 'Documents', key: '007' },
      { title: 'Consents', key: '008' },
      { title: 'Goals of Care', key: '009' },
      { title: 'Reminders', key: '010' },
      { title: 'User Groups', key: '011' },
      { title: 'Prefrences', key: '012' },
      { title: 'Fixed Review Dates', key: '013' },
      { title: 'Staffing Inclusion/Exclusion', key: '014' },
      { title: 'Agreed Funding Information', key: '015' },
      { title: 'Legacy Care Plan', key: '016' },
      { title: 'Agreed Service Information', key: '017' },
      { title: 'Clinical Information', key: '018' },
      { title: 'Billing Information', key: '019' },
      { title: 'Time Logging ', key: '020' },
      { title: 'Notes', key: '21' },
      { title: 'Insurance and Pension', key: '022' },
      { title: 'HACCS Dataset Fields', key: '023' },
      { title: 'DEX', key: '24' },
      { title: 'CSTDA Dataset Fields', key: '025' },
      { title: 'NRCP Dataset Fields', key: '026' },
      { title: 'ONI Core', key: '027' },
      { title: 'ONI-Functional Profile', key: '028' },
      { title: 'ONI-Living Arrangements Profile', key: '029' },
      { title: 'ONI-Health Conditions Profile', key: '030' },
      { title: 'ONI-Psychosocial Profile', key: '031' },
      { title: 'ONI-Health Behaviours Profile', key: '032' },
      { title: 'ONI-Carer Profile', key: '033' },
      { title: 'ONI-Cultural Profile', key: '034' },
      { title: 'Loan Items', key: '035' },
      { title: 'Service Information Fields', key: '036' },
      { title: 'Service Specific Competencies', key: '037' },
      { title: 'Recipient OP Notes', key: '038' },
      { title: 'Recipient Clinical Notes', key: '039' },
      { title: 'Recipient Incidents', key: '040' },
      { title: 'Recipient Competencies', key: '041' },
      { title: 'Care Plan', key: '042' },
      { title: 'Mental Health', key: '043' },
      { title: 'Recipient Placements', key: '044' },
      { title: 'Quote Goals and Stratagies', key: '045' },
    ];
  }
    
    
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {

  }

  ContentSetter(ekey) {
  //  console.log(ekey + " Content setter ")

    var temp = (ekey.toString()).slice(-2)
    this.StrType = temp;
    switch (temp) {
      //NAME AND ADDRESS
      case "00":
        this.data = [ 
          { "title": "Full Name-Surname First", "key": "00", isLeaf: true },
          { "title": "Full Name-Mailing", "key": "01", isLeaf: true },
          { "title": "Title", "key": "02", isLeaf: true },
          { "title": "First Name", "key": "03", isLeaf: true },
          { "title": "Middle Names", "key": "04", isLeaf: true },
          { "title": "Surname/Organisation", "key": "05", isLeaf: true },
          { "title": "Preferred Name", "key": "06", isLeaf: true },
          { "title": "Other", "key": "07", isLeaf: true },
          { "title": "Address-Line1", "key": "08", isLeaf: true },
          { "title": "Address-Line2", "key": "09", isLeaf: true },
          { "title": "Address-Suburb", "key": "10", isLeaf: true },
          { "title": "Address-Postcode", "key": "11", isLeaf: true },
          { "title": "Address-State", "key": "12", isLeaf: true },
        ]
        break;
      //General Demographics
      case "01":
        this.data = [
          { "title": "Gender", "key": "01", isLeaf: true },
          { "title": "Date Of Birth", "key": "02", isLeaf: true },
          { "title": "Age", "key": "03", isLeaf: true },
          { "title": "Ageband-Statistical", "key": "04", isLeaf: true },
          { "title": "Ageband-5 Year", "key": "04", isLeaf: true },
          { "title": "Ageband-10 Year", "key": "05", isLeaf: true },
          { "title": "Age-ATSI Status", "key": "06", isLeaf: true },
          { "title": "Month Of Birth", "key": "07", isLeaf: true },
          { "title": "Day Of Birth No.", "key": "08", isLeaf: true },
          { "title": "CALD Score", "key": "09", isLeaf: true },
          { "title": "Country Of Birth", "key": "10", isLeaf: true },
          { "title": "Language", "key": "11", isLeaf: true },
          { "title": "Indigenous Status", "key": "12", isLeaf: true },
          { "title": "Primary Disability", "key": "13", isLeaf: true },
          { "title": "Financially Dependent", "key": "14", isLeaf: true },
          { "title": "Financial Status", "key": "15", isLeaf: true },
          { "title": "Occupation", "key": "16", isLeaf: true },

        ]
        break;
      //Admin Info
      case "02":
        this.data = [
          { "title": "UniqueID", "key": "00", isLeaf: true },
          { "title": "Code", "key": "01", isLeaf: true },
          { "title": "Type", "key": "02", isLeaf: true },
          { "title": "Category", "key": "03", isLeaf: true },
          { "title": "CoOrdinator", "key": "04", isLeaf: true },
          { "title": "Admitting Branch", "key": "05", isLeaf: true },
          { "title": "Secondary Branch", "key": "06", isLeaf: true },
          { "title": "File number", "key": "07", isLeaf: true },
          { "title": "File Number 2", "key": "08", isLeaf: true },
          { "title": "NDIA/MAC Number", "key": "09", isLeaf: true },
          { "title": "Last Activated Date", "key": "10", isLeaf: true },
          { "title": "Created By", "key": "11", isLeaf: true },
          { "title": "Other", "key": "12", isLeaf: true },
        ]
        break;
      //Staff 
      case "03":
        this.data = [
          { "title": "Staff Name", "key": "00", isLeaf: true },
          { "title": "Program Name", "key": "01", isLeaf: true },
          { "title": "Notes", "key": "02", isLeaf: true },
        ]
        break;
      //Other Genral info
      case "04": 
        this.data = [
          { "title": "OH&S Profile", "key": "00", isLeaf: true },
          { "title": "OLD WH&S Date", "key": "01", isLeaf: true },
          { "title": "Billing Profile", "key": "02", isLeaf: true },
          { "title": "Sub Category", "key": "03", isLeaf: true },
          { "title": "Roster Alerts", "key": "04", isLeaf: true },
          { "title": "Timesheet Alerts", "key": "05", isLeaf: true },
          { "title": "Contact Issues", "key": "06", isLeaf: true },
          { "title": "Survey Consent Given", "key": "07", isLeaf: true },
          { "title": "Copy Rosters Enabled", "key": "08", isLeaf: true },
          { "title": "Activation Date", "key": "09", isLeaf: true },
          { "title": "DeActivation Date", "key": "10", isLeaf: true },
          { "title": "Mobility", "key": "11", isLeaf: true },
          { "title": "Specific Competencies", "key": "12", isLeaf: true },
        ]
        break;
      //  Contacts & Next of Kin
      case "05":
        this.data = [
          { "title": "Contact Group", "key": "00", isLeaf: true },
          { "title": "Contact Type", "key": "01", isLeaf: true },
          { "title": "Contact Sub Type", "key": "02", isLeaf: true },
          { "title": "Contact User Flag", "key": "03", isLeaf: true },
          { "title": "Contact Person Type", "key": "04", isLeaf: true },
          { "title": "Contact Name", "key": "05", isLeaf: true },
          { "title": "Contact Address", "key": "06", isLeaf: true },
          { "title": "Contact Suburb", "key": "07", isLeaf: true },
          { "title": "Contact Postcode", "key": "08", isLeaf: true },
          { "title": "Contact Phone 1", "key": "09", isLeaf: true },
          { "title": "Contact Phone 2", "key": "10", isLeaf: true },
          { "title": "Contact Mobile", "key": "11", isLeaf: true },
          { "title": "Contact FAX", "key": "12", isLeaf: true },
          { "title": "Contact Email", "key": "13", isLeaf: true },

        ]
        break;      
        //Carer Info
      case "06":
        this.data = [
          { "title": "Carer First Name", "key": "00", isLeaf: true },
          { "title": "Carer Last Name", "key": "01", isLeaf: true },
          { "title": "Carer Age", "key": "02", isLeaf: true },
          { "title": "Carer Gender", "key": "03", isLeaf: true },
          { "title": "Carer Indigenous Status", "key": "04", isLeaf: true },
          { "title": "Carer Address", "key": "05", isLeaf: true },
          { "title": "Carer Email", "key": "06", isLeaf: true },
          { "title": "Carer Phone <Home>", "key": "07", isLeaf: true },
          { "title": "Carer Phone <Work>", "key": "08", isLeaf: true },
          { "title": "Carer Phone <Mobile>", "key": "09", isLeaf: true },

        ]
        break;          
      // Documents 
      case "07":
        this.data = [
          { "title": "DOC_ID", "key": "00", isLeaf: true },
          { "title": "Doc_Title", "key": "01", isLeaf: true },
          { "title": "Created", "key": "02", isLeaf: true },
          { "title": "Modified", "key": "03", isLeaf: true },
          { "title": "Status", "key": "04", isLeaf: true },
          { "title": "Classification", "key": "05", isLeaf: true },
          { "title": "Category", "key": "06", isLeaf: true },
          { "title": "Filename", "key": "07", isLeaf: true },
          { "title": "Doc#", "key": "08", isLeaf: true },
          { "title": "DocStartDate", "key": "09", isLeaf: true },
          { "title": "DocEndDate", "key": "10", isLeaf: true },
          { "title": "AlarmDate", "key": "11", isLeaf: true },
          { "title": "AlarmText", "key": "12", isLeaf: true },
        ]
        break;        
      //Consents
      case "08":
        this.data = [
          { "title": "Consent", "key": "00", isLeaf: true },
          { "title": "Consent Start Date", "key": "01", isLeaf: true },
          { "title": "Consent Expiry", "key": "02", isLeaf: true },
          { "title": "Consent Notes", "key": "03", isLeaf: true },
        ]
        break;
      //  GOALS OF CARE
      case "09":
        this.data = [
          { "title": "Goal", "key": "00", isLeaf: true },
          { "title": "Goal Detail", "key": "01", isLeaf: true },
          { "title": "Goal Achieved", "key": "02", isLeaf: true },
          { "title": "Anticipated Achievement Date", "key": "03", isLeaf: true },
          { "title": "Date Achieved", "key": "04", isLeaf: true },
          { "title": "Last Reviewed", "key": "05", isLeaf: true },
          { "title": "Logged By", "key": "06", isLeaf: true },
        ]
        break;        
      //REMINDERS
      case "10":
        this.data = [
          { "title": "Reminder Detail", "key": "00", isLeaf: true },
          { "title": "Event Date", "key": "01", isLeaf: true },
          { "title": "Reminder Date", "key": "02", isLeaf: true },
          { "title": "Reminder Notes", "key": "03", isLeaf: true },
        ]
        break;
      // USER GROUPS
      case "11":
        this.data = [

          { "title": "Group Name", "key": "00", isLeaf: true },
          { "title": "Group Note", "key": "01", isLeaf: true },
        ]
        break;
      //Preferences
      case "12":
        this.data = [
          { "title": "Preference Name", "key": "00", isLeaf: true },
          { "title": "Preference Note", "key": "01", isLeaf: true },
        ]
        break;        
      // FIXED REVIEW DATES
      case "13":
        this.data = [
          { "title": "Review Date 1", "key": "00", isLeaf: true },
          { "title": "Review Date 2", "key": "01", isLeaf: true },
          { "title": "Review Date 3", "key": "02", isLeaf: true },
        ]
        break;
      //Staffing Inclusions/Exclusions
      case "14":
        this.data = [
          { "title": "Excluded Staff", "key": "00", isLeaf: true },
          { "title": "Excluded_Staff Notes", "key": "01", isLeaf: true },
          { "title": "Included Staff", "key": "02", isLeaf: true },
          { "title": "Included_Staff Notes", "key": "03", isLeaf: true },
        ]
        break; 
      // AGREED FUNDING INFORMATION
      case "15":
        this.data = [
          { "title": "Funding Source", "key": "00", isLeaf: true },
          { "title": "Funded Program", "key": "01", isLeaf: true },
          { "title": "Funded Program Agency ID", "key": "02", isLeaf: true },
          { "title": "Program Status", "key": "03", isLeaf: true },
          { "title": "Program Coordinator", "key": "04", isLeaf: true },
          { "title": "Funding Start Date", "key": "05", isLeaf: true },
          { "title": "Funding End Date", "key": "06", isLeaf: true },
          { "title": "AutoRenew", "key": "07", isLeaf: true },
          { "title": "Rollover Remainder", "key": "08", isLeaf: true },
          { "title": "Funded Qty", "key": "09", isLeaf: true },
          { "title": "Funded Type", "key": "10", isLeaf: true },
          { "title": "Funding Cycle", "key": "11", isLeaf: true },
          { "title": "Funded Total Allocation", "key": "02", isLeaf: true },
          { "title": "Used", "key": "13", isLeaf: true },
          { "title": "Remaining", "key": "14", isLeaf: true },
        ]
        break;
      //LEGACY CARE PLAN
      case "16":
        this.data = [
          { "title": "Name", "key": "00", isLeaf: true },
          { "title": "Start Date", "key": "01", isLeaf: true },
          { "title": "End Date", "key": "02", isLeaf: true },
          { "title": "Details", "key": "03", isLeaf: true },
          { "title": "Reminder Date", "key": "04", isLeaf: true },
          { "title": "Reminder Text", "key": "05", isLeaf: true },
        ]
        break;
      //Agreed Service Information
      case "17":
        this.data = [
          { "title": "Agreed Service Code", "key": "00", isLeaf: true },
          { "title": "Agreed Program", "key": "01", isLeaf: true },
          { "title": "Agreed Service Agency ID", "key": "02", isLeaf: true },
          { "title": "Agreed Service Status", "key": "03", isLeaf: true },
          { "title": "Agreed Service Duration", "key": "04", isLeaf: true },
          { "title": "Agreed Service Frequency", "key": "05", isLeaf: true },
          { "title": "Agreed Service Cost Type", "key": "06", isLeaf: true },
          { "title": "Agreed Service Unit Cost", "key": "07", isLeaf: true },
          { "title": "Agreed Service Billing Unit", "key": "08", isLeaf: true },
          { "title": "Agreed Service Billing Rate", "key": "09", isLeaf: true },
          { "title": "Agreed Service Debtor", "key": "10", isLeaf: true },
        ]
        break;
      //  CLINICAL INFORMATION
      case "18":
        this.data = [

          { "title": "Nursing Diagnosis", "key": "00", isLeaf: true },
          { "title": "Medical Diagnosis", "key": "01", isLeaf: true },
          { "title": "Medical Procedure", "key": "02", isLeaf: true },
        ]
        break;
      //BILLING INFORMATION
      case "19":
        this.data = [
        ]
        break;
      //PANZTEL Timezone
      case "20":
        this.data = [
          { "title": "PANZTEL PBX Site", "key": "00", isLeaf: true },
          { "title": "PANZTEL Parent Site", "key": "01", isLeaf: true },
          { "title": "DAELIBS Logger ID", "key": "02", isLeaf: true },
        ]
        break;
      //NOTES
      case "21":
        this.data = [

        ]
        break;
      //INSURANCE AND PENSION
      case "22":
        this.data = [
          { "title": "Medicare Number", "key": "00", isLeaf: true },
          { "title": "Medicare Recipient ID", "key": "01", isLeaf: true },
          { "title": "Pension Status", "key": "02", isLeaf: true },
          { "title": "Unable to Determine Pension Status", "key": "03", isLeaf: true },
          { "title": "Concession Number", "key": "04", isLeaf: true },
          { "title": "DVA Benefits Flag", "key": "05", isLeaf: true },
          { "title": "DVA Number", "key": "06", isLeaf: true },
          { "title": "DVA Card Holder Status", "key": "07", isLeaf: true },
          { "title": "Ambulance Subscriber", "key": "08", isLeaf: true },
          { "title": "Ambulance Type", "key": "09", isLeaf: true },
          { "title": "Pension Name", "key": "10", isLeaf: true },
          { "title": "Pension Number", "key": "11", isLeaf: true },
          { "title": "Will Available", "key": "12", isLeaf: true },
          { "title": "Will Location", "key": "13", isLeaf: true },
          { "title": "Funeral Arrangements", "key": "14", isLeaf: true },
          { "title": "Date Of Death", "key": "15", isLeaf: true },
        ]
        break;       
      //HACCS DATSET FIELDS
      case "23":
        this.data = [
          { "title": "HACC-SLK", "key": "00", isLeaf: true },
          { "title": "HACC-First Name", "key": "01", isLeaf: true },
          { "title": "HACC-Surname", "key": "02", isLeaf: true },
          { "title": "HACC-Referral Source", "key": "03", isLeaf: true },
          { "title": "HACC-Date Of Birth", "key": "04", isLeaf: true },
          { "title": "HACC-Date Of Birth Estimated", "key": "05", isLeaf: true },
          { "title": "HACC-Gender", "key": "06", isLeaf: true },
          { "title": "HACC-Area Of Residence", "key": "07", isLeaf: true },
          { "title": "HACC-Country Of Birth", "key": "08", isLeaf: true },
          { "title": "HACC-Preferred Language", "key": "09", isLeaf: true },
          { "title": "HACC-Indigenous Status", "key": "10", isLeaf: true },
          { "title": "HACC-Living Arrangements", "key": "11", isLeaf: true },
          { "title": "HACC-Dwelling/Accomodation", "key": "12", isLeaf: true },
          { "title": "HACC-Main Reasons For Cessation", "key": "13", isLeaf: true },
          { "title": "HACC-Pension Status", "key": "14", isLeaf: true },
          { "title": "HACC-Primary Carer", "key": "15", isLeaf: true },
          { "title": "HACC-Carer Availability", "key": "16", isLeaf: true },
          { "title": "HACC-Carer Residency", "key": "17", isLeaf: true },
          { "title": "HACC-Carer Relationship", "key": "18", isLeaf: true },
          { "title": "HACC-Exclude From Collection", "key": "19", isLeaf: true },
          { "title": "HACC-Housework", "key": "20", isLeaf: true },
          { "title": "HACC-Transport", "key": "21", isLeaf: true },
          { "title": "HACC-Shopping", "key": "22", isLeaf: true },
          { "title": "HACC-Medication", "key": "23", isLeaf: true },
          { "title": "HACC-Money", "key": "24", isLeaf: true },
          { "title": "HACC-Walking", "key": "25", isLeaf: true },
          { "title": "HACC-Bathing", "key": "26", isLeaf: true },
          { "title": "HACC-Memory", "key": "27", isLeaf: true },
          { "title": "HACC-Behaviour", "key": "28", isLeaf: true },
          { "title": "HACC-Communication", "key": "29", isLeaf: true },          
          { "title": "HACC-Eating", "key": "30", isLeaf: true },
          { "title": "HACC-Toileting", "key": "31", isLeaf: true },
          { "title": "HACC-GetUp", "key": "32", isLeaf: true },
          { "title": "HACC-Carer More Than One", "key": "33", isLeaf: true },
        ]
        break;
      //"DEX"
      case "24":
        this.data = [
          { "title": "DEX-Exclude From MDS", "key": "00", isLeaf: true },
          { "title": "DEX-Referral Purpose", "key": "01", isLeaf: true },
          { "title": "DEX-Referral Source", "key": "02", isLeaf: true },
          { "title": "DEX-Referral Type", "key": "03", isLeaf: true },
          { "title": "DEX-Reason For Assistance", "key": "04", isLeaf: true },
          { "title": "DEX-Consent To Provide Information", "key": "05", isLeaf: true },
          { "title": "DEX-Consent For Future Contact", "key": "06", isLeaf: true },
          { "title": "DEX-Sex", "key": "07", isLeaf: true },
          { "title": "DEX-Date Of Birth", "key": "08", isLeaf: true },
          { "title": "DEX-Estimated Birth Date", "key": "09", isLeaf: true },
          { "title": "DEX-Indigenous Status", "key": "10", isLeaf: true },
          { "title": "DEX-DVA Card Holder Status", "key": "11", isLeaf: true },
          { "title": "DEX-Has Disabilities", "key": "12", isLeaf: true },
          { "title": "DEX-Has A Carer", "key": "13", isLeaf: true },
          { "title": "DEX-Country of Birth", "key": "14", isLeaf: true },
          { "title": "DEX-First Arrival Year", "key": "15", isLeaf: true },
          { "title": "DEX-First Arrival Month", "key": "16", isLeaf: true },
          { "title": "DEX-Visa Code", "key": "17", isLeaf: true },
          { "title": "DEX-Ancestry", "key": "18", isLeaf: true },
          { "title": "DEX-Main Language At Home", "key": "19", isLeaf: true },
          { "title": "DEX-Accomodation Setting", "key": "20", isLeaf: true },
          { "title": "DEX-Is Homeless", "key": "21", isLeaf: true },
          { "title": "DEX-Household Composition", "key": "22", isLeaf: true },
          { "title": "DEX-Main Source Of Income", "key": "23", isLeaf: true },
          { "title": "DEX-Income Frequency", "key": "24", isLeaf: true },
          { "title": "DEX-Income Amount", "key": "25", isLeaf: true },
        ]
        break;
      // CSTDA Dataset Fields
      case "25":
        this.data = [
          { "title": "CSTDA-Date Of Birth", "key": "00", isLeaf: true },
          { "title": "CSTDA-Gender", "key": "01", isLeaf: true },
          { "title": "CSTDA-DISQIS ID", "key": "02", isLeaf: true },
          { "title": "CSTDA-Indigenous Status", "key": "03", isLeaf: true },
          { "title": "CSTDA-Country Of Birth", "key": "04", isLeaf: true },
          { "title": "CSTDA-Interpreter Required", "key": "05", isLeaf: true },
          { "title": "CSTDA-Communication Method", "key": "06", isLeaf: true },
          { "title": "CSTDA-Living Arrangements", "key": "07", isLeaf: true },
          { "title": "CSTDA-Suburb", "key": "08", isLeaf: true },
          { "title": "CSTDA-Postcode", "key": "09", isLeaf: true },
          { "title": "CSTDA-State", "key": "10", isLeaf: true },
          { "title": "CSTDA-Residential Setting", "key": "11", isLeaf: true },
          { "title": "CSTDA-Primary Disability Group", "key": "12", isLeaf: true },
          { "title": "CSTDA-Primary Disability Description", "key": "13", isLeaf: true },
          { "title": "CSTDA-Intellectual Disability", "key": "14", isLeaf: true },
          { "title": "CSTDA-Specific Learning ADD Disability", "key": "15", isLeaf: true },
          { "title": "CSTDA-Autism Disability", "key": "16", isLeaf: true },
          { "title": "CSTDA-Physical Disability", "key": "17", isLeaf: true },
          { "title": "CSTDA-Acquired Brain Injury Disability", "key": "18", isLeaf: true },
          { "title": "CSTDA-Neurological Disability", "key": "19", isLeaf: true },
          { "title": "CSTDA-Psychiatric Disability", "key": "20", isLeaf: true },
          { "title": "CSTDA-Other Psychiatric Disability", "key": "21", isLeaf: true },
          { "title": "CSTDA-Vision Disability", "key": "22", isLeaf: true },
          { "title": "CSTDA-Hearing Disability", "key": "23", isLeaf: true },
          { "title": "CSTDA-Speech Disability", "key": "24", isLeaf: true },
          { "title": "CSTDA-Developmental Delay Disability", "key": "25", isLeaf: true },
          { "title": "CSTDA-Disability Likely To Be Permanent", "key": "26", isLeaf: true },
          { "title": "CSTDA-Support Needs-Self Care", "key": "27", isLeaf: true },
          { "title": "CSTDA-Support Needs-Mobility", "key": "28", isLeaf: true },
          { "title": "CSTDA-Support Needs-Communication", "key": "29", isLeaf: true },
          { "title": "CSTDA-Support Needs-Interpersonal", "key": "30", isLeaf: true },
          { "title": "CSTDA-Support Needs-Learning", "key": "31", isLeaf: true },
          { "title": "CSTDA-Support Needs-Education", "key": "32", isLeaf: true },
          { "title": "CSTDA-Support Needs-Community", "key": "33", isLeaf: true },
          { "title": "CSTDA-Support Needs-Domestic", "key": "34", isLeaf: true },
          { "title": "CSTDA-Support Needs-Working", "key": "35", isLeaf: true },
          { "title": "CSTDA-Carer-Existence Of Informal", "key": "36", isLeaf: true },
          { "title": "CSTDA-Carer-Assists client in ADL", "key": "37", isLeaf: true },
          { "title": "CSTDA-Carer-Lives In Same Household", "key": "38", isLeaf: true },
          { "title": "CSTDA-Carer-Relationship", "key": "39", isLeaf: true },
          { "title": "CSTDA-Carer-Age Group", "key": "40", isLeaf: true },
          { "title": "CSTDA-Carer Allowance to Guardians", "key": "41", isLeaf: true },
          { "title": "CSTDA-Labour Force Status", "key": "42", isLeaf: true },
          { "title": "CSTDA-Main Source Of Income", "key": "43", isLeaf: true },
          { "title": "CSTDA-Current Individual Funding", "key": "44", isLeaf: true },
        ]
        break;
        //NRCP Dataset Fields
      case "26":
        this.data = [
          { "title": "NRCP-First Name", "key": "00", isLeaf: true },
          { "title": "NRCP-Surname", "key": "01", isLeaf: true },
          { "title": "NRCP-Date Of Birth", "key": "02", isLeaf: true },
          { "title": "NRCP-Gender", "key": "03", isLeaf: true },
          { "title": "NRCP-Suburb", "key": "04", isLeaf: true },
          { "title": "NRCP-Country Of Birth", "key": "05", isLeaf: true },
          { "title": "NRCP-Preferred Language", "key": "06", isLeaf: true },
          { "title": "NRCP-Indigenous Status", "key": "07", isLeaf: true },
          { "title": "NRCP-Marital Status", "key": "08", isLeaf: true },
          { "title": "NRCP-DVA Card Holder Status", "key": "09", isLeaf: true },
          { "title": "NRCP-Paid Employment Participation", "key": "10", isLeaf: true },
          { "title": "NRCP-Pension Status", "key": "11", isLeaf: true },
          { "title": "NRCP-Carer-Date Role Commenced", "key": "12", isLeaf: true },
          { "title": "NRCP-Carer-Role", "key": "13", isLeaf: true },
          { "title": "NRCP-Carer-Need", "key": "14", isLeaf: true },
          { "title": "NRCP-Carer-Number of Recipients", "key": "15", isLeaf: true },
          { "title": "NRCP-Carer-Time Spent Caring", "key": "16", isLeaf: true },
          { "title": "NRCP-Carer-Current Use Formal Services", "key": "17", isLeaf: true },
          { "title": "NRCP-Carer-Informal Support", "key": "18", isLeaf: true },
          { "title": "NRCP-Recipient-Challenging Behaviour", "key": "19", isLeaf: true },
          { "title": "NRCP-Recipient-Primary Disability", "key": "20", isLeaf: true },
          { "title": "NRCP-Recipient-Primary Care Needs", "key": "21", isLeaf: true },
          { "title": "NRCP-Recipient-Level of Need", "key": "22", isLeaf: true },
          { "title": "NRCP-Recipient-Primary Carer", "key": "23", isLeaf: true },
          { "title": "NRCP-Recipient-Carer Relationship", "key": "24", isLeaf: true },
          { "title": "NRCP-Recipient-Carer Co-Resident", "key": "25", isLeaf: true },
          { "title": "NRCP-Recipient-Dementia", "key": "26", isLeaf: true },
          { "title": "NRCP-CALD Background", "key": "27", isLeaf: true },

        ]
        break;
      case "27":
        // "ONI-Core"
        this.data = [
          { "title": "ONI-Family Name", "key": "00", isLeaf: true },
          { "title": "ONI-Title", "key": "01", isLeaf: true },
          { "title": "ONI-First Name", "key": "02", isLeaf: true },
          { "title": "ONI-Other", "key": "03", isLeaf: true },
          { "title": "ONI-Sex", "key": "04", isLeaf: true },
          { "title": "ONI-DOB", "key": "05", isLeaf: true },
          { "title": "ONI-Usual Address-Street", "key": "06", isLeaf: true },
          { "title": "ONI-Usual Address-Suburb", "key": "07", isLeaf: true },
          { "title": "ONI-Usual Address-Postcode", "key": "08", isLeaf: true },
          { "title": "ONI-Contact Address-Street", "key": "09", isLeaf: true },
          { "title": "ONI-Contact Address-Suburb", "key": "10", isLeaf: true },
          { "title": "ONI-Contact Address-Postcode", "key": "11", isLeaf: true },         
          { "title": "ONI-Phone-Home", "key": "12", isLeaf: true },
          { "title": "ONI-Phone-Work", "key": "13", isLeaf: true },
          { "title": "ONI-Phone-Mobile", "key": "14", isLeaf: true },
          { "title": "ONI-Phone-FAX", "key": "15", isLeaf: true },
          { "title": "ONI-EMAIL", "key": "16", isLeaf: true },
          { "title": "ONI-Person 1 Name", "key": "17", isLeaf: true },
          { "title": "ONI-Person 1 Street", "key": "18", isLeaf: true },
          { "title": "ONI-Person 1 Suburb", "key": "19", isLeaf: true },
          { "title": "ONI-Person 1 Postcode", "key": "20", isLeaf: true },
          { "title": "ONI-Person 1 Phone", "key": "21", isLeaf: true },
          { "title": "ONI-Person 1 Relationship", "key": "22", isLeaf: true },
          { "title": "ONI-Person 2 Name", "key": "23", isLeaf: true },
          { "title": "ONI-Person 2 Street", "key": "24", isLeaf: true },
          { "title": "ONI-Person 2 Suburb", "key": "25", isLeaf: true },
          { "title": "ONI-Person 2 Postcode", "key": "26", isLeaf: true },
          { "title": "ONI-Person 2 Phone", "key": "27", isLeaf: true },
          { "title": "ONI-Person 2 Relationship", "key": "28", isLeaf: true },
          { "title": "ONI-Doctor Name", "key": "29", isLeaf: true },
          { "title": "ONI-Doctor Street", "key": "30", isLeaf: true },
          { "title": "ONI-Doctor Suburb", "key": "31", isLeaf: true },
          { "title": "ONI-Doctor Postcode", "key": "32", isLeaf: true },
          { "title": "ONI-Doctor Phone", "key": "33", isLeaf: true },
          { "title": "ONI-Doctor FAX", "key": "34", isLeaf: true },
          { "title": "ONI-Doctor EMAIL", "key": "35", isLeaf: true },
          { "title": "ONI-Referral Source", "key": "36", isLeaf: true },
          { "title": "ONI-Contact Details", "key": "37", isLeaf: true },
          { "title": "ONI-Country Of Birth", "key": "38", isLeaf: true },
          { "title": "ONI-Indigenous Status", "key": "39", isLeaf: true },
          { "title": "ONI-Main Language At Home", "key": "40", isLeaf: true },
          { "title": "ONI-Interpreter Required", "key": "41", isLeaf: true },
          { "title": "ONI-Preferred Language", "key": "42", isLeaf: true },
          { "title": "ONI-Govt Pension Status", "key": "43", isLeaf: true },
          { "title": "ONI-Pension Benefit Card", "key": "44", isLeaf: true },
          { "title": "ONI-Medicare Number", "key": "45", isLeaf: true },
          { "title": "ONI-Health Care Card#", "key": "46", isLeaf: true },
          { "title": "ONI-DVA Cardholder Status", "key": "47", isLeaf: true },
          { "title": "ONI-DVA Number", "key": "48", isLeaf: true },
          { "title": "ONI-Insurance Status", "key": "49", isLeaf: true },
          { "title": "ONI-Health Insurer", "key": "50", isLeaf: true },                 
          { "title": "ONI-Health Insurance Card#", "key": "51", isLeaf: true },
          { "title": "ONI-Alerts", "key": "52", isLeaf: true },
          { "title": "ONI-Rating", "key": "53", isLeaf: true },
          { "title": "ONI-HACC Eligible", "key": "54", isLeaf: true },
          { "title": "ONI-Reason For HACC Status", "key": "55", isLeaf: true },
          { "title": "ONI-Other Support Eligibility", "key": "56", isLeaf: true },
          { "title": "ONI-Other Support Detail", "key": "57", isLeaf: true },
          { "title": "ONI-Functional Profile Complete", "key": "58", isLeaf: true },
          { "title": "ONI-Functional Profile Score 1", "key": "59", isLeaf: true },
          { "title": "ONI-Functional Profile Score 2", "key": "60", isLeaf: true },
          { "title": "ONI-Functional Profile Score 3", "key": "51", isLeaf: true },
          { "title": "ONI-Functional Profile Score 4", "key": "62", isLeaf: true },
          { "title": "ONI-Functional Profile Score 5", "key": "63", isLeaf: true },
          { "title": "ONI-Functional Profile Score 6", "key": "64", isLeaf: true },
          { "title": "ONI-Functional Profile Score 7", "key": "65", isLeaf: true },
          { "title": "ONI-Functional Profile Score 8", "key": "66", isLeaf: true },
          { "title": "ONI-Functional Profile Score 9", "key": "67", isLeaf: true },
          { "title": "ONI-Main Problem-Description", "key": "68", isLeaf: true },
          { "title": "ONI-Main Problem-Action", "key": "69", isLeaf: true },
          { "title": "ONI-Other Problem-Description", "key": "70", isLeaf: true },
          { "title": "ONI-Other Problem-Action", "key": "71", isLeaf: true },
          { "title": "ONI-Current Service", "key": "72", isLeaf: true },
          { "title": "ONI-Service Contact Details", "key": "73", isLeaf: true },
          { "title": "ONI-AP-Agency", "key": "74", isLeaf: true },
          { "title": "ONI-AP-For", "key": "75", isLeaf: true },
          { "title": "ONI-AP-Consent", "key": "76", isLeaf: true },
          { "title": "ONI-AP-Referral", "key": "77", isLeaf: true },
          { "title": "ONI-AP-Transport", "key": "78", isLeaf: true },
          { "title": "ONI-AP-Feedback", "key": "79", isLeaf: true },
          { "title": "ONI-AP-Date", "key": "80", isLeaf: true },
          { "title": "ONI-AP-Review", "key": "81", isLeaf: true },
        ]
        break;
      //  ONI-Functional Profile
      case "28":
        this.data = [
          { "title": "ONI-FPQ1-Housework", "key": "00", isLeaf: true },
          { "title": "ONI-FPQ2-GetToPlaces", "key": "01", isLeaf: true },
          { "title": "ONI-FPQ3-Shopping", "key": "02", isLeaf: true },
          { "title": "ONI-FPQ4-Medicine", "key": "03", isLeaf: true },
          { "title": "ONI-FPQ5-Money", "key": "04", isLeaf: true },
          { "title": "ONI-FPQ6-Walk", "key": "05", isLeaf: true },
          { "title": "ONI-FPQ7-Bath", "key": "06", isLeaf: true },
          { "title": "ONI-FPQ8-Memory", "key": "07", isLeaf: true },
          { "title": "ONI-FPQ9-Behaviour", "key": "08", isLeaf: true },
          { "title": "ONI-FP-Recommend Domestic", "key": "09", isLeaf: true },
          { "title": "ONI-FP-Recommend Self Care", "key": "10", isLeaf: true },
          { "title": "ONI-FP-Recommend Cognition", "key": "11", isLeaf: true },
          { "title": "ONI-FP-Recommend Behaviour", "key": "12", isLeaf: true },
          { "title": "ONI-FP-Has Self Care Aids", "key": "13", isLeaf: true },
          { "title": "ONI-FP-Has Support/Mobility Aids", "key": "14", isLeaf: true },
          { "title": "ONI-FP-Has Communication Aids", "key": "15", isLeaf: true },
          { "title": "ONI-FP-Has Car Mods", "key": "16", isLeaf: true },
          { "title": "ONI-FP-Has Other Aids", "key": "17", isLeaf: true },
          { "title": "ONI-FP-Other Goods List", "key": "18", isLeaf: true },
          { "title": "ONI-FP-Comments", "key": "19", isLeaf: true },

        ]
        break;
      //  ONI-Living Arrangements Profile
      case "29":
        this.data = [
          { "title": "ONI-LA-Living Arrangements", "key": "00", isLeaf: true },
          { "title": "ONI-LA-Living Arrangements Comments", "key": "01", isLeaf: true },
          { "title": "ONI-LA-Accomodation", "key": "02", isLeaf: true },
          { "title": "ONI-LA-Accomodation Comments", "key": "03", isLeaf: true },
          { "title": "ONI-LA-Employment Status", "key": "04", isLeaf: true },
          { "title": "ONI-LA-Employment Status Comments", "key": "05", isLeaf: true },
          { "title": "ONI-LA-Mental Health Act Status", "key": "06", isLeaf: true },
          { "title": "ONI-LA-Decision Making Responsibility", "key": "07", isLeaf: true },
          { "title": "ONI-LA-Capable Own Decisions", "key": "08", isLeaf: true },
          { "title": "ONI-LA-Financial Decisions", "key": "09", isLeaf: true },
          { "title": "ONI-LA-Cost Of Living Trade Off", "key": "10", isLeaf: true },
          { "title": "ONI-LA-Financial & Legal Comments", "key": "11", isLeaf: true },

        ]
        break;
      // ONI-Health Conditions Profile
      case "30":
        this.data = [
          { "title": "ONI-HC-Overall Health Description", "key": "00", isLeaf: true },
          { "title": "ONI-HC-Overall Health Pain", "key": "01", isLeaf: true },
          { "title": "ONI-HC-Overall Health Interference", "key": "02", isLeaf: true },
          { "title": "ONI-HC-Vision Reading", "key": "03", isLeaf: true },
          { "title": "ONI-HC-Vision Distance", "key": "04", isLeaf: true },
          { "title": "ONI-HC-Hearing", "key": "05", isLeaf: true },
          { "title": "ONI-HC-Oral Problems", "key": "06", isLeaf: true },
          { "title": "ONI-HC-Oral Comments", "key": "07", isLeaf: true },
          { "title": "ONI-HC-Speech/Swallow Problems", "key": "08", isLeaf: true },
          { "title": "ONI-HC-Speech/Swallow Comments", "key": "09", isLeaf: true },
          { "title": "ONI-HC-Falls Problems", "key": "10", isLeaf: true },
          { "title": "ONI-HC-Falls Comments", "key": "11", isLeaf: true },
          { "title": "ONI-HC-Feet Problems", "key": "12", isLeaf: true },
          { "title": "ONI-HC-Feet Comments", "key": "13", isLeaf: true },
          { "title": "ONI-HC-Vacc. Influenza", "key": "14", isLeaf: true },
          { "title": "ONI-HC-Vacc. Influenza Date", "key": "15", isLeaf: true },
          { "title": "ONI-HC-Vacc. Pneumococcus", "key": "16", isLeaf: true },
          { "title": "ONI-HC-Vacc. Pneumococcus  Date", "key": "17", isLeaf: true },
          { "title": "ONI-HC-Vacc. Tetanus", "key": "18", isLeaf: true },
          { "title": "ONI-HC-Vacc. Tetanus Date", "key": "19", isLeaf: true },
          { "title": "ONI-HC-Vacc. Other", "key": "20", isLeaf: true },
          { "title": "ONI-HC-Vacc. Other Date", "key": "21", isLeaf: true },
          { "title": "ONI-HC-Driving MV", "key": "22", isLeaf: true },
          { "title": "ONI-HC-Driving Fit", "key": "23", isLeaf: true },
          { "title": "ONI-HC-Driving Comments", "key": "24", isLeaf: true },
          { "title": "ONI-HC-Continence Urinary", "key": "25", isLeaf: true },
          { "title": "ONI-HC-Urinary Related To Coughing", "key": "26", isLeaf: true },
          { "title": "ONI-HC-Urinary Related To Coughing", "key": "27", isLeaf: true },
          { "title": "ONI-HC-Continence Comments", "key": "28", isLeaf: true },
          { "title": "ONI-HC-Weight", "key": "29", isLeaf: true },
          { "title": "ONI-HC-Height", "key": "30", isLeaf: true },
          { "title": "ONI-HC-BMI", "key": "31", isLeaf: true },
          { "title": "ONI-HC-BP Systolic", "key": "32", isLeaf: true },
          { "title": "ONI-HC-BP Diastolic", "key": "33", isLeaf: true },
          { "title": "ONI-HC-Pulse Rate", "key": "34", isLeaf: true },
          { "title": "ONI-HC-Pulse Regularity", "key": "35", isLeaf: true },
          { "title": "ONI-HC-Check Postural Hypotension", "key": "36", isLeaf: true },
          { "title": "ONI-HC-Conditions", "key": "37", isLeaf: true },
          { "title": "ONI-HC-Diagnosis", "key": "38", isLeaf: true },
          { "title": "ONI-HC-Medicines", "key": "39", isLeaf: true },
          { "title": "ONI-HC-Take Own Medication", "key": "40", isLeaf: true },
          { "title": "ONI-HC-Willing When Presribed", "key": "41", isLeaf: true },
          { "title": "ONI-HC-Co-op With Health Services", "key": "42", isLeaf: true },
          { "title": "ONI-HC-Webster Pack", "key": "43", isLeaf: true },
          { "title": "ONI-HC-Medication Review", "key": "44", isLeaf: true },
          { "title": "ONI-HC-Medical Comments", "key": "45", isLeaf: true },
        ]
        break;
      case "31":
        //ONI-Psychosocial Profile

        this.data = [

          { "title": "ONI-PS-K10-1", "key": "00", isLeaf: true },
          { "title": "ONI-PS-K10-2", "key": "01", isLeaf: true },
          { "title": "ONI-PS-K10-3", "key": "02", isLeaf: true },
          { "title": "ONI-PS-K10-4", "key": "03", isLeaf: true },
          { "title": "ONI-PS-K10-5", "key": "04", isLeaf: true },
          { "title": "ONI-PS-K10-6", "key": "05", isLeaf: true },
          { "title": "ONI-PS-K10-7", "key": "06", isLeaf: true },
          { "title": "ONI-PS-K10-8", "key": "07", isLeaf: true },
          { "title": "ONI-PS-K10-9", "key": "08", isLeaf: true },
          { "title": "ONI-PS-K10-10", "key": "09", isLeaf: true },
          { "title": "ONI-PS-Sleep Difficulty", "key": "10", isLeaf: true },
          { "title": "ONI-PS-Sleep Details", "key": "11", isLeaf: true },
          { "title": "ONI-PS-Personal Support", "key": "12", isLeaf: true },
          { "title": "ONI-PS-Personal Support Comments", "key": "13", isLeaf: true },
          { "title": "ONI-PS-Keep Friendships", "key": "14", isLeaf: true },
          { "title": "ONI-PS-Problems Interacting", "key": "15", isLeaf: true },
          { "title": "ONI-PS-Family/Relationship Comments", "key": "16", isLeaf: true },
          { "title": "ONI-PS-Svc Prvdr Relations", "key": "17", isLeaf: true },
          { "title": "ONI-PS-Svc Prvdr Comments", "key": "18", isLeaf: true },
        ]
        break;
      //ONI-Health Behaviours Profile
      case "32":
        this.data = [


          { "title": "ONI-HB-Regular Health Checks", "key": "00", isLeaf: true },
          { "title": "ONI-HB-Last Health Check", "key": "01", isLeaf: true },
          { "title": "ONI-HB-Health Screens", "key": "02", isLeaf: true },
          { "title": "ONI-HB-Smoking", "key": "03", isLeaf: true },
          { "title": "ONI-HB-If Quit Smoking - When?", "key": "04", isLeaf: true },
          { "title": "ONI-HB-Alchohol-How often?", "key": "05", isLeaf: true },
          { "title": "ONI-HB-Alchohol-How many?", "key": "06", isLeaf: true },
          { "title": "ONI-HB-Alchohol-How often over 6?", "key": "07", isLeaf: true },
          { "title": "ONI-HB-Lost Weight", "key": "08", isLeaf: true },
          { "title": "ONI-HB-Eating Poorly", "key": "09", isLeaf: true },
          { "title": "ONI-HB-How much wieght lost", "key": "10", isLeaf: true },
          { "title": "ONI-HB-Malnutrition Score", "key": "11", isLeaf: true },
          { "title": "ONI-HB-8 cups fluid", "key": "12", isLeaf: true },
          { "title": "ONI-HB-Recent decrease in fluid", "key": "13", isLeaf: true },
          { "title": "ONI-HB-Weight", "key": "14", isLeaf: true },
          { "title": "ONI-HB-Physical Activity", "key": "15", isLeaf: true },
          { "title": "ONI-HB-Physical Fitness", "key": "16", isLeaf: true },
          { "title": "ONI-HB-Fitness Comments", "key": "17", isLeaf: true },
        ]
        break;
      //ONI-CP-Need for carer
      case "33":
        this.data = [

          { "title": "ONI-CP-Carer Availability", "key": "00", isLeaf: true },
          { "title": "ONI-CP-Carer Residency Status", "key": "01", isLeaf: true },
          { "title": "ONI-CP-Carer Relationship", "key": "02", isLeaf: true },
          { "title": "ONI-CP-Carer has help", "key": "03", isLeaf: true },
          { "title": "ONI-CP-Carer receives payment", "key": "04", isLeaf: true },
          { "title": "ONI-CP-Carer made aware support services", "key": "05", isLeaf: true },
          { "title": "ONI-CP-Carer needs training", "key": "06", isLeaf: true },
          { "title": "ONI-CP-Carer threat-emotional", "key": "07", isLeaf: true },
          { "title": "ONI-CP-Carer threat-acute physical", "key": "08", isLeaf: true },
          { "title": "ONI-CP-Carer threat-slow physical", "key": "09", isLeaf: true },
          { "title": "ONI-CP-Carer threat-other factors", "key": "10", isLeaf: true },
          { "title": "ONI-CP-Carer threat-increasing consumer needs", "key": "11", isLeaf: true },
          { "title": "ONI-CP-Carer threat-other comsumer factors", "key": "12", isLeaf: true },
          { "title": "ONI-CP-Carer arrangements sustainable", "key": "13", isLeaf: true },
          { "title": "ONI-CP-Carer Comments", "key": "14", isLeaf: true },
        ]
        break;
      //ONI-CS-Year of Arrival
      case "34":
        this.data = [

          { "title": "ONI-CS-Year of Arrival", "key": "24", isLeaf: true },
          { "title": "ONI-CS-Citizenship Status", "key": "00", isLeaf: true },
          { "title": "ONI-CS-Reasons for moving to Australia", "key": "01", isLeaf: true },
          { "title": "ONI-CS-Primary/Secondary Language Fluency", "key": "02", isLeaf: true },
          { "title": "ONI-CS-Fluency in English", "key": "03", isLeaf: true },
          { "title": "ONI-CS-Literacy in primary language", "key": "04", isLeaf: true },
          { "title": "ONI-CS-Literacy in English", "key": "05", isLeaf: true },
          { "title": "ONI-CS-Non verbal communication style", "key": "06", isLeaf: true },
          { "title": "ONI-CS-Marital Status", "key": "07", isLeaf: true },
          { "title": "ONI-CS-Religion", "key": "08", isLeaf: true },
          { "title": "ONI-CS-Employment history in country of origin", "key": "09", isLeaf: true },
          { "title": "ONI-CS-Employment history in Australia", "key": "10", isLeaf: true },         
          { "title": "ONI-CS-Specific dietary needs", "key": "11", isLeaf: true },
          { "title": "ONI-CS-Specific cultural needs", "key": "12", isLeaf: true }, 
          { "title": "ONI-CS-Someone to talk to for day to day problems", "key": "13", isLeaf: true },
          { "title": "ONI-CS-Miss having close freinds", "key": "14", isLeaf: true },
          { "title": "ONI-CS-Experience general sense of emptiness", "key": "15", isLeaf: true },
          { "title": "ONI-CS-Plenty of people to lean on for problems", "key": "16", isLeaf: true },
          { "title": "ONI-CS-Miss the pleasure of the company of others", "key": "17", isLeaf: true },
          { "title": "ONI-CS-Circle of friends and aquaintances too limited", "key": "18", isLeaf: true },
          { "title": "ONI-CS-Many people I trust completely", "key": "19", isLeaf: true },
          { "title": "ONI-CS-Enough people I feel close to", "key": "20", isLeaf: true },
          { "title": "ONI-CS-Miss having people around", "key": "21", isLeaf: true },
          { "title": "ONI-CS-Often feel rejected", "key": "22", isLeaf: true },
          { "title": "ONI-CS-Can call on my friends whenever I need them", "key": "23", isLeaf: true },                    
        ]
        break;
      //Loan Items
      case "35":
        this.data = [


          { "title": "Loan Item Type", "key": "00", isLeaf: true },
          { "title": "Loan Item Description", "key": "01", isLeaf: true },
          { "title": "Loan Item Date Loaned/Installed", "key": "02", isLeaf: true },
          { "title": "Loan Item Date Collected", "key": "03", isLeaf: true },
        ]
        break;
      case "36":
        //  service information Fields
        this.data = [
          { "title": "Staff Code", "key": "00", isLeaf: true },
          { "title": "Service Date", "key": "01", isLeaf: true },
          { "title": "Service Start Time", "key": "02", isLeaf: true },
          { "title": "Service Code", "key": "03", isLeaf: true },
          { "title": "Service Hours", "key": "04", isLeaf: true },
          { "title": "Service Pay Rate", "key": "05", isLeaf: true },
          { "title": "Service Bill Rate", "key": "06", isLeaf: true },
          { "title": "Service Bill Qty", "key": "07", isLeaf: true },
          { "title": "Service Location/Activity Group", "key": "08", isLeaf: true },
          { "title": "Service Program", "key": "09", isLeaf: true },
          { "title": "Service Group", "key": "10", isLeaf: true },
          { "title": "Service HACCType", "key": "11", isLeaf: true },
          { "title": "Service Category", "key": "12", isLeaf: true },
          { "title": "Service Status", "key": "13", isLeaf: true },
          { "title": "Service Pay Type", "key": "14", isLeaf: true },
          { "title": "Service Pay Qty", "key": "15", isLeaf: true },
          { "title": "Service End Time/ Shift End Time", "key": "16", isLeaf: true },
          { "title": "Service Funding Source", "key": "17", isLeaf: true },
          { "title": "Service Notes", "key": "18", isLeaf: true },
        ]
        break;
      //Service Specific Competencies
      case "37":
        this.data = [
          { "title": "Activity", "key": "00", isLeaf: true },
          { "title": "Competency", "key": "01", isLeaf: true },
          { "title": "SS Status", "key": "02", isLeaf: true },
        ]
        break; 
      //  RECIPIENT OP NOTES
      case "38":
        this.data = [
          { "title": "OP Notes Date", "key": "00", isLeaf: true },
          { "title": "OP Notes Detail", "key": "01", isLeaf: true },
          { "title": "OP Notes Creator", "key": "02", isLeaf: true },
          { "title": "OP Notes Alarm", "key": "03", isLeaf: true },
          { "title": "OP Notes Program", "key": "04", isLeaf: true },
          { "title": "OP Notes Category", "key": "05", isLeaf: true },
        ] 
        break;
      // RECIPIENT CLINICAL NOTES
      case "39":
        this.data = [
          { "title": "Clinical Notes Date", "key": "00", isLeaf: true },
          { "title": "Clinical Notes Detail", "key": "01", isLeaf: true },
          { "title": "Clinical Notes Creator", "key": "02", isLeaf: true },
          { "title": "Clinical Notes Alarm", "key": "03", isLeaf: true },
          { "title": "Clinical Notes Category", "key": "04", isLeaf: true },
         
        ]
        break;
      // RECIPIENT INCIDENTS 
      case "40":
        this.data = [


          { "title": "INCD_Status", "key": "00", isLeaf: true },
          { "title": "INCD_Date", "key": "01", isLeaf: true },
          { "title": "INCD_Type", "key": "02", isLeaf: true },
          { "title": "INCD_Description", "key": "03", isLeaf: true },
          { "title": "INCD_SubCategory", "key": "04", isLeaf: true },
          { "title": "INCD_Assigned_To", "key": "05", isLeaf: true },
          { "title": "INCD_Service", "key": "06", isLeaf: true },
          { "title": "INCD_Severity", "key": "07", isLeaf: true },
          { "title": "INCD_Time", "key": "08", isLeaf: true },
          { "title": "INCD_Duration", "key": "09", isLeaf: true },
          { "title": "INCD_Location", "key": "10", isLeaf: true },
          { "title": "INCD_LocationNotes", "key": "11", isLeaf: true },
          { "title": "INCD_ReportedBy", "key": "12", isLeaf: true },
          { "title": "INCD_DateReported", "key": "13", isLeaf: true },
          { "title": "INCD_Reported", "key": "14", isLeaf: true },
          { "title": "INCD_FullDesc", "key": "15", isLeaf: true },
          { "title": "INCD_Program", "key": "16", isLeaf: true },
          { "title": "INCD_DSCServiceType", "key": "17", isLeaf: true },
          { "title": "INCD_TriggerShort", "key": "18", isLeaf: true },
          { "title": "INCD_incident_level", "key": "19", isLeaf: true },
          { "title": "INCD_Area", "key": "20", isLeaf: true },
          { "title": "INCD_Region", "key": "21", isLeaf: true },
          { "title": "INCD_position", "key": "22", isLeaf: true },
          { "title": "INCD_phone", "key": "23", isLeaf: true },
          { "title": "INCD_verbal_date", "key": "24", isLeaf: true },
          { "title": "INCD_verbal_time", "key": "25", isLeaf: true },
          { "title": "INCD_By_Whome", "key": "26", isLeaf: true },
          { "title": "INCD_To_Whome", "key": "27", isLeaf: true },
          { "title": "INCD_BriefSummary", "key": "28", isLeaf: true },
          { "title": "INCD_ReleventBackground", "key": "29", isLeaf: true },
          { "title": "INCD_SummaryofAction", "key": "30", isLeaf: true },
          { "title": "INCD_SummaryOfOtherAction", "key": "31", isLeaf: true },
          { "title": "INCD_Triggers", "key": "32", isLeaf: true },
          { "title": "INCD_InitialAction", "key": "33", isLeaf: true },
          { "title": "INCD_InitialNotes", "key": "34", isLeaf: true },
          { "title": "INCD_InitialFupBy", "key": "35", isLeaf: true },
          { "title": "INCD_Completed", "key": "36", isLeaf: true },
          { "title": "INCD_OngoingAction", "key": "37", isLeaf: true },          
          { "title": "INCD_OngoingNotes", "key": "38", isLeaf: true },
          { "title": "INCD_Background", "key": "39", isLeaf: true },
          { "title": "INCD_Abuse", "key": "40", isLeaf: true },
          { "title": "INCD_DOPWithDisability", "key": "41", isLeaf: true },
          { "title": "INCD_SeriousRisks", "key": "42", isLeaf: true },
          { "title": "INCD_Complaints", "key": "43", isLeaf: true },
          { "title": "INCD_Perpetrator", "key": "46", isLeaf: true },
          { "title": "INCD_Notify", "key": "47", isLeaf: true },
          { "title": "INCD_NoNotifyReason", "key": "48", isLeaf: true },
          { "title": "INCD_Notes", "key": "49", isLeaf: true },
          { "title": "INCD_Setting", "key": "50", isLeaf: true },
          { "title": "INCD_Involved_Staff", "key": "51", isLeaf: true },
        ]
        break;
      //  Recipient Competencies
      case "41":
        this.data = [

          { "title": "Recipient Competency", "key": "00", isLeaf: true },
          { "title": "Recipient Competency Mandatory", "key": "01", isLeaf: true },
          { "title": "Recipient Competency Notes", "key": "02", isLeaf: true },
        ] 
        break;
      //Care Plan
      case "42":
        this.data = [
          { "title": "CarePlan ID", "key": "00", isLeaf: true },
          { "title": "CarePlan Name", "key": "01", isLeaf: true },
          { "title": "CarePlan Type", "key": "02", isLeaf: true },
          { "title": "CarePlan Program", "key": "03", isLeaf: true },
          { "title": "CarePlan Discipline", "key": "04", isLeaf: true },
          { "title": "CarePlan CareDomain", "key": "05", isLeaf: true },
          { "title": "CarePlan StartDate", "key": "06", isLeaf: true },
          { "title": "CarePlan SignOffDate", "key": "07", isLeaf: true },
          { "title": "CarePlan ReviewDate", "key": "08", isLeaf: true },
          { "title": "CarePlan ReminderText", "key": "09", isLeaf: true },
          { "title": "CarePlan Archived", "key": "10", isLeaf: true },

        ]
        break;
      //Mental Health
      case "43":
        this.data = [

          { "title": "MH-PERSONID", "key": "00", isLeaf: true },
          { "title": "MH-HOUSING TYPE ON REFERRAL", "key": "01", isLeaf: true },
          { "title": "MH-RE REFERRAL", "key": "02", isLeaf: true },
          { "title": "MH-REFERRAL SOURCE", "key": "03", isLeaf: true },
          { "title": "MH-REFERRAL RECEIVED DATE", "key": "04", isLeaf: true },
          { "title": "MH-ENGAGED AND CONSENT DATE", "key": "05", isLeaf: true },
          { "title": "MH-OPEN TO HOSPITAL", "key": "06", isLeaf: true },
          { "title": "MH-OPEN TO HOSPITAL DETAILS", "key": "07", isLeaf: true },
          { "title": "MH-ALERTS", "key": "08", isLeaf: true },
          { "title": "MH-ALERTS DETAILS", "key": "09", isLeaf: true },
          { "title": "MH-MH DIAGNOSIS", "key": "10", isLeaf: true },
          { "title": "MH-MEDICAL DIAGNOSIS", "key": "11", isLeaf: true },
          { "title": "MH-REASONS FOR EXIT", "key": "12", isLeaf: true },
          { "title": "MH-SERVICES LINKED INTO", "key": "13", isLeaf: true },
          { "title": "MH-NON ACCEPTED REASONS", "key": "14", isLeaf: true },
          { "title": "MH-NOT PROCEEDED", "key": "15", isLeaf: true },
          { "title": "MH-DISCHARGE DATE", "key": "16", isLeaf: true },
          { "title": "MH-CURRENT AOD", "key": "17", isLeaf: true },
          { "title": "MH-CURRENT AOD DETAILS", "key": "18", isLeaf: true },
          { "title": "MH-PAST AOD", "key": "19", isLeaf: true },
          { "title": "MH-PAST AOD DETAILS", "key": "20", isLeaf: true },
          { "title": "MH-ENGAGED AOD", "key": "21", isLeaf: true },
          { "title": "MH-ENGAGED AOD DETAILS", "key": "22", isLeaf: true },
          { "title": "MH-SERVICES CLIENT IS LINKED WITH ON INTAKE", "key": "23", isLeaf: true },
          { "title": "MH-SERVICES CLIENT IS LINKED WITH ON EXIT", "key": "24", isLeaf: true },
          { "title": "MH-ED PRESENTATIONS ON REFERRAL", "key": "25", isLeaf: true },
          { "title": "MH-ED PRESENTATIONS ON 3 MONTH REVIEW", "key": "26", isLeaf: true },
          { "title": "MH-ED PRESENTATIONS ON EXIT", "key": "27", isLeaf: true },
          { "title": "MH-AMBULANCE ARRIVAL ON REFERRAL", "key": "28", isLeaf: true },
          { "title": "MH-AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW", "key": "29", isLeaf: true },
          { "title": "MH-AMBULANCE ARRIVAL ON EXIT", "key": "30", isLeaf: true },
          { "title": "MH-ADMISSIONS ON REFERRAL", "key": "31", isLeaf: true },
          { "title": "MH-ADMISSIONS ON MID-3 MONTH REVIEW", "key": "32", isLeaf: true },
          { "title": "MH-ADMISSIONS TO ED ON TIME OF EXIT", "key": "33", isLeaf: true },
          { "title": "MH-RESIDENTIAL MOVES", "key": "34", isLeaf: true },
          { "title": "MH-DATE OF RESIDENTIAL CHANGE OF ADDRESS", "key": "35", isLeaf: true },
          { "title": "MH-LOCATION OF NEW ADDRESS", "key": "36", isLeaf: true },
          { "title": "MH-HOUSING TYPE ON EXIT", "key": "37", isLeaf: true },
          { "title": "MH-KPI - INTAKE", "key": "38", isLeaf: true },
          { "title": "MH-KPI - 3 MONTH REVEIEW", "key": "39", isLeaf: true },
          { "title": "MH-KPI - EXIT", "key": "40", isLeaf: true },
          { "title": "MH-MEDICAL DIAGNOSIS DETAILS", "key": "41", isLeaf: true },
          { "title": "MH-SERVICES LINKED DETAILS", "key": "42", isLeaf: true },
          { "title": "MH-NDIS TYPE", "key": "43", isLeaf: true },
          { "title": "MH-NDIS TYPE COMMENTS", "key": "46", isLeaf: true },
          { "title": "MH-NDIS NUMBER", "key": "47", isLeaf: true },
          { "title": "MH-REVIEW APPEAL", "key": "48", isLeaf: true },
          { "title": "MH-REVIEW COMMENTS", "key": "49", isLeaf: true },
          { "title": "MH-KP_Intake_1", "key": "50", isLeaf: true },
          { "title": "MH-KP_Intake_2", "key": "51", isLeaf: true },
          { "title": "MH-KP_Intake_3MH", "key": "52" },
          { "title": "MH-KP_Intake_3PH", "key": "53" },
          { "title": "MH-KP_Intake_4", "key": "54" },
          { "title": "MH-KP_Intake_5", "key": "55" },
          { "title": "MH-KP_Intake_6", "key": "56" },
          { "title": "MH-KP_Intake_7", "key": "57" },
          { "title": "MH-KP_3Months_1", "key": "58" },
          { "title": "MH-KP_3Months_2", "key": "59" },
          { "title": "MH-KP_3Months_3MH", "key": "60" },
          { "title": "MH-KP_3Months_3PH", "key": "51" },
          { "title": "MH-KP_3Months_4", "key": "62" },
          { "title": "MH-KP_3Months_5", "key": "63" },
          { "title": "MH-KP_3Months_6", "key": "64" },
          { "title": "MH-KP_3Months_7", "key": "65" },
          { "title": "MH-KP_6Months_1", "key": "66" },
          { "title": "MH-KP_6Months_2", "key": "67" },
          { "title": "MH-KP_6Months_3MH", "key": "68" },
          { "title": "MH-KP_6Months_3PH", "key": "69" },
          { "title": "MH-KP_6Months_4", "key": "70" },
          { "title": "MH-KP_6Months_5", "key": "71" },
          { "title": "MH-KP_6Months_6", "key": "72" },
          { "title": "MH-KP_6Months_7", "key": "73" },
          { "title": "MH-KP_9Months_1", "key": "74" },
          { "title": "MH-KP_9Months_2", "key": "75" },
          { "title": "MH-KP_9Months_3MH", "key": "76" },
          { "title": "MH-KP_9Months_3PH", "key": "77" },
          { "title": "MH-KP_9Months_4", "key": "78" },
          { "title": "MH-KP_9Months_5", "key": "79" },
          { "title": "MH-KP_9Months_6", "key": "80" },
          { "title": "MH-KP_9Months_7", "key": "81" },
          { "title": "MH-KP_Exit_1", "key": "82" },
          { "title": "MH-KP_Exit_2", "key": "83" },
          { "title": "MH-KP_Exit_3MH", "key": "84" },
          { "title": "MH-KP_Exit_3PH", "key": "85" },
          { "title": "MH-KP_Exit_4", "key": "86" },
          { "title": "MH-KP_Exit_5", "key": "87" },
          { "title": "MH-KP_Exit_6", "key": "88" },
          { "title": "MH-KP_Exit_7", "key": "89" },
          { "title": "MH-KP_Intake_DATE", "key": "90" },
          { "title": "MH-KP_3Months_DATE", "key": "91" },
          { "title": "MH-KP_6Months_DATE", "key": "89" },
          { "title": "MH-KP_9Months_DATE", "key": "90" },
          { "title": "MH-KP_Exit_DATE", "key": "91" },
        ]
        break;
      //Recipient Placements
      case "44":
        this.data = [
          { "title": "Placement Type", "key": "00", isLeaf: true },
          { "title": "Placement Carer Name", "key": "01", isLeaf: true },
          { "title": "Placement Start", "key": "02", isLeaf: true },
          { "title": "Placement End", "key": "03", isLeaf: true },
          { "title": "Placement Referral", "key": "04", isLeaf: true },
          { "title": "Placement ATC", "key": "05", isLeaf: true },
          { "title": "Placement Notes", "key": "06", isLeaf: true },
        ] 
        break;
       //Quote Goals and stratagies
       case "45":
        this.data = [
          { "title": "Quote Goal", "key": "00", isLeaf: true },
          { "title": "Goal Expected Completion Date", "key": "01", isLeaf: true },
          { "title": "Goal Last Review Date", "key": "02", isLeaf: true },
          { "title": "Goal Completed Date", "key": "03", isLeaf: true },
          { "title": "Goal  Achieved", "key": "04", isLeaf: true },
          { "title": "Quote Strategy", "key": "05", isLeaf: true },
          { "title": "Strategy Expected Outcome", "key": "06", isLeaf: true },
          { "title": "Strategy Contracted ID", "key": "07", isLeaf: true },
          { "title": "Strategy DS Services", "key": "08", isLeaf: true },
        ]
        break;
        case "46": //Skills & Qualification
        this.data = [
          { "title": "CERT III AC", "key": "00", isLeaf: true },
          { "title": "CERT III DS", "key": "01", isLeaf: true },
          { "title": "Dementia", "key": "02", isLeaf: true },
          { "title": "Disabilities", "key": "03", isLeaf: true },
          { "title": "Host", "key": "04", isLeaf: true },
          { "title": "Spinal", "key": "05", isLeaf: true },
          { "title": "Mental Health", "key": "06", isLeaf: true },
          { "title": "Palliative", "key": "07", isLeaf: true },
          { "title": "Other", "key": "08", isLeaf: true },
          { "title": "Domestic", "key": "09", isLeaf: true },
          { "title": "Registered Nurse ", "key": "10", isLeaf: true },
          { "title": "PCP/PCA", "key": "11", isLeaf: true },
          { "title": "Enrolled Nurse", "key": "12", isLeaf: true },
          { "title": "CACL1", "key": "13", isLeaf: true },
          { "title": "CACL2", "key": "14", isLeaf: true },
          { "title": "Other1", "key": "15", isLeaf: true },
          { "title": "Other2", "key": "16", isLeaf: true },
          { "title": "Other3", "key": "17", isLeaf: true },
          { "title": "Other4", "key": "18", isLeaf: true },
          { "title": "Other5", "key": "19", isLeaf: true },
          { "title": "Other6", "key": "20", isLeaf: true },
          { "title": "Assertiveness", "key": "21", isLeaf: true },
          { "title": "BackCare", "key": "22", isLeaf: true },
          { "title": "Confidentiality", "key": "23", isLeaf: true },
          { "title": "Dementia", "key": "24", isLeaf: true },
          { "title": "Disabilities", "key": "25", isLeaf: true },
          { "title": "DisabilitiesCert", "key": "26", isLeaf: true },
          { "title": "DutyOfCare", "key": "27", isLeaf: true },
          { "title": "FirstAid", "key": "28", isLeaf: true },
          { "title": "Grief", "key": "29", isLeaf: true },
          { "title": "HIST", "key": "30", isLeaf: true },
          { "title": "OH&S", "key": "31", isLeaf: true },
          { "title": "PersonalCare", "key": "32", isLeaf: true },
          { "title": "PCareCertificate", "key": "33", isLeaf: true },
          { "title": "Other", "key": "34", isLeaf: true },
          
                    
        ]
        break;
        case "47": // leaves
          this.data = [
            { "title": "Name", "key": "00", isLeaf: true },
            { "title": "Approved Status", "key": "01", isLeaf: true },
            { "title": "Leave Reminder Date", "key": "02", isLeaf: true },
            { "title": "Leave Start Date", "key": "03", isLeaf: true },
            { "title": "Leave End Date", "key": "04", isLeaf: true },            
                      
          ]
          
        break;
        case "48": // general info
          this.data = [
            { "title": "UniqueID", "key": "00", isLeaf: true },
            { "title": "AcountNo", "key": "01", isLeaf: true },
            { "title": "StaffID", "key": "02", isLeaf: true },
            { "title": "Pin Number", "key": "03", isLeaf: true },
            { "title": "Start Date", "key": "04", isLeaf: true },
            { "title": "Termination Date", "key": "05", isLeaf: true },
            { "title": "Type", "key": "06", isLeaf: true },
            { "title": "Category", "key": "07", isLeaf: true },
            { "title": "Department", "key": "08", isLeaf: true },
            { "title": "Location", "key": "09", isLeaf: true },
            { "title": "Team", "key": "10", isLeaf: true },
            { "title": "Manager/Coordinto ", "key": "11", isLeaf: true },
            { "title": "Service Region", "key": "12", isLeaf: true },
            { "title": "Job Title", "key": "13", isLeaf: true },
            { "title": "Job Status", "key": "14", isLeaf: true },
            { "title": "Job Weighting", "key": "15", isLeaf: true },
            { "title": "Job FTE ", "key": "16", isLeaf: true },
            { "title": "Job Category", "key": "17", isLeaf: true },
            { "title": "Email Timesheet", "key": "18", isLeaf: true },
            { "title": "Award", "key": "19", isLeaf: true },
            { "title": "Award Level", "key": "20", isLeaf: true },
            { "title": "Pay Group", "key": "21", isLeaf: true },
            { "title": "Super %", "key": "22", isLeaf: true },
            { "title": "Super Fund", "key": "23", isLeaf: true },
            { "title": "Vehile Registration", "key": "24", isLeaf: true },
            { "title": "Drivers License", "key": "25", isLeaf: true },
            { "title": "Nurse Registration", "key": "26", isLeaf: true },
            { "title": "Gender", "key": "27", isLeaf: true },
            { "title": "Date of Birth", "key": "28", isLeaf: true },
            { "title": "Age", "key": "29", isLeaf: true },
            { "title": "Ageband-Statistical", "key": "30", isLeaf: true },
            { "title": "Ageband-5 Year", "key": "31", isLeaf: true },
            { "title": "Ageband-10 Year", "key": "32", isLeaf: true },
            { "title": "Age ATSI Status", "key": "33", isLeaf: true },
            { "title": "Month of Birth", "key": "34", isLeaf: true },
            { "title": "Month of Birth No", "key": "35", isLeaf: true },
            { "title": "Leave Start Date", "key": "36", isLeaf: true },
            { "title": "Leave Return Date", "key": "37", isLeaf: true },
            { "title": "Sub Category", "key": "38", isLeaf: true },
            { "title": "Panztel Pin", "key": "39", isLeaf: true },
            { "title": "Daelibs Logger ID", "key": "40", isLeaf: true },
            { "title": "Contact Issues", "key": "41", isLeaf: true },
            { "title": "CALD Status", "key": "42", isLeaf: true },
            { "title": "Indiginous Status", "key": "43", isLeaf: true },
            { "title": "Visa Status", "key": "43", isLeaf: true },
            
                      
          ]
          break;
        case "49"://staff attribute
          this.data = [
            { "title": "Competency", "key": "00", isLeaf: true },
            { "title": "Competency Expiry Date", "key": "01", isLeaf: true },
            { "title": "Competency Reminder Date", "key": "02", isLeaf: true },
            { "title": "Competency Completion Date", "key": "03", isLeaf: true },
            { "title": "Mandatory Status", "key": "04", isLeaf: true },
            { "title": "Certificate Number", "key": "05", isLeaf: true },
            { "title": "Competency Notes", "key": "06", isLeaf: true },
            { "title": "Staff Position", "key": "07", isLeaf: true },
            { "title": "Staff Admin Categories", "key": "08", isLeaf: true },
            { "title": "NDIA Staff Level", "key": "09", isLeaf: true },
                      
          ]
          break;
        case "50":// hr notes
          this.data = [
            { "title": "HR Notes Date", "key": "00", isLeaf: true },
            { "title": "HR Notes Detail", "key": "01", isLeaf: true },
            { "title": "HR Notes Creator", "key": "02", isLeaf: true },
            { "title": "HR Notes Alarm", "key": "03", isLeaf: true },
            { "title": "HR Notes Categories", "key": "04", isLeaf: true },            
                      
          ]
          break;
        case "51"://op notes
          this.data = [
            { "title": "General Notes", "key": "00", isLeaf: true },
            { "title": "OP Notes Date", "key": "01", isLeaf: true },
            { "title": "OP Notes Detail", "key": "02", isLeaf: true },
            { "title": "OP Notes Creator", "key": "03", isLeaf: true },
            { "title": "OP Notes Alarm", "key": "04", isLeaf: true },
            { "title": "OP Notes Category", "key": "05", isLeaf: true },
               
          ]
          break;
        case "52":// staff inident
        this.data = [
          { "title": "INCD_Status", "key": "00", isLeaf: true },
          { "title": "INCD_Date", "key": "01", isLeaf: true },
          { "title": "INCD_TYpe", "key": "02", isLeaf: true },
          { "title": "INCD_Description", "key": "03", isLeaf: true },
          { "title": "INCD_SubCategory", "key": "04", isLeaf: true },
          { "title": "INCD_Assigned_To", "key": "05", isLeaf: true },
          { "title": "INCD_Service", "key": "06", isLeaf: true },
          { "title": "INCD_Severity", "key": "07", isLeaf: true },
          { "title": "INCD_Time", "key": "08", isLeaf: true },
          { "title": "INCD_Duration", "key": "09", isLeaf: true },
          { "title": "INCD_Location", "key": "10", isLeaf: true },
          { "title": "INCD_LocationNotes", "key": "11", isLeaf: true },
          { "title": "INCD_ReportedBy", "key": "12", isLeaf: true },
          { "title": "INCD_DateReported", "key": "13", isLeaf: true },
          { "title": "INCD_Reported", "key": "14", isLeaf: true },
          { "title": "INCD_FullDesc", "key": "15", isLeaf: true },
          { "title": "INCD_Program", "key": "16", isLeaf: true },
          { "title": "INCD_DSCServiceType", "key": "17", isLeaf: true },
          { "title": "INCD_TriggerShort", "key": "18", isLeaf: true },
          { "title": "INCD_level", "key": "19", isLeaf: true },
          { "title": "INCD_Area", "key": "20", isLeaf: true },
          { "title": "INCD_Region", "key": "21", isLeaf: true },
          { "title": "INCD_Position", "key": "22", isLeaf: true },
          { "title": "INCD_Phone", "key": "23", isLeaf: true },
          { "title": "INCD_Verbal_Date", "key": "24", isLeaf: true },
          { "title": "INCD_Verbal_Time", "key": "25", isLeaf: true },
          { "title": "INCD_By_Whome", "key": "26", isLeaf: true },
          { "title": "INCD_To_Whome", "key": "27", isLeaf: true },
          { "title": "INCD_BriefSummary", "key": "28", isLeaf: true },
          { "title": "INCD_ReleventBackground", "key": "29", isLeaf: true },
          { "title": "INCD_SummaryOfAction", "key": "30", isLeaf: true },
          { "title": "INCD_SummaryOfOtherAction", "key": "31", isLeaf: true },
          { "title": "INCD_Triggers", "key": "32", isLeaf: true },
          { "title": "INCD_InitialAtion", "key": "33", isLeaf: true },
          { "title": "INCD_InitialNotes", "key": "34", isLeaf: true },
          { "title": "INCD_InitialFupBy", "key": "35", isLeaf: true },
          { "title": "INCD_Completed", "key": "36", isLeaf: true },
          { "title": "INCD_OngoingAction", "key": "37", isLeaf: true },
          { "title": "INCD_OngoingNotes", "key": "38", isLeaf: true },
          { "title": "INCD_Background", "key": "39", isLeaf: true },
          { "title": "INCD_Abuse", "key": "40", isLeaf: true },
          { "title": "INCD_DOPwithDisability", "key": "41", isLeaf: true },
          { "title": "INCD_SerousRisks", "key": "42", isLeaf: true },
          { "title": "INCD_Complaints", "key": "43", isLeaf: true },
          { "title": "INCD_Perpetrator", "key": "44", isLeaf: true },
          { "title": "INCD_Notify", "key": "45", isLeaf: true },
          { "title": "INCD_NoNotifyReason", "key": "46", isLeaf: true },
          { "title": "INCD_Notes", "key": "47", isLeaf: true },
          { "title": "INCD_Setting", "key": "48", isLeaf: true },                                        
        ]
        break;  
        case "53":// work hours
          this.data = [
            { "title": "Min_Daily_HRS", "key": "00", isLeaf: true },
            { "title": "Max_Daily_HRS", "key": "01", isLeaf: true },
            { "title": "Min_Weekly_HRS", "key": "02", isLeaf: true },
            { "title": "Max_Weekly_HRS", "key": "03", isLeaf: true },
            { "title": "Min_Pay_Period_HRS", "key": "04", isLeaf: true },
            { "title": "Max_Pay_Period_HRS", "key": "05", isLeaf: true },
            { "title": "Week_1_Day_1", "key": "06", isLeaf: true },
            { "title": "Week_1_Day_2", "key": "07", isLeaf: true },
            { "title": "Week_1_Day_3", "key": "08", isLeaf: true },
            { "title": "Week_1_Day_4", "key": "09", isLeaf: true },
            { "title": "Week_1_Day_5", "key": "10", isLeaf: true },
            { "title": "Week_1_Day_6", "key": "11", isLeaf: true },
            { "title": "Week_1_Day_7", "key": "12", isLeaf: true },
            { "title": "Week_2_Day_1", "key": "13", isLeaf: true },
            { "title": "Week_2_Day_2", "key": "14", isLeaf: true },
            { "title": "Week_2_Day_3", "key": "15", isLeaf: true },
            { "title": "Week_2_Day_4", "key": "16", isLeaf: true },
            { "title": "Week_2_Day_5", "key": "17", isLeaf: true },
            { "title": "Week_2_Day_6", "key": "18", isLeaf: true },
            { "title": "Week_2_Day_7", "key": "19", isLeaf: true },
                      
          ]
          break;
        case "54": // staff position
          this.data = [
            { "title": "Staff Position", "key": "00", isLeaf: true },
            { "title": "Position Start Date", "key": "01", isLeaf: true },
            { "title": "Position End Date", "key": "02", isLeaf: true },
            { "title": "Position ID", "key": "03", isLeaf: true },
            { "title": "Position Notes", "key": "04", isLeaf: true },
                      
          ]
          break;
        case "55": // service information fields
          this.data = [
            { "title": "Staff Code", "key": "00", isLeaf: true },
            { "title": "Service Date", "key": "01", isLeaf: true },
            { "title": "Service Start Time", "key": "02", isLeaf: true },
            { "title": "Service Code", "key": "03", isLeaf: true },
            { "title": "Service Hours", "key": "04", isLeaf: true },
            { "title": "Service Pay Rate", "key": "05", isLeaf: true },
            { "title": "Service Bill Rate", "key": "06", isLeaf: true },
            { "title": "Service Bill Qty", "key": "07", isLeaf: true },
            { "title": "Service Location/Activity Group", "key": "08", isLeaf: true },
            { "title": "Service Progrm", "key": "09", isLeaf: true },
            { "title": "Service Group", "key": "10", isLeaf: true },
            { "title": "Service HACC Type ", "key": "11", isLeaf: true },
            { "title": "Service Category", "key": "12", isLeaf: true },
            { "title": "Service Status", "key": "13", isLeaf: true },
            { "title": "Service Pay Type", "key": "14", isLeaf: true },
            { "title": "Service Pay Qty", "key": "15", isLeaf: true },
            { "title": "Service Bill Unit", "key": "16", isLeaf: true },
            { "title": "Service End Time/Shift End Time", "key": "17", isLeaf: true },
            { "title": "Service Funding Source", "key": "18", isLeaf: true },
            { "title": "Service Notes", "key": "19", isLeaf: true },
                      
          ]
          break;
          case "56": //STAFF Name and Address
          this.data = [
            { "title": "Title", "key": "00", isLeaf: true },
            { "title": "First Name", "key": "01", isLeaf: true },
            { "title": "Middle Name", "key": "02", isLeaf: true },
            { "title": "Surname/Orgnisation", "key": "03", isLeaf: true },
            { "title": "Preferred Name", "key": "04", isLeaf: true },
            { "title": "contact Address Line 1", "key": "05", isLeaf: true },
            { "title": "contact Address Line 2", "key": "06", isLeaf: true },
            { "title": "contact Address-Suburb", "key": "07", isLeaf: true },
            { "title": "contact Address-Postcode", "key": "08", isLeaf: true },
            { "title": "contact Address-state", "key": "09", isLeaf: true },
            { "title": "contact Address-GoogleAddress", "key": "10", isLeaf: true },
            { "title": "Usual Address Line 1", "key": "11", isLeaf: true },
            { "title": "Usual Address Line 2", "key": "12", isLeaf: true },
            { "title": "Usual Address-Suburb", "key": "13", isLeaf: true },
            { "title": "Usual Address-Postcode", "key": "14", isLeaf: true },
            { "title": "Usual Address-state", "key": "15", isLeaf: true },
            { "title": "Usual Address-GoogleAddress", "key": "16", isLeaf: true },
            { "title": "Billing Address Line 1", "key": "17", isLeaf: true },
            { "title": "Billing Address Line 2", "key": "18", isLeaf: true },
            { "title": "Billing Address-Suburb", "key": "19", isLeaf: true },
            { "title": "Billing Address-Postcode", "key": "20", isLeaf: true },
            { "title": "Billing Address-state", "key": "21", isLeaf: true },
            { "title": "Billing Address-GoogleAddress ", "key": "22", isLeaf: true },
            { "title": "Destination Address Line 1", "key": "23", isLeaf: true },
            { "title": "Destination Address Line 2", "key": "24", isLeaf: true },
            { "title": "Destination Address-Suburb", "key": "25", isLeaf: true },
            { "title": "Destination Address-Postcode", "key": "26", isLeaf: true },
            { "title": "Destination Address-state", "key": "27", isLeaf: true },
            { "title": "Destination Address-GoogleAddress", "key": "28", isLeaf: true },
            { "title": "Email", "key": "29", isLeaf: true },
            { "title": "Email-SMS", "key": "30", isLeaf: true },
            { "title": "FAX", "key": "31", isLeaf: true },
            { "title": "Home Phone", "key": "32", isLeaf: true },
            { "title": "Mobile Phone", "key": "33", isLeaf: true },
            { "title": "Usual Phone", "key": "34", isLeaf: true },
            { "title": "Work Phone", "key": "35", isLeaf: true },
            { "title": "Current Phone Number", "key": "36", isLeaf: true },
            { "title": "Other Phone Number", "key": "37", isLeaf: true },
            
                      
          ]
          break;
              


      default:
        this.data = [{}]
        break;
    }
     
    return this.data;

  }
  nzEvent(event: NzFormatEmitEvent): void {
  //  console.log(event);
    // load child async
    if (event.eventName === 'expand') {
      const node = event.node;
    //  console.log(event.keys)
      this.ContentSetter(event.keys);
      if (node?.getChildren().length === 0 && node?.isExpanded) {
        this.loadNode().then(data => {
          node.addChildren(data);
        });
      }
    }
    if (event.eventName === 'click' && event.keys[0].length < 3 ) {
// IncludeFundingSource  IncludeProgram  IncludeStaffAttributes  IncludePensions  IncludeExcluded  IncludeIncluded  IncludePreferences
//'' IncludeGoals  IncludeLoanItems  IncludeContacts  IncludeConsents  IncludeDocuments  IncludeUserGroups  IncludeReminders  IncludeStaffReminders  IncludeLeaves
//'' IncludeCaseStaff  IncludeCarePlans  IncludeServiceCompetencies  includeStaffIncidents  includeRecipIncidents  IncludeStaffUserGroups  IncludeStaffPreferences
//'' IncludeNursingDiagnosis  IncludeMedicalDiagnosis  IncludeMedicalProcedure  IncludeAgreedServices  IncludePlacements  IncludeCaseNotes
//'' IncludeRecipientOPNotes  IncludeRecipientClinicalNotes  IncludeStaffOPNotes  IncludeStaffHRNotes  IncludeONI  IncludeONIMainIssues
//'' IncludeONIOtherIssues  IncludeONICurrentServices  IncludeONIActionPlan  IncludeONIMedications  IncludeONIHealthConditions  IncludeStaffPosition
//'' IncludeDEX  IncludeCarerInfo  IncludeHACC  IncludeRecipBranches  includeHRRecipAttribute  IncludeRecipCompetencies  IncludeStaffLoanItems  IncludeCarePlan  IncludeGoalsAndStrategies  IncludeMentalHealth
      if(this.StrType == '06'){
      //  console.log("Carer Info")
      }
      
    //  console.log(event.keys[0])
      if (this.list == null){

        this.one  = [event.node.title]
      }
      else{
        
        this.one = [ ...this.list  , event.node.title  ]
        
      }
      
    this.FinalizeArray(this.one);
    

    }
  }
  loadNode(): Promise<NzTreeNodeOptions[]> {

    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve(
            this.data
            //  [ { title: 'Child Node', key: `${new Date().getTime()}-0` },
            //  { title: 'Child Node', key: `${new Date().getTime()}-1` }]
          ),
        100
      );
    });
  }
  FinalizeArray(node) { 
    this.frm_nodelist = true;  
    this.list = node;
    
    
    
    this.exportitemsArr = [...this.list,"Service Date", "Service Start Time", "Service Hours", "Service Code", "Service Location/Activity Group", "Service Program", "Service Group", "Service HACCType", "Service Category", "Service Pay Rate", "Service Bill Rate", "Service Bill Qty", "Service Status", "Service Pay Type", "Service Pay Qty", "Service Bill Unit", "Service Funding Source"]
    //this.inputForm.functionsArr
    //.addEventListener('change', SetValueFrame());

  }
  
  SetValueFrame() {
    if(this.inputForm.value.functionsArr == "BETWEEN")  {
      this.frm_SecondValue = true;
      this.frm_SecondVal = true;
    }else{
      this.frm_SecondValue = false;
      this.frm_SecondVal  = false;
    }
    
  }
  
  apply(){
    this.frm_delete = true;
    
    
    var temp,temp1,temp2 :Array<any>

      if (this.entity == null){
        this.entity  = [this.inputForm.value.exportitemsArr];
        this.condition  = [this.inputForm.value.functionsArr];
        this.value  = [this.inputForm.value.Arr];
        
        if(this.inputForm.value.functionsArr == "BETWEEN"){
          this.Endvalue  = [this.inputForm.value.valArr]; 
                   
        }
    } 
    else{
      this.entity =[...this.entity, this.inputForm.value.exportitemsArr];
      this.value = [...this.value, this.inputForm.value.Arr];
      this.condition = [...this.condition, this.inputForm.value.functionsArr];
      if(this.inputForm.value.functionsArr == "BETWEEN"){
        this.Endvalue  = [...this.Endvalue, this.inputForm.value.valArr];    
          
      }
      
    }
    if(this.RptFormat == "AGENCYSTFLIST" || this.RptFormat == "USERSTFLIST"){
      switch ((this.inputForm.value.exportitemsArr).toString()) {
        //STAFF NAME AND ADDRESS      
        case 'Title':
          this.ConditionEntity =  '   Staff.Title'
    break;
    case 'First Name':
          this.ConditionEntity =  '   Staff.FirstName'        
  break;
case 'Middle Name':
          this.ConditionEntity =  'Staff.MiddleNames'
    break;                   
  case 'Surname/Organisation':
            this.ConditionEntity =  'Staff.LastName'
    break;
    case 'Preferred Name':
            this.ConditionEntity =  'Staff.PreferredName'
    break; 
    case 'contact Address Line 1':               
    break;
    case 'contact Address Line 2':
      break;
    case 'contact Address-Suburb':           
    break;
    case 'contact Address-Postcode':
     break;
    case 'contact Address-state':
       break;
    case 'contact Address-GoogleAddress':
      break;
    case 'Usual Address Line 1 ':                   
    break;
    case 'Usual Address Line 2':                  
    break;
    case 'Usual Address-Suburb':          
    break;
    case 'Usual Address-Postcode':        
    break;
    case 'Usual Address-state':         
    break;
    case 'Usual Address-GoogleAddress':         
    break;    
case 'Billing Address Line 1':
break;
case 'Billing Address Line 2':        
break;
case 'Billing Address-Suburb':             
break;
case 'Billing Address-Postcode':   
break;
case 'Billing Address-state':        
break;
case 'Billing Address-GoogleAddress':        
break;
case 'Destination Address Line 1':         
break;
case 'Destination Address Line 2':         
break;
case 'Destination Address-Suburb ':        
break;
case 'Destination Address-Postcode':         
break;
case 'Destination Address-state':        
break;
case 'Destination Address-GoogleAddress':         
break;
case 'Email':         
break;      
case 'Email-SMS':               
break;
case 'FAX':        
break;
case 'Home Phone':         
break;
case 'Mobile Phone':         
break;
case 'Usual Phone':         
break;
case 'Work Phone':         
break;
case 'Current Phone Number':       
break;
case 'Other Phone Number':         
break;
//  Contacts & Next of Kin
    case 'Contact Group':
               this.ConditionEntity =  'HR.[Group]'
          break;
    case 'Contact Type':
               this.ConditionEntity =  ' HR.[Type]'
          break;
    case 'Contact Sub Type':
              this.ConditionEntity =  'HR.[SubType]'
          break;
    case 'Contact User Flag':
             this.ConditionEntity =  ' HR.[User1]'
          break;                 
    case 'Contact Person Type':
            this.ConditionEntity =  ' HR.[EquipmentCode]'
          break;
    case 'Contact Name':
             this.ConditionEntity =  ' HR.[Name]'
          break;
    case 'Contact Address':
          this.ConditionEntity =  'HR.[Address1]'
          break;
    case 'Contact Suburb':
            this.ConditionEntity =  '  HR.[Suburb]'
          break;
    case 'Contact Postcode':
            this.ConditionEntity =  '  HR.[Postcode]'
          break;
    case 'Contact Phone 1':
            this.ConditionEntity =  ' HR.[Phone1]'
          break;
    case 'Contact Phone 2':
            this.ConditionEntity =  '  HR.[Phone2]'
          break;
    case 'Contact Mobile': 
            this.ConditionEntity =  '  HR.[Mobile]'
          break;
    case 'Contact FAX':
            this.ConditionEntity =  '  HR.[FAX]'
          break;
    case 'Contact Email':
            this.ConditionEntity =  ' HR.[Email]'
          break;


      }

    }else{
        
        switch ((this.inputForm.value.exportitemsArr).toString()) {
          //NAME AND ADDRESS
          case 'First Name':
            this.ConditionEntity = 'R.FirstName'
            break;
          case 'Title':
            this.ConditionEntity ='R.title'       
              break;
          case 'Surname/Organisation':
            this.ConditionEntity ='R.[Surname/Organisation]'        
              break;
          case 'Preferred Name':
            this.ConditionEntity ='R.PreferredName'
              break;                  
          case 'Other':                  
              break;
          case 'Address-Line1':
            this.ConditionEntity ='R.Address1'        
              break;
          case 'Address-Line2':
            this.ConditionEntity ='R.Address2'     
              break;
          case 'Address-Suburb':
            this.ConditionEntity ='R.Suburb'     
              break;
          case 'Address-Postcode':
            this.ConditionEntity ='R.Postcode'        
              break;
          case 'Address-State':
            this.ConditionEntity ='R.State'        
              break;
//General Demographics             
          case 'Full Name-Surname First':
            this.ConditionEntity = '(R.[Surname/Organisation]' + ' + ' +' FirstName)'
              break;
          case 'Full Name-Mailing':
            this.ConditionEntity = '(R.[Surname/Organisation] ' + ' + ' +' FirstName)'  
                  break;
                                 
          case 'Gender':
            this.ConditionEntity = 'R.Gender'
              break;
          case 'Date Of Birth':
                this.ConditionEntity = 'R.DateOfBirth'
              break;            
          case 'Age':
                this.ConditionEntity = ' DateDiff(YEAR,R.Dateofbirth,GetDate())'
              break;
          case 'Ageband-Statistical':
                 this.ConditionEntity = "DATEDIFF(YEAR, R.DateOfBirth,  GETDATE() )"
              break;
          case 'Ageband-5 Year':
                 this.ConditionEntity = "DATEDIFF(YEAR, R.DateOfBirth,  GETDATE() )"
              break;
          case 'Ageband-10 Year':
                 this.ConditionEntity = "DATEDIFF(YEAR, R.DateOfBirth,  GETDATE() )"
              break;
              case 'Age-ATSI Status':
              //  this.ConditionEntity =''
              break;
          case 'Month Of Birth':
                 this.ConditionEntity =   'DateName(Month, DateOfBirth)'
              break;
          case 'Day Of Birth No.':
                 this.ConditionEntity =   'DateName(Weekday, DateOfBirth)'
              break;
          case 'CALD Score':
                this.ConditionEntity =    'DataDomains.CALDStatus'
              break;                     
          case 'Country Of Birth':
                this.ConditionEntity =  'R.CountryOfBirth'
              break;
          case 'Language':
                this.ConditionEntity = 'R.HomeLanguage'
              break;              
          case 'Indigenous Status':
                this.ConditionEntity = 'R.IndiginousStatus'
              break;
          case 'Primary Disability':
                this.ConditionEntity = 'R.PermDisability'
              break;
          case 'Financially Dependent':
                this.ConditionEntity = 'R.[FDP]'
              break;
          case 'Financial Status':
                this.ConditionEntity = 'R.FinancialStatus'
              break;          
          case 'Occupation':
                this.ConditionEntity = 'R.Occupation'
                break;
                //Admin Info
          case 'UniqueID':
                this.ConditionEntity = 'R.UniqueID'
              break;
          case 'Code':
                 this.ConditionEntity = 'R.[AccountNo]'
                break;
          case 'Type':
                this.ConditionEntity ='R.[Type]'
                break;             
          case 'Category':
                 //this.ConditionEntity =''
              break;
          case 'CoOrdinator':
                this.ConditionEntity = 'R.RECIPIENT_CoOrdinator'
              break;
          case 'Admitting Branch':
                this.ConditionEntity = 'R.BRANCH'
              break;
          case 'Secondary Branch':
              //  this.ConditionEntity =''
              break;  
          case 'File number':
              //  this.ConditionEntity =''
              break;
          case 'File Number 2':
              //  this.ConditionEntity =''
              break;                     
          case 'NDIA/MAC Number':
                this.ConditionEntity = 'R.NDISNumber'
              break;     
          case 'Last Activated Date':
              //  this.ConditionEntity =''
                break;
          case 'Created By':
                this.ConditionEntity = 'R.CreatedBy'
              break;
          case 'Other':
              //  this.ConditionEntity =''
                break; 
                //Staff       
          case 'Staff Name':
          //  this.ConditionEntity =  S.FIRSTNAME + ' ' + S.LASTNAME
                break;
          case 'Program Name':
          //  this.ConditionEntity =  
                break;
          case 'Notes':
            this.ConditionEntity =  'R.Notes'
                break;
                //Other Genral info
          case 'OH&S Profile':
            this.ConditionEntity =  'R.OHSProfile'
                break;
          case 'OLD WH&S Date':
             this.ConditionEntity =  'R.[WH&S]'
                break;
          case 'Billing Profile':
            this.ConditionEntity =  'R.BillProfile'
                break;                       
          case 'Sub Category':
             this.ConditionEntity =  'R.[UBDMap]'
                break;
          case 'Roster Alerts':
             this.ConditionEntity =  'R.[Notes]'
                break;
          case 'Timesheet Alerts':
             this.ConditionEntity =  'R.[SpecialConsiderations]'
                break;                 
          case 'Contact Issues':
            this.ConditionEntity =  'R.ContactIssues'
                break;
          case 'Survey Consent Given':
            this.ConditionEntity =  'R.SurveyConsent'
                break;
          case 'Copy Rosters Enabled':
            this.ConditionEntity =  'R.Autocopy'
                break;           
          case 'Activation Date':
           // this.ConditionEntity =  
                break;
          case 'DeActivation Date':
           // this.ConditionEntity =  
                break;
          case 'Mobility':
            this.ConditionEntity =  'R.Mobility'
                break;
          case 'Specific Competencies':
            this.ConditionEntity =  'R.SpecialConsiderations'
                break;                           
//  Contacts & Next of Kin
          case 'Contact Group':
            this.ConditionEntity =  'HR.[Group]'
                break;
          case 'Contact Type':
            this.ConditionEntity =  'HR.[Type]'
                break;
          case 'Contact Sub Type':
            this.ConditionEntity = 'HR.[SubType]' 
                break;
          case 'Contact User Flag':
            this.ConditionEntity =  'HR.[User1]'
                break;
          case 'Contact Person Type':
            this.ConditionEntity =  'HR.[EquipmentCode]'
                break;
          case 'Contact Name':
            this.ConditionEntity =   'HR.[Name]'
                break;
          case 'Contact Address':
            this.ConditionEntity =  'HR.[Address1]'
               break;
          case 'Contact Suburb':
            this.ConditionEntity = 'HR.[Suburb]' 
                break;                
          case 'Contact Postcode':
            this.ConditionEntity = 'HR.[Postcode]' 
                break;
          case 'Contact Phone 1':
            this.ConditionEntity =   'HR.[Phone1]'
                break;
          case 'Contact Phone 2':
            this.ConditionEntity =  'HR.[Phone2]'
                break;
          case 'Contact Mobile':
            this.ConditionEntity =  'HR.[Mobile]'
                break;
          case 'Contact FAX':
            this.ConditionEntity =  'HR.[FAX]'
                break;
          case 'Contact Email':
            this.ConditionEntity =  'HR.[Email]'
                break;
//Carer Info                
          case 'Carer First Name':
             this.ConditionEntity = 'C.FirstName' 
                break;
          case 'Carer Last Name':
             this.ConditionEntity =  'C.[Surname/Organisation]'
                break;
                case 'Carer Age':
             this.ConditionEntity =  'DateDiff(YEAR,C.Dateofbirth,GetDate())'
                break;                 
          case 'Carer Gender':
             this.ConditionEntity =  'C.[Gender]'
                break;
          case 'Carer Indigenous Status':
             this.ConditionEntity =  'C.[IndiginousStatus]'
                break;                       
          case 'Carer Address':
             this.ConditionEntity =  "N.Address1 + ' ' +  N.Suburb + ' ' + N.Postcode"
                break;
          case 'Carer Email':
             this.ConditionEntity =  'PE.Detail'
                break;
          case 'Carer Phone <Home>':
             this.ConditionEntity =  'PhHome.Detail'
                break;
          case 'Carer Phone <Work>':
             this.ConditionEntity =  'PhWork.Detail'
                break;
          case 'Carer Phone <Mobile>':
             this.ConditionEntity =  'PhMobile.Detail'
                break;
// Documents                
          case 'DOC_ID':
             this.ConditionEntity =  'doc.DOC_ID'
                break;
          case 'Doc_Title':
             this.ConditionEntity =  'doc.Title'
                break;
          case 'Created':
             this.ConditionEntity =  'doc.Created'
                break;                
          case 'Modified':
             this.ConditionEntity =  'doc.Modified'
                break;
          case 'Status':
             this.ConditionEntity =  'doc.Status'
                break;                                
          case 'Classification':
             this.ConditionEntity =  'doc.Classification'
                break;
          case 'Category':
             this.ConditionEntity =  'doc.Category'
                break;
          case 'Filename':
             this.ConditionEntity =  'doc.Filename'
                break;
          case 'Doc#':
               this.ConditionEntity =  'doc.Doc#'
                  break;
          case 'DocStartDate':
               this.ConditionEntity =  'doc.DocStartDate'
                  break;
          case 'DocEndDate':
               this.ConditionEntity =  'doc.DocEndDate'
                  break;
          case 'AlarmDate':
               this.ConditionEntity =   'doc.AlarmDate'
                  break;                          
          case 'AlarmText':
               this.ConditionEntity =  'doc.AlarmText'
                  break;
 //Consents                  
          case 'Consent':
               this.ConditionEntity =  'Cons.[Name]'
                  break;
          case 'Consent Start Date':
               this.ConditionEntity =  'Cons.[Date1]'
                  break;                  
          case 'Consent Expiry':
               this.ConditionEntity =  'Cons.[Date2]'
                  break;
          case 'Consent Notes':
               this.ConditionEntity = 'Cons.[Notes]' 
                  break;
 //  GOALS OF CARE                  
          case 'Goal':
               this.ConditionEntity =  'Goalcare.[User1]'
                  break;               
          case 'Goal Detail':
               this.ConditionEntity =  'Goalcare.[Notes]'
                  break;
          case 'Goal Achieved':
               this.ConditionEntity =  'Goalcare.[Completed]'
                  break;
          case 'Anticipated Achievement Date':
               this.ConditionEntity =  'Goalcare.[Date1]'
                  break;
          case 'Date Achieved':
               this.ConditionEntity =  'Goalcare.[DateInstalled]'
                  break;                  
          case 'Last Reviewed':
               this.ConditionEntity =  'Goalcare.[Date2]'
                  break;          
          case 'Logged By':
               this.ConditionEntity =  'Goalcare.[Creator]'
                  break;
//REMINDERS                  
          case 'Reminder Detail':
               this.ConditionEntity =  'Remind.[Name]'
                  break;
          case 'Event Date':
               this.ConditionEntity =  'Remind.[Date2]'
                  break;                                    
          case 'Reminder Date':
               this.ConditionEntity =  'Remind.[Date1]'
                  break;
          case 'Reminder Notes':
               this.ConditionEntity =  'Remind.[Notes]'
                  break;
// USER GROUPS                  
          case 'Group Name':
               this.ConditionEntity =  'UserGroup.[Name]'
                  break;
          case 'Group Note':
               this.ConditionEntity = 'UserGroup.[Notes]' 
                  break;
          case 'Group Start Date':
                 this.ConditionEntity =  'UserGroup.[Date1]'
                  break;                                 
          case 'Group End Date':
                 this.ConditionEntity = 'UserGroup.[Date2]'
                  break;
          case 'Group Email':
                 this.ConditionEntity = 'UserGroup.[Email]'
                  break; 
//Preferences 
                                 
          case 'Preference Name':
               this.ConditionEntity = 'Prefr.[Name]' 
                  break;
          case 'Preference Note':
               this.ConditionEntity =  'Prefr.[Notes]'
                  break;
// FIXED REVIEW DATES                   
          case 'Review Date 1':
               this.ConditionEntity =  'R.[OpReASsessmentDate]'
                  break;
          case 'Review Date 2':
               this.ConditionEntity =  'R.[ClinicalReASsessmentDate]'
                  break;
          case 'Review Date 3':
               this.ConditionEntity =  'R.[FileReviewDate]'
                  break;           
//Staffing Inclusions/Exclusions                  
          case 'Excluded Staff':
               this.ConditionEntity =  'ExcludeS.[Name]'
                  break;
          case 'Excluded_Staff Notes':
               this.ConditionEntity =  'ExcludeS.[Notes]'
                  break;                                    
          case 'Included Staff':
               this.ConditionEntity =  'IncludS.[Name]'
                  break;
          case 'Included_Staff Notes':
               this.ConditionEntity =  'IncludS.[Notes]'
                  break;                 
// AGREED FUNDING INFORMATION                         
          case 'Funding Source':
               this.ConditionEntity = 'HumanResourceTypes.[Type]' 
                  break;
          case 'Funded Program':
               this.ConditionEntity =  'RecipientPrograms.[Program]'
                  break;
          case 'Funded Program Agency ID':
           //    this.ConditionEntity =  
                  break;                  
          case 'Program Status':
               this.ConditionEntity =  'RecipientPrograms.[ProgramStatus]'
                  break;
          case 'Program Coordinator':
               this.ConditionEntity =  'HumanResourceTypes.[Address2]'
                  break;
          case 'Funding Start Date':
               this.ConditionEntity =  'RecipientPrograms.[StartDate]'
                  break;
          case 'Funding End Date':
               this.ConditionEntity = 'RecipientPrograms.[ExpiryDate]' 
                  break;
          case 'AutoRenew':
               this.ConditionEntity =  'RecipientPrograms.[AutoRenew]'
                  break;                  
          case 'Rollover Remainder':
               this.ConditionEntity =  'RecipientPrograms.[RolloverRemainder]'
                  break;
          case 'Funded Qty':
               this.ConditionEntity =  'RecipientPrograms.[Quantity]'
                  break;
          case 'Funded Type':
               this.ConditionEntity =  'RecipientPrograms.[ItemUnit]'
                  break;
          case 'Funding Cycle':
            //  this.ConditionEntity =  
                  break;
          case 'Funded Total Allocation':
               this.ConditionEntity =  'RecipientPrograms.[TotalAllocation]'
                  break;
          case 'Used':
               this.ConditionEntity =  'RecipientPrograms.[Used]'
                  break;
          case 'Remaining':
               this.ConditionEntity =  '(RecipientPrograms.[TotalAllocation] - RecipientPrograms.[Used])'
                  break;
//LEGACY CARE PLAN                  
          case 'Name':
               this.ConditionEntity =   'CarePlanItem.[PlanName]'
                  break;                                    
          case 'Start Date':
               this.ConditionEntity =  'CarePlanItem.[PlanStartDate]'
                  break;
          case 'End Date':
               this.ConditionEntity =  'CarePlanItem.[PlanEndDate]'
                  break;                  
          case 'Details':
               this.ConditionEntity =  'CarePlanItem.[PlanDetail]'
                  break;
          case 'Reminder Date':
               this.ConditionEntity =  'CarePlanItem.[PlanReminderDate]'
                  break;
          case 'Reminder Text':
               this.ConditionEntity =  'CarePlanItem.[PlanReminderText]'
                  break;   
//Agreed Service Information                   
          case 'Agreed Service Code':
               this.ConditionEntity =  'ServiceOverview.[Service Type]'
                  break;
          case 'Agreed Program':
               this.ConditionEntity =  'ServiceOverview.[ServiceProgram]'
                  break;
          case 'Agreed Service Billing Rate':
               this.ConditionEntity =  'ServiceOverview.[Unit Bill Rate]'
                  break;
          case 'Agreed Service Status':
               this.ConditionEntity =  'ServiceOverview.[ServiceStatus]'
                  break;
          case 'Agreed Service Duration':
               this.ConditionEntity =  'ServiceOverview.[Duration]'
                  break;                 
          case 'Agreed Service Frequency':
               this.ConditionEntity =  'ServiceOverview.[Frequency]'
                  break;
          case 'Agreed Service Cost Type':
               this.ConditionEntity =  'ServiceOverview.[Cost Type]'
                  break;
          case 'Agreed Service Unit Cost':
               this.ConditionEntity =  'ServiceOverview.[Unit Pay Rate]'
                  break;
          case 'Agreed Service Billing Unit':
               this.ConditionEntity = 'ServiceOverview.[UnitType]' 
                  break;
          case 'Agreed Service Debtor':
               this.ConditionEntity =  'ServiceOverview.[ServiceBiller]'
                  break;                  
          case 'Agreed Service Agency ID':
               this.ConditionEntity =  'HRAgreedServices.[Address1]'
                  break;
 //  CLINICAL INFORMATION                  
          case 'Nursing Diagnosis':
               this.ConditionEntity =  'NDiagnosis.[Description]'
                  break;
          case 'Medical Diagnosis':
               this.ConditionEntity =  'MDiagnosis.[Description]'
                  break;
          case 'Medical Procedure':
               this.ConditionEntity =  'MProcedures.[Description]'
                  break;
 //PANZTEL Timezone 
          case 'PANZTEL Timezone':
               this.ConditionEntity =  'R.[RECIPIENT_TIMEZONE]'
                  break;               
          case 'PANZTEL PBX Site':
               this.ConditionEntity =  'R.[RECIPIENT_PBX]'
                  break;
          case 'PANZTEL Parent Site':
               this.ConditionEntity =  'R.[RECIPIENT_PARENT_SITE]'
                  break;                  
          case 'DAELIBS Logger ID':
               this.ConditionEntity =  'R.[DAELIBSID]'
                  break;
//INSURANCE AND PENSION                  
          case 'Medicare Number':
               this.ConditionEntity =  'R.[MedicareNumber]'
                  break;
          case 'Medicare Recipient ID':
               this.ConditionEntity =  'R.[MedicareRecipientID]'
                  break;
          case 'Pension Status':
               this.ConditionEntity =  'R.[PensionStatus]'
                  break;
          case 'Unable to Determine Pension Status':
               this.ConditionEntity =  'R.[PensionVoracity]'
                  break;
          case 'Concession Number':
               this.ConditionEntity =  'R.[ConcessionNumber]'
                  break;
          case 'DVA Benefits Flag':
               this.ConditionEntity =  'R.[DVABenefits]'
                  break;                  
          case 'DVA Number':
               this.ConditionEntity =  'R.[DVANumber]'
                  break;
          case 'DVA Card Holder Status':
               this.ConditionEntity =  'R.[RECIPT_DVA_Card_Holder_Status]'
                  break;
          case 'Ambulance Subscriber':
               this.ConditionEntity =  'R.[Ambulance]'
                  break;
          case 'Ambulance Type':
               this.ConditionEntity =  'R.[AmbulanceType]'
                  break;
          case 'Pension Name':
               this.ConditionEntity =  'RecipientPensions.[Pension Name]'
                  break;
          case 'Pension Number':
               this.ConditionEntity =  'RecipientPensions.[Pension Number]'
                  break;
          case 'Will Available':
               this.ConditionEntity =  'R.[WillAvailable]'
                  break;         
          case 'Will Location':
               this.ConditionEntity =  'R.[WhereWillHeld]'
                  break;
          case 'Funeral Arrangements':
               this.ConditionEntity =  'R.[FuneralArrangements]'
                  break;
          case 'Date Of Death':
               this.ConditionEntity =  'R.[DateOfDeath]'
                  break;
//HACCS DATSET FIELDS                  
          case 'HACC-SLK':
               this.ConditionEntity =  'RHACC.[HACC-SLK]'
                  break;
          case 'HACC-First Name':
               this.ConditionEntity =  'R.[FirstName]'
                  break;
          case 'HACC-Surname':
               this.ConditionEntity =  'R.[Surname/Organisation]'
                  break;
          case 'HACC-Referral Source':
               this.ConditionEntity =  'R.[ReferralSource]'
                  break;
          case 'HACC-Date Of Birth':
               this.ConditionEntity =  'R.[DateOfBirth]'
                  break;
          case 'HACC-Date Of Birth Estimated':
               this.ConditionEntity =  'R.[CSTDA_BDEstimate]'
                  break;                
          case 'HACC-Gender':
               this.ConditionEntity =  'R.[Gender]'
                  break;
          case 'HACC-Area Of Residence':
               this.ConditionEntity =  'R.[Suburb]'
                  break;
          case 'HACC-Country Of Birth':
               this.ConditionEntity = 'R.[CountryOfBirth]' 
                  break;
          case 'HACC-Preferred Language,':
               this.ConditionEntity =  'R.[HomeLanguage]'
                  break;
          case 'HACC-Indigenous Status':
               this.ConditionEntity =  'R.[IndiginousStatus]'
                  break;
          case 'HACC-Living Arrangements':
               this.ConditionEntity =  'R.[LivingArrangements]'
                  break;
          case 'HACC-Dwelling/Accomodation':
               this.ConditionEntity =  'R.[DwellingAccomodation]'
                  break;
          case 'HACC-Main Reasons For Cessation':
               this.ConditionEntity =  'DATADOMAINS.[DESCRIPTION]'
                  break;
          case 'HACC-Pension Status':
               this.ConditionEntity =  'R.[PensionStatus]'
                  break;              
          case 'HACC-Primary Carer':
               this.ConditionEntity =  'R.[DatasetCarer]'
                  break;
          case 'HACC-Carer Availability':
               this.ConditionEntity =  'R.[CarerAvailability]'
                  break;
          case 'HACC-Carer Residency':
               this.ConditionEntity =  'R.[CarerResidency]'
                  break;
          case 'HACC-Carer Relationship':
               this.ConditionEntity =  'R.[CarerRelationship]'
                  break;
          case 'HACC-Exclude From Collection':
               this.ConditionEntity =  'R.[ExcludeFromStats]'
                  break;                                
          case 'HACC-Housework':
                this.ConditionEntity =  'R.[ONIFProfile1]'
                  break;
          case 'HACC-Transport':
               this.ConditionEntity =  'R.[ONIFProfile2]'
                  break;
          case 'HACC-Shopping':
               this.ConditionEntity =  'R.[ONIFProfile3]'
                  break;
          case 'HACC-Medication':
               this.ConditionEntity =  'R.[ONIFProfile4]'
                  break;
          case 'HACC-Money':
               this.ConditionEntity =  'R.[ONIFProfile5]'
                  break;
          case 'HACC-Walking':
               this.ConditionEntity =  'R.[ONIFProfile6]'
                  break;
          case 'HACC-Bathing':
               this.ConditionEntity =  'R.[ONIFProfile7]'
                  break;
          case 'HACC-Memory':
               this.ConditionEntity =  'R.[ONIFProfile8]'
                  break;
          case 'HACC-Behaviour':
               this.ConditionEntity =  'R.[ONIFProfile9]'
                  break;
          case 'HACC-Communication':
               this.ConditionEntity =  'ONI.[FPA_Communication]'
                  break;
          case 'HACC-Eating':
               this.ConditionEntity =  'ONI.[FPA_Eating]'
                  break;
          case 'HACC-Toileting':
               this.ConditionEntity =  'ONI.[FPA_Toileting]'
                  break;
          case 'HACC-GetUp':
               this.ConditionEntity =  'ONI.[FPA_GetUp]'
                  break;        
          case 'HACC-Carer More Than One':
               this.ConditionEntity =  'R.[CARER_MORE_THAN_ONE]'
                  break;
//"DEX"                  
          case 'DEX-Exclude From MDS':
               this.ConditionEntity =  'R.ExcludeFromStats'
                  break;
          case 'DEX-Referral Purpose':
               this.ConditionEntity =  'DSS.ReferralPurpose'
                  break;
          case 'DEX-Referral Source':
               this.ConditionEntity =  'DSS.[DEXREFERRALSOURCE]'
                  break;
          case 'DEX-Referral Type':
               this.ConditionEntity =  'DSS.ReferralType'
                  break;
          case 'DEX-Reason For Assistance':
               this.ConditionEntity =  'DSS.AssistanceReason'
                  break;
          case 'DEX-Consent To Provide Information':
               this.ConditionEntity =  'DSS.[DEX-Consent To Provide Information]'
                  break;
          case 'DEX-Consent For Future Contact':
               this.ConditionEntity =  'DSS.[DEX-Consent For Future Contact]'
                  break;          
          case 'DEX-Sex':
               this.ConditionEntity =  'R.Gender'
                  break;
          case 'DEX-Date Of Birth':
               this.ConditionEntity =  'R.DateOfBirth'
                  break;                 
          case 'DEX-Estimated Birth Date':
               this.ConditionEntity =  'R.CSTDA_BDEstimate'
                  break;
          case 'DEX-Indigenous Status':
               this.ConditionEntity =  'DSS.DexIndiginousStatus'
                  break;
          case 'DEX-DVA Card Holder Status':
               this.ConditionEntity =  'ONI.HACCDVACardHolderStatus'
                  break;            
          case 'DEX-Has Disabilities':
               this.ConditionEntity =  'DSS.HasDisabilities'
                  break;        
          case 'DEX-Has A Carer':
               this.ConditionEntity =  'DSS.HasCarer'
                  break;
          case 'DEX-Country of Birth':
               this.ConditionEntity =  'R.CountryOfBirth'
                  break;
          case 'DEX-First Arrival Year':
               this.ConditionEntity =  'DSS.FirstArrivalYear'
                  break;               
          case 'DEX-First Arrival Month':
               this.ConditionEntity =  'DSS.FirstArrivalMonth'
                  break;
          case 'DEX-Visa Code':
               this.ConditionEntity =  'DSS.VisaCategory'
                  break;
          case 'DEX-Ancestry':
               this.ConditionEntity =  'DSS.Ancestry'
                  break;
          case 'DEX-Main Language At Home':
               this.ConditionEntity =  'R.HomeLanguage'
                  break;
          case 'DEX-Accomodation Setting':
               this.ConditionEntity =  'DSS.DEXACCOMODATION'
                  break;
          case 'DEX-Is Homeless':
               this.ConditionEntity =  'DSS.IsHomeless'
                  break;
          case 'DEX-Household Composition':
               this.ConditionEntity =  'DSS.HouseholdComposition'
                  break;
          case 'DEX-Main Source Of Income':
               this.ConditionEntity =  'DSS.MainIncomSource'
                  break;
          case 'DEX-Income Frequency':
               this.ConditionEntity =  'DSS.IncomFrequency'
                  break;                
          case 'DEX-Income Amount':
               this.ConditionEntity =  'DSS.IncomeAmount'
                  break; 
// CSTDA Dataset Fields                  
          case 'CSTDA-Date Of Birth':
               this.ConditionEntity =  'R.[DateOfBirth]'
                  break;
          case 'CSTDA-Gender':
               this.ConditionEntity =  'R.[CSTDA_Sex]'
                  break;
          case 'CSTDA-DISQIS ID':
               this.ConditionEntity =  'R.[CSTDA_ID]'
                  break;
          case 'CSTDA-Indigenous Status':
               this.ConditionEntity =  'R.[CSTDA_Indiginous]'
                  break;
          case 'CSTDA-Country Of Birth':
               this.ConditionEntity =  'R.[CountryOfBirth]'
                  break;
                  
          case 'CSTDA-Interpreter Required':
               this.ConditionEntity =  'R.[CSTDA_Interpreter]'
                  break;
          case 'CSTDA-Communication Method':
               this.ConditionEntity =  'R.[CSTDA_Communication]'
                  break;
          case 'CSTDA-Living Arrangements':
               this.ConditionEntity =  'R.[CSTDA_LivingArrangements]'
                  break;
          case 'CSTDA-Suburb':
               this.ConditionEntity =  'R.[Suburb]'
                  break;
          case 'CSTDA-Postcode':
               this.ConditionEntity =  'R.[Postcode]'
                  break;
          case 'CSTDA-State':
               this.ConditionEntity = 'R.[State]'
                  break;
          case 'CSTDA-Residential Setting':
               this.ConditionEntity =  'R.[CSTDA_ResidentialSetting]'
                  break;
          case 'CSTDA-Primary Disability Group':
               this.ConditionEntity =  'R.[CSTDA_DisabilityGroup]'
                  break;
          case 'CSTDA-Primary Disability Description':
               this.ConditionEntity =  'ONI.[CSTDA_PrimaryDisabilityDescription]'
                  break;
          case 'CSTDA-Intellectual Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherIntellectual]'
                  break;
          case 'CSTDA-Specific Learning ADD Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherADD]'
                  break;
          case 'STDA-Autism Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherAutism]'
                  break;
          case 'CSTDA-Physical Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherPhysical]'
                  break;  
          case 'CSTDA-Acquired Brain Injury Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherAcquiredBrain]'
                  break;
          case 'CSTDA-Neurological Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherNeurological]'
                  break;
          case 'CSTDA-Deaf Blind Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherDeafBlind]'
                  break;
          case 'CSTDA-Psychiatric Disability':
               this.ConditionEntity =  'R.[CSTDA_Psychiatric]'
                  break;
          case 'CSTDA-Other Psychiatric Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherPsychiatric]'
                  break;
          case 'CSTDA-Vision Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherVision]'
                  break;
          case 'CSTDA-Hearing Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherHearing]'
                  break;
          case 'CSTDA-Speech Disability':
               this.ConditionEntity =  'R.[CSTDA_OtherSpeech]'
                  break;
          case 'CSTDA-Developmental Delay Disability':
               this.ConditionEntity =  'R.[CSTDA_DevelopDelay]'
                  break;
          case 'CSTDA-Disability Likely To Be Permanent':
               this.ConditionEntity =  'R.[PermDisability]'
                  break;
          case 'CSTDA-Support Needs-Self Care':
               this.ConditionEntity = ' R.[CSTDA_SupportNeeds_SelfCare]'
                  break;
          case 'CSTDA-Support Needs-Mobility':
               this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Mobility]'
                  break;
          case 'CSTDA-Support Needs-Communication':
               this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Communication]'
                  break;
          case 'CSTDA-Support Needs-Interpersonal':
               this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Relationships]'
                  break; 
          case 'CSTDA-Support Needs-Learning':
               this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Learning]'
                  break;
          case 'CSTDA-Support Needs-Education':
               this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Education]'
                  break;
          case 'CSTDA-Support Needs-Community':
                this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Community]'
                  break;
          case 'CSTDA-Support Needs-Domestic':
                this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Domestic]'
                  break;
          case 'CSTDA-Support Needs-Working':
                this.ConditionEntity =  'R.[CSTDA_SupportNeeds_Domestic]'
                  break;                 
          case 'CSTDA-Carer-Existence Of Informal':
                this.ConditionEntity =  'R.[CSTDA_CarerExists]'
                  break;
          case 'CSTDA-Carer-Assists client in ADL':
               this.ConditionEntity =  'R.[CSTDA_CarerStatus]'
                  break;
          case 'CSTDA-Carer-Lives In Same Household':
               this.ConditionEntity =  'R.[CSTDA_CarerResidencyStatus]'
                  break;
          case 'CSTDA-Carer-Relationship':
               this.ConditionEntity =  'R.[CSTDA_CarerRelationship]'
                  break;
          case 'CSTDA-Carer-Age Group':
               this.ConditionEntity =  'R.[CSTDA_CarerAgeGroup]'
                  break;
          case 'CSTDA-Carer Allowance to Guardians':
               this.ConditionEntity =  'R.[CSTDA_CarerAllowance]'
                  break;
          case 'CSTDA-Labour Force Status':
               this.ConditionEntity =  'R.[CSTDA_LaborStatus]'
                  break;
          case 'CSTDA-Main Source Of Income':
               this.ConditionEntity =  'R.[CSTDA_MainIncome]'
                  break;
          case 'CSTDA-Current Individual Funding':
               this.ConditionEntity =  'R.[CSTDA_FundingStatus]'
                  break;
//NRCP Dataset Fields                  
          case 'NRCP-First Name':
               this.ConditionEntity =  'R.[FirstName]'
                  break;         
          case 'NRCP-Surname':
               this.ConditionEntity =  'R.[Surname/Organisation]'
                  break;
          case 'NRCP-Date Of Birth':
               this.ConditionEntity =  'R.[DateOfBirth]'
                  break;
          case 'NRCP-Gender':
               this.ConditionEntity =  'R.[Gender]'
                  break;
          case 'NRCP-Suburb':
               this.ConditionEntity =  'R.[Suburb]'
                  break;
          case 'NRCP-Country Of Birth':
               this.ConditionEntity =  'R.[CountryOfBirth]'
                  break;                
          case 'NRCP-Preferred Language':
               this.ConditionEntity =  'R.[HomeLanguage]'
                  break;
          case 'NRCP-Indigenous Status':
               this.ConditionEntity =  'R.[IndiginousStatus]'
                  break;                 
          case 'NRCP-Marital Status':
               this.ConditionEntity =  'R.[MaritalStatus]'
                  break;
          case 'NRCP-DVA Card Holder Status':
               this.ConditionEntity =  'R.[RECIPT_DVA_Card_Holder_Status]'
                  break;
          case 'NRCP-Paid Employment Participation':
               this.ConditionEntity =  'R.[RECIPT_Paid_Employment_Participation]'
                  break;
          case 'NRCP-Pension Status':
               this.ConditionEntity =  'R.[NRCP_GovtPensionStatus]'
                  break;
          case 'NRCP-Carer-Date Role Commenced':
               this.ConditionEntity =  'R.[RECIPT_Date_Caring_Role_Commenced]'
                  break;
          case 'NRCP-Carer-Role':
               this.ConditionEntity =  'R.[RECIPT_Care_Role]'
                  break;
          case 'NRCP-Carer-Need':
               this.ConditionEntity =  'R.[RECIPT_Care_Need]'
                  break;
          case 'NRCP-Carer-Number of Recipients':
               this.ConditionEntity =  'R.[RECIPT_Number_Care_Recipients]'
                  break;
          case 'NRCP-Carer-Time Spent Caring':
               this.ConditionEntity =  'R.[RECIPT_Time_Spent_Caring]'
                  break;
          case 'NRCP-Carer-Current Use Formal Services':
               this.ConditionEntity =  'R.[NRCP_CurrentUseFormalServices]'
                  break;
          case 'NRCP-Carer-Informal Support':
               this.ConditionEntity =  'R.[NRCP_InformalSupport]'
                  break;
          case 'NRCP-Recipient-Challenging Behaviour':
               this.ConditionEntity =  'R.[RECIPT_Challenging_Behaviour]'
                  break;
          case 'NRCP-Recipient-Primary Disability':
               this.ConditionEntity =  'R.[RECIPT_Care_Recipients_Primary_Disability]'
                  break;         
          case 'NRCP-Recipient-Primary Care Needs':
               this.ConditionEntity =  'R.[RECIPT_Care_Recipients_Primary_Care_Needs]'
                  break;
          case 'NRCP-Recipient-Level of Need':
               this.ConditionEntity =  'R.[RECIPT_Care_Recipients_Level_Need]'
                  break;
          case 'NRCP-Recipient-Primary Carer':
               this.ConditionEntity =  'R.[DatasetCarer]'
                  break;
          case 'NRCP-Recipient-Carer Relationship':
               this.ConditionEntity =  'R.[NRCP_CarerRelationship]'
                  break;
          case 'NRCP-Recipient-Carer Co-Resident':
               this.ConditionEntity =  'R.[NRCP_CarerCoResidency]'
                  break;
          case 'NRCP-Recipient-Dementia':
               this.ConditionEntity =  'R.[RECIPT_Dementia]'
                  break;
        /*  case 'NRCP-CALD Background':
              this.ConditionEntity =  
                  break; */
// "ONI-Core"  
                
          case 'ONI-Family Name':
               this.ConditionEntity =  'R.[Surname/Organisation]'
                  break;
          case 'ONI-Title':
               this.ConditionEntity =  'R.[Title]'
                  break;
          case 'ONI-First Name':
               this.ConditionEntity =  'R.[FirstName]'
                  break;
          case 'ONI-Other':
               this.ConditionEntity =  'R.[MiddleNames]'
                  break;
          case 'ONI-Sex':
               this.ConditionEntity =  'R.[Gender]'
                  break;
          case 'ONI-DOB':
               this.ConditionEntity =  'R.[DateOfBirth]'
                  break;
          case 'ONI-Usual Address-Street':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Usual Address-Suburb':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Usual Address-Postcode':
            //  this.ConditionEntity =  
                  break;
                  case 'ONI-Contact Address-Street':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Contact Address-Suburb':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Contact Address-Postcode':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Phone-Home':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Phone-Work':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Phone-Mobile':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Phone-FAX':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-EMAIL':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 1 Name':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 1 Street':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 1 Suburb':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 1 Postcode':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 1 Phone':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 1 Relationship':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 2 Name':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 2 Street':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 2 Suburb':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 2 Postcode':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 2 Phone':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Person 2 Relationship':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Doctor Name':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Doctor Street':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Doctor Suburb':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Doctor Postcode':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Doctor Phone':
            //  this.ConditionEntity =  
                  break;                           
          case 'ONI-Doctor FAX':
            //  this.ConditionEntity =   
                  break;
          case 'ONI-Doctor EMAIL':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Referral Source':
               this.ConditionEntity =  'R.[ReferralSource]'
                  break;
          case 'ONI-Contact Details':
               this.ConditionEntity =  'R.[ReferralContactInfo]'
                  break;
          case 'ONI-Country Of Birth':
               this.ConditionEntity =  'R.[CountryOfBirth]'
                  break;
          case 'ONI-Indigenous Status':
               this.ConditionEntity =  'R.[IndiginousStatus]'
                  break;
          case 'ONI-Main Language At Home':
               this.ConditionEntity =  'R.[HomeLanguage]'
                  break;
          case 'ONI-Interpreter Required':
               this.ConditionEntity =  'R.[InterpreterRequired]'
                  break;                  
          case 'ONI-Preferred Language':
               this.ConditionEntity =  'R.[HomeLanguage]'
                  break;
          case 'ONI-Govt Pension Status':
               this.ConditionEntity =  'R.[PensionStatus]'
                  break;
          case 'ONI-Pension Benefit Card':
               this.ConditionEntity =  'R.[ConcessionNumber]' 
                  break;
          case 'ONI-Medicare Number':
               this.ConditionEntity =  'R.[MedicareNumber]'
                  break;
          case 'ONI-Health Care Card#':
                this.ConditionEntity =  'R.[Healthcare#]'
                  break;                     
          case 'ONI-DVA Cardholder Status':
               this.ConditionEntity =  'ONI.[HACCDVACardHolderStatus]'
                  break;
          case 'ONI-DVA Number':
               this.ConditionEntity =  'R.[DVANumber]'
                  break;
          case 'ONI-Insurance Status':
               this.ConditionEntity =  'R.[InsuranceStatus]'
                  break;
          case 'ONI-Health Insurer':
            //   this.ConditionEntity =  
                  break;        
          case 'ONI-Health Insurance Card#':
            //   this.ConditionEntity =  
                  break;
          case 'ONI-Alerts':
               this.ConditionEntity =  'R.[Notes]'
                  break;
          case 'ONI-Rating':
               this.ConditionEntity =  'R.[ONIRating]'
                  break;
          case 'ONI-HACC Eligible':
               this.ConditionEntity =  'R.[HACCEligible]'
                  break;
          case 'ONI-Reason For HACC Status':
               this.ConditionEntity =  'R.[DSCEligible]'
                  break;
          case 'ONI-Other Support Eligibility':
               this.ConditionEntity =  'R.[HACCReason]'
                  break;                 
          case 'ONI-Other Support Detail':
               this.ConditionEntity =  'R.[OtherEligibleDetails]'
                  break;              
          case 'ONI-Functional Profile Complete':
               this.ConditionEntity =  'R.[ONIFProfileComplete]'
                  break;
          case 'ONI-Functional Profile Score 1':
               this.ConditionEntity =  'R.[ONIFProfile1]'
                  break;
          case 'ONI-Functional Profile Score 2':
               this.ConditionEntity =  'R.[ONIFProfile2]'
                  break;
          case 'ONI-Functional Profile Score 3':
               this.ConditionEntity =  'R.[ONIFProfile3]'
                  break;
          case 'ONI-Functional Profile Score 4':
               this.ConditionEntity =  'R.[ONIFProfile4]'
                  break;
          case 'ONI-Functional Profile Score 5':
               this.ConditionEntity =  'R.[ONIFProfile5]'
                  break;
          case 'ONI-Functional Profile Score 6':
               this.ConditionEntity = 'R.[ONIFProfile6]'
                  break;
          case 'ONI-Functional Profile Score 7':
               this.ConditionEntity =  'R.[ONIFProfile7]'
                  break;
          case 'ONI-Functional Profile Score 8':
               this.ConditionEntity =  'R.[ONIFProfile8]'
                  break;
          case 'ONI-Functional Profile Score 9':
               this.ConditionEntity =  'R.[ONIFProfile9]' 
                  break;
          case 'ONI-Main Problem-Description':
               this.ConditionEntity =  'ONIMainIssues.[Description]'
                  break;
          case 'ONI-Main Problem-Action':
               this.ConditionEntity =  'ONIMainIssues.[Action]'
                  break;
          case 'ONI-Other Problem-Description':
               this.ConditionEntity =  'ONISecondaryIssues.[Description]'
                  break;
          case 'ONI-Other Problem-Action':
               this.ConditionEntity =  'ONISecondaryIssues.[Action]'
                  break;                     
          case 'ONI-Current Service':
               this.ConditionEntity =  'ONIServices.[Service]'
                  break;
          case 'ONI-Service Contact Details':
               this.ConditionEntity =  'ONIServices.[Information]'
                  break;
          case 'ONI-AP-Agency':
               this.ConditionEntity =  'ONIActionPlan.[HealthProfessional]'
                  break;
          case 'ONI-AP-For':
               this.ConditionEntity =  'ONIActionPlan.[For]'
                  break;
          case 'ONI-AP-Consent':
               this.ConditionEntity = 'ONIActionPlan.[Consent]' 
                  break;
          case 'ONI-AP-Referral':
               this.ConditionEntity =  'ONIActionPlan.[Referral]'
                  break;
          case 'ONI-AP-Transport':
               this.ConditionEntity =  'ONIActionPlan.[Transport]'
                  break;
          case 'ONI-AP-Feedback':
               this.ConditionEntity =  'ONIActionPlan.[Feedback]'
                  break;
          case 'ONI-AP-Date':
               this.ConditionEntity =  'ONIActionPlan.[Date]'
                  break;
          case 'ONI-AP-Review':
               this.ConditionEntity =  'ONIActionPlan.[Review]'
                  break;
//  ONI-Functional Profile                  
          case 'ONI-FPQ1-Housework':
               this.ConditionEntity =  'ONI.[FP1_Housework]'
                  break;
          case 'ONI-FPQ2-GetToPlaces':
               this.ConditionEntity =  'ONI.[FP2_WalkingDistance]'
                  break;
          case 'ONI-FPQ3-Shopping':
               this.ConditionEntity =  'ONI.[FP3_Shopping]'
                  break;
          case 'ONI-FPQ4-Medicine': 
               this.ConditionEntity =  'ONI.[FP4_Medicine]'
                  break;
          case 'ONI-FPQ5-Money':
               this.ConditionEntity =  'ONI.[FP5_Money]'
                  break;
          case 'ONI-FPQ6-Walk':
               this.ConditionEntity =  'ONI.[FP6_Walking]'
                  break;                 
          case 'ONI-FPQ7-Bath':
               this.ConditionEntity =  'ONI.[FP7_Bathing]'
                  break;                  
          case 'ONI-FPQ8-Memory':
               this.ConditionEntity =  'ONI.[FP8_Memory]'
                  break;
          case 'ONI-FPQ9-Behaviour':
               this.ConditionEntity =  'ONI.[FP9_Behaviour]'
                  break;
          case 'ONI-FP-Recommend Domestic':
               this.ConditionEntity =  'ONI.[FA_Domestic]'
                  break;
          case 'ONI-FP-Recommend Self Care':
               this.ConditionEntity =  'ONI.[FA_SelfCare]'
                  break;
          case 'ONI-FP-Recommend Cognition':
               this.ConditionEntity =  'ONI.[FA_Cognition]'
                  break;
          case 'ONI-FP-Recommend Behaviour':
               this.ConditionEntity =  'ONI.[FA_Behaviour]'
                  break;
          case 'ONI-FP-Has Self Care Aids':
               this.ConditionEntity =  'ONI.[Aids_SelfCare]'
                  break;
          case 'ONI-FP-Has Support/Mobility Aids':
               this.ConditionEntity =  'ONI.[Aids_SupportAndMobility]'
                  break;
          case 'ONI-FP-Has Communication Aids':
               this.ConditionEntity =  'ONI.[Aids_CommunicationAids]'
                  break;
          case 'ONI-FP-Has Car Mods':
               this.ConditionEntity =  'ONI.[Aids_CarModifications]'
                  break;
          case 'ONI-FP-Has Other Aids':
               this.ConditionEntity =  'ONI.[Aids_Other]'
                  break;
          case 'ONI-FP-Other Goods List':
               this.ConditionEntity =  'ONI.[AidsOtherList]'
                  break;
          case 'ONI-FP-Has Medical Care Aids':
               this.ConditionEntity =  'ONI.[Aids_MedicalCare]'
                  break;                  
          case 'ONI-FP-Has Reading Aids':
               this.ConditionEntity =  'ONI.[Aids_Reading]'
                  break;
          case 'ONI-FP-Comments':
               this.ConditionEntity =  'ONI.[FP_Comments]'
                  break;
//  ONI-Living Arrangements Profile                                   
          case 'ONI-LA-Living Arrangements':
               this.ConditionEntity =  'R.[LivingArrangements]'
                  break;
          case 'ONI-LA-Living Arrangements Comments':
               this.ConditionEntity =  'ONI.[LAP_LivingComments]'
                  break;
          case 'ONI-LA-Accomodation':
               this.ConditionEntity =  'R.[DwellingAccomodation]'
                  break;
          case 'ONI-LA-Accomodation Comments':
               this.ConditionEntity =  'ONI.[LAP_AccomodationComments]'
                  break;
          case 'ONI-LA-Employment Status':
               this.ConditionEntity =  'ONI.[LAP_Employment]'
                  break;
          case 'ONI-LA-Employment Status Comments':
               this.ConditionEntity =  'ONI.[LAP_EmploymentComments]'
                  break;                  
          case 'ONI-LA-Mental Health Act Status':
               this.ConditionEntity =  'ONI.[LAP_MentalHealth]'
                  break;
          case 'ONI-LA-Decision Making Responsibility':
               this.ConditionEntity =  'ONI.[LAP_Decision]'
                  break;
          case 'ONI-LA-Capable Own Decisions':
               this.ConditionEntity =  'ONI.[LAP_DecisionCapable]'
                  break;
          case 'ONI-LA-Financial Decisions':
               this.ConditionEntity =  'ONI.[LAP_FinancialDecision]'
                  break;
          case 'ONI-LA-Cost Of Living Trade Off':
               this.ConditionEntity =  'ONI.[LAP_LivingCostDecision]'
                  break;          
          case 'ONI-LA-Financial & Legal Comments':
               this.ConditionEntity =  'ONI.[LAP_LivingCostDecisionComments]'
                  break;
// ONI-Health Conditions Profile   
          case 'ONI-HC-Overall Health Description':
               this.ConditionEntity =  'ONI.[HC_Overall_General]'
                  break;               
          case 'ONI-HC-Overall Health Pain':
               this.ConditionEntity =  'ONI.[HC_Overall_Pain]'
                  break;
          case 'ONI-HC-Overall Health Interference':
               this.ConditionEntity = 'ONI.[HC_Overall_Interfere]'
          case 'ONI-HC-Vision Reading':
               this.ConditionEntity =  'ONI.[HC_Vision_Reading]'
                  break;
          case 'ONI-HC-Vision Distance':
               this.ConditionEntity =  'ONI.[HC_Vision_Long]'
                  break;
          case 'ONI-HC-Hearing':
               this.ConditionEntity =  'ONI.[HC_Hearing]'
                  break;
          case 'ONI-HC-Oral Problems':
               this.ConditionEntity =  'ONI.[HC_Oral]'
                  break;
          case 'ONI-HC-Oral Comments':
               this.ConditionEntity =  'ONI.[HC_OralComments]'
                  break;                  
          case 'ONI-HC-Speech/Swallow Problems':
               this.ConditionEntity =  'ONI.[HC_Speech]'
                  break;
          case 'ONI-HC-Speech/Swallow Comments':
               this.ConditionEntity =  'ONI.[HC_SpeechComments]'
                  break;
          case 'ONI-HC-Falls Problems':
               this.ConditionEntity =  'ONI.[HC_Falls]'
                  break;
          case 'ONI-HC-Falls Comments':
               this.ConditionEntity =  'ONI.[HC_FallsComments]'
                  break;
          case 'ONI-HC-Feet Problems':
               this.ConditionEntity =  'ONI.[HC_Feet]'
                  break;
          case 'ONI-HC-Feet Comments':
               this.ConditionEntity =  'ONI.[HC_FeetComments]'
                  break;
          case 'ONI-HC-Vacc. Influenza':
               this.ConditionEntity =  'ONI.[HC_Vac_Influenza]'
                  break;
          case 'ONI-HC-Vacc. Influenza Date':
               this.ConditionEntity =  'ONI.[HC_Vac_Influenza_Date]'
                  break;
          case 'ONI-HC-Vacc. Pneumococcus':
               this.ConditionEntity =  'ONI.[HC_Vac_Pneumo]'
                  break;
          case 'ONI-HC-Vacc. Pneumococcus  Date':
               this.ConditionEntity =  'ONI.[HC_Vac_Pneumo_Date]'
                  break;     
          case 'ONI-HC-Vacc. Tetanus':
               this.ConditionEntity =  'ONI.[HC_Vac_Tetanus]'
                  break;
          case 'ONI-HC-Vacc. Tetanus Date':
               this.ConditionEntity =  'ONI.[HC_Vac_Tetanus_Date]'
                  break;
          case 'ONI-HC-Vacc. Other':
               this.ConditionEntity =  'ONI.[HC_Vac_Other]'
                  break;
          case 'ONI-HC-Vacc. Other Date':
               this.ConditionEntity =  'ONI.[HC_Vac_Other_Date]'
                  break;
          case 'ONI-HC-Driving MV':
               this.ConditionEntity =  'ONI.[HC_Driving]'
                  break;
          case 'ONI-HC-Driving Fit':
               this.ConditionEntity =  'ONI.[HC_FitToDrive]'
                  break;
          case 'ONI-HC-Driving Comments':
               this.ConditionEntity =  'ONI.[HC_DrivingComments]'
                  break;
          case 'ONI-HC-Continence Urinary':
               this.ConditionEntity =  'ONI.[HC_Continence_Urine]'
                  break;
          case 'ONI-HC-Urinary Related To Coughing':
               this.ConditionEntity =  'ONI.[HC_Continence_Urine_Sneeze]'
                  break;
          case 'ONI-HC-Continence Comments':
               this.ConditionEntity =  'ONI.[HC_ContinenceComments]'
                  break;
          case 'ONI-HC-Weight':
               this.ConditionEntity =  'ONI.[HC_Weight]'
                  break;
          case 'ONI-HC-Height':
               this.ConditionEntity =  'ONI.[HC_Height]'
                  break;
          case 'ONI-HC-BMI':
               this.ConditionEntity =  'ONI.[HC_BMI]'
                  break;
          case 'ONI-HC-BP Systolic':
               this.ConditionEntity = 'ONI.[HC_BP_Systolic]' 
                  break;                 
          case 'ONI-HC-BP Diastolic':
               this.ConditionEntity =  'ONI.[HC_BP_Diastolic]'
                  break;
          case 'ONI-HC-Pulse Rate':
               this.ConditionEntity =  'ONI.[HC_PulseRate]'
                  break;          
          case 'ONI-HC-Pulse Regularity':
               this.ConditionEntity =  'ONI.[HC_Pulse]'
                  break;
          case 'ONI-HC-Check Postural Hypotension':
               this.ConditionEntity =  'ONI.[HC_PHCheck]'
                  break;
          case 'ONI-HC-Conditions':
               this.ConditionEntity =  'ONIHealthConditions.[Description]'
                  break;
          case 'ONI-HC-Diagnosis':
               this.ConditionEntity =  'MDiagnosis.[Description]'
                  break;
          case 'ONI-HC-Medicines':
               this.ConditionEntity =  'ONIMedications.[Description]'
                  break;
          case 'ONI-HC-Take Own Medication':
               this.ConditionEntity =  'ONI.[HC_Med_TakeOwn]'
                  break;                
          case 'ONI-HC-Willing When Presribed':
               this.ConditionEntity =  'ONI.[HC_Med_Willing]'
                  break;
          case 'ONI-HC-Co-op With Health Services':
               this.ConditionEntity =  'ONI.[HC_Med_Coop]'
                  break;
          case 'ONI-HC-Webster Pack':
               this.ConditionEntity =  'ONI.[HC_Med_Webster]'
                  break;
          case 'ONI-HC-Medication Review':
               this.ConditionEntity =  'ONI.[HC_Med_Review]'
                  break;
          case 'ONI-HC-Medical Comments':
               this.ConditionEntity =  'ONI.[HC_MedComments]'
                  break;
//ONI-Psychosocial Profile                  
          case 'ONI-PS-K10-1':
               this.ConditionEntity =  'ONI.[PP_K10_1]'
                  break;
          case 'ONI-PS-K10-2':
               this.ConditionEntity =  'ONI.[PP_K10_2]'
                  break;
          case 'ONI-PS-K10-3':
               this.ConditionEntity =  'ONI.[PP_K10_3]'
                  break;
          case 'ONI-PS-K10-4':
               this.ConditionEntity =  'ONI.[PP_K10_4]'
                  break;
          case 'ONI-PS-K10-5':
               this.ConditionEntity =  'ONI.[PP_K10_5]'
                  break;
          case 'ONI-PS-K10-6':
               this.ConditionEntity =  'ONI.[PP_K10_6]'
                  break;
          case 'ONI-PS-K10-7':
               this.ConditionEntity =  'ONI.[PP_K10_7]'
                  break;
          case 'ONI-PS-K10-8':
               this.ConditionEntity =  'ONI.[PP_K10_8]'
                  break;
          case 'ONI-PS-K10-9':
               this.ConditionEntity =  'ONI.[PP_K10_9]'
                  break;
          case 'ONI-PS-K10-10':
               this.ConditionEntity =  'ONI.[PP_K10_10]'
                  break;
          case 'ONI-PS-Sleep Difficulty':
               this.ConditionEntity =  'ONI.[PP_SleepingDifficulty]'
                  break;
          case 'ONI-PS-Sleep Details':
               this.ConditionEntity =  'ONI.[PP_SleepingDifficultyComments]'
                  break;
          case 'ONI-PS-Personal Support':
               this.ConditionEntity =  'ONI.[PP_PersonalSupport]'
                  break;
          case 'ONI-PS-Personal Support Comments':
               this.ConditionEntity =  'ONI.[PP_PersonalSupportComments]'
                  break;
          case 'ONI-PS-Keep Friendships':
               this.ConditionEntity =  'ONI.[PP_Relationships_KeepUp]'
                  break;
          case 'ONI-PS-Problems Interacting':
               this.ConditionEntity =  'ONI.[PP_Relationships_Problem]'
                  break;
          case 'ONI-PS-Family/Relationship Comments':
               this.ConditionEntity =  'ONI.[PP_RelationshipsComments]'
                  break;
          case 'ONI-PS-Svc Prvdr Relations':
               this.ConditionEntity =  'ONI.[PP_Relationships_SP]'
                  break;
          case 'ONI-PS-Svc Prvdr Comments':
               this.ConditionEntity =  'ONI.[PP_Relationships_SPComments]'
                  break;
//ONI-Health Behaviours Profile                  
          case 'ONI-HB-Regular Health Checks':
               this.ConditionEntity =  'ONI.[HBP_HealthChecks]'
                  break;
          case 'ONI-HB-Last Health Check':
               this.ConditionEntity =  'ONI.[HBP_HealthChecks_Last]'
                  break;                                    
          case 'ONI-HB-Health Screens':
               this.ConditionEntity =  'ONI.[HBP_HealthChecks_List]'
                  break;
          case 'ONI-HB-Smoking':
               this.ConditionEntity =  'ONI.[HBP_Smoking]'
                  break;                  
          case 'ONI-HB-If Quit Smoking - When?':
               this.ConditionEntity =  'ONI.[HBP_Smoking_Quit]'
                  break;
          case 'ONI-HB-Alchohol-How often?':
               this.ConditionEntity =  'ONI.[HBP_Alchohol]'
                  break;
          case 'ONI-HB-Alchohol-How many?':
               this.ConditionEntity =  'ONI.[HBP_Alchohol_NoDrinks]'
                  break;
          case 'ONI-HB-Alchohol-How often over 6?':
               this.ConditionEntity =  'ONI.[HBP_Alchohol_BingeNo]'
                  break;
          case 'ONI-HB-Lost Weight':
               this.ConditionEntity =  'ONI.[HBP_Malnutrition_LostWeight]'
                  break;
          case 'ONI-HB-Eating Poorly':
               this.ConditionEntity =  'ONI.[HBP_Malnutrition_PoorEating]'
                  break;
          case 'ONI-HB-How much wieght lost':
               this.ConditionEntity =  'ONI.[HBP_Malnutrition_LostWeightAmount]'
                  break;
          case 'ONI-HB-Malnutrition Score':
               this.ConditionEntity =  'ONI.[HBP_Malnutrition_Score]'
                  break;
          case 'ONI-HB-8 cups fluid':
               this.ConditionEntity =  'ONI.[HBP_Hydration_AdequateFluid]'
                  break;
          case 'ONI-HB-Recent decrease in fluid':
               this.ConditionEntity =  'ONI.[HBP_Hydration_DecreasedFluid]'
                  break;
          case 'ONI-HB-Weight':
               this.ConditionEntity =  'ONI.[HBP_Weight]'
                  break;
          case 'ONI-HB-Physical Activity':
               this.ConditionEntity =  'ONI.[HBP_PhysicalActivity]'
                  break;
          case 'ONI-HB-Physical Fitness':
               this.ConditionEntity =  'ONI.[HBP_PhysicalFitness]'
                  break;
          case 'ONI-HB-Fitness Comments':
               this.ConditionEntity =  'ONI.[HBP_Comments]'
                  break;
//ONI-CP-Need for carer 
          case 'ONI-CP-Need for carer':
               this.ConditionEntity =  'ONI.[C_General_NeedForCarer]'
                  break;                 
          case 'ONI-CP-Carer Availability':
               this.ConditionEntity =  'R.[CarerAvailability]'
                  break;                            
          case 'ONI-CP-Carer Residency Status':
               this.ConditionEntity =  'R.[CarerResidency]'
                  break;
          case 'ONI-CP-Carer Relationship':
               this.ConditionEntity =  'R.[CarerRelationship]'
                  break;
          case 'ONI-CP-Carer has help':
               this.ConditionEntity =  'ONI.[C_Support_Help]'
                  break;
          case 'ONI-CP-Carer receives payment':
               this.ConditionEntity =  'ONI.[C_Support_Allowance]'
                  break;
          case 'ONI-CP-Carer made aware support services':
               this.ConditionEntity =  'ONI.[C_Support_Information]'
                  break; 

          case 'ONI-CP-Carer needs training':
               this.ConditionEntity =  'ONI.[C_Support_NeedTraining]'
                  break;
          case 'ONI-CP-Carer threat-emotional':
               this.ConditionEntity =  'ONI.[C_Threats_Emotional]'
                  break;
          case 'ONI-CP-Carer threat-acute physical':
               this.ConditionEntity =  'ONI.[C_Threats_Physical]'
                  break;
          case 'ONI-CP-Carer threat-slow physical':
               this.ConditionEntity =  'ONI.[C_Threats_Physical_Slow]'
                  break;
          case 'ONI-CP-Carer threat-other factors':
               this.ConditionEntity =  'ONI.[C_Threats_Unrelated]'
                  break;
          case 'ONI-CP-Carer threat-increasing consumer needs':
               this.ConditionEntity =  'ONI.[C_Threats_ConsumerNeeds]'
                  break;
          case 'ONI-CP-Carer threat-other comsumer factors':
               this.ConditionEntity =  'ONI.[C_Threats_ConsumerOther]'
                  break;
          case 'ONI-CP-Carer arrangements sustainable':
               this.ConditionEntity =  'ONI.[C_Issues_Sustainability]'
                  break;
          case 'ONI-CP-Carer Comments':
               this.ConditionEntity =  'ONI.[C_Issues_Comments]'
                  break;
//ONI-CS-Year of Arrival  
 
          case 'ONI-CS-Year of Arrival':
               this.ConditionEntity =  'ONI.[CAL_ArrivalYear]'
                  break;               
          case 'ONI-CS-Citizenship Status':
               this.ConditionEntity =  'ONI.[CAL_Citizenship]'
                  break;
          case 'ONI-CS-Reasons for moving to Australia':
               this.ConditionEntity =  'ONI.[CAL_ReasonsMoveAustralia]'
                  break;
          case 'ONI-CS-Primary/Secondary Language Fluency':
               this.ConditionEntity =  'ONI.[CAL_PrimSecLanguage]'
                  break;
          case 'ONI-CS-Fluency in English':
               this.ConditionEntity =  'ONI.[CAL_EnglishProf]'
                  break;
          case 'ONI-CS-Literacy in primary language':
               this.ConditionEntity =  'ONI.[CAL_PrimaryLiteracy]'
                  break;
          case 'ONI-CS-Literacy in English':
               this.ConditionEntity =  'ONI.[CAL_EnglishLiteracy]'
                  break;
          case 'ONI-CS-Non verbal communication style':
               this.ConditionEntity =  'ONI.[CAL_NonVerbalStyle]'
                  break;
          case 'ONI-CS-Marital Status':
               this.ConditionEntity =  'ONI.[CAL_Marital]'
                  break;
          case 'ONI-CS-Religion':
               this.ConditionEntity =  'ONI.[CAL_Religion]'
                  break;
          case 'ONI-CS-Employment history in country of origin':
               this.ConditionEntity =  'ONI.[CAL_EmploymentHistory]'
                  break;
          case 'ONI-CS-Employment history in Australia':
               this.ConditionEntity =  'ONI.[CAL_EmploymentHistoryAust]'
                  break;
            case 'ONI-CS-Specific dietary needs':
               this.ConditionEntity =  'ONI.[CAL_DietaryNeeds]'
                  break;
            case 'ONI-CS-Specific cultural needs':
               this.ConditionEntity =  'ONI.[CAL_SpecificCulturalNeeds]'
                  break;
          case 'ONI-CS-Someone to talk to for day to day problems':
               this.ConditionEntity =  'ONI.[CALSocIsol_1]'
                  break;          
          case 'ONI-CS-Miss having close freinds':
               this.ConditionEntity =  'ONI.[CALSocIsol_2]'
                  break;
          case 'ONI-CS-Experience general sense of emptiness':
               this.ConditionEntity =  'ONI.[CALSocIsol_3]'
                  break;
            case 'ONI-CS-Plenty of people to lean on for problems':
               this.ConditionEntity =  'ONI.[CALSocIsol_4]'
                  break;
            case 'ONI-CS-Miss the pleasure of the company of others':
               this.ConditionEntity =  'ONI.[CALSocIsol_5]'
                  break;
          case 'ONI-CS-Circle of friends and aquaintances too limited':
               this.ConditionEntity =  'ONI.[CALSocIsol_6]'
                  break;
          case 'ONI-CS-Many people I trust completely':
               this.ConditionEntity =  'ONI.[CALSocIsol_7]'
                  break;               
          case 'ONI-CS-Enough people I feel close to':
               this.ConditionEntity =  'ONI.[CALSocIsol_8]'
                  break;
          case 'ONI-CS-Miss having people around':
               this.ConditionEntity =  'ONI.[CALSocIsol_9]'
                  break;
            case 'ONI-CS-Often feel rejected':
               this.ConditionEntity =  'ONI.[CALSocIsol_10]'
                  break;
            case 'ONI-CS-Can call on my friends whenever I need them':
               this.ConditionEntity =  'ONI.[CALSocIsol_11]'
                  break;
//Loan Items                  
          case 'Loan Item Type':
               this.ConditionEntity =  'HRLoan.[Type]'
                  break;
          case 'Loan Item Description':
               this.ConditionEntity =  'HRLoan.[Name]'
                  break;
          case 'Loan Item Date Loaned/Installed':
               this.ConditionEntity =  'HRLoan.[Date1]'
                  break;
          case 'Loan Item Date Collected':
               this.ConditionEntity =  'HRLoan.[Date2]'
                  break;          
 //  service information Fields                  
            case 'Staff Code':
               this.ConditionEntity =  'SvcDetail.[Carer Code]'
                  break;
            case 'Service Date':
               this.ConditionEntity =  'SvcDetail.Date'
                  break;
          case 'Service Start Time':
               this.ConditionEntity =  'SvcDetail.[Start Time]'
                  break;
          case 'Service Code':
               this.ConditionEntity =  'SvcDetail.[Service Type]'
                  break;
          case 'Service Hours':
               this.ConditionEntity =  '(SvcDetail.[Duration]*5) / 60'
                  break;
          case 'Service Pay Rate':
               this.ConditionEntity =  'SvcDetail.[Unit Pay Rate]'
                  break;
            case 'Service Bill Rate':
               this.ConditionEntity =  'SvcDetail.[Unit Bill Rate]'
                  break;
            case 'Service Bill Qty':
               this.ConditionEntity =  'SvcDetail.[BillQty]'
                  break;
          case 'Service Location/Activity Group':
               this.ConditionEntity =  'SvcDetail.[ServiceSetting]'
                  break;
          case 'Service Program':
               this.ConditionEntity =  'SvcDetail.[Program]'
                  break;
          case 'Service Group':
               this.ConditionEntity =  'SvcDetail.[Type]'
                  break;
          case 'Service HACCType':
               this.ConditionEntity =  'SvcDetail.[HACCType]'
                  break;
            case 'Service Category':
               this.ConditionEntity =  'SvcDetail.[Anal]'
                  break;
            case 'Service Status':
               this.ConditionEntity =  'SvcDetail.[Status]'
                  break;
          case 'Service Pay Type':
               this.ConditionEntity =  'SvcDetail.[Service Description]'
                  break;
          case 'Service Pay Qty':
               this.ConditionEntity =  'SvcDetail.[CostQty]'
                  break;                  
          case 'Service End Time/ Shift End Time':
               this.ConditionEntity =  'Convert(varchar,DATEADD(minute,(SvcDetail.[Duration]*5) ,SvcDetail.[Start Time]),108)'
                  break;
          case 'Service Funding Source':
               this.ConditionEntity =  'Humanresourcetypes.[Type]'
                  break;                     
            case 'Service Notes':
               this.ConditionEntity =  'CAST(History.Detail AS varchar(4000))'
                  break;
//Service Specific Competencies                
            case 'Activity':
               this.ConditionEntity =  'SvcSpecCompetency.[Group]'
                  break;
          case 'Competency':
               this.ConditionEntity =  'SvcSpecCompetency.[Name]'
                  break;
          case 'SS Status':
            //  this.ConditionEntity =  
                  break;
//  RECIPIENT OP NOTES                  
          case 'OP Notes Date':
               this.ConditionEntity =  'OPHistory.[DetailDate]'
                  break;
          case 'OP Notes Detail':
               this.ConditionEntity =  'OPHistory.[Detail]'
                  break;                   
            case 'OP Notes Creator':
               this.ConditionEntity =  'OPHistory.[Creator]'
                  break;
          case 'OP Notes Alarm':
               this.ConditionEntity =  'OPHistory.[AlarmDate]'
                  break;
          case 'OP Notes Program':
               this.ConditionEntity =  'OPHistory.[Program]'
                  break;
          case 'OP Notes Category':
               this.ConditionEntity =  'OPHistory.ExtraDetail2'
                  break;
// RECIPIENT CLINICAL NOTES                  
          case 'Clinical Notes Date':
               this.ConditionEntity =  'CliniHistory.[DetailDate]'
                  break;
          case 'Clinical Notes Detail':
               this.ConditionEntity =  'dbo.RTF2TEXT(CliniHistory.[Detail])'
                  break;
          case 'Clinical Notes Creator':
               this.ConditionEntity =   'CliniHistory.[Creator]'
                  break;

          case 'Clinical Notes Alarm':
               this.ConditionEntity =  'CliniHistory.[AlarmDate]'
                  break;
          case 'Clinical Notes Category':
               this.ConditionEntity =  'CliniHistory.[ExtraDetail2]'
                  break;
// RECIPIENT INCIDENTS                  
          case 'INCD_Status':
               this.ConditionEntity =  'IMM.Status'
                  break;
          case 'INCD_Date':
               this.ConditionEntity =  'IMM.Date'
                  break;
          case 'INCD_Type':
               this.ConditionEntity =  'IMM.[Type]'
                  break;
          case 'INCD_Description':
               this.ConditionEntity =  'IMM.ShortDesc'
                  break;
          case 'INCD_SubCategory':
               this.ConditionEntity =  'IMM.PerpSpecify'
                  break;
          case 'INCD_Assigned_To':
               this.ConditionEntity =  'IMM.CurrentAssignee'
                  break;         
          case 'INCD_Service':
               this.ConditionEntity =  'IMM.Service'
                  break;
          case 'INCD_Severity':
               this.ConditionEntity =  'IMM.Severity'
                  break;
            case 'INCD_Time':
               this.ConditionEntity =  'IMM.Time'
                  break;
            case 'INCD_Duration':
               this.ConditionEntity =  'IMM.Duration'
                  break;
          case 'INCD_Location':
               this.ConditionEntity =  'IMM.Location'
                  break;
          case 'INCD_LocationNotes':
               this.ConditionEntity =  'IMM.LocationNotes'
                  break;
          case 'INCD_ReportedBy':
               this.ConditionEntity =  'IMM.ReportedBy'
                  break;
          case 'INCD_DateReported':
               this.ConditionEntity =  'IMM.DateReported'
                  break;
            case 'INCD_Reported':
               this.ConditionEntity =  'IMM.Reported'
                  break;
            case 'INCD_FullDesc':
               this.ConditionEntity =  'IMM.FullDesc'
                  break;
          case 'INCD_Program':
               this.ConditionEntity =  'IMM.Program'
                  break;
          case 'INCD_DSCServiceType':
               this.ConditionEntity =  'IMM.DSCServiceType'
                  break;
          case 'INCD_TriggerShort':
               this.ConditionEntity =  'IMM.TriggerShort'
                  break;
          case 'INCD_incident_level':
               this.ConditionEntity =  'IMM.incident_level'
                  break;
            case 'INCD_Area':
               this.ConditionEntity =  'IMM.area'
                  break;
            case 'INCD_Region':
               this.ConditionEntity =  'IMM.Region'
                  break;
          case 'INCD_position':
               this.ConditionEntity =  'IMM.position'
                  break;
          case 'INCD_phone':
               this.ConditionEntity =  'IMM.phone'
                  break;
          case 'INCD_verbal_date':
               this.ConditionEntity =  'IMM.verbal_date'
                  break;
          case 'INCD_verbal_time':
               this.ConditionEntity =  'IMM.verbal_time'
                  break;
            case 'INCD_By_Whome':
               this.ConditionEntity =  'IMM.By_Whome'
                  break;
            case 'INCD_To_Whome':
               this.ConditionEntity =  'IMM.To_Whome'
                  break;
          case 'INCD_BriefSummary':
               this.ConditionEntity =  'IMM.BriefSummary'
                  break;
          case 'INCD_ReleventBackground':
               this.ConditionEntity =  'IMM.ReleventBackground'
                  break;
          case 'INCD_SummaryofAction':
               this.ConditionEntity =  'IMM.SummaryofAction'
                  break;
          case 'INCD_SummaryOfOtherAction':
               this.ConditionEntity =  'IMM.SummaryOfOtherAction'
                  break;
            case 'INCD_Triggers':
               this.ConditionEntity =  'IMM.Triggers'
                  break;
            case 'INCD_InitialAction':
               this.ConditionEntity =  'IMM.InitialAction'
                  break;
          case 'INCD_InitialNotes':
               this.ConditionEntity =  'IMM.InitialNotes'
                  break;
          case 'INCD_InitialFupBy':
               this.ConditionEntity =  'IMM.InitialFupBy'
                  break;
          case 'INCD_Completed':
               this.ConditionEntity =  'IMM.Completed'
                  break;
          case 'INCD_OngoingAction':
               this.ConditionEntity =  'IMM.OngoingAction'
                  break;
            case 'INCD_OngoingNotes':
               this.ConditionEntity =  'IMM.OngoingNotes'
                  break;
            case 'INCD_Background':
               this.ConditionEntity =  'IMM.Background'
                  break;
          case 'INCD_Abuse':
               this.ConditionEntity =  'IMM.Abuse'
                  break;
          case 'INCD_DOPWithDisability':
               this.ConditionEntity =  'IMM.DOPWithDisability'
                  break;
          case 'INCD_SeriousRisks':
               this.ConditionEntity =  'IMM.SeriousRisks'
                  break;
          case 'INCD_Complaints':
               this.ConditionEntity =  'IMM.Complaints'
                  break;                                   
            case 'INCD_Perpetrator':
               this.ConditionEntity =  'IMM.Perpetrator'
                  break;
            case 'INCD_Notify':
               this.ConditionEntity =  'IMM.Notify'
                  break;
          case 'INCD_NoNotifyReason':
               this.ConditionEntity =  'IMM.NoNotifyReason'
                  break; 
          case 'INCD_Notes':
               this.ConditionEntity =  'IMM.Notes'
                  break;
          case 'INCD_Setting':
               this.ConditionEntity =  'IMM.Setting'
                  break;
          case 'INCD_Involved_Staff':
               this.ConditionEntity =  'IMI.Staff#'
                  break;
//  Recipient Competencies                  
            case 'Recipient Competency':
               this.ConditionEntity =  'RecpCompet.Name'
                  break;
            case 'Recipient Competency Mandatory':
               this.ConditionEntity =  'RecpCompet.Recurring'
                  break;
          case 'Recipient Competency Notes':
               this.ConditionEntity =  'RecpCompet.[Notes]'
                  break;
//Care Plan                  
          case 'CarePlan ID':
               this.ConditionEntity =  'D.Doc#'
                  break;
          case 'CarePlan Name':
               this.ConditionEntity =  'D.Title'
                  break;
          case 'CarePlan Type':
            //  this.ConditionEntity =  
                  break;
            case 'CarePlan Program':
            //  this.ConditionEntity =  
                  break;                  
            case 'CarePlan Discipline':
            //  this.ConditionEntity =  
                  break;
          case 'CarePlan CareDomain':
            //  this.ConditionEntity =  
                  break;
          case 'CarePlan StartDate':
               this.ConditionEntity =  'D.DocStartDate'
                  break;
          case 'CarePlan SignOffDate':
               this.ConditionEntity =  'D.DocEndDate'
                  break;
          case 'CarePlan ReviewDate':
               this.ConditionEntity =  'D.AlarmDate'
                  break;
            case 'CarePlan ReminderText':
               this.ConditionEntity =  'D.AlarmText'
                  break;
            case 'CarePlan Archived':
               this.ConditionEntity =  'D.DeletedRecord'
                  break;
//Mental Health                  
          case 'MH-PERSONID':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[PERSONID]'
                  break;
          case 'MH-HOUSING TYPE ON REFERRAL':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[HOUSING TYPE ON REFERRAL]'
                  break;
          case 'MH-RE REFERRAL':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[RE REFERRAL]'
                  break;
          case 'MH-REFERRAL SOURCE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[REFERRAL SOURCE]'
                  break;
            case 'MH-REFERRAL RECEIVED DATE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[REFERRAL RECEIVED DATE]'
                  break;

            case 'MH-ENGAGED AND CONSENT DATE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ENGAGED AND CONSENT DATE]'
                  break;
          case 'MH-OPEN TO HOSPITAL':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[OPEN TO HOSPITAL]'
                  break;                
          case 'MH-OPEN TO HOSPITAL DETAILS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[OPEN TO HOSPITAL DETAILS]'
                  break;
          case 'MH-ALERTS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ALERTS]'
                  break;
          case 'MH-ALERTS DETAILS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ALERTS DETAILS]'
                  break;
            case 'MH-MH DIAGNOSIS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[MH DIAGNOSIS]'
                  break;
            case 'MH-MEDICAL DIAGNOSIS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[MEDICAL DIAGNOSIS]'
                  break;
          case 'MH-REASONS FOR EXIT':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[REASONS FOR EXIT]'
                  break;                  
          case 'MH-SERVICES LINKED INTO':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[SERVICES LINKED INTO]'
                  break;
          case 'MH-NON ACCEPTED REASONS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[NON ACCEPTED REASONS]'
                  break;
          case 'MH-NOT PROCEEDED':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[NOT PROCEEDED]'
                  break;               
            case 'MH-DISCHARGE DATE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[DISCHARGE DATE]'
                  break;
            case 'MH-CURRENT AOD':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[CURRENT AOD]'
                  break;
          case 'MH-CURRENT AOD DETAILS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[CURRENT AOD DETAILS]'
                  break;
          case 'MH-PAST AOD':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[PAST AOD]'
                  break;
          case 'MH-PAST AOD DETAILS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[PAST AOD DETAILS]'
                  break;
          case 'MH-ENGAGED AOD':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ENGAGED AOD]'
                  break;
            case 'MH-ENGAGED AOD DETAILS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ENGAGED AOD DETAILS]'
                  break;
            case 'MH-SERVICES CLIENT IS LINKED WITH ON INTAKE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[SERVICES CLIENT IS LINKED WITH ON INTAKE]'
                  break;
          case 'MH-SERVICES CLIENT IS LINKED WITH ON EXIT':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[SERVICES CLIENT IS LINKED WITH ON EXIT]'
                  break;
          case 'MH-ED PRESENTATIONS ON REFERRAL':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ED PRESENTATIONS ON REFERRAL]'
                  break;               
          case 'MH-ED PRESENTATIONS ON 3 MONTH REVIEW':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ED PRESENTATIONS ON 3 MONTH REVIEW]'
                  break;
          case 'MH-ED PRESENTATIONS ON EXIT':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ED PRESENTATIONS ON EXIT]'
                  break;
            case 'MH-AMBULANCE ARRIVAL ON REFERRAL':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON REFERRAL]'
                  break;
            case 'MH-AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW]'
                  break;
          case 'MH-AMBULANCE ARRIVAL ON EXIT':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON EXIT]'
                  break;
          case 'MH-ADMISSIONS ON REFERRAL':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ADMISSIONS ON REFERRAL]'
                  break;
          case 'MH-ADMISSIONS ON MID-3 MONTH REVIEW':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[ADMISSIONS ON MID- 3 MONTH REVIEW]'
                  break;
          case 'MH-ADMISSIONS TO ED ON TIME OF EXIT':
               this.ConditionEntity = 'MENTALHEALTHDATASET.[ADMISSIONS TO ED ON TIME OF EXIT]' 
                  break;                  
            case 'MH-RESIDENTIAL MOVES':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[RESIDENTIAL MOVES]'
                  break;
            case 'MH-DATE OF RESIDENTIAL CHANGE OF ADDRESS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[DATE OF RESIDENTIAL CHANGE OF ADDRESS]'
                  break;
          case 'MH-LOCATION OF NEW ADDRESS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[LOCATION OF NEW ADDRESS]'
                  break;
          case 'MH-HOUSING TYPE ON EXIT':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[HOUSING TYPE ON EXIT]'
                  break;
          case 'MH-KPI - INTAKE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KPI - INTAKE]'
                  break;
          case 'MH-KPI - 3 MONTH REVEIEW':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KPI - 3 MONTH REVEIEW]'
                  break;
            case 'MH-KPI - EXIT':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KPI - EXIT]'
                  break;
            case 'MH-MEDICAL DIAGNOSIS DETAILS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[MEDICAL DIAGNOSIS DETAILS]'
                  break;
          case 'MH-SERVICES LINKED DETAILS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[SERVICES LINKED DETAILS]'
                  break;
          case 'MH-NDIS TYPE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[NDIS TYPE]'
                  break;
          case 'MH-NDIS TYPE COMMENTS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[NDIS TYPE COMMENTS]'
                  break;
          case 'MH-NDIS NUMBER':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[NDIS NUMBER]'
                  break;
            case 'MH-REVIEW APPEAL':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[REVIEW APPEAL]'
                  break;
            case 'MH-REVIEW COMMENTS':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[REVIEW COMMENTS]'
                  break;
          case 'MH-KP_Intake_1':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_1]'
                  break;
          case 'MH-KP_Intake_2':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_2]'
                  break;
          case 'MH-KP_Intake_3MH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_3M]'
                  break;                                   
          case 'MH-KP_Intake_3PH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_3P]'
                  break;
            case 'MH-KP_Intake_4':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_4]'
                  break;
            case 'MH-KP_Intake_5':
               this.ConditionEntity = 'MENTALHEALTHDATASET.[KP_IN_5]' 
                  break;
          case 'MH-KP_Intake_6':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_6]'
                  break;
          case 'MH-KP_Intake_7':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_7]'
                  break;
          case 'MH-KP_3Months_1':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_1]'
                  break;
          case 'MH-KP_3Months_2':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_2]'
                  break;
            case 'MH-KP_3Months_3MH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_3M]'
                  break;
            case 'MH-KP_3Months_3PH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_3P]'
                  break;
          case 'MH-KP_3Months_4':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_4]'
                  break;
          case 'MH-KP_3Months_5':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_5]'
                  break;
          case 'MH-KP_3Months_6':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_6]'
                  break;
          case 'MH-KP_3Months_7':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_7]'
                  break;
            case 'MH-KP_6Months_1':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_1]'
                  break; 
            case 'MH-KP_6Months_2':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_2]'
                  break;
          case 'MH-KP_6Months_3MH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_3M]'
                  break;
          case 'MH-KP_6Months_3PH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_3P]'
                  break;
          case 'MH-KP_6Months_4':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_4]'
                  break;
          case 'MH-KP_6Months_5':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_5]'
                  break;
            case 'MH-KP_6Months_6':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_6]'
                  break;
            case 'MH-KP_6Months_7':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_6_7]'
                  break;
          case 'MH-KP_9Months_1':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_1]'
                  break;
          case 'MH-KP_9Months_2':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_2]'
                  break;
          case 'MH-KP_9Months_3MH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_3M]'
                  break;
          case 'MH-KP_9Months_3PH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_3P]'
                  break;
            case 'MH-KP_9Months_4':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_4]'
                  break;
            case 'MH-KP_9Months_5':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_5]'
                  break;
          case 'MH-KP_9Months_6':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_6]'
                  break;
          case 'MH-KP_9Months_7':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_7]'
                  break;
          case 'MH-KP_Exit_1':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_1]'
                  break;
          case 'MH-KP_Exit_2':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_2]'
                  break;
            case 'MH-KP_Exit_3MH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_3M]'
                  break;
            case 'MH-KP_Exit_3PH':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_3P]'
                  break;
          case 'MH-KP_Exit_4':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_4]'
                  break;       
          case 'MH-KP_Exit_5':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_5]'
                  break;
          case 'MH-KP_Exit_6':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_6]'
                  break;
          case 'MH-KP_Exit_7':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_7]'
                  break;
            case 'MH-KP_Intake_DATE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_IN_DATE]'
                  break;
            case 'MH-KP_3Months_DATE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_3_DATE]'
                  break;
          case 'MH-KP_6Months_DATE':
               this.ConditionEntity = 'MENTALHEALTHDATASET.[KP_6_DATE]' 
                  break;
          case 'MH-KP_9Months_DATE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_9_DATE]'
                  break;
          case 'MH-KP_Exit_DATE':
               this.ConditionEntity =  'MENTALHEALTHDATASET.[KP_EX_DATE]'
                  break;
//Recipient Placements                  
          case 'Placement Type':
               this.ConditionEntity =  'HRPlacements.[Type]'
                  break;
            case 'Placement Carer Name':
               this.ConditionEntity =  'HRPlacements.[Name]'
                  break;
            case 'Placement Start':
               this.ConditionEntity =  'HRPlacements.[Date1]'
                  break;
          case 'Placement End':
               this.ConditionEntity =  'HRPlacements.[Date2]'
                  break;
          case 'Placement Referral':
               this.ConditionEntity = 'HRPlacements.[Recurring]' 
                  break;        
          case 'Placement ATC':
               this.ConditionEntity =  'HRPlacements.[Completed]'
                  break;
            case 'Placement Notes':
               this.ConditionEntity =  'HRPlacements.[Notes]'
                  break;
//Quote Goals and stratagies                  
            case 'Quote Goal':
               this.ConditionEntity =  'GOALS.User1'
                  break;
          case 'Goal Expected Completion Date':
               this.ConditionEntity =  'GOALS.Date1'
                  break;
          case 'Goal Last Review Date':
               this.ConditionEntity =  'GOALS.Date2'
                  break;
          case 'Goal Completed Date':
               this.ConditionEntity =  'GOALS.DateInstalled'
                  break;                  
          case 'Goal  Achieved':
              this.ConditionEntity =  'GOALS.[State]'
                break;
          case 'Quote Strategy':
               this.ConditionEntity =  'STRATEGIES.Notes'
                  break;
          case 'Strategy Expected Outcome':
               this.ConditionEntity =  'STRATEGIES.Address1'
                  break;
          case 'Strategy Contracted ID':
               this.ConditionEntity =  'STRATEGIES.[State]'
                  break;
          case 'Strategy DS Services':
               this.ConditionEntity =  'STRATEGIES.User1'
                  break;
          
          default:
            break;
        }
    }
//if(this.ContactGrp == true){
//  this.ConditionEntity = " HR.[Group] IN ('NEXTOFKIN',  'CONTACT', 'CARER',  '1-NEXT OF KIN',  '2-CARER',  '3-MEDICAL',  '4-ALLIED HEALTH',  '5-HEALTH INSURANCE',  '6-POWER OF ATTORNEY',  '7-LEGAL OTHER',  '8-OTHER','ALLIED HEALTH',  'PHARMACIST',  'HOSPITAL',  'HEALTHINSURER',  'POWERATTORNEY',  'OTHERLEGAL',  'OTHERCONTACT',  'MANAGER',  'HUMAN RESOURCES',  'ACCOUNTS',  'PAYROLL',  'SALES',  'PURCHASING',  'OTHERCONTACT') OR  HR.[Group] IN  (SELECT DESCRIPTION FROM DataDomains WHERE DOMAIN IN ('CONTACTGROUP', 'CARER RELATIONSHIP')AND DATASET = 'USER') "
//}


      //  this.QueryFormation();
      }
 
  delete(index){
    
  //  const index: number = this.condition.indexOf();
  if (this.entity != null){
    if (index != -1) {
      this.value.splice(index, 1);
      this.entity.splice(index, 1);
      this.condition.splice(index, 1); 
    if(this.Endvalue != null){
      this.Endvalue.splice(index, 1);
    }
//      this.frm_delete = false;   
    }
  }
  //  console.log(index) 
  }
  deletelistitem(index){        
        this.list.splice(index, 1); 
        this.exportitemsArr.splice(index, 1);            
     
    }
  QueryFormation(){
    
    var keys = this.inputForm.value.functionsArr
    //["EQUALS", "BETWEEN", "LESS THAN", "GREATER THAN", "NOT EQUAL TO", "IS NOTHING", "IS ANYTHING", "IS TRUE", "IS FALSE"]
    switch (keys) {
      case 'EQUALS':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +" like ('"  + this.value + "')"
          this.Savesqlcondition = this.ConditionEntity +" like ('+'''"  + this.value + "'''+')" //'''NSW'''
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +" like ('"  + this.value + "')"      
        this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" like (' + '''"  + this.value + "'''+')"
        }
        
        break;
        case 'BETWEEN':
          if(this.sqlcondition == null){
            this.sqlcondition = this.ConditionEntity +"  Between ('"  + this.value + "') and ('"  + this.Endvalue + "')"
            this.Savesqlcondition = this.ConditionEntity +" Between ('+'"  + this.value + "'+') and ('+'" + this.Endvalue + "'+')"
          }else{ 
          this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +" Between ('"  + this.value + "') and ('"  + this.Endvalue + "')"
          this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" Between (' + '"  + this.value + "'+') and (' + '" + this.Endvalue + "'+')"
          }
          break;
        case 'LESS THAN':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +"  < ('"  + this.value + "')"
          this.Savesqlcondition = this.ConditionEntity +" < ('+'"  + this.value + "'+')"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +" <  ('"  + this.value + "')"
        this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" < (' + '"  + this.value + "'+')"
        }
        break;
      case 'GREATER THAN':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +" >  ('"  + this.value + "')"
          this.Savesqlcondition = this.ConditionEntity +" > ('+'"  + this.value + "'+')"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"  > ('"  + this.value + "')"
        this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" > (' + '"  + this.value + "'+')"
        }
        break;
      case 'NOT EQUAL TO':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +" <>  ('"  + this.value + "')"
          this.Savesqlcondition = this.ConditionEntity +" <> ('+'"  + this.value + "'+')"
        }else{ 
        this.sqlcondition = this.sqlcondition + " AND " + this.ConditionEntity +" <>  ('"  + this.value + "')"
        this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" <> (' + '"  + this.value + "'+')"
        }
        break;
      case 'IS NOTHING':
        if(this.sqlcondition == null){
        // this.sqlcondition = this.ConditionEntity +"   ('"  + this.value + "')"
        // this.Savesqlcondition = this.ConditionEntity +" like ('+'"  + this.value + "'+')"
        }else{ 
        //  this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"   ('"  + this.value + "')"
        //  this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" like (' + '"  + this.value + "'+')"
        }
        break;
      case 'IS ANYTHING':
        if(this.sqlcondition == null){
        //  this.sqlcondition = " "//this.ConditionEntity +"   ('"  + this.value + "')"
        }else{ 
        //  this.sqlcondition =this.sqlcondition + " "// " AND " + this.ConditionEntity +"   ('"  + this.value + "')"
        //  this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" like (' + '"  + this.value + "'+')"
        }
        break; 
      case 'IS TRUE':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +"  = true "
          this.Savesqlcondition = this.ConditionEntity +" = true "
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"  = true "
        this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" = true "
        }
        break;
      case 'IS FALSE':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +"   = false"
          this.Savesqlcondition = this.ConditionEntity +" = false "
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"   = false "
        this.Savesqlcondition = this.Savesqlcondition + " AND " +this.ConditionEntity +" = false "
        }
        break;
      default:
        break;
    }
//  console.log(this.list)
this.sqlselect = "Select " + this.ColumnNameAdjuster(this.list)//.join(" as Field"+ this.feildname() +", ")

  this.sql = this.sqlselect + this.TablesSetting(this.list);
  this.Saverptsql = this.sqlselect + this.TablesSetting(this.list) ;

  
  
  if ((this.inputForm.value.radiofiletr).toString() == 'donotmeet') {
    
    if(this.sqlcondition != undefined){  
    this.sql =  this.sql + " where Not " +  this.sqlcondition  ;
    this.Saverptsql = this.Saverptsql +  "  where Not  " + this.Savesqlcondition ;
    }
    
  }else{   
    
    if(this.sqlcondition != undefined){              
    this.sql =  this.sql + ' where ' +  this.sqlcondition ;
    this.Saverptsql = this.Saverptsql +  " where " + this.Savesqlcondition ;
    }
    
  }
       
    //console.log(this.Saverptsql)
    console.log(this.sql)
  
  
    

  }
  ShowReport(){
    this.ReportPreview = true;
    this.QueryFormation();
    this.tryDoctype = "";
    console.log(this.RptFormat.toString())
  //  if(this.sqlcondition != null || this.sqlcondition != undefined){
    this.ReportRender(this.sql);
  //  console.log(this.sql)
    
  //  }
    
  }
  showprompt(){
    //this.bodystyle = { height:'300px', overflow: 'auto'}
    this.isVisibleprompt = true;
  }
  SaveReport(){
    this.ReportPreview = false;
    this.QueryFormation();     
      this.isVisibleprompt = false;
//      var RptSQL  =  this.QueryFinlization(this.Saverptsql);
      var RptSQL  =  this.Saverptsql;
      this.RptTitle = (this.inputForm.value.RptTitle).toString();

      console.log(this.RptFormat.toString())

      
      let filtertitle = forkJoin([
        this.ReportS.GetReportNames(this.RptFormat.toString()),                                              
        ]);   
      filtertitle.subscribe(data => {           
        this.titleArr = data[0];  
        if(data[0].includes(this.RptTitle)){

          this.Filterheck = false;

          this.ModalS.warning({
            nzTitle: 'TRACCS',
            nzContent: 'The Report Title Alredy Exists.',
              nzOnOk: () => {
                this.isVisibleprompt = true;
                this.Filterheck = true;
              },
          });
        }
      });
        
     

      if(this.RptTitle != null && RptSQL != null &&  this.Filterheck == true){
    //var Title  = this.RptTitle;
    var Format  = this.RptFormat;
    //console.log(Format)
    var CriteriaDisplay = "Report Criteria" ;
    var DateType = " ";
    var UserID = this.tocken.nameid;
    
     
   var insertsql = " INSERT INTO ReportNames(Title, Format,SQLText,UserID, DateType, CriteriaDisplay) " +
   " VALUES( '" + this.RptTitle +"' , '"+Format+"' , '"+RptSQL+"' , '"+UserID+"' , '"+DateType+"' , '"+CriteriaDisplay + "') "   

   //console.log(insertsql)
   
   
   this.ReportS.InsertReport(insertsql).subscribe(x=>{
   //  console.log(data)
    if(x != null) {
     this. GlobalS.sToast('Success', 'Saved successful'); 
     this.router.navigate(['/admin/reports']);    
    }    
   });    
      }
     

  }
  back2adminRpt(){
    this.router.navigate(['/admin/reports']); 
  }
  QueryFinlization(s_sql:string){
  //  console.log(sql)
      var S_SQL,sql = " ";
      
    if(this.includeConatctWhere != undefined && this.includeConatctWhere != ""){ sql = sql + " AND " + this.includeConatctWhere}
    if(this.includeGoalcareWhere != undefined && this.includeGoalcareWhere != ""){sql = sql + " AND " + this.includeGoalcareWhere}
    if(this.includeReminderWhere != undefined && this.includeReminderWhere != ""){sql = sql + " AND " + this.includeReminderWhere}
    if(this.includeUserGroupWhere != undefined && this.includeUserGroupWhere != ""){sql = sql + " AND " + this.includeUserGroupWhere}
    if(this.includePrefrencesWhere != undefined && this.includePrefrencesWhere != ""){sql = sql + " AND " + this.includePrefrencesWhere}
    if(this.includeIncludSWhere != undefined && this.includeIncludSWhere != ""){sql = sql + " AND " + this.includeIncludSWhere}
    if(this.includeExcludeSWhere != undefined && this.includeExcludeSWhere != ""){sql = sql + " AND " + this.includeExcludeSWhere}
    if(this.includeRecipientPensionWhere != undefined && this.includeRecipientPensionWhere != ""){sql = sql + " AND " + this.includeRecipientPensionWhere}
    if(this.includeLoanitemWhere != undefined && this.includeLoanitemWhere != ""){sql = sql + " AND " + this.includeLoanitemWhere}
    if(this.includeSvnDetailNotesWhere != undefined && this.includeSvnDetailNotesWhere != ""){sql = sql + " AND " + this.includeSvnDetailNotesWhere}
    if(this.includeSvcSpecCompetencyWhere != undefined && this.includeSvcSpecCompetencyWhere != ""){sql = sql + " AND " + this.includeSvcSpecCompetencyWhere}
    if(this.includeOPHistoryWhere != undefined && this.includeOPHistoryWhere != ""){sql = sql + " AND " + this.includeOPHistoryWhere}
    if(this.includeClinicHistoryWhere != undefined && this.includeClinicHistoryWhere != ""){sql = sql + " AND " + this.includeClinicHistoryWhere}
    if(this.includeRecipientCompetencyWhere != undefined && this.includeRecipientCompetencyWhere != ""){sql = sql + " AND " + this.includeRecipientCompetencyWhere}
    if(this.includeCareplanWhere != undefined && this.includeCareplanWhere != ""){sql = sql + " AND " + this.includeCareplanWhere}
    if(this.includeHRCaseStaffWhere != undefined && this.includeHRCaseStaffWhere != ""){sql = sql + " AND " + this.includeHRCaseStaffWhere}
      
   if(this.sqlcondition == undefined){
    S_SQL = s_sql + ' where ' + sql.substring(6,sql.length+1);
  }else{
     S_SQL = s_sql + ' ' + sql
  }
//  console.log(S_SQL)
    if(this.ReportPreview == true){
      return this.sql = S_SQL;
    }else{
      return this.Saverptsql = S_SQL;
      
    }
  }
  ReportRender(sql:string){

  //  console.log(sql);
    this.drawerVisible = true;
    this.loading = true;
    /*
    if(this.includeConatctWhere != undefined && this.includeConatctWhere != ""){ sql = sql + " AND " + this.includeConatctWhere}
    if(this.includeGoalcareWhere != undefined && this.includeGoalcareWhere != ""){sql = sql + " AND " + this.includeGoalcareWhere}
    if(this.includeReminderWhere != undefined && this.includeReminderWhere != ""){sql = sql + " AND " + this.includeReminderWhere}
    if(this.includeUserGroupWhere != undefined && this.includeUserGroupWhere != ""){sql = sql + " AND " + this.includeUserGroupWhere}
    if(this.includePrefrencesWhere != undefined && this.includePrefrencesWhere != ""){sql = sql + " AND " + this.includePrefrencesWhere}
    if(this.includeIncludSWhere != undefined && this.includeIncludSWhere != ""){sql = sql + " AND " + this.includeIncludSWhere}
    if(this.includeExcludeSWhere != undefined && this.includeExcludeSWhere != ""){sql = sql + " AND " + this.includeExcludeSWhere}
    if(this.includeRecipientPensionWhere != undefined && this.includeRecipientPensionWhere != ""){sql = sql + " AND " + this.includeRecipientPensionWhere}
    if(this.includeLoanitemWhere != undefined && this.includeLoanitemWhere != ""){sql = sql + " AND " + this.includeLoanitemWhere}
    if(this.includeSvnDetailNotesWhere != undefined && this.includeSvnDetailNotesWhere != ""){sql = sql + " AND " + this.includeSvnDetailNotesWhere}
    if(this.includeSvcSpecCompetencyWhere != undefined && this.includeSvcSpecCompetencyWhere != ""){sql = sql + " AND " + this.includeSvcSpecCompetencyWhere}
    if(this.includeOPHistoryWhere != undefined && this.includeOPHistoryWhere != ""){sql = sql + " AND " + this.includeOPHistoryWhere}
    if(this.includeClinicHistoryWhere != undefined && this.includeClinicHistoryWhere != ""){sql = sql + " AND " + this.includeClinicHistoryWhere}
    if(this.includeRecipientCompetencyWhere != undefined && this.includeRecipientCompetencyWhere != ""){sql = sql + " AND " + this.includeRecipientCompetencyWhere}
    if(this.includeCareplanWhere != undefined && this.includeCareplanWhere != ""){sql = sql + " AND " + this.includeCareplanWhere}
    if(this.includeHRCaseStaffWhere != undefined && this.includeHRCaseStaffWhere != ""){sql = sql + " AND " + this.includeHRCaseStaffWhere}

    
    */
    
      
      
    
    var fQuery = this.QueryFinlization(this.sql) 
      
          //console.log(fQuery)
      //  console.log(this.inputForm.value.printaslabel)
      
      
      var Title = "User Defined Report"
  //    console.log(this.tocken.user)
      const data = {
        "template": { "_id": "x8QVE8KhcjiJvD6c" },
          //"template": { "_id": "qTQEyEz8zqNhNgbU" },
          //{"shortid":"w1Vify0-uA"}, //
          "options": {
              "reports": { "save": false },
              //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
              "sql": fQuery,              
              "userid": this.tocken.user,
              "txtTitle": Title,
            //  "headings" :this.list,
               
            //  "Fields" :this.FieldsNo ,
              
              
          }
      }
      this.loading = true;
      

      this.printS.printControl(data).subscribe((blob: any) => {
        this.pdfTitle = "User Defined Report.pdf";
        this.drawerVisible = true;                   
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loading = false;
        this.cd.detectChanges();
    }, err => {
        console.log(err);
        this.loading = false;
        this.ModalS.error({
            nzTitle: 'TRACCS',
            nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
            nzOnOk: () => {
                this.drawerVisible = false;
            },
        });
    });

    return;
      }

      handleCancelTop(){
        this.drawerVisible = false;
        this.isVisibleprompt = false;
      }
      feildname(){
        var temp
        this.rptfieldname =  1;
        temp = this.rptfieldname;
              return temp
            }
ColumnNameAdjuster(fld){
   
  var columnNames:Array<any> = [];
  this.FieldsNo = fld.length;
//  console.log(this.FieldsNo) 
if(this.RptFormat == "AGENCYSTFLIST" || this.RptFormat == "USERSTFLIST"){
  for (var key of fld){
    switch (key) {
//STAFF NAME AND ADDRESS      
          case 'Title':
                  if(columnNames != []){          
          columnNames = columnNames.concat(['Staff.Title as Title'])
        }else{
          columnNames = (['Staff.Title as Title'])
        }        
          break;
          case 'First Name':
                  if(columnNames != []){          
          columnNames = columnNames.concat(['Staff.FirstName as [First Name]'])
        }else{          
          columnNames = (['Staff.FirstName as [First Name]'])}

        break;
      case 'Middle Name':
                  if(columnNames != ['']){
          columnNames = columnNames.concat(['Staff.MiddleNames as [Middle Name]'])
        }else{columnNames = (['Staff.MiddleNames as [Middle Name]'])}        
          break;                   
        case 'Surname/Organisation':
                  if(columnNames != []){
          columnNames = columnNames.concat(['Staff.LastName as [Surname/Organisation] '])
        }else{columnNames = (['Staff.LastName as  [Surname/Organisation]'])}        
          break;
          case 'Preferred Name':
                  if(columnNames != []){
          columnNames = columnNames.concat(['Staff.PreferredName as [Preferred Name] '])
        }else{columnNames = (['Staff.PreferredName as [Preferred Name] '])}        
          break; 
          case 'contact Address Line 1':
            var Address1 = "(SELECT TOP 1 address1 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<CONTACT>')"
                  if(columnNames != []){
          columnNames = columnNames.concat([Address1 +'as [Address-Line1]'])
        }else{columnNames = ([Address1 +'as Address-Line1'])}        
          break;
          case 'contact Address Line 2':
            var Address2 = "(SELECT TOP 1 address2 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<CONTACT>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([Address2 +'as [ Address-Line2]'])
        }else{columnNames = ([Address2 +'as [ Address-Line2]'])}        
          break;
          case 'contact Address-Suburb':
            var contact_suburb = "(SELECT TOP 1 suburb FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<CONTACT>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([contact_suburb +'AS [ Address-Suburb]'])
        }else{columnNames = ([contact_suburb +'AS [ Address-Suburb]'])}        
          break;
          case 'contact Address-Postcode':
            var AddressPostcode = "(SELECT TOP 1 postcode FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<CONTACT>') " 
                  if(columnNames != []){
          columnNames = columnNames.concat([AddressPostcode +'AS [ Address-Postcode]'])
        }else{columnNames = ([AddressPostcode +'AS [ Address-Postcode]'])}        
          break;
          case 'contact Address-state':
            var state = "(SELECT TOP 1 CASE WHEN LEFT(postcode, 1) = '0' THEN 'NT' WHEN LEFT(postcode, 1) = '2' THEN CASE WHEN postcode BETWEEN '2600' and '2618'OR     postcode BETWEEN '2900' AND    '2999' THEN 'ACT' ELSE 'NSW' END WHEN LEFT(postcode, 1) = '3' THEN 'VIC' WHEN LEFT(postcode, 1) = '4' THEN 'QLD' WHEN LEFT(postcode, 1) = '5' THEN 'SA' WHEN LEFT(postcode, 1) = '6' THEN 'WA' WHEN LEFT(postcode, 1) = '7' THEN 'TAS' END AS primarystate FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<CONTACT>') " 
                  if(columnNames != []){
          columnNames = columnNames.concat([state +'AS [ Address-State]'])
        }else{columnNames = ([state +'AS [ Address-State]']) }      
          break;
          case 'contact Address-GoogleAddress':
            var googleaddress = "(SELECT TOP 1 googleaddress FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<USUAL>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([googleaddress+' AS [ Address-GoogleAddress]'])
        }else{columnNames = ([googleaddress+' AS [ Address-GoogleAddress]'])}        
          break;
          case 'Usual Address Line 1':
            var U_Address1 = "(SELECT TOP 1 address1 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<USUAL>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([U_Address1+'AS [ Address-Line1]'])
        }else{columnNames = ([U_Address1+'AS [ Address-Line1]'])}        
          break;
          case 'Usual Address Line 2':
            var U_Address2 = "(SELECT TOP 1 address2 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<USUAL>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([U_Address2+'AS [ Address-Line2]'])
        }else{columnNames = ([U_Address2+'AS [ Address-Line2]'])}        
          break;
          case 'Usual Address-Suburb':
            var U_Address_Suburb = "(SELECT TOP 1suburb FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<USUAL>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([U_Address_Suburb+'AS [ Address-Suburb]'])
        }else{columnNames = ([U_Address_Suburb+'AS [ Address-Suburb]'])}        
          break;
          case 'Usual Address-Postcode':
            var U_Address_postode = "(SELECT TOP 1 postcode FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<USUAL>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([U_Address_postode+'AS [ Address-Postcode]'])
        }else{columnNames = ([U_Address_postode+'AS [ Address-Postcode]'])}        
          break;
          case 'Usual Address-state':
            var U_Address_state = "(SELECT TOP 1 CASE WHEN LEFT(postcode, 1) = '0' THEN 'NT' WHEN LEFT(postcode, 1) = '2' THEN CASE WHEN postcode BETWEEN '2600' AND    '2618' OR     postcode BETWEEN '2900' AND    '2999' THEN 'ACT' ELSE 'NSW' END WHEN LEFT(postcode, 1) = '3' THEN 'VIC' WHEN LEFT(postcode, 1) = '4' THEN 'QLD' WHEN LEFT(postcode, 1) = '5' THEN 'SA' WHEN LEFT(postcode, 1) = '6' THEN 'WA' WHEN LEFT(postcode, 1) = '7' THEN 'TAS' END AS primarystate FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<USUAL>')"
                  if(columnNames != []){
          columnNames = columnNames.concat([U_Address_state+'AS [ Address-State]'])
        }else{columnNames = ([U_Address_state+'AS [ Address-State]'])}        
          break;
          case 'Usual Address-GoogleAddress':
            var U_Address_google = "(SELECT TOP 1 googleaddress FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = '<USUAL>') "
                  if(columnNames != []){
          columnNames = columnNames.concat([U_Address_google+'AS [ Address-GoogleAddress]'])
        }else{columnNames = ([U_Address_google+'AS [ Address-GoogleAddress]'])}        
          break;    
      case 'Billing Address Line 1':
        var B_Address1 = "(SELECT TOP 1 address1 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'BILLING ADDRESS') "
            if(columnNames != []){
    columnNames = columnNames.concat([B_Address1+'AS [BILLING ADDRESS Address-Line1]'])
        }else{columnNames = ([B_Address1+'AS [BILLING ADDRESS Address-Line1]'])}        
    break;
    case 'Billing Address Line 2':
      var B_Address2 = "(SELECT TOP 1 address2 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'BILLING ADDRESS') "
      if(columnNames != []){
      columnNames = columnNames.concat([B_Address2+'AS [BILLING ADDRESS Address-Line2]'])
      }else{columnNames = ([B_Address2+'AS [BILLING ADDRESS Address-Line2]'])}        
    break;
    case 'Billing Address-Suburb':
      var B_Address_Suburb = "(SELECT TOP 1 suburb FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'BILLING ADDRESS') "
      if(columnNames != []){
      columnNames = columnNames.concat([B_Address_Suburb+'AS [BILLING ADDRESS Address-Suburb]'])
      }else{columnNames = ([B_Address_Suburb+'AS [BILLING ADDRESS Address-Suburb]'])}        
    break;
    case 'Billing Address-Postcode':
      var B_Address_postcode = "(SELECT TOP 1 postcode FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'BILLING ADDRESS') "
      if(columnNames != []){
      columnNames = columnNames.concat([B_Address_postcode+'AS [BILLING ADDRESS Address-Postcode]'])
      }else{columnNames = ([B_Address_postcode+'AS [BILLING ADDRESS Address-Postcode]'])}        
    break;
    case 'Billing Address-state':
      var B_Address_State = "(SELECT TOP 1 CASE WHEN LEFT(postcode, 1) = '0' THEN 'NT' WHEN LEFT(postcode, 1) = '2' THEN CASE WHEN postcode BETWEEN '2600' AND    '2618' OR     postcode BETWEEN '2900' AND    '2999' THEN 'ACT' ELSE 'NSW' END WHEN LEFT(postcode, 1) = '3' THEN 'VIC' WHEN LEFT(postcode, 1) = '4' THEN 'QLD' WHEN LEFT(postcode, 1) = '5' THEN 'SA' WHEN LEFT(postcode, 1) = '6' THEN 'WA' WHEN LEFT(postcode, 1) = '7' THEN 'TAS' END AS primarystate FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'BILLING ADDRESS') "
      if(columnNames != []){
      columnNames = columnNames.concat([B_Address_State+'AS [BILLING ADDRESS Address-State]'])
      }else{columnNames = ([B_Address_State+'AS [BILLING ADDRESS Address-State]'])}        
    break;
    case 'Billing Address-GoogleAddress':
      var B_Address_Google = "(SELECT TOP 1 googleaddress FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'BILLING ADDRESS') "
      if(columnNames != []){
      columnNames = columnNames.concat([B_Address_Google+'AS [BILLING ADDRESS Address-GoogleAddress]'])
      }else{columnNames = ([B_Address_Google+'AS [BILLING ADDRESS Address-GoogleAddress]'])}        
    break;
    case 'Destination Address Line 1':
      var D_Address1 = "(SELECT TOP 1 address1 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'DESTINATION') "
      if(columnNames != []){
      columnNames = columnNames.concat([D_Address1+'AS [DESTINATION Address-Line1]'])
      }else{columnNames = ([D_Address1+'AS [DESTINATION Address-Line1]'])}        
    break;
    case 'Destination Address Line 2':
      var D_Address2 = "(SELECT TOP 1 address2 FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'DESTINATION') "
      if(columnNames != []){
      columnNames = columnNames.concat([D_Address2+'AS [DESTINATION Address-Line2]'])
      }else{columnNames = ([D_Address2+'AS [DESTINATION Address-Line2]'])}        
    break;
    case 'Destination Address-Suburb ':
      var D_suburb = "(SELECT TOP 1 suburb FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'DESTINATION') "
      if(columnNames != []){
      columnNames = columnNames.concat([D_suburb+'AS [DESTINATION Address-Suburb]'])
      }else{columnNames = ([D_suburb+'AS [DESTINATION Address-Suburb]'])}        
    break;
    case 'Destination Address-Postcode':
      var D_Address_postcode = "(SELECT TOP 1 postcode FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'DESTINATION') "
      if(columnNames != []){
      columnNames = columnNames.concat([D_Address_postcode+'AS [DESTINATION Address-Postcode]'])
      }else{columnNames = ([D_Address_postcode+'AS [DESTINATION Address-Postcode]'])}        
    break;
    case 'Destination Address-state':
      var D_Address_State = "(SELECT TOP 1 CASE WHEN LEFT(postcode, 1) = '0' THEN 'NT' WHEN LEFT(postcode, 1) = '2' THEN CASE WHEN postcode BETWEEN '2600' AND    '2618' OR     postcode BETWEEN '2900' AND    '2999' THEN 'ACT' ELSE 'NSW' END WHEN LEFT(postcode, 1) = '3' THEN 'VIC' WHEN LEFT(postcode, 1) = '4' THEN 'QLD' WHEN LEFT(postcode, 1) = '5' THEN 'SA' WHEN LEFT(postcode, 1) = '6' THEN 'WA' WHEN LEFT(postcode, 1) = '7' THEN 'TAS' END AS primarystate FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'DESTINATION') "
      if(columnNames != []){
      columnNames = columnNames.concat([D_Address_State+'AS [DESTINATION Address-State]'])
      }else{columnNames = ([D_Address_State+'AS [DESTINATION Address-State]'])}        
    break;
    case 'Destination Address-GoogleAddress':
      var D_Address_google = "(SELECT TOP 1 googleaddress FROM   namesandaddresses WHERE  personid = uniqueid AND    [Type] = 'PERSONALADDRESS' AND    description = 'DESTINATION') "
      if(columnNames != []){
      columnNames = columnNames.concat([D_Address_google+'AS [DESTINATION Address-GoogleAddress]'])
      }else{columnNames = ([D_Address_google+'AS [DESTINATION Address-GoogleAddress]'])}        
    break;
    case 'Email':
      var Email = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = '<EMAIL>') "
      if(columnNames != []){
      columnNames = columnNames.concat([Email+'AS [Email]'])
      }else{columnNames = ([Email+'AS [Email]'])}        
    break;      
    case 'Email-SMS':
      var Email_sms = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = '<EMAIL-SMS>') "
      if(columnNames != []){
      columnNames = columnNames.concat([Email_sms+'AS [Email-SMS]'])
    }else{columnNames = ([Email_sms+'AS [Email-SMS]'])}        
    break;
    case 'FAX':
      var fax = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = '<FAX>') "
      if(columnNames != []){
      columnNames = columnNames.concat([fax+'AS [FAX]'])
      }else{columnNames = ([fax+'AS [FAX]'])}        
    break;
    case 'Home Phone':
      var H_Phone = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = '<HOME>') "
      if(columnNames != []){
      columnNames = columnNames.concat([H_Phone+'AS [Home-Phone]'])
      }else{columnNames = ([H_Phone+'AS [Home-Phone]'])}        
    break;
    case 'Mobile Phone':
      var Mobile_Phone = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = '<MOBILE>') "
      if(columnNames != []){
      columnNames = columnNames.concat([Mobile_Phone+'AS [Mobile-Phone]'])
      }else{columnNames = ([Mobile_Phone+'AS [Mobile-Phone]'])}        
    break;
    case 'Usual Phone':
      var Usual_Phone = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = '<USUAL>') "
      if(columnNames != []){
      columnNames = columnNames.concat([Usual_Phone+'AS [Usual-Phone]'])
      }else{columnNames = ([Usual_Phone+'AS [Usual-Phone]'])}        
    break;
    case 'Work Phone':
      var Work_Phone = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = '<WORK>') "
      if(columnNames != []){
      columnNames = columnNames.concat([Work_Phone+'AS [Work-Phone]'])
      }else{columnNames = ([Work_Phone+'AS [Work-Phone]'])}        
    break;
    case 'Current Phone Number':
      var Current_phone = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = 'CURRENT PHONE NUMBER' ) "
      if(columnNames != []){
      columnNames = columnNames.concat([Current_phone+'AS [CURRENT PHONE NUMBER]'])
      }else{columnNames = ([Current_phone+'AS [CURRENT PHONE NUMBER]'])}        
    break;
    case 'Other Phone Number':
      var other_phone = "(SELECT TOP 1 phonefaxother.detail FROM   phonefaxother WHERE  personid = uniqueid AND    phonefaxother.type = 'OTHER PHONE NUMBER') "
      if(columnNames != []){
      columnNames = columnNames.concat([other_phone+'AS [OTHER PHONE NUMBER]'])
      }else{columnNames = ([other_phone+'AS [OTHER PHONE NUMBER]'])}        
    break;
//  Contacts & Next of Kin
          case 'Contact Group':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Group]   '])
            }else{columnNames = (['HR.[Group]   '])}
                break;
          case 'Contact Type':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Type]    '])
            }else{columnNames = (['HR.[Type]   '])} 
                break;
          case 'Contact Sub Type':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[SubType]  '])
            }else{columnNames = (['HR.[SubType]  '])}  
                break;
          case 'Contact User Flag':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[User1]  '])
            }else{columnNames = (['HR.[User1]  '])}
                break;                 
          case 'Contact Person Type':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[EquipmentCode]  '])
            }else{columnNames = (['HR.[EquipmentCode]  '])} 
                break;
          case 'Contact Name':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Name]  '])
            }else{columnNames = (['HR.[Name]  '])} 
                break;
          case 'Contact Address':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Address1]  '])
            }else{columnNames = (['HR.[Address1]  '])} 
                break;
          case 'Contact Suburb':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Suburb]  '])
            }else{columnNames = (['HR.[Suburb]  '])}
                break;
          case 'Contact Postcode':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Postcode]  '])
            }else{columnNames = (['HR.[Postcode]  '])} 
                break;
          case 'Contact Phone 1':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Phone1] '])
            }else{columnNames = (['HR.[Phone1] '])} 
                break;
          case 'Contact Phone 2':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Phone2]  '])
            }else{columnNames = (['HR.[Phone2]  '])} 
                break;
          case 'Contact Mobile': 
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Mobile]  '])
            }else{columnNames = (['HR.[Mobile]  '])}
                break;
          case 'Contact FAX':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[FAX]  '])
            }else{columnNames = (['HR.[FAX]  '])}
                break;
          case 'Contact Email':
            this.IncludeContacts = true
                  if(columnNames != []){
              columnNames = columnNames.concat(['HR.[Email]  '])
            }else{columnNames = (['HR.[Email]  '])}
                break;
// USER GROUPS                     
            case 'Group Name':
              if(columnNames != []){
              columnNames = columnNames.concat(['UserGroup.[Name]  '])
            }else{columnNames = (['UserGroup.[Name]  '])}  
                  break;
          case 'Group Note':
              if(columnNames != []){
              columnNames = columnNames.concat(['UserGroup.[Notes]  '])
            }else{columnNames = (['UserGroup.[Notes]  '])} 
                  break; 
          case 'Group Start Date':
              if(columnNames != []){
              columnNames = columnNames.concat(['UserGroup.[Date1]  '])
            }else{columnNames = (['UserGroup.[Date1]  '])}  
                  break;                      
          case 'Group End Date':
              if(columnNames != []){
              columnNames = columnNames.concat(['UserGroup.[Date2]  '])
            }else{columnNames = (['UserGroup.[Date2]  '])} 
                  break;
          case 'Group Email':
              if(columnNames != []){
              columnNames = columnNames.concat(['UserGroup.[Email]  '])
            }else{columnNames = (['UserGroup.[Email]  '])} 
                  break;
                
//Preferences                                        
          case 'Preference Name':
              if(columnNames != []){
              columnNames = columnNames.concat(['Prefr.[Name]  '])
            }else{columnNames = (['Prefr.[Name]  '])}  
                  break;                      
          case 'Preference Note':
              if(columnNames != []){
              columnNames = columnNames.concat(['Prefr.[Notes]  '])
            }else{columnNames = (['Prefr.[Notes]  '])}  
                  break;
//REMINDERS                      
          case 'Reminder Detail':
            if(columnNames != []){
            columnNames = columnNames.concat(['Remind.[Name]  '])
          }else{columnNames = (['Remind.[Name]  '])}
                break;
        case 'Event Date':
            if(columnNames != []){
            columnNames = columnNames.concat(['Remind.[Date2]  '])
          }else{columnNames = (['Remind.[Date2]  '])}  
                break;
                
        case 'Reminder Date':
            if(columnNames != []){
            columnNames = columnNames.concat(['Remind.[Date1]  '])
          }else{columnNames = (['Remind.[Date1]  '])}  
                break;
        case 'Reminder Notes':
            if(columnNames != []){
            columnNames = columnNames.concat(['Remind.[Notes]  '])
          }else{columnNames = (['Remind.[Notes]  '])}  
                break;
//Loan Items                      
        case 'Loan Item Type':
          if(columnNames != []){
        columnNames = columnNames.concat(['HRLoan.[Type]  '])
        }else{columnNames = (['HRLoan.[Type]  '])}
              break;
        case 'Loan Item Description':
          if(columnNames != []){
        columnNames = columnNames.concat(['HRLoan.[Name]  '])
        }else{columnNames = (['HRLoan.[Name]  '])}
              break;
        case 'Loan Item Date Loaned/Installed':
          if(columnNames != []){
        columnNames = columnNames.concat(['HRLoan.[Date1]  '])
        }else{columnNames = (['HRLoan.[Date1]  '])}
              break;                      
        case 'Loan Item Date Collected':
          if(columnNames != []){
        columnNames = columnNames.concat(['HRLoan.[Date2]  '])
        }else{columnNames = (['HRLoan.[Date2]  '])}
              break;
//  service information Fields                      
        case 'Staff Code':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Carer Code]  '])
        }else{columnNames = (['SvcDetail.[Carer Code]  '])}
              break;
        case 'Service Date':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.Date  '])
        }else{columnNames = (['SvcDetail.Date  '])}
              break;
        case 'Service Start Time':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Start Time]  '])
        }else{columnNames = (['SvcDetail.[Start Time]  '])}
              break;
        case 'Service Code':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Service Type]  '])
        }else{columnNames = (['SvcDetail.[Service Type]  '])}
              break;                      
        case 'Service Hours':
          if(columnNames != []){
        columnNames = columnNames.concat(['(SvcDetail.[Duration]*5) / 60  '])
        }else{columnNames = (['(SvcDetail.[Duration]*5) / 60  '])}
              break;
        case 'Service Pay Rate':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Unit Pay Rate]  '])
        }else{columnNames = (['SvcDetail.[Unit Pay Rate]  '])}
              break;
        case 'Service Bill Rate':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Unit Bill Rate]  '])
        }else{columnNames = (['SvcDetail.[Unit Bill Rate]  '])}
              break;
        case 'Service Bill Qty':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[BillQty]  '])
        }else{columnNames = (['SvcDetail.[BillQty]  '])}
              break;
        case 'Service Location/Activity Group':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[ServiceSetting]  '])
        }else{columnNames = (['SvcDetail.[ServiceSetting]  '])}
              break;
        case 'Service Program':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Program]  '])
        }else{columnNames = (['SvcDetail.[Program]  '])}
              break;
        case 'Service Group':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Type]  '])
        }else{columnNames = (['SvcDetail.[Type]  '])}
              break;
        case 'Service HACCType': 
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[HACCType]  '])
        }else{columnNames = (['SvcDetail.[HACCType]  '])}
              break;
        case 'Service Category':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Anal]  '])
        }else{columnNames = (['SvcDetail.[Anal]  '])}
              break;
        case 'Service Status':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Status]  '])
        }else{columnNames = (['SvcDetail.[Status]  '])}
              break;
        case 'Service Pay Type':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[Service Description]  '])
        }else{columnNames = (['SvcDetail.[Service Description]  '])}
              break;
        case 'Service Pay Qty':
          if(columnNames != []){
        columnNames = columnNames.concat(['SvcDetail.[CostQty]  '])
        }else{columnNames = (['SvcDetail.[CostQty]  '])}
              break;
        case 'Service End Time/ Shift End Time':
        var endtime = " Convert(varchar,DATEADD(minute,(SvcDetail.[Duration]*5) ,SvcDetail.[Start Time]),108) "
          if(columnNames != []){
        columnNames = columnNames.concat([endtime+'  '])
        }else{columnNames = ([endtime+'  '])}
              break;
        case 'Service Funding Source':
          if(columnNames != []){
        columnNames = columnNames.concat(['Humanresourcetypes.[Type]  '])
        }else{columnNames = (['Humanresourcetypes.[Type]  '])}
              break;  
        case 'Service Notes':
          if(columnNames != []){
        columnNames = columnNames.concat(['CAST(History.Detail AS varchar(4000))  '])
        }else{columnNames = (['CAST(History.Detail AS varchar(4000))  '])}
              break;
//Staff Attribute                           
        case 'Competency':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffAttribute.[competency]'])
        }else{columnNames = (['StaffAttribute.[competency]'])}
              break;
        case 'Competency Expiry Date':
                if(columnNames != []){
              columnNames = columnNames.concat(['StaffAttribute.[competency expiry date]'])
              }else{columnNames = (['StaffAttribute.[competency expiry date]'])}
              break;
        case 'Competency Reminder Date':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffAttribute.[competency reminder date]'])
        }else{columnNames = (['StaffAttribute.[competency reminder date]'])}
              break;
        case 'Competency Completion Date':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffAttribute.[competency completion date]'])
        }else{columnNames = (['StaffAttribute.[competency completion date]'])}
              break;
        case 'Mandatory Status':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffAttribute.[mandatory status]'])
        }else{columnNames = (['StaffAttribute.[mandatory status]'])}
              break;
        case 'Certificate Number':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffAttribute.[certificate number]'])
        }else{columnNames = (['StaffAttribute.[certificate number]'])}
              break;
        case 'Competency Notes':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffAttribute.[competency notes]'])
        }else{columnNames = (['StaffAttribute.[competency notes]'])}
              break;
        case 'Staff Position':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffPosition.[name]   AS [Staff Position]'])
        }else{columnNames = (['StaffPosition.[name]   AS [Staff Position]'])}
              break;
        case 'Staff Admin Categories':
          if(columnNames != []){
        columnNames = columnNames.concat(['staff.[subcategory]    AS [Staff Admin Categories]'])
        }else{columnNames = (['staff.[subcategory]    AS [Staff Admin Categories]'])}
              break;
        case 'NDIA Staff Level':
          if(columnNames != []){
        columnNames = columnNames.concat(['staff.[ndiastafflevel] AS [NDIA Staff Level]'])
        }else{columnNames = (['staff.[ndiastafflevel] AS [NDIA Staff Level]'])}
              break;
//STAFF Position
        case 'Staff Position':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffPosition.[name] AS [Staff Position]'])
        }else{columnNames = (['StaffPosition.[name] AS [Staff Position]'])}
              break;
        case 'Position Start Date':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffPosition.[start date] AS [Position Start Date]'])
        }else{columnNames = (['StaffPosition.[start date] AS [Position Start Date]'])}
              break;
        case 'Position End Date':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffPosition.[end date] AS [Position End Date]'])
        }else{columnNames = (['StaffPosition.[end date] AS [Position End Date]'])}
              break;              
        case 'Position ID':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffPosition.[position id]'])
        }else{columnNames = (['StaffPosition.[position id]'])}
              break;
        case 'Position Notes':
          if(columnNames != []){
        columnNames = columnNames.concat(['StaffPosition.[notes]      AS [Position Notes]'])
        }else{columnNames = (['StaffPosition.[notes]      AS [Position Notes]'])}
              break;
//Work Hours                  
        case 'Min_Daily_HRS':
          if(columnNames != []){
        columnNames = columnNames.concat(['hrs_daily_min    AS MIN_DAILY_HRS'])
        }else{columnNames = (['hrs_daily_min    AS MIN_DAILY_HRS'])}
              break;
              case 'Max_Daily_HRS':
                if(columnNames != []){
              columnNames = columnNames.concat(['hrs_daily_max    AS MAX_DAILY_HRS'])
              }else{columnNames = (['hrs_daily_max    AS MAX_DAILY_HRS'])}
                    break;
              case 'Min_Weekly_HRS':
                      if(columnNames != []){
                    columnNames = columnNames.concat(['hrs_weekly_min   AS MIN_WEEKLY_HRS'])
                    }else{columnNames = (['hrs_weekly_min   AS MIN_WEEKLY_HRS'])}
                    break;
              case 'Max_Weekly_HRS':
                if(columnNames != []){
              columnNames = columnNames.concat(['hrs_weekly_max   AS MAX_WEEKLY_HRS'])
              }else{columnNames = (['hrs_weekly_max   AS MAX_WEEKLY_HRS'])}
                    break;
              case 'Min_Pay_Period_HRS':
                if(columnNames != []){
              columnNames = columnNames.concat(['hrs_fnightly_min AS MIN_PAY_PERIOD_HRS'])
              }else{columnNames = (['hrs_fnightly_min AS MIN_PAY_PERIOD_HRS'])}
                    break;
              case 'Max_Pay_Period_HRS':
                if(columnNames != []){
              columnNames = columnNames.concat(['hrs_fnightly_max AS MAX_PAY_PERIOD_HRS'])
              }else{columnNames = (['hrs_fnightly_max AS MAX_PAY_PERIOD_HRS'])}
                    break;
              case 'Week_1_Day_1':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_1_1 AS WEEK_1_DAY_1'])
              }else{columnNames = (['ch_1_1 AS WEEK_1_DAY_1'])}
                    break;                    
              case 'Week_1_Day_2':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_1_2 AS WEEK_1_DAY_2'])
              }else{columnNames = (['ch_1_2 AS WEEK_1_DAY_2'])}
                    break;
              case 'Week_1_Day_3':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_1_3 AS WEEK_1_DAY_3'])
              }else{columnNames = (['ch_1_3 AS WEEK_1_DAY_3'])}
                    break;
              case 'Week_1_Day_4':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_1_4 AS WEEK_1_DAY_4'])
              }else{columnNames = (['ch_1_4 AS WEEK_1_DAY_4'])}
                    break;
              case 'Week_1_Day_5':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_1_5 AS WEEK_1_DAY_5'])
              }else{columnNames = (['ch_1_5 AS WEEK_1_DAY_5'])}
                    break;
              case 'Week_1_Day_6':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_1_6 AS WEEK_1_DAY_6'])
              }else{columnNames = (['ch_1_6 AS WEEK_1_DAY_6'])}
                    break;
              case 'Week_1_Day_7':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_1_7 AS WEEK_1_DAY_7'])
              }else{columnNames = (['ch_1_7 AS WEEK_1_DAY_7'])}
                    break;
              case 'Week_2_Day_1':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_2_1 AS WEEK_2_DAY_1'])
              }else{columnNames = (['ch_2_1 AS WEEK_2_DAY_1'])}
                    break;              
              case 'Week_2_Day_2':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_2_2 AS WEEK_2_DAY_2'])
              }else{columnNames = (['ch_2_2 AS WEEK_2_DAY_2'])}
                    break;                    
              case 'Week_2_Day_3':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_2_3 AS WEEK_2_DAY_3'])
              }else{columnNames = (['ch_2_3 AS WEEK_2_DAY_3'])}
                    break;
              case 'Week_2_Day_4':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_2_4 AS WEEK_2_DAY_4'])
              }else{columnNames = (['ch_2_4 AS WEEK_2_DAY_4'])}
                    break;
              case 'Week_2_Day_5':
          if(columnNames != []){
        columnNames = columnNames.concat(['ch_2_5 AS WEEK_2_DAY_5'])
        }else{columnNames = (['ch_2_5 AS WEEK_2_DAY_5'])}
              break;
        case 'Week_2_Day_6':
                if(columnNames != []){
              columnNames = columnNames.concat(['ch_2_6 AS WEEK_2_DAY_6'])
              }else{columnNames = (['ch_2_6 AS WEEK_2_DAY_6'])}
              break;
        case 'Week_2_Day_7':
          if(columnNames != []){
        columnNames = columnNames.concat(['ch_2_7 AS WEEK_2_DAY_7'])
        }else{columnNames = (['ch_2_7 AS WEEK_2_DAY_7'])}
              break;
//Staff Incident              
        case 'INCD_Status':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_status'])
        }else{columnNames = (['staffincidents.incd_status'])}
              break;
        case 'INCD_Date':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_date'])
        }else{columnNames = (['staffincidents.incd_date'])}
              break;
        case 'INCD_Type':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_type'])
        }else{columnNames = (['staffincidents.incd_type'])}
              break;
        case 'INCD_Description':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_description'])
        }else{columnNames = (['staffincidents.incd_description'])}
              break;
        case 'INCD_SubCategory':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_subcategory'])
        }else{columnNames = (['staffincidents.incd_subcategory'])}
              break;               
        case 'INCD_Assigned_To':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_assigned_to'])
        }else{columnNames = (['staffincidents.incd_assigned_to'])}
              break;
        case 'INCD_Service':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_service'])
        }else{columnNames = (['staffincidents.incd_service'])}
              break;
        case 'INCD_Severity':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_severity'])
        }else{columnNames = (['staffincidents.incd_severity'])}
              break;
        case 'INCD_Time':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_time'])
        }else{columnNames = (['staffincidents.incd_time'])}
              break;
        case 'INCD_Duration':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_duration'])
        }else{columnNames = (['staffincidents.incd_duration'])}
              break;                                                                                                                                                          
        case 'INCD_Location':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_location'])
        }else{columnNames = (['staffincidents.incd_location'])}
              break;
        case 'INCD_LocationNotes':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_locationnotes'])
        }else{columnNames = (['staffincidents.incd_locationnotes'])}
              break;
        case 'INCD_ReportedBy':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_reportedby'])
        }else{columnNames = (['staffincidents.incd_reportedby'])}
              break;
              case 'INCD_DateReported':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_datereported'])
              }else{columnNames = (['staffincidents.incd_datereported'])}
                    break;
              case 'INCD_Reported':
                var Stf_incd_reported = "CASE WHEN staffincidents.incd_reported = 1 THEN 'YES' ELSE 'NO END  "
                      if(columnNames != []){
                    columnNames = columnNames.concat([Stf_incd_reported+'AS incd_reported'])
                    }else{columnNames = ([Stf_incd_reported+'AS incd_reported'])}
                    break;                                                                                                                                            
              case 'INCD_FullDesc':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_fulldesc'])
              }else{columnNames = (['staffincidents.incd_fulldesc'])}
                    break;
              case 'INCD_Program':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_program'])
              }else{columnNames = (['staffincidents.incd_program'])}
                    break;
              case 'INCD_DSCServiceType':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_dscservicetype'])
              }else{columnNames = (['staffincidents.incd_dscservicetype'])}
                    break;
              case 'INCD_TriggerShort':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_triggershort'])
              }else{columnNames = (['staffincidents.incd_triggershort'])}
                    break;
              case 'INCD_level':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_incident_level'])
              }else{columnNames = (['staffincidents.incd_incident_level'])}
                    break;                                                            
              case 'INCD_Area':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_area'])
              }else{columnNames = (['staffincidents.incd_area'])}
                    break;
              case 'INCD_Region':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_region'])
              }else{columnNames = (['staffincidents.incd_region'])}
                    break;
              case 'INCD_Position':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_position'])
              }else{columnNames = (['staffincidents.incd_position'])}
                    break;                                                                                
              case 'INCD_Phone':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_phone'])
              }else{columnNames = (['staffincidents.incd_phone'])}
                    break;
              case 'INCD_Verbal_Date':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_verbal_date'])
              }else{columnNames = (['staffincidents.incd_verbal_date'])}
                    break;                                                                                                                                                                                    
              case 'INCD_Verbal_Time':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_verbal_time'])
              }else{columnNames = (['staffincidents.incd_verbal_time'])}
                    break;              
              case 'INCD_By_Whome':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_by_whome'])
              }else{columnNames = (['staffincidents.incd_by_whome'])}
                    break;
              case 'INCD_To_Whome':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_to_whome'])
              }else{columnNames = (['staffincidents.incd_to_whome'])}
                    break;
              case 'INCD_BriefSummary':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_briefsummary'])
              }else{columnNames = (['staffincidents.incd_briefsummary'])}
                    break;
                    case 'INCD_ReleventBackground':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_releventbackground'])
        }else{columnNames = (['staffincidents.incd_releventbackground'])}
              break;                            
        case 'INCD_SummaryOfAction':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_summaryofaction'])
              }else{columnNames = (['staffincidents.incd_summaryofaction'])}
              break;
        case 'INCD_SummaryOfOtherAction':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_summaryofotheraction'])
        }else{columnNames = (['staffincidents.incd_summaryofotheraction'])}
              break;
        case 'INCD_Triggers':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_triggers'])
        }else{columnNames = (['staffincidents.incd_triggers'])}
              break;
        case 'INCD_InitialAtion':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_initialaction'])
        }else{columnNames = (['staffincidents.incd_initialaction'])}
              break;
        case 'INCD_InitialNotes':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_initialnotes'])
        }else{columnNames = (['staffincidents.incd_initialnotes'])}
              break;                                                                                                                                            
        case 'INCD_InitialFupBy':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_initialfupby'])
        }else{columnNames = (['staffincidents.incd_initialfupby'])}
              break;
        case 'INCD_Completed':
          var Stf_incd_completed = " CASE WHEN staffincidents.incd_completed = 1 THEN 'YES' ELSE 'NO' END  "
          if(columnNames != []){
        columnNames = columnNames.concat([Stf_incd_completed+'AS incd_completed'])
        }else{columnNames = ([Stf_incd_completed+'AS incd_completed'])}
              break;
        case 'INCD_OngoingAction':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_ongoingaction'])
        }else{columnNames = (['staffincidents.incd_ongoingaction'])}
              break;
        case 'INCD_OngoingNotes':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_ongoingnotes'])
        }else{columnNames = (['staffincidents.incd_ongoingnotes'])}
              break;
        case 'INCD_Background':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_background'])
        }else{columnNames = (['staffincidents.incd_background'])}
              break;                                                                                                  
                           
        case 'INCD_Abuse':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_abuse'])
        }else{columnNames = (['staffincidents.incd_abuse'])}
              break;
        case 'INCD_DOPwithDisability':
          var Stf_Incd_dopwithdisability = " CASE WHEN staffincidents.incd_dopwithdisability = 1 THEN 'YES' ELSE 'NO'END AS incd_dopwithdisability "
          if(columnNames != []){
        columnNames = columnNames.concat([Stf_Incd_dopwithdisability+'AS incd_dopwithdisability'])
        }else{columnNames = ([Stf_Incd_dopwithdisability+'AS incd_dopwithdisability'])}
              break;              
        case 'INCD_SerousRisks':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_seriousrisks'])
        }else{columnNames = (['staffincidents.incd_seriousrisks'])}
              break;
        case 'INCD_Complaints':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_complaints'])
        }else{columnNames = (['staffincidents.incd_complaints'])}
              break;
        case 'INCD_Perpetrator':
          if(columnNames != []){
        columnNames = columnNames.concat(['staffincidents.incd_perpetrator'])
        }else{columnNames = (['staffincidents.incd_perpetrator'])}
              break;
              case 'INCD_Notify':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_notify'])
              }else{columnNames = (['staffincidents.incd_notify'])}
                    break;
              case 'INCD_NoNotifyReason':
                      if(columnNames != []){
                    columnNames = columnNames.concat(['staffincidents.incd_nonotifyreason'])
                    }else{columnNames = (['staffincidents.incd_nonotifyreason'])}
                    break;                                                             
              case 'INCD_Notes':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_notes'])
              }else{columnNames = (['staffincidents.incd_notes'])}
                    break;
              case 'INCD_Setting':
                if(columnNames != []){
              columnNames = columnNames.concat(['staffincidents.incd_setting'])
              }else{columnNames = (['staffincidents.incd_setting'])}
                    break;
//OPNOTES                    
              case 'General Notes':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.[stf_notes]) AS [General Notes]'])
              }else{columnNames = (['staff.[stf_notes]) AS [General Notes]'])}
                    break;
//HR Notes                                                                                                                                
              case 'HR Notes Date':
                if(columnNames != []){
              columnNames = columnNames.concat(['HRHistory.[detaildate] AS [HR Notes Date]'])
              }else{columnNames = (['HRHistory.[detaildate] AS [HR Notes Date]'])}
                    break;
              case 'HR Notes Detail':
                if(columnNames != []){
              columnNames = columnNames.concat(['dbo.Rtf2text(HRHistory.[detail]) AS [HR Notes Detail]'])
              }else{columnNames = (['dbo.Rtf2text(HRHistory.[detail]) AS [HR Notes Detail]'])}
                    break;
              case 'HR Notes Creator':
                if(columnNames != []){
              columnNames = columnNames.concat(['HRHistory.[creator] AS [HR Notes Creator]'])
              }else{columnNames = (['HRHistory.[creator] AS [HR Notes Creator]'])}
                    break;
              case 'HR Notes Alarm':
                if(columnNames != []){
              columnNames = columnNames.concat(['HRHistory.[alarmdate] AS [HR Notes Alarm]'])
              }else{columnNames = (['HRHistory.[alarmdate] AS [HR Notes Alarm]'])}
                    break;
              case 'HR Notes Categories':
                if(columnNames != []){
              columnNames = columnNames.concat(['HRHistory.[extradetail2] AS [HR Notes Categories]'])
              }else{columnNames = (['HRHistory.[extradetail2] AS [HR Notes Categories]'])}
                    break;
//Skills and qualifications                 
              case 'CERT III AC':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb15 AS [CERT III AC]'])
              }else{columnNames = (['staff.sb15 AS [CERT III AC]'])}
                    break;
              case 'CERT III DS':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb16 AS [CERT III DS]'])
              }else{columnNames = (['staff.sb16 AS [CERT III DS]'])}
                    break;
              case 'Dementia':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb4  AS [Dementia]'])
              }else{columnNames = (['staff.sb4  AS [Dementia]'])}
                    break;              
              case 'Disabilities':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb5  AS [Disabilities]'])
              }else{columnNames = (['staff.sb5  AS [Disabilities]'])}
                    break;
              case 'Host':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb19 AS [Host]'])
              }else{columnNames = (['staff.sb19 AS [Host]'])}
                    break;
              case 'Spinal':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb20 AS [Spinal]'])
              }else{columnNames = (['staff.sb20 AS [Spinal]'])}
                    break;
              case 'Mental Health':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb21 AS [Mental Health]'])
              }else{columnNames = (['staff.sb21 AS [Mental Health]'])}
                    break;
              case 'Palliative':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb22 AS [Palliative]'])
              }else{columnNames = (['staff.sb22 AS [Palliative]'])}
                    break;
              case 'Other':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb14 AS [Other]'])
              }else{columnNames = (['staff.sb14 AS [Other]'])}
                    break;                                                                                                                                                                              
              case 'Domestic':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb24 AS [Domestic]'])
              }else{columnNames = (['staff.sb24 AS [Domestic]'])}
                    break;
              case 'Registered Nurse':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb25 AS [Registered Nurse]'])
              }else{columnNames = (['staff.sb25 AS [Registered Nurse]'])}
                    break;
              case 'PCP/PCA':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb26 AS [PCP/PCA]'])
              }else{columnNames = (['staff.sb26 AS [PCP/PCA]'])}
                    break;
              case 'Enrolled Nurse':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb27 AS [Enrolled Nurse]'])
              }else{columnNames = (['staff.sb27 AS [Enrolled Nurse]'])}
                    break;
              case 'CACL1':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb28 AS [CACL1]'])
              }else{columnNames = (['staff.sb28 AS [CACL1]'])}
                    break;
              case 'CACL2':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb29 AS [CACL2]'])
              }else{columnNames = (['staff.sb29 AS [CACL2]'])}
                    break;              
              case 'Other1':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb30 AS [Other1]'])
              }else{columnNames = (['staff.sb30 AS [Other1]'])}
                    break;
              case 'Other2':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb31 AS [Other2]'])
              }else{columnNames = (['staff.sb31 AS [Other2]'])}
                    break;                                                                                                                       
              case 'Other3':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb32 AS [Other3]'])
              }else{columnNames = (['staff.sb32 AS [Other3]'])}
                    break;
              case 'Other4':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb33 AS [Other4]'])
              }else{columnNames = (['staff.sb33 AS [Other4]'])}
                    break;
              case 'Other5':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb34 AS [Other5]'])
              }else{columnNames = (['staff.sb34 AS [Other5]'])}
                    break;                                                                                                                        
              case 'Other6':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb35 AS [Other6]'])
              }else{columnNames = (['staff.sb35 AS [Other6]'])}
                    break;
              case 'Assertiveness':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb1  AS [Assertiveness]'])
              }else{columnNames = (['staff.sb1  AS [Assertiveness]'])}
                    break;
              case 'BackCare':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb2  AS [BackCare]'])
              }else{columnNames = (['staff.sb2  AS [BackCare]'])}
                    break;                        
            case 'Confidentiality':
              if(columnNames != []){
            columnNames = columnNames.concat(['staff.sb3  AS [Confidentiality]'])
            }else{columnNames = (['staff.sb3  AS [Confidentiality]'])}
                  break;
            case 'Dementia':
              if(columnNames != []){
            columnNames = columnNames.concat(['staff.sb4  AS [Dementia]'])
            }else{columnNames = (['staff.sb4  AS [Dementia]'])}
                  break;                  
            case 'Disabilities':
              if(columnNames != []){
            columnNames = columnNames.concat(['staff.sb5  AS [Disabilities]'])
            }else{columnNames = (['staff.sb5  AS [Disabilities]'])}
                  break;
            case 'DisabilitiesCert':
              if(columnNames != []){
            columnNames = columnNames.concat(['staff.sb6  AS [DisabilitiesCert]'])
            }else{columnNames = (['staff.sb6  AS [DisabilitiesCert]'])}
                  break;                                                                                                                                                
            case 'DutyOfCare':
              if(columnNames != []){
            columnNames = columnNames.concat(['staff.sb7  AS [DutyOfCare]'])
            }else{columnNames = (['staff.sb7  AS [DutyOfCare]'])}
                  break;
            case 'FirstAid':
              if(columnNames != []){
            columnNames = columnNames.concat(['staff.sb8  AS [FirstAid]'])
            }else{columnNames = (['staff.sb8  AS [FirstAid]'])}
                  break;
            case 'Grief':
              if(columnNames != []){
            columnNames = columnNames.concat(['staff.sb9  AS [Grief]'])
            }else{columnNames = (['staff.sb9  AS [Grief]'])}
                  break;
              case 'HIST':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb10 AS [HIST]'])
              }else{columnNames = (['staff.sb10 AS [HIST]'])}
                    break;
              case 'OH&S':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb11 AS [OH&S]'])
              }else{columnNames = (['staff.sb11 AS [OH&S]'])}
                    break;
              case 'PersonalCare':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb12 AS [PersonalCare]'])
              }else{columnNames = (['staff.sb12 AS [PersonalCare]'])}
                    break;
              case 'PCareCertificate':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb13 AS [PCareCertificate]'])
              }else{columnNames = (['staff.sb13 AS [PCareCertificate]'])}
                    break;              
              case 'Other':
                if(columnNames != []){
              columnNames = columnNames.concat(['staff.sb14 AS [Other]'])
              }else{columnNames = (['staff.sb14 AS [Other]'])}
                    break;
                  
                          
                  }
  }

}else{
  for (var key of fld){
    switch (key) {
      //NAME AND ADDRESS
      case 'First Name':
                  if(columnNames != []){          
          columnNames = columnNames.concat(['R.FirstName as [First Name]'])
        }else{          
          columnNames = (['R.FirstName as [First Name]'])}

        break;
      case 'Title':
                  if(columnNames != []){          
          columnNames = columnNames.concat(['R.title as Title'])
        }else{
          columnNames = (['R.title as Title'])
        }        
          break;
      case 'Surname/Organisation':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.[Surname/Organisation] as [Surname/Organisation] '])
        }else{columnNames = (['R.[Surname/Organisation] as  [Surname/Organisation]'])}        
          break;
      case 'Preferred Name':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.PreferredName as [Preferred Name] '])
        }else{columnNames = (['R.PreferredName as [Preferred Name] '])}        
          break;                  
      case 'Other':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.title as Other '])
        }else{columnNames = (['R.title as Other '])}        
          break;
      case 'Address-Line1':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.Address1 as [Address-Line1] '])
        }else{columnNames = (['R.Address1 as  [Address-Line1]'])}        
          break;
      case 'Address-Line2':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.Address2 as [Address-Line2] '])
        }else{columnNames = (['R.Address2 as  [Address-Line2]'])}        
          break;
      case 'Address-Suburb':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.Suburb as  [Address-Suburb]'])
        }else{columnNames = (['R.Suburb as  [Address-Suburb]'])}        
          break;
      case 'Address-Postcode':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.Postcode as  [Address-Postcode]'])
        }else{columnNames = (['R.Postcode as [Address-Postcode] '])}        
          break;
      case 'Address-State':
                  if(columnNames != []){
          columnNames = columnNames.concat(['R.State as  [Address-State]'])
        }else{columnNames = (['R.State as  [Address-State]'])}        
          break;
//General Demographics          
      case 'Full Name-Surname First':
                  if(columnNames != []){
          columnNames = columnNames.concat(['(R.[Surname/Organisation]' + ' + ' +'R.FirstName) as  [Full Name]'])
        }else{columnNames = (['(R.[Surname/Organisation]' + ' + ' +'R.FirstName) as  [Full Name]'])}        
          break;
      case 'Full Name-Mailing':
                  if(columnNames != []){
              columnNames = columnNames.concat(['(R.[Surname/Organisation]' + ' + ' +'R.FirstName) as  [Full Name-Mailing]'])
            }else{columnNames = (['(R.[Surname/Organisation]' + ' + ' +'R.FirstName) as  [Full Name-Mailing]'])}        
              break;
      case 'Gender':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.Gender as [Gender] '])
            }else{columnNames = (['R.Gender as [Gender] '])}        
              break;
      case 'Date Of Birth':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.DateOfBirth as [DOB] '])
            }else{columnNames = (['R.DateOfBirth as [DOB] '])}        
              break;
      case 'Age':
                  if(columnNames != []){
              columnNames = columnNames.concat([' DateDiff(YEAR,R.Dateofbirth,GetDate()) as [Age] '])
            }else{columnNames = ([' DateDiff(YEAR,R.Dateofbirth,GetDate()) as  [Age]'])}        
              break;
      case 'Ageband-Statistical':
        var AgebandStatic = " CASE " +
        "case WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN 0 AND 5 THEN ' 0- 5' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN 6 AND 13 THEN ' 6-13' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()   ) BETWEEN 14 AND 17 THEN '14-17' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()   ) BETWEEN 18 AND 45 THEN '18-45' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()   ) BETWEEN 46 AND 65 THEN '46-65' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()   ) BETWEEN 66 AND 70 THEN '66-70' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()   ) BETWEEN 71 AND 75 THEN '71-75' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()   ) BETWEEN 76 AND 80 THEN '76-80' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN 81 AND 90 THEN '81-90' "+
        "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()   ) > 90 THEN 'OVER 90' "+
        "ELSE 'UNKNOWN' END  "
        
                  if(columnNames != []){
              columnNames = columnNames.concat([AgebandStatic+' as  [Ageband-Statistical]'])
            }else{columnNames = ([AgebandStatic+' as  [Ageband-Statistical]'])}        
              break;
          case 'Ageband-5 Year':
            var Ageband5 =" CASE " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN 0 AND 5 THEN ' 0- 5' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  6 AND 10 THEN ' 6-10' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  11 AND 15 THEN '11-15' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  16 AND 20 THEN '16-20' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  21 AND 25 THEN '21-25' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  26 AND 30 THEN '26-30' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  36 AND 40 THEN '36-40' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  41 AND 45 THEN '41-45' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  46 AND 50 THEN '46-50' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  51 AND 55 THEN '51-55' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  56 AND 60 THEN '56-60' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  61 AND 65 THEN '61-65' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  66 AND 70 THEN '66-70' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  71 AND 75 THEN '71-75' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,  GETDATE() ) BETWEEN 76 AND 80 THEN '76-80' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  81 AND 85 THEN '81-85' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  86 AND 90 THEN '86-90' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  91 AND 95 THEN '91-95' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  96 AND 100 THEN '96-100' "+ 
            "WHEN DATEDIFF(YEAR, R.DateOfBirth, GETDATE()) > 100 THEN 'OVER 100' " +
            "ELSE 'UNKNOWN' END " 
            
                  if(columnNames != []){
              columnNames = columnNames.concat([Ageband5+' as [ Ageband-5 Year]'])
            }else{columnNames = ([Ageband5 +' as  [Ageband-5 Year]'])}        
              break;
          case 'Ageband-10 Year':
            var Ageban10 = "CASE "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  0 AND 10 THEN '0- 10' " +
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  11 AND 20 THEN '11-20' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE()  ) BETWEEN  21 AND 30 THEN '21-30' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,  GETDATE() ) BETWEEN 31 AND 40 THEN '31-40' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,  GETDATE() ) BETWEEN 41 AND 50 THEN '41-50' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth, GETDATE() ) BETWEEN 51 AND 60 THEN '51-60' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE() ) BETWEEN 61 AND 70 THEN '61-70' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE() ) BETWEEN 71 AND 80 THEN '71-80' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE() ) BETWEEN 81 AND 90 THEN '81-90' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE() ) BETWEEN 91 AND 100 THEN '91-100' "+
            "WHEN DATEDIFF(YEAR, R.DateOfBirth,   GETDATE() ) > 100 THEN 'OVER 100' "+
            "ELSE 'UNKNOWN' END  "
                  if(columnNames != []){
              columnNames = columnNames.concat([Ageban10+ ' as  [Ageband-10 Year]'])
            }else{columnNames = ([Ageban10+ ' as  [Ageband-10 Year]'])}        
              break;
              case 'Age-ATSI Status':
                var AgeATSI = " case WHEN DATEADD(YEAR,65, CONVERT(DATETIME,DateOfBirth)) <= GETDATE() OR (DATEADD(YEAR,50, CONVERT(DATETIME,DateOfBirth)) <= GETDATE() AND LEFT( CSTDA_INDIGINOUS, 3) IN ('ABO', 'TOR', 'BOT')) THEN 'OVER 64 OR ATSI OVER 49' ELSE 'UNDER 65 OR ATSI UNDER 50' END "
                  if(columnNames != []){
              columnNames = columnNames.concat([AgeATSI +'  as [Age-ATSI Status] '])
            }else{columnNames = ([AgeATSI + '  as [Age-ATSI Status] '])}        
              break;
        case 'Month Of Birth':
            var Month = "DateName(Month, DateOfBirth)  "
                  if(columnNames != []){
              columnNames = columnNames.concat([Month +' as [Month Of Birth] '])
            }else{columnNames = ([Month +' as [Month Of Birth] '])}        
              break;
        case 'Day Of Birth No.':
          var day = "DateName(Weekday, DateOfBirth)"
                  if(columnNames != []){
              columnNames = columnNames.concat([day +' as  [Day Of Birth]'])
            }else{columnNames = ([day +' as [Day Of Birth] '])}        
              break;
              case 'CALD Score': 
                var caldscore = " (SELECT distinct DD.CALDStatus FROM DataDomains DD WHERE DOMAIN = 'Countries' and DD.DESCRIPTION = R.CountryOfBirth) "
                  if(columnNames != []){
              columnNames = columnNames.concat([caldscore +'  as  [CALD Score]'])
            }else{columnNames = ([caldscore +'  as [CALD Score] '])}        
              break;             
              case 'Country Of Birth':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.CountryOfBirth as [Country Of Birth] '])
            }else{columnNames = (['R.CountryOfBirth as [Country Of Birth] '])}        
              break;
              case 'Language':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.HomeLanguage as  [Language]'])
            }else{columnNames = (['R.HomeLanguage as  [Language]'])}        
              break;
      case 'Indigenous Status':
        var IndStatus = "CASE "+
        "WHEN R.[IndiginousStatus] = 'Aboriginal but not Torres Strait Islander origin' THEN 'ATSI' " +
        "WHEN R.[IndiginousStatus] = 'Both Aboriginal and Torres Strait Islander origin' THEN 'ATSI'" +
        "WHEN R.[IndiginousStatus] = 'Torres Strait Islander but not Aboriginal origin' THEN 'ATSI' " +
        "ELSE 'NON ATSI' " +
        "END  "
                  if(columnNames != []){
              columnNames = columnNames.concat([IndStatus+' as  [Indigenous Status]'])
            }else{columnNames = ([IndStatus+' as [Indigenous Status]'])}        
              break;
              case 'Primary Disability':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.CSTDA_DisabilityGroup as  [Primary Disability]'])
            }else{columnNames = (['R.CSTDA_DisabilityGroup as  [Primary Disability]'])}        
              break;
      case 'Financially Dependent':
        var FinanceDepend = "CASE WHEN R.[FDP] = 1 THEN 'YES'   ELSE 'NO' END "
                  if(columnNames != []){
              columnNames = columnNames.concat([FinanceDepend+'  as  [Financially Dependent]'])
            }else{columnNames = ([FinanceDepend +'  as  [Financially Dependent]'])}        
              break;
              case 'Financial Status':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.FinancialClass as  [Financial Status]'])
            }else{columnNames = (['R.FinancialClass as [Financial Status] '])}        
              break;          
              case 'Occupation':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.Occupation as  [Occupation]'])
            }else{columnNames = (['R.Occupation as [Occupation] '])}        
              break;
              //Admin Info
              case 'UniqueID':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.UniqueID as  [UniqueID]'])
            }else{columnNames = (['R.UniqueID as [UniqueID] '])}        
              break;
              case 'Code':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.[AccountNo]  as  [Code]'])
            }else{columnNames = (['R.[AccountNo]  as  [Code]'])}        
              break;             
              case 'Type':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.[Type]  as [Type] '])
            }else{columnNames = (['R.[Type]  as [Type] '])}        
              break;             
              case 'Category':
                  if(columnNames != []){
              columnNames = columnNames.concat(['Category  as  [Category]'])
            }else{columnNames = (['Category  as  [Category]'])}        
              break;
              case 'CoOrdinator':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.RECIPIENT_CoOrdinator as [CoOrdinator] '])
            }else{columnNames = (['R.RECIPIENT_CoOrdinator as [CoOrdinator] '])}        
              break;
              case 'Admitting Branch':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.BRANCH as [Admitting Branch] '])
            }else{columnNames = (['R.BRANCH as [Admitting Branch] '])}        
              break;                
              case 'Secondary Branch':
              var SecondaryBranch =  "(Select top 1  HR.name from HumanResources HR  left join Recipients R on hr.PersonID = R.UniqueID where HR.[Type] = 'RECIPBRANCHES') "
                  if(columnNames != []){
              columnNames = columnNames.concat([ SecondaryBranch +  ' as [Secondary Branch] '])
            }else{columnNames = ([SecondaryBranch + ' as  [Secondary Branch]'])}        
              break;  
              case 'File number':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.[URNumber] as [File Number] '])
            }else{columnNames = (['R.[URNumber] as [File Number] '])}        
              break;
              case 'File Number 2':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.[URNumber] as [File Number 2] '])
            }else{columnNames = ([' R.[URNumber] as [File Number 2] '])}        
              break;
              case 'NDIA/MAC Number':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.NDISNumber as [NDIA/MAC Number] '])
            }else{columnNames = (['R.NDISNumber as [NDIA/MAC Number] '])}        
              break;     
              case 'Last Activated Date':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.ADMISSIONDATE  as [Last Activated Date] '])
            }else{columnNames = (['R.ADMISSIONDATE  as [Last Activated Date] '])}        
              break;
              case 'Created By':
                  if(columnNames != []){
              columnNames = columnNames.concat(['R.CreatedBy as  [Created By]'])
            }else{columnNames = (['R.CreatedBy as  [Created By]'])}        
              break;
              case 'Other':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  '])
            }else{columnNames = (['  '])}        
              break; 
              //Staff                
            case 'Staff Name':
                    if(columnNames != []){
                columnNames = columnNames.concat([' S.FIRSTNAME + S.LASTNAME AS [Staff Name] '])
              }else{columnNames = ([' S.FIRSTNAME + S.LASTNAME AS [Staff Name] '])}  
                  break;
            case 'Program Name':
                    if(columnNames != []){
                columnNames = columnNames.concat([' HRCaseStaff.[Address1] AS [Program Name] '])
              }else{columnNames = ([' HRCaseStaff.[Address1] AS [Program Name] '])} 
                  break;
            case 'Notes':
                    if(columnNames != []){
                columnNames = columnNames.concat(['HRCaseStaff.[Notes] AS [Notes] '])
              }else{columnNames = (['HRCaseStaff.[Notes] AS [Notes] '])}
                  break;
                  //Other Genral info
            case 'OH&S Profile':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.OHSProfile as  [OH&S Profile]'])
              }else{columnNames = (['R.OHSProfile as [OH&S Profile] '])}
                  break;
            case 'OLD WH&S Date':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.[WH&S]  as [OLD WH&S Date] '])
              }else{columnNames = (['R.[WH&S]  as [OLD WH&S Date] '])}  
                  break;   
              case 'Billing Profile':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.BillProfile as [Billing Profile] '])
                }else{columnNames = (['R.BillProfile as [Billing Profile] '])}  
                break;          
            case 'Sub Category':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.[UBDMap]  as [Sub Category] '])
              }else{columnNames = (['R.[UBDMap]  as  [Sub Category]'])} 
                  break;
            case 'Roster Alerts':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.[Notes]  as [Roster Alerts] '])
              }else{columnNames = (['R.[Notes]  as [Roster Alerts] '])} 
                  break;
            case 'Timesheet Alerts':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.[SpecialConsiderations]  as [Timesheet Alerts] '])
              }else{columnNames = (['R.[SpecialConsiderations]  as [Timesheet Alerts] '])} 
                  break;                 
            case 'Contact Issues':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.ContactIssues as [Contact Issues] '])
              }else{columnNames = (['R.ContactIssues as [Contact Issues] '])}
                  break;
            case 'Survey Consent Given':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.SurveyConsent as [Survey Consent Given] '])
              }else{columnNames = (['R.SurveyConsent as [Survey Consent Given] '])}
                  break;
            case 'Copy Rosters':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.Autocopy as [Copy Rosters] '])
              }else{columnNames = (['R.Autocopy as [Copy Rosters] '])}
                  break;
            case 'Enabled':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  '])
              }else{columnNames = (['  '])} 
                  break;
            case 'Activation Date':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  '])
              }else{columnNames = (['  '])} 
                  break;
            case 'DeActivation Date':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  '])
              }else{columnNames = (['  '])}  
                  break;
            case 'Mobility':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.Mobility as [Mobility] '])
              }else{columnNames = (['R.Mobility as [Mobility] '])}
                  break;
            case 'Specific Competencies':
                    if(columnNames != []){
                columnNames = columnNames.concat(['R.SpecialConsiderations as  [Specific Competencies]'])
              }else{columnNames = (['R.SpecialConsiderations as [Specific Competencies] '])}
                  break;
            case 'Carer Info':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  '])
              }else{columnNames = (['  '])} 
                  break;
//  Contacts & Next of Kin
            case 'Contact Group':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Group]   '])
              }else{columnNames = (['HR.[Group]   '])}
                  break;
            case 'Contact Type':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Type]    '])
              }else{columnNames = (['HR.[Type]   '])} 
                  break;
            case 'Contact Sub Type':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[SubType]  '])
              }else{columnNames = (['HR.[SubType]  '])}  
                  break;
            case 'Contact User Flag':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[User1]  '])
              }else{columnNames = (['HR.[User1]  '])}
                  break;                 
            case 'Contact Person Type':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[EquipmentCode]  '])
              }else{columnNames = (['HR.[EquipmentCode]  '])} 
                  break;
            case 'Contact Name':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Name]  '])
              }else{columnNames = (['HR.[Name]  '])} 
                  break;
            case 'Contact Address':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Address1]  '])
              }else{columnNames = (['HR.[Address1]  '])} 
                  break;
            case 'Contact Suburb':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Suburb]  '])
              }else{columnNames = (['HR.[Suburb]  '])}
                  break;
            case 'Contact Postcode':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Postcode]  '])
              }else{columnNames = (['HR.[Postcode]  '])} 
                  break;
            case 'Contact Phone 1':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Phone1] '])
              }else{columnNames = (['HR.[Phone1] '])} 
                  break;
            case 'Contact Phone 2':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Phone2]  '])
              }else{columnNames = (['HR.[Phone2]  '])} 
                  break;
            case 'Contact Mobile': 
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Mobile]  '])
              }else{columnNames = (['HR.[Mobile]  '])}
                  break;
            case 'Contact FAX':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[FAX]  '])
              }else{columnNames = (['HR.[FAX]  '])}
                  break;
            case 'Contact Email':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['HR.[Email]  '])
              }else{columnNames = (['HR.[Email]  '])}
                  break;
//Carer Info                  
            case 'Carer First Name':
              
                    if(columnNames != []){ 
                columnNames = columnNames.concat(['C.FirstName  '])
              }else{columnNames = (['C.FirstName  '])} 
                    break;
              case 'Carer Last Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['C.[Surname/Organisation]  '])
                }else{columnNames = (['C.[Surname/Organisation]  '])}
                    break;
                    case 'Carer Age':
                      var CarerAge = " CASE WHEN DATEADD(YEAR,DATEDIFF(YEAR, C.DateOfBirth,Format(GETDATE(), 'yyyy-MM-dd') ),C.DateOfBirth) "+
                      ">  Format(GETDATE(), 'yyyy-MM-dd') THEN DATEDIFF(YEAR, C.DateOfBirth,Format(GETDATE(), 'yyyy-MM-dd')  )-1  "+
                      "ELSE DATEDIFF(YEAR, C.DateOfBirth,Format(GETDATE(), 'yyyy-MM-dd')  ) END "
                      if(columnNames != []){
                        columnNames = columnNames.concat([CarerAge+' '])
                      }else{columnNames = ([CarerAge+' '])}  
                    break;                 
              case 'Carer Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['C.[Gender]  '])
                }else{columnNames = (['C.[Gender]  '])}  
                    break;
              case 'Carer Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['C.[IndiginousStatus]  '])
                }else{columnNames = (['C.[IndiginousStatus]  '])} 
                    break;
                  
              case 'Carer Address':
                var CarerAddress= " ISNULL(N.Address1,'') + ' ' +  ISNULL(N.Suburb,'') + ' ' + ISNULL(N.Postcode,'') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([CarerAddress+ ' '])
                }else{columnNames = ([CarerAddress+' '])}  
                    break;
              case 'Carer Email': //    
                  if(columnNames != []){
                  columnNames = columnNames.concat(['PE.Detail  '])
                }else{columnNames = (['PE.Detail  '])}  
                    break;
              case 'Carer Phone <Home>': 
                  if(columnNames != []){
                  columnNames = columnNames.concat(['PhHome.Detail  '])
                }else{columnNames = (['PhHome.Detail  '])}  
                    break;
              case 'Carer Phone <Work>':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['PhWork.Detail  '])
                }else{columnNames = (['PhWork.Detail  '])} 
                    break;
              case 'Carer Phone <Mobile>':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['PhMobile.Detail  '])
                }else{columnNames = (['PhMobile.Detail  '])} 
                    break;
// Documents                    
              case 'DOC_ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.DOC_ID  '])
                }else{columnNames = (['doc.DOC_ID  '])} 
                    break;
              case 'Doc_Title':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Title  '])
                }else{columnNames = (['doc.Title  '])}  
                    break;
                  
              case 'Created':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Created  '])
                }else{columnNames = (['doc.Created  '])}  
                    break;                
              case 'Modified':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Modified  '])
                }else{columnNames = (['doc.Modified  '])} 
                    break;                    
              case 'Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Status  '])
                }else{columnNames = (['doc.Status  '])}
                    break;
              case 'Classification':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Classification  '])
                }else{columnNames = (['doc.Classification  '])}  
                    break;
              case 'Category':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Category  '])
                }else{columnNames = (['doc.Category  '])}  
                    break;
              case 'Filename':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Filename  '])
                }else{columnNames = (['doc.Filename  '])}  
                    break;
              case 'Doc#':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.Doc#  '])
                }else{columnNames = (['doc.Doc#  '])}  
                      break;
              case 'DocStartDate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.DocStartDate  '])
                }else{columnNames = (['doc.DocStartDate  '])}  
                      break;                  
              case 'DocEndDate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.DocEndDate  '])
                }else{columnNames = (['doc.DocEndDate  '])}  
                      break;
              case 'AlarmDate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.AlarmDate  '])
                }else{columnNames = (['doc.AlarmDate  '])}
                      break;                          
              case 'AlarmText':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['doc.AlarmText  '])
                }else{columnNames = (['doc.AlarmText  '])}  
                      break;
 //Consents                      
              case 'Consent':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Cons.[Name]  '])
                }else{columnNames = (['Cons.[Name]  '])}  
                      break;                     
              case 'Consent Start Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Cons.[Date1]  '])
                }else{columnNames = (['Cons.[Date1]  '])}  
                      break;
              case 'Consent Expiry':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Cons.[Date2]  '])
                }else{columnNames = (['Cons.[Date2]  '])}  
                      break;
              case 'Consent Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Cons.[Notes]  '])
                }else{columnNames = (['Cons.[Notes]  '])}  
                      break;
 //  GOALS OF CARE                      
              case 'Goal':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Goalcare.[User1]  '])
                }else{columnNames = (['Goalcare.[User1]  '])}
                      break;               
              case 'Goal Detail':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Goalcare.[Notes]  '])
                }else{columnNames = (['Goalcare.[Notes]  '])}  
                      break;
              case 'Goal Achieved':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Goalcare.[Completed]  '])
                }else{columnNames = (['Goalcare.[Completed]  '])}  
                      break;                      
              case 'Anticipated Achievement Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Goalcare.[Date1]  '])
                }else{columnNames = (['Goalcare.[Date1]  '])}  
                      break;
              case 'Date Achieved':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Goalcare.[DateInstalled]  '])
                }else{columnNames = (['Goalcare.[DateInstalled]  '])}
                      break;
              case 'Last Reviewed':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Goalcare.[Date2]  '])
                }else{columnNames = (['Goalcare.[Date2]  '])}  
                      break;              
              case 'Logged By':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Goalcare.[Creator]  '])
                }else{columnNames = (['Goalcare.[Creator]  '])}
                      break;
//REMINDERS                      
              case 'Reminder Detail':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Remind.[Name]  '])
                }else{columnNames = (['Remind.[Name]  '])}
                      break;
              case 'Event Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Remind.[Date2]  '])
                }else{columnNames = (['Remind.[Date2]  '])}  
                      break;
                      
              case 'Reminder Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Remind.[Date1]  '])
                }else{columnNames = (['Remind.[Date1]  '])}  
                      break;
              case 'Reminder Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Remind.[Notes]  '])
                }else{columnNames = (['Remind.[Notes]  '])}  
                      break;
// USER GROUPS                      
              case 'Group Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['UserGroup.[Name]  '])
                }else{columnNames = (['UserGroup.[Name]  '])}  
                      break;
              case 'Group Note':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['UserGroup.[Notes]  '])
                }else{columnNames = (['UserGroup.[Notes]  '])} 
                      break; 
              case 'Group Start Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['UserGroup.[Date1]  '])
                }else{columnNames = (['UserGroup.[Date1]  '])}  
                      break;                      
              case 'Group End Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['UserGroup.[Date2]  '])
                }else{columnNames = (['UserGroup.[Date2]  '])} 
                      break;
              case 'Group Email':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['UserGroup.[Email]  '])
                }else{columnNames = (['UserGroup.[Email]  '])} 
                      break;
                    
//Preferences                                      
              case 'Preference Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Prefr.[Name]  '])
                }else{columnNames = (['Prefr.[Name]  '])}  
                      break;                      
              case 'Preference Note':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['Prefr.[Notes]  '])
                }else{columnNames = (['Prefr.[Notes]  '])}  
                      break;
// FIXED REVIEW DATES                    
              case 'Review Date 1':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[OpReASsessmentDate]  '])
                }else{columnNames = (['R.[OpReASsessmentDate]  '])}  
                      break;
              case 'Review Date 2':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ClinicalReASsessmentDate]  '])
                }else{columnNames = (['R.[ClinicalReASsessmentDate]  '])}  
                      break;
              case 'Review Date 3':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[FileReviewDate]  '])
                }else{columnNames = (['R.[FileReviewDate]  '])} 
                      break;   
//Staffing Inclusions/Exclusions                                 
              case 'Excluded Staff':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ExcludeS.[Name]  '])
                }else{columnNames = (['ExcludeS.[Name]  '])}  
                      break;                
              case 'Excluded_Staff Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ExcludeS.[Notes]  '])
                }else{columnNames = (['ExcludeS.[Notes]  '])}  
                      break;
              case 'Included Staff':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['IncludS.[Name]  '])
                }else{columnNames = (['IncludS.[Name]  '])} 
                      break;
              case 'Included_Staff Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['IncludS.[Notes]  '])
                }else{columnNames = (['IncludS.[Notes]  '])} 
                      break;                      
// AGREED FUNDING INFORMATION                            
              case 'Funding Source':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['HumanResourceTypes.[Type]  '])
                }else{columnNames = (['HumanResourceTypes.[Type]  '])}  
                      break;
              case 'Funded Program':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['RecipientPrograms.[Program]  '])
                }else{columnNames = (['RecipientPrograms.[Program]  '])}  
                      break;
              case 'Funded Program Agency ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  '])
                }else{columnNames = (['  '])}  
                      break;
              case 'Program Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['RecipientPrograms.[ProgramStatus]  '])
                }else{columnNames = (['RecipientPrograms.[ProgramStatus]  '])}  
                      break;
              case 'Program Coordinator':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['HumanResourceTypes.[Address2]  '])
                }else{columnNames = (['HumanResourceTypes.[Address2]  '])}  
                      break;
              case 'Funding Start Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  '])
                }else{columnNames = (['  '])} 
                      break;
              case 'Funding End Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['RecipientPrograms.[ExpiryDate]  '])
                }else{columnNames = (['RecipientPrograms.[ExpiryDate]  '])} 
                      break;
                     
              case 'AutoRenew':
                var Autorenew = " CASE WHEN RecipientPrograms.[AutoRenew] = 1 THEN 'YES' ELSE 'NO' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Autorenew +'  '])
                }else{columnNames = ([Autorenew +'  '])}  
                      break;
              case 'Rollover Remainder':
                var RolloverReminder = " CASE WHEN RecipientPrograms.[RolloverRemainder] = 1 THEN 'YES' ELSE 'NO' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([RolloverReminder +' '])
                }else{columnNames = ([RolloverReminder +' '])}  
                      break;
              case 'Funded Qty':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['RecipientPrograms.[Quantity]  '])
                }else{columnNames = (['RecipientPrograms.[Quantity]  '])}
                      break;
              case 'Funded Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['RecipientPrograms.[ItemUnit]  '])
                }else{columnNames = (['RecipientPrograms.[ItemUnit]  '])} 
                      break;
              case 'Funding Cycle':
                var FundingCycle = "CASE WHEN RecipientPrograms.[PerUnit] <> '' THEN RecipientPrograms.[PerUnit] + ' ' ELSE '' END + "  +
                " CASE WHEN RecipientPrograms.[TimeUnit] <> '' THEN RecipientPrograms.[TimeUnit] + ' ' ELSE '' END + "  +
                " CASE WHEN RecipientPrograms.[Period] <> '' THEN RecipientPrograms.[Period] ELSE '' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([FundingCycle+'  '])
                }else{columnNames = ([FundingCycle+'  '])}
                      break;
              case 'Funded Total Allocation':
                var Allocation = " CASE WHEN RecipientPrograms.[TotalAllocation] <> '' THEN RecipientPrograms.[TotalAllocation] ELSE 0 END  "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Allocation +'  '])
                }else{columnNames = ([Allocation +'  '])}
                      break;
              case 'Used':
                var used = " CASE WHEN RecipientPrograms.[Used] <> '' THEN RecipientPrograms.[Used] ELSE 0 END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([used +'  '])
                }else{columnNames = ([used +'  '])} 
                      break;
              case 'Remaining':
                var remaining = " CASE WHEN RecipientPrograms.[TotalAllocation] <> '' AND RecipientPrograms.[Used] <> '' THEN (RecipientPrograms.[TotalAllocation] - RecipientPrograms.[Used]) ELSE 0 END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([remaining + '  '])
                }else{columnNames = ([remaining +'  '])}  
                      break;
//LEGACY CARE PLAN                      
              case 'Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['CarePlanItem.[PlanName]  '])
                }else{columnNames = (['CarePlanItem.[PlanName]  '])}  
                      break;                                    
              case 'Start Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['CarePlanItem.[PlanStartDate]  '])
                }else{columnNames = (['CarePlanItem.[PlanStartDate]  '])}
                      break;
              case 'End Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['CarePlanItem.[PlanEndDate]  '])
                }else{columnNames = (['CarePlanItem.[PlanEndDate]  '])}
                      break;                      
              case 'Details':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['CarePlanItem.[PlanDetail]  '])
                }else{columnNames = (['CarePlanItem.[PlanDetail]  '])}
                      break;
              case 'Reminder Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['CarePlanItem.[PlanReminderDate]  '])
                }else{columnNames = (['CarePlanItem.[PlanReminderDate]  '])}  
                      break;
              case 'Reminder Text':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['CarePlanItem.[PlanReminderText]  '])
                }else{columnNames = (['CarePlanItem.[PlanReminderText]  '])}  
                      break;  
//Agreed Service Information                                    
              case 'Agreed Service Code':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[Service Type]  '])
                }else{columnNames = (['ServiceOverview.[Service Type]  '])}  
                      break;
              case 'Agreed Program':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[ServiceProgram]  '])
                }else{columnNames = (['ServiceOverview.[ServiceProgram]  '])}  
                      break;
              case 'Agreed Service Billing Rate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[Unit Bill Rate]  '])
                }else{columnNames = (['ServiceOverview.[Unit Bill Rate]  '])}  
                      break;                       
              case 'Agreed Service Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[ServiceStatus]  '])
                }else{columnNames = (['ServiceOverview.[ServiceStatus]  '])} 
                      break;
              case 'Agreed Service Duration':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[Duration]  '])
                }else{columnNames = (['ServiceOverview.[Duration]  '])}
                      break;
              case 'Agreed Service Frequency':
                var Frequency = " CONVERT(VARCHAR, ServiceOverview.[Frequency]) + ' ' + ServiceOverview.[Period] "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Frequency+'  '])
                }else{columnNames = ([Frequency+'  '])} 
                      break;
              case 'Agreed Service Cost Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[Cost Type]  '])
                }else{columnNames = (['ServiceOverview.[Cost Type]  '])} 
                      break;
              case 'Agreed Service Unit Cost':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[Unit Pay Rate]  '])
                }else{columnNames = (['ServiceOverview.[Unit Pay Rate]  '])}  
                      break;
              case 'Agreed Service Billing Unit':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[UnitType]  '])
                }else{columnNames = (['ServiceOverview.[UnitType]  '])}  
                      break;
              case 'Agreed Service Debtor':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ServiceOverview.[ServiceBiller]  '])
                }else{columnNames = (['ServiceOverview.[ServiceBiller]  '])}  
                      break;
 //  CLINICAL INFORMATION                       
              case 'Nursing Diagnosis':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['NDiagnosis.[Description]  '])
                }else{columnNames = (['NDiagnosis.[Description]  '])}  
                      break;
              case 'Medical Diagnosis':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['MDiagnosis.[Description]  '])
                }else{columnNames = (['MDiagnosis.[Description]  '])} 
                      break;
              case 'Medical Procedure':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['MProcedures.[Description]  '])
                }else{columnNames = (['MProcedures.[Description]  '])}  
                      break;
 //PANZTEL Timezone 
              case 'PANZTEL Timezone':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPIENT_TIMEZONE]  '])
                }else{columnNames = (['R.[RECIPIENT_TIMEZONE]  '])}  
                      break;                     
              case 'PANZTEL PBX Site':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPIENT_PBX]  '])
                }else{columnNames = (['R.[RECIPIENT_PBX]  '])}  
                      break;
              case 'PANZTEL Parent Site':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPIENT_PARENT_SITE]  '])
                }else{columnNames = (['R.[RECIPIENT_PARENT_SITE]  '])} 
                      break;
              case 'DAELIBS Logger ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DAELIBSID]  '])
                }else{columnNames = (['R.[DAELIBSID]  '])} 
                      break;
//INSURANCE AND PENSION                      
              case 'Medicare Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[MedicareNumber]  '])
                }else{columnNames = (['R.[MedicareNumber]  '])}  
                      break;
              case 'Medicare Recipient ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[MedicareRecipientID]  '])
                }else{columnNames = (['R.[MedicareRecipientID]  '])}  
                      break;
              case 'Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[PensionStatus]  '])
                }else{columnNames = (['R.[PensionStatus]  '])}  
                      break;
              case 'Unable to Determine Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[PensionVoracity]  '])
                }else{columnNames = (['R.[PensionVoracity]  '])}
                      break;
              case 'Concession Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ConcessionNumber]  '])
                }else{columnNames = (['R.[ConcessionNumber]  '])}  
                      break;
              case 'DVA Benefits Flag':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DVABenefits]  '])
                }else{columnNames = (['R.[DVABenefits]  '])}  
                      break;
              case 'DVA Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DVANumber]  '])
                }else{columnNames = (['R.[DVANumber]  '])}  
                      break;
              case 'DVA Card Holder Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_DVA_Card_Holder_Status]  '])
                }else{columnNames = (['R.[RECIPT_DVA_Card_Holder_Status]  '])} 
                      break;
              case 'Ambulance Subscriber':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Ambulance]  '])
                }else{columnNames = (['R.[Ambulance]  '])}
                      break;
              case 'Ambulance Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[AmbulanceType]  '])
                }else{columnNames = (['R.[AmbulanceType]  '])}  
                      break;
              case 'Pension Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['RecipientPensions.[Pension Name]  '])
                }else{columnNames = (['RecipientPensions.[Pension Name]  '])} 
                      break;
              case 'Pension Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['RecipientPensions.[Pension Number]  '])
                }else{columnNames = (['RecipientPensions.[Pension Number]  '])}
                      break;
              case 'Will Available':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[WillAvailable]  '])
                }else{columnNames = (['R.[WillAvailable]  '])}
                      break;         
              case 'Will Location':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[WhereWillHeld]  '])
                }else{columnNames = (['R.[WhereWillHeld]  '])}
                      break;
              case 'Funeral Arrangements':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[FuneralArrangements]  '])
                }else{columnNames = (['R.[FuneralArrangements]  '])}
                      break;
              case 'Date Of Death':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DateOfDeath]  '])
                }else{columnNames = (['R.[DateOfDeath]  '])} 
                      break;
//HACCS DATSET FIELDS                      
              case 'HACC-SLK':
                  if(columnNames != []){
                    var HACCSLACK = " UPPER(Substring(R.[Surname/Organisation], 2, 1) +  Substring(R.[Surname/Organisation], 3, 1) +   Substring(R.[Surname/Organisation], 5, 1) +   Substring(R.[FirstName], 2, 1) +   Substring(R.[FirstName], 3, 1) +   Replace(Convert(Varchar,DateOfBirth,103),'/','') +    Case When R.[Gender] = 'Male' Then '1'  When R.[Gender] = 'Female' Then '2' Else '9' End) "
                  columnNames = columnNames.concat([HACCSLACK +'  '])
                }else{columnNames = ([HACCSLACK +' '])} 
                      break;
              case 'HACC-First Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[FirstName]  '])
                }else{columnNames = (['R.[FirstName]  '])} 
                      break;
              case 'HACC-Surname':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Surname/Organisation]  '])
                }else{columnNames = (['R.[Surname/Organisation]  '])} 
                      break;
              case 'HACC-Referral Source':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ReferralSource]  '])
                }else{columnNames = (['R.[ReferralSource]  '])} 
                      break;
              case 'HACC-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DateOfBirth]  '])
                }else{columnNames = (['R.[DateOfBirth]  '])} 
                      break;
/**
 * RHACC.[HACC-SLK] as [HACC-SLK]
R.[FirstName] as [HACC-First Name]
R.[Surname/Organisation] as [HACC-Surname]
R.[ExcludeFromStats] as [HACC-Exclude From Collection]
R.[DateOfBirth] as [HACC-Date Of Birth]
R.[ONIFProfile1] as [HACC-Housework]
R.[ONIFProfile2] as [HACC-Transport]
R.[ONIFProfile3] as [HACC-Shopping]
R.[ONIFProfile4] as [HACC-Medication]
R.[ONIFProfile5] as [HACC-Money]
R.[ONIFProfile6] as [HACC-Walking]
R.[ONIFProfile7] as [HACC-Bathing]
R.[ONIFProfile8] as [HACC-Memory],
R.[ONIFProfile9] as [HACC-Behaviour]
ONI.[FPA_Communication] as [HACC-Communication],
ONI.[FPA_Dressing] as [HACC-Dressing]
ONI.[FPA_Eating] as [HACC-Eating]
ONI.[FPA_Toileting] as [HACC-Toileting]
ONI.[FPA_GetUp] as [HACC-GetUp]
R.[CARER_MORE_THAN_ONE] as [HACC-Carer More Than One]
R.[ReferralSource] as [HACC-Referral Source]
(CASE R.[CSTDA_BDEstimate]  WHEN 1 THEN 'True' else 'False' END) as [HACC-Date Of Birth Estimated]
R.[Gender] as [HACC-Gender]
R.[Suburb] as [HACC-Area Of Residence]
R.[CountryOfBirth] as [HACC-Country Of Birth]
R.[HomeLanguage] as [HACC-Preferred Language]
R.[IndiginousStatus] as [HACC-Indigenous Status]
R.[LivingArrangements] as [HACC-Living Arrangements]
R.[DwellingAccomodation] as [HACC-Dwelling/Accomodation]
DATADOMAINS.[DESCRIPTION] as [HACC-Main Reasons For Cessation]
R.[PensionStatus] as [HACC-Pension Status]
R.[DatasetCarer] as [HACC-Primary Carer]
R.[CarerAvailability] as [HACC-Carer Availability]
R.[CarerResidency] as [HACC-Carer Residency]
R.[CarerRelationship] as [HACC-Carer Relationship]
 *  */                      
              case 'HACC-Date Of Birth Estimated':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  '])
                }else{columnNames = (['  '])} 
                      break;                
              case 'HACC-Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Gender]  '])
                }else{columnNames = (['R.[Gender]  '])}  
                      break;
              case 'HACC-Area Of Residence':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Suburb]  '])
                }else{columnNames = (['R.[Suburb]  '])} 
                      break;
              case 'HACC-Country Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CountryOfBirth]  '])
                }else{columnNames = (['R.[CountryOfBirth]  '])}  
                      break;
              case 'HACC-Preferred Language,':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[HomeLanguage]  '])
                }else{columnNames = (['R.[HomeLanguage]  '])}  
                      break;
              case 'HACC-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[IndiginousStatus]  '])
                }else{columnNames = (['R.[IndiginousStatus]  '])}  
                      break;
              case 'HACC-Living Arrangements':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[LivingArrangements]  '])
                }else{columnNames = (['R.[LivingArrangements]  '])} 
                      break;
              case 'HACC-Dwelling/Accomodation':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DwellingAccomodation]  '])
                }else{columnNames = (['R.[DwellingAccomodation]  '])}  
                      break;
              case 'HACC-Main Reasons For Cessation':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DATADOMAINS.[DESCRIPTION]  '])
                }else{columnNames = (['DATADOMAINS.[DESCRIPTION]  '])} 
                      break;
              case 'HACC-Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[PensionStatus]  '])
                }else{columnNames = (['R.[PensionStatus]  '])}  
                      break;              
              case 'HACC-Primary Carer':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DatasetCarer]  '])
                }else{columnNames = (['R.[DatasetCarer]  '])}  
                      break;
              case 'HACC-Carer Availability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CarerAvailability]  '])
                }else{columnNames = (['R.[CarerAvailability]  '])}  
                      break;
              case 'HACC-Carer Residency':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CarerResidency]  '])
                }else{columnNames = (['R.[CarerResidency]  '])} 
                      break;
              case 'HACC-Carer Relationship':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CarerRelationship]  '])
                }else{columnNames = (['R.[CarerRelationship]  '])}
                      break;
              case 'HACC-Exclude From Collection':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ExcludeFromStats]  '])
                }else{columnNames = (['R.[ExcludeFromStats]  '])}  
                      break;                                
              case 'HACC-Housework':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile1]  '])
                }else{columnNames = (['R.[ONIFProfile1]  '])}
                      break;
              case 'HACC-Transport':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile2]  '])
                }else{columnNames = (['R.[ONIFProfile2]  '])} 
                      break;
              case 'HACC-Shopping':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile3]  '])
                }else{columnNames = (['R.[ONIFProfile3]  '])}  
                      break;
              case 'HACC-Medication':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile4]  '])
                }else{columnNames = (['R.[ONIFProfile4]  '])} 
                      break;
              case 'HACC-Money':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile5]  '])
                }else{columnNames = (['R.[ONIFProfile5]  '])} 
                      break;
              case 'HACC-Walking':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile6]  '])
                }else{columnNames = (['R.[ONIFProfile6]  '])}  
                      break;
              case 'HACC-Bathing':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile7]  '])
                }else{columnNames = (['R.[ONIFProfile7]  '])}  
                      break;
              case 'HACC-Memory':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile8]  '])
                }else{columnNames = (['R.[ONIFProfile8]  '])}  
                      break;
              case 'HACC-Behaviour':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[ONIFProfile9]  '])
                }else{columnNames = (['R.[ONIFProfile9]  '])}
                      break;
              case 'HACC-Communication':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.[FPA_Communication]  '])
                }else{columnNames = (['ONI.[FPA_Communication]  '])} 
                      break;
              case 'HACC-Eating':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.[FPA_Eating]  '])
                }else{columnNames = (['ONI.[FPA_Eating]  '])} 
                      break;
              case 'HACC-Toileting':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.[FPA_Toileting]  '])
                }else{columnNames = (['ONI.[FPA_Toileting]  '])} 
                      break;
              case 'HACC-GetUp': 
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.[FPA_GetUp]  '])
                }else{columnNames = (['ONI.[FPA_GetUp]  '])} 
                      break;        
              case 'HACC-Carer More Than One':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CARER_MORE_THAN_ONE]  '])
                }else{columnNames = (['R.[CARER_MORE_THAN_ONE]  '])}  
                      break;
//"DEX"                      
              case 'DEX-Exclude From MDS':
                var dexexcludemds = " CASE WHEN ISNULL(R.ExcludeFromStats, 0) = 0 THEN 'NO' ELSE 'YES' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([dexexcludemds+ '  '])
                }else{columnNames = ([dexexcludemds+'  '])}  
                      break;
              case 'DEX-Referral Purpose':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.ReferralPurpose  '])
                }else{columnNames = (['DSS.ReferralPurpose  '])}
                      break;
              case 'DEX-Referral Source':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.[DEXREFERRALSOURCE]  '])
                }else{columnNames = (['DSS.[DEXREFERRALSOURCE]  '])} 
                      break;
              case 'DEX-Referral Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.ReferralType  '])
                }else{columnNames = (['DSS.ReferralType  '])}  
                      break;
              case 'DEX-Reason For Assistance':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.AssistanceReason  '])
                }else{columnNames = (['DSS.AssistanceReason  '])} 
                      break;
              case 'DEX-Consent To Provide Information':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.[DEX-Consent To Provide Information]  '])
                }else{columnNames = (['DSS.[DEX-Consent To Provide Information]  '])}  
                      break;
              case 'DEX-Consent For Future Contact':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.[DEX-Consent For Future Contact]  '])
                }else{columnNames = (['DSS.[DEX-Consent For Future Contact]  '])}  
                      break;             
              case 'DEX-Sex':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.Gender  '])
                }else{columnNames = (['R.Gender  '])} 
                      break;                      
              case 'DEX-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.DateOfBirth  '])
                }else{columnNames = (['R.DateOfBirth  '])}  
                      break;
              case 'DEX-Estimated Birth Date':
                var BDEstimate = " CASE WHEN ISNULL(R.CSTDA_BDEstimate, '') = 0 THEN 'NO' ELSE 'YES' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([BDEstimate+'  '])
                }else{columnNames = ([BDEstimate+'  '])}  
                      break;
              case 'DEX-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.DexIndiginousStatus  '])
                }else{columnNames = (['DSS.DexIndiginousStatus  '])}  
                      break;
              case 'DEX-DVA Card Holder Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.HACCDVACardHolderStatus  '])
                }else{columnNames = (['ONI.HACCDVACardHolderStatus  '])}
                      break;        
              case 'DEX-Has Disabilities':
                var Dexhasdisability = " CASE WHEN ISNULL(DSS.HasDisabilities, 0) = 0 THEN 'NO' ELSE 'YES' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Dexhasdisability+'  '])
                }else{columnNames = ([Dexhasdisability+ '  '])}  
                      break;
              case 'DEX-Has A Carer':
                var DEXcarer = " CASE WHEN ISNULL(DSS.HasCarer, 0) = 0 THEN 'NO' ELSE 'YES' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DEXcarer  '])
                }else{columnNames = (['DEXcarer  '])}
                      break;
              case 'DEX-Country of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.CountryOfBirth  '])
                }else{columnNames = (['R.CountryOfBirth  '])} 
                      break;
              case 'DEX-First Arrival Year':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.FirstArrivalYear  '])
                }else{columnNames = (['DSS.FirstArrivalYear  '])}
                      break;               
              case 'DEX-First Arrival Month':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.FirstArrivalMonth  '])
                }else{columnNames = (['DSS.FirstArrivalMonth  '])}  
                      break;
              case 'DEX-Visa Code':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.VisaCategory  '])
                }else{columnNames = (['DSS.VisaCategory  '])}  
                      break;
              case 'DEX-Ancestry':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.Ancestry  '])
                }else{columnNames = (['DSS.Ancestry  '])}  
                      break;

              case 'DEX-Main Language At Home':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.HomeLanguage  '])
                }else{columnNames = (['R.HomeLanguage  '])}  
                      break;
              case 'DEX-Accomodation Setting':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.DEXACCOMODATION  '])
                }else{columnNames = (['DSS.DEXACCOMODATION  '])} 
                      break;
              case 'DEX-Is Homeless':
                var dexhomeless = " CASE WHEN ISNULL(DSS.IsHomeless, 0) = 0 THEN 'NO' ELSE 'YES' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([dexhomeless+'  '])
                }else{columnNames = ([dexhomeless+'  '])}  
                      break;
              case 'DEX-Household Composition':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.HouseholdComposition  '])
                }else{columnNames = (['DSS.HouseholdComposition  '])}  
                      break;
              case 'DEX-Main Source Of Income':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.MainIncomSource  '])
                }else{columnNames = (['DSS.MainIncomSource  '])} 
                      break;
              case 'DEX-Income Frequency':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.IncomFrequency  '])
                }else{columnNames = (['DSS.IncomFrequency  '])}  
                      break;
              case 'DEX-Income Amount': 
                  if(columnNames != []){
                  columnNames = columnNames.concat(['DSS.IncomeAmount  '])
                }else{columnNames = (['DSS.IncomeAmount  '])} 
                      break; 
// CSTDA Dataset Fields                      
              case 'CSTDA-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DateOfBirth]  '])
                }else{columnNames = (['R.[DateOfBirth]  '])}  
                      break;
              case 'CSTDA-Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_Sex]  '])
                }else{columnNames = (['R.[CSTDA_Sex]  '])}  
                      break;
              case 'CSTDA-DISQIS ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_ID]  '])
                }else{columnNames = (['R.[CSTDA_ID]  '])} 
                      break;
              case 'CSTDA-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_Indiginous]  '])
                }else{columnNames = (['R.[CSTDA_Indiginous]  '])}  
                      break;
              case 'CSTDA-Country Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CountryOfBirth]  '])
                }else{columnNames = (['R.[CountryOfBirth]  '])} 
                      break;
              case 'CSTDA-Interpreter Required':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_Interpreter]  '])
                }else{columnNames = (['R.[CSTDA_Interpreter]  '])}  
                      break;
              case 'CSTDA-Communication Method':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_Communication]  '])
                }else{columnNames = (['R.[CSTDA_Communication]  '])}  
                      break;
              case 'CSTDA-Living Arrangements':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_LivingArrangements]  '])
                }else{columnNames = (['R.[CSTDA_LivingArrangements]  '])} 
                      break;
              case 'CSTDA-Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Suburb]  '])
                }else{columnNames = (['R.[Suburb]  '])}
                      break;
              case 'CSTDA-Postcode':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Postcode]  '])
                }else{columnNames = (['R.[Postcode]  '])}  
                      break;
              case 'CSTDA-State':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[State]  '])
                }else{columnNames = (['R.[State]  '])}  
                      break;
              case 'CSTDA-Residential Setting':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_ResidentialSetting]  '])
                }else{columnNames = (['R.[CSTDA_ResidentialSetting]  '])}  
                      break;            
              case 'CSTDA-Primary Disability Group':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_DisabilityGroup]  '])
                }else{columnNames = (['R.[CSTDA_DisabilityGroup]  '])}  
                      break;
              case 'CSTDA-Primary Disability Description':
                var PrmaryDiabilityDesc = " CAST(ONI.[CSTDA_PrimaryDisabilityDescription] AS VARCHAR(4000)) "
                  if(columnNames != []){
                  columnNames = columnNames.concat([PrmaryDiabilityDesc + '  '])
                }else{columnNames = ([PrmaryDiabilityDesc + '  '])}  
                      break;
              case 'CSTDA-Intellectual Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherIntellectual]  '])
                }else{columnNames = (['R.[CSTDA_OtherIntellectual]  '])}
                      break;
              case 'CSTDA-Specific Learning ADD Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherADD]  '])
                }else{columnNames = (['R.[CSTDA_OtherADD]  '])}  
                      break;
              case 'CSTDA-Autism Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherAutism]  '])
                }else{columnNames = (['R.[CSTDA_OtherAutism]  '])}  
                      break;
              case 'CSTDA-Physical Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherPhysical]  '])
                }else{columnNames = (['R.[CSTDA_OtherPhysical]  '])}  
                      break;  
              case 'CSTDA-Acquired Brain Injury Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherAcquiredBrain]  '])
                }else{columnNames = (['R.[CSTDA_OtherAcquiredBrain]  '])}  
                      break;
              case 'CSTDA-Neurological Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherNeurological]  '])
                }else{columnNames = (['R.[CSTDA_OtherNeurological]  '])} 
                      break;
              case 'CSTDA-Deaf Blind Disability':
                if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherDeafBlind]  '])
                }else{columnNames = (['R.[CSTDA_OtherDeafBlind]  '])}                         
                    break;
              case 'CSTDA-Psychiatric Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_Psychiatric]  '])
                }else{columnNames = (['R.[CSTDA_Psychiatric]  '])} 
                      break;
              case 'CSTDA-Other Psychiatric Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherPsychiatric]  '])
                }else{columnNames = (['R.[CSTDA_OtherPsychiatric]  '])}
                      break;
              case 'CSTDA-Vision Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherVision]  '])
                }else{columnNames = (['R.[CSTDA_OtherVision]  '])}  
                      break;
              case 'CSTDA-Hearing Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherHearing]  '])
                }else{columnNames = (['R.[CSTDA_OtherHearing]  '])} 
                      break;
              case 'CSTDA-Speech Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_OtherSpeech]  '])
                }else{columnNames = (['R.[CSTDA_OtherSpeech]  '])}  
                      break;
              case 'CSTDA-Developmental Delay Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_DevelopDelay]  '])
                }else{columnNames = (['R.[CSTDA_DevelopDelay]  '])}  
                      break;
              case 'CSTDA-Disability Likely To Be Permanent':
                var Disabilitylikelyoperm = "(CASE R.[PermDisability]  WHEN 1 THEN 'True' else 'False' END)"
                  if(columnNames != []){
                  columnNames = columnNames.concat([Disabilitylikelyoperm +'  '])
                }else{columnNames = ([Disabilitylikelyoperm +'  '])}  
                      break;
              case 'CSTDA-Support Needs-Self Care':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_SelfCare]  '])
                }else{columnNames = (['R.[CSTDA_SupportNeeds_SelfCare]  '])}  
                      break;
              case 'CSTDA-Support Needs-Mobility':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Mobility]  '])
                }else{columnNames = (['R.[CSTDA_SupportNeeds_Mobility]  '])}  
                      break;
              case 'CSTDA-Support Needs-Communication':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Communication]  '])
                }else{columnNames = (['R.[CSTDA_SupportNeeds_Communication]  '])}  
                      break;
              case 'CSTDA-Support Needs-Interpersonal':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Relationships]  '])
                }else{columnNames = (['R.[CSTDA_SupportNeeds_Relationships]  '])}  
                      break; 
              case 'CSTDA-Support Needs-Learning':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Learning]  '])
                }else{columnNames = (['R.[CSTDA_SupportNeeds_Learning]  '])} 
                      break;
              case 'CSTDA-Support Needs-Education':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Education]  '])
                }else{columnNames = (['R.[CSTDA_SupportNeeds_Education]  '])}
                      break;
                case 'CSTDA-Support Needs-Community':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Community]  '])
                  }else{columnNames = (['R.[CSTDA_SupportNeeds_Community]  '])} 
                            break;
                    case 'CSTDA-Support Needs-Domestic':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Domestic]  '])
                      }else{columnNames = (['R.[CSTDA_SupportNeeds_Domestic]  '])}  
                            break;
                    case 'CSTDA-Support Needs-Working':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['R.[CSTDA_SupportNeeds_Domestic]  '])
                      }else{columnNames = (['R.[CSTDA_SupportNeeds_Domestic]  '])}
                            break;                    
                    case 'CSTDA-Carer-Existence Of Informal':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['R.[CSTDA_CarerExists]  '])
                      }else{columnNames = (['R.[CSTDA_CarerExists]  '])}  
                            break;
                    case 'CSTDA-Carer-Assists client in ADL':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['R.[CSTDA_CarerStatus]  '])
                      }else{columnNames = (['R.[CSTDA_CarerStatus]  '])} 
                      break;
              case 'CSTDA-Carer-Lives In Same Household':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_CarerResidencyStatus]  '])
                }else{columnNames = (['R.[CSTDA_CarerResidencyStatus]  '])}  
                      break;
              case 'CSTDA-Carer-Relationship':
                        if(columnNames != []){
                          columnNames = columnNames.concat(['R.[CSTDA_CarerRelationship]  '])
                        }else{columnNames = (['R.[CSTDA_CarerRelationship]  '])}  
                      break;
              case 'CSTDA-Carer-Age Group':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_CarerAgeGroup]  '])
                }else{columnNames = (['R.[CSTDA_CarerAgeGroup]  '])}  
                      break;
              case 'CSTDA-Carer Allowance to Guardians':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_CarerAllowance]  '])
                }else{columnNames = (['R.[CSTDA_CarerAllowance]  '])} 
                      break;
              case 'CSTDA-Labour Force Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_LaborStatus]  '])
                }else{columnNames = (['R.[CSTDA_LaborStatus]  '])}  
                      break;
              case 'CSTDA-Main Source Of Income':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_MainIncome]  '])
                }else{columnNames = (['R.[CSTDA_MainIncome]  '])}  
                      break;
              case 'CSTDA-Current Individual Funding':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CSTDA_FundingStatus]  '])
                }else{columnNames = (['R.[CSTDA_FundingStatus]  '])} 
                      break;
//NRCP Dataset Fields                      
              case 'NRCP-First Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[FirstName]  '])
                }else{columnNames = (['R.[FirstName]  '])}  
                      break;         
              case 'NRCP-Surname':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Surname/Organisation]  '])
                }else{columnNames = (['R.[Surname/Organisation]  '])}  
                      break;
              case 'NRCP-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DateOfBirth]  '])
                }else{columnNames = (['R.[DateOfBirth]  '])} 
                      break;
              case 'NRCP-Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Gender]  '])
                }else{columnNames = (['R.[Gender]  '])}  
                      break;
              case 'NRCP-Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Suburb]  '])
                }else{columnNames = (['R.[Suburb]  '])}  
                      break;
              case 'NRCP-Country Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[CountryOfBirth]  '])
                }else{columnNames = (['R.[CountryOfBirth]  '])}  
                      break;                
              case 'NRCP-Preferred Language':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[HomeLanguage]  '])
                }else{columnNames = (['R.[HomeLanguage]  '])}  
                      break;                    
              case 'NRCP-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[IndiginousStatus]  '])
                }else{columnNames = (['R.[IndiginousStatus]  '])} 
                      break;
              case 'NRCP-Marital Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[MaritalStatus]  '])
                }else{columnNames = (['R.[MaritalStatus]  '])}  
                      break;
              case 'NRCP-DVA Card Holder Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_DVA_Card_Holder_Status]  '])
                }else{columnNames = (['R.[RECIPT_DVA_Card_Holder_Status]  '])}  
                      break;
              case 'NRCP-Paid Employment Participation':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Paid_Employment_Participation]  '])
                }else{columnNames = (['R.[RECIPT_Paid_Employment_Participation]  '])} 
                      break;
              case 'NRCP-Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[NRCP_GovtPensionStatus]  '])
                }else{columnNames = (['R.[NRCP_GovtPensionStatus]  '])} 
                      break;
              case 'NRCP-Carer-Date Role Commenced':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Date_Caring_Role_Commenced]  '])
                }else{columnNames = (['R.[RECIPT_Date_Caring_Role_Commenced]  '])} 
                      break;
              case 'NRCP-Carer-Role':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Care_Role]  '])
                }else{columnNames = (['R.[RECIPT_Care_Role]  '])}  
                      break;
              case 'NRCP-Carer-Need':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Care_Need]  '])
                }else{columnNames = (['R.[RECIPT_Care_Need]  '])}  
                      break;
              case 'NRCP-Carer-Number of Recipients':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Number_Care_Recipients]  '])
                }else{columnNames = (['R.[RECIPT_Number_Care_Recipients]  '])}  
                      break;
              case 'NRCP-Carer-Time Spent Caring':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Time_Spent_Caring]  '])
                }else{columnNames = (['R.[RECIPT_Time_Spent_Caring]  '])}  
                      break;
              case 'NRCP-Carer-Current Use Formal Services':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[NRCP_CurrentUseFormalServices]  '])
                }else{columnNames = (['R.[NRCP_CurrentUseFormalServices]  '])}  
                      break;
              case 'NRCP-Carer-Informal Support':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[NRCP_InformalSupport]  '])
                }else{columnNames = (['R.[NRCP_InformalSupport]  '])}  
                      break;
              case 'NRCP-Recipient-Challenging Behaviour':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Challenging_Behaviour]  '])
                }else{columnNames = (['R.[RECIPT_Challenging_Behaviour]  '])}  
                      break;
              case 'NRCP-Recipient-Primary Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Care_Recipients_Primary_Disability]  '])
                }else{columnNames = (['R.[RECIPT_Care_Recipients_Primary_Disability]  '])}  
                      break;         
              case 'NRCP-Recipient-Primary Care Needs':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Care_Recipients_Primary_Care_Needs]  '])
                }else{columnNames = (['R.[RECIPT_Care_Recipients_Primary_Care_Needs]  '])}  
                      break;
              case 'NRCP-Recipient-Level of Need':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Care_Recipients_Level_Need]  '])
                }else{columnNames = (['R.[RECIPT_Care_Recipients_Level_Need]  '])} 
                      break;
              case 'NRCP-Recipient-Primary Carer':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DatasetCarer]  '])
                }else{columnNames = (['R.[DatasetCarer]  '])}  
                      break;
              case 'NRCP-Recipient-Carer Relationship':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[NRCP_CarerRelationship]  '])
                }else{columnNames = (['R.[NRCP_CarerRelationship]  '])} 
                      break;
              case 'NRCP-Recipient-Carer Co-Resident':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[NRCP_CarerCoResidency]  '])
                }else{columnNames = (['R.[NRCP_CarerCoResidency]  '])}  
                      break;
              case 'NRCP-Recipient-Dementia':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[RECIPT_Dementia]  '])
                }else{columnNames = (['R.[RECIPT_Dementia]  '])}  
                      break;
            /*  case 'NRCP-CALD Background':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  '])
                }else{columnNames = (['  '])}  
                      break; */
// "ONI-Core"     
/**
 * 
 *  */                 
              case 'ONI-Family Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Surname/Organisation]  '])
                }else{columnNames = (['R.[Surname/Organisation]  '])}  
                      break;
              case 'ONI-Title':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Title]  '])
                }else{columnNames = (['R.[Title]  '])} 
                      break;
              case 'ONI-First Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[FirstName]  '])
                }else{columnNames = (['R.[FirstName]  '])}  
                      break;
              case 'ONI-Other':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[MiddleNames]  '])
                }else{columnNames = (['R.[MiddleNames]  '])} 
                      break;
              case 'ONI-Sex':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[Gender]  '])
                }else{columnNames = (['R.[Gender]  '])}  
                      break;
              case 'ONI-DOB':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['R.[DateOfBirth]  '])
                }else{columnNames = (['R.[DateOfBirth]  '])}  
                      break;
              case 'ONI-Usual Address-Street':
                var AddressStreet = " (SELECT TOP 1 Address1 from namesandaddresses WHERE personid = R.UniqueID AND Description = '<USUAL>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([AddressStreet +'  '])
                }else{columnNames = ([AddressStreet +'  '])}  
                      break;
              case 'ONI-Usual Address-Suburb':
                var AddressSburb = " (SELECT TOP 1 Suburb from namesandaddresses WHERE personid = R.UniqueID AND Description = '<USUAL>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([AddressSburb +'  '])
                }else{columnNames = ([AddressSburb +'  '])}  
                      break;
              case 'ONI-Usual Address-Postcode':
                var AddressPostCode = " (SELECT TOP 1 Postcode from namesandaddresses WHERE personid = R.UniqueID AND Description = '<USUAL>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([AddressPostCode+ '  '])
                }else{columnNames = ([AddressPostCode +'  '])}  
                      break;
              case 'ONI-Contact Address-Street':
                var AddressCotactStreet = " (SELECT TOP 1 Address1 from namesandaddresses WHERE personid = R.UniqueID AND Description = '<CONTACT>') "
                        if(columnNames != []){
                          columnNames = columnNames.concat([AddressCotactStreet +'  '])
                        }else{columnNames = ([AddressCotactStreet +'  '])}  
                      break;
              case 'ONI-Contact Address-Suburb':
                var AddressCotactSuburb = " (SELECT TOP 1 Suburb from namesandaddresses WHERE personid = R.UniqueID AND Description = '<CONTACT>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([AddressCotactSuburb +'  '])
                }else{columnNames = ([AddressCotactSuburb +'  '])} 
                      break;
              case 'ONI-Contact Address-Postcode':
                var AddressCotactPostCode = " (SELECT TOP 1 Postcode from namesandaddresses WHERE personid = R.UniqueID AND Description = '<CONTACT>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([AddressCotactPostCode +'  '])
                }else{columnNames = ([AddressCotactPostCode +'  '])} 
                      break;
              case 'ONI-Phone-Home':
                var PhoneHome = " (SELECT TOP 1 Detail from PhoneFaxOther WHERE personid = R.UniqueID AND [Type] = '<HOME>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([PhoneHome + '  '])
                }else{columnNames = ([PhoneHome +'  '])}  
                      break;
              case 'ONI-Phone-Work':
                var PhoneWork = " (SELECT TOP 1 Detail from PhoneFaxOther WHERE personid = R.UniqueID AND [Type] = '<WORK>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([PhoneWork +'  '])
                }else{columnNames = ([PhoneWork +'  '])}  
                      break;
              case 'ONI-Phone-Mobile':
                var PhoneMobile = " (SELECT TOP 1 Detail from PhoneFaxOther WHERE personid = R.UniqueID AND [Type] = '<MOBILE>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([PhoneMobile +'  '])
                }else{columnNames = ([PhoneMobile + '  '])}  
                      break;
              case 'ONI-Phone-FAX':
                var PhoneFax = " (SELECT TOP 1 Detail from PhoneFaxOther WHERE personid = R.UniqueID AND [Type] = '<FAX>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([PhoneFax +'  '])
                }else{columnNames = ([PhoneFax +'  '])} 
                      break;
              case 'ONI-EMAIL':
                var Email = " (SELECT TOP 1 Detail from PhoneFaxOther WHERE personid = R.UniqueID AND [Type] = '<EMAIL>') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Email +'  '])
                }else{columnNames = ([Email +'  '])}
                      break;
              case 'ONI-Person 1 Name':
                var Person1name = " (SELECT TOP 1 [Name] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON1') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person1name +'  '])
                }else{columnNames = ([Person1name +'  '])}  
                      break;
              case 'ONI-Person 1 Street':
                var Person1Street = " (SELECT TOP 1 [Address1] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON1') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person1Street +'  '])
                }else{columnNames = ([Person1Street +'  '])}
                      break;
              case 'ONI-Person 1 Suburb':
                var Person1Suburb = " (SELECT TOP 1 [Suburb] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON1') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person1Suburb +'  '])
                }else{columnNames = ([Person1Suburb +'  '])}
                      break;
              case 'ONI-Person 1 Postcode':
                var Person1PostCode = " (SELECT TOP 1 [Phone1] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON1') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person1PostCode+'  '])
                }else{columnNames = ([Person1PostCode+'  '])} 
                      break;
              case 'ONI-Person 1 Phone':
                var Person1Phone = " (SELECT TOP 1 [Phone1] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON1') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person1Phone+'  '])
                }else{columnNames = ([Person1Phone+'  '])} 
                      break;
              case 'ONI-Person 1 Relationship':
                var Person1Relationship = " (SELECT TOP 1 [Type] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON1') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person1Relationship+'  '])
                }else{columnNames = ([Person1Relationship+'  '])} 
                      break;
              case 'ONI-Person 2 Name':
                var Person2name = " (SELECT TOP 1 [Name] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON2') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person2name+'  '])
                }else{columnNames = ([Person2name+'  '])}  
                      break;
              case 'ONI-Person 2 Street':
                var Person2Street = " (SELECT TOP 1 [Address1] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON2') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person2Street+'  '])
                }else{columnNames = ([Person2Street+'  '])}
                      break;
              case 'ONI-Person 2 Suburb':
                var Person2Suburb = " (SELECT TOP 1 [Suburb] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON2') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person2Suburb+'  '])
                }else{columnNames = ([Person2Suburb+'  '])} 
                      break;
              case 'ONI-Person 2 Postcode':
                var Person2PostCode = " (SELECT TOP 1 [Postcode] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON2') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person2PostCode+'  '])
                }else{columnNames = ([Person2PostCode+'  '])} 
                      break;
              case 'ONI-Person 2 Phone':
                var Person2Phone = " (SELECT TOP 1 [Phone1] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON2') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person2Phone+'  '])
                }else{columnNames = ([Person2Phone+ ' '])}  
                      break;
              case 'ONI-Person 2 Relationship':
                var Person2Relationship = " (SELECT TOP 1 [Type] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'PERSON2') "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Person2Relationship+'  '])
                }else{columnNames = ([Person2Relationship+'  '])}
                      break;
              case 'ONI-Doctor Name':
                var Doctorname = " (SELECT Top 1 [Name] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'GP' ORDER BY RecordNumber) "
                  if(columnNames != []){
                  columnNames = columnNames.concat([Doctorname+'  '])
                }else{columnNames = ([Doctorname+'  '])}
                      break;
              case 'ONI-Doctor Street':
                var DoctorStreet = " (SELECT Top 1 [Address1] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'GP' ORDER BY RecordNumber) "
                  if(columnNames != []){
                  columnNames = columnNames.concat([DoctorStreet+'  '])
                }else{columnNames = ([DoctorStreet+'  '])} 
                      break;
              case 'ONI-Doctor Suburb':
                var DoctorSuburb = " (SELECT Top 1 [Suburb] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'GP' ORDER BY RecordNumber) "
                  if(columnNames != []){
                  columnNames = columnNames.concat([DoctorSuburb+'  '])
                }else{columnNames = ([DoctorSuburb+'  '])}  
                      break;
              case 'ONI-Doctor Postcode':
                var DoctorPostCode = " (SELECT Top 1 [Postcode] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'GP' ORDER BY RecordNumber) "
                  if(columnNames != []){
                columnNames = columnNames.concat([DoctorPostCode+'  '])
              }else{columnNames = ([DoctorPostCode+'  '])}
                      break;
              case 'ONI-Doctor Phone':
                var DoctorPhone = " (SELECT Top 1 [Phone1] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'GP' ORDER BY RecordNumber) "
                  if(columnNames != []){
                columnNames = columnNames.concat([DoctorPhone+'  '])
              }else{columnNames = ([DoctorPhone+'  '])}
                      break;                           
              case 'ONI-Doctor FAX':
                var DoctorFax = " (SELECT Top 1 [FAX] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'GP' ORDER BY RecordNumber) "
                  if(columnNames != []){
                columnNames = columnNames.concat([DoctorFax+'  '])
              }else{columnNames = ([DoctorFax+'  '])}
                      break;
              case 'ONI-Doctor EMAIL':
                var DoctorEmail = " (SELECT Top 1 [Email] from HumanResources WHERE personid = R.UniqueID AND [EquipmentCode] = 'GP' ORDER BY RecordNumber)  "
                  if(columnNames != []){
                columnNames = columnNames.concat([DoctorEmail+'  '])
              }else{columnNames = ([DoctorEmail+'  '])}
                      break;
              case 'ONI-Referral Source':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ReferralSource]  '])
              }else{columnNames = (['R.[ReferralSource]  '])}
                      break;
              case 'ONI-Contact Details':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ReferralContactInfo]  '])
              }else{columnNames = (['R.[ReferralContactInfo]  '])}
                      break;
              case 'ONI-Country Of Birth':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[CountryOfBirth]  '])
              }else{columnNames = (['R.[CountryOfBirth]  '])}
                      break;
              case 'ONI-Indigenous Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[IndiginousStatus]  '])
              }else{columnNames = (['R.[IndiginousStatus]  '])}
                      break;
              case 'ONI-Main Language At Home':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[HomeLanguage]  '])
              }else{columnNames = (['R.[HomeLanguage]  '])}
                      break;
              case 'ONI-Interpreter Required':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[InterpreterRequired]  '])
              }else{columnNames = (['R.[InterpreterRequired]  '])}
                      break;
                      
              case 'ONI-Preferred Language':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[HomeLanguage]  '])
              }else{columnNames = (['R.[HomeLanguage]  '])}
                      break;
              case 'ONI-Govt Pension Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[PensionStatus]  '])
              }else{columnNames = (['R.[PensionStatus]  '])}
                      break;
              case 'ONI-Pension Benefit Card':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ConcessionNumber]  '])
              }else{columnNames = (['R.[ConcessionNumber]  '])}
                      break;
              case 'ONI-Medicare Number':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[MedicareNumber]  '])
              }else{columnNames = (['R.[MedicareNumber]  '])}
                      break;
              case 'ONI-Health Care Card#':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[Healthcare#]  '])
              }else{columnNames = (['R.[Healthcare#]  '])}
                      break;                     
              case 'ONI-DVA Cardholder Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HACCDVACardHolderStatus]  '])
              }else{columnNames = (['ONI.[HACCDVACardHolderStatus]  '])}
                      break;
              case 'ONI-DVA Number':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[DVANumber]  '])
              }else{columnNames = (['R.[DVANumber]  '])}
                      break;
              case 'ONI-Insurance Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[InsuranceStatus]  '])
              }else{columnNames = (['R.[InsuranceStatus]  '])}
                      break;
              case 'ONI-Health Insurer':
                var healthinsurer = " (SELECT TOP 1 [Type] from HumanResources WHERE personid = R.UniqueID AND [GROUP]= 'HEALTHINSURER') "
                  if(columnNames != []){
                columnNames = columnNames.concat([healthinsurer +'  '])
              }else{columnNames = ([healthinsurer +'  '])}
                      break;        
              case 'ONI-Health Insurance Card#':
              var healthinsurercardNum = " (SELECT TOP 1 [Name] from HumanResources WHERE personid = R.UniqueID AND [GROUP]= 'HEALTHINSURER') "
                  if(columnNames != []){
                columnNames = columnNames.concat([healthinsurercardNum +'  '])
              }else{columnNames = ([healthinsurercardNum +'  '])}
                      break;
              case 'ONI-Alerts':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[Notes]  '])
              }else{columnNames = (['R.[Notes]  '])}
                      break;
              case 'ONI-Rating':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIRating]  '])
              }else{columnNames = (['R.[ONIRating]  '])}
                      break;
              case 'ONI-HACC Eligible':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[HACCEligible]  '])
              }else{columnNames = (['R.[HACCEligible]  '])}
                      break;
              case 'ONI-Reason For HACC Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[DSCEligible]  '])
              }else{columnNames = (['R.[DSCEligible]  '])}
                      break;
              case 'ONI-Other Support Eligibility':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[HACCReason]  '])
              }else{columnNames = (['R.[HACCReason]  '])}
                      break;                                       
              case 'ONI-Other Support Detail':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[OtherEligibleDetails]  '])
              }else{columnNames = (['R.[OtherEligibleDetails]  '])}
                      break;
              case 'ONI-Functional Profile Complete':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfileComplete]  '])
              }else{columnNames = (['R.[ONIFProfileComplete]  '])}
                      break;
              case 'ONI-Functional Profile Score 1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile1]  '])
              }else{columnNames = (['R.[ONIFProfile1]  '])}
                      break;
              case 'ONI-Functional Profile Score 2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile2]  '])
              }else{columnNames = (['R.[ONIFProfile2]  '])}
                      break;
              case 'ONI-Functional Profile Score 3':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile3]  '])
              }else{columnNames = (['R.[ONIFProfile3]  '])}
                      break;
              case 'ONI-Functional Profile Score 4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile4]  '])
              }else{columnNames = (['R.[ONIFProfile4]  '])}
                      break;
              case 'ONI-Functional Profile Score 5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile5]  '])
              }else{columnNames = (['R.[ONIFProfile5]  '])}
                      break;
              case 'ONI-Functional Profile Score 6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile6]  '])
              }else{columnNames = (['R.[ONIFProfile6]  '])}
                      break;
              case 'ONI-Functional Profile Score 7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile7]  '])
              }else{columnNames = (['R.[ONIFProfile7]  '])}
                      break;
              case 'ONI-Functional Profile Score 8':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile8]  '])
              }else{columnNames = (['R.[ONIFProfile8]  '])}
                      break;
              case 'ONI-Functional Profile Score 9':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[ONIFProfile9]  '])
              }else{columnNames = (['R.[ONIFProfile9]  '])}
                      break;
              case 'ONI-Main Problem-Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIMainIssues.[Description]  '])
              }else{columnNames = (['ONIMainIssues.[Description]  '])}
                      break;
              case 'ONI-Main Problem-Action':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIMainIssues.[Action]  '])
              }else{columnNames = (['ONIMainIssues.[Action]  '])}
                      break;
              case 'ONI-Other Problem-Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONISecondaryIssues.[Description]  '])
              }else{columnNames = (['ONISecondaryIssues.[Description]  '])}
                      break;
              case 'ONI-Other Problem-Action':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONISecondaryIssues.[Action]  '])
              }else{columnNames = (['ONISecondaryIssues.[Action]  '])}
                      break;    
              case 'ONI-Current Service':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIServices.[Service]  '])
              }else{columnNames = (['ONIServices.[Service]  '])}
                      break;
              case 'ONI-Service Contact Details':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIServices.[Information]  '])
              }else{columnNames = (['ONIServices.[Information]  '])}
                      break;                      
              case 'ONI-AP-Agency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[HealthProfessional]  '])
              }else{columnNames = (['ONIActionPlan.[HealthProfessional]  '])}
                      break;
              case 'ONI-AP-For':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[For]  '])
              }else{columnNames = (['ONIActionPlan.[For]  '])}
                      break;
              case 'ONI-AP-Consent':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[Consent]  '])
              }else{columnNames = (['ONIActionPlan.[Consent]  '])}
                      break;
              case 'ONI-AP-Referral':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[Referral]  '])
              }else{columnNames = (['ONIActionPlan.[Referral]  '])}
                      break;
              case 'ONI-AP-Transport':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[Transport]  '])
              }else{columnNames = (['ONIActionPlan.[Transport]  '])}
                      break;
              case 'ONI-AP-Feedback':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[Feedback]  '])
              }else{columnNames = (['ONIActionPlan.[Feedback]  '])}
                      break;
              case 'ONI-AP-Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[Date]  '])
              }else{columnNames = (['ONIActionPlan.[Date]  '])}
                      break;
              case 'ONI-AP-Review':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIActionPlan.[Review]  '])
              }else{columnNames = (['ONIActionPlan.[Review]  '])}
                      break;
//  ONI-Functional Profile                      
              case 'ONI-FPQ1-Housework':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP1_Housework  '])
              }else{columnNames = (['ONI.[FP1_Housework  '])}
                      break;
              case 'ONI-FPQ2-GetToPlaces':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP2_WalkingDistance]  '])
              }else{columnNames = (['ONI.[FP2_WalkingDistance]  '])}
                      break;
              case 'ONI-FPQ3-Shopping':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP3_Shopping]  '])
              }else{columnNames = (['ONI.[FP3_Shopping]  '])}
                      break;
              case 'ONI-FPQ4-Medicine':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP4_Medicine]  '])
              }else{columnNames = (['ONI.[FP4_Medicine]  '])}
                      break;
              case 'ONI-FPQ5-Money':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP5_Money]  '])
              }else{columnNames = (['ONI.[FP5_Money]  '])}
                      break;
              case 'ONI-FPQ6-Walk':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP6_Walking]  '])
              }else{columnNames = (['ONI.[FP6_Walking]  '])}
                      break;                 
              case 'ONI-FPQ7-Bath':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP7_Bathing]  '])
              }else{columnNames = (['ONI.[FP7_Bathing]  '])}
                      break;
              case 'ONI-FPQ8-Memory':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP8_Memory]  '])
              }else{columnNames = (['ONI.[FP8_Memory]  '])}
                      break;                      
              case 'ONI-FPQ9-Behaviour':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP9_Behaviour]  '])
              }else{columnNames = (['ONI.[FP9_Behaviour]  '])}
                      break;
              case 'ONI-FP-Recommend Domestic':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FA_Domestic]  '])
              }else{columnNames = (['ONI.[FA_Domestic]  '])}
                      break;
              case 'ONI-FP-Recommend Self Care':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FA_SelfCare]  '])
              }else{columnNames = (['ONI.[FA_SelfCare]  '])}
                      break;
              case 'ONI-FP-Recommend Cognition':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FA_Cognition]  '])
              }else{columnNames = (['ONI.[FA_Cognition]  '])}
                      break;
              case 'ONI-FP-Recommend Behaviour':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FA_Behaviour]  '])
              }else{columnNames = (['ONI.[FA_Behaviour]  '])}
                      break;
              case 'ONI-FP-Has Self Care Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[Aids_SelfCare]  '])
              }else{columnNames = (['ONI.[Aids_SelfCare]  '])}
                      break;
              case 'ONI-FP-Has Support/Mobility Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[Aids_SupportAndMobility]  '])
              }else{columnNames = (['ONI.[Aids_SupportAndMobility]  '])}
                      break;
              case 'ONI-FP-Has Communication Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[Aids_CommunicationAids]  '])
              }else{columnNames = (['ONI.[Aids_CommunicationAids]  '])}
                      break;
              case 'ONI-FP-Has Car Mods':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[Aids_CarModifications]  '])
              }else{columnNames = (['ONI.[Aids_CarModifications]  '])}
                      break;
              case 'ONI-FP-Has Other Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[Aids_Other]  '])
              }else{columnNames = (['ONI.[Aids_Other]  '])}
                      break;
              case 'ONI-FP-Other Goods List':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[AidsOtherList]  '])
              }else{columnNames = (['ONI.[AidsOtherList]  '])}
                      break;
              case 'ONI-FP-Has Medical Care Aids':
                        if(columnNames != []){
                          columnNames = columnNames.concat(['ONI.[Aids_MedicalCare]  '])
                        }else{columnNames = (['ONI.[Aids_MedicalCare]  '])}
                                
                           break;
              case 'ONI-FP-Has Reading Aids':
                            if(columnNames != []){
                              columnNames = columnNames.concat(['ONI.[Aids_Reading]  '])
                            }else{columnNames = (['ONI.[Aids_Reading]  '])}                                    
                           break;                      
              case 'ONI-FP-Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[FP_Comments]  '])
              }else{columnNames = (['ONI.[FP_Comments]  '])}
                      break; 
//  ONI-Living Arrangements Profile                                      
              case 'ONI-LA-Living Arrangements':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[LivingArrangements]  '])
              }else{columnNames = (['R.[LivingArrangements]  '])}
                      break;
              case 'ONI-LA-Living Arrangements Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_LivingComments]  '])
              }else{columnNames = (['ONI.[LAP_LivingComments]  '])}
                      break;
              case 'ONI-LA-Accomodation':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[DwellingAccomodation]  '])
              }else{columnNames = (['R.[DwellingAccomodation]  '])}
                      break;
              case 'ONI-LA-Accomodation Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_AccomodationComments]  '])
              }else{columnNames = (['ONI.[LAP_AccomodationComments]  '])}
                      break;
                     
              case 'ONI-LA-Employment Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_Employment]  '])
              }else{columnNames = (['ONI.[LAP_Employment]  '])}
                      break;
              case 'ONI-LA-Employment Status Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_EmploymentComments]  '])
              }else{columnNames = (['ONI.[LAP_EmploymentComments]  '])}
                      break;
              case 'ONI-LA-Mental Health Act Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_MentalHealth]  '])
              }else{columnNames = (['ONI.[LAP_MentalHealth]  '])}
                      break;
              case 'ONI-LA-Decision Making Responsibility':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_Decision]  '])
              }else{columnNames = (['ONI.[LAP_Decision]  '])}
                      break;
              case 'ONI-LA-Capable Own Decisions':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_DecisionCapable]  '])
              }else{columnNames = (['ONI.[LAP_DecisionCapable]  '])}
                      break;
              case 'ONI-LA-Financial Decisions':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_FinancialDecision]  '])
              }else{columnNames = (['ONI.[LAP_FinancialDecision]  '])}
                      break;              
              case 'ONI-LA-Cost Of Living Trade Off':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_LivingCostDecision]  '])
              }else{columnNames = (['ONI.[LAP_LivingCostDecision]  '])}
                      break;
              case 'ONI-LA-Financial & Legal Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[LAP_LivingCostDecisionComments]  '])
              }else{columnNames = (['ONI.[LAP_LivingCostDecisionComments]  '])}
                      break;
// ONI-Health Conditions Profile 
              case 'ONI-HC-Overall Health Description':
                if(columnNames != []){
              columnNames = columnNames.concat(['ONI.[HC_Overall_General]  '])
              }else{columnNames = (['ONI.[HC_Overall_General]  '])}
                    break                      
              case 'ONI-HC-Overall Health Pain':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Overall_Pain]  '])
              }else{columnNames = (['ONI.[HC_Overall_Pain]  '])}
                      break;
              case 'ONI-HC-Overall Health Interference':                
                if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.[HC_Overall_Interfere]  '])
                }else{columnNames = (['ONI.[HC_Overall_Interfere]  '])}
                        break;
              case 'ONI-HC-Vision Reading':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vision_Reading]  '])
              }else{columnNames = (['ONI.[HC_Vision_Reading]  '])}
                      break;
              case 'ONI-HC-Vision Distance':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vision_Long]  '])
              }else{columnNames = (['ONI.[HC_Vision_Long]  '])}
                      break;                   
              case 'ONI-HC-Hearing':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Hearing]  '])
              }else{columnNames = (['ONI.[HC_Hearing]  '])}
                      break;
              case 'ONI-HC-Oral Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Oral]  '])
              }else{columnNames = (['ONI.[HC_Oral]  '])}
                      break;
              case 'ONI-HC-Oral Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_OralComments]  '])
              }else{columnNames = (['ONI.[HC_OralComments]  '])}
                      break;
              case 'ONI-HC-Speech/Swallow Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Speech]  '])
              }else{columnNames = (['ONI.[HC_Speech]  '])}
                      break;
              case 'ONI-HC-Speech/Swallow Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_SpeechComments]  '])
              }else{columnNames = (['ONI.[HC_SpeechComments]  '])}
                      break;
              case 'ONI-HC-Falls Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Falls]  '])
              }else{columnNames = (['ONI.[HC_Falls]  '])}
                      break;
              case 'ONI-HC-Falls Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_FallsComments]  '])
              }else{columnNames = (['ONI.[HC_FallsComments]  '])}
                      break;
              case 'ONI-HC-Feet Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Feet]  '])
              }else{columnNames = (['ONI.[HC_Feet]  '])}
                      break;
              case 'ONI-HC-Feet Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_FeetComments]  '])
              }else{columnNames = (['ONI.[HC_FeetComments]  '])}
                      break;
              case 'ONI-HC-Vacc. Influenza':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Influenza]  '])
              }else{columnNames = (['ONI.[HC_Vac_Influenza]  '])}
                      break;
              case 'ONI-HC-Vacc. Influenza Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Influenza_Date]  '])
              }else{columnNames = (['ONI.[HC_Vac_Influenza_Date]  '])}
                      break;
              case 'ONI-HC-Vacc. Pneumococcus':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Pneumo]  '])
              }else{columnNames = (['ONI.[HC_Vac_Pneumo]  '])}
                      break;
              case 'ONI-HC-Vacc. Pneumococcus  Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Pneumo_Date]  '])
              }else{columnNames = (['ONI.[HC_Vac_Pneumo_Date]  '])}
                      break;                     
              case 'ONI-HC-Vacc. Tetanus':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Tetanus]  '])
              }else{columnNames = (['ONI.[HC_Vac_Tetanus]  '])}
                      break;
              case 'ONI-HC-Vacc. Tetanus Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Tetanus_Date]  '])
              }else{columnNames = (['ONI.[HC_Vac_Tetanus_Date]  '])}
                      break;
              case 'ONI-HC-Vacc. Other':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Other]  '])
              }else{columnNames = (['ONI.[HC_Vac_Other]  '])}
                      break;
              case 'ONI-HC-Vacc. Other Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Vac_Other_Date]  '])
              }else{columnNames = (['ONI.[HC_Vac_Other_Date]  '])}
                      break;
              case 'ONI-HC-Driving MV':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Driving]  '])
              }else{columnNames = (['ONI.[HC_Driving]  '])}
                      break;
              case 'ONI-HC-Driving Fit':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_FitToDrive]  '])
              }else{columnNames = (['ONI.[HC_FitToDrive]  '])}
                      break;
              case 'ONI-HC-Driving Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_DrivingComments]  '])
              }else{columnNames = (['ONI.[HC_DrivingComments]  '])}
                      break;
              case 'ONI-HC-Continence Urinary':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Continence_Urine]  '])
              }else{columnNames = (['ONI.[HC_Continence_Urine]  '])}
                      break;
              case 'ONI-HC-Urinary Related To Coughing':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Continence_Urine_Sneeze]  '])
              }else{columnNames = (['ONI.[HC_Continence_Urine_Sneeze]  '])}
                      break;
                      
              case 'ONI-HC-Faecal Continence':
                    if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.[HC_Continence_Faecal]  '])
                }else{columnNames = (['ONI.[HC_Continence_Faecal]  '])}
                        break;          
              case 'ONI-HC-Continence Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_ContinenceComments]  '])
              }else{columnNames = (['ONI.[HC_ContinenceComments]  '])}
                      break;
              case 'ONI-HC-Weight':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Weight]  '])
              }else{columnNames = (['ONI.[HC_Weight]  '])}
                      break;
              case 'ONI-HC-Height':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Height]  '])
              }else{columnNames = (['ONI.[HC_Height]  '])}
                      break;
              case 'ONI-HC-BMI':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_BMI]  '])
              }else{columnNames = (['ONI.[HC_BMI]  '])}
                      break;
              case 'ONI-HC-BP Systolic':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_BP_Systolic]  '])
              }else{columnNames = (['ONI.[HC_BP_Systolic]  '])}
                      break;
              case 'ONI-HC-BP Diastolic':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_BP_Diastolic]  '])
              }else{columnNames = (['ONI.[HC_BP_Diastolic]  '])}
                      break;
              case 'ONI-HC-Pulse Rate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_PulseRate]  '])
              }else{columnNames = (['ONI.[HC_PulseRate]  '])}
                      break;          
              case 'ONI-HC-Pulse Regularity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Pulse]  '])
              }else{columnNames = (['ONI.[HC_Pulse]  '])}
                      break;
              case 'ONI-HC-Check Postural Hypotension':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_PHCheck]  '])
              }else{columnNames = (['ONI.[HC_PHCheck]  '])}
                      break;                                                                  
              case 'ONI-HC-Conditions':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIHealthConditions.[Description]  '])
              }else{columnNames = (['ONIHealthConditions.[Description]  '])}
                      break;
              case 'ONI-HC-Diagnosis':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MDiagnosis.[Description]  '])
              }else{columnNames = (['MDiagnosis.[Description]  '])}
                      break;
              case 'ONI-HC-Medicines':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONIMedications.[Description]  '])
              }else{columnNames = (['ONIMedications.[Description]  '])}
                      break;
              case 'ONI-HC-Take Own Medication':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Med_TakeOwn]  '])
              }else{columnNames = (['ONI.[HC_Med_TakeOwn]  '])}
                      break;
              case 'ONI-HC-Willing When Presribed':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Med_Willing]  '])
              }else{columnNames = (['ONI.[HC_Med_Willing]  '])}
                      break;              
              case 'ONI-HC-Co-op With Health Services':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Med_Coop]  '])
              }else{columnNames = (['ONI.[HC_Med_Coop]  '])}
                      break;
              case 'ONI-HC-Webster Pack':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Med_Webster]  '])
              }else{columnNames = (['ONI.[HC_Med_Webster]  '])}
                      break;
              case 'ONI-HC-Medication Review':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_Med_Review]  '])
              }else{columnNames = (['ONI.[HC_Med_Review]  '])}
                      break;
              case 'ONI-HC-Medical Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HC_MedComments]  '])
              }else{columnNames = (['ONI.[HC_MedComments]  '])}
                      break;
//ONI-Psychosocial Profile                      
              case 'ONI-PS-K10-1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_1]  '])
              }else{columnNames = (['ONI.[PP_K10_1]  '])}
                      break;
              case 'ONI-PS-K10-2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_2]  '])
              }else{columnNames = (['ONI.[PP_K10_2]  '])}
                      break;
              case 'ONI-PS-K10-3':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_3]  '])
              }else{columnNames = (['ONI.[PP_K10_3]  '])}
                      break;
              case 'ONI-PS-K10-4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_4]  '])
              }else{columnNames = (['ONI.[PP_K10_4]  '])}
                      break;
              case 'ONI-PS-K10-5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_5]  '])
              }else{columnNames = (['ONI.[PP_K10_5]  '])}
                      break;
              case 'ONI-PS-K10-6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_6]  '])
              }else{columnNames = (['ONI.[PP_K10_6]  '])}
                      break;
              case 'ONI-PS-K10-7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_7]  '])
              }else{columnNames = (['ONI.[PP_K10_7]  '])}
                      break;                      
              case 'ONI-PS-K10-8':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_8]  '])
              }else{columnNames = (['ONI.[PP_K10_8]  '])}
                      break;
              case 'ONI-PS-K10-9':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_9]  '])
              }else{columnNames = (['ONI.[PP_K10_9]  '])}
                      break;
              case 'ONI-PS-K10-10':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_K10_10]  '])
              }else{columnNames = (['ONI.[PP_K10_10]  '])}
                      break;
              case 'ONI-PS-Sleep Difficulty':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_SleepingDifficulty]  '])
              }else{columnNames = (['ONI.[PP_SleepingDifficulty]  '])}
                      break;
              case 'ONI-PS-Sleep Details':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_SleepingDifficultyComments]  '])
              }else{columnNames = (['ONI.[PP_SleepingDifficultyComments]  '])}
                      break;
              case 'ONI-PS-Personal Support':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_PersonalSupport]  '])
              }else{columnNames = (['ONI.[PP_PersonalSupport]  '])}
                      break;
              case 'ONI-PS-Personal Support Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['NI.[PP_PersonalSupportComments]  '])
              }else{columnNames = (['NI.[PP_PersonalSupportComments]  '])}
                      break;
              case 'ONI-PS-Keep Friendships':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_Relationships_KeepUp]  '])
              }else{columnNames = (['ONI.[PP_Relationships_KeepUp]  '])}
                      break;
              case 'ONI-PS-Problems Interacting':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_Relationships_Problem]  '])
              }else{columnNames = (['ONI.[PP_Relationships_Problem]  '])}
                      break;
              case 'ONI-PS-Family/Relationship Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_RelationshipsComments]  '])
              }else{columnNames = (['ONI.[PP_RelationshipsComments]  '])}
                      break;
              case 'ONI-PS-Svc Prvdr Relations':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_Relationships_SP]  '])
              }else{columnNames = (['ONI.[PP_Relationships_SP]  '])}
                      break;
              case 'ONI-PS-Svc Prvdr Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[PP_Relationships_SPComments]  '])
              }else{columnNames = (['ONI.[PP_Relationships_SPComments]  '])}
                      break;
//ONI-Health Behaviours Profile                      
              case 'ONI-HB-Regular Health Checks':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_HealthChecks]  '])
              }else{columnNames = (['ONI.[HBP_HealthChecks]  '])}
                      break;
              case 'ONI-HB-Last Health Check':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_HealthChecks_Last]  '])
              }else{columnNames = (['ONI.[HBP_HealthChecks_Last]  '])}
                      break;                                    
              case 'ONI-HB-Health Screens':
                var healthscreen = " Convert(nVarChar(4000), ONI.[HBP_HealthChecks_List]) "
                  if(columnNames != []){
                columnNames = columnNames.concat([healthscreen+'  '])
              }else{columnNames = ([healthscreen+'  '])}
                      break;
              case 'ONI-HB-Smoking':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Smoking]  '])
              }else{columnNames = (['ONI.[HBP_Smoking]  '])}
                      break;
              case 'ONI-HB-If Quit Smoking - When?':
                if(columnNames != []){
              columnNames = columnNames.concat(['ONI.[HBP_Smoking_Quit]  '])
              }else{columnNames = (['ONI.[HBP_Smoking_Quit]  '])}
                    break;
              case 'ONI-HB-Alchohol-How often?':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Alchohol]  '])
              }else{columnNames = (['ONI.[HBP_Alchohol]  '])}
                      break;
              case 'ONI-HB-Alchohol-How many?':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Alchohol_NoDrinks]  '])
              }else{columnNames = (['ONI.[HBP_Alchohol_NoDrinks]  '])}
                      break;
              case 'ONI-HB-Alchohol-How often over 6?':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Alchohol_BingeNo]  '])
              }else{columnNames = (['ONI.[HBP_Alchohol_BingeNo]  '])}
                      break;
              case 'ONI-HB-Lost Weight':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Malnutrition_LostWeight]  '])
              }else{columnNames = (['ONI.[HBP_Malnutrition_LostWeight]  '])}
                      break;
              case 'ONI-HB-Eating Poorly':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Malnutrition_PoorEating]  '])
              }else{columnNames = (['ONI.[HBP_Malnutrition_PoorEating]  '])}
                      break;
              case 'ONI-HB-How much wieght lost':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Malnutrition_LostWeightAmount]  '])
              }else{columnNames = (['ONI.[HBP_Malnutrition_LostWeightAmount]  '])}
                      break;
              case 'ONI-HB-Malnutrition Score':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Malnutrition_Score]  '])
              }else{columnNames = (['ONI.[HBP_Malnutrition_Score]  '])}
                      break;
              case 'ONI-HB-8 cups fluid':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Hydration_AdequateFluid]  '])
              }else{columnNames = (['ONI.[HBP_Hydration_AdequateFluid]  '])}
                      break;
              case 'ONI-HB-Recent decrease in fluid':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Hydration_DecreasedFluid]  '])
              }else{columnNames = (['ONI.[HBP_Hydration_DecreasedFluid]  '])}
                      break;
              case 'ONI-HB-Weight':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Weight]  '])
              }else{columnNames = (['ONI.[HBP_Weight]  '])}
                      break;
              case 'ONI-HB-Physical Activity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_PhysicalActivity]  '])
              }else{columnNames = (['ONI.[HBP_PhysicalActivity]  '])}
                      break;
              case 'ONI-HB-Physical Fitness':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_PhysicalFitness]  '])
              }else{columnNames = (['ONI.[HBP_PhysicalFitness]  '])}
                      break;
              case 'ONI-HB-Fitness Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[HBP_Comments]  '])
              }else{columnNames = (['ONI.[HBP_Comments]  '])}
                      break;
//ONI-CP-Need for carer     
              case 'ONI-CP-Need for carer':
                if(columnNames != []){
                  columnNames = columnNames.concat(['ONI.[C_General_NeedForCarer]  '])
                }else{columnNames = (['ONI.[C_General_NeedForCarer]  '])}
                        break;                                       
              case 'ONI-CP-Carer Availability':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[CarerAvailability]  '])
              }else{columnNames = (['R.[CarerAvailability]  '])}
                      break;                            
              case 'ONI-CP-Carer Residency Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[CarerResidency]  '])
              }else{columnNames = (['R.[CarerResidency]  '])}
                      break;
              case 'ONI-CP-Carer Relationship':
                  if(columnNames != []){
                columnNames = columnNames.concat(['R.[CarerRelationship]  '])
              }else{columnNames = (['R.[CarerRelationship]  '])}
                      break;
              case 'ONI-CP-Carer has help':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Support_Help]  '])
              }else{columnNames = (['ONI.[C_Support_Help]  '])}
                      break;
              case 'ONI-CP-Carer receives payment':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Support_Allowance]  '])
              }else{columnNames = (['ONI.[C_Support_Allowance]  '])}
                      break;
              case 'ONI-CP-Carer made aware support services':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Support_Information]  '])
              }else{columnNames = (['ONI.[C_Support_Information]  '])}
                      break;        
              case 'ONI-CP-Carer needs training':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Support_NeedTraining]  '])
              }else{columnNames = (['ONI.[C_Support_NeedTraining]  '])}
                      break;
              case 'ONI-CP-Carer threat-emotional':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Threats_Emotional]  '])
              }else{columnNames = (['ONI.[C_Threats_Emotional]  '])}
                      break;
              case 'ONI-CP-Carer threat-acute physical':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Threats_Physical]  '])
              }else{columnNames = (['ONI.[C_Threats_Physical]  '])}
                      break;
              case 'ONI-CP-Carer threat-slow physical':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Threats_Physical_Slow]  '])
              }else{columnNames = (['ONI.[C_Threats_Physical_Slow]  '])}
                      break;
              case 'ONI-CP-Carer threat-other factors':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Threats_Unrelated]  '])
              }else{columnNames = (['ONI.[C_Threats_Unrelated]  '])}
                      break;
              case 'ONI-CP-Carer threat-increasing consumer needs':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Threats_ConsumerNeeds]  '])
              }else{columnNames = (['ONI.[C_Threats_ConsumerNeeds]  '])}
                      break;
              case 'ONI-CP-Carer threat-other comsumer factors':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Threats_ConsumerOther]  '])
              }else{columnNames = (['ONI.[C_Threats_ConsumerOther]  '])}
                      break;
              case 'ONI-CP-Carer arrangements sustainable':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Issues_Sustainability]  '])
              }else{columnNames = (['ONI.[C_Issues_Sustainability]  '])}
                      break;
              case 'ONI-CP-Carer Comments': 
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[C_Issues_Comments]  '])
              }else{columnNames = (['ONI.[C_Issues_Comments]  '])}
                      break;
//ONI-CS-Year of Arrival   

              case 'ONI-CS-Year of Arrival':
                if(columnNames != []){
              columnNames = columnNames.concat(['ONI.[CAL_ArrivalYear]  '])
              }else{columnNames = (['ONI.[CAL_ArrivalYear]  '])}
                    break;                   
              case 'ONI-CS-Citizenship Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_Citizenship]  '])
              }else{columnNames = (['ONI.[CAL_Citizenship]  '])}
                      break;
              case 'ONI-CS-Reasons for moving to Australia':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_ReasonsMoveAustralia]  '])
              }else{columnNames = (['ONI.[CAL_ReasonsMoveAustralia]  '])}
                      break;
              case 'ONI-CS-Primary/Secondary Language Fluency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_PrimSecLanguage]  '])
              }else{columnNames = (['ONI.[CAL_PrimSecLanguage]  '])}
                      break;
              case 'ONI-CS-Fluency in English':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_EnglishProf]  '])
              }else{columnNames = (['ONI.[CAL_EnglishProf]  '])}
                      break;
              case 'ONI-CS-Literacy in primary language':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_PrimaryLiteracy]  '])
              }else{columnNames = (['ONI.[CAL_PrimaryLiteracy]  '])}
                      break;
              case 'ONI-CS-Literacy in English':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_EnglishLiteracy]  '])
              }else{columnNames = (['ONI.[CAL_EnglishLiteracy]  '])}
                      break;
              case 'ONI-CS-Non verbal communication style':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_NonVerbalStyle]  '])
              }else{columnNames = (['ONI.[CAL_NonVerbalStyle]  '])}
                      break;
              case 'ONI-CS-Marital Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_Marital]  '])
              }else{columnNames = (['ONI.[CAL_Marital]  '])}
                      break;
              case 'ONI-CS-Religion':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_Religion]  '])
              }else{columnNames = (['ONI.[CAL_Religion]  '])}
                      break;
              case 'ONI-CS-Employment history in country of origin':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_EmploymentHistory]  '])
              }else{columnNames = (['ONI.[CAL_EmploymentHistory]  '])}
                      break;
              case 'ONI-CS-Employment history in Australia':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_EmploymentHistoryAust]  '])
              }else{columnNames = (['ONI.[CAL_EmploymentHistoryAust]  '])}
                      break;
                case 'ONI-CS-Specific dietary needs':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_DietaryNeeds]  '])
              }else{columnNames = (['ONI.[CAL_DietaryNeeds]  '])}
                      break;
                case 'ONI-CS-Specific cultural needs':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CAL_SpecificCulturalNeeds]  '])
              }else{columnNames = (['ONI.[CAL_SpecificCulturalNeeds]  '])}
                      break;            
              case 'ONI-CS-Someone to talk to for day to day problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_1]  '])
              }else{columnNames = (['ONI.[CALSocIsol_1]  '])}
                      break;
              case 'ONI-CS-Miss having close freinds':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_2]  '])
              }else{columnNames = (['ONI.[CALSocIsol_2]  '])}
                      break;                                            
              case 'ONI-CS-Experience general sense of emptiness':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_3]  '])
              }else{columnNames = (['ONI.[CALSocIsol_3]  '])}
                      break;
                case 'ONI-CS-Plenty of people to lean on for problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_4]  '])
              }else{columnNames = (['ONI.[CALSocIsol_4]  '])}
                      break;
                case 'ONI-CS-Miss the pleasure of the company of others':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_5]  '])
              }else{columnNames = (['ONI.[CALSocIsol_5]  '])}
                      break;
              case 'ONI-CS-Circle of friends and aquaintances too limited':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_6]  '])
              }else{columnNames = (['ONI.[CALSocIsol_6]  '])}
                      break;
              case 'ONI-CS-Many people I trust completely':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_7]  '])
              }else{columnNames = (['ONI.[CALSocIsol_7]  '])}
                      break;                                                           
              case 'ONI-CS-Enough people I feel close to':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_8]  '])
              }else{columnNames = (['ONI.[CALSocIsol_8]  '])}
                      break;
              case 'ONI-CS-Miss having people around':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_9]  '])
              }else{columnNames = (['ONI.[CALSocIsol_9]  '])}
                      break;
                case 'ONI-CS-Often feel rejected':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_10]  '])
              }else{columnNames = (['ONI.[CALSocIsol_10]  '])}
                      break;
                case 'ONI-CS-Can call on my friends whenever I need them':
                  if(columnNames != []){
                columnNames = columnNames.concat(['ONI.[CALSocIsol_11]  '])
              }else{columnNames = (['ONI.[CALSocIsol_11]  '])}
                      break;
//Loan Items                      
              case 'Loan Item Type':
                  if(columnNames != []){
                columnNames = columnNames.concat(['HRLoan.[Type]  '])
              }else{columnNames = (['HRLoan.[Type]  '])}
                      break;
              case 'Loan Item Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['HRLoan.[Name]  '])
              }else{columnNames = (['HRLoan.[Name]  '])}
                      break;
              case 'Loan Item Date Loaned/Installed':
                  if(columnNames != []){
                columnNames = columnNames.concat(['HRLoan.[Date1]  '])
              }else{columnNames = (['HRLoan.[Date1]  '])}
                      break;                      
              case 'Loan Item Date Collected':
                  if(columnNames != []){
                columnNames = columnNames.concat(['HRLoan.[Date2]  '])
              }else{columnNames = (['HRLoan.[Date2]  '])}
                      break;
 //  service information Fields                      
                case 'Staff Code':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Carer Code]  '])
              }else{columnNames = (['SvcDetail.[Carer Code]  '])}
                      break;
                case 'Service Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.Date  '])
              }else{columnNames = (['SvcDetail.Date  '])}
                      break;
              case 'Service Start Time':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Start Time]  '])
              }else{columnNames = (['SvcDetail.[Start Time]  '])}
                      break;
              case 'Service Code':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Service Type]  '])
              }else{columnNames = (['SvcDetail.[Service Type]  '])}
                      break;                      
              case 'Service Hours':
                  if(columnNames != []){
                columnNames = columnNames.concat(['(SvcDetail.[Duration]*5) / 60  '])
              }else{columnNames = (['(SvcDetail.[Duration]*5) / 60  '])}
                      break;
              case 'Service Pay Rate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Unit Pay Rate]  '])
              }else{columnNames = (['SvcDetail.[Unit Pay Rate]  '])}
                      break;
                case 'Service Bill Rate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Unit Bill Rate]  '])
              }else{columnNames = (['SvcDetail.[Unit Bill Rate]  '])}
                      break;
                case 'Service Bill Qty':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[BillQty]  '])
              }else{columnNames = (['SvcDetail.[BillQty]  '])}
                      break;
              case 'Service Location/Activity Group':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[ServiceSetting]  '])
              }else{columnNames = (['SvcDetail.[ServiceSetting]  '])}
                      break;
              case 'Service Program':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Program]  '])
              }else{columnNames = (['SvcDetail.[Program]  '])}
                      break;
              case 'Service Group':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Type]  '])
              }else{columnNames = (['SvcDetail.[Type]  '])}
                      break;
              case 'Service HACCType': 
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[HACCType]  '])
              }else{columnNames = (['SvcDetail.[HACCType]  '])}
                      break;
                case 'Service Category':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Anal]  '])
              }else{columnNames = (['SvcDetail.[Anal]  '])}
                      break;
                case 'Service Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Status]  '])
              }else{columnNames = (['SvcDetail.[Status]  '])}
                      break;
              case 'Service Pay Type':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[Service Description]  '])
              }else{columnNames = (['SvcDetail.[Service Description]  '])}
                      break;
              case 'Service Pay Qty':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcDetail.[CostQty]  '])
              }else{columnNames = (['SvcDetail.[CostQty]  '])}
                      break;
              case 'Service End Time/ Shift End Time':
                var endtime = " Convert(varchar,DATEADD(minute,(SvcDetail.[Duration]*5) ,SvcDetail.[Start Time]),108) "
                  if(columnNames != []){
                columnNames = columnNames.concat([endtime+'  '])
              }else{columnNames = ([endtime+'  '])}
                      break;
              case 'Service Funding Source':
                  if(columnNames != []){
                columnNames = columnNames.concat(['Humanresourcetypes.[Type]  '])
              }else{columnNames = (['Humanresourcetypes.[Type]  '])}
                      break;  
                case 'Service Notes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CAST(History.Detail AS varchar(4000))  '])
              }else{columnNames = (['CAST(History.Detail AS varchar(4000))  '])}
                      break;
//Service Specific Competencies           
                case 'Activity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcSpecCompetency.[Group]  '])
              }else{columnNames = (['SvcSpecCompetency.[Group]  '])}
                      break;
              case 'Competency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['SvcSpecCompetency.[Name]  '])
              }else{columnNames = (['SvcSpecCompetency.[Name]  '])}
                      break;
              case 'SS Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  '])
              }else{columnNames = (['  '])}
                      break;
//  RECIPIENT OP NOTES                      
              case 'OP Notes Date':
                var notesdate = " format(CONVERT(datetime,[DetailDate],102),'dd/MM/yyyy') "
                  if(columnNames != []){
                columnNames = columnNames.concat([notesdate +' '])
              }else{columnNames = ([notesdate +' '])}
                      break;
              case 'OP Notes Detail':
                  if(columnNames != []){
                columnNames = columnNames.concat(['dbo.RTF2TEXT(OPHistory.[Detail])  '])
              }else{columnNames = (['dbo.RTF2TEXT(OPHistory.[Detail])  '])}
                      break;
                case 'OP Notes Creator':
                  if(columnNames != []){
                columnNames = columnNames.concat(['OPHistory.[Creator]  '])
              }else{columnNames = (['OPHistory.[Creator]  '])}
                      break;                                              
              case 'OP Notes Alarm':
                  if(columnNames != []){
                columnNames = columnNames.concat(['OPHistory.[AlarmDate]  '])
              }else{columnNames = (['OPHistory.[AlarmDate]  '])}
                      break;
              case 'OP Notes Program':
                  if(columnNames != []){
                columnNames = columnNames.concat(['OPHistory.[Program]  '])
              }else{columnNames = (['OPHistory.[Program]  '])}
                      break;
              case 'OP Notes Category':
                var NotesCategory = " CASE WHEN IsNull(OPHistory.ExtraDetail2,'') < 'A' THEN 'UNKNOWN' ELSE OPHistory.ExtraDetail2 END "                
                  if(columnNames != []){
                columnNames = columnNames.concat([NotesCategory + '  '])
              }else{columnNames = ([NotesCategory +'  '])}
                      break;
// RECIPIENT CLINICAL NOTES                      
              case 'Clinical Notes Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CliniHistory.[DetailDate]  '])
              }else{columnNames = (['CliniHistory.[DetailDate]  '])}
                      break;
              case 'Clinical Notes Detail':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CliniHistory.[Detail])  '])
              }else{columnNames = (['CliniHistory.[Detail])  '])}
                      break;
              case 'Clinical Notes Creator':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CliniHistory.[Creator]  '])
              }else{columnNames = (['CliniHistory.[Creator]  '])}
                      break;
                      
              case 'Clinical Notes Alarm':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CliniHistory.[AlarmDate]  '])
              }else{columnNames = (['CliniHistory.[AlarmDate]  '])}
                      break;
              case 'Clinical Notes Category':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CliniHistory.[ExtraDetail2]  '])
              }else{columnNames = (['CliniHistory.[ExtraDetail2]  '])}
                      break;
// RECIPIENT INCIDENTS                      
              case 'INCD_Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Status  '])
              }else{columnNames = (['IMM.Status  '])}
                      break;
              case 'INCD_Date':
                  if(columnNames != []){
                    var incdDate = " format(CONVERT(datetime,IMM.Date,102),'dd/MM/yyyy') "
                columnNames = columnNames.concat([incdDate + '  '])
              }else{columnNames = ([incdDate +'  '])}
                      break;
              case 'INCD_Type':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.[Type]  '])
              }else{columnNames = (['IMM.[Type]  '])}
                      break;
              case 'INCD_Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.ShortDesc  '])
              }else{columnNames = (['IMM.ShortDesc  '])}
                      break;
              case 'INCD_SubCategory':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.PerpSpecify  '])
              }else{columnNames = (['IMM.PerpSpecify  '])}
                      break;
              case 'INCD_Assigned_To':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.CurrentAssignee  '])
              }else{columnNames = (['IMM.CurrentAssignee  '])}
                      break;         
              case 'INCD_Service':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Service  '])
              }else{columnNames = (['IMM.Service  '])}
                      break;
              case 'INCD_Severity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Severity  '])
              }else{columnNames = (['IMM.Severity  '])}
                      break;
                case 'INCD_Time':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Time  '])
              }else{columnNames = (['IMM.Time  '])}
                      break;
                case 'INCD_Duration':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Duration  '])
              }else{columnNames = (['IMM.Duration  '])}
                      break;
              case 'INCD_Location':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Location  '])
              }else{columnNames = (['IMM.Location  '])}
                      break;
              case 'INCD_LocationNotes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.LocationNotes)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.LocationNotes)  '])}
                      break;
              case 'INCD_ReportedBy':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.ReportedBy  '])
              }else{columnNames = (['IMM.ReportedBy  '])}
                      break;
              case 'INCD_DateReported':
                  if(columnNames != []){
                columnNames = columnNames.concat(['Convert(varchar,IMM.DateReported,111)  '])
              }else{columnNames = (['Convert(varchar,IMM.DateReported,111)  '])}
                      break;
                case 'INCD_Reported':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Reported  '])
              }else{columnNames = (['IMM.Reported  '])}
                      break;
                case 'INCD_FullDesc':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.FullDesc)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.FullDesc)  '])}
                      break;
              case 'INCD_Program':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Program  '])
              }else{columnNames = (['IMM.Program  '])}
                      break;
              case 'INCD_DSCServiceType':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.DSCServiceType  '])
              }else{columnNames = (['IMM.DSCServiceType  '])}
                      break;
              case 'INCD_TriggerShort':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.TriggerShort  '])
              }else{columnNames = (['IMM.TriggerShort  '])}
                      break;
              case 'INCD_incident_level':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.incident_level  '])
              }else{columnNames = (['IMM.incident_level  '])}
                      break;
                case 'INCD_Area':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.area  '])
              }else{columnNames = (['IMM.area  '])}
                      break;
                case 'INCD_Region':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Region  '])
              }else{columnNames = (['IMM.Region  '])}
                      break;
              case 'INCD_position':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.position  '])
              }else{columnNames = (['IMM.position  '])}
                      break;
              case 'INCD_phone':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.phone  '])
              }else{columnNames = (['IMM.phone  '])}
                      break;
              case 'INCD_verbal_date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['Convert(varchar,IMM.verbal_date,111)  '])
              }else{columnNames = (['Convert(varchar,IMM.verbal_date,111)  '])}
                      break;
              case 'INCD_verbal_time':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.verbal_time  '])
              }else{columnNames = (['IMM.verbal_time  '])}
                      break;
                case 'INCD_By_Whome':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.By_Whome  '])
              }else{columnNames = (['IMM.By_Whome  '])}
                      break;
                case 'INCD_To_Whome':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.To_Whome  '])
              }else{columnNames = (['IMM.To_Whome  '])}
                      break;
              case 'INCD_BriefSummary':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.BriefSummary  '])
              }else{columnNames = (['IMM.BriefSummary  '])}
                      break;
              case 'INCD_ReleventBackground':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.ReleventBackground)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.ReleventBackground)  '])}
                      break;
              case 'INCD_SummaryofAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.SummaryofAction)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.SummaryofAction)  '])}
                      break;
              case 'INCD_SummaryOfOtherAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.SummaryOfOtherAction)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.SummaryOfOtherAction)  '])}
                      break;
                case 'INCD_Triggers':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.Triggers)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.Triggers)  '])}
                      break;
                case 'INCD_InitialAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.InitialAction  '])
              }else{columnNames = (['IMM.InitialAction  '])}
                      break;
              case 'INCD_InitialNotes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.InitialNotes)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.InitialNotes)  '])}
                      break;
              case 'INCD_InitialFupBy':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.InitialFupBy  '])
              }else{columnNames = (['IMM.InitialFupBy  '])}
                      break;
              case 'INCD_Completed':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Completed  '])
              }else{columnNames = (['IMM.Completed  '])}
                      break;
              case 'INCD_OngoingAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.OngoingAction  '])
              }else{columnNames = (['IMM.OngoingAction  '])}
                      break;
                case 'INCD_OngoingNotes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.OngoingNotes)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.OngoingNotes)  '])}
                      break;
                case 'INCD_Background':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.Background)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.Background)  '])}
                      break;
              case 'INCD_Abuse':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Abuse  '])
              }else{columnNames = (['IMM.Abuse  '])}
                      break;
              case 'INCD_DOPWithDisability':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.DOPWithDisability  '])
              }else{columnNames = (['IMM.DOPWithDisability  '])}
                      break;
              case 'INCD_SeriousRisks':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.SeriousRisks  '])
              }else{columnNames = (['IMM.SeriousRisks  '])}
                      break;
              case 'INCD_Complaints':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Complaints  '])
              }else{columnNames = (['IMM.Complaints  '])}
                      break;                                   
                case 'INCD_Perpetrator':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Perpetrator  '])
              }else{columnNames = (['IMM.Perpetrator  '])}
                      break;
                case 'INCD_Notify':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Notify  '])
              }else{columnNames = (['IMM.Notify  '])}
                      break;
              case 'INCD_NoNotifyReason':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.NoNotifyReason)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.NoNotifyReason)  '])}
                      break;
              case 'INCD_Notes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['CONVERT(varchar(1000),IMM.Notes)  '])
              }else{columnNames = (['CONVERT(varchar(1000),IMM.Notes)  '])}
                      break;
              case 'INCD_Setting':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMM.Setting  '])
              }else{columnNames = (['IMM.Setting  '])}
                      break;
              case 'INCD_Involved_Staff':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IMI.Staff#  '])
              }else{columnNames = (['IMI.Staff#  '])}
                      break;
//  Recipient Competencies                      
                case 'Recipient Competency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['RecpCompet.Name  '])
              }else{columnNames = (['RecpCompet.Name  '])}
                      break;
                case 'Recipient Competency Mandatory':
                  if(columnNames != []){
                columnNames = columnNames.concat(['RecpCompet.Recurring  '])
              }else{columnNames = (['RecpCompet.Recurring  '])}
                      break;
              case 'Recipient Competency Notes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['RecpCompet.[Notes]  '])
              }else{columnNames = (['RecpCompet.[Notes]  '])}
                      break;
//Care Plan                      
              case 'CarePlan ID':
                  if(columnNames != []){
                columnNames = columnNames.concat(['D.Doc#  '])
              }else{columnNames = (['D.Doc#  '])}
                      break;
              case 'CarePlan Name':
                  if(columnNames != []){
                columnNames = columnNames.concat(['D.Title  '])
              }else{columnNames = (['D.Title  '])}
                      break;
              case 'CarePlan Type':
                var careplantype = " (SELECT Description FROM DataDomains Left join DOCUMENTS D on  DataDomains.RecordNumber = D.SubId) "
                  if(columnNames != []){
                columnNames = columnNames.concat([careplantype +'  '])
              }else{columnNames = ([careplantype +'  '])}
                      break;                      
                case 'CarePlan Program':
                  var careplanprogram = " SELECT [Name] FROM HumanResourceTypes WHERE HumanResourceTypes.RecordNumber = D.Department AND [Group] = 'PROGRAMS' "
                  if(columnNames != []){
                columnNames = columnNames.concat([careplanprogram +'  '])
              }else{columnNames = ([careplanprogram +'  '])}
                      break;                  
                case 'CarePlan Discipline':
                  var careplandescipline = " SELECT [Description] FROM DataDomains WHERE DataDomains.RecordNumber = D.DPID "
                  if(columnNames != []){
                columnNames = columnNames.concat([careplandescipline + '  '])
              }else{columnNames = ([careplandescipline +'  '])}
                      break;
              case 'CarePlan CareDomain':
                var careplandomain = " SELECT [Description] FROM DataDomains WHERE DataDomains.RecordNumber = D.CareDomain "
                  if(columnNames != []){
                columnNames = columnNames.concat([careplandomain + '  '])
              }else{columnNames = ([careplandomain + '  '])}
                      break;
              case 'CarePlan StartDate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['D.DocStartDate  '])
              }else{columnNames = (['D.DocStartDate  '])}
                      break;
              case 'CarePlan SignOffDate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['D.DocEndDate  '])
              }else{columnNames = (['D.DocEndDate  '])}
                      break;
              case 'CarePlan ReviewDate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['D.AlarmDate  '])
              }else{columnNames = (['D.AlarmDate  '])}
                      break;
                case 'CarePlan ReminderText':
                  if(columnNames != []){
                columnNames = columnNames.concat(['D.AlarmText  '])
              }else{columnNames = (['D.AlarmText  '])}
                      break;
                case 'CarePlan Archived':
                  if(columnNames != []){
                columnNames = columnNames.concat(['IsNull(D.DeletedRecord,0)  '])
              }else{columnNames = (['IsNull(D.DeletedRecord,0)  '])}
                      break;
//Mental Health                       
              case 'MH-PERSONID':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[PERSONID]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[PERSONID]  '])}
                      break;
              case 'MH-HOUSING TYPE ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[HOUSING TYPE ON REFERRAL]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[HOUSING TYPE ON REFERRAL]  '])}
                      break;
              case 'MH-RE REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[RE REFERRAL]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[RE REFERRAL]  '])}
                      break;
              case 'MH-REFERRAL SOURCE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[REFERRAL SOURCE]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[REFERRAL SOURCE]  '])}
                      break;
                case 'MH-REFERRAL RECEIVED DATE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[REFERRAL RECEIVED DATE]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[REFERRAL RECEIVED DATE]  '])}
                      break;
                case 'MH-ENGAGED AND CONSENT DATE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ENGAGED AND CONSENT DATE]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ENGAGED AND CONSENT DATE]  '])}
                      break;
              case 'MH-OPEN TO HOSPITAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[OPEN TO HOSPITAL]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[OPEN TO HOSPITAL]  '])}
                      break;                
              case 'MH-OPEN TO HOSPITAL DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[OPEN TO HOSPITAL DETAILS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[OPEN TO HOSPITAL DETAILS]  '])}
                      break;
              case 'MH-ALERTS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ALERTS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ALERTS]  '])}
                      break;
              case 'MH-ALERTS DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ALERTS DETAILS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ALERTS DETAILS]  '])}
                      break;
                case 'MH-MH DIAGNOSIS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[MH DIAGNOSIS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[MH DIAGNOSIS]  '])}
                      break;
                case 'MH-MEDICAL DIAGNOSIS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[MEDICAL DIAGNOSIS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[MEDICAL DIAGNOSIS]  '])}
                      break;
              case 'MH-REASONS FOR EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[REASONS FOR EXIT]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[REASONS FOR EXIT]  '])}
                      break;
              case 'MH-SERVICES LINKED INTO':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[SERVICES LINKED INTO]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[SERVICES LINKED INTO]  '])}
                      break;
              case 'MH-NON ACCEPTED REASONS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[NON ACCEPTED REASONS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[NON ACCEPTED REASONS]  '])}
                      break;
              case 'MH-NOT PROCEEDED':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[NOT PROCEEDED]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[NOT PROCEEDED]  '])}
                      break;               
                case 'MH-DISCHARGE DATE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[DISCHARGE DATE]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[DISCHARGE DATE]  '])}
                      break;
                case 'MH-CURRENT AOD':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[CURRENT AOD]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[CURRENT AOD]  '])}
                      break;
              case 'MH-CURRENT AOD DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[CURRENT AOD DETAILS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[CURRENT AOD DETAILS]  '])}
                      break;
              case 'MH-PAST AOD':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[PAST AOD]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[PAST AOD]  '])}
                      break;
              case 'MH-PAST AOD DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[PAST AOD DETAILS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[PAST AOD DETAILS]  '])}
                      break;
              case 'MH-ENGAGED AOD':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ENGAGED AOD]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ENGAGED AOD]  '])}
                      break;
                case 'MH-ENGAGED AOD DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ENGAGED AOD DETAILS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ENGAGED AOD DETAILS]  '])}
                      break;
                case 'MH-SERVICES CLIENT IS LINKED WITH ON INTAKE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[SERVICES CLIENT IS LINKED WITH ON INTAKE]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[SERVICES CLIENT IS LINKED WITH ON INTAKE]  '])}
                      break;
              case 'MH-SERVICES CLIENT IS LINKED WITH ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[SERVICES CLIENT IS LINKED WITH ON EXIT]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[SERVICES CLIENT IS LINKED WITH ON EXIT]  '])}
                      break;
              case 'MH-ED PRESENTATIONS ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ED PRESENTATIONS ON REFERRAL]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ED PRESENTATIONS ON REFERRAL]  '])}
                      break;               
              case 'MH-ED PRESENTATIONS ON 3 MONTH REVIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ED PRESENTATIONS ON 3 MONTH REVIEW]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ED PRESENTATIONS ON 3 MONTH REVIEW]  '])}
                      break;
              case 'MH-ED PRESENTATIONS ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ED PRESENTATIONS ON EXIT]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ED PRESENTATIONS ON EXIT]  '])}
                      break;
                case 'MH-AMBULANCE ARRIVAL ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON REFERRAL]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON REFERRAL]  '])}
                      break;
                case 'MH-AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW]  '])}
                      break;
              case 'MH-AMBULANCE ARRIVAL ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON EXIT]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[AMBULANCE ARRIVAL ON EXIT]  '])}
                      break;
              case 'MH-ADMISSIONS ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ADMISSIONS ON REFERRAL]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ADMISSIONS ON REFERRAL]  '])}
                      break;
                      case 'MH-ADMISSIONS ON MID-3 MONTH REVIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ADMISSIONS ON MID- 3 MONTH REVIEW]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ADMISSIONS ON MID- 3 MONTH REVIEW]  '])}
                      break;
              case 'MH-ADMISSIONS TO ED ON TIME OF EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[ADMISSIONS TO ED ON TIME OF EXIT]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[ADMISSIONS TO ED ON TIME OF EXIT]  '])}
                      break;                  
                case 'MH-RESIDENTIAL MOVES':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[RESIDENTIAL MOVES]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[RESIDENTIAL MOVES]  '])}
                      break;
                case 'MH-DATE OF RESIDENTIAL CHANGE OF ADDRESS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[DATE OF RESIDENTIAL CHANGE OF ADDRESS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[DATE OF RESIDENTIAL CHANGE OF ADDRESS]  '])}
                      break;
              case 'MH-LOCATION OF NEW ADDRESS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[LOCATION OF NEW ADDRESS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[LOCATION OF NEW ADDRESS]  '])}
                      break;
              case 'MH-HOUSING TYPE ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[HOUSING TYPE ON EXIT]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[HOUSING TYPE ON EXIT]  '])}
                      break;
              case 'MH-KPI - INTAKE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KPI - INTAKE]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KPI - INTAKE]  '])}
                      break;
              case 'MH-KPI - 3 MONTH REVEIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KPI - 3 MONTH REVEIEW]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KPI - 3 MONTH REVEIEW]  '])}
                      break;
                case 'MH-KPI - EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KPI - EXIT]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KPI - EXIT]  '])}
                      break;
                case 'MH-MEDICAL DIAGNOSIS DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[MEDICAL DIAGNOSIS DETAILS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[MEDICAL DIAGNOSIS DETAILS]  '])}
                      break;
              case 'MH-SERVICES LINKED DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[SERVICES LINKED DETAILS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[SERVICES LINKED DETAILS]  '])}
                      break;
              case 'MH-NDIS TYPE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[NDIS TYPE]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[NDIS TYPE]  '])}
                      break;
              case 'MH-NDIS TYPE COMMENTS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[NDIS TYPE COMMENTS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[NDIS TYPE COMMENTS]  '])}
                      break;
              case 'MH-NDIS NUMBER':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[NDIS NUMBER]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[NDIS NUMBER]  '])}
                      break;
                case 'MH-REVIEW APPEAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[REVIEW APPEAL]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[REVIEW APPEAL]  '])}
                      break;
                case 'MH-REVIEW COMMENTS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[REVIEW COMMENTS]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[REVIEW COMMENTS]  '])}
                      break;
              case 'MH-KP_Intake_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_1]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_1]  '])}
                      break;
              case 'MH-KP_Intake_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_2]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_2]  '])}
                      break;                     
              case 'MH-KP_Intake_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_3M]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_3M]  '])}
                      break;                                   
              case 'MH-KP_Intake_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_3P]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_3P] '])}
                      break;
                case 'MH-KP_Intake_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_4]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_4]  '])}
                      break;
                case 'MH-KP_Intake_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_5]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_5]  '])}
                      break;
              case 'MH-KP_Intake_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_6]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_6]  '])}
                      break;
              case 'MH-KP_Intake_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_7]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_7]  '])}
                      break;
              case 'MH-KP_3Months_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_1]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_1]  '])}
                      break;
              case 'MH-KP_3Months_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_2]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_2]  '])}
                      break;
                case 'MH-KP_3Months_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_3M]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_3M]  '])}
                      break;
                case 'MH-KP_3Months_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_3P]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_3P]  '])}
                      break;
              case 'MH-KP_3Months_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_4]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_4]  '])}
                      break;
              case 'MH-KP_3Months_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_5]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_5]  '])}
                      break;
              case 'MH-KP_3Months_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_6]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_6]  '])}
                      break;
              case 'MH-KP_3Months_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_7]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_7]  '])}
                      break;
                case 'MH-KP_6Months_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_1]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_1]  '])}
                      break;
                case 'MH-KP_6Months_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_2]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_2]  '])}
                      break;
              case 'MH-KP_6Months_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_3M]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_3M]  '])}
                      break;
              case 'MH-KP_6Months_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_3P]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_3P]  '])}
                      break;
              case 'MH-KP_6Months_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_4]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_4]  '])}
                      break;
              case 'MH-KP_6Months_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_5]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_5]  '])}
                      break;
                case 'MH-KP_6Months_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_6]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_6]  '])}
                      break;
                case 'MH-KP_6Months_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_7]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_7]  '])}
                      break;
              case 'MH-KP_9Months_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_1]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_1]  '])}
                      break;
              case 'MH-KP_9Months_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_2]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_2]  '])}
                      break;
              case 'MH-KP_9Months_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_3M]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_3M]  '])}
                      break;
              case 'MH-KP_9Months_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_3P]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_3P]  '])}
                      break;
                case 'MH-KP_9Months_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_4]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_4]  '])}
                      break;
                case 'MH-KP_9Months_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_5]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_5]  '])}
                      break;
              case 'MH-KP_9Months_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_6]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_6]  '])}
                      break;
              case 'MH-KP_9Months_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_7]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_7]  '])}
                      break;
              case 'MH-KP_Exit_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_1]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_1]  '])}
                      break;
              case 'MH-KP_Exit_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_2]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_2]  '])}
                      break;
                case 'MH-KP_Exit_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_3M]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_3M]  '])}
                      break;
                case 'MH-KP_Exit_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_3P]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_3P]  '])}
                      break;
              case 'MH-KP_Exit_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_4]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_4]  '])}
                      break;                        
              case 'MH-KP_Exit_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_5]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_5]  '])}
                      break;
              case 'MH-KP_Exit_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_6]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_6]  '])}
                      break;
              case 'MH-KP_Exit_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_7]  '])
              }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_7]  '])}
                      break;
                case 'MH-KP_Intake_DATE':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_IN_DATE]  '])
                  }else{columnNames = (['MENTALHEALTHDATASET.[KP_IN_DATE]  '])}  
                      break;
                case 'MH-KP_3Months_DATE':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_3_DATE]  '])
                  }else{columnNames = (['MENTALHEALTHDATASET.[KP_3_DATE]  '])}  
                      break;
              case 'MH-KP_6Months_DATE':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_6_DATE]  '])
                }else{columnNames = (['MENTALHEALTHDATASET.[KP_6_DATE]  '])}
                      break;
              case 'MH-KP_9Months_DATE':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_9_DATE]  '])
                }else{columnNames = (['MENTALHEALTHDATASET.[KP_9_DATE]  '])}  
                      break;
              case 'MH-KP_Exit_DATE':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['MENTALHEALTHDATASET.[KP_EX_DATE]  '])
                }else{columnNames = (['MENTALHEALTHDATASET.[KP_EX_DATE]  '])}
                      break;
//Recipient Placements                      
              case 'Placement Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['HRPlacements.[Type]  '])
                }else{columnNames = (['HRPlacements.[Type]  '])} 
                      break;
                case 'Placement Carer Name':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['HRPlacements.[Name]  '])
                  }else{columnNames = (['HRPlacements.[Name]  '])}
                      break;
                case 'Placement Start':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['HRPlacements.[Date1]  '])
                  }else{columnNames = (['HRPlacements.[Date1]  '])}  
                      break;
              case 'Placement End':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['HRPlacements.[Date2]  '])
                }else{columnNames = (['HRPlacements.[Date2]  '])}  
                      break;
              case 'Placement Referral':
                var placementrefferal = " CASE HRPlacements.[Recurring]  WHEN 1 THEN 'True' else 'False' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([placementrefferal + '  '])
                }else{columnNames = ([placementrefferal + '  '])}  
                      break;        
              case 'Placement ATC':
                var placementATC = " CASE HRPlacements.[Completed]  WHEN 1 THEN 'True' else 'False' END "
                  if(columnNames != []){
                  columnNames = columnNames.concat([placementATC +'  '])
                }else{columnNames = ([placementATC + '  '])} 
                      break;
                case 'Placement Notes':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['HRPlacements.[Notes]  '])
                  }else{columnNames = (['HRPlacements.[Notes]  '])} 
                      break;
//Quote Goals and stratagies                      
                case 'Quote Goal':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['GOALS.User1  '])
                  }else{columnNames = (['GOALS.User1  '])}  
                      break;
              case 'Goal Expected Completion Date':
                var GExpecCompletion = " Convert(varchar,GOALS.Date1,103) "
                  if(columnNames != []){
                  columnNames = columnNames.concat([GExpecCompletion + '  '])
                }else{columnNames = ([GExpecCompletion + '  '])}  
                      break;
              case 'Goal Last Review Date':
                var GlastReviewDate = " Convert(varchar,GOALS.Date2,103) "
                  if(columnNames != []){
                  columnNames = columnNames.concat([GlastReviewDate + '  '])
                }else{columnNames = ([GlastReviewDate + '  '])}
                      break;
              case 'Goal Completed Date':
                var GCompleteDate = " Convert(varchar,GOALS.DateInstalled,103) "
                  if(columnNames != []){
                  columnNames = columnNames.concat([GCompleteDate + '  '])
                }else{columnNames = ([GCompleteDate + '  '])} 
                      break;
                case 'Goal  Achieved':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['GOALS.[State]  '])
                  }else{columnNames = (['GOALS.[State]  '])}  
                      break;
                case 'Quote Strategy':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['STRATEGIES.Notes  '])
                  }else{columnNames = (['STRATEGIES.Notes  '])}
                      break;
              case 'Strategy Expected Outcome':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['STRATEGIES.Address1  '])
                }else{columnNames = (['STRATEGIES.Address1  '])}
                      break;
              case 'Strategy Contracted ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['STRATEGIES.[State]  '])
                }else{columnNames = (['STRATEGIES.[State]  '])}  
                      break;
              case 'Strategy DS Services':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['STRATEGIES.User1  '])
                }else{columnNames = (['STRATEGIES.User1  '])}  
                      break;


          default:
            break;
    }
    
  }
  }
  //console.log(columnNames)

  return columnNames;
}
Condition(fld){
  var columnNames:Array<any> = [];
  var temp = fld.join(',')
//  console.log(fld.length)
  for (var key of fld){
    
      columnNames = [key]
    
    
  }
//  columnNames = ['FirstName']
 /*switch (fld) {
   case 'First Name':
    columnNames = ['FirstName']
     break;
 
   default:
     break;
 } */

  return columnNames;
}
TablesSetting(arr){
  var FromSql ;
  //console.log(arr)
  if(this.RptFormat == "AGENCYSTFLIST" || this.RptFormat == "USERSTFLIST"){
    FromSql = " From Staff" 

    if( arr.includes("Contact Group") || arr.includes("Contact Email") || arr.includes("Contact FAX") || arr.includes("Contact Mobile") || arr.includes("Contact Type") || arr.includes("Contact Phone 2") || arr.includes("Contact Phone 1") || arr.includes("Contact Postcode") || arr.includes("Contact Suburb") || arr.includes("Contact Name")   || arr.includes("Contact Address") || arr.includes("Contact Sub Type")  || arr.includes("Contact User Flag")  || arr.includes("Contact Person Type") ){ 
      FromSql = FromSql + " left join HumanResources HR on Hr.PersonID = Staff.UniqueID "
      this.includeConatctWhere = " HR.[Group] IN ('NEXTOFKIN',  'CONTACT', 'CARER',  '1-NEXT OF KIN',  '2-CARER',  '3-MEDICAL',  '4-ALLIED HEALTH',  '5-HEALTH INSURANCE',  '6-POWER OF ATTORNEY',  '7-LEGAL OTHER',  '8-OTHER','ALLIED HEALTH',  'PHARMACIST',  'HOSPITAL',  'HEALTHINSURER',  'POWERATTORNEY',  'OTHERLEGAL',  'OTHERCONTACT',  'MANAGER',  'HUMAN RESOURCES',  'ACCOUNTS',  'PAYROLL',  'SALES',  'PURCHASING',  'OTHERCONTACT') OR  HR.[Group] IN  (SELECT DESCRIPTION FROM DataDomains WHERE DOMAIN IN ('CONTACTGROUP', 'CARER RELATIONSHIP')AND DATASET = 'USER') "
    }
    if(arr.includes("Group Email") || arr.includes("Group End Date") || arr.includes("Group Start Date") || arr.includes("Group Note") || arr.includes("Group Name") ){
      FromSql = FromSql + " left join HumanResources UserGroup on UserGroup.PersonID = Staff.UniqueID "    
      this.includeUserGroupWhere = " UserGroup.[Group] = 'RECIPTYPE' "
    }
    if(arr.includes("Preference Note") || arr.includes("Preference Name")){
      FromSql = FromSql + " left join HumanResources Prefr on Prefr.PersonID = Staff.UniqueID "    
      this.includePrefrencesWhere = " Prefr.[Group] = 'STAFFPREF' "
    }
    if(arr.includes("Reminder Detail") || arr.includes("Event Date") || arr.includes("Reminder Date") || arr.includes("Reminder Notes") ){
      FromSql = FromSql + " left join HumanResources Remind on Remind.PersonID = Staff.UniqueID "    
      this.includeReminderWhere = " Remind.[Group] = 'RECIPIENTALERT' "
    }
    if(arr.includes("Loan Item Date Collected") || arr.includes("Loan Item Date Loaned/Installed")  || arr.includes("Loan Item Description") || arr.includes("Loan Item Type") ){
      FromSql = FromSql + " left join HumanResources HRLoan on HRLoan.PersonID = Staff.UniqueID "    
      this.includeLoanitemWhere = " HRLoan.[Group] = 'LOANITEMS'  "
      }
      if(arr.includes("Staff Code") || arr.includes("Service Date")  || arr.includes("Service Start Time") || arr.includes("Service Code") || arr.includes("Service Hours") || arr.includes("Service Pay Rate")  || arr.includes("Service Bill Rate") || arr.includes("Service Bill Qty") || arr.includes("Service Location/Activity Group") 
    || arr.includes("Service Program")  || arr.includes("Service Group") || arr.includes("Service HACCType") || arr.includes("Service End Time/ Shift End Time")  || arr.includes("Service Pay Type") || arr.includes("Service Category") || arr.includes("Service Status") || arr.includes("Service Pay Qty") ){
      FromSql = FromSql + " INNER JOIN Roster SvcDetail ON Staff.accountno = SvcDetail.[client code]   "          
    }
    if(arr.includes("Service Funding Source")    ){
      FromSql = FromSql + " LEFT JOIN Humanresourcetypes ON SvcDetail.Program = HumanResourceTypes.Name  "
      }
    if(arr.includes("Service Notes")    ){
      FromSql = FromSql + " LEFT JOIN History ON CONVERT(varchar,SvcDetail.RecordNo,100) = History.PersonID  "
      this.includeSvnDetailNotesWhere = "   History.ExtraDetail1 = 'SVCNOTE'  "
      }      
      if(arr.includes("Competency") || arr.includes(   "Competency Expiry Date"   ) || arr.includes("Competency Reminder Date" ) || arr.includes(  "Competency Completion Date" ) || arr.includes(  "Mandatory Status"   ) || arr.includes("Certificate Number"   ) || arr.includes("Competency Notes" ) || arr.includes( "Staff Admin Categories" ) || arr.includes("NDIA Staff Level")    ){
        FromSql = FromSql + "  LEFT JOIN (SELECT personid,humanresources.[name] AS [Competency], humanresources.[date1] AS [Competency Expiry Date],humanresources.[date2] AS [Competency Reminder Date],humanresources.[dateinstalled] AS [Competency Completion Date],humanresources.[address1] AS [Certificate Number], humanresources.[recurring] AS [Mandatory Status], humanresources.[notes] AS [Competency Notes] FROM   humanresources WHERE  humanresources.[group] = 'STAFFATTRIBUTE') AS StaffAttribute ON staff.uniqueid = StaffAttribute.personid  "          
        //LEFT JOIN (SELECT personid,humanresources.[name],date1 AS [Start  Date], date2 AS [End Date], address1 AS [Position ID], notes FROM   humanresources WHERE  humanresources.[group] = 'STAFFPOSITION') AS StaffPosition ON staff.uniqueid = StaffPosition.personid
        }
      if(arr.includes("Staff Position") || arr.includes( "Position Start Date") || arr.includes(  "Position End Date" ) || arr.includes( "Position ID") || arr.includes(  "Position Notes")    ){
        FromSql = FromSql + " LEFT JOIN (SELECT personid,humanresources.[name],date1    AS [Start Date], date2    AS [End Date], address1 AS [Position ID], notes FROM   humanresources WHERE  humanresources.[group] = 'STAFFPOSITION') AS StaffPosition ON staff.uniqueid = StaffPosition.personid  "
        }
        if(arr.includes("INCD_Status") || arr.includes("INCD_Date") || arr.includes("INCD_TYpe") || arr.includes("INCD_Description") || arr.includes("INCD_SubCategory") || arr.includes("INCD_Assigned_To") || arr.includes("INCD_Service") || arr.includes("INCD_Severity") || arr.includes("INCD_Time") 
        || arr.includes("INCD_Duration") || arr.includes("INCD_Location") || arr.includes("INCD_LocationNotes") || arr.includes("INCD_ReportedBy") || arr.includes("INCD_DateReported") || arr.includes("INCD_Reported") || arr.includes("INCD_FullDesc") || arr.includes("INCD_Program") 
        || arr.includes("INCD_DSCServiceType") || arr.includes("INCD_TriggerShort") || arr.includes("INCD_level") || arr.includes("INCD_Area") || arr.includes("INCD_Region") || arr.includes("INCD_Position") || arr.includes("INCD_Phone") || arr.includes("INCD_Verbal_Date") || arr.includes("INCD_Verbal_Time") 
        || arr.includes("INCD_By_Whome") || arr.includes("INCD_To_Whome") || arr.includes("INCD_BriefSummary") || arr.includes("INCD_ReleventBackground") || arr.includes("INCD_SummaryOfAction") || arr.includes("INCD_SummaryOfOtherAction") || arr.includes("INCD_Triggers") || arr.includes("INCD_InitialAtion") 
        || arr.includes("INCD_InitialNotes") || arr.includes("INCD_InitialFupBy") || arr.includes("INCD_Completed") || arr.includes("INCD_OngoingAction") || arr.includes("INCD_OngoingNotes") || arr.includes("INCD_Background") || arr.includes("INCD_Abuse") || arr.includes("INCD_DOPwithDisability") 
        || arr.includes("INCD_SerousRisks") || arr.includes("INCD_Complaints") || arr.includes("INCD_Perpetrator") || arr.includes("INCD_Notify") || arr.includes("INCD_NoNotifyReason") || arr.includes("INCD_Notes") || arr.includes("INCD_Setting")){
          FromSql = FromSql + " LEFT JOIN (SELECT personid,imm.status AS incd_status,CONVERT(VARCHAR,imm.date,111) AS incd_date,imm.[Type] AS incd_type,imm.shortdesc AS incd_description,imm.perpspecify AS incd_subcategory,imm.currentassignee AS incd_assigned_to ,imm.service AS incd_service ,imm.severity AS incd_severity ,imm.time AS incd_time ,imm.duration AS incd_duration ,imm.location AS incd_location ,CONVERT(VARCHAR(1000),imm.locationnotes) AS incd_locationnotes ,imm.reportedby AS incd_reportedby ,CONVERT(VARCHAR,imm.datereported,111) AS incd_datereported ,imm.reported AS incd_reported ,CONVERT(VARCHAR(1000),imm.fulldesc) AS incd_fulldesc ,imm.program AS incd_program ,imm.dscservicetype AS incd_dscservicetype ,imm.triggershort AS incd_triggershort,imm.incident_level AS incd_incident_level ,imm.area AS incd_area ,imm.region AS incd_region ,imm.position AS incd_position ,imm.phone AS incd_phone ,CONVERT(VARCHAR,imm.verbal_date,111) AS incd_verbal_date ,imm.verbal_time AS incd_verbal_time ,imm.by_whome AS incd_by_whome ,imm.to_whome AS incd_to_whome ,imm.briefsummary AS incd_briefsummary ,CONVERT(VARCHAR(1000),imm.releventbackground) AS incd_releventbackground ,CONVERT(VARCHAR(1000),imm.summaryofaction) AS incd_summaryofaction ,CONVERT(varchar(1000),imm.summaryofotheraction) AS incd_summaryofotheraction ,CONVERT(varchar(1000),imm.triggers) AS incd_triggers ,imm.initialaction AS incd_initialaction ,CONVERT(varchar(1000),imm.initialnotes) AS incd_initialnotes ,imm.initialfupby AS incd_initialfupby ,imm.completed AS incd_completed ,imm.ongoingaction AS incd_ongoingaction ,CONVERT(varchar(1000),imm.ongoingnotes) AS incd_ongoingnotes ,CONVERT(varchar(1000),imm.background) AS incd_background ,imm.abuse AS incd_abuse ,imm.dopwithdisability AS incd_dopwithdisability ,imm.seriousrisks AS incd_seriousrisks ,imm.complaints AS incd_complaints ,imm.perpetrator AS incd_perpetrator ,imm.notify AS incd_notify ,CONVERT(varchar(1000),imm.nonotifyreason) AS incd_nonotifyreason ,CONVERT(varchar(1000),imm.notes) AS incd_notes , imm.setting AS incd_setting FROM   im_master imm ) AS staffincidents ON staff.uniqueid = staffincidents.personid  "
          }

          if(arr.includes("HR Notes Date") || arr.includes("HR Notes Detail") || arr.includes("HR Notes Creator") || arr.includes("HR Notes Alarm") || arr.includes("HR Notes Categories") ){
            FromSql = FromSql + " LEFT JOIN history HRHistory ON staff.uniqueid = HRHistory.personid AND HRHistory.extradetail1 = 'HRNOTE'  "
            }



  }else{
  FromSql = " From Recipients R" 
  if(arr.includes("Carer Last Name") || arr.includes("Carer Age") || arr.includes("Carer Gender") || arr.includes("Carer Indigenous Status") || arr.includes("Carer First Name") ){
    FromSql = FromSql + " INNER JOIN RECIPIENTS C ON R.DatasetCarer = C.AccountNo  "
  }         
  if(arr.includes("Carer Phone <Home>") ){ 
    FromSql = FromSql + " LEFT JOIN PhoneFaxOther PhHome ON C.UniqueID = PhHome.PersonID AND PhHome.[Type] = '<HOME>'  "
  }
  if(arr.includes("Carer Phone <Work>") ){
    FromSql = FromSql + " LEFT JOIN PhoneFaxOther PhWork ON C.UniqueID = PhWork.PersonID AND PhWork.[Type] = '<WORK>' "
  }
  if(arr.includes("Carer Phone <Mobile>") ){
    FromSql = FromSql + " LEFT JOIN PhoneFaxOther PhMobile ON C.UniqueID = PhMobile.PersonID AND PhMobile.[Type] = '<MOBILE>'  "
  }
  if(arr.includes("Carer Email") ){
    FromSql = FromSql + " LEFT JOIN PhoneFaxOther PE ON C.UniqueID = PE.PersonID AND PE.[Type] = '<EMAIL>' "
  }
  if(arr.includes("Carer Address") ){
    FromSql = FromSql + " LEFT JOIN NamesAndAddresses N ON C.UNIQUEID = N.PERSONID AND N.[Description] = '<USUAL>' "
  }
  if( arr.includes("Contact Group") || arr.includes("Contact Email") || arr.includes("Contact FAX") || arr.includes("Contact Mobile") || arr.includes("Contact Type") || arr.includes("Contact Phone 2") || arr.includes("Contact Phone 1") || arr.includes("Contact Postcode") || arr.includes("Contact Suburb") || arr.includes("Contact Name")   || arr.includes("Contact Address") || arr.includes("Contact Sub Type")  || arr.includes("Contact User Flag")  || arr.includes("Contact Person Type") ){ 
    FromSql = FromSql + " left join HumanResources HR on Hr.PersonID = R.UniqueID "
    this.includeConatctWhere = " HR.[Group] IN ('NEXTOFKIN',  'CONTACT', 'CARER',  '1-NEXT OF KIN',  '2-CARER',  '3-MEDICAL',  '4-ALLIED HEALTH',  '5-HEALTH INSURANCE',  '6-POWER OF ATTORNEY',  '7-LEGAL OTHER',  '8-OTHER','ALLIED HEALTH',  'PHARMACIST',  'HOSPITAL',  'HEALTHINSURER',  'POWERATTORNEY',  'OTHERLEGAL',  'OTHERCONTACT',  'MANAGER',  'HUMAN RESOURCES',  'ACCOUNTS',  'PAYROLL',  'SALES',  'PURCHASING',  'OTHERCONTACT') OR  HR.[Group] IN  (SELECT DESCRIPTION FROM DataDomains WHERE DOMAIN IN ('CONTACTGROUP', 'CARER RELATIONSHIP')AND DATASET = 'USER') "
  }  
  if(arr.includes("DOC_ID") ||arr.includes("Doc_Title") ||arr.includes("Created") ||arr.includes("Modified") ||arr.includes("Status") ||arr.includes("Classification") ||arr.includes("Category") ||arr.includes("Filename") ||arr.includes("Doc#") ||arr.includes("DocStartDate") ||arr.includes("DocEndDate") ||arr.includes("AlarmDate") ||arr.includes("AlarmText") ){
    FromSql = FromSql + " left join Documents doc on doc.PersonID = R.UniqueID  "
  }
  if(arr.includes("Consent") || arr.includes("Consent Start Date") || arr.includes("Consent Expiry") || arr.includes("Consent Notes") ){
    FromSql = FromSql + " left join HumanResources Cons on Cons.PersonID = R.UniqueID  "
  } 
  if(arr.includes("Goal") || arr.includes("Goal Detail") || arr.includes("Goal Achieved") || arr.includes("Anticipated Achievement Date") || arr.includes("Date Achieved") || arr.includes("Last Reviewed") || arr.includes("Logged By") ){
    FromSql = FromSql + " left join HumanResources Goalcare on Goalcare.PersonID = R.UniqueID "    
     this.includeGoalcareWhere = " Goalcare.[Group] = 'RECIPIENTGOALS' "
  } 
  if(arr.includes("Reminder Detail") || arr.includes("Event Date") || arr.includes("Reminder Date") || arr.includes("Reminder Notes") ){
    FromSql = FromSql + " left join HumanResources Remind on Remind.PersonID = R.UniqueID "    
    this.includeReminderWhere = " Remind.[Group] = 'RECIPIENTALERT' "
  }
  if(arr.includes("Group Email") || arr.includes("Group End Date") || arr.includes("Group Start Date") || arr.includes("Group Note") || arr.includes("Group Name") ){
    FromSql = FromSql + " left join HumanResources UserGroup on UserGroup.PersonID = R.UniqueID "    
    this.includeUserGroupWhere = " UserGroup.[Group] = 'RECIPTYPE' "
  }
  if(arr.includes("Preference Note") || arr.includes("Preference Name")){
    FromSql = FromSql + " left join HumanResources Prefr on Prefr.PersonID = R.UniqueID "    
    this.includePrefrencesWhere = " Prefr.[Group] = 'STAFFPREF' "
  }  
  if(arr.includes("Excluded Staff") || arr.includes("Excluded_Staff Notes") ){
    FromSql = FromSql + " left join HumanResources ExcludeS on ExcludeS.PersonID = R.UniqueID "    
    this.includeExcludeSWhere = " ExcludeS.[Type] = 'EXCLUDEDSTAFF'  "
  } 
  if(arr.includes("") || arr.includes("") ){
    FromSql = FromSql + " left join HumanResources IncludS on IncludS.PersonID = R.UniqueID "    
    this.includeIncludSWhere = " IncludS.[TYPE] = 'INCLUDEDSTAFF'  "
  }
  if(arr.includes("Funding Source") ){
    FromSql = FromSql + " LEFT JOIN RecipientPrograms ON R.UniqueID = RecipientPrograms.PersonID LEFT JOIN HumanResourceTypes ON RecipientPrograms.Program = HumanResourceTypes.Name "
  }
  if(arr.includes("Funded Program") || arr.includes("Program Status") || arr.includes("Program Coordinator") || arr.includes("Funding Start Date") || arr.includes("Funding End Date") || arr.includes("AutoRenew") || arr.includes("Rollover Remainder") || arr.includes("Funded Qty") || arr.includes("Funded Type")|| arr.includes("Funding Cycle")  || arr.includes("Funded Total Allocation") ){
    FromSql = FromSql + " LEFT JOIN RecipientPrograms ON R.UniqueID = RecipientPrograms.PersonID LEFT JOIN HumanResourceTypes ON RecipientPrograms.Program = HumanResourceTypes.Name "
  }
  if(arr.includes("Name") || arr.includes("Start Date") || arr.includes("End Date") || arr.includes("Details") || arr.includes("Reminder Date") || arr.includes("Reminder Text")  ){
    FromSql = FromSql + " left join CarePlanItem on CarePlanItem.PersonID = R.UniqueID "
  }
  if(arr.includes("Agreed Service Code") || arr.includes("Agreed Program") || arr.includes("Agreed Service Billing Rate") || arr.includes("Agreed Service Status") || arr.includes("Agreed Service Duration") || arr.includes("Agreed Service Frequency") || arr.includes("Agreed Service Unit Cost") || arr.includes("Agreed Service Debtor")   || arr.includes("Agreed Service Unit Cost") || arr.includes("Agreed Service Cost Type")    ){
    FromSql = FromSql + " LEFT JOIN ServiceOverview ON R.UniqueID = ServiceOverview.PersonID LEFT JOIN HumanResourceTypes HRAgreedServices ON HRAgreedServices.Name = ServiceOverview.ServiceProgram "
  }
  if(arr.includes("Nursing Diagnosis")  ){
    FromSql = FromSql + " LEFT JOIN NDiagnosis ON R.UniqueID = NDiagnosis.PersonID "
  }
  if(arr.includes("Medical Diagnosis ") || arr.includes("ONI-HC-Diagnosis")  ){
    FromSql = FromSql + " LEFT JOIN MDiagnosis ON R.UniqueID = MDiagnosis.PersonID "
  }
  if(arr.includes("Medical Procedure") ){
    FromSql = FromSql + " LEFT JOIN MProcedures ON R.UniqueID = MProcedures.PersonID "
  }  
  if(arr.includes("Pension Number") || arr.includes("Pension Name")){
    FromSql = FromSql + " left join HumanResources RecipientPensions on RecipientPensions.PersonID = R.UniqueID "
    this.includeRecipientPensionWhere = " RecipientPensions.[Group] = 'PENSION'  "
  }    
  if(arr.includes("HACC-GetUp") || arr.includes("HACC-Toileting") || arr.includes("HACC-Eating") || arr.includes("HACC-Communication")  || arr.includes("CSTDA-Primary Disability Description")   || arr.includes("ONI-DVA Cardholder Status") ||
  arr.includes("ONI-FP-Comments") || arr.includes("ONI-FP-Has Reading Aids") || arr.includes("ONI-FP-Has Medical Care Aids") || arr.includes("ONI-FPQ7-Bath") || arr.includes("ONI-FP-Has Self Care Aids") || arr.includes("ONI-FP-Has Other Aids") || arr.includes("ONI-FP-Has Support/Mobility Aids") || arr.includes("ONI-FP-Other Goods List") || arr.includes("ONI-FP-Has Car Mods") || arr.includes("ONI-FP-Has Communication Aids")  || arr.includes("ONI-FPQ5-Money") || arr.includes("ONI-FPQ6-Walk") || arr.includes("ONI-FPQ8-Memory") || arr.includes("ONI-FPQ9-Behaviour") || arr.includes("ONI-FP-Recommend Domestic") || arr.includes("ONI-FP-Recommend Self Care") || arr.includes("ONI-FP-Recommend Cognition") || arr.includes("ONI-FP-Recommend Behaviour")  
  || arr.includes("ONI-FPQ4-Medicine") || arr.includes("ONI-FPQ3-Shopping") || arr.includes("ONI-FPQ2-GetToPlaces") || arr.includes("ONI-FPQ1-Housework")  
  || arr.includes("ONI-LA-Financial & Legal Comments") || arr.includes("ONI-LA-Cost Of Living Trade Off") || arr.includes("ONI-LA-Capable Own Decisions") || arr.includes("ONI-LA-Employment Status Comments") || arr.includes("ONI-LA-Accomodation Comments") || arr.includes("ONI-LA-Living Arrangements Comments")  || arr.includes("ONI-LA-Employment Status") || arr.includes("ONI-LA-Financial Decisions") || arr.includes("ONI-LA-Decision Making Responsibility") || arr.includes("ONI-LA-Mental Health Act Status")
  || arr.includes("ONI-HC-Overall Health Description") || arr.includes("ONI-HC-Oral Comments") || arr.includes("ONI-HC-Speech/Swallow Problems") || arr.includes("ONI-HC-Pulse Regularity") || arr.includes("ONI-HC-Vacc. Influenza Date") || arr.includes("ONI-HC-Driving MV") || arr.includes("ONI-HC-Driving Fit") || arr.includes("ONI-HC-Urinary Related To Coughing") 
  || arr.includes("ONI-HC-Overall Health Pain") || arr.includes("ONI-HC-Oral Problems") || arr.includes("ONI-HC-Falls Problems") || arr.includes("ONI-HC-Vacc. Other Date") || arr.includes("ONI-HC-Feet Problems") || arr.includes("ONI-HC-Feet Comments") || arr.includes("ONI-HC-Driving Comments") || arr.includes("ONI-HC-Continence Urinary") || arr.includes("ONI-HC-Check Postural Hypotension")  
  || arr.includes("ONI-HC-Overall Health Interference") || arr.includes("ONI-HC-Hearing") || arr.includes("ONI-HC-Speech/Swallow Comments") || arr.includes("ONI-HC-Faecal Continence") || arr.includes("ONI-HC-Vacc. Influenza") || arr.includes("ONI-HC-Vacc. Tetanus") || arr.includes("ONI-HC-Vacc. Other") || arr.includes("ONI-HC-Continence Comments")  || arr.includes("ONI-HC-BMI") || arr.includes("ONI-HC-BP Systolic") 
  || arr.includes("ONI-HC-Vision Reading") || arr.includes("ONI-HC-Vision Distance") || arr.includes("ONI-HC-Falls Comments") || arr.includes("ONI-HC-Vacc. Pneumococcus") || arr.includes("ONI-HC-Pulse Rate") || arr.includes("ONI-HC-Vacc. Pneumococcus  Date") || arr.includes("ONI-HC-Vacc. Tetanus Date") || arr.includes("ONI-HC-BP Diastolic") || arr.includes("ONI-HC-Weight") || arr.includes("ONI-HC-Height")    
  || arr.includes("ONI-PS-K10-1,ONI-PS-K10-2") || arr.includes("ONI-PS-K10-3") || arr.includes("ONI-PS-K10-4") || arr.includes("ONI-PS-K10-5") || arr.includes("ONI-PS-K10-6") || arr.includes("ONI-PS-K10-7") || arr.includes("ONI-PS-K10-8") || arr.includes("ONI-PS-K10-9") || arr.includes("ONI-PS-K10-10")
  || arr.includes("ONI-PS-Sleep Difficulty") || arr.includes("ONI-PS-Sleep Details") || arr.includes("ONI-PS-Personal Support") || arr.includes("ONI-PS-Personal Support Comments") || arr.includes("ONI-PS-Keep Friendships") || arr.includes("ONI-PS-Problems Interacting")
  || arr.includes("ONI-PS-Family/Relationship Comments") || arr.includes("ONI-PS-Svc Prvdr Relations") || arr.includes("ONI-PS-Svc Prvdr Comments")  
  || arr.includes("ONI-HB-Regular Health Checks") || arr.includes("ONI-HB-Last Health Check") || arr.includes("ONI-HB-Health Screens") || arr.includes("ONI-HB-Smoking") || arr.includes("ONI-HB-If Quit Smoking - When?") || arr.includes("ONI-HB-Alchohol-How many?") || arr.includes("ONI-HB-Alchohol-How often over 6?") || arr.includes("ONI-HB-Lost Weight")
  || arr.includes("ONI-HB-Eating Poorly") || arr.includes("ONI-HB-How much wieght lost") || arr.includes("ONI-HB-Malnutrition Score") || arr.includes("ONI-HB-8 cups fluid") || arr.includes("ONI-HB-Recent decrease in fluid") || arr.includes("ONI-HB-Weight") || arr.includes("ONI-HB-Physical Activity") || arr.includes("ONI-HB-Physical Fitness") || arr.includes("ONI-HB-Fitness Comments")
  || arr.includes("ONI-CP-Need for carer") || arr.includes("ONI-CP-Carer has help") || arr.includes("ONI-CP-Carer receives payment") || arr.includes("ONI-CP-Carer made aware support services") || arr.includes("ONI-CP-Carer needs training") || arr.includes("ONI-CP-Carer threat-emotional")
  || arr.includes("ONI-CP-Carer threat-acute physical") || arr.includes("ONI-CP-Carer threat-slow physical") || arr.includes("ONI-CP-Carer threat-other factors") || arr.includes("ONI-CP-Carer threat-increasing consumer needs") || arr.includes("ONI-CP-Carer threat-other comsumer factors")
  || arr.includes("ONI-CP-Carer arrangements sustainable") || arr.includes("ONI-CP-Carer Comments")
  || arr.includes("ONI-CS-Year of Arrival") || arr.includes("ONI-CS-Citizenship Status") || arr.includes("ONI-CS-Reasons for moving to Australia") || arr.includes("ONI-CS-Primary/Secondary Language Fluency") || arr.includes("ONI-CS-Fluency in English")
  || arr.includes("ONI-CS-Literacy in primary language") || arr.includes("ONI-CS-Literacy in English") || arr.includes("ONI-CS-Non verbal communication style") || arr.includes("ONI-CS-Marital Status") || arr.includes("ONI-CS-Religion") || arr.includes("ONI-CS-Employment history in country of origin")
  || arr.includes("ONI-CS-Employment history in Australia") || arr.includes("ONI-CS-Specific dietary needs") || arr.includes("ONI-CS-Specific cultural needs") || arr.includes("ONI-CS-Someone to talk to for day to day problems") || arr.includes("ONI-CS-Miss having close freinds") || arr.includes("ONI-CS-Experience general sense of emptiness")
  || arr.includes("ONI-CS-Plenty of people to lean on for problems") || arr.includes("ONI-CS-Miss the pleasure of the company of others") || arr.includes("ONI-CS-Circle of friends and aquaintances too limited") || arr.includes("ONI-CS-Many people I trust completely") || arr.includes("ONI-CS-Enough people I feel close to") || arr.includes("ONI-CS-Miss having people around")
  || arr.includes("ONI-CS-Often feel rejected") || arr.includes("ONI-CS-Can call on my friends whenever I need them")


  ){
    FromSql = FromSql + " LEFT JOIN ONI ON R.UniqueID = ONI.PersonID  "
  }  
  if(arr.includes("'HACC-SLK'") ){
    FromSql = FromSql + " INNER JOIN RECIPIENTS  RHACC ON RHACC.AccountNo = R.AccountNo "
  } 
  if(arr.includes("HACC-Main Reasons For Cessation") ){
    FromSql = FromSql + " INNER JOIN ITEMTYPES  ON (Roster.[SERVICE TYPE] = ITEMTYPES.TITLE AND ITEMTYPES.MINORGROUP = 'DISCHARGE') INNER JOIN DATADOMAINS  ON (Roster.[DischargeReasonType] = DATADOMAINS.HACCCODE AND DOMAIN = 'REASONCESSSERVICE' and datadomains.[dataset]='HACC')  "
  }   
  if(arr.includes("ONI-Main Problem-Description") || arr.includes("ONI-Main Problem-Action")){
    FromSql = FromSql + " LEFT JOIN ONIMainIssues ON R.UniqueID = ONIMainIssues.PersonID "
  }
  if(arr.includes("ONI-Other Problem-Description") || arr.includes("ONI-Other Problem-Action")){
    FromSql = FromSql + " LEFT JOIN ONISecondaryIssues ON R.UniqueID = ONISecondaryIssues.PersonID "
  }
  if(arr.includes("ONI-Current Service") || arr.includes("ONI-Service Contact Details")){
    FromSql = FromSql + " LEFT JOIN ONIServices ON R.UniqueID = ONIServices.PersonID "
  }
  if(arr.includes("ONI-AP-Agency") || arr.includes("ONI-AP-For") || arr.includes("ONI-AP-Consent") || arr.includes("ONI-AP-Referral") || arr.includes("ONI-AP-Transport") || arr.includes("ONI-AP-Feedback") || arr.includes("ONI-AP-Date") || arr.includes("ONI-AP-Review") ){
    FromSql = FromSql + " LEFT JOIN ONIActionPlan ON R.UniqueID = ONIActionPlan.PersonID "
  } 

  if(arr.includes("HACC-Main Reasons For Cessation") ){
    FromSql = FromSql + " INNER JOIN ITEMTYPES  ON (Roster.[SERVICE TYPE] = ITEMTYPES.TITLE AND ITEMTYPES.MINORGROUP = 'DISCHARGE') INNER JOIN DATADOMAINS  ON (Roster.[DischargeReasonType] = DATADOMAINS.HACCCODE AND DOMAIN = 'REASONCESSSERVICE' and datadomains.[dataset]='HACC')  "
  }
  if(arr.includes("ONI-HC-Conditions")    ){
  FromSql = FromSql + " LEFT JOIN ONIHealthCOnditions ON R.UniqueID = ONIHealthCOnditions.PersonID "
  }
  if(arr.includes("ONI-HC-Medicines")    ){
    FromSql = FromSql + " LEFT JOIN ONIMedications ON R.UniqueID = ONIMedications.PersonID  "
    }
  if(
    arr.includes("DEX-Income Amount") || arr.includes("DEX-Income Frequency") || arr.includes("DEX-Main Source Of Income") || arr.includes("DEX-Household Composition") || arr.includes("DEX-Is Homeless") || arr.includes("DEX-Accomodation Setting") || arr.includes("DEX-Main Language At Home")
    || arr.includes("DEX-Ancestry") || arr.includes("DEX-Visa Code") || arr.includes("DEX-First Arrival Month") || arr.includes("DEX-First Arrival Year")|| arr.includes("DEX-Country of Birth") || arr.includes("DEX-Has A Carer") || arr.includes("DEX-Has Disabilities")                      
    || arr.includes("DEX-DVA Card Holder Status") || arr.includes("DEX-Indigenous Status") || arr.includes("DEX-Estimated Birth Date") || arr.includes("DEX-Date Of Birth") || arr.includes("DEX-Sex") || arr.includes("DEX-Consent For Future Contact") || arr.includes("DEX-Consent To Provide Information")
    || arr.includes("DEX-Reason For Assistance") || arr.includes("DEX-Referral Type") || arr.includes("DEX-Referral Source") || arr.includes("DEX-Referral Purpose") || arr.includes("DEX-Exclude From MDS")
  ){
  FromSql = FromSql + " LEFT JOIN DSSXtra DSS ON R.UniqueID = DSS.PersonID LEFT JOIN ONI ON R.UNIQUEID = ONI.PersonID  "
  }
  if(arr.includes("Loan Item Date Collected") || arr.includes("Loan Item Date Loaned/Installed")  || arr.includes("Loan Item Description") || arr.includes("Loan Item Type") ){
    FromSql = FromSql + " left join HumanResources HRLoan on HRLoan.PersonID = R.UniqueID "    
    this.includeLoanitemWhere = " HRLoan.[Group] = 'LOANITEMS'  "
    }
  if(arr.includes("Staff Code") || arr.includes("Service Date")  || arr.includes("Service Start Time") || arr.includes("Service Code") || arr.includes("Service Hours") || arr.includes("Service Pay Rate")  || arr.includes("Service Bill Rate") || arr.includes("Service Bill Qty") || arr.includes("Service Location/Activity Group") 
    || arr.includes("Service Program")  || arr.includes("Service Group") || arr.includes("Service HACCType") || arr.includes("Service End Time/ Shift End Time")  || arr.includes("Service Pay Type") || arr.includes("Service Category") || arr.includes("Service Status") || arr.includes("Service Pay Qty") ){
      FromSql = FromSql + " INNER JOIN Roster SvcDetail ON R.accountno = SvcDetail.[client code]   "          
    }
  if(arr.includes("Service Funding Source")    ){
      FromSql = FromSql + " LEFT JOIN Humanresourcetypes ON SvcDetail.Program = HumanResourceTypes.Name  "
      }
  if(arr.includes("Service Notes")    ){
      FromSql = FromSql + " LEFT JOIN History ON CONVERT(varchar,SvcDetail.RecordNo,100) = History.PersonID  "
      this.includeSvnDetailNotesWhere = "   History.ExtraDetail1 = 'SVCNOTE'  "
      }
  if(arr.includes("Activity")  || arr.includes("Competency")    ){
        FromSql = FromSql + " LEFT JOIN HumanResources SvcSpecCompetency  ON R.UniqueID = SvcSpecCompetency.PersonID "
        this.includeSvcSpecCompetencyWhere = " SvcSpecCompetency.[Type] = 'STAFFATTRIBUTE  "
        }         
  if(arr.includes("SS Status")    ){
        FromSql = FromSql + " LEFT JOIN  ServiceOverview ServiceCompetencyStatus ON ServiceCompetencyStatus.[PersonID]  = R.[UniqueID]  "        
      if(arr.includes("Activity")  || arr.includes("Competency")    ){
          FromSql = FromSql +  " AND ServiceCompetencyStatus.[SERVICE TYPE] = SvcSpecCompetency.[Service] "
      } else { FromSql = FromSql +  " LEFT JOIN  HumanResources SvcSpecCompetency on ServiceCompetencyStatus.[SERVICE TYPE] = SvcSpecCompetency.[Service] " }
        }
  if(arr.includes("OP Notes Date")   || arr.includes("OP Notes Detail") ||  arr.includes("OP Notes Creator") || arr.includes("OP Notes Alarm") || arr.includes("OP Notes Program") || arr.includes("OP Notes Category")  ){
          FromSql = FromSql + " LEFT JOIN History OPHistory ON R.UniqueID = OPHistory.PersonID   "        
          this.includeOPHistoryWhere = " OPHistory.ExtraDetail1 = 'OPNOTE'  "
        } 
    if(arr.includes("Clinical Notes Date")   || arr.includes("Clinical Notes Detail") ||  arr.includes("Clinical Notes Creator") || arr.includes("Clinical Notes Category") || arr.includes("Clinical Notes Alarm")   ){
          FromSql = FromSql + "  LEFT JOIN History CliniHistory ON R.UniqueID = CliniHistory.PersonID    "        
          this.includeClinicHistoryWhere = " CliniHistory.ExtraDetail1 = 'CLINNOTE'  "
        }        
    if(
        arr.includes("INCD_Status") || arr.includes("INCD_Date") || arr.includes("INCD_Type") || arr.includes("INCD_Description") || arr.includes("INCD_SubCategory") || arr.includes("INCD_Assigned_To") || arr.includes("INCD_Service")
        || arr.includes("INCD_Severity") || arr.includes("INCD_Time") || arr.includes("INCD_Duration") || arr.includes("INCD_Location") || arr.includes("INCD_LocationNotes") || arr.includes("INCD_ReportedBy") || arr.includes("INCD_DateReported")
        || arr.includes("INCD_Reported") || arr.includes("INCD_FullDesc") || arr.includes("INCD_Program") || arr.includes("INCD_DSCServiceType") || arr.includes("INCD_TriggerShort") || arr.includes("INCD_incident_level") || arr.includes("INCD_Area")
        || arr.includes("INCD_Region") || arr.includes("INCD_position") || arr.includes("INCD_phone") || arr.includes("INCD_verbal_date") || arr.includes("INCD_verbal_time") || arr.includes("INCD_By_Whome") || arr.includes("INCD_To_Whome") || arr.includes("INCD_BriefSummary")
        || arr.includes("INCD_ReleventBackground") || arr.includes("INCD_SummaryofAction") || arr.includes("INCD_SummaryOfOtherAction") || arr.includes("INCD_Triggers")|| arr.includes("INCD_InitialAction") || arr.includes("INCD_InitialNotes")
        || arr.includes("INCD_InitialFupBy") || arr.includes("INCD_Completed") || arr.includes("INCD_OngoingAction") || arr.includes("INCD_OngoingNotes") || arr.includes("INCD_Background") || arr.includes("INCD_Abuse") || arr.includes("INCD_DOPWithDisability") || arr.includes("INCD_SeriousRisks")
        || arr.includes("INCD_Complaints") || arr.includes("INCD_Perpetrator") || arr.includes("INCD_Notify") || arr.includes("INCD_NoNotifyReason") || arr.includes("INCD_Notes") || arr.includes("INCD_Setting") || arr.includes("INCD_Involved_Staff")
        ){
          FromSql = FromSql + " Right Join IM_Master IMM on  IMM.PersonID = R.UniqueID " +
          " left Join ItemTypes IT ON  IT.Title    = [IMM].[Service] " +
          " left Join HumanResourceTypes HRT ON  [IMM].Program   = [HRT].[Name] " +
          " left Join  IM_INVOLVEDSTAFF IMI ON   IMM.RecordNo  = IMI.IM_Master# " 
        }
    if(arr.includes("Recipient Competency")  || arr.includes("Recipient Competency Mandatory") || arr.includes("Recipient Competency Notes")   ){
          FromSql = FromSql + " Left Join HumanResources RecpCompet ON R.UniqueID = RecpCompet.PersonID "
          this.includeRecipientCompetencyWhere = " RecpCompet.[Type] = 'RECIPATTRIBUTE'  "
          }
    if(
      arr.includes("CarePlan Archived") || arr.includes("CarePlan ReminderText") || arr.includes("CarePlan ReviewDate") || arr.includes("CarePlan SignOffDate") || arr.includes("CarePlan StartDate") || arr.includes("CarePlan CareDomain")
      || arr.includes("CarePlan Discipline") || arr.includes("CarePlan Program") || arr.includes("CarePlan Type") || arr.includes("CarePlan Name") || arr.includes("CarePlan ID")
          ){
      FromSql = FromSql + " Right JOIN   Documents D on R.UniqueID = D.PersonID LEFT JOIN qte_hdr QH ON QH.CPID = D.DOC_ID  "
      this.includeCareplanWhere = "  ISNULL(D.[Status], '') <> '' AND D.DOCUMENTGROUP IN ('CAREPLAN') "
      }
    if(     
      arr.includes("MH-PERSONID") || arr.includes("MH-HOUSING TYPE ON REFERRAL")|| arr.includes("MH-RE REFERRAL") || arr.includes("MH-REFERRAL SOURCE") || arr.includes("MH-REFERRAL RECEIVED DATE") || arr.includes("MH-ENGAGED AND CONSENT DATE")|| arr.includes("MH-OPEN TO HOSPITAL") 
      || arr.includes("MH-OPEN TO HOSPITAL DETAILS") || arr.includes("MH-ALERTS") || arr.includes("MH-ALERTS DETAILS") || arr.includes("MH-MH DIAGNOSIS") || arr.includes("MH-MEDICAL DIAGNOSIS") || arr.includes("MH-REASONS FOR EXIT") || arr.includes("MH-SERVICES LINKED INTO") 
      || arr.includes("MH-NON ACCEPTED REASONS") || arr.includes("MH-NOT PROCEEDED") || arr.includes("MH-DISCHARGE DATE") || arr.includes("MH-CURRENT AOD") 
      || arr.includes("MH-CURRENT AOD DETAILS") || arr.includes("MH-PAST AOD") || arr.includes("MH-PAST AOD DETAILS")|| arr.includes("MH-ENGAGED AOD") || arr.includes("MH-ENGAGED AOD DETAILS") || arr.includes("MH-SERVICES CLIENT IS LINKED WITH ON INTAKE") || arr.includes("MH-SERVICES CLIENT IS LINKED WITH ON EXIT") 
      || arr.includes("MH-ED PRESENTATIONS ON REFERRAL") 
      || arr.includes("MH-ED PRESENTATIONS ON 3 MONTH REVIEW") || arr.includes("MH-ED PRESENTATIONS ON EXIT") || arr.includes("MH-AMBULANCE ARRIVAL ON REFERRAL") || arr.includes("MH-AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW") || arr.includes("MH-AMBULANCE ARRIVAL ON EXIT") || arr.includes("MH-ADMISSIONS ON REFERRAL") 
      || arr.includes("MH-ADMISSIONS ON MID-3 MONTH REVIEW") || arr.includes("MH-ADMISSIONS TO ED ON TIME OF EXIT") 
      || arr.includes("MH-RESIDENTIAL MOVES") || arr.includes("MH-DATE OF RESIDENTIAL CHANGE OF ADDRESS") || arr.includes("MH-LOCATION OF NEW ADDRESS") || arr.includes("MH-HOUSING TYPE ON EXIT") || arr.includes("MH-KPI - INTAKE")|| arr.includes("MH-KPI - 3 MONTH REVEIEW") || arr.includes("MH-KPI - EXIT")     
      || arr.includes("MH-MEDICAL DIAGNOSIS DETAILS") || arr.includes("MH-SERVICES LINKED DETAILS") || arr.includes("MH-NDIS TYPE") || arr.includes("MH-NDIS TYPE COMMENTS") 
      || arr.includes("MH-NDIS NUMBER") || arr.includes("MH-REVIEW APPEAL") || arr.includes("MH-REVIEW COMMENTS")|| arr.includes("MH-KP_Intake_1") || arr.includes("MH-KP_Intake_2") || arr.includes("MH-KP_Intake_3MH") || arr.includes("MH-KP_Intake_3PH") || arr.includes("MH-KP_Intake_4") || arr.includes("MH-KP_Intake_5") 
      || arr.includes("MH-KP_Intake_6") 
      || arr.includes("MH-KP_Intake_7") || arr.includes("MH-KP_3Months_1") || arr.includes("MH-KP_3Months_2") || arr.includes("MH-KP_3Months_3MH") || arr.includes("MH-KP_3Months_3PH") || arr.includes("MH-KP_3Months_4") || arr.includes("MH-KP_3Months_5") || arr.includes("MH-KP_3Months_6") || arr.includes("MH-KP_3Months_7")
      || arr.includes("MH-KP_6Months_1") 
      || arr.includes("MH-KP_6Months_2") || arr.includes("MH-KP_6Months_3MH") || arr.includes("MH-KP_6Months_3PH") || arr.includes("MH-KP_6Months_4") || arr.includes("MH-KP_6Months_5") || arr.includes("MH-KP_6Months_6") || arr.includes("MH-KP_6Months_7")|| arr.includes("MH-KP_9Months_1") || arr.includes("MH-KP_9Months_2") 
      || arr.includes("MH-KP_9Months_3MH") 
      || arr.includes("MH-KP_9Months_3PH") || arr.includes("MH-KP_9Months_4") || arr.includes("MH-KP_9Months_5") || arr.includes("MH-KP_9Months_6") || arr.includes("MH-KP_9Months_7") || arr.includes("MH-KP_Exit_1") || arr.includes("MH-KP_Exit_2") || arr.includes("MH-KP_Exit_3MH") || arr.includes("MH-KP_Exit_3PH") 
      || arr.includes("MH-KP_Exit_4") || arr.includes("MH-KP_Exit_5") 
      || arr.includes("MH-KP_Exit_6")|| arr.includes("MH-KP_Exit_7") || arr.includes("MH-KP_Intake_DATE") || arr.includes("MH-KP_3Months_DATE") || arr.includes("MH-KP_6Months_DATE") || arr.includes("MH-KP_9Months_DATE") || arr.includes("MH-KP_Exit_DATE") 
    ){
      FromSql = FromSql + "  LEFT JOIN MENTALHEALTHDATASET ON R.UniqueID = MENTALHEALTHDATASET.PersonID "    
      }         
    if(arr.includes("Placement Type") || arr.includes("Placement Carer Name") || arr.includes("Placement Start") || arr.includes("Placement End") || arr.includes("Placement Referral") || arr.includes("Placement ATC") || arr.includes("Placement Notes")
      ){
      FromSql = FromSql + "  LEFT JOIN HumanResources HRPlacements ON R.UniqueID = HRPlacements.PersonID AND [GROUP] = 'PLACEMENT' "    
    }

    if( arr.includes("Quote Strategy") || arr.includes("Strategy Expected Outcome") || arr.includes("Strategy Contracted ID") || arr.includes("Strategy DS Services")
        || arr.includes("Goal  Achieved") || arr.includes("Goal Completed Date") || arr.includes("Goal Last Review Date") || arr.includes("Goal Expected Completion Date") || arr.includes("Quote Goal")
    ){

        if( arr.includes("Goal  Achieved") || arr.includes("Goal Completed Date") || arr.includes("Goal Last Review Date") || arr.includes("Goal Expected Completion Date") || arr.includes("Quote Goal")
        ){
            FromSql = FromSql + "  Right JOIN Documents D   on R.UniqueID = D.PersonID LEFT JOIN HumanResources GOALS on GOALS.PersonID = CONVERT(varchar, D.Doc_ID) "    
          }
          
        if( arr.includes("Quote Strategy") || arr.includes("Strategy Expected Outcome") || arr.includes("Strategy Contracted ID") || arr.includes("Strategy DS Services") ){
            if( arr.includes("Goal  Achieved") || arr.includes("Goal Completed Date") || arr.includes("Goal Last Review Date") || arr.includes("Goal Expected Completion Date") || arr.includes("Quote Goal")){
              FromSql = FromSql + "  LEFT JOIN HumanResources STRATEGIES on STRATEGIES.PersonID = GOALS.RecordNumber "    
            }else{
              FromSql = FromSql + "  Right JOIN Documents D   on R.UniqueID = D.PersonID LEFT JOIN HumanResources GOALS on GOALS.PersonID = CONVERT(varchar, D.Doc_ID) "    
              FromSql = FromSql + "  LEFT JOIN HumanResources STRATEGIES on STRATEGIES.PersonID = GOALS.RecordNumber "      
            }          
        }                    
    }
  if( arr.includes("Staff Name") || arr.includes("Program Name") || arr.includes("Notes") ){ 
    FromSql = FromSql + " LEFT JOIN HumanResources HRCaseStaff ON R.UniqueID = HRCaseStaff.PersonID "      
    FromSql = FromSql + " INNER JOIN STAFF S ON HRCaseStaff.NAME = S.UNIQUEID "
    this.includeHRCaseStaffWhere = "  HRCaseStaff.[Group] = 'COORDINATOR'"
  }

  }
  
  











  
  return FromSql
}



}
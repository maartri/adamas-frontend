import { Component } from "@angular/core";

import { NzModalService } from 'ng-zorro-antd/modal';
import { OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormControlName, } from '@angular/forms';
import { parseJSON } from "date-fns";
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService } from '@services/index';
import { concat, flatMapDeep, indexOf, size } from "lodash";
import eachDayOfInterval from "date-fns/esm/eachDayOfInterval/index";

const inputFormDefault = {
  frm_nodelist: [true],
  
  btnid: '',
  content:  '',
  one:[[]],
  list: [[]],
  entity:[[]],
  condition:[[]],
  value:[[]],
  // = ['title','ASAD','key']
  //  data : Array<any> = [{'title':'ASAD','key':'00'},{'title':'ASAD','key':'01'},{'title':'ASAD','key':'02'}]
  exportitemsArr:[[]],
  functionsArr:  [["EQUALS", "BETWEEN", "LESS THAN", "GREATER THAN", "NOT EQUAL TO", "IS NOTHING", "IS ANYTHING", "IS TRUE", "IS FALSE"]],
  //Arr: [[]],
  Arr: '',
  valArr:'',
  //valArr:[[]],
  data: [[]],
  activeonly:[false],
  incl_internalCostclient: [false],
  radiofiletr:[],
  datarow: [[]],

}

@Component({
  host: {

  },
  styles: [`
  .item-right{
    text-align: right;
    align-content: right;
    float:right;
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
    height: 500px;
    overflow-y: scroll;
  }
  
    `],

  templateUrl: './user-reports.html'
})

export class UserReports implements OnInit, OnDestroy, AfterViewInit {
  frm_nodelist: boolean = true;
  inputForm: FormGroup;
  btnid: string;
  content: string;
  one: Array<any>;
  list: Array<any>;
  entity:Array<any>;
  datarow:Array<any>;
  condition:Array<any>;
  value:Array<any>;
  Endvalue :Array<any>; // = ['title','ASAD','key']
  //  data : Array<any> = [{'title':'ASAD','key':'00'},{'title':'ASAD','key':'01'},{'title':'ASAD','key':'02'}]
  exportitemsArr: Array<any>;
  functionsArr: Array<any> = ["EQUALS", "BETWEEN", "LESS THAN", "GREATER THAN", "NOT EQUAL TO", "IS NOTHING", "IS ANYTHING", "IS TRUE", "IS FALSE"];
 // Arr: Array<any>;
 // valArr: Array<any>;
  Arr: '';
  valArr:'';
  data: Array<any> = [];
  activeonly: boolean;
  incl_internalCostclient: boolean;

  StrType:string;

    id: string;
    tryDoctype: any;
    pdfTitle: string;
    drawerVisible: boolean = false;
    loading: boolean = false;
    reportid: string;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report';
    tocken :any;
    radiofiletr:any;
    rptfieldname:number = 0;

     sql: string;
     sqlselect: string;
     sqlcondition: string;
     sqlorder: string;
     ConditionEntity: string;
     FieldsNo: number;

    
IncludeFundingSource: boolean;  IncludeProgram: boolean;  IncludeStaffAttributes: boolean;  IncludePensions: boolean;  IncludeExcluded: boolean; IncludeIncluded: boolean;  IncludePreferences : boolean;
IncludeGoals: boolean;  IncludeLoanItems: boolean;  IncludeContacts: boolean;  IncludeConsents : boolean; IncludeDocuments : boolean; IncludeUserGroups : boolean; IncludeReminders : boolean; IncludeStaffReminders : boolean; IncludeLeaves: boolean;
IncludeCaseStaff: boolean;  IncludeCarePlans : boolean; IncludeServiceCompetencies : boolean; includeStaffIncidents : boolean; includeRecipIncidents : boolean; IncludeStaffUserGroups : boolean; IncludeStaffPreferences
IncludeNursingDiagnosis: boolean;  IncludeMedicalDiagnosis : boolean; IncludeMedicalProcedure : boolean; IncludeAgreedServices : boolean; IncludePlacements: boolean;  IncludeCaseNotes : boolean;
IncludeRecipientOPNotes: boolean;  IncludeRecipientClinicalNotes: boolean;  IncludeStaffOPNotes : boolean; IncludeStaffHRNotes : boolean; IncludeONI : boolean; IncludeONIMainIssues : boolean;
IncludeONIOtherIssues : boolean; IncludeONICurrentServices: boolean;  IncludeONIActionPlan : boolean; IncludeONIMedications : boolean; IncludeONIHealthConditions : boolean; IncludeStaffPosition : boolean;
IncludeDEX : boolean; IncludeCarerInfo : boolean; IncludeHACC : boolean; IncludeRecipBranches : boolean; includeHRRecipAttribute: boolean;  IncludeRecipCompetencies : boolean; IncludeStaffLoanItems : boolean;  IncludeCarePlan : boolean; IncludeGoalsAndStrategies : boolean; IncludeMentalHealth: boolean;


    nodes = [
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


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService,
    private GlobalS:GlobalService,
  ) {

  }
  ngOnInit(): void {
    this.inputForm = this.fb.group(inputFormDefault);
    this.tocken = this.GlobalS.pickedMember ? this.GlobalS.GETPICKEDMEMBERDATA(this.GlobalS.GETPICKEDMEMBERDATA):this.GlobalS.decode();
    
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {

  }

  ContentSetter(ekey) {

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

        this.one  = [  event.node.title ]
      }
      else{
        
        this.one = [ ...this.list  , event.node.title  ]
        
      }
      
    this.test(this.one);
    

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
  test(node) { 
    this.frm_nodelist = true;  
  this.list = node;
  this.exportitemsArr = [...this.list,"Service Date", "Service Start Time", "Service Hours", "Service Code", "Service Location/Activity Group", "Service Program", "Service Group", "Service HACCType", "Service Category", "Service Pay Rate", "Service Bill Rate", "Service Bill Qty", "Service Status", "Service Pay Type", "Service Pay Qty", "Service Bill Unit", "Service Funding Source"]
  

  } 
  
  apply(){
    this.entity  = this.inputForm.value.exportitemsArr;
    this.condition  = this.inputForm.value.functionsArr;
    this.value  = this.inputForm.value.Arr;
    this.Endvalue  = this.inputForm.value.valArr;
    
    var temp,temp1,temp2 :Array<any>

      if (this.datarow == null){
        this.entity = concat([ this.entity]);
        this.value = concat([ this.value]);
        this.condition = concat([ this.condition]);
        //this.datarow  = [entity,condition,value];
        //this.datarow  =concat(this.entity,this.condition,this.value);
      }else
      {
        this.entity = this.entity.concat([ this.entity]);
        this.value = this.value.concat([ this.value]);
        this.condition = this.condition.concat([ this.condition]);
        //this.datarow = [this.entity,this.condition,this.value];
      }  
        //console.log(this.entity,this.value,this.condition)    
        
        switch ((this.inputForm.value.exportitemsArr).toString()) {
          //NAME AND ADDRESS
          case 'First Name':
            this.ConditionEntity = 'FirstName'
            break;
          case 'Title':
            this.ConditionEntity ='title'       
              break;
          case 'Surname/Organisation':
            this.ConditionEntity ='[Surname/Organisation]'        
              break;
          case 'Preferred Name':
            this.ConditionEntity ='PreferredName'
              break;                  
          case 'Other':                  
              break;
          case 'Address-Line1':
            this.ConditionEntity ='Address1'        
              break;
          case 'Address-Line2':
            this.ConditionEntity ='Address2'     
              break;
          case 'Address-Suburb':
            this.ConditionEntity ='Suburb'     
              break;
          case 'Address-Postcode':
            this.ConditionEntity ='Postcode'        
              break;
          case 'Address-State':
            this.ConditionEntity ='State'        
              break;
//General Demographics             
          case 'Full Name-Surname First':
            this.ConditionEntity = '([Surname/Organisation]' + ' ' +'FirstName)'
              break;
          case 'Full Name-Mailing':
            this.ConditionEntity = '([Surname/Organisation]' + ' ' +'FirstName)'  
                  break;
                                 
          case 'Gender':
            this.ConditionEntity = 'Gender'
              break;
          case 'Date Of Birth':
                this.ConditionEntity = 'DateOfBirth'
              break;            
          case 'Age':
                this.ConditionEntity = ' DateDiff(YEAR,Dateofbirth,GetDate())'
              break;
          case 'Ageband-Statistical':
              //  this.ConditionEntity = ''
              break;
          case 'Ageband-5 Year':
              //  this.ConditionEntity =''
              break;
          case 'Ageband-10 Year':
              //  this.ConditionEntity =''
              break;
              case 'Age-ATSI Status':
              //  this.ConditionEntity =''
              break;
          case 'Month Of Birth':
              //  this.ConditionEntity =''
              break;
          case 'Day Of Birth No.':
              //  this.ConditionEntity =''
              break;
          case 'CALD Score':
              //  this.ConditionEntity =''
              break;                     
          case 'Country Of Birth':
                this.ConditionEntity = 'CountryOfBirth'
              break;
          case 'Language':
                this.ConditionEntity = 'HomeLanguage'
              break;              
          case 'Indigenous Status':
                this.ConditionEntity = 'IndiginousStatus'
              break;
          case 'Primary Disability':
                this.ConditionEntity = 'PermDisability'
              break;
          case 'Financially Dependent':
              //  this.ConditionEntity =''
              break;
          case 'Financial Status':
                this.ConditionEntity = 'FinancialStatus'
              break;          
          case 'Occupation':
                this.ConditionEntity = 'Occupation'
                break;
                //Admin Info
          case 'UniqueID':
                this.ConditionEntity = 'UniqueID'
              break;
          case 'Code':
              //  this.ConditionEntity =''
                break;
          case 'Type':
              //  this.ConditionEntity =''
                break;             
          case 'Category':
              //  this.ConditionEntity =''
              break;
          case 'CoOrdinator':
                this.ConditionEntity = 'RECIPIENT_CoOrdinator'
              break;
          case 'Admitting Branch':
                this.ConditionEntity = 'BRANCH'
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
                this.ConditionEntity = 'NDISNumber'
              break;     
          case 'Last Activated Date':
              //  this.ConditionEntity =''
                break;
          case 'Created By':
                this.ConditionEntity = 'CreatedBy'
              break;
          case 'Other':
              //  this.ConditionEntity =''
                break; 
                //Staff       
          case 'Staff Name':
          //  this.ConditionEntity =  
                break;
          case 'Program Name':
          //  this.ConditionEntity =  
                break;
          case 'Notes':
            this.ConditionEntity =  'Notes'
                break;
                //Other Genral info
          case 'OH&S Profile':
            this.ConditionEntity =  'OHSProfile'
                break;
          case 'OLD WH&S Date':
          //  this.ConditionEntity =  
                break;
          case 'Billing Profile':
            this.ConditionEntity =  'BillProfile'
                break;                       
          case 'Sub Category':
          //  this.ConditionEntity =  
                break;
          case 'Roster Alerts':
           // this.ConditionEntity =  
                break;
          case 'Timesheet Alerts':
           // this.ConditionEntity =  
                break;                 
          case 'Contact Issues':
            this.ConditionEntity =  'ContactIssues'
                break;
          case 'Survey Consent Given':
            this.ConditionEntity =  'SurveyConsent'
                break;
          case 'Copy Rosters':
            this.ConditionEntity =  'Autocopy'
                break;
          case 'Enabled':
           // this.ConditionEntity =  
                break;
          case 'Activation Date':
           // this.ConditionEntity =  
                break;
          case 'DeActivation Date':
           // this.ConditionEntity =  
                break;
          case 'Mobility':
            this.ConditionEntity =  'Mobility'
                break;
          case 'Specific Competencies':
            this.ConditionEntity =  'SpecialConsiderations'
                break;                
          case 'Carer Info':
          //  this.ConditionEntity =  
                break;
//  Contacts & Next of Kin
          case 'Contact Group':
          //  this.ConditionEntity =  
                break;
          case 'Contact Type':
          //  this.ConditionEntity =  
                break;
          case 'Contact Sub Type':
          //  this.ConditionEntity =  
                break;
          case 'Contact User Flag':
          //  this.ConditionEntity =  
                break;
          case 'Contact Person Type':
          //  this.ConditionEntity =  
                break;
          case 'Contact Name':
           // this.ConditionEntity =  
                break;
          case 'Contact Address':
          //  this.ConditionEntity =  
                break;
          case 'Contact Suburb':
          //  this.ConditionEntity =  
                break;
          case 'Contact Postcode':
          //  this.ConditionEntity =  
                break;
          case 'Contact Phone 1':
          //  this.ConditionEntity =  
                break;
          case 'Contact Phone 2':
          //  this.ConditionEntity =  
                break;
          case 'Contact Mobile':
           // this.ConditionEntity =  
                break;
          case 'Contact FAX':
          //  this.ConditionEntity =  
                break;
          case 'Contact Email':
          //  this.ConditionEntity =  
                break;
//Carer Info                
          case 'Carer First Name':
          //  this.ConditionEntity =  
                break;
          case 'Carer Last Name':
          //  this.ConditionEntity =  
                break;
                case 'Carer Age':
          //  this.ConditionEntity =  
                break;                 
          case 'Carer Gender':
          //  this.ConditionEntity =  
                break;
          case 'Carer Indigenous Status':
           // this.ConditionEntity =  
                break;
          case 'Carer Address':
          //  this.ConditionEntity =  
                break;
          case 'Carer Email':
          //  this.ConditionEntity =  
                break;
          case 'Carer Phone <Home>':
          //  this.ConditionEntity =  
                break;
          case 'Carer Phone <Work>':
          //  this.ConditionEntity =  
                break;
          case 'Carer Phone <Mobile>':
          //  this.ConditionEntity =  
                break;
// Documents                
          case 'DOC_ID':
           // this.ConditionEntity =  
                break;
          case 'Doc_Title':
           // this.ConditionEntity =  
                break;
          case 'Created':
          //  this.ConditionEntity =  
                break;                
          case 'Modified':
           // this.ConditionEntity =  
                break;
          case 'Status':
          //  this.ConditionEntity =  
                break;
          case 'Classification':
          //  this.ConditionEntity =  
                break;
          case 'Category':
          //  this.ConditionEntity =  
                break;
          case 'Filename':
          //  this.ConditionEntity =  
                break;
          case 'Doc#':
            //  this.ConditionEntity =  
                  break;
          case 'DocStartDate':
            //  this.ConditionEntity =  
                  break;
          case 'DocEndDate':
            //  this.ConditionEntity =  
                  break;
          case 'AlarmDate':
            //  this.ConditionEntity =  
                  break;                          
          case 'AlarmText':
            //  this.ConditionEntity =  
                  break;
 //Consents                  
          case 'Consent':
            //  this.ConditionEntity =  
                  break;
          case 'Consent Start Date':
            //  this.ConditionEntity =  
                  break;
          case 'Consent Expiry':
            //  this.ConditionEntity =  
                  break;
          case 'Consent Notes':
            //  this.ConditionEntity =  
                  break;
 //  GOALS OF CARE                  
          case 'Goal':
            //  this.ConditionEntity =  
                  break;               
          case 'Goal Detail':
            //  this.ConditionEntity =  
                  break;
          case 'Goal Achieved':
            //  this.ConditionEntity =  
                  break;
          case 'Anticipated Achievement Date':
            //  this.ConditionEntity =  
                  break;
          case 'Date Achieved':
            //  this.ConditionEntity =  
                  break;
          case 'Last Reviewed':
            //  this.ConditionEntity =  
                  break;
          case 'Last Reviewed':
            //  this.ConditionEntity =  
                  break;
          case 'Logged By':
            //  this.ConditionEntity =  
                  break;
//REMINDERS                  
          case 'Reminder Detail':
            //  this.ConditionEntity =  
                  break;
          case 'Event Date':
            //  this.ConditionEntity =  
                  break;
          case 'Reminder Date':
            //  this.ConditionEntity =  
                  break;
          case 'Reminder Notes':
            //  this.ConditionEntity =  
                  break;
// USER GROUPS                  
          case 'Group Name':
            //  this.ConditionEntity =  
                  break;
          case 'Group Note':
            //  this.ConditionEntity =  
                  break; 
//Preferences                                  
          case 'Preference Name':
            //  this.ConditionEntity =  
                  break;
          case 'Preference Note':
            //  this.ConditionEntity =  
                  break;
// FIXED REVIEW DATES                  
          case 'Review Date 1':
            //  this.ConditionEntity =  
                  break;
          case 'Review Date 2':
            //  this.ConditionEntity =  
                  break;
          case 'Review Date 3':
            //  this.ConditionEntity =  
                  break;           
//Staffing Inclusions/Exclusions                  
          case 'Excluded Staff':
            //  this.ConditionEntity =  
                  break;
          case 'Excluded_Staff Notes':
            //  this.ConditionEntity =  
                  break;
          case 'Included Staff':
            //  this.ConditionEntity =  
                  break;
          case 'Included_Staff Notes':
            //  this.ConditionEntity =  
                  break;
// AGREED FUNDING INFORMATION                         
          case 'Funding Source':
            //  this.ConditionEntity =  
                  break;
          case 'Funded Program':
            //  this.ConditionEntity =  
                  break;
          case 'Funded Program Agency ID':
            //  this.ConditionEntity =  
                  break;                  
          case 'Program Status':
            //  this.ConditionEntity =  
                  break;
          case 'Program Coordinator':
            //  this.ConditionEntity =  
                  break;
          case 'Funding Start Date':
            //  this.ConditionEntity =  
                  break;
          case 'Funding End Date':
            //  this.ConditionEntity =  
                  break;
          case 'AutoRenew':
            //  this.ConditionEntity =  
                  break;
          case 'Rollover Remainder':
            //  this.ConditionEntity =  
                  break;
          case 'Funded Qty':
            //  this.ConditionEntity =  
                  break;
          case 'Funded Type':
            //  this.ConditionEntity =  
                  break;
          case 'Funding Cycle':
            //  this.ConditionEntity =  
                  break;
          case 'Funded Total Allocation':
            //  this.ConditionEntity =  
                  break;
          case 'Used':
            //  this.ConditionEntity =  
                  break;
          case 'Remaining':
            //  this.ConditionEntity =  
                  break;
//LEGACY CARE PLAN                  
          case 'Name':
            //  this.ConditionEntity =  
                  break;                                    
          case 'Start Date':
            //  this.ConditionEntity =  
                  break;
          case 'End Date':
            //  this.ConditionEntity =  
                  break;
          case 'Details':
            //  this.ConditionEntity =  
                  break;
          case 'Reminder Date':
            //  this.ConditionEntity =  
                  break;
          case 'Reminder Text':
            //  this.ConditionEntity =  
                  break;   
//Agreed Service Information                   
          case 'Agreed Service Code':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Program':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Billing Rate':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Status':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Duration':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Frequency':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Cost Type':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Unit Cost':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Billing Unit':
            //  this.ConditionEntity =  
                  break;
          case 'Agreed Service Debtor':
            //  this.ConditionEntity =  
                  break;
 //  CLINICAL INFORMATION                  
          case 'Nursing Diagnosis':
            //  this.ConditionEntity =  
                  break;
          case 'Medical Diagnosis':
            //  this.ConditionEntity =  
                  break;
          case 'Medical Procedure':
            //  this.ConditionEntity =  
                  break;
 //PANZTEL Timezone                  
          case 'PANZTEL PBX Site':
            //  this.ConditionEntity =  
                  break;
          case 'PANZTEL Parent Site':
            //  this.ConditionEntity =  
                  break;
          case 'DAELIBS Logger ID':
            //  this.ConditionEntity =  
                  break;
//INSURANCE AND PENSION                  
          case 'Medicare Number':
            //  this.ConditionEntity =  
                  break;
          case 'Medicare Recipient ID':
            //  this.ConditionEntity =  
                  break;
          case 'Pension Status':
            //  this.ConditionEntity =  
                  break;
          case 'Unable to Determine Pension Status':
            //  this.ConditionEntity =  
                  break;
          case 'Concession Number':
            //  this.ConditionEntity =  
                  break;
          case 'DVA Benefits Flag':
            //  this.ConditionEntity =  
                  break;
          case 'DVA Number':
            //  this.ConditionEntity =  
                  break;
          case 'DVA Card Holder Status':
            //  this.ConditionEntity =  
                  break;
          case 'Ambulance Subscriber':
            //  this.ConditionEntity =  
                  break;
          case 'Ambulance Type':
            //  this.ConditionEntity =  
                  break;
          case 'Pension Name':
            //  this.ConditionEntity =  
                  break;
          case 'Pension Number':
            //  this.ConditionEntity =  
                  break;
          case 'Will Available':
            //  this.ConditionEntity =  
                  break;         
          case 'Will Location':
            //  this.ConditionEntity =  
                  break;
          case 'Funeral Arrangements':
            //  this.ConditionEntity =  
                  break;
          case 'Date Of Death':
            //  this.ConditionEntity =  
                  break;
//HACCS DATSET FIELDS                  
          case 'HACC-SLK':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-First Name':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Surname':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Referral Source':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Date Of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Date Of Birth Estimated':
            //  this.ConditionEntity =  
                  break;                
          case 'HACC-Gender':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Area Of Residence':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Country Of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Preferred Language,':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Indigenous Status':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Living Arrangements':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Dwelling/Accomodation':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Main Reasons For Cessation':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Pension Status':
            //  this.ConditionEntity =  
                  break;              
          case 'HACC-Primary Carer':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Carer Availability':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Carer Residency':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Carer Relationship':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Exclude From Collection':
            //  this.ConditionEntity =  
                  break;                                
          case 'HACC-Housework':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Transport':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Shopping':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Medication':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Money':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Walking':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Bathing':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Memory':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Behaviour':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Communication':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Eating':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-Toileting':
            //  this.ConditionEntity =  
                  break;
          case 'HACC-GetUp':
            //  this.ConditionEntity =  
                  break;        
          case 'HACC-Carer More Than One':
            //  this.ConditionEntity =  
                  break;
//"DEX"                  
          case 'DEX-Exclude From MDS':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Referral Purpose':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Referral Source':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Referral Type':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Reason For Assistance':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Consent To Provide Information':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Consent For Future Contact':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Consent For Future Contact':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Sex':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Date Of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Estimated Birth Date':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Indigenous Status':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-DVA Card Holder Status':
            //  this.ConditionEntity =  
                  break;
                  case '':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Has Disabilities':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Has A Carer':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Country of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-First Arrival Year':
            //  this.ConditionEntity =  
                  break;               
          case 'DEX-First Arrival Month':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Visa Code':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Ancestry':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Main Language At Home':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Accomodation Setting':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Is Homeless':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Household Composition':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Main Source Of Income':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Income Frequency':
            //  this.ConditionEntity =  
                  break;
          case 'DEX-Income Amount':
            //  this.ConditionEntity =  
                  break; 
// CSTDA Dataset Fields                  
          case 'CSTDA-Date Of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Gender':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-DISQIS ID':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Indigenous Status':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Country Of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Interpreter Required':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Communication Method':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Living Arrangements':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Suburb':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Postcode':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-State':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Residential Setting':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Primary Disability Group':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Primary Disability Description':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Intellectual Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Specific Learning ADD Disability':
            //  this.ConditionEntity =  
                  break;
          case 'STDA-Autism Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Physical Disability':
            //  this.ConditionEntity =  
                  break;  
          case 'CSTDA-Acquired Brain Injury Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Neurological Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Psychiatric Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Other Psychiatric Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Vision Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Hearing Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Speech Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Developmental Delay Disability':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Disability Likely To Be Permanent':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Support Needs-Self Care':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Support Needs-Mobility':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Support Needs-Communication':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Support Needs-Interpersonal':
            //  this.ConditionEntity =  
                  break; 
          case 'CSTDA-Support Needs-Learning':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Support Needs-Education':
            //  this.ConditionEntity =  
                  break;
            case 'CSTDA-Support Needs-Community':
                  //  this.ConditionEntity =  
                        break;
                case 'CSTDA-Support Needs-Domestic':
                  //  this.ConditionEntity =  
                        break;
                case 'CSTDA-Support Needs-Working':
                  //  this.ConditionEntity =  
                        break;
                case 'CSTDA-Support Needs-Working':
                  //  this.ConditionEntity =  
                        break;
                case 'CSTDA-Carer-Existence Of Informal':
                  //  this.ConditionEntity =  
                        break;
                case 'CSTDA-Carer-Assists client in ADL':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Carer-Lives In Same Household':
            //  this.ConditionEntity =  
                  break;
                  case 'CSTDA-Carer-Relationship':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Carer-Age Group':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Carer Allowance to Guardians':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Labour Force Status':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Main Source Of Income':
            //  this.ConditionEntity =  
                  break;
          case 'CSTDA-Current Individual Funding':
            //  this.ConditionEntity =  
                  break;
//NRCP Dataset Fields                  
          case 'NRCP-First Name':
            //  this.ConditionEntity =  
                  break;         
          case 'NRCP-Surname':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Date Of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Gender':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Suburb':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Country Of Birth':
            //  this.ConditionEntity =  
                  break;                
          case 'NRCP-Preferred Language':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Indigenous Status':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Marital Status':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-DVA Card Holder Status':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Paid Employment Participation':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Pension Status':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Carer-Date Role Commenced':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Carer-Role':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Carer-Need':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Carer-Number of Recipients':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Carer-Time Spent Caring':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Carer-Current Use Formal Services':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Carer-Informal Support':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Recipient-Challenging Behaviour':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Recipient-Primary Disability':
            //  this.ConditionEntity =  
                  break;         
          case 'NRCP-Recipient-Primary Care Needs':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Recipient-Level of Need':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Recipient-Primary Carer':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Recipient-Carer Relationship':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Recipient-Carer Co-Resident':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-Recipient-Dementia':
            //  this.ConditionEntity =  
                  break;
          case 'NRCP-CALD Background':
            //  this.ConditionEntity =  
                  break;
// "ONI-Core"                  
          case 'ONI-Family Name':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Title':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-First Name':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Other':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Sex':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-DOB':
            //  this.ConditionEntity =  
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
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Contact Details':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Country Of Birth':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Indigenous Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Main Language At Home':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Interpreter Required':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Preferred Language':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Govt Pension Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Pension Benefit Card':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Medicare Number':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Health Care Card#':
            //  this.ConditionEntity =  
                  break;                     
          case 'ONI-DVA Cardholder Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-DVA Number':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Insurance Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Health Insurer':
            //  this.ConditionEntity =  
                  break;        
          case 'ONI-Health Insurance Card#':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Alerts':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Rating':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HACC Eligible':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Reason For HACC Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Other Support Eligibility':
            //  this.ConditionEntity =  
                  break;                 
          case 'ONI-Other Support Detail':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Complete':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 1':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 2':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 3':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 4':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 5':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 6':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 7':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 8':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Functional Profile Score 9':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Main Problem-Description':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Main Problem-Action':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Other Problem-Description':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Other Problem-Action':
            //  this.ConditionEntity =  
                  break;    
          case 'ONI-Current Service':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-Service Contact Details':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-Agency':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-For':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-Consent':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-Referral':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-Transport':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-Feedback':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-Date':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-AP-Review':
            //  this.ConditionEntity =  
                  break;
//  ONI-Functional Profile                  
          case 'ONI-FPQ1-Housework':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FPQ2-GetToPlaces':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FPQ3-Shopping':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FPQ4-Medicine':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FPQ5-Money':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FPQ6-Walk':
            //  this.ConditionEntity =  
                  break;                 
          case 'ONI-FPQ7-Bath':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FPQ8-Memory':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FPQ9-Behaviour':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Recommend Domestic':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Recommend Self Care':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Recommend Cognition':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Recommend Behaviour':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Has Self Care Aids':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Has Support/Mobility Aids':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Has Communication Aids':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Has Car Mods':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Has Other Aids':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Other Goods List':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-FP-Comments':
            //  this.ConditionEntity =  
                  break;
//  ONI-Living Arrangements Profile                                   
          case 'ONI-LA-Living Arrangements':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Living Arrangements Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Accomodation':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Accomodation Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Employment Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Employment Status Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Mental Health Act Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Decision Making Responsibility':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Capable Own Decisions':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Financial Decisions':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Cost Of Living Trade Off':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Cost Of Living Trade Off':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-LA-Financial & Legal Comments':
            //  this.ConditionEntity =  
                  break;
// ONI-Health Conditions Profile   
          case 'ONI-HC-Overall Health Description':
            //  this.ConditionEntity =  
                  break;               
          case 'ONI-HC-Overall Health Pain':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Overall Health Interference':
            //  this.ConditionEntity =
          case 'ONI-HC-Vision Reading':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vision Distance':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Hearing':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Oral Problems':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Oral Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Speech/Swallow Problems':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Speech/Swallow Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Falls Problems':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Falls Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Feet Problems':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Feet Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Influenza':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Influenza Date':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Pneumococcus':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Pneumococcus  Date':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Tetanus':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Tetanus Date':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Other':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Vacc. Other Date':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Driving MV':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Driving Fit':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Driving Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Continence Urinary':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Urinary Related To Coughing':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Continence Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Weight':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Height':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-BMI':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-BP Systolic':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-BP Diastolic':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Pulse Rate':
            //  this.ConditionEntity =  
                  break;          
          case 'ONI-HC-Pulse Regularity':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Check Postural Hypotension':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Conditions':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Diagnosis':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Medicines':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Take Own Medication':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Willing When Presribed':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Co-op With Health Services':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Webster Pack':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Medication Review':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HC-Medical Comments':
            //  this.ConditionEntity =  
                  break;
//ONI-Psychosocial Profile                  
          case 'ONI-PS-K10-1':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-2':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-3':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-4':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-5':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-6':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-7':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-8':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-9':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-K10-10':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Sleep Difficulty':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Sleep Details':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Personal Support':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Personal Support Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Keep Friendships':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Problems Interacting':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Family/Relationship Comments':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Svc Prvdr Relations':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-PS-Svc Prvdr Comments':
            //  this.ConditionEntity =  
                  break;
//ONI-Health Behaviours Profile                  
          case 'ONI-HB-Regular Health Checks':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Last Health Check':
            //  this.ConditionEntity =  
                  break;                                    
          case 'ONI-HB-Health Screens':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Smoking':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Alchohol-How often?':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Alchohol-How many?':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Alchohol-How often over 6?':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Lost Weight':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Eating Poorly':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-How much wieght lost':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Malnutrition Score':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-8 cups fluid':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Recent decrease in fluid':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Weight':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Physical Activity':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Physical Fitness':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-HB-Fitness Comments':
            //  this.ConditionEntity =  
                  break;
//ONI-CP-Need for carer                  
          case 'ONI-CP-Carer Availability':
            //  this.ConditionEntity =  
                  break;                            
          case 'ONI-CP-Carer Residency Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer Relationship':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer has help':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer receives payment':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer made aware support services':
            //  this.ConditionEntity =  
                  break;        
          case 'ONI-CP-Carer needs training':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer threat-emotional':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer threat-acute physical':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer threat-slow physical':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer threat-other factors':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer threat-increasing consumer needs':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer threat-other comsumer factors':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer arrangements sustainable':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CP-Carer Comments':
            //  this.ConditionEntity =  
                  break;
//ONI-CS-Year of Arrival                  
          case 'ONI-CS-Citizenship Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Reasons for moving to Australia':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Primary/Secondary Language Fluency':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Fluency in English':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Literacy in primary language':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Literacy in English':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Non verbal communication style':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Marital Status':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Religion':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Employment history in country of origin':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Employment history in Australia':
            //  this.ConditionEntity =  
                  break;
            case 'ONI-CS-Specific dietary needs':
            //  this.ConditionEntity =  
                  break;
            case 'ONI-CS-Specific cultural needs':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Someone to talk to for day to day problems':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Someone to talk to for day to day problems':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Miss having close freinds':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Experience general sense of emptiness':
            //  this.ConditionEntity =  
                  break;
            case 'ONI-CS-Plenty of people to lean on for problems':
            //  this.ConditionEntity =  
                  break;
            case 'ONI-CS-Miss the pleasure of the company of others':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Circle of friends and aquaintances too limited':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Many people I trust completely':
            //  this.ConditionEntity =  
                  break;               
          case 'ONI-CS-Enough people I feel close to':
            //  this.ConditionEntity =  
                  break;
          case 'ONI-CS-Miss having people around':
            //  this.ConditionEntity =  
                  break;
            case 'ONI-CS-Often feel rejected':
            //  this.ConditionEntity =  
                  break;
            case 'ONI-CS-Can call on my friends whenever I need them':
            //  this.ConditionEntity =  
                  break;
//Loan Items                  
          case 'Loan Item Type':
            //  this.ConditionEntity =  
                  break;
          case 'Loan Item Description':
            //  this.ConditionEntity =  
                  break;
          case 'Loan Item Date Loaned/Installed':
            //  this.ConditionEntity =  
                  break;
          case 'Loan Item Date Collected':
            //  this.ConditionEntity =  
                  break;
 //  service information Fields                  
            case 'Staff Code':
            //  this.ConditionEntity =  
                  break;
            case 'Service Date':
            //  this.ConditionEntity =  
                  break;
          case 'Service Start Time':
            //  this.ConditionEntity =  
                  break;
          case 'Service Code':
            //  this.ConditionEntity =  
                  break;
          case 'Service Hours':
            //  this.ConditionEntity =  
                  break;
          case 'Service Pay Rate':
            //  this.ConditionEntity =  
                  break;
            case 'Service Bill Rate':
            //  this.ConditionEntity =  
                  break;
            case 'Service Bill Qty':
            //  this.ConditionEntity =  
                  break;
          case 'Service Location/Activity Group':
            //  this.ConditionEntity =  
                  break;
          case 'Service Program':
            //  this.ConditionEntity =  
                  break;
          case 'Service Group':
            //  this.ConditionEntity =  
                  break;
          case 'Service HACCType':
            //  this.ConditionEntity =  
                  break;
            case 'Service Category':
            //  this.ConditionEntity =  
                  break;
            case 'Service Status':
            //  this.ConditionEntity =  
                  break;
          case 'Service Pay Type':
            //  this.ConditionEntity =  
                  break;
          case 'Service Pay Qty':
            //  this.ConditionEntity =  
                  break;
          case 'Service End Time/ Shift End Time':
            //  this.ConditionEntity =  
                  break;
          case 'Service Funding Source':
            //  this.ConditionEntity =  
                  break;                     
            case 'Service Notes':
            //  this.ConditionEntity =  
                  break;
//Service Specific Competencies                  
            case 'Activity':
            //  this.ConditionEntity =  
                  break;
          case 'Competency':
            //  this.ConditionEntity =  
                  break;
          case 'SS Status':
            //  this.ConditionEntity =  
                  break;
//  RECIPIENT OP NOTES                  
          case 'OP Notes Date':
            //  this.ConditionEntity =  
                  break;
          case 'OP Notes Detail':
            //  this.ConditionEntity =  
                  break;
            case 'OP Notes Creator':
            //  this.ConditionEntity =  
                  break;        
            case 'OP Notes Creator':
            //  this.ConditionEntity =  
                  break;
          case 'OP Notes Alarm':
            //  this.ConditionEntity =  
                  break;
          case 'OP Notes Program':
            //  this.ConditionEntity =  
                  break;
          case 'OP Notes Category':
            //  this.ConditionEntity =  
                  break;
// RECIPIENT CLINICAL NOTES                  
          case 'Clinical Notes Date':
            //  this.ConditionEntity =  
                  break;
          case 'Clinical Notes Detail':
            //  this.ConditionEntity =  
                  break;
          case 'Clinical Notes Creator':
            //  this.ConditionEntity =  
                  break;
          case 'Clinical Notes Alarm':
            //  this.ConditionEntity =  
                  break;
          case 'Clinical Notes Category':
            //  this.ConditionEntity =  
                  break;
// RECIPIENT INCIDENTS                  
          case 'INCD_Status':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Date':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Type':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Description':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_SubCategory':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Assigned_To':
            //  this.ConditionEntity =  
                  break;         
          case 'INCD_Service':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Severity':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Time':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Duration':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Location':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_LocationNotes':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_ReportedBy':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_DateReported':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Reported':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_FullDesc':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Program':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_DSCServiceType':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_TriggerShort':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_incident_level':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Area':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Region':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_position':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_phone':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_verbal_date':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_verbal_time':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_By_Whome':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_To_Whome':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_BriefSummary':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_ReleventBackground':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_SummaryofAction':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_SummaryOfOtherAction':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Triggers':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_InitialAction':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_InitialNotes':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_InitialFupBy':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Completed':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_OngoingAction':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_OngoingNotes':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Background':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Abuse':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_DOPWithDisability':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_SeriousRisks':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Complaints':
            //  this.ConditionEntity =  
                  break;                                   
            case 'INCD_Perpetrator':
            //  this.ConditionEntity =  
                  break;
            case 'INCD_Notify':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_NoNotifyReason':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Notes':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Setting':
            //  this.ConditionEntity =  
                  break;
          case 'INCD_Involved_Staff':
            //  this.ConditionEntity =  
                  break;
//  Recipient Competencies                  
            case 'Recipient Competency':
            //  this.ConditionEntity =  
                  break;
            case 'Recipient Competency Mandatory':
            //  this.ConditionEntity =  
                  break;
          case 'Recipient Competency Notes':
            //  this.ConditionEntity =  
                  break;
//Care Plan                  
          case 'CarePlan ID':
            //  this.ConditionEntity =  
                  break;
          case 'CarePlan Name':
            //  this.ConditionEntity =  
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
            //  this.ConditionEntity =  
                  break;
          case 'CarePlan SignOffDate':
            //  this.ConditionEntity =  
                  break;
          case 'CarePlan ReviewDate':
            //  this.ConditionEntity =  
                  break;
            case 'CarePlan ReminderText':
            //  this.ConditionEntity =  
                  break;
            case 'CarePlan Archived':
            //  this.ConditionEntity =  
                  break;
//Mental Health                  
          case 'MH-PERSONID':
            //  this.ConditionEntity =  
                  break;
          case 'MH-HOUSING TYPE ON REFERRAL':
            //  this.ConditionEntity =  
                  break;
          case 'MH-RE REFERRAL':
            //  this.ConditionEntity =  
                  break;
          case 'MH-REFERRAL SOURCE':
            //  this.ConditionEntity =  
                  break;
            case 'MH-REFERRAL RECEIVED DATE':
            //  this.ConditionEntity =  
                  break;
            case 'MH-ENGAGED AND CONSENT DATE':
            //  this.ConditionEntity =  
                  break;
          case 'MH-OPEN TO HOSPITAL':
            //  this.ConditionEntity =  
                  break;                
          case 'MH-OPEN TO HOSPITAL DETAILS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-ALERTS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-ALERTS DETAILS':
            //  this.ConditionEntity =  
                  break;
            case 'MH-MH DIAGNOSIS':
            //  this.ConditionEntity =  
                  break;
            case 'MH-MEDICAL DIAGNOSIS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-REASONS FOR EXIT':
            //  this.ConditionEntity =  
                  break;
          case 'MH-SERVICES LINKED INTO':
            //  this.ConditionEntity =  
                  break;
          case 'MH-NON ACCEPTED REASONS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-NOT PROCEEDED':
            //  this.ConditionEntity =  
                  break;               
            case 'MH-DISCHARGE DATE':
            //  this.ConditionEntity =  
                  break;
            case 'MH-CURRENT AOD':
            //  this.ConditionEntity =  
                  break;
          case 'MH-CURRENT AOD DETAILS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-PAST AOD':
            //  this.ConditionEntity =  
                  break;
          case 'MH-PAST AOD DETAILS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-ENGAGED AOD':
            //  this.ConditionEntity =  
                  break;
            case 'MH-ENGAGED AOD DETAILS':
            //  this.ConditionEntity =  
                  break;
            case 'MH-SERVICES CLIENT IS LINKED WITH ON INTAKE':
            //  this.ConditionEntity =  
                  break;
          case 'MH-SERVICES CLIENT IS LINKED WITH ON EXIT':
            //  this.ConditionEntity =  
                  break;
          case 'MH-ED PRESENTATIONS ON REFERRAL':
            //  this.ConditionEntity =  
                  break;               
          case 'MH-ED PRESENTATIONS ON 3 MONTH REVIEW':
            //  this.ConditionEntity =  
                  break;
          case 'MH-ED PRESENTATIONS ON EXIT':
            //  this.ConditionEntity =  
                  break;
            case 'MH-AMBULANCE ARRIVAL ON REFERRAL':
            //  this.ConditionEntity =  
                  break;
            case 'MH-AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW':
            //  this.ConditionEntity =  
                  break;
          case 'MH-AMBULANCE ARRIVAL ON EXIT':
            //  this.ConditionEntity =  
                  break;
          case 'MH-ADMISSIONS ON REFERRAL':
            //  this.ConditionEntity =  
                  break;
                  case 'MH-ADMISSIONS ON MID-3 MONTH REVIEW':
            //  this.ConditionEntity =  
                  break;
          case 'MH-ADMISSIONS TO ED ON TIME OF EXIT':
            //  this.ConditionEntity =  
                  break;                  
            case 'MH-RESIDENTIAL MOVES':
            //  this.ConditionEntity =  
                  break;
            case 'MH-DATE OF RESIDENTIAL CHANGE OF ADDRESS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-LOCATION OF NEW ADDRESS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-HOUSING TYPE ON EXIT':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KPI - INTAKE':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KPI - 3 MONTH REVEIEW':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KPI - EXIT':
            //  this.ConditionEntity =  
                  break;
            case 'MH-MEDICAL DIAGNOSIS DETAILS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-SERVICES LINKED DETAILS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-NDIS TYPE':
            //  this.ConditionEntity =  
                  break;
          case 'MH-NDIS TYPE COMMENTS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-NDIS NUMBER':
            //  this.ConditionEntity =  
                  break;
            case 'MH-REVIEW APPEAL':
            //  this.ConditionEntity =  
                  break;
            case 'MH-REVIEW COMMENTS':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Intake_1':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Intake_2':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Intake_3MH':
            //  this.ConditionEntity =  
                  break;                                   
          case 'MH-KP_Intake_3PH':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_Intake_4':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_Intake_5':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Intake_6':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Intake_7':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_3Months_1':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_3Months_2':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_3Months_3MH':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_3Months_3PH':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_3Months_4':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_3Months_5':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_3Months_6':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_3Months_7':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_6Months_1':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_6Months_2':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_6Months_3MH':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_6Months_3PH':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_6Months_4':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_6Months_5':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_6Months_6':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_6Months_7':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_9Months_1':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_9Months_2':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_9Months_3MH':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_9Months_3PH':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_9Months_4':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_9Months_5':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_9Months_6':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_9Months_7':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Exit_1':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Exit_2':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_Exit_3MH':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_Exit_3PH':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Exit_4':
            //  this.ConditionEntity =  
                  break;       
          case 'MH-KP_Exit_5':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Exit_6':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Exit_7':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_Intake_DATE':
            //  this.ConditionEntity =  
                  break;
            case 'MH-KP_3Months_DATE':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_6Months_DATE':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_9Months_DATE':
            //  this.ConditionEntity =  
                  break;
          case 'MH-KP_Exit_DATE':
            //  this.ConditionEntity =  
                  break;
//Recipient Placements                  
          case 'Placement Type':
            //  this.ConditionEntity =  
                  break;
            case 'Placement Carer Name':
            //  this.ConditionEntity =  
                  break;
            case 'Placement Start':
            //  this.ConditionEntity =  
                  break;
          case 'Placement End':
            //  this.ConditionEntity =  
                  break;
          case 'Placement Referral':
            //  this.ConditionEntity =  
                  break;        
          case 'Placement ATC':
            //  this.ConditionEntity =  
                  break;
            case 'Placement Notes':
            //  this.ConditionEntity =  
                  break;
//Quote Goals and stratagies                  
            case 'Quote Goal':
            //  this.ConditionEntity =  
                  break;
          case 'Goal Expected Completion Date':
            //  this.ConditionEntity =  
                  break;
          case 'Goal Last Review Date':
            //  this.ConditionEntity =  
                  break;
          case 'Goal Completed Date':
            //  this.ConditionEntity =  
                  break;
            case 'Goal  Achieved':
            //  this.ConditionEntity =  
                  break;
            case 'Quote Strategy':
            //  this.ConditionEntity =  
                  break;
          case 'Strategy Expected Outcome':
            //  this.ConditionEntity =  
                  break;
          case 'Strategy Contracted ID':
            //  this.ConditionEntity =  
                  break;
          case 'Strategy DS Services':
            //  this.ConditionEntity =  
                  break;
          
          default:
            break;
        }



        this.QueryFormation();
      }
 
  delete(index){
    
  //  const index: number = this.condition.indexOf();
  if (this.entity != null){
    if (index != -1) {
      this.value.splice(index, 1);
      this.entity.splice(index, 1);
      this.condition.splice(index, 1);             
    }
  }
  //  console.log(index)
  }
  QueryFormation(){
    
    var keys = this.inputForm.value.functionsArr
    //["EQUALS", "BETWEEN", "LESS THAN", "GREATER THAN", "NOT EQUAL TO", "IS NOTHING", "IS ANYTHING", "IS TRUE", "IS FALSE"]
    switch (keys) {
      case 'EQUALS':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +" like ('"  + this.value + "')"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +" like ('"  + this.value + "')"
        }
        break;
        case 'BETWEEN':
          if(this.sqlcondition == null){
            this.sqlcondition = this.ConditionEntity +"  Between ('"  + this.value + "') and ('"  + this.Endvalue + "')"
          }else{ 
          this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +" Between ('"  + this.value + "') and ('"  + this.Endvalue + "')"
          }
          break;
        case 'LESS THAN':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +"  < ('"  + this.value + "')"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +" <  ('"  + this.value + "')"
        }
        break;
      case 'GREATER THAN':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +" >  ('"  + this.value + "')"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"  > ('"  + this.value + "')"
        }
        break;
      case 'NOT EQUAL TO':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +" <>  ('"  + this.value + "')"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +" <>  ('"  + this.value + "')"
        }
        break;
      case 'IS NOTHING':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +"   ('"  + this.value + "')"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"   ('"  + this.value + "')"
        }
        break;
      case 'IS ANYTHING':
        if(this.sqlcondition == null){
        //  this.sqlcondition = " "//this.ConditionEntity +"   ('"  + this.value + "')"
        }else{ 
        //  this.sqlcondition =this.sqlcondition + " "// " AND " + this.ConditionEntity +"   ('"  + this.value + "')"
        }
        break; 
      case 'IS TRUE':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +"  = true "
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"  = true "
        }
        break;
      case 'IS FALSE':
        if(this.sqlcondition == null){
          this.sqlcondition = this.ConditionEntity +"   = false"
        }else{ 
        this.sqlcondition =this.sqlcondition + " AND " + this.ConditionEntity +"   = false"
        }
        break;
      default:
        break;
    }
//  console.log(this.list)
  this.sqlselect = "Select " + this.ColumnNameAdjuster(this.list)//.join(" as Field"+ this.feildname() +", ")

  this.sql = this.sqlselect + this.TablesSetting(this.list) +  " where " + this.sqlcondition  ;    
    

  //  console.log(this.sql)
    

  }
  ShowReport(){
    this.tryDoctype = "";
    this.ReportRender(this.sql);
  }
  ReportRender(sql:string){

  //  console.log(sql);
    this.drawerVisible = true;
    this.loading = true;

    

      
      var fQuery = sql
      
      //    console.log(fQuery)
      //  console.log(this.inputForm.value.printaslabel)
      
      
      var Title = "Recipient User Defined Report"
  //    console.log(this.tocken.user)
      const data = {

          "template": { "_id": "qTQEyEz8zqNhNgbU" },
          "options": {
              "reports": { "save": false },
              //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
              "sql": fQuery,              
              "userid": this.tocken.user,
              "txtTitle": Title,
              "headings" :this.list,
               
              "Fields" :this.FieldsNo ,
              
              
          }
      }
      this.loading = true;

      const headerDict = {

          'Content-Type': 'application/json',
          'Accept': 'application/json',

      }

      const requestOptions = {
          headers: new HttpHeaders(headerDict),
          credentials: true
      };

      //this.rpthttp
      this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob', })
          .subscribe((blob: any) => {
              console.log(blob);

              let _blob: Blob = blob;

              let fileURL = URL.createObjectURL(_blob);
              this.pdfTitle = "User Defined Report.pdf";

              this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
              this.loading = false;

          }, err => {
              console.log(err);
              this.ModalS.error({
                  nzTitle: 'TRACCS',
nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                  nzOnOk: () => {
                           this.drawerVisible = false;
                           },
                });
          }); this.drawerVisible = true;
      }

      handleCancelTop(){
        this.drawerVisible = false;
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
  for (var key of fld){
    switch (key) {
      //NAME AND ADDRESS
      case 'First Name':
                  if(columnNames != []){
          columnNames = columnNames.concat(['FirstName as Field'+fld.indexOf(key)])
        }else{columnNames = (['FirstName as Field'+fld.indexOf(key)])}
        break;
      case 'Title':
                  if(columnNames != []){
          columnNames = columnNames.concat(['title as Field'+fld.indexOf(key)])
        }else{columnNames = (['title as Field'+fld.indexOf(key)])}        
          break;
      case 'Surname/Organisation':
                  if(columnNames != []){
          columnNames = columnNames.concat(['[Surname/Organisation] as Field'+fld.indexOf(key)])
        }else{columnNames = (['[Surname/Organisation] as Field'+fld.indexOf(key)])}        
          break;
      case 'Preferred Name':
                  if(columnNames != []){
          columnNames = columnNames.concat(['PreferredName as Field'+fld.indexOf(key)])
        }else{columnNames = (['PreferredName as Field'+fld.indexOf(key)])}        
          break;                  
      case 'Other':
                  if(columnNames != []){
          columnNames = columnNames.concat(['title as Field'+fld.indexOf(key)])
        }else{columnNames = (['title as Field'+fld.indexOf(key)])}        
          break;
      case 'Address-Line1':
                  if(columnNames != []){
          columnNames = columnNames.concat(['Address1 as Field'+fld.indexOf(key)])
        }else{columnNames = (['Address1 as Field'+fld.indexOf(key)])}        
          break;
      case 'Address-Line2':
                  if(columnNames != []){
          columnNames = columnNames.concat(['Address2 as Field'+fld.indexOf(key)])
        }else{columnNames = (['Address2 as Field'+fld.indexOf(key)])}        
          break;
      case 'Address-Suburb':
                  if(columnNames != []){
          columnNames = columnNames.concat(['Suburb as Field'+fld.indexOf(key)])
        }else{columnNames = (['Suburb as Field'+fld.indexOf(key)])}        
          break;
      case 'Address-Postcode':
                  if(columnNames != []){
          columnNames = columnNames.concat(['Postcode as Field'+fld.indexOf(key)])
        }else{columnNames = (['Postcode as Field'+fld.indexOf(key)])}        
          break;
      case 'Address-State':
                  if(columnNames != []){
          columnNames = columnNames.concat(['State as Field'+fld.indexOf(key)])
        }else{columnNames = (['State as Field'+fld.indexOf(key)])}        
          break;
//General Demographics          
      case 'Full Name-Surname First':
                  if(columnNames != []){
          columnNames = columnNames.concat(['([Surname/Organisation]' + ' ' +'FirstName) as Field'+fld.indexOf(key)])
        }else{columnNames = (['([Surname/Organisation]' + ' ' +'FirstName) as Field'+fld.indexOf(key)])}        
          break;
      case 'Full Name-Mailing':
                  if(columnNames != []){
              columnNames = columnNames.concat(['([Surname/Organisation]' + ' ' +'FirstName) as Field'+fld.indexOf(key)])
            }else{columnNames = (['([Surname/Organisation]' + ' ' +'FirstName) as Field'+fld.indexOf(key)])}        
              break;
      case 'Gender':
                  if(columnNames != []){
              columnNames = columnNames.concat(['Gender as Field'+fld.indexOf(key)])
            }else{columnNames = (['Gender as Field'+fld.indexOf(key)])}        
              break;
      case 'Date Of Birth':
                  if(columnNames != []){
              columnNames = columnNames.concat(['DateOfBirth as Field'+fld.indexOf(key)])
            }else{columnNames = (['DateOfBirth as Field'+fld.indexOf(key)])}        
              break;
      case 'Age':
                  if(columnNames != []){
              columnNames = columnNames.concat([' DateDiff(YEAR,Dateofbirth,GetDate()) as Field'+fld.indexOf(key)])
            }else{columnNames = ([' DateDiff(YEAR,Dateofbirth,GetDate()) as Field'+fld.indexOf(key)])}        
              break;
      case 'Ageband-Statistical':
        var AgebandStatic = " CASE " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 0 AND 5 THEN ' 0- 5' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 6 AND 13 THEN ' 6-13' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 14 AND 17 THEN '14-17' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 18 AND 45 THEN '18-45' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 46 AND 65 THEN '46-65' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 66 AND 70 THEN '66-70' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 71 AND 75 THEN '71-75' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 76 AND 80 THEN '76-80' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) BETWEEN 81 AND 90 THEN '81-90' " +
        "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(Now, 'yyyy-mm-dd') ) > 90 THEN 'OVER 90' " +
        "ELSE 'UNKNOWN' END "  
        
                  if(columnNames != []){
              columnNames = columnNames.concat([AgebandStatic+' as Field'+fld.indexOf(key)])
            }else{columnNames = ([AgebandStatic+' as Field'+fld.indexOf(key)])}        
              break;
          case 'Ageband-5 Year':
            var Ageband5 =" CASE " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 0 AND 5 THEN ' 0- 5' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 6 AND 10 THEN ' 6-10' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 11 AND 15 THEN '11-15' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 16 AND 20 THEN '16-20' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 21 AND 25 THEN '21-25' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 26 AND 30 THEN '26-30' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 36 AND 40 THEN '36-40' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 41 AND 45 THEN '41-45' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 46 AND 50 THEN '46-50' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 51 AND 55 THEN '51-55' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 56 AND 60 THEN '56-60' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 61 AND 65 THEN '61-65' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 66 AND 70 THEN '66-70' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 71 AND 75 THEN '71-75' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(NGETDATE(),'yyyy-mm-dd') ) BETWEEN 76 AND 80 THEN '76-80' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 81 AND 85 THEN '81-85' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 86 AND 90 THEN '86-90' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 91 AND 95 THEN '91-95' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 96 AND 100 THEN '96-100' "+ 
            "WHEN DATEDIFF(YEAR, DateOfBirth, Format(GETDATE(), 'yyyy-mm-dd')) > 100 THEN 'OVER 100' " +
            "ELSE 'UNKNOWN' END " 
            
                  if(columnNames != []){
              columnNames = columnNames.concat([Ageband5+' as Field'+fld.indexOf(key)])
            }else{columnNames = ([Ageband5 +' as Field'+fld.indexOf(key)])}        
              break;
          case 'Ageband-10 Year':
            var Ageban10 = "CASE "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 0 AND 10 THEN '0- 10' " +
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 11 AND 20 THEN '11-20' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd') ) BETWEEN 21 AND 30 THEN '21-30' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) BETWEEN 31 AND 40 THEN '31-40' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) BETWEEN 41 AND 50 THEN '41-50' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) BETWEEN 51 AND 60 THEN '51-60' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) BETWEEN 61 AND 70 THEN '61-70' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) BETWEEN 71 AND 80 THEN '71-80' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) BETWEEN 81 AND 90 THEN '81-90' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) BETWEEN 91 AND 100 THEN '91-100' "+
            "WHEN DATEDIFF(YEAR, DateOfBirth,  Format(GETDATE(), 'yyyy-mm-dd')) > 100 THEN 'OVER 100' "+
            "ELSE 'UNKNOWN' END  "
                  if(columnNames != []){
              columnNames = columnNames.concat([Ageban10+ ' as Field'+fld.indexOf(key)])
            }else{columnNames = ([Ageban10+ ' as Field'+fld.indexOf(key)])}        
              break;
              case 'Age-ATSI Status':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;
        case 'Month Of Birth':
            var Month = "DateName(Month, DateOfBirth)  "
                  if(columnNames != []){
              columnNames = columnNames.concat([Month +' as Field'+fld.indexOf(key)])
            }else{columnNames = ([Month +' as Field'+fld.indexOf(key)])}        
              break;
        case 'Day Of Birth No.':
          var day = "DateName(Weekday, DateOfBirth)"
                  if(columnNames != []){
              columnNames = columnNames.concat([day +' as Field'+fld.indexOf(key)])
            }else{columnNames = ([day +' as Field'+fld.indexOf(key)])}        
              break;
              case 'CALD Score':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;             
              case 'Country Of Birth':
                  if(columnNames != []){
              columnNames = columnNames.concat(['CountryOfBirth as Field'+fld.indexOf(key)])
            }else{columnNames = (['CountryOfBirth as Field'+fld.indexOf(key)])}        
              break;
              case 'Language':
                  if(columnNames != []){
              columnNames = columnNames.concat(['HomeLanguage as Field'+fld.indexOf(key)])
            }else{columnNames = (['HomeLanguage as Field'+fld.indexOf(key)])}        
              break;
      case 'Indigenous Status':
        var IndStatus = "CASE "+
        "WHEN [IndiginousStatus] = 'Aboriginal but not Torres Strait Islander origin' THEN 'ATSI' " +
        "WHEN [IndiginousStatus] = 'Both Aboriginal and Torres Strait Islander origin' THEN 'ATSI'" +
        "WHEN [IndiginousStatus] = 'Torres Strait Islander but not Aboriginal origin' THEN 'ATSI' " +
        "ELSE 'NON ATSI' " +
        "END AS [Indigenous Status]"
                  if(columnNames != []){
              columnNames = columnNames.concat([IndStatus+' as Field'+fld.indexOf(key)])
            }else{columnNames = ([IndStatus+' as Field'+fld.indexOf(key)])}        
              break;
              case 'Primary Disability':
                  if(columnNames != []){
              columnNames = columnNames.concat(['CSTDA_DisabilityGroup as Field'+fld.indexOf(key)])
            }else{columnNames = (['CSTDA_DisabilityGroup as Field'+fld.indexOf(key)])}        
              break;
      case 'Financially Dependent':
        var FinanceDepend = "CASE WHEN [FDP] = 1 THEN 'YES'   ELSE 'NO' END AS [Financially Dependent]"
                  if(columnNames != []){
              columnNames = columnNames.concat([FinanceDepend+'  as Field'+fld.indexOf(key)])
            }else{columnNames = ([FinanceDepend +'  as Field'+fld.indexOf(key)])}        
              break;
              case 'Financial Status':
                  if(columnNames != []){
              columnNames = columnNames.concat(['FinancialClass as Field'+fld.indexOf(key)])
            }else{columnNames = (['FinancialClass as Field'+fld.indexOf(key)])}        
              break;          
              case 'Occupation':
                  if(columnNames != []){
              columnNames = columnNames.concat(['Occupation as Field'+fld.indexOf(key)])
            }else{columnNames = (['Occupation as Field'+fld.indexOf(key)])}        
              break;
              //Admin Info
              case 'UniqueID':
                  if(columnNames != []){
              columnNames = columnNames.concat(['UniqueID as Field'+fld.indexOf(key)])
            }else{columnNames = (['UniqueID as Field'+fld.indexOf(key)])}        
              break;
              case 'Code':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;             
              case 'Type':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;             
              case 'Category':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;
              case 'CoOrdinator':
                  if(columnNames != []){
              columnNames = columnNames.concat(['RECIPIENT_CoOrdinator as Field'+fld.indexOf(key)])
            }else{columnNames = (['RECIPIENT_CoOrdinator as Field'+fld.indexOf(key)])}        
              break;
              case 'Admitting Branch':
                  if(columnNames != []){
              columnNames = columnNames.concat(['BRANCH as Field'+fld.indexOf(key)])
            }else{columnNames = (['BRANCH as Field'+fld.indexOf(key)])}        
              break;                
              case 'Secondary Branch':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;  
              case 'File number':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;
              case 'File Number 2':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;
              case 'NDIA/MAC Number':
                  if(columnNames != []){
              columnNames = columnNames.concat(['NDISNumber as Field'+fld.indexOf(key)])
            }else{columnNames = (['NDISNumber as Field'+fld.indexOf(key)])}        
              break;     
              case 'Last Activated Date':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break;
              case 'Created By':
                  if(columnNames != []){
              columnNames = columnNames.concat(['CreatedBy as Field'+fld.indexOf(key)])
            }else{columnNames = (['CreatedBy as Field'+fld.indexOf(key)])}        
              break;
              case 'Other':
                  if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
            }else{columnNames = (['  as Field'+fld.indexOf(key)])}        
              break; 
              //Staff                
            case 'Staff Name':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                  break;
            case 'Program Name':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Notes':
                    if(columnNames != []){
                columnNames = columnNames.concat(['Notes as Field'+fld.indexOf(key)])
              }else{columnNames = (['Notes as Field'+fld.indexOf(key)])}
                  break;
                  //Other Genral info
            case 'OH&S Profile':
                    if(columnNames != []){
                columnNames = columnNames.concat(['OHSProfile as Field'+fld.indexOf(key)])
              }else{columnNames = (['OHSProfile as Field'+fld.indexOf(key)])}
                  break;
            case 'OLD WH&S Date':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                  break;   
              case 'Billing Profile':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['BillProfile as Field'+fld.indexOf(key)])
                }else{columnNames = (['BillProfile as Field'+fld.indexOf(key)])}  
                break;          
            case 'Sub Category':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Roster Alerts':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Timesheet Alerts':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;                 
            case 'Contact Issues':
                    if(columnNames != []){
                columnNames = columnNames.concat(['ContactIssues as Field'+fld.indexOf(key)])
              }else{columnNames = (['ContactIssues as Field'+fld.indexOf(key)])}
                  break;
            case 'Survey Consent Given':
                    if(columnNames != []){
                columnNames = columnNames.concat(['SurveyConsent as Field'+fld.indexOf(key)])
              }else{columnNames = (['SurveyConsent as Field'+fld.indexOf(key)])}
                  break;
            case 'Copy Rosters':
                    if(columnNames != []){
                columnNames = columnNames.concat(['Autocopy as Field'+fld.indexOf(key)])
              }else{columnNames = (['Autocopy as Field'+fld.indexOf(key)])}
                  break;
            case 'Enabled':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Activation Date':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'DeActivation Date':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                  break;
            case 'Mobility':
                    if(columnNames != []){
                columnNames = columnNames.concat(['Mobility as Field'+fld.indexOf(key)])
              }else{columnNames = (['Mobility as Field'+fld.indexOf(key)])}
                  break;
            case 'Specific Competencies':
                    if(columnNames != []){
                columnNames = columnNames.concat(['SpecialConsiderations as Field'+fld.indexOf(key)])
              }else{columnNames = (['SpecialConsiderations as Field'+fld.indexOf(key)])}
                  break;
            case 'Carer Info':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
//  Contacts & Next of Kin                  
            case 'Contact Group':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                  break;
            case 'Contact Type':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Contact Sub Type':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                  break;
            case 'Contact User Flag':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                  break;
            case 'Contact Person Type':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Contact Name':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Contact Address':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Contact Suburb':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                  break;
            case 'Contact Postcode':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Contact Phone 1':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['    as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Contact Phone 2':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                  break;
            case 'Contact Mobile':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                  break;
            case 'Contact FAX':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                  break;
            case 'Contact Email':
              this.IncludeContacts = true
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                  break;
//Carer Info                  
            case 'Carer First Name':
                    if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                    break;
              case 'Carer Last Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                    break;
                    case 'Carer Age':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                      }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;                 
              case 'Carer Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Carer Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                    break;
              case 'Carer Address':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Carer Email':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Carer Phone <Home>':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Carer Phone <Work>':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                    break;
              case 'Carer Phone <Mobile>':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                    break;
// Documents                    
              case 'DOC_ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                    break;
              case 'Doc_Title':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Created':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;                
              case 'Modified':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                    break;
              case 'Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                    break;
              case 'Classification':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Category':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Filename':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                    break;
              case 'Doc#':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DocStartDate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DocEndDate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'AlarmDate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                          
              case 'AlarmText':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
 //Consents                      
              case 'Consent':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Consent Start Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Consent Expiry':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Consent Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
 //  GOALS OF CARE                      
              case 'Goal':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;               
              case 'Goal Detail':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Goal Achieved':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Anticipated Achievement Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Date Achieved':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Last Reviewed':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Last Reviewed':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Logged By':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//REMINDERS                      
              case 'Reminder Detail':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Event Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Reminder Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Reminder Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
// USER GROUPS                      
              case 'Group Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Group Note':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break; 
//Preferences                                      
              case 'Preference Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Preference Note':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
// FIXED REVIEW DATES                      
              case 'Review Date 1':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Review Date 2':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Review Date 3':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;   
//Staffing Inclusions/Exclusions                                 
              case 'Excluded Staff':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Excluded_Staff Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Included Staff':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Included_Staff Notes':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break; 
// AGREED FUNDING INFORMATION                            
              case 'Funding Source':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Funded Program':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Funded Program Agency ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Program Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Program Coordinator':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Funding Start Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Funding End Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'AutoRenew':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Rollover Remainder':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Funded Qty':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Funded Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Funding Cycle':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Funded Total Allocation':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Used':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Remaining':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
//LEGACY CARE PLAN                      
              case 'Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;                                    
              case 'Start Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'End Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Details':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Reminder Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Reminder Text':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;  
//Agreed Service Information                                    
              case 'Agreed Service Code':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Agreed Program':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Agreed Service Billing Rate':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Agreed Service Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Agreed Service Duration':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Agreed Service Frequency':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Agreed Service Cost Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Agreed Service Unit Cost':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Agreed Service Billing Unit':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Agreed Service Debtor':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
 //  CLINICAL INFORMATION                      
              case 'Nursing Diagnosis':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Medical Diagnosis':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Medical Procedure':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
 //PANZTEL Timezone                      
              case 'PANZTEL PBX Site':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'PANZTEL Parent Site':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'DAELIBS Logger ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
//INSURANCE AND PENSION                      
              case 'Medicare Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Medicare Recipient ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Unable to Determine Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Concession Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DVA Benefits Flag':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DVA Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DVA Card Holder Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Ambulance Subscriber':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Ambulance Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Pension Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'Pension Number':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Will Available':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;         
              case 'Will Location':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Funeral Arrangements':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Date Of Death':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
//HACCS DATSET FIELDS                      
              case 'HACC-SLK':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-First Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Surname':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Referral Source':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Date Of Birth Estimated':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;                
              case 'HACC-Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Area Of Residence':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Country Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Preferred Language,':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Living Arrangements':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Dwelling/Accomodation':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Main Reasons For Cessation':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;              
              case 'HACC-Primary Carer':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Carer Availability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Carer Residency':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Carer Relationship':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'HACC-Exclude From Collection':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;                                
              case 'HACC-Housework':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'HACC-Transport':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Shopping':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Medication':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Money':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Walking':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Bathing':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Memory':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'HACC-Behaviour':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'HACC-Communication':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Eating':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-Toileting':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'HACC-GetUp':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;        
              case 'HACC-Carer More Than One':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
//"DEX"                      
              case 'DEX-Exclude From MDS':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Referral Purpose':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'DEX-Referral Source':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'DEX-Referral Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Reason For Assistance':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'DEX-Consent To Provide Information':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Consent For Future Contact':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Consent For Future Contact':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Sex':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'DEX-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Estimated Birth Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-DVA Card Holder Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case '':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Has Disabilities':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Has A Carer':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'DEX-Country of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'DEX-First Arrival Year':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;               
              case 'DEX-First Arrival Month':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Visa Code':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Ancestry':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Main Language At Home':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Accomodation Setting':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'DEX-Is Homeless':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Household Composition':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Main Source Of Income':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'DEX-Income Frequency':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'DEX-Income Amount':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break; 
// CSTDA Dataset Fields                      
              case 'CSTDA-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-DISQIS ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Country Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Interpreter Required':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Communication Method':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Living Arrangements':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CSTDA-Postcode':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-State':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Residential Setting':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Primary Disability Group':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Primary Disability Description':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Intellectual Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CSTDA-Specific Learning ADD Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'STDA-Autism Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Physical Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;  
              case 'CSTDA-Acquired Brain Injury Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Neurological Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Psychiatric Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Other Psychiatric Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CSTDA-Vision Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Hearing Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Speech Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Developmental Delay Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Disability Likely To Be Permanent':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Support Needs-Self Care':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Support Needs-Mobility':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Support Needs-Communication':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Support Needs-Interpersonal':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break; 
              case 'CSTDA-Support Needs-Learning':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Support Needs-Education':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'CSTDA-Support Needs-Community':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                            break;
                    case 'CSTDA-Support Needs-Domestic':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                      }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                            break;
                    case 'CSTDA-Support Needs-Working':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                      }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                            break;
                    case 'CSTDA-Support Needs-Working':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                      }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                            break;
                    case 'CSTDA-Carer-Existence Of Informal':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                      }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                            break;
                    case 'CSTDA-Carer-Assists client in ADL':
                      if(columnNames != []){
                        columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                      }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Carer-Lives In Same Household':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Carer-Relationship':
                        if(columnNames != []){
                          columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                        }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Carer-Age Group':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Carer Allowance to Guardians':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'CSTDA-Labour Force Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Main Source Of Income':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'CSTDA-Current Individual Funding':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
//NRCP Dataset Fields                      
              case 'NRCP-First Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;         
              case 'NRCP-Surname':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Date Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'NRCP-Gender':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Country Of Birth':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;                
              case 'NRCP-Preferred Language':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Indigenous Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'NRCP-Marital Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-DVA Card Holder Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Paid Employment Participation':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'NRCP-Pension Status':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'NRCP-Carer-Date Role Commenced':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'NRCP-Carer-Role':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Carer-Need':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Carer-Number of Recipients':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Carer-Time Spent Caring':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Carer-Current Use Formal Services':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Carer-Informal Support':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Recipient-Challenging Behaviour':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Recipient-Primary Disability':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;         
              case 'NRCP-Recipient-Primary Care Needs':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Recipient-Level of Need':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'NRCP-Recipient-Primary Carer':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Recipient-Carer Relationship':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'NRCP-Recipient-Carer Co-Resident':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-Recipient-Dementia':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'NRCP-CALD Background':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
// "ONI-Core"                      
              case 'ONI-Family Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Title':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-First Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Other':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Sex':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-DOB':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Usual Address-Street':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Usual Address-Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Usual Address-Postcode':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Contact Address-Street':
                        if(columnNames != []){
                          columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                        }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Contact Address-Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Contact Address-Postcode':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Phone-Home':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Phone-Work':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Phone-Mobile':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Phone-FAX':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-EMAIL':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Person 1 Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Person 1 Street':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Person 1 Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Person 1 Postcode':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Person 1 Phone':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Person 1 Relationship':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Person 2 Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Person 2 Street':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Person 2 Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Person 2 Postcode':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Person 2 Phone':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Person 2 Relationship':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Doctor Name':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Doctor Street':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
              case 'ONI-Doctor Suburb':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'ONI-Doctor Postcode':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Doctor Phone':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                           
              case 'ONI-Doctor FAX':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Doctor EMAIL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Referral Source':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Contact Details':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Country Of Birth':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Indigenous Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Main Language At Home':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Interpreter Required':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Preferred Language':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Govt Pension Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Pension Benefit Card':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Medicare Number':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Health Care Card#':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                     
              case 'ONI-DVA Cardholder Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-DVA Number':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Insurance Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Health Insurer':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;        
              case 'ONI-Health Insurance Card#':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Alerts':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Rating':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HACC Eligible':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Reason For HACC Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Other Support Eligibility':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                 
              case 'ONI-Other Support Detail':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Complete':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 3':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 8':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Functional Profile Score 9':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Main Problem-Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Main Problem-Action':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Other Problem-Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Other Problem-Action':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;    
              case 'ONI-Current Service':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-Service Contact Details':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-Agency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-For':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-Consent':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-Referral':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-Transport':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-Feedback':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-AP-Review':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//  ONI-Functional Profile                      
              case 'ONI-FPQ1-Housework':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FPQ2-GetToPlaces':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FPQ3-Shopping':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FPQ4-Medicine':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FPQ5-Money':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FPQ6-Walk':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                 
              case 'ONI-FPQ7-Bath':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FPQ8-Memory':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FPQ9-Behaviour':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Recommend Domestic':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Recommend Self Care':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Recommend Cognition':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Recommend Behaviour':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Has Self Care Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Has Support/Mobility Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Has Communication Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Has Car Mods':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Has Other Aids':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Other Goods List':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-FP-Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break; 
//  ONI-Living Arrangements Profile                                      
              case 'ONI-LA-Living Arrangements':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Living Arrangements Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Accomodation':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Accomodation Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Employment Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Employment Status Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Mental Health Act Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Decision Making Responsibility':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Capable Own Decisions':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Financial Decisions':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Cost Of Living Trade Off':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Cost Of Living Trade Off':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-LA-Financial & Legal Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
// ONI-Health Conditions Profile 
              case 'ONI-HC-Overall Health Description':
                if(columnNames != []){
              columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                    break                      
              case 'ONI-HC-Overall Health Pain':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Overall Health Interference':
                //  this.ConditionEntity =
              case 'ONI-HC-Vision Reading':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vision Distance':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Hearing':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Oral Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Oral Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Speech/Swallow Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Speech/Swallow Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Falls Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Falls Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Feet Problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Feet Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Influenza':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Influenza Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Pneumococcus':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Pneumococcus  Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Tetanus':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Tetanus Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Other':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Vacc. Other Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Driving MV':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Driving Fit':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Driving Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Continence Urinary':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Urinary Related To Coughing':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Continence Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Weight':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Height':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-BMI':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-BP Systolic':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-BP Diastolic':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Pulse Rate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;          
              case 'ONI-HC-Pulse Regularity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Check Postural Hypotension':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Conditions':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Diagnosis':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Medicines':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Take Own Medication':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Willing When Presribed':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Co-op With Health Services':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Webster Pack':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Medication Review':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HC-Medical Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//ONI-Psychosocial Profile                      
              case 'ONI-PS-K10-1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-3':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-8':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-9':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-K10-10':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Sleep Difficulty':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Sleep Details':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Personal Support':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Personal Support Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Keep Friendships':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Problems Interacting':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Family/Relationship Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Svc Prvdr Relations':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-PS-Svc Prvdr Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//ONI-Health Behaviours Profile                      
              case 'ONI-HB-Regular Health Checks':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Last Health Check':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                                    
              case 'ONI-HB-Health Screens':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Smoking':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Alchohol-How often?':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Alchohol-How many?':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Alchohol-How often over 6?':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Lost Weight':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Eating Poorly':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-How much wieght lost':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Malnutrition Score':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-8 cups fluid':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Recent decrease in fluid':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Weight':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Physical Activity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Physical Fitness':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-HB-Fitness Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//ONI-CP-Need for carer                      
              case 'ONI-CP-Carer Availability':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                            
              case 'ONI-CP-Carer Residency Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer Relationship':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer has help':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer receives payment':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer made aware support services':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;        
              case 'ONI-CP-Carer needs training':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer threat-emotional':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer threat-acute physical':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer threat-slow physical':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer threat-other factors':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer threat-increasing consumer needs':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer threat-other comsumer factors':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer arrangements sustainable':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CP-Carer Comments':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//ONI-CS-Year of Arrival                      
              case 'ONI-CS-Citizenship Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Reasons for moving to Australia':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Primary/Secondary Language Fluency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Fluency in English':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Literacy in primary language':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Literacy in English':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Non verbal communication style':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Marital Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Religion':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Employment history in country of origin':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Employment history in Australia':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'ONI-CS-Specific dietary needs':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'ONI-CS-Specific cultural needs':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Someone to talk to for day to day problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Someone to talk to for day to day problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Miss having close freinds':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Experience general sense of emptiness':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'ONI-CS-Plenty of people to lean on for problems':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'ONI-CS-Miss the pleasure of the company of others':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Circle of friends and aquaintances too limited':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Many people I trust completely':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;               
              case 'ONI-CS-Enough people I feel close to':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'ONI-CS-Miss having people around':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'ONI-CS-Often feel rejected':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'ONI-CS-Can call on my friends whenever I need them':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//Loan Items                      
              case 'Loan Item Type':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Loan Item Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Loan Item Date Loaned/Installed':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Loan Item Date Collected':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
 //  service information Fields                      
                case 'Staff Code':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'Service Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Start Time':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Code':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Hours':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Pay Rate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'Service Bill Rate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'Service Bill Qty':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Location/Activity Group':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Program':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Group':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service HACCType':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'Service Category':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'Service Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Pay Type':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Pay Qty':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service End Time/ Shift End Time':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Service Funding Source':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                     
                case 'Service Notes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//Service Specific Competencies                      
                case 'Activity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Competency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'SS Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//  RECIPIENT OP NOTES                      
              case 'OP Notes Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'OP Notes Detail':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'OP Notes Creator':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;        
                case 'OP Notes Creator':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'OP Notes Alarm':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'OP Notes Program':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'OP Notes Category':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
// RECIPIENT CLINICAL NOTES                      
              case 'Clinical Notes Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Clinical Notes Detail':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Clinical Notes Creator':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Clinical Notes Alarm':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Clinical Notes Category':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
// RECIPIENT INCIDENTS                      
              case 'INCD_Status':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Type':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Description':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_SubCategory':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Assigned_To':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;         
              case 'INCD_Service':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Severity':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Time':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Duration':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Location':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_LocationNotes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_ReportedBy':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_DateReported':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Reported':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_FullDesc':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Program':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_DSCServiceType':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_TriggerShort':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_incident_level':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Area':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Region':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_position':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_phone':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_verbal_date':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_verbal_time':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_By_Whome':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_To_Whome':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_BriefSummary':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_ReleventBackground':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_SummaryofAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_SummaryOfOtherAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Triggers':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_InitialAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_InitialNotes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_InitialFupBy':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Completed':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_OngoingAction':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_OngoingNotes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Background':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Abuse':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_DOPWithDisability':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_SeriousRisks':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Complaints':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                                   
                case 'INCD_Perpetrator':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'INCD_Notify':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_NoNotifyReason':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Notes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Setting':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'INCD_Involved_Staff':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//  Recipient Competencies                      
                case 'Recipient Competency':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'Recipient Competency Mandatory':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Recipient Competency Notes':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//Care Plan                      
              case 'CarePlan ID':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CarePlan Name':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CarePlan Type':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'CarePlan Program':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                  
                case 'CarePlan Discipline':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CarePlan CareDomain':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CarePlan StartDate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CarePlan SignOffDate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'CarePlan ReviewDate':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'CarePlan ReminderText':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'CarePlan Archived':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//Mental Health                       
              case 'MH-PERSONID':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-HOUSING TYPE ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-RE REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-REFERRAL SOURCE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-REFERRAL RECEIVED DATE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-ENGAGED AND CONSENT DATE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-OPEN TO HOSPITAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                
              case 'MH-OPEN TO HOSPITAL DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-ALERTS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-ALERTS DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-MH DIAGNOSIS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-MEDICAL DIAGNOSIS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-REASONS FOR EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-SERVICES LINKED INTO':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-NON ACCEPTED REASONS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-NOT PROCEEDED':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;               
                case 'MH-DISCHARGE DATE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-CURRENT AOD':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-CURRENT AOD DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-PAST AOD':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-PAST AOD DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-ENGAGED AOD':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-ENGAGED AOD DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-SERVICES CLIENT IS LINKED WITH ON INTAKE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-SERVICES CLIENT IS LINKED WITH ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-ED PRESENTATIONS ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;               
              case 'MH-ED PRESENTATIONS ON 3 MONTH REVIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-ED PRESENTATIONS ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-AMBULANCE ARRIVAL ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-AMBULANCE ARRIVAL ON MID 3 MONTH REVIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-AMBULANCE ARRIVAL ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-ADMISSIONS ON REFERRAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                      case 'MH-ADMISSIONS ON MID-3 MONTH REVIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-ADMISSIONS TO ED ON TIME OF EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                  
                case 'MH-RESIDENTIAL MOVES':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-DATE OF RESIDENTIAL CHANGE OF ADDRESS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-LOCATION OF NEW ADDRESS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-HOUSING TYPE ON EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KPI - INTAKE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KPI - 3 MONTH REVEIEW':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KPI - EXIT':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-MEDICAL DIAGNOSIS DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-SERVICES LINKED DETAILS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-NDIS TYPE':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-NDIS TYPE COMMENTS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-NDIS NUMBER':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-REVIEW APPEAL':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-REVIEW COMMENTS':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Intake_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Intake_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Intake_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                                   
              case 'MH-KP_Intake_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_Intake_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_Intake_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Intake_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Intake_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_3Months_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_3Months_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_3Months_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_3Months_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_3Months_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_3Months_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_3Months_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_3Months_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_6Months_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_6Months_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_6Months_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_6Months_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_6Months_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_6Months_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_6Months_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_6Months_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_9Months_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_9Months_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_9Months_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_9Months_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_9Months_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_9Months_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_9Months_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_9Months_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Exit_1':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Exit_2':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_Exit_3MH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_Exit_3PH':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Exit_4':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;                        
              case 'MH-KP_Exit_5':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Exit_6':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_Exit_7':
                  if(columnNames != []){
                columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
              }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'MH-KP_Intake_DATE':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
                case 'MH-KP_3Months_DATE':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'MH-KP_6Months_DATE':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'MH-KP_9Months_DATE':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'MH-KP_Exit_DATE':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
//Recipient Placements                      
              case 'Placement Type':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
                case 'Placement Carer Name':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
                case 'Placement Start':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Placement End':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Placement Referral':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;        
              case 'Placement ATC':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
                case 'Placement Notes':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
//Quote Goals and stratagies                      
                case 'Quote Goal':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Goal Expected Completion Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Goal Last Review Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Goal Completed Date':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])} 
                      break;
                case 'Goal  Achieved':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
                case 'Quote Strategy':
                  if(columnNames != []){
                    columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                  }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Strategy Expected Outcome':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}
                      break;
              case 'Strategy Contracted ID':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;
              case 'Strategy DS Services':
                  if(columnNames != []){
                  columnNames = columnNames.concat(['  as Field'+fld.indexOf(key)])
                }else{columnNames = (['  as Field'+fld.indexOf(key)])}  
                      break;


          default:
            break;
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
  FromSql = " From Recipients R"
  if(arr.includes("Carer") ){
  //  console.log(arr)
  }
   



  return FromSql
}



}
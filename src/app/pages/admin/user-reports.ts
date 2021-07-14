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
import { concat, flatMapDeep } from "lodash";
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
  value:Array<any>;// = ['title','ASAD','key']
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
          { "title": " Carer Gender", "key": "03", isLeaf: true },
          { "title": "Carer Indigenous Status ", "key": "04", isLeaf: true },
          { "title": " Carer Address", "key": "05", isLeaf: true },
          { "title": "Carer Email ", "key": "06", isLeaf: true },
          { "title": " Carer Phone <Home>", "key": "07", isLeaf: true },
          { "title": "Carer Phone <Work>", "key": "08", isLeaf: true },
          { "title": "Carer Phone <Mobile>", "key": "09", isLeaf: true },

        ]
        break;
      // Documents 
      case "07":
        this.data = [
          { "title": "DOC_ID", "key": "00", isLeaf: true },
          { "title": "Doc_Title ", "key": "01", isLeaf: true },
          { "title": "Created ", "key": "02", isLeaf: true },
          { "title": " Modified", "key": "03", isLeaf: true },
          { "title": "Status ", "key": "04", isLeaf: true },
          { "title": " Classification", "key": "05", isLeaf: true },
          { "title": "Category ", "key": "06", isLeaf: true },
          { "title": " Filename", "key": "07", isLeaf: true },
          { "title": "Doc# ", "key": "08", isLeaf: true },
          { "title": "DocStartDate ", "key": "09", isLeaf: true },
          { "title": "DocEndDate ", "key": "10", isLeaf: true },
          { "title": "AlarmDate ", "key": "11", isLeaf: true },
          { "title": "AlarmText ", "key": "12", isLeaf: true },
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
      ////LEGACY CARE PLAN
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
          { "title": "HACC-Communication", "key": "30", isLeaf: true },
          { "title": "HACC-Eating", "key": "31", isLeaf: true },
          { "title": "HACC-Toileting", "key": "32", isLeaf: true },
          { "title": "HACC-GetUp", "key": "33", isLeaf: true },
          { "title": "HACC-Carer More Than One", "key": "34", isLeaf: true },
        ]
        break;
      //"DEX"
      case "24":
        this.data = [

          { "title": "DEX-Exclude From MDS", "key": "00", isLeaf: true },
          { "title": "DEX-Referral Purpose", "key": "01", isLeaf: true },
          { "title": "DEX-Referral Source", "key": "02", isLeaf: true },
          { "title": "DEX-Referral Type", "key": "03", isLeaf: true },
          { "title": "EX-Reason For Assistance", "key": "04", isLeaf: true },
          { "title": "EX-Consent To Provide Information", "key": "05", isLeaf: true },
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
      // NI-Health Conditions Profile
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
          { "title": "ONI-HC-Willing WHen Presribed", "key": "41", isLeaf: true },
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
          { "title": "MH-ADMISSIONS ON MID- 3 MONTH REVIEW", "key": "32", isLeaf: true },
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
          { "title": "Quote Goal ", "key": "00", isLeaf: true },
          { "title": "Goal Expected Completion Date ", "key": "01", isLeaf: true },
          { "title": "Goal Last Review Date ", "key": "02", isLeaf: true },
          { "title": "Goal Completed Date ", "key": "03", isLeaf: true },
          { "title": "Goal  AChieved ", "key": "04", isLeaf: true },
          { "title": "Quote Strategy ", "key": "05", isLeaf: true },
          { "title": "Strategy Expected Outcome ", "key": "06", isLeaf: true },
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
    console.log(event);
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
    var entity:Array<any> = this.inputForm.value.exportitemsArr;
    var condition:Array<any> = this.inputForm.value.functionsArr;
    var value:Array<any> = this.inputForm.value.Arr;
    var temp,temp1,temp2 :Array<any>
    

  //  this.entity = [entity];
  //  this.value = [condition];
  //  this.condition = [value];

if (this.datarow == null){
  this.entity = concat(entity);
  this.value = concat(value);
  this.condition = concat(condition);
  this.datarow  =concat([entity],[condition],[value])
//  this.datarow  =concat(this.entity,this.condition,this.value);
}else
{
  this.entity = this.entity.concat(entity);
  this.value = this.value.concat(value);
  this.condition = this.condition.concat(condition);

  this.datarow = concat(this.entity,this.condition,this.value);
}  
  console.log(this.datarow)

    

  }
 
  delete(index){
    
  //  const index: number = this.condition.indexOf();
  if (this.datarow != null){
    if (index !== -1) {
      this.datarow.splice(index, 1);
    }
  }
    console.log(index)
  }
  QueryFormation(){
    var sql,sqlselect,sqlcondition,sqlorder;
    var keys = this.inputForm.value.functionsArr
    //["EQUALS", "BETWEEN", "LESS THAN", "GREATER THAN", "NOT EQUAL TO", "IS NOTHING", "IS ANYTHING", "IS TRUE", "IS FALSE"]
    switch (keys) {
      case 'EQUALS':
        sqlcondition =  this.Condition(this.entity) +" like ('"  + this.value + "')"
        //this.inputForm.value.exportitemsArr
        break;
    
      default:
        break;
    }
  console.log(this.list)
    sqlselect = "Select " + this.ColumnNameAdjuster(this.list)//.join(" as Field"+ this.feildname() +", ")

    sql = sqlselect + " from Recipients  where " + sqlcondition  ;    
    
//  sql = "Select Title as Field1, AccountNo as Field2, Type as Field3 from Recipients where  Title like ('mrs')" 
    console.log(sql)
    this.ReportRender(sql);

  }
  ReportRender(sql:string){

    console.log(sql);
    this.drawerVisible = true;
    this.loading = true;

    

      
      var fQuery = sql
      
          console.log(fQuery)
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
              "head1" :"Heading1" ,
              "head2" :"Heading1" ,
              "head3" :"Heading1" ,
              
              
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
   
  var columnNames:Array<any> = [''];
//  var temp = fld.join(',')
//  console.log(temp)
  for (var key of fld){
    switch (key) {
      case 'First Name':
       columnNames = columnNames.concat(['FirstName'])
        break;
      case 'Title':
        columnNames = columnNames.concat(['title'])
          break;
      default:
        break;
    }
  }
  

  return columnNames;
}
Condition(fld){
  var columnNames:Array<any>;
  var temp = fld.join(',')
  console.log(temp)
  for (var key of fld){
    console.log(key)
  }
  columnNames = ['FirstName']
 /*switch (fld) {
   case 'First Name':
    columnNames = ['FirstName']
     break;
 
   default:
     break;
 } */

  return columnNames;
}


}
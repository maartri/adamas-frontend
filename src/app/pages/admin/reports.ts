import { Component, OnInit, OnDestroy, Input, AfterViewInit,ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { ListService, states, TimeSheetService,GlobalService,MenuService,ReportService,PrintService } from '@services/index'
import * as FileSaver from 'file-saver';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO'
import { EventInputTransformer, whenTransitionDone } from '@fullcalendar/angular';
import { getDate } from 'date-fns';
import { concat, constant, now } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Router,ActivatedRoute, ParamMap } from '@angular/router';
import * as constants from './../../services/global.service'
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';

//Sets defaults of Criteria Model     
const inputFormDefault = {
    statesArr: [[]],
    allState: [true],

    branchesArr: [[]],
    allBranches: [true],

    serviceRegionsArr: [[]],
    allServiceRegion: [true],

    managersArr: [[]],
    allManager: [true],

    programsArr: [[]],
    allPrograms: [true],

    fundersArr: [[]],
    allFunders: [true],

    outletsArr: [[]],
    allOutlets: [true],

    svcprovidersArr: [[]],
    allSvcProviders: [true],

    staffgroupsArr: [[]],
    allGroups: [true],

    staffArr: [[]],
    allStaff: [true],

    incidentArr: [[]],
    allIncidents: [true],

    svcTypeArr: [[]],
    allSvctypes: [true],

    staffsvcNoteArr: [[]],
    allstaffSvcnotes: [true],

    vehiclesArr: [[]],
    allVehicles: [true],

    itemArr: [[]],
    allItems: [true],

    planArr: [[]],
    allPlans: [true],

    caredomainArr: [[]],
    allCareDomains: [true],

    casenotesArr: [[]],
    allCaseNotes: [true],

    disciplineArr: [[]],
    allDisciplines: [true],

    recipientArr: [[]],
    allRecipients: [true],

    CompetenciesArr: [[]],
    allCompetencies: [true],

    staffteamArr: [[]],
    allStaffTeams: [true],

    competeciesgroupArr: [[]],
    allCompetenciesGroup: [true],

    cycleArr: [[]],
    cycles: [true],

    stafftypeArr: [[]],
    allStafftype: [true],

    rostertypeArr: [[]],
    allRostertypes: [true],

    trainingtypeArr: [[]],
    alltrainingtype: [true],

    traccsuserArr: [[]],
    alltraccsusers: [true],

    agencyidArr: [[]],
    allagencies: [true],

    mdstypeArr: [[]],
    allmdstypes: [true],

    paytypeArr: [[]],
    allpaytypes: [true],

    activityArr: [[]],
    allactivities: [true],

    settting_vehicleArr: [[]],
    Allsettting_vehicle: [true],

    incidentcategoryArr: [[]],
    allIncidentcategory: [true],

    OPnotesArr: [[]],
    allOPNotes: [true],

    hrnotesArr: [[]],
    allhrNotes: [true],

    frm_options: [false],
    frm_add_inclusion: [false],
    frm_RosterFormat: [false],
    frm_RosterInclusion: [false],

    frm_CustomRptbtn : [false],
    

    whowhat: [''],
    description: [''],

    mta_time_late: [10],
    mta_time_overstayed: [10],
    mta_time_early: [10],


    

    RecipientLeave: [false],
    RecipientUR: [true],

    activeclients: [false],

    chkbx_incl_staff: [false],
    incl_unapproved_services: [false],
    incl_actuals: [false],
    Incl_inactive: [false],

    
    groupbyCoordinators: [false],
    additionalinfo: [false],
    incl_Contacts: [false],
    excl_missing: [false],
    incl_outstanding: [false],
    incl_archived: [false],
    incl_inactive: [false],
    pgbreak: [false],
    recppgbreak : [false],
    incl_approved_programs: [false],
    includevolunteer: [false],
    includebroker: [false],
    includestaff: [false],
    printaslabel: [false],


    frm_mta_options: [false],
    chkbx_forcedlogon: [false],
    forcedlogon: [false],
    chkbx_not_logon: [false],
    not_logon: [false],
    overstayed: [false],
    chkbx_overstayed: [false],
    chkbx_late: [false],
    late: [false],
    chkbx_leftearly: [false],
    leftearly: [false],
    excludeinactivestaff: [false],

    activestaff: [false],
    

    DBO: [false],
    splitonHyphen: [false],
    allowances: [false],
    InternalCost: [false],
    NotAllocated: [true],
    InfoOnly: [true],
    XtraInfo: [false], 
    InclFinancials: [false],
    ExcluPgeHeader: [false],


    exclude_staff_shiftondate: [false],
    include_enddated: [false],
    exclude_MandatoryChecking : [false],
    include_PrimarySkills: [true],
    include_AdditionalInfo : [false],
    include_unavailability: [false],
    activeStaffonly: [false],
    
    


    

    radioFormat: ['Summary'],

    DatetypeArr: ['Default Date'],
    statuscategoryArr: ['All services'],
    branchprimacyArr: ['Automatic'],
    AGE_ATSI_StatusArr: ['All'],
    Additional_inclusion: ['Default Display'],
    Rpt_Format: ['Detail'],
    Roster_staffinclusion : ['Show Staff Code'],
    

    monthArr: [[]],
    yearArr: [[]],
    FYEnd_MonthArr : [[]],
    FYArr: [[]],

    

}

@Component({
    host: {
        '[style.display]': 'flex',
        '[style.flex-direction]': 'column',
        '[style.overflow]': 'hidden'
    },
    styles: [`
    
    
    
        button {
            width: 220pt !important;
            text-align: left !important;           
        }
        
        .inner-content{
            padding: 0px !important;
        }
       
        fieldset{            
            color: rgb (89,89,89) ! important;
            font-size: 8pt;            
        }
        .btn{
            border:none;
            cursor:pointer;
            outline:none;
            transition: background-color 0.5s ease;
            padding: 5px 7px;
            border-radius: 3px;
            text-align: center !important;        
            width: 100px !important;
        }
        .modalFooter{
            align-content: center;
            text-align: center;
            vertical-align: center;
        }
        label{
            font-weight: bold; 
        }       
        .form-group label{
            font-weight: bold;
        }
        .budget_rpt_select{
            width:120px;

        }
        nz-select{
            width:100%;
        
        }
        label.checks{
            margin-top: 4px;
            font-weight: 300 !important;
        }
        nz-date-picker{
            margin:5pt;
        }
        .inner-content[_ngcontent-wws-c367] {
            padding: 0px !important;
        }
        .spinner{
            margin:1rem auto;
            width:1px;
        }    
        .mta_minutes_frm{
            width:50px;
            height:32px;

        }
        .span{
            font-weight: 300 !important;
        }
        iframe {
            
            height:calc(100vh-300px)
        }
        drawer{
            height:calc(100vh-230px)
           
        }
        
@media only screen 
and (min-width : 1224px) {
    iframe {
        
        height:calc(100vh-300px)
    }
}
@media only screen 
and (min-device-width : 768px) 
and (max-device-width : 1024px) {
    iframe {
        
        height:calc(100vh-300px)
    }
}

       
        
    `],
    templateUrl: './reports.html'
})


export class ReportsAdmin implements OnInit, OnDestroy, AfterViewInit {

    validateForm!: FormGroup;
    tocken :any;

    private unsubscribe: Subject<void> = new Subject();

    bodystyle:object;
    FOReportsbodystyle : object;
    //{ height:'500px', overflow: 'auto'} 
    //Modals visibility
    isVisibleTop = false;
    FOReports = false;
    budgetvisible = false;
    loading: boolean = false;
    tabset = false;
    showtabother = false;
    showtabRostcriteria = false;
    showtabstaffcriteria = false;
    showtabRegcriteria = false;
    showtabrecpcriteria = false;

    //Financial Output Criteri ##EXTRA OPTIONS##
    show = false;
    showoption = true;
    modelwidth = "680px";
    
    test:string; //temp debug

    frm_Date: boolean;
    frm_OneDate: boolean;
    frm_Programs: boolean;
    frm_Branches: boolean;
    frm_Managers: boolean;
    frm_Categories: boolean;
    frm_SVCTypes: boolean;
    frm_vehicles: boolean;
    frm_Incidents: boolean;
    frm_Incidentcategories: boolean;
    frm_Staff: boolean;
    frm_SVCNotes: boolean;
    frm_Recipients: boolean;
    frm_Items: boolean;
    frm_PlanTypes: boolean;
    frm_CareDomain: boolean;
    frm_CaseNots: boolean;
    frm_Disciplines: boolean;
    frm_StaffGroup: boolean;
    frm_CompetenciesGroups: boolean;
    frm_StaffTeam: boolean;
    frm_Competencies: boolean;
    frm_StaffType: boolean;
    frm_Description: boolean;
    frm_TrainingType: boolean;
    frm_MasterRosterCycles: boolean;
    frm_TraccsUsers: boolean;
    frm_Funders: boolean;
    frm_SVCProviders: boolean;
    frm_Outlets: boolean;
    frm_WhoWhat: boolean;

    frm_HRNotes: boolean;
    frm_OPNotes: boolean;
    chkbx_incl_staff: boolean;
    incl_unapproved_services  : boolean;
    incl_actuals : boolean;
    Incl_inactive: boolean; 
    activestaff: boolean;
      
    chkbx_incl_Broker: boolean;
    chkbx_incl_Volunteer: boolean;
    chkbx_incl_approvedPrograms: boolean;
    chkbx_pagebreak: boolean;
    chkbx_recppagebreak : boolean;
    chkbx_incl_inactive: boolean;
    chkbx_incl_outstanding: boolean;
    chkbx_incl_achived: boolean;    
    chkbx_exclude_inactivestaff: boolean;
    chkbx_exclude_staffondate: boolean;
    chkbx_exclude_expirydates: boolean;
    chkbx_incl_Contacts: boolean;
    chkbx_asAddressLabel: boolean;
//    chkbx_incl_additionalInfo: boolean;
    chkbx_incl_activeClients: boolean;
    chkbx_activeClientsonly: boolean;    
    chkbx_grpbyCoordinators: boolean;
    chkbx_incl_activeStaff: boolean;
    chkbx_include_enddated : boolean;
    chkbx_exclude_MandatoryChecking : boolean;
    chkbx_include_PrimarySkills : boolean;
    chkbx_include_AdditionalInfo: boolean;
    chkbx_include_unavailability: boolean;
    chkbx_activeStaffonly: boolean;
    activeStaffonly: boolean;
    
    

    frm_options: boolean;
    frm_add_inclusion: boolean;
    frm_RosterFormat: boolean;
    frm_RosterInclusion:boolean;

    frm_CustomRptbtn: boolean;

    

    frm_mta_options: boolean;
    chkbx_forcedlogon: boolean;
    chkbx_not_logon: boolean;
    not_logon: boolean;
    overstayed: boolean;
    chkbx_overstayed: boolean;
    chkbx_late: boolean;
    late: boolean;
    chkbx_leftearly: boolean;
    leftearly: boolean;


    RecipientLeave: [false];
    RecipientUR: [true];
    
    groupbyCoordinators: [false];
    excludeinactivestaff: boolean;

    activeclients: [false];
    additionalinfo: [false];
    incl_Contacts: [false];
    excl_missing: [false];
    incl_outstanding: [false];
    incl_archived : [false];
    incl_inactive: [false];
    pgbreak: [false];
    recppgbreak : [false];
    incl_approved_programs: [false];
    includevolunteer: [false];
    includebroker: [false];
    includestaff: [false];
    printaslabel: boolean;


    DBO: [false];
    splitonHyphen: [false];
    allowances: [false];
    InternalCost: [false];
    NotAllocated: [true];
    InfoOnly: [true];
    XtraInfo: [false]; 
    InclFinancials: [false];
    ExcluPgeHeader: [false];

    forcedlogon: [false];
    exclude_staff_shiftondate: [false];
    include_enddated: [false];

    radioFormat: ['Summary'];
    exclude_MandatoryChecking : [false];
    include_PrimarySkills: [true];
    include_AdditionalInfo : [false];
    include_unavailability: [false];
   




    /*
        //RecipientLeave    RecipientUR DBO splitonHyphen allowances  InternalCost NotAllocated InfoOnly XtraInfo
        RecipientLeave  = true;   
        RecipientUR  = true;
        DBO  = true;
        splitonHyphen  = true; 
        allowances   = true;
        InternalCost  = true;
        NotAllocated  = true;
        InfoOnly  = true;
        XtraInfo = true;
     */


    checked = true;
    State = true;
    Branches = true;
    Area = true;
    Managers = true;
    Funders = true;
    ProviderID = true;
    listOfControl: Array<{ id: number; controlInstance: string }> = [];
    manager: String[];
    form: FormGroup;

    statesArr: Array<any> = states;
    branchesArr: Array<any> = [];
    serviceRegionsArr: Array<any> = [];
    managersArr: Array<any> = [];
    fundersArr: Array<any> = [];
    fundingRegionsArr: Array<any> = [];
    programsArr: Array<any> = [];
    outletsArr: Array<any> = [];
    svcprovidersArr: Array<any> = [];
    staffgroupsArr: Array<any> = [];
    staffArr: Array<any> = [];
    vehiclesArr: Array<any> = [];
    svcTypeArr: Array<any> = [];
    staffsvcNoteArr: Array<any> = [];    
    disciplineArr: Array<any> = [];
    casenotesArr: Array<any> = [];
    caredomainArr: Array<any> = [];
    planArr: Array<any> = [];
    itemArr: Array<any> = [];
    recipientArr: Array<any> = [];
    incidentArr: Array<any> = [];
    CompetenciesArr: Array<any> = [];
    staffteamArr: Array<any> = [];
    competeciesgroupArr: Array<any> = [];
    cycleArr: Array<any> = constants.fundingDropDowns.cycle;
//    cycleArr: Array<any> = ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7', 'Cycle 8', 'Cycle 9', 'Cycle 10'];
stafftypeArr: Array<any> = constants.types;
    //stafftypeArr: Array<any> = ['BROKERAGE ORGANISATION', 'STAFF', 'VOLUNTEER']
    trainingtypeArr: Array<any> = [];
    traccsuserArr: Array<any> = [];
    rostertypeArr: Array<{ label: string; value: string }> =  [
        {label:"BOOKINGS",value:"01"},{label:"DIRECT CARE",value:"02"},{label:"BROKERAGE",value:"03"},{label:"LEAVE/ABSENCE",value:"04"},{label:"TRAVEL TIME",value:"05"}
        ,{label:"ADMINISTRATION",value:"06"},{label:"ADMISSION SERVICES",value:"07"},{label:"SLEEPOVERS",value:"08"},{label:"ALLOWANCES",value:"09"},{label:"TRANSPORT",value:"10"}
        ,{label:"CENTRE BASED ACTIVITIES",value:"11"},{label:"GROUP BASED ACTIVITIES",value:"12"},{label:"MEALS",value:"14"}

    ] ;//['01-BOOKINGS', '02-DIRECT CARE','03-BROKERAGE','04-LEAVE/ABSENCE', '05-TRAVEL TIME',  '06-ADMINISTRATION','07-ADMISSION SERVICES',  '08-SLEEPOVERS','09-ALLOWANCES',  '10-TRANSPORT','11-CENTRE BASED ACTIVITIES', '12-GROUP BASED ACTIVITIES', '14-MEALS'  ];
    mdstypeArr: Array<any> = [];
    agencyidArr: Array<any> = [];
    paytypeArr: Array<any> = [];
    activityArr: Array<any> = [];
    settting_vehicleArr: Array<any> = [];
    OPnotesArr: Array<any> = [];
    hrnotesArr: Array<any> = [];
    DatetypeArr: Array<any> = ['Billing Date', 'Pay Period EndDate', 'Service Date','Default Date'];
    statuscategoryArr: Array<any> = ['All services', 'Approved Services Only', 'UnApproved Services Only'];
    branchprimacyArr: Array<any> = ['Automatic', 'Recipient Branch Overrides ', 'Staff Branch Overrides '];
    AGE_ATSI_StatusArr: Array<any> = ['All','Over 64 OR ATSI Over 49   ', 'Under 65 OR ATSI under 50'];
    incidentcategoryArr: Array<any> = ['Open', 'Close'];
    Additional_inclusion: Array<any> = [];
    RosterCategory: Array<any> = []; 
    UserRptButtonlist : Array<any>= [];
    UserSTFButtonlist : Array<any> = [];
    AGENCYSTFButtonlist : Array<any> = [];
    RecpUserRptButtonlist : Array<any> = [];
    UserRptFormatlist : Array<any> = [];
    UserRptSQLlist : Array<any> = [];
    DataArra : Array<any> = [];
    Rpt_Format : Array<any> = [];
    Roster_staffinclusion   : Array<any> = [];
    
    monthArr: Array<any> = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    yearArr: Array<any> = [];
    FYEnd_MonthArr : Array<any> = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    FYArr: Array<any> = [];



    whowhat: string;
    description: string;


    mta_time_late: string;
    mta_time_overstayed: string;
    mta_time_early: string;

    ModalName: string;
    FORptModelTitle: string;
    btnid: string;
    id: string;
    tryDoctype: any;
    pdfTitle: string;
    s_BranchSQL: string;
    s_CoordinatorSQL: string;
    s_ProgramSQL: string;
    s_CategorySQL: string;
    s_DateSQL: string;
    s_StfGroupSQL: string;
    s_StfSQL: string;
    s_RecipientSQL: string;
    s_IncedentTypeSQL: string;
    s_SvcTypeSQL: string;
    s_incidentCategorySQL: string;
    s_loanitemsSQL: string;
    s_loancategorySQL: string;
    s_StaffSQL: string;
    s_CompetencyGroupSQL: string;
    s_CompetencySQL: string;
    s_StfTeamSQL: string;
    s_StafftypeSQL: string;
    s_PlantypeSQL: string;
    s_CaseNoteSQL: string;
    s_SvcNoteSQL: string;
    s_CareDomainSQL: string;
    s_DisciplineSQL: string;
    s_TrainingTypeSQL: string;
    s_whowhatSQL: string;
    s_DescribeSQL: string;
    s_TraccsuserSQL: string;
    s_AgeSQL: string;
    s_MdsAgencySQL: string;
    s_RosterCategorySQL: string;
    s_FundersSQL: string;
    s_DatetypeSQL: string;
    s_OutletIDSQL: string;
    s_HACCCategorySQL: string;
    s_statusSQL: string;
    s_paytypeSQL: string;
    s_activitySQL: string;
    s_setting_vehicleSQL: string;
    reportid: string;

    dateFormat: string = 'dd/MM/yyyy'
    enddate: Date;
    startdate: Date;
    fiscalyear : Date;
    endmonth : Date;
    year : Date;
    startmonth: Date;
    

    //   enddate: string ;  defaultsratdate defaultenddate
    //   startdate: string ;
    //format(new Date(), 'dd/MM/yyyy');   

    //rpthttp = 'https://45.77.37.207:5488/api/report';
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    // rpthttp = 'https://127.1.1.1:5488/api/report';
  
    dropDownArray: any = {
        branches: Array,
        serviceRegions: Array,
        managers: Array,
        programs: Array,

    }

    inputForm: FormGroup;
    drawerVisible: boolean = false;


    listOfOption: Array<{ label: string; value: string }> = [];
    multipleValue = ['a10', 'c12'];


    constructor(
        
        private listS: ListService,
        private TimesheetS: TimeSheetService,
        private ReportS: ReportService,
        private GlobalS:GlobalService,
        private menuS:MenuService,
        private http: HttpClient,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService,
        private router: Router,
        private route: ActivatedRoute,
        private printS: PrintService,
        private cd: ChangeDetectorRef,
    ) {

    }
    ngOnInit(): void {
    
        this.CustomReportSetting();
        
           //recepientincident
        const children: Array<{ label: string; value: string }> = [];
        this.tocken = this.GlobalS.pickedMember ? this.GlobalS.GETPICKEDMEMBERDATA(this.GlobalS.GETPICKEDMEMBERDATA):this.GlobalS.decode();
        for (let i = 10; i < 36; i++) {
            children.push({ label: i.toString(36) + i, value: i.toString(36) + i });

        }
        
        
        var date = new Date();
        let temp = new Date(date.getFullYear(), date.getMonth(), 1);
        let temp1 = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        this.startdate = temp;
        this.enddate = temp1;

      
        

        

        this.listOfOption = children;
        this.inputForm = this.fb.group(inputFormDefault);
    

        this.inputForm.get('allPrograms').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                programsArr: []
            });
        });

        this.inputForm.get('allVehicles').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                vehiclesArr: []
            });
        });

        /*  
        this.inputForm.get('allOutlets').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                outletsArr: []
            });
        });
        */

        this.inputForm.get('allFunders').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                fundersArr: []
            });
        });

        this.inputForm.get('allSvcProviders').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                svcprovidersArr: []
            });
        });




        this.inputForm.get('allState').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                statesArr: []
            });
        });

        this.inputForm.get('allBranches').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                branchesArr: []
            });
        });

        this.inputForm.get('allServiceRegion').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                serviceRegionsArr: []
            });
        });

        this.inputForm.get('allManager').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                managersArr: []
            });
        });
        this.inputForm.get('allGroups').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                staffgroupsArr: []
            });
        });
        this.inputForm.get('allStaff').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                staffArr: []
            });
        });

        this.inputForm.get('allSvctypes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                svcTypeArr: []
            });
        });
        this.inputForm.get('allstaffSvcnotes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                staffsvcNoteArr: []
            });
        });
        
        this.inputForm.get('allDisciplines').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                disciplineArr: []
            });
        });
        this.inputForm.get('allCareDomains').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                caredomainArr: []

            });
        });
        this.inputForm.get('allItems').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                itemArr: []
            });
        });
        this.inputForm.get('allIncidents').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                incidentArr: []
            });
        });
        this.inputForm.get('allCaseNotes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                casenotesArr: []
            });
        });
        this.inputForm.get('allPlans').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                planArr: []
            });
        });
        this.inputForm.get('allRecipients').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                recipientArr: []
            });
        });


        this.inputForm.get('allCompetencies').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                CompetenciesArr: []
            });
        });
        this.inputForm.get('allStaffTeams').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                staffteamArr: []
            });
        });
        this.inputForm.get('allCompetenciesGroup').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                competeciesgroupArr: []
            });
        });

        this.inputForm.get('cycles').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                cycleArr: []
            });
        });

        this.inputForm.get('allStaff').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                stafftypeArr: []
            });
        });
        this.inputForm.get('allRostertypes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                rostertypeArr: []
            });
        });
        this.inputForm.get('alltrainingtype').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                trainingtypeArr: []
            });
        });

        this.inputForm.get('alltraccsusers').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                traccsuserArr: []
            });
        });

        this.inputForm.get('allmdstypes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                mdstypeArr: []
            });
        });
        this.inputForm.get('allagencies').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                agencyidArr: []
            });
        });
        this.inputForm.get('allpaytypes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                paytypeArr: []
            });
        });
        this.inputForm.get('allactivities').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                activityArr: []
            });
        });
        this.inputForm.get('Allsettting_vehicle').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                settting_vehicleArr: []
            });
        });
        this.inputForm.get('allIncidentcategory').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                incidentcategoryArr: []
            });
        });
        this.inputForm.get('allOPNotes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                OPnotesArr: []
            });
        });
        this.inputForm.get('allhrNotes').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                hrnotesArr: []
            });
        });

        
       var tempkey = (this.GlobalS.var1).toString();
      
        switch (tempkey) {
            case 'IncidentRegister':
               
                this.showModal("btn-Regis-incidentregister");

                
                break;
        
            default:
               
                break;
        }  

        


    }//ngOninit  

    /*   hello(data: any){
           console.log(data)
           console.log(this.inputForm.value.branchesArr)
       }
   */
    ngAfterViewInit(): void {

        this.listS.getreportcriterialist({
            listType: 'FUNDERS',
            includeInactive: false
        }).subscribe(x => this.fundersArr = x);

        this.listS.getreportcriterialist({
            listType: 'SERVICE PROVIDERS',
            includeInactive: false
        }).subscribe(x => this.svcprovidersArr = x);
        ////svcTypeArr    allSvctypes
        this.listS.getcstdaoutlets().subscribe(x => this.outletsArr = x);
        this.listS.GetVehicles().subscribe(x => this.vehiclesArr = x);
        this.listS.GetStaffServiceTypes().subscribe(x => this.svcTypeArr = x);
        this.listS.getstaffcategory().subscribe(x => this.staffsvcNoteArr = x);        
        this.listS.GetRecipientAll().subscribe(x => this.recipientArr = x);
        this.listS.Getrpttraccsuser().subscribe(x => this.traccsuserArr = x);
        this.listS.Getrptagencyid().subscribe(x => this.agencyidArr = x);
        this.listS.Getrptmdstype().subscribe(x => this.mdstypeArr = x);
        this.listS.Getrptpaytype().subscribe(x => this.paytypeArr = x);
        this.listS.Getrptactivity().subscribe(x => this.activityArr = x);


        
    //    this.listS.GetAllPrograms().subscribe(x => this.programsArr = x);
        this.listS.getreportcriterialist({
            listType: 'PROGRAMS',
            includeInactive:false
        }).subscribe(x => this.programsArr = x);
        
        this.listS.getreportcriterialist({
            listType: 'BRANCHES',
            includeInactive: false
        }).subscribe(x => this.branchesArr = x);

        this.listS.getcasenotecategory(0).subscribe(x => this.casenotesArr = x);
        this.listS.getcasenotecategory(1).subscribe(x => this.OPnotesArr = x);
        this.listS.Getrptincidents().subscribe(x => this.incidentArr = x);
        this.listS.GetrptLoanItems().subscribe(x => this.itemArr = x);
        this.listS.getstaffdiscipline().subscribe(x => this.disciplineArr = x)
        this.listS.getstaffcaredomain().subscribe(x => this.caredomainArr = x)
        this.listS.getserviceregion().subscribe(x => this.serviceRegionsArr = x)
        this.listS.Getrptcasenotes().subscribe(x => this.casenotesArr = x)
        this.listS.Getrptiplantypes().subscribe(x => this.planArr = x)
        this.listS.GetTraccsStaffCodes().subscribe(x => this.staffArr = x)
        this.listS.GetCopetencyGroup().subscribe(x => this.competeciesgroupArr = x)
        this.listS.getliststaffteam().subscribe(x => this.staffteamArr = x)
        this.TimesheetS.getcompetenciesall().subscribe(x => this.CompetenciesArr = x)
        this.listS.Getrpttrainingtype().subscribe(x => this.trainingtypeArr = x)
        this.listS.Getrptsettings_vehicles().subscribe(x => this.settting_vehicleArr = x)


        this.listS.getreportcriterialist({
            listType: 'MANAGERS',
            includeInactive: false
        }).subscribe(x => this.managersArr = x)

        this.listS.getreportcriterialist({
            listType: 'FUNDERS',
            includeInactive: false
        }).subscribe(x => this.fundersArr = x)

        this.listS.getreportcriterialist({
            listType: 'FUNDINGREGIONS',
            includeInactive: false
        }).subscribe(x => this.fundingRegionsArr = x)

        this.listS.getliststaffgroup().subscribe(x => this.staffgroupsArr = x)



    }

    ngOnDestroy(): void {
        console.log('on destroy');

    }
    ResetVisibility() {

        this.frm_Date = false;
        this.frm_OneDate = false;
        this.frm_Programs = false;
        this.frm_Branches = false;
        this.frm_Managers = false;
        this.frm_Categories = false;
        this.frm_SVCTypes = false;
        this.frm_vehicles = false;
        this.frm_Incidents = false;
        this.frm_Incidentcategories = false;
        this.frm_Staff = false;
        this.frm_SVCNotes = false;
        this.frm_Recipients = false;
        this.frm_Items = false;
        this.frm_PlanTypes = false;
        this.frm_CareDomain = false;
        this.frm_CaseNots = false;
        this.frm_Disciplines = false;
        this.frm_StaffGroup = false;
        this.frm_CompetenciesGroups = false;
        this.frm_StaffTeam = false;
        this.frm_Competencies = false;
        this.frm_StaffType = false;
        this.frm_Description = false;
        this.frm_TrainingType = false;
        this.frm_MasterRosterCycles = false;
        this.frm_TraccsUsers = false;
        this.frm_Funders = false;
        this.frm_SVCProviders = false;
        this.frm_Outlets = false;
        this.frm_WhoWhat = false;
        this.frm_HRNotes = false;
        this.frm_OPNotes = false;

        this.chkbx_incl_staff = false;
        this.incl_unapproved_services  = false;
        this.incl_actuals = false;
        this.Incl_inactive= false;
        
        this.chkbx_incl_Broker = false;
        this.chkbx_incl_Volunteer = false;
        this.chkbx_incl_approvedPrograms = false;
        this.chkbx_pagebreak = false;
        this.chkbx_recppagebreak = false;
        this.chkbx_incl_inactive = false;
        this.chkbx_incl_outstanding = false;
        this.chkbx_incl_achived = false;
        this.chkbx_exclude_inactivestaff = false;
        this.chkbx_exclude_staffondate = false;
        this.chkbx_exclude_expirydates = false;
        this.chkbx_incl_Contacts = false;
        this.chkbx_asAddressLabel = false;
//       this.chkbx_incl_additionalInfo = false;
        this.chkbx_incl_activeClients = false;
        this.chkbx_activeClientsonly = false;         
        this.chkbx_include_enddated = false;
        this.chkbx_exclude_MandatoryChecking = false;
        this.chkbx_include_PrimarySkills= false;
        this.chkbx_include_AdditionalInfo = false;
        this.chkbx_include_unavailability = false;
        this.chkbx_activeStaffonly= false;
        

        
        
        this.chkbx_grpbyCoordinators = false;
        this.chkbx_incl_activeStaff = false;
        this.frm_options = false;
        this.frm_add_inclusion = false;
        this.frm_RosterFormat= false;
        this.frm_RosterInclusion = false;
        this.frm_mta_options = false;

        this.RosterCategory = []; 
        //this.UserRptButtonlist = [];
        this.UserRptFormatlist = [];
        this.UserRptSQLlist = [];



        this.ModalName = " CRITERIA "
        
    }
    toggle() {
        this.show = !this.show;
        this.showoption = !this.showoption;
        if (this.show == true) {
            this.modelwidth = "680";
            this.FOReportsbodystyle = { height:'500px', overflow: 'auto' }
            
        }
        else {
            this.modelwidth = "680px";
            this.FOReportsbodystyle = { height:'300px', overflow: 'auto' }
        } 
    }
    showUserReport(e) {
        e = e || window.event;
        e = e.target || e.srcElement;
        if(e.id !== null){this.GlobalS.var2 = e.id.toString();}
        //console.log(this.GlobalS.var2)
        this.router.navigate(['/admin/user-reports']);
      
    }
    yearrange(){
       
        for (let index = 0; index < 23; index++) {
            
           let year = 1999 + index
           
            this.yearArr[index] = year;
            this.FYArr[index] = year;   
            
           
        }        
    }
    showModal(e) {
       //console.log(e)
       switch (e) {
           case 'btn-Regis-incidentregister':
            this.btnid = "btn-Regis-incidentregister"
               break;
       
           default:
                e = e || window.event;
                e = e.target || e.srcElement;
                this.btnid = (e.id).toString();
                // this.GlobalS.var2 = this.btnid
                this.test = this.btnid
                this.ModalS.closeAll();
                var lftstr = e.id.substring(0, 10)
                //    alert(lftstr)
        break;
    }       
        //Criteria Items/Lists Visibility   
        this.ResetVisibility();
        this.inputForm = this.fb.group(inputFormDefault);
        
        
        
      
        switch (this.btnid) {
            case 'btn-refferallist':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "REFERRAL LIST  "
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_incl_Contacts = true;
                this.chkbx_asAddressLabel = true;

                break;
                case 'btn-waitinglist':
                    this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "WAITING LIST  "
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_incl_Contacts = true;
                this.chkbx_asAddressLabel = true;

                break;
            case 'btn-activepackagelist':
                this.bodystyle = { height:'350px', overflow: 'auto'}
                this.ModalName = "ACTIVE PACKAGE REPORT  "
                this.frm_Date = true;
                this.frm_Programs = true;
                this.frm_Funders = true;
                break;
            case 'btn-recipientroster':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "RECIPIENT ROSTER "
                this.frm_Date = true;
                this.frm_Recipients = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.chkbx_recppagebreak = true;
                this.chkbx_include_AdditionalInfo = true;
                this.frm_RosterFormat = true;
                this.frm_RosterInclusion = true;
                this.Rpt_Format = ['Presentation - with Activity', 'Presentation - with No Activity', 'Detail']   
                this.Roster_staffinclusion   = ['Show Staff Code','Show Staff First Name','Show Staff #'] ;
               
               
                break;
            case 'btn-suspendedrecipient':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "SUSPENDED RECIPIENT REPORT  "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_asAddressLabel = true;
                break;
            case 'btn-vouchersummary':
                this.bodystyle = { height:'300px', overflow: 'auto'}
                this.ModalName = "VOUCHER SUMMARY REPORT "
                this.frm_Date = true;
                this.frm_Recipients = true;
                this.frm_Programs = true;
                break;
            case 'btn-packageusage':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "PACKAGE USAGE REPORT"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_incl_approvedPrograms = true;
                this.chkbx_incl_inactive = true;
                break;
            case 'btn-timelength':
                this.bodystyle = { height:'200px', overflow: 'auto'}
                this.ModalName = "RECIPIENTS TIME LENGTH REPORT "
                this.frm_Date = true;
                break;
            case 'btn-unallocatedbookings':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "UNFILLED BOOKINGS "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_SVCTypes = true;
                break;
            case 'btn-transportsummary':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "TRANSPORT SUMMARY REPORT "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_vehicles = true;
                break;
            case 'btn-refferalduringperiod':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = " REFERRAL DURING PERIOD"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;
                this.frm_Categories = true;
                break;
            case 'btn-recipientMasterroster':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "RECIPINT MASTER ROSTER  "
                this.frm_MasterRosterCycles = true;
                this.frm_Recipients = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.chkbx_recppagebreak = true;
                this.chkbx_include_AdditionalInfo = true;
                this.frm_RosterFormat = true;
                this.frm_RosterInclusion = true;
                this.Rpt_Format = ['Presentation - with Activity', 'Presentation - with No Activity', 'Detail']   
                this.Roster_staffinclusion   = ['Show Staff Code','Show Staff First Name','Show Staff #'] ;
                
                break;
            case 'btn-activerecipient':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ACTIVE RECIPIENT LIST  "
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display', 'Include Contacts']
                this.chkbx_asAddressLabel = true;                
                this.chkbx_incl_inactive = true;
                this.chkbx_incl_approvedPrograms = true;
                break;
            case 'btn-inactiverecipient':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "INACTIVE RECIPIENT LIST  "
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_asAddressLabel = true;
                this.chkbx_incl_Contacts = true;
                break;
            case 'btn-adminduringperiod':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ADMISSIONS DURING PERIOD  "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;
                this.frm_Categories = true;
                break;
            case 'btn-dischargeduringperiod':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "DISCHARGES DURING PERIOD  "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;

                break;
            case 'btn-absentclient':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ABSENT CLIENT STATUS REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;
                this.frm_Categories = true;
                break;
            case 'btn-careerlist':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "CARER LIST  "
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_asAddressLabel = true;
                this.chkbx_incl_Contacts = true;
                this.chkbx_incl_inactive = true;
                break;
            case 'btn-onlybillingclients':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ONLY BILLING CLIENTS LIST "
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_asAddressLabel = true;
                this.chkbx_incl_Contacts = true;
                this.chkbx_incl_inactive = true;
                break;
            case 'btn-associatelist':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ASSOCIATE LIST"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_asAddressLabel = true;
                this.chkbx_incl_Contacts = true;
                this.chkbx_incl_inactive = true;
                break;
            case 'btn-unserviced':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "UNSERVICED RECIPIENTS REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_options = true;
            //    this.chkbx_incl_activeClients = true;
                this.chkbx_activeClientsonly= true; 
                break;
            case 'btn-staff-Activestaff':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ACTIVE STAFF LIST "
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_Managers = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display', 'Include Staff Code', 'Include Staff ID']
                this.chkbx_asAddressLabel = true;
                break;                
                case 'btn-staff-competencyRegister':
                    this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF COMPETENCY REGISTER "
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_StaffGroup = true;
                this.frm_Competencies = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display']                
                this.chkbx_exclude_MandatoryChecking = true;
                this.chkbx_include_PrimarySkills= true;
                this.chkbx_incl_staff = true;
                this.chkbx_incl_Volunteer = true;
                this.chkbx_incl_Broker = true;
                break;
            case 'btn-staff-ActiveBrokerage':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ACTIVE BROKERAGE/CONTRACTOR LIST "
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_Managers = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display', 'Include Staff Code', 'Include Staff ID']
                this.chkbx_asAddressLabel = true;
                break;
            case 'btn-staff-Activevolunteers':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ACTIVE VOLUNTEER REPORT "
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_Managers = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display', 'Include Staff Code', 'Include Staff ID']
                this.chkbx_asAddressLabel = true;
                break;
            case 'btn-staff-InactiveBrokerage':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "INACTIVE BROKERAGE/CONTRACTOR LIST "
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display', 'Include Staff Code', 'Include Staff ID']
                this.chkbx_asAddressLabel = true;
                break;
            case 'btn-staff-InactiveVolunteer':
                this.bodystyle = { height:'400px', overflow: 'auto'}    
                this.ModalName = "INACTIVE VOLUNTEER "
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display', 'Include Staff Code', 'Include Staff ID']
                this.chkbx_asAddressLabel = true;
                break;

            case 'btn-staff-Inactivestaff':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "INACTIVE STAFF LIST  "
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.frm_add_inclusion = true;
                this.Additional_inclusion = ['Default Display', 'Include Staff Code', 'Include Staff ID']
                this.chkbx_asAddressLabel = true;
                break;
            case 'btn-staff-Userpermissions':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF USER PERMISSIONS"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_add_inclusion = true;
                this.chkbx_asAddressLabel = true;
                break;
            case 'btn-Regis-mealregisterreport':
                this.bodystyle = { height:'250px', overflow: 'auto'}
                this.ModalName = "MEAL ORDER REPORT "
                this.frm_Date = true;
                this.frm_Recipients = true;
                break;
            case 'btn-Regis-LagTimeRegister':
                this.bodystyle = { height:'350px', overflow: 'auto'}
                this.ModalName = "LAG TIME REGISTER"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                break;
                case 'btn-Regis-masterrosteredhoursreport':
                this.bodystyle = { height:'300px', overflow: 'auto'}
                this.ModalName = "MASTER ROSTERED HOURS REGISTER "
                this.frm_MasterRosterCycles = true;
                this.frm_Programs = true;
                break;
                
            case 'btn-Regis-hasreport':
                this.bodystyle = { height:'200px', overflow: 'auto'}
                this.ModalName = "HAS REPORT "
                this.frm_Date = true;
                this.frm_Programs = true;
                break;
            case 'btn-Regis-cdcleavereport':
                this.bodystyle = { height:'350px', overflow: 'auto'}
                this.ModalName = "CDC LEAVE REPORT "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                break;
            case 'btn-Regis-cdcpackagebalance':
                this.bodystyle = { height:'350px', overflow: 'auto'}
                this.ModalName = "CDC PACKAGE BALANCE REGISTER "
                this.frm_Date = true;
                this.frm_Recipients = true;
                this.frm_Programs = true;
                break;
            case 'btn-Regis-incidentregister':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "RECIPIENT INCIDENT REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_SVCTypes = true;
                this.frm_Staff = true;
                this.frm_Incidentcategories = true;
                this.frm_Incidents = true;

                break;
            case 'btn-Regis-loanregister':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "RECIPIENT LOAN REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Recipients = true;
                this.frm_Items = true;
                this.frm_Categories = true;
                this.frm_options = true;
                this.chkbx_incl_inactive = true;
                this.chkbx_incl_outstanding = true;
                break;
            case 'btn-staff-leaveregister':
                this.bodystyle = { height:'200px', overflow: 'auto'}
                this.ModalName = "STAFF LEAVES REGISTER "
                this.frm_Date = true;
                break;
                case 'btn-staff-svcnotesregister':
                this.bodystyle = { height:'450px', overflow: 'auto'}
                this.ModalName = "STAFF SERVICE NOTES REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_SVCNotes = true;
                this.frm_options = true;
                this.chkbx_incl_achived = true;
                break;
                
            case 'btn-staff-staffnotworked':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF NOT WORKED REGISTER"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.chkbx_activeStaffonly = true;
                break;
            case 'btn-staff-competencyrenewal':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF COMPETENCY RENEWAL "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_Competencies = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;                
                this.frm_CompetenciesGroups = true;
                this.frm_options = true;
                this.chkbx_asAddressLabel = true;
                this.chkbx_exclude_expirydates = true;
                this.chkbx_incl_inactive = true;
                this.chkbx_grpbyCoordinators = true;
                this.chkbx_incl_staff = true;
                this.chkbx_incl_Volunteer = true;
                this.chkbx_incl_Broker = true;
                break;
            case 'btn-staff-unavailability':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF UNAVAILABILITY "
                this.frm_Date = true;
                this.frm_Staff = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.chkbx_include_AdditionalInfo = true;

                break;
            case 'btn-staff-Roster':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF ROSTER CRITERIA"
                this.frm_Date = true;
                this.frm_Staff = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.chkbx_include_AdditionalInfo = true;
                this.chkbx_include_unavailability = true;
                
                break;
            case 'btn-staff-MasterRoster':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF MASTER ROSTER "
                this.frm_MasterRosterCycles = true;
                this.frm_Staff = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;
                this.frm_options = true;
                this.chkbx_include_AdditionalInfo = true;
                break;
            case 'btn-staff-loanregister':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF LOAN REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Staff = true;
                this.frm_Items = true;
                this.frm_StaffGroup = true;                
                this.frm_options = true;
                this.chkbx_incl_outstanding = true;
                break;                
            case 'btn-staff-staffservicenotesreg':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF SERVICE NOTES REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_CaseNots = true;
                this.frm_Staff = true;                
                break;
            case 'btn-Regis-progcasenotes':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "RECIPIENT CASE/PROGRESS NOTES REGISTER " 
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_CaseNots = true;
                this.frm_Recipients = true;
                this.frm_Disciplines = true;
                this.frm_CareDomain = true;
                this.frm_Programs = true;
                this.frm_Categories = true;
                this.frm_Managers = true;
                break;
            case 'btn-Regis-servicenotesreg':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "SERVICE NOTES REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_CaseNots = true;
                this.frm_Recipients = true;
                this.frm_Disciplines = true;
                this.frm_CareDomain = true;
                this.frm_Programs = true;
                break;            
            case 'btn-regis-serviceplan':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "SERVICE PLAN REGISTER "
                this.frm_Branches = true;
                this.frm_Programs = true;                
                this.frm_Recipients = true;
                this.frm_Managers = true;
                this.frm_Categories = true;                
                break;   
            case 'btn-Regis-opnotesregister':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "OPERATIONAL NOTES REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_OPNotes = true;
                this.frm_Recipients = true;
                this.frm_Disciplines = true;
                this.frm_CareDomain = true;
                this.frm_Programs = true;

                break;
            case 'btn-Regis-careplanstatus':
                this.bodystyle = { height:'350px', overflow: 'auto'}
                this.ModalName = "CARER PLAN STATUS "
                this.frm_Date = true;
                this.frm_PlanTypes = true;
                this.frm_Recipients = true;
                break;
            case 'btn-staff-availability':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "STAFF AVAILABILITY REGISTER "
                this.frm_OneDate = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_options = true;
                this.chkbx_exclude_staffondate = true;
                break;
            case 'btn-staff-timeattandencecomp':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "TIME & ATTENDANCE COMPARISON"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_options = true;
                this.chkbx_incl_inactive = true;
                break;
            case 'btn-staff-hrnotesregister':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "HR NOTES REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_HRNotes = true;
                this.frm_Staff = true;
                this.frm_options = true;
                this.chkbx_pagebreak = true;
                break;
            case 'btn-staff-opnotes':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF OPERATIONAL NOTES REGISTER"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_OPNotes = true;
                this.frm_Staff = true;
                this.frm_Disciplines = true;
                this.frm_CareDomain = true;
                this.frm_Programs = true;
                break;
            case 'btn-staff-incidentregister':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF INCIDENT REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_SVCTypes = true;
                this.frm_Staff = true;
                this.frm_StaffGroup = true;
                this.frm_Incidents = true;
                break;
            case 'btn-staff-training':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF TRAINING REGISTER "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_Programs = true;
                this.frm_TrainingType = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_StaffTeam = true;
                this.frm_options = true;
                this.chkbx_exclude_inactivestaff = true;

                break;
            case 'btn-competenciesrenewal':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "STAFF COMPETENCIES RENEWAL "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_Competencies = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;
                this.frm_StaffGroup = true;
                this.frm_CompetenciesGroups = true;
                this.frm_options = true;
                this.chkbx_asAddressLabel = true;
                this.chkbx_exclude_expirydates = true;
                this.chkbx_incl_inactive = true;
                this.chkbx_grpbyCoordinators = true;
                this.chkbx_incl_staff = true;
                this.chkbx_incl_Volunteer = true;
                this.chkbx_incl_Broker = true;
                break;
            case 'btn-Systm-AuditRegister':
                this.bodystyle = { height:'400px', overflow: 'auto'}
                this.ModalName = "AUDIT REGISTER "
                this.frm_Date = true;
                this.frm_TraccsUsers = true;
                this.frm_WhoWhat = true;
                this.frm_Description = true;
                break;
            case 'btn-Systm-ActivityStatusAudit':
                this.bodystyle = { height:'250px', overflow: 'auto', top:'50px'}
                this.ModalName = "PROGRAM ACTIVITY STATUS AUDIT "
                this.frm_Programs = true;
                this.chkbx_include_enddated = true;
                this.frm_options = true;
                break;
            case 'btn-Systm-MTARegister':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "MTA REGISTER "
                this.frm_Date = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_Recipients = true;
                this.frm_Staff = true;

                this.frm_mta_options = true;
                this.chkbx_late = true;

                this.chkbx_leftearly = true;
                this.chkbx_overstayed = true;
                this.chkbx_not_logon = true;
                this.chkbx_forcedlogon = true;
                break;
            case 'btn-Systm-RosterOverlap':
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.ModalName = "ROSTER OVERLAP REGISTER"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Recipients = true;
                this.frm_Staff = true;
                this.frm_Programs = true;
                break;
            case 'btn-Systm-MTAVerification':
                this.ModalName = "MTA ATTENDANCE VERIFICATION "
                this.bodystyle = { height:'500px', overflow: 'auto'}
                this.frm_Date = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_Recipients = true;
                this.frm_Staff = true;

                this.frm_mta_options = true;
                this.chkbx_late = true;

                this.chkbx_leftearly = true;
                this.chkbx_overstayed = true;
                this.chkbx_not_logon = true;
                this.chkbx_forcedlogon = true;
                break;
            case 'btn-UnsedFunding':
                this.ModalName = "RECIPIENT UNUSED FUNDING REPORT "
                this.frm_Recipients = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-BudgetAuditReport':
                this.ModalName = "PROGRAM BUDGET AUDIT REPORT "
                this.frm_Branches = true;
                this.frm_Programs = true;
                break;
            case 'btn-ProgramSummaryRpt':
                this.ModalName = "PROGRAM SUMMARY REPORT"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-report-fundingAuditReport':
                this.bodystyle = { height:'200px', overflow: 'auto'}
                this.ModalName = "FUNDING AUDIT REPORT"
                this.frm_Date = true;
                break;
            case 'btn-report-UnbilledItems':
                this.bodystyle = { height:'450px', overflow: 'auto'}
                this.ModalName = "UNBILLED ITEMS REPORT "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_SVCTypes = true;
                break;
            case 'btn-report-BilledItems':
                this.bodystyle = { height:'450px', overflow: 'auto'}
                this.ModalName = "BILLED ITEMS REPORT "
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_SVCTypes = true;
                break;
            case 'btn-report-DatasetUnitCost':
                this.bodystyle = { height:'350px', overflow: 'auto'}
                this.ModalName = "DATASET RECIPIENT UNIT COST"
                this.frm_Date = true;
                this.frm_Recipients = true;
                this.frm_SVCTypes = true;
                break;
            case 'btn-FORPT-ProgramActivitySpread':
               this.FORptModelTitle = "PROGRAM ACTIVITY SPREAD " ;                 
                break;                
            case 'btn-FORPT-AwardStaffPayRpt':
               this.FORptModelTitle = "AWARD STAFF PAY REPORT " ;                 
                break;                
            case 'btn-FORPT-AwardStaffProgramPayRpt':
                this.FORptModelTitle = "AWARD STAFF PROGRAM PAY REPORT " ;                 
                    break;
            case 'btn-FORPT-ProgramStaffUtilized':
                this.FORptModelTitle = "PROGRAM STAFF UTILIZED " ;
             break;
             case 'btn-FORPT-ProgramRecipientServiced':
                this.FORptModelTitle = "PROGRAM RECIPIENT SERVICED " ;
             break;
             case 'btn-FORPT-ProgramBillingReport':
                this.FORptModelTitle = "PROGRAM BILLING REPORT" ;
             break;
             case 'btn-FORPT-ActivityRecipientRpt':
                this.FORptModelTitle = "ACTIVITY RECIPIENT REPORT" ;
             break;
             case 'btn-FORPT-ActivityProgramRpt':
                this.FORptModelTitle = "ACTIVITY PROGRAM REPORT" ;
             break;
             case 'btn-FORPT-ActivityStaff':
                this.FORptModelTitle = "ACTIVITY STAFF REPORT" ;
             break;
           
             case 'btn-FORPT-ActivityGroupRpt':
                this.FORptModelTitle = "ACTIVITY GROUP  REPORT" ;
             break;
            /* case 'btn-FORPT-fundingAuditReport':
                this.FORptModelTitle = "FUNDING AUDIT REPORT CRITERIA" ;
             break;*/
             case 'btn-FORPT-DatasetActivityAnalysis':
                this.FORptModelTitle = "DATA SET ACTIVITY ANALYSIS  REPORT" ;
             break;
             case 'btn-FORPT-DatasetoutputSummary':
                this.FORptModelTitle = "DATA SET OUTPUT  REPORT" ;
             break;
             case 'btn-FORPT-DatasetUnitCost':
                this.FORptModelTitle = "DATA SET RECIPIENT UNIT COST  REPORT" ;
             break;
             case 'btn-FORPT-StaffPaysRpt':
                this.FORptModelTitle = "STAFF PAY  " ;
             break;             
             case 'btn-FORPT-FunderPayrollRpt':
                this.FORptModelTitle = "FUNDER PAYROLL R " ;
             break;
             case 'btn-FORPT-StaffunderPayrollRpt':
                this.FORptModelTitle = "STAFF FUNDER PAYROLL  " ;
                break;
             case 'btn-FORPT-StaffAllowanceRpt':
                this.FORptModelTitle = "STAFF ALLOWANCE  " ;
             break;             
             case 'btn-FORPT-StaffDateProgramRpt':
                this.FORptModelTitle = "STAFF DATE PROGRAM  " ;                                                
             break;
             case 'btn-FORPT-StaffProgramUtilisation':
                this.FORptModelTitle = "STAFF PROGRAM UTILIZATION  " ;
             break;            
             case 'btn-FORPT-StaffClientServiced':
                this.FORptModelTitle = "STAFF CLIENT SERVICED  " ;
             break;
             case 'btn-FORPT-StaffAdminRpt':
                this.FORptModelTitle = "STAFF ADMIN REPORT" ;
             break;
             case 'btn-FORPT-StaffActivityRpt':
                this.FORptModelTitle = "STAFF ACTIVITY  REPORT" ;
             break;
             case 'btn-FORPT-DailyStaffHrs':
                this.FORptModelTitle = "STAFF DAILY HOURS  REPORT" ;
             break;
             case 'btn-FORPT-PayTypeProgram':
                this.FORptModelTitle = "PAY TYPE PROGRAM  REPORT" ;
             break;
             case 'btn-FORPT-StaffusageReport':
                this.FORptModelTitle = "RECIPIENT STAFF USAGE  REPORT" ;
             break;
             case 'btn-FORPT-PaytypeReport':
                this.FORptModelTitle = "RECIPIENT PAY TYPE  REPORT" ;
             break;
             case 'btn-FORPT-ProgramUtilisation':
                this.FORptModelTitle = "RECIPIENT PROGRAM UTILIZATION  " ;
             break;
             case 'btn-FORPT-RecipientserviceReport':
                this.FORptModelTitle = "RECIPIENT SERVICE REPORT " ;
                break;
            
 
            default:
            //  alert("Yet to do")

        }



        switch (lftstr) {
            case 'btn-staff-':
                this.isVisibleTop = true;
                break;
            case 'btn-Regis-':
                this.isVisibleTop = true;
                break;
            case 'btn-FORPT-':
                this.FOReports = true;
                break;
            case 'btn-BUDGE-':
                this.yearrange();
                this.budgetvisible = true;

                break; 
            default:
                this.isVisibleTop = true;
        }


        //    this.showtab = true;
        //   this.showModal();
        //   this.showtabRegcriteria =false;
        //    this.tabset = false;



        /*     
            this.inputForm.controls['allVehicles'].disable(); 
            this.inputForm.controls['vehiclesArr'].disable();
            this.inputForm.controls['allSvctypes'].disable(); 
            this.inputForm.controls['svcTypeArr'].disable();
            
            
            switch(this.btnid){
                case 'btn-transportsummary' :
                    this.inputForm.controls['allVehicles'].enable(); 
                    this.inputForm.controls['vehiclesArr'].enable();
                    alert("transportsummary")
                    break;
                case 'btn-unallocatedbookings' :                
                this.inputForm.controls['allSvctypes'].enable(); 
                this.inputForm.controls['svcTypeArr'].enable();
                alert("bookongs")
                     break;
                default:
                
            }
        */




        return this.btnid
    }
    onChange(result: Date): void {
        console.log('onChange: ', result);
    }

    /*
    PrintID(e) {
        e = e || window.event;
        e = e.target || e.srcElement;
        this.btnid = e.id
        //   this.showModal();


        return this.btnid
        //  

    } */

    handleOk() {
          this.btnid = this.test
    //    console.log(this.btnid)
        this.reportRender(this.btnid);
        this.tryDoctype = "";        
        this.btnid = "";
    //    this.FOReports = false;     
    //    this.GlobalS.var2 = this.btnid
        
        

        

    }
    handleCancel() {
        this.inputForm = this.fb.group(inputFormDefault);
        // this.inputForm.reset(inputFormDefault);
        this.FOReports = false;
        this.pdfTitle = ""
    }

    handleOkTop() {
        //    console.log(this.inputForm.value)

        this.isVisibleTop = false;
        this.budgetvisible = false;
        //   this.inputForm.reset(inputFormDefault);            
        console.log(this.btnid)
        this.reportRender(this.btnid);
        this.tryDoctype = ""
        this.pdfTitle = ""
        this.inputForm = this.fb.group(inputFormDefault);
        //   this.QueryFormatter(this.btnid);
        ///    this.goJSReport();

    }

    handleCancelTop(): void {
        this.isVisibleTop = false;
        this.drawerVisible = false;
        this.budgetvisible = false;
        this.pdfTitle = ""
        //this.inputForm.reset(inputFormDefault);
        this.inputForm = this.fb.group(inputFormDefault);
    }

    reportRender(idbtn) {
//        console.log(idbtn)
        var tempsdate, tempedate, strdate, endate;

        //    var s_States = this.inputForm.value.statesArr;
        var s_Branches = this.inputForm.value.branchesArr;
        var s_Managers = this.inputForm.value.managersArr;
        var s_ServiceRegions = this.inputForm.value.serviceRegionsArr;
        var s_Programs = this.inputForm.value.programsArr;
        var s_StfGroup = this.inputForm.value.staffgroupsArr;
        var s_Recipient = this.inputForm.value.recipientArr;
        var s_SvcType = this.inputForm.value.svcTypeArr;
        var s_StaffSvcNote = this.inputForm.value.staffsvcNoteArr;       
        var s_incidenttype = this.inputForm.value.incidentArr;
        var s_Incidentcategory = this.inputForm.value.incidentcategoryArr;
        var s_LoanItems = this.inputForm.value.itemArr;
        var s_Competencies = this.inputForm.value.CompetenciesArr;
        var s_CompetencyGroups = this.inputForm.value.competeciesgroupArr;
        var s_StaffTeam = this.inputForm.value.staffteamArr;
        var s_Staff = this.inputForm.value.staffArr;
        var s_Stafftype = this.inputForm.value.stafftypeArr;
        var cycle = this.inputForm.value.cycleArr;
        var s_Cycle = cycle.toString();
        var s_CaseNotes = this.inputForm.value.casenotesArr;
        var s_Descipiline = this.inputForm.value.disciplineArr;
        var s_CareDomain = this.inputForm.value.caredomainArr;
        var s_PlanType = this.inputForm.value.planArr;
        var s_OPCaseNotes = this.inputForm.value.OPnotesArr;
        var s_HRCaseNotes = "";
        var s_TrainingType = this.inputForm.value.trainingtypeArr;
        var s_TraccsUser = this.inputForm.value.traccsuserArr;
        var s_who =(this.inputForm.value.whowhat).toString();
        var s_Description = (this.inputForm.value.description).toString();
        var s_RosterType = this.inputForm.value.rostertypeArr;
        var s_RosterFormat = (this.inputForm.value.Rpt_Format).toString();


        var s_Funders = this.inputForm.value.fundersArr;
        var s_HACCCategory = this.inputForm.value.mdstypeArr;
        var s_Age = this.inputForm.value.AGE_ATSI_StatusArr;
        var s_DateType: string;
        s_DateType = this.inputForm.value.DatetypeArr;
        var s_MdsAgencyID = this.inputForm.value.agencyidArr;
        var s_OutLetID = this.inputForm.value.outletsArr;
        var s_Activity = this.inputForm.value.activityArr;
        var s_Settings_vehicle = this.inputForm.value.settting_vehicleArr;
        var s_PayType = this.inputForm.value.paytypeArr;
        var s_BranchPrimacy = this.inputForm.value.branchprimacyArr;
        var formating = this.inputForm.value.radioFormat;

        var s_inclusion = this.inputForm.value.Additional_inclusion;
        var s_XXLate = this.inputForm.value.mta_time_late;
        var s_XXEarly = this.inputForm.value.mta_time_early;
        var s_XXOverstayed = this.inputForm.value.mta_time_overstayed;

        
        var s_incl_unapproved = this.inputForm.value.incl_unapproved_services;
        var s_incl_allowance = this.inputForm.value.incl_actuals;
        var s_incl_inactive = this.inputForm.value.Incl_inactive;
        var s_Year = this.inputForm.value.yearArr;
        var s_Month = this.inputForm.value.monthArr;
        var s_FYear = this.inputForm.value.FYArr;
        var s_FY_End_Month = this.inputForm.value.FYEnd_MonthArr;

        var str_inclusion;

    /*    console.log("test "+ RosterType)
        if (RosterType !=""){
            for(var te of RosterType ){
                if(te.count >= 1){
                    var test = [te]
                }else{
                    for(var a of test){}
                    var test = [a]
                }
                
                console.log("te "+ test)
               }
                    
            for (let index = 0; index < RosterType.length; index++) {
                var RosterC = [(RosterType[index])]
                
                var third = (RosterC.toString()).substring(0,2)
            //    third +=  third
            var s_RosterType = [third]
                
            }
            
            console.log("test3 "+ s_RosterType) 
       }*/
      
        
        



        if (s_inclusion != "") {
            switch (s_inclusion) {
                case 'Include Staff Code':
                    str_inclusion = "Staff Code"
                    break;
                case 'Include Staff ID':
                    str_inclusion = "Staff ID"
                    break;
                case 'Include Recipient Code':
                    str_inclusion = "Recipient Code"
                    break;
                case 'Include File Number':
                    str_inclusion = "File Number"
                    break;
                    //
                case 'Include Contacts':
                    str_inclusion = "Contacts"
                    break;
                default:
                    str_inclusion = ""

            }

        }

        var date = new Date();
        var temp_lftstr = idbtn.substring(0, 10)

        //    strdate = format(new Date(date.getFullYear(), date.getMonth(), 1),'dd/MM/yyyy')
        //   endate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0),'dd/MM/yyyy');                
        tempsdate = format(this.startdate, 'yyyy/MM/dd')
        tempedate = format(this.enddate, 'yyyy/MM/dd')
        if (this.startdate != null) { strdate = format(this.startdate, 'dd/MM/yyyy') } else {
            //strdate = "2020-07-01"              
            strdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'dd/MM/yyyy')

        }
        if (this.enddate != null) { endate = format(this.enddate, 'dd/MM/yyyy') } else {
            // endate = "2020-07-31" strdate endate
            endate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'dd/MM/yyyy');
        }
        /*
         switch(temp_lftstr){
             case 'btn-staff-':                    
                 
                 break;
             case 'btn-Regis-':                    
                
                 break;
             case 'btn-FORPT-': 
          //   ,tempsdate,tempedate
                     
            
                 break;
             case 'btn-report': 
                     
                 
                 break;
             default:
                      
         } */



        
   //      console.log(idbtn)   
        switch (idbtn) {
            case 'btn-refferallist':
                this.Refeeral_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-waitinglist':
                this.Waiting_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-activepackagelist':
                this.ActivePackage_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate);
                break;
            case 'btn-recipientroster':
                this.RecipientRoster(s_Branches, s_StfGroup, s_Recipient, s_Stafftype, strdate, endate, tempsdate, tempedate,s_RosterFormat);
                break;
            case 'btn-suspendedrecipient':
                this.SuspendedRecipient(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-vouchersummary':
                this.VoucherSummary(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-packageusage':
                this.PackageUsage(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-timelength':
                this.RecipientTimeLength(strdate, endate);
                break;
            case 'btn-unallocatedbookings':
                this.UnallocatedBookings(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-transportsummary':
                this.TransportSummary(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-refferalduringperiod':
                this.RefferalsduringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-recipientMasterroster':
                         
                switch (s_Cycle) {
                    case 'CYCLE 1':
                        strdate = "1900/01/01";
                        endate = "1900/01/28";
                        break;
                    case "CYCLE 2":
                        strdate = "1900/10/01";
                        endate = "1900/10/12";
                        break;
                    case 'CYCLE 3':
                        strdate = "1901/04/01";
                        endate = "1901/04/28";
                        break;
                    case 'CYCLE 4':
                        strdate = "1901/07/01";
                        endate = "1901/07/28";
                        break;
                    case 'CYCLE 5':
                        strdate = "1902/09/01";
                        endate = "1902/09/28";
                        break;                        
                    case 'CYCLE 6':
                        strdate = "1902/12/01";
                        endate = "1902/12/28";
                        break;
                    case 'CYCLE 7':
                        strdate = "1903/06/01";
                        endate = "1903/06/28";
                        break;
                    case 'CYCLE 8':
                        strdate = "1904/02/01";
                        endate = "1904/02/28";
                        break;
                    case 'CYCLE 9':
                        strdate = "1904/08/01";
                        endate = "1904/08/28";
                        break;
                    case 'CYCLE 10':
                        strdate = "1905/05/01";
                        endate = "1905/05/28";
                        break;
                    default:
                        strdate = "1900/01/01";
                        endate = "1900/01/28";

                        break;
                }

                this.RecipientMasterRoster(s_Branches, s_StfGroup, s_Recipient, s_Stafftype, strdate, endate,s_Cycle,s_RosterFormat);
                break;
            case 'btn-activerecipient':
                this.ActiveRecipientList(s_Branches, s_Managers, s_ServiceRegions, s_Programs,str_inclusion);
                break;
            case 'btn-inactiverecipient':
                this.InActiveRecipientList(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-Regis-masterrosteredhoursreport':                    
                    this.MasterRosteredhours(s_Programs,s_Cycle);
                    break;
            case 'btn-adminduringperiod':
                this.AdmissiionDuringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-dischargeduringperiod':
                this.DischargeDuringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-absentclient':
                this.AbsentClientStatus(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-careerlist':
                this.CareerList(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-onlybillingclients':
                this.BillingCliens(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-associatelist':
                this.Associate_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-unserviced':
                this.UnServicedRecipient(s_Branches, s_Managers, s_ServiceRegions, s_Programs, strdate, endate, tempsdate, tempedate);
                break;

            case 'btn-staff-Activestaff':
                this.ActiveStaffListing(s_Managers, s_Branches, s_StfGroup, str_inclusion);
                break;
            case 'btn-staff-ActiveBrokerage':
                this.ActiveBrokerage_Contractor(s_Managers, s_Branches, s_StfGroup, str_inclusion);
                break;
            case 'btn-staff-Activevolunteers':
                this.ActiveVolunters(s_Managers, s_Branches, s_StfGroup, str_inclusion);
                break;
            case 'btn-staff-InactiveBrokerage':
                this.InActiveBrokerage_Contractor(s_Managers, s_Branches, s_StfGroup, str_inclusion);
                break;
            case 'btn-staff-InactiveVolunteer':
                this.InActiveVolunteers(s_Managers, s_Branches, s_StfGroup, str_inclusion);
                break;
            case 'btn-staff-Inactivestaff':
                this.InActiveStaffListing(s_Managers, s_Branches, s_StfGroup, str_inclusion);
                break;
            case 'btn-staff-Userpermissions':
                this.StaffPermissions(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-Regis-mealregisterreport':
                this.MealOrderReport(s_Recipient, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-Regis-LagTimeRegister':
                this.lagtimeregister(s_Branches, s_Programs,strdate, endate, tempsdate, tempedate);
                break;            
            case 'btn-Regis-hasreport':
                this.HASReport(s_Programs, strdate, endate);
                break;
            case 'btn-Regis-cdcleavereport':
                this.CDCLeaveRegister(s_Branches, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-Regis-cdcpackagebalance':
                this.CDCPackageBalanceReport(s_Recipient, s_Programs, strdate, endate, tempsdate, tempedate);
                break;
            case 'btn-Regis-incidentregister':
                this.IncidentRegister(s_Branches, s_SvcType, s_Staff, s_incidenttype, s_Incidentcategory, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-Regis-loanregister':
                this.LoanItemRegister(s_Branches, s_Programs, s_Recipient, s_LoanItems, s_ServiceRegions, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-leaveregister':
                this.StaffLeaveRegister(strdate, endate, tempsdate, tempedate)
                break;                
                /*case 'btn-staff-svcnotesregister':
                this.StaffSvcNotesRegister(s_Branches,s_Staff,s_StaffSvcNote ,strdate, endate, tempsdate, tempedate)
                break; */
            case 'btn-staff-staffnotworked':
                this.StaffNotWorkedReport(s_Branches, s_StfGroup, s_Staff, strdate, endate,tempsdate, tempedate)
                break;
            case 'btn-staff-competencyrenewal':
                this.StaffCompetencyRenewal(s_Branches, s_Staff, s_Competencies, s_Managers, s_StaffTeam, s_StfGroup, s_CompetencyGroups, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-unavailability':
                this.StaffUnavailability(s_Branches, s_StfGroup, s_Staff, s_Stafftype, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-Roster':
                this.StaffRoster(s_Branches, s_StfGroup, s_Staff, s_Stafftype, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-competencyRegister':
                this.CompetencyRegister(s_Branches, s_Staff,s_StfGroup ,s_Competencies)
                break;
            case 'btn-staff-MasterRoster':

                switch (s_Cycle) {
                    case 'CYCLE 1':
                        strdate = "1900/01/01";
                        endate = "1900/01/28";
                        break;
                    case "CYCLE 2":
                        strdate = "1900/10/01";
                        endate = "1900/10/12";
                        break;
                    case 'CYCLE 3':
                        strdate = "1901/04/01";
                        endate = "1901/04/28";
                        break;
                    case 'CYCLE 4':
                        strdate = "1901/07/01";
                        endate = "1901/07/28";
                        break;
                    case 'CYCLE 5':
                        strdate = "1902/09/01";
                        endate = "1902/09/28";
                        break;                        
                    case 'CYCLE 6':
                        strdate = "1902/12/01";
                        endate = "1902/12/28";
                        break;
                    case 'CYCLE 7':
                        strdate = "1903/06/01";
                        endate = "1903/06/28";
                        break;
                    case 'CYCLE 8':
                        strdate = "1904/02/01";
                        endate = "1904/02/28";
                        break;
                    case 'CYCLE 9':
                        strdate = "1904/08/01";
                        endate = "1904/08/28";
                        break;
                    case 'CYCLE 10':
                        strdate = "1905/05/01";
                        endate = "1905/05/28";
                        break;
                    default:
                        strdate = "1900/01/01";
                        endate = "1900/01/28";

                        break;
                }

                this.StaffMasterRoster(s_Branches, s_StfGroup, s_Staff, s_Stafftype, strdate, endate)
                break;
            case 'btn-staff-loanregister':
                this.StaffLoanRegister(s_Branches, s_Programs, s_Staff, s_LoanItems, s_StfGroup, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-staffservicenotesreg':
                this.StaffServiceNotesRegister(s_Branches, s_Staff , s_CaseNotes, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-Regis-progcasenotes':
                this.RecipientProg_CaseReport(s_Branches, s_Programs, s_CaseNotes, s_Recipient, s_Descipiline, s_CareDomain, s_ServiceRegions, s_Managers, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-Regis-servicenotesreg':
                this.ServiceNotesRegister(s_Branches, s_Programs, s_CaseNotes, s_Recipient, s_Descipiline, s_CareDomain, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-Regis-opnotesregister':
                this.OPNotesRegister(s_Branches, s_Programs, s_CaseNotes, s_Recipient, s_Descipiline, s_CareDomain, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-regis-serviceplan':
                this.ServicePlanRegister(s_Branches, s_Programs,  s_Recipient,s_Managers,s_ServiceRegions)
                break;
            case 'btn-Regis-careplanstatus':
                this.Careplanstatus(s_Recipient, s_PlanType, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-availability':
                this.StaffAvailability(s_Branches, s_Staff, strdate, tempsdate)
                break;
            case 'btn-staff-timeattandencecomp':
                this.TimeattandanceComparison(s_Branches, s_Staff, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-hrnotesregister':
                this.HRNotesRegister(s_Branches, s_Staff, s_HRCaseNotes, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-opnotes':
                this.StaffOPNotesRegister(s_Branches, s_Programs, s_OPCaseNotes, s_Staff, s_Descipiline, s_CareDomain, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-incidentregister':
                this.StaffIncidentRegister(s_Branches, s_SvcType, s_Staff, s_incidenttype, s_Incidentcategory, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-staff-training':
                this.StaffTraining(s_Branches, s_Managers, s_ServiceRegions, s_Programs, s_StaffTeam, s_TrainingType, s_StfGroup, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-competenciesrenewal':
                this.StaffCompetencyRenewal(s_Branches, s_Staff, s_Competencies, s_Managers, s_StaffTeam,s_StfGroup, s_CompetencyGroups, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-Systm-AuditRegister':
                 
                this.AuditRegister(s_who, s_Description, s_TraccsUser, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-Systm-ActivityStatusAudit':
                this.ProgramActivityStatusAudit(s_Programs)
                break;
            case 'btn-Systm-MTARegister':
                this.MTARegister(s_Programs, s_Managers, s_Staff, s_StfGroup, s_Recipient, strdate, endate, tempsdate, tempedate, s_XXLate, s_XXEarly, s_XXOverstayed)
                break;
            case 'btn-Systm-RosterOverlap':
                this.RosterOverlapRegister(s_Programs, s_Branches, s_Staff, s_Recipient, strdate, endate, tempsdate, tempedate)
                break;
            case 'btn-Systm-MTAVerification':
                this.MTAVerificationAudit(s_Programs, s_Managers, s_Staff, s_StfGroup, s_Recipient, strdate, endate, tempsdate, tempedate, s_XXLate, s_XXEarly, s_XXOverstayed)
                break;
            case 'btn-FORPT-ProgramUtilisation':
                this.ReportUtilisation(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-PaytypeReport':
                this.ReportUtilisation(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffusageReport':
                this.ReportUtilisation(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-RecipientserviceReport':
                this.ReportUtilisation(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-PayTypeProgram':
                this.PayTypeProgram(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-DailyStaffHrs':
                this.DailyStaffHrs(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-ProgramActivitySpread': 
                this.ProgramReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;            
            case 'btn-FORPT-AwardStaffPayRpt': 
                this.AwardStaffPayReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;                  
            case 'btn-FORPT-AwardStaffProgramPayRpt': 
                this.AwardStaffProgramPayReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-ProgramStaffUtilized':
                this.ProgramReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-ProgramRecipientServiced':
                this.ProgramReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-ProgramBillingReport':
                this.ProgramBillingReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break; 
                case 'btn-FORPT-ActivityStaff':
                    this.ActivityStaffReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                    break;
            case 'btn-BudgetAuditReport':
                this.ProgramBudgetAudit(s_Branches, s_Programs);
                break;
            case 'btn-ProgramSummaryRpt':
                this.ProgramSummaryReport(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;


            case 'btn-FORPT-ActivityGroupRpt':
                this.ActivityGroupReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffActivityRpt':
                this.StaffActivityReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffAdminRpt':
                this.StaffAdminReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffClientServiced':
                this.StaffRecipientServiced(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffPaysRpt':
                this.StaffPaysReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffProgramPayType':
                this.StaffProgramPaytypeRpt(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffunderPayrollRpt':
                this.StaffFunderPayrolltypeRpt(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-FunderPayrollRpt':
                this.FunderPayrolltypeRpt(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-report-fundingAuditReport':
                this.FundingAuditReport(strdate, endate)
                break;
            case 'btn-FORPT-DatasetActivityAnalysis':
                this.DatasetActivityAnalysis(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-DatasetoutputSummary':
                this.DatasetoutputSummary(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-report-UnbilledItems':
                this.UnbilledItems(s_Branches, s_Programs, s_SvcType, strdate, endate,tempsdate, tempedate)
                break;
            case 'btn-report-BilledItems':
                this.BilledItems(s_Branches, s_Programs, s_SvcType, strdate, endate,tempsdate, tempedate)
                break;
            case 'btn-FORPT-ActivityRecipientRpt':
                this.ActivityRecipientReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
                //ActivityProgramReport
            case 'btn-FORPT-ActivityProgramRpt':
                this.ActivityProgramReport(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffProgramUtilisation':
                this.StaffProgramUtilisation(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-FORPT-StaffAllowanceRpt':
                this.StaffAllowance(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;


            case 'btn-report-DatasetUnitCost':
                this.DatasetRecipientUnitCost(s_Recipient, s_SvcType, strdate, endate)
                break;
            case 'btn-UnsedFunding':
                this.UnsedFunding(s_Programs, s_Managers, s_Recipient, s_ServiceRegions)
                break; 
            case 'btn-FORPT-StaffDateProgramRpt':
                this.StaffDateProgram(s_Branches, s_Managers, s_ServiceRegions, s_StfGroup, s_Funders, s_Recipient, s_Staff, s_HACCCategory, s_RosterType, s_Age, s_DateType, s_Programs, s_MdsAgencyID, s_OutLetID, s_StaffTeam, status, strdate, endate, idbtn, s_Stafftype, s_PayType, s_Activity, s_Settings_vehicle, formating, tempsdate, tempedate)
                break;
            case 'btn-BUDGE-Recpientbudgetaudit':   
                this.RecipientBudgetReport(s_Programs, s_incl_unapproved,s_incl_allowance,s_incl_inactive,s_Year, s_Month,s_FY_End_Month, s_FYear)
                break;
            default:
                alert("Yet to do")

        } 

        

    }
    //           
    Refeeral_list(branch, manager, region, program) {

        var lblcriteria;
        var fQuery = "SELECT DISTINCT R.Title, R.UniqueID, R.AccountNo,Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE (SELECT DISTINCT MinorGroup FROM ItemTypes WHERE Title = Roster.[Service Type]) = 'REFERRAL-IN' AND [Client Code] = R.AccountNo ORDER BY Date DESC)),'dd/MM/yyyy') as RefferalDate ,CAST(ONIMainIssues.Description AS NVARCHAR(MAX)) as Reason , R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName,  R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " Upper (NA.Address1) as Address1,  NA.Suburb, NA.Postcode, "}
        fQuery = fQuery + " CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID left join ONIMainIssues on  R.UniqueID = ONIMainIssues.PersonID "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID   "} 
        fQuery = fQuery + "WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)"
        
        

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };

        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }


        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }


        fQuery = fQuery + " AND (RecipientPrograms.ProgramStatus = 'REFERRAL') "
        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr "

        if (this.inputForm.value.printaslabel == true){
            
            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Referral list.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)

 
            //fQuery = "Select Distinct Title,RecipientName as AccountNo,Address1,Address2,Suburb,Postcode,[Surname/Organisation],FirstName from  (" + fQuery + " )cr Order by RecipientName "
           
        }
        else {
            this.reportid   = "zrBLd931LZblcnNH" 
            fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName "

            var Title = "RECIPIENT REFERRAL LISTING"
            //    console.log(this.tocken.user)
                const data = {
        
                    "template": { "_id": this.reportid },                                
                    "options": {
                        "reports": { "save": false },
                        //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
                        "sql": fQuery,
                        "Criteria": lblcriteria,
                        "userid": this.tocken.user,
                        "txtTitle": Title,
                        "count":sQl_Count,                        
                    }
                }
                this.loading = true;
               

                this.printS.printControl(data).subscribe((blob: any) => {
                    this.pdfTitle = "Referral list.pdf"
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
               
        /*
                const headerDict = {         
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', 
                    'Content-Disposition': 'inline;filename=XYZ.pdf'
                    //'Content-Disposition': 'ContentDisposition(hello)',
                    //'filename':'fname.pdf',            
                 //   (),                                        
                }        
                const requestOptions = {
                    headers: new HttpHeaders(headerDict),                    
                    credentials: true,                                       
                };        
                //this.rpthttp
                this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers,  responseType: 'blob' })
                    .subscribe((blob: any) => {
                        console.log(blob);        
                        let _blob: Blob = blob;        
                        let fileURL = URL.createObjectURL(_blob)//+'#toolbar=1';
                        this.pdfTitle = "Referral list.pdf"        
                        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);                        
                        this.loading = false;        
                        this.ModalS.error({
                            nzTitle: 'TRACCS',
        nzContent: 'The report has encountered the error and needs to close (' + err + ')',
                            nzOnOk: () => {
                                     this.drawerVisible = false;
                                     },
                          });   
                    }); */                                                             
                 //   this.drawerVisible = true;                  
        }        
        //console.log(fQuery)
        //  console.log(this.inputForm.value.printaslabel)                    
        }
    Waiting_list(branch, manager, region, program) {

        var lblcriteria;
        var fQuery = "SELECT DISTINCT R.Title, R.UniqueID, R.AccountNo,Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE (SELECT DISTINCT MinorGroup FROM ItemTypes WHERE Title = Roster.[Service Type]) = 'REFERRAL-IN' AND [Client Code] = R.AccountNo ORDER BY Date DESC)),'dd/MM/yyyy') as RefferalDate ,CAST(ONIMainIssues.Description AS NVARCHAR(MAX)) as Reason , R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " Upper (NA.Address1) as Address1, NA.Suburb, NA.Postcode, "}
        fQuery = fQuery + " CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID left join ONIMainIssues on  R.UniqueID = ONIMainIssues.PersonID "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID   "} 
        fQuery = fQuery + "WHERE R.[AccountNo] > '!MULTIPLE' "
        
        

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };

        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }


        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }


        fQuery = fQuery + " AND (RecipientPrograms.ProgramStatus = 'WAITING LIST' ) "
        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr"
        
        //    console.log(fQuery)
        //  console.log(this.inputForm.value.printaslabel)
        
        if (this.inputForm.value.printaslabel == true){ 
            
            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Referral list.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)
        
            //    this.reportid = "6dfbj72obyLi9qxJ"
        //    fQuery = "Select Distinct Title,RecipientName as AccountNo,Address1,Address2,Suburb,Postcode,FirstName from  (" + fQuery + " )cr Order by RecipientName"
        }
        else {
            this.reportid   = "zrBLd931LZblcnNH" 
            fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName"

            var Title = "RECIPIENT WAITING LIST";

        const data = {

            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "txtTitle": Title,
                "count":sQl_Count,
                
                
            }
        }
        this.loading = true;
       

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Waiting list.pdf"
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
        }

    ActivePackage_list(branch, manager, region, program, startdate, enddate) {


        var fQuery = "SELECT [CLIENT CODE], PROGRAM, H.[Type] AS [FUNDING SOURCE], MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END)AS FIRST_ADMISSION,MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) AS FIRST_DISCHARGE  FROM HumanResourceTypes, ROSTER R INNER JOIN ITEMTYPES I ON R.[SERVICE TYPE] = I.TITLE AND MINORGROUP IN ('ADMISSION','DISCHARGE')  INNER JOIN HumanResourceTypes H on R.Program = H.[Name] AND H.[Group] = 'Programs'  WHERE R.[TYPE] = 7 AND R.[DATE] >= '2010/01/01' GROUP BY [CLIENT CODE], PROGRAM, h.[Type]  HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION'  "
        //Condtion to be added on dynamic input   
        //HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END) <= '2020-07-01'  AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'2020-07-31' 

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        //'2013/04/18'  '2016/10/05'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " THEN [DATE] END) <=  '" + startdate + ("'AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'") + enddate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        //   fQuery = fQuery + " AND (RecipientPrograms.ProgramStatus = 'REFERRAL') ORDER BY R.[Surname/Organisation], R.FirstName"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/

        //  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "Uer8Y39DEBqdWvvJ" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Active Packages.pdf"
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

    RecipientRoster(branch, stfgroup, recipient, stafftype, startdate, enddate, tempsdate, tempedate,format) {

        var lblcriteria; 
        var fQuery = "SELECT DATENAME(weekday,convert(datetime,[Roster].[Date])) as [Day], FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting],   "
        var tempkey = (this.inputForm.value.Roster_staffinclusion).toString();
        console.log(tempkey)
        switch (tempkey) { 
            case 'Show Staff First Name':
                fQuery = fQuery + "ISNULL([Staff].[FirstName],[CARER CODE]) as [Carer Code], "
                fQuery = fQuery + "CASE WHEN [CARER CODE] = 'BOOKED' THEN 'BOOKED' ELSE STAFF.FIRSTNAME END as [CARER CODE], "
               console.log('SHOW STAFF FIRST NAME')
                break;
                case 'Show Staff #':
                    fQuery = fQuery + "ISNULL([Staff].[STF_CODE],[CARER CODE]) as [Carer Code], "
                    console.log("SHOW STAFF #")
                break;
            default:
                fQuery = fQuery + "[Roster].[Carer Code],"
                console.log("default")
                break;
        }

     
        fQuery = fQuery + " format (convert(datetime,[Roster].[Start Time],108),'hh:mm tt') as [Start Time], case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else FORMAT(Convert(datetime, (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108),'hh:mm tt')  end AS ENDTIME, [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON [CLient Code] = [Accountno]  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE')"
        //Condtion to be added on dynamic input   
        //HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END) <= '2020-07-01'  AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'2020-07-31' 
       
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "( Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = " Recipients.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "Category in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }




        if (branch != "") {
            lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }
        if (stafftype != "") {
            lblcriteria = " Branches:" + stafftype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Branches" }
        if (recipient != "") {
            lblcriteria = " Recipients:" + recipient.join(",") + "; "
        }
        else { lblcriteria = "All Recipients" }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Assigned To: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }

        fQuery = fQuery + "ORDER BY [Client Code], convert(datetime,[Roster].[Date]), [Start Time]  "
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)
      console.log(format) */
    switch (format) {
        case 'Presentation - with Activity':
            this.reportid = "C51kE1CQtifE100c"
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
            break;
        case 'Presentation - with No Activity':
            this.reportid = "DOwrJxslBMOigZgq"
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
            break;
    
        default:
            this.reportid = "2orGpoorz20XztFV"
        //    console.log("default case")
            break;
    }
    //console.log(fQuery)
       

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "notes":this.inputForm.value.include_AdditionalInfo,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Recipient Rosters.pdf"
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

    SuspendedRecipient(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID INNER JOIN Roster Rs on Rs.[client code]=R.[AccountNo] WHERE R.[AccountNo] > '!MULTIPLE'   AND   (ServiceOverview.ServiceStatus = 'ON HOLD') "
        //Condtion to be added on dynamic input   
        //HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END) <= '2020-07-01'  AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'2020-07-31' 
        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        //AND [DATE] BETWEEN '2014-05-22' AND '2019/07/18' 
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "  Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr"
        fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //////console.log(fQuery)

        

        const data = {
            "template": { "_id": "AqAvj5SAJimxblUC" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "count":sQl_Count,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Suspended Recipients.pdf"
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


    VoucherSummary(branch, manager, region, program, startdate, enddate,tempsdate, tempedate) {


        var fQuery = "SELECT Recipients.AccountNo as [Recipient],  COUNT(SrNo) as  [Vouchers Issued], COUNT(CASE Cancelled WHEN 1 then 'True' else NULL END) as [Vouchers Cancelled], COUNT(CASE Redeemed WHEN 1 then 'True' else NULL END) as [Vouchers Redeemed], SUM(((CASE Redeemed WHEN 1 then 1 else 0 END) * SubsidyAmountt)) as [Value] FROM LMVoucher LEFT JOIN Recipients on LMVoucher.PersonID = Recipients.UniqueID  WHERE  "
        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + "  " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "  DATEOFISSUE BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + " GROUP BY Recipients.AccountNo ORDER BY Recipients.AccountNo"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)
        console.log(fQuery)*/

      

        const data = {
            "template": { "_id": "OyCHjzwx6HGfc3jQ" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Voucher Summary.pdf"
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

    PackageUsage(branch, manager, region, program) {


        var fQuery = "Select DISTINCT R.AccountNo, R.[BRANCH], R.[RECIPIENT_COOrdinator], R.[AgencyDefinedGroup], RP.[PersonId], RP.[Program], RP.ProgramStatus, ISNULL(AP_BasedOn, 0) AS Allowed, ISNULL(AP_CostType, '') AS CostType,  ISNULL(AP_PerUnit, '') AS AP_PerUnit, ISNULL(AP_Period, '') AS AP_Period, ISNULL(ExpireUsing, '') AS ExpireUsing, ISNULL(AlertStartDate, '') AS AlertStartDate, '0' AS Balance,  ISNULL(AP_RedQty, 0) AS [RedAmount], ISNULL(AP_OrangeQty, 0) AS [OrangeAmount],  ISNULL(AP_YellowQty, 0) AS [YellowAmount] FROM Recipients R LEFT JOIN RecipientPrograms RP ON RP.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RP.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'RECIPIENT' OR [R].[Type] = 'CARER/RECIPIENT')      "

        if(this.inputForm.value.incl_approved_programs == false){
            fQuery = fQuery  + "  AND (RP.ProgramStatus = 'ACTIVE')  "
        }
        if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery  + " AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL)) "
        }
        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (branch != "") {
            var lblcriteria = "Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + "ORDER BY R.AccountNo "
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        // //////console.log(fQuery)

        

        const data = {
            "template": { "_id": "IOYgvXGLDyJsHZDk" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Package Usage Report.pdf"
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


    RecipientTimeLength(startdate, enddate) {


        var fQuery = "SELECT ACCOUNTNO, C.BRANCH, DATEDIFF(YEAR, DATEOFBIRTH, GETDATE()) AS AGE, MIN([DATE]) AS FirstService, format(DISCHARGEDATE,'dd/MM/yyyy') as DISCHARGEDATE  FROM RECIPIENTS C LEFT JOIN ROSTER R ON ACCOUNTNO = [CLIENT CODE] "
        //   AND Date BETWEEN '2020-07-01' AND '2020-07-31'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "  Date BETWEEN '" + startdate + ("'AND'") + enddate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Dates Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }


        fQuery = fQuery + "AND R.[TYPE] IN (2,3,4,5,8,10,11,12) WHERE ACCOUNTNO > '!Z' GROUP BY ACCOUNTNO, C.BRANCH, DATEOFBIRTH, DISCHARGEDATE "
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //////console.log(fQuery)

        this.loading = true;
                
        const data = {
            "template": { "_id": "apWdClVOiUcJ8xT0" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }

        
        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Recipient Time Length Report.pdf"
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

    UnallocatedBookings(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON Roster.[CLient Code] = Recipients.[Accountno]  WHERE ([Client Code] <> '!INTERNAL')  AND Roster.[Type] = 1  "
        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        //AND Date BETWEEN '2020/07/01' AND '2020/07/31'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "  Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + "ORDER BY [Client Code], convert(datetime,[Roster].[Date]), [Start Time]"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        // //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "BL1iE2Hn6FNsUpJN" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Unallocated Bookings.pdf"
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

    TransportSummary(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT  DATADOMAINS.[User1]  as [District], [Roster].[ServiceSetting] as Vehicle, [Roster].[Client Code] as Client, FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date of Travel] , (Case UPPER(LEFT([Roster].[Service Type],3)) WHEN 'MED' THEN 1 ELSE 0 END) as [MED], (Case UPPER(LEFT([Roster].[Service Type],3)) WHEN 'MED' THEN 0 ELSE 1 END) as [SOC], [Roster].[Program], PR.[Type] AS FundingSource FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]   INNER JOIN DATADOMAINS ON DATADOMAINS.[Description] =  [Roster].[ServiceSetting] INNER JOIN HumanResourceTypes PR ON PR.[Name] = Roster.[Program]WHERE  Roster.Type = 10 AND [Client Code] > '!MULTIPLE' AND Roster.[Status] >= 2 "

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        // AND (DATE BETWEEN '2019/07/01' AND '2020/07/31')
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "  DATE BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + " ORDER BY DataDomains.User1, [Roster].[ServiceSetting], [Roster].[Client Code], [Roster].[Date]"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //////console.log(fQuery)

    //    this.drawerVisible = true;

        this.loading = true;
        

        const data = {
            "template": { "_id": "zf77m2pHrfjGcpvM" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Transport Summary Report.pdf"
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


    RefferalsduringPeriod(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[AgencyIDReportingCode], [Recipients].[Surname/Organisation], UPPER([Recipients].[Surname/Organisation]) + ', ' + CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName]  ELSE ' ' END As [RecipientName], [Recipients].[Address1], [Recipients].[Address2], [Recipients].[pSuburb] As Suburb, [Recipients].[pPostcode] As Postcode,format([Recipients].[AdmissionDate],'dd/MM/yyyy') As [Activation Date], format([Recipients].[DischargeDate],'dd/MM/yyyy') As [DeActivation Date], [Recipients].[ONIRating], [Roster].[Client Code], [Roster].[Service Type], [Roster].[DischargeReasonType], [Roster].[Program]  ,Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID =Recipients.[UniqueID] For XML path ('')),1, 1, '') [Detail]  FROM Recipients With (NoLock)  INNER JOIN Roster With (NoLock) ON Recipients.accountno = Roster.[Client Code]  INNER JOIN ItemTypes With (NoLock) ON ItemTypes.Title = Roster.[Service Type]  AND ProcessClassification <> 'INPUT'    WHERE ItemTypes.MinorGroup = 'REFERRAL-IN'"

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }   //AND (Date BETWEEN '2020/08/01' AND '2020/08/31')
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + tempsdate + " and " + tempedate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + "ORDER BY Date"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "TwKNgf9F8SLUDgLo" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
       

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Referral During Period.pdf"
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

    RecipientMasterRoster(branch, stfgroup, recipient, stafftype, startdate, enddate ,s_Cycle,format) {

        var lblcriteria;
        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration], case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME , [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON [CLient Code] = Recipients.[Accountno]  LEFT JOIN STAFF ON [CARER CODE] = STAFF.ACCOUNTNO  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE')  "

        // AND Date BETWEEN '1900/01/01' AND '1900/01/28'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "( Date BETWEEN '" + startdate + ("'AND'") + enddate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = " Recipients.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (recipient != "") {
            this.s_StaffSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }

  


        if (branch != "") {
            lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }
        if (stafftype != "") {
            lblcriteria = " Branches:" + stafftype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Branches" }
        if (recipient != "") {
            lblcriteria = " Recipients:" + recipient.join(",") + "; "
        }
        else { lblcriteria = "All Recipients" }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Assigned To: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (s_Cycle != "") {
            lblcriteria = lblcriteria + " Date  " + s_Cycle.toString() + "; "
        }
        else { lblcriteria = lblcriteria + " Dated: Cycle 1 " }

        fQuery = fQuery + "  ORDER BY [Client Code], convert(datetime,[Roster].[Date]), [Start Time] "
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
       // console.log(fQuery)

     switch (format) {
        case 'Presentation - with Activity':
            this.reportid = "C51kE1CQtifE100c"
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
            break;
        case 'Presentation - with No Activity':
            this.reportid = "DOwrJxslBMOigZgq"
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
            break;
    
        default:
            this.reportid = "rRjFTClorpcjSauz"
            
            break;
    }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "notes":this.inputForm.value.include_AdditionalInfo,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Recipients Master Roster.pdf"
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
    MasterRosteredhours(program, s_Cycle) {        
          
        
        switch (s_Cycle) {
            case 'Cycle 1':
            var   strdate = "01/01/1900";
            var    endate = "28/01/1900";
                break;
            case "Cycle 2":
                strdate = "01/10/1900";
                endate = "28/10/1900";
                break;
            case 'Cycle 3':
                strdate = "01/04/1901";
                endate = "28/04/1901";
                break;
            case 'Cycle 4':
                strdate = "01/07/1901";
                endate = "28/07/1901";
                break;
            case 'Cycle 5':
                strdate = "01/09/1902";
                endate = "28/09/1902";
                break;

            case 'Cycle 6':
                strdate = "01/12/1902";
                endate = "28/12/1902";
                break;
            case 'Cycle 7':
                strdate = "01/06/1903";
                endate = "28/06/1903";
                break;
            case 'Cycle 8':
                strdate = "01/02/1904";
                endate = "28/02/1904";
                break;
            case 'Cycle 9':
                strdate = "01/08/1904";
                endate = "28/08/1904";
                break;
            case 'Cycle 10':
                strdate = "01/05/1905";
                endate = "28/05/1905";
                break;
            default:
                strdate = "1900/01/01";
                endate = "1900/01/28";

                break;
        }
        var lblcriteria;
        var fQuery = "SELECT PROGRAM, ROUND(SUM( CASE WHEN [DATE] = '1900/01/01' THEN DURATION ELSE 0 END)/12,2) AS [DAY1], ROUND(SUM( CASE WHEN [DATE] = '1900/01/02' THEN DURATION ELSE 0 END)/12,2) AS [DAY2], ROUND(SUM( CASE WHEN [DATE] = '1900/01/03' THEN DURATION ELSE 0 END)/12,2) AS [DAY3], ROUND(SUM( CASE WHEN [DATE] = '1900/01/04' THEN DURATION ELSE 0 END)/12,2) AS [DAY4], ROUND(SUM( CASE WHEN [DATE] = '1900/01/05' THEN DURATION ELSE 0 END)/12,2) AS [DAY5], ROUND(SUM( CASE WHEN [DATE] = '1900/01/06' THEN DURATION ELSE 0 END)/12,2) AS [DAY6], ROUND(SUM( CASE WHEN [DATE] = '1900/01/07' THEN DURATION ELSE 0 END)/12,2) AS [DAY7], ROUND(SUM( CASE WHEN [DATE] = '1900/01/08' THEN DURATION ELSE 0 END)/12,2) AS [DAY8], ROUND(SUM( CASE WHEN [DATE] = '1900/01/09' THEN DURATION ELSE 0 END)/12,2) AS [DAY9], ROUND(SUM( CASE WHEN [DATE] = '1900/01/10' THEN DURATION ELSE 0 END)/12,2) AS [DAY10], ROUND(SUM( CASE WHEN [DATE] = '1900/01/11' THEN DURATION ELSE 0 END)/12,2) AS [DAY11], ROUND(SUM( CASE WHEN [DATE] = '1900/01/12' THEN DURATION ELSE 0 END)/12,2) AS [DAY12], ROUND(SUM( CASE WHEN [DATE] = '1900/01/13' THEN DURATION ELSE 0 END)/12,2) AS [DAY13], ROUND(SUM( CASE WHEN [DATE] = '1900/01/14' THEN DURATION ELSE 0 END)/12,2) AS [DAY14] FROM ROSTER  WHERE [TYPE] IN (1,2,3,4,5,6,7,8,10,11,12)    "

        
        if (strdate != "" || endate != "") {
            this.s_DateSQL = "( [DATE] BETWEEN '" + strdate + ("'AND'") + endate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        } 

        if (program != "") {
            lblcriteria =  " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = "All Programs." }
        if (s_Cycle != "") {
            lblcriteria = lblcriteria + " Date: " + s_Cycle + "; "
        }
        else{lblcriteria = lblcriteria + " Date: Cycle 01  "; }
        
        
        

        fQuery = fQuery + " GROUP BY PROGRAM  "
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "cNhkW3O0lp9TSQyg" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Master Rostered Hours Report.pdf"
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
    ActiveRecipientList(branch, manager, region, program,inclusion) {


        var fQuery = "SELECT DISTINCT R.UniqueID,R.Title, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating,format(R.AdmissionDate,'dd/MM/yyyy') As [ActivationDate],format( R.DischargeDate,'dd/MM/yyyy')  As [DeActivationDate], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus,   "

         
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " Upper (NA.Address1) as Address1, NA.Suburb, NA.Postcode, "}        
        fQuery = fQuery  +" CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID  "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID  "} 
        fQuery = fQuery  + " WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'RECIPIENT' OR [R].[Type] = 'CARER/RECIPIENT')   "       

        if(this.inputForm.value.incl_approved_programs == false){
            fQuery = fQuery  + "  AND (RecipientPrograms.ProgramStatus = 'ACTIVE')  "
        }
        if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery  + " AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL)) "
        }
        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (branch != "") {
            var lblcriteria = "Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr"
        
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
    //    console.log(fQuery)
        if (this.inputForm.value.printaslabel == true){ 
            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Active Recipient List.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)
        //    this.reportid = "6dfbj72obyLi9qxJ"
        //    fQuery = "Select Distinct Title,RecipientName as AccountNo,Address1,Address2,Suburb,Postcode from  (" + fQuery + " )cr Order by RecipientName"
        }
        else {
            this.reportid   = "4ohDCZRbiaKS4ocK" 
            fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName"

                console.log(fQuery)
        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "count":sQl_Count,
                "include": inclusion, 
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Active Recipient List.pdf"
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
       
    
    
    }

    InActiveRecipientList(branch, manager, region, program) {


        var fQuery = "SELECT DISTINCT R.UniqueID,R.Title, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, format(R.AdmissionDate,'dd/MM/yyyy')  As [ActivationDate], format(R.DischargeDate,'dd/MM/yyyy')  As [DeActivationDate], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus,  "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " Upper (NA.Address1) as Address1,   NA.Suburb, NA.Postcode, "}        
        fQuery = fQuery +" CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID "

        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID  "} 
        fQuery = fQuery +"WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'RECIPIENT' OR [R].[Type] = 'CARER/RECIPIENT') AND (DischargeDate is not null)"


        
        
        
        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (branch != "") {
            var lblcriteria = "Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr"

        
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //console.log(fQuery)
        if (this.inputForm.value.printaslabel == true){ 

            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "InActive Recipient List.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)
            
            this.reportid = "6dfbj72obyLi9qxJ"
            fQuery = "Select Distinct Title,RecipientName as AccountNo,Address1,Address2,Suburb,Postcode,FirstName from  (" + fQuery + " )cr Order by RecipientName"
        }
        else {
            this.reportid   = "EqrRIePxJeNTXk0b" 
            fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName"

            this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "count":sQl_Count,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "InActive Recipient List.pdf"
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

        
    }

    CareerList(branch, manager, region, program) {


        var fQuery = "SELECT DISTINCT R.UniqueID,R.Title, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating,format(R.AdmissionDate ,'dd/MM/yyyy') As [Activation Date],format(R.DischargeDate,'dd/MM/yyyy')  As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus,  "

        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " Upper (NA.Address1) as Address1,   NA.Suburb, NA.Postcode, "}        
        fQuery = fQuery + " CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID  "} 
        fQuery = fQuery + " WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'CARER' OR [R].[Type] = 'CARER/RECIPIENT')   "

        if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery + " AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL)) "
        }

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (branch != "") {
            var lblcriteria = "Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr"

        fQuery = " Select Distinct AccountNo,[Activation Date] ,ONIRating , CONTACT, ADDRESS,LastDate from (  " +fQuery + " ) as t"
        
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
       // //////console.log(fQuery)
        if (this.inputForm.value.printaslabel == true){ 
            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Carer list.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)
        }
        else {
            this.reportid   = "pFy5Ej2Zdy6OhMKs" 
            fQuery = fQuery + "  ORDER BY R.[Surname/Organisation], R.FirstName"

            this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "count":sQl_Count,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Carer list.pdf"
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

        
    }

    BillingCliens(branch, manager, region, program) {


        var fQuery = "SELECT DISTINCT R.UniqueID, R.Title, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, format(R.AdmissionDate,'dd/MM/yyyy') As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus,  "

        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " Upper (NA.Address1) as Address1,   NA.Suburb, NA.Postcode, "}        
        fQuery = fQuery + " CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID  "} 
        fQuery = fQuery + " WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] IN ('BILLING CLIENTS', 'BILLING CLIENT ONLY'))  "

        if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery + " AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL)) "
        }

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (branch != "") {
            var lblcriteria = "Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        // //////console.log(fQuery)

        if (this.inputForm.value.printaslabel == true){ 
            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Billing Clients.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)
           
            // this.reportid = "6dfbj72obyLi9qxJ"
           // fQuery = "Select Distinct Title,RecipientName as AccountNo,Address1,Address2,Suburb,Postcode,FirstName from  (" + fQuery + " )cr Order by RecipientName"
        }
        else {
            this.reportid   = "0BnEO8OTruJxvLwX" 
            fQuery = fQuery + "  ORDER BY R.[Surname/Organisation], R.FirstName"

            this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Billing Clients.pdf"
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

        
    }
    AdmissiionDuringPeriod(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[AgencyIDReportingCode], [Recipients].[Surname/Organisation], UPPER([Recipients].[Surname/Organisation]) + ', ' + CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName]  ELSE ' ' END As [RecipientName], [Recipients].[Address1], [Recipients].[Address2], [Recipients].[pSuburb] As Suburb, [Recipients].[pPostcode] As Postcode, format([Recipients].[AdmissionDate],'dd/MM/yyyy') As [Activation Date], format([Recipients].[DischargeDate],'dd/MM/yyyy') As [DeActivation Date], [Recipients].[ONIRating], [Roster].[Client Code], [Roster].[Service Type], [Roster].[DischargeReasonType], [Roster].[Program]  FROM Recipients With (NoLock)  INNER JOIN Roster With (NoLock) ON Recipients.accountno = Roster.[Client Code]  INNER JOIN ItemTypes With (NoLock) ON ItemTypes.Title = Roster.[Service Type]  AND ProcessClassification <> 'INPUT'  WHERE ItemTypes.MinorGroup = 'ADMISSION'  "

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        //AND (Date BETWEEN '2015/07/01' AND '2016/07/31'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }


        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + " ORDER BY Date"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "sedG2p1WPWiRPeIc" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Billing Clients.pdf"
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
    DischargeDuringPeriod(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[AgencyIDReportingCode], [Recipients].[Surname/Organisation], UPPER([Recipients].[Surname/Organisation]) + ', ' + CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName]  ELSE ' ' END As [RecipientName], [Recipients].[Address1], [Recipients].[Address2], [Recipients].[pSuburb] As Suburb, [Recipients].[pPostcode] As Postcode, format([Recipients].[AdmissionDate],'dd/MM/yyyy') As [Activation Date], format([Recipients].[DischargeDate],'dd/MM/yyyy') As [DeActivation Date], [Recipients].[ONIRating], [Roster].[Client Code], [Roster].[Service Type], [Roster].[DischargeReasonType], FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[Program]  FROM Recipients With (NoLock)  INNER JOIN Roster With (NoLock) ON Recipients.accountno = Roster.[Client Code]  INNER JOIN ItemTypes With (NoLock) ON ItemTypes.Title = Roster.[Service Type]  AND ProcessClassification <> 'INPUT'  WHERE ItemTypes.MinorGroup = 'DISCHARGE' "
        //AND (Date BETWEEN '2015/07/01' AND '2016/07/31'


        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }



        fQuery = fQuery + "  ORDER BY Date"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        // //////console.log(fQuery)
        // console.log(lblcriteria)  
        
        
        this.loading = true;
        



        this.drawerVisible = true;

        const data = {
            "template": { "_id": "IcqccAG4IKFnbisd" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Discharge During Period.pdf"
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

    AbsentClientStatus(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID INNER JOIN Roster Rs on Rs.[client code]=R.[AccountNo] WHERE R.[AccountNo] > '!MULTIPLE' AND Rs.[TYPE] = 4  AND ((admissiondate is not null) and (DischargeDate is null))"

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        //   AND [DATE] BETWEEN '2015/07/01' AND '2016/07/31' 
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "  Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr"

        fQuery = fQuery + "   ORDER BY R.[Surname/Organisation], FirstName"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "usEk1DqdlD4V07eM" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,                
                "count":sQl_Count,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Absent Client Status Report.pdf" 
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
    Associate_list(branch, manager, region, program) {


        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus,  "


        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " Upper (NA.Address1) as Address1,   NA.Suburb, NA.Postcode, "}        
        fQuery = fQuery + " CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, Format(convert(datetime,(SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC)),'dd/MM/yyyy') AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID "
        if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID  "} 
        fQuery = fQuery + " WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'ASSOCIATE')   "
        var lblcriteria;

        if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery  + " AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL)) "
        }

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };

        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }


        if (branch != "") {
            lblcriteria = "Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        var sQl_Count = "Select Distinct UniqueID from (" + fQuery + ") cr"

        

        /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
        // //////console.log(fQuery)
        // console.log(lblcriteria)

        if (this.inputForm.value.printaslabel == true){ 

            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Associate Listing.pdf"
            this.labelfilter(fQuery,this.reportid,this.pdfTitle,'',lblcriteria)

            //this.reportid = "6dfbj72obyLi9qxJ"
            //fQuery = "Select Distinct Title,RecipientName as AccountNo,Address1,Address2,Suburb,Postcode,FirstName from  (" + fQuery + " )cr Order by RecipientName"
        }
        else {
            this.reportid   = "69u2ZyBtQbSyxVxf" 
            fQuery = fQuery + "  ORDER BY R.[Surname/Organisation], R.FirstName"
            const data = {
                "template": { "_id": this.reportid },
                "options": {
                    "reports": { "save": false },
                    //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
                    "sql": fQuery,
                    "Criteria": lblcriteria,
                    "userid": this.tocken.user,
                    "count":sQl_Count,
                }
            }
            this.loading = true;
           
    
            this.printS.printControl(data).subscribe((blob: any) => {
                this.pdfTitle = "Associate Listing.pdf"
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

        
    }

    UnServicedRecipient(branch, manager, region, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT DISTINCT T.[Date], R.ACCOUNTNO, R.[Surname/Organisation] as Surname, R.FirstName,  R.Branch,  R.RECIPIENT_CoOrdinator, RP.Program FROM RECIPIENTS R LEFT JOIN RecipientPrograms RP on R.UniqueID = RP.PersonID LEFT JOIN ( SELECT RECORDNO, [Date],[CLIENT CODE], Program FROM ROSTER WHERE [TYPE] IN (2,3,4,5,6,7,8,10,11,12)  "

        if(this.inputForm.value.activeclientsonly == true){
            fQuery = fQuery + "AND ((R.AdmissionDate is NOT NULL) and (R.DischargeDate is NULL)) "
        }
       

        

        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }   //  AND Date BETWEEN '2020-07-01' AND '2020-07-31' )
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        fQuery = fQuery + " AS T ON R.ACCOUNTNO = T.[CLIENT CODE] WHERE ACCOUNTNO > '!Z' AND T.RECORDNO IS NULL"
        
        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + " ORDER BY  T.[Date], RP.[Program]"
        /*   
        console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/
        ////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "nsCXBTh7bFlCHSHX" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Unserviced Recipient Report.pdf"
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
    ActiveStaffListing(manager, branch, stfgroup, inclusion) {


        var fQuery = "Select s.UniqueID,s.Title, AccountNo, STF_CODE as StaffCode, StaffGroup,FirstName, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Upper (Address1) as Address1, Address2, Suburb, Postcode, format( CommencementDate,'dd/MM/yyyy') as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s  "

    //    if (this.inputForm.value.printaslabel == true){fQuery = fQuery + " NA.Address1,  NA.Suburb, NA.Postcode, "}        
    //    fQuery = fQuery + "  "
    //    if (this.inputForm.value.printaslabel == true){fQuery = fQuery + "  join NamesAndAddresses NA on NA.PersonID = R.UniqueID  "} 
        fQuery = fQuery + " WHERE [Category] = 'STAFF'  AND ([commencementdate] is not null and [terminationdate] is null) "

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','") + "') ";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        
      


        if (branch != "") {
            var lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Groups: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = lblcriteria +" All Staff Groups, " }


        

        

        //  console.log(fQuery)
        if (this.inputForm.value.printaslabel == true){ 
            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Active Staff List.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,inclusion,lblcriteria)

           
           
              
        }
        else {
            fQuery = fQuery + "Group by UniqueID,Title, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"
            this.reportid   = "LQO71slAArEu36fo" 
            fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"

            this.drawerVisible = true;        
            
            this.loading = true;
            

        const data = {
            "template": { "_id":  this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "include": inclusion, 
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Active Staff List.pdf"
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

         
        
    }
    InActiveStaffListing(manager, branch, stfgroup, inclusion) {


        var fQuery = "Select s.UniqueID,s.Title, AccountNo, STF_CODE as StaffCode, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, format( CommencementDate,'dd/MM/yyyy') as CommencementDate, format(TerminationDate,'dd/MM/yyyy') as TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'STAFF'  AND ([commencementdate] is not null and [terminationdate] is not null) "

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','") + "')";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }


        if (branch != "") {
            var lblcriteria = " Branches: " + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Managers," }


        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Groups: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }



        
        
        //    console.log(fQuery)

        if (this.inputForm.value.printaslabel == true){ 
             
            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "InActive Staff.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,inclusion,lblcriteria)

         //   fQuery = "Select Distinct Title,StaffName as AccountNo,Address1,Address2,Suburb,Postcode,[Surname/Organisation],FirstName from  (" + fQuery + " )cr Order by [Surname/Organisation],FirstName"
        }
        else {
            this.reportid   = "6NauxB95CSDc096v" 
            fQuery = fQuery + "Group by UniqueID,Title, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"
        fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"

        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "include": inclusion,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "InActive Staff.pdf"
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
        
    }
    ActiveBrokerage_Contractor(manager, branch, stfgroup, inclusion) {


        var fQuery = "Select s.UniqueID,s.Title, AccountNo, STF_CODE as StaffCode, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Upper (Address1) as Address1 , Address2, Suburb, Postcode, format( CommencementDate,'dd/MM/yyyy') as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'BROKERAGE ORGANISATION'  AND ([commencementdate] is not null and [terminationdate] is null)  "

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','") + "')";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }


        if (branch != "") {
            var lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Groups: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }



        
        
        if (this.inputForm.value.printaslabel == true){ 

            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Active Contractor List.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)

            //this.reportid = "6dfbj72obyLi9qxJ"
            //fQuery = "Select Distinct Title,StaffName as AccountNo,Address1,Address2,Suburb,Postcode from  (" + fQuery + " )cr Order by StaffName"
        }
        else {
            this.reportid   = "3zUoVBKOkYhdU8Z5" 
            fQuery = fQuery + "Group by UniqueID,Title, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"
            fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"

            this.drawerVisible = true;
        

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "include": inclusion,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Active Contractor List.pdf"
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
        
    }

    InActiveBrokerage_Contractor(manager, branch, stfgroup, inclusion) {


        var fQuery = "Select s.UniqueID,s.Title, AccountNo, STF_CODE as StaffCode, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, upper(Address1) as Address1, Address2, Suburb, Postcode, format( CommencementDate,'dd/MM/yyyy') as CommencementDate, format(TerminationDate,'dd/MM/yyyy') as TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'BROKERAGE ORGANISATION'  AND ([commencementdate] is not null and [terminationdate] is not null)  "

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','") + "')";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }


        if (branch != "") {
            var lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Groups: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }



        
        //    console.log(fQuery)
        if (this.inputForm.value.printaslabel == true){ 

            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "InActive Contractor List.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)

            //this.reportid = "6dfbj72obyLi9qxJ"
            //fQuery = "Select Distinct Title,StaffName as AccountNo,Address1,Address2,Suburb,Postcode from  (" + fQuery + " )cr Order by StaffName"
    //        console.log(fQuery) 
            }
        else {
            this.reportid   = "htp5rccUteYVbXt6" 
            fQuery = fQuery + "Group by UniqueID,Title, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"
            fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"

            this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "include": inclusion,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "InActive Contractor List.pdf"
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
        
        
    }
    ActiveVolunters(manager, branch, stfgroup, inclusion) {


        var fQuery = "Select s.UniqueID, s.Title, AccountNo, STF_CODE as StaffCode, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, format( CommencementDate,'dd/MM/yyyy') as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'VOLUNTEER'   AND ([commencementdate] is not null and [terminationdate] is null)  "

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','") + "')";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }


        if (branch != "") {
            var lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Groups: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }


       
        //    console.log(fQuery)
        if (this.inputForm.value.printaslabel == true){ 

            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "Active Volunteers.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)
        //    this.reportid = "6dfbj72obyLi9qxJ"
    }
        else {
            this.reportid   = "JlsnP7fNb9LOGeVw" 
            fQuery = fQuery + "Group by UniqueID,Title, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"

            fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"

            this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "include": inclusion,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Active Volunteers.pdf"
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
        
    }

    InActiveVolunteers(manager, branch, stfgroup, inclusion) {


        var fQuery = "Select s.UniqueID,s.Title, AccountNo, STF_CODE as StaffCode, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, format( CommencementDate,'dd/MM/yyyy') as CommencementDate, format(TerminationDate,'dd/MM/yyyy') as TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'VOLUNTEER'   AND ([commencementdate] is not null and [terminationdate] is not null)  "

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','") + "')";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }


        if (branch != "") {
            var lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Groups: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }


        
        // console.log(fQuery)
        if (this.inputForm.value.printaslabel == true){ 

            this.reportid = "6dfbj72obyLi9qxJ"
            this.pdfTitle = "InActive Volunteers.pdf"
            this.labelfilter(fQuery,this.reportid, this.pdfTitle,'',lblcriteria)

            //this.reportid = "6dfbj72obyLi9qxJ"
            //fQuery = "Select Distinct Title,StaffName as AccountNo,Address1,Address2,Suburb,Postcode from  (" + fQuery + " )cr Order by StaffName"
     
            }
        else {
            this.reportid   = "lcl6jxcRDYzgs7kJ" 
            fQuery = fQuery + "Group by UniqueID,Title, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"

            fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"

            this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "include": inclusion,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "InActive Volunteers.pdf"
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
        
    }

    StaffPermissions(branch, manager, region, program) {


        var fQuery = "SELECT [NAME], CASE WHEN [SYSTEM] = 999 THEN 'YES' ELSE 'NO' END AS [SYSTEM ADMINISTRATOR], CASE WHEN RECIPIENTS = 0 THEN 'NONE'      WHEN RECIPIENTS = 1 THEN 'LEVEL1'      WHEN RECIPIENTS = 101 THEN 'LEVEL2'      WHEN RECIPIENTS = 201 THEN 'LEVEL3'      WHEN RECIPIENTS = 901 THEN 'LEVEL4'      WHEN RECIPIENTS = 951 THEN 'LEVEL5'      WHEN RECIPIENTS = 999 THEN 'LEVEL6' END AS [RECIPIENTS ACCESS LEVEL], CASE WHEN ROSTER = 0 THEN 'NONE'      WHEN ROSTER = 1 THEN 'LEVEL1'      WHEN ROSTER = 101 THEN 'LEVEL2'      WHEN ROSTER = 121 THEN 'LEVEL3'      WHEN ROSTER = 201 THEN 'LEVEL4'      WHEN ROSTER = 251 THEN 'LEVEL5'      WHEN ROSTER = 501 THEN 'LEVEL6'      WHEN ROSTER = 999 THEN 'LEVEL7' END AS [ROSTER ACCESS LEVEL], CASE WHEN STAFF = 0 THEN 'NONE'      WHEN STAFF = 251 THEN 'LEVEL1'      WHEN STAFF = 301 THEN 'LEVEL2'      WHEN STAFF = 901 THEN 'LEVEL3'      WHEN STAFF = 999 THEN 'LEVEL4' END AS [STAFF ACCESS LEVEL], CASE WHEN DAYMANAGER = 0 THEN 'NONE'      WHEN DAYMANAGER = 1 THEN 'LEVEL1'      WHEN DAYMANAGER = 101 THEN 'LEVEL2'      WHEN DAYMANAGER = 121 THEN 'LEVEL3'      WHEN DAYMANAGER = 201 THEN 'LEVEL4'      WHEN DAYMANAGER = 251 THEN 'LEVEL5'      WHEN DAYMANAGER = 301 THEN 'LEVEL6'      WHEN DAYMANAGER = 999 THEN 'LEVEL7' END AS [DAYMANAGER ACCESS LEVEL], CASE WHEN [RECIPMGTVIEW] = 1 THEN 'YES' ELSE 'NO' END AS [RECIPIENT MANAGEMENT VIEW], CASE WHEN [ACCESSHRINFO] = 1 THEN 'YES' ELSE 'NO' END AS [ACCESS HR], CASE WHEN [CASENOTESREADONLY] = 1 THEN 'YES' ELSE 'NO' END AS [CASE NOTES VIEW ONLY], CASE WHEN [ADDNEWRECIPIENT] = 1 THEN 'YES' ELSE 'NO' END AS [ADD NEW RECIPIENTS], CASE WHEN [CHANGEMASTERROSTER] = 1 THEN 'YES' ELSE 'NO' END AS [CHANGE MASTER ROSTER], CASE WHEN [OWNROSTERONLY] = 1 THEN 'YES' ELSE 'NO' END AS [LOCK TO OWN ROSTER], CASE WHEN [APPROVEDAYMANAGER] = 1 THEN 'YES' ELSE 'NO' END AS [APPROVE IN DAYMANAGER], CASE WHEN [MANUALROSTERCOPY] = 999 THEN 'YES' ELSE 'NO' END AS [MANUAL COPY ROSTER], CASE WHEN [AUTOCOPYROSTER] = 999 THEN 'YES' ELSE 'NO' END AS [AUTO COPY ROSTER],CASE WHEN [TIMESHEET] = 999 THEN 'YES' ELSE 'NO' END AS [TIMESHEETS], CASE WHEN [SUGGESTEDTIMESHEETS] = 999 THEN 'YES' ELSE 'NO' END AS [SUGGESTED TIMESHEETS], CASE WHEN [TIMESHEETUPDATE] = 999 THEN 'YES' ELSE 'NO' END AS [PAY AND BILLING UPDATE], CASE WHEN [FINANCIAL] = 999 THEN 'YES' ELSE 'NO' END AS [FINANCIAL], CASE WHEN [STATISTICS] = 999 THEN 'YES' ELSE 'NO' END AS [LISTINGS], CASE WHEN [INVOICEENQUIRY] = 999 THEN 'YES' ELSE 'NO' END AS [INVOICE ENQUIRY], VIEWFILTERBRANCHES, VIEWFILTER AS VIEWFILTERPROGRAMS, VIEWFILTERCATEGORY, VIEWFILTERCOORD, VIEWFILTERREMINDERS, RECIPIENTRECORDVIEW, STAFFRECORDVIEW FROM USERINFO WHERE (EndDate Is Null OR EndDate >= '2020/01/01')  "
        var lblcriteria;
        /*    if (branch != ""){
                this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
                if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
                
            } 
             if(manager != ""){
                this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
                if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
                
            } 
            if(region != ""){
                this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
                if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL}
            }
            if(program != ""){
                this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
                if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
            } 
    
            
            if (branch != ""){ 
                lblcriteria = "Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = " All Branches "}
            
             if (manager != ""){
                lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Managers,"}
            
            
            if (region != ""){ 
                lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Regions,"}
            
           
            if (program != ""){ 
                lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Programs."}
            
                 */
        fQuery = fQuery + "ORDER BY [NAME] "

        ///  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "cHHdyk2ACQuXsxFw" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff User Permissions.pdf"
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

    MealOrderReport(recipient, startdate, enddate, tempsdate, tempedate) {

        var fQuery = "SELECT  [CLIENT CODE], [SERVICE TYPE], [BILLTEXT], [DATE],  [BILLQTY], [COSTQTY],  [INSTANCES] FROM ( SELECT [CLIENT CODE], [SERVICE TYPE], I.BillText, [DATE], ROUND(BILLQTY,2) AS BILLQTY, ROUND(COSTQTY,2) AS COSTQTY, COUNT(*) AS  [INSTANCES]  FROM ROSTER R INNER JOIN ITEMTYPES I ON R.[SERVICE TYPE] = I.TITLE AND I.MinorGroup = 'MEALS' GROUP BY [CLIENT CODE], [SERVICE TYPE], I.BillText, [DATE], BILLQTY, COSTQTY  )t  WHERE  "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " DATE BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (recipient != "") {
            this.s_CoordinatorSQL = "[CLIENT CODE] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (recipient != "") {
            lblcriteria = lblcriteria + " Manager: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }

        fQuery = fQuery + "  ORDER BY [CLIENT CODE],DATE "

        ///  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "zxZz19oiShZi9IuQ" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        
        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Meal Order Report.pdf"
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
    lagtimeregister(branch, program,startdate, enddate, tempsdate, tempedate) {


        var fQuery = " SELECT DISTINCT R.[Client Code], R.[Program], R.[Date], [Recipients].[UBDMap], [Recipients].[Type], [Recipients].[DischargeDate], [ItemTypes].[MinorGroup] FROM ROSTER R INNER JOIN ItemTypes ON R.[Service Type] = [ItemTypes].[Title] INNER JOIN Recipients ON R.[Client Code] = [Recipients].[Accountno] WHERE EXISTS (SELECT R.Date FROM ROSTER R2 Where R2.[CLIENT CODE] = R.[CLIENT CODE]  AND R2.PROGRAM = R.PROGRAM   AND [SERVICE TYPE] IN (SELECT TITLE FROM ITEMTYPES WHERE MINORGROUP = 'REFERRAL-IN')  "
        " AND [DATE] BETWEEN '2021/09/01' AND '2021/12/31') "

        " AND R.[Date] >= '2021/09/01' "

        //" AND [DATE] BETWEEN '2021/12/01' AND '2021/12/31') "
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " DATE BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        fQuery = fQuery + " AND [ItemTypes].MinorGroup IN ('REFERRAL-IN','ASSESSMENT','ADMISSION','DISCHARGE') "
        fQuery = fQuery +" AND R.[Date] >= '"+ tempsdate +"'  "
        //
        
        //fQuery = fQuery +" AND  (Recipients.Branch = 'HOBART' OR Recipients.Branch = 'DARWIN' OR Recipients.Branch = 'PERTH') "
        //" AND (Recipients.AgencyDefinedGroup = 'INVERELL' OR Recipients.AgencyDefinedGroup = 'KYOGLE') "
        //" AND  (Recipients.RECIPIENT_CoOrdinator = 'BERNADENE JEFFREYS' OR Recipients.RECIPIENT_CoOrdinator = 'BERNADENE JEFFREYS' OR Recipients.RECIPIENT_CoOrdinator = 'DELL PAULIG' OR Recipients.RECIPIENT_CoOrdinator = 'EZIECHIELE BLEMEN' OR Recipients.RECIPIENT_CoOrdinator = 'FLORRY HYNDSON' OR Recipients.RECIPIENT_CoOrdinator = 'EDITH HEAKE') "
        var lblcriteria;
        if (branch != "") {
            this.s_BranchSQL = "BRANCH in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }

        }
       
        if (program != "") {
            this.s_ProgramSQL = " (PROGRAM in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }
        

        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }


        fQuery = fQuery + " ORDER BY [Client Code], [Program], Date "

    
        //console.log(fQuery)        
        const data = {

            "template": { "_id": "jEU5BSyn0puhfwPP" },
            "options": {
                "reports": { "save": false },                
                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Lag Time Register.pdf"
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

    HASReport(program, startdate, enddate) {


        var fQuery = "SELECT Distinct  ro.[Date], ro.[Client Code] , it.[DatasetGroup], ro.[Service Type], ro.[Program],  CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS [Household]  FROM Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  INNER JOIN Recipients r ON r.AccountNo  = ro.[Client Code]  LEFT JOIN (SELECT PERSONID, Suburb,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress = 1)AS N1 ON N1.PersonID = r.[UniqueID]  LEFT JOIN(SELECT PERSONID,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress <> 1)            AS N2 ON N2.PersonID =  r.[UniqueID]  WHERE  it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup IN('HOME MAINTENANCE', 'INFORMATION & REFERRAL') "
        var lblcriteria;
        var Client = "SELECT Count( DISTINCT ro.[Client Code]) as ClientCount From Roster ro INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  WHERE (ro.[Date] BETWEEN '" + startdate + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND Upper(it.DatasetGroup) = 'GENERAL SERVICES'"
        var InRefStf = "SELECT SUM((ro.duration * 5 / 60)) as StaffOutputInfRef From Roster ro INNER JOIN ItemTypes it ON ro.[service type] = it.[title] LEFT JOIN Staff s1 on s1.AccountNo = ro.[Carer Code]   WHERE (ro.[Date] BETWEEN '" + startdate + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND Upper(it.DatasetGroup) = 'GENERAL SERVICES'";
        var HHouse = "SELECT  COUNT (DISTINCT CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END)  AS [HouseholdCount]  FROM Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  INNER JOIN Recipients r ON r.AccountNo  = ro.[Client Code]  LEFT  JOIN (SELECT PERSONID, Suburb,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress = 1)AS N1 ON N1.PersonID = r.[UniqueID]  INNER JOIN(SELECT PERSONID,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress <> 1)            AS N2 ON N2.PersonID =  r.[UniqueID]  WHERE (ro.[Date] BETWEEN '" + startdate + "' AND '" + enddate + "') AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup = 'HOME MAINTENANCE'  ";
        var Fiscal = "SELECT DISTINCT  COUNT (DISTINCT CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END )  AS [FiscalHouseholdCount]  FROM  Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  INNER JOIN Recipients r ON r.AccountNo  = ro.[Client Code]  LEFT  JOIN (SELECT PERSONID, Suburb,            CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END + CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END + CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress = 1) AS N1 ON N1.PersonID = r.[UniqueID]  INNER JOIN (SELECT PERSONID, CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END + CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END + CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)            AS N2 ON N2.PersonID =  r.[UniqueID]  WHERE (ro.[Date] BETWEEN '" + startdate + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup = 'HOME MAINTENANCE'";
        var StfHrs = "SELECT  COUNT((ro.duration * 5 / 60)) as StaffOutPut  FROM Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  LEFT JOIN Staff s1 on s1.AccountNo = ro.[Carer Code]  WHERE (ro.[Date] BETWEEN'" + startdate + "' AND '" + enddate + "') AND  s1.Category IN ('STAFF', 'VOLUNTEER') AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup = 'HOME MAINTENANCE' ";
        var ExtStfHrs = "SELECT COUNT((ro.duration * 5 / 60)) as ExStaffOutput FROM Roster ro INNER JOIN ItemTypes it ON ro.[service type] = it.[title] LEFT JOIN Staff s1 on s1.AccountNo = ro.[Carer Code]  WHERE (ro.[Date] BETWEEN '" + startdate + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT' AND it.DatasetGroup = 'HOME MAINTENANCE' ";


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " ro.[Date] BETWEEN '" + startdate + ("'AND'") + enddate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + " Order By DatasetGroup, [Date]  "

        ///  //////console.log(fQuery)

        this.drawerVisible = true;
        

        const data = {
            "template": { "_id": "DOmzAbp2LTdUL58S" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "ClientCount": Client,
                "InRefStaff": InRefStf,
                "HouseHold": HHouse,
                "FY": Fiscal,
                "StfHour": StfHrs,
                "ExtStfHour": ExtStfHrs

            }
        }
        this.loading = true;

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "HAS Report.pdf"
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

    CDCLeaveRegister(branch, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT [CLIENT CODE], CDC_Level ,  [LEAVETYPE], format( DateAdd(D, 0, MIN([DATE])),'dd/MM/yyyy') AS START_DATE,format( DATEADD(D, 0, MAX([DATE])),'dd/MM/yyyy') AS END_DATE, COUNT(*) AS CONTINUOUS_DAYS FROM ( SELECT DISTINCT [CLIENT CODE], IT.[MINORGROUP] AS LEAVETYPE, HRT.User3 as CDC_Level, RE.[BRANCH], RO.[DATE], DATEADD(D,-DENSE_RANK() OVER ( PARTITION BY [CLIENT CODE] ORDER BY [DATE]),[DATE] ) AS RANKDATE FROM ROSTER RO  INNER JOIN RECIPIENTS RE ON RO.[Client Code] = RE.Accountno  INNER JOIN ITEMTYPES IT ON RO.[Service Type] = IT.Title  INNER JOIN HumanResourceTypes HRT ON HRT.Name = RO.Program AND HRT.[GROUP] = 'PROGRAMS'  WHERE  "
        var lblcriteria;

        //(RO.[DATE] BETWEEN '2020/08/01' AND '2020/08/31') AND
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " ro.[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "RE.BRANCH in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " (RO.PROGRAM in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + "AND IT.[MINORGROUP] IN ('FULL DAY-HOSPITAL', 'FULL DAY-RESPITE', 'FULL DAY-SOCIAL LEAVE', 'FULL DAY-TRANSITION') ) AS T"
        fQuery = fQuery + " GROUP BY [CLIENT CODE], CDC_Level, [LEAVETYPE], RANKDATE, BRANCH  "

        //  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "ixpCLJFq7CjWgMqw" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "CDC Leave Register.pdf"
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

    CDCPackageBalanceReport(recipient, program, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT R.AccountNo, HR.Name as Program, PB.[Date], PB.Balance, PB.BatchNumber, PB.BankedContingency FROM PackageBalances PB  INNER JOIN Recipients R ON PB.PersonID = R.SQLID  INNER JOIN HumanResourceTypes HR ON PB.ProgramID = HR.RecordNumber WHERE  "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (PB.[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (HR.[Name] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (recipient != "") {
            this.s_CoordinatorSQL = "R.AccountNo in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }

        if (recipient != "") {
            lblcriteria = " Manager: " + recipient.join(",") + "; "
        }
        else { lblcriteria = "All Recipients," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }

        fQuery = fQuery + " ORDER BY HR.Name, R.AccountNo, PB.[Date]  "

        // //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "wRMaDCYI8N1RwmHp" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        


        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "CDC Package Balance.pdf"
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

    IncidentRegister(branch, SvcType, Staff, incidenttype, category, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT AccountNo, Branch, AccountNo + ' - ' + CASE WHEN [Surname/Organisation]<> '' THEN Upper([Surname/Organisation]) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  + CASE WHEN Address1 <> '' THEN ' ' + Address1  ELSE ' '  END + CASE WHEN Address2 <> '' THEN ' ' + Address2  ELSE ' '  END + CASE WHEN pSuburb <> '' THEN ' ' + pSuburb  ELSE ' '  END + CASE WHEN R.[Phone] <> '' THEN ' Ph.' + R.[Phone]  ELSE ' '  END AS NameAddressPhone, (SELECT CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName FROM STAFF WHERE AccountNo = ReportedBy) As ReportedByStaff, (SELECT CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName FROM STAFF WHERE AccountNo = CurrentAssignee)  As AssignedToStaff , I.*, format(Date, 'dd/MM/yyyy') as ReportedDate FROM IM_Master I INNER JOIN RECIPIENTS R ON I.PERSONID = R.UNIQUEID WHERE"
        var lblcriteria;


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "([BRANCH] in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (SvcType != "") {
            this.s_SvcTypeSQL = " ([Service] in ('" + SvcType.join("','") + "'))";
            if (this.s_SvcTypeSQL != "") { fQuery = fQuery + " AND " + this.s_SvcTypeSQL }
        }
        if (Staff != "") {
            this.s_StfSQL = "([CurrentAssignee] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (incidenttype != "") {
            this.s_IncedentTypeSQL = "(i.[Type] in ('" + incidenttype.join("','") + "'))";
            if (this.s_IncedentTypeSQL != "") { fQuery = fQuery + " AND " + this.s_IncedentTypeSQL };
        }
        if (category != "") {
            this.s_incidentCategorySQL = "(i.[Status] in ('" + category.join("','") + "'))";
            if (this.s_incidentCategorySQL != "") { fQuery = fQuery + " AND " + this.s_incidentCategorySQL };
        }

        if (category != "") {
            lblcriteria = " Incident Category: " + category.join(",") + "; "
        }
        else { lblcriteria = "All Categories," }
        if (incidenttype != "") {
            lblcriteria = lblcriteria + " Incedent Type: " + incidenttype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Incedent Types," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (SvcType != "") {
            lblcriteria = lblcriteria + " Service Type " + SvcType.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Svc. Types" }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (Staff != "") {
            lblcriteria = lblcriteria + " Assigned To: " + Staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff ," }

        fQuery = fQuery + " ORDER BY DATE  "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "ufrXaKoSnk1utHyJ" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Incident Register.pdf"
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

    LoanItemRegister(branch, program, recipient, loanitems, loancategory, startdate, enddate, temsdate, tempedate) {


        var fQuery = "SELECT HumanResources.Name,HumanResources.PersonID,HumanResources.[Type],HumanResources.[Address1],HumanResources.[Group],format(HumanResources.Date1,'dd/MM/yyyy') as Date1, format(HumanResources.Date2,'dd/MM/yyyy') as Date2,Recipients.AccountNo,        Recipients.Branch FROM HumanResources INNER JOIN Recipients on HumanResources.PersonID = Recipients.UniqueID  WHERE   HumanResources.[Group] = 'LOANITEMS' "
        var lblcriteria;

        var Title = "RECIPIENT LOAN REGISTER"; 

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " ((Date1 < '" + temsdate + ("') AND ((Date2 Is Null) OR(Date2 >'") + tempedate + "' )) )";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "Branch  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([HumanResources].[Address1] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (recipient != "") {
            this.s_CoordinatorSQL = "AccountNo in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (loanitems != "") {
            this.s_IncedentTypeSQL = "([Name] in ('" + loanitems.join("','") + "'))";
            if (this.s_loanitemsSQL != "") { fQuery = fQuery + " AND " + this.s_loanitemsSQL };
        }
        if (loancategory != "") {
            this.s_loancategorySQL = "(i.[Status] in ('" + loancategory.join("','") + "'))";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_loancategorySQL };
        }

        if (loancategory != "") {
            lblcriteria = " Incident Category: " + loancategory.join(",") + "; "
        }
        else { lblcriteria = "All Categories," }
        if (loanitems != "") {
            lblcriteria = lblcriteria + " Loan Items: " + loanitems.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Items," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (recipient != "") {
            lblcriteria = " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }

        if(this.inputForm.value.incl_inactive == false ){
            
        }
        
        
        if(this.inputForm.value.incl_outstanding == true ){
            fQuery = fQuery + " AND Date2 IS Null "
            lblcriteria = lblcriteria + " Only Outstanding "
        }

        fQuery = fQuery + " ORDER BY HumanResources.Name "

        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "3OJaZgWOBy3b9hOI" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "txtTitle": Title,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Loan Item Register.pdf"
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
    StaffLeaveRegister(startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT ACCOUNTNO, L.NAME, format(DATE1,'dd/MM/yyyy') as StartDate, format(DATE2,'dd/MM/yyyy')  as EndDate, L.NOTES, CASE WHEN IsNull(L.Completed,0) = 1 THEN 'YES' ELSE 'NO' END AS APPROVED  FROM STAFF S  INNER JOIN HUMANRESOURCES L ON S.UNIQUEID = L.PERSONID AND L.[GROUP] = 'LEAVEAPP' WHERE      "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "Date1 BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " " + this.s_DateSQL };
        }

        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }

        fQuery = fQuery + " ORDER BY  ACCOUNTNO  "

        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "w41oVwE0B5tGyRBi" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        


        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Leave Register.pdf"
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
    StaffSvcNotesRegister(branch,Staff,svcnotes,startdate, enddate, tempsdate, tempedate) {

// History.DetailDate Between '06-01-2021' AND '06-30-2021 23:59:59'     
        var fQuery = "SELECT DISTINCT * FROM ( SELECT  (S.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, CASE WHEN PRIMARYADDRESS <> '' THEN  lower(PRIMARYADDRESS) ELSE lower(OTHERADDRESS) END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, S.AccountNo AS StaffCode, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail, format(convert(datetime,History.DetailDate),'dd/MM/yyyy') AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Roster Ro INNER JOIN History ON  CONVERT(varchar,Ro.RecordNo,100) = History.PersonID Left Join STAFF as S ON S.AccountNo = Ro.[Carer Code]  LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON S.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON S.UNIQUEID = P.PERSONID WHERE ExtraDetail1 = 'SVCNOTE'  "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "History.DetailDate BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " and " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "(S.[STF_DEPARTMENT] in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (Staff != "") {
            this.s_StfSQL = "([AccountNo] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (svcnotes != "") {
            this.s_SvcNoteSQL = "([ExtraDetail2] in ('" + svcnotes.join("','") + "'))";
            if (this.s_SvcNoteSQL != "") { fQuery = fQuery + " AND " + this.s_SvcNoteSQL };
        }
        //


        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
       
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
       
        if (Staff != "") {
            lblcriteria = lblcriteria + " Assigned To: " + Staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff ," }

        if (svcnotes != "") {
            lblcriteria = lblcriteria + " Service Notes: " + svcnotes.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Service Notes ," }




        fQuery = fQuery + " AND [CARER CODE] > '!Z' AND [CLIENT CODE] IN ('!INTERNAL', '!MULTIPLE')  "
        if(this.inputForm.value.incl_archived == true){
            fQuery = fQuery + " AND (History.DeletedRecord = 1)  ) ROP "
            lblcriteria = lblcriteria + " Archived Notes Included."
            
        }else{
            fQuery = fQuery + " AND (History.DeletedRecord = 0)  ) ROP "
        }
        //
        fQuery = fQuery + " ORDER BY ROP.[StaffName], ROP.DateCreated  "

//        console.log(fQuery)

        this.drawerVisible = true;
        

        const data = {
            //"shortid":"Yh_8YURVWa"
            "template": { "shortid": "Yh_8YURVWa" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        
        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Service Notes Register.pdf"
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

    StaffNotWorkedReport(branch, stfgroup, staff, startdate, enddate,tempsdate, tempedate) {


        var fQuery = "SELECT  ST.AccountNo, ST.STF_CODE as Staff#, ST.STF_DEPARTMENT as StaffBranch, ST.StaffGroup as JobCategory, ST.SubCategory as AdminCategory, ST.ServiceRegion  FROM STAFF ST Where NOT Exists ( SELECT [Carer Code]  FROM Roster WHERE [Carer Code]  = ST.AccountNo AND [Carer Code]  >'!z' AND Roster.[TYPE] BETWEEN 2 AND 12   "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " Roster.[DATE] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staff != "") {
            this.s_StaffSQL = "[AccountNo] in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }




        if (branch != "") {
            lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = "All Branches," }
        if (staff != "") {
            lblcriteria = " Staff:" + staff.join(",") + "; "
        }
        else { lblcriteria = "All Staff," }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Assigned To: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }

        if (this.inputForm.value.activeStaffonly == true){
            fQuery = fQuery +" AND (COmmencementDate IS NOT NULL and TerminationDate IS NULL) "
            lblcriteria = lblcriteria + "Active Staff Only  "+ "; "
        }
        fQuery = fQuery + " ORDER BY [AccountNo], [STF_DEPARTMENT], [StaffGroup] "

       // console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "01uDIoKwUysCboDf" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Not Worked Report.pdf"
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

    StaffCompetencyRenewal(branch, staff, competency, manager, staffteam,stfgroup, competencygroup, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT  IsNull([PAN_MANAGER],'') as Coordinator , UPPER(Staff.LastName) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName,Staff.StaffGroup,Staff.Category,Staff.STF_DEPARTMENT,HumanResources.Name as Competency,CASE WHEN HumanResources.Date1 IS NULL THEN 'MISSING' ELSE format (HumanResources.Date1, 'dd/MM/yyyy mm:hh') END AS [Expiry Date],HumanResources.Notes "
        if(this.inputForm.value.printaslabel == true){ 
            fQuery = fQuery + " Title,AccountNo,Staff.Address1,Staff.Address2,Staff.Suburb,Staff.Postcode "
        }

        fQuery = fQuery + " FROM Staff INNER JOIN HumanResources ON Staff.UniqueID = HumanResources.PersonID WHERE (HumanResources.[Type] = 'STAFFATTRIBUTE')   "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (HumanResources.[Date1] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "') ";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (this.inputForm.value.excl_missing == false){
            fQuery = fQuery + " OR ISNULL(HumanResources.[Date1], '') = '' "
        }
        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([STAFFTEAM] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staff != "") {
            this.s_StaffSQL = "[AccountNo] in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[PAN_MANAGER] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (competency != "") {
            this.s_CompetencySQL = "[HumanResources].[Name] in ('" + competency.join("','") + "')";
            if (this.s_CompetencySQL != "") { fQuery = fQuery + " AND " + this.s_CompetencySQL };
        }
        if (competencygroup != "") {
            this.s_CompetencyGroupSQL = "[PAN_Manager] in ('" + competencygroup.join("','") + "')";
            if (this.s_CompetencyGroupSQL != "") { fQuery = fQuery + " AND " + this.s_CompetencyGroupSQL };
        }

        if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery + " AND ([commencementdate] is not null and [terminationdate] is null)" 
        }

         
            var mask = concat(this.inputForm.value.includestaff, this.inputForm.value.includebroker, this.inputForm.value.includevolunteer).toString()
            console.log(mask);
            switch (mask) {
                case "false,false,true":
                fQuery = fQuery + " AND ([CATEGORY] IN ('VOLUNTEER'))"                                                      
                    break;
                    case "false,true,false":
                    fQuery = fQuery + " AND ([CATEGORY] IN ('BROKERAGE ORGANISATION'))"                                                
                    break;            
                    case "false,true,true":
                    fQuery = fQuery + " AND ([CATEGORY] IN ('VOLUNTEER', 'BROKERAGE ORGANISATION'))"                               
                    break;
                    case "true,false,false":
                    fQuery = fQuery + " AND ([CATEGORY] IN ('STAFF'))"                                                                   
                    break;
                    case "true,false,true":
                    fQuery = fQuery + " AND ([CATEGORY] IN ('VOLUNTEER', 'STAFF'))"                                                                
                    break;
                    case "true,true,false":
                    fQuery = fQuery + " AND ([CATEGORY] IN ('BROKERAGE ORGANISATION', 'STAFF'))"                                                
                    break;
                    case "true,true,true":
                    break;    
                default:
                    break;
            }
            
            
            
            
        


        if (branch != "") {
            lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }
        if (staff != "") {
            lblcriteria = lblcriteria + " Staff:" + staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Staff, " }
        if (competencygroup != "") {
            lblcriteria = lblcriteria + " Competency Group:" + competencygroup.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Competency Groups," }
        if (competency != "") {
            lblcriteria = lblcriteria + " Competency:" + competency.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Competencies, " }
        if (staffteam != "") {
            lblcriteria = lblcriteria + " Staff Team: " + staffteam.join(",") + "; "
        }
        
        else { lblcriteria = lblcriteria + " All Staff Team," }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Job Category: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Job Categories," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Managers," }


        if(this.inputForm.value.printaslabel == true){ 
            
            fQuery = "Select Distinct StaffName as AccountNo,Address1,Address2,Suburb,Postcode from  (" + fQuery + " )cr Order by StaffName"
            this.reportid = "6dfbj72obyLi9qxJ"
           
        }else{
            this.reportid = "Nl0aajvRfsYjDEsb"
        }

        if(this.inputForm.value.printaslabel == false){ 
            if(this.inputForm.value.groupbyCoordinators == true){            
                fQuery = fQuery + " ORDER BY PAN_MANAGER, Staff.[LastName], Staff.[FirstName] "
                this.reportid = "WEZGNxF91omVDGWq"
            }else{
                fQuery = fQuery + " ORDER BY Staff.[LastName], Staff.[FirstName] "
            }
        }

    //  console.log(fQuery) 

        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid},
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Competency Renewal.pdf"
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
    StaffUnavailability(branch, stfgroup, staff, stafftype, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME,  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Carer Code] <> '!INTERNAL' AND [Carer Code] <> '!MULTIPLE')  AND Roster.[Type] = 13 "
        var lblcriteria;

        //AND Date BETWEEN '2020/08/01' AND '2020/08/31'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "( Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staff != "") {
            this.s_StaffSQL = "[Carer Code] in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }




        if (branch != "") {
            lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }
        if (stafftype != "") {
            lblcriteria = " Branches:" + stafftype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Staff types, " }
        if (staff != "") {
            lblcriteria = " Staff:" + staff.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Assigned To: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Staff Groups, " }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }


        fQuery = fQuery + "  ORDER BY [Carer Code], Date, [Start Time] "

        //console.log(fQuery)

        this.drawerVisible = true;
        

        const data = {
            "template": { "_id": "K2JHPJM2MhBWbVqK" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "notes" : this.inputForm.value.include_AdditionalInfo,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff UnAvailability Report.pdf"
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

    StaffRoster(branch, stfgroup, staff, stafftype, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME,  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Carer Code] > '!MULTIPLE') AND Type <> 1     "
        var lblcriteria;
        if (this.inputForm.value.include_unavailability == false){
            fQuery = fQuery + " AND (Type <> 13) "
        }
        //AND (Date BETWEEN '2020/08/01' AND '2020/08/31')
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "( Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staff != "") {
            this.s_StaffSQL = "[Carer Code] in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }




        if (branch != "") {
            lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = "All Branches," }
        if (stafftype != "") {
            lblcriteria = lblcriteria + " Staff type:" + stafftype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff Types," }
        if (staff != "") {
            lblcriteria =lblcriteria + " Staff:" + staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff," }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Job Category: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Job Categories," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }


        fQuery = fQuery + " ORDER BY [Carer Code], convert(datetime,[Roster].[Date]), [Start Time]  "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "PV0M95ECHuYRp0QD" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "notes":this.inputForm.value.include_AdditionalInfo,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Roster.pdf"
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

    StaffMasterRoster(branch, stfgroup, staff, stafftype, startdate, enddate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME,  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Carer Code] <> '!INTERNAL' AND [Carer Code] <> '!MULTIPLE')    "
        var lblcriteria;
        if (this.inputForm.value.include_unavailability == false){
            fQuery = fQuery + " AND (Type <> 13) "
        }
        //AND Date BETWEEN '1900/01/01' AND '1900/01/28'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "( Date BETWEEN '" + startdate + ("'AND'") + enddate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staff != "") {
            this.s_StaffSQL = "[Carer Code] in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }




        if (branch != "") {
            lblcriteria = " Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches, " }
        if (stafftype != "") {
            lblcriteria = lblcriteria + " Staff Type:" + stafftype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Staff types, " }
        if (staff != "") {
            lblcriteria = " Staff:" + staff.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Group: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }


        fQuery = fQuery + " ORDER BY [Carer Code], convert(datetime,[Roster].[Date]), [Start Time]  "

        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "I2d0gKTCdLP2phas" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "notes":this.inputForm.value.include_AdditionalInfo,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Master Roster.pdf"
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
    StaffLoanRegister(branch, program, staff, loanitems,jobcategory, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT HumanResources.Name,HumanResources.PersonID,HumanResources.[Type],HumanResources.[Address1],HumanResources.[Group],format(HumanResources.Date1,'dd/MM/yyyy') as Date1, format(HumanResources.Date2,'dd/MM/yyyy') as Date2,Staff.AccountNo, Staff.STF_DEPARTMENT FROM HumanResources INNER JOIN Staff ON HumanResources.PersonID = Staff.UniqueID  WHERE   HumanResources.[Group] = 'LOANITEMS' "
        var lblcriteria;

        var Title = "STAFF LOAN REGISTER"; 

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " ((Date1 >= '" + tempsdate + ("') AND ((Date2 Is Null) OR(Date2 <= '") + tempedate + "' )) )";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "STF_DEPARTMENT  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([HumanResources].[Address1] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (staff != "") {
            this.s_CoordinatorSQL = "AccountNo in ('" + staff.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (loanitems != "") {
            this.s_IncedentTypeSQL = "([Name] in ('" + loanitems.join("','") + "'))";
            if (this.s_loanitemsSQL != "") { fQuery = fQuery + " AND " + this.s_loanitemsSQL };
        }
        if (jobcategory != "") {
            this.s_StfGroupSQL = "( StaffGroup in ('" + jobcategory.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }

        if (jobcategory != "") {
            lblcriteria = " Job Category: " + jobcategory.join(",") + "; "
        }
        else { lblcriteria = "All Job Categories," }
        if (loanitems != "") {
            lblcriteria = lblcriteria + " Loan Items: " + loanitems.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Items," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs," }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches, " }
        if (staff != "") {
            lblcriteria = lblcriteria + " Staff: " + staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff," }

        if(this.inputForm.value.incl_outstanding == true ){
            fQuery = fQuery + " AND Date2 IS Null "
            lblcriteria = lblcriteria + " Only Outstanding "
        }

        fQuery = fQuery + " ORDER BY HumanResources.Name "

    //    console.log(fQuery)


        this.drawerVisible = true;

        const data = {
            "template": { "_id": "3OJaZgWOBy3b9hOI" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                "txtTitle": Title,

            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Loan Register.pdf"
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

    RecipientProg_CaseReport(branch, program, casenotecat, recipient, discipline, caredomain, category, manager, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(R.[Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as ClientName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, R.AccountNo AS ClientCode, R.[Type] AS RecipType, R.[Branch] AS Branch, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail, format(History.DetailDate,'dd/MM/yyyy') AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Recipients as R INNER JOIN History ON R.UniqueID = History.PersonID LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON R.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON R.UNIQUEID = P.PERSONID WHERE   "
        var lblcriteria;

        // '08-01-2019' AND '08-31-2020 23:59:59' AND
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (History. DetailDate Between '" + tempsdate + ("' AND '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (casenotecat != "") {
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','") + "')";
            if (this.s_CaseNoteSQL != "") { fQuery = fQuery + " AND " + this.s_CaseNoteSQL };
        }
        if (category != "") {
            this.s_CategorySQL = "[AGENCYDEFINEDGROUP] in ('" + category.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL }
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[AccountNo] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (discipline != "") {
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','") + "'))";
            if (this.s_DisciplineSQL != "") { fQuery = fQuery + " AND " + this.s_DisciplineSQL };
        }
        if (caredomain != "") {
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','") + "')";
            if (this.s_CareDomainSQL != "") { fQuery = fQuery + " AND " + this.s_CareDomainSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[RECIPIENT_COORDINATOR] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }




        if (discipline != "") {
            lblcriteria = " Disciplines: " + discipline.join(",") + "; "
        }
        else { lblcriteria = "All Disciplines," }
        if (caredomain != "") {
            lblcriteria = " Care Domains: " + caredomain.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Care Domains," }
        if (recipient != "") {
            lblcriteria = " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (category != "") {
            lblcriteria = lblcriteria + " Regions: " + category.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }
        if (casenotecat != "") {
            lblcriteria = lblcriteria + " Case Notes: " + casenotecat.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Case Notes," }
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }

        fQuery = fQuery + "AND ExtraDetail1 = 'CASENOTE'  AND (History.DeletedRecord = 0)  ) ROP"
        fQuery = fQuery + " ORDER BY ROP.[ClientName], ROP.DateCreated  "

        //  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "BTHy0VhO1rkhv5VZ" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Recipient Case Notes Register.pdf"
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

    ServiceNotesRegister(branch, program, casenotecat, recipient, discipline, caredomain, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(R.[Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as ClientName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, R.AccountNo AS ClientCode, R.[Type] AS RecipType, R.[Branch] AS Branch, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail,format(Convert (datetime,History.DetailDate,22),'dd/MM/yyyy MM:HH tt') AS DateCreated , History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Roster Ro INNER JOIN History ON  CONVERT(varchar,Ro.RecordNo,100) = History.PersonID Left Join Recipients as R ON R.AccountNo = Ro.[Client Code]  LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON R.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON R.UNIQUEID = P.PERSONID WHERE "
        var lblcriteria;

        // History. DetailDate Between '08-01-2019' AND '08-31-2020 23:59:59' 
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (History. DetailDate Between '" + tempsdate + ("' AND '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (casenotecat != "") {
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','") + "')";
            if (this.s_CaseNoteSQL != "") { fQuery = fQuery + " AND " + this.s_CaseNoteSQL };
        }

        if (recipient != "") {
            this.s_RecipientSQL = "[AccountNo] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (discipline != "") {
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','") + "'))";
            if (this.s_DisciplineSQL != "") { fQuery = fQuery + " AND " + this.s_DisciplineSQL };
        }
        if (caredomain != "") {
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','") + "')";
            if (this.s_CareDomainSQL != "") { fQuery = fQuery + " AND " + this.s_CareDomainSQL };
        }




        if (discipline != "") {
            lblcriteria = " Disciplines: " + discipline.join(",") + "; "
        }
        else { lblcriteria = "All Disciplines," }
        if (caredomain != "") {
            lblcriteria = " Care Domains: " + caredomain.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Care Domains," }
        if (recipient != "") {
            lblcriteria = " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (casenotecat != "") {
            lblcriteria = " Case Notes: " + casenotecat.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Case Notes," }

        fQuery = fQuery + "AND ExtraDetail1 = 'SVCNOTE'  AND (History.DeletedRecord = 0)  ) ROP "
        fQuery = fQuery + " ORDER BY ROP.[ClientName], ROP.DateCreated   "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "H8diePMsfdr5gYyV" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Service Notes Register.pdf"
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

    OPNotesRegister(branch, program, casenotecat, recipient, discipline, caredomain, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(R.[Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as ClientName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, R.AccountNo AS ClientCode, R.[Type] AS RecipType, R.[Branch] AS Branch, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail,format( History.DetailDate,'dd/MM/yyyy') AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Recipients as R INNER JOIN History ON R.UniqueID = History.PersonID LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON R.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON R.UNIQUEID = P.PERSONID WHERE ExtraDetail1 = 'OPNOTE'"
        var lblcriteria;

        // History. DetailDate Between '08-01-2020' AND '08-31-2020 23:59:59'
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (History. DetailDate Between '" + tempsdate + ("' AND '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (casenotecat != "") {
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','") + "')";
            if (this.s_CaseNoteSQL != "") { fQuery = fQuery + " AND " + this.s_CaseNoteSQL };
        }

        if (recipient != "") {
            this.s_RecipientSQL = "[AccountNo] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (discipline != "") {
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','") + "'))";
            if (this.s_DisciplineSQL != "") { fQuery = fQuery + " AND " + this.s_DisciplineSQL };
        }
        if (caredomain != "") {
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','") + "')";
            if (this.s_CareDomainSQL != "") { fQuery = fQuery + " AND " + this.s_CareDomainSQL };
        }




        if (discipline != "") {
            lblcriteria = " Disciplines: " + discipline.join(",") + "; "
        }
        else { lblcriteria = "All Disciplines," }
        if (caredomain != "") {
            lblcriteria = " Care Domains: " + caredomain.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Care Domains," }
        if (recipient != "") {
            lblcriteria = " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (casenotecat != "") {
            lblcriteria = " Case Notes: " + casenotecat.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Case Notes," }

        fQuery = fQuery + "  AND (History.DeletedRecord = 0)  ) ROP"
        fQuery = fQuery + " ORDER BY ROP.[ClientName], ROP.DateCreated   "

        //  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "5rDvU6JYKKsSsUEe" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "OP Notes Register.pdf"
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
    
    ServicePlanRegister(branch, program, recipient,manager,region) {


        var fQuery = "SELECT AccountNo,PlanName,PlanNumber,PlanCreator,format(PlanEndDate,'dd/MM/yyyy') as PlanEndDate,format(PlanStartDate,'dd/MM/yyyy') as PlanStartDate,PlanCoPayAmount,dbo.rtf2text(PlanDetail) as PlanDetail   FROM CarePlanItem CP INNER JOIN Recipients R ON PersonID = UniqueID "
        if(program != ""){ fQuery = fQuery + " INNER JOIN History ON R.UniqueID = History.PersonID "}
        fQuery = fQuery +" WHERE CP.DeletedRecord <> 1 AND ISNULL(Accountno, '') <> '' "

        //And R.BRANCH in ('GRAFTON') 
        //And AccountNo in ('ABBOTS MORGANICA')
        //And RECIPIENT_CoOrdinator in ('ALLA KASPARSKI')
        //And History.Program in ('')
        
       
        
        var lblcriteria;

         
        if (branch != "") {
            this.s_BranchSQL = "R.[BRANCH]  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }        
        if (program != "") {
            this.s_ProgramSQL = " (History.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }                
        if (recipient != "") {
            this.s_RecipientSQL = "[AccountNo] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "([RECIPIENT_CoOrdinator] in ('" + manager.join("','") + "'))";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "[CareDomain] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }




        if (region != "") {
            lblcriteria = " Categories: " + region.join(",") + "; "
        }
        else { lblcriteria = "All Categories," }
        if (manager != "") {
            lblcriteria = "Coordinator: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }
        if (recipient != "") {
            lblcriteria = " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        

        fQuery = fQuery + " ORDER by PlanStartDate DESC   "

        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "shortid":"2RJgekOWt" },
            "options": {
                "reports": { "save": false },
                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Service Plan Register.pdf"
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

    Careplanstatus(recipient, plantype, startdate, enddate, tempsdate, tempedate) {

        var fQuery = "SELECT D.DOC_ID, R.AccountNo, D.Doc# AS CareplanID, DD.Description AS PlanType, D.Title as CarePlanName, D.Filename, D.Status, D.DocStartDate, D.DocEndDate, QH.Doc# AS QuoteNumber, (SELECT [Name] FROM HumanResourceTypes WHERE RecordNumber = D.Department AND [Group] = 'PROGRAMS') AS Program, (SELECT [Description] FROM DataDomains WHERE RecordNumber = D.DPID) AS Discipline, (SELECT [Description] FROM DataDomains WHERE RecordNumber = D.CareDomain) AS CareDomain, CONVERT(Varchar(10),D.Created, 103) AS Created, CONVERT(Varchar(10),D.Modified, 103) + ' ' + (SELECT [Name] FROM UserInfo WHERE Recnum = D.Typist) AS Modified FROM Documents D LEFT JOIN DataDomains DD on   DD.RecordNumber = D.SubId LEFT JOIN qte_hdr QH ON CPID = DOC_ID LEFT JOIN Recipients R on  D.PersonID = R.UniqueID WHERE DOCUMENTGROUP IN ('CAREPLAN') AND (D.DeletedRecord = 0 OR D.DeletedRecord Is NULL)  "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "[Created] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (recipient != "") {
            this.s_CoordinatorSQL = "R.AccountNo in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (plantype != "") {
            this.s_PlantypeSQL = "DD.Description in ('" + plantype.join("','") + "')";
            if (this.s_PlantypeSQL != "") { fQuery = fQuery + " AND " + this.s_PlantypeSQL };
        }



        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (recipient != "") {
            lblcriteria = lblcriteria + " Manager: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (plantype != "") {
            lblcriteria = lblcriteria + " Plan Type: " + plantype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Plan Types," }

        fQuery = fQuery + " ORDER BY R.AccountNo, CarePlanName   "

        ///  //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "wck7EFbfopCd1OKi" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Care Plan Status Report.pdf"
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

    StaffAvailability(branch, staff, startdate, tempsdate) {


        var fQuery = "WITH T AS (SELECT ACCOUNTNO, ";
        var lblcriteria;


 //   alert(this.inputForm.value.exclude_staff_shiftondate);



        if (startdate != "") {
            this.s_DateSQL = " convert(nvarchar,convert(datetime,  '" + tempsdate + "' ),103) AS [DATE],";
            if (this.s_DateSQL != "") { fQuery = fQuery + this.s_DateSQL };
        }
        fQuery = fQuery + "CONVERT(TIME, '00:00') AS STARTTIME, CONVERT(TIME, '00:00') AS STARTFREETIME FROM STAFF WHERE ACCOUNTNO > '!Z' AND ACCOUNTNO <> 'BOOKED' AND COMMENCEMENTDATE IS NOT NULL AND TerminationDate IS NULL UNION SELECT [CARER CODE], convert(nvarchar,convert(datetime,[DATE] ),103) AS [DATE], CONVERT(TIME, [START TIME]) AS STARTTIME, CASE WHEN DATEADD(MINUTE, DURATION * 5,  CONVERT(TIME, [START TIME])) = '00:00' THEN '23:59:59.99' ELSE CONVERT(TIME,DATEADD(MINUTE, DURATION * 5, CONVERT(TIME, [START TIME]))) END AS STARTFREETIME FROM ROSTER WHERE [CARER CODE] > '!Z' AND [CARER CODE] <> 'BOOKED'"

        this.s_DateSQL = " AND [DATE] IN ('" + tempsdate + ("')  UNION SELECT ACCOUNTNO,convert(nvarchar,convert(datetime, '" + tempsdate + "'  ),103) AS [DATE], ");
        if (this.s_DateSQL != "") { fQuery = fQuery + " " + this.s_DateSQL };


        fQuery = fQuery + "CONVERT(TIME, '23:59:59.99') AS STARTTIME, CONVERT(TIME, '23:59:59.99') AS STARTFREETIME FROM STAFF WHERE ACCOUNTNO > '!Z' AND ACCOUNTNO <> 'BOOKED'"


        if (branch != "") {
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (staff != "") {
            this.s_StaffSQL = "ACCOUNTNO in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }

        fQuery = fQuery + "AND COMMENCEMENTDATE IS NOT NULL AND TerminationDate IS NULL ) SELECT ACCOUNTNO, convert(nvarchar,convert(datetime, '" + tempsdate + "' ),103) AS [DATE], LEFT(STARTFREETIME,8) AS STARTTIME, LEFT(ENDFREETIME,8) AS ENDTIME FROM (SELECT T.*, LEAD(STARTTIME) OVER (PARTITION BY ACCOUNTNO ORDER BY DATE,STARTTIME,STARTFREETIME) AS ENDFREETIME FROM T ) T WHERE ENDFREETIME IS NOT NULL AND STARTFREETIME <> ENDFREETIME "

        if (this.inputForm.value.exclude_staff_shiftondate == true) {
            fQuery = fQuery + "AND NOT EXISTS (SELECT * FROM   roster R WHERE  T.[accountno] = R.[carer code] AND R.[type] IN ( 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12 ) AND [date] = '" + tempsdate+"') "
        }

        fQuery = fQuery + "AND EXISTS ( SELECT * FROM STAFF S WHERE T.ACCOUNTNO = S.ACCOUNTNO AND CommencementDate IS NOT NULL AND TerminationDate IS NULL )"
     
        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches; " }

        if (startdate != "") {
            lblcriteria = lblcriteria + " Date " + startdate + "; "
        }

        if (staff != "") {
            lblcriteria = lblcriteria + " Staff:" + staff.join(",") + "; "
        }
        if (this.inputForm.value.exclude_staff_shiftondate == true){lblcriteria = lblcriteria + " Excluded Staff having shift on date "}
        else { lblcriteria = lblcriteria + "All Staff; " }


        fQuery = fQuery + " ORDER BY ACCOUNTNO, DATE,STARTTIME ASC "

          //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "rTZq9PlAzEYD9Jbc" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Availability.pdf"
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

    TimeattandanceComparison(branch, staff, startdate, enddate, tempsdate, tempedate) {


        var fQuery = " SELECT DISTINCT S.LastName + ' ' + S.FirstName As StaffName, CASE WHEN R.[FirstName] <> '' Then R.[FirstName] + ' ' ELSE '' END + CASE WHEN R.[Surname/Organisation] <> '' THEN R.[Surname/Organisation] ELSE '' END AS [RecipientName], Format(DateTime,'dd/MM/yyyy') as DateTime , Format(RosteredStart,'dd/MM/yyyy hh:mm tt') as RosteredStart  ,  Format (ActualDateTime,'dd/MM/yyyy')  as ActualDateTime, DATEDIFF(n, RosteredStart, ActualDateTime) AS StartVAR, Format(RosteredEnd,'dd/MM/yyyy hh:mm tt') as RosteredEnd ,  Format(LOActualDateTime,'dd/MM/yyyy') as LOActualDateTime, DATEDIFF(n, RosteredEnd, LOActualDateTime) As EndVAR, DATEDIFF(n, Rosteredstart, Rosteredend) As RosterDur, Round(WorkDuration * 60, 0) As ActualDur,  Round(WorkDuration * 60, 0) - DATEDIFF(n, Rosteredstart, Rosteredend) as DurVAR FROM EZITRACKER_LOG E INNER JOIN STAFF S ON E.Peopleid = S.Uniqueid INNER JOIN RECIPIENTS R ON E.SiteLoginID = R.Uniqueid  WHERE   ";
        var lblcriteria;

        if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery  + " CommencementDate is not null AND (TerminationDate is null OR TerminationDate >  getdate()) "
        }
            
        //( BETWEEN '2020/08/01' AND '2020/08/31') AND
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "[RosteredStart] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }

        if (branch != "") {
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (staff != "") {
            this.s_StaffSQL = "ACCOUNTNO in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }


        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }

        if (staff != "") {
            lblcriteria = lblcriteria + " Staff:" + staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff" }




        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "XTO8SlLEk5FLPTqL" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Time Attendance Comparison Report.pdf"
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

    HRNotesRegister(branch, staff, casenotecat, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT UPPER(Staff.LastName) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +       CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END + CASE WHEN Suburb <> '' THEN Suburb ELSE '' END AS Address, Staff.AccountNo AS StaffCode, Staff.StaffGroup, Staff.Category, Staff.STF_DEPARTMENT AS Branch, Staff.Contact1, History.AlarmDate as [Reminder Date], History.Detail,format( History.DetailDate,'dd/MM/yyyy') AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN History.ExtraDetail2 Is Null THEN ' UNKNOWN' WHEN History.ExtraDetail2 < 'A' THEN ' UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord FROM Staff INNER JOIN History ON Staff.UniqueID = History.PersonID WHERE  ExtraDetail1 = 'HRNOTE'  AND (History.DeletedRecord = 0) AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr'))  ";
        var lblcriteria;


        // '08-01-2020' AND  '08-31-2020'   AND
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "DetailDate > '" + tempsdate + ("'AND  DetailDate < ' ") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (staff != "") {
            this.s_StaffSQL = "[AccountNo] in ('" + staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }
        if (casenotecat != "") {
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','") + "')";
            if (this.s_CaseNoteSQL != "") { fQuery = fQuery + " AND " + this.s_CaseNoteSQL };
        }


        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }

        if (staff != "") {
            lblcriteria = " Staff:" + staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff, " }
        if (casenotecat != "") {
            lblcriteria = " Case Notes: " + casenotecat.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Case Notes," }

        fQuery = fQuery + "ORDER BY Staff.[LastName], History.DetailDate "


        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "tAljOfXOyqcdnOV8" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "HR Notes Register.pdf"
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

    StaffOPNotesRegister(branch, program, casenotecat, staff, discipline, caredomain, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT UPPER(Staff.LastName) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END + CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END + CASE WHEN Suburb <> '' THEN Suburb ELSE '' END AS Address, Staff.AccountNo AS StaffCode, Staff.StaffGroup, Staff.Category, Staff.STF_DEPARTMENT AS Branch, Staff.Contact1, History.AlarmDate as [Reminder Date], History.Detail,format(History.DetailDate,'dd/MM/yyyy') AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN History.ExtraDetail2 Is Null THEN ' UNKNOWN' WHEN History.ExtraDetail2 < 'A' THEN ' UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord FROM Staff INNER JOIN History ON Staff.UniqueID = History.PersonID WHERE ExtraDetail1 <> 'HRNOTE'  AND (History.DeletedRecord = 0)  "
        var lblcriteria;


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (DetailDate >  '" + tempsdate + ("' AND DetailDate < '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (casenotecat != "") {
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','") + "')";
            if (this.s_CaseNoteSQL != "") { fQuery = fQuery + " AND " + this.s_CaseNoteSQL };
        }

        if (staff != "") {
            this.s_RecipientSQL = "[AccountNo] in ('" + staff.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (discipline != "") {
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','") + "'))";
            if (this.s_DisciplineSQL != "") { fQuery = fQuery + " AND " + this.s_DisciplineSQL };
        }
        if (caredomain != "") {
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','") + "')";
            if (this.s_CareDomainSQL != "") { fQuery = fQuery + " AND " + this.s_CareDomainSQL };
        }



        if (discipline != "") {
            lblcriteria = " Disciplines: " + discipline.join(",") + "; "
        }
        else { lblcriteria = "All Disciplines," }
        if (caredomain != "") {
            lblcriteria = " Care Domains: " + caredomain.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Care Domains," }
        if (staff != "") {
            lblcriteria = " Staff: " + staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (casenotecat != "") {
            lblcriteria = " Case Notes: " + casenotecat.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Case Notes," }


        fQuery = fQuery + " ORDER BY Staff.[LastName], History.DetailDate   "

        ////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "CPX4RU8x2kvCKORP" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff OP Notes Register.pdf"
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

    StaffIncidentRegister(branch, SvcType, Staff, incidenttype, category, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT AccountNo, STF_Department AS Branch, AccountNo + ' - ' + CASE WHEN LastName<> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  + CASE WHEN Address1 <> '' THEN ' ' + Address1  ELSE ' '  END + CASE WHEN Address2 <> '' THEN ' ' + Address2  ELSE ' '  END + CASE WHEN Suburb <> '' THEN ' ' + Suburb  ELSE ' '  END + CASE WHEN TelePhone <> '' THEN ' Ph.' + TelePhone  ELSE ' '  END AS NameAddressPhone, (SELECT CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName FROM STAFF WHERE AccountNo = ReportedBy) As ReportedByStaff, (SELECT CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName FROM STAFF WHERE AccountNo = CurrentAssignee)  As AssignedToStaff , I.* FROM IM_Master I INNER JOIN STAFF R ON I.PERSONID = R.UNIQUEID WHERE"
        var lblcriteria;


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "([STF_DEPARTMENT] in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (SvcType != "") {
            this.s_SvcTypeSQL = " ([Service] in ('" + SvcType.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_SvcTypeSQL }
        }
        if (Staff != "") {
            this.s_StfSQL = "([CurrentAssignee] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (incidenttype != "") {
            this.s_IncedentTypeSQL = "(i.[Type] in ('" + incidenttype.join("','") + "'))";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_IncedentTypeSQL };
        }
        if (category != "") {
            this.s_incidentCategorySQL = "(i.[Status] in ('" + category.join("','") + "'))";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_incidentCategorySQL };
        }

        if (category != "") {
            lblcriteria = " Incident Category: " + category.join(",") + "; "
        }
        else { lblcriteria = "All Categories," }
        if (incidenttype != "") {
            lblcriteria = lblcriteria + " Incedent Type: " + incidenttype.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Incedent Types," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (SvcType != "") {
            lblcriteria = lblcriteria + " Service Type " + SvcType.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Svc. Types" }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (Staff != "") {
            lblcriteria = lblcriteria + " Assigned To: " + Staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff ," }

        fQuery = fQuery + " ORDER BY DATE  "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "elFITHKE2y1STfUR" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Incident Register.pdf"
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
    StaffTraining(branch, manager, region, program, staffteam, trainingtype, stfgroup, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal] AS ExpiryDate , [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Notes], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate],[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno], [Staff].[STF_DEPARTMENT], [Staff].[StaffGroup]  FROM Roster INNER JOIN STAFF on Roster.[Carer Code] = Staff.Accountno              INNER JOIN ITEMTYPES I ON Roster.[Service Type] = I.TITLE  WHERE  ([Carer Code] <> '!INTERNAL' AND [Carer Code] <> '!MULTIPLE')  AND I.MINORGROUP = 'TRAINING'   "

        /*if(this.inputForm.value.incl_inactive == false){
            fQuery = fQuery  + " AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL)) "
        } */

        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = "( Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }

        if (trainingtype != "") {
            this.s_TrainingTypeSQL = " ([Service Type] in ('" + trainingtype.join("','") + "'))";
            if (this.s_TrainingTypeSQL != "") { fQuery = fQuery + " AND " + this.s_TrainingTypeSQL }
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([STAFFTEAM] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }



        if (startdate != "") {
            var lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (staffteam != "") {
            lblcriteria = lblcriteria + " Staff Team: " + staffteam.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Staff Groups," }
        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (trainingtype != "") {
            lblcriteria = lblcriteria + " Training Type:" + trainingtype.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Training types " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }


        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Group: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }

        fQuery = fQuery + " ORDER BY [Carer Code], Date, [Start Time] "
        
        /*console.log(s_BranchSQL)
        console.log(s_CategorySQL)
        console.log(s_CoordinatorSQL)*/

      //  console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "7o1ScJuvyRZk8xZ6" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Training Register.pdf"
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
    AuditRegister(who, descibe, traccsuser, startdate, enddate, tempsdate, tempedate) {
            
        var fQuery = "SELECT RecordNumber,format( ActionDate,'dd/MM/yyyy HH:mm') as ActionDate, Operator, Actionon, whowhatcode, TraccsUser , AuditDescription FROM audit WHERE "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (ActionDate  >=  '" + tempsdate + ("' AND ActionDate <  '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (traccsuser != "") {
            this.s_TraccsuserSQL = "TraccsUser in ('" + traccsuser.join("','") + "')";
            if (this.s_TraccsuserSQL != "") { fQuery = fQuery + " AND " + this.s_TraccsuserSQL };
        }
        if (descibe != "" && descibe != null) {
            this.s_DescribeSQL = "AuditDescription like ('" + descibe + "')";
              if (this.s_DescribeSQL != ""){ fQuery = fQuery + " AND " + this.s_DescribeSQL};
            
        }
        if (who != "" && descibe != null) {
            this.s_whowhatSQL = "whowhatcode like ('" + who + "')";
              if (this.s_whowhatSQL != ""){ fQuery = fQuery + " AND " + this.s_whowhatSQL};
            
        }

        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (traccsuser != "") {
            lblcriteria = lblcriteria + " Traccs Users: " + traccsuser.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Users," }
        if (descibe != "" && descibe != null) {
            lblcriteria = lblcriteria + " Description: " + descibe + "; "
        }
        else { lblcriteria = lblcriteria + "All Descriptions," }
        if (who != "" && who != null) {
            lblcriteria = lblcriteria + " Who/What: " + who + "; "
        }
        else { lblcriteria = lblcriteria + "All Who/what," }


        fQuery = fQuery + " ORDER BY ActionDate "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "YD5T4jvODtGyusH8" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        
        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Audit Register.pdf"
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
    ProgramActivityStatusAudit(program) {

        var fQuery = "SELECT H.[NAME], H.[TYPE], S.[SERVICE TYPE], S.SERVICESTATUS FROM HUMANRESOURCETYPES H INNER JOIN SERVICEOVERVIEW S ON CONVERT(VARCHAR(15),H.RECORDNUMBER) = S.PERSONID WHERE [GROUP] = 'PROGRAMS'  ";
        var lblcriteria;

        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (this.inputForm.value.include_enddated == false){
            fQuery = fQuery + "AND (H.ENDDATE >= format (getDate(),'yyyy/MM/dd') OR H.ENDDATE IS NULL)"
        }

        if (program != "") {
            lblcriteria = " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = "All Programs." }


        fQuery = fQuery + " ORDER BY H.[NAME], S.[SERVICE TYPE] "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "4bzgeVt7vedkx8Uh" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Program Activity Status Audit.pdf"
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
    MTARegister(program, manager, Staff, stfgroup, recipient, startdate, enddate, tempsdate, tempedate, XXLate, XXEarly, XXOverstayed) {


        var fQuery = "select t0.*, ez.jobno, Convert(varchar(5),ez.datetime,108) AS ActualStart, DATEDIFF(n, t0.[Start Time], CONVERT(nVarchar(5),[DateTime],114)) AS StartVAR,Convert(varchar(5), ez.lodatetime,108) AS ActualEnd,  DATEDIFF(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), CONVERT(nVarchar(5),ez.[LODateTime],114)) AS EndVAR, Round(ez.WorkDuration * 60, 0) AS [ActualDuration], DATEDIFF(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), CONVERT(nVarchar(5),ez.[LODateTime],114)) - DATEDIFF(n, t0.[Start Time], CONVERT(nVarchar(5),[DateTime],114)) AS [DurationVAR], CASE WHEN (LOErrorCode = 0 AND ErrorCode = 0) THEN 'APP LOGON/APP LOGOFF' WHEN (LOErrorCode = 0 AND ErrorCode = 1) THEN 'MANUAL LOGON/APP LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 0) THEN 'APP LOGON/MANUAL LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 1) THEN 'MANUAL LOGON/MANUAL LOGOFF' ELSE CASE WHEN ErrorCode = 1 THEN 'MANUAL LOGON' WHEN ErrorCode = 0 THEN 'APP LOGON' WHEN IsNull(ez.DateTime,'')= ''  THEN 'NORMAL LOGOFF'  ELSE '' END END AS [Completion Status] from (    select    ro.RecordNo,    ro.[Client Code] as ClientCode,    ro.[Carer code] as StaffCode,     ro.[Service Type] as ItemCode,    ro.[Date],     ro.[Start Time],    ro.[Duration],    Convert(nvarchar(5), DateAdd(Minute, (ro.[Duration] * 5), ro.[Start Time]), 114) As [RosteredEnd],    Round(Duration * 5, 0) AS [RosteredDuration],    re.PANNoGoTH,     re.PANNoWorkTH,     re.PANEarlyStartTH,     re.PANLateStartTH,     re.PANEarlyFinishTH,     re.PANLateFinishTH,     re.PANOverstayTH,     re.PANUnderstayTH,     re.UniqueID AS RecipientID,    CASE WHEN st.[LastName] <> '' THEN st.[LastName] ELSE '?' END + ', ' +     CASE WHEN st.[FirstName] <> '' THEN st.[FirstName] ELSE '?' END AS [Staff] ,     CASE            WHEN re.Accountno = '!MULTIPLE' THEN ro.ServiceSetting            WHEN re.Accountno = '!INTERNAL' THEN '[Service Type]'            WHEN re.[Surname/Organisation] <> '' THEN  re.[Surname/Organisation] + CASE WHEN re.[FirstName] <> '' THEN ', ' + re.[FirstName] ELSE '?' END  END AS [Recipient]    from    roster ro    inner join recipients re on ro.[Client Code] = re.accountno    inner join staff st on ro.[carer code] = st.accountno    inner join itemtypes it on ro.[service type] = it.title    where  ";
        var lblcriteria;
        var fQuery1 = " ";


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (ro.Date BETWEEN  '" + tempsdate + ("' AND '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        fQuery = fQuery + "and (ro.[Carer Code] > '!MULTIPLE') AND ro.Type <> 9     "
        if (program != "") {
            this.s_ProgramSQL = " (ro.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "re.[RECIPIENT_COORDINATOR] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "(ro.[carer code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(st.[STAFFGROUP] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "ro.[client code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        fQuery = fQuery + "and isnull(it.taexclude1, 0) = 0 ) t0 left join ezitracker_log ez on t0.recordno = ez.jobno "

        if (this.inputForm.value.late == true) {

            fQuery1 = fQuery1 + "AND (DateDiff(n, t0.[Start Time], Convert(nVarchar(5), ez.[DateTime], 114)) >= " + XXLate + ") ";

        }
        if (this.inputForm.value.leftearly == true) {
            fQuery1 = fQuery1 + "AND (DateDiff(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), Convert(nVarchar(5), ez.[LODateTime], 114)) >= " + XXEarly + ") "
        }
        if (this.inputForm.value.overstayed == true) {
            fQuery1 = fQuery1 + "AND (DateDiff(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), Convert(nVarchar(5), ez.[LODateTime], 114)) >= " + XXOverstayed + ") "
        }

        if (this.inputForm.value.forcedlogon == true) {
            fQuery1 = fQuery1 + " AND (ez.ErrorCode  = 1) "
        }
        if (this.inputForm.value.not_logon == true) {
            fQuery1 = fQuery1 + " AND (IsNull(ez.datetime,'')= '') "
        }
       
        if (fQuery1 != " " && fQuery1 != undefined) {
            var sql = fQuery1.substring(4, fQuery1.length)

            fQuery = fQuery + " where " + sql
        }



        if (program != "") {
            lblcriteria = " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = "All Programs." }
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }
        if (Staff != "") {
            lblcriteria = lblcriteria + " Assigned To: " + Staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff ," }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Group: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (recipient != "") {
            lblcriteria = lblcriteria + " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }


        fQuery = fQuery + "  ORDER BY staffcode, [Date], [Start Time] "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "l4nWCteKG2bDS0QA" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "MTA Attendance Register.pdf"
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
    RosterOverlapRegister(program, branch, Staff, recipient, startdate, enddate, tempsdate, tempedate) {


        var fQuery = "SELECT RECORDNO, [CLIENT CODE], [CARER CODE], [SERVICE TYPE], PROGRAM,CONVERT(varchar, convert(datetime,[DATE]),103) as [DATE], [START TIME], DURATION * 5 as DURATION,  ST.[STAFFGROUP] ,[STF_DEPARTMENT] AS BRANCH  FROM ROSTER ro INNER JOIN STAFF ST ON ro.[CARER CODE] = ST.[ACCOUNTNO] LEFT JOIN ITEMTYPES IT ON  IT.Title = RO.[Service Type] Where Exists ( SELECT * FROM ROSTER ro2 Where ro.[CARER CODE] = ro2.[CARER CODE] AND ro.RECORDNO <> ro2.RECORDNO AND ro.[DATE] = ro2.[DATE] AND ro.BLOCKNO >= ro2.BLOCKNO AND ro.BLOCKNO < ro2.BLOCKNO+ro2.DURATION AND TYPE NOT IN (13) )    AND ro.[Type] NOT IN (13) AND ro.[CARER CODE] > '!z'     AND st.[STAFFGROUP] <> 'NON-STAFF' AND  ST.CATEGORY = 'STAFF'    AND InfoOnly <> 1    ";
        var lblcriteria;


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (ro.Date BETWEEN  '" + tempsdate + ("' AND '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (ro.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (branch != "") {
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }

        if (Staff != "") {
            this.s_StfSQL = "(ro.[carer code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }

        if (recipient != "") {
            this.s_RecipientSQL = "ro.[client code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }




        if (program != "") {
            lblcriteria = " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = "All Programs." }

        if (Staff != "") {
            lblcriteria = lblcriteria + " Assigned To: " + Staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff ," }

        if (recipient != "") {
            lblcriteria = lblcriteria + " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        fQuery = fQuery + " ORDER BY [Carer Code],[START TIME]  "
//
        // console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "lK0psB9gWfDQkZhG" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Roster OverLap Register.pdf"
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
    MTAVerificationAudit(program, manager, Staff, stfgroup, recipient, startdate, enddate, tempsdate, tempedate, XXLate, XXEarly, XXOverstayed) {


        var fQuery = "select t0.RecordNo,t0.Date,Recipient_Signature,ClientCode,StaffCode, ez.jobno,CONVERT(VARCHAR(5),ez.datetime, 108)  AS ActualStart,CONVERT(VARCHAR(5),ez.lodatetime, 108)  AS ActualEnd,  Round(ez.WorkDuration * 60, 0) AS [ActualDuration], CASE WHEN (LOErrorCode = 0 AND ErrorCode = 0) THEN 'APP LOGON/APP LOGOFF'      WHEN (LOErrorCode = 0 AND ErrorCode = 1) THEN 'MANUAL LOGON/APP LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 0) THEN 'APP LOGON/MANUAL LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 1) THEN 'MANUAL LOGON/MANUAL LOGOFF'      ELSE CASE WHEN ErrorCode = 1 THEN 'MANUAL LOGON' WHEN ErrorCode = 0 THEN 'APP LOGON' WHEN IsNull(ez.DateTime,'')= ''  THEN 'NORMAL LOGOFF'  ELSE '' END END AS [Completion Status] from (    select    ro.RecordNo,    ro.Recipient_Signature,    ro.[Client Code] as ClientCode,    ro.[Carer code] as StaffCode,     ro.[Service Type] as ItemCode,    ro.[Date],     ro.[Start Time],    ro.[Duration],    Convert(nvarchar(5), DateAdd(Minute, (ro.[Duration] * 5), ro.[Start Time]), 114) As [RosteredEnd],    Round(Duration * 5, 0) AS [RosteredDuration],    re.UniqueID AS RecipientID,    CASE WHEN st.[LastName] <> '' THEN st.[LastName] ELSE '?' END + ', ' +         CASE WHEN st.[FirstName] <> '' THEN st.[FirstName] ELSE '?' END AS [Staff] ,     CASE WHEN re.Accountno = '!MULTIPLE' THEN ro.ServiceSetting   WHEN re.Accountno = '!INTERNAL' THEN '[Service Type]' WHEN re.[Surname/Organisation] <> '' THEN  re.[Surname/Organisation] + CASE WHEN re.[FirstName] <> '' THEN ', ' + re.[FirstName] ELSE '?' END  END AS [Recipient]    from    roster ro    inner join recipients re on ro.[Client Code] = re.accountno    inner join staff st on ro.[carer code] = st.accountno    inner join itemtypes it on ro.[service type] = it.title    where   ";
        var lblcriteria;


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (ro.Date BETWEEN  '" + tempsdate + ("' AND '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        fQuery = fQuery + "AND (ro.[Carer Code] > '!MULTIPLE') AND ro.Type <> 9     "
        if (program != "") {
            this.s_ProgramSQL = " (ro.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "re.[RECIPIENT_COORDINATOR] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "(ro.[carer code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "(st.[STAFFGROUP] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "ro.[client code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        fQuery = fQuery + "and isnull(it.taexclude1, 0) = 0 ) t0 left join ezitracker_log ez on t0.recordno = ez.jobno  WHERE  ISNULL(ez.JobNo, '') <> '' "

        if (this.inputForm.value.late == true) {
            var fQuery1 = " "
            fQuery1 = fQuery1 + "AND (DateDiff(n, t0.[Start Time], Convert(nVarchar(5), ez.[DateTime], 114)) >= " + XXLate + ") ";

        }
        if (this.inputForm.value.leftearly == true) {
            fQuery1 = fQuery1 + "AND (DateDiff(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), Convert(nVarchar(5), ez.[LODateTime], 114)) >= " + XXEarly + ") "
        }
        if (this.inputForm.value.overstayed == true) {
            fQuery1 = fQuery1 + "AND (DateDiff(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), Convert(nVarchar(5), ez.[LODateTime], 114)) >= " + XXOverstayed + ") "
        }

        if (this.inputForm.value.forcedlogon == true) {
            fQuery1 = fQuery1 + " AND (ez.ErrorCode  = 1) "
        }
        if (this.inputForm.value.not_logon == true) {
            fQuery1 = fQuery1 + " AND (IsNull(ez.datetime,'')= '') "
        }

        if (fQuery1 != "" && fQuery1 != undefined) {
            var sql = fQuery1.substring(4, fQuery1.length)
            fQuery = fQuery + " where " + sql
        }




        if (program != "") {
            lblcriteria = " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = "All Programs." }
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }
        if (Staff != "") {
            lblcriteria = lblcriteria + " Assigned To: " + Staff.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Staff ," }
        if (stfgroup != "") {
            lblcriteria = lblcriteria + " Staff Group: " + stfgroup.join(",") + "; "
        }
        else { lblcriteria = " All Staff, " }
        if (recipient != "") {
            lblcriteria = lblcriteria + " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria =lblcriteria + " All Dated " }


        fQuery = fQuery + "  ORDER BY staffcode, [Date], [Start Time] "

        //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "dpEyUTAAn5HXqGhK" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "MTA Attendance Verification Audit.pdf"
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
    UnsedFunding(program, manager, recipient, region) {


        var fQuery = "Select Recipients.UniqueID, Recipients.AccountNo, Recipients.Branch, Recipients.AdmissionDate,Recipients.DischargeDate, CASE WHEN Recipients.[Surname/Organisation] <> '' THEN [Surname/Organisation] ELSE '*' END + ', ' + CASE WHEN Recipients.FirstName <> '' THEN FirstName ELSE '*' END AS NameDetails, Recipients.RECIPIENT_Coordinator, RecipientPrograms.Program, RecipientPrograms.Quantity, RecipientPrograms.ItemUnit, RecipientPrograms.PerUnit, RecipientPrograms.TimeUnit, RecipientPrograms.Period, format(RecipientPrograms.ExpiryDate,'dd/MM/yyyy') as ExpiryDate , RecipientPrograms.TotalAllocation, RecipientPrograms.Used, RecipientPrograms.Remaining FROM RecipientPrograms INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID  WHERE AccountNo > '!z' AND ((Recipients.AdmissionDate is NOT NULL) and (Recipients.DischargeDate is NULL))    ";
        var lblcriteria;


        //AND AccountNo BETWEEN '**BROWN D' AND '**BROWN D' AND ([Program] BETWEEN '!INTERNAL' AND '!INTERNAL') AND ([RECIPIENT_Coordinator] BETWEEN 'ANNE MILLER' AND 'ANNE MILLER') AND ([AgencyDefinedGroup] BETWEEN 'ARUNDEL' AND 'ARUNDEL') 
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[RECIPIENT_Coordinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }

        if (recipient != "") {
            this.s_RecipientSQL = "AccountNo in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }



        if (program != "") {
            lblcriteria = " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = "All Programs." }
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }

        if (recipient != "") {
            lblcriteria = lblcriteria + " Recipients: " + recipient.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Recipients," }
        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        fQuery = fQuery + " ORDER BY Recipients.AccountNo "

    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "X641oa708kHECwiT" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Recipient Unused Funding Reprot.pdf"
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
    ReportUtilisation(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT  FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE Round([Roster].[Duration] / 12,2) END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]    "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + "WHERE  ([Client Code] > '!MULTIPLE')";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }


        switch (rptname) {
            case 'btn-FORPT-ProgramUtilisation':
                var Title = "RECIPIENT PROGRAM UTILISATION REPORT";
                var Report_Definer = "This report summarises all services delivered to Recipients by the Agency, (either by Agency Staff or Brokered organisations acting on behalf of the Agency, and Travel Time Attributable to Recipients), during the selected period."
                fQuery = fQuery + "And (([Roster].[Type] IN (1, 2, 3, 5, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] > '!MULTIPLE') ";
                fQuery = fQuery + " ORDER BY [Client Code], [Program], Date, [Start Time] "

                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "20xwMDHmzWQlOD6N";

                        break;
                    case "Standard":
                        Title = Title + "-STANDARD"
                        this.reportid = "1OoLOtjnmVq55CR3";

                        break;

                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid = "QRa7a6vcHl74gzKk"
                        break;
                }
                break;
            case 'btn-FORPT-PaytypeReport':
                var Title = "RECIPIENT PAY TYPE REPORT";
                var Report_Definer = "This report summarises all services delivered to Recipients by the Agency, (either by Agency Staff or Brokered organisations acting on behalf of the Agency, and Travel Time Attributable to Recipients), during the selected period."
                fQuery = fQuery + "And (([Roster].[Type] IN (1, 2, 3, 5, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] > '!MULTIPLE') ";
                fQuery = fQuery + "ORDER BY [Client Code], [Service Description], Date, [Start Time]";

                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "0ZnxAZqeBt95hPdb";

                        break;
                    case "Standard":
                        Title = Title + "-STANDARD"
                        this.reportid = "DBUDb5tg2SyiH0k4";

                        break;

                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid = "QRa7a6vcHl74gzKk"
                        break;
                }

                break;
            case 'btn-FORPT-RecipientserviceReport':
                var Title = "RECIPIENT SERVICE REPORT"; 
                var Report_Definer = "This report summarises all services delivered to Recipients by the Agency, (either by Agency Staff or Brokered organisations acting on behalf of the Agency, and Travel Time Attributable to Recipients), during the selected period."
                fQuery = fQuery + "AND ([Roster].[Type] = 2 OR ([Roster].[Type] = 4 AND [Roster].[Carer Code] = '!INTERNAL') OR  [Roster].[Type]=1 OR [Roster].[Type] = 3 OR [Roster].[Type] = 5 OR [Roster].[Type] = 7 OR [Roster].[Type] = 8 OR [Roster].[Type] = 10 OR [Roster].[Type] = 11 OR [Roster].[Type] = 14 OR [Roster].[Type] = 12) AND ([Client Code] > '!MULTIPLE') ";
                fQuery = fQuery + "ORDER BY [Client Code], [Service Type], Date, [Start Time]"

                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "KNUFzfW2y0u1Vmp8";

                        break;
                    case "Standard":
                            Title = Title + "-STANDARD"
                            this.reportid = "iIYZM5tgCWBZgpZR";
    
                            break;

                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid = "QRa7a6vcHl74gzKk"
                        break;
                }

                break;
            case 'btn-FORPT-StaffusageReport':
                var Title = "RECIPIENT STAFF USAGE REPORT";
                var Report_Definer = "This report summarises all services delivered to Recipients by the Agency, (either by Agency Staff or Brokered organisations acting on behalf of the Agency, and Travel Time Attributable to Recipients), during the selected period."
                fQuery = fQuery + "And (([Roster].[Type] IN (1, 2, 3, 5, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] > '!MULTIPLE')";
                fQuery = fQuery + "ORDER BY [Client Code], [Carer Code], Date, [Start Time]";

                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "bS5eYd0QZKtRh7kR";

                        break;
                    case "Standard":
                            Title = Title + "-STANDARD"
                            this.reportid = "mfOCkWILwdbpXNWq";
    
                            break;

                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid = "QRa7a6vcHl74gzKk" 
                        break;
                }

                break;

        }

        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,

                "txtCriteriaStmt": Report_Definer,

                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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

    PayTypeProgram(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE Round([Roster].[Duration] / 12,2) END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;


        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + "WHERE  ([Carer Code] > '!MULTIPLE')  And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION')"


        var Title = "PAY TYPE PROGRAM REPORT";
        var Report_Definer = "This report includes all Services attributed to Funded Programs during the selected period.It includes any allowances. (It does NOT include pay details for Brokerage Organisations)"


        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            console.log("s_DateSQL" + this.s_DateSQL)
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All" ) {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }


        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }

        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }

        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + "ORDER BY [Service Description], [Program], Date, [Start Time]";

    //    console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "DeKVDYBlePosUVbB";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    //this.reportid = "bzsYqppVdYW4XLK6"; 
                    this.reportid = "hQVGJjKxbUIpACYu"; 
                    break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "gHY4F0UbTNzf4oPk"
                break;
        }



        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },



                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtTitle": Title,

                "txtCriteriaStmt": Report_Definer,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,
                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,

            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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

    DailyStaffHrs(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate],[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE Round([Roster].[Duration] / 12,2) END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + "WHERE  ([Carer Code] > '!MULTIPLE') And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION')  "

        var Title = "STAFF DAILY HOURS REPORT";
        var Report_Definer = "This report includes all amounts paid to Staff employed by the Agency during the selected period.It includes any allowances. (It does NOT include Brokerage or Volunteer activities)";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + "ORDER BY [Carer Code], Date, [Service Type], [Start Time]";

//        console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "br0hApzbOEUutqz0";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "Y3XNmrch0jiwN5oO";

                    break;
            default:

                Title = Title + "-SUMMARY"
                this.reportid = "VFZKXpQuPdRjOz7U" 
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    ProgramReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {


        var fQuery = " SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }

        fQuery = fQuery + "WHERE ([Client Code] > '!MULTIPLE')  AND	([Roster].[Type] = 1 OR [Roster].[Type] = 2 OR [Roster].[Type] = 3 OR ([Roster].[Type] = 4 AND [Roster].[Carer Code] = '!INTERNAL')  OR [Roster].[Type] = 5 OR [Roster].[Type] = 7 OR [Roster].[Type] = 8 OR [Roster].[Type] = 10 OR [Roster].[Type] = 11 OR [Roster].[Type] = 14 OR [Roster].[Type] = 12"
        switch (rptname) {
            case 'btn-FORPT-ProgramStaffUtilized':
                fQuery = fQuery + "OR [Roster].[Type] = 6)"
                break;
            case 'btn-FORPT-ProgramActivitySpread':
                fQuery = fQuery + "OR [Roster].[Type] = 6 OR [Roster].[Type] = 9)"
                break;
            case 'btn-FORPT-ProgramRecipientServiced':
                fQuery = fQuery + ")"
                break;

            default:
                break;
        }


        var lblcriteria;
        
        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }


        switch (rptname) {
            case 'btn-FORPT-ProgramStaffUtilized':
                fQuery = fQuery + "ORDER BY [Program], [Carer Code], Date, [Start Time]";
                var Title = "PROGRAM STAFF UTILISED REPORT";
                var Report_Definer = "This report summarises all services delivered to Recipients by the Agency, (either by Agency Staff or Brokered organisations acting on behalf of the Agency, and Travel Time Attributable to Recipients), during the selected period."


                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "MePWCZQThe0CAnu5";
                        break;
                    case "Standard":
                            Title = Title + "-STANDARD"
                            this.reportid = "TjjF21FYeoPa8ttL";
    
                            break;

                    default:

                        Title = Title + "-SUMMARY"
                        this.reportid = "IlzJ8y3CcohttpLy"
                        break;
                }


                break;
            case 'btn-FORPT-ProgramRecipientServiced':
                fQuery = fQuery + "ORDER BY [Program], [Client Code], Date, [Start Time]";
                var Title = "PROGRAM RECIPIENT SERVICED REPORT";
                var Report_Definer = "This report includes all Services attributed to Funded Programs during the selected period.It optionally includes allowances or Staff Administration."

                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "dBfGjQMGcDFpS0tN";
                        break;
                    case "Standard":
                            Title = Title + "-STANDARD"
                            this.reportid = "v1NmCNitQqzEuvy2";
    
                            break;

                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid = "IlzJ8y3CcohttpLy"
                        break;
                }

                break;
            case 'btn-FORPT-ProgramActivitySpread':
                fQuery = fQuery + "ORDER BY [Program], [Service Type], Date, [Start Time]";
                var Title = "PROGRAM ACTIVITY SPREAD REPORT";
                var Report_Definer = "This report includes all Services attributed to Funded Programs during the selected period.It includes Staff allowances"


                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "Oc4nxLXjTPbGcZQH";
                        break;
                    case "Standard":
                            Title = Title + "-STANDARD"
                            this.reportid = "EG5OARjKtdoyTYpj";
    
                            break;

                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid = "IlzJ8y3CcohttpLy"
                        break;
                }


                break;

            default:
                break;
        }




        //console.log(fQuery)


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,
                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,

            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    ProgramBillingReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;
       

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + "WHERE ([Client Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') AND ([Roster].[Type] = 2 OR ([Roster].[Type] = 4 AND [Roster].[Carer Code] = '!INTERNAL') OR ([Roster].[Type] = 1) OR [Roster].[Type] = 3 OR [Roster].[Type] = 5 OR [Roster].[Type] = 7 OR [Roster].[Type] = 8 OR [Roster].[Type] = 10 OR [Roster].[Type] = 11 OR [Roster].[Type] = 14 OR [Roster].[Type] = 12)"

        var Title = "PROGRAM BILLING REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();//.substring(0,10);
            console.log(strkey);
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + " ORDER BY [Program], [Client Code], Date, [Start Time]";

//        console.log(fQuery)
//        console.log(format)
        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid= "dBfGjQMGcDFpS0tN";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "v1NmCNitQqzEuvy2";
                    break;

            default:
                Title = Title + "-SUMMARY"
                this.reportid = "7RdGSvcsDNba5xah"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,
                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,

            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    ActivityStaffReport (branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,ROUND([Roster].[Unit Pay Rate],2) as UnitPayRate , [Roster].[Unit Pay Rate] , [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;
       

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + "WHERE ([Client Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') AND ([Roster].[Type] = 2 OR ([Roster].[Type] = 4 AND [Roster].[Carer Code] = '!INTERNAL') OR ([Roster].[Type] = 1) OR [Roster].[Type] = 3 OR [Roster].[Type] = 5 OR [Roster].[Type] = 7 OR [Roster].[Type] = 8 OR [Roster].[Type] = 10 OR [Roster].[Type] = 11 OR [Roster].[Type] = 14 OR [Roster].[Type] = 12)"




        var Title = "ACTIVITY STAFF REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();//.substring(0,10);
            console.log(strkey);
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + " ORDER BY [Program], [Client Code], Date, [Start Time]";

    //    console.log(fQuery)
//        console.log(format)
        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid= "gKDoVHUUaYJZdiE5";
                break;
            case "Standard":
                Title = Title + "-STANDARD"
                this.reportid = "5UhTciOEItAwdplv";
                break;

            default:
                Title = Title + "-SUMMARY"
                this.reportid = "5T198rth9thUMUSA"
                break;
        }

        console.log(this.inputForm.value.InclFinancials)
        this.drawerVisible = true;
        
        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,
                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,

            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    ProgramBudgetAudit(branch, program) {

        var fQuery = "SELECT H.[NAME] AS PROGRAM, H.FAX AS [GL CODE], I.ROSTERGROUP AS [ACTIVITY TYPE], I.TITLE AS [ACTIVITY NAME], B.HOURS AS [BUDGET OUTPUTS] FROM HUMANRESOURCETYPES H LEFT JOIN BUDGETS B ON ( H.[NAME] = B.PROGRAM)  LEFT JOIN ITEMTYPES I ON (I.TITLE = B.ACTIVITY AND I.PROCESSCLASSIFICATION = 'OUTPUT') WHERE H.[GROUP] = 'PROGRAMS'";
        var lblcriteria;

        if (program != "") {
            this.s_ProgramSQL = " (H.[Name] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (branch != "") {
            this.s_BranchSQL = " (B.BRANCH in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (branch != "") {
            lblcriteria = " Branch " + branch.join(",") + "; "
        }
        else { lblcriteria = "All Programs." }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }


        fQuery = fQuery + " ORDER BY H.[Name], I.TITLE "

        // //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "651WtSGmEJ257yjD" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Program Budget Audit.pdf"
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
    ProgramSummaryReport(branch, manager, region, program) {


        var fQuery = "SELECT ACCOUNTNO, PROGRAM, ALLOWED, USEDAMOUNT, ALLOWED-USEDAMOUNT AS BALANCE, COSTTYPE, AP_PERUNIT, AP_PERIOD,EXPIREUSING , ALERTSTARTDATE,  format(RENEWDATE,'dd/MM/yyyy') as RENEWDATE, [REDAMOUNT], [ORANGEAMOUNT], [YELLOWAMOUNT],   BRANCH, [RECIPIENT_COORDINATOR], [AGENCYDEFINEDGROUP] FROM ( SELECT ACCOUNTNO,PROGRAM,ISNULL(AP_BASEDON, 0) AS ALLOWED, ISNULL(AP_COSTTYPE, '') AS COSTTYPE, ISNULL(AP_PERUNIT, '') AS AP_PERUNIT,ISNULL(AP_PERIOD, '') AS AP_PERIOD,ISNULL(EXPIREUSING, '') AS EXPIREUSING,ISNULL(ALERTSTARTDATE, '') AS ALERTSTARTDATE, CASE WHEN AP_PERIOD = 'DAY' THEN DATEADD(DAY,1,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'WEEK' THEN DATEADD(WEEK,1,RP.ALERTSTARTDATE)WHEN AP_PERIOD = 'FORTNIGHT' THEN DATEADD(WEEK,2,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'MONTH' THEN DATEADD(MONTH,1,RP.ALERTSTARTDATE)WHEN AP_PERIOD = '6 WEEKS' THEN DATEADD(WEEK,6,RP.ALERTSTARTDATE)WHEN AP_PERIOD = 'QUARTER' THEN DATEADD(MONTH,3,RP.ALERTSTARTDATE)WHEN AP_PERIOD = '6 MONTHS' THEN DATEADD(MONTH,6,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'YEAR' THEN DATEADD(MONTH,12,RP.ALERTSTARTDATE) END AS RENEWDATE,ISNULL(AP_REDQTY, 0) AS [REDAMOUNT], ISNULL(AP_ORANGEQTY, 0) AS [ORANGEAMOUNT], ISNULL(AP_YELLOWQTY, 0) AS [YELLOWAMOUNT],(SELECT ISNULL(SUM(ADMINAMOUNT), 0) + ISNULL(SUM(SERVICEAMOUNT), 0) AS GTOTAL FROM (SELECT CASE WHEN ISNULL(IT.MAINGROUP, 'DIRECT SERVICE') IN ('PACKAGE ADMIN', 'CASE MANAGEMENT') THEN ROUND((DURATION * 5) / 60, 2) END AS ADMINAMOUNT, CASE WHEN ISNULL(IT.MAINGROUP, 'DIRECT SERVICE') NOT IN ('PACKAGE ADMIN', 'CASE MANAGEMENT') THEN ROUND((DURATION * 5) / 60, 2) END AS SERVICEAMOUNT FROM ROSTER RO INNER JOIN ITEMTYPES IT ON RO.[SERVICE TYPE] = IT.TITLE Where RO.[CLIENT CODE] = R.ACCOUNTNO AND RO.[PROGRAM] = RP.PROGRAM AND ISNULL(IT.[EXCLUDEFROMUSAGESTATEMENTS], 0) = 0 AND NOT (RO.[TYPE] = 9 AND RO.[SERVICE DESCRIPTION] = 'CONTRIBUTION') AND RO.DATE > '2000/01/01' AND  (RO.[DATE] BETWEEN RP.ALERTSTARTDATE AND  CASE WHEN AP_PERIOD = 'DAY' THEN DATEADD(DAY,1,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'WEEK' THEN DATEADD(WEEK,7,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'FORTNIGHT' THEN DATEADD(WEEK,2,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'MONTH' THEN DATEADD(MONTH,1,RP.ALERTSTARTDATE) WHEN AP_PERIOD = '6 WEEKS' THEN DATEADD(WEEK,6,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'QUARTER' THEN DATEADD(MONTH,3,RP.ALERTSTARTDATE) WHEN AP_PERIOD = '6 MONTHS' THEN DATEADD(MONTH,6,RP.ALERTSTARTDATE)WHEN AP_PERIOD = 'YEAR' THEN DATEADD(MONTH,12,RP.ALERTSTARTDATE) END )) AS T ) AS USEDAMOUNT,  R.BRANCH, [RECIPIENT_COORDINATOR], [AGENCYDEFINEDGROUP] FROM RECIPIENTS R INNER JOIN RECIPIENTPROGRAMS RP ON R.UNIQUEID = RP.PERSONID ) AS T2 WHERE ACCOUNTNO > '!Z'  "
        var lblcriteria;
        if (branch != "") {
            this.s_BranchSQL = "BRANCH in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };

        }
        if (region != "") {
            this.s_CategorySQL = "[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " (PROGRAM in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }


        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }

        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Managers," }


        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }


        fQuery = fQuery + " ORDER BY ACCOUNTNO, PROGRAM "

        /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
        // //////console.log(fQuery)
        // console.log(lblcriteria)



        const data = {

            "template": { "_id": "JzFkyOS6RlKiOeqD" },
            "options": {
                "reports": { "save": false },
                //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Program Summary Report.pdf"
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
    ActivityGroupReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + "WHERE  ([Client Code] > '!MULTIPLE')  "
        //And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')"

        
        if (this.inputForm.value.NotAllocated == true){
            var notinclude = " 1,"
        }else{var notinclude = " "}
        if (this.inputForm.value.RecipientLeave == true){
            fQuery = fQuery + " And (([Roster].[Type] IN ( "+ notinclude + " 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE') "
        }else{
            fQuery = fQuery + " And (([Roster].[Type] IN ( "+ notinclude + " 2, 3, 5, 6, 7, 8, 10, 11, 12, 14)) And ([Client Code] <> '!MULTIPLE')) "
        }
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }

        var Title = "ACTIVITY GROUP REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + " ORDER BY [Service Type], [Anal], Date, [Start Time] ";

    //    console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "s7xkRQoypsgZDEJi";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "87J6dAoiLAM4QSFk";

                    break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "EUpoRvslDL2jReMC"
              
                break;
        }

        
        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,

                

                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,

               
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffActivityReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + " WHERE ([Carer Code] > '!MULTIPLE')  "
        

        if (this.inputForm.value.NotAllocated == true){
            var notinclude = " 1,"
        }else{var notinclude = " "}
        if (this.inputForm.value.allowances == true){
            var allowances = " 9, "
        }else{var allowances = " "}
        fQuery = fQuery + "And ( [Roster].[Type] In ("+notinclude +" 2,5,6,7,8, "+allowances+" 10,11,12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') ) "
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }


        var Title = "STAFF ACTIVITY REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    fQuery = fQuery + " AND " + this.s_AgeSQL;
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    fQuery = fQuery + " AND " + this.s_AgeSQL;
                    break;

                default:
                    break;
            }

            

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + "ORDER BY [Carer Code], [Service Type], Date, [Start Time]";

     //   console.log(fQuery)
    // console.log(this.inputForm.value.ExcluPgeHeader)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "BkY2eCxEZ9xs7JdN";
                break;
            case "Standard":
                        Title = Title + "-STANDARD"
                        this.reportid = "5riBak9iybzIeejZ";

                        break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "Cjq0J0FwEE9NpEjG"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffAdminReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {


        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }

        fQuery = fQuery + "WHERE ([Carer Code] <> '!MULTIPLE')  "
         
        if (this.inputForm.value.NotAllocated == true){
            fQuery = fQuery + " And [Roster].[Type] in (1, 6) "
        }else{
            fQuery = fQuery + " And [Roster].[Type] = 6 "
        }
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }        
        var Title = "STAFF ADMIN REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    fQuery = fQuery + " AND " + this.s_AgeSQL;
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    fQuery = fQuery + " AND " + this.s_AgeSQL;
                    break;

                default:
                    break;
            }
            
           

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + "ORDER BY [Service Type], [Client Code], Date, [Start Time]";

    //    console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "PWrjCCfGSodTi4k5";
                break;
            case "Standard":
                        Title = Title + "-STANDARD"
                        this.reportid = "NDOYLqd3PIdrvmCo";

                        break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "52x7yFFEwpini1aA"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffRecipientServiced(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        if(this.inputForm.value.NotAllocated){
            var notinclude = " [Roster].[Type] = 1 Or  "
        }else{var notinclude = "  "}
        fQuery = fQuery + "WHERE ([Carer Code] > '!MULTIPLE')  And (( "+ notinclude+ "  [Roster].[Type] = 2 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 9 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6)) And [Client Code] <> '!MULTIPLE' AND ([Service Type] <> 'CONTRIBUTION') "
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        var Title = "STAFF RECIPIENT REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + "ORDER BY [Carer Code], [Client Code], Date, [Start Time]";

        //////console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "pcOEeUeWKPGaGFPA";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "nfYYDDUGiPSrttea";

                    break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "OTUPu95cLd6uPgd5"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffPaysReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno],[Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]"
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        //WHERE ([Date Timesheet] >= '2020-11-01' And [Date Timesheet] <= '2020-11-30') AND         
        fQuery = fQuery + "WHERE ([Carer Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') "
        //And ([Roster].[Type] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL')) And [Carer Code] <> '!MULTIPLE'AND ([service type] <> 'CONTRIBUTION')";

        if (this.inputForm.value.NotAllocated == true){
            fQuery = fQuery + " And ([Roster].[Type] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL')) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION') "    
        }else {fQuery = fQuery + " And ([Roster].[Type] IN (2, 5, 6, 7, 8, 9, 10, 11, 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL')) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION')"}
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        var Title = "STAFF PAYS REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }




        fQuery = fQuery + "And ([Roster].[Type] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) Or ([Roster].[Type] = 4))"
        fQuery = fQuery + "ORDER BY [Carer Code], [Service Description], Date, [Start Time]";

    //    console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "3tnMUYUAp8WHDU1Z";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "KYio3TCmmyLOV7oy";

                    break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "OTUPu95cLd6uPgd5"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffProgramPaytypeRpt(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty  ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]"
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        }
        if (this.inputForm.value.NotAllocated == true){
            var notinclude = " [Roster].[Type] = 1 Or  "    
        }else {var notinclude = "  "}
        fQuery = fQuery + " WHERE ([Carer Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') And (( "+ notinclude + " [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION')";
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        var Title = "STAFF PROGRAM PAYTYPE";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";

                    break;
            }
// alert("Not Completed. yet to do")
        if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
           
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + "ORDER BY [Carer Code], [Program], [Service Description], Date, [Start Time]";

        //////console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "wrRlhBfDegZzFrlu";
                break;
            case "Standard":
                Title = Title + "-STANDARD"
                this.reportid = "bzsYqppVdYW4XLK6";
                break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "pq2cnQ2nGuR4Szlh"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,
                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,

            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffFunderPayrolltypeRpt(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty  ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , PT.[AccountingIdentifier] AS PayrollType , [HumanResourceTypes].[Type] AS MDS, [HumanResourceTypes].[Address1] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]  INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] INNER JOIN ITEMTYPES PT ON [Roster].[Service Description] = PT.[Title] INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name "
        var lblcriteria;

      if (this.inputForm.value.NotAllocated == true){
                var notinclude = " [Roster].[Type] = 1 Or  "    
            }else {var notinclude = "  "}
        fQuery = fQuery + " WHERE  ([Carer Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') And (( "+ notinclude +"  [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION') ";
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        var Title = "STAFF FUNDER PAYROLL TYPE";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        } //.join(",") +
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }  //.join(",") + "; "
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + "ORDER BY [Carer Code], PayrollType, Date, [Start Time]";

    //    console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "UBAW9sppie7EzOiP";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "Ghkc0I8PGXUYn6xK";

                    break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "6v9LSTGgq06bT7xK"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    FunderPayrolltypeRpt(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , PT.[AccountingIdentifier] AS PayrollType , [HumanResourceTypes].[Type] AS MDS, [HumanResourceTypes].[Address1]  FROM Roster INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] INNER JOIN ITEMTYPES PT ON [Roster].[Service Description] = PT.[Title] INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] "
        var lblcriteria;

        if (this.inputForm.value.NotAllocated == true){
            var notinclude = " [Roster].[Type] = 1 Or  "    
            }else {var notinclude = "  "}
        fQuery = fQuery + " WHERE ([Roster].[Status] >= '2') And ((" + notinclude +" [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION' AND PT.MinorGroup NOT IN ('PAID LEAVE', 'UNPAID LEAVE')) ";
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        var Title = "FUNDER PAYROLL TYPE";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + " ORDER BY [MDS], PayrollType, Date, [Start Time]";

    //    console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "2MILocaJ7z4C1VP2";
                break;
            case "Standard":
                        Title = Title + "-STANDARD"
                        this.reportid = "WXNGRB3cU1V6kFz0";

                        break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "rUnfnSRvYRppjPTk"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,
                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,

            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    FundingAuditReport(startdate, enddate) {

        var fQuery = "SELECT R.[CLIENT CODE], R.[Program], R.[Carer Code], R.[Service Type], I.DATASETGROUP, I.HACCTYPE, I.NDIA_ID, R.[DATE], R.[Start Time], CASE WHEN R.[Type] = 9 THEN 0 ELSE R.[Duration] / 12 END AS [Duration], R.[CostQty], CASE WHEN R.[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN R.[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, R.[BILLQTY], R.[Unit Bill Rate] * R.[BillQty] As [LineBill], R.[Unit Pay Rate] * R.[CostQty] As [LineCost] FROM Roster R  INNER JOIN RECIPIENTS C ON R.[Client Code] = C.[AccountNo]  INNER JOIN ITEMTYPES I ON R.[SERVICE TYPE] = I.TITLE AND I.PROCESSCLASSIFICATION IN ('OUTPUT', 'EVENT','ITEM') WHERE [Client Code] > '!Z'  AND (R.[TYPE] IN (1,2,3,5,7,8,10,11,12,14) OR (R.[TYPE] = 4 AND R.[Carer Code] = '!INTERNAL'))    "
        var lblcriteria;

        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (Date  BETWEEN '" + startdate + ("' AND  '") + enddate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }


        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }



        fQuery = fQuery + " ORDER BY  ACCOUNTNO"

        //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "cmkcZALxPRp1NQEw" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Funding Audit Report.pdf"
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
    DatasetActivityAnalysis(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type] as ServiceType, [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [HumanResourceTypes].[Type] AS MDS, [HumanResourceTypes].[Address1] , [ItemTypes].[HACCType] AS MDSType  ,[Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name     "
        var lblcriteria;

        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }

        if (recipient != "" || manager != "" || region != "") {
            var join = "INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]";
            fQuery = fQuery + join;

        }

        fQuery = fQuery + " WHERE  ([ItemTypes].[IT_Dataset] IN ('DEX', 'HACC', 'QCSS', 'CSTDA', 'NRCP', 'NRCP-SAR'))  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')";

        var Title = "DATASET ACTIVITY ANALYSIS REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + " ORDER BY [HumanResourceTypes].[Type], ItemTypes.HACCType, [Service Type], Date, [Start Time]";

        //////console.log(fQuery)


        this.drawerVisible = true;

        const data = {
            "template": { "_id": "y3AjmCjSbwvf2zGw" },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    DatasetoutputSummary(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0) WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [ItemTypes].[HACCType] AS MDSType, [ItemTypes].[AccountingIdentifier], [ItemTypes].[MinorGroup] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;

        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }

        fQuery = fQuery + " WHERE ([ItemTypes].[IT_Dataset] IN ('DEX', 'HACC', 'QCSS', 'CSTDA', 'NRCP', 'NRCP-SAR'))  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')";



        var Title = "DATASET OUTPUT SUMMARY REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };

        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + " ORDER BY [MDSType], [Client Code], Date, [Start Time] ";

        //    //////console.log(fQuery) 
        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "cgcfODRkRP2q67Sh";
                break;
            case "Standard":
                        Title = Title + "-STANDARD"                     
                        this.reportid = "dbsLlWKE4otr07iH";

                        break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "YYfS88zCaEg6Qd12"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    UnbilledItems(branch, program, SvcType, startdate, enddate,tempsdate, tempedate) {

    var fQuery = "SELECT [Roster].[RecordNo], FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] + ([Roster].[Unit Bill Rate] * [Roster].[BillQty] * IsNull([Roster].[TaxPercent], 0) / 100) As [Amount], [Roster].[Yearno], [Recipients].[BRANCH], [Roster].[InvoiceNumber], [Roster].[Batch#]  FROM Roster  LEFT JOIN Recipients ON Roster.[CLient Code] = Recipients.[Accountno]  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE')  AND Roster.[Status] in (1,2,5)  AND (ISNULL(Roster.[Unit Bill Rate], 0) <> 0 AND ISNULL(Roster.[BillQty], 0) <> 0)   "
    //    var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate] as [UnitBillRate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno], [Recipients].[BRANCH],[Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate] as [UnitBillRate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] + ([Roster].[Unit Bill Rate] * [Roster].[BillQty] * IsNull([Roster].[TaxPercent], 0) / 100) As [Amount], [Roster].[Yearno], [Recipients].[BRANCH], [Roster].[InvoiceNumber], [Roster].[Batch#]  FROM Roster  INNER JOIN Recipients ON Roster.[CLient Code] = Recipients.[Accountno]  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE')  AND Roster.[Type] in (1,2,5) "
        var lblcriteria;

        //(RO.[DATE] BETWEEN '2020/08/01' AND '2020/08/31') AND
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " [Roster].[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "[Recipients].BRANCH in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Roster].PROGRAM in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (SvcType != "") {
            this.s_SvcTypeSQL = " ([Service Type] in ('" + SvcType.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_SvcTypeSQL }
        }

        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (SvcType != "") {
            lblcriteria = lblcriteria + " Service Type " + SvcType.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Svc. Types" }

        fQuery = fQuery + " ORDER BY  [Date], [Service Type], [Program]"


     //   console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "FgNttxKsmc7gqOPj" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "UnBilled Items Report.pdf"
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
    BilledItems(branch, program, SvcType, startdate, enddate,tempsdate, tempedate) {

        var fQuery ="SELECT [Roster].[RecordNo], FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate] as [UnitBillRate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] + ([Roster].[Unit Bill Rate] * [Roster].[BillQty] * IsNull([Roster].[TaxPercent], 0) / 100) As [Amount], [Roster].[Yearno], [Recipients].[BRANCH], [Roster].[InvoiceNumber], [Roster].[Batch#]  FROM Roster  LEFT JOIN Recipients ON Roster.[CLient Code] = Recipients.[Accountno]  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE')  AND Roster.[Status] in (3,4) AND isNull(InvoiceNumber, '') <> ''  AND (ISNULL(Roster.[Unit Bill Rate], 0) <> 0 AND ISNULL(Roster.[BillQty], 0) <> 0) "        
        var lblcriteria;


        //(RO.[DATE] BETWEEN '2020/08/01' AND '2020/08/31') AND
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " [Roster].[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "[Recipients].BRANCH in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Roster].PROGRAM in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (SvcType != "") {
            this.s_SvcTypeSQL = " ([Service Type] in ('" + SvcType.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_SvcTypeSQL }
        }

        if (branch != "") {
            lblcriteria = "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = " All Branches " }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }
        if (SvcType != "") {
            lblcriteria = lblcriteria + " Service Type " + SvcType.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Svc. Types" }

        fQuery = fQuery + " ORDER BY  [Date], [Service Type], [Program] "


     //   console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "FgNttxKsmc7gqOPj" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Billed Items Report.pdf"
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

    ActivityRecipientReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;
        

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + " WHERE ([Client Code] > '!MULTIPLE')"

        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        
       
        if (this.inputForm.value.RecipientLeave == true){
            fQuery = fQuery + " And (([Roster].[Type] IN (2, 3, 5, 7, 8, 9, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') OR ([Roster].[Type] = 4 And [Carer Code] = '!MULTIPLE') ) "
        }else{
            fQuery = fQuery + " And ([Roster].[Type] IN (2, 3, 5, 7, 8, 9, 10, 11, 12, 14)) And ([Client Code] > '!MULTIPLE') "
        }
         
        

        var Title = "ACTIVITY RECIPIENT REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Recipients].[Branch] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            
            this.s_RosterCategorySQL = "[Roster].[Type]  in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }





        fQuery = fQuery + " ORDER BY [Service Type], [Client Code], Date, [Start Time] ";

     //   console.log(fQuery) 
        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "pgPwDEeuHN7slyuf";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "eddJa8AnPzUKeq3y";

                    break;

            default:
                Title = Title + "-SUMMARY"
                this.reportid  = "EUpoRvslDL2jReMC"
                break;
        }

        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffProgramUtilisation(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = " SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + " WHERE  ([Carer Code] > '!MULTIPLE')  "
        //And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9))  ";
        //And [Carer Code] <> '!MULTIPLE'
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        if (this.inputForm.value.NotAllocated == true){
                     var notinclude = " 1, "    
        }else {var notinclude = "  "}
         
        if (this.inputForm.value.RecipientLeave == true){
            fQuery = fQuery + " And (([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8,  10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) "
        }else{
            fQuery = fQuery + " And ([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8,  10, 11, 12, 14))  "
        }
         


        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":  //tempsdate tempedate

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }



        var Title = "STAFF PROGRAM UTILISATION REPORT";
        var Report_Definer = " "
        fQuery = fQuery + " ORDER BY [Carer Code], [Program], Date, [Start Time]"







        //console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "A1mesTZmNX4TwwUC";
                break;
            case "Standard":
                        Title = Title + "-STANDARD"
                        this.reportid = "2VHpFTSnZibjrd8b";

                        break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "ML1Lx7IY0KXwlJdd"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,

                "txtCriteriaStmt": Report_Definer,

                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    StaffAllowance(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]      "
        var lblcriteria;

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (recipient != "" || manager != "" || region != "") {
            var join = "INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + " WHERE ([Carer Code] > '!MULTIPLE') "
        //  ";

         
        if (this.inputForm.value.NotAllocated == true){
            fQuery = fQuery + " And ([Roster].[Type] In (1,9)) And ([Carer Code] <> '!MULTIPLE') AND ([service type] <> 'CONTRIBUTION') "    
        }else {
            fQuery = fQuery + " And ([Roster].[Type] In (9)) And ([Carer Code] <> '!MULTIPLE') AND ([service type] <> 'CONTRIBUTION') "    
        }
        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }


        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // (Date >= '2020/09/01' And Date <='2020/09/30') AND            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }



        var Title = "STAFF ALLOWANCE REPORT";
        var Report_Definer = " "
        fQuery = fQuery + " ORDER BY [Carer Code], [Service Description], Date, [Start Time]"

        //console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "pt03dt4gX7njbIcj";

                break;
            case "Standard":
                        Title = Title + "-STANDARD"
                        this.reportid = "IOtbWNxPenbpSQql";

                        break;

            default:
                Title = Title + "-SUMMARY"
                this.reportid = "9PRBcDXyREab0Qke"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,

                "txtCriteriaStmt": Report_Definer,

                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    DatasetRecipientUnitCost(recipient, SvcType, startdate, enddate) {


        var fQuery = "select [Client Code], [Service Type], SUM(ClientCharge) AS [Client Charge], Round(SUM(UnitCost), 0) as [Unit Cost]  FROM  (  select [Client Code], it.DatasetGroup AS [Service Type], billqty, billqty * [unit bill rate] as ClientCharge, billqty * it.unitcost as UnitCost from roster  inner join itemtypes it on [service type] = title  inner join humanresourcetypes pr on [name] = program  WHERE pr.type = 'DSS' and it.it_dataset = 'DEX' and [client code] > '!z' "
        var lblcriteria;


        if (startdate != "" || enddate != "") {

            this.s_DateSQL = " [roster].[Date] BETWEEN '" + startdate + ("'AND'") + enddate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }

        if (recipient != "") {
            this.s_RecipientSQL = " ( [Client Code] in ('" + recipient.join("','") + "') )";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (SvcType != "") {
            this.s_SvcTypeSQL = " (it.DatasetGroup in ('" + SvcType.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_SvcTypeSQL }
        }


        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else {
            lblcriteria = " All Dated "
        }
        if (recipient != "") {
            lblcriteria = lblcriteria + " Recipient " + recipient.join(",") + "; "
        }
        else {
            lblcriteria = lblcriteria + " All Recipients "
        }
        if (SvcType != "") {
            lblcriteria = lblcriteria + " Service Type " + SvcType.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Svc. Types " }

        fQuery = fQuery + " ) t group by [client code], [service type]  ORDER BY [Client Code], [Service Type]"


        // //////console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "BziOYcDKGzLionPY" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Dataset Recipient Unit Cost Report.pdf"
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

    StaffDateProgram(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        var fQuery = " SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty  ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], ([Roster].[Unit Bill Rate] * [Roster].[BillQty]) + ([Roster].[Unit Bill Rate] * [Roster].[BillQty] * (ISNULL([Roster].TaxPercent, 0) / 100)) As [LineBill], [Roster].[Yearno] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]    "
        var lblcriteria; //INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "LEFT JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "LEFT JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + " WHERE  ([Carer Code] > '!MULTIPLE') And ([Roster].[Status] >= '2') And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION') "
        // And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9))  ";

        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        if (this.inputForm.value.NotAllocated == true){
                     var notinclude = " 1, "    
        }else {var notinclude = "  "}
        if (this.inputForm.value.allowances == true){
            var includeallowances = " 9, "    
        }else {var includeallowances = " "}
        if (this.inputForm.value.RecipientLeave == true){
            fQuery = fQuery + " And (([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8,"+ includeallowances +" 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) "
        }else{
            fQuery = fQuery + " And ([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8,"+includeallowances +" 10, 11, 12, 14))  "
        }
        if (this.inputForm.value.InternalCost == false){
        fQuery = fQuery +" AND ([Client Code] > '!INTERNAL') "
        }

        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":  //tempsdate tempedate

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }



        var Title = "STAFF DATE PROGRAM REPORT ";
        var Report_Definer = " "
        fQuery = fQuery + " ORDER BY [Carer Code], Date, [Program], [Service Description], [Start Time]"

     //   console.log(fQuery)

        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "MXXQYfoclIO6RAj0";
                break;
            case "Standard":
                Title = Title + "-STANDARD"
                this.reportid = "FTvlg15wIkR9j3mw";

                break;
            default:
                Title = Title + "-SUMMARY"
                this.reportid = "pCzQMu3RbgGilk6R"
                break;
        }


        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,

                "txtCriteriaStmt": Report_Definer,

                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        
        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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

   
    RecipientBudgetReport(program, incl_unapproved,incl_allowance,incl_inactive,Year,s_Month,s_FY_End_Month, s_FYear) {
        var Month,Year,date_start, date_end
        switch (s_Month) {            
            case 'January':
                Month = 1;
                date_start = Year + '/01/01' 
                date_end =   Year + '/02/01' 
                        
                break;
            case 'February':
                Month = 2 
                date_start = Year + '/02/01' 
                date_end =   Year + '/03/01'              
                break;
            case 'March':
                Month = 3 
                date_start = Year + '/03/01' 
                date_end =   Year + '/04/01'              
                break;
            case 'April':
                Month = 4
                date_start = Year + '/04/01' 
                date_end =   Year + '/05/01'               
                break;
            case 'May':
                Month = 5              
                date_start = Year + '/05/01' 
                date_end =   Year + '/06/01' 
                break;
            case 'June':
                Month = 6              
                date_start = Year + '/06/01' 
                date_end =   Year + '/07/01' 
                break;
            case 'July':
                Month = 7              
                date_start = Year + '/07/01' 
                date_end =   Year + '/08/01' 
                break;
            case 'August':
                Month = 8              
                date_start = Year + '/08/01' 
                date_end =   Year + '/09/01' 
                break;
            case 'September':
                Month = 9              
                date_start = Year + '/09/01' 
                date_end =   Year + '/10/01' 
                break;
            case 'October':
                Month = 10             
                date_start = Year + '/10/01' 
                date_end =   Year + '/11/01' 
                break;
            case 'November':
                Month = 11              
                date_start = Year + '/11/01' 
                date_end =   Year + '/12/01' 
                break;
            case 'December':
                Month = 12              
                date_start = Year + '/12/01' 
                date_end =   Year + 1 + '/01/01' 
                break;
        
            default:
                break;
                  //Year
                //tempsdate, tempedate
        }

        var fQuery = "Select Recipients.AccountNo, Recipients.[Surname/Organisation], Recipients.FirstName, Recipients.FirstName + ' ' + Recipients.[Surname/Organisation] as RecipientName, RecipientPrograms.Program, RecipientPrograms.Quantity, RecipientPrograms.ItemUnit, RecipientPrograms.PerUnit, RecipientPrograms.TimeUnit, RecipientPrograms.Period, RecipientPrograms.Expires, RecipientPrograms.TotalAllocation, RecipientPrograms.Used, RecipientPrograms.Remaining ,case when RecipientPrograms.TimeUnit like 'Day' then  convert(float,RecipientPrograms.Quantity)  when RecipientPrograms.TimeUnit in ('week','weekly') then  convert(float,RecipientPrograms.Quantity) / 7when RecipientPrograms.TimeUnit like 'FORTNIGHT' then  convert(float,RecipientPrograms.Quantity) /14 when RecipientPrograms.TimeUnit like 'MONTH' then  convert(float,RecipientPrograms.Quantity) * 12 / 365 when RecipientPrograms.TimeUnit like 'QUARTER' then  convert(float,RecipientPrograms.Quantity) * 4 / 365when RecipientPrograms.TimeUnit like 'HALF YEAR' then  convert(float,RecipientPrograms.Quantity) * 2 / 365 when RecipientPrograms.TimeUnit like 'YEAR' then  convert(float,RecipientPrograms.Quantity)  / 365 end as dailybudget,case when RecipientPrograms.TimeUnit like 'Day' then  convert(float,RecipientPrograms.Quantity) * 365 / 12  when RecipientPrograms.TimeUnit in ('week','weekly') then  convert(float,RecipientPrograms.Quantity) * 52 / 12  when RecipientPrograms.TimeUnit like 'FORTNIGHT' then  convert(float,RecipientPrograms.Quantity) * 26 / 12  when RecipientPrograms.TimeUnit like 'MONTH' then  convert(float,RecipientPrograms.Quantity)   when RecipientPrograms.TimeUnit like 'QUARTER' then  convert(float,RecipientPrograms.Quantity)  / 4  when RecipientPrograms.TimeUnit like 'HALF YEAR' then  convert(float,RecipientPrograms.Quantity)  / 4  when RecipientPrograms.TimeUnit like 'YEAR' then  convert(float,RecipientPrograms.Quantity)  / 12 end as monthlybudget,case when RecipientPrograms.TimeUnit like 'Day' then  convert(float,RecipientPrograms.Quantity) * 365  when RecipientPrograms.TimeUnit in ('week','weekly') then  convert(float,RecipientPrograms.Quantity) * 52  when RecipientPrograms.TimeUnit like 'FORTNIGHT' then  convert(float,RecipientPrograms.Quantity) * 26  when RecipientPrograms.TimeUnit like 'MONTH' then  convert(float,RecipientPrograms.Quantity) * 12  when RecipientPrograms.TimeUnit like 'QUARTER' then  convert(float,RecipientPrograms.Quantity) * 4  when RecipientPrograms.TimeUnit like 'HALF YEAR' then  convert(float,RecipientPrograms.Quantity) * 2  when RecipientPrograms.TimeUnit like 'YEAR' then  convert(float,RecipientPrograms.Quantity) end as annualbudget,case when RecipientPrograms.ItemUnit = 'DOLLARS' then (SELECT top 1  ([Unit Pay Rate] * CostQty)   FROM Roster WHERE (YearNo = '" + Year + "') AND (MonthNo = '" + Month + "') AND ([Client Code] = Recipients.AccountNo ) AND ([Program] = RecipientPrograms.Program)) when RecipientPrograms.ItemUnit = 'HOURS' then (SELECT top 1  ([Duration] * 5)/60    FROM Roster  WHERE  (YearNo = '" + Year + "') AND  (MonthNo = '" + Month + "') AND  ([Client Code] = Recipients.AccountNo) AND  ([Program] = RecipientPrograms.Program) AND  ([Type] <> 9)) when RecipientPrograms.ItemUnit = 'SERVICES' then (SELECT top 1  ([Duration] * 5)/60    FROM Roster  WHERE  (YearNo = '" + Year + "') AND  (MonthNo = '" + Month + "') AND  ([Client Code] = Recipients.AccountNo) AND  ([Program] = RecipientPrograms.Program) AND  ([Type] <> 9)) end as MTDActual ,case when RecipientPrograms.ItemUnit = 'DOLLARS' then (SELECT top 1   ([Unit Pay Rate] * CostQty)  FROM Roster  WHERE (Date BETWEEN '" +date_start  + "' AND '" +   date_end + "') AND  ([Client Code] = Recipients.AccountNo) AND  ([Program] = RecipientPrograms.Program)) when RecipientPrograms.ItemUnit = 'HOURS' then (SELECT  top 1 ([Duration] * 5)/60   FROM Roster WHERE (Date BETWEEN '" +date_start   + "' AND '" +   date_end + "') AND ([Client Code] = Recipients.AccountNo ) AND ([Program] =  RecipientPrograms.Program)) when RecipientPrograms.ItemUnit = 'SERVICES' then (SELECT top 1 ([Duration] * 5)/60   FROM Roster WHERE (Date BETWEEN '" +date_start   + "' AND '" +   date_end + "') AND ([Client Code] = Recipients.AccountNo  ) AND ([Program] =  RecipientPrograms.Program)) end as YTDActual FROM RecipientPrograms INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID WHERE Recipients.AccountNo > '!' "
        var lblcriteria;

        

       
        if (program != "") {
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (incl_unapproved == true){
            fQuery = fQuery + " AND (admissiondate is not null) AND (DischargeDate is null)  "
        }
        if (incl_allowance == true){
            fQuery = fQuery + " AND (admissiondate is not null) AND (DischargeDate is null)  "
        }
  //   if (incl_inactive == true){
   //         fQuery = fQuery + " AND "
    //    }
           

       


        if (program != "") {
            lblcriteria =  " Programs " + program.join(",") + "; "
        }
        else { lblcriteria =  "All Programs," }
        lblcriteria =  lblcriteria + "Month & Year: " +  s_Month + ", "  + Year + "."

        fQuery = fQuery + " ORDER BY RecipientPrograms.Program, Recipients.AccountNo "


        //  console.log(fQuery)
        //  console.log(lblcriteria)



        const data = {

            "template": { "_id": "7B3lbrGiUaoWLDLt" },
            "options": {
                "reports": { "save": false },                
                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,
                
            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Program Recipient Budget.pdf"
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
//(s_Branches, s_Staff,s_ServiceRegions ,s_Competencies)
CompetencyRegister(branch, Staff,stfgroup,competency) {

    var lblcriteria;
    //SELECT DISTINCT Staff.[UniqueID], Staff.[AccountNo], Staff.[STF_CODE], Staff.[STF_DEPARTMENT], Staff.[StaffGroup], Staff.[LastName], UPPER(Staff.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Staff.[Address1], Staff.[Address2], Staff.[Suburb], Staff.[Postcode], Format(Staff.[CommencementDate],'dd/MM/yyyy') as [CommencementDate], Staff.[TerminationDate],  SB1, SB2, SB3, SB4, SB5, SB6, SB7, SB8, SB9, SB10, SB11, SB12, SB13, SB14, SB15, SB16, SB17, SB18, SB19, SB20, SB21, SB22, SB23, SB24, SB25, SB26, SB27, SB28, SB29, SB30, SB31, SB32, SB33, SB34, SB35 ,HumanResources.RecordNumber,HumanResources.[Type] ,case when HumanResources.type = 'STAFFATTRIBUTE' then HumanResources.Name else null end AS Attribute,case when HumanResources.type = 'STAFFATTRIBUTE' then Format( Date1,'dd/MM/yyyy') end as Anniversary,case when HumanResources.type = 'STAFFATTRIBUTE' then HumanResources.Address1 end AS Cert#,case when HumanResources.type = 'STAFFATTRIBUTE' then Notes end as Notes,Stuff ((SELECT  ', ' + Detail from PhoneFaxOther pf where pf.PersonID = Staff.UniqueID and (PrimaryPhone = '1' OR ([Type] like '<EMAIL>' OR [Type] like 'EMAIL') )  For XML path ('')),1, 1, '') [Detail] FROM Staff inner JOIN HumanResources ON UniqueID = PersonID  WHERE    Staff.[Category] = 'STAFF'  OR Staff.[Category] = 'STAFF'  OR Staff.[Category] = 'BROKERAGE ORGANISATION'   AND (Staff.[commencementdate] is not null and Staff.[terminationdate] is null)  ORDER BY Staff.[LastName]
    var fQuery = "SELECT DISTINCT Staff.[UniqueID], Staff.[AccountNo], Staff.[STF_CODE], Staff.[STF_DEPARTMENT], Staff.[StaffGroup], Staff.[LastName],  Staff.[LastName] + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Staff.[Address1] + ' ' + Staff.[Suburb] + ' ' + Staff.[Postcode] as Address1, Staff.[Address2], Staff.[Suburb], Staff.[Postcode], Format(Staff.[CommencementDate],'dd/MM/yyyy') as [CommencementDate], Staff.[TerminationDate],  SB1, SB2, SB3, SB4, SB5, SB6, SB7, SB8, SB9, SB10, SB11, SB12, SB13, SB14, SB15, SB16, SB17, SB18, SB19, SB20, SB21, SB22, SB23, SB24, SB25, SB26, SB27, SB28, SB29, SB30, SB31, SB32, SB33, SB34, SB35  ,case when HumanResources.type = 'STAFFATTRIBUTE' then HumanResources.Name else null end AS Attribute,case when HumanResources.type = 'STAFFATTRIBUTE' then Format( Date1,'dd/MM/yyyy') end as Anniversary,case when HumanResources.type = 'STAFFATTRIBUTE' then HumanResources.Address1 end AS Cert#,case when HumanResources.type = 'STAFFATTRIBUTE' then Notes end as Notes,Stuff ((SELECT  ', ' + Detail from PhoneFaxOther pf where pf.PersonID = Staff.UniqueID and (PrimaryPhone = '1' OR ([Type] like '<EMAIL>' OR [Type] like 'EMAIL') )  For XML path ('')),1, 1, '') [Detail],case when SB1 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0022')  end as Skill22 ,case when SB2 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0023')   end as Skill23 ,case when SB3 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0024')   end as Skill24 ,case when SB4 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0025')   end as Skill25,case when SB5 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0026')   end as Skill26,case when SB6 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0027')   end as Skill27 ,case when SB7 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0028')   end as Skill28 ,case when SB8 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0029')   end as Skill29 ,case when SB9 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0030')   end as Skill30 ,case when SB10 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0031')   end as Skill31 ,case when SB11 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0032')   end as Skill32 ,case when SB12 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0033')   end as Skill33 ,case when SB13 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0034')   end as Skill34,case when SB14 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0036')   end as Skill36 ,case when SB15 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0040')   end as Skill40 ,case when SB16 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0041')   end as Skill41 ,case when SB17 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0042')   end as Skill42 ,case when SB18 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0043')   end as Skill43 ,case when SB19 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0044')    end as Skill44 ,case when SB20 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0045')   end as Skill45 ,case when SB21 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0046')   end as Skill46 ,case when SB22 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0047')   end as Skill47 ,case when SB23 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0048')   end as Skill48 ,case when SB24 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0049')   end as Skill49 ,case when SB25 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0050')   end as Skill50 ,case when SB26 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0051')   end as Skill51 ,case when SB27 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0052')   end as Skill52 ,case when SB28 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0053')   end as Skill53 ,case when SB29 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0054')   end as Skill54 ,case when SB30 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0055')   end as Skill55 ,case when SB31 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0056')   end as Skill56 ,case when SB32 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0057')   end as Skill57 ,case  when SB33 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0058')   end as Skill58  ,case when SB34 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0059')    end as Skill59 ,case when SB35 <> 0 then (SELECT text FROM Fieldnames WHERE identifier = 'fStaffContainer9-Competencies0060')   end as Skill60  FROM Staff inner JOIN HumanResources ON UniqueID = PersonID  WHERE  ([commencementdate] is not null and [terminationdate] is null)  "
    
    

    if (branch != "") {
        this.s_BranchSQL = "Staff.[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
        if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }

    }
    if (Staff != "") {
        this.s_StfSQL = "Staff.[AccountNo] in ('" + Staff.join("','") + "')";
        if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
    }
    if (stfgroup != "") {
        this.s_StfGroupSQL = "(Staff.[StaffGroup] in ('" + stfgroup.join("','") + "'))";
        if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
    }
    if (competency != "") {
        this.s_CompetencySQL = "HumanResources.[Name] in ('" + competency.join("','") + "')";
        if (this.s_CompetencySQL != "") { fQuery = fQuery + " AND " + this.s_CompetencySQL };
    }

    if(this.inputForm.value.includevolunteer == true){fQuery = fQuery + " OR [Category] = 'VOLUNTEER' "}
    if(this.inputForm.value.includestaff == true){fQuery = fQuery + " OR [Category] = 'STAFF' "}
    if(this.inputForm.value.includebroker == true){fQuery = fQuery + " OR [Category] = 'BROKERAGE ORGANISATION'  "}
   
    if(this.inputForm.value.includevolunteer == false && this.inputForm.value.includestaff == false && this.inputForm.value.includebroker == false && this.inputForm.value.exclude_MandatoryChecking == false){
        fQuery = fQuery + " AND [Category] Not IN ('STAFF','VOLUNTEER','BROKERAGE ORGANISATION') "
    }

    


    if (branch != "") {
        lblcriteria = "Branches:" + branch.join(",") + "; "
    }
    else { lblcriteria = " All Branches " }
    if (Staff != "") {
        lblcriteria = lblcriteria + " Staff: " + Staff.join(",") + "; "
    }
    else { lblcriteria = lblcriteria + "All Staff ," }
    if (stfgroup != "") {
        lblcriteria = lblcriteria + " Staff Categories: " + stfgroup.join(",") + "; "
    }
    else { lblcriteria = lblcriteria + "All Staff Categories," }
    if (competency != "") {
        lblcriteria = lblcriteria + " Competency:" + competency.join(",") + "; "
    }
    else { lblcriteria = lblcriteria + " All Competencies, " }

    if(this.inputForm.value.exclude_MandatoryChecking == true){
    fQuery = fQuery + "AND [Category]   IN ('STAFF') AND [COMPETENCYEXCEPTION]= 1"}
    fQuery = fQuery + " ORDER BY Staff.[LastName]"
     


    //  console.log(fQuery)
    //  console.log(this.inputForm.value.printaslabel)
    
   

    const data = {

        "template": { "_id": "4vlqqbVgKZAEfQFt" },
        "options": {
            "reports": { "save": false },            
            "sql": fQuery,
            "Criteria": lblcriteria,
            "userid": this.tocken.user,
            "otherSkills": this.inputForm.value.include_PrimarySkills,
            
        }
    }
    this.loading = true;
    

    this.printS.printControl(data).subscribe((blob: any) => {
        this.pdfTitle = "Staff Competency Register.pdf"
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
    ActivityProgramReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {
//  WHERE (Date >= '2021/06/01' And Date <='2021/06/30') AND ([Client Code] > '!MULTIPLE')  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')  
        var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[Branch] As Branch , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]"
//      var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;
        

        if (funders != "" || mdsagencyID != "") {
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;

        }
        fQuery = fQuery + " WHERE ([Client Code] > '!MULTIPLE') "

        if (this.inputForm.value.InfoOnly == true){
            fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
        }
        if (this.inputForm.value.NotAllocated == true){
                     var notinclude = " 1, "    
        }else {var notinclude = "  "}
        if (this.inputForm.value.RecipientLeave == true){
            fQuery = fQuery + " And (([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) "
        }else{
            fQuery = fQuery + " And ([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8, 10, 11, 12, 14))  "
        }
        if (this.inputForm.value.InternalCost == false){
        fQuery = fQuery +" AND ([Client Code] > '!INTERNAL') "
        }

     

        var Title = "ACTIVITY PROGRAM REPORT";
        var Report_Definer = "";

        if (branch != "") {
            this.s_BranchSQL = "[Recipients].[Branch] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (startdate != "" || enddate != "") {


            let strkey = Datetype.toString();
            switch (strkey) {

                case "Pay Period EndDate":

                    this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                    break;
                case 'Billing Date':

                    this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                    break;
                case 'Service Date':

                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";

                    break;
            }

            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
            // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (region != "") {
            this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
        if (stfgroup != "") {
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (Staff != "") {
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
            if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
        }
        if (status != "") {
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
            if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        if (funders != "") {
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
            if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
        }
        if (RosterCategory != "") {
            
            this.s_RosterCategorySQL = "[Roster].[Type]  in ('" + RosterCategory.join("','") + "')";
            if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
        }
        if (HACCCategory != "") {
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
            if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
        }
        if (mdsagencyID != "") {
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
            if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
        }

        if (Age != "" && Age != "All") {
            let tempkay = (Age.toString()).substring(0, 8);
            switch (tempkay) {
                case "Under 65":
                    this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                    break;
                case "Over 64 ":
                    this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                    break;

                default:
                    break;
            }

            fQuery = fQuery + " AND " + this.s_AgeSQL;

        }

        if (outletid != "") {
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
            if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
        }
        if (recipient != "") {
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
        }
        if (stafftype != "") {
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
            if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
        }
        if (paytype != "") {
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
            if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
        }
        if (activity != "") {
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
            if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
        }
        if (settings != "") {
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
            if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
        }





        if (startdate != "") {
            lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = " All Dated " }
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }


        if (outletid != "") {
            var OutletID = outletid.join(",") + "; "
        }
        else {
            OutletID = " All "
        }


        if (Datetype != "") {
            var Datetypes = Datetype + "; "
        }
        else {
            Datetypes = " Service Date "
        }


        if (Age != "") {
            var Age_ATSI = Age + "; "
        }
        else {
            Age_ATSI = " All "
        }



        if (mdsagencyID != "") {
            var mdsagency = mdsagencyID.join(",") + "; "
        }
        else {
            mdsagency = " All "
        }



        if (HACCCategory != "") {
            var HACCCategories = HACCCategory.join(",") + "; "
        }
        else {
            HACCCategories = " All "
        }



        if (RosterCategory != "") {
            var RosterCategories = RosterCategory.join(",") + "; "
        }
        else {
            RosterCategories = " All "
        }

        if (program != "") {
            var programs = program.join(",") + "; "
        }
        else {
            programs = " All "
        }



        if (Staff != "") {
            var Staffs = Staff.join(",") + "; "
        }
        else {
            Staffs = " All "
        }



        if (staffteam != "") {
            var staffteams = staffteam.join(",") + "; "
        }
        else {
            staffteams = " All "
        }



        if (stfgroup != "") {
            var stfgroups = stfgroup.join(",") + "; "
        }
        else {
            stfgroups = " All "
        }



        if (region != "") {
            var regions = region.join(",") + "; "
        }
        else {
            regions = " All "
        }



        if (manager != "") {
            var managers = manager.join(",") + "; "
        }
        else {
            managers = " All "
        }


        if (funders != "") {
            var fundingsource = funders.join(",") + "; "
        }
        else {
            fundingsource = " All "
        }


        if (status != "") {
            var statuscat = status + "; "
        }
        else {
            statuscat = " All "
        }



        if (recipient != "") {
            var recipients = recipient.join(",") + "; "
        }
        else {
            recipients = " All "
        }


        if (stafftype != "") {
            var stafftypes = stafftype.join(",") + "; "
        }
        else {
            stafftypes = " All "
        }

        if (paytype != "") {
            var paytypes = paytype.join(",") + "; "
        }
        else {
            paytypes = " All "
        }
        if (activity != "") {
            var activities = activity.join(",") + "; "
        }
        else {
            activities = " All "
        }
        if (settings != "") {
            var setting = settings.join(",") + "; "
        }
        else {
            setting = " All "
        }

       


        fQuery = fQuery + " ORDER BY [Service Type], [Program], Date, [Start Time] ";

//    console.log(fQuery) 
        switch (format) {
            case "Detailed":
                Title = Title + "-DETAIL"
                this.reportid = "mwT8sOQ5pQlHWnMx";
                break;
            case "Standard":
                    Title = Title + "-STANDARD"
                    this.reportid = "nawIpEOwReVE8LhR";

                    break;

            default:
                Title = Title + "-SUMMARY"
                this.reportid  = "EYo3Jq3ME6fRfANI"
                break;
        }

        this.drawerVisible = true;

        const data = {
            "template": { "_id": this.reportid },
            "options": {
                "reports": { "save": false },

                "txtTitle": Title,


                "sql": fQuery,
                "Criteria": lblcriteria,

                "txtregions": regions,
                "txtstfgroups": stfgroups,
                "txtstaffteams": staffteams,
                "txtStaffs": Staffs,
                "txtprograms": programs,
                "txtRosterCategories": RosterCategories,
                "txtHACCCategories": HACCCategories,
                "txtmdsagency": mdsagency,
                "txtAge_ATSI": Age_ATSI,
                "txtDatetypes": Datetypes,
                "txtmanagers": managers,
                "txtfundingsource": fundingsource,
                "txtOutletID": OutletID,
                "txtstatuscat": statuscat,
                "txtrecipients": recipients,
                "txtstafftypes": stafftypes,
                "txtpaytypes": paytypes,
                "txtactivities": activities,
                "txtsetting": setting,
                "userid": this.tocken.user,

                "includeFinancials":this.inputForm.value.InclFinancials,
                "Excludeheader":this.inputForm.value.ExcluPgeHeader,
            }
        }

        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    AwardStaffPayReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

       
        //  WHERE (Date >= '2021/06/01' And Date <='2021/06/30') AND ([Client Code] > '!MULTIPLE')  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')  
                var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[Branch] As Branch , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]"
        //      var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
                var lblcriteria;
                
        
                if (funders != "" || mdsagencyID != "") {
                    fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
                }
                if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
                    var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
                    fQuery = fQuery + join;
        
                }
                fQuery = fQuery + " WHERE ([Client Code] > '!MULTIPLE') "
        
                if (this.inputForm.value.InfoOnly == true){
                    fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
                }
                if (this.inputForm.value.NotAllocated == true){
                             var notinclude = " 1, "    
                }else {var notinclude = "  "}
                if (this.inputForm.value.RecipientLeave == true){
                    fQuery = fQuery + " And (([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) "
                }else{
                    fQuery = fQuery + " And ([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8, 10, 11, 12, 14))  "
                }
                if (this.inputForm.value.InternalCost == false){
                fQuery = fQuery +" AND ([Client Code] > '!INTERNAL') "
                }
        
             
        
                var Title = "AWARD STAFF PAY REPORT";
                var Report_Definer = "";
        
                if (branch != "") {
                    this.s_BranchSQL = "[Recipients].[Branch] in ('" + branch.join("','") + "')";
                    if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
                }
                if (startdate != "" || enddate != "") {
        
        
                    let strkey = Datetype.toString();
                    switch (strkey) {
        
                        case "Pay Period EndDate":
        
                            this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                            break;
                        case 'Billing Date':
        
                            this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                            break;
                        case 'Service Date':
        
                            this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                            break;
                        default:
                            this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
        
                            break;
                    }
        
                    if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
                    // console.log("s_DateSQL" + this.s_DateSQL)            
                }
                if (manager != "") {
                    this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
                    if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
                }
                if (region != "") {
                    this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
                    if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
                }
                if (stfgroup != "") {
                    this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
                    if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
                }
                if (staffteam != "") {
                    this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
                    if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
                }
                if (Staff != "") {
                    this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
                    if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
                }
                if (status != "") {
                    this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
                    if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
                }
                if (program != "") {
                    this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
                    if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
                }
        
                if (funders != "") {
                    this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
                    if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
                }
                if (RosterCategory != "") {
                    
                    this.s_RosterCategorySQL = "[Roster].[Type]  in ('" + RosterCategory.join("','") + "')";
                    if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
                }
                if (HACCCategory != "") {
                    this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
                    if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
                }
                if (mdsagencyID != "") {
                    this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
                    if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
                }
        
                if (Age != "" && Age != "All") {
                    let tempkay = (Age.toString()).substring(0, 8);
                    switch (tempkay) {
                        case "Under 65":
                            this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                            break;
                        case "Over 64 ":
                            this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                            break;
        
                        default:
                            break;
                    }
        
                    fQuery = fQuery + " AND " + this.s_AgeSQL;
        
                }
        
                if (outletid != "") {
                    this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
                    if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
                }
                if (recipient != "") {
                    this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
                    if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
                }
                if (stafftype != "") {
                    this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
                    if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
                }
                if (paytype != "") {
                    this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
                    if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
                }
                if (activity != "") {
                    this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
                    if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
                }
                if (settings != "") {
                    this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
                    if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
                }
        
        
        
        
        
                if (startdate != "") {
                    lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
                }
                else { lblcriteria = " All Dated " }
                if (branch != "") {
                    lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
                }
                else { lblcriteria = lblcriteria + " All Branches " }
        
        
                if (outletid != "") {
                    var OutletID = outletid.join(",") + "; "
                }
                else {
                    OutletID = " All "
                }
        
        
                if (Datetype != "") {
                    var Datetypes = Datetype + "; "
                }
                else {
                    Datetypes = " Service Date "
                }
        
        
                if (Age != "") {
                    var Age_ATSI = Age + "; "
                }
                else {
                    Age_ATSI = " All "
                }
        
        
        
                if (mdsagencyID != "") {
                    var mdsagency = mdsagencyID.join(",") + "; "
                }
                else {
                    mdsagency = " All "
                }
        
        
        
                if (HACCCategory != "") {
                    var HACCCategories = HACCCategory.join(",") + "; "
                }
                else {
                    HACCCategories = " All "
                }
        
        
        
                if (RosterCategory != "") {
                    var RosterCategories = RosterCategory.join(",") + "; "
                }
                else {
                    RosterCategories = " All "
                }
        
                if (program != "") {
                    var programs = program.join(",") + "; "
                }
                else {
                    programs = " All "
                }
        
        
        
                if (Staff != "") {
                    var Staffs = Staff.join(",") + "; "
                }
                else {
                    Staffs = " All "
                }
        
        
        
                if (staffteam != "") {
                    var staffteams = staffteam.join(",") + "; "
                }
                else {
                    staffteams = " All "
                }
        
        
        
                if (stfgroup != "") {
                    var stfgroups = stfgroup.join(",") + "; "
                }
                else {
                    stfgroups = " All "
                }
        
        
        
                if (region != "") {
                    var regions = region.join(",") + "; "
                }
                else {
                    regions = " All "
                }
        
        
        
                if (manager != "") {
                    var managers = manager.join(",") + "; "
                }
                else {
                    managers = " All "
                }
        
        
                if (funders != "") {
                    var fundingsource = funders.join(",") + "; "
                }
                else {
                    fundingsource = " All "
                }
        
        
                if (status != "") {
                    var statuscat = status + "; "
                }
                else {
                    statuscat = " All "
                }
        
        
        
                if (recipient != "") {
                    var recipients = recipient.join(",") + "; "
                }
                else {
                    recipients = " All "
                }
        
        
                if (stafftype != "") {
                    var stafftypes = stafftype.join(",") + "; "
                }
                else {
                    stafftypes = " All "
                }
        
                if (paytype != "") {
                    var paytypes = paytype.join(",") + "; "
                }
                else {
                    paytypes = " All "
                }
                if (activity != "") {
                    var activities = activity.join(",") + "; "
                }
                else {
                    activities = " All "
                }
                if (settings != "") {
                    var setting = settings.join(",") + "; "
                }
                else {
                    setting = " All "
                }
        
               
        
        
                fQuery = fQuery + "   ";
        
        //    console.log(fQuery) 
                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "vaOXVraOpuzXIUxS";
                        break;
                    case "Standard":
                            Title = Title + "-STANDARD"
                            this.reportid = "kA2MblWsCNCUc1gb";
        
                            break;
        
                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid  = "g3bkSvDrVnJOAL4u"
                        break;
                }
        
                this.drawerVisible = true;
                var rptSQL = " SELECT [Date] , [MonthNo], [DayNo], [BlockNo], [Program], [Client Code], [Carer Code], [Service Type], [Anal], [Service Description], [Type], [ServiceSetting], [Start Time], [Duration], CASE WHEN [Type] = 9 THEN 0 ELSE [Duration] / 12 END AS [DecimalDuration], [CostQty], [CostUnit], CASE WHEN [Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Unit Pay Rate], [Unit Pay Rate] * [CostQty] As [LineCost], [BillQty], [BillUnit], [Unit Bill Rate], ([Unit Bill Rate] * [BillQty]) + ([Unit Bill Rate] * [BillQty] * (ISNULL(TaxPercent, 0) / 100)) As [LineBill], [Yearno] FROM Award_Roster_rpt  ORDER BY [Carer Code], [Service Description], Date, [Start Time]  "
                var sql = " INSERT INTO Award_Roster_mufee (Award, RecordNo, [Date], [Start Time], Duration, PayType, RuleType, " +
                " Program, Activity, Activity_Type, JobType, InfoOnly, NoOver, Ros_Day ) " +
                " SELECT Award,Recordno, [Date], " +
                " LEFT(CONVERT(VARCHAR,sTime,108),5) AS [Start Time], " +
                "  DATEDIFF(N,sTime,eTime)/5.0 AS Duration, Paytype,RuleType,Program, " +
                "  [Service Type], [Type], JobType, InfoOnly, NoOvertimeAccumulation, ROS_DAY From ( " +
                "  SELECT DENSE_RANK() OVER(PARTITION BY R.RecordNo, R.[DATE], R.[Start Time] ORDER BY "+ 
                "  CASE WHEN LEFT(DAYTYPE,1) = 'P' THEN 4 WHEN LEFT(DAYTYPE,1) = 'W' THEN 2 " +
                "     WHEN ISNULL(DAYTYPE,'') = '' THEN 1 ELSE 3 END DESC ) AS RANKING, " +
                " R.Award, R.Recordno, R.[Date], R.[Start Time], Duration, T.StartTime, T.EndTime, T.RecordNo AS TRecNo," +
                " CASE WHEN PayAsRostered = 1 OR ExcludeFromTimebands = 1 OR PAR = 1 THEN [Service Description] ELSE T.PayType End As PayType, " +
                " CASE WHEN PayAsRostered = 1 OR ExcludeFromTimebands = 1 OR PAR = 1 THEN Shift_Start_Time ELSE " +
                " CASE WHEN StartTime > Shift_Start_Time THEN StartTime ELSE Shift_Start_Time END END AS sTime, " +
                " CASE WHEN PayAsRostered = 1 Or ExcludeFromTimebands = 1 OR PAR = 1 THEN Shift_End_Time ELSE " +
                " CASE WHEN EndTime > Shift_End_Time THEN Shift_End_Time ELSE EndTime END END AS eTime, " +
                " CASE WHEN PayAsRostered = 1 OR PAR = 1 THEN 'Pay As Rostered' WHEN ExcludeFromTimebands = 1 THEN 'Timeband Exclude' ELSE 'Timeband' END AS RuleType, " +
                "  t.DayType,  Program, [Service Type], [TYPE], JOBTYPE, INFOONLY, NoOvertimeAccumulation, ROS_DAY " +
                " From ( SELECT R.Recordno, R.[Date], R.[Start Time], Duration," +
                " CONVERT(SMALLDATETIME,R.[Start Time]) AS Shift_Start_Time, " +
                "  DATEADD(N, Duration*5, CONVERT(SMALLDATETIME,R.[Start Time])) AS Shift_End_Time, " +
                " CASE WHEN ISNULL(D.User1,'') ='' THEN 32 ELSE D.USER1 END AS AWARD, " +
                " CASE WHEN PH.[DATE] IS NULL THEN DATENAME(w, R.[DATE]) ELSE 'Public Holiday' END As [ROS_DAY], " +
                " I.PayAsRostered , I.ExcludeFromTimebands, R.Program, R.[Service Type], [Service Description], " +
                " R.[TYPE], I.JOBTYPE, I.INFOONLY, I.NoOvertimeAccumulation, P.PayAsRostered As PAR " +
                "  FROM ROSTER R INNER JOIN STAFF S ON R.[CARER CODE] = S.ACCOUNTNO " +
                " INNER JOIN ItemTypes I ON R.[SERVICE TYPE] = I.TITLE AND ISNULL(I.JOBTYPE,'') <> 'EXCURSION' "  +
                " LEFT JOIN ItemTypes P ON R.[SERVICE DESCRIPTION] = P.TITLE AND P.PROCESSCLASSIFICATION = 'INPUT' " +
                " LEFT JOIN HUMANRESOURCES H ON R.STAFFPOSITION = H.RECORDNUMBER " +
                " LEFT JOIN DATADOMAINS D ON H.[NAME] = D.[DESCRIPTION] AND D.DOMAIN = 'STAFFPOSITION' " +
                " LEFT JOIN PUBLIC_HOLIDAYS PH ON R.[DATE] = PH.[DATE]" +
                " AND CONVERT(SMALLDATETIME,R.[Start Time]) < ISNULL(CONVERT(SMALLDATETIME,PH.[END TIME]),'1900/01/02') "+
                " AND DATEADD(N, Duration*5, CONVERT(SMALLDATETIME,R.[Start Time])) "+
                " > ISNULL(CONVERT(SMALLDATETIME,PH.[START TIME]),'1900/01/01') "+
                " AND ISNULL(PH.STATS,'') IN ('ALL','NSW','') "+
                " AND (ISNULL(PH.PublicHolidayRegion,'') = ISNULL(S.PublicHolidayRegion,'') "+
                " OR ISNULL(PH.PublicHolidayRegion,'') = '') "+
                    "WHERE (R.DATE >= '"+tempsdate +"' AND R.DATE <='"+tempedate+"')  "
                    //AND ([CARER CODE] > '!Z')  AND (R.[STATUS] >= '2') AND (R.[TYPE] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) OR (R.[TYPE] = 4 AND [CARER CODE] = '!INTERNAL')) AND [CARER CODE] <> '!MULTIPLE' AND ([SERVICE TYPE] <> 'CONTRIBUTION')"  +
                    "AND [Carer Code] = '"+'ABFLAT GISELBERT'+"' "+
                    "AND R.[Date] BETWEEN '"+tempsdate+"' AND '"+tempedate+"' "
                    
                    if (this.inputForm.value.NotAllocated == true){
                         sql = sql +" AND R.[Type] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) OR "
                    }else{sql = sql + " AND R.[Type] IN(2, 5, 6, 7, 8, 9, 10, 11, 12) OR "}
                    sql = sql +" ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL')) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION') "
    
                    sql = sql +"AND ISNULL(I.ExcludeFromInterpretation,0) = 0 "+
                    "AND ISNULL(P.ExcludeFromInterpretation,0) = 0 "+
                    ") AS R  INNER JOIN TIMEBAND T ON T.AWARD = R.AWARD "+
                        "AND (( IsNull(PayAsRostered,0) = 0 AND IsNull(PAR,0) = 0 AND IsNull(ExcludeFromTimebands,0) = 0 "+
                        "AND (CONVERT(SMALLDATETIME,R.[Start Time]) < T.EndTime "+
                        "AND DATEADD(N, Duration*5, CONVERT(SMALLDATETIME,R.[Start Time])) > T.StartTime) "+
                        "AND ((ISNULL(DAYTYPE,'') = 'WEEKEND' AND LEFT(ROS_DAY,1) = 'S' ) "+
                        " OR (ISNULL(DAYTYPE,'') = 'WEEKDAY' AND LEFT(ROS_DAY,1) <> 'S') "+
                        "OR (ISNULL(DAYTYPE,'') = ROS_DAY ) "+
                        " OR ISNULL(DAYTYPE,'') = '' )) "+
                        "OR ((IsNull(PayAsRostered,0) = 1 OR IsNull(PAR,0) = 1 OR IsNull(ExcludeFromTimebands,0) = 1) and vRank = 1)) "+
                    ") AS Final WHERE RANKING = 1 ORDER BY [Date], [START TIME] "
    
    
                const data = {
                    "template": { "_id": this.reportid },
                    "options": {
                        "reports": { "save": false },
        
                        "txtTitle": Title,
        
        
                        "sql": rptSQL,//fQuery,
                         "test": sql,
                        "Criteria": lblcriteria,
        
                        "txtregions": regions,
                        "txtstfgroups": stfgroups,
                        "txtstaffteams": staffteams,
                        "txtStaffs": Staffs,
                        "txtprograms": programs,
                        "txtRosterCategories": RosterCategories,
                        "txtHACCCategories": HACCCategories,
                        "txtmdsagency": mdsagency,
                        "txtAge_ATSI": Age_ATSI,
                        "txtDatetypes": Datetypes,
                        "txtmanagers": managers,
                        "txtfundingsource": fundingsource,
                        "txtOutletID": OutletID,
                        "txtstatuscat": statuscat,
                        "txtrecipients": recipients,
                        "txtstafftypes": stafftypes,
                        "txtpaytypes": paytypes,
                        "txtactivities": activities,
                        "txtsetting": setting,
                        "userid": this.tocken.user,
        
                        "includeFinancials":this.inputForm.value.InclFinancials,
                        "Excludeheader":this.inputForm.value.ExcluPgeHeader,
                    }
                }
        
                this.loading = true;
                

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    AwardStaffProgramPayReport(branch, manager, region, stfgroup, funders, recipient, Staff, HACCCategory, RosterCategory, Age, Datetype, program, mdsagencyID, outletid, staffteam, status, startdate, enddate, rptname, stafftype, paytype, activity, settings, format, tempsdate, tempedate) {

        
        //  WHERE (Date >= '2021/06/01' And Date <='2021/06/30') AND ([Client Code] > '!MULTIPLE')  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')  
                var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[Branch] As Branch , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]"
        //      var fQuery = "SELECT FORMAT(convert(datetime,[Roster].[Date]), 'dd/MM/yyyy') as [Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty,[Roster].[Unit Pay Rate] as UnitPayRate , [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
                var lblcriteria;
                
        
                if (funders != "" || mdsagencyID != "") {
                    fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
                }
                if (stfgroup != "" || Staff != "" || staffteam != "" || stafftype != "") {
                    var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
                    fQuery = fQuery + join;
        
                }
                fQuery = fQuery + " WHERE ([Client Code] > '!MULTIPLE') "
        
                if (this.inputForm.value.InfoOnly == true){
                    fQuery = fQuery + " AND NOT EXISTS ( SELECT * FROM ITEMTYPES I WHERE INFOONLY = 1 AND ROSTER.[SERVICE TYPE] = I.TITLE) "
                }
                if (this.inputForm.value.NotAllocated == true){
                             var notinclude = " 1, "    
                }else {var notinclude = "  "}
                if (this.inputForm.value.RecipientLeave == true){
                    fQuery = fQuery + " And (([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) "
                }else{
                    fQuery = fQuery + " And ([Roster].[Type] IN ( "+ notinclude  +" 2, 3, 5, 6, 7, 8, 10, 11, 12, 14))  "
                }
                if (this.inputForm.value.InternalCost == false){
                fQuery = fQuery +" AND ([Client Code] > '!INTERNAL') "
                }
        
             
        
                var Title = "AWARD STAFF PROGRAM PAY REPORT";
                var Report_Definer = "";
        
                if (branch != "") {
                    this.s_BranchSQL = "[Recipients].[Branch] in ('" + branch.join("','") + "')";
                    if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
                }
                if (startdate != "" || enddate != "") {
        
        
                    let strkey = Datetype.toString();
                    switch (strkey) {
        
                        case "Pay Period EndDate":
        
                            this.s_DateSQL = " ([Date Timesheet] >=  '" + tempsdate + ("' AND [Date Timesheet] <= '") + tempedate + "' )";
                            break;
                        case 'Billing Date':
        
                            this.s_DateSQL = " ([Date Invoice] >=  '" + tempsdate + ("' AND [Date Invoice] <= '") + tempedate + "' )";
                            break;
                        case 'Service Date':
        
                            this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
                            break;
                        default:
                            this.s_DateSQL = " (Date >=  '" + tempsdate + ("' AND Date <= '") + tempedate + "' )";
        
                            break;
                    }
        
                    if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
                    // console.log("s_DateSQL" + this.s_DateSQL)            
                }
                if (manager != "") {
                    this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','") + "')";
                    if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
                }
                if (region != "") {
                    this.s_CategorySQL = "Anal in ('" + region.join("','") + "')";
                    if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
                }
                if (stfgroup != "") {
                    this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','") + "'))";
                    if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
                }
                if (staffteam != "") {
                    this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
                    if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
                }
                if (Staff != "") {
                    this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','") + "'))";
                    if (this.s_StfSQL != "") { fQuery = fQuery + " AND " + this.s_StfSQL };
                }
                if (status != "") {
                    this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','") + "'))";
                    if (this.s_statusSQL != "") { fQuery = fQuery + " AND " + this.s_statusSQL };
                }
                if (program != "") {
                    this.s_ProgramSQL = " ([Program] in ('" + program.join("','") + "'))";
                    if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
                }
        
                if (funders != "") {
                    this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','") + "')";
                    if (this.s_FundersSQL != "") { fQuery = fQuery + " AND " + this.s_FundersSQL };
                }
                if (RosterCategory != "") {
                    
                    this.s_RosterCategorySQL = "[Roster].[Type]  in ('" + RosterCategory.join("','") + "')";
                    if (this.s_RosterCategorySQL != "") { fQuery = fQuery + " AND " + this.s_RosterCategorySQL };
                }
                if (HACCCategory != "") {
                    this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','") + "')";
                    if (this.s_HACCCategorySQL != "") { fQuery = fQuery + " AND " + this.s_HACCCategorySQL };
                }
                if (mdsagencyID != "") {
                    this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','") + "')";
                    if (this.s_MdsAgencySQL != "") { fQuery = fQuery + " AND " + this.s_MdsAgencySQL };
                }
        
                if (Age != "" && Age != "All") {
                    let tempkay = (Age.toString()).substring(0, 8);
                    switch (tempkay) {
                        case "Under 65":
                            this.s_AgeSQL = "NOT (DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT'))) "
                            break;
                        case "Over 64 ":
                            this.s_AgeSQL = "(DATEADD(YEAR,65, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] OR (DATEADD(YEAR,50, CONVERT(DATETIME,DATEOFBIRTH)) <= [DATE] AND LEFT(IndiginousStatus, 3) IN ('ABO', 'TOR', 'BOT')))";
                            break;
        
                        default:
                            break;
                    }
        
                    fQuery = fQuery + " AND " + this.s_AgeSQL;
        
                }
        
                if (outletid != "") {
                    this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','") + "')";
                    if (this.s_OutletIDSQL != "") { fQuery = fQuery + " AND " + this.s_OutletIDSQL };
                }
                if (recipient != "") {
                    this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','") + "')";
                    if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL };
                }
                if (stafftype != "") {
                    this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','") + "')";
                    if (this.s_StafftypeSQL != "") { fQuery = fQuery + " AND " + this.s_StafftypeSQL };
                }
                if (paytype != "") {
                    this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','") + "')";
                    if (this.s_paytypeSQL != "") { fQuery = fQuery + " AND " + this.s_paytypeSQL };
                }
                if (activity != "") {
                    this.s_activitySQL = "[Service Type] in ('" + activity.join("','") + "')";
                    if (this.s_activitySQL != "") { fQuery = fQuery + " AND " + this.s_activitySQL };
                }
                if (settings != "") {
                    this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','") + "')";
                    if (this.s_setting_vehicleSQL != "") { fQuery = fQuery + " AND " + this.s_setting_vehicleSQL };
                }
        
        
        
        
        
                if (startdate != "") {
                    lblcriteria = " Date Between " + startdate + " and " + enddate + "; "
                }
                else { lblcriteria = " All Dated " }
                if (branch != "") {
                    lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
                }
                else { lblcriteria = lblcriteria + " All Branches " }
        
        
                if (outletid != "") {
                    var OutletID = outletid.join(",") + "; "
                }
                else {
                    OutletID = " All "
                }
        
        
                if (Datetype != "") {
                    var Datetypes = Datetype + "; "
                }
                else {
                    Datetypes = " Service Date "
                }
        
        
                if (Age != "") {
                    var Age_ATSI = Age + "; "
                }
                else {
                    Age_ATSI = " All "
                }
        
        
        
                if (mdsagencyID != "") {
                    var mdsagency = mdsagencyID.join(",") + "; "
                }
                else {
                    mdsagency = " All "
                }
        
        
        
                if (HACCCategory != "") {
                    var HACCCategories = HACCCategory.join(",") + "; "
                }
                else {
                    HACCCategories = " All "
                }
        
        
        
                if (RosterCategory != "") {
                    var RosterCategories = RosterCategory.join(",") + "; "
                }
                else {
                    RosterCategories = " All "
                }
        
                if (program != "") {
                    var programs = program.join(",") + "; "
                }
                else {
                    programs = " All "
                }
        
        
        
                if (Staff != "") {
                    var Staffs = Staff.join(",") + "; "
                }
                else {
                    Staffs = " All "
                }
        
        
        
                if (staffteam != "") {
                    var staffteams = staffteam.join(",") + "; "
                }
                else {
                    staffteams = " All "
                }
        
        
        
                if (stfgroup != "") {
                    var stfgroups = stfgroup.join(",") + "; "
                }
                else {
                    stfgroups = " All "
                }
        
        
        
                if (region != "") {
                    var regions = region.join(",") + "; "
                }
                else {
                    regions = " All "
                }
        
        
        
                if (manager != "") {
                    var managers = manager.join(",") + "; "
                }
                else {
                    managers = " All "
                }
        
        
                if (funders != "") {
                    var fundingsource = funders.join(",") + "; "
                }
                else {
                    fundingsource = " All "
                }
        
        
                if (status != "") {
                    var statuscat = status + "; "
                }
                else {
                    statuscat = " All "
                }
        
        
        
                if (recipient != "") {
                    var recipients = recipient.join(",") + "; "
                }
                else {
                    recipients = " All "
                }
        
        
                if (stafftype != "") {
                    var stafftypes = stafftype.join(",") + "; "
                }
                else {
                    stafftypes = " All "
                }
        
                if (paytype != "") {
                    var paytypes = paytype.join(",") + "; "
                }
                else {
                    paytypes = " All "
                }
                if (activity != "") {
                    var activities = activity.join(",") + "; "
                }
                else {
                    activities = " All "
                }
                if (settings != "") {
                    var setting = settings.join(",") + "; "
                }
                else {
                    setting = " All "
                }
        
               
        
        
                fQuery = fQuery + "   ";
        
        //    console.log(fQuery) 
                switch (format) {
                    case "Detailed":
                        Title = Title + "-DETAIL"
                        this.reportid = "Ef6gbM3Pt5hFjSWe";
                        break;
                    case "Standard":
                            Title = Title + "-STANDARD"
                            this.reportid = "K2QUhdbMCZMrLQNi";
        
                            break;
        
                    default:
                        Title = Title + "-SUMMARY"
                        this.reportid  = "80PowW6HRXI0ZMQX"
                        break;
                }
        
                this.drawerVisible = true;
                var rptSQL = " SELECT [Date] , [MonthNo], [DayNo], [BlockNo], [Program], [Client Code], [Carer Code], [Service Type], [Anal], [Service Description], [Type], [ServiceSetting], [Start Time], [Duration], CASE WHEN [Type] = 9 THEN 0 ELSE [Duration] / 12 END AS [DecimalDuration], [CostQty], [CostUnit], CASE WHEN [Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Unit Pay Rate], [Unit Pay Rate] * [CostQty] As [LineCost], [BillQty], [BillUnit], [Unit Bill Rate], ([Unit Bill Rate] * [BillQty]) + ([Unit Bill Rate] * [BillQty] * (ISNULL(TaxPercent, 0) / 100)) As [LineBill], [Yearno] FROM Award_Roster_rpt  ORDER BY [Carer Code], [Service Description], Date, [Start Time]  "
        
                const data = {
                    "template": { "_id": this.reportid },
                    "options": {
                        "reports": { "save": false },
        
                        "txtTitle": Title,
        
        
                        "sql": rptSQL,//fQuery,
                        "Criteria": lblcriteria,
        
                        "txtregions": regions,
                        "txtstfgroups": stfgroups,
                        "txtstaffteams": staffteams,
                        "txtStaffs": Staffs,
                        "txtprograms": programs,
                        "txtRosterCategories": RosterCategories,
                        "txtHACCCategories": HACCCategories,
                        "txtmdsagency": mdsagency,
                        "txtAge_ATSI": Age_ATSI,
                        "txtDatetypes": Datetypes,
                        "txtmanagers": managers,
                        "txtfundingsource": fundingsource,
                        "txtOutletID": OutletID,
                        "txtstatuscat": statuscat,
                        "txtrecipients": recipients,
                        "txtstafftypes": stafftypes,
                        "txtpaytypes": paytypes,
                        "txtactivities": activities,
                        "txtsetting": setting,
                        "userid": this.tocken.user,
        
                        "includeFinancials":this.inputForm.value.InclFinancials,
                        "Excludeheader":this.inputForm.value.ExcluPgeHeader,
                    }
                }
        
                this.loading = true;
                

                this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = Title + ".pdf"
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
    insertAwardroster(tempsdate, tempedate){
        var sql = " INSERT INTO Award_Roster_mufee (Award, RecordNo, [Date], [Start Time], Duration, PayType, RuleType, " +
            " Program, Activity, Activity_Type, JobType, InfoOnly, NoOver, Ros_Day ) " +
            " SELECT Award,Recordno, [Date], " +
            " LEFT(CONVERT(VARCHAR,sTime,108),5) AS [Start Time], " +
            "  DATEDIFF(N,sTime,eTime)/5.0 AS Duration, Paytype,RuleType,Program, " +
            "  [Service Type], [Type], JobType, InfoOnly, NoOvertimeAccumulation, ROS_DAY From ( " +
            "  SELECT DENSE_RANK() OVER(PARTITION BY R.RecordNo, R.[DATE], R.[Start Time] ORDER BY "+ 
            "  CASE WHEN LEFT(DAYTYPE,1) = 'P' THEN 4 WHEN LEFT(DAYTYPE,1) = 'W' THEN 2 " +
            "     WHEN ISNULL(DAYTYPE,'') = '' THEN 1 ELSE 3 END DESC ) AS RANKING, " +
            " R.Award, R.Recordno, R.[Date], R.[Start Time], Duration, T.StartTime, T.EndTime, T.RecordNo AS TRecNo," +
            " CASE WHEN PayAsRostered = 1 OR ExcludeFromTimebands = 1 OR PAR = 1 THEN [Service Description] ELSE T.PayType End As PayType, " +
            " CASE WHEN PayAsRostered = 1 OR ExcludeFromTimebands = 1 OR PAR = 1 THEN Shift_Start_Time ELSE " +
            " CASE WHEN StartTime > Shift_Start_Time THEN StartTime ELSE Shift_Start_Time END END AS sTime, " +
            " CASE WHEN PayAsRostered = 1 Or ExcludeFromTimebands = 1 OR PAR = 1 THEN Shift_End_Time ELSE " +
            " CASE WHEN EndTime > Shift_End_Time THEN Shift_End_Time ELSE EndTime END END AS eTime, " +
            " CASE WHEN PayAsRostered = 1 OR PAR = 1 THEN 'Pay As Rostered' WHEN ExcludeFromTimebands = 1 THEN 'Timeband Exclude' ELSE 'Timeband' END AS RuleType, " +
            "  t.DayType,  Program, [Service Type], [TYPE], JOBTYPE, INFOONLY, NoOvertimeAccumulation, ROS_DAY " +
            " From ( SELECT R.Recordno, R.[Date], R.[Start Time], Duration," +
            " CONVERT(SMALLDATETIME,R.[Start Time]) AS Shift_Start_Time, " +
            "  DATEADD(N, Duration*5, CONVERT(SMALLDATETIME,R.[Start Time])) AS Shift_End_Time, " +
            " CASE WHEN ISNULL(D.User1,'') ='' THEN 32 ELSE D.USER1 END AS AWARD, " +
            " CASE WHEN PH.[DATE] IS NULL THEN DATENAME(w, R.[DATE]) ELSE 'Public Holiday' END As [ROS_DAY], " +
            " I.PayAsRostered , I.ExcludeFromTimebands, R.Program, R.[Service Type], [Service Description], " +
            " R.[TYPE], I.JOBTYPE, I.INFOONLY, I.NoOvertimeAccumulation, P.PayAsRostered As PAR " +
            "  FROM ROSTER R INNER JOIN STAFF S ON R.[CARER CODE] = S.ACCOUNTNO " +
            " INNER JOIN ItemTypes I ON R.[SERVICE TYPE] = I.TITLE AND ISNULL(I.JOBTYPE,'') <> 'EXCURSION' "  +
            " LEFT JOIN ItemTypes P ON R.[SERVICE DESCRIPTION] = P.TITLE AND P.PROCESSCLASSIFICATION = 'INPUT' " +
            " LEFT JOIN HUMANRESOURCES H ON R.STAFFPOSITION = H.RECORDNUMBER " +
            " LEFT JOIN DATADOMAINS D ON H.[NAME] = D.[DESCRIPTION] AND D.DOMAIN = 'STAFFPOSITION' " +
            " LEFT JOIN PUBLIC_HOLIDAYS PH ON R.[DATE] = PH.[DATE]" +
            " AND CONVERT(SMALLDATETIME,R.[Start Time]) < ISNULL(CONVERT(SMALLDATETIME,PH.[END TIME]),'1900/01/02') "+
            " AND DATEADD(N, Duration*5, CONVERT(SMALLDATETIME,R.[Start Time])) "+
            " > ISNULL(CONVERT(SMALLDATETIME,PH.[START TIME]),'1900/01/01') "+
            " AND ISNULL(PH.STATS,'') IN ('ALL','NSW','') "+
            " AND (ISNULL(PH.PublicHolidayRegion,'') = ISNULL(S.PublicHolidayRegion,'') "+
            " OR ISNULL(PH.PublicHolidayRegion,'') = '') "+
                "WHERE (R.DATE >= '"+tempsdate +"' AND R.DATE <='"+tempedate+"')  "
                //AND ([CARER CODE] > '!Z')  AND (R.[STATUS] >= '2') AND (R.[TYPE] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) OR (R.[TYPE] = 4 AND [CARER CODE] = '!INTERNAL')) AND [CARER CODE] <> '!MULTIPLE' AND ([SERVICE TYPE] <> 'CONTRIBUTION')"  +
                "AND [Carer Code] = '"+'ABFLAT GISELBERT'+"' "+
                "AND R.[Date] BETWEEN '"+tempsdate+"' AND '"+tempedate+"' "
                
                if (this.inputForm.value.NotAllocated == true){
                     sql = sql +" AND R.[Type] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) OR "
                }else{sql = sql + " AND R.[Type] IN(2, 5, 6, 7, 8, 9, 10, 11, 12) OR "}
                sql = sql +" ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL')) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION') "

                sql = sql +"AND ISNULL(I.ExcludeFromInterpretation,0) = 0 "+
                "AND ISNULL(P.ExcludeFromInterpretation,0) = 0 "+
                ") AS R  INNER JOIN TIMEBAND T ON T.AWARD = R.AWARD "+
                    "AND (( IsNull(PayAsRostered,0) = 0 AND IsNull(PAR,0) = 0 AND IsNull(ExcludeFromTimebands,0) = 0 "+
                    "AND (CONVERT(SMALLDATETIME,R.[Start Time]) < T.EndTime "+
                    "AND DATEADD(N, Duration*5, CONVERT(SMALLDATETIME,R.[Start Time])) > T.StartTime) "+
                    "AND ((ISNULL(DAYTYPE,'') = 'WEEKEND' AND LEFT(ROS_DAY,1) = 'S' ) "+
                    " OR (ISNULL(DAYTYPE,'') = 'WEEKDAY' AND LEFT(ROS_DAY,1) <> 'S') "+
                    "OR (ISNULL(DAYTYPE,'') = ROS_DAY ) "+
                    " OR ISNULL(DAYTYPE,'') = '' )) "+
                    "OR ((IsNull(PayAsRostered,0) = 1 OR IsNull(PAR,0) = 1 OR IsNull(ExcludeFromTimebands,0) = 1) and vRank = 1)) "+
                ") AS Final WHERE RANKING = 1 ORDER BY [Date], [START TIME] "


                
    }

    insert_Award_Roster_Rpt(tempsdate, tempedate){
       var str_sql =  " INSERT INTO AWARD_ROSTER_RPT ( [RecordNo],[Client Code],[Carer Code],[Service Type],[Service Description],[Program],[Date],[Start Time],[Duration],[Unit Pay Rate],[Unit Bill Rate],[YearNo],[MonthNo],[Dayno],[BlockNo],[Notes],[CarerPhone],[UBDRef],[Type],[Status],[Anal],[Date Entered],[Date Last Mod],[Date Timesheet],[Date Invoice],[Date Payroll],[InvoiceNumber],[TimesheetNumber],[Batch#],[Transferred],[GroupActivity],[BillType],[BillTo],[CostUnit],[CostQty],[HACCType],[HACCID],[BillUnit],[BillQty],[TaxPercent],[TaxAmount],[Link],[Tagged],[UniqueID],[ServiceSetting],[xDeletedRecord] )SELECT  R.[RecordNo],R.[Client Code],R.[Carer Code],R.[Service Type],CASE WHEN A.PayType IS NULL THEN R.[Service Description] ELSE A.PAYTYPE END ,R.[Program],R.[Date],CASE WHEN A.[Start Time] IS NULL THEN R.[Start Time] Else A.[Start Time] End ,CASE WHEN A.Duration IS NULL THEN R.[Duration] ELSE A.Duration END ,CASE WHEN A.PayType IS NULL THEN R.[Unit Pay Rate] ELSE I.Amount END ,R.[Unit Bill Rate],R.[YearNo],R.[MonthNo],R.[Dayno],R.[BlockNo],R.[Notes],R.[CarerPhone],R.[UBDRef],R.[Type],R.[Status],R.[Anal],R.[Date Entered],R.[Date Last Mod],R.[Date Timesheet],R.[Date Invoice],R.[Date Payroll],R.[InvoiceNumber],R.[TimesheetNumber],R.[Batch#],R.[Transferred],R.[GroupActivity],R.[BillType],R.[BillTo],R.[CostUnit],Case When ISNULL(I.Unit,'') = 'HOUR' AND R.[TYPE] <> 9 THEN ROUND(CAST(CASE WHEN A.Duration IS NULL THEN R.[Duration] ELSE A.Duration END  As FLOAT)/12,2) ELSE R.CostQty END ,R.[HACCType],R.[HACCID],R.[BillUnit],R.[BillQty],R.[TaxPercent],R.[TaxAmount],R.[Link],R.[Tagged],R.[UniqueID],R.[ServiceSetting],0 FROM STAFF S INNER JOIN ROSTER R ON S.ACCOUNTNO = R.[CARER CODE] LEFT JOIN [Award_Roster_Mufee] A ON A.RECORDNO = R.RECORDNO LEFT JOIN ITEMTYPES I ON I.TITLE = A.PAYTYPE AND I.PROCESSCLASSIFICATION = 'INPUT' " 
        "WHERE (R.DATE >= '"+tempsdate+"' AND R.DATE <='"+tempedate+"')  AND ([CARER CODE] > '!Z')  AND (R.[STATUS] >= '2') "
        "AND (R.[TYPE] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) OR (R.[TYPE] = 4 AND [CARER CODE] = '!INTERNAL')) AND [CARER CODE] <> '!MULTIPLE' AND ([SERVICE TYPE] <> 'CONTRIBUTION')  AND [CARER CODE] = '"
        +'ABFLAT GISELBERT'+ //RUN TIME VALUE
        "'AND (A.RECORDNO IS NOT NULL OR R.[TYPE] = 9)  "
    }

    StaffServiceNotesRegister(branch,Staff , casenotecat, startdate, enddate, tempsdate, tempedate) {

    
        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(S.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, S.AccountNo AS StaffCode, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail, format(Convert (datetime,History.DetailDate,22),'dd/MM/yyyy MM:HH tt') AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Roster Ro INNER JOIN History ON  CONVERT(varchar,Ro.RecordNo,100) = History.PersonID Left Join STAFF as S ON S.AccountNo = Ro.[Carer Code]  LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON S.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON S.UNIQUEID = P.PERSONID WHERE  "
        var lblcriteria;

        // History. DetailDate Between '07-01-2021' AND '07-31-2021 23:59:59'' 
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (History. DetailDate Between '" + tempsdate + ("' AND '") + tempedate + "' )";
            if (this.s_DateSQL != "") { fQuery = fQuery + "  " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "S.[STF_DEPARTMENT]  in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
         
        if (casenotecat != "") {
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','") + "')";
            if (this.s_CaseNoteSQL != "") { fQuery = fQuery + " AND " + this.s_CaseNoteSQL };
        }

        if (Staff != "") {
            this.s_StaffSQL = "[AccountNo] in ('" + Staff.join("','") + "')";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }
         




        
        if (Staff != "") {
            lblcriteria = " Staff: " + Staff.join(",") + "; "
        }
        else { lblcriteria = "All Staff," }
        if (startdate != "") {
            lblcriteria = lblcriteria + " Date Between " + startdate + " and " + enddate + "; "
        }
        else { lblcriteria = lblcriteria + " All Dated " }
        
        if (branch != "") {
            lblcriteria = lblcriteria + "Branches:" + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }

        if (casenotecat != "") {
            lblcriteria = " Case Notes: " + casenotecat.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Case Notes," }
                          
        fQuery = fQuery + " AND ExtraDetail1 = 'SVCNOTE'  AND [CARER CODE] > '!Z' AND [CLIENT CODE] IN ('!INTERNAL', '!MULTIPLE') AND (History.DeletedRecord = 0) "
        fQuery = fQuery + " ) ROP ORDER BY ROP.[StaffName], ROP.DateCreated "

        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "D9xN7c09VjMDjdaz" },
            "options": {
                "reports": { "save": false },
                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Service Notes Register.pdf"
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

labelfilter(fQuery,rptid,RptTitle,inclusion,lblcriteria){
    this.ModalS.confirm({
        nzTitle: 'TRACCS',
        nzContent: 'Do you want to EXCLUDE labels without Address?',
        nzOkText:'Yes',
        nzCancelText:'No',

        
        nzOnOk: () => {
            
           if(this.btnid.substr(0,10) != 'btn-staff-' && this.btnid != 'btn-FORPT-'){
            fQuery = fQuery + " AND  (R.Address1 <> '' OR R.Address2 <> '') "
            fQuery =    " Select Distinct Title,FirstName + ' ' + [Surname/Organisation] as AccountNo,Address1,Address2,Suburb,Postcode,[Surname/Organisation],FirstName from  (" + fQuery + " )cr Order by [Surname/Organisation],FirstName "
           }else{
            fQuery = fQuery + " AND  (s.Address1 <> '' OR s.Address2 <> '') "
            fQuery = "Select Distinct Title,FirstName + ' ' + LastName  as AccountNo,LastName,Address1,Address2,Suburb,Postcode from  (" + fQuery + " )cr Order by LastName"      
           }
        //   console.log(fQuery)
            this.drawerVisible = true;   
            
            this.loading = true;
           

            const data = {
                "template": { "_id":  rptid },
                "options": {
                    "reports": { "save": false },
    
                    "sql": fQuery,
                    "include": inclusion, 
                    "Criteria": lblcriteria,
                    "userid": this.tocken.user,
                }
            }
            this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = RptTitle 
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
             
                 },
        nzOnCancel: () => {
             
            if(this.btnid.substr(0,10) != 'btn-staff-' && this.btnid != 'btn-FORPT-'){
                fQuery =    " Select Distinct Title,FirstName + ' ' + [Surname/Organisation] as AccountNo,Address1,Address2,Suburb,Postcode,[Surname/Organisation],FirstName from  (" + fQuery + " )cr Order by [Surname/Organisation],FirstName "
               }else{
                fQuery = "Select Distinct Title,FirstName + ' ' + LastName  as AccountNo,LastName,Address1,Address2,Suburb,Postcode from  (" + fQuery + " )cr Order by LastName"      
               }
            //   console.log(fQuery)
            this.drawerVisible = true;   
            this.loading = true;
           

            const data = {
                "template": { "_id":  rptid },
                "options": {
                    "reports": { "save": false },
    
                    "sql": fQuery,
                    "include": inclusion, 
                    "Criteria": lblcriteria,
                    "userid": this.tocken.user,
                }
            }
            
           this.printS.printControl(data).subscribe((blob: any) => {
            this.pdfTitle = RptTitle 
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
             
        },
        

      });
}

CustomReportSetting(){
    
     
   let temp = forkJoin([
        this.ReportS.GetReportNames('AGENCYSTFLIST') ,                        
        this.ReportS.GetReportNames('AGENCYLIST'),
        this.ReportS.GetReportNames('USERLIST'),
        this.ReportS.GetReportNames('USERSTFLIST'),
        this.listS.GetRptFilters()
    ]) 
    temp.subscribe(data => {       
        this.AGENCYSTFButtonlist = data[0];
        this.UserRptButtonlist = data[1] ;
        this.RecpUserRptButtonlist = data[2];
        this.UserSTFButtonlist = data[3];

    //    this.viewfilters = data[4];

    
    });
    
        this.frm_CustomRptbtn = true;
     //   console.log(this.viewfilters)
        
   
   
} 

FetchRuntimeReport(strtitle){
//    console.log("TITLE:  " +strtitle)
    this.tryDoctype = ""; 
    this.drawerVisible = true; 
    this.loading = true;
    var strFilter = strtitle.toString().substring(0,1)
  //  console.log(strFilter)
    var title = strtitle.toString().substring(1,strtitle.length)
    
    switch (strFilter) {
        case 1:
            var format = 'AGENCYLIST'                        
            break;        
        case 2:
            var format = 'USERLIST'        
            break;
        case 3:
            var format = 'AGENCYSTFLIST'            
            break;
        case 4:
            var format = 'USERSTFLIST'            
            break;    
        default: 
            break;
    }
  const temp =  forkJoin([
    //    this.ReportS.GetReportFormat(title),
    
        this.ReportS.GetReportSql(title)
    ]);    
    temp.subscribe(data => {
        //this.UserRptFormatlist = data[0];
        this.UserRptSQLlist = data[0];   
        var re = /~/gi;    
     //   console.log((this.UserRptSQLlist.toString()).replace(re,"'"))
    
        this.RenderRunTimeReport((this.UserRptSQLlist.toString()).replace(re,"'"))

    });
    
    



}
RenderRunTimeReport(strSQL){
  //  console.log(strSQL)
    const data = {
        
        //"template": { "_id": "qTQEyEz8zqNhNgbU" },
        "template": { "_id": "x8QVE8KhcjiJvD6c" },
                    
        "options": {
            "reports": { "save": false },
            
            "sql": strSQL,            
            "userid": this.tocken.user,
            
            
        }
    }
    this.loading = true;
    

    this.printS.printControl(data).subscribe((blob: any) => {
        this.pdfTitle = "User Custom Report.pdf"
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


} //ReportsAdmin
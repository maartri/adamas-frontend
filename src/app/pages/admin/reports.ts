import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl,FormArray, } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import {  ViewEncapsulation } from '@angular/core';
import { ListService, states, TimeSheetService } from '@services/index';
import * as FileSaver from 'file-saver';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO'
import { EventInputTransformer } from '@fullcalendar/angular';
import { getDate } from 'date-fns';
import { now } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Router} from '@angular/router';

//Sets defaults of Criteria Model
const inputFormDefault = {
    statesArr: [[]],
    allState: [true],

    branchesArr: [[]],
    allBranches: [true],

    serviceRegionsArr: [[]],
    allServiceRegion:[true],

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
    allSvctypes: [true] ,
   
    vehiclesArr:[[]],
    allVehicles:[true],

    itemArr:[[]],
    allItems:[true],

    planArr:[[]],
    allPlans:[true],

    caredomainArr:[[]],
    allCareDomains:[true],

    casenotesArr:[[]],
    allCaseNotes:[true],

    disciplineArr:[[]],
    allDisciplines:[true],

    recipientArr:[[]],
    allRecipients:[true],
    
    CompetenciesArr:[[]],
    allCompetencies:[true],

    staffteamArr:[[]],
    allStaffTeams:[true],

    competeciesgroupArr:[[]],
    allCompetenciesGroup:[true],
    
    cycleArr:[[]],
    cycles:[true],     
    
    stafftypeArr:[[]],
    allStafftype:[true],

    rostertypeArr:[[]],
    allRostertypes:[true],

    trainingtypeArr:[[]],
    alltrainingtype:[true],    

    traccsuserArr:[[]],
    alltraccsusers:[true],

    agencyidArr:[[]],
    allagencies:[true],

    mdstypeArr:[[]],
    allmdsypes:[true],

    paytypeArr:[[]],
    allpaytypes:[true],

    activityArr:[[]],
    allactivities:[true],

    settting_vehicleArr:[[]],
    Allsettting_vehicle:[true],

    incidentcategoryArr:[[]],
    allIncidentcategory:[true],
   
    OPnotesArr:[[]],
    allOPNotes:[true],

    hrnotesArr:[[]],
    allhrNotes:[true],
    
    whowhat:[],    

    description:[],
    

    RecipientLeave : [true],   
    RecipientUR :  [true],
    DBO :  [false],
    splitonHyphen :  [false], 
    allowances  :  [false],
    InternalCost:   [false],
    NotAllocated  : [true],
    InfoOnly  : [true],
    XtraInfo : [false],
    InclFinancials: [false],
    ExcluPgeHeader: [false],
    radioFormat: ['Summary'],

    DatetypeArr:[[]],
    statuscategoryArr:[[]],
    branchprimacyArr:[[]],
    AGE_ATSI_StatusArr:[[]],
    
  



}

@Component({
    host: {
        '[style.display]': 'flex',
        '[style.flex-direction]': 'column',
        '[style.overflow]': 'hidden'
      },
    styles: [`
        
        button {
            width: 200pt !important;
            text-align: left !important;
        }
        .inner-content{
            padding: 0px !important;
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
        label{
            font-weight: bold; 
        }
        
        .form-group label{
            font-weight: bold;
        }
        nz-select{
            width:100%;
            x
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
        
    `],
    templateUrl: './reports.html'
})


export class ReportsAdmin implements OnInit, OnDestroy, AfterViewInit {
    
    validateForm!: FormGroup;
    
    //Modals visibility
    isVisibleTop = false;
    FOReports = false;

    tabset = false;
    showtabother = false;
    showtabRostcriteria= false;
    showtabstaffcriteria= false;
    showtabRegcriteria= false;
    showtabrecpcriteria = false;
    
    //Financial Output Criteri ##EXTRA OPTIONS##
    show =false ;
    showoption = true;
    
    // 
     
    frm_Date :boolean ;
    frm_Programs :boolean ;  
    frm_Branches :boolean ;
    frm_Managers :boolean ;
    frm_Categories :boolean;
    frm_SVCTypes :boolean;
    frm_vehicles :boolean;
    frm_Incidents:boolean;
    frm_Incidentcategories:boolean;
    frm_Staff  :boolean;
    frm_Recipients :boolean;
    frm_Items :boolean;
    frm_PlanTypes :boolean;
    frm_CareDomain :boolean;
    frm_CaseNots :boolean;
    frm_Disciplines :boolean;    
    frm_StaffGroup :boolean;
    frm_CompetenciesGroups :boolean;
    frm_StaffTeam :boolean;
    frm_Competencies :boolean;
    frm_StaffType :boolean;
    frm_Description  :boolean;      
    frm_TrainingType :boolean;
    frm_MasterRosterCycles :boolean;
    frm_TraccsUsers :boolean;
    frm_Funders :boolean;
    frm_SVCProviders :boolean;
    frm_Outlets:boolean;
    frm_WhoWhat:boolean;
    frm_HRNotes :boolean;
    frm_OPNotes:boolean;
    


    RecipientLeave : [true];   
    RecipientUR :  [true];
    DBO :  [false];
    splitonHyphen :  [false];
    allowances  :  [false];
    InternalCost:   [false];
    NotAllocated  : [true];
    InfoOnly  : [true];
    XtraInfo : [false];
    InclFinancials: [false];
    ExcluPgeHeader: [false];
    radioFormat: ['Summary'];



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
    cycleArr: Array<any> = ['Cycle 1','Cycle 2','Cycle 3','Cycle 4','Cycle 5','Cycle 6','Cycle 7','Cycle 8','Cycle 9','Cycle 10'];
    stafftypeArr: Array<any> = ['BROKERAGE ORGANISATION','STAFF','VOLUNTEER']
    trainingtypeArr: Array<any> = []; 
    traccsuserArr: Array<any> = []; 
    rostertypeArr: Array<any> = ['BOOKINGS','ADMISSION SERVICES','DIRECT CARE','SLEEPOVERS','BROKERAGE','TRANSPORT','MEALS','CENTRE BASED ACTIVITIES','GROUP BASED ACTIVITIES','TRAVEL TIME','LEAVE/ABSENCE','ADMINISTRATION','ALLOWANCES'];
    mdstypeArr: Array<any> = []; 
    agencyidArr: Array<any> = []; 
    paytypeArr: Array<any> = []; 
    activityArr: Array<any> = [];  
    settting_vehicleArr: Array<any> = [];    
    OPnotesArr: Array<any> = [];  
    hrnotesArr: Array<any> = [];
    DatetypeArr: Array<any> = ['Billing Date' , 'Pay Period EndDate' , 'Service Date'];
    statuscategoryArr: Array<any> = ['All services','Approved Services Only','UnApproved Services Only'];
    branchprimacyArr: Array<any> = ['Automatic','Recipient Branch Overrides ','Staff Branch Overrides '];
    AGE_ATSI_StatusArr: Array<any> = ['Over 64 OR ATSI Over 49   ','Under 65 OR ATSI under 50'];
    incidentcategoryArr: Array<any> = ['Open' , 'Close' ];
    


    whowhat:string; 
    description:string;  
    
    ModalName :string;
    btnid:string;
    id:string ;
    tryDoctype: any;
    pdfTitle: string;
    s_BranchSQL:string;
    s_CoordinatorSQL:string;
    s_ProgramSQL:string;
    s_CategorySQL:string;
    s_DateSQL:string;    
    s_StfGroupSQL:string;
    s_StfSQL:string;
    s_RecipientSQL:string;
    s_IncedentTypeSQL:string;
    s_SvcTypeSQL:string;
    s_incidentCategorySQL:string;
    s_loanitemsSQL:string;
    s_loancategorySQL:string;
    s_StaffSQL:string;
    s_CompetencyGroupSQL:string;
    s_CompetencySQL:string;
    s_StfTeamSQL:string;
    s_StafftypeSQL:string;
    s_PlantypeSQL:string;
    s_CaseNoteSQL:string;
    s_CareDomainSQL:string;
    s_DisciplineSQL:string;
    s_TrainingTypeSQL:string;
    s_whowhatSQL:string; 
    s_DescribeSQL:string;
    s_TraccsuserSQL:string;
    s_AgeSQL:string;    
    s_MdsAgencySQL:string;  
    s_RosterCategorySQL:string;   
    s_FundersSQL :string; 
    s_DatetypeSQL:string;  
    s_OutletIDSQL:string;
    s_HACCCategorySQL:string;
    s_statusSQL:string;
    s_paytypeSQL:string;
    s_activitySQL:string;
    s_setting_vehicleSQL:string;
    reportid:string;

   
    dateFormat: string = 'yyyy-MM-dd'   
    enddate :Date;
    startdate :Date;
 //   enddate: string ;
 //   startdate: string ;
    //format(new Date(), 'yyyy-MM-dd');

    rpthttp = 'http://45.77.37.207:5488/api/report';
 // rpthttp = 'http://127.1.1.1:5488/api/report';
  
    dropDownArray: any = {
        branches: Array,
        serviceRegions: Array,
        managers: Array,
        programs:Array,
        
    }

    inputForm: FormGroup;   
    drawerVisible: boolean = false;
    

    listOfOption: Array<{ label: string; value: string }> = [];
    multipleValue = ['a10', 'c12'];
   
    
    constructor(
        private formBuilder: FormBuilder,
        private listS: ListService,
        private TimesheetS: TimeSheetService,
        private http: HttpClient,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private ModalS:NzModalService,
        private router: Router
    ) {
       
    }
    ngOnInit(): void {
        const children: Array<{ label: string; value: string }> = [];

        for (let i = 10; i < 36; i++) {
            children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
            
        }
        


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

    this.inputForm.get('allmdsypes').valueChanges.subscribe(data => {
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
        this.listS.GetRecipientAll().subscribe(x => this.recipientArr = x);
        this.listS.Getrpttraccsuser().subscribe(x => this.traccsuserArr = x);
        this.listS.Getrptagencyid().subscribe(x => this.agencyidArr = x);
        this.listS.Getrptmdstype().subscribe(x => this.mdstypeArr = x);
        this.listS.Getrptpaytype().subscribe(x => this.paytypeArr = x);  
        this.listS.Getrptactivity().subscribe(x => this.activityArr = x);
         	


        this.listS.getreportcriterialist({
            listType: 'PROGRAMS',
            includeInactive: false
        }).subscribe(x => this.programsArr = x);

        this.listS.getreportcriterialist({
            listType: 'BRANCHES',
            includeInactive: false
        }).subscribe(x => this.branchesArr = x);

        this.listS.getcasenotecategory(0).subscribe(x => this.casenotesArr = x);
        this.listS.getcasenotecategory(1).subscribe(x => this.OPnotesArr = x);
        this.listS.Getrptincidents().subscribe(x => this.incidentArr = x);
        this.listS.GetrptLoanItems().subscribe(x => this.itemArr = x);
        this.listS.getstaffdiscipline().subscribe(x => this.disciplineArr = x )
        this.listS.getstaffcaredomain().subscribe(x => this.caredomainArr = x )
        this.listS.getserviceregion().subscribe(x => this.serviceRegionsArr = x )
        this.listS.Getrptcasenotes().subscribe(x => this.casenotesArr = x )
        this.listS.Getrptiplantypes().subscribe(x => this.planArr = x )
        this.listS.GetTraccsStaffCodes().subscribe(x => this.staffArr = x )        
        this.listS.GetCopetencyGroup().subscribe(x => this.competeciesgroupArr = x )
        this.listS.getliststaffteam().subscribe(x => this.staffteamArr = x )
        this.TimesheetS.getcompetenciesall().subscribe(x => this.CompetenciesArr = x )
        this.listS.Getrpttrainingtype().subscribe(x => this.trainingtypeArr = x )
        this.listS.Getrptsettings_vehicles().subscribe(x => this.settting_vehicleArr = x )
        

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
    ResetVisibility(){
        this.frm_Date =false;
    this.frm_Programs =false;
    this.frm_Branches =false;
    this.frm_Managers =false;
    this.frm_Categories =false;
    this.frm_SVCTypes =false;
    this.frm_vehicles =false;
    this.frm_Incidents=false;
    this.frm_Incidentcategories=false;
    this.frm_Staff  =false;
    this.frm_Recipients =false;
    this.frm_Items =false;
    this.frm_PlanTypes =false;
    this.frm_CareDomain =false;
    this.frm_CaseNots =false;
    this.frm_Disciplines =false;
    this.frm_StaffGroup =false;
    this.frm_CompetenciesGroups =false;
    this.frm_StaffTeam =false;
    this.frm_Competencies =false;
    this.frm_StaffType =false;
    this.frm_Description  =false;
    this.frm_TrainingType =false;
    this.frm_MasterRosterCycles =false;
    this.frm_TraccsUsers =false;
    this.frm_Funders =false;
    this.frm_SVCProviders =false;
    this.frm_Outlets=false;
    this.frm_WhoWhat=false;
    this.frm_HRNotes =false;
    this.frm_OPNotes=false;
    this.ModalName = " CRITERIA "
    }
    toggle(){
        this.show = !this.show;
        this.showoption = !this.showoption ;
    }
    showUserReport(){
        
      //  this.router.navigate(['/admin/user-reports']);       
    }
    showModal(e){
            e = e || window.event;
            e = e.target || e.srcElement; 
            this.btnid = e.id
            this.ModalS.closeAll();
            var lftstr = e.id.substring(0,10)
        //    alert(lftstr)
        
        //Criteria Items/Lists Visibility   
        this.ResetVisibility();
        switch(this.btnid){
            case 'btn-refferallist' :
                this.ModalName = "REFERRAL LIST CRITERIA"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-activepackagelist' :
                this.ModalName = "ACTIVE PACKAGE CRITERIA"                
                this.frm_Date = true;
                this.frm_Programs = true;
                this.frm_Funders = true;
                 break;
            case 'btn-recipientroster':
                this.ModalName = "RECIPIENT ROSTER CRITERIA"
                this.frm_Date = true;                
                this.frm_Recipients = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;            
                break;
            case 'btn-suspendedrecipient':
                this.ModalName = "SUSPENDED RECIPIENT REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-vouchersummary':
                this.ModalName = "VOUCHER SUMMARY REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Recipients = true;
                this.frm_Programs = true;
                break;
            case 'btn-packageusage':
                this.ModalName = "PACKAGE USAGE REPORT CRITERIA"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-timelength':
                this.ModalName = "RECIPIENTS TIME LENGTH REPORT"
                this.frm_Date = true;                
                break;
            case 'btn-unallocatedbookings':
                this.ModalName = "UNFILLED BOOKINGS REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_SVCTypes = true;
                break;
            case 'btn-transportsummary':
                this.ModalName = "TRANSPORT SUMMARY REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_vehicles = true;
                break;
            case 'btn-refferalduringperiod':
                this.ModalName = " REFERRALS DURING PERIOD"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;
                this.frm_Categories = true;
                break;
            case 'btn-recipientMasterroster':
                this.ModalName = "RECIPINT MASTER ROSTER CRITERIA"
                this.frm_MasterRosterCycles = true;
                this.frm_Recipients = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-activerecipient':
                this.ModalName = "ACTIVE RECIPIENT REPORT"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-inactiverecipient':
                this.ModalName = "ACTIVE RECIPIENT REPORT"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-adminduringperiod':
                this.ModalName = "ADMISSIONS DURING PERIOD REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;
                this.frm_Categories = true;
                break;
            case 'btn-dischargeduringperiod':
                this.ModalName = "DISCHARGES DURING PERIOD"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;

                break;
            case 'btn-absentclient':
                this.ModalName = "ABSENT CLIENT STATUS REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Managers = true;
                this.frm_Programs = true;
                this.frm_Categories = true;
                break;
            case 'btn-careerlist':
                this.ModalName = "CARER LIST CRITERIA"
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-onlybillingclients':
                this.ModalName = "ONLY BILLING CLIENTS REPORT"
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-associatelist':
                this.ModalName = "ASSOCIATE LIST CRITERIA"                
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;
                break;
            case 'btn-unserviced':
                this.ModalName = "UNSERVICED RECIPIENTS REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                
                break;
            case 'btn-staff-Activestaff':
                this.ModalName = "ACTIVE STAFF REPORT"
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_Managers = true;
                break;
            case 'btn-staff-ActiveBrokerage':
                this.ModalName = "ACTIVE BROKERAGE REPORT"
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_Managers = true;
                break;
            case 'btn-staff-Activevolunteers':
                this.ModalName = "ACTIVE VOLUNTEERS REPORT"
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                this.frm_Managers = true;
                break;
            case 'btn-staff-InactiveBrokerage':
                this.ModalName = "INACTIVE BROKERAGE REPORT"
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-staff-InactiveVolunteer':
                this.ModalName = "INACTIVE VOLUNTEER REPORT"
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-staff-Inactivestaff':
                this.ModalName = "INACTIVE STAFF CRITERIA"
                this.frm_Branches = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-staff-Userpermissions':
                this.ModalName = "STAFF USER PERMISSIONS"
                this.frm_Branches = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-Regis-mealregisterreport':
                this.ModalName = "MEAL ORDER REPORT"
                this.frm_Date = true;
                this.frm_Recipients = true;
                break;
            case 'btn-Regis-hasreport':
                this.ModalName = "HAS REPORT CRITERIA"
                this.frm_Date = true;                
                this.frm_Programs = true;
                break;
            case 'btn-Regis-cdcleavereport':
                this.ModalName = "CDC LEAVE REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Programs = true;
                break;
            case 'btn-Regis-cdcpackagebalance':
                this.ModalName = "CDC PACKAGE BALANCE REPORT"
                this.frm_Date = true;
                this.frm_Recipients = true;
                this.frm_Programs = true;
                break;
            case 'btn-Regis-incidentregister':
                this.ModalName = "INCIDENT REGISTER"
                this.frm_Date = true;                
                this.frm_Branches = true;
                this.frm_SVCTypes = true;
                this.frm_Staff = true; 
                this.frm_Incidentcategories = true;
                this.frm_Incidents = true;  
                
                break;
            case 'btn-Regis-loanregister':
                this.ModalName = "LOAN REGISTER"
                this.frm_Date = true; 
                this.frm_Branches = true; 
                this.frm_Programs = true; 
                this.frm_Recipients = true; 
                this.frm_Items = true; 
                this.frm_Categories = true; 
                break;
            case 'btn-staff-leaveregister':
                this.ModalName = "LEAVE REGISTER"
                this.frm_Date = true;
                break;
            case 'btn-staff-staffnotworked':
                this.ModalName = "STAFF NOT WORKED REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-staff-competencyrenewal':
                this.ModalName = "COMPETENCY RENEWAL REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_Competencies = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;
                this.frm_CompetenciesGroups = true;
                break;
            case 'btn-staff-unavailability':
                this.ModalName = "STAFF UNAVAILABILITY REPORT"
                this.frm_Date = true;
                this.frm_Staff = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-staff-Roster':
                this.ModalName = "STAFF ROSTER CRITERIA"
                this.frm_Date = true;
                this.frm_Staff = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-staff-MasterRoster':
                this.ModalName = "STAFF MASTER ROSTER"
                this.frm_MasterRosterCycles = true;
                this.frm_Staff = true;
                this.frm_Branches = true;
                this.frm_StaffType = true;
                this.frm_StaffGroup = true;
                break;
            case 'btn-staff-loanregister':
                this.ModalName = "lOAN REGISTER CRITERIA"
                this.frm_Date = true; 
                this.frm_Branches = true; 
                this.frm_Programs = true;
                this.frm_Staff = true;
                this.frm_Items = true;
                this.frm_StaffGroup = true; 
                break;
            case 'btn-Regis-progcasenotes':
                this.ModalName = "RECIPIENT CASE/PROGRESS NOTES CRITERIA  "
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
                this.ModalName = "SERVICE NOTES CRITERIA"
                this.frm_Date = true; 
                this.frm_Branches = true; 
                this.frm_CaseNots = true; 
                this.frm_Recipients = true; 
                this.frm_Disciplines = true; 
                this.frm_CareDomain = true; 
                this.frm_Programs = true;
                break;
            case 'btn-Regis-opnotesregister':
                this.ModalName = "OP NOTES CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_OPNotes = true; 
                this.frm_Recipients = true;
                this.frm_Disciplines = true;
                this.frm_CareDomain = true;
                this.frm_Programs = true;

                break;
            case 'btn-Regis-careplanstatus':
                this.ModalName = "CARER PLAN STATUS REPORT"
                this.frm_Date = true;
                this.frm_PlanTypes = true;
                this.frm_Recipients = true;
                break;
            case 'btn-staff-availability':
                this.ModalName = "STAFF AVAILABILITY REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;                 
                this.frm_Staff = true;
                break;
            case 'btn-staff-timeattandencecomp':
                this.ModalName = "MTA COMPARISON REPORT"
                this.frm_Date = true;
                this.frm_Branches = true;                 
                this.frm_Staff = true;
                break;
            case 'btn-staff-hrnotesregister':
                this.ModalName = "HR NOTES CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_HRNotes = true; 
                this.frm_Staff = true;
                break;
            case 'btn-staff-opnotes':
                this.ModalName = "STAFF OP NOTES REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_OPNotes = true; 
                this.frm_Staff = true;
                this.frm_Disciplines = true;
                this.frm_CareDomain = true;
                this.frm_Programs = true;
                break;
            case 'btn-staff-incidentregister':
                this.ModalName = "INCIDENT REGISTER CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_SVCTypes = true;
                this.frm_Staff = true;
                this.frm_StaffGroup = true;
                this.frm_Incidents = true;
                break;
            case 'btn-staff-training':
                this.ModalName = "STAFF TRAINING REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_Programs = true;
                this.frm_TrainingType = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_StaffTeam = true;
                
                break;
            case 'btn-competenciesrenewal':
                this.ModalName = "COMPETENCIES RENEWAL REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Staff = true;
                this.frm_Competencies = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;
                this.frm_CompetenciesGroups = true;
                break;
            case 'btn-Systm-AuditRegister':
                this.ModalName = "AUDIT REGISTER REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_TraccsUsers = true;                 
                this.frm_WhoWhat = true;
                this.frm_Description = true;
                break;
            case 'btn-Systm-ActivityStatusAudit':
                this.ModalName = "PROGRAM ACTIVITY STATUS AUDIT REPORT"
                this.frm_Programs = true;
                break;
            case 'btn-Systm-MTARegister':
                this.ModalName = "MTA REGISTER CRITERIA CRITERIA"
                this.frm_Date = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_Recipients = true;
                this.frm_Staff = true;
                break;
            case 'btn-Systm-RosterOverlap':
                this.ModalName = "ROSTER OVERLAP REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Branches = true;
                this.frm_Recipients = true;
                this.frm_Staff = true;
                this.frm_Programs = true;
                break;
            case 'btn-Systm- MTAVerification':
                this.ModalName = "MTA VERIFICATION REPORT CRITERIA"
                this.frm_Date = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_StaffGroup = true;
                this.frm_Recipients = true;
                this.frm_Staff = true;
                break;  
            case 'btn-UnsedFunding':
                this.ModalName = "RECIPIENT UNUSED FUNDING REPORT CRITERIA"
                this.frm_Recipients = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                this.frm_Categories = true;                
                break;
                case 'btn-BudgetAuditReport':
                    this.ModalName = "PROGRAM BUDGET AUDIT REPORT CRITERIA"
                    this.frm_Branches = true;
                    this.frm_Programs = true;                                    
                    break;
                case 'btn-ProgramSummaryRpt' :
                    this.ModalName = "PROGRAM SUMMARY REPORT CRITERIA"
                    this.frm_Branches = true;
                    this.frm_Programs = true;
                    this.frm_Managers = true;
                    this.frm_Categories = true;
                    break;
                case 'btn-report-fundingAuditReport' :
                    this.ModalName = "FUNDING AUDIT REPORT CRITERIA"
                    this.frm_Date = true;                        
                    break;
                case 'btn-report-UnbilledItems':
                    this.ModalName = "UNBILLED ITEMS REPORT CRITERIA"
                    this.frm_Date = true;
                    this.frm_Branches = true;                    
                    this.frm_Programs = true;
                    this.frm_SVCTypes = true;
                    break;
                case 'btn-report-DatasetUnitCost':
                    this.ModalName = "DATASET RECIPIENT UNIT COST REPORT CRITERIA"
                    this.frm_Date = true;
                    this.frm_Recipients = true;                                        
                    this.frm_SVCTypes = true;
                    break;
            
            default://
              //  alert("Yet to do")
            
        }
        
        
         
        switch(lftstr){
                case 'btn-staff-':                    
                    this.isVisibleTop = true;
                    break;
                case 'btn-Regis-':                    
                    this.isVisibleTop = true;   
                    break;
                case 'btn-FORPT-': 
                    this.FOReports = true;                   
                
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
        console.log('onChange: ', result);}
    
    PrintID(e){
        e = e || window.event;
        e = e.target || e.srcElement; 
        this.btnid = e.id
     //   this.showModal();
     

        return this.btnid    
     //  
        
    }
    handleOk(){
        this.reportRender(this.btnid);
        this.tryDoctype = ""
        this.FOReports = false;
        
    }
    handleCancel(){
        this.inputForm.reset(inputFormDefault);
        this.FOReports = false;
    }

    handleOkTop() {
    //    console.log(this.inputForm.value)
    //    console.log(this.date)
    //    console.log(this.startdate)        
    //    console.log(this.enddate)        
        this.isVisibleTop = false;
        
    
    this.reportRender(this.btnid);
    this.tryDoctype = ""
     //   this.QueryFormatter(this.btnid);
    ///    this.goJSReport();

    }

    handleCancelTop(): void {
        this.inputForm.reset(inputFormDefault);
        this.isVisibleTop = false;
        this.drawerVisible = false;
    }       
        
    reportRender(idbtn){
      console.log(idbtn)
var endate ;
var strdate;
    //    var s_States = this.inputForm.value.statesArr;
        var s_Branches = this.inputForm.value.branchesArr;
        var s_Managers = this.inputForm.value.managersArr;
        var s_ServiceRegions = this.inputForm.value.serviceRegionsArr;
        var s_Programs = this.inputForm.value.programsArr;
        var s_StfGroup = this.inputForm.value.staffgroupsArr; 
        var s_Recipient = this.inputForm.value.recipientArr;
        var s_SvcType = this.inputForm.value.svcTypeArr;
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
        var s_OPCaseNotes = this.inputForm.value.opnotesArr;
        var s_HRCaseNotes ="";
        var s_TrainingType = this.inputForm.value.trainingtypeArr;
        var s_TraccsUser = this.inputForm.value.traccsuserArr;
        var s_who = this.whowhat;
        var s_Description = this.description;
        var s_RosterType = this.inputForm.value.rostertypeArr   


        var s_Funders = this.inputForm.value.fundersArr;
        var s_HACCCategory = this.inputForm.value.mdstypeArr;
        var s_Age = this.inputForm.value.AGE_ATSI_StatusArr;
        var s_DateType:string;
        s_DateType = this.inputForm.value.DatetypeArr;          
        var s_MdsAgencyID = this.inputForm.value.agencyidArr; 
        var s_OutLetID = this.inputForm.value.outletsArr;
        var s_Activity = this.inputForm.value.activityArr;
        var s_Settings_vehicle = this.inputForm.value.settting_vehicleArr;
        var s_PayType = this.inputForm.value.paytypeArr;
        var s_BranchPrimacy = this.inputForm.value.branchprimacyArr;
        var formating = this.inputForm.value.radioFormat;
    //    alert( "Formating "+ formating)
        //console.log(s_Stafftype) 
        
            var date = new Date();
            var temp_lftstr = idbtn.substring(0,10)
        
            if (this.startdate != null )
            { strdate = format(this.startdate,'yyyy-MM-dd')}else{
                //strdate = "2020-07-01"              
                strdate = format(new Date(date.getFullYear(), date.getMonth(), 1),'yyyy-MM-dd')
            

            } 
            if (this.enddate != null )
            { endate = format(this.enddate,'yyyy-MM-dd')}else{
            // endate = "2020-07-31"
            endate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0),'yyyy-MM-dd');
            }
            switch(temp_lftstr){
                case 'btn-staff-':                    
                    this.isVisibleTop = true;
                    break;
                case 'btn-Regis-':                    
                    this.isVisibleTop = true;   
                    break;
                case 'btn-FORPT-': 
                    if (this.startdate != null )
                    { strdate = format(this.startdate,'yyyy/MM/dd')}else{                                  
                        strdate = format(new Date(date.getFullYear(), date.getMonth(), 1),'yyyy/MM/dd')                   
                    } 
                    if (this.enddate != null )
                    { endate = format(this.enddate,'yyyy/MM/dd')}else{                  
                    endate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0),'yyyy/MM/dd');                  
                    }         
                    
                    break;
                case 'btn-report': 
                    if (this.startdate != null )
                    { strdate = format(this.startdate,'yyyy/MM/dd')}else{                                  
                        strdate = format(new Date(date.getFullYear(), date.getMonth(), 1),'yyyy/MM/dd')                   
                    } 
                    if (this.enddate != null )
                    { endate = format(this.enddate,'yyyy/MM/dd')}else{                  
                    endate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0),'yyyy/MM/dd');                  
                    }         
                    
                    break;
                default:
                        if (this.startdate != null )
                        { strdate = format(this.startdate,'yyyy-MM-dd')}else{
                            //strdate = "2020-07-01"              
                            strdate = format(new Date(date.getFullYear(), date.getMonth(), 1),'yyyy-MM-dd')
                        
            
                        } 
                        if (this.enddate != null )
                        { endate = format(this.enddate,'yyyy-MM-dd')}else{
                        // endate = "2020-07-31"
                        endate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0),'yyyy-MM-dd');
                        
                        }  
            }     

            
   
     
    // console.log(strdate)
        switch(idbtn){
            case 'btn-refferallist' :
                this.Refeeral_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-activepackagelist' :                
                this.ActivePackage_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);                  
                 break;
            case 'btn-recipientroster':
                 this.RecipientRoster(s_Branches,s_StfGroup,s_Recipient ,s_Stafftype,strdate,endate);
                break;
            case 'btn-suspendedrecipient':
                this.SuspendedRecipient(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-vouchersummary':
                this.VoucherSummary(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-packageusage':
                this.PackageUsage(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-timelength':
                this.RecipientTimeLength(strdate,endate);
                break;
            case 'btn-unallocatedbookings':
                this.UnallocatedBookings(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-transportsummary':
                this.TransportSummary(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-refferalduringperiod':
                this.RefferalsduringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-recipientMasterroster':

                switch (s_Cycle)
				{
  					case 'Cycle 1':
                        strdate = "01/01/1900";
                        endate = "28/01/1900";
                    break;
                    case"Cycle 2":
                        strdate = "01/10/1900";
                        endate = "28/10/1900";
                    break;
                    case'Cycle 3':
                        strdate = "01/04/1901";
                        endate = "28/04/1901";
                    break;
                    case'Cycle 4':
                        strdate ="01/07/1901";
                        endate = "28/07/1901";
                    break;
                    case'Cycle 5':
                        strdate = "01/09/1902";
                        endate = "28/09/1902";
                    break;
                     
                    case'Cycle 6':
                        strdate = "01/12/1902";
                        endate = "28/12/1902";
                    break;
                    case'Cycle 7':
                        strdate = "01/06/1903";
                        endate = "28/06/1903";
                    break;
                    case'Cycle 8':
                        strdate ="01/02/1904";
                        endate = "28/02/1904";
                    break;
                    case'Cycle 9':
                        strdate = "01/08/1904";
                     endate = "28/08/1904";
                    break;
                    case'Cycle 10':
                        strdate = "01/05/1905";
                        endate = "28/05/1905";
                    break;
                    default: 
                        strdate ="1900/01/01";
                        endate = "1900/01/28";
                        
                        break;
				}

                this.RecipientMasterRoster(s_Branches,s_StfGroup,s_Recipient ,s_Stafftype,strdate,endate);
                break;
            case 'btn-activerecipient':
                this.ActiveRecipientList(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-inactiverecipient':
                this.InActiveRecipientList(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-adminduringperiod':
                this.AdmissiionDuringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-dischargeduringperiod':
                this.DischargeDuringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-absentclient':
                this.AbsentClientStatus(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
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
                this.UnServicedRecipient(s_Branches, s_Managers, s_ServiceRegions, s_Programs,strdate,endate);
                break;
            case 'btn-staff-Activestaff':
                this.ActiveStaffListing(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-staff-ActiveBrokerage':
                this.ActiveBrokerage_Contractor(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-staff-Activevolunteers':
                this.ActiveVolunters(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-staff-InactiveBrokerage':
                this.InActiveBrokerage_Contractor(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-staff-InactiveVolunteer':
                this.InActiveVolunteers(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-staff-Inactivestaff':
                this.InActiveStaffListing(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-staff-Userpermissions':
                this.StaffPermissions(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;
            case 'btn-Regis-mealregisterreport':
                this.MealOrderReport(s_Recipient,strdate,endate);
                break;
            case 'btn-Regis-hasreport':
                this.HASReport(s_Programs,strdate,endate);
                break;
            case 'btn-Regis-cdcleavereport':
                this.CDCLeaveRegister(s_Branches, s_Programs,strdate,endate);
                break;
            case 'btn-Regis-cdcpackagebalance':
                this.CDCPackageBalanceReport(s_Recipient, s_Programs,strdate,endate);
                break;
            case 'btn-Regis-incidentregister':
                this.IncidentRegister(s_Branches,s_SvcType,s_Staff,s_incidenttype,s_Incidentcategory,strdate,endate)
                break;
            case 'btn-Regis-loanregister':
                this.LoanItemRegister(s_Branches,s_Programs,s_Recipient,s_LoanItems,s_ServiceRegions,strdate,endate)
                break;
            case 'btn-staff-leaveregister':
                this.StaffLeaveRegister(strdate,endate)
                break;
            case 'btn-staff-staffnotworked':
                this.StaffNotWorkedReport(s_Branches,s_StfGroup,s_Staff,strdate,endate)
                break;
            case 'btn-staff-competencyrenewal':
                this.StaffCompetencyRenewal(s_Branches,s_Staff,s_Competencies,s_Managers,s_StaffTeam,s_CompetencyGroups,strdate,endate)
                break;
            case 'btn-staff-unavailability':
                this.StaffUnavailability(s_Branches,s_StfGroup,s_Staff ,s_Stafftype,strdate,endate)
                break;
            case 'btn-staff-Roster':
                this.StaffRoster(s_Branches,s_StfGroup,s_Staff ,s_Stafftype,strdate,endate)
                break;
            case 'btn-staff-MasterRoster':

                switch (s_Cycle)
				{
  					case 'Cycle 1':
                        strdate = "01/01/1900";
                        endate = "28/01/1900";
                    break;
                    case"Cycle 2":
                        strdate = "01/10/1900";
                        endate = "28/10/1900";
                    break;
                    case'Cycle 3':
                        strdate = "01/04/1901";
                        endate = "28/04/1901";
                    break;
                    case'Cycle 4':
                        strdate ="01/07/1901";
                        endate = "28/07/1901";
                    break;
                    case'Cycle 5':
                        strdate = "01/09/1902";
                        endate = "28/09/1902";
                    break;
                     
                    case'Cycle 6':
                        strdate = "01/12/1902";
                        endate = "28/12/1902";
                    break;
                    case'Cycle 7':
                        strdate = "01/06/1903";
                        endate = "28/06/1903";
                    break;
                    case'Cycle 8':
                        strdate ="01/02/1904";
                        endate = "28/02/1904";
                    break;
                    case'Cycle 9':
                        strdate = "01/08/1904";
                     endate = "28/08/1904";
                    break;
                    case'Cycle 10':
                        strdate = "01/05/1905";
                        endate = "28/05/1905";
                    break;
                    default: 
                        strdate ="1900/01/01";
                        endate = "1900/01/28";
                        
                        break;
				}

                this.StaffMasterRoster(s_Branches,s_StfGroup,s_Staff ,s_Stafftype,strdate,endate)
                break;
            case 'btn-staff-loanregister':
                this.StaffLoanRegister(s_Branches,s_Programs,s_Staff,s_LoanItems,s_ServiceRegions,strdate,endate)
                break;
            case 'btn-Regis-progcasenotes':
                this.RecipientProg_CaseReport(s_Branches,s_Programs,s_CaseNotes,s_Recipient,s_Descipiline,s_CareDomain,s_ServiceRegions,s_Managers,strdate,endate)
                break;
            case 'btn-Regis-servicenotesreg':
                this.ServiceNotesRegister(s_Branches,s_Programs,s_CaseNotes,s_Recipient,s_Descipiline,s_CareDomain,strdate,endate)
                break;
            case 'btn-Regis-opnotesregister':
                this.OPNotesRegister(s_Branches,s_Programs,s_CaseNotes,s_Recipient,s_Descipiline,s_CareDomain,strdate,endate)
                break;
            case 'btn-Regis-careplanstatus':
                this.Careplanstatus(s_Recipient,s_PlanType,strdate,endate)
                break;
            case 'btn-staff-availability':
                this.StaffAvailability(s_Branches,s_Staff,strdate)
                break;
            case 'btn-staff-timeattandencecomp':
                this.TimeattandanceComparison(s_Branches,s_Staff,strdate,endate)
                break;
            case 'btn-staff-hrnotesregister':
                this.HRNotesRegister(s_Branches,s_Staff,s_HRCaseNotes,strdate,endate)
                break;
            case 'btn-staff-opnotes':
                this.StaffOPNotesRegister(s_Branches,s_Programs,s_OPCaseNotes,s_Staff,s_Descipiline,s_CareDomain,strdate,endate)
                break;
            case 'btn-staff-incidentregister':
                this.StaffIncidentRegister(s_Branches,s_SvcType,s_Staff,s_incidenttype,s_Incidentcategory,strdate,endate)
                break;
            case 'btn-staff-training':
                this.StaffTraining(s_Branches,s_Managers,s_ServiceRegions,s_Programs,s_StaffTeam,s_TrainingType,s_StfGroup,strdate,endate)
                break;
            case 'btn-competenciesrenewal':
                this.StaffCompetencyRenewal(s_Branches,s_Staff,s_Competencies,s_Managers,s_StaffTeam,s_CompetencyGroups,strdate,endate)
                break;
            case 'btn-Systm-AuditRegister':
                this.AuditRegister(s_who,s_Description,s_TraccsUser,strdate,endate)
                break;
            case 'btn-Systm-ActivityStatusAudit':
                this.ProgramActivityStatusAudit(s_Programs)
                break;
            case 'btn-Systm-MTARegister':
                this.MTARegister(s_Programs,s_Managers,s_Staff,s_StfGroup,s_Recipient,strdate,endate)
                break;
            case 'btn-Systm-RosterOverlap':
                this.RosterOverlapRegister(s_Programs,s_Branches,s_Staff,s_Recipient,strdate,endate)
                break;
            case 'btn-Systm- MTAVerification':
                this.MTAVerificationAudit(s_Programs,s_Managers,s_Staff,s_StfGroup,s_Recipient,strdate,endate)
                break;                                
            case 'btn-FORPT-ProgramUtilisation':               
                this.ReportUtilisation(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;            
            case 'btn-FORPT-PaytypeReport':                               
                this.ReportUtilisation(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break; 
            case 'btn-FORPT-StaffusageReport':                               
                this.ReportUtilisation(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break; 
            case 'btn-FORPT-RecipientserviceReport':                               
                this.ReportUtilisation(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-PayTypeProgram':                               
                this.PayTypeProgram(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-DailyStaffHrs':                               
                this.DailyStaffHrs(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-ProgramActivitySpread':                               
                this.ProgramReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-ProgramStaffUtilized':                               
                this.ProgramReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-ProgramRecipientServiced':                               
                this.ProgramReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-ProgramBillingReport':                               
                this.ProgramBillingReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;


            case 'btn-BudgetAuditReport':                               
                this.ProgramBudgetAudit(s_Branches,s_Programs);
                break;
            case 'btn-ProgramSummaryRpt' :
                this.ProgramSummaryReport(s_Branches, s_Managers, s_ServiceRegions, s_Programs);
                break;


            case 'btn-FORPT-ActivityGroupRpt':                               
                this.ActivityGroupReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-StaffActivityRpt':                               
                this.StaffActivityReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-StaffAdminRpt':                               
                this.StaffAdminReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-StaffClientServiced':                               
                this.StaffRecipientServiced(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-StaffPaysRpt':                               
                this.StaffPaysReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-StaffProgramPayType':                               
                this.StaffProgramPaytypeRpt(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-StaffunderPayrollRpt':                               
                this.StaffFunderPayrolltypeRpt(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-FunderPayrollRpt':                               
                this.FunderPayrolltypeRpt(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)
                break;
            case 'btn-report-fundingAuditReport':                               
                this.FundingAuditReport(strdate,endate)
                break;
            case 'btn-FORPT-DatasetActivityAnalysis':                               
                this.DatasetActivityAnalysis(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-DatasetoutputSummary':                               
                this.DatasetoutputSummary(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-report-UnbilledItems':                               
                this.UnbilledItems(s_Branches,s_Programs,s_SvcType,strdate,endate)
                break;
            case 'btn-FORPT-ActivityRecipientRpt':                               
                this.ActivityRecipientReport(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)                               
                break;
            case 'btn-FORPT-StaffProgramUtilisation':                               
            this.StaffProgramUtilisation(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)
                break;
            case 'btn-FORPT-StaffAllowanceRpt':                               
                this.StaffAllowance(s_Branches,s_Managers,s_ServiceRegions,s_StfGroup,s_Funders,s_Recipient,s_Staff,s_HACCCategory,s_RosterType,s_Age,s_DateType,s_Programs,s_MdsAgencyID,s_OutLetID,s_StaffTeam,status,strdate,endate,idbtn,s_Stafftype,s_PayType,s_Activity,s_Settings_vehicle,formating)
                break;


            case 'btn-report-DatasetUnitCost':                               
                this.DatasetRecipientUnitCost(s_Recipient,s_SvcType,strdate,endate)
                break;
            case 'btn-UnsedFunding':                               
                this.UnsedFunding(s_Programs,s_Managers,s_Recipient,s_Recipient)
                break;
            default:
                alert("Yet to do")
            
        }
    
    } 
//           
    Refeeral_list(branch,manager,region,program){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)"
        var lblcriteria;
        if (branch != ""){
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
        
                                                            
        fQuery = fQuery + " AND (RecipientPrograms.ProgramStatus = 'REFERRAL') ORDER BY R.[Surname/Organisation], R.FirstName"
        
        /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)
   // console.log(lblcriteria)

   
   
    const data =    {
        
        "template": {  "_id":"zrBLd931LZblcnNH"  },    
        "options": {
            "reports": { "save": false },
         //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
            "sql":fQuery,
            "Criteria" :  lblcriteria
        }
    }


    const headerDict = {
        
        'Content-Type': 'application/json',
        'Accept': 'application/json',
               
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict),
        credentials:true
    };
  
  //this.rpthttp
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers,  responseType: 'blob', })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Referral list .pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });    this.drawerVisible = true;     
    }  

    ActivePackage_list(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT [CLIENT CODE], PROGRAM, H.[Type] AS [FUNDING SOURCE], MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END)AS FIRST_ADMISSION,MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) AS FIRST_DISCHARGE  FROM HumanResourceTypes, ROSTER R INNER JOIN ITEMTYPES I ON R.[SERVICE TYPE] = I.TITLE AND MINORGROUP IN ('ADMISSION','DISCHARGE')  INNER JOIN HumanResourceTypes H on R.Program = H.[Name] AND H.[Group] = 'Programs'  WHERE R.[TYPE] = 7 AND R.[DATE] >= '2010/01/01' GROUP BY [CLIENT CODE], PROGRAM, h.[Type]  HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION'  "
        //Condtion to be added on dynamic input   
        //HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END) <= '2020-07-01'  AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'2020-07-31' 
        
        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        //'2013/04/18'  '2016/10/05'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " THEN [DATE] END) <=  '" +startdate + ("'AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
           var lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "}

        if (branch != ""){ 
            lblcriteria =lblcriteria + " Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria =lblcriteria + " All Branches "}
        
         if (manager != ""){
            lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Managers,"}
        
        
        if (region != ""){ 
            lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Regions,"}
        
       
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Programs."}
                                                            
     //   fQuery = fQuery + " AND (RecipientPrograms.ProgramStatus = 'REFERRAL') ORDER BY R.[Surname/Organisation], R.FirstName"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"Uer8Y39DEBqdWvvJ"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria": lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Active Packages.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    } 

    RecipientRoster(branch,stfgroup,recipient,stafftype,startdate,enddate){
        
        var lblcriteria;
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON [CLient Code] = [Accountno]  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE') AND Date BETWEEN '2020/08/01' AND '2020/08/31'  "
        //Condtion to be added on dynamic input   
        //HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END) <= '2020-07-01'  AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'2020-07-31' 
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "( Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(recipient != ""){
            this.s_StaffSQL = "[Carer Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        }


        
        
        if (branch != ""){ 
             lblcriteria = " Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Branches"}
        if (stafftype != ""){ 
            lblcriteria = " Branches:" + stafftype.join(",") + "; "        } 
                else{lblcriteria =lblcriteria +  "All Branches"}
        if (recipient != ""){ 
            lblcriteria = " Recipients:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Recipients"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
                                                            
        fQuery = fQuery + "ORDER BY [Client Code], Date, [Start Time]  "
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"2orGpoorz20XztFV"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Recipient Rosters.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    } 

    SuspendedRecipient(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID INNER JOIN Roster Rs on Rs.[client code]=R.[AccountNo] WHERE R.[AccountNo] > '!MULTIPLE'   AND   (ServiceOverview.ServiceStatus = 'ON HOLD') "
        //Condtion to be added on dynamic input   
        //HAVING MIN(CASE WHEN MINORGROUP = 'ADMISSION' THEN [DATE] END) <= '2020-07-01'  AND MIN(CASE WHEN MINORGROUP = 'DISCHARGE' THEN [DATE] END) >'2020-07-31' 
        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        //AND [DATE] BETWEEN '2014-05-22' AND '2019/07/18' 
        if (startdate != "" || enddate != ""){
            this.s_DateSQL = "  Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
          var  lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "} 

        if (branch != ""){ 
             lblcriteria =lblcriteria +  " Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
        fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"AqAvj5SAJimxblUC"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Suspended Recipients.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }


    VoucherSummary(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT Recipients.AccountNo as [Recipient],  COUNT(SrNo) as  [Vouchers Issued], COUNT(CASE Cancelled WHEN 1 then 'True' else NULL END) as [Vouchers Cancelled], COUNT(CASE Redeemed WHEN 1 then 'True' else NULL END) as [Vouchers Redeemed], SUM(((CASE Redeemed WHEN 1 then 1 else 0 END) * SubsidyAmountt)) as [Value] FROM LMVoucher LEFT JOIN Recipients on LMVoucher.PersonID = Recipients.UniqueID  WHERE  "
        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        //(DATEOFISSUE BETWEEN '2013/07/01' AND '2020/07/31')
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "  DATEOFISSUE BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
          var  lblcriteria =" Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =" All Dated "} 

        if (branch != ""){ 
             lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
        fQuery = fQuery + " GROUP BY Recipients.AccountNo ORDER BY Recipients.AccountNo"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"OyCHjzwx6HGfc3jQ"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Voucher Summary.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }

    PackageUsage(branch,manager,region,program){
        
        
        var fQuery = "Select DISTINCT R.AccountNo, R.[BRANCH], R.[RECIPIENT_COOrdinator], R.[AgencyDefinedGroup], RP.[PersonId], RP.[Program], RP.ProgramStatus, ISNULL(AP_BasedOn, 0) AS Allowed, ISNULL(AP_CostType, '') AS CostType,  ISNULL(AP_PerUnit, '') AS AP_PerUnit, ISNULL(AP_Period, '') AS AP_Period, ISNULL(ExpireUsing, '') AS ExpireUsing, ISNULL(AlertStartDate, '') AS AlertStartDate, '0' AS Balance,  ISNULL(AP_RedQty, 0) AS [RedAmount], ISNULL(AP_OrangeQty, 0) AS [OrangeAmount],  ISNULL(AP_YellowQty, 0) AS [YellowAmount] FROM Recipients R LEFT JOIN RecipientPrograms RP ON RP.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RP.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'RECIPIENT' OR [R].[Type] = 'CARER/RECIPIENT')  AND (RP.ProgramStatus = 'ACTIVE')  AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL))  "
        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        if (branch != ""){ 
            var lblcriteria = "Branches:" + branch.join("','") + "; "        } 
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
                                                            
        fQuery = fQuery + "ORDER BY R.AccountNo "
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"IOYgvXGLDyJsHZDk"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Package Usage Report.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }
    

    RecipientTimeLength(startdate,enddate){
        
        
        var fQuery = "SELECT ACCOUNTNO, C.BRANCH, DATEDIFF(YEAR, DATEOFBIRTH, GETDATE()) AS AGE, MIN([DATE]) AS FirstService, DISCHARGEDATE  FROM RECIPIENTS C LEFT JOIN ROSTER R ON ACCOUNTNO = [CLIENT CODE] " 
        //   AND Date BETWEEN '2020-07-01' AND '2020-07-31'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "  Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
            var lblcriteria =lblcriteria + " Dates Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria +  " All Dated "} 
        
                                                            
        fQuery = fQuery + "AND R.[TYPE] IN (2,3,4,5,8,10,11,12) WHERE ACCOUNTNO > '!Z' GROUP BY ACCOUNTNO, C.BRANCH, DATEOFBIRTH, DISCHARGEDATE "
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"apWdClVOiUcJ8xT0"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Recipient Time Length Report.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }

    UnallocatedBookings(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON Roster.[CLient Code] = Recipients.[Accountno]  WHERE ([Client Code] <> '!INTERNAL')  AND Roster.[Type] = 1  "
        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        //AND Date BETWEEN '2020/07/01' AND '2020/07/31'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "  Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
           var lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "} 

        if (branch != ""){ 
             lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
       fQuery = fQuery + "ORDER BY [Client Code], Date, [Start Time]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"BL1iE2Hn6FNsUpJN"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Unallocated Bookings.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }
    
    TransportSummary(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT  DATADOMAINS.[User1]  as [District], [Roster].[ServiceSetting] as Vehicle, [Roster].[Client Code] as Client, [Roster].[Date] as [Date of Travel] , (Case UPPER(LEFT([Roster].[Service Type],3)) WHEN 'MED' THEN 1 ELSE 0 END) as [MED], (Case UPPER(LEFT([Roster].[Service Type],3)) WHEN 'MED' THEN 0 ELSE 1 END) as [SOC], [Roster].[Program], PR.[Type] AS FundingSource FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]   INNER JOIN DATADOMAINS ON DATADOMAINS.[Description] =  [Roster].[ServiceSetting] INNER JOIN HumanResourceTypes PR ON PR.[Name] = Roster.[Program]WHERE  Roster.Type = 10 AND [Client Code] > '!MULTIPLE' AND Roster.[Status] >= 2 "

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        // AND (DATE BETWEEN '2019/07/01' AND '2020/07/31')
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "  DATE BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
          var  lblcriteria =" Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =" All Dated "} 

        if (branch != ""){ 
             lblcriteria =lblcriteria +  "Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
       fQuery = fQuery + " ORDER BY DataDomains.User1, [Roster].[ServiceSetting], [Roster].[Client Code], [Roster].[Date]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"zf77m2pHrfjGcpvM"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Transport Summary Report.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }


    RefferalsduringPeriod(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[AgencyIDReportingCode], [Recipients].[Surname/Organisation], UPPER([Recipients].[Surname/Organisation]) + ', ' + CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName]  ELSE ' ' END As [RecipientName], [Recipients].[Address1], [Recipients].[Address2], [Recipients].[pSuburb] As Suburb, [Recipients].[pPostcode] As Postcode, [Recipients].[AdmissionDate] As [Activation Date], [Recipients].[DischargeDate] As [DeActivation Date], [Recipients].[ONIRating], [Roster].[Client Code], [Roster].[Service Type], [Roster].[DischargeReasonType], [Roster].[Date], [Roster].[Program]  ,Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID =Recipients.[UniqueID] For XML path ('')),1, 1, '') [Detail]  FROM Recipients With (NoLock)  INNER JOIN Roster With (NoLock) ON Recipients.accountno = Roster.[Client Code]  INNER JOIN ItemTypes With (NoLock) ON ItemTypes.Title = Roster.[Service Type]  AND ProcessClassification <> 'INPUT'    WHERE ItemTypes.MinorGroup = 'REFERRAL-IN'"

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }   //AND (Date BETWEEN '2020/08/01' AND '2020/08/31')
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
          var  lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "} 

        if (branch != ""){ 
            lblcriteria =lblcriteria +  " Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
        fQuery = fQuery + "ORDER BY Date"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"TwKNgf9F8SLUDgLo"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Referral During Period.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
            
    RecipientMasterRoster(branch,stfgroup,recipient,stafftype,startdate,enddate){
        
        var lblcriteria;
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration], case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME , [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON [CLient Code] = Recipients.[Accountno]  LEFT JOIN STAFF ON [CARER CODE] = STAFF.ACCOUNTNO  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE')  "

        // AND Date BETWEEN '1900/01/01' AND '1900/01/28'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "( Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(recipient != ""){
            this.s_StaffSQL = "[Carer Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        }


        
        
        if (branch != ""){ 
             lblcriteria = " Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Branches"}
        if (stafftype != ""){ 
            lblcriteria = " Branches:" + stafftype.join(",") + "; "        } 
                else{lblcriteria =lblcriteria +  "All Branches"}
        if (recipient != ""){ 
            lblcriteria = " Recipients:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Recipients"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
                                                            
        fQuery = fQuery + "  ORDER BY [Client Code], Date, [Start Time] "
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"rRjFTClorpcjSauz"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Recipients Master Roster.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    ActiveRecipientList(branch,manager,region,program){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating,CONVERT(varchar, R.AdmissionDate,23) As [Activation Date],CONVERT(varchar, R.DischargeDate,23)  As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'RECIPIENT' OR [R].[Type] = 'CARER/RECIPIENT')  AND (RecipientPrograms.ProgramStatus = 'ACTIVE')  AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL))  "

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        if (branch != ""){ 
            var lblcriteria = "Branches:" + branch.join("','") + "; "        } 
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
                                                            
        fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"4ohDCZRbiaKS4ocK"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Active Recipient List.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    InActiveRecipientList(branch,manager,region,program){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, CONVERT(varchar, R.AdmissionDate,23)  As [Activation Date], CONVERT(varchar,R.DischargeDate,23)  As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'RECIPIENT' OR [R].[Type] = 'CARER/RECIPIENT') AND (DischargeDate is not null)"

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 

        if (branch != ""){ 
            var lblcriteria = "Branches:" + branch.join("','") + "; "        } 
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
                                                            
       fQuery = fQuery + " ORDER BY R.[Surname/Organisation], R.FirstName"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"EqrRIePxJeNTXk0b"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "InActive Recipient List.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    CareerList(branch,manager,region,program){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating,CONVERT(VARCHAR,R.AdmissionDate ,23) As [Activation Date],CONVERT (varchar,R.DischargeDate,23)  As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'CARER' OR [R].[Type] = 'CARER/RECIPIENT')  AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL))"

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 

        if (branch != ""){ 
            var lblcriteria = "Branches:" + branch.join("','") + "; "        } 
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
                                                            
       fQuery = fQuery + "  ORDER BY R.[Surname/Organisation], R.FirstName"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"pFy5Ej2Zdy6OhMKs"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Carer list.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    BillingCliens(branch,manager,region,program){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] IN ('BILLING CLIENTS', 'BILLING CLIENT ONLY'))  AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL))"

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        if (branch != ""){ 
            var lblcriteria = "Branches:" + branch.join("','") + "; "        } 
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
                                                            
        fQuery = fQuery + "  ORDER BY R.[Surname/Organisation], R.FirstName"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"0BnEO8OTruJxvLwX"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Billing Clients.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    AdmissiionDuringPeriod(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[AgencyIDReportingCode], [Recipients].[Surname/Organisation], UPPER([Recipients].[Surname/Organisation]) + ', ' + CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName]  ELSE ' ' END As [RecipientName], [Recipients].[Address1], [Recipients].[Address2], [Recipients].[pSuburb] As Suburb, [Recipients].[pPostcode] As Postcode, [Recipients].[AdmissionDate] As [Activation Date], [Recipients].[DischargeDate] As [DeActivation Date], [Recipients].[ONIRating], [Roster].[Client Code], [Roster].[Service Type], [Roster].[DischargeReasonType], [Roster].[Date], [Roster].[Program]  FROM Recipients With (NoLock)  INNER JOIN Roster With (NoLock) ON Recipients.accountno = Roster.[Client Code]  INNER JOIN ItemTypes With (NoLock) ON ItemTypes.Title = Roster.[Service Type]  AND ProcessClassification <> 'INPUT'  WHERE ItemTypes.MinorGroup = 'ADMISSION'  "

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        //AND (Date BETWEEN '2015/07/01' AND '2016/07/31'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
          var  lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "}
         

        if (branch != ""){ 
            lblcriteria =lblcriteria + " Branches:" + branch.join(",") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
        fQuery = fQuery + " ORDER BY Date"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"sedG2p1WPWiRPeIc"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Admissions During Period.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    DischargeDuringPeriod(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[AgencyIDReportingCode], [Recipients].[Surname/Organisation], UPPER([Recipients].[Surname/Organisation]) + ', ' + CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName]  ELSE ' ' END As [RecipientName], [Recipients].[Address1], [Recipients].[Address2], [Recipients].[pSuburb] As Suburb, [Recipients].[pPostcode] As Postcode, [Recipients].[AdmissionDate] As [Activation Date], [Recipients].[DischargeDate] As [DeActivation Date], [Recipients].[ONIRating], [Roster].[Client Code], [Roster].[Service Type], [Roster].[DischargeReasonType], [Roster].[Date], [Roster].[Program]  FROM Recipients With (NoLock)  INNER JOIN Roster With (NoLock) ON Recipients.accountno = Roster.[Client Code]  INNER JOIN ItemTypes With (NoLock) ON ItemTypes.Title = Roster.[Service Type]  AND ProcessClassification <> 'INPUT'  WHERE ItemTypes.MinorGroup = 'DISCHARGE' "
        //AND (Date BETWEEN '2015/07/01' AND '2016/07/31'
        
        
        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
          var  lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "} 

        if (branch != ""){ 
             lblcriteria =lblcriteria +  " Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}

             
                                                            
        fQuery = fQuery + "  ORDER BY Date"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)
   // console.log(lblcriteria)               
    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"IcqccAG4IKFnbisd"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Discharge During Period.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    AbsentClientStatus(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID INNER JOIN Roster Rs on Rs.[client code]=R.[AccountNo] WHERE R.[AccountNo] > '!MULTIPLE' AND Rs.[TYPE] = 4  AND ((admissiondate is not null) and (DischargeDate is null))"

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        //   AND [DATE] BETWEEN '2015/07/01' AND '2016/07/31' 
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "  Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (startdate != ""){ 
          var  lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "} 

        if (branch != ""){ 
             lblcriteria = lblcriteria + " Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria +  " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
       fQuery = fQuery + "   ORDER BY R.[Surname/Organisation], FirstName"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"usEk1DqdlD4V07eM"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Absent Client Status Report.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    Associate_list(branch,manager,region,program){
        
        
        var fQuery = "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'  AND ([R].[Type] = 'ASSOCIATE')  AND ((R.AdmissionDate is NOT NULL) and (DischargeDate is NULL))"
        var lblcriteria;
        if (branch != ""){
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
            lblcriteria = "Branches:" + branch.join("','") + "; "        } 
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
        
                                                            
        fQuery = fQuery + "  ORDER BY R.[Surname/Organisation], R.FirstName"
        
        /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)
   // console.log(lblcriteria)

   

    const data =    {
        "template": {  "_id":"69u2ZyBtQbSyxVxf"  },    
        "options": {
            "reports": { "save": false },
         //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
            "sql":fQuery,
            "Criteria" :  lblcriteria
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Associate Listing.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });    this.drawerVisible = true;     
    }

    UnServicedRecipient(branch,manager,region,program,startdate,enddate){
        
        
        var fQuery = "SELECT DISTINCT T.[Date], R.ACCOUNTNO, R.[Surname/Organisation] as Surname, R.FirstName,  R.Branch,  R.RECIPIENT_CoOrdinator, RP.Program FROM RECIPIENTS R LEFT JOIN RecipientPrograms RP on R.UniqueID = RP.PersonID LEFT JOIN ( SELECT RECORDNO, [Date],[CLIENT CODE], Program FROM ROSTER WHERE [TYPE] IN (2,3,4,5,6,7,8,10,11,12)  "

        if (branch != ""){
            this.s_BranchSQL = "R.[BRANCH] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }   //  AND Date BETWEEN '2020-07-01' AND '2020-07-31' )
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        fQuery = fQuery + " AS T ON R.ACCOUNTNO = T.[CLIENT CODE] WHERE ACCOUNTNO > '!Z' AND T.RECORDNO IS NULL"
        if (startdate != ""){ 
          var  lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "} 

        if (branch != ""){ 
            lblcriteria =lblcriteria +  " Branches:" + branch.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}
                                                            
        fQuery = fQuery + " ORDER BY  T.[Date], RP.[Program]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"nsCXBTh7bFlCHSHX"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Unserviced Recipient Report.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    ActiveStaffListing(manager,branch,stfgroup){
        
        
        var fQuery = "Select s.UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, CONVERT(nvarchar, CommencementDate,23) as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'STAFF'  AND ([commencementdate] is not null and [terminationdate] is null)  "

        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(stfgroup != ""){
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','")  +  "')";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        

        if (branch != ""){ 
         var lblcriteria = " Branches:" + branch.join(",") + "; "        } 
             else{lblcriteria = "All Branches"}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (stfgroup != ""){ 
             lblcriteria =lblcriteria + " Staff Groups: " + stfgroup.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Staff Groups,"}
         
        
             fQuery = fQuery + "Group by UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"
                                                            
        fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"LQO71slAArEu36fo"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Active Staff List.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    InActiveStaffListing(manager,branch,stfgroup){
        
        
        var fQuery = "Select s.UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, CONVERT(nvarchar, CommencementDate,23) as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'STAFF'  AND ([commencementdate] is not null and [terminationdate] is not null) "

        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(stfgroup != ""){
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','")  +  "')";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        

        if (branch != ""){ 
         var lblcriteria = " Branches: " + branch.join(",") + "; "        } 
             else{lblcriteria = " All Branches "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + " All Managers,"}
         
         
         if (stfgroup != ""){ 
             lblcriteria =lblcriteria + " Staff Groups: " + stfgroup.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Staff Groups,"}
         
        
             
             fQuery = fQuery + "Group by UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"                                                 
        fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"6NauxB95CSDc096v"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "InActive Staff.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    ActiveBrokerage_Contractor(manager,branch,stfgroup){
        
        
        var fQuery = "Select s.UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, CONVERT(nvarchar, CommencementDate,23) as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'BROKERAGE ORGANISATION'  AND ([commencementdate] is not null and [terminationdate] is null)  "

        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(stfgroup != ""){
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','")  +  "')";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        

        if (branch != ""){ 
         var lblcriteria = " Branches:" + branch.join(",") + "; "        } 
             else{lblcriteria = "All Branches"}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (stfgroup != ""){ 
             lblcriteria =lblcriteria + " Staff Groups: " + stfgroup.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Staff Groups,"}
         
        
        
             fQuery = fQuery + "Group by UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"                                              
        fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"3zUoVBKOkYhdU8Z5"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Active Contractor List.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    InActiveBrokerage_Contractor(manager,branch,stfgroup){
        
        
        var fQuery = "Select s.UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, CONVERT(nvarchar, CommencementDate,23) as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'BROKERAGE ORGANISATION'  AND ([commencementdate] is not null and [terminationdate] is not null)  "

        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(stfgroup != ""){
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','")  +  "')";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        

        if (branch != ""){ 
         var lblcriteria = " Branches:" + branch.join(",") + "; "        } 
             else{lblcriteria = "All Branches"}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (stfgroup != ""){ 
             lblcriteria =lblcriteria + " Staff Groups: " + stfgroup.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Staff Groups,"}
         
        
        
             fQuery = fQuery + "Group by UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"                                               
        fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"htp5rccUteYVbXt6"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "InActive Contractor List.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    ActiveVolunters(manager,branch,stfgroup){
        
        
        var fQuery = "Select s.UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, CONVERT(nvarchar, CommencementDate,23) as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'VOLUNTEER'   AND ([commencementdate] is not null and [terminationdate] is null)  "

        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(stfgroup != ""){
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','")  +  "')";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        

        if (branch != ""){ 
         var lblcriteria = " Branches:" + branch.join(",") + "; "        } 
             else{lblcriteria = "All Branches"}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (stfgroup != ""){ 
             lblcriteria =lblcriteria + " Staff Groups: " + stfgroup.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Staff Groups,"}
         
        
             fQuery = fQuery + "Group by UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"
                                                            
        fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"JlsnP7fNb9LOGeVw"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Active Volunteers.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    InActiveVolunteers(manager,branch,stfgroup){
        
        
        var fQuery = "Select s.UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName], UPPER(s.[LastName]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, Address1, Address2, Suburb, Postcode, CONVERT(nvarchar, CommencementDate,23) as CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX, Stuff ((SELECT '; ' + Detail from PhoneFaxOther pf where pf.PersonID = s.UniqueID For XML path ('')),1, 1, '') [Detail] from Staff s WHERE [Category] = 'VOLUNTEER'   AND ([commencementdate] is not null and [terminationdate] is not null)  "

        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "[PAN_Manager] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(stfgroup != ""){
            this.s_StfGroupSQL = "[StaffGroup] in ('" + stfgroup.join("','")  +  "')";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        

        if (branch != ""){ 
         var lblcriteria = " Branches:" + branch.join(",") + "; "        } 
             else{lblcriteria = "All Branches"}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (stfgroup != ""){ 
             lblcriteria =lblcriteria + " Staff Groups: " + stfgroup.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Staff Groups,"}
         
        
             fQuery = fQuery + "Group by UniqueID, AccountNo, STF_CODE, StaffGroup, [LastName],FirstName, Address1, Address2, Suburb, Postcode, CommencementDate, TerminationDate, HRS_DAILY_MIN, HRS_DAILY_MAX, HRS_WEEKLY_MIN, HRS_WEEKLY_MAX"
                                                            
        fQuery = fQuery + " ORDER BY s.[LastName], s.[FirstName]"
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"lcl6jxcRDYzgs7kJ"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "InActive Volunteers.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
   //     console.log(err);
    });        
    }

    StaffPermissions(branch,manager,region,program){
        
        
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
        
  ///  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"cHHdyk2ACQuXsxFw"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Staff User Permissions.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    MealOrderReport(recipient,startdate,enddate){        
        
        var fQuery = "SELECT  [CLIENT CODE], [SERVICE TYPE], [BILLTEXT], [DATE],  [BILLQTY], [COSTQTY],  [INSTANCES] FROM ( SELECT [CLIENT CODE], [SERVICE TYPE], I.BillText, [DATE], ROUND(BILLQTY,2) AS BILLQTY, ROUND(COSTQTY,2) AS COSTQTY, COUNT(*) AS  [INSTANCES]  FROM ROSTER R INNER JOIN ITEMTYPES I ON R.[SERVICE TYPE] = I.TITLE AND I.MinorGroup = 'MEALS' GROUP BY [CLIENT CODE], [SERVICE TYPE], I.BillText, [DATE], BILLQTY, COSTQTY  )t  WHERE  "
        var lblcriteria;

        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " DATE BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if(recipient != ""){
            this.s_CoordinatorSQL = "[CLIENT CODE] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "} 
        if (recipient != ""){
            lblcriteria =lblcriteria + " Manager: " + recipient.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Recipients,"}
                                                 
        fQuery = fQuery + "  ORDER BY [CLIENT CODE],DATE "
        
  ///  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"zxZz19oiShZi9IuQ"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Meal Order Repo.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    HASReport(program,startdate,enddate){ 
            
            
        var fQuery = "SELECT Distinct  ro.[Date], ro.[Client Code] , it.[DatasetGroup], ro.[Service Type], ro.[Program],  CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS [Household]  FROM Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  INNER JOIN Recipients r ON r.AccountNo  = ro.[Client Code]  LEFT JOIN (SELECT PERSONID, Suburb,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress = 1)AS N1 ON N1.PersonID = r.[UniqueID]  LEFT JOIN(SELECT PERSONID,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress <> 1)            AS N2 ON N2.PersonID =  r.[UniqueID]  WHERE  it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup IN('HOME MAINTENANCE', 'INFORMATION & REFERRAL') "
        var lblcriteria;
        var Client = "SELECT Count( DISTINCT ro.[Client Code]) as ClientCount From Roster ro INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  WHERE (ro.[Date] BETWEEN '" + startdate  + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND Upper(it.DatasetGroup) = 'GENERAL SERVICES'"
        var InRefStf = "SELECT SUM((ro.duration * 5 / 60)) as StaffOutputInfRef From Roster ro INNER JOIN ItemTypes it ON ro.[service type] = it.[title] LEFT JOIN Staff s1 on s1.AccountNo = ro.[Carer Code]   WHERE (ro.[Date] BETWEEN '" + startdate  + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND Upper(it.DatasetGroup) = 'GENERAL SERVICES'";
        var HHouse= "SELECT  COUNT (DISTINCT CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END)  AS [HouseholdCount]  FROM Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  INNER JOIN Recipients r ON r.AccountNo  = ro.[Client Code]  LEFT  JOIN (SELECT PERSONID, Suburb,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress = 1)AS N1 ON N1.PersonID = r.[UniqueID]  INNER JOIN(SELECT PERSONID,CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress <> 1)            AS N2 ON N2.PersonID =  r.[UniqueID]  WHERE (ro.[Date] BETWEEN '" + startdate  + "' AND '" + enddate + "') AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup = 'HOME MAINTENANCE'  ";
        var Fiscal = "SELECT DISTINCT  COUNT (DISTINCT CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END )  AS [FiscalHouseholdCount]  FROM  Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  INNER JOIN Recipients r ON r.AccountNo  = ro.[Client Code]  LEFT  JOIN (SELECT PERSONID, Suburb,            CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END + CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END + CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address FROM NamesAndAddresses WHERE PrimaryAddress = 1) AS N1 ON N1.PersonID = r.[UniqueID]  INNER JOIN (SELECT PERSONID, CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END + CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END + CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END + CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)            AS N2 ON N2.PersonID =  r.[UniqueID]  WHERE (ro.[Date] BETWEEN '" + startdate  + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup = 'HOME MAINTENANCE'";
        var StfHrs= "SELECT  COUNT((ro.duration * 5 / 60)) as StaffOutPut  FROM Roster ro  INNER JOIN ItemTypes it ON ro.[service type] = it.[title]  LEFT JOIN Staff s1 on s1.AccountNo = ro.[Carer Code]  WHERE (ro.[Date] BETWEEN'" + startdate  + "' AND '" + enddate + "') AND  s1.Category IN ('STAFF', 'VOLUNTEER') AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT'  AND it.DatasetGroup = 'HOME MAINTENANCE' ";
        var ExtStfHrs = "SELECT COUNT((ro.duration * 5 / 60)) as ExStaffOutput FROM Roster ro INNER JOIN ItemTypes it ON ro.[service type] = it.[title] LEFT JOIN Staff s1 on s1.AccountNo = ro.[Carer Code]  WHERE (ro.[Date] BETWEEN '" + startdate  + "' AND '" + enddate + "')  AND it.IT_DATASET = 'HAS'  AND it.ProcessClassification = 'OUTPUT' AND it.DatasetGroup = 'HOME MAINTENANCE' ";
    
        
        



        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " ro.[Date] BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if(program != ""){
            this.s_ProgramSQL = " (RecipientPrograms.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "} 
        if (program != ""){ 
                lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Programs."}
                                                
        fQuery = fQuery + " Order By DatasetGroup, [Date]  "
        
    ///  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"DOmzAbp2LTdUL58S"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            "ClientCount" :Client ,
            "InRefStaff" : InRefStf,
            "HouseHold" : HHouse,
            "FY" : Fiscal,
            "StfHour" : StfHrs ,
            "ExtStfHour": ExtStfHrs
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    CDCLeaveRegister(branch,program,startdate,enddate){
            
            
        var fQuery = "SELECT [CLIENT CODE], CDC_Level ,  [LEAVETYPE], Convert(nvarchar, DateAdd(D, 0, MIN([DATE])),23) AS START_DATE,convert(nvarchar, DATEADD(D, 0, MAX([DATE])),23) AS END_DATE, COUNT(*) AS CONTINUOUS_DAYS FROM ( SELECT DISTINCT [CLIENT CODE], IT.[MINORGROUP] AS LEAVETYPE, HRT.User3 as CDC_Level, RE.[BRANCH], RO.[DATE], DATEADD(D,-DENSE_RANK() OVER ( PARTITION BY [CLIENT CODE] ORDER BY [DATE]),[DATE] ) AS RANKDATE FROM ROSTER RO  INNER JOIN RECIPIENTS RE ON RO.[Client Code] = RE.Accountno  INNER JOIN ITEMTYPES IT ON RO.[Service Type] = IT.Title  INNER JOIN HumanResourceTypes HRT ON HRT.Name = RO.Program AND HRT.[GROUP] = 'PROGRAMS'  WHERE  "
        var lblcriteria;
        
        
        


        //(RO.[DATE] BETWEEN '2020/08/01' AND '2020/08/31') AND
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " ro.[Date] BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "RE.BRANCH in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}        
        } 
        if(program != ""){
            this.s_ProgramSQL = " (RO.PROGRAM in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }

        if (branch != ""){ 
            lblcriteria = "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = " All Branches "}
        if (startdate != ""){ 
            lblcriteria = lblcriteria +  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
                lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Programs."}
        
        fQuery = fQuery + "AND IT.[MINORGROUP] IN ('FULL DAY-HOSPITAL', 'FULL DAY-RESPITE', 'FULL DAY-SOCIAL LEAVE', 'FULL DAY-TRANSITION') ) AS T"                                          
        fQuery = fQuery + " GROUP BY [CLIENT CODE], CDC_Level, [LEAVETYPE], RANKDATE, BRANCH  "
        
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"ixpCLJFq7CjWgMqw"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    CDCPackageBalanceReport(recipient,program,startdate,enddate){
            
            
        var fQuery = "SELECT R.AccountNo, HR.Name as Program, PB.[Date], PB.Balance, PB.BatchNumber, PB.BankedContingency FROM PackageBalances PB  INNER JOIN Recipients R ON PB.PersonID = R.SQLID  INNER JOIN HumanResourceTypes HR ON PB.ProgramID = HR.RecordNumber WHERE  "
        var lblcriteria;
        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (PB.[Date] BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if(program != ""){
            this.s_ProgramSQL = " (HR.[Name] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(recipient != ""){
            this.s_CoordinatorSQL = "R.AccountNo in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }

        if (recipient != ""){
            lblcriteria =" Manager: " + recipient.join(",")+ "; "}
            else{lblcriteria = "All Recipients,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
                lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Programs."}
                                                
        fQuery = fQuery + " ORDER BY HR.Name, R.AccountNo, PB.[Date]  "
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"wRMaDCYI8N1RwmHp"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    IncidentRegister(branch,SvcType,Staff,incidenttype,category,startdate,enddate){
            
            
        var fQuery = "SELECT AccountNo, Branch, AccountNo + ' - ' + CASE WHEN [Surname/Organisation]<> '' THEN Upper([Surname/Organisation]) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  + CASE WHEN Address1 <> '' THEN ' ' + Address1  ELSE ' '  END + CASE WHEN Address2 <> '' THEN ' ' + Address2  ELSE ' '  END + CASE WHEN pSuburb <> '' THEN ' ' + pSuburb  ELSE ' '  END + CASE WHEN R.[Phone] <> '' THEN ' Ph.' + R.[Phone]  ELSE ' '  END AS NameAddressPhone, (SELECT CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName FROM STAFF WHERE AccountNo = ReportedBy) As ReportedByStaff, (SELECT CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName FROM STAFF WHERE AccountNo = CurrentAssignee)  As AssignedToStaff , I.*,Convert(nvarchar,Date,23) as ReportedDate FROM IM_Master I INNER JOIN RECIPIENTS R ON I.PERSONID = R.UNIQUEID WHERE"
        var lblcriteria;
        
        
        


        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "([BRANCH] in ('" + branch.join("','")  +  "'))";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(SvcType != ""){
            this.s_SvcTypeSQL = " ([Service] in ('" + SvcType.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_SvcTypeSQL}
        }
        if(Staff != ""){
            this.s_StfSQL = "([CurrentAssignee] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(incidenttype != ""){
            this.s_IncedentTypeSQL = "(i.[Type] in ('" + incidenttype.join("','")  +  "'))";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_IncedentTypeSQL};            
        }
        if(category != ""){
            this.s_incidentCategorySQL = "(i.[Status] in ('" + category.join("','")  +  "'))";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_incidentCategorySQL};            
        }

        if (category != ""){
            lblcriteria =" Incident Category: " + category.join(",")+ "; "}
            else{lblcriteria = "All Categories,"}
        if (incidenttype != ""){
            lblcriteria =lblcriteria + " Incedent Type: " + incidenttype.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Incedent Types,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (SvcType != ""){ 
                lblcriteria =lblcriteria + " Service Type " + SvcType.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Svc. Types"}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        if (Staff != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + Staff.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff ,"}
                                                
        fQuery = fQuery + " ORDER BY DATE  "
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"ufrXaKoSnk1utHyJ"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    LoanItemRegister(branch,program,recipient,loanitems,loancategory,startdate,enddate){
            
            
        var fQuery = "SELECT HumanResources.Name,HumanResources.PersonID,HumanResources.[Type],HumanResources.[Address1],HumanResources.[Group],Convert(nvarchar,HumanResources.Date1,23) as Date1, Convert(nvarchar,HumanResources.Date2,23) as Date2,Recipients.AccountNo,        Recipients.Branch FROM HumanResources INNER JOIN Recipients on HumanResources.PersonID = Recipients.UniqueID  WHERE   HumanResources.[Group] = 'LOANITEMS' "
        var lblcriteria;
        
        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " ((Date1 < '" +startdate + ("') AND ((Date2 Is Null) OR(Date2 >'") + enddate  +  "' )) )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND  " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "Branch  in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(program != ""){
            this.s_ProgramSQL = " ([HumanResources].[Address1] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(recipient != ""){
            this.s_CoordinatorSQL = "AccountNo in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(loanitems != ""){
            this.s_IncedentTypeSQL = "([Name] in ('" + loanitems.join("','")  +  "'))";            
            if (this.s_loanitemsSQL != ""){ fQuery = fQuery + " AND " + this.s_loanitemsSQL};            
        }
        if(loancategory != ""){
            this.s_loancategorySQL = "(i.[Status] in ('" + loancategory.join("','")  +  "'))";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_loancategorySQL};            
        }

        if (loancategory != ""){
            lblcriteria =" Incident Category: " + loancategory.join(",")+ "; "}
            else{lblcriteria = "All Categories,"}
        if (loanitems != ""){
            lblcriteria =lblcriteria + " Loan Items: " + loanitems.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Items,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Programs."}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        if (recipient != ""){
            lblcriteria =" Recipients: " + recipient.join(",")+ "; "}
            else{lblcriteria =  lblcriteria + "All Recipients,"}
                                                
        fQuery = fQuery + " ORDER BY HumanResources.Name "
        
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"3OJaZgWOBy3b9hOI"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    StaffLeaveRegister(startdate,enddate){ 
            
            
        var fQuery = "SELECT ACCOUNTNO, L.NAME, convert(nvarchar,DATE1,23) as StartDate, convert(nvarchar,DATE2,23)  as EndDate, L.NOTES, CASE WHEN IsNull(L.Completed,0) = 1 THEN 'YES' ELSE 'NO' END AS APPROVED  FROM STAFF S  INNER JOIN HUMANRESOURCES L ON S.UNIQUEID = L.PERSONID AND L.[GROUP] = 'LEAVEAPP' WHERE      "
        var lblcriteria;

        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "Date1 BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " " + this.s_DateSQL};            
        }
       
        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "} 
                                             
        fQuery = fQuery + " ORDER BY  ACCOUNTNO  "
        
   //   console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"w41oVwE0B5tGyRBi"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    StaffNotWorkedReport(branch,stfgroup,staff,startdate,enddate){
            
            
        var fQuery = "SELECT  ST.AccountNo, ST.STF_CODE as Staff#, ST.STF_DEPARTMENT as StaffBranch, ST.StaffGroup as JobCategory, ST.SubCategory as AdminCategory, ST.ServiceRegion  FROM STAFF ST Where NOT Exists ( SELECT [Carer Code]  FROM Roster WHERE [Carer Code]  = ST.AccountNo AND [Carer Code]  >'!z' AND Roster.[TYPE] BETWEEN 2 AND 12   "
        var lblcriteria;
        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " Roster.[DATE] BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staff != ""){
            this.s_StaffSQL = "[AccountNo] in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }


        
        
        if (branch != ""){ 
             lblcriteria = " Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Branches"}
        if (staff != ""){ 
            lblcriteria = " Staff:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Staff"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        
                                                
        fQuery = fQuery + " ORDER BY [AccountNo], [STF_DEPARTMENT], [StaffGroup] "
        
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"01uDIoKwUysCboDf"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    StaffCompetencyRenewal(branch,staff,competency,manager,staffteam,competencygroup,startdate,enddate){
            
            
        var fQuery = "SELECT  IsNull([PAN_MANAGER],'') as Coordinator , UPPER(Staff.LastName) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName,Staff.StaffGroup,Staff.Category,Staff.STF_DEPARTMENT,HumanResources.Name as Competency,CASE WHEN HumanResources.Date1 IS NULL THEN 'MISSING' ELSE CAST(HumanResources.Date1 as VARCHAR(20)) END AS [Expiry Date],HumanResources.Notes FROM Staff INNER JOIN HumanResources ON Staff.UniqueID = HumanResources.PersonID WHERE ([commencementdate] is not null and [terminationdate] is null) AND (HumanResources.[Type] = 'STAFFATTRIBUTE')   "
        var lblcriteria;

        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " ((HumanResources.[Date1] BETWEEN '" +startdate + ("'AND'") + enddate  +  "')OR ISNULL(HumanResources.[Date1], '') = '')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([STAFFTEAM] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
        }
        if(staff != ""){
            this.s_StaffSQL = "[AccountNo] in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "[PAN_MANAGER] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(competency != ""){
            this.s_CompetencySQL = "[HumanResources].[Name] in ('" + competency.join("','")  +  "')";            
            if (this.s_CompetencySQL != ""){ fQuery = fQuery + " AND " + this.s_CompetencySQL};
        }
        if(competencygroup != ""){
            this.s_CompetencyGroupSQL = "[PAN_Manager] in ('" + competencygroup.join("','")  +  "')";            
            if (this.s_CompetencyGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_CompetencyGroupSQL};
        }


        
        
        if (branch != ""){ 
             lblcriteria = " Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = " All Branches "}
        if (staff != ""){ 
            lblcriteria = " Staff:" + branch.join(",") + "; "        } 
                else{lblcriteria =lblcriteria +  " All Staff, "}
        if (competencygroup != ""){ 
            lblcriteria = " Competency Group:" + branch.join(",") + "; "        } 
                else{lblcriteria =lblcriteria +  " All Competency Groups,"}
        if (competency != ""){ 
            lblcriteria = " Competency:" + branch.join(",") + "; "        } 
                else{lblcriteria =lblcriteria + " All Competencies, "}
        if (staffteam != ""){ 
            lblcriteria =lblcriteria + " Staff Team: " + staffteam.join(",")+ "; "}
            else{lblcriteria = lblcriteria + " All Staff Groups,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "}
        if (manager != ""){
            lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
            else{lblcriteria = lblcriteria + " All Managers,"}
        
                                                
        fQuery = fQuery + " ORDER BY Staff.[LastName], Staff.[FirstName] "
        
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"Nl0aajvRfsYjDEsb"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    StaffUnavailability(branch,stfgroup,staff,stafftype,startdate,enddate){
            
            
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME,  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Carer Code] <> '!INTERNAL' AND [Carer Code] <> '!MULTIPLE')  AND Roster.[Type] = 13 "
        var lblcriteria;
        
        //AND Date BETWEEN '2020/08/01' AND '2020/08/31'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "( Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staff != ""){
            this.s_StaffSQL = "[Carer Code] in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        }


        
        
        if (branch != ""){ 
             lblcriteria = " Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Branches"}
        if (stafftype != ""){ 
            lblcriteria = " Branches:" + stafftype.join(",") + "; "        } 
                else{lblcriteria =lblcriteria +  "All Branches"}
        if (staff != ""){ 
            lblcriteria = " Staff:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Staff"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        
                                                
        fQuery = fQuery + "  ORDER BY [Carer Code], Date, [Start Time] "
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"K2JHPJM2MhBWbVqK"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    StaffRoster(branch,stfgroup,staff,stafftype,startdate,enddate){
            
            
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME,  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Carer Code] > '!MULTIPLE') AND Type <> 1  AND (Type <> 13)   "
        var lblcriteria;
        
        //AND (Date BETWEEN '2020/08/01' AND '2020/08/31')
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "( Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staff != ""){
            this.s_StaffSQL = "[Carer Code] in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        }


        
        
        if (branch != ""){ 
             lblcriteria = " Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Branches"}
        if (stafftype != ""){ 
            lblcriteria = " Branches:" + stafftype.join(",") + "; "        } 
                else{lblcriteria =lblcriteria +  "All Branches"}
        if (staff != ""){ 
            lblcriteria = " Staff:" + branch.join(",") + "; "        } 
                else{lblcriteria =lblcriteria + "All Staff"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        
                                                
        fQuery = fQuery + " ORDER BY [Carer Code], Date, [Start Time]  "
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"V0M95ECHuYRp0QD"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    StaffMasterRoster(branch,stfgroup,staff,stafftype,startdate,enddate){
            
            
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],case when Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  = '00:00' then '24:00' else Convert(varchar(5), (DateAdd(MINUTE, (([Duration]/12)*60) , [Start Time])),108 )  end AS ENDTIME,  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Carer Code] <> '!INTERNAL' AND [Carer Code] <> '!MULTIPLE')  AND (Type <> 13)  "
        var lblcriteria;
        
        //AND Date BETWEEN '1900/01/01' AND '1900/01/28'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "( Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staff != ""){
            this.s_StaffSQL = "[Carer Code] in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[AccountNo] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        }


        
        
        if (branch != ""){ 
             lblcriteria = " Branches:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Branches"}
        if (stafftype != ""){ 
            lblcriteria = " Branches:" + stafftype.join(",") + "; "        } 
                else{lblcriteria =lblcriteria +  "All Branches"}
        if (staff != ""){ 
            lblcriteria = " Staff:" + branch.join(",") + "; "        } 
                else{lblcriteria = "All Staff"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Staff Group: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        
                                                
        fQuery = fQuery + " ORDER BY [Carer Code], Date, [Start Time]  "
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"I2d0gKTCdLP2phas"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    StaffLoanRegister(branch,program,staff,loanitems,loancategory,startdate,enddate){
            
            
        var fQuery = "SELECT HumanResources.Name,HumanResources.PersonID,HumanResources.[Type],HumanResources.[Address1],HumanResources.[Group],Convert(nvarchar,HumanResources.Date1,23) as Date1, Convert(nvarchar,HumanResources.Date2,23) as Date2,Recipients.AccountNo,        Recipients.Branch FROM HumanResources INNER JOIN Recipients on HumanResources.PersonID = Recipients.UniqueID  WHERE   HumanResources.[Group] = 'LOANITEMS' "
        var lblcriteria;
        
        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " ((Date1 < '" +startdate + ("') AND ((Date2 Is Null) OR(Date2 >'") + enddate  +  "' )) )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND  " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "Branch  in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(program != ""){
            this.s_ProgramSQL = " ([HumanResources].[Address1] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(staff != ""){
            this.s_CoordinatorSQL = "AccountNo in ('" + staff.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(loanitems != ""){
            this.s_IncedentTypeSQL = "([Name] in ('" + loanitems.join("','")  +  "'))";            
            if (this.s_loanitemsSQL != ""){ fQuery = fQuery + " AND " + this.s_loanitemsSQL};            
        }
        if(loancategory != ""){
            this.s_loancategorySQL = "(i.[Status] in ('" + loancategory.join("','")  +  "'))";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_loancategorySQL};            
        }

        if (loancategory != ""){
            lblcriteria =" Incident Category: " + loancategory.join(",")+ "; "}
            else{lblcriteria = "All Categories,"}
        if (loanitems != ""){
            lblcriteria =lblcriteria + " Loan Items: " + loanitems.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Items,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Programs."}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        if (staff != ""){
            lblcriteria =" Staff: " + staff.join(",")+ "; "}
            else{lblcriteria =  lblcriteria + "All Staff,"}
                                                
        fQuery = fQuery + " ORDER BY HumanResources.Name "
        
    //console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"3OJaZgWOBy3b9hOI"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    RecipientProg_CaseReport(branch,program,casenotecat,recipient,discipline,caredomain,category,manager,startdate,enddate){
            
            
        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(R.[Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as ClientName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, R.AccountNo AS ClientCode, R.[Type] AS RecipType, R.[Branch] AS Branch, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail, convert(nvarchar,History.DetailDate,22) AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Recipients as R INNER JOIN History ON R.UniqueID = History.PersonID LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON R.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON R.UNIQUEID = P.PERSONID WHERE   "
        var lblcriteria;
        
        // '08-01-2019' AND '08-31-2020 23:59:59' AND
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (History. DetailDate Between '" +startdate + ("' AND '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(casenotecat != ""){
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','")  +  "')";            
            if (this.s_CaseNoteSQL != ""){ fQuery = fQuery + " AND " + this.s_CaseNoteSQL};            
        }
        if(category != ""){
            this.s_CategorySQL = "[AGENCYDEFINEDGROUP] in ('" + category.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL}
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[AccountNo] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(discipline != ""){
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','")  +  "'))";            
            if (this.s_DisciplineSQL != ""){ fQuery = fQuery + " AND " + this.s_DisciplineSQL};            
        }
        if(caredomain != ""){
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','")  +  "')";            
            if (this.s_CareDomainSQL != ""){ fQuery = fQuery + " AND " + this.s_CareDomainSQL};       
        } 
        if(manager != ""){
            this.s_CoordinatorSQL = "[RECIPIENT_COORDINATOR] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};            
        } 




        if (discipline != ""){
            lblcriteria =" Disciplines: " + discipline.join(",")+ "; "}
            else{lblcriteria = "All Disciplines,"}           
        if (caredomain != ""){
            lblcriteria =" Care Domains: " + caredomain.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Care Domains,"}
        if (recipient != ""){
            lblcriteria =" Recipients: " + recipient.join(",")+ "; "}
            else{lblcriteria =lblcriteria + "All Recipients,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Programs."}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        if (category != ""){ 
            lblcriteria =lblcriteria + " Regions: " + category.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Regions,"}
        if (casenotecat != ""){
            lblcriteria = lblcriteria + " Case Notes: " + casenotecat.join(",")+ "; "}
            else{lblcriteria =  lblcriteria + "All Case NOtes,"}
        if (manager != ""){
            lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Managers,"}

        fQuery = fQuery +    "AND ExtraDetail1 = 'CASENOTE'  AND (History.DeletedRecord = 0)  ) ROP"                                 
        fQuery = fQuery + " ORDER BY ROP.[ClientName], ROP.DateCreated  "
        
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"BTHy0VhO1rkhv5VZ"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    ServiceNotesRegister(branch,program,casenotecat,recipient,discipline,caredomain,startdate,enddate){
            
            
        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(R.[Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as ClientName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, R.AccountNo AS ClientCode, R.[Type] AS RecipType, R.[Branch] AS Branch, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail,Convert (nvarchar,History.DetailDate,22) AS DateCreated , History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Roster Ro INNER JOIN History ON  CONVERT(varchar,Ro.RecordNo,100) = History.PersonID Left Join Recipients as R ON R.AccountNo = Ro.[Client Code]  LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON R.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON R.UNIQUEID = P.PERSONID WHERE "
        var lblcriteria;
        
        // History. DetailDate Between '08-01-2019' AND '08-31-2020 23:59:59' 
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (History. DetailDate Between '" +startdate + ("' AND '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(casenotecat != ""){
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','")  +  "')";            
            if (this.s_CaseNoteSQL != ""){ fQuery = fQuery + " AND " + this.s_CaseNoteSQL};            
        }
        
        if(recipient != ""){
            this.s_RecipientSQL = "[AccountNo] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(discipline != ""){
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','")  +  "'))";            
            if (this.s_DisciplineSQL != ""){ fQuery = fQuery + " AND " + this.s_DisciplineSQL};            
        }
        if(caredomain != ""){
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','")  +  "')";            
            if (this.s_CareDomainSQL != ""){ fQuery = fQuery + " AND " + this.s_CareDomainSQL};       
        }      




        if (discipline != ""){
            lblcriteria =" Disciplines: " + discipline.join(",")+ "; "}
            else{lblcriteria = "All Disciplines,"}           
        if (caredomain != ""){
            lblcriteria =" Care Domains: " + caredomain.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Care Domains,"}
        if (recipient != ""){
            lblcriteria =" Recipients: " + recipient.join(",")+ "; "}
            else{lblcriteria =lblcriteria + "All Recipients,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Programs."}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        
        if (casenotecat != ""){
            lblcriteria =" Case Notes: " + casenotecat.join(",")+ "; "}
            else{lblcriteria =  lblcriteria + "All Case NOtes,"}        

        fQuery = fQuery +    "AND ExtraDetail1 = 'SVCNOTE'  AND (History.DeletedRecord = 0)  ) ROP "                                 
        fQuery = fQuery + " ORDER BY ROP.[ClientName], ROP.DateCreated   "
        
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"H8diePMsfdr5gYyV"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    OPNotesRegister(branch,program,casenotecat,recipient,discipline,caredomain,startdate,enddate){
            
            
        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(R.[Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as ClientName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, R.AccountNo AS ClientCode, R.[Type] AS RecipType, R.[Branch] AS Branch, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail,Convert(nvarchar, History.DetailDate,22) AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Recipients as R INNER JOIN History ON R.UniqueID = History.PersonID LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON R.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON R.UNIQUEID = P.PERSONID WHERE ExtraDetail1 = 'OPNOTE'"
        var lblcriteria;
        
        // History. DetailDate Between '08-01-2020' AND '08-31-2020 23:59:59'
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (History. DetailDate Between '" +startdate + ("' AND '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(casenotecat != ""){
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','")  +  "')";            
            if (this.s_CaseNoteSQL != ""){ fQuery = fQuery + " AND " + this.s_CaseNoteSQL};            
        }
        
        if(recipient != ""){
            this.s_RecipientSQL = "[AccountNo] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(discipline != ""){
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','")  +  "'))";            
            if (this.s_DisciplineSQL != ""){ fQuery = fQuery + " AND " + this.s_DisciplineSQL};            
        }
        if(caredomain != ""){
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','")  +  "')";            
            if (this.s_CareDomainSQL != ""){ fQuery = fQuery + " AND " + this.s_CareDomainSQL};       
        }      




        if (discipline != ""){
            lblcriteria =" Disciplines: " + discipline.join(",")+ "; "}
            else{lblcriteria = "All Disciplines,"}           
        if (caredomain != ""){
            lblcriteria =" Care Domains: " + caredomain.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Care Domains,"}
        if (recipient != ""){
            lblcriteria =" Recipients: " + recipient.join(",")+ "; "}
            else{lblcriteria =lblcriteria + "All Recipients,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Programs."}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        
        if (casenotecat != ""){
            lblcriteria =" Case Notes: " + casenotecat.join(",")+ "; "}
            else{lblcriteria =  lblcriteria + "All Case NOtes,"}        

        fQuery = fQuery +    "  AND (History.DeletedRecord = 0)  ) ROP"
        fQuery = fQuery + " ORDER BY ROP.[ClientName], ROP.DateCreated   "
        
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"5rDvU6JYKKsSsUEe"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    Careplanstatus(recipient,plantype,startdate,enddate){        
        
        var fQuery = "SELECT D.DOC_ID, R.AccountNo, D.Doc# AS CareplanID, DD.Description AS PlanType, D.Title as CarePlanName, D.Filename, D.Status, D.DocStartDate, D.DocEndDate, QH.Doc# AS QuoteNumber, (SELECT [Name] FROM HumanResourceTypes WHERE RecordNumber = D.Department AND [Group] = 'PROGRAMS') AS Program, (SELECT [Description] FROM DataDomains WHERE RecordNumber = D.DPID) AS Discipline, (SELECT [Description] FROM DataDomains WHERE RecordNumber = D.CareDomain) AS CareDomain, CONVERT(Varchar(10),D.Created, 103) AS Created, CONVERT(Varchar(10),D.Modified, 103) + ' ' + (SELECT [Name] FROM UserInfo WHERE Recnum = D.Typist) AS Modified FROM Documents D LEFT JOIN DataDomains DD on   DD.RecordNumber = D.SubId LEFT JOIN qte_hdr QH ON CPID = DOC_ID LEFT JOIN Recipients R on  D.PersonID = R.UniqueID WHERE DOCUMENTGROUP IN ('CAREPLAN') AND (D.DeletedRecord = 0 OR D.DeletedRecord Is NULL)  "
        var lblcriteria;
         
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "[Created] BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if(recipient != ""){
            this.s_CoordinatorSQL = "R.AccountNo in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(plantype != ""){
            this.s_PlantypeSQL = "DD.Description in ('" + plantype.join("','")  +  "')";            
            if (this.s_PlantypeSQL != ""){ fQuery = fQuery + " AND " + this.s_PlantypeSQL};            
        }



        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "} 
        if (recipient != ""){
            lblcriteria =lblcriteria + " Manager: " + recipient.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Recipients,"}
        if (plantype != ""){
            lblcriteria =lblcriteria + " Plan Type: " + plantype.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Plan Types,"}
                                                 
        fQuery = fQuery + " ORDER BY R.AccountNo, CarePlanName   "
        
  ///  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"wck7EFbfopCd1OKi"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    StaffAvailability(branch,staff,startdate){
            
            
        var fQuery = " ";
        var lblcriteria;
        
        
        


        
        if (startdate != "" ){
            this.s_DateSQL = " WITH T AS (SELECT ACCOUNTNO,  '" +startdate + ("'AS [DATE],");
            if (this.s_DateSQL != ""){ fQuery = this.s_DateSQL};            
        }
        fQuery = fQuery + "CONVERT(TIME, '00:00') AS STARTTIME, CONVERT(TIME, '00:00') AS STARTFREETIME FROM STAFF WHERE ACCOUNTNO > '!Z' AND ACCOUNTNO <> 'BOOKED' AND COMMENCEMENTDATE IS NOT NULL AND TerminationDate IS NULL UNION SELECT [CARER CODE], [DATE], CONVERT(TIME, [START TIME]) AS STARTTIME, CASE WHEN DATEADD(MINUTE, DURATION * 5,  CONVERT(TIME, [START TIME])) = '00:00' THEN '23:59:59.99' ELSE CONVERT(TIME,DATEADD(MINUTE, DURATION * 5, CONVERT(TIME, [START TIME]))) END AS STARTFREETIME FROM ROSTER WHERE [CARER CODE] > '!Z' AND [CARER CODE] <> 'BOOKED'"

        this.s_DateSQL = " AND [DATE] IN ('" + startdate + ("')  UNION SELECT ACCOUNTNO, '" + startdate + "' AS [DATE], ");
            if (this.s_DateSQL != ""){ fQuery = fQuery + " " +this.s_DateSQL};


        fQuery = fQuery +  "CONVERT(TIME, '23:59:59.99') AS STARTTIME, CONVERT(TIME, '23:59:59.99') AS STARTFREETIME FROM STAFF WHERE ACCOUNTNO > '!Z' AND ACCOUNTNO <> 'BOOKED'"
          
        
        if (branch != ""){
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}        
        }
        if(staff != ""){
            this.s_StaffSQL = "ACCOUNTNO in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }
        
        fQuery = fQuery + "AND COMMENCEMENTDATE IS NOT NULL AND TerminationDate IS NULL ) SELECT ACCOUNTNO, [DATE], LEFT(STARTFREETIME,8) AS STARTTIME, LEFT(ENDFREETIME,8) AS ENDTIME FROM (SELECT T.*, LEAD(STARTTIME) OVER (PARTITION BY ACCOUNTNO ORDER BY DATE,STARTTIME,STARTFREETIME) AS ENDFREETIME FROM T ) T WHERE ENDFREETIME IS NOT NULL AND STARTFREETIME <> ENDFREETIME AND EXISTS ( SELECT * FROM STAFF S WHERE T.ACCOUNTNO = S.ACCOUNTNO AND CommencementDate IS NOT NULL AND TerminationDate IS NULL )"
        

        if (branch != ""){ 
            lblcriteria = "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = " All Branches "}
        if (startdate != ""){ 
            lblcriteria = lblcriteria +  " Date " + startdate }
             
        if (staff != ""){ 
            lblcriteria = " Staff:" + staff.join(",") + "; "        } 
                else{lblcriteria =lblcriteria + "All Staff"}
        
       
        fQuery = fQuery + " ORDER BY ACCOUNTNO, DATE,STARTTIME ASC "
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"rTZq9PlAzEYD9Jbc"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    TimeattandanceComparison(branch,staff,startdate,enddate){
            
            
        var fQuery = " SELECT DISTINCT S.LastName + ' ' + S.FirstName As StaffName, CASE WHEN R.[FirstName] <> '' Then R.[FirstName] + ' ' ELSE '' END + CASE WHEN R.[Surname/Organisation] <> '' THEN R.[Surname/Organisation] ELSE '' END AS [RecipientName],Convert(nvarchar, DateTime,22) as DateTime,Convert(nvarchar, RosteredStart,22) as RosteredStart,Convert(nvarchar, ActualDateTime,22) as ActualDateTime , DATEDIFF(n, RosteredStart, ActualDateTime) AS StartVAR, Convert(nvarchar,RosteredEnd,22) as RosteredEnd, Convert(nvarchar, LOActualDateTime,22) as LOActualDateTime, DATEDIFF(n, RosteredEnd, LOActualDateTime) As EndVAR, DATEDIFF(n, Rosteredstart, Rosteredend) As RosterDur, Round(WorkDuration * 60, 0) As ActualDur,  Round(WorkDuration * 60, 0) - DATEDIFF(n, Rosteredstart, Rosteredend) as DurVAR FROM EZITRACKER_LOG E INNER JOIN STAFF S ON E.Peopleid = S.Uniqueid INNER JOIN RECIPIENTS R ON E.SiteLoginID = R.Uniqueid  WHERE  CommencementDate is not null AND (TerminationDate is null OR TerminationDate >  FORMAT (getdate(),'yyyy/MM/dd')) ";
        var lblcriteria;
        
        
        


        //( BETWEEN '2020/08/01' AND '2020/08/31') AND
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "[RosteredStart] BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }        
        
        if (branch != ""){
            this.s_BranchSQL = "STF_DEPARTMENT in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}        
        }
        if(staff != ""){
            this.s_StaffSQL = "ACCOUNTNO in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }     
        
        
        if (branch != ""){ 
            lblcriteria = "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = " All Branches "}
        
            if (startdate != ""){ 
                lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
                else{lblcriteria =lblcriteria + " All Dated "}
             
        if (staff != ""){ 
            lblcriteria = " Staff:" + staff.join(",") + "; "        } 
                else{lblcriteria =lblcriteria + "All Staff"}
        
       
      
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"XTO8SlLEk5FLPTqL"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    HRNotesRegister(branch,staff,casenotecat,startdate,enddate){
            
            
        var fQuery = "SELECT UPPER(Staff.LastName) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +       CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END + CASE WHEN Suburb <> '' THEN Suburb ELSE '' END AS Address, Staff.AccountNo AS StaffCode, Staff.StaffGroup, Staff.Category, Staff.STF_DEPARTMENT AS Branch, Staff.Contact1, History.AlarmDate as [Reminder Date], History.Detail,Convert(nvarchar, History.DetailDate,22) AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN History.ExtraDetail2 Is Null THEN ' UNKNOWN' WHEN History.ExtraDetail2 < 'A' THEN ' UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord FROM Staff INNER JOIN History ON Staff.UniqueID = History.PersonID WHERE  ExtraDetail1 = 'HRNOTE'  AND (History.DeletedRecord = 0) AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr'))  ";
        var lblcriteria;
        
        
        


        // '08-01-2020' AND  '08-31-2020'   AND
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = "DetailDate > '" +startdate + ("'AND  DetailDate < ' ") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }        
        
        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}        
        }
        if(staff != ""){
            this.s_StaffSQL = "[AccountNo] in ('" + staff.join("','")  +  "')";            
            if (this.s_StaffSQL != ""){ fQuery = fQuery + " AND " + this.s_StaffSQL};
        }
        if(casenotecat != ""){
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','")  +  "')";            
            if (this.s_CaseNoteSQL != ""){ fQuery = fQuery + " AND " + this.s_CaseNoteSQL};            
        }     
        
        
        if (branch != ""){ 
            lblcriteria = "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = " All Branches "}
        
            if (startdate != ""){ 
                lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
                else{lblcriteria =lblcriteria + " All Dated "}
             
        if (staff != ""){ 
            lblcriteria = " Staff:" + staff.join(",") + "; "        } 
                else{lblcriteria =lblcriteria + "All Staff, "}
                if (casenotecat != ""){
                    lblcriteria =" Case Notes: " + casenotecat.join(",")+ "; "}
                    else{lblcriteria =  lblcriteria + "All Case NOtes,"} 
        
        fQuery = fQuery +    "ORDER BY Staff.[LastName], History.DetailDate "
      
        
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"tAljOfXOyqcdnOV8"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    StaffOPNotesRegister(branch,program,casenotecat,staff,discipline,caredomain,startdate,enddate){
            
            
        var fQuery = "SELECT UPPER(Staff.LastName) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as StaffName, CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END + CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END + CASE WHEN Suburb <> '' THEN Suburb ELSE '' END AS Address, Staff.AccountNo AS StaffCode, Staff.StaffGroup, Staff.Category, Staff.STF_DEPARTMENT AS Branch, Staff.Contact1, History.AlarmDate as [Reminder Date], History.Detail,Convert(nvarchar,History.DetailDate,22) AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN History.ExtraDetail2 Is Null THEN ' UNKNOWN' WHEN History.ExtraDetail2 < 'A' THEN ' UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord FROM Staff INNER JOIN History ON Staff.UniqueID = History.PersonID WHERE ExtraDetail1 <> 'HRNOTE'  AND (History.DeletedRecord = 0)  "
        var lblcriteria;
        
        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (DetailDate >  '" +startdate + ("' AND DetailDate < '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "R.[Branch]  in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(casenotecat != ""){
            this.s_CaseNoteSQL = "[ExtraDetail2] in ('" + casenotecat.join("','")  +  "')";            
            if (this.s_CaseNoteSQL != ""){ fQuery = fQuery + " AND " + this.s_CaseNoteSQL};            
        }
        
        if(staff != ""){
            this.s_RecipientSQL = "[AccountNo] in ('" + staff.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(discipline != ""){
            this.s_DisciplineSQL = "([Discipline] in ('" + discipline.join("','")  +  "'))";            
            if (this.s_DisciplineSQL != ""){ fQuery = fQuery + " AND " + this.s_DisciplineSQL};            
        }
        if(caredomain != ""){
            this.s_CareDomainSQL = "[CareDomain] in ('" + caredomain.join("','")  +  "')";            
            if (this.s_CareDomainSQL != ""){ fQuery = fQuery + " AND " + this.s_CareDomainSQL};       
        }      




        if (discipline != ""){
            lblcriteria =" Disciplines: " + discipline.join(",")+ "; "}
            else{lblcriteria = "All Disciplines,"}           
        if (caredomain != ""){
            lblcriteria =" Care Domains: " + caredomain.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Care Domains,"}
        if (staff != ""){
            lblcriteria =" Staff: " + staff.join(",")+ "; "}
            else{lblcriteria =lblcriteria + "All Staff,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Programs."}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        
        if (casenotecat != ""){
            lblcriteria =" Case Notes: " + casenotecat.join(",")+ "; "}
            else{lblcriteria =  lblcriteria + "All Case NOtes,"}        

       
        fQuery = fQuery + " ORDER BY Staff.[LastName], History.DetailDate   "
        
//console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"CPX4RU8x2kvCKORP"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    StaffIncidentRegister(branch,SvcType,Staff,incidenttype,category,startdate,enddate){
            
            
        var fQuery = "SELECT AccountNo, STF_Department AS Branch, AccountNo + ' - ' + CASE WHEN LastName<> '' THEN Upper(LastName) ELSE ' ' END + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' + CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  + CASE WHEN Address1 <> '' THEN ' ' + Address1  ELSE ' '  END + CASE WHEN Address2 <> '' THEN ' ' + Address2  ELSE ' '  END + CASE WHEN Suburb <> '' THEN ' ' + Suburb  ELSE ' '  END + CASE WHEN TelePhone <> '' THEN ' Ph.' + TelePhone  ELSE ' '  END AS NameAddressPhone, (SELECT           CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' +        CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' +        CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName        FROM STAFF WHERE AccountNo = ReportedBy) As ReportedByStaff, (SELECT           CASE WHEN LastName <> '' THEN Upper(LastName) ELSE ' ' END + ', ' +        CASE WHEN FirstName <> '' THEN FirstName  ELSE ' ' END + ' ' +        CASE WHEN MiddleNames <> '' THEN MiddleNames  ELSE '' END  As StaffName        FROM STAFF WHERE AccountNo = CurrentAssignee)  As AssignedToStaff , I.* FROM IM_Master I INNER JOIN STAFF R ON I.PERSONID = R.UNIQUEID WHERE"
        var lblcriteria;
        
        
        


        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "([STF_DEPARTMENT] in ('" + branch.join("','")  +  "'))";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        } 
        if(SvcType != ""){
            this.s_SvcTypeSQL = " ([Service] in ('" + SvcType.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_SvcTypeSQL}
        }
        if(Staff != ""){
            this.s_StfSQL = "([CurrentAssignee] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(incidenttype != ""){
            this.s_IncedentTypeSQL = "(i.[Type] in ('" + incidenttype.join("','")  +  "'))";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_IncedentTypeSQL};            
        }
        if(category != ""){
            this.s_incidentCategorySQL = "(i.[Status] in ('" + category.join("','")  +  "'))";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_incidentCategorySQL};            
        }

        if (category != ""){
            lblcriteria =" Incident Category: " + category.join(",")+ "; "}
            else{lblcriteria = "All Categories,"}
        if (incidenttype != ""){
            lblcriteria =lblcriteria + " Incedent Type: " + incidenttype.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Incedent Types,"}
        if (startdate != ""){ 
            lblcriteria = lblcriteria + " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (SvcType != ""){ 
                lblcriteria =lblcriteria + " Service Type " + SvcType.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Svc. Types"}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        if (Staff != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + Staff.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff ,"}
                                                
        fQuery = fQuery + " ORDER BY DATE  "
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"elFITHKE2y1STfUR"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    StaffTraining(branch,manager,region,program,staffteam,trainingtype,stfgroup,startdate,enddate){
        
        
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal] AS ExpiryDate , [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Notes], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno], [Staff].[STF_DEPARTMENT], [Staff].[StaffGroup]  FROM Roster INNER JOIN STAFF on Roster.[Carer Code] = Staff.Accountno              INNER JOIN ITEMTYPES I ON Roster.[Service Type] = I.TITLE  WHERE  ([Carer Code] <> '!INTERNAL' AND [Carer Code] <> '!MULTIPLE') AND ([Carer Code] <> '!INTERNAL' AND [Carer Code] <> '!MULTIPLE') AND I.MINORGROUP = 'TRAINING'   "

        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "R.[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        } 
        if(region != ""){
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " Date BETWEEN '" +startdate + ("'AND'") + enddate  +  "')";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }

        if(trainingtype != ""){
            this.s_TrainingTypeSQL = " ([Service Type] in ('" + trainingtype.join("','")  +  "'))";
            if (this.s_TrainingTypeSQL != ""){ fQuery = fQuery + " AND " + this.s_TrainingTypeSQL}
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(StaffGroup in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([STAFFTEAM] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        


        if (startdate != ""){ 
          var  lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "}
        if (staffteam != ""){ 
                lblcriteria =lblcriteria + " Staff Team: " + staffteam.join(",")+ "; "}
                else{lblcriteria = lblcriteria + " All Staff Groups,"}
        if (branch != ""){ 
            lblcriteria =lblcriteria +  " Branches:" + branch.join("','") + "; "        } 
                else{lblcriteria =lblcriteria + " All Branches "}

        if (trainingtype != ""){ 
            lblcriteria =lblcriteria +  " Training Type:" + trainingtype.join("','") + "; "        } 
             else{lblcriteria =lblcriteria + " All Training types "}
         
          if (manager != ""){
             lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Managers,"}
         
         
         if (region != ""){ 
             lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Regions,"}
         
        
         if (program != ""){ 
             lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
             else{lblcriteria = lblcriteria + "All Programs."}

        
        if (stfgroup != ""){ 
        lblcriteria =lblcriteria + " Staff Group: " + stfgroup.join(",")+ "; "}
        else{lblcriteria = lblcriteria + "All Staff Groups,"}
                                                            
        fQuery = fQuery + " ORDER BY [Carer Code], Date, [Start Time] "
    /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
    console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"7o1ScJuvyRZk8xZ6"  },    
        "options": {
            "reports": { "save": false },
         
            "sql":fQuery,
            "Criteria":lblcriteria 
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }
    
    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
       
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    AuditRegister(who,descibe,traccsuser,startdate,enddate){

        var fQuery = "SELECT RecordNumber,Convert(nvarchar, ActionDate,23) as ActionDate, Operator, Actionon, whowhatcode, TraccsUser , AuditDescription FROM audit WHERE "
        var lblcriteria;
            
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (ActionDate  >=  '" +startdate + ("' AND ActionDate <  '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if(traccsuser != ""){
            this.s_TraccsuserSQL = "R.[RECIPIENT_COOrdinator] in ('" + traccsuser.join("','")  +  "')";            
            if (this.s_TraccsuserSQL != ""){ fQuery = fQuery + " AND " + this.s_TraccsuserSQL};
        }
        if(descibe != ""){
            this.s_DescribeSQL = "AuditDescription like ('" + descibe.join("','")  +  "')";            
            if (this.s_DescribeSQL != ""){ fQuery = fQuery + " AND " + this.s_DescribeSQL};
        }
        if(who != ""){
            this.s_whowhatSQL = "whowhatcode like ('" + who.join("','")  +  "')";            
            if (this.s_whowhatSQL != ""){ fQuery = fQuery + " AND " + this.s_whowhatSQL};
        }

        if (startdate != ""){ 
              lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
              else{lblcriteria =  " All Dated "}
        if (traccsuser != ""){ 
            lblcriteria =lblcriteria + " Traccs Users: " + traccsuser.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Users,"}
        if (descibe != ""){ 
            lblcriteria =lblcriteria + " Description: " + descibe.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Descriptions,"}
        if (who != ""){ 
            lblcriteria =lblcriteria + " Who/What: " + who.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Who/what,"}


        fQuery = fQuery + " ORDER BY ActionDate "
        
        //console.log(fQuery)
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":"YD5T4jvODtGyusH8"  },    
                "options": {
                    "reports": { "save": false },
                
                    "sql":fQuery,
                    "Criteria":lblcriteria,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    ProgramActivityStatusAudit(program){

        var fQuery = "SELECT H.[NAME], H.[TYPE], S.[SERVICE TYPE], S.SERVICESTATUS FROM HUMANRESOURCETYPES H INNER JOIN SERVICEOVERVIEW S ON CONVERT(VARCHAR(15),H.RECORDNUMBER) = S.PERSONID WHERE [GROUP] = 'PROGRAMS' AND (ENDDATE >= getDate() OR ENDDATE IS NULL) ";
        var lblcriteria;

        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if (program != ""){ 
            lblcriteria = " Programs " + program.join(",")+ "; "}
            else{lblcriteria = "All Programs."}


            fQuery = fQuery + " ORDER BY H.[NAME], S.[SERVICE TYPE] "
        
            //console.log(fQuery)
            
                this.drawerVisible = true;
            
                const data =    {
                    "template": {  "_id":"4bzgeVt7vedkx8Uh"  },    
                    "options": {
                        "reports": { "save": false },
                    
                        "sql":fQuery,
                        "Criteria":lblcriteria,
                        
                                
                    }
                }
            
            
                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',            
                }
            
                const requestOptions = {
                    headers: new HttpHeaders(headerDict)
                };
            
                this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
                .subscribe((blob: any) => {
                    console.log(blob);
                    
                    let _blob: Blob = blob;
                
                    let fileURL = URL.createObjectURL(_blob);
                    this.pdfTitle = "Reports.pdf"
                    this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            
                }, err => {
                    console.log(err);
                });  
    
    
    }
    MTARegister(program,manager,Staff,stfgroup,recipient,startdate,enddate){
        
        
        var fQuery = "select t0.*, ez.jobno, Convert(varchar(5),ez.datetime,108) AS ActualStart, DATEDIFF(n, t0.[Start Time], CONVERT(nVarchar(5),[DateTime],114)) AS StartVAR,Convert(varchar(5), ez.lodatetime,108) AS ActualEnd,  DATEDIFF(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), CONVERT(nVarchar(5),ez.[LODateTime],114)) AS EndVAR, Round(ez.WorkDuration * 60, 0) AS [ActualDuration], DATEDIFF(n, DateAdd(Minute, (t0.[Duration] * 5), t0.[Start Time]), CONVERT(nVarchar(5),ez.[LODateTime],114)) - DATEDIFF(n, t0.[Start Time], CONVERT(nVarchar(5),[DateTime],114)) AS [DurationVAR], CASE WHEN (LOErrorCode = 0 AND ErrorCode = 0) THEN 'APP LOGON/APP LOGOFF' WHEN (LOErrorCode = 0 AND ErrorCode = 1) THEN 'MANUAL LOGON/APP LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 0) THEN 'APP LOGON/MANUAL LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 1) THEN 'MANUAL LOGON/MANUAL LOGOFF' ELSE CASE WHEN ErrorCode = 1 THEN 'MANUAL LOGON' WHEN ErrorCode = 0 THEN 'APP LOGON' WHEN IsNull(ez.DateTime,'')= ''  THEN 'NORMAL LOGOFF'  ELSE '' END END AS [Completion Status] from (    select    ro.RecordNo,    ro.[Client Code] as ClientCode,    ro.[Carer code] as StaffCode,     ro.[Service Type] as ItemCode,    ro.[Date],     ro.[Start Time],    ro.[Duration],    Convert(nvarchar(5), DateAdd(Minute, (ro.[Duration] * 5), ro.[Start Time]), 114) As [RosteredEnd],    Round(Duration * 5, 0) AS [RosteredDuration],    re.PANNoGoTH,     re.PANNoWorkTH,     re.PANEarlyStartTH,     re.PANLateStartTH,     re.PANEarlyFinishTH,     re.PANLateFinishTH,     re.PANOverstayTH,     re.PANUnderstayTH,     re.UniqueID AS RecipientID,    CASE WHEN st.[LastName] <> '' THEN st.[LastName] ELSE '?' END + ', ' +     CASE WHEN st.[FirstName] <> '' THEN st.[FirstName] ELSE '?' END AS [Staff] ,     CASE            WHEN re.Accountno = '!MULTIPLE' THEN ro.ServiceSetting            WHEN re.Accountno = '!INTERNAL' THEN '[Service Type]'            WHEN re.[Surname/Organisation] <> '' THEN  re.[Surname/Organisation] + CASE WHEN re.[FirstName] <> '' THEN ', ' + re.[FirstName] ELSE '?' END  END AS [Recipient]    from    roster ro    inner join recipients re on ro.[Client Code] = re.accountno    inner join staff st on ro.[carer code] = st.accountno    inner join itemtypes it on ro.[service type] = it.title    where  (ro.[Carer Code] > '!MULTIPLE') AND ro.Type <> 9    and isnull(it.taexclude1, 0) = 0 ) t0 left join ezitracker_log ez on t0.recordno = ez.jobno ";
        var lblcriteria;

        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (ro.Date BETWEEN  '" +startdate + ("' AND '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if(program != ""){
            this.s_ProgramSQL = " (ro.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "re.[RECIPIENT_COORDINATOR] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(Staff != ""){
            this.s_StfSQL = "(ro.[carer code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(st.[STAFFGROUP] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "ro.[client code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        






        if (program != ""){ 
            lblcriteria = " Programs " + program.join(",")+ "; "}
            else{lblcriteria = "All Programs."}
        if (manager != ""){
            lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Managers,"}
        if (Staff != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + Staff.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff ,"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Staff Group: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
            if (recipient != ""){
                lblcriteria =lblcriteria + " Recipients: " + recipient.join(",")+ "; "}
                else{lblcriteria =lblcriteria + "All Recipients,"}
        if (startdate != ""){ 
            lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "}


            fQuery = fQuery + "  ORDER BY staffcode, [Date], [Start Time] "
        
            //console.log(fQuery)
            
                this.drawerVisible = true;
            
                const data =    {
                    "template": {  "_id":"l4nWCteKG2bDS0QA"  },    
                    "options": {
                        "reports": { "save": false },
                    
                        "sql":fQuery,
                        "Criteria":lblcriteria,
                        
                                
                    }
                }
            
            
                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',            
                }
            
                const requestOptions = {
                    headers: new HttpHeaders(headerDict)
                };
            
                this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
                .subscribe((blob: any) => {
                    console.log(blob);
                    
                    let _blob: Blob = blob;
                
                    let fileURL = URL.createObjectURL(_blob);
                    this.pdfTitle = "Reports.pdf"
                    this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            
                }, err => {
                    console.log(err);
                });  

    }
    RosterOverlapRegister(program,branch,Staff,recipient,startdate,enddate){
        
        
        var fQuery = "SELECT RECORDNO, [CLIENT CODE], [CARER CODE], [SERVICE TYPE], PROGRAM, [DATE], [START TIME], DURATION * 5 as DURATION,  ST.[STAFFGROUP] ,[STF_DEPARTMENT] AS BRANCH  FROM ROSTER ro INNER JOIN STAFF ST ON ro.[CARER CODE] = ST.[ACCOUNTNO] LEFT JOIN ITEMTYPES IT ON  IT.Title = RO.[Service Type] Where Exists ( SELECT * FROM ROSTER ro2 Where ro.[CARER CODE] = ro2.[CARER CODE] AND ro.RECORDNO <> ro2.RECORDNO AND ro.[DATE] = ro2.[DATE] AND ro.BLOCKNO >= ro2.BLOCKNO AND ro.BLOCKNO < ro2.BLOCKNO+ro2.DURATION AND TYPE NOT IN (13) )    AND ro.[Type] NOT IN (13) AND ro.[CARER CODE] > '!z'     AND st.[STAFFGROUP] <> 'NON-STAFF' AND  ST.CATEGORY = 'STAFF'    AND InfoOnly <> 1    ";
        var lblcriteria;

        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (ro.Date BETWEEN  '" +startdate + ("' AND '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if(program != ""){
            this.s_ProgramSQL = " (ro.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if (branch != ""){
            this.s_BranchSQL = "[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        } 
        
        if(Staff != ""){
            this.s_StfSQL = "(ro.[carer code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        
        if(recipient != ""){
            this.s_RecipientSQL = "ro.[client code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        






        if (program != ""){ 
            lblcriteria = " Programs " + program.join(",")+ "; "}
            else{lblcriteria = "All Programs."}
        
        if (Staff != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + Staff.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff ,"}
        
        if (recipient != ""){
            lblcriteria =lblcriteria + " Recipients: " + recipient.join(",")+ "; "}
            else{lblcriteria =lblcriteria + "All Recipients,"}
        if (startdate != ""){ 
            lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria +  " Branches:" + branch.join("','") + "; "        } 
                else{lblcriteria =lblcriteria + " All Branches "}


            fQuery = fQuery + " ORDER BY [Carer Code], [Date], [Start Time], [Client Code]  "
        
            //console.log(fQuery)
            
                this.drawerVisible = true;
            
                const data =    {
                    "template": {  "_id":"lK0psB9gWfDQkZhG"  },    
                    "options": {
                        "reports": { "save": false },
                    
                        "sql":fQuery,
                        "Criteria":lblcriteria,
                        
                                
                    }
                }
            
            
                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',            
                }
            
                const requestOptions = {
                    headers: new HttpHeaders(headerDict)
                };
            
                this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
                .subscribe((blob: any) => {
                    console.log(blob);
                    
                    let _blob: Blob = blob;
                
                    let fileURL = URL.createObjectURL(_blob);
                    this.pdfTitle = "Reports.pdf"
                    this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            
                }, err => {
                    console.log(err);
                });  

    }
    MTAVerificationAudit(program,manager,Staff,stfgroup,recipient,startdate,enddate){
        
        
        var fQuery = "select t0.RecordNo,t0.Date,Recipient_Signature,ClientCode,StaffCode, ez.jobno,CONVERT(VARCHAR(5),ez.datetime, 108)  AS ActualStart,CONVERT(VARCHAR(5),ez.lodatetime, 108)  AS ActualEnd,  Round(ez.WorkDuration * 60, 0) AS [ActualDuration], CASE WHEN (LOErrorCode = 0 AND ErrorCode = 0) THEN 'APP LOGON/APP LOGOFF'      WHEN (LOErrorCode = 0 AND ErrorCode = 1) THEN 'MANUAL LOGON/APP LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 0) THEN 'APP LOGON/MANUAL LOGOFF'      WHEN (LOErrorCode = 1 AND ErrorCode = 1) THEN 'MANUAL LOGON/MANUAL LOGOFF'      ELSE CASE WHEN ErrorCode = 1 THEN 'MANUAL LOGON' WHEN ErrorCode = 0 THEN 'APP LOGON'                WHEN IsNull(ez.DateTime,'')= ''  THEN 'NORMAL LOGOFF'  ELSE '' END END AS [Completion Status] from (    select    ro.RecordNo,    ro.Recipient_Signature,    ro.[Client Code] as ClientCode,    ro.[Carer code] as StaffCode,     ro.[Service Type] as ItemCode,    ro.[Date],     ro.[Start Time],    ro.[Duration],    Convert(nvarchar(5), DateAdd(Minute, (ro.[Duration] * 5), ro.[Start Time]), 114) As [RosteredEnd],    Round(Duration * 5, 0) AS [RosteredDuration],    re.UniqueID AS RecipientID,    CASE WHEN st.[LastName] <> '' THEN st.[LastName] ELSE '?' END + ', ' +         CASE WHEN st.[FirstName] <> '' THEN st.[FirstName] ELSE '?' END AS [Staff] ,     CASE WHEN re.Accountno = '!MULTIPLE' THEN ro.ServiceSetting   WHEN re.Accountno = '!INTERNAL' THEN '[Service Type]'            WHEN re.[Surname/Organisation] <> '' THEN  re.[Surname/Organisation] + CASE WHEN re.[FirstName] <> '' THEN ', ' + re.[FirstName] ELSE '?' END  END AS [Recipient]    from    roster ro    inner join recipients re on ro.[Client Code] = re.accountno    inner join staff st on ro.[carer code] = st.accountno    inner join itemtypes it on ro.[service type] = it.title    where    (ro.Date BETWEEN '2019/08/01' AND '2020/08/31') AND (ro.[Carer Code] > '!MULTIPLE') AND ro.Type <> 9    and isnull(it.taexclude1, 0) = 0 ) t0 left join ezitracker_log ez on t0.recordno = ez.jobno  WHERE  ISNULL(ez.JobNo, '') <> ''  ";
        var lblcriteria;

        
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (ro.Date BETWEEN  '" +startdate + ("' AND '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + "  " + this.s_DateSQL};            
        }
        if(program != ""){
            this.s_ProgramSQL = " (ro.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "re.[RECIPIENT_COORDINATOR] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(Staff != ""){
            this.s_StfSQL = "(ro.[carer code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "(st.[STAFFGROUP] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "ro.[client code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        






        if (program != ""){ 
            lblcriteria = " Programs " + program.join(",")+ "; "}
            else{lblcriteria = "All Programs."}
        if (manager != ""){
            lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Managers,"}
        if (Staff != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + Staff.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff ,"}
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Staff Group: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
            if (recipient != ""){
                lblcriteria =lblcriteria + " Recipients: " + recipient.join(",")+ "; "}
                else{lblcriteria =lblcriteria + "All Recipients,"}
        if (startdate != ""){ 
            lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =  " All Dated "}


            fQuery = fQuery + "  ORDER BY staffcode, [Date], [Start Time] "
        
            //console.log(fQuery)
            
                this.drawerVisible = true;
            
                const data =    {
                    "template": {  "_id":"dpEyUTAAn5HXqGhK"  },    
                    "options": {
                        "reports": { "save": false },
                    
                        "sql":fQuery,
                        "Criteria":lblcriteria,
                        
                                
                    }
                }
            
            
                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',            
                }
            
                const requestOptions = {
                    headers: new HttpHeaders(headerDict)
                };
            
                this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
                .subscribe((blob: any) => {
                    console.log(blob);
                    
                    let _blob: Blob = blob;
                
                    let fileURL = URL.createObjectURL(_blob);
                    this.pdfTitle = "Reports.pdf"
                    this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            
                }, err => {
                    console.log(err);
                });  

    }
    UnsedFunding(program,manager,recipient,region){
        
        
        var fQuery = "Select Recipients.UniqueID, Recipients.AccountNo, Recipients.Branch, Recipients.AdmissionDate,Recipients.DischargeDate, CASE WHEN Recipients.[Surname/Organisation] <> '' THEN [Surname/Organisation] ELSE '*' END + ', ' + CASE WHEN Recipients.FirstName <> '' THEN FirstName ELSE '*' END AS NameDetails, Recipients.RECIPIENT_Coordinator, RecipientPrograms.Program, RecipientPrograms.Quantity, RecipientPrograms.ItemUnit, RecipientPrograms.PerUnit, RecipientPrograms.TimeUnit, RecipientPrograms.Period, Convert(nvarchar,RecipientPrograms.ExpiryDate,23) as ExpiryDate , RecipientPrograms.TotalAllocation, RecipientPrograms.Used, RecipientPrograms.Remaining FROM RecipientPrograms INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID  WHERE AccountNo > '!z' AND ((Recipients.AdmissionDate is NOT NULL) and (Recipients.DischargeDate is NULL))    ";
        var lblcriteria;

        
        //AND AccountNo BETWEEN '**BROWN D' AND '**BROWN D' AND ([Program] BETWEEN '!INTERNAL' AND '!INTERNAL') AND ([RECIPIENT_Coordinator] BETWEEN 'ANNE MILLER' AND 'ANNE MILLER') AND ([AgencyDefinedGroup] BETWEEN 'ARUNDEL' AND 'ARUNDEL') 
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "[RECIPIENT_Coordinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
                
        if(recipient != ""){
            this.s_RecipientSQL = "AccountNo in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(region != ""){
            this.s_CategorySQL = "[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        






        if (program != ""){ 
            lblcriteria = " Programs " + program.join(",")+ "; "}
            else{lblcriteria = "All Programs."}
        if (manager != ""){
            lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Managers,"}
        
        if (recipient != ""){
            lblcriteria =lblcriteria + " Recipients: " + recipient.join(",")+ "; "}
            else{lblcriteria =lblcriteria + "All Recipients,"} 
        if (region != ""){ 
            lblcriteria =lblcriteria + " Regions: " + region.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Regions,"}       


            fQuery = fQuery + " ORDER BY Recipients.AccountNo "
        
        //    console.log(fQuery)
            
                this.drawerVisible = true;
            
                const data =    {
                    "template": {  "_id":"X641oa708kHECwiT"  },    
                    "options": {
                        "reports": { "save": false },
                    
                        "sql":fQuery,
                        "Criteria":lblcriteria,
                        
                                
                    }
                }
            
            
                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',            
                }
            
                const requestOptions = {
                    headers: new HttpHeaders(headerDict)
                };
            
                this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
                .subscribe((blob: any) => {
                    console.log(blob);
                    
                    let _blob: Blob = blob;
                
                    let fileURL = URL.createObjectURL(_blob);
                    this.pdfTitle = "Reports.pdf"
                    this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            
                }, err => {
                    console.log(err);
                });  

    }
    ReportUtilisation(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT  [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE Round([Roster].[Duration] / 12,2) END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]    "
        var lblcriteria;

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + "WHERE  ([Client Code] > '!MULTIPLE')";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
       // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         switch (rptname){
            case 'btn-FORPT-ProgramUtilisation':
                var Title = "RECIPIENT PROGRAM UTILISATION REPORT";
                var Report_Definer = "This report summarises all services delivered to Recipients by the Agency, (either by Agency Staff or Brokered organisations acting on behalf of the Agency, and Travel Time Attributable to Recipients), during the selected period."
                fQuery = fQuery + "And (([Roster].[Type] IN (1, 2, 3, 5, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] > '!MULTIPLE') ";
                fQuery = fQuery + " ORDER BY [Client Code], [Program], Date, [Start Time] "
               
                switch (format) {
                    case "Detailed":
                        this.reportid = " 20xwMDHmzWQlOD6N" ;
                        
                        break;
                
                    default:                        
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
                        this.reportid = "0ZnxAZqeBt95hPdb" ;
                        
                        break;
                
                    default:                        
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
                        this.reportid = "KNUFzfW2y0u1Vmp8" ;
                        
                        break;
                
                    default:                        
                        this.reportid = "QRa7a6vcHl74gzKk "
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
                        this.reportid = "bS5eYd0QZKtRh7kR" ;
                        
                        break;
                
                    default:                        
                        this.reportid = "QRa7a6vcHl74gzKk "
                        break;
                }
                
                break;

        }//
            

        
        
       // console.log(fQuery)
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,

                    "txtCriteriaStmt" : Report_Definer,

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }

    PayTypeProgram(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE Round([Roster].[Duration] / 12,2) END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;
        
        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + "WHERE  ([Carer Code] > '!MULTIPLE')  And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION')"


        var Title = "PAY TYPE PROGRAM REPORT";
        var Report_Definer = "This report includes all Services attributed to Funded Programs during the selected period.It includes any allowances. (It does NOT include pay details for Brokerage Organisations)"


        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        ///console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
                
               
                fQuery = fQuery + "ORDER BY [Service Description], [Program], Date, [Start Time]";
               
       // console.log(fQuery)

       switch (format) {
        case "Detailed":
            this.reportid = "DeKVDYBlePosUVbB" ;                       
        break;
        default:                        
            this.reportid = "gHY4F0UbTNzf4oPk"
        break;
        }
       
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                   

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtTitle":Title,
                    
                    "txtCriteriaStmt" : Report_Definer,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }

    DailyStaffHrs(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE Round([Roster].[Duration] / 12,2) END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;
      
        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery +"WHERE  ([Carer Code] > '!MULTIPLE') And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION')  "
         
        var Title = "STAFF DAILY HOURS REPORT";
         var Report_Definer = "This report includes all amounts paid to Staff employed by the Agency during the selected period.It includes any allowances. (It does NOT include Brokerage or Volunteer activities)";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + "ORDER BY [Carer Code], Date, [Service Type], [Start Time]";
               
       // console.log(fQuery)

       switch (format) {
        case "Detailed":
            this.reportid = "br0hApzbOEUutqz0" ;                       
        break;
        default:                        
            this.reportid = "VFZKXpQuPdRjOz7U"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    ProgramReport(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
              

        var fQuery = " SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
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
        var reportid;
        
         

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         switch (rptname) {            
            case 'btn-FORPT-ProgramStaffUtilized':
                fQuery = fQuery + "ORDER BY [Program], [Carer Code], Date, [Start Time]";
                var Title = "PROGRAM STAFF UTILISED REPORT";
                var Report_Definer = "This report summarises all services delivered to Recipients by the Agency, (either by Agency Staff or Brokered organisations acting on behalf of the Agency, and Travel Time Attributable to Recipients), during the selected period."

             
             switch (format) {
                 case "Detailed":
                     reportid = "MePWCZQThe0CAnu5" ;
                     break;
             
                 default:
                    reportid = "IlzJ8y3CcohttpLy"
                     break;
             }


                break;
            case 'btn-FORPT-ProgramRecipientServiced':
                fQuery = fQuery + "ORDER BY [Program], [Client Code], Date, [Start Time]";
                var Title = "PROGRAM RECIPIENT SERVICED REPORT";
                var Report_Definer = "This report includes all Services attributed to Funded Programs during the selected period.It optionally includes allowances or Staff Administration."
               
                switch (format) {
                    case "Detailed":
                        reportid = "dBfGjQMGcDFpS0tN" ;
                        break;
                
                    default:
                       reportid = "IlzJ8y3CcohttpLy"
                        break;
                }

                break;
            case 'btn-FORPT-ProgramActivitySpread':
                fQuery = fQuery + "ORDER BY [Program], [Service Type], Date, [Start Time]";
                var Title = "PROGRAM ACTIVITY SPREAD REPORT";
                var Report_Definer = "This report includes all Services attributed to Funded Programs during the selected period.It includes Staff allowances"

             
             switch (format) {
                 case "Detailed":
                     reportid = "Oc4nxLXjTPbGcZQH" ;
                     break;
             
                 default:
                    reportid = "IlzJ8y3CcohttpLy"
                     break;
             }


                break;
        
            default:
                break;
        }
          
               
               
               
        //console.log(fQuery)
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    ProgramBillingReport(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;
        var reportid;

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + "WHERE ([Client Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') AND ([Roster].[Type] = 2 OR ([Roster].[Type] = 4 AND [Roster].[Carer Code] = '!INTERNAL') OR ([Roster].[Type] = 1) OR [Roster].[Type] = 3 OR [Roster].[Type] = 5 OR [Roster].[Type] = 7 OR [Roster].[Type] = 8 OR [Roster].[Type] = 10 OR [Roster].[Type] = 11 OR [Roster].[Type] = 14 OR [Roster].[Type] = 12)"

        

        
         var Title = "PROGRAM BILLING REPORT";
         var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();//.substring(0,10);
           console.log(strkey);
           switch (strkey) {
           
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
       // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + " ORDER BY [Program], [Client Code], Date, [Start Time]";
               
     //   console.log(fQuery)
     switch (format) {
        case "Detailed":
            reportid = "dBfGjQMGcDFpS0tN" ;
            break;
    
        default:
           reportid = "7RdGSvcsDNba5xah"
            break;
    }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    ProgramBudgetAudit(branch,program){

        var fQuery = "SELECT H.[NAME] AS PROGRAM, H.FAX AS [GL CODE], I.ROSTERGROUP AS [ACTIVITY TYPE], I.TITLE AS [ACTIVITY NAME], B.HOURS AS [BUDGET OUTPUTS] FROM HUMANRESOURCETYPES H LEFT JOIN BUDGETS B ON ( H.[NAME] = B.PROGRAM)  LEFT JOIN ITEMTYPES I ON (I.TITLE = B.ACTIVITY AND I.PROCESSCLASSIFICATION = 'OUTPUT') WHERE H.[GROUP] = 'PROGRAMS'";
        var lblcriteria;

        if(program != ""){
            this.s_ProgramSQL = " (H.[Name] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(branch != ""){
            this.s_BranchSQL = " (B.BRANCH in ('" + branch.join("','")  +  "'))";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
        }
        if (branch != ""){ 
            lblcriteria = " Branch " + branch.join(",")+ "; "}
            else{lblcriteria = "All Programs."}
        if (program != ""){ 
            lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
            else{lblcriteria =lblcriteria +  "All Programs."}


            fQuery = fQuery + " ORDER BY H.[Name], I.TITLE "
        
           // console.log(fQuery)
            
                this.drawerVisible = true;
            
                const data =    {
                    "template": {  "_id":"651WtSGmEJ257yjD"  },    
                    "options": {
                        "reports": { "save": false },
                    
                        "sql":fQuery,
                        "Criteria":lblcriteria,
                        
                                
                    }
                }
            
            
                const headerDict = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',            
                }
            
                const requestOptions = {
                    headers: new HttpHeaders(headerDict)
                };
            
                this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
                .subscribe((blob: any) => {
                    console.log(blob);
                    
                    let _blob: Blob = blob;
                
                    let fileURL = URL.createObjectURL(_blob);
                    this.pdfTitle = "Reports.pdf"
                    this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            
                }, err => {
                    console.log(err);
                });  
    
    
    }
    ProgramSummaryReport(branch,manager,region,program){
        
        
        var fQuery = "SELECT ACCOUNTNO, PROGRAM, ALLOWED, USEDAMOUNT, ALLOWED-USEDAMOUNT AS BALANCE, COSTTYPE, AP_PERUNIT, AP_PERIOD,EXPIREUSING , ALERTSTARTDATE,  Convert(nvarchar,RENEWDATE,23) as RENEWDATE, [REDAMOUNT], [ORANGEAMOUNT], [YELLOWAMOUNT],   BRANCH, [RECIPIENT_COORDINATOR], [AGENCYDEFINEDGROUP] FROM ( SELECT ACCOUNTNO,PROGRAM,ISNULL(AP_BASEDON, 0) AS ALLOWED, ISNULL(AP_COSTTYPE, '') AS COSTTYPE, ISNULL(AP_PERUNIT, '') AS AP_PERUNIT,ISNULL(AP_PERIOD, '') AS AP_PERIOD,ISNULL(EXPIREUSING, '') AS EXPIREUSING,ISNULL(ALERTSTARTDATE, '') AS ALERTSTARTDATE, CASE WHEN AP_PERIOD = 'DAY' THEN DATEADD(DAY,1,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'WEEK' THEN DATEADD(WEEK,1,RP.ALERTSTARTDATE)WHEN AP_PERIOD = 'FORTNIGHT' THEN DATEADD(WEEK,2,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'MONTH' THEN DATEADD(MONTH,1,RP.ALERTSTARTDATE)WHEN AP_PERIOD = '6 WEEKS' THEN DATEADD(WEEK,6,RP.ALERTSTARTDATE)WHEN AP_PERIOD = 'QUARTER' THEN DATEADD(MONTH,3,RP.ALERTSTARTDATE)WHEN AP_PERIOD = '6 MONTHS' THEN DATEADD(MONTH,6,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'YEAR' THEN DATEADD(MONTH,12,RP.ALERTSTARTDATE) END AS RENEWDATE,ISNULL(AP_REDQTY, 0) AS [REDAMOUNT], ISNULL(AP_ORANGEQTY, 0) AS [ORANGEAMOUNT], ISNULL(AP_YELLOWQTY, 0) AS [YELLOWAMOUNT],(SELECT ISNULL(SUM(ADMINAMOUNT), 0) + ISNULL(SUM(SERVICEAMOUNT), 0) AS GTOTAL FROM (SELECT CASE WHEN ISNULL(IT.MAINGROUP, 'DIRECT SERVICE') IN ('PACKAGE ADMIN', 'CASE MANAGEMENT') THEN ROUND((DURATION * 5) / 60, 2) END AS ADMINAMOUNT, CASE WHEN ISNULL(IT.MAINGROUP, 'DIRECT SERVICE') NOT IN ('PACKAGE ADMIN', 'CASE MANAGEMENT') THEN ROUND((DURATION * 5) / 60, 2) END AS SERVICEAMOUNT FROM ROSTER RO INNER JOIN ITEMTYPES IT ON RO.[SERVICE TYPE] = IT.TITLE Where RO.[CLIENT CODE] = R.ACCOUNTNO AND RO.[PROGRAM] = RP.PROGRAM AND ISNULL(IT.[EXCLUDEFROMUSAGESTATEMENTS], 0) = 0 AND NOT (RO.[TYPE] = 9 AND RO.[SERVICE DESCRIPTION] = 'CONTRIBUTION') AND RO.DATE > '2000/01/01' AND  (RO.[DATE] BETWEEN RP.ALERTSTARTDATE AND  CASE WHEN AP_PERIOD = 'DAY' THEN DATEADD(DAY,1,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'WEEK' THEN DATEADD(WEEK,7,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'FORTNIGHT' THEN DATEADD(WEEK,2,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'MONTH' THEN DATEADD(MONTH,1,RP.ALERTSTARTDATE) WHEN AP_PERIOD = '6 WEEKS' THEN DATEADD(WEEK,6,RP.ALERTSTARTDATE) WHEN AP_PERIOD = 'QUARTER' THEN DATEADD(MONTH,3,RP.ALERTSTARTDATE) WHEN AP_PERIOD = '6 MONTHS' THEN DATEADD(MONTH,6,RP.ALERTSTARTDATE)WHEN AP_PERIOD = 'YEAR' THEN DATEADD(MONTH,12,RP.ALERTSTARTDATE) END )) AS T ) AS USEDAMOUNT,  R.BRANCH, [RECIPIENT_COORDINATOR], [AGENCYDEFINEDGROUP] FROM RECIPIENTS R INNER JOIN RECIPIENTPROGRAMS RP ON R.UNIQUEID = RP.PERSONID ) AS T2 WHERE ACCOUNTNO > '!Z'  "
        var lblcriteria;
        if (branch != ""){
            this.s_BranchSQL = "BRANCH in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}
            
        } 
         if(manager != ""){
            this.s_CoordinatorSQL = "[RECIPIENT_COOrdinator] in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
            
        } 
        if(region != ""){
            this.s_CategorySQL = "[AgencyDefinedGroup] in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL}
        }
        if(program != ""){
            this.s_ProgramSQL = " (PROGRAM in ('" + program.join("','")  +  "'))";
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
        
                                                            
        fQuery = fQuery + " ORDER BY ACCOUNTNO, PROGRAM "
        
        /*   
    console.log(s_BranchSQL)
    console.log(s_CategorySQL)
    console.log(s_CoordinatorSQL)*/
   // console.log(fQuery)
   // console.log(lblcriteria)

   
   
    const data =    {
        
        "template": {  "_id":"JzFkyOS6RlKiOeqD"  },    
        "options": {
            "reports": { "save": false },
         //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
            "sql":fQuery,
            "Criteria" :  lblcriteria
        }
    }


    const headerDict = {
        
        'Content-Type': 'application/json',
        'Accept': 'application/json',
               
    }
      
    const requestOptions = {
        headers: new HttpHeaders(headerDict),
        credentials:true
    };
  
  //this.rpthttp
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers,  responseType: 'blob', })
        .subscribe((blob: any) => {
            console.log(blob);
            
            let _blob: Blob = blob;
           
            let fileURL = URL.createObjectURL(_blob);
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });    this.drawerVisible = true;     
    }
    ActivityGroupReport(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + "WHERE  ([Client Code] > '!MULTIPLE')  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')"

        
         var Title = "ACTIVITY GROUP REPORT";
         var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
       // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + " ORDER BY [Service Type], [Anal], Date, [Start Time] ";
               
       // console.log(fQuery)

       switch (format) {
        case "Detailed":
            this.reportid = "s7xkRQoypsgZDEJi" ;                       
        break;
        default:                        
            this.reportid = "EUpoRvslDL2jReMC"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffActivityReport(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + "WHERE ([Carer Code] > '!MULTIPLE')  And ( [Roster].[Type] In (1,2,5,6,7,8,10,11,12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') ) "
         
        var Title = "STAFF ACTIVITY REPORT";
         var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + "ORDER BY [Carer Code], [Service Type], Date, [Start Time]";
               
//        console.log(fQuery)

            switch (format) {
                case "Detailed":
                    this.reportid = "BkY2eCxEZ9xs7JdN" ;                       
                break;
                default:                        
                    this.reportid = "Cjq0J0FwEE9NpEjG"
                break;
                }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffAdminReport(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  WHERE ([Carer Code] <> '!MULTIPLE')  And [Roster].[Type] in (1, 6)"
        var lblcriteria;
        
        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        
        
         var Title = "STAFF ADMIN REPORT";
         var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
       // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + "ORDER BY [Service Type], [Client Code], Date, [Start Time]";
               
      //  console.log(fQuery)

      switch (format) {
        case "Detailed":
            this.reportid = "PWrjCCfGSodTi4k5" ;                       
        break;
        default:                        
            this.reportid = "52x7yFFEwpini1aA"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffRecipientServiced(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;
      
        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery +"WHERE ([Carer Code] > '!MULTIPLE')  And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 9 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6)) And [Client Code] <> '!MULTIPLE' AND ([Service Type] <> 'CONTRIBUTION') "
         
        var Title = "STAFF RECIPIENT REPORT -SUMMARY";
        var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + "ORDER BY [Carer Code], [Client Code], Date, [Start Time]";
               
       // console.log(fQuery)

       switch (format) {
        case "Detailed":
            this.reportid = "pcOEeUeWKPGaGFPA" ;                       
        break;
        default:                        
            this.reportid = "OTUPu95cLd6uPgd5"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffPaysReport(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]"
        var lblcriteria;
      
        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery +"WHERE ([Carer Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') And ([Roster].[Type] IN (1,2, 5, 6, 7, 8, 9, 10, 11, 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL')) And [Carer Code] <> '!MULTIPLE'AND ([service type] <> 'CONTRIBUTION')";
         
        var Title = "STAFF PAYS REPORT -SUMMARY";
        var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        //console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + "ORDER BY [Carer Code], [Service Description], Date, [Start Time]";
               
        //console.log(fQuery)

        switch (format) {
            case "Detailed":
                this.reportid = "3tnMUYUAp8WHDU1Z" ;                       
            break;
            default:                        
                this.reportid = "OTUPu95cLd6uPgd5"
            break;
            }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffProgramPaytypeRpt(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty  ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]"
        var lblcriteria;
      
        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery +" WHERE ([Carer Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION')";
         
        var Title = "STAFF PROGRAM PAYTYPE -SUMMARY";
        var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        alert("Yet to summarize detail")
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + "ORDER BY [Carer Code], [Program], [Service Description], Date, [Start Time]";
               
        //console.log(fQuery)

        switch (format) {
            case "Detailed":
                this.reportid = "wrRlhBfDegZzFrlu" ;                       
            break;
            default:                        
                this.reportid = "pq2cnQ2nGuR4Szlh"
            break;
            }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffFunderPayrolltypeRpt(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty  ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , PT.[AccountingIdentifier] AS PayrollType , [HumanResourceTypes].[Type] AS MDS, [HumanResourceTypes].[Address1] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] INNER JOIN ITEMTYPES PT ON [Roster].[Service Description] = PT.[Title] INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name "
        var lblcriteria;
      
       
        fQuery = fQuery +" WHERE  ([Carer Code] > '!MULTIPLE')  And ([Roster].[Status] >= '2') And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION') ";
         
        var Title = "STAFF FUNDER PAYROLL TYPE -SUMMARY";
        var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + "ORDER BY [Carer Code], PayrollType, Date, [Start Time]";
               
      //  console.log(fQuery)

      switch (format) {
        case "Detailed":
            this.reportid = "UBAW9sppie7EzOiP" ;                       
        break;
        default:                        
            this.reportid = "6v9LSTGgq06bT7xK"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    FunderPayrolltypeRpt(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , PT.[AccountingIdentifier] AS PayrollType , [HumanResourceTypes].[Type] AS MDS, [HumanResourceTypes].[Address1]  FROM Roster INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] INNER JOIN ITEMTYPES PT ON [Roster].[Service Description] = PT.[Title] INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name "
        var lblcriteria;
      
       
        fQuery = fQuery +" WHERE ([Roster].[Status] >= '2') And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' AND ([service type] <> 'CONTRIBUTION' AND PT.MinorGroup NOT IN ('PAID LEAVE', 'UNPAID LEAVE')) ";
         
        var Title = "FUNDER PAYROLL TYPE -SUMMARY";
        var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + " ORDER BY [MDS], PayrollType, Date, [Start Time]";
               
      //  console.log(fQuery)

      switch (format) {
        case "Detailed":
            this.reportid = "2MILocaJ7z4C1VP2" ;                       
        break;
        default:                        
            this.reportid = "rUnfnSRvYRppjPTk"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    FundingAuditReport(startdate,enddate){

        var fQuery = "SELECT R.[CLIENT CODE], R.[Program], R.[Carer Code], R.[Service Type], I.DATASETGROUP, I.HACCTYPE, I.NDIA_ID, R.[DATE], R.[Start Time], CASE WHEN R.[Type] = 9 THEN 0 ELSE R.[Duration] / 12 END AS [Duration], R.[CostQty], CASE WHEN R.[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN R.[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, R.[BILLQTY], R.[Unit Bill Rate] * R.[BillQty] As [LineBill], R.[Unit Pay Rate] * R.[CostQty] As [LineCost] FROM Roster R  INNER JOIN RECIPIENTS C ON R.[Client Code] = C.[AccountNo]  INNER JOIN ITEMTYPES I ON R.[SERVICE TYPE] = I.TITLE AND I.PROCESSCLASSIFICATION IN ('OUTPUT', 'EVENT','ITEM') WHERE [Client Code] > '!Z'  AND (R.[TYPE] IN (1,2,3,5,7,8,10,11,12,14) OR (R.[TYPE] = 4 AND R.[Carer Code] = '!INTERNAL'))    "
        var lblcriteria;
          
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " (Date  BETWEEN '" +startdate + ("' AND  '") + enddate  +  "' )";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        

        if (startdate != ""){ 
              lblcriteria = " Date Between " +startdate  + " and "+ enddate +"; "}
              else{lblcriteria =  " All Dated "}
        


        fQuery = fQuery + " ORDER BY  ACCOUNTNO"
        
        console.log(fQuery)
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id":"cmkcZALxPRp1NQEw"  },    
                "options": {
                    "reports": { "save": false },
                
                    "sql":fQuery,
                    "Criteria":lblcriteria,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    DatasetActivityAnalysis(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type] as ServiceType, [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [HumanResourceTypes].[Type] AS MDS, [HumanResourceTypes].[Address1] , [ItemTypes].[HACCType] AS MDSType  FROM Roster INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name     "
        var lblcriteria;
        
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }

        if (recipient !="" || manager != "" ||region != "" ){
            var join = "INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]";
            fQuery = fQuery + join;
        
        }
       
        fQuery = fQuery +" WHERE  ([ItemTypes].[IT_Dataset] IN ('DEX', 'HACC', 'QCSS', 'CSTDA', 'NRCP', 'NRCP-SAR'))  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')";
         
        var Title = "DATASET ACTIVITY ANALYSIS REPORT";
        var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + " ORDER BY [HumanResourceTypes].[Type], ItemTypes.HACCType, [Service Type], Date, [Start Time]";
               
      //  console.log(fQuery)

        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": "y3AjmCjSbwvf2zGw"  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    DatasetoutputSummary(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0) WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [ItemTypes].[HACCType] AS MDSType, [ItemTypes].[AccountingIdentifier], [ItemTypes].[MinorGroup] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title] "
        var lblcriteria;
        
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
       
        fQuery = fQuery +" WHERE ([ItemTypes].[IT_Dataset] IN ('DEX', 'HACC', 'QCSS', 'CSTDA', 'NRCP', 'NRCP-SAR'))  And (([Roster].[Type] IN (1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14) OR ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL'))) And ([Client Code] <> '!MULTIPLE')";
         
        var Title = "DATASET OUTPUT SUMMARY REPORT";
        var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
        
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + " ORDER BY [MDSType], [Client Code], Date, [Start Time] ";
               
    //    console.log(fQuery) 
    switch (format) {
        case "Detailed":
            this.reportid = "cgcfODRkRP2q67Sh" ;                       
        break;
        default:                        
            this.reportid = "YYfS88zCaEg6Qd12"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    UnbilledItems(branch,program,SvcType,startdate,enddate){
            
            
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno], [Recipients].[BRANCH]  FROM Roster  INNER JOIN Recipients ON Roster.[CLient Code] = Recipients.[Accountno]  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE')  AND Roster.[Type] in (1,2,5) "
        var lblcriteria;
        
        
        


        //(RO.[DATE] BETWEEN '2020/08/01' AND '2020/08/31') AND
        if (startdate != "" ||enddate != ""){
            this.s_DateSQL = " [Roster].[Date] BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        if (branch != ""){
            this.s_BranchSQL = "[Recipients].BRANCH in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL}        
        } 
        if(program != ""){
            this.s_ProgramSQL = " ([Roster].PROGRAM in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        }
        if(SvcType != ""){
            this.s_SvcTypeSQL = " ([Service Type] in ('" + SvcType.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_SvcTypeSQL}
        }

        if (branch != ""){ 
            lblcriteria = "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = " All Branches "}
        if (startdate != ""){ 
            lblcriteria = lblcriteria +  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria =lblcriteria + " All Dated "} 
        if (program != ""){ 
                lblcriteria =lblcriteria + " Programs " + program.join(",")+ "; "}
                else{lblcriteria = lblcriteria + "All Programs."}
        if (SvcType != ""){ 
            lblcriteria =lblcriteria + " Service Type " + SvcType.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Svc. Types"}
        
        fQuery = fQuery + " ORDER BY  [Date], [Service Type], [Program]"                                          
    
        
  //  console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"FgNttxKsmc7gqOPj"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    ActivityRecipientReport(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], CASE ISNULL(ISNULL([Recipients].[URNumber],''),'') WHEN '' Then [Roster].[Client Code] Else [Client Code] + ' - ' + ISNULL([Recipients].[URNumber],'') end as [Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Recipients].[UniqueID] As RecipientID  FROM Roster INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;
        var reportid;

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + " WHERE ([Client Code] > '!MULTIPLE')"

        
         var Title = "ACTIVITY RECIPIENT REPORT";
         var Report_Definer = "";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
       // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
         
               
               
                fQuery = fQuery + " ORDER BY [Service Type], [Client Code], Date, [Start Time] ";
               
       // console.log(fQuery) Mufeed
       switch (format) {
        case "Detailed":
            reportid = "pgPwDEeuHN7slyuf " ;
            break;
    
        default:
           reportid = "EUpoRvslDL2jReMC"
            break;
    }
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,
         

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffProgramUtilisation(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = " SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty      ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]  "
        var lblcriteria;

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (stfgroup !="" ||Staff != "" ||staffteam != "" ||stafftype !=""){
            var join = "INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + " WHERE  ([Carer Code] > '!MULTIPLE')  And (([Roster].[Type] = 1 Or  [Roster].[Type] = 2 Or [Roster].[Type] = 3 Or [Roster].[Type] = 7 Or [Roster].[Type] = 8 Or [Roster].[Type] = 10 Or [Roster].[Type] = 11 Or [Roster].[Type] = 12) Or ([Roster].[Type] = 4 And [Carer Code] = '!INTERNAL') Or ([Roster].[Type] = 5) Or ([Roster].[Type] = 6) Or ([Roster].[Type] = 9)) And [Carer Code] <> '!MULTIPLE' ";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
       // console.log("s_DateSQL" + this.s_DateSQL)            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
        
                var Title = "STAFF PROGRAM UTILISATION REPORT";
                var Report_Definer = " "                
                fQuery = fQuery + " ORDER BY [Carer Code], [Program], Date, [Start Time]"
            

  
            

        
        
       // console.log(fQuery)

       switch (format) {
        case "Detailed":
            this.reportid = "A1mesTZmNX4TwwUC" ;                       
        break;
        default:                        
            this.reportid = "ML1Lx7IY0KXwlJdd"
        break;
        }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,

                    "txtCriteriaStmt" : Report_Definer,

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    StaffAllowance(branch,manager,region,stfgroup,funders,recipient,Staff,HACCCategory,RosterCategory,Age,Datetype,program,mdsagencyID,outletid,staffteam,status,startdate,enddate,rptname,stafftype,paytype,activity,settings,format){
       
        var fQuery = "SELECT [Roster].[Date] , [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], CASE ISNULL(ISNULL([Staff].[stf_code],''),'') WHEN '' Then [Roster].[Carer Code] Else [Carer Code] + ' - ' + ISNULL([Staff].[stf_code],'') end as [Carer Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[ServiceSetting], [Roster].[Start Time], [Roster].[Duration], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE [Roster].[Duration] / 12 END AS [DecimalDuration], [Roster].[CostQty], [Roster].[CostUnit], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], CASE WHEN ([Roster].Type = 10 AND ISNULL([Roster].DatasetQty, 0) > 0) THEN ISNULL([Roster].DatasetQty, 0)      WHEN ([ItemTypes].MinorGroup = 'MEALS' OR [Roster].Type = 10) THEN [Roster].BillQty ELSE [Roster].[Duration] / 12 END AS DatasetQty, [Roster].[BillUnit], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno] , [Staff].[UniqueID] As StaffID, [Staff].[Award]  FROM Roster INNER JOIN STAFF ON [Roster].[Carer Code] = [Staff].[AccountNo] INNER JOIN ITEMTYPES ON [Roster].[Service Type] = [ItemTypes].[Title]      "
        var lblcriteria;

        if(funders != "" || mdsagencyID != ""){
            fQuery = fQuery + "INNER JOIN HumanResourceTypes ON [Roster].[Program] = HumanResourceTypes.Name  "
        }
        if (recipient !="" ||manager != "" ||region != "" ){
            var join = "INNER JOIN RECIPIENTS ON [Roster].[Client Code] = [Recipients].[AccountNo]";
            fQuery = fQuery + join;
        
        }
        fQuery = fQuery + " WHERE ([Carer Code] > '!MULTIPLE')  And ([Roster].[Type] In (1,9)) And ([Carer Code] <> '!MULTIPLE') AND ([service type] <> 'CONTRIBUTION') ";

        if (branch != ""){
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','")  +  "')";
            if (this.s_BranchSQL != ""){ fQuery = fQuery + " AND " + this.s_BranchSQL};            
        }
        if (startdate != "" ||enddate != ""){
       
       
           let strkey = Datetype.toString();
           switch (strkey) {
                
                case "Pay Period EndDate":
                   
                    this.s_DateSQL = " ([Date Timesheet] >=  '" +startdate + ("' AND [Date Timesheet] <= '") + enddate  +  "' )";
                    break;
                case 'Billing Date': 
                  
                    this.s_DateSQL = " ([Date Invoice] >=  '" +startdate + ("' AND [Date Invoice] <= '") + enddate  +  "' )";
                    break;
                case 'Service Date':
                    
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    break;
                default:
                    this.s_DateSQL = " (Date >=  '" +startdate + ("' AND Date <= '") + enddate  +  "' )";
                    
                    break;
                }                         
           
        if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};
       // (Date >= '2020/09/01' And Date <='2020/09/30') AND            
        }
        if(manager != ""){
            this.s_CoordinatorSQL = "RECIPIENT_COORDINATOR in ('" + manager.join("','")  +  "')";            
            if (this.s_CoordinatorSQL != ""){ fQuery = fQuery + " AND " + this.s_CoordinatorSQL};
        }
        if(region != ""){
            this.s_CategorySQL = "Anal in ('" + region.join("','")  +  "')";            
            if (this.s_CategorySQL != ""){ fQuery = fQuery + " AND " + this.s_CategorySQL};
        }
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([Staff].[StaffGroup] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
        }
        if(staffteam != ""){
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','")  +  "'))";            
            if (this.s_StfTeamSQL != ""){ fQuery = fQuery + " AND " + this.s_StfTeamSQL};
             }
        if(Staff != ""){
            this.s_StfSQL = "([Carer Code] in ('" + Staff.join("','")  +  "'))";            
            if (this.s_StfSQL != ""){ fQuery = fQuery + " AND " + this.s_StfSQL};
        }
        if(status != ""){
            this.s_statusSQL = "([Roster].[Status] in ('" + status.join("','")  +  "'))";            
            if (this.s_statusSQL != ""){ fQuery = fQuery + " AND " + this.s_statusSQL};
        }
        if(program != ""){
            this.s_ProgramSQL = " ([Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 
        
        if(funders != ""){
            this.s_FundersSQL = "HumanResourceTypes.[Type] in ('" + funders.join("','")  +  "')";            
            if (this.s_FundersSQL != ""){ fQuery = fQuery + " AND " + this.s_FundersSQL};
        }
        if(RosterCategory != ""){
            this.s_RosterCategorySQL = "[Roster].[Type] in ('" + RosterCategory.join("','")  +  "')";            
            if (this.s_RosterCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_RosterCategorySQL};
        }
        if(HACCCategory != ""){
            this.s_HACCCategorySQL = "ItemTypes.HACCType in ('" + HACCCategory.join("','")  +  "')";            
            if (this.s_HACCCategorySQL != ""){ fQuery = fQuery + " AND " + this.s_HACCCategorySQL};
        }
        if(mdsagencyID != ""){
            this.s_MdsAgencySQL = "HumanResourceTypes.Address1 in ('" + mdsagencyID.join("','")  +  "')";            
            if (this.s_MdsAgencySQL != ""){ fQuery = fQuery + " AND " + this.s_MdsAgencySQL};
        }

        if(Age != ""){            
            let tempkay = (Age.toString()).substring(0,8);            
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
     
        if(outletid != ""){
            this.s_OutletIDSQL = "ItemTypes.CSTDAOutletID in ('" + outletid.join("','")  +  "')";            
            if (this.s_OutletIDSQL != ""){ fQuery = fQuery + " AND " + this.s_OutletIDSQL};
        }
        if(recipient != ""){
            this.s_RecipientSQL = "[Client Code] in ('" + recipient.join("','")  +  "')";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(stafftype != ""){
            this.s_StafftypeSQL = "[Staff].[Category] in ('" + stafftype.join("','")  +  "')";            
            if (this.s_StafftypeSQL != ""){ fQuery = fQuery + " AND " + this.s_StafftypeSQL};
        } 
        if(paytype != ""){
            this.s_paytypeSQL = "[Service Description] in ('" + paytype.join("','")  +  "')";            
            if (this.s_paytypeSQL != ""){ fQuery = fQuery + " AND " + this.s_paytypeSQL};
        }
        if(activity != ""){
            this.s_activitySQL = "[Service Type] in ('" + activity.join("','")  +  "')";            
            if (this.s_activitySQL != ""){ fQuery = fQuery + " AND " + this.s_activitySQL};
        }
        if(settings != ""){
            this.s_setting_vehicleSQL = "ServiceSetting in ('" + settings.join("','")  +  "')";            
            if (this.s_setting_vehicleSQL != ""){ fQuery = fQuery + " AND " + this.s_setting_vehicleSQL};
        }





        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "}
        if (branch != ""){ 
            lblcriteria =lblcriteria + "Branches:" + branch.join(",") + "; "        } 
            else{lblcriteria = lblcriteria + " All Branches "}
        

        if(outletid != ""){
           var OutletID = outletid.join(",") + "; "        } 
            else{OutletID =  " All "
        }
        

        if(Datetype != ""){
            var Datetypes =  Datetype.join(",") + "; "        } 
            else{Datetypes =  " Service Date "
        }
        

        if(Age != ""){
            var Age_ATSI =  Age.join(",") + "; "        } 
            else{Age_ATSI =  " All "
        }
       


        if(mdsagencyID != ""){
            var mdsagency =  mdsagencyID.join(",") + "; "        } 
            else{mdsagency =  " All "
        }
        


        if(HACCCategory != ""){
            var HACCCategories =  HACCCategory.join(",") + "; "        } 
            else{HACCCategories =  " All "
        }
        


        if(RosterCategory != ""){
            var RosterCategories = RosterCategory.join(",") + "; "        } 
            else{RosterCategories =  " All "
        }
     
        if(program != ""){
            var programs =  program.join(",") + "; "        } 
            else{programs =  " All "
        }
        


        if(Staff != ""){
            var Staffs = Staff.join(",") + "; "        } 
            else{Staffs =  " All "
        }
        


        if(staffteam != ""){
            var staffteams =  staffteam.join(",") + "; "        } 
            else{staffteams =  " All "
        }
        


        if(stfgroup != ""){
            var stfgroups =  stfgroup.join(",") + "; "        } 
            else{stfgroups =  " All "
        }
        


        if(region != ""){
            var regions =  region.join(",") + "; "        } 
            else{regions =  " All "
        }
        

        
        if(manager != ""){
           var managers =  manager.join(",") + "; "        } 
            else{managers =  " All "
        }
        
        
         if(funders != ""){
            var fundingsource =  funders.join(",") + "; "        } 
             else{fundingsource =  " All "
         }
         

         if(status != ""){
            var statuscat =  status.join(",") + "; "        } 
             else{statuscat =  " All "
         }
        


         if(recipient != ""){
            var recipients =  recipient.join(",") + "; "        } 
             else{recipients =  " All "
         }
         

         if(stafftype != ""){
            var stafftypes =  stafftype.join(",") + "; "        } 
             else{stafftypes =  " All "
         }
         
         if(paytype != ""){
            var paytypes =  paytype.join(",") + "; "        } 
             else{paytypes =  " All "
         }
         if(activity != ""){
            var activities =  activity.join(",") + "; "        } 
             else{activities =  " All "
         }
         if(settings != ""){
            var setting =  settings.join(",") + "; "        } 
             else{setting =  " All "
         }

         
        
                var Title = "STAFF ALLOWANCE REPORT";
                var Report_Definer = " "                
                fQuery = fQuery + " ORDER BY [Carer Code], [Service Description], Date, [Start Time]"
            
 //console.log(fQuery)

                switch (format) {
                    case "Detailed":
                        this.reportid = "pt03dt4gX7njbIcj" ;
                        
                        break;

                    default:                        
                        this.reportid = "9PRBcDXyREab0Qke"
                        break;
                }
       
        
            this.drawerVisible = true;
        
            const data =    {
                "template": {  "_id": this.reportid  },    
                "options": {
                    "reports": { "save": false },
                    
                    "txtTitle":Title,

                    "txtCriteriaStmt" : Report_Definer,

                    "sql":fQuery,
                    "Criteria":lblcriteria,

                    "txtregions": regions, 
                    "txtstfgroups": stfgroups, 
                    "txtstaffteams":staffteams, 
                    "txtStaffs":Staffs ,
                    "txtprograms":programs,  
                    "txtRosterCategories":RosterCategories,
                    "txtHACCCategories":HACCCategories,
                    "txtmdsagency":mdsagency,
                    "txtAge_ATSI":Age_ATSI ,
                    "txtDatetypes":Datetypes,
                    "txtmanagers":managers ,
                    "txtfundingsource":fundingsource,                
                    "txtOutletID":OutletID,
                    "txtstatuscat":statuscat,
                    "txtrecipients":recipients,
                    "txtstafftypes":stafftypes,
                    "txtpaytypes":paytypes,
                    "txtactivities":activities,
                    "txtsetting":setting,
                    
                            
                }
            }
        
        
            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',            
            }
        
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
        
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                let _blob: Blob = blob;
            
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
            }, err => {
                console.log(err);
            });  

    }
    DatasetRecipientUnitCost(recipient,SvcType,startdate,enddate){
            
            
        var fQuery = "select [Client Code], [Service Type], SUM(ClientCharge) AS [Client Charge], Round(SUM(UnitCost), 0) as [Unit Cost]  FROM  (  select [Client Code], it.DatasetGroup AS [Service Type], billqty, billqty * [unit bill rate] as ClientCharge, billqty * it.unitcost as UnitCost from roster  inner join itemtypes it on [service type] = title  inner join humanresourcetypes pr on [name] = program  WHERE pr.type = 'DSS' and it.it_dataset = 'DEX' and [client code] > '!z' "
        var lblcriteria;
        
        
        


        
        if (startdate != "" ||enddate != ""){
            
            this.s_DateSQL = " [roster].[Date] BETWEEN '" +startdate + ("'AND'") + enddate  +  "'";
            if (this.s_DateSQL != ""){ fQuery = fQuery + " AND " + this.s_DateSQL};            
        }
        
        if(recipient != ""){
            this.s_RecipientSQL = " ( [Client Code] in ('" + recipient.join("','")  +  "') )";            
            if (this.s_RecipientSQL != ""){ fQuery = fQuery + " AND " + this.s_RecipientSQL};            
        }
        if(SvcType != ""){
            this.s_SvcTypeSQL = " (it.DatasetGroup in ('" + SvcType.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_SvcTypeSQL}
        }

        
        if (startdate != ""){ 
            lblcriteria =  " Date Between " +startdate  + " and "+ enddate +"; "}
            else{lblcriteria = " All Dated "
        } 
        if(recipient != ""){
            lblcriteria =lblcriteria + " Recipient " + recipient.join(",") + "; "        } 
                else{lblcriteria = lblcriteria + " All Recipients "
             }
        if (SvcType != ""){ 
            lblcriteria =lblcriteria + " Service Type " + SvcType.join(",")+ "; "}
            else{lblcriteria = lblcriteria + " All Svc. Types "}
        
        fQuery = fQuery + " ) t group by [client code], [service type]  ORDER BY [Client Code], [Service Type]"                                          
    
        
   // console.log(fQuery)

    this.drawerVisible = true;

    const data =    {
        "template": {  "_id":"BziOYcDKGzLionPY"  },    
        "options": {
            "reports": { "save": false },
        
            "sql":fQuery,
            "Criteria":lblcriteria,
            
                    
        }
    }


    const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',            
    }

    const requestOptions = {
        headers: new HttpHeaders(headerDict)
    };

    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
        console.log(blob);
        
        let _blob: Blob = blob;
    
        let fileURL = URL.createObjectURL(_blob);
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }



    







} //ReportsAdmin  //
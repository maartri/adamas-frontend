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
    //// allStaff
    
    stafftypeArr:[[]],
    allStafftype:[true],
    



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
            text-align: left !important
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
        
    `],
    templateUrl: './reports.html'
})


export class ReportsAdmin implements OnInit, OnDestroy, AfterViewInit {
    
    validateForm!: FormGroup;
    
    isVisibleTop = false;
    
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


    dateFormat: string = 'yyyy-MM-dd'   
    enddate :Date;
    startdate :Date;
 //   enddate: string ;
 //   startdate: string ;
    //format(new Date(), 'yyyy-MM-dd');

    rpthttp = 'http://45.77.37.207:5488/api/report';
  
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
        private sanitizer: DomSanitizer
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
        


        this.listS.getreportcriterialist({
            listType: 'PROGRAMS',
            includeInactive: false
        }).subscribe(x => this.programsArr = x);

        this.listS.getreportcriterialist({
            listType: 'BRANCHES',
            includeInactive: false
        }).subscribe(x => this.branchesArr = x);
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
    showModal(e){
            e = e || window.event;
            e = e.target || e.srcElement; 
            this.btnid = e.id
         //   this.showModal();
         
    
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


            
            this.isVisibleTop = true;   
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
        var s_States = this.inputForm.value.statesArr;
        var s_Branches = this.inputForm.value.branchesArr;
        var s_Managers = this.inputForm.value.managersArr;
        var s_ServiceRegions = this.inputForm.value.serviceRegionsArr;
        var s_Programs = this.inputForm.value.programsArr;
        var s_StfGroup = this.inputForm.value.staffgroupsArr; 
        var s_Recipient = this.inputForm.value.recipientArr;
        var s_SvcType = this.inputForm.value.svcTypeArr;
        var s_incidenttype = this.inputForm.value.incidentArr;
        var s_Incidentcategory = "";// this.inputForm.value.itemArr; Open/Close
        var s_LoanItems = this.inputForm.value.itemArr;
        var s_Competencies = this.inputForm.value.CompetenciesArr;
        var s_CompetencyGroups = this.inputForm.value.competeciesgroupArr;
        var s_StaffTeam = this.inputForm.value.staffteamArr;
        var s_Staff = this.inputForm.value.staffArr;
        var s_Stafftype = ""; //this.inputForm.value.stafftypeArr; 
        var s_Cycle = this.inputForm.value.cycleArr;
        var s_CaseNotes = this.inputForm.value.casenotesArr;
        var s_Descipiline = this.inputForm.value.disciplineArr;
        var s_CareDomain = this.inputForm.value.caredomainArr;
        var s_PlanType = this.inputForm.value.planArr;
        var s_OPCaseNotes = "";
        var s_HRCaseNotes ="";
        console.log(s_Cycle)
        //console.log(s_Stafftype) 
        
            var date = new Date();
            
             

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
   /*         if ( (this.btnid = 'btn-recipientMasterroster') || (this.btnid = 'btn-staff-MasterRoster')) {    
            switch(s_Cycle){
              
                case'Cycle 1':
                    strdate = "01/01/1900";
                    endate = "28/01/1900";
                break;
                case'Cycle 2':
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
            }
            
        } */
     
    // console.log(strdate)
        switch(idbtn){
            case 'btn-refferallist' :
                this.Refeeral_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-activepackagelist' :                
                this.ActivePackage_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);                  
                 break;
            case 'btn-recipientroster':
                 this.RecipientRoster(s_Branches,s_StfGroup,s_Recipient ,s_Stafftype,strdate,endate);
                break;
            case 'btn-suspendedrecipient':
                this.SuspendedRecipient(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
                break;
            case 'btn-vouchersummary':
                this.VoucherSummary(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
                break;
            case 'btn-packageusage':
                this.PackageUsage(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-timelength':
                this.RecipientTimeLength(strdate,endate);
                break;
            case 'btn-unallocatedbookings':
                this.UnallocatedBookings(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
                break;
            case 'btn-transportsummary':
                this.TransportSummary(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
                break;
            case 'btn-refferalduringperiod':
                this.RefferalsduringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
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
                        console.log("bydefault")
                        break;
				}

                this.RecipientMasterRoster(s_Branches,s_StfGroup,s_Recipient ,s_Stafftype,strdate,endate);
                break;
            case 'btn-activerecipient':
                this.ActiveRecipientList(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-inactiverecipient':
                this.InActiveRecipientList(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-adminduringperiod':
                this.AdmissiionDuringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
                break;
            case 'btn-dischargeduringperiod':
                this.DischargeDuringPeriod(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
                break;
            case 'btn-absentclient':
                this.AbsentClientStatus(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
                break;
            case 'btn-careerlist':
                this.CareerList(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-onlybillingclients':
                this.BillingCliens(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-associatelist':
                this.Associate_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-unserviced':
                this.UnServicedRecipient(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);
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
                this.StaffPermissions(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-mealregisterreport':
                this.MealOrderReport(s_Recipient,strdate,endate);
                break;
            case 'btn-hasreport':
                this.HASReport(s_Programs,strdate,endate);
                break;
            case 'btn-cdcleavereport':
                this.CDCLeaveRegister(s_Branches, s_Programs,strdate,endate);
                break;
            case 'btn-cdcpackagebalance':
                this.CDCPackageBalanceReport(s_Recipient, s_Programs,strdate,endate);
                break;
            case 'btn-incidentregister':
                this.IncidentRegister(s_Branches,s_SvcType,s_StfGroup,s_incidenttype,s_Incidentcategory,strdate,endate)
                break;
            case 'btn-loanregister':
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
                        console.log("bydefault")
                        break;
				}

                this.StaffMasterRoster(s_Branches,s_StfGroup,s_Staff ,s_Stafftype,strdate,endate)
                break;
            case 'btn-staff-loanregister':
                this.StaffLoanRegister(s_Branches,s_Programs,s_Staff,s_LoanItems,s_ServiceRegions,strdate,endate)
                break;
            case 'btn-progcasenotes':
                this.RecipientProg_CaseReport(s_Branches,s_Programs,s_CaseNotes,s_Recipient,s_Descipiline,s_CareDomain,s_ServiceRegions,s_Managers,strdate,endate)
                break;
            case 'btn-servicenotesreg':
                this.ServiceNotesRegister(s_Branches,s_Programs,s_CaseNotes,s_Recipient,s_Descipiline,s_CareDomain,strdate,endate)
                break;
            case 'btn-opnotesregister':
                this.OPNotesRegister(s_Branches,s_Programs,s_CaseNotes,s_Recipient,s_Descipiline,s_CareDomain,strdate,endate)
                break;
            case 'btn-careplanstatus':
                this.Careplanstatus(s_Recipient,s_PlanType,strdate,endate)
                break;
            case 'btn-staffavailability':
                this.StaffAvailability(s_Branches,s_Staff,strdate)
                break;
            case 'btn-timeattandencecomp':
                this.TimeattandanceComparison(s_Branches,s_Staff,strdate,endate)
                break;
            case 'btn-hrnotesregister':
                this.HRNotesRegister(s_Branches,s_Staff,s_HRCaseNotes,strdate,endate)
                break;
            case 'btn-staffopnotes':
                this.StaffOPNotesRegister(s_Branches,s_Programs,s_OPCaseNotes,s_Staff,s_Descipiline,s_CareDomain,strdate,endate)
                break;
            default:// 
                alert("Yet to do")
            
        }
    
    } 
//           
    Refeeral_list(branch,manager,region,program,state){
        
        
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
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });    this.drawerVisible = true;     
    }  

    ActivePackage_list(branch,manager,region,program,state,startdate,enddate){
        
        
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
            this.pdfTitle = "Reports.pdf"
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
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    } 

    SuspendedRecipient(branch,manager,region,program,state,startdate,enddate){
        
        
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
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }


    VoucherSummary(branch,manager,region,program,state,startdate,enddate){
        
        
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
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }

    PackageUsage(branch,manager,region,program,state){
        
        
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
            this.pdfTitle = "Reports.pdf"
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
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }

    UnallocatedBookings(branch,manager,region,program,state,startdate,enddate){
        
        
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
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });        
    }
    
    TransportSummary(branch,manager,region,program,state,startdate,enddate){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }


    RefferalsduringPeriod(branch,manager,region,program,state,startdate,enddate){
        
        
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    ActiveRecipientList(branch,manager,region,program,state){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    InActiveRecipientList(branch,manager,region,program,state){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    CareerList(branch,manager,region,program,state){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    BillingCliens(branch,manager,region,program,state){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    AdmissiionDuringPeriod(branch,manager,region,program,state,startdate,enddate){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    DischargeDuringPeriod(branch,manager,region,program,state,startdate,enddate){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }

    AbsentClientStatus(branch,manager,region,program,state,startdate,enddate){
        
        
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
        console.log(err);
    });        
    }
    Associate_list(branch,manager,region,program,state){
        
        
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
            this.pdfTitle = "Reports.pdf"
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        }, err => {
            console.log(err);
        });    this.drawerVisible = true;     
    }

    UnServicedRecipient(branch,manager,region,program,state,startdate,enddate){
        
        
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

    }, err => {
   //     console.log(err);
    });        
    }

    StaffPermissions(branch,manager,region,program,state){
        
        
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
        this.pdfTitle = "Reports.pdf"
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
        this.pdfTitle = "Reports.pdf"
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

    IncidentRegister(branch,SvcType,stfgroup,incidenttype,category,startdate,enddate){
            
            
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
        if(stfgroup != ""){
            this.s_StfGroupSQL = "([CurrentAssignee] in ('" + stfgroup.join("','")  +  "'))";            
            if (this.s_StfGroupSQL != ""){ fQuery = fQuery + " AND " + this.s_StfGroupSQL};
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
        if (stfgroup != ""){ 
            lblcriteria =lblcriteria + " Assigned To: " + stfgroup.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Staff Groups,"}
                                                
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
            lblcriteria =lblcriteria + " Assigned To: " + stfgroup.join(",")+ "; "}
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
            
            
        var fQuery = "SELECT DISTINCT * FROM ( SELECT UPPER(R.[Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName  ELSE ' '  END as ClientName, CASE WHEN PRIMARYADDRESS <> '' THEN  PRIMARYADDRESS ELSE OTHERADDRESS END  AS Address, CASE WHEN PRIMARYPHONE <> '' THEN  PRIMARYPHONE ELSE OTHERPHONE END AS Contact, R.AccountNo AS ClientCode, R.[Type] AS RecipType, R.[Branch] AS Branch, History.RecordNumber AS NoteID, History.AlarmDate as [Reminder Date], CAST(History.Detail AS varchar(4000)) AS Detail, convert(varchar,History.DetailDate,22) AS DateCreated, History.Creator AS CreatedBy, History.ExtraDetail1 AS NoteType, CASE WHEN ISNULL(History.ExtraDetail2, '') = '' THEN 'UNKNOWN' ELSE History.ExtraDetail2 END AS NoteCategory, History.DeletedRecord , History.Program, History.Discipline, History.CareDomain FROM Recipients as R INNER JOIN History ON R.UniqueID = History.PersonID LEFT JOIN ( SELECT PERSONID, MAX(PADDRESS) AS PRIMARYADDRESS, MAX(OADDRESS) AS OTHERADDRESS From (  SELECT PERSONID,  CASE WHEN PRIMARYADDRESS = 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS PADDRESS,  CASE WHEN PRIMARYADDRESS <> 1 THEN ISNULL(ADDRESS1,'') + ' ' + ISNULL(ADDRESS2,'') + ' '  +  ISNULL(SUBURB,'') + ' ' + ISNULL(POSTCODE,'')  ELSE '' END AS OADDRESS  From NamesAndAddresses ) AS TMP  GROUP BY PERSONID ) AS N ON R.UNIQUEID = N.PERSONID  LEFT JOIN (  SELECT PERSONID, MAX(PPHONE) AS PRIMARYPHONE, MAX(OPHONE) AS OTHERPHONE  FROM (  SELECT PERSONID,  CASE WHEN PRIMARYPHONE = 1 THEN DETAIL ELSE '' END AS PPHONE,  CASE WHEN PRIMARYPHONE <> 1 THEN DETAIL ELSE '' END AS OPHONE  From PhoneFaxOther ) AS T  GROUP BY PERSONID) AS P ON R.UNIQUEID = P.PERSONID WHERE   "
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
            lblcriteria =" Case Notes: " + casenotecat.join(",")+ "; "}
            else{lblcriteria =  lblcriteria + "All Case NOtes,"}
        if (manager != ""){
            lblcriteria =lblcriteria + " Manager: " + manager.join(",")+ "; "}
            else{lblcriteria = lblcriteria + "All Managers,"}

        fQuery = fQuery +    "AND ExtraDetail1 = 'CASENOTE'  AND (History.DeletedRecord = 0)  ) ROP"                                 
        fQuery = fQuery + " ORDER BY ROP.[ClientName], ROP.DateCreated  "
        
   // console.log(fQuery)

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

    







} //ReportsAdmin 
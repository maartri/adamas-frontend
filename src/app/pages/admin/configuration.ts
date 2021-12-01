import { Component, OnInit, OnDestroy, Input, AfterViewInit,ChangeDetectorRef,} from '@angular/core'
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, } from '@angular/forms';
import {  NzModalService } from 'ng-zorro-antd/modal';
import { ListService,PrintService,GlobalService} from '@services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';

//Sets defaults of Criteria Model
const inputFormDefault = {
    
    Rptformat : ['Default'],
    displayby : ['DISPLAY BY STAFF CODE'],

    branchesArr: [[]],
    allBranches: [true],

    outletsArr: [[]],
    allOutlets: [true],

    managersArr: [[]],
    allManager: [true],

    recipientArr: [[]],
    allRecipients: [true],

    programsArr: [[]],
    allPrograms: [true],

    serviceRegionsArr: [[]],
    allServiceRegion: [true],
    
    AccountsArr: [[]],
    allAccounts: [true],

    vehiclesArr : [[]],
    allVehicles : [true],

    PackagesArr: [[]],
    allPackages: [true],

    BatchNoArr: [[]],

    MealGroups : [[]],
    allGroups : [true],

    staffteamArr: [[]],
    allStaffTeams: [true],

    staffgroupsArr: [[]],
    allstfGroups: [true],

    staffArr: [[]],
    allStaff: [true],
   

    filterArr : ['Invoiced Only'],

    single_input_number: [1],
    AgingCycles: [30],

    frm_formats : false,
    frm_display : false,
      
     
}

@Component({
    // host: {
    //     '[style.display]': 'flex',
    //     '[style.flex-direction]': 'column',
    //     '[style.overflow]': 'auto'
    //   },
    styles: [`
        
        button{
            width: 200pt !important;
            text-align: left !important;
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
            
        }
        label.checks{
            margin-top: 4px;
            font-weight: 300 !important;
        }
        nz-date-picker{
            margin:5pt;
        }
        .frm_number{
            width:250px;
            height:32px;

        }
        .frm_AgingNumber{
            width:50px;
            height:32px;
        }
        .spinner{
            margin:1rem auto;
            width:1px;
        }
        
    `],
    templateUrl: './configuration.html'
})
export class ConfigurationAdmin implements OnInit, OnDestroy, AfterViewInit{
    
    // drawerVisible: boolean = false;
    
    bodystyle:object;
    tocken :any;
    frm_formats : boolean;
    frm_display : boolean;
    frm_Outlets: boolean;
    tabset = false;
    isVisibleTop =false;
    Single_input_integer = false; 
    isVisible = false; 
    showtabother = false;
    showtabRostcriteria= false;
    showtabstaffcriteria= false;
    showtabRegcriteria= false;
    showtabrecpcriteria = false;
    show =false ;
    showoption = true;
    tryDoctype: any;
    drawerVisible:boolean;

    //MUFEED's START
    id: string;
    btnid: string;
    pdfTitle: string;
    inputForm: FormGroup;
    ModalName: string;
    Modal : string;
    single_input_number: string;
    ModalTitle : string;
    AgingCycles : string;

    dateFormat: string = 'dd/MM/yyyy'
    enddate: Date;
    startdate: Date;

    Rptformat : Array<any> = [];
    displayby : Array<any> = [];

    outletsArr: Array<any> = [];
    branchesArr: Array<any> = [];    
    managersArr: Array<any> = [];
    recipientArr: Array<any> = [];
    serviceRegionsArr: Array<any> = [];
    programsArr: Array<any> = [];
    AccountsArr : Array<any> = [];
    vehiclesArr : Array<any> = [];    
    PackagesArr : Array<any> = [];
    BatchNoArr : Array<any> = [];
    MealGroups : Array<any> = [];
    staffteamArr : Array<any> = [];
    staffgroupsArr: Array<any> = [];
    staffArr: Array<any> = [];
    batchclientsArr : Array<any> = [];
    
    

    filterArr: Array<any> = [];
    

    frm_Recipients: boolean;
    frm_Managers: boolean;
    frm_StaffTeam : boolean;
    frm_Branches: boolean;
    frm_Staff : boolean;
    frm_group :boolean;
    frm_Date: boolean;
    frm_Categories: boolean;
    frm_Programs: boolean;
    frm_TypeFilter: boolean;    
    frm_Packages : boolean;
    frm_Accounts : boolean;
    frm_vehicles : boolean;
    frm_BatchNo: boolean;
    frm_AgeCycle : boolean;
    frm_Date_AgeCycle: boolean;
    

    selection : boolean;
    options : boolean;

    s_CoordinatorSQL: string;
    s_StfTeamSQL : string;
    s_locationSQL : string;
    s_GroupSQL : string;
    s_vehicleSQL : string;
    s_StfGroupSQL : string;
    s_BranchSQL: string; 
    s_ProgramSQL: string;
    s_ManagersSQL: string;
    s_CategorySQL: string;
    s_RecipientSQL: string;
    s_DateSQL: string;
    s_StaffSQL :string;
    s_PackageSQL: string;
    s_BatchSQL: string;
    s_AccountsSQL: string;

    //rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    rpthttp = 'https://45.77.37.207:5488/api/report'
    
    loading: boolean = false;
    navigationExtras:any;
    //MUFEED's END
    // MUFEED ADDED fb FormBuilder,modalService
    constructor(
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private modalService: NzModalService,
        private listS: ListService,
        private printS: PrintService,
        private cd: ChangeDetectorRef,
        private GlobalS:GlobalService,
        )
    {
        
    }
    handleCancelTop(): void {
        this.isVisibleTop = false;          
        this.drawerVisible = false;
        //MUFEED's START
        this.Single_input_integer = false; //modal 
        this.isVisible = false;             //modal
        this.pdfTitle = "";                 
        this.inputForm.reset(inputFormDefault);
        //MUFEED's END
    }
    handleCancel(){
        this.drawerVisible = false;
        this.pdfTitle = "";
    }
    
    onChange(result: Date): void {
        console.log('onChange: ', result);
    }  
    view(index: number) {
        console.log(index);
        if (index == 0) {
            this.router.navigate(['/admin/branches'])
        }
        if (index == 1) {
            this.router.navigate(['/admin/funding-region'])
        }
        if(index == 2){
            this.router.navigate(['/admin/claim-rates'])
        }
        if(index == 3){
            this.router.navigate(['/admin/target-groups'])
        }
        if(index == 4 ){
            this.router.navigate(['/admin/purpose-statement']);
        }
        if(index == 5){
            this.router.navigate(['/admin/budget-groups']);
        }
        if(index == 6){
            this.router.navigate(['/admin/budgets']);
        }
        if(index == 8){
            this.router.navigate(['/admin/contact-groups']);
        }
        if(index == 9){
            this.router.navigate(['/admin/contact-types']);
        }
        if(index == 10){
            this.router.navigate(['/admin/address-types']);
        }
        if(index == 11){
            this.router.navigate(['/admin/phone-email-types']);
        }
        if(index == 12){
            this.router.navigate(['/admin/occupations']);
        }
        if(index == 13){
            this.router.navigate(['/admin/religions']);
        }
        if(index == 14){
            this.router.navigate(['/admin/financial-class']);
        }
        if(index == 15){
            this.router.navigate(['/admin/postcodes']);
        }
        if(index == 16){
            this.router.navigate(['/admin/holidays']);
        }
        if(index == 17){
            this.router.navigate(['/admin/medical-contact']);
        }
        if(index == 18){
            this.router.navigate(['/admin/destination-address']);
        }
        if(index == 19){
            this.router.navigate(['/admin/program-coordinates']);
        }
        if(index == 20){
            this.router.navigate(['/admin/distribution-list']);
        }
        if(index == 91){
            this.router.navigate(['/admin/notification-list']);
        }
        if(index == 92){
            this.router.navigate(['/admin/customdataset']);
        }
        if(index == 21){
            this.router.navigate(['/admin/initial-actions']);
        }
        if(index == 22){
            this.router.navigate(['/admin/ongoing-actions']);
        }
        if(index == 23){
            this.router.navigate(['/admin/incident-sub-category']);
        }
        if(index == 24){
            this.router.navigate(['/admin/incident-trigger']);
        }
        if(index == 25){
            this.router.navigate(['/admin/incident-types']);
        }
        if(index == 26){
            this.router.navigate(['/admin/incident-location-categories']);
        }
        if(index == 27){
            this.router.navigate(['/admin/recipient-incident-note-category']);
        }
        if(index == 28){
            this.router.navigate(['/admin/staff-incident-note-category']);
        }
        if(index == 29){
            this.router.navigate(['/admin/filling-classification']);
        }
        if(index == 30){
            this.router.navigate(['/admin/document-categories']);
        }
        if(index == 31){
            this.router.navigate(['/admin/document-template']);
        }
        if(index == 32){
            this.router.navigate(['/admin/recipients-categories']);
        }
        if(index == 33){
            this.router.navigate(['/admin/recipients-groups']);
        }
        if(index == 34){
            this.router.navigate(['/admin/recipients-minor-group']);
        }
        if(index == 35){
            this.router.navigate(['/admin/recipients-billing-cycles']);
        }
        if(index == 36){
            this.router.navigate(['/admin/debtor-terms']);
        }
        if(index == 37){
            this.router.navigate(['/admin/recipient-goals']);
        }
        if(index == 38){
            this.router.navigate(['/admin/consent-types']);
        }
        if(index == 39){
            this.router.navigate(['/admin/care-plan-types']);
        }
        if(index == 40){
            this.router.navigate(['/admin/clicnical-notes-groups']);
        }
        if(index == 41){
            this.router.navigate(['/admin/case-notes-categories']);
        }
        if(index == 42){
            this.router.navigate(['/admin/op-notes-categories']);
        }
        if(index == 43){
            this.router.navigate(['/admin/care-domains']);
        }
        if(index == 44){
            this.router.navigate(['/admin/discharge-reasons']);
        }
        if(index == 45){
            this.router.navigate(['/admin/refferal-reasons'])
        }
        if(index == 46){
            this.router.navigate(['/admin/user-define-reminders'])
        }
        if(index == 47){
            this.router.navigate(['/admin/recipient-prefrences'])
        }
        if(index == 48){
            this.router.navigate(['/admin/mobility-codes'])
        }
        if(index == 49){
            this.router.navigate(['/admin/tasks'])
        }
        if(index == 50){
            this.router.navigate(['/admin/health-conditions'])
        }
        if(index == 51){
            this.router.navigate(['/admin/medications'])
        }
        if(index == 52){
            this.router.navigate(['/admin/nursing-dignosis'])
        }
        if(index == 53){
            this.router.navigate(['/admin/medical-dignosis'])
        }
        if(index == 54){
            this.router.navigate(['/admin/medical-procedures'])
        }
        if(index == 55){
            this.router.navigate(['/admin/clinical-reminders'])
        }
        if(index == 56){
            this.router.navigate(['/admin/clinical-alerts'])
        }
        if(index == 57){
            this.router.navigate(['/admin/admitting-priorities']);
        }
        if(index == 58){
            this.router.navigate(['/admin/service-not-categories']);
        }
        if(index == 59){
            this.router.navigate(['/admin/referral-sources']);
        }
        if(index == 60){
            this.router.navigate(['/admin/lifecycle-events']);
        }
        if(index == 61){
            this.router.navigate(['/admin/job-category']);
        }
        if(index == 62){
            this.router.navigate(['/admin/admin-category']);
        }
        if(index == 63){
            this.router.navigate(['/admin/user-groups']);
        }
        if(index == 64){
            this.router.navigate(['/admin/staff-positions']);
        }
        if(index == 65){
            this.router.navigate(['/admin/staff-teams']);
        }
        if(index == 66){
            this.router.navigate(['/admin/award-levels']);
        }
        if(index == 67){
            this.router.navigate(['/admin/award-details']);
        }
        if(index == 68){
            this.router.navigate(['/admin/competency-groups']);
        }
        if(index == 69){
            this.router.navigate(['/admin/staff-competency']);
        }
        if(index == 70){
            this.router.navigate(['/admin/hr-notes-categories']);
        }
        if(index == 71){
            this.router.navigate(['/admin/op-staff-notes']);
        }
        if(index == 72){
            this.router.navigate(['/admin/staff-reminder']);
        }
        if(index == 73){
            this.router.navigate(['/admin/service-deciplines']);
        }
        if(index == 74){
            this.router.navigate(['/admin/leave-description']);
        }
        if(index == 75){
            this.router.navigate(['/admin/staff-preferences']);
        }
        if(index == 76){
            this.router.navigate(['/admin/service-note-categories']);
        }
        if(index == 77){
            this.router.navigate(['/admin/vehicles']);
        }
        if(index == 78){
            this.router.navigate(['/admin/activity-groups']);
        }
        if(index == 79){
            this.router.navigate(['/admin/equipments']);
        }
        if(index == 80){
            this.router.navigate(['/admin/center-facility-location']);
        }
        if(index == 81){
            this.router.navigate(['/admin/funding-sources']);
        }
        if(index == 82){
            this.router.navigate(['/admin/pay-types']);
        }
        if(index == 83){
            this.router.navigate(['/admin/program-packages']);
        }
        if(index == 84){
            this.router.navigate(['/admin/services']);
        }
        if(index == 85){
            this.router.navigate(['/admin/items-consumables']);
        }
        if(index == 86){
            this.router.navigate(['/admin/menu-meals']);
        }
        if(index == 87){
            this.router.navigate(['/admin/case-management-admin']);
        }
        if(index == 88){
            this.router.navigate(['/admin/staff-admin-activities']);
        }
        if(index == 89){
            this.router.navigate(['/admin/recipient-absences']);
        }
        if(index == 90){
            this.router.navigate(['/admin/companies']);
        }
    }


    //MUFEED's START
    ngOnInit(): void {

       
        this.tocken = this.GlobalS.pickedMember ? this.GlobalS.GETPICKEDMEMBERDATA(this.GlobalS.GETPICKEDMEMBERDATA):this.GlobalS.decode();
        this.inputForm = this.fb.group(inputFormDefault);

        var date = new Date();
        let temp = new Date(date.getFullYear(), date.getMonth(), 1);
        let temp1 = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        this.startdate = temp;
        this.enddate = temp1;
        
        this.inputForm.get('allBranches').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                branchesArr: []
            });
        });

        this.inputForm.get('allManager').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                managersArr: []
            });
        }); //
        this.inputForm.get('allPrograms').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                programsArr: []
            });
        });
        this.inputForm.get('allServiceRegion').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                serviceRegionsArr: []
            });
        });

        this.inputForm.get('allGroups').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                MealGroups: []
            });
        });
        this.inputForm.get('allStaffTeams').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                staffteamArr: []
            });
        });        
    this.inputForm.get('allstfGroups').valueChanges.subscribe(data => {
        this.inputForm.patchValue({
            staffgroupsArr: []
        });
    });
        this.inputForm.get('allRecipients').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                recipientArr: []
            });
        });
        this.inputForm.get('allAccounts').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                AccountsArr: []
            });
        });
        this.inputForm.get('allPackages').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                PackagesArr: []
            });
        });       
    this.inputForm.get('allVehicles').valueChanges.subscribe(data => {
        this.inputForm.patchValue({
            vehiclesArr: []
        });
    });
    this.inputForm.get('allStaff').valueChanges.subscribe(data => {
        this.inputForm.patchValue({
            staffArr: []
        });
    });
    this.inputForm.get('allOutlets').valueChanges.subscribe(data => {
        this.inputForm.patchValue({
            outletsArr: []
        });
    });
    

       
       
    }
    ngAfterViewInit(): void {
        this.listS.getreportcriterialist({
            listType: 'BRANCHES',
            includeInactive: false
        }).subscribe(x => this.branchesArr = x);

        this.listS.getreportcriterialist({
            listType: 'MANAGERS',
            includeInactive: false
        }).subscribe(x => this.managersArr = x)

        this.listS.getreportcriterialist({
            listType: 'PROGRAMS',
            includeInactive:false
        }).subscribe(x => this.programsArr = x);

        this.listS.GetRecipientAll().subscribe(x => this.recipientArr = x);
        this.listS.GetRecipientActive().subscribe(x => this.AccountsArr = x);
        this.listS.Getpackages().subscribe(x => this.PackagesArr = x);
        this.listS.GetBatchNo().subscribe(x => this.BatchNoArr = x);
        this.listS.GetGroupMeals().subscribe(x => this.MealGroups = x);
        this.listS.getliststaffteam().subscribe(x => this.staffteamArr = x)
        this.listS.getliststaffgroup().subscribe(x => this.staffgroupsArr = x)
        this.listS.getserviceregion().subscribe(x => this.serviceRegionsArr = x)
        this.listS.GetVehicles().subscribe(x => this.vehiclesArr = x);
        this.listS.GetTraccsStaffCodes().subscribe(x => this.staffArr = x) 
        this.listS.getcstdaoutlets().subscribe(x => this.outletsArr = x);
   
   
   
    }
    ngOnDestroy(): void {
       

    }

    handleOkTop() {
        
        this.isVisibleTop = false; 
        this.Single_input_integer = false;  
        this.isVisible = false;                
        this.reportRender(this.btnid);
        this.tryDoctype = ""
        this.pdfTitle = ""
        this.inputForm = this.fb.group(inputFormDefault);
        

    }
    toggle_Selection_Option() {
        this.selection = !this.selection;
        this.options = !this.options;
        if (this.options == true) {
            
        }
        else {
           
        }
    }
    ResetVisibility() {
        this.frm_TypeFilter = false;
        this.frm_Date = false;        
        this.frm_Recipients = false;
        this.frm_Branches = false;
        this.frm_Staff = false;
        this.frm_group = false;
        this.frm_Managers = false;
        this.frm_StaffTeam = false;
        this.frm_Categories= false;
        this.frm_Programs = false;
        this.selection = false;
        this.options = false;
        this.frm_Packages = false;
        this.frm_Accounts = false;
        this.frm_vehicles = false;
        this.frm_BatchNo= false;        
        this.frm_AgeCycle = false;
        this.frm_Date_AgeCycle = false;
        this.frm_AgeCycle = false;
        

        this.ModalName = " CRITERIA ";
        this.Modal = " NUMBER ";
        this.ModalTitle = " CRITERIA ";
    }
    ShowModal(e){
        e = e || window.event;
        e = e.target || e.srcElement;
        this.btnid = e.id

        this.ResetVisibility();
       
        switch (this.btnid) {
            case "ndia-package-statement":
                this.ModalTitle = "NDIA PACKAGE STATEMENT";
                this.selection  = true;
                this.isVisible  = true;
                this.frm_Packages = true;
                this.frm_BatchNo = true;
                break;
            case "ndia-unclaimed-items":
                this.ModalName = "NDIA UnClaimed Items Report Criteria";
                this.frm_Date = true;        
                this.frm_Recipients = true;
                this.frm_Branches = true;
                this.frm_Managers = true;

                this.isVisibleTop = true;
            
                break;
            case "ndia-batch-register":
                this.Modal = "NDIA BATCH NUMBER "
                this.Single_input_integer = true;
            
                break;
            case "cdc-package-status":
                this.ModalTitle = "CDC PACKAGE STATEMENT";
                this.selection  = true;
                this.isVisible  = true;
                this.frm_Packages = true;
                this.frm_BatchNo = true;
            
                break;
            case "fee-verification-report":
                this.ModalName = "CDC FEE VERIFICATION REPORT";                                
                this.frm_Date = true;        
                this.frm_Branches = true;
                this.frm_Programs = true;                
                this.frm_Categories = true;
                this.frm_Managers = true;

                this.isVisibleTop = true;
                break;
            case "claim-verification-report":
                this.ModalName = "CDC CLAIM VERIFICATION REPORT";                                                       
                this.frm_Branches = true;
                this.frm_Programs = true;                
                this.frm_Categories = true;
                this.frm_Managers = true;

                this.isVisibleTop = true;
            
                break;
            case "leave-verification-report":
                this.ModalName = "CDC LEAVE VERIFICATION REPORT";                                                       
                this.frm_Date = true;
                
                this.isVisibleTop = true;
            
                break;
            case "medicine-claim-report":
                this.ModalName = "CDC MEDICINE CLAIM REPORT";                                                       
                
                this.frm_BatchNo = true;
                this.frm_Branches = true;
                this.frm_Packages = true;
                this.frm_Categories = true;                                                
                this.isVisibleTop = true;
              
            
                break;
            case "print-staff-jobsheet":
                this.ModalName = "PRINT STAFF JOBSHET";                                                       
                this.frm_Date = true;
                this.frm_Staff = true;
                this.frm_Branches = true;
                this.frm_Packages = true;
                this.frm_Categories = true;
                this.frm_Programs = true;
                this.frm_Managers = true;
                
            //  this.isVisibleTop = true;
            
                break;  
            case "print-location-rosters":
                this.ModalName = "PRINT ROSTER LOCATION";                                                       
                this.frm_Date = true;
                this.frm_Outlets = true;
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Categories = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;
                this.Rptformat = ['Default','Attendance Sheet'];                                                    
                this.frm_formats = true;
            
                this.isVisibleTop = true;
                break;
            case "print-group-activity-rosters":
                this.ModalName = "PRINT GROUP ACTIVITY ROSTER";                                                       
                this.frm_Date = true;
                this.frm_group = true;
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Categories = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;

                this.isVisibleTop = true;
            
                break;
            case "print-transport-run-sheets":
                this.ModalName = "PRINT TRANSPORT RUNSHEET";                                                       
                this.frm_Date = true;
                this.frm_vehicles = true;
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Categories = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;

                this.isVisibleTop = true;
            
                break;
            case "print-meal-run-sheets":
                this.ModalName = "PRINT MEAL RUNSHEET";                                                       
                this.frm_Date = true;
                this.frm_group = true;
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Categories = true;
                this.frm_Managers = true;
                this.displayby = ['DISPLAY BY STAFF CODE','DISPLAY BY RECIPIENT CODE']
                this.Rptformat = ['Default','Format Run Sheet','Format Meal Plan','Format Pack Sheet']; 
                this.frm_StaffTeam = true;
                this.frm_formats = true;
                this.frm_display = true;
            
                this.isVisibleTop = true;
                break;
            case "print-staff-rosters":
                this.ModalName = "PRINT STAFF ROSTERS";   
                this.Rptformat = ['Default','Fixed Layout'];                                                    
                this.frm_formats = true;
                this.frm_Date = true;
                this.frm_Staff = true;
                this.frm_Branches = true;                
                this.frm_Programs = true;
                this.frm_Categories = true;
                this.frm_Managers = true;
                this.frm_StaffTeam = true;
                this.isVisibleTop = true;

            
                break;
            case "print-invoices":
                                         
            break;
            case "print-invoices-batch":
                this.Modal = " BATCH NUMBER "
                this.Single_input_integer = true;
                break;
            case "print-account-statement":
                this.ModalTitle = "ACCOUNT STATEMENT";
                this.selection  = true;
                this.isVisible  = true;
                this.frm_Accounts = true;
                this.frm_Date_AgeCycle = true;
                this.frm_AgeCycle = true;
                
                
                break;
            case "print-reprint-recipts":
            
                break;
            case "print-receipts-batch":
                this.Modal = " BATCH NUMBER "
                this.Single_input_integer = true;
                break;
            case "print-deposit-slip":
                this.showConfirm();

                break;
            case "print-aged-debtors":
                this.ModalTitle = "AGED DEBTORS REPORT";
                this.selection  = true;
                this.isVisible  = true;
                this.frm_Accounts = true;
                this.frm_Date_AgeCycle = true;
                this.frm_AgeCycle = true;
                break;
            case "invoice-verification":
                this.ModalName = "Invoice Verification";
                this.filterArr = ['Invoiced Only','UnInvoiced Only','All'];
                this.frm_TypeFilter = true;
                this.frm_Date = true;        
                this.frm_Branches = true;
                this.frm_Programs = true;                
                this.frm_Categories = true;
            //    this.frm_Managers = true;

                this.isVisibleTop = true;
                break;
        
            default:
                break;
        }
       
       
    }
    reportRender(idbtn) {
        console.log(idbtn)
        var strdate, endate;
        let allbrnch, allClients;

        var date = new Date();
        
      
      
        if (this.startdate != null) { strdate = format(this.startdate, 'dd/MM/yyyy') 
             }else {                       
            strdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'dd/MM/yyyy')

        }
        if (this.enddate != null) { endate = format(this.enddate, 'dd/MM/yyyy') 
            } else {
            
            endate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'dd/MM/yyyy');
        }
            
            

        var s_Branches = this.inputForm.value.branchesArr;
        var s_Managers = this.inputForm.value.managersArr;        
        var s_Programs = this.inputForm.value.programsArr;        
        var s_Recipient = this.inputForm.value.recipientArr;
        var s_Categories = this.inputForm.value.serviceRegionsArr;
        var s_Accounts = this.inputForm.value.AccountsArr;
        var s_Package = this.inputForm.value.PackagesArr;
        var s_Batch = this.inputForm.value.BatchNoArr;
        var s_StaffTeam = this.inputForm.value.staffteamArr;
        var s_StfGroup = this.inputForm.value.staffgroupsArr;
        var s_Groups = this.inputForm.value.MealGroups;
        var s_Vehicles = this.inputForm.value.vehiclesArr;
        var s_Staff = this.inputForm.value.staffArr;
        var s_OutLetID = this.inputForm.value.outletsArr;

        if (this.inputForm.value.allBranches == true){  allbrnch = this.branchesArr }
        if (this.inputForm.value.allRecipients == true){  allClients = this.recipientArr}

       

        switch (this.btnid) {
            case "ndia-package-statement":
                this.NDIAPackageStatement(s_Batch,s_Branches,s_Package)
              
                break;
            case "ndia-unclaimed-items":
                this.NDIAUnClaimedItems(strdate, endate,s_Branches,s_Managers,s_Recipient)
            
                break;
            case "ndia-batch-register":
                this.NDIABatchRegister(s_Batch)
                
            
                break;
            case "cdc-package-status":
                this.CDCPackageStatement(s_Batch,s_Branches,s_Package)
            
                break;
            case "fee-verification-report":
                this.CDCFeeVerification(strdate, endate,s_Branches,s_Managers, s_Categories, s_Package)
                break;
            case "claim-verification-report":
                this.CDCClaimVerification(s_Branches,s_Managers, s_Categories, s_Programs)
            
                break;
            case "leave-verification-report":
                this.CDCLeaveVerification(strdate, endate)
            
                break;
            case "medicine-claim-report":
                this.medicareclaim();
                          
                break;
            case "print-staff-rosters":
                this.staffroster(s_Staff,s_Branches,s_Programs,s_StfGroup,s_Managers,s_StaffTeam,strdate, endate);
            
                break;
            case "print-location-rosters":
            this.locationrosters(s_OutLetID,s_Branches,s_Programs,s_StfGroup,s_Managers,s_StaffTeam,strdate, endate);
                break;
            case "print-group-activity-rosters":
                this.groupActivityRoster(s_Groups,s_Branches,s_Programs,s_StfGroup,s_Managers,s_StaffTeam,strdate, endate);
            
                break;
            case "print-transport-run-sheets":
                this.transportrunsheet(s_Vehicles,s_Branches,s_Programs,s_StfGroup,s_Managers,s_StaffTeam,strdate, endate);
            
                break;
            case "print-meal-run-sheets":
                this.mealrunsheet(s_Groups,s_Branches,s_Programs,s_StfGroup,s_Managers,s_StaffTeam,strdate, endate);
                break;
      
            case "print-staff-jobsheet":
                this.staffjoobsheet();
            
                break; 
            case "print-invoices":
                                         
            break;
            case "print-invoices-batch":
                this.InvoiceBatchRegister(this.inputForm.value.single_input_number)
               
                break;
            case "print-account-statement":
                this.AccountStatement(s_Branches,s_Recipient,strdate, endate);                                
                break;
            case "print-reprint-recipts":
            
                break;
            case "print-receipts-batch":
               
                break;
            case "print-deposit-slip":
                

                break;
            case "print-aged-debtors":
                this.ageddebtor(s_Branches,s_Recipient,this.inputForm.value.AgingCycles,allbrnch ,allClients)
                
                break;
            case "invoice-verification":
                this.Invoiceverification(s_Branches,s_Programs,s_Categories,strdate, endate)
                break;
        
            default:
                break;
        }








    } //
    showConfirm(): void {
        this.modalService.confirm({
          nzTitle: 'TRACCS PORTAL',
          nzContent: 'Do you want to Print Deposit Slips for All Branches?',
          nzOkText: 'Yes',
          nzCancelText: 'No',
          nzOnOk: () => {
            this.reportRender(this.btnid);
          },

          nzOnCancel: () => {
            this.ModalName = "BRANCH SELECTION";           
            this.frm_Branches = true;           
            this.isVisibleTop = true;
          }
        });
      }
      NDIAPackageStatement(batch,branch,packages) {
        console.log(batch); 
//GetBatchClients
        let temp = forkJoin([           
            this.listS.GetBatchClients(295)
        ]) 
        temp.subscribe(data => {       
            this.batchclientsArr = data;   
            console.log(data);         
            console.log(this.batchclientsArr.join("','")); 
        });                
        var fQuery = " SELECT RTRIM([Client Code]) + '-' + RTRIM([Program]) AS StatementID, CASE WHEN ItemGroup = 'DIRECT SERVICE' THEN 4 WHEN Itemgroup = 'CASE MANAGEMENT' THEN 6 WHEN ItemGroup = 'GOODS/EQUIPMENT' THEN 5 WHEN ItemGroup = 'PACKAGE ADMIN' THEN 7 ELSE 4 END AS iSort, [Carer Code], [Type], [Date],[Start Time],[Service Type], 'ADMIN' AS [Service Description],[Billunit],[Duration],Sum([Billqty]) AS BillQty,[Unit Bill Rate], ISNULL([Taxpercent], 0) AS TaxPercent, ISNULL([Taxamount], 0) AS TaxAmount,[BillTo],[Client Code],[ServiceSetting], [Program],[BillDesc],Notes ,  ItemGroup, [MinorGroup],[BillText],Sum(ServiceCharge) as ServiceCharge, GSTAmount , Sum([AMTIncTax]) AS AmtIncTax, CONVERT(nVarchar, [InvoiceNumber]) AS InvoiceNumber FROM ( SELECT CASE WHEN ISNULL(BillDesc1, '') = '' THEN  [BillText] ELSE BillDesc1 END  AS BillDesc, * FROM (SELECT '!INTERNAL' AS [Carer Code],r.[Type], "
        " '2021/10/31' AS Date,'00:00' AS [Start Time],  "
        fQuery = fQuery + "  r.[Service Type], 'ADMIN' AS [Service Description],    r.[Billunit], r.[Duration], r.[Billqty], r.[Unit Bill Rate], ISNULL(r.[Taxpercent], 0) AS TaxPercent, ISNULL(r.[Taxamount], 0) AS TaxAmount,r.[Client Code] AS [BillTo],r.[Client Code],'' AS [ServiceSetting], r.[Program],r.[BillDesc] AS BillDesc1,'' AS Notes ,it.[MainGroup] AS ItemGroup, it.[MinorGroup],it.[BillText],Round(r.[BillQty] * r.[Unit Bill Rate], 2) AS ServiceCharge, Round((ISNULL(r.[TaxPercent], 0) /100) * Round(r.[BillQty] * r.[Unit Bill Rate], 2), 2) As GSTAmount, Round(r.[BillQty] * r.[Unit Bill Rate], 2) + Round((ISNULL(r.[TaxPercent], 0) /100) * Round(r.[BillQty] * r.[Unit Bill Rate], 2), 2) As AMTIncTax, '0' AS [InvoiceNumber]   FROM Roster r  LEFT  JOIN ItemTypes  it ON [Service Type] = [Title]  INNER JOIN Recipients re ON [Client Code] = [Accountno]  WHERE "
        " r.[Client Code] IN ('BARBROOK ALDUS')  "
        var temp1 = " AND r.[Client Code] IN (' "+ this.batchclientsArr.join("','") + "')"
        console.log(temp1)
        //AAAA AAABB (M) 19560516', 'AARDERN BMY (M) 19561001', 'ABERKIRDO TYBI', 'ABRAHIM NORMIE', 'AIKETT SPENSE', 'AMBROZ SPIKE', 'AMISS KRISTEN', 'LEIGHFIELD CHEN', 'MCKERRON SELLE', 'SOUTHCOAT DARN', 'VOGT M (F)', 'WALLIS TOM (M) 19561013', 'WATTS TIM (M) 19561009', 'WILSON JAMES (M) 19560902', 'WILSON NANCY (F) 19560516', 'WILSON ROSE (F) 19490913', 'WILSON S', 'WILSON TIM (M) 19560902', 'YURMANOVEV NESSI', 'ZZZ XXX (M) 19560815')  "
        " AND r.[Program] IN ('NDIA BARBROOK A')  "
        fQuery = fQuery + " AND NOT (r.[Type] = 9 "
        fQuery = fQuery + " AND r.[Service Description] = 'CONTRIBUTION')  "
        fQuery = fQuery + " AND r.[Date] > '2000/01/01'  "
        " AND (r.[Date] BETWEEN '2021/10/01' AND '2021/10/31') "
        fQuery = fQuery + " AND r.Status > 1  "
        fQuery = fQuery + " AND IsNull(r.[Unit Bill Rate], 0) > 0  "
        fQuery = fQuery + " AND it.MinorGroup = 'FEE' "
        fQuery = fQuery + " AND [Date] > '2000/01/01' "
        fQuery = fQuery + " AND isnull(ExcludeFromUsageStatements, 0) = 0 "
        fQuery = fQuery + "  ) t ) T1 GROUP BY [Carer Code],[Type],[Date],[Start Time],[Service Type], [Service Description],[Billunit],[Duration],BillQty,[Unit Bill Rate], Taxpercent, Taxamount,[BillTo] , [Client Code], [ServiceSetting], [Program], [BillDesc], Notes, ItemGroup, [MinorGroup], [BillText], ServiceCharge, GSTAmount, AMTIncTax, InvoiceNumber UNION SELECT RTRIM(r.[Client code]) + '-' + RTRIM(r.[program]) AS StatementID, CASE WHEN it.[MainGroup] = 'DIRECT SERVICE' THEN 4 WHEN it.[MainGroup] = 'CASE MANAGEMENT' THEN 6 WHEN it.[MainGroup] = 'GOODS/EQUIPMENT' THEN 5 ELSE 4 END AS iSort, r.[Carer Code], r.[Type],r.[Date],r.[Start Time],r.[Service Type],'ADMIN' AS [Service Description],r.[Billunit],r.[Duration],r.[Billqty],r.[Unit Bill Rate],ISNULL(r.[Taxpercent], 0) AS Taxpercent, ISNULL(r.[Taxamount], 0) AS Taxamount,r.[BillTo],r.[Client Code],r.[ServiceSetting],r.[Program],r.[BillDesc],   r.[RecordNo] AS Notes ,it.[MainGroup] AS ItemGroup,it.[MinorGroup],it.[BillText],Round(Convert(Numeric (10, 4), [BillQty] * [Unit Bill Rate]), 2) AS ServiceCharge, Round(Convert(Numeric (10, 4), (ISNULL(r.[TaxPercent], 0)/100) * [BillQty] * [Unit Bill Rate]), 2) As GSTAmount, Round(Convert(Numeric (10, 4), (r.[BillQty] * r.[Unit Bill Rate])), 2) + Round(Convert(Numeric (10, 4), ISNULL(r.[TaxPercent],0) /100 * r.[BillQty] * r.[Unit Bill Rate]), 2) As AMTIncTax, CONVERT(nVarchar, r.[InvoiceNumber]) AS InvoiceNumber  FROM Roster r  LEFT  JOIN ItemTypes  it ON [Service Type] = [Title]  INNER JOIN Recipients re ON [Client Code] = [Accountno]  WHERE "
        " r.[Client Code] IN ('BARBROOK ALDUS')  "
        " AND r.[Client Code] IN ('AAAA AAABB (M) 19560516', 'AARDERN BMY (M) 19561001', 'ABERKIRDO TYBI', 'ABRAHIM NORMIE', 'AIKETT SPENSE', 'AMBROZ SPIKE', 'AMISS KRISTEN', 'LEIGHFIELD CHEN', 'MCKERRON SELLE', 'SOUTHCOAT DARN', 'VOGT M (F)', 'WALLIS TOM (M) 19561013', 'WATTS TIM (M) 19561009', 'WILSON JAMES (M) 19560902', 'WILSON NANCY (F) 19560516', 'WILSON ROSE (F) 19490913', 'WILSON S', 'WILSON TIM (M) 19560902', 'YURMANOVEV NESSI', 'ZZZ XXX (M) 19560815')  "
        " AND r.[Program] IN ('NDIA BARBROOK A')  "
        fQuery = fQuery + " AND NOT (r.[Type] = 9 "
        fQuery = fQuery + " AND r.[Service Description] = 'CONTRIBUTION')  "
        fQuery = fQuery + " AND r.[Date] > '2000/01/01'  "
        " AND (r.[Date] BETWEEN '2021/10/01' AND '2021/10/31') "
        fQuery = fQuery + " AND r.Status > 1  "
        fQuery = fQuery + " AND IsNull(r.[Unit Bill Rate], 0) > 0  "
        fQuery = fQuery + " AND it.MinorGroup <> 'FEE' "
        fQuery = fQuery + " AND r.[Date] > '2000/01/01' "
        fQuery = fQuery +  " AND isnull(it.ExcludeFromUsageStatements, 0) = 0  "
        fQuery = fQuery + " UNION SELECT RTRIM([Patient Code]) + '-' + RTRIM([Package]) AS StatementID, CASE WHEN hType = 'R' AND Type1 = 'GOVMT' THEN 2  WHEN hType = 'R' AND Type1 = 'PRSNL' THEN 3  WHEN hType = 'R' AND Type1 = 'OTHER' THEN 1 WHEN hType = 'R' AND ISNULL(Type1, '') = '' THEN 0 END  AS iSort , '' AS [Carer Code], 100 AS [Type], [Traccs Processing Date] AS [Date], '' AS [Start Time], '' AS [Service Type], '' AS [Service Description], '' AS [Bill Unit], 1  AS [Duration], 1  AS [BillQty], [Invoice Amount] AS Amount, 0  AS [Taxpercent], 0  AS [Taxamount], '' AS [BillTo], [Patient Code],'' AS [ServiceSetting],Package AS [Program],'' AS [tmpBilLDesc],'' AS [tmpNotes],CASE WHEN hType = 'R' AND Type1 = 'GOVMT' THEN 'PAYMENT - Govt Contribution'  WHEN hType = 'R' AND Type1 = 'PRSNL' THEN 'PAYMENT - Personal Contribution'  WHEN hType = 'R' AND Type1 = 'OTHER' THEN 'PAYMENT - 3rd Party Contribution' WHEN hType IN ('R', 'A') AND ISNULL(Type1, '') = '' THEN 'ADJUSTMENT' END  AS ItemGroup ,hType AS [MinorGroup],CASE WHEN hType = 'R' AND Type1 = 'GOVMT' THEN 'PAYMENT - Federal Contribution'  WHEN hType = 'R' AND Type1 = 'PRSNL' THEN 'PAYMENT - Personal Contribution'  WHEN hType = 'R' AND Type1 = 'OTHER' THEN 'PAYMENT - 3rd Party Contribution' WHEN hType IN ('R', 'A') AND ISNULL(Type1, '') = '' THEN 'ADJ: ' + ISNULL(Notes, '')  END AS StText , Convert(Float, -1 * [Invoice Amount]) AS ServiceCharge, Cast(0 as float) as GSTAmount, Convert(Float, -1 * [Invoice Amount]) AS AMTIncTax, COnvert(nVarchar, [Invoice Number]) AS [Invoice Number] FROM InvoiceHeader WHERE [Patient Code] IN ('BARBROOK ALDUS') AND [Patient Code] IN ('AAAA AAABB (M) 19560516', 'AARDERN BMY (M) 19561001', 'ABERKIRDO TYBI', 'ABRAHIM NORMIE', 'AIKETT SPENSE', 'AMBROZ SPIKE', 'AMISS KRISTEN', 'LEIGHFIELD CHEN', 'MCKERRON SELLE', 'SOUTHCOAT DARN', 'VOGT M (F)', 'WALLIS TOM (M) 19561013', 'WATTS TIM (M) 19561009', 'WILSON JAMES (M) 19560902', 'WILSON NANCY (F) 19560516', 'WILSON ROSE (F) 19490913', 'WILSON S', 'WILSON TIM (M) 19560902', 'YURMANOVEV NESSI', 'ZZZ XXX (M) 19560815') AND hType IN ('R', 'C', 'A') AND Package IN ('NDIA BARBROOK A') AND [Traccs Processing Date] BETWEEN '2021/10/01' AND '2021/10/31'   "
        var lblcriteria;






        

        if (batch != "") {
            this.s_BatchSQL = " (  in ('" + batch + "') )";
            if (this.s_BatchSQL != "") { fQuery = fQuery + " AND " + this.s_BatchSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = " ( in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (packages != "") {
            this.s_PackageSQL = " (package in ('" + packages.join("','") + "'))";
            if (this.s_PackageSQL != "") { fQuery = fQuery + " AND " + this.s_PackageSQL }
        }


        
        if (batch != "") {
            lblcriteria = lblcriteria + " Batch Number: " + batch + "; "
        }
        else {
            lblcriteria = lblcriteria + " All Batches "
        }
        if (branch != "") {
            lblcriteria = lblcriteria + " Service Type " + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Svc. Types " }
        if (packages != "") {
            lblcriteria = lblcriteria + " Service Type " + packages.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Packages " }


        fQuery = fQuery + " ORDER BY RTRIM([Client Code]) + '-' + RTRIM([Program]), [iSort], Date "


        console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "q6UDawfEPuZTYe56" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "NDIA Package Statement.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });
    }
    NDIAUnClaimedItems(startdate, enddate,branch,manager,recipient) {


        var fQuery = " SELECT * FROM (SELECT ro.Recordno as [Shift#],ro.Date, ro.[Client Code] AS Client, ro.[Carer Code] AS Staff, ro.[Program], r.BRANCH, r.RECIPIENT_CoOrdinator, ro.[Service type] AS [Item/Activity], ISNULL([Unit Bill Rate], 0) * ro.BillQty AS ClaimAmount, ro.Duration / 12 AS ClaimHours, CASE WHEN ro.Status = 1 AND ro.[Type] = 1 THEN '1 - UNASSIGNED BOOKINGS'      WHEN ro.Status = 1 AND ro.[Type] <> 1 THEN '2 - UNAPPROVED SERVICES'      WHEN ro.Status IN (2, 5) AND ISNULL(ro.NDIABatch, 0) = 0 THEN '3 - APPROVED NOT CLAIMED OR BILLED'      WHEN ro.Status IN (2, 5) AND ISNULL(ro.NDIABatch, 0) <> 0 THEN '4 - APPROVED, CLAIMED NOT BILLED' END AS [Type] FROM ROSTER ro INNER JOIN HumanResourceTypes pr ON ro.[Program] = pr.[Name] INNER JOIN ItemTypes it ON ro.[Service Type] = it.[Title] LEFT JOIN Recipients r ON r.AccountNo = ro.[Client Code] WHERE pr.[Type] = 'NDIA' AND it.it_dataset = 'NDIS' AND ro.status IN (1, 2, 5) AND NOT (ro.[Type] = 8 and ro.[Start Time] = '00:00') "   
        //AND (ro.Date BETWEEN '2021/11/01' AND '2021/11/30')  
        //AND (r.BRANCH BETWEEN 'ADELAIDE' AND 'BRISBANE')  
        //AND (r.[RECIPIENT_COOrdinator] BETWEEN 'ALLA KASPARSKI' AND 'AMARGO PENNYCORD') 
        // "
        var lblcriteria,tempsdate,tempedate;
        tempsdate = format(this.startdate, 'yyyy/MM/dd')
        tempedate = format(this.enddate, 'yyyy/MM/dd')


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (ro.Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "') ";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = " (r.BRANCH  in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (manager != "") {
            this.s_ManagersSQL = " ( r.[RECIPIENT_COOrdinator] in ('" + manager.join("','") + "'))";
            if (this.s_ManagersSQL != "") { fQuery = fQuery + " AND " + this.s_ManagersSQL }
        }
        if (recipient != "") {
            this.s_RecipientSQL = " (ro.[Client Code] in ('" + recipient.join("','") + "'))";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL }
        }

        
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Managers," }

        if (branch != "") {
            lblcriteria = lblcriteria + "Branches: " + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (recipient != "") {
            lblcriteria = " Recipient: " + recipient.join(",") + "; "
        }
        else { lblcriteria = "All Recipients," }


        fQuery = fQuery + " ) t ORDER BY [Type], [Client], [Date] "


    //    console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "ZSowzSUylA32icQq" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "NDIA UnClaimed Items.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });
    }
    NDIABatchRegister(batch) {


        var fQuery = "SELECT NDIABatch, Roster.RecordNo AS [Claim Ref ID], Roster.[Client Code], Recipients.[NDISNumber], Roster.[Date], Roster.[Start Time], Roster.[Service Type], CASE WHEN Roster.Type = 4 THEN AltItem.NDIA_ID ELSE ItemTypes.NDIA_ID END AS [NDIA_ID], Roster.[BillQty] , [Unit Bill Rate] , ISNULL(Roster.[Unit Bill Rate], 0) * Roster.[BillQty] AS LineTotal FROM Roster INNER JOIN Recipients ON roster.[client code] = recipients.accountno INNER JOIN ItemTypes ON ItemTypes.Title = Roster.[Service Type] LEFT JOIN ItemTypes AltItem ON AltItem.Title = Roster.[ShiftName] WHERE  "
        var lblcriteria;
    
        if (batch != "") {
            this.s_BatchSQL = " ( NDIABatch = '" + batch + "' )";
            if (this.s_BatchSQL != "") { fQuery = fQuery + "  " + this.s_BatchSQL };
        }

        if (batch != "") {
            lblcriteria = lblcriteria + " Batch Number: " + batch + "; "
        }
        fQuery = fQuery + "ORDER BY Roster.[Client Code], Recipients.NDISNumber, Roster.[Date], Roster.[Start Time] "


        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "T11evi50v5VQP3Jw" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "NDIA Batch Register.pdf"    
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });
    }
    CDCFeeVerification(startdate, enddate,branch,manager, region, packages) {
//            
        
        

        var fQuery = "SELECT *, (NoDays - LeaveDays) AS DaysBilled, (NoDays - LeaveDays) * (convert(Money, BasicFee) + Convert(Money, IncomeTestedFee) + Convert(Money, TopUpFee)) AS InvoiceAmount FROM (SELECT *,CASE WHEN AdmissionDate <= '2021/01/01' AND ISNULL(DischargeDate, '2021/02/01')  > '2021/01/31' THEN ABS(DateDiff(day, '2021/01/01', '2021/02/01')) WHEN AdmissionDate <= '2021/01/01' AND ISNULL(DischargeDate, '2021/01/31')  <= '2021/01/31' THEN ABS(DateDiff(day, '2021/01/01', DischargeDate)) WHEN AdmissionDate > '2021/01/01' AND ISNULL(DischargeDate, '2021/02/01')  > '2021/01/31' THEN     ABS(DateDiff(day, AdmissionDate,'2021/02/01')) WHEN AdmissionDate > '2021/01/01' AND ISNULL(DischargeDate, '2021/01/31')  < '2021/01/31' THEN     ABS(DateDiff(day, AdmissionDate,DischargeDate)) END As NoDays, (SELECT COUNT(DISTINCT [DATE]) FROM ROSTER INNER JOIN ITEMTYPES IT ON Title = [Service Type] WHERE [Client Code] = F.AccountNo AND IT.MinorGroup IN ('FULL DAY-RESPITE', 'FULL DAY-TRANSITION') AND [DATE] >= CASE WHEN AdmissionDate < '2021/01/01' THEN '2021/01/01' ELSE AdmissionDate END AND [DATE] <= CASE WHEN ISNULL(DischargeDate, '2021/01/31') >= '2021/01/31' THEN '2021/01/31' ELSE ISNULL(DischargeDate, '2100/01/01') END ) AS [LeaveDays] FROM ( SELECT RE.Accountno, RE.Branch, RE.AgencyDefinedGroup AS Category, RE.RECIPIENT_CoOrdinator, IsNull(RE.FirstName, '') + CASE WHEN IsNull(RE.FirstName, '') <> '' THEN ' ' + RE.[Surname/Organisation] ELSE RE.[Surname/Organisation] END AS RecipientName, (SELECT IsNull(D.FirstName, '') + CASE WHEN IsNull(D.FirstName, '') <> '' THEN ' ' + D.[Surname/Organisation] ELSE D.[Surname/Organisation] END AS DebtorName FROM Recipients D WHERE Accountno = RE.BillTo) AS DebtorName, RP.Program AS Package, ISNULL(RP.DailyBasicCareFee, 0) AS BasicFee, ISNull(RP.DailyIncomeTestedFee, 0) AS IncomeTestedFee, ISNull(RP.DailyAgreedTopUp, 0) as TopUpFee, (SELECT TOP 1 DATE FROM ROSTER INNER JOIN ITEMTYPES IT ON Title = [Service Type] WHERE Program = RP.Program AND [Client Code] = RE.AccountNo AND IT.MinorGroup = 'ADMISSION') AS [AdmissionDate],(SELECT TOP 1 DATE FROM ROSTER INNER JOIN ITEMTYPES IT ON Title = [Service Type] WHERE Program = RP.Program AND [Client Code] = RE.AccountNo AND IT.MinorGroup = 'DISCHARGE') AS [DischargeDate] FROM RecipientPrograms RP INNER JOIN Recipients RE ON RP.PersonID = RE.UniqueID WHERE PackageType = 'CDC-HCP' AND Right(Program, 11) <> 'CONTINGENCY' ) F WHERE  "
        var lblcriteria,tempsdate,tempedate;
        tempsdate = format(this.startdate, 'yyyy/MM/dd')
        tempedate = format(this.enddate, 'yyyy/MM/dd')

//        ISNULL(AdmissionDate, '2021/02/01') <= '2021/01/31' AND ISNULL(DischargeDate, '2021/01/31') >= '2021/01/01'  
        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " ( ISNULL(AdmissionDate, '" + tempsdate + "') <= '" + tempedate + ("'AND'")+ "'ISNULL(DischargeDate,'" + tempedate +  "') >= '"+ tempsdate + "') ";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        //AND Branch IN ('~DEFAULT') 
        if (branch != "") {
            this.s_BranchSQL = " (Branch in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        //  AND RECIPIENT_CoOrdinator IN ('ADAMS D S')
        if (manager != "") {
            this.s_ManagersSQL = " (RECIPIENT_CoOrdinator in ('" + manager.join("','") + "'))";
            if (this.s_ManagersSQL != "") { fQuery = fQuery + " AND " + this.s_ManagersSQL }
        }
        //AND Category IN ('AAAA')
        if (region != "") {
            this.s_CategorySQL = "R.[AgencyDefinedGroup] in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
//        AND Package IN ('!TEST')

        if (packages != "") {
            this.s_PackageSQL = " (Packagein ('" + packages.join("','") + "'))";
            if (this.s_PackageSQL != "") { fQuery = fQuery + " AND " + this.s_PackageSQL }
        }

        
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Managers," }

        if (branch != "") {
            lblcriteria = lblcriteria + "Branches: " + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (packages != "") {
            lblcriteria = lblcriteria + " Packages " + packages.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Packages " }


        fQuery = fQuery + " ) F1 ORDER BY RECIPIENT_CoOrdinator, Accountno "


        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "ijP4s274R5TQJ9EV" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "CDC Fee Verification.pdf"    
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });
    }
    CDCLeaveVerification(startdate, enddate) {


        var fQuery = "SELECT [CLIENT CODE], CDC_Level ,  [LEAVETYPE], format( DateAdd(D, 0, MIN([DATE])),'dd/MM/yyyy') AS START_DATE,format( DATEADD(D, 0, MAX([DATE])),'dd/MM/yyyy') AS END_DATE, COUNT(*) AS CONTINUOUS_DAYS FROM ( SELECT DISTINCT [CLIENT CODE], IT.[MINORGROUP] AS LEAVETYPE, HRT.User3 as CDC_Level, RE.[BRANCH], RO.[DATE], DATEADD(D,-DENSE_RANK() OVER ( PARTITION BY [CLIENT CODE] ORDER BY [DATE]),[DATE] ) AS RANKDATE FROM ROSTER RO  INNER JOIN RECIPIENTS RE ON RO.[Client Code] = RE.Accountno  INNER JOIN ITEMTYPES IT ON RO.[Service Type] = IT.Title  INNER JOIN HumanResourceTypes HRT ON HRT.Name = RO.Program AND HRT.[GROUP] = 'PROGRAMS'  WHERE  "
        var lblcriteria,tempsdate,tempedate;
        tempsdate = format(this.startdate, 'yyyy/MM/dd')
        tempedate = format(this.enddate, 'yyyy/MM/dd')


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (ro.[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "') ";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        


        fQuery = fQuery + "AND IT.[MINORGROUP] IN ('FULL DAY-HOSPITAL', 'FULL DAY-RESPITE', 'FULL DAY-SOCIAL LEAVE', 'FULL DAY-TRANSITION') ) AS T"
        fQuery = fQuery + " GROUP BY [CLIENT CODE], CDC_Level, [LEAVETYPE], RANKDATE, BRANCH  "

       


        //console.log(fQuery)

     //   this.drawerVisible = true;

        const data = {
            "template": { "_id": "PEsoPqmbOzdz6shH" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "CDC Leave Verification.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });
    }
    CDCClaimVerification(branch,manager, region, program) {




        var fQuery = "SELECT * FROM (SELECT RE.Accountno, RE.Branch, RE.AgencyDefinedGroup AS Category, RE.[MedicareRecipientID],  RE.RECIPIENT_CoOrdinator, IsNull(RE.FirstName, '') + CASE WHEN IsNull(RE.FirstName, '') <> '' THEN ' ' + RE.[Surname/Organisation] ELSE RE.[Surname/Organisation] END AS RecipientName, RP.Program AS Package, Quantity AS [Daily Claim], case when substring(ISNULL(packagesupplements, '00000000000000000000000000') + '00000000000000000000000000', 1, 5) <> '00000' Then 1 ELSE 0 END AS [Dementia/Cognition/Veterans], case when substring(ISNULL(packagesupplements, '00000000000000000000000000') + '00000000000000000000000000', 6, 1) <> '0' Then 1 ELSE 0 END AS [Oxygen], case when substring(ISNULL(packagesupplements, '00000000000000000000000000') + '00000000000000000000000000', 8, 1) <> '0' Then 1 ELSE 0 END AS [Enteral-Bolus], case when substring(ISNULL(packagesupplements, '00000000000000000000000000') + '00000000000000000000000000', 9, 1) <> '0' Then 1 ELSE 0 END AS [Enteral-Non Bolus], case when substring(ISNULL(packagesupplements, '00000000000000000000000000') + '00000000000000000000000000', 10, 1) <> '0' Then 1 ELSE 0 END AS [EACHD], case when substring(ISNULL(packagesupplements, '00000000000000000000000000') + '00000000000000000000000000', 12, 7) <> '0000000' Then 1      when substring(ISNULL(packagesupplements, '00000000000000000000000000') + '00000000000000000000000000', 20, 7) <> '0000000' Then 1 ELSE 0 END AS [Viability], convert(Money, IsNull(HardshipSupplement, 0))   As HardshipSupplement FROM RecipientPrograms RP INNER JOIN Recipients RE ON RP.PersonID = RE.UniqueID INNER JOIN HumanResourceTypes PR ON RP.Program = PR.[Name] WHERE ISNULL(UserYesNo1, 0) = 1 AND UPPER(ISNULL(User2, '')) <> 'CONTINGENCY'  AND ISNULL(UserYesNo3, 0) = 0) t WHERE "
        var lblcriteria;
       


        if (branch != "") {
            this.s_BranchSQL = " (Branch in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
     
        if (manager != "") {
            this.s_ManagersSQL = " (RECIPIENT_CoOrdinator in ('" + manager.join("','") + "'))";
            if (this.s_ManagersSQL != "") { fQuery = fQuery + " AND " + this.s_ManagersSQL }
        }
        
        if (region != "") {
            this.s_CategorySQL = "Category in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
     
        if (program != "") {
            this.s_ProgramSQL = " (Package in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }

        
        if (manager != "") {
            lblcriteria = lblcriteria + " Manager: " + manager.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Managers," }

        if (branch != "") {
            lblcriteria = lblcriteria + "Branches: " + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Branches " }
        if (region != "") {
            lblcriteria = lblcriteria + " Regions: " + region.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Regions," }


        if (program != "") {
            lblcriteria = lblcriteria + " Programs " + program.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + "All Programs." }


        fQuery = fQuery + " ORDER BY  RECIPIENT_CoOrdinator, Accountno"


        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "U4rB7nwpLXzpYQxw" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "CDC Claim Verification.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });
    }
    CDCPackageStatement(batch,branch,packages) {


        var fQuery = "select [Client Code], [Service Type], SUM(ClientCharge) AS [Client Charge], Round(SUM(UnitCost), 0) as [Unit Cost]  FROM  (  select [Client Code], it.DatasetGroup AS [Service Type], billqty, billqty * [unit bill rate] as ClientCharge, billqty * it.unitcost as UnitCost from roster  inner join itemtypes it on [service type] = title  inner join humanresourcetypes pr on [name] = program  WHERE pr.type = 'DSS' and it.it_dataset = 'DEX' and [client code] > '!z' "
        var lblcriteria;






        

        if (batch != "") {
            this.s_BatchSQL = " (  in ('" + batch + "') )";
            if (this.s_BatchSQL != "") { fQuery = fQuery + " AND " + this.s_BatchSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = " ( in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (packages != "") {
            this.s_PackageSQL = " ( in ('" + packages.join("','") + "'))";
            if (this.s_PackageSQL != "") { fQuery = fQuery + " AND " + this.s_PackageSQL }
        }


        
        if (batch != "") {
            lblcriteria = lblcriteria + " Batch Number: " + batch + "; "
        }
        else {
            lblcriteria = lblcriteria + " All Batches "
        }
        if (branch != "") {
            lblcriteria = lblcriteria + " Service Type " + branch.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Svc. Types " }
        if (packages != "") {
            lblcriteria = lblcriteria + " Service Type " + packages.join(",") + "; "
        }
        else { lblcriteria = lblcriteria + " All Packages " }


        fQuery = fQuery + " ) t group by [client code], [service type]  ORDER BY [Client Code], [Service Type]"


        //console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "FMdcJXxcL2qmptzt" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "CDC Package Statement.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });
    }
    staffroster(staff,branch,program,jobcategory,manager,staffteam,startdate,enddate){
        
        var fQuery = " SELECT R.RECORDNO, C.ACCOUNTNO AS CONTACT_ID, C.UBDMap, C.AgencyIDReportingCode AS FileNumber, R.ExtraItems, C.TITLE + ' ' + C.FIRSTNAME + ' ' + C.[SURNAME/ORGANISATION] AS CLIENT_NAME, S.FIRSTNAME + ' ' + S.LASTNAME AS STAFF_NAME, S.ACCOUNTNO AS STAFF_CODE, R.[DATE] AS R_DATE, R.[START TIME], R.[SERVICE TYPE],NC.ADDRESS1 + RTRIM(' ' + ISNULL(NC.ADDRESS2, '')) + RTRIM(' ' + ISNULL(NC.SUBURB,'')) + RTRIM(' ' + ISNULL(NC.POSTCODE,'')) AS CLIENT_ADDRESS,NS.ADDRESS1 + RTRIM(' ' + ISNULL(NS.ADDRESS2, '')) + RTRIM(' ' + ISNULL(NS.SUBURB,'')) + RTRIM(' ' + ISNULL(NS.POSTCODE,'')) AS STAFF_ADDRESS,PC.DETAIL AS PRIMARY_PHONE, MC.DETAIL AS MOBILE_PHONE, PS.DETAIL AS STAFF_PHONE, FS.DETAIL AS STAFF_FAX, R.DURATION/12 AS WORKED_HOURS, C.SPECIALCONSIDERATIONS, R.NOTES, R.Program, r.BillTo, R.[Service Type], R.UBDREF AS Priority, BILLQTY * [UNIT BILL RATE] AS BILLAMOUNT FROM ROSTER R INNER JOIN RECIPIENTS C ON R.[CLIENT CODE] = C.ACCOUNTNO LEFT JOIN STAFF S ON R.[CARER CODE] = S.ACCOUNTNO LEFT JOIN NAMESANDADDRESSES NC ON (C.UNIQUEID = NC.PERSONID AND NC.PRIMARYADDRESS = 1) LEFT JOIN NAMESANDADDRESSES NS ON (S.UNIQUEID = NS.PERSONID AND NS.PRIMARYADDRESS = 1) LEFT JOIN PHONEFAXOTHER PC ON (PC.PERSONID = C.UNIQUEID AND PC.PRIMARYPHONE = 1) LEFT JOIN PHONEFAXOTHER MC ON (MC.PERSONID = C.UNIQUEID AND MC.TYPE LIKE '%MOBILE%') LEFT JOIN PHONEFAXOTHER PS ON (S.UNIQUEID = PS.PERSONID AND PS.PRIMARYPHONE = 1) LEFT JOIN PHONEFAXOTHER FS ON (S.UNIQUEID = FS.PERSONID AND FS.TYPE LIKE '%FAX%') WHERE R.[CLIENT CODE] > '!z' AND R.[TYPE] NOT IN (1,5,9,13 )  "
        //AND  (R.[Date] BETWEEN '2021/11/19' AND '2021/11/19') 
        //AND (R.[Start Time] BETWEEN '00:00' AND '24:00') 
        //AND (([Staff].[STF_DEPARTMENT] = 'ADELAIDE') OR ([Staff].[STF_DEPARTMENT] = 'BRISBANE') OR ([Staff].[STF_DEPARTMENT] = 'DARWIN')) 
        //AND ((R.[Carer Code] = '02 BLACK G') OR (R.[Carer Code] = '1 CRAIG') OR (R.[Carer Code] = 'AABLACK')) 
        //AND (([Staff].[StaffGroup] = 'ADMIN AND FINANCE') OR ([Staff].[StaffGroup] = 'BOARD MEMBER') OR ([Staff].[StaffGroup] = 'CEO')) 
        //AND (([Staff].[PAN_Manager] = 'ALLA KASPARSKI') OR ([Staff].[PAN_Manager] = 'ALLY ARNLEY') OR ([Staff].[PAN_Manager] = 'ALVERA LAGDE')) 
        //AND (([Staff].[StaffTeam] = 'ACCOMODATION SERVICES') OR ([Staff].[StaffTeam] = 'ADMINISTRATION') OR ([Staff].[StaffTeam] = 'CCAS SUICIDE')) 
        //AND ((R.[Program] = 'AAA LEV 3 CRAIG SMITH') OR (R.[Program] = 'AADMIN') OR (R.[Program] = 'ADMIN TRAINING/EDUC - 19500')) 
        //ORDER BY R.RECORDNO "
        var lblcriteria;
        
       
       
        var  tempsdate = format(this.startdate, 'yyyy/MM/dd')
        var  tempedate = format(this.enddate, 'yyyy/MM/dd')

        if (startdate != null || enddate != null) {
            this.s_DateSQL = "  R.[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }   
           
        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[Staff].[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " (R.[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (jobcategory != "") {
            this.s_StfGroupSQL = "( [Staff].[StaffGroup] in ('" + jobcategory.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (staff != "") {
            this.s_StaffSQL = "(R.[Carer Code] in ('" + staff.join("','") + "'))";
            if (this.s_StaffSQL != "") { fQuery = fQuery + " AND " + this.s_StaffSQL };
        }

        fQuery = fQuery + " ORDER BY R.RECORDNO "

        console.log(fQuery)

if(this.inputForm.value.Rptformat.toString() == 'Fixed Layout'){
var id = "cdt0yJ66aXouhNux";
}else{
var id = "wE05f9PtCWLd67G8";
}




        const data = {
            "template": { "_id": id },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Roster.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });

    }     
    mealrunsheet(group,branch,program,jobcategory,manager,staffteam,startdate,enddate){
        //var fQuery = " SELECT [Roster].[Carer Code], [Roster].[Date], [Roster].[YearNo], [Roster].[MonthNo], [Roster].[Dayno], [Roster].[Start Time], [Roster].[Duration] As FiveMinBlocks, [Roster].[Duration] * 5 As DurationInMinutes, [Roster].[CostUnit], [Roster].[BillQTY], [Roster].[Unit Bill Rate] AS Charge, (SELECT Sum(ISNULL(BillQty,0) * ISNULL([Unit Bill Rate], 0)) FROM Roster WHERE ItemTypes.MINORGROUP = 'MEALS' AND  ([Roster].[Date] BETWEEN '2021/11/13' AND '2021/11/13') AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') AND [Roster].[Carer Code] > '!z' ) AS TotalCharge , [Roster].[Client Code], [Roster].[Program], [Roster].[Service Type], [Roster].[Type], [Roster].[Service Description], [Roster].[ServiceSetting], [Roster].[Notes], [Staff].[FirstName], [Staff].[LastName], [Staff].[STF_CODE], [Staff].[StaffGroup], [Recipients].[SpecialConsiderations], [Recipients].[FirstName], CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[Surname/Organisation] + ', ' + [Recipients].[FirstName] ELSE [Recipients].[Surname/Organisation]END AS [RecipientName], [Recipients].[AgencyIDReportingCode], [Recipients].[AgencyDefinedGroup], [Recipients].[Careplanchange], [Recipients].[Branch] FROM [Roster] INNER JOIN [Staff] ON [Roster].[Carer Code] = [Staff].AccountNo INNER JOIN [Recipients] ON [Roster].[Client Code] = [Recipients].AccountNo INNER JOIN [ItemTypes] ON [Roster].[Service Type] = [ItemTypes].Title WHERE  ItemTypes.MINORGROUP = 'MEALS'  AND  ([Roster].[Date] BETWEEN '2021/03/01' AND '2021/11/13') AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') "
        //AND [Roster].[Carer Code] > '!z'  
        //ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Carer Code] , Roster.[Service Type] "
        var lblcriteria;
        var template_id;
       
       
        var  tempsdate = format(this.startdate, 'yyyy/MM/dd')
        var  tempedate = format(this.enddate, 'yyyy/MM/dd')

        var fQuery = " SELECT [Roster].[Carer Code], [Roster].[Date], [Roster].[YearNo], [Roster].[MonthNo], [Roster].[Dayno], [Roster].[Start Time], [Roster].[Duration] As FiveMinBlocks, [Roster].[Duration] * 5 As DurationInMinutes, [Roster].[CostUnit], [Roster].[BillQTY], [Roster].[Unit Bill Rate] AS Charge, (SELECT Sum(ISNULL(BillQty,0) * ISNULL([Unit Bill Rate], 0)) FROM Roster WHERE ItemTypes.MINORGROUP = 'MEALS' " 
         fQuery =  fQuery + " AND  ([Roster].[Date] BETWEEN " + tempsdate + " AND " + tempedate +") AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00')  "
        //" AND (([Recipients].[Branch] = 'PERTH')) AND (([Roster].[ServiceSetting] = 'MEALS')) AND (([Roster].[Program] = 'AADMIN') OR ([Roster].[Program] = 'ADMIN TRAINING/EDUC - 19500') OR ([Roster].[Program] = 'CBI-78001')
        // 
          
/*        //branch, manager, region, , startdate, enddate


            AND  ([Roster].[Date] BETWEEN '2021/01/13' AND '2021/11/13') 
            AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') 
            AND [Roster].[Client Code] > '!z'  
            AND (([Recipients].[Branch] = 'PERTH')) 
            AND (([Roster].[ServiceSetting] = 'MEALS')) 
            AND (([Roster].[Program] = 'AADMIN') OR ([Roster].[Program] = 'ADMIN TRAINING/EDUC - 19500') OR ([Roster].[Program] = 'CBI-78001')) 
        
            ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Client Code] , Roster.[Service Type]
            */
                     
        fQuery = fQuery + " AND ( [Roster].[Client Code] > '!z' "     
        if (branch != "") {
            this.s_BranchSQL = "[Recipients].[Branch] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[Recipients].[RECIPIENT_CoOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Roster].[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (jobcategory != "") {
            this.s_StfGroupSQL = "( StaffGroup in ('" + jobcategory.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([STAFFTEAM] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (group != "") {
            this.s_GroupSQL = "([STAFFTEAM] in ('" + group.join("','") + "'))";
            if (this.s_GroupSQL != "") { fQuery = fQuery + " AND " + this.s_GroupSQL };
        }

        fQuery = fQuery + " ) ) AS TotalCharge , [Roster].[Client Code], [Roster].[Program], [Roster].[Service Type], [Roster].[Type], [Roster].[Service Description], [Roster].[ServiceSetting], [Roster].[Notes], [Staff].[FirstName], [Staff].[LastName], [Staff].[STF_CODE], [Staff].[StaffGroup], [Recipients].[SpecialConsiderations], [Recipients].[FirstName], CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[Surname/Organisation] + ', ' + [Recipients].[FirstName] ELSE [Recipients].[Surname/Organisation]END AS [RecipientName], [Recipients].[AgencyIDReportingCode], [Recipients].[AgencyDefinedGroup], [Recipients].[Careplanchange], [Recipients].[Branch] FROM [Roster] INNER JOIN [Staff] ON [Roster].[Carer Code] = [Staff].AccountNo INNER JOIN [Recipients] ON [Roster].[Client Code] = [Recipients].AccountNo INNER JOIN [ItemTypes] ON [Roster].[Service Type] = [ItemTypes].Title WHERE ItemTypes.MINORGROUP = 'MEALS' "

        if (startdate != null || enddate != null) {
            this.s_DateSQL = "  [Roster].[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }   
           
        if (branch != "") {
            this.s_BranchSQL = "[Recipients].[Branch] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[Recipients].[RECIPIENT_CoOrdinator] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Roster].[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (jobcategory != "") {
            this.s_StfGroupSQL = "( StaffGroup in ('" + jobcategory.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([STAFFTEAM] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (group != "") {
            this.s_StfTeamSQL = "([STAFFTEAM] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }







        
        if (this.inputForm.value.displayby.toString() == 'DISPLAY BY RECIPIENT CODE') {
            var Title = "FOR RECIPIENT"                                     
            fQuery = fQuery + " ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Client Code] , Roster.[Service Type] "        
        }else {
            Title = "FOR STAFF"
            fQuery = fQuery + " ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Carer Code] , Roster.[Service Type] "
        }
        
        //console.log(fQuery)
        
        switch (this.inputForm.value.Rptformat.toString()) {            
            case 'Format Run Sheet': 
                this.pdfTitle = "Run Sheet.pdf"
                template_id = "YT596enOno44LTQR"
                     
                break;
            case 'Format Meal Plan':
                this.pdfTitle = "Meal Plan.pdf"
                template_id = "C7ejywKAsIDA10jQ"
                
                break;
            case 'Format Pack Sheet':
                this.pdfTitle = "Pack Sheet.pdf"
                template_id = "3fcEJt86rAvucSeP"
                
                break;
                        
            default:
                this.pdfTitle = "Meal RunSheet.pdf"
                template_id = "YT596enOno44LTQR"
                break;
        }

        const data = {
            "template": { "_id": template_id },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "TitleDisplay": Title,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;
        

        this.printS.print(data).subscribe((blob: any) => {
           
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });

    }    
    transportrunsheet(vehicle,branch,program,jobcategory,manager,staffteam,startdate,enddate){
        //var fQuery = " SELECT [Roster].[Carer Code], [Recipients].[BillTo] as DebtorCode, [Roster].[Date],Datename(weekday,[Date]) As [Day], [Roster].[YearNo], [Roster].[MonthNo], [Roster].[Dayno], [Roster].[Start Time], [Roster].[Duration] As FiveMinBlocks, [Roster].[Duration] * 5 As DurationInMinutes,Convert(nvarchar,DateAdd(minute,([Roster].[Duration] * 5),[Roster].[Start Time]), 108) as [End Time], [Roster].[BillQTY], [Roster].[Unit Bill Rate] AS Charge, [Roster].[BillQTY] * [Roster].[Unit Bill Rate] AS TotalFare, [Roster].[Unit Bill Rate] AS Charge, [Roster].[CostUnit], [Roster].[Client Code], [Roster].[Program], [Roster].[Service Type], [Roster].[Type], [Roster].[Service Description], [Roster].[ServiceSetting], [Roster].[Notes] as RosterNotes, [Roster].[ShiftName] as Driver, [Roster].[Time2], [Staff].[FirstName], [Staff].[LastName], [Staff].[STF_CODE], [Staff].[StaffGroup], [Recipients].[SpecialConsiderations], CASE WHEN [Recipients].[PreferredName] <> '' THEN [Recipients].[PreferredName] ELSE CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName] ELSE '' END END + ' ' + CASE WHEN [Recipients].[Surname/Organisation] <> '' THEN [Recipients].[Surname/Organisation] ELSE '' END AS RecipientName, [Recipients].[Surname/Organisation], [Recipients].[AgencyIDReportingCode], [Recipients].[AgencyDefinedGroup], [Recipients].[Careplanchange], [Recipients].[Mobility] AS Mobility, [Recipients].[Branch], CASE WHEN ISNULL([Recipients].[HideTransportFare], 0) = 0 THEN 'FALSE' ELSE 'TRUE' END AS ShowFare, TransportDetail.PickUpAddress1, TransportDetail.PickUpAddress2, TransportDetail.DropOffAddress2, TransportDetail.DropOffAddress1, TransportDetail.DropOffAddress3 AS RetVcl FROM [Roster] INNER JOIN [Staff] ON [Roster].[Carer Code] = [Staff].AccountNo INNER JOIN [Recipients] ON [Roster].[Client Code] = [Recipients].AccountNo LEFT OUTER JOIN TransportDetail ON Roster.RecordNo = TransportDetail.RosterID WHERE [Roster].[Type] = 10 AND  ([Roster].[Date] BETWEEN '2017/10/19' AND '2017/12/29') AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') AND [Roster].[Carer Code] > '!z'  ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Carer Code] , Roster.Type "
        var lblcriteria;

        var  tempsdate = format(this.startdate, 'yyyy/MM/dd')
        var  tempedate = format(this.enddate, 'yyyy/MM/dd')
        var fQuery =  "SELECT [Roster].[Carer Code], [Recipients].[BillTo] as DebtorCode, [Roster].[Date], [Roster].[YearNo], [Roster].[MonthNo], [Roster].[Dayno], [Roster].[Start Time], [Roster].[Duration] As FiveMinBlocks, [Roster].[Duration] * 5 As DurationInMinutes, [Roster].[BillQTY], [Roster].[Unit Bill Rate] AS Charge, [Roster].[BillQTY] * [Roster].[Unit Bill Rate] AS TotalFare, [Roster].[Unit Bill Rate] AS Charge, [Roster].[CostUnit], [Roster].[Client Code], [Roster].[Program], [Roster].[Service Type], [Roster].[Type], [Roster].[Service Description], [Roster].[ServiceSetting], [Roster].[Notes] as RosterNotes, [Roster].[ShiftName] as Driver, [Roster].[Time2], [Staff].[FirstName], [Staff].[LastName], [Staff].[STF_CODE], [Staff].[StaffGroup], [Recipients].[SpecialConsiderations], CASE WHEN [Recipients].[PreferredName] <> '' THEN [Recipients].[PreferredName] ELSE CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName] ELSE '' END END + ' ' + CASE WHEN [Recipients].[Surname/Organisation] <> '' THEN [Recipients].[Surname/Organisation] ELSE '' END AS RecipientName, [Recipients].[Surname/Organisation], [Recipients].[AgencyIDReportingCode], [Recipients].[AgencyDefinedGroup], [Recipients].[Careplanchange], [Recipients].[Mobility] AS Mobility, [Recipients].[Branch], CASE WHEN ISNULL([Recipients].[HideTransportFare], 0) = 0 THEN 'FALSE' ELSE 'TRUE' END AS ShowFare, TransportDetail.PickUpAddress1, TransportDetail.PickUpAddress2, TransportDetail.DropOffAddress2, TransportDetail.DropOffAddress1, TransportDetail.DropOffAddress3 AS RetVcl FROM [Roster] INNER JOIN [Staff] ON [Roster].[Carer Code] = [Staff].AccountNo INNER JOIN [Recipients] ON [Roster].[Client Code] = [Recipients].AccountNo LEFT OUTER JOIN TransportDetail ON Roster.RecordNo = TransportDetail.RosterID WHERE [Roster].[Type] = 10 AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') AND [Roster].[Carer Code] > '!z' "
        //AND  ([Roster].[Date] BETWEEN '2021/11/18' AND '2021/11/18')
        //    
        //AND (([Staff].[STF_DEPARTMENT] = 'ADELAIDE') OR ([Staff].[STF_DEPARTMENT] = 'BRISBANE') OR ([Staff].[STF_DEPARTMENT] = 'DARWIN')) 
        //AND (([Staff].[StaffGroup] = 'ADMIN AND FINANCE') OR ([Staff].[StaffGroup] = 'BOARD MEMBER') OR ([Staff].[StaffGroup] = 'CEO')) 
        //AND (([Staff].[PAN_Manager] = 'ALLA KASPARSKI') OR ([Staff].[PAN_Manager] = 'ALLY ARNLEY') OR ([Staff].[PAN_Manager] = 'ALVERA LAGDE')) 
        //AND (([Staff].[StaffTeam] = 'ACCOMODATION SERVICES') OR ([Staff].[StaffTeam] = 'ADMINISTRATION') OR ([Staff].[StaffTeam] = 'CCAS SUICIDE')) 
        //AND (([Roster].[ServiceSetting] = ' ALL') OR ([Roster].[ServiceSetting] = '+BUS') OR ([Roster].[ServiceSetting] = 'CAR') OR ([Roster].[ServiceSetting] = 'GROUP VEHICLE')) 
        //AND (([Roster].[Program] = 'AAA LEV 3 CRAIG SMITH') OR ([Roster].[Program] = 'AADMIN') OR ([Roster].[Program] = 'ADMIN TRAINING/EDUC - 19500') OR ([Roster].[Program] = 'AFTER SCHOOL GROUP THURSDAY-29007')) 
        

        if (startdate != null || enddate != null) {
            this.s_DateSQL = "  [Roster].[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }   
           
        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[Staff].[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Roster].[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (jobcategory != "") {
            this.s_StfGroupSQL = "( [Staff].[StaffGroup] in ('" + jobcategory.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (vehicle != "") {
            this.s_vehicleSQL = "([Roster].[ServiceSetting] in ('" + vehicle.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }

        fQuery = fQuery + " ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Carer Code] , Roster.Type "

        //console.log(fQuery)

        const data = {
            "template": { "_id": "z9t6vX3nAjCeLHtc" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "Transport RunSheet.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });

    }  
    groupActivityRoster(group,branch,program,jobcategory,manager,staffteam,startdate,enddate){
        var fQuery = " SELECT CASE WHEN [Roster].[Carer Code] = 'BOOKED' THEN '**UNFILLED SHIFT' ELSE [Roster].[Carer Code] END AS [Carer Code], [Roster].[Date], [Recipients].[BillTo] as DebtorCode, [Roster].[YearNo], [Roster].[MonthNo], [Roster].[Dayno], [Roster].[Start Time], [Roster].[Duration] As FiveMinBlocks, [Roster].[Duration] * 5 As DurationInMinutes, [Roster].[CostUnit], [Roster].[Client Code], [Roster].[Program], [Roster].[Service Type], [Roster].[Type], [Roster].[Service Description], [Roster].[ServiceSetting], [Roster].[Notes], [Recipients].[SpecialConsiderations], [Recipients].[FirstName], [Recipients].[AgencyIDReportingCode], [Recipients].[AgencyDefinedGroup], [Recipients].[Branch], [Recipients].[Careplanchange], [Roster].[BillQTY] * [Roster].[Unit Bill Rate] AS TotalFare, CASE WHEN ISNULL([Recipients].[HideTransportFare], 0) = 0 THEN 'FALSE' ELSE 'TRUE' END AS ShowFare, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS Address, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS Contact FROM [Roster] INNER JOIN [Recipients] ON [Roster].[Client Code] = [Recipients].AccountNo LEFT JOIN [Staff] ON [Roster].[Carer Code] = [Staff].AccountNo LEFT JOIN (SELECT PERSONID, Suburb,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE '' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE '' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = Recipients.UniqueID LEFT JOIN (SELECT TOP 1 PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE '' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE '' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = Recipients.UniqueID LEFT JOIN (SELECT PersonID,  CASE WHEN Detail <> '' THEN Detail ELSE '' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = Recipients.UniqueID LEFT JOIN (SELECT TOP 1 PersonID,  CASE WHEN Detail <> '' THEN Detail ELSE '' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = Recipients.UniqueID WHERE ([Roster].[Type] = 12) AND [Roster].[Carer Code] > '!z' AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') "
    
        //AND  ([Roster].[Date] BETWEEN '2021/11/19' AND '2021/11/19') 
        //AND (([Staff].[STF_DEPARTMENT] = 'ADELAIDE') OR ([Staff].[STF_DEPARTMENT] = 'BRISBANE'))
        // AND (([Staff].[StaffGroup] = 'ADMIN AND FINANCE') OR ([Staff].[StaffGroup] = 'BOARD MEMBER')) 
        //AND (([Staff].[PAN_Manager] = 'ALLA KASPARSKI') OR ([Staff].[PAN_Manager] = 'ALLY ARNLEY')) 
        //AND (([Staff].[StaffTeam] = 'ACCOMODATION SERVICES') OR ([Staff].[StaffTeam] = 'ADMINISTRATION')) 
        //AND (([Roster].[ServiceSetting] = 'A BAILEY C PARTRIDGE') OR ([Roster].[ServiceSetting] = 'AFTER SCHOOL GRP')) 
        //AND (([Roster].[Program] = 'AAA LEV 3 CRAIG SMITH') OR ([Roster].[Program] = 'AADMIN'))  "
               
        var lblcriteria;

        var  tempsdate = format(this.startdate, 'yyyy/MM/dd')
        var  tempedate = format(this.enddate, 'yyyy/MM/dd')

        if (startdate != null || enddate != null) {
            this.s_DateSQL = "  [Roster].[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }   
           
        if (branch != "") {
            this.s_BranchSQL = "[Staff].[STF_DEPARTMENT] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[Staff].[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([Roster].[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (jobcategory != "") {
            this.s_StfGroupSQL = "( [Staff].[StaffGroup] in ('" + jobcategory.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (group != "") {
            this.s_GroupSQL = "([Roster].[ServiceSetting] in ('" + group.join("','") + "'))";
            if (this.s_GroupSQL != "") { fQuery = fQuery + " AND " + this.s_GroupSQL };
        }

        fQuery = fQuery + " ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Carer Code] , Roster.Type "

        const data = {
            "template": { "_id": "CoDMIh3sgJNoIS43" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "Group Activity Rosters.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });

    }
    locationrosters(location,branch,program,jobcategory,manager,staffteam,startdate,enddate){
        
        
         var lblcriteria;

        if(this.inputForm.value.Rptformat.toString() == 'Attendance Sheet'){
            var fQuery = " SELECT CASE WHEN [Recipients].[PreferredName] <> '' THEN [Recipients].[PreferredName]+' '+ [Recipients].[Surname/Organisation] ELSE [Recipients].[FirstName] +' '+ [Recipients].[Surname/Organisation] END AS RecipientName, [R].[Notes], [R].[DATE],[R].[TYPE],[R].[CLIENT CODE], [R].[SERVICE TYPE],  [R].[BILLQTY] * [R].[UNIT BILL RATE] AS FEE , (SELECT TOP 1 [ServiceSetting] FROM Roster r1      WHERE          r1.[Client Code] = R.[Client Code]      AND r1.[Date] = R.Date      AND r1.[Start Time] < R.[Start Time]      AND r1.Type = 10) AS ServiceSetting FROM Roster R INNER JOIN [Recipients] ON [R].[Client Code] = [Recipients].AccountNo WHERE [R].[Type] IN (11) AND ([R].[Start Time] BETWEEN '00:00' AND '24:00') AND [R].[Client Code] > '!z' "                   
            }else{
               var fQuery = "SELECT CASE WHEN [Roster].[Carer Code] = 'BOOKED' THEN '**UNFILLED SHIFT' ELSE [Roster].[Carer Code] END AS [Carer Code], [Roster].[Date], [Recipients].[BillTo] as DebtorCode, [Roster].[YearNo], [Roster].[MonthNo], [Roster].[Dayno], [Roster].[Start Time], [Roster].[Duration] As FiveMinBlocks, [Roster].[Duration] * 5 As DurationInMinutes, [Roster].[CostUnit], [Roster].[Client Code], [Roster].[Program], [Roster].[Service Type], [Roster].[Type], [Roster].[Service Description], [Roster].[ServiceSetting], [Roster].[Notes], [Recipients].[SpecialConsiderations], [Recipients].[FirstName], [Recipients].[AgencyIDReportingCode], [Recipients].[AgencyDefinedGroup], [Recipients].[Branch], [Recipients].[Careplanchange], [Roster].[BillQTY] * [Roster].[Unit Bill Rate] AS TotalFare, CASE WHEN ISNULL([Recipients].[HideTransportFare], 0) = 0 THEN 'FALSE' ELSE 'TRUE' END AS ShowFare, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS Address, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS Contact FROM Roster R INNER JOIN [Recipients] ON [Roster].[Client Code] = [Recipients].AccountNo LEFT JOIN [Staff] ON [Roster].[Carer Code] = [Staff].AccountNo LEFT JOIN (SELECT PERSONID, Suburb,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE '' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE '' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = Recipients.UniqueID LEFT JOIN (SELECT TOP 1 PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE '' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE '' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = Recipients.UniqueID LEFT JOIN (SELECT PersonID,  CASE WHEN Detail <> '' THEN Detail ELSE '' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = Recipients.UniqueID LEFT JOIN (SELECT TOP 1 PersonID,  CASE WHEN Detail <> '' THEN Detail ELSE '' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = Recipients.UniqueID WHERE ([Roster].[Type] = 11)  AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') AND [Roster].[Client Code] > '!z' "
            }
            //AND  ([Roster].[Date] BETWEEN '2021/11/19' AND '2021/11/19') 
            //AND (([Recipients].[Branch] = 'ADELAIDE') OR ([Recipients].[Branch] = 'BRISBANE')) 
            //AND (([Roster].[ServiceSetting] = 'AA COMMUNITY') OR ([Roster].[ServiceSetting] = 'AHMAD')) 
            //AND (([Roster].[Program] = 'AAA LEV 3 CRAIG SMITH') OR ([Roster].[Program] = 'AADMIN')) "
           

        

        var  tempsdate = format(this.startdate, 'yyyy/MM/dd')
        var  tempedate = format(this.enddate, 'yyyy/MM/dd')

        if (startdate != null || enddate != null) {
            this.s_DateSQL = "  [R].[Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "'";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }   
           
        if (branch != "") {
            this.s_BranchSQL = "[Recipients].[Branch] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
        if (manager != "") {
            this.s_CoordinatorSQL = "[Staff].[PAN_Manager] in ('" + manager.join("','") + "')";
            if (this.s_CoordinatorSQL != "") { fQuery = fQuery + " AND " + this.s_CoordinatorSQL };
        }
        if (program != "") {
            this.s_ProgramSQL = " ([R].[Program] in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
        if (jobcategory != "") {
            this.s_StfGroupSQL = "( [Staff].[StaffGroup] in ('" + jobcategory.join("','") + "'))";
            if (this.s_StfGroupSQL != "") { fQuery = fQuery + " AND " + this.s_StfGroupSQL };
        }
        if (staffteam != "") {
            this.s_StfTeamSQL = "([Staff].[StaffTeam] in ('" + staffteam.join("','") + "'))";
            if (this.s_StfTeamSQL != "") { fQuery = fQuery + " AND " + this.s_StfTeamSQL };
        }
        if (location != "") {
            this.s_locationSQL = "([R].[ServiceSetting] in ('" + location.join("','") + "'))";
            if (this.s_locationSQL != "") { fQuery = fQuery + " AND " + this.s_locationSQL };
        }

          

        

        





        if(this.inputForm.value.Rptformat.toString() == 'Attendance Sheet'){
            fQuery = fQuery + " ORDER BY [DATE], [ServiceSetting], RECIPIENTNAME"
            var id = "UAPvwdP5GydahuRa";
            }else{
                fQuery = fQuery + " ORDER BY Roster.[ServiceSetting], Roster.Date,  Roster.[Start Time], Roster.[Client Code] , Roster.Type "
                var id = "tQmPyebgakeI4q0x";
            }

            console.log(fQuery)


        const data = {
            "template": { "_id": id },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "Location Rosters.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });

}   
    staffjoobsheet(){
        var fQuery = " SELECT [Roster].[RecordNo], [Roster].[Carer Code], [Roster].[Date], [Roster].[YearNo], [Roster].[MonthNo], [Roster].[Dayno], [Roster].[Start Time], [Roster].[Duration] As FiveMinBlocks,Convert(nvarchar,DateAdd(minute,([Roster].[Duration] * 5),[Roster].[Start Time]), 108) as [End Time],Datename(weekday,[Date]) As [Day], [Roster].[CostUnit], [Roster].[Client Code], [Program] AS Program, [Roster].[Service Type], [Roster].[Type], [Roster].[Service Description], [Roster].[ServiceSetting], [Roster].[RecordNo] AS TimeLogId, [Roster].[Notes] as RosterNotes, [Roster].[Client Code] + ' ' + [Recipients].[FirstName] AS ClientCode_FirstName, [ItemTypes].[RosterGroup], [ItemTypes].[MinorGroup], [ItemTypes].[InfoOnly], CASE WHEN [ItemTypes].[InfoOnly] = 1 THEN 0 ELSE [Roster].[Duration] * 5 END As DurationInMinutes, [Staff].[FirstName], [Staff].[LastName], [Staff].[STF_CODE], [Staff].[StaffGroup], [Staff].[PAN_Manager], [Staff].[StaffTeam], [Recipients].[SpecialConsiderations], [Recipients].[FirstName] AS rFirstName, [Recipients].[AgencyIDReportingCode], [Recipients].[AgencyDefinedGroup], [Recipients].[Branch], [Recipients].[BillTo] as DebtorCode, [Roster].[BillQTY] * [Roster].[Unit Bill Rate] AS TotalFare, [Recipients].[UniqueID], [Recipients].[Careplanchange], [Recipients].[Careplanchange], CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS Address, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS Contact FROM [Roster] INNER JOIN [Staff] ON [Roster].[Carer Code] = [Staff].AccountNo INNER JOIN [Recipients] ON [Roster].[Client Code] = [Recipients].AccountNo INNER JOIN [ItemTypes] ON [Roster].[Service Type] = [ItemTypes].Title INNER JOIN [HumanResourceTypes] pr ON [Roster].[Program] = pr.Name LEFT JOIN (SELECT PERSONID, Suburb,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE '' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE '' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = Recipients.UniqueID LEFT JOIN (SELECT TOP 1 PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE '' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE '' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE '' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = Recipients.UniqueID LEFT JOIN (SELECT PersonID,  CASE WHEN Detail <> '' THEN Detail ELSE '' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = Recipients.UniqueID LEFT JOIN (SELECT TOP 1 PersonID,  CASE WHEN Detail <> '' THEN Detail ELSE '' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = Recipients.UniqueID WHERE [Roster].[Type] <> 13 AND[Roster].[Type] <> 9  AND  ([Roster].[Date] BETWEEN '2019/08/02' AND '2019/08/15') AND ([Roster].[Start Time] BETWEEN '00:00' AND '24:00') AND [Roster].[Carer Code] > '!z'  ORDER BY Roster.[Carer Code], Roster.Date,  Roster.[Start Time], Roster.[Client Code] , Roster.Type "
        var lblcriteria;



        const data = {
            "template": { "_id": "cdt0yJ66aXouhNux" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "Staff Job Sheet.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });

}    
    medicareclaim(){
        var fQuery = " "
        var lblcriteria;




        const data = {
            "template": { "_id": "" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,
                "userid": this.tocken.user,


            }
        }
        this.loading = true;
        this.drawerVisible = true;
        

        this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = "CDC Medicare Claim.pdf"
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
                console.log(err);
            });

}
InvoiceBatchRegister(BatchNO){
    
     

    var fQuery = " SELECT DD.Description AS Branch, US.Name AS [Operator], IH.BatchNumber, IH.[traccs processing date] AS [Date], IH.[invoice number], IH.[client code], IH.[patient code], IH.[invoice amount], [vision processing date] FROM InvoiceHeader IH LEFT JOIN DataDomains DD ON IH.BRID = DD.RecordNumber LEFT JOIN Userinfo US ON IH.OPID = US.Recnum WHERE  HType = 'I' "
    var lblcriteria;

    //AND batchnumber = 12      

    fQuery = fQuery + " AND batchnumber =  " + BatchNO
    fQuery = fQuery + " ORDER BY [traccs processing date], [vision processing date]  "

    //console.log(fQuery)

    const data = {
        "template": { "_id": "JD7O2itNGTqaoewL" },
        "options": {
            "reports": { "save": false },

            "sql": fQuery,
            "Criteria": lblcriteria,
            "userid": this.tocken.user,


        }
    }
    this.loading = true;
    this.drawerVisible = true;
    

    this.printS.print(data).subscribe((blob: any) => {
        this.pdfTitle = "Invoice Batch Register.pdf"
        this.drawerVisible = true;                   
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loading = false;
        this.cd.detectChanges();
    }, err => {
            console.log(err);
        });



}

AccountStatement(branch,recipient,startdate,enddate){
    var fQuery = " SELECT  NA.Address1,NA.Suburb,NA.Postcode,(RE.Title + ' ' +RE.FirstName+ ' ' +RE.MiddleNames+ ' ' +RE.[Surname/Organisation] ) as Name,RE.AccountNo AS Debtor, IH.[Traccs Processing Date] AS [Date], IH.[Patient Code] AS Recipient, IH.[Invoice Number] AS [Number], CONVERT(money, IH.[Invoice Amount]) AS Amount, CASE WHEN IH.HType = 'R' THEN 0 ELSE CONVERT(money, IH.[Invoice Tax]) END AS GST, CONVERT(money, ISNULL(IH.[Invoice Amount], 0) - ISNULL(IH.Paid, 0)) AS [O/S] , CASE WHEN IH.HType = 'R' THEN 'PAYMENT' WHEN IH.Htype = 'A' THEN 'ADUST' WHEN IH.Htype = 'C' THEN 'CREDIT' ELSE 'INVOICE' END AS [Type], IH.Notes FROM Recipients RE LEFT JOIN InvoiceHeader IH ON RE.AccountNo = IH.[Client Code] join NamesAndAddresses NA ON RE.UniqueID = NA.PersonID WHERE ((ISNULL([Invoice Amount], 0) - ISNULL(Paid, 0) <> 0) "
    
    //[Client Code] IN ('AA BB (M) 19560721', 'AAA B C (F)') 
    //AND [Branch] IN ('ADELAIDE', 'MELBOURNE') 
    //OR [Traccs Processing Date] BETWEEN '2021-10-31' AND '2021-10-31') "
    var lblcriteria;

        var  tempsdate = format(this.startdate, 'yyyy/MM/dd')
    //    var  tempedate = format(this.enddate, 'yyyy/MM/dd')
        
        
        var  tempedate = format(new Date(this.startdate.getFullYear(), this.startdate.getMonth() , this.startdate.getDay()+ this.inputForm.value.AgingCycles), 'yyyy/MM/dd');
        
    //    console.log(tempedate)
        

        if (startdate != null || enddate != null) {
            this.s_DateSQL = "  [Traccs Processing Date] BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " OR " + this.s_DateSQL };
        }   
           
        if (branch != "") {
            this.s_BranchSQL = "[Branch] in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }

        if (recipient != "") {
            this.s_RecipientSQL = " ([Client Code] in ('" + recipient.join("','") + "'))";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " AND " + this.s_RecipientSQL }
        }
    
        fQuery = fQuery + " ORDER BY [traccs processing date], [vision processing date]  ";

    console.log(fQuery)

    const data = {
        "template": { "_id": "l3JDWlh6zzEvz8Do" },
        "options": {
            "reports": { "save": false },

            "sql": fQuery,
            "Criteria": lblcriteria,
            "userid": this.tocken.user,


        }
    }
    this.loading = true;
    //this.drawerVisible = true;
    

    this.printS.print(data).subscribe((blob: any) => {
        this.pdfTitle = "Account Statement.pdf"
        this.drawerVisible = true;                   
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loading = false;
        this.cd.detectChanges();
    }, err => {
            console.log(err);
        });

}
ageddebtor(branch,recipient,AgingDays,allBranches,allClients){

    var lblcriteria;
    var fQuery = " SELECT Debtor, [Type] , P0, P1, P2, P3, P4, P0 + P1 + P2 + P3 + P4 as pTotal FROM (SELECT Debtor, [Type] , SUM(isnull(P0_Amount, 0)) AS P0, SUM(isnull(P1_Amount, 0)) AS P1, SUM(isnull(P2_Amount, 0)) AS P2, SUM(isnull(P3_Amount, 0)) AS P3, SUM(isnull(P4_Amount, 0)) As p4 FROM(SELECT Debtor, [Type] ,CASE WHEN iAGE = 0 THEN [O/S] END AS P0_Amount, CASE WHEN iAGE = 1 THEN [O/S] END AS P1_Amount, CASE WHEN iAGE = 2 THEN [O/S] END AS P2_Amount, CASE WHEN iAGE = 3 THEN [O/S] END AS P3_Amount, CASE WHEN iAGE = 4 THEN [O/S] END AS P4_Amount FROM (SELECT  R.[Branch], IH.[Client Code] AS Debtor, IH.[Traccs Processing Date] AS [Date], IH.[Patient Code] AS Recipient, IH.[Invoice Number] AS [Number], "
    var  tempsdate = format(this.startdate, 'yyyy-MM-dd')
    
    fQuery = fQuery + " DATEADD(day,-"+AgingDays+", '"+tempsdate+"') as TESTDATE, "     
    fQuery = fQuery + " DATEDIFF(DAY, IH.[Traccs Processing Date], '"+tempsdate+"') AS TestAge, "
    fQuery = fQuery + " CASE WHEN IH.[Traccs Processing Date] > '"+tempsdate+"' THEN 0  ELSE  "   
    fQuery = fQuery + " CASE WHEN DATEDIFF(DAY, IH.[Traccs Processing Date], '"+tempsdate+"') BETWEEN 0 AND 30 THEN 1 "
    fQuery = fQuery + " WHEN DATEDIFF(DAY, IH.[Traccs Processing Date], '"+tempsdate+"') BETWEEN 31 AND 60 THEN 2  "
    fQuery = fQuery + " WHEN DATEDIFF(DAY, IH.[Traccs Processing Date], '"+tempsdate+"') BETWEEN 61 AND 90 THEN 3   "
    fQuery = fQuery + " WHEN DATEDIFF(DAY, IH.[Traccs Processing Date], '"+tempsdate+"') > 90 THEN 4 ELSE 4 END END AS iAge,"
    fQuery = fQuery + " CONVERT(money, ISNULL(IH.[Invoice Amount], 0) - ISNULL(IH.Paid, 0)) AS [O/S] , CASE WHEN IH.HType = 'R' THEN 'PAYMENT' WHEN IH.Htype = 'A' THEN 'ADUST' WHEN IH.Htype = 'C' THEN 'CREDIT' ELSE 'INVOICE' END AS [Type] FROM InvoiceHeader IH INNER JOIN Recipients R ON IH.[Patient Code] = R.AccountNo "
        
    
                                                      
        if (recipient != "") {
            this.s_RecipientSQL = " (IH.[Client Code] in ('" + recipient.join("','") + "'))";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " where " + this.s_RecipientSQL }
        }else{
            this.s_RecipientSQL = " (IH.[Client Code] in ('" + allClients.join("','") + "'))";
            if (this.s_RecipientSQL != "") { fQuery = fQuery + " where " + this.s_RecipientSQL }      
        }
        if (branch != "") {
            this.s_BranchSQL = "R.Branch in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }else{
            this.s_BranchSQL = "R.Branch in ('" + allBranches.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }
    
        fQuery = fQuery + " )  t ) t1 GROUP BY DEBTOR , [Type] ) t2 WHERE (p1 + p2 + p3 + p4) <> 0   ";
        fQuery = fQuery + " ORDER BY DEBTOR , [Type] "

    //console.log(fQuery)

    const data = {
        "template": { "_id": "hzronJngUay5Cro7" },
        "options": {
            "reports": { "save": false },

            "sql": fQuery,
            "Criteria": lblcriteria,
            "userid": this.tocken.user,


        }
    }
    this.loading = true;
    //this.drawerVisible = true;
    

    this.printS.print(data).subscribe((blob: any) => {
        this.pdfTitle = "Aged Debtors Report.pdf"
        this.drawerVisible = true;                   
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loading = false;
        this.cd.detectChanges();
    }, err => {
            console.log(err);
        });
}
Invoiceverification(branch,program,region,startdate,enddate){

    var lblcriteria;
    var fQuery = " SELECT I.RecipientName, I.DebtorName, I.ActivityName, I.ActivityFee, I.ActivityDate, I.ActivityUnits, I.ActivityUnit, I.LineTotal, I.GST FROM (SELECT  RO.Date , RE.[Surname/Organisation] AS Surname,IsNull(RE.FirstName, '') + CASE WHEN IsNull(RE.FirstName, '') <> '' THEN ' ' + RE.[Surname/Organisation] ELSE RE.[Surname/Organisation] END AS RecipientName, (SELECT IsNull(D.FirstName, '') + CASE WHEN IsNull(D.FirstName, '') <> '' THEN ' ' + D.[Surname/Organisation] ELSE D.[Surname/Organisation] END AS DebtorName FROM Recipients D WHERE Accountno = RO.BillTo) AS DebtorName, Convert(nvarchar, convert(Date, [date]), 103) AS ActivityDate, RO.[Service Type] AS ActivityName, RO.[Unit Bill Rate] AS ActivityFee, RO.BillQty AS ActivityUnits, RO.[BillUnit] AS ActivityUnit, RO.BillQty * RO.[Unit Bill Rate] AS LineTotal, CASE WHEN IsNull(RO.TaxPercent, 0) = 0 THEN 'NOGST' ELSE 'GST' END AS GST FROM Roster RO INNER JOIN Recipients RE ON RO.[Client Code] = RE.AccountNo INNER JOIN HUmanResourceTypes PR ON RO.[Program] = PR.Name AND [GROUP] = 'PROGRAMS' WHERE [Client Code] > '!z'  AND IsNull(PR.UserYesNo1, 0) = 0 AND RO.Status IN (2, 5) "
    //" AND RO.Date BETWEEN '2021/11/01' AND '2021/11/30'  "
    //" AND RE.Branch IN ('ADELAIDE') "
    //" AND RO.Program IN ('**DEMO TEMPLATE') "
    //" AND RE.AgencyDefinedGroup IN ('BELLINGEN')  "


    var  tempsdate = format(this.startdate, 'yyyy/MM/dd')
    var  tempedate = format(this.enddate, 'yyyy/MM/dd')
    
    
                                                      
        if (startdate != null || enddate != null) {
            this.s_DateSQL = "  (RO.Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "')";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = "RE.Branch in ('" + branch.join("','") + "')";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL };
        }        
        if (program != "") {
            this.s_ProgramSQL = " (RO.Program in ('" + program.join("','") + "'))";
            if (this.s_ProgramSQL != "") { fQuery = fQuery + " AND " + this.s_ProgramSQL }
        }
		 if (region != "") {
            this.s_CategorySQL = "RE.AgencyDefinedGroup in ('" + region.join("','") + "')";
            if (this.s_CategorySQL != "") { fQuery = fQuery + " AND " + this.s_CategorySQL };
        }
    
        fQuery = fQuery + " ) I WHERE I.ActivityFee > 0 "
        fQuery = fQuery + " ORDER BY I.Surname, I.RecipientName, I.Date , I.DebtorName "

    console.log(fQuery)

    const data = {
        "template": { "_id": "kn46iSx7qr88QuLH" },
        "options": {
            "reports": { "save": false },

            "sql": fQuery,
            "Criteria": lblcriteria,
            "userid": this.tocken.user,


        }
    }
    this.loading = true;
    //this.drawerVisible = true;
    

    this.printS.print(data).subscribe((blob: any) => {
        this.pdfTitle = ".pdf"
        this.drawerVisible = true;                   
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loading = false;
        this.cd.detectChanges();
    }, err => {
            console.log(err);
        });
}

    




    //MUFEED's END
    
}//ConfigurationAdmin
 
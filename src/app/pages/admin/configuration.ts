import { Component, OnInit, OnDestroy, Input, AfterViewInit} from '@angular/core'
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, } from '@angular/forms';
import {  NzModalService } from 'ng-zorro-antd/modal';
import { ListService} from '@services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';

//Sets defaults of Criteria Model
const inputFormDefault = {
    branchesArr: [[]],
    allBranches: [true],

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

    PackagesArr: [[]],
    allPackages: [true],

    BatchNoArr: [[]],
   

    filterArr : ['Invoiced Only'],

    single_input_number: [1],
    AgingCycles: [30],
      
     
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

    branchesArr: Array<any> = [];    
    managersArr: Array<any> = [];
    recipientArr: Array<any> = [];
    serviceRegionsArr: Array<any> = [];
    programsArr: Array<any> = [];
    AccountsArr : Array<any> = [];
    PackagesArr : Array<any> = [];
    BatchNoArr : Array<any> = [];
    

    filterArr: Array<any> = [];
    

    frm_Recipients: boolean;
    frm_Managers: boolean;
    frm_Branches: boolean;
    frm_Date: boolean;
    frm_Categories: boolean;
    frm_Programs: boolean;
    frm_TypeFilter: boolean;    
    frm_Packages : boolean;
    frm_Accounts : boolean;
    frm_BatchNo: boolean;
    frm_AgeCycle : boolean;
    frm_Date_AgeCycle: boolean;
    

    selection : boolean;
    options : boolean;

    s_CoordinatorSQL: string;
    s_BranchSQL: string; 
    s_ProgramSQL: string;
    s_ManagersSQL: string;
    s_CategorySQL: string;
    s_RecipientSQL: string;
    s_DateSQL: string;
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
        )
    {
        
    }
    handleCancelTop(): void {
        this.isVisibleTop = false;          
      //  this.drawerVisible = false;
        //MUFEED's START
        this.Single_input_integer = false; //modal 
        this.isVisible = false;             //modal
        this.pdfTitle = "";                 
        this.inputForm.reset(inputFormDefault);
        //MUFEED's END
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
            // this.navigationExtras ={type:'followusp'};
            // this.router.navigate(["/admin/followup-list"],{ queryParams: {type: 'followusp'}})
        }
        if(index == 93){
            // this.router.navigate([`${'/admin/workflow'.split('?')[0]}`], { queryParams: {type: 'documents'}});
            
        }
        if(index == 94){
            // this.router.navigate([`${'/admin/workflow'.split('?')[0]}`], { queryParams: {type: 'extraInfo'}});
            
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

        this.listS.GetRecipientAll().subscribe(x => this.recipientArr = x);
        this.listS.GetRecipientActive().subscribe(x => this.AccountsArr = x);
        this.listS.Getpackages().subscribe(x => this.PackagesArr = x);
        this.listS.GetBatchNo().subscribe(x => this.BatchNoArr = x);
   
   
   
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
        this.frm_Managers = false;
        this.frm_Categories= false;
        this.frm_Programs = false;
        this.selection = false;
        this.options = false;
        this.frm_Packages = false;
        this.frm_Accounts = false;
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
              
            
                break;
            case "print-staff-rosters":
            
                break;
            case "print-location-rosters":
            
                break;
            case "print-group-activity-rosters":
            
                break;
            case "print-transport-run-sheets":
            
                break;
            case "print-meal-run-sheets":
            
                break;
            case "print-staff-rosters":
            
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
                this.frm_Managers = true;

                this.isVisibleTop = true;
                break;
        
            default:
                break;
        }
       
       
    }
    reportRender(idbtn) {
        console.log(idbtn)
        var strdate, endate;

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
        /*    case "medicine-claim-report":
              
            
                break;
            case "print-staff-rosters":
            
                break;
            case "print-location-rosters":
            
                break;
            case "print-group-activity-rosters":
            
                break;
            case "print-transport-run-sheets":
            
                break;
            case "print-meal-run-sheets":
            
                break;
            case "print-staff-rosters":
            
                break; */
            case "print-invoices":
                                         
            break;
            case "print-invoices-batch":
               
                break;
            case "print-account-statement":
                
                
                
                break;
            case "print-reprint-recipts":
            
                break;
            case "print-receipts-batch":
               
                break;
            case "print-deposit-slip":
                

                break;
            case "print-aged-debtors":
                
                break;
            case "invoice-verification":
                
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


        console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,


            }
        }
        this.loading = true;

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
                this.pdfTitle = "NDIA Package Statement.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;

            }, err => {
                console.log(err);
            });
    }
    NDIAUnClaimedItems(startdate, enddate,branch,manager,recipient) {


        var fQuery = "SELECT * FROM (SELECT ro.Recordno as [Shift#],ro.Date, ro.[Client Code] AS Client, ro.[Carer Code] AS Staff, ro.[Program], r.BRANCH, r.RECIPIENT_CoOrdinator, ro.[Service type] AS [Item/Activity], ISNULL([Unit Bill Rate], 0) * ro.BillQty AS ClaimAmount, ro.Duration / 12 AS ClaimHours, CASE WHEN ro.Status = 1 AND ro.[Type] = 1 THEN '1 - UNASSIGNED BOOKINGS'      WHEN ro.Status = 1 AND ro.[Type] <> 1 THEN '2 - UNAPPROVED SERVICES'      WHEN ro.Status IN (2, 5) AND ISNULL(ro.NDIABatch, 0) = 0 THEN '3 - APPROVED NOT CLAIMED OR BILLED'      WHEN ro.Status IN (2, 5) AND ISNULL(ro.NDIABatch, 0) <> 0 THEN '4 - APPROVED, CLAIMED NOT BILLED' END AS [Type] FROM ROSTER ro INNER JOIN HumanResourceTypes pr ON ro.[Program] = pr.[Name] INNER JOIN ItemTypes it ON ro.[Service Type] = it.[Title] LEFT JOIN Recipients r ON r.AccountNo = ro.[Client Code] WHERE pr.[Type] = 'NDIA' AND it.it_dataset = 'NDIS' AND ro.status IN (1, 2, 5) AND NOT (ro.[Type] = 8 and ro.[Start Time] = '00:00') "
        var lblcriteria,tempsdate,tempedate;
        tempsdate = format(this.startdate, 'yyyy/MM/dd')
        tempedate = format(this.enddate, 'yyyy/MM/dd')


        if (startdate != "" || enddate != "") {
            this.s_DateSQL = " (ro.Date BETWEEN '" + tempsdate + ("'AND'") + tempedate + "') ";
            if (this.s_DateSQL != "") { fQuery = fQuery + " AND " + this.s_DateSQL };
        }
        if (branch != "") {
            this.s_BranchSQL = " ( in ('" + branch.join("','") + "'))";
            if (this.s_BranchSQL != "") { fQuery = fQuery + " AND " + this.s_BranchSQL }
        }
        if (manager != "") {
            this.s_ManagersSQL = " ( in ('" + manager.join("','") + "'))";
            if (this.s_ManagersSQL != "") { fQuery = fQuery + " AND " + this.s_ManagersSQL }
        }
        if (recipient != "") {
            this.s_RecipientSQL = " ( in ('" + recipient.join("','") + "'))";
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


        console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "ZSowzSUylA32icQq" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,


            }
        }
        this.loading = true;

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
                this.pdfTitle = "NDIA UnClaimed Items.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;

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


        console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "T11evi50v5VQP3Jw" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,


            }
        }
        this.loading = true;

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
                this.pdfTitle = "NDIA Batch Register.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;

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


        console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "ijP4s274R5TQJ9EV" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,


            }
        }
        this.loading = true;

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
                this.pdfTitle = "CDC Fee Verification.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;

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

       


        console.log(fQuery)

     //   this.drawerVisible = true;

        const data = {
            "template": { "_id": "PEsoPqmbOzdz6shH" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,


            }
        }
        this.loading = true;

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
                this.pdfTitle = "CDC Leave Verification.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;

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


        console.log(fQuery)

        this.drawerVisible = true;

        const data = {
            "template": { "_id": "U4rB7nwpLXzpYQxw" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,


            }
        }
        this.loading = true;

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
                this.pdfTitle = "CDC Claim Verification.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;

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


        console.log(fQuery)

        //this.drawerVisible = true;

        const data = {
            "template": { "_id": "FMdcJXxcL2qmptzt" },
            "options": {
                "reports": { "save": false },

                "sql": fQuery,
                "Criteria": lblcriteria,


            }
        }
        this.loading = true;

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
                this.pdfTitle = "CDC Package Statement.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;

            }, err => {
                console.log(err);
            });
    }




    //MUFEED's END
    
}
//ConfigurationAdmin 
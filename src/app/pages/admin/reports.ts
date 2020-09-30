import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl,FormArray, } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import {  ViewEncapsulation } from '@angular/core';
import { ListService, states } from '@services/index';
import * as FileSaver from 'file-saver';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO'
import { EventInputTransformer } from '@fullcalendar/angular';


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

    disiplineArr:[[]],
    allDisciplines:[true],

    recipientArr:[[]],
    allRecipients:[true],
    

    
    
    



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
    disiplineArr: Array<any> = [];
    casenotesArr: Array<any> = [];
    caredomainArr: Array<any> = [];
    planArr: Array<any> = [];
    itemArr: Array<any> = [];
    recipientArr: Array<any> = [];
    incidentArr: Array<any> = [];
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
                disiplineArr: []
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
        this.listS.getstaffdiscipline().subscribe(x => this.disiplineArr = x )
        this.listS.getstaffcaredomain().subscribe(x => this.caredomainArr = x )
        this.listS.getserviceregion().subscribe(x => this.serviceRegionsArr = x )
        this.listS.Getrptcasenotes().subscribe(x => this.casenotesArr = x )
        this.listS.Getrptiplantypes().subscribe(x => this.planArr = x )
        this.listS.GetTraccsStaffCodes().subscribe(x => this.staffArr = x )
        

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
        var s_States = this.inputForm.value.statesArr;
        var s_Branches = this.inputForm.value.branchesArr;
        var s_Managers = this.inputForm.value.managersArr;
        var s_ServiceRegions = this.inputForm.value.serviceRegionsArr;
        var s_Programs = this.inputForm.value.programsArr;
        var s_StfGroup = this.inputForm.value.staffgroupsArr; 
            if (this.startdate != null )
            {var strdate = format(this.startdate,'yyyy-MM-dd')}else{
                strdate = "2020-07-01"
            } 
            if (this.enddate != null )
            {var endate = format(this.enddate,'yyyy-MM-dd')}else{
                endate = "2020-07-31"
            }      
         
        
     //   alert(strdate)//manager,branch,stfgroup
     console.log(strdate)
        switch(idbtn){
            case 'btn-refferallist' :
                this.Refeeral_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            case 'btn-activepackagelist' :                
                this.ActivePackage_list(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States,strdate,endate);                  
                 break;
            case 'btn-recipientroster':
                this.RecipientRoster(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
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
                this.RecipientMasterRoster(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
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
            case 'btn-Activestaff':
                this.ActiveStaffListing(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-ActiveBrokerage':
                this.ActiveBrokerage_Contractor(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-Activevolunteers':
                this.ActiveVolunters(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-InactiveBrokerage':
                this.InActiveBrokerage_Contractor(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-InactiveVolunteer':
                this.InActiveVolunteers(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-Inactivestaff':
                this.InActiveStaffListing(s_Managers,s_Branches,s_StfGroup);
                break;
            case 'btn-Userpermissions':
                this.StaffPermissions(s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States);
                break;
            default: //
                alert("Yet to do")
            
        }
    
    } 
        //  sequence    s_Branches, s_Managers, s_ServiceRegions, s_Programs,s_States
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

    RecipientRoster(branch,manager,region,program,state){
        
        
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON [CLient Code] = [Accountno]  INNER JOIN STAFF ON STAFF.ACCOUNTNO = [CARER CODE]  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE') AND Date BETWEEN '2014/09/10' AND '2014/09/10' "
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
            this.s_ProgramSQL = " (Roster.[Program] in ('" + program.join("','")  +  "'))";
            if (this.s_ProgramSQL != ""){ fQuery = fQuery + " AND " + this.s_ProgramSQL}
        } 

        if (branch != ""){ 
            var lblcriteria = "Branches:" + branch.join(",") + "; "} 
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
                                                            
        fQuery = fQuery + "ORDER BY [Client Code], Date, [Start Time] "
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
        
        
        var fQuery = "SELECT [Recipients].[UniqueID], [Recipients].[AccountNo], [Recipients].[AgencyIDReportingCode], [Recipients].[Surname/Organisation], UPPER([Recipients].[Surname/Organisation]) + ', ' + CASE WHEN [Recipients].[FirstName] <> '' THEN [Recipients].[FirstName]  ELSE ' ' END As [RecipientName], [Recipients].[Address1], [Recipients].[Address2], [Recipients].[pSuburb] As Suburb, [Recipients].[pPostcode] As Postcode, [Recipients].[AdmissionDate] As [Activation Date], [Recipients].[DischargeDate] As [DeActivation Date], [Recipients].[ONIRating], [Roster].[Client Code], [Roster].[Service Type], [Roster].[DischargeReasonType], [Roster].[Date], [Roster].[Program]  FROM Recipients With (NoLock)  INNER JOIN Roster With (NoLock) ON Recipients.accountno = Roster.[Client Code]  INNER JOIN ItemTypes With (NoLock) ON ItemTypes.Title = Roster.[Service Type]  AND ProcessClassification <> 'INPUT'  WHERE ItemTypes.MinorGroup = 'REFERRAL-IN'  "

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
        }   //AND (Date BETWEEN '2017/07/01' AND '2018/07/31')
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
            ///<<<<<<<<<<<<<<QUERIES & RPT-ID>>>>>>>>>>>
    RecipientMasterRoster(branch,manager,region,program,state){
        
        
        var fQuery = "SELECT [Roster].[Date], [Roster].[MonthNo], [Roster].[DayNo], [Roster].[BlockNo], [Roster].[Program], [Roster].[Client Code], [Roster].[Service Type], [Roster].[Anal], [Roster].[Service Description], [Roster].[Type], [Roster].[Notes], [Roster].[ShiftName], [Roster].[ServiceSetting], [Roster].[Carer Code], [Roster].[Start Time], [Roster].[Duration], [Roster].[Duration] / 12 As [DecimalDuration],  [Roster].[CostQty], CASE WHEN [Roster].[Type] = 9 THEN 0 ELSE CostQty END AS PayQty, CASE WHEN [Roster].[Type] <> 9 THEN 0 ELSE CostQty END AS AllowanceQty, [Roster].[Unit Pay Rate], [Roster].[Unit Pay Rate] * [Roster].[CostQty] As [LineCost], [Roster].[BillQty], [Roster].[Unit Bill Rate], [Roster].[Unit Bill Rate] * [Roster].[BillQty] As [LineBill], [Roster].[Yearno]  FROM Roster  INNER JOIN Recipients ON [CLient Code] = Recipients.[Accountno]  LEFT JOIN STAFF ON [CARER CODE] = STAFF.ACCOUNTNO  WHERE ([Client Code] <> '!INTERNAL' AND [Client Code] <> '!MULTIPLE') AND Date BETWEEN '1900/01/01' AND '1900/01/28'"

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
            this.s_ProgramSQL = " (Roster.[Program] in ('" + program.join("','")  +  "'))";
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
                                                            
        fQuery = fQuery + "  ORDER BY [Client Code], Date, [Start Time]"
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



    





} //ReportsAdmin 
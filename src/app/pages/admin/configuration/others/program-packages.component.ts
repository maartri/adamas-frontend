import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService} from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-program-packages',
  templateUrl: './program-packages.component.html',
  styles: [`
  .mrg-btm{
    margin-bottom:5px;
  },
  textarea{
    resize:none;
  },
  .staff-wrapper{
    height: 10rem;
    width: 100%;
    overflow: auto;
    padding: .5rem 1rem;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
  },
  `]
})
export class ProgramPackagesComponent implements OnInit {
  
  period: Array<any>;
  tableData: Array<any>;
  targetGroups:Array<any>;
  budgetEnforcement:Array<any>;
  budgetRoasterEnforcement:Array<any>;
  packedTypeProfile:Array<any>;
  careWorkers:Array<any>;
  competencyList:Array<any>;
  careWorkersExcluded:Array<any>
  checkedList:string[];
  checkedListExcluded:string[];
  checkedListApproved:string[];
  checkedPackageProfile:string[];
  branches:Array<any>;
  paytypes:Array<any>;
  alerts:Array<any>;
  subgroups:Array<any>;
  caredomain:Array<any>;
  contingency:Array<any>;
  fundingRegion:Array<any>;
  levels:Array<any>;
  programz:Array<any>;
  budgetGroup:Array<any>;
  diciplines:Array<any>;
  groupAgency:Array<any>;
  states:Array<any>;
  staffTeams:Array<any>;
  staffCategory:Array<any>;
  staff:Array<any>;
  recepients:Array<any>;
  activities:Array<any>;
  types:Array<any>;
  fundingTypes:Array<any>;
  fundingSources:Array<any>;
  programCordinates:Array<any>;
  individual:boolean= false;
  aged:boolean= false;
  template:boolean=false;
  vehicledef:boolean=false;
  packageLevel:boolean=false;
  ServiceData:Array<any>;
  items:Array<any>;
  jurisdiction:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  servicesModal:boolean = false;
  staffApproved: boolean = false;
  staffUnApproved: boolean = false;
  competencymodal: boolean = false;
  packageLeaveModal:boolean = false;
  
  current: number = 0;
  checked:boolean=false;
  checkedflag:boolean = true;
  dateFormat: string = 'dd/MM/yyyy';
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any; 
  postLoading: boolean = false;
  isUpdate: boolean = false;
  
  title:string = "Add New Program/Packages";
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    private menuS: MenuService,
    private switchS: SwitchService,
    ){}
    
    ngOnInit(): void {
      this.checkedList = new Array<string>();
      this.checkedListExcluded =new Array<string>();
      this.checkedListApproved =new Array<string>();
      this.checkedPackageProfile =new Array<string>();
      this.loadData();
      this.populateDropdowns();
      this.buildForm();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    //open modals
    showAddModal() {
      this.title = "Add New Program/Packages"
      this.resetModal();
      this.modalOpen = true;
    }
    showServicesModal(){
      this.servicesModal  =true;
    }
    showPackageLeaveModal(){
      this.packageLevel = true;
    }
    handleServicesCancel() {
      this.servicesModal = false;
    }
    handlePackageLevelCancel() {
      this.packageLevel = false;
    }
    showstaffApprovedModal(){
      // this.resetModal();
      this.staffApproved = true;
    }
    handleAprfCancel(){
      this.staffApproved = false;
    }
    showstaffUnApprovedModal(){
      this.staffUnApproved = true;
    }
    handleUnAprfCancel(){
      this.staffUnApproved = false;
    }
    showCompetencyModal(){
      this.competencymodal = true;
    }
    handleCompetencyCancel(){
      this.competencymodal = false;
    }
    //End Opening of All Modals
    loadTitle()
    {
      return this.title;
    }
    onCheckboxServiceChange(option,event){
      if(event.target.checked){
        console.log(option);
        this.checkedPackageProfile.push(option.title);
      }else{
        this.checkedPackageProfile.filter(m=>m != option.title);
      }
    }
    onCheckboxChange(option, event) {
      if(event.target.checked){
        console.log(option);
        this.checkedList.push(option.name);
      } else {
        this.checkedList = this.checkedList.filter(m=>m!= option.name)
      }
    }
    onCheckboxUnapprovedChange(option, event) {
      if(event.target.checked){
        this.checkedListExcluded.push(option.accountno);
      } else {
        this.checkedListExcluded = this.checkedListExcluded.filter(m=>m!= option.accountno)
      }
    }
    onCheckboxapprovedChange(option, event)
    {
      if(event.target.checked){
        this.checkedListApproved.push(option.accountno);
      } else {
        this.checkedListApproved = this.checkedListApproved.filter(m=>m!= option.accountno)
      }
    }
    
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.title = "Edit Program/Packages"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const {
        fundingSource,
        title,
        agencyID,
        state,
        gst,
        rate,
        glExp,
        fundingRegion,
        glRev,
        glSuper,
        budget$,
        budgetHrs,
        careDomain,
        closeDate,
        bgtCycle,
        cordinators,
        fundingType,
        contiguency,
        individuallyFunded,
        level,
        budgetRosterEnforcement,
        budgetEnforcement,
        programJob,
        template,
        agedCarePackage,
        conguencyPackage,
        targetGroup,
        recordNumber,
      } = this.tableData[index];
      this.inputForm.patchValue({
        funding_source:fundingSource,
        name:title,
        agency_id:agencyID,
        state:state,
        gst:gst,
        gst_Percent:rate,
        coordinator:cordinators,
        glrev:glExp,
        glexp:glRev,
        glsuper:glSuper,
        period:bgtCycle,
        bamount:budget$,
        bhrs:budgetHrs,
        care:careDomain,
        funding_region:fundingRegion,
        funding_type:fundingType,
        close_date:closeDate,
        budget_enfor:budgetEnforcement,
        roster_enfor:budgetRosterEnforcement,
        level:level,
        target_g:targetGroup,
        template:template,
        individual:individuallyFunded,
        radioValue:programJob,
        radioValue2:contiguency,
        aged:agedCarePackage,
        contigency:conguencyPackage,
        recordNumber:recordNumber
      });
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    
    
    pre(): void {
      this.current -= 1;
    }
    
    next(): void {
      this.current += 1;
    }
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){
        let fundingSource =  group.get('funding_source').value;
        let title         =  group.get('name').value;
        let agencyID      =  group.get('agency_id').value;
        let state =group.get('state').value;
        let gst = this.trueString(group.get('gst').value);
        let rate = group.get('gst_Percent').value;
        let cordinators = group.get('coordinator').value;
        let glExp = group.get('glrev').value;
        let glRev =group.get('glexp').value;
        let glSuper = group.get('glsuper').value;
        let bgtCycle = group.get('period').value;
        let budget$ =group.get('bamount').value;
        let budgetHrs = group.get('bhrs').value;
        let careDomain = group.get('care').value;
        let fundingRegion = group.get('funding_region').value;
        let fundingType = group.get('funding_type').value;
        let closeDate = this.globalS.convertDbDate(group.get('close_date').value);
        let budgetEnforcement = group.get('budget_enfor').value;
        let budgetRosterEnforcement = group.get('roster_enfor').value;
        let level = group.get('level').value;
        let targetGroup = group.get('target_g').value;
        let template = this.trueString(group.get('template').value);
        let individuallyFunded = this.trueString(group.get('individual').value);
        let programJob = group.get('radioValue').value;
        let contiguency = group.get('radioValue2').value;
        let agedCarePackage = this.trueString(group.get('aged').value);
        let conguencyPackage = group.get('contigency').value; 
        let values = "PROGRAMS"+"','"+title+"','"+fundingSource+"','"+agencyID+"','"+cordinators+"','"+fundingRegion+"','"+careDomain+"','"+fundingType+"','"+state+"','"+gst+"','"+rate+"','"+budget$+"','"+budgetHrs+"','"+bgtCycle+"','"+glExp+"','"+glRev+"','"+glSuper+"','"+closeDate+"','"+programJob+"','"+template+"','"+contiguency+"','"+level+"','"+targetGroup+"','"+conguencyPackage+"','"+budgetEnforcement+"','"+budgetRosterEnforcement+"','"+agedCarePackage+"','"+individuallyFunded;
        let sqlz = "insert into humanresourcetypes ([Group],[Name],[type],[address1],[address2],[Suburb],[HRT_DATASET],[USER1],[Phone2],[gst],[GSTRate],[budgetamount],[budget_1],[budgetperiod],[fax],[email],[phone1],[CloseDate],[Postcode],[UserYesNo3],[User2],[User3],[User4],[User10],[BudgetEnforcement],[BudgetRosterEnforcement],[UserYesNo1],[UserYesNo2]) values('"+values+"');select @@IDENTITY";
        
        this.menuS.InsertDomain(sqlz).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data){
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.postLoading = false;   
            this.loading = false;       
            this.handleCancel();
            this.resetModal();
          }
          else{
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.loading = false;   
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          }
        });
        
        
        
      }
      else
      {
        this.postLoading = true;     
        const group = this.inputForm;
        let fundingSource =  group.get('funding_source').value;
        let title         =  group.get('name').value;
        let agencyID      =  group.get('agency_id').value;
        let state =group.get('state').value;
        let gst = this.trueString(group.get('gst').value);
        let rate = group.get('gst_Percent').value;
        let cordinators = group.get('coordinator').value;
        let glExp = group.get('glrev').value;
        let glRev =group.get('glexp').value;
        let glSuper = group.get('glsuper').value;
        let bgtCycle = group.get('period').value;
        let budget$ =group.get('bamount').value;
        let budgetHrs = group.get('bhrs').value;
        let careDomain = group.get('care').value;
        let fundingRegion = group.get('funding_region').value;
        let fundingType = group.get('funding_type').value;
        let closeDate = this.globalS.convertDbDate(group.get('close_date').value);
        let budgetEnforcement = group.get('budget_enfor').value;
        let budgetRosterEnforcement = group.get('roster_enfor').value;
        let level = group.get('level').value;
        let targetGroup = group.get('target_g').value;
        let template = this.trueString(group.get('template').value);
        let individuallyFunded = this.trueString(group.get('individual').value);
        let programJob = group.get('radioValue').value;
        let contiguency = group.get('radioValue2').value;
        let agedCarePackage = this.trueString(group.get('aged').value);
        let conguencyPackage = group.get('contigency').value; 
        
      }
    }
    trueString(data: any): string{
      return data ? '1': '0';
    }
    
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    
    loadData(){
      let sql ="SELECT [recordnumber] AS [RecordNumber], [name] AS [Title], [type] AS [Funding Source], [address1] AS [AgencyID],[address2] AS [Cordinators],[Suburb] AS [FundingRegion],[HRT_DATASET] AS [CareDomain],[USER1] as [FundingType],[Phone2] AS [State],[gst] AS [GST], [gstrate] AS [Rate], [budgetamount] AS [Budget $], [budget_1] AS [Budget Hrs], [budgetperiod] AS [Bgt Cycle], [fax] AS [GLExp], [email] AS [GLRev], [phone1] AS [GLSuper],[CloseDate] AS [CloseDate],[Postcode] AS [ProgramJob],[UserYesNo3] AS [template],[User2] AS [contiguency],[UserYesNo2] AS [IndividuallyFunded],[UserYesNo1] AS [AgedCarePackage],[User3] AS [Level],[User4] AS [TargetGroup],[User10] AS [ConguencyPackage],[BudgetEnforcement] AS [BudgetEnforcement],[BudgetRosterEnforcement] FROM humanresourcetypes WHERE ( [group] = 'PROGRAMS' ) AND ( enddate IS NULL OR enddate >= '04-05-2019' ) ORDER BY title";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
      });
    }
    populateDropdowns(): void {
      
      this.states = ['ALL','NSW','NT','QLD','SA','TAS','VIC','WA','ACT'];
      this.fundingTypes  = ['FUNDED','UNFUNDED'];
      this.period = ['ANNUAL','MONTH','QUARTER'];
      this.levels = ['Level 1','Level 2','Level 3','Level 4','STRC'];
      this.budgetEnforcement = ['HARD','SOFT'];
      this.alerts   = ['HOURS', 'DOLLARS', 'SERVICES'];
      this.budgetRoasterEnforcement = ['NONE','NOTIFY','NOTIFY AND UNALLOCATE'];
      this.listS.getcaredomain().subscribe(data => this.caredomain = data);
      this.listS.getliststaffteam().subscribe(data=>this.staffTeams= data);
      
      let funding = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'FUNDREGION' ORDER BY Description";
      this.listS.getlist(funding).subscribe(data => {
        this.fundingRegion = data;
        this.loading = false;
      });
      
      let fundings = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'FUNDINGBODIES' ORDER BY Description";
      this.listS.getlist(fundings).subscribe(data => {
        this.fundingSources = data;
        this.loading = false;
      });
      
      let progcor = "SELECT Description FROM DataDomains WHERE Domain = 'CASE MANAGERS' ORDER BY Description";
      this.listS.getlist(progcor).subscribe(data => {
        this.programCordinates = data;
      });
      
      let target = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CDCTARGETGROUPS' ORDER BY Description";
      
      this.listS.getlist(target).subscribe(data => {
        this.targetGroups = data;
      });
      
      
      let reci = "SELECT ACCOUNTNO as name FROM RECIPIENTS WHERE AdmissionDate IS NOT NULL AND DischargeDate IS NULL AND ACCOUNTNO > '!Z'";
      this.listS.getlist(reci).subscribe(data => {
        this.recepients = data;
      });
      
      
      let acti = "SELECT TITLE FROM ITEMTYPES WHERE ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM') AND ENDDATE IS NULL";
      this.listS.getlist(acti).subscribe(data => {
        this.activities = data;
      });
      let ptype ="SELECT [recnum] AS [RecordNumber], [title] AS [Code] FROM itemtypes WHERE processclassification = 'INPUT' AND ( enddate IS NULL OR enddate >= '04-05-2019' ) ORDER BY title";
      this.loading = true;
      this.listS.getlist(ptype).subscribe(data => {
        this.paytypes = data;
      });
      let prog = "SELECT [NAME] as name FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' AND ENDDATE IS NULL";
      this.listS.getlist(prog).subscribe(data => {
        this.programz = data;
      });
      
      let sc = "select distinct Name from HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND User2 = 'Contingency'";
      this.listS.getlist(sc).subscribe(data => {
        this.contingency = data;
        this.loading = false;
      });
      
      let todayDate  = this.globalS.curreentDate();
      let pckg_type_profile = "SELECT DISTINCT [Title] FROM ItemTypes WHERE ProcessClassification IN ('OUTPUT', 'EVENT') AND (EndDate Is Null OR EndDate >= '"+todayDate+"') ORDER BY [Title]"
      this.listS.getlist(pckg_type_profile).subscribe(data => {
        this.packedTypeProfile = data;
        this.loading = false;
      });
      let careWorker = "SELECT DISTINCT [Accountno] FROM Staff WHERE CommencementDate is not null and terminationdate is null ORDER BY [AccountNo]";
      this.listS.getlist(careWorker).subscribe(data => {
        this.careWorkers = data;
        this.careWorkersExcluded = data;
        this.loading = false;
      });

      let comp = "SELECT Description as name FROM Datadomains WHERE Domain = 'STAFFATTRIBUTE' ORDER BY Description";
      this.listS.getlist(comp).subscribe(data => {
        this.competencyList = data;
        this.loading = false;
      });
    }
    log(value: string[]): void {
      // console.log(value);
    }
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        
        funding_source:'',
        name:'',
        agency_id:'',
        state:'',
        coordinator:'',
        glrev:'',
        glexp:'',
        glsuper:'',
        period:'',
        bamount:'',
        bhrs:'',
        care:'',
        gst:false,
        gst_Percent:'',
        funding_region:'',
        funding_type:'',
        close_date:'',
        radioValue:'program',
        radioValue2:'non_specific',
        template:false,
        continguency:'',
        mods:'',
        day_center:'',
        act_center:'', 
        individual:false,
        aged:'',
        level:'',
        target_g:'',
        contigency:'',
        budget_enfor:'',
        roster_enfor:'',
        line_1:'',
        line_2:'',
        nprogram:'',
        nactivity:'',
        npay:'',
        cprogram:'',
        cactivity:'',
        cpay:'',
        no_notice:'',
        recurant:'',
        packg_balance:'',
        type: '',
        vehicledef:'',
        outletid:'',
        cstdaoutlet:'',
        dsci:'',
        branch:'',
        places:'',
        standard_quote:'',
        cat:'',
        category:'',
        unaprstaff:'',
        aprstaff:'',
        competences:'',
        agencysector:'',
        servicetype:'',
        fundingjunc:'',
        fundingtype:'',
        sheetalert:'',
        description: '',
        asset_no:'',
        serial_no:'',
        purchase_am:'',
        purchase_date:'',
        last_service:'',
        lockloct:'',
        lockcode:'',
        disposal:'',
        notes:'',
        glRevene:'',
        glCost:'',
        centerName:'',
        addrLine1:'',
        addrLine2:'',
        Phone:'',
        recordNumber:null
      });
    }
    
  }
  
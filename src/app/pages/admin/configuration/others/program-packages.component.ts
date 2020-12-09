import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService} from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';

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
  branches:Array<any>;
  paytypes:Array<any>;
  alerts:Array<any>;
  subgroups:Array<any>;
  caredomain:Array<any>;
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
  template:boolean= false;
  individual:boolean= false;
  aged:boolean= false;
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
    private switchS:SwitchService,
    ){}
    
    ngOnInit(): void {
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
        name,
        branch,
        agroup,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        item: branch,
        rate:name,
        agroup:agroup,
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
        console.log("Create");
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
        console.log("Update");
      }
    }
    loadData(){
      let sql ="SELECT [recordnumber] AS [RecordNumber], [name] AS [Title], [type] AS [Funding Source], [address1] AS [AgencyID], [gst] AS [GST], [gstrate] AS [Rate], [budgetamount] AS [Budget $], [budget_1] AS [Budget Hrs], [budgetperiod] AS [Bgt Cycle], [fax] AS [GLExp], [email] AS [GLRev], [phone1] AS [GLSuper] FROM humanresourcetypes WHERE ( [group] = 'PROGRAMS' ) AND ( enddate IS NULL OR enddate >= '04-05-2019' ) ORDER BY title";
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
      
      let progcor = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CASE MANAGERS'";
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

      // let sc = "Select RecordNumber, Description From DataDomains Where Domain = 'STAFFGROUP'  ORDER BY DESCRIPTION";
      // this.listS.getlist(sc).subscribe(data => {
      //   this.staffCategory = data;
      //   this.loading = false;
      // });

      // let bgroup = "Select RecordNumber, Description From DataDomains Where Domain = 'BUDGETGROUP'  ORDER BY DESCRIPTION";
      // this.listS.getlist(bgroup).subscribe(data => {
      //   this.budgetGroup = data;
      // });
      // let dicip = "Select RecordNumber, Description From DataDomains Where Domain = 'DISCIPLINE'  ORDER BY DESCRIPTION";
      // this.listS.getlist(dicip).subscribe(data => {
      //   this.diciplines = data;
      // });
      // let gagency = "Select RecordNumber, Description From DataDomains Where Domain = 'GROUPAGENCY'  ORDER BY DESCRIPTION";
      // this.listS.getlist(gagency).subscribe(data => {
      //   this.groupAgency = data;
      // });
      
      // let staf = "SELECT ACCOUNTNO as name FROM STAFF WHERE CommencementDate IS NOT NULL AND TerminationDate IS NULL AND ACCOUNTNO > '!Z'";
      // this.listS.getlist(staf).subscribe(data => {
      //   this.staff = data;
      // });
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
        funding_region:'',
        funding_type:'',
        close_date:'',
        radioValue:'program',
        radioValue2:'non_specific',
        template:'',
        continguency:'',
        mods:'',
        day_center:'',
        act_center:'', 
        individual:'',
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
        startHour:'',
        finishHour:'',
        earlyStart:'',
        lateStart:'',
        earlyFinish:'',
        lateFinish:'',
        overstay:'',
        understay:'',
        t2earlyStart:'',
        t2lateStart:'',
        t2earlyFinish:'',
        t2lateFinish:'',
        t2overstay:'',
        t2understay:'',
        recordNumber:null
      });
    }
    
  }
  
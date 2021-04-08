import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService} from '@services/index';
import { SwitchService } from '@services/switch.service';
import { isEmpty } from 'lodash';
import { NzModalService } from 'ng-zorro-antd';
import { empty, Subject } from 'rxjs';
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
  ant-modal{
    top:50px
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
  packedTypeProfileCopy:Array<any>;
  careWorkers:Array<any>;
  expireUsing:Array<any>;
  dailyArry:Array<any>;
  activityTimeSheet:Array<any>;
  cycles:Array<any>;
  activityTypes:Array<any>;
  unitsArray:Array<any>;
  quoutetemplates:Array<any>;
  competencyList:Array<any>;
  careWorkersExcluded:Array<any>
  checkedList:string[];
  checkedListExcluded:string[];
  checkedListApproved:string[];
  checkedPackageProfile:string[];
  branches:Array<any>;
  paytypes:Array<any>;
  alerts:Array<any>;
  DefPeriod:Array<any>;
  adminTypesArray:Array<any>;
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
  recepitnt_copy:Array<any>;
  activities:Array<any>;
  types:Array<any>;
  fundingTypes:Array<any>;
  fundingSources:Array<any>;
  programCordinates:Array<any>;
  individual:boolean= false;
  aged:boolean= false;
  template:boolean=false;
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
  check : boolean = false;
  current: number = 0;
  checked:boolean=false;
  checkedflag:boolean = true;
  dateFormat: string = 'dd/MM/yyyy';
  inputvalueSearch:string;
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any; 
  postLoading: boolean = false;
  isUpdate: boolean = false;
  radioSelcted = 'program'
  title:string = "Add New Program/Packages";
  whereString:string = "WHERE ( [group] = 'PROGRAMS' ) AND ( enddate IS NULL OR enddate >= getDate() )";
  private unsubscribe: Subject<void> = new Subject();
  userRole:string="userrole";
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService, 
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService,
    ){}
    
    
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
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
    searchPackageLeaves(event){
      if(event.target.value != ""){
        this.recepients = this.recepients.filter(res=>{
          return res.name.toLowerCase().match(event.target.value.toLowerCase());
        })
      }else if(event.target.value == ""){
        this.recepients = this.recepitnt_copy;
      }
    }
    searchApprovedServices(event){
      if(this.inputvalueSearch != ""){
        this.packedTypeProfile = this.packedTypeProfile.filter(res=>{
          return res.title.toLowerCase().match(this.inputvalueSearch.toLowerCase());
        })
      }else if(this.inputvalueSearch == ""){
        this.packedTypeProfile = this.packedTypeProfileCopy;
      }
    }
    onCheckboxChange(option, event) {
      if(event.target.checked){
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
    
    
    changePageNumber(page){
      console.log(page);  
    }
    
    showEditModal(index: any) {
      this.title = "Edit Program/Packages"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      
      
      
      
      const {
        fundingSource,
        type,
        title,
        agencyID,
        state,
        gst,
        rate,
        glExp,
        fundingRegion,
        gLRev,
        gLSuper,
        budgetdollar,
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
        user11,
        user12,
        user13,
        cdcStatementText1,
        defaultCHGTRAVELBetweenProgram,
        defaultCHGTRAVELWithInProgram,
        defaultCHGTravelBetweenActivity,
        defaultCHGTravelBetweenPayType,
        defaultCHGTravelWithinActivity,
        defaultCHGTravelWithinPayType,
        defaultNCTravelBetweenActivity,
        defaultNCTravelBetweenPayType,
        defaultNCTravelBetweenProgram,
        defaultNCTravelWithinActivity,
        defaultNCTravelWithinPayType,
        defaultNCTravelWithinProgram,
        p_Def_Admin_AdminDay,
        p_Def_Admin_AdminFrequency,
        p_Def_Admin_AdminType,
        p_Def_Admin_CMDay,
        p_Def_Admin_CMFrequency,
        p_Def_Admin_CMType,
        p_Def_Admin_CM_PercAmt,
        p_Def_Admin_Admin_PercAmt,
        p_Def_Alert_Allowed,
        p_Def_Alert_BaseOn,
        p_Def_Alert_Orange,
        p_Def_Alert_Period,
        p_Def_Alert_Red,
        p_Def_Alert_Type,
        p_Def_Alert_Yellow,
        p_Def_Contingency_Max,
        p_Def_Contingency_PercAmt,
        p_Def_Expire_Amount,
        p_Def_Expire_CostType,
        p_Def_Expire_Length,
        p_Def_Expire_Period,
        p_Def_Expire_Unit,
        p_Def_Expire_Using,
        defaultDailyFee,
        p_Def_Fee_BasicCare,
        p_Def_IncludeBasicCareFeeInAdmin,
        p_Def_IncludeClientFeesInCont,
        p_Def_IncludeIncomeTestedFeeInAdmin,
        p_Def_IncludeTopUpFeeInAdmin,
        p_Def_QueryAutoDeleteAdmin,
        p_Def_StdDisclaimer,
        defaultNoNoticeBillProgram,
        defaultNoNoticeCancel,
        defaultNoNoticePayProgram,
        defaultNoNoticePayType,
        defaultShortNoticeBillProgram,
        defaultShortNoticeCancel,
        defaultShortNoticePayProgram,
        defaultShortNoticePayType,
        defaultWithNoticeCancel,
        defaultWithNoticeProgram,
        noNoticeCancelRate,
        noNoticeLeadTime,
        noNoticeLeaveActivity,
        shortNoticeCancelRate,
        shortNoticeLeadTime,
        shortNoticeLeaveActivity,
        recordNumber,
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        funding_source:type,
        name:title,
        agency_id:agencyID,
        state:state,
        gst:(gst) ? true : false,
        gst_Percent:rate,
        coordinator:cordinators,
        glrev:gLRev,
        glexp:glExp,
        glsuper:gLSuper,
        period:bgtCycle,
        bamount:budgetdollar,
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
        p_alert_type:p_Def_Alert_Type,
        p_alert_period:p_Def_Alert_Period,
        allowed:p_Def_Alert_Allowed,
        yellow:p_Def_Alert_Yellow,
        green:p_Def_Alert_Orange,
        red:p_Def_Alert_Red,
        expire_amount:p_Def_Expire_Amount,
        expire_costType:p_Def_Expire_CostType,
        expire_unit:p_Def_Expire_Unit,
        expire_period:p_Def_Expire_Period,
        expire_length:p_Def_Expire_Length,        
        expire_using:p_Def_Expire_Using,
        adminType:p_Def_Admin_AdminType,
        admincmType:p_Def_Admin_CMType,
        admin_parc_amt:p_Def_Admin_Admin_PercAmt,
        admin_cm_parc_amt:p_Def_Admin_CM_PercAmt,
        adminFrequency:p_Def_Admin_AdminFrequency,
        cmFrequency:p_Def_Admin_CMFrequency,
        cycle:user12,
        standard_quote:p_Def_StdDisclaimer,
        default_daily_fees:defaultDailyFee,
        max_contiguency:p_Def_Contingency_Max,
        perc_amt:p_Def_Contingency_PercAmt,
        defaultbasiccarefee:p_Def_Fee_BasicCare,
        IncludeTopUp:p_Def_IncludeTopUpFeeInAdmin,
        IncludeCare:p_Def_IncludeBasicCareFeeInAdmin,
        includetested:p_Def_IncludeIncomeTestedFeeInAdmin,
        includeClientFeesCont:p_Def_IncludeClientFeesInCont,
        adminDay:p_Def_Admin_AdminDay,
        cmday:p_Def_Admin_CMDay,
        quoute_template:user13,
        line_1:this.SplitData(cdcStatementText1,0),
        line_2:this.SplitData(cdcStatementText1,1),
        nprogram:defaultNCTravelBetweenProgram,
        nactivity:defaultNCTravelBetweenActivity,
        npay:defaultNCTravelBetweenPayType,
        cprogram:defaultCHGTRAVELBetweenProgram,
        cactivity:defaultCHGTravelBetweenActivity,
        cpay:defaultCHGTravelBetweenPayType,
        wnprogram:defaultNCTravelWithinProgram,
        wnactivity:defaultNCTravelWithinActivity,
        wnpay:defaultNCTravelWithinPayType,
        wcprogram:defaultCHGTRAVELWithInProgram,
        wcactivity:defaultCHGTravelWithinActivity,
        wcpay:defaultCHGTravelWithinPayType,
        defaultNoNoticeBillProgram:defaultNoNoticeBillProgram,
        defaultNoNoticeCancel:defaultNoNoticeCancel,
        defaultNoNoticePayProgram:defaultNoNoticePayProgram,
        defaultNoNoticePayType:defaultNoNoticePayType,
        defaultShortNoticeBillProgram:defaultShortNoticeBillProgram,
        defaultShortNoticeCancel:defaultShortNoticeCancel,
        defaultShortNoticePayProgram:defaultShortNoticePayProgram,
        defaultShortNoticePayType:defaultShortNoticePayType,
        defaultWithNoticeCancel:defaultWithNoticeCancel,
        defaultWithNoticeProgram:defaultWithNoticeProgram,
        noNoticeCancelRate:noNoticeCancelRate,
        noNoticeLeadTime:noNoticeLeadTime,
        noNoticeLeaveActivity:noNoticeLeaveActivity,
        shortNoticeCancelRate:shortNoticeCancelRate,
        shortNoticeLeadTime:shortNoticeLeadTime,
        shortNoticeLeaveActivity:shortNoticeLeaveActivity,
        recordNumber:recordNumber
      });
    }
    
    SplitData(cdcStatementText1,position){
      if(cdcStatementText1 != '' && cdcStatementText1 != null){
        let index  = 0 ;
      if(position == 1){
        index = 1;
      }
      var result = cdcStatementText1.split("||");
      return result[index];
      }else{
        return '';
      }
    }
    handleCancel() {
      this.modalOpen = false;
    }
    onIndexChange(index: number): void {
      this.current = index;
    }
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){
        
        let fundingSource =  this.globalS.isValueNull(group.get('funding_source').value);
        let title         =  this.globalS.isValueNull(group.get('name').value);
        let agencyID      =  this.globalS.isValueNull(group.get('agency_id').value);
        let state         =  this.globalS.isValueNull(group.get('state').value);
        let gst           =  this.trueString(group.get('gst').value);
        let rate          =  this.globalS.isValueNull(group.get('gst_Percent').value);
        let cordinators   =  this.globalS.isValueNull(group.get('coordinator').value);
        let glExp         =  this.globalS.isValueNull(group.get('glrev').value);
        let glRev         =  this.globalS.isValueNull(group.get('glexp').value);
        let glSuper       =  this.globalS.isValueNull(group.get('glsuper').value);
        let bgtCycle      =  this.globalS.isValueNull(group.get('period').value);
        let budget$       =  this.globalS.isValueNull(group.get('bamount').value);
        let budgetHrs     =  this.globalS.isValueNull(group.get('bhrs').value);
        let careDomain    =  this.globalS.isValueNull(group.get('care').value);
        let fundingRegion =  this.globalS.isValueNull(group.get('funding_region').value);
        let fundingType   =  this.globalS.isValueNull(group.get('funding_type').value);
        let end_date      =  !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let closeDate     =  !(this.globalS.isVarNull(group.get('close_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('close_date').value)+"'" : null;
        let budgetEnforcement       = this.globalS.isValueNull(group.get('budget_enfor').value);
        let budgetRosterEnforcement = this.globalS.isValueNull(group.get('roster_enfor').value);
        let level                   = this.globalS.isValueNull(group.get('level').value);
        let targetGroup             = this.globalS.isValueNull(group.get('target_g').value);
        let template                = this.trueString(group.get('template').value);
        let individuallyFunded      = this.trueString(group.get('individual').value);
        let programJob              = this.globalS.isValueNull(group.get('radioValue').value);
        let contiguency             = this.globalS.isValueNull(group.get('radioValue2').value);
        let agedCarePackage         = this.trueString(group.get('aged').value);
        let conguencyPackage        = this.globalS.isValueNull(group.get('contigency').value); 
        let user8                   = "'RECURRENT FUNDING'";
        let user9                   = "'AT FUNDING EXPIRY'";
        let User11                  = "''";
        let User12                  = this.globalS.isValueNull(group.get('cycle').value);
        let P_Def_Alert_Type    = this.globalS.isValueNull(group.get('p_alert_type').value);
        let P_Def_Alert_Period  = this.globalS.isValueNull(group.get('p_alert_period').value);
        let allowed             = this.globalS.isValueNull(group.get('allowed').value);
        let yellow              = this.globalS.isValueNull(group.get('yellow').value);
        let green               = this.globalS.isValueNull(group.get('green').value);
        let red                 = this.globalS.isValueNull(group.get('red').value);
        let expire_amount       = this.globalS.isValueNull(group.get('expire_amount').value);
        let expire_costType     = this.globalS.isValueNull(group.get('expire_costType').value);
        let expire_unit         = this.globalS.isValueNull(group.get('expire_unit').value);
        let expire_period       = this.globalS.isValueNull(group.get('expire_period').value);
        let expire_length       = this.globalS.isValueNull(group.get('expire_length').value);
        let defaultbasiccarefee = this.globalS.isValueNull(group.get('defaultbasiccarefee').value);
        let expire_using        = this.globalS.isValueNull(group.get('expire_using').value);
        let adminType           = this.globalS.isValueNull(group.get('adminType').value);
        let admin_parc_amt      = this.globalS.isValueNull(group.get('admin_parc_amt').value); 
        let admin_cm_parc_amt   = this.globalS.isValueNull(group.get('admin_cm_parc_amt').value); 
        let adminFrequency      = this.globalS.isValueNull(group.get('adminFrequency').value);
        let cmFrequency         = this.globalS.isValueNull(group.get('cmFrequency').value);
        let admincmType         = this.globalS.isValueNull(group.get('admincmType').value);
        let standard_quote      = this.globalS.isValueNull(group.get('standard_quote').value);
        let defaultdailyfee     = this.globalS.isValueNull(group.get('defaultdailyfee').value);
        let max_contiguency     = this.globalS.isValueNull(group.get('max_contiguency').value);
        let perc_amt            = this.globalS.isValueNull(group.get('perc_amt').value);
        let adminDay            = this.globalS.isValueNull(group.get('adminDay').value);
        let cmday               = this.globalS.isValueNull(group.get('cmday').value);
        let default_daily_fees  = this.globalS.isValueNull(group.get('default_daily_fees').value);
        let IncludeTopUp        = this.trueString(group.get('IncludeTopUp').value);
        let IncludeCare         = this.trueString(group.get('IncludeCare').value);
        let includetested       = this.trueString(group.get('includetested').value);
        let includeClientFeesCont = this.trueString(group.get('includeClientFeesCont').value);
        let quoute_template = this.globalS.isValueNull(group.get('quoute_template').value); 
        let line1           = this.globalS.isValueNull(group.get('line1').value);
        line1 = isEmpty(line1) ? "Unused funds are returned to the Department on package cessation" : line1;        
        let line2           = this.globalS.isValueNull(group.get('line2').value);
        line2 = isEmpty(line2) ? "For Queries and Inquiries Please Phone" : line2;  
        let text1           =  line1+"||"+line2;
        let nprogram        =  this.globalS.isValueNull(group.get('nprogram').value); 
        let nactivity       =  this.globalS.isValueNull(group.get('nactivity').value); 
        let npay            =  this.globalS.isValueNull(group.get('npay').value); 
        let cprogram        =  this.globalS.isValueNull(group.get('cprogram').value); 
        let cactivity       =  this.globalS.isValueNull(group.get('cactivity').value); 
        let cpay            =  this.globalS.isValueNull(group.get('cpay').value); 
        let wnprogram       =  this.globalS.isValueNull(group.get('wnprogram').value); 
        let wnactivity      =  this.globalS.isValueNull(group.get('wnactivity').value); 
        let wnpay           =  this.globalS.isValueNull(group.get('wnpay').value); 
        let wcprogram       =  this.globalS.isValueNull(group.get('wnprogram').value); 
        let wcactivity      =  this.globalS.isValueNull(group.get('wcactivity').value); 
        let wcpay           =  this.globalS.isValueNull(group.get('wcpay').value); 
        let  defaultNoNoticeBillProgram    =   this.globalS.isValueNull(group.get('defaultNoNoticeBillProgram').value);
        let  defaultNoNoticeCancel         =   this.globalS.isValueNull(group.get('defaultNoNoticeCancel').value);
        let  defaultNoNoticePayProgram     =   this.globalS.isValueNull(group.get('defaultNoNoticePayProgram').value);
        let  defaultWithNoticeCancel       =   this.globalS.isValueNull(group.get('defaultWithNoticeCancel').value);
        let  defaultWithNoticeProgram      =   this.globalS.isValueNull(group.get('defaultWithNoticeProgram').value);
        let  noNoticeCancelRate            =   this.globalS.isValueNull(group.get('noNoticeCancelRate').value);
        let  noNoticeLeadTime              =   this.globalS.isValueNull(group.get('noNoticeLeadTime').value);
        let  noNoticeLeaveActivity         =   this.globalS.isValueNull(group.get('noNoticeLeaveActivity').value);
        let  shortNoticeCancelRate         =   this.globalS.isValueNull(group.get('shortNoticeCancelRate').value);
        let  shortNoticeLeadTime           =   this.globalS.isValueNull(group.get('shortNoticeLeadTime').value);
        let  shortNoticeLeaveActivity      =   this.globalS.isValueNull(group.get('shortNoticeLeaveActivity').value);
        let  defaultShortNoticePayType     =   this.globalS.isValueNull(group.get('defaultShortNoticePayType').value);
        let  defaultShortNoticePayProgram  =   this.globalS.isValueNull(group.get('defaultShortNoticePayProgram').value);
        let  defaultShortNoticeBillProgram =   this.globalS.isValueNull(group.get('defaultShortNoticeBillProgram').value);
        let  defaultShortNoticeCancel      =   this.globalS.isValueNull(group.get('defaultShortNoticeCancel').value);
        let  defaultNoNoticePayType        =   this.globalS.isValueNull(group.get('defaultNoNoticePayType').value);
        
        let values = "'PROGRAMS'"+","+title+","+fundingSource+","+agencyID+","+cordinators+","+fundingRegion
        +","+careDomain+","+fundingType+","+state+","+gst
        +","+rate+","+budget$+","+budgetHrs+","+bgtCycle
        +","+glExp+","+glRev+","+glSuper+","+closeDate
        +","+programJob+","+template+","+contiguency+","+level
        +","+targetGroup+","+conguencyPackage+","+budgetEnforcement
        +","+budgetRosterEnforcement+","+agedCarePackage
        +","+individuallyFunded
        +","+user8+","+user9+","+User11+","+User12+","+P_Def_Alert_Type+","+P_Def_Alert_Period
        +","+allowed+","+yellow+","+green+","+red
        +","+expire_amount+","+expire_costType+","+expire_unit+","+expire_period+","+expire_length
        +","+defaultbasiccarefee+","+perc_amt+","+adminType
        +","+admincmType+","+admin_cm_parc_amt+","+admin_parc_amt+","+standard_quote
        +","+adminFrequency+","+cmFrequency+","+adminDay+","+cmday+","+expire_using+","+max_contiguency
        +","+wcactivity+","+wcpay+","+wnprogram+","+wnactivity+","+wnpay
        +","+cactivity+","+cpay+","+nprogram
        +","+nactivity+","+npay+","+cprogram+","+wcprogram
        +","+includeClientFeesCont+","+includetested+","+IncludeCare+","+IncludeTopUp
        +",'"+text1+"',"+default_daily_fees+","+noNoticeLeadTime+","+shortNoticeLeadTime+","+noNoticeLeaveActivity
        +","+shortNoticeLeaveActivity+","+defaultNoNoticeCancel+","+defaultNoNoticeBillProgram+","+defaultNoNoticePayProgram+","+defaultNoNoticePayType
        +","+defaultShortNoticeCancel+","+defaultShortNoticeBillProgram+","+defaultShortNoticePayProgram+","+defaultShortNoticePayType
        +","+defaultWithNoticeCancel+","+noNoticeCancelRate+","+shortNoticeCancelRate+","+defaultWithNoticeProgram;
        
        let sqlz = "insert into humanresourcetypes ([Group],[Name],[type],[address1],[address2],[Suburb],[HRT_DATASET],[USER1],[Phone2],[gst],[GSTRate],[budgetamount],[budget_1],[budgetperiod],[fax],[email],[phone1],[CloseDate],[Postcode],[UserYesNo3],[User2],[User3],[User4],[User10],[BudgetEnforcement],[BudgetRosterEnforcement],[UserYesNo1],[UserYesNo2],[User8],[User9],[User11],[User12],[P_Def_Alert_Type],[P_Def_Alert_Period],[P_Def_Alert_Allowed],[P_Def_Alert_Yellow],[P_Def_Alert_Orange],[P_Def_Alert_Red],[P_Def_Expire_Amount],[P_Def_Expire_CostType],[P_Def_Expire_Unit],[P_Def_Expire_Period],[P_Def_Expire_Length],[P_Def_Fee_BasicCare],[P_Def_Contingency_PercAmt],[P_Def_Admin_AdminType],[P_Def_Admin_CMType],[P_Def_Admin_CM_PercAmt],[p_Def_Admin_Admin_PercAmt],[P_Def_StdDisclaimer],[P_Def_Admin_AdminFrequency],[P_Def_Admin_CMFrequency],[P_Def_Admin_AdminDay] ,[P_Def_Admin_CMDay],[P_Def_Expire_Using],[P_Def_Contingency_Max],[DefaultCHGTravelWithinActivity],[DefaultCHGTravelWithinPayType],[DefaultNCTravelWithinProgram],[DefaultNCTravelWithinActivity],[DefaultNCTravelWithinPayType],[DefaultCHGTravelBetweenActivity],[DefaultCHGTravelBetweenPayType],[DefaultNCTravelBetweenProgram],[DefaultNCTravelBetweenActivity],[DefaultNCTravelBetweenPayType],[DefaultCHGTRAVELBetweenProgram],[DefaultCHGTRAVELWithInProgram],[P_Def_IncludeClientFeesInCont],[P_Def_IncludeIncomeTestedFeeInAdmin],[P_Def_IncludeBasicCareFeeInAdmin],[P_Def_IncludeTopUpFeeInAdmin],[CDCStatementText1],[DefaultDailyFee],[NoNoticeLeadTime],[ShortNoticeLeadTime],[NoNoticeLeaveActivity],[ShortNoticeLeaveActivity],[DefaultNoNoticeCancel],[DefaultNoNoticeBillProgram],[DefaultNoNoticePayProgram],[DefaultNoNoticePayType],[DefaultShortNoticeCancel],[DefaultShortNoticeBillProgram],[DefaultShortNoticePayProgram],[DefaultShortNoticePayType],[DefaultWithNoticeCancel],[NoNoticeCancelRate],[ShortNoticeCancelRate],[DefaultWithNoticeProgram]) values("+values+");select @@IDENTITY";
        console.log(sqlz);
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
        let fundingSource =  this.globalS.isValueNull(group.get('funding_source').value);
        let title         =  this.globalS.isValueNull(group.get('name').value);
        let agencyID      =  this.globalS.isValueNull(group.get('agency_id').value);
        let state         =  this.globalS.isValueNull(group.get('state').value);
        let gst           =  this.trueString(group.get('gst').value);
        let rate          =  this.globalS.isValueNull(group.get('gst_Percent').value);
        let cordinators   =  this.globalS.isValueNull(group.get('coordinator').value);
        let glExp         =  this.globalS.isValueNull(group.get('glrev').value);
        let glRev         =  this.globalS.isValueNull(group.get('glexp').value);
        let glSuper       =  this.globalS.isValueNull(group.get('glsuper').value);
        let bgtCycle      =  this.globalS.isValueNull(group.get('period').value);
        let budget$       =  this.globalS.isValueNull(group.get('bamount').value);
        let budgetHrs     =  this.globalS.isValueNull(group.get('bhrs').value);
        let careDomain    =  this.globalS.isValueNull(group.get('care').value);
        let fundingRegion =  this.globalS.isValueNull(group.get('funding_region').value);
        let fundingType   =  this.globalS.isValueNull(group.get('funding_type').value);
        let end_date      =  !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let closeDate     =  !(this.globalS.isVarNull(group.get('close_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('close_date').value)+"'" : null;
        let budgetEnforcement       = this.globalS.isValueNull(group.get('budget_enfor').value);
        let budgetRosterEnforcement = this.globalS.isValueNull(group.get('roster_enfor').value);
        let level                   = this.globalS.isValueNull(group.get('level').value);
        let targetGroup             = this.globalS.isValueNull(group.get('target_g').value);
        let template                = this.trueString(group.get('template').value);
        let individuallyFunded      = this.trueString(group.get('individual').value);
        let programJob              = this.globalS.isValueNull(group.get('radioValue').value);
        let contiguency             = this.globalS.isValueNull(group.get('radioValue2').value);
        let agedCarePackage         = this.trueString(group.get('aged').value);
        let conguencyPackage        = this.globalS.isValueNull(group.get('contigency').value); 
        let user8                   = "'RECURRENT FUNDING'";
        let user9                   = "'AT FUNDING EXPIRY'";
        let User11                  = "''";
        let User12                  = this.globalS.isValueNull(group.get('cycle').value);
        let P_Def_Alert_Type    = this.globalS.isValueNull(group.get('p_alert_type').value);
        let P_Def_Alert_Period  = this.globalS.isValueNull(group.get('p_alert_period').value);
        let allowed             = this.globalS.isValueNull(group.get('allowed').value);
        let yellow              = this.globalS.isValueNull(group.get('yellow').value);
        let green               = this.globalS.isValueNull(group.get('green').value);
        let red                 = this.globalS.isValueNull(group.get('red').value);
        let expire_amount       = this.globalS.isValueNull(group.get('expire_amount').value);
        let expire_costType     = this.globalS.isValueNull(group.get('expire_costType').value);
        let expire_unit         = this.globalS.isValueNull(group.get('expire_unit').value);
        let expire_period       = this.globalS.isValueNull(group.get('expire_period').value);
        let expire_length       = this.globalS.isValueNull(group.get('expire_length').value);
        let defaultbasiccarefee = this.globalS.isValueNull(group.get('defaultbasiccarefee').value);
        let expire_using        = this.globalS.isValueNull(group.get('expire_using').value);
        let adminType           = this.globalS.isValueNull(group.get('adminType').value);
        let admin_parc_amt      = this.globalS.isValueNull(group.get('admin_parc_amt').value); 
        let admin_cm_parc_amt   = this.globalS.isValueNull(group.get('admin_cm_parc_amt').value); 
        let adminFrequency      = this.globalS.isValueNull(group.get('adminFrequency').value);
        let cmFrequency         = this.globalS.isValueNull(group.get('cmFrequency').value);
        let admincmType         = this.globalS.isValueNull(group.get('admincmType').value);
        let standard_quote      = this.globalS.isValueNull(group.get('standard_quote').value);
        let defaultdailyfee     = this.globalS.isValueNull(group.get('defaultdailyfee').value);
        let max_contiguency     = this.globalS.isValueNull(group.get('max_contiguency').value);
        let perc_amt            = this.globalS.isValueNull(group.get('perc_amt').value);
        let adminDay            = this.globalS.isValueNull(group.get('adminDay').value);
        let cmday               = this.globalS.isValueNull(group.get('cmday').value);
        let default_daily_fees  = this.globalS.isValueNull(group.get('default_daily_fees').value);
        let IncludeTopUp        = this.trueString(group.get('IncludeTopUp').value);
        let IncludeCare         = this.trueString(group.get('IncludeCare').value);
        let includetested       = this.trueString(group.get('includetested').value);
        let includeClientFeesCont = this.trueString(group.get('includeClientFeesCont').value);
        let quoute_template = this.globalS.isValueNull(group.get('quoute_template').value); 
        
        let line1           = this.globalS.isValueNull(group.get('line1').value);
        line1 = isEmpty(line1) ? "Unused funds are returned to the Department on package cessation" : line1;        
        
        let line2           = this.globalS.isValueNull(group.get('line2').value);
        line2 = isEmpty(line2) ? "For Queries and Inquiries Please Phone" : line2;  
        
        let text1           =  line1+"||"+line2;
        
        let nprogram        =  this.globalS.isValueNull(group.get('nprogram').value); 
        let nactivity       =  this.globalS.isValueNull(group.get('nactivity').value); 
        let npay            =  this.globalS.isValueNull(group.get('npay').value); 
        let cprogram        =  this.globalS.isValueNull(group.get('cprogram').value); 
        let cactivity       =  this.globalS.isValueNull(group.get('cactivity').value); 
        let cpay            =  this.globalS.isValueNull(group.get('cpay').value); 
        let wnprogram       =  this.globalS.isValueNull(group.get('wnprogram').value); 
        let wnactivity      =  this.globalS.isValueNull(group.get('wnactivity').value); 
        let wnpay           =  this.globalS.isValueNull(group.get('wnpay').value); 
        let wcprogram       =  this.globalS.isValueNull(group.get('wnprogram').value); 
        let wcactivity      =  this.globalS.isValueNull(group.get('wcactivity').value); 
        let wcpay           =  this.globalS.isValueNull(group.get('wcpay').value); 
        let  defaultNoNoticeBillProgram    =   this.globalS.isValueNull(group.get('defaultNoNoticeBillProgram').value);
        let  defaultNoNoticeCancel         =   this.globalS.isValueNull(group.get('defaultNoNoticeCancel').value);
        let  defaultNoNoticePayProgram     =   this.globalS.isValueNull(group.get('defaultNoNoticePayProgram').value);
        let  defaultWithNoticeCancel       =   this.globalS.isValueNull(group.get('defaultWithNoticeCancel').value);
        let  defaultWithNoticeProgram      =   this.globalS.isValueNull(group.get('defaultWithNoticeProgram').value);
        let  noNoticeCancelRate            =   this.globalS.isValueNull(group.get('noNoticeCancelRate').value);
        let  noNoticeLeadTime              =   this.globalS.isValueNull(group.get('noNoticeLeadTime').value);
        let  noNoticeLeaveActivity         =   this.globalS.isValueNull(group.get('noNoticeLeaveActivity').value);
        let  shortNoticeCancelRate         =   this.globalS.isValueNull(group.get('shortNoticeCancelRate').value);
        let  shortNoticeLeadTime           =   this.globalS.isValueNull(group.get('shortNoticeLeadTime').value);
        let  shortNoticeLeaveActivity      =   this.globalS.isValueNull(group.get('shortNoticeLeaveActivity').value);
        let  defaultShortNoticePayType     =   this.globalS.isValueNull(group.get('defaultShortNoticePayType').value);
        let  defaultShortNoticePayProgram  =   this.globalS.isValueNull(group.get('defaultShortNoticePayProgram').value);
        let  defaultShortNoticeBillProgram =   this.globalS.isValueNull(group.get('defaultShortNoticeBillProgram').value);
        let  defaultShortNoticeCancel      =   this.globalS.isValueNull(group.get('defaultShortNoticeCancel').value);
        let  defaultNoNoticePayType        =   this.globalS.isValueNull(group.get('defaultNoNoticePayType').value); 
        let  recordNumber       = group.get('recordNumber').value;
        let prog = "'PROGRAMS'";
        
        let sqlUpdate = "Update humanresourcetypes SET [Group]="+ prog + ",[Name]="+ title + ",[type]="+ fundingSource + ",[address1]="+ agencyID + ",[address2]="+ cordinators + ", [Suburb]="+ fundingRegion + ",[HRT_DATASET]="+ careDomain + ",[USER1]="+ fundingType + ",[Phone2]="+ state + ",[gst]="+ gst + ",[GSTRate]="+ rate + ",[budgetamount]="+ budget$ + ",[budget_1]="+ budgetHrs + ",[budgetperiod]="+bgtCycle+",[fax]="+ glExp + ",[email]="+ glRev + ",[phone1]="+ glSuper + ",[CloseDate]="+ closeDate + ",[Postcode]="+ programJob + ",[UserYesNo3]="+ template + ",[User2]="+ contiguency + ",[User3]="+ level + ",[User4]="+ targetGroup + ",[User10]="+ conguencyPackage + ",[BudgetEnforcement]="+ budgetEnforcement + ",[BudgetRosterEnforcement]="+ budgetRosterEnforcement + ",[UserYesNo1]="+ agedCarePackage + ",[UserYesNo2]="+ individuallyFunded + ",[User8]="+ user8 + ",[User9]="+ user9 + ",[User11]="+ User11 + ",[User12]="+ User12 + ",[P_Def_Alert_Type]="+ P_Def_Alert_Type + ",[P_Def_Alert_Period]="+ P_Def_Alert_Period + ",[P_Def_Alert_Allowed]="+ allowed + ",[P_Def_Alert_Yellow]="+ yellow + ",[P_Def_Alert_Orange]="+ green + ",[P_Def_Alert_Red]="+ red + ",[P_Def_Expire_Amount]="+ expire_amount + ",[P_Def_Expire_CostType]="+ expire_costType + ",[P_Def_Expire_Unit]="+ expire_unit + ",[P_Def_Expire_Period]="+ expire_period + ",[P_Def_Expire_Length]="+ expire_length + ",[P_Def_Fee_BasicCare]="+ defaultbasiccarefee + ",[P_Def_Contingency_PercAmt]="+ perc_amt + ",[P_Def_Admin_AdminType]="+ adminType + ",[P_Def_Admin_CMType]="+ admincmType + ",[P_Def_Admin_CM_PercAmt]="+admin_cm_parc_amt+",[p_Def_Admin_Admin_PercAmt]="+admin_parc_amt+",[P_Def_StdDisclaimer]="+standard_quote+",[P_Def_Admin_AdminFrequency]="+adminFrequency+",[P_Def_Admin_CMFrequency]="+cmFrequency+",[P_Def_Admin_AdminDay]="+adminDay+",[P_Def_Admin_CMDay]="+cmday+",[P_Def_Expire_Using]="+expire_using+",[P_Def_Contingency_Max]="+max_contiguency+",[DefaultCHGTravelWithinActivity]="+wcactivity+",[DefaultCHGTravelWithinPayType]="+wcpay+",[DefaultNCTravelWithinProgram]="+wnprogram+",[DefaultNCTravelWithinActivity]="+wnactivity+",[DefaultNCTravelWithinPayType]="+wnpay+",[DefaultCHGTravelBetweenActivity]="+cactivity+",[DefaultCHGTravelBetweenPayType]="+cpay+",[DefaultNCTravelBetweenProgram]="+nprogram+",[DefaultNCTravelBetweenActivity]="+nactivity+",[DefaultNCTravelBetweenPayType]="+npay+",[DefaultCHGTRAVELBetweenProgram]="+cprogram+",[DefaultCHGTRAVELWithInProgram]="+wcprogram+",[P_Def_IncludeClientFeesInCont]="+includeClientFeesCont+",[P_Def_IncludeIncomeTestedFeeInAdmin]="+includetested+",[P_Def_IncludeBasicCareFeeInAdmin]="+IncludeCare+",[P_Def_IncludeTopUpFeeInAdmin]="+IncludeTopUp+",[CDCStatementText1]='"+text1+"',[DefaultDailyFee]="+default_daily_fees+",[NoNoticeLeadTime]="+noNoticeLeadTime+",[ShortNoticeLeadTime]="+shortNoticeLeadTime+",[NoNoticeLeaveActivity]="+noNoticeLeaveActivity+",[ShortNoticeLeaveActivity]="+shortNoticeLeaveActivity+",[DefaultNoNoticeCancel]="+defaultNoNoticeCancel+",[DefaultNoNoticeBillProgram]="+defaultNoNoticeBillProgram+",[DefaultNoNoticePayProgram]="+defaultNoNoticePayProgram+",[DefaultNoNoticePayType]="+defaultNoNoticePayType+",[DefaultShortNoticeCancel]="+defaultShortNoticeCancel+",[DefaultShortNoticeBillProgram]="+defaultShortNoticeBillProgram+",[DefaultShortNoticePayProgram]="+defaultShortNoticePayProgram+",[DefaultShortNoticePayType]="+defaultShortNoticePayType+",[DefaultWithNoticeCancel]="+defaultWithNoticeCancel+",[NoNoticeCancelRate]="+noNoticeCancelRate+",[ShortNoticeCancelRate]="+shortNoticeCancelRate+",[DefaultWithNoticeProgram]="+defaultWithNoticeProgram+" WHERE [RecordNumber] ='"+recordNumber+"'";
        console.log(sqlUpdate);
        this.menuS.InsertDomain(sqlUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
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
    }
    trueString(data: any): string{
      return data ? '1': '0';
    }
    
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    
    loadData(){
      this.loading = true;
      this.menuS.getlistProgramPackages(this.check).subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = " WHERE ( [group] = 'PROGRAMS' ) ";
        this.loadData();
      }else{
        this.whereString = " WHERE ( [group] = 'PROGRAMS' ) AND ( enddate IS NULL OR enddate >= getDate() ) ";
        this.loadData();
      }
    }
    populateDropdowns(): void {
      
      this.states = ['ALL','NSW','NT','QLD','SA','TAS','VIC','WA','ACT'];
      this.fundingTypes  = ['FUNDED','UNFUNDED'];
      this.period = ['ANNUAL','MONTH','QUARTER'];
      this.levels = ['Level 1','Level 2','Level 3','Level 4','STRC'];
      this.cycles = ['CYCLE 1','CYCLE 2','CYCLE 3','CYCLE 4','CYCLE 5','CYCLE 6','CYCLE 7','CYCLE 8','CYCLE 9','CYCLE 10'];
      this.budgetEnforcement = ['HARD','SOFT'];
      this.alerts   = ['HOURS', 'DOLLARS', 'SERVICES'];
      this.DefPeriod = ['DAY','WEEK','FORTNIGHT','4 WEEKS','MONTH','6 WEEKS','QUARTER','6 MONTHS','YEAR']
      this.expireUsing   = ['Activity AVG COST','CHARGE RATE','PAY UNIT RATE']
      this.unitsArray    = ['PER','TOTAL'];
      this.dailyArry     = ['DAILY'];
      this.quoutetemplates = ['CAREPLAN SAVED AS TEMPLATE.OD'];
      this.adminTypesArray = ['**CDC – CARE MGMT','**CDC FEE-ADMIN','~CASE MGT~','~PACKAGE ADMIN~','AGREED TOP UP FEE','BASIC CARE FEE','CDC  EXIT FEE','COORDINATION OF SUPPORTS','INCOME TESTED FEE','NDIA FAINANCIAL INTERMEDIATOR','YLYC CASE MAN. 2.066'];
      this.budgetRoasterEnforcement = ['NONE','NOTIFY','NOTIFY AND UNALLOCATE'];
      this.listS.getcaredomain().subscribe(data => this.caredomain = data);
      this.listS.getliststaffteam().subscribe(data=>this.staffTeams= data);
      let todayDate  = this.globalS.curreentDate();
      let funding = "SELECT RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain =  'FUNDREGION' ORDER BY Description";
      this.listS.getlist(funding).subscribe(data => {
        this.fundingRegion = data;
        this.loading = false;
      });
      
      let fundings = "SELECT RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain =  'FUNDINGBODIES' ORDER BY Description";
      this.listS.getlist(fundings).subscribe(data => {
        this.fundingSources = data;
        this.loading = false;
      });
      
      let progcor = "SELECT Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain = 'CASE MANAGERS' ORDER BY Description";
      this.listS.getlist(progcor).subscribe(data => {
        this.programCordinates = data;
      });
      
      let target = "SELECT RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain =  'CDCTARGETGROUPS' ORDER BY Description";
      
      this.listS.getlist(target).subscribe(data => {
        this.targetGroups = data;
      });
      
      
      let reci = "SELECT ACCOUNTNO as name FROM RECIPIENTS WHERE AdmissionDate IS NOT NULL AND DischargeDate IS NULL AND ACCOUNTNO > '!Z'";
      this.listS.getlist(reci).subscribe(data => {
        this.recepients = data;
        this.recepitnt_copy = this.recepients;
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
      let prog = "select distinct Name from HumanResourceTypes WHERE [GROUP]= 'PROGRAMS' AND ((EndDate IS NULL) OR (EndDate > GETDATE()))";
      this.listS.getlist(prog).subscribe(data => {
        this.programz = data;
      });
      
      let sc = "select distinct Name from HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND User2 = 'Contingency'";
      this.listS.getlist(sc).subscribe(data => {
        this.contingency = data;
        this.loading = false;
      });
      
      let pckg_type_profile = "SELECT DISTINCT [Title] FROM ItemTypes WHERE ProcessClassification IN ('OUTPUT', 'EVENT') AND (EndDate Is Null OR EndDate >= GETDATE()) ORDER BY [Title]"
      this.listS.getlist(pckg_type_profile).subscribe(data => {
        this.packedTypeProfile = data;
        this.packedTypeProfileCopy = data;
        this.loading = false;
      });
      let careWorker = "SELECT DISTINCT [Accountno] FROM Staff WHERE CommencementDate is not null and terminationdate is null ORDER BY [AccountNo]";
      this.listS.getlist(careWorker).subscribe(data => {
        this.careWorkers = data;
        this.careWorkersExcluded = data;
        this.loading = false;
      });
      
      let comp = "SELECT Description as name from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain = 'STAFFATTRIBUTE' ORDER BY Description";
      this.listS.getlist(comp).subscribe(data => {
        this.competencyList = data;
        this.loading = false;
      });
      
      let activity = "select distinct Title from ItemTypes WHERE ProcessClassification = 'EVENT' AND ((EndDate IS NULL) OR (EndDate > GETDATE())) AND RosterGroup = 'RECPTABSENCE'";
      this.listS.getlist(activity).subscribe(data => {
        this.activityTypes = data;
        this.loading = false;
      });
      
      let timesheet = "select distinct Title from ItemTypes WHERE ProcessClassification = 'OUTPUT' AND ((EndDate IS NULL) OR (EndDate > GETDATE())) AND RosterGroup = 'ADMINISTRATION'"
      this.listS.getlist(timesheet).subscribe(data => {
        this.activityTimeSheet = data;
        this.loading = false;
      });
    }
    log(value: string[]): void {
      // console.log(value);
    }
    delete(data: any) { 
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteProgarmPackageslist(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
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
        end_date:'',
        radioValue:'',
        radioValue2:'',
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
        p_alert_type:'', //default 1
        p_alert_period:'',
        expire_amount:'',
        expire_costType:'',
        expire_unit:'',
        expire_period:'',
        expire_length:'',
        allowed:'',
        yellow:'',
        green:'',
        line1:'',
        line2:'',
        red:'',
        expire_using:'',
        adminType:'',
        admincmType:'',
        adminPercAmt:'',
        adminFrequency:'',
        cmFrequency:'',
        adminDay:'',
        admin_cm_parc_amt:'',
        cmaddminType:'',
        admin_parc_amt:'',
        cmday:'',
        cycle:'',
        defaultdailyfee:'',
        IncludeTopUp:false,
        IncludeCare:false,
        includetested:false,
        includeClientFeesCont:false,
        defaultbasiccarefee:'',
        max_contiguency:'',
        perc_amt:'',
        default_daily_fees:'',
        quoute_template:'',
        line_1:'',
        line_2:'',
        nprogram:'',
        nactivity:'',
        npay:'',
        cprogram:'',
        cactivity:'',
        cpay:'',
        wnprogram:'',
        wnactivity:'',
        wnpay:'',
        wcprogram:'',
        wcactivity:'',
        wcpay:'',
        defaultNoNoticeBillProgram:'',
        defaultNoNoticeCancel:'',
        defaultNoNoticePayProgram:'',
        defaultNoNoticePayType:'',
        defaultShortNoticeBillProgram:'',
        defaultShortNoticeCancel:'',
        defaultShortNoticePayProgram:'',
        defaultShortNoticePayType:'',
        defaultWithNoticeCancel:'',
        defaultWithNoticeProgram:'',
        noNoticeCancelRate:0,
        noNoticeLeadTime:'',
        noNoticeLeaveActivity:'',
        shortNoticeCancelRate:'',
        shortNoticeLeadTime:'',
        shortNoticeLeaveActivity:'',
        no_notice:'',
        recurant:'',
        packg_balance:'',
        type: '',
        vehicledef:false,
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
    handleOkTop() {
      this.generatePdf();
      this.tryDoctype = ""
      this.pdfTitle = ""
    }
    handleCancelTop(): void {
      this.drawerVisible = false;
      this.pdfTitle = ""
    }
    generatePdf(){
      this.drawerVisible = true;
      
      this.loading = true;
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [name]) AS Field1,[name] AS [Field2], [type] AS [Field3], [address1] AS [Field4],[gstrate] AS [Field5], [budgetamount] AS [Field6], [budget_1] AS [Budget Hrs], [budgetperiod] AS [Field7], [fax] AS [Field8], [email] AS [Field9], [phone1] AS [Field10] FROM humanresourcetypes WHERE ( [group] = 'PROGRAMS' ) AND ( enddate IS NULL OR enddate >= '04-05-2019' )";
      
      const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
      
      const requestOptions = {
        headers: new HttpHeaders(headerDict)
      };
      
      const data = {
        "template": { "_id": "0RYYxAkMCftBE9jc" },
        "options": {
          "reports": { "save": false },
          "txtTitle": "Center/Facility/Locations List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Title",
          "head3" : "Funding Source",
          "head4" : "AgencyID",
          "head5" : "Rate",
          "head6" : "Budget$",
          "head7" : "Bgt Cycle",
          "head8" : "GL Exp A/C",
          "head9" : "GL Rev A/C",
          "head10" : "GL Super A/C",
        }
      }
      this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
      .subscribe((blob: any) => {
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loading = false;
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
      this.loading = true;
      this.tryDoctype = "";
      this.pdfTitle = "";
    }
  }
  
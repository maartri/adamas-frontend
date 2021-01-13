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
      let index  = 0 ;
      if(position == 1){
        index = 1;
      }
      var result = cdcStatementText1.split("||");
      return result[index];
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
        let closeDate = (group.get('close_date').value) ? this.globalS.convertDbDate(group.get('close_date').value) : '';
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
        let user8 = "RECURRENT FUNDING";
        let user9 = "AT FUNDING EXPIRY";
        let User11              = '';
        let User12              = group.get('cycle').value;
        let P_Def_Alert_Type    = group.get('p_alert_type').value;
        let P_Def_Alert_Period  = group.get('p_alert_period').value;
        let allowed             = group.get('allowed').value;
        let yellow              = group.get('yellow').value;
        let green               = group.get('green').value;
        let red                 = group.get('red').value;
        let expire_amount       = group.get('expire_amount').value;
        let expire_costType     = group.get('expire_costType').value;
        let expire_unit         = group.get('expire_unit').value;
        let expire_period       = group.get('expire_period').value;
        let expire_length       = group.get('expire_length').value;
        let defaultbasiccarefee = group.get('defaultbasiccarefee').value;
        let expire_using        = group.get('expire_using').value;
        let adminType           = group.get('adminType').value;
        let admin_parc_amt      = group.get('admin_parc_amt').value; 
        let admin_cm_parc_amt   = group.get('admin_cm_parc_amt').value; 
        let adminFrequency      = group.get('adminFrequency').value;
        let cmFrequency         = group.get('cmFrequency').value;
        let admincmType         = group.get('admincmType').value;
        let standard_quote      = group.get('standard_quote').value;
        let defaultdailyfee     = group.get('defaultdailyfee').value;
        let max_contiguency     = group.get('max_contiguency').value;
        let perc_amt            = group.get('perc_amt').value;
        let adminDay            = group.get('adminDay').value;
        let cmday               = group.get('cmday').value;
        let default_daily_fees  = group.get('default_daily_fees').value;
        let IncludeTopUp = this.trueString(group.get('IncludeTopUp').value);
        let IncludeCare = this.trueString(group.get('IncludeCare').value);
        let includetested = this.trueString(group.get('includetested').value);
        let includeClientFeesCont = this.trueString(group.get('includeClientFeesCont').value);
        let quoute_template = group.get('quoute_template').value; 
        let line1           = group.get('line1').value;
        let line2           = group.get('line2').value;
        let text1           = line1+" || "+line2;
        let nprogram = group.get('nprogram').value; 
        let nactivity = group.get('nactivity').value; 
        let npay = group.get('npay').value; 
        let cprogram = group.get('cprogram').value; 
        let cactivity = group.get('cactivity').value; 
        let cpay = group.get('cpay').value; 
        let wnprogram = group.get('wnprogram').value; 
        let wnactivity = group.get('wnactivity').value; 
        let wnpay = group.get('wnpay').value; 
        let wcprogram = group.get('wnprogram').value; 
        let wcactivity = group.get('wcactivity').value; 
        let wcpay = group.get('wcpay').value; 
        let  defaultNoNoticeBillProgram =  group.get('defaultNoNoticeBillProgram').value;
        let  defaultNoNoticeCancel =  group.get('defaultNoNoticeCancel').value;
        let  defaultNoNoticePayProgram =  group.get('defaultNoNoticePayProgram').value;
        let  defaultWithNoticeCancel =  group.get('defaultWithNoticeCancel').value;
        let  defaultWithNoticeProgram =  group.get('defaultWithNoticeProgram').value;
        let  noNoticeCancelRate       =  group.get('noNoticeCancelRate').value;
        let  noNoticeLeadTime        =  group.get('noNoticeLeadTime').value;
        let  noNoticeLeaveActivity    =  group.get('noNoticeLeaveActivity').value;
        let  shortNoticeCancelRate    =  group.get('shortNoticeCancelRate').value;
        let  shortNoticeLeadTime      =  group.get('shortNoticeLeadTime').value;
        let  shortNoticeLeaveActivity =  group.get('shortNoticeLeaveActivity').value;
        let  defaultShortNoticePayType     = group.get('defaultShortNoticePayType').value;
        let  defaultShortNoticePayProgram  = group.get('defaultShortNoticePayProgram').value;
        let  defaultShortNoticeBillProgram = group.get('defaultShortNoticeBillProgram').value;
        let  defaultShortNoticeCancel      = group.get('defaultShortNoticeCancel').value;
        let  defaultNoNoticePayType         = group.get('defaultNoNoticePayType').value;
        
        let values = "PROGRAMS"+"','"+title+"','"+fundingSource+"','"+agencyID+"','"+cordinators+"','"+fundingRegion
        +"','"+careDomain+"','"+fundingType+"','"+state+"','"+gst
        +"','"+rate+"','"+budget$+"','"+budgetHrs+"','"+bgtCycle
        +"','"+glExp+"','"+glRev+"','"+glSuper+"','"+closeDate
        +"','"+programJob+"','"+template+"','"+contiguency+"','"+level
        +"','"+targetGroup+"','"+conguencyPackage+"','"+budgetEnforcement
        +"','"+budgetRosterEnforcement+"','"+agedCarePackage
        +"','"+individuallyFunded
        +"','"+user8+"','"+user9+"','"+User11+"','"+User12+"','"+P_Def_Alert_Type+"','"+P_Def_Alert_Period
        +"','"+allowed+"','"+yellow+"','"+green+"','"+red
        +"','"+expire_amount+"','"+expire_costType+"','"+expire_unit+"','"+expire_period+"','"+expire_length
        +"','"+defaultbasiccarefee+"','"+perc_amt+"','"+adminType
        +"','"+admincmType+"','"+admin_cm_parc_amt+"','"+admin_parc_amt+"','"+standard_quote
        +"','"+adminFrequency+"','"+cmFrequency+"','"+adminDay+"','"+cmday+"','"+expire_using+"','"+max_contiguency
        +"','"+wcactivity+"','"+wcpay+"','"+wnprogram+"','"+wnactivity+"','"+wnpay
        +"','"+cactivity+"','"+cpay+"','"+nprogram
        +"','"+nactivity+"','"+npay+"','"+cprogram+"','"+wcprogram
        +"','"+includeClientFeesCont+"','"+includetested+"','"+IncludeCare+"','"+IncludeTopUp
        +"','"+text1+"','"+default_daily_fees+"','"+noNoticeLeadTime+"','"+shortNoticeLeadTime+"','"+noNoticeLeaveActivity
        +"','"+shortNoticeLeaveActivity+"','"+defaultNoNoticeCancel+"','"+defaultNoNoticeBillProgram+"','"+defaultNoNoticePayProgram+"','"+defaultNoNoticePayType
        +"','"+defaultShortNoticeCancel+"','"+defaultShortNoticeBillProgram+"','"+defaultShortNoticePayProgram+"','"+defaultShortNoticePayType
        +"','"+defaultWithNoticeCancel+"','"+noNoticeCancelRate+"','"+shortNoticeCancelRate+"','"+defaultWithNoticeProgram;
        
        let sqlz = "insert into humanresourcetypes ([Group],[Name],[type],[address1],[address2],[Suburb],[HRT_DATASET],[USER1],[Phone2],[gst],[GSTRate],[budgetamount],[budget_1],[budgetperiod],[fax],[email],[phone1],[CloseDate],[Postcode],[UserYesNo3],[User2],[User3],[User4],[User10],[BudgetEnforcement],[BudgetRosterEnforcement],[UserYesNo1],[UserYesNo2],[User8],[User9],[User11],[User12],[P_Def_Alert_Type],[P_Def_Alert_Period],[P_Def_Alert_Allowed],[P_Def_Alert_Yellow],[P_Def_Alert_Orange],[P_Def_Alert_Red],[P_Def_Expire_Amount],[P_Def_Expire_CostType],[P_Def_Expire_Unit],[P_Def_Expire_Period],[P_Def_Expire_Length],[P_Def_Fee_BasicCare],[P_Def_Contingency_PercAmt],[P_Def_Admin_AdminType],[P_Def_Admin_CMType],[P_Def_Admin_CM_PercAmt],[p_Def_Admin_Admin_PercAmt],[P_Def_StdDisclaimer],[P_Def_Admin_AdminFrequency],[P_Def_Admin_CMFrequency],[P_Def_Admin_AdminDay] ,[P_Def_Admin_CMDay],[P_Def_Expire_Using],[P_Def_Contingency_Max],[DefaultCHGTravelWithinActivity],[DefaultCHGTravelWithinPayType],[DefaultNCTravelWithinProgram],[DefaultNCTravelWithinActivity],[DefaultNCTravelWithinPayType],[DefaultCHGTravelBetweenActivity],[DefaultCHGTravelBetweenPayType],[DefaultNCTravelBetweenProgram],[DefaultNCTravelBetweenActivity],[DefaultNCTravelBetweenPayType],[DefaultCHGTRAVELBetweenProgram],[DefaultCHGTRAVELWithInProgram],[P_Def_IncludeClientFeesInCont],[P_Def_IncludeIncomeTestedFeeInAdmin],[P_Def_IncludeBasicCareFeeInAdmin],[P_Def_IncludeTopUpFeeInAdmin],[CDCStatementText1],[DefaultDailyFee],[NoNoticeLeadTime],[ShortNoticeLeadTime],[NoNoticeLeaveActivity],[ShortNoticeLeaveActivity],[DefaultNoNoticeCancel],[DefaultNoNoticeBillProgram],[DefaultNoNoticePayProgram],[DefaultNoNoticePayType],[DefaultShortNoticeCancel],[DefaultShortNoticeBillProgram],[DefaultShortNoticePayProgram],[DefaultShortNoticePayType],[DefaultWithNoticeCancel],[NoNoticeCancelRate],[ShortNoticeCancelRate],[DefaultWithNoticeProgram]) values('"+values+"');select @@IDENTITY";
        // console.log(sqlz);
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
        let closeDate = (group.get('close_date').value) ? this.globalS.convertDbDate(group.get('close_date').value) : '';
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
        let user8 = "RECURRENT FUNDING";
        let user9 = "AT FUNDING EXPIRY";
        let User11              = '';
        let User12              = group.get('cycle').value;
        let P_Def_Alert_Type    = group.get('p_alert_type').value;
        let P_Def_Alert_Period  = group.get('p_alert_period').value;
        let allowed             = group.get('allowed').value;
        let yellow              = group.get('yellow').value;
        let green               = group.get('green').value;
        let red                 = group.get('red').value;
        let expire_amount       = group.get('expire_amount').value;
        let expire_costType     = group.get('expire_costType').value;
        let expire_unit         = group.get('expire_unit').value;
        let expire_period       = group.get('expire_period').value;
        let expire_length       = group.get('expire_length').value;
        let defaultbasiccarefee = group.get('defaultbasiccarefee').value;
        let expire_using        = group.get('expire_using').value;
        let adminType           = group.get('adminType').value;
        let admin_parc_amt      = group.get('admin_parc_amt').value; 
        let admin_cm_parc_amt   = group.get('admin_cm_parc_amt').value; 
        let adminFrequency      = group.get('adminFrequency').value;
        let cmFrequency         = group.get('cmFrequency').value;
        let admincmType         = group.get('admincmType').value;
        let standard_quote      = group.get('standard_quote').value;
        let defaultdailyfee     = group.get('defaultdailyfee').value;
        let max_contiguency     = group.get('max_contiguency').value;
        let perc_amt            = group.get('perc_amt').value;
        let adminDay            = group.get('adminDay').value;
        let cmday               = group.get('cmday').value;
        let default_daily_fees  = group.get('default_daily_fees').value;
        let IncludeTopUp = this.trueString(group.get('IncludeTopUp').value);
        let IncludeCare = this.trueString(group.get('IncludeCare').value);
        let includetested = this.trueString(group.get('includetested').value);
        let includeClientFeesCont = this.trueString(group.get('includeClientFeesCont').value);
        let quoute_template = group.get('quoute_template').value; 
        let line1           = group.get('line1').value;
        let line2           = group.get('line2').value;
        let text1           = line1+" || "+line2;
        let nprogram = group.get('nprogram').value; 
        let nactivity = group.get('nactivity').value; 
        let npay = group.get('npay').value; 
        let cprogram = group.get('cprogram').value; 
        let cactivity = group.get('cactivity').value; 
        let cpay = group.get('cpay').value; 
        let wnprogram = group.get('wnprogram').value; 
        let wnactivity = group.get('wnactivity').value; 
        let wnpay = group.get('wnpay').value; 
        let wcprogram = group.get('wnprogram').value; 
        let wcactivity = group.get('wcactivity').value; 
        let wcpay = group.get('wcpay').value; 
        let  defaultNoNoticeBillProgram =  group.get('defaultNoNoticeBillProgram').value;
        let  defaultNoNoticeCancel =  group.get('defaultNoNoticeCancel').value;
        let  defaultNoNoticePayProgram =  group.get('defaultNoNoticePayProgram').value;
        let  defaultWithNoticeCancel =  group.get('defaultWithNoticeCancel').value;
        let  defaultWithNoticeProgram =  group.get('defaultWithNoticeProgram').value;
        let  noNoticeCancelRate       =  group.get('noNoticeCancelRate').value;
        let  noNoticeLeadTime        =  group.get('noNoticeLeadTime').value;
        let  noNoticeLeaveActivity    =  group.get('noNoticeLeaveActivity').value;
        let  shortNoticeCancelRate    =  group.get('shortNoticeCancelRate').value;
        let  shortNoticeLeadTime      =  group.get('shortNoticeLeadTime').value;
        let  shortNoticeLeaveActivity =  group.get('shortNoticeLeaveActivity').value;
        let  defaultShortNoticePayType     = group.get('defaultShortNoticePayType').value;
        let  defaultShortNoticePayProgram  = group.get('defaultShortNoticePayProgram').value;
        let  defaultShortNoticeBillProgram = group.get('defaultShortNoticeBillProgram').value;
        let  defaultShortNoticeCancel      = group.get('defaultShortNoticeCancel').value;
        let  defaultNoNoticePayType         = group.get('defaultNoNoticePayType').value;
        let  recordNumber                  = group.get('recordNumber').value;  
        let prog = "PROGRAMS";
        
        let sqlUpdate = "Update humanresourcetypes SET [Group]='"+ prog + "',[Name]='"+ title + "',[type]='"+ fundingSource + "',[address1]='"+ agencyID + "',[address2]='"+ cordinators + "', [Suburb]='"+ fundingRegion + "',[HRT_DATASET]='"+ careDomain + "',[USER1]='"+ fundingType + "',[Phone2]='"+ state + "',[gst]='"+ gst + "',[GSTRate]='"+ rate + "',[budgetamount]='"+ budget$ + "',[budget_1]='"+ budgetHrs + "',[budgetperiod]='"+bgtCycle+"',[fax]='"+ glExp + "',[email]='"+ glRev + "',[phone1]='"+ glSuper + "',[CloseDate]='"+ closeDate + "',[Postcode]='"+ programJob + "',[UserYesNo3]='"+ template + "',[User2]='"+ contiguency + "',[User3]='"+ level + "',[User4]='"+ targetGroup + "',[User10]='"+ conguencyPackage + "',[BudgetEnforcement]='"+ budgetEnforcement + "',[BudgetRosterEnforcement]='"+ budgetRosterEnforcement + "',[UserYesNo1]='"+ agedCarePackage + "',[UserYesNo2]='"+ individuallyFunded + "',[User8]='"+ user8 + "',[User9]='"+ user9 + "',[User11]='"+ User11 + "',[User12]='"+ User12 + "',[P_Def_Alert_Type]='"+ P_Def_Alert_Type + "',[P_Def_Alert_Period]='"+ P_Def_Alert_Period + "',[P_Def_Alert_Allowed]='"+ allowed + "',[P_Def_Alert_Yellow]='"+ yellow + "',[P_Def_Alert_Orange]='"+ green + "',[P_Def_Alert_Red]='"+ red + "',[P_Def_Expire_Amount]='"+ expire_amount + "',[P_Def_Expire_CostType]='"+ expire_costType + "',[P_Def_Expire_Unit]='"+ expire_unit + "',[P_Def_Expire_Period]='"+ expire_period + "',[P_Def_Expire_Length]='"+ expire_length + "',[P_Def_Fee_BasicCare]='"+ defaultbasiccarefee + "',[P_Def_Contingency_PercAmt]='"+ perc_amt + "',[P_Def_Admin_AdminType]='"+ adminType + "',[P_Def_Admin_CMType]='"+ admincmType + "',[P_Def_Admin_CM_PercAmt]='"+admin_cm_parc_amt+"',[p_Def_Admin_Admin_PercAmt]='"+admin_parc_amt+"',[P_Def_StdDisclaimer]='"+standard_quote+"',[P_Def_Admin_AdminFrequency]='"+adminFrequency+"',[P_Def_Admin_CMFrequency]='"+cmFrequency+"',[P_Def_Admin_AdminDay]='"+adminDay+"',[P_Def_Admin_CMDay]='"+cmday+"',[P_Def_Expire_Using]='"+expire_using+"',[P_Def_Contingency_Max]='"+max_contiguency+"',[DefaultCHGTravelWithinActivity]='"+wcactivity+"',[DefaultCHGTravelWithinPayType]='"+wcpay+"',[DefaultNCTravelWithinProgram]='"+wnprogram+"',[DefaultNCTravelWithinActivity]='"+wnactivity+"',[DefaultNCTravelWithinPayType]='"+wnpay+"',[DefaultCHGTravelBetweenActivity]='"+cactivity+"',[DefaultCHGTravelBetweenPayType]='"+cpay+"',[DefaultNCTravelBetweenProgram]='"+nprogram+"',[DefaultNCTravelBetweenActivity]='"+nactivity+"',[DefaultNCTravelBetweenPayType]='"+npay+"',[DefaultCHGTRAVELBetweenProgram]='"+cprogram+"',[DefaultCHGTRAVELWithInProgram]='"+wcprogram+"',[P_Def_IncludeClientFeesInCont]='"+includeClientFeesCont+"',[P_Def_IncludeIncomeTestedFeeInAdmin]='"+includetested+"',[P_Def_IncludeBasicCareFeeInAdmin]='"+IncludeCare+"',[P_Def_IncludeTopUpFeeInAdmin]='"+IncludeTopUp+"',[CDCStatementText1]='"+text1+"',[DefaultDailyFee]='"+default_daily_fees+"',[NoNoticeLeadTime]='"+noNoticeLeadTime+"',[ShortNoticeLeadTime]='"+shortNoticeLeadTime+"',[NoNoticeLeaveActivity]='"+noNoticeLeaveActivity+"',[ShortNoticeLeaveActivity]='"+shortNoticeLeaveActivity+"',[DefaultNoNoticeCancel]='"+defaultNoNoticeCancel+"',[DefaultNoNoticeBillProgram]='"+defaultNoNoticeBillProgram+"',[DefaultNoNoticePayProgram]='"+defaultNoNoticePayProgram+"',[DefaultNoNoticePayType]='"+defaultNoNoticePayType+"',[DefaultShortNoticeCancel]='"+defaultShortNoticeCancel+"',[DefaultShortNoticeBillProgram]='"+defaultShortNoticeBillProgram+"',[DefaultShortNoticePayProgram]='"+defaultShortNoticePayProgram+"',[DefaultShortNoticePayType]='"+defaultShortNoticePayType+"',[DefaultWithNoticeCancel]='"+defaultWithNoticeCancel+"',[NoNoticeCancelRate]='"+noNoticeCancelRate+"',[ShortNoticeCancelRate]='"+shortNoticeCancelRate+"',[DefaultWithNoticeProgram]='"+defaultWithNoticeProgram+"' WHERE [RecordNumber] ='"+recordNumber+"'";
        // console.log(sqlUpdate);
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
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY [name],recordnumber) AS Row_num,[recordnumber] AS [RecordNumber], [name] AS [Title], [type] AS [Funding Source], [address1] AS [AgencyID],[address2] AS [Cordinators],[Suburb] AS [FundingRegion],[HRT_DATASET] AS [CareDomain],[USER1] as [FundingType],[Phone2] AS [State],[gst] AS [GST], [gstrate] AS [Rate], [budgetamount] AS [Budget $], [budget_1] AS [Budget Hrs], [budgetperiod] AS [Bgt Cycle], [fax] AS [GLExp], [email] AS [GLRev], [phone1] AS [GLSuper],[CloseDate] AS [CloseDate],[Postcode] AS [ProgramJob],[UserYesNo3] AS [template],[User2] AS [contiguency],[UserYesNo2] AS [IndividuallyFunded],[UserYesNo1] AS [AgedCarePackage],[User3] AS [Level],[User4] AS [TargetGroup],[User10] AS [ConguencyPackage],[BudgetEnforcement] AS [BudgetEnforcement],[BudgetRosterEnforcement],[User11],[User12],[User13],[P_Def_Alert_Type],[P_Def_Alert_BaseOn],[P_Def_Alert_Period],[P_Def_Alert_Allowed],[P_Def_Alert_Yellow],[P_Def_Alert_Orange],[P_Def_Alert_Red],[P_Def_Expire_Amount],[P_Def_Expire_CostType],[P_Def_Expire_Unit],[P_Def_Expire_Period],[P_Def_Expire_Length],[P_Def_Fee_BasicCare],[P_Def_Contingency_PercAmt],[P_Def_Admin_AdminType],[P_Def_Admin_CMType],[P_Def_Admin_CM_PercAmt],[p_Def_Admin_Admin_PercAmt],[P_Def_StdDisclaimer],[P_Def_Admin_AdminFrequency],[P_Def_Admin_CMFrequency],[P_Def_Admin_AdminDay],[P_Def_Admin_CMDay],[P_Def_Expire_Using],[P_Def_Contingency_Max],[P_Def_QueryAutoDeleteAdmin],[DefaultCHGTravelWithinActivity],[DefaultCHGTravelWithinPayType],[DefaultNCTravelWithinProgram],[DefaultNCTravelWithinActivity],[DefaultNCTravelWithinPayType],[DefaultCHGTravelBetweenActivity],[DefaultCHGTravelBetweenPayType],[DefaultNCTravelBetweenProgram],[DefaultNCTravelBetweenActivity],[DefaultNCTravelBetweenPayType],[P_Def_IncludeClientFeesInCont],[P_Def_IncludeIncomeTestedFeeInAdmin],[P_Def_IncludeBasicCareFeeInAdmin],[P_Def_IncludeTopUpFeeInAdmin],[CDCStatementText1],[DefaultCHGTRAVELWithInProgram],[DefaultCHGTRAVELBetweenProgram],[DefaultDailyFee],[NoNoticeLeadTime],[ShortNoticeLeadTime],[NoNoticeLeaveActivity],[ShortNoticeLeaveActivity],[DefaultNoNoticeCancel],[DefaultNoNoticeBillProgram],[DefaultNoNoticePayProgram],[DefaultNoNoticePayType],[DefaultShortNoticeCancel],[DefaultShortNoticeBillProgram],[DefaultShortNoticePayProgram],[DefaultShortNoticePayType],[DefaultWithNoticeCancel],[NoNoticeCancelRate],[ShortNoticeCancelRate],[DefaultWithNoticeProgram] FROM humanresourcetypes WHERE ( [group] = 'PROGRAMS' ) AND ( enddate IS NULL OR enddate >= '04-05-2019' ) ORDER BY title";
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
      this.cycles = ['CYCLE 1','CYCLE 2','CYCLE 3','CYCLE 4','CYCLE 5','CYCLE 6','CYCLE 7','CYCLE 8','CYCLE 9','CYCLE 10'];
      this.budgetEnforcement = ['HARD','SOFT'];
      this.alerts   = ['HOURS', 'DOLLARS', 'SERVICES'];
      this.DefPeriod = ['DAY','WEEK','FORTNIGHT','4 WEEKS','MONTHS','6 MONTHS','QUARTER','6 MONTHS','YEAR']
      
      this.expireUsing   = ['Activity AVG COST','CHARGE RATE','PAY UNIT RATE']
      this.unitsArray    = ['PER','TOTAL'];
      this.dailyArry     = ['DAILY'];
      this.quoutetemplates = ['CAREPLAN SAVED AS TEMPLATE.OD'];
      this.adminTypesArray = ['**CDC – CARE MGMT','**CDC FEE-ADMIN','~CASE MGT~','~PACKAGE ADMIN~','AGREED TOP UP FEE','BASIC CARE FEE','CDC  EXIT FEE','COORDINATION OF SUPPORTS','INCOME TESTED FEE','NDIA FAINANCIAL INTERMEDIATOR','YLYC CASE MAN. 2.066'];
      this.budgetRoasterEnforcement = ['NONE','NOTIFY','NOTIFY AND UNALLOCATE'];
      this.listS.getcaredomain().subscribe(data => this.caredomain = data);
      this.listS.getliststaffteam().subscribe(data=>this.staffTeams= data);
      let todayDate  = this.globalS.curreentDate();
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
      let prog = "select distinct Name from HumanResourceTypes WHERE [GROUP]= 'PROGRAMS' AND ((EndDate IS NULL) OR (EndDate > '"+todayDate+"'))";
      this.listS.getlist(prog).subscribe(data => {
        this.programz = data;
      });
      
      let sc = "select distinct Name from HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND User2 = 'Contingency'";
      this.listS.getlist(sc).subscribe(data => {
        this.contingency = data;
        this.loading = false;
      });
      
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
      
      let activity = "select distinct Title from ItemTypes WHERE ProcessClassification = 'EVENT' AND ((EndDate IS NULL) OR (EndDate > '"+todayDate+"')) AND RosterGroup = 'RECPTABSENCE'";
      this.listS.getlist(activity).subscribe(data => {
        this.activityTypes = data;
        this.loading = false;
      });
      
      let timesheet = "select distinct Title from ItemTypes WHERE ProcessClassification = 'OUTPUT' AND ((EndDate IS NULL) OR (EndDate > '"+todayDate+"')) AND RosterGroup = 'ADMINISTRATION'"
      this.listS.getlist(timesheet).subscribe(data => {
        this.activityTimeSheet = data;
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
    
  }
  
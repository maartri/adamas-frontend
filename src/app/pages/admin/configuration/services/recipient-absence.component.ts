import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService,timeSteps } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recipient-absence',
  templateUrl: './recipient-absence.component.html',
  styles: [`
  .mrg-btm{
    margin-bottom:0.3rem;
  },
  textarea{
    resize:none;
  },
  .staff-wrapper{
    height: 20rem;
    width: 100%;
    overflow: auto;
    padding: .5rem 1rem;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
  }
  `]
})
export class RecipientAbsenceComponent implements OnInit {

  tableData: Array<any>;//load Main Listing
  branches:Array<any>;
  listStaff:Array<any>;
  selectedStaff:Array<any>;
  paytypes:Array<any>;
  checkedList:string[];//competency 
  competencyList:Array<any>//list competency;
  programz:Array<any>;//populate dropdown
  mtaAlerts:Array<any>;//populate dropdown
  addressTypes:Array<any>;//populate dropdown
  contactTypes:Array<any>;//populate dropdown
  subgroups:Array<any>;//populate dropdown
  status:Array<any>;//populate dropdown
  units:Array<any>;//populate dropdown
  mainGroupList:Array<any>;//populate dropdown
  subGroupList:Array<any>;//populate dropdown
  budgetGroupList:Array<any>;//populate dropdown
  lifeCycleList:Array<any>;//populate dropdown
  diciplineList:Array<any>;//populate dropdown
  ServiceData:Array<any>;
  items:Array<any>;
  jurisdiction:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  staffApproved: boolean = false;
  staffUnApproved: boolean = false;
  competencymodal: boolean = false;
  check : boolean = false;
  current: number = 0;
  checkedflag:boolean = true;
  dateFormat: string = 'dd/MM/yyyy';
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any; 
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Recipient Absences";
  tocken: any;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  budgetUomList: string[];
  ndiaList: string[];
  datasetList: string[];
  shiftTypes: string[];
  mobileLogModes: { "0": string; "3": string; "1": string; "2": string; };
  timesteps: string[];
  ndiaItems: any;
  emptyList: any[];
  selectedPrograms: any;
  selectedCompetencies: any;
  competencyForm: FormGroup;
  parent_person_id: any;
  
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
      this.loadData();
      this.buildForm();
      this.populateDropdowns();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Recipient Absences"
      this.resetModal();
      this.inputForm.patchValue({
        mainGroup :'RECIPIENT ABSENCE',
        subgroup  :'OTHER',
        unit      :'HOUR',
        min       :'0',
        max       :'0',
        forceRostedTime:'0',
        chargeRate1:'$0.0000',
        minimumChargeRate:'$0.0000',
        commercial:'$0.0000',
        price2:'$0.0000',
        price3:'$0.0000',
        price4:'$0.0000',
        price5:'$0.0000',
        price6:'$0.0000',
      });

      this.modalOpen = true;
    }
    logs(value: string[]): void {
      this.selectedCompetencies 
    }
    log(event: any) {
      this.selectedPrograms = event;
    }
    clearPrograms(){
      this.programz.forEach(x => {
        x.checked = false
      });
      this.selectedPrograms = [];
    }
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
      this.title = "Edit Recipient Absences"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const {
        title,
        billText,
        rosterGroup,
        subGroup,
        status,
        billAmount,
        billUnit,
        minChargeRate,
        lifecycle,
        budgetGroup,
        dataSet,
        autoApprove,
        excludeFromAutoLeave,
        infoOnly,
        accountingCode,
        glRevenue,
        job,
        glCost,
        unitCostUOM,
        unitCost,
        mainGroup,
        excludeFromPayExport,
        excludeFromUsageStatements,
        price2,
        price3,
        price4,
        price5,
        price6,
        excludeFromConflicts,
        noMonday,
        noTuesday,
        noWednesday,
        noThursday,
        noFriday,
        noSaturday,
        noSunday,
        noPubHol,
        dtartTimeLimit,
        endTimeLimit,
        minDurtn,
        maxDurtn,
        fixedTime,
        noChangeDate,
        noChangeTime,
        timeChangeLimit,
        defaultAddress,
        defaultPhone,
        autoActivityNotes,
        autoRecipientDetails,
        jobSheetPrompt,
        activityNotes,
        jobType,
        excludeFromHigherPayCalculation,
        noOvertimeAccumulation,
        payAsRostered,
        excludeFromTimebands,
        excludeFromInterpretation,
        excludeFromClientPortalDisplay,
        excludeFromTravelCalc,
        tA_EXCLUDEGEOLOCATION,
        appExclude1,
        taexclude1,
        tA_LOGINMODE,
        taEarlyStartTHEmail,
        taEarlyStartTH,
        taEarlyStartTHWho,
        taLateStartTHEmail,
        taLateStartTH,
        taLateStartTHWho,
        taNoGoResend,
        taNoShowResend,
        taEarlyFinishTHEmail,
        taLateFinishTHEmail,
        taEarlyFinishTH,
        taLateFinishTH,
        taLateFinishTHWho,
        taEarlyFinishTHWho,
        taOverstayTHEmail,
        taUnderstayTHEmail,
        taNoWorkTHEmail,
        taOverstayTH,
        taUnderstayTH,
        taNoWorkTH,
        endDate,
        ndiA_LEVEL2,
        ndiA_LEVEL3,
        ndiA_LEVEL4,
        ndiaClaimType,
        ndiaPriceType,
        ndiaTravel,
        recordNumber,
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        title:title,
        billingText:billText,
        mainGroup:rosterGroup,
        subgroup:subGroup,
        status:status,
        chargeRate1:billAmount,
        minimumChargeRate:minChargeRate,
        unit:billUnit,
        lifeCycleEvent:lifecycle,
        budgetGroup:budgetGroup,
        dicipline:dataSet,
        AutoApprove:autoApprove,
        excludeFromAuto:(excludeFromAutoLeave == true) ? true : false,
        Informational:(infoOnly == true) ? true : false,
        recordNumber:(recordNumber == true) ? true : false,
        accountingCode:accountingCode,
        glRevenue:glRevenue,
        job:job,
        glCost:glCost,
        buom:unitCostUOM,
        unitCost:unitCost,
        nida:mainGroup,
        commercial:billAmount,
        excludeFromPayExport:(excludeFromPayExport == true) ? true : false,
        excludeFromUsageStatements:(excludeFromUsageStatements == true) ? true : false,
        price2:price2,
        price3:price3,
        price4:price4,
        price5:price5,
        price6:price6,
        conflict:excludeFromConflicts,
        day1:(noMonday    == false) ? true : false,
        day2:(noTuesday   == false) ? true : false,
        day3:(noWednesday == false) ? true : false,
        day4:(noThursday  == false) ? true : false,
        day5:(noFriday    == false) ? true : false,
        day6:(noSaturday  == false) ? true : false,
        day7:(noSunday    == false) ? true : false,
        day0:(noPubHol    == false) ? true : false,
        startTimeLimit:dtartTimeLimit,
        endTimeLimit:endTimeLimit,
        min:minDurtn,
        max:maxDurtn,
        rostedDay:(noChangeDate == true) ? true : false,
        rostedTime:(noChangeTime== true) ? true : false,
        forceRostedTime:fixedTime,
        orignalminute:timeChangeLimit,
        address:defaultAddress,
        contact:defaultPhone,
        autoActivityNotes:(autoActivityNotes == true) ? true : false,
        autoRecipientDetails:(autoRecipientDetails== true) ? true : false,
        jobSheetPrompt:(jobSheetPrompt == true ) ? true : false,
        activityNotes:activityNotes,
        specialShift:jobType,
        award1:(excludeFromHigherPayCalculation == true) ? true : false,
        award2:(noOvertimeAccumulation== true) ? true : false,
        award3:(payAsRostered== true) ? true : false,
        award4:(excludeFromTimebands== true) ? true : false,
        award5:(excludeFromInterpretation== true) ? true : false,
        excludeFromClientPortalDisplay:(excludeFromClientPortalDisplay == true) ?  true : false,
        excludeFromTravelCalc:(excludeFromTravelCalc ==  true) ? true : false,
        tA_EXCLUDEGEOLOCATION:(tA_EXCLUDEGEOLOCATION == true) ? true : false,
        appExclude1:(appExclude1 == true) ? true : false,
        taexclude1:(taexclude1 == true) ?  true : false,
        mode:tA_LOGINMODE,
        taEarlyStartTHEmail:(taEarlyStartTHEmail == true) ?  true : false,
        taEarlyStartTH:taEarlyStartTH,
        taEarlyStartTHWho:taEarlyStartTHWho,
        taLateStartTHEmail:(taLateStartTHEmail == true) ?  true : false,
        taLateStartTH:taLateStartTH,
        taLateStartTHWho:taLateStartTHWho,
        taEarlyFinishTHEmail:(taEarlyFinishTHEmail == true) ?  true : false,
        taLateFinishTHEmail :(taLateFinishTHEmail == true) ? true : false,
        taNoGoResend:taNoGoResend,
        taNoShowResend:taNoShowResend,
        taEarlyFinishTH:taEarlyFinishTH,
        taLateFinishTH:taLateFinishTH,
        taLateFinishTHWho:taLateFinishTHWho,
        taEarlyFinishTHWho:taEarlyFinishTHWho,
        taOverstayTHEmail:(taOverstayTHEmail == true) ? true : false,
        taUnderstayTHEmail:(taUnderstayTHEmail == true) ? true : false,
        taNoWorkTHEmail:(taNoWorkTHEmail == true) ? true : false,
        taOverstayTH:taOverstayTH,
        taUnderstayTH:taUnderstayTH,
        taNoWorkTH:taNoWorkTH,
        end_date:endDate,
        ndiA_LEVEL2:ndiA_LEVEL2,
        ndiA_LEVEL3:ndiA_LEVEL3,
        ndiA_LEVEL4:ndiA_LEVEL4,
        ndiaClaimType:ndiaClaimType,//add to api
        ndiaPriceType:ndiaPriceType,//add to api
        ndiaTravel:ndiaTravel,//add to api
        recnum:recordNumber,
      });
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    handleCompCancel() {
      this.competencymodal = false;
    }
    handleAprfCancel(){
      this.staffApproved = false;
    }
    handleUnAprfCancel(){
      this.staffUnApproved = false;
    }
    showCompetencyModal(){
      this.competencymodal = true;
      this.clearCompetency();
    }
    handleCompetencyCancel(){
      this.competencymodal = false;
    }
    pre(): void {
      this.current -= 1;
    }
    
    trueString(data: any): string{
      return data ? '1': '0';
    }
    
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    onCheckboxChange(option, event) {
      if(event.target.checked){
        console.log(option);
        this.checkedList.push(option.name);
      } else {
        this.checkedList = this.checkedList.filter(m=>m!= option.name)
      }
    }
    onIndexChange(index: number): void {
      this.current = index;
    }
    next(): void {
      this.current += 1;
    }
    save() {
      // console.log(this.selectedPrograms);
        if(!this.isUpdate){
          this.menuS.poststaffAdminActivities(this.inputForm.value)
                      .subscribe(data => {
                          this.globalS.sToast('Success', 'Added Succesfully');
          });
        }else{
  
        }
    }
    saveCompetency(){
      console.log(this.selectedCompetencies);
    }
    clearCompetency(){
      this.competencyList.forEach(x => {
        x.checked = false
      });
      this.selectedCompetencies = [];
    }
    loadData(){
      this.loading = true;
      this.menuS.GetlistRecipientAbsenses(this.check).subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "WHERE ProcessClassification <> 'INPUT' ";
        this.loadData();
      }else{
        this.whereString = "WHERE ProcessClassification <> 'INPUT' AND ISNULL(DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE())";
        this.loadData();
      }
    }
    clearStaff(){
      this.listStaff.forEach(x => {
        x.checked = false
      });
      
      this.selectedStaff = [];
    }
    populateDropdowns(): void {
      
      this.emptyList      = [];
      this.mainGroupList  = ['RECIPIENT ABSENCE'];
      this.subGroupList   = ['FULL DAY-RESPITE','FULL DAY-HOSPITAL','FULL DAY-TRANSITION','FULL DAY-SOCIAL LEAVE','OTHER','ALTERNATIVE','ALTERNATIVE'];
      this.status         = ['ATTRIBUTABLE','NONATTRIBUTABLE'];
      this.units          = ['HOUR','SERVICE'];
      this.budgetUomList  = ['EACH/SERVICE','HOURS','PLACE','DOLLARS'];
      this.ndiaList       = ['DIRECT SERVICE','PACKAGE ADMIN','CASE MANAGEMENT','GOODS/EQUIPMENT'];
      this.datasetList    = ['CACP','CTP','DEX','DFC','DVA','HACC','HAS','ICTD','NDIS','NRCP','NRCP-SAR','OTHER','QCSS'];
      this.shiftTypes     = ['EXCURSION','MEAL BREAK','SLEEPOVER','TEA BREAK'];
      this.mobileLogModes = {
                              "0":'BUTTONS',
                              "3":'PIN CODE',
                              "1":'QRCODE',
                              "2":'SIGNATURE',
                            };
      
      let todayDate       = this.globalS.curreentDate();
      
      let sql ="SELECT distinct Description from DataDomains Where  Domain = 'LIFECYCLEEVENTS'";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.lifeCycleList = data;
      });
      
      let sql3 ="SELECT distinct Description from DataDomains Where  Domain = 'ADDRESSTYPE'";
      this.loading = true;
      this.listS.getlist(sql3).subscribe(data => {
        this.addressTypes = data;
      });
      let sql4 ="SELECT distinct Description from DataDomains Where  Domain = 'CONTACTTYPE'";
      this.loading = true;
      this.listS.getlist(sql4).subscribe(data => {
        this.contactTypes = data;
      });
      let sql1 ="SELECT distinct Description from DataDomains Where  Domain = 'BUDGETGROUP'";
      this.loading = true;
      this.listS.getlist(sql1).subscribe(data => {
        this.budgetGroupList = data;
      });
      
      let sql2 ="SELECT distinct Description from DataDomains Where  Domain = 'DISCIPLINE'";
      this.loading = true;
      this.listS.getlist(sql2).subscribe(data => {
        this.diciplineList = data;
      });
      
      let comp = "SELECT distinct Description as name from DataDomains Where  Domain = 'STAFFATTRIBUTE' ORDER BY Description";
      this.listS.getlist(comp).subscribe(data => {
        this.competencyList = data;
        this.loading = false;
      });  
      
      let prog = "select distinct Name from HumanResourceTypes WHERE [GROUP]= 'PROGRAMS' AND ((EndDate IS NULL) OR (EndDate > Getdate()))";
      this.listS.getlist(prog).subscribe(data => {
        this.programz = data;
      });
      this.timesteps = timeSteps;
      this.listS.getndiaitems().subscribe(data => {
        this.ndiaItems = data;
      })
      this.mtaAlerts = ['NO ALERT','STAFF CASE MANAGER','RECIPIENT CASE MANAGER','BRANCH ROSTER EMAIL'];
      this.paytypes  = ['SALARY','ALLOWANCE'];
      this.subgroups  = ['NOT APPLICABLE','WORKED HOURS','PAID LEAVE','UNPAID LEAVE','N/C TRAVVEL BETWEEN','CHG TRAVVEL BETWEEN','N/C TRAVVEL WITHIN','CHG TRAVVEL WITHIN','OTHER ALLOWANCE'];
    }
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteActivityServiceslist(data.recordNumber)
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
        title:'',
        billingText:'',
        mainGroup:'',
        subgroup:'',
        status:'',
        chargeRate1:'',
        minimumChargeRate:'',
        lifeCycleEvent:'',
        unit:'',
        budgetGroup:'',
        dicipline:'',
        colorCode:'',
        AutoApprove:false,
        excludeFromAuto:false,
        Informational:false,
        dataset:'',
        groupMapping:'',
        nida:'',
        accountingCode:'',
        glRevenue:'',
        job:'',
        glCost:'',
        buom:'',
        unitCost:'',
        commercial:'',
        price2:'',
        price3:'',
        price4:'',
        price5:'',
        price6:'',
        excludeFromPayExport:false,
        excludeFromUsageStatements:false,
        type: '',
        payrate:'',
        casuals:false,
        end:'',
        end_date:'',
        payid:'',
        exportfrompay:false,
        conflict:false,
        day0:false,
        day1:false,
        day2:false,
        day3:false,
        day4:false,
        day5:false,
        day6:false,
        day7:false,
        startTimeLimit:'',
        endTimeLimit:'',
        min:0,
        max:0,
        forceRostedTime:0,
        rostedDay:false,
        rostedTime:false,
        orignalminute:0,
        address:'',
        contact:'',
        autoActivityNotes:false,
        autoRecipientDetails:false,
        jobSheetPrompt:false,
        activityNotes:'',
        award1:false,
        award2:false,
        award3:false,
        award4:false,
        award5:false,
        specialShift:'',
        mtacode:'',
        mode:'',
        excludeFromClientPortalDisplay: false,
        excludeFromTravelCalc: false,
        tA_EXCLUDEGEOLOCATION:false,
        appExclude1:false,
        taexclude1:false,
        taEarlyStartTHEmail:false,
        taEarlyStartTH:false,
        taEarlyStartTHWho:'',
        taLateStartTHEmail:false,
        taLateStartTH:false,
        taLateStartTHWho:'',
        taNoGoResend:'',
        taNoShowResend:'',
        taEarlyFinishTHEmail:false,
        taLateFinishTHEmail:false,
        taEarlyFinishTH:'',
        taLateFinishTH:'',
        taLateFinishTHWho:'',
        taEarlyFinishTHWho:'',
        taOverstayTHEmail:false,
        taUnderstayTHEmail:false,
        taNoWorkTHEmail:false,
        taOverstayTH:'',
        taUnderstayTH:'',
        taNoWorkTH:'',
        taUnderstayTHWho:'',
        taOverstayTHWho:'',
        taNoWorkTHWho:'',
        deletedRecord:false,
        HACCUse:false,
        CSTDAUse:false,
        NRCPUse:false,
        ndiaClaimType:"",//add to api
        ndiaPriceType:"",//add to api
        ndiaTravel:false,//add to api
        ndiA_LEVEL2:'',//add to api
        ndiA_LEVEL3:'',//add to api
        ndiA_LEVEL4:'',//add to api
      });
      this.competencyForm = this.formBuilder.group({
        'PersonID': this.parent_person_id,
        'Group'   :'SVC_COMP',
        'Type'    :'SVC_COMP',
        'Name'    : '',
        'Notes'   : '',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [Title]) AS Field1,[Title] As [Field2], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup END As [Field3],[MinorGroup] As [Field4],[HACCType] As [Field5],[DatasetGroup] As [Field6],  [NDIA_ID] As [Field7],[Amount] As [Field8],[Unit] As [Field9] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '12-22-2020')  AND (RosterGroup IN ('ITEM')) ORDER BY Title";
      
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
          "txtTitle": "Recipient Absences List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Title",
          "head3" : "Roaster Group",
          "head4" : "Sub Group",
          "head5" : "DataSet Code",
          "head6" : "DataSet Group",
          "head7" : "NDIA ID",
          "head8" : "Bill Amount",
          "head9" : "Bill Unit",
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

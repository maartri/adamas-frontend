import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService,timeSteps} from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-pay-type',
  templateUrl: './pay-type.component.html',
  styles: [`
  .ant-modal-body {
    padding: 0px 24px !important;
  }
  textarea{
    resize:none;
  },
  `]
})
export class PayTypeComponent implements OnInit {
  
  tableData: Array<any>;
  branches:Array<any>;
  paytypes:Array<any>;
  subgroups:Array<any>;
  units:Array<any>;
  ServiceData:Array<any>;
  items:Array<any>;
  jurisdiction:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  staffApproved: boolean = false;
  staffUnApproved: boolean = false;
  competencymodal: boolean = false;
  current: number = 0;
  checkedflag:boolean = true;
  dateFormat: string = 'dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  timesteps:Array<any>;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  
  title:string = "Add New Agency Pay Types";
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  private unsubscribe: Subject<void> = new Subject();
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
      this.loadData();
      this.buildForm();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Agency Pay Types"
      this.resetModal();
      this.modalOpen = true;
    }
    showstaffApprovedModal(){
      // this.resetModal();
      this.staffApproved = true;
    }
    showstaffUnApprovedModal(){
      this.staffUnApproved = true;
    }
    showCompetencyModal(){
      this.competencymodal = true;
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
      this.title = "Edit Agency Pay Types"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const {
        code,
        description,
        subGroup,
        payUnit,
        payCategory,
        payID,
        payAmount,
        endDate,
        applicableCasulas,
        noPayExport,
        excludeFromConflicts,
        noPubHol,
        noMonday,
        noTuesday,
        noWednesday,
        noThursday,
        noFriday,
        noSaturday,
        noSunday,
        startTimeLimit,
        endTimeLimit,
        minDurtn,
        maxDurtn,
        rostedTime,
        nochangeDate,
        nochangeTime,
        timeChangeLimit,
        excludeFromHigherPayCalculation,
        noOvertimeAccumulation,
        payAsRostered,
        excludeFromTimebands,
        excludeFromInterpretation,

        recordNumber,
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        code:code,
        description:description,
        type:payCategory,
        subgroup:subGroup,
        payrate:payAmount,
        unit:payUnit,
        end:endDate,
        payid:payID,
        exportfrompay:(noPayExport) ? true:false,
        casuals:(applicableCasulas) ? true:false,
        conflict:(excludeFromConflicts) ? true:false,
        day0:(noPubHol) ? false : true,
        day1:(noMonday) ? false : true,
        day2:(noTuesday) ? false : true,
        day3:(noWednesday) ? false : true,
        day4:(noThursday) ? false : true,
        day5:(noFriday) ? false : true,
        day6:(noSaturday) ? false : true,
        day7:(noSunday) ? false : true,
        startTimeLimit:startTimeLimit,
        endTimeLimit:endTimeLimit,
        min:minDurtn,
        max:maxDurtn,
        forceRostedTime:rostedTime,
        rostedDay:(nochangeDate) ? true : false,
        rostedTime:nochangeTime  ? true : false,
        orignalminute:timeChangeLimit,
        award1:(excludeFromHigherPayCalculation) ? true : false,
        award2:(noOvertimeAccumulation) ? true : false,
        award3:(payAsRostered) ? true : false,
        award4:(excludeFromTimebands) ? true : false,
        award5:(excludeFromInterpretation) ? true:false,
        recordNumber:recordNumber,
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
    pre(): void {
      this.current -= 1;
    }
    
    trueString(data: any): string{
      return data ? '1': '0';
    }
    trueStringOposite(data: any): string{
      return data ? '0': '1';
    }
    
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    
    next(): void {
      this.current += 1;
    }
    save() {
      if(!this.isUpdate){

        this.postLoading = true;
        const group = this.inputForm;
        
        let status            = "'NONATTRIBUTABLE'";
        let process           = "'INPUT'";
        let mainGroup         = "'DIRECT SERVICE'";
        let unitCostUom       = "'EACH/SERVICE'";
        let code              = this.globalS.isValueNull(group.get('code').value);
        let description       = this.globalS.isValueNull(group.get('description').value);
        let type              = this.globalS.isValueNull(group.get('type').value);
        let subgroup          = this.globalS.isValueNull(group.get('subgroup').value);
        let payrate           = this.globalS.isValueNull(group.get('payrate').value);
        let end               = !(this.globalS.isVarNull(group.get('end').value)) ?  "'"+this.globalS.convertDbDate(group.get('end').value)+"'" : null;
        let unit              = this.globalS.isValueNull(group.get('unit').value);
        let payid             = this.globalS.isValueNull(group.get('payid').value);
        
        let casuals           = this.trueString(group.get('casuals').value);//AutoApprove
        let exportfrompay     = this.trueString(group.get('exportfrompay').value);//ExcludeFromPayExport
        

        let ExcludeFromConflicts        = this.trueString(group.get('conflict').value);//ExcludeFromConflicts
        let NoMonday                    = this.trueStringOposite(group.get('day1').value);
        let NoTuesday                   = this.trueStringOposite(group.get('day2').value);
        let NoWednesday                 = this.trueStringOposite(group.get('day3').value);
        let NoThursday                  = this.trueStringOposite(group.get('day4').value);
        let NoFriday                    = this.trueStringOposite(group.get('day5').value);
        let NoSaturday                  = this.trueStringOposite(group.get('day6').value);
        let NoSunday                    = this.trueStringOposite(group.get('day7').value);
        let NoPubHol                    = this.trueStringOposite(group.get('day0').value);
        let NoChangeDate                = this.trueString(group.get('rostedDay').value);//ExcludeFromInterpretation
        let NoChangeTime                = this.trueString(group.get('rostedTime').value);//ExcludeFromInterpretation
        // let ExcludeFromRecipSummarySheet = this.trueString(group.get('ExcludeFromRecipSummarySheet').value);//
        let ExcludeFromHigherPayCalculation    = this.trueString(group.get('award1').value);//ExcludeFromInterpretation
        let NoOvertimeAccumulation             = this.trueString(group.get('award2').value);//NoOvertimeAccumulation
        let PayAsRostered                      = this.trueString(group.get('award3').value);//ExcludeFromInterpretation
        let ExcludeFromTimebands               = this.trueString(group.get('award4').value);//ExcludeFromTimebands
        let ExcludeFromInterpretation          = this.trueString(group.get('award5').value);//ExcludeFromInterpretation
        // let ExcludeFromClientPortalDisplay     = this.trueString(group.get('ExcludeFromClientPortalDisplay').value);//
        let jobType                            = this.globalS.isValueNull(group.get('specialShift').value);//JobType
        let StartTimeLimit                     = this.globalS.isValueNull(group.get('startTimeLimit').value);//StartTimeLimit
        let EndTimeLimit                       = this.globalS.isValueNull(group.get('endTimeLimit').value);//EndTimeLimit
        let MinDurtn                           = this.globalS.isValueNull(group.get('min').value);//MinDurtn
        let MaxDurtn                           = this.globalS.isValueNull(group.get('max').value);//MaxDurtn
        let FixedTime                          = this.globalS.isValueNull(group.get('forceRostedTime').value);//FixedTime
        let TimeChangeLimit                    = this.globalS.isValueNull(group.get('orignalminute').value);//TimeChangeLimit
        
        let values = status+","+process+","+code+","+description+","+type+","+payrate+","+unit+","+payid
                     +","+mainGroup+","+subgroup+","+unitCostUom+","+casuals+","+exportfrompay+","+end+","+ExcludeFromConflicts+","+NoMonday
                     +","+NoTuesday+","+NoWednesday+","+NoThursday+","+NoFriday+","+NoSaturday+","+NoSunday+","+NoPubHol+","+NoChangeDate+","+NoChangeTime
                     +","+StartTimeLimit+","+EndTimeLimit+","+MinDurtn+","+MaxDurtn+","+FixedTime+","+TimeChangeLimit+","+jobType
                     +","+ExcludeFromHigherPayCalculation+","+NoOvertimeAccumulation+","+PayAsRostered+","+ExcludeFromTimebands+","+ExcludeFromInterpretation;
        let sqlz = "insert into itemtypes ([Status],[ProcessClassification],[Title],[billText],[RosterGroup],[Amount],[Unit],[AccountingIdentifier],"+
                   "[MainGroup],[MinorGroup],[UnitCostUOM],[AutoApprove],[ExcludeFromPayExport],[EndDate],[ExcludeFromConflicts],[NoMonday],[NoTuesday],[NoWednesday],"+
                   "[NoThursday],[NoFriday],[NoSaturday],[NoSunday],[NoPubHol],[NoChangeDate],[NoChangeTime],[StartTimeLimit],[EndTimeLimit],[MinDurtn],[MaxDurtn],[FixedTime],"+
                   "[TimeChangeLimit],[jobType],[ExcludeFromHigherPayCalculation],[NoOvertimeAccumulation],[PayAsRostered],[ExcludeFromTimebands],[ExcludeFromInterpretation])"+
                   "values("+values+");select @@IDENTITY"; 
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
      else{
        this.postLoading = true;

        const group = this.inputForm;
        let status            = "'NONATTRIBUTABLE'";
        let process           = "'INPUT'";
        let mainGroup         = "'DIRECT SERVICE'";

        let code              = this.globalS.isValueNull(group.get('code').value);
        let description       = this.globalS.isValueNull(group.get('description').value);
        let type              = this.globalS.isValueNull(group.get('type').value);
        let subgroup          = this.globalS.isValueNull(group.get('subgroup').value);
        let payrate           = this.globalS.isValueNull(group.get('payrate').value);
        let end               = !(this.globalS.isVarNull(group.get('end').value)) ?  "'"+this.globalS.convertDbDate(group.get('end').value)+"'" : null;
        let unit              = this.globalS.isValueNull(group.get('unit').value);
        let payid             = this.globalS.isValueNull(group.get('payid').value);

        let casuals           = this.trueString(group.get('casuals').value);//AutoApprove
        let exportfrompay     = this.trueString(group.get('exportfrompay').value);//ExcludeFromPayExport
        
        let ExcludeFromConflicts = this.trueString(group.get('conflict').value);//ExcludeFromConflicts
        let NoMonday                    = this.trueStringOposite(group.get('day1').value);
        let NoTuesday                   = this.trueStringOposite(group.get('day2').value);
        let NoWednesday                 = this.trueStringOposite(group.get('day3').value);
        let NoThursday                  = this.trueStringOposite(group.get('day4').value);
        let NoFriday                    = this.trueStringOposite(group.get('day5').value);
        let NoSaturday                  = this.trueStringOposite(group.get('day6').value);
        let NoSunday                    = this.trueStringOposite(group.get('day7').value);
        let NoPubHol                    = this.trueStringOposite(group.get('day0').value);
        let NoChangeDate                = this.trueString(group.get('rostedDay').value);//rostedDay
        let NoChangeTime                = this.trueString(group.get('rostedTime').value);//rostedTime
        // let ExcludeFromRecipSummarySheet = this.trueString(group.get('ExcludeFromRecipSummarySheet').value);//ExcludeFromConflicts
        let ExcludeFromHigherPayCalculation    = this.trueString(group.get('award1').value);//ExcludeFromInterpretation
        let NoOvertimeAccumulation             = this.trueString(group.get('award2').value);//NoOvertimeAccumulation
        let PayAsRostered                      = this.trueString(group.get('award3').value);//ExcludeFromInterpretation
        let ExcludeFromTimebands               = this.trueString(group.get('award4').value);//ExcludeFromTimebands
        let ExcludeFromInterpretation          = this.trueString(group.get('award5').value);//ExcludeFromInterpretation
        // let ExcludeFromClientPortalDisplay     = this.trueString(group.get('ExcludeFromClientPortalDisplay').value);//ExcludeFromConflicts
        let jobType                            = this.globalS.isValueNull(group.get('specialShift').value);//JobType
        let StartTimeLimit                     = this.globalS.isValueNull(group.get('startTimeLimit').value);//StartTimeLimit
        let EndTimeLimit                       = this.globalS.isValueNull(group.get('endTimeLimit').value);//EndTimeLimit
        let MinDurtn                           = this.globalS.isValueNull(group.get('min').value);//MinDurtn
        let MaxDurtn                           = this.globalS.isValueNull(group.get('max').value);//MaxDurtn
        let FixedTime                          = this.globalS.isValueNull(group.get('forceRostedTime').value);//FixedTime
        let TimeChangeLimit                    = this.globalS.isValueNull(group.get('orignalminute').value);//TimeChangeLimit
        let recordNumber      = group.get('recordNumber').value;

        let sql  = "Update itemtypes SET [Status]="+status+",[ProcessClassification]="+process+",[Title]="+code+",[billText]="+description+",[RosterGroup]="+type+
        ",[Amount]="+payrate+",[Unit]="+unit+",[AccountingIdentifier]="+payid+",[MainGroup]="+mainGroup+",[MinorGroup]="+subgroup+",[EndDate]="+end+",[AutoApprove]="+casuals+
        ",[ExcludeFromPayExport]="+exportfrompay+",[ExcludeFromConflicts]="+ExcludeFromConflicts+",[NoMonday]="+NoMonday+",[NoTuesday]="+NoTuesday+",[NoWednesday]="+NoWednesday+
        ",[NoThursday]="+NoThursday+",[NoFriday]="+NoFriday+",[NoSaturday]="+NoSaturday+",[NoSunday]="+NoSunday+",[NoPubHol]="+NoPubHol+",[NoChangeDate]="+NoChangeDate+
        ",[NoChangeTime]="+NoChangeTime+",[StartTimeLimit]="+StartTimeLimit+",[EndTimeLimit]="+EndTimeLimit+",[MinDurtn]="+MinDurtn+",[MaxDurtn]="+MaxDurtn+
        ",[FixedTime]="+FixedTime+",[TimeChangeLimit]="+TimeChangeLimit+",[jobType]="+jobType+
        ",[ExcludeFromHigherPayCalculation]="+ExcludeFromHigherPayCalculation+",[NoOvertimeAccumulation]="+NoOvertimeAccumulation+",[PayAsRostered]="+PayAsRostered+
        ",[ExcludeFromTimebands]="+ExcludeFromTimebands+",[ExcludeFromInterpretation]="+ExcludeFromInterpretation+" WHERE [Recnum] ='"+recordNumber+"'";
        // console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data){
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.loading = false;   
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          }else{
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
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "WHERE";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
        this.loadData();
      }
    }
    loadData(){
      this.paytypes  = ['SALARY','ALLOWANCE'];
      this.units  = ['HOUR','SERVICE'];
      this.subgroups  = ['NOT APPLICABLE','WORKED HOURS','PAID LEAVE','UNPAID LEAVE','N/C TRAVVEL BETWEEN','CHG TRAVVEL BETWEEN','N/C TRAVVEL WITHIN','CHG TRAVVEL WITHIN','OTHER ALLOWANCE'];
      this.timesteps = timeSteps;
      this.loading = true;
      this.menuS.GetlistagencyPayTypes().subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deletePayTypeslist(data.recordNumber)
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
        code:'',
        description:'',
        type: '',
        subgroup:'',
        payrate:'',
        unit:'',
        casuals:false,
        end:new Date(),
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
        min:0,
        max:0,
        forceRostedTime:0,
        rostedDay:false,
        rostedTime:false,
        orignalminute:0,
        award1:false,
        award2:false,
        award3:false,
        award4:false,
        award5:false,
        specialShift:'',
        branch:'',
        startTimeLimit:'',
        endTimeLimit:'',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [Title]) AS Field1,[title] AS [Field2], [rostergroup] AS [Field3], [minorgroup] AS [Field4], [amount] AS [Field5], [unit] AS [Field6],[accountingidentifier] AS [Field7],[paygroup] AS [Field8] FROM itemtypes WHERE processclassification = 'INPUT' AND ( enddate IS NULL OR enddate >= '04-05-2019' ) ORDER BY title";
      
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
          "txtTitle": "PayTypes List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Code",
          "head3" : "Pay Category",
          "head4" : "Sub Group",
          "head5" : "Amount",
          "head6" : "Unit",
          "head7" : "Pay ID",
          "head8" : "Pay Group",
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
  
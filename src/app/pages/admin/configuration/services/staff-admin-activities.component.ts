import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService,timeSteps } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


const inputFormDefault = {
    mainGroupList: ['STAFF ADMINISTRATION'],
    subGroupList : ['NOT APPLICABLE'],
    status       : ['NONATTRIBUTABLE'],
}

@Component({
  selector: 'app-staff-admin-activities',
  templateUrl: './staff-admin-activities.component.html',
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
export class StaffAdminActivitiesComponent implements OnInit {

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
  selectedMainGrouo:string = 'STAFF ADMINISTRATION';
  selectedsubGroup:string = 'NOT APPLICABLE';
  selectedStatus:string= 'NONATTRIBUTABLE';
  units:Array<any>;//populate dropdown
  mainGroupList:Array<any>;//populate dropdown
  subGroupList:Array<any>;//populate dropdown
  budgetGroupList:Array<any>;//populate dropdown
  lifeCycleList:Array<any>;//populate dropdown
  diciplineList:Array<any>;//populate dropdown
  ServiceData:Array<any>;
  items:Array<any>;
  jurisdiction:Array<any>;
  timesteps:Array<any>;
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
  title:string = "Add New Staff Admin Activities";
  tocken: any;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
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
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService,
    ){}
    
    
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;

      this.inputForm = this.formBuilder.group(inputFormDefault);

      this.checkedList = new Array<string>();
      this.loadData();
      this.buildForm();
      this.populateDropdowns();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Staff Admin Activities"
      this.resetModal();
      this.modalOpen = true;
    }
    log(value: string[]): void {
      // console.log(value);
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
      this.title = "Edit Staff Admin Activities"
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
        enddate,
        noPayExport,
        conflict,
        day0,
        day1,
        day2,
        day3,
        day4,
        day5,
        day6,
        day7,
        min,
        max,
        forceRostedTime,
        rostedDay,
        rostedTime,
        orignalminute,
        recordNumber,
      } = this.tableData[index];
      this.inputForm.patchValue({
        code:code,
        description:description,
        type:payCategory,
        subgroup:subGroup,
        payrate:payAmount,
        unit:payUnit,
        end:enddate,
        payid:payID,
        exportfrompay:noPayExport,
        casuals:'',
        conflict:conflict,
        day0:day0,
        day1:day1,
        day2:day2,
        day3:day3,
        day4:day4,
        day5:day5,
        day6:day6,
        day7:day7,
        min:min,
        max:max,
        forceRostedTime:forceRostedTime,
        rostedDay:rostedDay,
        rostedTime:rostedTime,
        orignalminute:orignalminute,
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
    showCompetencyModal(){
      this.competencymodal = true;
    }
    handleCompetencyCancel(){
      this.competencymodal = false;
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
    save() {
      if(!this.isUpdate){
        this.postLoading = true;
        const group = this.inputForm;
        
        let status            = "NONATTRIBUTABLE";
        let process           = "INPUT";
        let mainGroup         = "DIRECT SERVICE";
        let code              = group.get('code').value;
        let description       = group.get('description').value;
        let type              = group.get('type').value;
        let subgroup          = group.get('subgroup').value;
        let payrate           = group.get('payrate').value;
        let end               = this.globalS.convertDbDate(group.get('end').value);
        let unit              = group.get('unit').value;
        let payid             = group.get('payid').value;
        let casuals           = group.get('casuals').value;
        let exportfrompay     = group.get('exportfrompay').value;
        let conflict          = group.get('conflict').value;
        let day0              = group.get('day1').value;
        let day1              = group.get('day2').value;
        let day2              = group.get('day3').value;
        let day3              = group.get('day4').value;
        let day4              = group.get('day5').value;
        let day5              = group.get('day6').value;
        let day6              = group.get('day7').value;
        
        let values = status+"','"+process+"','"+code+"','"+description+"','"+type+"','"+payrate+"','"+unit+"','"+payid+"','"+mainGroup+"','"+subgroup+"','"+end;
        let sqlz = "insert into itemtypes ([Status],[ProcessClassification],[Title],[billText],[RosterGroup],[Amount],[Unit],[AccountingIdentifier],[MainGroup],[MinorGroup],[EndDate]) values('"+values+"');select @@IDENTITY"; 
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
        let status            = "NONATTRIBUTABLE";
        let process           = "INPUT";
        let mainGroup         = "DIRECT SERVICE";
        let code              = group.get('code').value;
        let description       = group.get('description').value;
        let type              = group.get('type').value;
        let subgroup          = group.get('subgroup').value;
        let payrate           = group.get('payrate').value;
        let end               = "" ; //  (group.get('end').value == '') ? '' : this.globalS.convertDbDate(group.get('end').value);
        let unit              = group.get('unit').value;
        let payid             = group.get('payid').value;
        let recordNumber      = group.get('recordNumber').value;
        
        let sql  = "Update itemtypes SET [Status]='"+ status + "',[ProcessClassification] = '"+ process + "',[Title] = '"+ code + "',[billText] = '"+ description+ "',[RosterGroup] = '"+ type + "',[Amount] = '"+ payrate + "',[Unit] = '"+ unit+ "',[AccountingIdentifier] = '"+ payid+ "',[MainGroup] = '"+ mainGroup + "',[MinorGroup] = '"+ subgroup + "' WHERE [Recnum] ='"+recordNumber+"'";
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
    loadData(){
      this.loading = true;
      this.menuS.GetlistStaffAdminActivities(this.check).subscribe(data => {
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

      this.mainGroupList  = ['STAFF ADMINISTRATION','TRAVEL TIME'];
      this.subGroupList   = ['GAP','GENERAL','LEAVE','BREAK','OTHER','TRAINING','NOT APPLICABLE'];
      this.status         = ['ATTRIBUTABLE','NONATTRIBUTABLE'];
      this.units          = ['HOUR','SERVICE'];
      let todayDate       = this.globalS.curreentDate();
      
      let sql ="SELECT * from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND EndDate is NULL OR EndDate >= Getdate() AND Domain = 'LIFECYCLEEVENTS'";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.lifeCycleList = data;
      });
      
      let sql3 ="SELECT * from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND EndDate is NULL OR EndDate >= Getdate() AND Domain = 'ADDRESSTYPE'";
      this.loading = true;
      this.listS.getlist(sql3).subscribe(data => {
        this.addressTypes = data;
      });
      let sql4 ="SELECT * from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND EndDate is NULL OR EndDate >= Getdate() AND Domain = 'CONTACTTYPE'";
      this.loading = true;
      this.listS.getlist(sql4).subscribe(data => {
        this.addressTypes = data;
      });
      let sql1 ="SELECT * from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND EndDate is NULL OR EndDate >= Getdate() AND Domain = 'BUDGETGROUP'";
      this.loading = true;
      this.listS.getlist(sql1).subscribe(data => {
        this.budgetGroupList = data;
      });
      
      let sql2 ="SELECT * from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND EndDate is NULL OR EndDate >= Getdate() AND Domain = 'DISCIPLINE'";
      this.loading = true;
      this.listS.getlist(sql1).subscribe(data => {
        this.diciplineList = data;
      });
      
      let comp = "SELECT Description as name from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND EndDate is NULL OR EndDate >= Getdate() AND Domain = 'STAFFATTRIBUTE' ORDER BY Description";
      this.listS.getlist(comp).subscribe(data => {
        this.competencyList = data;
        this.loading = false;
      });  
      
      let prog = "select distinct Name from HumanResourceTypes WHERE [GROUP]= 'PROGRAMS' AND ((EndDate IS NULL) OR (EndDate > Getdate()))";
      this.listS.getlist(prog).subscribe(data => {
        this.programz = data;
      });
      this.timesteps = timeSteps;
      this.mtaAlerts = ['No Alert','STAFF CASE MANAGER','RECIPIENT CASE MANAGER','BRANCH ROSTER EMAIL'];
      this.paytypes  = ['SALARY','ALLOWANCE'];
      this.subgroups  = ['NOT APPLICABLE','WORKED HOURS','PAID LEAVE','UNPAID LEAVE','N/C TRAVVEL BETWEEN','CHG TRAVVEL BETWEEN','N/C TRAVVEL WITHIN','CHG TRAVVEL WITHIN','OTHER ALLOWANCE'];
    }
    activateDomain(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activeDomain(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Activated!');
          this.loadData();
          return;
        }
      });
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
        AutoApprove:'',
        excludeFromAuto:'',
        Informational:'',
        datasetMapping:'',
        groupMapping:'',
        typeMapping:'',
        code:'',
        description:'',
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
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [Title]) AS Field1,[Title] As [Field2], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup END As [Field3],[MinorGroup] As [Field4],[HACCType] As [Field5],[DatasetGroup] As [Field6],  [NDIA_ID] As [Field7],[Amount] As [Field8],[Unit] As [Field9] FROM ItemTypes "+this.whereString+"  AND (RosterGroup IN ('ADMINISTRATION', 'TRAVELTIME')) ORDER BY Title";
      
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
          "txtTitle": "Staff Admin Activities List",
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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService,dataSetDropDowns,MenuService,PrintService,TimeSheetService,timeSteps } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


const inputFormDefault = {
  mainGroupList: ['ADMINISTRATION'],
  subGroupList : ['NOT APPLICABLE'],
  status       : ['NONATTRIBUTABLE'],
}

@Component({
  selector: 'app-staff-admin-activities',
  templateUrl: './staff-admin-activities.component.html',
  styles: [`
  .mrg-btm{
    margin-bottom:0.3rem;
  }
  textarea{
    resize:none;
  }
  nz-tabset{
    margin-top:1rem;
  }
  .ant-divider-horizontal.ant-divider-with-text-center, .ant-divider-horizontal.ant-divider-with-text-left, .ant-divider-horizontal.ant-divider-with-text-right {
    margin:1px 0
  }
  nz-tabset >>> div > div.ant-tabs-nav-container{
    height: 25px !important;
    font-size: 13px !important;
  }
  
  nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
    line-height: 24px;
    height: 25px;
    border-radius:15px 4px 0 0;
    margin:0 -10px 0 0;
  }
  nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
    background: #85B9D5;
    color: #fff;
  }
  .staff-wrapper{
    height: 20rem;
    width: 100%;
    overflow: auto;
    padding: .5rem 1rem;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
  }
  nz-select{
    width:100%
    min-width: 100%;
  }
  .ant-modal-header .ant-modal-title .ng-star-inserted"{
    width: 40%;
    margin: auto;
    background: #85b9d5;
    text-align: center;
    color: white;
    border-radius: 5px;
    padding: 5px;
  }
  .ant-modal-header {
    padding: 4px 24px !important;
  }
  legend + * {
    -webkit-margin-top-collapse: separate;
    margin-top: 10px;
  }
  .ant-tabs-bar{
    margin:0px
  } 
  #main-wrapper{
    border:1px solid #85B9D5;padding:10px 0px;min-height:28rem;
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
  datasetList:Array<any>;
  shiftTypes:Array<any>;
  mobileLogModes:{};
  selectedMainGrouo:string = 'ADMINISTRATION';
  selectedsubGroup:string = 'NOT APPLICABLE';
  selectedStatus:string= 'NONATTRIBUTABLE';
  units:Array<any>;//populate dropdown
  budgetUomList:Array<any>;//populate dropdown
  ndiaList:Array<any>;//populate dropdown
  mainGroupList:{};//populate dropdown
  subGroupList:Array<any>;//populate dropdown
  budgetGroupList:Array<any>;//populate dropdown
  lifeCycleList:Array<any>;//populate dropdown
  travelandAlernatelist:Array<any>;
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
  emptyList: any[];
  ndiaItems: any;
  selectedPrograms:any;
  competencyForm: FormGroup;
  chkListForm : FormGroup
  selectedCompetencies: any;
  parent_person_id: any;
  competencies: any;
  addOrEdit: number = 0;
  isNewRecord: boolean =  false;
  insertOne: number = 0;
  dataSetDropDowns: { CACP: string[]; CTP: string[]; DEX: string[]; DFC: string[]; DVA: any[]; HACC: string[]; HAS: string[]; QCSS: string[]; ICTD: string[]; NDIS: any[]; NRCP: string[]; NRCPSAR: string[]; OTHER: string[]; };
  dataset_group: any;
  chklstmodal: boolean;
  selectedChklst: any[];
  chkList: any;
  checkList: any;
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private timeS:TimeSheetService,
    private printS:PrintService,
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
      this.dataSetDropDowns = dataSetDropDowns;
      this.loadData();
      this.buildForm();
      this.populateDropdowns();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Staff Admin Activities"
      this.inputForm.patchValue({
        rosterGroup :'ADMINISTRATION',
        minorGroup  :'NOT APPLICABLE',
        status      :'NONATTRIBUTABLE',
        unit        :'HOUR',
        minChargeRate :'$0.0000',
        amount:0.0,
        minDurtn    :0,
        maxDurtn    :0,
        fixedTime   :0,
        price2:0.0,
        price3:0.0,
        price4:0.0,
        price5:0.0,
        price6:0.0,
      });
      
      this.modalOpen = true;
    }
    
    log(event: any) {
      this.selectedPrograms = event;
    }
    
    logs(event: any) {
      this.selectedCompetencies = event;
    }
    chklog(event: any) {
      this.selectedChklst = event;
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
      this.inputForm.patchValue(this.tableData[index-1]); 
      this.parent_person_id = this.tableData[index-1].recnum; //set person id for programs and competencies and checklist
    }
    
    handleCancel() {
      this.isUpdate = false;
      this.resetModal();
      this.modalOpen = false;
    }
    handleCompCancel() {
      this.addOrEdit = 0;
      this.competencymodal = false;
    }
    handleChkLstCancel(){
      this.addOrEdit = 0;
      this.chklstmodal = false;
    }
    handleAprfCancel(){
      this.staffApproved = false;
    }
    handleUnAprfCancel(){
      this.staffUnApproved = false;
    }
    showCompetencyModal(){
      if(this.globalS.isEmpty(this.inputForm.get('title').value) 
      || this.globalS.isEmpty(this.inputForm.get('iT_Dataset').value)
      || this.globalS.isEmpty(this.inputForm.get('datasetGroup').value)
      )
      {
        this.globalS.iToast('Info','can not create this record beacuse there are blank entries');  
        return;
      }
      this.addOrEdit = 0;
      this.competencymodal = true;
      this.clearCompetency();
    }
    showChkLstModal(){
      if(this.globalS.isEmpty(this.inputForm.get('title').value) 
      || this.globalS.isEmpty(this.inputForm.get('iT_Dataset').value)
      || this.globalS.isEmpty(this.inputForm.get('datasetGroup').value)
      )
      {
        this.globalS.iToast('Info','can not create this record beacuse there are blank entries');  
        return;
      }
      this.addOrEdit = 0;
      this.chklstmodal = true;
      this.clearChkList();
    }
    handleCompetencyCancel(){
      this.competencymodal = false;
      this.addOrEdit = 0;
    }
    trueString(data: any): string{
      return data ? '1': '0';
    }
    
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    // onIndexChange(index: number): void {
    //   // if(this.isUpdate)
    //   // {
    //     if(index == 7){
    //       this.loadCompetency();
    //     }
    //     if(index == 8){
    //       this.loadChecklist();
    //     }
    //   // }
    //   this.current = index;
    // }
    
    view(index: number){
      if(index == 7){
        this.loadCompetency();
      }
      if(index == 8){
        this.loadChecklist();
      }
      this.current = index;
    }
    save() {
      this.loading = true;
      if(!this.isUpdate){
        this.menuS.poststaffAdminActivities(this.inputForm.value)
        .subscribe(data => {
          this.globalS.sToast('Success', 'Added Succesfully');
          this.loading = false;
          this.handleCancel();
          this.loadData()
        });
      }else{
        this.menuS.updatestaffAdminActivities(this.inputForm.value)
        .subscribe(data => {
          this.globalS.sToast('success','Updated Successfuly');
          this.loading = false;
          this.handleCancel();
          this.loadData();
        });
        this.loading = false;
      }
    }
    saveCompetency(){
      this.postLoading = true;
      const group = this.competencyForm.value;
      this.insertOne = 0;
      if(this.addOrEdit == 0){
        if(!this.isUpdate){
          if(!this.isNewRecord){
            this.save();
          }
        }
        var checkedcompetency = this.selectedCompetencies;
        checkedcompetency.forEach( (element) => {
          this.menuS.postconfigurationservicescompetency({
            competencyValue:element,
            notes:this.competencyForm.value.notes,
            personID:this.parent_person_id,
          }).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
              this.insertOne = 1;
            })
          });
          
          this.globalS.sToast('Success', 'Competency Added');
          this.postLoading = false;
          this.loadCompetency();
          this.handleCompCancel();
          return false;
        }
        else
        {
          this.menuS.updateconfigurationservicescompetency({
            competencyValue:group.competencyValue,
            mandatory:group.mandatory,
            recordNumber:group.recordNumber,
          }).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
              if(data){
                this.globalS.sToast('Success','Competency Updated')
                this.postLoading = false;
                this.loadCompetency();
                this.handleCompCancel();
                return false;
              }
            });
          }
        }
        saveCheckList(){
          this.postLoading = true;
          const group = this.chkListForm.value;
          this.insertOne = 0;
          if(this.addOrEdit == 0){
            if(!this.isUpdate){
              if(!this.isNewRecord){
                this.save();
              }
            }
            var checklists = this.selectedChklst;
            checklists.forEach( (element) => {
              this.menuS.postconfigurationserviceschecklist({
                competencyValue:element,
                personID:this.parent_person_id,
              }).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                  this.insertOne = 1;
                })
              });
              
              this.globalS.sToast('Success', 'CheckList Added');
              this.postLoading = false;
              this.loadChecklist();
              this.handleChkLstCancel();
              return false;
            }
            else
            {
              this.menuS.updateconfigurationserviceschecklist({
                competencyValue:group.chkListValue,
                recordNumber:group.recordNumber,
              }).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                  if(data){
                    this.globalS.sToast('Success','CheckList Updated')
                    this.postLoading = false;
                    this.loadChecklist();
                    this.handleChkLstCancel();
                    return false;
                  }
                });
              }
            }
            
            clearCompetency(){
              this.competencyList.forEach(x => {
                x.checked = false
              });
              this.selectedCompetencies = [];
            }
            clearChkList(){
              this.chkList.forEach(x => {
                x.checked = false
              });
              this.selectedChklst = [];
            }
            editCompetencyModal(data:any){
              this.addOrEdit = 1;
              this.competencyForm.patchValue({
                competencyValue : data.competency,
                mandatory : data.mandatory,
                recordNumber:data.recordNumber,
              })
              this.competencymodal = true;
            }
            deleteCompetency(data:any){
              this.loading = true;
              this.menuS.deleteconfigurationservicescompetency(data.recordNumber)
              .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                  this.globalS.sToast('Success', 'Data Deleted!');
                  this.loadCompetency();
                  return;
                }
              });
            }
            editChecklistModal(data:any){
              this.addOrEdit = 1;
              this.chkListForm.patchValue({
                chkListValue : data.checklist,
                recordNumber:data.recordNumber,
              })
              this.chklstmodal = true;
            }
            deleteChecklist(data:any){
              this.loading = true;
              this.menuS.deleteconfigurationserviceschecklist(data.recordNumber)
              .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                  this.globalS.sToast('Success', 'Data Deleted!');
                  this.loadChecklist();
                  return;
                }
              });
            }
            loadData(){
              this.loading = true;
              this.menuS.GetlistStaffAdminActivities(this.check).subscribe(data => {
                this.tableData = data;
                this.loading = false;
                this.cd.detectChanges();
              });
            }
            loadCompetency(){
              this.menuS.getconfigurationservicescompetency(this.parent_person_id).subscribe(data => {
                this.checkedList = data;
                this.loading = false;
                this.cd.detectChanges();
              });
            }
            loadChecklist(){
              this.menuS.getconfigurationserviceschecklist(this.parent_person_id).subscribe(data => {
                this.checkList = data;
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
            
            clearPrograms(){
              this.programz.forEach(x => {
                x.checked = false
              });
              this.selectedPrograms = [];
            }
            selectProgram(){
              this.programz.forEach(x => {
                x.checked = true;
                this.selectedPrograms = x.name;
              });
              console.log("programs : " + this.selectedPrograms);
            }
            
            populateDropdowns(): void {
              
              this.emptyList      = [];
              this.mainGroupList  = {"ADMINISTRATION":"STAFF ADMINISTRATION","TRAVELTIME":"TRAVEL TIME"};
              this.subGroupList   = ['GAP','GENERAL','LEAVE','BREAK','OTHER','STAFF ONBOARDING','TRAINING','NOT APPLICABLE'];
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
              
              this.listS.GettravelandAlternateCode().subscribe(data => {
                this.travelandAlernatelist = data;
              })
              
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
              let sql1 ="SELECT distinct Description from DataDomains Where  Domain = 'BUDGETGROUP' AND ((EndDate IS NULL) OR (EndDate > Getdate()))";
              this.loading = true;
              this.listS.getlist(sql1).subscribe(data => {
                this.budgetGroupList = data;
              });
              
              let sql2 ="SELECT distinct Description from DataDomains Where  Domain = 'DISCIPLINE' AND ((EndDate IS NULL) OR (EndDate > Getdate()))";
              this.loading = true;
              this.listS.getlist(sql2).subscribe(data => {
                this.diciplineList = data;
              });
              
              let comp = "SELECT distinct Description as name from DataDomains Where  Domain = 'STAFFATTRIBUTE' AND ((EndDate IS NULL) OR (EndDate > Getdate())) ORDER BY Description";
              this.listS.getlist(comp).subscribe(data => {
                this.competencyList = data;
                this.loading = false;
              });  
              let chk = "SELECT distinct Description as name from DataDomains Where  Domain = 'CHECKLIST' AND ((EndDate IS NULL) OR (EndDate > Getdate())) ORDER BY Description";
              this.listS.getlist(chk).subscribe(data => {
                this.chkList = data;
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
            activateDomain(data: any) {
              this.postLoading = true;     
              const group = this.inputForm;
              this.menuS.activeDomain(data.recnum)
              .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                  this.globalS.sToast('Success', 'Data Activated!');
                  this.loadData();
                  return;
                }
              });
            }
            delete(data: any) {
              console.log(data);
              this.postLoading = true;     
              const group = this.inputForm;
              this.menuS.deleteActivityServiceslist(data.recnum)
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
                dataSet:'',
                datasetGroup:'',
                haccType:'',
                title:'',
                billText:'',
                processClassification:'OUTPUT',
                rosterGroup:'',
                minorGroup:'',
                status:'',
                amount:0.0,
                minChargeRate:'',
                lifecycle:'',
                unit:'',
                budgetGroup:'',
                iT_Dataset:'',
                colorCode:'',
                autoApprove:false,
                excludeFromAutoLeave:false,
                infoOnly:false,
                groupMapping:'',
                NDIA_ID:'',
                ndiA_ID:'',
                accountingIdentifier:'',
                glRevenue:'',
                job:'',
                glCost:'',
                unitCostUOM:'',
                unitCost:'',
                price2:0.0,
                price3:0.0,
                price4:0.0,
                price5:0.0,
                price6:0.0,
                excludeFromPayExport:false,
                excludeFromUsageStatements:false,
                endDate:'',
                excludeFromConflicts:false,
                noMonday   : false,//day1
                noTuesday  : false,//day2
                noWednesday: false,//day3
                noThursday : false,//day4
                noFriday   : false,//day5
                noSaturday : false,//day6
                noSunday   : false,//day7
                noPubHol   : false,//day0
                startTimeLimit:'',
                endTimeLimit:'',
                maxDurtn:0,
                minDurtn:0,
                fixedTime:0,
                noChangeDate:false,
                noChangeTime:false,
                timeChangeLimit:0,
                defaultAddress:'',
                defaultPhone:'',
                autoActivityNotes:false,
                autoRecipientDetails:false,
                jobSheetPrompt:false,
                activityNotes:'',
                excludeFromHigherPayCalculation:false,
                noOvertimeAccumulation:false,
                payAsRostered:false,
                excludeFromTimebands:false,
                excludeFromInterpretation:false,
                jobType:'',
                mtacode:'',
                tA_LOGINMODE:'',
                excludeFromClientPortalDisplay: false,
                excludeFromTravelCalc: false,
                tA_EXCLUDEGEOLOCATION:false,
                appExclude1:false,
                taexclude1:false,
                taEarlyStartTHEmail:false,
                taLateStartTHEmail:false,
                taEarlyStartTH:'',
                taLateStartTH:'',
                taEarlyStartTHWho:'',
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
                ndiaClaimType:"",
                ndiaPriceType:"",
                ndiaTravel:false,
                DeletedRecord:false,
                excludeFromRecipSummarySheet:false,
                ExcludeFromMinHoursCalculation:false,
                OnSpecial:false,
                Discountable:false,
                ndiA_LEVEL2:'',
                ndiA_LEVEL3:'',
                ndiA_LEVEL4:'',
                ALT_PHActivityCode:'',
                PHAction:'',
                recnum:0, 
              });  
              this.competencyForm = this.formBuilder.group({
                competencyValue: '',
                mandatory: false,
                notes: '',
                personID: this.parent_person_id,
                recordNumber: 0
              });
              this.chkListForm = this.formBuilder.group({
                chkListValue: '',
                mandatory: false,
                notes: '',
                personID: this.parent_person_id,
                recordNumber: 0
              })
              this.inputForm.get('iT_Dataset').valueChanges.subscribe(x => {
                this.dataset_group = [];  
                this.dataset_group = this.dataSetDropDowns[x];
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
              var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [Title]) AS Field1,[Title] As [Field2], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup END As [Field3],[MinorGroup] As [Field4],[HACCType] As [Field5],[DatasetGroup] As [Field6],  [NDIA_ID] As [Field7],[Amount] As [Field8],[Unit] As [Field9] FROM ItemTypes "+this.whereString+" (RosterGroup IN ('ADMINISTRATION', 'TRAVELTIME')) ORDER BY Title";
              
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
              this.printS.printControl(data).subscribe((blob: any) => { 
                let _blob: Blob = blob;
                let fileURL = URL.createObjectURL(_blob);
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;
              }, err => {
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
          
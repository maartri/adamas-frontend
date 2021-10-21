import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService,PrintService,timeSteps } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-case-mangement-admin',
  templateUrl: './case-mangement-admin.component.html',
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
export class CaseMangementAdminComponent implements OnInit {
  
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
  current: number = 0;
  checkedflag:boolean = true;
  dateFormat: string = 'dd/MM/yyyy';
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any; 
  postLoading: boolean = false;
  check : boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Case Management / Client Admin";
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
  emptyList: any[];
  ndiaItems: any;
  selectedPrograms: any;
  selectedCompetencies: any;
  competencyForm: FormGroup;
  parent_person_id: any;
  addOrEdit: number = 0;
  isNewRecord: any;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private printS:PrintService,
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
      this.title = "Add New Case Management / Client Admin"
      this.resetModal();
      this.inputForm.patchValue({
        rosterGroup :'RECIPIENT ADMINISTRATION',
        minorGroup  :'REFERRAL-IN',
        status    :'ATTRIBUTABLE',
        unit      :'HOUR',
        minDurtn       :'0',
        maxDurtn       :'0',
        fixedTime:'0',
        amount:'$0.0000',
        minChargeRate:'$0.0000',
        price2:'$0.0000',
        price3:'$0.0000',
        price4:'$0.0000',
        price5:'$0.0000',
        price6:'$0.0000',
      });
      this.modalOpen = true;
    }
    logs(event: any) {
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
      this.title = "Edit Case Management / Client Admin"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      this.inputForm.patchValue(this.tableData[index-1]);
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
      this.addOrEdit = 0;
      this.competencymodal = true;
      this.clearCompetency();
    }
    handleCompetencyCancel(){
      this.addOrEdit = 0;
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
    next(): void {
      this.current += 1;
    }
    save() {
      if(!this.isUpdate){
        this.menuS.postcaseManagement(this.inputForm.value)
        .subscribe(data => {
          this.globalS.sToast('Success', 'Added Succesfully');
        });
      }else{
        
      }
    }
    saveCompetency(){
      this.postLoading = true;
      const group = this.competencyForm.value;
      let insertOne = false;
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
              if(data)
              {
                insertOne = true;
              }
            })
            this.globalS.sToast('Success', 'Competency Added');
            this.loadCompetency();
            this.postLoading = false;
            this.handleCompCancel();
          });
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
        clearCompetency(){
          this.competencyList.forEach(x => {
            x.checked = false
          });
          this.selectedCompetencies = [];
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
        loadData(){
          this.loading = true;
          this.menuS.GetlistcaseManagement(this.check).subscribe(data => {
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
        fetchAll(e){
          if(e.target.checked){
            this.whereString = "WHERE ProcessClassification <> 'INPUT' ";
            this.loadData();
          }else{
            this.whereString = "WHERE ProcessClassification <> 'INPUT' AND ISNULL(DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE())";
            this.loadData();
          }
        }
        
        populateDropdowns(): void {
          
          this.emptyList      = [];
          this.mainGroupList  = ['RECIPIENT ADMINISTRATION','TRAVEL TIME','RECIPIENT ABSENCE'];
          //this.subGroupList   = ['FULL DAY-RESPITE','FULL DAY-HOSPITAL','FULL DAY-TRANSITION','FULL DAY-SOCIAL LEAVE','ALTERNATIVE','HOSPITAL','OTHER','TRANSITION'];
          this.subGroupList   = ['REFERRAL-IN','REFERRAL-OUT','ASSESSMENT','ADMISSION','REVIEW','DISCHARGE','DATA UPDATE','FEE','NOT PROCEEDING','OTHER','NOT APPLICABLE','REVIEW','INQUIRY','ADMISSION','DATA UPDATE']
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
            dataSet:'',
            datasetGroup:'',
            haccType:'',
            title:'',
            billText:'',
            processClassification:'OUTPUT',
            rosterGroup:'',
            minorGroup:'',
            status:'',
            amount:'',
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
            price2:'',
            price3:'',
            price4:'',
            price5:'',
            price6:'',
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
            ndiA_LEVEL2:'',
            ndiA_LEVEL3:'',
            ndiA_LEVEL4:'',
          });
          this.competencyForm = this.formBuilder.group({
            competencyValue: '',
            mandatory: false,
            notes: '',
            personID: this.parent_person_id,
            recordNumber: 0
          });
        }
        handleOkTop() {
          this.generatePdf();
          this.tryDoctype = ""
          this.pdfTitle = ""
        }
        onIndexChange(index: number): void {
          this.current = index;
        }
        handleCancelTop(): void {
          this.drawerVisible = false;
          this.pdfTitle = ""
        }
        generatePdf(){
          this.drawerVisible = true;
          
          this.loading = true;
          
          var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [Title]) AS Field1,[Title] As [Field2], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup END As [Field3],[MinorGroup] As [Field4],[HACCType] As [Field5],[DatasetGroup] As [Field6],  [NDIA_ID] As [Field7],[Amount] As [Field8],[Unit] As [Field9] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '12-22-2020')  AND (RosterGroup IN ('ITEM')) ORDER BY Title";
          
          const data = {
            "template": { "_id": "0RYYxAkMCftBE9jc" },
            "options": {
              "reports": { "save": false },
              "txtTitle": "Case Management / Client Admin List",
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

          this.printS.print(data).subscribe(blob => {  
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
      
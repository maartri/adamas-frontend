import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService, TimeSheetService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject,forkJoin,timer,interval } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-centr-facility-location',
  templateUrl: './centr-facility-location.component.html',
  styles: [`
  .ant-modal-body {
    padding: 0px 24px !important;
  }
  .mrg-btm{
    margin-bottom:5px !important;
  }
  textarea{
    resize:none;
  },
  `]
})
export class CentrFacilityLocationComponent implements OnInit {
  
  tableData: Array<any>;
  branches:Array<any>;
  ServiceData:Array<any>;
  items:Array<any>;
  serviceType:Array<any>;
  staffList:Array<any>;
  agencySector:Array<any>;
  numbers:Array<any>;
  fundTypes:Array<any>;
  competencyList:Array<any>;
  jurisdiction:Array<any>;
  checkedList:string[];
  checkedListExcluded:string[];
  checkedListApproved:string[];
  packedTypeProfile:Array<any>;
  
  loading: boolean = false;
  modalOpen: boolean = false;
  staffApproved: boolean = false;
  staffUnApproved: boolean = false;
  competencymodal: boolean = false;
  current: number = 0;
  disabled:boolean = false;
  checkedflag:boolean = true;
  checkedStaff:boolean = false;
  checkedUnapprStaff:boolean = false;
  checkedcompetency:boolean = false;
  dateFormat: string = 'dd/MM/yyyy';
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any; 
  postLoading: boolean = false;
  isUpdate: boolean = false;
  isNewRecord: boolean = false;
  check: boolean = false;
  title:string = "Add New Facility/Location";
  whereString :string="Where ISNULL(xDeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE())";
  inputValue: string = 'NEW OUTLET';
  private unsubscribe: Subject<void> = new Subject();
  tocken: any;
  userRole:string="userrole";
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  center_perosn_id: string = '-1';
  excludedStaff: unknown;
  listStaff: unknown;
  includedStaff: any;
  competencies: any;
  categoryList: any;
  addOrEdit: number = 0;
  staffForm: FormGroup;
  competencyForm: FormGroup;
  competencyGroup: FormGroup;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private timeS: TimeSheetService,
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
      this.loadData();
      this.buildForm();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Facility/Location"
      this.resetModal();
      this.modalOpen = true;
    }
    
    showstaffModal(stafftype:number){
      if(stafftype == 1){
        this.staffApproved = true;
        this.addOrEdit     = 0;  
      }else{
        this.staffUnApproved = true;
        this.addOrEdit     = 0;  
      }
    }
    staffEditModal(stafftype:number,data:any){
      
      
      this.staffForm.patchValue({
        staffTitle : data.name,
        notes : data.notes,
        recordNumber:data.recordNumber
      })
      if(stafftype == 1){
        this.addOrEdit     = 1;
        this.staffApproved = true;
      }
      else
      {
        this.addOrEdit     = 1;
        this.staffUnApproved = true;
      }
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
    log(value: string[]): void {
      // console.log(value);
    }
    showEditModal(index: any) {
      this.title = "Edit New Facility/Location"
      this.isUpdate = true;
      this.isNewRecord = false;
      this.current = 0;
      this.modalOpen = true;
      const { 
        aH_EarlyFinish,
        aH_EarlyStart,
        aH_LateFinish,
        aH_LateStart,
        aH_OverStay,
        aH_UndrStay,
        address,
        agencySector,
        bH_EarlyFinish,
        bH_EarlyStart,
        bH_LateFinish,
        bH_LateStart,
        bH_NoWork,
        bH_OverStay,
        bH_UndrStay,
        branch,
        cstda,
        cstdaServiceType,
        cstdasla,
        daysPerWeek,
        daysPerWeekOfOperation_NoPattern,
        dcsi,
        postcode,
        fundingSource,
        fundingType,
        glCost,
        glOverride,
        glRevenue,
        hour,
        hoursPerDayOfOperation_NoPattern,
        jurisdiction,
        maxWeeklyRecipientHours,
        maxWeeklyStaffHours,
        minWeeklyRecipientHours,
        minWeeklyStaffHours,
        name,
        noServiceUsers,
        places,
        recordNumber,
        runsheetAlerts,
        serviceAnnualHours,
        serviceOutletID,
        suburb,
        weeksPerCollectionPeriodOfOperation_NoPattern,
        weeksPerYear,
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        branch : branch,
        adress : address,
        subrub : suburb,
        sla    : cstdasla,
        postcode:postcode,
        dsci:(dcsi) ? true : false,
        fundingType:fundingType,
        cstdaoutlet:(cstda) ? true : false,
        glRevene:glRevenue,
        glCost:glCost,
        gloveride:(glOverride) ? true : false,
        name : name,
        fundingjunc:jurisdiction,
        fundingtype:fundingType,
        servicetype:cstdaServiceType,
        outletid : serviceOutletID,
        agencysector:agencySector,
        earlyStart:bH_EarlyStart,  
        lateStart:bH_LateStart,    
        earlyFinish:bH_EarlyFinish, 
        lateFinish:bH_LateFinish,
        overstay:bH_OverStay,           
        understay:bH_UndrStay,
        t2earlyStart:aH_EarlyStart,   
        t2lateStart:aH_LateStart,
        t2earlyFinish:aH_EarlyFinish,
        t2lateFinish:aH_LateFinish,       
        t2overstay:aH_OverStay,         
        t2understay:aH_UndrStay,       
        sheetalert:runsheetAlerts,
        places:places,
        minUserWeek:minWeeklyRecipientHours,
        maxUserWeek:maxWeeklyRecipientHours,
        minStaffHour:minWeeklyStaffHours,
        maxStaffHour:maxWeeklyStaffHours,
        week:weeksPerYear,
        day:daysPerWeek,
        hour:parseInt(hour, 10),//hoursPerDay,    
        hourPatern:(hoursPerDayOfOperation_NoPattern) ? true : false,
        dayPatern: (daysPerWeekOfOperation_NoPattern) ? true : false,
        weekPatern:(weeksPerCollectionPeriodOfOperation_NoPattern) ? true : false,
        serviceUsers:noServiceUsers,       
        anualhours:serviceAnnualHours,
        recordNumber:recordNumber,
      });
    }
    
    handleCancel() {
      this.modalOpen = false;
      this.isUpdate = false;
      this.isNewRecord = false;
      this.addOrEdit = 0;
      this.loadData();
    }
    handleCompCancel() {
      this.competencymodal = false;
      this.isUpdate = false;
      this.isNewRecord = false;
      this.addOrEdit = 0;
    }
    handleAprfCancel(){
      this.staffApproved = false;
    }
    handleUnAprfCancel(){
      this.staffUnApproved = false;
    }
    onIndexChange(index: number): void {
      this.current = index;
      if(this.current == 2 || this.current == 3){
        const validateForm = this.inputForm ;
        let fundingSource =  this.globalS.isValueNull(validateForm.get('branch').value);
        let title         =  this.globalS.isValueNull(validateForm.get('name').value);
        if(this.globalS.isVarNull(fundingSource) || this.globalS.isVarNull(title)){
          this.globalS.iToast('Alert', 'Please Add Branch and Name First !');
          this.current = 0; 
        }
      }
      if(this.current == 2 || this.current == 3){
        if(this.center_perosn_id != '-1')
           this.staffDetails(this.center_perosn_id);
      }
    }
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){
        const group = this.inputForm;
        let branch             = this.globalS.isValueNull(group.get('branch').value);
        let adress             = this.globalS.isValueNull(group.get('adress').value);
        let subrub             = this.globalS.isValueNull(group.get('subrub').value);
        let sla                = this.globalS.isValueNull(group.get('sla').value);
        let name               = this.globalS.isValueNull(group.get('name').value.trim().toUpperCase());
        let outletid           = this.globalS.isValueNull(group.get('outletid').value);
        let postcode           = this.globalS.isValueNull(group.get('postcode').value);
        
        let jurisdiction       = this.globalS.isValueNull(group.get('fundingjunc').value);
        let agencysector       = this.globalS.isValueNull(group.get('agencysector').value);
        let fundingtype        = this.globalS.isValueNull(group.get('fundingtype').value);
        let weeksYear          = this.globalS.isValueNull(group.get('week').value);
        let dayweeks           = this.globalS.isValueNull(group.get('day').value);
        let hourYears          = this.globalS.isValueNull(group.get('hour').value);
        let serviceUsers       = this.globalS.isValueNull(group.get('serviceUsers').value);
        let anualhours         = this.globalS.isValueNull(group.get('anualhours').value);
        let servicetype        = this.globalS.isValueNull(group.get('servicetype').value);
        
        let hourPatern         = this.trueString(group.get('hourPatern').value);
        let dayPatern          = this.trueString(group.get('dayPatern').value);
        let weekPatern         = this.trueString(group.get('weekPatern').value);
        let gloveride          = this.trueString(group.get('gloveride').value);
        let cstdaoutlet        = this.trueString(group.get('cstdaoutlet').value);
        let dsci               = this.trueString(group.get('dsci').value);
        
        let maxUserWeek        = this.globalS.isValueNull(group.get('maxUserWeek').value);
        let minUserWeek        = this.globalS.isValueNull(group.get('minUserWeek').value);
        let maxStaffHour       = this.globalS.isValueNull(group.get('maxStaffHour').value);
        let minStaffHour       = this.globalS.isValueNull(group.get('minStaffHour').value);
        let glrevenue          = this.globalS.isValueNull(group.get('glRevene').value);
        let glcost             = this.globalS.isValueNull(group.get('glCost').value);
        let places             = this.globalS.isValueNull(group.get('places').value);
        
        let earlyStart         = this.globalS.isValueNull(group.get('earlyStart').value);
        let lateStart          = this.globalS.isValueNull(group.get('lateStart').value);
        let earlyFinish        = this.globalS.isValueNull(group.get('earlyFinish').value);
        let lateFinish         = this.globalS.isValueNull(group.get('lateFinish').value);
        let overstay           = this.globalS.isValueNull(group.get('overstay').value);
        let understay          = this.globalS.isValueNull(group.get('understay').value);
        
        let t2earlyStart       = this.globalS.isValueNull(group.get('t2earlyStart').value);
        let t2lateStart        = this.globalS.isValueNull(group.get('t2lateStart').value);
        let t2earlyFinish      = this.globalS.isValueNull(group.get('t2earlyFinish').value);
        let t2lateFinish       = this.globalS.isValueNull(group.get('t2lateFinish').value);
        let t2overstay         = this.globalS.isValueNull(group.get('t2overstay').value);
        let t2understay        = this.globalS.isValueNull(group.get('t2understay').value);
        
        let sheetalert         = this.globalS.isValueNull(group.get('sheetalert').value);
        
        let vari               = (jurisdiction == 'FEDERAL') ? "'93'" : "'13'";
        
        let values = jurisdiction+","+vari+","+agencysector+","+weeksYear+","+dayweeks+","+hourYears+","+serviceUsers+","+servicetype+","+anualhours+","+weekPatern+","+dayPatern+","+hourPatern+","+maxUserWeek+","+minUserWeek+","+maxStaffHour+","+minStaffHour+","+glrevenue+","+glcost+","+gloveride+","+cstdaoutlet+","+dsci+","+branch+","+places+","+earlyStart+","+lateStart+","+earlyFinish+","+lateFinish+","+overstay+","+understay+","+t2earlyStart+","+t2lateStart+","+t2earlyFinish+","+t2lateFinish+","+t2overstay+","+t2understay+","+fundingtype+","+sheetalert+","+name+","+outletid+","+postcode+","+adress+","+subrub+","+sla;
        let sqlz = "insert into CSTDAOutlets ([FundingSource],[Jurisdiction],[AgencySector],[WeeksPerYear],[DaysPerWeek],[HoursPerDay],[NoServiceUsers],[CSTDAServiceType],[ServiceAnnualHours],[WeeksPerCollectionPeriodOfOperation_NoPattern],[DaysPerWeekOfOperation_NoPattern],[HoursPerDayOfOperation_NoPattern],[MAXWeeklyRecipientHours],[MINWeeklyRecipientHours],[MAXWeeklyStaffHours],[MINWeeklyStaffHours],[GLRevenue],[GLCost],[GLOverride],[CSTDA],[DCSI],[Branch],[Places],[BH_EarlyStart],[BH_LateStart],[BH_EarlyFinish],[BH_LateFinish],[BH_OverStay],[BH_UndrStay],[AH_EarlyStart],[AH_LateStart],[AH_EarlyFinish],[AH_LateFinish],[AH_OverStay],[AH_UndrStay],[FundingType],[RunsheetAlerts],[Name],[ServiceOutletID],[Postcode],[AddressLine1],[Suburb],[CSTDASLA]) values("+values+");select @@IDENTITY"; 
        
        
        this.menuS.InsertDomain(sqlz).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data){
            this.globalS.sToast('Success', 'Saved successful');
            this.center_perosn_id = data;
            this.postLoading = false;   
            this.loading = false;
            this.isUpdate = true;
            this.isNewRecord = true;
          }
          else{
            this.globalS.sToast('Success', 'Saved successful');
            this.center_perosn_id = data;
            this.postLoading = false;
            this.loading = false;
            this.isUpdate = true;
            this.isNewRecord = true;
          }
        });
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
        
        let branch             = this.globalS.isValueNull(group.get('branch').value);
        let adress             = this.globalS.isValueNull(group.get('adress').value);
        let subrub             = this.globalS.isValueNull(group.get('subrub').value);
        let sla                = this.globalS.isValueNull(group.get('sla').value);
        let name               = this.globalS.isValueNull(group.get('name').value.trim().toUpperCase());
        let outletid           = this.globalS.isValueNull(group.get('outletid').value);
        let postcode           = this.globalS.isValueNull(group.get('postcode').value);
        let jurisdiction       = this.globalS.isValueNull(group.get('fundingjunc').value);
        let agencysector       = this.globalS.isValueNull( group.get('agencysector').value);
        let fundingtype        = this.globalS.isValueNull(group.get('fundingtype').value);
        let weeksYear          = this.globalS.isValueNull(group.get('week').value);
        let dayweeks           = this.globalS.isValueNull(group.get('day').value);
        let hourYears          = this.globalS.isValueNull(group.get('hour').value);
        let serviceUsers       = this.globalS.isValueNull(group.get('serviceUsers').value);
        let anualhours         = this.globalS.isValueNull(group.get('anualhours').value);
        let servicetype        = this.globalS.isValueNull(group.get('servicetype').value);
        
        let hourPatern         = this.trueString(group.get('hourPatern').value);
        let dayPatern          = this.trueString(group.get('dayPatern').value);
        let weekPatern         = this.trueString(group.get('weekPatern').value);
        let gloveride          = this.trueString(group.get('gloveride').value);
        let cstdaoutlet        = this.trueString(group.get('cstdaoutlet').value);
        let dsci               = this.trueString(group.get('dsci').value);
        
        let maxUserWeek        = this.globalS.isValueNull(group.get('maxUserWeek').value);
        let minUserWeek        = this.globalS.isValueNull(group.get('minUserWeek').value);
        let maxStaffHour       = this.globalS.isValueNull(group.get('maxStaffHour').value);
        let minStaffHour       = this.globalS.isValueNull(group.get('minStaffHour').value);
        let glrevenue          = this.globalS.isValueNull(group.get('glRevene').value);
        let glcost             = this.globalS.isValueNull(group.get('glCost').value);
        let places             = this.globalS.isValueNull(group.get('places').value);
        
        let earlyStart         = this.globalS.isValueNull(group.get('earlyStart').value);
        let lateStart          = this.globalS.isValueNull(group.get('lateStart').value);
        let earlyFinish        = this.globalS.isValueNull(group.get('earlyFinish').value);
        let lateFinish         = this.globalS.isValueNull(group.get('lateFinish').value);
        let overstay           = this.globalS.isValueNull(group.get('overstay').value);
        let understay          = this.globalS.isValueNull(group.get('understay').value);
        
        let t2earlyStart       = this.globalS.isValueNull(group.get('t2earlyStart').value);
        let t2lateStart        = this.globalS.isValueNull(group.get('t2lateStart').value);
        let t2earlyFinish      = this.globalS.isValueNull(group.get('t2earlyFinish').value);
        let t2lateFinish       = this.globalS.isValueNull(group.get('t2lateFinish').value);
        let t2overstay         = this.globalS.isValueNull(group.get('t2overstay').value);
        let t2understay        = this.globalS.isValueNull(group.get('t2understay').value);
        
        let sheetalert         = this.globalS.isValueNull(group.get('sheetalert').value);
        
        let vari               = (jurisdiction == 'FEDERAL') ? "'93'" : "'13'";
        let recordNumber       = (this.isUpdate && this.isNewRecord) ? this.center_perosn_id : group.get('recordNumber').value ;
        
        let sqlz = "Update CSTDAOutlets SET [FundingSource]="+jurisdiction+",[Jurisdiction]="+vari+",[AgencySector]="+agencysector+",[WeeksPerYear]="+weeksYear+",[DaysPerWeek]="+dayweeks+",[HoursPerDay]="+hourYears+",[NoServiceUsers]="+serviceUsers+",[CSTDAServiceType]="+servicetype+",[ServiceAnnualHours]="+anualhours+",[WeeksPerCollectionPeriodOfOperation_NoPattern]="+weekPatern+",[DaysPerWeekOfOperation_NoPattern]="+dayPatern+",[HoursPerDayOfOperation_NoPattern]="+hourPatern+",[MAXWeeklyRecipientHours]="+maxUserWeek+",[MINWeeklyRecipientHours]="+minUserWeek+",[MAXWeeklyStaffHours]="+maxStaffHour+",[MINWeeklyStaffHours]="+minStaffHour+",[GLRevenue]="+glrevenue+",[GLCost]="+glcost+",[GLOverride]="+gloveride+",[CSTDA]="+cstdaoutlet+",[DCSI]="+dsci+",[Branch]="+branch+",[Places]="+places+",[BH_EarlyStart]="+earlyStart+",[BH_LateStart]="+lateStart+",[BH_EarlyFinish]="+earlyFinish+",[BH_LateFinish]="+lateFinish+",[BH_OverStay]="+overstay+",[BH_UndrStay]="+understay+",[AH_EarlyStart]="+t2earlyStart+",[AH_LateStart]="+t2lateStart+",[AH_EarlyFinish]="+t2earlyFinish+",[AH_LateFinish]="+t2lateFinish+",[AH_OverStay]="+t2overstay+",[AH_UndrStay]="+t2understay+",[FundingType]="+fundingtype+",[RunsheetAlerts]="+sheetalert+",[Name]="+name+",[ServiceOutletID]="+outletid+",[Postcode]="+postcode+",[AddressLine1]="+adress+",[Suburb]="+subrub+",[CSTDASLA]="+sla+" WHERE [RecordNumber] ='"+recordNumber+"'"; 
        
        // console.log(sqlz);
        
        
        this.menuS.InsertDomain(sqlz).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data){
            this.globalS.sToast('Success', 'Saved successful');
            // this.loadData();
            this.postLoading = false;   
            this.loading = false;       
            // this.handleCancel();
            // this.resetModal();
          }
          else{
            this.globalS.sToast('Success', 'Saved successful');
            // this.loadData();
            this.loading = false;   
            this.postLoading = false;          
            // this.handleCancel();
            // this.resetModal();
          }
        });
      }
    }
    loadApprovedStaff(){
      this.timeS.getcenterLocationincludedstaff(this.center_perosn_id).subscribe(data => {
        this.includedStaff = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    loadExcludedStaff(){
      this.timeS.getcenterlocationexcludedstaff(this.center_perosn_id).subscribe(data => {
        this.excludedStaff = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    loadCompetency(){
      this.timeS.getcenterlocationcompetency(this.center_perosn_id).subscribe(data => {
        this.competencies = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    saveStaff(type:any){
      this.postLoading = true;
      const group = this.inputForm;
      let insertOne = false;
      if(this.addOrEdit == 0){
        if(!this.isUpdate){
          if(!this.isNewRecord){
            this.save();
          }
        }
        var stafftype = (type == 1) ? 0 : 1;
        var approvedExcludeList = (type == 1) ? this.checkedListApproved : this.checkedListExcluded;
        
        approvedExcludeList.forEach( (element) => {
          this.timeS.postcenterlocationstaff({
            Notes: '',
            PersonID: this.center_perosn_id,
            Name: element,
            StaffCategory:stafftype,
            DateCreated: this.globalS.getCurrentDate()
          }).pipe(takeUntil(this.unsubscribe))
          .subscribe(data => {
            if (data) {
              insertOne = true;
              (type == 1) ? this.loadApprovedStaff() : this.loadExcludedStaff();
            }
          })
        });
        
        if(insertOne){
          this.globalS.sToast('Success', 'Saved successful');
        }
        this.postLoading = false;
        approvedExcludeList = [];
        (type == 1) ? this.handleAprfCancel()  : this.handleUnAprfCancel();
        (type == 1) ? this.loadApprovedStaff() : this.loadExcludedStaff();
        (type == 1) ? this.checkedListApproved = [] : this.checkedListExcluded = [] ;
        
      }
      else
      {
        this.postLoading  = false;
        const { staffTitle, notes, recordNumber } = this.staffForm.value;
        this.timeS.updatecenterlocationstaff({
          name: staffTitle,
          notes:notes,
          recordNumber:recordNumber
        }).pipe(
          takeUntil(this.unsubscribe))
          .subscribe(data => {
            if (data) {
              (type == 1) ? this.handleAprfCancel()  : this.handleUnAprfCancel();
              (type == 1) ? this.loadApprovedStaff() : this.loadExcludedStaff();
              this.globalS.sToast('Success', 'Data Updated');
              this.postLoading  = false;
            }
          })
        }
      }
      saveCompetency(){
        this.postLoading = true;
        const group = this.inputForm;
        let insertOne = false;
        if(this.addOrEdit == 0){
          if(!this.isUpdate){
            if(!this.isNewRecord){
              this.save();
            }
          }
          var checkedcompetency = this.checkedList;
            checkedcompetency.forEach( (element) => {
              this.timeS.postcenterlocationcompetency({
                competencyValue:element,
                notes:this.competencyGroup.value.notes,
                personID:this.center_perosn_id,
                }).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                  if(data)
                  {
                    insertOne = true;
                  }
                  if(insertOne){
                    this.globalS.sToast('Success', 'Competency Added');
                    this.timeS.getcenterlocationcompetency(this.center_perosn_id);
                  }
                  this.handleCompCancel();
              })
          });
          
        }else{
          
        }
      }
      trueString(data: any): string{
        return data ? '1': '0';
      }
      
      isChecked(data: string): boolean{
        return '1' == data ? true : false;
      }
      
      loadData(){
        
        this.jurisdiction = [{'id':'13','name':'STATE'},{'id':'93','name':'FEDERAL'}];
        
        this.agencySector = [{'id':'1','name':'Commonwealth Government'},{'id':'2','name':'State Territory Government'},{'id':'3','name':'Local Government'},{'id':'4','name':'Income Tax Exempt Charity'},{'id':'5','name':'Non-Income Tax Exempt'}];
        
        this.serviceType  = ['1.01-LARGE RESIDENTIAL/INSTITUTION (>20 PEOPLE) - 24 HOUR CARE','1.014-ADDITIONAL ACCOMMODATION SUPPORT – LARGE RESIDENTIAL/INSTITUTION (>20 PLACES)','1.02-SMALL RESIDENTIAL/INSTITUTION (7-20 PEOPLE) - 24 HOUR CARE','1.024-ADDITIONAL ACCOMMODATION SUPPORT – SMALL RESIDENTIAL/INSTITUTION (7-20 PLACES)','1.03-HOSTELS - GENERALLY NOT 24 HOUR CARE','1.041-GROUP HOME (<7 PLACES)','1.042-GROUP HOME (<7 PLACES) – NO DIRECT FINANCIAL CONTROL','1.044-ADDITIONAL ACCOMMODATION SUPPORT – GROUP HOME (<7 PLACES)','1.05-ATTENDANT CARE/PERSONAL CARE','1.06-IN-HOME ACCOMMODATION SUPPORT','1.07-ALTERNATIVE FAMILY PLACEMENT','1.081-ACCOMMODATION PROVIDED SO THAT INDIVIDUALS CAN ACCESS SPECIALIST SERVICES OR FURTHER EDUCATION','1.082-EMERGENCY OR CRISIS ACCOMMODATION SUPPORT (E.G. FOLLOWING THE DEATH OF A PARENT OR CARER)','1.083-HOUSES OR FLATS FOR HOLIDAY ACCOMMODATION','2.01-THERAPY SUPPORT FOR INDIVIDUALS','2.02-EARLY CHILDHOOD INTERVENTION','2.021-EARLY INTERVENTION','2.03-BEHAVIOUR/SPECIALIST INTERVENTION','2.04-COUNSELLING (INDIVIDUAL/FAMILY/GROUP)','2.05-REGIONAL RESOURCE AND SUPPORT TEAMS','2.061-PROGRAM SUPPORTS FACILITATION','2.062-CASE MANAGEMENT','2.063-LOCAL AREA COORDINATION','2.064-COMMUNITY DEVELOPMENT','2.066-SELF DIRECTED SUPPORT-MANAGEMENT','2.067-SELF DIRECTED SUPPORT-ESTABLISHMENT','2.071-OTHER COMMUNITY SUPPORT','2.072-OTHER COMMUNITY SUPPORT','2.073-OTHER COMMUNITY SUPPORT']
        this.fundTypes    = ['Block Funded','Both','Individually Funded','N/A'];
        
        let arr = [];
        for(let i=1;i<=90;i++)
        {
          arr.push(i);
        }
        this.numbers = arr;      
        this.loading = true;
        this.menuS.getlistcenterFacilityLoc(this.check).subscribe(data => {
          this.tableData = data;
          this.loading = false;
          this.cd.detectChanges();
        });
        
        let branch = "SELECT RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain =  'BRANCHES' ORDER BY Description";
        this.listS.getlist(branch).subscribe(data => {
          this.branches = data;
          this.loading = false;
        });
        
        let compet = "SELECT Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain = 'STAFFATTRIBUTE' ORDER BY Description";
        
        this.listS.getlist(compet).subscribe(data => {
          this.competencyList = data;
          this.loading = false;
        });
        let cat    = "SELECT DESCRIPTION FROM DATADOMAINS WHERE  ISNULL(DataDomains.DeletedRecord, 0) = 0 AND DOMAIN = 'STAFFADMINCAT'";
        this.listS.getlist(cat).subscribe(data => {
          this.categoryList = data;
          this.loading = false;
        });    
      }
      staffDetails(person_id: any = this.center_perosn_id) {
        this.cd.reattach();
        this.loading = true;
        forkJoin([
          this.timeS.getcenterLocationincludedstaff(person_id),
          this.timeS.getcenterlocationexcludedstaff(person_id),
          this.listS.getcenterlocationstaff(),
          this.timeS.getcenterlocationcompetency(person_id)
        ]).subscribe(staff => {
          this.loading = false;
          this.includedStaff  = staff[0];
          this.excludedStaff  = staff[1];
          this.listStaff      = staff[2];
          this.competencies   = staff[3];
          this.cd.markForCheck();
        });
      }
    
      staffDetlete(stafftype:number,data:any){
        this.timeS.deletecenterlocationstaff(data.recordNumber).pipe(
          takeUntil(this.unsubscribe)).subscribe(data => {
            if(data){
              (stafftype == 1) ? this.loadApprovedStaff() : this.loadExcludedStaff();
              this.globalS.sToast('Success','Staff Deleted')
            }
          })
        }
        editCompetencyModal(data:any){
          this.addOrEdit = 1;
          this.competencyGroup.patchValue({
            competencValue : data.competency,
            mandatory : data.mandatory,
            recordNumber:data.recordNumber,
          })
          this.competencymodal = true;
        }
        deleteCompetency(){
          
        }
        fetchAll(e){
          if(e.target.checked){
            this.whereString = "";
            this.loadData();
          }else{
            this.whereString = " Where ISNULL(xDeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) ";
            this.loadData();
          }
        }
        delete(data: any) { 
          this.postLoading = true;     
          const group = this.inputForm;
          this.menuS.deleteCenterFacilityLoclist(data.recordNumber)
          .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) {
              this.globalS.sToast('Success', 'Data Deleted!');
              this.loadData();
              return;
            }
          });
        }
        active(data:any){
          const group = this.inputForm;
          this.menuS.activateCenterFacitlityLoclist(data.recordNumber)
          .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) {
              this.globalS.sToast('Success', 'Data Deleted!');
              this.loadData();
              return;
            }
          });      
        }
        
        onCheckboxChange(option, event) {
          if(event.target.checked){
            this.checkedList.push(option.description);
          } else {
            this.checkedList = this.checkedList.filter(m=>m!= option.description)
          }
        }
        onCheckboxUnapprovedChange(option, event) {
          if(event.target.checked){
            this.checkedListExcluded.push(option);
          } else {
            this.checkedListExcluded = this.checkedListExcluded.filter(m=>m!= option)
          }
        }
        onCheckboxapprovedChange(option, event)
        {
          if(event.target.checked){
            this.checkedListApproved.push(option);
          } else {
            this.checkedListApproved = this.checkedListApproved.filter(m=>m!= option)
          }
        }
        buildForm() {
          this.inputForm = this.formBuilder.group({
            type: '',
            outletid:0,
            cstdaoutlet:false,
            dsci:false,
            name:'',
            branch:'',
            adress:'',
            sla:'',
            postcode:'',
            subrub:'',
            places:'',
            cat:'',
            category:'',
            unaprstaff:'',
            anualhours:'',
            serviceUsers:'',
            minUserWeek:'',
            maxUserWeek:'',
            minStaffHour:'',
            maxStaffHour:'',
            aprstaff:'',
            competences:'',
            agencysector:'',
            servicetype:'',
            fundingjunc:'',
            fundingtype:'',
            sheetalert:'',
            hour:'',
            week:'',
            day:'',
            weekPatern:false,
            dayPatern:false,
            hourPatern:true,
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
            gloveride:false,
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
          this.staffForm = this.formBuilder.group({
            staffTitle : '',
            notes : '',
            recordNumber:null,
          });
          this.competencyGroup = this.formBuilder.group({
            competencyValue: '',
            mandatory: false,
            notes: '',
            personID: '',
            recordNumber: 0
        })
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
          
          var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [NAME]) AS Field1,[Name] as Field2, ServiceOutletID as Field3, AddressLine1 + CASE WHEN Suburb is null Then ' ' ELSE ' ' + Suburb END as Field4 FROM CSTDAOutlets WHERE "+this.whereString+" ORDER BY [NAME]";
          
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
              "head3" : "Service",
              "head4" : "Address"
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
      
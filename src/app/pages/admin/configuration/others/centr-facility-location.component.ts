import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
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
  
  title:string = "Add New Facility/Location";
  private unsubscribe: Subject<void> = new Subject();
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
    log(value: string[]): void {
      // console.log(value);
    }
    showEditModal(index: any) {
      this.title = "Edit New Facility/Location"
      this.isUpdate = true;
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
        fundingSource,
        fundingType,
        glCost,
        glOverride,
        glRevenue,
        hoursPerDay,
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
        dcsi:dcsi,
        fundingType:fundingType,
        cstdaoutlet:cstda,
        glRevene:glRevenue,
        glCost:glCost,
        glOverride:glOverride,
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
        hour:hoursPerDay,    
        hourPatern:hoursPerDayOfOperation_NoPattern,
        dayPatern:daysPerWeekOfOperation_NoPattern,
        weekPatern:weeksPerCollectionPeriodOfOperation_NoPattern,
        serviceUsers:noServiceUsers,       
        anualhours:serviceAnnualHours,         

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
    
    next(): void {
      this.current += 1;
    }
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){         
        
        const group = this.inputForm;
        let branch             = group.get('branch').value;
        let adress             = group.get('adress').value;
        let subrub             = group.get('subrub').value;
        let sla                = group.get('sla').value;
        let name               = group.get('name').value;
        let outletid           = group.get('outletid').value;
        //start from
        let jurisdiction       = group.get('fundingjunc').value;
        let agencysector       = group.get('agencysector').value;
        let fundingtype        = group.get('fundingtype').value;
        // let fullFinacialYear   = group.get('fullFinacialYear').value;
        // let fullFinacialYear   = group.get('OperationStartDate').value;
        // let fullFinacialYear   = group.get('OpertaionEndDate').value;
        let weeksYear          = group.get('week').value;
        let dayweeks           = group.get('day').value;
        let hourYears          = group.get('hour').value;
        let serviceUsers       = group.get('serviceUsers').value;
        let anualhours         = group.get('anualhours').value;
        let servicetype        = group.get('servicetype').value;
        
        let hourPatern         = this.trueString(group.get('hourPatern').value);
        let dayPatern          = this.trueString(group.get('dayPatern').value);
        let weekPatern         = this.trueString(group.get('weekPatern').value);
        let maxUserWeek        = group.get('maxUserWeek').value;
        let minUserWeek        = group.get('minUserWeek').value;
        let maxStaffHour       = group.get('maxStaffHour').value;
        let minStaffHour       = group.get('minStaffHour').value;
        let glrevenue          = group.get('glRevene').value;
        let glcost             = group.get('glCost').value;
        let gloveride          = this.trueString(group.get('gloveride').value);
        let cstdaoutlet        = this.trueString(group.get('cstdaoutlet').value);
        let dsci               = this.trueString(group.get('dsci').value);
        let places             = group.get('places').value;
        
        let earlyStart         = group.get('earlyStart').value;
        let lateStart          = group.get('lateStart').value;
        let earlyFinish        = group.get('earlyFinish').value;
        let lateFinish         = group.get('lateFinish').value;
        let overstay           = group.get('overstay').value;
        let understay          = group.get('understay').value;
        
        let t2earlyStart       = group.get('t2earlyStart').value;
        let t2lateStart        = group.get('t2lateStart').value;
        let t2earlyFinish      = group.get('t2earlyFinish').value;
        let t2lateFinish       = group.get('t2lateFinish').value;
        let t2overstay         = group.get('t2overstay').value;
        let t2understay        = group.get('t2understay').value;
        let sheetalert         = group.get('sheetalert').value;
        
        
        let vari               = (jurisdiction == 'FEDERAL') ? '93' : '13';
        
        let values = jurisdiction+"','"+vari+"','"+agencysector+"','"+weeksYear+"','"+dayweeks+"','"+hourYears+"','"+serviceUsers+"','"+servicetype+"','"+anualhours+"','"+weekPatern+"','"+dayPatern+"','"+hourPatern+"','"+maxUserWeek+"','"+minUserWeek+"','"+maxStaffHour+"','"+minStaffHour+"','"+glrevenue+"','"+glcost+"','"+gloveride+"','"+cstdaoutlet+"','"+dsci+"','"+branch+"','"+places+"','"+earlyStart+"','"+lateStart+"','"+earlyFinish+"','"+lateFinish+"','"+overstay+"','"+understay+"','"+t2earlyStart+"','"+t2lateStart+"','"+t2earlyFinish+"','"+t2lateFinish+"','"+t2overstay+"','"+t2understay+"','"+fundingtype+"','"+sheetalert+"','"+name+"','"+outletid+"','"+adress+"','"+subrub+"','"+sla;
        let sqlz = "insert into CSTDAOutlets ([FundingSource],[Jurisdiction],[AgencySector],[WeeksPerYear],[DaysPerWeek],[HoursPerDay],[NoServiceUsers],[CSTDAServiceType],[ServiceAnnualHours],[WeeksPerCollectionPeriodOfOperation_NoPattern],[DaysPerWeekOfOperation_NoPattern],[HoursPerDayOfOperation_NoPattern],[MAXWeeklyRecipientHours],[MINWeeklyRecipientHours],[MAXWeeklyStaffHours],[MINWeeklyStaffHours],[GLRevenue],[GLCost],[GLOverride],[CSTDA],[DCSI],[Branch],[Places],[BH_EarlyStart],[BH_LateStart],[BH_EarlyFinish],[BH_LateFinish],[BH_OverStay],[BH_UndrStay],[AH_EarlyStart],[AH_LateStart],[AH_EarlyFinish],[AH_LateFinish],[AH_OverStay],[AH_UndrStay],[FundingType],[RunsheetAlerts],[Name],[ServiceOutletID],[AddressLine1],[Suburb],[CSTDASLA]) values('"+values+"');select @@IDENTITY"; 
        // console.log(sqlz);
        this.menuS.InsertDomain(sqlz).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data){
            // console.log("aaaaaaaaaaaaa");
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.postLoading = false;   
            this.loading = false;       
            this.handleCancel();
            this.resetModal();
          }
          else{
            // console.log("bbbbbbbbbbbbb");
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.loading = false;   
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          }
        });
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
        let branch             = group.get('branch').value;
        let adress             = group.get('adress').value;
        let subrub             = group.get('subrub').value;
        let sla                = group.get('sla').value;
        let name               = group.get('name').value;
        let outletid           = group.get('outletid').value;
        let recordNumber       = group.get('recordNumber').value;
        
        let sqlz = "Update CSTDAOutlets SET [Branch]='"+ branch + "',[Name]='"+ name + "',[ServiceOutletID]='"+ outletid + "',[AddressLine1]='"+ adress + "',[Suburb]='"+ subrub + "',[CSTDASLA]='"+ sla + "' WHERE [RecordNumber] ='"+recordNumber+"'"; 
        
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
      
      let arr = [1,2,3,4,5];
      for(let i=6;i<=90;i++)
      {
        arr.push(i);
      }
      this.numbers = arr;      
      this.loading = true;
      this.menuS.getlistcenterFacilityLoc().subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
      
      let branch = "SELECT RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain =  'BRANCHES' ORDER BY Description";
      this.listS.getlist(branch).subscribe(data => {
        this.branches = data;
        this.loading = false;
      });
      let staf = "Select AccountNo from Staff WHERE AccountNo > '!z' AND (CommencementDate is not null) and (TerminationDate is null) AND (Accountno NOT IN (Select [Name] AS Accountno FROM HumanResources WHERE [Group] = 'INCLUDEDSTAFF' AND PersonID = '1094') AND  Accountno NOT IN (Select [Name] AS Accountno FROM HumanResources WHERE [Group] = 'INCLUDEDSTAFF' AND PersonID = 'T0100005501')) ORDER BY AccountNo";
      this.listS.getlist(staf).subscribe(data => {
        this.staffList = data;
        this.loading = false;
      });
      let compet = "SELECT Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain = 'STAFFATTRIBUTE' ORDER BY Description";
      
      this.listS.getlist(compet).subscribe(data => {
        this.competencyList = data;
        this.loading = false;
      });    
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
    onCheckboxChange(option, event) {
      if(event.target.checked){
        this.checkedList.push(option.description);
      } else {
        this.checkedList = this.checkedList.filter(m=>m!= option.description)
      }
    }
    onCheckboxUnapprovedChange(option, event) {
      if(event.target.checked){
        this.checkedListExcluded.push(option.accountNo);
      } else {
        this.checkedListExcluded = this.checkedListExcluded.filter(m=>m!= option.accountNo)
      }
    }
    onCheckboxapprovedChange(option, event)
    {
      if(event.target.checked){
        this.checkedListApproved.push(option.accountNo);
      } else {
        this.checkedListApproved = this.checkedListApproved.filter(m=>m!= option.accountNo)
      }
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        
        type: '',
        outletid:'',
        cstdaoutlet:'',
        dsci:'',
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
        hourPatern:false,
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
        gloveride:'',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [NAME]) AS Field1,[Name] as Field2, ServiceOutletID as Field3, AddressLine1 + CASE WHEN Suburb is null Then ' ' ELSE ' ' + Suburb END as Field4 FROM CSTDAOutlets WHERE ( EndDate is NULL OR EndDate >= Getdate()) ORDER BY [NAME]";
      
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
  
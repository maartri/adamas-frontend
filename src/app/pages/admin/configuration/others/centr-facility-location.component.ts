import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
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
  checkedList:Array<any>;
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
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    private menuS: MenuService,
    private switchS:SwitchService,
  ){}
  
  ngOnInit(): void {
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
      branch,
      address,
      subrub,
      cstdasla,
      name,
      serviceOutletID, 
      recordNumber,
     } = this.tableData[index];
    this.inputForm.patchValue({
     branch : branch,
     adress : address,
     subrub : subrub,
     sla    : cstdasla,
     name   : name,
     outletid : serviceOutletID,
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

        let values = branch+"','"+name+"','"+outletid+"','"+adress+"','"+subrub+"','"+sla;
        let sqlz = "insert into CSTDAOutlets ([Branch],[Name],[ServiceOutletID],[AddressLine1],[Suburb],[CSTDASLA]) values('"+values+"');select @@IDENTITY"; 
        
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
      loadData(){

        this.jurisdiction = [{'id':'13','name':'STATE'},{'id':'93','name':'FEDERAL'}];
        this.agencySector = ['Commonwealth Government','State Territory Government','Local Government','Income Tax Exempt Charity','Non-Income Tax Exempt'];
        this.serviceType  = ['1.01-LARGE RESIDENTIAL/INSTITUTION (>20 PEOPLE) - 24 HOUR CARE','1.014-ADDITIONAL ACCOMMODATION SUPPORT – LARGE RESIDENTIAL/INSTITUTION (>20 PLACES)','1.02-SMALL RESIDENTIAL/INSTITUTION (7-20 PEOPLE) - 24 HOUR CARE','1.024-ADDITIONAL ACCOMMODATION SUPPORT – SMALL RESIDENTIAL/INSTITUTION (7-20 PLACES)','1.03-HOSTELS - GENERALLY NOT 24 HOUR CARE','1.041-GROUP HOME (<7 PLACES)','1.042-GROUP HOME (<7 PLACES) – NO DIRECT FINANCIAL CONTROL','1.044-ADDITIONAL ACCOMMODATION SUPPORT – GROUP HOME (<7 PLACES)','1.05-ATTENDANT CARE/PERSONAL CARE','1.06-IN-HOME ACCOMMODATION SUPPORT','1.07-ALTERNATIVE FAMILY PLACEMENT','1.081-ACCOMMODATION PROVIDED SO THAT INDIVIDUALS CAN ACCESS SPECIALIST SERVICES OR FURTHER EDUCATION','1.082-EMERGENCY OR CRISIS ACCOMMODATION SUPPORT (E.G. FOLLOWING THE DEATH OF A PARENT OR CARER)','1.083-HOUSES OR FLATS FOR HOLIDAY ACCOMMODATION','2.01-THERAPY SUPPORT FOR INDIVIDUALS','2.02-EARLY CHILDHOOD INTERVENTION','2.021-EARLY INTERVENTION','2.03-BEHAVIOUR/SPECIALIST INTERVENTION','2.04-COUNSELLING (INDIVIDUAL/FAMILY/GROUP)','2.05-REGIONAL RESOURCE AND SUPPORT TEAMS','2.061-PROGRAM SUPPORTS FACILITATION','2.062-CASE MANAGEMENT','2.063-LOCAL AREA COORDINATION','2.064-COMMUNITY DEVELOPMENT','2.066-SELF DIRECTED SUPPORT-MANAGEMENT','2.067-SELF DIRECTED SUPPORT-ESTABLISHMENT','2.071-OTHER COMMUNITY SUPPORT','2.072-OTHER COMMUNITY SUPPORT','2.073-OTHER COMMUNITY SUPPORT']
        this.fundTypes    = ['Block Funded','Both','Individually Funded','N/A'];
        
        let arr = [1,2,3,4,5];
          for(let i=6;i<=90;i++)
          {
            arr.push(i);
          }
        this.numbers = arr;
        let sql ="SELECT RecordNumber, [Name],[Branch],[Suburb],[CSTDASLA],ServiceOutletID, AddressLine1 + CASE WHEN Suburb is null Then ' ' ELSE ' ' + Suburb END as Address FROM CSTDAOutlets WHERE ( EndDate is NULL OR EndDate >= Getdate()) ORDER BY [NAME]";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
          this.tableData = data;
        });

        let branch = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'BRANCHES' ORDER BY Description";
        this.listS.getlist(branch).subscribe(data => {
          this.branches = data;
          this.loading = false;
        });
        let staf = "Select AccountNo from Staff WHERE AccountNo > '!z' AND (CommencementDate is not null) and (TerminationDate is null) AND (Accountno NOT IN (Select [Name] AS Accountno FROM HumanResources WHERE [Group] = 'INCLUDEDSTAFF' AND PersonID = '1094') AND  Accountno NOT IN (Select [Name] AS Accountno FROM HumanResources WHERE [Group] = 'INCLUDEDSTAFF' AND PersonID = 'T0100005501')) ORDER BY AccountNo";
        this.listS.getlist(staf).subscribe(data => {
          this.staffList = data;
          this.loading = false;
        });
        let compet = "SELECT Description FROM DATADOMAINS WHERE Domain = 'STAFFATTRIBUTE' ORDER BY Description";
        
        this.listS.getlist(compet).subscribe(data => {
          this.competencyList = data;
          this.loading = false;
        });


      }
  delete(data: any) {
    this.globalS.sToast('Success', 'Data Deleted!');
  }
  onCheckboxChange(option, event) {
    if(event.target.checkedcompetency) {
      this.checkedList.push(option.description);
    } else {
    for(var i=0 ; i < this.competencyList.length; i++) {
      if(this.checkedList[i] == option.description) {
        this.checkedList.splice(i,1);
     }
   }
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

}

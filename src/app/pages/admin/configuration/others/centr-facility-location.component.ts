import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';

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
  jurisdiction:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  staffApproved: boolean = false;
  staffUnApproved: boolean = false;
  competency: boolean = false;
  
  current: number = 0;
  checkedflag:boolean = true;
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
    this.resetModal();
    this.staffApproved = true;
  }
  showstaffUnApprovedModal(){
    this.staffUnApproved = true;
  }
  showCompetencyModal(){
    this.resetModal();
    this.competency = true;
  }
  
  


  showServiceModal(){
    this.modalOpen = true;
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
    this.title = "Edit New Facility/Location"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
    const { 
      name,
      branch,
      agroup,
      recordNumber
     } = this.tableData[index];
    this.inputForm.patchValue({
      item: branch,
      rate:name,
      agroup:agroup,
      recordNumber:recordNumber
    });
  }
  
  handleCancel() {
    this.modalOpen = false;
  }
  handleCompCancel() {
    this.competency = false;
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
      // this.switchS.addData(  
      //   this.modalVariables={
      //     title: 'CDC Claim Rates'
      //   }, 
      //   this.inputVariables = {
      //     item: group.get('item').value,
      //     rate: group.get('rate').value,
      //     domain: 'PACKAGERATES', 
      //   }
      //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      //     if (data) 
      //     this.globalS.sToast('Success', 'Saved successful');     
      //     else
      //     this.globalS.sToast('Unsuccess', 'Data not saved' + data);
      //     this.loadData();
      //     this.postLoading = false;          
      //     this.handleCancel();
      //     this.resetModal();
      //   });
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
        // console.log(group.get('item').value);
        // this.switchS.updateData(  
        //   this.modalVariables={
        //     title: 'CDC Claim Rates'
        //   }, 
        //   this.inputVariables = {
        //     item: group.get('item').value,
        //     rate: group.get('rate').value,
        //     recordNumber:group.get('recordNumber').value,
        //     domain: 'PACKAGERATES',
        //   }
          
        //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        //     if (data) 
        //     this.globalS.sToast('Success', 'Updated successful');     
        //     else
        //     this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
        //     this.loadData();
        //     this.postLoading = false;          
        //     this.handleCancel();
        //     this.resetModal();
        //   });
        }
        
      }
      loadData(){

        this.jurisdiction = [{'id':'13','name':'STATE'},{'id':'93','name':'FEDERAL'}];
        console.log(this.jurisdiction);
        let sql ="SELECT RecordNumber, [Name], ServiceOutletID, AddressLine1 + CASE WHEN Suburb is null Then ' ' ELSE ' ' + Suburb END as Address FROM CSTDAOutlets WHERE ( EndDate is NULL OR EndDate >= Getdate()) ORDER BY [NAME]";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
          this.tableData = data;
        });

        let branch = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'BRANCHES' ORDER BY Description";
        this.listS.getlist(branch).subscribe(data => {
          this.branches = data;
          this.loading = false;
        });

      }
  delete(data: any) {
    this.globalS.sToast('Success', 'Data Deleted!');
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      
      type: '',
      outletid:'',
      cstdaoutlet:'',
      dsci:'',
      name:'',
      branch:'',
      places:'',
      cat:'',
      category:'',
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

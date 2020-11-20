import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService } from '@services/index';
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'app-distributionlist',
  templateUrl: './distributionlist.component.html',
  styles:[`
  .mrg-btm{
      margin-bottom:0rem !important;
  }`]
})
export class DistributionlistComponent implements OnInit {

  tableData: Array<any>;
  staff:Array<any>;
  listType:Array<any>;
  program:Array<any>;
  recipients:Array<any>;
  locations:Array<any>;
  services:Array<any>;
  severity:Array<any>;
  checked = true;
  checked2=true;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add Distribution List"
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private formBuilder: FormBuilder
  ){}
  
  ngOnInit(): void {
    this.buildForm();
    this.populateDropdowns();
    this.loadData();
    // this.tableData = [{ code:"Other",name:"K AGGARWAL"},{ code:"Other",name:"HILDA SMITH"}];
    this.loading = false;
    this.cd.detectChanges();
  }
  loadData(){
    let sql ="SELECT RecordNo, Recipient,Activity,Location,Program,Staff,ListName as ltype,Severity FROM IM_DistributionLists order by recipient";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.tableData = data;
      this.loading = false;
    });
    // this.staff = ['ABBAS A','ADAMS D S','WATTS T','GOEL T J','DARLISON S','TRINIDAD M','ALONSO J C','AHMAD A','AAAQWERTY TOM','AGGARWAL K H','MALIK I','SMITH H','MILLER A','AI BBCRI DAVIS B C','DIAZ J P','ALLEN C J','HARPER B','ALONSO J C','','DARLISION AWARD','DARLISION AWARD 2','DARLISION AWARD 3','DARLISION AWARD 3','DARLISION AWARD 4','DARLISION AWARD 5','DARLISION AWARD 6','DARLISION AWARD 7'];
  }
  populateDropdowns(){
    // this.staff = ['ABBAS A','ADAMS D S','WATTS T','GOEL T J','DARLISON S','TRINIDAD M','ALONSO J C','AHMAD A','AAAQWERTY TOM','AGGARWAL K H','MALIK I','SMITH H','MILLER A','AI BBCRI DAVIS B C','DIAZ J P','ALLEN C J','HARPER B','ALONSO J C','','DARLISION AWARD','DARLISION AWARD 2','DARLISION AWARD 3','DARLISION AWARD 3','DARLISION AWARD 4','DARLISION AWARD 5','DARLISION AWARD 6','DARLISION AWARD 7'];
    this.listType = ['INCIDENT','DOCUSIGN'];
    let sql  = "SELECT TITLE FROM ITEMTYPES WHERE ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM') AND ENDDATE IS NULL";
    this.listS.getlist(sql).subscribe(data => {
      this.services = data;
      let da ={
        "title" :"ALL"
      };
      this.services.unshift(da);
      console.log(this.services);
    });

    let staff_query = "SELECT ACCOUNTNO as name FROM STAFF WHERE CommencementDate IS NOT NULL AND TerminationDate IS NULL AND ACCOUNTNO > '!Z'";
    this.listS.getlist(staff_query).subscribe(data => {
      this.staff = data;
      let da ={
        "name" :"ALL"
      };
      this.staff.unshift(da);
    });
    let prog = "SELECT [NAME] as name FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' AND ENDDATE IS NULL";
    this.listS.getlist(prog).subscribe(data => {
      this.program = data;
      let da ={
        "name" :"ALL"
      };
      this.program.unshift(da);
      // this.staff.unshift('ALL');
    });
    let loca = "SELECT [NAME] FROM CSTDAOutlets WHERE [NAME] IS NOT NULL";
    this.listS.getlist(loca).subscribe(data => {
      this.locations = data;
      let da ={
        "name" :"ALL"
      };
      this.locations.unshift(da);
      // this.locations.unshift('ALL');
    });
    let recip = "SELECT ACCOUNTNO as name FROM RECIPIENTS WHERE AdmissionDate IS NOT NULL AND DischargeDate IS NULL AND ACCOUNTNO > '!Z'";
    this.listS.getlist(recip).subscribe(data => {
      this.recipients = data;
      let da ={
        "name" :"ALL"
      };
      this.recipients.unshift(da);
      // this.recipients.unshift();
    });

    this.severity = ['ALL','LOW','MEDIUM','HIGH','CRITICAL'];
  }
  showAddModal() {
    this.heading = "Add Distribution List"
    this.resetModal();
    this.modalOpen = true;
  }
  
  resetModal() {
    this.current = 0;
    this.inputForm.reset();
    this.postLoading = false;
  }
  
  showEditModal(index: any) {
    this.heading  = "Edit Distribution List"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
    const { 
      ltype,
      staff,
      service,
      assignee,
      program,
      location,
      recipient,
      activity,
      severity,
      mandatory,
      recordNo,

    } = this.tableData[index];
      this.inputForm.patchValue({
        ltype:ltype,
        staff:staff,
        service:activity,
        assignee:assignee,
        prgm:program,
        location:location,
        recepient:recipient,
        saverity:severity,
        mandatory:mandatory,  
        recordNo:recordNo,
   });
  }
  loadtitle(){
    return this.heading
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
    this.globalS.sToast('Success', 'Changes saved');
    this.handleCancel();
    this.resetModal();
  }
  
  delete(data: any) {
    this.globalS.sToast('Success', 'Data Deleted!');
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      ltype:'',
      staff:'',
      service:'',
      assignee:true,
      prgm:'',
      location:'',
      recepient:'',
      saverity:'',
      mandatory:true,
    });
  }


}

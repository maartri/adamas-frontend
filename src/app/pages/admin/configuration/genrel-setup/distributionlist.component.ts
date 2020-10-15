import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add New Distribution List"
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ){}
  
  ngOnInit(): void {
    this.buildForm();
    this.tableData = [{ code:"Other",name:"K AGGARWAL"},{ code:"Other",name:"HILDA SMITH"}];
    this.loading = false;
    this.cd.detectChanges();
  }
  
  showAddModal() {
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
      location,
      recepient,
      saverity,
      mandatory,

    } = this.tableData[index];
      this.inputForm.patchValue({
        name:ltype,
        code:staff,
        service:service,
        assignee:assignee,
        location:location,
        recepient:recepient,
        saverity:saverity,
        mandatory:mandatory,  
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
      assignee:'',
      location:'',
      recepient:'',
      saverity:'',
      mandatory:'',
    });
  }


}

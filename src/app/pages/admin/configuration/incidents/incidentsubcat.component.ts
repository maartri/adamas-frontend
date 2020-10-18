import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { TimeSheetService, GlobalService,incidentTypes} from '@services/index';
@Component({
  selector: 'app-incidentsubcat',
  templateUrl: './incidentsubcat.component.html',
  styles: []
})
export class IncidentsubcatComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  IncidentTypesArr: Array<string> = incidentTypes;
  heading:string = "Add New Incident Sub Category";
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ){}
  
  ngOnInit(): void {
    this.buildForm();
    this.tableData = [{ incident_type:"BEHAVIOURAL",name:"test 1"},{ incident_type:"MEDICAL",name:"test 2"},{ incident_type:"OTHER",name:"test 3"}];
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
    this.heading  = "Edit Incident Sub Category"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
    const { 
      incident_type,
      name,

    } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        incident_type:incident_type,
        
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
      incident_type:'',
      name:'',
    });
  }


}

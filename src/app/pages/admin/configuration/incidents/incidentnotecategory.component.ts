import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/index';
import { SwitchService } from '@services/switch.service';

@Component({
  selector: 'app-incidentnotecategory',
  templateUrl: './incidentnotecategory.component.html',
  styles: []
})
export class IncidentnotecategoryComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Recipent Incident Note Category"
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private formBuilder: FormBuilder
  ){}
  
  loadTitle()
  {
    // debugger;
    return this.title;
  }
  ngOnInit(): void {
    this.buildForm();
    this.tableData = [{ name:"TEST A"},{name:"TEST B"},{name:"TEST C"}];
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
    // debugger;
    this.title = "Edit Recipent Incident Note Category"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
      const { 
          name
       } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
      });
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
    // var temp=this.inputForm.controls["fundregions"].value
    //  var input=this.inputForm.value
    //  var temp = input.fundregions
    // debugger;
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
      name: '',
    });
  }

}

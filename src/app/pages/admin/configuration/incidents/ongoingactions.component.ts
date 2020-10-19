import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';

@Component({
  selector: 'app-ongoingactions',
  templateUrl: './ongoingactions.component.html',
  styles: []
})
export class OngoingactionsComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Ongoing Action"
  
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
    this.tableData = [{ name:"On Going ACTION A"},{name:"On Going ACTION B"},{name:"On Going ACTION C"},{name:"On Going ACTION D"},{name:"On Going ACTION E"}];
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
    this.title = "edit Ongoing Action"
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
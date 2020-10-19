import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { ListService } from '@services/list.service';

@Component({
  selector: 'app-budgetgroups',
  templateUrl: './budgetgroups.component.html',
  styles: []
})
export class BudgetgroupsComponent implements OnInit {
  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Activity Budget Group"
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    ){}
  
  ngOnInit(): void {
    this.buildForm();
    this.tableData = [{ name:"Nursing Allied Health (H3)"},{name:"Meals (H7)"},{name:"Personal Care"},{name:"Shopping"},{name:"Transport"},{name:"In home Care"}];
    this.loading = false;
    this.cd.detectChanges();
  }
  loadTitle(){
    return this.title;
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
    this.title = "Edit Activity Budget Group";
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
    const { 
      name,
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

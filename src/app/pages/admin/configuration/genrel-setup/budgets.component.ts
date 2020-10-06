import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { ListService } from '@services/list.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styles: []
})
export class BudgetsComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  dateFormat: string = 'dd/MM/yyyy';
  branches: Array<string>;
  
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
  
  populateDropdowns(): void {
    // this.clientS.getcontacttype().subscribe(data => {
    //   this.contactType = data.map(x => {
    //     return (new RemoveFirstLast().transform(x.description)).trim();
    //   });
    // })
    this.listS.getlistbranches().subscribe(data => this.branches = data);
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
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
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
      title: '',
      type:'',
      start:null,
      end:null,
      branch:null,
      care:null,
      cost:null,
      outlet:null,
      region:null,
      ftype:null,
      prgrm:null,
      bcode:null,
      dicipline:null,
      sregion:null,
      mds:null,
      tracss:null,
      spid:null,
      state:null,
      team:null,
      cat:null,
      staff:null,
      recepient:null,
      coordinator:null,
    });
  }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService } from '@services/index';
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'app-programcoordinates',
  templateUrl: './programcoordinates.component.html',
  styles: []
})
export class ProgramcoordinatesComponent implements OnInit {

  tableData: Array<any>;
  staff:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add New Program Coordinates"
  constructor(
    private globalS: GlobalService,
    private listS:ListService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ){}
  
  ngOnInit(): void {
    this.buildForm();
    this.loadData();
    // this.tableData = [{ code:"Other",name:"K AGGARWAL"},{ code:"Other",name:"HILDA SMITH"}];
    this.loading = false;
    this.cd.detectChanges();
  }
  loadData(){
    let sql ="SELECT HACCCode as code , RecordNumber, Description as name FROM DataDomains WHERE Domain =  'CASE MANAGERS'";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.tableData = data;
      console.log(this.tableData);
      this.loading = false;
    });
    this.staff = ['DARLISION AWARD','DARLISION AWARD 2','DARLISION AWARD 3','DARLISION AWARD 3','DARLISION AWARD 4','DARLISION AWARD 5','DARLISION AWARD 6','DARLISION AWARD 7','ACT'];
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
    this.heading  = "Edit Programe Coordinates"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
    const { 
      code,
      name,

    } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        code:code,
        
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
      code:'',
      name:'',
    });
  }

}

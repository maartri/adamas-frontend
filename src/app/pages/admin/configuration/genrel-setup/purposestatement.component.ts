import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { ListService } from '@services/list.service';

@Component({
  selector: 'app-purposestatement',
  templateUrl: './purposestatement.component.html',
  styles: [`
  textarea{
     resize:none;
  }
`],
})
export class PurposestatementComponent implements OnInit {

    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add Package Purpose Statement";
    
    constructor(
      private globalS: GlobalService,
      private cd: ChangeDetectorRef,
      private formBuilder: FormBuilder,
      private listS: ListService,
      ){}
    
    ngOnInit(): void {
      this.buildForm();

      // this.listS.getfundingpackagepurposelist().subscribe(data => this.tableData = data);
        
      this.tableData = [{ name:"this is  a test package purpose statement 1"},{name:"this is  a test package purpose statement 2"},{name:"this is  a test package purpose statement 3"}];
      
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
    loadTitle(){
      this.title;
    }
    showEditModal(index: any) {
      this.title = "Edit Package Purpose Statement"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;

      const { 
        name,
       } = this.tableData[index];
      this.inputForm.patchValue({
        porpose: name,
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
        porpose: '',
      });
    }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '@services/global.service';

@Component({
  selector: 'app-claimrates',
  templateUrl: './claimrates.component.html',
  styles: []
})
export class ClaimratesComponent implements OnInit {

    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add New Package Claim Rates"
    constructor(
      private globalS: GlobalService,
      private cd: ChangeDetectorRef,
      private formBuilder: FormBuilder
    ){}
    
    ngOnInit(): void {
      this.buildForm();
      this.tableData = [{ name:"CENTRAL",rate:"12"},{name:"NORTH",rate:"22"},{name:"SOUTH",rate:"35"}];
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.resetModal();
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
      this.title = "Edit New Package Claim Rates"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        item,
        rate
       } = this.tableData[index];
      this.inputForm.patchValue({
        item: item,
        rate:rate,
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
        item: '',
        rate: '',
        recordNumber:null
      });
    }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '@services/global.service';


@Component({
  selector: 'app-addresstypes',
  templateUrl: './addresstypes.component.html',
  styles: []
})
export class AddresstypesComponent implements OnInit {

    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    heading:string = "Add Address Type"

    constructor(
      private globalS: GlobalService,
      private cd: ChangeDetectorRef,
      private formBuilder: FormBuilder,

    ){}
    
    ngOnInit(): void {
      this.buildForm();
      this.tableData = [{ name:"phone"},{name:"fax"},{name:"postal"},{name:"mobile"}];
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
      return this.heading;
    }
    showEditModal(index: any) {
      this.heading = "Edit Address Type"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;

      const { 
        name
      } = this.tableData[index];
        this.inputForm.patchValue({
          title: name,
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
        title:'',
      });
    }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';

@Component({
  selector: 'app-postcodes',
  templateUrl: './postcodes.component.html',
  styles: []
})
export class PostcodesComponent implements OnInit {

  tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add New Postcode"
    
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
      this.tableData = [{postcode:"213",suburb:"beechtrr",state:"wa"}];
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
      this.title = "Edit Postcodes"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
        const { 
          postcode,
          suburb,
          state,
         } = this.tableData[index];
        this.inputForm.patchValue({
          postcode: postcode,
          suburb:suburb,
          state:state,
        });
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    // pre(): void {
    //   this.current -= 1;
    // }
    
    // next(): void {
    //   this.current += 1;
    // }
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
        postcode:'',
        suburb:'',
        state:'',
      });
    }

}

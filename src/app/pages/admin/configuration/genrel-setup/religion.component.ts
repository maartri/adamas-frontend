import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';

@Component({
  selector: 'app-religion',
  templateUrl: './religion.component.html',
  styles: []
})
export class ReligionComponent implements OnInit {

    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add Religion"
    
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
      this.tableData = [{name:"Buddhism"},{ name:"Western Christianity"},{ name:"Eastern Christianity"},{name:"Sarnaism"},{name:"Sikhism"}];
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
      this.title = "Edit Religion"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
        const { 
            name
         } = this.tableData[index];
        this.inputForm.patchValue({
          religion: name,
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
        religion: '',
      });
    }

}

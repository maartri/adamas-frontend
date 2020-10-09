import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styles: []
})
export class HolidaysComponent implements OnInit {

  tableData: Array<any>;
    loading: boolean = false;
    dateFormat: string = 'dd/MM/yyyy';
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add Public Holidays"
    
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
      this.tableData = [{date:"2020-10-09",description:"Independece day",state:"WA"}];
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
      this.title = "Edit Public Holidays"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
        const { 
          date,
          description,
          state,
         } = this.tableData[index];
        this.inputForm.patchValue({
          date: date,
          description:description,
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
        date:'',
        description:'',
        state:'',
        region:'',
      });
    }

}

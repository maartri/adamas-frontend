import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-debtor-terms',
  templateUrl: './debtor-terms.component.html',
  styles: []
})
export class DebtorTermsComponent implements OnInit {

    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    modalVariables:any;
    inputVariables:any;
    title:string = "Add Payment Terms"
    private unsubscribe: Subject<void> = new Subject();
    constructor(
      private globalS: GlobalService,
      private cd: ChangeDetectorRef,
      private switchS:SwitchService,
      private listS:ListService,
      private formBuilder: FormBuilder
    ){}
    
    loadTitle()
    {
      // debugger;
      return this.title;
    }
    
    ngOnInit(): void {
      this.buildForm();
      // this.loadData();
      this.tableData = [{name:"test term a"},{name:"test term b"},{name:"test term c"}];
      this.loading = false;
      this.cd.detectChanges();
    }
    showAddModal() {
      this.title = "Add Paymemt Terms"
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
      this.title = "Edit Paymemt Terms"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
        const { 
            name,
            recordNumber,
         } = this.tableData[index];
        this.inputForm.patchValue({
          name: name,
          recordNumber:recordNumber,
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
    loadData(){
      let sql ="select Description as name,recordNumber from DataDomains where Domain='FILECLASS' ";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
    }
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){         
        // this.switchS.addData(  
        //   this.modalVariables={
        //     title: 'Filing Classification'
        //   }, 
        //   this.inputVariables = {
        //     display: group.get('name').value,
        //     domain: 'FILECLASS',         
            
        //   }
        //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        //     if (data) 
        //     this.globalS.sToast('Success', 'Saved successful');     
        //     else
        //     this.globalS.sToast('Unsuccess', 'Data not saved' + data);
        //     this.loadData();
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          // });
        }else{
          this.postLoading = true;     
          // const group = this.inputForm;
          // this.switchS.updateData(  
          //   this.modalVariables={
          //     title: 'Filing Classification'
          //   }, 
          //   this.inputVariables = {
          //     display: group.get('name').value,
          //     primaryId:group.get('recordNumber').value,
          //     domain: 'FILECLASS',
          //   }
            
          //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          //     if (data) 
          //     this.globalS.sToast('Success', 'Updated successful');     
          //     else
          //     this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
          //     this.loadData();
          
              this.postLoading = false;          
              this.handleCancel();
              this.resetModal();
            // });
          }
          
        }
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Sorry At this movement you can not perform this action!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        name: '',
        recordNumber:null,
      });
    }

}

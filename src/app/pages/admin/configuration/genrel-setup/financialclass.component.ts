import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-financialclass',
  templateUrl: './financialclass.component.html',
  styles: []
})
export class FinancialclassComponent implements OnInit {

    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    modalVariables:any;
    inputVariables:any;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add Financial Class"
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
      this.loadData();
      // this.tableData = [{ description:"Employeed 10000"},{description:"Employeed 20000"},{description:"Un Employeed"}];
      this.loading = false;
      this.cd.detectChanges();
    }
    showAddModal() {
      this.title = "Add Financial Class"
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
      this.title = "Edit Financial Class"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
        const { 
          name,
          recordNumber
         } = this.tableData[index];
        this.inputForm.patchValue({
          fclass: name,
          recordNumber:recordNumber
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
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){         
        this.switchS.addData(  
          this.modalVariables={
            title: 'Financial Classification'
          }, 
          this.inputVariables = {
            display: group.get('fclass').value,
            domain: 'FINANCIALCLASS', 
          }
          ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) 
            this.globalS.sToast('Success', 'Saved successful');     
            else
            this.globalS.sToast('Unsuccess', 'Data not saved' + data);
            this.loadData();
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          });
        }else{
          this.postLoading = true;     
          const group = this.inputForm;
          this.switchS.updateData(  
            this.modalVariables={
              title: 'Financial Classification'
            }, 
            this.inputVariables = {
              display: group.get('fclass').value,
              primaryId:group.get('recordNumber').value,
              domain: 'FINANCIALCLASS',
            }
            
            ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
              if (data) 
              this.globalS.sToast('Success', 'Updated successful');     
              else
              this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
              this.loadData();
              this.postLoading = false;          
              this.handleCancel();
              this.resetModal();
            });
          }
          
        }
        loadData(){
          let sql ="select Description as name,recordNumber from DataDomains where Domain='FINANCIALCLASS'";
          this.loading = true;
          this.listS.getlist(sql).subscribe(data => {
            this.tableData = data;
            this.loading = false;
          });
        }
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        fclass: '',
        recordNumber:null
      });
    }

}

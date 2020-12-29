import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recipients-billing-cycles',
  templateUrl: './recipients-billing-cycles.component.html',
  styles: []
})
export class RecipientsBillingCyclesComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  modalVariables:any;
  inputVariables:any;
  heading:string = "Add New Recipients Billing Cycles"
  private unsubscribe: Subject<void> = new Subject();
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private formBuilder: FormBuilder
  ){}
    
    ngOnInit(): void {
      this.buildForm();
      // this.tableData = [{name:"Test 1"},{name:"Test 2"},{name:"Test 3"}];
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.heading  = "Add New Recipients Billing Cycles"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit Recipients Billing Cycles"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        recordNumber:recordNumber,
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
      const group = this.inputForm;
      if(!this.isUpdate){         
        this.switchS.addData(  
          this.modalVariables={
            title: 'Recipient Billing Cycles'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            domain: 'BILLINGCYCLE', 
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
              title: 'Recipient Billing Cycles'
            }, 
            this.inputVariables = {
              display: group.get('name').value,
              primaryId:group.get('recordNumber').value,
              domain: 'BILLINGCYCLE',
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
          let sql ="select Description as name,recordNumber from DataDomains where Domain='BILLINGCYCLE'";
          this.loading = true;
          this.listS.getlist(sql).subscribe(data => {
            this.tableData = data;
            // console.log(this.tableData);
            this.loading = false;
          });
        }
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        name:'',
        recordNumber:null
      });
    }

}
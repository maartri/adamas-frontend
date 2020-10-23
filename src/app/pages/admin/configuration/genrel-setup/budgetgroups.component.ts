import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { ListService } from '@services/list.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-budgetgroups',
  templateUrl: './budgetgroups.component.html',
  styles: []
})
export class BudgetgroupsComponent implements OnInit {
  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Activity Budget Group";
  private unsubscribe: Subject<void> = new Subject();
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    private switchS:SwitchService,
    ){}
    
    ngOnInit(): void {
      this.buildForm();
      this.loadData();
      this.loading = true;
      this.cd.detectChanges();
    }
    loadTitle(){
      return this.title;
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
      this.title = "Edit Activity Budget Group";
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        recordNumber:recordNumber
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
      const group = this.inputForm;
      if(!this.isUpdate){         
        this.switchS.addData(  
          this.modalVariables={
            title: 'Activity Budget Groups'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            domain: 'BUDGETGROUP', 
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
              title: 'Activity Budget Groups'
            }, 
            this.inputVariables = {
              display: group.get('name').value,
              primaryId:group.get('recordNumber').value,
              domain: 'BUDGETGROUP',
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
          let sql ="select Description as name,recordNumber from DataDomains where Domain='BUDGETGROUP' ";
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
            name: '',
            recordNumber:null
          });
        }
      }
      
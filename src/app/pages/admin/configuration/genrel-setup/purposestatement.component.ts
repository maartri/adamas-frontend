import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { ListService } from '@services/list.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-purposestatement',
  templateUrl: './purposestatement.component.html',
  styles: [`
  textarea{
     resize:none;
  },
  table {
    table-layout: fixed; 
    width: 100%
  },  
  td{
    word-wrap: break-word;
  }
`],
})
export class PurposestatementComponent implements OnInit {

    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    modalVariables:any;
    inputVariables:any;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add Package Purpose Statement";
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
    loadData(){
      let sql ="select Description as name,recordNumber from DataDomains where Domain='PKGPURPOSE' ";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
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
        recordNumber
       } = this.tableData[index];
      this.inputForm.patchValue({
        porpose: name,
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
            title: 'Package Purpose Statements'
          }, 
          this.inputVariables = {
            display: group.get('porpose').value,
            domain: 'PKGPURPOSE', 
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
              title: 'Package Purpose Statements'
            }, 
            this.inputVariables = {
              display: group.get('porpose').value,
              primaryId:group.get('recordNumber').value,
              domain: 'PKGPURPOSE',
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
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        porpose: '',
        recordNumber:null
      });
    }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-op-note-categories',
  templateUrl: './op-note-categories.component.html',
  styles: []
})
export class OpNoteCategoriesComponent implements OnInit {

  tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    modalVariables:any;
    inputVariables:any;
    title:string = "Add OP Notes Groups"
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
      this.tableData = [{name:"test OP Notes Groups a"},{name:"test OP Notes Groups b"},{name:"test OP Notes Groups c"}];
      this.loading = false;
      this.cd.detectChanges();
    }
    showAddModal() {
      this.title = "Add OP Notes Groups"
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
      this.title = "Edit OP Notes Groups"
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
      let sql ="select Description as name,recordNumber from DataDomains where Domain='RECIPOPNOTEGROUPS' ";
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
        //     title: 'OP Notes Categories'
        //   }, 
        //   this.inputVariables = {
        //     display: group.get('name').value,
        //     domain: 'RECIPOPNOTEGROUPS',         
            
        //   }
        //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        //     if (data) 
        //     this.globalS.sToast('Success', 'Saved successful');     
        //     else
        //     this.globalS.sToast('Unsuccess', 'Data not saved' + data);
        //     this.loadData();
        //     this.postLoading = false;          
        //     this.handleCancel();
        //     this.resetModal();
        //    });
        }else{
          // this.postLoading = true;     
          // const group = this.inputForm;
          // this.switchS.updateData(  
          //   this.modalVariables={
          //     title: 'OP Notes Categories'
          //   }, 
          //   this.inputVariables = {
          //     display: group.get('name').value,
          //     primaryId:group.get('recordNumber').value,
          //     domain: 'RECIPOPNOTEGROUPS',
          //   }
            
          //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          //     if (data) 
          //     this.globalS.sToast('Success', 'Updated successful');     
          //     else
          //     this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
          //     this.loadData();
          //     this.postLoading = false;          
          //     this.isUpdate = false;
          //     this.handleCancel();
          //     this.resetModal();
          //    });
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

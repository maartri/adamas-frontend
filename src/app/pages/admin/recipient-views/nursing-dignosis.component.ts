import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nursing-dignosis',
  templateUrl: './nursing-dignosis.component.html',
  styles: []
})
export class NursingDignosisComponent implements OnInit {

  tableData: Array<any>;
    items:Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    modalVariables:any;
    inputVariables:any;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add New Nursing Diagnosis";
    private unsubscribe: Subject<void> = new Subject();
    constructor(
      private globalS: GlobalService,
      private cd: ChangeDetectorRef,
      private formBuilder: FormBuilder,
      private listS: ListService,
      private menuS:MenuService,
      private switchS:SwitchService,
    ){}
    
    ngOnInit(): void {
      this.buildForm();
      this.items = ["FEAR","Other Form of Leprosy","Bordline"]
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Nursing Diagnosis"
      this.resetModal();
      this.modalOpen = true;
    }
    loadTitle()
    {
      return this.title;
    }
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.title = "Edit New Nursing Diagnosis"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        description,
        code,
        usercode,
        Recordno
       } = this.tableData[index];
        this.inputForm.patchValue({
        name: description,
        icdcode:code,
        usercode:usercode,
        recordNumber:Recordno
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
      
      }else{
          
          }    
      }
      loadData(){
          let sql ="Select Recordno, Description, Code FROM NDiagnosisTypes  ORDER BY Description";
          this.loading = true;
          this.listS.getlist(sql).subscribe(data => {
            this.tableData = data;
            this.loading = false;
          });
      }
      delete(data: any) {
        this.postLoading = true;     
        const group = this.inputForm;
        this.menuS.deletenursingDiagnosis(data.recordno)
        .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) {
            this.globalS.sToast('Success', 'Data Deleted!');
            this.loadData();
            return;
          }
        });
      }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        name: '',
        icdcode: '',
        usercode:'',
        recordNumber:null
      });
    }

}

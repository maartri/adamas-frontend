import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService , MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-medical-procedures',
  templateUrl: './medical-procedures.component.html',
  styles: []
})
export class MedicalProceduresComponent implements OnInit {

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
    title:string = "Add New Medical Procedures";
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
      this.items = ["Leprosy","Other Form of Leprosy","Bordline"]
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Medical Procedures"
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
      this.title = "Edit New Medical Procedures"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        description,
        code,
        icdCode,
        recordNumber
       } = this.tableData[index];
        this.inputForm.patchValue({
          name    :     (description == null) ? '' : description,
          icdcode :     (icdCode == null) ? '' : icdCode,
          usercode:     (code == null) ? '' : code,
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
        this.postLoading = true;   
        const group = this.inputForm;
        let name             = group.get('name').value;
        let icdcode          = group.get('icdcode').value;
        let usercode         = group.get('usercode').value;
        let values           = name+"','"+icdcode+"','"+usercode;
        let sql              = "insert into MProcedureTypes([Description],[ICDCode],[Code]) Values ('"+values+"')"; 
        console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal();
        });
      }else{
        this.postLoading  = true;   
        const group       = this.inputForm;
        let name             = group.get('name').value;
        let icdcode          = group.get('icdcode').value;
        let usercode         = group.get('usercode').value; 
        let recordNumber     = group.get('recordNumber').value;
        let sql  = "Update MProcedureTypes SET [Description]='"+ name + "',[ICDCode] = '"+ icdcode + "',[Code] = '"+ usercode + "' WHERE [RecordNumber] ='"+recordNumber+"'";
        console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Updated successful');     
          else
          this.globalS.sToast('Success', 'Updated successful');
          this.postLoading = false;      
          this.loadData();
          this.handleCancel();
          this.resetModal();   
          this.isUpdate = false; 
        });
      }    
      }
      loadData(){
          let sql ="Select RecordNumber, Description, Code,ICDCode FROM MProcedureTypes where RecordNumber > 6300 ORDER BY RecordNumber desc";
          this.loading = true;
          this.listS.getlist(sql).subscribe(data => {
            this.tableData = data;
            console.log(data);
            this.loading = false;
          });
      }
      delete(data: any) {
        this.postLoading = true;     
        const group = this.inputForm;
        this.menuS.deleteMProcedureTypes(data.recordNumber)
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

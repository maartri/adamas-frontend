import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';

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
      private switchS:SwitchService,
    ){}
    
    ngOnInit(): void {
      this.buildForm();
      this.items = ["Leprosy","Other Form of Leprosy","Bordline"]
      // this.tableData = [{name:"Leprosy",icdcode:'R.28'},{name:"Bordline",icdcode:'R.22'},{name:"Other Form of Leprosy",icdcode:'R.16'},{name:"Leprosy",icdcode:'R.5'}]
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
        icd,
        recordNumber
       } = this.tableData[index];
        this.inputForm.patchValue({
        name: description,
        icdcode:icd,
        usercode:code,
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
      //   this.switchS.addData(  
      //     this.modalVariables={
      //       title: 'CDC Claim Rates'
      //     }, 
      //     this.inputVariables = {
      //       item: group.get('item').value,
      //       rate: group.get('rate').value,
      //       domain: 'PACKAGERATES', 
      //     }
      //     ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      //       if (data) 
      //       this.globalS.sToast('Success', 'Saved successful');     
      //       else
      //       this.globalS.sToast('Unsuccess', 'Data not saved' + data);
      //       this.loadData();
      //       this.postLoading = false;          
      //       this.handleCancel();
      //       this.resetModal();
      //     });
      }else{
          // this.postLoading = true;     
          // const group = this.inputForm;
          // // console.log(group.get('item').value);
          // this.switchS.updateData(  
          //   this.modalVariables={
          //     title: 'CDC Claim Rates'
          //   }, 
          //   this.inputVariables = {
          //     item: group.get('item').value,
          //     rate: group.get('rate').value,
          //     recordNumber:group.get('recordNumber').value,
          //     domain: 'PACKAGERATES',
          //   }
            
          //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          //     if (data) 
          //     this.globalS.sToast('Success', 'Updated successful');     
          //     else
          //     this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
          //     this.loadData();
          //     this.postLoading = false;          
          //     this.handleCancel();
          //     this.resetModal();
          //   });
          }    
      }
      loadData(){
          let sql ="Select RecordNumber, Description, Code FROM MProcedureTypes where RecordNumber < 500 ORDER BY Description";
          this.loading = true;
          this.listS.getlist(sql).subscribe(data => {
            this.tableData = data;
            console.log(data);
            this.loading = false;
          });
          // let sql2 = "Select RecordNumber, Description, Code FROM MProceduresTypes  ORDER BY Description";
          // this.listS.getlist(sql2).subscribe(data => {
            // this.items = data;
            // console.log(data);
          // });
      }
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
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
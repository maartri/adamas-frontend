import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService ,MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-staff-competencies',
  templateUrl: './staff-competencies.component.html',
  styles: []
})
export class StaffCompetenciesComponent implements OnInit {
  
  tableData: Array<any>;
  items:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables:any;
  dateFormat: string = 'dd/MM/yyyy';
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Staff Competencies";
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    private menuS: MenuService,
    private switchS:SwitchService,
    ){}
    
    ngOnInit(): void {
      this.buildForm();
      // this.items = ["Leprosy","Other Form of Leprosy","Bordline"]
      // this.tableData = [{name:"Leprosy",icdcode:'R.28'},{name:"Bordline",icdcode:'R.22'}]
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Staff Competencies"
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
      this.title = "Edit Staff Competencies"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        description,
        code,
        usercode,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        name: description,
        icdcode:code,
        usercode:usercode,
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
        this.postLoading = false;
        this.isUpdate = false;
        this.resetModal();
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
      let sql ="Select RecordNumber, Description, Embedded AS Mandatory From DataDomains Where Domain = 'STAFFATTRIBUTE' ORDER BY DESCRIPTION";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        console.log(data);
        this.loading = false;
      });
      let sql2 = "Select RecordNumber, Description From DataDomains Where Domain = 'COMPETENCYGROUP'  ORDER BY DESCRIPTION";
      this.listS.getlist(sql2).subscribe(data => {
        this.items = data;
        console.log(data);
      });
    }
    
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteDomain(data.recordNumber)
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
  
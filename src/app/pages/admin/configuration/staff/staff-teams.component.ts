import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService , MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-staff-teams',
  templateUrl: './staff-teams.component.html',
  styles: []
})
export class StaffTeamsComponent implements OnInit {
  
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
  title:string = "Add New Staff Team";
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
      // this.items = ["LEVEL 1","LEVEL 2","LEVEL 3","LEVEL 4","DEMENTIA/CONGNITION VET 1","DEMENTIA/CONGNITION VET 2","DEMENTIA/CONGNITION VET 3","DEMENTIA/CONGNITION VET 4","OXYGEN"]
      
      this.loadData();
      
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Staff Team"
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
      this.title = "Edit New Staff Team"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        branch,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        item: branch,
        rate:name,
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
        // this.switchS.addData(  
        //   this.modalVariables={
        //     title: 'CDC Claim Rates'
        //   }, 
        //   this.inputVariables = {
        //     item: group.get('item').value,
        //     rate: group.get('rate').value,
        //     domain: 'PACKAGERATES', 
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
        //   });
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
        // console.log(group.get('item').value);
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
      let sql ="select Description as name,User1 as branch,recordNumber from DataDomains where Domain='STAFFTEAM'";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
      
      let branch = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'BRANCHES' ORDER BY Description";
      this.listS.getlist(branch).subscribe(data => {
        this.items = data;
        this.loading = false;
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
        item: '',
        rate: '',
        recordNumber:null
      });
    }
    
  }
  
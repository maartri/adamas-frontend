import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-award-details',
  templateUrl: './award-details.component.html',
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
`]
})
export class AwardDetailsComponent implements OnInit {

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
    title:string = "Add New Award Details";
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
      // this.items = ["LEVEL 1","LEVEL 2","LEVEL 3","LEVEL 4","DEMENTIA/CONGNITION VET 1","DEMENTIA/CONGNITION VET 2","DEMENTIA/CONGNITION VET 3","DEMENTIA/CONGNITION VET 4","OXYGEN"]
      this.loadData();

      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Award Details"
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
      this.title = "Edit New Award Details"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        code,
        description,
        category,
        level,
        notes,
        recordNumber
       } = this.tableData[index];
      this.inputForm.patchValue({
        item: code,
        description:description,
        category:category,
        level:level,
        notes:notes,
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
          let sql ="SELECT RecordNo, Code, Description, Category, Level FROM AwardPos";
          this.loading = true;
          this.listS.getlist(sql).subscribe(data => {
            this.tableData = data;
            this.loading = false;
          });

          let branch = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'AWARDLEVEL' ORDER BY Description";
          this.listS.getlist(branch).subscribe(data => {
            this.items = data;
            this.loading = false;
          });

        }
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        item: '',
        description: '',
        category: '',
        level: '',
        notes: '',
        recordNumber:null
      });
    }

}

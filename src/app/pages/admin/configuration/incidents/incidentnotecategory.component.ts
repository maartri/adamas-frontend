import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-incidentnotecategory',
  templateUrl: './incidentnotecategory.component.html',
  styles: []
})
export class IncidentnotecategoryComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  modalVariables:any;
  inputVariables:any;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Recipient Incident Note Category";
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
  loadData(){
    let sql ="select Description as name,recordNumber from DataDomains where Domain='RECIMNTECAT' ";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.tableData = data;
      this.loading = false;
    });
  }
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
  
  showEditModal(index: any) {
    // debugger;
    this.title = "Edit Recipient Incident Note Category"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
      const {
          name,
          recordNumber,
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
          title: 'Recipient Incident Note Categories'
        }, 
        this.inputVariables = {
          display: group.get('name').value,
          domain: 'RECIMNTECAT',         
          
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
            title: 'Recipient Incident Note Categories'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            primaryId:group.get('recordNumber').value,
            domain: 'RECIMNTECAT',
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
      name: '',
      recordNumber:null
    });
  }

}

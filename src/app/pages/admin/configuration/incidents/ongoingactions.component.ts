import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import {ListService} from '@services/list.service';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuService } from '@services/menu.service';

@Component({
  selector: 'app-ongoingactions',
  templateUrl: './ongoingactions.component.html',
  styles: []
})
export class OngoingactionsComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  modalVariables: any;
  inputVariables:any;
  title:string = "Add Ongoing Action"
  private unsubscribe: Subject<void> = new Subject();
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder
  ){}
  
  loadTitle()
  {
    return this.title;
  }
  loadData(){
    let sql ="select Description as name,recordNumber from DataDomains where Domain='IMActionOn' ";
    this.loading = true;
    sql
    this.listS.getlist(sql).subscribe(data => {
      this.tableData = data;
      console.log(this.tableData);
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
    this.title = "edit Ongoing Action"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
      const { 
          name,
          recordNumber
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
  save() {
    this.postLoading = true;     
    const group = this.inputForm;
    if(!this.isUpdate){         
      this.switchS.addData(  
        this.modalVariables={
          title: 'Ongoing Actions'
        }, 
        this.inputVariables = {
          display: group.get('name').value,
          domain: 'IMActionOn',         
          
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
            title: 'Ongoing Actions'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            primaryId:group.get('recordNumber').value,
            domain: 'IMActionOn',
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
      recordNumber:null
    });
  }

}

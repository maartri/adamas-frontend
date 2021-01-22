import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuService } from '@services/menu.service';


@Component({
  selector: 'app-addresstypes',
  templateUrl: './addresstypes.component.html',
  styles: []
})
export class AddresstypesComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Address Type";
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
    this.loadData();
    this.loading = true;
    this.cd.detectChanges();
  }
  loadTitle(){
    return this.title;
  }
  showAddModal() {
    this.title = "Add Address Type";
    this.resetModal();
    this.modalOpen = true;
  }
  
  resetModal() {
    this.current = 0;
    this.inputForm.reset();
    this.postLoading = false;
  }
  
  showEditModal(index: any) {
    this.isUpdate = true;
    this.modalOpen = true;
    this.title = "Edit Address Type";
    this.current = 0;
    
    const { 
      name,
      recordNumber
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
          title: 'Address Types'
        }, 
        this.inputVariables = {
          display: group.get('name').value,
          domain: 'ADDRESSTYPE', 
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
            title: 'Address Types'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            primaryId:group.get('recordNumber').value,
            domain: 'ADDRESSTYPE',
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
      loadData(){
        let sql ="select Description as name,recordNumber from DataDomains where Domain='ADDRESSTYPE'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
          this.tableData = data;
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
          name: '',
          recordNumber:null
        });
      }
}

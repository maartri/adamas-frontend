import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: []
})
export class VehiclesComponent implements OnInit {
  
  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  modalVariables:any;
  inputVariables:any;
  title:string = "Add Vehicles"
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
      // debugger;
      return this.title;
    }
    
    ngOnInit(): void {
      this.buildForm();
      this.loadData();
      // this.tableData = [{name:"test Vehicles a"},{name:"test Vehicles b"},{name:"test Vehicles c"}];
      this.loading = false;
      this.cd.detectChanges();
    }
    showAddModal() {
      this.title = "Add Vehicles"
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
      this.title = "Edit Vehicles"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        recordNumber,
      } = this.tableData[index-1];
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
      this.loading = true;
      this.menuS.getlistvehicles().subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){         
        this.switchS.addData(  
          this.modalVariables={
            title: 'Vehicles'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            domain: 'VEHICLES',         
            
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
              title: 'Vehicles'
            }, 
            this.inputVariables = {
              display: group.get('name').value,
              primaryId:group.get('recordNumber').value,
              domain: 'VEHICLES',
            }
            
            ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
              if (data) 
              this.globalS.sToast('Success', 'Updated successful');     
              else
              this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
              this.loadData();
              this.postLoading = false;          
              this.isUpdate = false;
              this.handleCancel();
              this.resetModal();
            });
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
      
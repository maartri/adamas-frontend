import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-funding-regions',
  templateUrl: './funding-regions.component.html',
  styleUrls: ['./funding-regions.component.css']
})
export class FundingRegionsComponent implements OnInit {
  
  tableData: Array<any>;
  fundinglist: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  modalVariables: any;
  inputVariables:any;
  title:string = "Add Funding Regions"
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
      return this.title;
    }
    ngOnInit(): void {
      this.buildForm();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    loadData(){
      let sql ="select Description as name,recordNumber from DataDomains where Domain='FUNDREGION' ";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
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
      this.title = "Edit Funding Regions"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        description: name,
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
            title: 'Funding Regions'
          }, 
          this.inputVariables = {
            display: group.get('description').value,
            domain: 'FUNDREGION',         
            
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
              title: 'Funding Regions'
            }, 
            this.inputVariables = {
              display: group.get('description').value,
              primaryId:group.get('recordNumber').value,
              domain: 'FUNDREGION',
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
          console.log(data.recordNumber);
          let sql ="delete from DataDomains where Domain='FUNDREGION' and recordNumber = '"+data.recordNumber+"'";
          this.listS.deleteSql(sql)
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
              description: '',
              recordNumber:0,
            });
          }
        }
        
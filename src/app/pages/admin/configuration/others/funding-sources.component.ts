import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-funding-sources',
  templateUrl: './funding-sources.component.html',
  styles: []
})
export class FundingSourcesComponent implements OnInit {
  
  tableData: Array<any>;
  dateFormat: string = 'dd/MM/yyyy';
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add Funding Sources";
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder
  ){}
    
    ngOnInit(): void {
      this.buildForm();
      // this.populateDropdowns();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    loadData(){
      this.loading = true;
      this.menuS.getlistFundingSource().subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    showAddModal() {
      this.heading = "Add Funding Sources"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit Funding Sources"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        description,
        user1,
        user2,
        endDate,
        recordNumber,
        
      } = this.tableData[index];
      this.inputForm.patchValue({
        name:description,
        glrevnue:user1,
        glcost:user2,
        end_date:endDate, 
        recordNumber:recordNumber,
      });
    }
    loadtitle(){
      return this.heading
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
      
      if(!this.isUpdate){        
        this.postLoading = true;   
        const group = this.inputForm;
        let domain       = 'FUNDINGBODIES';
        let name         = group.get('name').value;
        let glrevnue     = group.get('glrevnue').value;
        let glcost       = group.get('glcost').value;
        let end_date     = this.globalS.convertDbDate(group.get('end_date').value);

        let values = domain+"','"+name+"','"+glrevnue+"','"+glcost+"','"+end_date;
        let sql = "insert into DataDomains([Domain],[Description],[User1],[User2],[EndDate]) Values ('"+values+"')"; 
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
        let name          = group.get('name').value;
        let glrevnue      = group.get('glrevnue').value;
        let glcost        = group.get('glcost').value;
        let end_date      =  this.globalS.convertDbDate(group.get('end_date').value);
        let recordNumber  = group.get('recordNumber').value;
        
        let sql  = "Update DataDomains SET [Description]='"+ name + "',[User1] = '"+ glrevnue + "',[User2] = '"+ glcost + "',[EndDate] = '"+ end_date+ "' WHERE [RecordNumber] ='"+recordNumber+"'";
        
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          this.postLoading = false;      
          this.loadData();
          this.handleCancel();
          this.resetModal();   
          this.isUpdate = false; 
        });
      }
    }
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        name:'',
        glrevnue:'',
        glcost:'',
        end_date:'',
        recordNumber:null,
      });
    }
    
    
  }
  
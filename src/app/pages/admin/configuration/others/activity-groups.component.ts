import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReplaceNullWithTextPipe } from '@pipes/pipes';
@Component({
  selector: 'app-activity-groups',
  templateUrl: './activity-groups.component.html',
  styles: [],
  providers: [ReplaceNullWithTextPipe]
})
export class ActivityGroupsComponent implements OnInit {
  
  tableData: Array<any>;
  items:Array<any>;
  groups:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Activity Group";
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    private menuS: MenuService,
    private replaceNullWithText: ReplaceNullWithTextPipe,
    private switchS:SwitchService,
    ){}
    
    ngOnInit(): void {
      this.buildForm();
      this.groups = ["MEALS","MAINT/MOD","SOCIAL"];
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Activity Group"
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
      this.title = "Edit New Activity Group"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        branch,
        agroup,
        recordNumber
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        item: branch,
        rate:name,
        agroup:(agroup == null) ? '' : agroup,
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
        this.postLoading = true;   
        const group = this.inputForm;
        let domain       = 'ACTIVITYGROUPS';
        let item         = group.get('item').value;
        let rate         = group.get('rate').value;
        let agroup       = group.get('agroup').value;

        let values = domain+"','"+rate+"','"+item+"','"+agroup;
        let sql = "insert into DataDomains([Domain],[Description],[User1],[User2]) Values ('"+values+"')"; 
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
        let domain        = 'ACTIVITYGROUPS';
        let item          = group.get('item').value;
        let rate          = group.get('rate').value;
        let agroup        = group.get('agroup').value; 
        let recordNumber  = group.get('recordNumber').value;
        
        let sql  = "Update DataDomains SET [Description]='"+ rate + "',[User1] = '"+ item + "',[User2] = '"+ agroup + "' WHERE [RecordNumber] ='"+recordNumber+"'";
        
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
    loadData(){
      this.menuS.getlistactivityGroups().subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
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
        agroup:'',
        recordNumber:null
      });
    }
    
  }
  
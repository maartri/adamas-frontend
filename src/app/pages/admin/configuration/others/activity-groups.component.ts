import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-activity-groups',
  templateUrl: './activity-groups.component.html',
  styles: []
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
        agroup:agroup,
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
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
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
  
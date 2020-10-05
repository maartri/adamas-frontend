import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeSheetService, GlobalService, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';

@Component({
  selector: 'app-branches',
  
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  
  tabset = false;
    isVisibleTop =false;
    showtabother = false;
    showtabRostcriteria= false;
    showtabstaffcriteria= false;
    showtabRegcriteria= false;
    showtabrecpcriteria = false;
    show =false ;
    showoption = true;
    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    workStartHour: Array<any>;
    workFinsihHour: Array<any>;
    constructor(
    private globalS: GlobalService,
    private listS: ListService,
    private switchS: SwitchService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder) { }
    
    ngOnInit(): void {
      this.buildForm();      
      this.switchS.getData(1).subscribe(data => this.tableData = data);

      
      this.workStartHour = [{ name:"ADAMAS"},{name:"ASHMORE"}];
      this.workFinsihHour = [{ name:"ADAMAS"},{name:"ASHMORE"}]
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
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      
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
      this.globalS.sToast('Success', 'Changes saved');
      this.handleCancel();
      this.resetModal();
    }
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        name: '',
        glRevene:'',
        glCost:'',
        centerName:'',
        addrLine1:'',
        addrLine2:'',
        startHour:'',
        finishHour:'',
        earlyStart:'',
        lateStart:'',
        earlyFinish:'',
        lateFinish:'',
        overstay:'',
        understay:'',
        t2earlyStart:'',
        t2lateStart:'',
        t2earlyFinish:'',
        t2lateFinish:'',
        t2overstay:'',
        t2understay:'',
      });
    }
    
  }
  
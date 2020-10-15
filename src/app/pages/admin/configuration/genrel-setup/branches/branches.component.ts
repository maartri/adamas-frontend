import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeSheetService, GlobalService, ClientService, StaffService,ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-branches',
  
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  
  private unsubscribe: Subject<void> = new Subject();
  branchList: Array<any>;
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
    private formBuilder: FormBuilder,
    private menuS: MenuService) { }

    
    ngOnInit(): void {
      this.buildForm();      
      this.loadBranches();
      
      this.workStartHour = ["00:15","00:30"];
      this.workFinsihHour = [{ name:"ADAMAS"},{name:"ASHMORE"}]
      // this.loading = false;
      // this.cd.detectChanges();
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
      
      // console.log(index);
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        recordNumber,
        description,
        glRevene,
        glCost,
        centerName,
        addrLine1,
        addrLine2,
        phone,
        startHour,
        finishHour,
        lateStart,
        lateFinish,
        earlyStart,
        earlyFinish,
        overstay,
        understay,
        t2earlyStart,
        t2lateStart,
        t2earlyFinish,
        t2lateFinish,
        t2overstay,
        t2understay,
      }= this.tableData[index];
      this.inputForm.patchValue({
        recordNumber:recordNumber,
        name:description,
        glRevene:glRevene,
        glCost:glCost,
        centerName:centerName,
        addrLine1:addrLine1,
        addrLine2:addrLine2,
        Phone:phone,
        startHour:startHour,
        finishHour:finishHour,
        earlyStart:earlyStart,
        lateStart:lateStart,
        earlyFinish:earlyFinish,
        lateFinish:lateFinish,
        overstay:overstay,
        understay:understay,
        t2earlyStart:t2earlyStart,
        t2lateStart:t2lateStart,
        t2earlyFinish:t2earlyFinish,
        t2lateFinish:t2lateFinish,
        t2overstay:t2overstay,
        t2understay:t2understay,
      })      
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
      if(!this.isUpdate){
        const group = this.inputForm;
        this.menuS.AddBranch({
          name: group.get('name').value,
          glRevene: group.get('glRevene').value,
          glCost: group.get('glCost').value,
          centerName: group.get('centerName').value,
          addrLine1: group.get('addrLine1').value,
          addrLine2: group.get('addrLine2').value,
          Phone: group.get('Phone').value,
          startHour: group.get('startHour').value,
          finishHour: group.get('finishHour').value,
          earlyStart: group.get('earlyStart').value,
          lateStart: group.get('lateStart').value,
          earlyFinish: group.get('earlyFinish').value,
          lateFinish : group.get('lateFinish').value,
          overstay: group.get('overstay').value,
          understay: group.get('understay').value,
          t2earlyStart: group.get('t2earlyStart').value,
          t2lateStart: group.get('t2lateStart').value,
          t2earlyFinish: group.get('t2earlyFinish').value,
          t2lateFinish: group.get('t2lateFinish').value,
          t2overstay: group.get('t2overstay').value,
          t2understay: group.get('t2understay').value,
          recordNumber: group.get('recordNumber').value
        }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Unsuccess', 'Data not saved' + data);

          this.loadBranches();
          this.handleCancel();
          this.resetModal();    
        });
      }else{
          const group = this.inputForm;
          console.log(group.get('recordNumber').value);
          // return false;
          this.menuS.UpdateBranch({
          name: group.get('name').value,
          glRevene: group.get('glRevene').value,
          glCost: group.get('glCost').value,
          centerName: group.get('centerName').value,
          addrLine1: group.get('addrLine1').value,
          addrLine2: group.get('addrLine2').value,
          Phone: group.get('Phone').value,
          startHour: group.get('startHour').value,
          finishHour: group.get('finishHour').value,
          earlyStart: group.get('earlyStart').value,
          lateStart: group.get('lateStart').value,
          earlyFinish: group.get('earlyFinish').value,
          lateFinish : group.get('lateFinish').value,
          overstay: group.get('overstay').value,
          understay: group.get('understay').value,
          t2earlyStart: group.get('t2earlyStart').value,
          t2lateStart: group.get('t2lateStart').value,
          t2earlyFinish: group.get('t2earlyFinish').value,
          t2lateFinish: group.get('t2lateFinish').value,
          t2overstay: group.get('t2overstay').value,
          t2understay: group.get('t2understay').value,
          recordNumber: group.get('recordNumber').value,
        }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) 
          this.globalS.sToast('Success', 'Update successful');     
          else
          this.globalS.sToast('Unsuccess', 'Data not saved' + data);

          this.loadBranches();
          this.handleCancel();
          this.resetModal();    
        });
      this.isUpdate = false;
      }
      // this.handleCancel();
      // this.resetModal();
    }
    
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        recordNumber: null,
        name: '',
        glRevene:'',
        glCost:'',
        centerName:'',
        addrLine1:'',
        addrLine2:'',
        Phone:'',
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
    
    loadBranches(){
      this.loading = true;
      this.menuS.getlistbranches().subscribe(data => {
        this.branchList = data;
        this.tableData = data;
        console.log(this.branchList);
        this.loading = false;
        this.cd.detectChanges();
      });
    }
  }
  
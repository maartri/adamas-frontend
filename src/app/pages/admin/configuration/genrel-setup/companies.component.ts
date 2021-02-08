import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzTabPosition } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styles: [`
  .mrg-btm{
    margin-bottom:0.3rem;
  },
  textarea{
    resize:none;
  },
  .staff-wrapper{
    height: 20rem;
    width: 100%;
    overflow: auto;
    padding: .5rem 1rem;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
  }
  `]
})
export class CompaniesComponent implements OnInit {

  private unsubscribe: Subject<void> = new Subject();
  branchList: Array<any>;
  sqlserverList:Array<any>;
  emailTypes:Array<any>;
  incidentTypes:Array<any>;
  billingType:Array<any>;
  emailSubjectType:Array<any>;
  awardEnforcementTypes:Array<any>;
  browsers:Array<any>;
  tabset = false;
  isVisibleTop =false;
  showtabother = false;
  position: NzTabPosition = 'left';
  showtabRostcriteria= false;
  showtabstaffcriteria= false;
  showtabRegcriteria= false;
  showtabrecpcriteria = false;
  show =false ;
  showoption = true;
  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  modalOpenelipsis : boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  settingForm:FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Company";
  workStartHour: Array<any>;
  workFinsihHour: Array<any>;
  tabs = [1, 2, 3];
  options = [
    { value: 'top', label: 'top' },
    { value: 'left', label: 'left' },
    { value: 'right', label: 'right' },
    { value: 'bottom', label: 'bottom' }
  ];
  constructor(
    private globalS: GlobalService,
    private listS: ListService,    
    private switchS: SwitchService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private menuS: MenuService) { }

    
    ngOnInit(): void {
      
      this.buildForm(); 
      this.populateDropdowns();
      this.loadData();     
      // this.loadBranches();
      
      // this.loading = false;
      // this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Company";
      this.resetModal();
      this.modalOpen = true;
    }
    showEditElipsisModal(index:any){
      this.modalOpenelipsis = true;
    }
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.title = "Edit Company";  
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
    loadTitle()
    {
      return this.title;
    }     
    handleCancel() {
      this.modalOpen = false;
    }
    handleCancelellipsis(){
      this.modalOpenelipsis = false;
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

          // this.loadBranches();
          this.loadData();
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

          // this.loadBranches();
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
      this.settingForm = this.formBuilder.group({
        title:'',
        name:'',
        branch:'',
        checkboxcheck:false,
        incRecipient:'NDIA',
        incStaff:'NDIA',
        google:'Google'
      });
      this.inputForm = this.formBuilder.group({
        recordNumber: null,
        name: '',
        inputValue:'',
        glRevene:'',
        glCost:'',
        centerName:'',
        addrLine1:'',
        addrLine2:'',
        Phone:'',
        branch:'',
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
    populateDropdowns(){
      this.sqlserverList    = ['2000','2005','2008','2012'];
      this.emailTypes       = ['OUTLOOK','TRACCS'];
      this.incidentTypes    = ['NDIA','AUTO','WA','QLD','AGED CARE']
      this.billingType      = ['CONSOLIDATED BILLING','PROGRAM BILLING'];
      this.emailSubjectType = ['BILLING CLIENT/INVOICE NUMBER/COMPANY NAME','CUSTOM'];
      this.awardEnforcementTypes = ['No Enforcement','Warm On Breach','Prevent Breach'];
      this.browsers = ['Google','Bing'];
    }
    loadData(){
      let sql ="Select RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain = 'COMPANY'  ORDER BY DESCRIPTION";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.branchList = data;
        this.tableData = data;
        this.loading = false;
      });
    }
    // loadBranches(){
    //   this.loading = true;
    //   this.menuS.getlistbranches().subscribe(data => {
    //     this.branchList = data;
    //     this.tableData = data;
    //     console.log(this.branchList);
    //     this.loading = false;
    //     this.cd.detectChanges();
    //   });
    // }

}

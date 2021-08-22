import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TimeSheetService, GlobalService, ClientService, StaffService,ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, MenuService } from '@services/index';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
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
export class BillingComponent implements OnInit {

  branchList: Array<any>;
  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  billingType:Array<any>;
  AccountPackage:Array<any>;
  invType:Array<any>;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables: any;
  dateFormat: string = 'dd/MM/yyyy';
  inputVariables: any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title: string = "Debtor Updates and Exports";
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token: any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean = false;
  check: boolean = false;
  temp_title: any;
  settingForm: FormGroup;
  whereString :string="Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private menuS: MenuService,
  ) { }

  ngOnInit(): void {
    this.buildForm();      
    this.loadBranches();
    this.loadPrograms();
    this.populateDropdowns();
    this.modalOpen = true;
    this.cd.detectChanges();
  }
  loadTitle() {
    return this.title
  }
  resetModal() {
    this.current = 0;
    this.inputForm.reset();
    this.postLoading = false;
  }
  handleCancel() {
    this.modalOpen = false;
    this.router.navigate(['/admin/billing']);
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      name: '',
      billingMode:'CONSOLIDATED BILLING',
      AccPackage: 'TEST 1',
      invType: 'General',
    });
  }
// buildForm() {
//   this.settingForm = this.formBuilder.group({
//     name:'',
//     billing:'CONSOLIDATED BILLING',
//     title:'',
//     branch:'',
//     checkboxcheck:false,
//     incStaff:'NDIA',
//     google:'Google'
//   })}
  populateDropdowns(){
    this.billingType      = ['CONSOLIDATED BILLING','PROGRAM BILLING'];
    this.AccountPackage   = ['TEST 1','TEST 2'];
    this.invType          = ['CDC Homecare Package Invoices','NDIA Claim Update Invoices','General','Re-Export Existing Batch','ALL'];
  }
  loadBranches(){
    this.loading = true;
    this.menuS.getlistbranches(this.check).subscribe(data => {
      this.branchList = data;
      this.tableData = data;
      // console.log(this.branchList);
      this.loading = false;
      this.cd.detectChanges();
    });
  }
  loadPrograms(){
    this.loading = true;
    this.menuS.getlistProgramPackages(this.check).subscribe(data => {
      this.tableData = data;
      this.loading = false;
      this.cd.detectChanges();
    });
  }
  fetchAll(e){
    if(e.target.checked){
      this.whereString = "WHERE";
      this.loadBranches();
    }else{
      this.whereString = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
      this.loadBranches();
    }
  }
}

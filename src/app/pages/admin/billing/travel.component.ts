import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BillingService, TimeSheetService, GlobalService, ListService, MenuService } from '@services/index';
import { timeout } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { setDate } from 'date-fns';

@Component({
  selector: 'app-billing1',
  templateUrl: './travel.component.html',
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
export class TravelComponent implements OnInit {

  branchList: Array<any>;
  programList: Array<any>;
  activityList: Array<any>;
  paytypeList: Array<any>;
  categoriesList: Array<any>;
  batchHistoryList: Array<any>;
  tableData: Array<any>;
  PayPeriodLength: number;
  PayPeriodEndDate: any;

  loading: boolean = false;
  modalOpen: boolean = false;
  billingType: Array<any>;
  AccountPackage: Array<any>;
  invType: Array<any>;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables: any;
  dateFormat: string = 'dd/MM/yyyy';
  inputVariables: any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title: string = "Travel Audit And Update";
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token: any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean = false;
  check: boolean = false;
  temp_title: any;
  settingForm: FormGroup;
  userRole:string="userrole";
  whereString: string = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  dtpEndDate: any;
  dtpStartDate: any;
  selectedBranches: any;
  selectedPrograms: any[];
  selectedCategories: any;
  allBranchesChecked: boolean;
  allProgramsChecked: boolean;
  allCategoriesChecked: boolean;
  filteredResult: any;


  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private globalS: GlobalService,
    private listS: ListService,
    private formBuilder: FormBuilder,
    private menuS: MenuService,
    private timesheetS: TimeSheetService,
    private billingS: BillingService,
  ) { }

  ngOnInit(): void {
    this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
    this.userRole = this.tocken.role;
    this.buildForm();
    this.loadBranches();
    this.loadPrograms();
    this.loadCategories();
    this.populateDropdowns();
    this.loadBatchHistory();
    this.GetPayPeriodEndDate();
    this.GetPayPeriodLength();
    this.loading = false;
    this.modalOpen = true;
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
    this.router.navigate(['/admin/timesheet-processing']);
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      billingMode: 'CONSOLIDATED BILLING',
      AccPackage: 'TEST 1',
      name: null,
      timesheetDate: new Date(),
      dtpStartDate: '01/12/2021',
      dtpEndDate: '01/12/2021',
      invType: 'General',
      programList: '',
      activityList: '',
      paytypeList: '',
    });
  }
  populateDropdowns() {
    this.billingType = ['CONSOLIDATED BILLING', 'PROGRAM BILLING'];
    this.AccountPackage = ['TEST 1', 'TEST 2'];
    this.invType = ['CDC Homecare Package Invoices', 'NDIA Claim Update Invoices', 'General', 'Re-Export Existing Batch', 'ALL'];
  }
  loadBranches() {
    this.loading = true;
    this.menuS.getlistbranches(this.check).subscribe(data => {
      this.branchList = data;
      this.tableData = data;
      this.loading = false;
      this.allBranchesChecked = true;
      this.checkAll(1);
    });
  }

  loadPrograms() {
    this.loading = true;
    this.menuS.getlistProgramPackages(this.check).subscribe(data => {
      this.programList = data;
      this.tableData = data;
      this.loading = false;
      this.allProgramsChecked = true;
      this.checkAll(2);
    });
  }

  loadCategories() {
    this.loading = true;
    this.timesheetS.getlistcategories().subscribe(data => {
      this.categoriesList = data;
      this.tableData = data;
      this.loading = false;
      this.allCategoriesChecked = true;
      this.checkAll(3);
    });
  }
  
  log(event: any, index: number) {
    if (index == 1)
      this.selectedBranches = event;
    if (index == 2)
      this.selectedPrograms = event;
    if (index == 3)
      this.selectedCategories = event;
  }

  checkAll(index: number): void {
    if (index == 1) {
      this.branchList.forEach(x => {
        x.checked = true;
        this.allBranchesChecked = x.description;
        this.allBranchesChecked = true;
      });
    }
    if (index == 2) {
      this.programList.forEach(x => {
        x.checked = true;
        this.allProgramsChecked = x.description;
        this.allProgramsChecked = true;
      });
    }
    if (index == 3) {
      this.categoriesList.forEach(x => {
        x.checked = true;
        this.allCategoriesChecked = x.description;
        this.allCategoriesChecked = true;
      });
    }
  }

  uncheckAll(index: number): void {
    if (index == 1) {
      this.branchList.forEach(x => {
        x.checked = false;
        this.allBranchesChecked = false;
        this.selectedBranches = [];
      });
    }
    if (index == 2) {
      this.programList.forEach(x => {
        x.checked = false;
        this.allProgramsChecked = false;
        this.selectedPrograms = [];
      });
    }
    if (index == 3) {
      this.categoriesList.forEach(x => {
        x.checked = false;
        this.allCategoriesChecked = false;
        this.selectedCategories = [];
      });
    }
  }
  loadBatchHistory() {
    let sql = "Select pay_bill_batch.RecordNumber, pay_bill_batch.OperatorID, pay_bill_batch.BatchDate, pay_bill_batch.BatchNumber, pay_bill_batch.BatchDetail, pay_bill_batch.BatchType, pay_bill_batch.CDCBilled, pay_bill_batch.Date1, pay_bill_batch.Date2, pay_bill_batch.BillBatch# as BillBatch, pay_bill_batch.xDeletedRecord, pay_bill_batch.xEndDate FROM pay_bill_batch INNER JOIN batch_record on batchnumber = batch_record.BCH_NUM WHERE batch_record.bch_type in ('B','S') ORDER BY convert(int, batchnumber) DESC";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.batchHistoryList = data;
      this.tableData = data;
      this.loading = false;
    });
  }

  GetPayPeriodEndDate() {
    let sql = "SELECT convert(varchar, PayPeriodEndDate, 101) AS PayPeriodEndDate FROM SysTable"
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      if (data[0].payPeriodEndDate != "") {
        this.dtpEndDate = data[0].payPeriodEndDate;
        this.inputForm.patchValue({
          dtpEndDate: this.dtpEndDate,
        })
      }
      else {
        this.inputForm.patchValue({
          dtpEndDate: new Date()
        });
        this.dtpEndDate = new Date
      }
    });
  }
  GetPayPeriodLength(){
    let fsql = "SELECT DefaultPayPeriod as DefaultPayPeriod FROM Registration";
    this.listS.getlist(fsql).subscribe(fdata => {
      if (fdata[0].defaultPayPeriod != "") {
        this.PayPeriodLength = fdata[0].defaultPayPeriod
      }
      else {
        this.PayPeriodLength = 14
      }      
      var firstDate = new Date(this.dtpEndDate);
      firstDate.setDate(firstDate.getDate() - (this.PayPeriodLength - 1));
      this.dtpStartDate = formatDate(firstDate, 'MM-dd-yyyy','en_US');
      this.inputForm.patchValue({
        dtpStartDate: this.dtpStartDate,
      });
    });
  }
}



import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { ListService, MenuService } from '@services/index';
import { TimeSheetService, GlobalService, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, MenuService } from '@services/index';

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
  programList: Array<any>;
  categoriesList: Array<any>;
  batchHistoryList: Array<any>;
  tableData: Array<any>;
  PayPeriodLength: number = 0;
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
  whereString: string = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private listS: ListService,
    private formBuilder: FormBuilder,
    private menuS: MenuService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadBranches();
    this.loadPrograms();
    this.loadCategories();
    this.populateDropdowns();
    this.loadData();
    // this.GetPayPeriodLength();
    this.GetPayPeriodEndDate();
    // this.chkAllDatesClick();
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
    this.router.navigate(['/admin/billing']);
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      name: '',
      dtpStartDate: '',
      dtpEndDate: '',
      billingMode: 'CONSOLIDATED BILLING',
      AccPackage: 'TEST 1',
      invType: 'General',
    });
  }
  populateDropdowns() {
    this.billingType = ['CONSOLIDATED BILLING', 'PROGRAM BILLING'];
    this.AccountPackage = ['TEST 1', 'TEST 2'];
    this.invType = ['CDC Homecare Package Invoices', 'NDIA Claim Update Invoices', 'General', 'Re-Export Existing Batch', 'ALL'];
  }
  loadBranches() {
    let sql = "SELECT DISTINCT UPPER(Description) as Description FROM DATADOMAINS WHERE DOMAIN = 'BRANCHES'";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.branchList = data;
      this.tableData = data;
      this.loading = false;
    });
  }
  loadPrograms() {
    let sql = "SELECT DISTINCT UPPER([Name]) as Name FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' and EndDate is null AND ISNULL(UserYesNo3, 0) = 0 AND IsNull(User2, '') <> 'Contingency'";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.programList = data;
      this.tableData = data;
      this.loading = false;
    });
  }
  loadCategories() {
    let sql = "SELECT DISTINCT UPPER(Description) as Description FROM DataDomains WHERE [Domain] = 'GROUPAGENCY'";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.categoriesList = data;
      this.tableData = data;
      this.loading = false;
    });
  }
  loadData() {
    let sql = "Select pay_bill_batch.RecordNumber, pay_bill_batch.OperatorID, pay_bill_batch.BatchDate, pay_bill_batch.BatchNumber, pay_bill_batch.BatchDetail, pay_bill_batch.BatchType, pay_bill_batch.CDCBilled, pay_bill_batch.Date1, pay_bill_batch.Date2, pay_bill_batch.BillBatch# as BillBatch, pay_bill_batch.xDeletedRecord, pay_bill_batch.xEndDate FROM pay_bill_batch INNER JOIN batch_record on batchnumber = batch_record.BCH_NUM WHERE batch_record.bch_type in ('B','S') ORDER BY convert(int, batchnumber) DESC";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.batchHistoryList = data;
      this.tableData = data;
      this.loading = false;
    });
  }
  GetPayPeriodLength() {
    let sql = "SELECT DefaultPayPeriod as DefaultPayPeriod FROM Registration";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      if (data[0].defaultPayPeriod != "") {
        this.PayPeriodLength = data;
      }
      else { this.PayPeriodLength = 14; }
      // console.log("Result : " , this.PayPeriodLength);
    });
  }
  GetPayPeriodEndDate() {
    let sql = "SELECT PayPeriodEndDate as PayPeriodEndDate FROM SysTable";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      console.log(data[0].payPeriodEndDate);
      if (data[0].PayPeriodEndDate != "") {
        this.inputForm.patchValue({
              dtpEndDate: new Date() , //this.globalS.convertDbDate(data[0].PayPeriodEndDate),
          });
      }
      else { 
        this.inputForm.patchValue({
          dtpEndDate: new Date(),
      });
        
      }
    })
    // const {
    //   dtpEndDate,
    // } = this.PayPeriodEndDate;
    // this.inputForm.patchValue({
    //   dtpEndDate: dtpEndDate,
    // });
  }

  chkAllDatesClick(){
    // var dtpStartDate 
    // var dtpEndDate
    // // dtpStartDate = this.PayPeriodEndDate - (this.PayPeriodLength - 1);
    // dtpStartDate = this.PayPeriodEndDate - (this.PayPeriodLength - 1);
    // dtpEndDate = this.PayPeriodEndDate
    // this.inputForm.patchValue({
    //   dtpStartDate:dtpStartDate,
    //   dtpEndDate:dtpEndDate,
    // })
    // debugger;
  }

  
  // let sql;
  // if (!type) return EMPTY;
  // const { isMultipleRecipient } = this.timesheetForm.value;
  // if (type === 'ADMINISTRATION' || type === 'ALLOWANCE NON-CHARGEABLE' || type === 'ITEM' || (type == 'SERVICE' && !isMultipleRecipient)) {
  //     sql = `SELECT Distinct [Name] AS ProgName FROM HumanResourceTypes WHERE [group] = 'PROGRAMS' AND ISNULL(UserYesNo3,0) = 0 AND (EndDate Is Null OR EndDate >=  '${this.currentDate}') ORDER BY [ProgName]`;
  // } else {
  //     sql = `SELECT Distinct [Program] AS ProgName FROM RecipientPrograms 
  //         INNER JOIN Recipients ON RecipientPrograms.PersonID = Recipients.UniqueID 
  //         WHERE Recipients.AccountNo = '${type}' AND RecipientPrograms.ProgramStatus IN ('ACTIVE', 'WAITING LIST') ORDER BY [ProgName]`
  // }
  // if (!sql) return EMPTY;
  // return this.listS.getlist(sql);

}



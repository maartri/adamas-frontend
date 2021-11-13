import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { ListService, MenuService } from '@services/index';
import { TimeSheetService, GlobalService, ClientService, StaffService, ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, MenuService } from '@services/index';
import { timeout } from 'rxjs/operators';
import { setDate } from 'date-fns';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
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
export class PayComponent implements OnInit {

  branchList: Array<any>;
  programList: Array<any>;
  categoriesList: Array<any>;
  batchHistoryList: Array<any>;
  tableData: Array<any>;
  PayPeriodLength: number;
  PayPeriodEndDate: any;
  selectedBranch: Array<any> = [];

  loading: boolean = false;
  allchecked: boolean = false;
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
  title: string = "TRACCS Pay Update";
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
  dtpEndDate: number;
  selectedBranches: any;
  btnid: any;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private globalS: GlobalService,
    private listS: ListService,
    private formBuilder: FormBuilder,
    private menuS: MenuService,
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
    this.GetPayPeriodLength();
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
    this.router.navigate(['/admin/timesheet-processing']);
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      name: '',
      dtpStartDate: '',
      dtpEndDate: '',
      billingMode: 'CONSOLIDATED BILLING',
      AccPackage: 'TEST 1',
      invType: 'General',
      updateStaffServices: false,
    });
  }
  log(event: any) {
    this.selectedBranches = event;
  }


checkAll(){
  debugger;
  switch (this.btnid) {
      
    case "btn-Systm-selectAllBranches":
      console.log("modal change" + this.allchecked);
      this.branchList.forEach(x => {
        x.checked = true;
        this.selectedBranches = x.description;
      });
        break;

    // case "btn-Systm-selectAllCategories":
    //   console.log("modal change" + this.allchecked);
    //   this.branchList.forEach(x => {
    //     x.checked = true;
    //     this.selectedBranches = x.description;
    //   });
    //     break;

          default:
              break;
      }
}

  // checkAll(){
  //     console.log("modal change" + this.allchecked);

  //     this.branchList.forEach(x => {
  //       x.checked = true;
  //       this.selectedBranches = x.description;
  //     });
  // }
  
  uncheckAll(){
      this.branchList.forEach(x => {
        x.checked = false;
      });
      this.selectedBranches = [];
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
  loadBatchHistory() {
    let sql = "Select pay_bill_batch.RecordNumber, pay_bill_batch.OperatorID, pay_bill_batch.BatchDate, pay_bill_batch.BatchNumber, pay_bill_batch.BatchDetail, pay_bill_batch.BatchType, pay_bill_batch.CDCBilled, pay_bill_batch.Date1, pay_bill_batch.Date2, pay_bill_batch.BillBatch# as BillBatch, pay_bill_batch.xDeletedRecord, pay_bill_batch.xEndDate FROM pay_bill_batch INNER JOIN batch_record on batchnumber = batch_record.BCH_NUM WHERE batch_record.bch_type in ('B','S') ORDER BY convert(int, batchnumber) DESC";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.batchHistoryList = data;
      this.tableData = data;
      this.loading = false;
    });
  }
  GetPayPeriodLength() {
    // let sql = "SELECT DefaultPayPeriod as DefaultPayPeriod FROM Registration";
    // this.loading = true;
    // this.listS.getlist(sql).subscribe(data => {
    //   console.log("Result 0 is: ", data[0].defaultPayPeriod)
    //   if (data[0].defaultPayPeriod != "") {
    //     this.PayPeriodLength = data;
    //   }
    //   else { this.PayPeriodLength = 14; }
    // })
    // console.log("Result 1 is: " , this.PayPeriodLength);
  }
  GetPayPeriodEndDate() {
    let sql = "SELECT PayPeriodEndDate as PayPeriodEndDate FROM SysTable";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      if (data[0].PayPeriodEndDate != "") {
        this.inputForm.patchValue({
              dtpEndDate: this.globalS.convertDbDate(data[0].payPeriodEndDate),
          });
      }
      else { 
        this.inputForm.patchValue({
          dtpEndDate: new Date(),});
      }
    })
    // this.inputForm.patchValue({
    //   dtpStartDate: this.dtpEndDate - ((this.PayPeriodLength * 24*30*60*1000)- 1),
    // })

    let fsql = "SELECT DefaultPayPeriod as DefaultPayPeriod FROM Registration";
    this.listS.getlist(fsql).subscribe(fdata => {
      console.log("Result 1 is: ", fdata[0].defaultPayPeriod)
      if (fdata[0].defaultPayPeriod != "") {
        this.PayPeriodLength = fdata;
      }
      else { this.PayPeriodLength = 14; }
    })
    

    var EndDate
    EndDate = new Date(this.dtpEndDate);
    let d = EndDate.getDate()-1;
    EndDate.setDate(EndDate.getDate()-d) 
    console.log("Result test is: ", (EndDate));

    console.log("Result 2 is: ", (this.PayPeriodLength));
    // console.log("Result 3 is: ", (this.dtpEndDate.setDate(this.dtpEndDate.getDate()-10)));
    // console.log("Result 3 is: ", (this.dtpEndDate - (this.PayPeriodLength)));
  }
  
  selectAllBranches(){
    this.branchList.forEach(x => {
      x.checked = true
    });

    // this.selectedBranch = [];
  }

  clearBranchlist(){
    this.branchList.forEach(x => {
      x.checked = false
    });

    this.selectedBranch = [];
  }

  updateBranchListing(branch: Array<any>){
    if(branch.length == 0 )return;
    var _branch = branch.map(x => x.branch);

    this.branchList.forEach(x => {
      if(_branch.includes(x.description)){
        x.checked = true;
      }
    });

    this.selectedBranch = branch.map(x => x.branch);
  }

}



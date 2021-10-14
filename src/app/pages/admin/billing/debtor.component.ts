import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { ListService, MenuService } from '@services/index';
import { BillingService, TimeSheetService, GlobalService, ListService, MenuService } from '@services/index';
import { timeout } from 'rxjs/operators';
import { setDate } from 'date-fns';

@Component({
  selector: 'app-billing',
  templateUrl: './debtor.component.html',
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
export class DebtorComponent implements OnInit {

  branchList: Array<any>;
  programList: Array<any>;
  categoriesList: Array<any>;
  batchHistoryList: Array<any>;
  tableData: Array<any>;
  PayPeriodLength: number;
  PayPeriodEndDate: any;

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
  userRole:string="userrole";
  whereString: string = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  dtpEndDate: number;
  id: string;
  btnid: any;
  btnid1: any;
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
    this.GetPayPeriodLength();
    this.GetPayPeriodEndDate();
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
      dtpStartDate: '01-01-2021',
      dtpEndDate: '01-01-2021',
      billingMode: 'CONSOLIDATED BILLING',
      AccPackage: 'TEST 1',
    });
  }

  log(event: any,index:number) {
    if(index == 1)
    this.selectedBranches = event;
<<<<<<< Updated upstream
  }
  checkAll(){
      console.log("modal change" + this.allchecked);

=======
    if(index == 2)
    this.selectedPrograms = event;
    if(index == 3)
    this.selectedCategories = event;
 }

  checkAll(index:number): void {
    if(index == 1){
>>>>>>> Stashed changes
      this.branchList.forEach(x => {
        x.checked = true;
        this.allBranchesChecked = x.description;
        this.allBranchesChecked = true;
      });
<<<<<<< Updated upstream
  }
  
  uncheckAll(){
      this.branchList.forEach(x => {
        x.checked = false;
      });
      this.selectedBranches = [];
=======
    }
    if(index == 2){
      this.programList.forEach(x => {
        x.checked = true;
        this.allProgramsChecked = x.description;
        this.allProgramsChecked = true;
      });
    }
    if(index == 3){
      this.categoriesList.forEach(x => {
        x.checked = true;
        this.allCategoriesChecked = x.description;
        this.allCategoriesChecked = true;
      });
    }
  }

  uncheckAll(index:number): void {
    if(index == 1){
        this.branchList.forEach(x => {
          x.checked = false;
        this.allBranchesChecked = false;
        this.selectedBranches = [];
        });
    }
    if(index == 2){
        this.programList.forEach(x => {
          x.checked = false;
        this.allProgramsChecked = false;
        this.selectedPrograms = [];
        });
    }
    if(index == 3){
        this.categoriesList.forEach(x => {
          x.checked = false;
        this.allCategoriesChecked = false;
        this.selectedCategories = [];
        });
    }
>>>>>>> Stashed changes
  }

  // uncheckAll(e){
  //   e = e || window.event;
  //   e = e.target || e.srcElement;
  //   this.btnid = e.id
  
  //   switch (this.btnid) {
  //       case "btn-uchk-program-list":
  //         console.log("[==========]")
  //           this.programList.forEach(x => {
  //             x.checked = false;
  //           });
  //           this.allProgramschecked = false;
  //           this.selectedPrograms = [];
  //           break;
        
  //           default:
  //               break;
  //       }
  // }

  populateDropdowns() {
    this.billingType = ['CONSOLIDATED BILLING', 'PROGRAM BILLING'];
    this.AccountPackage = ['TEST 1', 'TEST 2'];
    this.invType = ['CDC Homecare Package Invoices', 'NDIA Claim Update Invoices', 'General', 'Re-Export Existing Batch', 'ALL'];
  }
  
  loadBranches(){
    this.loading = true;
    this.menuS.getlistbranches(this.check).subscribe(data => {
      this.branchList = data;
      this.tableData = data;
      this.loading = false;
      this.allBranchesChecked = true;
      this.checkAll(1);
    });
  }

  loadPrograms(){
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

  loadBatchHistory() {
    let sql = "Select pay_bill_batch.RecordNumber, pay_bill_batch.OperatorID, pay_bill_batch.BatchDate, pay_bill_batch.BatchNumber, pay_bill_batch.BatchDetail, pay_bill_batch.BatchType, pay_bill_batch.CDCBilled, pay_bill_batch.Date1, pay_bill_batch.Date2, pay_bill_batch.BillBatch# as BillBatch, pay_bill_batch.xDeletedRecord, pay_bill_batch.xEndDate FROM pay_bill_batch INNER JOIN batch_record on batchnumber = batch_record.BCH_NUM WHERE batch_record.bch_type in ('B','S') ORDER BY convert(int, batchnumber) DESC";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.batchHistoryList = data;
      this.tableData = data;
      this.loading = false;
    });
  }

  startDebUpdate() : void{
    this.loading = true;      

    this.selectedBranches = this.branchList
    .filter(opt => opt.checked)
    .map(opt => opt.description).join("','")


    var postdata = {
      allProgarms:this.allBranchesChecked,
      selectedBranches:(this.allBranchesChecked == false) ? this.selectedBranches : '',
    }

    this.billingS.postdebtorbilling({}).subscribe(data => {
      this.filteredResult = data;
      this.loading = false;
      this.cd.detectChanges();
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
}



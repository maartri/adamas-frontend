import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwitchService } from '@services/switch.service';
import { BillingService, TimeSheetService, GlobalService, ListService, MenuService } from '@services/index';
import { debounceTime, timeout } from 'rxjs/operators';
import { setDate, startOfMonth, toDate } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import endOfMonth from 'date-fns/endOfMonth';

import { first } from 'lodash';
import { constrainPoint } from '@fullcalendar/angular';

@Component({
  selector: 'app-billing',
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
  loading: boolean = false;
  allchecked: boolean = false;
  modalOpen: boolean = false;
  AccountPackage: Array<any>;
  current: number = 0;
  inputForm: FormGroup;
  dateFormat: string = 'dd/MM/yyyy';
  postLoading: boolean = false;
  title: string = "TRACCS Pay Update";
  token: any;
  tocken: any;
  check: boolean = false;
  userRole: string = "userrole";
  dtpEndDate: any;
  dtpStartDate: any;
  id: string;
  private unsubscribe: Subject<void> = new Subject();
  selectedBranches: any;
  selectedPrograms: any;
  selectedCategories: any;
  allBranchesChecked: boolean;
  allProgramsChecked: boolean;
  allCategoriesChecked: boolean;
  allChecked = false;
  indeterminate = true;
  batchNumber: any;
  BatchDetail: any;
  BatchType: any;
  operatorID: any;
  updatedRecords: any;
  lockBranches: any = false;
  lockPrograms: any = false;
  lockCategories: any = false;
  currentDateTime: any;

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
    this.token = this.globalS.decode();
    this.buildForm();
    this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA) : this.globalS.decode();
    this.userRole = this.tocken.role;
    this.loadBranches();
    this.loadPrograms();
    this.loadCategories();
    this.populateDropdowns();
    this.loadBatchHistory();
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
      timesheetDate: new Date(),
      dtpStartDate: startOfMonth(new Date()),
      dtpEndDate: endOfMonth(new Date()),
      updateStaffServices: true,
      AccPackage: 'TEST 1',
    });
  }

  startTest(){
    console.log(new Date());
    console.log(this.dtpStartDate);
    console.log(this.dtpEndDate);
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
      if (this.allBranchesChecked == false) {
        this.lockBranches = true
      }
      else {
        this.branchList.forEach(x => {
          x.checked = true;
          this.allBranchesChecked = x.description;
          this.allBranchesChecked = true;
        });
        this.lockBranches = false
      }
    }
    if (index == 2) {
      if (this.allProgramsChecked == false) {
        this.lockPrograms = true
      }
      else {
        this.programList.forEach(x => {
          x.checked = true;
          this.allProgramsChecked = x.description;
          this.allProgramsChecked = true;
        });
        this.lockPrograms = false
      }
    }
    if (index == 3) {
      if (this.allCategoriesChecked == false) {
        this.lockCategories = true
      }
      else {
        this.categoriesList.forEach(x => {
          x.checked = true;
          this.allCategoriesChecked = x.description;
          this.allCategoriesChecked = true;
        });
        this.lockCategories = false
      }
    }
  }

  uncheckAll(index: number): void {
    if (index == 1) {
      this.lockBranches = true;
      this.branchList.forEach(x => {
        x.checked = false;
        this.allBranchesChecked = false;
        this.selectedBranches = [];
      });
    }
    if (index == 2) {
      this.lockPrograms = true;
      this.programList.forEach(x => {
        x.checked = false;
        this.allProgramsChecked = false;
        this.selectedPrograms = [];
      });
    }
    if (index == 3) {
      this.lockCategories = true;
      this.categoriesList.forEach(x => {
        x.checked = false;
        this.allCategoriesChecked = false;
        this.selectedCategories = [];
      });
    }
  }

  populateDropdowns() {
    this.AccountPackage = ['TEST 1', 'TEST 2'];
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
  };

  loadBatchHistory() {
    let sql = "Select pay_bill_batch.RecordNumber, pay_bill_batch.OperatorID, pay_bill_batch.BatchDate, pay_bill_batch.BatchNumber, pay_bill_batch.BatchDetail, pay_bill_batch.BatchType, pay_bill_batch.CDCBilled, pay_bill_batch.Date1, pay_bill_batch.Date2, pay_bill_batch.BillBatch# as BillBatch, pay_bill_batch.xDeletedRecord, pay_bill_batch.xEndDate FROM pay_bill_batch INNER JOIN batch_record on batchnumber = batch_record.BCH_NUM WHERE batch_record.bch_type in ('B','S') ORDER BY convert(int, batchnumber) DESC";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.batchHistoryList = data;
      this.tableData = data;
      this.loading = false;
    });
  }

  startDebUpdate() {
    this.loading = true;
    this.billingS.getBatchRecord(null).subscribe(data => {
      this.batchNumber = data[0].batchRecordNumber;
        this.validateDebUpdate();
    });
  }

  validateDebUpdate(): void {
    this.operatorID = this.token.nameid;
    this.batchNumber = this.batchNumber + 1;
    this.currentDateTime = this.globalS.getCurrentDateTime();
    this.currentDateTime = formatDate(this.currentDateTime, 'yyyy-MM-dd hh:mm', 'en_US');
    this.dtpStartDate = this.inputForm.get('dtpStartDate').value;
    this.dtpEndDate = this.inputForm.get('dtpEndDate').value;
    this.dtpStartDate = formatDate(this.dtpStartDate, 'yyyy/MM/dd', 'en_US');
    this.dtpEndDate = formatDate(this.dtpEndDate, 'yyyy/MM/dd', 'en_US');

    if (this.lockBranches == false) {
      this.selectedBranches = null
    } else {
      this.selectedBranches = this.branchList
        .filter(opt => opt.checked)
        .map(opt => opt.description).join(",")
    }

    if (this.lockPrograms == false) {
      this.selectedPrograms = null
    } else {
      this.selectedPrograms = this.programList
        .filter(opt => opt.checked)
        .map(opt => opt.title).join(",")
    }

    if (this.lockCategories == false) {
      this.selectedCategories = null
    } else {
      this.selectedCategories = this.categoriesList
        .filter(opt => opt.checked)
        .map(opt => opt.description).join(",")
    }

    if (this.selectedBranches != '' && this.selectedPrograms != '' && this.selectedCategories != '') {
      // console.log(this.batchNumber);
      // console.log(this.selectedBranches);
      // console.log(this.selectedPrograms);
      // console.log(this.selectedCategories);
      // console.log(this.dtpStartDate);
      // console.log(this.dtpEndDate);
      // console.log(this.operatorID);
      // console.log(this.currentDateTime);
      this.updateRosterDebtorRecord();
    } else if (this.selectedBranches == '') {
      this.globalS.eToast('Error', 'Please select atleast one Branch to proceed')
    } else if (this.selectedPrograms == '') {
      this.globalS.eToast('Error', 'Please select atleast one Program to proceed')
    } else if (this.selectedCategories == '') {
      this.globalS.eToast('Error', 'Please select atleast one Category to proceed')
    }
  }

  updateRosterDebtorRecord() {
    this.postLoading = true;
    this.billingS.postDebtorBilling({
      InvoiceNumber: 'N/A',
      BatchNumber: this.batchNumber,
      Branches: this.selectedBranches,
      Programs: this.selectedPrograms,
      Categories: this.selectedCategories,
      StartDate: this.dtpStartDate,
      EndDate: this.dtpEndDate,
      OperatorID: this.operatorID,
      CurrentDateTime: this.currentDateTime
    }).pipe(
      takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.updatedRecords = data[0].updatedRecords
          if (this.updatedRecords == 0) {
            this.globalS.iToast('Information', 'There are no approved roster entries to process for the selected date range and program/s')
          } else {
            this.globalS.sToast('Success', this.updatedRecords + ' - Debtor Records Updated')
          }
          this.postLoading = false;
          this.ngOnInit();
          return false;
        }
      });
  }
}


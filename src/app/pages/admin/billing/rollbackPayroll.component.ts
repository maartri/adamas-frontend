import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BillingService, TimeSheetService, GlobalService, ListService, MenuService } from '@services/index';
import { takeUntil, timeout } from 'rxjs/operators';
import { setDate } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common'
import { formatDate } from '@angular/common';
import addYears from 'date-fns/addYears';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

@Component({
    selector: 'app-billing',
    templateUrl: './rollbackPayroll.component.html',
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
export class RollbackPayrollComponent implements OnInit {

    loading: boolean = false;
    modalOpen: boolean = false;
    inputForm: FormGroup;
    dateFormat: string = 'dd/MM/yyyy';
    postLoading: boolean = false;
    title: string = "Rolling Back Payroll Batch";
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    token: any;
    check: boolean = false;
    userRole: string = "userrole";
    operatorID: any;
    id: string;
    private unsubscribe: Subject<void> = new Subject();
    allFundingChecked: boolean;
    date: moment.MomentInput;
    batchList: Array<any>;
    batchNumber: any;
    batchUser: any;
    batchDate: any;
    batchDetail: any;
    selectedBatch: any;
    updatedRecords: any;
    currentDateTime: any;
    batchDescription: any;
    confirmModal?: NzModalRef;

    constructor(
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private menuS: MenuService,
        private billingS: BillingService,
        private modal: NzModalService,
        public datepipe: DatePipe,
    ) { }

    ngOnInit(): void {
        this.token = this.globalS.decode();
        this.buildForm();
        this.loadPayrollBatch();
        this.loading = false;
        this.modalOpen = true;
    }
    loadTitle() {
        return this.title
    }
    resetModal() {
        this.inputForm.reset();
        this.selectedBatch = ""
        this.postLoading = false;
    }
    handleCancel() {
        this.modalOpen = false;
        this.router.navigate(['/admin/billing']);
    }
    buildForm() {
        this.inputForm = this.formBuilder.group({
            selectedBatch: '',
        });
    }

    loadPayrollBatch() {
        this.loading = true;
        this.billingS.getPayrollBatch().subscribe(data => {
            this.batchList = data;
            this.batchNumber = data[0].batchNumber;
            this.batchUser = data[0].batchUser;
            this.batchDate = data[0].batchDate;
            this.batchDetail = data[0].batchDetail;
            this.loading = false;
        });
    }

    rollBackBatch() {
        this.postLoading = true;
        this.billingS.rollbackPayrollBatch({
            OperatorID: this.operatorID,
            CurrentDateTime: this.currentDateTime,
            BatchNumber: this.selectedBatch,
            BatchDescription: this.batchDescription,
        }).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.updatedRecords = data[0].updatedRecords;
                    this.globalS.sToast('Success','The Payroll Batch # ' + this.selectedBatch + ' has been rolled back successfully.');
                    Promise.resolve().then(() => {
                        this.inputForm.setControl('selectedBatch', new FormControl());
                    })
                }
                this.postLoading = false;
                this.resetModal();
                this.ngOnInit();
                return false;
            });
    }

    rollBack() {
        this.selectedBatch = this.inputForm.get('selectedBatch').value;
        this.selectedBatch = this.selectedBatch.substr(0, this.selectedBatch.indexOf(' -'));
        this.operatorID = this.token.nameid;
        this.currentDateTime = this.globalS.getCurrentDateTime();
        this.currentDateTime = formatDate(this.currentDateTime, 'yyyy-MM-dd hh:mm', 'en_US');
        this.batchDescription = 'Billing Batch#:' + this.selectedBatch + ' rolled back. Dated ' + this.currentDateTime;
        if (this.selectedBatch != '') {
            this.confirmModal = this.modal.confirm({
                nzTitle: 'Do you want to Roll Back Batch?',
                nzContent: 'This process cannot be undone. <br> Are you sure you want to undo the changes made to the roster(s) under Payroll-Batch #: ' + this.selectedBatch + ' ?',
                nzOnOk: () => {
                    // this.globalS.iToast('Information', 'OK Button Selected.')
                    this.rollBackBatch();
                },
                nzOnCancel: () => {
                    // this.globalS.sToast('Success', 'CANCEL Button Selected.')
                }
            });
        } else if (this.selectedBatch == '') {
            this.globalS.eToast('Error', 'Please select Payroll Batch to Rollback.')
        }
    }
}



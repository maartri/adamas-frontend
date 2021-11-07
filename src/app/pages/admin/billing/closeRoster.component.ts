import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BillingService, TimeSheetService, GlobalService, ListService, MenuService } from '@services/index';
import { timeout } from 'rxjs/operators';
import { setDate } from 'date-fns';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';
import { DatePipe } from '@angular/common'
import addYears from 'date-fns/addYears';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

@Component({
  selector: 'app-billing',
  templateUrl: './closeRoster.component.html',
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
export class CloseRosterComponent implements OnInit {

  fundingList: Array<any>;
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
  title: string = "Close Programs";
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
  dtpEndDate: Date;
  lastMonthEndDate: any;
  id: string;
  btnid: any;
  btnid1: any;
    allFundingChecked: boolean;
    allProgramsChecked: boolean;
    selectedPrograms: any[];
    selectedFunding: any[];
    date: moment.MomentInput;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private globalS: GlobalService,
    private listS: ListService,
    private formBuilder: FormBuilder,
    private menuS: MenuService,
    private timesheetS: TimeSheetService,
    private billingS: BillingService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
    this.userRole = this.tocken.role;
    this.buildForm();
    this.EndofMOnth();
    this.loadFunding();
    this.loadPrograms();
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
    dtpEndDate: null,
    billingMode: 'CONSOLIDATED BILLING',
    AccPackage: 'TEST 1',
    });

    // this.inputForm.patchValue({
    //     dtpEndDate: this.lastMonthEndDate,
    // })

  }

  EndofMOnth(){
    const lastMonthEndDate = new Date();
    lastMonthEndDate.setMonth(lastMonthEndDate.getMonth() - 1);
    
    console.log('Last Month Date:', endOfMonth(lastMonthEndDate));
    console.log('New Month Date:', new Date());
    this.inputForm.patchValue({
      dtpEndDate: endOfMonth(lastMonthEndDate),
    }) 
  }

  log(event: any,index:number) {
    if(index == 1)
    this.selectedFunding = event;
    if(index == 2)
    this.selectedPrograms = event;
 }

  checkAll(index:number): void {
    if(index == 1){
      this.fundingList.forEach(x => {
        x.checked = true;
        this.allFundingChecked = x.description;
        this.allFundingChecked = true;
      });
    }
    if(index == 2){
      this.programList.forEach(x => {
        x.checked = true;
        this.allProgramsChecked = x.description;
        this.allProgramsChecked = true;
      });
    }
  }

  uncheckAll(index:number): void {
    if(index == 1){
        this.fundingList.forEach(x => {
          x.checked = false;
        this.allFundingChecked = false;
        this.selectedFunding = [];
        });
    }
    if(index == 2){
        this.programList.forEach(x => {
          x.checked = false;
        this.allProgramsChecked = false;
        this.selectedPrograms = [];
        });
    }
  }
  loadFunding(){
    this.loading = true;
    this.menuS.getlistFundingSource(this.check).subscribe(data => {
      this.fundingList = data;
      this.tableData = data;
      this.loading = false;
      this.allFundingChecked = true;
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
}



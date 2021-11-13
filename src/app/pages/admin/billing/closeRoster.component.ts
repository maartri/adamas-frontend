import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BillingService, TimeSheetService, GlobalService, ListService, MenuService } from '@services/index';
import { takeUntil, timeout } from 'rxjs/operators';
import { setDate } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { DatePipe } from '@angular/common'
import { formatDate } from '@angular/common';
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
  chkId: string;
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
  userRole: string = "userrole";
  whereString: string = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  dtpEndDate: any;
  lastMonthEndDate: any;
  id: string;
  btnid: any;
  btnid1: any;
  private unsubscribe: Subject<void> = new Subject();
  BlockFunded: any;
  IndividualPackages: any;
  NonCDCPackages: any;
  CDCPackages: any;
  allFundingChecked: boolean;
  allProgramsChecked: boolean;
  selectedPrograms: any;
  selectedFunding: any;
  date: moment.MomentInput;
  checkedIDs: any[];

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
    this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA) : this.globalS.decode();
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
      chkBlockFunded: null,
      chkIndividualPackages: null,
      chkNonCDCPackages: null,
      chkCDCPackages: null,
    });
  }

  EndofMOnth() {
    const lastMonthEndDate = new Date();
    lastMonthEndDate.setMonth(lastMonthEndDate.getMonth() - 1);
    this.dtpEndDate = endOfMonth(lastMonthEndDate);
    this.inputForm.patchValue({
      dtpEndDate: this.dtpEndDate,
    });
  }

  log(event: any, index: number) {
    if (index == 1)
      this.selectedFunding = event;
    if (index == 2)
      this.selectedPrograms = event;
      
    if (index == 11 && event.target.checked) {
      console.log("11")
    }
    if (index == 12 && event.target.checked) {
      console.log("12")
    }
    if (index == 13 && event.target.checked) {
      console.log("13")
    }
    if (index == 14 && event.target.checked) {
      console.log("14")
    }
  }

  checkAll(index: number): void {
    if (index == 1) {
      this.fundingList.forEach(x => {
        x.checked = true;
        this.allFundingChecked = x.description;
        this.allFundingChecked = true;
      });
    }
    if (index == 2) {
      this.programList.forEach(x => {
        x.checked = true;
        this.allProgramsChecked = x.description;
        this.allProgramsChecked = true;
      });
    }
  }

  uncheckAll(index: number): void {
    if (index == 1) {
      this.fundingList.forEach(x => {
        x.checked = false;
        this.allFundingChecked = false;
        this.selectedFunding = [];
      });
    }
    if (index == 2) {
      this.programList.forEach(x => {
        x.checked = false;
        this.allProgramsChecked = false;
        this.selectedPrograms = [];
      });
    }
  }
  loadFunding() {
    this.loading = true;
    this.menuS.getlistFundingSource(this.check).subscribe(data => {
      this.fundingList = data;
      this.tableData = data;
      this.loading = false;
      this.allFundingChecked = true;
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


  fetchID(index: number): void {
    if (index == 1) {
      this.BlockFunded = true;
      console.log("1", this.BlockFunded)
    }
    if (index == 2) {
      console.log("2")
    }
    if (index == 3) {
      console.log("3")
    }
    if (index == 4) {
      console.log("4")
    }
  }


  // fetchID(e) {
  //   debugger;
  //   e = e || window.event;
  //   e = e.target || e.srcElement;
  //   this.chkId = e.id

  //   switch (this.chkId) {
  //     case 'chkBlockFunded':
  //       this.whereString = "WHERE [GROUP] = 'PROGRAMS' AND ISNULL(UserYesNo2, 0) = 0 ";
  //       break;
  //     case 'chkIndividualPackages' && 'chkCDCPackages':
  //       this.whereString = "WHERE [GROUP] = 'PROGRAMS' AND ISNULL(UserYesNo2, 0) = 1 AND ISNULL(UserYesNo1, 0) = 1 ";
  //       break;
  //     case 'chkIndividualPackages' && 'chkNonCDCPackages':
  //       this.whereString = "WHERE [GROUP] = 'PROGRAMS' AND ISNULL(UserYesNo2, 0) = 1 AND ISNULL(UserYesNo1, 0) = 0 ";
  //       break;
  //     case 'chkIndividualPackages' && 'chkCDCPackages' && 'chkNonCDCPackages':
  //       this.whereString = "WHERE [GROUP] = 'PROGRAMS' AND ISNULL(UserYesNo2, 0) = 1 ";
  //       break;
  //     case 'chkBlockFunded' && 'chkIndividualPackages' && 'chkNonCDCPackages':
  //       this.whereString = "WHERE [GROUP] = 'PROGRAMS' AND (ISNULL(UserYesNo2, 0) = 0) OR (ISNULL(UserYesNo2, 0) = 1 AND ISNULL(UserYesNo1, 0) = 0) ";
  //       break;
  //     case 'chkBlockFunded' && 'chkIndividualPackages' && 'chkCDCPackages':
  //       this.whereString = "WHERE [GROUP] = 'PROGRAMS' AND (ISNULL(UserYesNo2, 0) = 0) OR (ISNULL(UserYesNo2, 0) = 1 AND ISNULL(UserYesNo1, 0) = 1) ";
  //       break;
  //     case 'chkBlockFunded' && 'chkIndividualPackages' && 'chkCDCPackages' && 'chkNonCDCPackages':
  //       this.whereString = "WHERE [GROUP] = 'PROGRAMS' AND (ISNULL(UserYesNo2, 0) = 0) OR (ISNULL(UserYesNo2, 0) = 1) ";
  //       break;

  //   }

  // }

  fetchAll(e) {
    if (e.target.checked) {
      this.whereString = "WHERE";
      this.loadPrograms();
    } else {
      this.whereString = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
      this.loadPrograms();
    }
  }

  loadProgramsNew(index: any) {
    this.loading = true;
    this.billingS.getlistProgramPackagesFilter(this.check).subscribe(data => {
      this.programList = data;
      this.tableData = data;
      this.loading = false;
      this.allProgramsChecked = true;
      this.checkAll(2);
    });
  }

  searchData(): void {
    this.loading = true;

    this.selectedPrograms = this.programList
      .filter(opt => opt.checked)
      .map(opt => opt.name).join("','")

    this.selectedFunding = this.fundingList
      .filter(opt => opt.checked)
      .map(opt => opt.uniqueID).join("','")

    var postdata = {
      blockFunded: this.inputForm.value.chkBlockFunded,
      individualPackages: this.inputForm.value.chkIndividualPackages,
      nonCDCPackages: this.inputForm.value.chkNonCDCPackages,
      cdcPackages: this.inputForm.value.chkCDCPackages,
      allFunding: this.allFundingChecked,
      selectedFunding: (this.allFundingChecked == false) ? this.selectedFunding : '',
      allProgarms: this.allProgramsChecked,
      selectedPrograms: (this.allProgramsChecked == false) ? this.selectedPrograms : ''
    }
  }

  closeRosterPeriod() {

    this.postLoading = true;   

      this.selectedFunding = this.fundingList
      .filter(opt => opt.checked)
      .map(opt => opt.description).join("','")

      this.selectedPrograms = this.programList
      .filter(opt => opt.checked)
      .map(opt => opt.title).join("','")

      this.dtpEndDate = this.inputForm.get('dtpEndDate').value;
      this.dtpEndDate = formatDate(this.dtpEndDate, 'MM-dd-yyyy','en_US');

      // let sql = "UPDATE HumanResourceTypes set CloseDate = '"+this.dtpEndDate+"' WHERE [NAME] IN ('"+this.selectedPrograms+"') AND [TYPE] IN ('"+this.selectedFunding+"') AND CloseDate <= '"+this.dtpEndDate+"'"; 
      // // console.log(sql);
      // this.menuS.updatUDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{        
      //   if (data) 
      //   this.globalS.sToast('Success', 'Saved successful');     
      //   else
      //   this.globalS.sToast('Success', 'Saved successful');
      //   this.ngOnInit();
      //   this.postLoading = false;          
      // });

    this.billingS.updateCloseRosterPeriod({
      Closedate: this.dtpEndDate,
      Programs: this.selectedPrograms,
      Fundings: this.selectedFunding,
    }).pipe(
      takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Date Updated')
          this.postLoading = false;
          this.ngOnInit();
          return false;
        }
      });
  }
}



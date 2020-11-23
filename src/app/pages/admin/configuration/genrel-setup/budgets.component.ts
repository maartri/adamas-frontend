import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { ListService } from '@services/list.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styles: [`
  .mrg-btm{
      margin-bottom:7px !important;
  }
  nz-divider{
    margin:5px !important;
  }
`],
})
export class BudgetsComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  dateFormat: string = 'dd/MM/yyyy';
  checkedflag= true;
  branches: Array<any>;
  caredomain:Array<any>;
  fundingRegion:Array<any>;
  fundingTypes:Array<any>;
  program:Array<any>;
  budgetGroup:Array<any>;
  diciplines:Array<any>;
  groupAgency:Array<any>;
  states:Array<any>;
  staffTeams:Array<any>;
  staffCategory:Array<any>;
  staff:Array<any>;
  recepient:Array<any>;
  types:Array<any>;
  budgetTypes:Array<any>;
  programCordinates:Array<any>;
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    ){}

  ngOnInit(): void {
    this.buildForm();
    // this.tableData = [{ name:"Nursing Allied Health (H3)"},{name:"Meals (H7)"},{name:"Personal Care"},{name:"Shopping"},{name:"Transport"},{name:"In home Care"}];
    this.loading = false;
    this.loadData();
    this.populateDropdowns();
    this.cd.detectChanges();
  }
  populateDropdowns(): void {

    this.states = ['ALL','NSW','NT','QLD','SA','TAS','VIC','WA','ACT'];
    this.types  = ['INPUT','OUTPUT'];
    this.budgetTypes  = ['HOURS'];
    this.listS.getlistbranches().subscribe(data => this.branches = data);
    this.listS.getcaredomain().subscribe(data => this.caredomain = data);
    this.listS.getliststaffteam().subscribe(data=>this.staffTeams= data);
    this.listS.getstaffcategory().subscribe(data=>this.staffCategory=data);

    let funding = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'FUNDREGION' ORDER BY Description";
    this.listS.getlist(funding).subscribe(data => {
      this.fundingRegion = data;
      this.loading = false;
    });
    let fundingt = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'FUNDINGBODIES' ORDER BY Description";
    this.listS.getlist(fundingt).subscribe(data => {
      this.fundingTypes = data;
      this.loading = false;
    });
    let prog = "SELECT [NAME] as name FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' AND ENDDATE IS NULL";
    this.listS.getlist(prog).subscribe(data => {
      this.program = data;
    });
    let bgroup = "Select RecordNumber, Description From DataDomains Where Domain = 'BUDGETGROUP'  ORDER BY DESCRIPTION";
    this.listS.getlist(bgroup).subscribe(data => {
      this.budgetGroup = data;
    });
    let dicip = "Select RecordNumber, Description From DataDomains Where Domain = 'DISCIPLINE'  ORDER BY DESCRIPTION";
    this.listS.getlist(dicip).subscribe(data => {
      this.diciplines = data;
    });
    let gagency = "Select RecordNumber, Description From DataDomains Where Domain = 'GROUPAGENCY'  ORDER BY DESCRIPTION";
    this.listS.getlist(gagency).subscribe(data => {
      this.groupAgency = data;
    });

    let staf = "SELECT ACCOUNTNO as name FROM STAFF WHERE CommencementDate IS NOT NULL AND TerminationDate IS NULL AND ACCOUNTNO > '!Z'";
    this.listS.getlist(staf).subscribe(data => {
      this.staff = data;
    });
    let reci = "SELECT ACCOUNTNO as name FROM RECIPIENTS WHERE AdmissionDate IS NOT NULL AND DischargeDate IS NULL AND ACCOUNTNO > '!Z'";
    this.listS.getlist(reci).subscribe(data => {
      this.recepient = data;
    });
    let progcor = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CASE MANAGERS'";
    this.listS.getlist(progcor).subscribe(data => {
      this.programCordinates = data;
    });
  }
  loadData(){
    let sql="SELECT RecordNumber, Name AS Description, Branch, [Funding Source], [Care Domain],[Budget Group],[Program], [Dataset Code],Activity, [Staff Team], [Staff Category], [Staff], Recipient, Hours, Dollars, SPID, State,CostCentre,DSOutlet, FundingRegion, SvcDiscipline, Places, O_Hours, O_Dollars,O_PlcPkg,Y_Hours, Y_Dollars, Y_PlcPkg, BudgetType, StaffJobCat,Coordinator, StaffAdminCat, Environment,Unit from Budgets ORDER BY [Name]";
    this.listS.getlist(sql).subscribe(data => {
      this.tableData = data
      console.log(this.tableData);
    });
  }
  showAddModal() {
    this.resetModal();
    this.modalOpen = true;
  }
  
  resetModal() {
    this.current = 0;
    this.inputForm.reset();
    this.postLoading = false;
  }
  
  showEditModal(index: any) {
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
  }
  
  handleCancel() {
    this.modalOpen = false;
  }
  pre(): void {
    this.current -= 1;
  }
  
  next(): void {
    this.current += 1;
  }
  save() {
    this.postLoading = true;
    this.globalS.sToast('Success', 'Changes saved');
    this.handleCancel();
    this.resetModal();
  }
  
  delete(data: any) {
    this.globalS.sToast('Success', 'Data Deleted!');
  }
  buildForm() {
    this.inputForm = this.formBuilder.group({
      title: '',
      type:'',
      start:null,
      end:null,
      undated:true,
      branch:null,
      care:null,
      cost:null,
      outlet:null,
      region:null,
      ftype:null,
      prgrm:null,
      bcode:null,
      dicipline:null,
      sregion:null,
      mds:null,
      tracss:null,
      spid:null,
      state:null,
      team:null,
      cat:null,
      staff:null,
      recepient:null,
      coordinator:null,
      hours:null,
      total:'',
      older:'',
      younger:'',
      dollar:'',
      packages:'',
    });
  }

}

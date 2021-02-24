import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { ListService } from '@services/list.service';
import { MenuService } from '@services/menu.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styles: [`
  .mrg-btm{
    margin-bottom:3px !important;
  },
  nz-divider{
    margin:5px !important;
  },
  nz-select{
    width:100%;
  },
  .ant-select-selection--single{
    height:24px;
  },
  .ant-modal{
    top:50px;
  },
  .ant-modal-body{
    padding-top:12px;
  }
  `],
})
export class BudgetsComponent implements OnInit {
  
  size:'small';
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
  programz:Array<any>;
  programz1:Array<any>;
  programz2:Array<any>;
  programz3:Array<any>;
  hACCType:Array<any>;
  output:Array<any>;
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
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private menuS:MenuService,
    private listS: ListService,
    ){}
    
    ngOnInit(): void {
      this.buildForm();
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
      
      
      let funding = "SELECT Distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain =  'FUNDREGION' ORDER BY Description";
      this.listS.getlist(funding).subscribe(data => {
        this.fundingRegion = data;
        this.loading = false;
      });
      let sc = "Select Distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain = 'STAFFGROUP'  ORDER BY DESCRIPTION";
      this.listS.getlist(sc).subscribe(data => {
        this.staffCategory = data;
        this.loading = false;
      });
      
      let fundingt = "SELECT Distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain =  'FUNDINGBODIES' ORDER BY Description";
      this.listS.getlist(fundingt).subscribe(data => {
        this.fundingTypes = data;
        this.loading = false;
      });
      let prog = "SELECT Distinct [NAME] as name FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' AND ENDDATE IS NULL";
      this.listS.getlist(prog).subscribe(data => {
        this.programz = data;
      });
      //new 
      let prog1 = "SELECT Distinct Address1 AS AgencyID FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' AND ENDDATE IS NULL";
      this.listS.getlist(prog1).subscribe(data => {
        this.programz1 = data;
      });
      let prog2 = "SELECT DISTINCT UPPER(FAX) FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS'";
      this.listS.getlist(prog2).subscribe(data => {
        this.programz2 = data;
      });
      
      let outp = "SELECT Distinct Title from ITEMTYPES WHERE ProcessClassification = 'OUTPUT'";
      this.listS.getlist(outp).subscribe(data => {
        this.output = data;
      });
      let hACType = "select Distinct HACCType from ITEMTYPES WHERE ProcessClassification = 'OUTPUT'";
      this.listS.getlist(hACType).subscribe(data => {
        this.hACCType = data;
      });
      
      //end new
      let bgroup = "Select Distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain = 'BUDGETGROUP'  ORDER BY DESCRIPTION";
      this.listS.getlist(bgroup).subscribe(data => {
        this.budgetGroup = data;
      });
      let dicip = "Select Distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain = 'DISCIPLINE'  ORDER BY DESCRIPTION";
      this.listS.getlist(dicip).subscribe(data => {
        this.diciplines = data;
      });
      let gagency = "Select Distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain = 'GROUPAGENCY'  ORDER BY DESCRIPTION";
      this.listS.getlist(gagency).subscribe(data => {
        this.groupAgency = data;
      });
      
      let staf = "SELECT Distinct ACCOUNTNO as name FROM STAFF WHERE CommencementDate IS NOT NULL AND TerminationDate IS NULL AND ACCOUNTNO > '!Z'";
      this.listS.getlist(staf).subscribe(data => {
        this.staff = data;
      });
      let reci = "SELECT Distinct ACCOUNTNO as name FROM RECIPIENTS WHERE AdmissionDate IS NOT NULL AND DischargeDate IS NULL AND ACCOUNTNO > '!Z'";
      this.listS.getlist(reci).subscribe(data => {
        this.recepient = data;
      });
      let progcor = "SELECT Distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain =  'CASE MANAGERS'";
      this.listS.getlist(progcor).subscribe(data => {
        this.programCordinates = data;
      });
    }
    loadData(){
      let sql="SELECT ROW_NUMBER() OVER(ORDER BY Name) AS row_num, RecordNumber, Name AS Description, Branch,SvcRegion,SvcDiscipline,[Funding Source], [Care Domain],[Budget Group],[Program], [Dataset Code],Activity, [Staff Team], [Staff Category], [Staff], Recipient, Hours, Dollars, SPID, State,CostCentre,DSOutlet, FundingRegion, Places, O_Hours, O_Dollars,O_PlcPkg,Y_Hours, Y_Dollars, Y_PlcPkg, BudgetType, StaffJobCat,Coordinator, StaffAdminCat, Environment,Unit,undated from Budgets WHERE ISNULL(Budgets.DeletedRecord, 0) = 0 ORDER BY [recordNumber] desc";
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
      const { 
        description,
        budgetType,
        undated,
        branch,
        careDomain,
        costCentre,
        dsOutlet,
        fundingRegion,
        fundingSource,
        program,
        budgetGroup,
        svcDiscipline,
        svcRegion,
        mds,
        tracss,
        spid,
        state,
        staffTeam,
        staffCategory,
        staff,
        recipient,
        coordinator,
        unit,
        hours,
        older,
        younger,
        dollars,
        packages,
        recordNumber,
      } = this.tableData[index];
      this.inputForm.patchValue({
        title:description, 
        type:budgetType,
        undated:(undated == true) ? true : false,
        branch:branch,
        care:careDomain,
        cost:costCentre,
        outlet:dsOutlet,
        region:fundingRegion,
        ftype:fundingSource,
        prgrm:program,
        bcode:budgetGroup,
        dicipline:svcDiscipline,
        sregion:svcRegion,
        mds,
        tracss,
        spid:spid,
        state:state,
        team:staffTeam,
        cat:staffCategory,
        staff:staff,
        recepient:recipient,
        coordinator:coordinator,
        hours:unit,
        total:hours,
        older:older,
        younger:younger,
        dollar:dollars,
        packages:packages,
        RecordNumber:recordNumber,
      });
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
    trueString(data: any): string{
      return data ? '1': '0';
    }
    save() {
      if(!this.isUpdate){        
        this.postLoading = true;   
        const group = this.inputForm;
        let start             = !(this.globalS.isVarNull(group.get('start').value)) ?  "'"+this.globalS.convertDbDate(group.get('start').value)+"'" : null;
        let end               = !(this.globalS.isVarNull(group.get('end').value)) ?  "'"+this.globalS.convertDbDate(group.get('end').value)+"'" : null;
        let name              = this.globalS.isValueNull(group.get('title').value);
        let branch            = this.globalS.isValueNull(group.get('branch').value);
        let funding_source    = this.globalS.isValueNull(group.get('ftype').value); 
        let care_domain       = this.globalS.isValueNull(group.get('care').value); 
        let budget_group      = this.globalS.isValueNull(group.get('bcode').value); 
        let prog              = this.globalS.isValueNull(group.get('prgrm').value); 
        let dataset           = this.globalS.isValueNull(group.get('mds').value);
        let traccs            = this.globalS.isValueNull(group.get('tracss').value);
        let staff_team        = this.globalS.isValueNull(group.get('team').value);
        let staff_cat         = this.globalS.isValueNull(group.get('cat').value);
        let staff             = this.globalS.isValueNull(group.get('staff').value);
        let recepient         = this.globalS.isValueNull(group.get('recepient').value);
        let coordinator       = this.globalS.isValueNull(group.get('coordinator').value);
        let spid              = this.globalS.isValueNull(group.get('spid').value);
        let state             = this.globalS.isValueNull(group.get('state').value);
        let costcenter        = this.globalS.isValueNull(group.get('cost').value);
        let dsoutlet          = this.globalS.isValueNull(group.get('outlet').value);
        let funding_region    = this.globalS.isValueNull(group.get('region').value);
        let svcdicipline      = this.globalS.isValueNull(group.get('dicipline').value);
        let svcregion         = this.globalS.isValueNull(group.get('sregion').value);
        let hours             = this.globalS.isValueNull(group.get('total').value);
        let dollars           = this.globalS.isValueNull(group.get('dollar').value);
        let input_type        = this.globalS.isValueNull(group.get('type').value);
        let unit              = this.globalS.isValueNull(group.get('hours').value); 
        let Undated           = this.trueString(group.get('Undated').value);
        let emoty             = null;
        let values = name+","+branch+","+funding_source+","+care_domain+","+budget_group+","+prog+","+dataset+","+traccs+","+staff_team+","+staff_cat+","+staff+","+recepient+","+coordinator+","+spid+","+state+","+costcenter+","+dsoutlet+","+funding_region+","+svcdicipline+","+svcregion+","+hours+","+dollars+","+emoty+","+emoty+","+emoty+","+emoty+","+emoty+","+emoty+","+emoty+","+input_type+","+unit+","+Undated+","+start+","+end;
        let sql = "INSERT INTO Budgets([Name], [Branch], [Funding Source], [Care Domain], [Budget Group], [Program], [Dataset Code], [Activity], [Staff Team], [Staff Category], [Staff], [Recipient],[coordinator], [SPID], [State], [CostCentre], [DSOutlet], [FundingRegion], [SvcDiscipline], [SvcRegion], [Hours], [Dollars], [Places], [O_Hours], [O_Dollars], [O_PlcPkg], [Y_Hours], [Y_Dollars], [Y_PlcPkg], [BudgetType], [Unit], Undated, StartDate, EndDate) Values ("+values+");select @@IDENTITY"; 
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{   
          
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal();
        });
      }else{
        this.postLoading = true;   
        const group = this.inputForm;
        let start             = !(this.globalS.isVarNull(group.get('start').value)) ?  "'"+this.globalS.convertDbDate(group.get('start').value)+"'" : null;
        let end               = !(this.globalS.isVarNull(group.get('end').value)) ?  "'"+this.globalS.convertDbDate(group.get('end').value)+"'" : null;
        let name              = this.globalS.isValueNull(group.get('title').value);
        let branch            = this.globalS.isValueNull(group.get('branch').value);
        let funding_source    = this.globalS.isValueNull(group.get('ftype').value); 
        let care_domain       = this.globalS.isValueNull(group.get('care').value); 
        let budget_group      = this.globalS.isValueNull(group.get('bcode').value); 
        let prog              = this.globalS.isValueNull(group.get('prgrm').value); 
        let dataset           = this.globalS.isValueNull(group.get('mds').value);
        let traccs            = this.globalS.isValueNull(group.get('tracss').value);
        let staff_team        = this.globalS.isValueNull(group.get('team').value);
        let staff_cat         = this.globalS.isValueNull(group.get('cat').value);
        let staff             = this.globalS.isValueNull(group.get('staff').value);
        let recepient         = this.globalS.isValueNull(group.get('recepient').value);
        let coordinator       = this.globalS.isValueNull(group.get('coordinator').value);
        let spid              = this.globalS.isValueNull(group.get('spid').value);
        let state             = this.globalS.isValueNull(group.get('state').value);
        let costcenter        = this.globalS.isValueNull(group.get('cost').value);
        let dsoutlet          = this.globalS.isValueNull(group.get('outlet').value);
        let funding_region    = this.globalS.isValueNull(group.get('region').value);
        let svcdicipline      = this.globalS.isValueNull(group.get('dicipline').value);
        let svcregion         = this.globalS.isValueNull(group.get('sregion').value);
        let hours             = this.globalS.isValueNull(group.get('total').value);
        let dollars           = this.globalS.isValueNull(group.get('dollar').value);
        let input_type        = this.globalS.isValueNull(group.get('type').value);
        let unit              = this.globalS.isValueNull(group.get('hours').value); 
        let Undated           = this.trueString(group.get('Undated').value);
        let emoty             = null;
        
        let recordNumber = group.get('RecordNumber').value;
        
        
        let sql = "Update Budgets SET [Name]="+name+", [Branch]="+ branch + ", [Funding Source]="+ funding_source + ", [Care Domain]="+ care_domain + ", [Budget Group]="+ budget_group + ", [Program]="+ prog + ",[Dataset Code]="+ dataset + ", [Activity]="+ traccs + ", [Staff Team]="+ staff_team + ", [Staff Category]="+ staff_cat +", [Staff]="+ staff +", [Recipient]="+ recepient +",[coordinator]="+ coordinator + ", [SPID]="+ spid + ", [State]="+ state + ", [CostCentre]="+ costcenter + ", [DSOutlet]="+ dsoutlet + ", [FundingRegion]="+ funding_region + ", [SvcDiscipline]="+ svcdicipline + ", [SvcRegion]="+ svcregion + ", [Hours]="+ hours + ", [Dollars]="+ dollars + ", [Places]="+ emoty + ", [O_Hours]="+ emoty + ", [O_Dollars]="+ emoty + ", [O_PlcPkg]="+ emoty + ", [Y_Hours]="+ emoty + ", [Y_Dollars]="+ emoty + ", [Y_PlcPkg]="+ emoty + ", [BudgetType]="+ input_type + ", [Unit]="+ unit + ", Undated="+ Undated + ",StartDate="+start+",EndDate="+end+"  WHERE [recordNumber] ='"+recordNumber+"'"; 
        console.log(sql);
        // let recordNo      = group.get('recordNo').value;
        // let sql  = "Update IM_DistributionLists SET [Recipient]='"+ recepient + "',[Activity] = '"+ service + "',[Program] = '"+ prgm + "',[Staff] = '"+ staff+ "',[Severity] = '"+ saverity + "',[ListName] = '"+ ltype+ "',[Location] = '"+ location+ "'  WHERE [recordNo] ='"+recordNo+"'";
        
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Update successful');
          this.postLoading = false;      
          this.loadData();
          this.handleCancel();
          this.resetModal();   
          this.isUpdate = false; 
        });
      }
    }
    
    delete(data: any) {
      this.postLoading = true;     
      this.menuS.deleteBudgetlist(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }
    
    buildForm() {
      this.inputForm = this.formBuilder.group({
        title: '',
        type:'',
        start:'',
        end:'',
        undated:true,
        branch:'',
        care:'',
        cost:'',
        outlet:'',
        region:'',
        ftype:'',
        prgrm:'',
        bcode:'',
        dicipline:'',
        sregion:'',
        mds:'',
        tracss:'',
        spid:'',
        state:'',
        team:'',
        cat:'',
        staff:'',
        recepient:'',
        coordinator:'',
        hours:'',
        total:'',
        older:'',
        younger:'',
        dollar:'',
        packages:'',
        RecordNumber:null,
      });
    }
    
  }
  
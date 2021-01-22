import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { EMPTY, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-pay-type',
  templateUrl: './pay-type.component.html',
  styles: [`
  .ant-modal-body {
    padding: 0px 24px !important;
  }
  textarea{
    resize:none;
  },
  `]
})
export class PayTypeComponent implements OnInit {
  
  tableData: Array<any>;
  branches:Array<any>;
  paytypes:Array<any>;
  subgroups:Array<any>;
  units:Array<any>;
  ServiceData:Array<any>;
  items:Array<any>;
  jurisdiction:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  staffApproved: boolean = false;
  staffUnApproved: boolean = false;
  competencymodal: boolean = false;
  
  current: number = 0;
  checkedflag:boolean = true;
  dateFormat: string = 'dd/MM/yyyy';
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any; 
  postLoading: boolean = false;
  isUpdate: boolean = false;
  
  title:string = "Add New Agency Pay Types";
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    private switchS:SwitchService,
    private menuS:MenuService,
    ){}
    
    ngOnInit(): void {
      this.loadData();
      this.buildForm();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Agency Pay Types"
      this.resetModal();
      this.modalOpen = true;
    }
    showstaffApprovedModal(){
      // this.resetModal();
      this.staffApproved = true;
    }
    showstaffUnApprovedModal(){
      this.staffUnApproved = true;
    }
    showCompetencyModal(){
      this.competencymodal = true;
    }
    
    loadTitle()
    {
      return this.title;
    }
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.title = "Edit Agency Pay Types"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const {
        code,
        description,
        subGroup,
        payUnit,
        payCategory,
        payID,
        payAmount,
        enddate,
        noPayExport,
        conflict,
        day0,
        day1,
        day2,
        day3,
        day4,
        day5,
        day6,
        day7,
        min,
        max,
        forceRostedTime,
        rostedDay,
        rostedTime,
        orignalminute,
        recordNumber,
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        code:code,
        description:description,
        type:payCategory,
        subgroup:subGroup,
        payrate:payAmount,
        unit:payUnit,
        end:enddate,
        payid:payID,
        exportfrompay:noPayExport,
        casuals:'',
        conflict:conflict,
        day0:day0,
        day1:day1,
        day2:day2,
        day3:day3,
        day4:day4,
        day5:day5,
        day6:day6,
        day7:day7,
        min:min,
        max:max,
        forceRostedTime:forceRostedTime,
        rostedDay:rostedDay,
        rostedTime:rostedTime,
        orignalminute:orignalminute,
        recordNumber:recordNumber,
      });
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    handleCompCancel() {
      this.competencymodal = false;
    }
    handleAprfCancel(){
      this.staffApproved = false;
    }
    handleUnAprfCancel(){
      this.staffUnApproved = false;
    }
    pre(): void {
      this.current -= 1;
    }
    
    trueString(data: any): string{
      return data ? '1': '0';
    }
    
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    
    next(): void {
      this.current += 1;
    }
    save() {
      if(!this.isUpdate){
        this.postLoading = true;
        const group = this.inputForm;
        
        let status            = "NONATTRIBUTABLE";
        let process           = "INPUT";
        let mainGroup         = "DIRECT SERVICE";
        let code              = group.get('code').value;
        let description       = group.get('description').value;
        let type              = group.get('type').value;
        let subgroup          = group.get('subgroup').value;
        let payrate           = group.get('payrate').value;
        let end               = this.globalS.convertDbDate(group.get('end').value);
        let unit              = group.get('unit').value;
        let payid             = group.get('payid').value;
        let casuals           = group.get('casuals').value;
        let exportfrompay     = group.get('exportfrompay').value;
        let conflict          = group.get('conflict').value;
        let day0              = group.get('day1').value;
        let day1              = group.get('day2').value;
        let day2              = group.get('day3').value;
        let day3              = group.get('day4').value;
        let day4              = group.get('day5').value;
        let day5              = group.get('day6').value;
        let day6              = group.get('day7').value;
        
        let values = status+"','"+process+"','"+code+"','"+description+"','"+type+"','"+payrate+"','"+unit+"','"+payid+"','"+mainGroup+"','"+subgroup+"','"+end;
        let sqlz = "insert into itemtypes ([Status],[ProcessClassification],[Title],[billText],[RosterGroup],[Amount],[Unit],[AccountingIdentifier],[MainGroup],[MinorGroup],[EndDate]) values('"+values+"');select @@IDENTITY"; 
        this.menuS.InsertDomain(sqlz).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data){
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.postLoading = false;   
            this.loading = false;       
            this.handleCancel();
            this.resetModal();
          }
          else{
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.loading = false;   
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          }
        });
      }
      else{
        this.postLoading = true;     
        const group = this.inputForm;
        let status            = "NONATTRIBUTABLE";
        let process           = "INPUT";
        let mainGroup         = "DIRECT SERVICE";
        let unitCostUom       = "EACH/SERVICE";
        let code              = group.get('code').value;
        let description       = group.get('description').value;
        let type              = group.get('type').value;
        let subgroup          = group.get('subgroup').value;
        let payrate           = group.get('payrate').value;
        let end               = this.globalS.convertDbDate(group.get('end').value);
        let unit              = group.get('unit').value;
        let payid             = group.get('payid').value;
        let recordNumber      = group.get('recordNumber').value;
        
        
        let sql  = "Update itemtypes SET [Status]='"+ status + "',[ProcessClassification] = '"+ process + "',[Title] = '"+ code + "',[billText] = '"+ description+ "',[RosterGroup] = '"+ type + "',[Amount] = '"+ payrate + "',[Unit] = '"+ unit+ "',[AccountingIdentifier] = '"+ payid+ "',[MainGroup] = '"+ mainGroup + "',[MinorGroup] = '"+ subgroup + "' WHERE [Recnum] ='"+recordNumber+"'";
        // console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data){
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.loading = false;   
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          }else{
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.loading = false;   
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          }
        });
      }
    }
    loadData(){
      this.paytypes  = ['SALARY','ALLOWANCE'];
      this.units  = ['HOUR','SERVICE'];
      this.subgroups  = ['NOT APPLICABLE','WORKED HOURS','PAID LEAVE','UNPAID LEAVE','N/C TRAVVEL BETWEEN','CHG TRAVVEL BETWEEN','N/C TRAVVEL WITHIN','CHG TRAVVEL WITHIN','OTHER ALLOWANCE'];
      
      this.loading = true;
      this.menuS.GetlistagencyPayTypes().subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    delete(data: any) {
      this.globalS.sToast('Success', 'Data Deleted!');
    }
    
    buildForm() {
      this.inputForm = this.formBuilder.group({
        code:'',
        description:'',
        type: '',
        subgroup:'',
        payrate:'',
        unit:'',
        casuals:false,
        end:new Date(),
        payid:'',
        exportfrompay:false,
        conflict:false,
        day0:false,
        day1:false,
        day2:false,
        day3:false,
        day4:false,
        day5:false,
        day6:false,
        day7:false,
        min:0,
        max:0,
        forceRostedTime:0,
        rostedDay:false,
        rostedTime:false,
        orignalminute:0,
        award1:false,
        award2:false,
        award3:false,
        award4:false,
        award5:false,
        specialShift:'',
        branch:'',
        recordNumber:null
      });
    }
    
  }
  
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService, PrintService } from '@services/index';
import { GlobalService,notificationTypes } from '@services/global.service';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Subject, EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-notificationlist',
  templateUrl: './notificationlist.component.html',
  styles:[`
  .mrg-btm{
    margin-bottom:0rem !important;
  }
  span.small-font{
    font-size:12px;
  }
  `]
})
export class NotificationlistComponent implements OnInit {
  events: Array<any>;
  
  tableData: Array<any>;
  staff:Array<any>;
  listType:Array<any>;
  program:Array<any>;
  recipients:Array<any>;
  locations:Array<any>;
  services:Array<any>;
  branches: Array<any>;
  coordinators: Array<any>;
  severity:Array<any>;
  checked = true;
  checked2=true;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add Notification List";
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  dateFormat: string = 'dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="WHERE ListName IN ('Referral Notification','Assessment Notification','Admission Notification','Refer On Notification','Not Proceed Notification','Discharge Notification','Suspend Notification','Reinstate Notification','Admin Notification','Lifecycle Event Notification') AND ISNULL(xDeletedRecord,0) = 0 AND (xEndDate Is Null OR xEndDate >= GETDATE()) ";
  staffList: any;
  allStaff:boolean = false;
  allstaffIntermediate: boolean = false;
  selectedStaff:any[];
  funding_source: any;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private printS:PrintService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService
    ){}
    private unsubscribe: Subject<void> = new Subject();
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
      this.buildForm();
      this.populateDropdowns();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    fetchAll(e){
      if(e.target.checked){
        // this.whereString = " WHERE ListName IN ('Referral Notification','Assessment Notification','Admission Notification','Refer On Notification','Not Proceed Notification','Discharge Notification','Suspend Notification','Reinstate Notification','Admin Notification','Lifecycle Event Notification') ";
        this.loadData(true);
      }else{
        // this.whereString = " WHERE ListName IN ('Referral Notification','Assessment Notification','Admission Notification','Refer On Notification','Not Proceed Notification','Discharge Notification','Suspend Notification','Reinstate Notification','Admin Notification','Lifecycle Event Notification') AND ISNULL(xDeletedRecord,0) = 0 AND (xEndDate Is Null OR xEndDate >= GETDATE()) ";
        this.loadData();
      }
    }
    loadData(isChecked: boolean = false){
      // let sql ="SELECT RecordNo, Recipient,Activity,Location,Program,Staff,ListGroup as funding_source,Mandatory as mandatory,DefaultAssignee as assignee,ListName as ltype,Severity ,xDeletedRecord as is_deleted,xEndDate as end_date from IM_DistributionLists "+this.whereString+"order by Recipient";
      this.loading = true;
      this.listS.getnotificationslist(isChecked).subscribe(data => {
        console.log(data)
        this.tableData = data;
        this.loading = false;
      })
      // this.listS.getlist(sql).subscribe(data => {
      //   console.log(data)
      //   this.tableData = data;
      //   this.loading = false;
      // });
    }
    populateDropdowns(){
      this.listType = notificationTypes;
      
      this.menuS.workflowstafflist().subscribe(data  =>  {this.staffList   = data});

      this.listS.getfundingsource().subscribe(data => this.funding_source = data);

      let branchSql  = "SELECT DESCRIPTION FROM DATADOMAINS WHERE DOMAIN = 'BRANCHES' ORDER BY Description";
      this.listS.getlist(branchSql).subscribe(data => {
        this.branches = data;
        let da ={
          "description" :"ALL"
        };
        this.branches.unshift(da);
      });

      let coordinatorSql  = "SELECT DESCRIPTION FROM DATADOMAINS WHERE DOMAIN = 'CASE MANAGERS' ORDER BY Description";
      this.listS.getlist(coordinatorSql).subscribe(data => {
        this.coordinators = data;
        let da ={
          "description" :"ALL"
        };
        this.coordinators.unshift(da);
      });

      let sql  = "SELECT TITLE FROM ITEMTYPES WHERE ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM') AND ENDDATE IS NULL";
      this.listS.getlist(sql).subscribe(data => {
        this.services = data;
        let da ={
          "title" :"ALL"
        };
        this.services.unshift(da);
      });
      
      let staff_query = "SELECT distinct [AccountNo] as name from Staff Where AccountNo not like '!%' Order BY [AccountNo] ";
      this.listS.getlist(staff_query).subscribe(data => {
        this.staff = data;
        let da ={
          "name" :"ALL"
        };
        this.staff.unshift(da);
      });

      let prog = "SELECT [NAME] as name FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' AND ENDDATE IS NULL";
      this.listS.getlist(prog).subscribe(data => {
        this.program = data;
        let da ={
          "name" :"ALL"
        };
        this.program.unshift(da);
      });
      let loca = "SELECT [NAME] FROM CSTDAOutlets WHERE [NAME] IS NOT NULL";
      this.listS.getlist(loca).subscribe(data => {
        this.locations = data;
        let da ={
          "name" :"ALL"
        };
        this.locations.unshift(da);
      });
      let recip = "SELECT ACCOUNTNO as name FROM RECIPIENTS WHERE AdmissionDate IS NOT NULL AND DischargeDate IS NULL AND ACCOUNTNO > '!Z'";
      this.listS.getlist(recip).subscribe(data => {
        this.recipients = data;
        let da ={
          "name" :"ALL"
        };
        this.recipients.unshift(da);
      });
      
      this.severity = ['ALL','LOW','MEDIUM','HIGH','CRITICAL'];
    }
    showAddModal() {
      this.heading = "Add Notification List"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit Notification List"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        ltype,
        staff,
        assignee,
        program,
        location,
        recipient,
        activity,
        funding_source,
        severity,
        mandatory,
        end_date,
        recordNo,
        branch,
        coordinator
      } = this.tableData[index];

       console.log(this.tableData[index]);
      // return;

      this.inputForm.patchValue({
        ltype:ltype,
        staff:staff,
        service:activity,
        assignee:(assignee == "True") ? true : false,
        prgm:program,
        location:location,
        recepient:recipient,
        funding_source:funding_source,
        saverity:severity,
        mandatory:mandatory,
        end_date: end_date == null ? null : new Date(end_date),
        recordNo:recordNo,
        branch: branch,
        coordinator:coordinator
      });
    }
    trueString(data: any): string{
      return data ? '1': '0';
    }
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    loadTitle()
    {
      return this.heading;
    }
    
    handleCancel() {
      this.modalOpen = false;
      this.isUpdate  = false;
      this.staffList.forEach(x => {
        x.checked = false;
      });
      this.selectedStaff = [];
    }
    updateAllCheckedFilters(filter: any): void {
      this.selectedStaff = [];
      if (this.allStaff) {
        this.staffList.forEach(x => {
          x.checked = true;
          this.selectedStaff.push(x.staffCode);
        });
      }else{
        this.staffList.forEach(x => {
          x.checked = false;
        });
        this.selectedStaff = [];
      }
      console.log(this.selectedStaff);
    }
    updateSingleCheckedFilters(index:number): void {
      if (this.staffList.every(item => !item.checked)) {
        this.allStaff = false;
        this.allstaffIntermediate = false;
      } else if (this.staffList.every(item => item.checked)) {
        this.allStaff = true;
        this.allstaffIntermediate = false;
      } else {
        this.allstaffIntermediate = true;
        this.allStaff = false;
      }
    }
    log(event: any) {
      this.selectedStaff = event;
      console.log(this.selectedStaff);
    }
    pre(): void {
      this.current -= 1;
    }
    
    next(): void {
      this.current += 1;
    }
    save() {

      var { branch, coordinator } = this.inputForm.value;

      if(!this.isUpdate){        
        this.postLoading = true;   
        const group    = this.inputForm;
        let flag       = false;
        let _sql = "";

        if(this.selectedStaff.length > 0){

          this.selectedStaff.forEach(staf => {            
            let ltype         = this.globalS.isValueNull(group.get('ltype').value);
            let _branch       = this.globalS.isValueNull(branch);
            let _coordinator  = this.globalS.isValueNull(coordinator);
            let staff         = staf;
            let service       = this.globalS.isValueNull(group.get('service').value);
            let prgm          = this.globalS.isValueNull(group.get('prgm').value);
            let location      = this.globalS.isValueNull(group.get('location').value);
            let recepient     = this.globalS.isValueNull(group.get('recepient').value);
            let funding_source = this.globalS.isValueNull(group.get('funding_source').value);
            let saverity      = this.globalS.isValueNull(group.get('saverity').value);
            let mandatory     = this.trueString(group.get('mandatory').value);
            let assignee      = this.trueString(group.get('assignee').value);
            let end_date      = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
            let values        = recepient+","+service+","+location+","+prgm+",'"+staff+"',"+mandatory+","+assignee+","+saverity+","+ltype+","+funding_source+","+end_date+","+_branch+","+_coordinator;
            let sql           = "insert into IM_DistributionLists([Recipient],[Activity],[Location],[Program],[StaffToNotify],[Mandatory],[DefaultAssignee],[Severity],[ListName],[ListGroup],[xEndDate],[Branch],[Coordinator]) Values ("+values+");"; 

         
            _sql = _sql + sql;
          });
          // console.log(_sql);
          this.menuS.InsertDomain(_sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
            flag = true;
            this.loadData();
          });
        }
        else{
          this.globalS.sToast('Success', 'Select Atleast One Staff');
          return false;
        }
        this.globalS.sToast('Success', 'Saved successful');
        this.loading = true;  
        this.loadData();
        this.postLoading = false;          
        this.handleCancel();
        this.resetModal();
      } else{

        const group           = this.inputForm;
        let ltype             = this.globalS.isValueNull(group.get('ltype').value);
        let _branch           = this.globalS.isValueNull(branch);
        let _coordinator      = this.globalS.isValueNull(coordinator);
        let staff             = this.globalS.isValueNull(group.get('staff').value);
        let service           = this.globalS.isValueNull(group.get('service').value);
        let prgm              = this.globalS.isValueNull(group.get('prgm').value);
        let location          = this.globalS.isValueNull(group.get('location').value);
        let recepient         = this.globalS.isValueNull(group.get('recepient').value);
        let funding_source    = this.globalS.isValueNull(group.get('funding_source').value);
        let saverity          = this.globalS.isValueNull(group.get('saverity').value);
        let mandatory         = this.trueString(group.get('mandatory').value);
        let assignee          = this.trueString(group.get('assignee').value);
        let end_date          = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let recordNo          = group.get('recordNo').value;


        let sql  = "Update IM_DistributionLists SET [Recipient]="+ recepient + ",[Activity] ="+ service + ",[Program] ="+ prgm +",[StaffToNotify] ="+ staff+",[Severity] ="+ saverity +",[Mandatory] ="+ mandatory +",[DefaultAssignee] ="+ assignee +",[ListName] ="+ltype+",[xEndDate] = "+end_date+ ",[Location] ="+ location+ ",[ListGroup] ="+ funding_source+ ",[Branch]="+ _branch + ",[Coordinator]="+ _coordinator + "  WHERE [recordNo] ='"+recordNo+"'";
        console.log(sql);

        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{        
          this.globalS.sToast('Success', 'Saved successful');
          this.loading = true;  
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal(); 
        });
      }
    }
    
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteDistributionlist(data.recordNo)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }    
    activateDomain(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activateDistributionlist(data.recordNo)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Activated!');
          this.loadData();
          return;
        }
      });
    } 
    buildForm() {
      this.inputForm = this.formBuilder.group({
        ltype:'',
        staff:'',
        service:'',
        assignee:false,
        prgm:'',
        location:'',
        recepient:'',
        funding_source:'',
        saverity:'',
        end_date:'',
        mandatory:false,
        recordNo:null,
        event: null,
        coordinator: null,
        branch: null
      });
      
      this.inputForm.get('ltype').valueChanges
      .pipe(
        switchMap(x => {
          if(x != 'EVENT')
          return EMPTY;
          
          return this.listS.geteventlifecycle()
        })
        )
        .subscribe(data => {
          this.events = data;
        })
      }
      
      handleOkTop() {
        this.generatePdf();
        this.tryDoctype = ""
        this.pdfTitle = ""
      }
      handleCancelTop(): void {
        this.drawerVisible = false;
        this.pdfTitle = ""
      }
      generatePdf(){
        this.drawerVisible = true;
        
        this.loading = true;
        
        var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY recipient) AS Field1," +
        "Recipient as Field2,Activity as Field3,Location as Field4,Program as Field5,Staff as Field6," + 
        "ListName as  Field7,Severity as Field8,CONVERT(varchar, [xEndDate],105) as Field9,ListGroup as Field10 from IM_DistributionLists "+this.whereString+" Order by recipient";
        
        const data = {
          "template": { "_id": "0RYYxAkMCftBE9jc" },
          "options": {
            "reports": { "save": false },
            "txtTitle": "Notification List",
            "sql": fQuery,
            "userid":this.tocken.user,
            "head1" : "Sr#",
            "head2": "Recipient",
            "head3": "Activity",
            "head4": "Location",
            "head5": "Program",
            "head6": "Staff",
            "head10": "Funding",
            "head7": "ItemType",
            "head8": "Severity",
            "head9": "End Date",
          }
        }
       this.printS.printControl(data).subscribe((blob: any) => {
          let _blob: Blob = blob;
          let fileURL = URL.createObjectURL(_blob);
          this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          this.loading = false;
        }, err => {
          this.loading = false;
          this.ModalS.error({
            nzTitle: 'TRACCS',
            nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
            nzOnOk: () => {
              this.drawerVisible = false;
            },
          });
        });
        
        
        this.loading = true;
        this.tryDoctype = "";
        this.pdfTitle = "";
      }    
    }
    
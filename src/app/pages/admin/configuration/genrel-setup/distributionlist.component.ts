import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-distributionlist',
  templateUrl: './distributionlist.component.html',
  styles:[`
  .mrg-btm{
    margin-bottom:0rem !important;
  }`]
})
export class DistributionlistComponent implements OnInit {
  
  tableData: Array<any>;
  staff:Array<any>;
  listType:Array<any>;
  program:Array<any>;
  recipients:Array<any>;
  locations:Array<any>;
  services:Array<any>;
  severity:Array<any>;
  checked = true;
  checked2=true;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add Distribution List";
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService
    ){}
    private unsubscribe: Subject<void> = new Subject();
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.buildForm();
      this.populateDropdowns();
      this.loadData();
      // this.tableData = [{ code:"Other",name:"K AGGARWAL"},{ code:"Other",name:"HILDA SMITH"}];
      this.loading = false;
      this.cd.detectChanges();
    }
    loadData(){
      let sql ="SELECT RecordNo, Recipient,Activity,Location,Program,Staff,ListName as ltype,Severity FROM IM_DistributionLists order by recipient";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
    }
    populateDropdowns(){
      this.listType = ['INCIDENT','DOCUSIGN'];
      let sql  = "SELECT TITLE FROM ITEMTYPES WHERE ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM') AND ENDDATE IS NULL";
      this.listS.getlist(sql).subscribe(data => {
        this.services = data;
        let da ={
          "title" :"ALL"
        };
        this.services.unshift(da);
      });
      
      let staff_query = "SELECT ACCOUNTNO as name FROM STAFF WHERE CommencementDate IS NOT NULL AND TerminationDate IS NULL AND ACCOUNTNO > '!Z'";
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
      this.heading = "Add Distribution List"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit Distribution List"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        ltype,
        staff,
        service,
        assignee,
        program,
        location,
        recipient,
        activity,
        severity,
        mandatory,
        recordNo,
        
      } = this.tableData[index];
      this.inputForm.patchValue({
        ltype:ltype,
        staff:staff,
        service:activity,
        assignee:assignee,
        prgm:program,
        location:location,
        recepient:recipient,
        saverity:severity,
        mandatory:mandatory,  
        recordNo:recordNo,
      });
    }
    loadtitle(){
      return this.heading
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
      
      if(!this.isUpdate){        
        this.postLoading = true;   
        const group = this.inputForm;
        let ltype     = group.get('ltype').value;
        let staff = group.get('staff').value;
        let service = group.get('service').value;
        let prgm   = group.get('prgm').value;
        let location   = group.get('location').value;
        let recepient   = group.get('recepient').value;
        let saverity      = group.get('saverity').value;
        let values = recepient+"','"+service+"','"+location+"','"+prgm+"','"+staff+"','"+saverity+"','"+ltype;
        let sql = "insert into IM_DistributionLists([Recipient],[Activity],[Location],[Program],[Staff],[Severity],[ListName]) Values ('"+values+"')"; 
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
        this.postLoading  = true;   
        const group       = this.inputForm;
        let ltype         = group.get('ltype').value;
        let staff         = group.get('staff').value;
        let service       = group.get('service').value;
        let prgm          = group.get('prgm').value;
        let location      = group.get('location').value;
        let recepient     = group.get('recepient').value;
        let saverity      = group.get('saverity').value;
        let recordNo      = group.get('recordNo').value;
        let sql  = "Update IM_DistributionLists SET [Recipient]='"+ recepient + "',[Activity] = '"+ service + "',[Program] = '"+ prgm + "',[Staff] = '"+ staff+ "',[Severity] = '"+ saverity + "',[ListName] = '"+ ltype+ "',[Location] = '"+ location+ "'  WHERE [recordNo] ='"+recordNo+"'";
        // console.log(sql);
        // return false;
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
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
    buildForm() {
      this.inputForm = this.formBuilder.group({
        ltype:'',
        staff:'',
        service:'',
        assignee:true,
        prgm:'',
        location:'',
        recepient:'',
        saverity:'',
        mandatory:true,
        recordNo:null,
      });
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY RecordNo) AS Field1," +
      "Recipient as Field2,Activity as Field3,Location as Field4,Program as Field5,Staff as Field6," + 
      "ListName as  Field6,Severity as Field8 FROM IM_DistributionLists order by recipient";
      
      const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
      
      const requestOptions = {
        headers: new HttpHeaders(headerDict)
      };
      
      const data = {
        "template": { "_id": "0RYYxAkMCftBE9jc" },
        "options": {
          "reports": { "save": false },
          "txtTitle": "Distribution List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2": "Recipient",
          "head3": "Activity",
          "head4": "Location",
          "head5": "Program",
          "head6": "Staff",
          "head7": "ItemType",
          "head8": "Severity",
        }
      }
      this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
      .subscribe((blob: any) => {
        let _blob: Blob = blob;
        let fileURL = URL.createObjectURL(_blob);
        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.loading = false;
      }, err => {
        console.log(err);
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
  
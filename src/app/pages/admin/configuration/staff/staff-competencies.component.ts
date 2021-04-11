import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService ,MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-staff-competencies',
  templateUrl: './staff-competencies.component.html',
  styles: []
})
export class StaffCompetenciesComponent implements OnInit {
  
  tableData: Array<any>;
  items:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  dateFormat: string ='dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Staff Competencies";
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService,
    ){}

    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
      this.buildForm();
      this.loadData();
      this.populateDropDown();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Staff Competencies"
      this.resetModal();
      this.modalOpen = true;
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
      this.title = "Edit Staff Competencies"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        description,
        cGroup,
        mandatory,
        undated,
        end_date,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        name: description,
        group:cGroup,
        mandatory:(mandatory == 1) ? true:false,
        undated:(undated == 1) ? true:false,
        enddate:end_date,
        recordNumber:recordNumber
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
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){        
        this.postLoading = true;   
        const group = this.inputForm;
        let name        = group.get('name').value.trim();
        let is_exist    = this.globalS.isNameExists(this.tableData,name);
        if(is_exist){
          this.globalS.sToast('Unsuccess', 'Title Already Exist');
          this.postLoading = false;
          return false;   
        }
        let domain       = 'STAFFATTRIBUTE';
        let groupz       = group.get('group').value;
        let mandatory    = (group.get('mandatory').value) ? 1 : 0 ;
        let undated      = (group.get('undated').value) ? 1 : 0 ;
        let enddate      = !(this.globalS.isVarNull(group.get('enddate').value)) ?  "'"+this.globalS.convertDbDate(group.get('enddate').value)+"'" : null;
        let values = domain+"','"+name+"','"+groupz+"','"+mandatory+"',"+undated+",'"+enddate;
        let sql = "insert into DataDomains([Domain],[Description],[User1],[Embedded],[Undated],[EndDate]) Values ('"+values+"')"; 
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
        let domain       = 'STAFFATTRIBUTE';
        let name         = group.get('name').value;
        let groupz       = group.get('group').value;
        let mandatory    = group.get('mandatory').value;
        let undated      = group.get('undated').value;
        let enddate      = !(this.globalS.isVarNull(group.get('enddate').value)) ?  "'"+this.globalS.convertDbDate(group.get('enddate').value)+"'" : null;
        let recordNumber  = group.get('recordNumber').value;
        
        let sql  = "Update DataDomains SET [Description]='"+ name + "',[User1] = '"+ groupz + "',[Embedded] = '"+ mandatory + "',[Undated] = '"+ undated + "',[EndDate] = "+ enddate + " WHERE [RecordNumber] ='"+recordNumber+"'";
        
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
    loadData(){
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY Description) AS row_num,RecordNumber,Description,Embedded AS Mandatory,User1 as cGroup,Undated as undated,CONVERT(varchar, [enddate],105) as end_date from DataDomains "+this.whereString+" Domain = 'STAFFATTRIBUTE'";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        console.log(data);
        this.loading = false;
      });
    }
    populateDropDown(){
      let sql2 = "Select RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND Domain = 'COMPETENCYGROUP'  ORDER BY DESCRIPTION";
      this.listS.getlist(sql2).subscribe(data => {
        this.items = data;
        console.log(data);
      });
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "WHERE";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
        this.loadData();
      }
    }
    activateDomain(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activeDomain(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Activated!');
          this.loadData();
          return;
        }
      });
    }
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteDomain(data.recordNumber)
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
        name: '',
        group: '',
        enddate:'',
        mandatory :false,
        undated   :false,
        recordNumber:null
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,Embedded as Field3,CONVERT(varchar, [enddate],105) as Field4 from DataDomains "+this.whereString+" Domain='STAFFATTRIBUTE'";
      
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
          "txtTitle": "Staff Competencies List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Name",
          "head3" : "Mandatory",
          "head4" : "End Date",
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
  
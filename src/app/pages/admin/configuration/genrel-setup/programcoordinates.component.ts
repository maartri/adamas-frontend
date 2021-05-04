import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-programcoordinates',
  templateUrl: './programcoordinates.component.html',
  styles: []
})
export class ProgramcoordinatesComponent implements OnInit {
  
  tableData: Array<any>;
  staff:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  dateFormat: string ='dd/MM/yyyy';
  heading:string = "Add New Managers Coordinators"
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  temp_title: any;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private menuS:MenuService,
    private switchS:SwitchService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService
    ){}
    
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
      this.buildForm();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    loadData(){
      this.loading = true;
      this.menuS.getDataDomainByType("CASE MANAGERS",this.check).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
      let sql2= "Select distinct AccountNo as name from Staff WHERE AccountNo > '0' AND AccountNo <> '!INTERNAL' AND AccountNo <> '!MULTIPLE' AND (((CommencementDate IS NULL) AND (TerminationDate IS NULL)) OR  ((CommencementDate IS NOT NULL) AND (TerminationDate IS NULL)))";
      this.listS.getlist(sql2).subscribe(data => {
        this.staff = data;
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
      this.heading  = "Edit Managers Coordinators"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        staff,
        name,
        end_date,
        recordNumber,
        
      } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        code:staff,
        end_date:end_date,
        recordNumber:recordNumber,
        
      });
      this.temp_title = name;
    }
    loadTitle()
    {
      return this.heading
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
        const group  = this.inputForm;
        let name        = group.get('name').value.trim().uppercase();
        let is_exist    = this.globalS.isNameExists(this.tableData,name);
        if(is_exist){
          this.globalS.sToast('Unsuccess', 'Title Already Exist');
          this.postLoading = false;
          return false;   
        }
        let domain = "'CASE MANAGERS'";
        let code   = this.globalS.isValueNull(group.get('code').value);
            name   = this.globalS.isValueNull(group.get('name').value);
        let end_date      = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        
        let values = domain+","+code+","+end_date+","+name;
        let sql = "insert into DataDomains (Domain,HACCCode,EndDate,Description) Values ("+values+")";
          console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          // this.globalS.sToast('Unsuccess', 'not saved' + data);
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal();
        });
      }else{
        const group = this.inputForm;
        let name        = group.get('name').value.trim().uppercase();
          if(this.temp_title != name){
            let is_exist    = this.globalS.isNameExists(this.tableData,name);
            if(is_exist){
              this.globalS.sToast('Unsuccess', 'Title Already Exist');
              this.postLoading = false;
              return false;   
            }
          }
        let code   = this.globalS.isValueNull(group.get('code').value);
        name   = this.globalS.isValueNull(group.get('name').value);
        let end_date     =  !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let recordNumber = group.get('recordNumber').value;
        let sql  = "Update DataDomains SET [HACCCode] ="+ code+",[EndDate] ="+ end_date+",[Description]="+ name+" WHERE [RecordNumber]='"+recordNumber+"'";
        
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Updated successful');     
          else
          this.globalS.sToast('Success', 'Updated successful');
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
        code:'',
        name:'',
        end_date:'',
        recordNumber:null,
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
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,HACCCode as Field3,CONVERT(varchar, [enddate],105) as Field4,DeletedRecord as is_deleted from DataDomains "+this.whereString+" Domain='CASE MANAGERS'";
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
          "txtTitle": "Programe Coordinates List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Name",
          "head3" : "Staff Code",
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
  
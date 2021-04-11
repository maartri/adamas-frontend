import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-medical-dignosis',
  templateUrl: './medical-dignosis.component.html',
  styles: []
})
export class MedicalDignosisComponent implements OnInit {
  
  tableData: Array<any>;
  items:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Medical Diagnosis";
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;   
  dateFormat: string ='dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="WHERE ISNULL(xDeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND RecordNumber > 35000";
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
      this.items = ["Leprosy","Other Form of Leprosy","Bordline"]
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    loadData(){
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY Description) AS row_num, [RecordNumber], [Description],[Code],[ICDCode],[EndDate] as end_date,[xDeletedRecord] as is_deleted FROM MDiagnosisTypes " +this.whereString+ " Order BY [Description]";
      console.log(sql);
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        console.log(data);
        this.loading = false;
      });
    }
    
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "Where RecordNumber > 35000";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(xDeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND RecordNumber > 35000";
        this.loadData();
      }
    }
    showAddModal() {
      this.title = "Add New Medical Diagnosis"
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
      this.title = "Edit New Medical Diagnosis"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        description,
        code,
        icdCode,
        end_date,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        name    :     (description == null) ? '' : description,
        icdcode :     (icdCode == null) ? '' : icdCode,
        usercode:     (code == null) ? '' : code,
        end_date:end_date,
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
        name             = this.globalS.isValueNull(group.get('name').value);
        let icdcode          = this.globalS.isValueNull(group.get('icdcode').value);
        let usercode         = this.globalS.isValueNull(group.get('usercode').value);
        let end_date         = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let values           = name+","+icdcode+","+usercode+","+end_date;
        let sql              = "insert into MDiagnosisTypes([Description],[ICDCode],[Code],[EndDate]) Values ("+values+")"; 
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
        this.postLoading     = true;   
        const group          = this.inputForm;
        let name             = this.globalS.isValueNull(group.get('name').value);
        let icdcode          = this.globalS.isValueNull(group.get('icdcode').value);
        let usercode         = this.globalS.isValueNull(group.get('usercode').value);
        let end_date         = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let recordNumber     = group.get('recordNumber').value;
        let sql  = "Update MDiagnosisTypes SET [Description]="+ name + ",[ICDCode] = "+ icdcode + ",[Code] = "+ usercode + ",[EndDate] = "+ end_date + " WHERE [RecordNumber] ='"+recordNumber+"'";
        console.log(sql);
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
      this.menuS.deleteMDiagnosisTypes(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }
    activateMDiagnosisTypes(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activateMDiagnosisTypes(data.recordNumber)
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
        name: '',
        icdcode: '',
        usercode:'',
        end_date:'',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,[Description] as Field2,[Code] as Field3,[ICDCode] as Field4,CONVERT(varchar, [EndDate],105) as Field5 FROM MDiagnosisTypes "+this.whereString+" Order BY [Description]";
      
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
          "txtTitle": "Recipient Medical Diagnosis List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Description",
          "head3" : "User Code",
          "head4" : "ICD Code",
          "head5" : "End Date",
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
  
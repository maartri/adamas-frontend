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
  selector: 'app-document-template',
  templateUrl: './document-template.component.html',
  styles: []
})
export class DocumentTemplateComponent implements OnInit {
  
  tableData: Array<any>;
  listType:Array<any>;
  program:Array<any>;
  fileClass:Array<any>;
  docCat:Array<any>;
  canCreate:boolean= true;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  user: any;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add Document Template";
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  dateFormat: string = 'dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  temp_title: any;
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
      this.userRole = this.tocken.role;
      this.buildForm();
      this.populateDropdowns();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    reload(reload: boolean){
      if(reload){

      }
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "where";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
        this.loadData();
      }
    }
    loadData(){
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY MinorGroup) AS row_num,RecordNo, Title, TRACCSType AS [Type], MainGroup AS [Category], MinorGroup AS Description,Template,EndDate as end_date,CanCreateFile as can_create,DeletedRecord as is_deleted FROM DOC_Associations "+this.whereString+" LocalUser = 'MASTER'";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
    }
    populateDropdowns(){
      this.listType = ['CAREPLAN','DOCUMENT'];
      
        this.menuS.getDataDomainByType("FILECLASS",false).subscribe(data => {
          this.fileClass = data;
          this.loading = false;
        });
        this.menuS.getDataDomainByType("DOCCAT",false).subscribe(data => {
          this.docCat = data;
          this.loading = false;
        });
    }
    showAddModal() {
      this.heading = "Add Document Template"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit Document Template"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        category,
        description,
        end_date,
        recordNo,
        template,
        title,
        can_create,
        type,
      } = this.tableData[index];
      this.inputForm.patchValue({
        category:category,
        description:description,
        end_date:end_date,
        template:template,
        title:title,
        can_create:(can_create == "True") ? true : false,
        type:type,
        recordNo:recordNo,
      });
      this.temp_title = title;
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
    }
    pre(): void {
      this.current -= 1;
    }
    
    next(): void {
      this.current += 1;
    }
    save() {
      
      if(!this.isUpdate){       
        this.postLoading   = true;   
        const group        = this.inputForm;
        let name        = group.get('title').value.trim().toUpperCase();
        let is_exist    = this.globalS.isNameExists(this.tableData,name);
        if(is_exist){
          this.globalS.sToast('Unsuccess', 'Title Already Exist');
          this.postLoading = false;
          return false;   
        }
        let title          = this.globalS.isValueNull(group.get('title').value);
        let type           = this.globalS.isValueNull(group.get('type').value);
        let description    = this.globalS.isValueNull(group.get('description').value);
        let category       = this.globalS.isValueNull(group.get('category').value);
        let template       = this.globalS.isValueNull(group.get('template').value);
        let can_create     = this.trueString(group.get('can_create').value);
        let end_date       = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let local_user     = "'MASTER'";

        let values = title+","+type+","+description+","+category+","+template+","+can_create+","+local_user+","+end_date;
        let sql = "insert into DOC_Associations([Title],[TRACCSType],[MainGroup],[MinorGroup],[Template],[CanCreateFile],[LocalUser],[EndDate]) Values ("+values+")"; 
        // console.log(sql);
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
        let name        = group.get('title').value.trim().toUpperCase();
          if(this.temp_title != name){
            let is_exist    = this.globalS.isNameExists(this.tableData,name);
            if(is_exist){
              this.globalS.sToast('Unsuccess', 'Title Already Exist');
              this.postLoading = false;
              return false;   
            }
          }
        let title          = this.globalS.isValueNull(group.get('title').value);
        let type           = this.globalS.isValueNull(group.get('type').value);
        let description    = this.globalS.isValueNull(group.get('description').value);
        let category       = this.globalS.isValueNull(group.get('category').value);
        let template       = this.globalS.isValueNull(group.get('template').value);
        let can_create     = this.trueString(group.get('can_create').value);
        let end_date       = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let local_user     = "'MASTER'";
        let recordNo   = group.get('recordNo').value;
        let sql  = "Update DOC_Associations SET [Title]="+ title + ",[TRACCSType] ="+ type + ",[MainGroup] ="+ category +",[MinorGroup] ="+ description+",[Template] ="+ template +",[CanCreateFile] ="+ can_create +",[LocalUser] ="+ local_user +",[EndDate] = "+end_date+ " WHERE [recordNo] ='"+recordNo+"'";
        console.log(sql);
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
      this.menuS.deleteDocumentTemplatelist(data.recordNo)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }    
    activateDocument(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activateDocumentTemplatelist(data.recordNo)
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
        category:'',
        description:'',
        end_date:'',
        template:'',
        title:'',
        type:'',
        can_create:true,
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
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY MinorGroup) AS Field1,RecordNo, Title as Field2, TRACCSType AS Field3, MainGroup AS Field4, MinorGroup AS Field5,Template as Field6,CONVERT(varchar, [EndDate],105) as Field7 FROM DOC_Associations "+this.whereString+" LocalUser = 'MASTER'";
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
          "txtTitle": "Document Template",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2": "Title",
          "head3": "Type",
          "head4": "Category",
          "head5": "Classification",
          "head6": "Template",
          "head7": "End Date",
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
  
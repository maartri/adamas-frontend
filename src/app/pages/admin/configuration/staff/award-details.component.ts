import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService, PrintService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-award-details',
  templateUrl: './award-details.component.html',
  styles: [`
  textarea{
    resize:none;
  },
  table {
    table-layout: fixed; 
    width: 100%
  },  
  td{
    word-wrap: break-word;
  }
  `]
})
export class AwardDetailsComponent implements OnInit {
  
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
  title:string = "Add New Award Details";
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
    private printS:PrintService,
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
      this.title = "Add New Award Details"
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
      this.title = "Edit New Award Details"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        code,
        description,
        category,
        level,
        notes,
        end_date,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        item: code,
        description:description,
        category:category,
        level:level,
        notes:notes,
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
    delete(data: any) {
          this.globalS.sToast('Failure', 'Data Deleted!');
    }
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){         
      }else{
      }
    }
    loadData(){
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY Description) as row_num,RecordNo, Code, Description, Category, Level FROM AwardPos";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "WHERE";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
        this.loadData();
      }
    }
    populateDropDown(){  
      let branch = "SELECT RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain =  'AWARDLEVEL' ORDER BY Description";
      this.listS.getlist(branch).subscribe(data => {
        this.items = data;
        this.loading = false;
      });  
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
    buildForm() {
      this.inputForm = this.formBuilder.group({
        item: '',
        description: '',
        category: '',
        level: '',
        notes: '',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,Code as Field3, Category as Field4,Level as Field5,CONVERT(varchar, [enddate],105) as Field6 FROM AwardPos";
      
      const data = {
        "template": { "_id": "0RYYxAkMCftBE9jc" },
        "options": {
          "reports": { "save": false },
          "txtTitle": "Award Details List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Description",
          "head3" : "Code",
          "head4" : "Category",
          "head5" : "Level",
          "head6" : "End Date",
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
  
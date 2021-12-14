import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService, PrintService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-funding-sources',
  templateUrl: './funding-sources.component.html',
  styles: []
})
export class FundingSourcesComponent implements OnInit {
  
  tableData: Array<any>;
  dateFormat: string ='dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add Funding Sources";
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
    private printS:PrintService,
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
      this.loading = false;
      this.cd.detectChanges();
    }
    
    loadData(){
      this.loading = true;
      this.menuS.getlistFundingSource(this.check).subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
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
    showAddModal() {
      this.heading = "Add Funding Sources"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit Funding Sources"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        description,
        user1,
        user2,
        endDate,
        recordNumber,
        
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        name:description,
        glrevnue:user1,
        glcost:user2,
        end_date:endDate, 
        recordNumber:recordNumber,
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
        let domain       = "'FUNDINGBODIES'";
        let name         =  this.globalS.isValueNull(group.get('name').value);
        let glrevnue     =  this.globalS.isValueNull(group.get('glrevnue').value);
        let glcost       =  this.globalS.isValueNull(group.get('glcost').value);
        let end_date     =  !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;

        let values = domain+","+name.trim()+","+glrevnue+","+glcost+","+end_date;

        let sql = "insert into DataDomains([Domain],[Description],[User1],[User2],[EndDate]) Values ("+values+")"; 
        
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
        let name          =  this.globalS.isValueNull(group.get('name').value);
        let glrevnue      =  this.globalS.isValueNull(group.get('glrevnue').value);
        let glcost        =  this.globalS.isValueNull(group.get('glcost').value);
        let end_date      =  !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
       
        

        let recordNumber  = group.get('recordNumber').value;
        
        let sql  = "Update DataDomains SET [Description]="+name+",[User1]="+glrevnue+",[User2]="+glcost+",[EndDate]= "+end_date+" WHERE [RecordNumber]='"+recordNumber+"'";
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
        name:'',
        glrevnue:'',
        glcost:'',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,User1 as Field3,User2 as Field4,CONVERT(varchar, [enddate],105) as Field5 from DataDomains "+this.whereString+" Domain='FUNDINGBODIES'";
      
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
          "txtTitle": "Funding Sources List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Title",
          "head3" : "GL Revenue A/c",
          "head4" : "Gl Cost A/c",
          "head5" : "End Date",
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
  
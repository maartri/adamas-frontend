import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService, PrintService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styles: []
})
export class HolidaysComponent implements OnInit {
  
  tableData: Array<any>;
  states:Array<any>;
  loading: boolean = false;
  dateFormat: string = 'dd/MM/yyyy';
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Public Holidays";
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(xDeletedRecord, 0) = 0";
  whereLive   :string="Where ISNULL(xDeletedRecord, 0) = 0";
  temp_title: any;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private menuS:MenuService,
    private printS:PrintService,
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
    loadTitle()
    {
      return this.title
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "";
        this.whereLive = "";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(xDeletedRecord, 0) = 0";
        this.whereLive   = "Where ISNULL(xDeletedRecord, 0) = 0";
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
    loadData(){
      let sql ="Select ROW_NUMBER() OVER(ORDER BY DESCRIPTION) AS row_num,RECORDNO,DATE,DESCRIPTION,Stats,PublicHolidayRegion,xDeletedRecord as is_deleted from PUBLIC_HOLIDAYS "+this.whereString+" Order By DESCRIPTION";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
      this.states = ['ALL','NSW','NT','QLD','SA','TAS','VIC','WA','ACT'];
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
      // debugger;
      this.title = "Edit Public Holidays"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        date,
        description,
        stats,
        recordno,
      } = this.tableData[index];
      this.inputForm.patchValue({
        date: date,
        description:description,
        state:stats,
        recordno:recordno,
      });
      this.temp_title = description;
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    
    save() {
      
      if(!this.isUpdate){        
        this.postLoading = true;   
        const group  = this.inputForm;
        let name        = group.get('description').value.trim().toUpperCase();
        let is_exist    = this.globalS.isDescriptionExists(this.tableData,name);
        if(is_exist){
          this.globalS.sToast('Unsuccess', 'Title Already Exist');
          this.postLoading = false;
          return false;   
        }

        let description   = this.globalS.isValueNull(group.get('description').value.trim().toUpperCase());
        let stats         = this.globalS.isValueNull(group.get('state').value);
        let PublicHolidayRegion = this.globalS.isValueNull(group.get('region').value);
        let date          = !(this.globalS.isVarNull(group.get('date').value)) ?  "'"+this.globalS.convertDbDate(group.get('date').value)+"'" : null;
        
        let values = date+","+description+","+stats+","+PublicHolidayRegion;
        let sql = "insert into PUBLIC_HOLIDAYS (DATE,DESCRIPTION,Stats,PublicHolidayRegion) Values ("+values+")";
        // console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          this.loadData();
          this.postLoading = false; 
          this.loading = false;         
          this.handleCancel();
          this.resetModal();
        });
      }else{
        const group = this.inputForm;
        let name        = group.get('description').value.trim().toUpperCase();
          if(this.temp_title != name){
            let is_exist    = this.globalS.isDescriptionExists(this.tableData,name);
            if(is_exist){
              this.globalS.sToast('Unsuccess', 'Title Already Exist');
              this.postLoading = false;
              return false;   
            }
          }
        let description   = this.globalS.isValueNull(group.get('description').value);
        let stats         = this.globalS.isValueNull(group.get('state').value);
        let PublicHolidayRegion = this.globalS.isValueNull(group.get('region').value);
        let date          = !(this.globalS.isVarNull(group.get('date').value)) ?  "'"+this.globalS.convertDbDate(group.get('date').value)+"'" : null;
        let recordno = group.get('recordno').value;
        let sql  = "Update PUBLIC_HOLIDAYS SET [DATE] ="+ date+",[DESCRIPTION] ="+ description+",[Stats] ="+ stats+",[PublicHolidayRegion] ="+ PublicHolidayRegion +" WHERE [RECORDNO]='"+recordno+"'";
        // console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Updated successful');     
          else
          this.globalS.sToast('Success', 'Updated successful');
          this.postLoading = false;   
          this.loading = false;  
          this.isUpdate = false; 
          this.loadData();
          this.handleCancel();
          this.resetModal();    
        });
      }
    }
    
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteholidayslist(data.recordno)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }
    activateHoliday(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activateholidayslist(data.recordno)
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
        date:'',
        description:'',
        state:'',
        region:'',
        recordno:null,
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
      // xDeletedRecord
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY DESCRIPTION) AS Field1,[DESCRIPTION] as Field2 ,[Stats] as Field3,CONVERT(varchar, [DATE],105) as Field4 from PUBLIC_HOLIDAYS "+this.whereString+"Order By DESCRIPTION";
      
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
          "txtTitle": "Public Holidays List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Title",
          "head3" : "State",
          "head4" : "Date",
        }
      }
      this.printS.print(data).subscribe(blob => { 
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
  
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
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: []
})
export class VehiclesComponent implements OnInit {
  
  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  modalVariables:any;
  dateFormat: string ='dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  inputVariables:any;
  title:string = "Add Vehicles"
  private unsubscribe: Subject<void> = new Subject();
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
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
      this.loading = false;
      this.cd.detectChanges();
    }
    loadTitle(){
      return this.title;
    }
    showAddModal() {
      this.title = "Add Vehicles"
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
      this.title = "Edit Vehicles"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        end_date,
        recordNumber,
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        name: name,
        end_date:end_date,
        recordNumber:recordNumber,
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
    loadData(){
      this.loading = true;
      this.menuS.getDataDomainByType("VEHICLES",this.check).subscribe(data => {
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
    save() {
      this.postLoading = true;     
      
      if(!this.isUpdate){  
        const group     = this.inputForm;
        let domain      = "'VEHICLES'";
        let name        = this.globalS.isValueNull(group.get('name').value);
        let expiry      = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
        let values = domain+","+name+","+expiry;
        let sql = "insert into DataDomains([Domain],[Description],[EndDate]) Values ("+values+")";

        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Unsuccess', 'Saved successful' + data);
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal();
        });
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
          let name        = this.globalS.isValueNull(group.get('name').value);
          let expiry      = !(this.globalS.isVarNull(group.get('end_date').value)) ?  "'"+this.globalS.convertDbDate(group.get('end_date').value)+"'" : null;
          let recordNumber  = group.get('recordNumber').value;

          let sql  = "Update DataDomains SET [Description]="+name+",[EndDate]="+expiry+" WHERE [RecordNumber] ='"+recordNumber+"'";
          this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
            if (data) 
            this.globalS.sToast('Success', 'Updated successful');     
            else
            this.globalS.sToast('Unsuccess', 'Updated successful' + data);
            this.loadData();
            this.postLoading = false;          
            this.isUpdate = false;
            this.handleCancel();
            this.resetModal();
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
          name: '',
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
        
        var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,CONVERT(varchar, [enddate],105) as Field3 from DataDomains "+this.whereString+" Domain='VEHICLES'";
        
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
            "txtTitle": "Vehicles List",
            "sql": fQuery,
            "userid":this.tocken.user,
            "head1" : "Sr#",
            "head2" : "Name",
            "head3" : "End Date",
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
    
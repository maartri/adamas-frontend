import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuService } from '@services/menu.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'app-addresstypes',
  templateUrl: './addresstypes.component.html',
  styles: []
})
export class AddresstypesComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add Address Type";
  private unsubscribe: Subject<void> = new Subject();
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
    private switchS:SwitchService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService
  ){}
    
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
    this.buildForm();
    this.loadData();
    this.loading = true;
    this.cd.detectChanges();
  }
  loadTitle(){
    return this.title;
  }
  showAddModal() {
    this.title = "Add Address Type";
    this.resetModal();
    this.modalOpen = true;
  }
  
  resetModal() {
    this.current = 0;
    this.inputForm.reset();
    this.postLoading = false;
  }
  
  showEditModal(index: any) {
    this.isUpdate = true;
    this.modalOpen = true;
    this.title = "Edit Address Type";
    this.current = 0;
    
    const { 
      name,
      recordNumber
    } = this.tableData[index];
    this.inputForm.patchValue({
      name: name,
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
      this.switchS.addData(  
        this.modalVariables={
          title: 'Address Types'
        }, 
        this.inputVariables = {
          display: group.get('name').value,
          domain: 'ADDRESSTYPE', 
        }
        ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Unsuccess', 'Data not saved' + data);
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal();
        });
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
        this.switchS.updateData(  
          this.modalVariables={
            title: 'Address Types'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            primaryId:group.get('recordNumber').value,
            domain: 'ADDRESSTYPE',
          }
          
          ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) 
            this.globalS.sToast('Success', 'Updated successful');     
            else
            this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
            this.loadData();
            this.postLoading = false;          
            this.handleCancel();
            this.resetModal();
          });
        }
        
      }
      loadData(){
        let sql ="SELECT ROW_NUMBER() OVER(ORDER BY Description) AS row_num, Description as name,recordNumber from DataDomains where Domain='ADDRESSTYPE'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
          this.tableData = data;
          this.loading = false;
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
        
        var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2 from DataDomains where Domain='ADDRESSTYPE'";
        
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
            "txtTitle": "Address Type List",
            "sql": fQuery,
            "userid":this.tocken.user,
            "head1" : "Sr#",
            "head2" : "Title",
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

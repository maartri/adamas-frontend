import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'app-contacttypes',
  templateUrl: './contacttypes.component.html',
  styles: []
})
export class ContacttypesComponent implements OnInit {
    tableData: Array<any>;
    contactGroups:Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    heading:string = "Add New Contact Type"
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
      this.loading = false;
      this.cd.detectChanges();
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
      this.heading  = "Edit Contact Type"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        pgroup,
        title,

      } = this.tableData[index];
        this.inputForm.patchValue({
          title: title,
          pgroup:pgroup,
          
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
      this.postLoading = true;
      this.globalS.sToast('Success', 'Changes saved');
      this.handleCancel();
      this.resetModal();
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

    loadData(){
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY Description) AS row_num,Description as title,HACCCode as pgroup,recordNumber from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain='CONTACTSUBGROUP' ";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });

      let sql2 = "select distinct Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain = 'CONTACTGROUP'";
      this.listS.getlist(sql2).subscribe(data => {
        this.contactGroups = data;
        this.loading = false;
      });
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        pgroup:'',
        title:'',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,[Description] as Field2,[HACCCode] as Field3 from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain='CONTACTSUBGROUP'";
      
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
          "txtTitle": "Contact Type List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Title",
          "head3" : "Group",
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

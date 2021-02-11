import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuService } from '@services/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-funding-regions',
  templateUrl: './funding-regions.component.html',
  styleUrls: ['./funding-regions.component.css']
})

export class FundingRegionsComponent implements OnInit {

  
  tableData: Array<any>;
  fundinglist: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  check : boolean = false;
  modalVariables: any;
  inputVariables:any;
  title:string = "Add Funding Regions";
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND";
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
      console.log(this.userRole);
      this.buildForm();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    loadTitle()
    {
      return this.title;
    }
    trueString(data: any): string{
      return data ? '1': '0';
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "WHERE";
        console.log("true");
        this.loadData();
      }else{
        console.log("false");
        this.whereString = "Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND";
        this.loadData();
      }
    }

    loadData(){
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY recordNumber) AS row_num,Description as name,recordNumber,DeletedRecord as is_deleted from DataDomains "+this.whereString+" Domain='FUNDREGION'";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
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
      this.title = "Edit Funding Regions"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        description: name,
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
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){         
        this.switchS.addData(  
          this.modalVariables={
            title: 'Funding Regions'
          }, 
          this.inputVariables = {
            display: group.get('description').value,
            domain: 'FUNDREGION',         
            
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
              title: 'Funding Regions'
            }, 
            this.inputVariables = {
              display: group.get('description').value,
              primaryId:group.get('recordNumber').value,
              domain: 'FUNDREGION',
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
            description: '',
            recordNumber:0,
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
          
          var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY recordNumber) AS Field1,Description as Field2 from DataDomains "+this.whereString+" Domain='FUNDREGION' AND ISNULL(DataDomains.DeletedRecord, 0) = 0";
          
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
              "txtTitle": "Funding Region List",
              "sql": fQuery,
              "userid":this.tocken.user,
              "head1" : "Sr#",
              "head2" : "Name",
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
      
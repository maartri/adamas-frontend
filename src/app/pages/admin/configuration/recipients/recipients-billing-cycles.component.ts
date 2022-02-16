import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuService } from '@services/menu.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';
import { PrintService } from '@services/print.service';
import { TimeSheetService } from '@services/timesheet.service';

@Component({
  selector: 'app-recipients-billing-cycles',
  templateUrl: './recipients-billing-cycles.component.html',
  styles: []
})
export class RecipientsBillingCyclesComponent implements OnInit {

  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  modalVariables:any;
  inputVariables:any;
  heading:string = "Add New Recipients Billing Cycles"
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;   
  dateFormat: string ='dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="WHERE ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  temp_title: any;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private timeS:TimeSheetService,
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private printS:PrintService,
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
      return this.heading;
    }
    showAddModal() {
      this.heading  = "Add New Recipients Billing Cycles"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit Recipients Billing Cycles"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        end_date,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        end_date:end_date,
        recordNumber:recordNumber,
      });
      this.temp_title = name;
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
      const group = this.inputForm;
      if(!this.isUpdate){         
        let name        = group.get('name').value.trim().toUpperCase();
        let is_exist    = this.globalS.isNameExists(this.tableData,name);
        if(is_exist){
          this.globalS.sToast('Unsuccess', 'Title Already Exist');
          this.postLoading = false;
          return false;   
        }
        this.switchS.addData(  
          this.modalVariables={
            title: 'Recipient Billing Cycles'
          }, 
          this.inputVariables = {
            display: group.get('name').value,
            end_date:!(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
            domain: 'BILLINGCYCLE', 
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
          let name        = group.get('name').value.trim().toUpperCase();
          if(this.temp_title != name){
            let is_exist    = this.globalS.isNameExists(this.tableData,name);
            if(is_exist){
              this.globalS.sToast('Unsuccess', 'Title Already Exist');
              this.postLoading = false;
              return false;   
            }
          }
          this.switchS.updateData(  
            this.modalVariables={
              title: 'Recipient Billing Cycles'
            }, 
            this.inputVariables = {
              display: group.get('name').value,
              end_date:!(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
              primaryId:group.get('recordNumber').value,
              domain: 'BILLINGCYCLE',
            }
            
            ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
              if (data)
              {
                this.timeS.postaudithistory({
                  Operator:this.tocken.user,
                  actionDate:this.globalS.getCurrentDateTime(),
                  auditDescription:'Recipient Billing Cycles Changed',
                  actionOn:'BILLINGCYCLE',
                  whoWhatCode:group.get('recordNumber').value, //inserted
                  TraccsUser:this.tocken.user,
                }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                  this.globalS.sToast('Success', 'Update successful');
                }
                );
              }else
              {
                this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
              }
              this.loadData();
              this.postLoading = false;
              this.isUpdate = false;          
              this.handleCancel();
              this.resetModal();
            });
          }
          
        }
        loadData(){
          this.loading = true;
          this.menuS.getDataDomainByType("BILLINGCYCLE",this.check).subscribe(data => {
            this.tableData = data;
            this.loading = false;
          });
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
        delete(data: any) {
          this.postLoading = true;     
          const group = this.inputForm;
          this.menuS.deleteDomain(data.recordNumber)
          .pipe(takeUntil(this.unsubscribe)).subscribe(datas => {
            if (datas) {
              this.timeS.postaudithistory({
                Operator:this.tocken.user,
                actionDate:this.globalS.getCurrentDateTime(),
                auditDescription:'Recipients Billing Cycles Deleted',
                actionOn:'BILLINGCYCLE',
                whoWhatCode:data.recordNumber, //inserted
                TraccsUser:this.tocken.user,
              }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                  this.globalS.sToast('Success', 'Deleted successful');
                }
              );
              this.loadData();
              return;
            }
          });
        }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        name:'',
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2 ,CONVERT(varchar, [enddate],105) as Field3 from DataDomains "+this.whereString+" Domain='BILLINGCYCLE'";
   
      const data = {
        "template": { "_id": "0RYYxAkMCftBE9jc" },
        "options": {
          "reports": { "save": false },
          "txtTitle": "Recipient Billing Cycle List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Name",
          "head3" : "End Date",
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

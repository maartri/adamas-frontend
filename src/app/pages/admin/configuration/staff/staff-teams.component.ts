import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService , MenuService, PrintService, TimeSheetService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-staff-teams',
  templateUrl: './staff-teams.component.html',
  styles: []
})
export class StaffTeamsComponent implements OnInit {
  
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
  title:string = "Add New Staff Team";
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  temp_title: any;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private timeS:TimeSheetService,
    private printS:PrintService,
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
      this.title = "Add New Staff Team"
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
      this.title = "Edit New Staff Team"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        user1,
        end_date,
        recordNumber
      } = this.tableData[index];
      this.inputForm.patchValue({
        item: user1,
        rate:name,
        end_date:end_date,
        recordNumber:recordNumber
      });
      this.temp_title = name;
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
          this.menuS.getDataDomainByType("STAFFTEAM",this.check).subscribe(data => {
            this.tableData = data;
            this.loading = false;
      });
    }
    populateDropDown(){  
      let branch = "SELECT RecordNumber, Description from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain =  'BRANCHES' ORDER BY Description";
      this.listS.getlist(branch).subscribe(data => {
        this.items = data;
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
    save() {
      this.postLoading = true;     
      const group = this.inputForm;
      if(!this.isUpdate){    
        let name        = group.get('rate').value.trim().toUpperCase();
        let is_exist    = this.globalS.isNameExists(this.tableData,name);
        if(is_exist){
          this.globalS.sToast('Unsuccess', 'Title Already Exist');
          this.postLoading = false;
          return false;   
        }     
        this.switchS.addData(  
          this.modalVariables={
            title: 'Staff Teams'
          }, 
          this.inputVariables = {
            display: group.get('rate').value,
            rate: group.get('item').value,
            end_date:!(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
            domain: 'STAFFTEAM',
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
        let name        = group.get('rate').value.trim().toUpperCase();
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
            title: 'Staff Teams'
          }, 
          this.inputVariables = {
          rate: group.get('item').value,
          item: group.get('rate').value,
          end_date:!(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
          recordNumber:group.get('recordNumber').value,
            domain: 'STAFFTEAM',
          }
          ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data)
              {
                this.timeS.postaudithistory({
                  Operator:this.tocken.user,
                  actionDate:this.globalS.getCurrentDateTime(),
                  auditDescription:'Staff Team Changed',
                  actionOn:'STAFFTEAM',
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
    
    
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteDomain(data.recordNumber)
          .pipe(takeUntil(this.unsubscribe)).subscribe(datas => {
            if (datas) {
              this.timeS.postaudithistory({
                Operator:this.tocken.user,
                actionDate:this.globalS.getCurrentDateTime(),
                auditDescription:'Staff Team Deleted',
                actionOn:'STAFFTEAM',
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
        item: '',
        rate: '',
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
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER By Description) AS Field1,Description as Field2,User1 as Field3,CONVERT(varchar, [enddate],105) as Field4 from DataDomains "+this.whereString+" Domain='STAFFTEAM'";
      
      const data = {
        "template": { "_id": "0RYYxAkMCftBE9jc" },
        "options": {
          "reports": { "save": false },
          "txtTitle": "Staff Teams List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Name",
          "head3" : "Branch",
          "head4" : "End Date",
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
  
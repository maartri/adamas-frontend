import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TimeSheetService, GlobalService, ClientService, StaffService,ListService, UploadService, months, days, gender, types, titles, caldStatuses, roles, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-branches',
  
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {

  branchList: Array<any>;
  tabset = false;
  isVisibleTop =false;
  showtabother = false;
  showtabRostcriteria= false;
  showtabstaffcriteria= false;
  showtabRegcriteria= false;
  showtabrecpcriteria = false;
  show =false ;
  showoption = true;
  tableData: Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  workStartHour: Array<any>;
  workFinsihHour: Array<any>;
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  private unsubscribe: Subject<void> = new Subject();
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  dateFormat: string ='dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  constructor(
    private globalS: GlobalService,
    private listS: ListService,    
    private switchS: SwitchService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private menuS: MenuService,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService)
    { }

    
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
      this.buildForm();      
      this.loadBranches();
      this.workStartHour = ["00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00","03:15","03:30","03:45","04:00","04:15","04:30","04:45","05:00","05:15","05:30","05:45","06:00","06:15","06:30","06:45","07:00","07:00","07:15","07:30","07:45","08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","18:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30","21:45","22:00","23:15","23:30","23:45","24:00"];
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
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        recordNumber,
        description,
        glcost,
        glrevene,
        googleAddress,
        addrLine1,
        addrLine2,
        addrphone,
        startHour,
        finishHour,
        bH_LateStart,
        bH_LateFinish,
        bH_EarlyStart,
        bH_EarlyFinish,
        bH_OverStay,
        bH_UndrStay,
        aH_EarlyStart,
        aH_LateStart,
        aH_EarlyFinish,
        aH_LateFinish,
        aH_OverStay,
        aH_UndrStay,
        end_date,
      }= this.tableData[index];
      this.inputForm.patchValue({
        recordNumber:recordNumber,
        name:description,
        glRevene:glcost,
        glCost:glrevene,
        end_date:end_date,
        centerName:googleAddress,
        addrLine1:addrLine1,
        addrLine2:addrLine2,
        Phone:addrphone,
        startHour:startHour,
        finishHour:finishHour,
        earlyStart:bH_EarlyStart,
        lateStart:bH_LateStart,
        earlyFinish:bH_EarlyFinish,
        lateFinish:bH_LateFinish,
        overstay:bH_OverStay,
        understay:bH_UndrStay,
        t2earlyStart:aH_EarlyStart,
        t2lateStart:aH_LateStart,
        t2earlyFinish:aH_EarlyFinish,
        t2lateFinish:aH_LateFinish,
        t2overstay:aH_OverStay,
        t2understay:aH_UndrStay,
      })      
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
      if(!this.isUpdate){
        const group = this.inputForm;
        this.menuS.AddBranch({
          name:         group.get('name').value,
          glRevene:     !(this.globalS.isVarNull(group.get('glRevene').value)) ? group.get('glRevene').value : null,
          glCost:       !(this.globalS.isVarNull(group.get('glCost').value)) ? group.get('glCost').value : null,
          end_date :    !(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
          centerName:   !(this.globalS.isVarNull(group.get('centerName').value)) ? group.get('centerName').value : null,
          addrLine1:    !(this.globalS.isVarNull(group.get('addrLine1').value)) ? group.get('addrLine1').value : null,
          addrLine2:    !(this.globalS.isVarNull(group.get('addrLine2').value)) ? group.get('addrLine2').value : null,
          Phone:        !(this.globalS.isVarNull(group.get('Phone').value)) ? group.get('Phone').value : null,
          startHour:    !(this.globalS.isVarNull(group.get('startHour').value)) ? group.get('startHour').value : null,
          finishHour:   !(this.globalS.isVarNull(group.get('finishHour').value)) ? group.get('finishHour').value : null,
          earlyStart:   !(this.globalS.isVarNull(group.get('earlyStart').value)) ? group.get('earlyStart').value : null,
          lateStart:    !(this.globalS.isVarNull(group.get('lateStart').value)) ? group.get('lateStart').value : null,
          earlyFinish:  !(this.globalS.isVarNull(group.get('earlyFinish').value)) ? group.get('earlyFinish').value : null,
          lateFinish :  !(this.globalS.isVarNull(group.get('lateFinish').value)) ? group.get('lateFinish').value : null,
          overstay:     !(this.globalS.isVarNull(group.get('overstay').value)) ? group.get('overstay').value : null,
          understay:    !(this.globalS.isVarNull(group.get('understay').value)) ? group.get('understay').value : null,
          t2earlyStart: !(this.globalS.isVarNull(group.get('t2earlyStart').value)) ? group.get('t2earlyStart').value : null,
          t2lateStart:  !(this.globalS.isVarNull(group.get('t2lateStart').value)) ? group.get('t2lateStart').value : null,
          t2earlyFinish:!(this.globalS.isVarNull(group.get('t2earlyFinish').value)) ? group.get('t2earlyFinish').value : null,
          t2lateFinish: !(this.globalS.isVarNull(group.get('t2lateFinish').value)) ? group.get('t2lateFinish').value : null,
          t2overstay:   !(this.globalS.isVarNull(group.get('t2overstay').value)) ? group.get('t2overstay').value : null,
          t2understay:  !(this.globalS.isVarNull(group.get('t2understay').value)) ? group.get('t2understay').value : null,
          recordNumber: group.get('recordNumber').value,
        }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          this.loadBranches();
          this.handleCancel();
          this.resetModal();    
        });
      }else{
          const group = this.inputForm;
          console.log(group.get('recordNumber').value);
          this.menuS.UpdateBranch({
          name: group.get('name').value,
          glRevene: group.get('glRevene').value,
          glCost: group.get('glCost').value,
          end_date : !(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
          centerName: group.get('centerName').value,
          addrLine1: group.get('addrLine1').value,
          addrLine2: group.get('addrLine2').value,
          Phone: group.get('Phone').value,
          startHour: group.get('startHour').value,
          finishHour: group.get('finishHour').value,
          earlyStart: group.get('earlyStart').value,
          lateStart: group.get('lateStart').value,
          earlyFinish: group.get('earlyFinish').value,
          lateFinish : group.get('lateFinish').value,
          overstay: group.get('overstay').value,
          understay: group.get('understay').value,
          t2earlyStart: group.get('t2earlyStart').value,
          t2lateStart: group.get('t2lateStart').value,
          t2earlyFinish: group.get('t2earlyFinish').value,
          t2lateFinish: group.get('t2lateFinish').value,
          t2overstay: group.get('t2overstay').value,
          t2understay: group.get('t2understay').value,
          recordNumber: group.get('recordNumber').value,
        }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
          if (data) 
          {
            this.globalS.sToast('Success','Update successful');  
            this.isUpdate = false;   
          }
          else{
          this.globalS.sToast('Success','Update successful');
          this.loadBranches();
          this.handleCancel();
          this.resetModal();
        }    
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
            this.loadBranches();
            return;
         }
        });
    } 
    buildForm() {
      this.inputForm = this.formBuilder.group({
        recordNumber: null,
        name: '',
        glRevene:'',
        glCost:'',
        end_date:'',
        centerName:'',
        addrLine1:'',
        addrLine2:'',
        Phone:'',
        startHour:'',
        finishHour:'',
        earlyStart:'',
        lateStart:'',
        earlyFinish:'',
        lateFinish:'',
        overstay:'',
        understay:'',
        t2earlyStart:'',
        t2lateStart:'',
        t2earlyFinish:'',
        t2lateFinish:'',
        t2overstay:'',
        t2understay:'',
      });
    }
    loadBranches(){
      this.loading = true;
      this.menuS.getlistbranches(this.check).subscribe(data => {
        this.branchList = data;
        this.tableData = data;
        console.log(this.branchList);
        this.loading = false;
        this.cd.detectChanges();
      });
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "WHERE";
        this.loadBranches();
      }else{
        this.whereString = "Where ISNULL(DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
        this.loadBranches();
      }
    }

    activateDomain(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activeDomain(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Activated!');
          this.loadBranches();
          return;
        }
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,CONVERT(varchar, [EndDate],105) as Field3 from DataDomains "+this.whereString+" Domain='BRANCHES'";
      
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
          "txtTitle": "Branches List",
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
  
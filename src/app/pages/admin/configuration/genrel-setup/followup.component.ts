import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService , PrintService, TimeSheetService, workflowClassification } from '@services/index';
import { GlobalService } from '@services/global.service';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Subject, EMPTY, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';
import { Router,ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-followup',
  templateUrl: './followup.component.html',
  styles:[`
  .mrg-btm{
    margin-bottom:0rem !important;
  }
  span.small-font{
    font-size:12px;
  }
  `]
})
export class FollowupComponent implements OnInit {
  events: Array<any>;
  
  tableData: Array<any>;
  staff:Array<any>;
  listType:Array<any>;
  program:Array<any>;
  recipients:Array<any>;
  locations:Array<any>;
  services:Array<any>;
  severity:Array<any>;
  checked = true;
  checked2=true;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "";
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  dateFormat: string = 'dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string=" WHERE ISNULL(DeletedRecord,0) = 0 AND (xEndDate Is Null OR xEndDate >= GETDATE()) AND ";
  branchesList: any;
  funding_source: any;
  casemanagers: any;
  addbtnTitle : any;
  menuType    : any;
  staffList: any;
  allStaff:boolean = false;
  allstaffIntermediate: boolean = false;
  selectedStaff:any[];
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private menuS:MenuService,
    private timeS:TimeSheetService,
    private printS:PrintService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService
    ){}
    private unsubscribe: Subject<void> = new Subject();
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params.type == 'followups'){
          this.addbtnTitle = 'Followups';
          this.menuType    = 'FOLLOWUP'
        }
        if (params.type == 'documents'){
          this.addbtnTitle = 'Documents';
          this.menuType  = 'DOCUMENTS';
        }
        if (params.type == 'extradata'){
          this.addbtnTitle = "Extra Required Data";
          this.menuType  = 'XTRADATA';
        }
      });
      this.buildForm();
      this.populateDropdowns();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = " WHERE ";
        this.loadData();
      }else{
        this.whereString = " WHERE ISNULL(xDeletedRecord,0) = 0 AND (xEndDate Is Null OR xEndDate >= GETDATE()) AND ";
        this.loadData();
      }
    }
    loadData(){
      this.menuS.getconfigurationworkflows(this.menuType,false).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
      
    }
    populateDropdowns(){
      let sql  = "SELECT TITLE FROM ITEMTYPES WHERE ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM') AND ENDDATE IS NULL";
      this.listS.getlist(sql).subscribe(data => {
        this.listType = data;
      });
      return forkJoin([
        this.listS.getlistbranchesObj(),
        this.listS.getfundingsource(),
        this.listS.casemanagerslist(),
        this.listS.workflowstafflist(),
      ]).subscribe(x => {
        this.branchesList   = x[0];
        this.funding_source = x[1];
        this.casemanagers   = x[2];
        this.staffList      = x[3];
      });
    }
    
    showAddModal() {
      this.heading = "Add "+this.addbtnTitle;
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      this.heading  = "Edit "+this.addbtnTitle;
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        type,
        name,
        branch,
        funding,
        casemanager,
        endDate,
        recordNumber,
        
      } = this.tableData[index];
      this.inputForm.patchValue({
        activity:type,
        name:name,
        branch:branch,
        fundingSource:funding,
        endDate:endDate,
        casemanager:casemanager,
        recordNumber:recordNumber,
      });
    }
    updateAllCheckedFilters(filter: any): void {
      this.selectedStaff = [];
      if (this.allStaff) {
        this.staffList.forEach(x => {
          x.checked = true;
          this.selectedStaff.push(x.staffCode);
        });
      }else{
        this.staffList.forEach(x => {
          x.checked = false;
        });
        this.selectedStaff = [];
      }
      console.log(this.selectedStaff);
    }
    updateSingleCheckedFilters(index:number): void {
      if (this.staffList.every(item => !item.checked)) {
        this.allStaff = false;
        this.allstaffIntermediate = false;
      } else if (this.staffList.every(item => item.checked)) {
        this.allStaff = true;
        this.allstaffIntermediate = false;
      } else {
        this.allstaffIntermediate = true;
        this.allStaff = false;
      }
    }
    log(event: any) {
      this.selectedStaff = event;
      console.log(this.selectedStaff);
    }
    trueString(data: any): string{
      return data ? '1': '0';
    }
    isChecked(data: string): boolean{
      return '1' == data ? true : false;
    }
    loadTitle()
    {
      return this.heading;
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
        this.inputForm.patchValue({
          group: this.menuType,
        })
        this.menuS.postconfigurationfollowups(this.inputForm.value).subscribe(data => {
          if(data){
              this.globalS.sToast('Success','Inserted SucessFully');
              this.handleCancel();
              this.loadData();
          }
        })
      }else{
        this.menuS.updateconfigurationfollowups(this.inputForm.value).subscribe(data => {
          if(data){
              this.globalS.sToast('Success','Updated SucessFully');
              this.handleCancel();
              this.loadData();
          }
        })
        this.isUpdate = false;
      }
    }
    
    delete(data: any) {
    
    this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteconfigurationfollowups(this.menuType,data.recordNo)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }
    
    activateDomain(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activateconfigurationfollowups(this.menuType,data.recordNo)
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
        group:'',
        activity:'',
        name:'',
        branch:'',
        fundingSource:'',
        casemanager:'',
        staff:'',
        endDate:'', 
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
        
        var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [Name],[RecordNumber]) AS Field1,[Type] AS Field2,[Name] AS Field3,[User2] AS Field4,[User3] AS Field5,[User4] as Field6,[User5] as Field7,CONVERT(varchar, [xEndDate],105) as Field8 FROM   humanresources "+this.whereString+" personid = 'W1' AND [Group] = '"+this.menuType+"'";

        const data = {
          "template": { "_id": "0RYYxAkMCftBE9jc" },
          "options": {
            "reports": { "save": false },
            "txtTitle": this.addbtnTitle+" List",
            "sql": fQuery,
            "userid":this.tocken.user,
            "head1" :"Sr#",
            "head2": "Activity",
            "head3": "Name",
            "head4": "Branch",
            "head5": "Funding Source",
            "head6": "Casemanager",
            "head7": "Staff",
            "head8": "End Date",
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
    
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService, StaffService,nodes, ShareService, leaveTypes, ListService,TimeSheetService } from '@services/index';
import {forkJoin,  of ,  Subject ,  Observable, observable, EMPTY } from 'rxjs';
import { RECIPIENT_OPTION } from '../../modules/modules';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core';
import format from 'date-fns/format';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  styles: [`
  nz-tabset{
    margin-top:1rem;
  }
  nz-tabset >>> div > div.ant-tabs-nav-container{
    height: 25px !important;
    font-size: 13px !important;
  }
  
  nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
    line-height: 24px;
    height: 25px;
  }
  nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
    background: #717e94;
    color: #fff;
  }
  ul{
    list-style:none;
    float:right;
    margin:0;
  }
  li{
    display: inline-block;
    margin-right: 6px;
    padding: 5px 0;
    font-size: 13px;
  }
  li div{
    text-align: center;
  }
  .recipient-controls button{
    margin-right:1rem;
  }
  nz-select{
    width:100%;
  }
  
  .options button:disabled{
    color:#a3a3a3;
    cursor: no-drop;
  }
  .options button:hover:not([disabled]) {
    color:#177dff;
    cursor:pointer;
  }
  ul li button{
    border: 0;
    background: #ffffff00;
    float: left;
  }
  .status{
    font-size: 11px;
    padding: 3px 5px;
    border-radius: 11px;
    color: #fff;
    
    margin-right: 10px;
  }
  .status.active{            
    background: #42ca46;
  }
  .status.inactive{            
    background: #c70000;
  }
  .status.type{
    background:#c8f2ff;
    color: black;
  }
  .status-program{
    display: inline-block;
    float: left;
    margin-right:1rem;
  }
  .status-program i{
    font-size: 1.4rem;
    color: #bfbfbf;
    margin-right:10px;
    cursor:pointer;
  }
  .status-program i:hover{
    color: #000;
  }
  
  .tree-overflow{
    max-height: 24rem;
    overflow: auto;
  }
  label.columns{
    display:block;
    margin:0;
  }
  .ant-card-small>.ant-card-head>.ant-card-head-wrapper>.ant-card-extra {
    margin-left:unset !important;
    float:none !important;
    color:green !important;
  }
  .ant-table-thead>tr>th{
    background:green;
  }
  `],
  templateUrl: './recipients.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientsAdmin implements OnInit, AfterViewInit, OnDestroy {
  
  option: string = 'add';
  
  allBranches:boolean = true;
  allBranchIntermediate:boolean = false;
  
  allProgarms:boolean = true;
  allprogramIntermediate:boolean = false;
  
  allCordinatore:boolean = true;
  allCordinatorIntermediate:boolean = false;
  
  allcat:boolean = true;
  allCatIntermediate:boolean = false;
  
  
  allChecked: boolean = true;
  indeterminate: boolean = false;
  
  user: any = null;
  nzSelectedIndex: number = 0;
  isFirstLoad: boolean = false;
  programModalOpen: boolean = false;
  findModalOpen: boolean = false;
  
  sample: any;
  
  newReferralModal: boolean = false;
  newQuoteModal: boolean = false;
  quoteModal: boolean = false;
  saveModal: boolean = false;
  
  newOtherModal: boolean = false;
  loading: boolean = false;
  isLoading: boolean = false;
  current: number = 0;
  
  selectedValue: any;
  value: any;
  
  status: any = null;
  statusTab = new Subject<any>();
  
  Unique_ID: string;
  Account_No: string;
  /**
  * Filter Data Vars
  */
  isActive: boolean =true;
  inActive: boolean = false;
  
  recipientOptionOpen: any;
  recipientOption: string;
  from: any =  { display: 'admit'};
  fileList2: Array<any> = [];
  urlPath: string = `api/v2/file/upload-document-remote`;
  acceptedTypes: string = "image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
  file: File;
  referdocument: boolean = false;
  
  RECIPIENT_OPTION = RECIPIENT_OPTION;
  
  recipientStatus: string = null;
  recipientType: any;
  selectedRecipient: any; 
  
  programs: Array<any> = [];
  
  tabs = [1, 2, 3]; 
  checked: any;
  sampleList: Array<any> = ["EQUALS","BETWEEN","LESS THEN","GREATER THAN","NOT EQUAL TO","IS NOTHING","IS ANYTHING","IS TRUE","IS FALSE"];
  cariteriaList:Array<any> = [];
  nodelist:Array<any> = [];

  checkOptionsOne = [
    { label: 'REFERRAL', value: 'REFERRAL', checked: true },
    { label: 'WAITING LIST', value: 'WAITING LIST', checked: true },
    { label: 'RECIPIENT', value: 'RECIPIENT', checked: true },
    { label: 'CARER', value: 'CARER', checked: true },
    { label: 'CARER/RECIPIENT', value: 'CARER/RECIPIENT', checked: true },
    { label: 'BILLING CLIENT', value: 'BILLING CLIENT', checked: true },
    { label: 'ASSOCIATE', value: 'ASSOCIATE', checked: true },
  ];
  sampleModel: any;
  
  columns: Array<any> = [
    {
      name: 'ID',
      checked: false
    },
    {
      name: 'URNumber',
      checked: false
    },
    {
      name: 'AccountNo',
      checked: false
    },
    {
      name: 'Surname',
      checked: false
    },
    {
      name: 'Firstname',
      checked: false
    },
    {
      name: 'Fullname',
      checked: false
    },
    {
      name: 'Gender',
      checked: true
    },
    {
      name: 'DOB',
      checked: true
    },
    {
      name: 'Address',
      checked: true
    },
    {
      name: 'Contact',
      checked: true
    },
    {
      name: 'Type',
      checked: true
    },
    {
      name: 'Branch',
      checked: true
    },
    {
      name: 'Coord',
      checked: false
    },
    {
      name: 'Category',
      checked: false
    },
    {
      name: 'ONI',
      checked: false
    },
    {
      name: 'Activated',
      checked: false
    },
    {
      name: 'Deactivated',
      checked: false
    },
    {
      name: 'Suburb',
      checked: false
    }
  ]
  
  data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
  
  casemanagers: any;
  categories: any;
  programsList: any;
  branchesList: any;
  filters: any;
  dateFormat: string ='dd/MM/yyyy';
  quicksearch: any;
  selectedRecpientTypes: any[];
  types: any[];
  extendedSearch: any;
  filteredResult: any;
  selectedTypes:any;
  selectedbranches: any[];
  testcheck : boolean = false;
  categoriesList: any;
  selectedPrograms: any;
  selectedCordinators: any;
  selectedCategories: any;
  nzEvent(event: NzFormatEmitEvent): void {
    if (event.eventName === 'click') {
      var title = event.node.origin.title;

      this.extendedSearch.patchValue({
        title : title,
      });
      var keys       = event.keys;
    
    }

  }
  log(event: any,index:number) {
    this.testcheck = true;
    
    if(index == 1)
    this.selectedbranches = event;
    if(index == 2)
    this.selectedPrograms = event;
    if(index == 3)
    this.selectedCordinators = event;
    if(index == 4)
    this.selectedCategories = event;
    
  }
  
  setCriteria(){
    
    this.cariteriaList.push({
      fieldName  : this.extendedSearch.value.title,
      searchType : this.extendedSearch.value.rule,
      textToLoc  : this.extendedSearch.value.from,
      endText    : this.extendedSearch.value.to,
    })
  }

  listChange(event: any) {
    
    if (event == null) {
      this.user = null;
      this.isFirstLoad = false;
      this.sharedS.emitChange(this.user);
      return;
    }
    
    if (!this.isFirstLoad) {
      this.view(0);
      // this.view(10);
      
      this.isFirstLoad = true;
    }
    
    // console.log(JSON.stringify(event));
    // console.log(event); 
    // console.log(JSON.stringify(event));
    this.globalS.id = event.uniqueID;
    
    this.user = {
      code: event.accountNo,
      id: event.uniqueID,
      view: event.view,
      agencyDefinedGroup: event.agencyDefinedGroup,
      sysmgr: event.sysmgr
    }
    
    this.sharedS.emitChange(this.user);
    
    this.listS.getstatusofwizard(this.user.id)
    .subscribe(data => {
      this.status = data;
      this.detectChanges();
    });
  }
  
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private sharedS: ShareService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private listS: ListService,
    private timeS: TimeSheetService,
    private globalS:GlobalService,
    private http: HttpClient,
    private msg: NzMessageService,
    ) {
      
      this.sharedS.emitProfileStatus$.subscribe(data => {
        // console.log(data);
        this.selectedRecipient = data;
        this.recipientType = data.type == null || data.type.trim() == "" ? null : data.type;
        // if(data.admissionDate == null && data.dischargeDate == null){
        //     this.recipientStatus = null;
        //     return;
        // }
        
        if(this.globalS.doc != null){
          this.addRefdoc();
        }
        this.globalS.var1 = data.uniqueID;            
        this.globalS.var2 = data.accountNo;
        
        if(data.admissionDate != null && data.dischargeDate == null){
          this.recipientStatus = 'active';
        } else {
          this.recipientStatus ='inactive';
        }
        
      })
      
    }
    listOfData: Array<{ name: string; age: number; address: string }> = [];
    ngOnInit(): void {
      
      for (let i = 0; i < 100; i++) {
        this.listOfData.push({
          name: `Edward King`,
          age: 32,
          address: `LondonLondonLondonLondonLondon`
        });
      } 
      this.nodelist = nodes;
      this.getUserData();
      this.buildForm();
    }
    
    ngOnDestroy(): void {
      
    }
    
    ngAfterViewInit() {
      
    }
    searchData() : void{
      this.loading = true;      
      
      this.selectedTypes = this.checkOptionsOne
      .filter(opt => opt.checked)
      .map(opt => opt.value).join("','")
      
      this.selectedPrograms = this.programsList
      .filter(opt => opt.checked)
      .map(opt => opt.name).join("','")
      
      this.selectedCordinators = this.casemanagers
      .filter(opt => opt.checked)
      .map(opt => opt.uniqueID).join("','")
      
      this.selectedCategories = this.categoriesList
      .filter(opt => opt.checked)
      .map(opt => opt.description).join("','")
      
      this.selectedbranches = this.branchesList
      .filter(opt => opt.checked)
      .map(opt => opt.description).join("','")
      
      console.log("criteria list");
      console.log(this.cariteriaList);
      console.log("criteria list");

      this.timeS.getrecipientquicksearch({
        active:this.quicksearch.value.active,
        inactive:this.quicksearch.value.inactive,
        alltypes:this.allChecked,
        selectedTypes:this.selectedTypes,
        allBranches:this.allBranches,
        selectedbranches:(this.allBranches == false) ? this.selectedbranches : '',
        allProgarms:this.allProgarms,
        selectedPrograms:(this.allProgarms == false) ? this.selectedPrograms : '',
        allCordinatore:this.allCordinatore,
        selectedCordinators:(this.allCordinatore == false) ? this.selectedCordinators : '',
        allcat:this.allcat,
        selectedCategories:(this.allcat == false) ? this.selectedCategories : '',
        activeprogramsonly:this.filters.value.activeprogramsonly,
        surname:this.quicksearch.value.surname,
        firstname:this.quicksearch.value.firstname,
        phoneno:this.quicksearch.value.phoneno,
        suburb:this.quicksearch.value.suburb,
        dob:(!this.globalS.isEmpty(this.quicksearch.value.dob)) ? this.globalS.convertDbDate(this.quicksearch.value.dob,'yyyy-MM-dd') : '',
        fileno:this.quicksearch.value.fileno,
        searchText:this.quicksearch.value.searchText,
        criterias:this.cariteriaList  
      })
      .subscribe(data => {
        this.filteredResult = data;
        this.loading = false;
        this.detectChanges();
      })
    }
    updateAllChecked(): void {
      this.indeterminate = false;
      if (this.allChecked) {
        this.checkOptionsOne = this.checkOptionsOne.map(item => ({
          ...item,
          checked: true
        }));
      } else {
        this.checkOptionsOne = this.checkOptionsOne.map(item => ({
          ...item,
          checked: false
        }));
      }
    }
    updateAllCheckedFilters(filter: any): void {
      
      if(filter == 1 || filter == -1){
        
        console.log(this.testcheck + "test flag");
        
        if(this.testcheck == false){  // why its returing undefined 
          if (this.allBranches) {
            this.branchesList.forEach(x => {
              x.checked = true;
            });
          }else{
            this.branchesList.forEach(x => {
              x.checked = false;
            });
          }
        }
      }
      
      if(filter == 2 || filter == -1){
        if(this.testcheck == false){
          if (this.allProgarms) {
            this.programsList.forEach(x => {
              x.checked = true;
            });
          }else{
            this.programsList.forEach(x => {
              x.checked = false;
            });
          }
        }
      }
      if(filter == 3 || filter == -1){
        if(this.testcheck == false){
          if (this.allCordinatore) {
            this.casemanagers.forEach(x => {
              x.checked = true;
            });
          }else{
            this.casemanagers.forEach(x => {
              x.checked = false;
            });
          }
        }
      }
      
      if(filter == 4 || filter == -1){
        if(this.testcheck == false){
          if (this.allcat) {
            this.categoriesList.forEach(x => {
              x.checked = true;
            });
          }else{
            this.categoriesList.forEach(x => {
              x.checked = false;
            });
          }
        }
      }
    }
    updateSingleChecked(): void {
      if (this.checkOptionsOne.every(item => !item.checked)) {
        this.allChecked = false;
        this.indeterminate = false;
      } else if (this.checkOptionsOne.every(item => item.checked)) {
        this.allChecked = true;
        this.indeterminate = false;
      } else {
        this.indeterminate = true;
        this.allChecked = false;
      }
    }
    updateSingleCheckedFilters(index:number): void {
      if(index == 1){
        if (this.branchesList.every(item => !item.checked)) {
          this.allBranches = false;
          this.allBranchIntermediate = false;
        } else if (this.branchesList.every(item => item.checked)) {
          this.allBranches = true;
          this.allBranchIntermediate = false;
        } else {
          this.allBranchIntermediate = true;
          this.allBranches = false;
        }
      }
      if(index == 2){
        if (this.programsList.every(item => !item.checked)) {
          this.allProgarms = false;
          this.allprogramIntermediate = false;
        } else if (this.programsList.every(item => item.checked)) {
          this.allProgarms = true;
          this.allprogramIntermediate = false;
        } else {
          this.allprogramIntermediate = true;
          this.allProgarms = false;
        }
      }
      if(index == 3){
        if (this.casemanagers.every(item => !item.checked)) {
          this.allCordinatore = false;
          this.allCordinatorIntermediate = false;
        } else if (this.casemanagers.every(item => item.checked)) {
          this.allCordinatore = true;
          this.allCordinatorIntermediate = false;
        } else {
          this.allCordinatorIntermediate = true;
          this.allCordinatore = false;
        }
      }
      if(index == 4){
        if (this.categoriesList.every(item => !item.checked)) {
          this.allcat = false;
          this.allCatIntermediate = false;
        } else if (this.categoriesList.every(item => item.checked)) {
          this.allcat = true;
          this.allCatIntermediate = false;
        } else {
          this.allCatIntermediate = true;
          this.allcat = false;
        }
      }
    }
    buildForm(){
      // alltypes: true,
      this.quicksearch = this.fb.group({
        active:   true,
        inactive: false,
        surname:'',
        firstname:'',
        phoneno:'',
        suburb:'',
        dob:'',
        fileno:'',
        searchText:'',
      });
      
      this.filters = this.fb.group({
        activeprogramsonly:false,
      });
      
      this.extendedSearch = this.fb.group({
        title:'',
        rule:'',
        from:'',
        to:'',
        
        activeonly: true,
      });
      
    }
    getUserData() {
      return forkJoin([
        this.listS.getlistbranchesObj(),
        this.listS.getprogramsobj(),
        this.listS.getcoordinatorslist(),
        this.listS.getcategoriesobj(),
      ]).subscribe(x => {
        this.branchesList = x[0];
        this.programsList = x[1];
        this.casemanagers = x[2];
        this.categoriesList = x[3];
      });
    }
    view(index: number) {
      this.nzSelectedIndex = index;
      
      if (index == 0) {
        this.router.navigate(['/admin/recipient/personal'])
      }
      if (index == 1) {
        this.router.navigate(['/admin/recipient/contacts']);
      }
      if (index == 2) {
        this.router.navigate(['/admin/recipient/intake'])
      }
      if (index == 3) {
        this.router.navigate(['/admin/recipient/reminders'])
      }
      if (index == 4) {
        this.router.navigate(['/admin/recipient/opnote'])
      }
      if (index == 5) {
        this.router.navigate(['/admin/recipient/casenote'])
      }
      if (index == 6) {
        this.router.navigate(['/admin/recipient/incidents'])
      }
      if (index == 7) {
        this.router.navigate(['/admin/recipient/perm-roster'])
      }
      if (index == 8) {
        this.router.navigate(['/admin/recipient/history'])
      }
      if (index == 9) {
        this.router.navigate(['/admin/recipient/insurance-pension'])
      }
      if (index == 10) {
        this.router.navigate(['/admin/recipient/quotes'])
      }
      if (index == 11) {
        this.router.navigate(['/admin/recipient/documents'])
      }
      if (index == 12) {
        this.router.navigate(['/admin/recipient/attendance'])
      }
      if (index == 13) {
        this.router.navigate(['/admin/recipient/others'])
      }
      if (index == 14) {
        this.router.navigate(['/admin/recipient/accounting'])        
      }
    }
    
    handleCancel() {
      this.findModalOpen = false;
      this.referdocument = false;
      
    }
    
    handleOk() {
      //  this.referdocument = false;
    }
    
    detectChanges(){
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
    
    closeProgram(){
      this.programModalOpen = false;
    }
    
    loadPrograms(){
      if(!this.selectedRecipient){
        return;
      }
      this.listS.getrecipientprograms(this.selectedRecipient.uniqueID)
      .subscribe(data => {
        this.programs = data;
        this.detectChanges();
      })
    }
    
    openReferInModal: any;
    profileData: any;
    
    openReferModal(user: any) {
      console.log(user.toString());
      this.sample = user;
      this.sharedS.emitOnSearchListNext(user.code);        
      this.profileData = user;
      this.recipientOption =  this.RECIPIENT_OPTION.REFER_IN;
      this.user = user;
      this.recipientOptionOpen = {};
      
    }
    
    clicky(index: number){
      if(index == 0){
        this.recipientOption =  this.RECIPIENT_OPTION.REFER_IN;
        this.recipientOptionOpen = {};
      }
      
      if(index == 1){
        this.recipientOption =  this.RECIPIENT_OPTION.REFER_ON;
        this.recipientOptionOpen = {};
      }
      
      if(index == 2){
        this.recipientOption =  this.RECIPIENT_OPTION.NOT_PROCEED;
        this.recipientOptionOpen = {};
      }
      
      if(index == 3){
        this.recipientOption =  this.RECIPIENT_OPTION.ASSESS;
        this.recipientOptionOpen = {};
      }
      
      if(index == 4){
        this.recipientOption =  this.RECIPIENT_OPTION.ADMIT;
        this.recipientOptionOpen = {};
      }
      
      if(index == 5){
        this.recipientOption =  this.RECIPIENT_OPTION.WAIT_LIST;
        this.recipientOptionOpen = {};
      }
      
      if(index == 6){
        this.recipientOption =  this.RECIPIENT_OPTION.DISCHARGE;
        this.recipientOptionOpen = {};
      }
      
      if(index == 6){
        this.recipientOption =  this.RECIPIENT_OPTION.DISCHARGE;
        this.recipientOptionOpen = {};
      }
      
      if(index == 7){
        this.recipientOption =  this.RECIPIENT_OPTION.SUSPEND;
        this.recipientOptionOpen = {};
      }
      
      if(index == 8){
        this.recipientOption =  this.RECIPIENT_OPTION.REINSTATE;
        this.recipientOptionOpen = {};
      }
      
      if(index == 9){
        this.recipientOption =  this.RECIPIENT_OPTION.DECEASE;
        this.recipientOptionOpen = {};
      }
      
      if(index == 10){
        this.recipientOption =  this.RECIPIENT_OPTION.ADMIN;
        this.recipientOptionOpen = {};
      }
      
      if(index == 11){
        this.recipientOption =  this.RECIPIENT_OPTION.ITEM;
        this.recipientOptionOpen = {};
      }
      if(index == 12){
        
        this.router.navigate(['/admin/Print'])          
      }
    }
    
    openFindModal(){
      this.tabFindIndex = 0;
      this.findModalOpen = true;
    }
    
    tabFindIndex: number = 0;
    tabFindChange(index: number){
      if(index == 1){
        this.updateAllCheckedFilters(-1);
      }
      this.tabFindIndex = index;
    }
    
    filterChange(index: number){
      
    }
    
    addRefdoc(){
      //console.log(this.globalS.doc.toString());
      /*if (this.globalS.doc.toString() != null){ 
        console.log(this.globalS.doc.toString());                 
        this.referdocument = true;
      } */
      
      
      this.referdocument = true;
      this.globalS.doc = null;
      
      
      
    } 
    customReq = () => {
      //console.log(this.globalS.doc.label)
      
      console.log(this.file);
      this.referdocument = false;
      const formData = new FormData();
      
      //const { program, discipline, careDomain, classification, category, reminderDate, publishToApp, reminderText, notes  } = this.incidentForm.value;
      
      formData.append('file', this.file as any);
      /*formData.append('data', JSON.stringify({
        PersonID: this.innerValue.id,
        DocPath: this.token.recipientDocFolder,
        
        Program: program,
        Discipline: discipline,
        CareDomain: careDomain,
        Classification: classification,
        Category: category,
        ReminderDate: reminderDate,
        PublishToApp: publishToApp,
        ReminderText: reminderText,
        Notes: notes,
        SubId: this.innerValue.incidentId
      })) */
      
      const req = new HttpRequest('POST', this.urlPath, formData, {
        reportProgress: true,
        withCredentials: true
      });
      
      var id = this.globalS.loadingMessage(`Uploading file ${this.file.name}`)
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (event: HttpEvent<any>) => {
          this.msg.remove(id);
          this.globalS.sToast('Success','Document uploaded');
        },
        err => {
          console.log(err);
          this.msg.error(`${this.file.name} file upload failed.`);
          this.msg.remove(id);
        }
        );  
      }; 
      handleChange({ file, fileList }: UploadChangeParam): void {
        const status = file.status;
        if (status !== 'uploading') {
          // console.log(file, fileList);
        }
        if (status === 'done') {
          this.globalS.sToast('Success', `${file.name} file uploaded successfully.`);
          
          
        } else if (status === 'error') {
          this.globalS.sToast('Error', `${file.name} file upload failed.`);
          
        }
      }
      handleClose(){
        this.newReferralModal = false;
        this.saveModal = false;
        this.quoteModal = false;
        this.newOtherModal = false;
        this.findModalOpen = false;
        this.referdocument = false;
        this.quicksearch.reset();
      }
      
      
    }//
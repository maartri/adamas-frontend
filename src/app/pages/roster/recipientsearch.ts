import { Component,AfterViewInit,Input,Output,EventEmitter,ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { GlobalService,staffnodes,StaffService,sbFieldsSkill, ShareService,timeSteps,conflictpointList,checkOptionsOne,sampleList,genderList,statusList, ListService, TimeSheetService,   } from '@services/index';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { filter, switchMap } from 'rxjs/operators';
import format from 'date-fns/format';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core';
import { EMPTY, forkJoin } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { forEach } from 'lodash';
import { Subscription, Subject } from 'rxjs';

@Component({
    selector: 'recipient-search',
    templateUrl: './recipientsearch.html',
    styles: [`
    .disabled{
      pointer-events:none;
    
    }
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
      background: #85B9D5;
      color: #fff;
    }
    nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
      border-radius: 4px 4px 0 0;
    }
    
    
    `]
  })
  export class RecipientSearch implements AfterViewInit{
      @Input() findModalOpen:boolean=false;      
      @Input() bookingData = new Subject<any>();
      @Output() searchDone:EventEmitter<any>= new EventEmitter();
   
      recipientStatus: string = null;
      recipientType: any;
      selectedRecipient: any; 
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
      rights: any;
      tocken: any;
      loading:boolean;
      checkOptionsOne = checkOptionsOne;
      booking :any;

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
      checked: any;
      sampleList: Array<any> = sampleList;
      cariteriaList:Array<any> = [];
      nodelist:Array<any> = [];
      txtSearch:string;
      originalList: any;

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
  

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private sharedS: ShareService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private listS: ListService,
    private timeS: TimeSheetService,
    private globalS:GlobalService,
    ) {
      
      // this.sharedS.emitProfileStatus$.subscribe(data => {
      //   // console.log(data);
      //   this.selectedRecipient = data;
      //   this.recipientType = data.type == null || data.type.trim() == "" ? null : data.type;
      //   // if(data.admissionDate == null && data.dischargeDate == null){
      //   //     this.recipientStatus = null;
      //   //     return;
      //   // }
        
      //   // if(this.globalS.doc != null){
      //   //   this.addRefdoc();
      //   // }
      //   this.globalS.var1 = data.uniqueID;            
      //   this.globalS.var2 = data.accountNo;
        
      //   if(data.admissionDate != null && data.dischargeDate == null){
      //     this.recipientStatus = 'active';
      //   } else {
      //     this.recipientStatus ='inactive';
      //   }
        
      //})
      
    }
  
      ngOnInit(){
       
          this.buildForm();
          this.getUserData();
  
          
          this.bookingData.subscribe(data=>{
            this.loadModel(data);
          })
      }
   
      ngAfterViewInit(){
  
        }
  
      handleCancel(){
          this.findModalOpen=false;
      }
  
      handleOk(){ 
        if (this.selectedRecipient==null) return;
        this.searchDone.emit(this.selectedRecipient);
        this.findModalOpen=false;
      }
      
      onTextChangeEvent(event:any){
        // console.log(this.txtSearch);
        if (this.txtSearch==null) return;
        let value = this.txtSearch.toUpperCase();
        if (this.originalList==null){
          //this.searchData();
          return;
        }
         
         //console.log(this.serviceActivityList[0].description.includes(value));
         this.filteredResult=this.originalList.filter(element=>element.name.includes(value));
     }

      onItemSelected(sel:any ) : void {
        if (sel==null) return;
        this.selectedRecipient=sel;     
    
    }
    onItemDbClick(sel:any ) : void {
       if (sel==null) return;
        this.selectedRecipient=sel;
        this.searchDone.emit(sel);
        this.findModalOpen=false;
    
    }
    
      loadModel(data:any){
        this.booking=data;
        this.findModalOpen=true;
      }
      tabFindIndex: number = 0;
      tabFindChange(index: number){
        if(index == 1){
          this.updateAllCheckedFilters(-1);
        }
        this.tabFindIndex = index;
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
  
  
        var postdata = {
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
          criterias:this.cariteriaList // list of rules
        }
  
        this.timeS.postrecipientquicksearch(postdata).subscribe(data => {
          this.filteredResult = data;
          this.originalList=data;
          this.loading = false;
          this.detectChanges();
        });
  
      }
      detectChanges(){
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    
      filterChange(index: number){
      
      }

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
     
  }
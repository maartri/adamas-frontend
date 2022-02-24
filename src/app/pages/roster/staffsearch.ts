import { Component,AfterViewInit,Input,Output,EventEmitter,ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { GlobalService,staffnodes,StaffService,sbFieldsSkill, ShareService,timeSteps,conflictpointList,checkOptionsOne,sampleList,genderList,statusList, ListService, TimeSheetService,   } from '@services/index';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { filter, switchMap } from 'rxjs/operators';
import format from 'date-fns/format';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core';
import { EMPTY, forkJoin } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { forEach } from 'lodash';

@Component({
    selector: 'staff-search',
    templateUrl: './staffsearch.html',
    styles: [`
    .disabled{
      pointer-events:none;
    
    }`]
  })
  export class StaffSearch implements AfterViewInit{
      @Input() findModalOpen:boolean=false;
      @Output() searchDone:EventEmitter<any>= new EventEmitter();

      selectedStaff:any;
      extendedSearch: any;
      allBranches:boolean = true;
      allBranchIntermediate:boolean = false;
      filteredResult: any;
      originalList: any;
      selectedTypes:any;
      selectedbranches: any[];
      testcheck : boolean = false;
      selectedPrograms: any;
      selectedCordinators: any;
      selectedCategories: any;
      selectedSkills:any;
      txtSearch:string;

      loading: boolean;    
      allProgarms:boolean = true;
      allprogramIntermediate:boolean = false;
      quicksearch: FormGroup;
      avilibilityForm: FormGroup;
      filters: FormGroup;

      genderList:any = genderList;
      statusList:any = statusList;
      branchesList: any;
      diciplineList: any;
      casemanagers: any;
      categoriesList: any;
      skillsList:any;
      conflictpointList:any = conflictpointList;

      allCordinatore:boolean = true;
      allCordinatorIntermediate:boolean = false;
      searchAvaibleModal : boolean = false;
  
  
    allcat:boolean = true;
    allCatIntermediate:boolean = false;
  
  
    allChecked: boolean = true;
    indeterminate: boolean = false;
    tabFindIndex:number=0;
    
    sampleList: Array<any> = sampleList;
    cariteriaList:Array<any> = [];
    nodelist:Array<any> = [];
    checkOptionsOne = checkOptionsOne;
    sbFieldsSkill:any;
    nzEvent(event: NzFormatEmitEvent): void {
      if (event.eventName === 'click') {
        var title = event.node.origin.title;
        
        this.extendedSearch.patchValue({
          title : title,
        });
        var keys       = event.keys;
        
      }
      
    }
    
      tabFindChange(index: number){
        this.tabFindIndex = index;
      }

    constructor(private router: Router,
      private activeRoute: ActivatedRoute,
      private timeS: TimeSheetService,
      private sharedS: ShareService,
      private globalS: GlobalService,
      private listS: ListService,
      private cd: ChangeDetectorRef,
      private fb: FormBuilder,
      ){
      
    }
    ngOnInit(){
      this.sbFieldsSkill = sbFieldsSkill;
      this.nodelist = staffnodes;
        this.buildForms();
        this.getUserData();
    }
    ngAfterViewInit(){

      }

    handleCancel(){
        this.findModalOpen=false;
    }

    handleOk(){ 

      this.searchDone.emit({selected:this.selectedStaff});
    }
    buildForms(){
        
        this.quicksearch = this.fb.group({
          availble: false,
          option: false,
          status:'Active',
          gender:'Any Gender',
          surname:'',
          staff:true,
          brokers:true,
          volunteers:true,
          onleaveStaff:true,
          previousWork:false,
          searchText:'',
        });
        
        this.avilibilityForm = this.fb.group({
          date  :[new Date()],
          start :'09:00',
          end   :'10:00',
          drtn  :'01:00',
          conflict:true,
          conflictminutes:'',
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
        forkJoin([
          this.listS.getlisttimeattendancefilter("BRANCHES"),
          this.listS.getlisttimeattendancefilter("STAFFTEAM"),
          this.listS.getlisttimeattendancefilter("STAFFGROUP"),
          this.listS.getlisttimeattendancefilter("CASEMANAGERS"),
          this.listS.getskills(),
        ]).subscribe(data => {
          this.branchesList = data[0].map(x => {
            return {
              label: x,
              value: x,
              checked: false
            }
          });
          this.diciplineList = data[1].map(x => {
            return {
              label: x,
              value: x,
              checked: false
            }
          });
          this.categoriesList = data[2].map(x => {
            return {
              label: x,
              value: x,
              checked: false
            }
          });
          this.casemanagers = data[3].map(x => {
            return {
              label: x,
              value: x,
              checked: false
            }
          });
          this.skillsList = data[4];
        });
      }
     
      searchData() : void{
        this.loading = true;      
        
        this.selectedTypes = this.checkOptionsOne
        .filter(opt => opt.checked)
        .map(opt => opt.value).join("','")
        
        this.selectedPrograms = this.diciplineList
        .filter(opt => opt.checked)
        .map(opt => opt.value)
        
        this.selectedCordinators = this.casemanagers
        .filter(opt => opt.checked)
        .map(opt => opt.value)
        
        this.selectedCategories = this.categoriesList
        .filter(opt => opt.checked)
        .map(opt => opt.value)
        
        this.selectedbranches = this.branchesList
        .filter(opt => opt.checked)
        .map(opt => opt.value)
        
        this.selectedSkills  = this.skillsList
        .filter(opt => opt.checked)
        .map(opt => this.sbFieldsSkill[opt.identifier])
        
        var postdata = {
          status:this.quicksearch.value.status,
          gender:this.quicksearch.value.gender=="Any Gender"? "MALE,FEMALE" : this.quicksearch.value.gender,
          staff:this.quicksearch.value.staff,
          brokers:this.quicksearch.value.brokers,
          volunteers:this.quicksearch.value.volunteers,
          onleaveStaff:this.quicksearch.value.onleaveStaff,
          searchText:this.quicksearch.value.searchText,
          
          allTeamAreas      : this.allProgarms,
          selectedTeamAreas : (this.allProgarms == false) ? this.selectedPrograms : [],
          
          allcat:this.allcat,
          selectedCategories:(this.allcat == false) ? this.selectedCategories : [],
          
          allBranches:this.allBranches,
          selectedbranches:(this.allBranches == false) ? this.selectedbranches : [],
          
          allCordinatore:this.allCordinatore,
          selectedCordinators:(this.allCordinatore == false) ? this.selectedCordinators : [],
          
          allSkills:(this.selectedSkills.length) ? false : true,
          selectedSkills: (this.selectedSkills.length) ? this.selectedSkills : [],
          criterias:this.cariteriaList
          // list of rules
        }
        
            
        //console.log (this.selectedSkills);
        this.timeS.getQualifiedStaff(postdata).subscribe(data => {
          
          this.filteredResult = data;
          this.originalList=data;
          this.loading = false;
          this.cd.detectChanges();
        });
      }
    
      onTextChangeEvent(event:any){
        // console.log(this.txtSearch);
        let value = this.txtSearch.toUpperCase();
        if (this.originalList==null){
          this.searchData();
        }
         
         //console.log(this.serviceActivityList[0].description.includes(value));
         this.filteredResult=this.originalList.filter(element=>element.name.includes(value));
     }

      allcompetencieschecked(): void {
        console.log("added");
        this.skillsList = this.skillsList.map(item => 
          (
            {
              ...item,
              checked: true
            }
            )
            );
          }
       
      allcompetenciesunchecked(): void {
        this.skillsList = this.skillsList.map(item => ({
          ...item,
          checked: false,
        }));
      }
      updateAllCheckedFilters(filter: any): void {
        console.log(this.testcheck + "test flag");
        if(filter == 1 || filter == -1){
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
              this.diciplineList.forEach(x => {
                x.checked = true;
              });
            }else{
              this.diciplineList.forEach(x => {
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
      updateSingleCheckedFilters(index:number): void {
        if(index == 1){
          this.testcheck = false;
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
          this.testcheck = false;
          if (this.diciplineList.every(item => !item.checked)) {
            this.allProgarms = false;
            this.allprogramIntermediate = false;
          } else if (this.diciplineList.every(item => item.checked)) {
            this.allProgarms = true;
            this.allprogramIntermediate = false;
          } else {
            this.allprogramIntermediate = true;
            this.allProgarms = false;
          }
        }
        if(index == 3){
          this.testcheck = false;
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
          this.testcheck = false;
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
      openFindModal(){
      //  this.tabFindIndex = 0;
        
        this.updateAllCheckedFilters(-1);
        
        this.findModalOpen = true;
        
      }
    
      log(event: any,index:number) {
        this.testcheck = false;   
        if(index == 1)
        this.selectedbranches = event;
        if(index == 2)
        this.selectedPrograms = event;
        if(index == 3)
        this.selectedCordinators = event;
        if(index == 4)
        this.selectedCategories = event;  
        if(index == 5 && event.target.checked){
          this.searchAvaibleModal = true;
        }
      }
   
      setCriteria(){ 
        this.cariteriaList.push({
          fieldName  : this.extendedSearch.value.title,
          searchType : this.extendedSearch.value.rule,
          textToLoc  : this.extendedSearch.value.from,
          endText    : this.extendedSearch.value.to,
        })
      }
  }
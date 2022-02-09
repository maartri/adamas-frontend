import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService } from '@services/list.service';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { MenuService } from '@services/menu.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';
import { PrintService } from '@services/print.service';
import { TimeSheetService } from '@services/timesheet.service';

@Component({
    templateUrl: './userdetail.html',
    styles: []
})
export class UserDetail implements OnInit {
    
    tableData: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    modalVariables: any;
    dateFormat: string ='dd/MM/yyyy';
    inputVariables:any;
    title :string = "Add User Details";
    private unsubscribe: Subject<void> = new Subject();
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    token:any;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;  
    check : boolean = false;
    userRole:string="userrole";
    whereString :string="Where ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
    temp_title: any;
    branchesList: any;
    userList:any;
    diciplineList: any;
    casemanagers: any;
    categoriesList: any;
    selectedbranches: any[];
    testcheck : boolean = false;
    selectedPrograms: any;
    selectedCordinators: any;
    selectedReminders:any;
    selectedCategories: any;
    selectedStaffCategories: any;
    allBranches:boolean = true;
    allBranchIntermediate:boolean = false;
    
    allProgarms:boolean = true;
    allprogramIntermediate:boolean = false;
    
    allcat:boolean = true;
    allCatIntermediate:boolean = false;
    
    allCordinatore:boolean = true;
    allCordinatorIntermediate:boolean = false;

    allReminders:boolean = true;
    allRemindersIntermediate:boolean = false;

    allStaffCat:boolean = true;
    allStaffCatIntermediate:boolean = false;

    staffjobcategories: any;


    checkBoxString: string = '010101';

    constructor(
        private globalS: GlobalService,
        private cd: ChangeDetectorRef,
        private listS:ListService,
        private timeS:TimeSheetService,
        private menuS:MenuService,
        private switchS:SwitchService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private fb: FormBuilder,
        private printS:PrintService,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService
        ){}
        
        ngOnInit(): void {
            this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
            this.userRole = this.tocken.role;
            this.buildForm();
            this.loadData();
            this.loading = false;
            this.cd.detectChanges();
        }
        loadData(){
            this.loading = true;
            this.menuS.getUserList(this.check).subscribe(data => {
                this.tableData = data;
                this.userList  = data;
                this.loading = false;
            });
        }
        getUserData() {
            return forkJoin([
                this.listS.getlistbranchesObj(),
                this.listS.getprogramsobj(),
                this.listS.getcategoriesobj(),
                this.listS.casemanagerslist(),
                this.listS.getstaffcategorylist()
            ]).subscribe(x => {
                this.branchesList       = x[0];
                this.diciplineList      = x[1];
                this.categoriesList     = x[2];
                this.casemanagers       = x[3];
                this.staffjobcategories = x[4];
                this.updateAllCheckedFilters(-1);
            });
        }
        
        updateAllCheckedFilters(filter: any): void {
            
            if(filter == 1 || filter == -1){
                if(this.testcheck == false){
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
            if(filter == 4 || filter == -1){
                if(this.testcheck == false){
                    if (this.allCordinatore) {
                        console.log("cordinator");
                        this.casemanagers.forEach(x => {
                            x.checked = true;
                        });
                    }else{
                        console.log("cordinator false");
                        this.casemanagers.forEach(x => {
                            x.checked = false;
                        });
                    }
                }
            }
            if(filter == 5 || filter == -1){
                if(this.testcheck == false){
                    if (this.allCordinatore) {
                        console.log("reminders");
                        this.userList.forEach(x => {
                            x.checked = true;
                        });
                    }else{
                        console.log("reminders false");
                        this.userList.forEach(x => {
                            x.checked = false;
                        });
                    }
                }
            }
            if(filter == 6 || filter == -1){
                if(this.testcheck == false){
                    if (this.allStaffCat) {
                        this.staffjobcategories.forEach(x => {
                            x.checked = true;
                        });
                    }else{
                        this.staffjobcategories.forEach(x => {
                            x.checked = false;
                        });
                    }
                }
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
            if(index == 4){
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
                if (this.userList.every(item => !item.checked)) {
                    this.allReminders = false;
                    this.allRemindersIntermediate = false;
                } else if (this.userList.every(item => item.checked)) {
                    this.allReminders = true;
                    this.allRemindersIntermediate = false;
                } else {
                    this.allRemindersIntermediate = true;
                    this.allReminders = false;
                }
            }
            if(index == 6){
                if (this.staffjobcategories.every(item => !item.checked)) {
                    this.allStaffCat = false;
                    this.allStaffCatIntermediate = false;
                } else if (this.staffjobcategories.every(item => item.checked)) {
                    this.allStaffCat = true;
                    this.allStaffCatIntermediate = false;
                } else {
                    this.allStaffCatIntermediate = true;
                    this.allStaffCat = false;
                }
            }
        }

        log(event: any,index:number) {
            this.testcheck = true;   
            if(index == 1)
            this.selectedbranches = event;
            if(index == 2)
            this.selectedPrograms = event;
            if(index == 3)
            this.selectedCategories = event;
            if(index == 4)
            this.selectedCordinators = event;  
            if(index == 4)
            this.selectedReminders = event;
            if(index == 6)
            this.selectedStaffCategories = event;
        }
        updateUserDetailViewingTab() : void
        {
            this.loading = true;
            // this.selectedPrograms = this.diciplineList
            // .filter(opt => opt.checked)
            // .map(opt => opt.description)
            
            // this.selectedCordinators = this.casemanagers
            // .filter(opt => opt.checked)
            // .map(opt => opt.uniqueID)
            
            // this.selectedCategories = this.categoriesList
            // .filter(opt => opt.checked)
            // .map(opt => opt.description)
            
            // this.selectedbranches = this.branchesList
            // .filter(opt => opt.checked)
            // .map(opt => opt.description)

            // this.selectedbranches = this.branchesList
            // .filter(opt => opt.checked)
            // .map(opt => opt.description)

            var postdata = {
       
            allTeamAreas      : this.allProgarms,
            selectedTeamAreas : (this.allProgarms == false) ? this.selectedPrograms : '',
        
            allcat:this.allcat,
            selectedCategories:(this.allcat == false) ? this.selectedCategories : '',
        
            allBranches:this.allBranches,
            selectedbranches:(this.allBranches == false) ? this.selectedbranches : '',
        
            allCordinatore:this.allCordinatore,
            selectedCordinators:(this.allCordinatore == false) ? this.selectedCordinators : '',

            allStaffJobCat:this.allStaffCat,
            selectedStaffJobCategories:(this.allCordinatore == false) ? this.selectedCordinators : '',

            }
            
            this.timeS.postuserdetailviewingScopes(postdata,12).subscribe(data => {
               console.log("added");
              this.loading = false;
              this.cd.detectChanges();
            });
        }

        loadTitle()
        {
            return this.title
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
        
        showAddModal() {
            this.resetModal();
            this.getUserData();
            this.modalOpen = true;
        }
        
        resetModal() {
            this.current = 0;
            this.inputForm.reset();
            this.postLoading = false;
        }
        
        showEditModal(index: any) {
            this.title = "Edit User Detail"
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
                recordNumber:recordNumber
            });
            this.temp_title = name;

        }
        
        tabFindIndex: number = 0;
        tabFindChange(index: number){
                this.tabFindIndex = index;        
        }
        tabFindIndexScope: number = 0;
        tabFindChangeScopes(index: number){
                this.tabFindIndexScope = index;
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
                        title: 'CDC Target Groups'
                    }, 
                    this.inputVariables = {
                        display: group.get('name').value,
                        end_date:!(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
                        domain: 'CDCTARGETGROUPS', 
                    }
                    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        if (data) 
                        this.globalS.sToast('Success', 'Saved successful');     
                        else
                        this.globalS.sToast('Unsuccess', 'Data not saved' + data);
                        this.loadData();
                        this.postLoading = false;      
                        // this.isUpdate = false;    
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
                            title: 'CDC Target Groups'
                        }, 
                        this.inputVariables = {
                            display: group.get('name').value,
                            end_date:!(this.globalS.isVarNull(group.get('end_date').value)) ? this.globalS.convertDbDate(group.get('end_date').value) : null,
                            primaryId:group.get('recordNumber').value,
                            domain: 'CDCTARGETGROUPS',
                        }
                        
                        ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                            if (data) 
                            this.globalS.sToast('Success', 'Updated successful');     
                            else
                            this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
                            this.loadData();
                            this.postLoading = false; 
                            this.isUpdate = false;         
                            this.handleCancel();
                            this.resetModal();
                        });
                    }
                    
                }
                buildForm() {
                    this.inputForm = this.formBuilder.group({
                        name: '',
                        title:'',
                        end_date:'',
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
                    var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2 ,DeletedRecord as is_deleted,CONVERT(varchar, [enddate],105) as Field3 from DataDomains "+this.whereString+" Domain='CDCTARGETGROUPS'";
                    
                    const data = {
                        "template": { "_id": "0RYYxAkMCftBE9jc" },
                        "options": {
                            "reports": { "save": false },
                            "txtTitle": "CDC Target Group List",
                            "sql": fQuery,
                            "userid":this.tocken.user,
                            "head1" : "Sr#",
                            "head2" : "Name",
                            "head3" : "End Date"
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


        changeCheckbox(index: number, val: boolean){
            let temp = Object.assign([], this.checkBoxString);
            temp.splice(index,1, val ? '1' : '0')

            this.checkBoxString = temp.join('')
            console.log(this.checkBoxString)
        }
                
    }
            
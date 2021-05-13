import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes,status,period,budgetTypes,enforcement,billunit, ClientService, MenuService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: '',
    templateUrl: './services.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .ant-modal-body{
            padding-top:0px !important  
        },
        .ant-card-small>.ant-card-body {
            padding: 6px !important;
        },
        .ant-card-small>.ant-card-head {
            min-height: 20px !important;
        }
    `],
})

export class IntakeServices implements OnInit, OnDestroy {

    private unsubscribe: Subject<void> = new Subject();
    user: any;
    dateFormat: string ='dd/MM/yyyy';
    loading: boolean = false;
    postLoading:boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;
    tableData: Array<any> = [];
    alist: Array<any> = [];
    status: string[];
    activities: any;
    program: any;
    periods: string[];
    budgetTypes: string[];
    enforcement: string[];
    billunit: string [];
    competencymodal: boolean= false;
    isUpdateCompetency: boolean = false;
    inputvalueSearch:string;
    competencyList: any;
    CompetencycheckedList: any[];
    competencyListCopy: any;
    temp: any[];
    listRecipients: any;
    isUpdatePackageType: any;
    listCompetencyByPersonId: any;
    competencyForm: FormGroup;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private menuS: MenuService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef
    ) {
        cd.detach();

        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal']);
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'services')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        this.search(this.user);
        this.CompetencycheckedList = new Array<string>();
        this.buildForm();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    trackByFn(index, item) {
        return item.id;
    }

    search(user: any = this.user) {
        this.cd.reattach();

        this.loading = true;
        this.timeS.getintakeservices(this.user.id).subscribe(plans => {
            this.tableData = plans;
            this.loading = false;
            this.cd.markForCheck();
        });
    }
    listDropDown(user: any = this.user) {
        this.status = [];
        this.status = status;
        this.periods = period;
        this.budgetTypes = budgetTypes;
        this.enforcement = enforcement;
        this.billunit    = billunit;
        this.activities = [];
        let acti = "SELECT TITLE FROM ITEMTYPES WHERE ProcessClassification IN ('OUTPUT', 'EVENT', 'ITEM') AND ENDDATE IS NULL";
        this.listS.getlist(acti).subscribe(data => {
            this.activities = data;
        });
        this.program = [];
        let prog = "select distinct Name from HumanResourceTypes WHERE [GROUP]= 'PROGRAMS' AND ((EndDate IS NULL) OR (EndDate > GETDATE()))";
        this.listS.getlist(prog).subscribe(data => {
            this.program = data;
        });

        let comp = "SELECT Description as name from DataDomains Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND Domain = 'STAFFATTRIBUTE' OR Domain = 'RECIPATTRIBUTE' ORDER BY Description";
        this.listS.getlist(comp).subscribe(data => {
            this.competencyList = data;
            this.competencyListCopy = data;
        });

        this.timeS.getrecipients({
            User: this.globalS.decode().nameid,
            SearchString: ''
          }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.listRecipients = data;
            this.cd.markForCheck();
          });
    }
    buildForm() {
        this.inputForm = this.formBuilder.group({
            includeCaseManagement:false,
            status:'',
            program:'',
            activity:'',
            freq:'',
            period:'',
            enforcement:'',
            starting:null,
            budgetType:'',
            bamount:'',
            specialPricing:false,
            billunit:'',
            namount:'',
            gst: false,
            compRecord:'',
            recordNumber:'',  
        })
        this.competencyForm = this.formBuilder.group({
            competency:'',
            mandatory:false,
            PersonID:'',
            notes:'',
            recordNumber:'',
        });
    }

    save() {

    }

    showEditModal(index: number) {

    }

    delete(index: number) {

    }
    deletecompetency(data: any){
        this.timeS.deleteintakeServicecompetency(data.recordNumber).pipe(
        takeUntil(this.unsubscribe)).subscribe(data => {
                        if(data){
                            this.loadCompetency()
                            this.globalS.sToast('Success','Competency Deleted')
                        }
                    })
    }
    handleCancel() {
        this.modalOpen = false;
    }
    
    log(value: string[]): void {
        // console.log(value);
    }
    showAddModal() {
        this.addOREdit = 1;
        this.listDropDown();
        this.loadCompetency();
        this.modalOpen = true;

    }
    showCompetencyModal(){
        this.competencyList.forEach(x => {
          x.checked = false
        });
        this.CompetencycheckedList = [];
        this.competencymodal = true;
    }
    showComptencyEditModal(data: any){
        this.competencymodal = true;
        this.isUpdateCompetency = true;
        this.competencyForm.patchValue({
          competency: data.competency,
          mandatory: (data.mandatory == false || data.mandatory == null ) ? false : true,
          notes:data.notes,
          recordNumber:data.recordNumber,
        });
      }
    searchCompetenncy(event){
        this.temp = [];
        this.competencyList = this.competencyListCopy;
        if(event.target.value != ""){
          this.temp = this.competencyList.filter(res=>{
            return res.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
          })
          this.competencyList = this.temp;
        }else if(event.target.value == ""){
          this.competencyList = this.competencyListCopy;
        }
    }
    onCompetencyCheckboxChange(option, event) {
        if(event.target.checked){
          this.CompetencycheckedList.push(option.name);
        } else {
          this.CompetencycheckedList = this.CompetencycheckedList.filter(m=>m!= option.name)
        }
    }
    loadCompetency(){
        this.menuS.getlistServiceCompetencyByPersonId(this.user.id).subscribe(data => {
          this.listCompetencyByPersonId = data;
          this.loading = false;
          this.cd.detectChanges();
        });
    }
    saveCompetency(){
        this.postLoading = true;
        let insertOne = false;
        const { notes,competency,mandatory,PersonID,recordNumber} = this.competencyForm.value;
        if(!this.isUpdateCompetency){
          this.CompetencycheckedList.forEach( (element) => {
            let is_exist   = this.globalS.isCompetencyExists(this.listCompetencyByPersonId,element);
            if(!is_exist){
                this.timeS.postintakeServicecompetency({
                    PersonID: this.user.id,
                    competencyValue: element,
                    mandatory:0,
                   })
                    .subscribe(data => {
                        insertOne = true;
                    });
                }
          });
          if(insertOne){
            this.globalS.sToast('Success', 'Saved successful');
          }
          
          insertOne = false;
          this.postLoading = false;
          this.handleCompetencyCancel();
          this.loading = true;
          this.loadCompetency();
          this.competencyForm.reset();
          this.CompetencycheckedList = [];
        }
        else{
           this.postLoading = true;
           this.timeS.updateintakeServicecompetency({
            PersonID: this.user.id,
            competencyValue: competency,
            mandatory:mandatory,
            notes:notes,
            recordNumber:recordNumber
           })
            .subscribe(data => {
                this.globalS.sToast('Success', 'Saved successful');
                this.postLoading = false;
                this.handleCompetencyCancel();
                this.loading = true;
                this.competencyForm.reset();
                this.loadCompetency();
            });
        }
      }

    handleCompetencyCancel(){
        this.competencyForm.reset();
        this.competencymodal = false;
    }
    
    tabFindIndex: number = 0;
        tabFindChange(index: number){
         this.tabFindIndex = index;
    }
    tabFindIndexcomp: number = 0;
        tabFindChangecomp(index: number){
         this.tabFindIndexcomp = index;
    }
}
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes,status,period,budgetTypes,enforcement,billunit, ClientService } from '@services/index';
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

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
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
            competency:'',
            mandatory:false,
            compPersonId:'',
            compRecord:'',
            recordNumber:'',  
        })
    }

    save() {

    }

    showEditModal(index: number) {

    }

    delete(index: number) {

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
        this.modalOpen = true;

    }
    showCompetencyModal(){
        this.competencyList.forEach(x => {
          x.checked = false
        });
        this.CompetencycheckedList = [];
        this.competencymodal = true;
    }
    showComptencyEditModal(index: any){
        this.competencymodal = true;
        this.isUpdateCompetency = true;
        // const { 
        //   competency,
        //   mandatory,
        //   personId,
        //   recordNumber,
        // } = this.listCompetencyByPersonId[index];
        // this.inputForm.patchValue({
        //   competency: competency,
        //   mandatory: (mandatory == null) ? false : true,
        //   personId: personId,
        //   LeaverecordNumber:recordNumber,
        // });
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
    saveCompetency(){
        
    }
    handleCompetencyCancel(){
        this.competencymodal = false;
    }
}
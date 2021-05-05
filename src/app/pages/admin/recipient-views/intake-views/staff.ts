import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
    selector: '',
    templateUrl: './staff.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IntakeStaff implements OnInit, OnDestroy {
    
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    loading: boolean = false;
    postLoading : boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;

    excludedStaff: Array<any> = []
    includedStaff: Array<any> = []
    staffApproved: boolean =  false;
    careWorkers: any;
    staffUnApproved: boolean = false;
    temp: any[];
    careWorkersCopy: any;
    careWorkersExcluded: any;
    careWorkersExcludedCopy: any;
    checkedListExcluded: any;
    checkedListApproved: any;
    inputvalueSearch:string = '';
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
                  this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'staff')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        this.checkedListExcluded =new Array<string>();
        this.checkedListApproved =new Array<string>();
        this.search(this.user);
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
        this.careWorkers = [];
        this.careWorkersExcluded = [];
        this.loading = true;

        forkJoin([
            this.timeS.getexcludedstaff(user.id),
            this.timeS.getincludedstaff(user.id)
        ]).subscribe(staff => {
            this.loading = false;
            this.excludedStaff = staff[0];
            this.includedStaff = staff[1];
            this.cd.markForCheck();
        });
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            
        })
    }

    save() {

    }

    showEditModal(index: number) {

    }

    delete(index: number) {

    }

    handleCancel() {

    }

    showAddModal() {
        this.addOREdit = 1;
        this.modalOpen = true;
    }
    log(value: string[]): void {
        // console.log(value);
    }
      
    showstaffApprovedModal(){
        // this.resetModal();
        this.staffApproved = true;
      }
      handleAprfCancel(){
        this.careWorkers.forEach(x => {
          x.checked = false
        });
        this.staffApproved = false;
      }
      showstaffUnApprovedModal(){
        this.staffUnApproved = true;
      }
      handleUnAprfCancel(){
        this.careWorkers.forEach(x => {
          x.checked = false
        });
        this.staffUnApproved = false;
      }
      searchStaff(event){
        this.temp = [];
        this.careWorkers = this.careWorkersCopy;
        if(event.target.value != ""){
          this.temp = this.careWorkers.filter(res=>{
            return res.accountno.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
          })
          this.careWorkers = this.temp;
        }else if(event.target.value == ""){
          this.careWorkers = this.careWorkersCopy;
        }      
      }
      searchStaffExcluded(event){
        this.temp = [];
        this.careWorkersExcluded = this.careWorkersExcludedCopy;
        if(event.target.value != ""){
          this.temp = this.careWorkersExcluded.filter(res=>{
            return res.accountno.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
          })
          this.careWorkersExcluded = this.temp;
        }else if(event.target.value == ""){
          this.careWorkersExcluded = this.careWorkersExcludedCopy;
        }      
      }
      onCheckboxUnapprovedChange(option, event) {
        if(event.target.checked){
          this.checkedListExcluded.push(option.accountno);
        } else {
          this.checkedListExcluded = this.checkedListExcluded.filter(m=>m!= option.accountno)
        }
      }
      onCheckboxapprovedChange(option, event)
      {
        if(event.target.checked){
          this.checkedListApproved.push(option.accountno);
        } else {
          this.checkedListApproved = this.checkedListApproved.filter(m=>m!= option.accountno)
        }
      }
      saveApprovedStaff(){

      }
      saveExcludeStaff(){

      }
}
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService, othersType, dateFormat } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    styles: [`
        ul{
            list-style:none;
        }

        div.divider-subs div{
            margin-top:2rem;
        }

        .layer2 > span{
            width:13rem;
            text-align:right;
        }
        .layer2 > input{
            width:4rem;
        }
        .layer2 {
            margin-bottom:5px;
        }
        .layer2 > *{
            display:inline-block;
            margin-right:5px;
            font-size:11px;
        }
        nz-select{
            width:12rem;
        }
        
    `],
    templateUrl: './others.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RecipientOthersAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;
    
    checked: boolean = false;
    isDisabled: boolean = false;

    loading: boolean = false;

    types: Array<string> = othersType;
    branches: Array<string> = [];
    casemanagers: Array<string> = [];

    othersForm: FormGroup;
    staffs: Array<string> = []

    dateFormat: string = dateFormat;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private modalService:NzModalService
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'history')) {
                this.search(data);
            }
        });
    }

    ngOnInit(): void {        
        this.user = this.sharedS.getPicked();
        this.buildForm();        
        this.populate();
        this.search(this.user);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    search(data: any){
        this.timeS.getothers(data.id)
            .subscribe(data => {
                console.log(data);
                this.othersForm.patchValue(data)
                this.detectChanges();
            });
    }

    buildForm(){
        this.othersForm = this.formBuilder.group({
            type: null,
            admissionDate: null,
            branch: null,
            recipient_Coordinator: null,
            mainSupportWorker: null,
            occupation: null,
            generatesReferrals: false,
            acceptsReferrals: false,
            companyFlag: false,
            excludeFromRosterCopy: false,
            financialClass: null,
            admittedBy: null,
            dischargeDate: null,
            dischargedBy: null,
            

        });
    }

    canDeactivate() {
        if (this.othersForm && this.othersForm.dirty) {
            this.modalService.confirm({
                nzTitle: 'Changes have been detected. Save Changes?',
                nzContent: '',
                nzOkText: 'Yes',
                nzOnOk: () => {
                    this.save();
                },
                nzCancelText: 'No',
                nzOnCancel: () => {
                    
                }
            });
        }

        return true;
    }

    populate(){
        forkJoin([
            this.listS.getlistbranches(),
            this.listS.getlistcasemanagers(),
        ]).subscribe(data => {
            this.branches = data[0];
            this.casemanagers = data[1];

            this.detectChanges();
        })

        this.timeS.getstaff({
            User: this.globalS.decode().nameid,
            SearchString: '',
            IncludeInactive: false,
          }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.staffs = data.map(x => x.accountNo);
            this.detectChanges();
          });
    }

    save(){
        this.timeS.updateothers(this.othersForm.value, this.user.id)
            .subscribe(data => this.globalS.sToast('Success','The form is saved successfully'));
    }

    detectChanges(){
        this.cd.markForCheck();
        this.cd.detectChanges();
    }


}
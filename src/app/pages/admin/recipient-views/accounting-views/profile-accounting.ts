import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: '',
    styles:[
        `
        span.client{
            font-weight: 500;
            font-size: 1.5rem;
            position: absolute;
            top: -13px;
            color: #474f5d;
        }
        .layer2 > span{
            width:13rem;
            text-align:right;
        }
        .layer2 > input{
            width:4rem;
        }
        .layer2 {
            margin-bottom:2rem;
            display:flex;
        }
        .layer2 > *{
            display:inline-block;
            margin-right:5px;
            font-size:11px;
        }
        .layer2 > *:first-child{
            flex:1;
        }
        .layer2 > *:last-child{
            flex:3;
        }
        .layer2 > *:last-child > *{
            width:12rem;
        }
        `
    ],
    templateUrl: './profile-accounting.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileAccounting implements OnInit, OnDestroy {

    private unsubscribe: Subject<void> = new Subject();
    profileForm: FormGroup;

    user: any;
    loading: boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;
    tableData: Array<any> = [];
    alist: Array<any> = [];

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private fb: FormBuilder,
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
            if (this.globalS.isCurrentRoute(this.router, 'plans')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.buildForm();
        this.user = this.sharedS.getPicked();
        this.search(this.user);        
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
        this.timeS.getaccountingprofile(user.id).subscribe(data => {
            this.profileForm.patchValue(data);
            this.cd.markForCheck();
        });
    }

    buildForm() {
        this.profileForm = this.fb.group({
            accountingIdentifier: null,
            admissionDate: null,
            admittedBy: null,
            bPayRef: null,
            billProfile:null,
            billTo: null,
            billingCycle: null,
            billingMethod: null,
            branch:null,
            cappedBill: false,
            careplanChange: null,
            companyFlag: false,
            creditCardCCV: null,
            creditCardExpiry: null,
            creditCardName: null,
            creditCardNumber: null,
            creditCardType: null,
            creditCardTypeOther: null,
            directDebit: false,
            dischargeDate: null,
            dischargedBy: null,
            donationAmount: null,
            dvaCoBiller: false,
            emailInvoice: false,
            emailStatement: false,
            excludeFromRosterCopy: false,
            fdp: false,
            financialClass: null,
            hideTransportFare: false,
            interpreterRequired: null,
            mainSupportWorker: null,
            ndisNumber: null,
            notes: null,
            occupation: null,
            ohsProfile: null,
            orderNo: null,
            percentageRate: null,
            printInvoice: false,
            printStatement: false,
            recipient_Coordinator: null,
            recipient_Split_Bill: false,
            reportingId: null,
            terms: null,
            title: null,
            type:null,
            whs:null
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
}
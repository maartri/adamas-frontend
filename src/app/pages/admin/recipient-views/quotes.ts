import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { ContextMenuComponent } from 'ngx-contextmenu';

import { Filters } from '@modules/modules';

@Component({
    styleUrls:['./quotes.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './quotes.html'
})


export class RecipientQuotesAdmin implements OnInit, OnDestroy, AfterViewInit {
    private unsubscribe: Subject<void> = new Subject();

    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    user: any;
    inputForm: FormGroup;
    tableData: Array<any> = [];
    checked: boolean = false;
    isDisabled: boolean = false;

    displayLast: number = 20;
    archivedDocs: boolean = false;
    acceptedQuotes: boolean = false;

    loading: boolean = false;

    // filters: Filters = {
    //     acceptedQuotes: false,
    //     allDates: false,
    //     archiveDocs: true,
    //     display: 20
    // };

    filters: any;

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
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal']);
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'quotes')) {
                this.search(data);
            }
        });
    }

    ngAfterViewInit(){        
        // this.search(this.user);
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        this.buildForm();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    showMessage(message: any) {
        console.log(message);
    }

    filterChange(data: any){
        this.search(this.user);
    }

    search(user: any) {
        this.loading = true;
        

        let data = {
            quote: {
                PersonID: user.id,
                DisplayLast: this.displayLast,
                IncludeArchived: this.archivedDocs,
                IncludeAccepted: this.acceptedQuotes
            },
            filters: this.filters
        }

        this.listS.getlistquotes(data).subscribe(data => {
            this.tableData = data;
            this.loading = false;
            this.cd.markForCheck();
        })
    }

    patchData(data: any) {
        this.inputForm.patchValue({
            autoLogout: data.autoLogout,
            emailMessage: data.emailMessage,
            excludeShiftAlerts: data.excludeShiftAlerts,
            inAppMessage: data.inAppMessage,
            logDisplay: data.logDisplay,
            pin: data.pin,
            rosterPublish: data.rosterPublish,
            shiftChange: data.shiftChange,
            smsMessage: data.smsMessage
        });
    }


    buildForm() {
        this.inputForm = this.formBuilder.group({
            autoLogout: [''],
            emailMessage: false,
            excludeShiftAlerts: false,
            inAppMessage: false,
            logDisplay: false,
            pin: [''],
            rosterPublish: false,
            shiftChange: false,
            smsMessage: false
        });
    }

    onKeyPress(data: KeyboardEvent) {
        return this.globalS.acceptOnlyNumeric(data);
    }

    save() {
        const group = this.inputForm;

        this.timeS.updatetimeandattendance({
            AutoLogout: group.get('autoLogout').value,
            EmailMessage: group.get('emailMessage').value,
            ExcludeShiftAlerts: group.get('excludeShiftAlerts').value,
            InAppMessage: group.get('inAppMessage').value,
            LogDisplay: group.get('logDisplay').value,
            Pin: group.get('pin').value,
            RosterPublish: group.get('rosterPublish').value,
            ShiftChange: group.get('shiftChange').value,
            SmsMessage: group.get('smsMessage').value,
            Id: this.user.id
        }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data) {
                this.globalS.sToast('Success', 'Change successful');
                this.inputForm.markAsPristine();
                return;
            }
        });
    }

    canDeactivate() {
        if (this.inputForm && this.inputForm.dirty) {
            this.modalService.confirm({
                nzTitle: 'Save changes before exiting?',
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

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        
    }

    hello(data: any){
        console.log(data);
        return false;
    }
}
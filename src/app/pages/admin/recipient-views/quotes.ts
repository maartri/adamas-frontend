import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject, EMPTY } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { dateFormat } from '@services/global.service'
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { ContextMenuComponent } from 'ngx-contextmenu';

import { Filters } from '@modules/modules';

@Component({
    styleUrls:['./quotes.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './quotes.html',
    styles:[`
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
 
    .line{
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #f3f3f3;
    }
    .controls div{
        display: inline-block;
        border-radius: 50%;
        background: #f1f1f1;
        border: 1px solid #cecece;
        width: 24px;
        text-align: center;
        margin-right:10px;
    }
    .controls div i{
        cursor:pointer;
    }
    .controls div:hover{
        background:#d6d6d6;
    }
    .right{
        float:right;
    }
    .right >  * {        
        margin-right:5px;
    }
    nz-range-picker{
        width:15rem;
    }
    .div-table{
        display: table;
        line-height: 25px;
    }
    .div-table > div{
        display: table-row;
    }
    .div-table > div > div{
        display: table-cell;
        padding: 2px 5px;
    }
    .form-group nz-select{
        width:100%
    }
    nz-select.select{
        min-width:10rem;
    }
    `]
})


export class RecipientQuotesAdmin implements OnInit, OnDestroy, AfterViewInit {

    private unsubscribe: Subject<void> = new Subject();
    quoteForm: FormGroup;
    quoteListForm: FormGroup;

    title: string = 'Add New Quote'
    listOfData = [
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


    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    dateFormat: string = dateFormat;
    nzSize: string = "small"

    user: any;
    inputForm: FormGroup;
    tableData: Array<any> = [];
    checked: boolean = false;
    isDisabled: boolean = false;

    displayLast: number = 20;
    archivedDocs: boolean = false;
    acceptedQuotes: boolean = false;

    loading: boolean = false;

    quotesOpen: boolean = false;
    quoteLineOpen: boolean = false;

    value: any;

    quoteTemplateList: Array<string>;
    quoteProgramList: Array<string>;

    

    radioValue: any;
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

    showQuoteModal(){
        this.quotesOpen = true;
        this.listS.getprogramcontingency(this.user.id).subscribe(data => this.quoteProgramList = data);
        this.listS.getglobaltemplate().subscribe(data => this.quoteTemplateList = data);
        this.tabFindIndex = 2;
        console.log(this.user)
    }

    quoteLineModal(){
        this.quoteLineOpen = true;
    }

    handleOk(){

    }

    handleCancel(){
        this.quotesOpen = false;
    }

    tabFindIndex: number = 0;
    tabFindChange(index: number){
        this.tabFindIndex = index;
    }

    search(user: any) {
        this.loading = true;
        this.user = user;
        

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
            excludeFromTravelinterpretation:false,
            inAppMessage: false,
            logDisplay: false,
            pin: [''],
            staffTimezoneOffset:[''],
            rosterPublish: false,
            shiftChange: false,
            smsMessage: false
        });

        this.quoteForm = this.formBuilder.group({
            program: null,
            template: null,

            no: null,
            type: null,
            period: [],
            basePeriod: null,


        });

        this.quoteListForm = this.formBuilder.group({
            chargeType: null,
            code: null,
            displayText: null,
            strategy: null,
            sequenceNo: null
        });

        this.quoteListForm.get('chargeType').valueChanges.subscribe(data => {
            
        });

        this.quoteForm.get('program').valueChanges
        .pipe(
            switchMap(x => this.listS.getprogramlevel(x)),
            switchMap(x => {
                if(x.isCDC){
                    return this.listS.getpensionandfee();
                }
                return EMPTY;
            })
        ).subscribe(data => {
            console.log(data)
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
            ExcludeFromTravelinterpretation: group.get('excludeFromTravelinterpretation').value,
            InAppMessage: group.get('inAppMessage').value,
            LogDisplay: group.get('logDisplay').value,
            Pin: group.get('pin').value,
            StaffTimezoneOffset:group.get('staffTimezoneOffset').value,
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
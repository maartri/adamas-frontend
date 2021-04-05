import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService, StaffService, ShareService, leaveTypes, ListService } from '@services/index';
import {forkJoin,  of ,  Subject ,  Observable, observable, EMPTY } from 'rxjs';
import { RECIPIENT_OPTION } from '../../modules/modules';
@Component({
    styles: [`
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
            background: #717e94;
            color: #fff;
        }
        ul{
            list-style:none;
            float:right;
            margin:0;
        }
        li{
            display: inline-block;
            margin-right: 6px;
            padding: 5px 0;
            font-size: 13px;
        }
        li div{
            text-align: center;
        }
        .recipient-controls button{
            margin-right:1rem;
        }
        nz-select{
            width:100%;
        }
        .options button:disabled{
            color:#a3a3a3;
            cursor: no-drop;
        }
        .options button:hover:not([disabled]) {
            color:#177dff;
            cursor:pointer;
        }
        ul li button{
            border: 0;
            background: #ffffff00;
            float: left;
        }
        .status{
            font-size: 11px;
            padding: 3px 5px;
            border-radius: 11px;
            color: #fff;

            margin-right: 10px;
        }
        .status.active{            
            background: #42ca46;
        }
        .status.inactive{            
            background: #c70000;
        }
        .status.type{
            background:#c8f2ff;
            color: black;
        }
        .status-program{
            display: inline-block;
            float: left;
            margin-right:1rem;
        }
        .status-program i{
            font-size: 1.4rem;
            color: #bfbfbf;
            margin-right:10px;
            cursor:pointer;
        }
        .status-program i:hover{
            color: #000;
        }
    `],
    templateUrl: './recipients.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientsAdmin implements OnInit, AfterViewInit, OnDestroy {
    user: any = null;
    nzSelectedIndex: number = 0;
    isFirstLoad: boolean = false;
    programModalOpen: boolean = false;

    sample: any;

    newReferralModal: boolean = false;
    saveModal: boolean = false;
    quoteModal: boolean = false;
    newOtherModal: boolean = false;

    isLoading: boolean = false;
    current: number = 0;

    selectedValue: any;

    status: any = null;
    statusTab = new Subject<any>();

    recipientOptionOpen: any;
    recipientOption: string;
    
    RECIPIENT_OPTION = RECIPIENT_OPTION;

    recipientStatus: string = null;
    recipientType: any;
    selectedRecipient: any; 

    programs: Array<any> = [];

    listChange(event: any) {

        if (event == null) {
            this.user = null;
            this.isFirstLoad = false;
            this.sharedS.emitChange(this.user);
            return;
        }

        if (!this.isFirstLoad) {
            this.view(0);
            //this.view(6);
            this.isFirstLoad = true;
        }

        console.log(JSON.stringify(event));

  
        // this.user = {
        //     agencyDefinedGroup: "GRAFTON",
        //     code: "ABERKIRDO TYBI",
        //     id: "T0100004514",
        //     sysmgr: true,
        //     view: "recipient"
        // }

        this.user = {
            code: event.accountNo,
            id: event.uniqueID,
            view: event.view,
            agencyDefinedGroup: event.agencyDefinedGroup,
            sysmgr: event.sysmgr
        }

        this.sharedS.emitChange(this.user);

        this.listS.getstatusofwizard(this.user.id)
            .subscribe(data => {
                this.status = data;
            });

        this.cd.detectChanges();
    }

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sharedS: ShareService,
        private cd: ChangeDetectorRef,
        private listS: ListService
    ) {
        this.sharedS.emitProfileStatus$.subscribe(data => {
            console.log(data);
            this.selectedRecipient = data;
            this.recipientType = data.type == null || data.type.trim() == "" ? null : data.type;
            // if(data.admissionDate == null && data.dischargeDate == null){
            //     this.recipientStatus = null;
            //     return;
            // }

            if(data.admissionDate != null && data.dischargeDate == null){
                this.recipientStatus = 'active';
            } else {
                this.recipientStatus ='inactive';
            }
            
        })
    }

    ngOnInit(): void {

        // this.listChange({
        //     "agencyDefinedGroup":"ARUNDEL",
        //     "accountNo":"3CDC STEPH",
        //     "uniqueID":"T0100005508",
        //     "sysmgr":true,
        //     "view":"recipient"
        // });
        
        // this.listChange({
        //     accountNo: "ABBOTS MORGANICA",
        //     agencyDefinedGroup: "GRAFTON",
        //     sysmgr: true,
        //     uniqueID: "T0100004652",
        //     view: "recipient"
        // });

        // this.listChange({
        //         "agencyDefinedGroup":"ARUNDEL",
        //         "accountNo":"ABBERTON G T",
        //         "uniqueID":"T0100005186",
        //         "sysmgr":true,
        //         "view":"recipient"
        //     })
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit() {
        
    }

    view(index: number) {
        this.nzSelectedIndex = index;

        if (index == 0) {
            this.router.navigate(['/admin/recipient/personal'])
        }
        if (index == 1) {
            this.router.navigate(['/admin/recipient/contacts']);
        }
        if (index == 2) {
            this.router.navigate(['/admin/recipient/intake'])
        }
        if (index == 3) {
            this.router.navigate(['/admin/recipient/reminders'])
        }
        if (index == 4) {
            this.router.navigate(['/admin/recipient/opnote'])
        }
        if (index == 5) {
            this.router.navigate(['/admin/recipient/casenote'])
        }
        if (index == 6) {
            this.router.navigate(['/admin/recipient/incidents'])
        }
        if (index == 7) {
            this.router.navigate(['/admin/recipient/perm-roster'])
        }
        if (index == 8) {
            this.router.navigate(['/admin/recipient/history'])
        }
        if (index == 9) {
            this.router.navigate(['/admin/recipient/insurance-pension'])
        }
        if (index == 10) {
            this.router.navigate(['/admin/recipient/quotes'])
        }
    }

    handleCancel() {
        this.newReferralModal = false;
        this.saveModal = false;
        this.quoteModal = false;
        this.newOtherModal = false;
    }

    handleOk() {
        
    }

    detectChanges(){
        this.cd.markForCheck();
        this.cd.detectChanges();
    }

    closeProgram(){
        this.programModalOpen = false;
    }

    loadPrograms(){
        if(!this.selectedRecipient){
            return;
        }
        this.listS.getrecipientprograms(this.selectedRecipient.uniqueID)
        .subscribe(data => {
            this.programs = data;
            this.detectChanges();
        })
    }

    openReferInModal: any;
    profileData: any;
    
    openReferModal(user: any) {
        console.log(user);

        this.sharedS.emitOnSearchListNext(user.code);        
        this.profileData = user;
        this.openReferInModal = {};
    }

    clicky(index: number){

        if(index == 0){
            this.recipientOption =  this.RECIPIENT_OPTION.REFER_IN;
            this.recipientOptionOpen = { };
        }

        if(index == 1){
            this.recipientOption =  this.RECIPIENT_OPTION.REFER_ON;
            this.recipientOptionOpen = { };
        }

        if(index == 2){
            this.recipientOption =  this.RECIPIENT_OPTION.NOT_PROCEED;
            this.recipientOptionOpen = { };
        }

        if(index == 3){
            this.recipientOption =  this.RECIPIENT_OPTION.ASSESS;
            this.recipientOptionOpen = { };
        }

        if(index == 4){
            this.recipientOption =  this.RECIPIENT_OPTION.ADMIT;
            this.recipientOptionOpen = { };
        }

        if(index == 5){
            this.recipientOption =  this.RECIPIENT_OPTION.WAIT_LIST;
            this.recipientOptionOpen = { };
        }

        if(index == 6){
            this.recipientOption =  this.RECIPIENT_OPTION.DISCHARGE;
            this.recipientOptionOpen = { };
        }

        if(index == 6){
            this.recipientOption =  this.RECIPIENT_OPTION.DISCHARGE;
            this.recipientOptionOpen = { };
        }

        if(index == 7){
            this.recipientOption =  this.RECIPIENT_OPTION.SUSPEND;
            this.recipientOptionOpen = { };
        }

        if(index == 8){
            this.recipientOption =  this.RECIPIENT_OPTION.REINSTATE;
            this.recipientOptionOpen = { };
        }

        if(index == 9){
            this.recipientOption =  this.RECIPIENT_OPTION.DECEASE;
            this.recipientOptionOpen = { };
        }

        if(index == 10){
            this.recipientOption =  this.RECIPIENT_OPTION.ADMIN;
            this.recipientOptionOpen = { };
        }
        
        if(index == 11){
            this.recipientOption =  this.RECIPIENT_OPTION.ITEM;
            this.recipientOptionOpen = { };
        }
    }
}
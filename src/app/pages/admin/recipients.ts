import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService, StaffService, ShareService, leaveTypes } from '@services/index';

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
            margin-right: 10px;
            font-size: 12px;
            padding: 5px;
            cursor:pointer;
        }
        li:hover{
            color:#177dff;
        }
        li div{
            text-align: center;
            font-size: 17px;
        }
        .recipient-controls button{
            margin-right:1rem;
        }
        nz-select{
            width:100%;
        }
    `],
    templateUrl: './recipients.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientsAdmin implements OnInit, AfterViewInit, OnDestroy {
    user: any = null;
    nzSelectedIndex: number = 0;
    isFirstLoad: boolean = false;

    sample: any;

    newReferralModal: boolean = false;
    saveModal: boolean = false;
    quoteModal: boolean = false;
    newOtherModal: boolean = false;

    isLoading: boolean = false;
    current: number = 0;

    selectedValue: any;

    listChange(event: any) {

        if (event == null) {
            this.user = null;
            this.isFirstLoad = false;
            this.sharedS.emitChange(this.user);
            return;
        }

        if (!this.isFirstLoad) {
            this.view(0);
            this.isFirstLoad = true;
        }
        
        // this.user = {
        //     agencyDefinedGroup: "ARUNDEL",
        //     code: "2CDC STEPH",
        //     id: "T0100005506",
        //     sysmgr: true,
        //     view: "recipient"
        // }

        // this.user = {
        //     code: event.accountNo,
        //     id: event.uniqueID,
        //     view: event.view,
        //     agencyDefinedGroup: event.agencyDefinedGroup,
        //     sysmgr: event.sysmgr
        // }

        this.user = {
            code: event.accountNo,
            id: event.uniqueID,
            view: event.view,
            agencyDefinedGroup: event.agencyDefinedGroup,
            sysmgr: event.sysmgr
        }

        this.sharedS.emitChange(this.user);
        this.cd.detectChanges();
    }

    change(data: any) {
        let user = {};
        if (data == 'ABBERTON B') {
            user = {
                code: "ABBERTON B",
                id: "T0100005189",
                view: "recipient",
                agencyDefinedGroup: "ARUNDEL",
                sysmgr: true
            }
        }
        
        if (data == '*****AAAZ T'){
            user = {
                code: "*****AAAZ T",
                id: "T0100005581",
                view: "recipient",
                agencyDefinedGroup: "ASHMORE",
                sysmgr: true
            }
        }

        if (data == '3CDC STEPH') {
            user = {
                code: "3CDC STEPH",
                id: "T0100005508",
                view: "recipient",
                agencyDefinedGroup: "ARUNDEL",
                sysmgr: true
            }
        }
        if (!this.isFirstLoad) {
            this.view(0);
            this.isFirstLoad = true;
        }
        this.sharedS.emitChange(user);
    }

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sharedS: ShareService,
        private cd: ChangeDetectorRef
    ) {

    }

    ngOnInit(): void {
        
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

    openReferInModal: any;
    profileData: any;
    
    openReferModal(user: any) {
        console.log(user);

        this.sharedS.emitOnSearchListNext(user.code);        
        this.profileData = user;
        this.openReferInModal = {};
    }
}
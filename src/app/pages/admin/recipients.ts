import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService, StaffService, ShareService, leaveTypes } from '@services/index';

@Component({
    styles: [`
        nz-tabset >>> div > div.ant-tabs-nav-container{
            height: 25px !important;
            font-size: 13px !important;
        }

        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
            line-height: 24px;
            height: 25px;
        }
        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
            background: #45627e;
            color: #fff;
        }
    `],
    templateUrl: './recipients.html'
})


export class RecipientsAdmin implements OnInit, OnDestroy {
    user: any
    nzSelectedIndex: number = 0;
    isFirstLoad: boolean = false;

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
        private sharedS: ShareService
    ) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

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
}
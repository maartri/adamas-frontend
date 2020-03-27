import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService, StaffService, ShareService ,leaveTypes } from '@services/index';
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
    templateUrl: './staff.html'
})


export class StaffAdmin implements OnInit, OnDestroy {
    user: any

    change(event: any) {

        const user = {
            code: "ABBAS A",
            id: "S0100006438",
            view: 'staff',
            sysmgr: true
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
        if (index == 0) {
            this.router.navigate(['/admin/staff/personal'])
        }
        if (index == 1) {
            this.router.navigate(['/admin/staff/contacts'])
        }
        if (index == 2) {
            this.router.navigate(['/admin/staff/pay'])
        }
        if (index == 3) {
            this.router.navigate(['/admin/staff/leave'])
        }
        if (index == 4) {
            this.router.navigate(['/admin/staff/reminders'])
        }
        if (index == 5) {
            this.router.navigate(['/admin/staff/op-note'])
        }
        if (index == 6) {
            this.router.navigate(['/admin/staff/hr-note'])
        }
        if (index == 7) {
            this.router.navigate(['/admin/staff/competencies'])
        }
        if (index == 8) {
            this.router.navigate(['/admin/staff/training'])
        }
        if (index == 9) {
            this.router.navigate(['/admin/staff/incident'])
        }
        if (index == 10) {
            this.router.navigate(['/admin/staff/document'])
        }
        if (index == 11) {
            this.router.navigate(['/admin/staff/time-attendance'])
        }
        if (index == 12) {
            this.router.navigate(['/admin/staff/position'])
        }
        if (index == 13) {
            this.router.navigate(['/admin/staff/groupings-preferences'])
        }
    }
}
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';

import { GlobalService, StaffService, ShareService, leaveTypes, ListService, TimeSheetService, SettingsService, LoginService } from '@services/index';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { EMPTY } from 'rxjs';

import { ApplicationUser } from '@modules/modules';

interface Person {
    key: string;
    name: string;
    age: number;
    address: string;
}

interface UserView{
    staffRecordView: string,
    staff: number
}

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
            background: #85B9D5;
            color: #fff;
        }
        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
            border-radius: 0;
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
        li div{
            text-align: center;
            font-size: 17px;
        }
        .terminate:hover{
            color: #db2929;
        }
        .leave:hover{
            color: #1488db;
        }
        .checks label{
            display:block;
            margin:10px;
        }
    `],
    templateUrl: './staff.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffAdmin implements OnInit, OnDestroy {
    user: any = null;
    nzSelectedIndex: number = 0;

    isFirstLoad: boolean = false;
    isConfirmLoading: boolean = false;
    sample: any;

    terminateModal: boolean = false;
    putonLeaveModal: boolean = false;
    newStaffModal: boolean = false;
    
    leaveBalanceList: Array<any>;
    terminateGroup: FormGroup;

    userview: UserView;

    userByPass: ApplicationUser;

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
        //     agencyDefinedGroup: undefined,
        //     code: "AASTAFF HELP",
        //     id: "S0100005616",
        //     sysmgr: true,
        //     view: "staff"
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

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private globalS: GlobalService,
        private listS: ListService,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private settingS: SettingsService,
        private loginS: LoginService
    ) {        
      
    }

    ngOnInit(): void {        
        this.buildForm();
        this.normalRoutePass();
    }

    normalRoutePass(): void{
        const { user } = this.globalS.decode();

        this.listS.getstaffrecordview(user).subscribe(data => {
            this.userview = data;
            this.cd.detectChanges();
        })

       
        this.isFirstLoad = false;   
        
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd ) => {
            if (event.url == '/admin/staff') {
                this.sample = { refresh: true };
                this.cd.detectChanges();
            }          
        });

        this.sharedS.emitRouteChangeSource$.subscribe(data => {
            console.log(data);
        });
    }

    buildForm(): void{
        this.terminateGroup = this.fb.group({
            terminateDate: [new Date(), Validators.required],
            unallocUnapproved: false,
            unallocMaster: false,
            deletePending: false
        });

        // this.listChange({});
    }

    ngOnDestroy(): void {

    }

    view(index: number) {
        this.nzSelectedIndex = index;

        if (index == 0) {
            this.router.navigate(['/admin/staff/personal'])
        }
        if (index == 1) {
            this.router.navigate(['/admin/staff/contacts']);            
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

    terminateModalOpen(): void{
        this.terminateModal = true;
        this.listS.getleavebalances(this.user.id)
            .subscribe(data => this.leaveBalanceList = data)
    }

    terminate(){
        
        for (const i in this.terminateGroup.controls) {
            this.terminateGroup.controls[i].markAsDirty();
            this.terminateGroup.controls[i].updateValueAndValidity();
        }

        if(!this.terminateGroup.valid)  return;
        this.isConfirmLoading = true;
        
        const { code, id } = this.user;

        this.timeS.posttermination({
            TerminationDate: this.terminateGroup.value.terminateGroup,
            AccountNo: code,
            PersonID: id
        }).subscribe(data => {
            this.globalS.sToast('Success','Staff has been terminated!');
            this.isConfirmLoading = false;
        });
    }

    reloadVal: boolean = false;
    reload(reload: boolean){
        this.reloadVal = !this.reloadVal;
    }
    
}
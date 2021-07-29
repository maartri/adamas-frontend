import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService, attendance } from '@services/index';
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
        .layer > span:first-child{
            width:8rem;
        }
        .layer > *{
            display:inline-block;
            margin-right:5px;
            font-size:11px;
        }
        .layer > input{
            width: 4rem;
        }
        .compartment > div{
            margin-bottom:5px;
        }
        .layer2 > span{
            width:13rem;
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
            width: 10rem;
        }
    `],
    templateUrl: './attendance.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RecipientAttendanceAdmin implements OnInit, OnDestroy {
    attendanceForm: FormGroup;

    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;

    tableData: Array<any>;
    
    checked: boolean = false;
    isDisabled: boolean = false;

    loading: boolean = false;

    lists: Array<string> = attendance;
    managers: Array<string> = [];

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private cd: ChangeDetectorRef,
        private modalService: NzModalService,
        private formBuilder: FormBuilder
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'attendance')) {
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

    buildForm(){
        this.attendanceForm = this.formBuilder.group({
            allowRegisterSignature: null,
            daelibsid: null,
            paN_TAEarlyFinishTHEmail: null,
            paN_TAEarlyFinishTHSMS: null,
            paN_TAEarlyFinishTHWho: null,
            paN_TALateStartTHEmail:null,
            paN_TALateStartTHSMS: null,
            paN_TALateStartTHWho: null,
            paN_TANoWorkTHEmail: null,
            paN_TANoWorkTHSMS: null,
            paN_TANoWorkTHWho: null,
            paN_TAOverstayTHEmail: null,
            paN_TAOverstayTHSMS: null,
            paN_TAOverstayTHWho: null,
            paN_TAUnderstayTHEmail: null,
            paN_TAUnderstayTHSMS: null,
            paN_TAUnderstayTHWho: null,
            panEarlyFinishTH: null,
            panLateStartTH: null,
            panNoGoTH: null,
            panNoShowTH: null,
            panNoWorkTH: null,
            panOverStayTH: null,
            panUnderStayTH: null,
            pan_Manager: null,
            pan_Status: null,
            paN_TAEarlyStartTHEmail: null,

            panearlystartth: null,
            pinCode: null,
            recipienT_PARENT_SITE:null,
            timeZoneOffset: null,
            paN_TAEarlyStartTHWho: null,

            panlatefinishth: null,
            paN_TALateFinishTHEmail:null,
            paN_TALateFinishTHWho: null
        });
    }

    search(data: any){
        this.timeS.getattendance(data.id)
            .subscribe(data => {
                this.attendanceForm.patchValue(data);
                this.detectChanges();
            });

        this.listS.getportalmanagers().subscribe(data =>{
            this.managers = data;
            this.detectChanges();
        });
    }

    detectChanges(){
        this.cd.markForCheck();
        this.cd.detectChanges();
    }

    canDeactivate() {
        console.log('sss');

        if (this.attendanceForm && this.attendanceForm.dirty) {
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

    save(){
        this.timeS.updateattendance(this.attendanceForm.value, this.user.id)
            .subscribe(data => {
                this.globalS.sToast('Success','The form is saved successfully')
            });
    }


}
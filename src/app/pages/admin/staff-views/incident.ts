import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        .ant-checkbox-wrapper{
            display:flex;
        }
        .ant-checkbox-wrapper >>> span{
            display: flex;
            align-items: center;
            font-size: 12px;
        }
        .options > div{
            margin-bottom:13px;
        }
    `],
    templateUrl: './incident.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffIncidentAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    incidentForm: FormGroup;
    tableData: Array<any>;
    loading: boolean = false;
    postLoading: boolean = false;

    incidentOpen: boolean = false;

    current: number = 0;

    incidentTypeList: Array<any> = []
    incidentRecipient: any;
    operation: any; 


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
        cd.detach();

        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'incident')) {
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        if(this.user){
            this.search(this.user);
            this.buildForm();
            return;
        }
        this.router.navigate(['/admin/staff/personal'])
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {
        this.incidentForm = this.formBuilder.group({
            incidentType: ''
        });
    }

    search(user: any = this.user) {
        this.cd.reattach();
        this.loading = true;
        this.timeS.getincidents(user.code).subscribe(data => {
            this.tableData = data;
            this.loading = false;
            this.cd.detectChanges();
        });

        this.incidentRecipient = this.user;
    }

    trackByFn(index, item) {
        return item.id;
    }  

    showAddModal() {        
        const { agencyDefinedGroup, code, id, sysmgr, view } = this.user;

        this.operation = {
            process: 'ADD'
        }        

        this.incidentOpen = !this.incidentOpen;
    }

    showEditModal(data: any) {
        const { agencyDefinedGroup, code, id, sysmgr, view } = this.user;

        var newPass = {
            agencyDefinedGroup: agencyDefinedGroup,
            code: code,
            id: id,
            sysmgr: sysmgr,
            view: view,
            operation: 'UPDATE',
            recordNo: data.recordNumber
        }

        this.operation = {
            process: 'UPDATE'
        }

        console.log(newPass);
        
        this.incidentRecipient = newPass;
        this.incidentOpen = !this.incidentOpen;
    }
    
    reload(data: any){
        this.search(this.user);
    }

    delete(data: any) {
        
    }

    save(){

    }
}
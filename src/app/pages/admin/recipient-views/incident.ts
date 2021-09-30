import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, ClientService } from '@services/index';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { ReportsAdmin } from '@admin/reports';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        th.action{
            width: 12rem !important;
        }
        
    `],
    templateUrl: './incident.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientIncidentAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    checked: boolean = false;
    isDisabled: boolean = false;
    loading: boolean = false;
    incidentOpen: boolean = false;

    incidentRecipient: any;
    Reports: ReportsAdmin
    operation: any; 
    btnid: string
    id: string
    

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute
        
        
        
    ) {

        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'incidents')) {
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

    search(user: any = this.user) {

        this.loading = true;
        this.clientS.getincidents(user.id).subscribe(data => {
            this.tableData = data.list;
            this.loading = false;
            this.detectChanges();
        });


        this.incidentRecipient = {
            agencyDefinedGroup: user.agencyDefinedGroup,
            code: user.code,
            id: user.id,
            sysmgr: user.sysmgr,
            view: user.view,
            operation: 'ADD',
            recordNo: 0
        };

        //this.incidentRecipient = this.user;
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

    detectChanges(){
        this.cd.markForCheck();
        this.cd.detectChanges();        
    }


    buildForm() {
        this.inputForm = this.formBuilder.group({
            autoLogout: [''],
            emailMessage: false,
            excludeShiftAlerts: false,
            ExcludeFromTravelinterpretation:false,
            inAppMessage: false,
            logDisplay: false,
            pin: [''],
            staffTimezoneOffset:[''],
            rosterPublish: false,
            shiftChange: false,
            smsMessage: false
        });
    }

    onKeyPress(data: KeyboardEvent) {
        return this.globalS.acceptOnlyNumeric(data);
    }

    trackByFn(index, item) {
        return item.id;
    }

    save() {
        const group = this.inputForm;

        this.timeS.updatetimeandattendance({
            AutoLogout: group.get('autoLogout').value,
            EmailMessage: group.get('emailMessage').value,
            ExcludeShiftAlerts: group.get('excludeShiftAlerts').value,
            ExcludeFromTravelinterpretation:group.get('excludeFromTravelinterpretation').value,
            InAppMessage: group.get('inAppMessage').value,
            LogDisplay: group.get('logDisplay').value,
            Pin: group.get('pin').value,
            StaffTimezoneOffset:group.get('staffTimezoneOffset').value,
            RosterPublish: group.get('rosterPublish').value,
            ShiftChange: group.get('shiftChange').value,
            SmsMessage: group.get('smsMessage').value,
            Id: this.user.id
        }).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.globalS.sToast('Success', 'Change successful');
            this.inputForm.markAsPristine();            
            return;            
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
        
        this.incidentRecipient = newPass;
        this.incidentOpen = !this.incidentOpen;
    }

    reload(data: any){
        this.search(this.user);
    }

    delete(data: any) {
        this.timeS.deleteincident(data.recordNumber)
            .subscribe(data => {
                this.search();
                this.globalS.sToast('Success','Incident has been deleted')
            });
    }
 
    closeincidentstatus(data: any) {
        
        this.timeS.UpdateIncidentstatus(data.recordNumber)
            .subscribe(data => this.search());
    }
    
    Incidentlisting(){
      
        console.log(this.globalS.var1)
       this.router.navigate(['/admin/reports'])

       this.globalS.var1 = 'IncidentRegister';

       console.log(this.globalS.var1)
     /*   this.router.navigate(['/admin/reports'],{
            queryParams:{
                id :'incidentregister'
            }

        }); */
  
    }  
}
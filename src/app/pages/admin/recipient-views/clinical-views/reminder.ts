import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService, dateFormat } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { RECIPIENT_OPTION, ModalVariables, ProcedureRoster, UserToken, CallAssessmentProcedure, Consents } from '@modules/modules';

import format from 'date-fns/format';

@Component({
    selector: '',
    templateUrl: './reminder.html',
    styles:[`
    h4{
        margin-top:10px;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClinicalReminder implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    loading: boolean = false;

    consentOpen: boolean = false;
    consentGroup: FormGroup;
    reminderList: Array<any> = [];

    addOREdit: number;

    lists: Array<any>;

    dateFormat: string = dateFormat;
    
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
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'reminder')) {
                console.log('sasd')
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();        
        this.buildForm();
        this.search(this.user);

        this.listDropDowns()
    }

    buildForm(){
        this.consentGroup = this.formBuilder.group({
            recordNumber: null,
            personID: null,
            consent: '',
            notes: '',
            expiryDate: null
         })

        setTimeout(() => {
            this.consentGroup.controls['consent'].enable();
        }, 0);
    }

    trackByFn(index, item) {
        return item.id;
    }

    resetAll(){
        this.search();
    }

    consentProcess(){
        const group = this.consentGroup.value;
        // console.log(format(group.expiryDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));
        // this.competencyGroup.controls['mandatory'].setValue((this.competencyGroup.value.mandatory == null) ? false : this.competencyGroup.value.mandatory)
        let _consentGroup: Consents = {
            recordNumber: group.recordNumber,
            personID: this.user.id,
            notes: group.notes,
            date1: group.expiryDate ? group.expiryDate : null,
            name: group.consent
        }

        console.log(_consentGroup);
        // return;

        if(this.addOREdit == 0){            
            this.timeS.postconsents(_consentGroup).subscribe(data => {
                if(data){
                    this.resetAll();
                    this.globalS.sToast('Success','Consent Inserted');
                    this.handleCancel();
                }
            })
        }

        if(this.addOREdit == 1){
            this.timeS.updateconsents(_consentGroup).subscribe(data => {
                if(data){
                    this.resetAll();
                    this.globalS.sToast('Success','Consent Updated');
                    this.handleCancel();
                }
            })
        }
    }

    showAddModal() {
        this.addOREdit = 0;
        this.buildForm();
        this.consentOpen = true;
        this.listDropDowns();

    
    }

    listDropDowns(){
        this.listS.getconsents(this.user.id).subscribe(data => this.lists = data)
    }


    updateconsentmodal(data: any){

        this.consentOpen = true;
        this.addOREdit = 1;
        
        this.lists = [data.consent];

        this.consentGroup.patchValue({
            recordNumber: data.recordNumber,
            personID: data.personID,
            consent: data.consent,
            notes: data.notes,
            expiryDate: data.expiryDate
        });

        // this.consentGroup.controls['consent'].disable();
    }

    deleteconsent(data: any){
        this.timeS.deleteconsents(data.recordNumber)
                    .subscribe(data => {
                        if(data){
                            this.resetAll();
                            this.globalS.sToast('Success','Consent Deleted')
                        }
                    })
    }

    search(user: any = this.user){
        this.cd.reattach();
        this.loading = true;

        this.listS.getclinicalreminder(user.id).subscribe(reminders => {
            this.loading = false;
            this.reminderList = reminders;
            this.cd.markForCheck();
        })        
    }

    ngOnDestroy(): void {

    }

    handleCancel(){
        this.consentOpen = false;
    }

    handleOk(){

    }
}
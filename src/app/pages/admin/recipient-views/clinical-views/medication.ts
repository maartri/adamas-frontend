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
    templateUrl: './medication.html',
    styles:[`
    h4{
        margin-top:10px;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClinicalMedication implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    loading: boolean = false;

    consentOpen: boolean = false;
    inputForm: FormGroup;
    medicationList: Array<any> = [];

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
            if (this.globalS.isCurrentRoute(this.router, 'medication')) {
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
        this.inputForm = this.formBuilder.group({
            recordNumber: '',
            personID: '',
            list: '',
         })
    }

    trackByFn(index, item) {
        return item.id;
    }

    resetAll(){
        this.search();
    }

    mediactionProcess(){
        const group = this.inputForm.value;
        const {list,recordNumber } = this.inputForm.value;
        if(this.addOREdit == 0){            
            this.timeS.postclinicalmedication({PersonID:this.user.id,Description: list}).subscribe(data => {
                if(data){
                    this.resetAll();
                    this.globalS.sToast('Success','data Inserted');
                    this.handleCancel();
                }
            })
        }

        if(this.addOREdit == 1){
            this.timeS.updateclinicalmedication({description: list,PersonID:this.user.id,recordNumber:recordNumber
              },recordNumber).subscribe(data => {
                if(data){
                    this.resetAll();
                    this.globalS.sToast('Success','data Updated');
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
        this.listS.getmedication(this.user.id).subscribe(data => this.lists = data)
    }


    updateconsentmodal(data: any){

        this.consentOpen = true;
        this.addOREdit = 1;
        
        this.lists = [data.consent];

        this.inputForm.patchValue({
            recordNumber: data.recordNumber,
            personID: data.personID,
            list: data.description,
        });
    }

    deleteconsent(data: any){
        this.timeS.deleteclinicalmedication(data.recordNumber)
                    .subscribe(data => {
                        if(data){
                            this.resetAll();
                            this.globalS.sToast('Success','Medication Deleted')
                        }
                    })
    }

    search(user: any = this.user){
        this.cd.reattach();
        this.loading = true;

        this.listS.getclinicalmedications(user.id).subscribe(medication => {
            this.loading = false;
            this.medicationList = medication;
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
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { AlertCompetency } from '@modules/modules';

@Component({
    selector: '',
    templateUrl: './alerts.html',
    styles:[`
    .form-group button{
        float: right;
        margin: 0 10px 1rem 0;
    }
    h4{
        margin-top:10px;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IntakeAlerts implements OnInit, OnDestroy {
    
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    loading: boolean = false;
    alertOpen: boolean = false;

    addOREdit: number;
    inputForm: FormGroup;
    tableData: Array<any> = [];
    alist: Array<any> = [];

    alertGroup: FormGroup;
    competencyGroup: FormGroup;

    competencies: Array<any>

    competenciesListArr: Array<any>;

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
            if (this.globalS.isCurrentRoute(this.router, 'alerts')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();        
        this.buildForm();
        this.search(this.user);

        this.reloadAll()
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    trackByFn(index, item) {
        return item.id;
    }


    search(user: any = this.user) {
        this.cd.reattach();

        this.loading = true;
        forkJoin([
            this.timeS.gethealthalerts(user.id),
            this.timeS.getrosteralerts(user.id),
            this.timeS.getspecificcompetencies(user.id)
        ]).pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {
                this.loading = false

                this.alertGroup.patchValue({
                    safetyAlert: data[0].data,
                    rosterAlert: data[1].data
                });

                this.competencies = data[2];
                this.cd.markForCheck();
            });
    }

    buildForm() {
        this.alertGroup = this.formBuilder.group({
            safetyAlert: '',
            rosterAlert: ''
        })

        this.competencyGroup = this.formBuilder.group({
            competencyValue: '',
            mandatory: false,
            notes: '',
            personID: '',
            recordNumber: 0
        })
    }

    updateHealthAlert(){
        this.timeS.updatehealthalerts(this.alertGroup.value.safetyAlert, this.user.id ).pipe(
        takeUntil(this.unsubscribe)).subscribe(data => {
                        if(data){
                            this.globalS.sToast('Success','Alert Updated')
                        }
                    })
    }

    updateRosterAlert(){
        this.timeS.updaterosteralerts(this.alertGroup.value.rosterAlert, this.user.id ).pipe(
        takeUntil(this.unsubscribe)).subscribe(data => {
                        if(data){
                            this.globalS.sToast('Success','Alert Updated')
                        }
                    });
    }

    save() {

    }

    showEditModal(index: number) {

    }

    delete(index: number) {

    }

    handleCancel() {
        this.alertOpen = false;
    }

    handleOk(){

    }

    reloadAll(){
        this.search();
        this.dropDowns();
    }

    dropDowns(){
        this.listS.getintakecompetencies(this.user.uniqueID).pipe(takeUntil(this.unsubscribe)).subscribe(data => this.competenciesListArr = data)
    }

    competencyProcess(){
        this.competencyGroup.controls['personID'].setValue(this.user.id)

        const competency = this.competencyGroup.value;
        this.competencyGroup.controls['mandatory'].setValue((this.competencyGroup.value.mandatory == null) ? false : this.competencyGroup.value.mandatory)
        this.competencyGroup.controls['notes'].setValue((this.competencyGroup.value.notes == null) ? '' : this.competencyGroup.value.notes)
        if(this.addOREdit == 0){
                this.timeS.postintakecompetency(this.competencyGroup.value)
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Competency Added');
                        this.search();
                        this.handleCancel();
                    });
        }
        if(this.addOREdit == 1){
            console.log(this.addOREdit);
            this.timeS.updateintakecompetency(competency).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
                            if(data){
                                this.globalS.sToast('Success','Competency Updated')
                                this.search();
                                this.handleCancel()    
                            }
            });
        }
    }

    showAddModal() {
        this.addOREdit = 0;
        this.clearForm();
        this.alertOpen = true;
    }

    clearForm(){
        this.competencyGroup.reset();
    }

    deletecompetency(data: any){
        this.timeS.deleteintakecompetency(data.recordNumber).pipe(
        takeUntil(this.unsubscribe)).subscribe(data => {
                        if(data){
                            this.reloadAll()
                            this.globalS.sToast('Success','Competency Deleted')
                        }
                    })
    }

    updatecompetency(data: any){
        this.addOREdit = 1;

        this.alertOpen = true;

        this.competencyGroup.patchValue({
            competencyValue: data.competency,
            mandatory: data.mandatory,
            notes: data.notes,
            recordNumber: data.recordNumber
        })
    }
}
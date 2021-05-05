import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService,dateFormat } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
    selector: '',
    templateUrl: './groups.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IntakeGroups implements OnInit, OnDestroy {

    private unsubscribe: Subject<void> = new Subject();
    user: any;
    loading: boolean = false;
    modalOpen: boolean = false;

    definedOpen: boolean = false;   
    preferenceOpen: boolean = false;

    addOREdit: number;

    groupTypes: Array<any>;
    groupPreferences: Array<any>;

    userGroupForm: FormGroup;
    preferenceForm: FormGroup;
    dateFormat: string = dateFormat;
    dropDowns: {
        userGroups: Array<string>,
        preferences: Array<string>
    }

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
            if (this.globalS.isCurrentRoute(this.router, 'groups')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        this.search(this.user);
        this.buildForm();
        this.listDropDowns();
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
            this.timeS.getgrouptypes(user.id),
            this.timeS.getgrouppreferences(user.id)
        ]).subscribe(data => {
            this.loading = false;
            this.groupTypes = data[0];
            this.groupPreferences = data[1];
            this.cd.markForCheck();
        });
    }

    buildForm() {
        this.userGroupForm = this.formBuilder.group({
            group: new FormControl('', [Validators.required]),
            notes: new FormControl(''),
            personID: new FormControl(''),
            recordNumber: new FormControl(0),
            alert: new FormControl(false),
            date1: new FormControl(null),
            date2: new FormControl(null),
            email: new FormControl(null),
         })
         
         this.preferenceForm = this.formBuilder.group({
            preference: new FormControl('', [Validators.required]),
            notes: new FormControl(''),
            personID: new FormControl(''),
            recordNumber: new FormControl(0)
         })
    }

    save() {

    }


    delete(index: number) {

    }

    handleCancel(view: number) {
        
        this.addOREdit = 1;
        if (view == 1){
            this.definedOpen = false;
            this.userGroupForm.reset();
        }else{
            this.preferenceOpen = false;
            this.preferenceForm.reset();
        }
    }

    reloadAll(){
        this.search()
        this.listDropDowns()
    }

    listDropDowns(){
        forkJoin([
            this.listS.getusergroup(this.user.id),
            this.listS.getrecipientpreference(this.user.id)
        ]).subscribe(data => {
            this.loading = false;
            this.dropDowns = {
                userGroups: data[0],
                preferences: data[1]
            }
        });
    }

    showAddModal(view: number) {
        this.addOREdit = 1;
        if (view == 1){
            this.userGroupForm.reset();
            this.definedOpen = true;
        }else{
            this.preferenceForm.reset();
            this.preferenceOpen = true;
        }
    }

    updateUserGroup(data: any){
        this.addOREdit = 2;
        this.definedOpen = true;
        this.userGroupForm.patchValue({
            group: data.group,
            notes: data.notes,
            alert: data.mobileAlert,            
            date1: data.date1,
            date2: data.date2,
            email: data.email,
            recordNumber: data.recordNumber,
        })
    }
    deleteUserGroup(data: any){
        this.timeS.deleteusergroup(data.recordNumber).subscribe(data =>{
            if(data){
                this.reloadAll()
                this.globalS.sToast('Success','Data Deleted')
            }
        })
    }
    userGroupProcess(){
        this.userGroupForm.controls['personID'].setValue(this.user.id)
        const userGroup = this.userGroupForm.value;
        if(this.addOREdit == 1){
            this.timeS.postusergroup(userGroup)
                        .subscribe(data => {
                            if(data){
                                this.reloadAll()
                                this.globalS.sToast('Success','Data Inserted')
                                this.handleCancel(1);
                            }
                        })
        }

        if(this.addOREdit == 2){
            this.timeS.updateusergroup(userGroup)
                .subscribe(data => {
                    if(data){
                        this.reloadAll()
                        this.globalS.sToast('Success','Data Updated')
                        this.handleCancel(1);
                    }
                })
        }
    }

    preferenceProcess(){
        this.preferenceForm.controls['personID'].setValue(this.user.id)

        const preferences = this.preferenceForm.value;

        if(this.addOREdit == 1){
            this.timeS.postrecipientpreference(preferences)
                        .subscribe(data => {
                            if(data){
                                this.reloadAll()
                                this.globalS.sToast('Success','Data Inserted')
                                this.handleCancel(2);
                            }
                        })
        }

        if(this.addOREdit == 2){
            this.timeS.updateusrecipientpreference(preferences)
                .subscribe(data => {
                    if(data){
                        this.reloadAll()
                        this.globalS.sToast('Success','Data Updated')
                        this.handleCancel(2);
                    }
                })
        }
    }

    updatePreference(data: any){
        this.addOREdit = 2;
        this.preferenceOpen = true;

        this.preferenceForm.patchValue({
            preference: data.preference,
            notes: data.notes,
            recordNumber: data.recordNumber
        })
    }

    handleOk(){

    }

    deletePreference(data: any){
        this.timeS.deleterecipientpreference(data.recordNumber)
                    .subscribe(data =>{
                        if(data){
                            this.reloadAll()
                            this.globalS.sToast('Success','Data Deleted')
                        }
                    })
    }
    
}
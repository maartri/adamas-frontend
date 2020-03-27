import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        nz-form-item{
            margin:0;
        }
        nz-select{
            width:100%;
        }
        a:hover{
            text-decoration:underline;
        }
    `],
    templateUrl: './groupings.html'
})


export class StaffGroupingsAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;

    loading: boolean = false;
    userdefined1: Array<any>;
    userdefined1List: Array<string>;
    userdefined2: Array<any>;
    userdefined2List: Array<any>;

    modalOpen: boolean = false;
    isLoading: boolean = false;
    whatView: number;

    inputForm: FormGroup;

    listArray: Array<any>;
    
    private editOrAdd: number;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'groupings-preferences')) {
                this.search();
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked()
        this.search();
        this.buildForm();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            list: ['', Validators.required],
            notes: ['', Validators.required],
            id: ['']
        });
    }

    get title() {
        const str = this.whatView == 1 ? 'Group' : 'Preference';
        const pro = this.editOrAdd == 1 ? 'Add' : 'Edit';
        return `${pro} ${str}`;
    }

    search() {
        //if (!this.user) return;
        this.loading = true;

        forkJoin([
            this.timeS.getuserdefined1(this.user.id),
            this.timeS.getuserdefined2(this.user.id),
            this.listS.getlistuserdefined1(),
            this.listS.getlistuserdefined2()
        ]).subscribe(data => {
            this.loading = false;

            this.userdefined1 = data[0];
            this.userdefined2 = data[1];

            this.userdefined1List = data[2];
            this.userdefined2List = data[3];
        });
    }

    showAddModal(view: number) {
        if (view == 1) this.listArray = this.userdefined1List;
        if (view == 2) this.listArray = this.userdefined2List;

        this.whatView = view;
        this.editOrAdd = 1;
        this.modalOpen = true;
    }

    showEditModal(view: number, index: number) {

        if (view == 1) {
            const { group, notes, recordNumber } = this.userdefined1[index];

            this.inputForm.patchValue({
                list: group,
                notes: notes,
                id: recordNumber
            });

            this.listArray = this.userdefined1List;
        }

        if (view == 2) {
            const { preference, notes, recordNumber } = this.userdefined2[index];

            this.inputForm.patchValue({
                list: preference,
                notes: notes,
                id: recordNumber
            });

            this.listArray = this.userdefined2List;
        }
        
        this.whatView = view;
        this.editOrAdd = 2;
        this.modalOpen = true;
    }

    handleCancel() {
        this.inputForm.reset();
        this.isLoading = false;
        this.modalOpen = false;
    }

    trackByFn(index, item) {
        return item.id;
    }

    success() {
        this.search();
        this.isLoading = false;
    }

    processBtn() {
        if (this.editOrAdd == 1) {
            this.save();
        }

        if (this.editOrAdd == 2) {
            this.edit();
        }
    }

    save() {
        for (const i in this.inputForm.controls) {
            this.inputForm.controls[i].markAsDirty();
            this.inputForm.controls[i].updateValueAndValidity();
        }

        if (!this.inputForm.valid)
            return;
        
        const { list, notes } = this.inputForm.value;
        const index = this.whatView;
        this.isLoading = true;

        if (index == 1) {            
            this.timeS.postuserdefined1({
                notes: notes,
                group: list,
                personID: this.user.id
            }).pipe(takeUntil(this.unsubscribe))
                .subscribe(data => {
                    if (data) {
                        this.handleCancel();
                        this.success();
                        this.globalS.sToast('Success', 'Data Added');
                    }
                })
        }

        if (index == 2) {
            this.timeS.postuserdefined2({
                notes: notes,
                group: list,
                personID: this.user.id
            }).pipe(takeUntil(this.unsubscribe))
                .subscribe(data => {
                    if (data) {
                        this.handleCancel();
                        this.success();
                        this.globalS.sToast('Success', 'Data Added');
                    }
                })
        }
    }

    edit() {

        for (const i in this.inputForm.controls) {
            this.inputForm.controls[i].markAsDirty();
            this.inputForm.controls[i].updateValueAndValidity();
        }

        if (!this.inputForm.valid)
            return;

        const { list, notes, id } = this.inputForm.value;
        const index = this.whatView;
        this.isLoading = true;

        if (index == 1) {
            this.timeS.updateshareduserdefined({
                group: list,
                notes,
                recordNumber: id
            }).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    if (data) {
                        this.handleCancel();
                        this.success();
                        this.globalS.sToast('Success', 'Data Updated');
                    }
                })
        }

        if (index == 2) {
            this.timeS.updateshareduserdefined({
                group: list,
                notes,
                recordNumber: id
            }).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    if (data) {
                        this.handleCancel();
                        this.success();
                        this.globalS.sToast('Success', 'Data Updated');
                    }
                })
        }
    }

    delete(recordNo: any) {
        this.timeS.deleteshareduserdefined(recordNo)
            .subscribe(data => {
                if (data) {
                    this.handleCancel();
                    this.success();
                    this.globalS.sToast('Success', 'Data Deleted');
                }
            });
    }

}
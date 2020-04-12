import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        nz-select{
            width:100%;
        }
    `],
    templateUrl: './position.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffPositionAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    modalOpen: boolean = false;
    isLoading: boolean = false;
    inputForm: FormGroup;
    tableData: Array<any>;
    lists: Array<any>;

    dateFormat: string = 'MMM dd yyyy';
    editOrAdd: number;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
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
            if (this.globalS.isCurrentRoute(this.router, 'position')) {
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        this.search(this.user);
        this.buildForm();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            personID: [''],
            position: ['', [Validators.required]],
            startDate: null,
            endDate: null,
            dates: [[], [Validators.required]],
            positionID: [''],
            notes: [''],
            recordNumber: ['']
        });
    }

    get title() {
        const pro = this.editOrAdd == 1 ? 'Add' : 'Edit';
        return `${pro} Position`;
    }

    search(user: any = this.sharedS.getPicked()) {
        this.cd.reattach();

        this.isLoading = true;
        this.timeS.getstaffpositions(user.id)
            .subscribe(data => {
                this.tableData = data;
                this.isLoading = false;
                this.cd.detectChanges();
            })

        this.listS.getlistpositions()
            .subscribe(data => this.lists = data)
    }

    showAddModal() {
        this.editOrAdd = 1;
        this.modalOpen = true;
    }

    trackByFn(index, item) {
        return item.id;
    }

    save() {

        for (const i in this.inputForm.controls) {
            this.inputForm.controls[i].markAsDirty();
            this.inputForm.controls[i].updateValueAndValidity();
        }

        if (!this.inputForm.valid)
            return;

        const { position, dates, positionID, notes, recordNumber } = this.inputForm.value;

        const inputForm = {
            personID: this.user.id,
            position: position,
            startDate: dates[0],
            endDate: dates[1],
            positionID: positionID,
            notes: notes,
            recordNumber: recordNumber
        }

        this.isLoading = true;

        if(this.editOrAdd == 1){
            this.timeS.poststaffpositions(inputForm).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.handleCancel();
                        this.success();
                        this.globalS.sToast('Success', 'Data Deleted');
                    }
                })
        }

        if (this.editOrAdd == 2) {
            this.timeS.updatestaffpositions(inputForm, inputForm.recordNumber).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.handleCancel();
                        this.success();
                        this.globalS.sToast('Success', 'Data Updated');
                    }                    
                })
        }
    }   

    handleCancel() {
        this.inputForm.reset();
        this.isLoading = false;
        this.modalOpen = false;
    }

    success() {
        this.search();
        this.isLoading = false;
    }

    delete({ recordNumber }) {
        this.timeS.deletestaffpositions(recordNumber)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {
                if (data) {
                    this.handleCancel();
                    this.success();
                    this.globalS.sToast('Success', 'Data Deleted');
                }
            });
    }

    showEditModal(index: number) {
        console.log(this.tableData[index]);

        const { position, startDate, endDate, positionID, notes, personID, recordNumber  } = this.tableData[index];

        this.inputForm.patchValue({
            position: position,
            positionID: positionID,
            notes: notes,
            dates: [startDate, endDate],
            recordNumber,
            personID
        });

        this.editOrAdd = 2;
        this.modalOpen = true;
    }
}
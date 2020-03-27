import { Component, OnInit, OnDestroy, Input } from '@angular/core'

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
    templateUrl: './position.html'
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
            if (this.globalS.isCurrentRoute(this.router, 'position')) {
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
            personID: [''],
            position: [''],
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

    search() {
        this.timeS.getstaffpositions(this.user.id)
            .subscribe(data => {
                this.tableData = data;
            })

        this.listS.getlistpositions()
            .subscribe(data => this.lists = data)
    }

    showAddModal() {
        this.editOrAdd = 1;
        this.modalOpen = true;
    }

    showEditModal() {
        this.editOrAdd = 2;
        this.modalOpen = true;
    }

    trackByFn(index, item) {
        return item.id;
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
        console.log(this.inputForm.value)
        for (const i in this.inputForm.controls) {
            this.inputForm.controls[i].markAsDirty();
            this.inputForm.controls[i].updateValueAndValidity();
        }

        if (!this.inputForm.valid)
            return;

        const { position, dates, positionID, notes } = this.inputForm.value;
        const inputForm = {
            personID: this.user.id,
            position: position,
            startDate: dates[0],
            endDate: dates[1],
            positionID: positionID,
            notes: notes,
            recordNumber:''
        }        
        this.isLoading = true;

        this.timeS.poststaffpositions(inputForm).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.handleCancel();
                    this.success();
                    this.globalS.sToast('Success', 'Data Deleted');
                }                
            })
    }

    edit() {
        for (const i in this.inputForm.controls) {
            this.inputForm.controls[i].markAsDirty();
            this.inputForm.controls[i].updateValueAndValidity();
        }

        if (!this.inputForm.valid)
            return;

        // const { list, notes, id } = this.inputForm.value;
        // const index = this.whatView;
        // this.isLoading = true;
    }

    handleCancel() {
        this.inputForm.reset();
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
}
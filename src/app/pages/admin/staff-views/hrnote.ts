import { Component, OnInit, OnDestroy, Input } from '@angular/core'

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
        nz-select{
            width:100%;
        }
        label.chk{
            position: absolute;
            top: 1.5rem;
        }
    `],
    templateUrl: './hrnote.html'
})


export class StaffHRAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    modalOpen: boolean = false;
    addORView: number = 1;
    categories: Array<any>;

    dateFormat: string = 'dd/MM/yyyy';
    isLoading: boolean = false;
    
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'hr-note')) {
                this.user = data;
                this.search(this.user);
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
            notes: '',
            isPrivate: false,
            alarmDate: null,
            whocode: '',
            recordNumber: null,
            category: ['', [Validators.required]]
        });
    }

    populate(): void{
        this.listS.getlisthr().subscribe(data => this.categories = data)
    }

    search(user: any = this.user) {
        this.timeS.gethrnotes(user.code).subscribe(data => {
            this.tableData = data;
        });

        this.populate();
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.addORView = 1;
        this.modalOpen = true;
    }

    showEditModal(index: any) {
        
        this.addORView = 2;
        const { alarmDate, detail, isPrivate, category, creator, recordNumber } = this.tableData[index];

        this.inputForm.patchValue({
            notes: detail,
            isPrivate: isPrivate,
            alarmDate: alarmDate,
            whocode: creator,
            recordNumber: recordNumber,
            category: category
        });

        this.modalOpen = true;
    }

    save() {
        if (!this.globalS.IsFormValid(this.inputForm))
            return;        
    
        this.inputForm.controls["whocode"].setValue(this.user.code);

        this.timeS.posthrnotes(this.inputForm.value, this.user.id).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Note saved');
                    this.search();
                    this.handleCancel();
                    return;
                }
            });
    }

    handleCancel() {
        this.modalOpen = false;
        this.inputForm.reset({
            notes: '',
            isPrivate: false,
            alarmDate: null,
            whocode: '',
            recordNumber: null,
            category: null
        });
        this.isLoading = false;
    }
}
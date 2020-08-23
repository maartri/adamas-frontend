import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

import format from 'date-fns/format';

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
    templateUrl: './hrnote.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

    
export class StaffHRAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;
    loading: boolean = false;

    modalOpen: boolean = false;
    addORView: number = 1;
    categories: Array<any>;

    dateFormat: string = 'dd/MM/yyyy';
    isLoading: boolean = false;

    private default = {
        notes: '',
        isPrivate: false,
        alarmDate: null,
        whocode: '',
        recordNumber: null,
        category: null
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
                    this.router.navigate(['/staff-direct/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'hr-note')) {
                this.cd.reattach();
                console.log(data);
                this.user = data;
                this.search(this.user);
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
        this.router.navigate(['/staff-direct/staff/personal'])
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
        this.listS.getlisthr().pipe(takeUntil(this.unsubscribe)).subscribe(data => this.categories = data)
    }

    search(user: any = this.user) {
        this.cd.reattach();
        
        this.loading = true;
        this.timeS.gethrnotes(user.code).pipe(delay(200),takeUntil(this.unsubscribe)).subscribe(data => {
            this.tableData = data;
            this.loading = false;
            this.cd.detectChanges()
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
    
        const cleanDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(
            this.inputForm.get('alarmDate').value);
        
        this.inputForm.controls["alarmDate"].setValue(cleanDate);
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
        this.inputForm.reset(this.default);
        this.isLoading = false;
    }
}
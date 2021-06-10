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
        div.divider-subs div{
            margin-top:1rem;
        }
    `],
    templateUrl: './pension.html'
})


export class RecipientPensionAdmin implements OnInit, OnDestroy {
    
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    pensionForm: FormGroup;

    checked: boolean = false;
    isDisabled: boolean = false;

    alist: Array<any> = [];
    blist: Array<any> = [];
    clist: Array<any> = [];
    dlist: Array<any> = [];

    dateFormat: string = 'dd/MM/yyyy';

    modalOpen: boolean = false;
    addOREdit: number;
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
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'insurance-pension')) {
                this.user = data;
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

    search(user: any = this.user) {
        
        this.timeS.getinsurance(user.id).subscribe(data => {
            this.inputForm.patchValue({
                medicareNumber: data.medicareNumber,
                medicareExpiry: data.medicareExpiry,
                medicareRecipientID: data.medicareRecipientID,
                pensionStatus: data.pensionStatus,
                concessionNumber: data.concessionNumber,
                dvaNumber: data.dvaNumber,
                ambulanceType: data.ambulanceType,
                haccDvaCardHolderStatus: data.haccdvaCardholderStatus,
                dvaBenefits: data.dvaBenefits,
                pensionVoracity: data.pensionVoracity,
                ambulance: data.ambulance,
                dateofDeath: data.dateOfDeath,
                willAvailable: data.willAvailable,
                whereWillHeld: data.whereWillHeld,
                funeralArrangements: data.funeralArrangements
            });
        });

        
        this.listS.getpension(this.user.id).subscribe(data => this.blist = data);

        this.listS.getpensionall().subscribe(data => this.clist = data);
        this.listS.getcardstatus().subscribe(data => this.dlist = data)

        this.getpension();
    }

    getpension() {
        this.timeS.getpension(this.user.id).subscribe(data => this.alist = data);
    }

    showAddModal() {
        this.addOREdit = 1;
        this.modalOpen = true;
    }

    edit(index: number) {
        const { recordNumber, personID, name, address1, address2, notes } = this.alist[index]
        
        this.pensionForm.patchValue({
            recordNumber,
            personID,
            name,
            address1,
            address2,
            notes
        });

        this.addOREdit = 0;
        this.modalOpen = true;
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            personID: '',
            medicareNumber: '',
            medicareExpiry: null,
            medicareRecipientID: '',
            pensionStatus: '',
            concessionNumber: '',
            dvaNumber: '',
            ambulanceType: '',
            haccDvaCardHolderStatus: '',
            dvaBenefits: false,
            pensionVoracity: false,
            ambulance: false,
            dateofDeath: null,
            willAvailable: '',
            whereWillHeld: '',
            funeralArrangements: ''
        });

        this.pensionForm = this.formBuilder.group({
            recordNumber: null,
            personID: null,
            name: null,
            address1: null,
            address2: null,
            notes: null
        });
    }

    onKeyPress(data: KeyboardEvent) {
        return this.globalS.acceptOnlyNumeric(data);
    }

    delete(index: number) {
        const { recordNumber } = this.alist[index];

        this.timeS.deletespension(recordNumber)
            .subscribe(data => {
                this.globalS.sToast('Success', 'Data Deleted');
                this.handleCancel();
                this.getpension();
            });
    }

    save() {
        const input = this.inputForm.value;

        const medicareExpiry = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(input.medicareExpiry);
        const dateofDeath = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(input.dateofDeath);

        this.inputForm.patchValue({
            medicareExpiry,
            dateofDeath
        });

        this.timeS.updateinsurance(this.inputForm.value, this.user.id)
            .subscribe(data => {
                this.globalS.sToast('Success', 'Data Updated');
                this.inputForm.markAsPristine();
            });
    }

    savePension() {
        if (!this.globalS.IsFormValid(this.pensionForm))
            return;
        
        this.isLoading = true;
        
        if (this.addOREdit == 1) {
            this.pensionForm.controls["personID"].setValue(this.user.id)
            this.timeS.postpension(this.pensionForm.value)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data Inserted');
                    this.getpension();
                    this.handleCancel();
                });
        }

        if (this.addOREdit == 2) {
            this.timeS.updatepension(this.pensionForm.value)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data Inserted');
                    this.getpension();
                    this.handleCancel();
                });
        }
    }

    handleCancel() {
        this.pensionForm.reset();
        this.modalOpen = false;
        this.isLoading = false;
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
}
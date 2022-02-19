import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, recurringInt, recurringStr, PrintService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Reminders } from '@modules/modules';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { isSameDay } from 'date-fns';
import { cs_CZ } from 'ng-zorro-antd';
@Component({
    selector: '',
    templateUrl: './alert.html',
    styles: [`
    h4{
        margin-top:10px;
    }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClinicalAlert implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    modalOpen: boolean = false;
    addOREdit: number;
    isLoading: boolean = false;
    lists: Array<any> = [];
    dateFormat: string = 'dd/MM/yyyy';

    dayInt = recurringInt;
    dayStr = recurringStr;

    private default: any = {
        recordNumber:0,
        personID: '',
        listOrder: '',
        followUpEmail: '',
        recurring: false,
        recurrInt: '',
        recurrStr: '',
        notes: '',
        reminderDate: null,
        dueDate: null,
        staffAlert: ''
    }
    loading: boolean = false;
    ModalS: any;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean = false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report';
    selectedReminders: any;
    remindersList: any;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private printS: PrintService,
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
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
            if (this.globalS.isCurrentRoute(this.router, 'reminders')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA) : this.globalS.decode();
        this.user = this.sharedS.getPicked();
        this.loading = false;
        if (this.user) {
            this.search(this.user);
            this.buildForm();
            return;
        }
        this.router.navigate(['/admin/staff/personal'])
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {

        this.inputForm = this.formBuilder.group({
            recordNumber: 0,
            personID: '',
            listOrder: '',
            followUpEmail: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
            recurring: false,
            recurrInt: '',
            recurrStr: '',
            notes: '',
            reminderDate: null,
            dueDate: null,
            staffAlert: ['', [Validators.required]]
        });

        this.inputForm.controls['recurrStr'].disable();
        this.inputForm.controls['recurrInt'].disable();

        this.inputForm.get('recurring').valueChanges.subscribe(data => {
            if (!data) {
                this.inputForm.controls['recurrInt'].setValue(null)
                this.inputForm.controls['recurrStr'].setValue(null)
                this.inputForm.controls['recurrStr'].disable()
                this.inputForm.controls['recurrInt'].disable()
            } else {
                this.inputForm.controls['recurrStr'].enable()
                this.inputForm.controls['recurrInt'].enable()
            }
        })
    }

    resetForm() {
        this.inputForm.reset(this.default);
    }

    search(user: any = this.user) {
        this.cd.reattach();
        this.loading = true;
        this.listS.getclinicalalert(user.id).subscribe(reminders => {
            this.loading = false;
            this.tableData = reminders;
            this.cd.markForCheck();
        })
    }
    populateDropDowns() {
        this.listS.getalerts(this.user.id).subscribe(data => {
            this.remindersList = data.map(x => {
                return {
                    label: x,
                    value: x,
                    checked: false
                }
            });;
            this.cd.markForCheck();
        });
    }
    trackByFn(index, item) {
        return item.id;
    }
    logs(event: any) {
        this.selectedReminders = event;
    }
    process() {
        if (this.addOREdit == 1) {
            if ((this.addOREdit == 1 && this.selectedReminders === undefined) || (this.selectedReminders !== undefined && this.selectedReminders.length === 0)) {
                this.globalS.sToast('Success', 'Please Select Atleast One Reminder ');
                return
            }
            let data = {};
            let status = '';

            if (this.selectedReminders.length == 1) {
                data = {
                    PersonID: this.user.id,
                    Name: this.selectedReminders[0],
                    Notes: '',
                };
                status = "single";
            } else {
                data = {
                    PersonID: this.user.id,
                    Name: '',
                    Notes: '',
                    selectedReminders: this.selectedReminders,
                };
                status = "multi";
            }

            this.timeS.postclinicalalerts(data, status).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    this.inputForm.controls.staffAlert.setValue(this.selectedReminders[0]);
                    this.globalS.sToast('Success', 'Data added');
                    if (status == "single") {
                        this.addOREdit = 0;
                        this.cd.detectChanges();
                    } else {
                        this.handleCancel();
                        this.cd.detectChanges();
                    }
                })
        } else {
            const remGroup = this.inputForm.value;
            const reminderDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(remGroup.reminderDate);
            const dueDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(remGroup.dueDate);

            const reminder: Reminders = {
                recordNumber: remGroup.recordNumber,
                personID: this.user.id,
                name: remGroup.staffAlert,
                address1: remGroup.recurring ? remGroup.recurrInt : '',
                address2: remGroup.recurring ? remGroup.recurrStr : '',
                email: (remGroup.followUpEmail == null) ? '' : remGroup.followUpEmail,
                date1: reminderDate,
                date2: dueDate,
                state: "",
                notes: remGroup.notes,
                recurring: remGroup.recurring,
                sameDate: false,
                sameDay: false,
                creator: "SYSMGR",
            }
            this.timeS.updateclinicalalerts(reminder).pipe(
                takeUntil(this.unsubscribe))
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Data updated');
                    this.search();
                    this.handleCancel();
                })
        }
    }
    showAddModal() {
        this.populateDropDowns();
        this.modalOpen = true;
        this.resetForm();
        this.addOREdit = 1;
    }
    activateDomain(index: any) {

    }

    showEditModal(index: any) {
        this.addOREdit = 0;
        const { recordNumber, personID, alert, reminderDate, dueDate, address1, address2, recurring, state, email, notes } = this.tableData[index];

        this.inputForm.patchValue({
            recordNumber: recordNumber,
            personID: personID,
            staffAlert: alert,
            reminderDate: reminderDate,
            dueDate: dueDate,
            recurrInt: address1,
            recurrStr: address2,
            recurring: recurring,
            listOrder: state,
            followUpEmail: email,
            notes: notes
        });

        this.modalOpen = true;
    }

    delete(index: any) {
        this.timeS.deleteclinicalalerts(index).pipe(
            takeUntil(this.unsubscribe))
            .subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Data delted');
                    this.handleCancel();
                    this.search();

                }
            })
    }

    handleCancel() {
        this.inputForm.reset(this.default);
        this.isLoading = false;
        this.modalOpen = false;
        this.search();
    }
    handleOkTop() {
        this.generatePdf();
        this.tryDoctype = ""
        this.pdfTitle = ""
    }
    handleCancelTop(): void {
        this.drawerVisible = false;
        this.pdfTitle = ""
    }
    generatePdf() {

        this.drawerVisible = true;

        this.loading = true;

        var fQuery = "Select Name As Field1, CONVERT(varchar, [Date1],105) As Field2, CONVERT(varchar, [Date2],105) as Field3,Notes as Field4 From HumanResources  HR INNER JOIN Staff ST ON ST.[UniqueID] = HR.[PersonID] WHERE ST.[AccountNo] = '" + this.user.code + "' AND HR.DeletedRecord = 0 AND [Group] = 'STAFFALERT' ORDER BY  RecordNumber DESC";

        const data = {
            "template": { "_id": "0RYYxAkMCftBE9jc" },
            "options": {
                "reports": { "save": false },
                "txtTitle": "Staff Reminder List",
                "sql": fQuery,
                "userid": this.tocken.user,
                "head1": "Alert",
                "head2": "Reminder Date",
                "head3": "Expiry Date",
                "head4": "Notes",
            }
        }
        this.printS.printControl(data).subscribe((blob: any) => {
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
            this.loading = false;
            this.cd.detectChanges();
            this.ModalS.error({
                nzTitle: 'TRACCS',
                nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                nzOnOk: () => {
                    this.drawerVisible = false;
                },
            });
        });

        this.cd.detectChanges();
        this.loading = true;
        this.tryDoctype = "";
        this.pdfTitle = "";
    }
}
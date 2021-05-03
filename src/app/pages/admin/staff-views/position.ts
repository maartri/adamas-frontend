import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';

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
    loading: boolean = false;
    inputForm: FormGroup;
    tableData: Array<any>;
    lists: Array<any>;

    dateFormat: string = 'MMM dd yyyy';
    editOrAdd: number;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService,
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
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
        this.user = this.sharedS.getPicked();
        if(this.user){
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

    handleOkTop() {
        this.generatePdf();
        this.tryDoctype = ""
        this.pdfTitle = ""
    }
    handleCancelTop(): void {
        this.drawerVisible = false;
        this.pdfTitle = ""
    }
    generatePdf(){
        this.drawerVisible = true;
        
        this.loading = true;
        
        var fQuery = "Select Name As Field1, CONVERT(varchar, [Date1],105) As Field2, CONVERT(varchar, [Date1],105) As Field3, Address1 AS Field4, Notes as Field5 From HumanResources WHERE PersonID = '"+this.user.id+"' AND [Group] = 'STAFFPOSITION' ORDER BY  RecordNumber DESC";
        
        const headerDict = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        
        const requestOptions = {
            headers: new HttpHeaders(headerDict)
        };
        
        const data = {
            "template": { "_id": "0RYYxAkMCftBE9jc" },
            "options": {
                "reports": { "save": false },
                "txtTitle": "Staff Position List",
                "sql": fQuery,
                "userid":this.tocken.user,
                "head1" : "Position",
                "head2" : "start Date",
                "head3" : "start Date",
                "head4" : "Position Id",
                "head5" : "Notes",
            }
        }
        this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
            console.log(err);
            this.loading = false;
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
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

import format from 'date-fns/format';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
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
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService
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
            if (this.globalS.isCurrentRoute(this.router, 'hr-note')) {
                this.cd.reattach();
                console.log(data);
                this.user = data;
                this.search(this.user);
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
    delete(index: number){
        const { recordNumber } = this.tableData[index];
        this.timeS.deletehrnotes(recordNumber).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Note Deleted');
                    this.search();
                    this.handleCancel();
                }
            });
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
        
        var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,CONVERT(varchar, [EndDate],105) as Field3 from DataDomains WHERE Domain='BRANCHES'";
        
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
                "txtTitle": "HR NOTES List",
                "sql": fQuery,
                "userid":this.tocken.user,
                "head1" : "Sr#",
                "head2" : "Name",
                "head3" : "End Date",
            }
        }
        this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
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
        this.loading = true;
        this.tryDoctype = "";
        this.pdfTitle = "";
    }
}
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        nz-select{
            width:100%;
        }
        ul{
            list-style:none;
            padding:0;
        }
        li{
            padding:5px 0;
        }
    `],
    templateUrl: './leave.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffLeaveAdmin implements OnInit, OnDestroy {

    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    loading: boolean = false;
    modalOpen: boolean = false;
    dateFormat: string = 'MMM dd yyyy';
    isLoading: boolean;

    leaveGroup: FormGroup;

    putonLeaveModal: boolean = false;
    check : boolean = false;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    loadingPDF: boolean;
    ModalS: any;
    
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
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
            if (this.globalS.isCurrentRoute(this.router, 'leave')) {
                this.user = data;
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
        this.leaveGroup = this.formBuilder.group({
            user: '',
            staffcode: '',

            dates: [[], [Validators.required]],

            makeUnavailable: true,
            unallocAdmin: false,
            unallocUnapproved: true,
            unallocMaster: false,

            explanation: '',
            activityCode: '',
            payCode: '',
            program: '',

            programShow: false
        })
    }

    search(user: any = this.user) {
        this.cd.reattach();
        this.loading = true;
        this.timeS.getleaveapplication(user.code).subscribe(data => {
            this.tableData = data;
            this.loading = false;
            this.cd.detectChanges();
        });
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.putonLeaveModal = !this.putonLeaveModal;
    }

    handleCancel() {
        this.modalOpen = false;
        this.search(this.user);
        return;
    }

    reset() {
        
    }

    showEditModal(data: any) {
        this.putonLeaveModal = !this.putonLeaveModal;
    }

    delete(data: any) {
        this.timeS
            .deleteleaveapplication(data.recordNumber)
            .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Data Deleted!');
                    this.search(this.user);
                    return;
                }
            });
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
        this.loadingPDF = true;
    
        var fQuery = "SELECT RECORDNUMBER, NAME AS Field1,CONVERT(varchar, [DATE1],105) as Field2,CONVERT(varchar, [DATE2],105) as Field3,NOTES as Field4,"+
                        "CONVERT(varchar,[DATEINSTALLED],105) as Field5,COMPLETED AS Field6 FROM HUMANRESOURCES HR INNER JOIN Staff ST ON ST.[UniqueId] = HR.[PersonID]"+
                        "WHERE ST.[AccountNo] ='"+this.user.code+"' AND HR.[DELETEDRECORD] = 0"+
                        "AND HR.[GROUP] = 'LEAVEAPP'"+
                        "ORDER BY  DATE1 DESC";
        
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
                "txtTitle": "LEAVE APPLICATION FOR '"+this.user.code+"' ",
                "sql": fQuery,
                "userid": this.tocken.user,
                "head1" : "Leave Type",
                "head2" : "Start",
                "head3" : "End",
                "head4" : "Notes",
                "head5" : "REMINDER DATE",
                "head6" : "Approved",
            }
        }
        this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
        .subscribe((blob: any) => {
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loadingPDF = false;
            console.log("compiled after data")
            this.cd.detectChanges();
        }, err => {
            console.log(err);
            this.loadingPDF = false;
            this.ModalS.error({
                nzTitle: 'TRACCS',
                nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                nzOnOk: () => {
                    this.drawerVisible = false;
                },
            });
        });
        this.cd.detectChanges();
        this.loadingPDF = true;
        this.tryDoctype = "";
        this.pdfTitle = "";
    }
}
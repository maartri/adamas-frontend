import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    styles: [`
    nz-table{
        margin-top:20px;
    }
    .ant-checkbox-wrapper{
        display:flex;
    }
    .ant-checkbox-wrapper >>> span{
        display: flex;
        align-items: center;
        font-size: 12px;
    }
    .options > div{
        margin-bottom:13px;
    }
    `],
    templateUrl: './incident.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffIncidentAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    incidentForm: FormGroup;
    tableData: Array<any>;
    loading: boolean = false;
    postLoading: boolean = false;
    
    incidentOpen: boolean = false;
    
    current: number = 0;
    
    incidentTypeList: Array<any> = []
    incidentRecipient: any;
    operation: any; 
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
        private modalService: NzModalService,
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
                if (this.globalS.isCurrentRoute(this.router, 'incident')) {
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
            this.incidentForm = this.formBuilder.group({
                incidentType: ''
            });
        }
        
        search(user: any = this.user) {
            this.cd.reattach();
            this.loading = true;
            this.timeS.getincidents(user.code).subscribe(data => {
                this.tableData = data;
                this.loading = false;
                this.cd.detectChanges();
            });
            
            this.incidentRecipient = this.user;
        }
        
        trackByFn(index, item) {
            return item.id;
        }  
        
        showAddModal() {        
            const { agencyDefinedGroup, code, id, sysmgr, view } = this.user;
            
            this.operation = {
                process: 'ADD'
            }        
            
            this.incidentOpen = !this.incidentOpen;
        }
        
        showEditModal(data: any) {
            const { agencyDefinedGroup, code, id, sysmgr, view } = this.user;
            
            var newPass = {
                agencyDefinedGroup: agencyDefinedGroup,
                code: code,
                id: id,
                sysmgr: sysmgr,
                view: view,
                operation: 'UPDATE',
                recordNo: data.recordNumber
            }
            
            this.operation = {
                process: 'UPDATE'
            }
            
            console.log(newPass);
            
            this.incidentRecipient = newPass;
            this.incidentOpen = !this.incidentOpen;
        }
        
        reload(data: any){
            this.search(this.user);
        }
        
        
        delete(index: number){
            const { recordNumber } = this.tableData[index];
            this.timeS.deleteincident(recordNumber).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.globalS.sToast('Success', 'Deleted Successfully');
                        this.search();
                    }
                });
        }
        closed(index: number){

        }
        save(){
                
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
            
            var fQuery = "SELECT Status as Field1,CONVERT(varchar, [Date],105) as Field2, [Type] as Field3, ShortDesc AS Field4, CurrentAssignee AS Field5 FROM IM_Master IM INNER JOIN Staff S ON S.[UniqueID] = IM.[PersonID] WHERE S.[AccountNo] = '"+this.user.code+"' ORDER BY STATUS DESC, DATE DESC";
            
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
                    "txtTitle": "Staff Incident List",
                    "sql": fQuery,
                    "userid":this.tocken.user,
                    "head1" : "Status",
                    "head2" : "Date",
                    "head3" : "Type",
                    "head4" : "Description",
                    "head5" : "Assigned To",
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
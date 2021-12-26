import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, PrintService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject,EMPTY } from 'rxjs';
import { takeUntil,switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

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
    leaveactivities: any;
    leavepaytypes: any;
    defaultLeave:any;
    defaultLeaveForm: FormGroup;
    operation: any;
    userUpdated: any;
    currentDate: string;
    updateString:string;
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        private printS:PrintService,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef
        ) {
            
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
                this.populate();
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
                reminderDate:new Date(),
                approved:false,
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
            
            this.defaultLeaveForm = this.formBuilder.group({
                defaultUnallocateLeaveActivity:'',
                defaultUnallocateLeavePayType:'',
            });
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
        leavepaytypechanged(){
            if(!this.globalS.isEmpty(this.defaultLeaveForm.get('defaultUnallocateLeavePayType').value)){
                this.updateString = "DefaultUnallocateLeavePayType='"+this.defaultLeaveForm.get('defaultUnallocateLeavePayType').value.toString()+"' Where";
                this.timeS.updateLeaveStatus(this.updateString,this.user.id)
                .subscribe(data => {
                  });
            }
        }
        leaveactivityChanged(){
                if(!this.globalS.isEmpty(this.defaultLeaveForm.get('defaultUnallocateLeaveActivity').value)){
                    this.updateString = "DefaultUnallocateLeaveActivity='"+this.defaultLeaveForm.get('defaultUnallocateLeaveActivity').value.toString()+"' Where";
                        this.timeS.updateLeaveStatus(this.updateString,this.user.id)
                        .subscribe(data => {
                    });
                }
        }
        populate(){
            forkJoin([
                this.listS.getleaveactivities(),
                this.listS.getleavepaytypes(),
            ]).subscribe(data => {
                this.leaveactivities = data[0];
                this.leavepaytypes   = data[1];
            });
            
            this.timeS.getstaffunallocatedefault(this.user.id).subscribe(data => {
                this.defaultLeave = data[0];
                setTimeout(() => {                
                    this.defaultLeaveForm.patchValue({
                        defaultUnallocateLeaveActivity:this.defaultLeave.defaultLeaveActivity,
                        defaultUnallocateLeavePayType:this.defaultLeave.defaultLeavePayType,
                    });
                },50); 
                this.cd.detectChanges();
            });
        }
        trackByFn(index, item) {
            return item.id;
        }
        
        showAddModal() {
            this.operation = {
                process: 'ADD'
            }
            // console.log(JSON.stringify(this.user) + "user");
            this.putonLeaveModal = !this.putonLeaveModal;
        }
        
        showEditModal(data: any) {
            const {code, id, sysmgr, view } = this.user;
            
            var newPass = {
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
            this.user = newPass;
            this.putonLeaveModal = !this.putonLeaveModal;
        }
        
        handleCancel() {
            this.modalOpen = false;
            this.search(this.user);
            return;
        }
        
        reset() {
            
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
            this.loadingPDF = true;
            this.tryDoctype = "";
            this.pdfTitle = "";
        }

        reload(data: string){
            this.search();
        }

        isUpdateValid(data: any){
            var currDate = new Date();
            return !(currDate > new Date(this.tableData[data]));
        }

      
    }
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, PrintService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import format from 'date-fns/format';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
    .overflow-list{
        overflow: auto;
        height: 8rem;
        border: 1px solid #e3e3e3;
    }
    ul{
        list-style:none;
    }
    li{
        margin:5px 0;
    }
    .chkboxes{
        padding:4px;
    }
    button{
        margin-right:1rem;
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
    loadingPDF: boolean = false;
    modalOpen: boolean = false;
    addORView: number = 1;
    categories: Array<any>;
    dateFormat: string = 'dd/MM/yyyy';
    isLoading: boolean = false;
    check : boolean = false;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    whereString :string=" HI.DeletedRecord = 0 ";
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    private default = {
        notes: '',
        isPrivate: false,
        alarmDate: null,
        whocode: '',
        recordNumber: null,
        category: null
    }
    deletedRecord: string;
    recipientStrArr: any;
    mlist: any;
    public editorConfig:AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        translate: 'no',
        customClasses: []
    };
    
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private printS:PrintService,
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
                restrictions: '',
                restrictionsStr:'public',
                recordNumber: null,
                category: ['', [Validators.required]]
            });      
            this.inputForm.get('restrictionsStr').valueChanges.subscribe(data => {
                if (data == 'restrict') {
                    this.getSelect();
                } 
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
            
            this.addORView = 0;
            const { alarmDate, detail, isPrivate,privateFlag,restrictions,category, creator, recordNumber } = this.tableData[index];
            
            this.inputForm.patchValue({
                notes: detail,
                isPrivate: isPrivate,
                alarmDate: alarmDate,
                restrictions: '',
                restrictionsStr: this.determineRadioButtonValue(privateFlag, restrictions),
                whocode: creator,
                recordNumber: recordNumber,
                category: category
            });
            this.modalOpen = true;
        }
        determineRadioButtonValue(privateFlag: Boolean, restrictions: string): string {
            if (!privateFlag && this.globalS.isEmpty(restrictions)) {
                return 'public';
            }
            
            if (!privateFlag && !this.globalS.isEmpty(restrictions)) {
                return 'restrict'
            }
            
            return 'workgroup';
        }
        delete(index: number){
            const { recordNumber } = this.tableData[index];
            this.timeS.deletehrnotes(recordNumber).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.globalS.sToast('Success', 'HR NOTE ARCHIVED');
                        this.search();
                        this.handleCancel();
                    }
                });
            }
            getarchivedhrnotes(user: any = this.user){
                this.cd.reattach();
                this.loading = true;
                this.timeS.getarchivedhrnotes(user.code).pipe(delay(200),takeUntil(this.unsubscribe)).subscribe(data => {
                    this.tableData = data;
                    this.loading = false;
                    this.cd.detectChanges()
                });
                this.populate();
            }
            fetchAll(e){
                if(e.target.checked){
                    this.whereString = " HI.DeletedRecord = 1 ";
                    this.getarchivedhrnotes(this.user);
                }else{
                    this.whereString = " HI.DeletedRecord = 0 ";
                    this.search(this.user);
                }
            }
        
            save() {
                if (!this.globalS.IsFormValid(this.inputForm))
                return;        
                const cleanDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(
                    this.inputForm.get('alarmDate').value);
                    
                    
                    const { alarmDate, restrictionsStr, whocode, restrictions } = this.inputForm.value;
                    
                    let privateFlag = restrictionsStr == 'workgroup' ? true : false;
                    
                    let restricts = restrictionsStr != 'restrict';
                    
                    this.inputForm.controls["restrictionsStr"].setValue(privateFlag);
                    
                    this.inputForm.controls["restrictions"].setValue(restricts ? '' : this.listStringify());
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
                    log(event: any) {
                        this.recipientStrArr = event;
                    }
                    listStringify(): string {
                        let tempStr = '';
                        this.recipientStrArr.forEach((data, index, array) => {
                            array.length - 1 != index ?
                            tempStr += data.trim() + '|' :
                            tempStr += data.trim();
                        });
                        return tempStr;
                    }
                    getSelect() {
                        this.timeS.getmanagerop().subscribe(data => {
                            this.mlist = data;
                            this.cd.markForCheck();
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
                        this.loadingPDF = true;
                        
                        var fQuery = "Select CONVERT(varchar, [DetailDate],105) as Field1, Detail as Field2, CONVERT(varchar, [AlarmDate],105) as Field4, Creator as Field3 From History HI INNER JOIN Staff ST ON ST.[UniqueID] = HI.[PersonID] WHERE ST.[AccountNo] = '"+this.user.code+"' AND "+this.whereString+" AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND ExtraDetail1 = 'HRNOTE' ORDER BY DetailDate DESC, RecordNumber DESC";
                        
                        const data = {
                            "template": { "_id": "0RYYxAkMCftBE9jc" },
                            "options": {
                                "reports": { "save": false },
                                "txtTitle": "STAFF HR NOTES List",
                                "sql": fQuery,
                                "userid":this.tocken.user,
                                "head1" : "Date",
                                "head2" : "Detail",
                                "head3" : "Created By",
                                "head4" : "Remember Date",
                            }
                        }
                       this.printS.printControl(data).subscribe((blob: any) => {
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
                        this.loadingPDF = true;
                        this.tryDoctype = "";
                        this.pdfTitle = "";
                    }
                }
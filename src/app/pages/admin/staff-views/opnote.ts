import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, PrintService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

import format from 'date-fns/format';
import getYear from 'date-fns/getYear';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    templateUrl: './opnote.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffOPAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    modalOpen: boolean = false;
    isLoading: boolean = false;
    

    default = {
        notes: '',
        isPrivate: false,
        alarmDate: null,
        whocode: '',
        recordNumber: null,
        category: null
    }

    dateFormat: string = 'dd/MM/yyyy';
    addOREdit: number;
    categories: Array<any>;
    loading:boolean = false;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    mlist: Array<any> = [];
    public editorConfig:AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '5rem',
        translate: 'no',
        customClasses: []
    };
    recipientStrArr: any;
    restrict_list: any;
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService,
        private printS: PrintService
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
            if (this.globalS.isCurrentRoute(this.router, 'op-note')) {
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
        this.inputForm = this.formBuilder.group({
            notes: '',
            isPrivate: false,
            alarmDate: null,
            whocode: '',
            restrictions: '',
            restrictionsStr:'public',
            recordNumber: null,
            category: [null, [Validators.required]]
        });

        this.inputForm.get('restrictionsStr').valueChanges.subscribe(data => {
            if (data == 'restrict') {
                this.getSelect();
            } 
        });
    }
    getSelect() {
        this.timeS.getmanagerop().subscribe(data => {
            data.forEach(x => {
                this.mlist.push({
                     name:x, value:x, checked:false
                  });
            });
            this.cd.markForCheck();
        });
        

    //     this.timeS.getdisciplineop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //         data.push('*VARIOUS');
    //         this.blist = data;
    //     });
    //     this.timeS.getcaredomainop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //         data.push('*VARIOUS');
    //         this.clist = data;
    //     });
    //     this.timeS.getprogramop(this.user.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //         data.push('*VARIOUS');
    //         this.alist = data;
    //     });

    //     this.timeS.getcategoryop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
    //         this.dlist = data;
    //     })
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
    search(user: any = this.user) {
        this.cd.reattach();
        this.isLoading = true;
        this.timeS.getopnotes(user.code).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.tableData = data;
            this.isLoading = false;
            this.cd.detectChanges();
        });

        this.listS.getlistop().pipe(takeUntil(this.unsubscribe)).subscribe(data => this.categories = data)
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.addOREdit = 1;
        this.modalOpen = true;
    }

    save() {
        if (!this.globalS.IsFormValid(this.inputForm))
            return;        
        
        const cleanDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(
            this.inputForm.get('alarmDate').value);
        
        this.inputForm.controls["alarmDate"].setValue(cleanDate);

        const { alarmDate, restrictionsStr, whocode, restrictions } = this.inputForm.value;

        let privateFlag = restrictionsStr == 'workgroup' ? true : false;
            
        let restricts = restrictionsStr != 'restrict';

        this.inputForm.controls["restrictionsStr"].setValue(privateFlag);

        this.inputForm.controls["restrictions"].setValue(restricts ? '' : this.listStringify());

        this.isLoading = true;
        if (this.addOREdit == 1) {
            this.inputForm.controls["whocode"].setValue(this.user.code);
            this.timeS.postopnote(this.inputForm.value, this.user.id).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.globalS.sToast('Success', 'Note saved');
                        this.search();
                        this.handleCancel();
                        return;
                    }
                });
        }

        if (this.addOREdit == 2) {
            this.timeS.updateopnote(this.inputForm.value, this.inputForm.value.recordNumber).pipe(
                takeUntil(this.unsubscribe)).subscribe(data => {
                    if (data) {
                        this.globalS.sToast('Success', 'Note Updated');
                        this.search();
                        if(!this.globalS.isEmpty(this.restrict_list)){
                            this.mlist.forEach(element => {
                                    element.checked = false;
                            });
                        }
                        this.restrict_list = [];
                        
                        this.handleCancel();
                        return;
                    }else{
                        this.globalS.sToast('error', 'Some thing weng wrong');
                        this.search();
                        this.handleCancel();
                    }
                });
        }
    }

    showEditModal(index: any) {
        this.addOREdit = 2;
        const { alarmDate, detail, isPrivate, category, creator,restrictions,privateFlag, recordNumber } = this.tableData[index];

        this.restrict_list = restrictions.split('|');
        
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
        
        if(!this.globalS.isEmpty(this.restrict_list)){
            this.mlist.forEach(element => {
                if(this.restrict_list.includes(element.name)){
                    element.checked = true;
                }
            });
        }
        this.modalOpen = true;
        this.cd.detectChanges();
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
    delete(index: number) {        
        const { recordNumber } = this.tableData[index];
        this.timeS.deleteopnote(recordNumber).pipe(
            takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Note Deleted');
                    this.search();
                    this.handleCancel();
                }
            });
    }

    handleCancel() {
        this.modalOpen = false;
        this.inputForm.reset();
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
        
        var fQuery = "Select CONVERT(varchar, [DetailDate],105) as Field1, Detail as Field2, CONVERT(varchar, [AlarmDate],105) as Field4, Creator as Field3 From History HI INNER JOIN Staff ST ON ST.[UniqueID] = HI.[PersonID] WHERE ST.[AccountNo] = '"+this.user.code+"' AND HI.DeletedRecord <> 1 AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND ExtraDetail1 = 'OPNOTE' ORDER BY DetailDate DESC, RecordNumber DESC";
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
                "txtTitle": "Staff OP NOTES List",
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
        this.loading = true;
        this.tryDoctype = "";
        this.pdfTitle = "";
    }
}
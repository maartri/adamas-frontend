import { Component, OnInit, OnDestroy, Input,Output,EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef,AfterViewInit } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService ,PrintService} from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { Filters } from '@modules/modules';
import { values } from 'lodash';
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
    templateUrl: './gnotes.html',
    selector:'gnotes',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class GNotes implements OnInit, OnDestroy, AfterViewInit {
    private unsubscribe: Subject<void> = new Subject();
  //  user:any;
    @Input() user:any;    
    @Input() loadNote: Subject<any>;
    
    inputForm: FormGroup;
    caseFormGroup: FormGroup;
    tableData: Array<any>;

    checked: boolean = false;
    isDisabled: boolean = false;
    loading: boolean = false;

    modalOpen: boolean = false;
    addOrEdit: number;
    dateFormat: string = 'dd/MM/yyyy';
    printLoad: boolean = false;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    tocken: any;
    public editorConfig:AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '5rem',
        translate: 'no',
        customClasses: []
    };

    filters: Filters = {
        acceptedQuotes: false,
        allDates: false,
        archiveDocs: true,
        display: 20,
        type:'OPNOTE'
    };


    alist: Array<any> = [];
    blist: Array<any> = [];
    clist: Array<any> = [];
    dlist: Array<any> = [];
    mlist: Array<any> = [];

    recipientStrArr: Array<any> = [];

    private default = {
        notes: '',
        publishToApp: false,
        restrictions: '',
        restrictionsStr: 'public',
        alarmDate: null,
        whocode: '',
        program: '*VARIOUS',
        discipline: '*VARIOUS',
        careDomain: '*VARIOUS',
        category: null,
        recordNumber: null
    }

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService,
        private printS: PrintService
    ) {
        

        // this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        //     if (this.globalS.isCurrentRoute(this.router, 'opnote')) {
        //         this.user = data;
        //         this.search(data);
        //     }
        // });
    }

    ngOnInit(): void {
     
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
    //     this.user = this.sharedS.getPicked();
      
    //    if(this.user){
    //        this.search(this.user);
    //        this.buildForm();           
    //    }             
        
            // user s coming from component call
             
           this.search(this.user);
         this.buildForm();
        this.loadNote.subscribe(d=>{
            this.search(d);
        })
        
    }

    ngAfterViewInit(){
      
    }
    print(){

    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    search(user: any = this.user) {
        if (user==null) return;
        this.filters.type=this.user.noteType;
        this.getNotes(this.user);
        this.getSelect();
    }

    filterChange(data: any){
        this.search(this.user);
    }

    getNotes(user:any) {
        this.loading = true;

        this.clientS.getgnoteswithfilters(user.id, this.filters).subscribe(data => {
            let list: Array<any> = data.list || [];
            
            if (list.length > 0) {
                list.forEach(x => {
                    if (!this.globalS.IsRTF2TextRequired(x.detailOriginal)) {
                        x.detail = x.detailOriginal
                    }
                });
                this.tableData = list;
            } else {
                this.tableData = list;
            }
            
            this.loading = false;
            this.cd.markForCheck();
            this.cd.detectChanges();
        })

        // this.clientS.getopnotes(user.id).subscribe(data => {
        //     let list: Array<any> = data.list || [];
            
        //     if (list.length > 0) {
        //         list.forEach(x => {
        //             if (!this.globalS.IsRTF2TextRequired(x.detailOriginal)) {
        //                 x.detail = x.detailOriginal
        //             }
        //         });
        //         this.tableData = list;
        //     }
            
        //     this.loading = false;
        //     this.cd.markForCheck();
        // });

    }

    patchData(data: any) {
        this.inputForm.patchValue({
            autoLogout: data.autoLogout,
            emailMessage: data.emailMessage,
            excludeShiftAlerts: data.excludeShiftAlerts,
            inAppMessage: data.inAppMessage,
            logDisplay: data.logDisplay,
            pin: data.pin,
            rosterPublish: data.rosterPublish,
            shiftChange: data.shiftChange,
            smsMessage: data.smsMessage
        });
    }


    buildForm() {

        this.inputForm = this.formBuilder.group({
            autoLogout: [''],
            emailMessage: false,
            excludeShiftAlerts: false,
            inAppMessage: false,
            logDisplay: false,
            pin: [''],
            rosterPublish: false,
            shiftChange: false,
            smsMessage: false
        });

        this.caseFormGroup = this.formBuilder.group({
            notes: '',
            publishToApp: false,
            restrictions: '',
            restrictionsStr: 'public',
            alarmDate: null,
            whocode: '',
            program: '*VARIOUS',
            discipline: '*VARIOUS',
            careDomain: '*VARIOUS',
            category: ['', [Validators.required]],
            recordNumber: null,
            type:"CASENOTE"
        });

        this.caseFormGroup.get('restrictionsStr').valueChanges.subscribe(data => {
            if (data == 'restrict') {
                this.getSelect();
            } 
        });
    }

    getSelect() {
        this.timeS.getmanagerop().subscribe(data => {
            this.mlist = data;
            this.cd.markForCheck();
        });

        this.timeS.getdisciplineop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            data.push('*VARIOUS');
            this.blist = data;
        });
        this.timeS.getcaredomainop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            data.push('*VARIOUS');
            this.clist = data;
        });
        this.timeS.getprogramop(this.user.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            data.push('*VARIOUS');
            this.alist = data;
        });

        this.timeS.getcategoryop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            this.dlist = data;
        })
    }

    onKeyPress(data: KeyboardEvent) {
        return this.globalS.acceptOnlyNumeric(data);
    }

    trackByFn(index, item) {
        return item.id;
    }

    save() {        
        if (!this.globalS.IsFormValid(this.caseFormGroup))
            return;
        
        const { alarmDate, restrictionsStr, whocode, restrictions } = this.caseFormGroup.value;
        const cleanDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(alarmDate);

        let privateFlag = restrictionsStr == 'workgroup' ? true : false;
        let restricts = restrictionsStr != 'restrict';

        this.caseFormGroup.controls["restrictionsStr"].setValue(privateFlag);

        this.caseFormGroup.controls["alarmDate"].setValue(cleanDate);
        this.caseFormGroup.controls["whocode"].setValue(this.user.code);
        this.caseFormGroup.controls["restrictions"].setValue(restricts ? '' : this.listStringify());
        this.caseFormGroup.controls["type"].setValue(this.user.noteType);

        this.loading = true;
        if (this.addOrEdit == 1) {    
            if (this.user.noteType=='OPNOTE')       
                this.clientS.postopnotes(this.caseFormGroup.value, this.user.id)
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Note inserted');
                        this.handleCancel();
                        this.getNotes(this.user);
                    });
            else
                this.clientS.postcasenotes(this.caseFormGroup.value, this.user.id)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Note inserted');
                    this.handleCancel();
                    this.getNotes(this.user);
                });
        }
        if (this.addOrEdit == 2) {

            if (this.user.noteType=='OPNOTE')      

                this.clientS.updateopnotes(this.caseFormGroup.value, this.caseFormGroup.value.recordNumber)
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Note updated');
                        this.handleCancel();
                        this.getNotes(this.user);                    
                    });
            else
                this.clientS.updatecasenotes(this.caseFormGroup.value, this.caseFormGroup.value.recordNumber)
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Note updated');
                        this.handleCancel();
                        this.getNotes(this.user);                    
                    });
        }
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

    showAddModal() {
        this.addOrEdit = 1;
        this.modalOpen = true;
    }

    showEditModal(index: number) {
        this.addOrEdit = 2;
        const { personID, recordNumber, privateFlag, whoCode, detailDate, craetor, detail, detailOriginal, extraDetail2, restrictions, alarmDate, program,discipline, careDomain, publishToApp } = this.tableData[index];

        this.caseFormGroup.patchValue({
            notes: detail,
            publishToApp: publishToApp,
            restrictions: '',
            restrictionsStr: this.determineRadioButtonValue(privateFlag, restrictions),
            alarmDate: alarmDate,
            program: program,
            discipline: discipline,
            careDomain: careDomain,
            category: extraDetail2,
            recordNumber: recordNumber
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

    delete(index: any) {
        const { recordNumber } = this.tableData[index];

        this.clientS.deleteopnotes(recordNumber).subscribe(data => {
            this.globalS.sToast('Success', 'Note deleted');
            this.handleCancel();
            this.getNotes(this.user);
        });
    }

    log(event: any) {
        this.recipientStrArr = event;
    }

    handleCancel() {
        this.modalOpen = false;
        this.loading = false;
        this.caseFormGroup.reset(this.default);
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
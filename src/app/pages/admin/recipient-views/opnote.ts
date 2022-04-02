import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { Filters } from '@modules/modules';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import * as groupArray from 'group-array';
// import * as rtf2text from '@bacali/rtf-parser';

// import * as iconvLite from 'iconv-lite';
// import { deEncapsulateSync } from 'rtf-stream-parser';

const FILTERS: Array<string> = [
    'CARE DOMAIN',
    'CATEGORY',
    'CREATOR',
    'DISCIPLINE',
    'PROGRAMS'
 ]

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


export class RecipientOpnoteAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
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

    filters: Filters = {
        acceptedQuotes: false,
        allDates: false,
        archiveDocs: true,
        display: 20
    };

    FILTERS = FILTERS;


    alist: Array<any> = [];
    blist: Array<any> = [];
    clist: Array<any> = [];
    dlist: Array<any> = [];
    mlist: Array<any> = [];
    public editorConfig:AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '5rem',
        translate: 'no',
        customClasses: []
    };
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
    restrict_list: any;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'opnote')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        // this.search(this.user);
        this.buildForm();
        // console.log(rtf2text)
    }

    print(){

    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    search(user: any = this.user) {
        this.getNotes(this.user);
        this.getSelect();
    }

    filterChange(filters: any){
        this.getNotes(this.user, filters);
        this.getSelect();
    }

    getNotes(user:any, filters: any = null) {
        this.loading = true;

        this.clientS.getopnoteswithfilters(user.id, filters).subscribe(data => {
            let list: Array<any> = data.list || [];
            
            if (list.length > 0) {
                list.forEach(x => {
                    if (!this.globalS.IsRTF2TextRequired(x.detailOriginal)) {
                        x.detail = x.detailOriginal;                        
                    }
                });
                this.tableData = list;
            } else {
                this.tableData = list;
            }
            this.originalTableData = this.tableData;
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
            recordNumber: null
        });

        this.caseFormGroup.get('restrictionsStr').valueChanges.subscribe(data => {
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

        this.loading = true;
        if (this.addOrEdit == 1) {            
            this.clientS.postopnotes(this.caseFormGroup.value, this.user.id)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Note inserted');
                    this.handleCancel();
                    this.getNotes(this.user);
                });
        }
        if (this.addOrEdit == 2) {
            this.clientS.updateopnotes(this.caseFormGroup.value, this.caseFormGroup.value.recordNumber)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Note updated');
                    this.handleCancel();
                    
                    if(!this.globalS.isEmpty(this.restrict_list)){
                        this.mlist.forEach(element => {
                                element.checked = false;
                        });
                    }
                    this.restrict_list = [];
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
        
        
        this.restrict_list = restrictions.split('|');
        
        if(!this.globalS.isEmpty(restrictions)){
            this.mlist.forEach(element => {
                if(this.restrict_list.includes(element.name)){
                    element.checked = true;
                    console.log(element.name + "yes")
                }
            });
        }


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

    originalTableData: Array<any>;
    dragOrigin: Array<string> = [];

    columnDictionary = [{
        key: 'Details',
        value: 'detail'
    },{
        key: 'Detail Date',
        value: 'detailDate'
    },{
        key: 'Creator',
        value: 'creator'
    }];
    
    
    

    dragDestination = [       
        'Details',
        'Detail Date',
        'Creator'
    ];


    flattenObj = (obj, parent = null, res = {}) => {
        for (const key of Object.keys(obj)) {
            const propName = parent ? parent + '.' + key : key;
            if (typeof obj[key] === 'object') {
                this.flattenObj(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
        return res;
    }

    searchColumnDictionary(data: Array<any>, tobeSearched: string){
        let index = data.findIndex(x => x.key == tobeSearched);        
        return data[index].value;
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);            
        } else {
            if(!event.container.data.includes(event.item.data)){
                copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.container.data.length)
            }
        }
        this.generate();
    }

    generate(){
        const dragColumns = this.dragOrigin.map(x => this.searchColumnDictionary(this.columnDictionary, x));
        console.log(dragColumns)

        var convertedObj = groupArray(this.originalTableData, dragColumns);

        console.log(convertedObj)
        var flatten = this.flatten(convertedObj, [], 0);

        if(dragColumns.length == 0){
            this.tableData = this.originalTableData;
        } else {
            this.tableData = flatten;
        }
    }

    flatten(obj: any, res: Array<any> = [], counter = null){
        for (const key of Object.keys(obj)) {
            const propName = key;
            if(typeof propName == 'string'){                   
                res.push({key: propName, counter: counter});
                counter++;
            }
            if (!Array.isArray(obj[key])) {
                this.flatten(obj[key], res, counter);
                counter--;
            } else {
                res.push(obj[key]);
                counter--;
            }
        }
        return res;
    }

    removeTodo(data: any){
        this.dragOrigin.splice(this.dragOrigin.indexOf(data),1);
        this.generate();
    }

    isArray(data: any){
        return Array.isArray(data);
    }
 
    isSome(data: any){
        if(data){
            return data.some(d => 'key' in d);
        }
        return true;        
    }
}
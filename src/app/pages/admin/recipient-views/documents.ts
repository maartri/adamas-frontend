import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, UploadService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

import { NzMessageService } from 'ng-zorro-antd/message';

import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import * as groupArray from 'group-array';

interface NewDocument{
    file: string,
    newFile: string,
    path: string
}

const FILTERS: Array<string> = [
    'CARE DOMAIN',
    'CREATOR',
    'DISCIPLINE',
    'DOCUMENT CATEGORY',
    'FILE CLASSIFICATION',
    'PROGRAMS'
 ]


@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        button{
            margin-right:10px;
        }
        .limit-width{
            width: 5rem;
            overflow: hidden;
        }
        .exist{
            color:green;
        }
        .not-exist{
            color:red;
        }
        ul{
            list-style:none;
        }
        ul li.active{
            background:#e6f1ff;
        }
        ul li:not(.active):hover{
            background:#e6f1ff;
        }
    `],
    templateUrl: './documents.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientDocumentsAdmin implements OnInit, OnDestroy, AfterViewInit {

    private unsubscribe: Subject<void> = new Subject();
    public templates$: Observable<any>;

    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    loading: boolean = false;
    addDocumentModal: boolean = false;
    current: number = 0;

    postLoading: boolean = false;
    selectedIndex: number;

    fileObject: NewDocument;
    showUpload: boolean = false;

    filters: any;
    FILTERS = FILTERS;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef,
        private message: NzMessageService,
        private uploadS: UploadService
    ) {
        // cd.reattach();

        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'documents')) {
                this.search(data);
            }
        });
    }

    ngAfterViewInit(){
        this.showUpload = true;
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        console.log(this.user)
        if(this.user){
            this.search(this.user);
            this.buildForm();
            return;
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            
        });
    }

    search(user: any = this.user, filters: any = null) {
        this.cd.reattach();

        this.loading = true;
        this.timeS.getdocumentsrecipients(user.id, filters).subscribe(data => {
            console.log(data)
            this.tableData = data;
            this.originalTableData = data;


            this.loading = false;
            this.cd.detectChanges();
        });

    }

    selectDocument(doc: any, index: number){
        this.selectedIndex = index;
        // if(doc.exists){
            this.fileObject = {
                file: doc.name,
                newFile: `${doc.name}`,
                path: doc.template
            };
            return;
        // }
        //this.globalS.eToast('Error','File not exists')            
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.addDocumentModal = true;
        this.current = 0;
        this.selectedIndex = null;
        this.templates$ = this.uploadS.getdocumenttemplate();
    }

    reload(reload: boolean){
        if(reload){
            this.search();
        }
    }

    showEditModal(index: any) {
        
    }

    downloadFile(index: any){
        var doc = this.tableData[index];
        var notifId = this.globalS.loadingMessage('Downloading Document');
        
        this.uploadS.download({
            PersonID: this.user.id,
            Extension: doc.type,
            FileName: doc.filename,
            DocPath: doc.originalLocation
        }).pipe(takeUntil(this.unsubscribe)).subscribe(blob => {

            let data = window.URL.createObjectURL(blob);      
            let link = document.createElement('a');
            link.href = data;
            link.download = doc.filename;
            link.click();

            setTimeout(() =>
            {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                this.message.remove(notifId);

                this.globalS.sToast('Success','Download Complete');
            }, 100);

        }, err =>{
            this.message.remove(notifId);
            this.globalS.eToast('Error', "Document can't be found");
        })
    }

    reportTab: any;
    viewFile(index: any){
        var doc = this.tableData[index];

        this.reportTab = window.open("", "_blank");

        this.uploadS.getdocumentblob({
            PersonID: this.user.id,
            Extension: doc.type,
            FileName: doc.filename,
            DocPath: doc.originalLocation
        }).subscribe(data => {
          this.openDocumentTab(data);
        }, (error: any) => {
            this.reportTab.close();
            this.globalS.eToast('Error','File not located')
        })
    }

    openDocumentTab(data: any)
    {
        // this.fileDocumentName = data.fileName;
        this.reportTab.location.href = `${data.path}`;   
        this.reportTab.focus();
    }

    handleCancel(){
        this.addDocumentModal = false;
        this.postLoading = false;
    }
    
    delete(data: any) {
        this.uploadS.delete(this.user.id,{ 
            id: data.docID,
            filename: data.title
        }).pipe(takeUntil(this.unsubscribe))
            .subscribe(data => {
            if(data){
                this.search();
                this.globalS.sToast('Success','File deleted')
                return;
            }
        })
    }

    save(){
        var inp = {
            User: this.globalS.decode().user,
            PersonID: this.user.id,
            OriginalFileName: this.fileObject.file,
            NewFileName: this.fileObject.newFile,
            Path:  this.fileObject.path
        };
        this.postLoading = true;
        this.uploadS.postdocumentstafftemplate(inp).subscribe(data => {
            this.globalS.sToast('Success','Document has been added');
            this.handleCancel();
            this.search();
        }, (err) =>{
            this.postLoading = false;
            this.globalS.eToast('Error', err.error.message);
        });
    }

    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;
    }

    originalTableData: Array<any>;
    dragOrigin: Array<string> = [];

    columnDictionary = [{
        key: 'Title',
        value: 'title'
    },{
        key: 'Status',
        value: 'status'
    },{
        key: 'Classification',
        value: 'classification'
    },{
        key: 'Category',
        value: 'category'
    },{
        key: 'Created',
        value: 'created'
    },{
        key: 'Author',
        value: 'author'
    },{
        key: 'Modified',
        value: 'modified'
    },{
        key: 'Filename',
        value: 'filename'
    },{
        key:'Type',
        value:'type'
    },{
        key:'Original Location',
        value:'originalLocation'
    }];
    
    
    

    dragDestination = [
        'Title',
        'Status',
        'Classification',
        'Category',
        'Created',
        'Author',
        'Modified',
        'Filename',
        'Type',
        'Original Location',
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
        console.log(flatten)
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

    filterChange(filters: any){
        this.search(this.user, filters); 
    }
}
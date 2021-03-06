import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, UploadService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

import { NzMessageService } from 'ng-zorro-antd/message';

interface NewDocument{
    file: string,
    newFile: string,
    path: string
}

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
        ul li {
            padding:5px;
            cursor:pointer;
        }
        ul li.active{
            background:#e6f1ff;
        }
        ul li:not(.active):hover{
            background:#e6f1ff;
        }
    `],
    templateUrl: './document.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffDocumentAdmin implements OnInit, OnDestroy {

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
        cd.reattach();

        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'document')) {
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
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
            
        });
    }

    search(user: any = this.user) {
        this.cd.reattach();

        this.loading = true;
        this.timeS.getdocuments(user.code).subscribe(data => {
            this.tableData = data;
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
            console.log(err);
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


        this.uploadS.postdocumentstafftemplate(inp).subscribe(data => {
            this.globalS.sToast('Success','Document has been added');
            this.search();
        }, (err) =>{
            console.log(err);
            this.globalS.eToast('Error', err.error.message);
        });
    }

    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;
    }
}
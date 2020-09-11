import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, UploadService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

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

    fileObject: {
        file: '',
        newFile: ''
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

    selectDocument(doc: any){
        if(doc.exists){
            this.fileObject = {
                file: doc.name,
                newFile: doc.name
            };
            return;
        }
        this.globalS.eToast('Error','File not exists')            
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
        console.log(this.fileObject)
        this.uploadS.postdocumenttemplate({
            PersonID: this.user.id,
            OriginalFileName: this.fileObject.file,
            NewFileName: this.fileObject.newFile
        }).subscribe(data => {
            if(data){
                // this.changeTab.next(12);
                this.globalS.sToast('Success','Document has been added');
            }
        })
    }

    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;
    }
}
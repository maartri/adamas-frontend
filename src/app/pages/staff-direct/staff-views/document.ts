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
    `],
    templateUrl: './document.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffDocumentAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    loading: boolean = false;

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
                    this.router.navigate(['/staff-direct/staff/personal'])
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
        this.router.navigate(['/staff-direct/staff/personal'])
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

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        
    }

    showEditModal(index: any) {
        
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
}
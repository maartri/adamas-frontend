import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, AfterContentInit } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    templateUrl: './contacts.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RecipientContactsAdmin implements OnInit, OnDestroy, AfterContentInit {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    
    isDisabled: boolean = false;

    visible: boolean = false;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef,
    ) {
        // this.cd.detectChanges();
        
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'contacts')) {
                this.user = {...data};
                this.cd.markForCheck();
            }
        });
        
    }

    ngAfterContentInit(){
        this.visible = true;
    }

    ngOnInit(): void {
        this.user = Object.assign({}, this.sharedS.getPicked());        
        this.cd.markForCheck();
    }

    ngOnDestroy(): void {
        this.visible = false;
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
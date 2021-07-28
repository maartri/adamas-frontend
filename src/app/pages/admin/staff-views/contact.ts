import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    styles: [`
      
    `],
    templateUrl: './contact.html'
})


export class StaffContactAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();

    user: any;
    transformedUser: any;

    constructor(
        private sharedS: ShareService,
        private globalS: GlobalService,
        private router: Router,
    ) {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'contacts')) {
                this.user = data;
                this.transform(this.user);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        if(this.user){
            this.transform(this.user)
            return;
        }
        this.router.navigate(['/admin/staff/personal'])

    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    transform(user: any) {
        if (!user) return;

        this.transformedUser = {
            code: user.code,
            name: user.code,
            view: user.view,
            id: user.id,
            sysmgr: user.sysmgr
        }
    }
}
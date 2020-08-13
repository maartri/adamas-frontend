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
    templateUrl: './personal.html'
})


export class StaffPersonalAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();

    user: any;
    transformedUser: any;

    constructor(
        private sharedS: ShareService,
        private globalS: GlobalService,
        private listS: ListService,
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
            if (this.globalS.isCurrentRoute(this.router, 'personal')) {
                this.user = data;
                this.transform(this.user);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked(); 

        this.transform(this.user)
        // this.user = {
        //     name: 'ABBAS A',
        //     view: 'staff'
        // }
    }

    transform(user: any) {
        if (!user) return;
        
        this.transformedUser = {
            name: user.code,
            view: user.view,
            id: user.id,
            sysmgr: user.sysmgr
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
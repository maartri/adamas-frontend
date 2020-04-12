import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

@Component({
    styles: [`
        ul{
            list-style:none;
        }

        div.divider-subs div{
            margin-top:2rem;
        }
        
    `],
    templateUrl: './perm-roster.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientPermrosterAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;

    checked: boolean = false;
    isDisabled: boolean = false;
    loading: boolean = false;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
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
            if (this.globalS.isCurrentRoute(this.router, 'perm-roster')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        this.search(this.user);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    search(user: any = this.user) {
        this.loading = true;
        this.clientS.getpermroster(user.code).subscribe(data => {
            this.tableData = data.list;
            this.loading = false;
            this.cd.markForCheck();
        });
    }

    trackByFn(index, item) {
        return item.id;
    }
}
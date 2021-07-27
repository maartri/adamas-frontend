import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
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
        .layer > span:first-child{
            width:8rem;
        }
        .layer > *{
            display:inline-block;
            margin-right:5px;
            font-size:11px;
        }
        .layer > input{
            width: 4rem;
        }
        .compartment > div{
            margin-bottom:5px;
        }
        .layer2 > span{
            width:13rem;
        }
        .layer2 > input{
            width:4rem;
        }
        .layer2 {
            margin-bottom:5px;
        }
        .layer2 > *{
            display:inline-block;
            margin-right:5px;
            font-size:11px;
        }
        nz-select{
            width:100%;
        }
    `],
    templateUrl: './attendance.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RecipientAttendanceAdmin implements OnInit, OnDestroy {
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
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
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
            if (this.globalS.isCurrentRoute(this.router, 'history')) {
                // this.search(data);
            }
        });
    }

    ngOnInit(): void {        
        this.user = this.sharedS.getPicked();
        // this.search(this.user);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }


}
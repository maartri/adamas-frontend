import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    styles: [`
        ul{
            list-style:none;
        }

        div.divider-subs div{
            margin-top:2rem;
        }
        .media-container{
            display: inline-block;
            padding: 10px;
        }
        .media-container button {
            position: absolute;
            right: 0;
        }
    `],
    templateUrl: './mediaList.html'
})


export class MediaList implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;

    checked: boolean = false;
    isDisabled: boolean = false;

    transformedUser: any;
    view: number = 1;

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService
    ) {
        
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/recipient/media'])
                }
            }
        });
        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'media')) {
                this.user = data;
                this.transform(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        this.transform(this.user);        
    }
    

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    addMedia(){
        this.view = 2;
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

    
}
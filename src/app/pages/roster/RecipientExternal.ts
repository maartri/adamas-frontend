import { Component, OnInit, OnDestroy, Input,Output,EventEmitter } from '@angular/core'

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
        nz-divider{
            margin: 0;
        }
        p{
            margin: 0;
            cursor:pointer;
            padding:8px 5px;
        }
        .active-tab{
            background: #717e94;
            color: #fff;
        }
    `],
    templateUrl: './RecipientExternal.html',
    selector:'recipientexternal'
})


export class RecipientExternal implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    @Input() isVisible:boolean=false;
    @Input() AccountNo:any;
    @Output() recipientexternalDone:EventEmitter<any>= new EventEmitter();
    nzSelectedIndex:number=0;
    

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
                    //this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'time-attendance')) {
            
            }
        });
    }

    view(index: number) {
        this.nzSelectedIndex = index;
        
        if (index == 0) {
          //this.router.navigate(['/admin/recipient/personal'])
        }
    }
    handleCancel(){
        this.isVisible=false;
        this.recipientexternalDone.emit({
            recipientexternal:false
        });
    }
    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {

    }

 
}
import { Component, OnInit, OnDestroy, Input } from '@angular/core'

import { GlobalService, StaffService, ShareService, leaveTypes } from '@services/index';
import { Router } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';

@Component({
    styles: [`
      
    `],
    templateUrl: './personal.html'
})


export class StaffPersonalAdmin implements OnInit, OnDestroy {
    private subscription$: Subscription

    constructor(
        private sharedS: ShareService,
        private globalS: GlobalService,
        private router: Router,
    ) {
        this.subscription$ = this.sharedS.changeEmitted$.subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'personal')) {
                console.log(data);
            }
        });
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }
}
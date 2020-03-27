import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { GlobalService, } from '@services/index';
declare var Dto: any;

@Component({
    styles: [`

    `],
    templateUrl: './profile.html'
})


export class ProfileProvider implements OnInit, OnDestroy {
    user: Dto.ProfileInterface;
    constructor(
        private globalS: GlobalService
    ) {

    }

    ngOnInit() {
        const token = this.globalS.decode();
        this.user = {
            name: token.code,
            view: 'staff'
        }
    }

    ngOnDestroy() {

    }
}
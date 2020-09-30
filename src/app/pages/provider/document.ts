import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ClientService, GlobalService, StaffService, TimeSheetService, SettingsService } from '@services/index';
@Component({
    styles: [`

    `],
    templateUrl: './document.html'
})


export class DocumentProvider implements OnInit, OnDestroy {
    file: any;
    constructor(
        private globalS: GlobalService
    ) {

    }

    ngOnInit() {
        this.file = {
            view: 'staff',
            token: this.globalS.decode()
        }
    }

    ngOnDestroy() {

    }
}
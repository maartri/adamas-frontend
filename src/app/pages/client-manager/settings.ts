import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { GlobalService, SettingsService, ShareService } from '@services/index';
import { ProfileInterface } from '@modules/modules';

declare var Dto: any;

@Component({
    styles: [`
  
    `],
    templateUrl: './settings.html'
})


export class SettingsClientManager implements OnInit, OnDestroy {
   

    constructor(
        private globalS: GlobalService,
        private settings: SettingsService,
        private sharedS: ShareService
    ) {
       
    }

    ngOnInit() {
        
        
    }

    ngOnDestroy() {

    }

}
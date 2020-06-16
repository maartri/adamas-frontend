import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { GlobalService, SettingsService } from '@services/index';
declare var Dto: any;

@Component({
    styles: [`
  .side-button{
        position: fixed;
        right: 15px;
        background: #ff3737;
        color: #fff;
        width: 35px;
        height: 36px;
        cursor: pointer;
        text-align: center;
        z-index: 10;
        top: 10rem;
    }
    .side-button:hover{
        background:#ff3737db;
    }
    .side-button i{
        font-size: 18px;
        margin-top: 7px;
    }
    `],
    templateUrl: './profile.html'
})


export class ProfileClient implements OnInit, OnDestroy {
    user: Dto.ProfileInterface;
    token: any;

    visible: boolean = false;
    _settings: SettingsService;

    personID: any;

    constructor(
        private globalS: GlobalService,
        private settings: SettingsService
    ) {

    }

    ngOnInit() {
        this._settings = this.settings;
        this.token = this.globalS.decode();
        this.personID = this.token.code;
        
        this.user = {
            name: this.token.code,
            view: 'recipient',
            id: this.token.uniqueID
        }
        
    }

    ngOnDestroy() {

    }

    showNotices() {
        this.visible = true;
    }
}
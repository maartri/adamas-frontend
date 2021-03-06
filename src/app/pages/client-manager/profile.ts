import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { GlobalService, SettingsService, ShareService } from '@services/index';
import { ProfileInterface } from '@modules/modules';

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


export class ProfileClientManager implements OnInit, OnDestroy {
    user: ProfileInterface;
    token: any;

    visible: boolean = false;
    _settings: SettingsService;

    personID: any;

    constructor(
        private globalS: GlobalService,
        private settings: SettingsService,
        private sharedS: ShareService
    ) {
        this.sharedS.emitMemberPicked$
        .subscribe(data => {
            this.globalS.pickedMember = data;

            var pickedUser = data;
            this.user = {
                name: pickedUser.accountNo,
                id: pickedUser.uniqueID,
                view: 'recipient'
            }
        });
    }

    ngOnInit() {
        this._settings = this.settings;
        this.token = this.globalS.decode();
        this.personID = this.token.code;
        
        if(this.globalS.pickedMember){
            var pickedUser: any = this.globalS.pickedMember;

            this.user = {
                name: pickedUser.accountNo,
                id: pickedUser.uniqueID,
                view: 'recipient'
            }
        } else {
            this.user = {
                name: this.token.code,
                view: 'recipient',
                id: this.token.uniqueID
            }
            console.log(this.user)
        }
        
    }

    ngOnDestroy() {

    }

    showNotices() {
        this.visible = true;
    }
}
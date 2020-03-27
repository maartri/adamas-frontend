import { Component } from '@angular/core';

import { GlobalService } from '@services/index';

@Component({
    selector: '',
    templateUrl: './home.html',
    styles: [
        `
    .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
    }

    nz-header {
        background: #fff;
        padding: 0;
    }

    nz-content {
        margin: 0 16px;
    }

    nz-breadcrumb {
        margin: 16px 0;
    }

    .inner-content {
        padding: 24px;
        background: #fff;
        min-height: 360px;
    }

    nz-footer {
        text-align: center;
    }

    nz-layout{
        height:100vh;
    }



    .nz-avatar-menu{
        display: inline-block;
        margin-right: 1rem;
    }
    nz-avatar{
        cursor:pointer;
        background-color:#87d068;
    }
    .dropdown{
        position: absolute;
        right: 7px;
        width: 8rem;
        background: #fff;
        border: 1px solid #6161611a;
        z-index: 10;
    }
    .dropdown ul{
        list-style:none;
        padding:0;
        margin:0;
    }
    .dropdown ul li{
        line-height:2.5rem;
        cursor:pointer;
        text-align:center;
    }
    .dropdown ul li i{
        margin-right:10px;
    }
    .dropdown ul li:hover{
        background: #f9f9f9;
    }
    .menu-button{
        text-align:right;
    }
        `
    ]
})

export class HomeClient {
    isCollapsed = false;
    isVisible: boolean = false;

    constructor(
        private globalS: GlobalService
    ) {
        
    }
    
    logout() {
        this.globalS.logout();
    }

    onClickOutside(event: Object) {
        if (event && event['value'] === true) {
            this.isVisible = false;
        }
    }
}
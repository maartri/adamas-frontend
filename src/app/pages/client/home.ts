import { Component, OnInit } from '@angular/core';

import { GlobalService, SettingsService } from '@services/index';

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





    
    .inner-content {
        padding: 24px;
        background: #fff;
        min-height: 360px;
    }

    nz-content {
        background: #85B9D5;
        margin: 6px;
    }

    nz-layout{
        background: #85B9D5;
        height:100vh;
    }

    ul.main-list{
        background:#004165 !important;
    }
    nz-sider{
        background:#004165;
    }
    .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected, .ant-menu.ant-menu-dark .ant-menu-item-selected{
        background-color: #85B9D5;
        color: #004165;
    }
    .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected, .ant-menu.ant-menu-dark .ant-menu-item-selected i{
        color: #004165;
    }
    .ant-menu-dark, .ant-menu-dark .ant-menu-sub{
        background:#004165;
    }
        `
    ]
})

export class HomeClient implements OnInit {
    isCollapsed = false;
    isVisible: boolean = false;

    _settings: SettingsService;
    constructor(
        private globalS: GlobalService,
        private settingS: SettingsService
    ) {
        
    }

    ngOnInit(): void{
        this._settings = this.settingS;
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
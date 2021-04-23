import { Component } from '@angular/core';

@Component({
    selector: '',
    templateUrl: './home.html',
    styles: [
        `
    .logo {
        height: 2rem;
        background: url(./assets/logo/image2.png) no-repeat;
        background-size: 64%;
        margin: 7px 24px;
        width: 10rem;
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
    
    nz-footer {
        text-align: center;
    }

    nz-layout{
        height:100vh;
    }

     .inner-content {
        padding: 24px;
        background: #fff;
        min-height: 100%;  
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

export class HomeProvider {

    isCollapsed = false;
}
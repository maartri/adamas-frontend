import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { filter, tap, last } from 'rxjs/operators';
import { GlobalService } from '@services/index';

@Component({
    styles: [`
.logo {
    height: 2rem;
    background: url(../../../assets/logo/image2.png) no-repeat;
    background-size: 64%;
    margin: 9px 17px;
    width: 10rem;
}


i.fas , i.far{
    margin-right: 13px;
}

nz-header {
    padding: 0;
}

nz-content {
    background: #85B9D5;
    margin: 6px;
}

nz-breadcrumb {
    margin: 16px 0;
}

.inner-content {
    padding: 12px;
    background: #fff;
    min-height: 360px;
}

nz-footer {
    text-align: center;
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

nz-layout{
    background: #85B9D5;
    height:100vh;
}

.main-list > li >>> div{
    font-size:12px;
}
.items li{
    height: 28px;
    line-height: 30px;
    font-size: 12px;
    margin:0;
}
.items li.ant-menu-submenu .ant-menu-submenu-title{    
    line-height: 30px;
    font-size: 12px;
}
.recipient{
    background: inherit;
    position: absolute;
    top: -11rem;
}
.others{
    background: inherit;
    position: absolute;
    top: -11rem;
}
.fix-to-top{
    background: inherit;
    position: absolute;
    top: -2rem;
}
ul li{
    color:#fff;
    margin:0;
}

//#007DBA
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
.staff-icon-fix{
    float: left;
    margin-top: 12px;
}
    `],
    templateUrl: './homev2.html'
})


export class HomeV2Admin implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('recipient') elRef: ElementRef;

    isCollapsed = false;
    breadcrumbs: Array<any> = [];

    ISTAFF_BYPASS: boolean = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private globalS: GlobalService
    ) {

    }

    ngOnInit(): void {
        this.ISTAFF_BYPASS = this.globalS.ISTAFF_BYPASS == 'true' && this.globalS.ISTAFF_BYPASS != null ? true : false;
        
        // this.router.events.pipe(
        //     filter(event => event instanceof NavigationEnd)
        // ).subscribe(event => {
        //     this.createBreadCrumb(this.activatedRoute.root);
        // });
        // this.createBreadCrumb(this.activatedRoute.root);
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    toHome() {
        this.router.navigate(['/admin/landing']);
    }

    change(event: any) {
        if (event) {
            var x = document.getElementById('cdk-overlay-2');
            console.log(x);
        }
    }
}
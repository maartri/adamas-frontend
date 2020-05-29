import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { filter, tap, last } from 'rxjs/operators';
import { GlobalService } from '@services/index';

@Component({
    styles: [`
.logo {
    height: 18px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}

i.fas , i.far{
    margin-right: 13px;
}

nz-header {
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
nz-content{
    background: #1890ff;
}
nz-layout{
    background: #1890ff;
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
ul.main-list{
    background:#007DBA;
}
nz-sider{
    background:#004165;
}
.ant-menu-item-selected{
    color:#85B9D5;
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
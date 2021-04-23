import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';

import { GlobalService, SettingsService, ShareService, ClientService } from '@services/index';
import { Observable, Subject, EMPTY } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

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
    
    nz-content {
        margin: 0 16px;
    }

    nz-breadcrumb {
        margin: 16px 0;
    }

    .inner-content {
        padding: 12px;
        background: #fff;
        min-height: 100%;    
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
    nz-header {
        padding: 0;
    }
    .logged-in-user{
        height: 3rem;
        display: inline-flex;
        padding: 10px;
        line-height: 1rem;
        width: 100%;
    }
    .logged-in-user div{
        position:relative;
    }
    .belongsto-user{
        font-size: 10px;
        color: #6eff00;
        line-height: 1.5rem;
    }
    .logged-in-user i{
        position: absolute;
        top: 0.5rem;
        right: -2.5rem;
        cursor: pointer;
    }
    .logged-in-user i:hover{
        color:#62ff00;
    }
        `
    ]
})

export class HomeClientManager implements OnInit {
    
    isCollapsed = false;
    isVisible: boolean = false;
    hideAccess: boolean = true;

    _settings: SettingsService;
    changeRoute = new Subject<string>();
    currRoute: string;

    pickedUser: any;


    constructor(
        private globalS: GlobalService,
        private settingS: SettingsService,
        private router: Router,
        private sharedS: ShareService,
        private clientS: ClientService,
        private activatedRoute: ActivatedRoute
    ) {
        
        var {user} = this.globalS.decode();

        this.changeRoute.pipe(switchMap(index => {
            this.router.navigate([index]);
            return this.settingS.getSettingsObservable(user);
        })).subscribe(index => {
            this.globalS.settings = index;
        });

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
          ).subscribe(event => {
            var routeArr = this.removeHomeRoutes(this.createBreadCrumb(this.activatedRoute.root));
            this.currRoute = routeArr[routeArr.length - 1].url;
        });

        // For the Client Manager
        this.sharedS.emitMemberPicked$
        .subscribe(data => {
            this.globalS.pickedMember = data;
            this.pickedUser = data;
            this.router.navigate([`client-manager/profile`]);
        });
    }

    ngOnInit(): void{
        this._settings = this.settingS;

        if(this.globalS.pickedMember){
            this.sharedS.emitMemberPickedChange(this.globalS.pickedMember);
        }
    }
    
    logout() {
        this.globalS.logout();
    }

    onClickOutside(event: Object) {
        if (event && event['value'] === true) {
            this.isVisible = false;
        }
    }

    createBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<any> = []): Array<any> {
        const children: Array<ActivatedRoute> = route.children;
    
        if (children.length === 0) {
          return breadcrumbs;
        }
    
        for (var child of children) {
          const routeURL: string = child.snapshot.url.map(x => x.path).join('/');
          if (routeURL !== '') {
            url += `/${routeURL}`;
          }
          breadcrumbs.push({ label: routeURL, url: url })
          return this.createBreadCrumb(child, url, breadcrumbs);
        }
    }

    MEMBER_LENGTH(memLength: number){
        if(memLength > 0){
            this.hideAccess = false;
        }
    }

    toMemberPage(){
        this.pickedUser = null;
        localStorage.removeItem('settings');
        this.globalS.settings = this.globalS.originalSettings;

        setTimeout(() => {
            this._settings = this.settingS; 
        }, 100);

        localStorage.removeItem('picked_member');
        this.router.navigate(['client/members']);
    }

    removeHomeRoutes(routes: Array<any>): Array<any> {
        let finalRoutes = [...routes];
    
        if (finalRoutes.length === 0) {
          return routes;
        }
    
        var removeIndexes = [];
        for (let route in routes) {
          const url = routes[route].label;
          if (url === 'admin' || url === 'landing') {
            removeIndexes.push(parseInt(route));
          }
        }
    
        for (var i = removeIndexes.length - 1; i >= 0; i--)
          finalRoutes.splice(removeIndexes[i], 1);
    
        finalRoutes.forEach(x => x.label = x.label.replace(/^\w/, c => c.toUpperCase()));
    
        return finalRoutes;
      }
}
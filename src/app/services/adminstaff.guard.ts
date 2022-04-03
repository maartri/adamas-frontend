import { Injectable } from '@angular/core';
import { GlobalService } from '@services/global.service';
import { SettingsService } from '@services/settings.service';

import { Observable, Subject, EMPTY, of } from 'rxjs';
import * as _ from 'lodash';

import {
    CanActivate,
    Router,
    CanActivateChild,
    ActivatedRouteSnapshot,
    ActivatedRoute,
    RouterStateSnapshot
} from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
// import 'rxjs/add/operator/map'

@Injectable()
export class AdminStaffRouteGuard implements CanActivate, CanActivateChild{

    constructor(
        private globalS: GlobalService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private settingS: SettingsService
    ){

    }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {   
              
        if(this.detectStaffDirectAccess(route, state)){
            this.globalS.redirectURL = state.url;
            return true;
        }

        // console.log(this.globalS.GETPICKEDMEMBERROLEANDUSER());
        // console.log(this.globalS.decode()

        var ss =this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERROLEANDUSER() : this.globalS.decode();
        console.log(ss)

        const { role, user } = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERROLEANDUSER() : this.globalS.decode();

        return this.settingS.getSettingsObservable(user).pipe(
            switchMap((data: any) => {
                console.log(data);
                this.globalS.settings = data;
                if(this.globalS.isExpired){
                    return of(false);
                }
                return data;
            }),
            switchMap((data: any) => {
                if(role === 'PORTAL CLIENT'){
                    return of(this.CHECKPORTALROUTES(this.removeHomeRoutes(this.createBreadCrumb(route.root)), this.globalS.settings));
                }
                return of(true);
            })
        );
    }

    createBreadCrumb(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Array<any> = []): Array<any> {
        const children: Array<ActivatedRouteSnapshot> = route.children;
    
        if (children.length === 0) {
          return breadcrumbs;
        }
    
        for (var child of children) {
          const routeURL: string = child.url.map(x => x.path).join('/');
          if (routeURL !== '') {
            url += `/${routeURL}`;
          }
          breadcrumbs.push({ label: routeURL, url: url })
          return this.createBreadCrumb(child, url, breadcrumbs);
        }
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

    CHECKPORTALROUTES(data: Array<any>, settings: any): boolean {
        if(data.length < 1) return false;
        // console.log(this.settingS.CANMANAGEPREFERENCES())
        // console.log(data[data.length - 1].url)

        const currentURL = data[data.length - 1].url;

        if(currentURL === '/client/profile'){
            return true;
        }

        if(currentURL === '/client/notes'){
            return true;
        }

        if(currentURL === '/client/package' && this.settingS.VIEWPACKAGESTATEMENT()){
            return true;
        }

        if(currentURL === '/client/booking' && this.settingS.ALLOWBOOKING()){
            return true;
        }

        if(currentURL === '/client/calendar'){
            return true;
        }

        if(currentURL === '/client/history'){
            return true;
        }

        if(currentURL === '/client/document'){
            return true;
        }

        if(currentURL === '/client/preferences' && this.settingS.CANMANAGEPREFERENCES()){
            return true;
        }

        if(currentURL === '/client/manage-services' && this.settingS.CANMANAGESERVICES()){
            return true;
        }

        this.router.navigate(['client/unauthorized'])
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {     
        return true;
    }

    detectStaffDirectAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(state.url.split('/').length == 5) return true;
        return false;
    }

}
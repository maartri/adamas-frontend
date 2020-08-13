import { Injectable } from '@angular/core';
import { GlobalService } from '@services/global.service';
import { SettingsService } from '@services/settings.service';

import { Observable, Subject, EMPTY, of } from 'rxjs';
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
export class RouteGuard implements CanActivate, CanActivateChild{

    constructor(
        private globalS: GlobalService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private settingS: SettingsService
    ){

    }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {  
        // console.log(this.globalS.settings)
        // console.log(this.globalS.decode())
        const { role, user } = this.globalS.decode();
        // console.log('haha')

        // if(role === 'PORTAL CLIENT'){
        //     console.log('haha')
        //     this.settingS.getSettingsObservable(user).subscribe(data => {
        //         console.log(data);
        //         return false;
        //     });
        // }

        // if (!this.globalS.isExpired()) {
        //     return true;
        // }

       
        
        // this.router.navigate(['']);

        // this.detectStaffDirectAccess(state.url);
        // return false;

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
            // map((e: any) => {
            //     if (e) {
            //             return false;
            //         } else {
            //             return false;
            //         }
            //     },
            // catchError((err: any) => {
            //     this.router.navigate(['']);
            //     return of(false);
            // })
        );
    }

    CHECKPORTALROUTES(data: Array<any>, settings: any): boolean {
        if(data.length < 1) return false;
        console.log(this.settingS.CANMANAGEPREFERENCES())
        console.log(data[data.length - 1].url)

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

    isStaffDirectAccess(url: string): boolean {
        console.log(url)
        const urlLen = url.split('?');

        if (urlLen.length > 1 && new URLSearchParams(urlLen[1]).has('securityByPass') &&
            new URLSearchParams(urlLen[1]).get('securityByPass')) {
            return true;
        }
        
        return false;
    }
    
    detectStaffDirectAccess(url: string) {
        const urlLen = url.split('?');

        if (urlLen.length > 1 && new URLSearchParams(urlLen[1]).has('securityByPass') &&
            new URLSearchParams(urlLen[1]).get('securityByPass')) {            
            this.globalS.redirectURL = url;
        }

        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {     
        if(!this.globalS.isExpired()){
            return true;
        }

        this.router.navigate(['']);

        this.detectStaffDirectAccess(state.url);

        return false;
    }
}
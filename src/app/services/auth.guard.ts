import { Injectable } from '@angular/core';
import { GlobalService } from '@services/global.service';

import {
    CanActivate,
    Router,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class RouteGuard implements CanActivate, CanActivateChild{

    constructor(
        private globalS: GlobalService,
        private router: Router
    ){

    }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{  
        console.log(this.globalS.redirectURL)

        if (!this.globalS.isExpired()) {
            return true;
        }

        this.router.navigate(['']);

        this.detectStaffDirectAccess(state.url);
        return false;
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
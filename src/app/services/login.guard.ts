import { Injectable } from '@angular/core'
import { Router, CanActivate, CanActivateChild } from '@angular/router'

import { GlobalService } from './global.service';

@Injectable()
export class LoginGuard implements CanActivate, CanActivateChild{

    constructor(
        private globalS: GlobalService,
        private router: Router
    ){

    }
 
    canActivate(): boolean{           
        if(this.globalS.isEmpty(this.globalS.token) || this.globalS.isExpired()){
            this.globalS.clearTokens();
            return true;
        }
        this.globalS.viewRender(this.globalS.token);
        return false;
    }

    canActivateChild():boolean {     
        if(!this.globalS.isExpired()){
            return true;
        }
        this.router.navigate(['']);
        return false;
    }
}
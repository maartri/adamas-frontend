import { Injectable } from '@angular/core'
import {
    CanActivate,
    Router,
    CanActivateChild,
    ActivatedRouteSnapshot,
    ActivatedRoute,
    RouterStateSnapshot
} from '@angular/router';

import { GlobalService, LoginService, JsreportService, SettingsService } from '@services/index';
import * as CryptoJS from 'crypto-js';
import { switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ByPassGuard implements CanActivate{

    secretKey = "YourSecretKeyForEncryption&Descryption";

    constructor(
        private globalS: GlobalService,
        private router: Router,
        private loginS: LoginService,
        private settingS: SettingsService,
        private jsreportS: JsreportService,
    ){

    }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{  

            // http://localhost:4400/#/?redirectUrl=%2Fadmin%2Frecipient&token=U2FsdGVkX18rcBVah5iuKYDU2NFcIMwy3zBBe8sfJ0uc4L1cpgKKQXUZwaKnPdLE

            // http://localhost:4400/#/?redirectUrl=admin/recipient&token=U2FsdGVkX18rcBVah5iuKYDU2NFcIMwy3zBBe8sfJ0uc4L1cpgKKQXUZwaKnPdLE&user=SYSMGR

            //http://localhost:4400/#/?redirectUrl=admin/recipient&token=U2FsdGVkX18rcBVah5iuKYDU2NFcIMwy3zBBe8sfJ0uc4L1cpgKKQXUZwaKnPdLE?user=SYSMGR

            // http://localhost:4400/#/?redirectUrl=admin/daymanager&token=U2FsdGVkX18rcBVah5iuKYDU2NFcIMwy3zBBe8sfJ0uc4L1cpgKKQXUZwaKnPdLE&user=KATIJACOBS
       
            if(route.queryParams['redirectUrl'] && route.queryParams['token'] && route.queryParams['user'] )
            {
                var url = route.queryParams['redirectUrl'];
                var token = route.queryParams['token'];
                var userName = route.queryParams['user'];

                var decryptedVal = this.decrypt(token);
                var parsedObject = JSON.parse(decryptedVal);

                if(parsedObject.bypass && parsedObject.admin){
                    // this.globalS.token = token;

                    let user = {
                        Username: userName,
                        Password: 'sysmgr',
                        Bypass: true
                    }

                    // this.loginS.login(user, true).subscribe(data => {
                    //     this.globalS.token = data.access_token;
                    //     this.router.navigate([url]);
                    // }); 


                    this.settingS.getSettingsObservable(user.Username).pipe(
                        switchMap(x => {
                          this.globalS.settings = x;
                          this.globalS.originalSettings = x;
                  
                          return this.jsreportS.getconfiguration()
                        }),
                        switchMap(x => {
                          this.globalS.jsreportSettings = x;
                          return this.loginS.login(user);
                        }) 
                      ).subscribe(data => {
                          this.globalS.token = data.access_token;
                          
                          this.router.navigate([url]);
                  
                        //   setTimeout(() => {
                        //     this.globalS.viewRender(this.globalS.token);
                        //   }, 200);
                        }, (error: HttpErrorResponse) => {

                          
                        });
                }
                return false;
            }
      
        return  true;
    }


    encrypt(value : string) : string{
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }
    
    decrypt(textToDecrypt : string){
        return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }

    // canActivateChild():boolean {     
    //     if(!this.globalS.isExpired()){
    //         return true;
    //     }
    //     this.router.navigate(['']);
    //     return false;
    // }
}
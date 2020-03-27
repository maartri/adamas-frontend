import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';
import { map,retry, takeUntil, catchError, delay } from 'rxjs/operators';

import { GlobalService } from './global.service';

const headers = new HttpHeaders().set('Content-Type','application/json')
            
@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient,
        private GlobalS: GlobalService
    ){ }

    post(url: string, data: any, _headers: HttpHeaders = null): Observable<any>{

        return this.http.post(url, data, { headers: _headers || headers })
                        // .pipe(
                        //     catchError(this.handleError)
                        // )
    }

    uploadFile(url: string, data: FormData): Observable<any>{

        return this.http.post(url, data, { reportProgress: true })
        
                        // .pipe(
                        //     catchError(this.handleError)
                        // )
    }

    get(url: string, params: any = null): Observable<any>{
        var _params = this.GlobalS.serialize(params);
        return this.http.get(url, { params: _params })
                    // .pipe(
                    //     catchError(this.handleError)
                    // )
    }

    put(url: string, data: any): Observable<any>{
        return this.http.put(url, data, { headers })
                        // .pipe(
                        //     catchError(this.handleError)
                        // )
    }

    delete(url:string, params: any = null): Observable<any>{
        var _params = this.GlobalS.serialize(params);
        return this.http.delete(url, { params: _params })
                    // .pipe(
                    //     catchError(this.handleError)
                    // )
    }

    private handleError(error: HttpErrorResponse) {       
        // if (error.message === "No JWT present or has expired") {
        //     this.global.TokenExpired = 'true';
        //     this.global.logout();
        //     return Observable.empty();
        // }        
        return throwError(error);
    }

}
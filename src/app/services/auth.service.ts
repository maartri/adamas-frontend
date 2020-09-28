import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable ,  throwError } from 'rxjs';
import { map,retry, takeUntil, catchError, delay } from 'rxjs/operators';

import { GlobalService } from './global.service';

const headers = new HttpHeaders().set('Content-Type','application/json')
            
@Injectable({
    providedIn: 'root'
})
export class AuthService implements ErrorHandler{
    constructor(
        private http: HttpClient,
        private GlobalS: GlobalService,
        private injector: Injector
    ) { 
        
    }

    getImage(url: string, params: any = null): Observable<any> {
        var _params = this.GlobalS.serialize(params);
        return this.http.get(url, { params: _params })
            .pipe(
                catchError(err => this.handleError(err))
            )
    }

    post(url: string, data: any, _headers: HttpHeaders = null): Observable<any>{
        return this.http.post(url, data, { headers: _headers || headers })
                        .pipe(
                            catchError(err => this.handleError(err))
                        )
    }

    uploadFile(url: string, data: FormData): Observable<any>{

        return this.http.post(url, data, { reportProgress: true })        
                        .pipe(
                            catchError(err => this.handleError(err))
                        )
    }

    get(url: string, params: any = null): Observable<any>{
        var _params = this.GlobalS.serialize(params);
        return this.http.get(url, { params: _params })
                    .pipe(
                        catchError(err => this.handleError(err))
                    )
    }

    put(url: string, data: any = null): Observable<any>{
        return this.http.put(url, data, { headers })
                        .pipe(
                            catchError(err => this.handleError(err))
                        )
    }

    delete(url:string, params: any = null): Observable<any>{
        var _params = this.GlobalS.serialize(params);
        return this.http.delete(url, { params: _params })
                    .pipe(
                        catchError(err => this.handleError(err))
                    )
    }

    handleError(error: Error | HttpErrorResponse) {       
        // if (error.message === "No JWT present or has expired") {
        //     this.global.TokenExpired = 'true';
        //     this.global.logout();
        //     return Observable.empty();
        // }
        // this.GlobalS.eToast('Error', 'An error occured');
        return throwError(error);
    }

}
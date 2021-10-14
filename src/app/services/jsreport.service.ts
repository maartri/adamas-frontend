import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const url: string = "api/jsreport"

@Injectable()
export class JsreportService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ){ }

    getconfiguration(): Observable<any>{
        return this.auth.get(`${url}/configuration`);
    }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from '@services/global.service';
import { JsConfig } from '@modules/modules';

const url: string = "https://www.mark3nidad.com:5488/api/report"

@Injectable()
export class PrintService {
    constructor(
        public http: HttpClient,
        private sanitizer: DomSanitizer,
        public auth: AuthService,
        public globalS: GlobalService
    ){ }

    print(data: any): Observable<any>{

        let encoded = this.globalS.jsreportSettings;

        var _headers = new HttpHeaders()
            .append('Content-Type','application/json')
            .append('Accept','application/json')
            .append('Authorization',`Basic ${encoded}`);

        return this.http.post(`${url}`, JSON.stringify(data), { headers: _headers, responseType: 'blob' });
    }
}
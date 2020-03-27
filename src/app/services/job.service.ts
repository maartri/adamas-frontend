import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const job: string = "api/job"

@Injectable()
export class JobService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ){ }

    poststartjob(data: any): Observable<any>{
        return this.auth.post(`${job}/start-job`, data);
    }

    postendjob(data: any): Observable<any>{
        return this.auth.post(`${job}/end-job`, data);
    }


}
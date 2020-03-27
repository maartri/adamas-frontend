import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

const exec: string = "api/executable"

@Injectable()
export class ExecutableService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ){ }

 
    updateexecutable(user: any): Observable<any>{
        return this.auth.put(`${exec}/select-user`, user);
    }



}
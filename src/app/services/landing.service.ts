import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const landing: string = "api/landing"

@Injectable()
export class LandingService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ){ }

    // Add/ChangeUsers    
    GetUserRecord(name: string):Observable<any>{
        return this.auth.get(`${landing}/GetUserRecord/${name}`)
    }

}
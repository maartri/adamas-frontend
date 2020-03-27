import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const url: string = "api/cache"

@Injectable()
export class CacheService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ){ }

    getusers(): Observable<any>{
        return this.auth.get(`${url}`);
    }

    deleteuser(id: string): Observable<any>{
        return this.auth.get(`${url}/remove/${id}`);
    }
}
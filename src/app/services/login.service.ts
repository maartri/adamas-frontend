import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { URL } from '@constants/constant';

const login: string = `api/login`;
const global: string = `api/global`;

@Injectable()
export class LoginService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ) { }

    getcurrentuser() {
        return this.http.get(`${global}/current-user`)
    }

    testservice() {
        return this.http.get(`${login}/test-service`)
    }

    login(data: any, bypass: boolean = false) {
        return this.auth.post(`${login}`, data);
    }

    logout(uid: string) {
        return this.auth.post(`${login}/logout`, JSON.stringify(uid));
    }

    serialize(obj: any) {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var element = obj[key];
                params.set(key, element);
            }
        }
        return params;
    }
}
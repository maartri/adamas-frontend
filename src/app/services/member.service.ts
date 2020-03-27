import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';


const members: string = "api/members";

@Injectable()
export class MemberService {
    constructor(
        private auth: AuthService
    ){ }

    getmembers(data: any){
        return this.auth.get(`${members}/members`, data);
    }
}
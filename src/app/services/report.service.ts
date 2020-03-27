import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const report = 'api/report';
@Injectable()
export class ReportService {
    constructor(
        private auth: AuthService
    ){}

    getreferrallist(): Observable<any>{
        return this.auth.get(`${report}/referrallist`);
    }
}
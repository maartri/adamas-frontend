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
    InsertReport(sqlString: string): Observable<any>{
        return this.auth.post(`${report}/addReport`, {Sql: sqlString})
    } 
    GetReportNames(format: string): Observable<any>{
        return this.auth.get(`${report}/getreportlist/${format}`);
    }
    GetReportSql(title: string,Format : string): Observable<any>{
        return this.auth.get(`${report}/report-sql/${title}/${Format}`);
    }   
    GetReportFormat(name: string): Observable<any>{
        return this.auth.get(`${report}/report-format/${name}`);
    }
//
    GetBranchFilters(user: string): Observable<any>{
        return this.auth.get(`${report}/branchviewfilter/${user}`);
    }
    GetProgramFilters(user: string): Observable<any>{
        return this.auth.get(`${report}/Programviewfilter/${user}`);
    }
    GetCoordinaterFilters(user: string): Observable<any>{
        return this.auth.get(`${report}/coordinaterviewfilter/${user}`);
    }




}
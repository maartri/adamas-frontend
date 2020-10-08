import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { URL } from '@constants/constant';

const menu: string = "api/menu";


@Injectable()
export class MenuService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ){ }

    getlistbranches(): Observable<any>{
        return this.auth.get(`${menu}/branches`)
    }

    AddBranch(brnch: Dto.Branch): Observable<any> {
        return this.auth.put(`${menu}/addBranch`, brnch)
    }
    addDomain(sqlString: string):Observable<any>{
        return this.auth.post(`${menu}/addDomain/`, { Sql: sqlString});
        
    }

   
    InsertRecord(sqlString: string): Observable<any>{
        return this.auth.post(`${menu}/insertSql-list`, { Sql: sqlString})
        
    }
    

}
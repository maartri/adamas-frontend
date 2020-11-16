import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { URL } from '@constants/constant';
import { Branch } from '@modules/modules';

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

    AddBranch(brnch: Branch): Observable<any> {
        return this.auth.put(`${menu}/addBranch`, brnch)
    }
UpdateBranch(brnch: Branch): Observable<any> {
        return this.auth.put(`${menu}/UpdateBranch`, brnch)
    }
 
    updatUDomain(sqlString: string):Observable<any>{
        return this.auth.post(`${menu}/updateDomain/`, { Sql: sqlString});
        
    }

   
    InsertRecord(sqlString: string): Observable<any>{
        return this.auth.post(`${menu}/insertSql-list`, { Sql: sqlString})
        
    }
    

}
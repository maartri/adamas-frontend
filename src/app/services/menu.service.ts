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
    
    getlistServices():Observable<any>{
        return this.auth.get(`${menu}/Services`)
    }
    getlistItemConsumables():Observable<any>{
        return this.auth.get(`${menu}/itemConsumable`)
    }
    getlistMenuMeals():Observable<any>{
        return this.auth.get(`${menu}/menuMeals`)
    }
    GetlistcaseManagement():Observable<any>{
        return this.auth.get(`${menu}/caseManagement`)
    }
    GetlistStaffAdminActivities():Observable<any>{
        return this.auth.get(`${menu}/staffAdminActivities`)
    }
    GetlistRecipientAbsenses():Observable<any>{
        return this.auth.get(`${menu}/recipientAbsenses`)
    }
    Getlistequipments():Observable<any>{
        return this.auth.get(`${menu}/equipments`)
    }
    GetlistagencyPayTypes():Observable<any>{
        return this.auth.get(`${menu}/agencyPayTypes`)
    }
    getlistFundingSource(): Observable<any>{
        return this.auth.get(`${menu}/fundingSource`)
    }
    getlistProgramPackages():Observable<any>{
        return this.auth.get(`${menu}/programPackages`)
    }
    getlistvehicles():Observable<any>{
        return this.auth.get(`${menu}/vehicles`)
    }
    getlistactivityGroups():Observable<any>{
        return this.auth.get(`${menu}/activityGroups`)
    }
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
    InsertDomain(sqlString: string): Observable<any>{
        return this.auth.post(`${menu}/addDomain`, { Sql: sqlString})
    }
}
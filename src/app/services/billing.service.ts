import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { GlobalService } from './global.service';

import { GetStaff, MiscellaneousNote, AttendanceStaff, CoordinatorEmail, InputAllocateStaff, UpdateNote, ClaimVariation, DayManager, GetRecipient, InputFilter, RecordIncident, GetTimesheet , RosterInput, AddClientNote, ApplicationUser, InputShiftBooked, InputShiftSpecific } from '@modules/modules';

const billing: string = "api/billing";

declare var Dto: any;
@Injectable()
export class BillingService {

    constructor(
        public http: HttpClient,
        public auth: AuthService,
        public globalS: GlobalService
    ) { }

    postdebtorbilling(data: any): Observable<any> {
        return this.auth.post(`${billing}/post-debtor-billing`, data)
    }
    getlistProgramPackagesFilter(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/programPackagesFilter/${is_where}`)
    }
    updateCloseRosterPeriod(data: any): Observable<any> {
        return this.auth.put(`${billing}/closeRosterPeriod`, data);
    }
    getDebtorRecords(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getDebtorRecordset/${is_where}`)
    }

    //States
    getActiveStates(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveStates/${is_where}`)
    }
    getActivePeriodStates(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodStates`, data);
    }

    //Funding Regions
    getActiveFundingRegions(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveFundingRegions/${is_where}`)
    }
    getActivePeriodFundingRegions(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodFundingRegions`, data);
    }

    //Service Provider ID's (SPID)
    getActiveServiceProvider(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveServiceProvider/${is_where}`)
    }
    getActivePeriodServiceProvider(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodServiceProvider`, data);
    }

    //DS Outlets
    getActiveDsOutlets(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveDsOutlets/${is_where}`)
    }
    getActivePeriodDsOutlets(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodDsOutlets`, data);
    }

    //Branches
    getActiveBranches(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveBranches/${is_where}`)
    }
    getActivePeriodBranches(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodBranches`, data);
    }

    //Funding Type
    getActiveFundingType(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveFundingType/${is_where}`)
    }
    getActivePeriodFundingType(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodFundingType`, data);
    }

    //Care Domains
    getActiveCareDomains(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveCareDomains/${is_where}`)
    }
    getActivePeriodCareDomains(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodCareDomains`, data);
    }

    //Service Budget Codes
    getActiveServiceBudget(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveServiceBudget/${is_where}`)
    }
    getActivePeriodServiceBudget(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodServiceBudget`, data);
    }

    //Service Disciplines
    getActiveServiceDiscip(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveServiceDiscip/${is_where}`)
    }
    getActivePeriodServiceDiscip(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodServiceDiscip`, data);
    }

    //Service Regions
    getActiveServiceRegions(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveServiceRegions/${is_where}`)
    }
    getActivePeriodServiceRegions(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodServiceRegions`, data);
    }

    //Service Types
    getActiveServiceTypes(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveServiceTypes/${is_where}`)
    }
    getActivePeriodServiceTypes(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodServiceTypes`, data);
    }

    //Programs
    getActivePrograms(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActivePrograms/${is_where}`)
    }
    getActivePeriodPrograms(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodPrograms`, data);
    }

    //Coordinators/Staff Mgrs
    getActiveCoordinators(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveCoordinators/${is_where}`)
    }
    getActivePeriodCoordinators(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodCoordinators`, data);
    }

    //Cost Centers
    getActiveCostCenters(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveCostCenters/${is_where}`)
    }
    getActivePeriodCostCenters(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodCostCenters`, data);
    }

    //Recipients
    getActiveRecipients(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveRecipients/${is_where}`)
    }
    getActivePeriodRecipients(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodRecipients`, data);
    }

    //Staff
    getActiveStaff(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveStaff/${is_where}`)
    }
    getActivePeriodStaff(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodStaff`, data);
    }

    //Staff Category
    getActiveStaffCategory(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveStaffCategory/${is_where}`)
    }
    getActivePeriodStaffCategory(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodStaffCategory`, data);
    }

    //Teams
    getActiveTeams(is_where: boolean):Observable<any>{
        return this.auth.get(`${billing}/getActiveTeams/${is_where}`)
    }
    getActivePeriodTeams(data: any):Observable<any>{
        return this.auth.post(`${billing}/getActivePeriodTeams`, data);
    }
}
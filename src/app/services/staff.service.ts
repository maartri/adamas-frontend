import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';

import { Roster, ClaimVariation, TravelClaim, ClientNote, RosterNote, RecordIncident, LeaveEntry , Staffs } from '@modules/modules';

const staff: string = "api/staff"
const timesheet: string = "api/timesheet"
const global: string = "api/global"

declare var Dto: any;
@Injectable()
export class StaffService {
    constructor(
        private auth: AuthService
    ) { }

    getimages(data: any): Observable<any> {
        return this.auth.getImage(`${staff}/images`, data);
    }

    postincidentapplication(data: any): Observable<any> {
        return this.auth.post(`${staff}/incident-application`, data);
    }

    isAccountNoUnique(name: string): Observable<any> {
        return this.auth.get(`${staff}/is-accountno-unique/${name}`);
    }

    getstaffrecordview(uname: string): Observable<any> {
        return this.auth.get(`${staff}/staffrecordview/${uname}`);
    }

    updatedisabilitystatus(data: any): Observable<any> {
        return this.auth.put(`${staff}/disabilitystatus`, data)
    }

    getprofile(code: string): Observable<any> {
        return this.auth.get(`${staff}/profile/${code}`);
    }

    poststaffprofile(data: any) {
        return this.auth.post(`${staff}/profile`, data);
    }

    getaddress(code: string): Observable<any> {
        return this.auth.get(`${staff}/address/${code}`);
    }

    getcontacts(code: string): Observable<any> {
        return this.auth.get(`${staff}/contact/${code}`);
    }

    getpayperiod(): Observable<any> {
        return this.auth.get(`${staff}/payperiod`);
    }

    getsettings(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/user/settings/${name}`);
    }

    getroster(roster: Roster) {
        return this.auth.get(`${timesheet}/roster`, roster);
    }

    getmobilefuturelimit(name: string) {
        return this.auth.get(`${staff}/mobilefuturelimit/${name}`);
    }

    postclaimvariation(cv: ClaimVariation): Observable<any> {
        return this.auth.post(`${staff}/claimvariation`, cv);
    }

    posttravelclaim(claim: TravelClaim): Observable<any> {
        return this.auth.post(`${staff}/travelclaim`, claim);
    }

    postclientnote(cnote: ClientNote): Observable<any> {
        return this.auth.post(`${staff}/clientnote`, cnote);
    }

    postrecordincident(incident: RecordIncident): Observable<any> {
        return this.auth.post(`${staff}/incident`, incident);
    }

    updaterosternote(note: RosterNote): Observable<any> {
        return this.auth.put(`${staff}/notes`, note);
    }

    updateusername(staffVal: Staffs): Observable<any> {
        return this.auth.put(`${staff}/user/name`, staffVal);
    }

    postleave(entry: LeaveEntry): Observable<any> {
        return this.auth.post(`${staff}/leave`, entry);
    }
}
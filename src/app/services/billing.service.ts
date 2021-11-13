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
}
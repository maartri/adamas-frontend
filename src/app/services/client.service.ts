import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';
import { URL } from '@constants/constant';

import { WorkerInput,  GetPackage, ApproveService, QualifiedStaff, SuburbIn, ProgramActive, AddBooking, RecordIncident, NamesAndAddresses, PhoneFaxOther, Recipients} from '@modules/modules';

const client: string = `api/client`;
const global: string = `api/global`

declare var Dto: any;
@Injectable()
export class ClientService {
    constructor(
        private auth: AuthService
    ) { }

    gethideportalbalance(uname: string):Observable<any>{
        return this.auth.get(`${client}/hideportalbalance/${uname}`);
    }

    getnotepermissions(id: string): Observable<any>{
        return this.auth.get(`${client}/note-permissions/${id}`);
    }

    getuserinfoname(accountNo: string): Observable<any>{
        return this.auth.get(`${client}/userinfo-name/${accountNo}`);
    }

    getagencydefinedgroup(accountNo: string): Observable<any>{
        return this.auth.get(`${client}/agencydefinedgroup/${accountNo}`);
    }

    postprofile(data: any): Observable<any> {
        return this.auth.post(`${client}/profile`, data);
    }
     
    addRefreminder(sqlString: string): Observable<any>{
        return this.auth.post(`${client}/addrefreminder`, { Sql: sqlString})
    }
    isAccountNoUnique(name: string): Observable<any> {
        return this.auth.get(`${client}/is-accountno-unique/${name}`);
    }

    postcancelbooking(data: any): Observable<any> {
        return this.auth.post(`${client}/cancel-booking`, data);
    }

    getservicenotes(data: any): Observable<any> {
        return this.auth.get(`${client}/servicenotes`, data);
    }

    postemailcoordinator(data: any): Observable<any> {
        return this.auth.post(`${client}/email-coordinator`, data);
    }

    postpreferences(id: string, preferences: Array<string>): Observable<any> {
        return this.auth.post(`${client}/preferences/${id}`, preferences);
    }

    getpreferences(id: string): Observable<any> {
        return this.auth.get(`${client}/preferences/${id}`);
    }

    getusergroup(id: string): Observable<any> {
        return this.auth.get(`${client}/usergroups/${id}`);
    }

    getprofile(code: string): Observable<any> {
        return this.auth.get(`${client}/profile`, { code: code })
    }

    getaddress(id: string): Observable<any> {
        return this.auth.get(`${client}/address`, { id: id })
    }

    getusualaddress(id: string): Observable<any> {
        return this.auth.get(`${client}/address/usual/${id}`)
    }

    gettopaddress(idList: Array<string>): Observable<any> {
        return this.auth.get(`${client}/address/top`, { idList: idList });
    }

    getprimaryaddressnyname(name: string): Observable<any> {
        return this.auth.get(`${client}/address/primary/name/${name}`)
    }

    getprimaryaddress(id: string): Observable<any> {
        return this.auth.get(`${client}/address/primary/${id}`)
    }

    getcontacts(id: string): Observable<any> {
        return this.auth.get(`${client}/contact`, { id: id })
    }

    getservicesapproved(id: string): Observable<any> {
        return this.auth.get(`${client}/services/approved/${id}`);
    }

    getcaseprogressnote(id: string): Observable<any> {
        return this.auth.get(`${client}/note/caseprogress/${id}`);
    }

    getopnote(id: string): Observable<any> {
        return this.auth.get(`${client}/note/opnote/${id}`);
    }

    getrostermaster(worker: WorkerInput): Observable<any> {
        return this.auth.get(`${client}/roster/master`, worker);
    }

    getrosterworker(worker: WorkerInput): Observable<any> {
        return this.auth.get(`${client}/roster/worker`, worker);
    }

    getcurrentcareplan(id: string): Observable<any> {
        return this.auth.get(`${client}/careplan/current/${id}`);
    }

    getprogramsapproved(id: string): Observable<any> {
        return this.auth.get(`${client}/programs/approved/${id}`);
    }

    getrelativecontacts(id: string): Observable<any> {
        return this.auth.get(`${client}/contact/relative/${id}`);
    }

    getalerts(id: string): Observable<any> {
        return this.auth.get(`${client}/alerts/${id}`);
    }

    getservicetasklist(id: string): Observable<any> {
        return this.auth.get(`${client}/servicetasklist/${id}`);
    }

    getcontacttype(): Observable<any> {
        return this.auth.get(`${client}/contact/type`)
    }

    getaddresstype(): Observable<any> {
        return this.auth.get(`${client}/address/type`)
    }

    getmanagers(): Observable<any> {
        return this.auth.get(`${global}/managers`)
    }

    getsuburb(suburb: SuburbIn): Observable<any> {
        return this.auth.get(`${global}/suburb`, suburb)
    }

    getactiveprogram(program: ProgramActive): Observable<any> {
        return this.auth.get(`${client}/program/active`, program)
    }

    getpackages(getpackage: GetPackage): Observable<any> {
        return this.auth.get(`${client}/package`, getpackage)
    }

    getbalances(getpackage: GetPackage): Observable<any> {
        return this.auth.get(`${client}/balances`, getpackage);
    }

    getapprovedservices(service: ApproveService): Observable<any> {
        return this.auth.get(`${client}/approvedservices`, service);
    }

    getqualifiedstaff(staff: QualifiedStaff): Observable<any> {
        return this.auth.get(`${client}/qualifiedstaff`, staff);
    }

    getcompetencies(uname: string): Observable<any> {
        return this.auth.get(`${client}/competencies/${uname}`);
    }

    //tabs ----------------------------------------------------------------------------------------------

    getopnotes(id: string): Observable<any> {
        return this.auth.get(`${client}/opnotes/${id}`)
    }

    getopnoteswithfilters(id: string, data: any): Observable<any> {
        return this.auth.post(`${client}/opnotes-with-filters/${id}`, data);
    }

    getopnoteswithdate(data: any): Observable<any> {
        return this.auth.get(`${client}/opnotes-dates`, data);
    }

    getcasenotes(id: string): Observable<any> {
        return this.auth.get(`${client}/casenotes/${id}`);
    }

    getcasenoteswithfilters(id: string, data: any): Observable<any> {
        return this.auth.post(`${client}/casenotes-with-filters/${id}`, data);
    }

    getcasenoteswithdate(data: any): Observable<any> {
        return this.auth.get(`${client}/casenotes-dates`, data);
    }

    updateopnotes(data: any, recordNo: string): Observable<any> {
        return this.auth.put(`${client}/opnotes/${recordNo}`, data)
    }

    postopnotes(data: any, personId: string): Observable<any> {
        return this.auth.post(`${client}/opnotes/${personId}`, data)
    }

    deleteopnotes(id: number): Observable<any> {
        return this.auth.delete(`${client}/opnotes/${id}`)
    }

    getincidents(id: string): Observable<any> {
        return this.auth.get(`${client}/incidents/${id}`)
    }

    getloans(id: string): Observable<any> {
        return this.auth.get(`${client}/loans/${id}`);
    }

    updateloans() {

    }

    deleteloans(id: number): Observable<any> {
        return this.auth.delete(`${client}/loans/${id}`)
    }

    getpermroster(name: string): Observable<any> {
        return this.auth.get(`${client}/permroster/${name}`);
    }

    gethistory(name: string): Observable<any> {
        return this.auth.get(`${client}/history/${name}`);
    }

    updatecasenotes(data: any, id: number): Observable<any> {
        return this.auth.put(`${client}/casenotes/${id}`, data)
    }

    postcasenotes(data: any, personId: string): Observable<any> {
        return this.auth.post(`${client}/casenotes/${personId}`, data)
    }

    deletecasenotes(id: number): Observable<any> {
        return this.auth.delete(`${client}/casenotes/${id}`)
    }

    getreminders(id: string): Observable<any> {
        return this.auth.get(`${client}/reminders/${id}`);
    }

    // getcontactskin(id: string): Observable<any>{
    //     return this.auth.get(`${client}/contacts/kin/${id}`);
    // }

    //tabs end  ----------------------------------------------------------------------------------------------

    addbooking(book: AddBooking): Observable<any> {
        return this.auth.post(`${client}/booking`, book);
    }

    addcontact(contact: Array<PhoneFaxOther>): Observable<any> {
        return this.auth.post(`${client}/user/contact`, contact);
    }

    addaddress(address: Array<NamesAndAddresses>): Observable<any> {
        return this.auth.post(`${client}/user/address`, address);
    }

    updateusername(user: Recipients): Observable<any> {
        return this.auth.put(`${client}/user/name`, user)
    }

    updateuseraddress(address: Array<NamesAndAddresses>): Observable<any> {
        return this.auth.put(`${client}/user/address`, address)
    }

    updateusercontact(contact: Array<PhoneFaxOther>): Observable<any> {
        return this.auth.put(`${client}/user/contact`, contact)
    }

    deletecontact(contact: PhoneFaxOther): Observable<any> {
        return this.auth.delete(`${client}/user/contact`, contact);
    }

    deleteaddress(address: NamesAndAddresses): Observable<any> {
        return this.auth.delete(`${client}/user/address`, address);
    }

}

import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { GlobalService } from './global.service';
import { GetStaff, MiscellaneousNote, AttendanceStaff, CoordinatorEmail, InputAllocateStaff, UpdateNote, ClaimVariation, DayManager, GetRecipient, InputFilter, RecordIncident, GetTimesheet , RosterInput, AddClientNote, ApplicationUser, InputShiftBooked, InputShiftSpecific } from '@modules/modules';

const timesheet: string = "api/timesheet";

declare var Dto: any;
@Injectable()
export class TimeSheetService {

    constructor(
        public http: HttpClient,
        public auth: AuthService,
        public globalS: GlobalService
    ) { }

    getdocumentsrecipients(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/documents-recipients/${id}`)
    }


    getaccountingprofile(personid: string): Observable<any>{
        return this.auth.get(`${timesheet}/accounting-profile/${personid}`);
    }

    updateothers(data: any,personid: string): Observable<any>{
        return this.auth.put(`${timesheet}/others/${personid}`, data);
    }

    getothers(personid: string): Observable<any>{
        return this.auth.get(`${timesheet}/others/${personid}`);
    }

    updateattendance(data: any,personid: string): Observable<any>{
        return this.auth.put(`${timesheet}/time-and-attendance/${personid}`, data);
    }    

    getattendance(personid: string): Observable<any>{
        return this.auth.get(`${timesheet}/time-and-attendance/${personid}`);
    }        

    getbrandinglogo(type: string = 'big'): Observable<any>{
        return this.auth.get(`${timesheet}/branding-logo/${type}`);
    }
        
    getincidentdocuments(data: any): Observable<any>{
        return this.auth.get(`${timesheet}/incident-documents`, data);
    }

    GetIncidentNotifications(): Observable<any>{
        return this.auth.get(`${timesheet}/incident-notifications`);
    }
    //incident-mandatory-notifications Getincidentmandatorynotifications
    Getincidentmandatorynotifications(): Observable<any>{
        return this.auth.get(`${timesheet}/incident-mandatory-notifications`);
    }
    Getincidentnonmandatorynotifications(): Observable<any>{
        return this.auth.get(`${timesheet}/incident-nonmandatory-notifications`);
    }
    getincidentnotes(recordNo: number): Observable<any>{
        return this.auth.get(`${timesheet}/incident-note/${recordNo}`);
    }

    postincidentnote(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/incident-note`, data);
    }

    getspecificincidentdetails(recordNo: number): Observable<any>{
        return this.auth.get(`${timesheet}/incident/${recordNo}`);
    }

    deleteincident(recordNo: number): Observable<any>{
        return this.auth.delete(`${timesheet}/incident/${recordNo}`);
    }
    // closedincident(recordNo: number): Observable<any>{
    //     return this.auth.delete(`${timesheet}/incident/closed/${recordNo}`);
    // }

    postincident(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/incidents`, data);
    }

    updateincident(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/incidents`, data);
    }
    
    UpdateIncidentstatus(recordNo: any): Observable<any> {
        return this.auth.put(`${timesheet}/incidentstatus/${recordNo}`)
    }
    
    getclosedate(name: any): Observable<any>{
        return this.auth.get(`${timesheet}/closedate`, name);
    }

    getpayunits(payType: string): Observable<any>{
        return this.auth.getstring(`${timesheet}/pay-units/${payType}`);
    }

    getbillingrate(data: any): Observable<any>{
        return this.auth.get(`${timesheet}/billingrate`, data);
    }

    updateshiftquery(recordNo: number): Observable<any>{
        return this.auth.put(`${timesheet}/shift/query/${recordNo}`);
    }

    updateshiftapproved(recordNo: number): Observable<any>{
        return this.auth.put(`${timesheet}/shift/approve/${recordNo}`);
    }

    updatetimeoverlap(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/time-overlap`, data);
    }

    getusersettings(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/user/settings/${name}`);
    }

    getquotelist(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/quote/list`, data);
    }

    getquotedetails(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/quote/details/${id}`);
    }
    

    updatepackagesupplement(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/packagesupplement`, data);
    }

    getactiveservices(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/active-services`, data);
    }

    updatetactiveservices(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/active-services`, data);
    }

    getPDFReport(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/pdfreport`, data);
    }

    getreportpdfpath(data: any) {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const formData = new HttpParams({
            fromObject: {
                SqlStmt: `${data.SqlStmt}`,
                reportPath: `${data.reportPath}`,
                reportName: `${data.reportName}`,
                parameters: `${data.parameters}`
            }
        });
        return this.http.post('http://45.77.37.207:4141/steph/Timesheet.asmx/get_pdf_Report', formData, { headers: headers || headers, responseType: 'text' });
    }

    getAllocateDefaults(uname: string): Observable<any> {
        return this.auth.get(`${timesheet}/unallocate-defaults/${uname}`);
    }
    getstaffunallocatedefault(uname: string): Observable<any> {
        return this.auth.get(`${timesheet}/staff-unallocate-defaults/${uname}`);
    }
    

    getcomputetimesheet(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/compute-timesheet`, data);
    }

    posttimesheet(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/timesheet`, data);
    }

    updatetimesheet(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/timesheet`, data);
    }
    ProcessRoster(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/rosterOps`, data);
    }
    Check_BreachedRosterRules(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/breachedRosterRules`, data);
    }
    pastingRosters(data: string): Observable<any> {
        return this.auth.get(`${timesheet}/pastingRosters`, { Json: data});
    }
    getActivities(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/getActivities`, data);
    }
    
    postsamplereport(data: any) {
        return this.auth.post(`${timesheet}/sample-report`, data);
    }

    pdfreport(data: any) {
        return this.auth.post(`${timesheet}/pdfreport`, data);
    }
    getleavebalances(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/leave-balances/${personID}`);
    }

    // getdocumentblob(data: any): Observable<any>{
    //     return this.http.post(`${timesheet}/copy-mta-document`, data , { responseType: 'blob', reportProgress: true });
    // }

    putleaveapproved(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/leave-approved`, data);
    }

    putleaveentry(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/putOnLeave`, data);
    }

    postleaveentry(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/putOnLeave`, data);
    }

    posttermination(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/terminate`, data);
    }

    postDeleteStaff(data:any): Observable<any>{
        return this.auth.post(`${timesheet}/deleteStaff`, data);
    }
    postchangestaffcode(data:any): Observable<any>{
        return this.auth.post(`${timesheet}/changeStaffCode`, data);
    }

    getservicetype(type: string): Observable<any> {
        return this.auth.get(`${timesheet}/servicetype/${type}`)
    }

    removeShiftOverlap(data: any, interval: number): Observable<any> {
        return this.auth.put(`${timesheet}/remove-shiftoverlap/${interval}`, data);
    }

    selectedApprove(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/selected-approve`, data);
    }

    unapproveAll(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/unapproved/all`, data);
    }

    approveAll(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/approve/all`, data);
    }

    deleteunapprovedall(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/delete-unapproved/all`, data);
    }

    getjobstatus(recordArr: Array<number>): Observable<any> {
        return this.auth.post(`${timesheet}/jobstatus-timesheet`, recordArr);
    }

    /**
     *  Get USERNAME by using AccountNo
     */
    getuname(accountNo: string) {
        return this.auth.get(`${timesheet}/get-username/${accountNo}`)
    }

    updatecontactrosterrunsheet(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/update/contact-roster-runsheet`, data)
    }

    /**
     * Update Alerts and Issues - Profile Page
     */

    updatealertsissues(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/update/alerts`, data)
    }

    /**
     *  Post Case Staff 
     */
    postcasestaff(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/case-staff`, data)
    }
    /**
     *  Update Case Staff 
     */
    updatecasestaff(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/case-staff`, data)
    }

    /**
     *  Delete Case Staff 
     */

    deletecasestaff(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/case-staff/${recordNo}`)
    }

    /**
     * Get Case Staff
     */

    getcasestaff(recordNo: number): Observable<any> {
        return this.auth.get(`${timesheet}/case-staff/${recordNo}`)
    }

    /**
     * Intake Details > Funding > Fees
     */
    getintakefees(recordNo: number): Observable<any> {
        return this.auth.get(`${timesheet}/intake/funding/fees/${recordNo}`)
    }

    /**
     * Intake Details > Funding  > Credits
     */
    getintakecredits(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/intake/funding/credits`, data)
    }

    /**
     * Intake Details > Funding  > Documents
     */
    getintakedocuments(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/intake/funding/documents`, data)
    }

    /**
     * Intake Details > Funding > Program Details
     */

    getprogramdetails(recordNo: number) {
        return this.auth.get(`${timesheet}/intake/funding/program-details/${recordNo}`);
    }

    postprogramdetails(data: any) {
        return this.auth.post(`${timesheet}/intake/funding/program-details/post`, data);
    }

    updateprogramdetails(data: any) {
        return this.auth.put(`${timesheet}/intake/funding/program-details/update`, data);
    }

    deleteprogramdetails(recordNo: number) {
        return this.auth.delete(`${timesheet}/intake/funding/program-details/delete/${recordNo}`);
    }


    /**
     * Nudge Time
     */

    updatenudgetime(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/nudgetime`, data)
    }

    /**
     * Cut Roster
     */

    postcutroster(roster: Array<any>): Observable<any> {
        return this.auth.post(`${timesheet}/cut-roster`, roster)
    }

    /**
     * Copy Roster
     */

    postcopyroster(roster: Array<any>): Observable<any> {
        return this.auth.post(`${timesheet}/copy-roster`, roster)
    }


    /**
     *  Day And Time
     */
    postdaytime(time: any): Observable<any> {
        return this.auth.post(`${timesheet}/change-day-time`, time)
    }


    /**
     * Audit History
     */

    getaudithistory(recordNo: number): Observable<any> {
        return this.auth.get(`${timesheet}/audit-history/${recordNo}`)
    }

    postaudithistory(data:any): Observable<any> {
        return this.auth.get(`${timesheet}/audit-history`,data)
    }

    /**
     * Data Set
     */

    getdataset(recordNo: number): Observable<any> {
        return this.auth.get(`${timesheet}/dataset/${recordNo}`)
    }


    /**
     * Extra Information
     */

    getextrainformation(recordNo: number): Observable<any> {
        return this.auth.get(`${timesheet}/extra-info/${recordNo}`)
    }

    /**
     * Tasks
     */

    gettasks(recordNo: number): Observable<any> {
        return this.auth.get(`${timesheet}/tasks/${recordNo}`)
    }

    /**
     * Service Notes
     */

    getservicenotes(recordNo: string): Observable<any> {
        return this.auth.get(`${timesheet}/service-notes/${recordNo}`)
    }


    /**
     *  Staff Details
     */

    getstaffdetails(accountName: string): Observable<any> {
        return this.auth.get(`${timesheet}/staff-details/${accountName}`)
    }


    /**
     * Allocate Resource
     */

    updateResource(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/resource`, data)
    }



    /**
     * Caselaod
     */

    updatecaseload(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/caseload`, data)
    }

    /** */

    /**
     * Pay
     */

    updateposition(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/pay/position`, data)
    }

    updatecommencement(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/pay/commencement`, data)
    }

    updatepayroll(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/pay/payroll`, data)
    }

    updateworkhours(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/pay/workhours`, data)
    }
    /** */

    /**
     * Insurance & Pension
     */

    getpension(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/pension/${personID}`)
    }

    postpension(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/pension`, data)
    }

    updatepension(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/pension`, data)
    }

    deletespension(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/pension/${recordNo}`)
    }
    /** */

    /**
     * Services
     */

    getservicedata(recordNo: number): Observable<any> {
        return this.auth.get(`${timesheet}/intake/service-data/${recordNo}`)
    }

    deleteintakeservicecompetency(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/services/competency/${recordNo}`)
    }
    deleteintakerservice(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/rservices/${recordNo}`)
    }
    

    /** */

    /**
     * Staff
     */

    postintakestaff(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/staff`, data)
    }

    updateintakestaff(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/staff`, data)
    }

    deleteintakestaff(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/staff/${recordNo}`)
    }

    /**
     * center facility location staff
     */

    getcenterlocationexcludedstaff(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/centerLocation/excludedstaff/${id}`)
    }

    getcenterLocationincludedstaff(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/centerLocation/includedstaff/${id}`)
    }

    postcenterlocationstaff(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/centerLocation/staff`, data)
    }

    updatecenterlocationstaff(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/centerLocation/staff`, data)
    }

    deletecenterlocationstaff(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/centerLocation/staff/${recordNo}`)
    }
    
    /** */

    /**
     *  Center Location competency
     */
    getcenterlocationcompetency(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/centerLocation/competency/${id}`)
    }

    postcenterlocationcompetency(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/centerlocation/competency`, data)
    }
   
    updatecenterlocationcompetency(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/centerlocation/competency`, data)
    }

    deletecenterlocationcompetency(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/centerlocation/competency/${recordNo}`)
    }
    /** */    

    /**
     *  Competency
     */

    postintakecompetency(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/competency`, data)
    }
   
    updateintakecompetency(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/competency`, data)
    }

    deleteintakecompetency(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/competency/${recordNo}`)
    }
    /** */

    /**
     *  Service Competency
     */

    postintakeServicecompetency(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/Servicecompetency`, data)
    }
   
    updateintakeServicecompetency(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/Servicecompetency`, data)
    }

    deleteintakeServicecompetency(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/Servicecompetency/${recordNo}`)
    }

    /** */

    /**
     * Goals
     */

    postgoals(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/goals`, data)
    }

    updategoals(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/goals`, data)
    }

    deletegoals(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/goals/${recordNo}`)
    }

    deleteCarePlangoals(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/quote/careplangoal/${recordNo}`)
    }
    deleteCarePlanStrategy(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/quote/careplanstrategy/${recordNo}`)
    }
    
    getbuttonstatusofwizard(personId: string): Observable<any>{
        return this.auth.get(`${timesheet}/wizardButtonStatusRecipient/${personId}`)
    }

    postGoalsAndStratergies(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/quote/GoalsAndStratergies`, data)
    }
    updateGoalsAndStratergies(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/quote/GoalsAndStratergies`, data)
    }
    postplanStrategy(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/quote/planStrategy`, data)
    }
    updateplanStrategy(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/quote/planStrategy`, data)
    }
    /** */

    /**
     * Branches
     */

    postbranches(data: any) {
        return this.auth.post(`${timesheet}/intake/branches`, data)
    }

    updatebranches(data: any) {
        return this.auth.put(`${timesheet}/intake/branches`, data)
    }

    deletebranches(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/branches/${recordNo}`)
    }

    /** */

    /**
     * Preference
     */

    postrecipientpreference(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/recipient-preference`, data)
    }

    updateusrecipientpreference(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/recipient-preference`, data)
    }

    deleterecipientpreference(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/recipient-preference/${recordNo}`)
    }

    /**
     * User Group
     */

    postusergroup(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/user-group`, data)
    }


    updateusergroup(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/user-group`, data)
    }

    deleteusergroup(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/user-group/${recordNo}`)
    }

    /**
     * Consents
     */

    getconsents(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/consents/${id}`)
    }

    postconsents(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/consents`, data)
    }

    updateconsents(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/consents`, data)
    }

    deleteconsents(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/intake/consents/${recordNo}`)
    }

    /** */

    /**
     * Insurance
     */

    getinsurance(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/insurance/${personID}`)
    }

    updateinsurance(data: any, personID: string): Observable<any> {
        return this.auth.put(`${timesheet}/insurance/${personID}`, data)
    }

    /** */

    /**
     * Reminders Recipient
     */

    getremindersrecipient(id: string): Observable<any>{
        return this.auth.get(`${timesheet}/recipient/reminders/${id}`);
    }

    postremindersrecipient(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/recipient/reminders`, data)
    }
    
    PostRecipientFollowReminders(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/recipient/followup`, data)
    }
    updateremindersrecipient(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/recipient/reminders`, data)
    }

    deleteremindersrecipient(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/recipient/reminders/${recordNo}`)
    }

    /** */
    /**
     *  Clinical Reminders Recipient
     */

    postclinicalreminders(data: any,isSingle:string): Observable<any> {
        return this.auth.post(`${timesheet}/clinicalReminder/${isSingle}`,data)
    }
    deleteclinicalreminders(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/clinicalReminder/${recordNo}`)
    }
    /** */
    /**
     *  Clinical Alerts Recipient
     */

    postclinicalalerts(data: any,isSingle:string): Observable<any> {
        return this.auth.post(`${timesheet}/clinicalAlert/${isSingle}`,data)
    }
    deleteclinicalalerts(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/clinicalAlert/${recordNo}`)
    }

    /**
     *  Reminders Staff
     */


    getreminders(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/staff/reminders/${name}`)
    }

    postreminders(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/staff/reminders`, data)
    }

    deletereminders(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/staff/reminders/${recordNo}`)
    }

    updatereminders(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/staff/reminders`, data)
    }

    /** */

    /** Groupings & Preferences */

    getuserdefined1(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/staff/userdefined-1/${personID}`)
    }

    postuserdefined1(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/staff/userdefined-1`, data)
    }

    deleteshareduserdefined(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/staff/userdefined-shared/${recordNo}`)
    }

    updateshareduserdefined(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/staff/userdefined-shared`, data);
    }

    getuserdefined2(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/staff/userdefined-2/${personID}`)
    }

    postuserdefined2(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/staff/userdefined-2`, data)
    }


    /** */

    /**
     * 
     * Staff Positions 
     */

    getstaffpositions(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/staff/positions/${personID}`)
    }

    poststaffpositions(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/staff/positions`, data)
    }

    updatestaffpositions(data: any, recordNo: number): Observable<any> {
        return this.auth.put(`${timesheet}/staff/positions/${recordNo}`, data)
    }

    deletestaffpositions(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/staff/positions/${recordNo}`)
    }

    /** */

    /**
     * Primary Address
     */

    updateprimaryaddress(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/primaryaddress`, data)
    }

    /** */

    /**
     * Primary Phone
     */

    updateprimaryphone(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/primaryphone`, data)
    }

    /**
     *  OP Note Populate List
     */

    getcategoryop(): Observable<any> {
        return this.auth.get(`${timesheet}/category-opnote`)
    }

    getprogramop(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/program-opnote/${personID}`)
    }
    getprogrampackages(personID: string): Observable<any> {
        return this.auth.get(`${timesheet}/program-packages/${personID}`)
    }
    getdisciplineop(): Observable<any> {
        return this.auth.get(`${timesheet}/discipline-opnote`)
    }

    getcaredomainop(): Observable<any> {
        return this.auth.get(`${timesheet}/caredomain-opnote`)
    }

    getmanagerop(): Observable<any> {
        return this.auth.get(`${timesheet}/manager-opnote`)
    }

    /** */

    getreport(): Observable<any> {
        return this.auth.get('api/report/report')
    }

    getnotes(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/notes/${name}`)
    }

    getloannotes(id:string):Observable<any> {
        return this.auth.get(`${timesheet}/loannotes/${id}`)
    }

    getloans(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/loan/${name}`)
    }

    getrecipientdetails(name: string = null): Observable<any> {
        return name == null ? this.auth.get(`${timesheet}/recipients/details`)
            : this.auth.get(`${timesheet}/recipients/details/${name}`)
    }

    getopnotes(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/opnotes/${name}`)
    }

    postopnote(data: any, personID: string): Observable<any> {
        return this.auth.post(`${timesheet}/staff/opnotes/${personID}`, data)
    }

    updateopnote(data: any, recordNo: number): Observable<any> {
        return this.auth.put(`${timesheet}/staff/opnotes/${recordNo}`, data)
    }

    deleteopnote(id: number): Observable<any> {
        return this.auth.delete(`${timesheet}/staff/opnotes/${id}`)
    }


    gethrnotes(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/hrnotes/${name}`)
    }
    getarchivedhrnotes(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/achivedhrnotes/${name}`)
    }
    deletehrnotes(id: number): Observable<any> {
        return this.auth.delete(`${timesheet}/staff/hrnotes/${id}`)
    }

    posthrnotes(data: any, id: string): Observable<any> {
        return this.auth.post(`${timesheet}/staff/hrnotes/${id}`, data)
    }

    updatehrnotes(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/staff/hrnotes/${id}`, data)
    }

    getrosters(sdate: string, edate: string, servicetype: string): Observable<any> {
        return this.auth.get(`api/report/rosters?sdate=${sdate}&edate=${edate}&servicetype=${servicetype}`)
    }

    getcompetenciesall(): Observable<any> {
        return this.auth.get(`${timesheet}/competencies-list/all`)
    }

    getcontactskinrecipient(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/recipient/contacts/kin/${id}`)
    }

    postcontactskinrecipientdetails(data: any, name: string): Observable<any> {
        return this.auth.post(`${timesheet}/recipient/contacts/kin/details/${name}`, data)
    }

    getcontactskinrecipientdetails(id: number): Observable<any> {
        return this.auth.get(`${timesheet}/recipient/contacts/kin/details/${id}`)
    }

    updatecontactskinrecipientdetails(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/recipient/contacts/kin/details/${id}`, data)
    }

    getcontactskinstaff(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/staff/contacts/kin/${name}`)
    }

    getcontactskinstaffdetails(id: number): Observable<any> {
        return this.auth.get(`${timesheet}/staff/contacts/kin/details/${id}`)
    }

    postcontactskinstaffdetails(data: any, name: string): Observable<any> {
        return this.auth.post(`${timesheet}/staff/contacts/kin/details/${name}`, data)
    }

    updatecontactskinstaffdetails(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/staff/contacts/kin/details/${id}`, data)
    }

    deletecontactskin(id: number): Observable<any> {
        return this.auth.delete(`${timesheet}/contacts/kin/${id}`)
    }

    getshiftbooked(input: InputShiftBooked): Observable<any> {
        return this.auth.get(`${timesheet}/shift/booked`, input)
    }

    getshiftspecific(input: InputShiftSpecific): Observable<any> {
        return this.auth.get(`${timesheet}/shift/specific`, input)
    }

    gettimesheets(ts: GetTimesheet): Observable<any> {
        return this.auth.get(`${timesheet}`, ts);
    }

    getfilteredstaff(input: InputFilter): Observable<any> {
        return this.auth.get(`${timesheet}/staff/filtered`, input)
    }

    getfiltteredrecipient(input: InputFilter): Observable<any> {
        return this.auth.get(`${timesheet}/recipient/filtered`, input)
    }

    getrecipients(rec: GetRecipient): Observable<any> {
        return this.auth.get(`${timesheet}/recipients`, rec);
    }

    getrecipientsbyphone(phoneno: string): Observable<any> {
        return this.auth.get(`${timesheet}/phone-search-recipient/${phoneno}`);
    }
    getstaffbyphone(phoneno: string): Observable<any> {
        return this.auth.get(`${timesheet}/phone-search-staff/${phoneno}`);
    }
    
    postrecipientquicksearch(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/search-recipient`, data)
    }
    poststaffquicksearch(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/search-staff`, data)
    }
    postuserdetailviewingScopes(data: any,recordNo: number): Observable<any> {
        return this.auth.post(`${timesheet}/user-detail/${recordNo}`, data)
    }
    getstaff(staff: GetStaff): Observable<any> {
        return this.auth.get(`${timesheet}/staffs`, staff)
    }

    getstaffpaginate(staff: GetStaff): Observable<any> {
        return this.auth.get(`${timesheet}/staffs-paginate`, staff)
    }

    getdaymanager(dto: DayManager): Observable<any> {
        return this.auth.get(`${timesheet}/dmanager`, dto)
    }

    getlistcategories(): Observable<any> {
        return this.auth.get(`${timesheet}/categories`)
    }

    getlistservices(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/services/${id}`)
    }

    getactivitytype(): Observable<any> {
        return this.auth.get(`${timesheet}/activity`)
    }

    getpaytype(): Observable<any> {
        return this.auth.get(`${timesheet}/paytype`)
    }

    getitemloans(): Observable<any> {
        return this.auth.get(`${timesheet}/loan/items`)
    }

    getoutputtype(): Observable<any> {
        return this.auth.get(`${timesheet}/output`)
    }

    getprogramtype(): Observable<any> {
        return this.auth.get(`${timesheet}/program`)
    }

    getcompetencies(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/competencies/${name}`)
    }

    postcompetencies(data: any, id: string): Observable<any> {
        return this.auth.post(`${timesheet}/competencies/${id}`, data)
    }
    
    updateStaffCompetenciesHeader(type: string,id:string):Observable<any>{
        return this.auth.get(`${timesheet}/competenciesheader/${type}/${id}`)
    }
    
    updateStaffCompetenciesSkill(type: string,id:string):Observable<any>{
        return this.auth.get(`${timesheet}/competenciesheaderskill/${type}/${id}`)
    }
    updateLeaveStatus(leavetype:string,id:string):Observable<any>{
        return this.auth.get(`${timesheet}/udpateleavestatus/${leavetype}/${id}`)
    }

    deletecompetency(id: number): Observable<any> {
        return this.auth.delete(`${timesheet}/staff/competency/${id}`)
    }

    updatecompetency(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/competency/update/${id}`, data)
    }
    postnursingdiagnosis(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/clinical/Nursingdiagnose/store`,data)
    }
    updatenursingdiagnosis(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/clinical/Nursingdiagnose/update/${id}`,data)
    }
    deletenursingdiagnosis(id:number):Observable<any>{
        return this.auth.delete(`${timesheet}/clinical/Nursingdiagnose/delete/${id}`)
    }
    postmedicaldiagnosis(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/clinical/Medicaldiagnose/store`,data)
    }
    updatemedicaldiagnosis(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/clinical/Medicaldiagnose/update/${id}`,data)
    }
    deletemedicaldiagnosis(id:number):Observable<any>{
        return this.auth.delete(`${timesheet}/clinical/Medicaldiagnose/delete/${id}`)
    }

    getincidentdetails(name: string, id: number): Observable<any> {
        return this.auth.get(`${timesheet}/incidents/${name}/${id}`)
    }

    postclinicalprocedure(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/clinical/procedure/store`,data)
    }
    updateclinicalprocedure(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/clinical/procedure/update/${id}`,data)
    }
    deleteclinicalprocedure(id:number):Observable<any>{
        return this.auth.delete(`${timesheet}/clinical/procedure/delete/${id}`)
    }
    postclinicalmedication(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/clinical/medication/store`,data)
    }
    updateclinicalmedication(data: any, id: number): Observable<any> {
        return this.auth.put(`${timesheet}/clinical/medication/update/${id}`,data)
    }
    deleteclinicalmedication(id:number):Observable<any>{
        return this.auth.delete(`${timesheet}/clinical/medication/delete/${id}`)
    }

    getincidents(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/incidents/${name}`)
    }
    getincidentlocation(): Observable<any> {
        return this.auth.get(`${timesheet}/incident/location`)
    }
    getdocuments(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/documents/${name}`)
    }
    getleaveapplication(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/leaveapplication/${name}`)
    }
    getleaveapplicationByid(name: string, id: number): Observable<any> {
        return this.auth.get(`${timesheet}/leaveapplication/${name}/${id}`)
    }

    updateleaveapplication(name:string,data: any): Observable<any> {
        return this.auth.put(`${timesheet}/leaveapplication/${name}`, data)
    }

    getcoordinatoremail(email: CoordinatorEmail): Observable<any> {
        return this.auth.get(`${timesheet}/coordinator/email`, email)
    }

    gettraining(name: string): Observable<any> {
        return this.auth.get(`${timesheet}/training/${name}`)
    }

    addrecordincident(incident: RecordIncident): Observable<any> {
        return this.auth.post(`${timesheet}/recordincident`, incident)
    }

    addclientnote(note: AddClientNote): Observable<any> {
        return this.auth.post(`${timesheet}/client/note`, note)
    }

    updateoutputtype(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/outputtype`, input)
    }

    updaterosternote(note: UpdateNote): Observable<any> {
        return this.auth.put(`${timesheet}/roster/note`, note)
    }

    updateprogram(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/program`, input)
    }

    updateactivity(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/activity`, input)
    }

    updatepaytype(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/paytype`, input)
    }

    updatebillamount(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/billamount`, input)
    }

    updatebillquantity(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/billquantity`, input)
    }

    updatepayquantity(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/payquantity`, input)
    }

    updatesetunitcost(input: RosterInput): Observable<any> {
        return this.auth.put(`${timesheet}/setunitcost`, input)
    }

    updateapproveroster(id: number): Observable<any> {
        return this.auth.post(`${timesheet}/approved/roster`, id)
    }

    updateclaimvariation(cv: ClaimVariation): Observable<any> {
        return this.auth.post(`${timesheet}/claimvariation`, cv)
    }

    updateunapproveroster(id: number): Observable<any> {
        return this.auth.put(`${timesheet}/unapprove/roster`, id)
    }

    updateallocatestaff(id: number, accountName: InputAllocateStaff): Observable<any> {
        return this.auth.put(`${timesheet}/allocatestaff/${id}`, accountName)
    }

    updatepassword(user: ApplicationUser): Observable<any> {
        return this.auth.put(`${timesheet}/password/update`, user);
    }

    updatepasswordadmin(user: ApplicationUser): Observable<any> {
        return this.auth.put(`${timesheet}/password/admin/update`, user);
    }

    deleterosterlist(params: Array<number>): Observable<any> {
        return this.auth.post(`${timesheet}/roster/list`, params)
    }

    deleteshift(recordArr: Array<number>): Observable<any> {
        return this.auth.post(`${timesheet}/delete/shifts`, recordArr)
    }

    deleteleaveapplication(recordNo: number): Observable<any> {
        return this.auth.post(`${timesheet}/leaveapplication`, recordNo)
    }

    /**
     * Intake Tab
     */

    getbranches(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/branches/${id}`)
    }

    getfunding(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/funding/${id}`)
    }

    getgoals(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/goals/${id}`)
    }

    getplans(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/plans/${id}`)
    }

    getcareplans(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/careplans/${id}`)
    }

    getintakeservices(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/services/${id}`)
    }
    
    postintakeservices(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/services`, data)
    }
    postintakeRservices(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/intake/rservices`, data)
    }

    updateintakeservices(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/services`, data)
    }
    updateintakeRservices(data: any): Observable<any> {
        return this.auth.put(`${timesheet}/intake/rservices`, data)
    }
    getplacements(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/placements/${id}`)
    }

    getexcludedstaff(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/excludedstaff/${id}`)
    }

    getincludedstaff(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/includedstaff/${id}`)
    }

    gethealthalerts(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/healthalerts/${id}`)
    }

    updatehealthalerts(alert: string, personID: string): Observable<any> {
        return this.auth.put(`${timesheet}/intake/healthalerts/${personID}`, JSON.stringify(alert))
    }

    getrosteralerts(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/rosteralerts/${id}`)
    }

    updaterosteralerts(notes: string, personID: string): Observable<any> {
        return this.auth.put(`${timesheet}/intake/rosteralerts/${personID}`, JSON.stringify(notes))
    }

    getgenderpreferences(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/genderpreferences/${id}`)
    }

    getspecificcompetencies(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/specific/competencies/${id}`)
    }

    getgrouplist(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/group-list/${id}`)
    }

    getgrouptypes(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/group/types/${id}`)
    }

    getgrouppreferences(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/intake/group/preferences/${id}`)
    }

    /**
     * END - Intake Tab
     */

    /**
     * Note Tab - Staff
     */

    getnotesmiscellaneous(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/notes/miscellaneous/${id}`)
    }

    getnotesloans(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/notes/loans/${id}`)
    }

    postnotesloans(data:any) : Observable<any>{
        return this.auth.post(`${timesheet}/notes/loans`, data);
    }

    updatenotesloans(data:any) : Observable<any>{
        return this.auth.put(`${timesheet}/notes/loans`, data);
    }

    deletnotesloans(recordNo: number): Observable<any> {
        return this.auth.delete(`${timesheet}/notes/loan/${recordNo}`)
    }
    /**
     * End Note Tab
     */

    /** 
     * Pay Tab - Staff 
     */

    getpaydetails(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/pay/${id}`);
    }
    /**      
     * End - Pay Tab
     */
    
    updatemiscellaneous(note: MiscellaneousNote): Observable<any> {
        return this.auth.put(`${timesheet}/notes/miscellaneous`, note)
    }

    getCarePlanID(){
        return this.auth.get(`${timesheet}/carePlanId`)
    }

    updatetimeandattendance(attendance: AttendanceStaff): Observable<any> {
        return this.auth.put(`${timesheet}/attendance/staff`, attendance)
    }

    getattendancestaff(id: string): Observable<any> {
        return this.auth.get(`${timesheet}/attendance/staff/${id}`)
    }

    updateSkills(data:any):Observable<any>{
        return this.auth.put(`${timesheet}/competency/skill`, data)
    }

    addtransport(data: any): Observable<any> {
        return this.auth.post(`${timesheet}/transport`, data);
    }
    addRecurrentRosters(data: any): Observable<any> {
        return this.auth.get(`${timesheet}/addRecurrentRosters`, data);
    }
}


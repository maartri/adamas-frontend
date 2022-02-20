import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';

import { CallDeceaseProcedure, CallReferralOutProcedure, ReferralSourceDto } from '@modules/modules';
import { PackageClient } from '@client/package';

const list: string = "api/list"
const docSign: string = "api/docusign"

@Injectable()
export class ListService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ) { }

    getcontributionactivity(): Observable<any>{
        return this.auth.get(`${list}/contribution-activity`);
    }

    getstaffcompetencylist(data: any): Observable<any>{
        return this.auth.get(`${list}/staff-competency-list`, data);
    }

    postmtapending(data: any):Observable<any>{
        return this.auth.post(`${list}/mtapending`, data);
    }
    
    GetRptFilters(): Observable<any>{
        return this.auth.getstring(`${list}/rptfilters`);
    }

    getlisttimeattendancefilter(field: string): Observable<any>{
        return this.auth.get(`${list}/populate-time-attendance-field/${field}`);
    }
    
    getfundingSourcePerProgram(program: string): Observable<any>{
        return this.auth.getstring(`${list}/funding-source-per-program/${program}`);
    }

    getnotificationslist(isChecked: boolean = false):Observable<any>{
        return this.auth.get(`${list}/notifications-list/${isChecked}`);
    }

    getcoordinators_from_data_domain(): Observable<any>{
        return this.auth.get(`${list}/coordinators-list-data-domains`);
    }

    getdoctorinformation():Observable<any>{
        return this.auth.get(`${list}/doctors-information`);
    }

    getaccountinghistory(id: string):Observable<any>{
        return this.auth.get(`${list}/accounting-history/${id}`);
    }

    getaccountingprofile(id: string):Observable<any>{
        return this.auth.get(`${list}/accounting-profile/${id}`);
    }

    deletecasestaff(id: any):Observable<any>{
        return this.auth.delete(`${list}/case-staff/${id}`);
    }

    postcasestaff(data: any): Observable<any> {
        return this.auth.post(`${list}/case-staff`, data);
    }

    getcasestaffpopulate(id: string):Observable<any>{
        return this.auth.get(`${list}/case-staff-populate-field/${id}`);
    }

    getcasestaffprograms():Observable<any>{
        return this.auth.get(`${list}/case-staff-programs`);
    }

    getcasestafflist(id: string):Observable<any>{
        return this.auth.get(`${list}/case-staff-list/${id}`);
    }

    getreferraltypes(source: any):Observable<any>{
        return this.auth.get(`${list}/referral-source-v2`, source);
    }
    
    // sendDOCSIGN(data: any): Observable<any>{
    //     return this.auth.post(`${docSign}/create`, data);
    // }

    getmedicallist():Observable<any>{
        return this.auth.get(`${list}/list-medical`);
    }

    getaccceptcharges(program: string):Observable<any>{
        return this.auth.get(`${list}/accept-charges/${program}`);
    }

    getrosterpublishdate():Observable<any>{
        return this.auth.get(`${list}/last-roster-publish-date`);
    }

    getprogramstatus(program: any):Observable<any>{
        return this.auth.getstring(`${list}/program-status-program`, program);
    }

    getprimaryphoneaddress(program: any):Observable<any>{
        return this.auth.getstring(`${list}/primary-phone-address`, program);
    }

    getwaitlist(): Observable<any> {
        return this.auth.get(`${list}/waitlist`);
    }    

    postadmissionacceptquote(data: any): Observable<any> {
        return this.auth.post(`${list}/admission-accept-quote`, data);
    }

    getspecificemailmanager(accountno: string):Observable<any>{
        return this.auth.getstring(`${list}/specific-email-manager/${accountno}`);
    }


    getspecifictype(program: string):Observable<any>{
        return this.auth.getstring(`${list}/specific-type/${program}`);
    }

    getspecificbranch(personid: string):Observable<any>{
        return this.auth.get(`${list}/specific-branch/${personid}`);
    }

    
    gethumanresourcetypes(program: any):Observable<any>{
        return this.auth.getstring(`${list}/humanresourcetypes/type`, program);
    }


    getportalmanagers():Observable<any>{
        return this.http.get(`${list}/portal-manager`);
    }

    createQuoteLine(data: any):Observable<any>{
        return this.http.post(`${list}/create-quote-line`, data);
    }

    printquote(data: any):Observable<any>{
        // return this.http.post(`${fileV2}/download-document-remote`, data, { responseType: 'blob', reportProgress: true });
        return this.http.post(`${list}/quotes-print`, data,  { responseType: 'blob', reportProgress: true })
    }

    deletetempdoc(docId: any):Observable<any>{
        return this.auth.delete(`${list}/delete-temp-doc/${docId}`);
    }

    geteventlifecycle(): Observable<any>{
        return this.auth.get(`${list}/event-life-cycle`);
    }

    createtempdoc(data: any): Observable<any>{
        return this.auth.post(`${list}/create-temp-doc`, data);
    }
    
    getquotetype(): Observable<any>{
        return this.auth.get(`${list}/goalplan/list`);
    }

    getquotedetails(recordNo: number): Observable<any>{
        return this.auth.get(`${list}/quotes-details/${recordNo}`);
    }

    getquoteline(data: any): Observable<any>{
        return this.auth.get(`${list}/quote-line/list/${data}`);
    }

    updatequoteline(data: any, recordNo: any): Observable<any>{
        return this.auth.put(`${list}/quotes-line-details/${recordNo}`, data);
    }

    getstrategyList(docId: any): Observable<any>{
        return this.auth.get(`${list}/strategy-list/${docId}`);
    }

    getquotelinedetails(recordNo: number): Observable<any>{
        return this.auth.get(`${list}/quotes-line-details/${recordNo}`);
    }

    deletequoteline(recordNo: number):Observable<any>{
        return this.auth.delete(`${list}/quote-lines/${recordNo}`);
    }

    getrecipientsqlid(id: string): Observable<any> {
        return this.auth.get(`${list}/recipient-sqlid/${id}`);
    }

    postprintline(data: any):Observable<any>{
        return this.http.post(`${list}/print-quote-line`, data,  { responseType: 'blob', reportProgress: true });
    }

    getpostquote(data: any): Observable<any> {
        return this.auth.post(`${list}/post-quote`, data);
    }

    checkpostquote(data: any): Observable<any> {
        return this.auth.post(`${list}/check-post-quote`, data);
    }

    getprogramproperties(program: string): Observable<any> {
        return this.auth.get(`${list}/program-properties/${program}`);
    }
    getcontactTypesByGroup(group: string): Observable<any> {
        return this.auth.get(`${list}/contact-types/${group}`);
    }
    getpensionandfee(): Observable<any> {
        return this.auth.get(`${list}/pension-and-percent-fee`);
    }

    getprogramlevel(program: string): Observable<any> {
        return this.auth.get(`${list}/program-level/${program}`);
    }
    getlevelRate(level: string): Observable<any> {
        return this.auth.get(`${list}/level-rate/${level}`);
    }
    gettypeother(caseName: string): Observable<any> {
        return this.auth.get(`${list}/type-other/${caseName}`);
    }

    gettypekin(): Observable<any> {
        return this.auth.get(`${list}/type-kin`);
    }

    getnotifications(data: any): Observable<any> {
        return this.auth.get(`${list}/notifications`, data);
    }

    getfollowups(data: any): Observable<any> {
        return this.auth.get(`${list}/followups`, data);
    }

    getdocumentslist(data: any): Observable<any> {
        return this.auth.get(`${list}/documents-list`, data);
    }

    getdatalist(data: any): Observable<any> {
        return this.auth.get(`${list}/data-list`, data);
    }

    getreferraltype_latest(packageName: string): Observable<any> {
        return this.auth.get(`${list}/referral-type/${packageName}`);
    }

    checkIfPackageNameExists(packageName: string): Observable<any> {
        return this.auth.get(`${list}/check-package-name-exist/${packageName}`);
    }

    getdexprograms(personID: string): Observable<any> {
        return this.auth.get(`${list}/dex-programs/${personID}`);
    }

    getotherprograms(personID: string): Observable<any> {
        return this.auth.get(`${list}/other-programs/${personID}`);
    }    
    getcompetenciesheader(personID: string): Observable<any> {
        return this.auth.get(`${list}/competenciesheader/${personID}`);
    }    
    gethcpprograms(): Observable<any> {
        return this.auth.get(`${list}/hcp-programs`);
    }

    getndiaprograms(): Observable<any> {
        return this.auth.get(`${list}/ndia-programs`);
    }
    getndiaitems(): Observable<any>{
        return this.auth.get(`${list}/ndia-items`);
    }
    getskills(): Observable<any>{
        return this.auth.get(`${list}/skills`);
    }
    getclientportalmethod(): Observable<any>{
        return this.auth.get(`${list}/clientportalmethod`);
    }

    updateclientportalmethod(data: boolean): Observable<any>{
        return this.auth.put(`${list}/clientportalmethod/${data}`);
    }

    getrecipientprograms(id: string): Observable<any>{
        return this.auth.get(`${list}/programs-recipient/${id}`);
    }

    getpayperiod(): Observable<any>{
        return this.auth.get(`${list}/payperiod`);
    }

    getrosterpublishedenddate():Observable<any>{
        return this.auth.get(`${list}/rosterpublished-end-date`);
    }

    getcategoryincident(): Observable<any>{
        return this.auth.get(`${list}/category-incident-note`);
    }

    getservicetypeincident(data: any): Observable<any>{
        return this.auth.get(`${list}/servicetype/incident/recipient/list`, data);
    }
    
    getprogramsincident(id: string):Observable<any>{
        return this.auth.get(`${list}/programs/incident/recipient/list/${id}`);
    }    

    getstaffrecordview(user: string): Observable<any>{
        return this.auth.get(`${list}/staff-record-view/${user}`);
    }
    
    getserviceactivityall(data: any) {
        return this.auth.post(`${list}/activities/all`, data);
    }
    getserviceprogramactivity(data: any) {
        return this.auth.get(`${list}/activities/program/`, data);
    }

    getchargetype(data: any): Observable<any>{
        return this.auth.get(`${list}/quote/chargeType`, data);
    }
    GetQuotetype(id: string): Observable<any>{
        return this.auth.get(`${list}/getquotetype/${id}`);
    }
    /*GetCharges(id: string): Observable<any>{
        return this.auth.get(`${list}/getcharges/${id}`);
    } */
    GetCMPERC(id: string): Observable<any>{
        return this.auth.getstring(`${list}/getcmperc/${id}`);
    }
    GetTOpUP(id: string): Observable<any>{
        return this.auth.get(`${list}/gettopup/${id}`);
    }
    GetBasicCare(id: string): Observable<any>{
        return this.auth.get(`${list}/getbasiccare/${id}`);
    }
    
    GetAdmPerc(id: string): Observable<any>{
        return this.auth.getstring(`${list}/getadmperc/${id}`);
    }    
    
    GetDailyliving(id: string): Observable<any>{
        return this.auth.get(`${list}/getdailyliving/${id}`);
    }

    getglobaltemplate(): Observable<any>{
        return this.auth.get(`${list}/template/list`);
    }

    getprogramcontingency(personID: string): Observable<any>{
        return this.auth.get(`${list}/program/contingency/list/${personID}`);
    }

    getishcpcdcprograms(personID: string): Observable<any>{
        return this.auth.get(`${list}/is-hcp-cdc-programs/${personID}`);
    }

    getCareplangoals(personID: any): Observable<any>{
        return this.auth.get(`${list}/quote/careplangoal/list/${personID}`)
    }
    getStrategies(personID: string): Observable<any>{
        return this.auth.get(`${list}/quote/careplangoal/strtegies/${personID}`)
    }
    
    getgoalofcare(): Observable<any> {
        return this.auth.get(`${list}/quote/goalofcare`);
    }
    

    getfundingpackagepurposelist(): Observable<any>{
        return this.auth.get(`${list}/funding/package-purpose/list`);
    }

    getremindersrecipient(): Observable<any>{
        return this.auth.get(`${list}/reminders-recipient`);
    }

    getreasons(): Observable<any>{
        return this.auth.get(`${list}/reasons`);
    }

    getfundingprioritylist(): Observable<any>{
        return this.auth.get(`${list}/funding/priority/list`);
    }

    getfundingpackagelist(personID: string): Observable<any>{
        return this.auth.get(`${list}/funding/packages/list/${personID}`);
    }

    getlistkintype(contactGroup: string): Observable<any>{
        return this.auth.get(`${list}/kin-type/${contactGroup}`);
    }

    getrostertypelist(): Observable<any>{
        return this.auth.get(`${list}/roster-type`);
    }

    getrecipientsearch(data: any): Observable<any>{
        return this.auth.get(`${list}/recipient-search`, data);
    }    
    
    getreportcriterialist(listType: any): Observable<any>{
        return this.auth.get(`${list}/GetReportCriteriaList`, listType);
    }

    getcstdaoutlets(): Observable<any>{
        return this.auth.get(`${list}/cstdaoutlets`);
    }

    GetVehicles(): Observable<any>{
        return this.auth.get(`${list}/vehicles`);
    }
    getloantypes() : Observable<any>{
        return this.auth.get(`${list}/loantypes`);
    }
    GetAllPrograms(): Observable<any>{
        return this.auth.get(`${list}/CriterialistPrograms`);
    }

    
    GetRecipientAll(): Observable<any>{
        return this.auth.get(`${list}/intake/recipients/all`);
    }
    GetRecipientActive(): Observable<any>{
        return this.auth.get(`${list}/recipients/active`);
    }
    GetBatchNo(): Observable<any>{
        return this.auth.get(`${list}/batchnumbers`);
    }
    Getpackages(): Observable<any>{
        return this.auth.get(`${list}/packages`);
    }
    Getrptcasenotes(): Observable<any>{
        return this.auth.get(`${list}/casenotesgroup`);
    }
    Getrptincidents(): Observable<any>{
        return this.auth.get(`${list}/incidenttype`);
    }
    Getrptiplantypes(): Observable<any>{
        return this.auth.get(`${list}/planitype`);
    }
    GetrptLoanItems(): Observable<any>{
        return this.auth.get(`${list}/loanitems`);
    }
    
    GetStaffServiceTypes(): Observable<any>{ 
        return this.auth.get(`${list}/staffservices`);
    }

    GetActiveRecipientAccountNo(): Observable<any>{ 
        return this.auth.get(`${list}/AccountNumbers`);
    }

    getimlocation(): Observable<any>{
        return this.auth.get(`${list}/imlocation`);
    }
    getplangoalachivement():Observable<any>{
        return this.auth.get(`${list}/plangoalachivement`);
    }
    getpaycode(data: any): Observable<any>{
        return this.auth.get(`${list}/paycode`, data);
    }

    getprograms(data: any): Observable<any>{
        return this.auth.get(`${list}/programs`, data);
    }

    getactivities():Observable<any>{
        return this.auth.get(`${list}/activities`);
    }
    getleavepaytypes():Observable<any>{
        return this.auth.get(`${list}/leave-pay-types`);
    }
    getleaveactivities():Observable<any>{
        return this.auth.get(`${list}/leave-activities`);
    }
    getleaveactivitycodes(data: any): Observable<any>{
        return this.auth.get(`${list}/leave-activity-codes`, data)
    }

    getadmitprograms(personID: string): Observable<any>{
        return this.auth.get(`${list}/admit-program/${personID}`)
    }

    getcasenotecategory(index: number): Observable<any>{
        return this.auth.get(`${list}/case-note-category/${index}`)
    }

    getadmitservices(program: string): Observable<any>{
        return this.auth.get(`${list}/admit-services/${program}`)
    }

    getchargeamount(title: string): Observable<any>{
        return this.auth.get(`${list}/charge-amount/${title}`)
    }

    postitem(data:any):Observable<any>{
        return this.auth.post(`${list}/item`, data)
    }
    
    postreinstate(data:any):Observable<any>{
        return this.auth.post(`${list}/reinstate`, data)
    }

    postnotproceed(data:any):Observable<any>{
        return this.auth.post(`${list}/not-proceed`, data)
    }

    postadministration(data: any): Observable<any>{
        return this.auth.post(`${list}/administration`, data)
    }

    postwaitlist(data: any):Observable<any>{
        return this.auth.post(`${list}/waitlist`, data)
    }

    postdischarge(data: any): Observable<any>{
        return this.auth.post(`${list}/discharge`, data)
    }

    postdeath(data: CallDeceaseProcedure): Observable<any>{
        return this.auth.post(`${list}/death`, data)
    }

    postadmission(data: any): Observable<any>{
        return this.auth.post(`${list}/admission`, data)
    }

    postcheckclonepackage(data: any): Observable<any>{
        return this.auth.post(`${list}/clonepackage`, data)
    }

    postassessment(data: any): Observable<any>{
        return this.auth.post(`${list}/assessment`, data)
    }

    postreferralin(data: any): Observable<any>{
        return this.auth.post(`${list}/referral-in`, data)
    }

    postreferralout(data: CallReferralOutProcedure): Observable<any>{
        return this.auth.post(`${list}/referral-out`, data);
    }

    postclientpackage(data: any): Observable<any>{
        return this.auth.post(`${list}/set-client-package`, data)
    }

    postclonepackage(data: any): Observable<any>{
        return this.auth.post(`${list}/clone-package`, data)
    }

    getpackagetemplate(type: string): Observable<any>{
        return this.auth.get(`${list}/package-template/${type}`)
    }

    postnote(data: any): Observable<any>{
        return this.auth.post(`${list}/create-note`, data)
    }

    postroster(data: any): Observable<any>{
        return this.auth.post(`${list}/create-roster`, data)
    }

    getstaffofbranch(data: any): Observable<any>{
        return this.auth.post(`${list}/get-staff-branch`, data)
    }

    getwizardreminderto():Observable<any>{        
        return this.auth.get(`${list}/wizard-reminder-to`)
    }

    getstatusofwizard(personId: string): Observable<any>{
        return this.auth.get(`${list}/status-of-wizards/${personId}`)
    }
    
    getwizardreferralsource(dataset: string = ''): Observable<any>{        
        return this.auth.get(`${list}/wizards-referral-source/${dataset}`)
    }

    getwizardnote(whatnote: string): Observable<any>{
        return this.auth.get(`${list}/wizards-note/${whatnote}`)
    }  

    getwizardreferralcode(): Observable<any>{
        return this.auth.get(`${list}/wizards-referral-code`)
    }

    getwizardreferraltypes(service: any): Observable<any>{
        return this.auth.get(`${list}/wizards-referral-type`, service)
    }

    getwizardprograms(personID: string): Observable<any>{
        return this.auth.get(`${list}/wizards-programs/${personID}`)
    }

    deletelist(data: any): Observable<any>{
        return this.auth.delete(`${list}/delete-sql`, data)
    }

    insertlist(data: any): Observable<any>{
        return this.auth.post(`${list}/insert-sql`, data)
    }

    postSql(data: any): Observable<any>{
        return this.auth.post(`${list}/insertSql`, data)
    }

    deleteSql(data: any): Observable<any>{
        return this.auth.post(`${list}/deleteSql`, data)
    }

    updateSql(data: any):Observable<any>{
        return this.auth.put(`${list}/updateSql`, data)
    }

    updatelist(data: any): Observable<any>{
        return this.auth.put(`${list}/update-sql`, data)
    }

    getlist(sqlString: string): Observable<any>{
        return this.auth.post(`${list}/get-list`, { Sql: sqlString})
    }

    getreferraltype(data: any): Observable<any>{
        return this.auth.get(`${list}/referral-type-v2`, data);
    }

    getcoordinators(): Observable<any>{
        return this.auth.get(`${list}/coordinators`)
    }
    getcoordinatorslist(): Observable<any>{
        return this.auth.get(`${list}/coordinatorslist`)
    }
    getactiveprograms(): Observable<any>{
        return this.auth.get(`${list}/active-programs`)
    }

    getleavebalances(personID: string): Observable<any>{
        return this.auth.get(`${list}/leave-balances/${personID}`)
    }

    getreasonunavailability(): Observable<any>{
        return this.auth.get(`${list}/reason-unavailability`)
    }

    getleaveprograms(): Observable<any>{
        return this.auth.get(`${list}/leave/programs`)
    }
    getprogramsobj(): Observable<any>{
        return this.auth.get(`${list}/programs/obj`)
    }
    getcategoriesobj(): Observable<any>{
        return this.auth.get(`${list}/categories/obj `)
    }
    getstaffcategory(): Observable<any>{
        return this.auth.get(`${list}/staff-category`)
    }
    getstaffcategorylist(): Observable<any>{
        return this.auth.get(`${list}/staff-Job-category-list`) 
    }
    
    getstaffdiscipline(): Observable<any>{
        return this.auth.get(`${list}/staff-discipline`)
    }

    getstaffcaredomain(): Observable<any>{
        return this.auth.get(`${list}/staff-caredomain`)
    } 

    getresources(): Observable<any>{
        return this.auth.get(`${list}/resources`)
    }
    getawards(): Observable<any>{
        return this.auth.get(`${list}/intake/awards/list`)
    }

    getcareplan(): Observable<any>{
        return this.auth.get(`${list}/intake/careplan/list`)
    }

    getcaredomain(): Observable<any>{
        return this.auth.get(`${list}/intake/caredomain/list`)
    }

    getdiscipline(): Observable<any>{
        return this.auth.get(`${list}/intake/discipline/list`)
    }
    
    getdisciplinelist(): Observable<any>{
        return this.auth.get(`${list}/staff/dicipline/teams/list`)
    }

    getfileclassification(): Observable<any>{
        return this.auth.get(`${list}/intake/file-classification/list`)
    }

    getdocumentcategory(): Observable<any>{
        return this.auth.get(`${list}/intake/doc-category/list`)
    }
    
    gettemplatelist():Observable<any>{
        return this.auth.get(`${list}/intake/template/list`)
    }
    
    getintakerecipientall(): Observable<any>{
        return this.auth.get(`${list}/intake/recipients/all`)
    }
    getpensionall(): Observable<any>{
        return this.auth.get(`${list}/pension/all`)
    }

    getpension(personID: string): Observable<any>{
        return this.auth.get(`${list}/pension/${personID}`)
    }   
    
    getfundingsource(): Observable<any>{
        return this.auth.get(`${list}/funding-source`)
    }
    getlistrecipientreminders(): Observable<any>{
        return this.auth.get(`${list}/recipient/reminders`)
    }   
    getlistrecipientremindersObj(): Observable<any>{
        return this.auth.get(`${list}/recipient/remindersObj`)
    }
    customdatasetObj(): Observable<any>{
        return this.auth.get(`${list}/customdatasetObj`)
    }
    getcompetenciesall(): Observable<any>{
        return this.auth.get(`${list}/competencies/all`)
    }

    getintakeprogram(personID: string): Observable<any>{
        return this.auth.get(`${list}/intake/services/programs/${personID}`)
    }
    getProfileActiveprogram(personID: string): Observable<any>{
        return this.auth.get(`${list}/peronal/active/programs/${personID}`)
    }
    
    getintakeactivity(personID: string, program: string, date: string): Observable<any>{
        return this.auth.get(`${list}/intake/activity/${personID}/${program}/${date}`)
    }
    getstaffactivities(): Observable<any>{
        return this.auth.get(`${list}/staff/activities`);
    }
    getintakestaff(personID: string): Observable<any>{
        return this.auth.get(`${list}/intake/staff/${personID}`)
    }
    //clinical 
    getclinicalnursingdiagnose(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/nursingdiagnose/${personID}`)
    }
    getaddclinicalnursingdiagnose(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/addnursingdiagnose/${personID}`)
    }
    getclinicalmedicationdiagnose(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/medicationdiagnose/${personID}`)
    }
    getaddclinicalmedicationdiagnose(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/addmedicationdiagnose/${personID}`)
    }
    getclinicalprocedure(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/procedure/${personID}`)
    }
    getclinicalmedications(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/medications/${personID}`)
    }
    getclinicalreminder(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/reminder/${personID}`)
    }
    getreminders(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical-reminders/${personID}`)
    }
    getalerts(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical-alertt/${personID}`)
    }
    
    getclinicalalert(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/alert/${personID}`)
    }
    getclinicalnotes(personID: string): Observable<any>{
        return this.auth.get(`${list}/clinical/notes/${personID}`)
    }
    //end clinical

    getcenterlocationstaff(): Observable<any>{
        return this.auth.get(`${list}/centerLocation/staff/`)
    }    
    GetTraccsStaffCodes(): Observable<any>{
        return this.auth.get(`${list}/Users/TraccsStaffCodes`)
    }

    GetTraccsClientCodes(): Observable<any>{
        return this.auth.get(`${list}/Users/TraccsClientCodes`)
    }

    getintakecompetencies(personID: string): Observable<any>{
        return this.auth.get(`${list}/intake/competencies/${personID}`)
    }

    getintakegoals(personID: string): Observable<any>{
        return this.auth.get(`${list}/intake/goals/${personID}`)
    }

    getintakebranches(personID: string): Observable<any>{
        return this.auth.get(`${list}/intake/branches/${personID}`)
    }

    getpensionstatus():Observable<any>{
        return this.auth.get(`${list}/insurance/pension-status`)
    }

    getcardstatus(): Observable<any>{
        return this.auth.get(`${list}/insurance/card-status`)
    }

    getloanitems(): Observable<any>{
        return this.auth.get(`${list}/loan/items`)
    }

    getloanprograms(): Observable<any>{
        return this.auth.get(`${list}/loan/programs`)
    }

    getlistbranches(): Observable<any>{
        return this.auth.get(`${list}/branches`)
    }
    getlistbranchesObj(): Observable<any>{
        return this.auth.get(`${list}/branchesObj`)
    }
    
    getliststaffgroup(): Observable<any>{
        return this.auth.get(`${list}/staffgroup`)
    }
    getitemtypesparams(): Observable<any>{
        return this.auth.get(`${list}/itemtypesparams`)
    }
    getliststaffadmin(): Observable<any>{
        return this.auth.get(`${list}/staffadmin`)
    }

    getliststaffteam(): Observable<any>{
        return this.auth.get(`${list}/staffteam`)
    }
    getemployeebrokage(): Observable<any>{
        return this.auth.get(`${list}/employeeOf`)
    }
    getlistcasemanagers(): Observable<any>{
        return this.auth.get(`${list}/casemanagers`)
    }
    casemanagerslist(): Observable<any>{
        return this.auth.get(`${list}/casemanagerslist`)
    }
    
    getlistreminders(): Observable<any>{
        return this.auth.get(`${list}/reminders`)
    }    

    getlistquotes(data: any): Observable<any>{
        return this.auth.post(`${list}/quotes`, data)
    }

    postloan(data: any, personID: string): Observable<any>{
        return this.auth.post(`${list}/loan/${personID}`, data)
    }

    getlistindigstatus(): Observable<any>{
        return this.auth.get(`${list}/indigenous`)
    }

    getnotifyaddresses(Detail:any): Observable<any>{
        return this.auth.get(`${list}/notifymail/${Detail}`)
    }
   

    getlistdisabilities(): Observable<any>{
        return this.auth.get(`${list}/disabilities`)
    }

    getlisthr(): Observable<any>{
        return this.auth.get(`${list}/hrgroups`)
    }
    getlistop(): Observable<any>{
        return this.auth.get(`${list}/opgroups`)
    }

    getlistpositions(): Observable<any>{
        return this.auth.get(`${list}/positions`)
    }

    getlistuserdefined1(): Observable<any>{
        return this.auth.get(`${list}/staff/userdefined-1`)
    }

    getlistuserdefined2(): Observable<any>{
        return this.auth.get(`${list}/staff/userdefined-2`)
    }

    getserviceregion(): Observable<any>{        
        return this.auth.get(`${list}/serviceregion`)
    }

    getconsents(personId: string):Observable<any>{
        return this.auth.get(`${list}/consent/${personId}`)
    }

    getmedicalprocedure(personId: string):Observable<any>{
        return this.auth.get(`${list}/procedure/${personId}`)
    }

    getmedication(personId: string):Observable<any>{
        return this.auth.get(`${list}/medication/${personId}`)
    }
    getusergroup(personID: string):Observable<any>{
        return this.auth.get(`${list}/group/usergroup/${personID}`)
    }

    getrecipientpreference(personID: string):Observable<any>{
        return this.auth.get(`${list}/group/recipient-preference/${personID}`)
    }
    
    GetCopetencyGroup(): Observable<any>{        
        return this.auth.get(`${list}/Copetency-Group`)
    }
    Getrpttrainingtype(): Observable<any>{        
        return this.auth.get(`${list}/trainingtype`)
    }
    Getrpttraccsuser(): Observable<any>{        
        return this.auth.get(`${list}/traccsuser`)
    }
    
    Getrptmdstype(): Observable<any>{        
        return this.auth.get(`${list}/mdstype`)
    }
    Getrptagencyid(): Observable<any>{        
        return this.auth.get(`${list}/agencyid`)
    }
    Getrptpaytype(): Observable<any>{        
        return this.auth.get(`${list}/paytype`)
    }
    Getrptactivity(): Observable<any>{        
        return this.auth.get(`${list}/activity`)
    }
    Getrptsettings_vehicles(): Observable<any>{        
        return this.auth.get(`${list}/settings_vehicles`)
    }
    GetGroupMeals(): Observable<any>{        
        return this.auth.get(`${list}/group-meals-runsheet`)
    }
    GetBatchClients(batch: number): Observable<any>{
        return this.auth.get(`${list}/batch-clients/${batch}`);
    }



} //  //GetBatchClients batch-clients
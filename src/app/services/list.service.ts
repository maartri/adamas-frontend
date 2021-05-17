import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';

import { CallDeceaseProcedure, CallReferralOutProcedure } from '@modules/modules';
import { PackageClient } from '@client/package';

const list: string = "api/list"
const docSign: string = "api/docusign"

@Injectable()
export class ListService {
    constructor(
        public http: HttpClient,
        public auth: AuthService
    ) { }

    // sendDOCSIGN(data: any): Observable<any>{
    //     return this.auth.post(`${docSign}/create`, data);
    // }
    getquotetype(): Observable<any>{
        return this.auth.get(`${list}/goalplan/list`);
    }

    getquotedetails(recordNo: number): Observable<any>{
        return this.auth.get(`${list}/quotes-details/${recordNo}`);
    }

    getrecipientsqlid(id: string): Observable<any> {
        return this.auth.get(`${list}/recipient-sqlid/${id}`);
    }

    getpostquote(data: any): Observable<any> {
        return this.auth.post(`${list}/post-quote`, data);
    }

    getprogramproperties(program: string): Observable<any> {
        return this.auth.get(`${list}/program-properties/${program}`);
    }

    getpensionandfee(): Observable<any> {
        return this.auth.get(`${list}/pension-and-percent-fee`);
    }

    getprogramlevel(program: string): Observable<any> {
        return this.auth.get(`${list}/program-level/${program}`);
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

    getfollowups(): Observable<any> {
        return this.auth.get(`${list}/followups`);
    }

    getdocumentslist(): Observable<any> {
        return this.auth.get(`${list}/documents-list`);
    }

    getdatalist(): Observable<any> {
        return this.auth.get(`${list}/data-list`);
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

    gethcpprograms(): Observable<any> {
        return this.auth.get(`${list}/hcp-programs`);
    }

    getndiaprograms(): Observable<any> {
        return this.auth.get(`${list}/ndia-programs`);
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

    getglobaltemplate(): Observable<any>{
        return this.auth.get(`${list}/template/list`);
    }

    getprogramcontingency(personID: string): Observable<any>{
        return this.auth.get(`${list}/program/contingency/list/${personID}`);
    }

    getCareplangoals(personID: string): Observable<any>{
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

    getstaffcategory(): Observable<any>{
        return this.auth.get(`${list}/staff-category`)
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

    getlistrecipientreminders(): Observable<any>{
        return this.auth.get(`${list}/recipient/reminders`)
    }   

    getcompetenciesall(): Observable<any>{
        return this.auth.get(`${list}/competencies/all`)
    }

    getintakeprogram(personID: string): Observable<any>{
        return this.auth.get(`${list}/intake/services/programs/${personID}`)
    }

    getintakeactivity(personID: string, program: string, date: string): Observable<any>{
        return this.auth.get(`${list}/intake/activity/${personID}/${program}/${date}`)
    }

    getintakestaff(personID: string): Observable<any>{
        return this.auth.get(`${list}/intake/staff/${personID}`)
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

    getliststaffgroup(): Observable<any>{
        return this.auth.get(`${list}/staffgroup`)
    }

    getliststaffadmin(): Observable<any>{
        return this.auth.get(`${list}/staffadmin`)
    }

    getliststaffteam(): Observable<any>{
        return this.auth.get(`${list}/staffteam`)
    }

    getlistcasemanagers(): Observable<any>{
        return this.auth.get(`${list}/casemanagers`)
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



} //  
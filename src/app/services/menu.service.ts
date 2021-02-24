import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Branch } from '@modules/modules';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder } from '@angular/forms';
import { GlobalService } from './global.service';
const menu: string = "api/menu";


@Injectable()
export class MenuService {
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    token:any;
    private unsubscribe: Subject<void> = new Subject();
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    
    drawerVisible: boolean =  false;
    loading: boolean = false;
    constructor(
        public http: HttpClient,
        public auth: AuthService,
        private fb: FormBuilder,
        private globalS: GlobalService,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService,
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
        getlistcenterFacilityLoc():Observable<any>{
            return this.auth.get(`${menu}/centerFacilityLoc`)
        }
        getlistserviceNotesCat():Observable<any>{
            return this.auth.get(`${menu}/serviceNotesCat`)
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
        getDataDomainByType(domain: string,is_where:boolean):Observable<any>{
            return this.auth.get(`${menu}/getDomains/${domain}/${is_where}`)
        }
        InsertDomain(sqlString: string): Observable<any>{
            return this.auth.post(`${menu}/addDomain`, { Sql: sqlString})
        }
        deleteDomain(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/datadomains/${recordNo}`)
        }
        activeDomain(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/datadomains/${recordNo}`)
        }
        deleteDocumentTemplatelist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/documentTemplate/${recordNo}`)
        }
        activateDocumentTemplatelist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/documentTemplate/${recordNo}`)
        }
        deleteDistributionlist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/distribution/${recordNo}`)
        }
        activateDistributionlist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/distribution/${recordNo}`)
        }
        deleteBudgetlist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/budgets/${recordNo}`)
        }
        deletepostcodeslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/postcodes/${recordNo}`)
        }
        deleteholidayslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/holidays/${recordNo}`)
        }
        activateholidayslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/holidays/${recordNo}`)
        }
        
        deletemedicalContacts(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/medicalContacts/${recordNo}`)
        }
        activatemedicalContacts(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/medicalContacts/${recordNo}`)
        }
        deletenursingDiagnosis(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/nursingDiagnosis/${recordNo}`)
        }
        activatenursingDiagnosis(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/nursingDiagnosis/${recordNo}`)
        }
        deleteMDiagnosisTypes(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/MDiagnosisTypes/${recordNo}`)
        }
        activateMDiagnosisTypes(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/MDiagnosisTypes/${recordNo}`)
        }
        deleteMProcedureTypes(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/MProcedureTypes/${recordNo}`)
        }
        activateMProcedureTypes(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/MProcedureTypes/${recordNo}`)
        }
        deleteActivityServiceslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ActivityServices/${recordNo}`)
        }
        deleteEquipmentslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/Equipments/${recordNo}`)
        }
        deletePayTypeslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/PayTypes/${recordNo}`)
        }
        deleteProgarmPackageslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ProgarmPackages/${recordNo}`)
        }
        deleteCenterFacilityLoclist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/CenterFacilityLoc/${recordNo}`)
        }
        

    }
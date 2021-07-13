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
       


        
        /*******************************************************
         *  Staff Admin Activities
        */

        getlistServices(is_where: boolean):Observable<any>{
            return this.auth.get(`${menu}/Services/${is_where}`)
        }
        
        postServices(data: any): Observable<any> {
            return this.auth.post(`${menu}/Services/`, data)
        }
        /** */

        /**
         *  Staff Admin Activities
        */
        getlistItemConsumables(is_where: boolean):Observable<any>{
            return this.auth.get(`${menu}/itemConsumable/${is_where}`)
        }
       
        postItemConsumables(data: any): Observable<any> {
            return this.auth.post(`${menu}/itemConsumable/`, data)
        }

        /** */

        /**
         *  Staff Admin Activities
        */

        getlistMenuMeals(is_where: boolean):Observable<any>{
            return this.auth.get(`${menu}/menuMeals/${is_where}`)
        }

        postMenuMeals(data: any): Observable<any> {
            return this.auth.post(`${menu}/menuMeals/`, data)
        }
        
        /** */

        /**
         *  Staff Admin Activities
        */
        GetlistcaseManagement(is_where: boolean):Observable<any>{
            return this.auth.get(`${menu}/caseManagement/${is_where}`)
        }
        
        postcaseManagement(data: any): Observable<any> {
            return this.auth.post(`${menu}/caseManagement/`, data)
        }
        /** */

        /**
         *  Staff Admin Activities
        */
        
        GetlistStaffAdminActivities(is_where: boolean):Observable<any>{
            return this.auth.get(`${menu}/staffAdminActivities/${is_where}`)
        }
        poststaffAdminActivities(data: any): Observable<any> {
            return this.auth.post(`${menu}/staffAdminActivities/`, data)
        }
        updatestaffAdminActivities(data: any): Observable<any> {
            return this.auth.post(`${menu}/staffAdminActivities/`, data)
        }
        /** */
        
        /**
         *  Recipient Absenses
        */
        GetlistRecipientAbsenses(is_where: boolean):Observable<any>{
            return this.auth.get(`${menu}/recipientAbsenses/${is_where}`)
        }
        postRecipientAbsenses(data: any): Observable<any> {
            return this.auth.post(`${menu}/recipientAbsenses/`, data)
        }
        /**
         *  Services competencies
        */

        getconfigurationservicescompetency(id: string): Observable<any> {
            return this.auth.get(`${menu}/services/competency/${id}`)
        }

        postconfigurationservicescompetency(data: any): Observable<any> {
            return this.auth.post(`${menu}/services/competency`, data)
        }
       
        updateconfigurationservicescompetency(data: any): Observable<any> {
            return this.auth.put(`${menu}/services/competency`, data)
        }
    
        deleteconfigurationservicescompetency(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/services/competency/${recordNo}`)
        }

        /***/
        /***************************************************************************/
        
        
        
        Getlistequipments(is_where:boolean):Observable<any>{
            return this.auth.get(`${menu}/equipments/${is_where}`)
        }
        GetlistagencyPayTypes(is_where:boolean):Observable<any>{
            return this.auth.get(`${menu}/agencyPayTypes/${is_where}`)
        }
        getlistFundingSource(is_where: boolean): Observable<any>{
            return this.auth.get(`${menu}/fundingSource/${is_where}`)
        }
        getlistProgramPackages(is_where: boolean):Observable<any>{
            return this.auth.get(`${menu}/programPackages/${is_where}`)
        }
        getlistvehicles():Observable<any>{
            return this.auth.get(`${menu}/vehicles`)
        }
        getlistPackageLeaveTypes():Observable<any>{
            return this.auth.get(`${menu}/packgeLeaveTypes`);
        }
        getlistCompetencyByPersonId(recordNo:number):Observable<any>{
            return this.auth.get(`${menu}/competencyByPersonId/${recordNo}`);
        }
        getlistServiceCompetencyByPersonId(recordNo:string):Observable<any>{
            return this.auth.get(`${menu}/serviceCompetencyByPersonId/${recordNo}`);
        }
        
        getlistApprovedServicesByPersonId(recordNo:string):Observable<any>{
            return this.auth.get(`${menu}/approvedServicesByPersonId/${recordNo}`);
        }
        getlistApprovedStaffByPersonId(recordNo:number):Observable<any>{
            return this.auth.get(`${menu}/approvedStaffByPersonId/${recordNo}`);
        }
        getlistExcludedStaffByPersonId(recordNo:number):Observable<any>{
            return this.auth.get(`${menu}/excludeStaffByPersonId/${recordNo}`);
        }
        getlistactivityGroups(is_where:boolean):Observable<any>{
            return this.auth.get(`${menu}/activityGroups/${is_where}`)
        }
        getlistcenterFacilityLoc(is_where:boolean):Observable<any>{
            return this.auth.get(`${menu}/centerFacilityLoc/${is_where}`)
        }
        getlistserviceNotesCat():Observable<any>{
            return this.auth.get(`${menu}/serviceNotesCat`)
        }
        getlistbranches(is_where:boolean): Observable<any>{
            return this.auth.get(`${menu}/branches/${is_where}`)
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
        activatepostcodeslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/postcodes/${recordNo}`)
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
        activateActivityServiceslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/ActivityServices/${recordNo}`)
        }
        deleteEquipmentslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/Equipments/${recordNo}`)
        }
        activateEquipmentslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/Equipments/${recordNo}`)
        }
        deletePayTypeslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/PayTypes/${recordNo}`)
        }
        activatePayTypeslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/activate/PayTypes/${recordNo}`)
        }
        deleteProgarmPackageslist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ProgarmPackages/${recordNo}`)
        }
        deletePackageLeaveTypelist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ProgarmPackages/packageLeaveType/${recordNo}`)
        }
        deleteCompetency(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ProgarmPackages/deleteCompetency/${recordNo}`)
        }
        deleteApprovedService(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ProgarmPackages/deleteApprovedServices/${recordNo}`)
        }
        deleteApprovedStaff(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ProgarmPackages/approvedStaff/${recordNo}`)
        }
        deleteExcludedStaff(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/ProgarmPackages/excludedStaff/${recordNo}`)
        }
        deleteCenterFacilityLoclist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/CenterFacilityLoc/${recordNo}`)
        }
        activateCenterFacitlityLoclist(recordNo: number): Observable<any>{
            return this.auth.delete(`${menu}/configuration/activate/centerFacilityLoc/${recordNo}`)
        }
        

    }
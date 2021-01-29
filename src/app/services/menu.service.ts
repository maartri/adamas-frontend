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
        InsertDomain(sqlString: string): Observable<any>{
            return this.auth.post(`${menu}/addDomain`, { Sql: sqlString})
        }
        deleteDomain(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/datadomains/${recordNo}`)
        }
        deleteDistributionlist(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/distribution/${recordNo}`)
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
        deletemedicalContacts(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/medicalContacts/${recordNo}`)
        }
        deletenursingDiagnosis(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/nursingDiagnosis/${recordNo}`)
        }
        deleteMDiagnosisTypes(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/MDiagnosisTypes/${recordNo}`)
        }
        deleteMProcedureTypes(recordNo: number): Observable<any> {
            return this.auth.delete(`${menu}/configuration/delete/MProcedureTypes/${recordNo}`)
        }
        
        generatePdf(sql: string,options:any) {

            this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
        
            var fQuery = sql;
            const data = {
                "template": { "_id": "0RYYxAkMCftBE9jc" },
                "options": {
                    "reports": { "save": false },
                    "txtTitle": "Claim Rates List",
                    "sql": fQuery,
                    "userid":this.tocken.user,
                    "head1" : "Sr#",
                    "head2" : "Name",
                    "head3" : "Rate",
                }
            }

            const headerDict = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
            const requestOptions = {
                headers: new HttpHeaders(headerDict)
            };
            this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                let _blob: Blob = blob;
                let fileURL = URL.createObjectURL(_blob);
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.loading = false;
            }, err => {
                console.log(err);
                this.ModalS.error({
                    nzTitle: 'TRACCS',
                    nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                    nzOnOk: () => {
                        this.drawerVisible = false;
                    },
                });
            });
        }
        
    }
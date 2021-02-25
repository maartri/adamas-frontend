import { Injectable, Injector } from '@angular/core';
import { ListService, GlobalService } from '@services/index';
import { Observable, EMPTY } from 'rxjs';
import * as moment from 'moment';

interface SqlWizardProperties{
    program?: string,
    tab?: number,
    checkedProgram?: Array<any>
}

@Injectable({
    providedIn: 'root'
})

export class SqlWizardService {
    listS: any;
    constructor(
        private injector: Injector,
        private globalS: GlobalService
    ) {
        this.listS = this.injector.get(ListService)
    }

    GETREFERRALTYPE_V2(data: any): Observable<any>{
        return this.listS.getreferraltype(data);        
    }

    GetReferralType(data: SqlWizardProperties): Observable<any>{
        const tab = data.tab;
        const date = moment().format('MM-DD-YYYY');

        //REFER-IN
        if(tab == 1){
            return this.listS.getwizardreferraltypes({ Program: data.program, TabType: 'REFERRAL-IN'})
        }
        //REFER-ON
        if(tab == 2){
            return this.listS.getlist(`SELECT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid WHERE SO.serviceprogram = '${ data.program }' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] IN ( 'ADMISSION' ) AND ITM.[minorgroup] IN ( 'REFERRAL-OUT' ) AND ( ITM.enddate IS NULL OR ITM.enddate >= '${date}' )) ORDER BY [service type]`)
        }

        // NOT-PROCEED
        if(tab == 3){
            return this.listS.getlist(`SELECT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid WHERE HRT.[name] = '${ data.program }' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] IN ( 'ADMISSION' ) AND ITM.[minorgroup] IN ( 'NOT PROCEEDING' ) AND ( ITM.enddate IS NULL OR ITM.enddate >= '${date}' )) ORDER BY [service type]`)
        }
        // ASSESS
        if(tab == 4){
            return this.listS.getlist(`SELECT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid WHERE HRT.[name] = '${ data.program }' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] IN ( 'ADMISSION' ) AND ITM.[minorgroup] IN ( 'ASSESSMENT' ) AND ( ITM.enddate IS NULL OR ITM.enddate >= '${date}' )) ORDER BY [service type]`)
        }
        // ADMIT
        if(tab == 10){
            return this.listS.getlist(`SELECT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid WHERE HRT.[name] = '${data.program}' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] IN ( 'ADMISSION' ) AND ITM.[minorgroup] IN ( 'ADMISSION' ) AND ( ITM.enddate IS NULL OR ITM.enddate >= '${date}' )) ORDER BY [service type]`)
        }
        // ADMIN
        if(tab == 8){
            return this.listS.getlist(`SELECT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid WHERE HRT.[name] = '${data.program}' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] IN ( 'ADMISSION' ) AND ITM.[minorgroup] IN ( 'OTHER', 'REVIEW' ) AND ( ITM.enddate IS NULL OR ITM.enddate >= '${date}' )) ORDER BY [service type]`)
        }
        // DISCHARGE
        if(tab == 6){
            return this.listS.getlist(`SELECT [service type] AS activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid WHERE HRT.[name] = '${ data.program }' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] IN ( 'ADMISSION' ) AND ITM.[minorgroup] IN ( 'DISCHARGE' ) AND ( ITM.enddate IS NULL OR ITM.enddate >= '${date}' )) ORDER BY [service type]`)
        }
        // ITEM
        if(tab == 9){
            return this.listS.getlist(`SELECT [Title] AS activity FROM ItemTypes WHERE ProcessClassification = 'OUTPUT' AND [RosterGroup] IN ('ITEM') AND (EndDate Is Null OR EndDate >= '${date}') ORDER BY [Title]`)
        }

        return EMPTY;
    }

    GetReferralCode(data: SqlWizardProperties): Observable<any>{
        console.log(data)
        var obs: Observable<any>;
        const tab = data.tab;
        const date = moment().format('MM-DD-YYYY');

        if(tab == 6 || tab == 9) return EMPTY;

        if(tab == 7)    return this.listS.getlist(`SELECT title FROM itemtypes WHERE ( enddate IS NULL OR enddate >= '${date}' ) AND rostergroup = 'RECPTABSENCE' AND status = 'ATTRIBUTABLE' AND processclassification = 'EVENT' ORDER BY title`)
        
        //if(tab == 8)    return this.listS.getlist(`SELECT [service type] AS Activity FROM serviceoverview SO INNER JOIN humanresourcetypes HRT ON CONVERT(NVARCHAR, HRT.recordnumber) = SO.personid WHERE HRT.[name] = '${data.program}' AND EXISTS (SELECT title FROM itemtypes ITM WHERE title = SO.[service type] AND ITM.[rostergroup] IN ( 'ADMISSION' ) AND ITM.[minorgroup] IN ( 'OTHER', 'REVIEW' ) AND ( ITM.enddate IS NULL OR ITM.enddate >= '${date}' )) ORDER BY [service type]`)
        
        if(tab == 10)   return this.listS.getlist(`SELECT DISTINCT [Service Type] AS activity FROM ServiceOverview SO INNER JOIN HumanResourceTypes HRT ON CONVERT(nVarchar, HRT.RecordNumber) = SO.PersonID WHERE HRT.[Name] = '${ data.program }' AND EXISTS (SELECT Title FROM ItemTypes ITM WHERE Title = SO.[Service Type] AND ITM.[RosterGroup] NOT IN ('ADMISSION', 'ADMINISTRATION') AND (ITM.EndDate Is Null OR ITM.EndDate >= '${date}')) ORDER BY [Service Type]`)
        
        return this.listS.getwizardreferralcode();
    }

    GetReferralSource(data: SqlWizardProperties): Observable<any>{
        var obs: Observable<any>;
        const tab = data.tab;

        if(tab == 1 || tab == 2){
            obs = this.listS.getwizardreferralsource('default');

            var hacc = data.checkedProgram.filter(x => x.type == 'HACC');
            if(hacc && hacc.length > 0) obs = this.listS.getwizardreferralsource('HACC');

            var dex = data.checkedProgram.filter(x => x.type == 'DEX');
            if(dex && dex.length > 0) obs = this.listS.getwizardreferralsource('DEX');
        }

        if(tab == 6){       
            obs = this.listS.getlist(`SELECT DISTINCT Description, HACCCode, RecordNumber FROM DataDomains WHERE Domain = 'REASONCESSSERVICE'`);

            var haccList: Array<any> = data.checkedProgram.filter(x => x.type == 'HACC');                 
            if(haccList && haccList.length > 0) obs = this.listS.getlist(`SELECT Description,HACCCode, RecordNumber FROM DataDomains WHERE Domain = 'REASONCESSSERVICE' AND DATASET = 'HACC'`)
        }
        
        return obs || EMPTY;
    }

}
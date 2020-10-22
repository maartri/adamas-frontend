
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { ListService } from '@services/index';

@Injectable({
    providedIn: 'root'
})
export class SwitchService {

    anyVariable: any;

    modalVariables: Dto.ModalVariables;
    sqlCommand: string;
    listS: any;

    constructor(
        private injector: Injector
    ) {
        this.listS = this.injector.get(ListService)
    }


    getData(tabNo: number): Observable<any> {
        this.sqlCommand = '';
        this.modalVariables = { };
        switch (tabNo) {
            case 0:
                this.modalVariables = {
                    title: 'Company',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'COMPANY'  ORDER BY DESCRIPTION"
                break;
            case 1:
                this.modalVariables = {
                    title: 'Branches',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'BRANCHES' ORDER BY Description"
                break;
            case 2:
                this.modalVariables = {
                    title: 'Funding Regions',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'FUNDREGION' ORDER BY Description"
                break;
            case 3:
                this.modalVariables = {
                    title: 'CDC Claim Rates',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT RecordNumber, Description, User1 FROM DataDomains WHERE Domain =  'PACKAGERATES' ORDER BY Description"

                break;
            case 4:
                this.modalVariables = {
                    title: 'CDC Target Groups',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CDCTARGETGROUPS' ORDER BY Description"
                break;
            case 5:
                this.modalVariables = {
                    title: 'Package Purpose Statements',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'PKGPURPOSE' ORDER BY Description"
                break;
            case 6:
                this.modalVariables = {
                    title: 'Activity Budget Groups',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'BUDGETGROUP' ORDER BY Description"
                break;
            case 7:
                this.modalVariables = {
                    title: 'Budgets',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT RecordNumber, Name AS Description, Branch, [Funding Source], [Care Domain],[Budget Group],[Program], [Dataset Code],Activity, [Staff Team], [Staff Category], [Staff], Recipient, Hours, Dollars, SPID, State,CostCentre,DSOutlet, FundingRegion, SvcDiscipline, Places, O_Hours, O_Dollars,O_PlcPkg,Y_Hours, Y_Dollars, Y_PlcPkg, BudgetType, StaffJobCat,Coordinator, StaffAdminCat, Environment,Unit from Budgets ORDER BY [Name]"
                break;
            case 8:
                this.modalVariables = {
                    title: 'User Details',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT Recnum, Name AS Description FROM UserInfo ORDER BY [Name]"
                break;
            case 9:
                this.modalVariables = {
                    title: 'Program Coordinators',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CASE MANAGERS'"

                break;
            case 10:
                this.modalVariables = {
                    title: 'Contact Group',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CONTACTGROUP'"

                break;
            case 11:
                this.modalVariables = {
                    title: 'Contact Type',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CONTACTSUBGROUP'"

                break;
            case 12:
                this.modalVariables = {
                    title: 'Address Types',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'ADDRESSTYPE'"

                break;
            case 13:
                this.modalVariables = {
                    title: 'Medical Contacts',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT Recordnumber, ISNull([Type], '') + '-' + CASE WHEN ISNULL([Name],'') <> '' THEN ' ' + ISNULL([Name],'') ELSE '' END + CASE WHEN ISNULL(Address1, '') <> '' THEN ' ' + ISNULL(Address1, '') ELSE '' END + CASE WHEN ISNULL(Address2, '') <> '' THEN ' ' + ISNULL(Address2, '') ELSE '' END + CASE WHEN ISNULL(Suburb, '') <> '' THEN ' ' + ISNULL(Suburb, '') ELSE '' END + CASE WHEN ISNULL(Phone1, '') <> '' THEN ' ' + ISNULL(Phone1, '') ELSE '' END AS Description FROM HumanResourceTypes WHERE [GROUP] = '3-MEDICAL'"


                break;
            case 14:
                this.modalVariables = {
                    title: 'CDC Target Groups',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'CDCTARGETGROUPS'"

                break;
            case 15:
                this.modalVariables = {
                    title: 'Phone Types',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'contacttype'"

                break;
            case 16:
                this.modalVariables = {
                    title: 'Occupations',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'OCCUPATIONS'"

                break;
            case 17:
                this.modalVariables = {
                    title: 'Religion',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'RELIGION'"


                break;
            case 18:
                this.modalVariables = {
                    title: 'Financial Classification',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'FINANCIALCLASS'"

                break;
            case 19:
                this.modalVariables = {
                    title: 'Suburbs/Postcode',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT Recnum, Suburb + ' ' + [State] + ' ' + Postcode AS Description FROM Pcodes"

                break;
            case 20:
                this.modalVariables = {
                    title: 'Public Holiday',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNo, Description, Date FROM PUBLIC_HOLIDAYS ORDER BY [Date]"

                break;
            case 21:
                this.modalVariables = {
                    title: 'Document Templates',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNo, Title, TRACCSType AS [Type], MainGroup AS [Category], MinorGroup AS Description, Template FROM DOC_Associations WHERE LocalUser = 'MASTER'"

                break;
            case 22:
                this.modalVariables = {
                    title: 'Filing Classification',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'FILECLASS'  ORDER BY DESCRIPTION"
                break;
            case 23:
                this.modalVariables = {
                    title: 'Document Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'DOCCAT'  ORDER BY DESCRIPTION"

                break;
            case 24:
                this.modalVariables = {
                    title: 'Distribution Lists',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNo, Recipient,Activity,Location,Program,Staff, Severity FROM IM_DistributionLists order by recipient"

                break;
            case 25:
                this.modalVariables = {
                    title: 'Initial Actions',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'IMActionInit'  ORDER BY DESCRIPTION"

                break;
            case 26:
                this.modalVariables = {
                    title: 'Ongoing Actions',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'IMActionOn'  ORDER BY DESCRIPTION"

                break;
            case 27:
                this.modalVariables = {
                    title: 'Incident Triggers',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'IMTriggers'  ORDER BY DESCRIPTION"

                break;
            case 28:
                this.modalVariables = {
                    title: 'Incident Types',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'INCIDENT TYPE'  ORDER BY DESCRIPTION"

                break;
            case 29:
                this.modalVariables = {
                    title: 'Incident Sub Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'INCIDENTSUBGROUP'  ORDER BY DESCRIPTION"

                break;
            case 30:
                this.modalVariables = {
                    title: 'Incident Location Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'IMLocation'  ORDER BY DESCRIPTION"

                break;
            case 31:
                this.modalVariables = {
                    title: 'Recipient Incident Note Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'RECIMNTECAT'  ORDER BY DESCRIPTION"

                break;
            case 32:
                this.modalVariables = {
                    title: 'Staff Incident Note Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'STFIMNTECAT'  ORDER BY DESCRIPTION"

                break;
            case 33:
                this.modalVariables = {
                    title: 'Recipient Category',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'GROUPAGENCY'  ORDER BY DESCRIPTION"

                break;
            case 34:
                this.modalVariables = {
                    title: 'Recipient Groups',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'RECIPTYPE'  ORDER BY DESCRIPTION"
                break;
            case 35:
                this.modalVariables = {
                    title: 'Recipient Minor Group',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'GROUPMINOR'  ORDER BY DESCRIPTION"

                break;
            case 36:
                this.modalVariables = {
                    title: 'Recipient Billing Cycles',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'BILLINGCYCLE'  ORDER BY DESCRIPTION"

                break;
            case 37:
                this.modalVariables = {
                    title: 'Debtor Terms',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'DEBTORTERMS'  ORDER BY DESCRIPTION"

                break;
            case 38:
                this.modalVariables = {
                    title: 'Recipient Goals',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'GOALOFCARE'  ORDER BY DESCRIPTION"

                break;
            case 39:
                this.modalVariables = {
                    title: 'Recipient Consents',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'RECIPIENTCONSENTS'  ORDER BY DESCRIPTION"

                break;
            case 40:
                this.modalVariables = {
                    title: 'Plan Types',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'CAREPLANTYPES'  ORDER BY DESCRIPTION"

                break;
            case 41:
                this.modalVariables = {
                    title: 'Clinical Note Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'CLINNOTEGROUPS'  ORDER BY DESCRIPTION"
                break;
            case 42:
                this.modalVariables = {
                    title: 'Case Notes Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'CASENOTEGROUPS'  ORDER BY DESCRIPTION"
                break;
            case 43:
                this.modalVariables = {
                    title: 'OP Notes Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'RECIPOPNOTEGROUPS'  ORDER BY DESCRIPTION"

                break;
            case 44:
                this.modalVariables = {
                    title: 'Care Domains',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'CAREDOMAIN'  ORDER BY DESCRIPTION"

                break;
            case 45:
                this.modalVariables = {
                    title: 'Dicharge Reasons',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'REASONCESSSERVICE' AND Embedded = 0 ORDER BY DESCRIPTION"

                break;
            case 46:
                this.modalVariables = {
                    title: 'Referral Reasons/Presenting Issues',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'REFERRALREASON'  ORDER BY DESCRIPTION"

                break;
            case 47:
                this.modalVariables = {
                    title: 'Recipient User Defined Reminders/Reviews/Alerts',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'RECIPIENTALERT'  ORDER BY DESCRIPTION"

                break;
            case 48:
                this.modalVariables = {
                    title: 'Recipient Preferences',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'RECIPPREF'  ORDER BY DESCRIPTION"

                break;
            case 49:
                this.modalVariables = {
                    title: 'Mobility Codes',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'MOBILITY'  ORDER BY DESCRIPTION"

                break;
            case 50:
                this.modalVariables = {
                    title: 'Tasks',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'TASK'  ORDER BY DESCRIPTION"

                break;
            case 51:
                this.modalVariables = {
                    title: 'Health Conditions',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'HEALTH CONDITIONS'  ORDER BY DESCRIPTION"

                break;
            case 52:
                this.modalVariables = {
                    title: 'Medications',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'MEDICATIONS'  ORDER BY DESCRIPTION"

                break;
            case 53:
                this.modalVariables = {
                    title: 'Nursing Diagnosis',
                    isMultiple: false
                }
                this.sqlCommand = "Select Recordno, Description, Code FROM NDiagnosisTypes  ORDER BY Description"

                break;
            case 54:
                this.modalVariables = {
                    title: 'Medical Diagnosis',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description, Code FROM MDiagnosisTypes  ORDER BY Description"

                break;
            case 55:
                this.modalVariables = {
                    title: 'Medical Procedures',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description, Code FROM MProcedureTypes  ORDER BY Description"

                break;
            case 56:
                this.modalVariables = {
                    title: 'Clinical Reminders',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'CLINICALREMIND'  ORDER BY DESCRIPTION"

                break;
            case 57:
                this.modalVariables = {
                    title: 'Clinical Alerts',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'CLINICALALERT'  ORDER BY DESCRIPTION"

                break;
            case 58:
                this.modalVariables = {
                    title: 'Admitting Priorities',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'ADMITPRIORITIES'  ORDER BY DESCRIPTION"

                break;
            case 59:
                this.modalVariables = {
                    title: 'Service Note Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'SVCNOTECAT'  ORDER BY DESCRIPTION"
                break;
            case 60:
                this.modalVariables = {
                    title: 'Referral Sources',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'REFERRAL SOURCE'  ORDER BY DESCRIPTION"
                break;
            case 61:
                this.modalVariables = {
                    title: 'Staff Job Category',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'STAFFGROUP'  ORDER BY DESCRIPTION"
                break;
            case 62:
                this.modalVariables = {
                    title: 'Admin Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'STAFFADMINCAT'  ORDER BY DESCRIPTION"
                break;
            case 63:
                this.modalVariables = {
                    title: 'User Groups',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'STAFFTYPE'  ORDER BY DESCRIPTION"
                break;
            case 64:
                this.modalVariables = {
                    title: 'Staff Positions',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'STAFFPOSITION'  ORDER BY DESCRIPTION"
                break;
            case 65:
                this.modalVariables = {
                    title: 'Staff Teams',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'STAFFTEAM'  ORDER BY DESCRIPTION"
                break;
            case 66:
                this.modalVariables = {
                    title: 'Award Levels',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'AWARDLEVEL'  ORDER BY DESCRIPTION"
                break;
            case 67:
                this.modalVariables = {
                    title: 'Award Details',
                    isMultiple: false
                }
                this.sqlCommand = "SELECT RecordNo, Code, Description, Category, Level FROM AwardPos"
                break;
            case 68:
                this.modalVariables = {
                    title: 'Competency Groups',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'COMPETENCYGROUP'  ORDER BY DESCRIPTION"
                break;
            case 69:
                this.modalVariables = {
                    title: 'Staff Competencies',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description, Embedded AS Mandatory From DataDomains Where Domain = 'STAFFATTRIBUTE' ORDER BY DESCRIPTION"
                break;
            case 70:
                this.modalVariables = {
                    title: 'HR Staff Notes Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'HRGROUPS'  ORDER BY DESCRIPTION"
                break;
            case 71:
                this.modalVariables = {
                    title: 'OP Staff Notes Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'OPGROUPS'  ORDER BY DESCRIPTION"
                break;
            case 72:
                this.modalVariables = {
                    title: 'Staff Reminders/Alerts',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'STAFFALERT'  ORDER BY DESCRIPTION"
                break;
            case 73:
                this.modalVariables = {
                    title: 'Service Disciplines',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'DISCIPLINE'  ORDER BY DESCRIPTION"
                break;
            case 74:
                this.modalVariables = {
                    title: 'Leave Descriptions',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'LEAVEAPP'  ORDER BY DESCRIPTION"
                break;
            case 75:
                this.modalVariables = {
                    title: 'Service Note Categories',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'SVCNOTECAT'  ORDER BY DESCRIPTION"
                break;
            case 76:
                this.modalVariables = {
                    title: 'Equipment',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT [recordnumber] AS [RecordNumber], [type] AS [Type], [itemid] AS [ItemID], [datedisposed] AS [DateDisposed], [lastservice] AS [LastService], [equipcode] AS [EquipCode], [serialno] AS [SerialNo], [purchasedate] AS [PurchaseDate], [purchaseamount] AS [PurchaseAmount], [lockboxcode] AS [LockBoxCode], [lockboxlocation] AS [LockBoxLocation], [notes] AS [Notes] FROM equipment"
                break;
            case 77:
                this.modalVariables = {
                    title: 'Services',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT       [Recnum] As [RecordNumber],        [Title] As [Title], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup        END As [RosterGroup],    [MinorGroup] As [Sub Group],    [IT_Dataset] As [Dataset],      [HACCType] As [Dataset Code], [CSTDAOutletID] As [OutletID],  [DatasetGroup] As [Dataset Group],  [NDIA_ID] As [NDIA ID],  [AccountingIdentifier] As [Accounting Code],        [Amount] As [Bill Amount],          [Unit] As [Bill Unit],     [EndDate] As [End Date] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '04-16-2019')  AND (RosterGroup IN ('ONEONONE', 'CENTREBASED', 'GROUPACTIVITY', 'TRANSPORT','SLEEPOVER') AND MinorGroup <> 'MEALS') ORDER BY Title"
                break;
            case 78:
                this.modalVariables = {
                    title: 'Items/Consumables',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT       [Recnum] As [RecordNumber],        [Title] As [Title], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup        END As [RosterGroup],    [MinorGroup] As [Sub Group],    [IT_Dataset] As [Dataset],      [HACCType] As [Dataset Code], [CSTDAOutletID] As [OutletID],  [DatasetGroup] As [Dataset Group],  [NDIA_ID] As [NDIA ID],  [AccountingIdentifier] As [Accounting Code],        [Amount] As [Bill Amount],          [Unit] As [Bill Unit],     [EndDate] As [End Date] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '04-16-2019')  AND (RosterGroup IN ('ITEM')) ORDER BY Title"
                break;
            case 79:
                this.modalVariables = {
                    title: 'Menus/Meals',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT       [Recnum] As [RecordNumber],        [Title] As [Title], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup        END As [RosterGroup],    [MinorGroup] As [Sub Group],    [IT_Dataset] As [Dataset],      [HACCType] As [Dataset Code], [CSTDAOutletID] As [OutletID],  [DatasetGroup] As [Dataset Group],  [NDIA_ID] As [NDIA ID],  [AccountingIdentifier] As [Accounting Code],        [Amount] As [Bill Amount],          [Unit] As [Bill Unit],     [EndDate] As [End Date] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '04-16-2019')  AND (MinorGroup IN ('MEALS')) ORDER BY Title"
                break;
            case 80:
                this.modalVariables = {
                    title: 'Case Management/Client Admin',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT       [Recnum] As [RecordNumber],        [Title] As [Title], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup        END As [RosterGroup],    [MinorGroup] As [Sub Group],    [IT_Dataset] As [Dataset],      [HACCType] As [Dataset Code], [CSTDAOutletID] As [OutletID],  [DatasetGroup] As [Dataset Group],  [NDIA_ID] As [NDIA ID],  [AccountingIdentifier] As [Accounting Code],        [Amount] As [Bill Amount],          [Unit] As [Bill Unit],     [EndDate] As [End Date] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '04-16-2019')  AND (RosterGroup IN ('ADMISSION')) ORDER BY Title"
                break;
            case 81:
                this.modalVariables = {
                    title: 'Staff Admin Activities',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT       [Recnum] As [RecordNumber],        [Title] As [Title], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup        END As [RosterGroup],    [MinorGroup] As [Sub Group],    [IT_Dataset] As [Dataset],      [HACCType] As [Dataset Code], [CSTDAOutletID] As [OutletID],  [DatasetGroup] As [Dataset Group],  [NDIA_ID] As [NDIA ID],  [AccountingIdentifier] As [Accounting Code],        [Amount] As [Bill Amount],          [Unit] As [Bill Unit],     [EndDate] As [End Date] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '04-16-2019')  AND (RosterGroup IN ('ADMINISTRATION', 'TRAVELTIME')) ORDER BY Title"
                break;
            case 82:
                this.modalVariables = {
                    title: 'Recipient Absences',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT       [Recnum] As [RecordNumber],        [Title] As [Title], CASE WHEN RosterGroup = 'ONEONONE' THEN 'ONE ON ONE' WHEN RosterGroup = 'CENTREBASED' THEN 'CENTER BASED ACTIVITY' WHEN RosterGroup = 'GROUPACTIVITY' THEN 'GROUP ACTIVITY' WHEN RosterGroup = 'TRANSPORT' THEN 'TRANSPORT' WHEN RosterGroup = 'SLEEPOVER' THEN 'SLEEPOVER' WHEN RosterGroup = 'TRAVELTIME' THEN 'TRAVEL TIME' WHEN RosterGroup = 'ADMISSION' THEN 'RECIPIENT ADMINISTRATION' WHEN RosterGroup = 'RECPTABSENCE' THEN 'RECIPIENT ABSENCE' WHEN RosterGroup = 'ADMINISTRATION' THEN 'STAFF ADMINISTRATION' ELSE RosterGroup        END As [RosterGroup],    [MinorGroup] As [Sub Group],    [IT_Dataset] As [Dataset],      [HACCType] As [Dataset Code], [CSTDAOutletID] As [OutletID],  [DatasetGroup] As [Dataset Group],  [NDIA_ID] As [NDIA ID],  [AccountingIdentifier] As [Accounting Code],        [Amount] As [Bill Amount],          [Unit] As [Bill Unit],     [EndDate] As [End Date] FROM ItemTypes WHERE ProcessClassification <> 'INPUT' AND (EndDate Is Null OR EndDate >= '04-16-2019')  AND (RosterGroup IN ('RECPTABSENCE')) ORDER BY Title"
                break;
            case 83: 
                this.modalVariables = {
                    title: 'Agency Pay Types',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT [recnum] AS [RecordNumber], [title] AS [Code], [rostergroup] AS [Pay Category], [minorgroup] AS [Sub Group], [amount] AS [Pay Amount], [unit] AS [Pay Unit], [enddate] AS [End Date], [billtext] AS [Description], [accountingidentifier] AS [Pay ID], [paygroup] AS [Pay Group], [paytype] AS [Pay Type], [excludefrompayexport] AS [No Pay Export] FROM itemtypes WHERE processclassification = 'INPUT' AND ( enddate IS NULL OR enddate >= '04-05-2019' ) ORDER BY title"
                break;
            case 84: 
                this.modalVariables = {
                    title: 'Funding Source',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'FUNDINGBODIES' AND (EndDate Is Null OR EndDate >= '04-05-2019') ORDER BY DESCRIPTION"
                break;
            case 85: 
                this.modalVariables = {
                    title: 'Program / Package',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT [recordnumber] AS [RecordNumber], [name] AS [Title], [type] AS [Funding Source], [address1] AS [AgencyID], [gst] AS [GST], [gstrate] AS [Rate], [budgetamount] AS [Budget $], [budget_1] AS [Budget Hrs], [budgetperiod] AS [Bgt Cycle], [fax] AS [GL Exp A/C], [email] AS [GL Rev A/C], [phone1] AS [GL Super A/C] FROM humanresourcetypes WHERE ( [group] = 'PROGRAMS' ) AND ( enddate IS NULL OR enddate >= '04-05-2019' ) ORDER BY title"
                break;
            case 86: 
                this.modalVariables = {
                    title: 'Vehicles',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'VEHICLES' AND (EndDate Is Null OR EndDate >= '04-05-2019') ORDER BY DESCRIPTION"
                break;
            case 87: 
                this.modalVariables = {
                    title: 'Centers/Facilities/Outlets',
                    isMultiple: true
                }
                this.sqlCommand = "SELECT RecordNumber, [Name], ServiceOutletID, AddressLine1 + CASE WHEN Suburb is null Then ' ' ELSE ' ' + Suburb END as Address FROM CSTDAOutlets WHERE ( EndDate is NULL OR EndDate >= Getdate()) ORDER BY [NAME]"
                break;
            case 88: 
                this.modalVariables = {
                    title: 'Activity Groups',
                    isMultiple: false
                }
                this.sqlCommand = "Select RecordNumber, Description From DataDomains Where Domain = 'ACTIVITYGROUPS'  ORDER BY DESCRIPTION"
                break;
        }

        return this.listS.getlist(this.sqlCommand).pipe(mergeMap(x => {
            return of<any>({
                list: x,
                modalVariables: this.modalVariables
            })
        }));

        //return of<any>(null);
      
    }


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    populateData(modalVariables: Dto.ModalVariables, inputVariables: any): Observable<any> {
        var data = null;
        switch (modalVariables.title) {
            case 'CDC Claim Rates':
                data = {
                    item: inputVariables.Description,
                    rate: inputVariables.User1,
                    recordNumber: inputVariables.RecordNumber
                }
                break;
            default:
                data = {
                    display: inputVariables.Description,
                    primaryId: inputVariables.RecordNumber
                };
                break;
        }
        return of<any>(data);
    }


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    deleteData(list: any): Observable<any> {
        this.anyVariable = {}
        switch (this.modalVariables.title) {
            case 'UserInfo':
                //this.category.whereClause = `WHERE Recnum = ${ list.recordNumber}`
                break;
            case 'Funding Regions':
                this.anyVariable = {
                    variables: {
                        recordNumber: list.RecordNumber
                    },
                    table: 'DataDomains'
                }
                break;
            case 'CDC Claim Rates':
                this.anyVariable = {
                    variables: {
                        recordNumber: list.RecordNumber
                    },
                    table: 'DataDomains'
                }
                break;
            default:
                this.anyVariable = {
                    variables: {
                        recordNumber: list.RecordNumber
                    },
                    table: 'DataDomains'
                }
                break;
        }
        if (Object.keys(this.anyVariable).length > 0) return this.listS.deleteSql(this.anyVariable)
        return of<any>(null);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    addData(modalVariables: Dto.ModalVariables, inputVariables: any) {
        console.log(inputVariables);
        this.anyVariable = {}
        switch (modalVariables.title) {
            case 'Medical Contacts':
                //var colValues = `'${(this.selected.name).toUpperCase()}','` + this.category.categoryName  + "','" + this.contact.type + "','" + this.contact.address1 + "','" + this.contact.address2 + "','" + this.contact.suburb + "','" +  this.contact.phone1 + "','" + this.contact.phone2 + "','" + this.contact.fax + "','" + this.contact.mobile + "','" + this.contact.email + "'"
                break;
            case 'Funding Regions':
                this.anyVariable = {
                    variables: {
                        Description: inputVariables.display.toUpperCase(),
                        domain: 'FUNDREGION',
                        dataset: 'USER',
                        embedded: 0,
                        HACCCODe:1,
                        user1: '',
                        user2: '',
                        endDate: null
                    },
                    table: 'DataDomains'
                }
                break;
            case 'CDC Claim Rates':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.item,
                        domain: 'PACKAGERATES',
                        dataset: 'CDC',
                        user1: inputVariables.rate
                    },
                    table: 'DataDomains'
                }
                break;
            case 'CDC Target Groups':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'CDCTARGETGROUPS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Package Purpose Statements':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'PKGPURPOSE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Activity Budget Groups':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'BUDGETGROUP',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Contact Group':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'CONTACTGROUP',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Address Types':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'ADDRESSTYPE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Phone Types':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'contacttype',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Occupations':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'OCCUPATIONS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Religion':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'RELIGION',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Financial Classification':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'FINANCIALCLASS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Filing Classification':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'FILECLASS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Document Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'DOCCAT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Initial Actions':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'IMActionInit',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Ongoing Actions':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'IMActionOn',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Incident Triggers':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'IMTriggers',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Incident Types':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'INCIDENT TYPE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Incident Location Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'IMLocation',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Incident Sub Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'INCIDENTSUBGROUP',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
            break;
            case 'Recipient Incident Note Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display.toUpperCase(),
                        domain: 'RECIMNTECAT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Staff Incident Note Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'STFIMNTECAT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient Category':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'GROUPAGENCY',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient Groups':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'RECIPTYPE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient Minor Group':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'GROUPMINOR',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient Billing Cycles':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'BILLINGCYCLE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Debtor Terms':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'DEBTORTERMS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient Goals':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'GOALOFCARE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient Consents':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'RECIPIENTCONSENTS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Plan Types':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'CAREPLANTYPES',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Clinical Note Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'CLINNOTEGROUPS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Case Notes Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'CASENOTEGROUPS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'OP Notes Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'RECIPOPNOTEGROUPS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Care Domains':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'CAREDOMAIN',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Discharge Reasons':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'REASONCESSSERVICE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Referral Reasons/Presenting Issues':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'REFERRALREASON',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient User Defined Reminders/Reviews/Alerts':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'RECIPIENTALERT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Recipient Preferences':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'RECIPPREF',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Mobility Codes':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'MOBILITY',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Tasks':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'TASK',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Health Conditions':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'HEALTH CONDITIONS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Medications':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'MEDICATIONS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Clinical Reminders':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'CLINICALREMIND',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Clinical Alerts':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'CLINICALALERT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Admitting Priorities':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'ADMITPRIORITIES',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Service Note Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'SVCNOTECAT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Referral Sources':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'REFERRAL SOURCE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Staff Job Category':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'STAFFGROUP',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Admin Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'STAFFADMINCAT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'User Groups':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'STAFFTYPE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Staff Positions':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'STAFFPOSITION',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Award Levels':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'AWARDLEVEL',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Competency Groups':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'COMPETENCYGROUP',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'HR Staff Notes Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'HRGROUPS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'OP Staff Notes Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'OPGROUPS',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Staff Reminders/Alerts':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'STAFFALERT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Service Disciplines':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'DISCIPLINE',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Leave Descriptions':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'LEAVEAPP',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
            case 'Service Note Categories':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.display,
                        domain: 'SVCNOTECAT',
                        dataset: 'USER',
                        embedded: 0,
                        user1: '',
                        user2: '',
                        endDate: null,
                    },
                    table: 'DataDomains'
                }
                break;
        }

        console.log(this.anyVariable)

        return this.listS.postSql(this.anyVariable)
    }


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    updateData(modalVariables: Dto.ModalVariables, inputVariables: any) {
        console.log({
            modalVariables,
            inputVariables
        })
        this.anyVariable = {}
        switch (modalVariables.title) {
            case 'Budgets':
                // this.category.setClause = `SET Name = '${this.selected.name}'`
                // this.category.whereClause = `WHERE RecordNumber = ${this.selected.recordNumber}`
                break;
            case'Contact Group':
            case'Phone Types':
            case'Occupations':
            case'Religion':
            case'Financial Classification':
            case'Filing Classification':
            case'Document Categories':
            case'Initial Actions':
            case'Ongoing Actions':
            case'Incident Triggers':
            case'Incident Types':
            case'Incident Location Categories':
            case'Recipient Incident Note Categories':
            case'Staff Incident Note Categories':
            case'Recipient Category':
            case'Recipient Groups':
            case'Recipient Minor Group':
            case'Recipient Billing Cycles':
            case'Debtor Terms':
            case'Recipient Goals':
            case'Recipient Consents':
            case'Plan Types':
            case'Clinical Note Categories':
            case'Case Notes Categories':
            case'OP Notes Categories':
            case'Care Domains':
            case'Discharge Reasons':
            case'Referral Reasons/Presenting Issues':
            case'Recipient User Defined Reminders/Reviews/Alerts':
            case'Recipient Preferences':
            case'Mobility Codes':
            case'Tasks':
            case'Health Conditions':
            case'Medications':
            case'Clinical Reminders':
            case'Clinical Alerts':
            case'Admitting Priorities':
            case'Service Note Categories':
            case'Referral Sources':
            case'Staff Job Category':
            case'Admin Categories':
            case'User Groups':
            case'Staff Positions':
            case'Award Levels':
            case'Competency Groups':
            case'HR Staff Notes Categories':
            case'OP Staff Notes Categories':
            case'Staff Reminders/Alerts':
            case'Service Disciplines':
            case'Leave Descriptions':
            case'Service Note Categories':
            case 'Address Types':
            case 'Activity Budget Groups':
            case 'Package Purpose Statements':
            case 'CDC Target Groups':
            case 'Funding Regions':
                this.anyVariable = {
                    variables: {
                        description: (inputVariables.display).toUpperCase()
                    },
                    table: 'DataDomains',
                    where: `WHERE RecordNumber = ${inputVariables.primaryId}`
                }
                break;
            case 'CDC Claim Rates':
                this.anyVariable = {
                    variables: {
                        description: inputVariables.item,
                        user1: inputVariables.rate
                    },
                    table: 'DataDomains',
                    where: `WHERE RecordNumber = ${inputVariables.recordNumber}`
                }
                break;
        }

        if (Object.keys(this.anyVariable).length > 0) return this.listS.updateSql(this.anyVariable)

        return of<any>(null);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


}

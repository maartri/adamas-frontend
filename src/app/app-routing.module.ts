import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';

import {  
  ProfilePage
} from '@components/index';

import {
  MembersComponent
} from './components/members/members.component'

import { HomeClientManager } from './pages/client-manager/home';
import { ProfileClientManager } from './pages/client-manager/profile';
import { BookingClientManager } from './pages/client-manager/booking';
import { CalendarClientManager } from './pages/client-manager/calendar';
import { DocumentClientManager } from './pages/client-manager/document';
import { HistoryClientManager } from './pages/client-manager/history';
import { NotesClientManager } from './pages/client-manager/notes';
import { PackageClientManager } from './pages/client-manager/package';
import { PreferencesClientManager } from './pages/client-manager/preferences';
import { ShiftClientManager } from './pages/client-manager/shift';
import { SettingsClientManager } from './pages/client-manager/settings';
// Docusign
import {  DocusignComponent } from './pages/docusign/docusign';

import {
  UnauthorizedComponent
} from './pages/unauthorized/unauthorized';

import {
  HomeV2Admin as HomeStaffRedirect,
  StaffAdmin as StaffRedirect
} from './pages/staff-direct/index'

import {
  StaffPersonalAdmin as StaffPersonalAdminRedirect,
  StaffContactAdmin as StaffContactAdminRedirect,
  StaffPayAdmin as StaffPayAdminRedirect,
  StaffLeaveAdmin as StaffLeaveAdminRedirect,
  StaffReminderAdmin as StaffReminderAdminRedirect,
  StaffOPAdmin as StaffOPAdminRedirect,
  StaffHRAdmin as StaffHRAdminRedirect,
  StaffCompetenciesAdmin as StaffCompetenciesAdminRedirect,
  StaffTrainingAdmin as StaffTrainingAdminRedirect,
  StaffIncidentAdmin as StaffIncidentAdminRedirect,
  StaffDocumentAdmin as StaffDocumentAdminRedirect,
  StaffAttendanceAdmin as StaffAttendanceAdminRedirect,
  StaffPositionAdmin  as StaffPositionAdminRedirect,
  StaffGroupingsAdmin as StaffGroupingsAdminRedirect,
  StaffLoansAdmin     as StaffLoansAdminRedirect,
} from './pages/staff-direct/staff-views/index'


import {
  HomeClient,
  NotesClient,
  HistoryClient,
  BookingClient,
  DocumentClient,
  PackageClient,
  PreferencesClient,
  ShiftClient,
  CalendarClient,
  ProfileClient
} from '@client/index'

import {
  ProfileProvider,
  HomeProvider,
  CalendarProvider,
  DocumentProvider,
  HistoryProvider,
  LeaveProvider,
  PackageProvider
} from '@provider/index';

import {
  AttendanceAdmin,
  DayManagerAdmin,
  HomeAdmin,
  HomeV2Admin,
  LandingAdmin,
  SideMainMenu,
  RecipientsAdmin,
  ReportsAdmin,
  UserReports,  
  SessionsAdmin,
  StaffAdmin,
  TimesheetAdmin,
  ConfigurationAdmin,
  HCPComponent  
} from '@admin/index'

import {
  StaffAttendanceAdmin,
  StaffCompetenciesAdmin,
  StaffContactAdmin,
  StaffDocumentAdmin,
  StaffGroupingsAdmin,
  StaffLoansAdmin,
  StaffHRAdmin,
  StaffIncidentAdmin,
  StaffLeaveAdmin,
  StaffOPAdmin,
  StaffPayAdmin,
  StaffPersonalAdmin,
  StaffPositionAdmin,
  StaffReminderAdmin,
  StaffTrainingAdmin
} from './pages/admin/staff-views/index';

import {
  RecipientCasenoteAdmin,
  RecipientContactsAdmin,
  RecipientHistoryAdmin,
  RecipientIncidentAdmin,
  RecipientIntakeAdmin,
  RecipientOpnoteAdmin,
  RecipientPensionAdmin,
  RecipientPermrosterAdmin,
  RecipientPersonalAdmin,
  RecipientQuotesAdmin,
  RecipientRemindersAdmin,
  RecipientFormsAdmin,
  RecipientAttendanceAdmin,
  RecipientOthersAdmin,
  RecipientAccountingAdmin
} from './pages/admin/recipient-views/index'

import {
  RouteGuard,
  AdminStaffRouteGuard,
  CanDeactivateGuard
} from '@services/index'

import {
  IntakeAlerts,
  IntakeBranches,
  IntakeConsents,
  IntakeFunding,
  IntakeGoals,
  IntakeGroups,
  IntakePlans,
  IntakeServices,
  IntakeStaff
} from '@intakes/index';

import {
  ProfileAccounting,
  AccountingHistory
} from '@accounting/index';


import {  
  RostersAdmin
} from './pages/roster/index';

import { ExtraComponent } from './pages/extra/extra';

//branches
import {  BranchesComponent  } from './pages/admin/configuration/genrel-setup/branches/branches.component';
//funding regions
import{ FundingRegionsComponent } from './pages/admin/configuration/genrel-setup/funding-regions/funding-regions.component';
//clain rates
import { ClaimratesComponent } from '@admin/configuration/genrel-setup/claimrates.component';
import { TargetgroupsComponent } from '@admin/configuration/genrel-setup/targetgroups.component';
import { PurposestatementComponent } from '@admin/configuration/genrel-setup/purposestatement.component';
import { BudgetgroupsComponent } from '@admin/configuration/genrel-setup/budgetgroups.component';
import { BudgetsComponent } from '@admin/configuration/genrel-setup/budgets.component';
import { ContactgroupsComponent } from '@admin/configuration/genrel-setup/contactgroups.component';
import { ContacttypesComponent } from '@admin/configuration/genrel-setup/contacttypes.component';
import { AddresstypesComponent } from '@admin/configuration/genrel-setup/addresstypes.component';
import { OccupationComponent } from '@admin/configuration/genrel-setup/occupation.component';
import { ReligionComponent } from '@admin/configuration/genrel-setup/religion.component';
import { PhoneemailtypesComponent } from '@admin/configuration/genrel-setup/phoneemailtypes.component';
import { FinancialclassComponent } from '@admin/configuration/genrel-setup/financialclass.component';
import { PostcodesComponent } from '@admin/configuration/genrel-setup/postcodes.component';
import { HolidaysComponent } from '@admin/configuration/genrel-setup/holidays.component';
import { MedicalcontactComponent } from '@admin/configuration/genrel-setup/medicalcontact.component';
import { DestinationaddressComponent } from '@admin/configuration/genrel-setup/destinationaddress.component';
import { ProgramcoordinatesComponent } from '@admin/configuration/genrel-setup/programcoordinates.component';
import { DistributionlistComponent } from '@admin/configuration/genrel-setup/distributionlist.component';
import { InitialactionsComponent } from '@admin/configuration/incidents/initialactions.component';
import { OngoingactionsComponent } from '@admin/configuration/incidents/ongoingactions.component';
import { IncidenttriggersComponent } from '@admin/configuration/incidents/incidenttriggers.component';
import { IncidenttypesComponent } from '@admin/configuration/incidents/incidenttypes.component';
import { IncidentsubcatComponent } from '@admin/configuration/incidents/incidentsubcat.component';
import { IncidentnotecategoryComponent } from '@admin/configuration/incidents/incidentnotecategory.component';
import { LocationCategoriesComponent } from '@admin/configuration/incidents/location-categories.component';
import { StaffincidentnotecategoryComponent } from '@admin/configuration/incidents/staffincidentnotecategory.component';
import { FillingclassificationComponent } from '@admin/configuration/documents/fillingclassification.component';
import { DocumentcategoriesComponent } from '@admin/configuration/documents/documentcategories.component';
import { RecipientsCategoryComponent } from '@admin/configuration/recipients/recipients-category.component';
import { RecipientsGroupComponent } from '@admin/configuration/recipients/recipients-group.component';
import { RecipientsMinorGroupComponent } from '@admin/configuration/recipients/recipients-minor-group.component';
import { RecipientsBillingCyclesComponent } from '@admin/configuration/recipients/recipients-billing-cycles.component';
import { DebtorTermsComponent } from '@admin/configuration/recipients/debtor-terms.component';
import { RecipientGoalsComponent } from '@admin/configuration/recipients/recipient-goals.component';
import { ConsentTypesComponent } from '@admin/configuration/recipients/consent-types.component';
import { CarePlanTypesComponent } from '@admin/configuration/recipients/care-plan-types.component';
import { ClinicalNotesGroupsComponent } from '@admin/configuration/recipients/clinical-notes-groups.component';
import { CaseNoteCategoriesComponent } from '@admin/configuration/recipients/case-note-categories.component';
import { OpNoteCategoriesComponent } from '@admin/configuration/recipients/op-note-categories.component';
import { CareDomainsComponent } from '@admin/configuration/recipients/care-domains.component';
import { DischargeReasonsComponent } from '@admin/configuration/recipients/discharge-reasons.component';
import { RefferalReasonsComponent } from '@admin/configuration/recipients/refferal-reasons.component';
import { UserDefinedRemindersComponent } from '@admin/configuration/recipients/user-defined-reminders.component';
import { RecipientPrefrencesComponent } from '@admin/configuration/recipients/recipient-prefrences.component';
import { MobilityCodesComponent } from '@admin/recipient-views/mobility-codes.component';
import { TasksComponent } from '@admin/recipient-views/tasks.component';
import { HealthConditionsComponent } from '@admin/recipient-views/health-conditions.component';
import { MedicationsComponent } from '@admin/recipient-views/medications.component';
import { NursingDignosisComponent } from '@admin/recipient-views/nursing-dignosis.component';
import { MedicalDignosisComponent } from '@admin/recipient-views/medical-dignosis.component';
import { MedicalProceduresComponent } from '@admin/recipient-views/medical-procedures.component';
import { ClinicalRemindersComponent } from '@admin/recipient-views/clinical-reminders.component';
import { ClinicalAlertsComponent } from '@admin/recipient-views/clinical-alerts.component';
import { AdmittingPrioritiesComponent } from '@admin/recipient-views/admitting-priorities.component';
import { ServicenotecatComponent } from '@admin/recipient-views/servicenotecat.component';
import { ReferralSourcesComponent } from '@admin/configuration/recipients/referral-sources.component';
import { LifecycleEventsComponent } from '@admin/configuration/recipients/lifecycle-events.component';
import { JobCategoryComponent } from '@admin/configuration/staff/job-category.component';
import { AdminCategoryComponent } from '@admin/configuration/staff/admin-category.component';
import { StaffUserGroupsComponent } from '@admin/configuration/staff/staff-user-groups.component';
import { AwardLevelsComponent } from '@admin/configuration/staff/award-levels.component';
import { StaffCompetencyGroupComponent } from '@admin/configuration/staff/staff-competency-group.component';
import { StaffNotesCategoriesComponent } from '@admin/configuration/staff/staff-notes-categories.component';
import { StaffPositionsComponent } from '@admin/configuration/staff/staff-positions.component';
import { StaffTeamsComponent } from '@admin/configuration/staff/staff-teams.component';
import { AwardDetailsComponent } from '@admin/configuration/staff/award-details.component';
import { OpStaffNotesComponent } from '@admin/configuration/staff/op-staff-notes.component';
import { StaffRemindersComponent } from '@admin/configuration/staff/staff-reminders.component';
import { ServiceDeciplinesComponent } from '@admin/configuration/staff/service-deciplines.component';
import { StaffPreferencesComponent } from '@admin/configuration/staff/staff-preferences.component';
import { LeaveDescriptionsComponent } from '@admin/configuration/staff/leave-descriptions.component';
import { ServiceNoteCategoriesComponent } from '@admin/configuration/staff/service-note-categories.component';
import { VehiclesComponent } from '@admin/configuration/others/vehicles.component';
import { ActivityGroupsComponent } from '@admin/configuration/others/activity-groups.component';
import { EquipmentsComponent } from '@admin/configuration/others/equipments.component';
import { StaffCompetenciesComponent } from '@admin/configuration/staff/staff-competencies.component';
import { CentrFacilityLocationComponent } from '@admin/configuration/others/centr-facility-location.component';
import { FundingSourcesComponent } from '@admin/configuration/others/funding-sources.component';
import { PayTypeComponent } from '@admin/configuration/others/pay-type.component';
import { ProgramPackagesComponent } from '@admin/configuration/others/program-packages.component';
import { ServicesComponent } from '@admin/configuration/services/services.component';
import { ItemsConsumablesComponent } from '@admin/configuration/services/items-consumables.component';
import { MenuMealsComponent } from '@admin/configuration/services/menu-meals.component';
import { CaseMangementAdminComponent } from '@admin/configuration/services/case-mangement-admin.component';
import { StaffAdminActivitiesComponent } from '@admin/configuration/services/staff-admin-activities.component';
import { RecipientAbsenceComponent } from '@admin/configuration/services/recipient-absence.component';
import { CompaniesComponent } from '@admin/configuration/genrel-setup/companies.component';
import { DocumentTemplateComponent } from '@admin/configuration/documents/document-template.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'client',
    component: HomeClient,
    canActivate: [RouteGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'notes',
        component: NotesClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'history',
        component: HistoryClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'booking',
        component: BookingClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'document',
        component: DocumentClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'package',
        component: PackageClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'preferences',
        component: PreferencesClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'manage-services',
        component: ShiftClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'profile',
        component: ProfileClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'calendar',
        component: CalendarClient,
        canActivate: [RouteGuard],
      },
      {
        path: 'members',
        component: MembersComponent
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent
      }
    ]
  },
  {
    path: 'client-manager',
    component: HomeClientManager,
    children: [
      {
        path: 'profile',
        component: ProfileClientManager
      },
      {
        path: 'notes',
        component: NotesClientManager
      },
      {
        path: 'history',
        component: HistoryClientManager
      },
      {
        path: 'booking',
        component: BookingClientManager
      },
      {
        path: 'document',
        component: DocumentClientManager
      },
      {
        path: 'package',
        component: PackageClientManager
      },
      {
        path: 'preferences',
        component: PreferencesClientManager
      },
      {
        path: 'manage-services',
        component: ShiftClientManager
      },
      {
        path: 'calendar',
        component: CalendarClientManager
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent
      },
      {
        path: 'settings',
        component: SettingsClientManager
      }
    ]
  },
  {
    path: 'provider',
    component: HomeProvider,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileProvider
      },
      {
        path: 'calendar',
        component: CalendarProvider
      },
      {
        path: 'history',
        component: HistoryProvider
      },
      {
        path: 'package',
        component: PackageProvider
      },
      {
        path: 'document',
        component: DocumentProvider
      },
      {
        path: 'leave',
        component: LeaveProvider
      }
    ]
  },
  {
    path:'staff-direct',
    component: HomeStaffRedirect,
    children: [
      {
        path: '',
        redirectTo: 'staff',
        pathMatch: 'full'
      },
      {
        path: 'staff/:user/:id',
        component: StaffRedirect
      },
      {
        path: 'staff',
        component: StaffRedirect,
        children: [
          {
            path: 'personal',
            component: StaffPersonalAdminRedirect
          },
          {
            path: 'contacts',
            component: StaffContactAdminRedirect
          },
          {
            path: 'pay',
            component: StaffPayAdminRedirect
          },
          {
            path: 'Loans',
            component: StaffLoansAdminRedirect
          },
          {
            path: 'leave',
            component: StaffLeaveAdminRedirect
          },
          {
            path: 'reminders',
            component: StaffReminderAdminRedirect
          },
          {
            path: 'op-note',
            component: StaffOPAdminRedirect
          },
          {
            path: 'hr-note',
            component: StaffHRAdminRedirect
          },
          {
            path: 'competencies',
            component: StaffCompetenciesAdminRedirect
          },
          {
            path: 'training',
            component: StaffTrainingAdminRedirect
          },
          {
            path: 'incident',
            component: StaffIncidentAdminRedirect
          },
          {
            path: 'document',
            component: StaffDocumentAdminRedirect
          },
          {
            path: 'time-attendance',
            component: StaffAttendanceAdminRedirect,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'position',
            component: StaffPositionAdminRedirect
          },
          {
            path: 'groupings-preferences',
            component: StaffGroupingsAdminRedirect
          },
        ]
      }
    ]
  },
  {
    path: 'admin',
    component: HomeV2Admin,
    canActivate: [AdminStaffRouteGuard],
    children: [
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
      },
      {
        path: 'landing',
        component: SideMainMenu
      },
      // {
      //   path: 'landing',
      //   component: LandingAdmin
      // },
      {
        path: 'daymanager',
        component: DayManagerAdmin
      },
      {
        path: 'timesheet',
        component: TimesheetAdmin
      },
      {
        path: 'reports',
        component: ReportsAdmin
      },
      {
        path: 'user-reports',
        component: UserReports
      },
      {
        path: 'configuration',
        component: ConfigurationAdmin
      },
      {
        path: 'hcp',
        component: HCPComponent
      },
      {
        path: 'companies',
        component: CompaniesComponent,
      },
      {
        path: 'branches',
        component: BranchesComponent
      },
      {
        path: 'funding-region',
        component: FundingRegionsComponent
      },
      {
        path:"claim-rates",
        component:ClaimratesComponent
      },
      {
        path:"target-groups",
        component:TargetgroupsComponent
      },
      {
        path:"purpose-statement",
        component:PurposestatementComponent
      },
      {
        path:"budget-groups",
        component:BudgetgroupsComponent
      },
      {
        path:"budgets",
        component:BudgetsComponent
      },
      {
        path:"contact-groups",
        component:ContactgroupsComponent,
      },
      {
        path:"contact-types",
        component:ContacttypesComponent,
      },
      {
        path:"address-types",
        component:AddresstypesComponent,
      },
      {
        path:"religions",
        component:ReligionComponent,
      },
      {
        path:"occupations",
        component:OccupationComponent,
      },
      {
        path:"phone-email-types",
        component:PhoneemailtypesComponent,
      },
      {
        path:"financial-class",
        component:FinancialclassComponent,
      },
      {
        path:"postcodes",
        component:PostcodesComponent,
      },
      {
        path:"holidays",
        component:HolidaysComponent,
      },
      {
        path:"medical-contact",
        component:MedicalcontactComponent,
      },
      {
        path:"destination-address",
        component:DestinationaddressComponent,
      },
      {
        path:"program-coordinates",
        component:ProgramcoordinatesComponent,
      },
      {
        path:"distribution-list",
        component:DistributionlistComponent,
      },
      {
        path:"initial-actions",
        component:InitialactionsComponent,
      },
      {
        path:"ongoing-actions",
        component:OngoingactionsComponent,
      },
      {
        path:"incident-trigger",
        component:IncidenttriggersComponent,
      },
      {
        path:"incident-types",
        component:IncidenttypesComponent,
      },
      {
        path:"incident-sub-category",
        component:IncidentsubcatComponent
      },
      {
        path:"incident-location-categories",
        component:LocationCategoriesComponent
      },
      {
        path:"recipient-incident-note-category",
        component:IncidentnotecategoryComponent
      },
      {
        path:"staff-incident-note-category",
        component:StaffincidentnotecategoryComponent
      },
      {
        path:"filling-classification",
        component:FillingclassificationComponent
      },
      {
        path:"document-categories",
        component:DocumentcategoriesComponent,
      },
      {
        path:"document-template",
        component:DocumentTemplateComponent,
      },
      {
        path:"recipients-categories",
        component:RecipientsCategoryComponent
      },
      {
        path:"recipients-groups",
        component:RecipientsGroupComponent
      },
      {
        path:"recipients-minor-group",
        component:RecipientsMinorGroupComponent
      },
      {
        path:"recipients-billing-cycles",
        component:RecipientsBillingCyclesComponent,
      },
      {
        path:"debtor-terms",
        component:DebtorTermsComponent
      },
      {
        path:"recipient-goals",
        component:RecipientGoalsComponent
      },
      {
        path:"consent-types",
        component:ConsentTypesComponent
      },
      {
        path:"care-plan-types",
        component:CarePlanTypesComponent
      },
      {
        path:"clicnical-notes-groups",
        component:ClinicalNotesGroupsComponent
      },
      {
        path:"case-notes-categories",
        component:CaseNoteCategoriesComponent
      },
      {
        path:"op-notes-categories",
        component:OpNoteCategoriesComponent
      },
      {
        path:"care-domains",
        component:CareDomainsComponent
      },
      {
        path:"discharge-reasons",
        component:DischargeReasonsComponent
      },
      {
        path:"refferal-reasons",
        component:RefferalReasonsComponent
      },
      {
        path:"user-define-reminders",
        component:UserDefinedRemindersComponent
      },
      {
        path:"recipient-prefrences",
        component:RecipientPrefrencesComponent
      },
      {
        path:"mobility-codes",
        component:MobilityCodesComponent
      },
      {
        path:"tasks",
        component:TasksComponent
      },
      {
        path:"health-conditions",
        component:HealthConditionsComponent,
      },
      {
        path:"medications",
        component:MedicationsComponent
      },
      {
        path:"nursing-dignosis",
        component:NursingDignosisComponent
      },
      {
        path:"medical-dignosis",
        component:MedicalDignosisComponent
      },
      {
        path:"medical-procedures",
        component:MedicalProceduresComponent
      },
      {
        path:"clinical-reminders",
        component:ClinicalRemindersComponent
      },
      {
        path:"clinical-alerts",
        component:ClinicalAlertsComponent
      },
      {
        path:"admitting-priorities",
        component:AdmittingPrioritiesComponent
      },
      {
        path:"service-not-categories",
        component:ServicenotecatComponent
      },
      {
        path:"referral-sources",
        component:ReferralSourcesComponent
      },
      {
        path:"lifecycle-events",
        component:LifecycleEventsComponent
      },
      {
        path:"job-category",
        component:JobCategoryComponent
      },
      {
        path:"admin-category",
        component:AdminCategoryComponent
      },
      {
        path:"admin-category",
        component:AdminCategoryComponent
      },
      {
        path:"user-groups",
        component:StaffUserGroupsComponent
      },
      {
        path:"award-levels",
        component:AwardLevelsComponent,
      },
      {
        path:"competency-groups",
        component:StaffCompetencyGroupComponent
      },
      {
        path:"staff-competency",
        component:StaffCompetenciesComponent
      },
      {
        path:"hr-notes-categories",
        component:StaffNotesCategoriesComponent
      },
      {
        path:"staff-positions",
        component:StaffPositionsComponent
      },
      {
        path:"staff-teams",
        component:StaffTeamsComponent
      },
      {
        path:"award-details",
        component:AwardDetailsComponent
      },
      {
        path:"op-staff-notes",
        component:OpStaffNotesComponent,
      },
      {
        path:"staff-reminder",
        component:StaffRemindersComponent,
      },
      {
        path:"service-deciplines",
        component:ServiceDeciplinesComponent
      },
      {
        path:"staff-preferences",
        component:StaffPreferencesComponent,
      },
      {
        path:"leave-description",
        component:LeaveDescriptionsComponent,
      },
      {
        path:"service-note-categories",
        component:ServiceNoteCategoriesComponent,
      },
      {
        path:"vehicles",
        component:VehiclesComponent,
      },
      {
        path:"activity-groups",
        component:ActivityGroupsComponent,
      },
      {
        path:"equipments",
        component:EquipmentsComponent,
      },
      {
        path:"center-facility-location",
        component:CentrFacilityLocationComponent,
      },{
        path:"funding-sources",
        component:FundingSourcesComponent,
      },
      {
        path:"pay-types",
        component:PayTypeComponent,
      },{
        path:"program-packages",
        component:ProgramPackagesComponent
      },
      {
        path:"services",
        component:ServicesComponent
      },
      {
        path:"items-consumables",
        component:ItemsConsumablesComponent
      },
      {
        path:"menu-meals",
        component:MenuMealsComponent,
      },
      {
        path:"case-management-admin",
        component:CaseMangementAdminComponent
      },
      {
        path:"staff-admin-activities",
        component:StaffAdminActivitiesComponent
      },
      {
        path:"recipient-absences",
        component:RecipientAbsenceComponent,
      },
      {
        path: 'rosters',
        component: RostersAdmin
      },
      {
        path: 'staff',
        component: StaffAdmin,
        children: [
          {
            path: 'personal',
            component: StaffPersonalAdmin
          },
          {
            path: 'contacts',
            component: StaffContactAdmin
          },
          {
            path: 'pay',
            component: StaffPayAdmin
          },
          {
            path: 'loans',
            component: StaffLoansAdmin
          },
          {
            path: 'leave',
            component: StaffLeaveAdmin
          },
          {
            path: 'reminders',
            component: StaffReminderAdmin
          },
          {
            path: 'op-note',
            component: StaffOPAdmin
          },
          {
            path: 'hr-note',
            component: StaffHRAdmin
          },
          {
            path: 'competencies',
            component: StaffCompetenciesAdmin
          },
          {
            path: 'training',
            component: StaffTrainingAdmin
          },
          {
            path: 'incident',
            component: StaffIncidentAdmin
          },
          {
            path: 'document',
            component: StaffDocumentAdmin
          },
          {
            path: 'time-attendance',
            component: StaffAttendanceAdmin,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'position',
            component: StaffPositionAdmin
          },
          {
            path: 'groupings-preferences',
            component: StaffGroupingsAdmin
          },
        ]
      },
      {
        path: 'recipient',
        component: RecipientsAdmin,
        children: [
          {
            path: 'personal',
            component: RecipientPersonalAdmin
          },
          {
            path: 'contacts',
            component: RecipientContactsAdmin
          },
          {
            path: 'accounting',
            component: RecipientAccountingAdmin,
            children: [
              {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full'
              },
              {
                path: 'profile',
                component: ProfileAccounting
              },
              {
                path: 'accounting',
                component: AccountingHistory
              },
            ]
          },
          {
            path: 'intake',
            component: RecipientIntakeAdmin,
            children: [
              {
                path: '',
                redirectTo: 'branches',
                pathMatch: 'full'
              },
              {
                path: 'alerts',
                component: IntakeAlerts
              },
              {
                path: 'branches',
                component: IntakeBranches
              },
              {
                path: 'consents',
                component: IntakeConsents
              },
              {
                path: 'funding',
                component: IntakeFunding
              },
              {
                path: 'goals',
                component: IntakeGoals
              },
              {
                path: 'groups',
                component: IntakeGroups
              },
              {
                path: 'plans',
                component: IntakePlans
              },
              {
                path: 'services',
                component: IntakeServices
              },
              {
                path: 'staff',
                component: IntakeStaff
              }
            ]
          },
          {
            path: 'reminders',
            component: RecipientRemindersAdmin
          },
          {
            path: 'forms',
            component: RecipientFormsAdmin
          },
          {
            path: 'attendance',
            component: RecipientAttendanceAdmin,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'accounting',
            component: RecipientAccountingAdmin
          },
          {
            path: 'others',
            component: RecipientOthersAdmin,
            canDeactivate: [CanDeactivateGuard]
          },
          {
            path: 'opnote',
            component: RecipientOpnoteAdmin
          },
          {
            path: 'casenote',
            component: RecipientCasenoteAdmin
          },
          {
            path: 'incidents',
            component: RecipientIncidentAdmin
          },
          {
            path: 'perm-roster',
            component: RecipientPermrosterAdmin
          },
          {
            path: 'history',
            component: RecipientHistoryAdmin
          },
          {
            path: 'insurance-pension',
            component: RecipientPensionAdmin
          },
          {
            path: 'quotes',
            component: RecipientQuotesAdmin
          }
        ]
      }
    ]
  },
  {
    path: 'extra',
    component: ExtraComponent
  },
  {
    path: 'traccsadmin',
    component: StaffAdmin
  },
  {
    path: 'docusign',
    component: DocusignComponent
  }
  // {
  //   path: '**',
  //   redirectTo: ''
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const PAGE_COMPONENTS = [
  
  // Importing Client
  HomeClient,
  NotesClient,
  HistoryClient,
  BookingClient,
  DocumentClient,
  PackageClient,
  PreferencesClient,
  ShiftClient,
  CalendarClient,
  ProfileClient,
  
  // Importing Providers
  ProfileProvider,
  HomeProvider,
  CalendarProvider,
  DocumentProvider,
  HistoryProvider,
  LeaveProvider,
  PackageProvider,
  
  // Importing Admin
  AttendanceAdmin,
  DayManagerAdmin,
  HomeAdmin,
  HomeV2Admin,
  SideMainMenu,
  LandingAdmin,
  RecipientsAdmin,
  ReportsAdmin,
  UserReports,
  SessionsAdmin,
  StaffAdmin,
  TimesheetAdmin,
  ConfigurationAdmin,
  HCPComponent,
  
  // Components
  ProfilePage,
  //Roster Module
  RostersAdmin,
  
  //Configuration
  CompaniesComponent,
  BranchesComponent,
  FundingRegionsComponent,
  ClaimratesComponent,
  TargetgroupsComponent,
  PurposestatementComponent,
  BudgetgroupsComponent,
  BudgetsComponent,
  ContactgroupsComponent,
  ContacttypesComponent,
  AddresstypesComponent,
  ReligionComponent,
  OccupationComponent,
  PhoneemailtypesComponent,
  FinancialclassComponent, 
  PostcodesComponent,
  HolidaysComponent,
  MedicalcontactComponent,
  DestinationaddressComponent,
  ProgramcoordinatesComponent,
  DistributionlistComponent,
  InitialactionsComponent,
  OngoingactionsComponent,
  IncidenttriggersComponent,
  IncidenttypesComponent,
  IncidentsubcatComponent,
  StaffincidentnotecategoryComponent,
  IncidentnotecategoryComponent,
  LocationCategoriesComponent,
  FillingclassificationComponent,
  DocumentcategoriesComponent,
  DocumentTemplateComponent,
  RecipientsCategoryComponent,
  RecipientsGroupComponent,
  RecipientsMinorGroupComponent,
  RecipientsBillingCyclesComponent,
  DebtorTermsComponent,
  RecipientGoalsComponent,
  ConsentTypesComponent,
  CarePlanTypesComponent,
  ClinicalNotesGroupsComponent,
  CaseNoteCategoriesComponent,
  OpNoteCategoriesComponent,
  CareDomainsComponent,
  DischargeReasonsComponent,
  RefferalReasonsComponent,
  UserDefinedRemindersComponent,
  RecipientPrefrencesComponent,
  MobilityCodesComponent,
  TasksComponent,
  HealthConditionsComponent,
  MedicationsComponent,
  NursingDignosisComponent,
  MedicalDignosisComponent,
  MedicalProceduresComponent,
  ClinicalRemindersComponent,
  ClinicalAlertsComponent,
  AdmittingPrioritiesComponent,
  ServicenotecatComponent,
  ReferralSourcesComponent,
  LifecycleEventsComponent,
  JobCategoryComponent,
  AdminCategoryComponent,
  StaffUserGroupsComponent,
  AwardLevelsComponent,
  StaffCompetencyGroupComponent,
  StaffCompetenciesComponent,
  StaffNotesCategoriesComponent,
  StaffPositionsComponent,
  StaffTeamsComponent,
  AwardDetailsComponent,
  OpStaffNotesComponent,
  StaffRemindersComponent,
  ServiceDeciplinesComponent,
  StaffPreferencesComponent,
  LeaveDescriptionsComponent,
  ServiceNoteCategoriesComponent,
  VehiclesComponent,
  ActivityGroupsComponent,
  EquipmentsComponent,
  CentrFacilityLocationComponent,
  FundingSourcesComponent,
  PayTypeComponent,
  ProgramPackagesComponent,
  ServicesComponent,
  ItemsConsumablesComponent,
  MenuMealsComponent,
  CaseMangementAdminComponent,
  StaffAdminActivitiesComponent,
  RecipientAbsenceComponent,
  // Staff Views
  StaffAttendanceAdmin,
  StaffCompetenciesAdmin,
  StaffContactAdmin,
  StaffDocumentAdmin,
  StaffGroupingsAdmin,
  StaffLoansAdmin,
  StaffHRAdmin,
  StaffIncidentAdmin,
  StaffLeaveAdmin,
  StaffOPAdmin,
  StaffPayAdmin,
  StaffPersonalAdmin,
  StaffPositionAdmin,
  StaffReminderAdmin,
  StaffTrainingAdmin,
  
  // Recipient Views
  RecipientCasenoteAdmin,
  RecipientContactsAdmin,
  RecipientHistoryAdmin,
  RecipientIncidentAdmin,
  RecipientIntakeAdmin,
  RecipientOpnoteAdmin,
  RecipientPensionAdmin,
  RecipientPermrosterAdmin,
  RecipientPersonalAdmin,
  RecipientQuotesAdmin,
  RecipientRemindersAdmin,
  RecipientFormsAdmin,
  RecipientAttendanceAdmin,
  RecipientOthersAdmin,
  RecipientAccountingAdmin,
  
  // Intake Views
  IntakeAlerts,
  IntakeBranches,
  IntakeConsents,
  IntakeFunding,
  IntakeGoals,
  IntakeGroups,
  IntakePlans,
  IntakeServices,
  IntakeStaff,
  
  ExtraComponent,
  UnauthorizedComponent,
  
  // Client Manager
  HomeClientManager,
  ProfileClientManager,
  BookingClientManager,
  CalendarClientManager,
  DocumentClientManager,
  HistoryClientManager,
  NotesClientManager,
  PackageClientManager,
  PreferencesClientManager,
  ShiftClientManager,
  
  //Staff Redirect
  HomeStaffRedirect,
  StaffRedirect,
  
  StaffPersonalAdminRedirect,
  StaffContactAdminRedirect,
  StaffPayAdminRedirect,
  StaffLeaveAdminRedirect,
  StaffReminderAdminRedirect,
  StaffOPAdminRedirect,
  StaffHRAdminRedirect,
  StaffCompetenciesAdminRedirect,
  StaffTrainingAdminRedirect,
  StaffIncidentAdminRedirect,
  StaffDocumentAdminRedirect,
  StaffAttendanceAdminRedirect,
  StaffPositionAdminRedirect,
  StaffGroupingsAdminRedirect,
  StaffLoansAdminRedirect,

  ProfileAccounting,
]

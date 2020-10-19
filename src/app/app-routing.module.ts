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
  StaffPositionAdmin as StaffPositionAdminRedirect,
  StaffGroupingsAdmin as StaffGroupingsAdminRedirect
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
  RostersAdmin,
  SessionsAdmin,
  StaffAdmin,
  TimesheetAdmin,
  ConfigurationAdmin,
  
} from '@admin/index'

import {
  StaffAttendanceAdmin,
  StaffCompetenciesAdmin,
  StaffContactAdmin,
  StaffDocumentAdmin,
  StaffGroupingsAdmin,
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
  RecipientRemindersAdmin
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
        redirectTo: 'daymanager',
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
        path: 'configuration',
        component: ConfigurationAdmin
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
  RostersAdmin,
  SessionsAdmin,
  StaffAdmin,
  TimesheetAdmin,
  ConfigurationAdmin,

  // Components
  ProfilePage,

  //Configuration
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
  // Staff Views
  StaffAttendanceAdmin,
  StaffCompetenciesAdmin,
  StaffContactAdmin,
  StaffDocumentAdmin,
  StaffGroupingsAdmin,
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
  StaffGroupingsAdminRedirect
]

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';

import {  ProfilePage } from '@components/index';

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
  TimesheetAdmin
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

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'client',
    component: HomeClient,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'notes',
        component: NotesClient
      },
      {
        path: 'history',
        component: HistoryClient
      },
      {
        path: 'booking',
        component: BookingClient
      },
      {
        path: 'document',
        component: DocumentClient
      },
      {
        path: 'package',
        component: PackageClient
      },
      {
        path: 'preferences',
        component: PreferencesClient
      },
      {
        path: 'manage-services',
        component: ShiftClient
      },
      {
        path: 'profile',
        component: ProfileClient
      },
      {
        path: 'calendar',
        component: CalendarClient
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
    path: 'admin',
    component: HomeV2Admin,
    canActivate: [RouteGuard],
    canActivateChild: [RouteGuard],
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
        path: 'rosters',
        component: RostersAdmin
      },
      {
        path: 'staff/**',
        component: StaffAdmin,
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

  // Components
  ProfilePage,

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

  ExtraComponent
]

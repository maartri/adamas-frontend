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
  LandingAdmin,
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
} from './pages/admin/staff-views/index'

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
        path: 'timesheet',
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
    component: HomeAdmin,
    children: [
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
      },
      {
        path: 'landing',
        component: LandingAdmin
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
            component: StaffAttendanceAdmin
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
      }
    ]
  },
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
  LandingAdmin,
  RecipientsAdmin,
  ReportsAdmin,
  RostersAdmin,
  SessionsAdmin,
  StaffAdmin,
  TimesheetAdmin,

  // Components
  ProfilePage,

  // StaffViews
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


]

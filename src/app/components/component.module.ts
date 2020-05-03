import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UploadFileComponent } from './upload-file/upload-file.component'
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { RemoveFirstLast, FilterPipe, KeyFilter, MomentTimePackage, KeyValueFilter, FileNameFilter, FileSizeFilter, MonthPeriodFilter, SplitArrayPipe, DayManagerPopulate } from '@pipes/pipes';
import { ProfileComponent } from './profile/profile.component'

import {
  SuburbComponent
} from '@components/index';

import {
  ClickOutsideDirective,
  NumberDirective
} from "../directives/index";

import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { HeaderNavComponent } from './header-nav/header-nav.component';
import { ActionComponent } from './action/action.component';
import { SearchListComponent } from './search-list/search-list.component';
import { ContactsDetailsComponent } from './contacts-details/contacts-details.component';
import { SearchTimesheetComponent } from './search-timesheet/search-timesheet.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { DmCalendarComponent } from './dm-calendar/dm-calendar.component';
import { RecipientPopupComponent } from './recipient-popup/recipient-popup.component';
import { PhonefaxComponent } from './phonefax/phonefax.component';

@NgModule({
  declarations: [
    UploadFileComponent,

    //Directives,
    ClickOutsideDirective, NumberDirective,

    RemoveFirstLast, FilterPipe, KeyFilter, MomentTimePackage, KeyValueFilter, FileNameFilter, FileSizeFilter, MonthPeriodFilter, SplitArrayPipe, DayManagerPopulate,
    ProfileComponent,
    SuburbComponent,
    CalendarComponent,
    HeaderNavComponent,    
    ActionComponent,
    SearchListComponent,
    ContactsDetailsComponent,
    SearchTimesheetComponent,
    BreadcrumbsComponent,
    DmCalendarComponent,
    RecipientPopupComponent,
    PhonefaxComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzUploadModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    UploadFileComponent,
    MonthPeriodFilter,
    SuburbComponent,
    ProfileComponent,
    HeaderNavComponent,
    CalendarComponent,
    ActionComponent,
    SearchListComponent,
    ContactsDetailsComponent,
    SearchTimesheetComponent,
    BreadcrumbsComponent,
    DmCalendarComponent,
    DayManagerPopulate,
    RecipientPopupComponent
  ],
  providers: [
    
  ]
})
  
export class ComponentModule { }

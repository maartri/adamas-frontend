import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { AppRoutingModule, PAGE_COMPONENTS } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData, CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import en from '@angular/common/locales/en';

import { LoginComponent } from './pages/login/login.component';

import { ToastrModule } from 'ngx-toastr';

import { JwtModule } from '@auth0/angular-jwt';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import {
  AuthService,
  LoginService,
  GlobalService,
  ClientService,
  StaffService,
  ReportService,
  EmailService,
  RouteGuard,
  LoginGuard,
  TimeSheetService,
  ListService,
  UploadService,
  MemberService,
  ExecutableService,
  LandingService,
  JobService,
  CacheService,
  ScriptService,
  ShareService
} from './services/index';

import { IconsProviderModule } from './icons-provider.module';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { ComponentModule } from '@components/component.module'
import { AgGridModule } from 'ag-grid-angular';

registerLocaleData(en);

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PAGE_COMPONENTS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ComponentModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      autoDismiss: true,
      maxOpened: 5
    }),
    IconsProviderModule,
    NgZorroAntdModule,
    NzLayoutModule,
    NzButtonModule,
    NzGridModule,
    NzTableModule,
    NzModalModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:5000"],
      }
    }),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    AgGridModule.withComponents([]),
    InfiniteScrollModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    AuthService,
    LoginService,
    GlobalService,
    ClientService,
    StaffService,
    ReportService,
    EmailService,
    RouteGuard,
    LoginGuard,
    TimeSheetService,
    ListService,
    UploadService,
    MemberService,
    ExecutableService,
    LandingService,
    JobService,
    CacheService,
    ScriptService,
    ShareService,
    CurrencyPipe, DatePipe, DecimalPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

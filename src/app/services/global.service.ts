import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';

import { NzNotificationService } from 'ng-zorro-antd/notification';

const helper = new JwtHelperService();

import { FormGroup} from '@angular/forms';

import format from 'date-fns/format';
import isValid from 'date-fns/isValid'

export const roles = {
    provider: 'SERVICE PROVIDER',
    client: 'PORTAL CLIENT',
    admin: 'ADMIN USER',
    portal: 'PORTAL CLIENT MULTI',
    manager: 'CLIENT MANAGER'
}

export const view = {
    staff: 'staff',
    recipient: 'recipient',
    admin: 'admin'
}

export const ROSTER_TYPE = {
    2: "ONEONONE",
    3: "BROKERED SERVICE",
    4: "LEAVE ABSENCE",
    5: "TRAVEL TIME",
    6: "ADMIN ACTIVITY",
    7: "ADMISSION SERVICE",
    8: "SLEEPOVER",
    9: "",
    10: "TRANSPORT",
    11: "CENTRE BASED ACTIVITY",
    12: "GROUP ACTIVITY",
    13: "UNAVAILABILITY",
    14: "ITEM"
}
export const fundingDropDowns = {
    type: ['CACP', 'EACH', 'EACHD', 'DS', 'OTHER'],
    status: ['REFERRAL', 'WAITING LIST', 'ACTIVE', 'ON HOLD', 'INACTIVE'],
    expireUsing: ['CHARGE RATE', 'PAY UNIT RATE', 'ACTIVITY AVG COST'],
    homeCare: ['MM', 'ARIA'],
    packageTerm: ['ONGOING WITH PERIODICAL REVIEW', 'TERMINATING'],
    costType: ['HOURS', 'DOLLARS', 'SERVICES'],
    perUnit: ['PER', 'TOTAL'],
    period: ['DAY', 'WEEK', 'FORTNIGHT', '4 WEEKS', 'MONTH', '6 WEEKS', 'QUARTER', '6 MONTHS', 'YEAR'],
    length: ['WEEK', 'FORTNIGHT', '4 WEEKS', 'MONTH', '6 WEEKS', 'QUARTER', '6 MONTHS', 'YEAR', 'ONGOING', 'OTHER'],
    alerts: ['HOURS', 'DOLLARS', 'SERVICES'],
    cycle: ['CYCLE 1', 'CYCLE 2', 'CYCLE 3', 'CYCLE 4', 'CYCLE 5', 'CYCLE 6', 'CYCLE 7', 'CYCLE 8', 'CYCLE 9', 'CYCLE 10']
}

export const states = ['AUSTRALIAN CAPITAL TERRITORY', 'NEW SOUTH WALES', 'NORTHERN TERRITORY', 'QUEENSLAND', 'SOUTH AUSTRALIA', 'TASMANIA', 'VICTORIA', 'WESTERN AUSTRALIA']
export const cycles = ['1st Monday - CYCLE 1', '1st Tuesday - CYCLE 1', '1st Wednesday - CYCLE 1', '1st Thursday - CYCLE 1', '1st Friday - CYCLE 1']
export const billunit = ['HOUR', 'SERVICE']
export const period = ['DAY', 'WEEKLY', 'FNIGHTLY', 'MONTH', 'QUARTER', 'HALF YEAR', 'YEAR']
export const status = ['WAIT LIST', 'ON HOLD', 'ACTIVE', 'INACTIVE']
export const achievementIndex = ['(1) NOT ACHIEVED', '(2) PARTIALLY ACHIEVED', '(3) MOSTLY ACHIEVED', '(4) FULLY ACHIEVED', '(5) ONGOING', '(6) FUNDING NOT APPROVED']
export const caldStatuses = ['CALD BACKGROUND', 'NOT CALD BACKGROUND']
export const titles = ["", "Mr", "Ms", "Mrs", "Dr"]
export const types = ['', 'BROKERAGE ORGANISATION', 'STAFF', 'SUNDRY BROKERAGE SUPPLIER', 'VOLUNTEER']
export const gender = ['', 'MALE', 'FEMALE', 'NOT STATED']
export const months = moment.months()
export const recurringInt = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
export const recurringStr = ['Day/s', 'Week/s', 'Month/s', 'Year/s']
export const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

export const incidentTypes: Array<string> = ["BEHAVIOURAL", "CONDUCT", "HEALTHINSURER", "MEDICAL", "PUNCTUALITY / ATTENDANCE", "SERIOUS INCIDENT", "OTHER"]
export const leaveTypes: string[] = ["OTHER LEAVE", "REC LEAVE", "SICK LEAVE"];
export const incidentSeverity: string[] = ["LOW", "MEDIUM", "HIGH"];
export const statuses: Array<string> = ['', 'CASUAL', 'CONTRACT', 'FULL TIME CONTRACT', 'FULL TIME PERMANENT', 'PART TIME CONTRACT', 'PART TIME PERMANENT'];
export const contactGroups: Array<string> = ['1-NEXT OF KIN', '2-CARER', '3-MEDICAL', '4-ALLIED HEALTH', '5-HEALTH INSURANCE', '6-POWER OF ATTORNEY', '7-LEGAL OTHER', '8-OTHER'];

@Injectable()
export class GlobalService {

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private notification: NzNotificationService
    ) {

    }

    static filterDate(date: any) {
        return date != null ? moment(date).format() : null
    }

    sample() {
        return 'gwapo';
    }

    viewRender(token: string) {

        if (this.isVarNull(token))
            return false;

        let _temp = this.decode(token);

        let data: Dto.Jwt = {
            aud: _temp.aud,
            code: _temp.code,
            exp: _temp.exp,
            iss: _temp.iss,
            jti: _temp.jti,
            nbf: _temp.nbf,
            role: _temp.role,
            user: _temp.user
        }

        if (data.role === roles.provider)
            this.router.navigate(['provider']);
        if (data.role === roles.admin)
            this.router.navigate(['admin']);
        if (data.role === roles.client || data.role === roles.manager)
            this.router.navigate(['client']);
        if (data.role === roles.portal)
            this.router.navigate(['portal']);
    }

    get member(): string {
        return localStorage.getItem('member');
    }

    set member(data: string) {
        localStorage.setItem('member', data);
    }

    get packageStatement(): string {
        return localStorage.getItem('package_statement');
    }

    set packageStatement(data: string) {
        localStorage.setItem('package_statement', data);
    }

    get token(): string {
        return localStorage.getItem('access_token');
    }

    set token(data: string) {
        localStorage.setItem('access_token', data);
    }

    get userProfile() {
        return JSON.parse(localStorage.getItem('profile'));
    }

    set userProfile(data: any) {
        localStorage.setItem('profile', JSON.stringify(data));
    }

    get userSettings() {
        return JSON.parse(localStorage.getItem('settings'));
    }

    set userSettings(data: any) {
        localStorage.setItem('settings', JSON.stringify(data));
    }

    isRecipients999() {
        return this.userSettings.Recipients === 999;
    }

    isVarNull(data: any) {
        return data == null || data == "";
    }

    isRole(): string {
        if (!this.isVarNull(this.token)) {
            let _temp = this.decode(this.token);
            return _temp.role;
        }
        return null;
    }

    decode(token: string = this.token) {
        return helper.decodeToken(token);
    }

    clearTokens(): void {
        localStorage.clear();
    }

    year(): Array<string> {
        const year = [];
        const currentYear = moment().year();
        for (let count = currentYear - 110; count <= currentYear; count++)
            year.push(count.toString());

        return year;
    }

    isExpired() {
        return helper.isTokenExpired(this.token);
    }

    filterYear(date: string) {
        return new DatePipe('en-US').transform(date, 'yyyy');
    }

    filterMonth(date: string): string {
        var monthStr = new DatePipe('en-US').transform(date, 'MM');
        return months[parseInt(monthStr) - 1];
    }

    filterDay(date: string) {
        return new DatePipe('en-US').transform(date, 'dd');
    }

    serialize(obj: any): any {

        if (obj == null)
            return {};

        let params = new HttpParams();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var element = obj[key];
                params = params.set(key, element);
            }
        }
        return params;
    }

    isLeapYear(year): boolean {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    findIndex(searchStr: string, arrAny: Array<any>, key: string): number {
        for (var a = 0, len = arrAny.length; a < len; a++) {
            if (arrAny[a][key] === searchStr) {
                return a;
            }
        }
        return -1;
    }

    IsRTF2TextRequired(escaped: string) {
        return (((escaped.match(/\\/g) || []).length > 5 && (escaped.match(/{/g) || []).length > 0 && (escaped.match(/}/g) || []).length > 0));  
    }

    searchOf(data: string, arrString: Array<string>, def: string): string {
        var ifFound = {
            state: false,
            index: -1
        };
        if (data == null)
            return '';

        var temp = data.toLowerCase();
        for (var a = 0; a < arrString.length; a++) {
            if (arrString[a].toLowerCase().indexOf(temp) > -1) {
                ifFound.state = true;
                ifFound.index = a;
                break;
            }
        }

        if (!ifFound.state)
            return def || '';

        return arrString[ifFound.index];
    }

    getMinutes(time: string): number {
        var momentTime = moment(time, 'HH:mm');
        return momentTime.hours() * 60 + momentTime.minutes();
    }

    twentynine(): Array<string> {
        return days.filter(x => {
            if (parseInt(x) < 30)
                return x;
        })
    }

    thirty() {
        return days.filter(x => {
            if (parseInt(x) < 31)
                return x;
        })
    }

    twentyeight() {
        return days.filter(x => {
            if (parseInt(x) < 29)
                return x;
        })
    }

    hasNoEmpty(data: any) {
        for (var prop in data) {
            if (!data[prop] || data[prop] == null || data[prop] == "")
                return false;
        }
        return true;
    }

    logout() {
        this.clearTokens();
        this.router.navigate(['']);
    }

    sToast(title: string = 'Success', details: string) {
        this.notification.success(title, details);
        //this.toastr.success(details, title);
    }

    wToast(title: string, details: string) {
        this.notification.warning(title, details);
        //this.toastr.warning(title, details);
    }

    iToast(title: string, details: string) {
        this.notification.info(title, details);
        //this.toastr.info(title, details);
    }

    eToast(title: string, details: string) {
        this.notification.error(title, details);
        //this.toastr.error(details, title);
    }

    isEmpty(value: any) {
        return (value == null || value.length === 0);
    }

    isCurrentRoute(router: any, currRoute: string) {
        const urlSplit = router.url.split('/');
        return urlSplit[urlSplit.length - 1] === currRoute;
    }

    acceptOnlyNumeric(data: KeyboardEvent) {
        if (data.key.length == 1 && /^[a-z.,]$/i.test(data.key)) {
            return false;
        }
        return true;
    }

    getDateOnly(date: string) {
        const newDate = format(Date.parse(date),'dd/MM/yyyy');
        return newDate;
    }

    VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(date: string | Date): Date | null {
        if (!date) return null;
        var cleanDate = new Date(date);

        if (isValid(cleanDate)) {
            // FIXING the Date anomaly by giving the time static values
            return new Date(cleanDate.getFullYear(), cleanDate.getMonth(), cleanDate.getDate(), 12, 0, 0, 0);
        }
        // returns current date
        return null;
    }

    rt2filter(data: string): string {
        let strFilter = "";

        if (data && data.split('\\fs').length > 1) {
            let arrStr = data.split('\\fs');
            arrStr.pop();
            strFilter = arrStr.join();
        }

        return strFilter || data;
    }

    solveTime(time: any, interval: any, isAdd: boolean) {
        const _time = moment(time, ['HH:mm'])
        const _interval = moment(interval, ['HH:mm'])

        var newTime;

        if (isAdd) {
            newTime = moment(_time).add(_interval.hour(), 'h').add(_interval.minute(), 'm');
        } else {
            newTime = moment(_time).subtract(_interval.hour(), 'h').subtract(_interval.minute(), 'm');
        }
        return moment(newTime).format('HH:mm');
    }

    isVarious(data: Array<any>) {
        return data && data.length > 1 ? 'VARIOUS' : data[0].program;
    }

    getEarliestTime(dates: Array<any>) {
        if (dates.length == 0) return null;
        var earliestDate = dates.reduce((pre, curr) => {
            return Date.parse(pre) > Date.parse(curr) ? curr : pre;
        })
        return earliestDate;
    }

    randomString(): string {
        return `_${Math.random().toString(36).substr(2, 9)}`;
    }

    computeTime(_start: any, _end: any): Dto.DateTimeVariables {

        const minutesInAnHour = 60;

        const start = moment(_start, ['HH:mm']);
        const end = moment(_end, ['HH:mm']);
        const invalid = 'Invalid Time'

        if (start.hour() > end.hour()) return { durationStr: invalid }
        if (start.hour() === end.hour() && start.minute() >= end.minute()) return { durationStr: invalid }

        var starttime = start.hour() * minutesInAnHour + start.minutes();
        var endtime = end.hour() * minutesInAnHour + end.minutes();

        var diffTime = endtime - starttime;
        const diffHour = Math.floor(diffTime / minutesInAnHour);
        const diffMinutes = diffTime % minutesInAnHour;

        return {
            durationStr: diffHour + ' hr ' + diffMinutes + ' min',
            duration: (diffTime / minutesInAnHour) * 12,
            durationInHours: (diffTime / minutesInAnHour),
            quants: (diffTime / minutesInAnHour).toFixed(2),
            blockNo: starttime / 5
        }
    }

    IsFormValid(inputForm: FormGroup): boolean {
        for (const i in inputForm.controls) {
            inputForm.controls[i].markAsDirty();
            inputForm.controls[i].updateValueAndValidity();
        }

        if (!inputForm.valid)
            return false;
        return true;
    }

    filterFontLiterals(data: any): string {
        if (!data) return '';

        if (data.split('\\').length > 1) {
            return data.split(/\n/)[1].split('\\fs17')[1]
        }
        else
            return data;
    }

    filterDate(date: any): string {
        return moment(date).format('DD/MM/YYYY')
    }

    dateInput(date: any): string {
        if (!date) return null;
        return moment(date).format();
    }

    filterTime(date: any): string {
        return moment(date).format('HH:mm')
    }

    getStartEndCurrentMonth(): any {
        let date = {
            start: moment().startOf('month'),
            end: moment().endOf('month')
        }
        return date;
    }


}
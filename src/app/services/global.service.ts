import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import isValid from 'date-fns/isValid'
import getHours from 'date-fns/getHours'
import getMinutes from 'date-fns/getMinutes'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import { Jwt, DateTimeVariables } from '@modules/modules';

const helper = new JwtHelperService();

import { FormGroup} from '@angular/forms';


export enum TYPE_MESSAGE {
    warning = 'warning',
    success = 'success',
    error = 'error'
}

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
export const quantity = [1,2,3,4,5,6,7,8,9,10,11];
export const unit = ['EACH','PACK','CTN','PKT','ROLL/S']

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
    levels: ['LEVEL 1', 'LEVEL 2', 'LEVEL 3','LEVEL 4'],
    cycle: ['CYCLE 1', 'CYCLE 2', 'CYCLE 3', 'CYCLE 4', 'CYCLE 5', 'CYCLE 6', 'CYCLE 7', 'CYCLE 8', 'CYCLE 9', 'CYCLE 10']
}

export const dateFormat = "dd/MM/yyyy";
export const dayStrings = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const qoutePlantype = ['SUPPORT PLAN'];
export const states = ['AUSTRALIAN CAPITAL TERRITORY', 'NEW SOUTH WALES', 'NORTHERN TERRITORY', 'QUEENSLAND', 'SOUTH AUSTRALIA', 'TASMANIA', 'VICTORIA', 'WESTERN AUSTRALIA']
export const cycles = ['1st Monday - CYCLE 1', '1st Tuesday - CYCLE 1', '1st Wednesday - CYCLE 1', '1st Thursday - CYCLE 1', '1st Friday - CYCLE 1']
export const billunit = ['HOUR', 'SERVICE']
export const basePeriod = ['ANNUALLY', 'FIXED PERIOD']
export const period = ['DAY', 'WEEKLY', 'FNIGHTLY', 'MONTH', 'QUARTER', 'HALF YEAR', 'YEAR']
export const periodQuote = ['ONCE OFF', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY', 'QUARTERLY', 'HALF YEARLY', 'YEARLY']
export const status = ['WAIT LIST', 'ON HOLD', 'ACTIVE', 'INACTIVE']
export const achievementIndex = ['(1) NOT ACHIEVED', '(2) PARTIALLY ACHIEVED', '(3) MOSTLY ACHIEVED', '(4) FULLY ACHIEVED', '(5) ONGOING', '(6) FUNDING NOT APPROVED']
export const expectedOutcome = ['(1) Daily Living', '(2) Home', '(3) Health and Well-being', '(4) Lifelong Learning', '(5) Work', '(6) Social and Community Participation','(7) Relationships','(8) Choice and Control']
export const caldStatuses = ['CALD BACKGROUND', 'NOT CALD BACKGROUND']
export const titles = ["Mr", "Ms", "Mrs", "Dr"]
export const types = ['BROKERAGE ORGANISATION', 'STAFF', 'SUNDRY BROKERAGE SUPPLIER', 'VOLUNTEER']
export const gender = ['MALE', 'FEMALE', 'NOT STATED']
export const months = moment.months()
export const recurringInt = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
export const recurringStr = ['Day/s', 'Week/s', 'Month/s', 'Year/s']
export const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
export const timeSteps = ["00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00","03:15","03:30","03:45","04:00","04:15","04:30","04:45","05:00","05:15","05:30","05:45","06:00","06:15","06:30","06:45","07:00","07:00","07:15","07:30","07:45","08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","18:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30","21:45","22:00","23:15","23:30","23:45","24:00"];
export const incidentTypes: Array<string> = ["BEHAVIOURAL", "CONDUCT", "HEALTHINSURER", "MEDICAL", "PUNCTUALITY / ATTENDANCE", "SERIOUS INCIDENT", "OTHER"]
export const leaveTypes: string[] = ["OTHER LEAVE", "REC LEAVE", "SICK LEAVE"];
export const budgetTypes: string[] = ["BILL Qty", "DOLLARS", "HOURS","INSTANCES"]; 
export const enforcement: string[] = ["HARD LIMIT", "SOFT LIMIT"]; 
export const incidentSeverity: string[] = ["LOW", "MEDIUM", "HIGH"];
export const statuses: Array<string> = ['', 'CASUAL', 'CONTRACT', 'FULL TIME CONTRACT', 'FULL TIME PERMANENT', 'PART TIME CONTRACT', 'PART TIME PERMANENT'];
export const contactGroups: Array<string> = ['1-NEXT OF KIN', '2-CARER', '3-MEDICAL', '4-ALLIED HEALTH', '5-HEALTH INSURANCE', '6-POWER OF ATTORNEY', '7-LEGAL OTHER', '8-OTHER'];



@Injectable()
export class GlobalService {
var1 = '';
var2 = '';
emailaddress:Array<string> = []  ;
followups:any ;
doc:any; 
stafftonotiify:any = "ABFLAT GISELBERT";
id: any;
baseamount :number = 0;
admincharges :number = 0;

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private notification: NzNotificationService,
        private message: NzMessageService
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

        let data: Jwt = {
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
        if (data.role === roles.client)
            this.router.navigate(['client']);
        if (data.role === roles.portal)
            this.router.navigate(['portal']);
        if (data.role === roles.manager)
            this.router.navigate(['client-manager']);
    }

    get settings(): string {
        return JSON.parse(localStorage.getItem('settings'));
    }

    set settings(data: string) {
        localStorage.setItem('settings', JSON.stringify(data));
    }

    get redirectURL(): string {
        return localStorage.getItem('redirectURL');
    }

    set redirectURL(data: string) {
        localStorage.setItem('redirectURL', data);
    }

    get ISTAFF_BYPASS(): string {
        return localStorage.getItem('isStaffByPass');
    }

    set ISTAFF_BYPASS(data: string) {
        localStorage.setItem('isStaffByPass', data);
    }

    get member(): string {
        return localStorage.getItem('member');
    }

    set member(data: string) {
        localStorage.setItem('member', data);
    }

    get pickedMemberUser(): string {
        return localStorage.getItem('picked_member_user');
    }

    set pickedMemberUser(data: string) {
        localStorage.setItem('picked_member_user', data);
    }

    get pickedMember(): string {
        return JSON.parse(localStorage.getItem('picked_member'));
    }

    set pickedMember(data: string) {
        localStorage.setItem('picked_member', JSON.stringify(data));
    }

    get packageStatement(): string {
        return JSON.parse(localStorage.getItem('package_statement'));
    }

    set packageStatement(data: string) {
        localStorage.setItem('package_statement', JSON.stringify(data));
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
        localStorage.setItem('original_settings', JSON.stringify(data));
    }

    get originalSettings() {
        return JSON.parse(localStorage.getItem('settings'));
    }

    set originalSettings(data: any) {
        localStorage.setItem('original_settings', JSON.stringify(data));
    }

    
    GETPICKEDMEMBERDATA(data: any, recipientDocFolder: string = null){
        return {
            code: data.accountNo,
            uniqueID: data.uniqueID,
            recipientDocFolder: recipientDocFolder
        } 
    }

    GETPICKEDMEMBERROLEANDUSER(){
        return{
            user: this.pickedMemberUser,
            role: 'PORTAL CLIENT'
        }
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
    isValueNull(data: any){
        if (!this.isVarNull(data)) {
            return "'"+data+"'";
        }
        return null;
    }
    isPackageLeaveTypeExists(tableData,username) {
        return tableData.some(function(el) {
          username = username.replace(/'/g, '');
          return el.leaveActivityCode.trim().toUpperCase() === username.trim().toUpperCase();
        }); 
    }
    isStaffexist(tableData,username) {
        return tableData.some(function(el) {
          username = username.replace(/'/g, '');
          return el.name.trim().toUpperCase() === username.trim().toUpperCase();
        }); 
    }
    
    isCompetencyExists(tableData,username){        
            if(tableData.length > 0 ){
                return tableData.some(function(el) {
                    username = username.replace(/'/g, '');
                    return el.competency.trim().toUpperCase() === username.trim().toUpperCase();
                  })
            }
            return false;
    }
    isTitleExists(tableData,username) {
        return tableData.some(function(el) {
          username = username.replace(/'/g, '');
          return el.title.trim().toUpperCase() === username.trim().toUpperCase();
        }); 
    }
    isNameExists(tableData,username) { 
        return tableData.some(function(el) {
          username = username.replace(/'/g, '');
          return el.name.trim().toUpperCase() === username.trim().toUpperCase();
        }); 
    }
    isDescriptionExists(tableData,username) {
        return tableData.some(function(el) {
          username = username.replace(/'/g, '');
          return el.description.trim().toUpperCase() === username.trim().toUpperCase();
        }); 
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

    createMessage(type: TYPE_MESSAGE, message: string){
        this.message.create(type, message);
    }

    loadingMessage(message: string = 'Action in progress..'): string{
        return this.message.loading(message, { nzDuration: 0 }).messageId;
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
        if (!(data.key.length == 1 && /^[0-9 ]+$/.test(data.key))) {
            return false;
        }
        return true;
    }

    acceptOnlyLetters(data: KeyboardEvent) {
        if ((/^[a-zA-Z\s]*$/.test(data.key))) {
            return true;
        }
        return false;
    }

    getDateOnly(date: string) {
        const newDate = format(Date.parse(date),'dd/MM/yyyy');
        return newDate;
    }
    getCurrentDate(){
        return moment().format('yyyy-MM-DD')
    }
    convertDbDate(date:string){
        const newDate = format(Date.parse(date),'yyyy/MM/dd');
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

    computeTime(_start: any, _end: any): DateTimeVariables {
        
        const minutesInAnHour = 60;

        const start = moment(_start, ['HH:mm']);
        const end = moment(_end, ['HH:mm']);
        const invalid = 'Invalid Time'

        if (typeof _start === "undefined" || typeof _end === "undefined") {
            return { durationStr: invalid };
        }

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

    computeTimeDifference(_start: Date, _end: Date){
        return differenceInMinutes(_end, _start);
    }


    computeTimeDATE_FNS(_start: any, _end: any): DateTimeVariables {
        
        const minutesInAnHour = 60;
        const invalid = 'Invalid Time';
        const noTime = 'Both time values are required'

        if(!_start || !_end) return  { durationStr: noTime, error: true }
        if (getHours(_start) > getHours(_end)) return { durationStr: invalid, error: true }
        if (getHours(_start) === getHours(_end) && getMinutes(_start) >= getMinutes(_end)) return { durationStr: invalid, error: true }

        var starttime = getHours(_start) * minutesInAnHour + getMinutes(_start);
        var endtime = getHours(_end) * minutesInAnHour + getMinutes(_end);

        var diffTime = endtime - starttime;
        const diffHour = Math.floor(diffTime / minutesInAnHour);
        const diffMinutes = diffTime % minutesInAnHour;

        return {
            durationStr: diffHour + ' hr ' + diffMinutes + ' min',
            duration: (diffTime / minutesInAnHour) * 12,
            durationInHours: (diffTime / minutesInAnHour),
            quants: (diffTime / minutesInAnHour).toFixed(2),
            blockNo: starttime / 5,
            error: false
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
 
    curreentDate(){
        return moment(new Date()).format('MM-DD-YYYY');
    } 
    getAgedCareDate(){
        return moment().startOf('year').subtract(65, 'years').format('MM/DD/YYYY');
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



    // DATE CALCULATIONS

    SAMPLE_START_DATE_ZEROHOURSMINUTES(date: Date): Date{
        return new Date(2020,8,21, 0, 0);
    }

    SAMPLE_END_DATE_MAXHOURSMINUTES(date: Date): Date{
        return new Date(2020,9,19, 23, 59);
    }

    START_DATE_ZEROHOURSMINUTES(date: Date): Date{
        return new Date(date.getFullYear(),date.getMonth(),date.getDate(), 0, 0);
    }

    END_DATE_MAXHOURSMINUTES(date: Date): Date{
        return new Date(date.getFullYear(),date.getMonth(),date.getDate(), 23, 59);
    }

    DIFFERENCE_DATE(laterDate: Date, earlierDate: Date){
        var _laterDate = this.END_DATE_MAXHOURSMINUTES(laterDate);
        var _earlierDate = this.START_DATE_ZEROHOURSMINUTES(earlierDate);
        
        return differenceInDays(_laterDate, _earlierDate);
    }

    CONVERTSTRING_TO_DATETIME(data: any): Date | null{
        if(data == null) return null;
    
        var _date = format(parseISO(data),"yyyy-MM-dd'T'HH:mm:ss");
        return parse(_date,"yyyy-MM-dd'T'HH:mm:ss", new Date());
    }

    CALCULATE_WHAT_WEEK_FORTNIGHT(payperiod: Date, dateToBeCalculated: Date){
        // console.log(payperiod)
        // console.log(dateToBeCalculated)

        var _laterDate = this.END_DATE_MAXHOURSMINUTES(dateToBeCalculated);
        var _earlierDate = this.START_DATE_ZEROHOURSMINUTES(payperiod);

        var diffWeeks = differenceInWeeks(_laterDate, _earlierDate);

        if(diffWeeks == 0 || diffWeeks % 2 == 0){
            return 1;
        } 

        if(diffWeeks % 2 == 1){
            return 2;
        }
    }

    removeExtension(filename: string){
        var lastDotPosition = filename.lastIndexOf(".");
        if (lastDotPosition === -1) return filename;
        else return filename.substr(0, lastDotPosition);
    }

    CALCULATE_WHAT_WEEK_FOURWEEKLY(payperiod: Date, dateToBeCalculated: Date){

        var _laterDate = this.END_DATE_MAXHOURSMINUTES(dateToBeCalculated);
        var _earlierDate = this.START_DATE_ZEROHOURSMINUTES(payperiod);
        
        var diffWeeks = differenceInWeeks(_laterDate, _earlierDate);
        
        if(diffWeeks % 4 == 1){
            return 2;
        }

        if(diffWeeks % 4 == 2){
            return 3;
        }

        if(diffWeeks % 4 == 3){
            return 4;
        }

        if(diffWeeks % 4 == 0){
            return 1;
        }
    }

    APPEND_DATE_TIME_ON_DIFFERENT_DATETIMES(forDate: Date, forTime: Date): Date{
        var _date = format(forDate,"yyyy-MM-dd");
        var _time = format(forTime,"HH:mm");

        return parseISO(`${_date}T${_time}:00`);
    }

    // DATE CALCULATIONS -  END
}
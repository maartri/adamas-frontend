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
import {  JsConfig } from '@modules/modules';
const helper = new JwtHelperService();

import { FormGroup} from '@angular/forms';

export const topMarginStyle = { top: '20px' };

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
export const sbFieldsSkill = {
  'fStaffContainer9-Competencies0022': 'SB1',
  'fStaffContainer9-Competencies0023': 'SB2',
  'fStaffContainer9-Competencies0024': 'SB3',
  'fStaffContainer9-Competencies0025': 'SB4',
  'fStaffContainer9-Competencies0026': 'SB5',
  'fStaffContainer9-Competencies0027': 'SB6',
  'fStaffContainer9-Competencies0028': 'SB7',
  'fStaffContainer9-Competencies0029': 'SB8',
  'fStaffContainer9-Competencies0030': 'SB9',
  'fStaffContainer9-Competencies0031': 'SB10',
  'fStaffContainer9-Competencies0032': 'SB11',
  'fStaffContainer9-Competencies0033': 'SB12',
  'fStaffContainer9-Competencies0034': 'SB13',
  'fStaffContainer9-Competencies0036': 'SB14',
  'fStaffContainer9-Competencies0040': 'SB15',
  'fStaffContainer9-Competencies0041': 'SB16',
  'fStaffContainer9-Competencies0042': 'SB17',
  'fStaffContainer9-Competencies0043': 'SB18',
  'fStaffContainer9-Competencies0044': 'SB19',
  'fStaffContainer9-Competencies0045': 'SB20',
  'fStaffContainer9-Competencies0046': 'SB21',
  'fStaffContainer9-Competencies0047': 'SB22',
  'fStaffContainer9-Competencies0048': 'SB23',
  'fStaffContainer9-Competencies0049': 'SB24',
  'fStaffContainer9-Competencies0050': 'SB25',
  'fStaffContainer9-Competencies0051': 'SB26',
  'fStaffContainer9-Competencies0052': 'SB27',
  'fStaffContainer9-Competencies0053': 'SB28',
  'fStaffContainer9-Competencies0054': 'SB29',
  'fStaffContainer9-Competencies0070': 'SB30',
  'fStaffContainer9-Competencies0069': 'SB31',
  'fStaffContainer9-Competencies0068': 'SB32',
  'fStaffContainer9-Competencies0067': 'SB33',
  'fStaffContainer9-Competencies0066': 'SB34',
  'fStaffContainer9-Competencies0065': 'SB35',
}

// export const sbFieldsSkill = new Map([
//   ["fstaffContainer9-Competencies0022", "SB1"],
//   ["fstaffContainer9-Competencies0023", "SB2"],
//   ["fstaffContainer9-Competencies0024", "SB3"],
//   ["fstaffContainer9-Competencies0025", "SB4"],
//   ["fstaffContainer9-Competencies0026", "SB5"],
//   ["fstaffContainer9-Competencies0027", "SB6"],
//   ["fstaffContainer9-Competencies0028", "SB7"],
//   ["fstaffContainer9-Competencies0029", "SB8"],
//   ["fstaffContainer9-Competencies0030", "SB9"],
//   ["fstaffContainer9-Competencies0031", "SB10"],
//   ["fstaffContainer9-Competencies0032", "SB11"],
//   ["fstaffContainer9-Competencies0033", "SB12"],
//   ["fstaffContainer9-Competencies0034", "SB13"],
//   ["fstaffContainer9-Competencies0036", "SB14"],
//   ["fstaffContainer9-Competencies0040", "SB15"],
//   ["fstaffContainer9-Competencies0041", "SB16"],
//   ["fstaffContainer9-Competencies0042", "SB17"],
//   ["fstaffContainer9-Competencies0043", "SB18"],
//   ["fstaffContainer9-Competencies0044", "SB19"],
//   ["fstaffContainer9-Competencies0045", "SB20"],
//   ["fstaffContainer9-Competencies0046", "SB21"],
//   ["fstaffContainer9-Competencies0047", "SB22"],
//   ["fstaffContainer9-Competencies0048", "SB23"],
//   ["fstaffContainer9-Competencies0049", "SB24"],
//   ["fstaffContainer9-Competencies0050", "SB25"],
//   ["fstaffContainer9-Competencies0051", "SB26"],
//   ["fstaffContainer9-Competencies0052", "SB27"],
//   ["fstaffContainer9-Competencies0053", "SB28"],
//   ["fstaffContainer9-Competencies0054", "SB29"],
//   ["fstaffContainer9-Competencies0070", "SB30"],
//   ["fstaffContainer9-Competencies0069", "SB31"],
//   ["fstaffContainer9-Competencies0068", "SB32"],
//   ["fstaffContainer9-Competencies0067", "SB33"],
//   ["fstaffContainer9-Competencies0066", "SB34"],
//   ["fstaffContainer9-Competencies0065", "SB35"],
// ])

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

export const dataSetDropDowns = {
  CACP:['CACP SERVICES'],
  CTP: ['ALLIED HEALTH CARE', 'ASSESSMENT-CARER', 'ASSESSMENT-CLIENT', 'CARE COORDINATION-CARER', 'CARE COORDINATION-CLIENT','CARER TRANSPORT','CASE MANAGEMENT','CENTRE-BASED DAY CARE','COUNSELLING/SUPPORT INFO & ADVOCACY-CARER','COUNSELLING/SUPPORT INFO & ADVOCACY-CLIENT','DATA COLLECTION','DOMESTIC ASSISTANCE','FORMAL LINEN SERVICE','HOME MAINTENANCE','HOME MODIFICATION','MEALS','NURSING CARE','OTHER FOOD SERVICES','PERSONAL CARE','PROVISION OF GOODS & EQUIPMENT','RESPITE CARE','SOCIAL SUPPORT','TRANSPORT'],
  DEX: ['Allied Health and Therapy Services', 'Assistance with Care and Housing', 'Carers, Disability and Mental Health','Centre-Based Respite','Cottage Respite','Domestic Assistance','Emergency Relief Funds','Flexible Respite','Goods, Equipment and Assistive Technology','Home Maintenance','Home Modifications','Meals','Nursing','Other Food Services','Personal Care','Social Support Group','Social Support Individual','Specialised Support Services','Transport'],
  DFC: ['ADMISSION', 'ASSESMENT','DATA UPDATE','DISCHARGE','OTHER','REFERRAL - IN','REFERRAL - OUT','REVIEW'],
  DVA: [],
  HACC:['ALLIED HEALTH CARE', 'ASSESSMENT-CARER', 'ASSESSMENT-CLIENT', 'CARE COORDINATION-CARER', 'CARE COORDINATION-CLIENT','CARER TRANSPORT','CASE MANAGEMENT','CENTRE-BASED DAY CARE','COUNSELLING/SUPPORT INFO & ADVOCACY-CARER','COUNSELLING/SUPPORT INFO & ADVOCACY-CLIENT','DATA COLLECTION','DOMESTIC ASSISTANCE','FORMAL LINEN SERVICE','HOME MAINTENANCE','HOME MODIFICATION','MEALS','NURSING CARE','OTHER FOOD SERVICES','PERSONAL CARE','PROVISION OF GOODS & EQUIPMENT','RESPITE CARE','SOCIAL SUPPORT','TRANSPORT'],
  HAS: ['GENERAL SERVICE','HOME MAINTENANCE'],
  QCSS:['COMMUNITY CONNECTION SUPPORTS', 'INFORMATION, ASSESSMENT AND REFERRAL','IN-HOME SUPPORTS'],
  ICTD:['ALLIED HEALTH CARE', 'ASSESSMENT-CARER', 'ASSESSMENT-CLIENT', 'CARE COORDINATION-CARER', 'CARE COORDINATION-CLIENT','CARER TRANSPORT','CASE MANAGEMENT','CENTRE-BASED DAY CARE','COUNSELLING/SUPPORT INFO & ADVOCACY-CARER','COUNSELLING/SUPPORT INFO & ADVOCACY-CLIENT','DATA COLLECTION','DOMESTIC ASSISTANCE','FORMAL LINEN SERVICE','HOME MAINTENANCE','HOME MODIFICATION','MEALS','NURSING CARE','OTHER FOOD SERVICES','PERSONAL CARE','PROVISION OF GOODS & EQUIPMENT','RESPITE CARE','SOCIAL SUPPORT','TRANSPORT'],
  NDIS:[],
  NRCP:['NRCP SERVICES'],
  NRCPSAR:['EMERGENCY', 'NON EMERGENCY'],
  OTHER:['ADMISSION', 'ASSESMENT','DATA UPDATE','DISCHARGE','OTHER','STAFF ONBOARDING','REFERRAL - IN','REFERRAL - OUT','REVIEW']
}

export const notificationTypes = ['Referral Notification','Assessment Notification','Admission Notification','Refer On Notification','Not Proceed Notification','Discharge Notification','Suspend Notification','Reinstate Notification','Admin Notification','Lifecycle Event Notification','Staff Onboard Notification','Staff Terminate Notification']
export const othersType = ['REFERRAL','WAITING LIST','CARER','RECIPIENT','CARER/RECIPIENT','BILLING CLIENT ONLY','ASSOCIATE']
export const attendance = ['NO ALERT','STAFF CASE MANAGER','RECIPIENT CASE MANAGER','BRANCH ROSTER EMAIL']
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
export const titles = ["Mrs","Mr","Miss","Ms","Br","Dame","Dr","EO","Fr","Lady","Master","Prof","Sir","SR"]
export const types = ['BROKERAGE ORGANISATION', 'STAFF', 'SUNDRY BROKERAGE SUPPLIER', 'VOLUNTEER']
export const gender = ['MALE', 'FEMALE', 'NOT STATED']
export const genderList = ['Any Gender','MALE', 'FEMALE']
export const statusList = ['Active','Any Status','Inactive']
export const months = moment.months()
export const recurringInt = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
export const conflictpointList = ['-60', '-45', '-30', '-15','0','+15', '+30', '+45', '+60']
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
export const sampleList: Array<string> = ["EQUALS","BETWEEN","LESS THEN","GREATER THAN","NOT EQUAL TO","IS NOTHING","IS ANYTHING","IS TRUE","IS FALSE"];

export const checkOptionsOne = [
  { label: 'REFERRAL', value: 'REFERRAL', checked: true },
  { label: 'WAITING LIST', value: 'WAITING LIST', checked: true },
  { label: 'RECIPIENT', value: 'RECIPIENT', checked: true },
  { label: 'CARER', value: 'CARER', checked: true },
  { label: 'CARER/RECIPIENT', value: 'CARER/RECIPIENT', checked: true },
  { label: 'BILLING CLIENT', value: 'BILLING CLIENT', checked: true },
  { label: 'ASSOCIATE', value: 'ASSOCIATE', checked: true },
];

export const workflowClassification = ['ADMIT_DEFAULT_REMINDERS','ADMIT_DEFAULT_DOCS','ADMIT_DEFAULT_XTRADATA','REFER_DEFAULT_REMINDERS','REFER_DEFAULT_DOCS','REFER_DEFAULT_XTRADATA','REFERON_DEFAULT_REMINDERS','REFERON_DEFAULT_DOCS','REFERON_DEFAULT_XTRADATA','ASSESS_DEFAULT_REMINDERS','ASSESS_DEFAULT_DOCS','ASSESS_DEFAULT_XTRADATA','NOTPROCEED_DEFAULT_REMINDERS','NOTPROCEED_DEFAULT_DOCS','NOTPROCEED_DEFAULT_XTRADATA','DISCHARGE_DEFAULT_REMINDERS','DISCHARGE_DEFAULT_DOCS','DISCHARGE_DEFAULT_XTRADATA','SUSPEND_DEFAULT_REMINDERS','SUSPEND_DEFAULT_DOCS','SUSPEND_DEFAULT_XTRADATA','REINSTATE_DEFAULT_REMINDERS','REINSTATE_DEFAULT_DOCS','REINSTATE_DEFAULT_XTRADATA','ADMIN_DEFAULT_REMINDERS','ADMIN_DEFAULT_DOCS','ADMIN_DEFAULT_XTRADATA','LIFECYCLE_DEFAULT_REMINDERS','LIFECYCLE_DEFAULT_DOCS','LIFECYCLE_DEFAULT_XTRADATA']

export const staffnodes = [
  
  {
    title: 'Name And Address',
    key: '100',
    expanded: false,
    children:[
          { "title": "Title", "key": "00", isLeaf: true },
          { "title": "First Name", "key": "01", isLeaf: true },
          { "title": "Middle Name", "key": "02", isLeaf: true },
          { "title": "Surname/Orgnisation", "key": "03", isLeaf: true },
          { "title": "Preferred Name", "key": "04", isLeaf: true },
          { "title": "contact Address Line 1", "key": "05", isLeaf: true },
          { "title": "contact Address Line 2", "key": "06", isLeaf: true },
          { "title": "contact Address-Suburb", "key": "07", isLeaf: true },
          { "title": "contact Address-Postcode", "key": "08", isLeaf: true },
          { "title": "contact Address-state", "key": "09", isLeaf: true },
          { "title": "contact Address-GoogleAddress", "key": "10", isLeaf: true },
          { "title": "Usual Address Line 1", "key": "11", isLeaf: true },
          { "title": "Usual Address Line 2", "key": "12", isLeaf: true },
          { "title": "Usual Address-Suburb", "key": "13", isLeaf: true },
          { "title": "Usual Address-Postcode", "key": "14", isLeaf: true },
          { "title": "Usual Address-state", "key": "15", isLeaf: true },
          { "title": "Usual Address-GoogleAddress", "key": "16", isLeaf: true },
          { "title": "Billing Address Line 1", "key": "17", isLeaf: true },
          { "title": "Billing Address Line 2", "key": "18", isLeaf: true },
          { "title": "Billing Address-Suburb", "key": "19", isLeaf: true },
          { "title": "Billing Address-Postcode", "key": "20", isLeaf: true },
          { "title": "Billing Address-state", "key": "21", isLeaf: true },
          { "title": "Billing Address-GoogleAddress ", "key": "22", isLeaf: true },
          { "title": "Destination Address Line 1", "key": "23", isLeaf: true },
          { "title": "Destination Address Line 2", "key": "24", isLeaf: true },
          { "title": "Destination Address-Suburb", "key": "25", isLeaf: true },
          { "title": "Destination Address-Postcode", "key": "26", isLeaf: true },
          { "title": "Destination Address-state", "key": "27", isLeaf: true },
          { "title": "Destination Address-GoogleAddress", "key": "28", isLeaf: true },
          { "title": "Email", "key": "29", isLeaf: true },
          { "title": "Email-SMS", "key": "30", isLeaf: true },
          { "title": "FAX", "key": "31", isLeaf: true },
          { "title": "Home Phone", "key": "32", isLeaf: true },
          { "title": "Mobile Phone", "key": "33", isLeaf: true },
          { "title": "Usual Phone", "key": "34", isLeaf: true },
          { "title": "Work Phone", "key": "35", isLeaf: true },
          { "title": "Current Phone Number", "key": "36", isLeaf: true },
          { "title": "Other Phone Number", "key": "37", isLeaf: true },
    ]
  },
  {
    title: 'Contacts & Next of Kin',
    key: '200',
    expanded: false,
    children: [
          { "title": "Contact Group", "key": "00", isLeaf: true },
          { "title": "Contact Type", "key": "01", isLeaf: true },
          { "title": "Contact Sub Type", "key": "02", isLeaf: true },
          { "title": "Contact User Flag", "key": "03", isLeaf: true },
          { "title": "Contact Person Type", "key": "04", isLeaf: true },
          { "title": "Contact Name", "key": "05", isLeaf: true },
          { "title": "Contact Address", "key": "06", isLeaf: true },
          { "title": "Contact Suburb", "key": "07", isLeaf: true },
          { "title": "Contact Postcode", "key": "08", isLeaf: true },
          { "title": "Contact Phone 1", "key": "09", isLeaf: true },
          { "title": "Contact Phone 2", "key": "10", isLeaf: true },
          { "title": "Contact Mobile", "key": "11", isLeaf: true },
          { "title": "Contact FAX", "key": "12", isLeaf: true },
          { "title": "Contact Email", "key": "13", isLeaf: true },
    ]
  },
  {
    title: 'User Groups',
    key: '300',
    expanded: false,
    children: [
      { "title": "Group Name", "key": "00", isLeaf: true },
      { "title": "Group Note", "key": "01", isLeaf: true },
    ]
  },
  {
    title: 'Prefrences',
    key: '400',
    expanded: false,
    children: [
      { "title": "Preference Name", "key": "00", isLeaf: true },
      { "title": "Preference Note", "key": "01", isLeaf: true },
    ]
  },
  {
    title: 'Loan Items',
    key: '500',
    expanded: false,
    children: [
      { "title": "Loan Item Type", "key": "00", isLeaf: true },
      { "title": "Loan Item Description", "key": "01", isLeaf: true },
      { "title": "Loan Item Date Loaned/Installed", "key": "02", isLeaf: true },
      { "title": "Loan Item Date Collected", "key": "03", isLeaf: true },
    ]
  },
  {
    title: 'Reminders',
    key: '600',
    expanded: false,
    children: [
      { "title": "Reminder Detail", "key": "00", isLeaf: true },
      { "title": "Event Date", "key": "01", isLeaf: true },
      { "title": "Reminder Date", "key": "02", isLeaf: true },
      { "title": "Reminder Notes", "key": "03", isLeaf: true },
    ]
  },
  {
    title: 'Skills & Qualification',
    key: '700',
    expanded: false,
    children: [
      { "title": "Aged", "key": "00", isLeaf: true },
          { "title": "Child", "key": "01", isLeaf: true },
          { "title": "Dementia", "key": "02", isLeaf: true },
          { "title": "Disabilities", "key": "03", isLeaf: true },
          { "title": "Host", "key": "04", isLeaf: true },
          { "title": "Spinal", "key": "05", isLeaf: true },
          { "title": "Mental Health", "key": "06", isLeaf: true },
          { "title": "Palliative", "key": "07", isLeaf: true },
          { "title": "Other", "key": "08", isLeaf: true },
          { "title": "Domestic", "key": "09", isLeaf: true },
          { "title": "Registered Nurse ", "key": "10", isLeaf: true },
          { "title": "PCP/PCA", "key": "11", isLeaf: true },
          { "title": "Enrolled Nurse", "key": "12", isLeaf: true },
          { "title": "CACL1", "key": "13", isLeaf: true },
          { "title": "CACL2", "key": "14", isLeaf: true },
          { "title": "Other1", "key": "15", isLeaf: true },
          { "title": "Other2", "key": "16", isLeaf: true },
          { "title": "Other3", "key": "17", isLeaf: true },
          { "title": "Other4", "key": "18", isLeaf: true },
          { "title": "Other5", "key": "19", isLeaf: true },
          { "title": "Other6", "key": "20", isLeaf: true },
          { "title": "Assertiveness", "key": "21", isLeaf: true },
          { "title": "BackCare", "key": "22", isLeaf: true },
          { "title": "Confidentiality", "key": "23", isLeaf: true },
          { "title": "Dementia", "key": "24", isLeaf: true },
          { "title": "Disabilities", "key": "25", isLeaf: true },
          { "title": "DisabilitiesCert", "key": "26", isLeaf: true },
          { "title": "DutyOfCare", "key": "27", isLeaf: true },
    ]
  },
  {
    title: 'Leaves',
    key: '800',
    expanded: false,
    children:[
      { "title": "Name", "key": "00", isLeaf: true },
          { "title": "Approved Status", "key": "01", isLeaf: true },
          { "title": "Leave Reminder Date", "key": "02", isLeaf: true },
          { "title": "Leave Start Date", "key": "03", isLeaf: true },
          { "title": "Leave End Date", "key": "04", isLeaf: true },
    ]
  },
  {
    title: 'General Info',
    key: '900',
    expanded: false,
    children:[
      { "title": "UniqueID", "key": "00", isLeaf: true },
      { "title": "AcountNo", "key": "01", isLeaf: true },
      { "title": "StaffID", "key": "02", isLeaf: true },
      { "title": "Pin Number", "key": "03", isLeaf: true },
      { "title": "Start Date", "key": "04", isLeaf: true },
      { "title": "Termination Date", "key": "05", isLeaf: true },
      { "title": "Type", "key": "06", isLeaf: true },
      { "title": "Category", "key": "07", isLeaf: true },
      { "title": "Department", "key": "08", isLeaf: true },
      { "title": "Location", "key": "09", isLeaf: true },
      { "title": "Team", "key": "10", isLeaf: true },
      { "title": "Manager/Coordinto ", "key": "11", isLeaf: true },
      { "title": "Service Region", "key": "12", isLeaf: true },
      { "title": "Job Title", "key": "13", isLeaf: true },
      { "title": "Job Status", "key": "14", isLeaf: true },
      { "title": "Job Weighting", "key": "15", isLeaf: true },
      { "title": "Job FTE ", "key": "16", isLeaf: true },
      { "title": "Job Category", "key": "17", isLeaf: true },
      { "title": "Email Timesheet", "key": "18", isLeaf: true },
      { "title": "Award", "key": "19", isLeaf: true },
      { "title": "Award Level", "key": "20", isLeaf: true },
      { "title": "Pay Group", "key": "21", isLeaf: true },
      { "title": "Super %", "key": "22", isLeaf: true },
      { "title": "Super Fund", "key": "23", isLeaf: true },
      { "title": "Vehile Registration", "key": "24", isLeaf: true },
      { "title": "Drivers License", "key": "25", isLeaf: true },
      { "title": "Nurse Registration", "key": "26", isLeaf: true },
      { "title": "Gender", "key": "27", isLeaf: true },
      { "title": "Date of Birth", "key": "28", isLeaf: true },
      { "title": "Age", "key": "29", isLeaf: true },
      { "title": "Ageband-Statistical", "key": "30", isLeaf: true },
      { "title": "Ageband-5 Year", "key": "31", isLeaf: true },
      { "title": "Ageband-10 Year", "key": "32", isLeaf: true },
      { "title": "Age ATSI Status", "key": "33", isLeaf: true },
      { "title": "Month of Birth", "key": "34", isLeaf: true },
      { "title": "Month of Birth No", "key": "35", isLeaf: true },
      { "title": "Leave Start Date", "key": "36", isLeaf: true },
      { "title": "Leave Return Date", "key": "37", isLeaf: true },
      { "title": "Sub Category", "key": "38", isLeaf: true },
      { "title": "Panztel Pin", "key": "39", isLeaf: true },
      { "title": "Daelibs Logger ID", "key": "40", isLeaf: true },
      { "title": "Contact Issues", "key": "41", isLeaf: true },
      { "title": "CALD Status", "key": "42", isLeaf: true },
      { "title": "Indiginous Status", "key": "43", isLeaf: true },
      { "title": "Visa Status", "key": "43", isLeaf: true },
    ]
  },
  {
    title: 'Staff Attributes',
    key: '1000',
    expanded: false,
    children:[
          { "title": "Competency", "key": "00", isLeaf: true },
          { "title": "Competency Expiry Date", "key": "01", isLeaf: true },
          { "title": "Competency Reminder Date", "key": "02", isLeaf: true },
          { "title": "Competency Completion Date", "key": "03", isLeaf: true },
          { "title": "Mandatory Status", "key": "04", isLeaf: true },
          { "title": "Certificate Number", "key": "05", isLeaf: true },
          { "title": "Competency Notes", "key": "06", isLeaf: true },
          { "title": "Staff Position", "key": "07", isLeaf: true },
          { "title": "Staff Admin Categories", "key": "08", isLeaf: true },
          { "title": "NDIA Staff Level", "key": "09", isLeaf: true },
        ]
  },
  {
    title: 'Staff HR Notes',
    key: '1100',
    expanded: false,
    children:[
          { "title": "HR Notes Date", "key": "00", isLeaf: true },
          { "title": "HR Notes Detail", "key": "01", isLeaf: true },
          { "title": "HR Notes Creator", "key": "02", isLeaf: true },
          { "title": "HR Notes Alarm", "key": "03", isLeaf: true },
          { "title": "HR Notes Categories", "key": "04", isLeaf: true },
        ]
  },
  {
    title:'Staff OP Notes',
    key: '1200',
    expanded: false,
    children:[
          { "title": "General Notes","key": "00", isLeaf: true },
          { "title": "OP Notes Date","key": "01", isLeaf: true },
          { "title": "OP Notes Detail","key": "02", isLeaf: true },
          { "title": "OP Notes Creator","key": "03", isLeaf: true },
          { "title": "OP Notes Alarm","key": "04", isLeaf: true },
          { "title": "OP Notes Category","key": "05", isLeaf: true },
    ]
  },
  {
    title:'Staff Incidents',
    key: '1300',
    expanded: false,
    children:[
      { "title": "INCD_Status", "key": "00", isLeaf: true },
      { "title": "INCD_Date", "key": "01", isLeaf: true },
      { "title": "INCD_TYpe", "key": "02", isLeaf: true },
      { "title": "INCD_Description", "key": "03", isLeaf: true },
      { "title": "INCD_SubCategory", "key": "04", isLeaf: true },
      { "title": "INCD_Assigned_To", "key": "05", isLeaf: true },
      { "title": "INCD_Service", "key": "06", isLeaf: true },
      { "title": "INCD_Severity", "key": "07", isLeaf: true },
      { "title": "INCD_Time", "key": "08", isLeaf: true },
      { "title": "INCD_Duration", "key": "09", isLeaf: true },
      { "title": "INCD_Location", "key": "10", isLeaf: true },
      { "title": "INCD_LocationNotes", "key": "11", isLeaf: true },
      { "title": "INCD_ReportedBy", "key": "12", isLeaf: true },
      { "title": "INCD_DateReported", "key": "13", isLeaf: true },
      { "title": "INCD_Reported", "key": "14", isLeaf: true },
      { "title": "INCD_FullDesc", "key": "15", isLeaf: true },
      { "title": "INCD_Program", "key": "16", isLeaf: true },
      { "title": "INCD_DSCServiceType", "key": "17", isLeaf: true },
      { "title": "INCD_TriggerShort", "key": "18", isLeaf: true },
      { "title": "INCD_level", "key": "19", isLeaf: true },
      { "title": "INCD_Area", "key": "20", isLeaf: true },
      { "title": "INCD_Region", "key": "21", isLeaf: true },
      { "title": "INCD_Position", "key": "22", isLeaf: true },
      { "title": "INCD_Phone", "key": "23", isLeaf: true },
      { "title": "INCD_Verbal_Date", "key": "24", isLeaf: true },
      { "title": "INCD_Verbal_Time", "key": "25", isLeaf: true },
      { "title": "INCD_By_Whome", "key": "26", isLeaf: true },
      { "title": "INCD_To_Whome", "key": "27", isLeaf: true },
      { "title": "INCD_BriefSummary", "key": "28", isLeaf: true },
      { "title": "INCD_ReleventBackground", "key": "29", isLeaf: true },
      { "title": "INCD_SummaryOfAction", "key": "30", isLeaf: true },
      { "title": "INCD_SummaryOfOtherAction", "key": "31", isLeaf: true },
      { "title": "INCD_Triggers", "key": "32", isLeaf: true },
      { "title": "INCD_InitialAtion", "key": "33", isLeaf: true },
      { "title": "INCD_InitialNotes", "key": "34", isLeaf: true },
      { "title": "INCD_InitialFupBy", "key": "35", isLeaf: true },
      { "title": "INCD_Completed", "key": "36", isLeaf: true },
      { "title": "INCD_OngoingAction", "key": "37", isLeaf: true },
      { "title": "INCD_OngoingNotes", "key": "38", isLeaf: true },
      { "title": "INCD_Background", "key": "39", isLeaf: true },
      { "title": "INCD_Abuse", "key": "40", isLeaf: true },
      { "title": "INCD_DOPwithDisability", "key": "41", isLeaf: true },
      { "title": "INCD_SerousRisks", "key": "42", isLeaf: true },
      { "title": "INCD_Complaints", "key": "43", isLeaf: true },
      { "title": "INCD_Perpetrator", "key": "44", isLeaf: true },
      { "title": "INCD_Notify", "key": "45", isLeaf: true },
      { "title": "INCD_NoNotifyReason", "key": "46", isLeaf: true },
      { "title": "INCD_Notes", "key": "47", isLeaf: true },
      { "title": "INCD_Setting", "key": "48", isLeaf: true }, 
    ]
  },
  {
    title:'Work Hours',
    key: '1400',
    expanded: false,
    children:[
          { "title": "Min_Daily_HRS", "key": "00", isLeaf: true },
          { "title": "Max_Daily_HRS", "key": "01", isLeaf: true },
          { "title": "Min_Weekly_HRS", "key": "02", isLeaf: true },
          { "title": "Max_Weekly_HRS", "key": "03", isLeaf: true },
          { "title": "Min_Pay_Period_HRS", "key": "04", isLeaf: true },
          { "title": "Max_Pay_Period_HRS", "key": "05", isLeaf: true },
          { "title": "Week_1_Day_1", "key": "06", isLeaf: true },
          { "title": "Week_1_Day_2", "key": "07", isLeaf: true },
          { "title": "Week_1_Day_3", "key": "08", isLeaf: true },
          { "title": "Week_1_Day_4", "key": "09", isLeaf: true },
          { "title": "Week_1_Day_5", "key": "10", isLeaf: true },
          { "title": "Week_1_Day_6", "key": "11", isLeaf: true },
          { "title": "Week_1_Day_7", "key": "12", isLeaf: true },
          { "title": "Week_2_Day_1", "key": "13", isLeaf: true },
          { "title": "Week_2_Day_2", "key": "14", isLeaf: true },
          { "title": "Week_2_Day_3", "key": "15", isLeaf: true },
          { "title": "Week_2_Day_4", "key": "16", isLeaf: true },
          { "title": "Week_2_Day_5", "key": "17", isLeaf: true },
          { "title": "Week_2_Day_6", "key": "18", isLeaf: true },
          { "title": "Week_2_Day_7", "key": "19", isLeaf: true },
        ]
  },
  {
    title:'Staff Position',
    key: '1400',
    expanded: false,
    children:[
      { "title": "Staff Position", "key": "00", isLeaf: true },
      { "title": "Position Start Date", "key": "01", isLeaf: true },
      { "title": "Position End Date", "key": "02", isLeaf: true },
      { "title": "Position ID", "key": "03", isLeaf: true },
      { "title": "Position Notes", "key": "04", isLeaf: true },
        ]
  },
  {
    title:'Service information fields',
    key: '1400',
    expanded: false,
    children:[
      { "title": "Staff Code", "key": "00", isLeaf: true },
          { "title": "Service Date", "key": "01", isLeaf: true },
          { "title": "Service Start Time", "key": "02", isLeaf: true },
          { "title": "Service Code", "key": "03", isLeaf: true },
          { "title": "Service Hours", "key": "04", isLeaf: true },
          { "title": "Service Pay Rate", "key": "05", isLeaf: true },
          { "title": "Service Bill Rate", "key": "06", isLeaf: true },
          { "title": "Service Bill Qty", "key": "07", isLeaf: true },
          { "title": "Service Location/Activity Group", "key": "08", isLeaf: true },
          { "title": "Service Progrm", "key": "09", isLeaf: true },
          { "title": "Service Group", "key": "10", isLeaf: true },
          { "title": "Service HACC Type ", "key": "11", isLeaf: true },
          { "title": "Service Category", "key": "12", isLeaf: true },
          { "title": "Service Status", "key": "13", isLeaf: true },
          { "title": "Service Pay Type", "key": "14", isLeaf: true },
          { "title": "Service Pay Qty", "key": "15", isLeaf: true },
          { "title": "Service Bill Unit", "key": "16", isLeaf: true },
          { "title": "Service End Time/Shift End Time", "key": "17", isLeaf: true },
          { "title": "Service Funding Source", "key": "18", isLeaf: true },
          { "title": "Service Notes", "key": "19", isLeaf: true },
        ]
  }
]

export const nodes = [
  {
    title: 'Name And Address',
    key: '100',
    expanded: false,
    children: [
      {
        title: 'Full Name-Surname First',
        key: '1001',
        isLeaf: true
      },
      {
        title: 'Full Name Mailing',
        key: '1002',
        isLeaf: true
      },
      {
        title: 'Title',
        key: '1003',
        isLeaf: true
      },
      {
        title: 'First Name',
        key: '1004',
        isLeaf: true
      },
      {
        title: 'Middle Names',
        key: '1005',
        isLeaf: true
      },
      {
        title: 'Surname/Organisation',
        key: '1006',
        isLeaf: true
      },
      {
        title: 'Preferred Name',
        key: '1007',
        isLeaf: true
      },
      {
        title: 'Other',
        key: '1008',
        isLeaf: true
      },
      {
        title: '(a) MAIL COLLECTION POINT Address-Line1',
        key: '1009',
        isLeaf: true
      },
      {
        title: '(a) MAIL COLLECTION POINT Address-Line2',
        key: '1010',
        isLeaf: true
      },
      {
        title: '(a) MAIL COLLECTION POINT Address-Suburb',
        key: '1011',
        isLeaf: true
      },
      {
        title: '(a) MAIL COLLECTION POINT Address-Postcode',
        key: '1012',
        isLeaf: true
      },
      {
        title: '(a) MAIL COLLECTION POINT Address-State',
        key: '1013',
        isLeaf: true
      },
      {
        title: '(a) POSTAL Address-Line1',
        key: '1014',
        isLeaf: true
      },
      {
        title: '(a) POSTAL Address-Line2',
        key: '1015',
        isLeaf: true
      },
      {
        title: '(a) POSTAL Address-Suburb',
        key: '1016',
        isLeaf: true
      },
      {
        title: '(a) POSTAL Address-Postcode',
        key: '1017',
        isLeaf: true
      },
      {
        title: '(a) POSTAL Address-State',
        key: '1018',
        isLeaf: true
      },
      {
        title: '(a) RESIDENTIAL Address-Line1',
        key: '1019',
        isLeaf: true
      },
      {
        title: '(a) RESIDENTIAL Address-Line2',
        key: '1020',
        isLeaf: true
      },
      {
        title: '(a) RESIDENTIAL Address-Suburb',
        key: '1021',
        isLeaf: true
      },
      {
        title: '(a) RESIDENTIAL Address-Postcode',
        key: '1022',
        isLeaf: true
      },
      {
        title: '(a) RESIDENTIAL Address-State',
        key: '1023',
        isLeaf: true
      },
      {
        title: '(a) DESTINATION Address-Line1',
        key: '1024',
        isLeaf: true
      },
      {
        title: '(a) DESTINATION Address-Line2',
        key: '1025',
        isLeaf: true
      },
      {
        title: '(a) DESTINATION Address-Suburb',
        key: '1026',
        isLeaf: true
      },
      {
        title: '(a) DESTINATION Address-Postcode',
        key: '1027',
        isLeaf: true
      },
      {
        title: '(a) DESTINATION Address-State',
        key: '1028',
        isLeaf: true
      },
      {
        title: '(a) "CONTACT" Address-Line1',
        key: '1029',
        isLeaf: true
      },
      {
        title: '(a) "CONTACT" Address-Line2',
        key: '1030',
        isLeaf: true
      },
      {
        title: '(a) "CONTACT" Address-Suburb',
        key: '1031',
        isLeaf: true
      },
      {
        title: '(a) CONTACT Address-Postcode',
        key: '1032',
        isLeaf: true
      },
      {
        title: '(a) CONTACT Address-State',
        key: '1033',
        isLeaf: true
      },
      {
        title: '(a) USUAL Address-Line1',
        key: '1034',
        isLeaf: true
      },
      {
        title: '(a) USUAL Address-Line2',
        key: '1035',
        isLeaf: true
      },
      {
        title: '(a) USUAL Address-Suburb',
        key: '1036',
        isLeaf: true
      },
      {
        title: '(a) USUAL Address-Postcode',
        key: '1037',
        isLeaf: true
      },
      {
        title: '(a) USUAL Address-State',
        key: '1038',
        isLeaf: true
      },
      {
        title: '(c) EMAIL-SMS Address-State',
        key: '1039',
        isLeaf: true
      },
      {
        title: '(c) EMAIL Address-State',
        key: '1040',
        isLeaf: true
      },
      {
        title: '(c) MOBILE phone',
        key: '1041',
        isLeaf: true
      },
      {
        title: '(c) FAX',
        key: '1042',
        isLeaf: true
      },
      {
        title: '(c) WORK phone',
        key: '1043',
        isLeaf: true
      },
      {
        title: '(c) HOME phone',
        key: '1044',
        isLeaf: true
      },
    ]
  },
  {
    title: 'General Demographics',
    key: '200',
    expanded: false,
    children: [
      {
        title: 'Gender',
        key: '2001',
        isLeaf: true
      },
      {
        title: 'Date of Birth',
        key: '2002',
        isLeaf: true
      },
      {
        title: 'Age',
        key: '2003',
        isLeaf: true
      },
      {
        title: 'Ageband-Statistical',
        key: '2004',
        isLeaf: true
      },
      {
        title: 'Ageband-5 Year',
        key: '2005',
        isLeaf: true
      },
      {
        title: 'Month Of Birth',
        key: '2006',
        isLeaf: true
      },
      {
        title: 'Month Of Birth No',
        key: '2007',
        isLeaf: true
      },
      {
        title: 'Day Of Birth',
        key: '2008',
        isLeaf: true
      },
      {
        title: 'Day Of Birth No',
        key: '2009',
        isLeaf: true
      },
      {
        title: 'CALD Score',
        key: '2010',
        isLeaf: true
      },
      {
        title: 'Country Of Birth',
        key: '2011',
        isLeaf: true
      },
      {
        title: 'Language',
        key: '2012',
        isLeaf: true
      },
      {
        title: 'Indigenous Status',
        key: '2013',
        isLeaf: true
      },
      {
        title: 'Primary Disability',
        key: '2014',
        isLeaf: true
      },
      {
        title: 'Financially Dependent',
        key: '2015',
        isLeaf: true
      },
      {
        title: 'Financial Status',
        key: '2016',
        isLeaf: true
      },
      {
        title: 'Occupation',
        key: '2017',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Admin Information',
    key: '300',
    expanded: false,
    children: [              
      {
        title: 'UniqueID',
        key: '3001',
        isLeaf: true
      },
      {
        title: 'Code',
        key: '3002',
        isLeaf: true
      },
      {
        title: 'Type',
        key: '3003',
        isLeaf: true
      },
      {
        title: 'Category',
        key: '3004',
        isLeaf: true
      },
      {
        title: 'Coordinator',
        key: '3005',
        isLeaf: true
      },
      {
        title: 'Admitting Branch',
        key: '3006',
        isLeaf: true
      },
      {
        title: 'File Number',
        key: '3007',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Other General',
    key: '400',
    expanded: false,
    children: [              
      {
        title: 'OH&S Profile',
        key: '4001',
        isLeaf: true
      },
      {
        title: 'Old WH&S Date',
        key: '4002',
        isLeaf: true
      },
      {
        title: 'Billing Profile',
        key: '4003',
        isLeaf: true
      },
      {
        title: 'Grid Reference',
        key: '4004',
        isLeaf: true
      },
      {
        title: 'Roster Alerts',
        key: '4005',
        isLeaf: true
      },
      {
        title: 'Timesheet Alerts',
        key: '4005',
        isLeaf: true
      },
      {
        title: 'Contact Issues',
        key: '4006',
        isLeaf: true
      },
      {
        title: 'Survey Consent Given',
        key: '4007',
        isLeaf: true
      },
      {
        title: 'Copy Rosters Enabled',
        key: '4008',
        isLeaf: true
      },
      {
        title: 'Activation Date',
        key: '4009',
        isLeaf: true
      },
      {
        title: 'DeActivation Date',
        key: '4010',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Contacts & Next Of Kin',
    key: '500',
    expanded: false,
    children: [
      {
        title: 'Contact Group',
        key: '5001',
        isLeaf: true
      },
      {
        title: 'Contact Type',
        key: '5002',
        isLeaf: true
      },
      {
        title: 'Contact Name',
        key: '5003',
        isLeaf: true
      },
      {
        title: 'Contact Address',
        key: '5004',
        isLeaf: true
      },
      {
        title: 'Contact Suburb',
        key: '5005',
        isLeaf: true
      },
      {
        title: 'Contact Postcode',
        key: '5006',
        isLeaf: true
      },
      {
        title: 'Contact Phone 1',
        key: '5007',
        isLeaf: true
      },
      {
        title: 'Contact Phone 2',
        key: '5008',
        isLeaf: true
      },
      {
        title: 'Contact Mobile',
        key: '5009',
        isLeaf: true
      },
      {
        title: 'Contact FAX',
        key: '5010',
        isLeaf: true
      },
      {
        title: 'Contact Email',
        key: '5011',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Consents',
    key: '600',
    expanded: false,
    children: [
      {
        title: 'Consent',
        key: '6001',
        isLeaf: true
      },
      {
        title: 'Consent Expiry',
        key: '6002',
        isLeaf: true
      },
      {
        title: 'Consent Notes',
        key: '6003',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Goals Of Care',
    key: '700',
    expanded: false,
    children: [
      {
        title: 'Goal Detail',
        key: '7001',
        isLeaf: true
      },,
      {
        title: 'Goal Achieved',
        key: '7002',
        isLeaf: true
      },
    ]
  },
  {
    title: 'Reminders',
    key: '800',
    expanded: false,
    children: [
      {
        title: 'Reminder Detail',
        key: '8001',
        isLeaf: true
      },
      {
        title: 'Event Date',
        key: '8002',
        isLeaf: true
      },,
      {
        title: 'Reminder Date',
        key: '8003',
        isLeaf: true
      },,
      {
        title: 'Reminder Notes',
        key: '8004',
        isLeaf: true
      },
    ]
  },
  {
    title: 'User Groups',
    key: '900',
    expanded: false,
    children: [
      {
        title: 'Group Name',
        key: '9001',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Preferences',
    key: '1000',
    expanded: false,
    children: [
      {
        title: 'Preference Name',
        key: '10001',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Excluded Staff',
    key: '2000',
    expanded: false,
    children: [
      {
        title: 'Excluded Staff',
        key: '20001',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Agreed Funding Information',
    key: '3000',
    expanded: false,
    children: [
      {
        title: 'Funding Source',
        key: '30001',
        isLeaf: true
      },
      {
        title: 'Funding Program',
        key: '30002',
        isLeaf: true
      },
      {
        title: 'Funding Status',
        key: '30003',
        isLeaf: true
      },
      {
        title: 'Program Coordinator',
        key: '30004',
        isLeaf: true
      },
      {
        title: 'Funding Start Date',
        key: '30005',
        isLeaf: true
      },
      {
        title: 'Funding End Date',
        key: '30006',
        isLeaf: true
      },
      {
        title: 'Auto Renew',
        key: '30007',
        isLeaf: true
      },
      {
        title: 'Rollover Remainder',
        key: '30008',
        isLeaf: true
      },
      {
        title: 'Funded Qty',
        key: '30009',
        isLeaf: true
      },
      {
        title: 'Funded Type',
        key: '300010',
        isLeaf: true
      },
      {
        title: 'Funded Cycle',
        key: '300011',
        isLeaf: true
      },
      {
        title: 'Funded Total Allocation',
        key: '300012',
        isLeaf: true
      },
      {
        title: 'Used',
        key: '300013',
        isLeaf: true
      },
      {
        title: 'Remaining',
        key: '300014',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Agreed Service Information',
    key: '4000',
    expanded: false,
    children: [
      {
        title: 'Agreed Service Code',
        key: '40001',
        isLeaf: true
      },
      {
        title: 'Agreed Program',
        key: '40002',
        isLeaf: true
      },
      {
        title: 'Agreed Service Duration',
        key: '40003',
        isLeaf: true
      },
      {
        title: 'Agreed Service Frequency',
        key: '40004',
        isLeaf: true
      },
      {
        title: 'Agreed Service Cost Type',
        key: '40005',
        isLeaf: true
      },
      {
        title: 'Agreed Service Unit Cost',
        key: '40006',
        isLeaf: true
      }
    ]
  },
  {
    title: 'Clinical Information',
    key: '5000',
    expanded: false,
    children: [
      {
        title: 'Nursing Diagnosis',
        key: '50001',
        isLeaf: true,
      },
      {
        title: 'Medical Diagnosis',
        key: '50002',
        isLeaf: true,
      },
      {
        title: 'Medical Procedure',
        key: '50003',
        isLeaf: true,
      },
    ]
  },
  {
    title: 'Billing Information',
    key: '6000',
    expanded: false,
    children: [
      {
        title: 'Billing Client',
        key: '60001',
        isLeaf: true,
      },
      {
        title: 'Billing Cycle',
        key: '60002',
        isLeaf: true,
      },
      {
        title: 'Billing Rate',
        key: '60003',
        isLeaf: true,
      },
      {
        title: 'Billing Amount',
        key: '60004',
        isLeaf: true,
      },
      {
        title: 'Account Identifier',
        key: '60005',
        isLeaf: true,
      },
      {
        title: 'External Order Number',
        key: '60006',
        isLeaf: true,
      },
    ]
  },
  {
    title: 'Time Logging',
    key: '7000',
    expanded: false,
    children: [
      { "title": "PANZTEL PBX Site", "key": "70001", isLeaf: true },
      { "title": "PANZTEL Parent Site", "key": "70002", isLeaf: true },
      { "title": "DAELIBS Logger ID", "key": "70003", isLeaf: true },
    ]
  },
  {
    title: 'Insurance & Pension',
    key: '8000',
    expanded: false,
    children: [
      { "title": "Medicare Number", "key": "00", isLeaf: true },
      { "title": "Medicare Recipient ID", "key": "01", isLeaf: true },
      { "title": "Pension Status", "key": "02", isLeaf: true },
      { "title": "Unable to Determine Pension Status", "key": "03", isLeaf: true },
      { "title": "Concession Number", "key": "04", isLeaf: true },
      { "title": "DVA Benefits Flag", "key": "05", isLeaf: true },
      { "title": "DVA Number", "key": "06", isLeaf: true },
      { "title": "DVA Card Holder Status", "key": "07", isLeaf: true },
      { "title": "Ambulance Subscriber", "key": "08", isLeaf: true },
      { "title": "Ambulance Type", "key": "09", isLeaf: true },
      { "title": "Pension Name", "key": "10", isLeaf: true },
      { "title": "Pension Number", "key": "11", isLeaf: true },
      { "title": "Will Available", "key": "12", isLeaf: true },
      { "title": "Will Location", "key": "13", isLeaf: true },
      { "title": "Funeral Arrangements", "key": "14", isLeaf: true },
      { "title": "Date Of Death", "key": "15", isLeaf: true },
    ]
  },
  {
    title: 'HACC Dataset Fields',
    key: '9000',
    expanded: false,
    children: [
      { "title": "HACC-SLK", "key": "00", isLeaf: true },
      { "title": "HACC-First Name", "key": "01", isLeaf: true },
      { "title": "HACC-Surname", "key": "02", isLeaf: true },
      { "title": "HACC-Referral Source", "key": "03", isLeaf: true },
      { "title": "HACC-Date Of Birth", "key": "04", isLeaf: true },
      { "title": "HACC-Date Of Birth Estimated", "key": "05", isLeaf: true },
      { "title": "HACC-Gender", "key": "06", isLeaf: true },
      { "title": "HACC-Area Of Residence", "key": "07", isLeaf: true },
      { "title": "HACC-Country Of Birth", "key": "08", isLeaf: true },
      { "title": "HACC-Preferred Language", "key": "09", isLeaf: true },
      { "title": "HACC-Indigenous Status", "key": "10", isLeaf: true },
      { "title": "HACC-Living Arrangements", "key": "11", isLeaf: true },
      { "title": "HACC-Dwelling/Accomodation", "key": "12", isLeaf: true },
      { "title": "HACC-Main Reasons For Cessation", "key": "13", isLeaf: true },
      { "title": "HACC-Pension Status", "key": "14", isLeaf: true },
      { "title": "HACC-Primary Carer", "key": "15", isLeaf: true },
      { "title": "HACC-Carer Availability", "key": "16", isLeaf: true },
      { "title": "HACC-Carer Residency", "key": "17", isLeaf: true },
      { "title": "HACC-Carer Relationship", "key": "18", isLeaf: true },
      { "title": "HACC-Exclude From Collection", "key": "19", isLeaf: true },
      { "title": "HACC-Housework", "key": "20", isLeaf: true },
      { "title": "HACC-Transport", "key": "21", isLeaf: true },
      { "title": "HACC-Shopping", "key": "22", isLeaf: true },
      { "title": "HACC-Medication", "key": "23", isLeaf: true },
      { "title": "HACC-Money", "key": "24", isLeaf: true },
      { "title": "HACC-Walking", "key": "25", isLeaf: true },
      { "title": "HACC-Bathing", "key": "26", isLeaf: true },
      { "title": "HACC-Memory", "key": "27", isLeaf: true },
      { "title": "HACC-Behaviour", "key": "28", isLeaf: true },
      { "title": "HACC-Communication", "key": "29", isLeaf: true },          
      { "title": "HACC-Eating", "key": "30", isLeaf: true },
      { "title": "HACC-Toileting", "key": "31", isLeaf: true },
      { "title": "HACC-GetUp", "key": "32", isLeaf: true },
      { "title": "HACC-Carer More Than One", "key": "33", isLeaf: true },
    ]
  },
  {
    title: 'CSTDA Dataset Fields',
    key: '10000',
    expanded: false,
    children: [
      { "title": "CSTDA-Date Of Birth", "key": "00", isLeaf: true },
      { "title": "CSTDA-Gender", "key": "01", isLeaf: true },
      { "title": "CSTDA-DISQIS ID", "key": "02", isLeaf: true },
      { "title": "CSTDA-Indigenous Status", "key": "03", isLeaf: true },
      { "title": "CSTDA-Country Of Birth", "key": "04", isLeaf: true },
      { "title": "CSTDA-Interpreter Required", "key": "05", isLeaf: true },
      { "title": "CSTDA-Communication Method", "key": "06", isLeaf: true },
      { "title": "CSTDA-Living Arrangements", "key": "07", isLeaf: true },
      { "title": "CSTDA-Suburb", "key": "08", isLeaf: true },
      { "title": "CSTDA-Postcode", "key": "09", isLeaf: true },
      { "title": "CSTDA-State", "key": "10", isLeaf: true },
      { "title": "CSTDA-Residential Setting", "key": "11", isLeaf: true },
      { "title": "CSTDA-Primary Disability Group", "key": "12", isLeaf: true },
      { "title": "CSTDA-Primary Disability Description", "key": "13", isLeaf: true },
      { "title": "CSTDA-Intellectual Disability", "key": "14", isLeaf: true },
      { "title": "CSTDA-Specific Learning ADD Disability", "key": "15", isLeaf: true },
      { "title": "CSTDA-Autism Disability", "key": "16", isLeaf: true },
      { "title": "CSTDA-Physical Disability", "key": "17", isLeaf: true },
      { "title": "CSTDA-Acquired Brain Injury Disability", "key": "18", isLeaf: true },
      { "title": "CSTDA-Neurological Disability", "key": "19", isLeaf: true },
      { "title": "CSTDA-Psychiatric Disability", "key": "20", isLeaf: true },
      { "title": "CSTDA-Other Psychiatric Disability", "key": "21", isLeaf: true },
      { "title": "CSTDA-Vision Disability", "key": "22", isLeaf: true },
      { "title": "CSTDA-Hearing Disability", "key": "23", isLeaf: true },
      { "title": "CSTDA-Speech Disability", "key": "24", isLeaf: true },
      { "title": "CSTDA-Developmental Delay Disability", "key": "25", isLeaf: true },
      { "title": "CSTDA-Disability Likely To Be Permanent", "key": "26", isLeaf: true },
      { "title": "CSTDA-Support Needs-Self Care", "key": "27", isLeaf: true },
      { "title": "CSTDA-Support Needs-Mobility", "key": "28", isLeaf: true },
      { "title": "CSTDA-Support Needs-Communication", "key": "29", isLeaf: true },
      { "title": "CSTDA-Support Needs-Interpersonal", "key": "30", isLeaf: true },
      { "title": "CSTDA-Support Needs-Learning", "key": "31", isLeaf: true },
      { "title": "CSTDA-Support Needs-Education", "key": "32", isLeaf: true },
      { "title": "CSTDA-Support Needs-Community", "key": "33", isLeaf: true },
      { "title": "CSTDA-Support Needs-Domestic", "key": "34", isLeaf: true },
      { "title": "CSTDA-Support Needs-Working", "key": "35", isLeaf: true },
      { "title": "CSTDA-Carer-Existence Of Informal", "key": "36", isLeaf: true },
      { "title": "CSTDA-Carer-Assists client in ADL", "key": "37", isLeaf: true },
      { "title": "CSTDA-Carer-Lives In Same Household", "key": "38", isLeaf: true },
      { "title": "CSTDA-Carer-Relationship", "key": "39", isLeaf: true },
      { "title": "CSTDA-Carer-Age Group", "key": "40", isLeaf: true },
      { "title": "CSTDA-Carer Allowance to Guardians", "key": "41", isLeaf: true },
      { "title": "CSTDA-Labour Force Status", "key": "42", isLeaf: true },
      { "title": "CSTDA-Main Source Of Income", "key": "43", isLeaf: true },
      { "title": "CSTDA-Current Individual Funding", "key": "44", isLeaf: true },
    ]
  },
  {
    title: 'NRCP Dataset Fields',
    key: '26',
    expanded: false,
    children: [
      { "title": "NRCP-First Name", "key": "00", isLeaf: true },
      { "title": "NRCP-Surname", "key": "01", isLeaf: true },
      { "title": "NRCP-Date Of Birth", "key": "02", isLeaf: true },
      { "title": "NRCP-Gender", "key": "03", isLeaf: true },
      { "title": "NRCP-Suburb", "key": "04", isLeaf: true },
      { "title": "NRCP-Country Of Birth", "key": "05", isLeaf: true },
      { "title": "NRCP-Preferred Language", "key": "06", isLeaf: true },
      { "title": "NRCP-Indigenous Status", "key": "07", isLeaf: true },
      { "title": "NRCP-Marital Status", "key": "08", isLeaf: true },
      { "title": "NRCP-DVA Card Holder Status", "key": "09", isLeaf: true },
      { "title": "NRCP-Paid Employment Participation", "key": "10", isLeaf: true },
      { "title": "NRCP-Pension Status", "key": "11", isLeaf: true },
      { "title": "NRCP-Carer-Date Role Commenced", "key": "12", isLeaf: true },
      { "title": "NRCP-Carer-Role", "key": "13", isLeaf: true },
      { "title": "NRCP-Carer-Need", "key": "14", isLeaf: true },
      { "title": "NRCP-Carer-Number of Recipients", "key": "15", isLeaf: true },
      { "title": "NRCP-Carer-Time Spent Caring", "key": "16", isLeaf: true },
      { "title": "NRCP-Carer-Current Use Formal Services", "key": "17", isLeaf: true },
      { "title": "NRCP-Carer-Informal Support", "key": "18", isLeaf: true },
      { "title": "NRCP-Recipient-Challenging Behaviour", "key": "19", isLeaf: true },
      { "title": "NRCP-Recipient-Primary Disability", "key": "20", isLeaf: true },
      { "title": "NRCP-Recipient-Primary Care Needs", "key": "21", isLeaf: true },
      { "title": "NRCP-Recipient-Level of Need", "key": "22", isLeaf: true },
      { "title": "NRCP-Recipient-Primary Carer", "key": "23", isLeaf: true },
      { "title": "NRCP-Recipient-Carer Relationship", "key": "24", isLeaf: true },
      { "title": "NRCP-Recipient-Carer Co-Resident", "key": "25", isLeaf: true },
      { "title": "NRCP-Recipient-Dementia", "key": "26", isLeaf: true },
      { "title": "NRCP-CALD Background", "key": "27", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Core',
    key: '83',
    expanded: false,
    children: [
      { "title": "ONI-Family Name", "key": "00", isLeaf: true },
      { "title": "ONI-Title", "key": "01", isLeaf: true },
      { "title": "ONI-First Name", "key": "02", isLeaf: true },
      { "title": "ONI-Other", "key": "03", isLeaf: true },
      { "title": "ONI-Sex", "key": "04", isLeaf: true },
      { "title": "ONI-DOB", "key": "05", isLeaf: true },
      { "title": "ONI-Usual Address-Street", "key": "06", isLeaf: true },
      { "title": "ONI-Usual Address-Suburb", "key": "07", isLeaf: true },
      { "title": "ONI-Usual Address-Postcode", "key": "08", isLeaf: true },
      { "title": "ONI-Contact Address-Street", "key": "09", isLeaf: true },
      { "title": "ONI-Contact Address-Suburb", "key": "10", isLeaf: true },
      { "title": "ONI-Contact Address-Postcode", "key": "11", isLeaf: true },         
      { "title": "ONI-Phone-Home", "key": "12", isLeaf: true },
      { "title": "ONI-Phone-Work", "key": "13", isLeaf: true },
      { "title": "ONI-Phone-Mobile", "key": "14", isLeaf: true },
      { "title": "ONI-Phone-FAX", "key": "15", isLeaf: true },
      { "title": "ONI-EMAIL", "key": "16", isLeaf: true },
      { "title": "ONI-Person 1 Name", "key": "17", isLeaf: true },
      { "title": "ONI-Person 1 Street", "key": "18", isLeaf: true },
      { "title": "ONI-Person 1 Suburb", "key": "19", isLeaf: true },
      { "title": "ONI-Person 1 Postcode", "key": "20", isLeaf: true },
      { "title": "ONI-Person 1 Phone", "key": "21", isLeaf: true },
      { "title": "ONI-Person 1 Relationship", "key": "22", isLeaf: true },
      { "title": "ONI-Person 2 Name", "key": "23", isLeaf: true },
      { "title": "ONI-Person 2 Street", "key": "24", isLeaf: true },
      { "title": "ONI-Person 2 Suburb", "key": "25", isLeaf: true },
      { "title": "ONI-Person 2 Postcode", "key": "26", isLeaf: true },
      { "title": "ONI-Person 2 Phone", "key": "27", isLeaf: true },
      { "title": "ONI-Person 2 Relationship", "key": "28", isLeaf: true },
      { "title": "ONI-Doctor Name", "key": "29", isLeaf: true },
      { "title": "ONI-Doctor Street", "key": "30", isLeaf: true },
      { "title": "ONI-Doctor Suburb", "key": "31", isLeaf: true },
      { "title": "ONI-Doctor Postcode", "key": "32", isLeaf: true },
      { "title": "ONI-Doctor Phone", "key": "33", isLeaf: true },
      { "title": "ONI-Doctor FAX", "key": "34", isLeaf: true },
      { "title": "ONI-Doctor EMAIL", "key": "35", isLeaf: true },
      { "title": "ONI-Referral Source", "key": "36", isLeaf: true },
      { "title": "ONI-Contact Details", "key": "37", isLeaf: true },
      { "title": "ONI-Country Of Birth", "key": "38", isLeaf: true },
      { "title": "ONI-Indigenous Status", "key": "39", isLeaf: true },
      { "title": "ONI-Main Language At Home", "key": "40", isLeaf: true },
      { "title": "ONI-Interpreter Required", "key": "41", isLeaf: true },
      { "title": "ONI-Preferred Language", "key": "42", isLeaf: true },
      { "title": "ONI-Govt Pension Status", "key": "43", isLeaf: true },
      { "title": "ONI-Pension Benefit Card", "key": "44", isLeaf: true },
      { "title": "ONI-Medicare Number", "key": "45", isLeaf: true },
      { "title": "ONI-Health Care Card#", "key": "46", isLeaf: true },
      { "title": "ONI-DVA Cardholder Status", "key": "47", isLeaf: true },
      { "title": "ONI-DVA Number", "key": "48", isLeaf: true },
      { "title": "ONI-Insurance Status", "key": "49", isLeaf: true },
      { "title": "ONI-Health Insurer", "key": "50", isLeaf: true },                 
      { "title": "ONI-Health Insurance Card#", "key": "51", isLeaf: true },
      { "title": "ONI-Alerts", "key": "52", isLeaf: true },
      { "title": "ONI-Rating", "key": "53", isLeaf: true },
      { "title": "ONI-HACC Eligible", "key": "54", isLeaf: true },
      { "title": "ONI-Reason For HACC Status", "key": "55", isLeaf: true },
      { "title": "ONI-Other Support Eligibility", "key": "56", isLeaf: true },
      { "title": "ONI-Other Support Detail", "key": "57", isLeaf: true },
      { "title": "ONI-Functional Profile Complete", "key": "58", isLeaf: true },
      { "title": "ONI-Functional Profile Score 1", "key": "59", isLeaf: true },
      { "title": "ONI-Functional Profile Score 2", "key": "60", isLeaf: true },
      { "title": "ONI-Functional Profile Score 3", "key": "51", isLeaf: true },
      { "title": "ONI-Functional Profile Score 4", "key": "62", isLeaf: true },
      { "title": "ONI-Functional Profile Score 5", "key": "63", isLeaf: true },
      { "title": "ONI-Functional Profile Score 6", "key": "64", isLeaf: true },
      { "title": "ONI-Functional Profile Score 7", "key": "65", isLeaf: true },
      { "title": "ONI-Functional Profile Score 8", "key": "66", isLeaf: true },
      { "title": "ONI-Functional Profile Score 9", "key": "67", isLeaf: true },
      { "title": "ONI-Main Problem-Description", "key": "68", isLeaf: true },
      { "title": "ONI-Main Problem-Action", "key": "69", isLeaf: true },
      { "title": "ONI-Other Problem-Description", "key": "70", isLeaf: true },
      { "title": "ONI-Other Problem-Action", "key": "71", isLeaf: true },
      { "title": "ONI-Current Service", "key": "72", isLeaf: true },
      { "title": "ONI-Service Contact Details", "key": "73", isLeaf: true },
      { "title": "ONI-AP-Agency", "key": "74", isLeaf: true },
      { "title": "ONI-AP-For", "key": "75", isLeaf: true },
      { "title": "ONI-AP-Consent", "key": "76", isLeaf: true },
      { "title": "ONI-AP-Referral", "key": "77", isLeaf: true },
      { "title": "ONI-AP-Transport", "key": "78", isLeaf: true },
      { "title": "ONI-AP-Feedback", "key": "79", isLeaf: true },
      { "title": "ONI-AP-Date", "key": "80", isLeaf: true },
      { "title": "ONI-AP-Review", "key": "81", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Functional Profile',
    key: '83',
    expanded: false,
    children: [
      { "title": "ONI-FPQ1-Housework", "key": "00", isLeaf: true },
      { "title": "ONI-FPQ2-GetToPlaces", "key": "01", isLeaf: true },
      { "title": "ONI-FPQ3-Shopping", "key": "02", isLeaf: true },
      { "title": "ONI-FPQ4-Medicine", "key": "03", isLeaf: true },
      { "title": "ONI-FPQ5-Money", "key": "04", isLeaf: true },
      { "title": "ONI-FPQ6-Walk", "key": "05", isLeaf: true },
      { "title": "ONI-FPQ7-Bath", "key": "06", isLeaf: true },
      { "title": "ONI-FPQ8-Memory", "key": "07", isLeaf: true },
      { "title": "ONI-FPQ9-Behaviour", "key": "08", isLeaf: true },
      { "title": "ONI-FP-Recommend Domestic", "key": "09", isLeaf: true },
      { "title": "ONI-FP-Recommend Self Care", "key": "10", isLeaf: true },
      { "title": "ONI-FP-Recommend Cognition", "key": "11", isLeaf: true },
      { "title": "ONI-FP-Recommend Behaviour", "key": "12", isLeaf: true },
      { "title": "ONI-FP-Has Self Care Aids", "key": "13", isLeaf: true },
      { "title": "ONI-FP-Has Support/Mobility Aids", "key": "14", isLeaf: true },
      { "title": "ONI-FP-Has Communication Aids", "key": "15", isLeaf: true },
      { "title": "ONI-FP-Has Car Mods", "key": "16", isLeaf: true },
      { "title": "ONI-FP-Has Other Aids", "key": "17", isLeaf: true },
      { "title": "ONI-FP-Other Goods List", "key": "18", isLeaf: true },
      { "title": "ONI-FP-Comments", "key": "19", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Living Arrangements Profile',
    key: '84',
    expanded: false,
    children: [
      { "title": "ONI-LA-Living Arrangements", "key": "00", isLeaf: true },
      { "title": "ONI-LA-Living Arrangements Comments", "key": "01", isLeaf: true },
      { "title": "ONI-LA-Accomodation", "key": "02", isLeaf: true },
      { "title": "ONI-LA-Accomodation Comments", "key": "03", isLeaf: true },
      { "title": "ONI-LA-Employment Status", "key": "04", isLeaf: true },
      { "title": "ONI-LA-Employment Status Comments", "key": "05", isLeaf: true },
      { "title": "ONI-LA-Mental Health Act Status", "key": "06", isLeaf: true },
      { "title": "ONI-LA-Decision Making Responsibility", "key": "07", isLeaf: true },
      { "title": "ONI-LA-Capable Own Decisions", "key": "08", isLeaf: true },
      { "title": "ONI-LA-Financial Decisions", "key": "09", isLeaf: true },
      { "title": "ONI-LA-Cost Of Living Trade Off", "key": "10", isLeaf: true },
      { "title": "ONI-LA-Financial & Legal Comments", "key": "11", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Health Conditions Profile',
    key: '85',
    expanded: false,
    children: [
      { "title": "ONI-HC-Overall Health Description", "key": "00", isLeaf: true },
      { "title": "ONI-HC-Overall Health Pain", "key": "01", isLeaf: true },
      { "title": "ONI-HC-Overall Health Interference", "key": "02", isLeaf: true },
      { "title": "ONI-HC-Vision Reading", "key": "03", isLeaf: true },
      { "title": "ONI-HC-Vision Distance", "key": "04", isLeaf: true },
      { "title": "ONI-HC-Hearing", "key": "05", isLeaf: true },
      { "title": "ONI-HC-Oral Problems", "key": "06", isLeaf: true },
      { "title": "ONI-HC-Oral Comments", "key": "07", isLeaf: true },
      { "title": "ONI-HC-Speech/Swallow Problems", "key": "08", isLeaf: true },
      { "title": "ONI-HC-Speech/Swallow Comments", "key": "09", isLeaf: true },
      { "title": "ONI-HC-Falls Problems", "key": "10", isLeaf: true },
      { "title": "ONI-HC-Falls Comments", "key": "11", isLeaf: true },
      { "title": "ONI-HC-Feet Problems", "key": "12", isLeaf: true },
      { "title": "ONI-HC-Feet Comments", "key": "13", isLeaf: true },
      { "title": "ONI-HC-Vacc. Influenza", "key": "14", isLeaf: true },
      { "title": "ONI-HC-Vacc. Influenza Date", "key": "15", isLeaf: true },
      { "title": "ONI-HC-Vacc. Pneumococcus", "key": "16", isLeaf: true },
      { "title": "ONI-HC-Vacc. Pneumococcus  Date", "key": "17", isLeaf: true },
      { "title": "ONI-HC-Vacc. Tetanus", "key": "18", isLeaf: true },
      { "title": "ONI-HC-Vacc. Tetanus Date", "key": "19", isLeaf: true },
      { "title": "ONI-HC-Vacc. Other", "key": "20", isLeaf: true },
      { "title": "ONI-HC-Vacc. Other Date", "key": "21", isLeaf: true },
      { "title": "ONI-HC-Driving MV", "key": "22", isLeaf: true },
      { "title": "ONI-HC-Driving Fit", "key": "23", isLeaf: true },
      { "title": "ONI-HC-Driving Comments", "key": "24", isLeaf: true },
      { "title": "ONI-HC-Continence Urinary", "key": "25", isLeaf: true },
      { "title": "ONI-HC-Urinary Related To Coughing", "key": "26", isLeaf: true },
      { "title": "ONI-HC-Urinary Related To Coughing", "key": "27", isLeaf: true },
      { "title": "ONI-HC-Continence Comments", "key": "28", isLeaf: true },
      { "title": "ONI-HC-Weight", "key": "29", isLeaf: true },
      { "title": "ONI-HC-Height", "key": "30", isLeaf: true },
      { "title": "ONI-HC-BMI", "key": "31", isLeaf: true },
      { "title": "ONI-HC-BP Systolic", "key": "32", isLeaf: true },
      { "title": "ONI-HC-BP Diastolic", "key": "33", isLeaf: true },
      { "title": "ONI-HC-Pulse Rate", "key": "34", isLeaf: true },
      { "title": "ONI-HC-Pulse Regularity", "key": "35", isLeaf: true },
      { "title": "ONI-HC-Check Postural Hypotension", "key": "36", isLeaf: true },
      { "title": "ONI-HC-Conditions", "key": "37", isLeaf: true },
      { "title": "ONI-HC-Diagnosis", "key": "38", isLeaf: true },
      { "title": "ONI-HC-Medicines", "key": "39", isLeaf: true },
      { "title": "ONI-HC-Take Own Medication", "key": "40", isLeaf: true },
      { "title": "ONI-HC-Willing When Presribed", "key": "41", isLeaf: true },
      { "title": "ONI-HC-Co-op With Health Services", "key": "42", isLeaf: true },
      { "title": "ONI-HC-Webster Pack", "key": "43", isLeaf: true },
      { "title": "ONI-HC-Medication Review", "key": "44", isLeaf: true },
      { "title": "ONI-HC-Medical Comments", "key": "45", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Psychosocial Profile',
    key: '86',
    expanded: false,
    children: [ 
      { "title": "ONI-PS-K10-1", "key": "00", isLeaf: true },
      { "title": "ONI-PS-K10-2", "key": "01", isLeaf: true },
      { "title": "ONI-PS-K10-3", "key": "02", isLeaf: true },
      { "title": "ONI-PS-K10-4", "key": "03", isLeaf: true },
      { "title": "ONI-PS-K10-5", "key": "04", isLeaf: true },
      { "title": "ONI-PS-K10-6", "key": "05", isLeaf: true },
      { "title": "ONI-PS-K10-7", "key": "06", isLeaf: true },
      { "title": "ONI-PS-K10-8", "key": "07", isLeaf: true },
      { "title": "ONI-PS-K10-9", "key": "08", isLeaf: true },
      { "title": "ONI-PS-K10-10", "key": "09", isLeaf: true },
      { "title": "ONI-PS-Sleep Difficulty", "key": "10", isLeaf: true },
      { "title": "ONI-PS-Sleep Details", "key": "11", isLeaf: true },
      { "title": "ONI-PS-Personal Support", "key": "12", isLeaf: true },
      { "title": "ONI-PS-Personal Support Comments", "key": "13", isLeaf: true },
      { "title": "ONI-PS-Keep Friendships", "key": "14", isLeaf: true },
      { "title": "ONI-PS-Problems Interacting", "key": "15", isLeaf: true },
      { "title": "ONI-PS-Family/Relationship Comments", "key": "16", isLeaf: true },
      { "title": "ONI-PS-Svc Prvdr Relations", "key": "17", isLeaf: true },
      { "title": "ONI-PS-Svc Prvdr Comments", "key": "18", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Health Behaviours Profile',
    key: '87',
    expanded: false,
    children: [ 
      { "title": "ONI-HB-Regular Health Checks", "key": "00", isLeaf: true },
      { "title": "ONI-HB-Last Health Check", "key": "01", isLeaf: true },
      { "title": "ONI-HB-Health Screens", "key": "02", isLeaf: true },
      { "title": "ONI-HB-Smoking", "key": "03", isLeaf: true },
      { "title": "ONI-HB-If Quit Smoking - When?", "key": "04", isLeaf: true },
      { "title": "ONI-HB-Alchohol-How often?", "key": "05", isLeaf: true },
      { "title": "ONI-HB-Alchohol-How many?", "key": "06", isLeaf: true },
      { "title": "ONI-HB-Alchohol-How often over 6?", "key": "07", isLeaf: true },
      { "title": "ONI-HB-Lost Weight", "key": "08", isLeaf: true },
      { "title": "ONI-HB-Eating Poorly", "key": "09", isLeaf: true },
      { "title": "ONI-HB-How much wieght lost", "key": "10", isLeaf: true },
      { "title": "ONI-HB-Malnutrition Score", "key": "11", isLeaf: true },
      { "title": "ONI-HB-8 cups fluid", "key": "12", isLeaf: true },
      { "title": "ONI-HB-Recent decrease in fluid", "key": "13", isLeaf: true },
      { "title": "ONI-HB-Weight", "key": "14", isLeaf: true },
      { "title": "ONI-HB-Physical Activity", "key": "15", isLeaf: true },
      { "title": "ONI-HB-Physical Fitness", "key": "16", isLeaf: true },
      { "title": "ONI-HB-Fitness Comments", "key": "17", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Carer Profile',
    key: '88',
    expanded: false,
    children: [
      { "title": "ONI-CP-Need for Carer", "key": "000", isLeaf: true },  
      { "title": "ONI-CP-Carer Availability", "key": "00", isLeaf: true },
      { "title": "ONI-CP-Carer Residency Status", "key": "01", isLeaf: true },
      { "title": "ONI-CP-Carer Relationship", "key": "02", isLeaf: true },
      { "title": "ONI-CP-Carer has help", "key": "03", isLeaf: true },
      { "title": "ONI-CP-Carer receives payment", "key": "04", isLeaf: true },
      { "title": "ONI-CP-Carer made aware support services", "key": "05", isLeaf: true },
      { "title": "ONI-CP-Carer needs training", "key": "06", isLeaf: true },
      { "title": "ONI-CP-Carer threat-emotional", "key": "07", isLeaf: true },
      { "title": "ONI-CP-Carer threat-acute physical", "key": "08", isLeaf: true },
      { "title": "ONI-CP-Carer threat-slow physical", "key": "09", isLeaf: true },
      { "title": "ONI-CP-Carer threat-other factors", "key": "10", isLeaf: true },
      { "title": "ONI-CP-Carer threat-increasing consumer needs", "key": "11", isLeaf: true },
      { "title": "ONI-CP-Carer threat-other comsumer factors", "key": "12", isLeaf: true },
      { "title": "ONI-CP-Carer arrangements sustainable", "key": "13", isLeaf: true },
      { "title": "ONI-CP-Carer Comments", "key": "14", isLeaf: true },
    ]
  },
  {
    title: 'ONI-Cultural Profile',
    key: '81',
    expanded: false,
    children: [
      { "title": "ONI-CS-Year of Arrival", "key": "24", isLeaf: true },
      { "title": "ONI-CS-Citizenship Status", "key": "00", isLeaf: true },
      { "title": "ONI-CS-Reasons for moving to Australia", "key": "01", isLeaf: true },
      { "title": "ONI-CS-Primary/Secondary Language Fluency", "key": "02", isLeaf: true },
      { "title": "ONI-CS-Fluency in English", "key": "03", isLeaf: true },
      { "title": "ONI-CS-Literacy in primary language", "key": "04", isLeaf: true },
      { "title": "ONI-CS-Literacy in English", "key": "05", isLeaf: true },
      { "title": "ONI-CS-Non verbal communication style", "key": "06", isLeaf: true },
      { "title": "ONI-CS-Marital Status", "key": "07", isLeaf: true },
      { "title": "ONI-CS-Religion", "key": "08", isLeaf: true },
      { "title": "ONI-CS-Employment history in country of origin", "key": "09", isLeaf: true },
      { "title": "ONI-CS-Employment history in Australia", "key": "10", isLeaf: true },         
      { "title": "ONI-CS-Specific dietary needs", "key": "11", isLeaf: true },
      { "title": "ONI-CS-Specific cultural needs", "key": "12", isLeaf: true }, 
      { "title": "ONI-CS-Someone to talk to for day to day problems", "key": "13", isLeaf: true },
      { "title": "ONI-CS-Miss having close freinds", "key": "14", isLeaf: true },
      { "title": "ONI-CS-Experience general sense of emptiness", "key": "15", isLeaf: true },
      { "title": "ONI-CS-Plenty of people to lean on for problems", "key": "16", isLeaf: true },
      { "title": "ONI-CS-Miss the pleasure of the company of others", "key": "17", isLeaf: true },
      { "title": "ONI-CS-Circle of friends and aquaintances too limited", "key": "18", isLeaf: true },
      { "title": "ONI-CS-Many people I trust completely", "key": "19", isLeaf: true },
      { "title": "ONI-CS-Enough people I feel close to", "key": "20", isLeaf: true },
      { "title": "ONI-CS-Miss having people around", "key": "21", isLeaf: true },
      { "title": "ONI-CS-Often feel rejected", "key": "22", isLeaf: true },
      { "title": "ONI-CS-Can call on my friends whenever I need them", "key": "23", isLeaf: true },                    
    ]
  },
  {
    title: 'Loan Items',
    key: '35',
    expanded: false,
    children:[
      { "title": "Loan Item Type", "key": "00", isLeaf: true },
      { "title": "Loan Item Description", "key": "01", isLeaf: true },
      { "title": "Loan Item Date Loaned/Installed", "key": "02", isLeaf: true },
      { "title": "Loan Item Date Collected", "key": "03", isLeaf: true },
    ]
  },
];


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
    
    get jsreportSettings(): any {
      var jsconfig: JsConfig = JSON.parse(localStorage.getItem('jsreportSettings'));
      return btoa(`${jsconfig.username}:${jsconfig.password}`);
    }
    
    set jsreportSettings(data: any) {
      localStorage.setItem('jsreportSettings', JSON.stringify(data));
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
      return "''";
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
    
    bToast(title: string, details: string){
      this.notification.blank(title, details);
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
    convertDbDate(date:string,defaultformat:string = 'yyyy/MM/dd'){
      const newDate = format(Date.parse(date),defaultformat);
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
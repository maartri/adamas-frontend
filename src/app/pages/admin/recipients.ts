import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalService, StaffService, ShareService, leaveTypes, ListService } from '@services/index';
import {forkJoin,  of ,  Subject ,  Observable, observable, EMPTY } from 'rxjs';
import { RECIPIENT_OPTION } from '../../modules/modules';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core';
import format from 'date-fns/format';
import { filter } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
    styles: [`
        nz-tabset{
            margin-top:1rem;
        }
        nz-tabset >>> div > div.ant-tabs-nav-container{
            height: 25px !important;
            font-size: 13px !important;
        }

        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
            line-height: 24px;
            height: 25px;
        }
        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
            background: #717e94;
            color: #fff;
        }
        ul{
            list-style:none;
            float:right;
            margin:0;
        }
        li{
            display: inline-block;
            margin-right: 6px;
            padding: 5px 0;
            font-size: 13px;
        }
        li div{
            text-align: center;
        }
        .recipient-controls button{
            margin-right:1rem;
        }
        nz-select{
            width:100%;
        }
        .options button:disabled{
            color:#a3a3a3;
            cursor: no-drop;
        }
        .options button:hover:not([disabled]) {
            color:#177dff;
            cursor:pointer;
        }
        ul li button{
            border: 0;
            background: #ffffff00;
            float: left;
        }
        .status{
            font-size: 11px;
            padding: 3px 5px;
            border-radius: 11px;
            color: #fff;

            margin-right: 10px;
        }
        .status.active{            
            background: #42ca46;
        }
        .status.inactive{            
            background: #c70000;
        }
        .status.type{
            background:#c8f2ff;
            color: black;
        }
        .status-program{
            display: inline-block;
            float: left;
            margin-right:1rem;
        }
        .status-program i{
            font-size: 1.4rem;
            color: #bfbfbf;
            margin-right:10px;
            cursor:pointer;
        }
        .status-program i:hover{
            color: #000;
        }

        .tree-overflow{
            max-height: 24rem;
            overflow: auto;
        }
        label.columns{
          display:block;
          margin:0;
        }
    `],
    templateUrl: './recipients.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientsAdmin implements OnInit, AfterViewInit, OnDestroy {

    option: string = 'add';
    
    user: any = null;
    nzSelectedIndex: number = 0;
    isFirstLoad: boolean = false;
    programModalOpen: boolean = false;
    findModalOpen: boolean = false;

    sample: any;

    newReferralModal: boolean = false;
    newQuoteModal: boolean = false;
    quoteModal: boolean = false;
    saveModal: boolean = false;
    
    newOtherModal: boolean = false;

    isLoading: boolean = false;
    current: number = 0;

    selectedValue: any;
    value: any;

    status: any = null;
    statusTab = new Subject<any>();

    recipientOptionOpen: any;
    recipientOption: string;
    from:string = 'admit';
    fileList2: Array<any> = [];
    urlPath: string = `api/v2/file/upload-document-remote`;
    acceptedTypes: string = "image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf";
    file: File;
    referdocument: boolean = false;
    
    RECIPIENT_OPTION = RECIPIENT_OPTION;

    recipientStatus: string = null;
    recipientType: any;
    selectedRecipient: any; 

    programs: Array<any> = [];

    tabs = [1, 2, 3];

    checked: any;
    sampleList: Array<any> = ["1","2","3"]
    sampleModel: any;

    columns: Array<any> = [
      {
        name: 'ID',
        checked: false
      },
      {
        name: 'URNumber',
        checked: false
      },
      {
        name: 'AccountNo',
        checked: false
      },
      {
        name: 'Surname',
        checked: false
      },
      {
        name: 'Firstname',
        checked: false
      },
      {
        name: 'Fullname',
        checked: false
      },
      {
        name: 'Gender',
        checked: false
      },
      {
        name: 'DOB',
        checked: false
      },
      {
        name: 'Address',
        checked: false
      },
      {
        name: 'Contact',
        checked: false
      },
      {
        name: 'Type',
        checked: false
      },
      {
        name: 'Branch',
        checked: false
      },
      {
        name: 'Coord',
        checked: false
      },
      {
        name: 'Category',
        checked: false
      },
      {
        name: 'ONI',
        checked: false
      },
      {
        name: 'Activated',
        checked: false
      },
      {
        name: 'Deactivated',
        checked: false
      },
      {
        name: 'Suburb',
        checked: false
      }
    ]

    data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
      }
    ];

    nodes = [
        {
          title: 'Name And Address',
          key: '100',
          expanded: false,
          children: [
            {
              title: 'parent 1-0',
              key: '1001',
              expanded: true,
              children: [
                { title: 'leaf', key: '10010', isLeaf: true },
                { title: 'leaf', key: '10011', isLeaf: true },
                { title: 'leaf', key: '10012', isLeaf: true }
              ]
            },
            {
              title: 'parent 1-1',
              key: '1002',
              children: [{ title: 'leaf', key: '10020', isLeaf: true }]
            },
            {
              title: 'parent 1-2',
              key: '1003',
              children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
            }
          ]
        },
        {
            title: 'General Demographics',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Gender',
                key: '1001',
                isLeaf: true
              },
              {
                title: 'Date of Birth',
                key: '1002',
                isLeaf: true
              },
              {
                title: 'Age',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Ageband-Statistical',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Ageband-5 Year',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Month Of Birth',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Month Of Birth No',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Day Of Birth',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Day Of Birth No',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'CALD Score',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Country Of Birth',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Language',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Indigenous Status',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Primary Disability',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Financially Dependent',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Financial Status',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Occupation',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Admin Information',
            key: '100',
            expanded: false,
            children: [              
              {
                title: 'UniqueID',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Code',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Type',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Category',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Coordinator',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Admitting Branch',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'File Number',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Other General',
            key: '100',
            expanded: false,
            children: [              
              {
                title: 'OH&S Profile',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Old WH&S Date',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Billing Profile',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Grid Reference',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Roster Alerts',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Timesheet Alerts',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Issues',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Survey Consent Given',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Copy Rosters Enabled',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Activation Date',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'DeActivation Date',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Contacts & Next Of Kin',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Contact Group',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Type',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Name',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Address',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Suburb',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Postcode',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Phone 1',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Phone 2',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Mobile',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact FAX',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Contact Email',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Consents',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Consent',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Consent Expiry',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Consent Notes',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Goals Of Care',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Goal Detail',
                key: '1003',
                isLeaf: true
              },,
              {
                title: 'Goal Achieved',
                key: '1003',
                isLeaf: true
              },
            ]
        },
        {
            title: 'Reminders',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Reminder Detail',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Event Date',
                key: '1003',
                isLeaf: true
              },,
              {
                title: 'Reminder Date',
                key: '1003',
                isLeaf: true
              },,
              {
                title: 'Reminder Notes',
                key: '1003',
                isLeaf: true
              },
            ]
        },
        {
            title: 'User Groups',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Group Name',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Preferences',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Preference Name',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Excluded Staff',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Excluded Staff',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Agreed Funding Information',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Funding Source',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funding Program',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funding Status',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Program Coordinator',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funding Start Date',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funding End Date',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Auto Renew',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Rollover Remainder',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funded Qty',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funded Type',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funded Cycle',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Funded Total Allocation',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Used',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Remaining',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Agreed Service Information',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'Agreed ',
                key: '1003',
                isLeaf: true
              },
              {
                title: 'Remaining',
                key: '1003',
                isLeaf: true
              }
            ]
        },
        {
            title: 'Clinical Information',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'parent 1-0',
                key: '1001',
                expanded: true,
                children: [
                  { title: 'leaf', key: '10010', isLeaf: true },
                  { title: 'leaf', key: '10011', isLeaf: true },
                  { title: 'leaf', key: '10012', isLeaf: true }
                ]
              },
              {
                title: 'parent 1-1',
                key: '1002',
                children: [{ title: 'leaf', key: '10020', isLeaf: true }]
              },
              {
                title: 'parent 1-2',
                key: '1003',
                children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
              }
            ]
        },
        {
            title: 'Billing Information',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'parent 1-0',
                key: '1001',
                expanded: true,
                children: [
                  { title: 'leaf', key: '10010', isLeaf: true },
                  { title: 'leaf', key: '10011', isLeaf: true },
                  { title: 'leaf', key: '10012', isLeaf: true }
                ]
              },
              {
                title: 'parent 1-1',
                key: '1002',
                children: [{ title: 'leaf', key: '10020', isLeaf: true }]
              },
              {
                title: 'parent 1-2',
                key: '1003',
                children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
              }
            ]
        },
        {
            title: 'Time Logging',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'parent 1-0',
                key: '1001',
                expanded: true,
                children: [
                  { title: 'leaf', key: '10010', isLeaf: true },
                  { title: 'leaf', key: '10011', isLeaf: true },
                  { title: 'leaf', key: '10012', isLeaf: true }
                ]
              },
              {
                title: 'parent 1-1',
                key: '1002',
                children: [{ title: 'leaf', key: '10020', isLeaf: true }]
              },
              {
                title: 'parent 1-2',
                key: '1003',
                children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
              }
            ]
        },
        {
            title: 'Insurance & Pension',
            key: '100',
            expanded: false,
            children: [
              {
                title: 'parent 1-0',
                key: '1001',
                expanded: true,
                children: [
                  { title: 'leaf', key: '10010', isLeaf: true },
                  { title: 'leaf', key: '10011', isLeaf: true },
                  { title: 'leaf', key: '10012', isLeaf: true }
                ]
              },
              {
                title: 'parent 1-1',
                key: '1002',
                children: [{ title: 'leaf', key: '10020', isLeaf: true }]
              },
              {
                title: 'parent 1-2',
                key: '1003',
                children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
              }
            ]
        },
        {
          title: 'HACC Dataset Fields',
          key: '100',
          expanded: false,
          children: [
            {
              title: 'parent 1-0',
              key: '1001',
              expanded: true,
              children: [
                { title: 'leaf', key: '10010', isLeaf: true },
                { title: 'leaf', key: '10011', isLeaf: true },
                { title: 'leaf', key: '10012', isLeaf: true }
              ]
            },
            {
              title: 'parent 1-1',
              key: '1002',
              children: [{ title: 'leaf', key: '10020', isLeaf: true }]
            },
            {
              title: 'parent 1-2',
              key: '1003',
              children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
            }
          ]
      },
      {
        title: 'CSTDA Dataset Fields',
        key: '100',
        expanded: false,
        children: [
          {
            title: 'parent 1-0',
            key: '1001',
            expanded: true,
            children: [
              { title: 'leaf', key: '10010', isLeaf: true },
              { title: 'leaf', key: '10011', isLeaf: true },
              { title: 'leaf', key: '10012', isLeaf: true }
            ]
          },
          {
            title: 'parent 1-1',
            key: '1002',
            children: [{ title: 'leaf', key: '10020', isLeaf: true }]
          },
          {
            title: 'parent 1-2',
            key: '1003',
            children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
          }
        ]
    },
    {
      title: 'NRCP Dataset Fields',
      key: '100',
      expanded: false,
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          expanded: true,
          children: [
            { title: 'leaf', key: '10010', isLeaf: true },
            { title: 'leaf', key: '10011', isLeaf: true },
            { title: 'leaf', key: '10012', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf', key: '10020', isLeaf: true }]
        },
        {
          title: 'parent 1-2',
          key: '1003',
          children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
        }
      ]
  },
  {
    title: 'ONI-Core',
    key: '100',
    expanded: false,
    children: [
      {
        title: 'parent 1-0',
        key: '1001',
        expanded: true,
        children: [
          { title: 'leaf', key: '10010', isLeaf: true },
          { title: 'leaf', key: '10011', isLeaf: true },
          { title: 'leaf', key: '10012', isLeaf: true }
        ]
      },
      {
        title: 'parent 1-1',
        key: '1002',
        children: [{ title: 'leaf', key: '10020', isLeaf: true }]
      },
      {
        title: 'parent 1-2',
        key: '1003',
        children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
      }
    ]
},
{
  title: 'ONI-Functional Profile',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},
{
  title: 'ONI-Living Arrangements Profile',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},
{
  title: 'ONI-Health Conditions Profile',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},
{
  title: 'ONI-Psychosocial Profile',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},
{
  title: 'ONI-Health Behaviours Profile',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},
{
  title: 'ONI-Carer Profile',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},
{
  title: 'ONI-Cultural Profile',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},
{
  title: 'Loan Items',
  key: '100',
  expanded: false,
  children: [
    {
      title: 'parent 1-0',
      key: '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    },
    {
      title: 'parent 1-1',
      key: '1002',
      children: [{ title: 'leaf', key: '10020', isLeaf: true }]
    },
    {
      title: 'parent 1-2',
      key: '1003',
      children: [{ title: 'leaf', key: '10030', isLeaf: true }, { title: 'leaf', key: '10031', isLeaf: true }]
    }
  ]
},

    ];

    nzEvent(event: NzFormatEmitEvent): void {
      console.log(event);
    }

    listChange(event: any) {

        if (event == null) {
            this.user = null;
            this.isFirstLoad = false;
            this.sharedS.emitChange(this.user);
            return;
        }

        if (!this.isFirstLoad) {
            this.view(0);
            // this.view(10);
            
            this.isFirstLoad = true;
        }

        // console.log(JSON.stringify(event));
        // console.log(event); 
        // console.log(JSON.stringify(event));
        this.globalS.id = event.uniqueID;

        this.user = {
            code: event.accountNo,
            id: event.uniqueID,
            view: event.view,
            agencyDefinedGroup: event.agencyDefinedGroup,
            sysmgr: event.sysmgr
        }

        this.sharedS.emitChange(this.user);

        this.listS.getstatusofwizard(this.user.id)
            .subscribe(data => {
                this.status = data;
            });

        this.cd.detectChanges();
    }

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sharedS: ShareService,
        private cd: ChangeDetectorRef,
        private listS: ListService,
        private globalS:GlobalService,
        private http: HttpClient,
        private msg: NzMessageService,
    ) {
      
        this.sharedS.emitProfileStatus$.subscribe(data => {
            // console.log(data);
            this.selectedRecipient = data;
            this.recipientType = data.type == null || data.type.trim() == "" ? null : data.type;
            // if(data.admissionDate == null && data.dischargeDate == null){
            //     this.recipientStatus = null;
            //     return;
            // }
            
            if(this.globalS.doc != null){
              this.addRefdoc();
            }

            if(data.admissionDate != null && data.dischargeDate == null){
                this.recipientStatus = 'active';
            } else {
                this.recipientStatus ='inactive';
            }
            
        })
        
    }

    ngOnInit(): void {
     
      

        // this.listChange({
        //     "agencyDefinedGroup":"ARUNDEL",
        //     "accountNo":"3CDC STEPH",
        //     "uniqueID":"T0100005508",
        //     "sysmgr":true,
        //     "view":"recipient"
        // });
        
        // this.listChange({
        //     accountNo: "ABBOTS MORGANICA",
        //     agencyDefinedGroup: "GRAFTON",
        //     sysmgr: true,
        //     uniqueID: "T0100004652",
        //     view: "recipient"
        // });

        // this.listChange({
        //         "agencyDefinedGroup":"ARUNDEL",
        //         "accountNo":"ABBERTON G T",
        //         "uniqueID":"T0100005186",
        //         "sysmgr":true,
        //         "view":"recipient"
        //     })
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit() {
      
    }

    view(index: number) {
        this.nzSelectedIndex = index;

        if (index == 0) {
            this.router.navigate(['/admin/recipient/personal'])
        }
        if (index == 1) {
            this.router.navigate(['/admin/recipient/contacts']);
        }
        if (index == 2) {
            this.router.navigate(['/admin/recipient/intake'])
        }
        if (index == 3) {
            this.router.navigate(['/admin/recipient/reminders'])
        }
        if (index == 4) {
            this.router.navigate(['/admin/recipient/opnote'])
        }
        if (index == 5) {
            this.router.navigate(['/admin/recipient/casenote'])
        }
        if (index == 6) {
            this.router.navigate(['/admin/recipient/incidents'])
        }
        if (index == 7) {
            this.router.navigate(['/admin/recipient/perm-roster'])
        }
        if (index == 8) {
            this.router.navigate(['/admin/recipient/history'])
        }
        if (index == 9) {
            this.router.navigate(['/admin/recipient/insurance-pension'])
        }
        if (index == 10) {
            this.router.navigate(['/admin/recipient/quotes'])
        }
        if (index == 11) {
          this.router.navigate(['/admin/recipient/forms'])
        }
        if (index == 12) {
            this.router.navigate(['/admin/recipient/attendance'])
        }
        if (index == 13) {
            this.router.navigate(['/admin/recipient/others'])
        }
        if (index == 14) {
            this.router.navigate(['/admin/recipient/accounting'])        
        }
    }

    handleCancel() {
    

        this.newReferralModal = !this.newReferralModal;
        this.saveModal = false;
        this.newOtherModal = false;
        this.findModalOpen = false;
        this.referdocument = false;
        
    }

    handleOk() {
    //  this.referdocument = false;
    }

    detectChanges(){
        this.cd.markForCheck();
        this.cd.detectChanges();
    }

    closeProgram(){
        this.programModalOpen = false;
    }

    loadPrograms(){
        if(!this.selectedRecipient){
            return;
        }
        this.listS.getrecipientprograms(this.selectedRecipient.uniqueID)
        .subscribe(data => {
            this.programs = data;
            this.detectChanges();
        })
    }

    openReferInModal: any;
    profileData: any;
    
    openReferModal(user: any) {
      console.log(user.toString())
        this.sample = user;
        this.sharedS.emitOnSearchListNext(user.code);        
        this.profileData = user;
        this.recipientOption =  this.RECIPIENT_OPTION.REFER_IN;
        this.user = user;
        this.recipientOptionOpen = {};
        
    }

    clicky(index: number){
        if(index == 0){
            this.recipientOption =  this.RECIPIENT_OPTION.REFER_IN;
            this.recipientOptionOpen = {};
        }

        if(index == 1){
            this.recipientOption =  this.RECIPIENT_OPTION.REFER_ON;
            this.recipientOptionOpen = {};
        }

        if(index == 2){
            this.recipientOption =  this.RECIPIENT_OPTION.NOT_PROCEED;
            this.recipientOptionOpen = {};
        }

        if(index == 3){
            this.recipientOption =  this.RECIPIENT_OPTION.ASSESS;
            this.recipientOptionOpen = {};
        }

        if(index == 4){
            this.recipientOption =  this.RECIPIENT_OPTION.ADMIT;
            this.recipientOptionOpen = {};
        }

        if(index == 5){
            this.recipientOption =  this.RECIPIENT_OPTION.WAIT_LIST;
            this.recipientOptionOpen = {};
        }

        if(index == 6){
            this.recipientOption =  this.RECIPIENT_OPTION.DISCHARGE;
            this.recipientOptionOpen = {};
        }

        if(index == 6){
            this.recipientOption =  this.RECIPIENT_OPTION.DISCHARGE;
            this.recipientOptionOpen = {};
        }

        if(index == 7){
            this.recipientOption =  this.RECIPIENT_OPTION.SUSPEND;
            this.recipientOptionOpen = {};
        }

        if(index == 8){
            this.recipientOption =  this.RECIPIENT_OPTION.REINSTATE;
            this.recipientOptionOpen = {};
        }

        if(index == 9){
            this.recipientOption =  this.RECIPIENT_OPTION.DECEASE;
            this.recipientOptionOpen = {};
        }

        if(index == 10){
            this.recipientOption =  this.RECIPIENT_OPTION.ADMIN;
            this.recipientOptionOpen = {};
        }
        
        if(index == 11){
            this.recipientOption =  this.RECIPIENT_OPTION.ITEM;
            this.recipientOptionOpen = {};
        }
    }

    openFindModal(){
        this.tabFindIndex = 0;
        this.findModalOpen = true;
    }

    tabFindIndex: number = 0;
    tabFindChange(index: number){
        this.tabFindIndex = index;
    }

    filterChange(index: number){
      
    }
    
    addRefdoc(){
      //console.log(this.globalS.doc.toString());
      /*if (this.globalS.doc.toString() != null){ 
        console.log(this.globalS.doc.toString());                 
        this.referdocument = true;
      } */

      
      this.referdocument = true;
      this.globalS.doc = null;
      
      
      
      } 
      customReq = () => {
        //console.log(this.globalS.doc.label)
    
        console.log(this.file);
        this.referdocument = false;
        const formData = new FormData();
    
        //const { program, discipline, careDomain, classification, category, reminderDate, publishToApp, reminderText, notes  } = this.incidentForm.value;
        
        formData.append('file', this.file as any);
        /*formData.append('data', JSON.stringify({
          PersonID: this.innerValue.id,
          DocPath: this.token.recipientDocFolder,
          
          Program: program,
          Discipline: discipline,
          CareDomain: careDomain,
          Classification: classification,
          Category: category,
          ReminderDate: reminderDate,
          PublishToApp: publishToApp,
          ReminderText: reminderText,
          Notes: notes,
          SubId: this.innerValue.incidentId
        })) */
    
        const req = new HttpRequest('POST', this.urlPath, formData, {
          reportProgress: true,
          withCredentials: true
        });
    
        var id = this.globalS.loadingMessage(`Uploading file ${this.file.name}`)
        this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
          (event: HttpEvent<any>) => {
            this.msg.remove(id);
            this.globalS.sToast('Success','Document uploaded');
          },
          err => {
            console.log(err);
            this.msg.error(`${this.file.name} file upload failed.`);
            this.msg.remove(id);
          }
        );
        
      }; 
      handleChange({ file, fileList }: UploadChangeParam): void {
        const status = file.status;
        if (status !== 'uploading') {
          // console.log(file, fileList);
        }
        if (status === 'done') {
          this.globalS.sToast('Success', `${file.name} file uploaded successfully.`);
          
          
        } else if (status === 'error') {
          this.globalS.sToast('Error', `${file.name} file upload failed.`);
          
        }
      }
      handleClose(){        
  
        this.newReferralModal = false;
        this.saveModal = false;
        this.quoteModal = false;
        this.newOtherModal = false;
        this.findModalOpen = false;
        this.referdocument = false;

    }
   
   
}//
import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';

import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { ClientService, GlobalService, StaffService, TimeSheetService, SettingsService } from '@services/index';

@Component({
    styles: [`
        :host ::ng-deep .upload-list-inline .ant-upload-list-item {
            float: left;
            width: 200px;
            margin-right: 8px;
        }
        .logo-group{
            float: left;
        }
        .logo-group i{            
            font-size: 2rem;
            margin-right: 10px;
        }
        ul{
            list-style:none;
            padding:0;
        }
        li > div{
            width: 100%;
            display: inline-block;
            border-bottom: 1px solid #d9d0d0;
            padding:8px 0;
        }
        .file-info{
            float:left;
            line-height: 15px;
        }
        h5{
            font-weight: 100;
            margin:0;
        }
        .file-info span{
            font-size: 10px;
        }
        .file-operations{
            float:right;
        }
        .file-operations i{
            margin-left:10px;
            cursor:pointer;
        }
        .file-operations i:hover{
            color: blue;
            transform: scale(1.2);
        }
        nz-spin{
            text-align:center;
            margin-top:1rem;
        }
    `],
    templateUrl: './document.html'
})


export class DocumentClient implements OnInit, OnDestroy {

    file: any;
    constructor(
        private globalS: GlobalService
    ) {

    }

    ngOnInit() {
        console.log(this.globalS.decode())
        this.file = {
            view: 'recipient',
            token: this.globalS.decode()
        }
    }

    ngOnDestroy(){

    }

}
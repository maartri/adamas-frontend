import { Component, OnInit, OnDestroy, Input, AfterViewInit} from '@angular/core'
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, } from '@angular/forms';
import {  NzModalService } from 'ng-zorro-antd/modal';
import { ListService} from '@services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';

//Sets defaults of Criteria Model
@Component({
    styles: [`
        
        button{
            width: 200pt !important;
            text-align: left !important;
        }        
        .btn{
            border:none;
            cursor:pointer;
            outline:none;
            transition: background-color 0.5s ease;
            padding: 5px 7px;
            border-radius: 3px;
            text-align: center !important;
            width: 100px !important;
        }
        label{
            font-weight: bold; 
        }
        
        .form-group label{
            font-weight: bold;
        }
        nz-select{
            width:100%;
            
        }
        label.checks{
            margin-top: 4px;
            font-weight: 300 !important;
        }
        nz-date-picker{
            margin:5pt;
        }
        .frm_number{
            width:250px;
            height:32px;

        }
        .frm_AgingNumber{
            width:50px;
            height:32px;
        }
        .spinner{
            margin:1rem auto;
            width:1px;
        }

        li{
            border:none !important;
            padding:2rem;
        }
        
        
    `],
    templateUrl: './chspDex.html'
})
export class chspDexAdmin implements OnInit, OnDestroy {

    open: any;
    
    ngOnInit(){

    }

    ngOnDestroy(){

    }

    constructor(){

    }

    openModal(val: string){
        if(val == 'dex')
        {
            console.log('open deex')
            this.open = {}; 
        }
    }
    
}

import { Component, OnInit, OnDestroy, Input, AfterViewInit} from '@angular/core'
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, } from '@angular/forms';
import {  NzModalService } from 'ng-zorro-antd/modal';
import { ListService} from '@services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';

//Sets defaults of Criteria Model
const inputFormDefault = {
    branchesArr: [[]],
    allBranches: [true],

    managersArr: [[]],
    allManager: [true],

    recipientArr: [[]],
    allRecipients: [true],

    programsArr: [[]],
    allPrograms: [true],

    serviceRegionsArr: [[]],
    allServiceRegion: [true],
    
    AccountsArr: [[]],
    allAccounts: [true],

    PackagesArr: [[]],
    allPackages: [true],

    BatchNoArr: [[]],
   

    filterArr : ['Invoiced Only'],

    single_input_number: [1],
    AgingCycles: [30],
      
     
}

@Component({
    styles: [`

        li{
            border:none !important;
            padding:2rem;
        }
        
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
        
    `],
    templateUrl: './hcp.html'
})
export class HCPComponent implements OnInit, OnDestroy {
    
    claimPreparationOpen: any;
    claimUpdateOpen: any;
    prodaClaimUpdateOpen: any;

    ngOnInit(){

    }

    ngOnDestroy(){

    }

    constructor(){

    }

    view(val: string){
        if(val == 'cp') this.claimPreparationOpen = {};
        if(val == 'cu') this.claimUpdateOpen = {};
        if(val == 'proda')  this.prodaClaimUpdateOpen = {};
    }
    
}

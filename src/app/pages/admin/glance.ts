import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router';
import { ListService } from '@services/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

@Component({
    templateUrl: './glance.html',
    styles: [`
        
    button{
        width: 200pt !important;
        text-align: center !important;
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
    
`]
})
export class GlanceAdmin implements OnInit, OnDestroy, AfterViewInit {

    dateFormat: string = 'dd/MM/yyyy';
    loading: boolean = false;
    inputForm: FormGroup;
    dtpStartDate: any;
    dtpEndDate: any;
    companyName: any;
    dataInputOutput: Array<any>;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private listS: ListService,
    ) { }
    ngOnInit(): void {
        this.buildForm();
        this.populateDropDown();
        this.getCompanyName();
    }
    buildForm() {
        this.inputForm = this.formBuilder.group({
            dtpStartDate: this.dtpStartDate = startOfMonth(new Date()),
            dtpEndDate: this.dtpEndDate = endOfMonth(new Date()),
            name: null,
            inputOutput: 'Service Outputs',
            companyName: this.companyName
        });
    }
    ngAfterViewInit(): void {

    }
    onChange(result: Date): void {
        // console.log('onChange: ', result);
    }
    ngOnDestroy(): void {
    }
    populateDropDown() {
        // this.statesList = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
        this.dataInputOutput = ['Service Outputs', 'Staff Inputs'];
    }
    getCompanyName(){
        let sql = "SELECT TOP 1 CoName as CompanyName FROM Registration";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.companyName = data;
            this.loading = false;
        });
    }
    
}


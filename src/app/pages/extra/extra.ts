import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService, GlobalService } from '@services/index';

@Component({
    selector: 'app-login',
    templateUrl: './extra.html'
})
export class ExtraComponent implements OnInit {

    columnDefs = [
        {field: 'make' },
        {field: 'model' },
        {field: 'price'}
    ];

    rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];

    

    constructor(
        private fb: FormBuilder,
        private loginS: LoginService,
        private globalS: GlobalService
    ) { }

    ngOnInit(): void {

    }

   

}

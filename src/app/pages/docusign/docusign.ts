import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService, GlobalService } from '@services/index';
import { SettingsService } from '@services/settings.service';

import {
  Router
} from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './docusign.html'
})
export class DocusignComponent implements OnInit {

    constructor(){
        
    }

    ngOnInit(){

    }

    goto(){
        
        window.location.href = "https://demo.docusign.net/Member/StartInSession.aspx?StartConsole=1&t=6f87d5eb-5e6e-444f-811f-586e4edf36c8&DocuEnvelope=22c05b94-00d9-4280-b89d-f409bc39e865&send=01"
    }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService, GlobalService, TYPE_MESSAGE } from '@services/index';
import { SettingsService } from '@services/settings.service';
import { ApplicationUser } from '@modules/modules';

import {
  Router
} from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;
  unauthorized: boolean = false;
  unauthorizedStr: string;

  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
  }

  constructor(
    private fb: FormBuilder,
    private loginS: LoginService,
    private globalS: GlobalService,
    private settingS: SettingsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  login() {
    if (!this.loginForm.valid) return;
    this.loading = true;
    let user: ApplicationUser = {
      Username: this.loginForm.get('userName').value,
      Password: this.loginForm.get('password').value
    }
   
    this.settingS.getSettingsObservable(user.Username).pipe(
      switchMap(x => {
        this.globalS.settings = x;
        this.globalS.originalSettings = x;
        
        return this.loginS.login(user);
      }) 
    ).subscribe(data => {
        this.globalS.token = data.access_token;        
        
        if (this.globalS.redirectURL) {
          this.globalS.ISTAFF_BYPASS = 'true';
          this.router.navigateByUrl(this.globalS.redirectURL);
          return;
        }       

        setTimeout(() => {
          this.globalS.viewRender(this.globalS.token);
        }, 200);

        this.reset();
      }, (error: HttpErrorResponse) => {
        this.unauthorized = true;

        this.globalS.createMessage(TYPE_MESSAGE.error,'The credentials you entered is incorrect');
        if (error.status == 401) this.unauthorizedStr = 'Invalid user name or password';
        if (error.status == 400) this.unauthorizedStr = error.error.message;
        this.reset();
        throw (error);
      });
  }

  reset() {
    this.loading = false;
    this.loginForm.reset();
    setTimeout(() => {
      this.unauthorized = false;
    }, 2000);
  }

}

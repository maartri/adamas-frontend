import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from '@services/index';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(
    private versionCheck: VersionCheckService
  ){

  }

  ngOnInit(): void{
    if(environment.production){
      // this.versionCheck.initVersionCheck(environment.versionCheckURL);
    }
  }
}

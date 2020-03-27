import { Component, OnInit } from '@angular/core';
import { GlobalService, LoginService } from '@services/index';
@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {

  isVisible: boolean = false;

  constructor(
    private globalS: GlobalService,
    private loginS: LoginService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    const token = this.globalS.decode();

    this.loginS.logout(token.uniqueID)
      .subscribe(data => data)
    this.globalS.logout();
  }

  onClickOutside(event: Object) {
    if (event && event['value'] === true) {
      this.isVisible = false;
    }
  }

  

}

import { Component, OnInit } from '@angular/core';
import { GlobalService, LoginService, roles } from '@services/index';
@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {

  isVisible: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private globalS: GlobalService,
    private loginS: LoginService
  ) { }

  ngOnInit(): void {
    const token = this.globalS.decode();
    console.log(token);
    if (token.role == roles.admin) {
      this.isAdmin = true;
    }

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

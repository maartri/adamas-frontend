import { Component, OnInit, Input } from '@angular/core';
import { GlobalService, LoginService, roles, ShareService, ListService, TimeSheetService } from '@services/index';
import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {
  @Input() HIDE_CRUMBS: boolean = false;

  isVisible: boolean = false;
  isAdmin: boolean = false;

  tempRole: string;
  ifClientManager: boolean = false;
  
  pickedUser: any;

  settingsDrawerVisible: boolean = false;
  clientPortalMethod: boolean = false;

  logoPath: any;

  user: any;

  constructor(
    private globalS: GlobalService,
    private loginS: LoginService,
    private sharedS: ShareService,
    private listS: ListService,
    private timeS: TimeSheetService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) { 
    // this.sharedS.emitMemberPicked$.subscribe(data => {
    //   console.log(data)
    // });
  }

  ngOnInit(): void {
    const token = this.globalS.decode();
    //if (token.role == roles.admin) {
      this.isAdmin = true;
    //}

    this.loginS.getcurrentuser().subscribe(data => this.user = data)

    this.tempRole = this.globalS.isRole();

    if (this.tempRole == roles.admin) {
    }
    else if (this.tempRole == roles.manager) {
        this.ifClientManager = this.tempRole == roles.manager ? true : false;

        this.listS.getclientportalmethod().subscribe(data => console.log(data));
    }
    else if (this.tempRole == roles.provider) {
    }

    // this.timeS.getbrandinglogo().subscribe(blob => {
    //   let objectURL = 'data:image/jpeg;base64,' + blob;
    //   this.logoPath = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    // })
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

  toClientMembers() {
    var tempRole = this.globalS.isRole();
    if (tempRole == roles.manager) {
        // this.router.navigate(['client-manager/settings']);
    }
  }

  close(){
    this.settingsDrawerVisible = false;
  }

  methodChange(event: boolean){
    this.listS.updateclientportalmethod(event).subscribe(data => {
      this.globalS.sToast('Success','Client Method changed')
    });
  }

  

}

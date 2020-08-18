import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { GlobalService, MemberService, ShareService } from '@services/index';
@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})

export class MembersComponent implements OnInit {
  members: Array<any>;
  membersTemp: Array<any>;
  loading:boolean = false;
  isActive: boolean = false;

  value: string;
  selectedIndex: number;

  constructor(
    private memberS: MemberService,
    private globalS: GlobalService,
    private sharedS: ShareService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getmembers(this.isActive);
  }

  getmembers(isActive: boolean){
    this.loading = true;
    this.members = null;
    
    this.memberS.getmembers({
      PersonId: this.globalS.decode().code,
      isActive: isActive
    }).subscribe(data => {
      this.membersTemp = data;
      this.members = this.membersTemp;

      this.loading = false;
    });
  }

  isActiveChanges(event: boolean){
    this.isActive = event;
    this.getmembers(this.isActive);
  }


  toProfile(member: any, index: number){
    this.selectedIndex = index;
    this.sharedS.emitMemberPickedChange(member);
  }

}

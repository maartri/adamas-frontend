import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'
import { GlobalService, MemberService, ShareService } from '@services/index';

import { distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Subject } from 'rxjs'

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})

export class MembersComponent implements OnInit {

  @Output() MEMBER_LENGTH = new EventEmitter<number>();

  switchValue: boolean = false;
  members: Array<any>;
  membersTemp: Array<any>;
  loading:boolean = false;
  isActive: boolean = false;
  search: string;

  value: string;
  selectedIndex: number;

  textChanges = new Subject<string>();

  constructor(
    private memberS: MemberService,
    private globalS: GlobalService,
    private sharedS: ShareService,
    private router: Router
  ) { 

    this.textChanges
      .pipe(
          debounceTime(500),
          distinctUntilChanged()
      ).subscribe(data => {
          this.members = this.membersTemp.filter(x => {
              if((x.accountNo).indexOf(data.toUpperCase()) > -1){
                  return x;
              }
          })      
      });
  }

  ngOnInit(): void {
    this.getmembers(this.isActive);

    this.memberS.getshowallrecipients().subscribe(data => this.switchValue = data)
  }

  switchChange(val: any){
    this.memberS.postshowallrecipients(val).subscribe(data => {
      this.getmembers(val);
    })
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

      this.MEMBER_LENGTH.emit(data.length);
      this.loading = false;

      this.globalS.sToast('Success',`${ this.members.length } recipients records found`)
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

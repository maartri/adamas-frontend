import { Component, OnInit, OnDestroy,AfterViewInit, Input,Output,EventEmitter } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    styles: [`
        ul{
            list-style:none;
        }

        div.divider-subs div{
            margin-top:2rem;
        }
        nz-divider{
            margin: 0;
        }
        p{
            margin: 0;
            cursor:pointer;
            padding:8px 5px;
        }
        .active-tab{
            background: #717e94;
            color: #fff;
        }
    `],
    templateUrl: './StaffExternal.html',
    selector:'staffexternal'
})


export class StaffExternal implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    @Input() isVisible:boolean=false;
    @Input() AccountNo:any;
    @Output() staffexternalDone:EventEmitter<any>= new EventEmitter();
    nzSelectedIndex:number=0;
    StaffInfo:any=null;
    lstAddress:Array<any>=[];
    HighlightRow:number;
    loading:boolean;
    
    private values$: Subscription;   
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService
    ) {
      
    }

    getAddresses(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT RecordNumber, PrimaryAddress, REPLACE(REPLACE([Description], '<', ''), '>', '') AS [Type],        Address1 +        Case WHEN Address2 <> '' THEN ' ' + Address2 ELSE ' ' END +        Case WHEN Suburb <> '' THEN ' ' + Suburb ELSE ' ' END +        Case WHEN Postcode <> '' THEN ' ' + Postcode ELSE ' ' END As Address FROM NamesAndAddresses WHERE PersonID = '${PersonId}' ORDER BY PrimaryAddress DESC, [Type] ASC`;
               
       
        return this.listS.getlist(sql);
    }
   
    getPhoneContacts(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT RecordNumber, PrimaryPhone, REPLACE(REPLACE([Type], '<', ''), '>', '') AS [Type], Detail FROM PhoneFaxOther WHERE PersonID = '${PersonId}' AND Detail IS NOT Null AND Detail > '' ORDER BY PrimaryPhone DESC, [Type] ASC`;
               
       
        return this.listS.getlist(sql);
    }
    getContactIssue(AccountNo: string): Observable<any> {
        let sql;
        
            sql = `SELECT UniqueID, AccountNo, Award, JobTitle, ContactIssues, Telephone, STF_Notes, FirstName, LastName, UBDMap, UBDRef, Category  FROM Staff WHERE AccountNo = '${AccountNo}'`;
               
       
        return this.listS.getlist(sql);
    }
  
    view(index: number) {
        this.nzSelectedIndex = index;
        console.log(this.AccountNo);
        if (index == 0) {
          //this.router.navigate(['/admin/recipient/personal'])
        }
    }
    handleCancel(){
        this.isVisible=false;
        this.staffexternalDone.emit({
            staffexternal:false
        });
    }

    

    ngOnInit(): void {
        this.values$= this.getContactIssue(this.AccountNo.data).subscribe(data => {
            this.StaffInfo=data;  

        }); 
    }

    ngOnDestroy(): void {

    }
    ngAfterViewInit():void {     


}
 
}
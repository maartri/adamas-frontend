import { Component, OnInit, OnDestroy,AfterViewInit, Input,Output,EventEmitter } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil,switchMap, tap } from 'rxjs/operators';
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
    Person:any={id:'0',code:'',personType:'', noteType:''};
    StaffInfo:any=null;
    lstAddress:Array<any>=[];
    lstphones:Array<any>=[];
    lstNotes:Array<any>=[];
    lstCompetencies:Array<any>=[];
    HighlightRow:number;
    loading:boolean=true;
    fixedColumn :boolean=false;

    private values$: Subscription;   
    private values2$: Subscription;
    private observerable:Observable<any>;

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
        
            sql = `SELECT UniqueID, AccountNo, Award, JobTitle, isnull(ContactIssues,'') as ContactIssues, Telephone, isnull(STF_Notes,'') as STF_Notes, FirstName, LastName, UBDMap, UBDRef, Category  FROM Staff WHERE AccountNo = '${AccountNo}'`;
               
       
        return this.listS.getlist(sql);
    }
  
    
    getNotes(PersonId: string): Observable<any> {
        let sql;
        
            sql = `Select '9900' AS NoteWidth, RecordNumber, PersonID, WhoCode, DetailDate, Detail, ' ' As Blank, AlarmDate, Creator  FROM History WHERE PersonID = '${PersonId}' AND ExtraDetail1 = 'OPNOTE'  AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND DeletedRecord <> 1  ORDER BY DetailDate DESC, RecordNumber DESC`;
               
       
        return this.listS.getlist(sql);
    }
    
    getCompetencies(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT RecordNumber, Name As Competency, Date1 as Expiry_Date, Date2 as Reminder_Date, Recurring AS Mandatory, Address1 , DateInstalled as Completion_Date, Notes FROM HumanResources WHERE PersonID = '${PersonId}' AND [Type] = 'STAFFATTRIBUTE' ORDER BY Name`;
               
       
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
    
        this.observerable = new Observable(observer => {
                this.getContactIssue(this.AccountNo.data)           
            .pipe(
                tap(output => {
                    console.log(output);
                    this.StaffInfo = output[0]; 
                    this.Person.id=output[0].uniqueID;
                    this.Person.code=output[0].accountNo;
                    this.Person.personType="Staff";
                    this.Person.noteType="OPNOTE";           
                }),
                switchMap(output => 
                     forkJoin( 
                        this.getAddresses(output[0].uniqueID),
                        this.getPhoneContacts(output[0].uniqueID),
                        this.getNotes(output[0].uniqueID),
                        this.getCompetencies(output[0].uniqueID)
                    )) ,
                tap(output2 => {
                    console.log(output2);
                    this.lstAddress = output2[0];
                    this.lstphones = output2[1];
                    this.lstNotes = output2[2];
                    this.lstCompetencies = output2[3];
                })
        
        ).subscribe(output2 => console.log( output2))
            
           
         });
         
         this.values$ = this.observerable.subscribe(data=>{
            // this.StaffInfo=data;
           });
           this.loading=false;
        //  this.observerable = new Observable(observer => {
        
        //     setTimeout(() => {
        //     return forkJoin(   
        //         this.getAddresses(this.StaffInfo.uniqueID),
        //         this.getPhoneContacts(this.StaffInfo.uniqueID)
        //     )}, 3000);
            
        //  });
         
        //  this.values2$ = this.observerable.subscribe(data=>{   
        //     this.lstAddress= data[0];
        //     this.lstphones= data[1];
        // }); 
       
  
         
    }

    ngOnDestroy(): void {
      //  this.values$.unsubscribe();
      //  this.values2$.unsubscribe();
    }
    ngAfterViewInit():void {     


}
 
}
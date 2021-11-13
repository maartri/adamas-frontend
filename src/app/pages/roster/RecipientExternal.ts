import { Component, OnInit, OnDestroy, Input,Output,EventEmitter } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil,switchMap, tap } from 'rxjs/operators';

import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { nextDay } from 'date-fns';

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
    templateUrl: './RecipientExternal.html',
    selector:'recipientexternal'
})


export class RecipientExternal implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    @Input() isVisible:boolean=false;
    @Input() AccountNo:any;
    @Output() recipientexternalDone:EventEmitter<any>= new EventEmitter();
    nzSelectedIndex:number=0;
    Info:any=null;
    lstAddress:Array<any>=[];
    lstphones:Array<any>=[];
    lstNotes:Array<any>=[];
    lstNextOfKins:Array<any>=[];
    lstTasks:Array<any>=[];
    lstApprovedProgram:Array<any>=[];
    lstApprovedServices:Array<any>=[];
    lstCarerPlans:Array<any>=[];
    HighlightRow:number;
    loading:boolean=true;
    fixedColumn :boolean=false;

    private values$: Subscription;   
    private values2$: Subscription;
    private observerable:Observable<any>;
    private observerable2:Observable<any>;

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
    getRecipient(AccountNo: string): Observable<any> {
        let sql;
        
            sql = `SELECT UniqueID, AccountNo, [Surname/Organisation], FirstName, Title, Gender, DateOfBirth, AdmissionDate, ContactIssues, SpecialConsiderations, Recipient_Notes, Recipient_COordinator as CoOrdinator, Notes FROM Recipients WHERE AccountNo = '${AccountNo}'`;
               
       
        return this.listS.getlist(sql);
    }
  
    
    getNotes(PersonId: string): Observable<any> {
        let sql;
        
            sql = `Select '9900' AS NoteWidth, RecordNumber, PersonID, WhoCode, DetailDate, Detail, ' ' As Blank, AlarmDate, Creator  FROM History WHERE PersonID = '${PersonId}' AND ExtraDetail1 = 'OPNOTE'  AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND DeletedRecord <> 1  ORDER BY DetailDate DESC, RecordNumber DESC`;
               
       
        return this.listS.getlist(sql);
    }
    
    getNextOfKins(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT HR.RecordNumber, 'LOCAL' AS [Source], HR.State, HR.PersonID, HR.[Group] as [Category], CAST(0 as bit) AS APrimary, UPPER(HR.[Type]) As [Contact_Type], HR.[Name] As [Contact_Name], 'No-one' AS [Connected To], CASE WHEN HR.Phone1 <> '' AND HR.Phone1 IS NOT NULL THEN '(p)' + HR.Phone1 ELSE '' END + CASE WHEN HR.Phone2 <> '' AND HR.Phone2 IS NOT NULL THEN ', (p)' + HR.Phone2 ELSE '' END + CASE WHEN HR.Mobile <> '' AND HR.Mobile IS NOT NULL THEN ', (m)' + HR.Mobile ELSE '' END + CASE WHEN HR.Email <> '' AND HR.Email IS NOT NULL THEN ', (e)' + HR.Email ELSE '' END AS Phones, CASE WHEN HR.Address1 <> '' AND HR.Address1 IS NOT NULL THEN HR.ADDRESS1 ELSE '' END + ' ' + CASE WHEN HR.Address2 <> '' AND HR.Address2 IS NOT NULL THEN HR.ADDRESS2 ELSE '' END + ' ' + CASE WHEN HR.Suburb <> '' AND HR.Suburb IS NOT NULL THEN HR.Suburb ELSE '' END + ' ' + CASE WHEN HR.Postcode <> '' AND HR.Suburb IS NOT NULL THEN HR.Postcode ELSE '' END AS AddressDetails FROM HumanResources HR WHERE PersonID = '${PersonId}' AND (User1 IS NULL OR User1 <> 'IMPORT') AND ([Group] IN ('CONTACT', 'NEXTOFKIN','CARER','1-NEXT OF KIN','2-CARER','3-MEDICAL','4-ALLIED HEALTH','5-HEALTH INSURANCE','6-POWER OF ATTORNEY','7-LEGAL-OTHER','8-OTHER','ALLIED HEALTH','PHARMACIST','HOSPITAL','HEALTHINSURER','POWERATTORNEY','OTHERLEGAL','OTHERCONTACT','MANAGER','HUMAN RESOURCES','ACCOUNTS','PAYROLL','SALES','PURCHASING','OTHERCONTACT') OR [Group] IN (SELECT DESCRIPTION FROM DataDomains WHERE DOMAIN = 'CONTACTGROUP' AND DATASET = 'USER')) ORDER BY [State], Category, [Contact_Type]`;
               
       
        return this.listS.getlist(sql);
    }

    
    getServiceTasks(PersonId: string): Observable<any> {
        let sql;
        
        sql = `SELECT [Service Type] as Service_Type, [Activity Breakdown] FROM ServiceOverview WHERE Personid = '${PersonId}' AND ServiceStatus = 'ACTIVE'`;
        
        return this.listS.getlist(sql);
    }

    
    getCarerPlans(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT Recnum, '' AS NoteWidth, PersonID, PlanNumber, PlanName, PlanCreator, PlanStartDate,            PlanEndDate,        PlanCoPayAmount,             dbo.RTF2Text(PlanDetail) as PlanDetail,       PlanReminderDate,       PlanReminderText  FROM CarePlanItem WHERE PersonID = '${PersonId}' AND DeletedRecord <> 1 ORDER BY PlanStartDate DESC, PlanNumber ASC`;
        
        return this.listS.getlist(sql);
    }
    getApprovedServices(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT RecordNumber, PersonID, [Service Type] AS Activity, [ServiceProgram] AS [Funded_Under] , CASE WHEN Duration = NULL Then ' ' ELSE RTRIM(Cast(Duration AS Char)) + ' ' + 'Hrs ' END + CASE WHEN Frequency = NULL Then ' '  ELSE RTRIM(Cast(Frequency AS Char)) + ' ' END + CASE WHEN Period = NULL Then ' ' ELSE Cast(Period AS Char) END AS [Service_Profile] FROM ServiceOverview WHERE PersonID = '${PersonId}' ORDER BY [Service Type]`;
        
        return this.listS.getlist(sql);
    }

    getApprovedPrograms(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT RecipientPrograms.RecordNumber,        RecipientPrograms.PersonID,        HumanResourceTypes.Type as [Funding_Source],        RecipientPrograms.Program,        RecipientPrograms.ProgramStatus AS [Status],        HumanResourceTypes.Address2 AS CoOrdinator,        CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END +        CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END +        CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END +        CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END +        CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS Details FROM RecipientPrograms INNER JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program WHERE PersonID = '${PersonId}' ORDER BY RecipientPrograms.Program`;
        
        return this.listS.getlist(sql);
    }

    view(index: number) {
        this.nzSelectedIndex = index;
        
        if (index == 0) {
          //this.router.navigate(['/admin/recipient/personal'])
        }else  if (index == 1 ) {
            this.observerable2 =  new Observable(observer => {
            
                    forkJoin( 
                        this.getApprovedPrograms(this.Info.uniqueID),
                        this.getApprovedServices(this.Info.uniqueID),
                        this.getCarerPlans(this.Info.uniqueID)                   
                    ).subscribe(data=>{
                        this.lstApprovedProgram=data[0];
                        this.lstApprovedServices=data[1];
                        this.lstCarerPlans=data[2];
                    })
               
            });

            this.observerable2.subscribe(
                d => {
                    console.log(d);
                   
                },
                err => console.error('Observer got an error: ' + err),
                () => console.log('Observer got a complete notification')
              );

            //  this.observerable2.subscribe(data=>{
            //         console.log(data);
            //         this.lstApprovedProgram=data[0];
            //         this.lstApprovedServices=data[1];
            //         this.lstCarerPlans=data[2];
            //       });
               
            this.loading=false;       
        }
        
    }

    handleCancel(){
        this.isVisible=false;
        this.recipientexternalDone.emit({
            recipientexternal:false
        });
    }
    
    ngOnInit(): void {
 
        this.observerable = new Observable(observer => {
            this.getRecipient(this.AccountNo.data)           
        .pipe(
            tap(output => {
                console.log(output);
                this.Info = output[0];            
            }),
            switchMap(output => 
                 forkJoin( 
                    this.getAddresses(output[0].uniqueID),
                    this.getPhoneContacts(output[0].uniqueID),
                    this.getNotes(output[0].uniqueID),
                    this.getNextOfKins(output[0].uniqueID),
                    this.getServiceTasks(output[0].uniqueID),
                )) ,
            tap(output2 => {
                console.log(output2);
                this.lstAddress = output2[0];
                this.lstphones = output2[1];
                this.lstNotes = output2[2];
                this.lstNextOfKins = output2[3];
                this.lstTasks = output2[4];
            })
        
    
        ).subscribe(output2 => console.log( output2))
       
     });
     
     this.values$ = this.observerable.subscribe(data=>{
        // this.StaffInfo=data;
       });
       this.loading=false;       
    }

    ngOnDestroy(): void {
        

    }

 
}
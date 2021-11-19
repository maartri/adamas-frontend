import { Component, OnInit, OnDestroy, Input,Output,EventEmitter } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil,switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import parseISO from 'date-fns/parseISO'
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { nextDay } from 'date-fns';
import format from 'date-fns/format';
import * as moment from 'moment';

import { SqlWizardService } from '@services/sqlwizard.service';

interface CarePlan{planNumber:number,planName:string,planStartDate:Date,planEndDate:Date,planCoPayAmount:number,planDetail:any};

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
   
    Person:any={id:'0',code:'',personType:'', noteType:''};
    Column:any={key:'',title:''};
   
    nzSelectedIndex:number=0;
    Info:any=null;
    lstAddress:Array<any>=[];
    lstphones:Array<any>=[];
    lstNotes:Array<any>=[];
    lstNextOfKins:Array<any>=[];
    lstTasks:Array<any>=[];
    lstApprovedProgram:Array<any>=[];
    lstApprovedServices:Array<any>=[];
    lstCarerPlanDate:Array<CarePlan>=[];
    lstCarerPlans:Array<any>=[];
    lstCaseNotes:Array<any>=[];
    lstOpNotes:Array<any>=[];
    lstCurrentRosters:Array<any>=[];
    lstPermanentRosters:Array<any>=[];
    
    columnsDefinition:Array<any>=[];    
    item = new Map();
    HighlightRow:number;
    loading:boolean=true;
    fixedColumn :boolean=false;
    date1:Date;
    date2:Date
    dateFormat: string = 'dd/MM/yyyy';
    isCarerPlanVisible:boolean
    selectedPlan:{recnum:0,planNumber:0,planName:'',planStartDate:'2021/01/01',planEndDate:'2021/01/01',planCoPayAmount:0,planDetail:''};
    planNumber:0;
    planName:'';
    planStartDate:Date ;;
    planEndDate:Date ;;
    planCoPayAmount:0;
    planDetail:'';
    edit:boolean=false;
    editCache: { [key: string]: { edit: boolean; data: any } } = {};

    private values$: Subscription;   
    private values2$: Subscription;
    private observerable:Observable<any>;
    private observerable2:Observable<any>;
    private observerable3:Observable<any>;
    private observerable4:Observable<any>;
    
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        public datepipe: DatePipe,
    ) {
        

    }

    showEditModal(i:number){
        this.selectedPlan = this.lstCarerPlans[i];
        
        this.planNumber=this.selectedPlan.planNumber;
        this.planName=this.selectedPlan.planName;
        this.planStartDate = moment(this.selectedPlan.planStartDate,"YYYY-MM-DD").toDate();  
        this.planEndDate=moment(this.selectedPlan.planEndDate,"YYYY-MM-DD").toDate();  
        this.planCoPayAmount=this.selectedPlan.planCoPayAmount;
        this.planDetail=this.selectedPlan.planDetail;

        this.isCarerPlanVisible=true;
       //this.edit=true;
    }
    
    updatePlan(){
        this.edit=false;
        this.isCarerPlanVisible=false;
        
            let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
            
            sql.TableName='CarePlanItem ';
            let frmt="yyyy/MM/dd";
           sql.SetClause=`set  PlanNumber=${this.planNumber}, 
           PlanName='${this.planName}', 
           PlanStartDate='${format(this.planStartDate,frmt) } ',
           PlanEndDate='${format(this.planEndDate,frmt)}',
           PlanCoPayAmount=${this.planCoPayAmount},
           PlanDetail=N'${this.planDetail}'`;

           sql.WhereClause=` WHERE Recnum = ${this.selectedPlan.recnum} `;
       
               this.listS.updatelist(sql).subscribe(data=>{
                   console.log("Plan updated");
                   
                   forkJoin(                   
                    this.getCarerPlans(this.Info.uniqueID)                   
                ).subscribe(d=>{
                  
                    this.lstCarerPlans=d[0];
                  
                })
               });
       
            //    PlanStartDate='${this.planStartDate}',
            //    PlanEndDate='${this.planEndDate}',
    }
    delete(i:number){

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

    getCaseNotes(PersonId: string): Observable<any> {
        let sql;
        
            sql = `Select '" 18225"' AS NoteWidth, RecordNumber, PersonID, WhoCode, DetailDate, Detail, ' ' As Blank, AlarmDate, Creator  FROM History WHERE PersonID = '${PersonId}' AND ExtraDetail1 = 'CASENOTE'  AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND DeletedRecord <> 1  ORDER BY DetailDate DESC, RecordNumber DESC`;
        
        return this.listS.getlist(sql);
    }
    getOperationalNotes(PersonId: string): Observable<any> {
        let sql;
        
            sql = `Select '" 18225"' AS NoteWidth, RecordNumber, PersonID, WhoCode, DetailDate, Detail, ' ' As Blank, AlarmDate, Creator  FROM History WHERE PersonID = '${PersonId}' AND ExtraDetail1 = 'OPNOTE'  AND (([PrivateFlag] = 0) OR ([PrivateFlag] = 1 AND [Creator] = 'sysmgr')) AND DeletedRecord <> 1  ORDER BY DetailDate DESC, RecordNumber DESC`;
        
        return this.listS.getlist(sql);
    }

    getCurrentRosteredStaff(ClientCode: string, d1:string, d2:string): Observable<any> {
        let sql;
        
            sql = `SELECT  [Recordno] As [RecordNumber],  [Client Code] As [Recipient], CONVERT(nVarChar, CAST([date]  + ' ' + [Start Time] AS DATETIME), 103) AS  [Date],[Start Time] As [Start_Time], [Carer Code] As [Staff], (([Duration] * 5)/60) As [Duration], [Service Type] As [Activity], [Anal] As [Analysis], [Program] As [Program], [HACCType] As [Dataset_Type], ([CostQty] * [Unit Pay Rate]) As [Service_Cost] FROM Roster WHERE [Client Code] = '${ClientCode}'  AND [Date] BETWEEN '${d1}' AND '${d2}' ORDER BY YEAR(Date) DESC, MONTH(Date) DESC, DAY(DATE) DESC, [Start Time]`;
        
        return this.listS.getlist(sql);
    }

    getPermenentRosteredStaff(ClientCode: string): Observable<any> {
        let sql;
        
            sql = `SELECT  [Recordno] As [RecordNumber], [Client Code] As [Recipient],  [Date] As [Date],[Start Time] As [Start_Time],  (([Duration] * 5)/60) As [Duration],  [Service Type] As [Activity],  [Carer Code] As [Staff],  [Anal] As [Analysis], [Program] As [Program], [HACCType] As [Dataset_Type],  ([CostQty] * [Unit Pay Rate]) As [Service_Cost] FROM Roster WHERE [Client Code] = '${ClientCode}'  AND [Date] BETWEEN '1900/01/01' AND '1920/12/31' ORDER BY Date, [Start Time]`;
        
        return this.listS.getlist(sql);
    }
 
    
    load_roster(){               
        
            this.getCurrentRosteredStaff( this.Info.accountNo,  format(this.date1,"yyyy/MM/dd"), format(this.date2,"yyyy/MM/dd")            
            ).subscribe(data =>{
                this.lstCurrentRosters=data
            });
    
    }
   
    view(index: number) {
        this.nzSelectedIndex = index;
        
        if (index == 0) {
          //this.router.navigate(['/admin/recipient/personal'])
        }else  if (index == 1 ) {
            this.loading=true;
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

            this.loading=false;       
        }
        else  if (index == 2  ) {
            this.Person.noteType="CASENOTE"
            if(1==1) return;
            this.loading=true;
            this.observerable3 =  new Observable(observer => {
            
                    forkJoin( 
                        this.getCaseNotes(this.Info.uniqueID),
                        this.getOperationalNotes(this.Info.uniqueID)
                                 
                    ).subscribe(data=>{
                        this.lstOpNotes=data[0];
                        this.lstCaseNotes=data[1];
                        this.loading=false;       
                        
                    })
               
            });

            this.observerable3.subscribe(
                d => {
                    console.log(d);
                   
                },
                err => console.error('Observer got an error: ' + err),
                () => console.log('Observer got a complete notification')
              );

         
        }
        else  if (index == 3  ) {
            this.Person.noteType="OPNOTE"
            if(1==1) return;
        
        }else  if (index==4) {
            
            this.loading=true;
            this.date1 = new Date();
            this.date2 = new Date();
            this.planStartDate= new Date();
            this.planEndDate=new Date();
            this.date2.setDate(this.date2.getDate() + 14);
            this.observerable4 =  new Observable(observer => {
                 
                    forkJoin( 
                        this.getPermenentRosteredStaff(this.Info.accountNo),
                        this.getCurrentRosteredStaff( this.Info.accountNo,  format(this.date1,"yyyy/MM/dd"), format(this.date2,"yyyy/MM/dd"))
                                 
                    ).subscribe(data=>{
                        this.lstPermanentRosters=data[0];
                        this.lstCurrentRosters=data[1];
                        this.loading=false;       
                        
                    })
               
               
            });

            this.observerable4.subscribe(
                d => {
                    console.log(d);
                   
                },
                err => console.error('Observer got an error: ' + err),
                () => console.log('Observer got a complete notification')
              );

         
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
                
                this.Person.id=output[0].uniqueID;
                this.Person.code=output[0].accountNo;
                this.Person.personType="Recipient";
                this.Person.noteType="CASENOTE";
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
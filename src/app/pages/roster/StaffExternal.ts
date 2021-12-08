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
    // Person:any={id:'0',code:'', type:''};

    @Output() staffexternalDone:EventEmitter<any>= new EventEmitter();
    nzSelectedIndex:number=0;
    Person:any={id:'0',code:'',personType:'', noteType:''};
    StaffInfo:any=null;
    lstAddress:Array<any>=[];
    lstphones:Array<any>=[];
    lstNotes:Array<any>=[];
    lstCompetencies:Array<any>=[];
    skillsList:Array<any>=[];
    skillsList_ticked:Array<any>=[];
    HighlightRow:number;
    loading:boolean=true;
    fixedColumn :boolean=false;

    ContactIssues:any;   
    Notes:any;
    editNote:boolean=false;

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

    getQualificationSkills_labels(): Observable<any> {
        let sql;
        
            sql = `SELECT *, convert(bit,0) as checked FROM FieldNames WHERE Identifier like 'fStaffContainer9-Competencies%' order by coid`;
               
       
        return this.listS.getlist(sql);
    }
    getQualificationSkills_Status(PersonId: string): Observable<any> {
        let sql;
        
            sql = `SELECT * FROM Staff WHERE UNIQUEID = '${PersonId}'`;
               
       
        return this.listS.getlist(sql);
    }
    view(index: number) {
        this.nzSelectedIndex = index;
        console.log(this.AccountNo);
        if (index == 0) {
          //this.router.navigate(['/admin/recipient/personal'])
        }else if (index==1){
            this.Person.noteType="OPNOTE"
        }else  if (index==3){

           let keys:any; 
           let key='';
           let obj:any;
        for (let i=0; i< this.skillsList.length; i++){            
         
                keys=Object.keys(this.skillsList_ticked[0]);
                obj=this.skillsList_ticked[0];
                for (let j=1; j<100; j++){
                    key=keys[j];
                    if (key.toUpperCase()=='SB'+this.skillsList[i].coid)
                        this.skillsList[i].checked=obj[key]==='True' ? true : false;;
                   
         
            }
        }
        }
    }
    setSkillStatus(i:number,skill:any){
        console.log(skill);
        let sql ="";
        if (!skill.checked)
            sql =" set SB"+skill.coid+  "=1 ";
        else
            sql =" set SB"+skill.coid+  "=0 ";

        this.updateSkill(sql);

        this.skillsList[i].checked=!skill.checked;

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
                        this.getCompetencies(output[0].uniqueID),
                        this.getQualificationSkills_labels(),
                        this.getQualificationSkills_Status(output[0].uniqueID),
                    )) ,
                tap(output2 => {
                    console.log(output2);
                    this.lstAddress = output2[0];
                    this.lstphones = output2[1];                    
                    this.lstCompetencies = output2[2];
                    this.skillsList = output2[3];
                    this.skillsList_ticked = output2[4];
                })
        
        ).subscribe(output2 => console.log( output2))
            
           
         });
         
         this.values$ = this.observerable.subscribe(data=>{
            // this.StaffInfo=data;
           });
           this.loading=false;
        
    }

    ngOnDestroy(): void {
      //  this.values$.unsubscribe();
      //  this.values2$.unsubscribe();
    }
    ngAfterViewInit():void {     

        this.ContactIssues=this.StaffInfo.contactIssues       
        this.Notes=this.StaffInfo.stF_Notes

        
      

}
 updateNotes(){
        
            let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
            
            sql.TableName='Staff ';
          

           sql.SetClause=`set ContactIssues=N'${this.ContactIssues.replace("'","''")}', 
           STF_Notes=N'${this.Notes.replace("'","''")}'`;
          
         
           sql.WhereClause=` WHERE AccountNo = '${this.StaffInfo.accountNo}' `;
       
               this.listS.updatelist(sql).subscribe(data=>{
                   console.log("Notes updated");                             
             
               });
       
           
    }
    updateSkill(setClause:any){
        
        let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        
        sql.TableName='Staff ';
      

       sql.SetClause=setClause;
      

       sql.WhereClause=` WHERE AccountNo = '${this.StaffInfo.accountNo}' `;
   
           this.listS.updatelist(sql).subscribe(data=>{
               console.log("Notes updated");   
               this.getQualificationSkills_Status(this.StaffInfo.uniqueID).subscribe(d=>{
                this.skillsList_ticked=d;
            })                          
         
           });
           
          
       
}
editNotes(){
    this.editNote=true;
}
doneUpdate(){
    this.updateNotes();
    this.editNote=false;
   
}

}
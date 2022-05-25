import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit,Input,Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService, PrintService, TimeSheetService } from '@services/index';

import { NzModalService } from 'ng-zorro-antd';
import { EMPTY } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';

@Component({
  selector: 'roster-extrainfo',
  templateUrl: './rosterextrainfo.html',
  styles: []
})
export class RosterExtraInfo implements OnInit {
  
  @Input() loadExtraInfo: Subject<any>;
  
 
  HighlightRow:number;
  tocken: any;
  userRole: any;
  timeList:Array<any>=[];
  addressList:Array<any>=[]
  mobilityList:Array<any>=[]
  ServiceGroups_list:Array<any>=[];
  transportPurposeList:Array<any>=[];
  currentDate:any;
  today:Date ;
  TransportForm:FormGroup;
  recordNo:string;
  apmtTime:string;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private timeS:TimeSheetService,
    private listS:ListService,   
    private formBuilder: FormBuilder,
   
    ){}
    ngOnInit(): void {
        this.today = new Date();
        this.currentDate = moment(this.today).format('YYYY/MM/DD');
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
      this.buildForm();
      
      this.loadExtraInfo.subscribe(d=>{
        this.loadData(d);
    })    
}
loadData(data:any){
    this.recordNo=data.recordNo;
    this.apmtTime=moment(data.apmtTime).format('HH:mm');
    this.GET_ADDRESS().subscribe(d=>{
        this.addressList=d.map ( x => x.address);             
      
    })

    this.GET_MOBILITY().subscribe(d=>{
        this.mobilityList=d.map ( x => x.description);             
      
    })
    this.GETSERVICEGROUP().subscribe(d=>{
        this.ServiceGroups_list = d.map(x => x.description)
    })

    this.AddTime();    

    this.getTransportPupose()
    this.getFomrData();
}
buildForm(){
    this.TransportForm=this.formBuilder.group({
        
        pickupFrom : [''],
        pickupTo : [''],
        zipCodeFrom: [''],
        zipCodeTo: [''],
        appmtTime: [''],
        mobility: [''],
        returnVehicle: [''],
        startOdo: [''],
        endOddo: [''],
        liveKM: [''],
        deadKM: [''],
        tripPurpose: [''],
        transportNote: ['']        
    });

}
GET_ADDRESS(): Observable<any> {
    let sql;            
   
        sql = `SELECT CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE '' END + CASE WHEN Address2 <> '' THEN Address2 + ''  ELSE '' END + CASE WHEN Suburb <> '' THEN ', ' + Suburb ELSE '' END AS Address, GoogleAddress 
        FROM NamesAndAddresses WHERE  Description = 'DESTINATION'`
        
    if (!sql) return EMPTY;
    return this.listS.getlist(sql);
}
GET_MOBILITY(): Observable<any> {
    let sql;            
   
        sql = `select Description from datadomains where Domain like 'Mobility' and [DeletedRecord]=0`
        
    if (!sql) return EMPTY;
    return this.listS.getlist(sql);
}

GETSERVICEGROUP(): Observable<any>{
        
    // if (this.booking_case==8)
    //     return this.listS.getlist(`SELECT DISTINCT [Name] as Description FROM CSTDAOutlets WHERE [Name] Is NOT Null  AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY [Name]`);
    // else if (this.IsGroupShift){
    //     if (this.GroupShiftCategory=="TRANSPORT" )
    //         return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'VEHICLES' AND Description Is NOT Null  AND (EndDate Is Null OR EndDate >= (select top 1 PayPeriodEndDate from systable)) ORDER BY DESCRIPTION`);
    //     else if (this.GroupShiftCategory=="GROUPBASED" || this.GroupShiftCategory=='GROUPACTIVITY')            
    //         return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'ACTIVITYGROUPS' AND Description Is NOT Null  AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY DESCRIPTION`);
    //     else
    //         return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'ACTIVITYGROUPS' AND Description Is NOT Null AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY DESCRIPTION`);
    // }else
        return this.listS.getlist(`SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'ACTIVITYGROUPS' AND Description Is NOT Null AND (EndDate Is Null OR EndDate >= '${this.currentDate}') ORDER BY DESCRIPTION`);
}
AddTime(interval:number=5){
    for (let h=0; h<24; h++)
        for (let t=0; t<60; t=t+interval)
         this.timeList.push(this.numStr(h) + ":"+ this.numStr(t))
}
numStr(n:number):string {
    let val="" + n;
    if (n<10) val = "0" + n;
    
    return val;
  }
  getTransportPupose(){
    this.transportPurposeList.push('Medical - Dentist');
    this.transportPurposeList.push('Medical - Dialysis');
    this.transportPurposeList.push('Medical - GP/Medical Centre');
    this.transportPurposeList.push('Medical - Hospital');
    this.transportPurposeList.push('Medical - Oncology/Cancer Treatment');
    this.transportPurposeList.push('Medical - Other');
    this.transportPurposeList.push('Medical - Rehabilitation');
    this.transportPurposeList.push('Medical - Specialist');
    this.transportPurposeList.push('Social - Group Outing');
    this.transportPurposeList.push('Social - Independent');
    this.transportPurposeList.push('Social - Visiting Friends and Relatives');
    this.transportPurposeList.push('Shopping/Personal business');
    this.transportPurposeList.push('Education - Assisted School Travel Program');    
    this.transportPurposeList.push('Education — School Vocational');
    this.transportPurposeList.push('Education — Tertiary');
    this.transportPurposeList.push('Access/Community');
    this.transportPurposeList.push('Childcare');
    this.transportPurposeList.push('Day Program');
    this.transportPurposeList.push('Funerals');
    this.transportPurposeList.push('Respite');
    this.transportPurposeList.push('Volunteer Work');
    this.transportPurposeList.push('Work/Work Related Business');


    

  }

  getFomrData(){

      let sql=`select PickUpAddress1 , PUGridRef, DropOffAddress1, DOGridRef , isnull(StartODO,0) as StartODO , isnull(EndOdo,0) as EndOdo,
        isnull(Trip_Kms,0) as Trip_Kms, isnull(Dead_Running_Kms,0) as Dead_Running_Kms , PickUpAddress3 , TripPurpose, DropOffAddress3  ,
        r.notes, time2 as appmtTime
        from TransportDetail t, Roster r
        WHERE t.RosterId=r.RecordNo and RosterID = ${this.recordNo}`

       this.listS.getlist(sql).subscribe(d=>{
        if (d[0]==null) return;
        let tdata= d[0];
        this.TransportForm.reset();
       // this.TransportForm=tdata;
     
       this.addressList.push(tdata.pickUpAddress1);
       this.addressList.push(tdata.dropOffAddress1);
       this.mobilityList.push(tdata.pickUpAddress3);
       this.ServiceGroups_list.push(tdata.dropOffAddress3);
        this.TransportForm.patchValue({
            pickupFrom : tdata.pickUpAddress1, 
            zipCodeFrom : tdata.puGridRef, 
            pickupTo : tdata.dropOffAddress1, 
            zipCodeTo : tdata.doGridRef, 
            startOdo : tdata.startODO, 
            endOddo : tdata.endOdo, 
            liveKM :  tdata.trip_Kms, 
            deadKM :  tdata.dead_Running_Kms, 
            mobility : tdata.pickUpAddress3, 
            tripPurpose : tdata.tripPurpose, 
            returnVehicle : tdata.dropOffAddress3,
            appmtTime:tdata.appmtTime ,
            transportNote: tdata.notes   
        })
      })
  }
Save_Transport(){
    
    const tdata =  this.TransportForm.value;
    
    let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        //INSERT INTO Roster_TaskList (RosterID, TaskID, TaskNotes) VALUES (324249, 4713, '')
      sql.TableName='TransportDetail ';          
      
      sql.SetClause=`  SET PickUpAddress1 = '${tdata.pickupFrom}', 
                       PUGridRef = '${tdata.zipCodeFrom}', 
                       DropOffAddress1 = '${tdata.pickupTo}', 
                       DOGridRef = '${tdata.zipCodeTo}', 
                       StartODO = ${tdata.startOdo}, 
                       EndOdo = ${tdata.endOddo} , 
                       Trip_Kms =  ${tdata.liveKM} , 
                       Dead_Running_Kms = ${tdata.deadKM}, 
                       PickUpAddress3 = '${tdata.mobility}', 
                       TripPurpose = '${tdata.tripPurpose}', 
                       DropOffAddress3 = '${tdata.returnVehicle}'   `;
      
     sql.WhereClause=`WHERE RosterID = ${this.recordNo}`;

    

    this.listS.updatelist(sql).subscribe(data => {
        
            this.globalS.sToast('Success', 'Transport details have been updated');
           
    });

    sql.TableName='Roster ';         
      
    sql.SetClause=`  SET Time2 = '${tdata.appmtTime}',                    
    Notes = '${tdata.transportNote}'   `;    
    sql.WhereClause=`WHERE recordNo = ${this.recordNo}`;

   this.listS.updatelist(sql).subscribe(data => {});      
    
     
    
}

delete() {
    

    let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};          
    sql.TableName=' TransportDetail ';           
    sql.WhereClause=` Where RosterID=${this.recordNo}`;  


  this.listS.deletelist(sql)
    .pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.globalS.sToast('Success', 'Data Deleted!');
        
        return;
      }
    });
  }

}
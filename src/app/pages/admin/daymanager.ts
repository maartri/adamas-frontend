import { Component, OnInit, OnDestroy, Output, Input ,ViewChild, AfterViewInit
     
    } from '@angular/core'
import { GlobalService, ClientService, TimeSheetService,ShareService, ListService } from '@services/index';
import { forkJoin,  Subject ,  Observable } from 'rxjs';
import {ShiftDetail} from '../roster/shiftdetail'
//import {DMRoster} from '../roster/dm-roster'
import { NzModalService } from 'ng-zorro-antd/modal';
import { ThrowStmt } from '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup,FormBuilder,Validators, FormArray, FormControl } from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import parseISO from 'date-fns/parseISO'
import { format, formatDistance, formatRelative, nextDay, subDays } from 'date-fns'
import { forEach } from 'lodash';
import * as moment from 'moment';
import { stringify } from '@angular/compiler/src/util';


class Address {
    postcode: string;
    address: string;
    suburb: string;
    state: string;

    constructor(postcode: string, address: string, suburb: string, state: string) {
        this.suburb = suburb.trim();
        this.address = address;
        this.postcode = postcode;
        this.state = state;
    }

    getAddress() {
        var _address = `${this.address} ${this.suburb} ${this.postcode}`;
        return (_address.split(' ').join('+')).split('/').join('%2F');
    }
}



  
@Component({
    styles: [`
    .dm-input{
        margin-bottom:1rem;
    }
    nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-body{
        padding:0;
    }
    nz-modal.options >>> div div div.ant-modal div.ant-modal-content div.ant-modal-footer{
        padding:0;
    }
    ul{
        list-style: none;
        padding: 5px 0 5px 15px;
        margin: 0;
    }
    li {
        padding: 4px 0 4px 10px;
        font-size: 13px;
        position:relative;
        cursor:pointer;
    }
    li:hover{
        background:#f2f2f2;
    }
    li i {
        float:right;
        margin-right:7px;
    }
    hr{
        border: none;
        height: 1px;
        background: #e5e5e5;
        margin: 2px 0;
    }
    li > ul{
        position: absolute;
        display:none;         
        right: -192px;
        padding: 2px 5px;
        background: #fff;
        top: -6px;
        width: 192px;
        transition: all 0.5s ease 3s;
    }
    li:hover > ul{           
        display:block;
        transition: all 0.5s ease 0s;
    }
    .main-wrapper{
        position: sticky;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        top: -5px;
        border-top: 1px solid #fff;
        color:#000;
        width: 100%;
        text-align: center;    
        background:  linear-gradient(0.25turn, #3f87a6, #a1ddf7, #fafcfc);  
        z-index:2;
    }
    
    .listitem{
        border: 1px solid #fff;
        background-color: #fff;
    }
    
    .resizable {
        background: white;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 100px;
        left: 100px;
      }

      .resizable .resizers{
        width: 100%;
        height: 100%;
        border: 3px solid #4286f4;
      }
      .rectangle{
        margin-top: 10px; 
        padding-top: 10px; 
        padding-left: 5px; 
        border-style:solid; 
        border-width: 2px; 
        border-radius: 5px;  
        border-color: rgb(236, 236, 236);
   }
      
    `],
    templateUrl: './daymanager.html'
})


export class DayManagerAdmin implements OnInit, OnDestroy, AfterViewInit {
    date: any = new Date();
    
    serviceType:string;
    dateFormat:string="dd/MM/YYYY"
    dayView: number = 7;
    dayViewArr: Array<number> = [5, 7, 10, 14];
    //reload: boolean = false;
    reload:Subject<boolean> = new Subject();
    loadingRoster :Subject<any> = new Subject() ;
    applyFilter: Subject<any>= new Subject();
    dmOptions: Subject<any>= new Subject();
    CustomFilters: Array<any> = [];
    toBePasted: Array<any>=[];
    lstStartWith: Array<any>=[];
    branchesList = [];
    activityList = [];
    programsList = [];
    selectedBranches:Array<any>=[];
    selectedPrograms:Array<any>=[];
    selectedActivities:Array<any>=[];
    addInExisting:boolean;
    nzFilterPlaceHolder:string="Input to Search";
    showSimpleFilterInput:boolean;
    @ViewChild(ShiftDetail) detail!:ShiftDetail;
   // @ViewChild(DMRoster) dmroster:DMRoster;
    optionsModal: boolean = false;
    displayOption:boolean=true;
    pastePosition:any;
    recipientDetailsModal: boolean = false;
    changeModalView = new Subject<number>();
    OperationView= new Subject<number>();
    AllocateView= new Subject<number>();
    ViewNudge= new Subject<number>();
    ApproveView= new Subject<number>();
    resourceType:string;
    txtSearch:string;
    openSearchStaffModal:boolean;
    openSearchRecipientModal:boolean;

    booking:{
        recipientCode: 'TT',
        userName:'sysmgr',
        date:'2022/01/01',
        startTime:'07:00',
        endTime:'17:00',
        endLimit:'20:00'
      };
    bookingData = new Subject<any>();
    bookingDataRecipient = new Subject<any>();
    ViewChangeDayTimeModal:boolean;
    AddRosterModel:boolean;
    ViewServiceNoteModal:boolean    
    Person:any={id:'0',code:'',personType:'Recipient', noteType:'SVCNOTE'};
    loadingNote:Subject<any>=new Subject();
    loading:boolean;
    operation:string;
    CaseLoadValue:string;
    ViewCaseLoadModal:boolean
    ViewAllocateResourceModal:boolean;
    ViewAllocateResourceQtyModal:boolean;
    ResourceValue:number;
    InputMode:string='decimal';
    
    size: any = 'large';
    showMenu:boolean;
    LimitTo:string;
    startWith:string;
    

    parserPercent = (value: string) => value.replace(' %', '');
    parserDollar = (value: string) => value.replace('$ ', '');
    parserValue = (value: string) => value;
    formatterDollar = (value: number) => `${value > -1 || !value ? `$ ${value}` : ''}`;
   
    info = {StaffCode:'', ViewType:'',IsMaster:false,date:''}; 
    selectedOption:any;
    rosters:any;
    selectedStaff:string='';
    txtAlertSubject:String;
    txtAlertMessage:String;
    show_alert:Boolean
    Error_Msg:String;
    breachRoster:Boolean;
    record_being_pasted:any;
    AllocateStaffModal:boolean;
    selectedCarer:string;
    selectedRecipient:string;
    NudgeValue=0;
    NudgeStatus:string='Up';
    ViewNudgeModal:boolean;
    serviceActivityList: Array<any>;
    originalList: Array<any>;
    ServiceSetting:any;
    HighlightRow2:number
    isFirstLoad:boolean
    _highlighted: Array<any> = [];
    private address: Array<any> = [];

    ViewRecipientDetails = new Subject<number>();
    ViewDetails= new Subject<number>();
    ViewChangeDayTime= new Subject<number>();
    DateTimeForm:FormGroup;
    durationObject: any;
    today = new Date();
    defaultStartTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8, 0, 0);
    defaultEndTime: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 9, 0, 0);
    selectedPersonType:any ;
    personTypeList:Array<any>=[];
    
    user:any;
    token:any;
    master:boolean=false;
    viewType:string='Staff'
    selected_data:any;
    recipientexternal:boolean;
    staffexternal:boolean;
    ViewAdditionalModal:boolean;
    notes:string="";
    HideW1W2:boolean;
    IncludeDuration:boolean;
    AutoPrviewNote:boolean;
    CustomFilter:boolean;
    ViewExistingFilter:boolean;
    SortOrder:string;
    lstGroup:Array<any>=[];
    viewQuickFilter:boolean;
    AllPrograms:boolean=true;
    AllBranches:boolean=true;
    AllActivities:boolean=true;
    OpenSearchOfStaff:boolean;
    OpenSearchOfRecipient:boolean;

    optionsList = [
      { id: 1, name: 'Hide W1 W2 WKD Display', checked:false },
      { id: 2, name: 'Include Duration in shift Display', checked:false },
      { id: 3, name: 'Auto Preview Notes on click', checked:false },
      { id: 4, name: 'Include Notes in Service Display', checked:false },
      { id: 5, name: 'Include Information Only Services in Worked Hours', checked:false },
      { id: 6, name: 'Recipient Branch Only', checked:false },
      { id: 7, name: 'Include Notes in Service Display', checked:false }
    ];

    optionsList2 = [
        { id: 1, name: 'Booking', checked:false },
        { id: 2, name: 'Direct Care', checked:false },
        { id: 3, name: 'Case Management', checked:false },
        { id: 4, name: 'Transport', checked:false },
        { id: 5, name: 'Facilities', checked:false },
        { id: 6, name: 'Groups', checked:false },
        { id: 7, name: 'Items', checked:false },
        { id: 8, name: 'Unavailable', checked:false },
        { id: 9, name: 'Staff Admin', checked:false },
        { id: 10, name: 'Travel Time', checked:false },
        { id: 11, name: 'Staff Leave', checked:false },
        
      ];
  
    constructor(
        private globalS: GlobalService,
        private clientS: ClientService,
        private timeS:TimeSheetService,
        private modalService: NzModalService,
        private sharedS:ShareService,
        private formBuilder: FormBuilder,
        private listS:ListService
    ) {


        this.ViewRecipientDetails.subscribe(data => {
            this.optionsModal=false;
            if (data==1){
                this.selected_data = {
                    data: this.selectedOption.recipient,
                    code: this.selectedOption.uniqueid,
                    option:1
                }            
                if ((this.selectedOption.recipient=='!MULTIPLE' || this.selectedOption.recipient=='!INTERNAL')){
                    this.globalS.eToast('Day Manager',`No Recipient to view detail!`)
                }else
                    this.recipientexternal = true;
        }else if (data==2){
                this.loadNotes();
               
        }
           
        });

        this.ViewChangeDayTime.subscribe(data => {
            this.optionsModal=false;
             let startTime= this.selectedOption.startTime;
             let endTime= this.selectedOption.endTime;
             let date =this.selectedOption.date;
             this.defaultStartTime = parseISO(new Date(date + " " + startTime).toISOString());
             this.defaultEndTime = parseISO(new Date(date + " " + endTime).toISOString());

            let time:any={startTime:this.defaultStartTime, endTime:this.defaultEndTime}
            this.DateTimeForm.patchValue({
                recordNo: this.selectedOption.recordno,
                rdate: this.selectedOption.date,
                time:time,
                payQty:this.selectedOption.payQty,
                billQty:this.selectedOption.billQty           

            });

           this.ViewChangeDayTimeModal=true;
            
        });

        this.changeModalView.subscribe(data => {

            this.OpenChangeResources(data)
            
        });
    

        
    this.ViewDetails.subscribe(data => {
        // console.log(data);
        this.optionsModal=false;
        if (data==1){                          
            this.selected_data = {
                data: this.selectedOption.recipient,
                code: this.selectedOption.uniqueid,
                option:1
            }            
            if ((this.selectedOption.recipient=='!MULTIPLE' || this.selectedOption.recipient=='!INTERNAL')){
                this.globalS.eToast('Day Manager',`No Recipient to view detail!`)
            }else
                this.recipientexternal = true;
        }else if (data==2){                          
            this.selected_data = {
                data: this.selectedOption.staff,
                code: this.selectedOption.uniqueid,
                option:1
            }            
            if ((this.selectedOption.staff=='!MULTIPLE' || this.selectedOption.staff=='!INTERNAL' || this.selectedOption.staff.trim()=='BOOKED'))
                    this.globalS.eToast('Day Manager',`No Staff to view detail!`)
            else
                this.staffexternal = true;
         }else if (data==3){                          
        
            this.serviceType  =this.selectedOption.activity;                    
            this.defaultStartTime  =this.selectedOption.startTime;
            this.notes=this.selectedOption.notes;
            if (data!=null)
            this.ViewAdditionalModal=true;  
        
        }else if (data==4){          
                this.showDetail(this.selectedOption)   ;             
       
         }
       
        
    });
    this.AllocateView.subscribe(data => {
        // console.log(data);
        this.optionsModal=false;
        if (data==1){ 
            //Un-Allocate staff
            this.UnAllocate();
        }else  if (data==2){ 
            //Re-Allocate staff
            this.AllocateStaffModal=true;
        
        }else  if (data==3){ 
            //Change Date or Time
        }
    });

    
    this.ViewNudge.subscribe(data => {
        this.optionsModal=false;
        if (data==1)
            this.NudgeStatus="Up";
        else
            this.NudgeStatus="Down";

       this.ViewNudgeModal=true;
        
    });


    this.OperationView.subscribe(data => {
        // console.log(data);
        this.optionsModal=false;
        if (data==1){  
            //Copy Operation                        
           
            this.toBePasted.push(this.selectedOption)
            this.operation="Copy"
            
        }else if (data==2){ 
            //Cut Operation                         
          
            this.operation="cut"
            this.toBePasted.push(this.selectedOption)
            
         }else if (data==3){                          
            //Paste Operation
            
            this.optionsModal=false;
            //this.pasting_records();
            this.pasteSelectedRecords(this.pastePosition);

        }else if (data==4){   
            //delete Operation 
            
            this.showConfirm();
            
        }  else if (data==5){          
            this.showConfirm_for_additional()   ;             
        
            }
        
    });

    this.ApproveView.subscribe(data => {
        this.optionsModal=false;
        if (data==1){ 
            this.ApproveUnApprove(true);
         }
        else{
            this.ApproveUnApprove(false);
        }
    });

}
private unsubscribe = new Subject();
buildForm() {
    this.DateTimeForm = this.formBuilder.group({
        recordNo: [''],
        rdate: [''],
        time: this.formBuilder.group({
            startTime:  [''],
            endTime:  [''],
        }),
        payQty: [''],
        billQty: ['']
        
    });

    this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
    this.fixStartTimeDefault();   

    this.DateTimeForm.get('time.startTime').valueChanges.pipe(
        takeUntil(this.unsubscribe)
    ).subscribe(d => {
        
        this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
    });
    this.DateTimeForm.get('time.endTime').valueChanges.pipe(
        takeUntil(this.unsubscribe)
    ).subscribe(d => {
        this.durationObject = this.globalS.computeTimeDATE_FNS(this.defaultStartTime, this.defaultEndTime);
    });
   
}

fixStartTimeDefault() {
    const { time } = this.DateTimeForm.value;
    if (!time.startTime) {
        this.ngModelChangeStart(this.defaultStartTime)
    }

    if (!time.endTime) {
        this.ngModelChangeEnd(this.defaultEndTime)
    }
}

ngModelChangeStart(event): void{
    this.DateTimeForm.patchValue({
        time: {
            startTime: event
        }
    })
}
ngModelChangeEnd(event): void{
    this.DateTimeForm.patchValue({
        time: {
            endTime: event
        }
    })
}
data(event:any){
    console.log(event);
}
pasted(event:any){
}
ApplyQuickFilter(){
    if (!this.AllBranches){
        this.LimitTo="BRANCH LIST"
        this.startWith = JSON.stringify(this.selectedBranches.map(x=>x.title));
        let fltr= this.CustomFilters.find(a => a.key == this.LimitTo && a.value==this.startWith)        
        if (!fltr)
            this.CustomFilters.push({key:this.LimitTo, value:this.startWith});
    }
    if (!this.AllPrograms){
        this.LimitTo="PROGRAM LIST"
        this.startWith = JSON.stringify(this.selectedPrograms.map(x=>x.title));
        let fltr= this.CustomFilters.find(a => a.key == this.LimitTo && a.value==this.startWith)        
        if (!fltr)
            this.CustomFilters.push({key:this.LimitTo, value:this.startWith});
    }
    if (!this.AllActivities){
        this.LimitTo="ACTIVITY LIST"
        this.startWith = JSON.stringify(this.selectedActivities.map(x=>x.title));
        let fltr= this.CustomFilters.find(a => a.key == this.LimitTo && a.value==this.startWith)        
        if (!fltr)
            this.CustomFilters.push({key:this.LimitTo, value:this.startWith});
    }
    this.applyFilter.next(this.CustomFilters);
     this.viewQuickFilter=false;
}
ApplyCustomFilter(){
   
    this.applyFilter.next(this.CustomFilters);
    
}

AddCustomFilter(){
    if (this.addInExisting){
        let fltr= this.CustomFilters.find(a => a.key == this.LimitTo && a.value==this.startWith)        
        if (!fltr)
            this.CustomFilters.push({key:this.LimitTo, value:this.startWith});
    }else{
        this.CustomFilters=[];
        this.CustomFilters.push({key:this.LimitTo, value:this.startWith});
        return;
    } 
   
}
CloseCustomFilter(){
    this.CustomFilter=false;
    
    
}
ViewCustomFilter(){
    this.ViewExistingFilter=true;
    
}


removeCustomFilter(){
    this.CustomFilter=false;   
    this.CustomFilters=[];
    this.applyFilter.next(this.CustomFilters)
}
showCustomFilter(){
    this.SortOrder=this.selectedPersonType;
    this.CustomFilter=!this.CustomFilter;
    this.lstGroup=[];
    this.lstGroup.push('STAFF');
    this.lstGroup.push('STAFF JOB CATEGORY');
    this.lstGroup.push('STAFF TEAM');
    this.lstGroup.push('RECIPIENT');
    this.lstGroup.push('RECIPIENT CATEGORY/REGION');
    this.lstGroup.push('ACTIVITY');
    this.lstGroup.push('PROGRAM');
    this.lstGroup.push('COORDINATOR');
    this.lstGroup.push('SERVICE ORDER/GRID NO');
    switch(this.SortOrder.toUpperCase()){
        case  'RECIPIENT MANAGEMENT':
            this.lstGroup.push('FACILITY');
            this.lstGroup.push('VEHICLE');
            this.lstGroup.push('ACTIVITY GROUP');
            break;
        case  'RECIPIENT MANAGEMENT' :
            this.lstGroup.push('FACILITY');
            this.lstGroup.push('VEHICLE');
            this.lstGroup.push('ACTIVITY GROUP');
            break;
        case "FACILITIES - RECIPIENTS":
             this.lstGroup.push('FACILITY');
             break;
        case  "FACILITIES - STAFF":
            this.lstGroup.push('FACILITY');
            break;
        case "TRANSPORT - RECIPIENTS":
             "TRANSPORT - STAFF"
             this.lstGroup.push('VEHICLE');
             break;
        case "TRANSPORT - STAFF":
            this.lstGroup.push('VEHICLE');
            break;
        case "GROUPS - RECIPIENTS":            
             this.lstGroup.push('ACTIVITY GROUP');
             break;
        case  "GROUPS - STAFF":
            this.lstGroup.push('ACTIVITY GROUP');
            break;  
   
    }
}

FillLimitTo(){
    let sql;
    this.lstStartWith=[];
    this.startWith='';
    this.showSimpleFilterInput=false;
    switch (this.LimitTo.toUpperCase())
    {
        
            case "STAFF":
                this.lstStartWith=[];
                this.nzFilterPlaceHolder="TYPE FIRST PART OF STAFF CODE";
                this.showSimpleFilterInput=true;
                return;
                
            case "RECIPIENT":
                this.nzFilterPlaceHolder="TYPE FIRST PART OF RECIP CODE";
                this.showSimpleFilterInput=true;
                return;
                
            case "STAFF JOB CATEGORY":
                sql=`SELECT UPPER([Description]) as Title FROM DataDomains WHERE [Domain] = 'STAFFGROUP' ORDER BY Description`;
                break;           
            case "STAFF TEAM":
                sql=`SELECT UPPER([Description]) as Title FROM DataDomains WHERE [Domain] = 'STAFFTEAM' ORDER BY Description`;
                break;                       
            case "RECIPIENT CATEGORY/REGION":
                sql=`SELECT UPPER([Description]) as Title FROM DataDomains WHERE [Domain] = 'GROUPAGENCY' ORDER BY Description`;
                break;            
            case "ACTIVITY":
                sql=`SELECT Title FROM ItemTypes WHERE   ProcessClassification = 'OUTPUT'`;
                break;
            case "ACTIVITY GROUP":
                sql=`SELECT UPPER([Description]) as Title FROM DataDomains WHERE [Domain] = 'ACTIVITYGROUPS' ORDER BY Description`;
                break;
            case "FACILITY":
                sql=`SELECT UPPER([Name]) as Title FROM CSTDAOutlets ORDER BY [Name]`;
                break;    
            case "PROGRAM":
                sql=`SELECT UPPER([Name]) as Title FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS'`;
                break;  
            case "COORDINATOR":
                sql=`SELECT UPPER([Description]) as Title FROM DataDomains WHERE [Domain] = 'CASE MANAGERS' ORDER BY Description`;
                break;  
            case "SERVICE ORDER/GRID NO":
                this.nzFilterPlaceHolder="TYPE IN GRID OR ORDER";
                this.showSimpleFilterInput=true;
               
                return;
                  
    }

    this.listS.getlist(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        this.lstStartWith=data;
    });
    
}
ViewQuickFilterDisplay(){
    this.loading=true;
    setTimeout(() =>{
        if ( this.branchesList==null || this.branchesList.length<=0)
            this.FillQuickFilterLists();
        this.loading=false;
        this.viewQuickFilter=true;
    },500)
    
}

FillQuickFilterLists() {
    let sql;
    let sql_branch=`Select Description as title From DataDomains Where Domain = 'BRANCHES'  ORDER BY DESCRIPTION`;
    let sql_Activity=`SELECT Title as title FROM ItemTypes WHERE   ProcessClassification = 'OUTPUT' ORDER BY Title`;
    let sql_program=`SELECT UPPER([Name]) as title FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' ORDER BY [Name]`;
    return forkJoin([
      this.listS.getlist(sql_branch),
      this.listS.getlist(sql_Activity),
      this.listS.getlist(sql_program)
     
    ]).subscribe(x => {
      this.branchesList = x[0];
      this.activityList = x[1];
      this.programsList = x[2];
      
    });
  }

pasteSelectedRecords(event:any){
    console.log(event);
    if (this.toBePasted==null || this.toBePasted==null)    return;     

    if (this._highlighted.length<=0)
        this._highlighted=this.toBePasted;

    // this._highlighted.forEach(function (value) {
    //     //console.log(value);
    //     value.date=moment(event.selected).format('YYYY/MM/DD');
    //     setTimeout(() => {
    //         this.pasting_records(value)                 
    //     }, 100);  
    //   });

    let dmType=event.selected.dmType;
    
    for ( let v of this._highlighted){  
        v.date=moment(event.selected.date).format('YYYY/MM/DD');
        if (dmType=="1" || dmType=="2" || dmType=="11"){
         
            v.carercode = event.selected.carercode;
        }else if (dmType=="10" || dmType=="12" ){
          
            v.recipient = event.selected.carercode;       
         
        }
        setTimeout(() => {
            this.pasting_records(v)                 
        }, 100);   
    }

}
onTextChangeEvent(event:any){
   // console.log(this.txtSearch);
    let value = this.txtSearch.toUpperCase();
    //console.log(this.serviceActivityList[0].description.includes(value));
    this.serviceActivityList=this.originalList.filter(element=>element.description.includes(value));
}

openStaffModal(OpenSearch:boolean=false){

    if (OpenSearch)
     this.OpenSearchOfStaff=OpenSearch;
    
     this.openSearchStaffModal=true;
    
    if (this.selectedOption!=null) //&& !OpenSearch
        this.booking = {
                     recipientCode: this.selectedOption.recipient,
                     userName:this.token.user,
                     date:this.selectedOption.date,
                     startTime:this.selectedOption.startTime,
                     endTime:this.selectedOption.endTime,
                     endLimit:'20:00'
                    };
                
    this.bookingData.next(this.booking) ;               
}
onStaffSearch(data:any){
    this.openSearchStaffModal=false;
    this.selectedStaff=data.accountno;
    if (this.OpenSearchOfStaff){
        this.LimitTo='STAFF';
        this.startWith=data.accountno;
        this.AddCustomFilter();
        this.ApplyCustomFilter();
    }
}

openRecipientModal(OpenSearch:boolean=false){

    if (OpenSearch)
     this.OpenSearchOfRecipient=OpenSearch;
    
     this.openSearchRecipientModal=true;
    
    if (this.selectedOption!=null ) //&& !OpenSearch
        this.booking = {
                     recipientCode: this.selectedOption.recipient,
                     userName:this.token.user,
                     date:this.selectedOption.date,
                     startTime:this.selectedOption.startTime,
                     endTime:this.selectedOption.endTime,
                     endLimit:'20:00'
                    };
                
    this.bookingDataRecipient.next(this.booking) ;               
}
onRecipientSearch(data:any){
    this.openSearchRecipientModal=false;
    this.selectedRecipient=data.accountNo;
    if (this.OpenSearchOfRecipient){
        this.LimitTo='RECIPIENT';
        this.startWith=data.accountNo;
        this.AddCustomFilter();
        this.ApplyCustomFilter();
    }
}
openMenu(){
    this.showMenu=true;
}
menuAction(){
    this.showMenu=false;
    this.dmOptions.next({dmOption1:this.optionsList,dmOption2:this.optionsList2})
    console.log(this.optionsList)
}
change(event:any){

}
loadNotes(){
    this.Person.id=this.selectedOption.recordno;
    this.Person.code=this.selectedOption.recipient;
    this.Person.personType="Recipient";
    this.Person.noteType="SVCNOTE";
    this.ViewServiceNoteModal=true;
    this.loadingNote.next(this.Person);
    }
    
pasting_records(record:any) {
    
        if (record==null) return;

        this.Check_BreachedRosterRules_Paste(this.operation, record).subscribe(d=>{
            
            let res=d;
            if (res.errorValue>0){
               // this.globalS.eToast('Error', res.errorValue +", "+ res.msg);
               //this.addBookingModel=false;
                this.Error_Msg=res.errorValue +", "+ res.msg ;
                this.record_being_pasted=record;
                this.breachRoster=true;
                return; 
            }else{
          
                if (this.operation==="cut"){
                    
                    this.ProcessRoster("Cut",record,record.date);
                    //this.remove_Cells(sheet,this.selectedOption.row,this.selectedOption.col,this.selectedOption.duration)
                }else  
                    this.ProcessRoster("Copy",record,record.date);   
            }
        
        })
       
  }
selected_roster(r:any):any{
    let rst:any;
      
    
    rst = {
        "shiftbookNo": r.recordno,
        "date": r.date,
        "startTime": r.starttime,
        "endTime":    r.endTime,
        "duration": r.duration,
        "durationNumber": r.dayno,
        "recipient": r.recipient,
        "program": r.rprogram,
        "activity": r.activity,
        "payType": {paytype : r.shiftType },   
        "paytype": r.shiftType,  
        "pay": {pay_Unit: r.costUnit,
                pay_Rate: r.payRate,
                quantity: r.payQty,
                position: ''
            },                   
        "bill":  {
                pay_Unit: r.billunit,
                bill_Rate: r.billRate,
                quantity: r.billQty,
                tax: r.taxAmount
            },           
        "approved": '0',
        "billto":r.billto,
        "debtor": r.billto,
        "notes": r.notes,
        "selected": false,
        "serviceType": r.type,
        "recipientCode": r.recipient,            
        "staffCode": r.carercode,  
        "serviceActivity": r.activity,
        "serviceSetting": r.servicesetting,
        "analysisCode": r.analysisCode,
        "serviceTypePortal": "",
        "daymask":r.daymask,       
        "recordNo": r.recordno
        
    }
        
    

return rst;
}   

find_roster(RecordNo:number):any{
    let rst:any;
    for(var r of this.rosters)
   {
            if (r.recordNo == RecordNo){
                rst= r;
                break;
            }
        
    } 
    
    
    rst = {
        "shiftbookNo": r.recordno,
        "date": r.date,
        "startTime": r.startTime,
        "endTime":    r.endTime,
        "duration": r.duration,
        "durationNumber": r.dayno,
        "recipient": r.recipient,
        "program": r.rProgram,
        "activity": r.activity,
        "payType": r.shiftType ,  
        "paytype": r.payType,        
        "pay": {
            pay_Unit: r.costUnit,
            pay_Rate: r.payRate,
            quantity: r.payQty,
            position: ''
        },                   
        "bill":  {
            pay_Unit: r.billunit,
            bill_Rate: r.billRate,
            quantity: r.billQty,
            tax: r.taxPercent
        },           
        "approved": '0',
        "billto":'',
        "debtor": '',
        "notes": r.notes,
        "selected": false,
        "serviceType": r.type,
        "recipientCode": r.recipient,            
        "staffCode": r.carercode,  
        "serviceActivity": r.activity,
        "serviceSetting": r.servicesetting,
        "analysisCode": r.analysisCode,
        "serviceTypePortal": "",
        "recordNo": r.recordno
        
    }
        
    

return rst;
}   
load_rosters(){
    
    this.reload.next(true);
    
}
ngOnInit(): void {
    this.token = this.globalS.decode(); 
    this.buildForm(); 
    this.selectedPersonType ='Staff Management';
    this.setPersonTypes();
    this.FillQuickFilterLists();
}
  

ngAfterViewInit(){
    console.log("ngAfterViewInit");   
     
  }
   
    ngOnDestroy(): void {
       
    }
    Weekday(date:string) : string {

        let dt= new Date(date);
       // return  this.DayOfWeek(dt.toLocaleDateString('en-US', { weekday: 'long' }));
       return  dt.toLocaleDateString('en-US', { weekday: 'short' });
    
    }
    cancelRecipientExternal(value:any){
        this.recipientexternal=value.recipientexternal;
     }
     cancelStaffExternal(value:any){
        this.staffexternal=value.staffexternal;
     }
     SaveAdditionalInfo(notes:string){
        this.notes=notes;
        this.ViewAdditionalModal=false;
        this.ProcessRoster("Additional", this.selectedOption);
       
    }
    showDetail(data: any) {
        
        let rst:any = this.selected_roster(data);
                       
        if (rst!=null)
            this.roster_details(rst);
        
    }
    roster_details(index: any){
        this.optionsModal=false;
        this.detail.isVisible=true;
        this.detail.data=index;
        this.detail.viewType =this.viewType;
        this.detail.editRecord=false;
        this.detail.ngAfterViewInit();
        
    }

    showOptions(data: any) {
        console.log(data);
        if (data.selected.staff==null){
            this.pastePosition=data;
            this.optionsModal = true;
            this.displayOption=false;
            return
        }
        this.displayOption=true;
        this.selectedOption = data.selected; 
        this.selectedStaff=this.selectedOption.staff.trim();
        this.rosters=data.diary;
        var uniqueIds = this._highlighted.reduce((acc, data) => {
            acc.push(data.uniqueid);
            return acc;
        },[]);

        var sss = uniqueIds.length > 0 ? uniqueIds : [this.selectedOption.uniqueid]
    
        this.clientS.gettopaddress(sss)
            .subscribe(data => this.address = data)          

        this.optionsModal = true;
    }

    setPersonTypes(){
        this.personTypeList.push('Unallocated Bookings');
        this.personTypeList.push('------------------------------');
        this.personTypeList.push('Staff Management');
        this.personTypeList.push('------------------------------');
        this.personTypeList.push('Transport Recipients');
        this.personTypeList.push('Transport Staff');
        this.personTypeList.push('Transport Daily Planner');
        this.personTypeList.push('------------------------------');
        this.personTypeList.push('Facilities Recipients');
        this.personTypeList.push('Facilities Staff');
        this.personTypeList.push('------------------------------');
        this.personTypeList.push('Group Recipients');
        this.personTypeList.push('Group Staff');
        this.personTypeList.push('------------------------------');
        this.personTypeList.push('Grp/Trns/Facility- Recipients');
        this.personTypeList.push('Grp/Trns/Facility-Staff');
        this.personTypeList.push('------------------------------');
        this.personTypeList.push('Recipient Management');
         
       }
    personTypeChange(event:any){
        console.log(event);
        let val:string=this.selectedPersonType;
        if (val=='Staff Management' || val.indexOf('Staff')>=0)
            this.viewType='Staff'
        else if (val=='Recipient Management' || val.indexOf('Recipient')>=0)
            this.viewType='Recipient'
       // this.reload.next(true);
       }

    highlighted(data: any) {
        this._highlighted = data;
        this.selectedOption=data[0];
    }

    shiftChanged(value:any){
        
        if (value.show_alert){
            this.showAlertForm('Change');
            this.load_rosters();
        }
     }
     
     showAlertForm(operationDone:string){


        if (operationDone=='Change'){
            if (this.viewType=='Staff'){
                this.txtAlertSubject= 'SHIFT DAY/TIME CHANGE : ';
                this.txtAlertMessage= 'SHIFT TIME CHANGE : \n Date: ' + this.selectedOption.date + '  \n Recipient: ' + this.selectedOption.recipient + '\n'  ,
                //this.clientCode=value.clientCode;      
            
                this.show_alert=true;
            }
        }else if (operationDone=='Add'){
            if (this.viewType=='Staff'){
                //this.current_roster = this.find_roster(parseInt(recordNo));
                let clientCode =this.selectedOption.recipient;
                let date= this.selectedOption.date
                
                this.txtAlertSubject = 'NEW SHIFT ADDED : ' ;
                this.txtAlertMessage = 'NEW SHIFT ADDED : \n' + date + ' : \n'  + clientCode + '\n'  ;
                this.show_alert=true;
               
            }
        }else if (operationDone=='Delete'){
            if (this.viewType=='Staff'){
                    
                let clientCode =this.selectedOption.recipient;
                let date= this.selectedOption.date
                this.txtAlertSubject = 'SHIFT DELETED : ' ;
                this.txtAlertMessage = 'SHIFT DELETED : \n' + date + ' : \n'  + clientCode + '\n'  ;
            
                this.show_alert=true;
            }
        }
     }
     
  
    numStr(n:number):string {
        let val="" + n;
        if (n<10) val = "0" + n;
        
        return val;
      }

      AddRoster(){
        this.info.IsMaster=false;
        this.info.ViewType=this.viewType;
        this.info.StaffCode=this.selectedOption.staff;
        this.info.date=this.selectedOption.date;

          this.optionsModal=false;
          this.AddRosterModel=true;
          
          this.loadingRoster.next(this.info);
         //this.dmroster.info = this.info;
         //this.dmroster.ngAfterViewInit();
      }

     
      ProcessRoster(Option:any, record:any, rdate:string="", start_Time:string=""):any {
        
        
        let dt= new Date(this.date);
        
        let date = dt.getFullYear() + "/" + this.numStr(dt.getMonth()+1) + "/" + this.numStr(dt.getDate());
        if (rdate!=""){
            date=rdate;
        }
        
        let inputs = {
            "opsType": Option,
            "user": this.token.user,
            "recordNo": record.recordno,
            "isMaster": this.master,
            "roster_Date" : record.date,
            "start_Time": record.startTime,
            "carer_code": this.operation=='Re-Allocate' ? this.selectedCarer : record.carercode,
            "recipient_code" :  record.recipient,
            "notes" : this.notes,
            'clientCodes' : record.recipient
        }
        this.timeS.ProcessRoster(inputs).subscribe(data => {        
        //this.deleteRosterModal=false;
            
            let res=data;       
            if (res.errorValue>0){
                this.globalS.eToast('Error', res.errorValue +", "+ res.msg);
                //if( Option=='Copy' ||Option=='Cut')
                    //this.load_rosters();
                return; 
            }
            
            if( Option=='Copy' ||Option=='Cut'){
                this.showAlertForm('Add')
                if (this._highlighted[this._highlighted.length-1].recordno==record.recordno)
                    this.load_rosters();
            }else if (Option=='Delete'){
                this.showAlertForm('Delete')
                if (this._highlighted[this._highlighted.length-1].recordno==record.recordno)
                    this.load_rosters();
                
            }else{
                this.load_rosters();
            }
                
    });
        
}
OpenChangeResources(type :number){
    this.optionsModal=false;
    let msg:string='';
    this.txtSearch='';
    switch(type){
        case 1:
            msg='You are running in administration mode - and have elected to force the dataset reporting code (output type) of all tagged shifts/activities to be changed to an alternative value. This is a utility function and bypasses standard error checking any validation against approved services - are you sure this is what you want to do and you wish to proceed??';    
            this.resourceType='Output';
            break;
        case 2:
            this.resourceType='Program';
            break;
        case 3:
            this.resourceType='Activity';
            break;
        case 4:
            this.resourceType='PayType';
            break;
        case 5:
            this.resourceType='Pay Quantity';
            break;
        case 6:
            this.resourceType='Unit Cost';
            break;
        case 7:
            this.resourceType='Debtor';
            break;
        case 8:
            this.resourceType='Bill Amount';
            break;
        case 9:
            this.resourceType='Bill Quantity';
            break;
        case 10:
            this.resourceType='Dataset Quantity';
            break;
    }
    if (msg=='')
        msg=`You are running in administration mode - and have elected to force the ${this.resourceType.toLowerCase()} of all tagged shifts/activities to be changed to an alternative value. This is a utility function and bypasses standard error checking any validation against approved services - are you sure this is what you want to do and you wish to proceed??`;
           
    this.showConfirm_for_Resources(type,msg);
     
   
}

ProcessChangeResources(type :number){    
  
    if (type>4 && type!=7) {

        this.InputMode = (type==6 || type==8) ? 'decimal' : 'number';
        this.ResourceValue=0;
        this.ViewAllocateResourceQtyModal=true;
        return;

    }
    let inputs={
        resourceType:this.resourceType,
        carerCode : this.selectedOption.staff,
        rDate: this.selectedOption.date,
        recipientCode : this.selectedOption.recipient
    }
    this.timeS.getDayManagerResources(inputs).subscribe(data => {     
        this.serviceActivityList=data;
        this.originalList=data;
        this.ViewAllocateResourceModal=true;;
    });

}
openAllocateResource(){
    this.resourceType="Resource";
    this.txtSearch='';
    let inputs={
        resourceType:'Resource',
        carerCode : this.selectedOption.staff,
        rDate: this.selectedOption.date,
        recipientCode : this.selectedOption.recipient
    }
    this.timeS.getDayManagerResources(inputs).subscribe(data => {     
        this.serviceActivityList=data;
        this.originalList=data;
        this.ViewAllocateResourceModal=true;
    });
    this.optionsModal=false;
   
}
openCaseLoad(){
    this.optionsModal=false;
    this.ViewCaseLoadModal=true;
    

}
onItemSelected(sel: any, i:number): void {
   this.ServiceSetting=sel.description;    
    this.HighlightRow2=i;

}

onItemDbClick(sel:any , i:number) : void {

    this.HighlightRow2=i;
    this.ServiceSetting=sel.description;
    this.SaveAllocateResource();

}

SaveAllocateResource(){
    
    let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        
    sql.TableName='Roster ';          
    
    switch(this.resourceType){ 
    case 'Resource':
        sql.SetClause=`set [ServiceSetting]='${this.ServiceSetting}' `;
        break;
    case 'Output':
        sql.SetClause=`set [HACCType]='${this.ServiceSetting}' `;
        break;
    case 'Program':
        sql.SetClause=`set [Program]='${this.ServiceSetting}' `;
        break;
    case 'Activity':
        sql.SetClause=`set [Service Type]='${this.ServiceSetting}' `;
        break;
    case 'PayType':
         sql.SetClause=` SET [Service Description] = '${this.ServiceSetting}', [Unit Pay Rate] = ISNULL((SELECT TOP 1 Amount FROM ItemTypes it WHERE PROCESSCLASSIFICATION = 'INPUT' AND  it.Title = '${this.ServiceSetting}'),0) `;
         break;
    case 'Debtor':
        sql.SetClause=` SET [BillTo] = '${this.ServiceSetting}' `;
        break;
    case 'Pay Quantity':
        sql.SetClause=` SET [CostQty] = ${this.ResourceValue} `;
        break; 
    case 'Unit Cost':
        sql.SetClause=` SET [Unit Pay Rate] = ${this.ResourceValue} `;
        break;   
    case 'Bill Amount':
        sql.SetClause=` SET  [Unit Bill Rate] = ${this.ResourceValue} `;
        break;   
    case 'Bill Quantity':
        sql.SetClause=` SET  [BillQty] = ${this.ResourceValue} `;
        break;   
    case 'Dataset Quantity':
        sql.SetClause=` SET  [DatasetQty] = ${this.ResourceValue} `;
        break; 
    default :
    
    }    
    
    sql.WhereClause=` where RecordNo=${this.selectedOption.recordno} `;

  

    this.listS.updatelist(sql).subscribe(data=>{
       // this.globalS.sToast("Day Manager","Record Updated Successfully");
        this.ViewAllocateResourceModal=false;
        this.ViewAllocateResourceQtyModal=false;
      //  this.load_rosters();
    });
}
SaveCaseLoad(){
    let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        
    sql.TableName='Roster ';          
    
        sql.SetClause=`set [Shiftname]='${this.CaseLoadValue}' `;
    
   sql.WhereClause=` where RecordNo=${this.selectedOption.recordno} `;

  

    this.listS.updatelist(sql).subscribe(data=>{
       // this.globalS.sToast("Day Manager","Record Updated Successfully");
        this.ViewCaseLoadModal=false;
      //  this.load_rosters();
    });

}
SaveNudgeUpDown(){
    
        let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
            
            sql.TableName='Roster ';          
            if (this.NudgeStatus=="Up")
                sql.SetClause=`set Duration=Duration-${this.NudgeValue}/5`;
            else
                sql.SetClause=`set Duration=Duration+${this.NudgeValue}/5`;

           sql.WhereClause=` where RecordNo=${this.selectedOption.recordno} `;
       
          

    this.listS.updatelist(sql).subscribe(data=>{
        //this.globalS.sToast("Day Manager","Record Updated Successfully");
        this.ViewNudgeModal=false;
        this.load_rosters();
    });
  
}
ApproveUnApprove(Approve:boolean){
    
    let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        
        sql.TableName='Roster ';          
        if (Approve)
            sql.SetClause=`set [status]=2`;
        else
            sql.SetClause=`set [status]=1`;

       sql.WhereClause=` where RecordNo=${this.selectedOption.recordno} `;
   
      

        this.listS.updatelist(sql).subscribe(data=>{
          //  this.globalS.sToast("Day Manager","Record Updated Successfully");
            this.ViewNudgeModal=false;
            this.load_rosters();
        
        });

}

showConfirm_for_Resources(type :number, msg:string): void {
    //var deleteRoster = new this.deleteRoster();
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: msg,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () =>
      new Promise((resolve,reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
       
        this.ProcessChangeResources(type);
      }).catch(() => console.log('Oops errors!'))

      
    });
  }

showConfirm_for_additional(): void {
    //var deleteRoster = new this.deleteRoster();
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Are you sure you want to delete roster notes',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () =>
      new Promise((resolve,reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
        this.deleteAdditionalInfo();
       
      }).catch(() => console.log('Oops errors!'))

      
    });
  }

deleteAdditionalInfo(){
    
    let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        
        sql.TableName='Roster ';          
       
        sql.SetClause=`set notes=null`;

       sql.WhereClause=` where RecordNo=${this.selectedOption.recordno} `;
   
      

        this.listS.updatelist(sql).subscribe(data=>{
            this.globalS.sToast("Day Manager","Record Updated Successfully");
            this.ViewNudgeModal=false;
            this.load_rosters();
        });
}
generate_alert(){
    this.show_alert=false;
    this.notes= this.txtAlertSubject + "\n" + this.txtAlertMessage;
    
    this.ProcessRoster("Alert",this.selectedOption);
}

SaveDayTime(){
    const tvalues= this.DateTimeForm.value;
    let time= format(tvalues.time.startTime,'HH:mm')

        let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
            
            sql.TableName='Roster ';      

           sql.SetClause=`set [date]='${tvalues.rdate}',[start Time]='${time}'
                        ,Duration=${this.durationObject.duration}
                        ,CostQty=${tvalues.payQty}
                        ,BillQty=${tvalues.billQty} `           

           sql.WhereClause=` where RecordNo=${tvalues.recordNo} `;     
          

    this.listS.updatelist(sql).subscribe(data=>{
        this.globalS.sToast("Day Manager","Record Updated Successfully");
        this.ViewChangeDayTimeModal=false;
        this.load_rosters();
    });
    
}
Check_BreachedRosterRules_Paste(action:string, record:any):any{

    let inputs_breach={
        sMode : 'Add', 
        sStaffCode: record.carercode, 
        sClientCode: record.recipient, 
        sProgram: record.rProgram, 
        sDate : record.date, 
        sStartTime :record.startTime, 
        sDuration : record.duration, 
        sActivity : record.activity,
        PasteAction : action=="cut" ? "Cut": "Copy"
    };

    return  this.timeS.Check_BreachedRosterRules(inputs_breach);

    
}

// Check_BreachedRosterRules(){

//     let inputs_breach={
//         sMode : 'Edit', 
//         sStaffCode: this.selectedOption.carerCode, 
//         sClientCode: this.selectedOption.recipient, 
//         sProgram: this.selectedOption.rprogram, 
//         sDate : this.selectedOption.date, 
//         sStartTime :this.selectedOption.startTime, 
//         sDuration : this.selectedOption.duration, 
//         sActivity : this.selectedOption.activity,
//         // sRORecordno : '-', 
//         // sState : '-', 
//         // bEnforceActivityLimits :0, 
//         // bUseAwards:0, 
//         // bDisallowOT :0, 
//         // bDisallowNoBreaks :0, 
//         // bDisallowConflicts :0, 
//         // bForceNote :0, 
//         // sOldDuration : '-', 
//         // sExcludeRecords : '-', 
//         // bSuppressErrorMessages  :0, 
//         // sStatusMsg : '-',
//         // PasteAction :'-'
//     };

//     this.timeS.Check_BreachedRosterRules(inputs_breach).subscribe(data=>{
//         let res=data
//         if (res.errorValue>0){
//            // this.globalS.eToast('Error', res.errorValue +", "+ res.msg);
//            //this.addBookingModel=false;
//             this.Error_Msg=res.errorValue +", "+ res.msg ;
//             this.breachRoster=true;
//             return; 
//         }else{
//             //this.AddRoster_Entry();
//         }
         
//     });
// }

showConfirm(): void {
    //var deleteRoster = new this.deleteRoster();
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Are you sure you want to delete roster',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () =>
      new Promise((resolve,reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
        this.deleteRoster();
       
      }).catch(() => console.log('Oops errors!'))

      
    });
  }

  deleteRoster(){
    for ( let v of this._highlighted){        
        setTimeout(() => {
            this.ProcessRoster("Delete",v);                
        }, 100);   
    }
    
  }
handleCancel(): void{
        this.optionsModal = false;
        this.recipientDetailsModal = false;
}
    
    toMap(){

        if(this.address.length > 0){         

            var adds = this.address.reduce((acc,data) => {
                var { postCode, address1, suburb, state } = data;
                var address = new Address(postCode, address1, suburb, state);
                return acc.concat('/',address.getAddress());                
            }, []);
            console.log(adds)
            console.log(adds.join(''))
                
            //window.open('https://www.google.com/maps/search/?api=1&query=' + encoded,'_blank');
            window.open(`https://www.google.com/maps/dir${adds.join('')}`,'_blank');
            return false;
        }
        this.globalS.eToast('No address found','Error');
    }

    
Cancel_ProceedBreachRoster(){
    this.breachRoster=false;
    if (this.operation=='copy' ||this.operation=='cut'){
        //this.load_rosters();
      //  this.pasting=false;
    }
   // this.isPaused=false;
}
ProceedBreachRoster(){
    this.breachRoster=false;
    if (this.token.role!= "ADMIN USER")
    {
        this.globalS.eToast("Permission Denied","You don't have permission to add conflicting rosters");
        return; 
    }
    if(this.record_being_pasted==null) return;

    if (this.operation==="cut"){
                    
        this.ProcessRoster("Cut",this.record_being_pasted,this.record_being_pasted.date);
        //this.remove_Cells(sheet,this.selectedOption.row,this.selectedOption.col,this.selectedOption.duration)
    }else  
        this.ProcessRoster("Copy",this.record_being_pasted,this.record_being_pasted.date);   

    //this.isPaused=false;

}


UnAllocate(){
    
    if (this.selectedOption==null || this.selectedOption.RecordNo==0) return;
 
     this.ProcessRoster("Un-Allocate", this.selectedOption);
    this.AllocateStaffModal=false;
        //  this.cell_value.type = 1;
        //  var service =this.cell_value.service.split("(")[1];
        //  var text=    "BOOKED (" + service + ")"; 
 
        //  this.draw_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration,this.cell_value.type,this.cell_value.recordNo,text)
    
 
 }
 
reAllocate(){
    if (this.selectedOption==null || this.selectedOption.recordNo==0) return;

    this.ProcessRoster("Re-Allocate", this.selectedOption);
  
    var text=   this.selectedCarer + " (" + this.selectedOption.activity + ")";            
   
    this.AllocateStaffModal=false;

}
reloadVal: boolean = false;
sample:string;
set_reload(reload: boolean){
    
    this.reloadVal = !this.reloadVal;

}
listChange(event: any) {

    if (event == null) {
        this.user = null;
        this.isFirstLoad = false;
        this.sharedS.emitChange(this.user);
        return;
    }

   
      this.selectedCarer=event.accountNo;
     

    this.user = {
        code: event.accountNo,
        id: event.uniqueID,
        view: event.view,
        agencyDefinedGroup: event.agencyDefinedGroup,
        sysmgr: event.sysmgr
    }

    
    if (this.viewType=='Recipient'){
       // this.getPublicHolidyas(this.selectedCarer);

    }
    this.sharedS.emitChange(this.user);
    //this.cd.detectChanges();
}

onItemChecked(data: any, checked: boolean, type:string): void {
    if (type=='Branches'){
        if (checked)
            this.selectedBranches.push(data)
        else           
            this.selectedBranches.splice(this.selectedBranches.indexOf(data),1)
        
    }else if (type=='Program'){
        if (checked)
            this.selectedPrograms.push(data)
        else
            this.selectedPrograms.splice(this.selectedPrograms.indexOf(data),1)    
    }else if (type=='Activity'){
        if (checked)
            this.selectedActivities.push(data)
        else
            this.selectedActivities.splice(this.selectedActivities.indexOf(data),1)    
    }
    //console.log(this.selectedPrograms)
  }

  onAllChecked(checked: boolean, type:string): void {
     if (type=='Branch') {
        if (checked) 
            this.branchesList.forEach(d => {
                this.selectedBranches.push(d)
            });
        else
            this.selectedBranches=[];
     }else if (type=='Program') {
        if (checked) 
            this.programsList.forEach(d => {
                this.selectedPrograms.push(d)
            });
        else
            this.selectedPrograms=[];
     }
    else if (type=='Activity') {
        if (checked) 
            this.activityList.forEach(d => {
                this.selectedActivities.push(d)
            });
        else
            this.selectedActivities=[];
     }
  }
 
}
import { Component, OnInit, OnDestroy, Output, Input ,ViewChild, AfterViewInit
     
    } from '@angular/core'
import { GlobalService, ClientService, TimeSheetService,ShareService } from '@services/index';
import { forkJoin,  Subject ,  Observable } from 'rxjs';
import {ShiftDetail} from '../roster/shiftdetail'

import { NzModalService } from 'ng-zorro-antd/modal';
import { ThrowStmt } from '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';

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
      
    `],
    templateUrl: './daymanager.html'
})


export class DayManagerAdmin implements OnInit, OnDestroy, AfterViewInit {
    date: any = new Date();
    defaultStartTime:string;
    serviceType:string;
    dateFormat:string="dd/MM/YYYY"
    dayView: number = 7;
    dayViewArr: Array<number> = [5, 7, 10, 14];
    //reload: boolean = false;
    reload:Subject<boolean> = new Subject();
    toBePasted: Array<any>;
    @ViewChild(ShiftDetail) detail!:ShiftDetail;

    optionsModal: boolean = false;
    recipientDetailsModal: boolean = false;
    changeModalView = new Subject<number>();
    OperationView= new Subject<number>();
    AllocateView= new Subject<number>();
    
    ViewServiceNoteModal:boolean    
    Person:any={id:'0',code:'',personType:'Recipient', noteType:'SVCNOTE'};
    loadingNote:Subject<any>=new Subject();
    operation:string;
    selectedOption:any;
    rosters:any;
    txtAlertSubject:String;
    txtAlertMessage:String;
    show_alert:Boolean
    Error_Msg:String;
    breachRoster:Boolean;
    AllocateStaffModal:boolean;
    selectedCarer:string;
    isFirstLoad:boolean
    _highlighted: Array<any> = [];
    private address: Array<any> = [];

    ViewRecipientDetails = new Subject<number>();
    ViewDetails= new Subject<number>();
    user:any;
    token:any;
    master:boolean=false;
    viewType:string='Staff'
    selected_data:any;
    recipientexternal:boolean;
    staffexternal:boolean;
    ViewAdditionalModal:boolean;
    notes:string="";

    constructor(
        private globalS: GlobalService,
        private clientS: ClientService,
        private timeS:TimeSheetService,
        private modalService: NzModalService,
        private sharedS:ShareService
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

        this.changeModalView.subscribe(data => {
            console.log(data);
            
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
    
    this.OperationView.subscribe(data => {
        // console.log(data);
        this.optionsModal=false;
        if (data==1){  
            //Copy Operation                        
           
           // this.toBePasted.push(this.selectedOption)
            this.operation="Copy"
            
        }else if (data==2){ 
            //Cut Operation                         
          
            this.operation="cut"
           // this.toBePasted.push(this.selectedOption)
            
    }else if (data==3){                          
        //Paste Operation
        
        this.optionsModal=false;
        this.pasting_records(); 
    }else if (data==4){   
        //delete Operation 
        
        this.showConfirm();
          
    }
        
    });

}

loadNotes(){
    this.Person.id=this.selectedOption.uniqueid;
    this.Person.code=this.selectedOption.recipient;
    this.Person.personType="Recipient";
    this.Person.noteType="SVCNOTE";
    this.ViewServiceNoteModal=true;
    this.loadingNote.next(this.Person);
    }
    
pasting_records() {
    if (this.selectedOption==null || this.selectedOption==null)    return;
        
       
        this.Check_BreachedRosterRules_Paste(this.operation).subscribe(d=>{
            
            let res=d;
            if (res.errorValue>0){
               // this.globalS.eToast('Error', res.errorValue +", "+ res.msg);
               //this.addBookingModel=false;
                this.Error_Msg=res.errorValue +", "+ res.msg ;
                this.breachRoster=true;
                return; 
            }else{
          
                if (this.operation==="cut"){
                    
                    this.ProcessRoster("Cut",this.selectedOption.recordno,this.selectedOption.date);
                    //this.remove_Cells(sheet,this.selectedOption.row,this.selectedOption.col,this.selectedOption.duration)
                }else  
                    this.ProcessRoster("Copy",this.selectedOption.recordno,this.selectedOption.date);   
            }
        
        })
       
  }
selected_roster(r:any):any{
    let rst:any;
      
    
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
        "payType": {paytype : r.shiftType },   
        "paytype": r.shiftType,   
             
        "pay": {pay_Unit: r.billunit,
                pay_Rate: '0',
                quantity: r.payQty,
                position: ''
            },                   
        "bill":  {
                pay_Unit: r.billunit,
                bill_Rate: r.billRate,
                quantity: r.billQty,
                tax: '0'
            },           
        "approved": '0',
        "billto":r.billTo,
        "debtor": r.billTo,
        "notes": r.notes,
        "selected": false,
        "serviceType": r.type,
        "recipientCode": r.recipient,            
        "staffCode": r.carercode,  
        "serviceActivity": r.activity,
        "serviceSetting": r['setting/Location'],
        "analysisCode": r['recipientCategory/Region'],
        "serviceTypePortal": "",
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
        "pay": {pay_Unit: r.billunit,
                pay_Rate: '0',
                quantity: r.payQty,
                position: ''
            },                   
        "bill":  {
                pay_Unit: r.billunit,
                bill_Rate: r.billRate,
                quantity: r.billQty,
                tax: '0'
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
        "serviceSetting": r['setting/Location'],
        "analysisCode": r['recipientCategory/Region'],
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
        
        //this.ProcessRoster("Additional", this.cell_value.recordNo);
       
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
        this.detail.viewType ='Staff'
        this.detail.editRecord=false;
        this.detail.ngAfterViewInit();
        
    }

    showOptions(data: any) {
        console.log(data);
        this.selectedOption = data.selected; 
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

    highlighted(data: any) {
        this._highlighted = data;
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
     
    data(data: any) {

    }

    pasted(data: any) {

    }
    numStr(n:number):string {
        let val="" + n;
        if (n<10) val = "0" + n;
        
        return val;
      }
    ProcessRoster(Option:any, recordNo:string, rdate:string="", start_Time:string=""):any {
        
        
        let dt= new Date(this.date);
        
        let date = dt.getFullYear() + "/" + this.numStr(dt.getMonth()+1) + "/" + this.numStr(dt.getDate());
        if (rdate!=""){
            date=rdate;
        }
        
        let inputs = {
            "opsType": Option,
            "user": this.token.user,
            "recordNo": recordNo,
            "isMaster": this.master,
            "roster_Date" : date,
            "start_Time": this.selectedOption.startTime,
            "carer_code": this.operation='Re-Allocate' ? this.selectedCarer : this.selectedOption.staff,
            "recipient_code" :  this.selectedOption.recipient,
            "notes" : this.notes,
            'clientCodes' : this.selectedOption.recipient
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
            this.load_rosters();
            if( Option=='Copy' ||Option=='Cut'){
                this.showAlertForm('Add')
               
            }else if (Option=='Delete'){
                this.showAlertForm('Delete')
                
                
            }
                
    });
        
}

generate_alert(){
    this.show_alert=false;
    this.notes= this.txtAlertSubject + "\n" + this.txtAlertMessage;
    
    this.ProcessRoster("Alert","1");
}

Check_BreachedRosterRules_Paste(action:string):any{

    let inputs_breach={
        sMode : 'Add', 
        sStaffCode: this.selectedOption.carercode, 
        sClientCode: this.selectedOption.recipient, 
        sProgram: this.selectedOption.rProgram, 
        sDate : this.selectedOption.date, 
        sStartTime :this.selectedOption.startTime, 
        sDuration : this.selectedOption.duration, 
        sActivity : this.selectedOption.activity,
        PasteAction : action=="cut" ? "Cut": "Copy"
    };

    return  this.timeS.Check_BreachedRosterRules(inputs_breach);

    
}
Check_BreachedRosterRules(){

    let inputs_breach={
        sMode : 'Edit', 
        sStaffCode: this.selectedOption.carerCode, 
        sClientCode: this.selectedOption.recipient, 
        sProgram: this.selectedOption.rprogram, 
        sDate : this.selectedOption.date, 
        sStartTime :this.selectedOption.startTime, 
        sDuration : this.selectedOption.duration, 
        sActivity : this.selectedOption.activity,
        // sRORecordno : '-', 
        // sState : '-', 
        // bEnforceActivityLimits :0, 
        // bUseAwards:0, 
        // bDisallowOT :0, 
        // bDisallowNoBreaks :0, 
        // bDisallowConflicts :0, 
        // bForceNote :0, 
        // sOldDuration : '-', 
        // sExcludeRecords : '-', 
        // bSuppressErrorMessages  :0, 
        // sStatusMsg : '-',
        // PasteAction :'-'
    };

    this.timeS.Check_BreachedRosterRules(inputs_breach).subscribe(data=>{
        let res=data
        if (res.errorValue>0){
           // this.globalS.eToast('Error', res.errorValue +", "+ res.msg);
           //this.addBookingModel=false;
            this.Error_Msg=res.errorValue +", "+ res.msg ;
            this.breachRoster=true;
            return; 
        }else{
            //this.AddRoster_Entry();
        }
         
    });
}

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
    this.ProcessRoster("Delete",this.selectedOption.recordno);
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
    
    
    if (this.operation=='copy' ||this.operation=='cut'){
        // if (this.operation=="cut"){
        //     this.ProcessRoster("Cut",this.current_roster.recordNo,this.rDate);
        //     this.remove_Cells(sheet,this.selectedOption.row,this.selectedOption.col,this.selectedOption.duration)
        // }else
        //     this.ProcessRoster("Copy",this.current_roster.recordNo,this.rDate);  
        //this.pasting=false;
        //this.Pasting_Records(this.selected_Cell,this.sel)
    }else{
       // this.AddRoster_Entry();
    }

    //this.isPaused=false;

}

UnAllocate(){
    
    if (this.selectedOption==null || this.selectedOption.RecordNo==0) return;
 
     this.ProcessRoster("Un-Allocate", this.selectedOption.recordno);
    this.AllocateStaffModal=false;
        //  this.cell_value.type = 1;
        //  var service =this.cell_value.service.split("(")[1];
        //  var text=    "BOOKED (" + service + ")"; 
 
        //  this.draw_Cells(sheet,this.cell_value.row,this.cell_value.col,this.cell_value.duration,this.cell_value.type,this.cell_value.recordNo,text)
    
 
 }
 
reAllocate(){
    if (this.selectedOption==null || this.selectedOption.recordNo==0) return;

    this.ProcessRoster("Re-Allocate", this.selectedOption.recordno);
  
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


}
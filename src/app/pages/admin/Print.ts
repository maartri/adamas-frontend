import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService ,MenuService,PrintService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService,NzModalRef } from 'ng-zorro-antd/modal';
import { Router, ActivatedRoute } from '@angular/router';
import format from 'date-fns/format';
/*
const inputFormDefault = {
  Printtype : ['Summary Sheet'],
  ShowModal: false,
  Addresslbl : false,
  sheet : false,
  IDlbl : false,  
   NameContactDetail: [false],
   FNameHeader : [true],
   ContactIssues : [true],
   TimesheetAlert : [true],
   RosterAlert : [true],
   Occupational_Saftey : [true],
   Reminder_Reviews  : [true],
   Consents : [false],
   ApprovedFundingSummary : [true],
   ApprovedServiceSummary : [true],
   GoalsofCare : [true],
   showstrategies: [false],
   CarePlan : [true],
   ServiceOverview : [true],
   AddlNotes: [false],
   txtAddlNotes: '',
   ServiceContent : [false],
   Roster : [true],
   AddlInfo  : [false],
   CaseSummary : [false],
   DemographicSummary : [false],
   ClinicalSummary : [true],
   NursingDiag : [false],
   MedicalDiag : [false],
   MedicalProcedures : [false],
   Medications : [false],
   ClinicalNotes: [false],
   LoanItems  : [true],
   Will_Legal : [false],
   Insurance_Pension : [false],
   MiscNotes : [false],
   OPNotes : [true],
   AccInfo : [true],
   CaseProgressNotes : [false],
   CaseAgencyStaff : [false],    
   HidePhoto : [false],
   HidePhones : [false],
   HideAddress : [false],
   HideGenderDOB : [false],
   OtherContacts: [false],
    
   CaseNotesDate  : [false],
    
  SvcOvrPrintSeppg : [false],
  SvcOvrDisplay  : [false],
   fontsize: [false],
   Sepratepg: [false],
   SheetSig : [false],
   pgSignature  : [false],
   logo  : [false],
   hideRosterActivity  : [false],
   hideRosterDuration: [false],
   SummarySfooter : [false],

  

  Roster_inclusion : ['Presentation - with Activity'],
  Roster_staffinclusion : ['Show Staff Code'],
  Cycles : ['Cycle 1'],
  DayNames : ['Monday'],
  fDays: ['7'],      
}
 */
const inputFormDefault = {
  Printtype : ['Summary Sheet'],
  ShowModal: false,
  Addresslbl : false,
  sheet : false,
  IDlbl : false,  
   NameContactDetail: [false],
   FNameHeader : [false],
   ContactIssues : [false],
   TimesheetAlert : [false],
   RosterAlert : [false],
   Occupational_Saftey : [false],
   Reminder_Reviews  : [false],
   Consents : [false],
   ApprovedFundingSummary : [false],
   ApprovedServiceSummary : [false],
   GoalsofCare : [false],
   showstrategies: [false],
   CarePlan : [false],
   ServiceOverview : [false],
   AddlNotes: [false],
   txtAddlNotes: '',
   ServiceContent : [false],
   Roster : [false],
   AddlInfo  : [false],
   CaseSummary : [false],
   DemographicSummary : [false],
   ClinicalSummary : [false],
   NursingDiag : [false],
   MedicalDiag : [false],
   MedicalProcedures : [false],
   Medications : [false],
   ClinicalNotes: [false],
   LoanItems  : [false],
   Will_Legal : [false],
   Insurance_Pension : [false],
   MiscNotes : [false],
   OPNotes : [false],
   AccInfo : [false],
   CaseProgressNotes : [false],
   CaseAgencyStaff : [false],    
   HidePhoto : [false],
   HidePhones : [false],
   HideAddress : [false],
   HideGenderDOB : [false],
   OtherContacts: [false],
    
   CaseNotesDate  : [false],
    
  SvcOvrPrintSeppg : [false],
  SvcOvrDisplay  : [false],
   fontsize: [false],
   Sepratepg: [false],
   SheetSig : [false],
   pgSignature  : [false],
   logo  : [false],
   hideRosterActivity  : [false],
   hideRosterDuration: [false],
   SummarySfooter : [false],  
  Roster_inclusion : ['Presentation - with Activity'],
  Roster_staffinclusion : ['Show Staff Code'],
  Cycles : ['Cycle 1'],
  DayNames : ['Monday'],
  fDays: ['7'],      
}
@Component({
 
  templateUrl: './Print.html',
   
  styles: [`
  .spinner{
    margin:1rem auto;
    width:1px;
    }
    div > div >div >label{
      margin:5px;
    }
    .divborder{
      border-style : solid;
      border-color : rgb (89,89,89);
      border-width : 1px;
      margin:5px;
          
    }
    div > div >div > nz-select {
      margin:5px;
    }
    .label{   
        font-weight: bold;  
    }
    div > div >div > nz-date-picker {
      margin:5px;
    }
    .footerleft{
      align-content: left;
      text-align: left;
      vertical-align: center;
    }
    
  `]
})
 
export class PrintComponent implements OnInit , OnDestroy {

                      


    Printtype: Array<any> = ['Address Label','ID Label','Summary Sheet'];
    Roster_inclusion: Array<any> = ['Presentation - with Activity', 'Presentation - with No Activity', 'Detail'];
    Roster_staffinclusion: Array<any> =['Show Staff Code','Show Staff First Name', 'Show Staff Preferred' ,'Show Staff #'];
    Cycles: Array<any> = ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7', 'Cycle 8', 'Cycle 9', 'Cycle 10'];
    DayNames: Array<any> = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    fDays : Array<any> = ['7','14','21','28',];

    loading: boolean = false;
    ShowModal: boolean;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    modalVariables:any;
    inputVariables:any;
    title:string ;
    width :string;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;  
    SummarySfooter  : boolean;
    dateFormat: string ='dd/MM/yyyy';
    Renddate: Date;
    Rstartdate: Date;
    OPenddate: Date;
    OPstartdate: Date;
    Penddate: Date;
    Pstartdate: Date;
    check : boolean = false;
    userRole:string="userrole";
    Addresslbl : boolean;
    sheet : boolean;
    IDlbl : boolean;

    
    
     
    rpthttp = 'https://www.mark3nidad.com:5488/api/report';
    temp_title: any;
  
  
    constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,               
    private http: HttpClient,
    private fb: FormBuilder,     
    private ModalS: NzModalService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private printS : PrintService,
     
    ){}
    ngOnInit(): void {
        this.inputForm = this.fb.group(inputFormDefault);
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
         
         
        this.cd.detectChanges();

        this.formatfilter();

        var date = new Date();
        let temp = new Date(date.getFullYear(), date.getMonth(), 1);
        let temp1 = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        this.Rstartdate = temp;
        this.Renddate = temp1; 
        this.Pstartdate = temp;
        this.Penddate = temp1; 
        this.OPstartdate = temp;
        this.OPenddate = temp1; 

        
    }
    ngOnDestroy(): void {}
     
    handleCancel() {
      
    //  console.log("cancel clicked")
      this.ShowModal = false;
      this.router.navigate(['/admin/recipient/personal'])
    }
    handleCancelTop(){
     
      
    //  this.ShowModal = false;
      this.drawerVisible = false;
      this.pdfTitle = ""
    //  this.router.navigate(['/admin/recipient/personal'])
    }
    handleOk(){
      this.tryDoctype = "";
      this.ReportRender();
    //  this.ShowModal = false;

    }
    Afterclose(){
      console.log("after close")
      this.Printtype = ['SELECT FORMAT']
    }
    formatfilter(){
      if(this.globalS.var1.toString() != null && this.globalS.var1.toString() != ""){
      //  console.log(this.globalS.var1.toString())
      this.ModalS.confirm({
        nzTitle: 'TRACCS',
        nzContent: 'What do you want to Print?',
        nzOkText:'Print Labels',
        nzCancelText:'Summary Sheet',

        
        nzOnOk: () => {
          this.ModalS.confirm({
            nzTitle: 'TRACCS',
            nzContent: 'Select Type of Label you want to Print?',
            nzOkText:'ID Labels',
            nzCancelText:'Address Labels',
    
            
            nzOnOk: () => {
              this.IDlbl = true;
              this.title = 'Print ID Label';
              this.width = "500px";
              this.ShowModal = true;
               },
            nzOnCancel: () => {
              this.Addresslbl = true;
              this.title = 'Print Address Label'
              this.width = "500px";
              this.ShowModal = true; 
                 
            },
            
    
          });
           },
        nzOnCancel: () => {
          this.sheet = true;
          this.title = 'Print Summary Sheet'
          this.width = "900px";
          this.SummarySfooter = true;
          this.ShowModal = true;  
           
             
        },
        

      });
    }else{
      this.ModalS.error({
        nzTitle: 'TRACCS',
        nzContent: 'Select Recipient to Run Print Sheet',
        nzOnOk: () => {
          this.router.navigate(['/admin/recipient/personal'])
                 },
      });
    }
    /*   
      if(this.inputForm.value.Printtype == "Address Label" ){
        this.Addresslbl = true;
        this.title = 'Print Address Label'
        this.ShowModal = true; 
      }
      else if(this.inputForm.value.Printtype == "ID Label"){
        this.IDlbl = true;
        this.title = 'Print ID Label'
        this.ShowModal = true;
         

      }
      else if (this.inputForm.value.Printtype == "Summary Sheet")      
      {
        this.sheet = true;
        this.title = 'Print Summary Sheet'
        this.ShowModal = true;
        
      }else{
        this.sheet = true;
        this.title = 'Print Summary Sheet'
        this.ShowModal = true;
        }
      */
    }
    ReportRender(){
      
      var id,rptfile , tempsdate, tempedate,cycleendate,temp1,temp2;
      var Pstrdate, Pendate, OPstrdate, OPendate, Rstrdate, Rendate = '';
      var cyclestrdate  ;
    
      if(this.sheet == true){
      id = "PDg8Im0vdY"
      rptfile = "Summary Sheet.pdf"
     }else if(this.IDlbl == true){
      id = "EySbkXfUp"
      rptfile = "ID Labels.pdf"
     }else if(this.Addresslbl = true){
      id = "vH_09LTqhx"
      rptfile ="Address Labels.pdf"
     }
     
     
      var Title = "Summary Sheet" 
       if(this.inputForm.value.FNameHeader == true){
      //  Title = Title + this.globalS.var1.toString() + " "  +this.globalS.var2.toString()
       }
          //    console.log(this.tocken.user)

          if(id == "PDg8Im0vdY"){
            var date = new Date();
     
          //  if(this.inputForm.value.CaseProgressNotes == true){
              if (this.Pstartdate != null) { Pstrdate = format(this.Pstartdate, 'yyyy/MM/dd') } 
              else {                     
               Pstrdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy/MM/dd')}
              if (this.Penddate != null) { Pendate = format(this.Penddate, 'yyyy/MM/dd') } 
              else {       
                   Pendate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy/MM/dd');}
         
          //  }

          //  if(this.inputForm.value.OPNotes == true){
              if (this.OPstartdate != null) { OPstrdate = format(this.OPstartdate, 'yyyy/MM/dd') } 
              else {                     
               OPstrdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy/MM/dd')}
              if (this.OPenddate != null) { OPendate = format(this.OPenddate, 'yyyy/MM/dd') } 
              else {       
                   OPendate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy/MM/dd');}
           
          //  }

          //  if(this.inputForm.value.Roster == true){  
              if (this.Rstartdate != null) { Rstrdate = format(this.Rstartdate, 'yyyy/MM/dd') } 
              else {                     
                Rstrdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy/MM/dd')}
              if (this.Renddate != null) { Rendate = format(this.Renddate, 'yyyy/MM/dd') } 
              else {       
                Rendate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy/MM/dd');}
         
          //  }
           



          //  if(this.inputForm.value.ServiceOverview == true){

              switch (this.inputForm.value.Cycles.toString()) {
                case 'Cycle 1':
                    temp1 = "1900/01/01";                    
                     
                    break;
                case "Cycle 2":
                  temp1 = "1900/10/01";
                  
                    break;
                case 'Cycle 3':
                  temp1 = "1901/04/01";
                  
                    break;
                case 'Cycle 4':
                  temp1 = "1901/07/01";
                   
                    break;
                case 'Cycle 5':
                  temp1 = "1902/09/01";
                   
                    break;

                case 'Cycle 6':
                  temp1 = "1902/12/01";
                   
                    break;
                case 'Cycle 7':
                  temp1 = "1903/06/01";
                   
                    break;
                case 'Cycle 8':
                  temp1 = "1904/02/01";
                  
                    break;
                case 'Cycle 9':
                  temp1 = "1904/08/01";
                   
                    break;
                case 'Cycle 10':
                  temp1 = "1905/05/01";
                  
                    break;
                default:
                  temp1 = "1900/01/01";
                   

                    break;
                }
                let cyclestrdate =  new Date(temp1)
                let enddate =  new Date(temp1)
                switch (this.inputForm.value.fDays.toString()) {
                  case '14':
                    temp2 = enddate.setDate(14)
                    break;
                  case '21':
                    temp2 = enddate.setDate(21)
                    break;
                  case '28':
                    temp2 = enddate.setDate(28)
                    break;            
                  default:
                    temp2 = enddate.setDate(7)
                    break;
                } 
                    let cycleendate =  new Date(temp2) 

          //  }


            //  console.log(Pstrdate, Pendate, OPstrdate, OPendate, Rstrdate, Rendate)
            //  console.log(format(cyclestrdate,'yyyy/MM/dd'), format(cycleendate,'yyyy/MM/dd'))






            const data = {
      
              "template": { "shortid": id },
                          
              "options": {
                  "reports": { "save": false },
                  //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
                   
                   
                  "userid": this.tocken.user,
                  "txtTitle": Title,
                   "txtid":this.globalS.var1.toString(),
                   "txtacc":this.globalS.var2.toString(),

                   "inclNameContact": this.inputForm.value.NameContactDetail,
                   "inclContactIssues": this.inputForm.value.ContactIssues,
                   "InclOtherContacts": this.inputForm.value.OtherContacts,
                   "InclTimesheet": this.inputForm.value.TimesheetAlert,
                   "InclRosterAlertS": this.inputForm.value.RosterAlert,
                   "InclOHSSheet": this.inputForm.value.Occupational_Saftey,
                   "InclReminderSheet": this.inputForm.value.Reminder_Reviews,
                   "InclConsentSheet": this.inputForm.value.Consents,
                   "InclFundingSSheet": this.inputForm.value.ApprovedFundingSummary,
                   "InclServiseSSheet": this.inputForm.value.ApprovedServiceSummary,
                   "InclGoalsSheet": this.inputForm.value.GoalsofCare,
                   "InclCarePlanS": this.inputForm.value.CarePlan,
                   "InclServiceOverview": this.inputForm.value.ServiceOverview,
                   "InclServiceContentS": this.inputForm.value.ServiceContent,
                   
                   "InclRosterSheet": this.inputForm.value.Roster,
                   "RosterSheetFormat": this.inputForm.value.Roster_inclusion.toString(),
                   "InclAddlRosterInfo": this.inputForm.value.AddlInfo,

                   "InclCaseSSheet": this.inputForm.value.CaseSummary,
                   "InclDemographicS": this.inputForm.value.DemographicSummary,
                   "InclClinicalS": this.inputForm.value.ClinicalSummary,
                   
                   "InclClinicalNotes": this.inputForm.value.ClinicalNotes,
                   "InclNursingDiag": this.inputForm.value.NursingDiag,
                   "InclMadicalDiag": this.inputForm.value.MedicalDiag,
                   "InclMadicalProcedure": this.inputForm.value.MedicalProcedures,
                   "InclMadication": this.inputForm.value.Medications,

                   "InclLoanItems": this.inputForm.value.loanitems,
                   "InclLegalInfoS": this.inputForm.value.Will_Legal,
                   "InclPensionS": this.inputForm.value.Insurance_Pension,
                   "InclNotesSheet": this.inputForm.value.MiscNotes,
                   "InclOPNotesS": this.inputForm.value.OPNotes,
                   "InclAgencyStaffS": this.inputForm.value.CaseAgencyStaff,
                   "InclProresNotes": this.inputForm.value.CaseProgressNotes,
                   "InclAccountInfo": this.inputForm.value.AccInfo,

                   "InclAddlNotes": this.inputForm.value.AddlNotes,
                   "txtInclAddlNotes": this.inputForm.value.txtAddlNotes,
                   "RosterSDate": Rstrdate,
                   "RosterEDate": Rendate,

                   "OPNotesSDate": OPstrdate,
                   "OPNotesEDate": OPendate,
    
                   "PrgsNotesSDate":Pstrdate ,
                   "PrgsNotesEDate": Pendate ,
 
                   "PresentationFormat":this.inputForm.value.Roster_inclusion,
                   "StaffInclusion":this.inputForm.value.Roster_staffinclusion,

                   "cycleSDate":format(cyclestrdate,'yyyy/MM/dd'),
                   "cycleEDate":format(cycleendate,'yyyy/MM/dd'),
                   //"days":this.inputForm.value.fDays,
                   //"dayname":this.inputForm.value.DayNames,
                   "pagefooter" : this.inputForm.value.pgSignature,
                   "Sheetfooter" : this.inputForm.value.SheetSig,
                   "CoLogo" : this.inputForm.value.logo,

                   "SvcPrintSepPg" : this.inputForm.value.SvcOvrPrintSeppg  ,
                   "SvcDisplayContribution" : this.inputForm.value.SvcOvrDisplay   ,
                   "NameinHeader" : this.inputForm.value.FNameHeader
               

                  
              }
          }
          this.loading = true;
          
  
          this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = rptfile;
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
            console.log(err);
            this.loading = false;
            this.ModalS.error({
                nzTitle: 'TRACCS',
                nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                nzOnOk: () => {
                    this.drawerVisible = false;
                },
            });
        });

        return;

          }else{
            const data = {
      
              "template": { "shortid": id },
                          
              "options": {
                  "reports": { "save": false },
                  //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
                   
                   
                  "userid": this.tocken.user,
                  "txtTitle": Title,
                   "txtid":this.globalS.var1.toString(),
                   "txtacc":this.globalS.var2.toString(),
                  
                  
              }
          }
          this.loading = true;
  
          this.printS.print(data).subscribe((blob: any) => {
            this.pdfTitle = rptfile;
            this.drawerVisible = true;                   
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            this.cd.detectChanges();
        }, err => {
            console.log(err);
            this.loading = false;
            this.ModalS.error({
                nzTitle: 'TRACCS',
                nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                nzOnOk: () => {
                    this.drawerVisible = false;
                },
            });
        });

        return;
          }


          
      
 
    }
   
} //main

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService ,MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService,NzModalRef } from 'ng-zorro-antd/modal';
import { Router, ActivatedRoute } from '@angular/router';
 

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
   CarePlans : [false],
   CaseNotesDate  : [false],
   chkbxRoster   : [false],
   Serviceoverview : [false],
   fontsize: [false],
    
  

}
 
@Component({
 
  templateUrl: './Print.html',
  host: {
    '[style.display]': 'flex',
    '[style.flex-direction]': 'column',
    '[style.overflow]': 'hidden'
},
  styles: [`
  .spinner{
    margin:1rem auto;
    width:1px;
}
    
  `]
})
 
export class PrintComponent implements OnInit , OnDestroy {

                      


    Printtype: Array<any> = ['Address Label','ID Label','Summary Sheet'];
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
    dateFormat: string ='dd/MM/yyyy';
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
     
    ){}
    ngOnInit(): void {
        this.inputForm = this.fb.group(inputFormDefault);
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
         
         
        this.cd.detectChanges();

        this.formatfilter();

        
    }
    ngOnDestroy(): void {}
     
    handleCancel() {
      
      console.log("cancel clicked")
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
      var id,rptfile;
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
          //    console.log(this.tocken.user)
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
                       

                      
                  }
              }
              this.loading = true;
      
              const headerDict = {
      
                  'Content-Type': 'application/json',
                  'Accept': 'application/json', 
                  'Content-Disposition': 'inline;filename=XYZ.pdf'
                  //'Content-Disposition': 'ContentDisposition(hello)',
                  //'filename':'fname.pdf',            
               //   (),
                  
                  
              }
      
              const requestOptions = {
                  headers: new HttpHeaders(headerDict),
                  
                  credentials: true,
                 
                  
              };
      
              //this.rpthttp
              this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers,  responseType: 'blob', })
                  .subscribe((blob: any) => {
                      console.log(blob);
      
                      let _blob: Blob = blob;
      
                      let fileURL = URL.createObjectURL(_blob)//+'#toolbar=1';
                      this.pdfTitle = rptfile;
      
                      this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                      
                      this.loading = false;
      
                  }, err => {
                      console.log(err);
                      this.ModalS.error({
                          nzTitle: 'TRACCS',
      nzContent: 'The report has encountered the error and needs to close (' + err + ')',
                          nzOnOk: () => {
                                   this.drawerVisible = false;
                                   },
                        });
                  }); this.drawerVisible = true;
      


      


//        console.log(fQuery)
      //  console.log(this.inputForm.value.printaslabel)
      
      
  
      

    }
   
} //main

import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl,FormArray, } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { ListService, states } from '@services/index';
import * as FileSaver from 'file-saver';

const inputFormDefault = {
    statesArr: [[]],
    allState: [true],

    branchesArr: [[]],
    allBranches: [true],

    serviceRegionsArr: [[]],
    allServiceRegion:[true],

    managersArr: [[]],
    allManager: [true]
}

@Component({
    host: {
        '[style.display]': 'flex',
        '[style.flex-direction]': 'column',
        '[style.overflow]': 'hidden'
      },
    styles: [`
        button {
            width: 200pt !important;
            text-align: left !important
        }
        .form-group label{
            font-weight: 300;
        }
        nz-select{
            width:100%;
        }
        label.checks{
            margin-top: 4px;
        }
    `],
    templateUrl: './reports.html'
})


export class ReportsAdmin implements OnInit, OnDestroy, AfterViewInit {
    validateForm!: FormGroup;
    isVisibleTop = false;
    checked = true;
    State = true;
    Branches = true;
    Area = true;
    Managers = true;
    Funder = true;
    ProviderID = true;
    listOfControl: Array<{ id: number; controlInstance: string }> = [];
    manager: String[]; form: FormGroup;

    

    BRData = [
      { id: 1, name: 'Sydney' },
      { id: 2, name: 'Perth' },
      { id: 3, name: 'WA' },
      { id: 4, name: 'SA' }
    ];
  
    get BRFormArray() {
      return this.form.controls.BR as FormArray;
    }

    // Instantiate Array Containers - MARK

    statesArr: Array<any> = states;
    branchesArr: Array<any> = [];
    serviceRegionsArr: Array<any> = [];
    managersArr: Array<any> = [];
    fundersArr: Array<any> = [];
    fundingRegionsArr: Array<any> = [];
    
    dropDownArray: any = {
        branches: Array,
        serviceRegions: Array,
        managers: Array
    }

    inputForm: FormGroup;
    drawerVisible: boolean = false;
    // END - MARK

    listOfOption: Array<{ label: string; value: string }> = [];
    multipleValue = ['a10', 'c12'];
 

    constructor(
        private formBuilder: FormBuilder,
        private listS: ListService,
        private http: HttpClient,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer
    ) {
        this.form = this.formBuilder.group({
            BR: new FormArray([])
          });

        this.addCheckboxes();

       
    }

    private addCheckboxes() {
        this.BRData.forEach(() => this.BRFormArray.push(new FormControl(false)));
      }
    
      submit() {
        const BRName = this.form.value.BR
          .map((checked, i) => checked ? this.BRData[i].id : null)
          .filter(v => v !== null);
        console.log(BRName);
    }

    ngOnInit(): void {
        const children: Array<{ label: string; value: string }> = [];

        for (let i = 10; i < 36; i++) {
            children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
        }

        this.listOfOption = children;

        this.inputForm = this.fb.group(inputFormDefault);

        this.inputForm.get('allState').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                statesArr: []
            });
        });

        this.inputForm.get('allBranches').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                branchesArr: []
            });
        });

        this.inputForm.get('allServiceRegion').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                serviceRegionsArr: []
            });
        });

        this.inputForm.get('allManager').valueChanges.subscribe(data => {
            this.inputForm.patchValue({
                managersArr: []
            });
        });
    }

    hello(data: any){
        console.log(data)
        console.log(this.inputForm.value.branchesArr)
    }

    ngAfterViewInit(): void {

        this.listS.getreportcriterialist({
            listType: 'BRANCHES',
            includeInactive: false
        }).subscribe(x => this.branchesArr = x);


        this.listS.getreportcriterialist({
            listType: 'SERVICEREGIONS',
            includeInactive: false
        }).subscribe(x => this.serviceRegionsArr = x )

        this.listS.getreportcriterialist({
            listType: 'MANAGERS',
            includeInactive: false
        }).subscribe(x => this.managersArr = x)

        this.listS.getreportcriterialist({
            listType: 'FUNDERS',
            includeInactive: false
        }).subscribe(x => this.fundersArr = x)
   
        this.listS.getreportcriterialist({
            listType: 'FUNDINGREGIONS',
            includeInactive: false
        }).subscribe(x => this.fundingRegionsArr = x)
    }

    ngOnDestroy(): void {
        console.log('on destroy');
    }
    
    showModal(){
        this.isVisibleTop = true;
    }

    handleOkTop() {
        console.log(this.inputForm.value)
        this.isVisibleTop = false;
        this.goJSReport();

    }

    handleCancelTop(): void {
        this.inputForm.reset(inputFormDefault);
        this.isVisibleTop = false;
        this.drawerVisible = false;
    }

    go() {
        // var tab: any = window.open('/api/clientreport/invoice-download');

        // tab.location = 'http://localhost:5000/api/clientreport/invoice';
        // tab.focus();
        var data = {
            CompanyName: 'Mark'
        }

        let tab: Window = window.open('', '_target');
        tab.document.write("Generating PDF...this can take awhile...")

        this.http.post('/api/clientreport/invoice', data, { responseType: 'blob', reportProgress: true }).subscribe(blob => {
            let data = window.URL.createObjectURL(blob);
            tab.location.href = data;
            tab.focus();
        });

 

        // this.http.post('/api/clientreport/staff-listing', data, { responseType: 'blob', reportProgress: true }).subscribe(blob => {
            // let data = window.URL.createObjectURL(blob);
            // let link = document.createElement('a');
            // link.href = data;
            // link.download = 'filename.pdf';
            // link.click();

            // setTimeout(() => {
            //     window.URL.revokeObjectURL(data);
            // }, 100);
        // }, err => {
          
        // })
    }
    tryDoctype: any;
    pdfTitle: string;

    goJSReport(){

        this.drawerVisible = true;

        const data =    {
            "template": {  "_id":"zrBLd931LZblcnNH"  },    
            "options": {
                "reports": { "save": false },
                "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
            }
        }

 
        const headerDict = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',            
        }
          
        const requestOptions = {
            headers: new HttpHeaders(headerDict)
        };

        this.http.post('http://localhost:5488/api/report', JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);
                
                // let data = window.URL.createObjectURL(blob);
                // let link = document.createElement('a');
                // link.href = data;

                
                // link.download = 'filename.pdf';
                // link.click();
                // setTimeout(() => {
                //     window.URL.revokeObjectURL(data);
                // }, 100);
                
                let _blob: Blob = blob;
                //FileSaver.saveAs(_blob , 'filename.pdf');
                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = "Reports.pdf"
                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

            }, err => {
                console.log(err);
            });

        /* 
        const data =    {
            "template": {  "shortid":"rkJTnK2ce"  },
            "data" : {
                "number": "123",
                "seller": {
                    "name": "Next Step Webs, Inc.",
                    "road": "12345 Sunny Road",
                    "country": "Sunnyville, TX 12345"
                },
                "buyer": {
                    "name": "Acme Corp.",
                    "road": "16 Johnson Road",
                    "country": "Paris, France 8060"
                },
                "items": [{
                    "name": "Website design",
                    "price": 300
                }]
            },
            "options": { "reports": { "save": true } }
         }
 
        const headerDict = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // 'Access-Control-Allow-Headers': 'Content-Type',
          }
          
        const requestOptions = {
            headers: new HttpHeaders(headerDict)
        };

        this.http.post('http://localhost:5488/api/report', JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' }).subscribe(blob => {
            let data = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.href = data;
            link.download = 'filename.pdf';
            link.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(data);
            }, 100);
        }, err => {
            console.log(err)
        });
    */
    }        
}
import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl,FormArray, } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';

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
    `],
    templateUrl: './reports.html'
})


export class ReportsAdmin implements OnInit, OnDestroy {
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

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient
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

    }

    ngOnDestroy(): void {

    }showModal(){
        
        this.isVisibleTop = true;                
    }
  handleOkTop() {
    
    this.isVisibleTop = false;
    this.goJSReport();
  }

  handleCancelTop(): void {
    this.isVisibleTop = false;
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

    goJSReport(){
        const data =    {
            "template": {  "shortid":"nkCzm5R"  },    
            "options": { "reports": { "save": true } }
         }
 
        const headerDict = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',            
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
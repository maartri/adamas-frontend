import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';

@Component({
    styles: [`
        ul{
            list-style:none;
        }
        li{
            padding:5px;
        }
    `],
    templateUrl: './reports.html'
})


export class ReportsAdmin implements OnInit, OnDestroy {

    constructor(
        private http: HttpClient
    ) {
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

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
            "template": {  "_id": "Ytn4HC6Slzi8OyWI"  },
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
            console.log('err')
        });
    }
}
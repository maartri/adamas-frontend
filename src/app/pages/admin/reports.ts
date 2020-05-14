import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
        var tab: any = window.open('/api/clientreport/invoice');

        // tab.location = 'http://localhost:5000/api/clientreport/invoice';
        // tab.focus();

        // this.http.get('https://localhost:5000/api/sample/data').subscribe(data => {
        //     tab.location = 'https://localhost:5000/api/sample/invoice';
        //     tab.focus();
        // }, err => {
        //     tab.close();
        // })
    }
}
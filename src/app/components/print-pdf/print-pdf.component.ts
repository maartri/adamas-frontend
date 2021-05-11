import { ChangeDetectorRef, Input,Component, OnInit } from '@angular/core';
import { GlobalService } from '@services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-print-pdf',
  templateUrl: './print-pdf.component.html',
  styleUrls: ['./print-pdf.component.css']
})
export class PrintPdfComponent implements OnInit {

  @Input()  reportData: string;
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  loading: boolean = false;
  whereString: string ;
  constructor(
    private globalS: GlobalService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService
    ){}
    

  ngOnInit(): void {
    this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
  }

  handleOkTop() {
    this.generatePdf();
    this.tryDoctype = ""
    this.pdfTitle = ""
  }
  
  handleCancelTop(): void {
    this.drawerVisible = false;
    this.pdfTitle = ""
  }
  generatePdf(){
    this.drawerVisible = true;
    
    this.loading = true;
    
    var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,CONVERT(varchar, [enddate],105) as Field3 from DataDomains "+this.whereString+" Domain='CONTACTGROUP'";
    
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    const requestOptions = {
      headers: new HttpHeaders(headerDict)
    };
    
    const data = this.reportData
    
    this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
    .subscribe((blob: any) => {
      let _blob: Blob = blob;
      let fileURL = URL.createObjectURL(_blob);
      this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
      this.loading = false;
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
    this.loading = true;
    this.tryDoctype = "";
    this.pdfTitle = "";
  }
}

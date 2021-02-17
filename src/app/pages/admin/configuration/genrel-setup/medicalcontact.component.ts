import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-medicalcontact',
  templateUrl: './medicalcontact.component.html',
  styles: []
})
export class MedicalcontactComponent implements OnInit {
  
  tableData: Array<any>;
  medicaltype:Array<any>;
  loading: boolean = false;
  dateFormat: string = 'dd/MM/yyyy';
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Medical Contact Details"
  modalVariables: any;
  inputVariables:any;
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND";
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private listS:ListService,
    private menuS:MenuService,
    private switchS:SwitchService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService
    ){}
    
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.buildForm();
      // this.tableData = [{type:"GF",name:"mr beechtrr",address1:"TEST1",address2:"TEST2",phone1:"test3",phone2:"wa",fax:"wa",mobile:"wa",email:"wa@mIL.COM",date:"10-13-2020",}];
      this.loading = false;
      this.loadData();
      this.cd.detectChanges();
    }
    loadTitle()
    {
      return this.title
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "WHERE";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(DataDomains.DeletedRecord, 0) = 0 AND";
        this.loadData();
      }
    }
    activateDomain(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activeDomain(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Activated!');
          this.loadData();
          return;
        }
      });
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        type:'',
        name:'',
        address1:'',
        address2:'',
        suburb:'',
        phone1:'',
        phone2:'',
        fax:'',
        mobile:'',
        email:'',
        date:'',
        recordNumber:null,
      });
    }
    loadData(){
      
      this.medicaltype = ['GP','GENERAL PRACTITIONER'];
      
      
      let sql ="SELECT * FROM HumanResourceTypes Where ISNULL(HumanResourceTypes.DeletedRecord, 0) = 0 AND [Group] like '3-Medical'";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        console.log(this.tableData);
        this.loading = false;
      });
    }
    showAddModal() {
      this.title = "Add Medical Contact Detail"
      this.resetModal();
      this.modalOpen = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      // debugger;
      this.title = "Edit Medical Contact Detail"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      
      const { 
        type,
        name,
        address1,
        address2,
        suburb,
        phone1,
        phone2,
        fax,
        mobile,
        email,
        date,
        recordNumber,
      } = this.tableData[index];
      this.inputForm.patchValue({
        type:type,
        name:name,
        address1: address1,
        address2: address2,
        suburb: suburb,
        phone1:phone1,
        phone2:phone2,
        fax:fax,
        mobile:mobile,
        email:email,
        date:date,
        recordNumber:recordNumber,
      });
      
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    save() {
      this.postLoading = true;     
      
      if(!this.isUpdate){       
        const group = this.inputForm;
        let type     = group.get('type').value;
        let name     = group.get('name').value;
        let address1 = group.get('address1').value;
        let address2 = group.get('address2').value;
        let suburb   = group.get('suburb').value;
        let phone1   = group.get('phone1').value;
        let phone2   = group.get('phone2').value;
        let fax      = group.get('fax').value;
        let mobile   = group.get('mobile').value;
        let email    = group.get('email').value;
        let date     = group.get('date').value;
        let postcode = ''; 
        let values = "3-Medical"+"','"+type+"','"+name+"','"+address1+"','"+address2+"','"+suburb+"','"+postcode+"','"+phone1+"','"+phone2+"','"+fax+"','"+mobile+"','"+email+"','"+'2020-11-18';
        let sql = "insert into HumanResourceTypes([Group],[Type],[Name],[Address1],[Address2],Suburb, Postcode,Phone1,Phone2,Fax,Mobile,email,EndDate) Values ('"+values+"')";
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          // this.globalS.sToast('Unsuccess', 'not saved' + data);
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal();
        });
      }else{
        const group = this.inputForm;
        let type     = group.get('type').value;
        let name     = group.get('name').value;
        let address1 = group.get('address1').value;
        let address2 = group.get('address2').value;
        let suburb   = group.get('suburb').value;
        let phone1   = group.get('phone1').value;
        let phone2   = group.get('phone2').value;
        let fax      = group.get('fax').value;
        let mobile   = group.get('mobile').value;
        let email    = group.get('email').value;
        let date     = (group.get('date').value) ? this.globalS.convertDbDate(group.get('date').value) : '';
        let postcode = '';
        let recordnumber = group.get('recordNumber').value;
        let values = "3-Medical"+"','"+type+"','"+name+"','"+address1+"','"+address2+"','"+suburb+"','"+postcode+"','"+phone1+"','"+phone2+"','"+fax+"','"+mobile+"','"+email+"','"+'2020-11-18';
        let sql  = "Update HumanResourceTypes SET [Group]='3-Medical',[Type] = '"+ type+ "',[Name] = '"+ name+ "',[Address1] = '"+ address1+ "',[Address2] = '"+ address2+ "',[Suburb] = '"+ suburb+ "',[Postcode] = '"+ postcode+ "',[Phone1] = '"+ phone1+ "',[Phone2] = '"+ phone2+ "',[Fax] = '"+ fax+ "',[Mobile] = '"+ mobile + "',[EMail] = '"+ '' + "',[EndDate] = '"+ '' + "' WHERE [RecordNumber] ='"+recordnumber+"'";
        console.log(sql);
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          
          this.postLoading = false;      
          this.loadData();
          this.handleCancel();
          this.resetModal();   
          this.isUpdate = false; 
        });
        console.log(group.get('recordNumber').value);
        
        
      }
    }
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deletemedicalContacts(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY recordNumber) AS Field1,[Name] as Field2,[Type] as Field3,[Address1] as Field4,[phone1] as Field5,[Fax] as Field6,CONVERT(varchar, [enddate],105) as Field7 from HumanResourceTypes  Where ISNULL(HumanResourceTypes.DeletedRecord, 0) = 0 AND [Group] like '3-Medical'";
      
      const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
      
      const requestOptions = {
        headers: new HttpHeaders(headerDict)
      };
      
      const data = {
        "template": { "_id": "0RYYxAkMCftBE9jc" },
        "options": {
          "reports": { "save": false },
          "txtTitle": "Medical Contact List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Name",
          "head3" : "Type",
          "head4" : "Address",
          "head5" : "Phone",
          "head6" : "Fax",
          "head7" : "Date",
        }
      }
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
  
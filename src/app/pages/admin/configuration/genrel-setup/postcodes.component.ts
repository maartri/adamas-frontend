import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-postcodes',
  templateUrl: './postcodes.component.html',
  styles: []
})
export class PostcodesComponent implements OnInit {
  
  tableData: Array<any>;
  states:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Postcode";
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report'
  token:any;
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;  
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DeletedRecord, 0) = 0 ";
  
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
      this.userRole = this.tocken.role;
      this.buildForm();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    loadTitle()
    {
      return this.title
    }
    fetchAll(e){
      if(e.target.checked){
        this.whereString = "";
        this.loadData();
      }else{
        this.whereString = "Where ISNULL(DeletedRecord, 0) = 0 ";
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
    loadData(){
      let sql ="SELECT ROW_NUMBER() OVER(ORDER BY Suburb) AS row_num, Recnum, [Suburb] as subrub, [State] as state, [Postcode] as postcode,DeletedRecord as is_deleted FROM Pcodes "+this.whereString+" Order By Suburb desc ";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        this.loading = false;
      });
      this.states = ['NSW','NT','QLD','SA','TAS','VIC','WA','ACT'];
    }
    showAddModal() {
      this.title = "Add New Postcode";
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
      this.title = "Edit Postcodes"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        postcode,
        subrub,
        state,
        recnum,
      } = this.tableData[index];
      this.inputForm.patchValue({
        postcode: postcode,
        suburb:subrub,
        state:state,
        Recnum:recnum,
      });
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    save() {
      
      if(!this.isUpdate){        
        this.postLoading = true;   
        const group  = this.inputForm;
        let suburb   = this.globalS.isValueNull(group.get('suburb').value);
        let state    = this.globalS.isValueNull(group.get('state').value);
        let postcode = this.globalS.isValueNull(group.get('postcode').value);
        let values = suburb+","+postcode+","+state;
        let sql = "insert into Pcodes (Suburb,Postcode,State) Values ("+values+")";
        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Saved successful');     
          else
          this.globalS.sToast('Success', 'Saved successful');
          this.loadData();
          this.postLoading = false;          
          this.handleCancel();
          this.resetModal();
        });
      }else{
        const group = this.inputForm;
        let suburb   = this.globalS.isValueNull(group.get('suburb').value);
        let state    = this.globalS.isValueNull(group.get('state').value);
        let postcode = this.globalS.isValueNull(group.get('postcode').value);
        let Recnum   = group.get('Recnum').value;
        let sql  = "Update Pcodes SET [Suburb] = "+ suburb+ ",[Postcode] = "+ postcode+ ",[State] = "+ state + " WHERE [Recnum] ='"+Recnum+"'";
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
      }
    }
    
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deletepostcodeslist(data.recnum)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }
    activepostcode(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activatepostcodeslist(data.recnum)
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
        postcode:'',
        suburb:'',
        state:'',
        Recnum:null,
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
      
      var fQuery = "SELECT SELECT ROW_NUMBER() OVER(ORDER BY Suburb) AS Field1,[Suburb] as Field2, [State] as Field3, [Postcode] as Field4 FROM Pcodes "+this.whereString+" Order By Suburb desc";
      
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
          "txtTitle": "Postcodes List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Suburb",
          "head3" : "State",
          "head4" : "Postcode",
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
  
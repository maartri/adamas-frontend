import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styles: []
})
export class EquipmentsComponent implements OnInit {
  
  tableData: Array<any>;
  tableSData:Array<any>
  ServiceData:Array<any>;
  items:Array<any>;
  groups:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  isVisible: boolean = false;
  current: number = 0;
  dateFormat: string = 'dd/MM/yyyy';
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Equipments";
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService,
    ){}
    
    
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.loadData();
      this.buildForm();
      this.loading = false;
      this.cd.detectChanges();
    }
    
    showAddModal() {
      this.title = "Add New Equipments"
      this.resetModal();
      this.modalOpen = true;
    }
    showServiceModal(){
      this.isUpdate = false;
      this.isVisible = true;
    }
    loadTitle()
    {
      return this.title;
    }
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    showEditServiceModal(index:any){
      
      this.isUpdate = true;
      this.isVisible = true;
      const
      {
        category,
        details,
        serviceDate,
        reminderDate,
        dueDate,
        recordNumber,
      } = this.tableSData[index];
      this.inputForm.patchValue({
        category:category,
        details:details,
        service_date:serviceDate,
        reminder_date:reminderDate,
        due_date:dueDate,
        myrecordnumber:recordNumber,
      });
    }
    showEditModal(index: any) {
      this.title = "Edit New Equipments"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const
      {
        dateDisposed,
        equipCode,
        itemID,
        lastService,
        lockBoxCode,
        lockBoxLocation,
        notes,
        purchaseAmount,
        purchaseDate,
        recordNumber,
        serialNo,
        type
      } = this.tableData[index-1];
      this.inputForm.patchValue({
        type: type,
        description:itemID,
        asset_no:equipCode,
        serial_no:serialNo,
        purchase_am:purchaseAmount,
        purchase_date:purchaseDate,
        last_service:lastService,
        lockloct:lockBoxLocation,
        lockcode:lockBoxCode,
        disposal:dateDisposed,
        notes:notes,
        recordnumber:recordNumber,
      });
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    handleSCancel() {
      this.isVisible = false;
    }
    handleOk(){
      this.modalOpen = false;
    }
    
    pre(): void {
      this.current -= 1;
    }
    
    next(): void {
      this.current += 1;
    }
    UpdateService(){
    }
    save(){
      if(!this.isUpdate){
        
        this.postLoading = true;
        const group = this.inputForm;
        
        if(group.get('type').value){
          let type            = group.get('type').value;
          let description     = (group.get('description').value == null || group.get('description').value == '') ? '' : group.get('description').value;
          let asset           = (group.get('asset_no').value == null    || group.get('asset_no').value == '') ? '' : group.get('asset_no').value;
          let serial_no       = (group.get('serial_no').value == null   || group.get('serial_no').value == '') ? '' : group.get('serial_no').value;
          let purchase_am     = (group.get('purchase_am').value == null || group.get('purchase_am').value == '') ? '' : group.get('purchase_am').value;
          let purchase_date   = (group.get('purchase_date').value != null && group.get('purchase_date').value != '') ? this.globalS.convertDbDate(group.get('purchase_date').value) : null;
          let last_service    = (group.get('last_service').value != null  && group.get('last_service').value != '') ? this.globalS.convertDbDate(group.get('last_service').value) : null;
          let lockloct        = (group.get('lockloct').value == null || group.get('lockloct').value == '') ? '' : group.get('lockloct').value ;
          let lockcode        = (group.get('lockcode').value == null || group.get('lockcode').value == '') ? '' : group.get('lockcode').value;
          let disposal        = (group.get('disposal').value != null && group.get('disposal').value != '') ? this.globalS.convertDbDate(group.get('disposal').value) : null;
          let notes           = (group.get('notes').value == null    || group.get('notes').value == '') ? '' : group.get('notes').value;
          
          let values = type+"','"+description+"',"+disposal+","+last_service+",'"+asset+"','"+serial_no+"',"+purchase_date+",'"+purchase_am+"','"+lockcode+"','"+lockloct+"','"+notes;
          let sql = "insert into Equipment ([Type],[ItemID],[DateDisposed],[LastService],[EquipCode],[SerialNo],[PurchaseDate],[PurchaseAmount],[LockBoxCode],[LockBoxLocation],[Notes]) values('"+values+"');select @@IDENTITY"; 
          console.log(sql);
          this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
            if (data){
              this.globalS.sToast('Success', 'Saved successful');
            }
            else{
              this.globalS.sToast('Success', 'Saved successful');
            }
            this.loadData();
            this.postLoading = false;          
            this.handleCancel();
            this.handleSCancel();
            this.resetModal();
          });
        }
        
        if(group.get('category').value){
          
          let item_id             = '';
          let category            = group.get('category').value;
          let service_date        = this.globalS.convertDbDate(group.get('service_date').value);
          let reminder_date       = this.globalS.convertDbDate(group.get('reminder_date').value);
          let due_date            = this.globalS.convertDbDate(group.get('due_date').value);
          let details             = group.get('details').value;
          
          let values = category+"','"+item_id+"','"+details+"','"+service_date+"','"+reminder_date;
          let sql = "insert into [dbo].[EquipmentDetails] ([Category],[ItemID],[Details],[ServiceDate],[ReminderDate]) values('"+values+"');select @@IDENTITY"; 
          this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
            if (data){
              this.globalS.sToast('Success', 'Saved successful');
            }
            else{
              this.globalS.sToast('Success', 'Saved successful');
            }
            this.loadData();
            this.postLoading = false;      
            this.handleSCancel();    
            this.handleCancel();
            this.resetModal();
          });
        }
        
        
      }else{
        this.postLoading  = true;   
        const group       = this.inputForm;
        
        let type            = group.get('type').value;
        let description     = (group.get('description').value == null || group.get('description').value == '') ? '' : group.get('description').value;
        let asset           = (group.get('asset_no').value == null    || group.get('asset_no').value == '') ? '' : group.get('asset_no').value;
        let serial_no       = (group.get('serial_no').value == null   || group.get('serial_no').value == '') ? '' : group.get('serial_no').value;
        let purchase_am     = (group.get('purchase_am').value == null || group.get('purchase_am').value == '') ? '' : group.get('purchase_am').value;
        let purchase_date   = (group.get('purchase_date').value != null && group.get('purchase_date').value != '') ? this.globalS.convertDbDate(group.get('purchase_date').value) : '';
        let last_service    = (group.get('last_service').value != null  && group.get('last_service').value != '') ? this.globalS.convertDbDate(group.get('last_service').value) : '';
        let lockloct        = (group.get('lockloct').value == null || group.get('lockloct').value == '') ? '' : group.get('lockloct').value ;
        let lockcode        = (group.get('lockcode').value == null || group.get('lockcode').value == '') ? '' : group.get('lockcode').value;
        let disposal        = (group.get('disposal').value == null || group.get('disposal').value == '') ? '' : this.globalS.convertDbDate(group.get('disposal').value);
        let notes           = (group.get('notes').value == null    || group.get('notes').value == '') ? '' : group.get('notes').value;
        let recordnumber    = group.get('recordnumber').value;        
        
        let item_id             = '';
        let category            = group.get('category').value;
        let service_date        = group.get('service_date').value;
        let reminder_date       = group.get('reminder_date').value;
        let due_date            = group.get('due_date').value;
        let details             = group.get('details').value;
        let recordnumberdetail  = group.get('myrecordnumber').value;      
        
        if(recordnumberdetail){
          let detailsUpdate  = "Update [dbo].[EquipmentDetails] SET [Category]='"+ category + "',[ItemID] = '"+ item_id + "',[Details] = '"+ details + "',[ServiceDate] = '"+ service_date+ "',[ReminderDate] = '"+ reminder_date + "' WHERE [RecordNumber] ='"+recordnumberdetail+"'";
          this.menuS.InsertDomain(detailsUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{ 
            if (data){
              this.globalS.sToast('Success', 'Service Updated successful');            
            }
            else
            this.globalS.sToast('Success', 'Saved successful');
            this.loadData();
            this.postLoading = false;          
            this.handleSCancel();
            this.resetModal();
          });
        }
        if(recordnumber && !recordnumberdetail){
          let sql  = "Update Equipment SET [Type]='"+ type + "',[ItemID] = '"+ description + "',[DateDisposed] = '"+ disposal + "',[LastService] = '"+ last_service+ "',[EquipCode] = '"+ asset + "',[SerialNo] = '"+ serial_no + "',[PurchaseDate] = '"+ purchase_date+ "',[PurchaseAmount] = '"+ purchase_am+ "',[LockBoxLocation] = '"+ lockloct + "',[LockBoxCode] = '"+ lockcode + "',[Notes] = '"+ notes+ "' WHERE [RecordNumber] ='"+recordnumber+"'";
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
    }
    
    loadData(){
      
      this.loading = true;
      this.menuS.Getlistequipments().subscribe(data => {
        this.tableData = data;
        this.loading = false;
        this.cd.detectChanges();
      });
      
      let Ssql = "SELECT [RecordNumber] As [RecordNumber],[Category] As [Category],[Details] As [Details],[ServiceDate] As [ServiceDate],[DueDate] As [DueDate],[ReminderDate] As [ReminderDate],[ItemID] as [ItemID] FROM EquipmentDetails WHERE ItemId = ''"
      this.loading = true;
      this.listS.getlist(Ssql).subscribe(data => {
        this.tableSData = data;
        console.log(this.tableSData);
      });
      
      let type = "SELECT DISTINCT Description FROM DataDomains WHERE Domain = 'GOODS' ORDER BY Description";
      this.listS.getlist(type).subscribe(data => {
        this.groups = data;
        this.loading = false;
      });
    }
    
    delete(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.deleteEquipmentslist(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Deleted!');
          this.loadData();
          return;
        }
      });
    }
    buildForm() {
      this.inputForm = this.formBuilder.group({
        type: '',
        description: '',
        asset_no:'',
        serial_no:'',
        purchase_am:'',
        purchase_date:'',
        last_service:'',
        lockloct:'',
        lockcode:'',
        disposal:'',
        notes:'',
        category:'',
        service_date:'',
        reminder_date:'',
        due_date:'',
        details:'',
        recordnumber:null,
        myrecordnumber:null,
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
      
      var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY [itemid]) AS Field1,[type] AS Field2, [itemid] AS Field3, [datedisposed] AS Field4, [lastservice] AS Field5, [equipcode] AS Field6, [serialno] AS Field7, [purchasedate] AS Field8, [purchaseamount] AS Field9, [lockboxcode] AS Field10, [lockboxlocation] AS [LockBoxLocation], [notes] AS [Notes] FROM equipment";
      
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
          "txtTitle": "Equipments List",
          "sql": fQuery,
          "userid":this.tocken.user,
          "head1" : "Sr#",
          "head2" : "Type",
          "head3" : "Item ID",
          "head4" : "Date Disposed",
          "head5" : "Last Service",
          "head6" : "Equip Code",
          "head7" : "last Service",
          "head8" : "Lock Box Code",
          "head9" : "Purchase Date",
          "head10": "Purchase Amount",
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
  
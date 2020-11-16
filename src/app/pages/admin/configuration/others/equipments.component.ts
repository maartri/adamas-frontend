import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalService, ListService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styles: []
})
export class EquipmentsComponent implements OnInit {

  tableData: Array<any>;
  ServiceData:Array<any>;
  items:Array<any>;
  groups:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  dateFormat: string = 'dd/MM/yyyy';
  inputForm: FormGroup;
  modalVariables:any;
  inputVariables:any;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Equipments";
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private listS: ListService,
    private switchS:SwitchService,
  ){}
  
  ngOnInit(): void {

    this.loadData();

    this.buildForm();
    
    this.groups = ["Aid For Reading","Car Modification","Communication Aids","Medical Care Aids","Self Care Aids","Vehicle"];
    // this.items = ["LEVEL 1","LEVEL 2","LEVEL 3","LEVEL 4","DEMENTIA/CONGNITION VET 1","DEMENTIA/CONGNITION VET 2","DEMENTIA/CONGNITION VET 3","DEMENTIA/CONGNITION VET 4","OXYGEN"]
    this.loading = false;
    this.cd.detectChanges();
  }
  
  showAddModal() {
    this.title = "Add New Equipments"
    this.resetModal();
    this.modalOpen = true;
  }
  showServiceModal(){
    this.modalOpen = true;
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
  
  showEditModal(index: any) {
    this.title = "Edit New Equipments"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
    const { 
      name,
      branch,
      agroup,
      recordNumber
     } = this.tableData[index];
    this.inputForm.patchValue({
      item: branch,
      rate:name,
      agroup:agroup,
      recordNumber:recordNumber
    });
  }
  
  handleCancel() {
    this.modalOpen = false;
  }
  pre(): void {
    this.current -= 1;
  }
  
  next(): void {
    this.current += 1;
  }
  save() {
    this.postLoading = true;     
    const group = this.inputForm;
    if(!this.isUpdate){         
      // this.switchS.addData(  
      //   this.modalVariables={
      //     title: 'CDC Claim Rates'
      //   }, 
      //   this.inputVariables = {
      //     item: group.get('item').value,
      //     rate: group.get('rate').value,
      //     domain: 'PACKAGERATES', 
      //   }
      //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      //     if (data) 
      //     this.globalS.sToast('Success', 'Saved successful');     
      //     else
      //     this.globalS.sToast('Unsuccess', 'Data not saved' + data);
      //     this.loadData();
      //     this.postLoading = false;          
      //     this.handleCancel();
      //     this.resetModal();
      //   });
      }else{
        this.postLoading = true;     
        const group = this.inputForm;
        // console.log(group.get('item').value);
        // this.switchS.updateData(  
        //   this.modalVariables={
        //     title: 'CDC Claim Rates'
        //   }, 
        //   this.inputVariables = {
        //     item: group.get('item').value,
        //     rate: group.get('rate').value,
        //     recordNumber:group.get('recordNumber').value,
        //     domain: 'PACKAGERATES',
        //   }
          
        //   ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        //     if (data) 
        //     this.globalS.sToast('Success', 'Updated successful');     
        //     else
        //     this.globalS.sToast('Unsuccess', 'Data Not Update' + data);
        //     this.loadData();
        //     this.postLoading = false;          
        //     this.handleCancel();
        //     this.resetModal();
        //   });
        }
        
      }
      loadData(){
        let sql ="SELECT [recordnumber] AS [RecordNumber], [type] AS [Type], [itemid] AS [ItemID], [datedisposed] AS [DateDisposed], [lastservice] AS [LastService], [equipcode] AS [EquipCode], [serialno] AS [SerialNo], [purchasedate] AS [PurchaseDate], [purchaseamount] AS [PurchaseAmount], [lockboxcode] AS [LockBoxCode], [lockboxlocation] AS [LockBoxLocation], [notes] AS [Notes] FROM equipment";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
          this.tableData = data;
          console.log(this.tableData);
          // this.loading = false;
        });

        let branch = "SELECT RecordNumber, Description FROM DataDomains WHERE Domain =  'BRANCHES' ORDER BY Description";
        this.listS.getlist(branch).subscribe(data => {
          this.items = data;
          this.loading = false;
        });

      }
  delete(data: any) {
    this.globalS.sToast('Success', 'Data Deleted!');
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
      recordNumber:null
    });
  }

}

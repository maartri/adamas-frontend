import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-destinationaddress',
  templateUrl: './destinationaddress.component.html',
  styles: []
})
export class DestinationaddressComponent implements OnInit {
  tableData: Array<any>;
  loading: boolean = false;
  dateFormat: string = 'dd/MM/yyyy';
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  title:string = "Add New Destination Address";
  modalVariables:any;
  inputVariables:any;
  private unsubscribe: Subject<void> = new Subject();
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private menuS:MenuService,
    private formBuilder: FormBuilder
  ){}
  
  loadTitle()
  {
    // debugger;
    return this.title;
  }
  ngOnInit(): void {
    this.buildForm();
    this.loadData();
    // this.tableData = [{type:"GF",name:"RBH-XRAY",address1:"Gate 13 44 Lutwyche Road",address2:"TEST2",phone1:"98986767",phone2:"wa",fax:"wa",mobile:"wa",email:"wa@mIL.COM",date:"10-13-2020",}];
    this.loading = false;
    this.cd.detectChanges();
  }
  loadData(){
    let sql ="SELECT * FROM HumanResourceTypes WHERE [Group] like 'DESTINATION'";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.tableData = data;
      console.log(this.tableData);
      this.loading = false;
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
  showAddModal() {
    this.title = "Add New Destination Address";
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
    this.title = "Edit Destination Contact Detail"
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
      
    if(!this.isUpdate){        
    this.postLoading = true;   
    const group = this.inputForm;
    let type     = 'DESTINATION';
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

    let values = "DESTINATION"+"','"+type+"','"+name+"','"+address1+"','"+address2+"','"+suburb+"','"+postcode+"','"+phone1+"','"+phone2+"','"+fax+"','"+mobile+"','"+email+"','"+'2020-11-18';
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
        let type     = 'DESTINATION';
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
        let recordnumber     = group.get('recordNumber').value;
        let postcode = '';
        let sql  = "Update HumanResourceTypes SET [Group]='DESTINATION',[Type] = '"+ type+ "',[Name] = '"+ name+ "',[Address1] = '"+ address1+ "',[Address2] = '"+ address2+ "',[Suburb] = '"+ suburb+ "',[Postcode] = '"+ postcode+ "',[Phone1] = '"+ phone1+ "',[Phone2] = '"+ phone2+ "',[Fax] = '"+ fax+ "',[Mobile] = '"+ mobile + "',[EMail] = '"+ email + "',[EndDate] = '"+ '' + "' WHERE [RecordNumber] ='"+recordnumber+"'";
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
    this.globalS.sToast('Success', 'Data Deleted!');
  }
}

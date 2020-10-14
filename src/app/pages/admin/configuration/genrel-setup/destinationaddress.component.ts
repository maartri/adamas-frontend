import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';

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
  title:string = "Add New Destination Address"
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private formBuilder: FormBuilder
  ){}
  
  loadTitle()
  {
    // debugger;
    return this.title;
  }
  ngOnInit(): void {
    this.buildForm();
    this.tableData = [{type:"GF",name:"RBH-XRAY",address1:"Gate 13 44 Lutwyche Road",address2:"TEST2",phone1:"98986767",phone2:"wa",fax:"wa",mobile:"wa",email:"wa@mIL.COM",date:"10-13-2020",}];
    this.loading = false;
    this.cd.detectChanges();
  }
  showAddModal() {
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
      });
  
  }
  
  handleCancel() {
    this.modalOpen = false;
  }
  save() {
    this.postLoading = true;
    this.globalS.sToast('Success', 'Changes saved');
    this.handleCancel();
    this.resetModal();
  }
  
  delete(data: any) {
    this.globalS.sToast('Success', 'Data Deleted!');
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
    });
  }
}

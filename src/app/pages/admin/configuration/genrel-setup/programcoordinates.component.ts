import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-programcoordinates',
  templateUrl: './programcoordinates.component.html',
  styles: []
})
export class ProgramcoordinatesComponent implements OnInit {

  tableData: Array<any>;
  staff:Array<any>;
  loading: boolean = false;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  heading:string = "Add New Program Coordinates"
  private unsubscribe: Subject<void> = new Subject();
  constructor(
    private globalS: GlobalService,
    private listS:ListService,
    private menuS:MenuService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ){}
  
  ngOnInit(): void {
    this.buildForm();
    this.loadData();
    // this.tableData = [{ code:"Other",name:"K AGGARWAL"},{ code:"Other",name:"HILDA SMITH"}];
    this.loading = false;
    this.cd.detectChanges();
  }
  loadData(){
    let sql ="SELECT HACCCode as code , RecordNumber, Description as name FROM DataDomains WHERE Domain =  'CASE MANAGERS'";
    this.loading = true;
    this.listS.getlist(sql).subscribe(data => {
      this.tableData = data;
      console.log(this.tableData);
      this.loading = false;
    });
    this.staff = ['ABBAS A','ADAMS D S','WATTS T','GOEL T J','DARLISON S','TRINIDAD M','ALONSO J C','AHMAD A','AAAQWERTY TOM','AGGARWAL K H','MALIK I','SMITH H','MILLER A','AI BBCRI DAVIS B C','DIAZ J P','ALLEN C J','HARPER B','ALONSO J C','','DARLISION AWARD','DARLISION AWARD 2','DARLISION AWARD 3','DARLISION AWARD 3','DARLISION AWARD 4','DARLISION AWARD 5','DARLISION AWARD 6','DARLISION AWARD 7'];
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
    this.heading  = "Edit Programe Coordinates"
    this.isUpdate = true;
    this.current = 0;
    this.modalOpen = true;
    const { 
      code,
      name,
      recordNumber,

    } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        code:code,
        recordNumber:recordNumber,
        
   });
  }
  loadtitle(){
    return this.heading
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
      
    if(!this.isUpdate){        
    this.postLoading = true;   
    const group  = this.inputForm;
    let domain = 'CASE MANAGERS';
    let code   = group.get('code').value;
    let name   = group.get('name').value;
    
    
    let values = domain+"','"+code+"','"+name;
    let sql = "insert into DataDomains (Domain,HACCCode,Description) Values ('"+values+"')";

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
        let code   = group.get('code').value;
        let name   = group.get('name').value;
        let recordNumber = group.get('recordNumber').value;
        let sql  = "Update DataDomains SET [HACCCode] = '"+ code+ "',[Description] = '"+ name+ "' WHERE [RecordNumber]='"+recordNumber+"'";
        console.log(sql);

        this.menuS.InsertDomain(sql).pipe(takeUntil(this.unsubscribe)).subscribe(data=>{
          if (data) 
          this.globalS.sToast('Success', 'Updated successful');     
          else
          this.globalS.sToast('Success', 'Updated successful');
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
  buildForm() {
    this.inputForm = this.formBuilder.group({
      code:'',
      name:'',
      recordNumber:null,
    });
  }
  
}

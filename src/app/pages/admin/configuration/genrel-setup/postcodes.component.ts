import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
      return this.title;
    }
    ngOnInit(): void {
      this.buildForm();
      this.loadData();
      this.loading = false;
      this.cd.detectChanges();
    }
    loadData(){
      let sql ="SELECT Recnum, [Suburb] as subrub, [State] as state, [Postcode] as postcode FROM Pcodes Order By Recnum desc";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        console.log(this.tableData);
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
      let suburb   = group.get('suburb').value;
      let state    = group.get('state').value;
      let postcode = group.get('postcode').value;
      let values = suburb+"','"+postcode+"','"+state;
      let sql = "insert into Pcodes (Suburb,Postcode,State) Values ('"+values+"')";
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
          let suburb   = group.get('suburb').value;
          let state    = group.get('state').value;
          let postcode = group.get('postcode').value;
          let Recnum   = group.get('Recnum').value;
          let sql  = "Update Pcodes SET [Suburb] = '"+ suburb+ "',[Postcode] = '"+ postcode+ "',[State] = '"+ state + "' WHERE [Recnum] ='"+Recnum+"'";
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

    buildForm() {
      this.inputForm = this.formBuilder.group({
        postcode:'',
        suburb:'',
        state:'',
        Recnum:null,
      });
    }

}

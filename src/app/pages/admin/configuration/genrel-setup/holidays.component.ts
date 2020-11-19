import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListService, MenuService } from '@services/index';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styles: []
})
export class HolidaysComponent implements OnInit {

    tableData: Array<any>;
    states:Array<any>;
    loading: boolean = false;
    dateFormat: string = 'dd/MM/yyyy';
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add Public Holidays";
    private unsubscribe: Subject<void> = new Subject();
    constructor(
      private globalS: GlobalService,
      private cd: ChangeDetectorRef,
      private switchS:SwitchService,
      private menuS:MenuService,
      private listS:ListService,
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
      let sql ="select * from PUBLIC_HOLIDAYS order by DATE desc";
      this.loading = true;
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
        console.log(this.tableData);
        this.loading = false;
      });
      this.states = ['ALL','NSW','NT','QLD','SA','TAS','VIC','WA','ACT'];
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
      this.title = "Edit Public Holidays"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
        const { 
          date,
          description,
          stats,
          recordno,
         } = this.tableData[index];
        this.inputForm.patchValue({
          date: date,
          description:description,
          state:stats,
          recordno:recordno,
        });
    }
    
    handleCancel() {
      this.modalOpen = false;
    }

    save() {
      
      if(!this.isUpdate){        
      this.postLoading = true;   
      const group  = this.inputForm;
      let description   = group.get('description').value;
      let stats   = group.get('state').value;
      let PublicHolidayRegion = group.get('region').value;
      let date = this.globalS.convertDbDate(group.get('date').value);
      if (!PublicHolidayRegion) {
        PublicHolidayRegion = '';
      }
      
      let values = date+"','"+description+"','"+stats+"','"+PublicHolidayRegion;
      let sql = "insert into PUBLIC_HOLIDAYS (DATE,DESCRIPTION,Stats,PublicHolidayRegion) Values ('"+values+"')";

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
          let description   = group.get('description').value;
          let stats   = group.get('state').value;
          let PublicHolidayRegion = group.get('region').value;
          let date     = group.get('date').value;
          let recordno = group.get('recordno').value;
let sql  = "Update PUBLIC_HOLIDAYS SET [DATE] = '"+ date+ "',[DESCRIPTION] = '"+ description+ "',[Stats] = '"+ stats+ "',[PublicHolidayRegion] = '"+ PublicHolidayRegion + "' WHERE [RECORDNO]='"+recordno+"'";
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
        date:'',
        description:'',
        state:'',
        region:'',
        recordno:null,
      });
    }

}

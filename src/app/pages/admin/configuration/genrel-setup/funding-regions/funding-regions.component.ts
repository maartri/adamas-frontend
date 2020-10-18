import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '@services/global.service';
import { SwitchService } from '@services/switch.service';
import { Observable, of, from, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-funding-regions',
  templateUrl: './funding-regions.component.html',
  styleUrls: ['./funding-regions.component.css']
})
export class FundingRegionsComponent implements OnInit {
    
    private unsubscribe: Subject<void> = new Subject();
    tableData: Array<any>;
    fundinglist: Array<any>;
    loading: boolean = false;
    modalOpen: boolean = false;
    current: number = 0;
    inputForm: FormGroup;
    postLoading: boolean = false;
    isUpdate: boolean = false;
    title:string = "Add Funding Regions"
    
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
      this.search();
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
      this.title = "Edit Funding Regions"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
        const { 
          description,
          recordNumber
         } = this.tableData[index];
        this.inputForm.patchValue({
          description: description,
          recordNumber:recordNumber,
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
      
      // var temp=this.inputForm.controls["fundregions"].value
      //  var input=this.inputForm.value
      //  var temp = input.fundregions
      // if(!this.isUpdate){
        
      //   const group = this.inputForm;
      // this.switchS.addData({}).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      //     if (data) 
      //     this.globalS.sToast('Success', 'Saved successful');     
      //     else
      //     this.globalS.sToast('Unsuccess', 'Data not saved' + data)
      // )};
      
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
        description: '',
        recordNumber:null,
      });
    }

    search(){
      this.loading = true;
      this.switchS.getData(2).subscribe(data => {
        this.tableData = data.list;
        this.cd.detectChanges();
      });
    }

}

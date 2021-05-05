import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
  selector: '',
  templateUrl: './staff.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IntakeStaff implements OnInit, OnDestroy {
  
  private unsubscribe: Subject<void> = new Subject();
  user: any;
  loading: boolean = false;
  isLoading:boolean = false;
  postLoading : boolean = false;
  modalOpen: boolean = false;
  editOrAdd: number;
  inputForm: FormGroup;
  whatView: number;
  
  excludedStaff: Array<any> = []
  includedStaff: Array<any> = []
  staffApproved: boolean =  false;
  careWorkers: any;
  staffUnApproved: boolean = false;
  temp: any[];
  careWorkersCopy: any;
  careWorkersExcluded: any;
  careWorkersExcludedCopy: any;
  checkedListExcluded: any;
  checkedListApproved: any;
  inputvalueSearch:string = '';
  listArray: Array<any>;
  
  constructor(
    private timeS: TimeSheetService,
    private sharedS: ShareService,
    private listS: ListService,
    private router: Router,
    private globalS: GlobalService,
    private formBuilder: FormBuilder,
    private modalService: NzModalService,
    private cd: ChangeDetectorRef
    ) {
      cd.detach();
      
      this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data instanceof NavigationEnd) {
          if (!this.sharedS.getPicked()) {
            this.router.navigate(['/admin/recipient/branches'])
          }
        }
      });
      
      this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (this.globalS.isCurrentRoute(this.router, 'staff')) {
          this.user = data;
          this.search(data);
        }
      });
    }
    
    ngOnInit(): void {
      this.user = this.sharedS.getPicked();
      this.search(this.user);
      this.buildForm();
    }
    
    ngOnDestroy(): void {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
    
    search(user: any = this.user) {
      this.cd.reattach();
      this.loading = true;
      
      forkJoin([
        this.timeS.getexcludedstaff(user.id),
        this.timeS.getincludedstaff(user.id),
      ]).subscribe(staff => {
        this.loading = false;
        this.excludedStaff = staff[0];
        this.includedStaff = staff[1];
        this.cd.markForCheck();
      });
      
    }
    
    buildForm() {
      this.inputForm = this.formBuilder.group({
        recordNumber: '',
        personID: '',
        name: '',
        notes: ''
      })
    }
    
    get title() {
      const str = this.whatView == 1 ? 'Excluded Staff' : 'Approved Staff';
      const pro = this.editOrAdd == 1 ? 'Add' : 'Edit';
      return `${pro} ${str}`;
    }
    trackByFn(index, item) {
      return item.id;
    }
    
    processBtn() {
      if (this.editOrAdd == 1) {
        this.save();
      }
      
      if (this.editOrAdd == 2) {
        this.edit();
      }
    }
    save() {

      for (const i in this.inputForm.controls) {
        this.inputForm.controls[i].markAsDirty();
        this.inputForm.controls[i].updateValueAndValidity();
      }
      
      if (!this.inputForm.valid)
      return;
      
      const { list, notes } = this.inputForm.value;
      const index = this.whatView;
      this.isLoading = true;
      
      if (index == 1) {            
        this.timeS.postuserdefined1({
          notes: notes,
          // group: list,
          personID: this.user.id,
          groupList: list
        }).pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
          if (data) {
            this.handleCancel();
            this.success();
            this.globalS.sToast('Success', 'Data Added');
          }
        })
      }
      
      if (index == 2) {
        this.timeS.postuserdefined2({
          notes: notes,
          // group: list,
          personID: this.user.id,
          groupList: list
        }).pipe(takeUntil(this.unsubscribe))
        .subscribe(data => {
          if (data) {
            this.handleCancel();
            this.success();
            this.globalS.sToast('Success', 'Data Added');
          }
        });
      }
    }
    edit() {
      
      for (const i in this.inputForm.controls) {
        this.inputForm.controls[i].markAsDirty();
        this.inputForm.controls[i].updateValueAndValidity();
      }
      
      if (!this.inputForm.valid)
      return;
      
      const { list, notes, id } = this.inputForm.value;
      const index = this.whatView;
      this.isLoading = true;
      
      if (index == 1) {
        this.timeS.updateshareduserdefined({
          group: list,
          notes,
          recordNumber: id
        }).pipe(
          takeUntil(this.unsubscribe))
          .subscribe(data => {
            if (data) {
              this.handleCancel();
              this.success();
              this.globalS.sToast('Success', 'Data Updated');
            }
          })
        }
        
        if (index == 2) {
          this.timeS.updateshareduserdefined({
            group: list,
            notes,
            recordNumber: id
          }).pipe(
            takeUntil(this.unsubscribe))
            .subscribe(data => {
              if (data) {
                this.handleCancel();
                this.success();
                this.globalS.sToast('Success', 'Data Updated');
              }
            })
          }
        }
        
        success() {
          this.search(this.sharedS.getPicked());
          this.isLoading = false;
        }
        
        showEditModal(view: number, index: number) {

          // if (view == 1) {
          //     const { group, notes, recordNumber } = this.userdefined1[index];
  
          //     this.inputForm.patchValue({
          //         list: group,
          //         notes: notes,
          //         id: recordNumber
          //     });
  
          //     this.listArray = this.userdefined1List;
          // }
  
          // if (view == 2) {
          //     const { preference, notes, recordNumber } = this.userdefined2[index];
  
          //     this.inputForm.patchValue({
          //         list: preference,
          //         notes: notes,
          //         id: recordNumber
          //     });
  
          //     this.listArray = this.userdefined2List;
          // }
          
          this.whatView = view;
          this.editOrAdd = 2;
          this.modalOpen = true;
      }
        
        delete(index: number) {
          
        }
        
        handleCancel() {
          this.inputForm.reset();
          this.isLoading = false;
          this.modalOpen = false;
        }
        
        showAddModal(view : number) {
          if (view == 1) this.listArray = [];
          if (view == 2) this.listArray = [];
          
          this.whatView = view;
          this.editOrAdd = 1;
          this.modalOpen = true;
        }
        
        log(value: string[]): void {
        }
        
      }
import { OnDestroy,ChangeDetectionStrategy} from '@angular/core'
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, forwardRef, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { GlobalService, ListService, TimeSheetService, ShareService,expectedOutcome,qoutePlantype, leaveTypes } from '@services/index';
import * as _ from 'lodash';
import { forkJoin, Observable, EMPTY, Subject, combineLatest } from 'rxjs';
import parseISO from 'date-fns/parseISO'
import { mergeMap, debounceTime, distinctUntilChanged, first, take, takeUntil, switchMap, concatMap } from 'rxjs/operators';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { dateFormat } from '@services/global.service'

import { Filters, QuoteLineDTO, QuoteHeaderDTO, AcceptCharges } from '@modules/modules';
import { billunit, periodQuote, basePeriod } from '@services/global.service';
import { MedicalProceduresComponent } from '@admin/recipient-views/medical-procedures.component';
import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
  styles: [`
      nz-table{
        margin-top:10px;
        margin-bottom:30px;
      }
    `],
    selector: '',
    templateUrl: './diagnose.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClinicalDiagnose implements OnInit, OnDestroy {
  
  private unsubscribe: Subject<void> = new Subject();
  user: any;
  loading: boolean = false;
  isLoading:boolean = false;
  postLoading : boolean = false;
  modalOpen: boolean = false;
  editOrAdd: number;
  inputForm: FormGroup;
  whatView: number;
  
  dignsose: Array<any> = []
  medialDiagnose: Array<any> = []
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
  listDiagnosis: any;
  nDiagnosis:any;
  mDiagnosis:any;
  nlist: any;
  mlist: any;
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
                  this.router.navigate(['/admin/recipient/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'diagnose')) {
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
        this.listS.getclinicalnursingdiagnose(user.id),
        this.listS.getclinicalmedicationdiagnose(user.id),
        this.listS.getaddclinicalnursingdiagnose(user.id),
        this.listS.getaddclinicalmedicationdiagnose(user.id),
      ]).subscribe(staff => {
        this.loading = false;
        this.nlist = staff[0];
        this.mlist = staff[1];
        this.nDiagnosis = staff[2];
        this.mDiagnosis = staff[3];
        this.cd.markForCheck();
      });
    }
    
    buildForm() {
      this.inputForm = this.formBuilder.group({
        recordNumber: '',
        personID: '',
        list: '',
        usercode:'',
        icdcode:'',
      })
    }
    
    get title() {
      const str = this.whatView == 1 ? 'Nursing Diagnosis' : 'Medical Diagnosis';
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
        this.timeS.postnursingdiagnosis({
          PersonID: this.user.id,
          Description: list,
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
        this.timeS.postmedicaldiagnosis({
          PersonID: this.user.id,
          Description: list,
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
      
      const { list, notes, recordNumber } = this.inputForm.value;
      const index = this.whatView;
      this.isLoading = true;
      
      if (index == 1) {
        this.timeS.updateintakestaff({
          name: list,
          notes:notes,
          recordNumber:recordNumber
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
          this.timeS.updateintakestaff({
            name: list,
            notes:notes,
            recordNumber:recordNumber
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

          if (view == 1) {
            console.log(this.nDiagnosis[index]);
              const { description, icdcode, recordNumber } = this.nDiagnosis[index];
              this.inputForm.patchValue({
                  list: description,
                  icdcode: icdcode,
                  recordNumber: recordNumber
              });
          }
          if (view == 2) {
              const { description, icdcode, recordNumber } = this.mDiagnosis[index];
              this.inputForm.patchValue({
                  list: description,
                  icdcode: icdcode,
                  recordNumber: recordNumber
              });
          }
          this.whatView = view;
          this.editOrAdd = 2;
          this.modalOpen = true;
      }
        
        delete(recordNo: number,view:number) {
          if(view == 1){
            this.timeS.deletenursingdiagnosis(recordNo)
            .subscribe(data => {
                if (data) {
                    this.handleCancel();
                    this.success();
                    this.globalS.sToast('Success', 'Data Deleted');
                }
            });
          }else{
            this.timeS.deletemedicaldiagnosis(recordNo)
            .subscribe(data => {
                if (data) {
                    this.handleCancel();
                    this.success();
                    this.globalS.sToast('Success', 'Data Deleted');
                }
            });
          }
        }
        
        handleCancel() {
          this.inputForm.reset();
          this.isLoading = false;
          this.modalOpen = false;
        }
        
        showAddModal(view : number) {
          this.listDiagnosis =  (view == 1) ? this.nDiagnosis:this.mDiagnosis;
          this.whatView = view;
          this.editOrAdd = 1;
          this.modalOpen = true;
        }
        
        log(value: string[]): void {
        }
        tabFindIndex: number = 0;
        tabFindChange(index: number){
         this.tabFindIndex = index;
        }
      }
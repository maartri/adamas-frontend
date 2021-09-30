import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';
import { Filters } from '@modules/modules';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
    styles: [`
    nz-table{
        margin-top:20px;
    }
    nz-select{
        width:100%;
    }
    label.chk{
        position: absolute;
        top: 1.5rem;
    }
    .overflow-list{
        overflow: auto;
        height: 8rem;
        border: 1px solid #e3e3e3;
    }
    ul{
        list-style:none;
    }
    li{
        margin:5px 0;
    }
    .chkboxes{
        padding:4px;
    }
    `],
    templateUrl: './casenote.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecipientCasenoteAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    caseFormGroup: FormGroup;
    tableData: Array<any>;
    dateFormat: string = 'dd/MM/yyyy';
    
    checked: boolean = false;
    isDisabled: boolean = false;
    loading: boolean = false;
    
    modalOpen: boolean = false;
    
    alist: Array<any> = [];
    blist: Array<any> = [];
    clist: Array<any> = [];
    dlist: Array<any> = [];
    mlist: Array<any> = [];
    
    public editorConfig:AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '5rem',
        translate: 'no',
        customClasses: []
    };
    
    filters: Filters = {
        acceptedQuotes: false,
        allDates: false,
        archiveDocs: true,
        display: 20
    };
    
    private default = {
        notes: '',
        publishToApp: false,
        restrictions: '',
        restrictionsStr: 'public',
        alarmDate: null,
        whocode: '',
        program: '*VARIOUS',
        discipline: '*VARIOUS',
        careDomain: '*VARIOUS',
        category: null,
        recordNumber: null
    }
    
    recipientStrArr: Array<any> = [];
    restrict_list: any;
    addOrEdit: number;
    
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private clientS: ClientService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private cd: ChangeDetectorRef
        ) {
            this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data instanceof NavigationEnd) {
                    if (!this.sharedS.getPicked()) {
                        this.router.navigate(['/admin/recipient/personal'])
                    }
                }
            });
            
            this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (this.globalS.isCurrentRoute(this.router, 'casenote')) {
                    this.user = data
                    this.search(data);
                }
            });
            
        }
        
        ngOnInit(): void {
            this.user = this.sharedS.getPicked();
            // this.search();
            this.buildForm();
        }
        
        ngOnDestroy(): void {
            this.unsubscribe.next();
            this.unsubscribe.complete();
        }
        
        search(user: any = this.user) {        
            this.getNotes(this.user);
            this.getSelect();
        }
        
        filterChange(data: any){
            this.getNotes(this.user);
        }
        
        getNotes(user: any) {
            this.loading = true;
            
            this.clientS.getcasenoteswithfilters(user.code, this.filters).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                let list: Array<any> = data.list || [];
                
                if (list.length > 0) {
                    list.forEach(x => {
                        if (!this.globalS.IsRTF2TextRequired(x.detailOriginal)) {
                            x.detail = x.detailOriginal
                        }
                    });
                    this.tableData = list;
                } else {
                    this.tableData = list;
                }
                
                this.loading = false;
                this.cd.markForCheck();
            });
            
            // this.clientS.getcasenotes(user.code).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            //     let list: Array<any> = data.list || [];
            
            //     if (list.length > 0) {
            //         list.forEach(x => {
            //             if (!this.globalS.IsRTF2TextRequired(x.detailOriginal)) {
            //                 x.detail = x.detailOriginal
            //             }
            //         });
            //         console.log(list);
            //         this.tableData = list;
            //     }
            
            //     this.loading = false;
            //     this.cd.markForCheck();
            // });
        }
        
        buildForm() {
            this.inputForm = this.formBuilder.group({
                autoLogout: [''],
                emailMessage: false,
                excludeShiftAlerts: false,
                inAppMessage: false,
                logDisplay: false,
                pin: [''],
                rosterPublish: false,
                shiftChange: false,
                smsMessage: false
            });
            
            this.caseFormGroup = this.formBuilder.group({
                notes: '',
                publishToApp: false,
                restrictions:'',
                restrictionsStr:'public',
                alarmDate: null,
                whocode:'',
                program:'*VARIOUS',
                discipline:'*VARIOUS',
                careDomain:'*VARIOUS',
                category:'',
                recordNumber: null
            });
            
            this.caseFormGroup.get('restrictionsStr').valueChanges.subscribe(data => {
                if (data == 'restrict') {
                    this.getSelect();
                }
            });
        }
        
        onKeyPress(data: KeyboardEvent) {
            return this.globalS.acceptOnlyNumeric(data);
        }
        
        trackByFn(index, item) {
            return item.id;
        }
        
        canDeactivate() {
            if (this.inputForm && this.inputForm.dirty) {
                this.modalService.confirm({
                    nzTitle: 'Save changes before exiting?',
                    nzContent: '',
                    nzOkText: 'Yes',
                    nzOnOk: () => {
                        this.save();
                    },
                    nzCancelText: 'No',
                    nzOnCancel: () => {
                        
                    }
                });
            }
            return true;
        }
        
        getSelect() {
            this.timeS.getmanagerop().subscribe(data => {
                data.forEach(x => {
                    this.mlist.push({
                        name:x, value:x, checked:false
                    });
                });
                this.cd.markForCheck();
            });
            
            this.timeS.getdisciplineop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                data.push('*VARIOUS');
                this.blist = data;
            });
            this.timeS.getcaredomainop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                data.push('*VARIOUS');
                this.clist = data;
            });
            this.timeS.getprogramop(this.user.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                data.push('*VARIOUS');
                this.alist = data;
            });
            
            this.timeS.getcategoryop().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                this.dlist = data;
            })
        }
        
        showAddModal() {
            this.addOrEdit = 1;
            this.buildForm();
            this.modalOpen = true;       
        }
        
        save() {
            
            if (!this.globalS.IsFormValid(this.caseFormGroup))
            return; 
            
            const { alarmDate, restrictionsStr, whocode, restrictions } = this.caseFormGroup.value;
            const cleanDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(alarmDate);
            let privateFlag = restrictionsStr == 'workgroup' ? true : false;
            let restricts = restrictionsStr != 'restrict';
            this.caseFormGroup.controls["restrictionsStr"].setValue(privateFlag);
            this.caseFormGroup.controls["alarmDate"].setValue(cleanDate);
            this.caseFormGroup.controls["whocode"].setValue(this.user.code);
            this.caseFormGroup.controls["restrictions"].setValue(restricts ? '' : this.listStringify());    
            
            
            
            this.loading = true;
            if (this.addOrEdit == 1) {         
                this.clientS.postcasenotes(this.caseFormGroup.value, this.user.id)
                .subscribe(data => {
                    this.globalS.sToast('Success', 'Note inserted');
                    this.loading = false;
                    this.handleCancel();
                    this.getNotes(this.user);
                });
            }
            if (this.addOrEdit == 2) {
                this.clientS.updatecasenotes(this.caseFormGroup.value, this.caseFormGroup.value.recordNumber)
                .subscribe(data => {

                    if(data){
                        this.globalS.sToast('Success', 'Note updated');
                        this.handleCancel();
                        
                        if(!this.globalS.isEmpty(this.restrict_list)){
                            this.mlist.forEach(element => {
                                element.checked = false;
                            });
                        }
                        this.restrict_list = [];
                        this.getNotes(this.user);   
                    }else{
                        this.handleCancel();
                        this.getNotes(this.user); 
                    }
                });
            }
            
        }
        showEditModal(index: number) {
            this.addOrEdit = 2;
            const { personID, recordNumber, privateFlag, whoCode, detailDate, craetor, detail, detailOriginal, extraDetail2, restrictions, alarmDate, program,discipline, careDomain, publishToApp } = this.tableData[index];
            
            if(restrictions != null)
            this.restrict_list = restrictions.split('|');
            
            if(!this.globalS.isEmpty(restrictions)){
                this.mlist.forEach(element => {
                    if(this.restrict_list.includes(element.name)){
                        element.checked = true;
                        console.log(element.name + "yes")
                    }
                });
            }
            
            this.caseFormGroup.patchValue({
                notes: detail,
                publishToApp: publishToApp,
                restrictions: '',
                restrictionsStr: this.determineRadioButtonValue(privateFlag, restrictions),
                alarmDate: alarmDate,
                program: program,
                discipline: discipline,
                careDomain: careDomain,
                category: extraDetail2,
                recordNumber: recordNumber
            });
            this.modalOpen = true;
            this.cd.detectChanges();
        }
        
        determineRadioButtonValue(privateFlag: Boolean, restrictions: string): string {
            if (!privateFlag && this.globalS.isEmpty(restrictions)) {
                return 'public';
            }
            
            if (!privateFlag && !this.globalS.isEmpty(restrictions)) {
                return 'restrict'
            }
            return 'workgroup';
        }
        
        // delete(index: any) {
        //     const { recordNumber } = this.tableData[index];
        
        //     this.clientS.deleteopnotes(recordNumber).subscribe(data => {
        //         this.globalS.sToast('Success', 'Note deleted');
        //         this.handleCancel();
        //         this.getNotes(this.user);
        //     });
        // }
        listStringify(): string{
            let tempStr = '';
            this.recipientStrArr.forEach((data,index,array) =>{
                array.length-1 != index ?
                tempStr+= data.trim() + '|' :
                tempStr += data.trim() ;                
            });
            return tempStr;
        }
        
        handleCancel() {
            this.modalOpen = false;
            this.caseFormGroup.reset();
        }
        
        log(event: any) {
            this.recipientStrArr = event;
        }
        
        
        checkChange(event: any, index: number) {
            console.log(index);
        }
    }
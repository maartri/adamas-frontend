import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, recurringInt, recurringStr, PrintService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject, EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';


import { Reminders } from '@modules/modules';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { isSameDay } from 'date-fns';


import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import * as groupArray from 'group-array';


const defaultForm: any = {
    recordNumber: 0,
    personID: '',
    listOrder: '',
    followUpEmail:'',
    recurring: false,
    recurrInt: '',
    recurrStr: '',
    notes: '',
    reminderDate: null,
    dueDate: null,
    staffAlert: null
}

@Component({
    styles: [`
    nz-table{
        margin-top:20px;
    }
    nz-select{
        width:100%;
    }
    `],
    templateUrl: './reminder.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffReminderAdmin implements OnInit, OnDestroy {
    
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;
    
    modalOpen: boolean = false;
    addOREdit: number;
    isLoading: boolean = false;
    lists: Array<any> = [];
    dateFormat: string = 'dd/MM/yyyy';
    
    dayInt = recurringInt;
    dayStr = recurringStr;
    
    private default: any = {
        recordNumber: '',
        personID: '',
        listOrder: '',
        followUpEmail: '',
        recurring: false,
        recurrInt: null,
        recurrStr: null,
        notes: '',
        reminderDate: null,
        dueDate: null,
        staffAlert: null
    }
    loading: boolean = false;
    ModalS: any;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report';

    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private printS: PrintService,
        private cd: ChangeDetectorRef,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        ) {
            cd.detach();
            
            this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data instanceof NavigationEnd) {
                    if (!this.sharedS.getPicked()) {
                        this.router.navigate(['/admin/staff/personal'])
                    }
                }
            });
            
            this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (this.globalS.isCurrentRoute(this.router, 'reminders')) {
                    this.user = data;
                    this.search(data);
                }
            });
        }
        
        ngOnInit(): void {
            this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
            this.user = this.sharedS.getPicked();
            this.loading = false;
            if(this.user){
                this.search(this.user);
                this.buildForm();
                return;
            }
            this.router.navigate(['/admin/staff/personal'])
        }
        
        ngOnDestroy(): void {
            this.unsubscribe.next();
            this.unsubscribe.complete();
        }
        
        buildForm() {

            this.inputForm = this.formBuilder.group({
                recordNumber: 0,
                personID: '',
                listOrder: '',
                followUpEmail: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
                recurring: false,
                recurrInt: '',
                recurrStr: '',
                notes: '',
                reminderDate: null,
                dueDate: null,
                staffAlert: ['', [Validators.required]]
            });
            
            this.inputForm.controls['recurrStr'].disable();
            this.inputForm.controls['recurrInt'].disable();
            
            this.inputForm.get('recurring').valueChanges.subscribe(data => {
                if(!data){
                    this.inputForm.controls['recurrInt'].setValue(null)
                    this.inputForm.controls['recurrStr'].setValue(null)
                    this.inputForm.controls['recurrStr'].disable()
                    this.inputForm.controls['recurrInt'].disable()
                } else {
                    this.inputForm.controls['recurrStr'].enable()
                    this.inputForm.controls['recurrInt'].enable()
                }
            })
        }

        resetForm(){
            this.inputForm.reset(defaultForm);
        }
        
        search(user: any = this.user) {
            this.cd.reattach();
            this.isLoading = true;
            this.timeS.getreminders(user.code).subscribe(data => {
                this.tableData = data;
                this.originalTableData = data;

                this.isLoading = false;
                this.cd.detectChanges();
            });
            
            this.listS.getlistreminders().subscribe(data => this.lists = data)
        }
        
        trackByFn(index, item) {
            return item.id;
        }
        
        save() {
            if (!this.globalS.IsFormValid(this.inputForm))
            return;
            
            const remGroup = this.inputForm.value;
            const reminderDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(remGroup.reminderDate);
            const dueDate = this.globalS.VALIDATE_AND_FIX_DATETIMEZONE_ANOMALY(remGroup.dueDate);
            
            const reminder: Reminders = {
                recordNumber: remGroup.recordNumber,
                personID: this.user.id,
                name: remGroup.staffAlert,
                address1: remGroup.recurring ? remGroup.recurrInt : '',
                address2: remGroup.recurring ? remGroup.recurrStr : '',
                email: remGroup.followUpEmail,  
                date1: reminderDate,
                date2: dueDate,
                state: remGroup.listOrder,
                notes: remGroup.notes,
                recurring: remGroup.recurring,
                sameDate:false,
                sameDay:false,
                creator:"",
            }

            console.log(reminder)

                   
            if(this.addOREdit == 1){
                this.timeS.postreminders(reminder).pipe(
                    takeUntil(this.unsubscribe))
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Data added');
                        this.search();
                        this.handleCancel();
                    })
                }
                
                if (this.addOREdit == 0) {
                    this.timeS.updatereminders(reminder).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                        this.globalS.sToast('Success', 'Data updated');
                        this.search();
                        this.handleCancel();
                    });
                }
            }
            
            showAddModal() {
                this.modalOpen = true;
                this.resetForm();
                this.addOREdit = 1;
            }
            
            showEditModal(index: any) {
                this.addOREdit = 0;
                const { recordNumber, personID, alert, reminderDate, dueDate, address1, address2, recurring, state, email, notes} = this.tableData[index];
                
                this.inputForm.patchValue({
                    recordNumber: recordNumber,
                    personID: personID,
                    staffAlert: alert,
                    reminderDate: reminderDate,
                    dueDate: dueDate,
                    recurrInt: address1,
                    recurrStr: address2,
                    recurring: recurring,
                    listOrder: state,
                    followUpEmail: email,
                    notes: notes
                });
                
                this.modalOpen = true;
            }
            
            delete(index: any) {
                const { recordNumber } = this.tableData[index];
                
                this.timeS.deletereminders(recordNumber).pipe(
                    takeUntil(this.unsubscribe))
                    .subscribe(data => {
                        if (data) {
                            this.globalS.sToast('Success', 'Data delted');
                            this.handleCancel();
                            this.search();
                        }
                    })
                }
                
                handleCancel() {        
                    this.inputForm.reset(this.default);
                    this.isLoading = false;
                    this.modalOpen = false;
                }
                handleOkTop() {
                    this.generatePdf();
                    this.tryDoctype = ""
                    this.pdfTitle = ""
                }
                handleCancelTop(): void {
                    this.drawerVisible = false;
                    this.pdfTitle = ""
                }
                generatePdf(){
                    
                    this.drawerVisible = true;
                    
                    this.loading = true;
                    
                    var fQuery = "Select Name As Field1, CONVERT(varchar, [Date1],105) As Field2, CONVERT(varchar, [Date2],105) as Field3,Notes as Field4 From HumanResources  HR INNER JOIN Staff ST ON ST.[UniqueID] = HR.[PersonID] WHERE ST.[AccountNo] = '"+this.user.code+"' AND HR.DeletedRecord = 0 AND [Group] = 'STAFFALERT' ORDER BY  RecordNumber DESC";
                    
                    const data = {
                        "template": { "_id": "0RYYxAkMCftBE9jc" },
                        "options": {
                            "reports": { "save": false },
                            "txtTitle": "Staff Reminder List",
                            "sql": fQuery,
                            "userid":this.tocken.user,
                            "head1" : "Alert",
                            "head2" : "Reminder Date",
                            "head3" : "Expiry Date",
                            "head4" : "Notes",
                        }
                    }
                    this.printS.printControl(data).subscribe((blob: any) => { 
                        let _blob: Blob = blob;
                        let fileURL = URL.createObjectURL(_blob);
                        this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                        this.loading = false;
                        this.cd.detectChanges();    
                        }, err => {
                        this.loading = false;
                        this.cd.detectChanges();
                        this.ModalS.error({
                          nzTitle: 'TRACCS',
                          nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                          nzOnOk: () => {
                            this.drawerVisible = false;
                          },
                        });
                      });
                      
                    this.cd.detectChanges();
                    this.loading = true;
                    this.tryDoctype = "";
                    this.pdfTitle = "";
                }



    originalTableData: Array<any>;
    dragOrigin: Array<string> = [];

    columnDictionary = [{
        key: 'Alert',
        value: 'alert'
    },{
        key: 'Reminder Date',
        value: 'reminderDate'
    },{
        key: 'Expiry Date',
        value: 'dueDate'
    },{
        key: 'Notes',
        value: 'notes'
    }];
    
    
    

    dragDestination = [       
        'Alert',
        'Reminder Date',
        'Expiry Date',
        'Notes'
    ];


    flattenObj = (obj, parent = null, res = {}) => {
        for (const key of Object.keys(obj)) {
            const propName = parent ? parent + '.' + key : key;
            if (typeof obj[key] === 'object') {
                this.flattenObj(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
        return res;
    }

    searchColumnDictionary(data: Array<any>, tobeSearched: string){
        let index = data.findIndex(x => x.key == tobeSearched);        
        return data[index].value;
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);            
        } else {
            if(!event.container.data.includes(event.item.data)){
                copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.container.data.length)
            }
        }
        this.generate();
    }

    generate(){
        const dragColumns = this.dragOrigin.map(x => this.searchColumnDictionary(this.columnDictionary, x));
        console.log(dragColumns)

        var convertedObj = groupArray(this.originalTableData, dragColumns);

        console.log(convertedObj)
        var flatten = this.flatten(convertedObj, [], 0);

        if(dragColumns.length == 0){
            this.tableData = this.originalTableData;
        } else {
            this.tableData = flatten;
        }
    }

    flatten(obj: any, res: Array<any> = [], counter = null){
        for (const key of Object.keys(obj)) {
            const propName = key;
            if(typeof propName == 'string'){                   
                res.push({key: propName, counter: counter});
                counter++;
            }
            if (!Array.isArray(obj[key])) {
                this.flatten(obj[key], res, counter);
                counter--;
            } else {
                res.push(obj[key]);
                counter--;
            }
        }
        return res;
    }

    removeTodo(data: any){
        this.dragOrigin.splice(this.dragOrigin.indexOf(data),1);
        this.generate();
    }

    isArray(data: any){
        return Array.isArray(data);
    }
    
    isSome(data: any){
        if(data){
            return data.some(d => 'key' in d);
        }
        return true;        
    }
}
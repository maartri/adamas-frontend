import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, PrintService } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import * as groupArray from 'group-array';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
    `],
    templateUrl: './training.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffTrainingAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    tableData: Array<any>;
    loading: boolean = false;
    tocken: any;
    pdfTitle: string;
    tryDoctype: any;
    drawerVisible: boolean =  false;
    rpthttp = 'https://www.mark3nidad.com:5488/api/report'
    constructor(
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private listS: ListService,
        private router: Router,
        private globalS: GlobalService,
        private formBuilder: FormBuilder,
        private modalService: NzModalService,
        private printS:PrintService,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private ModalS: NzModalService,
        private cd: ChangeDetectorRef
    ) {

        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'training')) {
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
        this.user = this.sharedS.getPicked();
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

        });
    }

    search(user: any) {
        this.loading = true;
        this.timeS.gettraining(user.code).subscribe(data => {
            this.tableData = data;
            this.originalTableData = data;

            this.loading = false;
            this.detectChanges();
        });

    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {

    }

    detectChanges(){
        this.cd.detectChanges();
        this.cd.markForCheck();
    }

    showEditModal(index: any) {

    }

    delete(data: any) {

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
        
        var fQuery = "SELECT CONVERT(varchar, [Date],105) as Field1, CONVERT(varchar, [Service Type],105) AS Field2, CONVERT(varchar, [Anal],105) AS Field3, Notes as Field4 FROM Roster INNER JOIN ItemTypes ON Roster.[Service Type] = ItemTypes.[Title] WHERE [Carer Code] = '"+this.user.code+"' AND MinorGroup = 'TRAINING' ORDER BY DATE Desc";
        // var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,CONVERT(varchar, [EndDate],105) as Field3 from DataDomains where Domain='BRANCHES'"
        // console.log(fQuery);
      
        const data = {
            "template": { "_id": "0RYYxAkMCftBE9jc" },
            "options": {
                "reports": { "save": false },
                "txtTitle": "Training List",
                "sql": fQuery,
                "userid":this.tocken.user,
                "head1" : "Date",
                "head2" : "Training",
                "head3" : "Expiry Date",
                "head4" : "Notes",
            }
        }
        console.log("compiled after data")
        this.printS.printControl(data).subscribe((blob: any) => {
                            let _blob: Blob = blob;
                            let fileURL = URL.createObjectURL(_blob);
                            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                            this.loading = false;
                            this.cd.detectChanges();
                        }, err => {
                            console.log(err);
                            this.loading = false;
                            this.ModalS.error({
                                nzTitle: 'TRACCS',
                                nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
                                nzOnOk: () => {
                                    this.drawerVisible = false;
                                },
                            });
                        });
    //    this.loading = true;
     //  this.tryDoctype = "";
     //   this.pdfTitle = "";
    }


    originalTableData: Array<any>;
    dragOrigin: Array<string> = [];

    columnDictionary = [{
        key: 'Date',
        value: 'date'
    },{
        key: 'Training',
        value: 'training'
    },{
        key: 'Expiry Date',
        value: 'expiryDate'
    },{
        key: 'Notes',
        value: 'notes'
    }];
    
    
    

    dragDestination = [       
        'Date',
        'Training',
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
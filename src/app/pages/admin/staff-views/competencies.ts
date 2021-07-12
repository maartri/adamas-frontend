import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';

// import setHours from 'date-fns/set_hours';

@Component({
    styles: [`
        nz-table{
            margin-top:20px;
        }
        nz-select{
            width: 100%;
        }
    `],
    templateUrl: './competencies.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffCompetenciesAdmin implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    inputForm: FormGroup;
    skillsForm: FormGroup;
    tableData: Array<any>;
    loading: boolean = false;

    modalOpen: boolean = false;
    skillModal:boolean = false;
    current: number = 0;
    competencies: Array<any>;

    dateFormat: string = 'dd/MM/yyyy';

    postLoading: boolean = false;

    isUpdate: boolean = false;
    skills: any;
    titleskillsForm: FormGroup;
    updateString: string;

    addOREdit: number;

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
                    this.router.navigate(['/admin/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'competencies')) {
                this.cd.reattach();      
                
                this.user = data;
                this.search(this.user);

                this.cd.detectChanges();
            }
        });
    }

    ngOnInit(): void {
        this.cd.reattach();

        this.user = this.sharedS.getPicked();
        if(this.user){
            this.search(this.user);
            this.buildForm();
            this.populateDropDowns(); 
            return;
        }
        this.router.navigate(['/admin/staff/personal']);
   }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    buildForm() {
        this.inputForm = this.formBuilder.group({
            recordNumber: null,
            expiryDate: null,
            reminderDate: null,
            competency: '',
            certReg: '',
            mandatory: false,
            notes: ''
        });
        this.skillsForm = this.formBuilder.group({
            CompetencyException:false,
            EmailCompetencyReminders:false,
        });
        this.titleskillsForm = this.formBuilder.group({
            identifer:'',
            recordNumber:'',
        });
    }

    search(user: any = this.user) {
        this.loading = true;
        this.timeS.getcompetencies(user.code).subscribe(data => {
            this.tableData = data;
            this.loading = false;
            this.cd.detectChanges();
        });
        this.listS.getcompetenciesheader(user.id).subscribe(data =>{
            console.log(data);
            this.skillsForm.patchValue({
                CompetencyException:data[0].competencyException,
                EmailCompetencyReminders:data[0].emailCompetencyReminders,
            })
        });
    }

    trackByFn(index, item) {
        return item.id;
    }

    showAddModal() {
        this.resetModal();      
        this.modalOpen = true;
        this.addOREdit = 1;
    }
    showUpdateModal(data:any){
        this.skillModal  = true;
        this.titleskillsForm.patchValue({
            identifer:data.text,
            recordNumber:data.sqlid,
        });
    }
    updateSkills(){
        this.skillsForm.value;
        const input = this.titleskillsForm.value;
        this.timeS.updateSkills(input).pipe(takeUntil(this.unsubscribe)).subscribe(data => {            
            this.globalS.sToast('Success', 'Update Skill Title');
            this.handleCancel();
            this.populateDropDowns();
        });
    }
    showEditModal(index: any) {
        this.isUpdate = true;
        this.current = 0;
        this.modalOpen = true;
        this.addOREdit = 0;

        const { 
            recordNumber, 
            expiryDate, 
            certReg, 
            competency, 
            mandatory,
            notes, 
            reminderDate
         } = this.tableData[index];

        this.inputForm.patchValue({
            recordNumber: recordNumber,
            expiryDate: expiryDate,
            reminderDate: reminderDate,
            competency: competency,
            certReg: certReg,
            mandatory: mandatory,
            notes: notes
        });
    }

    handleCancel() {
        this.modalOpen = false;
        this.skillModal= false;
    }

    delete(data: any) {
        this.timeS
            .deletecompetency(data.recordNumber)
            .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                if (data) {
                    this.globalS.sToast('Success', 'Data Deleted!');
                    this.search(this.user);
                    return;
                }
            });
    }

    resetModal() {
        this.current = 0;
        this.inputForm.reset();
        this.postLoading = false;
    }

    populateDropDowns(): void {
        this.timeS
            .getcompetenciesall()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(data => this.competencies = data)

            this.listS.getskills().subscribe(data => {
                this.skills = data
                this.cd.detectChanges();
            });
            console.log(this.skills);
    }

    pre(): void {
        this.current -= 1;
    }

    next(): void {
        this.current += 1;
    }

    save() {
        this.postLoading = true;
        const input = this.inputForm.value;
        console.log(input)
        if(this.isUpdate){
            this.timeS.updatecompetency(input, input.recordNumber).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                this.globalS.sToast('Success','Changes saved');
                this.search();
            });
            this.isUpdate = false;
        } else {
            this.timeS.postcompetencies(input, this.user.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => {            
                this.globalS.sToast('Success', 'Competency saved');
                this.search();
            });
        }
        
        this.handleCancel();
        this.resetModal();
    }
    changeStatus(e,typ){
        console.log(this.user.id);
        if(e.target.checked){
            if(typ == 1)
            this.updateString = "CompetencyException = 1";
            if(typ == 2)
            this.updateString = "EmailCompetencyReminders = 1";
        }else{
            if(typ == 1)
            this.updateString = "CompetencyException = 0";
            if(typ == 2)
            this.updateString = "EmailCompetencyReminders = 0";
        }
        this.timeS.updateStaffCompetenciesHeader(this.updateString,this.user.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => {            
            this.globalS.sToast('Success', 'Competency saved');
        });
    }
}
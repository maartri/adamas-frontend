import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes,sbFieldsSkill} from '@services/index';
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
    skillsModified:Array<any> = [];
    titleskillsForm: FormGroup;
    updateString: string;
    sbFieldsSkill:any;
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
            this.sbFieldsSkill = sbFieldsSkill;
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
            SBSB1  : false,
            SBSB2  : false,
            SBSB3  : false,
            SBSB4  : false,
            SBSB5  : false,
            SBSB6  : false,
            SBSB7  : false,
            SBSB8  : false,
            SBSB9  : false,
            SBSB10 : false,
            SBSB11 : false,
            SBSB12 : false,
            SBSB13 : false,
            SBSB14 : false,
            SBSB15 : false,
            SBSB16 : false,
            SBSB17 : false,
            SBSB18 : false,
            SBSB19 : false,
            SBSB20 : false,
            SBSB21 : false,
            SBSB22 : false,
            SBSB23 : false,
            SBSB24 : false,
            SBSB25 : false,
            SBSB26 : false,
            SBSB27 : false,
            SBSB28 : false,
            SBSB29 : false,
            SBSB30 : false,
            SBSB31 : false,
            SBSB32 : false,
            SBSB33 : false,
            SBSB34 : false,
            SBSB35 : false,
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
                SBSB1:data[0].sB1,
                SBSB2:data[0].sB2,
                SBSB3:data[0].sB3,
                SBSB4:data[0].sB4,
                SBSB5:data[0].sB5,
                SBSB6:data[0].sB6,
                SBSB7:data[0].sB7,
                SBSB8:data[0].sB8,
                SBSB9:data[0].sB9,
                SBSB10:data[0].sB10,
                SBSB11:data[0].sB11,
                SBSB12:data[0].sB12,
                SBSB13:data[0].sB13,
                SBSB14:data[0].sB14,
                SBSB15:data[0].sB15,
                SBSB16:data[0].sB16,
                SBSB17:data[0].sB17,
                SBSB18:data[0].sB18,
                SBSB19:data[0].sB19,
                SBSB20:data[0].sB20,
                SBSB21:data[0].sB21,
                SBSB22:data[0].sB22,
                SBSB23:data[0].sB23,
                SBSB24:data[0].sB24,
                SBSB25:data[0].sB25,
                SBSB26:data[0].sB26,
                SBSB27:data[0].sB27,
                SBSB28:data[0].sB28,
                SBSB29:data[0].sB29,
                SBSB30:data[0].sB30,
                SBSB31:data[0].sB31,
                SBSB32:data[0].sB32,
                SBSB33:data[0].sB33,
                SBSB34:data[0].sB34,
                SBSB35:data[0].sB35,
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
    changeSbField(e,skill,sb){
        this.updateString = '';
        let formInputName = this.getName(skill);
        if(e.target.checked){
            this.updateString = " "+formInputName+" = 1 " ;
        }else
        {
            this.updateString = " "+formInputName+" = 0 " ;
        }

        this.timeS.updateStaffCompetenciesSkill(this.updateString,this.user.id).pipe(takeUntil(this.unsubscribe)).subscribe(data => {            
            this.globalS.sToast('Success', 'Competency saved');
        });
        this.updateString = '';
    }
    
    getName(skill){
        return this.sbFieldsSkill[skill.identifier];
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
                this.skills = data ; 

                this.skills.forEach(x => {
                    this.skillsModified.push({
                        identifier  : x.identifier,
                        text        : x.text,
                        sqlid       : x.sqlid,
                        title       : this.sbFieldsSkill[x.identifier]
                    })
                });
                console.log(this.skillsModified);
                
                this.cd.detectChanges();
            });
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
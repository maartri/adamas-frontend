import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, ClientService,expectedOutcome, dateFormat } from '@services/index';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: '',
    templateUrl: './goals.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class IntakeGoals implements OnInit, OnDestroy {
    
    private unsubscribe: Subject<void> = new Subject();
    user: any;
    dateFormat: string = dateFormat;
    loading: boolean = false;
    postLoading: boolean = false;
    modalOpen: boolean = false;
    addOREdit: number;
    inputForm: FormGroup;
    tableData: Array<any> = [];
    alist: Array<any> = [];
    tabFindIndex: number;
    goalsAndStratergiesForm: FormGroup;
    stratergiesForm: FormGroup;
    personIdForStrategy: any;
    expecteOutcome: string[];
    quotePlanType: any;
    plangoalachivementlis: any;
    isUpdateGoal: any;
    goalAndStrategiesmodal: boolean;
    isUpdateStrategy: any;
    strategiesmodal: boolean;
    goalsAndStratergies: any;
    stratergiesList: any;
    goalOfCarelist: any;
    
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
                if (this.globalS.isCurrentRoute(this.router, 'goals')) {
                    this.user = data;
                    this.search(data);
                }
            });
        }
        
        ngOnInit(): void {
            this.user = this.sharedS.getPicked();
            this.search(this.user);
            this.buildForm();
            this.populateDropdDowns();
        }
        
        ngOnDestroy(): void {
            this.unsubscribe.next();
            this.unsubscribe.complete();
        }
        
        trackByFn(index, item) {
            return item.id;
        }
        
        
        search(user: any = this.user) {
            this.cd.reattach();
            
            this.loading = true;
            this.timeS.getgoals(user.id).subscribe(goals => {
                this.loading = false;
                this.tableData = goals;
                this.cd.markForCheck();
            });
        }
        populateDropdDowns() {
            
            this.expecteOutcome = expectedOutcome;
            this.listS.getcareplan().subscribe(data => {this.quotePlanType = data;})
            
            this.listS.getplangoalachivement().subscribe(data=> this.plangoalachivementlis = data)
            this.cd.markForCheck();
        }
        detectChanges() {
            throw new Error('Method not implemented.');
        }
        buildForm() {
            this.goalsAndStratergiesForm = this.formBuilder.group({
                recordnumber:null,
                goal:'',
                PersonID:this.user.id,
                title : "Goal Of Care : ",
                ant   : null,
                lastReview : null,
                completed:null,
                percent : null,
                achievementIndex:'',
                notes:'',
                dateAchieved:null,
                lastReviewed:null,
                achievementDate:null,
                achievement:'',
            });
            
            this.stratergiesForm = this.formBuilder.group({
                detail:'',
                PersonID:this.personIdForStrategy,
                outcome:null,
                strategyId:'',
                serviceTypes:'',
                recordNumber:'',
            });
        }
        saveCarePlan(){
            
            if(!this.isUpdateGoal){
                this.timeS.postgoals(this.goalsAndStratergiesForm.value).pipe(
                    takeUntil(this.unsubscribe))
                    .subscribe(data => {
                        this.globalS.sToast('Success', 'Data Inserted');
                        this.goalAndStrategiesmodal = false;
                        // this.listCarePlanAndGolas();
                        this.search(this.user)
                        this.cd.markForCheck();
                    });
                }else{
                    this.timeS.updategoals(this.goalsAndStratergiesForm.value).pipe(
                        takeUntil(this.unsubscribe))
                        .subscribe(data => {
                            this.globalS.sToast('Success', 'Data Inserted');
                            this.goalAndStrategiesmodal = false;
                            // this.listCarePlanAndGolas();
                            this.search(this.user)
                            this.isUpdateGoal = false;
                            this.cd.markForCheck();
                            
                        });
                    }
                    this.cd.markForCheck();
                }
                
                
                saveStrategy(){
                    this.stratergiesForm.controls.PersonID.setValue(this.personIdForStrategy);
                    if(!this.isUpdateStrategy){
                        this.timeS.postplanStrategy(this.stratergiesForm.value).pipe(
                            takeUntil(this.unsubscribe))
                            .subscribe(data => {
                                this.globalS.sToast('Success', 'Data Inserted');
                                this.strategiesmodal = false;
                                this.listStrtegies(this.personIdForStrategy);
                                this.cd.markForCheck();
                            });
                        }else{
                            this.timeS.updateplanStrategy(this.stratergiesForm.value).pipe(
                                takeUntil(this.unsubscribe))
                                .subscribe(data => {
                                    this.globalS.sToast('Success', 'Data Inserted');
                                    this.strategiesmodal = false;
                                    this.listStrtegies(this.personIdForStrategy);
                                    this.cd.markForCheck();
                                });
                            }
                            this.cd.markForCheck();
                        }
                        
                        // listCarePlanAndGolas(){
                        //     this.loading = true;
                        //     this.listS.getCareplangoals('45976').subscribe(data => {
                        //         this.goalsAndStratergies = data;
                        //         this.loading = false;
                        //         this.cd.markForCheck();
                        //     });
                        // }
                        
                        listStrtegies(personID:any){
                            this.loading = true;
                            this.listS.getStrategies(personID).subscribe(data => {
                                this.stratergiesList = data;
                                this.loading = false;
                                this.cd.markForCheck();
                            });
                        }
                        
                        deleteCarePlanGoal(data: any){
                            this.timeS.deletegoals(data.recordNumber)
                            .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                                if (data) {
                                    this.globalS.sToast('Success', 'Data Deleted!');
                                    this.search(this.user);
                                    this.cd.markForCheck();
                                    return;
                                }
                                this.cd.markForCheck();
                            });
                        }
                        
                        deleteCarePlanStrategy(data: any){
                            this.timeS.deleteCarePlanStrategy(data.recordnumber)
                            .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
                                if (data) {
                                    this.globalS.sToast('Success', 'Data Deleted!');
                                    this.listStrtegies(this.personIdForStrategy);
                                    this.cd.markForCheck();
                                    return;
                                }
                                this.cd.markForCheck();
                            });
                        }
                        
                        
                        showCarePlanStrategiesModal(){
                            this.goalAndStrategiesmodal = true;
                            this.personIdForStrategy = '';
                            this.listS.getgoalofcare().subscribe(data => this.goalOfCarelist = data);
                        }
                        
                        showStrategiesModal(){
                            this.stratergiesForm.patchValue({
                                detail:'',
                                outcome:'',
                                strategyId:'',
                            });
                            this.isUpdateStrategy = false;
                            this.strategiesmodal = true;
                        }
                        
                        showEditCarePlanModal(data:any){
                            this.goalAndStrategiesmodal = true;
                            this.isUpdateGoal = true;
                            this.isUpdateGoal = true;
                            this.listStrtegies(data.recordNumber);
                            this.personIdForStrategy = data.recordNumber;
                            this.goalsAndStratergiesForm.patchValue({
                                title : "Goal Of Care : ",
                                goal  : data.goal,
                                achievementDate  : data.achievementDate,
                                dateAchieved     : data.dateAchieved,
                                lastReviewed     : data.lastReviewed,
                                achievementIndex : data.achievementIndex,
                                achievement      : data.achievement,
                                notes            : data.notes,
                                recordnumber     : data.recordNumber,
                            })
                        }
                        
                        showEditStrategyModal(data:any){
                            this.isUpdateStrategy = true;
                            this.strategiesmodal = true;
                            this.stratergiesForm = this.formBuilder.group({
                                detail:data.strategy,
                                PersonID:data.recordnumber,
                                outcome:data.achieved,
                                strategyId:data.contractedId,
                                serviceTypes:data.dsServices,
                                recordNumber:data.recordnumber,
                            });
                        }
                        save() {
                            
                        }
                        
                        showEditModal(index: number) {
                            
                        }
                        
                        delete(index: number) {
                            
                        }
                        
                        handleCancel() {
                            
                        }
                        handlegoalsStarCancel(){
                            this.goalAndStrategiesmodal = false;
                            this.isUpdateGoal = false;
                            this.personIdForStrategy = '';
                        }
                        
                        handleStarCancel(){
                            this.strategiesmodal = false;
                            this.isUpdateStrategy = false;
                        }
                        
                        showAddModal() {
                            this.addOREdit = 1;
                            this.modalOpen = true;
                        }
                        
                        // tabFindChange(index: number){
                        //     this.tabFindIndex = index;
                        // }
                        tabFinderIndexbtn:number = 0;
                        tabFindChangeStrategies(index: number){
                            this.tabFinderIndexbtn = index;
                        }

                        


                    }
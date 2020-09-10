import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { GlobalService, ListService, TimeSheetService, ShareService, leaveTypes, statuses } from '@services/index';
import { forkJoin, Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, NG_VALUE_ACCESSOR, ControlValueAccessor, FormArray } from '@angular/forms';


@Component({
    styles: [`
      .card-container{
          margin-top:2rem;
      }
      nz-select{
          width:100%;
      }
      .checkboxes label{
        width:23rem;
        margin-top:15px;
      }
      tbody.hours tr td:first-child{
          width: 10rem;
      }
      tbody.work-chart tr td{
          width:3rem;
      }
      tbody.work-chart tr td:not(:first-child){
          text-align:center;
      }
    `],
    templateUrl: './pay.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffPayAdmin implements OnInit, OnDestroy {

    private unsubscribe: Subject<void> = new Subject();
    user: any;

    date: Date = new Date();
    checked: any;

    statuses: Array<string> = statuses;
    awardsArr: Array<any> = [];
    staffsArr: Array<any> = [];

    payGroup: FormGroup;

    constructor(
        private listS: ListService,
        private timeS: TimeSheetService,
        private globalS: GlobalService,
        private cd: ChangeDetectorRef,
        private sharedS: ShareService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) {

        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (data instanceof NavigationEnd) {
                if (!this.sharedS.getPicked()) {
                    this.router.navigate(['/staff-direct/staff/personal'])
                }
            }
        });

        this.sharedS.changeEmitted$.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
            if (this.globalS.isCurrentRoute(this.router, 'leave')) {
                this.user = data;
                this.search(data);
            }
        });
    }

    ngOnInit(): void {
        this.user = this.sharedS.getPicked();
        if(this.user){
            this.search(this.user);
            this.buildForm();
            this.populateDropdDowns();
            return;
        }
        this.router.navigate(['/staff-direct/staff/personal'])


    }

    ngOnDestroy(): void {
        
    }

    onChange(event: any) {
        
    }

    search(user: any = this.user) {
        this.timeS.getpaydetails(user.id)
            .subscribe(data => {
                this.payGroup.patchValue(data)
            });
    }

    onKeyPress(data: KeyboardEvent) {
        return this.globalS.acceptOnlyNumeric(data);
    }

    buildForm() {
        this.payGroup = this.formBuilder.group({
            accountNo: "",
            award: "",
            awardLevel: "",
            cH_1_1: "",
            cH_1_2: "",
            cH_1_3: "",
            cH_1_4: "",
            cH_1_5: "",
            cH_1_6: "",
            cH_1_7: "",
            cH_2_1: "",
            cH_2_2: "",
            cH_2_3: "",
            cH_2_4: "",
            cH_2_5: "",
            cH_2_6: "",
            cH_2_7: "",
            caldStatus: "",
            caseManager: false,
            category: "",
            commencementDate: "",
            contactIssues: "",
            cstda_DisabilityGroup: "",
            cstda_Indiginous: "",
            cstda_OtherDisabilities: null,
            dLicence: "",
            dob: "",
            emailTimesheet: false,
            employeeOf: "",
            excludeClientAdminFromPay: false,
            excludeFromPayExport: false,
            filePhoto: "",
            firstName: "",
            gender: "",
            hrS_DAILY_MAX: "",
            hrS_DAILY_MIN: "",
            hrS_FNIGHTLY_MAX: "",
            hrS_FNIGHTLY_MIN: "",
            hrS_WEEKLY_MAX: "",
            hrS_WEEKLY_MIN: "",
            includeLaundry: false,
            includeUniform: false,
            isRosterable: false,
            jobFTE: null,
            jobStatus: "",
            jobTitle: "",
            jobWeighting: null,
            lastName: "",
            middleNames: "",
            nRegistration: "",
            pan_Manager: "",
            payGroup: "",
            preferredName: "",
            publicHolidayRegion: "",
            rating: "",
            serviceRegion: "",
            sqlid: null,
            stF_CODE: "",
            staffGroup: "",
            staffTeam: "",
            stf_Code: "",
            stf_Department: "",
            subCategory: "",
            superFund: "",
            superPercent: "",
            terminationDate: null,
            title: "",
            ubdMap: "",
            uniqueID: "",
            vRegistration: "",
        })
    }

    populateDropdDowns() {
        this.listS.getawards().subscribe(data => this.awardsArr = data);

        this.timeS.getstaff({
            User: this.globalS.decode().nameid,
            SearchString: ''
        }).subscribe(data => {
            this.staffsArr = data;
        }); 
    }

    updateWorkHours(){
        this.timeS.updateworkhours(this.payGroup.value).pipe(
            takeUntil(this.unsubscribe))
            .subscribe(data => {
                this.globalS.sToast('Success', 'Data Updated');
            });
    }

    

}
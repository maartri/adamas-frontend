import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router';
import { BillingService, GlobalService, ListService } from '@services/index';
import { takeUntil, timeout } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

@Component({
    templateUrl: './glance.html',
    styles: [`
          
    .btn{
        border:none;
        cursor:pointer;
        outline:none;
        transition: background-color 0.5s ease;
        padding: 5px 7px;
        border-radius: 3px;
        text-align: center !important;
        width: 100px !important;
    }
    label{
        font-weight: bold; 
    }
    
    .form-group label{
        font-weight: bold;
    }
    nz-select{
        width:100%;
        
    }
    label.checks{
        margin-top: 4px;
        font-weight: 300 !important;
    }
    nz-date-picker{
        margin:5pt;
    }
    .frm_number{
        width:250px;
        height:32px;

    }
    .frm_AgingNumber{
        width:50px;
        height:32px;
    }
    .spinner{
        margin:1rem auto;
        width:1px;
    }
    
`]
})
export class GlanceAdmin implements OnInit, OnDestroy, AfterViewInit {

    dateFormat: string = 'dd/MM/yyyy';
    loading: boolean = false;
    inputForm: FormGroup;
    dtpStartDate: any;
    dtpEndDate: any;
    private unsubscribe: Subject<void> = new Subject();
    companyName: any;
    dataInputOutput: Array<any>;
    statesTA: number = 0;
    statesAIP: number = 0;
    fundingTA: number = 0;
    fundingAIP: number = 0;
    sProviderTA: number = 0;
    sProviderAIP: number = 0;
    dsOutletTA: number = 0;
    dsOutletAIP: number = 0;
    branchesTA: number = 0;
    branchesAIP: number = 0;
    fundingTypeTA: number = 0;
    fundingTypeAIP: number = 0;
    careDomainTA: number = 0;
    careDomainAIP: number = 0;
    serviceBudgetTA: number = 0;
    serviceBudgetAIP: number = 0;
    serviceDispTA: number = 0;
    serviceDispAIP: number = 0;
    serviceRegionTA: number = 0;
    serviceRegionAIP: number = 0;
    serviceTypeTA: number = 0;
    serviceTypeAIP: number = 0;
    programTA: number = 0;
    programAIP: number = 0;
    coordnatorTA: number = 0;
    coordnatorAIP: number = 0;
    costCenterTA: number = 0;
    costCenterAIP: number = 0;
    recipientTA: number = 0;
    recipientAIP: number = 0;
    staffTA: number = 0;
    staffAIP: number = 0;
    staffCategoryTA: number = 0;
    staffCategoryAIP: number = 0;
    teamTA: number = 0;
    teamAIP: number = 0;

    totalOutHour: number = 0;
    noRecipient: number = 0;
    totalWorkHour: number = 0;
    totalWorkAttrHour: number = 0;
    staffUtilize: number = 0;
    noStaff: number = 0;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private listS: ListService,
        private billingS: BillingService,
        private globalS: GlobalService,
    ) { }
    ngOnInit(): void {
        this.buildForm();
        this.populateDropDown();
        this.getCompanyName();
        this.refreshValues();
    }
    buildForm() {
        this.inputForm = this.formBuilder.group({
            dtpStartDate: this.dtpStartDate = startOfMonth(new Date()),
            dtpEndDate: this.dtpEndDate = endOfMonth(new Date()),
            name: null,
            inputOutput: 'Service Outputs',
            companyName: this.companyName
        });
    }
    ngAfterViewInit(): void {

    }
    onChange(result: Date): void {
        // console.log('onChange: ', result);
    }
    ngOnDestroy(): void {
    }
    populateDropDown() {
        // this.statesList = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
        this.dataInputOutput = ['Service Outputs', 'Staff Inputs'];
    }
    getCompanyName() {
        let sql = "SELECT TOP 1 CoName as CompanyName FROM Registration";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.companyName = data;
            this.loading = false;
        });
    }

    getActiveFundingRegions() {
        let sql = "SELECT Count(Distinct Suburb) AS fundingRegTotal FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND EndDate IS NULL";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.fundingTA = data[0].fundingRegTotal;
                this.inputForm.patchValue({
                    fundingTA: this.fundingTA,
                })
        });
    }

    getActiveServiceProvider() {
        let sql = "SELECT Count(Distinct Address1) AS serviceProvTotal FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND EndDate IS NULL";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.sProviderTA = data[0].serviceProvTotal;
                this.inputForm.patchValue({
                    sProviderTA: this.sProviderTA,
                })
        });
    }

    getActiveDsOutlets() {
        let sql = "SELECT Count(DISTINCT CSTDAOutletID) AS dsOutletTotal FROM ItemTypes";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.dsOutletTA = data[0].dsOutletTotal;
                this.inputForm.patchValue({
                    dsOutletTA: this.dsOutletTA,
                })
        });
    }

    getActiveBranches() {
        let sql = "SELECT Count(RecordNumber) AS branchTotal FROM DataDomains WHERE Domain = 'BRANCHES'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.branchesTA = data[0].branchTotal;
                this.inputForm.patchValue({
                    branchesTA: this.branchesTA,
                })
        });
    }

    getActiveFundingType() {
        let sql = "SELECT Count(RecordNumber) AS fundingTypeTotal FROM DataDomains WHERE Domain = 'FUNDINGBODIES'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.fundingTypeTA = data[0].fundingTypeTotal;
                this.inputForm.patchValue({
                    fundingTypeTA: this.fundingTypeTA,
                })
        });
    }

    getActiveCareDomains() {
        let sql = "SELECT Count(RecordNumber) AS careDomainTotal FROM DataDomains WHERE Domain = 'CAREDOMAIN'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.careDomainTA = data[0].careDomainTotal;
                this.inputForm.patchValue({
                    careDomainTA: this.careDomainTA,
                })
        });
    }

    getActiveServiceBudget() {
        let sql = "SELECT Count(RecordNumber) AS serviceBudgetTotal FROM DataDomains WHERE Domain = 'BUDGETGROUP'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.serviceBudgetTA = data[0].serviceBudgetTotal;
                this.inputForm.patchValue({
                    serviceBudgetTA: this.serviceBudgetTA,
                })
        });
    }

    getActiveServiceDiscip() {
        let sql = "SELECT Count(RecordNumber) AS serviceDiscipTotal FROM DataDomains WHERE Domain = 'DISCIPLINE'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.serviceDispTA = data[0].serviceDiscipTotal;
                this.inputForm.patchValue({
                    serviceDispTA: this.serviceDispTA,
                })
        });
    }

    getActiveServiceRegions() {
        let sql = "SELECT Count(RecordNumber) AS serviceRegionTotal FROM DataDomains WHERE Domain = 'GROUPAGENCY'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.serviceRegionTA = data[0].serviceRegionTotal;
                this.inputForm.patchValue({
                    serviceRegionTA: this.serviceRegionTA,
                })
        });
    }

    getActiveServiceTypes() {
        let sql = "SELECT Count(Recnum) AS serviceTypeTotal FROM ItemTypes WHERE ProcessClassification = 'OUTPUT'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.serviceTypeTA = data[0].serviceTypeTotal;
                this.inputForm.patchValue({
                    serviceTypeTA: this.serviceTypeTA,
                })
        });
    }

    getActivePrograms() {
        let sql = "SELECT Count(RecordNumber) AS programTotal FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND EndDate IS NULL";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.programTA = data[0].programTotal;
                this.inputForm.patchValue({
                    programTA: this.programTA,
                })
        });
    }

    getActiveCoordinators() {
        let sql = "SELECT Count(RecordNumber) AS coordinatorTotal FROM DataDomains WHERE Domain = 'CASE MANAGERS'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.coordnatorTA = data[0].coordinatorTotal;
                this.inputForm.patchValue({
                    coordnatorTA: this.coordnatorTA,
                })
        });
    }

    getActiveCostCenters() {
        let sql = "SELECT Count(Distinct FAX) AS costCenterTotal FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND EndDate IS NULL AND (FAX IS NOT NULL) AND (FAX <> '')";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.costCenterTA = data[0].costCenterTotal;
                this.inputForm.patchValue({
                    costCenterTA: this.costCenterTA,
                })
        });
    }

    getActiveRecipients() {
        let sql = "SELECT Count(DISTINCT PersonID) AS recipientTotal FROM Recipients INNER JOIN RecipientPrograms ON UniqueID = PersonID WHERE ProgramStatus = 'ACTIVE'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.recipientTA = data[0].recipientTotal;
                this.inputForm.patchValue({
                    recipientTA: this.recipientTA,
                })
        });
    }

    getActiveStaff() {
        let sql = "SELECT Count(DISTINCT Accountno) AS staffTotal FROM Staff WHERE (([CommencementDate] IS NOT NULL) AND ([TerminationDate] IS NULL))";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.staffTA = data[0].staffTotal;
                this.inputForm.patchValue({
                    staffTA: this.staffTA,
                })
        });
    }

    getActiveStaffCategory() {
        let sql = "SELECT Count(RecordNumber) AS staffCategoryTotal FROM DataDomains WHERE Domain = 'STAFFGROUP'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.staffCategoryTA = data[0].staffCategoryTotal;
                this.inputForm.patchValue({
                    staffCategoryTA: this.staffCategoryTA,
                })
        });
    }

    getActiveTeams() {
        let sql = "SELECT Count(RecordNumber) AS teamTotal FROM DataDomains WHERE Domain = 'STAFFTEAM'";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.teamTA = data[0].teamTotal;
                this.inputForm.patchValue({
                    teamTA: this.teamTA,
                })
        });
    }

    refreshValues() {
        this.loading = true;
        this.dtpStartDate = this.inputForm.get('dtpStartDate').value;
        this.dtpEndDate = this.inputForm.get('dtpEndDate').value;

        this.dtpStartDate = formatDate(this.dtpStartDate, 'yyyy-MM-dd','en_US');
        this.dtpEndDate = formatDate(this.dtpEndDate, 'yyyy-MM-dd','en_US');

        let dataPass = {
            DateStart: this.dtpStartDate,
            DateEnd: this.dtpEndDate,
            IsWhere: null
        }

        //States
        this.billingS.getActiveStates(null).subscribe(data => {
            this.statesTA = data[0].statesTotalActive;
            this.inputForm.patchValue({
                statesTA: this.statesTA,
            })
        });
        this.billingS.getActivePeriodStates(dataPass).subscribe(data => {
            this.statesAIP = data[0].statesActiveInPeriod;
            this.inputForm.patchValue({
                statesAIP: this.statesAIP,
            })
        });

        // Funding Regions
        this.getActiveFundingRegions();
        // this.billingS.getActiveFundingRegions(null).subscribe(data => {
        //     this.fundingTA = data[0].fundingRegionsTotalActive;
        //     this.inputForm.patchValue({
        //         fundingTA: this.fundingTA,
        //     })
        // });
        this.billingS.getActivePeriodFundingRegions(dataPass).subscribe(data => {
            this.fundingAIP = data[0].fundingRegionsActiveInPeriod;
            this.inputForm.patchValue({
                fundingAIP: this.fundingAIP,
            })
        });

        //Service Provider ID's (SPID)
        this.getActiveServiceProvider();
        // this.billingS.getActiveServiceProvider(null).subscribe(data => {
        //     this.sProviderTA = data[0].serviceProviderTotalActive;
        //     this.inputForm.patchValue({
        //         sProviderTA: this.sProviderTA,
        //     })
        // });
        this.billingS.getActivePeriodServiceProvider(dataPass).subscribe(data => {
            this.sProviderAIP = data[0].serviceProviderActiveInPeriod;
            this.inputForm.patchValue({
                sProviderAIP: this.sProviderAIP,
            })
        });

        //DS Outlets
        this.getActiveDsOutlets();
        // this.billingS.getActiveDsOutlets(null).subscribe(data => {
        //     this.dsOutletTA = data[0].dsOutletsTotalActive;
        //     this.inputForm.patchValue({
        //         dsOutletTA: this.dsOutletTA,
        //     })
        // });
        this.billingS.getActivePeriodDsOutlets(dataPass).subscribe(data => {
            this.dsOutletAIP = data[0].dsOutletsActiveInPeriod;
            this.inputForm.patchValue({
                dsOutletAIP: this.dsOutletAIP,
            })
        });

        //Branches 
        this.getActiveBranches();
        // this.billingS.getActiveBranches(null).subscribe(data => {
        //     this.branchesTA = data[0].branchesTotalActive;
        //     this.inputForm.patchValue({
        //         branchesTA: this.branchesTA,
        //     })
        // });
        this.billingS.getActivePeriodBranches(dataPass).subscribe(data => {
            this.branchesAIP = data[0].branchesActiveInPeriod;
            this.inputForm.patchValue({
                branchesAIP: this.branchesAIP,
            })
        });

        //Funding Type
        this.getActiveFundingType();
        // this.billingS.getActiveFundingType(null).subscribe(data => {
        //     this.fundingTypeTA = data[0].fundingTypeTotalActive;
        //     this.inputForm.patchValue({
        //         fundingTypeTA: this.fundingTypeTA,
        //     })
        // });
        this.billingS.getActivePeriodFundingType(dataPass).subscribe(data => {
            this.fundingTypeAIP = data[0].fundingTypeActiveInPeriod;
            this.inputForm.patchValue({
                fundingTypeAIP: this.fundingTypeAIP,
            })
        });

        //Care Domains
        this.getActiveCareDomains();
        // this.billingS.getActiveCareDomains(null).subscribe(data => {
        //     this.careDomainTA = data[0].careDomainsTotalActive;
        //     this.inputForm.patchValue({
        //         careDomainTA: this.careDomainTA,
        //     })
        // });
        this.billingS.getActivePeriodCareDomains(dataPass).subscribe(data => {
            this.careDomainAIP = data[0].careDomainsActiveInPeriod;
            this.inputForm.patchValue({
                careDomainAIP: this.careDomainAIP,
            })
        });

        //Service Budget Codes
        this.getActiveServiceBudget();
        // this.billingS.getActiveServiceBudget(null).subscribe(data => {
        //     this.serviceBudgetTA = data[0].serviceBudgetTotalActive;
        //     this.inputForm.patchValue({
        //         serviceBudgetTA: this.serviceBudgetTA,
        //     })
        // });
        this.billingS.getActivePeriodServiceBudget(dataPass).subscribe(data => {
            this.serviceBudgetAIP = data[0].serviceBudgetActiveInPeriod;
            this.inputForm.patchValue({
                serviceBudgetAIP: this.serviceBudgetAIP,
            })
        });

        //Service Disciplines
        this.getActiveServiceDiscip();
        // this.billingS.getActiveServiceDiscip(null).subscribe(data => {
        //     this.serviceDispTA = data[0].serviceDiscipTotalActive;
        //     this.inputForm.patchValue({
        //         serviceDispTA: this.serviceDispTA,
        //     })
        // });
        this.billingS.getActivePeriodServiceDiscip(dataPass).subscribe(data => {
            this.serviceDispAIP = data[0].serviceDiscipActiveInPeriod;
            this.inputForm.patchValue({
                serviceDispAIP: this.serviceDispAIP,
            })
        });

        //Service Regions
        this.getActiveServiceRegions();
        // this.billingS.getActiveServiceRegions(null).subscribe(data => {
        //     this.serviceRegionTA = data[0].serviceRegionsTotalActive;
        //     this.inputForm.patchValue({
        //         serviceRegionTA: this.serviceRegionTA,
        //     })
        // });
        this.billingS.getActivePeriodServiceRegions(dataPass).subscribe(data => {
            this.serviceRegionAIP = data[0].serviceRegionsActiveInPeriod;
            this.inputForm.patchValue({
                serviceRegionAIP: this.serviceRegionAIP,
            })
        });

        //Service Types
        this.getActiveServiceTypes();
        // this.billingS.getActiveServiceTypes(null).subscribe(data => {
        //     this.serviceTypeTA = data[0].serviceTypesTotalActive;
        //     this.inputForm.patchValue({
        //         serviceTypeTA: this.serviceTypeTA,
        //     })
        // });
        this.billingS.getActivePeriodServiceTypes(dataPass).subscribe(data => {
            this.serviceTypeAIP = data[0].serviceTypesActiveInPeriod;
            this.inputForm.patchValue({
                serviceTypeAIP: this.serviceTypeAIP,
            })
        });

        //Programs 
        this.getActivePrograms();
        // this.billingS.getActivePrograms(null).subscribe(data => {
        //     this.programTA = data[0].programsTotalActive;
        //     this.inputForm.patchValue({
        //         programTA: this.programTA,
        //     })
        // });
        this.billingS.getActivePeriodPrograms(dataPass).subscribe(data => {
            this.programAIP = data[0].programsActiveInPeriod;
            this.inputForm.patchValue({
                programAIP: this.programAIP,
            })
        });

        //Coordinators/Staff Mgrs
        this.getActiveCoordinators();
        // this.billingS.getActiveCoordinators(null).subscribe(data => {
        //     this.coordnatorTA = data[0].coordinatorsTotalActive;
        //     this.inputForm.patchValue({
        //         coordnatorTA: this.coordnatorTA,
        //     })
        // });
        this.billingS.getActivePeriodCoordinators(dataPass).subscribe(data => {
            this.coordnatorAIP = data[0].coordinatorsActiveInPeriod;
            this.inputForm.patchValue({
                coordnatorAIP: this.coordnatorAIP,
            })
        });

        //Cost Centers
        this.getActiveCostCenters();
        // this.billingS.getActiveCostCenters(null).subscribe(data => {
        //     this.costCenterTA = data[0].costCentersTotalActive;
        //     this.inputForm.patchValue({
        //         costCenterTA: this.costCenterTA,
        //     })
        // });
        this.billingS.getActivePeriodCostCenters(dataPass).subscribe(data => {
            this.costCenterAIP = data[0].costCentersActiveInPeriod;
            this.inputForm.patchValue({
                costCenterAIP: this.costCenterAIP,
            })
        });

        //Recipients 
        this.getActiveRecipients();
        // this.billingS.getActiveRecipients(null).subscribe(data => {
        //     this.recipientTA = data[0].recipientsTotalActive;
        //     this.inputForm.patchValue({
        //         recipientTA: this.recipientTA,
        //     })
        // });
        this.billingS.getActivePeriodRecipients(dataPass).subscribe(data => {
            this.recipientAIP = data[0].recipientsActiveInPeriod;
            this.inputForm.patchValue({
                recipientAIP: this.recipientAIP,
            })
        });

        //Staff 
        this.getActiveStaff();
        // this.billingS.getActiveStaff(null).subscribe(data => {
        //     this.staffTA = data[0].staffTotalActive;
        //     this.inputForm.patchValue({
        //         staffTA: this.staffTA,
        //     })
        // });
        this.billingS.getActivePeriodStaff(dataPass).subscribe(data => {
            this.staffAIP = data[0].staffActiveInPeriod;
            this.inputForm.patchValue({
                staffAIP: this.staffAIP,
            })
        });

        //Staff Category
        this.getActiveStaffCategory();
        // this.billingS.getActiveStaffCategory(null).subscribe(data => {
        //     this.staffCategoryTA = data[0].staffCategoryTotalActive;
        //     this.inputForm.patchValue({
        //         staffCategoryTA: this.staffCategoryTA,
        //     })
        // });
        this.billingS.getActivePeriodStaffCategory(dataPass).subscribe(data => {
            this.staffCategoryAIP= data[0].staffCategoryActiveInPeriod;
            this.inputForm.patchValue({
                staffCategoryAIP: this.staffCategoryAIP,
            })
        });

        //Teams
        this.getActiveTeams();
        // this.billingS.getActiveTeams(null).subscribe(data => {
        //     this.teamTA = data[0].teamsTotalActive;
        //     this.inputForm.patchValue({
        //         teamTA: this.teamTA,
        //     })
        // });
        this.billingS.getActivePeriodTeams(dataPass).subscribe(data => {
            this.teamAIP = data[0].teamsActiveInPeriod;
            this.inputForm.patchValue({
                teamAIP: this.teamAIP,
            })
        });

    }

    // refreshValues() {
    //     let sql = "SELECT Count(Distinct Phone2) AS stTtlCount FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND EndDate IS NULL";
    //     this.loading = true;
    //     this.listS.getlist(sql).subscribe(data => {
    //         this.statesTotalActive = data[0].stTtlCount;
    //         this.inputForm.patchValue({
    //           statesTotalActive: this.statesTotalActive,
    //         })
    //     });
    // }
}


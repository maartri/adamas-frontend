import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router';
import format from 'date-fns/format';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ListService, MenuService } from '@services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Subject } from 'rxjs';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

@Component({
    templateUrl: './analyse-budget.html',
    styles: [`
        
    button{
        width: 200pt !important;
        text-align: left !important;
    }        
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
export class BudgetAdmin implements OnInit, OnDestroy, AfterViewInit {

    dateFormat: string = 'dd/MM/yyyy';
    loading: boolean = false;
    inputForm: FormGroup;
    dtpEndDate: any;
    dtpStartDate: any;
    dataInputOutput: Array<any>;
    dataApprovedUnapproved: Array<any>;
    dataServiceDollar: Array<any>;
    check: boolean = false;
    
    dataIncludedList: Array<any>;
    allDataIncluded: boolean = true;
    allDataIncludedIntermediate: boolean = false;
    selectedDataIncluded: any;
    
    statesList: Array<any>;
    allStates: boolean = true;
    allStatesIntermediate: boolean = false;
    selectedStates: any;
    branchList: Array<any>;
    allBranches: boolean = true;
    allBranchIntermediate: boolean = false;
    selectedBranches: any;
    serviceAreasList: Array<any>;
    allServiceAreas: boolean = true;
    allServiceAreasIntermediate: boolean = false;
    selectedServiceAreas: any;
    caseManagersList: Array<any>;
    allCaseManagers: boolean = true;
    allCaseManagersIntermediate: boolean = false;
    selectedCaseManagers: any;
    fundersList: Array<any>;
    allFunders: boolean = true;
    allFundersIntermediate: boolean = false;
    selectedFunders: any;
    fundingRegionsList: Array<any>;
    allFundingRegions: boolean = true;
    allFundingRegionsIntermediate: boolean = false;
    selectedFundinRegions: any;
    agencyIDList: Array<any>;
    allAgencyID: boolean = true;
    allAgencyIDIntermediate: boolean = false;
    selectedAgencyID: any;
    CSTDAOutletList: Array<any>;
    allCSTDAOutlet: boolean = true;
    allCSTDAOutletIntermediate: boolean = false;
    selectedCSTDAOutlet: any;
    agencyProgramsList: Array<any>;
    allAgencyPrograms: boolean = true;
    allAgencyProgramsIntermediate: boolean = false;
    selectedAgencyPrograms: any;
    serviceBudgetList: Array<any>;
    allServiceBudget: boolean = true;
    allServiceBudgetIntermediate: boolean = false;
    selectedServiceBudget: any;
    funderServiceList: Array<any>;
    allFunderService: boolean = true;
    allFunderServiceIntermediate: boolean = false;
    selectedFunderService: any;
    careDomainsList: Array<any>;
    allCareDomains: boolean = true;
    allCareDomainsIntermediate: boolean = false;
    selectedCareDomains: any;
    disciplinesList: Array<any>;
    allDisciplines: boolean = true;
    allDisciplinesIntermediate: boolean = false;
    selectedDisciplines: any;
    costCentersList: Array<any>;
    allCostCenters: boolean = true;
    allCostCentersIntermediate: boolean = false;
    selectedCostCenters: any;
    environmentsList: Array<any>;
    allEnvironments: boolean = true;
    allEnvironmentsIntermediate: boolean = false;
    selectedEnvironments: any;
    staffJobList: Array<any>;
    allStaffJob: boolean = true;
    allStaffJobIntermediate: boolean = false;
    selectedStaffJob: any;
    staffAdminList: Array<any>;
    allStaffAdmin: boolean = true;
    allStaffAdminIntermediate: boolean = false;
    selectedStaffAdmin: any;
    staffTeamList: Array<any>;
    allStaffTeam: boolean = true;
    allStaffTeamIntermediate: boolean = false;
    selectedStaffTeam: any;

    constructor(
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        private formBuilder: FormBuilder,
        private sanitizer: DomSanitizer,
        private modalService: NzModalService,
        private menuS: MenuService,
        private listS: ListService,
    ) { }
    ngOnInit(): void {
        this.buildForm();
        this.populateDropDown();
        this.loadDataIncluded();
        this.loadBranches();
        this.loadServiceAreas();
        this.loadCaseManagers();
        this.loadFunders();
        this.loadFundingRegions();
        this.loadAgencyID();
        this.loadCSTDAOutlet();
        this.loadAgencyProgram();
        this.loadServiceBudgetCodes();
        this.loadFunderServiceTypes();
        this.loadCareDomains();
        this.loadDisciplines();
        this.loadCostCenters();
        this.loadEnvironments();
        this.loadStaffJob();
        this.loadStaffAdmin();
        this.loadStaffTeam();
    }
    buildForm() {
        this.inputForm = this.formBuilder.group({
            inputOutput: 'Service Outputs',
            approvedUnapproved: 'Approved Only',
            serviceDollar: 'SERVICES',
            checkedMark: true,
            name: null,
            dtpStartDate: this.dtpStartDate = startOfMonth(new Date()),
            dtpEndDate: this.dtpEndDate = endOfMonth(new Date()),
        });
    }
    ngAfterViewInit(): void {

    }
    onChange(result: Date): void {
        // console.log('onChange: ', result);
    }
    view(index: number) {
        // console.log(index);
        if (index == 3) {
            this.router.navigate(['/admin/close-roster-period']);
        }
        if (index == 4) {
            this.router.navigate(['/admin/debtor-updates-exports']);
        }
    }
    ngOnDestroy(): void {
    }
    populateDropDown() {
        this.dataInputOutput = ['Service Outputs', 'Staff Inputs'];
        this.dataApprovedUnapproved = ['Approved Only', 'Unapproved Only', 'All'];
        this.dataServiceDollar = ['SERVICES', 'DOLLARS'];
        // this.statesList = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
    }

    loadDataIncluded() {
        this.dataIncludedList = ['Branch', 'Care Domain', 'Cost Centre', 'DS Outlet', 'Environment', 'Funding Region', 'Funding Type', 'Program', 'Program Coordinator', 'Recipient', 'Service Budget Code', 'Service Discipline', 'Service Region', 'Service Type', 'SPID', 'State'];
        // this.dataIncludedList = ['Branch', 'DS Outlet', 'Funding Type', 'Program'];
    }

    loadBranches() {
        this.loading = true;
        this.menuS.getlistbranches(this.check).subscribe(data => {
            this.branchList = data;
            this.loading = false;
            this.allBranches = true;
            this.updateAllCheckedFilters(2);
        });
    }

    loadServiceAreas() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'GROUPAGENCY' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.serviceAreasList = data;
            this.loading = false;
            this.allServiceAreas = true;
            this.updateAllCheckedFilters(3);
        });
    }

    loadCaseManagers() {
        let sql = "select distinct Description as Description from DataDomains WHERE Domain = 'CASE MANAGERS' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.caseManagersList = data;
            this.loading = false;
            this.allCaseManagers = true;
            this.updateAllCheckedFilters(4);
        });
    }

    loadFunders() {
        let sql = "SELECT UPPER([Description]) as DESCRIPTION FROM DataDomains WHERE [Domain] = 'FUNDINGBODIES' AND Description != 'null' AND Description != '' ORDER BY Description";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.fundersList = data;
            this.loading = false;
            this.allFunders = true;
            this.updateAllCheckedFilters(11);
        });
    }

    loadFundingRegions() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'FUNDREGION' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.fundingRegionsList = data;
            this.loading = false;
            this.allFundingRegions = true;
            this.updateAllCheckedFilters(12);
        });
    }

    loadAgencyID() {
        let sql = "SELECT Distinct Address1 AS AgencyID FROM HumanResourceTypes WHERE [GROUP] = 'PROGRAMS' AND Address1 != 'null' AND Address1 != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.agencyIDList = data;
            this.loading = false;
            this.allAgencyID = true;
            this.updateAllCheckedFilters(13);
        });
    }

    loadCSTDAOutlet() {
        let sql = "SELECT DISTINCT UPPER([ServiceOutletID]) as CSTDAOutlet FROM CSTDAOutlets WHERE (EndDate IS NULL OR EndDate > GetDate()) AND CSTDA = 1 AND ServiceOutletID != 'null' AND ServiceOutletID != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.CSTDAOutletList = data;
            this.loading = false;
            this.allCSTDAOutlet = true;
            this.updateAllCheckedFilters(14);
        });
    }

    loadAgencyProgram() {
        let sql = "SELECT DISTINCT UPPER([Name]) as ProgramName FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND (EndDate Is Null OR EndDate >= '12-17-2021') AND [Name] != 'null' AND [Name] != ''  ORDER BY [ProgramName]";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.agencyProgramsList = data;
            this.loading = false;
            this.allAgencyPrograms = true;
            this.updateAllCheckedFilters(15);
        });
    }

    loadServiceBudgetCodes() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'BUDGETGROUP' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.serviceBudgetList = data;
            this.loading = false;
            this.allServiceBudget = true;
            this.updateAllCheckedFilters(21);
        });
    }

    loadFunderServiceTypes() {
        let sql = "Select distinct HACCType as HACCType from ItemTypes WHERE ProcessClassification = 'OUTPUT'AND Status = 'ATTRIBUTABLE' AND IT_DATASET <> 'OTHER' AND HACCType != 'null' AND HACCType != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.funderServiceList = data;
            this.loading = false;
            this.allFunderService = true;
            this.updateAllCheckedFilters(22);
        });
    }

    loadCareDomains() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'CAREDOMAIN' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.careDomainsList = data;
            this.loading = false;
            this.allCareDomains = true;
            this.updateAllCheckedFilters(31);
        });
    }

    loadDisciplines() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'DISCIPLINE' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.disciplinesList = data;
            this.loading = false;
            this.allDisciplines = true;
            this.updateAllCheckedFilters(32);
        });
    }

    loadCostCenters() {
        let sql = "SELECT DISTINCT UPPER(FAX) as Fax FROM HumanResourceTypes WHERE [Group] = 'PROGRAMS' AND FAX != 'null' AND FAX != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.costCentersList = data;
            this.loading = false;
            this.allCostCenters = true;
            this.updateAllCheckedFilters(33);
        });
    }

    loadEnvironments() {
        let sql = "SELECT Description FROM (SELECT Description, MIN(UnionSet) UnionSetOrder FROM (SELECT D.Description, 1 as UnionSet FROM DataDomains D WHERE Domain = 'ACTIVITYGROUPS' UNION ALL SELECT D.Description, 2 as UnionSet FROM DataDomains D WHERE Domain = 'VEHICLES' UNION ALL SELECT [Name], 3 as UnionSet FROM CSTDAOutlets) x GROUP BY Description) y ORDER BY UnionSetOrder, Description";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.environmentsList = data;
            this.loading = false;
            this.allEnvironments = true;
            this.updateAllCheckedFilters(34);
        });
    }

    loadStaffJob() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'STAFFGROUP' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.staffJobList = data;
            this.loading = false;
            this.allStaffJob = true;
            this.updateAllCheckedFilters(41);
        });
    }

    loadStaffAdmin() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'STAFFADMINCAT' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.staffAdminList = data;
            this.loading = false;
            this.allStaffAdmin = true;
            this.updateAllCheckedFilters(42);
        });
    }

    loadStaffTeam() {
        let sql = "Select distinct Description as Description from DataDomains WHERE Domain = 'STAFFTEAM' AND Description != 'null' AND Description != ''";
        this.loading = true;
        this.listS.getlist(sql).subscribe(data => {
            this.staffTeamList = data;
            this.loading = false;
            this.allStaffTeam = true;
            this.updateAllCheckedFilters(43);
        });
    }

    log(event: any, index: number) {
        // if (index == 1)
        //     this.selectedStates = event;
        if (index == 2)
            this.selectedBranches = event;
        if (index == 3)
            this.selectedServiceAreas = event;
        if (index == 4)
            this.selectedCaseManagers = event;
        if (index == 11)
            this.selectedFunders = event;
        if (index == 12)
            this.selectedFundinRegions = event;
        if (index == 13)
            this.selectedAgencyID = event;
        if (index == 14)
            this.selectedCSTDAOutlet = event;
        if (index == 15)
            this.selectedAgencyPrograms = event;
        if (index == 21)
            this.selectedServiceBudget = event;
        if (index == 22)
            this.selectedFunderService = event;
        if (index == 31)
            this.selectedCareDomains = event;
        if (index == 32)
            this.selectedDisciplines = event;
        if (index == 33)
            this.selectedCostCenters = event;
        if (index == 34)
            this.selectedEnvironments = event;
        if (index == 41)
            this.selectedStaffJob = event;
        if (index == 42)
            this.selectedStaffAdmin = event;
        if (index == 43)
            this.selectedStaffTeam = event;
    }

    updateSingleCheckedFilters(index: number): void {
        // if (index == 0) {
        // }
        // if (index == 1) {
        //     if (this.statesList.every(item => !item.checked)) {
        //         this.allStates = false;
        //         this.allStatesIntermediate = false;
        //     } else if (this.statesList.every(item => item.checked)) {
        //         this.allStates = true;
        //         this.allStatesIntermediate = false;
        //     } else {
        //         this.allStates = false;
        //         this.allStatesIntermediate = true;
        //     }
        // }
        if (index == 2) {
            if (this.branchList.every(item => !item.checked)) {
                this.allBranches = false;
                this.allBranchIntermediate = false;
            } else if (this.branchList.every(item => item.checked)) {
                this.allBranches = true;
                this.allBranchIntermediate = false;
            } else {
                this.allBranches = false;
                this.allBranchIntermediate = true;
            }
        }
        if (index == 3) {
            if (this.serviceAreasList.every(item => !item.checked)) {
                this.allServiceAreas = false;
                this.allServiceAreasIntermediate = false;
            } else if (this.serviceAreasList.every(item => item.checked)) {
                this.allServiceAreas = true;
                this.allServiceAreasIntermediate = false;
            } else {
                this.allServiceAreas = false;
                this.allServiceAreasIntermediate = true;
            }
        }
        if (index == 4) {
            if (this.caseManagersList.every(item => !item.checked)) {
                this.allCaseManagers = false;
                this.allCaseManagersIntermediate = false;
            } else if (this.caseManagersList.every(item => item.checked)) {
                this.allCaseManagers = true;
                this.allCaseManagersIntermediate = false;
            } else {
                this.allCaseManagers = false;
                this.allCaseManagersIntermediate = true;
            }
        }
        if (index == 11) {
            if (this.fundersList.every(item => !item.checked)) {
                this.allFunders = false;
                this.allFundersIntermediate = false;
            } else if (this.fundersList.every(item => item.checked)) {
                this.allFunders = true;
                this.allFundersIntermediate = false;
            } else {
                this.allFunders = false;
                this.allFundersIntermediate = true;
            }
        }
        if (index == 12) {
            if (this.fundingRegionsList.every(item => !item.checked)) {
                this.allFundingRegions = false;
                this.allFundingRegionsIntermediate = false;
            } else if (this.fundingRegionsList.every(item => item.checked)) {
                this.allFundingRegions = true;
                this.allFundingRegionsIntermediate = false;
            } else {
                this.allFundingRegions = false;
                this.allFundingRegionsIntermediate = true;
            }
        }
        if (index == 13) {
            if (this.agencyIDList.every(item => !item.checked)) {
                this.allAgencyID = false;
                this.allAgencyIDIntermediate = false;
            } else if (this.agencyIDList.every(item => item.checked)) {
                this.allAgencyID = true;
                this.allAgencyIDIntermediate = false;
            } else {
                this.allAgencyID = false;
                this.allAgencyIDIntermediate = true;
            }
        }
        if (index == 14) {
            if (this.CSTDAOutletList.every(item => !item.checked)) {
                this.allCSTDAOutlet = false;
                this.allCSTDAOutletIntermediate = false;
            } else if (this.CSTDAOutletList.every(item => item.checked)) {
                this.allCSTDAOutlet = true;
                this.allCSTDAOutletIntermediate = false;
            } else {
                this.allCSTDAOutlet = false;
                this.allCSTDAOutletIntermediate = true;
            }
        }
        if (index == 15) {
            if (this.agencyProgramsList.every(item => !item.checked)) {
                this.allAgencyPrograms = false;
                this.allAgencyProgramsIntermediate = false;
            } else if (this.agencyProgramsList.every(item => item.checked)) {
                this.allAgencyPrograms = true;
                this.allAgencyProgramsIntermediate = false;
            } else {
                this.allAgencyPrograms = false;
                this.allAgencyProgramsIntermediate = true;
            }
        }
        if (index == 21) {
            if (this.serviceBudgetList.every(item => !item.checked)) {
                this.allServiceBudget = false;
                this.allServiceBudgetIntermediate = false;
            } else if (this.serviceBudgetList.every(item => item.checked)) {
                this.allServiceBudget = true;
                this.allServiceBudgetIntermediate = false;
            } else {
                this.allServiceBudget = false;
                this.allServiceBudgetIntermediate = true;
            }
        }
        if (index == 22) {
            if (this.funderServiceList.every(item => !item.checked)) {
                this.allFunderService = false;
                this.allFunderServiceIntermediate = false;
            } else if (this.funderServiceList.every(item => item.checked)) {
                this.allFunderService = true;
                this.allFunderServiceIntermediate = false;
            } else {
                this.allFunderService = false;
                this.allFunderServiceIntermediate = true;
            }
        }
        if (index == 31) {
            if (this.careDomainsList.every(item => !item.checked)) {
                this.allCareDomains = false;
                this.allCareDomainsIntermediate = false;
            } else if (this.careDomainsList.every(item => item.checked)) {
                this.allCareDomains = true;
                this.allCareDomainsIntermediate = false;
            } else {
                this.allCareDomains = false;
                this.allCareDomainsIntermediate = true;
            }
        }
        if (index == 32) {
            if (this.disciplinesList.every(item => !item.checked)) {
                this.allDisciplines = false;
                this.allDisciplinesIntermediate = false;
            } else if (this.disciplinesList.every(item => item.checked)) {
                this.allDisciplines = true;
                this.allDisciplinesIntermediate = false;
            } else {
                this.allDisciplines = false;
                this.allDisciplinesIntermediate = true;
            }
        }
        if (index == 33) {
            if (this.costCentersList.every(item => !item.checked)) {
                this.allCostCenters = false;
                this.allCostCentersIntermediate = false;
            } else if (this.costCentersList.every(item => item.checked)) {
                this.allCostCenters = true;
                this.allCostCentersIntermediate = false;
            } else {
                this.allCostCenters = false;
                this.allCostCentersIntermediate = true;
            }
        }
        if (index == 34) {
            if (this.environmentsList.every(item => !item.checked)) {
                this.allEnvironments = false;
                this.allEnvironmentsIntermediate = false;
            } else if (this.environmentsList.every(item => item.checked)) {
                this.allEnvironments = true;
                this.allEnvironmentsIntermediate = false;
            } else {
                this.allEnvironments = false;
                this.allEnvironmentsIntermediate = true;
            }
        }
        if (index == 41) {
            if (this.staffJobList.every(item => !item.checked)) {
                this.allStaffJob = false;
                this.allStaffJobIntermediate = false;
            } else if (this.staffJobList.every(item => item.checked)) {
                this.allStaffJob = true;
                this.allStaffJobIntermediate = false;
            } else {
                this.allStaffJob = false;
                this.allStaffJobIntermediate = true;
            }
        }
        if (index == 42) {
            if (this.staffAdminList.every(item => !item.checked)) {
                this.allStaffAdmin = false;
                this.allStaffAdminIntermediate = false;
            } else if (this.staffAdminList.every(item => item.checked)) {
                this.allStaffAdmin = true;
                this.allStaffAdminIntermediate = false;
            } else {
                this.allStaffAdmin = false;
                this.allStaffAdminIntermediate = true;
            }
        }
        if (index == 43) {
            if (this.staffTeamList.every(item => !item.checked)) {
                this.allStaffTeam = false;
                this.allStaffTeamIntermediate = false;
            } else if (this.staffTeamList.every(item => item.checked)) {
                this.allStaffTeam = true;
                this.allStaffTeamIntermediate = false;
            } else {
                this.allStaffTeam = false;
                this.allStaffTeamIntermediate = true;
            }
        }
    }

    updateAllCheckedFilters(index: number): void {
        // if (index == 1) {
        //     if (this.allStates) {
        //         this.statesList.forEach(x => {
        //             x.checked = true;
        //         });
        //     } else {
        //         this.statesList.forEach(x => {
        //             x.checked = false;
        //         });
        //     }
        // }
        if (index == 2) {
            if (this.allBranches) {
                this.branchList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.branchList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 3) {
            if (this.allServiceAreas) {
                this.serviceAreasList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.serviceAreasList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 4) {
            if (this.allCaseManagers) {
                this.caseManagersList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.caseManagersList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 11) {
            if (this.allFunders) {
                this.fundersList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.fundersList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 12) {
            if (this.allFundingRegions) {
                this.fundingRegionsList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.fundingRegionsList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 13) {
            if (this.allAgencyID) {
                this.agencyIDList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.agencyIDList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 14) {
            if (this.allCSTDAOutlet) {
                this.CSTDAOutletList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.CSTDAOutletList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 15) {
            if (this.allAgencyPrograms) {
                this.agencyProgramsList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.agencyProgramsList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 21) {
            if (this.allServiceBudget) {
                this.serviceBudgetList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.serviceBudgetList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 22) {
            if (this.allFunderService) {
                this.funderServiceList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.funderServiceList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 31) {
            if (this.allCareDomains) {
                this.careDomainsList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.careDomainsList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 32) {
            if (this.allDisciplines) {
                this.disciplinesList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.disciplinesList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 33) {
            if (this.allCostCenters) {
                this.costCentersList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.costCentersList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 34) {
            if (this.allEnvironments) {
                this.environmentsList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.environmentsList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 41) {
            if (this.allStaffJob) {
                this.staffJobList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.staffJobList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 42) {
            if (this.allStaffAdmin) {
                this.staffAdminList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.staffAdminList.forEach(x => {
                    x.checked = false;
                });
            }
        }
        if (index == 43) {
            if (this.allStaffTeam) {
                this.staffTeamList.forEach(x => {
                    x.checked = true;
                });
            } else {
                this.staffTeamList.forEach(x => {
                    x.checked = false;
                });
            }
        }
    }
}


import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import format from 'date-fns/format';
import { GlobalService, StaffService, ShareService,timeSteps,nodes,conflictpointList,checkOptionsOne,sampleList,genderList,statusList,leaveTypes, ListService,PrintService, TimeSheetService, SettingsService, LoginService } from '@services/index';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { EMPTY, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationUser } from '@modules/modules';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer } from '@angular/platform-browser';

interface Person {
    key: string;
    name: string;
    age: number;
    address: string;
}

interface UserView{
    staffRecordView: string,
    staff: number
}

@Component({
    styles: [`
        nz-tabset{
            margin-top:1rem;
        }
        nz-tabset >>> div > div.ant-tabs-nav-container{
            height: 25px !important;
            font-size: 13px !important;
        }

        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
            line-height: 24px;
            height: 25px;
        }
        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab.ant-tabs-tab-active{
            background: #85B9D5;
            color: #fff;
        }
        nz-tabset >>> div div.ant-tabs-nav-container div.ant-tabs-nav-wrap div.ant-tabs-nav-scroll div.ant-tabs-nav div div.ant-tabs-tab{
            border-radius: 0;
        }
        ul{
            list-style:none;
            float:right;
            margin:0;
        }
        li{
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
            padding: 5px;
            cursor:pointer;
        }
        li div{
            text-align: center;
            font-size: 17px;
        }
        .terminate:hover{
            color: #db2929;
        }
        .leave:hover{
            color: #1488db;
        }
        .checks label{
            display:block;
            margin:10px;
        }
        .spinner{
            margin:1rem auto;
            width:1px;
            }
    `],
    templateUrl: './staff.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class StaffAdmin implements OnInit, OnDestroy {
    user: any = null;
    nzSelectedIndex: number = 0;

    isFirstLoad: boolean = false;
    isConfirmLoading: boolean = false;
    sample: any;

    terminateModal: boolean = false;
    changeCodeModal: boolean = false;
    searchAvaibleModal : boolean = false;
    putonLeaveModal: boolean = false;
    newStaffModal: boolean = false;
    
    leaveBalanceList: Array<any>;
    terminateGroup: FormGroup;

    userview: UserView;
    currentDate = new Date();
    longMonth = this.currentDate.toLocaleString('en-us', { month: 'long' });
    userByPass: ApplicationUser;
    navigationExtras: { state: { StaffCode: string; ViewType: string; IsMaster: boolean; }; };
    printSummaryModal: boolean =  false;
    printSummaryGroup: FormGroup;
    updateStaff: FormGroup;

    tocken: any;
    trainingFrom:Date;
    trainingTo:Date;
    rosterTo :Date;
    rosterFrom:Date;
    hrnotesFrom :Date;
    hrnotesTo:Date;
    opnotesTo :Date;
    opnotesFrom:Date; 
    rpthttp = 'https://www.mark3nidad.com:5488/api/report';
    pdfTitle: string;
    tryDoctype: any;
    ifrmtryDoctype : boolean;
    SummarydrawerVisible: boolean; 
    spinloading: boolean = false ;
    dateFormat: string ='dd/MM/yyyy';
    Cycles: Array<any> = ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7', 'Cycle 8', 'Cycle 9', 'Cycle 10'];
    DayNames: Array<any> = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    fDays : Array<any> = ['7','14','21','28',];
    
    sampleList: Array<any> = sampleList;
    cariteriaList:Array<any> = [];
    nodelist:Array<any> = [];
    checkOptionsOne = checkOptionsOne;
    
    branchesList: any;
    diciplineList: any;
    casemanagers: any;
    categoriesList: any;
    selectedRecpientTypes: any[];
    types: any[];
    
    extendedSearch: any;
    filteredResult: any;
    selectedTypes:any;
    selectedbranches: any[];
    testcheck : boolean = false;
    selectedPrograms: any;
    selectedCordinators: any;
    selectedCategories: any;
    
    allBranches:boolean = true;
    allBranchIntermediate:boolean = false;
    
    allProgarms:boolean = true;
    allprogramIntermediate:boolean = false;
    
    allCordinatore:boolean = true;
    allCordinatorIntermediate:boolean = false;
    
    allcat:boolean = true;
    allCatIntermediate:boolean = false;
    
    
    allChecked: boolean = true;
    indeterminate: boolean = false;
    quicksearch: FormGroup;
    filters: FormGroup;
    loading: boolean;
    findModalOpen: boolean = false;
    statusList:any = statusList;
    genderList:any = genderList;
    conflictpointList:any = conflictpointList;
    timeSteps:Array<string>;
    
    columns: Array<any> = [
        {
          name: 'ID',
          checked: false
        },
        {
          name: 'URNumber',
          checked: false
        },
        {
          name: 'AccountNo',
          checked: false
        },
        {
          name: 'Surname',
          checked: false
        },
        {
          name: 'Firstname',
          checked: false
        },
        {
          name: 'Fullname',
          checked: false
        },
        {
          name: 'Gender',
          checked: true
        },
        {
          name: 'DOB',
          checked: true
        },
        {
          name: 'Address',
          checked: true
        },
        {
          name: 'Contact',
          checked: true
        },
        {
          name: 'Type',
          checked: true
        },
        {
          name: 'Branch',
          checked: true
        },
        {
          name: 'Coord',
          checked: false
        },
        {
          name: 'Category',
          checked: false
        },
        {
          name: 'ONI',
          checked: false
        },
        {
          name: 'Activated',
          checked: false
        },
        {
          name: 'Deactivated',
          checked: false
        },
        {
          name: 'Suburb',
          checked: false
        }
      ]
  skillsList: unknown;
  avilibilityForm: FormGroup;
      
      handleCancel() {
        this.findModalOpen = false;
      }
      
      listChange(event: any) {

        if (event == null) {
            this.user = null;
            this.isFirstLoad = false;
            this.sharedS.emitChange(this.user);
            return;
        }

        if (!this.isFirstLoad) {
            this.view(0);
            this.isFirstLoad = true;
        }

        this.user = {
            code: event.accountNo,
            id: event.uniqueID,
            view: event.view,
            agencyDefinedGroup: event.agencyDefinedGroup,
            sysmgr: event.sysmgr
        }

        this.sharedS.emitChange(this.user);
        this.cd.detectChanges();
    }

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private timeS: TimeSheetService,
        private sharedS: ShareService,
        private globalS: GlobalService,
        private listS: ListService,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private settingS: SettingsService,
        private loginS: LoginService,
        private http: HttpClient,
        private ModalS: NzModalService,
        private PrintS: PrintService,
        private sanitizer: DomSanitizer,
    ) {        
      
    }

    ngOnInit(): void {
        this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
        this.buildForm();
        this.buildForms();
        this.timeSteps = timeSteps;
        this.getUserData();
        this.normalRoutePass();
    }

    normalRoutePass(): void{
        const { user } = this.globalS.decode();

        this.listS.getstaffrecordview(user).subscribe(data => {
            this.userview = data;
            console.log(this.userview);
            this.cd.detectChanges();
        })

       
        this.isFirstLoad = false;   
        
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd ) => {
            if (event.url == '/admin/staff') {
                this.sample = { refresh: true };
                this.cd.detectChanges();
            }          
        });

        this.sharedS.emitRouteChangeSource$.subscribe(data => {
            console.log(data);
        });
    }
    buildForms(){
        
      this.quicksearch = this.fb.group({
          availble: false,
          option: false,
          status:'Active',
          gender:'Any Gender',
          surname:'',
          staff:true,
          brokers:true,
          volunteers:true,
          onleaveStaff:true,
          previousWork:false,
          searchText:'',
        });
        
        this.avilibilityForm = this.fb.group({
          date  :[new Date()],
          start :'09:00',
          end   :'10:00',
          drtn  :'01:00',
          conflict:true,
          conflictminutes:'',
        });

        this.filters = this.fb.group({
          activeprogramsonly:false,
        });
        
        this.extendedSearch = this.fb.group({
          title:'',
          rule:'',
          from:'',
          to:'',
          
          activeonly: true,
        });
        
    }
    buildForm(): void{
        var date = new Date();
        let monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        let monthend = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        this.terminateGroup = this.fb.group({
            terminateDate: [new Date(), Validators.required],
            unallocUnapproved: false,
            unallocMaster: false,
            deletePending: false
        });
        this.printSummaryGroup = this.fb.group({
            fileLabels:false,
            nameandContacts:true,
            contactIssue:false,
            otherContact:false,
            otherInfo:false,
            payrollInfo:false,
            workhourInfo:false,
            copmpetencies:false,
            otherSkills:false,
            training:false,
            roster:false,
            permanentRoster:false,
            miscellaneousNotes:false,
            operationalNotes:false,
            hrNotes:false,
            includeAdressress:false,
            ItemsOnLoan:false,
            trainingchk:false,
            hrchk:false,
            opchk:false,
            rosterchk:false,
            prosterchk:false,
            printOnSamePage:false,
            recepientSearc:'Show RECIPIENT CODE',
            recepientSearc1:'Show RECIPIENT CODE',
            Cycles : ['Cycle 1'],
            DayNames : ['Monday'],
            fDays: ['7'],
            trainingFrom  :monthStart,
            trainingTo :monthend,
            rosterTo :monthend,
            rosterFrom :monthStart,
            hrnotesFrom :monthStart,
            hrnotesTo :monthend,
            opnotesTo :monthend,
            opnotesFrom:monthStart,
        });
        
         this.printSummaryGroup.get('training').valueChanges.subscribe(data => {
            if(!data){
                this.printSummaryGroup.patchValue({
                    trainingchk:false,
                });
            } else {
                this.printSummaryGroup.patchValue({
                    trainingchk:true,
                });
            }
        })
        this.printSummaryGroup.get('roster').valueChanges.subscribe(data => {
            if(!data){
                this.printSummaryGroup.patchValue({
                    rosterchk:false,
                });
            } else {
                this.printSummaryGroup.patchValue({
                    rosterchk:true,
                });
            }
        })
        this.printSummaryGroup.get('permanentRoster').valueChanges.subscribe(data => {
            if(!data){
                this.printSummaryGroup.patchValue({
                    prosterchk:false,
                });
            } else {
                this.printSummaryGroup.patchValue({
                    prosterchk:true,
                });
            }
        })
        this.printSummaryGroup.get('hrNotes').valueChanges.subscribe(data => {
            if(!data){
                this.printSummaryGroup.patchValue({
                    hrchk:false,
                });
            } else {
                this.printSummaryGroup.patchValue({
                    hrchk:true,
                });
            }
        })
        this.printSummaryGroup.get('operationalNotes').valueChanges.subscribe(data => {
            if(!data){
                this.printSummaryGroup.patchValue({
                    opchk:false,
                });
            } else {
                this.printSummaryGroup.patchValue({
                    opchk:true,
                });
            }
        })

    /*    let monthend = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        this.trainingFrom = monthStart;
        this.trainingTo = monthend;
        this.rosterFrom = monthStart;
        this.rosterTo  = monthend;
        this.hrnotesFrom  = monthStart;
        this.hrnotesTo = monthend;
        this.opnotesFrom = monthStart;
        this.opnotesTo  = monthend;    */ 
 
        this.updateStaff = this.fb.group({
            staffCode : '',
            AccountNo : '',
        });
 
    }

    ngOnDestroy(): void {

    }
    handleOk(){                         
        this.ReportRender();
        this.tryDoctype = ""
        this.pdfTitle = ""        
    //    this.printSummaryModal = false;
     
    }
    getUserData() {
        return forkJoin([
          this.listS.getlistbranchesObj(),
          this.listS.getdisciplinelist(),
          this.listS.casemanagerslist(),
          this.listS.getstaffcategorylist(),
          this.listS.getskills(),
        ]).subscribe(x => {
          this.branchesList   = x[0];
          this.diciplineList  = x[1];
          this.casemanagers   = x[2];
          this.categoriesList = x[3];
          this.skillsList     = x[4];
        });
      }
    view(index: number) {
        this.nzSelectedIndex = index;

        if (index == 0) {
            this.router.navigate(['/admin/staff/personal'])
        }
        if (index == 1) {
            this.router.navigate(['/admin/staff/contacts']);            
        }
        if (index == 2) {
            this.router.navigate(['/admin/staff/pay'])
        }
        if (index == 3) {
            this.router.navigate(['/admin/staff/leave'])
        }
        if (index == 4) {
            this.router.navigate(['/admin/staff/reminders'])
        }
        if (index == 5) {
            this.router.navigate(['/admin/staff/op-note'])
        }
        if (index == 6) {
            this.router.navigate(['/admin/staff/hr-note'])
        }
        if (index == 7) {
            this.router.navigate(['/admin/staff/competencies'])
        }
        if (index == 8) {
            this.router.navigate(['/admin/staff/training'])
        }
        if (index == 9) {
            this.router.navigate(['/admin/staff/incident'])
        }
        if (index == 10) {
            this.router.navigate(['/admin/staff/document'])
        }
        if (index == 11) {
            this.router.navigate(['/admin/staff/time-attendance'])
        }
        if (index == 12) {
            this.router.navigate(['/admin/staff/position'])
        }
        if (index == 13) {
            this.router.navigate(['/admin/staff/groupings-preferences'])
        }
        if(index == 14){
            this.router.navigate(['/admin/staff/loans'])
        }
    }

    terminateModalOpen() : void{
        this.terminateModal = true;
        this.listS.getleavebalances(this.user.id)
            .subscribe(data => this.leaveBalanceList = data)
    }
    changeStaffModalOpen() : void{
        this.changeCodeModal = true;
        this.updateStaff.patchValue({
            staffCode : this.user.code,
            accountNo : this.user.code,
        });
    }
    printSummaryModalOpen() : void{
        this.printSummaryModal = true;
    }
    
    updateStaffCode(){
        
        this.timeS.postchangestaffcode({
            AccountNo:this.user.code,
            StaffCode:this.updateStaff.value.staffCode,
        }).subscribe(data => {
            if(data){
                this.globalS.sToast('Success','Staff Code Changed Successfully!');
                this.changeCodeModal = false;
                this.isConfirmLoading = false;
                this.router.navigate(["/admin/staff"]);
                this.cd.detectChanges();
        }
        else{
                this.globalS.sToast('failure','Some thing Went Wrong !');
            }
        })
    }

    terminate(){
        
        for (const i in this.terminateGroup.controls) {
            this.terminateGroup.controls[i].markAsDirty();
            this.terminateGroup.controls[i].updateValueAndValidity();
        }

        if(!this.terminateGroup.valid)  return;

        this.isConfirmLoading = true;
        
        const { code, id } = this.user;

        this.timeS.posttermination({
            TerminationDate: this.terminateGroup.value.terminateDate,
            AccountNo: code,
            PersonID: id
        }).subscribe(data => {
            this.globalS.sToast('Success','Staff has been terminated!');
            this.terminateModal   = false;
            this.isConfirmLoading = false;
            this.cd.detectChanges();
        });
    }
    delete(){
        const { code, id } = this.user;
        this.timeS.postDeleteStaff({
            AccountNo: code,
            PersonID: id
        }).subscribe(data => {
            this.globalS.sToast('Success','Staff has been deleted!');
            this.router.navigate(["/admin/staff"]);
            this.cd.detectChanges();
            this.reload(true);
        });
    }
    currentMonthRoster(){
        console.log(this.user.code + "current");
        this.navigationExtras ={state : {StaffCode:this.user.code, ViewType:'Staff',IsMaster:false }};
            this.router.navigate(["/admin/rosters"],this.navigationExtras )
    }
    rosterMaster(){
        console.log(this.user.code + "master");
        this.navigationExtras ={state : {StaffCode:this.user.code, ViewType:'Staff',IsMaster:true }};
            this.router.navigate(["/admin/rosters"],this.navigationExtras )
    }
    
    reloadVal: boolean = false;
    reload(reload: boolean){
        this.reloadVal = !this.reloadVal;
    }
    handleCancelTop(){
        this.SummarydrawerVisible = false;
    }
ReportRender(){
      
    var id,rptfile , tempsdate, tempedate,temp1,temp2;
    var  Trainstrdate, Trainendate, hrstrdate, hrendate , OPstrdate, OPendate, Rstrdate, Rendate = '';

    if(this.printSummaryGroup.value.fileLabels == true){
        id = "PDg8Im0vdY"
        var Title = "Address Labels"
    }else{
        id = "RYeIj0QuEc"
        var Title = "Summary Sheet"
    }
        if(id == "RYeIj0QuEc"){
          var date = new Date();
   
            if (this.trainingFrom != null) { Trainstrdate = format(this.trainingFrom, 'yyyy/MM/dd') } 
            else {                     
                Trainstrdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy/MM/dd')}
            if (this.trainingTo != null) { Trainendate = format(this.trainingTo, 'yyyy/MM/dd') } 
            else {       
                Trainendate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy/MM/dd');}
      
        
            if (this.opnotesFrom != null) { OPstrdate = format(this.opnotesFrom, 'MM-dd-yyyy') } 
            else {                     
             OPstrdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'MM-dd-yyyy')}
            if (this.opnotesTo != null) { OPendate = format(this.opnotesTo, 'MM-dd-yyyy') } 
            else {       
                 OPendate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'MM-dd-yyyy');}
         
        

         
            if (this.hrnotesFrom != null) { hrstrdate = format(this.hrnotesFrom, 'MM-dd-yyyy') } 
            else {                     
              hrstrdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'MM-dd-yyyy')}
            if (this.hrnotesTo != null) { hrendate  = format(this.hrnotesTo, 'MM-dd-yyyy') } 
            else {       
              hrendate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'MM-dd-yyyy');}
       

              if (this.rosterFrom != null) { Rstrdate = format(this.rosterFrom, 'yyyy/MM/dd') } 
            else {                     
                Rstrdate = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy/MM/dd')}
            if (this.rosterTo != null) { Rendate = format(this.rosterTo, 'yyyy/MM/dd') } 
            else {       
                Rendate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy/MM/dd');}
       
                                     
            switch (this.printSummaryGroup.value.Cycles.toString()) {
              case 'Cycle 1':
                  temp1 = "1900/01/01";                    
                   
                  break;
              case "Cycle 2":
                temp1 = "1900/10/01";
                
                  break;
              case 'Cycle 3':
                temp1 = "1901/04/01";
                
                  break;
              case 'Cycle 4':
                temp1 = "1901/07/01";
                 
                  break;
              case 'Cycle 5':
                temp1 = "1902/09/01";
                 
                  break;

              case 'Cycle 6':
                temp1 = "1902/12/01";
                 
                  break;
              case 'Cycle 7':
                temp1 = "1903/06/01";
                 
                  break;
              case 'Cycle 8':
                temp1 = "1904/02/01";
                
                  break;
              case 'Cycle 9':
                temp1 = "1904/08/01";
                 
                  break;
              case 'Cycle 10':
                temp1 = "1905/05/01";
                
                  break;
              default:
                temp1 = "1900/01/01";
                 

                  break;
              }
              let cyclestrdate =  new Date(temp1)
              switch (this.printSummaryGroup.value.fDays.toString()) {
                case '14':
                  temp2 = cyclestrdate.setDate(14)
                  break;
                case '21':
                  temp2 = cyclestrdate.setDate(21)
                  break;
                case '28':
                  temp2 = cyclestrdate.setDate(28)
                  break;            
                default:
                  temp2 = cyclestrdate.setDate(7)
                  break;
              } 
                  let cycleendate =  new Date(temp2) 


          const data = {
    
            "template": { "shortid": id },
                        
            "options": {
                "reports": { "save": false },                                  
                "userid": this.tocken.user,
                "txtTitle": Title,
                "txtid":this.globalS.var1.toString(),
                "txtacc":this.globalS.var2.toString(),

                "inclNameContact": this.printSummaryGroup.value.nameandContacts,
                "inclContactIssues": this.printSummaryGroup.value.contactIssue,
                "InclOtherContacts": this.printSummaryGroup.value.otherContact,
                "InclOtherInfo": this.printSummaryGroup.value.otherInfo,
                "InclPayRollInfo": this.printSummaryGroup.value.payrollInfo,
                "InclWorkhrInfo": this.printSummaryGroup.value.workhourInfo,
                "InclCompetencies": this.printSummaryGroup.value.copmpetencies,
                "InclOtherSkills": this.printSummaryGroup.value.otherSkills,
                "InclTraining": this.printSummaryGroup.value.training,
                "InclPermanentRosters": this.printSummaryGroup.value.permanentRoster,
                "InclRosterSheet": this.printSummaryGroup.value.roster,
                "InclNotesSheet": this.printSummaryGroup.value.miscellaneousNotes,                 
                "InclOPNotesS": this.printSummaryGroup.value.operationalNotes,
                "InclLoanItems": this.printSummaryGroup.value.ItemsOnLoan,
                "InclHRNotes": this.printSummaryGroup.value.hrNotes,

                 //"InclFieldLabels": this.printSummaryGroup.value.fileLabels,
                 "RosterSDate": Rstrdate,
                 "RosterEDate": Rendate,

                 "OPNotesSDate": OPstrdate,
                 "OPNotesEDate": OPendate,
                 
                 "HRNotesSDate": hrstrdate,
                 "HRNotesEDate": hrendate,
                 
                 "TrainingSDate":Trainstrdate ,
                 "TrainingEDate": Trainendate ,

                 
                 "StaffInclusion":this.printSummaryGroup.value.recepientSearc,

                 "cycleSDate":format(cyclestrdate,'yyyy/MM/dd'),
                 "cycleEDate":format(cycleendate,'yyyy/MM/dd'),
                 //"days":this.inputForm.value.fDays,
                 //"dayname":this.inputForm.value.DayNames,
                 
                 
             

                
            }
        }
        this.SummarydrawerVisible = true;
        this.spinloading = true;
        
        const headerDict = {

            'Content-Type': 'application/json',
            'Accept': 'application/json',                                                
        }

        const requestOptions = {
            headers: new HttpHeaders(headerDict),
            credentials: true
        };

        //this.rpthttp
        this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers, responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);

                let _blob: Blob = blob;

                let fileURL = URL.createObjectURL(_blob);
                this.pdfTitle = rptfile;

                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.spinloading = false;

            }, err => {
                console.log(err);
                this.ModalS.error({
                    nzTitle: 'TRACCS',
                    nzContent: 'The report has encountered the error and needs to close (' + err + ')',
                    nzOnOk: () => {
                             this.SummarydrawerVisible = false;
                              
                             },
                  });
            }); 
        }
        else{

            var date = new Date();
                                        
          const data = {
    
            "template": { "shortid": id },
                        
            "options": {
                "reports": { "save": false },
                //   "sql": "SELECT DISTINCT R.UniqueID, R.AccountNo, R.AgencyIdReportingCode, R.[Surname/Organisation], R.FirstName, R.Branch, R.RECIPIENT_COORDINATOR, R.AgencyDefinedGroup, R.ONIRating, R.AdmissionDate As [Activation Date], R.DischargeDate As [DeActivation Date], HumanResourceTypes.Address2, RecipientPrograms.ProgramStatus, CASE WHEN RecipientPrograms.Program <> '' THEN RecipientPrograms.Program + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Quantity <> '' THEN RecipientPrograms.Quantity + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.ItemUnit <> '' THEN RecipientPrograms.ItemUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.PerUnit <> '' THEN RecipientPrograms.PerUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.TimeUnit <> '' THEN RecipientPrograms.TimeUnit + ' ' ELSE ' ' END + CASE WHEN RecipientPrograms.Period <> '' THEN RecipientPrograms.Period + ' ' ELSE ' ' END AS FundingDetails, UPPER([Surname/Organisation]) + ', ' + CASE WHEN FirstName <> '' THEN FirstName ELSE ' ' END AS RecipientName, CASE WHEN N1.Address <> '' THEN  N1.Address ELSE N2.Address END  AS ADDRESS, CASE WHEN P1.Contact <> '' THEN  P1.Contact ELSE P2.Contact END AS CONTACT, (SELECT TOP 1 Date FROM Roster WHERE Type IN (2, 3, 7, 8, 9, 10, 11, 12) AND [Client Code] = R.AccountNo ORDER BY DATE DESC) AS LastDate FROM Recipients R LEFT JOIN RecipientPrograms ON RecipientPrograms.PersonID = R.UniqueID LEFT JOIN HumanResourceTypes ON HumanResourceTypes.Name = RecipientPrograms.Program LEFT JOIN ServiceOverview ON ServiceOverview.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress = 1)  AS N1 ON N1.PersonID = R.UniqueID LEFT JOIN (SELECT PERSONID,  CASE WHEN Address1 <> '' THEN Address1 + ' ' ELSE ' ' END +  CASE WHEN Address2 <> '' THEN Address2 + ' ' ELSE ' ' END +  CASE WHEN Suburb <> '' THEN Suburb + ' ' ELSE ' ' END +  CASE WHEN Postcode <> '' THEN Postcode ELSE ' ' END AS Address  FROM NamesAndAddresses WHERE PrimaryAddress <> 1)  AS N2 ON N2.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone = 1)  AS P1 ON P1.PersonID = R.UniqueID LEFT JOIN (SELECT PersonID,  PhoneFaxOther.Type + ' ' +  CASE WHEN Detail <> '' THEN Detail ELSE ' ' END AS Contact  FROM PhoneFaxOther WHERE PrimaryPhone <> 1)  AS P2 ON P2.PersonID = R.UniqueID WHERE R.[AccountNo] > '!MULTIPLE'   AND (R.DischargeDate is NULL)  AND  (RecipientPrograms.ProgramStatus = 'REFERRAL')  ORDER BY R.ONIRating, R.[Surname/Organisation]"
                 
                 
                "userid": this.tocken.user,
                "txtTitle": Title,
                 "txtid":this.globalS.var1.toString(),
                
                 
                 
             

                
            }
        }
        this.SummarydrawerVisible = true;
        this.spinloading = true;
        
        const headerDict = {

            'Content-Type': 'application/json',
            'Accept': 'application/json',                                                
        }

        const requestOptions = {
            headers: new HttpHeaders(headerDict),            
            credentials: true,                       
        };

        //this.rpthttp
        this.http.post(this.rpthttp, JSON.stringify(data), { headers: requestOptions.headers,  responseType: 'blob' })
            .subscribe((blob: any) => {
                console.log(blob);

                let _blob: Blob = blob;

                let fileURL = URL.createObjectURL(_blob) ;
                this.pdfTitle = rptfile;

                this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
                this.ifrmtryDoctype = true;
                this.spinloading = false;

            }, err => {
                console.log(err);
                this.ModalS.error({
                    nzTitle: 'TRACCS',
                    nzContent: 'The report has encountered the error and needs to close (' + err + ')',
                    nzOnOk: () => {
                             this.SummarydrawerVisible = false;               
                            },
                    });
                });
            }
}


 log(event: any,index:number) {
    console.log("-----");
    this.testcheck = true;   
    if(index == 1)
    this.selectedbranches = event;
    if(index == 2)
    this.selectedPrograms = event;
    if(index == 3)
    this.selectedCordinators = event;
    if(index == 4)
    this.selectedCategories = event;  

    if(index == 5 && event.target.checked){
      this.searchAvaibleModal = true;
    }
 }
  
  setCriteria(){ 
    this.cariteriaList.push({
      fieldName  : this.extendedSearch.value.title,
      searchType : this.extendedSearch.value.rule,
      textToLoc  : this.extendedSearch.value.from,
      endText    : this.extendedSearch.value.to,
    })
  }
  searchData() : void{
    this.loading = true;      
    
    this.selectedTypes = this.checkOptionsOne
    .filter(opt => opt.checked)
    .map(opt => opt.value).join("','")
    
    this.selectedPrograms = this.diciplineList
    .filter(opt => opt.checked)
    .map(opt => opt.description)
    
    this.selectedCordinators = this.casemanagers
    .filter(opt => opt.checked)
    .map(opt => opt.uniqueID)
    
    this.selectedCategories = this.categoriesList
    .filter(opt => opt.checked)
    .map(opt => opt.description)
    
    this.selectedbranches = this.branchesList
    .filter(opt => opt.checked)
    .map(opt => opt.description)

    var postdata = {
      status:this.quicksearch.value.status,
      gender:this.quicksearch.value.gender,
      staff:this.quicksearch.value.staff,
      brokers:this.quicksearch.value.brokers,
      volunteers:this.quicksearch.value.volunteers,
      onleaveStaff:this.quicksearch.value.onleaveStaff,
      searchText:this.quicksearch.value.searchText,
      
      allTeamAreas      : this.allProgarms,
      selectedTeamAreas : (this.allProgarms == false) ? this.selectedPrograms : '',

      allcat:this.allcat,
      selectedCategories:(this.allcat == false) ? this.selectedCategories : '',

      allBranches:this.allBranches,
      selectedbranches:(this.allBranches == false) ? this.selectedbranches : '',

      allCordinatore:this.allCordinatore,
      selectedCordinators:(this.allCordinatore == false) ? this.selectedCordinators : '',

      // onleaveStaff:this.quicksearch.value.onleaveStaff,
      // previousWork:this.quicksearch.value.previousWork,
      
      // allcat:this.allcat,
      // selectedCategories:(this.allcat == false) ? this.selectedCategories : '',
      // activeprogramsonly:this.filters.value.activeprogramsonly,
      // surname:this.quicksearch.value.surname,
      // firstname:this.quicksearch.value.firstname,
      // phoneno:this.quicksearch.value.phoneno,
      // suburb:this.quicksearch.value.suburb,
      // dob:(!this.globalS.isEmpty(this.quicksearch.value.dob)) ? this.globalS.convertDbDate(this.quicksearch.value.dob,'yyyy-MM-dd') : '',
      // fileno:this.quicksearch.value.fileno,
      // searchText:this.quicksearch.value.searchText,
      // criterias:this.cariteriaList
      // list of rules
    }

    this.timeS.poststaffquicksearch(postdata).subscribe(data => {
      this.filteredResult = data;
      this.loading = false;
      this.cd.detectChanges();
    });
  }
  detectChanges() {
        throw new Error('Method not implemented.');
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => ({
        ...item,
        checked: false
      }));
    }
  }
  updateAllCheckedFilters(filter: any): void {
    
    if(filter == 1 || filter == -1){
      
      console.log(this.testcheck + "test flag");
      
      if(this.testcheck == false){  // why its returing undefined 
        if (this.allBranches) {
          this.branchesList.forEach(x => {
            x.checked = true;
          });
        }else{
          this.branchesList.forEach(x => {
            x.checked = false;
          });
        }
      }
    }
    
    if(filter == 2 || filter == -1){
      if(this.testcheck == false){
        if (this.allProgarms) {
          this.diciplineList.forEach(x => {
            x.checked = true;
          });
        }else{
          this.diciplineList.forEach(x => {
            x.checked = false;
          });
        }
      }
    }
    if(filter == 3 || filter == -1){
      if(this.testcheck == false){
        if (this.allCordinatore) {
          this.casemanagers.forEach(x => {
            x.checked = true;
          });
        }else{
          this.casemanagers.forEach(x => {
            x.checked = false;
          });
        }
      }
    }
    
    if(filter == 4 || filter == -1){
      if(this.testcheck == false){
        if (this.allcat) {
          this.categoriesList.forEach(x => {
            x.checked = true;
          });
        }else{
          this.categoriesList.forEach(x => {
            x.checked = false;
          });
        }
      }
    }
  }
  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
      this.allChecked = false;
    }
  }
  updateSingleCheckedFilters(index:number): void {
    if(index == 1){
      if (this.branchesList.every(item => !item.checked)) {
        this.allBranches = false;
        this.allBranchIntermediate = false;
      } else if (this.branchesList.every(item => item.checked)) {
        this.allBranches = true;
        this.allBranchIntermediate = false;
      } else {
        this.allBranchIntermediate = true;
        this.allBranches = false;
      }
    }
    if(index == 2){
      if (this.diciplineList.every(item => !item.checked)) {
        this.allProgarms = false;
        this.allprogramIntermediate = false;
      } else if (this.diciplineList.every(item => item.checked)) {
        this.allProgarms = true;
        this.allprogramIntermediate = false;
      } else {
        this.allprogramIntermediate = true;
        this.allProgarms = false;
      }
    }
    if(index == 3){
      if (this.casemanagers.every(item => !item.checked)) {
        this.allCordinatore = false;
        this.allCordinatorIntermediate = false;
      } else if (this.casemanagers.every(item => item.checked)) {
        this.allCordinatore = true;
        this.allCordinatorIntermediate = false;
      } else {
        this.allCordinatorIntermediate = true;
        this.allCordinatore = false;
      }
    }
    if(index == 4){
      if (this.categoriesList.every(item => !item.checked)) {
        this.allcat = false;
        this.allCatIntermediate = false;
      } else if (this.categoriesList.every(item => item.checked)) {
        this.allcat = true;
        this.allCatIntermediate = false;
      } else {
        this.allCatIntermediate = true;
        this.allcat = false;
      }
    }
  }
  openFindModal(){
    this.tabFindIndex = 0;
    
    this.updateAllCheckedFilters(-1);
    
    this.findModalOpen = true;

  }
  
  tabFindIndex: number = 0;
  tabFindChange(index: number){
    this.tabFindIndex = index;
  }
  
  filterChange(index: number){
    
  }
}
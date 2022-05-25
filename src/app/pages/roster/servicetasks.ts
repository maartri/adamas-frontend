import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit,Input,Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService, ListService, MenuService, PrintService } from '@services/index';
import { SwitchService } from '@services/switch.service';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'service-tasks',
  templateUrl: './servicetasks.html',
  styles: []
})
export class ServiceTasks implements OnInit {
  
  @Input() loadTasks: Subject<any>;
  listTasks: Array<any>=[];
  ViewServiceTaskList:boolean;
  HighlightRow:number;
  NewTask:any;
  tableData: Array<any>;
  loading: boolean = false;
  recordNo:string;
  modalOpen: boolean = false;
  current: number = 0;
  inputForm: FormGroup;
  postLoading: boolean = false;
  isUpdate: boolean = false;
  modalVariables:any;
  inputVariables:any;
  title:string = "Add Tasks"
  tocken: any;
  pdfTitle: string;
  tryDoctype: any;
  drawerVisible: boolean =  false;   
  dateFormat: string ='dd/MM/yyyy';
  check : boolean = false;
  userRole:string="userrole";
  whereString :string="Where ISNULL(DataDomains.DeletedRecord,0) = 0 AND (EndDate Is Null OR EndDate >= GETDATE()) AND ";
  private unsubscribe: Subject<void> = new Subject();
  rpthttp = 'https://www.mark3nidad.com:5488/api/report';
  temp_title: any;
  
  constructor(
    private globalS: GlobalService,
    private cd: ChangeDetectorRef,
    private switchS:SwitchService,
    private listS:ListService,
    private printS:PrintService,
    private menuS:MenuService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ModalS: NzModalService,
    ){}
    ngOnInit(): void {
      this.tocken = this.globalS.pickedMember ? this.globalS.GETPICKEDMEMBERDATA(this.globalS.GETPICKEDMEMBERDATA):this.globalS.decode();
      this.userRole = this.tocken.role;
      //this.buildForm();
      this.loadData();
      this.loadTasks.subscribe(d=>{
        this.loadSericeTasks(d);
    })    
    
      this.cd.detectChanges();
    }
    loadTitle(){
      return this.title;
    }
    showAddModal() {
      this.title = "Tasks List"
     // this.resetModal();
      this.ViewServiceTaskList = true;
    }
    
    resetModal() {
      this.current = 0;
      this.inputForm.reset();
      this.postLoading = false;
    }
    
    showEditModal(index: any) {
      // debugger;
      this.title = "Edit Tasks"
      this.isUpdate = true;
      this.current = 0;
      this.modalOpen = true;
      const { 
        name,
        end_date,
        recordNumber,
      } = this.tableData[index];
      this.inputForm.patchValue({
        name: name,
        end_date:end_date,
        recordNumber:recordNumber,
      });
      this.temp_title = name;
    }
    
    handleCancel() {
      this.modalOpen = false;
    }
    pre(): void {
      this.current -= 1;
    }
    
    next(): void {
      this.current += 1;
    }
    loadSericeTasks(recordNo:string){
      //this.loading = true;
      this.recordNo=recordNo;
      this.tableData=[];
      let sql =`SELECT roTA.RecordNo, '' AS C1, '' AS C2, roTA.TaskComplete as Comp , ddTA.Description AS task FROM Roster_TaskList roTA INNER JOIN DataDomains ddTA ON roTA.TaskID = ddTA.Recordnumber and Domain = 'TASK' WHERE RosterID = ${recordNo} `
      this.listS.getlist(sql).subscribe(data => {
        this.tableData = data;
       // this.loading = false;
      });
    }

    loadData(){
      this.loading = true;
      let sql= `SELECT RecordNumber,Description FROM DATADOMAINS WHERE Domain = 'TASK' ORDER BY Description`;

      this.listS.getlist(sql).subscribe(d=>{
        this.listTasks=d;
        this.loading = false;
      })
    }
    loadTaskList(e){
      let sql= `SELECT RecordNumber,Description FROM DATADOMAINS WHERE Domain = 'TASK' ORDER BY Description`;

      this.listS.getlist(sql).subscribe(d=>{
        this.listTasks=d;
      })
    }
    activateDomain(data: any) {
      this.postLoading = true;     
      const group = this.inputForm;
      this.menuS.activeDomain(data.recordNumber)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        if (data) {
          this.globalS.sToast('Success', 'Data Activated!');
          this.loadSericeTasks(this.recordNo);
          return;
        }
      });
    }
    save(task:any) {
      this.postLoading = true;     
      let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};
        //INSERT INTO Roster_TaskList (RosterID, TaskID, TaskNotes) VALUES (324249, 4713, '')
      sql.TableName='Roster_TaskList ';          
      
      sql.Columns=`RosterID, TaskID, TaskNotes `;
      sql.ColumnValues=`${this.recordNo}, ${task.recordNumber},'${task.description}' `;
      
     sql.WhereClause=``;
  
    
  
      this.listS.insertlist(sql).subscribe(data=>{
         // this.globalS.sToast("Day Manager","Record Updated Successfully");
          this.ViewServiceTaskList=false;
          this.loadSericeTasks(this.recordNo);
      });
       
        }
        delete(data: any) {
          this.postLoading = true;     
     
          let sql :any= {TableName:'',Columns:'',ColumnValues:'',SetClause:'',WhereClause:''};          
          sql.TableName=' Roster_TaskList ';           
          sql.WhereClause=` Where RecordNo=${data.recordNo}`;  
      
    
        this.listS.deletelist(sql)
          .pipe(takeUntil(this.unsubscribe)).subscribe(d => {
            if (d) {
              this.globalS.sToast('Success', 'Data Deleted!');
              this.loadSericeTasks(this.recordNo);
              return;
            }
          });
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
          
          var fQuery = "SELECT ROW_NUMBER() OVER(ORDER BY Description) AS Field1,Description as Field2,CONVERT(varchar, [enddate],105) as Field3 from DataDomains  "+this.whereString+" Domain='Task'";
          
          const data = {
            "template": { "_id": "0RYYxAkMCftBE9jc" },
            "options": {
              "reports": { "save": false },
              "txtTitle": "Recipient Tasks List",
              "sql": fQuery,
              "userid":this.tocken.user,
              "head1" : "Sr#",
              "head2" : "Name",
              "head3" : "End Date",
            }
          }
          this.printS.printControl(data).subscribe((blob: any) => { 
            let _blob: Blob = blob;
            let fileURL = URL.createObjectURL(_blob);
            this.tryDoctype = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
            this.loading = false;
            }, err => {
            this.loading = false;
            this.ModalS.error({
              nzTitle: 'TRACCS',
              nzContent: 'The report has encountered the error and needs to close (' + err.code + ')',
              nzOnOk: () => {
                this.drawerVisible = false;
              },
            });
          });
          this.loading = true;
          this.tryDoctype = "";
          this.pdfTitle = "";
        }

    onItemSelected(sel: any, i:number): void {
          console.log(sel)  
          this.HighlightRow=i;   
          this.NewTask=sel;      
    }
   
    onItemDbClick(sel: any, i:number) : void {      
      this.HighlightRow=i;         
      this.ViewServiceTaskList=false;   
      this.NewTask=sel;

      this.save(this.NewTask)
 
    }
  

}
      
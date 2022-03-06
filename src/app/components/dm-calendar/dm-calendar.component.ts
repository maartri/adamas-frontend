import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject, ElementRef, NgZone, AfterViewInit, OnInit, OnDestroy, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { TimeSheetService } from '@services/index';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import * as moment from 'moment';
import format from "date-fns/format";
import { Subscription, Subject } from 'rxjs';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { isThisSecond } from 'date-fns';

const enum ImagePosition {
  LaundryService = '-24px 0px',
  PersonalCare = "-4px 0px",
  CaseManagement = "-4px 0px",
  StaffTravel = "1px -21px",
  Transport = "-98px 0px",
  Unavailable = "-50px 0px"
}

const enum ImageActivity {
  Laundry = 'DA LAUNDRY PRV',
  Personal = 'PERSONAL CARE PKGE',
  Case = 'CASE MANAGEMENT PKGE',
  StaffTravel = 'STAFF TRAVEL',
  Transport = 'TRANSPORT',
  Unavailable = 'UNAVAILABLE'
}

function makeResizableDiv(div) {
  const element = document.querySelector(div);
  const resizers = document.querySelectorAll(div + ' .resizer')
  for (let i = 0;i < resizers.length; i++) {
    const currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', function(e) {
      e.preventDefault()
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })
    
    function resize(e) {
      if (currentResizer.classList.contains('bottom-right')) {
        element.style.width = e.pageX - element.getBoundingClientRect().left + 'px'
      }
    }
    
    function stopResize() {
      window.removeEventListener('mousemove', resize)
    }
  }
}

function groupByKey(array, key) {
  return array
    .reduce((hash, obj) => {
      if(obj[key] === undefined) return hash; 
      return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
    }, {})
}

@Component({
  selector: 'dm-calendar',
  templateUrl: './dm-calendar.component.html',
  styleUrls: ['./dm-calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DmCalendarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  private paramsSubscription$: Subscription

  someChange = new Subject<any>()
  toBeSelected = new Subject<any>();

  isClicked: boolean = false
  coordinates: any
  @Input() master:boolean;

  fixedHeader: boolean = false
  optionIsClicked: boolean = false;
  checked:boolean;

  @Input() startDate: any
  @Input() dayView: number
  @Input() reload:Subject<boolean>= new Subject()
  @Input() applyFilter: Subject<any>= new Subject()
  @Input() dmOptions: Subject<any>= new Subject()
  
  @Input() copyPaste: boolean = false
  @Input() personType: string;

  @Output() showDetail = new EventEmitter();
  @Output() showOptions = new EventEmitter();
  @Output() highlighted = new EventEmitter();
  @Output() paste = new EventEmitter();
  @Output() data = new EventEmitter();
  
  
  days: any[] = [];
  daymanager: Array<any> = [];
  dmOriginal: Array<any> = [];
  dmOriginal_Recipient: Array<any> = [];
  workinghours: Array<any> = [];
  personsList: Array<any> = [];
  personValue:any;
  currentFilter:number;
 

  Filters: Array<any> = [];

  loading: boolean = false;
  HighlightColum_index:number=-1;
  load_from_server:boolean=true;
  selectedRecordNo:string;
  optionMenuDisplayed:boolean
  dmType:string = "2";
  AutoPreviewNotes:boolean;
  clickedRoster:any;
  PayPeriodEndDate:Date;
  
  optionsList = [
    { id: 1, name: 'Hide W1 W2 WKD Display', checked:false },
    { id: 2, name: 'Include Duration in shift Display', checked:false },
    { id: 3, name: 'Auto Preview Notes on click', checked:false },
    { id: 4, name: 'Include Notes in Service Display', checked:false },
    { id: 5, name: 'Include Information Only Services in Worked Hours', checked:false },
    { id: 6, name: 'Recipient Branch Only', checked:false },
   
  ];

  optionsList2 = [
    { id: 1, name: 'Booking', checked:false },
    { id: 2, name: 'Direct Care', checked:false },
    { id: 7, name: 'Case Management', checked:false },
    { id: 10, name: 'Transport', checked:false },
    { id: 11, name: 'Facilities', checked:false },
    { id: 12, name: 'Groups', checked:false },
    { id: 0, name: 'Items', checked:false },
    { id: 13, name: 'Unavailable', checked:false },
    { id: 6, name: 'Staff Admin', checked:false },
    { id: 5, name: 'Travel Time', checked:false },
    { id: 11, name: 'Staff Leave', checked:false },
    
  ];

  
  constructor(
    private timeS: TimeSheetService,
    private elem: ElementRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    cd.detach();

    this.paramsSubscription$ = this.someChange.pipe(
      debounceTime(500))
      .subscribe(data => {
        this.search(this.startDate, this.dayView);
      });

    this.toBeSelected.pipe(
      distinctUntilChanged())
      .subscribe(data => {
        if (this.akonani.indexOf(data) === -1)
          this.akonani.push(data);
      });
  }
 textValue:string='';
  viewText(value:any){
    this.textValue=value.recipient +' ' + value.activity;
    if (this.selectedRecordNo==value.recordno)
      this.selectedRecordNo="0";
    else
      this.selectedRecordNo=value.recordno;
  }
 
 
  ngOnInit() {
    let panel:any=document.getElementById("panel")
    this.days = this.calculateDays(this.startDate, this.dayView);
    this.getLocalStorage();
    this.reload.subscribe(v => { 
      this.alertChange();
     // this.reload.next(false);
    });
    this.applyFilter.subscribe(data=>{
      this.Filters=data;
      this.applyCustomFilters(this.Filters);
      //this.alertChange();
    });
    this.dmOptions.subscribe(data=>{
      
      this.applyDMOptions(data);
      //this.alertChange();
    });
    
    makeResizableDiv(panel);
  }
  
 getLocalStorage(){
   let item1 =  localStorage.getItem('dmOption1');
   let item2 = localStorage.getItem('dmOption2');
   if (item1!=null )
     if (item1.length>0)
        this.optionsList =JSON.parse(item1);
    
    if (item2!=null )
      if (item2.length>0)
        this.optionsList2 =JSON.parse(item2);
   
   this.PayPeriodEndDate = new Date(localStorage.getItem('PayPeriodEndDate'));
 }
 workingHours(dm:any,date:any){
  let sum =0;
  let dayRoster:any;
   let dt= moment(date).format('YYYY/MM/DD');
   if (this.optionsList[4].checked)
     dayRoster = dm.filter(x=>x.date==dt);
  else
    dayRoster = dm.filter(x=>x.date==dt && x.infoonly==false);
   
   if (dayRoster.length>0)
    sum = dayRoster.reduce((acc, val) => {  return acc=acc+val.duration },0);
   

    return sum;
    //return this.numStr(Math.floor(sum/12)) + ":" + this.numStr((sum%12)*5);
  
 }

 numStr(n:number):string {
  let val="" + n;
  if (n<10) val = "0" + n;
  
  return val;
}

BlockToTime(blocks:number){
 return this.numStr(Math.floor(blocks/12)) + ":" + this.numStr((blocks%12)*5)
}
  applyDMOptions(options:any){
    this.optionsList=options.dmOption1;
    this.optionsList2=options.dmOption2;
    
    this.search(this.startDate, this.dayView);
    
  }
  
  private elemMouseUp;
  private documentMouseUp;

panel:any  ; 

HighlightColum(indx:number){
  this.HighlightColum_index=indx;
}
  ngOnDestroy() {
    this.paramsSubscription$.unsubscribe();
    this.document.removeEventListener('mouseup', this.documentMouseUp, false);
    this.elem.nativeElement.removeEventListener('mouseup', this.elemMouseUp, false);
   
  }
  
  clickCount:number=0;
  RosterClick(event:any, value:any){
    value.isSelected=true;
    this.clickedRoster=value;
    
    this.clickCount++;
    setTimeout(() => {
        if (this.clickCount === 1) {
             // single
             this.akonani=[];
             this.akonani.push(value);
             if (this.optionsList[2].checked)
               this.AutoPreviewNotes=true;           
        } else if (this.clickCount === 2) {
            // double
            this.AutoPreviewNotes=false;           
        }
        this.clickCount = 0;
    }, 100) 
    console.log(value)
  }
  ngAfterViewInit() {
    this.cd.reattach();
   
    this.ngZone.runOutsideAngular(() => {

      this.elemMouseUp = (event) => {
        event.stopPropagation();
        this.isClicked = false;
                
        this.HighlightColum_index=-1
        this.highlighted.emit(this.akonani);
      }

      this.documentMouseUp = (e) => {
        this.isClicked = false;

        if (!this.optionIsClicked)
          this.deselect(null, e)
      }

    
      this.elem.nativeElement.addEventListener('mouseup', this.elemMouseUp, false);
     
      
      // Will stop highlighting other rosters if mouseup event happened outside of the desired ELEMENT Component
      // this.document.addEventListener('mouseup', this.documentMouseUp, false)
      
      // this.panel.addEventListener("mousedown", function(e){
      //   if (e.offsetX < BORDER_SIZE) {
      //     m_pos = e.x;
      //     document.addEventListener("mousemove", resize, false);
      //   }
      //  }, false);
       
      //  document.addEventListener("mouseup", function(){
      //     document.removeEventListener("mousemove", resize, false);
      //  }, false);
       
      
    });

    this.cd.detectChanges();
  }

  resetDayManager(val:any){
    if (!val)
      this.daymanager= this.dmOriginal
  }
 
  applyStaffFilters(StaffFilter:any){
    
    if (StaffFilter!=null && StaffFilter!=''){
      this.daymanager= this.dmOriginal.filter(x => x.key === StaffFilter)
     }
  }
  applyCustomFilters(Filters:any){
    
    if (Filters==null || Filters.length<=0 || Filters==''){
      this.daymanager=this.dmOriginal;
      
      this.data.emit(this.daymanager) 
      this.loading=false;
    
      return;
    } 
      
      this.daymanager=[];
     
      
      this.loading=true;
      
      let zees='zzzzzzzzzzzz';

      
      Filters.forEach(element => {
        if (element.key=='STAFF')  {
          this.dmOriginal.forEach(v=>{
            let filtered=v.value.filter(x => x.carercode.includes(element.value) )
            if (filtered.length>0)
                this.daymanager.push({key:v.key, value:filtered});
            }) 
        }
        if (element.key=='STAFF JOB CATEGORY')  {
          this.dmOriginal.forEach(v=>{
            let filtered=v.value.filter(x => (x.staffcategory >= element.value && x.staffcategory <= (element.value +zees)))
            if (filtered.length>0)
                this.daymanager.push({key:v.key, value:filtered});
            }) 
        }
        if (element.key=='STAFF TEAM')  {
          this.dmOriginal.forEach(v=>{
            let filtered=v.value.filter(x => (x.team >= element.value && x.team <= (element.value + zees)))
            if (filtered.length>0)
                this.daymanager.push({key:v.key, value:filtered});
            }) 
        }       
        
          if (element.key=='RECIPIENT')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (x.recipient >= x.recipient.includes(element.value) ))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          if (element.key=='RECIPIENT CATEGORY/REGION')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (x.recipient_Category >= element.value && x.recipient_Category <= (element.value+zees)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          if (element.key=='ACTIVITY')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (x.activity >= element.value && x.activity <= (element.value+zees)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          if (element.key=='ACTIVITY GROUP')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (x.rosterGroup >= element.value && x.rosterGroup <= (element.value+zees)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          
          if (element.key=='FACILITY')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (x.servicesetting >= element.value && x.servicesetting <= (element.value+zees)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          if (element.key=='PROGRAM')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (x.rprogram >= element.value && x.rprogram <= (element.value+zees)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          
          if (element.key=='COORDINATOR')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (x.rosterGroup >= element.value && x.rosterGroup <= (element.value+zees)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          if (element.key=='SERVICE ORDER/GRID NO')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => ( x.serviceOrderGridNo.includes(element.value)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          //Quick Filters
          if (element.key=='BRANCH LIST')  {
            if (this.optionsList[5].checked)
              this.dmOriginal.forEach(v=>{
                let filtered=v.value.filter(x => (element.value.includes(x.rosterGroup) || element.value.includes(x.recipientBranch) ))
                if (filtered.length>0)
                    this.daymanager.push({key:v.key, value:filtered});
                });
            else  
              this.dmOriginal.forEach(v=>{
                let filtered=v.value.filter(x => (element.value.includes(x.rosterGroup) || element.value.includes(x.staffbranch) || element.value.includes(x.recipientBranch) ))
                if (filtered.length>0)
                    this.daymanager.push({key:v.key, value:filtered});
                });
          }
          
          if (element.key=='PROGRAM LIST')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (element.value.includes(x.rprogram)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
          
          if (element.key=='ACTIVITY LIST')  {
            this.dmOriginal.forEach(v=>{
              let filtered=v.value.filter(x => (element.value.includes(x.activity)))
              if (filtered.length>0)
                  this.daymanager.push({key:v.key, value:filtered});
              }) 
          }
      });
        this.ApplyDMOPtionsFilter();
        this.data.emit(this.daymanager) 
        this.loading=false;
    
}
ApplyDMOPtionsFilter(){

  //---------------DM Options Filter----------------------
  let dm:Array<any>=[]
  this.optionsList2.forEach(element => {
    if (element.checked && element.id==2)  {
      this.daymanager.forEach(v=>{
        let filtered=v.value.filter(x => x.type==2 ||  x.type==3 ||  x.type==8) 
        if (filtered.length>0)
        dm.push({key:v.key, value:filtered});
        }) 
    }else if (element.checked && element.id==6)  {
      this.daymanager.forEach(v=>{
        let filtered=v.value.filter(x => x.type==6 ||  x.minorGroup!='LEAVE' ) 
        if (filtered.length>0)
        dm.push({key:v.key, value:filtered});
        })
      }else if (element.checked && element.id==11)  {
        this.daymanager.forEach(v=>{
          let filtered=v.value.filter(x =>  x.minorGroup=='LEAVE' ) 
          if (filtered.length>0)
          dm.push({key:v.key, value:filtered});
          })
        }else if (element.checked && element.id>0)  {
        this.daymanager.forEach(v=>{
          let filtered=v.value.filter(x => x.type==element.id ) 
          if (filtered.length>0)
          dm.push({key:v.key, value:filtered});
          })
        }
  });

  if (dm.length>0)
    this.daymanager=dm;
  
    dm=[]

}
applyDMFilters(PersonTypeFilter:any){
    
  if (PersonTypeFilter!=null && PersonTypeFilter!=''){
    
    this.daymanager=[];
    
    this.currentFilter=this.getfilterType(PersonTypeFilter);
    this.dmType=""+this.currentFilter;
    let sDate = moment(this.startDate).format('YYYY/MM/DD');
    let eDate = moment(this.startDate).add(this.dayView - 1, 'days').format('YYYY/MM/DD');
    
    this.loading=true;
    
    this.timeS.getStaffWorkingHours({StartDate: sDate, EndDate: eDate, dmType: this.dmType }).pipe(
      debounceTime(200))
      .subscribe(data => {
        this.workinghours = data;         
      });

     switch(this.currentFilter){
      case 1: 
          //'Unallocated Bookings'
          this.daymanager = this.dmOriginal.filter(x=>x.key.trim() === 'BOOKED');
          break;
      case 2:    
       //'Staff Management'    
       this.daymanager = this.dmOriginal.filter(x=>x.key.trim() != 'ADMIN');
        
        break;      
      case 3:         
        //'Transport Recipients'
          this.dmOriginal_Recipient.forEach(v=>{
          let filtered=v.value.filter(x => (x.rosterGroup === 'TRANSPORT'))
          if (filtered.length>0)
              this.daymanager.push({key:v.key, value:filtered});
          })        
          
          break;
      case 4:
        //'Transport Staff'
          this.dmOriginal.forEach(v=>{
            
            let filtered=v.value.filter(x => (x.rosterGroup === 'TRANSPORT' && x.carercode !='!MULTIPLE'))
            if (filtered.length>0)
              this.daymanager.push({key:v.key, value:filtered});
          })
        
         break;
      case 5:
          //'Transport Daily Planner'

        break;
      case 6:
        //'Facilities Recipients'
        this.dmOriginal_Recipient.forEach(v=>{
          let filtered=v.value.filter(x => (x.rosterGroup === 'CENTREBASED'))
          if (filtered.length>0)
            this.daymanager.push({key:v.key, value:filtered});
        })
        break;
      case 7:
        //'Facilities Staff'
        this.dmOriginal.forEach(v=>{
          let filtered=v.value.filter(x => (x.rosterGroup === 'CENTREBASED'))
          if (filtered.length>0)
            this.daymanager.push({key:v.key, value:filtered});
        })
        break;
      case 8:
        //'Group Recipients'
        this.dmOriginal_Recipient.forEach(v=>{
          let filtered=v.value.filter(x => (x.rosterGroup === 'GROUPACTIVITY'))
          if (filtered.length>0)
            this.daymanager.push({key:v.key, value:filtered});
        })
        break;
      case 9:
        //'Group Staff'
        this.dmOriginal.forEach(v=>{
          let filtered=v.value.filter(x => (x.rosterGroup === 'GROUPACTIVITY'))
          if (filtered.length>0)
            this.daymanager.push({key:v.key, value:filtered});
        })
        break;
      case 10:
        //'Grp/Trns/Facility- Recipients'
        this.dmOriginal_Recipient.forEach(v=>{
          let filtered=v.value.filter(x => (x.type == 10 || x.type == 11 || x.type == 12))
          if (filtered.length>0)
            this.daymanager.push({key:v.key, value:filtered});
        })
        break;
      case 11:
        //'Grp/Trns/Facility-Staff'
        //AND ([ro].[Type] = 7 OR [ro].[Type] = 2 OR [ro].[Type] = 8 OR [ro].[Type] = 3 OR [ro].[Type] = 5 OR [ro].[Type] = 10 OR [ro].[Type] = 11 OR [ro].[Type] = 12 OR [ro].[Type] = 1 OR [ro].[Type] = 13 OR ([ro].[Type] = 6 AND [ItemTypes].[MinorGroup] <> 'LEAVE') OR ([ItemTypes].[MinorGroup] = 'LEAVE') 
        
        this.dmOriginal.forEach(v=>{
          let filtered=v.value.filter(x => (x.type == 7 || x.type == 2 || x.type == 8 || x.type == 3 || x.type == 5|| x.type == 10 || x.type == 11 || x.type == 12 || x.type == 1 || x.type == 13 || x.type == 6  && x.minorGroup != 'LEAVE') || (x.minorGroup == 'LEAVE'))
          if (filtered.length>0)
            this.daymanager.push({key:v.key, value:filtered});
        })
        break;
      case 12:
        
        // //'Recipient Management'
        // //([ro].[Type] = 7 OR [ro].[Type] = 2 OR [ro].[Type] = 8 OR [ro].[Type] = 10 OR [ro].[Type] = 11 OR [ro].[Type] = 12 )

        // this.dmOriginal_Recipient.forEach(v=>{
        //   let filtered=v.value.filter(x => x.recipient!='!MULTIPLE' && x.recipient!='!INTERNAL' && (x.type == 7 || x.type == 2 || x.type == 8 || x.type == 10 || x.type == 11 || x.type == 12))
        //   if (filtered.length>0)
        //     this.daymanager.push({key:v.key, value:filtered});
        // })
        
       
        this.daymanager=this.dmOriginal_Recipient;

        break;
     
      default:
        this.daymanager=this.dmOriginal;
        break;
    }
    this.loading=false;
  }
}

getfilterType(type:String)
{
  switch(type){
  case 'Unallocated Bookings':
        return 1;       
  case 'Staff Management':
        return 2;    
  case 'Transport Recipients':         
        return 3;
  case 'Transport Staff':
        return 4;
  case 'Transport Daily Planner':
        return 5;
  case 'Facilities Recipients':
        return 6;
  case 'Facilities Staff':
        return 7;
  case 'Group Recipients':
        return 8    
  case 'Group Staff':
        return 9
  case 'Grp/Trns/Facility- Recipients':
        return 10;
  case 'Grp/Trns/Facility-Staff':
        return 11;
  case 'Recipient Management':
        return 12;  
  default:
        return 0;
  }
}

  ngOnChanges(changes: SimpleChanges) {
    let date;
    if (changes['dayView']) {
      this.dayView = changes['dayView'].currentValue
    }

    if (changes['startDate']) {
      date = changes['startDate'].currentValue;
     
    }
    
   
    if (changes['copyPaste'] && !changes['copyPaste'].isFirstChange()) {
      this.copyPaste = changes['copyPaste'].currentValue
      this.highLightCopyWrappers(this.copyPaste)
      return;
    }
    this.dmType="2";
    if (this.personType!=null){
      this.currentFilter=this.getfilterType(this.personType);
      this.dmType=""+this.currentFilter;
      if (this.currentFilter!=2 && this.currentFilter!=12){
        this.load_from_server=true;
      }
    }
     
     this.alertChange(date);
     
   // if (changes['personType'].previousValue==null )
     // this.alertChange(date);
   // else if (changes['personType']!=null || changes['personType'].currentValue!=this.personType) 
      //this.applyFilters(this.personType)
  }

  highLightCopyWrappers(show: boolean) {
    var rosterContainers = this.elem.nativeElement.getElementsByClassName('roster-container')
    if (show) {
      for (let roster of rosterContainers) {
        this.renderer.addClass(roster, 'toCopy')
      }
    } else {
      for (let roster of rosterContainers) {
        this.renderer.removeClass(roster, 'toCopy')
      }
    }
  }


  showOptionEvent(value: any): void {

    if (this.akonani.length < 2) {
      var rostersThatDay
      for (var a = 0, len = this.daymanager.length; a < len; a++) {
        if (this.daymanager[a] && this.daymanager[a].key === value.carercode) {
          rostersThatDay = this.daymanager[a].value.filter(x => x.date === value.date)
         
          break;
        }
      }
    }

    this.showOptions.emit({ selected: value, diary: rostersThatDay });
    
    
  }

  optionEmitter(data: any) {
    this.optionIsClicked = true;
    this.showOptionEvent(data);
  }

  mouseEmitter(data: any) {
    data.isSelected = true;
  }

  alertChange(date: any = this.startDate) {
      //console.log(this.personType);
      if (moment(date).isValid()) {
        this.loading = true;
        this.startDate = moment(date);
        this.days = this.calculateDays(this.startDate, this.dayView);
        this.someChange.next()
      } 
         
  }

  previousDate() {
    this.alertChange(moment(this.startDate).subtract(this.dayView, 'day'));
  }

  futureDate() {
    this.alertChange(moment(this.startDate).add(this.dayView, 'day'))
  }

 
  deselect(data: any = null, $event: any = null): void {

    if ($event && $event.button == 0) {
        this.akonani = []
      if ($event.target.classList.contains('toCopy')) {
        
        var date = $event.target.getAttribute('date')
        this.paste.emit({ date: format(new Date(date), 'YYYY/MM/DD') })
        return;
      }

      this.akonani = []
      this.daymanager.forEach(x => {
        x.value.forEach(element => {
          element.isSelected = false;
        });
      });

      if (data) {
        data.isSelected = true;
        this.akonani.push(data)
      }
    }
    this.optionIsClicked = false;
  }
  

  search(date: any, dayView: number) {
          
    let sDate = moment(date).format('YYYY/MM/DD');
    let eDate = moment(date).add(dayView - 1, 'days').format('YYYY/MM/DD');
   
    
    this.timeS.getdaymanager({ StartDate: sDate, EndDate: eDate,dmType:this.dmType }).pipe(
      debounceTime(200))
      .subscribe(data => {
        this.daymanager = data;
        this.dmOriginal = data;
        this.data.emit(data);
        this.loading = false;
        this.load_from_server=false;
        //console.log(data)
        this.personsList = this.daymanager.map(x => x.key )
        if (this.Filters.length>0)
          this.applyCustomFilters(this.Filters)
        else
          this.ApplyDMOPtionsFilter();
      })
    
    
      this.timeS.getStaffWorkingHours({ StartDate: sDate, EndDate: eDate,dmType:this.dmType }).pipe(
        debounceTime(200))
        .subscribe(data => {
          this.workinghours = data;
         
        })

        // this.dmType="12";
        // this.timeS.getdaymanager({ StartDate: sDate, EndDate: eDate,dmType:this.dmType }).pipe(
        //   debounceTime(200))
        //   .subscribe(data => {            
        //     this.dmOriginal_Recipient = data;           
        //   })

  }
  
  getWorkHours2(accountNo:string):any
  {
      let hrs:string
      let lstHrs: any;
      let pp:String='00:00';
      let workHours:any={AccountNo:'' ,w1:'', w2:'',fn:'',tt:'',pp:''};
     
        lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo);
        if (Array.isArray(lstHrs)){
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
              pp=lstHrs[0].payprdWrkdHr
        }else{
              hrs=this.workinghours.find(obj => obj.accountNo === accountNo).total_WrkdHr;
              pp=lstHrs.payprdWrkdHr
        }
        workHours.AccountNo=accountNo;
        workHours.tt=hrs;
        workHours.pp=pp;
      //case 'W1':
      
         lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo && obj.weekNo==1);         
         if (Array.isArray(lstHrs))
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
          else if (lstHrs!=null)
              hrs=lstHrs.total_WrkdHr;
          else
            hrs="00:00";
            workHours.w1=hrs; 
      // case 'W2':
      
        lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo && obj.weekNo==2);
        if (Array.isArray(lstHrs))
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
        else if (lstHrs!=null)
              hrs=lstHrs.total_WrkdHr;
        else
          hrs="00:00";
          workHours.w2=hrs; 
      // case 'F':
           lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo && obj.weekNo<=2);
           if (Array.isArray(lstHrs))
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
            else if (lstHrs!=null)
              hrs=lstHrs.total_WrkdHr;
            else
              hrs="00:00";
              workHours.fn=hrs; 
    
    
      return workHours;
    }
 
  getWorkHours(accountNo:string,wtype:string)
  {
      let hrs:string
      let lstHrs: any;
      lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo);
      if (lstHrs==null)
        return "00:00";

      switch(wtype){
      case 'T': 
      {
        
        if (Array.isArray(lstHrs))
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
        else
              hrs=this.workinghours.find(obj => obj.accountNo === accountNo).total_WrkdHr;
        
        break;
      }
      case 'W1':
      {
         lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo && obj.weekNo==1);         
         
         if (Array.isArray(lstHrs))
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
          else if (lstHrs!=null)
              hrs=lstHrs.total_WrkdHr;
          else
            hrs="00:00";
         break;
       } 
       case 'W2':
      {
        lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo && obj.weekNo==2);
        if (Array.isArray(lstHrs))
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
        else if (lstHrs!=null)
              hrs=lstHrs.total_WrkdHr;
        else
          hrs="00:00";
         break;
       } 
       case 'F':
        {
           lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo && (obj.weekNo==1|| obj.weekNo==2));
           if (Array.isArray(lstHrs))
              hrs=lstHrs.reduce((accumulator, current) => accumulator + current.total_WrkdHr, 0);
            else if (lstHrs!=null)
              hrs=lstHrs.total_WrkdHr;
            else
              hrs="00:00";
           break;
         } 
      case 'P': 
       {
        //lstHrs=this.workinghours.find(obj => obj.accountNo === accountNo );
        if (Array.isArray(lstHrs))
          hrs=lstHrs[0].payprdWrkdHr;
        else
          hrs=hrs=lstHrs.payprdWrkdHr;
        break;
       
      }
    }
      return hrs;
    }
  getPositionImg(data: any) {
    let activity = data.activity;
    if (activity.indexOf(ImageActivity.Unavailable) !== -1) return ImagePosition.Unavailable;
    if (activity.indexOf(ImageActivity.Transport) !== -1) return ImagePosition.Transport;
    if (activity.indexOf(ImageActivity.StaffTravel) !== -1) return ImagePosition.StaffTravel;
    if (activity.indexOf(ImageActivity.Personal) !== -1) return ImagePosition.PersonalCare;
    if (activity.indexOf(ImageActivity.Case) !== -1) return ImagePosition.CaseManagement;
    if (activity.indexOf(ImageActivity.Laundry) !== -1) return ImagePosition.LaundryService;
  }

  calculateDays(date: any, dayView: number) {
  
    let dd=new Date(date).getDay();
    date = moment(date).add('day', 1-dd);
    this.startDate=date;
    let temp:any=date;
    let tempArr: Array<any> = [];
    tempArr.push(null);
    

    for (var a = 0; a < dayView; a++) {
      tempArr.push(temp);
      temp = moment(temp).add('day', 1);
    }
    return tempArr;
  }

  drop(event: DragEvent | any) {
    event.stopPropagation();

    if (event.target.getAttribute('date') > 0) {
      var data = event.dataTransfer.getData("text")
      event.target.appendChild(document.getElementById(data));
    }

    //this.daymanager[0].value.push(this.draggedObject)
    //this.daymanager = [{"key":"AHMAD A","value":[{"Staff":"AHMAD A","UniqueID":"T0100005533","CoOrdinator":"K AGGARWAL","ServiceOrder/GridNo":"jh","RecipientType":"RECIPIENT","Category":"ARUNDEL","":"Male","Recipient":"ABBOT T","CarerCode":"AHMAD A","Activity":"CDC - DA-WD","BillQty":2,"DMColor":"FFFFFF","JobType":"","InfoOnly":false,"RosterGroup":"ONEONONE","MinorGroup":"NOT APPLICABLE","NoChangeDate":false,"NoChangeTime":false,"TimeChangeLimit":600,"StartTimeLimit":"06:00","EndTimeLimit":"18:00","DayMask":"00000111","StaffCategory":"","Team":"MTA STEPH ARSHAD IRFAN","StfGender":"MALE","HRS_FNIGHTLY_MIN":"","HRS_FNIGHTLY_MAX":"","HRS_WEEKLY_MIN":"","HRS_WEEKLY_MAX":"","CH_1_1":"","CH_1_2":"","CH_1_3":"","CH_1_4":"","CH_1_5":"","CH_1_6":"","CH_1_7":"","ShiftType":"CDC - DA-WD","Setting/Location":"","rProgram":"CDC-L2-001","RecipientCategory/Region":"","RecordNo":904200,"Date":"2019/01/07","YearNo":2019,"MonthNo":1,"Dayno":7,"BillRate":36,"BillUnit":"HOUR","StartTime":"09:00","Duration":24,"WkdHrs":24,"Type":2,"Status":"1","Notes":"YES","HasServiceNotes":"","DMStat":"","ShiftName":"AHMAD A","EndTime":"11:00"}]},{"key":"AI CLA PT GRAHAM N L","value":[{"Staff":"AI CLA PT GRAHAM N L","UniqueID":"T0100005533","CoOrdinator":"K AGGARWAL","ServiceOrder/GridNo":"jh","RecipientType":"RECIPIENT","Category":"ARUNDEL","":"Male","Recipient":"ABBOT T","CarerCode":"AI CLA PT GRAHAM N L","Activity":"CDC - DA-WD","BillQty":0,"DMColor":"FFFFFF","JobType":"","InfoOnly":false,"RosterGroup":"ONEONONE","MinorGroup":"NOT APPLICABLE","NoChangeDate":false,"NoChangeTime":false,"TimeChangeLimit":600,"StartTimeLimit":"06:00","EndTimeLimit":"18:00","DayMask":"00000111","StaffCategory":"","Team":"AI CLA","StfGender":"FEMALE","HRS_FNIGHTLY_MIN":"","HRS_FNIGHTLY_MAX":"","HRS_WEEKLY_MIN":"","HRS_WEEKLY_MAX":"","CH_1_1":"","CH_1_2":"","CH_1_3":"","CH_1_4":"","CH_1_5":"","CH_1_6":"","CH_1_7":"","ShiftType":"CDC - DA-WD","Setting/Location":"","rProgram":"CDC-L2-001","RecipientCategory/Region":"","RecordNo":904202,"Date":"2019/01/09","YearNo":2019,"MonthNo":1,"Dayno":9,"BillRate":36,"BillUnit":"HOUR","StartTime":"10:00","Duration":12,"WkdHrs":12,"Type":2,"Status":"1","Notes":"YES","HasServiceNotes":"","DMStat":"","ShiftName":"AI CLA PT GRAHAM N L","EndTime":"11:00"}]}]
    this.draggedObject.Date = "2019/01/09"
    this.draggedObject.Staff = "AHMAD A"

    //this.daymanager[0].value.push(this.draggedObject);
    //this.daymanager.pop()
    var sample = this.daymanager;
    this.daymanager = []
    this.daymanager = sample;

    // this.daymanager = this.daymanager;
  }

  draggedObject: any;
  dragStart(event: DragEvent | any, value: any) {
    this.akonani=[];
    this.draggedObject = value;
    event.target.setAttribute('id', 'selectedCell')
    event.dataTransfer.setData("text", event.target.id);
  }

  dragOver(event: DragEvent) {
    return false
  }

  dragEnd(event: DragEvent | any) {
    event.target.setAttribute('id', '')
    this.draggedObject = ""
    console.log(this.akonani);
  }

  mouseenter(event: any, data: any) {
    if(this.isClicked){
        console.log(this.akonani.indexOf(data) === -1)
        if(this.akonani.indexOf(data) === -1) {
            this.akonani.push(data);
        }
    }
  }

  mousedown(event: any, data: any) {
    event.preventDefault();
    event.stopPropagation();
    this.HighlightColum_index=-1

    this.isClicked = true;
    this.coordinates = {
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  rightClickMenuOut(event: any, value: any, staffCode:any) {
    event.preventDefault();
    let new_position = {date:value._d,  carercode:staffCode, dmType:this.dmType}
    if (!this.optionMenuDisplayed)
      this.optionEmitter(new_position);
    
      this.optionMenuDisplayed = false;

  }
  rightClickMenu(event: any, value: any) {
    this.optionMenuDisplayed=true;
    event.preventDefault();
    this.optionEmitter(value);
    

  }
  mousedblclick(event: any, value: any) {
    event.preventDefault();
    event.stopPropagation();
    this.deselect(null, event);
    this.HighlightColum_index=-1
    this.AutoPreviewNotes=false;
    this.clickCount = 0;
    //value.isSelected=true;
    //this.isClicked = false;
    this.coordinates = {
      clientX: event.clientX,
      clientY: event.clientY
    };
    this.showDetail.emit(value);
  }
  akonani: Array<any> = []
  mousemove(event: any, data: any) {
    event.stopPropagation();
    if (this.isClicked) {
      this.toBeSelected.next(data)
      const math = Math.round(Math.sqrt(Math.pow(this.coordinates.clientY - event.clientY, 2) + Math.pow(this.coordinates.clientX - event.clientX, 2)));
      if (math > 3) {
        data.isSelected = true;
      }
    }
  }
}
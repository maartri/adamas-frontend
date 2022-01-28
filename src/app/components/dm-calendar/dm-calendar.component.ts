import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject, ElementRef, NgZone, AfterViewInit, OnInit, OnDestroy, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { TimeSheetService } from '@services/index';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import * as moment from 'moment';
import format from "date-fns/format";
import { Subscription, Subject } from 'rxjs';

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

  fixedHeader: boolean = false
  optionIsClicked: boolean = false;

  @Input() startDate: any
  @Input() dayView: number
  @Input() reload:Subject<boolean>= new Subject()
  @Input() copyPaste: boolean = false

  @Output() showDetail = new EventEmitter();
  @Output() showOptions = new EventEmitter();
  @Output() highlighted = new EventEmitter();
  @Output() paste = new EventEmitter();
  @Output() data = new EventEmitter();

  days: any[] = [];
  daymanager: Array<any> = [];

  loading: boolean = false;
  
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

  ngOnInit() {
    this.days = this.calculateDays(this.startDate, this.dayView);
    this.reload.subscribe(v => { 
      this.alertChange();
     // this.reload.next(false);
    });
  }

  private elemMouseUp;
  private documentMouseUp;
 

  ngOnDestroy() {
    this.paramsSubscription$.unsubscribe();
    this.document.removeEventListener('mouseup', this.documentMouseUp, false);
    this.elem.nativeElement.removeEventListener('mouseup', this.elemMouseUp, false);
   
  }

  ngAfterViewInit() {
    this.cd.reattach();

    this.ngZone.runOutsideAngular(() => {

      this.elemMouseUp = (event) => {
        event.stopPropagation();
        this.isClicked = false;
        this.highlighted.emit(this.akonani);
      }

      this.documentMouseUp = (e) => {
        this.isClicked = false;

        if (!this.optionIsClicked)
          this.deselect(null, e)
      }

    
      this.elem.nativeElement.addEventListener('mouseup', this.elemMouseUp, false);
     
      
      // Will stop highlighting other rosters if mouseup event happened outside of the desired ELEMENT Component
      this.document.addEventListener('mouseup', this.documentMouseUp, false)
      

    });

    this.cd.detectChanges();
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

    this.alertChange(date);
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
    console.log(date);
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
    this.timeS.getdaymanager({ StartDate: sDate, EndDate: eDate }).pipe(
      debounceTime(200))
      .subscribe(data => {
        this.daymanager = data;
        this.data.emit(data);
        this.loading = false;
        console.log(data)
      })
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
    let temp = date;
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
  }

  mouseenter(event: any, data: any) {
    // if(this.isClicked){
    //     console.log(this.akonani.indexOf(data) === -1)
    //     if(this.akonani.indexOf(data) === -1) {
    //         this.akonani.push(data);
    //     }
    // }
  }

  mousedown(event: any, data: any) {
    event.preventDefault();
    event.stopPropagation();

    this.isClicked = true;
    this.coordinates = {
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  mousedblclick(event: any, value: any) {
    event.preventDefault();
    event.stopPropagation();

    this.isClicked = true;
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
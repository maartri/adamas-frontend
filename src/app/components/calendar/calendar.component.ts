 import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
    Input,
    OnInit,
    OnDestroy,
    AfterViewInit
  } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import { takeUntil, delay } from 'rxjs/operators';

import parseISO from 'date-fns/parseISO';
import parse from 'date-fns/parse';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';
import sub from 'date-fns/sub';
import add from 'date-fns/add';

import { GlobalService, StaffService, leaveTypes, roles } from '@services/index';
import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

const currDateMoment = new Date();

interface RosterEvent {
  billRate: string,
  carer: string,
  client: string,
  endTime: string,
  notes: string,
  recordNo: string,
  service: string,
  startTime: string,
  status: string,
  type: string
}


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.css'],
  styles: [`
        h3 {
            margin: 0 0 10px;
        }

        pre {
            background-color: #f5f5f5;
            padding: 15px;
        }
        .btn-group div{
            padding: 4px 5px;
            font-size: 14px;
        }
        mwl-calendar-month-view >>> mwl-calendar-month-view-header > div.cal-header > div{
            font-weight: 400;
        }
        nz-select{
            float: right;
            margin: 0 0 10px 0;
        }
    `],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @Input() accountNo;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  private unsubscribe$ = new Subject();

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  temporaryEvents: CalendarEvent[];

  timeArray: Array<number> = [5, 10, 15, 30];

  hourSegments: number;
  minuteInterval: number;
  dayLimit: number = 10;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  isVisible: boolean = false;
  toggleAdminFees: boolean = false;
  title: string;

  rosterData: RosterEvent;
  roles: any = roles;
  user: any;

  loadDate: boolean = false;
  // actions: CalendarEventAction[] = [
  //     {
  //         label: '<i class="fa fa-fw fa-pencil"></i>',
  //         a11yLabel: 'Edit',
  //         onClick: ({ event }: { event: CalendarEvent }): void => {
  //             this.handleEvent('Edited', event);
  //         }
  //     },
  //     {
  //         label: '<i class="fa fa-fw fa-times"></i>',
  //         a11yLabel: 'Delete',
  //         onClick: ({ event }: { event: CalendarEvent }): void => {
  //             this.events = this.events.filter(iEvent => iEvent !== event);
  //             this.handleEvent('Deleted', event);
  //         }
  //     }
  // ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;

  constructor(
    // private modal: NgbModal
    private staffS: StaffService,
    private globalS: GlobalService
  ) { }


  ngOnInit() {
    this.user = this.globalS.decode();
  }

  ngAfterViewInit() {
    if (this.user.role === roles.provider) {
      this.loadDate = true;
      this.staffS.getmobilefuturelimit(this.user.nameid).pipe(delay(500)).subscribe(data => {
        console.log(data)
        if (data.dayLimit != 0) {
          this.dayLimit = data.dayLimit;
        }
        this.dateChanged(new Date(), this.view)
      });
    }

    if (this.user.role === roles.client) {
      this.search(
        format(startOfMonth(new Date()), 'yyyy/MM/dd'),
        format(endOfMonth(new Date()), 'yyyy/MM/dd')
      )
    }
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  // eventTimesChanged({
  //     event,
  //     newStart,
  //     newEnd
  // }: CalendarEventTimesChangedEvent): void {
  //     this.events = this.events.map(iEvent => {
  //         if (iEvent === event) {
  //             return {
  //                 ...event,
  //                 start: newStart,
  //                 end: newEnd
  //             };
  //         }
  //         return iEvent;
  //     });
  //     this.handleEvent('Dropped or resized', event);
  // }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: any): void {
    this.modalData = { event, action };
    this.rosterData = event.data;

    const type = parseInt(this.rosterData.type);
    const status = parseInt(this.rosterData.status);

    if (type == 1) {
      this.title = "UNASSIGNED BOOKING";
    }

    if (type > 1) {
      if (status == 1) this.title = "ASSIGNED BOOKING";
      if (status == 2) this.title = "FINALISED SERVICE";
      if (status == 3 || status == 4) this.title = `BILLED ${this.rosterData.recordNo}`;
    }

    this.isVisible = true;
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  handleCancel() {
    this.isVisible = false;
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  filterDate(datalist: Array<any>, isToggleAdmin: boolean = false, initialLoad: boolean = false) {

    this.events = datalist.map(x => {
      let totalColors = Object.keys(colors);

      let sTime = format(parse(x.shift_Start, 'yyyy/MM/dd HH:mm', new Date()), 'HH:mm');
      let eTime = format(parse(x.shift_End, 'yyyy/MM/dd HH:mm', new Date()), 'HH:mm');

      return {
        start: new Date(x.shift_Start),
        end: new Date(x.shift_End),
        title: `${x.serviceType} |  ${x.carerCode} | ${sTime} - ${eTime}`,
        //actions: this.actions,
        color: colors[totalColors[this.designateColor(x.status, x.type)]],
        data: {
          client: x.clientCode,
          service: x.serviceType,
          carer: x.carerCode,
          startTime: sTime,
          endTime: eTime,
          notes: x.notes,
          recordNo: x.recordNo,
          type: x.type,
          billUnit: x.billUnit,
          billRate: x.billRate,
          status: x.status
        }
      }
    }).filter(x => {
      var type = !isToggleAdmin ? "14" : ""
      if (x && x.data.type !== type)
        return x;
    });
    this.refresh.next();
  }

  designateColor(_status: string, _type: string): number {
    const type = parseInt(_type);
    const status = parseInt(_status);

    if (type == 1) {
      return 0;
    }

    if (type > 1) {
      if (status == 1) return 6;
      if (status == 2) return 3;
      if (status == 3 || status == 4) return 4;
    }

  }


  search(startDate: any, endDate: any) {

    this.staffS.getroster({
      RosterType: this.user.role,
      AccountNo: this.user.code,
      StartDate: startDate,
      EndDate: endDate
    }).pipe(
      takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.temporaryEvents = data;
        console.log(data);
        this.filterDate(this.temporaryEvents, null, true);
      }, err => {
          
      },() =>{
          this.loadDate = false;
      });
  }


  dateChanged(event: any, view: string = ""): void {
    this.loadDate = true;

    if (this.view === 'month') {
      const startDate = sub(currDateMoment, { days: this.dayLimit});
      const endDate = add(currDateMoment,{ days: this.dayLimit });

      this.search(
        format(startDate, 'yyyy/MM/dd'),
        format(endDate, 'yyyy/MM/dd')
      );
    }

    if (this.view === 'week') {

      const startDate = sub(currDateMoment, { days: this.dayLimit });
      const endDate = add(currDateMoment, { days: this.dayLimit });

      this.search(
        format(startDate, 'yyyy/MM/dd'),
        format(endDate, 'yyyy/MM/dd')
      );
    }

    if (this.view === 'day') {
      const startDate = event;
      this.minuteInterval = 5;
      this.hourSegments = 12;

      this.loadDate = false;
      // this.search(
      //   moment(startDate).format('YYYY/MM/DD'), 
      //   moment(startDate).format('YYYY/MM/DD')
      // );
    }
  }

  toggle(toggle: boolean) {
    this.filterDate(this.temporaryEvents, toggle);
  }

  timeSegChange(num: number) {
    if (num == 5) {
      this.hourSegments = 12
    }

    if (num == 10) {
      this.hourSegments = 6
    }

    if (num == 15) {
      this.hourSegments = 4
    }

    if (num == 30) {
      this.hourSegments = 2
    }

    setTimeout(() => {
      this.refresh.next();
    }, 10);
  }
}
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { interval } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-global-alerts',
  templateUrl: './global-alerts.component.html',
  styleUrls: ['./global-alerts.component.css']
})
export class GlobalAlertsComponent implements OnInit {

  @ViewChild('template', { static: true }) template: any;


  constructor(private notification: NzNotificationService) { }

  ngOnInit(): void {
    interval(10000).subscribe(x => {

      // this.notification.blank(
      //   'Alert Notification',
      //   'This is the content of the notification. This is the content of the notification. This is the content of the notification.'
      // );

        // this.notification.template(this.template)
    })
  }

}

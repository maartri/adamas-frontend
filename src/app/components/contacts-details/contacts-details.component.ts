import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-contacts-details',
  templateUrl: './contacts-details.component.html',
  styleUrls: ['./contacts-details.component.css']
})
export class ContactsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() user: any;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void{

  }

  ngOnDestroy(): void{

  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incident-profile',
  templateUrl: './incident-profile.component.html',
  styleUrls: ['./incident-profile.component.css']
})
export class IncidentProfileComponent implements OnInit {
  
  radioValue = 'A';
  date: Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}

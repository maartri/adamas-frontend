import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTimesheetComponent } from './search-timesheet.component';

describe('SearchTimesheetComponent', () => {
  let component: SearchTimesheetComponent;
  let fixture: ComponentFixture<SearchTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmCalendarComponent } from './dm-calendar.component';

describe('DmCalendarComponent', () => {
  let component: DmCalendarComponent;
  let fixture: ComponentFixture<DmCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalQuoteComponent } from './interval-quote.component';

describe('IntervalQuoteComponent', () => {
  let component: IntervalQuoteComponent;
  let fixture: ComponentFixture<IntervalQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntervalQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

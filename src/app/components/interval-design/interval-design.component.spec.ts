import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalDesignComponent } from './interval-design.component';

describe('IntervalDesignComponent', () => {
  let component: IntervalDesignComponent;
  let fixture: ComponentFixture<IntervalDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

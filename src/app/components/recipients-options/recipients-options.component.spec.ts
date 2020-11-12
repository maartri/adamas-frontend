import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientsOptionsComponent } from './recipients-options.component';

describe('RecipientsOptionsComponent', () => {
  let component: RecipientsOptionsComponent;
  let fixture: ComponentFixture<RecipientsOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipientsOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

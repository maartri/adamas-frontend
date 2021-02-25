import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectListRecipientComponent } from './select-list-recipient.component';

describe('SelectListRecipientComponent', () => {
  let component: SelectListRecipientComponent;
  let fixture: ComponentFixture<SelectListRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectListRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectListRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

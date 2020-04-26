import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientPopupComponent } from './recipient-popup.component';

describe('RecipientPopupComponent', () => {
  let component: RecipientPopupComponent;
  let fixture: ComponentFixture<RecipientPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipientPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

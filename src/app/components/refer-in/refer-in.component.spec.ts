import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferInComponent } from './refer-in.component';

describe('ReferInComponent', () => {
  let component: ReferInComponent;
  let fixture: ComponentFixture<ReferInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonefaxComponent } from './phonefax.component';

describe('PhonefaxComponent', () => {
  let component: PhonefaxComponent;
  let fixture: ComponentFixture<PhonefaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonefaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonefaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

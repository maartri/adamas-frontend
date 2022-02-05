import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdiaClaimUpdateComponent } from './ndia-claim-update.component';

describe('NdiaClaimUpdateComponent', () => {
  let component: NdiaClaimUpdateComponent;
  let fixture: ComponentFixture<NdiaClaimUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NdiaClaimUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NdiaClaimUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

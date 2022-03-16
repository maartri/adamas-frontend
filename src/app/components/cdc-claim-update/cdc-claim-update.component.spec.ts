import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdcClaimUpdateComponent } from './cdc-claim-update.component';

describe('CdcClaimUpdateComponent', () => {
  let component: CdcClaimUpdateComponent;
  let fixture: ComponentFixture<CdcClaimUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdcClaimUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdcClaimUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

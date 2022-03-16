import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdcClaimPreparationComponent } from './cdc-claim-preparation.component';

describe('CdcClaimPreparationComponent', () => {
  let component: CdcClaimPreparationComponent;
  let fixture: ComponentFixture<CdcClaimPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdcClaimPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdcClaimPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdcProdaClaimUpdateComponent } from './cdc-proda-claim-update.component';

describe('CdcProdaClaimUpdateComponent', () => {
  let component: CdcProdaClaimUpdateComponent;
  let fixture: ComponentFixture<CdcProdaClaimUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdcProdaClaimUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CdcProdaClaimUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

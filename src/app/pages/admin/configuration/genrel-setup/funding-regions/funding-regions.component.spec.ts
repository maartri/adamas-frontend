import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingRegionsComponent } from './funding-regions.component';

describe('FundingRegionsComponent', () => {
  let component: FundingRegionsComponent;
  let fixture: ComponentFixture<FundingRegionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingRegionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexUploadComponent } from './dex-upload.component';

describe('DexUploadComponent', () => {
  let component: DexUploadComponent;
  let fixture: ComponentFixture<DexUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DexUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DexUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSharedComponent } from './upload-shared.component';

describe('UploadSharedComponent', () => {
  let component: UploadSharedComponent;
  let fixture: ComponentFixture<UploadSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

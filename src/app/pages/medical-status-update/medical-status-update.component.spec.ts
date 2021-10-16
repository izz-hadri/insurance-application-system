import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalStatusUpdateComponent } from './medical-status-update.component';

describe('MedicalStatusUpdateComponent', () => {
  let component: MedicalStatusUpdateComponent;
  let fixture: ComponentFixture<MedicalStatusUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalStatusUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

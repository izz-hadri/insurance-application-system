import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalStatusComponent } from './medical-status.component';

describe('MedicalStatusComponent', () => {
  let component: MedicalStatusComponent;
  let fixture: ComponentFixture<MedicalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalStatusAddComponent } from './medical-status-add.component';

describe('MedicalStatusAddComponent', () => {
  let component: MedicalStatusAddComponent;
  let fixture: ComponentFixture<MedicalStatusAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalStatusAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalStatusAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

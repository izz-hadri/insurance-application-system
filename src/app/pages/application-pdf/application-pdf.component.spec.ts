import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPdfComponent } from './application-pdf.component';

describe('ApplicationPdfComponent', () => {
  let component: ApplicationPdfComponent;
  let fixture: ComponentFixture<ApplicationPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

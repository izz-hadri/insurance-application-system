import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfLayoutComponent } from './pdf-layout.component';

describe('PdfLayoutComponent', () => {
  let component: PdfLayoutComponent;
  let fixture: ComponentFixture<PdfLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

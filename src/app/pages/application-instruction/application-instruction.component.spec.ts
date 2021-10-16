import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationInstructionComponent } from './application-instruction.component';

describe('ApplicationInstructionComponent', () => {
  let component: ApplicationInstructionComponent;
  let fixture: ComponentFixture<ApplicationInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationInstructionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

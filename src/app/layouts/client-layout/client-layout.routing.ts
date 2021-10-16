import { Routes } from '@angular/router';

import { HomeComponent } from 'src/app/pages/home/home.component';
import { InfoComponent } from 'src/app/pages/info/info.component';
import { ApplicationFormComponent } from '../../pages/application-form/application-form.component';
import { ApplicationInstructionComponent } from '../../pages/application-instruction/application-instruction.component';
import { CalculatorComponent } from '../../pages/calculator/calculator.component';

export const ClientLayoutRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'info', component: InfoComponent },
  { path: 'apply-instruction', component: ApplicationInstructionComponent },
  { path: 'apply-form', component: ApplicationFormComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: '**', redirectTo: 'home' },
];

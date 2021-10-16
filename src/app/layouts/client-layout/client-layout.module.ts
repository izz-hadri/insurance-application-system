import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientLayoutRoutes } from './client-layout.routing';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { InfoComponent } from 'src/app/pages/info/info.component';
import { ApplicationFormComponent } from '../../pages/application-form/application-form.component';
import { ApplicationInstructionComponent } from '../../pages/application-instruction/application-instruction.component';
import { CalculatorComponent } from '../../pages/calculator/calculator.component';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ClientLayoutRoutes),
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,

    // ClipboardModule
  ],
  declarations: [
    HomeComponent,
    InfoComponent,
    ApplicationFormComponent,
    ApplicationInstructionComponent,
    CalculatorComponent,
  ]
})
export class ClientLayoutModule { }

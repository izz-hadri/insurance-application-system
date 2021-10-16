import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MedicalStatusComponent } from '../../pages/medical-status/medical-status.component';
import { MedicalStatusAddComponent } from '../../pages/medical-status-add/medical-status-add.component';
import { MedicalStatusUpdateComponent } from '../../pages/medical-status-update/medical-status-update.component';
import { ApplicantListComponent } from '../../pages/applicant-list/applicant-list.component';
import { ApplicantDetailComponent } from '../../pages/applicant-detail/applicant-detail.component';
import { SettingComponent } from '../../pages/setting/setting.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    MedicalStatusComponent,
    MedicalStatusAddComponent,
    MedicalStatusUpdateComponent,
    ApplicantListComponent,
    ApplicantDetailComponent,
    SettingComponent
  ]
})

export class AdminLayoutModule { }

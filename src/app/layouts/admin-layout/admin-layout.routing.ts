import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MedicalStatusComponent } from 'src/app/pages/medical-status/medical-status.component';
import { MedicalStatusAddComponent } from 'src/app/pages/medical-status-add/medical-status-add.component';
import { MedicalStatusUpdateComponent } from '../../pages/medical-status-update/medical-status-update.component';
import { ApplicantListComponent } from '../../pages/applicant-list/applicant-list.component';
import { ApplicantDetailComponent } from '../../pages/applicant-detail/applicant-detail.component';
import { SettingComponent } from '../../pages/setting/setting.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'medical-status', component: MedicalStatusComponent },
    { path: 'medical-status-add', component: MedicalStatusAddComponent },
    { path: 'medical-status-update/:id', component: MedicalStatusUpdateComponent },
    { path: 'applicant-list', component: ApplicantListComponent },
    { path: 'applicant-detail/:id', component: ApplicantDetailComponent },
    { path: 'setting/details', component: SettingComponent },
    { path: '**', redirectTo: 'dashboard' }
];

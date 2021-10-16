import { Routes } from '@angular/router';
import { ApplicationPdfComponent } from 'src/app/pages/application-pdf/application-pdf.component';

export const PdfLayoutRoutes: Routes = [
  { path: 'applicationPDF/:id', component: ApplicationPdfComponent },
  { path: '**', redirectTo: 'client/home' },
];

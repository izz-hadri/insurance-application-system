import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PdfLayoutRoutes } from './pdf-layout.routing';
import { ApplicationPdfComponent } from 'src/app/pages/application-pdf/application-pdf.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PdfLayoutRoutes),
    HttpClientModule,
    NgbModule,
    // ClipboardModule
  ],
  declarations: [
    ApplicationPdfComponent,
  ]
})
export class PdfLayoutModule { }

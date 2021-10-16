import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { PdfLayoutComponent } from './layouts/pdf-layout/pdf-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'client/home',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  }, {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: 'client',
        loadChildren: () => import('src/app/layouts/client-layout/client-layout.module').then(m => m.ClientLayoutModule)
      }
    ]
  }, {
    path: '',
    component: PdfLayoutComponent,
    children: [
      {
        path: 'pdf',
        loadChildren: () => import('src/app/layouts/pdf-layout/pdf-layout.module').then(m => m.PdfLayoutModule)
      }
    ]
  }, {
    path: '**',
    redirectTo: 'client/home'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(
      routes,
      {
        scrollPositionRestoration: 'enabled',
        useHash: true
      }
    )
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

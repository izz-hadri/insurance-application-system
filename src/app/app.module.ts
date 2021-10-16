import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { PdfLayoutComponent } from './layouts/pdf-layout/pdf-layout.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';

import { FirebaseService } from './services/firebase.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(
      {
        apiKey: "AIzaSyC2rW6daHV4FrByh-bAzM6OsfgErwgBlyY",
        authDomain: "mautakaful.firebaseapp.com",
        databaseURL: "https://mautakaful-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "mautakaful",
        storageBucket: "mautakaful.appspot.com",
        messagingSenderId: "100931829623",
        appId: "1:100931829623:web:636611e09821b1b2b66b72"
      }
    )],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ClientLayoutComponent,
    PdfLayoutComponent,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }

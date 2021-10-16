import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { About } from 'src/app/dtos/responses/about.dto';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  about: About;
  aboutForm: FormGroup;
  isSubmitting = false;
  error = "";
  is_error = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private firebaseServices: FirebaseService
  ) {
    this.aboutForm = this.formBuilder.group({
      address: [null, Validators.required],
      email: [null, Validators.required],
      link1: [null, Validators.required],
      link2: [null, Validators.required],
      link3: [null, Validators.required],
      phone: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    const id = "details";
    if (id) {
      this.firebaseServices.about_getById(id).snapshotChanges()
        .subscribe(res => {
          if ((res.payload.exists())) {
            this.about = res.payload.toJSON() as About;
            this.about.$key = res.key;
          } else {
            this.router.navigate(['admin/dashboard']);
          }
        }, err => {
          console.log(err);
        });
    }
  }

  updateAbout() {
    this.isSubmitting = true;
    const updateAbout = {} as About;
    updateAbout.$key = this.about.$key;
    updateAbout.address = (<HTMLInputElement>document.getElementById("address")).value;
    updateAbout.email = (<HTMLInputElement>document.getElementById("email")).value;
    updateAbout.link1 = (<HTMLInputElement>document.getElementById("link1")).value;
    updateAbout.link2 = (<HTMLInputElement>document.getElementById("link2")).value;
    updateAbout.link3 = (<HTMLInputElement>document.getElementById("link3")).value;
    updateAbout.phone = (<HTMLInputElement>document.getElementById("phone")).value;

    updateAbout.targetApplicantPerMonth = (<HTMLInputElement>document.getElementById("targetApplicantPerMonth")).value;
    updateAbout.targetYearlySale = (<HTMLInputElement>document.getElementById("targetYearlySale")).value;
    updateAbout.targetMonthlySale = (<HTMLInputElement>document.getElementById("targetMonthlySale")).value;


    if (!updateAbout.address) {
      alert("Address cannot be null.");
      return;
    }
    if (!updateAbout.email) {
      alert("Email cannot be null.");
      return;
    }
    if (!updateAbout.link1) {
      alert("Link cannot be null.");
      return;
    }
    if (!updateAbout.link2) {
      alert("Link cannot be null.");
      return;
    }
    if (!updateAbout.link3) {
      alert("Link cannot be null.");
      return;
    }
    if (!updateAbout.phone) {
      alert("Link cannot be null.");
      return;
    }

    if (!updateAbout.targetApplicantPerMonth) {
      alert("Target cannot be null.");
      return;
    }
    if (!updateAbout.targetYearlySale) {
      alert("Target cannot be null.");
      return;
    }
    if (!updateAbout.targetMonthlySale) {
      alert("Target cannot be null.");
      return;
    }

    this.firebaseServices.about_update(updateAbout).then(res => {
      this.isSubmitting = false;
      alert("About has been updated.");
    }), err => {
      this.isSubmitting = false
    };
  }
}

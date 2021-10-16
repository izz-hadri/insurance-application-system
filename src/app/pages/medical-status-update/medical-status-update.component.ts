import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-medical-status-update',
  templateUrl: './medical-status-update.component.html',
  styleUrls: ['./medical-status-update.component.css']
})
export class MedicalStatusUpdateComponent implements OnInit {

  medicalStatus: MedicalStatus;
  medicalStatusForm: FormGroup;
  isSubmitting = false;
  error = "";
  is_error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private firebaseServices: FirebaseService
  ) {
    this.medicalStatusForm = this.formBuilder.group({
      specialisation: [null, Validators.required],
      category: [null, Validators.required],
      status: [null, Validators.required],
      description: [null],

      limit250k: [null],
      limit500k: [null],
      limit1m: [null],
      limit1p5m: [null],
      limit2m: [null],
      limit3m: [null],
      limit5m: [null],
    })
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.firebaseServices.medicalStatus_getById(id).snapshotChanges()
          .subscribe(res => {
            if ((res.payload.exists())) {
              this.medicalStatus = res.payload.toJSON() as MedicalStatus;
              this.medicalStatus.$key = res.key;
            } else {
              this.router.navigate(['admin/medical-status']);
            }
          }, err => {
            console.log(err);
          });
      }
    })
  }

  updateMedicalStatus() {
    this.isSubmitting = true;
    const updateMedicalStatus = {} as MedicalStatus;

    updateMedicalStatus.$key = this.medicalStatus.$key;
    updateMedicalStatus.specialisation = (<HTMLInputElement>document.getElementById("specialisation")).value;
    updateMedicalStatus.description = (<HTMLInputElement>document.getElementById("description")).value;
    updateMedicalStatus.category = (<HTMLInputElement>document.getElementById("category")).value;
    updateMedicalStatus.status = (<HTMLInputElement>document.getElementById("status")).value;

    updateMedicalStatus.limit250k = (<HTMLInputElement>document.getElementById("limit250k")).value;
    updateMedicalStatus.limit500k = (<HTMLInputElement>document.getElementById("limit500k")).value;
    updateMedicalStatus.limit1m = (<HTMLInputElement>document.getElementById("limit1m")).value;
    updateMedicalStatus.limit1p5m = (<HTMLInputElement>document.getElementById("limit1p5m")).value;
    updateMedicalStatus.limit2m = (<HTMLInputElement>document.getElementById("limit2m")).value;
    updateMedicalStatus.limit3m = (<HTMLInputElement>document.getElementById("limit3m")).value;
    updateMedicalStatus.limit5m = (<HTMLInputElement>document.getElementById("limit5m")).value;
    updateMedicalStatus.createdAt = this.medicalStatus.createdAt;

    if (!updateMedicalStatus.description) {
      updateMedicalStatus.description = "";
    }
    if (!updateMedicalStatus.limit250k) {
      updateMedicalStatus.limit250k = "none";
    }
    if (!updateMedicalStatus.limit500k) {
      updateMedicalStatus.limit500k = "none";
    }
    if (!updateMedicalStatus.limit1m) {
      updateMedicalStatus.limit1m = "none";
    }
    if (!updateMedicalStatus.limit1p5m) {
      updateMedicalStatus.limit1p5m = "none";
    }
    if (!updateMedicalStatus.limit2m) {
      updateMedicalStatus.limit2m = "none";
    }
    if (!updateMedicalStatus.limit3m) {
      updateMedicalStatus.limit3m = "none";
    }
    if (!updateMedicalStatus.limit5m) {
      updateMedicalStatus.limit5m = "none";
    }

    this.firebaseServices.medicalStatus_update(updateMedicalStatus).then(res => {
      this.isSubmitting = false;
      alert("Medical Status has been updated.");
      this.router.navigateByUrl('admin/medical-status');
    }), err => {
      this.isSubmitting = false
    };

  }

  gotoList() {
    this.router.navigate(['admin/medical-status']);
  }

}

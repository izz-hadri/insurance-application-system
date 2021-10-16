import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { FirebaseService } from 'src/app/services/firebase.service';
import noUiSlider from "nouislider";

@Component({
  selector: 'app-medical-status-add',
  templateUrl: './medical-status-add.component.html',
  styleUrls: ['./medical-status-add.component.css']
})
export class MedicalStatusAddComponent implements OnInit, AfterViewInit {

  slider;
  is_error = false;
  error = "";
  sliderValue;
  medicalStatus: MedicalStatus;
  isSubmitting = false;
  medicalStatusForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private router: Router,
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
    (<HTMLInputElement>document.getElementById("limit250k")).value = "0";
    (<HTMLInputElement>document.getElementById("limit500k")).value = "0";
    (<HTMLInputElement>document.getElementById("limit1m")).value = "0";
    (<HTMLInputElement>document.getElementById("limit1p5m")).value = "0";
    (<HTMLInputElement>document.getElementById("limit2m")).value = "0";
    (<HTMLInputElement>document.getElementById("limit3m")).value = "0";
    (<HTMLInputElement>document.getElementById("limit5m")).value = "0";
  }

  setTooltips(point) {
    var custom = '';
    if (point == 0) {
      custom = "RM250,000.00";
    }
    else if (point == 1) {
      custom = "RM500,000.00";
    }
    else if (point == 2) {
      custom = "RM1,000,000.00";
    }
    else if (point == 3) {
      custom = "RM1,500,000.00";
    }
    else if (point == 4) {
      custom = "RM2,000,000.00";
    }
    else if (point == 5) {
      custom = "RM3,000,000.00";
    }
    else if (point == 6) {
      custom = "RM5,000,000.00";
    }
    return custom
  }

  ngAfterViewInit() {
    this.slider = document.getElementById('slider');

    noUiSlider.create(this.slider, {
      start: [0, 1],
      connect: true,
      step: 1,
      range: {
        'min': 0,
        'max': 6
      }
    });

    document.getElementById("a").style.display = "none"; // 0
    document.getElementById("b").style.display = "none"; // 1
    document.getElementById("c").style.display = "none"; // 2
    document.getElementById("d").style.display = "none"; // 3
    document.getElementById("e").style.display = "none"; // 4
    document.getElementById("f").style.display = "none"; // 5
    document.getElementById("g").style.display = "none"; // 6

    this.setLimit();
  }

  setLimit() {
    var slide = this.slider.noUiSlider.get().toString();
    console.log(slide);
    slide = slide.split(',');
    var start = parseInt(slide[0]);
    var end = parseInt(slide[1]);
    var rangeList = [];

    for (let i = start; i <= end; i++) {
      rangeList.push(i);
      console.log(i);
    }
    if (rangeList.includes(0)) {
      document.getElementById("a").style.display = "block";
      (<HTMLInputElement>document.getElementById("limit250k")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("limit250k")).value = "0";
      document.getElementById("a").style.display = "none";
    }
    if (rangeList.includes(1)) {
      document.getElementById("b").style.display = "block";
      (<HTMLInputElement>document.getElementById("limit500k")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("limit500k")).value = "0";
      document.getElementById("b").style.display = "none";
    }
    if (rangeList.includes(2)) {
      document.getElementById("c").style.display = "block";
      (<HTMLInputElement>document.getElementById("limit1m")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("limit1m")).value = "0";
      document.getElementById("c").style.display = "none";
    }
    if (rangeList.includes(3)) {
      document.getElementById("d").style.display = "block";
      (<HTMLInputElement>document.getElementById("limit1p5m")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("limit1p5m")).value = "0";
      document.getElementById("d").style.display = "none";
    }
    if (rangeList.includes(4)) {
      document.getElementById("e").style.display = "block";
      (<HTMLInputElement>document.getElementById("limit2m")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("limit2m")).value = "0";
      document.getElementById("e").style.display = "none";
    }
    if (rangeList.includes(5)) {
      document.getElementById("f").style.display = "block";
      (<HTMLInputElement>document.getElementById("limit3m")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("limit3m")).value = "0";
      document.getElementById("f").style.display = "none";
    }
    if (rangeList.includes(6)) {
      document.getElementById("g").style.display = "block";
      (<HTMLInputElement>document.getElementById("limit5m")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("limit5m")).value = "0";
      document.getElementById("g").style.display = "none";
    }

    var customStart = this.setTooltips(start);
    var customEnd = this.setTooltips(end);
    var viewSlider = customStart + ' to ' + customEnd;
    (<HTMLInputElement>document.getElementById("view-slider")).value = viewSlider;
  }

  validateMedicalStatus(newMedicalStatus) {
    var check = "";

    if (!newMedicalStatus.specialisation) {
      return check = "Specialisation is empty.";
    }
    if (!newMedicalStatus.category) {
      return check = "Category is empty.";
    }
    if (!newMedicalStatus.status) {
      return check = "Status is empty.";
    }
    if (!check) {
      return '';
    }
  }

  addMedicalStatus() {
    this.isSubmitting = true;
    const newMedicalStatus = {} as MedicalStatus;

    newMedicalStatus.specialisation = this.medicalStatusForm.value.specialisation;
    newMedicalStatus.description = this.medicalStatusForm.value.description;
    newMedicalStatus.category = (<HTMLInputElement>document.getElementById("category")).value;
    newMedicalStatus.status = (<HTMLInputElement>document.getElementById("status")).value;

    newMedicalStatus.limit250k = this.medicalStatusForm.value.limit250k;
    newMedicalStatus.limit500k = this.medicalStatusForm.value.limit500k;
    newMedicalStatus.limit1m = this.medicalStatusForm.value.limit1m;
    newMedicalStatus.limit1p5m = this.medicalStatusForm.value.limit1p5m;
    newMedicalStatus.limit2m = this.medicalStatusForm.value.limit2m;
    newMedicalStatus.limit3m = this.medicalStatusForm.value.limit3m;
    newMedicalStatus.limit5m = this.medicalStatusForm.value.limit5m;

    if (!newMedicalStatus.description) {
      newMedicalStatus.description = "";
    }
    if (!newMedicalStatus.limit250k) {
      newMedicalStatus.limit250k = "none";
    }
    if (!newMedicalStatus.limit500k) {
      newMedicalStatus.limit500k = "none";
    }
    if (!newMedicalStatus.limit1m) {
      newMedicalStatus.limit1m = "none";
    }
    if (!newMedicalStatus.limit1p5m) {
      newMedicalStatus.limit1p5m = "none";
    }
    if (!newMedicalStatus.limit2m) {
      newMedicalStatus.limit2m = "none";
    }
    if (!newMedicalStatus.limit3m) {
      newMedicalStatus.limit3m = "none";
    }
    if (!newMedicalStatus.limit5m) {
      newMedicalStatus.limit5m = "none";
    }

    this.firebaseService.medicalStatus_create(newMedicalStatus).then(res => {
      alert("Medical Status has been added.")
      this.isSubmitting = false;
      this.router.navigateByUrl('admin/medical-status');
    }).catch(err => {
      debugger;
      console.log(err);
    })
  }

  gotoList() {
    this.router.navigate(['admin/medical-status']);
  }


}
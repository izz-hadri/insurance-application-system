import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Applicant_MedicalStatus } from 'src/app/dtos/responses/applicant-medical-status.dto';
import { Applicant } from 'src/app/dtos/responses/applicant.dto';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-applicant-detail',
  templateUrl: './applicant-detail.component.html',
  styleUrls: ['./applicant-detail.component.css']
})
export class ApplicantDetailComponent implements OnInit, AfterViewInit {

  medicalStatus: MedicalStatus;
  applicant: Applicant;
  applicant_medicalStatusList: Applicant_MedicalStatus[] = [];
  medicalStatusList: MedicalStatus[] = [];

  limit = false;
  period = false;
  ifYes = false;

  applicantForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private firebaseServices: FirebaseService
  ) {
    this.applicantForm = this.formBuilder.group({
      dateFrom: [null],
      dateTo: [null],
      limit1: [null],
      limit2: [null],
      dateRetroactive: [null],
      applicantName: [null],
      applicantIc: [null],
      applicantGender: [null],
      applicantCorrespondenceAddress: [null],
      applicantPrimaryPracticeLocation: [null],
      applicantPhoneNumber: [null],
      applicantEmail: [null],
      applicantLicensing: [null],
      applicantRegistrationNumber: [null],
      dateRegistration: [null],
      dateFirstRegistration: [null],
      history1: [null], // Do you currently hold medical malpractice Takaful? If YES, please provide details.
      history2: [null], // Have you ever had any application for medical malpractice Takaful refused, or had any medical malpractice Takaful coverage rescinded or cancelled? If YES, please provide details on a separate sheet, noting the Section number
      experience1: [null], // Have any claims ever been made, or lawsuits been brought against you?
      experience2: [null], // Are you aware of any errors, omissions, offences, circumstances or allegations which might result in a claim being made against you?
      experience3: [null], // Have you ever been the subject of disciplinary action or investigation by any authority or regulator or professional body?
      experience4: [null], // Have you ever been the subject of a criminal investigation or had criminal charges brought against you? For the purposes of this question, please disregard traffic or minor motor vehicle licensing offences.
      confirm1: [null],
      confirm2: [null],
      submitStatus: [null],
      createdAt: [null],

    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id) {
        //get applicant
        this.firebaseServices.applicant_getById(id).snapshotChanges()
          .subscribe(res => {
            if ((res.payload.exists())) {
              this.applicant = res.payload.toJSON() as Applicant;
              this.applicant.$key = res.key;
              //get bridge
              this.firebaseServices.applicant_medicalStatus_search(res.key).snapshotChanges()
                .subscribe(res2 => {
                  this.applicant_medicalStatusList.length = 0;
                  res2.forEach(t => {
                    const applicant_medicalStatus = t.payload.toJSON();
                    applicant_medicalStatus['$key'] = t.key;
                    this.applicant_medicalStatusList.push(applicant_medicalStatus as Applicant_MedicalStatus);
                  });
                  this.applicant_medicalStatusList.sort((a, b) => a.percentage.localeCompare(b.percentage));
                  console.log("Applicant's Medical Status fetched successfully");
                  //get medical status
                  for (let i = 0; i < this.applicant_medicalStatusList.length; i++) {
                    var k = this.applicant_medicalStatusList[i].medicalStatusId;
                    this.firebaseServices.medicalStatus_getById(k).snapshotChanges()
                      .subscribe(res3 => {
                        if ((res3.payload.exists())) {
                          this.medicalStatus = res3.payload.toJSON() as MedicalStatus;
                          this.medicalStatus.$key = res3.key;
                          this.medicalStatusList.push(this.medicalStatus as MedicalStatus);
                        } else {
                          alert(k + ' not found');
                        }
                      }, err => {
                        console.log(err);
                      });
                  }
                }, err => {
                  debugger;
                  console.log(`An error occurred ${err}`);
                });
            } else {
              this.router.navigate(['client/home']);
            }
          }, err => {
            console.log(err);
          })
      }
    })
  }

  ngAfterViewInit(): void {
    if (this.applicant.limit != "N/A") {
      this.limit = true;
    }
    if (this.applicant.dateFrom != "N/A") {
      this.period = true;
    }
    if (
      this.applicant.history1 == "YES" ||
      this.applicant.history2 == "YES" ||
      this.applicant.experience1 == "YES" ||
      this.applicant.experience2 == "YES" ||
      this.applicant.experience3 == "YES" ||
      this.applicant.experience4 == "YES"
    ) {
      this.ifYes = true;
    }
  }

  getSpecialisation(id) {
    return this.medicalStatusList.find(x => x.$key === id).specialisation;
  }

  pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  toDate(str_date) {
    var date = new Date(str_date);
    var month = this.pad2(date.getMonth() + 1);//months (0-11)
    var day = this.pad2(date.getDate()); //day (1-31)
    var year = date.getFullYear();

    var formattedDate = day + "/" + month + "/" + year;
    return formattedDate
  }

  gotoList() {
    this.router.navigate(['admin/applicant-list']);
  }

  mailto(email) {
    var mailText = "mailto:" + email; // add the links to body
    window.location.href = mailText;
  }

  deleteApplicant(applicant: Applicant) {
    var confirmation = confirm("Are you sure you want to remove the applicant?");
    if (confirmation) {
      // delete bridge
      this.firebaseServices.applicant_getById(applicant.$key).snapshotChanges()
        .subscribe(res => {
          if ((res.payload.exists())) {
            this.applicant = res.payload.toJSON() as Applicant;
            this.applicant.$key = res.key;
            //get bridge
            this.firebaseServices.applicant_medicalStatus_search(res.key).snapshotChanges()
              .subscribe(res2 => {
                res2.forEach(t => {
                  const applicant_medicalStatus = t.payload.toJSON();
                  applicant_medicalStatus['$key'] = t.key;
                  var app_ms = applicant_medicalStatus as Applicant_MedicalStatus;

                  this.firebaseServices.applicant_medicalStatus_deleteById(app_ms.$key).then(res => {
                    console.log("Applicant's medical status has been deleted.");
                  }, err => {
                    console.log(err);
                  });
                });
              }, err => {
                debugger;
                console.log(`An error occurred ${err}`);
              });
          }
        }, err => {
          console.log(err);
        })
      // delete applicant
      this.firebaseServices.applicant_deleteById(applicant.$key).then(res => {
        alert('Applicant has been deleted.');
        this.router.navigate(['admin/applicant-list']);
      }, err => {
        console.log(err);
      });
    }
  }

  updateStatus() {
    const updateApplicant = {} as Applicant;

    var check = confirm("Are you sure want to proceed?");

    if (!check) {
      return;
    }
    updateApplicant.$key = this.applicant.$key;
    updateApplicant.submitStatus = "1";
    updateApplicant.dateFrom = this.applicant.dateFrom;
    updateApplicant.dateTo = this.applicant.dateTo;
    updateApplicant.limit = this.applicant.limit;
    // updateApplicant.limit2 = this.applicant.limit2;
    updateApplicant.dateRetroactive = this.applicant.dateRetroactive;
    updateApplicant.applicantName = this.applicant.applicantName;
    updateApplicant.applicantIc = this.applicant.applicantIc;
    updateApplicant.applicantGender = this.applicant.applicantGender;
    updateApplicant.applicantCorrespondenceAddress = this.applicant.applicantCorrespondenceAddress;
    updateApplicant.applicantPrimaryPracticeLocation = this.applicant.applicantPrimaryPracticeLocation;
    updateApplicant.applicantPhoneNumber = this.applicant.applicantPhoneNumber;
    updateApplicant.applicantEmail = this.applicant.applicantEmail;
    updateApplicant.applicantLicensing = this.applicant.applicantLicensing;
    updateApplicant.applicantRegistrationNumber = this.applicant.applicantRegistrationNumber;
    updateApplicant.dateRegistration = this.applicant.dateRegistration;
    updateApplicant.dateFirstRegistration = this.applicant.dateFirstRegistration;
    updateApplicant.history1 = this.applicant.history1;
    updateApplicant.history2 = this.applicant.history2;
    updateApplicant.experience1 = this.applicant.experience1;
    updateApplicant.experience2 = this.applicant.experience2;
    updateApplicant.experience3 = this.applicant.experience3;
    updateApplicant.experience4 = this.applicant.experience4;
    updateApplicant.confirm1 = this.applicant.confirm1;
    updateApplicant.confirm2 = this.applicant.confirm2;
    updateApplicant.createdAt = this.applicant.createdAt;


    this.firebaseServices.applicant_update(updateApplicant).then(res => {
      this.router.navigateByUrl('admin/applicant-list');
    }), err => {
      console.log(err);
    };
  }

  pdf(id) {
    var random = Math.random().toString(36).slice(-4);
    this.router.navigate(['/pdf/applicationPDF/', id.slice(1) + random]);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Applicant_MedicalStatus } from 'src/app/dtos/responses/applicant-medical-status.dto';
import { Applicant } from 'src/app/dtos/responses/applicant.dto';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { About } from 'src/app/dtos/responses/about.dto';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {

  about: About;
  captchaClicked = false;
  applicantList: Applicant[] = [];
  icList: string[] = [];

  limit = 1;
  tooltipLimit = this.limit + " left";

  medicalStatusList: MedicalStatus[] = [];
  medicalStatusListSelected: MedicalStatus[] = [];
  totalMedicalStatus;

  applicant: Applicant
  applicantForm: FormGroup;

  applicant_MedicalStatus: Applicant_MedicalStatus;
  applicant_MedicalStatusForm: FormGroup;

  closeResult: string;
  errorMsg: string;
  errorStatus = false;

  hist1;
  hist2;
  exp1;
  exp2;
  exp3;
  exp4;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,) {
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
      submitStatus: [null]
    });

    this.applicant_MedicalStatusForm = this.formBuilder.group({
      applicantId: [null],
      medicalStatusId: [null],
      percentage: [null],
      max: [null],
    });
  }

  ngOnInit(): void {
    this.firebaseService.medicalStatus_getAll().snapshotChanges().subscribe(res => {
      this.medicalStatusList.length = 0;
      res.forEach(t => {
        const medicalStatus = t.payload.toJSON();
        medicalStatus['$key'] = t.key;

        var status = medicalStatus['status'];
        if (status == "None") {
          medicalStatus['status'] = "";
        }
        else {
          medicalStatus['status'] = " | " + status;
        }
        this.medicalStatusList.push(medicalStatus as MedicalStatus);
      });

      this.medicalStatusList.sort((a, b) => a.category.localeCompare(b.category));
      console.log('Medical Status successfully fetched');
    }, err => {
      debugger;
      console.log(`An error occurred ${err}`);
    });
    this.totalMedicalStatus = this.medicalStatusList.length;

    this.firebaseService.applicant_getAll().snapshotChanges().subscribe(res => {
      this.applicantList.length = 0;
      res.forEach(t => {
        const applicant = t.payload.toJSON();
        applicant['$key'] = t.key;
        var app = applicant as Applicant;
        this.icList.push(app.applicantIc);
      });
      console.log('About successfully fetched');
    }, err => {
      debugger;
    });

    const id = "details";
    if (id) {
      this.firebaseService.about_getById(id).snapshotChanges()
        .subscribe(res => {
          if ((res.payload.exists())) {
            this.about = res.payload.toJSON() as About;
            this.about.$key = res.key;
          }
        }, err => {
          console.log(err);
        });
    }
  }

  gotoInstruction() {
    this.router.navigate(['client/apply-instruction']);
  }

  gotoWeb() {
    var url = "http://www.takaful-malaysia.com.my/";
    window.open(url, "_blank");
  }

  gotoDocSample(link) {
    window.open(link, "_blank");
  }

  gotoFormSample(link) {
    window.open(link, "_blank");
  }

  open(content, type, modalDimension) {
    if (modalDimension === 'sm' && type === 'modal_mini') {
      this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else if (modalDimension === '' && type === 'Notification') {
      this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    } else {
      this.modalService.open(content, { centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
      }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
      });
    }
  }

  setOneYear() {
    var dateFrom = (<HTMLInputElement>document.getElementById("dateFrom")).value;
    var dateTo = new Date(dateFrom);
    dateTo.setFullYear(dateTo.getFullYear() + 1);

    var year = dateTo.getFullYear();

    var month = (1 + dateTo.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = dateTo.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    var date1Year = day + '/' + month + '/' + year;

    (<HTMLInputElement>document.getElementById("dateTo")).value = date1Year.toString();

  }

  resetDate() {
    (<HTMLInputElement>document.getElementById("dateFrom")).value = null;
    (<HTMLInputElement>document.getElementById("dateTo")).value = null;
  }

  selectMedicalStatus() {
    var id = (<HTMLInputElement>document.getElementById("msList")).value;
    this.medicalStatusListSelected.push(this.medicalStatusList.find(x => x.$key === id));
    this.medicalStatusList = this.medicalStatusList.filter(function (el) { return el.$key != id; });
    (<HTMLInputElement>document.getElementById("msList")).value = '*';
  }

  removeMedicalStatus(id) {
    this.medicalStatusList.push(this.medicalStatusListSelected.find(x => x.$key === id));
    this.medicalStatusListSelected = this.medicalStatusListSelected.filter(function (el) { return el.$key != id; });
    this.medicalStatusList.sort((a, b) => a.category.localeCompare(b.category));
  }

  validateIc(ic) {

    var found = this.icList.includes(ic);

    if (found) {
      return true;
    }
    else {
      return false;
    }
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaClicked = true;
  }

  addApplicant() {
    var response = grecaptcha.getResponse();

    if (response.length == 0) {
      this.errorStatus = true;
      this.errorMsg = "Checked Recaptcha to make sure you are not a robot.";
      return;
    } else {
      this.errorStatus = false;
      this.errorMsg = "";
    }

    const newApplicant = {} as Applicant;

    // Period of Takaful:
    var dateFrom = (<HTMLInputElement>document.getElementById("dateFrom")).value;
    var dateTo = (<HTMLInputElement>document.getElementById("dateTo")).value;

    if (dateFrom.length == 0) {
      dateFrom = "N/A";
      dateTo = "N/A"
    }

    newApplicant.dateFrom = dateFrom;
    newApplicant.dateTo = dateTo;

    // Limit of Liability Required:
    newApplicant.limit = (<HTMLInputElement>document.getElementById("limit")).value;

    // Retroactive Date:
    newApplicant.dateRetroactive = (<HTMLInputElement>document.getElementById("dateRetroactive")).value.toUpperCase();

    // 1. Details of Applicant
    newApplicant.applicantName = (<HTMLInputElement>document.getElementById("applicantName")).value.toUpperCase();
    newApplicant.applicantIc = (<HTMLInputElement>document.getElementById("applicantIc")).value.toUpperCase();
    var found = this.validateIc(newApplicant.applicantIc);

    if (found) {
      this.errorStatus = true;
      this.errorMsg = "IC already exist.";
      return;
    } else {
      this.errorStatus = false;
      this.errorMsg = "";
    }

    newApplicant.applicantGender = (<HTMLInputElement>document.getElementById("applicantGender")).value.toUpperCase();
    newApplicant.applicantCorrespondenceAddress = (<HTMLInputElement>document.getElementById("applicantCorrespondenceAddress")).value.toUpperCase();
    newApplicant.applicantPrimaryPracticeLocation = (<HTMLInputElement>document.getElementById("applicantPrimaryPracticeLocation")).value.toUpperCase();
    newApplicant.applicantPhoneNumber = (<HTMLInputElement>document.getElementById("applicantPhoneNumber")).value.toUpperCase();
    newApplicant.applicantEmail = (<HTMLInputElement>document.getElementById("applicantEmail")).value;

    // Registration Details
    newApplicant.applicantLicensing = (<HTMLInputElement>document.getElementById("applicantLicensing")).value.toUpperCase();
    newApplicant.applicantRegistrationNumber = (<HTMLInputElement>document.getElementById("applicantRegistrationNumber")).value.toUpperCase();
    newApplicant.dateRegistration = (<HTMLInputElement>document.getElementById("dateRegistration")).value.toUpperCase();
    newApplicant.dateFirstRegistration = (<HTMLInputElement>document.getElementById("dateFirstRegistration")).value.toUpperCase();

    // 3. Takaful History
    newApplicant.history1 = this.hist1.toUpperCase();
    newApplicant.history2 = this.hist2.toUpperCase();


    // 4. Claims Experience
    newApplicant.experience1 = this.exp1.toUpperCase();
    newApplicant.experience2 = this.exp2.toUpperCase();
    newApplicant.experience3 = this.exp3.toUpperCase();
    newApplicant.experience4 = this.exp4.toUpperCase();


    // 2. Details of Healthcare Services Business
    if (this.medicalStatusListSelected.length == 0) {
      this.errorStatus = true;
      this.errorMsg = "Please add Healthcare Services Business at least 1.";
      return;
    } else {
      this.errorStatus = false;
      this.errorMsg = "";
    }

    var totalPercentage = 0;
    var medicalStatusSelected = [];

    for (let i = 0; i < this.medicalStatusListSelected.length; i++) {
      var key = this.medicalStatusListSelected[i].$key;
      var percentage = (<HTMLInputElement>document.getElementById("ms_" + i)).value;
      totalPercentage = totalPercentage + parseInt(percentage);

      if (totalPercentage > 100) {
        this.errorStatus = true;
        this.errorMsg = "Total percentage on details of healthcare services business cannot exceed 100%";
        return;
      } else {
        this.errorStatus = false;
        this.errorMsg = "";
      }

      medicalStatusSelected[i] = [key, percentage];
    }

    // Declaration
    if ((<HTMLInputElement>document.getElementById("confirm1")).checked) {
      newApplicant.confirm1 = "YES";
      this.errorStatus = false;
      this.errorMsg = "";
    } else {
      this.errorStatus = true;
      this.errorMsg = "All declaration need to be checked before submit the form.";
      return;
    }

    if ((<HTMLInputElement>document.getElementById("confirm2")).checked) {
      newApplicant.confirm2 = "YES";
      this.errorStatus = false;
      this.errorMsg = "";
    } else {
      this.errorStatus = true;
      this.errorMsg = "All declaration need to be checked before submit the form.";
      return;
    }

    if ((<HTMLInputElement>document.getElementById("confirm1")).checked == false || (<HTMLInputElement>document.getElementById("confirm2")).checked == false) {
      this.errorStatus = true;
      this.errorMsg = "Please checked the declaration section to proceed.";
      return;
    } else {
      this.errorStatus = false;
      this.errorMsg = "";
    }

    newApplicant.submitStatus = "0";

    // ---------------- OKAY ----------------

    var confirmation = confirm("Are you sure want to submit? All data cannot be changed after the submission.");

    if (confirmation == false) {
      return;
    }

    var addedKey = '';

    this.firebaseService.applicant_create(newApplicant)
      .then(res => {
        console.log("Applicant has been added.");
        addedKey = res.key;

        // add medical status percent
        var len = Object.keys(medicalStatusSelected).length;
        var percentList = [];

        for (let i = 0; i < len; i++) {
          percentList.push(medicalStatusSelected[i][1]);
        }

        var maxPercent = Math.max(...percentList);
        var once = false;

        for (let i = 0; i < len; i++) {
          const newApplicantMedicalStatus = {} as Applicant_MedicalStatus;
          newApplicantMedicalStatus.applicantId = addedKey;
          newApplicantMedicalStatus.medicalStatusId = medicalStatusSelected[i][0];
          newApplicantMedicalStatus.percentage = medicalStatusSelected[i][1];

          if (medicalStatusSelected[i][1] == maxPercent && once == false) {
            once = true;
            newApplicantMedicalStatus.max = "1";
          } else {
            newApplicantMedicalStatus.max = "0";
          }

          this.firebaseService.applicant_medicalStatus_create(newApplicantMedicalStatus)
            .then(res => {
              console.log("Applicant's Medical Status has been added.");
            })
            .catch(err => {
              debugger;
              console.log(err);
            });
        }
        var random = Math.random().toString(36).slice(-4);
        this.router.navigate(['/pdf/applicationPDF/', res.key.slice(1) + random]);
      }).catch(err => {
        debugger;
        console.log(err);
      });
  }

  setPOF_LOL(value) {

    if (value == "1") {
      (<HTMLInputElement>document.getElementById("dateFrom")).disabled = false;

      (<HTMLInputElement>document.getElementById("check1")).disabled = true;
      (<HTMLInputElement>document.getElementById("check2")).disabled = true;
      (<HTMLInputElement>document.getElementById("check3")).disabled = true;
      (<HTMLInputElement>document.getElementById("check4")).disabled = true;
      (<HTMLInputElement>document.getElementById("check5")).disabled = true;
      (<HTMLInputElement>document.getElementById("check6")).disabled = true;
      (<HTMLInputElement>document.getElementById("check7")).disabled = true;

      (<HTMLInputElement>document.getElementById("check1")).checked = false;
      (<HTMLInputElement>document.getElementById("check2")).checked = false;
      (<HTMLInputElement>document.getElementById("check3")).checked = false;
      (<HTMLInputElement>document.getElementById("check4")).checked = false;
      (<HTMLInputElement>document.getElementById("check5")).checked = false;
      (<HTMLInputElement>document.getElementById("check6")).checked = false;
      (<HTMLInputElement>document.getElementById("check7")).checked = false;

      this.tooltipLimit = "1 left";

    } else if (value == "2") {
      (<HTMLInputElement>document.getElementById("dateFrom")).disabled = true;

      (<HTMLInputElement>document.getElementById("check1")).disabled = false;
      (<HTMLInputElement>document.getElementById("check2")).disabled = false;
      (<HTMLInputElement>document.getElementById("check3")).disabled = false;
      (<HTMLInputElement>document.getElementById("check4")).disabled = false;
      (<HTMLInputElement>document.getElementById("check5")).disabled = false;
      (<HTMLInputElement>document.getElementById("check6")).disabled = false;
      (<HTMLInputElement>document.getElementById("check7")).disabled = false;

      (<HTMLInputElement>document.getElementById("dateFrom")).value = null;
      (<HTMLInputElement>document.getElementById("dateTo")).value = null;

    }
  }

  getHistory1(value) {
    this.hist1 = value;
  }
  getHistory2(value) {
    this.hist2 = value;
  }
  getExperience1(value) {
    this.exp1 = value;
  }
  getExperience2(value) {
    this.exp2 = value;
  }
  getExperience3(value) {
    this.exp3 = value;
  }
  getExperience4(value) {
    this.exp4 = value;
  }

  gotoCalculator() {
    this.router.navigate(['client/calculator']);
  }

  mailto() {
    var mailText = "mailto:" + this.about.email; // add the links to body
    window.location.href = mailText;
  }
}

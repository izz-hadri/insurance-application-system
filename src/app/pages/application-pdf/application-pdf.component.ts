import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Applicant_MedicalStatus } from 'src/app/dtos/responses/applicant-medical-status.dto';
import { Applicant } from 'src/app/dtos/responses/applicant.dto';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { About } from 'src/app/dtos/responses/about.dto';

@Component({
  selector: 'app-application-pdf',
  templateUrl: './application-pdf.component.html',
  styleUrls: ['./application-pdf.component.css']
})
export class ApplicationPdfComponent implements OnInit, AfterViewInit {

  medicalStatus: MedicalStatus;
  applicant: Applicant;
  applicant_medicalStatusList: Applicant_MedicalStatus[] = [];
  medicalStatusList: MedicalStatus[] = [];


  limit = false;
  period = false;
  ifYes = false;

  about: About;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseServices: FirebaseService
  ) { }

  ngOnInit(): void {
    const id = "details";
    if (id) {
      this.firebaseServices.about_getById(id).snapshotChanges()
        .subscribe(res => {
          if ((res.payload.exists())) {
            this.about = res.payload.toJSON() as About;
            this.about.$key = res.key;
          }
        }, err => {
          console.log(err);
        });
    }
    this.route.params.subscribe(params => {
      var id = params.id;
      id = "-" + id.slice(0, -4);
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
    });
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('user') == null) {
      alert('Please print the document after you have downloaded it by clicking the download button. Before emailing to ' + this.about.email + ', make sure the signature and stamp are included.');
    }
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
    // window.print();
  }

  getSpecialisation(id) {
    return this.medicalStatusList.find(x => x.$key === id).specialisation;
  }

  getCategory(id) {
    return this.medicalStatusList.find(x => x.$key === id).category.split("|")[1];
  }

  getStatus(id) {
    return this.medicalStatusList.find(x => x.$key === id).status;
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
    return formattedDate;
  }

  mailto() {
    var mailText = "mailto:" + this.about.email; // add the links to body
    window.location.href = mailText;
  }

}

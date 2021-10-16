import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Applicant } from 'src/app/dtos/responses/applicant.dto';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Applicant_MedicalStatus } from 'src/app/dtos/responses/applicant-medical-status.dto';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.css']
})
export class ApplicantListComponent implements OnInit {

  applicantList: Applicant[] = [];
  applicant: Applicant;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.firebaseService.applicant_getAll().snapshotChanges().subscribe(res => {
      this.applicantList.length = 0;
      res.forEach(t => {
        const applicant = t.payload.toJSON();
        applicant['$key'] = t.key;
        this.applicantList.unshift(applicant as Applicant);
      });
      this.applicantList.sort((a, b) => a.submitStatus.localeCompare(b.submitStatus));

      console.log('Applicant fetched successfully');
    }, err => {
      debugger;
      console.log(`An error occurred ${err}`);
    });
  }

  deleteApplicant(applicant: Applicant) {
    var confirmation = confirm("Are you sure you want to remove the applicant?");
    if (confirmation) {
      // delete bridge
      this.firebaseService.applicant_getById(applicant.$key).snapshotChanges()
        .subscribe(res => {
          if ((res.payload.exists())) {
            this.applicant = res.payload.toJSON() as Applicant;
            this.applicant.$key = res.key;
            //get bridge
            this.firebaseService.applicant_medicalStatus_search(res.key).snapshotChanges()
              .subscribe(res2 => {
                res2.forEach(t => {
                  const applicant_medicalStatus = t.payload.toJSON();
                  applicant_medicalStatus['$key'] = t.key;
                  var app_ms = applicant_medicalStatus as Applicant_MedicalStatus;

                  this.firebaseService.applicant_medicalStatus_deleteById(app_ms.$key).then(res => {
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
      this.firebaseService.applicant_deleteById(applicant.$key).then(res => {
        this.applicantList = this.applicantList.filter(t => t.$key !== applicant.$key);
        console.log('Applicant has been deleted.');
      }, err => {
        console.log(err);
      });
    }
  }

  mailto(email) {
    var mailText = "mailto:" + email; // add the links to body
    window.location.href = mailText;
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  gotoDetail(applicant) {
    if (localStorage.getItem('user') == null) {
      console.log("Please sign in first.");
      this.router.navigate(['auth/signin']);
      return;
    }
    this.router.navigate(['/admin/applicant-detail/', applicant.$key]);
  }

  searchAny() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (j = 0; j < td.length; j++) {
        if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
          found = true;
        }
      }
      if (found) {
        tr[i].style.display = "";
        found = false;
      } else {
        tr[i].style.display = "none";
      }
      if (tr[i].id == 'tableHeader') { tr[i].style.display = ""; }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Applicant_MedicalStatus } from 'src/app/dtos/responses/applicant-medical-status.dto';

@Component({
  selector: 'app-medical-status',
  templateUrl: './medical-status.component.html',
  styleUrls: ['./medical-status.component.css']
})
export class MedicalStatusComponent implements OnInit {

  medicalStatusList: MedicalStatus[] = [];
  medicalStatus: MedicalStatus;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.firebaseService.medicalStatus_getAll().snapshotChanges().subscribe(res => {
      this.medicalStatusList.length = 0;
      res.forEach(t => {
        const medicalStatus = t.payload.toJSON();
        medicalStatus['$key'] = t.key;
        this.medicalStatusList.push(medicalStatus as MedicalStatus);
      });
      this.medicalStatusList.sort((a, b) => a.category.localeCompare(b.category));
      console.log('Medical Status fetched successfully');
    }, err => {
      debugger;
      console.log(`An error occurred ${err}`);
    });
  }

  deleteMedicalStatus(medicalStatus: MedicalStatus) {
    if (localStorage.getItem('user') == null) {
      console.log("Please sign in first.");
      this.router.navigate(['auth/signin']);
      return;
    }
    var confirmation = confirm("Are you sure you want to delete " + medicalStatus.specialisation + "? It may effect client's application that already been applied.");
    if (confirmation) {
      // delete bridge
      this.firebaseService.medicalStatus_getById(medicalStatus.$key).snapshotChanges()
        .subscribe(res => {
          if ((res.payload.exists())) {
            this.medicalStatus = res.payload.toJSON() as MedicalStatus;
            this.medicalStatus.$key = res.key;
            //get bridge
            this.firebaseService.applicant_medicalStatus_searchMS(res.key).snapshotChanges()
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
      this.firebaseService.medicalStatus_deleteById(medicalStatus.$key).then(res => {
        this.medicalStatusList = this.medicalStatusList.filter(t => t.$key !== medicalStatus.$key);
        console.log('Medical Status has been deleted.');
      }, err => {
        console.log(err);
      });
    }
  }

  gotoAdd() {
    this.router.navigate(['admin/medical-status-add']);
  }

  gotoUpdate(ms) {
    if (localStorage.getItem('user') == null) {
      console.log("Please sign in first.");
      this.router.navigate(['auth/signin']);
      return;
    }
    this.router.navigate(['/admin/medical-status-update/', ms.$key]);
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

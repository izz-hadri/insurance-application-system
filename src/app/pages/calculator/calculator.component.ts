import { Component, OnInit } from '@angular/core';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  medicalStatusList: MedicalStatus[] = [];
  medicalStatusByCategory: MedicalStatus[] = [];

  constructor(private firebaseService: FirebaseService) { }

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

  addMedicalStatusByCategory(category) {
    (<HTMLInputElement>document.getElementById("specialisation")).value = '*';
    this.medicalStatusByCategory.splice(0, this.medicalStatusByCategory.length);

    for (let i = 0; i < this.medicalStatusList.length; i++) {
      if (category === this.medicalStatusList[i].category) {

        var status = this.medicalStatusList[i].status;
        status = status.replace("|", "").trim();

        if (status == "None" || status == "") {
          this.medicalStatusList[i].status = "";
        }
        else {
          this.medicalStatusList[i].status = "";
          this.medicalStatusList[i].status = " | " + status;
        }
        this.medicalStatusByCategory.push(this.medicalStatusList[i] as MedicalStatus);
      }
    }
    this.medicalStatusByCategory.sort((a, b) => a.specialisation.localeCompare(b.specialisation));
  }

  chooseCategory() {
    var category = (<HTMLInputElement>document.getElementById("category")).value;
    if (category == "1") {
      this.addMedicalStatusByCategory("Section 1 | Non-Medical Practitioners");
    }
    else if (category == "2") {
      this.addMedicalStatusByCategory("Section 2 | Medical Practitioners");
    }
    else if (category == "s1") {
      this.addMedicalStatusByCategory("Specialty - Category 1 | Low Risk");
    }
    else if (category == "s2") {
      this.addMedicalStatusByCategory("Specialty - Category 2 | Medium Risk");
    }
    else if (category == "s3") {
      this.addMedicalStatusByCategory("Specialty - Category 3 | High Risk");
    }

    if (this.addMedicalStatusByCategory.length != 0) {
      (<HTMLInputElement>document.getElementById("specialisation")).disabled = false;
    } else {
      (<HTMLInputElement>document.getElementById("specialisation")).disabled = true;
    }
  }

  checkPrice() {
    var category = (<HTMLInputElement>document.getElementById("category")).value;
    var specialisation = (<HTMLInputElement>document.getElementById("specialisation")).value;
    var lol = (<HTMLInputElement>document.getElementById("lol")).value;

    if (category == "*") {
      return alert("Ensure that all input has been inserted.");
    }
    if (specialisation == "*") {
      return alert("Ensure that all input has been inserted.");
    }
    if (lol == "*") {
      return alert("Ensure that all input has been inserted.");
    }

    var ms = this.medicalStatusByCategory.find(x => x.$key === specialisation);
    var price = "N/A";
    var priceAfter;
    var priceAfterStr = "N/A";

    if (lol == "250000") {
      price = ms.limit250k;
    }
    else if (lol == "500000") {
      price = ms.limit500k;
    }
    else if (lol == "1000000") {
      price = ms.limit1m;
    }
    else if (lol == "1500000") {
      price = ms.limit1p5m;
    }
    else if (lol == "2000000") {
      price = ms.limit2m;
    }
    else if (lol == "3000000") {
      price = ms.limit3m;
    }
    else if (lol == "5000000") {
      price = ms.limit5m;
    }

    if (price == "none") {
      price = "N/A";
      priceAfterStr = "N/A";
    } else {
      priceAfter = parseInt(price);
      priceAfter = priceAfter + (priceAfter * 0.06) + 10;

      price = "RM" + price;
      priceAfterStr = "RM" + priceAfter.toString();
    }

    (<HTMLInputElement>document.getElementById("price")).innerHTML = price;
    (<HTMLInputElement>document.getElementById("priceAfter")).innerHTML = priceAfterStr;

  }
}

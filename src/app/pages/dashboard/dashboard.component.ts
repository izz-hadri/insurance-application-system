import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import { Applicant_MedicalStatus } from 'src/app/dtos/responses/applicant-medical-status.dto';
import { Applicant } from 'src/app/dtos/responses/applicant.dto';
import { MedicalStatus } from 'src/app/dtos/responses/medical-status.dto';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';


// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
} from "../../variables/charts";
import { About } from 'src/app/dtos/responses/about.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  closeResult: string;
  about: About;

  medicalStatusList: MedicalStatus[] = [];
  applicantList: Applicant[] = [];

  listAppMs: Applicant_MedicalStatus[] = [];
  favMs: MedicalStatus;

  totalMedicalStatus = 0;
  totalApplicant = 0;
  totalFav = 0;
  totalSubmit = 0;
  totalSales = 0;

  totalSubmitMontly = 0;
  totalYearlySale = 0;
  totalMonthlySale = 0;

  totalNone = 0;
  totalPrivate = 0;
  totalGov = 0;

  joinList = {};

  ms5: MedicalStatus[] = [];
  app5: Applicant[] = [];

  empty = false;

  public datasets: any;
  public data: any;
  public salesChart;
  public pieChart;

  constructor(
    private firebaseService: FirebaseService, private router: Router, private modalService: NgbModal) { }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    // Firebase
    // About
    var currentWeekRangeList = [];
    var currentWeekList = [0, 0, 0, 0, 0, 0, 0];
    for (let iii = 1; iii <= 7; iii++) {
      const t = new Date();
      const before_today = new Date(t);
      if (iii == 7) {
        before_today.setDate(before_today.getDate());
      } else {
        before_today.setDate(before_today.getDate() - iii);
      }
      currentWeekRangeList.push(before_today.toLocaleDateString('en-US').toString());
    }

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

    // Medical Status

    var i = 0;

    var msObjList: MedicalStatus[] = [];
    this.firebaseService.medicalStatus_getAll().snapshotChanges().subscribe(res => {
      this.medicalStatusList.length = 0;
      this.totalMedicalStatus = 0;
      res.forEach(t => {
        const medicalStatus = t.payload.toJSON();
        medicalStatus['$key'] = t.key;
        this.medicalStatusList.push(medicalStatus as MedicalStatus);
        msObjList.push(medicalStatus as MedicalStatus);
        this.totalMedicalStatus++;
      });
      this.ms5 = this.medicalStatusList.slice(Math.max(this.medicalStatusList.length - 5, 0));
      this.ms5.reverse();
      console.log('Medical Status fetched successfully');
    }, err => {
      debugger;
      console.log(`An error occurred ${err}`);
    });

    // Applicant
    this.firebaseService.applicant_getAll().snapshotChanges().subscribe(res => {
      this.applicantList.length = 0;
      this.totalApplicant = 0;
      this.totalSubmit = 0;

      res.forEach(t => {
        const applicant = t.payload.toJSON();
        applicant['$key'] = t.key;
        this.applicantList.push(applicant as Applicant);
        this.totalApplicant++;
        if (this.applicantList.length != 0) {
          if (this.applicantList[this.applicantList.length - 1].submitStatus == "1") {
            this.totalSubmit++;
          }
          // count applied in week

          var appl = applicant as Applicant;
          var created = appl.createdAt.split(" ")[1];
          var initial = created.split(/\//);
          var created2 = [initial[1], initial[0], initial[2]].join('/');
          var dateWeek = new Date(created2);

          if (currentWeekRangeList.includes(dateWeek.toLocaleDateString('en-US').toString())) {
            var day = dateWeek.getDay();
            currentWeekList[day] = currentWeekList[day] + 1;
          }
        }
      });
      this.app5 = this.applicantList.slice(Math.max(this.applicantList.length - 5, 0));
      this.app5.reverse();
      console.log('Applicant fetched successfully');
    }, err => {
      debugger;
      console.log(`An error occurred ${err}`);
    });

    // Applicant's Medical Status
    var favMsList = [];

    this.firebaseService.applicant_medicalStatus_getAll().snapshotChanges().subscribe(res => {
      this.listAppMs.length = 0;
      res.forEach(t => {
        const appMs = t.payload.toJSON();
        appMs['$key'] = t.key;
        var bridge = appMs as Applicant_MedicalStatus;
        this.listAppMs.push(bridge);

        if (bridge) {
          favMsList.push(bridge.medicalStatusId);

          this.joinList[i] = {
            applicant: this.applicantList.find(x => x.$key === this.listAppMs[this.listAppMs.length - 1].applicantId),
            bridge: appMs as Applicant_MedicalStatus,
            medicalStatus: this.medicalStatusList.find(x => x.$key === this.listAppMs[this.listAppMs.length - 1].medicalStatusId)
          };
          i++;
        }
      });

      // Find Favorite Medical Status
      if (favMsList.length == 0) {
        this.empty = true;
      }

      this.totalFav = 0;
      var maxId = favMsList.sort((a, b) => favMsList.filter(v => v === a).length - favMsList.filter(v => v === b).length)[favMsList.length - 1];
      const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

      this.totalFav = countOccurrences(favMsList, maxId);

      if (this.totalFav < 2) {
        this.empty = true;
      }

      this.favMs = msObjList.find(x => x.$key === maxId);
      console.log('Applicant Medical Status fetched successfully');
      this.totalSales = 0;


      // FIND LIST DAY OF CURRENT WEEK
      let curr = new Date;
      let week = [];

      for (let ii = 1; ii <= 7; ii++) {
        let first = curr.getDate() - curr.getDay() + ii;
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
        day = formatDate(new Date(day), 'dd/MM/yyyy', 'en-US');
        week.push(day);
      }

      for (let j = 0; j < i; j++) {
        var sales = 0;
        var limit = 0;
        var lim = "";

        if (this.joinList[j].applicant.submitStatus == "1") {

          // TOTAL SALES

          if (this.joinList[j].bridge.max == "0") {
            continue;
          }

          if (this.joinList[j].applicant.limit == "250000") {
            lim = this.joinList[j].medicalStatus.limit250k.toString();
            lim = lim.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
            limit = parseFloat(lim);
          }
          else if (this.joinList[j].applicant.limit == "500000") {
            lim = this.joinList[j].medicalStatus.limit500k.toString();
            lim = lim.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
            limit = parseFloat(lim);
          }
          else if (this.joinList[j].applicant.limit == "1000000") {
            lim = this.joinList[j].medicalStatus.limit1m.toString();
            lim = lim.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
            limit = parseFloat(lim);
          }
          else if (this.joinList[j].applicant.limit == "1500000") {
            lim = this.joinList[j].medicalStatus.limit1p5m.toString();
            lim = lim.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
            limit = parseFloat(lim);
          }
          else if (this.joinList[j].applicant.limit == "2000000") {
            lim = this.joinList[j].medicalStatus.limit2m.toString();
            lim = lim.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
            limit = parseFloat(lim);
          }
          else if (this.joinList[j].applicant.limit == "3000000") {
            lim = this.joinList[j].medicalStatus.limit3m.toString();
            lim = lim.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
            limit = parseFloat(lim);
          }
          else if (this.joinList[j].applicant.limit == "5000000") {
            lim = this.joinList[j].medicalStatus.limit5m.toString();
            lim = lim.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').trim();
            limit = parseFloat(lim);
          }
          if (!isNaN(limit)) {
            sales = limit + (limit * 0.06) + 10;
            this.totalSales = this.totalSales + sales;

            var date = this.joinList[j].applicant.createdAt;
            var applicationDate = date.split(" ")[1];
            var now = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');

            // MONTHLY SALE


            if (week.includes(applicationDate)) {
              this.totalSubmitMontly++;
              this.totalMonthlySale = this.totalMonthlySale + sales;
            }

            // YEARLY SALE
            if (applicationDate.slice(-4) == now.slice(-4)) {
              this.totalYearlySale = this.totalYearlySale + sales;
            }

          }

          // TOTAL STATUS

          if (this.joinList[j].medicalStatus.status == "None") {
            this.totalNone++;
          }
          else if (this.joinList[j].medicalStatus.status == "Private") {
            this.totalPrivate++;
          }
          else if (this.joinList[j].medicalStatus.status == "Government with Locum / Semiretired") {
            this.totalGov++;
          }
        }
      }

      // CHART

      var dd = new Date();
      var today = dd.getDay();
      var days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
      var a = days.slice(today + 1, 7);
      var b = days.slice(0, today + 1);
      var dayList = a.concat(b);

      var c = currentWeekList.slice(today + 1, 7);
      var d = currentWeekList.slice(0, today + 1);
      var dayListCount = c.concat(d);

      parseOptions(Chart, chartOptions());

      var chartSales = document.getElementById('chart-sales');

      this.salesChart = new Chart(chartSales, {
        type: 'line',
        options: {
          scales: {
            yAxes: [{
              gridLines: {
                color: '#212529',
                zeroLineColor: '#212529',
                drawOnChartArea: false
              },
              ticks: {
                callback: function (value) {
                  if (!(value % 10)) {
                    return value;
                  }
                }
              }
            }]
          }
        },
        data: {
          labels: dayList,
          datasets: [{
            label: 'total applied per day',
            data: dayListCount
          }]
        }
      });


      // PIE CHART

      var chartPie = document.getElementById('chart-pie');

      this.pieChart = new Chart(chartPie, {
        type: 'pie',
        data: {
          labels: ['None', 'Private', 'Government'],
          datasets: [{
            data: [this.totalNone, this.totalPrivate, this.totalGov],
            backgroundColor: ["#f5365c", "#11cdef", "#fb6340"],
          }]
        }
      });

    }, err => {
      debugger;
      console.log(`An error occurred ${err}`);
    });
  }

  mailto(email) {
    var mailText = "mailto:" + email; // add the links to body
    window.location.href = mailText;
  }

  gotoDetail(applicant) {
    if (localStorage.getItem('user') == null) {
      console.log("Please sign in first.");
      this.router.navigate(['auth/signin']);
      return;
    }
    this.router.navigate(['/admin/applicant-detail/', applicant.$key]);
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

  goto(go) {
    if (go == "1") {
      this.router.navigate(['admin/medical-status']);
    }
    else if (go == "2") {
      this.router.navigate(['admin/applicant-list']);
    }
  }

  findMonthlyTargetCurrent(submitted, monthlyTarget) {
    var targetCurrent = parseInt(submitted) / parseInt(monthlyTarget) * 100;
    return targetCurrent.toString() + "%"
  }

  compare1() {
    if (this.totalSubmitMontly >= parseInt(this.about.targetApplicantPerMonth)) {
      return true;
    }
    else {
      return false;
    }
  }

  compare2() {
    if (this.totalMonthlySale >= parseInt(this.about.targetMonthlySale)) {
      return true;
    }
    else {
      return false;
    }
  }

  compare3() {
    if (this.totalYearlySale >= parseInt(this.about.targetYearlySale)) {
      return true;
    }
    else {
      return false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pdf-layout',
  templateUrl: './pdf-layout.component.html',
  styleUrls: ['./pdf-layout.component.css']
})
export class PdfLayoutComponent implements OnInit {
  public isCollapsed = true;
  isAdmin = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.isAdmin = true;
    }
  }
  goto(go) {
    if (go == 1) {
      this.router.navigate(['client/home']);
    } else if (go == 2) {
      this.router.navigate(['client/calculator']);
    } else if (go == 3) {
      this.router.navigate(['client/apply-instruction']);
    } else if (go == 4) {
      this.router.navigate(['client/info']);
    } else if (go == 5) {
      this.router.navigate(['auth/signin']);
    }
  }
  printPdf() {
    window.print();
  }
  gotoAdmin() {
    var current = window.location.href;
    var currentSplit = current.split('/');
    current = currentSplit[currentSplit.length - 1];
    current = "-" + current.slice(0, -4);
    this.router.navigate(['/admin/applicant-detail/', current]);
  }
}

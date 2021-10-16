import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

  }
  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
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
}

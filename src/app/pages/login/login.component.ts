import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isErr = false;
  error_msg = "";
  constructor(public firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
    // if (localStorage.getItem('user') !== null){}
    // this.router.navigate(['admin/dashboard']);
  }
  ngOnDestroy() {
  }

  async onSignin(email: string, password: string) {
    if (email.length == 0 || password.length == 0) {
      this.isErr = true;
      this.error_msg = "Email or Password cannot be empty.";
      return;
    }
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (email != "" && (email.length <= 5 || !EMAIL_REGEXP.test(email))) {
      this.isErr = true;
      this.error_msg = "Please provide a valid email";
      return;
    }
    try {
      await this.firebaseService.signin(email, password)
    } catch (error) {
      this.isErr = true;
      this.error_msg = "Invalid email or password.";
    }
    if (this.firebaseService.isLoggedIn) {
      console.log('LOGGED IN!')
      this.isErr = false;
      this.router.navigate(['admin/dashboard']);
    }
  }
}

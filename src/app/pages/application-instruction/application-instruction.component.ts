import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-instruction',
  templateUrl: './application-instruction.component.html',
  styleUrls: ['./application-instruction.component.css']
})
export class ApplicationInstructionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoApplyForm() {
    this.router.navigate(['client/apply-form']);
  }
}

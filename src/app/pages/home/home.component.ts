import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'src/app/services/firebase.service';
import { About } from 'src/app/dtos/responses/about.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  closeResult: string;
  about: About;

  constructor(private modalService: NgbModal, private router: Router, private firebaseServices: FirebaseService
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

  gotoWeb() {
    var url = "http://www.takaful-malaysia.com.my/";
    window.open(url, "_blank");
  }

  gotoFb(link) {
    window.open(link, "_blank");
  }

  mailto() {
    var mailText = "mailto:" + this.about.email; // add the links to body
    window.location.href = mailText;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: $reason';
    }
  }

  ngOnDestroy() {

  }

  gotoCalculator() {
    this.router.navigate(['client/calculator']);
  }
}

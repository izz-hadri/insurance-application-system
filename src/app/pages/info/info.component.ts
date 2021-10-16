import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnDestroy {

  constructor() { }

  mailto() {
    var mailText = "mailto:csu@takaful-malaysia.com.my"; // add the links to body
    window.location.href = mailText;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: 'admin/dashboard', title: 'Dashboard', icon: 'card-lift--hover ni-tv-2 text-primary', class: '' },
  { path: 'admin/medical-status-add', title: 'Add Medical Status', icon: 'card-lift--hover ni-fat-add text-warning', class: '' },
  { path: 'admin/medical-status', title: 'Medical Status List', icon: 'card-lift--hover ni-ambulance text-success', class: '' },
  { path: 'admin/applicant-list', title: 'Applicant List', icon: 'card-lift--hover fas fa-list text-yellow', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router, public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  handleSignout() {
    this.firebaseService.signout();
    this.router.navigate(['auth/signin']);
  }
  gotoSetting() {
    this.router.navigate(['admin/setting/details']);
  }
}

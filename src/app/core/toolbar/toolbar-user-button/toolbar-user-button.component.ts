import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../main/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fury-toolbar-user-button',
  templateUrl: './toolbar-user-button.component.html',
  styleUrls: ['./toolbar-user-button.component.scss']
})
export class ToolbarUserButtonComponent implements OnInit {
  username: any;
  isOpen: boolean;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  logout() {
    this.loginService.logout().subscribe();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }


}

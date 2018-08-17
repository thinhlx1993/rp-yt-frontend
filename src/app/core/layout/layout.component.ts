import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {userInfoApi} from '../../global';
import {SidenavItem} from '../sidenav/sidenav-item/sidenav-item.interface';
import {HttpClient} from '@angular/common/http';
import {SidenavService} from '../sidenav/sidenav.service';

@Component({
  selector: 'fury-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {
  role = '';
  constructor(private sidenavService: SidenavService, private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get(userInfoApi).subscribe((res: any) => {
      if (res.status) {
        this.role = res.data.role;
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('username', res.data.username);

        const menu: SidenavItem[] = [];

        menu.push({
          name: 'Thống kê',
          routeOrFunction: '/',
          icon: 'dashboard',
          position: 1,
          pathMatchExact: true
        });

        menu.push({
          name: 'Quản lý Email',
          routeOrFunction: '/email',
          icon: 'email',
          position: 2,
        });

        if (this.role === 'admin') {
          menu.push({
            name: 'Quản lý người dùng',
            routeOrFunction: '/users',
            icon: 'person',
            position: 3,
          });
        }

        menu.push({
          name: 'Danh sách các kênh',
          routeOrFunction: '/report',
          icon: 'playlist_add',
          position: 4,
        });

        menu.push({
          name: 'Chiến dịch',
          routeOrFunction: '/strategy',
          icon: 'chrome_reader_mode',
          position: 5,
        });

        // Send all created Items to SidenavService
        menu.forEach(item => this.sidenavService.addItem(item));
      }
    });
  }



  onActivate(e, scrollContainer) {
    scrollContainer.scrollTop = 0;
  }
}

import { Component } from '@angular/core';
import { SidenavItem } from './core/sidenav/sidenav-item/sidenav-item.interface';
import { SidenavService } from './core/sidenav/sidenav.service';

@Component({
  selector: 'fury-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(sidenavService: SidenavService) {
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

    menu.push({
      name: 'Quản lý người dùng',
      routeOrFunction: '/users',
      icon: 'person',
      position: 3,
    });

    menu.push({
      name: 'Danh sách các kênh',
      routeOrFunction: '/report',
      icon: 'playlist_add',
      position: 4,
    });

    // Send all created Items to SidenavService
    menu.forEach(item => sidenavService.addItem(item));
  }
}

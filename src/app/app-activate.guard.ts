import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class ActivateServiceGuard implements CanActivate {
  jwt: JwtHelper;
  constructor(private router: Router) {
    this.jwt = new JwtHelper();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return true;
    const authToken = localStorage.getItem('auth_token');
    if (!authToken || String(authToken) === 'undefined') {
      this.router.navigateByUrl('/login');
      return false;
    }
    if (this.jwt.isTokenExpired(authToken)) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

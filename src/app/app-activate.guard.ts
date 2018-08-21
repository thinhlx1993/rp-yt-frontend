import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class ActivateServiceGuard implements CanActivate {
  jwt: JwtHelperService;
  constructor(private router: Router) {
    this.jwt = new JwtHelperService();
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

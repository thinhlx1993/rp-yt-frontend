import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService  } from '@auth0/angular-jwt';

@Injectable()
export class AuthActivateGruard implements CanActivate {
  jwt: JwtHelperService;
  constructor(private router: Router) {
    this.jwt = new JwtHelperService();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken || String(authToken) === 'undefined') {
      return true;
    }
    if (this.jwt.isTokenExpired(authToken)) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}

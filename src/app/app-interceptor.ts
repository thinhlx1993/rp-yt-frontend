import {Injectable, Injector} from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest, HttpEvent,
  HttpErrorResponse, HttpClient, HttpResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { JwtHelper } from 'angular2-jwt';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import {logoutApi, refreshTokenApi} from './global';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  jwt: JwtHelper;
  isRefreshToken: boolean;
  constructor(
    private injector: Injector,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router) {
    this.jwt = new JwtHelper();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (localStorage.getItem('auth_token')) {
      const token = localStorage.getItem('auth_token');
      // const expDate: any = this.jwt.getTokenExpirationDate(token);
      // if ((expDate - Date.now()) < 10000 && !this.isRefreshToken) {
      //   this.isRefreshToken = true;
      //   // check token expired and refresh
      //   const http = this.injector.get(HttpClient);
      //   http.post(refreshTokenApi, {access_token: token}).subscribe((res: any) => {
      //     this.isRefreshToken = false;
      //     if (res.code === 200) {
      //       localStorage.setItem('auth_token', res.data);
      //     }
      //   }, error1 => this.isRefreshToken = false);
      // }

      if (req.url.indexOf('login') === -1) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
    return next.handle(req).do(evt => {
      if (evt instanceof HttpResponse && evt.hasOwnProperty('body') && evt.body.code === 401 && localStorage.getItem('auth_token')) {
        this.http.get(logoutApi).subscribe((res: any) => {});
        localStorage.clear();
        this.router.navigateByUrl('/login');
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if ((err.status === 401 || err.status === 403) && localStorage.getItem('auth_token')) {
          this.http.get(logoutApi).subscribe((res: any) => {
            if (res.message) {
              const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
                duration: 10000,
                panelClass: ['snackbar-error']
              };
              this.snackBar.open(res.message, '', snackBarConfig);
            }
          });
          localStorage.clear();
          this.router.navigateByUrl('/login');
        } else if (err.error.message) {
          const snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
            duration: 10000,
            panelClass: ['snackbar-error']
          };
          this.snackBar.open(err.error.message, '', snackBarConfig);
        }
        // console.log(err);
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loginApi, logoutApi, userInfoApi } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  public login(data): Observable<any> {
    return this.http.post(loginApi, data);
  }

  public logout(): Observable<any> {
    return this.http.get(logoutApi);
  }

  public userInfo(): Observable<any> {
    return this.http.delete(userInfoApi);
  }
}

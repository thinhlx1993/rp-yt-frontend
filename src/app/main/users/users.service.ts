import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {usersApi, usersPasswordApi} from '../../global';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {  }

  getUsers(page, itemPerPage, search): Observable<any> {
    let url = usersApi;
    url += `?page=${page}`;
    url += `&size=${itemPerPage}`;

    if (search  && search !== '') {
      url += `&search=${search}`;
    }
    return this.http.get(url);
  }

  createUser(data): Observable<any> {
    return this.http.post(usersApi, data);
  }

  editUser(data): Observable<any> {
    return this.http.put(usersApi, data);
  }

  changePasswordUser(data): Observable<any> {
    return this.http.put(usersPasswordApi, data);
  }

  removeUser(_id): Observable<any> {
    return this.http.delete(`${usersApi}?id=${_id}`);
  }
}

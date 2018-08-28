import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {userAgentApi} from '../../global';

@Injectable({
  providedIn: 'root'
})
export class UserAgentService {

  constructor(private http: HttpClient) { }

  get(page, itemPerPage, search): Observable<any> {
    let url = userAgentApi;
    url += `?page=${page}`;
    url += `&size=${itemPerPage}`;

    if (search  && search !== '') {
      url += `&search=${search}`;
    }
    return this.http.get(url);
  }

  create(data): Observable<any> {
    return this.http.post(userAgentApi, data);
  }

  edit(data): Observable<any> {
    return this.http.put(userAgentApi, data);
  }

  remove(_id): Observable<any> {
    return this.http.delete(`${userAgentApi}?id=${_id}`);
  }
}

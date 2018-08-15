import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { strategysApi } from '../../global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(private http: HttpClient) { }

  get(page, itemPerPage, search): Observable<any> {
    let url = strategysApi;
    url += `?page=${page}`;
    url += `&size=${itemPerPage}`;

    if (search  && search !== '') {
      url += `&search=${search}`;
    }
    return this.http.get(url);
  }

  create(data): Observable<any> {
    return this.http.post(strategysApi, data);
  }

  edit(data): Observable<any> {
    return this.http.put(strategysApi, data);
  }

  remove(email_id): Observable<any> {
    return this.http.delete(`${strategysApi}?id=${email_id}`);
  }
}

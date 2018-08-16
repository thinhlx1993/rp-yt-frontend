import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { channelApi } from '../../global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  get(page, itemPerPage, search): Observable<any> {
    let url = channelApi;
    url += `?page=${page}`;
    url += `&size=${itemPerPage}`;

    if (search  && search !== '') {
      url += `&search=${search}`;
    }
    return this.http.get(url);
  }

  create(data): Observable<any> {
    return this.http.post(channelApi, data);
  }

  edit(data): Observable<any> {
    return this.http.put(channelApi, data);
  }

  remove(email_id): Observable<any> {
    return this.http.delete(`${channelApi}?id=${email_id}`);
  }

  start(_id): Observable<any> {
    return this.http.get(`${channelApi}/start?id=${_id}`);
  }
}

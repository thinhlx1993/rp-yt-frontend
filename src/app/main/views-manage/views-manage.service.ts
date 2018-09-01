import { Injectable } from '@angular/core';
import {viewsChannelApi} from '../../global';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewsManageService {

  constructor(private http: HttpClient) { }

  get(page, itemPerPage, search): Observable<any> {
    let url = viewsChannelApi;
    url += `?page=${page}`;
    url += `&size=${itemPerPage}`;

    if (search  && search !== '') {
      url += `&search=${search}`;
    }
    return this.http.get(url);
  }

  create(data): Observable<any> {
    return this.http.post(viewsChannelApi, data);
  }

  edit(data): Observable<any> {
    return this.http.put(viewsChannelApi, data);
  }

  remove(_id): Observable<any> {
    return this.http.delete(`${viewsChannelApi}?id=${_id}`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { emailsApi } from '../../global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  getEmails(page, itemPerPage, search): Observable<any> {
    let url = emailsApi;
    url += `?page=${page}`;
    url += `&size=${itemPerPage}`;

    if (search  && search !== '') {
      url += `&search=${search}`;
    }
    return this.http.get(url);
  }

  createEmail(data): Observable<any> {
    return this.http.post(emailsApi, data);
  }

  editEmail(data): Observable<any> {
    return this.http.put(emailsApi, data);
  }

  removeEmail(email_id): Observable<any> {
    return this.http.delete(`${emailsApi}?id=${email_id}`);
  }
}

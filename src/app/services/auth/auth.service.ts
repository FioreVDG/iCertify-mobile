/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from 'src/app/config/url';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = URL;
  constructor(private http: HttpClient) {}

  setHeaders() {
    let csurf_token = localStorage.getItem('SESSION_TOKEN');
    let bearer_token = localStorage.getItem('SESSION_AUTH');

    let headers = new HttpHeaders({
      authorization: `Bearer ${bearer_token}`,
      c_auth: csurf_token || '',
    });

    return { headers };
  }

  getHeaders() {
    console.log(this.setHeaders());
    return {
      withCredentials: true,
      ...this.setHeaders(),
    };
  }

  login(body: object, type: string) {
    return this.http.post(
      this.url + `/auth/login/${type}`,
      body,
      this.getHeaders()
    );
  }

  me() {
    return this.http.get(this.url + '/auth/me', this.getHeaders());
  }
}

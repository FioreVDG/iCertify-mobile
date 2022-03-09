/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@angular/core';
import { QueryParams } from 'src/app/models/queryparams.iterface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  create(body: Object) {
    return this.http.start('post', '/conferences', body);
  }
  getAll(query: QueryParams) {
    return this.http.start('get', '/conferences', {}, query);
  }
  get(query: QueryParams, id: String) {
    return this.http.start('get', `/conferences/${id}`, {}, query);
  }
  getScheduled(query: QueryParams) {
    return this.http.start('get', `/conferences/schedules`, {}, query);
  }
  update(body: Object, id: String) {
    return this.http.start('put', `/conferences/${id}`, body);
  }
  delete(id: String) {
    return this.http.start('delete', `/conferences/${id}`);
  }
}

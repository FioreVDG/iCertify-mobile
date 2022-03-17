import { Inject, Injectable } from '@angular/core';
import { QueryParams } from 'src/app/models/queryparams.iterface';
import { HttpService } from './../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ClusterService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  create(body: Object) {
    return this.http.start('post', '/clusters', body);
  }
  getAll(query: QueryParams) {
    return this.http.start('get', '/clusters', {}, query);
  }
  get(query: QueryParams, id: String) {
    return this.http.start('get', `/clusters/${id}`, {}, query);
  }
  update(body: Object, id: String) {
    return this.http.start('put', `/clusters/${id}`, body);
  }
  delete(id: String) {
    return this.http.start('delete', `/clusters/${id}`);
  }
  getOne(brgyCode: String) {
    return this.http.start('get', `/clusters/getOne/${brgyCode}`);
  }
  getOneNotary(_notaryId: String | undefined) {
    return this.http.start('get', `/clusters/getOneNotary/${_notaryId}`);
  }
}

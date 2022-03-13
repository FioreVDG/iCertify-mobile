import { Inject, Injectable } from '@angular/core';
import { QueryParams } from 'src/app/models/queryparams.iterface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  create(body: Object) {
    return this.http.start('post', '/documents', body);
  }
  getAll(query: QueryParams) {
    return this.http.start('get', '/documents', {}, query);
  }
  get(query: QueryParams, id: String) {
    return this.http.start('get', `/documents/${id}`, {}, query);
  }
  update(body: Object, id: String) {
    return this.http.start('put', `/documents/${id}`, body);
  }
  delete(id: String) {
    return this.http.start('delete', `/documents/${id}`);
  }
  notarize(body: Object, id: String) {
    return this.http.start('put', `/documents/notarize/${id}`, body);
  }
  unnotarize(body: Object, id: String) {
    return this.http.start('put', `/documents/unnotarize/${id}`, body);
  }
  skip(body: Object, id: String) {
    return this.http.start('put', `/documents/skip/${id}`, body);
  }
}

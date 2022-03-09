/* eslint-disable @typescript-eslint/ban-types */
import { Inject, Injectable } from '@angular/core';
import { QueryParams } from 'src/app/models/queryparams.iterface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  create(body: Object) {
    return this.http.start('post', '/rooms', body);
  }
  get(query: QueryParams) {
    return this.http.start('get', '/rooms', {}, query);
  }
  delete(id: String) {
    return this.http.start('put', `/rooms/deleteRoom/${id}`);
  }
}

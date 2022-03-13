import { Inject, Injectable } from '@angular/core';
import { QueryParams } from 'src/app/models/queryparams.iterface';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentLogsService {
  constructor(@Inject(HttpService) private http: HttpService) {}
  createDocumentLogs(body: Object) {
    return this.http.start('post', '/documentLogs', body);
  }
  getDocumentLogs(query: QueryParams) {
    return this.http.start('get', '/documentLogs', {}, query);
  }
  createDocumentLogsMany(body: Array<any> = []) {
    return this.http.start('post', '/documentLogs/insertMany', body);
  }
}

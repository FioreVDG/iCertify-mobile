import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AgoraService {
  constructor(@Inject(HttpService) private http: HttpService) {}

  getToken(channelName: String) {
    return this.http.start('get', `/agora/token/${channelName}`);
  }
}

import { ConferenceService } from './conference/conference.service';
import { RoomService } from './room/room.service';
import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    @Inject(HttpService) private http: HttpService,
    public room: RoomService,
    public conference: ConferenceService
  ) {}
}

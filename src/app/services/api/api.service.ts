import { ClusterService } from './cluster/cluster.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DocumentService } from './document/document.service';
import { ConferenceService } from './conference/conference.service';
import { RoomService } from './room/room.service';
import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { AgoraService } from './agora/agora.service';
import { DocumentLogsService } from './document-logs/document-logs.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    @Inject(HttpService) private http: HttpService,
    public room: RoomService,
    public conference: ConferenceService,
    public agora: AgoraService,
    public document: DocumentService,
    public documentlogs: DocumentLogsService,
    public dashboard: DashboardService,
    public cluster: ClusterService
  ) {}
}

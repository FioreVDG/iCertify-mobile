import { HttpService } from './../../http/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpService) {}

  notaryDashboard() {
    return this.http.start('get', '/dashboard/notary/dashboard');
  }
}

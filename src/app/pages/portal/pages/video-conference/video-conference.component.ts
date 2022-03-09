/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
import { ApiService } from './../../../../services/api/api.service';
/* eslint-disable no-underscore-dangle */
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.scss'],
})
export class VideoConferenceComponent implements OnInit {
  me: any;
  schedules: any;
  constructor(private auth: AuthService, private api: ApiService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.auth.me().subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.me = res.env.user;
        this.getParticipants();
      }
    });
  }

  getParticipants() {
    const query: any = {
      find: [
        {
          field: '_notaryId',
          operator: '=',
          value: this.me._notaryId,
        },
      ],
    };
    this.api.conference.getScheduled(query).subscribe((res: any) => {
      console.log(res);
      this.schedules = res.env.schedules;
    });
  }
}

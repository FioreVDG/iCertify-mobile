/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-brgy-video-conference',
  templateUrl: './brgy-video-conference.component.html',
  styleUrls: ['./brgy-video-conference.component.scss'],
})
export class BrgyVideoConferenceComponent implements OnInit {
  me: any;
  settings: any;
  loading: boolean = false;
  constructor(private auth: AuthService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.loading = true;
    this.auth.me().subscribe((res: any) => {
      console.log(res);
      if (res) {
      }
    });
  }
}

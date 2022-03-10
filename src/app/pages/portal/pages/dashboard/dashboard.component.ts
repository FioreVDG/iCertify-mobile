/* eslint-disable curly */
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userType: any;
  _icertifyServices: Array<any> = [
    {
      id: 0,
      label: 'Video Conference',
      icon: 'videocam',
      onSelect: () => {
        this.routingLogic();
      },
    },
  ];

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.auth.me().subscribe((res: any) => {
      this.userType = res.env.user.type;
    });
  }

  routingLogic() {
    if (this.userType === 'Notary')
      this.router.navigate(['portal/video-conference']);
    else this.router.navigate(['portal/brgy-video-conference']);
  }
}

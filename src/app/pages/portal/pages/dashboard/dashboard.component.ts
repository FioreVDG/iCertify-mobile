import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  _icertifyServices: Array<any> = [
    {
      id: 0,
      label: 'Video Conference',
      icon: 'videocam',
      onSelect: () => {
        this.router.navigate(['portal/video-conference']);
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}
}

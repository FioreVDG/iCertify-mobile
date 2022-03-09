import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  MenuController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalComponent implements OnInit {
  me: any;
  menuList = [
    {
      label: 'Dashboard',
      router: '/portal/dashboard',
      onSelect: () => {
        this.onMenuClick();
      },
      icon: 'home-outline',
    },
  ];
  constructor(
    public menu: MenuController,
    private auth: AuthService,
    private store: Store<{ user: any }>
  ) {}

  ionViewDidEnter() {
    this.auth.me().subscribe((res: any) => {
      console.log(res);
      this.me = res.env.user;
    });
  }

  ngOnInit() {}
  logout() {}
  onMenuClick() {
    this.menu.close();
  }
}

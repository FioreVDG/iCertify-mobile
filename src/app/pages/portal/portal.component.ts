import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  MenuController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { setUser } from 'src/app/store/user/user.action';

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
      icon: 'stats-chart-outline',
    },
    {
      label: 'Video Conference',
      router: '/portal/video-conference',
      onSelect: () => {
        this.onMenuClick();
      },
      icon: 'videocam-outline',
    },
  ];
  isLoggingOut = false;
  loading: any;
  toasting: any;
  async presentLoading(msg: any) {
    this.loading = await this.loadingController.create({
      message: `${msg}`,
    });
    await this.loading.present();
  }

  async presentToast(msg: any) {
    this.toasting = await this.toast.create({
      message: `${msg}`,
      duration: 4000,
    });
    await this.toasting.present();
  }

  constructor(
    public menu: MenuController,
    private auth: AuthService,
    private store: Store<{ user: any }>,
    private toast: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.auth.me().subscribe(
      (res: any) => {
        console.log(res);
        this.me = res.env.user;
        this.store.dispatch(setUser({ user: res.env.user }));
      },
      (err) => {
        console.log(err);
        if (err) this.checkSession();
      }
    );
  }

  checkSession() {
    let csurf_token = localStorage.getItem('SESSION_CSURF_TOKEN');
    let session_token = localStorage.getItem('SESSION_AUTH');
    console.log(csurf_token, session_token);
    if (csurf_token == null || session_token == null) {
      this.loading = true;
      this.presentToast('Session Timeout. Log in to continue');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    console.log(this.me);
    this.isLoggingOut = true;
    this.loadingController
      .create({
        message: 'Logging out..',
      })
      .then((l) => {
        l.present();
      });
    localStorage.removeItem('SESSION_CSURF_TOKEN');
    localStorage.removeItem('SESSION_AUTH');
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.loadingController.dismiss();
    }, 1500);
  }
  onMenuClick() {
    this.menu.close();
  }
}

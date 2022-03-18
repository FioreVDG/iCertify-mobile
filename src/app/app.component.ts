/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/semi */
import { Component, ViewChild } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {
  ActionSheetController,
  AlertController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
  isLoggingOut: boolean = false;

  constructor(
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private diagnostic: Diagnostic,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private toast: ToastController,
    private loadingController: LoadingController,
    public mc: ModalController,
    private auth: AuthService,
    public _location: Location,
    private alertControl: AlertController,
    private router: Router
  ) {
    this.initializePermission();
    this.backButtonEvent();
  }

  initializePermission() {
    this.platform.ready().then(() => {
      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(
          (result) => {
            console.log(result);
            if (!result.hasPermission) {
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.CAMERA
              );
            } else {
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.CAMERA
              );
            }
          },
          (err) => {
            console.log(err);
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.CAMERA
            );
          }
        );

      this.requestPermissions();
    });
  }
  requestPermissions() {
    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
    ]);
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(1000, () => {
      this.actionSheetController
        .getTop()
        .then((r) => {
          if (r) {
            this.actionSheetController.dismiss();
          } else {
            this.mc
              .getTop()
              .then((r) => {
                if (r) {
                  this.mc.dismiss();
                } else {
                  this.alertController
                    .getTop()
                    .then((r) => {
                      if (r) {
                        this.alertController.dismiss();
                      }

                      if (
                        this._location.isCurrentPathEqualTo('/portal/dashboard')
                      ) {
                        this.logoutButtonAlert();
                      } else if (
                        this._location.isCurrentPathEqualTo('/login')
                      ) {
                        if (!this.routerOutlet.canGoBack()) {
                          this.exitButtonAlert();
                        }
                      } else {
                        if (!this.routerOutlet.canGoBack()) {
                          this.exitButtonAlert();
                        } else {
                          this._location.back();
                        }
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  exitButtonAlert() {
    this.alertController
      .create({
        message: 'Are you sure you want to close exit?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Close App',
            handler: () => {
              navigator['app'].exitApp();
            },
          },
        ],
      })
      .then((a) => {
        a.present();
      });
  }

  logoutButtonAlert() {
    this.alertController
      .create({
        message: 'Are you sure you want to Log out?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Log out',
            handler: () => {
              this.logout();
            },
          },
        ],
      })
      .then((a) => {
        a.present();
      });
  }

  logout() {
    this.isLoggingOut = true;
    this.loadingController
      .create({
        message: 'Logging out..',
      })
      .then((l) => {
        l.present();
      });
    this.auth.logout().subscribe((res: any) => {
      localStorage.removeItem('SESSION_TOKEN');
      localStorage.removeItem('SESSION_AUTH');
      this.loadingController.dismiss();
      this.router.navigate(['/login']);

      this.toast
        .create({
          message: 'Logged Out',
          duration: 1500,
        })
        .then((m) => {
          m.present();
        });
    });
  }
}

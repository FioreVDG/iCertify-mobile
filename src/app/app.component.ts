/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/semi */
import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private diagnostic: Diagnostic,

    private alertControl: AlertController
  ) {
    this.initializePermission();
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
}

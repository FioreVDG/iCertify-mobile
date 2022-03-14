/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoggingIn: boolean = false;
  year = new Date().getFullYear();
  showPassword: boolean = false;
  credentials: FormGroup = this.fb.group({
    email: new FormControl('jrnotary@gmail.com', [
      Validators.required,
      Validators.email,
    ]),

    password: new FormControl('123qweasdzxc', [Validators.required]),
  });
  loading: any;
  toasting: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private toast: ToastController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}

  login() {
    this.isLoggingIn = true;
    if (!this.credentials.valid) {
      this.credentials.markAllAsTouched();
      return;
    }

    this.presentLoading();
    const raw = this.credentials.getRawValue();
    this.auth.login(raw, 'Notary').subscribe(
      (res: any) => {
        console.log(res);
        if (res) {
          this.loading.dismiss();
          console.log(res.env.user);
          localStorage.setItem('SESSION_TOKEN', res.csrf_token);
          localStorage.setItem('SESSION_AUTH', res.token);
          this.router.navigate(['/portal/video-conference']);
          this.isLoggingIn = false;
        }
      },
      (err) => {
        this.isLoggingIn = false;
        this.loading.dismiss();
        console.log(err);
        this.presentToast(`${err.error.message}`);
      }
    );
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await this.loading.present();
  }

  async presentToast(msg: any) {
    this.toasting = await this.toast.create({
      message: `${msg}`,
      duration: 3000,
    });
    await this.toasting.present();
  }
}

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
/* eslint-disable @typescript-eslint/naming-convention */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AgoraConfig, NgxAgoraModule } from 'ngx-agora';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { StoreModule } from '@ngrx/store';

const agoraConfig: AgoraConfig = {
  AppID: '4b117526903f4bc4a60134e23047a1a8',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgxAgoraModule.forRoot(agoraConfig),
    StoreModule.forRoot({}),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AndroidPermissions,
    Diagnostic,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { ComponentModule } from './../../../../shared/component/component.module';
import { ConferenceRoomComponent } from './conference-room/conference-room.component';
import { VideoConferenceComponent } from './video-conference.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoConferenceRoutingModule } from './video-conference-routing.module';

@NgModule({
  declarations: [VideoConferenceComponent, ConferenceRoomComponent],
  imports: [
    CommonModule,
    VideoConferenceRoutingModule,
    IonicModule,
    ComponentModule,
  ],
})
export class VideoConferenceModule {}

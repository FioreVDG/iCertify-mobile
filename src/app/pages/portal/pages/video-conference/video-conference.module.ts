import { VideoConferenceComponent } from './video-conference.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoConferenceRoutingModule } from './video-conference-routing.module';

@NgModule({
  declarations: [VideoConferenceComponent],
  imports: [CommonModule, VideoConferenceRoutingModule, IonicModule],
})
export class VideoConferenceModule {}

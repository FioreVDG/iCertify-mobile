import { ComponentModule } from './../../../../shared/component/component.module';
import { IonicModule } from '@ionic/angular';
import { BrgyVideoConferenceComponent } from './brgy-video-conference.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrgyVideoConferenceRoutingModule } from './brgy-video-conference-routing.module';

@NgModule({
  declarations: [BrgyVideoConferenceComponent],
  imports: [
    CommonModule,
    BrgyVideoConferenceRoutingModule,
    IonicModule,
    ComponentModule,
  ],
})
export class BrgyVideoConferenceModule {}

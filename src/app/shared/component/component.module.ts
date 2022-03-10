import { ConferenceComponent } from './conference/conference.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConferenceComponent],
  imports: [CommonModule, IonicModule],
  exports: [ConferenceComponent],
})
export class ComponentModule {}

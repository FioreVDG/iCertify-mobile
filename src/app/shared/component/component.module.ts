import { ConferenceSettingsComponent } from './conference/conference-settings/conference-settings.component';
import { ConferenceComponent } from './conference/conference.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DBMeter } from '@ionic-native/db-meter/ngx';

@NgModule({
  declarations: [ConferenceComponent, ConferenceSettingsComponent],
  imports: [CommonModule, IonicModule, DragAndDropModule],
  providers: [DBMeter],
  exports: [ConferenceComponent],
})
export class ComponentModule {}

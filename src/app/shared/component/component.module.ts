import { ConferenceComponent } from './conference/conference.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropModule } from 'angular-draggable-droppable';

@NgModule({
  declarations: [ConferenceComponent],
  imports: [CommonModule, IonicModule, DragAndDropModule],
  exports: [ConferenceComponent],
})
export class ComponentModule {}

import { InfoViewComponent } from './info-view/info-view.component';
import { ModalsModule } from './../../../../shared/modals/modals.module';
import { FormsModule } from '@angular/forms';
import { NotarizedDocumentComponent } from './notarized-document/notarized-document.component';
import { ComponentModule } from './../../../../shared/component/component.module';

import { VideoConferenceComponent } from './video-conference.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoConferenceRoutingModule } from './video-conference-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    VideoConferenceComponent,
    NotarizedDocumentComponent,
    InfoViewComponent,
  ],
  imports: [
    CommonModule,
    VideoConferenceRoutingModule,
    IonicModule,
    ComponentModule,
    FormsModule,
    ModalsModule,
    PdfViewerModule,
  ],
})
export class VideoConferenceModule {}

import { IonicModule } from '@ionic/angular';
import { PortalComponent } from './portal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PortalComponent],
  imports: [
    CommonModule,
    PortalRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PortalModule {}

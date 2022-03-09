import { IonicModule } from '@ionic/angular';
import { PortalComponent } from './portal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { userReducer } from 'src/app/store/user/user.reducer';

@NgModule({
  declarations: [PortalComponent],
  imports: [
    CommonModule,
    PortalRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('user', userReducer),
  ],
})
export class PortalModule {}

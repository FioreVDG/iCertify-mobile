import { IonicModule } from '@ionic/angular';
import { ActionResultComponent } from './action-result/action-result.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ActionResultComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [ActionResultComponent],
})
export class ModalsModule {}

import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReportsComponent } from './reports.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    IonicModule,
    HighchartsChartModule,
    ReactiveFormsModule,
  ],
})
export class ReportsModule {}

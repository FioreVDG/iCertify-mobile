import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardComponent } from './dashboard.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    IonicModule,
    HighchartsChartModule,
  ],
})
export class DashboardModule {}

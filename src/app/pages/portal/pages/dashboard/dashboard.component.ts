import { UtilService } from './../../../../services/util/util.service';
import { CHART_CONFIG } from './config';
import { PIE_CHART_OPTIONS } from './../reports/config';
import { ApiService } from './../../../../services/api/api.service';
/* eslint-disable curly */
import { AuthService } from './../../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  highcharts: any = Highcharts;
  chartConfig = JSON.parse(JSON.stringify(CHART_CONFIG));
  userType: any;
  brgyDesc = [];
  _icertifyServices: Array<any> = [
    {
      id: 0,
      label: 'Video Conference',
      icon: 'videocam',
      onSelect: () => {
        this.routingLogic();
      },
    },
  ];
  generated = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    private util: UtilService
  ) {}

  ngOnInit() {
    this.auth.me().subscribe((res: any) => {
      this.userType = res.env.user.type;
      this.api.cluster
        .getOneNotary(res.env.user._notaryId)
        .subscribe((res: any) => {
          res.env.cluster.barangays.forEach((brgy: any) => {
            this.brgyDesc.push(brgy._barangay.brgyDesc);
          });
          console.log(this.brgyDesc, 'cluster');
          this.getDashboardData();
        });
    });
  }

  routingLogic() {
    if (this.userType === 'Notary')
      this.router.navigate(['portal/video-conference']);
    else this.router.navigate(['portal/brgy-video-conference']);
  }
  getDashboardData() {
    this.generated = false;
    let dispValue = '';
    this.api.dashboard.notaryDashboard().subscribe((res: any) => {
      console.log(res);
      this.chartConfig.forEach((itm) => {
        let totalValue = 0;
        let columnData = [];
        console.log(itm.chartKey);
        if (
          itm.chartKey === itm.chartOpt.chartKey &&
          itm.chartOpt.type === 'pie'
        ) {
          if (itm.label === 'Documents per Barangay') {
            this.brgyDesc.forEach((brgy) => {
              console.log('HERERERE');
              itm.filterKey.push({
                label: `${brgy}`,
                id: `${itm.chartKey}.${brgy
                  .split(' ')
                  .join('_')
                  .replace('.', '')
                  .toLowerCase()}`,
              });
            });
          }
          itm.filterKey.forEach((key) => {
            console.log(key.id);
            console.log(this.util.deepFind(res.env, key.id));
            if (this.util.deepFind(res.env, key.id)) {
              totalValue += this.util.deepFind(res.env, key.id);
              columnData.push({
                name: key.label,
                y: this.util.deepFind(res.env, key.id),
              });
            }
          });
          itm.chartOpt.chartOpt.series[0].data = columnData;
          itm.chartOpt.chartOpt.series[0].colors = [
            '#9945ff',
            '#6323b0',
            '#1967d2',
            '#4d6db7',
            '#e9eefa',
          ];
        }
        if (
          itm.chartKey === itm.chartOpt.chartKey &&
          itm.chartOpt.type === 'bar'
        )
          if (
            totalValue.toString().length >= 4 &&
            totalValue.toString().length < 7
          )
            dispValue = (totalValue *= 0.001).toFixed(2).toString() + 'k';
        if (totalValue.toString().length >= 7)
          dispValue = (totalValue *= 0.000001).toFixed(2).toString() + 'm';
        itm.chartOpt.chartOpt.title.text = `${
          itm.label
        }<br><b style="font-size:28px">${
          dispValue !== '' ? dispValue : totalValue
        }</b>`;

        console.log(itm.chartOpt.chartOpt);
      });
      this.generated = true;
    });
  }
  //
}

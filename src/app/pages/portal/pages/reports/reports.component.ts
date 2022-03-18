import { PIE_CHART_OPTIONS, FILTERS } from './config';
import { Component, OnInit } from '@angular/core';
import * as HighCharts from 'highcharts';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  highcharts: any = HighCharts;
  filter = this.fb.group({});
  dateRange = this.fb.group({
    dateStart: new FormControl(),
    dateEnd: new FormControl(new Date(Date.now())),
  });
  chartOpt = JSON.parse(JSON.stringify(PIE_CHART_OPTIONS));
  formFields = FILTERS;
  accordIcon = 'caret-down-outline';
  constructor(public fb: FormBuilder) {}

  ngOnInit() {
    this.toggleAcc();
    this.initiateForm();
  }

  initiateForm() {
    let temp = {};
    this.formFields.forEach((field) => {
      temp[field.key] = new FormControl();
    });
    this.filter = this.fb.group(temp);
  }
  toggleAcc() {
    var acc = document.getElementsByClassName('accordion');
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.display === 'block') {
          panel.style.display = 'none';
        } else {
          panel.style.display = 'block';
        }
      });
    }
  }
}

export const PIE_CHART_OPTIONS = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
    // height: '600',
    // maxHeight: '400',
    width: '400',
  },
  title: {
    text: '',
    align: 'center',
    verticalAlign: 'middle',
    y: 0,
    x: 0,
    // widthAdjust: -400,
    style: { color: '#333333', fontSize: '10px' },
  },
  tooltip: {
    headerFormat: '<span style="font-size:8px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}: <b>{point.y} ({point.percentage:.1f}%)<br/>',
  },
  accessibility: {
    point: {
      valueSuffix: '',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format:
          '<b style="color:#636363;font-size:8px">{point.name}: {point.y:.0f}</b>',
      },
      showInLegend: true,
    },
  },

  credits: {
    enabled: false,
  },
  legend: {
    y: 10,
  },
  series: [
    {
      name: 'Brands',
      colorByPoint: true,
      innerSize: '75%',
      size: '75%',
      data: [],
    },
  ],
};

export const FILTERS: Array<FILTERBUTTON> = [
  {
    type: 'select',
    isLoading: true,
    placeholder: 'Document Type',
    key: 'documentType',
    choices: [
      'Special Power of Attorney (SPA)',
      'Affidavit',
      'Brgy. Compromise Agreement',
      'Quitclaim',
      'Others',
    ],
  },
  {
    type: 'select',
    isLoading: true,
    placeholder: 'Status',
    key: 'status',
    choices: ['All', 'Notarized', 'Unnotarized'],
  },
  {
    type: 'select',
    isLoading: true,
    placeholder: 'Barangays',
    key: 'barangay',
    choices: [{ label: 'All', value: 'All' }],
  },
];
export interface FILTERBUTTON {
  placeholder: string;
  isLoading: boolean;
  key: string;
  choices?: Array<any>;
  chartOpt?: object;
  type: string;
}

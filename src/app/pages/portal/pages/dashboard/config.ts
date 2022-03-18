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
    // text: '',
    // align: 'center',
    // verticalAlign: 'middle',
    y: 50,
    // x: 0,
    // widthAdjust: -400,
    // style: { color: '#333333', fontSize: '10px' },
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
      allowPointSelect: true,
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
      innerSize: '70%',
      size: '70%',
      data: [],
    },
  ],
};

export const BAR_CHART_OPTIONS = {
  chart: {
    type: 'column',
    width: '400',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: 'Total Document per Brgy',
  },
  subtitle: {
    text: '',
  },
  xAxis: {
    categories: [],
    crosshair: true,
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Rainfall (mm)',
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  series: [],
};

export const CHART_CONFIG = [
  {
    generated: false,

    chartKey: 'totalDocsToDate.byBarangay',
    label: 'Documents per Barangay',
    chartOpt: {
      type: 'pie',
      chartKey: 'totalDocsToDate.byBarangay',
      chartOpt: JSON.parse(JSON.stringify(PIE_CHART_OPTIONS)),
    },
    filterKey: [],
  },
  {
    generated: false,
    chartKey: 'totalDocsToDate',
    label: 'Total Documents to Date',
    chartOpt: {
      type: 'pie',
      chartKey: 'totalDocsToDate',
      chartOpt: JSON.parse(JSON.stringify(PIE_CHART_OPTIONS)),
    },
    filterKey: [
      {
        label: 'Notarized',
        id: 'totalDocsToDate.byDocStatus.notarized',
      },
      {
        label: 'Unnotarized',
        id: 'totalDocsToDate.byDocStatus.unnotarized',
      },
      {
        label: 'Pending',
        id: 'totalDocsToDate.byDocStatus.pending',
      },
    ],
  },
];

 chart = new Highcharts.Chart({
         chart: {
            renderTo: 'HLTTest',
            type: 'column',
backgroundColor: 'rgba(0,0,0,0.5)',
         },
credits: {enabled:false},
legend: {enabled:false},
         title: {
            text: ''
         },
         xAxis: {
labels:{enabled: false},
tickLength: 0,
         },
         yAxis: {
            title: {
               text: ''
            },
labels: {enabled:false},
gridLineColor: 'rgba(0,0,0,0)',
         },
         series: [{
            name: 'Volume',
            data: [1]
         }]
      });

//use: chart.series[0].points[0].update(3, true, true) to change value and have animations
//use: chart.yAxis[0].setExtremes(0, 15, true, true) to set the chart scale with animations
//use: plotLine = chart.yAxis[0].addPlotLine({color: '#FFFFFF', value: 12, width: 2}) to add 'plot line' to indicate target
//use: plotLine.destroy() to remove the target indicator
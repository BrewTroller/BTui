Ext.require(['Ext.chart.*', 'Ext.chart.axis.Gauge', 'Ext.chart.series.*', 'Ext.Window']);

Ext.define('BTUI.view.Vessel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.Vessel',

	initComponent: function() {

		this.me = new Vessel(this.getId());
		     		
      tempGauge = {
         id: 'tempGauge' + this.getId(),
         xtype: 'chart',
         style: 'background:#fff',
         animate: {
            easing: 'bounceOut',
            duration: 500
         },
         store: this.me.temperatureStore,
         insetPadding: 30,
         flex: 1,
         axes: [{
            type: 'gauge',
            position: 'gauge',
            minimum: 0,
            maximum: 215,
            steps: 15,
            margin: 7
          }],
         series: [{
             type: 'gauge',
				 highlight: true,
				 needle: true,
				 tips: {
				    trackMouse: true,
				    width: 300,
				    height: 35,
				    renderer: function(storeItem, item) {
				       this.setTitle('Current Temperature' + ': ' + storeItem.get('temperature') + String.fromCharCode(186) + "; Heat Status: " + storeItem.get('heatStatus') + String.fromCharCode(37));
				                  }
				 },
				 field: 'temperature'
          }]
		};

		volBar = {
      	id: 'volumeBar' + this.getId(),
         xtype: 'chart',
         flex: .25,
         animate: true,
         shadow: true,
         store: this.me.volumeStore,
         axes: [{
             type: 'Numeric',
             position: 'bottom',
             fields: ['volume'],
             label: {
                 renderer: Ext.util.Format.numberRenderer('0,0')
             },
             grid: true,
             minimum: 0,
             maximum: 15.5,
         }],
         background: {
             gradient: {
                 id: 'backgroundGradient',
                 angle: 45,
                 stops: {
                     0: {
                         color: '#ffffff'
                     },
                     100: {
                         color: '#eaf1f8'
                     }
                 }
             }
         },
         series: [{
            type: 'bar',
            axis: 'bottom',
            highlight: true,
				tips: {
				    trackMouse: true,
				    width: 140,
				    height: 35,
				    renderer: function(storeItem, item) {
				       this.setTitle('Current Volume Level' + ': ' + storeItem.get('volume') + ' gallons');
				                  }
				},
            yField: ['volume']
         }]
		};

      Ext.apply(this, {
         width: 350,
         height: 400,
         margin: 10,
			hidden: false,
         tools: [
         	{
            	type: 'gear',
               handler: function(event, toolEl, panel, tc) {
									panel.ownerCt.me.settings(event, toolEl, panel, tc);
					}
            },
				{
					type: 'refresh',
					handler: function(event, toolEl, panel, tc) {
									panel.ownerCt.me.manualUpdate();
					}
				},
				{
					type: 'close',
					handler: function(event, toolEl, panel, tc) {
									panel.ownerCt.hide();
					}
				}
         ],
         layout: {
             type: 'vbox',
             align: 'stretch',
             pack: 'start'
         },
         items: [tempGauge, volBar]
		});
      
		this.callParent(arguments);
      this.setTitle(this.me.getVesselName());

    },

});
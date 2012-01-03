Ext.require(['Ext.chart.*', 'Ext.data.Store', 'Ext.data.proxy.*', 'Ext.window.MessageBox']);

Ext.application({
	name: 'BTUI',
	appFolder: 'app',
	controllers: ['Views'],
		
	launch: function(){
		
		Ext.create('Ext.container.Viewport', {
			layout: {				
					type: 'vbox',
					pack: 'start',
					align: 'stretch'				
			},
			items: [
				{
					xtype: 'navPanel',
					flex: 1
				},
				{
					id: 'viewPanel',
					xtype: 'viewPanel',
					flex: 10
				}
			]
		});
	}
});

var BrewTroller = new BrewTroller;
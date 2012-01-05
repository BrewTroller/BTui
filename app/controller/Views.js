Ext.define('BTUI.controller.Views', {
	extend: 'Ext.app.Controller',
	stores: ['Valves'],
	models: ['Valve'],	
	views: ['navPanel', 'viewPanel', 'card.Home', 'card.Recipe', 'card.Logging', 'Valves', 'Vessel', 'vesselSettings', 'btEdit', 'setPointEdit'],
	
	init: function() {
		
		//Views Controller controls setup
		
		//control that listens for the Viewport to fire a beforerender event, and calls BTUIInit() function when it does
		this.control({
			'viewport': {
				beforerender: this.BTUIInit
			}
		});
		
		//control listens for the gridpanel item to fire a before render event, and calls valvesInit() when it does
		this.control({
			'gridview': {
				viewready: this.valvesInit
			}
		});
	},
			
	BTUIInit: function(){
		BrewTroller.InitSetup();
	},
	
	valvesInit: function(){
		alert('stopping...');
		BrewTroller.valves.initSetup();
	}

});
Ext.define('BTUI.controller.Views', {
	extend: 'Ext.app.Controller',
	stores: ['Valves'],
	models: ['Valve'],	
	views: ['navPanel', 'viewPanel', 'card.Home', 'card.Recipe', 'card.Logging', 'Valves', 'Vessel', 'vesselSettings', 'btEdit'],
	
	init: function() {
		
		//Views Controller controls setup
		
		//control that listens for the Viewport to fire a beforerender evenet, and calls BTUIInit() function when it does
		this.control({
			'viewport': {
				beforerender: this.BTUIInit
			}
		});
		
		//control that listens for the Save button click in a Vessel Settings window, and calls the saveVessel() function when one fire		
		this.control({
			'vesselSettings button[action=save]':{
				click: this.saveVessel
			}
		});
		
		//control that listens for the tempSet button click in a Vessel window, and calls tempSet() which creates a popup to set the set point, when it fires.
		this.control({
			'Vessel button[action=tempSet]':{
				click: this.tempSet
			}
		});		
		
		//control that listens for the saveSetPoint button click in a setPoint popup window, and calls saveSetPoint() when it fires
		this.control({
			'button[action=saveSetPoint]':{
				click: this.saveSetPoint
			}
		});
		
	},
	
	saveVessel: function(button, event, options) {
	
		var vessel = button.ownerCt.ownerCt.vessel;
			
		vessel.settingsWindow.hide();	//hide the settings window before making any modifications to ensure that it does hide the first time the save button is pressed
		
		//Enable or disable vessel volume
		if ( vessel.settingsWindow.down('#hasVolume').getValue() != vessel.hasVolumeSensing() ) {
			if ( vessel.settingsWindow.down('#hasVolume').getValue() ) {
				vessel.enableVolume();
			}
			else {
				vessel.disableVolume();
			}
		}
		
		//Set temperature gauge range
		if (vessel.settingsWindow.down('#temperatureMinimum').getValue() != vessel.getTemperatureMinimum() || vessel.settingsWindow.down('#temperatureMaximum').getValue() != vessel.getTemperatureMaximum){
			vessel.setTemperatureRange(vessel.settingsWindow.down('#temperatureMinimum').getValue(), vessel.settingsWindow.down('#temperatureMaximum').getValue());
		}
		
		//set update frequency
		if ( vessel.settingsWindow.down('#updateFrequency').getValue() != vessel.getUpdateFrequency() ){
			vessel.setUpdateFrequency(vessel.settingsWindow.down('#updateFrequency').getValue());
		}
		
		//Start and stop auto updating
		if ( vessel.settingsWindow.down('#autoUpdate').getValue() && !( vessel.isAutoUpdate() ) ) {
			vessel.startAutoUpdate();
		}
		else {
			
			if ( vessel.isAutoUpdate() && !( vessel.settingsWindow.down('#autoUpdate').getValue() ) ){
				vessel.stopAutoUpdate();
			}			
		}
	},
	
	tempSet: function(button, event, options) {
		var vessel = button.ownerCt.ownerCt.me;
		
		var setPoint = Ext.create('Ext.Window', {
			title: 'Edit Set Point',
			vessel: vessel,
			hidden: true,
			layout: 'fit',
			items: [
				{
					xtype: 'fieldset',
					items: [
						{
							xtype: 'numberfield',
							id: 'setPoint',
							value: vessel.getSetPoint(),
							maxValue: 220,
							minValue: 0,
						}
					]
				}
			],
			buttons: [
				{
					text: 'Save',
					action: 'saveSetPoint'
				},
				{
					text: 'Cancel',
					handler: function(){
						this.ownerCt.ownerCt.hide();
						this.ownerCt.ownerCt.destroy();
					}
				}
			]
		});
		setPoint.show();
	},
	
	saveSetPoint: function(button, event, options){
		var editWindow = button.ownerCt.ownerCt;
		var vessel = editWindow.vessel;
		
		vessel.setNewSetPoint(editWindow.down('#setPoint').value);
		editWindow.hide();
		editWindow.destroy();
	},
			
	BTUIInit: function(){
		BrewTroller.InitSetup();
	},

});
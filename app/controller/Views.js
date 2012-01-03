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
		
		//control that listens for the navBar Settings button click, and calls the BrewTrollerSettings() function when it fires
		this.control({
			'navPanel button[action=Settings]': {
				click: this.BrewTrollerSettings
			}
		});
		
		//control that listens a navBar button fire (Home, Logging...), and calls the changeCard() function when one does
		this.control({
			'navPanel button': {
				click: this.changeCard
			}
		});
		
		//control that listens for the Save button click in the BrewTroller Settings window, and calls saveBrewTroller() when it fires
		this.control({
			'btEdit button[action=save]': {
				click: this.saveBrewTroller
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
	
	/*
	//				BrewTrollerSettings controller Function
	// Function to be called when the user clicks on the Settings button in the navbar
	//	function creates a settings window, if one does not exist, then loads in appropriate values into the form fields
	//	after all form fields have been set the function shows the edit window
	*/
	BrewTrollerSettings: function() {
			
			if(!this.editWindow) {
				this.editWindow = Ext.widget('btEdit');
			}
			
			this.editWindow.down('#btAddress').setValue(BrewTroller.getIPAddress()); //Set currently set IP address into form
			// make sure vessel display options match what is currently shown
			this.editWindow.down('#hltDisplayOption').setValue(!BrewTroller.Vessels[0].display.hidden);
			this.editWindow.down('#mltDisplayOption').setValue(!BrewTroller.Vessels[1].display.hidden); 
			this.editWindow.down('#ketDisplayOption').setValue(!BrewTroller.Vessels[2].display.hidden); 
			// set auto update options to match currently stored values
			this.editWindow.down('#autoUpdate').setValue(BrewTroller.isAutoUpdate());
			this.editWindow.down('#updateFrequency').setValue(BrewTroller.getUpdateFrequency());
			// show the edit window
			this.editWindow.show();
	},
	
	saveBrewTroller: function() {
		
		var hlt = BrewTroller.Vessels[0];
		var mlt = BrewTroller.Vessels[1];
		var ket = BrewTroller.Vessels[2];
		
		editWindow = Ext.ComponentQuery.query('#btEdit')[0];
		
		//Check to see if vessel display options are different than current conditions, if they are set window displays accordingyly
		if (editWindow.down('#hltDisplayOption').value != !(hlt.display.hidden)){	
			if (editWindow.down('#hltDisplayOption').value){
				hlt.display.show();
			} 
			else {
				hlt.display.hide();
			}
		}
		
		if (editWindow.down('#mltDisplayOption').value != !(mlt.hidden)){
			if (editWindow.down('#mltDisplayOption').value){
				mlt.display.show();
			} 
			else {
				mlt.display.hide();
			}
		}
		
		if (editWindow.down('#ketDisplayOption').value != !(ket.hidden)){
			if (editWindow.down('#ketDisplayOption').value){
				ket.display.show();
			} 
			else {
				ket.display.hide();
			}
		}
		
		BrewTroller.setIPAddress(editWindow.down('#btAddress').value);
		
		//set update frequency
		if ( editWindow.down('#updateFrequency').getValue() != BrewTroller.getUpdateFrequency() ){
			BrewTroller.setUpdateFrequency(editWindow.down('#updateFrequency').getValue());
		}
		
		//Start and stop auto updating
		if ( editWindow.down('#autoUpdate').getValue() && !( BrewTroller.isAutoUpdate() ) ) {
			BrewTroller.startAutoUpdate();
		}
		else {
			
			if ( BrewTroller.isAutoUpdate() && !( editWindow.down('#autoUpdate').getValue() ) ){
				BrewTroller.stopAutoUpdate();
			}			
		}
		
		editWindow.hide();		
	},
	
	changeCard: function(button) {
	
		viewPanel = Ext.ComponentQuery.query('#viewPanel')[0];
		viewPanel.getLayout().setActiveItem('card'+[button.action]);
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
	}
	
});
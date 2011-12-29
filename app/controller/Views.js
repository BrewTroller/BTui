Ext.define('BTUI.controller.Views', {
	extend: 'Ext.app.Controller',
	stores: ['Valves'],
	models: ['Valve'],	
	views: ['navPanel', 'viewPanel', 'card.Home', 'card.Recipe', 'card.Logging', 'Valves', 'Vessel', 'vesselSettings', 'btEdit'],
	
	init: function() {
		
		this.control({
			'vesselSettings button[action=save]':{
				click: this.saveVessel
			}
		});
		
		this.control({
			'navPanel button[action=Settings]': {
				click: this.BrewTrollerSettings
			}
		});
		
		this.control({
			'navPanel button': {
				click: this.changeCard
			}
		});
		
			this.control({
				'btEdit button[action=save]': {
					click: this.saveBrewTroller
				}
			});		
		
	},
	
	BrewTrollerSettings: function() {
			
			if(!this.btedit) {
				this.btedit = Ext.widget('btEdit');
			}
			
			this.btedit.down('#btAddress').setValue(BrewTroller.getIPAddress()); //Set currently set IP address into form
			this.btedit.down('#hltDisplayOption').setValue(!Ext.ComponentQuery.query('#0')[0].hidden); 
			this.btedit.down('#mltDisplayOption').setValue(!Ext.ComponentQuery.query('#1')[0].hidden); 
			this.btedit.down('#ketDisplayOption').setValue(!Ext.ComponentQuery.query('#2')[0].hidden); 
			this.btedit.show();
	},
	
	saveBrewTroller: function() {
		
		hlt = Ext.ComponentQuery.query('#0')[0];
		mlt = Ext.ComponentQuery.query('#1')[0];
		ket = Ext.ComponentQuery.query('#2')[0];
		
		editWindow = Ext.ComponentQuery.query('#btEdit')[0];
		
		//Check to see if vessel display options are different than current conditions, if they are set window displays accordingyly
		if (editWindow.down('#hltDisplayOption').value != !(hlt.hidden)){	
			if (editWindow.down('#hltDisplayOption').value){
				hlt.show();
			} 
			else {
				hlt.hide();
			}
		}
		
		if (editWindow.down('#mltDisplayOption').value != !(mlt.hidden)){
			if (editWindow.down('#mltDisplayOption').value){
				mlt.show();
			} 
			else {
				mlt.hide();
			}
		}
		
		if (editWindow.down('#ketDisplayOption').value != !(ket.hidden)){
			if (editWindow.down('#ketDisplayOption').value){
				ket.show();
			} 
			else {
				ket.hide();
			}
		}
		
		BrewTroller.setIPAddress(editWindow.down('#btAddress').value);
		
		Ext.ComponentQuery.query('#btEdit')[0].hide();		
	},
	
	changeCard: function(button) {
	
		viewPanel = Ext.ComponentQuery.query('#viewPanel')[0];
		viewPanel.getLayout().setActiveItem('card'+[button.action]);
	},
	
	saveVessel: function(button, event, options) {
		
		var vesselId = button.ownerCt.ownerCt.id; //get the id of the vessel from the settingsWindow id
		var vessel;
		
		if ( vesselId == '0 Settings' ) {
			vessel = Ext.ComponentQuery.query('#0')[0].me;
		}
		else if ( vesselId == '1 Settings' ) {
			vessel = Ext.ComponentQuery.query('#1')[0].me;
		}
		else if ( vesselId == '2 Settings' ) {
			vessel = Ext.ComponentQuery.query('#2')[0].me;
		}
		
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
	}
	
});
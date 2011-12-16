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
					click: this.saveAddress
				}
			});		
		
	},
	
	BrewTrollerSettings: function() {
		
			console.log("Settings Tool Clicked");
			if(!this.btedit){
			this.btedit = Ext.widget('btEdit');
			this.btedit.down('#btAddress').setValue(BrewTroller.getIPAddress());
			this.btedit.show();
			}
			else{
				this.btedit.down('#btAddress').setValue(BrewTroller.getIPAddress());
				this.btedit.show();
			}
	},
	
	saveAddress: function() {
		
		BrewTroller.setIPAddress(Ext.ComponentQuery.query('#btAddress')[0].getValue());
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
		
		//Enable or disable vessel volume
		if ( vessel.settingsWindow.down('#hasVolume').getValue() != vessel.hasVolumeSensing() ) {
			if ( vessel.settingsWindow.down('#hasVolume').getValue() ) {
				vessel.enableVolume();
			}
			else {
				vessel.disableVolume();
			}
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
		
		vessel.settingsWindow.hide();	//hide the settings window
	}
	
});
//BTUI for BrewTroller Vessel Class

function Vessel(Index) {
	
	//Private Class Variables
	
	var vesselIndex = Index;
	var vesselName;
	
	var hasVolumeSensing = true;	//default to true
	
	var vesselCapacity;
	
	//task for autoUpdate
	var updateTask = {
		run: function(){
			Ext.ComponentQuery.query('#' + vesselIndex)[0].me.updateVessel();
		},
		interval: 5000 //Default update interval set to 5 seconds
	};
	
	var autoUpdate = false;
	
	//command parameter variables
	var getTemp = 'q';
	var getVol = 'p';
	var getHeat = 's';
	var getSetPoint = 't';
	
	var setSetPoint = 'X';
	
	//Vessel Settings Window
	this.settingsWindow;
		
	
	//Public Class Variables
	// The store variables must be public in order for the charts to access them
	
	this.temperatureStore = Ext.create('Ext.data.Store', {
		fields: ['temperature', 'heatStatus'],
		data: [{temperature: 12, heatStatus: 0}]
	});
	
	this.volumeStore = Ext.create('Ext.data.Store', {
		fields: ['volume'],
      data: [{volume: 0.00}]
	});
		
	//Public Class Functions
	
	this.setVesselName = function(name) {
		
		if (!name) {
			switch (vesselIndex){

				case '0':
					vesselName = "HLT";
					break;
				case '1':
					vesselName = "MLT";
					break;
				case '2':
					vesselName = "Kettle";
					break;
			};
		}
		else{
			vesselName = name;
		}
		
	}
	
	this.setVesselIndex = function(index) {
		
		if (index <= 3){
			vesselIndex = index;
		}
		this.setVesselName();
	}
	
	this.enableVolume = function() {
		
		hasVolumeSensing = true;
		Ext.ComponentQuery.query('#' + vesselIndex)[0].down('#volumeBar' + vesselIndex).show();
	}
	
	this.disableVolume = function() {
		
		hasVolumeSensing = false;
		Ext.ComponentQuery.query('#' + vesselIndex)[0].down('#volumeBar' + vesselIndex).hide();
	}
	
	this.hasVolumeSensing = function() {
		
		return hasVolumeSensing;
	}
	
	this.getVesselIndex = function() {
		
		return vesselIndex;
	}
	
	
	this.getVesselName = function(){
	
		return vesselName;
	}
	
	this.isAutoUpdate = function() {
		
		return autoUpdate;
	}
	
	this.getUpdateFrequency = function() {
		
		return updateTask.interval;
	}
	
	this.setUpdateFrequency = function(newInterval) {
		
		//stop the autoupdate task if it is running
		if ( autoUpdate == true ) {
			stopAutoUpdate();
		}
		//set new interval		
		updateTask.interval = newInterval;
		
		//restart the autoupdate task if it was running
		if ( autoUpdate == true ) {
			
			alert('starting auto update');
			startAutoUpdate();
		}
	}
	
	//get the current vessel temperature setpoint
	this.getSetPoint = function() {
		
	}
	
	//Get the Set Volume capactity of the Vessel
	this.getCapacity = function() {
		
		return vesselCapacity;
	}
	
	//Set the Temperature Setpoint for the Vessel
	this.setSetPoint = function(newSetPoint) {
		
		var baseAddress = BrewTroller.getAddress();
		var setPoint = BrewTroller.communicate(baseAddress+setSetPoint+'&'+newSetPoint);		
	}
	
	//Set the temperature range of the Temperature Gauge chart
	this.setTemperatureRange = function(newMin, newMax) {
		
		Ext.ComponentQuery.query('#' + vesselIndex)[0].down('#tempGauge' + vesselIndex).axes.items[0].minimum = newMin;
		Ext.ComponentQuery.query('#' + vesselIndex)[0].down('#tempGauge' + vesselIndex).axes.items[0].maximum = newMax;
		Ext.ComponentQuery.query('#' + vesselIndex)[0].down('#tempGauge' + vesselIndex).redraw();
	}
	
	//Getters for temperature range of Temperature Gauge chart
	this.getTemperatureMaximum = function() {
		
		return Ext.ComponentQuery.query('#' + vesselIndex)[0].down('#tempGauge' + vesselIndex).axes.items[0].maximum;
	}
	
	this.getTemperatureMinimum = function() {
		
		return Ext.ComponentQuery.query('#' + vesselIndex)[0].down('#tempGauge' + vesselIndex).axes.items[0].minimum; 
	}
	
	//Get last temperature reading from store
	this.getTemperature = function() {
		
		return this.temperatureStore.getAt(0).data.temperature;
	}
	
	this.getHeatStatus = function() {
		
		return this.temperatureStore.getAt(0).data.heatStatus;
	}
	
	this.getVolume = function() {
		
		return this.volumeStore.getAt(0).data.volume;
	}
	
	this.settings = function(event, toolEl, panel, tc){
		
		if (!this.settingsWindow){
			this.settingsWindow = Ext.widget('vesselSettings');
			this.settingsWindow.id = this.getVesselIndex() + ' Settings';
		}
			//Make sure that the checkbox values match current variable values
			this.settingsWindow.down('#hasVolume').setValue(hasVolumeSensing);
			this.settingsWindow.down('#autoUpdate').setValue(autoUpdate);
			this.settingsWindow.down('#updateFrequency').setValue(updateTask.interval);
		
			this.settingsWindow.show();
	}
	
	this.updateVessel = function(){
		
		
	if ( BrewTroller.getIPAddress() != undefined) {	
		var baseAddress = BrewTroller.getAddress();
		
		var temperature = BrewTroller.communicate(baseAddress+getTemp+vesselIndex);
		var heatStatus = BrewTroller.communicate(baseAddress+getHeat+vesselIndex);
		
		if (hasVolumeSensing){
		var volume = BrewTroller.communicate(baseAddress+getVol+vesselIndex);
		
		//REMOVE record from volume store and add a new one
		//we have to remove the old one, because the bar chart interprets each record as a seperate bar
		// for future logging capabilities the bar chart class should be modified to use only the first record in the store
		this.volumeStore.removeAt(0);
		this.volumeStore.add({volume: (Number(volume[2])/1000)});
		}
		
		//Insert new record into store containing temperature and heat status
		this.temperatureStore.insert(0, {temperature: (Number(temperature[2])/100), heatStatus: (Number(heatStatus[2]))});
} else{
	alert('You Must Set an IP address for the BrewTroller First!');
};
				
	}
	
	this.manualUpdate = function(){
		
		this.updateVessel();
	}
	
	this.startAutoUpdate = function(){
		
		if ( BrewTroller.getIPAddress() != undefined ) {
		autoUpdate = true;
		
		Ext.TaskManager.start(updateTask);
		} 
		else{
			alert('You Must Set an IP address for the BrewTroller First!');
		};
	}
	
	this.stopAutoUpdate = function(){
		
		Ext.TaskManager.stop(updateTask);
		
		autoUpdate = false;
	}
	
	this.setVesselName();
}

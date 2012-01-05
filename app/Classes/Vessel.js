//BTUI for BrewTroller Vessel Class

function Vessel(Index, displayPanel) {
	
	//Private Class Variables
	
	var vesselIndex = Index;
	var vesselName;
	
	var hasVolumeSensing = true;	//default to true
	
	var vesselCapacity;
	var vesselDeadSpace;
	var volumeTarget = 0;
	var temperatureSetPoint = 0;
	
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
	
	// reference to this Vessel Instance's display panel
	this.display = displayPanel;
	//Vessel Settings Window
	this.settingsWindow;
	//Vessel setpoint window
	this.setPointWindow;
	
	//Public Class Variables
	// The store variables must be public in order for the charts to access them
	
	this.temperatureStore = Ext.create('Ext.data.Store', {
		fields: ['temperature', 'heatStatus'],
		data: [{temperature: 0, heatStatus: 0}]
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
		this.display.down('#volumeBar' + vesselIndex).show();
	}
	
	this.disableVolume = function() {
		
		hasVolumeSensing = false;
		this.display.down('#volumeBar' + vesselIndex).hide();
	}
	
	this.hasVolumeSensing = function() {
		
		return hasVolumeSensing;
	}
	
	this.getVolumeTarget = function() {
		
		return volumeTarget;
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
			this.stopAutoUpdate();
		}
		//set new interval		
		updateTask.interval = newInterval;
		
		//restart the autoupdate task if it was running
		if ( autoUpdate == true ) {
			
			alert('starting auto update');
			this.startAutoUpdate();
		}
	}
	
	//get the current vessel temperature setpoint
	this.getSetPoint = function() {
		
		return temperatureSetPoint;
	}
	
	//Get the Set Volume capactity of the Vessel
	this.getCapacity = function() {
		
		return vesselCapacity;
	};
	
	//opens a window to change setpoint value in
	this.changeSetPoint = function() {
				
		if (!this.setPointWindow) {
			this.setPointWindow = Ext.widget('setPointEdit');
			this.setPointWindow.vessel = this;
			this.setPointWindow.down('#setPoint').value = this.getSetPoint();
		};
		this.setPointWindow.show();
	};
	
	//Set the setpoint value, used only when setting the app's stored value to synchronize with the BT
	this.setSetPoint = function(setPoint) {
		
		temperatureSetPoint = setPoint;
		this.display.down('#tempDisplay' + vesselIndex).setText(temperatureSetPoint + String.fromCharCode(186));
	}
	
	//Set a new Temperature Setpoint for the Vessel, and update the value to the BT
	this.setNewSetPoint = function(newSetPoint) {
		
		var callback = function(args, xhr){
		}
		
		BrewTroller.communicate(BrewTroller.getAddress()+setSetPoint+vesselIndex+'&'+newSetPoint, callback, vesselIndex);
		temperatureSetPoint = newSetPoint;
		this.display.down('#tempDisplay' + vesselIndex).setText(temperatureSetPoint + String.fromCharCode(186));
	}
	
	//Set the temperature range of the Temperature Gauge chart
	this.setTemperatureRange = function(newMin, newMax) {
		
		var tempGauge = this.display.down('#tempGauge' + vesselIndex);
		
		tempGauge.axes.items[0].minimum = newMin;
		tempGauge.axes.items[0].maximum = newMax;
		tempGauge.redraw();
	}
	
	//Getters for temperature range of Temperature Gauge chart
	this.getTemperatureMaximum = function() {
		
		return this.display.down('#tempGauge' + vesselIndex).axes.items[0].maximum;
	}
	
	this.getTemperatureMinimum = function() {
		
		return this.display.down('#tempGauge' + vesselIndex).axes.items[0].minimum;
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
			this.settingsWindow.vessel = this;
		}
			//Make sure that the checkbox values match current variable values
			this.settingsWindow.down('#hasVolume').setValue(hasVolumeSensing);
			this.settingsWindow.down('#autoUpdate').setValue(autoUpdate);
			this.settingsWindow.down('#updateFrequency').setValue(updateTask.interval);
		
			this.settingsWindow.show();
	};
	
	this.saveSettings = function() {
		
		this.settingsWindow.hide();	//hide the settings window before making any modifications to ensure that it does hide the first time the save button is pressed
		
		//Enable or disable vessel volume
		if (this.settingsWindow.down('#hasVolume').getValue() != this.hasVolumeSensing()) {
			if (this.settingsWindow.down('#hasVolume').getValue()) {
				this.enableVolume();
			}
			else {
				this.disableVolume();
			}
		}
		
		//Set temperature gauge range
		if (this.settingsWindow.down('#temperatureMinimum').getValue() != this.getTemperatureMinimum() || this.settingsWindow.down('#temperatureMaximum').getValue() != this.getTemperatureMaximum){
			this.setTemperatureRange(this.settingsWindow.down('#temperatureMinimum').getValue(), this.settingsWindow.down('#temperatureMaximum').getValue());
		}
		
		//set update frequency
		if (this.settingsWindow.down('#updateFrequency').getValue() != this.getUpdateFrequency()){
			this.setUpdateFrequency(this.settingsWindow.down('#updateFrequency').getValue());
		}
		
		//Start and stop auto updating
		if (this.settingsWindow.down('#autoUpdate').getValue() && !(this.isAutoUpdate()) ) {
			this.startAutoUpdate();
		}
		else {
			
			if (this.isAutoUpdate() && !(this.settingsWindow.down('#autoUpdate').getValue() ) ){
				this.stopAutoUpdate();
			}			
		}
		
	};
	
	this.updateVessel = function(){
		
		
	if ( BrewTroller.getIPAddress() != undefined) {	
		var baseAddress = BrewTroller.getAddress();
		
		var tempCallback = function(vesselIndex, xhr) {
			if(xhr.readyState == 4){
				var temperature = JSON.parse(xhr.responseText);
				if ( (temperature[2]/100) > 300 ){
					temperature[2] = 0;	//A fix for erroneous readings coming back from BT. When no sensor is connected it likes to return values of 4.2B
				}
				var temp = temperature[2]/100;
				BrewTroller.Vessels[vesselIndex].temperatureStore.insert(0, {temperature: (Number(temperature[2])/100), heatStatus: 0});
			}
		}
		
		var heatCallback = function(vesselIndex, xhr) {
			if (xhr.readyState == 4){
				var heat = JSON.parse(xhr.responseText);
				BrewTroller.Vessels[vesselIndex].temperatureStore.getAt(0).data.heatStatus = Number(heat[2]);
			}
		}
		
		BrewTroller.communicate(baseAddress+getHeat+vesselIndex, heatCallback, vesselIndex);
		BrewTroller.communicate(baseAddress+getTemp+vesselIndex, tempCallback, vesselIndex);

		var setPointCallback = function(vesselIndex, xhr){
			
			var resp = JSON.parse(xhr.responseText);
			BrewTroller.Vessels[vesselIndex].setSetPoint(resp[2])
		}
		
		BrewTroller.communicate(BrewTroller.getAddress()+getSetPoint+vesselIndex, setPointCallback, vesselIndex);

		
		if (hasVolumeSensing){
			
			var volumeCallback = function(vesselIndex, xhr){
				if (xhr.readyState == 4){
					var volume = JSON.parse(xhr.responseText);
					var store = BrewTroller.Vessels[vesselIndex].volumeStore;
					//REMOVE record from volume store and add a new one
					//we have to remove the old one, because the bar chart interprets each record as a seperate bar
					// for future logging capabilities the bar chart class should be modified to use only the first record in the store
					store.removeAt(0);
					store.add({volume: (Number(volume[2])/1000)});
				}
			}
			
		 BrewTroller.communicate(baseAddress+getVol+vesselIndex, volumeCallback, vesselIndex);
		}
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
	},
	
	this.setVesselName();
	
}

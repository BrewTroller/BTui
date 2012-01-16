//BTUI for BrewTroller Vessel Class

function Vessel(Index) {
	
	//Private Class Variables
	
	var vesselIndex = Index;
	var vesselName;
	
	var visible = true;
	
	var hasVolumeSensing = true;	//default to true
	
	var vesselCapacity;
	var vesselDeadSpace;
	var volumeTarget = 0;
	var temperatureSetPoint = 0;
	
	//task for autoUpdate
	var updateTask = {
		run: function(){
			BrewTroller.Vessels[vesselIndex].updateVessel();
		},
		interval: 5000 //Default update interval set to 5 seconds
	};
	
	var autoUpdate = false;
	var updateID;
	
	//command parameter variables
	var getTemp = 'q';
	var getVol = 'p';
	var getHeat = 's';
	var getSetPoint = 't';
	
	var setSetPoint = 'X';
	
	// reference to this Vessel Instance's display wrapper div
	this.display;
	//referneces to this Vessel instance's parameter displays
	this.tempDisplay;
	this.tempTargetDisplay;
	this.heatDisplay;
	this.volumeDisplay;
	this.volumeTargetDisplay;
	

	//Public Class Functions
	
	//Method used to set the name of the vessel
	this.setVesselName = function(name) {
		
		if (!name) {
			switch (vesselIndex){

				case 0:
					vesselName = "HLT";
					break;
				case 1:
					vesselName = "MLT";
					break;
				case 2:
					vesselName = "KET";
					break;
			};
		}
		else{
			vesselName = name;
		}
		
	};
	
	//Method used to set the index of a vessel
	this.setVesselIndex = function(index) {
		
		if (index <= 3){
			vesselIndex = index;
		}
		this.setVesselName();
	};	
	
	//Method that hides this vessel's display wrapper from the viewport
	this.hide = function() {
		this.display.style.display = "none";
		visible = false;
	};
	//Method that shows this vessel's display wrapper in the viewport
	this.show = function() {
		this.display.style.removeProperty('display');
		visible = true;
	};
	
	//Method returns the set target volume
	this.getVolumeTarget = function() {
		
		return volumeTarget;
	}
	
	//Method returns the index of the vessel instance
	this.getVesselIndex = function() {
		
		return vesselIndex;
	}
	
	//method returns the name of the vessel
	this.getVesselName = function(){
	
		return vesselName;
	}
	
	//Method returns true if the vessel's display panel is visible and false otherwise
	this.isVisible = function() {
		
		return visible;
	}
	
	//method returns true if the vessel is currently auto-updating and false otherwise
	this.isAutoUpdate = function() {
		
		return autoUpdate;
	}
	
	//method returns the set frequency of the auto update task
	this.getUpdateFrequency = function() {
		
		return updateTask.interval;
	}
	
	//method used to set the interval at which the vessel should auto-update in milliseconds
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
	
	//sets the value for the setpoint window and then calls BTUI.viewPort.showTempSetPoint() to show it
	this.changeSetPoint = function() {
		
		//Get references to the set point window and the form and title element
		var setPointWindow = document.getElementById('tempSetPointEdit');
		var setPointTitle = document.getElementById('tempSetPointTitle');		
		var setPointForm = document.getElementById('tempSetPoint');
		
		//Set the form values to match the current values
		setPointForm.value = temperatureSetPoint;
		//Set the title to match the vessel name
		setPointTitle.firstElementChild.textContent = vesselName + " Temp Set Point";
		//Set the window's data-vessel-index attribute to this vessel's
		setPointWindow.dataset.vesselIndex = vesselIndex;
		//Show the window
		BTUI.viewPort.showTempSetPoint();				
	};
	
	//Set the setpoint value, used only when setting the app's stored value to synchronize with the BT
	this.setSetPoint = function(setPoint) {
		
		temperatureSetPoint = setPoint;
		this.tempTargetDisplay.textContent = temperatureSetPoint + String.fromCharCode(186);
	}
	
	//Set a new Temperature Setpoint for the Vessel, and update the value to the BT
	this.setNewSetPoint = function(newSetPoint) {
		
		var callback = function(args, xhr){
		}
		
		BrewTroller.communicate(BrewTroller.getAddress()+setSetPoint+vesselIndex+'&'+newSetPoint, callback, vesselIndex);
		temperatureSetPoint = newSetPoint;
		this.tempTargetDisplay.textContent = temperatureSetPoint + String.fromCharCode(186);
	}
	
	//Set the temperature range of the Temperature Gauge chart
	this.setTemperatureRange = function(newMin, newMax) {
		
		var tempGauge = this.display.down('#tempGauge' + vesselIndex);
		
		tempGauge.axes.items[0].minimum = newMin;
		tempGauge.axes.items[0].maximum = newMax;
		tempGauge.redraw();
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
	
	this.settings = function(){
		
		//Get References to the setting option elements
		var settingsWindow = document.getElementById('vesselSettings');
		var update = document.getElementById('vesselAutoUpdate');
		var updateFreq = document.getElementById('vesselUpdateFrequency');
		var settingsTitle = document.getElementById('vesselSettingsTitle');
		
		//Set the window's title to reflect the selected vessel
		settingsTitle.firstElementChild.textContent = vesselName + ' Settings';
		
		//Set the auto update options to match current values
		update.checked = autoUpdate;
		updateFreq.value = updateTask.interval;
		
		//Set the settings window's data-vessel-index attribute to this vessel's index
		settingsWindow.dataset.vesselIndex = vesselIndex;
		
		//Show the vessel settings window
		BTUI.viewPort.showVesselSettings();		
	};
	
	this.saveSettings = function() {
		
		var update = document.getElementById('vesselAutoUpdate').checked;
		var updateFreq = document.getElementById('vesselUpdateFrequency').value;				
		
		//set update frequency
		if (updateFreq != this.getUpdateFrequency()){
			this.setUpdateFrequency(updateFreq);
		}
		
		//Start and stop auto updating
		if (update && !(this.isAutoUpdate()) ) {
			this.startAutoUpdate();
		}
		else {
			
			if (this.isAutoUpdate() && !(update)){
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
				BrewTroller.Vessels[vesselIndex].tempDisplay.textContent = temp + String.fromCharCode(186);
			}
		}
		
		var heatCallback = function(vesselIndex, xhr) {
			if (xhr.readyState == 4){
				var heat = JSON.parse(xhr.responseText);
				BrewTroller.Vessels[vesselIndex].heatDisplay.textContent = heat[2]+ String.fromCharCode(37);
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
					BrewTroller.Vessels[vesselIndex].volumeDisplay.textContent = volume[2]/1000 +'G';
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
		
		updateID = setInterval(updateTask.run, updateTask.interval);
		} 
		else{
			alert('You Must Set an IP address for the BrewTroller First!');
		};
	}
	
	this.stopAutoUpdate = function(){
		
		clearInterval(updateID);
		
		autoUpdate = false;
		updateID = undefined;
	};
	
	this.initSetup = function() {
		
		//get reference to the display panel wrapper
		this.display = document.getElementById(vesselName + 'Wrapper');
		//get references to display parameters
		this.tempDisplay = this.display.getElementsByClassName('temp')[0].getElementsByClassName('data')[0];
		this.tempTargetDisplay = this.display.getElementsByClassName('tempTarget')[0].getElementsByClassName('data')[0];
		this.heatDisplay = this.display.getElementsByClassName('heat')[0].getElementsByClassName('data')[0];
		this.volumeDisplay = this.display.getElementsByClassName('volume')[0].getElementsByClassName('data')[0];
		this.volumeTargetDisplay = this.display.getElementsByClassName('volTarget')[0].getElementsByClassName('data')[0];
		
		//Ensure the visibility option matches the current state
		document.getElementById(vesselName.toLowerCase()+'Disp').checked = visible;
		
		//Link the settings and refresh buttons with this instance
		this.display.getElementsByClassName('update')[0].onclick = function(){BrewTroller.Vessels[vesselIndex].manualUpdate();};
		this.display.getElementsByClassName('settings')[0].onclick =function(){BrewTroller.Vessels[vesselIndex].settings();};
		this.display.getElementsByClassName('tempset')[0].onclick = function(){BrewTroller.Vessels[vesselIndex].changeSetPoint();};
	};
	
	this.setVesselName();
	
}

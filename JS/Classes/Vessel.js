//BTUI for BrewTroller Vessel Class

function vesselDataPoint(){
 this.timeStamp = undefined;
 this.temperature = undefined;
 this.targetTemperature = undefined;
 this.heatStatus = undefined;
 this.volume = undefined;
 this.targetVolume = undefined; 
}

function Vessel(Index) {
	
	//Private Class Variables
	
	//Vessel IDs
	var vesselIndex = Index;
	var vesselName;
	
	//indicates if the vessel has volume sensing implemented
	var hasVolumeSensing = true;	//default to true
	
	//Data arrray
	var data = new Array();
	
	//vessel volume parameters
	var currentVolume = [];
	var targetVolume = [];
	var vesselCapacity;
	var vesselDeadSpace;
	var volumeconfigs = new Array(10);
	
	//vessel output parameters
	var PIDMode;
	var PIDCycle;
	var PIDGainP;
	var PIDGainI;
	var PIDGainD;
	var hysteresis;
	
	//vessel temperature parameters
	var currentTemperature = [];
	var temperatureSetPoint = [];
	var heatStatus = [];
	var tempSensorAddress = new Array(8);
	
	//Variable to track the number of active data requests, to prevent overflowing the number of open requests on the module
	var activeUpdateRequests = 0;
	//BrewTroller command parameter variables
	var getTemp = 'q';
	var getVol = 'p';
	var getHeat = 's';
	var getSetPoint = 't';
	var setSetPoint = 'X';
	var getOutput = 'D';
	var setOutput = 'N';	
	var getVolumeSettings = 'H';
	var getTargetVolume = "|";
	var setTargetVolume = "{";

	//Public Class Functions
	
	//Method used to set the index of a vessel
	this.setVesselIndex = function(index) {
		
		if (index <= 3){
			vesselIndex = index;
		}		
		this.setVesselName();
	};	
	
	//Method returns the set target volume
	this.getVolumeTarget = function() {
		return volumeTarget;
	};
	
	//Method returns the index of the vessel instance
	this.getVesselIndex = function() {
		return vesselIndex;
	};
	
	//method returns the name of the vessel
	this.getVesselName = function(){
		return vesselName;
	};
	
	this.getTemperature = function(){
		return data[data.length-1].temperature ? data[data.length-1].temperature : 0;
	};
	
	this.getVolume = function(){
		return data[data.length-1].volume ? data[data.length-1].volume : 0;
	};
	
	this.getHeatStatus = function(){
		return data[data.length-1].heatStatus ? data[data.length-1].heatStatus : 0;
	};
	
	//get the current vessel temperature setpoint
	this.getSetPoint = function() {
		if (vesselName == 'kettle') return BrewTroller.getBoilTemperature();
		return data[data.length-1].targetTemperature ? data[data.length-1].targetTemperature : 0;
	};
	
	this.getTargetTemperature = function(){
		return this.getSetPoint();
	};
	
	this.getTargetVolume = function(){
		return data[data.length-1].targetVolume ? data[data.length-1].targetVolume : 0;
	}
	
	//Get the Set Volume capactity of the Vessel
	this.getCapacity = function() {
		return vesselCapacity;
	};
	
	this.getLoggedTemperature = function(start, end, res){
	  var matchedData = [];
	  for (var i = 0; i < data.length; i++){
	    if (data[i].timeStamp >= start && data[i].timeStamp <= end) matchedData.push(data[i].temperature);
	    if (data[i].timeStamp > end) break;
	  }
	   var filteredData = [];
  	  if (res == 0.75){
  	    for (var i = 0; i < matchedData.length; i++){
    	    if (((i+1)*3)%4 != 0)filteredData.push(matchedData[i]);
    	  }
  	  } else {
  	    for (var i = 0; i < matchedData.length; i++){
    	    if ((i+1)%res == 0)filteredData.push(matchedData[i]);
    	  }
      }
      filteredData.forEach(loggedDudDataHandler);
      return filteredData;
	};
	
	this.getLoggedTargetTemperature = function(start, end, res){
	  var matchedData = [];
	  for (var i = 0; i < data.length; i++){
	    if (data[i].timeStamp >= start && data[i].timeStamp <= end) matchedData.push(data[i].targetTemperature);
	    if (data[i].timeStamp > end) break;
	  }
	   var filteredData = [];
  	  if (res == 0.75){
  	    for (var i = 0; i < matchedData.length; i++){
    	    if (((i+1)*3)%4 != 0)filteredData.push(matchedData[i]);
    	  }
  	  } else {
  	    for (var i = 0; i < matchedData.length; i++){
    	    if ((i+1)%res == 0)filteredData.push(matchedData[i]);
    	  }
      }
      filteredData.forEach(loggedDudDataHandler);
      return filteredData;
	};
	
	this.getLoggedHeatStatus = function(start, end, res){
	  var matchedData = [];
	  for (var i = 0; i < data.length; i++){
	    if (data[i].timeStamp >= start && data[i].timeStamp <= end) matchedData.push(data[i].heatStatus);
	    if (data[i].timeStamp > end) break;
	  }
	   var filteredData = [];
  	  if (res == 0.75){
  	    for (var i = 0; i < matchedData.length; i++){
    	    if (((i+1)*3)%4 != 0)filteredData.push(matchedData[i]);
    	  }
  	  } else {
  	    for (var i = 0; i < matchedData.length; i++){
    	    if ((i+1)%res == 0)filteredData.push(matchedData[i]);
    	  }
      }
      filteredData.forEach(loggedDudDataHandler);
      return filteredData;
	};
	
	this.getLoggedVolume = function(start, end, res){
	  var matchedData = [];
	  for (var i = 0; i < data.length; i++){
	    if (data[i].timeStamp >= start && data[i].timeStamp <= end) matchedData.push(data[i].volume);
	    if (data[i].timeStamp > end) break;
	  }
	   var filteredData = [];
  	  if (res == 0.75){
  	    for (var i = 0; i < matchedData.length; i++){
    	    if (((i+1)*3)%4 != 0)filteredData.push(matchedData[i]);
    	  }
  	  } else {
  	    for (var i = 0; i < matchedData.length; i++){
    	    if ((i+1)%res == 0)filteredData.push(matchedData[i]);
    	  }
      }
      filteredData.forEach(loggedDudDataHandler);
      return filteredData;
	};
	
	this.getLoggedTargetVolume = function(start, end, res){
	  var matchedData = [];
	  for (var i = 0; i < data.length; i++){
	    if (data[i].timeStamp >= start && data[i].timeStamp <= end) matchedData.push(data[i].targetVolume);
	    if (data[i].timeStamp > end) break;
	  }
	  var filteredData = [];
	  if (res == 0.75){
	    for (var i = 0; i < matchedData.length; i++){
  	    if ((i*3)%4 != 0)filteredData.push(matchedData[i]);
  	  }
	  } else {
	    for (var i = 0; i < matchedData.length; i++){
  	    if (i%res == 0)filteredData.push(matchedData[i]);
  	  }
    }
    filteredData.forEach(loggedDudDataHandler);
    return filteredData;
	};
	
	//Method to enable or disable PID Mode, option argument is a BOOL
	this.setPIDMode = function(option) {
			PIDMode = option;
	};
	
	this.setNewPIDMode = function(option){
	  PIDMode = option;
		BrewTroller.communicate(BrewTroller.getAddress() + setOutput + vesselIndex + '&' + Number(PIDMode) + '&' + (PIDCycle*10) + '&' + PIDGainP + '&' + PIDGainI + '&' + PIDGainD + '&' + (hysteresis*10) + '&0&0', function(){});
	}
	
	this.getPIDMode = function() {
	  return PIDMode;
	};
	
	//Method to Set the PID Cycle Time
	this.setPIDCycle = function(cycleTime) {
	  PIDCycle = cycleTime;
	};
	
	this.setNewPIDCycle = function(cycleTime) {
	  PIDCycle = cycleTime;
		BrewTroller.communicate(BrewTroller.getAddress() + setOutput + vesselIndex + '&' + Number(PIDMode) + '&' + (PIDCycle*10) + '&' + PIDGainP + '&' + PIDGainI + '&' + PIDGainD + '&' + (hysteresis*10) + '&0&0', function(){});
	}

	this.getPIDCycle = function() {
			return PIDCycle;
	};
	
	//Method to set the PID P Gain
	this.setPIDPGain = function(newValue) {
		PIDGainP = newValue;
	};
	
	this.setNewPIDPGain = function(newValue) {
	  PIDGainP = newValue;
		BrewTroller.communicate(BrewTroller.getAddress() + setOutput + vesselIndex + '&' + Number(PIDMode) + '&' + (PIDCycle*10) + '&' + PIDGainP + '&' + PIDGainI + '&' + PIDGainD + '&' + (hysteresis*10) + '&0&0', function(){});
	};
	
	this.getPIDPGain = function() {	
		return PIDGainP;
	};
	
	//Method to set the PID I Gain
	this.setPIDIGain = function(newValue) {
		PIDGainI = newValue;
	};
	
	this.setNewPIDIGain = function(newValue) {
	  PIDGainI = newValue;
		BrewTroller.communicate(BrewTroller.getAddress() + setOutput + vesselIndex + '&' + Number(PIDMode) + '&' + (PIDCycle*10) + '&' + PIDGainP + '&' + PIDGainI + '&' + PIDGainD + '&' + (hysteresis*10) + '&0&0', function(){});
	};
	
	this.getPIDIGain = function() {
		return PIDGainI;
	};
	
	//Method to set the PID D Gain
	this.setPIDDGain = function(newValue) {	
		PIDGainD = newValue;
	};
	
	this.setNewPIDDGain = function(newValue) {
	  PIDGainD = newValue;
		BrewTroller.communicate(BrewTroller.getAddress() + setOutput + vesselIndex + '&' + Number(PIDMode) + '&' + (PIDCycle*10) + '&' + PIDGainP + '&' + PIDGainI + '&' + PIDGainD + '&' + (hysteresis*10) + '&0&0', function(){});
	};
	
	this.getPIDDGain = function() {	
		return PIDGainD;
	};
	
	//Method to set the ON/OFF hysteresis value	
	this.setHysteresis = function(newValue) {	
		hysteresis = newValue;
	};
	
	this.setNewHysteresis = function(newValue){
	  hysteresis = newValue;
		BrewTroller.communicate(BrewTroller.getAddress() + setOutput + vesselIndex + '&' + Number(PIDMode) + '&' + (PIDCycle*10) + '&' + PIDGainP + '&' + PIDGainI + '&' + PIDGainD + '&' + (hysteresis*10) + '&0&0', function(){});
	};
	
	this.getHysteresis = function() {	
		return hysteresis;
	};
	
	this.setNewOutputValue = function(param, value){
	  switch(param){
	    case 'pGain':
	      this.setNewPIDPGain(value);
	      break;
	    case 'iGain':
	      this.setNewPIDIGain(value);
	      break;
	    case 'dGain':
	      this.setNewPIDDGain(value);
	      break;
	    case 'cycleTime':
	      this.setNewPIDCycle(value);
	      break;
	    case 'hysteresis':
	      this.setNewHysteresis(value);
	      break;
	  }
	};
	
	//Set the setpoint value, used when setting the app's stored value
	this.setSetPoint = function(setPoint) {
		//temperatureSetPoint = setPoint;
		data[data.length-1].targetTemperature = setPoint;
		--activeUpdateRequests;
		BTUI.viewPort.updateVesselTargetTemperatureDisplay(vesselName);
	};
	
	//Set a new Temperature Setpoint for the Vessel, and update the value to the BT
	this.setNewSetPoint = function(newSetPoint) {
		
		if (vesselName == 'kettle'){
			BrewTroller.setNewBoilTemperature(newSetPoint);
			return;
		}
		teperatureSetPoint = newSetPoint;
		BrewTroller.communicate(BrewTroller.getAddress()+setSetPoint+vesselIndex+'&'+newSetPoint, function(){}, vesselName);
	};
	
	this.setTemperature = function(newTemperature) {
		//currentTemperature = newTemperature;
		data[data.length-1].temperature = newTemperature;
		--activeUpdateRequests;
		BTUI.viewPort.updateVesselTemperatureDisplay(vesselName);
	};
	
	this.setVolume = function(newVolume) {
		//currentVolume = newVolume;
		data[data.length-1].volume = newVolume;
		--activeUpdateRequests;
		BTUI.viewPort.updateVesselVolumeDisplay(vesselName);
	};
	
	this.setTargetVolume = function(newTargetVolume){
		//targetVolume = newTargetVolume;
		data[data.length-1].targetVolume = newTargetVolume;
		--activeUpdateRequests;
		BTUI.viewPort.updateVesselTargetVolumeDisplay(vesselName);
	};
	
	this.setNewTargetVolume = function(newTargetVolume){
		targetVolume = newTargetVolume;
		BrewTroller.communicate(BrewTroller.getAddress() + setTargetVolume + vesselIndex +'&'+ (newTargetVolume*1000), function(){}, vesselName);
	};
	
	this.setHeatStatus = function(newStatus) {
		//heatStatus = newStatus;
		data[data.length-1].heatStatus = newStatus;
		--activeUpdateRequests;
		BTUI.viewPort.updateVesselHeatStatusDisplay(vesselName);
	};
	
	this.setCapacity = function(newCapacity){
		vesselCapacity = newCapacity;
		BTUI.viewPort.updateVesselCapacity(vesselName);
	};
	
	this.setDeadSpace = function(newDeadSpace){
		vesselDeadSpace = newDeadSpace;
	}
	
	this.update = function(timeStamp){
			
		if (BrewTroller.getIPAddress() != undefined && activeUpdateRequests == 0) {	
		  
			var baseAddress = BrewTroller.getAddress();
		  activeUpdateRequests = activeUpdateRequests + 5;
		  var dataPoint = new vesselDataPoint();
		  if (!timeStamp){
		    var time = new Date()
		    dataPoint.timeStamp = time.getTime();
	    } else dataPoint.timeStamp = timeStamp;
		  data.push(dataPoint);
		
			var tempCallback = function(vesselName, xhr) {
					var temperature = JSON.parse(xhr.responseText);
					if ( (temperature[1]/100) > 300 ) temperature[1] = 0;	//A fix for erroneous readings coming back from BT. When no sensor is connected it likes to return values of 4.2B
					var temp = temperature[1]/100;
					BrewTroller.getVesselWithString(vesselName).setTemperature(temp); 
			};
		
			var heatCallback = function(vesselName, xhr) {
				var heat = JSON.parse(xhr.responseText);
				BrewTroller.getVesselWithString(vesselName).setHeatStatus(Number(heat[1]));
			};
		
			BrewTroller.communicate(baseAddress+getHeat+vesselIndex, heatCallback, vesselName);
			BrewTroller.communicate(baseAddress+getTemp+vesselIndex, tempCallback, vesselName);

			var setPointCallback = function(vesselName, xhr){	
				var resp = JSON.parse(xhr.responseText);
				BrewTroller.getVesselWithString(vesselName).setSetPoint(Number(resp[1]));
			};
			BrewTroller.communicate(baseAddress+getSetPoint+vesselIndex, setPointCallback, vesselName);
			
			var volumeCallback = function(vesselName, xhr){
				var resp = JSON.parse(xhr.responseText);
				BrewTroller.getVesselWithString(vesselName).setVolume(resp[1]/1000);
			};
		 	BrewTroller.communicate(baseAddress+getVol+vesselIndex, volumeCallback, vesselName);
			
			var targetVolCallback = function(vesselName, xhr){
				var resp = JSON.parse(xhr.responseText);
				BrewTroller.getVesselWithString(vesselName).setTargetVolume(resp[1]/1000);
			};
			BrewTroller.communicate(baseAddress+getTargetVolume+vesselIndex, targetVolCallback, vesselName);
		}
	};
	
	this.isUpdating = function(){
	  return (activeUpdateRequests != 0);
	};
	
	this.initSetup = function() {
	};
	
	//Method called on initial synchronization with BrewTroller, here we pull down options like heat ouput settings, temp sensor addresses
	this.initSync = function() {
		var outputCallback = function(vesselName, xhr){
			var resp = JSON.parse(xhr.responseText);
			var vessel = BrewTroller.getVesselWithString(vesselName);
			vessel.setPIDMode(Boolean(Number(resp[1]))); //We must first typecast this as a number then a BOOL, as it is parsed as a string
			vessel.setPIDCycle(Number(resp[2])/10);
			vessel.setPIDPGain(Number(resp[3]));
			vessel.setPIDIGain(Number(resp[4]));
			vessel.setPIDDGain(Number(resp[5]));
			vessel.setHysteresis(Number(resp[6])/10);
		}
		BrewTroller.communicate(BrewTroller.getAddress() + getOutput + vesselIndex, outputCallback, vesselName);
		
		var volumeSettingsCallback = function(vesselName, xhr){
			var resp = JSON.parse(xhr.responseText);
			var vessel = BrewTroller.getVesselWithString(vesselName);
			vessel.setCapacity(resp[1]/1000);
			vessel.setDeadSpace(resp[2]/1000);
		};
		BrewTroller.communicate(BrewTroller.getAddress() + getVolumeSettings + vesselIndex, volumeSettingsCallback, vesselName);
	};
	
	//Private Class Methods
	//Method used to set the name of the vessel
	var setVesselName = function(name) {
		switch (vesselIndex){
			case 0:
				vesselName = "hlt";
				break;
			case 1:
				vesselName = "mlt";
				break;
			case 2:
				vesselName = "kettle";
				break;
		} 	
	};
	
	var loggedDudDataHandler = function(element, index, array){
    if (isNaN(element) || element == undefined){ //we use the is NaN() function to test for NaN, as regular comparisons do not work, as NaN is equal to nothing, including itself :S
      if (index == (array.length -1) && array.length > 2) array[index] = (array[index-1] + array[index-2])/2;
      else if (index == 0 && array.length > 2) array[index] = (array[index+1] + array[index+2])/2;
      else if (array.length > 2) array[index] = (array[index-1] + array[index+1])/2;
      else if (array.length == 2 && index == 0) array[index] = array[index+1];
      else if (array.length == 2 && index == 1) array[index] = array[index-1];
      if (array[index] == NaN) array[index] = 0;
    }
  };
	
	setVesselName();
	
};

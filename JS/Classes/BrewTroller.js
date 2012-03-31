function BrewTroller() {
		
	//private class variables
	var haveConnection = false;
	
	var BrewTrollerAddress;
	var BrewTrollerVersion;
	var BrewTrollerBuild;
	var useMetric;
	var temperatureUnit;
	var weightUnit;
	var volumeUnit;
	
	var autoUpdate = false;
	var updateId;
	var updateTimes = [];
	
	var boilPower;
	var boilTemp;
	var evapRate;
	
	//task for autoUpdate
	var updateTask = {
		run: function(){
			BrewTroller.update();
		},
		interval: 10000 //Default update interval set to 10 seconds
	};
	
  var programs = {};
  for (var i = 0; i < 20; i++){
    var newP = "p"+i;
    programs[newP] = new Program(i);
  };
	
	var vessels = 
	{
		hlt: new Vessel(0),
		mlt: new Vessel(1),
		kettle: new Vessel(2), 
	};
	
	var valves = new Valve();
		
	//public class methods
	
	this.getVesselWithString = function(vesselString){
		return vessels[vesselString];
	};
	
	this.getVesselWithIndex = function(vesselIndex){
		switch(vesselIndex){
			case 0:
				return vessels.hlt;
				break;
			case 1:
				return vessels.mlt;
				break;
			case 2:
				return vessels.kettle;
				break;
		};
	};
	
	this.valves = function(){
		return valves;
	}
	
	this.getProgram = function(index) {
	  return programs["p"+index];
	};
	
	this.getAddress = function() {
		
		return BrewTrollerAddress+'/btnic.cgi?';
	};
	
	this.getIPAddress = function() {
		
		return BrewTrollerAddress;
	};
	
	this.getVersion = function() {
		
		return BrewTrollerVersion;
	};
	
	this.getBuild = function() {
		
		return BrewTrollerBuild;
	};
	
	this.setVersionNumber = function(version) {
		
		BrewTrollerVersion = version;
	};
	
	this.setBuild = function(build) {
		
		BrewTrollerBuild = build;
	};
	
	this.usesMetric = function() {
		return useMetric;
	};
	
	this.temperatureUnit = function(){
		return temperatureUnit;
	};
	
	this.volumeUnit = function(){
		return volumeUnit;
	};
	
	this.weightUnit = function(){
		return weightUnit;
	};
	
	this.getUpdateTimes = function(){
	  return updateTimes;
	}
	
	//Method to set or unset the use of metric units, value passed is a BOOL
	this.setMetric = function(value) {
		useMetric = value;
		if (useMetric){
			temperatureUnit = 'C';
			volumeUnit = 'L';
			weightUnit = 'KG'; 
		} else {
			temperatureUnit = 'F';
			volumeUnit = 'G';
			weightUnit = 'LBS';
		}
		BTUI.viewPort.updateUnits(); //call the viewport handler to update the units displayed onscreen
	}
	
	this.setVersion = function() {
		
		var versionCallback = function(arg, xhr){
			var resp = JSON.parse(xhr.responseText);
			BrewTroller.setVersionNumber(resp[1]);
			BrewTroller.setBuild(resp[2]);
			
			if (Number(resp[5]) == 0){
				BrewTroller.setMetric(true);
			} else {
				BrewTroller.setMetric(false);
			}
		}
		
		this.communicate(this.getAddress()+'G', versionCallback);
	};

	
	//Method to set the system boil temp
	this.setBoilTemp = function(newValue) {
			boilTemp = newValue;
			BTUI.viewPort.updateVesselTargetTemperatureDisplay('kettle');
	};
	
	this.setNewBoilTemperature = function(newBoilTemp){
		boilTemp = newBoilTemp;
		this.communicate(this.getAddress() + 'K&' + boilTemp, function(){}, null);
	};
	
	this.getBoilTemperature = function(){
		return boilTemp ? boilTemp : 0;
	}
	
	//Method to set the system evap rate
	this.setEvapRate = function(newValue) {
		if (evapRate == undefined) {
			evapRate = newValue;
		} else if (newValue != evapRate){
			evapRate = newValue;
			this.communicate(this.getAddress() + 'M&' + evapRate, function(){}, null);
		}
	};
	
	this.getEvapRate = function() {
		return evapRate;
	};
	
	/*
	//BrewTroller.Communicate(commandAddress, callback, arg)
	//Communicate method is the base method for communicating with the BrewTroller
	//First Paramter is full URL for command EX: http://IPAddress/btnic.cgi?q0
	//Second Parameter is the CallBack function, to be called when a Response is returned from the BrewTroller
	//Third Parameter is any Parameter that needs to be passed into the Callback function
	\\NOTE:As the Communication is done Asynchronously, all handling of the repsonse must be done inside the Callback passed to this method
	*/
	this.communicate = function(commandAddress, callback, arg) {
		
		if ( !BrewTrollerAddress ){	//Ensure there has already been an address set for the BrewTroller
			//alert('You Must configure the IP address of the BrewTroller First!');	//if not alert the User they must set one
		}
		
		else{	// If there is an address set, carry on...
		
			if (!xhr){	//Check to see if there is already an xhr object instantiated
				
				if (window.XMLHttpRequest){	//Check to see if we can use the standard XHR object
					//XHR object for IE7+, FF, Webkit, Opera
					var xhr = new XMLHttpRequest();
				}
				else {	//Fallback for IE5/6 XHR
					//XHR object for IE5/6
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
			}
			xhr.open('GET', commandAddress, true);	//Open the XHR request, using the GET type and the specified commandAddress parameter, and set it as an Asynchronous request
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4){
					callback(arg, xhr);	//run the callback specified
				}
			}
			xhr.send(null);	//Send the request
		}
	};
	
	this.setAddress = function(address) {
	
		if(address.substr(0, 7) != "http://") address = "http://"+address;
		BrewTrollerAddress = address;
		
		this.initSync();
	};

	this.reset = function(level) {
		
		if ( level == 'reboot' ){
			
			var xhr = new XMLHttpRequest;
			xhr.open('GET', this.getAddress()+'c1', true);
			xhr.send(null);
		}
		//Needs to be fixed on BrewTroller End; sending this command cause board to hard lock		
		/*else if ( level == 'reset' ){
			var xhr = new XMLHttpRequest;
			xhr.open('GET', this.getAddress()+'c0', true);
			xhr.send(null);
		}*/
	};

	this.initEEPROM = function() {
		
		var xhr = new XMLHttpRequest;
		xhr.open('GET', this.getAddress()+'I', true);
		xhr.send(null);
	};

	this.initSync = function() {
		this.setVersion();
		for (var property in vessels){
			vessels[property].initSync();
		}
		valves.updateAllConfig();
		this.update();
		
		//pull values for evapRate and boil temp from BT
		var boilTempCallback = function(empty, xhr){
			resp = JSON.parse(xhr.responseText);
			BrewTroller.setBoilTemp(Number(resp[1]));
		};
		
		this.communicate(this.getAddress() + 'A', boilTempCallback, null);
		
		var evapRateCallback = function(empty, xhr){
		  resp = JSON.parse(xhr.responseText);
		  BrewTroller.setEvapRate(Number(resp[1]));
		};
		
		this.communicate(this.getAddress() + 'C', evapRateCallback, null);
		
		for (var property in programs){
		  programs[property].getProgramFromBrewTroller();
		}
	};
	
	this.update = function() {
		
		valves.updateStatus();
		this.updateVessels();
	};
	
	this.updateVessels = function() {
		var updating = (vessels['hlt'].isUpdating() || vessels['mlt'].isUpdating() || vessels['kettle'].isUpdating());
		if (!updating){
		  var time = new Date();
  		updateTimes.push(time.getTime());
  		for (var property in vessels){
  			vessels[property].update(time.getTime());
  		}
	  }
	};
	
	this.startAutoUpdate = function(){
		
		if ( BrewTrollerAddress != undefined ) {
		autoUpdate = true;
		
		updateId = setInterval(updateTask.run, updateTask.interval);
		} 
	};
	
	this.stopAutoUpdate = function(){
		
		clearInterval(updateId);
		
		autoUpdate = false;
		updateId = undefined;
	};
	
	this.isAutoUpdating = function() {
		
		return autoUpdate;
	};
	
	this.getUpdateFrequency = function() {
		
		return updateTask.interval;
	};
	
	this.setUpdateFrequency = function(newInterval) {
		
		var isUpdating;
		//stop the autoupdate task if it is running
		if (autoUpdate) {
			isUpdating = true;
			this.stopAutoUpdate();
		}
		//set new interval		
		updateTask.interval = newInterval*1000;
		
		//restart the autoupdate task if it was running
		if (isUpdating) {
			this.startAutoUpdate();
		}
	};
	
	//Method sends command to BT to scan for temp sensors, and returns the address of the first unassigned sensor as an array of bytes
	this.scanForTempSensor = function(){
		
	};
	
	this.initSetup = function() {
		
		//run initSetup() for each vessel
		for(var property in vessels){
			vessels[property].initSetup();
		}
		//run initSetup() for the valves
		this.valves.initSetup();
 	};
};
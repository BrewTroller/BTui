function BrewTroller() {
		
	//private class variables
	
	var BrewTrollerAddress;
	var BrewTrollerVersion;
	var BrewTrollerBuild;
	var BrewTrollerUpTime;
	
	var autoUpdate = false;
	
	//task for autoUpdate
	var updateTask = {
		run: function(){
			BrewTroller.update();
		},
		interval: 10000 //Default update interval set to 10 seconds
	};
	
	//public class variables
	this.valves = new Valve;
	
	this.Vessels = [];
	this.Vessels[0] = new Vessel(0);
	this.Vessels[1] = new Vessel(1);
	this.Vessels[2] = new Vessel(2);
	
	this.editWindow;
		
	//public class methods
	
	this.saveSettings = function() {
	
		var hlt = this.Vessels[0];
		var mlt = this.Vessels[1];
		var ket = this.Vessels[2];
		
		var address = document.getElementById('btAddress').value;
		
		var hltDisp = document.getElementById('hltDisp').checked;
		var mltDisp = document.getElementById('mltDisp').checked;
		var ketDisp = document.getElementById('ketDisp').checked;
		
		var autoUpdate = document.getElementById('btAutoUpdate').checked;
		var updateFreq = document.getElementById('btUpdateFrequency').value;		
		
		//Check to see if vessel display options are different than current conditions, if they are set window displays accordingyly
		if (hltDisp && (hlt.display.style.display == "none")){	
			hlt.show();
		} 
		else if (!hltDisp && (hlt.display.style.display =! "none")){
			hlt.hide();
		}
		
		if (mltDisp && (mlt.display.style.display == "none")){
			mlt.show();
		} 
		else if (!mltDisp && (mlt.display.style.display =! "none")){
			mlt.hide();
		}
	
		if (ketDisp && (ket.display.style.display == "none")){
			ket.show();
		} 
		else if(!ketDisp && (ket.display.style.display != "none")) {
			ket.hide();
		}
		
		
		BrewTroller.setIPAddress(address);
		
		//set update frequency
		if ( updateFreq != BrewTroller.getUpdateFrequency() ){
			BrewTroller.setUpdateFrequency(updateFreq);
		}
		
		//Start and stop auto updating
		if ( autoUpdate && !(BrewTroller.isAutoUpdate())) {
			BrewTroller.startAutoUpdate();
		}
		else {
			
			if ( BrewTroller.isAutoUpdate() && !(autoUpdate)){
				BrewTroller.stopAutoUpdate();
			}			
		}
			
	};
	
	this.getAddress = function() {
		
		return 'http://'+BrewTrollerAddress+'/btnic.cgi?';
	}
	
	this.getIPAddress = function() {
		
		return BrewTrollerAddress;
	}
	
	this.getVersion = function() {
		
		return BrewTrollerVersion;
	}
	
	this.getBuild = function() {
		
		return BrewTrollerBuild;
	}	
	
	this.setVersionNumber = function(version) {
		
		BrewTrollerVersion = version;
	}
	
	this.setBuild = function(build) {
		
		BrewTrollerBuild = build;
	}
	
	this.setVersion = function() {
		
		var versionCallback = function(arg, xhr){
			var resp = JSON.parse(xhr.responseText);
			BrewTroller.setVersionNumber(resp[2]);
			BrewTroller.setBuild(resp[3]);
		}
		
		this.communicate(this.getAddress()+'G', versionCallback);
	}

	this.setUpTime = function(upTimeInMillis) {
		
		BrewTrollerUpTime = upTimeInMillis;
	}
	
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
			alert('You Must configure the IP address of the BrewTroller First!');	//if not alert the User they must set one
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
					callback(arg, xhr);	//Set up the callback specified
				}
			}
			xhr.send(null);	//Send the request
		}
	};
	
	this.updateVessels = function() {
		
		for ( i = 0; i < this.Vessels.length; i++ ){
			this.Vessels[i].manualUpdate();
		}
	};
	
	this.setIPAddress = function(ipAddress) {
	
		BrewTrollerAddress = ipAddress;
		
		this.initSync();
	}

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
	}
	
	this.initEEPROM = function() {
		
		var xhr = new XMLHttpRequest;
		xhr.open('GET', this.getAddress()+'I', true);
		xhr.send(null);
	}

	this.initSync = function() {
		BrewTroller.setVersion();
		BrewTroller.updateVessels();
		BrewTroller.valves.updateAllConfig();
		BrewTroller.valves.updateStatus();
	}
	
	this.update = function() {
		
		BrewTroller.valves.updateStatus();
	}
	
	this.updateAll = function() {
		
		this.update();
		this.updateVessels();
	},
	
	this.startAutoUpdate = function(){
		
		if ( BrewTrollerAddress != undefined ) {
		autoUpdate = true;
		
		Ext.TaskManager.start(updateTask);
		} 
		else{
			alert('You Must Set an IP address for the BrewTroller First!');
		}
	}
	
	this.stopAutoUpdate = function(){
		
		Ext.TaskManager.stop(updateTask);
		
		autoUpdate = false;
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
	};
	
	this.initSetup = function() {
		
		for( i = 0; i < this.Vessels.length; i++){
			this.Vessels[i].initSetup();
		}
		this.valves.initSetup();
 	};
};
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
	this.editWindow;
		
	//public class methods
	
	this.settings = function() {
		
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
	
	this.saveSettings = function() {
	
		var hlt = this.Vessels[0];
		var mlt = this.Vessels[1];
		var ket = this.Vessels[2];
		var editWindow = this.editWindow;
		
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
	}
	
	this.InitSetup = function() {
		
		this.Vessels = [ Ext.ComponentQuery.query('#0')[0].me, Ext.ComponentQuery.query('#1')[0].me, Ext.ComponentQuery.query('#2')[0].me ];
	}
}
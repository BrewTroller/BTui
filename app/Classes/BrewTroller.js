function BrewTroller() {
		
	//private class variables
	
	var BrewTrollerAddress;
	var BrewTrollerVersion;
	var BrewTrollerBuild;
	var BrewTrollerUpTime;
	
	//public class variables
	this.valves = new Valve;
		
	//public class methods
	
	
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
	}
	
	this.syncVessels = function() {
		
		var vessels = Ext.ComponentQuery.query('Vessel');
		
		for ( i = 0; i < 3; i++ ){
			vessels[i].me.manualUpdate();
		}
	}
	
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

	//Private Class Methods

	this.initSync = function() {
		BrewTroller.setVersion();
		BrewTroller.syncVessels();
		BrewTroller.valves.updateStatus();
	}
	
}
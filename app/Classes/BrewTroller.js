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
	
	this.setVersion = function() {
		
		var resp = this.communicate(this.getAddress()+'G');
		
		BrewTrollerVersion = resp[2];
		BrewTrollerBuild = resp[3];
	}
	
	//Communicate function creates a new XHR request to the url passed as first parameter
	this.communicate = function(commandAddress) {
		
		if ( !BrewTrollerAddress ){
			alert('You Must configure the IP address of the BrewTroller First!');
		}
		
		else{
		
			if (!xhr){
				
				if (window.XMLHttpRequest){
					//XHR object for IE7+, FF, Webkit, Opera
					var xhr = new XMLHttpRequest();
				}
				else {
					//XHR object for IE5/6
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
			}
			xhr.open('GET', commandAddress, false);
			xhr.send(null);

			var resp = JSON.parse(xhr.responseText);

			setUpTime(resp[0]);		

			return resp;
		}
	}
	
	this.setIPAddress = function(ipAddress) {
	
		BrewTrollerAddress = ipAddress;
		
		this.setVersion();
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
	
	var setUpTime = function(upTimeInMillis) {
		
		BrewTrollerUpTime = upTimeInMillis;
	}
	
}
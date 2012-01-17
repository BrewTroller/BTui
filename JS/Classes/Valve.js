function Valve() {
	
	//Private Class Variables
	
	/*Profile data structures
	//	each data index corresponds with the Ext store index and the BrewTroller Valve index
	// data index 0 contains the valve profile name
	// data index 1 contains the valve profile bitmask, used for operations where communication to or from the BrewTroller is done using
	// 	a binary representation of the valve profiles
	*/
	profiles = [
		{name: 'Fill HLT', 			bitMask: 1,			config:0,	active:false},
		{name: 'Fill Mash', 		bitMask: 2,			config:0,	active:false},
		{name: 'Add Grain', 		bitMask: 4,			config:0,	active:false},
		{name: 'Mash Heat', 		bitMask: 8,			config:0,	active:false},
		{name: 'Mash Idle', 		bitMask: 16,		config:0,	active:false},
		{name: 'Sparge In',			bitMask: 32,		config:0,	active:false},
		{name: 'Sparge Out', 		bitMask: 64,		config:0,	active:false},
		{name: 'Boil Additions',	bitMask: 128,		config:0,	active:false},
		{name: 'Kettle Lid', 		bitMask: 256,		config:0,	active:false},
		{name: 'Chiller H2O', 		bitMask: 512,		config:0,	active:false},
		{name: 'Chiller Beer',		bitMask: 1024,		config:0,	active:false},
		{name: 'Boil Recirc', 		bitMask: 2048,		config:0,	active:false},
		{name: 'Drain', 			bitMask: 4096,		config:0,	active:false},
		{name: 'HLT Heat', 			bitMask: 8192,		config:0,	active:false},
		{name: 'HLT Idle', 			bitMask: 16384,		config:0,	active:false},
		{name: 'Kettle Heat', 		bitMask: 32768,		config:0,	active:false},
		{name: 'Kettle Idle', 		bitMask: 65536,		config:0,	active:false},
		{name: 'User 1',			bitMask: 131072,	config:0,	active:false},
		{name: 'User 2',			bitMask: 262144,	config:0,	active:false},
		{name: 'User 3', 			bitMask: 524288,	config:0,	active:false}
	];
	
	//BrewTroller command codes
	var getProfileStatus = 'w';
	var getProfileConfig = 'd';
	var setProfileConfig = "Q";
	var setProfileStatus = 'b';
	
	//References to active and idle containers
	var active;
	var idle;
	
	//Public Class Variables
	
	//Public Class functions
	
	// function takes the index of the profile as an argument, then parses its config flag set, 
	//	and returns it as an array corresponding to each valve
	this.getProfileConfigArray = function(profileIndex) {

		var config = profiles[profileIndex].config;

		var valveArray = [];

		for (i = 0; i < 32; i++){
			mask = 1 << i;
			valveArray[i] = ((config & mask) == mask ? 1 : 0);
		}

		return valveArray;
	};
	
	// function takes the index of a profile as an argument, and returns its raw config data
	this.getProfileConfig = function(profileIndex) {
		
		return profiles[profileIndex].config;
	};
	
	//Method returns the name of the profile matching the index specified
	this.getProfileName = function(profileIndex){
		
		return profiles[profileIndex].name;
	};
	
	//Method sets a new profile config for a profile from an array of flags 32 items long
	this.setProfileConfigFromArray = function(profileIndex, newConfigArray){
		
		var configMask;
		
		for (i = 0; i < 32; i++){
			if (newConfigArray[i]){
				var flag = 1 << i;
				configMask = configMask | flag;
			}
		}
		profiles[profileIndex].config = configMask;
		
		//setup a callback function
		var callback = function(){};
		//Sync the new Config to the BT
		BrewTroller.communicate(BrewTroller.getAddress()+setProfileConfig+profileIndex+'&'+configMask, callback);	
	};
	
	//Method sets as new config for a valve profile, method will not send new config to BT
	this.setProfileConfig = function(profileIndex, newConfig) {
		
		profiles[profileIndex].config = newConfig;
	};
	
	//Method returns true if the valve profile is active, and false otherwise
	this.getProfileStatus = function(profileIndex) {
	
		return getProfile(profile).active;	
	};
	
	//Method returns the DOM element for the requested valve profile
	this.getProfileElement = function(profileIndex) {
		
		return document.querySelectorAll('[data-valve-index="'+profileIndex+'"]')[0];
	}
	
	this.setProfileState = function(profileIndex, state) {
		
		profiles[profileIndex].active = state;
		alert('Still need to setup brewtroller sync for this!');
	};	
	
	//Method updates the state of all profiles from the BT, and calls the updateView() method.
	this.updateStatus = function() {
		
		var callback = function(profiles, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var mask = Number(resp[2]);
			for ( i = 0; i < 20; i++ ) {
				profiles[i].active = Boolean(mask & profiles[i].bitMask); 
			}
			BrewTroller.valves.updateView();
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProfileStatus, callback, profiles); 
	};
	
	//Method checks to ensure the parent container of the profile and the status of the valve match, if not it moves them accordingly
	this.updateView = function() {
		
		for (i = 0; i < 20; i++){
			var target = this.getProfileElement(i);
			if (profiles[i].active && (target.parentNode.id != "active")){
				idle.removeChild(target);
				active.appendChild(target);
			}
			else if ( !profiles[i].active && (target.parentNode.id != "idle")){
				active.removeChild(target);
				idle.appendChild(target);
			}
		}
	};
	
	//Method is called when a valve profile is clicked, and should toggle the appropriate valve profile's state
	this.toggleState = function(profileIndex){
		
		//define the callback function, because the response from the BT is the status code of all profiles we will update them all		
		var callback = function(profiles, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var mask = Number(resp[2]);
			for ( i = 0; i < 20; i++ ) {
				profiles[i].active = Boolean(mask & profiles[i].bitMask); 
			}
			BrewTroller.valves.updateView();
		};
		
		//if the profile is active, we will set it inactive
		if (profiles[profileIndex].active){
			BrewTroller.communicate(BrewTroller.getAddress() + setProfileStatus + '&' + profiles[profileIndex].bitMask + '&0', callback, profiles);
		}
		else{	//else if it is idle we will activate it
			BrewTroller.communicate(BrewTroller.getAddress() + setProfileStatus + '&' + profiles[profileIndex].bitMask + '&1', callback, profiles);
		}
	};
	
	//Method updates the config for all of the profiles from the BT
	this.updateAllConfig = function() {
		
		for ( i = 0; i < 20; i++ ) {
			var callback = function(index, xhr) {
				var resp = JSON.parse(xhr.responseText);
				BrewTroller.valves.setProfileConfig(index, Number(resp[2]));
			}
			BrewTroller.communicate(BrewTroller.getAddress()+getProfileConfig+i, callback, i);
		}
	}
	
	//Initial setup routine, used for getting references to display items
	this.initSetup = function() {
		
		active = document.getElementById('active');
		idle = document.getElementById('idle');
	};
	
	//Private Class functions
};
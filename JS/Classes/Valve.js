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
	
	var getProfileStatus = 'w';
	var getProfileConfig = 'd';
	
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
	
	this.setProfileConfig = function(profileIndex, newConfig) {
		
		profiles[profileIndex].config = newConfig;
	};
	
	this.editProfile = function(profileIndex) {
		
		alert('Come To the Darkside! We have exactly ' + profileIndex + ' Cookies!');
	};
	
	this.getProfileStatus = function(profileIndex) {
	
		return getProfile(profile).active;	
	};
	
	this.setProfileState = function(profileIndex, state) {
		
		profiles[profileIndex].active = state;
		alert('Still need to setup brewtroller sync for this!');
	};	
	
	this.updateStatus = function() {
		
		var callback = function(profiles, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var mask = Number(resp[2]);
			for ( i = 0; i < 20; i++ ) {
				profiles[i].active = Boolean(mask & profiles[i].bitMask); 
			}
			alert('need to add valve view updating here!'); //Update the grid view
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProfileStatus, callback, profiles); 
	};
	
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
		
	};
	
	//Private Class functions
};
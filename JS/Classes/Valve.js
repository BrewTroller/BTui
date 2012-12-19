function Valve() {
	
	//Private Class Variables
	
	/*Profile data structures
	//	each data index corresponds with the Ext store index and the BrewTroller Valve index
	// data index 0 contains the valve profile name
	// data index 1 contains the valve profile bitmask, used for operations where communication to or from the BrewTroller is done using
	// 	a binary representation of the valve profiles
	*/
 var profiles = {
		fillHlt:        {bitMask: 1,			config:0,	active:false, index: 0},
		fillMash:       {bitMask: 2,			config:0,	active:false, index: 1},
		addGrain:       {bitMask: 4,			config:0,	active:false, index: 2},
		mashHeat:       {bitMask: 8,			config:0,	active:false, index: 3},
		mashIdle:       {bitMask: 16,		   config:0,	active:false, index: 4},
		spargeIn:       {bitMask: 32,		   config:0,	active:false, index: 5},
		spargeOut:      {bitMask: 64,		   config:0,	active:false, index: 6},
		boilAdditions:  {bitMask: 128,		config:0,	active:false, index: 7},
		kettleLid:      {bitMask: 256,		config:0,	active:false, index: 8},
		chillerH2o:     {bitMask: 512,		config:0,	active:false, index: 9},
		chillerBeer:    {bitMask: 1024,		config:0,	active:false, index: 10},
		boilRecirc:     {bitMask: 2048,		config:0,	active:false, index: 11},
		drain:          {bitMask: 4096,		config:0,	active:false, index: 12},
		hltHeat:        {bitMask: 8192,		config:0,	active:false, index: 13},
		hltIdle:        {bitMask: 16384,		config:0,	active:false, index: 14},
		kettleHeat:     {bitMask: 32768,		config:0,	active:false, index: 15},
		kettleIdle:     {bitMask: 65536,		config:0,	active:false, index: 16},
		user1:          {bitMask: 131072,	config:0,	active:false, index: 17},
		user2:          {bitMask: 262144,	config:0,	active:false, index: 18},
		user3:          {bitMask: 524288,	config:0,	active:false, index: 19}
	};
	
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
	this.getProfileConfigArray = function(profile) {

		var config = profiles[profile].config;

		var valveArray = [];

		for (i = 0; i < 32; i++){
			mask = 1 << i;
			valveArray[i] = ((config & mask) == mask ? 1 : 0);
		}
		return valveArray;
	};
	
	// function takes the index of a profile as an argument, and returns its raw config data
	this.getProfileConfig = function(profile) {
		return profiles[profile].config;
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
	this.setProfileConfig = function(profile, newConfig) {
		
		profiles[profile].config = newConfig;
	};
	
	//Method returns true if the valve profile is active, and false otherwise
	this.getProfileStatus = function(profile) {
		return profiles[profile].active;	
	};
	
	this.getStatusObject = function() {
		var obj = {};
		for (var property in profiles){
			obj[property] = {};
			obj[property].active = profiles[property].active;
		}
		return obj;		
	};
	
	//Method updates the state of all profiles from the BT, and calls the updateView() method.
	this.updateStatus = function() {
		
		var callback = function(profiles, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var mask = Number(resp[1]);
			for (var property in profiles) {
				profiles[property].active = Boolean(mask & profiles[property].bitMask); 
			}
			BTUI.viewPort.updateValveProfileStatus();
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProfileStatus, callback, profiles); 
	};
	
	//Method is called when a valve profile is clicked, and should toggle the appropriate valve profile's state
	this.toggleState = function(profile){
		
		//define the callback function, because the response from the BT is the status code of all profiles we will update them all		
		var callback = function(profiles, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var mask = Number(resp[1]);
			for (var property in profiles) {
				profiles[property].active = Boolean(mask & profiles[property].bitMask); 
			}
			BTUI.viewPort.updateValveProfileStatus();
		};
		
		//if the profile is active, we will set it inactive
		if (profiles[profile].active){
			BrewTroller.communicate(BrewTroller.getAddress() + setProfileStatus + '&' + profiles[profile].bitMask + '&0', callback, profiles);
		}
		else{	//else if it is idle we will activate it
			BrewTroller.communicate(BrewTroller.getAddress() + setProfileStatus + '&' + profiles[profile].bitMask + '&1', callback, profiles);
		}
	};
	
	//Method updates the config for all of the profiles from the BT
	this.updateAllConfig = function() {
		
		for (var property in profiles) {
			var callback = function(property, xhr) {
				var resp = JSON.parse(xhr.responseText);
				BrewTroller.valves().setProfileConfig(property, Number(resp[1]));
			}
			BrewTroller.communicate(BrewTroller.getAddress()+getProfileConfig+profiles[property].index, callback, property);
		}
	};
	
	//Initial setup routine
	this.initSetup = function() {
		
	};
	
	//Private Class functions
};
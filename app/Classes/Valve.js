function Valve() {
	
	//Private Class Variables
	
	/*Profile data structures
	//	each data index corresponds with the Ext store index and the BrewTroller Valve index
	// data index 0 contains the valve profile name
	// data index 1 contains the valve profile bitmask, used for operations where communication to or from the BrewTroller is done using
	// 	a binary representation of the valve profiles
	*/
	profiles = [
		{name: 'Fill HLT', 			bitMask: 1},
		{name: 'Fill Mash', 			bitMask: 2},
		{name: 'Add Grain', 			bitMask: 4},
		{name: 'Mash Heat', 			bitMask: 8},
		{name: 'Mash Idle', 			bitMask: 16},
		{name: 'Sparge In',			bitMask: 32},
		{name: 'Sparge Out', 		bitMask: 64},
		{name: 'Boil Additions',	bitMask: 128},
		{name: 'Kettle Lid', 		bitMask: 256},
		{name: 'Chiller H2O', 		bitMask: 512},
		{name: 'Chiller Beer',		bitMask: 1024},
		{name: 'Boil Recirc', 		bitMask: 2048},
		{name: 'Drain', 				bitMask: 4096},
		{name: 'HLT Heat', 			bitMask: 8192},
		{name: 'HLT Idle', 			bitMask: 16384},
		{name: 'Kettle Heat', 		bitMask: 32768},
		{name: 'Kettle Idle', 		bitMask: 65536},
		{name: 'User 1',				bitMask: 131072},
		{name: 'User 2',				bitMask: 262144}
	];
	
	//Public Class Variables
	
	//Public Class functions
	this.getProfileConfig = function(profile) {
		
	var index = store.lookup('profile', profile);
	var config = store.getAt(index).data.config;
	
	var valveArray = [];
	
	for (i = 0; i < 32; i++){
		mask = 1 << i;
		valveArray[i] = config & mask;
	}
	
	return valveArray;
	}
	
	this.setProfileConfig = function(profile, newConfig) {
		
		
	}
	
	this.getProfileStatus = function(profile) {
		
	}
	
	this.setProfileActive = function(profile) {
		
	}
	
	this.getProfileStatus = function(profile) {
		
	}	
	
	this.update
	
	//Private Class functions
	
}
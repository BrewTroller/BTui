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
		{name: 'User 2',				bitMask: 262144},
		{name: 'User 3', 				bitMask: 524288}
	];
	
	var getProfileStatus = 'w';
	var getProfileConfig = 'd';
	
	//Public Class Variables
	
	//Public Class functions
	
	// function takes the name of the profile as an argument, and searches the store for it, then parses its config flag set, 
	//	and returns it as an array corresponding to each valve
	this.getProfileConfigArray = function(profile) {

		var store = Ext.StoreManager.lookup('Valves');	
		var index = store.find('profile', profile);
		var config = store.getAt(index).data.config;

		var valveArray = [];

		for (i = 0; i < 32; i++){
			mask = 1 << i;
			valveArray[i] = ((config & mask) == mask ? 1 : 0);
		}

		return valveArray;
	}
	
	// function takes the name of a profile as an argument, seaches the store for it, and returns its raw config data
	this.getProfileConfig = function(profile) {
		
		var store = Ext.StoreManager.lookup('Valves');
		var index = store.find('profile', profile);
		
		return store.getAt(index).data.config;
	}
	
	this.setProfileConfig = function(profile, newConfig) {
		
		
	}
	
	this.editProfile = function(profileIndex) {
		
		alert('Come To the Darkside! We have exactly ' + profileIndex + ' Cookies!');
	};
	
	this.getProfileStatus = function(profile) {
		
	}
	
	this.setProfileActive = function(profile) {
		
	}
	
	this.getProfileStatus = function(profile) {
		
	}	
	
	this.updateStatus = function() {
		
		var callback = function(profiles, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var mask = Number(resp[2]);
			var store = Ext.StoreManager.lookup('Valves');
			for ( i = 0; i < 20; i++ ) {
				var value = Boolean(mask & profiles[i].bitMask);
				store.getAt(i).data.active = Boolean(mask & profiles[i].bitMask)
			}
			Ext.ComponentQuery.query('#Valves')[0].getView().refresh(); //Update the grid view
		}
		BrewTroller.communicate(BrewTroller.getAddress()+getProfileStatus, callback, profiles); 
	}
	
	this.updateAllConfig = function() {
		
		for ( i = 0; i < 20; i++ ) {
			var callback = function(index, xhr) {
				var store = Ext.StoreManager.lookup('Valves');
				var resp = JSON.parse(xhr.responseText);
				store.getAt(index).data.config = Number(resp[2]);
			}
			BrewTroller.communicate(BrewTroller.getAddress()+getProfileConfig+i, callback, i);
		}
	}
	
	this.initSetup = function() {
		
		var rows = Ext.ComponentQuery.query('gridpanel')[0].items.items[0].all.elements;
		
		var clickfunction = function() {
			BrewTroller.valves.editProfile(this.rowIndex);
		};
		
		for (i = 0; i < 20; i++){
			rows[i].onclick = clickfunction;
		};
	};
	
	//Private Class functions
	
}
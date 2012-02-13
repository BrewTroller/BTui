/**
 * @author Eric Yanush
 */
function Program(index){
	
	
	//private class variables representing the recipe's parameters
	var programIndex = index; //index of the program 0-19
	var Title;	//title of recipe, can be maximum of 19 characters
	var batchVolume;	//target batch volume of the recipe, in gallons
	var grainWeight;	//total weight of the recipe's grain bill
	var boilLength;		//length of the boil in minutes
	var mashRatio;		//ratio of the mash, in quarts
	var hltTemperature;	//target temperature for the hlt
	var spargeTemperature;	//target sparge water temperature
	var pitchTemperature;	//target finished wort temperature
	var mashSchedule = {};	//mash schedule -> object of objects {step time in minutes, step temperature}
	var strikeHeatVessel;	//indicates the vessel that the strike water should be heated in, valid values are 0=HLT and 1=MLT
	var boilAdditions ={};		//object of objects indicating intended boil addition schedule
	var grainTemperature;
	
	//private class variables representing this recipe on the BT, and in BeerXML format
	var recipeBeerXMLDoc;
	var brewtrollerProgramIndex;
	
	//private class variables representing the command codes used by the class to communicate with the brewtroller
	var getProgramName = '[';
	var setProgramName = String.fromCharCode(92); //The get program name command '\' must be explicitly cast from a charater code, as literally setting it causes the JS parser to puke
	var getProgramSettings = 'E';
	var setProgramSettings = 'O';
	var getProgramTemperatures = ']';
	var setProgramTemperatures = '^';
	var getProgramTimes = '_';
	var setProgramTimes = '`';
	var getProgramVolumes = 'x';
	
	//properly instantiate mashSchedule and boilAddidion objects
	mashSchedule = {
		doughIn:{step: "Dough In",		time: 0, temperature: 0},
		acidRest:{step: "Acid Rest", 	time: 0, temperature: 0},
		proteinRest:{step: "Protein Rest",	time: 0, temperature: 0},
		sacchRest:{step: "Sacch Rest",	time: 0, temperature: 0},
		sacch2Rest:{step: "Sacch2 Rest",	time: 0, temperature: 0},
		mashOut:{step: "Mash Out",		time: 0, temperature: 0},
	};
	
	 boilAdditions = {
		atboil:{time: "At Boil", state: false, bitmask: 1},
		at105:{time: "105 Min", state: false, bitmask: 2},
		at90:{time: "90 Min",  state: false, bitmask: 4},
		at75:{time: "75 Min",  state: false, bitmask: 8},
		at60:{time: "60 Min",  state: false, bitmask: 16},
		at45:{time: "45 Min",  state: false, bitmask: 32},
		at30:{time: "30 Min",  state: false, bitmask: 64},
		at20:{time: "20 Min",  state: false, bitmask: 128},
		at15:{time: "15 Min",  state: false, bitmask: 256},
		at10:{time: "10 Min",  state: false, bitmask: 512},
		at5:{time: "5 Min",   state: false, bitmask: 1024},
		at0:{time: "0 Min",   state: false, bitmask: 2056}
	};
	
	//public class methods
	
	//methods to set information coming from the BrewTroller, or from BeerXML format
	this.setTitle = function(newTitle) {
		Title = newTitle;
	};
	
	this.getTitle = function() {
		return Title;
	};
	
	this.setTemperatures = function(temperatureArray) {
		
		mashSchedule.doughIn.temperature = Number(temperatureArray[1]);
		mashSchedule.acidRest.temperature = Number(temperatureArray[2]);
		mashSchedule.proteinRest.temperature = Number(temperatureArray[3]);
		mashSchedule.sacchRest.temperature = Number(temperatureArray[4]);
		mashSchedule.sacch2Rest.temperature = Number(temperatureArray[5]);
		mashSchedule.mashOut.temperature = Number(temperatureArray[6]);
	};
	
	this.setTimes = function(timesArray) {
		
		mashSchedule.doughIn.time = Number(timesArray[1]);
		mashSchedule.acidRest.time = Number(timesArray[2]);
		mashSchedule.proteinRest.time = Number(timesArray[3]);
		mashSchedule.sacchRest.time = Number(timesArray[4]);
		mashSchedule.sacch2Rest.time = Number(timesArray[5]);
		mashSchedule.mashOut.time = Number(timesArray[6]);
	};
	
	this.setGlobals = function(settingsArray) {
		
		spargeTemperature = Number(settingsArray[1]);
		hltTemperature = Number(settingsArray[2]);
		boilLength = Number(settingsArray[3]);
		pitchTemperature = Number(settingsArray[4]);
		boilAddBitMask = Number(settingsArray[5]);
		strikeHeatVessel = Number(settingsArray[6]);
		
		boilAdditions.atboil.state = Boolean(boilAddBitMask&boilAdditions.atboil.bitmask);
		boilAdditions.at105.state = Boolean(boilAddBitMask&boilAdditions.at105.bitmask);
		boilAdditions.at90.state = Boolean(boilAddBitMask&boilAdditions.at90.bitmask);
		boilAdditions.at75.state = Boolean(boilAddBitMask&boilAdditions.at75.bitmask);
		boilAdditions.at60.state = Boolean(boilAddBitMask&boilAdditions.at60.bitmask);
		boilAdditions.at45.state = Boolean(boilAddBitMask&boilAdditions.at45.bitmask);
		boilAdditions.at30.state = Boolean(boilAddBitMask&boilAdditions.at30.bitmask);
		boilAdditions.at20.state = Boolean(boilAddBitMask&boilAdditions.at20.bitmask);
		boilAdditions.at15.state = Boolean(boilAddBitMask&boilAdditions.at15.bitmask);
		boilAdditions.at10.state = Boolean(boilAddBitMask&boilAdditions.at10.bitmask);
		boilAdditions.at5.state = Boolean(boilAddBitMask&boilAdditions.at5.bitmask);
		boilAdditions.at0.state = Boolean(boilAddBitMask&boilAdditions.at0.bitmask);
	};
	
	this.setVolumes = function(volumesArray) {
		
		batchVolume = Number(volumesArray[1])/100;
		grainWeight = Number(volumesArray[2])/100;
		mashRatio = Number(volumesArray[3])/100;
	}
	
	//Method to get recipe data from brewtroller 
	this.getProgramFromBrewTroller = function() {
		
		var programNameCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setTitle(resp[1]);
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramName+programIndex, programNameCallback, programIndex);
		
		var programTemperaturesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setTemperatures(resp);
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramTemperatures+programIndex, programTemperaturesCallback, programIndex);
		
		var programTimesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setTimes(resp);
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramTimes+programIndex, programTimesCallback, programIndex);
		
		var programGlobalsCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setGlobals(resp);
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramSettings+programIndex, programGlobalsCallback, programIndex);
		
		var programVolumesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setVolumes(resp);
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramVolumes+programIndex, programVolumesCallback, programIndex);
		
	};
	
	//Method to load recipe data from beerXML format file
	this.getRecipeFromBeerXML = function() {
		
	};
	
	//Method to save program to brewtroller
	this.saveProgramToBrewTroller = function(programIndex) {
		
	};
	
	this.convertToBeerXML = function() {
		
		//initialize an empty beer xml document
		var parser = new DOMParser();
		recipeBeerXMLDoc = parser.parseFromString('<?xml version="1.0" encoding="ISO-8859-1"?><RECIPES></RECIPES>', "text/xml");
		//Add the recipe tag for this recipe
		var newRecipe = recipeBeerXMLDoc.createElement("RECIPE");
		recipeBeerXMLDoc.firstChild.appendChild(newRecipe);
		var recipeName = recipeBeerXMLDoc.createElement("NAME");
		recipeName.appendChild(recipeBeerXMLDoc.createTextNode());
		recipeName.textContent = Title;
		newRecipe.appendChild(recipeName);
		console.log(recipeBeerXMLDoc);
	}
	
	//methods to save data from user input to Program instance, to save the changes, saveProgramToBrewTroller() should be called
	this.setNewTitle = function(newTitle) {
		Title = newTitle;
	};
	
	this.setNewDoughInTemperature = function(newTemp) {
		mashSchedule.doughIn.temperature = newTemp;
	};
	
	this.setNewAcidRestTemperature = function(newTemp) {
		mashSchedule.acidRest.temperature = newTemp;
	};
	
	this.setNewProteinRestTemperature = function(newTemp) {
		mashSchedule.proteinRest.temperature = newTemp;
	};
	
	this.setNewSacchRestTemperature = function(newTemp) {
		mashSchedule.sacchRest.temperature = newTemp;
	};
	
	this.setNewSacch2RestTemperature = function(newTemp) {
		mashSchedule.sacch2Rest.temperature = newTemp;
	};
	
	this.setNewMashOutTemperature = function(newTemp) {
		mashSchedule.mashOut.temperature = newTemp;
	};
	
	this.setNewDoughInLength = function(newLength) {
		mashSchedule.doughIn.time = newLength;
	};
	
	this.setNewAcidRestLength = function(newLength) {
		mashSchedule.acidRest.time = newLength;
	};
	
	this.setNewProteinRestLength = function(newLength) {
		mashSchedule.proteinRest.time = newLength;
	};
	
	this.setNewSacchRestLength = function(newLength) {
		mashSchedule.sacchRest.time = newLength;
	};
	
	this.setNewSacch2RestLength = function(newLength) {
		mashSchedule.sacch2Rest.time = newLength;
	};
	
	this.setNewMashOutLength = function(newLength) {
		mashSchedule.mashOut.time = newLength;
	};
	
	this.setNewBatchVolume = function(newVol) {
		batchVolume = newVol;
	};
	
	this.setNewBoilLength = function(newLength) {
		boilLength = newLength;
	};
	
	this.setNewMashRatio = function(newRatio) {
		mashRatio = newRatio;
	};
	
	this.setNewHLTTarget = function(newTarget) {
		hltTemperature = newTarget;
	};
	
	this.setMLTAsStrikeHeat = function() {
		strikeHeatVessel = 1;
	};
	
	this.setHLTAsStrikeHeat = function() {
		strikeHeatVessel = 0;
	};
	
	this.setNewGrainWeight = function(newWeight) {
		grainWeight = newWeight;
	};
	
	this.setNewSpargeTemperature = function(newTemp) {
		spargeTemperature = newTemp;
	};
	
	this.setNewPitchTemperature = function(newTemp) {
		pitchTemperature = newTemp;
	};
	
	//function requires a single argument of an array of boolean values indicating the state of each boil addition
	//starting with atBoil, then at105... to at0.
	this.setNewBoilAdditionsSchedule = function(additionsArray){
		
		boilAdditions.atboil.state = additionsArray[0];
		boilAdditions.at105.state = additionsArray[1];
		boilAdditions.at90.state = additionsArray[2];
		boilAdditions.at75.state = additionsArray[3];
		boilAdditions.at60.state = additionsArray[4];
		boilAdditions.at45.state = additionsArray[5];
		boilAdditions.at30.state = additionsArray[6];
		boilAdditions.at20.state = additionsArray[7];
		boilAdditions.at15.state = additionsArray[8];
		boilAdditions.at10.state = additionsArray[9];
		boilAdditions.at5.state = additionsArray[10];
		boilAdditions.at0.state = additionsArray[11];
	};
	
	this.setNewGrainTemperature = function(newTemp) {
		
	};
	
	
}

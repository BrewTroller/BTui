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
	var grainTemperature;	//indicates the temperature of the grain add dough in
	var preBoilVolume;	//the calculated total boil volume
	var strikeVolume;	//calculated strike volume
	var spargeVolume;	//calculated sparge volume
	
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
	var getCalculatedProgramVolumes = 'm';
	var getGrainTemperature = 'h';
	
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
		at105:{time: 105, state: false, bitmask: 2},
		at90:{time: 90,  state: false, bitmask: 4},
		at75:{time: 75,  state: false, bitmask: 8},
		at60:{time: 60,  state: false, bitmask: 16},
		at45:{time: 45,  state: false, bitmask: 32},
		at30:{time: 30,  state: false, bitmask: 64},
		at20:{time: 20,  state: false, bitmask: 128},
		at15:{time: 15,  state: false, bitmask: 256},
		at10:{time: 10,  state: false, bitmask: 512},
		at5:{time: 5,   state: false, bitmask: 1024},
		at0:{time: 0,   state: false, bitmask: 2056}
	};
	
	//public class methods
	
	//methods to set information coming from the BrewTroller, or from BeerXML format
	this.setTitle = function(newTitle) {
		Title = newTitle;
		//loop through to remove any trailing white space
		var counter = 0;
		for(var i = Title.length - 1; i >= 0; i--){
			if (Title.charAt(i) == ' ') counter++;
			else break;
		}
		Title = Title.replace(Title.substr(Title.length - counter, counter), '');
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
		
		batchVolume = Number(volumesArray[1])/1000;
		grainWeight = Number(volumesArray[2])/1000;
		mashRatio = Number(volumesArray[3])/100;
	};
	
	this.setCalculatedVolumes = function(volumesArray){
		
		preBoilVolume = Number(volumesArray[1])/1000;
		strikeVolume = Number(volumesArray[2])/1000;
		spargeVolume = Number(volumesArray[3])/1000;
	};
	
	this.setGrainTemperature = function(newTemp) {
		grainTemperature = newTemp;
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
		
		var calculatedVolumesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setCalculatedVolumes(resp);
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getCalculatedProgramVolumes+programIndex, calculatedVolumesCallback, programIndex);
		
		var grainTemperatureCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setGrainTemperature(Number(resp[1]));
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getGrainTemperature+programIndex, grainTemperatureCallback, programIndex);
	};
	
	//Method to load recipe data from beerXML format file
	this.getRecipeFromBeerXML = function(xmlDoc) {
		
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
		recipeName.textContent = Title;
		newRecipe.appendChild(recipeName);
		//Append Version Tag
		var version = recipeBeerXMLDoc.createElement("VERSION");
		version.textContent = "1";
		newRecipe.appendChild(version);
		//Append Batch Type Tag
		var recipeType = recipeBeerXMLDoc.createElement("TYPE");
		recipeType.textContent = "All Grain";
		newRecipe.appendChild(recipeType);
		//Append Brewer Tag
		var brewer = recipeBeerXMLDoc.createElement("BREWER");
		brewer.textContent = "BrewTroller";
		newRecipe.appendChild(brewer);
		//Append Batch Size Tag
		var batchSize = recipeBeerXMLDoc.createElement("BATCH_SIZE");
		if (BrewTroller.useMetric){
			batchSize.textContent = batchVolume;
		} else {
			batchSize.textContent = (batchVolume * 3.78541178); //convert US gallons to Litres
		}
		newRecipe.appendChild(batchSize);
		//Append Boil Size tag
		var boilSize = recipeBeerXMLDoc.createElement("BOIL_SIZE");
		if (BrewTroller.useMetric){
			boilSize.textContent = preBoilVolume;
		} else {
			boilSize.textContent = (preBoilVolume * 3.78541178); //convert US gallons to Litres
		}
		newRecipe.appendChild(boilSize);
		//Append Boil Time tag
		var boilTime = recipeBeerXMLDoc.createElement("BOIL_TIME");
		boilTime.textContent = boilLength;
		newRecipe.appendChild(boilTime);
		//Append Efficiency Tag
		var efficiency = recipeBeerXMLDoc.createElement("EFFICIENCY");
		efficiency.textContent = "75";
		newRecipe.appendChild(efficiency);
		//Append other Required Record Sets
		var hops = recipeBeerXMLDoc.createElement("HOPS");
		newRecipe.appendChild(hops);
		var fermentables = recipeBeerXMLDoc.createElement("FERMENTABLES");
		newRecipe.appendChild(fermentables);
		var style = recipeBeerXMLDoc.createElement("STYLE");
		newRecipe.appendChild(style);
		newRecipe.appendChild(recipeBeerXMLDoc.createElement("MISCS"));
		newRecipe.appendChild(recipeBeerXMLDoc.createElement("YEASTS"));
		newRecipe.appendChild(recipeBeerXMLDoc.createElement("WATERS"));
		var mash = recipeBeerXMLDoc.createElement('MASH');
		newRecipe.appendChild(mash);
		//Add total grain bill weight to single Fermentables entry
		//We have no way of telling what the grain is when loading from the BT so we default the entire grain bill to 2-row pale malt
		var grainBill = recipeBeerXMLDoc.createElement("FERMENTABLE");
		var grainName = recipeBeerXMLDoc.createElement("NAME");
		var grainVersion = recipeBeerXMLDoc.createElement("VERSION");
		var grainAmount = recipeBeerXMLDoc.createElement("AMOUNT");
		var grainType = recipeBeerXMLDoc.createElement("TYPE");
		var grainYield = recipeBeerXMLDoc.createElement("YIELD");
		var grainColor = recipeBeerXMLDoc.createElement("COLOR");
		grainName.textContent = "Pale 2-row Malt";
		grainVersion.textContent = 1;
		if (BrewTroller.useMetric){
			grainAmount.textContent = grainWeight;
		} else {
			grainAmount.textContent = (grainWeight * 0.45359237); //convert lbs to kg
		}
		grainType.textContent = "Grain";
		grainYield.textContent = "73.4";
		grainColor.textContent = "3.0";
		grainBill.appendChild(grainName);
		grainBill.appendChild(grainVersion);
		grainBill.appendChild(grainAmount);
		grainBill.appendChild(grainType);
		grainBill.appendChild(grainYield);
		grainBill.appendChild(grainColor);
		fermentables.appendChild(grainBill);
		//Add a HOP entry for each boil addition
		//Again we have no way of telling what the boil additions are from BT so default to a generic hop with an amount of 1oz (0.0283495231 kg)
		for (var property in boilAdditions){
			if (boilAdditions[property].state){
				var hop = recipeBeerXMLDoc.createElement("HOP");
				var hopName = recipeBeerXMLDoc.createElement("NAME");
				var hopVersion = recipeBeerXMLDoc.createElement("VERSION");
				var hopAlpha = recipeBeerXMLDoc.createElement("ALPHA");
				var hopAmount = recipeBeerXMLDoc.createElement("AMOUNT");
				var hopUse = recipeBeerXMLDoc.createElement("USE");
				var hopTime = recipeBeerXMLDoc.createElement("TIME");
				//set entries to appropriate values
				hopVersion.textContent = 1;
				hopName.textContent = "BrewTroller Generic";
				hopAlpha.textContent = "5.0";
				hopAmount.textContent = "0.0283495231";
				hopUse.textContent = "Boil";
				if (boilAdditions[property].time == "At Boil"){
					hopTime.textContent = boilLength;
				} else {
					hopTime.textContent = boilAdditions[property].time;
				}
				hop.appendChild(hopName);
				hop.appendChild(hopVersion);
				hop.appendChild(hopAlpha);
				hop.appendChild(hopAmount);
				hop.appendChild(hopUse);
				hop.appendChild(hopTime);
				hops.appendChild(hop);
			}
		}
		//Create and append data to the MASH profile tag
		var mashName = recipeBeerXMLDoc.createElement("NAME");
		var mashVerion = recipeBeerXMLDoc.createElement("VERSION");
		var mashGrainTemp = recipeBeerXMLDoc.createElement("GRAIN_TEMP");
		var mashSteps = recipeBeerXMLDoc.createElement("MASH_STEPS");
		var mashSpargeTemp = recipeBeerXMLDoc.createElement("SPARGE_TEMP");
		mashName.textContent = "BrewTroller "+Title+" Mash";
		mashVerion.textContent = 1;
		if (BrewTroller.useMetric){
			mashGrainTemp.textContent = grainTemperature;
			mashSpargeTemp.textContext = spargeTemperature;
		} else {
			mashGrainTemp.textContent = ((grainTemperature - 32) * 5 / 9); //convert fahrenheit to celcius
			mashSpargeTemp.textContext = ((spargeTemperature - 32) * 5 / 9); //convert fahreheit to celcius
		}
		mash.appendChild(mashName);
		mash.appendChild(mashVerion);
		mash.appendChild(mashGrainTemp);
		mash.appendChild(mashSteps);
		mash.appendChild(mashSpargeTemp);
		//check all of our mash steps to see if they are set, if so, create a MASH_STEP entry for it.
		for (var property in mashSchedule){
			if ((mashSchedule[property].time != 0) || (mashSchedule[property].temperature != 0)){
				var mashStep = recipeBeerXMLDoc.createElement("MASH_STEP");
				var stepName = recipeBeerXMLDoc.createElement("NAME");
				var stepVersion = recipeBeerXMLDoc.createElement("VERSION");
				var stepType = recipeBeerXMLDoc.createElement("TYPE");
				var stepTemperature = recipeBeerXMLDoc.createElement("STEP_TEMP");
				var stepTime = recipeBeerXMLDoc.createElement("STEP_TIME");
				stepName.textContent = mashSchedule[property].step;
				stepVersion.textContent = 1;
				stepType.textContent = "Temperature";
				if (BrewTroller.useMetric){
					stepTemperature.textContent = mashSchedule[property].temperature;
				} else {
					stepTemperature.textContent = ((mashSchedule[property].temperature - 32) * 5 / 9);
				}
				stepTime.textContent = mashSchedule[property].time;
				mashStep.appendChild(stepName);
				mashStep.appendChild(stepVersion);
				mashStep.appendChild(stepType);
				mashStep.appendChild(stepTemperature);
				mashStep.appendChild(stepTime);
				mashSteps.appendChild(mashStep);
			}
		}
		//Append the required Style section entries, as empty
		style.appendChild(recipeBeerXMLDoc.createElement("NAME"));
		style.appendChild(recipeBeerXMLDoc.createElement("CATEGORY"));
		style.appendChild(recipeBeerXMLDoc.createElement("VERSION"));
		style.appendChild(recipeBeerXMLDoc.createElement("CATEGORY_NUMBER"));
		style.appendChild(recipeBeerXMLDoc.createElement("STYLE_LETTER"));
		style.appendChild(recipeBeerXMLDoc.createElement("STYLE_GUIDE"));
		style.appendChild(recipeBeerXMLDoc.createElement("TYPE"));
		style.appendChild(recipeBeerXMLDoc.createElement("OG_MIN"));
		style.appendChild(recipeBeerXMLDoc.createElement("OG_MAX"));
		style.appendChild(recipeBeerXMLDoc.createElement("FG_MIN"));
		style.appendChild(recipeBeerXMLDoc.createElement("FG_MAX"));
		style.appendChild(recipeBeerXMLDoc.createElement("IBU_MIN"));
		style.appendChild(recipeBeerXMLDoc.createElement("IBU_MAX"));
		style.appendChild(recipeBeerXMLDoc.createElement("COLOR_MIN"));
		style.appendChild(recipeBeerXMLDoc.createElement("COLOR_MAX"));
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
		
		boilAdditions.atboil.state = Boolean(additionsArray[0]);
		boilAdditions.at105.state = Boolean(additionsArray[1]);
		boilAdditions.at90.state = Boolean(additionsArray[2]);
		boilAdditions.at75.state = Boolean(additionsArray[3]);
		boilAdditions.at60.state = Boolean(additionsArray[4]);
		boilAdditions.at45.state = Boolean(additionsArray[5]);
		boilAdditions.at30.state = Boolean(additionsArray[6]);
		boilAdditions.at20.state = Boolean(additionsArray[7]);
		boilAdditions.at15.state = Boolean(additionsArray[8]);
		boilAdditions.at10.state = Boolean(additionsArray[9]);
		boilAdditions.at5.state = Boolean(additionsArray[10]);
		boilAdditions.at0.state = Boolean(additionsArray[11]);
	};
	
	this.setNewGrainTemperature = function(newTemp) {
		grainTemperature = newTemp;
	};
	
	//inspector methods
	this.getTitle = function() {
		return Title;
	};
	
	this.getProgramIndex = function() {
		return programIndex;
	};
	
	this.getBatchVolume = function() {
		return batchVolume;
	};
	
	this.getGrainWeight = function() {
		return grainWeight;
	};
	
	this.getBoilLength = function() {
		return boilLength;
	};
	
	this.getMashRatio = function() {
		return mashRatio;
	};
	
	this.getHLTTargetTemperature = function() {
		return hltTemperature;
	};
	
	this.getSpargeTemperature = function() {
		return spargeTemperature;
	};
	
	this.getPitchTemperature = function() {
		return pitchTemperature;
	};
	
	this.getMashSchedule = function() {
		return mashSchedule;
	};
	
	this.getStrikeHeatVessel = function() {
		return strikeHeatVessel;
	};
	
	this.getBoilAdditions = function() {
		return boilAdditions;
	};
	
	this.getGrainTemperature = function() {
		return grainTemperature;
	};
	
	this.getRecipeInBeerXML = function() {
		if(recipeBeerXMLDoc == undefined) this.convertToBeerXML();		
		return recipeBeerXMLDoc;
	};
	
	
}

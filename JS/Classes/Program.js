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
	var boilAddBitMask; //variable to hold the bit mask representing the boil addition schedule
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
	var setProgramVolumes = 'y';
	var getCalculatedProgramVolumes = 'm';
	var getGrainTemperature = 'h';
	
	//properly instantiate mashSchedule and boilAddidion objects
	mashSchedule = {
		doughIn:{step: "Dough In",		time: 0, temperature: 0},
		acid:{step: "Acid Rest", 	time: 0, temperature: 0},
		protein:{step: "Protein Rest",	time: 0, temperature: 0},
		sacch:{step: "Saccharification",	time: 0, temperature: 0},
		sacch2:{step: "Saccharification 2",	time: 0, temperature: 0},
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
		mashSchedule.acid.temperature = Number(temperatureArray[2]);
		mashSchedule.protein.temperature = Number(temperatureArray[3]);
		mashSchedule.sacch.temperature = Number(temperatureArray[4]);
		mashSchedule.sacch2.temperature = Number(temperatureArray[5]);
		mashSchedule.mashOut.temperature = Number(temperatureArray[6]);
	};
	
	this.setTimes = function(timesArray) {
		
		mashSchedule.doughIn.time = Number(timesArray[1]);
		mashSchedule.acid.time = Number(timesArray[2]);
		mashSchedule.protein.time = Number(timesArray[3]);
		mashSchedule.sacch.time = Number(timesArray[4]);
		mashSchedule.sacch2.time = Number(timesArray[5]);
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
		  if (xhr.responseText.lastIndexOf('\\') != -1) var resp = JSON.parse(xhr.responseText.replace('\\', ' '));
			else var resp = JSON.parse(xhr.responseText);
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
	
	//Method to reload data from the brewtroller, method also notifies the viewController when the data has been updated
	this.reloadProgramFromBrewTroller = function(){
	  var programNameCallback = function(programIndex, xhr) {
		  if (xhr.responseText.lastIndexOf('\\') != -1) var resp = JSON.parse(xhr.responseText.replace('\\', ' '));
			else var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setTitle(resp[1]);
			BTUI.viewPort.reloadProgramFromBrewTrollerEventHandler("title");
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramName+programIndex, programNameCallback, programIndex);
		
		var programTemperaturesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setTemperatures(resp);
			BTUI.viewPort.reloadProgramFromBrewTrollerEventHandler("programTemperatures");
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramTemperatures+programIndex, programTemperaturesCallback, programIndex);
		
		var programTimesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setTimes(resp);
			BTUI.viewPort.reloadProgramFromBrewTrollerEventHandler("programTimes");
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramTimes+programIndex, programTimesCallback, programIndex);
		
		var programGlobalsCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setGlobals(resp);
			BTUI.viewPort.reloadProgramFromBrewTrollerEventHandler("globals");
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramSettings+programIndex, programGlobalsCallback, programIndex);
		
		var programVolumesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setVolumes(resp);
			BTUI.viewPort.reloadProgramFromBrewTrollerEventHandler("volumes");
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getProgramVolumes+programIndex, programVolumesCallback, programIndex);
		
		var calculatedVolumesCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setCalculatedVolumes(resp);
			BTUI.viewPort.reloadProgramFromBrewTrollerEventHandler("calculatedVolumes");
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getCalculatedProgramVolumes+programIndex, calculatedVolumesCallback, programIndex);
		
		var grainTemperatureCallback = function(programIndex, xhr) {
			var resp = JSON.parse(xhr.responseText);
			var program = BrewTroller.getProgram(programIndex);
			program.setGrainTemperature(Number(resp[1]));
			BTUI.viewPort.reloadProgramFromBrewTrollerEventHandler("grainTemperature");
		};
		BrewTroller.communicate(BrewTroller.getAddress()+getGrainTemperature+programIndex, grainTemperatureCallback, programIndex);
	};
	
	//Method to load recipe data from beerXML format file
	this.getRecipeFromBeerXML = function(xmlDoc) {
	  //check to make sure this is a valid document
		if (xmlDoc.querySelector('RECIPE')){
		  recipeBeerXMLDoc = xmlDoc;
		  		  
		  //Parameter Resets
		  Title = undefined;
		  grainWeight = 0;
		  for (var property in mashSchedule){
		    mashSchedule[property].time = 0;
		    mashSchedule[property].temperature = 0;
		  }
		  for (var property in boilAdditions){
		    boilAdditions[property].state = false;
		  }
		
		  var targetUnits = BrewTroller.usesMetric() ? "metric" : "imperial";
		  var recipe = recipeBeerXMLDoc.querySelector('RECIPE');
		  var nameNodes = recipe.querySelectorAll('NAME');
		  for (var i = 0; i < nameNodes.length; i++){
		    if (nameNodes[i].parentNode == recipe) Title = nameNodes[i].textContent;
		  }
		  if (Title == undefined) Title = "untitled";
		  if (Title.length > 18) Title = Title.substr(0, 19);
		  batchVolume = Number(correctUnits(Number(recipe.querySelector('BATCH_SIZE').textContent), "volume", "metric", targetUnits).toFixed(1));
		  boilLength = Number(recipe.querySelector('BOIL_TIME').textContent);
		  spargeTemperature = recipe.querySelector('SPARGE_TEMP') ? Number(correctUnits(Number(recipe.querySelector('SPARGE_TEMP').textContent), "temperature", "metric", targetUnits).toFixed(0)) : 0;
		  hltTemperature = spargeTemperature;
		  //get mash ratio, and convert to proper units
		  var ratio;
		  if (recipe.querySelector('WATER_GRAIN_RATIO')){
		    ratio = recipe.querySelector('WATER_GRAIN_RATIO').textContent;
		    if (ratio.lastIndexOf('qt/lb') != -1){
		      ratio = Number(ratio.replace(' qt/lb', ''));
		      mashRatio = Number(correctUnits(ratio, "ratio", "imperial", targetUnits).toFixed(2));
		    } else if (ratio.lastIndexOf('l/kg')){
		      ratio = Number(ratio.replace(' l/kg', ''));
		      mashRatio = Number(correctUnits(ratio, "ratio", "imperial", targetUnits).toFixed(2));
		    }
	    } else ratio = 0;
		  //Determine Grain bill weight
		  var fermentables = recipe.querySelectorAll('FERMENTABLE');
		  //loop through array of Fermentables, if it is of type Grain we add its weight to the total grainWeight
		  for (var i = 0; i < fermentables.length; i++){
		    if (fermentables[i].querySelector('TYPE').textContent == ("Grain" || "grain")) grainWeight = grainWeight + Number(fermentables[i].querySelector("AMOUNT").textContent);
		  }
		  //ensure we convert the units if necessary
		  grainWeight = Number(correctUnits(grainWeight, "weight", "metric", targetUnits).toFixed(2));
		  //Set a default for pitch temperature
		  pitchTemperature = recipe.querySelector('PRIMARY_TEMP') ? Number(correctUnits(Number(recipe.querySelector('PRIMARY_TEMP').textContent), "temperature", "metric", targetUnits).toFixed(0)) : Number(correctUnits(72, "temperature", "imperial", targetUnits).toFixed(0));
		  //get and store the mash steps
		  var mashSteps = recipe.querySelectorAll('MASH_STEP');
		  for (var i = 0; i < mashSteps.length; i++){
		    var step = undefined;
		    for (var property in mashSchedule){
		      if (mashSteps[i].querySelector("NAME").textContent == mashSchedule[property].step){
		        step = property;
		        break;
		      } 
		    }  if (step == undefined){
		        var name = mashSteps[i].querySelector("NAME").textContent.toUpperCase(); //cast the name to all caps to rule out case matching issues
		        if (name.toUpperCase().lastIndexOf("CONVERSION") != -1) step = "sacch";
		        else if (name.lastIndexOf("OUT") != -1) step = "mashOut";
		        else if (name.lastIndexOf("PROTEIN") != -1) step = "protein";
		        else if (name.lastIndexOf("ACID") != -1) step = "acid";
		        else if (name.lastIndexOf("DOUGH") != -1) step = "doughIn";
		        else if (name.lastIndexOf("MASH IN") != -1) step = "sacch";
		        else if (mashSteps.length == 1 || (mashSteps.length == 2 && i == 0)) step = "sacch"; //if there is only one oddly or genericlly named step we will default to sacch rest
		        else if (mashSteps.length == 2 && i == 1) step = "mashOut"; // if there are two oddly named steps we will default the second to mash out
		      }
		    if (step == "sacch" && mashSchedule[step].time != 0) step == "sacch2";
		    mashSchedule[step].time = Number(mashSteps[i].querySelector('STEP_TIME').textContent);
		    if (mashSchedule[step].time == 0) mashSchedule[step].time = Number(mashSteps[i].querySelector('RAMP_TIME').textContent); 
		    mashSchedule[step].temperature = Number(correctUnits(Number(mashSteps[i].querySelector('STEP_TEMP').textContent), "temperature", "metric", targetUnits).toFixed(0));
		  }	
		  //get and store boil additions
		  var misc = recipe.querySelectorAll('MISC');
		  var hops = recipe.querySelectorAll('HOP');
		  for (var i = 0; i < misc.length; i++){
		    var use = misc[i].querySelector('USE').textContent.toUpperCase();
		    if (use == "BOIL"){
		      var time = Number(misc[i].querySelector("TIME").textContent);
		      var found = false;
		      for (var property in boilAdditions){
		        if (time == Number(property.replace("at", ""))){
		          boilAdditions[property].state = true;
		          found = true;
		          break;
		        }
		      } 
		      //if we havent found the right addition time, round to nearest 5 and try again
		      if (!found){
		        time = Math.round(time/5)*5;
		        for (var property in boilAdditions){
  		        if (time == Number(property.replace("at", ""))){
  		          boilAdditions[property].state = true;
  		          found = true;
  		          break;
  		        }
  		      }
		      }
		      //if still not found round to nearest 10 and try again
		      if (!found){
		        time = Math.round(time/10)*10;
		        for (var property in boilAdditions){
  		        if (time == Number(property.replace("at", ""))){
  		          boilAdditions[property].state = true;
  		          found = true;
  		          break;
  		        }
  		      }
		      }
		    }
		  }
		  for (var i = 0; i < hops.length; i++){
		    var use = hops[i].querySelector('USE').textContent.toUpperCase();
		    if (use == "FIRST WORT"){
		      boilAdditions.atboil.state = true;
		    } else if (use == "AROMA"){
		      boilAdditions.at0.state = true;
		    } else if (use == "BOIL"){
		      var time = Number(hops[i].querySelector("TIME").textContent);
		      var found = false;
		      for (var property in boilAdditions){
		        if (time == Number(property.replace("at", ""))){
		          boilAdditions[property].state = true;
		          found = true;
		          break;
		        }
		      } 
		      //if we havent found the right addition time, round to nearest 5 and try again
		      if (!found){
		        time = Math.round(time/5)*5;
		        for (var property in boilAdditions){
  		        if (time == Number(property.replace("at", ""))){
  		          boilAdditions[property].state = true;
  		          found = true;
  		          break;
  		        }
  		      }
		      }
		      //if still not found round to nearest 10 and try again
		      if (!found){
		        time = Math.round(time/10)*10;
		        for (var property in boilAdditions){
  		        if (time == Number(property.replace("at", ""))){
  		          boilAdditions[property].state = true;
  		          found = true;
  		          break;
  		        }
  		      }
		      }
		    }
		  }  
		}
	};
	
	//Method to save program to brewtroller
	this.saveProgramToBrewTroller = function(programIndex) {
		
	};
	
	this.convertToBeerXML = function() {
		
		var currentUnits = BrewTroller.usesMetric() ? "metric" : "imperial";
		
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
		
		var primaryTemp = recipeBeerXMLDoc.createElement("PRIMARY_TEMP");
		primaryTemp.textContent = correctUnits(pitchTemperature, "temperature", currentUnits, "metric");
		newRecipe.appendChild(primaryTemp);
		
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
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramName+programIndex+'&'+Title, function(){}, programIndex);
	};
	
	this.setNewMashSchedule = function(newSched){
	  for (var property in newSched){
	    mashSchedule[property].time = newSched[property].time;
	    mashSchedule[property].temperature = newSched[property].temperature;
	  }
	  BrewTroller.communicate(BrewTroller.getAddress()+setProgramTimes+programIndex+'&'+mashSchedule.doughIn.time+'&'+mashSchedule.acid.time+'&'+mashSchedule.protein.time+'&'+mashSchedule.sacch.time+'&'+mashSchedule.sacch2.time+'&'+mashSchedule.mashOut.time, function(){}, programIndex);
	  BrewTroller.communicate(BrewTroller.getAddress()+setProgramTemperatures+programIndex+'&'+mashSchedule.doughIn.temperature+'&'+mashSchedule.acid.temperature+'&'+mashSchedule.protein.temperature+'&'+mashSchedule.sacch.temperature+'&'+mashSchedule.sacch2.temperature+'&'+mashSchedule.mashOut.temperature, function(){}, programIndex);
	};
	
	this.setNewBatchVolume = function(newVol) {
		batchVolume = newVol;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramVolumes+programIndex+'&'+batchVolume*1000+'&'+grainWeight*1000+'&'+mashRatio*100, function(){}, programIndex);
	};
	
	this.setNewBoilLength = function(newLength) {
		boilLength = newLength;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramSettings+programIndex+'&'+spargeTemperature+'&'+hltTemperature+'&'+boilLength+'&'+pitchTemperature+'&'+boilAddBitMask+'&'+strikeHeatVessel, function(){}, programIndex);
	};
	
	this.setNewMashRatio = function(newRatio) {
		mashRatio = newRatio;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramVolumes+programIndex+'&'+batchVolume*1000+'&'+grainWeight*1000+'&'+mashRatio*100, function(){}, programIndex);
	};
	
	this.setNewHLTTarget = function(newTarget) {
		hltTemperature = newTarget;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramSettings+programIndex+'&'+spargeTemperature+'&'+hltTemperature+'&'+boilLength+'&'+pitchTemperature+'&'+boilAddBitMask+'&'+strikeHeatVessel, function(){}, programIndex);
	};
	
	this.setMLTAsStrikeHeat = function() {
		strikeHeatVessel = 1;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramSettings+programIndex+'&'+spargeTemperature+'&'+hltTemperature+'&'+boilLength+'&'+pitchTemperature+'&'+boilAddBitMask+'&'+strikeHeatVessel, function(){}, programIndex);
	};
	
	this.setHLTAsStrikeHeat = function() {
		strikeHeatVessel = 0;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramSettings+programIndex+'&'+spargeTemperature+'&'+hltTemperature+'&'+boilLength+'&'+pitchTemperature+'&'+boilAddBitMask+'&'+strikeHeatVessel, function(){}, programIndex);
	};
	
	this.setNewGrainWeight = function(newWeight) {
		grainWeight = newWeight;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramVolumes+programIndex+'&'+batchVolume*1000+'&'+grainWeight*1000+'&'+mashRatio*100, function(){}, programIndex);
	};
	
	this.setNewSpargeTemperature = function(newTemp) {
		spargeTemperature = newTemp;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramSettings+programIndex+'&'+spargeTemperature+'&'+hltTemperature+'&'+boilLength+'&'+pitchTemperature+'&'+boilAddBitMask+'&'+strikeHeatVessel, function(){}, programIndex);
	};
	
	this.setNewPitchTemperature = function(newTemp) {
		pitchTemperature = newTemp;
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramSettings+programIndex+'&'+spargeTemperature+'&'+hltTemperature+'&'+boilLength+'&'+pitchTemperature+'&'+boilAddBitMask+'&'+strikeHeatVessel, function(){}, programIndex);
	};
	
	//function requires a single argument of an array of boolean values indicating the state of each boil addition
	//starting with atBoil, then at105... to at0.
	this.setNewBoilAdditionsSchedule = function(additionsArray){
		boilAddBitMask = 0;
		for (var property in additionsArray){
		  boilAdditions[property].state = additionsArray[property].state;
		  if (additionsArray[property].state) boilAddBitMask = boilAddBitMask | boilAdditions[property].bitmask;
		}
		BrewTroller.communicate(BrewTroller.getAddress()+setProgramSettings+programIndex+'&'+spargeTemperature+'&'+hltTemperature+'&'+boilLength+'&'+pitchTemperature+'&'+boilAddBitMask+'&'+strikeHeatVessel, function(){}, programIndex);
	};
	
	this.setNewGrainTemperature = function(newTemp) {
		grainTemperature = newTemp;
	};
	
	//inspector methods
	this.getTitle = function() {
		return Title ? Title : 'untitled';
	};
	
	this.getProgramIndex = function() {
		return programIndex;
	};
	
	this.getBatchVolume = function() {
		return batchVolume ? batchVolume : 0;
	};
	
	this.getGrainWeight = function() {
		return grainWeight ? grainWeight : 0;
	};
	
	this.getBoilLength = function() {
		return boilLength ? boilLength : 0;
	};
	
	this.getMashRatio = function() {
		return mashRatio ? mashRatio : 0;
	};
	
	this.getHLTTargetTemperature = function() {
		return hltTemperature ? hltTemperature : 0;
	};
	
	this.getSpargeTemperature = function() {
		return spargeTemperature ? spargeTemperature : 0;
	};
	
	this.getPitchTemperature = function() {
		return pitchTemperature ? pitchTemperature : 0;
	};
	
	this.getMashSchedule = function() {
		return mashSchedule;
	};
	
	this.getStrikeHeatVessel = function() {
		return strikeHeatVessel ? 'mlt' : 'hlt';
	};
	
	this.getBoilAdditions = function() {
		return boilAdditions;
	};
	
	this.getGrainTemperature = function() {
		return grainTemperature ? grainTemperature : 0;
	};
	
	this.getRecipeInBeerXML = function() {
		if(recipeBeerXMLDoc == undefined) this.convertToBeerXML();		
		return recipeBeerXMLDoc;
	};
	
	//Private class helper methods
	
	//method takes a number, a string representing the unit type (weight, volume, temperature), a current unit system, and a target unit system
	//and returns the number with the correct units
	var correctUnits = function(input, type, currentSystem, targetSystem){
	 if (currentSystem == targetSystem) return input;
	  if (currentSystem == "metric"){
	    switch (type){
	      case "temperature":
	        return input * (9/5) + 32;
	      case "volume":
	        return input * 0.264;
	      case "weight":
	        return input * 2.204;
	      case "ratio":
	        return input / 0.9464;
	    };
	  } else {
	    switch (type){
	      case "temperature":
	        return (input - 32)/(9.5);
	      case "volume":
	        return input / 0.264;
	      case "weight":
	        return input / 2.204;
	      case "ratio":
  	      return input * 0.9464;
	    };
	  }
	};
	
}

/**
 * @author Eric Yanush
 */
//Views Controller Class
//Encapsulates all functions used to control the current state of the app ViewPort
ViewController = function(){
	
//private class objects -> hold references to view outlets

var monitorFoldButtons =
{
	update: undefined,
	fullscreenToggle: undefined
};

var hlt = 
{
	vesselDisplay: undefined,
	temperatureDisplay: undefined,
	targetTemperatureDisplay: undefined,
	heatOutputDisplay: undefined,
	volumeDisplay: undefined,
	targetVolumeDisplay: undefined,
	volumeChart: undefined,
	volumeChartTargetIndicator: undefined
};

var mlt = 
{
	vesselDisplay: undefined,
	temperatureDisplay: undefined,
	targetTemperatureDisplay: undefined,
	heatOutputDisplay: undefined,
	volumeDisplay: undefined,
	targetVolumeDisplay: undefined,
	volumeChart: undefined,
	volumeChartTargetIndicator: undefined
};

var kettle = 
{
	vesselDisplay: undefined,
	temperatureDisplay: undefined,
	targetTemperatureDisplay: undefined,
	heatOutputDisplay: undefined,
	volumeDisplay: undefined,
	targetVolumeDisplay: undefined,
	volumeChart: undefined,
	volumeChartTargetIndicator: undefined
};	

var units =	//object to hold references to all the unit displays in the view, to make setting the units easier 
{
	temperature:{},
	volume: {},
	weight: {}
};

//obeject to hold references to vessel objects to allow for use of string identifiers
var vessels =
{
	hlt: hlt,
	mlt: mlt,
	kettle: kettle
};

var valveProfiles = 
{
	fillHlt: undefined,
	fillMash: undefined,
	addGrain: undefined,
	mashHeat: undefined,
	mashIdle: undefined,
	spargeIn: undefined,
	spargeOut: undefined,
	boilAdditions: undefined,
	kettleLid: undefined,
	chillerH2o: undefined,
	chillerBeer: undefined,
	boilRecirc: undefined,
	drain: undefined,
	hltHeat: undefined,
	hltIdle: undefined,
	kettleHeat: undefined,
	kettleIdle: undefined,
	user1: undefined,
	user2: undefined,
	user3: undefined	
};

var programSelector =
{
  p1: undefined, p2: undefined, p3: undefined, p4: undefined, p5: undefined, p6: undefined, p7: undefined, p8: undefined, p9: undefined, p10: undefined, 
  p11: undefined, p12: undefined, p13: undefined, p14: undefined, p15: undefined, p16: undefined, p17: undefined, p18: undefined, p19: undefined, p20: undefined, 
};

var programDisplay =
{
  selectedProgramIndex: undefined,
  name: undefined,
  columns: {baseLeft: undefined, baseRight: undefined, baseFooter: undefined, boilLeft: undefined, boilRight: undefined, boilFooter: undefined},
  spargeTemp: undefined,
  hltTarget: undefined,
  batchVol: undefined,
  grainWeight: undefined,
  boilTime: undefined,
  mashRatio: undefined,
  pitchTemp: undefined,
  boilAdditionsEdit: undefined,
  mashSched: 
  {
    doughIn: {temp: undefined, time: undefined}, acid: {temp: undefined, time: undefined}, protein: {temp: undefined, time: undefined},
    sacch: {temp: undefined, time: undefined}, sacch2: {temp: undefined, time: undefined}, mashOut: {temp: undefined, time: undefined}
  },
  strikeHeat: {hlt: undefined, mlt: undefined},
  boilAdditions:
  {
    atboil: {on: undefined, off: undefined}, at105: {on: undefined, off: undefined}, at90: {on: undefined, off: undefined}, 
    at75: {on: undefined, off: undefined}, at60: {on: undefined, off: undefined}, at45: {on: undefined, off: undefined},
    at30: {on: undefined, off: undefined}, at20: {on: undefined, off: undefined}, at15: {on: undefined, off: undefined}, 
    at10: {on: undefined, off: undefined}, at5: {on: undefined, off: undefined}, at0: {on: undefined, off: undefined}
  },
  boilAddBack: undefined,
  reloadFromBT: undefined,
  importBeerXML: undefined,
  fileGetter: undefined,
  exportBeerXML: undefined,
  exportForm: {form: undefined, name: undefined, data: undefined},
  saveToBT: undefined
};

var logging = 
{
  loggingLink: undefined,
  graphParameters: {start: {display: undefined, list: undefined}, end: {display: undefined, list: undefined}, resolution: {display: undefined, list: undefined}},
  vesselSelectors: 
  {
    hlt : {selector: undefined, temp: {on: undefined, off: undefined, series: undefined}, targetTemp: {on: undefined, off: undefined, series: undefined}, heat: {on: undefined, off: undefined, series: undefined}, volume: {on: undefined, off: undefined, series: undefined}, targetVol: {on: undefined, off: undefined, series: undefined} },
    mlt : {selector: undefined, temp: {on: undefined, off: undefined, series: undefined}, targetTemp: {on: undefined, off: undefined, series: undefined}, heat: {on: undefined, off: undefined, series: undefined}, volume: {on: undefined, off: undefined, series: undefined}, targetVol: {on: undefined, off: undefined, series: undefined} },
    kettle : {selector: undefined, temp: {on: undefined, off: undefined, series: undefined}, targetTemp: {on: undefined, off: undefined, series: undefined}, heat: {on: undefined, off: undefined, series: undefined}, volume: {on: undefined, off: undefined, series: undefined}, targetVol: {on: undefined, off: undefined, series: undefined} },
  },
  graphDisplay: undefined,
  chart: undefined,
  dataRange: {start: undefined, end: undefined, resolution: undefined},
  exportPDF: undefined,
  exportJPEG: undefined
};

var settingsTabs =
{
	global: {tab: undefined, indicator: undefined, tabDisplay: undefined},
	hlt: {tab: undefined, indicator: undefined, tabDisplay: undefined},
	mlt: {tab: undefined, indicator: undefined, tabDisplay: undefined},
	kettle: {tab: undefined, indicator: undefined, tabDisplay: undefined}
};

var globalSettings = 
{
	addressDisplay: undefined,
	vesselDisplayOptions: 
	{
		hlt: {showButton: undefined, hideButton:undefined},
		mlt: {showButton: undefined, hideButton:undefined},
		kettle: {showButton: undefined, hideButton:undefined},
	},
	autoUpdate: {onButton: undefined, offButton: undefined, frequencyDisplay: undefined},
	saveButton: undefined
};

var hltSettings = 
{
  output:
  {
    pidSwitch: {on: undefined, off: undefined},
    hysteresis: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    pidSettingsDisplay: undefined,
    pGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    iGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    dGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    cycleTime: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
  }
};

var mltSettings = 
{
  output:
  {
    pidSwitch: {on: undefined, off: undefined},
    hysteresis: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    pidSettingsDisplay: undefined,
    pGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    iGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    dGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    cycleTime: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
  }
};

var kettleSettings = 
{
  output:
  {
    pidSwitch: {on: undefined, off: undefined},
    hysteresis: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    pidSettingsDisplay: undefined,
    pGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    iGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    dGain: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
    cycleTime: {display: undefined, increaseButton: undefined, decreaseButton: undefined},
  }
};

var activeSettingsTab = "global";

//private class variable functions assigned to Element event triggers
var targetTemperatureOnKeypress = function(event){
	if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) return true; // fix for FireFox to allow BS, arrows, delete
	if(event.charCode < 48 || event.charCode > 57){
		if(event.charCode == 13 || event.keyCode == 13){
			event.target.blur();
			return false;
		}else return false;
	} else return true;
};

var targetTemperatureOnBlur = function(event){
	BTUI.viewPort.editTargetTemperature(event);
};

var programTitleOnKeyPress = function(event){
  if(event.charCode == 13){
		event.srcElement.blur();
		return false;
	}
	if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) return true;
  if (event.charCode < 32 || event.charCode > 126 || event.charCode == 92) return false;
  else if (event.target.textContent.length > 18) return false;
  else return true;
};

var programOnKeyPressDecimals = function(event){
  if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) return true;
  if((event.charCode < 48 || event.charCode > 57) && event.charCode != 46){
		if(event.charCode == 13){
			event.srcElement.blur();
			return false;
		}else return false;
	} else if (event.target.textContent.length > 3) return false;
	else return true;
};

var programOnKeyPress = function(event){
  if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) return true;
  if(event.charCode < 48 || event.charCode > 57){
		if(event.charCode == 13){
			event.srcElement.blur();
			return false;
		}else return false;
	} else if (event.target.textContent.length > 2) return false;
	 else return true;
};

var autoUpdateFrequencyOnKeyPress = function(event){
  if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) return true;
  if(event.charCode < 48 || event.charCode > 57){
		if(event.charCode == 13){
			event.srcElement.blur();
			return false;
		}else return false;
	} else if (event.target.textContent.length > 5) return false;
	 else return true;
}

var valveProfileOnClick = function(event){
	BTUI.viewPort.toggleValveProfile(event);
};

var valveProfileOnRightClick = function(profileID){
	return false;
};

var update = function(){
	BTUI.viewPort.updateHandler();
};

var fullScreenToggle = function(event){
	BTUI.viewPort.fullScreenHandler(event);
};

this.initSetup = function() {

	//setup monitor fold buttons
	monitorFoldButtons.update =           document.getElementById('MonitorButtons').children[0];
	monitorFoldButtons.fullscreenToggle = monitorFoldButtons.update.nextElementSibling;

	//setup hlt view object
	hlt.vesselDisplay =                                     document.getElementById("HLT");
	hlt.temperatureDisplay =                                hlt.vesselDisplay.children[1].children[0].children[0];
	units.temperature.hltTemperatureDisplayUnit =           hlt.temperatureDisplay.nextElementSibling;
	hlt.targetTemperatureDisplay =                          hlt.vesselDisplay.children[1].children[1].children[0];
	units.temperature.hltTargetTemperatureUnitDisplay =     hlt.targetTemperatureDisplay.nextElementSibling;
	hlt.heatOutputDisplay =                                 hlt.vesselDisplay.children[1].children[2];
	hlt.volumeDisplay =                                     hlt.vesselDisplay.children[2].children[1].children[0];
	units.volume.hltVolumeUnitDisplay =                     hlt.volumeDisplay.nextElementSibling;
	hlt.targetVolumeDisplay =                               hlt.vesselDisplay.children[2].children[2].children[0];	
	units.volume.hltTargetVolumeDisplayUnit =               hlt.targetVolumeDisplay.nextElementSibling;
	
	//setup mlt view object
	mlt.vesselDisplay =                                     document.getElementById("MLT");
	mlt.temperatureDisplay =                                mlt.vesselDisplay.children[1].children[0].children[0];
	units.temperature.mltTemperatureDisplayUnit =           mlt.temperatureDisplay.nextElementSibling;
	mlt.targetTemperatureDisplay =                          mlt.vesselDisplay.children[1].children[1].children[0];
	units.temperature.mltTargetTemperatureUnitDisplay =     mlt.targetTemperatureDisplay.nextElementSibling;
	mlt.heatOutputDisplay =                                 mlt.vesselDisplay.children[1].children[2];
	mlt.volumeDisplay =                                     mlt.vesselDisplay.children[2].children[1].children[0];
	units.volume.mltVolumeUnitDisplay =                     mlt.volumeDisplay.nextElementSibling;
	mlt.targetVolumeDisplay =                               mlt.vesselDisplay.children[2].children[2].children[0];
	units.volume.mltTargetVolumeDisplayUnit =               mlt.targetVolumeDisplay.nextElementSibling;
	
	//setup kettle view object
	kettle.vesselDisplay =                                  document.getElementById('KETTLE');
	kettle.temperatureDisplay =                             kettle.vesselDisplay.children[1].children[0].children[0];
	units.temperature.kettleTemperatureDisplayUnit =        kettle.temperatureDisplay.nextElementSibling;
	kettle.targetTemperatureDisplay =                       kettle.vesselDisplay.children[1].children[1].children[0];
	units.temperature.kettleTargetTemperatureUnitDisplay =  kettle.targetTemperatureDisplay.nextElementSibling;
	kettle.heatOutputDisplay =                              kettle.vesselDisplay.children[1].children[2];
	kettle.volumeDisplay =                                  kettle.vesselDisplay.children[2].children[1].children[0];
	units.volume.kettleVolumeUnitDisplay =                  kettle.volumeDisplay.nextElementSibling;
	kettle.targetVolumeDisplay =                            kettle.vesselDisplay.children[2].children[2].children[0];
	units.volume.kettleTargetVolumeDisplayUnit =            kettle.targetVolumeDisplay.nextElementSibling;
	
	//setup valve profiles view object
	valveProfiles.fillHlt =       document.getElementById("fillHlt");
	valveProfiles.fillMash =      document.getElementById("fillMash");
	valveProfiles.addGrain =      document.getElementById("addGrain");
	valveProfiles.mashHeat =      document.getElementById("mashHeat");
	valveProfiles.mashIdle =      document.getElementById("mashIdle");
	valveProfiles.spargeIn =      document.getElementById("spargeIn");
	valveProfiles.spargeOut =     document.getElementById("spargeOut");
	valveProfiles.boilAdditions = document.getElementById("boilAdditions");
	valveProfiles.kettleLid =     document.getElementById("kettleLid");
	valveProfiles.chillerH2o =    document.getElementById("chillerH2o");
	valveProfiles.chillerBeer =   document.getElementById("chillerBeer");
	valveProfiles.boilRecirc =    document.getElementById("boilRecirc");
	valveProfiles.drain =         document.getElementById("drain");
	valveProfiles.hltHeat =       document.getElementById("hltHeat");
	valveProfiles.hltIdle =       document.getElementById("hltIdle");
	valveProfiles.kettleHeat =    document.getElementById("kettleHeat");
	valveProfiles.kettleIdle =    document.getElementById("kettleIdle");
	valveProfiles.user1 =         document.getElementById("user1");
	valveProfiles.user2 =         document.getElementById("user2");
	valveProfiles.user3 =         document.getElementById("user3");
	
	//Setup the program selector
	for (var property in programSelector){
	  var index = Number(property.replace("p", ""))-1;
	  programSelector[property] = document.querySelectorAll('[data-index="'+index+'"]')[0];
	}
	
	//Setup up the program display object
	programDisplay.name = document.getElementById('programTitle').children[1];
	programDisplay.columns.baseLeft = document.getElementById('programLeftColumn');
	programDisplay.columns.baseRight = document.getElementById('programRightColumn');
	programDisplay.columns.boilLeft = document.getElementById('boilAdditionsOptions').children[0];
	programDisplay.columns.boilRight = programDisplay.columns.boilLeft.nextElementSibling;
	programDisplay.columns.baseFooter = document.getElementById('buttonFooter');
	programDisplay.columns.boilFooter = document.getElementById('boilAddButtonFooter');
	programDisplay.spargeTemp = programDisplay.columns.baseLeft.children[0].children[1];
	programDisplay.hltTarget = programDisplay.columns.baseLeft.children[1].children[1];
	programDisplay.batchVol = programDisplay.columns.baseLeft.children[2].children[1];
	programDisplay.grainWeight = programDisplay.columns.baseLeft.children[3].children[1];
	programDisplay.boilTime = programDisplay.columns.baseLeft.children[4].children[1];
	programDisplay.mashRatio = programDisplay.columns.baseLeft.children[5].children[1];
	programDisplay.pitchTemp = programDisplay.columns.baseLeft.children[6].children[1];
	programDisplay.boilAdditionsEdit = programDisplay.columns.baseLeft.children[7].children[0];
	
	for(var property in programDisplay.mashSched){
	  var el = document.querySelectorAll('[data-mashStep="'+property+'"]')[0];
	  programDisplay.mashSched[property].temp = el.children[1];
	  programDisplay.mashSched[property].time = el.children[2];
	}
	
	programDisplay.strikeHeat.hlt = programDisplay.columns.baseRight.children[6].children[1];
	programDisplay.strikeHeat.mlt = programDisplay.strikeHeat.hlt.nextElementSibling;
	
	for(var property in programDisplay.boilAdditions){
	  var el = document.querySelectorAll('[data-boilAddID="'+property+'"]')[0];
	  programDisplay.boilAdditions[property].on = el.children[1];
	  programDisplay.boilAdditions[property].off = el.children[2];
	}
	
	programDisplay.boilAddBack = document.getElementById('boilAddBack');
	programDisplay.reloadFromBT = document.getElementById('reloadFromBT');
	programDisplay.importBeerXML = document.getElementById('importFromBeerXML');
	programDisplay.fileGetter = document.getElementById('fileGetter');
	programDisplay.exportBeerXML = document.getElementById('exportToBeerXML');
	programDisplay.exportForm.form = document.getElementById('recipeExportForm')
	programDisplay.exportForm.name = programDisplay.exportForm.form.children[0]
	programDisplay.exportForm.data = programDisplay.exportForm.name.nextElementSibling;
	programDisplay.saveToBT = document.getElementById('saveToBT');
	
	//setup the logging fold object
	logging.loggingLink = document.getElementById('loggingLink');
	logging.graphParameters.start.display = document.getElementById('logStartTime').children[1].children[0];
	logging.graphParameters.start.list = logging.graphParameters.start.display.nextElementSibling;
	logging.graphParameters.end.display = document.getElementById('logEndTime').children[1].children[0];
	logging.graphParameters.end.list = logging.graphParameters.end.display.nextElementSibling;
	logging.graphParameters.resolution.display = document.getElementById('resolution').children[0];
	logging.graphParameters.resolution.list = logging.graphParameters.resolution.display.nextElementSibling;
	logging.vesselSelectors.hlt.selector = document.getElementById('hltLogSelector');
	logging.vesselSelectors.hlt.temp.on =         logging.vesselSelectors.hlt.selector.children[0].children[0].children[1];
	logging.vesselSelectors.hlt.temp.off =        logging.vesselSelectors.hlt.selector.children[0].children[0].children[2];
	logging.vesselSelectors.hlt.targetTemp.on =   logging.vesselSelectors.hlt.selector.children[0].children[1].children[1];
	logging.vesselSelectors.hlt.targetTemp.off =  logging.vesselSelectors.hlt.selector.children[0].children[1].children[2];
	logging.vesselSelectors.hlt.heat.on =         logging.vesselSelectors.hlt.selector.children[0].children[2].children[1];
	logging.vesselSelectors.hlt.heat.off =        logging.vesselSelectors.hlt.selector.children[0].children[2].children[2];
	logging.vesselSelectors.hlt.volume.on =       logging.vesselSelectors.hlt.selector.children[0].children[3].children[1];
	logging.vesselSelectors.hlt.volume.off =      logging.vesselSelectors.hlt.selector.children[0].children[3].children[2];
	logging.vesselSelectors.hlt.targetVol.on =    logging.vesselSelectors.hlt.selector.children[0].children[4].children[1];
	logging.vesselSelectors.hlt.targetVol.off =   logging.vesselSelectors.hlt.selector.children[0].children[4].children[2];
	logging.vesselSelectors.mlt.selector = document.getElementById('mltLogSelector');
	logging.vesselSelectors.mlt.temp.on =         logging.vesselSelectors.mlt.selector.children[0].children[0].children[1];
	logging.vesselSelectors.mlt.temp.off =        logging.vesselSelectors.mlt.selector.children[0].children[0].children[2];
	logging.vesselSelectors.mlt.targetTemp.on =   logging.vesselSelectors.mlt.selector.children[0].children[1].children[1];
	logging.vesselSelectors.mlt.targetTemp.off =  logging.vesselSelectors.mlt.selector.children[0].children[1].children[2];
	logging.vesselSelectors.mlt.heat.on =         logging.vesselSelectors.mlt.selector.children[0].children[2].children[1];
	logging.vesselSelectors.mlt.heat.off =        logging.vesselSelectors.mlt.selector.children[0].children[2].children[2];
	logging.vesselSelectors.mlt.volume.on =       logging.vesselSelectors.mlt.selector.children[0].children[3].children[1];
	logging.vesselSelectors.mlt.volume.off =      logging.vesselSelectors.mlt.selector.children[0].children[3].children[2];
	logging.vesselSelectors.mlt.targetVol.on =    logging.vesselSelectors.mlt.selector.children[0].children[4].children[1];
	logging.vesselSelectors.mlt.targetVol.off =   logging.vesselSelectors.mlt.selector.children[0].children[4].children[2];
	logging.vesselSelectors.kettle.selector = document.getElementById('kettleLogSelector');
	logging.vesselSelectors.kettle.temp.on =         logging.vesselSelectors.kettle.selector.children[0].children[0].children[1];
	logging.vesselSelectors.kettle.temp.off =        logging.vesselSelectors.kettle.selector.children[0].children[0].children[2];
	logging.vesselSelectors.kettle.targetTemp.on =   logging.vesselSelectors.kettle.selector.children[0].children[1].children[1];
	logging.vesselSelectors.kettle.targetTemp.off =  logging.vesselSelectors.kettle.selector.children[0].children[1].children[2];
	logging.vesselSelectors.kettle.heat.on =         logging.vesselSelectors.kettle.selector.children[0].children[2].children[1];
	logging.vesselSelectors.kettle.heat.off =        logging.vesselSelectors.kettle.selector.children[0].children[2].children[2];
	logging.vesselSelectors.kettle.volume.on =       logging.vesselSelectors.kettle.selector.children[0].children[3].children[1];
	logging.vesselSelectors.kettle.volume.off =      logging.vesselSelectors.kettle.selector.children[0].children[3].children[2];
	logging.vesselSelectors.kettle.targetVol.on =    logging.vesselSelectors.kettle.selector.children[0].children[4].children[1];
	logging.vesselSelectors.kettle.targetVol.off =   logging.vesselSelectors.kettle.selector.children[0].children[4].children[2];
	logging.graphDisplay = document.getElementById('logGraph');
	logging.exportPDF = document.getElementById('logExportBar').children[0];
	logging.exportJPEG = logging.exportPDF.nextElementSibling;
	logging.dataRange.resolution = Number(logging.graphParameters.resolution.display.dataset.selected); //ensure the internal resolution variable gets initialized
		
		
	//setup settings tab object
	settingsTabs.global.tab =         document.getElementById('SettingsMenu').children[0];
	settingsTabs.global.indicator =   settingsTabs.global.tab.children[1];
	settingsTabs.global.tabDisplay =  document.getElementById('GlobalSettings');
	settingsTabs.hlt.tab =            document.getElementById('SettingsMenu').children[1];
	settingsTabs.hlt.indicator =      settingsTabs.hlt.tab.children[1];
	settingsTabs.hlt.tabDisplay =     document.getElementById('HLTSettings');
	settingsTabs.mlt.tab =            document.getElementById('SettingsMenu').children[2];
	settingsTabs.mlt.indicator =      settingsTabs.mlt.tab.children[1];
	settingsTabs.mlt.tabDisplay =     document.getElementById('MLTSettings');
	settingsTabs.kettle.tab =         document.getElementById('SettingsMenu').children[3];
	settingsTabs.kettle.indicator =   settingsTabs.kettle.tab.children[1];
	settingsTabs.kettle.tabDisplay =  document.getElementById('KettleSettings');
	
	//setup global settings object
	globalSettings.addressDisplay =                         document.getElementById("Address");
	globalSettings.vesselDisplayOptions.hlt.showButton =    document.getElementById('hltDisp').children[1];
	globalSettings.vesselDisplayOptions.hlt.hideButton =    document.getElementById('hltDisp').children[2];
	globalSettings.vesselDisplayOptions.mlt.showButton =    document.getElementById('mltDisp').children[1];
	globalSettings.vesselDisplayOptions.mlt.hideButton =    document.getElementById('mltDisp').children[2];
	globalSettings.vesselDisplayOptions.kettle.showButton = document.getElementById('kettleDisp').children[1];
	globalSettings.vesselDisplayOptions.kettle.hideButton = document.getElementById('kettleDisp').children[2];
	globalSettings.autoUpdate.onButton =                    document.getElementById('autoUpdate').childNodes[3];
	globalSettings.autoUpdate.offButton =                   document.getElementById('autoUpdate').childNodes[5];
	globalSettings.autoUpdate.frequencyDisplay =            document.getElementById('autoUpdateFrequency').children[1];
	
	//setup hlt settings object
	hltSettings.output.pidSwitch.on =               settingsTabs.hlt.tabDisplay.children[0].children[0].children[1];
	hltSettings.output.pidSwitch.off =              hltSettings.output.pidSwitch.on.nextElementSibling;
	hltSettings.output.hysteresis.display =         settingsTabs.hlt.tabDisplay.children[0].children[1].children[1];
	hltSettings.output.hysteresis.increaseButton =  hltSettings.output.hysteresis.display.nextElementSibling;
	hltSettings.output.hysteresis.decreaseButton =  hltSettings.output.hysteresis.increaseButton.nextElementSibling;
	hltSettings.output.pidSettingsDisplay =         settingsTabs.hlt.tabDisplay.children[0].children[2];
	hltSettings.output.pGain.display =              hltSettings.output.pidSettingsDisplay.children[0].children[1];
	hltSettings.output.pGain.increaseButton =       hltSettings.output.pGain.display.nextElementSibling;
	hltSettings.output.pGain.decreaseButton =       hltSettings.output.pGain.increaseButton.nextElementSibling;
	hltSettings.output.iGain.display =              hltSettings.output.pidSettingsDisplay.children[1].children[1];
	hltSettings.output.iGain.increaseButton =       hltSettings.output.iGain.display.nextElementSibling;
	hltSettings.output.iGain.decreaseButton =       hltSettings.output.iGain.increaseButton.nextElementSibling;
	hltSettings.output.dGain.display =              hltSettings.output.pidSettingsDisplay.children[2].children[1];
	hltSettings.output.dGain.increaseButton =       hltSettings.output.dGain.display.nextElementSibling;
	hltSettings.output.dGain.decreaseButton =       hltSettings.output.dGain.increaseButton.nextElementSibling;
	hltSettings.output.cycleTime.display =          hltSettings.output.pidSettingsDisplay.children[3].children[1];
	hltSettings.output.cycleTime.increaseButton =   hltSettings.output.cycleTime.display.nextElementSibling;
	hltSettings.output.cycleTime.decreaseButton =   hltSettings.output.cycleTime.increaseButton.nextElementSibling;
	//setup mlt settings object
	mltSettings.output.pidSwitch.on =               settingsTabs.mlt.tabDisplay.children[0].children[0].children[1];
	mltSettings.output.pidSwitch.off =              mltSettings.output.pidSwitch.on.nextElementSibling;
	mltSettings.output.hysteresis.display =         settingsTabs.mlt.tabDisplay.children[0].children[1].children[1];
	mltSettings.output.hysteresis.increaseButton =  mltSettings.output.hysteresis.display.nextElementSibling;
	mltSettings.output.hysteresis.decreaseButton =  mltSettings.output.hysteresis.increaseButton.nextElementSibling;
	mltSettings.output.pidSettingsDisplay =         settingsTabs.mlt.tabDisplay.children[0].children[2];
	mltSettings.output.pGain.display =              mltSettings.output.pidSettingsDisplay.children[0].children[1];
	mltSettings.output.pGain.increaseButton =       mltSettings.output.pGain.display.nextElementSibling;
	mltSettings.output.pGain.decreaseButton =       mltSettings.output.pGain.increaseButton.nextElementSibling;
	mltSettings.output.iGain.display =              mltSettings.output.pidSettingsDisplay.children[1].children[1];
	mltSettings.output.iGain.increaseButton =       mltSettings.output.iGain.display.nextElementSibling;
	mltSettings.output.iGain.decreaseButton =       mltSettings.output.iGain.increaseButton.nextElementSibling;
	mltSettings.output.dGain.display =              mltSettings.output.pidSettingsDisplay.children[2].children[1];
	mltSettings.output.dGain.increaseButton =       mltSettings.output.dGain.display.nextElementSibling;
	mltSettings.output.dGain.decreaseButton =       mltSettings.output.dGain.increaseButton.nextElementSibling;
	mltSettings.output.cycleTime.display =          mltSettings.output.pidSettingsDisplay.children[3].children[1];
	mltSettings.output.cycleTime.increaseButton =   mltSettings.output.cycleTime.display.nextElementSibling;
	mltSettings.output.cycleTime.decreaseButton =   mltSettings.output.cycleTime.increaseButton.nextElementSibling;
	//setup kettle settings object
	kettleSettings.output.pidSwitch.on =               settingsTabs.kettle.tabDisplay.children[0].children[0].children[1];
	kettleSettings.output.pidSwitch.off =              kettleSettings.output.pidSwitch.on.nextElementSibling;
	kettleSettings.output.hysteresis.display =         settingsTabs.kettle.tabDisplay.children[0].children[1].children[1];
	kettleSettings.output.hysteresis.increaseButton =  kettleSettings.output.hysteresis.display.nextElementSibling;
	kettleSettings.output.hysteresis.decreaseButton =  kettleSettings.output.hysteresis.increaseButton.nextElementSibling;
	kettleSettings.output.pidSettingsDisplay =         settingsTabs.kettle.tabDisplay.children[0].children[2];
	kettleSettings.output.pGain.display =              kettleSettings.output.pidSettingsDisplay.children[0].children[1];
	kettleSettings.output.pGain.increaseButton =       kettleSettings.output.pGain.display.nextElementSibling;
	kettleSettings.output.pGain.decreaseButton =       kettleSettings.output.pGain.increaseButton.nextElementSibling;
	kettleSettings.output.iGain.display =              kettleSettings.output.pidSettingsDisplay.children[1].children[1];
	kettleSettings.output.iGain.increaseButton =       kettleSettings.output.iGain.display.nextElementSibling;
	kettleSettings.output.iGain.decreaseButton =       kettleSettings.output.iGain.increaseButton.nextElementSibling;
	kettleSettings.output.dGain.display =              kettleSettings.output.pidSettingsDisplay.children[2].children[1];
	kettleSettings.output.dGain.increaseButton =       kettleSettings.output.dGain.display.nextElementSibling;
	kettleSettings.output.dGain.decreaseButton =       kettleSettings.output.dGain.increaseButton.nextElementSibling;
	kettleSettings.output.cycleTime.display =          kettleSettings.output.pidSettingsDisplay.children[3].children[1];
	kettleSettings.output.cycleTime.increaseButton =   kettleSettings.output.cycleTime.display.nextElementSibling;
	kettleSettings.output.cycleTime.decreaseButton =   kettleSettings.output.cycleTime.increaseButton.nextElementSibling;
	
	//create and insert the charts for the volume display
	hlt.volumeChart = new Highcharts.Chart({
		chart: {
	  		renderTo: 'HLTChart',
	     	type: 'column',
			backgroundColor: 'rgba(0,0,0,0)',
	   },
		credits: {enabled:false},
		legend: {enabled:false},
	   title: {
	   	text: ''
	  	},
	   xAxis: {
			labels:{enabled: false},
			tickLength: 0,
	   },
	   yAxis: {
	    	title: {
	        	text: ''
	      },
			labels: {enabled:true},
			gridLineColor: 'rgba(255,0,0,1)',
	   },
		tooltip: {enabled:false},
	   series: [{
	   	name: 'Volume',
	      data: [1]
	   }],
    exporting: {enabled: false}
	});
		
	mlt.volumeChart = new Highcharts.Chart({
	 	chart: {
	   	renderTo: 'MLTChart',
	      type: 'column',
			backgroundColor: 'rgba(0,0,0,0)',
		},
		credits: {enabled:false},
		legend: {enabled:false},
	   title: {
			text: ''
		},
		xAxis: {
			labels:{enabled: false},
			tickLength: 0,
		},
		yAxis: {
			title: {
		     	text: ''
		   },
			labels: {enabled:true},
			gridLineColor: 'rgba(255,0,0,1)',
		},
		tooltip: {enabled:false},
		series: [{
			name: 'Volume',
		   data: [1]
		}],
   	exporting: {enabled: false}
	});
			
	kettle.volumeChart = new Highcharts.Chart({
	 	chart: {
	   	renderTo: 'KETTLEChart',
	      type: 'column',
			backgroundColor: 'rgba(0,0,0,0)',
		},
		credits: {enabled:false},
		legend: {enabled:false},
		title: {
			text: ''
		},
		xAxis: {
			labels:{enabled: false},
			tickLength: 0,
		},
		yAxis: {
		 	title: {
		      	text: ''
		   },
			labels: {enabled:true},
			gridLineColor: 'rgba(255,0,0,1)',
		},
		tooltip: {enabled:false},
		series: [{
		  	name: 'Volume',
		   data: [1]
		}],
		exporting: {enabled: false}
	});
	
	Highcharts.theme = {
     colors: ["#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
     chart: {
        backgroundColor: {
           linearGradient: [0, 0, 0, 400],
           stops: [
              [0, 'rgb(96, 96, 96)'],
              [1, 'rgb(16, 16, 16)']
           ]
        },
        borderWidth: 0,
        borderRadius: 15,
        plotBackgroundColor: null,
        plotShadow: false,
        plotBorderWidth: 0
     },
     title: {
        style: {
           color: '#FFF',
           font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
        }
     },
     subtitle: {
        style: {
           color: '#DDD',
           font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
        }
     },
     xAxis: {
        gridLineWidth: 0,
        lineColor: '#999',
        tickColor: '#999',
        labels: {
           style: {
              color: '#999',
              fontWeight: 'bold'
           }
        },
        title: {
           style: {
              color: '#AAA',
              font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
           }
        }
     },
     yAxis: {
        alternateGridColor: null,
        minorTickInterval: null,
        gridLineColor: 'rgba(255, 255, 255, .1)',
        lineWidth: 0,
        tickWidth: 0,
        labels: {
           style: {
              color: '#999',
              fontWeight: 'bold'
           }
        },
        title: {
           style: {
              color: '#AAA',
              font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
           }
        }
     },
     legend: {
        itemStyle: {
           color: '#CCC'
        },
        itemHoverStyle: {
           color: '#FFF'
        },
        itemHiddenStyle: {
           color: '#333'
        }
     },
     labels: {
        style: {
           color: '#CCC'
        }
     },
     tooltip: {
        backgroundColor: {
           linearGradient: [0, 0, 0, 50],
           stops: [
              [0, 'rgba(96, 96, 96, .8)'],
              [1, 'rgba(16, 16, 16, .8)']
           ]
        },
        borderWidth: 0,
        style: {
           color: '#FFF'
        }
     },


     plotOptions: {
        line: {
           dataLabels: {
              color: '#CCC'
           },
           marker: {
              lineColor: '#333'
           }
        },
        spline: {
           marker: {
              lineColor: '#333'
           }
        },
        scatter: {
           marker: {
              lineColor: '#333'
           }
        },
        candlestick: {
           lineColor: 'white'
        }
     },

     toolbar: {
        itemStyle: {
           color: '#CCC'
        }
     },

     navigation: {
        buttonOptions: {
           backgroundColor: {
              linearGradient: [0, 0, 0, 20],
              stops: [
                 [0.4, '#606060'],
                 [0.6, '#333333']
              ]
           },
           borderColor: '#000000',
           symbolStroke: '#C0C0C0',
           hoverSymbolStroke: '#FFFFFF'
        }
     },

     exporting: {
        buttons: {
           exportButton: {
              symbolFill: '#55BE3B'
           },
           printButton: {
              symbolFill: '#7797BE'
           }
        }
     },

     // scroll charts
     rangeSelector: {
        buttonTheme: {
           fill: {
              linearGradient: [0, 0, 0, 20],
              stops: [
                 [0.4, '#888'],
                 [0.6, '#555']
              ]
           },
           stroke: '#000000',
           style: {
              color: '#CCC',
              fontWeight: 'bold'
           },
           states: {
              hover: {
                 fill: {
                    linearGradient: [0, 0, 0, 20],
                    stops: [
                       [0.4, '#BBB'],
                       [0.6, '#888']
                    ]
                 },
                 stroke: '#000000',
                 style: {
                    color: 'white'
                 }
              },
              select: {
                 fill: {
                    linearGradient: [0, 0, 0, 20],
                    stops: [
                       [0.1, '#000'],
                       [0.3, '#333']
                    ]
                 },
                 stroke: '#000000',
                 style: {
                    color: 'yellow'
                 }
              }
           }
        },
        inputStyle: {
           backgroundColor: '#333',
           color: 'silver'
        },
        labelStyle: {
           color: 'silver'
        }
     },

     navigator: {
        handles: {
           backgroundColor: '#666',
           borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(16, 16, 16, 0.5)',
        series: {
           color: '#7798BF',
           lineColor: '#A6C7ED'
        }
     },

     scrollbar: {
        barBackgroundColor: {
              linearGradient: [0, 0, 0, 20],
              stops: [
                 [0.4, '#888'],
                 [0.6, '#555']
              ]
           },
        barBorderColor: '#CCC',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: {
              linearGradient: [0, 0, 0, 20],
              stops: [
                 [0.4, '#888'],
                 [0.6, '#555']
              ]
           },
        buttonBorderColor: '#CCC',
        rifleColor: '#FFF',
        trackBackgroundColor: {
           linearGradient: [0, 0, 0, 10],
           stops: [
              [0, '#000'],
              [1, '#333']
           ]
        },
        trackBorderColor: '#666'
     },

     // special colors for some of the demo examples
     legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
     legendBackgroundColorSolid: 'rgb(70, 70, 70)',
     dataLabelsColor: '#444',
     textColor: '#E0E0E0',
     maskColor: 'rgba(255,255,255,0.3)'
  };

  // Apply the theme
  var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
  
	
	//create and render chart for logging display
  logging.chart = new Highcharts.Chart({
    chart: {
      renderTo: 'logGraph',
      zoomType: 'xy',
      alignTicks: false,
    },
    credits: {enabled: false},
    legend: {enabled: true},
    title: {text: ''},
    yAxis: [
    {
     title: {text: 'Temperature'},
     min: 0
    },
    {
      title: {text: 'Heat %'},
      max: 100,
      min: 0,
      gridLineWidth: 0,
    },
    {
      title: {text: 'Volume'},
      opposite: true,
      min: 0,
      gridLineWidth: 0
    }
    ],
    xAxis: [{
    labels: {enabled: false}
    }],
    tooltip: {pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>'},
    exporting: {enabled: true, url:"http://export.highcharts.com", buttons: {printButton: {enabled: false}, exportButton: {enabled: false}}}
  });
	
	//Add calls to viewcontroller class methods to display objects		
	monitorFoldButtons.fullscreenToggle.addEventListener('click', fullScreenToggle);
	//ensure we always capture the cancel fullscreen request from the user
	if (document.body.webkitRequestFullScreen) document.addEventListener('webkitfullscreenchange', fullScreenToggle);
	if (document.body.mozRequestFullScreen) document.addEventListener('mozfullscreenchange', fullScreenToggle);
	monitorFoldButtons.update.addEventListener('click', update);
	if (!document.body.webkitRequestFullScreen && !document.body.mozRequestFullScreen) $(monitorFoldButtons.fullscreenToggle).addClass('Hidden');
	
	//handlers for editable target temperature displays	
	hlt.targetTemperatureDisplay.onkeypress =     targetTemperatureOnKeypress;
	hlt.targetTemperatureDisplay.onblur =         targetTemperatureOnBlur;
	mlt.targetTemperatureDisplay.onkeypress =     targetTemperatureOnKeypress;
	mlt.targetTemperatureDisplay.onblur =         targetTemperatureOnBlur;
	kettle.targetTemperatureDisplay.onkeypress =  targetTemperatureOnKeypress;
	kettle.targetTemperatureDisplay.onblur =      targetTemperatureOnBlur;	
	
	//handlers for valve profile displays
	for (var property in valveProfiles){
		valveProfiles[property].onclick = valveProfileOnClick;
		valveProfiles[property].oncontextmenu = valveProfileOnRightClick;
	}
	//handler for valve profile wrapper element
	document.getElementById('Valves').oncontextmenu = function(){return false;}; //ensure that the context menu doesnt intrude on accidental right clicks on it
	
	//add handlers for program display elements
	programDisplay.boilAdditionsEdit.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	programDisplay.boilAddBack.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	programDisplay.reloadFromBT.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	programDisplay.importBeerXML.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	if (navigator.userAgent.toUpperCase().lastIndexOf("MOBILE") != -1) $(programDisplay.importBeerXML).addClass('Hidden');
	programDisplay.fileGetter.addEventListener('change', function(event){BTUI.viewPort.loadBeerXMLFile(event);});
	programDisplay.exportBeerXML.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	if (navigator.userAgent.toUpperCase().lastIndexOf("MOBILE") != -1) $(programDisplay.exportBeerXML).addClass('Hidden');
	programDisplay.saveToBT.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	programDisplay.strikeHeat.hlt.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	programDisplay.strikeHeat.mlt.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	
	for (var property in programDisplay.boilAdditions){
	  programDisplay.boilAdditions[property].on.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	  programDisplay.boilAdditions[property].off.addEventListener('click', function(event){BTUI.viewPort.programButtonClickHandler(event);});
	}
	
	for (var property in programSelector){
	  programSelector[property].addEventListener('click', function(event){BTUI.viewPort.programSelect(event);});
	}
	
	programDisplay.name.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.name.onkeypress = programTitleOnKeyPress; //We need to use the onkeypress handler, as using addEventListener fires too late to block pressing of illegal keys
	programDisplay.spargeTemp.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.spargeTemp.onkeypress = programOnKeyPress;
	programDisplay.hltTarget.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.hltTarget.onkeypress = programOnKeyPress;
	programDisplay.batchVol.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.batchVol.onkeypress = programOnKeyPressDecimals;
	programDisplay.grainWeight.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.grainWeight.onkeypress = programOnKeyPressDecimals;
	programDisplay.boilTime.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.boilTime.onkeypress = programOnKeyPress;
	programDisplay.mashRatio.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.mashRatio.onkeypress = programOnKeyPressDecimals;
	programDisplay.pitchTemp.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	programDisplay.pitchTemp.onkeypress = programOnKeyPress;
	
	for(var property in programDisplay.mashSched){
	  programDisplay.mashSched[property].temp.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	  programDisplay.mashSched[property].temp.onkeypress = programOnKeyPress;
	  programDisplay.mashSched[property].time.addEventListener('blur', function(event){BTUI.viewPort.programEditableFieldEventHandler(event);});
	  programDisplay.mashSched[property].time.onkeypress = programOnKeyPress;
	}
	
	//add handlers for logging fold
	logging.loggingLink.addEventListener('click', function(){BTUI.viewPort.updateLoggingParameters();});
	var resChild = logging.graphParameters.resolution.list.children;
	for (var i = 0; i < resChild.length; i++){
	  resChild[i].addEventListener('click', function(event){BTUI.viewPort.loggingTimeParameterHandler(event);});
	}
	for (var property in logging.vesselSelectors){
	  for (var prop in logging.vesselSelectors[property]){
	    if (prop == "selector") continue;
	    logging.vesselSelectors[property][prop].on.addEventListener('click', function(event){BTUI.viewPort.loggingSeriesHandler(event);});
  	  logging.vesselSelectors[property][prop].off.addEventListener('click', function(event){BTUI.viewPort.loggingSeriesHandler(event);});
	  }
	}
	logging.exportPDF.addEventListener('click', function(event){BTUI.viewPort.loggingExportHandler(event)});
	logging.exportJPEG.addEventListener('click', function(event){BTUI.viewPort.loggingExportHandler(event)});
	
	//add handler for settings tabs
	for (var property in settingsTabs){
		settingsTabs[property].tab.addEventListener("click", function(event){BTUI.viewPort.tabSwitchHandler(event);});
	}
	
	//Global Settings Tab Handlers
	//handlers for address field
	globalSettings.addressDisplay.addEventListener('keypress', function(event){BTUI.viewPort.addressHandler(event);});
	globalSettings.addressDisplay.addEventListener('blur', function(event){BTUI.viewPort.addressHandler(event);});
	globalSettings.addressDisplay.addEventListener('submit', function(event){BTUI.viewPort.addressHandler(event);});
	//handlers for vessel display options
	for (var vessel in globalSettings.vesselDisplayOptions){
		for (property in globalSettings.vesselDisplayOptions[vessel]){
			globalSettings.vesselDisplayOptions[vessel][property].addEventListener('click', function(event){BTUI.viewPort.vesselDisplayHandler(event);});
		}
	}
	//handler for auto update
	for (var property in globalSettings.autoUpdate){
		if(property != "frequencyDisplay"){
			globalSettings.autoUpdate[property].addEventListener('click', function(event){BTUI.viewPort.autoUpdateHandler(event);});
		}
	}
	globalSettings.autoUpdate.frequencyDisplay.onkeypress = autoUpdateFrequencyOnKeyPress;
	globalSettings.autoUpdate.frequencyDisplay.addEventListener("blur", function(event){BTUI.viewPort.autoUpdateHandler(event);});
	
	//hlt Settings Tab Handlers
	for (var property in hltSettings.output){
	  if (property != "pidSettingsDisplay") 
	    for (var p in hltSettings.output[property]){
	      if (p != "display") hltSettings.output[property][p].addEventListener('click', function(event){BTUI.viewPort.vesselSettingsButtonHandler(event);});
	  }
	}
	//mlt Settings Tab Handlers
	for (var property in mltSettings.output){
	  if (property != "pidSettingsDisplay") 
	    for (var p in mltSettings.output[property]){
	      if (p != "display") mltSettings.output[property][p].addEventListener('click', function(event){BTUI.viewPort.vesselSettingsButtonHandler(event);});
	  }
	}
	//kettle Settings tab handlers
	for (var property in kettleSettings.output){
	  if (property != "pidSettingsDisplay") 
	    for (var p in kettleSettings.output[property]){
	      if (p != "display") kettleSettings.output[property][p].addEventListener('click', function(event){BTUI.viewPort.vesselSettingsButtonHandler(event);});
	  }
	}
	
			
	};
	
	
	/*-------------------------/*
	//  public class methods  //
	/*------------------------*/
	
	this.updateHandler = function(){
		if (!BrewTroller.isAutoUpdating()) BrewTroller.update();
	};
	
	this.fullScreenHandler = function(event){
	  if (event.type == "webkitfullscreenchange" || event.type == "mozfullscreenchange"){
	    if (document.webkitCurrentFullScreenElement == null && document.mozCurrentFullScreenElement == null){
	      monitorFoldButtons.fullscreenToggle.textContent = "Go Fullscreen";
	    }
	    return;
	  }
		var monitorFold = document.getElementById('Monitor');
		if (document.webkitIsFullScreen != undefined){
			if (document.webkitIsFullScreen){
				document.webkitCancelFullScreen();
				monitorFoldButtons.fullscreenToggle.textContent = "Go Fullscreen";
			} 
			else{
				monitorFold.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				if (document.webkitCurrentFullScreenElement == null) monitorFold.webkitRequestFullScreen(); //fix for safari failing to enter fullscreen when requesting with keyboard input allowed
				monitorFoldButtons.fullscreenToggle.textContent = "Exit Fullscreen";
			}
		} else if (document.mozFullScreen != undefined){
			if (document.mozFullScreen){
				 document.mozCancelFullScreen();
				monitorFoldButtons.fullscreenToggle.textContent = "Go Fullscreen";
			}
			else{
				monitorFold.mozRequestFullScreen();
				monitorFoldButtons.fullscreenToggle.textContent = "Exit Fullscreen";
			}
		}
	};
	
	this.programSelect = function(event, index){
	  if (index != undefined) programDisplay.selectedProgramIndex = index;
	  else programDisplay.selectedProgramIndex = Number(event.target.dataset.index);
	  var program = BrewTroller.getProgram(programDisplay.selectedProgramIndex);
	  programDisplay.name.textContent = program.getTitle();
	  programDisplay.spargeTemp.textContent = program.getSpargeTemperature();
	  programDisplay.hltTarget.textContent = program.getHLTTargetTemperature();
	  programDisplay.batchVol.textContent = program.getBatchVolume();
	  programDisplay.grainWeight.textContent = program.getGrainWeight();
	  programDisplay.boilTime.textContent = program.getBoilLength();
	  programDisplay.mashRatio.textContent = program.getMashRatio();
	  programDisplay.pitchTemp.textContent = program.getPitchTemperature();
	  
	  if (program.getStrikeHeatVessel() == 'mlt'){
	    $(programDisplay.strikeHeat.mlt).addClass('selected');
	    $(programDisplay.strikeHeat.hlt).removeClass('selected');
	  } else {
	    $(programDisplay.strikeHeat.mlt).removeClass('selected');
	    $(programDisplay.strikeHeat.hlt).addClass('selected');
	  }
	  
	  var mashSched = program.getMashSchedule();
	  
	  for(var property in mashSched){
	    programDisplay.mashSched[property].time.textContent = mashSched[property].time;
	    programDisplay.mashSched[property].temp.textContent = mashSched[property].temperature;
	  }
	  
	  var boilAdds = program.getBoilAdditions();
	  
	  for (var property in boilAdds){
	    if (boilAdds[property].state){
	      $(programDisplay.boilAdditions[property].on).addClass('selected');
	      $(programDisplay.boilAdditions[property].off).removeClass('selected');
	    } else{
	      $(programDisplay.boilAdditions[property].on).removeClass('selected');
	      $(programDisplay.boilAdditions[property].off).addClass('selected');
	    }
	  }	  
	};
	
	this.programButtonClickHandler = function(event){
	  if (event.target == programDisplay.boilAdditionsEdit || event.target == programDisplay.boilAddBack) return programDisplayHandler(event);
	  if (event.target.parentElement.dataset.boiladdid != undefined){
	  /*Handle changing of boil addition options here*/
	  if ($(event.target).hasClass('selected')) return; //return if the clicked option is already selected
	  $(programDisplay.boilAdditions[event.target.parentElement.dataset.boiladdid].on).toggleClass('selected');
	  $(programDisplay.boilAdditions[event.target.parentElement.dataset.boiladdid].off).toggleClass('selected');
	  return;
	  }
	  if (event.target.parentElement.id == "strikeHeat" && !$(event.target).hasClass('selected')){
	    $(programDisplay.strikeHeat.hlt).toggleClass('selected');
	    $(programDisplay.strikeHeat.mlt).toggleClass('selected');
	    return;
	  }
	  if (event.target == programDisplay.reloadFromBT) return reloadProgramFromBT(); 
	  if (event.target == programDisplay.importBeerXML) return importBeerXML();
	  if (event.target == programDisplay.exportBeerXML) return exportBeerXML();
	  if (event.target == programDisplay.saveToBT) return saveProgramToBrewTroller();
	};
	
	this.programEditableFieldEventHandler = function(event){
	  if (event.target == programDisplay.spargeTemp || event.target == programDisplay.hltTarget || event.target == programDisplay.pitchTemp || event.target == programDisplay.mashSched.doughIn.temp ||
	      event.target == programDisplay.mashSched.acid.temp || event.target == programDisplay.mashSched.protein.temp || event.target == programDisplay.mashSched.sacch.temp || event.target == programDisplay.mashSched.sacch2.temp ||
	      event.target == programDisplay.mashSched.mashOut.temp){
	    if (Number(event.target.textContent) > 225) event.target.textContent = 212;
	    return;
	  }
	  if (event.target == programDisplay.mashSched.doughIn.time || event.target == programDisplay.mashSched.acid.time || event.target == programDisplay.mashSched.protein.time ||
	      event.target == programDisplay.mashSched.sacch.time || event.target == programDisplay.mashSched.sacch2.time || event.target == programDisplay.mashSched.mashOut.time){
	    if (Number(event.target.textContent) > 119) event.target.textContent = 119;
	    return;
	  }
	  if (event.target == programDisplay.boilTime){
	   if (Number(event.target.textContent) > 179) event.target.textContent = 179;
	   return;
    }
    if (event.target == programDisplay.mashRatio){
      if (Number(event.target.textContent) > 9.99) event.target.textContent = 9.99;
      return;
    }
	};
	
	this.loadBeerXMLFile = function(event){
	  importBeerXML(event);
	};
	
	this.reloadProgramFromBrewTrollerEventHandler = function(event){
	  var program = BrewTroller.getProgram(programDisplay.selectedProgramIndex);
	  switch (event){
	    case "title":
	      programDisplay.name.textContent = program.getTitle();
	      break;
	    case "programTemperatures":
	      var mashSched = program.getMashSchedule();
	      for (var property in mashSched){
	        programDisplay.mashSched[property].temp.textContent = mashSched[property].temperature;
	      }
	      break;
	    case "programTimes":
	      var mashSched = program.getMashSchedule();
	      for (var property in mashSched){
	        programDisplay.mashSched[property].time.textContent = mashSched[property].time;
	      }
	      break;
	    case "globals":
	      programDisplay.spargeTemp.textContent = program.getSpargeTemperature();
    	  programDisplay.hltTarget.textContent = program.getHLTTargetTemperature();
    	  programDisplay.boilTime.textContent = program.getBoilLength();
    	  programDisplay.pitchTemp.textContent = program.getPitchTemperature();
    	  
    	  if (program.getStrikeHeatVessel() == 'mlt'){
    	    $(programDisplay.strikeHeat.mlt).addClass('selected');
    	    $(programDisplay.strikeHeat.hlt).removeClass('selected');
    	  } else {
    	    $(programDisplay.strikeHeat.mlt).removeClass('selected');
    	    $(programDisplay.strikeHeat.hlt).addClass('selected');
    	  }
    	  
    	  var boilAdds = program.getBoilAdditions();

    	  for (var property in boilAdds){
    	    if (boilAdds[property].state){
    	      $(programDisplay.boilAdditions[property].on).addClass('selected');
    	      $(programDisplay.boilAdditions[property].off).removeClass('selected');
    	    } else{
    	      $(programDisplay.boilAdditions[property].on).removeClass('selected');
    	      $(programDisplay.boilAdditions[property].off).addClass('selected');
    	    }
    	  }
    	  break;
	    case "volumes":
	      programDisplay.batchVol.textContent = program.getBatchVolume();
    	  programDisplay.grainWeight.textContent = program.getGrainWeight();
    	  programDisplay.mashRatio.textContent = program.getMashRatio();
    	  break;
	    case "calculatedVolumes":
	      break;
	    case "grainTemperature":
	      break;
	  }
	};
	
	this.updateLoggingParameters = function(){
	  var times = BrewTroller.getUpdateTimes();
	  while (logging.graphParameters.start.list.children.length > 0){
	    logging.graphParameters.start.list.removeChild(logging.graphParameters.start.list.children[0]);
	  }
	  while (logging.graphParameters.end.list.children.length > 0){
	    logging.graphParameters.end.list.removeChild(logging.graphParameters.end.list.children[0]);
	  }
	  for (var i = 0; i < times.length; i++){
	    var date = new Date(times[i]);
	    var timeStr = date.toLocaleTimeString();
	    var item = document.createElement('span');
	    var item2 = document.createElement('span');
	    item.textContent = timeStr;
	    item2.textContent = timeStr;
	    item.dataset.timeStamp = times[i];
	    item2.dataset.timeStamp = times[i];
	    item.addEventListener('click', function(event){BTUI.viewPort.loggingTimeParameterHandler(event);});
	    item2.addEventListener('click', function(event){BTUI.viewPort.loggingTimeParameterHandler(event);});
	    logging.graphParameters.start.list.appendChild(item);
	    logging.graphParameters.end.list.appendChild(item2);
	  }
	};
	
	this.loggingTimeParameterHandler = function(event){
	  if (event.target.parentElement.parentElement.id == 'startTime'){
	    if (Number(event.target.dataset.timeStamp) < Number(logging.graphParameters.end.display.dataset.selected)){
	      logging.graphParameters.start.display.textContent = event.target.textContent;
	      logging.dataRange.start = logging.graphParameters.start.display.dataset.selected = Number(event.target.dataset.timeStamp);
	    } else if (Number(logging.graphParameters.end.display.dataset.selected) == -1){
	      logging.graphParameters.start.display.textContent = event.target.textContent;
	      logging.dataRange.start = logging.graphParameters.start.display.dataset.selected = Number(event.target.dataset.timeStamp);
	      logging.graphParameters.end.display.textContent = event.target.textContent;
	      logging.dataRange.end = logging.graphParameters.end.display.dataset.selected = Number(event.target.dataset.timeStamp);
	    } 
	  } else if (event.target.parentElement.parentElement.id == 'endTime'){
	    if (Number(event.target.dataset.timeStamp) > Number(logging.graphParameters.start.display.dataset.selected) && Number(logging.graphParameters.start.display.dataset.selected) != -1){
	      logging.graphParameters.end.display.textContent = event.target.textContent;
	      logging.dataRange.end = logging.graphParameters.end.display.dataset.selected = Number(event.target.dataset.timeStamp);
	    } else if (Number(logging.graphParameters.start.display.dataset.selected) == -1){
	      logging.graphParameters.start.display.textContent = event.target.textContent;
	      logging.dataRange.start = logging.graphParameters.start.display.dataset.selected = Number(event.target.dataset.timeStamp);
	      logging.graphParameters.end.display.textContent = event.target.textContent;
	      logging.dataRange.end = logging.graphParameters.end.display.dataset.selected = Number(event.target.dataset.timeStamp);
	    }
	  } else if (event.target.parentElement = logging.graphParameters.resolution.list){
	    logging.graphParameters.resolution.display.textContent = event.target.textContent;
	    logging.dataRange.resolution = logging.graphParameters.resolution.display.dataset.selected = Number(event.target.dataset.resolution);
	  }
	  setGraphTimeSpan();
	};
	
	this.loggingSeriesHandler = function(event){
	  var vessel = event.target.parentElement.parentElement.dataset.vesselId;
	  var option = event.target.parentElement.dataset.option;
	  var state = event.target.dataset.state;
	  if (!$(logging.vesselSelectors[vessel][option][state]).hasClass('selected')){
	    $(logging.vesselSelectors[vessel][option].on).toggleClass('selected');
	    $(logging.vesselSelectors[vessel][option].off).toggleClass('selected');
	    setGraphSeries(vessel, option, state, true);
    }
	};
	
	this.loggingExportHandler = function(event){
	  if (event.target == logging.exportPDF) exportLogChartPDF();
	  else if (event.target == logging.exportJPEG) exportLogChartJPEG();
	};
	
	this.tabSwitchHandler = function(event){
		if (event == undefined){
			showActiveSettingsTab();
			return;
		}
		var srcEl = event.srcElement? event.srcElement : event.target; 
		var tab;
		var property;
		for (property in settingsTabs){
			if (settingsTabs[property].tab == srcEl || settingsTabs[property].tab.children[0] == srcEl || settingsTabs[property].tab.children[1] == srcEl){
				tab = settingsTabs[property];
				break;
			}
		}
		if (activeSettingsTab != property){
			hideActiveSettingsTab();			
			activeSettingsTab = property;
			setTimeout('BTUI.viewPort.tabSwitchHandler();', 600);
		}
	};
	
	this.addressHandler = function(event){
		if(event.type == 'keypress'){
			if (event.keyCode == 13) event.target.blur();
			return;
		}else if(event.type = 'blur'){
			BrewTroller.setAddress(globalSettings.addressDisplay.value);
		}
	};
	
	this.vesselDisplayHandler = function(event){
		var srcEl = event.srcElement? event.srcElement : event.target;
		var property;
		var vessel;
		outer: for (vessel in globalSettings.vesselDisplayOptions){
			for (property in globalSettings.vesselDisplayOptions[vessel]){
				if (srcEl == globalSettings.vesselDisplayOptions[vessel][property]) break outer;
			}
		}
		if (property == "showButton"){
			if(!$(srcEl).hasClass('selected'))showVessel(vessel); 
		}
		if (property == "hideButton"){
			if(!$(srcEl).hasClass('selected'))hideVessel(vessel);
		}
	}
	
	this.autoUpdateHandler = function(event){
		var srcEl = event.srcElement? event.srcElement : event.target;
		if (srcEl == globalSettings.autoUpdate.onButton){
			if (!$(srcEl).hasClass('selected')){
				$(srcEl).addClass('selected');
				$(globalSettings.autoUpdate.offButton).removeClass('selected');
				$(settingsTabs.global.tabDisplay).addClass('autoUpdateEnabled');
				$(globalSettings.autoUpdate.frequencyDisplay.parentElement).removeClass('Hidden');
				var freq = globalSettings.autoUpdate.frequencyDisplay.textContent;
				freq = Number(freq.replace(' seconds', ''));
				BrewTroller.setUpdateFrequency(freq);
				BrewTroller.startAutoUpdate();
			}
		} else if (srcEl == globalSettings.autoUpdate.offButton){
			if (!$(srcEl).hasClass('selected')){
				$(srcEl).addClass('selected');
				$(globalSettings.autoUpdate.onButton).removeClass('selected');
				$(globalSettings.autoUpdate.frequencyDisplay.parentElement).addClass('Hidden');
				$(settingsTabs.global.tabDisplay).removeClass('autoUpdateEnabled');
				BrewTroller.stopAutoUpdate();
			}
		} else if (srcEl == globalSettings.autoUpdate.frequencyDisplay) {
		  var freq = Number(globalSettings.autoUpdate.frequencyDisplay.textContent);
		  if (freq < 5){
		    globalSettings.autoUpdate.frequencyDisplay.textContent = "5";
		    freq = 5;
		  }
		  BrewTroller.setUpdateFrequency(freq);
		}
	};
	
	this.vesselSettingsButtonHandler = function(event) {
	  
	  for (var property in mltSettings.output){
	    if (property != "pidSettingsDisplay")
	      for (var p in hltSettings.output[property]){
	        if (hltSettings.output[property][p] == event.target)
	          if (property != "pidSwitch") return vesselOutputNumberHandler(event, 'hlt', hltSettings, property, p);
	          else return pidModeSwitchHandler(event, 'hlt', hltSettings, property, p);
	      }
	  }
	  
	  for (var property in mltSettings.output){
	    if (property != "pidSettingsDisplay")
	      for (var p in mltSettings.output[property]){
	        if (mltSettings.output[property][p] == event.target)
	          if (property != "pidSwitch") return vesselOutputNumberHandler(event, 'mlt', mltSettings, property, p);
	          else return pidModeSwitchHandler(event, 'mlt', mltSettings, property, p);
	      }
	  }
	  
	  for (var property in kettleSettings.output){
	    if (property != "pidSettingsDisplay")
	      for (var p in kettleSettings.output[property]){
	        if (kettleSettings.output[property][p] == event.target)
	          if (property != "pidSwitch") return vesselOutputNumberHandler(event, 'kettle', kettleSettings, property, p);
	          else return pidModeSwitchHandler(event, 'kettle', kettleSettings, property, p);
	      }
	  }
	};
	
	this.editTargetTemperature = function(event) {
		var srcEl = event.srcElement? event.srcElement : event.target;
		var vessel;
		for (property in vessels){
			if (vessels[property].targetTemperatureDisplay == srcEl){
				vessel = property;
				break;
			}
		}
		if (vessels[vessel].targetTemperatureDisplay.textContent == "") vessels[vessel].targetTemperatureDisplay.textContent = 0;
		var value = Number(vessels[vessel].targetTemperatureDisplay.textContent);
		if (value > 255) value = 255;
		if (value < 0) value = 0;
		if (vessel == 'kettle') BrewTroller.setNewBoilTemperature(value);
		else BrewTroller.getVesselWithString(vessel).setNewSetPoint(value);
	};
	
	this.updateUnits = function(){
		var tempUnit = BrewTroller.temperatureUnit();
		for (var property in units.temperature){
			units.temperature[property].textContent = String.fromCharCode(186) + tempUnit;
		}
		var volumeUnit = BrewTroller.volumeUnit();
		for (var property in units.volume){
			units.volume[property].textContent = volumeUnit;
		}
		var weightUnit = BrewTroller.weightUnit();
		for (var property in units.weight){
			units.weight[property].textContent = weightUnit;
		}
	};
	
	this.updateVesselTemperatureDisplay = function(vesselString){
		vessels[vesselString].temperatureDisplay.textContent = BrewTroller.getVesselWithString(vesselString).getTemperature().toFixed(1);
	};
	
	this.updateVesselTargetTemperatureDisplay = function(vesselString){
		if (vessels[vesselString].targetTemperatureDisplay == document.activeElement) return;
		if(vesselString == 'kettle') vessels[vesselString].targetTemperatureDisplay.textContent = BrewTroller.getBoilTemperature();
		else vessels[vesselString].targetTemperatureDisplay.textContent = BrewTroller.getVesselWithString(vesselString).getTargetTemperature();
	};
	
	this.updateVesselHeatStatusDisplay = function(vesselString){
		var status = BrewTroller.getVesselWithString(vesselString).getHeatStatus();
		if (status == 100){
			vessels[vesselString].heatOutputDisplay.textContent = "on";
		} else if (status == 0){
			vessels[vesselString].heatOutputDisplay.textContent = "off";
		} else {
			vessels[vesselString].heatOutputDisplay.textContent = status + "%";
		}
	};
	
	this.updateVesselVolumeDisplay = function(vesselString){
		vessels[vesselString].volumeDisplay.textContent = BrewTroller.getVesselWithString(vesselString).getVolume().toFixed(2);
		vessels[vesselString].volumeChart.series[0].points[0].update(BrewTroller.getVesselWithString(vesselString).getVolume(), true, true)
	};
	
	this.updateVesselTargetVolumeDisplay = function(vesselString){
		var volTarget = BrewTroller.getVesselWithString(vesselString).getTargetVolume();
		volTarget = volTarget.toFixed(2);
		vessels[vesselString].targetVolumeDisplay.textContent = volTarget;
		if (vessels[vesselString].volumeChartTargetIndicator != undefined) vessels[vesselString].volumeChartTargetIndicator.destroy();
		if (volTarget > 0) vessels[vesselString].volumeChartTargetIndicator = vessels[vesselString].volumeChart.yAxis[0].addPlotLine({color: '#00FF00', value: volTarget, width: 4});
	};
	
	this.updateVesselCapacity = function(vesselString){
		vessels[vesselString].volumeChart.yAxis[0].setExtremes(0, BrewTroller.getVesselWithString(vesselString).getCapacity(), true, true);
	};
	
	this.updateValveProfileStatus = function(){
		statusObj = BrewTroller.valves().getStatusObject();
		for (var property in valveProfiles){
			if (statusObj[property].active) $(valveProfiles[property]).addClass('active');
			else $(valveProfiles[property]).removeClass('active');
		}
	};
	
	this.toggleValveProfile = function(event){
		var srcEl = event.srcElement? event.srcElement : event.target;
		BrewTroller.valves().toggleState(srcEl.id);
	};
	
	//private class methods
	var hideActiveSettingsTab = function(){
		$(settingsTabs[activeSettingsTab].tab).removeClass('selected');
		$(settingsTabs[activeSettingsTab].indicator).addClass('tabPointerHidden');
		$(settingsTabs[activeSettingsTab].tabDisplay).addClass('SettingsTabHidden');
	};
	
	var showActiveSettingsTab = function(){
		$(settingsTabs[activeSettingsTab].tab).addClass('selected');
		$(settingsTabs[activeSettingsTab].indicator).removeClass('tabPointerHidden');
		$(settingsTabs[activeSettingsTab].tabDisplay).removeClass('SettingsTabHidden');
	};
	
	var hideVessel = function(vesselString){
		$(settingsTabs[vesselString].tab).addClass('vesselHidden');
		$(globalSettings.vesselDisplayOptions[vesselString].showButton).removeClass('selected');
		$(globalSettings.vesselDisplayOptions[vesselString].hideButton).addClass('selected');
		
		var vessel;
		if (vesselString == "hlt") vessel = hlt;
		if (vesselString == "mlt") vessel = mlt;
		if (vesselString == "kettle") vessel = kettle;
		
		$(vessel.vesselDisplay).addClass('vesselHidden');
	};
	
	var showVessel = function(vesselString){
		$(settingsTabs[vesselString].tab).removeClass('vesselHidden');
		$(globalSettings.vesselDisplayOptions[vesselString].showButton).addClass('selected');
		$(globalSettings.vesselDisplayOptions[vesselString].hideButton).removeClass('selected');
		
		var vessel;
		if (vesselString == "hlt") vessel = hlt;
		if (vesselString == "mlt") vessel = mlt;
		if (vesselString == "kettle") vessel = kettle;
		
		$(vessel.vesselDisplay).removeClass('vesselHidden');
	};
	
	var pidModeSwitchHandler = function(event, vessel, settings, property, el) {
	  	  
	  if (!$(settings.output.pidSwitch[el]).hasClass('selected')){
	    $(settings.output.pidSwitch.on).toggleClass('selected');
	    $(settings.output.pidSwitch.off).toggleClass('selected');
	    $(settings.output.pidSettingsDisplay).toggleClass('pidOptionsShow');
	    $(settings.output.hysteresis.display.parentElement).toggleClass('hiddenNumberInput');
	  }
	  
	  var state;
	  if (el = 'on') state = true;
	  else state = false;
	  
	  BrewTroller.getVesselWithString(vessel).setNewPIDMode(state);	  	  
	};
	
	var vesselOutputNumberHandler = function(event, vessel, settings, property, el) {
	  
	  var max, min, increment, unit;
	  if (property == "cycleTime" || property == "hysteresis"){
	    min = 0;
	    max = 25.5;
	    increment = 0.1;
	    if (property == "cycleTime") unit = seconds;
	    else unit = String.fromCharCode(186);
	  } else {
	    min = 0;
	    max = 255;
	    increment = 1;
	    unit = "";
	  } 
	  
	  //get the current value from the display
	  var current = settings.output[property].display.textContent;
	  current = current.replace(' seconds', '');
	  current = current.replace(String.fromCharCode(186), '');
	  current = Number(current);
	  
	  if (el == 'increaseButton') current = current + increment;
	  else current = current - increment;
	  
	  if (current < min) current = min;
	  if (current > max) current = max;
	  
	  BrewTroller.getVesselWithString(vessel).setNewOutputValue(property, current);
	  
	  current = current.toFixed(1).concat(unit);
	  settings.output[property].display.textContent = current;
	};
	
	//private class method used to handle the hiding and showing of the boil additions edit screen
	var programDisplayHandler = function(event){
	  if (event.target == programDisplay.boilAdditionsEdit){
	    $(programDisplay.columns.baseLeft).addClass("columnHidden");
	    $(programDisplay.columns.baseRight).addClass("columnHidden");
	    $(programDisplay.columns.baseFooter).addClass("buttonFooterHidden");
	    $(programDisplay.columns.boilLeft).removeClass("columnHidden");
	    $(programDisplay.columns.boilRight).removeClass("columnHidden");
	    $(programDisplay.columns.boilFooter).removeClass("buttonFooterHidden");
	  } else{
	    $(programDisplay.columns.boilLeft).addClass("columnHidden");
	    $(programDisplay.columns.boilRight).addClass("columnHidden");
	    $(programDisplay.columns.boilFooter).addClass("buttonFooterHidden");
	    $(programDisplay.columns.baseLeft).removeClass("columnHidden");
	    $(programDisplay.columns.baseRight).removeClass("columnHidden");
	    $(programDisplay.columns.baseFooter).removeClass("buttonFooterHidden");
	  }
	};
	
	//private class methods for loading a recipe from beerxml or exporting it, as well as saving to BT
	var importBeerXML = function(event){
	  if (event && event.type == "change"){
	     if (programDisplay.fileGetter.files[0] != undefined){
    	    var reader = new FileReader();
    	    var fileContents;
    	    reader.onload = function(event){
    	      BTUI.viewPort.loadBeerXMLFile(event);
    	      };
    	    reader.readAsText(programDisplay.fileGetter.files[0]);
    	  }
    	  return;
	  }
	  if (event && event.type == "load"){
	    var parser = new DOMParser();
	    var doc = parser.parseFromString(event.target.result, "text/xml");
	    if (programDisplay.selectedProgramIndex == undefined) BTUI.viewPort.programSelect(0, 0);
	    BrewTroller.getProgram(programDisplay.selectedProgramIndex).getRecipeFromBeerXML(doc);
	    reloadRecipeDisplay();
	    return;
	  }
	  programDisplay.fileGetter.value = "";
	  programDisplay.fileGetter.click();
	};
	
	var exportBeerXML = function(){
	  BrewTroller.getProgram(programDisplay.selectedProgramIndex).convertToBeerXML();
	  var xmlDoc = BrewTroller.getProgram(programDisplay.selectedProgramIndex).getRecipeInBeerXML();
	  var serializer = new XMLSerializer();
	  xmlDoc = serializer.serializeToString(xmlDoc);
	  programDisplay.exportForm.name.value = programDisplay.name.textContent;
	  programDisplay.exportForm.data.value = xmlDoc;
	  programDisplay.exportForm.form.submit();
	};
	
	var saveProgramToBrewTroller = function(){
	  var program = BrewTroller.getProgram(programDisplay.selectedProgramIndex);
	  
	  program.setNewTitle(programDisplay.name.textContent);
	  program.setNewHLTTarget(Number(programDisplay.hltTarget.textContent));
	  program.setNewSpargeTemperature(Number(programDisplay.spargeTemp.textContent));
	  program.setNewBatchVolume(Number(programDisplay.batchVol.textContent));
	  program.setNewGrainWeight(Number(programDisplay.grainWeight.textContent));
	  program.setNewBoilLength(Number(programDisplay.boilTime.textContent));
	  program.setNewMashRatio(Number(programDisplay.mashRatio.textContent));
	  program.setNewPitchTemperature(Number(programDisplay.pitchTemp.textContent));
	  
	  var mashSchedule = {};
	  for (var property in programDisplay.mashSched){
	    mashSchedule[property] = {};
	    mashSchedule[property].time = Number(programDisplay.mashSched[property].time.textContent);
	    mashSchedule[property].temperature = Number(programDisplay.mashSched[property].temp.textContent);
	  }
	  program.setNewMashSchedule(mashSchedule);
	  
	  $(programDisplay.strikeHeat.hlt).hasClass('selected') ? program.setHLTAsStrikeHeat() : program.setMLTAsStrikeHeat();
	  
	  var boilSched = {};
	  for (var property in programDisplay.boilAdditions){
	    boilSched[property] = {};
	    boilSched[property].state = $(programDisplay.boilAdditions[property].on).hasClass('selected') ? true : false;
	  }
	  program.setNewBoilAdditionsSchedule(boilSched);	  
	};
	
	var reloadRecipeDisplay = function(){
	  var program = BrewTroller.getProgram(programDisplay.selectedProgramIndex);
	  programDisplay.name.textContent = program.getTitle();
	  programDisplay.spargeTemp.textContent = program.getSpargeTemperature();
	  programDisplay.hltTarget.textContent = program.getHLTTargetTemperature();
	  programDisplay.batchVol.textContent = program.getBatchVolume();
	  programDisplay.grainWeight.textContent = program.getGrainWeight();
	  programDisplay.boilTime.textContent = program.getBoilLength();
	  programDisplay.mashRatio.textContent = program.getMashRatio();
	  programDisplay.pitchTemp.textContent = program.getPitchTemperature();
	  
	  var mashSched = program.getMashSchedule();
	  
	  for(var property in mashSched){
	    programDisplay.mashSched[property].time.textContent = mashSched[property].time;
	    programDisplay.mashSched[property].temp.textContent = mashSched[property].temperature;
	  }
	  
	  var boilAdds = program.getBoilAdditions();
	  
	  for (var property in boilAdds){
	    if (boilAdds[property].state){
	      $(programDisplay.boilAdditions[property].on).addClass('selected');
	      $(programDisplay.boilAdditions[property].off).removeClass('selected');
	    } else{
	      $(programDisplay.boilAdditions[property].on).removeClass('selected');
	      $(programDisplay.boilAdditions[property].off).addClass('selected');
	    }
	  }
	};
	
	var reloadProgramFromBT = function(){
	  BrewTroller.getProgram(programDisplay.selectedProgramIndex).reloadProgramFromBrewTroller();
	};
	
	var setGraphTimeSpan = function(){
	  var start = logging.dataRange.start;
	  var end = logging.dataRange.end;
	  var resolution = logging.dataRange.resolution;	  
	  var times = BrewTroller.getUpdateTimes();
	  var matchedTimes = [];
	  for (var i = 0; i < times.length; i++){
	    if (times[i] >= start && times[i] <= end) matchedTimes.push(times[i]);
	    if (times[i] > end) break;
	  }
	  var times = [];
	  var tempDate = new Date();
	  if (resolution == 0.75){
	    for (var i = 0; i < matchedTimes.length; i++){
  	    if (((i+1)*3)%4 != 0){
  	      tempDate.setTime(matchedTimes[i]);
  	      times.push(tempDate.toLocaleTimeString());
	      }
  	  }
	  } else {
	    for (var i = 0; i < matchedTimes.length; i++){
	      if ((i+1)%resolution == 0){
	        tempDate.setTime(matchedTimes[i]);
	        times.push(tempDate.toLocaleTimeString());
        }
	    }
	  }
	  logging.chart.xAxis[0].setCategories(times, false); //set the new categories for the x-axis
	  for (var property in logging.vesselSelectors){
	    for (var prop in logging.vesselSelectors[property]){
	      if (prop == 'selector') continue;
	      if (logging.vesselSelectors[property][prop].series != undefined){
	        logging.vesselSelectors[property][prop].series.remove();
	        setGraphSeries(property, prop, "on", false);
	      }
	    }
	  }
	  logging.chart.redraw();
	};
	
	var setGraphSeries = function(vessel, series, state, redraw){
	  if (state == "off" && logging.vesselSelectors[vessel][series].series != undefined){
	    logging.vesselSelectors[vessel][series].series.remove(true);
	    logging.vesselSelectors[vessel][series].series = undefined;
	    return;
	  } else {
	    var start = logging.dataRange.start;
	    var end = logging.dataRange.end;
	    var resolution = logging.dataRange.resolution;
	    switch(series){
	      case "temp":
	        logging.vesselSelectors[vessel][series].series = logging.chart.addSeries({name: vessel + " " + series, yAxis: 0, data: BrewTroller.getVesselWithString(vessel).getLoggedTemperature(start, end, resolution)}, false, true);
	        break;
	      case "targetTemp":
	        logging.vesselSelectors[vessel][series].series = logging.chart.addSeries({name: vessel + " " + series, yAxis: 0, data: BrewTroller.getVesselWithString(vessel).getLoggedTargetTemperature(start, end, resolution)}, false, true);
	        break;
	      case "volume":
	        logging.vesselSelectors[vessel][series].series = logging.chart.addSeries({name: vessel + " " + series, yAxis: 2, data: BrewTroller.getVesselWithString(vessel).getLoggedVolume(start, end, resolution)}, false, true);
	        break;
	      case "targetVol":
	        logging.vesselSelectors[vessel][series].series = logging.chart.addSeries({name: vessel + " " + series, yAxis: 2, data: BrewTroller.getVesselWithString(vessel).getLoggedTargetVolume(start, end, resolution)}, false, true);
	        break
	      case "heat":
	        logging.vesselSelectors[vessel][series].series = logging.chart.addSeries({name: vessel + " " + series, yAxis: 1, data: BrewTroller.getVesselWithString(vessel).getLoggedHeatStatus(start, end, resolution)}, false, true);
	        break;
	    }
	    if (redraw) logging.chart.redraw();
	  }
	};
	
	var exportLogChartPDF = function(){
	  logging.chart.exportChart({type: 'application/pdf', filename: 'BrewTrollerLiveLog'});
	};

  var exportLogChartJPEG = function(){
    logging.chart.exportChart({type: 'image/jpeg', filename: 'BrewTrollerLiveLog'});
  };
};
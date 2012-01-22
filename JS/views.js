/**
 * @author Eric Yanush
 */
//Views Controller Class
//Encapsulates all functions used to control the current state of the app ViewPort
views = function(){
	
	
	//Function to show BrewTroller Settings Window
	this.showBTSettings  = function() {
		
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var settingsWindow = document.getElementById('btSettings');		
		
		var settingsWidth = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("width")); //these are explicity casted to Strings to ensure that we can extract the required data from them
		var settingsHeight = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("height"));
		
		//We need to remove the px tag from the strings, then we can cast them to numbers and do math with them
		settingsWidth = settingsWidth.replace("px", "");
		settingsWidth = Number(settingsWidth);
		settingsHeight = settingsHeight.replace("px", "");
		settingsHeight = Number(settingsHeight);
		
		//set the x-axis position of the window to ensure it is centered properly
		settingsWindow.style.left = (window.innerWidth /2) - (settingsWidth /2) + 'px';
		
		//set the visibility types for the window and the blanket to visible and change the z-index to bring to top
		settingsWindow.style.zIndex = 9001;
		blanket.style.zIndex = 9000;
		settingsWindow.style.visibility = "visible";
		blanket.style.visibility = "visible";
		
		//set the opacity for the blanket so we get a nice fade-in effect
		blanket.style.opacity =.85;
		
		//set the height position of the window so we get a nice slide down and in effect
		settingsWindow.style.top = (window.innerHeight / 2) - (settingsHeight / 2) + 'px';	
	};
	
	//Function to close (hide) BrewTroller Settings Window
	this.closeBTSettings = function() {
		
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var settingsWindow = document.getElementById('btSettings');
		
		//remove the position we set for the window so we get a nice slide up and out effect
		settingsWindow.style.removeProperty('top');
		//remove the opacity we set for the blanket so it will fade back out
		blanket.style.removeProperty('opacity');
		
		//remove the blanket and window z-indexs and visibility attributes, so they fallback to the css rules we set
		settingsWindow.style.removeProperty('z-index');
		blanket.style.removeProperty('z-index');
		settingsWindow.style.removeProperty('visibility');
		blanket.style.removeProperty('visibility');		
	};

	this.saveBTSettings = function() {
		
		BrewTroller.saveSettings();
		
		this.closeBTSettings();
	};
	
	//Method to handle the onclick event from a vesssel Settings button
	//It first dispatches the correct vessel's settings() method to setup the view
	//the calls this.showVesselSettings() to show the view
	this.vesselSettings = function(el) {
		
		var vesselIndex = Number(el.parentElement.parentElement.dataset.vesselIndex);
		var settingsWindow = document.getElementById('vesselSettings');
		settingsWindow.dataset.vesselIndex = vesselIndex;
		
		//Show the Kettle specific option if the vessel we are editing is of index = 2
		var kettleSettings = document.getElementById('kettleSettings');
		if (settingsWindow.dataset.vesselIndex == 2){
			kettleSettings.style.display = "block";
			//fire the PID checkbox change function to calculate the height
			document.getElementById('vesselPIDMode').onchange();
			//set the kettle specific display options values to match current ones
			document.getElementById('evapRate').value = BrewTroller.getEvapRate();
			document.getElementById('boilTemp').value = BrewTroller.getBoilTemp();
		} else {
			document.getElementById('kettleSettings').style.removeProperty('display');
			document.getElementById('vesselPIDMode').onchange();
		}
		
		BrewTroller.Vessels[vesselIndex].settings();
		//call show vesselSettings on a 500ms delay to ensure the window has been setup properly
		setTimeout("BTUI.viewPort.showVesselSettings();", 500);
	}
	
	this.showVesselSettings = function() {
		
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var settingsWindow = document.getElementById('vesselSettings');	
		
		var settingsWidth = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("width")); //these are explicity casted to Strings to ensure that we can extract the required data from them
		var settingsHeight = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("height"));
		
		//We need to remove the px tag from the strings, then we can cast them to numbers and do math with them
		settingsWidth = settingsWidth.replace("px", "");
		settingsWidth = Number(settingsWidth);
		settingsHeight = settingsHeight.replace("px", "");
		settingsHeight = Number(settingsHeight);
		
		//set the x-axis position of the window to ensure it is centered properly
		settingsWindow.style.left = (window.innerWidth /2) - (settingsWidth /2) + 'px';
		
		//set the visibility types for the window and the blanket to visible and change the z-index to bring to top
		settingsWindow.style.zIndex = 9001;
		blanket.style.zIndex = 9000;
		settingsWindow.style.visibility = "visible";
		blanket.style.visibility = "visible";
		
		//set the opacity for the blanket so we get a nice fade-in effect
		blanket.style.opacity =.85;
		
		//set the height position of the window so we get a nice slide down and in effect
		settingsWindow.style.top = (window.innerHeight / 2) - (settingsHeight / 2) + 'px';
	};

	//Method to hide the vessel settings window
	this.closeVesselSettings = function() {
		
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var settingsWindow = document.getElementById('vesselSettings');
		
		//remove the position we set for the window so we get a nice slide up and out effect
		settingsWindow.style.removeProperty('top');
		//remove the opacity we set for the blanket so it will fade back out
		blanket.style.removeProperty('opacity');
		
		//remove the blanket and window z-indexs and visibility we set so it falls back to the css rules
		settingsWindow.style.removeProperty('z-index');
		blanket.style.removeProperty('z-index');
		settingsWindow.style.removeProperty('visibility');
		blanket.style.removeProperty('visibilty');	
	};
	
	//Method called when the vessel settings window save button is clicked
	//calls the appropriate vessel's saveSettings() method, then closeVesselSettings()
	this.saveVesselSettings = function() {
		
		//get the vessel index from the data-vessel-index attribute
		var vesselIndex = document.getElementById('vesselSettings').dataset.vesselIndex;
		
		//call the appropriate vessel's saveSettings()
		BrewTroller.Vessels[vesselIndex].saveSettings();
		
		//save values for kettle only options
		BrewTroller.setBoilTemp(document.getElementById('boilTemp').value);
		BrewTroller.setEvapRate(document.getElementById('evapRate').value);
		
		//hide the settings window
		this.closeVesselSettings();
	};
	
	//Method called when the state of the PID settings switch in the Vessel Settings window Changes
	this.vesselHeatModeSwitchChange = function() {
		
		//get reference to the panel
		var settingsWindow = document.getElementById('vesselSettings');
		//get reference to the heat mode switch
		var heatSwitch = document.getElementById('vesselPIDMode');
		//get reference to each of the heat mode option divs
		var onoff = document.getElementById('OnOffSettings');
		var PID = document.getElementById('PIDSettings');
		
		if (heatSwitch.checked){
			//make the window expand to accomadate the new options
			if (settingsWindow.dataset.vesselIndex == 2){
				settingsWindow.style.height = "570px";
			} else {
				settingsWindow.style.height = "480px";	
			}	
			//show the PID options
			PID.style.display = "block";
			//make sure the settings for on/off mode are hidden
			onoff.style.display = "none";			
		} else {
			//hide the PID settings and show the on/off settings
			PID.style.removeProperty('display');
			onoff.style.removeProperty('display');
			//remove the arrtribute set for the extra height in the settings window
			if (settingsWindow.dataset.vesselIndex == 2){
				settingsWindow.style.height = "480px";
			} else {
				settingsWindow.style.removeProperty('height');
			}				
		}
	};
	
	//Method to show the temp setpoint window
	this.showTempSetPoint = function() {
		
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var settingsWindow = document.getElementById('tempSetPointEdit');	
		
		var settingsWidth = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("width")); //these are explicity casted to Strings to ensure that we can extract the required data from them
		var settingsHeight = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("height"));
		
		//We need to remove the px tag from the strings, then we can cast them to numbers and do math with them
		settingsWidth = settingsWidth.replace("px", "");
		settingsWidth = Number(settingsWidth);
		settingsHeight = settingsHeight.replace("px", "");
		settingsHeight = Number(settingsHeight);
		
		//set the x-axis position of the window to ensure it is centered properly
		settingsWindow.style.left = (window.innerWidth /2) - (settingsWidth /2) + 'px';
		
		//set the visibility types for the window and the blanket to visible and change the z-index to bring to top
		settingsWindow.style.zIndex = 9001;
		blanket.style.zIndex = 9000;
		settingsWindow.style.visibility = "visible";
		blanket.style.visibility = "visible";
		
		//set the opacity for the blanket so we get a nice fade-in effect
		blanket.style.opacity =.85;
		
		//set the height position of the window so we get a nice slide down and in effect
		settingsWindow.style.top = (window.innerHeight / 2) - (settingsHeight / 2) + 'px';
	};
	
	//Method to hide the temp setpoint window
	this.closeTempSetPoint = function() {
		
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var settingsWindow = document.getElementById('tempSetPointEdit');
		
		//set the position for the window so we get a nice slide up and out effect
		settingsWindow.style.removeProperty('top');
		//set the opacity for the blanket so it will fade back out
		blanket.style.removeProperty('opacity');
		
		//set the blanket and window z-indexs and visibility back to the hidden state so they don't interfere with any other app functionality
		settingsWindow.style.removeProperty('z-index');
		blanket.style.removeProperty('z-index');
		settingsWindow.style.removeProperty('visibility');
		blanket.style.removeProperty('visibility');	
	};
	
	//method calls the appropriate vessel's setNewSetPoint() method and then the closeTempSetPoint()
	this.saveTempSetPoint = function() {
		
		//get values from the temp set point window
		var setPointValue = document.getElementById('tempSetPoint').value;
		var vesselIndex = document.getElementById('tempSetPointEdit').dataset.vesselIndex;
		//set the new set point
		BrewTroller.Vessels[vesselIndex].setNewSetPoint(setPointValue);
		//close the setPoint window
		this.closeTempSetPoint();		
	};
	
	//Method is called when a valve profile is right-clicked, it displays the profile config edit window
	this.editValveProfile = function(profileIndex) {
		//Set the state of the toggles to be the same as the current config		
		var currentConfig = BrewTroller.valves.getProfileConfigArray(profileIndex);	
		
		var editWindow = document.getElementById('valveEdit');
		
		for (i = 1; i < 17; i++){
			var target = editWindow.querySelectorAll('[data-valve-set="'+i+'"]')[0];
			target.checked = currentConfig[i-1] == 1 ? true : false;
		}
		
		//set the dataset attribute for the valve index and set the window title
		document.getElementById('valveEditTitle').firstElementChild.textContent = BrewTroller.valves.getProfileName(profileIndex) +' Config';
		editWindow.dataset.profileIndex = profileIndex;
		
		//show the window
		this.showValveEdit();	
	};	
	
	//Method shows the valve profile edit window
	this.showValveEdit = function(){
		
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var settingsWindow = document.getElementById('valveEdit');	
		
		 //this is explicity casted to String to ensure that we can extract the required data from it
		var settingsHeight = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("height"));
		
		//We need to remove the px tag from the strings, then we can cast them to numbers and do math with them
		settingsHeight = settingsHeight.replace("px", "");
		settingsHeight = Number(settingsHeight);
		
		//set the visibility types for the window and the blanket to visible and change the z-index to bring to top
		settingsWindow.style.zIndex = 9001;
		blanket.style.zIndex = 9000;
		settingsWindow.style.visibility = "visible";
		blanket.style.visibility = "visible";
		
		//set the opacity for the blanket so we get a nice fade-in effect
		blanket.style.opacity =.85;
		
		//set the height position of the window so we get a nice slide down and in effect
		settingsWindow.style.top = (window.innerHeight / 2) - (settingsHeight / 2) + 'px';
	};
	
	this.closeValveEdit = function(){
	
		//Get references to the elements for the window and the blanket
		var blanket = document.getElementById('windowBlanket');
		var editWindow = document.getElementById('valveEdit');
		
		//set the position for the window so we get a nice slide up and out effect
		editWindow.style.removeProperty('top');
		//set the opacity for the blanket so it will fade back out
		blanket.style.removeProperty('opacity');
		
		//set the blanket and window z-indexs and visibility back to the hidden state so they don't interfere with any other app functionality
		editWindow.style.removeProperty('z-index');
		blanket.style.removeProperty('z-index');
		editWindow.style.removeProperty('visibility');
		blanket.style.removeProperty('visibility');		
	};
	
	this.saveValve = function(){
		
		//Get reference to the window and retrieve the valve index from it
		var editWindow = document.getElementById('valveEdit');
		var profileIndex = editWindow.dataset.profileIndex;
		//instantiate the configArray
		var configArray = [];
		
		//Check each valve option to see if it is enabled, if it is set a flag in the array, else ensure that index is a 0
		for (i = 0; i < 16; i++){
			var target = editWindow.querySelectorAll('[data-valve-set="'+(i+1)+'"]')[0].checked;
			if (target){
				configArray[i] = 1;
			}
			else {
				configArray[i] = 0;
			}
		}
		//Set the new config
		BrewTroller.valves.setProfileConfigFromArray(profileIndex, configArray);	
		
		//close the window
		this.closeValveEdit();	
	};
	
	//Method called when the window.onload event fires, used to finish setting up the viewPort
	this.initSetup = function(){
		
		//Set the BrewTroller Settings window to be centered on the screen, this ensures that webkit browsers display the settings window the same way gecko ones do
		var settingsWindow = document.getElementById('btSettings');	
		var settingsWidth = String(document.defaultView.getComputedStyle(settingsWindow, null).getPropertyValue("width"));
		
		settingsWidth = settingsWidth.replace("px", "");
		settingsWidth = Number(settingsWidth);
		
		settingsWindow.style.left = (window.innerWidth /2) - (settingsWidth /2) + 'px';		
		
		//Set the vessel settings window to be centered on the screen, same reason as above
		var vesselSettingsWindow = document.getElementById('vesselSettings');	
		var vesselSettingsWidth = String(document.defaultView.getComputedStyle(vesselSettingsWindow, null).getPropertyValue("width"));
		
		vesselSettingsWidth = vesselSettingsWidth.replace("px", "");
		vesselSettingsWidth = Number(vesselSettingsWidth);
		
		vesselSettingsWindow.style.left = (window.innerWidth /2) - (vesselSettingsWidth /2) + 'px';
		
		//Set the temp setpoint window to be centered on the screen, same reason as above
		var tempSetWindow = document.getElementById('tempSetPointEdit');	
		var tempSetWidth = String(document.defaultView.getComputedStyle(tempSetWindow, null).getPropertyValue("width"));
		
		tempSetWidth = tempSetWidth.replace("px", "");
		tempSetWidth = Number(tempSetWidth);
		
		tempSetWindow.style.left = (window.innerWidth /2) - (tempSetWidth /2) + 'px';
		
		//Set the valve profile edit window to be centered on the screen, same reason as above
		var valveWindow = document.getElementById('valveEdit');	
		var valveWidth = String(document.defaultView.getComputedStyle(valveWindow, null).getPropertyValue("width"));
		
		valveWidth = valveWidth.replace("px", "");
		valveWidth = Number(valveWidth);
		
		valveWindow.style.left = (window.innerWidth /2) - (valveWidth /2) + 'px';
		
	};
};

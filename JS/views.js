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
		var test = (window.innerWidth /2) - (settingsWidth /2) + 'px';
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
		
		//set the position for the window so we get a nice slide up and out effect
		settingsWindow.style.top = '-450px';
		//set the opacity for the blanket so it will fade back out
		blanket.style.opacity = 0;
		
		//set the blanket and window z-indexs and visibility back to the hidden state so they don't interfere with any other app functionality
		settingsWindow.style.zIndex = '-10';
		blanket.style.zIndex = '-10';
		settingsWindow.style.visibility = 'hidden';
		blanket.style.visibility = 'hidden';		
	};
	
	this.saveBTSettings = function() {
		
		BrewTroller.saveSettings();
		
		this.closeBTSettings();
	};
	
	this.hideVessel = function(elID) {
		alert('Whoops... This has not been implemented yet!');
	}
};

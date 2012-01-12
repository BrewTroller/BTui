/**
 * @author Eric Yanush
 */

app = function(){
	
	//Public App class variables
	this.viewPort = new views;
	
	//Public methods
	
	//Method called by the window.onload handler, used to run any setup routines that need to be called when the document has finished loading
	this.initSetup = function(){
	
	};
};

var BTUI = new app;
var BrewTroller = new BrewTroller;

window.onload = function() {
	
	BTUI.initSetup();
	BrewTroller.initSetup();
};


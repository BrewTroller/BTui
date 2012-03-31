/**
 * @author Eric Yanush
 */

app = function(){
	
	//Public App class variables
	this.viewPort = new ViewController();
	
	//Public methods
	
	//Method called by the window.onload handler, used to run any setup routines that need to be called when the document has finished loading
	this.initSetup = function(){
		
		this.viewPort.initSetup();
	};
};

var BTUI = new app();
var BrewTroller = new BrewTroller();

window.onload = function() {
	
	BTUI.initSetup();
//	BrewTroller.initSetup();
};
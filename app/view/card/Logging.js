Ext.define('BTUI.view.card.Logging', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.cardLogging',
	
	initComponent: function() {
		Ext.apply(this, {
			html: '<h1>Logging Card</h1><br />This Card should contain a user configurable graph of values caputured during a brew session.<br /> During a brew session this can contain a live updating chart of user configurable datasets. An example of a live graph can be found <a href="http://dev.sencha.com/deploy/ext-4.0.2a/examples/charts/LiveAnimated.html">here</a>'
		});
		this.callParent(arguments);
	}
})
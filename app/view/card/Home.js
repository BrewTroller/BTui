Ext.define('BTUI.view.card.Home', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.cardHome',
	
	initComponent: function() {
		Ext.apply(this, {
			border: false,
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			bodyStyle: 'background-color: black; color: white; border: 0px !important',
			dockedItems: [
				{
					id: 'Valves',
					xtype: 'Valves'
				}
			],
			items: [
				{
					id: '0',
					xtype: 'Vessel'
				},
				{
					id: '1',
					xtype: 'Vessel'
				},
				{
					id: '2',
					xtype: 'Vessel'
				}
			],
			html: '<div style="margin: 8px; padding: 4px;"><h1>Home Card</h1><br />This Card will hold the Equipment Monitoring View. Each vessel will be represented by a Movable Panel. Each panel will contain a Gauge chart for Temperature and a Bar chart for Volume measurement. There also needs to be some representation of heat output status<br /> This panel will also contain a representation of Valve profiles. This could be in a list format in a DataView, which allows for multiselect<br /> If there is a program active there should be a toolbar docked to the top of the card. The toolbar will contain Program name, and current step as well as buttons to advance/abort step.</div>',
		});
		this.callParent(arguments);
	}
});
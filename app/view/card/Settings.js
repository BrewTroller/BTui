Ext.define('BTUI.view.card.Settings', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.cardSettings',
	title: 'BrewTroller System Settings',
	
	initComponent: function() {
		
		var toolbar;
		
		toolbar = {
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'tbspacer'
				},
				{
					xtype: 'button',
					text: 'Configure',
					action: 'Configure'
				},
				{
					xtype: 'button',
					text: 'Refresh'
				}
			]
			
		};
		
		Ext.apply(this, {
			dockedItems: [toolbar],
			html: '<h1>Settings Card</h1><br />This card will contain widgets to configure communication with the BT, as well as other settings such as sound file locations for alerts. As well as firmware uploads (if implemented)<br />Vessel Configuration options can either be contained here, or they could be in a popup window, triggered by a toolbar button in each vessel window.',
		});
		this.callParent(arguments);
	}
});
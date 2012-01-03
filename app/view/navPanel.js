Ext.define('BTUI.view.navPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.navPanel',
	
	initComponent: function() {
		
		Ext.apply(this, {
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			//border: false,
			//bodyStyle: 'background-color: black;',
			items: [
				{
					xtype: 'button',
					text: 'Home',
					action: 'Home',
					scale: 'large',
				},
				{
					xtype: 'button',
					text: 'Recipes',
					action: 'Recipe',
					scale: 'large'
				},
				{
					xtype: 'button',
					text: 'Logging',
					action: 'Logging',
					scale: 'large'
				},
				{
					xtype: 'button',
					text: 'Settings',
					action: 'Settings',
					scale: 'large'
				}
			]
			
			
		});
		this.callParent(arguments);
	}
});
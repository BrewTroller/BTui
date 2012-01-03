Ext.define('BTUI.view.viewPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.viewPanel',
	
	initComponent: function() {
		
		Ext.apply(this, {
			layout: 'card',
			border: false,
			activeItem: 0,
			items: [
				{
					id: 'cardHome',
					xtype: 'cardHome'
				},
				{
					id: 'cardRecipe',
					xtype: 'cardRecipe'
				},
				{
					id: 'cardLogging',
					xtype: 'cardLogging'
				}
			],
		});
		this.callParent(arguments);
	}
});
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
		});
		this.callParent(arguments);
	}
});
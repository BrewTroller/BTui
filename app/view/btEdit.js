Ext.define('BTUI.view.btEdit', {
	extend: 'Ext.window.Window',
	alias: 'widget.btEdit',
	title: 'Configure BrewTroller',
	layout: 'fit',
   closable: false,
	autoShow: false,
	
	initComponent: function() {
		Ext.apply(this, {
		id: 'btEdit',
		items: [
		{
			xtype: 'form',
			items: [
				{
					id: 'btAddress',
					xtype: 'textfield',
					name: 'address',
					fieldLabel: 'IPv4 Address'
				}
			]
		}],
		
		buttons: [
			{
				text: 'Save',
				action: 'save',
			},
			{
				text: 'Cancel',
				scope: this,
				handler: this.hide
			}
		]
		});
		this.callParent(arguments);
	}
});
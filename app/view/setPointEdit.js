Ext.define('BTUI.view.setPointEdit', {
	extend: 'Ext.window.Window',
	alias: 'widget.setPointEdit',
	title: 'Edit Set Point',
	hidden: true,
	closable: false,
	layout: 'fit',
	
	initComponent: function(){
			Ext.apply(this, {
			items: [
			{
				xtype: 'fieldset',
				items: [
				{
					xtype: 'numberfield',
					id: 'setPoint',
					maxValue: 220,
					minValue: 0,
				}
				]
			}
			],
			buttons: [
			{
				text: 'Save',
				handler: function(event, toolEl, panel, tc) {
					this.ownerCt.ownerCt.vessel.setNewSetPoint();
					this.ownerCt.ownerCt.hide();
				}
			},
			{
				text: 'Cancel',
				handler: function(){
					this.ownerCt.ownerCt.hide();
				}
			}
			]
		});
		this.callParent(arguments);
	}
});
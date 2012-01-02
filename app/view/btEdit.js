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
				xtype: 'fieldset',
				flex: 1,
				title: 'BrewTroller Address',
				defaultType: 'textfield',
				layout: 'anchor',
				items: [
					{
						id: 'btAddress',
						name: 'address',
						fieldLabel: 'IPv4 Address',
					}
				]
			},
			{
				xtype: 'fieldset',
				flex: 1,
				title: 'Vessel Display',
				defaultType: 'checkbox',
				layout: 'anchor',
				items: [
					{
						id: 'hltDisplayOption',
						fieldLabel: 'HLT'
					},
					{
						id: 'mltDisplayOption',
						fieldLabel: 'MLT'
					},
					{
						id: 'ketDisplayOption',
						fieldLabel: 'KETTLE'
					}
				]
			},
			{
				xtype: 'fieldset',
				flex: 1,
				title: 'Auto Update',
				defaultType: 'checkbox',
				layout: 'anchor',
				items: [
				{
					fieldLabel: 'Auto Update',
					id: 'autoUpdate',
					inputValue: 'auto-update'
				},
				{
					xtype: 'numberfield',
					id: 'updateFrequency',
					fieldLabel: 'Update Frequency',
					anchor: '100%',
					value: 2000,
					maxValue: 60000, //set Maximum update interval to 1 minute
					minValue: 1000,		  //set minimum update interval to 1 Second
				}
				]
			}
		 ],
		
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


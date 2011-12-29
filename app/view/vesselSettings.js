Ext.define('BTUI.view.vesselSettings', {
	extend: 'Ext.window.Window',
	alias: 'widget.vesselSettings',
	title: 'Configure Vessel',
	layout: 'fit',
	closable: false,

	initComponent: function() {
		Ext.apply(this, {
		items: [
		{
			xtype: 'form',
			items: [
				{
					xtype: 'fieldset',
					flex: 1,
					title: 'Vessel Parameters',
					layout: 'anchor',
					defaultType: 'checkbox',
					items: [
						{
							fieldLabel: 'Has Volume Sensing',
							id: 'hasVolume',
							inputValue: 'hasVolume'
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
						value: 10,
						maxValue: 60000, //set Maximum update interval to 1 minute
						minValue: 1000,		  //set minimum update interval to 1 Second
					}
					]
				},
				{
					xtype: 'fieldset',
					flex: 1,
					title: 'Temperature Range',
					defaultType: 'numberfield',
					layout: 'anchor',
					items: [
						{
							fieldLabel: 'Minimum',
							id: 'temperatureMinimum',
							anchor: '100%',
							value: '0',
							minValue: '-25',
							maxValue: '10', 
						},
						{
							fieldLabel: 'Maximum',
							id: 'temperatureMaximum',
							anchor: '100%',
							value: '215',
							minValue: '10',
							maxValue: '300',
						}
					]
				}
			]
		}],
		
		buttons: [
			{
				text: 'Save',
				scope: this,
				action: 'save'
			},
			{
				text: 'Cancel',
				scope: this,
				handler: this.hide
			}
		],
		
		});
		this.callParent(arguments);
	}
});
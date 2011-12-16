Ext.define('BTUI.view.viewPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.viewPanel',
	//title: 'viewCards	**THIS TOOLBAR WILL BE REMOVED!**	**HERE FOR DEBUGGING INITAL INTERFACE DESIGN**',
	
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
			//html: '<div>View Cards will go here for settings, control view, recipies, etc. Each view will have its own card, active card will be changed using the nav buttons above</div><br /><br /><div style="color: blue">TODO Change from default Ext buttons to custom styled toolbar type buttons. EX: Apple.com top toolbar</div>'
		});
		this.callParent(arguments);
	}
});
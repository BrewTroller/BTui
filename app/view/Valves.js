Ext.define('BTUI.view.Valves', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.Valves',
	
	initComponent: function(){
		
		var grouping = Ext.create('Ext.grid.feature.Grouping', {
			groupHeaderTpl:  '<tpl if="name == true">Active ({rows.length})</tpl><tpl if="name == false">Idle ({rows.length})</tpl>',
			startCollapsed: false,
		}); //Setup grouping feature. Data parameter to group by is setup in Store.
		
		Ext.apply(this, {
			bodyBorder: false,		//Prevent Panel Border
			border: 0,					//Prevent Panel Border
			preventHeader: true,		//Prevent Panel Header from showing
			hideHeaders: true,		//Prevent Column Header from showing
			bodyStyle: 'background-color: black',
			frameHeader: false,		//Prevent Panel Header
			width: 130,
			dock: 'left',
			simpleSelect: true,
			forceFit: true,
			store: Ext.data.StoreManager.lookup('Valves'),
			columns: [
				{header: 'Profile', dataIndex: 'profile', flex: 1, tdCls: 'button-wrap'},
				{header: 'active', dataIndex: 'active', hidden: true},
				{header: 'config', dataIndex: 'config', hidden: true},
			],
			viewConfig: {
				stripeRows: false,	//Prevent the Grid from alternating background colors of rows
			   plugins: {				//Add a Drag and Drop plugin that allows the list to be re-ordered
			   	ptype: 'gridviewdragdrop',
			      dragText: 'Drag and drop to reorganize'
			   }
			},
			features: [grouping],
		});
		this.callParent(arguments);
	}
});
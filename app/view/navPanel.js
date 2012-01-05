Ext.define('BTUI.view.navPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.navPanel',
	
	initComponent: function() {
		
		
		Ext.apply(this, {
			/*layout: {
				type: 'hbox',
				pack: 'center'
			},*/
			border: false,
			loader: {
				url: 'app/view/navpanel.html',
				autoLoad: true,
				success: function(){
					
					
				}
			},
			
		});
		this.callParent(arguments);
	}
});

BTUI.view.switchCard = function(id){
	Ext.ComponentQuery.query('#viewPanel')[0].getLayout().setActiveItem('card'+id);
};
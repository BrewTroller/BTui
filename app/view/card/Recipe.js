Ext.define('BTUI.view.card.Recipe', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.cardRecipe',
	
	initComponent: function(){
		Ext.apply(this, {
			html: '<h1>Recipe Card</h1><br />This Card will be able to View/Create/Edit the Recipe Programs on the BT, and potentially be able to import/export using BeerXml'
		});
		this.callParent(arguments);
	}
});
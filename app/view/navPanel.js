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
					
					var home = Ext.get('Home');
					home.addListener('click', function(){
						var viewpanel = Ext.ComponentQuery.query('#viewPanel')[0];
						viewpanel.getLayout().setActiveItem('cardHome');
					});
					
					var recipe = Ext.get('Recipes');
					recipe.addListener('click', function(){
						var viewpanel = Ext.ComponentQuery.query('#viewPanel')[0];
						viewpanel.getLayout().setActiveItem('cardRecipe');
					});
					
					var log = Ext.get('Logging');
					log.addListener('click', function(){
						var viewpanel = Ext.ComponentQuery.query('#viewPanel')[0];
						viewpanel.getLayout().setActiveItem('cardLogging');
					});
					
					var settings = Ext.get('Settings');
					settings.addListener('click', function(){
						BrewTroller.settings();
					});
					
					var updateBT = Ext.get('UpdateBT');
					updateBT.addListener('click', function(){
						BrewTroller.update()
					});
					
					var updateAll = Ext.get('UpdateALL');
					updateAll.addListener('click', function(){
						BrewTroller.updateAll()
					});
				}
			},
			
		});
		this.callParent(arguments);
	}
});
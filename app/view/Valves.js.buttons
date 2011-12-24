Ext.define('BTUI.view.Valves', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.Valves',
	
	initComponent: function() {
		Ext.apply(this, {
			dock: 'left',
			width: 130,
			border: false,
			autoScroll: true,
			bodyStyle: 'background-color: black;',
			items: [
				Ext.create('Ext.view.View', {
					store: 'Valves',
					tpl: [
						'<tpl for=".">',
							'<div class="button-wrap" id="{profile}">',
							'<span class="text-wrap">{profile}</span>',
							'</div>',
						'</tpl>'
					],
					multiSelect: true,
					simpleSelect: true,
					overItemCls: 'x-button-over',
					trackOver: true,
					selectedItemCls: 'x-button-selected',
					itemSelector: 'div.button-wrap',
					
					listeners: {
						selectionchange: function(dv, nodes){
							
						}
					}
				})
			]
		});
		this.callParent(arguments);
	}
	
});
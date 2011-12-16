Ext.define('BTUI.store.Valves', {
	extend: 'Ext.data.Store',
	model: 'BTUI.model.Valve',
	
	data: [
		{profile: 'Fill HLT', config: '0000000000000000'},
		{profile: 'Fill Mash', config: '0000000000000000'},
		{profile: 'HLT Heat', config: '0000000000000000'},
		{profile: 'HLT Idle', config: '0000000000000000'},
		{profile: 'Mash Heat', config: '0000000000000000'},
		{profile: 'Mash Idle', config: '0000000000000000'},
		{profile: 'Add Grain', config: '0000000000000000'},
		{profile: 'Sparge In', config: '0000000000000000'},
		{profile: 'Sparge Out', config: '0000000000000000'},
		{profile: 'Kettle Heat', config: '0000000000000000'},
		{profile: 'Kettle Idle', config: '0000000000000000'},
		{profile: 'Boil Additions', config: '0000000000000000'},
		{profile: 'Kettle Lid', config: '0000000000000000'},
		{profile: 'Chill H20', config: '0000000000000000'},
		{profile: 'Chill Beer', config: '0000000000000000'},
		{profile: 'Boil Recirc', config: '0000000000000000'},
		{profile: 'Drain', config: '0000000000000000'},
		{profile: 'User Valve 1', config: '0000000000000000'},
		{profile: 'User Valve 2', config: '0000000000000000'},
		{profile: 'User Valve 3', config: '0000000000000000'}
	]
	
});
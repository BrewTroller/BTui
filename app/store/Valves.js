Ext.define('BTUI.store.Valves', {
	extend: 'Ext.data.Store',
	storeId: 'Valves',
	model: 'BTUI.model.Valve',
	groupField: 'active',
	
	data: [
		{profile: 'Fill HLT', active: false, config: 0},
		{profile: 'Fill Mash', active: false, config: 0},
		{profile: 'Add Grain', active: false, config: 0},
		{profile: 'Mash Heat', active: false, config: 0},
		{profile: 'Mash Idle', active: false, config: 0},
		{profile: 'Sparge In', active: false, config: 0},
		{profile: 'Sparge Out', active: false, config: 0},
		{profile: 'Boil Additions', active: false, config: 0},
		{profile: 'Kettle Lid', active: false, config: 0},
		{profile: 'Chill H2O', active: false, config: 0},
		{profile: 'Chill Beer', active: false, config: 0},
		{profile: 'Boil Recirc', active: false, config: 0},
		{profile: 'Drain', active: false, config: 0},									
		{profile: 'HLT Heat', active: false, config: 0},
		{profile: 'HLT Idle', active: false, config: 0},
		{profile: 'Kettle Heat', active: false, config: 0},
		{profile: 'Kettle Idle', active: false, config: 0},
		{profile: 'User Valve 1', active: false, config: 0},
		{profile: 'User Valve 2', active: false, config: 0},
		{profile: 'User Valve 3', active: false, config: 0}
	]
	
});
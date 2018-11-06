/**
 * This class provides available types of permissions. By type we mean stuff such as topic.
 */
class PermissionStore {
	constructor() {
		this.permissions = [
			{
				key: 'permissions-dataset',
				type: 'dataset',
				name: 'Scope'
			}, {
				key: 'permissions-location',
				type: 'location',
				name: 'Place'
			}, {
				key: 'permissions-topic',
				type: 'topic',
				name: 'Topic'
			}, {
				key: 'permissions-layer_wms',
				type: 'layer_wms',
				name: 'Custom WMS Layers'
			}, {
				key: 'permissions-group',
				type: 'group',
				name: 'Group'
			},
			{
				key: 'permission-user',
				type: 'user',
				name: 'User'
			},
			{
				key: 'permission-view',
				type: 'dataview',
				name: 'View'
			},
			{
				key: 'permission-lpis-case',
				type: 'lpis_case',
				name: 'LPIS Case'
			},
			{
				key: 'permission-scenario',
				type: 'scenario',
				name: 'Scenario'
			},
			{
				key: 'permission-scenario-case',
				type: 'scenario_case',
				name: 'Scenario case'
			},
			{
				key: 'permission-attributeset',
				type: 'attributeset',
				name: 'Attribute set'
			},
			{
				key: 'permission-layer',
				type: 'layer',
				name: 'Layer'
			},
			{
				key: 'permission-attribute',
				type: 'attribute',
				name: 'Attribute'
			},
			{
				key: 'permission-areatemplate',
				type: 'areatemplate',
				name: 'Layer templates'
			},
			{
				key: 'permission-theme',
				type: 'theme',
				name: 'Theme'
			},
			{
				key: 'permission-analysis',
				type: 'analysis',
				name: 'Analysis'
			},
			{
				key: 'permission-layergroup',
				type: 'layergroup',
				name: 'Layer group'
			},
			{
				key: 'permission-period',
				type: 'year',
				name: 'Period'
			},
			{
				key: 'permission-spatial-relation',
				type: 'spatial_relation',
				name: 'Spatial relation'
			}
		]
	}

	getByType(type) {
		return this.permissions.filter(permission => permission.type === type)[0];
	}

	getAll() {
		return this.permissions;
	}

	getFiltered() {
		return this.permissions;
	}
}

let storeInstance = new PermissionStore();
export default storeInstance;

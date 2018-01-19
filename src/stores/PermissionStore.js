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

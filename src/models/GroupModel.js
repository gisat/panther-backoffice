import ObjectTypes from '../constants/ObjectTypes';
import Model from './Model';
import UserStore from '../stores/UserStore';
import PermissionStore from '../stores/PermissionStore';

class GroupModel extends Model {
	getType() {
		return ObjectTypes.GROUP;
	}

	data() {
		return {
			key: {
				serverName: '_id',
				sendToServer: true
			},
			name: {
				serverName: 'name',
				sendToServer: true
			},
			identifier: {
				serverName: 'identifier',
				sendToServer: true
			},
			permissions: {
				serverName: 'permissions',
				sendToServer: false
			},
			permissionsTowards: {
				serverName: 'permissionsTowards',
				sendToServer: false,
				transformForLocal: function(data) {
					return data && data.map(permission => {
						return PermissionStore.getByType(permission.resourceType);
					}) || [];
				}
			},
			permissionsUsers: {
				serverName: 'permissionsUsers',
				sendToServer: false
			},
			permissionsGroups: {
				serverName: 'permissionsGroups',
				sendToServer: false
			},
			users: {
				serverName: 'users',
				sendToServer: false,
				transformForLocal: function (data) {
					if (data) {
						let models = data.map(id => UserStore.byId(id));
						return Promise.all(models);
					} else {
						return Promise.resolve([]);
					}
				},
				isPromise: true,
				isArray: true
			}
		}
	}

	addPermission(type, id, permission) {
		permission.id = id;
		if (type == ObjectTypes.USER) {
			this.permissions.user.push(permission);
		} else if (type == ObjectTypes.GROUP) {
			this.permissions.group.push(permission);
		} else {
			console.log("This should never happen");
		}

	}

	removePermission(type, id, permission) {
		permission.id = id;
		if (type == ObjectTypes.USER) {
			this.permissions.user = this.permissions.user.filter(userPermission => permission.permission != userPermission.permission || permission.resourceId != userPermission.resourceId || permission.resourceType != userPermission.resourceType || permission.id != userPermission.id);
		} else if (type == ObjectTypes.GROUP) {
			this.permissions.group = this.permissions.group.filter(userPermission => permission.permission != userPermission.permission || permission.resourceId != userPermission.resourceId || permission.resourceType != userPermission.resourceType || permission.id != userPermission.id);
		} else {
			console.log("This should never happen");
		}
	}
}

export default GroupModel;

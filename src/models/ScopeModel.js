import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import AULevelStore from '../stores/AULevelStore';
import PeriodStore from '../stores/PeriodStore';


class ScopeModel extends Model {

	getType() {
		return ObjectTypes.SCOPE;
	}

	data() {
		return {
			key: {
				serverName: '_id', //number
				sendToServer: true
			},
			name: {
				serverName: 'name', //string
				sendToServer: true
			},
			description: {
				serverName: 'description', //string
				sendToServer: true
			},
			active: {
				serverName: 'active', //boolean
				sendToServer: true
			},
			changed: {
				serverName: 'changed', //date
				sendToServer: false,
				transformForLocal: this.transformDate
			},
			changedBy: {
				serverName: 'changedBy', //id
				sendToServer: false,
				transformForLocal: function (data) {
					return UserStore.getById(data)
				},
				isPromise: true
			},
			created: {
				serverName: 'created', //date
				sendToServer: false,
				transformForLocal: this.transformDate
			},
			createdBy: {
				serverName: 'createdBy', //id
				sendToServer: false,
				transformForLocal: function (data) {
					return UserStore.getById(data)
				},
				isPromise: true
			},
			levels: {
				serverName: 'featureLayers', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return AULevelStore.getByKeyArray(data)
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			periods: {
				serverName: 'years', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return PeriodStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			permissions: {
				serverName: 'permissions',
				sendToServer: false
			},
			configuration: {
				serverName: 'configuration',
				sendToServer: true,
				transformForLocal: this.transformConfigurationForLocal,
				transformForServer: this.transformConfigurationForServer
			}
		};
	}

	addPermission(type, id, permission) {
		permission.id = id;
		if(type == ObjectTypes.USER) {
			this.permissions.user.push(permission);
		} else if(type == ObjectTypes.GROUP) {
			this.permissions.group.push(permission);
		} else {
			console.log("This should never happen");
		}

	}

	removePermission(type, id, permission) {
		permission.id = id;
		if(type == ObjectTypes.USER) {
			this.permissions.user = this.permissions.user.filter(userPermission => permission.permission != userPermission.permission || permission.resourceId != userPermission.resourceId || permission.resourceType != userPermission.resourceType || permission.id != userPermission.id);
		} else if(type == ObjectTypes.GROUP) {
			this.permissions.group = this.permissions.group.filter(userPermission => permission.permission != userPermission.permission || permission.resourceId != userPermission.resourceId || permission.resourceType != userPermission.resourceType || permission.id != userPermission.id);
		} else {
			console.log("This should never happen");
		}
	}
	
	transformConfigurationForLocal(value) {
		return value ? JSON.stringify(value) : null;
	}
	
	transformConfigurationForServer(value) {
		return value ? JSON.parse(value) : null;
	}

}

export default ScopeModel;

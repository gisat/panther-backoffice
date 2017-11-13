import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';


class PlaceModel extends Model {

	getType() {
		return ObjectTypes.PLACE;
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
			scope: {
				serverName: 'dataset', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return ScopeStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			boundingBox: {
				serverName: 'bbox',
				sendToServer: true
			},
			center: {
				serverName: 'center',
				sendToServer: false //for now
			},
			description: {
				serverName: 'description', //string
				sendToServer: true
			},
			geometry: {
				serverName: 'geometry', //geoJSON
				sendToServer: true
			},
			permissions: {
				serverName: 'permissions',
				sendToServer: false
			},
			tacrb2_simple: {
				serverName: 'tacrb2_simple',
				sendToServer: true
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

}

export default PlaceModel;

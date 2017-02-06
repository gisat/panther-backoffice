import Model from '../../models/Model';
import ObjectTypes from '../../constants/ObjectTypes';

import ScopeStore from '../../stores/ScopeStore';
import PeriodStore from '../../stores/PeriodStore';
import PlaceStore from '../../stores/PlaceStore';

// On the server I need to establish some information about the WMS server, but it doesnt't apply here yet.
// There is a question about how do we exactly
class WmsLayerModel extends Model {

	data() {
		return {
			key: {
				serverName: 'id',
				sendToServer: true
			},
			name: {
				serverName: 'name', //string
				sendToServer: true
			},
			layer: {
				serverName: 'layer', // string
				sendToServer: true
			},
			url: {
				serverName: 'url', // In this case it represents URL of the WMS service.
				sendToServer: true
			},
			scope: {
				serverName: 'scope',
				transformForLocal: function (data) {
					return ScopeStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true,
				sendToServer: true
			},
			places: {
				serverName: 'places',
				transformForLocal: function (data) {
					return PlaceStore.getFiltered({key: data});
				},
				transformForServer: this.getKeys,
				sendToServer: true,
				isPromise: true,
				isArray: true
			},
			periods: {
				serverName: 'periods',
				transformForLocal: function (data) {
					return PeriodStore.getFiltered({key: data});
				},
				transformForServer: this.getKeys,
				sendToServer: true,
				isPromise: true,
				isArray: true
			},

			permissions: {
				serverName: 'permissions',
				sendToServer: false
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

export default WmsLayerModel;

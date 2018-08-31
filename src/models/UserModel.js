import ObjectTypes from '../constants/ObjectTypes';
import Model from './Model';
import PermissionStore from "../stores/PermissionStore";

class UserModel extends Model {
	getType() {
		return ObjectTypes.USER;
	}

	data() {
		return {
			key: {
				serverName: '_id',
				sendToServer: true
			},
			email: {
				serverName: 'email',
				sendToServer: true
			},
			phone: {
				serverName: 'phone',
				sendToServer: true
			},
			name: {
				serverName: 'name',
				sendToServer: false
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
			}
		}
	}
}

export default UserModel;

import ObjectTypes from '../constants/ObjectTypes';
import Model from './Model';
import UserStore from '../stores/UserStore';
import GroupStore from '../stores/GroupStore';

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
			name: {
				serverName: 'username',
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
			permissions: {
				serverName: 'permissions',
				sendToServer: false
			},
			groups: {
				serverName: 'groups',
				sendToServer: false,
				transformForLocal: function(data) {
					return Promise.all(
						data.map(group => GroupStore.byId(group.id))
					);
				},
				isPromise: true
			}
		}
	}
}

export default UserModel;

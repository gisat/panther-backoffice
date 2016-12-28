import ObjectTypes from '../constants/ObjectTypes';
import Model from './Model';
import UserStore from '../stores/UserStore';

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
			}
		}
	}
}

export default GroupModel;

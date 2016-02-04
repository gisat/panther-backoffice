import Model from './Model';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';


class PlaceModel extends Model {

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
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
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
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
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
				isPromise: true
			},
			boundingBox: {
				serverName: 'bbox',
				sendToServer: false //for now
			},
			center: {
				serverName: 'center',
				sendToServer: false //for now
			}
		};
	}

}

export default PlaceModel;

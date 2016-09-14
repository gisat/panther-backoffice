import Model from './Model';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';
import config from '../config';


class PlaceModel extends Model {

	data() {
		let ret = {
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
			}
		};

		if (config.models.hasOwnProperty('place')) {

			if (config.models.place.description) {
				ret.description = {
					serverName: 'description', //string
					sendToServer: true
				};
			}

		}

		return ret;
	}

}

export default PlaceModel;

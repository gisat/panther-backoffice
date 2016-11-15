import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';
import config from '../config';


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
			}
		};
	}

}

export default PlaceModel;

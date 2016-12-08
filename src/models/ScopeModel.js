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
			}
		};
	}

}

export default ScopeModel;

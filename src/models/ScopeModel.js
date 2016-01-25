import Model from './Model';
import UserStore from '../stores/UserStore';
import AULevelStore from '../stores/AULevelStore';


class ScopeModel extends Model {

	data() {
		return {
			key: {
				serverName: '_id' //number
			},
			name: {
				serverName: 'name' //string
			},
			active: {
				serverName: 'active' //boolean
			},
			changed: {
				serverName: 'changed', //date
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
			},
			changedBy: {
				serverName: 'changedBy', //id
				transformForLocal: function (data) {
					return UserStore.getById(data)
				},
				isPromise: true
			},
			created: {
				serverName: 'created', //date
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
			},
			createdBy: {
				serverName: 'createdBy', //id
				transformForLocal: function (data) {
					return UserStore.getById(data)
				},
				isPromise: true
			},
			levels: {
				serverName: 'featureLayers', //ids
				transformForLocal: function (data) {
					return AULevelStore.getFiltered(data)
				},
				isPromise: true,
				isArray: true
			}
		};
	}

}

export default ScopeModel;

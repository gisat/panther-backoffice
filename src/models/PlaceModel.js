import Model from './Model';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';


class PlaceModel extends Model {

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
			scope: {
				serverName: 'dataset', //id
				transformForLocal: function (data) {
					return ScopeStore.getById(data)
				},
				isPromise: true
			},
			boundingBox: {
				serverName: 'bbox'
			},
			center: {
				serverName: 'center'
			}
		};
	}

}

export default PlaceModel;

import Model from './Model';
import UserStore from '../stores/UserStore';
import AULevelStore from '../stores/AULevelStore';
import AnalysisStore from '../stores/AnalysisStore';
import ScopeStore from '../stores/ScopeStore';
import PlaceStore from '../stores/PlaceStore';
import PeriodStore from '../stores/PeriodStore';


class AnalysisRunModel extends Model {

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
			//active: {
			//	serverName: 'active', //boolean
			//	sendToServer: true
			//},
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
			finished: {
				serverName: 'finished', //date
				sendToServer: false,
				transformForLocal: this.transformDate
			},
			analysis: {
				serverName: 'analysis', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AnalysisStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true,
				isArray: true
			},
			scope: {
				serverName: 'dataset', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return ScopeStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true,
				isArray: true
			},
			place: {
				serverName: 'location', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return PlaceStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true,
				isArray: true
			},
			period: {
				serverName: 'year', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return PeriodStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true,
				isArray: true
			},
			levels: {
				serverName: 'featureLayerTemplates', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return AULevelStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			status: {
				serverName: 'status', //string
				sendToServer: false
			}
		};
	}

}

export default AnalysisRunModel;

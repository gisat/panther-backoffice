import Model from './Model';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';
import PeriodStore from '../stores/PeriodStore';
import TopicStore from '../stores/TopicStore';


class ThemeModel extends Model {

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
			periods: {
				serverName: 'years', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return PeriodStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			topics: {
				serverName: 'topics', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return TopicStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			topicsPreferential: {
				serverName: 'prefTopics', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return TopicStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			visualizations: { // ordered array of ids, not using in backoffice
				serverName: 'visOrder',
				sendToServer: false
			}
		};
	}

}

export default ThemeModel;

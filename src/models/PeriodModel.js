
import Model from './Model';
import UserStore from '../stores/UserStore';


class PeriodModel extends Model {

	constructor(options) {
		super(options);

	}

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
				transformForLocal: function () {
					this.transformDate.apply(this, arguments)
				}.bind(this)
			},
			changedBy: {
				serverName: 'changedBy', //id
				transformForLocal: function (options) {
					return UserStore.getById(options)
				},
				isPromise: true
			},
			created: {
				serverName: 'created', //date
				transformForLocal: function () {
					this.transformDate.apply(this, arguments)
				}.bind(this)
			},
			createdBy: {
				serverName: 'createdBy', //id
				transformForLocal: function (options) {
					return UserStore.getById(options)
				},
				isPromise: true
			}
		};
	}

}

export default PeriodModel;

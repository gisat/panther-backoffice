import Model from './Model';
import UserStore from '../stores/UserStore';


class AttributeModel extends Model {

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
			type: {
				serverName: 'type', // text / numeric
				sendToServer: true
			},
			code: {
				serverName: 'code', // string
				sendToServer: true
			},
			standardUnits: {
				serverName: 'standardUnits', // text / numeric
				sendToServer: true
			},
			customUnits: {
				serverName: 'units', // string
				sendToServer: true
			},
			color: {
				serverName: 'color', // string - hex code
				sendToServer: true
			},
			description: {
				serverName: 'description', //string?
				sendToServer: true
			}
		};
	}

}

export default AttributeModel;

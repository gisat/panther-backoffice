import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
//import AttributeStore from '../stores/AttributeStore';
//import AttributeSetStore from '../stores/AttributeSetStore';


class StyleModel extends Model {

	getType() {
		return ObjectTypes.STYLE;
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
			source: {
				serverName: 'source', // string - definition/geoserver/?
				sendToServer: true,
				transformForLocal: function (data) {
					if (data) {
						return data;
					} else {
						// old styles were geoserver only
						return 'geoserver';
					}
				}
			},
			serverName: {
				serverName: 'symbologyName', //string
				sendToServer: true
			},
			sld: {
				serverName: 'sld',
				sendToServer: true
			},
			definition: {
				serverName: 'definition',
				sendToServer: true
			}
		};
	}

	prepareModel(options) {
		// assign default values
		if (!options.source) {
			options.source = "definition";
			if (!options.definition) {
				options.definition = {
					type: 'polygon',
					filterType: 'no'
				}
			}
		}
		return options;
	}

}

export default StyleModel;

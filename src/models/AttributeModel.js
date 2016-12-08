import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';


class AttributeModel extends Model {

	getType() {
		return ObjectTypes.ATTRIBUTE;
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
				sendToServer: true,
				transformForLocal: function (data, serverObject) {
					if (data) {
						return data;
					} else {
						// backwards compatibility - convert from units
						if (
							serverObject.units == "m2"
							//|| serverObject.units == "sqm"
							//|| serverObject.units == "square meters"
						) {
							return "m2";
						} else if (
							serverObject.units == "km2"
						) {
							return "km2";
						} else {
							return "";
						}
					}

				}
			},
			customUnits: {
				serverName: 'units', // string
				sendToServer: true,
				transformForLocal: function (data) {
					if (
						data == "m2" ||
						data == "km2"
					) {
						return "";
					} else {
						return data;
					}
				},
				transformForServer: function (data, localObject) {
					if (localObject.standardUnits) {
						// standard units take precedence, save in units for backwards compatibility
						return localObject.standardUnits;
					} else {
						return data;
					}
				}
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

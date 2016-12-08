import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';
import AttributeStore from '../stores/AttributeStore';
import VectorLayerStore from '../stores/VectorLayerStore';
import TopicStore from '../stores/TopicStore';


class AttributeSetModel extends Model {

	getType() {
		return ObjectTypes.ATTRIBUTE_SET;
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
				serverName: 'scope', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return ScopeStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			description: {
				serverName: 'description', //string?
				sendToServer: true
			},
			attributes: {
				serverName: 'attributes', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			vectorLayers: {
				serverName: 'featureLayers', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return VectorLayerStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			topic: {
				serverName: 'topic', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return TopicStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			}
		};
	}

}

export default AttributeSetModel;

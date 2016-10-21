import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import TopicStore from '../stores/TopicStore';
import AttributeSetStore from '../stores/AttributeSetStore';


class VectorLayerModel extends Model {

	getType() {
		return ObjectTypes.VECTOR_LAYER_TEMPLATE;
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
			layerType: {
				serverName: 'layerType', // raster / vector / au
				sendToServer: true,
				transformForLocal: function (data) {
					if(!data) { data = "vector"; }
					return data;
				}
			},
			layerGroup: {
				serverName: 'layerGroup', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return LayerGroupStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			styles: {
				serverName: 'symbologies', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return StyleStore.getFiltered({key: data})
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
			},
			attributeSets: {
				serverName: 'attributeSets', //ids
				sendToServer: true,
				//transformForLocal: function (data) {
				//	return AttributeSetStore.getFiltered({key: data})
				//},
				transformForLocal: function (data) {
					return Promise.resolve(null); // avoiding circular reference while these relations are stored in attribute sets
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			}
		};
	}

	prepareModel(options) {
		options.layerType = "vector";
		return options;
	}

}

export default VectorLayerModel;

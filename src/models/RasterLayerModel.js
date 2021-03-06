import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import ScopeStore from '../stores/ScopeStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import TopicStore from '../stores/TopicStore';


class RasterLayerModel extends Model {

	getType() {
		return ObjectTypes.RASTER_LAYER_TEMPLATE;
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
			layerType: {
				serverName: 'layerType', // raster / vector / au
				sendToServer: true,
				transformForLocal: function (data) {
					if(!data) { data = "raster"; }
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
			justVisualization: {
				serverName: 'justVisualization',
				sendToServer: true,
				transformForServer: function(){
					return true;
				}
			}
		};
	}

	prepareModel(options) {
		options.layerType = "raster";
		return options;
	}

}

export default RasterLayerModel;

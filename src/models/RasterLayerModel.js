import Model from './Model';
import UserStore from '../stores/UserStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import TopicStore from '../stores/TopicStore';


class RasterLayerModel extends Model {

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
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
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
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
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
				isPromise: true
			},
			styles: {
				serverName: 'symbologies', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return StyleStore.getFiltered(data)
				},
				isPromise: true,
				isArray: true
			},
			topic: {
				serverName: 'topic', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return TopicStore.getById(data)
				},
				isPromise: true
			}
		};
	}

}

export default RasterLayerModel;

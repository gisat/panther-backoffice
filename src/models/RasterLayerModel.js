import Model from './Model';
import UserStore from '../stores/UserStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import TopicStore from '../stores/TopicStore';


class RasterLayerModel extends Model {

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
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
			},
			changedBy: {
				serverName: 'changedBy', //id
				transformForLocal: function (data) {
					return UserStore.getById(data)
				},
				isPromise: true
			},
			created: {
				serverName: 'created', //date
				transformForLocal: function (data) {
					return this.transformDate(data)
				}.bind(this)
			},
			createdBy: {
				serverName: 'createdBy', //id
				transformForLocal: function (data) {
					return UserStore.getById(data)
				},
				isPromise: true
			},
			layerType: {
				serverName: 'layerType', // raster / vector / au
				transformForLocal: function (data) {
					if(!data) { data = "raster"; }
					return data;
				}
			},
			layerGroup: {
				serverName: 'layerGroup', //id
				transformForLocal: function (data) {
					return LayerGroupStore.getById(data)
				},
				isPromise: true
			},
			styles: {
				serverName: 'symbologies', //ids
				transformForLocal: function (data) {
					return StyleStore.getFiltered(data)
				},
				isPromise: true,
				isArray: true
			},
			topic: {
				serverName: 'topic', //id
				transformForLocal: function (data) {
					return TopicStore.getById(data)
				},
				isPromise: true
			}
		};
	}

}

export default RasterLayerModel;

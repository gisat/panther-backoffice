import Model from './Model';
import UserStore from '../stores/UserStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import TopicStore from '../stores/TopicStore';


class AULevelModel extends Model {

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
					if(!data) { data = "au"; }
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
			}
		};
	}

	prepareModel(options) {
		options.layerType = "au";
		return options;
	}

}

export default AULevelModel;

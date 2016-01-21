import Model from './Model';
import UserStore from '../stores/UserStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import TopicStore from '../stores/TopicStore';


class RasterLayerModel extends Model {

	constructor(options) {
		super(options);

	}

	// areaTemplates on server with "justVisualization": true are RasterLayers on local
	// todo is this needed? What do we get from server?
	resolveForLocal(data) {
		if (data.justVisualization) {
			super.resolveForLocal(data);
		}
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
					return UserStore.byId(options)
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
					return UserStore.byId(options)
				},
				isPromise: true
			},
			layerGroup: {
				serverName: 'layerGroup', //id
				transformForLocal: function (options) {
					return LayerGroupStore.byId(options)
				},
				isPromise: true
			},
			levels: {
				serverName: 'symbologies', //ids
				transformForLocal: function (options) {
					return StyleStore.filter(options)
				},
				isPromise: true,
				isArray: true
			},
			topic: {
				serverName: 'topic', //id
				transformForLocal: function (options) {
					return TopicStore.byId(options)
				},
				isPromise: true
			}
		};
	}

}

export default RasterLayerModel;

import Model from './Model';
import UserStore from '../stores/UserStore';
import LayerGroupStore from '../stores/LayerGroupStore';
import StyleStore from '../stores/StyleStore';
import TopicStore from '../stores/TopicStore';


class RasterLayerModel extends Model {

	constructor(options) {
		super(options);

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
					return UserStore.getById(options)
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
					return UserStore.getById(options)
				},
				isPromise: true
			},
			layerGroup: {
				serverName: 'layerGroup', //id
				transformForLocal: function (options) {
					return LayerGroupStore.getById(options)
				},
				isPromise: true
			},
			levels: {
				serverName: 'symbologies', //ids
				transformForLocal: function (options) {
					return StyleStore.getFiltered(options)
				},
				isPromise: true,
				isArray: true
			},
			topic: {
				serverName: 'topic', //id
				transformForLocal: function (options) {
					return TopicStore.getById(options)
				},
				isPromise: true
			}
		};
	}

}

export default RasterLayerModel;

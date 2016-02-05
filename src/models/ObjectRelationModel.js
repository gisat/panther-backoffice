import Model from './Model';
import UserStore from '../stores/UserStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import DataLayerStore from '../stores/DataLayerStore';
import PlaceStore from '../stores/PlaceStore';
import PeriodStore from '../stores/PeriodStore';
import AttributeStore from '../stores/AttributeStore';


class ObjectRelationModel extends Model {

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
				transformForLocal: function (data) { // todo just transformForLocal: this.transformDate ?
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
				serverName: 'layerType' // raster / vector / au ?unnecessary in this direction?
			},
			layerObject: {
				serverName: 'areaTemplate', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return GeneralLayerStore.getById(data)
				},
				transformForServer: function (model) {
					return model.key;
				},
				isPromise: true
			},
			attributeSet: {
				serverName: 'attributeSet', //id
				sendToServer: false, //for now
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data)
				},
				transformForServer: function (model) {
					return model.key;
				},
				isPromise: true
			},
			isOfAttributeSet: { // indicates relations of attribute set
				serverName: 'isData', //boolean
				sendToServer: true
			},
			dataSource: {
				serverName: 'layer', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return DataLayerStore.getById(data)
				},
				transformForServer: function (model) {
					return model.key;
				},
				isPromise: true
			},
			dataSourceString: {
				serverName: 'layer', //id
				sendToServer: false //temp local value only, until we can filter by nested key/value
			},
			place: {
				serverName: 'location', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return PlaceStore.getById(data)
				},
				transformForServer: function (model) {
					return model.key;
				},
				isPromise: true
			},
			period: {
				serverName: 'year', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return PeriodStore.getById(data)
				},
				transformForServer: function (model) {
					return model.key;
				},
				isPromise: true
			},
			implicit: {
				serverName: 'implicit', //no idea - todo idea
				sendToServer: false
			},
			fidColumn: { // feature identifier column
				serverName: 'fidColumn', //string
				sendToServer: false //for now
			},
			nameColumn: { // feature name column
				serverName: 'nameColumn', //string
				sendToServer: false //for now
			},
			parentColumn: { // parent feature id column
				serverName: 'parentColumn', //string
				sendToServer: false //for now
			},
			columnMap: {
				serverName: 'columnMap', //object {column: string, attribute: id}
				sendToServer: true,
				transformForLocal: function (data) {
					if(data) {
						let ret = data.map(function(obj){
							return {
								column: obj.column,
								attribute: AttributeStore.getById(obj.attribute)
							};
						});
						return Promise.resolve(ret);
					}
					return Promise.resolve({});
				},
				transformForServer: function (model) {
					return []; // todo
				},
				isPromise: true,
				isArray: true
			}
		};
	}

}

export default ObjectRelationModel;

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
				serverName: 'layerType' // raster / vector / au ?unnecessary in this direction?
			},
			layerObject: {
				serverName: 'areaTemplate', //id
				transformForLocal: function (data) {
					return GeneralLayerStore.getById(data)
				},
				isPromise: true
			},
			attributeSet: {
				serverName: 'attributeSet', //id
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data)
				},
				isPromise: true
			},
			isOfAttributeSet: { // indicates relations of attribute set
				serverName: 'isData' //boolean
			},
			dataSource: {
				serverName: 'layer', //id
				transformForLocal: function (data) {
					return DataLayerStore.getById(data)
				},
				isPromise: true
			},
			dataSourceString: {
				serverName: 'layer' //id
			},
			place: {
				serverName: 'location', //id
				transformForLocal: function (data) {
					return PlaceStore.getById(data)
				},
				isPromise: true
			},
			period: {
				serverName: 'year', //id
				transformForLocal: function (data) {
					return PeriodStore.getById(data)
				},
				isPromise: true
			},
			implicit: {
				serverName: 'implicit' //no idea - todo idea
			},
			fidColumn: { // feature identifier column
				serverName: 'fidColumn' //string
			},
			nameColumn: { // feature name column
				serverName: 'nameColumn' //string
			},
			parentColumn: { // parent feature id column
				serverName: 'parentColumn' //string
			},
			columnMap: {
				serverName: 'columnMap', //object {column: string, attribute: id}
				transformForLocal: function (data) {
					return data.id.map(function(obj){
						return {
							column: obj.column,
							attribute: AttributeStore.getById(obj.attribute)
						};
					});
				},
				isPromise: true,
				isArray: true
			}
		};
	}

}

export default ObjectRelationModel;

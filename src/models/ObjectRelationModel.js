import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import DataLayerStore from '../stores/DataLayerStore';
import PlaceStore from '../stores/PlaceStore';
import PeriodStore from '../stores/PeriodStore';
import AttributeStore from '../stores/AttributeStore';
import AnalysisRunStore from '../stores/AnalysisRunStore';

import DataLayerModel from '../models/DataLayerModel';


class ObjectRelationModel extends Model {

	getType() {
		return ObjectTypes.OBJECT_RELATION;
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
			//layerType: {
			//	serverName: 'layerType' // raster / vector / au ?unnecessary in this direction?
			//},
			layerObject: {
				serverName: 'areaTemplate', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return GeneralLayerStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			attributeSet: {
				serverName: 'attributeSet', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			isOfAttributeSet: { // indicates relations of attribute set
				serverName: 'isData', //boolean
				sendToServer: true
			},
			dataSource: {
				serverName: 'layer', //id
				sendToServer: true,
				transformForLocal: this.transformDataSourceForLocal,
				transformForServer: this.transformDataSourceForServer.bind(this),
				isPromise: true
			},
			dataSourceString: {
				serverName: 'layer', //id
				sendToServer: false //temp local value only, until we can filter by nested key/value + backup of dataSource (when that gets nullified)
			},
			dataSourceOrigin: {
				serverName: 'dataSourceOrigin', // geonode / analyses / future whatever
				sendToServer: true,
				transformForLocal: function (data, serverObject) {
					if (data) {
						return data;
					} else {
						if (~serverObject.layer.indexOf("analysis:")) {
							return "analyses";
						} else {
							return "geonode";
						}
					}

				}
			},
			place: {
				serverName: 'location', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return PlaceStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			placeKey: {
				serverName: 'location', //id
				sendToServer: false //temp local value only, until we can filter by nested key/value
			},
			period: {
				serverName: 'year', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return PeriodStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			implicit: {
				serverName: 'implicit', //no idea - todo idea
				sendToServer: false
			},
			fidColumn: { // feature identifier column
				serverName: 'fidColumn', //string
				sendToServer: true
			},
			nameColumn: { // feature name column
				serverName: 'nameColumn', //string
				sendToServer: true
			},
			parentColumn: { // parent feature id column
				serverName: 'parentColumn', //string
				sendToServer: true
			},
			columnMap: {
				serverName: 'columnMap', //object {column: string, attribute: id}
				sendToServer: true,
				isArrayOfNested: true,
				model: {
					column: {
						serverName: 'column',
						sendToServer: true
					},
					attribute: {
						serverName: 'attribute',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeStore.getById(data)
						},
						transformForServer: this.getKey,
						isPromise: true
					}
				}
			}
		};
	}

	transformDataSourceForLocal (data) {
		if (~data.indexOf("analysis:")) {
			let id = data.split("_")[1];
			return AnalysisRunStore.getById(id); // todo process an_analysisRunId_auLevel
		} else {
			return DataLayerStore.getById(data)
		}
	}

	transformDataSourceForServer (model, relationModel) {
		if (model instanceof DataLayerModel) {
			return this.getKey(model);
		} else {
			return relationModel.dataSourceString;
		}

	}

}

export default ObjectRelationModel;

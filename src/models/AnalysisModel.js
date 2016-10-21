import Model from './Model';
import ObjectTypes from '../constants/ObjectTypes';
import UserStore from '../stores/UserStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import AttributeStore from '../stores/AttributeStore';

class AnalysisModel extends Model {

	getType() {
		return ObjectTypes.ANALYSIS;
	}

	data() {
		return {
			key: { // for all
				serverName: '_id', //number
				sendToServer: true
			},
			name: { // for all
				serverName: 'name', //string
				sendToServer: true
			},
			changed: { // for all
				serverName: 'changed', //date
				sendToServer: false,
				transformForLocal: this.transformDate
			},
			changedBy: { // for all
				serverName: 'changedBy', //id
				sendToServer: false,
				transformForLocal: function (data) {
					return UserStore.getById(data);
				},
				isPromise: true
			},
			created: { // for all
				serverName: 'created', //date
				sendToServer: false,
				transformForLocal: this.transformDate
			},
			createdBy: { // for all
				serverName: 'createdBy', //id
				sendToServer: false,
				transformForLocal: function (data) {
					return UserStore.getById(data);
				},
				isPromise: true
			},
			analysisType: { // for all
				serverName: 'type', // spatial, fid, math
				sendToServer: true,
				transformForLocal: function (data) {
					let ret = null;
					switch(data) {
						case "spatialagg":
							ret = "spatial";
							break;
						case "fidagg":
							ret = "level";
							break;
						case "math":
							ret = "math";
							break;
					}
					return ret;
				},
				transformForServer: function (data) {
					let ret = null;
					switch(data) {
						case "spatial":
							ret = "spatialagg";
							break;
						case "level":
							ret = "fidagg";
							break;
						case "math":
							ret = "math";
							break;
					}
					return ret;
				}
			},
			layerObject: { // for spatial
				serverName: 'areaTemplate', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return GeneralLayerStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			attributeSet: { // for spatial and math
				serverName: 'attributeSet', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			attributeSets: { // for fid and math
				serverName: 'attributeSets', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getFiltered({key: data});
				},
				transformForServer: this.getKeys,
				isPromise: true
			},
			filterAttribute: { // for spatial
				serverName: 'groupAttribute', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			filterAttributeSet: { // for spatial
				serverName: 'groupAttributeSet', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			useSum: { // for math
				serverName: 'useSum', //boolean
				sendToServer: true
			},
			attributeMap: { // for fid and spatial
				serverName: 'attributeMap', //object {column: string, attribute: id}
				sendToServer: true,
				isArrayOfNested: true,
				model: {
					attribute: {
						serverName: 'attribute',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					attributeSet: {
						serverName: 'attributeSet',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeSetStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					valueAttribute: {
						serverName: 'calcAttribute',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					valueAttributeSet: {
						serverName: 'calcAttributeSet',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeSetStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					filterValue: {
						serverName: 'groupVal',
						sendToServer: true
					},
					weightingAttribute: {
						serverName: 'normAttribute',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					weightingAttributeSet: {
						serverName: 'normAttributeSet',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeSetStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					operationType: { // todo rename to something more accurate?
						serverName: 'type', // possible values below
						sendToServer: true
					}
				}
			}
		};
	}

}

export default AnalysisModel;

/*
Operation types:

 Spatial:
 name: 'Count',
 type: 'count'

 name: 'Avg area/length',
 type: 'avgarea'

 name: 'Sum area/length',
 type: 'sumarea'

 name: 'Sum attribute',
 type: 'sumattr'

 name: 'Avg attribute (weight area/length)',
 type: 'avgattrarea'

 name: 'Avg attribute (weight attribute)',
 type: 'avgattrattr'


 FID:
 name: 'Sum area/length',
 type: 'sum'

 name: 'Avg (weight area/length)',
 type: 'avgarea'

 name: 'Avg (weight attribute)',
 type: 'avgattr'

 */

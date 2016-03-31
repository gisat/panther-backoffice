import Model from './Model';
import UserStore from '../stores/UserStore';
import TopicStore from '../stores/TopicStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import AttributeStore from '../stores/AttributeStore';

class AnalysisModel extends Model {

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
			topics: { // for all
				serverName: 'topics', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return TopicStore.getFiltered({key: data});
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
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
			attributeSet: { // for spatial
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
			groupAttribute: { // for spatial
				serverName: 'groupAttribute', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			groupAttributeSet: { // for spatial
				serverName: 'groupAttributeSet', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
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
					calcAttribute: {
						serverName: 'calcAttribute',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					calcAttributeSet: {
						serverName: 'calcAttributeSet',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeSetStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					groupVal: {
						serverName: 'groupVal',
						sendToServer: true
					},
					normAttribute: {
						serverName: 'normAttribute',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					normAttributeSet: {
						serverName: 'normAttributeSet',
						sendToServer: true,
						transformForLocal: function (data) {
							return AttributeSetStore.getById(data);
						},
						transformForServer: this.getKey,
						isPromise: true
					},
					operationType: { // todo rename to something more accurate?
						serverName: 'type', // 'sum' 'sumarea' 'avgarea' 'avgattrarea' + ?? (2 more)
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

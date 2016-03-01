import Model from './Model';
import UserStore from '../stores/UserStore';
import TopicStore from '../stores/TopicStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeSetStore from '../stores/AttributeSetStore';

import AttributeStore from '../stores/AttributeStore';

/*
		areaTemplate	Feature Layer Template (Spatial)
attributeMap	Attribute Grid (FID, Spatial)
		attributeSet	Result Attribute Set (Spatial)
attributeSets	Attribute Sets (FID, Math)
groupAttribute	Group Attribute (Spatial)
groupAttributeSet	Group AttributeSet (Spatial)
		name	Name (all)
 		topics	Topics for filtering Attribute Sets (all)
		type	Type (Spatial aggregation, Math, FID aggregation)
 */


class AnalysisModel extends Model {

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
			topics: {
				serverName: 'topics', //ids
				sendToServer: true,
				transformForLocal: function (data) {
					return TopicStore.getFiltered({key: data})
				},
				transformForServer: this.getKeys,
				isPromise: true,
				isArray: true
			},
			analysisType: {
				serverName: 'type', // spatial, fid, math
				sendToServer: true,
				transformForLocal: function (data) {
					//if(!data) { data = ""; } todo default value?
					return data;
				}
			},
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
			}
		};
	}

}

export default AnalysisModel;

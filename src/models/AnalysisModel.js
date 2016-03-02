import Model from './Model';
import UserStore from '../stores/UserStore';
import TopicStore from '../stores/TopicStore';
import GeneralLayerStore from '../stores/GeneralLayerStore';
import AttributeSetStore from '../stores/AttributeSetStore';
import AttributeStore from '../stores/AttributeStore';

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
					return TopicStore.getFiltered({key: data});
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
					return GeneralLayerStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			attributeSet: {
				serverName: 'attributeSet', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			attributeSets: {
				serverName: 'attributeSets', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getFiltered({key: data});
				},
				transformForServer: this.getKeys,
				isPromise: true
			},
			groupAttribute: {
				serverName: 'groupAttribute', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			groupAttributeSet: {
				serverName: 'groupAttributeSet', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return AttributeSetStore.getById(data);
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			attributeMap: {
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
						sendToServer: true,
						transformForLocal: function (data) {
							return data.split(",");
						},
						transformForServer: function (data) {
							return data.join();
						}
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
						serverName: 'type', //
						sendToServer: true,
						//transformForLocal: function (data) {
						//	// todo default value?
						//	return data;
						//},
						transformForServer: this.getKey,
						isPromise: true
					}
				}
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
					return UserStore.getById(data);
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
					return UserStore.getById(data);
				},
				isPromise: true
			}
		};
	}

}

export default AnalysisModel;

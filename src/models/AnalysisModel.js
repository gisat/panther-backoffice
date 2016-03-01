import Model from './Model';
import UserStore from '../stores/UserStore';

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

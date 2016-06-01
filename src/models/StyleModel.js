import Model from './Model';
import UserStore from '../stores/UserStore';
import TopicStore from '../stores/TopicStore';
//import AttributeStore from '../stores/AttributeStore';
//import AttributeSetStore from '../stores/AttributeSetStore';


class StyleModel extends Model {

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
			topic: {
				serverName: 'topic', //id
				sendToServer: true,
				transformForLocal: function (data) {
					return TopicStore.getById(data)
				},
				transformForServer: this.getKey,
				isPromise: true
			},
			source: {
				serverName: 'source', // string - definition/geoserver/?
				sendToServer: true,
				transformForLocal: function (data) {
					if (data) {
						return data;
					} else {
						return 'geoserver';
					}
				}
			},
			serverName: {
				serverName: 'symbologyName', //string
				sendToServer: true
			},
			definition: {
				serverName: 'definition',
				sendToServer: true,
				isNested: true,
				model: {
					type: {
						serverName: 'type', //string - polygon/line/point
						sendToServer: true
					},
					filterAttribute: {
						serverName: 'filterAttribute', //id
						sendToServer: true,
						//transformForLocal: function (data) {
						//	return AttributeStore.getById(data);
						//},
						//transformForServer: this.getKey,
						//isPromise: true
					},
					filterAttributeSet: {
						serverName: 'filterAttributeSet', //id
						sendToServer: true,
						//transformForLocal: function (data) {
						//	return AttributeSetStore.getById(data);
						//},
						//transformForServer: this.getKey,
						//isPromise: true
					},
					rules: {
						serverName: 'rules',
						sendToServer: true,
						isArrayOfNested: true,
						model: {
							name: {
								serverName: 'name',
								sendToServer: true
							},
							title: {
								serverName: 'title',
								sendToServer: true
							},
							filter: {
								serverName: 'filter', //string - csv
								sendToServer: true
							},
							appearance: {
								serverName: 'appearance',
								sendToServer: true,
								isNested: true,
								model: {
									fillColour: {
										serverName: 'fillColour', //hex
										sendToServer: true
									},
									strokeColour: {
										serverName: 'strokeColour', //hex
										sendToServer: true
									},
									strokeWidth: {
										serverName: 'strokeWidth', //number - 0.1
										sendToServer: true
									},
									shapeSize: {
										serverName: 'shapeSize', //number - 8
										sendToServer: true
									}
								}
							}
						}
					}
				}
			}
		};
	}

}

export default StyleModel;

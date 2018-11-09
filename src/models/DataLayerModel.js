import Model from './Model';


class DataLayerModel extends Model {

	data() {
		return {
			id: {
				serverName: 'id'
			},
			key: {
				serverName: 'path' //string
			},
			name: {
				serverName: 'name'
			},
			referenced: {
				serverName: 'referenced' //boolean
			},
			path: {
				serverName: 'path'
			},
			metadata: {
				serverName: 'metadata'
			},
			sourceUrl: {
				serverName: 'source_url'
			},
			geoserverWorkspace: {
				serverName: 'path', //string
				transformForLocal: function (data) {
					return data.split(":",2)[0];
				}
			}
			// todo ? WMS ?
			// todo ? layerref data ?
		};
	}

}

export default DataLayerModel;

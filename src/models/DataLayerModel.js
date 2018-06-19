import Model from './Model';


class DataLayerModel extends Model {

	data() {
		return {
			key: {
				serverName: 'id' //string
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

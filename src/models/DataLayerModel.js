import Model from './Model';


class DataLayerModel extends Model {

	data() {
		return {
			key: {
				serverName: 'name' //string
			},
			referenced: {
				serverName: 'referenced' //boolean
			},
			path: {
				serverName: 'path'
			},
			geoserverWorkspace: {
				serverName: 'name', //string
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

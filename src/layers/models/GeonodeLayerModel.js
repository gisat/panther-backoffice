import Model from '../../models/Model';


class GeonodeLayerModel extends Model {

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
		};
	}

}

export default GeonodeLayerModel;

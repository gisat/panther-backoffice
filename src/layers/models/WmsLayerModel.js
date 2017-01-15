import Model from '../../models/Model';

// On the server I need to establish some information about the WMS server, but it doesnt't apply here yet.
// There is a question about how do we exactly
class WmsLayerModel extends Model {

	data() {
		return {
			key: {
				serverName: 'name' //string
			},
			referenced: {
				serverName: 'referenced' //boolean
			},
			path: {
				serverName: 'path' // In this case it represents URL of the WMS service.
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

export default WmsLayerModel;

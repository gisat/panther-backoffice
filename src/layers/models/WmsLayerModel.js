import Model from '../../models/Model';

import ScopeStore from '../../stores/ScopeStore';
import PeriodStore from '../../stores/PeriodStore';
import PlaceStore from '../../stores/PlaceStore';

// On the server I need to establish some information about the WMS server, but it doesnt't apply here yet.
// There is a question about how do we exactly
class WmsLayerModel extends Model {

	data() {
		return {
			key: {
				serverName: 'name' //string
			},
			referenced: {
				serverName: 'referenced', //boolean
				sendToServer: false
			},
			url: {
				serverName: 'url' // In this case it represents URL of the WMS service.
			},
			scope: {
				serverName: 'scope',
				transformForLocal: function (data) {
					return ScopeStore.getById(data)
				},
				transformForServer: this.getKey
			},
			place: {
				serverName: 'place',
				transformForLocal: function (data) {
					return PlaceStore.getById(data)
				},
				transformForServer: this.getKey
			},
			period: {
				serverName: 'period',
				transformForLocal: function (data) {
					return PeriodStore.getById(data)
				},
				transformForServer: this.getKey
			}
		};
	}

}

export default WmsLayerModel;

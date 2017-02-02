import ActionTypes from '../constants/ActionTypes';

import AppDispatcher from '../../dispatcher/AppDispatcher';

let actionCreator = {
	updateGeonodeLayer(operationId, id, name, path) {
		let action = {
			type: ActionTypes.GEONODE_LAYER_UPDATE,
			data: {
				operationId: operationId,
				id: id,
				name: name,
				path: path
			}
		};

		AppDispatcher.dispatch(action);
	},

	deleteGeonodeLayer(operationId, id) {
		let action = {
			type: ActionTypes.GEONODE_LAYER_DELETE,
			data: {
				operationId: operationId,
				id: id
			}
		};

		AppDispatcher.dispatch(action);
	},

	loadGeonodeLayers(operationId) {
		let action = {
			type: ActionTypes.GEONODE_LAYER_LOAD,
			data: {
				operationId: operationId
			}
		};

		AppDispatcher.dispatch(action);
	},

	updateWmsLayer(operationId, layer) {
		let action = {
			type: ActionTypes.WMS_LAYER_UPDATE,
			data: {
				operationId: operationId,
				layer: layer
			}
		};

		AppDispatcher.dispatch(action);
	},

	deleteWmsLayer(operationId, id) {
		let action = {
			type: ActionTypes.WMS_LAYER_DELETE,
			data: {
				operationId: operationId,
				id: id
			}
		};

		AppDispatcher.dispatch(action);
	},

	loadWmsLayers(operationId) {
		let action = {
			type: ActionTypes.WMS_LAYER_LOAD,
			data: {
				operationId: operationId
			}
		};

		AppDispatcher.dispatch(action);
	}
};

export default actionCreator;
